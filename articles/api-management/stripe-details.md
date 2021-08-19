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

You can configure the API Management and Stripe to implement products defined in the revenue model (Free, Developer, PAYG, Basic, Standard, Pro, Enterprise). Once implemented, API consumers can browse, select, and subscribe to products via the developer portal.

To deliver a consistent end-to-end API consumer experience, you'll synchronize the API Management product policies and the Stripe configuration using a shared configuration file [payment/monetizationModels.json](../payment/monetizationModels.json).

In this demo project, we'll implement the example revenue model defined in [the monetization overview](./how-to-think-about-monetization.md#step-4---design-the-revenue-model) to demonstrate integrating Azure API Management with Stripe.

## Stripe 

As a tech company, [Stripe](https://stripe.com/) builds economic infrastructure for the internet. Stripe provides a fully featured payment platform. With Stripe's platform, you can monetize your APIs hosted in Azure API Management to API consumers. 

Both API Management and Stripe define the concept of products and subscriptions, but only Stripe has the notion of pricing.

In Stripe, you can define one or more associated prices against a product. Recurring prices (billed more than once) can be `Licensed` or `Metered`.

| Recurring prices | Description |
| ---------------- | ----------- |
| `Licensed` | Billed automatically at the given interval. In the example, it's set to monthly. |
| `Metered` | Calculates the monthly cost based on <ul><li>Usage records</li> <li>The set price per unit</li></ul> |

The following table builds on the conceptual revenue model in [the monetization overview](how-to-think-about-monetization.md) and provides more detail about implementing using API Management and Stripe:

| Products implemented in both API Management and Stripe | Pricing model    | Stripe configuration                                                                                                                                                      | Quality of service (API Management product policies)                                                                  |
|------------------------------------------------|------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| Free                                           | `Free`           | No configuration required.                                                                                                                                                | Quota set to limit the consumer to 100 calls/month.                                                        |
| Developer                                      | `Freemium `      | Metered, graduated tiers: <ul><li>First tier flat amount is $0.</li><li>Next tiers per unit amount charge set to charge $0.20/100 calls.</li></ul>                                     | No quota set. Consumer can continue to make and pay for calls with a rate limit of 100 calls/minute.              |
| PAYG                                           | `Metered`        | Metered. Price set to charge consumer $0.15/100 calls.                                                                                                                  | No quota set. Consumer can continue to make and pay for calls with a rate limit of 200 calls/minute.              |
| Basic                                          | `Tier`           | Licensed. Price set to charge consumer $14.95/month.                                                                                                                    | Quota set to limit the consumer to 50,000 calls/month with a rate limit of 100 calls/minute.                   |
| Standard                                       | `Tier + Overage` | Metered, graduated tiers: <ul><li>First tier flat amount is $89.95/month for first 100,000 calls.</li><li>Next tiers per unit amount charge set to charge $0.10/100 calls.</li></ul>  | No quota set. Consumer can continue to make and pay for extra calls with a rate limit of 100 calls/minute.   |
| Pro                                            | `Tier + Overage` | Metered, graduated tiers: <ul><li>First tier flat amount is $449.95/month for first 500,000 calls.</li><li>Next tiers per unit amount charge set to charge $0.06/100 calls.</li></ul> | No quota set. Consumer can continue to make and pay for extra calls with a rate limit of 1,200 calls/minute. |
| Enterprise                                     | `Unit`           | Metered, graduated tiers. Every tier flat amount is $749.95/month for 1,500,000 calls.                                                                            | No quota set. Consumer can continue to make and pay for extra calls with a rate limit of 3,500 calls/minute. |

## Architecture

The following diagram illustrates: 
* The components of the solution across API Management, the billing app, and Stripe. 
* The major integration flows between components, including the interactions between the API consumer (both developer and application) and the solution.

:::image type="content" source="./media/adyen-details/architecture-stripe.png" alt-text="Stripe architecture overview":::

## API consumer flow

The API consumer flow describes the end-to-end user journey supported by the solution. Typically, the API consumer is a developer tasked with integrating their organization's own application with your API. The API consumer flow aims to support bringing the user from API discovery, through API consumption, to paying for API usage.

### API consumer flow

1. Consumer selects **Sign up** in the API Management developer portal.
2. Developer portal redirects consumer to the billing portal app to register their account via [API Management delegation](api-management-howto-setup-delegation.md).
3. Upon successful registration, consumer is authenticated and returned back to the developer portal.
4. Consumer selects a product to subscribe to in the developer portal.
5. Developer portal redirects consumer to the billing portal app via delegation.
6. Consumer enters a display name for their subscription and selects checkout.
7. Stripe checkout session starts, using the product definition to retrieve the product prices.
8. Consumer inputs credit card details into Stripe checkout session.
9. On successful checkout, the API Management subscription is created and enabled.
10. Based on the product and usage amount, consumer is billed monthly.
11. If payment fails, subscription is suspended.

### Steps 1 - 3: Register an account

1. Find the developer portal for an API Management service at `https://{ApimServiceName}.developer.azure-api.net`.
1. Select **Sign Up** to be redirected to the billing portal app.
1. On the billing portal app, register for an account.
    * This is handled via [user registration delegation](api-management-howto-setup-delegation.md#-delegating-developer-sign-in-and-sign-up).
1. Upon successful account creation, the consumer is authenticated and redirected to the developer portal.

Once the consumer creates an account, they'll only need to sign into the existing account to browse APIs and products from the developer portal.

### Steps 4 - 5: Subscribes to products and retrieve API keys

1. Log into the developer portal.
1. Search for a product and select **Subscribe** to begin a new subscription. 
1. Consumer will be redirected to the billing portal app. 
   * This is handled via [product subscription delegation](api-management-howto-setup-delegation.md#-delegating-product-subscription).

### Steps 5 - 6: Billing portal

1. Once redirected to the billing portal, enter a display name for the subscription.
1. Select **Checkout** to be redirected to the Stripe checkout page.

### Steps 7 - 8: Stripe checkout session

1. From the Stripe checkout page, [create a new Stripe checkout session](https://stripe.com/docs/api/checkout/sessions) using a [checkout session API](../app/src/routes/stripe.ts) defined within the application.
1. Pass into this API:
    * The API Management user ID.
    * The API Management product ID you wish to activate.
    * The URL to return to on checkout completion.
1. With the product name, retrieve the list of prices linked to that product within Stripe using the [Stripe Node SDK](https://stripe.com/docs/api?lang=node).
    * You can also use the monetization model API to retrieve the registered product type using the product name (`Freemium`, `Metered`, `Tier`, `TierWithOverage`, `Unit`, or `MeteredUnit`).
1. Create a Stripe checkout session using following parameters:

    | Parameter | Description |
    | --------- | ----------- |
    | **Success url** | The URL consumers are redirected to if the checkout is successful. Hosted within the web application. |
    | **Cancel url** | The URL consumers are redirected to if the checkout is cancelled. Hosted within the web application. |
    | **Payment method types** | Set to "card". |
    | **Mode** | Set to "subscription". Consumer will receive recurring charges. |
    | **Metadata** | Pass the API Management user ID, product ID, and subscription name. <ul><li>Retrieve this metadata in the event raised by creating a Stripe subscription.</li><li>Use within event listener to create associated API Management subscription.</li></ul> |
    | **Line items** | Set up a line item for the price associated with the product. |

1. Return the session ID from our API.
1. Once back in checkout view, use the `stripe.redirectToCheckout` function to:
    * Redirect the consumer to the checkout session.
    * Ask the consumer to enter their card details and authorize monthly payment at either set price or based on usage.

1. Once complete, the Consumer is redirected to the **Success URL** you passed into the Stripe checkout session.

### Step 9: API Management subscription created

1. Once you've successfully completed a checkout session and create a Stripe subscription, a `customer.subscription.created` event is raised within Stripe. 
    * As part of the Stripe initialization, a webhook was defined to listen for this event. 
1. Within our web application, add a [listener for these events](../app/src/routes/stripe.ts).
1. The event data attached to these events contains all the data defined on the `StripeCheckoutSession`. When a new event is raised, retrieve the metadata attached to the checkout session. 
    * Earlier, when setting up the session, you set this as the API Management user ID, product ID, and subscription name.
1. Within the listener, create the API Management subscription via the API Management service management API. 
    * The web app authenticates to the API Management management API using a service principal. The service principal credentials are available via the app settings. 
1. Consumer's paid subscription is created.
1. Consumer starts using API keys to access the APIs provided by subscription. 

### Step 10: Billing

#### Non-metered prices

Stripe will automatically charge the consumer each billing period by their fixed amount.

#### Metered prices

[Report the consumer's usage to Stripe](https://stripe.com/docs/billing/subscriptions/metered-billing#reporting-usage) using the logic in the [StripeBillingService](../app/src/services/stripeBillingService.ts). Once you've reported usage, Stripe calculates the amount to charge.

1. Register a daily CRON job to:
    * Run a function for querying usage from API Management using the API Management management API. 
    * Posts the number of units of usage to Stripe. 
1. At the end of each billing period, Stripe will automatically calculate the amount to charge based on the reported usage.

### Step 11: Subscription suspended

Along with the `customer.subscription.created` event, the webhook listener also listens for the `customer.subscription.updated` and `customer.subscription.deleted` events. 

If the subscription is cancelled or moves into an unpaid state, update the API Management subscription into a suspended state so that the consumer can no longer access the APIs.

## Next steps

* [Deploy demo with Stripe](stripe-deploy.md) as described in this document.
* Learn about how [API Management integrates with the Adyen](adyen-details.md) payment option. 