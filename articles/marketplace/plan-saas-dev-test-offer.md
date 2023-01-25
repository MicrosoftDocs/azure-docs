---
title: Plan a test and development SaaS offer in the Microsoft commercial marketplace
description: Plan a separate development offer for testing your offer in Azure Marketplace. 
author: mingshen-ms 
ms.author: mingshen
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.date: 03/29/2022
---

# Plan a test and development SaaS offer

To develop in a separate environment from your production offer, you’ll create a separate test and development (DEV) offer and a separate production (PROD) offer. This article describes the benefits of doing your development and testing in a DEV offer and the configuration differences between DEV and production offers.

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

To test multiple pricing options, you need to create a plan for each unique pricing model. To learn more, see [Plans](plan-saas-offer.md#plans).

### Not adding plans that do not target actual customers

By using a DEV offer for development and testing, you can reduce unnecessary clutter in the PROD offer. For example, you can’t delete plans you create to test different pricing models or technical configurations (without filing a support ticket). So by creating plans for testing in the DEV offer, you reduce the clutter in the PROD offer.

Clutter in the PROD offer frustrates product and marketing teams, as they expect all the plans to target actual customers. Especially with large teams that are disjointed who all want different sandboxes to work with, creating two offers will provide two different environments for DEV and PROD. In some cases, you might want to create multiple DEV offers to support a larger team who have different people running different test scenarios. Letting different team members work in the DEV offer separate from the PROD offer , helps to keep production plans as close to production-ready as possible.

Testing a DEV offer helps to avoid the 30 custom metered dimensions limit per offer. Developers can try different meter combinations in the DEV offer without affecting the custom metered dimension limit in the PROD offer.

## Configuration differences between DEV and production offers

You’ll configure most settings the same in the test and development (DEV) and production (PROD) offers. For example, the official marketing language and assets, such as screenshots and logos should be the same. In the cases where the configuration is the same, you can copy-and-paste fields from the plans in the DEV offer to the plans in the PROD offer.

The following sections describe the configuration differences between the DEV and PROD offers.

### Offer setup page

We recommend that you use the same alias in the **Alias** box of both offers but append “_test” to the alias of the DEV offer. For example, if the alias of your PROD offer is “contososolution” then the alias of the DEV offer should be “contososolution_test”. This way, you can easily identify which your DEV offer from your PROD offer.

In the **Customer leads** section, use an Azure table or a test CRM environment for the DEV offer. Use the [Referrals workspace](https://partner.microsoft.com/dashboard/referrals/v2/leads) in Partner Center or your CRM system for the PROD offer.

### Properties page

Configure this page the same in both the DEV and PROD offers.

### Offer listing page

Configure this page the same in both the DEV and PROD offers.

### Preview audience

In the DEV offer, include the Azure Active Directory (Azure AD) user principal names or Microsoft account (MSA) email addresses of developers and testers, including yourself. The user principal name of a user on Azure AD can be different than the email of that user. For example, jane.doe@contoso.com will not work but janedoe@contoso.com will. The users you designate will have access to the DEV offer when you share the **Preview** link during the development and testing phase.

In the PROD offer, include the Azure AD user principal name or Microsoft Account email of the users who will validate the offer before selecting the **Go Live button** to publish the offer live.

### Technical configuration page

This table describes the differences between the settings for DEV offers and PROD offers.

***Table 1: Technical configuration differences***

| Setting | DEV offer | PROD offer |
| ------------ | ------------- | ------------- |
| Landing page URL | Enter your dev/test endpoint. | Enter your production endpoint. |
| Connection webhook | Enter your dev/test endpoint. | Enter your production endpoint. |
| Azure Active Directory tenant ID | Enter your test app registration tenant ID (Azure AD directory ID). | Enter your production app registration tenant ID. |
| Azure Active Directory application ID | Enter your test app registration application ID (client ID). | Enter your production app registration application ID. |

### Plan visibility

We recommend that you configure your test plan as a private plan, so it’s visible only to targeted developers and testers. This provides an extra level of protection from exposing your test plan to customers if you accidentally publish the offer live.

If you choose to test your plan in a production offer instead of a DEV offer, this is especially important, so that customers will not be able to purchase the plan. We recommend that you create a separate private test plan and never publish the private test plan live. You’ll use your private test plan to do your testing in preview. When you’ve completed your testing, you will create a production plan for publishing live. Then, you can then stop distribution of the test plan.

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

When you purchase the plan, you will be charged the prices defined in the plan. To minimize your testing costs, the DEV offer should have plans with zero or low prices in the plans. For example, $0.01 (one cent). This applies to flat rate, metered billing, and per user prices. The PROD offer will have the prices you want to charge to customers.

> [!IMPORTANT]
> Purchases made in Preview will be processed for both DEV and PROD offers. If an offer has a $100/mo price, your company will be charged $100. If this happens, you can open a [support ticket](support.md) and we will issue a payout for the full amount (and take no store service fee).

You’ll set the prices you want to charge the customer in the separate production plan that you’ll publish live.

#### Pricing model

Use the same plan structure in the plans of the DEV and PROD offers. For example, if the plan in the PROD offer is Flat rate, with a monthly billing term, then configure the plan in the DEV offer using the same model.

To reduce your cost for testing the pricing models, including Marketplace custom meter dimensions, we recommend that you configure the **Pricing** section of the **Pricing and availability** tab, in the DEV offer with lower prices than the PROD offer. Here are some guidelines you can follow when setting prices for plans in the DEV offer.

***Table 2: Pricing guidelines***

| Price | Comment |
| ------------ | ------------- |
| $0.00 - $0.01 | Set a total transaction cost of zero to have no financial impact or one cent to have a low cost. Use this price when making calls to the metering APIs, or to test purchasing plans in your offer while developing your solution. |
| $0.01 | Use this price range to test analytics, reporting, and the purchase process. |
| $50.00 - $100.00 | Use this price range to test payout. For information about our payment schedule, see [Payout schedules and processes](/partner-center/payout-policy-details). |

> [!IMPORTANT]
>  To avoid being charged a store service fee on your test, open a [support ticket](support.md) within 7 days of the test purchase.

### Co-sell with Microsoft page

Don’t configure the **Co-sell with Microsoft** tab of the DEV offer.

### Resell through CSPs

On the **Resell through CSPs** tab of the DEV offer, select **No partners in the CSP program**.

## Next steps

- To learn more about plans, see [Plan a SaaS offer for the commercial marketplace](plan-saas-offer.md#plans).
- For step-by-step instructions about creating an offer, see [Create a SaaS offer](create-new-saas-offer.md)
- To test a SaaS plan, see [Test a SaaS plan overview](test-saas-overview.md)
