---
title: Self-service trade-in for Azure savings plans
titleSuffix: Microsoft Cost Management
description: Learn how you can trade in your reservations for an Azure saving plan.
author: bandersmsft
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: how-to
ms.date: 09/23/2022
ms.author: banders
---

# Self-service trade-in for Azure savings plans

Azure Savings Plans provide flexibility to help meet your evolving needs by providing discounted rates for VMs, dedicated hosts, container instances, Azure premium functions and Azure app services, across all supported regions. As a result, unlike reservations, savings plans don't support exchanges.

If you find that your Azure VMs, Dedicated Hosts, or Azure App Services reservations, don't provide the necessary flexibility you require, you can trade these reservations for a savings plan.

The ability to exchange Azure VM reservations will retire in the future. For more information, see [Self-service exchanges and refunds for Azure Reservations](../reservations/exchange-and-refund-azure-reservations.md).

When you trade in a reservation and purchase a savings plan, you can select a savings plan term of either one-year to three-year.

The following reservations aren't eligible to be traded in for savings plans:

- Azure Databricks reserved capacity
- Synapse Analytics Pre-purchase plan
- Azure VMware solution by CloudSimple
- Azure Red Hat Open Shift
- Red Hat plans
- SUSE Linux plans

> [!NOTE]
> - You must have owner access on the Reservation Order to trade in an existing reservation**. You can [Add or change users who can manage a savings plan](manage-savings-plan.md#who-can-manage-a-savings-plan-by-default).
> - Microsoft is not currently charging early termination fees for reservation trade ins. We might charge the fees made in the future. We currently don't have a date for enabling the fee.

## How to trade in an existing reservation

You can trade in your reservation from [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/ReservationsBrowseBlade).

1. Select the reservations that you want to refund and select **Exchange**.  
  :::image type="content" source="./media/reservation-trade-in/exchange-refund-return.png" alt-text="Screenshot showing the Exchange window." lightbox="./media/reservation-trade-in/exchange-refund-return.png" :::
2. Select **Savings Plan** as the product that you want to purchase. The savings plan commitment will be an hourly amount based on the remaining value of the reservation(s) that are traded in. You may increase this default commitment, but you may not reduce it, as it based on your return total.
3. Review and complete the transaction.

## How transactions are processed

The new savings plan is purchased and then the traded-in reservations are canceled. If the reservations were paid for upfront, we refund a pro-rated amount for the reservations. If the reservations were paid monthly, we refund a pro-rated amount for the current month and cancel any future payments. Microsoft processes refunds using one of the following methods, depending on your account type and payment method.

### Enterprise agreement customers

Money is added to the Azure Prepayment (previously called monetary commitment) for refunds if the original purchase was made using one. If the Azure Prepayment used to purchase the reservation is no longer active, then credit is added to your current enterprise agreement Azure Prepayment term. The credit is valid for 90 days from the date of refund. Unused credit expires at the end of 90 days.

If the original purchase was made as an overage, the original invoice on which the reservation was purchased and all later invoices are reopened and readjusted. Microsoft issues a credit memo for the refunds.

### Pay-as-you-go invoice payments and CSP program

The original reservation purchase invoice is canceled and then a new invoice is created for the refund. For exchanges, the new invoice shows the refund and the new purchase. The refund amount is adjusted against the purchase. If you only refunded a reservation, then the prorated amount stays with Microsoft and it's adjusted against a future reservation purchase. If you bought a reservation at pay-as-you-go rates and later move to a CSP, the reservation can be returned and repurchased without a penalty.

Although a CSP customer can't exchange, cancel, renew, or refund a reservation themself, they can ask their partner to do it on their behalf.

### Pay-as-you-go credit card customers

The original invoice is canceled, and a new invoice is created. The money is refunded to the credit card that was used for the original purchase. If you've changed your card, [contact support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Cancel, exchange, and refund policies

Azure has the following policies for cancellations, exchanges, and refunds.

### Exchange policies

- If you find Azure Reserved VM Instances don't provide the necessary flexibility you require, you can trade these reservations for a savings plan.
- When you trade-in a reservation and purchase a savings plan, you can select a savings plan term of either one-year to three-year.
- Only reservation owners can process a trade in. For more information, see [Who can manage a reservation by default](../reservations/view-reservations.md#who-can-manage-a-reservation-by-default).
- A trade-in is processed as a refund and a repurchase – different transactions are created for the cancellation and the new reservation purchase. The prorated reservation amount is refunded for the reservations that's traded-in. You're charged fully for the new purchase. The prorated reservation amount is the daily prorated residual value of the reservation being returned.
- You can trade in reservations even if the enterprise agreement used to purchase the reservation is expired and was renewed as a new agreement.
- The new savings plan's lifetime commitment should equal or be greater than the returned reservation's remaining commitment. Example: for a three-year reservation that's $100 per month and exchanged after the 18th payment, the new savings plan's total commitment should be $1,800 or more (paid monthly or upfront).
- The new savings plan purchased as part of trade in has a new term starting from the time of trade in.
- There's no penalty for trade ins. The ability to exchange Azure Reserved VM Instances will retire on October 18, 2023.

### Refund policies

- Savings plans can't be exchanged or refunded.

## Need help? Contact us.

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Next steps

- To learn how to manage a savings plan, see [Manage Azure savings plan](manage-savings-plan.md).
- To learn more about Azure saving plan, see the following articles:
  - [What are Azure savings plans?](savings-plan-compute-overview.md)
  - [How a savings plan discount is applied](discount-application.md)
  - [Understand savings plan usage for your Pay-As-You-Go subscription](usage-data-pay-as-you-go.md)
  - [Understand savings plan usage data for enterprise subscriptions](enterprise-usage-data.md)
  - [Software costs not included in savings plan](software-costs-not-included.md)
  - [View Azure savings plan as a Cloud Solution Provider](view-savings-plan-cloud-solution-provider.md)