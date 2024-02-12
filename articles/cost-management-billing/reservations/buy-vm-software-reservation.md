---
title: Prepay for Virtual machine software reservations
description: Learn how to prepay for Azure virtual machine software reservations to save money.
author: bandersmsft
ms.reviewer: primittal
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: how-to
ms.date: 11/17/2023
ms.author: banders
---

# Prepay for Virtual machine software reservations (VMSR) - Azure Marketplace

When you prepay for your virtual machine software usage (available in the Azure Marketplace), you can save money over your pay-as-you-go costs. The discount is automatically applied to a deployed plan that matches the reservation, not on the virtual machine usage. You can buy reservations for virtual machines separately for more savings.

You can buy virtual machine software reservation in the Azure portal. To buy a reservation:

- You must have the owner role for at least one Enterprise or individual subscription with pay-as-you-go pricing.
- For Enterprise subscriptions, the **Add Reserved Instances** option must be enabled in the [EA portal](https://ea.azure.com/). If the setting is disabled, you must be an EA Admin for the subscription.
- For the Cloud Solution Provider (CSP) program, the admin agents or sales agents can buy the software plans.

## Buy a virtual machine software reservation (VMSR)

There are two ways to purchase a virtual machine software reservation:

**Option 1**

1. Navigate to Reservations, select **Add**, and then select **Virtual Machine**. The Azure Marketplace shows offers that have reservation pricing.
2. Select the desired Virtual machine software plan that you want to buy.  
    Any virtual machine software reservation that matches the attributes of what you buy gets a discount. The actual number of deployments that get the discount depend on the scope and quantity selected.
3. Select a subscription. It's used to pay for the plan.  
    The subscription payment method is charged the upfront costs for the reservation. To buy a reservation, you must have owner role or reservation purchaser role on an Azure subscription that's of type Enterprise (MS-AZR-0017P or MS-AZR-0148P) or Pay-As-You-Go (MS-AZR-0003P or MS-AZR-0023P) or Microsoft Customer Agreement.
    - For an enterprise subscription, the reservation purchase charges aren't deducted from the enrollment's Azure Prepayment (previously called monetary commitment) balance. The charges are billed to the subscription's credit card or invoice payment method.
    - For an individual subscription with pay-as-you-go pricing, the charges are billed to the subscription's credit card or invoice payment method.
4. Select a scope. The scope can cover one subscription or multiple subscriptions (using a shared scope).
    - Single subscription - The plan discount is applied to matching usage in the subscription.
    - Shared - The plan discount is applied to matching instances in any subscription in your billing context. For enterprise customers, the billing context is the enrollment and includes all subscriptions in the enrollment. For individual plan with pay-as-you-go pricing customers, the billing context is all individual plans with pay-as-you-go pricing subscriptions created by the account administrator.
    - Management group - Applies the reservation discount to the matching resource in the list of subscriptions that are a part of both the management group and billing scope.
    - Single resource group - Applies the reservation discount to the matching resources in the selected resource group only.
5. Select a product to choose the VM size and the image type. The discount will apply to matching resources and has instance size flexibility turned on.
6. Select a one-year or three-year term.
7. Choose a quantity, which is the number of prepaid VM instances that can get the billing discount.
8. Add the product to the cart, review, and purchase.

**Option 2**

1. Browse to Marketplace to view offers that have reservation pricing. Apply a **Pricing** filter for **Reservation**.
2. Select the desired Virtual machine software offer that you want to buy. Then select the desired plan.  
    Any virtual machine software reservation that matches the attributes of what you buy gets a discount. The actual number of deployments that get the discount depend on the scope and quantity selected.
3. Select a subscription. It's used to pay for the plan.  
    The subscription payment method is charged the upfront costs for the reservation. To buy a reservation, you must have owner role or reservation purchaser role on an Azure subscription that's of type Enterprise (MS-AZR-0017P or MS-AZR-0148P) or Pay-As-You-Go (MS-AZR-0003P or MS-AZR-0023P) or Microsoft Customer Agreement.
    - For an enterprise subscription, these reservation purchase charges aren't deducted from the enrollment's Azure Prepayment (previously called monetary commitment) balance. The charges are billed to the subscription's credit card or invoice payment method.
    - For an individual subscription with pay-as-you-go pricing, the charges are billed to the subscription's credit card or invoice payment method.
4. Select a scope. The scope can cover one subscription or multiple subscriptions (using a shared scope).
    - Single subscription - The plan discount is applied to matching usage in the subscription.
    - Shared - The plan discount is applied to matching instances in any subscription in your billing context. For enterprise customers, the billing context is the enrollment and includes all subscriptions in the enrollment. For individual plan with pay-as-you-go pricing customers, the billing context is all individual plans with pay-as-you-go pricing subscriptions created by the account administrator.
    - Management group - Applies the reservation discount to the matching resource in the list of subscriptions that are a part of both the management group and billing scope.
    - Single resource group - Applies the reservation discount to the matching resources in the selected resource group only.
5. Select a product to choose the VM size and the image type. The discount will apply to matching resources and has instance size flexibility turned on.
6. Select a one-year or three-year term.
7. Choose a quantity, which is the number of prepaid VM instances that can get the billing discount.
8. Add the product to the cart, review and purchase.

The reservation discount is automatically applied to the software meter that you pre-pay for. VM compute charges aren't covered by the software reservation. You can purchase the VM reservations separately.

## Discount applies to different VM sizes

Like Reserved VM Instances, Virtual machine software reservation purchases offer instance size flexibility. So, your discount applies even when you deploy a VM with a different vCPU count. The discount applies to different VM sizes within the Virtual machine software reservation.

## Self-service cancellation and exchanges

You can't exchange a Virtual machine software reservation that you bought yourself. You can, however, cancel the reservation within 72 hours of purchase for a full refund. The [cancellation limit](exchange-and-refund-azure-reservations.md#cancel-exchange-and-refund-policies) applies. Please note that any reservations purchased via a private offer from an ISV cannot be canceled at any time. 

Check your usage before purchasing to make sure you buy the right software reservation.

## Next steps

- To learn more about Azure Reservations, see the following articles:
  - [What are Azure Reservations?](save-compute-costs-reservations.md)
  - [Understand how the Azure virtual machine software reservation discount is applied](understand-vm-software-reservation-discount.md)
  - [Understand reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md)
