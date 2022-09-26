---
title: Azure API Management support for monetization 
description: Learn how Azure API Management supports monetization strategies for your API products.
author: dlepow
ms.author: danlep
ms.date: 02/10/2022
ms.topic: article
ms.service: api-management
---

# How API Management supports monetization

With [Azure API Management](./api-management-key-concepts.md) service platform, you can:
* Publish APIs, to which your consumers subscribe.
* De-risk implementation. 
* Accelerate project timescales.
* Scale your APIs with confidence.

In this document, we focus on API Management features that enable the implementation of your monetization strategy, like providing a frictionless experience to:
* Discover your public APIs.
* Enter payment details.
* Activate your subscription.
* Consume the API.
* Monitor usage.
* Automatically pay for usage of the API.

The diagram below introduces these key API Management features:

:::image type="content" source="media/monetization-support/architecture-overview.png" alt-text="Diagram of the key API Management monetization features":::

## API discovery

Launch your API and onboard API consumers using API Management's built-in developer portal. Emphasize good quality development content for the developer portal, enabling API consumers to explore and use your APIs seamlessly. Test the content and information provided for accessibility, thoroughness, and usability.

For details about how to add content and control the branding of the developer portal, see the [overview of the developer portal](./api-management-howto-developer-portal.md).

## API packaging

API Management manages how your APIs are packaged and presented using the concept of *products* and *policies*.

### Products

APIs are published [via products](./api-management-howto-add-products.md). Products allow you to define:
* Which APIs a subscriber can access.
* Specific throttling [policies](./api-management-howto-policies.md), like limiting a specific subscription to a quota of calls per month.

When an API consumer subscribes to a product, they receive an API key, which with they make calls. Initially, the subscription is set to a `submitted` state. Activate the subscription to allow subscribers to use the APIs.

Configure the API Management products to package your underlying API to mirror your revenue model, with:
* A one-to-one relationship between each tier in your revenue model.
* A corresponding API Management product.

Example projects use API Management products as the top-level means of codifying the monetization strategy. The API Management products mirror the revenue model tiers and index the specific pricing model for each tier. This setup provides a flexible, configuration-driven approach to preparing the monetization strategy.

### Policies

Apply API Management policies to control the quality of service for each product. Example projects use two specific policy features to control quality of service, in line with the revenue model:

| Policy feature | Description |
| ----- | ----- |
| **Quota** | Defines the total number of calls the user can make to the API over a specified time period. For example, "100 calls per month". Once the user reaches the quota, the calls to the API will fail and the caller will receive a `403 Forbidden` response status code. |
| **Rate limit** | Defines the number of calls over a sliding time window that can be made to the API. For example, "200 calls per minute". Designed to prevent spikes in API usage beyond the paid quality of service with the chosen product. When the call rate is exceeded, the caller receives a `429 Too Many Requests` response status code. |

For more details about policies, see the [Policies in Azure API Management](./api-management-howto-policies.md) documentation.

## API consumption

Grant access for API consumers to your APIs via products using API subscriptions.

1. API consumers establish API subscriptions when signing up for a specific API Management product. 
1. Integrate the subscription process with the payment provider using API Management delegation. 
1. Once successfully providing payment details, users gain access to the API with a generated, unique security key for the subscription.

For more information about subscriptions, see the [Subscriptions in Azure API Management](./api-management-subscriptions.md) documentation.

## API usage monitoring

Gain insights about your API usage and performance using API Management's built-in analytics. These analytics provide reports by:
* API
* Geography
* API operations
* Product
* Request
* Subscription
* Time 
* User

Review the analytics reports regularly to understand how your monetization strategy is being adopted by API consumers.

For more information, see [Get API analytics in Azure API Management](./howto-use-analytics.md).

## Security

Control the access level for each user to each product using API Management's products, API policies, and subscriptions. Prevent misuse and abuse by granting subscription-level API access if the user has successfully authenticated with the payment provider, even if the specific API product is free.

## Integration

Create a seamless monetization experience through both front-end and back-end integration between API Management and your chosen payment provider.  Use API Management delegation for front-end integration and the REST API for back-end integration.

### Delegation

In the example projects, you can use [API Management delegation](./api-management-howto-setup-delegation.md) to make custom integrations with the third-party payment providers. The demo uses delegation for both the sign-up/sign-in and product subscription experiences.

#### Sign-up/Sign-in workflow

1. Developer clicks on the sign-in or sign-up link at the API Management developer portal.
1. Browser redirects to the delegation endpoint (configured to a page in the custom billing portal app).
1. Custom billing portal app presents a sign-in/sign-up UI.
1. Upon successful sign-in/sign-up, user is authenticated and redirected back to the starting API Management developer portal page.

#### Product subscription workflow

1. Developer selects a product in the API Management developer portal and clicks on the **Subscribe** button
1. Browser redirects to the delegation endpoint (configured to a page in the custom billing portal app).
1. Custom billing portal app:
    * Presents a UI configured based on the payment provider (Stripe or Adyen).
    * Takes user through the relevant checkout process.
1. The user is redirected back to the starting API Management product page. 
    * The product will be active and the API keys will be available.

### REST API

Use the REST API for API Management to automate the operation of your monetization strategy.

The sample projects use the API to programmatically:

- Retrieve API Management products and policies to enable synchronized configuration of similar concepts in payment providers, such as Stripe.
- Poll API Management regularly to retrieve API usage metrics for each subscription and drive the billing process.

For more information, see [the REST API Azure API Management](/rest/api/apimanagement/#rest-operation-groups) overview.

## DevOps

Version control and automate deployment changes to API Management using Azure Resource Manager, including configuring features that implement your monetization strategy, like:
* Products
* Policies
* The developer portal

In example projects, the Azure Resource Manager scripts are augmented by a JSON file, which defines each API Management product's pricing model. With this augmentation, you can synchronize the configuration between API Management and the chosen payment provider. The entire solution is managed under a single source control repository, to:
* Coordinate all changes associated with the ongoing monetization strategy evolution as a single release.
* Carry out the changes, following governance and auditing requirements.

## Initialization and deployment

API Management can be deployed either through:
* The Azure portal UI, or
* An "infrastructure as code" approach using [Azure Resource Manager templates](https://azure.microsoft.com/services/arm-templates). 

## Videos

### Integrate API Management with Adyen payment gateway
> [!VIDEO https://www.microsoft.com/videoplayer/embed/RWSSq2]

### Integrate API Management with Stripe payment gateway
> [!VIDEO https://www.microsoft.com/videoplayer/embed/RWSTfp]


## Next steps

* [Learn more about API Management monetization strategies](monetization-overview.md).
* Deploy a demo Adyen or Stripe integration via the associated [Git repo](https://github.com/microsoft/azure-api-management-monetization).