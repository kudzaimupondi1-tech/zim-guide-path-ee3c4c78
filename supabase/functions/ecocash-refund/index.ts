import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
<<<<<<< HEAD
=======
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: corsHeaders });
  }

>>>>>>> b17f7b7 (Describe what changes you made)

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
<<<<<<< HEAD

    // Verify user is admin
=======
>>>>>>> b17f7b7 (Describe what changes you made)
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }
    const userId = claimsData.claims.sub as string;

<<<<<<< HEAD
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: isAdmin } = await adminClient.rpc("has_role", { _user_id: userId, _role: "admin" });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Admin access required" }), { status: 403, headers: corsHeaders });
    }

    const { payment_id, refund_notes } = await req.json();
    if (!payment_id) {
      return new Response(JSON.stringify({ error: "Missing payment_id" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Get payment details
    const { data: payment, error: paymentError } = await adminClient
      .from("payments")
      .select("*")
      .eq("id", payment_id)
      .single();

    if (paymentError || !payment) {
      return new Response(JSON.stringify({ error: "Payment not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (payment.status !== "completed") {
      return new Response(JSON.stringify({ error: "Only completed payments can be refunded" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (!payment.ecocash_reference || payment.ecocash_reference === "ADMIN_BYPASS") {
      // Admin bypass payments - just update status
      await adminClient.from("payments").update({
        refund_status: "approved",
        refund_notes: refund_notes || "Admin bypass refund",
        refunded_at: new Date().toISOString(),
        refunded_by: userId,
        status: "refunded",
      }).eq("id", payment_id);

      return new Response(JSON.stringify({ success: true, message: "Refund processed (admin bypass)" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Call EcoCash Refund API
    const ecocashRefundUrl = Deno.env.get("ECOCASH_API_URL")!.replace("/transactions/amount", "/transactions/refund");
=======
    // Parse body
    const body = await req.json();
    const {
      phone_number,
      amount,
      originalEcocashReference,
      referenceCode,
      remarks,
      university_count
    } = body;

    if (!phone_number || !amount || !originalEcocashReference || !referenceCode) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Format phone number (ensure 263 prefix)
    let formattedPhone = phone_number.replace(/\s+/g, "").replace(/^\+/, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "263" + formattedPhone.substring(1);
    }
    if (!formattedPhone.startsWith("263")) {
      formattedPhone = "263" + formattedPhone;
    }

    // Create refund record
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: refund, error: insertError } = await adminClient
      .from("refunds")
      .insert({
        user_id: userId,
        amount,
        currency: "USD",
        university_count,
        phone_number: formattedPhone,
        status: "pending",
        reference_code: referenceCode,
        original_ecocash_reference: originalEcocashReference,
        remarks: remarks || null,
      })
      .select()
      .single();
    if (insertError) throw insertError;

    // Call EcoCash Refund API
    const ecocashUrl = Deno.env.get("ECOCASH_REFUND_URL")!;
>>>>>>> b17f7b7 (Describe what changes you made)
    const username = Deno.env.get("ECOCASH_USERNAME")!;
    const password = Deno.env.get("ECOCASH_PASSWORD")!;
    const merchantCode = Deno.env.get("ECOCASH_MERCHANT_CODE")!;
    const merchantPin = Deno.env.get("ECOCASH_MERCHANT_PIN")!;
    const merchantNumber = Deno.env.get("ECOCASH_MERCHANT_NUMBER")!;
    const superMerchantName = Deno.env.get("ECOCASH_SUPER_MERCHANT_NAME")!;
    const merchantName = Deno.env.get("ECOCASH_MERCHANT_NAME")!;
<<<<<<< HEAD

    const refundClientCorrelator = `${Date.now()}${Math.floor(Math.random() * 10000)}`;
    const notifyUrl = `${supabaseUrl}/functions/v1/ecocash-notify`;

    const refundBody = {
      clientCorrelator: refundClientCorrelator,
      endUserId: payment.phone_number,
      notifyUrl,
      originalEcocashReference: payment.ecocash_reference,
      referenceCode: payment.reference_code,
      tranType: "MER",
      remarks: `Refund for ${payment.reference_code}`,
      transactionOperationStatus: "Charged",
      paymentAmount: {
        charginginformation: {
          amount: parseFloat(String(payment.amount)),
          currency: payment.currency,
          description: "EduGuide Refund",
=======
    const notifyUrl = `${supabaseUrl}/functions/v1/ecocash-notify`;

    const clientCorrelator = `${Date.now()}${Math.floor(Math.random() * 10000)}`;
    const refundBody = {
      clientCorrelator,
      endUserId: formattedPhone,
      notifyUrl,
      originalEcocashReference,
      referenceCode,
      tranType: "REF",
      remarks: remarks || `Refund for ${referenceCode}`,
      transactionOperationStatus: "Charged",
      paymentAmount: {
        charginginformation: {
          amount: parseFloat(amount),
          currency: "USD",
          description: `Reversal of ${originalEcocashReference}`,
>>>>>>> b17f7b7 (Describe what changes you made)
        },
        chargeMetaData: {
          channel: "WEB",
          purchaseCategoryCode: "Online Payment",
          onBeHalfOf: superMerchantName,
        },
      },
      merchantCode,
      merchantPin,
      merchantNumber,
<<<<<<< HEAD
      currencyCode: payment.currency,
=======
      currencyCode: "USD",
>>>>>>> b17f7b7 (Describe what changes you made)
      countryCode: "ZW",
      terminalID: "EDUGUIDE001",
      location: "ONLINE",
      superMerchantName,
      merchantName,
    };

    const basicAuth = btoa(`${username}:${password}`);
<<<<<<< HEAD
    const ecocashResponse = await fetch(ecocashRefundUrl, {
=======
    const ecocashResponse = await fetch(ecocashUrl, {
>>>>>>> b17f7b7 (Describe what changes you made)
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${basicAuth}`,
      },
      body: JSON.stringify(refundBody),
    });

<<<<<<< HEAD
    const ecocashData = await ecocashResponse.json();
    console.log("EcoCash refund response:", JSON.stringify(ecocashData));

    const refundStatus = ecocashData.transactionOperationStatus === "COMPLETED" ? "approved" : "pending";

    await adminClient.from("payments").update({
      refund_status: refundStatus,
      refund_notes: refund_notes || "",
      refunded_at: new Date().toISOString(),
      refunded_by: userId,
      status: refundStatus === "approved" ? "refunded" : payment.status,
      transaction_data: { ...((payment.transaction_data as Record<string, unknown>) || {}), refund_response: ecocashData },
    }).eq("id", payment_id);

    return new Response(JSON.stringify({
      success: true,
      refund_status: refundStatus,
      ecocash_response: ecocashData,
      message: refundStatus === "approved" ? "Refund completed" : "Refund initiated, awaiting confirmation",
=======
    let ecocashData;
    try {
      ecocashData = await ecocashResponse.json();
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid EcoCash response" }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Update refund record with EcoCash response
    await adminClient
      .from("refunds")
      .update({
        transaction_data: ecocashData,
        ecocash_reference: ecocashData.ecocashReference || null,
        status: ecocashData.transactionOperationStatus === "COMPLETED" ? "completed" : "pending",
      })
      .eq("id", refund.id);

    // Handle non-2xx EcoCash response
    if (!ecocashResponse.ok) {
      return new Response(JSON.stringify({ error: ecocashData.error || "EcoCash refund failed", details: ecocashData }), { status: ecocashResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({
      refund_id: refund.id,
      status: ecocashData.transactionOperationStatus || "pending",
      message: "Refund initiated. Await notification.",
>>>>>>> b17f7b7 (Describe what changes you made)
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("EcoCash refund error:", error);
<<<<<<< HEAD
    return new Response(JSON.stringify({ error: (error as Error).message || "Refund failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
=======
    return new Response(JSON.stringify({ error: error.message || "Internal server error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
>>>>>>> b17f7b7 (Describe what changes you made)
  }
});
