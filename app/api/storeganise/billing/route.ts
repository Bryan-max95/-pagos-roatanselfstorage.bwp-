import { NextRequest, NextResponse } from "next/server";
import { verifySignature } from "../../../../lib/storeganise/verify-signature";
import { parseEvent } from "../../../../lib/storeganise/parse-event";
import { handleBillingList } from "../../../../lib/storeganise/billing-list";
import { handleBillingCheckout } from "../../../../lib/storeganise/billing-checkout";
import { handleBillingCharge } from "../../../../lib/storeganise/billing-charge";

/**
 * GET handler for diagnostics.
 * Used to verify the billing route is active and responsive.
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "Storeganise billing endpoint"
  }, { status: 200 });
}

/**
 * POST handler for Storeganise billing webhook events.
 * Identifies, validates, and distributes billing events to corresponding sub-handlers.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Read the original raw body text (necessary for valid HMAC signature checking)
    const rawBody = await req.text();

    // 2. Validate the request signature
    const isValid = await verifySignature(req, rawBody);
    if (!isValid) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing webhook signature" },
        { status: 401 }
      );
    }

    // Parse payload safely
    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch (parseErr) {
      console.error("Failed to parse request body JSON");
      return NextResponse.json(
        { error: "Bad Request: Invalid JSON payload" },
        { status: 400 }
      );
    }

    // 3. Identify the event type
    const eventType = parseEvent(payload);
    if (!eventType) {
      console.warn("Received Storeganise payload with missing or invalid event type");
      return NextResponse.json(
        { success: false, error: "Missing event type in payload" },
        { status: 400 }
      );
    }

    // 4. Execute the corresponding handler
    let result: { success: boolean; message: string; data?: any };

    switch (eventType) {
      case "billing.list":
        result = await handleBillingList(payload);
        break;
      
      case "billing.checkout":
        result = await handleBillingCheckout(payload);
        break;
      
      case "billing.charge":
        result = await handleBillingCharge(payload);
        break;

      default:
        // For unhandled/supported events, return 200/202 to avoid webhook retries from the source system.
        console.info(`Received unsupported or unhandled event type: ${eventType}`);
        return NextResponse.json({
          success: true,
          message: `Webhook event '${eventType}' is not currently handled by this endpoint`
        }, { status: 202 });
    }

    // 5. Return the handler's response
    return NextResponse.json({
      success: result.success,
      message: result.message,
      data: result.data
    }, { status: result.success ? 200 : 500 });

  } catch (error) {
    // Log errors safely without exposing credentials or internal application states
    const errorMessage = error instanceof Error ? error.message : "An unexpected server error occurred";
    console.error("Critical error in Storeganise billing webhook router:", errorMessage);
    
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
