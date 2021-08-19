---
title: How to implement monetization with Azure API Management and Adyen 
description: Implement a revenue model by integrating Azure API Management with Adyen. 
author: v-hhunter
ms.author: v-hhunter
ms.date: 08/20/2021
ms.topic: article
ms.service: api-management
---

# How to implement monetization with Azure API Management and Adyen

You can configure the API Management and Adyen to implement products defined in the revenue model (Free, Developer, PAYG, Basic, Standard, Pro, Enterprise). Once implemented, API consumers can browse, select, and subscribe to products via the developer portal.

To deliver a consistent end-to-end API consumer experience, you'll synchronize the API Management product policies and the Adyen configuration using a shared configuration file [payment/monetizationModels.json](../payment/monetizationModels.json).

In this demo project, we'll implement the example revenue model defined in [the monetization overview](monetization-overview.md#step-4---design-the-revenue-model) to demonstrate integrating Azure API Management with Adyen.

## Adyen 

[Adyen](https://adyen.com/) is a payment provider with which you can securely take payment from consumers.

With Adyen, you can [tokenize](https://docs.adyen.com/online-payments/tokenization) a consumer's card details to be:

* Securely stored by Adyen.
* Used to authorize recurring transactions.

## Architecture

The following diagram illustrates:
* The components of the solution across API Management, the billing app, and Adyen. 
* The major integration flows between components, including the interactions between the API consumer (both developer and application) and the solution.

:::image type="content" source="./media/adyen-details/architecture-adyen.png" alt-text="Adyen architecture overview":::

## API consumer flow

The API consumer flow describes the end-to-end user journey supported by the solution. Typically, the API consumer is a developer tasked with integrating their organization's own application with your API. The API consumer flow aims to support bringing the user from API discovery, through API consumption, to paying for API usage.

### API consumer flow

1. Consumer selects **Sign up** in the API Management developer portal.
2. Developer portal redirects consumer to the billing portal app to register their account via [API Management delegation](api-management-howto-setup-delegation.md).
3. Upon successful registration, consumer is authenticated and returned back to the developer portal.
4. Consumer selects a product to subscribe to in the developer portal.
5. Developer portal redirects consumer to the billing portal app via delegation.
6. Consumer enters a display name for their subscription and selects checkout.
7. Billing portal app redirects consumer to an embedded Adyen checkout page to enter their payment details.
8. Adyen saves their payment details.
9. Consumer's API Management subscription is created.
10. Usage calculates the invoice monthly, which is then charged to the consumer.

### Steps 1 - 3: Register an account

1. Find the developer portal for an API Management service at `https://{ApimServiceName}.developer.azure-api.net`.
1. Select **Sign Up** to be redirected to the billing portal app.
1. On the billing portal app, register for an account. 
    * This is handled via [user registration delegation](api-management-howto-setup-delegation.md#-delegating-developer-sign-in-and-sign-up).
1. Upon successful account creation, the consumer is authenticated and redirected to the developer portal.

Once the consumer creates an account, they'll only need to sign into the existing account to browse APIs and products from the developer portal.

### Steps 4 - 5: Subscribe to products and retrieve API keys

1. Log into the developer portal account.
1. Search for a product and select **Subscribe** to begin a new subscription. 
1. Consumer will be redirected to the billing portal app. 
   * This is handled via [product subscription delegation](api-management-howto-setup-delegation.md#-delegating-product-subscription).

### Steps 5 - 6: Billing portal

1. Once redirected to the billing portal, enter a display name for the subscription.
1. Select **Checkout** to be redirected to the Adyen checkout page.

### Steps 7 - 8: Adyen checkout

1. On the [Adyen checkout page](../app/src/views/checkout-adyen.ejs), enter the payment details. 
   * This page collects the consumer's payment details using an Adyen plugin. 
1. Once the card details are confirmed, Adyen sends the request through to the [API for initiating payments](../app/src/routes/adyen.ts). 
1. Create a 0-amount payment for the consumer, passing in:
   * A flag to store the payment method and keep the card on file. 
   * The API Management user ID as the shopper reference.
   * A combination of the API Management user ID, API Management product ID, and subscription name as payment reference.

The saved card details will be used for future transactions related to this subscription.

### Step 9: API Management subscription created

Once the consumer's payment details have been successfully tokenized, we create their API Management subscription so they can use their API keys and access the APIs provided under the subscribed product. 

Unlike the [Stripe](./stripe-deploy.md) implementation, Adyen's subscription creation is done as part of the same API call, with no need for a callback/webhook.

### Step 10: Billing

On the first of each month, a [CRON job](https://www.npmjs.com/package/node-cron) is run. The CRON job is defined in the main [index.ts file](../app/src/index.ts) for the app, and:  
* Calls into the [calculateInvoices method on the AdyenBillingService](../src/services/AdyenBillingService.ts) to calculate the invoices for all API Management subscriptions. 
* Charges the consumer's cards.

This method contains the logic for calculating the payment amount, using:
* The product to which the consumer has subscribed.
* The usage data from API Management.

1. The CRON job calculates `UsageUnits` by dividing the total number of API calls by 100 (since our pricing model works in units of 100 calls).

1. The following logic is used to calculate the amount, based on the pricing model for the product:

    ```ts
     // Calculate the amount owing based on the pricing model and usage
      switch (monetizationModel.pricingModelType) {
          case "Free":
              amount = 0;
              currency = "";
              break;
          case "Freemium":
          case "TierWithOverage":
              // We floor this calculation as consumers only pay for full units used
              let usageOverage = Math.floor(usageUnits - monetizationModel.prices.unit.quota);

              if (usageOverage < 0) {
                  usageOverage = 0;
              }

              amount = monetizationModel.prices.unit.unitAmount + usageOverage * monetizationModel.prices.metered.unitAmount;
              currency = monetizationModel.prices.metered.currency;
              break;
          case "Tier":
              amount = monetizationModel.prices.unit.unitAmount;
              currency = monetizationModel.prices.unit.currency;
              break;
          case "Metered":
              // We floor this calculation as consumers only pay for full units used
              amount = Math.floor(usageUnits) * monetizationModel.prices.metered.unitAmount;
              currency = monetizationModel.prices.metered.currency;
              break;
          case "Unit":
              // We ceiling this calculation as for "Unit" prices, you buy full units at a time
              let numberOfUnits = Math.ceil(usageUnits / monetizationModel.prices.unit.quota);

              // The minimum units that someone pays for is 1
              if (numberOfUnits <= 0) {
              numberOfUnits = 1;
              }

              amount = numberOfUnits * monetizationModel.prices.unit.unitAmount;
              currency = monetizationModel.prices.unit.currency;
              break;
          default:
              break;
      }
    }

    ```

1. The invoices are passed to the `takePaymentViaAdyen` function. 
   * This uses the API Management user ID to retrieve the stored payment methods for the subscription. 
1. We use the ID of the stored payment method to authorize a payment for the amount on the invoice.

### Step 11: Subscription suspended

If the payment fails, the API Management subscription is placed in a suspended state.

## Next steps

* Follow [Deploy demo with Adyen](tutorial-adyen-deploy.md) to deploy the solution described in this document.
* See if [deploying with Stripe](stripe-details.md) is a better method for you.