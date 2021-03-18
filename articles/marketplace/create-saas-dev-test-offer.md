---
title: Create a development and test offer
description: How to create a separate development offer for testing your production offer in the commercial marketplace program in Microsoft Partner Center. 
author: mingshen-ms 
ms.author: mingshen
ms.reviewer: dannyevers
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.date: 03/19/2021
---

# Create a development and test offer

To develop in a separate environment from your production offer, you’ll create a separate development (DEV) offer and a separate production (PROD) offer. For information about the benefits of using a separate DEV offer, see [Plan a SaaS offer](plan-saas-offer.md#development-and-test-offer).

You’ll configure most settings the same in the DEV and PROD offers. For example, the official marketing language and assets, such as screenshots and logos should be the same. In the cases where the configuration is the same, you can copy-and-paste fields from the plans in the DEV offer to the plans in the PROD offer.

The following sections describe the configuration differences between the DEV and PROD offers.

## Offer setup page

We recommend that you use the same alias in the **Alias** box of both offers but append “_test” to the alias of the DEV offer. For example, if the alias of your PROD offer is “contososolution” then the alias of the DEV offer should be “contososolution_test”. This way, you can easily identify which your DEV offer from your PROD offer.

In the **Customer leads** section, use and Azure table or a test CRM environment for the DEV offer. Use the intended lead management system for the PROD offer.

## Properties page

Configure this page the same in both the DEV and PROD offers.

## Offer listing page

Configure this page the same in both the DEV and PROD offers.

## Preview audience

In the DEV offer, include the Azure Active Directory (AAD) user principal name or Microsoft account (MSA) email address of developers and testers, including yourself. Please note the user principal name of a user on AAD can be different than the email of the user. For example, jane.doe@contoso.com will not work but janedoe@contoso.com will work. These are the people who will have access to the DEV offer when you share the **Preview** link during the development and testing phase.

In the PROD offer, include the Azure AD user principal name or Microsoft Account email of the users who will validate the offer before selecting the **Go Live button** to publish the offer live.

## Technical configuration page

This table describes the differences between the settings for DEV offers and PROD offers.

***Table 1: Technical configuration differences***

| Setting | DEV offer | PROD offer |
| ------------ | ------------- | ------------- |
| Landing page URL | Enter your dev/test endpoint. | Enter your production endpoint. |
| Connection webhook | Enter your dev/test endpoint. | Enter your production endpoint. |
| Azure Active Directory tenant ID | Enter your test app registration tenant ID (AAD directory ID). | Enter your production app registration tenant ID. |
| Azure Active Directory application ID | Enter your test app registration application ID (client ID). | Enter your production app registration application ID. |
||||

## Plan overview page

When you create your plans, we recommend that you use the same _Plan ID_ and _Plan name_ in both the DEV and PROD offers except append the plan ID in the DEV offer with **_test**. For example, if the Plan ID in the PROD offer is “enterprise”, then the plan ID in the DEV offer should be “enterprise_test”. This way, you can easily identify which your DEV offer from your PROD offer. You’ll create plans in the PROD offer with the pricing models and prices that you decide are best for your offer.

### Plan listing

On the **Plan overview** > **Plan listing** tab, enter the same plan description in both the DEV and PROD plans.

### Pricing and availability page

This section provides guidance for completing the **Plan overview** > **Pricing and availability** page.

#### Markets

Select the same markets for the DEV and PROD offers.

#### Pricing

Use the DEV offer to experiment with pricing models. After you verify which pricing model or models work best, you’ll create the plans in the PROD offer with the pricing models and prices you want.

The DEV offer should have plans with zero or very low prices in the plans. The PROD offer will have the prices you want to charge to customers.

> [!NOTE]
> Information the user should notice even if skimmingPurchases made in Preview will be processed for both DEV and PROD offers. If an offer has a $100/mo price, your company will be charged $100. If this happens, you can open a [support ticket](support.md) and we will issue a payout for the full amount (and take no agency fee).

#### Pricing model

Use the same Pricing model in the plans of the DEV and PROD offers. For example, if the plan in the PROD offer is Flat rate, with a monthly billing term, then configure the plan in the DEV offer using the same model.

To reduce your cost for testing the pricing models, including Marketplace custom meter dimensions, we recommend that you configure the **Pricing** section of the **Pricing and availability** tab, in the DEV offer with lower prices than the PROD offer. Here are some guidelines you can follow when setting prices for plans in the DEV offer.

***Table 2: Pricing guidelines***

| Price | Comment |
| ------------ | ------------- |
| $0.00 | Set a total transaction cost of zero to have no financial impact. Use this price when making calls to the metering APIs, or to test purchasing plans in your offer while developing your solution. |
| $0.01 - $49.99 | Use this price range to test analytics, reporting, and the purchase process. |
| $50.00 and above | Use this price range to test payout. For information about our payment schedule, see [Payout schedules and processes](/partner-center/payout-policy-details). |
|||

To avoid being charged a processing fee on your test, open a [support ticket](support.md).

#### Free trial

Don’t enable a free trial for the DEV offer.

## Co-sell with Microsoft page

Don’t configure the **Co-sell with Microsoft** tab of the DEV offer.

## Resell through CSPs

Don’t configure the **Resell through CSPs** tab of the DEV offer.

## Next steps

- [Test and publish a SaaS offer](test-publish-saas-offer.md)
