---
title: Self-service trade-in for Azure savings plans
titleSuffix: Microsoft Cost Management
description: Learn how you can trade in your reservations for an Azure saving plan.
author: bandersmsft
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: reservations
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 10/24/2022
ms.author: banders
---

# Self-service trade-in for Azure savings plans

Azure savings plans provide flexibility to help meet your evolving needs by providing discounted rates for VMs, dedicated hosts, container instances, Azure premium functions and Azure app services, across all supported regions.

If you find that your Azure VMs, Dedicated Hosts, or Azure App Services reservations, don't provide the necessary flexibility you require, you can trade these reservations for a savings plan. When you trade-in a reservation and purchase a savings plan, you can select a savings plan term of either one-year to three-year.

Although you can return the above offerings for a savings plan, you can't exchange a savings plan for them or for another savings plan.

> [!NOTE]
> Exchanges will be unavailable for Azure reserved instances for compute services purchased on or after **January 1, 2024**. Azure savings plan for compute is designed to help you save broadly on predictable compute usage. The savings plan provides more flexibility needed to accommodate changes such as virtual machine series and regions. With savings plan providing the flexibility automatically, we’re adjusting our reservations exchange policy. You can continue to exchange VM sizes (with instance size flexibility) but we'll no longer support exchanging instance series or regions for Azure Reserved Virtual Machine Instances, Azure Dedicated Host reservations, and Azure App Services reservations. Until **December 31, 2023** you can trade-in your Azure reserved instances for compute for a savings plan. Or, you may continue to use and purchase reservations for those predictable, stable workloads where you know the specific configuration you’ll need and want additional savings. For more information, see [Self-service exchanges and refunds for Azure Reservations](../reservations/exchange-and-refund-azure-reservations.md).

The following reservations aren't eligible to be traded in for savings plans:

- Azure Databricks reserved capacity
- Synapse Analytics Pre-purchase plan
- Azure VMware solution by CloudSimple
- Azure Red Hat Open Shift
- Red Hat plans
- SUSE Linux plans

> [!NOTE]
> - You must have owner access on the Reservation Order to trade in an existing reservation. You can [Add or change users who can manage a savings plan](manage-savings-plan.md#who-can-manage-a-savings-plan).
> - Microsoft is not currently charging early termination fees for reservation trade ins. We might charge the fees made in the future. We currently don't have a date for enabling the fee.

## How to trade in an existing reservation

You can trade in your reservation from [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/ReservationsBrowseBlade). When you trade in VM reservations for a savings plan, we cancel your reservation, issue you a pro-rated refund for them, and cancel any future payments (for reservations that were billed monthly).

1. Select the reservations that you want to trade in and select **Exchange**.  
  :::image type="content" source="./media/reservation-trade-in/exchange-refund-return.png" alt-text="Screenshot showing the Exchange window." lightbox="./media/reservation-trade-in/exchange-refund-return.png" :::
1. For each reservation order selected, enter the quantity of reservation instances you want to return. The bottom of the window shows the amount that will be refunded. It also shows the value of future payments that will be canceled, if applicable.
1. Select **Compute Savings Plan** as the product that you want to purchase.
1. Enter a friendly name for the savings plan. Select the scope where the savings plan benefit will apply and select the term length. Scopes include shared, subscription, resource group, and management group.

By default, the hourly commitment is derived from the remaining value of the reservations that are traded in. Although it's the minimum hourly commitment you may make, it might not be a large enough benefit commitment to cover the VMs that were previously covered by the reservations that you're returning.

To determine the remaining commitment amount needed to cover your VMs:

1. Download your price sheet. For more information, see [View and download your Azure pricing](../manage/ea-pricing.md).
1. Search the price sheet for the 1-year or 3-year savings plan rate for VM products associated with the reservations that you're returning.
1. For each reservation, multiply the savings plan rate with the quantity you want to return.
1. Enter the total of the above step as the hourly commitment, then **Add** to your cart.
1. Review and complete the transaction.

## How transactions are processed

The new savings plan is purchased and then the traded-in reservations are canceled. If the reservations were paid for upfront, we refund a pro-rated amount for the reservations. If the reservations were paid monthly, we refund a pro-rated amount for the current month and cancel any future payments. Microsoft processes refunds using one of the following methods, depending on your account type and payment method.

### Enterprise agreement customers

Money is added to the Azure Prepayment (previously called monetary commitment) for refunds if the original purchase was made using one. If the Azure Prepayment used to purchase the reservation is no longer active, then credit is added to your current enterprise agreement Azure Prepayment term. The credit is valid for 90 days from the date of refund. Unused credit expires at the end of 90 days.

If the original purchase was made as an overage, the original invoice on which the reservation was purchased and all later invoices are reopened and readjusted. Microsoft issues a credit memo for the refunds.

### Microsoft Customer Agreement customers (credit card)

The original invoice is canceled, and a new invoice is created. The money is refunded to the credit card that was used for the original purchase. If you've changed your card, [contact support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Cancel, exchange, and refund policies

You can't cancel, exchange or refund a savings plan.

## Need help? Contact us.

If you have Azure savings plan for compute questions, contact your  account team, or [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Temporarily, Microsoft will only provide Azure savings plan for compute expert support requests in English.

## Next steps

- To learn how to manage a savings plan, see [Manage Azure savings plan](manage-savings-plan.md).
- To learn more about Azure saving plan, see the following articles:
  - [What are Azure savings plans?](savings-plan-compute-overview.md)
  - [How a savings plan discount is applied](discount-application.md)
  - [View Azure savings plan cost and usage details](utilization-cost-reports.md)
  - [Software costs not included in savings plan](software-costs-not-included.md)
