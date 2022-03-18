---
title: Plan a test SaaS offer in the Microsoft commercial marketplace
description: Plan a separate development offer for testing your offer in Azure Marketplace. 
author: mingshen-ms 
ms.author: mingshen
ms.reviewer: dannyevers
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.date: 03/28/2022
---

# Plan a test SaaS offer

To develop in a separate environment from your production offer, you’ll create a separate test and development (DEV) offer and a separate production (PROD) offer.

## Benefits of a DEV offer

Here are some reasons to create a separate DEV offer for the development team to use for development and testing of the PROD offer:

- Avoid accidental customer charges
- Evaluate pricing models
- Not adding plans that do not target actual customers

### Avoid accidental customer charges

By using a DEV offer instead of the PROD offer and treating them as development and production environments, you can avoid accidental charges to customers.

We recommend that you register two different Azure AD apps for calling the marketplace APIs. Developers will use one Azure AD app with the DEV offer’s settings, and the operations team will use the PROD app registration. By doing this, you can isolate the development team from making inadvertent mistakes, such as calling the API to cancel a customer’s subscription who pays $100K per month. You can also avoid charging a customer for metered usage they didn’t consume.

### Evaluate pricing models

Testing pricing models in the DEV offer reduces risk when developers experiment with different pricing models.

Publishers can create the plans they need in the DEV offer to determine which pricing model works best for their offer. Developers might want to create multiple plans in the DEV offer to test different pricing combinations. For example, you might create plans with different sets of custom metered dimensions. You might create a different plan with a mix of flat rate and custom metered dimensions.

To test multiple pricing options, you need to create a plan for each unique pricing model. To learn more, see [Plans](#plans).

### Not adding plans that do not target actual customers

By using a DEV offer for development and testing, you can reduce unnecessary clutter in the PROD offer. For example, you can’t delete plans you create to test different pricing models or technical configurations (without filing a support ticket). So by creating plans for testing in the DEV offer, you reduce the clutter in the PROD offer.

Clutter in the PROD offer frustrates product and marketing teams, as they expect all the plans to target actual customers. Especially with large teams that are disjointed who all want different sandboxes to work with, creating two offers will provide two different environments for DEV and PROD. In some cases, you might want to create multiple DEV offers to support a larger team who have different people running different test scenarios. Letting different team members work in the DEV offer separate from the PROD offer , helps to keep production plans as close to production-ready as possible.

Testing a DEV offer helps to avoid the 30 custom metered dimensions limit per offer. Developers can try different meter combinations in the DEV offer without affecting the custom metered dimension limit in the PROD offer.

## Configuration difference between DEV and production offers

You’ll configure most settings the same in the DEV and PROD offers. For example, the official marketing language and assets, such as screenshots and logos should be the same. In the cases where the configuration is the same, you can copy-and-paste fields from the plans in the DEV offer to the plans in the PROD offer.

The following sections describe the configuration differences between the DEV and PROD offers.

### Offer setup page

We recommend that you use the same alias in the **Alias** box of both offers but append “_test” to the alias of the DEV offer. For example, if the alias of your PROD offer is “contososolution” then the alias of the DEV offer should be “contososolution_test”. This way, you can easily identify which your DEV offer from your PROD offer.

In the **Customer leads** section, use an Azure table or a test CRM environment for the DEV offer. Use the intended lead management system for the PROD offer.

### Properties page

Configure this page the same in both the DEV and PROD offers.

### Offer listing page

Configure this page the same in both the DEV and PROD offers.

### Preview audience

In the DEV offer, include the Azure Active Directory (AAD) user principal names or Microsoft account (MSA) email addresses of developers and testers, including yourself. The user principal name of a user on AAD can be different than the email of that user. For example, jane.doe@contoso.com will not work but janedoe@contoso.com will. The users you designate will have access to the DEV offer when you share the **Preview** link during the development and testing phase.

In the PROD offer, include the Azure AD user principal name or Microsoft Account email of the users who will validate the offer before selecting the **Go Live button** to publish the offer live.

### Technical configuration page

This table describes the differences between the settings for DEV offers and PROD offers.

***Table 1: Technical configuration differences***

| Setting | DEV offer | PROD offer |
| ------------ | ------------- | ------------- |
| Landing page URL | Enter your dev/test endpoint. | Enter your production endpoint. |
| Connection webhook | Enter your dev/test endpoint. | Enter your production endpoint. |
| Azure Active Directory tenant ID | Enter your test app registration tenant ID (AAD directory ID). | Enter your production app registration tenant ID. |
| Azure Active Directory application ID | Enter your test app registration application ID (client ID). | Enter your production app registration application ID. |
||||

### Plan overview page

When you create your plans, we recommend that you use the same _Plan ID_ and _Plan name_ in both the DEV and PROD offers except append the plan ID in the DEV offer with **_test**. For example, if the Plan ID in the PROD offer is “enterprise”, then the plan ID in the DEV offer should be “enterprise_test”. This way, you can easily identify which your DEV offer from your PROD offer. You’ll create plans in the PROD offer with the pricing models and prices that you decide are best for your offer.

#### Plan listing

On the **Plan overview** > **Plan listing** tab, enter the same plan description in both the DEV and PROD plans.

#### Pricing and availability page

This section provides guidance for completing the **Plan overview** > **Pricing and availability** page.

##### Markets

Select the same markets for the DEV and PROD offers.

##### Pricing

Use the DEV offer to experiment with pricing models. After you verify which pricing model or models work best, you’ll create the plans in the PROD offer with the pricing models and prices you want.

The DEV offer should have plans with zero or low prices in the plans. The PROD offer will have the prices you want to charge to customers.

> [!IMPORTANT]
> Purchases made in Preview will be processed for both DEV and PROD offers. If an offer has a $100/mo price, your company will be charged $100. If this happens, you can open a [support ticket](support.md) and we will issue a payout for the full amount (and take no store service fee).

#### Pricing model

Use the same Pricing model in the plans of the DEV and PROD offers. For example, if the plan in the PROD offer is Flat rate, with a monthly billing term, then configure the plan in the DEV offer using the same model.

To reduce your cost for testing the pricing models, including Marketplace custom meter dimensions, we recommend that you configure the **Pricing** section of the **Pricing and availability** tab, in the DEV offer with lower prices than the PROD offer. Here are some guidelines you can follow when setting prices for plans in the DEV offer.

***Table 2: Pricing guidelines***

| Price | Comment |
| ------------ | ------------- |
| $0.00 - $0.01 | Set a total transaction cost of zero to have no financial impact or one cent to have a low cost. Use this price when making calls to the metering APIs, or to test purchasing plans in your offer while developing your solution. |
| $0.01 | Use this price range to test analytics, reporting, and the purchase process. |
| $50.00 - $100.00 | Use this price range to test payout. For information about our payment schedule, see [Payout schedules and processes](/partner-center/payout-policy-details). |
|||

> [!IMPORTANT]
>  To avoid being charged a store service fee on your test, open a [support ticket](support.md) within 7 days of the test purchase.

#### Free trial

Don’t enable a free trial for the DEV offer.

### Co-sell with Microsoft page

Don’t configure the **Co-sell with Microsoft** tab of the DEV offer.

### Resell through CSPs

Don’t configure the **Resell through CSPs** tab of the DEV offer.

## Next steps

- [Create a SaaS offer](create-new-saas-offer.md)
