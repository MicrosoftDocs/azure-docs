---
title: Azure EA VM reserved instances
description: This article summaries how Azure reservations for VM reserved instances can help you save your money with your enterprise enrollment.
author: bandersmsft
ms.author: banders
ms.date: 11/29/2022
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: enterprise
ms.reviewer: sapnakeshari
---

# Azure EA VM reserved instances

This article summaries how Azure reservations for VM reserved instances can help you save your money with your enterprise enrollment. For more information about reservations, see [What are Azure Reservations?](../reservations/save-compute-costs-reservations.md).

## Reservation exchanges and refunds

You can exchange a reservation for another reservation of the same type. It's also possible to refund a reservation, up to $50,000 USD per year, if you no longer need it. The Azure portal can be used to exchange or refund a reservation. For more information, see [Self-service exchanges and refunds for Azure Reservations](../reservations/exchange-and-refund-azure-reservations.md).

### Partial refunds

We’ll issue a partial refund when EA customers return reservations that were purchased using overage and not Azure Prepayment (previously called monetary commitment).

To return a partial refund with Azure Prepayment:

1. The refund amount is reflected on the purchase month. In the EA portal, navigate to **Usage Summary** > **Adjustments/Charge by services**.
2. The refund is shown in the EA portal as a negative adjustment in the purchase month and a positive adjustment in the current month. It appears similar to a reservations exchange.

To return a partial refund with an overage:

1. View the refund amount displayed in the purchase month. In the EA portal, navigate to **Usage Summary** > **Charge by services**.
2. The credit memo references the original invoice number. To reconcile the initial purchase with the credit memo, refer to the original invoice number.

Direct Enterprise customers can view the refund details in the Azure portal. To view refunds:

1. Navigate to **Cost Management + Billing** > select a billing scope > in the left menu under **Billing**, select  **Reservation transactions** menu. 
1. In the list of reservation transactions, you'll see entries under **Type** labeled with `Refund`.

## Reservation costs and usage

Enterprise agreement customers can view cost and usage data in the Azure portal and REST APIs. For reservation costs and usage, you can:

- Get reservation purchase data.
- Know which subscription, resource group, or resource used a reservation.
- Chargeback for reservation use.
- Calculate reservation savings.
- Get reservation under-utilization data.
- Amortize reservation costs.

For more information about reservation costs and usage, see [Get Enterprise Agreement reservation costs and usage](../reservations/understand-reserved-instance-usage-ea.md).

For information about pricing, see [Linux Virtual Machines Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/linux/) or [Windows Virtual Machines Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/windows/).

### Reservation prices

Any reservation discounts that your organization might have negotiated aren't shown in the EA portal price sheet. Previously, the discounted rates were available in the EA portal, however that functionality was removed. If you’ve negotiated reduced reservation prices, currently the only way to view the discounted prices is in the purchase reservation purchase experience.

The prices for reservations aren't necessarily the same between retail rates and EA. They could be the same, but if you’ve negotiated a discount, the rates will differ.

Prices shown in the [Azure Pricing calculator](https://azure.microsoft.com/pricing/calculator/) and [Retail Prices API](/rest/api/cost-management/retail-prices/azure-retail-prices) are the same. Querying the API is the best way to view all prices at once.

## Reserved instances API support

Use Azure APIs to programmatically get information for your organization about Azure service or software reservations. For example, use the APIs to:

- Find reservations to buy
- Buy a reservation
- View purchased reservations
- View and manage reservation access
- Split or merge reservations
- Change the scope of reservations

For more information, see [APIs for Azure reservation automation](../reservations/reservation-apis.md).

## Azure reserved virtual machine instances

Reserved instances can reduce your virtual machine costs up to 72 percent over Pay-As-You-Go prices on all VMs. Or up to 82 percent savings when combined with the Azure hybrid benefit. Reserved instances help you manage your workloads, budget, and forecast better with an up-front payment for a one-year or three-year term. You can also exchange or cancel reservations as business needs change.

### How to buy reserved virtual machine instances

To purchase an Azure reserved virtual machine instance, an Enterprise Azure enrollment admin must enable the _Reserve Instance_ purchase option. The option is in the _Enrollment Detail_ section on the _Enrollment_ tab in the [Azure EA Portal](https://ea.azure.com/).

Once the EA enrollment is enabled to add reserved instances, any account owner with an active subscription associated to the EA enrollment can buy a reserved virtual machine instance in the [Azure portal](https://aka.ms/reservations). For more information, see [Prepay for virtual machines and save money with Reserved Virtual Machine Instances](../../virtual-machines/prepay-reserved-vm-instances.md).

### How to view reserved instance purchase details

You can view your reserved instance purchase details via the _Reservations_ menu on the left side of the [Azure portal](https://aka.ms/reservations) or from the [Azure EA portal](https://ea.azure.com/). Select **Reports** from the left-side menu and scroll down to the _Charges by Services_ section on the _Usage Summary_ Tab. Scroll to the bottom of the section and your reserved instance purchases and usage will list at the end as indicated by the `1 year` or `3 years` designation next to the service name, for example: `Standard_DS1_v2 eastus 1 year` or `Standard_D2s_v3 eastus2 3 years`.

### How can I change the subscription associated with reserved instance or transfer my reserved instance benefits to a subscription under the same account?

You can change the subscription that receives reserved instance benefits by:

- Signing in to the [Azure portal](https://aka.ms/reservations).
- Updating the applied subscription scope by associating a different subscription under the same account.

For more information about changing the scope of a reservation, see [Change the reservation scope](../reservations/manage-reserved-vm-instance.md#change-the-reservation-scope).

### How to view reserved instance usage details

You can view your reserved instance usage detail in the [Azure portal](https://aka.ms/reservations) or in the [Azure EA portal](https://ea.azure.com/) (for EA customers who have access to view billing information) under _Reports_ > _Usage Summary_ > _Charges by Services_. Your reserved instances can be identified as service names containing 'Reservation', for example: `Reservation-Base VM or Virtual Machines Reservation-Windows Svr (1 Core)`.

Your usage detail and advanced report download CSV has more reserved instance usage information. The _Additional Info_ field helps you identify the reserved instance usage.

If you didn't use the Azure hybrid benefit to purchase Azure reserved VM instances, reserved instances will emit two meters (hardware and software). When you use the Azure hybrid benefit to purchase reserved instance, you won't see the software meter in your reserved instance usage detail.

### Reserved instance billing

For enterprise customers, Azure Prepayment is used to purchase Azure reserved VM instances. If your enrollment has enough Azure Prepayment balance to cover the reserved instance purchase, the amount will be deducted from your Azure Prepayment balance. You won't get an invoice for the purchase.

In scenarios where Azure EA customers have used all their Azure Prepayment, reserved instances can still be purchased, and those purchases will be invoiced on your next overage bill. Reserved instance overage, if any, will be part of your regular overage invoice.

### Reserved instance expiration

You'll receive email notifications, first one 30 days prior to reservation expiry and other one at expiration. Once the reservation expires, deployed VMs will continue to run and be billed at a pay-as-you-go rate. For more information, see [Reserved Virtual Machine Instances offering.](https://azure.microsoft.com/pricing/reserved-vm-instances/)

## Next steps

- For more information about Azure reservations, see [What are Azure Reservations?](../reservations/save-compute-costs-reservations.md).
- To learn more about enterprise reservation costs and usage, see [Get Enterprise Agreement reservation costs and usage](../reservations/understand-reserved-instance-usage-ea.md).
- For information about pricing, see [Linux Virtual Machines Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/linux/) or [Windows Virtual Machines Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/windows/).
