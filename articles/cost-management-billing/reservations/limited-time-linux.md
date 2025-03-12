---
title: Save on select Linux VMs for a limited time
description: Learn how to save up to 56% on select Linux VMs with a limited-time offer by purchasing a one-year Azure Reserved Virtual Machine Instance.
author: bandersmsft
ms.reviewer: shreyabaheti
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: how-to
ms.date: 12/06/2024
ms.author: banders
ms.custom: references_regions
#customer intent: I want to learn how to save money with reservations and buy one.
---

# Save on select Linux VMs for a limited time

Save up to 15 percent in addition to the existing one-year [Azure Reserved Virtual Machine (VM) Instances](/azure/virtual-machines/prepay-reserved-vm-instances?toc=%2Fazure%2Fcost-management-billing%2Freservations%2Ftoc.json&source=azlto3) discount for select Linux VMs for a limited period. Customers could potentially see total savings of to up to 56% compared to running an Azure VM on a pay-as-you-go basis. This offer is available between October 1, 2024, and March 31, 2025. The pricing pages and the [Azure Pricing calculator](https://azure.microsoft.com/pricing/calculator) reflect the adjusted price, inclusive of the promotional discounts.

## Purchase the offer

To take advantage of this promotional offer, [purchase](https://portal.azure.com/#view/Microsoft_Azure_Reservations/CreateBlade) a one-year Azure Reserved Virtual Machine Instance for a qualified VM SKU and region.

## Buy a reservation

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **All services** > **Reservations**.
3. Select **Add** and then select a qualified product listed in the [Terms and conditions of the offer](#terms-and-conditions-of-the-offer) section.
4. Select the [scope](prepare-buy-reservation.md#reservation-scoping-options), and then a billing subscription that you want to use for the reservation. You can change the reservation scope after purchase.
5. Set the **Region** to one supported by the offer. For more information, see the [Qualifying regions](#qualifying-regions) section.
6. Select a reservation term and billing frequency.
7. Select **Add to cart**.
8. In the cart, you can change the quantity. After you review your cart and you're ready to purchase, select **Next: Review + buy**.
9. Select **Buy now**.

You can view the reservation in the [Reservations](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade/Reservations) page in the Azure portal.

## Terms and conditions of the offer

These terms and conditions (hereinafter referred to as "terms") govern the promotional offer ("offer") provided by Microsoft to customers purchasing a one-year Azure Reserved VM Instance in a qualified region between October 1, 2024 (12 AM Pacific Standard Time) and March 31, 2025 (11:59 PM Pacific Standard Time), for any of the following VM series:

- Dadsv5³ ⁴
- Dadsv6¹
- Daldsv6¹
- Dalsv6¹
- Dasv5³ ⁴
- Dasv6¹
- DCadsv5
- DCasv5
- Ddsv5²
- Ddv5
- Dlsv5
- Dpdsv6
- Dpldsv6
- Dplsv6
- Dpsv6
- Dsv5²
- Dv5²
- Eadsv5³
- Eadsv6¹
- Easv5³
- Easv6¹
- ECadsv5
- ECasv5
- Edsv5
- Edv5
- Epdsv6
- Epsv6
- Esv5
- Ev5
- Lasv3
- Lsv3

*¹ VM isn't available for the offer in the US East region.*

*² VM isn't available for the offer in US Government Iowa and US Government Virginia regions.*

*³ VM isn't available for the offer in US West 3, US Central, and US South Central regions.*

*⁴ VM isn't available for the offer in all China (CN) regions.*

Instance size flexibility is available for these VMs. For more information about instance size flexibility, see [Virtual machine size flexibility](/azure/virtual-machines/reserved-vm-instance-size-flexibility?source=azlto7).

### Qualifying regions

The offer applies to all regions where the Azure VM Reserved Instances are generally available (GA) for the VM series listed in the section above, except EU West (Amsterdam), EU North (Dublin), AP Southeast (Singapore), and QA Central (Qatar).

The offer provides an additional discount of up to 15 percent in addition to the existing one-year [Azure Reserved Virtual Machine (VM) Instances](/azure/virtual-machines/prepay-reserved-vm-instances?toc=%2Fazure%2Fcost-management-billing%2Freservations%2Ftoc.json&source=azlto3) rates. The savings don’t include operating system costs. Actual savings might vary based on instance type or usage. Customers could potentially see total savings of to up to 56% compared to running an Azure VM on a pay-as-you-go basis.

### Eligibility

The offer is available based on the following criteria:

- To buy a reservation, you must have the owner role or reservation purchaser role on an Azure subscription that's of one of the following types:
  - Enterprise (MS-AZR-0017P or MS-AZR-0148P)
  - Pay-as-you-go (MS-AZR-0003P or MS-AZR-0023P)
  - Microsoft Customer Agreement
  - 21v Customer Agreement
- Cloud solution providers can use the Azure portal or [Partner Center](/partner-center/azure-reservations?source=azlto1) to purchase Azure Reservations. You can't purchase a reservation if you have a custom role that mimics owner role or reservation purchaser role on an Azure subscription. You must use the built-in owner or built-in reservation purchaser role.
- For more information about who can purchase a reservation, see [Buy an Azure reservation](prepare-buy-reservation.md?source=azlto2).

### Offer details

Upon successful purchase and payment for the one-year Azure Reserved VM Instance in a qualified region for one or more of the qualifying VMs during the specified period, the discount applies automatically to the number of running virtual machines. You don't need to assign a reservation to a virtual machine to benefit from the discounts. A reserved instance purchase covers only the compute part of your VM usage. For more information about how to pay and save with an Azure Reserved VM Instance, see [Prepay for Azure virtual machines to save money](/azure/virtual-machines/prepay-reserved-vm-instances?toc=%2Fazure%2Fcost-management-billing%2Freservations%2Ftoc.json&source=azlto3).

- Other taxes might apply.
- Payment is processed using the payment method on file for the selected subscriptions.
- Estimated savings are calculated based on your current on-demand rate.

### Charge back promotional offer costs

Enterprise Agreement and Microsoft Customer Agreement billing readers can view amortized cost data for reservations. They can use the cost data to charge back the monetary value for a subscription, resource group, resource, or a tag to their partners. In amortized data, the effective price is the prorated hourly reservation cost. The cost is the total cost of reservation usage by the resource on that day. Users with an individual subscription can get the amortized cost data from their usage file. For more information, see [Charge back Azure Reservation costs](charge-back-usage.md).

### Discount limitations

- The discount automatically applies to the number of running virtual machines in qualified regions that match the reservation scope and attributes.
- The discount applies for one year after the date of purchase.
- The discount only applies to resources associated with subscriptions purchased through Enterprise, Cloud Solution Provider (CSP), Microsoft Customer Agreement, and individual plans with pay-as-you-go rates.
- A reservation discount is "use-it-or-lose-it." So, if you don't have matching resources for any hour, then you lose a reservation quantity for that hour. You can't carry forward unused reserved hours.
- When you deallocate, delete, or scale the number of VMs, the reservation discount automatically applies to another matching resource in the specified scope. If no matching resources are found in the specified scope, then the reserved hours are lost.
- Stopped VMs are billed and continue to use reservation hours. To use your available reservation hours with other workloads, deallocate or delete VM resources or scale-in other VMs.
- For more information about how Azure Reserved VM Instance discounts are applied, see [How the Azure reservation discount is applied to virtual machines](../manage/understand-vm-reservation-charges.md).

### Exchanges and refunds

The offer follows standard exchange and refund policies for reservations. For more information about exchanges and refunds, see [Self-service exchanges and refunds for Azure Reservations](exchange-and-refund-azure-reservations.md?source=azlto6).

### Renewals

- The renewal price **will not be** the limited time offer price, but the price available at time of renewal.
- For more information about renewals, see [Automatically renew Azure reservations](reservation-renew.md?source=azlto5).

### Termination or modification

Microsoft reserves the right to modify, suspend, or terminate the offer at any time without prior notice.

If you purchased the one-year Azure Reserved Virtual Machine Instances for the qualified VMs in qualified regions between October 1, 2024, and March 31, 2025, you’ll continue to get the discount throughout the one-year term, even if the offer is canceled.

By participating in the offer, customers agree to be bound by these terms and the decisions of Microsoft. Microsoft reserves the right to disqualify any customer who violates these terms or engages in any fraudulent or harmful activities related to the offer.

## Related content

- [How the Azure reservation discount is applied to virtual machines](../manage/understand-vm-reservation-charges.md)
- [Purchase Azure Reserved VM instances in the Azure portal](https://portal.azure.com/#view/Microsoft_Azure_Reservations/CreateBlade)
- [Linux on Azure tech community blog](https://aka.ms/linuxpromoffer_techcommunityblog)