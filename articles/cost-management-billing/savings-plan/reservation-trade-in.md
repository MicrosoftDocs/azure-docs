---
title: Self-service trade-in for Azure savings plans
titleSuffix: Microsoft Cost Management
description: Learn how you can trade in your reservations for an Azure saving plan.
author: bandersmsft
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.topic: how-to
ms.date: 01/07/2025
ms.author: banders
---

# Self-service trade-in for Azure savings plans

If your [Azure Virtual Machines](https://azure.microsoft.com/pricing/details/virtual-machines/windows/) (VM), [Dedicated Hosts](https://azure.microsoft.com/pricing/details/virtual-machines/dedicated-host/), or [Azure App Service](https://azure.microsoft.com/pricing/details/app-service/windows/) reservations, don't provide the necessary flexibility you need, you can trade them for a savings plan. When you trade-in a reservation and purchase a savings plan, you can select a savings plan term of either one-year to three-year.

Although you can return the above offerings for a savings plan, you can't exchange a savings plan for them or for another savings plan. Due to technical limitations, you can only trade in up to 100 reservations at a time as part of a savings plan purchase.

Apart from [Azure Virtual Machines](https://azure.microsoft.com/pricing/details/virtual-machines/windows/), [Dedicated Hosts](https://azure.microsoft.com/pricing/details/virtual-machines/dedicated-host/), or [Azure App Service](https://azure.microsoft.com/pricing/details/app-service/windows/) reservations, no other reservations, or prepurchase plans are eligible for trade-in.

>[!NOTE]
> Initially planned to end on January 1, 2024, the availability of Azure compute reservation exchanges for Azure Virtual Machine, Azure Dedicated Host and Azure App Service has been extended **until further notice**.
>
> Launched in October 2022, the [Azure savings plan for compute](https://azure.microsoft.com/pricing/offers/savings-plan-compute) aims at providing savings on consistent spend, across different compute services, regardless of region. With savings plan's automatic flexibility, we've updated our reservations exchange policy. While [instance size flexibility](/azure/virtual-machines/reserved-vm-instance-size-flexibility) for VMs remains post-grace period, exchanges of instance series or regions for Azure Virtual Machine, Azure Dedicated Host and Azure App Service reservations will no longer be supported.
>
> You may continue [exchanging](../reservations/exchange-and-refund-azure-reservations.md) your compute reservations for different instance series and regions until we notify you again, which will be **at least 6 months in advance**. In addition, any compute reservations purchased during this extended grace period will retain the right to **one more exchange after the grace period ends**. The extended grace period allows you to better assess your cost savings commitment needs and plan effectively. For more information, see [Changes to the Azure reservation exchange policy](../reservations/reservation-exchange-policy-changes.md).
>
> You may trade-in your Azure Virtual Machine, Azure Dedicated Host and Azure App Service reservations that are used to cover dynamic/evolving workloads for a savings plan or may continue to use and purchase reservations for stable workloads where the specific configuration needs are known.
>
> For more information, see [Self-service exchanges and refunds for Azure Reservations](../reservations/exchange-and-refund-azure-reservations.md).

Although compute reservation exchanges become unavailable at the end of the grace period, noncompute reservation exchanges are unchanged. You're able to continue to trade-in reservations for saving plans.​ To trade-in a reservation for a savings plan, you must meet the following criteria: 

- You must be an owner of the Reservation Order containing the reservation you wish to trade in. To learn more, see [Grant access to individual reservations](../reservations/view-reservations.md#grant-access-to-individual-reservations).
- You must have the Savings plan purchaser role, or an owner of the subscription you plan to use to purchase the savings plan.
    - EA Admin write permission or Billing profile contributor and higher, which are Cost Management + Billing permissions, are supported only for direct Savings plan purchases. They can't be used for savings plans purchases as a part of a reservation trade-in.

The new savings plan's total commitment must equal or be greater than the returned reservation's remaining commitment. For example, a three-year reservation that costs $100 per month and is exchanged after the 18th payment, the new savings plan's lifetime commitment must be $1,800 or more.

Microsoft isn't currently charging early termination fees for reservation trade ins. We might charge the fees made in the future. We currently don't have a date for enabling the fee.

## How to trade in an existing reservation

You can trade in your reservation from [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/ReservationsBrowseBlade). When you trade in VM reservations for a savings plan, we cancel your reservation, issue you a pro-rated refund for them, and cancel any future payments (for reservations that were billed monthly). As part of a savings plan purchase, you can trade in up to 100 reservations.

1. Select the reservations that you want to trade in and select **Exchange**.  
  :::image type="content" source="./media/reservation-trade-in/exchange-refund-return.png" alt-text="Screenshot showing the Exchange window." lightbox="./media/reservation-trade-in/exchange-refund-return.png" :::
1. For each reservation order selected, enter the quantity of reservation instances you want to return. The bottom of the window shows the amount to refund. It also shows the value of future payments that are canceled, if applicable.
1. Select **Compute Savings Plan** as the product that you want to purchase.
1. To complete the purchase, enter the necessary information. For more information, see [Buy a savings plan](buy-savings-plan.md#buy-a-savings-plan-in-the-azure-portal).

## Determine savings plan commitment needed to replace your reservation

During a reservation trade-in, the default hourly commitment for the savings plan is calculated using the remaining monetary value of the reservations that are being traded in. The resulting hourly commitment might not be a large enough benefit commitment to cover the virtual machines that were previously covered by the returned reservations. You can use the following steps to calculate the necessary savings plan hourly commitment to cover the reservations. As savings plan is a flexible benefit. There isn’t a guarantee that the savings plan benefit always gets applied to usage from the resources that were previously covered by the reservations. These steps assume 100% utilization of the reservations that are being traded in. 

1. Follow the first six steps in [Estimate costs with the Azure pricing calculator](../manage/ea-pricing.md#estimate-costs-with-the-azure-pricing-calculator).
2. Search for the product that you want to return.
3. Select a savings plan term and operating system, if necessary.
4. Select **Upfront** as the payment option. You're using the annual cost only because it's easier to work with in this calculation example.
5. To determine the hourly commitment for the product, divide the upfront compute charge by:
    - 8,760 for a one-year savings plan
    - 26,280 for a three-year savings plan  
        :::image type="content" source="./media/reservation-trade-in/pricing-calculator-upfront-example.png" alt-text="Example screenshot showing the Azure pricing calculator upfront compute charge value example." lightbox="./media/reservation-trade-in/pricing-calculator-upfront-example.png" :::
1. Multiply the product’s hourly commitment by the number of instances you're trading-in.
1. Repeat steps 2-6 for all reservation products you're trading-in.
1. Enter the total of the above steps as the hourly commitment, then **Add** to your cart.
1. Review and complete the transaction.

The preceding image's price is an example.

## Determine savings difference from reservations to a savings plan

To determine the cost savings difference when switching from reservations to a savings plan, use the following steps.

1. In the [Azure portal](https://portal.azure.com), navigate to **Reservations** to view your list of reservations.
1. Select the reservation that you want to trade in and select **Exchange**.
1. Under the Essentials section, select the **Reservation order ID**.
1. In the left menu, select **Payments**.
1. Depending on the payment schedule for the reservation, you're presented with either the monthly or full cost of the reservation. You need the monthly cost. If necessary, divide the value by either 12 or 36, depending on the reservation term.
1. Multiply the monthly cost of the reservation by the number of instances you want to return.
1. To determine the monthly cost of an equivalent savings plan, follow the first six steps in [Estimate costs with the Azure pricing calculator](../manage/ea-pricing.md#estimate-costs-with-the-azure-pricing-calculator).
1. Search for the compute product associated with the reservation that you want to return.
1. Select savings plan term and operating system, if necessary.
1. Select **Monthly** as the payment option. It's the monthly cost of a savings plan providing 100% coverage to the resource that was previously covered by the reservation.  
    :::image type="content" source="./media/reservation-trade-in/pricing-calculator-monthly-example.png" alt-text="Example screenshot showing the Azure pricing calculator monthly compute charge value example." lightbox="./media/reservation-trade-in/pricing-calculator-monthly-example.png" :::
1.	Multiply the monthly cost by the number of product instances that are currently covered by the reservations to be returned.

The preceding image's price is an example.

The result is the total monthly savings plan cost. The difference between the total monthly savings plan cost minus the total monthly reservation cost is the extra cost incurred by moving resources covered by reservations to a savings plan.

The preceding process assumes 100% utilization of both the reservation and savings plan.

## How a reservation trade-in transaction is processed

The new savings plan is purchased and then the traded-in reservations are canceled. If the reservations were paid for upfront, we refund a pro-rated amount for the reservations. If the reservations were paid monthly, we refund a pro-rated amount for the current month and cancel any future payments. Microsoft processes refunds using one of the following methods, depending on your account type and payment method.

### Enterprise agreement customers

Money is added to the Azure Prepayment (previously called monetary commitment) for refunds if the original purchase was made using one. If the Azure Prepayment used to purchase the reservation is no longer active, then credit is added to your current enterprise agreement Azure Prepayment term. The credit is valid for 90 days from the date of refund. Unused credit expires at the end of 90 days.

If the original purchase was made as an overage, the original invoice on which the reservation was purchased and all later invoices are reopened and readjusted. Microsoft issues a credit memo for the refunds.

### Microsoft Customer Agreement customers (credit card)

The original invoice is canceled, and a new invoice is created. The money is refunded to the credit card that was used for the original purchase. If you changed your card, [contact support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Need help? Contact us.

If you have Azure savings plan for compute questions, contact your  account team, or [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Temporarily, Microsoft only provides Azure savings plan for compute expert support requests in English.

## Next steps

- To learn how to manage a savings plan, see [Manage Azure savings plan](manage-savings-plan.md).
- To learn more about Azure saving plan, see the following articles:
  - [What are Azure savings plans?](savings-plan-compute-overview.md)
  - [How a savings plan discount is applied](discount-application.md)
  - [View Azure savings plan cost and usage details](utilization-cost-reports.md)
  - [Software costs not included in savings plan](software-costs-not-included.md)
