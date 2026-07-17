/**
 * Handler for the 'billing.charge' Storeganise webhook event.
 * This event is typically triggered when a charge is processed or completed.
 */
export async function handleBillingCharge(payload: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    console.log("Processing Storeganise billing.charge event...");

    // Extract non-sensitive high-level identifiers for logging
    const paymentId = payload.paymentId || payload.payment_id || (payload.data && payload.data.paymentId);
    const status = payload.status || (payload.data && payload.data.status);
    const amount = payload.amount || (payload.data && payload.data.amount);

    console.log(`[billing.charge] Payment: ${paymentId || "unknown"}, Status: ${status || "unknown"}, Amount: ${amount || "unknown"}`);

    return {
      success: true,
      message: "billing.charge event processed successfully",
      data: {
        paymentId,
        status,
        processed: true,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error("Error in handleBillingCharge:", error instanceof Error ? error.message : "Unknown error");
    return {
      success: false,
      message: "Failed to process billing.charge event"
    };
  }
}
