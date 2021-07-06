---
title: Change Azure subscription offer
description: Learn about how to change your Azure subscription and switch to a different offer.
author: bandersmsft
ms.reviewer: amberb
tags: billing,top-support-issue
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 01/20/2021
ms.author: banders
---

# Change your Azure subscription to a different offer

As a customer with a [pay-as-you-go subscription](https://azure.microsoft.com/offers/ms-azr-0003p/) subscription, you can switch your Azure subscription to another offer in the Azure portal. For example, you can use this feature to take advantage of the [monthly credits for Visual Studio subscribers](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/).

**Just want to upgrade from Free Trial?** See [upgrade your subscription](upgrade-azure-subscription.md).

## What's supported:

You can switch from a pay-as-you-go subscription to:

- [Pay-As-You-Go Dev/Test](https://azure.microsoft.com/offers/ms-azr-0023p/)
- [Visual Studio Professional](https://azure.microsoft.com/offers/ms-azr-0059p/)
- [Visual Studio Test Professional](https://azure.microsoft.com/offers/ms-azr-0060p/)
- [MSDN Platforms](https://azure.microsoft.com/offers/ms-azr-0062p/)
- [Visual Studio Enterprise](https://azure.microsoft.com/offers/ms-azr-0063p/)
- [Visual Studio Enterprise (Bizspark)](https://azure.microsoft.com/offers/ms-azr-0064p/)

> [!NOTE]
> For other offer changes, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

## Switch subscription offer

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Subscriptions** and then select your pay-as-you-go subscription.
1. At the top of the page, select **Switch Offer**. The option is only available if you have a pay-as-you-go subscription and have completed your first billing period.  
    :::image type="content" source="./media/switch-azure-offer/switch-offer.png" alt-text="ALTImage showing subscription details with the Switch Offer optionTEXT" lightbox="./media/switch-azure-offer/switch-offer.png" :::
1. Select the offer that you want from the list of offers your subscription can be switched to. This list varies based on the memberships that your account is associated with. If nothing is available, check the [list of available offers you can switch to](#whats-supported) and make sure you have the right memberships. Then select **Next**.
    :::image type="content" source="./media/switch-azure-offer/select-offer.png" alt-text="Select an offer that you want to switch to" lightbox="./media/switch-azure-offer/select-offer.png" :::
    Depending on the offer you’re switching to, you may see a note about the impact of switching. Go through the list carefully and follow the instructions before you continue. You might also need to verify your phone number.
1. After reviewing any notes or verifying your phone number, select **Switch Offer**.
1. Your subscription is now switched to the new offer.

## Frequently asked questions
The following sections answer commonly asked questions.

### What is an Azure offer?

An Azure offer is the *type* of the Azure subscription you have. For example, [an subscription with pay-as-you-go rates](https://azure.microsoft.com/offers/ms-azr-0003p/), [Azure in Open](https://azure.microsoft.com/offers/ms-azr-0111p/), and [Visual Studio Enterprise](https://azure.microsoft.com/offers/ms-azr-0063p/) are all Azure offers. Each offer has different [terms](https://azure.microsoft.com/support/legal/offer-details/) and some have special benefits. The offer of your subscription is shown on the subscription details page.

:::image type="content" source="./media/switch-azure-offer/subscription-details.png" alt-text="Subscription details page showing the offer type" lightbox="./media/switch-azure-offer/subscription-details.png" :::

### Why don't I see the button?

You might not see the **Switch Offer** option if:

* You don't have a [subscription with pay-as-you-go rates](https://azure.microsoft.com/offers/ms-azr-0003p/). Currently only subscriptions with pay-as-you-go rates can be converted to another offer.
  * If you have a [Free Trial](https://azure.microsoft.com/free/), learn how to [upgrade to Pay-As-You-Go](upgrade-azure-subscription.md).
  * To switch offer from a different subscription, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
* You're still in your first billing period; you must wait for your first billing period to end before you can switch offers.

### Why do I see "There are no offers available in your region or country at this time"?

* You might not be eligible for any offer switches. Check the [list of available offers you can switch to](#whats-supported) and make sure that you've activated the right benefits with Visual Studio or Bizspark.
* Some offers may not be available in all countries/regions.

### What does switching Azure offers do to my service and billing?

Here are the details of what happens when you switch Azure offers.

#### No service downtime

There is no service downtime for any users associated with the subscription. However, the offer you switch to may have restrictions. For instance, some offers prohibit production use, so you would need to move production resources to another subscription.

#### Quota increases are reset

When you switch offers, any [limit or quota increases above the default limit](../../azure-portal/supportability/resource-manager-core-quotas-request.md) are reset. There's no service downtime, even if you have more resources beyond the default limit. For example, you're using 200 cores on your subscription, then switching offers resets your cores quota back to the default of 20 cores. The VMs that use the 200 cores are unaffected and would continue to run. If you don't make another quota increase request, however, you can't provision any more cores.

#### Billing

On the day you switch, an invoice is generated for all outstanding charges. Then, your subscription is billed per the new offer’s pricing terms. Your subscription billing anniversary changes to the date on which you changed offers. Usage and billing data before the offer change isn't kept, so we recommend that you download a copy before switching.

### Can I migrate from a subscription with pay-as-you-go rates to Cloud Solution Provider (CSP) or Enterprise Agreement (EA)?

* To migrate to CSP, see [Transfer Azure subscriptions between subscribers and CSPs](transfer-subscriptions-subscribers-csp.md).
* To migrate to EA, have your Enrollment Admin add your account into the EA. Follow instructions in the invitation email to have your subscriptions moved under the EA enrollment.

### Can I migrate data and services to a new subscription?

* You can migrate the resources directly to the new subscription, see [Move resources to new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md).
* To transfer ownership of an Azure subscription and everything in it to someone else, see [Transferring ownership of an Azure subscription](billing-subscription-transfer.md)

## Need help? Contact us.

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps
- [Start analyzing costs](../costs/quick-acm-cost-analysis.md)
