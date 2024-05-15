---
title: How a Microsoft Defender for Cloud prepurchase discount is applied
description: Learn how a Microsoft Defender for Cloud prepurchase discount applies to your usage. You can use Defender for Cloud prepurchased units at any time during the purchase term.
ms.topic: conceptual
ms.date: 05/15/2024
---

# How Microsoft Defender for Cloud prepurchase discount is applied

You can use prepurchased Microsoft Defender for Cloud commit units (MCU) at any time during the purchase term. Any Microsoft Defender for Cloud usage is deducted from the prepurchased MCUs automatically.

Unlike VMs, prepurchased units don't expire on an hourly basis. You can use them at any time during the term of the purchase. To get the prepurchase discounts, you don't need to redeploy or assign a prepurchased plan to your Microsoft Defender for Cloud workspaces for the usage.

The prepurchase discount applies only to Microsoft Defender for Cloud unit (MCU) usage. Other charges such as compute, storage, and networking are charged separately.

## Prepurchase discount application

Defender for Cloud prepurchase applies to all Defender for Cloud workloads and tiers. You can think of the prepurchase as a pool of prepaid Defender for Cloud commit units. Usage is deducted from the pool, regardless of the workload or tier. Usage is deducted according to the plan price.

For example, a customer purchases 5,000 Commit Units for a one-year term. With a 20% discount on Defender for Cloud products at this tier, they can apply it to services like D4Servers P2 and Defender CSPM plans.

## Determine plan use

To determine your MCU plan use, go to the Azure portal > **Reservations** and select the purchased Defender for Cloud plan. Your utilization to-date is shown with any remaining units. For more information about determining your reservation use, see the [Reservation usage](/azure/cost-management-billing/reservations/reservation-apis#see-reservation-usage) article.

## How discount application shows in usage data

When the prepurchase discount applies to your Defender for Cloud usage, on-demand charges appear as zero in the usage data. For more information about reservation costs and usage, see [Get Enterprise Agreement reservation costs and usage](/azure/cost-management-billing/reservations/understand-reserved-instance-usage-ea).

## Need help? Contact us

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Related content

- To learn more about prepurchasing Microsoft Defender for Cloud to save money, see [Optimize Microsoft Defender for Cloud costs with a prepurchase](prepay-reserved-capacity.md).
