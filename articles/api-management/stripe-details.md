---
title: How to implement monetization with Azure API Management and Stripe 
description: Implement a revenue model by integrating Azure API Management with Stripe. 
author: v-hhunter
ms.author: v-hhunter
ms.date: 08/20/2021
ms.topic: article
ms.service: api-management
---

# How to implement monetization with Azure API Management and Stripe

APIM and Stripe are configured to create Products that mirror those defined in the revenue model (Free, Developer, PAYG, Basic, Standard, Pro, Enterprise). This allows API Consumers to browse, select a product and subscribe to it, all via the Development Portal.

To deliver a consistent end-to-end API Consumer experience, the APIM Product Policies, Billing App and Stripe Product Configuration needs to be synchronized.  This is achieved through use of a shared configuration file [payment/monetizationModels.json](../payment/monetizationModels.json).

In this demo project we implement the example revenue model that is defined in [How to think about monetization](./how-to-think-about-monetization.md##step-4---design-the-revenue-model) to show how this can be implemented by integrating Azure API Management (APIM) with Stripe.


## Azure API Management Products 

APIM is configured to create Products that mirror the revenue model (Free, Developer, PAYG, Basic, Standard, Pro, Enterprise). This allows API Consumers to browse, select a product and subscribe to it, all via the Development Portal.

## Stripe 

[Stripe](https://stripe.com/) is a technology company that builds economic infrastructure for the internet. It provies a fully featured payment platform, which enables you, as an "API Producer", to monetize your APIs hosted in Azure API Management (APIM) to "API Consumers". 

Both APIM and Stripe define the concept of products and subscriptions, but only Stripe has the notion of pricing.

In Stripe you can define one or more associated prices against a product. For recurring prices (billed more than once) these prices can be `Licensed` or `Metered`:

- A `Licensed` price will be billed automatically at the given interval (in the example it is set to monthly). 
- A `Metered` price will calculate the cost per month based on usage records and the set price per unit.

The following table builds on the conceptual revenue model in [How to think about monetization](how-to-think-about-monetization.md) to provide additional detail about how this can be implemented using APIM and Stripe:

| Products - implemented in both APIM and Stripe | Pricing model    | Stripe configuration                                                                                                                                                      | Quality of service (APIM Product Policies)                                                                  |
|------------------------------------------------|------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| Free                                           | `Free`           | No configuration required.                                                                                                                                                | Quota set to limit the Consumer to 100 calls / month                                                        |
| Developer                                      | `Freemium `      | Metered - graduated tiers, where the first tier flat amount is $0, next tiers per unit amount charge set to charge $0.20 / 100 calls.                                     | No quota set - Consumer can continue to make & pay for calls, rate limit of 100 calls / minute              |
| PAYG                                           | `Metered`        | Metered - price set to charge Consumer $0.15 / 100 calls                                                                                                                  | No quota set - Consumer can continue to make & pay for calls, rate limit of 200 calls / minute              |
| Basic                                          | `Tier`           | Licensed - price set to charge Consumer $14.95 / month                                                                                                                    | Quota set to limit the Consumer to 50,000 calls / month, rate limit of 100 calls / minute                   |
| Standard                                       | `Tier + Overage` | Metered - graduated tiers, where the first tier flat amount is $89.95 / month for first 100,000 calls, next tiers per unit amount charge set to charge $0.10 / 100 calls  | No quota set - Consumer can continue to make & pay for additional calls, rate limit of 100 calls / minute   |
| Pro                                            | `Tier + Overage` | Metered - graduated tiers, where the first tier flat amount is $449.95 / month for first 500,000 calls, next tiers per unit amount charge set to charge $0.06 / 100 calls | No quota set - Consumer can continue to make & pay for additional calls, rate limit of 1,200 calls / minute |
| Enterprise                                     | `Unit`           | Metered - graduated tiers, where every tier flat amount is $749.95 / month for 1,500,000 calls                                                                            | No quota set - Consumer can continue to make & pay for additional calls, rate limit of 3,500 calls / minute |

## Architecture

The following diagram illustrates the components of the solution across APIM, the Billing App (both hosted on Azure) and Stripe.  It also shows the major integration flows between components, including the interactions between the API Consumer (both developer and application) and the solution.

![](./architecture-stripe.png)

## API Consumer flow

This section describes the end to end user journey that the solution is seeking to support.  The API Consumer is typically a developer who has been tasked with integrating their organisation's own application with your API.  The API Consumer flow therefore aims to support getting the user from the point of discovering the API, through being to consume the API, to paying for the usage.

The API Consumer flow is as follows:

1. Consumer selects sign up in the APIM developer portal.
2. Consumer is redirected to the billing portal app to register their account (via [APIM delegation](https://docs.microsoft.com/en-us/azure/api-management/api-management-howto-setup-delegation)).
3. Consumer is redirected back to the APIM developer portal, authenticated.
4. Consumer selects a product to subscribe to in the APIM developer portal.
5. Consumer is redirected to the billing portal app (via [APIM delegation](https://docs.microsoft.com/en-us/azure/api-management/api-management-howto-setup-delegation)).
6. Consumer inputs a display name for their subscription and selects checkout.
7. Stripe checkout session is started, using the product definition to retrieve the prices for that product.
8. Consumer inputs credit card details into Stripe checkout session.
9. If checkout is successful, the APIM subscription is created and enabled.
10. Consumer is billed monthly based on product they have signed up for and usage.
11. If payment fails, subscription is suspended.

### Consumer registers an account *(Step 1, 2, 3)*

From the APIM developer portal (defined for your APIM account), consumers can browse APIs and products. 

The developer portal for an APIM service is located at:

`https://{ApimServiceName}.developer.azure-api.net`

However, they cannot create a product subscription until they have created a user account.

On selecting 'Sign Up', the user is redirected to the billing portal app where they can enter their details to create an account. This is handled via [user registration delegation](https://docs.microsoft.com/en-us/azure/api-management/api-management-howto-setup-delegation#-delegating-developer-sign-in-and-sign-up).

On successful account creation, the consumer is redirected to the APIM developer portal, authenticated.

Once an account has been created, in future the consumer can just sign in to the account.

### Consumer subscribes to APIM product and retrieves API keys *(Step 4, 5)*

From the APIM developer portal, consumers can browse products.

From here, a consumer can select a product to create a new subscription. They will be redirected to the billing portal app when they select 'Subscribe'. This is handled via [product subscription delegation](https://docs.microsoft.com/en-us/azure/api-management/api-management-howto-setup-delegation#-delegating-product-subscription).

### Billing portal *(Step 5, 6)*

Once redirected to the billing portal, the consumer can enter a display name for their subscription and select 'Checkout', where they will be redirected to the checkout page.

### Stripe checkout session *(Step 7, 8)*

From the checkout page, we use a [checkout sesion API](../app/src/routes/stripe.ts), which is defined within the application, to [create a new Stripe checkout session](https://stripe.com/docs/api/checkout/sessions).

Into this API, we pass the ID of the APIM user and the APIM product that the Consumer wants to activate, and the URL to return to on completion of checkout.

Using the name of the product, we retrieve the list of prices that are linked to that product within Stripe using the [Stripe Node SDK](https://stripe.com/docs/api?lang=node).

We also use the monetization model API to retrieve the product type that the Consumer has signed up for using the name of the product (this will be `Freemium`, `Metered`, `Tier`, `TierWithOverage`, `Unit`, or `MeteredUnit`).

We then create a Stripe checkout session using following parameters:

- Success url: the URL to redirect to if the checkout is successful (hosted within the web application)
- Cancel url: the URL to redirect to if the checkout is cancelled (also hosted within the application)
- Payment method types: Here we are just using "card"
- Mode: This is set to "subscription" which means that the Consumer will be charged on a recurring basis
- Metadata: Here we pass the APIM user ID, APIM product ID, and the subscription name. We can retrieve this metadata in the event that is raised when the Stripe subscription is created, so we can then use this within our event listener to create the associated APIM subscription.
- Line items: Here we need to set up a line item for the price associated with the product.

We then return the session ID from our API.

Back in the checkout view, we now use the `stripe.redirectToCheckout` function to redirect the Consumer to the checkout session. They will then be asked to enter their card details and authorise monthly payment (either at a set price, based on usage).

Once complete, the Consumer is redirected to the success URL passed into the stripe checkout session.

### APIM Subscription created *(Step 9)*

When a checkout session is successfully completed and a Stripe subscription is created, a `customer.subscription.created` event is raised within Stripe. As part of our Stripe initialisation, we defined a webhook which can be used to listen for these events. 

Within our web application, we have then added a [listener for these events](../app/src/routes/stripe.ts).

The event data which is attached to these events contains all the data defined on the `StripeCheckoutSession`. Therefore, when a new event is raised, we can retrieve the metadta which was attached to the checkout session. When we were setting up the session, we set this as the APIM user ID, APIM product ID, and the subscription name.

Therefore, within the listener, we can now create the APIM subscription via the API Management Service Management API. Here the web app authenticates to the APIM management API using a service principal, with the credentials for that principal available via the app settings. 

The subscription that the Consumer has paid for will then be created, and they will be able to start using their API keys to access the APIs which that subscription provides them access to.

### Billing *(Step 10)*

For products using non-metered prices, Stripe will automatically charge the Consumer each billing period by their fixed amount.

For metered prices, we need to [report the Consumer's usage to Stripe](https://stripe.com/docs/billing/subscriptions/metered-billing#reporting-usage) so that Stripe can calculate the amount to charge. The logic for doing this is in the [StripeBillingService](../app/src/services/stripeBillingService.ts).

To do this, we register a daily cron job which runs a function for querying usage from APIM using the APIM Management API, and then posts the number of units of usage to Stripe. At the end of each billing period, Stripe will automatically calculate the amount to charge based on the reported usage.

### Subscription suspended *(Step 11)*

The webhook listener also listens for `customer.subscription.updated` and `customer.subscription.deleted` events. If the subscription is cancelled or moves into an unpaid state, we update the APIM subscription into a suspended state so that the Consumer can no longer access our APIs.

## Next steps

Follow [Deploy demo with Stripe](stripe-deploy.md) to deploy the solution described in this document.