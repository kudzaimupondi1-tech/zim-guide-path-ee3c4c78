<<<<<<< HEAD
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
=======
// EcoCash Query Transaction Endpoint
// GET /ecocash-query?endUserId=...&clientCorrelator=...
// Handles transaction status queries to EcoCash API
>>>>>>> b17f7b7 (Describe what changes you made)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
<<<<<<< HEAD
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }
    const userId = claimsData.claims.sub as string;

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: isAdmin } = await adminClient.rpc("has_role", { _user_id: userId, _role: "admin" });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Admin access required" }), { status: 403, headers: corsHeaders });
    }

    const { client_correlator, phone_number } = await req.json();
    if (!client_correlator) {
      return new Response(JSON.stringify({ error: "Missing client_correlator" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Format phone number
    let endUserId = phone_number || "";
    if (endUserId.startsWith("0")) endUserId = "263" + endUserId.substring(1);
    if (!endUserId.startsWith("263") && endUserId) endUserId = "263" + endUserId;

    // Query EcoCash API
    const baseUrl = Deno.env.get("ECOCASH_API_URL")!;
    // Transform charge URL to query URL pattern
    // Charge: .../payment/v1/transactions/amount
    // Query:  .../payment/v1/{endUserId}/transactions/amount/{clientCorrelator}
    const queryUrl = baseUrl.replace("/transactions/amount", `/${endUserId}/transactions/amount/${client_correlator}`);

    const username = Deno.env.get("ECOCASH_USERNAME")!;
    const password = Deno.env.get("ECOCASH_PASSWORD")!;
=======
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const endUserId = url.searchParams.get("endUserId");
    const clientCorrelator = url.searchParams.get("clientCorrelator");
    if (!endUserId || !clientCorrelator) {
      return new Response(JSON.stringify({ error: "Missing required query parameters" }), { status: 400, headers: corsHeaders });
    }

    const ecocashBaseUrl = Deno.env.get("ECOCASH_QUERY_BASE_URL")!;
    const username = Deno.env.get("ECOCASH_USERNAME")!;
    const password = Deno.env.get("ECOCASH_PASSWORD")!;
    const queryUrl = `${ecocashBaseUrl}/${endUserId}/transactions/amount/${clientCorrelator}`;
>>>>>>> b17f7b7 (Describe what changes you made)
    const basicAuth = btoa(`${username}:${password}`);

    const ecocashResponse = await fetch(queryUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${basicAuth}`,
      },
    });
<<<<<<< HEAD

    const ecocashData = await ecocashResponse.json();
    console.log("EcoCash query response:", JSON.stringify(ecocashData));

    // Also update our local record if status changed
    if (ecocashData.transactionOperationStatus) {
      let newStatus = "pending";
      if (ecocashData.transactionOperationStatus === "COMPLETED") newStatus = "completed";
      else if (ecocashData.transactionOperationStatus === "FAILED") newStatus = "failed";

      await adminClient.from("payments").update({
        status: newStatus,
        ecocash_reference: ecocashData.ecocashReference || null,
        transaction_data: ecocashData,
        updated_at: new Date().toISOString(),
      }).eq("client_correlator", client_correlator);
    }

    return new Response(JSON.stringify({
      success: true,
      transaction: ecocashData,
    }), {
=======
    const ecocashData = await ecocashResponse.json();

    return new Response(JSON.stringify(ecocashData), {
>>>>>>> b17f7b7 (Describe what changes you made)
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("EcoCash query error:", error);
<<<<<<< HEAD
    return new Response(JSON.stringify({ error: (error as Error).message || "Query failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
=======
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: corsHeaders });
>>>>>>> b17f7b7 (Describe what changes you made)
  }
});
