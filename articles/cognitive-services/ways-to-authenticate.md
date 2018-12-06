---
title: Authentication
titleSuffix: Cognitive Services - Azure
description: "There are three ways to authenticate a request to an Azure Cognitive Services resource: a subscription key, a bearer token, or an all-in-one subscription. In this article, you'll learn about each method, and how to make a request."
services: cognitive-services
author: erhopf
manager: cgronlun
ms.service: cognitive-services
ms.topic: article
ms.date: 12/06/2018
ms.author: erhopf
---

# Authenticate requests to Azure Cognitive Services

Each request to an Azure Cognitive Service must include an authentication header. The authentication header passes along a subscription key or access token, which is used to validate your subscription for a service or group of services. In this article, you'll learn about three ways to authenticate a request and the requirements for each.

* [Authenticate with a subscription key for a single resource](#)
* [Authenticate with an all-in-one-subscription key](#)
* [Authenticate with a Bearer token](#)

## Authentication headers

Before we get to deep into authentication, let's quickly review the authentication headers available for use with Azure Cognitive Services.

| Header | Description |
|--------|-------------|
| Ocp-Apim-Subscription-Key | Use this header to authenticate with a subscription key for a specific resource or with a subscription key for an all-in-one subscription. If using an all-in-one subscription key, the region for your subscription must be provided as the `Ocp-Apim-Subscription-Region` header. |
| Ocp-Apim-Subscription-Region | Use this header to specify the region for an all-in-one-subscription. This header is required when passing an all-in-one subscription key as the `Ocp-Apim-Subscription-Key` header. |
| Authorization | Use this header if you are using an authentication token. The steps to perform a token exchange are detailed in the following sections. The value provided follows this format: `Bearer <TOKEN>`. |

## Authenticate with a subscription key

The first option is to authenticate a request with a subscription key for a specific service, like Translator Text. The keys are available in the Azure portal for each resource that you've created. To use a subscription key to authenticate a request, it must be passed along as the `Ocp-Apim-Subscription-Key` header.

Here's a sample request to the Translator Text API using cURL that demonstrates how to use the `Ocp-Apim-Subscription-Key` header. Keep in mind, when using this sample you'll need to include a valid subscription key.

```cURL
curl -X POST 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=de' \
-H 'Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY' \
-H 'Content-Type: application/json' \
--data-raw '[{ "text": "How much for the cup of coffee?" }]' | json_pp
```

## Authenticate with an all-in-one subscription key

This option also uses a subscription key to authenticate requests for a specific resource. The main difference is that a subscription key is not tied to a specific service, rather, a single key can be used to authenticate requests for multiple services. See [Cognitive Services pricing](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/) for information about regional availability, supported features, and pricing.

The subscription key is provided in each request as the `Ocp-Apim-Subscription-Key` header. Additionally, when using all-in-one authentication, you must specify the region for your subscription using the `Ocp-Apim-Subscription-Region` header.

>[!WARNING]
> At this time, these services are **not** supported: QnA Maker, Speech Services, and Custom Vision.

## Authenticate with a Bearer token

## See also

* [What is Cognitive Services?](welcome.md)
* [Create an account](cognitive-services-apis-create-account.md)
