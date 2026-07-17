import { NextRequest } from "next/server";
import crypto from "crypto";

/**
 * Verifies the signature of the webhook request from Storeganise.
 * If STOREGANISE_WEBHOOK_SECRET is not configured in environment variables,
 * it will bypass validation with a warning to prevent service disruption.
 */
export async function verifySignature(req: NextRequest, rawBody: string): Promise<boolean> {
  const webhookSecret = process.env.STOREGANISE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    // If not configured, we log a warning and let it pass so the integration doesn't break.
    console.warn("STOREGANISE_WEBHOOK_SECRET is not defined. Bypassing webhook signature verification.");
    return true;
  }

  try {
    // Storeganise typically sends the signature in a header such as 'x-storeganise-signature' or 'x-signature'
    const signature = req.headers.get("x-storeganise-signature") || req.headers.get("x-signature");
    
    if (!signature) {
      console.error("Webhook verification failed: Signature header is missing.");
      return false;
    }

    const computedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    // Secure comparison to prevent timing attacks
    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(computedSignature, "hex")
    );

    if (!isValid) {
      console.error("Webhook verification failed: Invalid signature.");
    }

    return isValid;
  } catch (error) {
    // Log the error securely without showing credentials
    console.error("Error during webhook signature verification:", error instanceof Error ? error.message : "Unknown error");
    return false;
  }
}
