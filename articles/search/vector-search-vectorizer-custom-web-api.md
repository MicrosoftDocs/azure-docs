---
title: Custom Web API vectorizer
titleSuffix: Azure AI Search
description: Use the Custom Web API vectorizer to integrate your custom code for generating embeddings at query time.
author: careyjmac
ms.author: chalton
ms.service: cognitive-search
ms.custom:
  - build-2024
ms.topic: reference
ms.date: 05/28/2024
---

# Custom Web API vectorizer

> [!IMPORTANT] 
> This feature is in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The [2023-10-01-Preview REST API](/rest/api/searchservice/indexes/create-or-update?view=rest-searchservice-2023-10-01-preview&preserve-view=true) and later preview REST APIs support this feature.

The **custom web API** vectorizer allows you to configure your search queries to call out to a Web API endpoint to generate embeddings at query time. The structure of the JSON payload required to be implemented in the provided endpoint is described further down in this document. Your data is processed in the [Geo](https://azure.microsoft.com/explore/global-infrastructure/data-residency/) where your model is deployed. 

## Vectorizer parameters

Parameters are case-sensitive.

| Parameter name	 | Description |
|--------------------|-------------|
| `uri` | The URI of the Web API to which the JSON payload is sent. Only the **https** URI scheme is allowed. |
| `httpMethod` | The method to use while sending the payload. Allowed methods are `PUT` or `POST` |
| `httpHeaders` | A collection of key-value pairs where the keys represent header names and values represent header values that are sent to your Web API along with the payload. The following headers are prohibited from being in this collection:  `Accept`, `Accept-Charset`, `Accept-Encoding`, `Content-Length`, `Content-Type`, `Cookie`, `Host`, `TE`, `Upgrade`, `Via`. |
| `authResourceId` | (Optional) A string that if set, indicates that this vectorizer should use a managed identity on the connection to the function or app hosting the code. This property takes an application (client) ID or app's registration in Microsoft Entra ID, in a [supported format](../active-directory/develop/security-best-practices-for-app-registration.md#application-id-uri): `api://<appId>`. This value is used to scope the authentication token retrieved by the indexer, and is sent along with the custom Web API request to the function or app. Setting this property requires that your search service is [configured for managed identity](search-howto-managed-identities-data-sources.md) and your Azure function app is [configured for a Microsoft Entra sign in](../app-service/configure-authentication-provider-aad.md). |
| `authIdentity`   | (Optional) A user-managed identity used by the search service for connecting to the function or app hosting the code. You can use either a [system or user managed identity](search-howto-managed-identities-data-sources.md). To use a system manged identity, leave `authIdentity` blank. |
| `timeout` | (Optional) When specified, indicates the timeout for the http client making the API call. It must be formatted as an XSD "dayTimeDuration" value (a restricted subset of an [ISO 8601 duration](https://www.w3.org/TR/xmlschema11-2/#dayTimeDuration) value). For example, `PT60S` for 60 seconds. If not set, a default value of 30 seconds is chosen. The timeout can be set to a maximum of 230 seconds and a minimum of 1 second. |

## Supported vector query types

The Custom Web API vectorizer supports `text`, `imageUrl`, and `imageBinary` vector queries.

## Sample definition

```json
"vectorizers": [
    {
        "name": "my-custom-web-api-vectorizer",
        "kind": "customWebApi",
        "customWebApiParameters": {
            "uri": "https://contoso.embeddings.com",
            "httpMethod": "POST",
            "httpHeaders": {
                "api-key": "0000000000000000000000000000000000000"
            },
            "timeout": "PT60S",
            "authResourceId": null,
            "authIdentity": null
        },
    }
]
```

## JSON payload structure

The required JSON payload structure that is expected for an endpoint when using it with the custom web API vectorizer is the same as that of the custom web API skill, which is discussed in more detail in [the documentation for the skill](cognitive-search-custom-skill-web-api.md#sample-input-json-structure).

There are the following other considerations to make when implementing a web API endpoint to use with the custom web API vectorizer.

+ The vectorizer sends only one record at a time in the `values` array when making a request to the endpoint.
+ The vectorizer passes the data to be vectorized in a specific key in the `data` JSON object in the request payload. That key is `text`, `imageUrl`, or `imageBinary`, depending on which type of vector query was requested.
+ The vectorizer expects the resulting embedding to be under the `vector` key in the `data` JSON object in the response payload.
+ Any errors or warnings returned by the endpoint are ignored by the vectorizer and not obtainable for debugging purposes at query time.
+ If an `imageBinary` vector query was requested, the request payload sent to the endpoint is the following:

    ```json
    {
        "values": [
            {
                "recordId": "0",
                "data":
                {
                    "imageBinary": {
                        "data": "<base 64 encoded image binary data>"
                    }
                }
            }
        ]
    }
    ```

## See also

+ [Integrated vectorization](vector-search-integrated-vectorization.md)
+ [How to configure a vectorizer in a search index](vector-search-how-to-configure-vectorizer.md)
+ [Custom Web API skill](cognitive-search-custom-skill-web-api.md)
+ [Hugging Face Embeddings Generator power skill (can be used for a custom web API vectorizer as well)](https://github.com/Azure-Samples/azure-search-power-skills/tree/main/Vector/EmbeddingGenerator)