---
title: Self-service exchanges and refunds for Azure Reservations
description: Learn how you can exchange or refund Azure Reservations. You must have owner access to the Reservation Order to exchange or refund reservations.
author: bandersmsft
ms.reviewer: primittal
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: how-to
ms.date: 01/22/2025
ms.author: banders
# customer intent: As a reservation purchaser, I want learn how to exchange or refund Azure reservations.
---

# Self-service exchanges and refunds for Azure Reservations

Azure Reservations provide flexibility to help meet your evolving needs. Reservation products are interchangeable with each other if they're the same type of reservation. For example, you can exchange multiple compute reservations including Azure Dedicated Host, Azure VMware Solution, and Azure Virtual Machines with each other all at once. You can also exchange multiple SQL database reservation types including SQL Managed Instances and Elastic Pool with each other. However, you can't exchange dissimilar reservations. For example, you can't exchange an Azure Cosmos DB reservation for SQL Database.

You can also exchange a reservation to purchase another reservation of a similar type in a different region. For example, you can exchange a reservation that's in West US 2 region for one that's in West Europe region.

## Reservation exchange policy changes

> [!NOTE]
> Initially planned to end on January 1, 2024, the availability of Azure compute reservation exchanges for Azure Virtual Machine, Azure Dedicated Host and Azure App Service was extended **until further notice**.
>
>Launched in October 2022, the [Azure savings plan for compute](https://azure.microsoft.com/pricing/offers/savings-plan-compute) aims at providing savings on consistent spend, across different compute services, regardless of region. With savings plan's automatic flexibility, we updated our reservations exchange policy. While [instance size flexibility for VMs](/azure/virtual-machines/reserved-vm-instance-size-flexibility) remains post-grace period, exchanges of instance series or regions for Azure Virtual Machine, Azure Dedicated Host and Azure App Service reservations will no longer be supported.
>
>You may continue [exchanging](exchange-and-refund-azure-reservations.md) your compute reservations for different instance series and regions until we notify you again, which will be **at least 6 months in advance**. In addition, any compute reservations purchased during this extended grace period will retain the right to **one more exchange after the grace period ends**. The extended grace period allows you to better assess your cost savings commitment needs and plan effectively. For more information, see [Changes to the Azure reservation exchange policy](reservation-exchange-policy-changes.md).
>
>You may [trade-in](../savings-plan/reservation-trade-in.md) your Azure Virtual Machine, Azure Dedicated Host and Azure App Service reservations that are used to cover dynamic/evolving workloads for a savings plan or may continue to use and purchase reservations for stable workloads where the specific configuration needs are known.
>
>For more information, see [Azure savings plan for compute and how it works with reservations](../savings-plan/decide-between-savings-plan-reservation.md).

When you exchange a reservation, you can change your term from one-year to three-year. Or, you can change the term from three-year to one-year.

Not all reservations are eligible for exchange. For example, you can't exchange the following reservations:

- Azure Databricks Pre-purchase plan
- Synapse Analytics Pre-purchase plan
- Red Hat plans
- SUSE Linux plans
- Microsoft Defender for Cloud Pre-Purchase Plan
- Microsoft Sentinel Pre-Purchase Plan

You can also refund reservations, but the sum total of all canceled reservation commitment in your billing scope (such as EA, Microsoft Customer Agreement - Billing Profile, and Microsoft Partner Agreement - Customer) can't exceed USD 50,000 in a 12 month rolling window.

*Microsoft is not currently charging early termination fees for reservation refunds. We might charge the fees for refunds made in the future. We currently don't have a date for enabling the fee.*

The following reservations aren't eligible for refunds:

- Azure Databricks Pre-purchase plan
- Synapse Analytics Pre-purchase plan
- Red Hat plans
- SUSE Linux plans
- Microsoft Defender for Cloud Pre-Purchase Plan
- Microsoft Sentinel Pre-Purchase Plan

## Prerequisites

**You must have owner or Reservation administrator access on the Reservation Order to exchange or refund an existing reservation**. You can [Add or change users who can manage a reservation](./manage-reserved-vm-instance.md#who-can-manage-a-reservation-by-default).


## How to exchange or refund an existing reservation

You can exchange your reservation from the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/ReservationsBrowseBlade).

1. Select the reservations that you want to refund and select **Exchange**.  
    :::image type="content" border="true" source="./media/exchange-and-refund-azure-reservations/exchange-refund-return.png" lightbox="./media/exchange-and-refund-azure-reservations/exchange-refund-return.png" alt-text="Screenshot showing reservations to return.":::
1. Select the VM product that you want to purchase and type a quantity. Make sure that the new purchase total is more than the return total. [Determine the right size before you purchase](/azure/virtual-machines/prepay-reserved-vm-instances#determine-the-right-vm-size-before-you-buy).  
    :::image type="content" border="true" source="./media/exchange-and-refund-azure-reservations/exchange-refund-select-purchase.png" lightbox="./media/exchange-and-refund-azure-reservations/exchange-refund-select-purchase.png" alt-text="Screenshot showing the VM product to purchase with an exchange.":::
1. Review and complete the transaction.  
    :::image type="content" border="true" source="./media/exchange-and-refund-azure-reservations/exchange-refund-confirm-exchange.png" lightbox="./media/exchange-and-refund-azure-reservations/exchange-refund-confirm-exchange.png" alt-text="Screenshot showing the VM product to purchase with an exchange, completing the return.":::

To refund a reservation, go into the Reservation that you're looking to cancel and select **Return**.

## Exchange multiple reservations

You can return similar types of reservations in one action.

When you exchange reservations, the new purchase currency amount must be greater than the refund amount. You can exchange any number of reservations for other allowed reservations if the currency amount is greater or equal to returned (exchanged) reservations. If your new purchase amount is less than the refund amount, an error message appears. If you see the error, reduce the quantity you want to return or increase the amount to purchase.

1. Sign in to the Azure portal and navigate to **Reservations**.
1. In the list of reservations, select the box for each reservation that you want to exchange.
1. At the top of the page, select **Exchange**.
1. If needed, revise the quantity to return for each reservation.
1. If you select the autofill return quantity, you can choose to **Refund all** to fill the list with the full quantity that you own for each reservation. Or, select **Optimize for utilization (7-day)** to fill the list with a quantity that optimizes for utilization based on the last seven days of usage. **Select Apply**.
1. At the bottom of the page, select **Next: Purchase**.
1. On the purchase tab, select the available products that you want to exchange for. You can select multiple products of different types.
1. In the Select the product you want to purchase pane, select the products you want and then select **Add to cart** and then select **Close**.
1. When done, select **Next: Review**.
1. Review your reservations to return and new reservations to purchase and then select **Confirm exchange**.

## Exchange nonpremium storage for premium storage or vice versa

You can exchange a reservation purchased for a VM size that doesn't support premium storage to a corresponding VM size that does and vice-versa. For example, an _F1_ for an _F1s_ or an _F1s_ for an _F1_. To make the exchange, go to Reservation Details and select **Exchange**. The exchange doesn't reset the term of the reserved instance or create a new transaction. Also, the new reservation will be for the same region, and there are no charges for this exchange.
If you're exchanging for a different size, series, region, or payment frequency, the term is reset for the new reservation. 

## How transactions are processed

Microsoft cancels the existing reservation. Then the pro-rated amount for that reservation is refunded. If there's an exchange, the new purchase is processed. Microsoft processes refunds using one of the following methods, depending on your account type and payment method.

### Enterprise Agreement customers

Money is added to the Azure Prepayment (previously called monetary commitment) for exchanges and refunds if the original purchase was made using one. If the Azure Prepayment term using the reservation was purchased is no longer active, then credit is added to your current enterprise agreement Azure Prepayment term. The credit is valid for 90 days from the date of refund. Unused credit expires at the end of 90 days.

If the original reservation purchase was made from an overage, the refund is returned to you as a partial credit note. The refund doesn’t affect the original or later invoices.

### Microsoft Customer Agreement customers

For customers that pay by wire transfer, the refunded amount is automatically applied to the next month’s invoice. The return or refund doesn't generate a new invoice.

For customers that pay by credit card, the refunded amount is returned to the credit card that was used for the original purchase. If you changed your card, [contact support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

### Pay-as-you-go invoice payments and CSP program

The original reservation purchase invoice is canceled and then a new invoice is created for the refund. For exchanges, the new invoice shows the refund and the new purchase. The refund amount is adjusted against the purchase. If you only refunded a reservation, then the prorated amount stays with Microsoft and it gets adjusted against a future reservation purchase. If you bought a reservation at pay-as-you-go rates and later move to a CSP, the reservation can be returned and repurchased without a penalty.

Although a CSP customer can’t exchange, cancel, renew, or refund a reservation themself, they can ask their partner to do it on their behalf.

### Pay-as-you-go credit card customers

The original invoice is canceled, and a new invoice is created. The money is refunded to the credit card that was used for the original purchase. If you changed your card, [contact support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Cancel, exchange, and refund policies

Azure has the following policies for cancellations, exchanges, and refunds.

**Exchange policies**

- You can return multiple existing reservations to purchase one new reservation of the same type. You can't exchange reservations of one type for another. For example, you can't return a VM reservation to purchase a SQL reservation. You can change a reservation property such as family, series, version, SKU, region, quantity, and term with an exchange.
- Only reservation owners can process an exchange. [Learn how to Add or change users who can manage a reservation](manage-reserved-vm-instance.md#who-can-manage-a-reservation-by-default).
- An exchange is processed as a refund and a repurchase – different transactions are created for the cancellation and the new reservation purchase. The prorated reservation amount is refunded for the reservations that's traded-in. You're charged fully for the new purchase. The prorated reservation amount is the daily prorated residual value of the reservation being returned.
- You can exchange or refund reservations even if the enterprise agreement used to purchase the reservation is expired and was renewed as a new agreement.
- The new reservation's lifetime commitment should equal or be greater than the returned reservation's remaining commitment. Example: for a three-year reservation that's 100 USD per month and exchanged after the 18th payment, the new reservation's lifetime commitment should be 1,800 USD or more (paid monthly or upfront).
- The new reservation purchased as part of exchange has a new term starting from the time of exchange.
- There's no penalty or annual limits for exchanges.
- As noted previously, through a grace period, you have the ability to exchange Azure compute reservations (Azure Reserved Virtual Machine Instances, Azure Dedicated Host reservations, and Azure App Services reservations) **until further notice**.

**Refund policies**

- We're currently not charging an early termination fee, but in the future there might be a 12% early termination fee for cancellations.
- The total canceled commitment can't exceed 50,000 USD in a 12-month rolling window for a billing profile or single enrollment. 
    - For example, assume you have a three-year reservation (36 months). 
        - It costs 100 USD per month. It gets refunded in the 12th month. 
        - The canceled commitment is 2,400 USD (for the remaining 24 months). 
        - After the refund, your new available limit for refund is 47,600 USD (50,000-2,400). 
        - In 365 days from the refund, the 47,600 USD limit increases by 2,400 USD. 
        - Your new pool is 50,000 USD. Any other reservation cancellation for the billing profile or EA enrollment depletes the same pool, and the same replenishment logic applies. 
        - This example also applies to the monthly payment method.
    - In another example, assume you bought a three-year reservation (36 months) with a monthly payment. 
        - It costs 3,000 USD per month for a total commitment of 108,000 USD. 
        - Because of the 50,000 USD cancellation threshold, you can’t cancel the reservation until you’ve spent 58,000 USD of your commitment. 
        - After spending 58,000 USD of your commitment, you have 50,000 remaining that you can cancel to apply to a refund or reservation exchange. 
        - This example also applies to the monthly payment method.
- Azure doesn't process any refund that exceeds the 50,000 USD limit in a 12-month window for a billing profile or EA enrollment.
    - Refunds that result from an exchange don't count against the refund limit.
- Refunds are calculated based on the lowest price of either your purchase price or the current price of the reservation.
- Only reservation order owners can process a refund. [Learn how to Add or change users who can manage a reservation](manage-reserved-vm-instance.md#who-can-manage-a-reservation-by-default).
- For CSP program, the 50,000 USD limit is per customer.

Let's look at an example with the previous points in mind. If you bought a 300,000 USD reservation, you can exchange it at any time for another reservation that equals or costs more (of the remaining reservation balance, not the original purchase price). For this example:
- There's no penalty or annual limits for exchanges. 
- The refund that results from the exchange doesn't count against the refund limit. 

## Need help? Contact us.

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Related content

- To learn how to manage a reservation, see [Manage Azure Reservations](manage-reserved-vm-instance.md).
- Learn about [Azure savings plan for compute](../savings-plan/index.yml)
- To learn more about Azure Reservations, see the following articles:
    - [What are Azure Reservations?](save-compute-costs-reservations.md)
    - [Manage Reservations in Azure](manage-reserved-vm-instance.md)
    - [Understand how the reservation discount is applied](../manage/understand-vm-reservation-charges.md)
    - [Understand reservation usage for your pay-as-you-go subscription](understand-reserved-instance-usage.md)
    - [Understand reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md)
    - [Windows software costs not included with reservations](reserved-instance-windows-software-costs.md)
    - [Azure Reservations in the CSP program](/partner-center/azure-reservations)
