---
title: Self-service trade-in for savings plans
titleSuffix: Microsoft Cost Management
description: Learn how you can trade in your reservations for a savings plan.
author: nwokolo
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.topic: how-to
ms.date: 07/22/2026
ms.author: onwokolo
---

# Self-service trade-in for savings plans

If your [Azure Virtual Machines](https://azure.microsoft.com/pricing/details/virtual-machines/windows/) (VM), [Dedicated Hosts](https://azure.microsoft.com/pricing/details/virtual-machines/dedicated-host/), or [Azure App Service](https://azure.microsoft.com/pricing/details/app-service/windows/) reservations don't provide the flexibility you need, trade them in for a compute savings plan. 
When you trade in compute reservations for a compute savings plan, you make a new commitment of either one year or three years.

In addition, if your [database reservations](https://azure.microsoft.com/products/category/databases) aren't sufficiently flexible, you can trade them in for a database savings plan. When you trade in database reservations for a database savings plan, you make a new commitment of one year.

Although you can trade in compute and database reservations for compute and database savings plans, respectively, you can't exchange a savings plan for a reservation or for another savings plan. You may only trade in up to 100 reservations at a time as part of a savings plan purchase.

Apart from [Azure Virtual Machines](https://azure.microsoft.com/pricing/details/virtual-machines/windows/), [Dedicated Hosts](https://azure.microsoft.com/pricing/details/virtual-machines/dedicated-host/), [Azure App Service](https://azure.microsoft.com/pricing/details/app-service/windows/) reservations, and [database reservations](https://azure.microsoft.com/products/category/databases), no other reservations or prepurchase plans are eligible for trade-in.

> [!NOTE]
> Starting February 1, 2027, reservations purchased after this date are no longer eligible for exchange if the corresponding service is supported by savings plans. This restriction includes Azure Virtual Machines, Azure App Service, Azure SQL Database, and similar services. Reservations purchased before February 1, 2027, retain the right to one final exchange.
>
> Any compute or database products that become eligible for savings plans after February 1, 2027, are also subject to the preceding restriction. This restriction means that the corresponding previously purchased reservations are exchangeable one final time.
>
> This restriction excludes the following:
>
> - Reservations for products or services that are deprecated and approaching end-of-life
> - Reservations for products and services that aren't covered by savings plans, such as Azure VMware Solution. If you have a reservation for Azure VMware Solution, this policy change doesn't affect it.
> - Cloud environments that don't currently support savings plans.
>
> [Instance size flexibility](../reservations/instance-size-flexibility.md) for virtual machines isn't affected by the change in exchange policy. The reservation cancellation policy isn't changing. The total canceled commitment can't exceed $50,000 in a 12-month rolling window for a billing profile or single enrollment. You can [trade in](reservation-trade-in.md) existing reservations that cover dynamic or evolving workloads for a savings plan. There's no change to trade-in policy.
>
> For more information, see [Azure savings plan for compute and how it works with reservations](../savings-plan/decide-between-savings-plan-reservation.md).

To trade in a reservation for a savings plan, you must meet the following criteria:

- You must be an owner of the Reservation Order containing the reservation you wish to trade in. To learn more, see [Grant access to individual reservations](../reservations/view-reservations.md#grant-access-to-individual-reservations).
- You must have the Savings plan purchaser role, or be an owner of the subscription you plan to use to purchase the savings plan.
    - EA Admin write permission or Billing profile contributor and higher, which are Cost Management + Billing permissions, are supported only for direct Savings plan purchases. They can't be used for savings plans purchases as a part of a reservation trade-in.

The new savings plan's total commitment must equal or be greater than the returned reservation's remaining commitment. For example, a three-year reservation that costs $100 per month and is exchanged after the 18th payment, the new savings plan's lifetime commitment must be $1,800 or more.

Microsoft isn't currently charging early termination fees for reservation trade-ins. We might charge the fees in the future. We currently don't have a date for enabling the fee.

## How to trade in an existing reservation

You can trade in your reservation from the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/ReservationsBrowseBlade). When you trade in reservations for a savings plan, Azure cancels your reservation, gives you a prorated refund, and cancels any future payments for reservations that were billed monthly. As part of a savings plan purchase, you can trade in up to 100 reservations.

1. Select the reservations that you want to trade in and select **Exchange**.  
  :::image type="content" source="./media/reservation-trade-in/exchange-refund-return.png" alt-text="Screenshot showing the Exchange window." lightbox="./media/reservation-trade-in/exchange-refund-return.png" :::
1. For each reservation order selected, enter the quantity of reservation instances you want to return. The bottom of the window shows the amount to refund. It also shows the value of future payments that are canceled, if applicable.
1. Select the type of savings plan that you want to purchase.
1. To complete the purchase, enter the necessary information. For more information, see [Buy a savings plan](buy-savings-plan.md#buy-a-savings-plan-in-the-azure-portal).

## Determine savings plan commitment needed to replace your reservation

During a reservation trade-in, the default hourly commitment for the savings plan is calculated using the remaining monetary value of the reservations that are being traded in. The resulting hourly commitment might not be a large enough benefit commitment to cover the virtual machines that were previously covered by the returned reservations. You can use the following steps to calculate the necessary savings plan hourly commitment to cover the reservations. As a savings plan is a flexible benefit, there isn't a guarantee that the savings plan benefit always gets applied to usage from the resources that were previously covered by the reservations. These steps assume 100% utilization of the reservations that are being traded in.

1. Follow the first six steps in [Estimate costs with the Azure pricing calculator](../manage/ea-pricing.md#estimate-costs-with-the-azure-pricing-calculator).
2. Search for the product that you want to return.
3. Select a savings plan term and operating system, if necessary.
4. Select **Upfront** as the payment option. You're using the annual cost only because it's easier to work with in this calculation example.
5. To determine the hourly commitment for the product, divide the upfront charge by:
    - 8,760 for a one-year savings plan
    - 26,280 for a three-year savings plan  
        :::image type="content" source="./media/reservation-trade-in/pricing-calculator-upfront-example.png" alt-text="Example screenshot showing the Azure pricing calculator upfront charge value example." lightbox="./media/reservation-trade-in/pricing-calculator-upfront-example.png" :::
1. Multiply the product's hourly commitment by the number of instances you're trading in.
1. Repeat steps 2-6 for all reservation products you're trading in.
1. Enter the total of the above steps as the hourly commitment, then **Add** to your cart.
1. Review and complete the transaction.

The preceding image's price is an example.

## Determine savings difference from reservations to a savings plan

To determine the cost savings difference when switching from reservations to a savings plan, use the following steps.

1. In the [Azure portal](https://portal.azure.com), navigate to **Reservations** to view your list of reservations.
1. Select the reservation that you want to trade in and select **Exchange**.
1. Under the **Essentials** section, select the **Reservation order ID**.
1. In the left menu, select **Payments**.
1. Depending on the payment schedule for the reservation, you're presented with either the monthly or full cost of the reservation. You need the monthly cost. If necessary, divide the value by either 12 or 36, depending on the reservation term.
1. Multiply the monthly cost of the reservation by the number of instances you want to return.
1. To determine the monthly cost of an equivalent savings plan, follow the first six steps in [Estimate costs with the Azure pricing calculator](../manage/ea-pricing.md#estimate-costs-with-the-azure-pricing-calculator).
1. Search for the product associated with the reservation that you want to return.
1. Select a savings plan term and operating system, if necessary.
1. Select **Monthly** as the payment option. It's the monthly cost of a savings plan providing 100% coverage to the resource that was previously covered by the reservation.  
    :::image type="content" source="./media/reservation-trade-in/pricing-calculator-monthly-example.png" alt-text="Example screenshot showing the Azure pricing calculator monthly charge value example." lightbox="./media/reservation-trade-in/pricing-calculator-monthly-example.png" :::
1. Multiply the monthly cost by the number of product instances that are currently covered by the reservations to return.

The preceding image's price is an example.

The result is the total monthly savings plan cost. The difference between the total monthly savings plan cost and the total monthly reservation cost is the extra cost incurred by moving resources covered by reservations to a savings plan.

The preceding process assumes 100% utilization of both the reservation and savings plan.

## How a reservation trade-in transaction is processed

The new savings plan is purchased and then the traded-in reservations are canceled. If you paid for the reservations upfront, Microsoft refunds a prorated amount for the reservations. If you paid for the reservations monthly, Microsoft refunds a prorated amount for the current month and cancels any future payments. Microsoft processes refunds by using one of the following methods, depending on your account type and payment method.

### Enterprise Agreement customers

Money is added to the Azure Prepayment (previously called monetary commitment) for refunds if the original purchase was made using one. If the Azure Prepayment used to purchase the reservation is no longer active, then credit is added to your current enterprise agreement Azure Prepayment term. The credit is valid for 90 days from the date of refund. Unused credit expires at the end of 90 days.

If the original reservation purchase was made from an overage, return the refund to you as a partial credit note. The refund doesn't affect the original or later invoices.

### Microsoft Customer Agreement customers (credit card)

The original invoice is canceled, and a new invoice is created. The money is refunded to the credit card that was used for the original purchase. If you changed your card, [contact support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Need help? Contact us.

If you have savings plan questions, contact your account team, or [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Temporarily, Microsoft only provides savings plan expert support requests in English.

## Next steps

- To learn how to manage a savings plan, see [Manage savings plan](manage-savings-plan.md).
- To learn more about savings plans, see the following articles:
  - [What are savings plans?](savings-plan-overview.md)
  - [How a savings plan discount is applied](discount-application.md)
  - [View savings plan cost and usage details](utilization-cost-reports.md)
  - [Software costs not included in savings plan](software-costs-not-included.md)
