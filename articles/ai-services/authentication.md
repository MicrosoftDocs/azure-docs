---
title: Authentication in Azure AI services
titleSuffix: Azure AI services
description: "There are three ways to authenticate a request to an Azure AI services resource: a resource key, a bearer token, or a multi-service subscription. In this article, you'll learn about each method, and how to make a request."
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 09/01/2022
ms.author: pafarley
---

# Authenticate requests to Azure AI services

Each request to an Azure AI service must include an authentication header. This header passes along a resource key or authentication token, which is used to validate your subscription for a service or group of services. In this article, you'll learn about three ways to authenticate a request and the requirements for each.

* Authenticate with a [single-service](#authenticate-with-a-single-service-resource-key) or [multi-service](#authenticate-with-a-multi-service-resource-key) resource key
* Authenticate with a [token](#authenticate-with-an-access-token)
* Authenticate with [Azure Active Directory (AAD)](#authenticate-with-an-access-token)

## Prerequisites

Before you make a request, you need an Azure account and an Azure AI services subscription. If you already have an account, go ahead and skip to the next section. If you don't have an account, we have a guide to get you set up in minutes: [Create a multi-service resource](multi-service-resource.md?pivots=azportal).

You can get your resource key from the [Azure portal](multi-service-resource.md?pivots=azportal#get-the-keys-for-your-resource) after [creating your account](https://azure.microsoft.com/free/cognitive-services/).

## Authentication headers

Let's quickly review the authentication headers available for use with Azure AI services.

| Header | Description |
|--------|-------------|
| Ocp-Apim-Subscription-Key | Use this header to authenticate with a resource key for a specific service or a multi-service resource key. |
| Ocp-Apim-Subscription-Region | This header is only required when using a multi-service resource key with the [Translator service](./Translator/reference/v3-0-reference.md). Use this header to specify the resource region. |
| Authorization | Use this header if you are using an access token. The steps to perform a token exchange are detailed in the following sections. The value provided follows this format: `Bearer <TOKEN>`. |

## Authenticate with a single-service resource key

The first option is to authenticate a request with a resource key for a specific service, like Translator. The keys are available in the Azure portal for each resource that you've created. To use a resource key to authenticate a request, it must be passed along as the `Ocp-Apim-Subscription-Key` header.

These sample requests demonstrates how to use the `Ocp-Apim-Subscription-Key` header. Keep in mind, when using this sample you'll need to include a valid resource key.

This is a sample call to the Translator service:
```cURL
curl -X POST 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=de' \
-H 'Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY' \
-H 'Content-Type: application/json' \
--data-raw '[{ "text": "How much for the cup of coffee?" }]' | json_pp
```

The following video demonstrates using an Azure AI services key.

## Authenticate with a multi-service resource key

You can use a [multi-service](./multi-service-resource.md) resource key to authenticate requests. The main difference is that the multi-service resource key isn't tied to a specific service, rather, a single key can be used to authenticate requests for multiple Azure AI services. See [Azure AI services pricing](https://azure.microsoft.com/pricing/details/cognitive-services/) for information about regional availability, supported features, and pricing.

The resource key is provided in each request as the `Ocp-Apim-Subscription-Key` header.

[![Multi-service resource key demonstration for Azure AI services](./media/index/single-key-demonstration-video.png)](https://www.youtube.com/watch?v=psHtA1p7Cas&feature=youtu.be)

### Supported regions

When using the [multi-service](./multi-service-resource.md) resource key to make a request to `api.cognitive.microsoft.com`, you must include the region in the URL. For example: `westus.api.cognitive.microsoft.com`.

When using a multi-service resource key with [Azure AI Translator](./translator/index.yml), you must specify the resource region with the `Ocp-Apim-Subscription-Region` header.

Multi-service authentication is supported in these regions:

- `australiaeast`
- `brazilsouth`
- `canadacentral`
- `centralindia`
- `eastasia`
- `eastus`
- `japaneast`
- `northeurope`
- `southcentralus`
- `southeastasia`
- `uksouth`
- `westcentralus`
- `westeurope`
- `westus`
- `westus2`
- `francecentral`
- `koreacentral`
- `northcentralus`
- `southafricanorth`
- `uaenorth`
- `switzerlandnorth`


### Sample requests

This is a sample call to the Translator service:

```cURL
curl -X POST 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=de' \
-H 'Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY' \
-H 'Ocp-Apim-Subscription-Region: YOUR_SUBSCRIPTION_REGION' \
-H 'Content-Type: application/json' \
--data-raw '[{ "text": "How much for the cup of coffee?" }]' | json_pp
```

## Authenticate with an access token

Some Azure AI services accept, and in some cases require, an access token. Currently, these services support access tokens:

* Text Translation API
* Speech Services: Speech to text API
* Speech Services: Text to speech API

>[!NOTE]
> QnA Maker also uses the Authorization header, but requires an endpoint key. For more information, see [QnA Maker: Get answer from knowledge base](./qnamaker/quickstarts/get-answer-from-knowledge-base-using-url-tool.md).

>[!WARNING]
> The services that support access tokens may change over time, please check the API reference for a service before using this authentication method.

Both single service and multi-service resource keys can be exchanged for authentication tokens. Authentication tokens are valid for 10 minutes. They're stored in JSON Web Token (JWT) format and can be queried programmatically using the [JWT libraries](https://jwt.io/libraries). 

Access tokens are included in a request as the `Authorization` header. The token value provided must be preceded by `Bearer`, for example: `Bearer YOUR_AUTH_TOKEN`.

### Sample requests

Use this URL to exchange a resource key for an access token: `https://YOUR-REGION.api.cognitive.microsoft.com/sts/v1.0/issueToken`.

```cURL
curl -v -X POST \
"https://YOUR-REGION.api.cognitive.microsoft.com/sts/v1.0/issueToken" \
-H "Content-type: application/x-www-form-urlencoded" \
-H "Content-length: 0" \
-H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY"
```

These multi-service regions support token exchange:

- `australiaeast`
- `brazilsouth`
- `canadacentral`
- `centralindia`
- `eastasia`
- `eastus`
- `japaneast`
- `northeurope`
- `southcentralus`
- `southeastasia`
- `uksouth`
- `westcentralus`
- `westeurope`
- `westus`
- `westus2`

After you get an access token, you'll need to pass it in each request as the `Authorization` header. This is a sample call to the Translator service:

```cURL
curl -X POST 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=de' \
-H 'Authorization: Bearer YOUR_AUTH_TOKEN' \
-H 'Content-Type: application/json' \
--data-raw '[{ "text": "How much for the cup of coffee?" }]' | json_pp
```

[!INCLUDE [](../../includes/cognitive-services-azure-active-directory-authentication.md)]

## Use Azure key vault to securely access credentials

You can [use Azure Key Vault](./use-key-vault.md) to securely develop Azure AI services applications. Key Vault enables you to store your authentication credentials in the cloud, and reduces the chances that secrets may be accidentally leaked, because you won't store security information in your application.

Authentication is done via Azure Active Directory. Authorization may be done via Azure role-based access control (Azure RBAC) or Key Vault access policy. Azure RBAC can be used for both management of the vaults and access data stored in a vault, while key vault access policy can only be used when attempting to access data stored in a vault.

## See also

* [What are Azure AI services?](./what-are-ai-services.md)
* [Azure AI services pricing](https://azure.microsoft.com/pricing/details/cognitive-services/)
* [Custom subdomains](cognitive-services-custom-subdomains.md)
