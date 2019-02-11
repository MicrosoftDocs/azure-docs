---
title: Azure API Management policy samples | Microsoft Docs
description: Learn about the policies available for use in Azure API Management.
services: api-management
documentationcenter: ''
author: vladvino
manager: cflower
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: sample
ms.date: 10/31/2017
ms.author: apimpm
ms.custom: mvc
---

# API Management policy samples

[Policies](api-management-howto-policies.md) are a powerful capability of the system that allows the publisher to change the behavior of the API through configuration. Policies are a collection of statements that are executed sequentially on the request or response of an API. The following table includes links to samples and gives a brief description of each sample.

|                                                                                                                                                                      |                                                                                                                                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Inbound policies**                                                                                                                                                 |                                                                                                                                                                                                                             |
| [Add a Forwarded header to allow the backend API to construct proper URLs](./policies/set-header-to-enable-backend-to-construct-urls.md?toc=api-management/toc.json) | Demonstrates how to add a Forwarded header in the inbound request to allow the backend API to construct proper URLs.                                                                                                        |
| [Add a header containing a correlation id](./policies/add-correlation-id.md?toc=api-management/toc.json)                                                             | Demonstrates how to add a header containing a correlation ID to the inbound request.                                                                                                                                        |
| [Add capabilities to a backend service and cache the response](./policies/cache-response.md?toc=api-management/toc.json)                                             | Shows how to add capabilities to a backend service. For example, accept a name of the place instead of latitude and longitude in a weather forecast API.                                                                    |
| [Authorize access based on JWT claims](./policies/authorize-request-based-on-jwt-claims.md?toc=api-management/toc.json)                                              | Shows how to authorize access to specific HTTP methods on an API based on JWT claims.                                                                                                                                       |
| [Authorize requests using external authorizer](./policies/authorize-request-using-external-authorizer.md)                                                   | Shows how to use external authorizer for securing API access.                                                                                                                                                               |
| [Authorize access using Google OAuth token](./policies/use-google-as-oauth-token-provider.md?toc=api-management/toc.json)                                            | Shows how to authorize access to your endpoints using Google as an OAuth token provider.                                                                                                                                    |
| [Generate Shared Access Signature and forward request to Azure storage](./policies/generate-shared-access-signature.md?toc=api-management/toc.json)                  | Shows how to generate [Shared Access Signature](https://docs.microsoft.com/azure/storage/storage-dotnet-shared-access-signature-part-1) using expressions and forward the request to Azure storage with rewrite-uri policy. |
| [Get OAuth2 access token from AAD and forward it to the backend](./policies/use-oauth2-for-authorization.md?toc=api-management/toc.json)                             | Provides and example of using OAuth2 for authorization between the gateway and a backend. It shows how to obtain an access token from AAD and forward it to the backend.                                                    |
| [Get X-CSRF token from SAP gateway using send request policy](./policies/get-x-csrf-token-from-sap-gateway.md?toc=api-management/toc.json)                           | Shows how to implement X-CSRF pattern used by many APIs. This example is specific to SAP Gateway.                                                                                                                           |
| [Route the request based on the size of its body](./policies/route-requests-based-on-size.md?toc=api-management/toc.json)                                            | Demonstrates how to route requests based on the size of their bodies.                                                                                                                                                       |
| [Send request context information to the backend service](./policies/send-request-context-info-to-backend-service.md?toc=api-management/toc.json)                    | Shows how to send some context information to the backend service for logging or processing.                                                                                                                                |
| [Set response cache duration](./policies/set-cache-duration.md?toc=api-management/toc.json)                                                                          | Demonstrates how to set response cache duration using maxAge value in Cache-Control header sent by the backend.                                                                                                             |
| **Outbound policies**                                                                                                                                                |                                                                                                                                                                                                                             |
| [Filter response content](./policies/filter-response-content.md?toc=api-management/toc.json)                                                                         | Demonstrates how to filter data elements from the response payload based on the product associated with the request.                                                                                                        |
| **On-error policies**                                                                                                                                                |                                                                                                                                                                                                                             |
| [Log errors to Stackify](./policies/log-errors-to-stackify.md?toc=api-management/toc.json)                                                                           | Shows how to add an error logging policy to send errors to Stackify for logging.                                                                                                                                            |
