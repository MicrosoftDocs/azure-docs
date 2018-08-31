---
title: Buy SUSE Linux plans - Azure Reservations | Microsoft Docs
description: Learn how you can prepay for your SUSE usage and save money over your pay-as-you-go costs.
services: virtual-machines-linux
documentationcenter: ''
author: yashesvi
manager: yashesvi
editor: ''
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/29/2018
ms.author: yashar
---
# Prepay for SUSE software plans from Azure Reservations

Prepay for your SUSE usage and save money over your pay-as-you-go costs. The discounts only apply to SUSE meters and not on the virtual machine usage. You can buy reservations for virtual machines separately to save even more.

You can buy SUSE software plans in the Azure portal. To buy a plan:

- You must be in an Owner role for at least one Enterprise or Pay-As-You-Go subscription.
- For Enterprise subscriptions, reservation purchases must be enabled in the [EA portal](https://ea.azure.com).
- For the Cloud Solution Provider (CSP) program, the admin agents or sales agents can buy the SUSE plans.

## Buy a SUSE software plan

1. Go to [Reservations](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/ReservationsBrowseBlade) in Azure portal.
1. Select **Add** and select SUSE Linux.
1. Fill in the required fields. Any SUSE Linux VM that matches the attributes of what you buy gets the discount. The actual number of deployments that get the discount depend on the scope and quantity selected.

    | Field      | Description|
    |:------------|:--------------|
    |Name        |The name of this purchase.|
    |Subscription|The subscription used to pay for this plan. The payment method on the subscription is charged the upfront costs for the reservation. The subscription type must be an enterprise agreement (offer number: MS-AZR-0017P) or Pay-As-You-Go (offer number: MS-AZR-0003P). For an enterprise subscription, the charges are deducted from the enrollment's monetary commitment balance or charged as overage. For Pay-As-You-Go subscription, the charges are billed to the credit card or invoice payment method on the subscription.|
    |Scope       |The scope can cover one subscription or multiple subscriptions (shared scope). If you select: <ul><li>Single subscription - The plan discount is applied to SUSE Linux usage in this subscription. </li><li>Shared - The plan discount is applied to SUSE Linux usage in any subscription within your billing context. For enterprise customers, the shared scope is the enrollment and includes all subscriptions (except dev/test subscriptions) within the enrollment. For Pay-As-You-Go customers, the shared scope is all Pay-As-You-Go subscriptions created by the account administrator.</li></ul>|
    |Software plan     |Select the SUSE Linux plan. For help in identifying what to buy, see [Understand how the SUSE Linux Enterprise software reservation discount is applied](../../billing/billing-understand-suse-reservation-charges.md).|
    |VM size     |SUSE Linux pricing depends on the number of vCPUs on the VM. Select the option that represents the number of vCPUs on your SUSE Linux VMs.|
    |Term        |One year or three years.|
    |Quantity    |The number of VMs that you are buying this SUSE Linux plan for. The quantity is the number of running SUSE Linux instances that can get the billing discount.|
1. Select **Purchase**.
1. Select **View this Reservation** to see the status of your purchase.

The reservation discount is automatically applied to any running SUSE virtual machines that matches the reservation. The discount applies only to the SUSE meter. The VM compute charges are not covered by this plan.

## Discount applies to different VM sizes with instance size flexibility

Like Reserved VM Instances, SUSE Linux plans offer instance size flexibility. This means that your discount applies  even when you deploy a VM that's a different size from the SUSE plan you bought. For more information, see [Understand how the SUSE Linux Enterprise software reservation discount is applied](../../billing/billing-understand-suse-reservation-charges.md).

## Cancellation and exchanges not allowed

You can't cancel or exchange a SUSE plan that you bought. Check your usage to make sure you buy the right plan. For help in identifying what to buy, see [Understand how the SUSE Linux Enterprise software reservation discount is applied](../../billing/billing-understand-suse-reservation-charges.md).

## Next steps

To learn how to manage a reservation, see [Manage Azure reservations](../../billing/billing-manage-reserved-vm-instance.md).

To learn more, see the following articles:

- [What are Azure Reservations?](../../billing/billing-save-compute-costs-reservations.md)
- [Manage Reservations in Azure](../../billing/billing-manage-reserved-vm-instance.md)
- [Understand how the SUSE reservation discount is applied](../../billing/billing-understand-suse-reservation-charges.md)
- [Understand reservation usage for your Pay-As-You-Go subscription](../../billing/billing-understand-reserved-instance-usage.md)
- [Understand reservation usage for your Enterprise enrollment](../../billing/billing-understand-reserved-instance-usage-ea.md)

## Need help? Contact support

If you still have further questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.