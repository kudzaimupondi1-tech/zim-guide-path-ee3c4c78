
-- Add more A-Level subject combinations
INSERT INTO subject_combinations (name, level, subjects, career_paths, description, is_active) VALUES
('Religious Studies and Divinity', 'A-Level', '["Divinity", "History", "English Literature"]', ARRAY['Pastor', 'Theologian', 'Counselor', 'Religious Education Teacher'], 'For students pursuing theology, ministry, and religious education careers.', true),
('Statistics and Business', 'A-Level', '["Mathematics", "Statistics", "Business Studies"]', ARRAY['Statistician', 'Data Analyst', 'Business Analyst', 'Actuary'], 'Combines statistical analysis with business knowledge for analytics careers.', true),
('Physical Education and Sciences', 'A-Level', '["Physical Education", "Biology", "Geography"]', ARRAY['Sports Scientist', 'PE Teacher', 'Physiotherapist', 'Sports Coach'], 'For students interested in sports science and physical education careers.', true),
('Fashion and Textile Design', 'A-Level', '["Fashion and Fabrics", "Art", "Business Studies"]', ARRAY['Fashion Designer', 'Textile Engineer', 'Costume Designer', 'Entrepreneur'], 'For creative students pursuing careers in fashion and textile industries.', true),
('Pure Mathematics and Physics', 'A-Level', '["Mathematics", "Further Mathematics", "Physics"]', ARRAY['Mathematician', 'Physicist', 'Engineer', 'Research Scientist'], 'Intensive mathematics pathway for engineering and pure science research.', true),
('Environmental and Earth Sciences', 'A-Level', '["Geography", "Biology", "Chemistry"]', ARRAY['Environmental Scientist', 'Geologist', 'Conservation Officer', 'Water Engineer'], 'For students interested in environmental conservation and earth sciences.', true),
('Economics and Accounting', 'A-Level', '["Economics", "Accounting", "Business Studies"]', ARRAY['Economist', 'Accountant', 'Financial Planner', 'Tax Consultant'], 'Strong foundation for careers in economics, finance, and accounting.', true),
('Sociology and Psychology', 'A-Level', '["Sociology", "Psychology", "English Literature"]', ARRAY['Social Worker', 'Psychologist', 'Counselor', 'HR Manager'], 'For students interested in understanding human behavior and social systems.', true),
('Tourism and Hospitality', 'A-Level', '["Geography", "Business Studies", "History"]', ARRAY['Tourism Manager', 'Hotel Manager', 'Tour Guide', 'Event Planner'], 'For students pursuing careers in tourism and hospitality management.', true),
('Agriculture and Business', 'A-Level', '["Agriculture", "Business Studies", "Economics"]', ARRAY['Agricultural Economist', 'Farm Manager', 'Agribusiness Consultant', 'Agricultural Officer'], 'Combines agricultural knowledge with business and economic principles.', true),
('Woodwork and Technical Drawing', 'A-Level', '["Design and Technology", "Mathematics", "Physics"]', ARRAY['Architect', 'Quantity Surveyor', 'Civil Engineer', 'Interior Designer'], 'Technical pathway for construction, design, and engineering careers.', true),
('History and Political Science', 'A-Level', '["History", "Sociology", "English Literature"]', ARRAY['Diplomat', 'Policy Analyst', 'Journalist', 'Lawyer'], 'For students interested in politics, governance, and international affairs.', true)
ON CONFLICT DO NOTHING;

-- Link careers to programs (batch 1: Healthcare)
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Medicine and Surgery%' AND c.name = 'Medical Doctor' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Nursing%' AND c.name = 'Nurse' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Nursing%' AND c.name = 'Midwife' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Pharmacy%' AND c.name = 'Pharmacist' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Dental%' AND c.name = 'Dentist' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Physiotherapy%' AND c.name = 'Physiotherapist' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Occupational Therapy%' AND c.name = 'Occupational Therapist' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Radiography%' AND c.name = 'Radiographer' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Medical Laboratory%' AND c.name = 'Medical Laboratory Scientist' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Optometr%' AND c.name = 'Optometrist' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE (p.name ILIKE '%Nutrition%' OR p.name ILIKE '%Dietetics%') AND c.name = 'Dietitian' ON CONFLICT DO NOTHING;

-- Batch 2: Law
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE (p.name ILIKE '%Laws%' OR p.name ILIKE '%LLB%') AND c.name = 'Lawyer' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE (p.name ILIKE '%Laws%' OR p.name ILIKE '%LLB%') AND c.name = 'Magistrate' ON CONFLICT DO NOTHING;

-- Batch 3: IT/CS
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE (p.name ILIKE '%Computer Science%' OR p.name ILIKE '%Software%' OR p.name ILIKE '%Information Technology%') AND c.name = 'Software Developer' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE (p.name ILIKE '%Computer Science%' OR p.name ILIKE '%Data Science%') AND c.name = 'Data Scientist' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE (p.name ILIKE '%Cyber%' OR p.name ILIKE '%Information Security%') AND c.name = 'Cybersecurity Analyst' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE (p.name ILIKE '%Computer%' OR p.name ILIKE '%Information Technology%') AND c.name = 'IT Support Specialist' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE (p.name ILIKE '%Computer%' OR p.name ILIKE '%Network%') AND c.name = 'Network Administrator' ON CONFLICT DO NOTHING;

