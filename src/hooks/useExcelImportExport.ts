import { useState } from 'react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

export interface ExcelColumn {
  key: string;
  header: string;
  required?: boolean;
}

// Normalize a header string for flexible matching
const normalizeHeader = (header: string): string => {
  if (!header) return "";
  return header
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9]/g, ""); // Remove non-alphanumeric
};

export function useExcelImportExport<T extends Record<string, any>>() {
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const exportToExcel = (
    data: T[],
    columns: ExcelColumn[],
    filename: string
  ) => {
    setIsExporting(true);
    try {
      const exportData = data.map((item) => {
        const row: Record<string, any> = {};
        columns.forEach((col) => {
          const value = item[col.key];
          if (Array.isArray(value)) {
            row[col.header] = value.join(', ');
          } else if (value === null || value === undefined) {
            row[col.header] = '';
          } else {
            row[col.header] = value;
          }
        });
        return row;
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

      const maxWidths = columns.map((col) => ({
        wch: Math.max(
          col.header.length,
          ...exportData.map((row) => String(row[col.header] || '').length)
        ) + 2,
      }));
      worksheet['!cols'] = maxWidths;

      XLSX.writeFile(workbook, `${filename}.xlsx`);
      toast.success(`Exported ${data.length} records to Excel`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  const importFromExcel = async (
    file: File,
    columns: ExcelColumn[],
    onImport: (data: Partial<T>[]) => Promise<void>
  ): Promise<void> => {
    setIsImporting(true);
    try {
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            
            // Read raw data as array of arrays to build dynamic column map
            const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
            
            if (!rawRows || rawRows.length < 2) {
              toast.error('Excel file is empty or has no data rows');
              setIsImporting(false);
              resolve();
              return;
            }

            // Find header row (scan first 10 rows)
            let headerRowIndex = -1;
            let columnMap: Record<string, number> = {};
            
            for (let i = 0; i < Math.min(10, rawRows.length); i++) {
              const row = rawRows[i];
              if (!row || !Array.isArray(row)) continue;
              
              const normalizedCells = row.map((cell) => normalizeHeader(String(cell || "")));
              const tempMap: Record<string, number> = {};
              let matchCount = 0;

              for (const col of columns) {
                const normalizedHeader = normalizeHeader(col.header);
                const normalizedKey = normalizeHeader(col.key);
                
                const colIndex = normalizedCells.findIndex((cell) =>
                  cell === normalizedHeader ||
                  cell === normalizedKey ||
                  cell.includes(normalizedHeader) ||
                  normalizedHeader.includes(cell) ||
                  cell.includes(normalizedKey)
                );

                if (colIndex !== -1) {
                  tempMap[col.key] = colIndex;
                  matchCount++;
                }
              }

              // Accept if we match at least the required columns or 50% of all columns
              const requiredCols = columns.filter(c => c.required);
              const requiredMatched = requiredCols.filter(c => tempMap[c.key] !== undefined).length;
              
              if (requiredMatched >= requiredCols.length || matchCount >= Math.ceil(columns.length * 0.4)) {
                headerRowIndex = i;
                columnMap = tempMap;
                break;
              }
            }

            // Fallback: if no header row found, try standard json parsing
            if (headerRowIndex === -1) {
              console.log('No header row matched, trying standard JSON parsing');
              const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, any>[];
              
              if (jsonData.length === 0) {
                toast.error('No data found in file. Please check column headers match the template.');
                setIsImporting(false);
                resolve();
                return;
              }

              // Try to map by matching keys from the JSON data
              const sampleRow = jsonData[0];
              const jsonKeys = Object.keys(sampleRow);
              
              const importData: Partial<T>[] = jsonData.map((row) => {
                const item: Record<string, any> = {};
                columns.forEach((col) => {
                  // Try exact header match first
                  let value = row[col.header];
                  
                  // Try key match
                  if (value === undefined) {
                    value = row[col.key];
                  }
                  
                  // Try case-insensitive match
                  if (value === undefined) {
                    const normalizedTarget = normalizeHeader(col.header);
                    const matchingKey = jsonKeys.find(k => normalizeHeader(k) === normalizedTarget);
                    if (matchingKey) value = row[matchingKey];
                  }
                  
                  // Try partial match
                  if (value === undefined) {
                    const normalizedTarget = normalizeHeader(col.header);
                    const normalizedKeyTarget = normalizeHeader(col.key);
                    const matchingKey = jsonKeys.find(k => {
                      const nk = normalizeHeader(k);
                      return nk.includes(normalizedTarget) || normalizedTarget.includes(nk) ||
                             nk.includes(normalizedKeyTarget) || normalizedKeyTarget.includes(nk);
                    });
                    if (matchingKey) value = row[matchingKey];
                  }

                  if (value !== undefined && value !== '' && value !== null) {
                    // Handle comma-separated arrays
                    if (typeof value === 'string' && value.includes(',') && 
                        (col.key.includes('skill') || col.key.includes('career') || col.key.includes('subject') || col.key.includes('path'))) {
                      item[col.key] = value.split(',').map((s: string) => s.trim());
                    } else {
                      item[col.key] = value;
                    }
                  }
                });
                return item as Partial<T>;
              });

              // Validate required fields
              const requiredColumns = columns.filter((col) => col.required);
              const validData = importData.filter((item) => {
                return !requiredColumns.some((col) => !item[col.key as keyof T]);
              });

              const invalidCount = importData.length - validData.length;
              if (invalidCount > 0) {
                toast.error(`${invalidCount} rows missing required fields were skipped`);
              }

              if (validData.length > 0) {
                await onImport(validData);
                toast.success(`Imported ${validData.length} records`);
              } else {
                toast.error('No valid data found. Check that required fields are filled.');
              }

              setIsImporting(false);
              resolve();
              return;
            }

            // Parse data rows using the column map
            const dataRows = rawRows.slice(headerRowIndex + 1);
            const importData: Partial<T>[] = [];

            for (const row of dataRows) {
              if (!row || !Array.isArray(row) || row.every(cell => cell === null || cell === undefined || cell === '')) {
                continue; // Skip empty rows
              }

              const item: Record<string, any> = {};
              let hasAnyValue = false;

              columns.forEach((col) => {
                const colIndex = columnMap[col.key];
                if (colIndex !== undefined && colIndex < row.length) {
                  const value = row[colIndex];
                  if (value !== undefined && value !== null && value !== '') {
                    hasAnyValue = true;
                    // Handle comma-separated arrays
                    if (typeof value === 'string' && value.includes(',') &&
                        (col.key.includes('skill') || col.key.includes('career') || col.key.includes('subject') || col.key.includes('path'))) {
                      item[col.key] = value.split(',').map((s: string) => s.trim());
                    } else {
                      item[col.key] = value;
                    }
                  }
                }
              });

              if (hasAnyValue) {
                importData.push(item as Partial<T>);
              }
            }

            // Validate required fields
            const requiredColumns = columns.filter((col) => col.required);
            const validData = importData.filter((item) => {
              return !requiredColumns.some((col) => !item[col.key as keyof T]);
            });

            const invalidCount = importData.length - validData.length;
            if (invalidCount > 0) {
              toast.error(`${invalidCount} rows missing required fields were skipped`);
            }

            if (validData.length > 0) {
              await onImport(validData);
              toast.success(`Imported ${validData.length} records`);
            } else {
              toast.error('No valid data found. Check that required fields are filled and column headers match the template.');
            }

            setIsImporting(false);
            resolve();
          } catch (error) {
            console.error('Import parse error:', error);
            toast.error('Failed to parse Excel file. Please use the template format.');
            setIsImporting(false);
            reject(error);
          }
        };

        reader.onerror = () => {
          toast.error('Failed to read file');
          setIsImporting(false);
          reject(new Error('Failed to read file'));
        };

        reader.readAsArrayBuffer(file);
      });
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import data');
      setIsImporting(false);
      throw error;
    }
  };

  const downloadTemplate = (columns: ExcelColumn[], filename: string) => {
    const templateRow: Record<string, string> = {};
    columns.forEach((col) => {
      templateRow[col.header] = col.required ? '(Required)' : '(Optional)';
    });

    const worksheet = XLSX.utils.json_to_sheet([templateRow]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

    const maxWidths = columns.map((col) => ({ wch: col.header.length + 10 }));
    worksheet['!cols'] = maxWidths;

    XLSX.writeFile(workbook, `${filename}_template.xlsx`);
    toast.success('Template downloaded');
  };

  return {
    exportToExcel,
    importFromExcel,
    downloadTemplate,
    isImporting,
    isExporting,
  };
}
