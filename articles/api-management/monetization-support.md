---
title: Azure API Management support for monetization 
description: Learn how Azure API Management supports monetization strategies for your API products.
author: v-hhunter
ms.author: v-hhunter
ms.date: 06/18/2021
ms.topic: article
ms.service: api-management
---

# How API Management supports monetization

## Azure API Management Service

With [Azure API Management](https://docs.microsoft.com/en-us/azure/api-management/) service platform, you can:
* Publish APIs, to which your consumers subscribe.
* De-risk implementation. 
* Accelerate project timescales.
* Scale your APIs with confidence.

This document highlights the API management features that will enable key elements of implementing your monetization strategy.

## Prerequisites

* Deploy and initialize the sample project via instructions in the [README](../README.md) and the [deployment and initialization guide](Initialisation.md).

## API Discovery

Launch your API and onboard API consumers using the API Management developer portal. Enable API consumers to explore and use your APIs seamlessly by emphasizing quality developer portal content. Ideally, you and real API developers will test that the information provided is accessible, accurate, complete, and intuitive.

For details about how to add content and control the branding of the developer portal, see the [Overview of the developer portal](https://docs.microsoft.com/en-us/azure/api-management/api-management-howto-developer-portal) article.

## API Packaging

API Management manages how your APIs are packaged and presented using the concept of products and policies.

### Products

APIs are published [via products](https://docs.microsoft.com/en-us/azure/api-management/api-management-howto-add-products). With a product, you define:
* Which APIs a subscriber can access.
* Specific throttling [policies](https://docs.microsoft.com/en-us/azure/api-management/api-management-howto-policies), like limiting a specific subscription to a quota of calls per month.

When an API consumer subscribes to a product, they receive an API key to make calls. Initially, the subscription is set to a `submitted` state. You can activate the subscription to allow subscribers to use the APIs.

Configure the API Management products to package your underlying API to mirror your revenue model, with:
* A one-to-one relationship between each tier in your revenue model.
* A corresponding API Management product.

Example projects use API Management products as the top-level means of codifying the monetization strategy. Set up the API Management products to mirror the revenue model tiers and to index the specific pricing model for each tier. This method provides a flexible, configuration-driven approach to setting up the monetization strategy.

### Policies

Apply API Management policies to control the quality of service for each product. Example projects use two specific policy features to control quality of service, in line with the revenue model:

| Policy feature | Description |
| ----- | ----- |
| **Quota** | Defines the total number of calls the user can make to the API over a specified time period. For example, "100 calls per month". Once the user reaches the quota, the calls to the API will fail and the caller will receive a `403 Forbidden` response status code. |
| **Rate limit** | Defines the number of calls over a sliding time window that can be made to the API. For example, "200 calls per minute". Designed to prevent spikes in API usage by the API consumer beyond the paid quality of service with the chosen product. When the call rate is exceeded, the caller receives a `429 Too Many Requests` response status code. |

For more details about policies, refer to the [Policies in Azure API Management](https://docs.microsoft.com/en-us/azure/api-management/api-management-howto-policies) documentation.

## API Consumption

Grant access for API consumers to your APIs via products using API subscriptions.

1. API consumers establish API subscriptions when signing up for a API Management product. 
1. Integrate the subscription process with the payment provider using API Management delegation. 
1. Once successfully providing payment details, users gain access to the API with a generated, unique security key for the subscription.

For more information about subscriptions, please refer to the [Subscriptions in Azure API Management](https://docs.microsoft.com/en-us/azure/api-management/api-management-subscriptions) documentation.

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

For more information see [Get API analytics in Azure API Management](https://docs.microsoft.com/en-us/azure/api-management/howto-use-analytics).

## Security

Control the access level for each user to each product using API Management's products, API policies, and subscriptions. Protect against misuse and abuse by only granting subscription access to the API if the user has successfully authenticated with the payment provider, even if the specific API product is free.

## Integration

Create a seamless monetization experience users through both front-end and back-end integration between API Management and your chosen payment provider.  Use API Management delegation for front-end integration and the REST API for back-end integration.

### Delegation

The example projects use [API Management delegation](https://docs.microsoft.com/en-us/azure/api-management/api-management-howto-setup-delegation) to "hand off" authentication to the payment provider. API Management delegation:
* Creates a seamless integrated experience for both the sign up and the subscription stages of the process.
* Enables the user to adopt a single identity across API Management and the chosen payment provider.

### REST API

Use the REST API for API Management to automate the operation of your monetization strategy.

The sample projects use the API to programmatically:

- Retrieve API Management products and policies to enable synchronized configuration of similar concepts in payment providers, such as Stripe.
- Poll API Management regularly to retrieve API usage metrics for each subscription and drive the billing process.

For more information, see [the REST API Azure API Management](https://docs.microsoft.com/en-us/rest/api/apimanagement/) overview.

## DevOps

Version control and automate deployment changes to API Management using Azure Resource Manager, including configuring features that implement your monetization strategy, like:
* Products
* Policies
* The developer portal

In example projects, the Azure Resource Manager scripts are augmented by a JSON file, which defines each API Management product's pricing model. With this augmentation, you can synchronize the configuration between API Management and the chosen payment provider. The entire solution is managed under a single source control repository, to:
* Coordinate all changes associated with the ongoing monetization strategy evolution as a single release.
* Carry out the changes in accordance with governance and auditing requirements.

## Next Steps