-- Batch 4: Engineering
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Civil Engineering%' AND c.name = 'Civil Engineer' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Electrical%' AND c.name = 'Electrical Engineer' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Mechanical%' AND c.name = 'Mechanical Engineer' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Chemical Engineering%' AND c.name = 'Chemical Engineer' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Mining%' AND c.name = 'Mining Engineer' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Industrial Engineering%' AND c.name = 'Industrial Engineer' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Biomedical Engineering%' AND c.name = 'Biomedical Engineer' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE (p.name ILIKE '%Telecommunication%' OR p.name ILIKE '%Electronic%') AND c.name = 'Telecommunications Engineer' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Aeronautical%' AND c.name = 'Pilot' ON CONFLICT DO NOTHING;

-- Batch 5: Finance/Accounting
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Accounting%' AND c.name = 'Accountant' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE (p.name ILIKE '%Accounting%' OR p.name ILIKE '%Audit%') AND c.name = 'Auditor' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE (p.name ILIKE '%Finance%' OR p.name ILIKE '%Banking%') AND c.name = 'Financial Analyst' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Banking%' AND c.name = 'Banker' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Banking%' AND c.name = 'Bank Manager' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Actuarial%' AND c.name = 'Actuary' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Fiscal%' AND c.name = 'Tax Consultant' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE (p.name ILIKE '%Insurance%' OR p.name ILIKE '%Risk Management%') AND c.name = 'Insurance Agent' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Marketing%' AND c.name = 'Marketing Manager' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Economics%' AND c.name = 'Economist' ON CONFLICT DO NOTHING;

-- Batch 6: Agriculture, Education, Media, etc.
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Agricultur%' AND c.name = 'Agricultural Officer' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE (p.name ILIKE '%Agricultural%' AND p.name ILIKE '%Econom%') AND c.name = 'Agricultural Economist' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE (p.name ILIKE '%Education%' OR p.name ILIKE '%B.Ed%') AND c.name = 'Secondary School Teacher' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE (p.name ILIKE '%Education%' AND (p.name ILIKE '%Junior%' OR p.name ILIKE '%Early%')) AND c.name = 'Primary School Teacher' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE (p.name ILIKE '%Journalism%' OR p.name ILIKE '%Media%') AND c.name = 'Journalist' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE (p.name ILIKE '%Film%' OR p.name ILIKE '%Television%') AND c.name = 'Film Producer' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Architecture%' AND c.name = 'Architect' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Quantity Surveying%' AND c.name = 'Quantity Surveyor' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Social Work%' AND c.name = 'Social Worker' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Psychology%' AND c.name = 'Psychologist' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Environmental%' AND c.name = 'Environmental Scientist' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Geolog%' AND c.name = 'Geologist' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Statistic%' AND c.name = 'Statistician' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Food Science%' AND c.name = 'Food Scientist' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE (p.name ILIKE '%Culinary%' OR p.name ILIKE '%Hotel Catering%') AND c.name = 'Chef' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Tourism%' AND c.name = 'Tourism Manager' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE (p.name ILIKE '%Management%' OR p.name ILIKE '%Business%') AND c.name = 'Entrepreneur' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Human Capital%' AND c.name = 'Human Resources Manager' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Library%' AND c.name = 'Librarian' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE (p.name ILIKE '%Biotechnology%' OR p.name ILIKE '%Biological Sciences%') AND c.name = 'Research Scientist' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE (p.name ILIKE '%International Affairs%' OR p.name ILIKE '%Conflict%') AND c.name = 'Diplomat' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE (p.name ILIKE '%Government%' OR p.name ILIKE '%Public Management%') AND c.name = 'Policy Analyst' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE (p.name ILIKE '%Creative Design%' OR p.name ILIKE '%Fine Arts%') AND c.name = 'Graphic Designer' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Theology%' AND c.name = 'Secondary School Teacher' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Veterinar%' AND c.name = 'Veterinarian' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE (p.name ILIKE '%Geomatics%' AND p.name ILIKE '%Surveying%') AND c.name = 'Surveyor' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Public Health%' AND c.name = 'Medical Doctor' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE (p.name ILIKE '%Culinary%' OR p.name ILIKE '%Hospitality%') AND c.name = 'Hotel Manager' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE (p.name ILIKE '%Media%' AND p.name ILIKE '%Marketing%') AND c.name = 'Public Relations Officer' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Meteorolog%' AND c.name = 'Meteorologist' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Criminology%' AND c.name = 'Police Officer' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Forensic Accounting%' AND c.name = 'Auditor' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Development Studies%' AND c.name = 'Policy Analyst' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE p.name ILIKE '%Development Studies%' AND c.name = 'Social Worker' ON CONFLICT DO NOTHING;
INSERT INTO program_careers (program_id, career_id)
SELECT p.id, c.id FROM programs p, careers c WHERE (p.name ILIKE '%Education%' AND p.name ILIKE '%Leadership%') AND c.name = 'Education Administrator' ON CONFLICT DO NOTHING;
