---
title: SaaS fulfillment APIs in the Microsoft commercial marketplace 
description: An introduction to the fulfillment APIs that enable you to integrate your SaaS offers in Microsoft AppSource and Azure Marketplace.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 11/09/2021
author: arifgani
ms.author: argani
---

# SaaS fulfillment APIs in the Microsoft commercial marketplace

The SaaS Fulfillment APIs enable publishers, also known as independent software vendors (ISVs), to publish and sell their SaaS applications in Microsoft AppSource, Azure Marketplace, and Azure portal. These APIs enable ISV applications to participate in all commerce enabled channels: direct, partner-led (reseller), and field-led. Integrating with these APIs is a requirement for creating and publishing a transactable SaaS offer in Partner Center.

To learn about the SaaS fulfillment APIs, we recommend you also read the following articles:
- [Managing the SaaS subscription life cycle](pc-saas-fulfillment-life-cycle.md)
- [SaaS fulfillment Subscription APIs v2](pc-saas-fulfillment-subscription-api.md)
- [SaaS fulfillment Operations APIs v2](pc-saas-fulfillment-operations-api.md)
- [Implementing a webhook on the SaaS service](pc-saas-fulfillment-webhook.md)
- [Common questions about SaaS fulfillment APIs](saas-fulfillment-apis-faq.yml)

## API flows

ISVs must implement the following API flows by adding into their SaaS service code to maintain the same subscription status for both ISVs and Microsoft:

* Landing page flow:  Microsoft notifies the publisher that the publisher's SaaS offer has been purchased by a customer in the marketplace.
* Activation flow:  Publisher notifies Microsoft that a newly purchased SaaS account has been configured on the publisher's side.
* Update flow: Change of purchased plan or the number of purchased seats or both.
* Suspend and reinstate flow: Suspending the purchased SaaS offer in case the customer's payment method is no longer valid. The suspended offer can be reinstated when the issue with payment method is resolved.
* Webhook flows: Microsoft will notify the publisher about SaaS subscription changes and cancellation triggered by the customer from the Microsoft side.

For the cancellation of the purchased SaaS subscription, integration is optional, because it can be done by the customer from Microsoft side.

Correct integration with SaaS Fulfillment APIs is critical for making sure that:

* End customers who purchased the publisher's SaaS offer are billed correctly by Microsoft.
* End customers are getting the correct user experience purchasing, configuring, using, and managing SaaS subscriptions purchased in the marketplace.

These APIs enable the publisher's offers to participate in all commerce enabled channels:

* Direct
* Partner-led (reseller, CSP)
* Field-led

In the reseller (CSP) scenario, a CSP is purchasing the SaaS offer on behalf of the end customer. A customer is expected to use the SaaS offer, but the CSP is the entity that does the following tasks:

* Bills the customer
* Changes subscription plans/amount of purchased seats
* Cancels the subscriptions

The Publisher is not required to implement any of the API call flows differently for this scenario.

For more information about CSP, refer to https://partner.microsoft.com/licensing.

>[!Warning]
>The current version of this API is version 2, which should be used for all new SaaS offers. Version 1 of the API is deprecated and is being maintained to support existing offers.

>[!Note]
>The SaaS fulfillment APIs are only intended to be called from a backend service of the publisher. Integration with the APIs directly from the publisher's web page is not supported. Only service-to-service authentication flow should be used.

## Next steps

- If you have not already done so, register your SaaS application in the [Azure portal](https://portal.azure.com) as explained in [Register an Azure AD Application](./pc-saas-registration.md).  Afterwards, use the most current version of this interface for development: [SaaS fulfillment Subscription APIs v2](pc-saas-fulfillment-subscription-api.md) and [SaaS fulfillment Operations APIs v2](pc-saas-fulfillment-operations-api.md).

**Video tutorials**

- [The SaaS Client Library for .NET](https://go.microsoft.com/fwlink/?linkid=2196324)
