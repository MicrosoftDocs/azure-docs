---
title: Prepay for Azure Red Hat OpenShift to save costs
description: Learn how to save on Azure Red Hat OpenShift by prepaying. This guide covers purchasing plans, required roles, permissions, and subscription details.
author: bandersmsft
ms.reviewer: primittal
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: how-to
ms.date: 12/06/2024
ms.author: banders
#customer intent: As an Azure billing administrator, I want to understand what Azure Red Hat OpenShift reservations are and how buying one can help me save money.
---

# Prepay for Azure Red Hat OpenShift

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets

When you prepay for your Red Hat OpenShift software usage in Azure, you can save money over your pay-as-you-go costs. The discounts only apply to Red Hat OpenShift meters and not on the virtual machine usage. You can buy reservations for virtual machines separately for more savings.

## Prerequisites

You can buy Red Hat OpenShift software plans in the Azure portal. To buy a plan:

- To buy a reservation, you must have owner role or reservation purchaser role on an Azure subscription.
- For Enterprise subscriptions, the **Add Reserved Instances** option must be enabled in the [EA portal](https://ea.azure.com/). If the setting is disabled, you must be an EA Admin for the subscription.
- For the Cloud Solution Provider (CSP) program, the admin agents or sales agents can buy the software plans.

## Buy a software plan

1. Sign in to the Azure portal and go to [Reservations](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/ReservationsBrowseBlade).
2. Select **Add** and then select the Azure Red Hat OpenShift. Fill in the required fields. The actual number of deployments that get the discount depends on the scope and quantity selected.
3. Select a subscription. It's used to pay for the plan. The subscription payment method is charged the upfront costs for the reservation. The subscription type must be an Enterprise Agreement (offer numbers: MS-AZR-0017P or MS-AZR-0148P) or individual agreement with pay-as-you-go pricing (offer numbers: MS-AZR-0003P or MS-AZR-0023P).
    - For an enterprise subscription, the charges are deducted from the enrollment's Azure Prepayment (previously called monetary commitment) balance or charged as overage.
    - For an individual subscription with pay-as-you-go pricing, the charges are billed to the subscription's credit card or invoice payment method.
4. Select a scope. The scope can cover one subscription or multiple subscriptions (shared scope).
    - Single subscription - The plan discount is applied to matching usage in the subscription.
    - Shared - The plan discount is applied to matching instances in any subscription in your billing context. For enterprise customers, the billing context is enrollment and includes all subscriptions in the enrollment. For individual plans with pay-as-you-go pricing customers, the billing context is all individual plans with pay-as-you-go pricing subscriptions created by the account administrator.
    - Management group - Applies the reservation discount to the matching resource in the list of subscriptions that are a part of both the management group and billing scope.
    - Single resource group - Applies the reservation discount to the matching resources in the selected resource group only.
5. Select a product to choose the virtual machine (VM) size and the image type. The discount applies to the selected VM size only.
6. Select a term. Available term lengths vary by product.
7. Choose a quantity, which is the number of prepaid VM instances that can get the billing discount.
8. Add the product to the cart, review, and purchase.

The reservation discount is automatically applied to the software meter that you prepay for. VM compute charges aren't covered by the plan. You can purchase the VM reservations separately.

## Discount applies to different VM sizes

Red Hat OpenShift plans offer instance size flexibility. Your discount applies even when you deploy a VM that's a different size from the Red Hat OpenShift plan you bought.

The discount amount depends on the VM vCPU ratio listed at [Instance size flexibility ratio for VMs](/azure/virtual-machines/reserved-vm-instance-size-flexibility#instance-size-flexibility-ratio-for-vms). Use the ratio value to calculate how many VM instances get the Red Hat OpenShift plan discount. For example, if you purchased two software plans for D8s v3 but deployed a D16s v3 VM, both the software plans would apply to one D16s v3 VM.

Additionally, all VMs that fall under Compute Optimized can be covered by purchasing software plan for the image type Compute Optimized. For more information, see [Azure Red Hat OpenShift pricing](https://azure.microsoft.com/pricing/details/openshift/).

## Self-service cancellation and exchanges not allowed

You can't cancel or exchange a Red Hat OpenShift plan that you bought yourself.

## Need help? Contact us

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Related content

To learn how to manage a reservation, see [Manage Azure reservations](manage-reserved-vm-instance.md).

To learn more, see the following articles:

- [What are Azure Reservations?](save-compute-costs-reservations.md)
- [Manage Reservations in Azure](manage-reserved-vm-instance.md)
- [Understand how the SUSE reservation discount is applied](understand-suse-reservation-charges.md)
- [Understand reservation usage for your pay-as-you-go subscription](understand-reserved-instance-usage.md)
- [Understand reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md)