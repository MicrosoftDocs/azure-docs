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
ms.topic: sample
ms.date: 10/31/2017
ms.author: apimpm
ms.custom: mvc
---

# API Management policy samples

[Policies](../api-management-howto-policies.md) are a powerful capability of the system that allows the publisher to change the behavior of the API through configuration. Policies are a collection of statements that are executed sequentially on the request or response of an API. The following table includes links to samples and gives a brief description of each sample.

| Inbound policies | Description |
| ---------------- | ----------- |
| [Add a Forwarded header to allow the backend API to construct proper URLs](./set-header-to-enable-backend-to-construct-urls.md) | Demonstrates how to add a Forwarded header in the inbound request to allow the backend API to construct proper URLs.                                                                                                        |
| [Add a header containing a correlation id](./add-correlation-id.md)                                                             | Demonstrates how to add a header containing a correlation ID to the inbound request.                                                                                                                                        |
| [Add capabilities to a backend service and cache the response](./cache-response.md)                                             | Shows how to add capabilities to a backend service. For example, accept a name of the place instead of latitude and longitude in a weather forecast API.                                                                    |
| [Authorize access based on JWT claims](./authorize-request-based-on-jwt-claims.md)                                              | Shows how to authorize access to specific HTTP methods on an API based on JWT claims.                                                                                                                                       |
| [Authorize requests using external authorizer](./authorize-request-using-external-authorizer.md)                                                   | Shows how to use external authorizer for securing API access.                                                                                                                                                               |
| [Authorize access using Google OAuth token](./use-google-as-oauth-token-provider.md)                                            | Shows how to authorize access to your endpoints using Google as an OAuth token provider.                                                                                                                                    |
| [Filter IP Addresses when using an Application Gateway](./filter-ip-addresses-when-using-appgw.md) | Shows how to IP filter in policies when the API Management instance is accessed via an Application Gateway
| [Generate Shared Access Signature and forward request to Azure storage](./generate-shared-access-signature.md)                  | Shows how to generate [Shared Access Signature](../../storage/common/storage-sas-overview.md) using expressions and forward the request to Azure storage with rewrite-uri policy. |
| [Get OAuth2 access token from AAD and forward it to the backend](./use-oauth2-for-authorization.md)                             | Provides and example of using OAuth2 for authorization between the gateway and a backend. It shows how to obtain an access token from AAD and forward it to the backend.                                                    |
| [Get X-CSRF token from SAP gateway using send request policy](./get-x-csrf-token-from-sap-gateway.md)                           | Shows how to implement X-CSRF pattern used by many APIs. This example is specific to SAP Gateway.                                                                                                                           |
| [Route the request based on the size of its body](./route-requests-based-on-size.md)                                            | Demonstrates how to route requests based on the size of their bodies.                                                                                                                                                       |
| [Send request context information to the backend service](./send-request-context-info-to-backend-service.md)                    | Shows how to send some context information to the backend service for logging or processing.                                                                                                                                |
| [Set response cache duration](./set-cache-duration.md)                                                                          | Demonstrates how to set response cache duration using maxAge value in Cache-Control header sent by the backend.                                                                                                             |
| **Outbound policies** | **Description** |
| [Filter response content](./filter-response-content.md)                                                                         | Demonstrates how to filter data elements from the response payload based on the product associated with the request.                                                                                                        |
| **On-error policies** | **Description** |
| [Log errors to Stackify](./log-errors-to-stackify.md)                                                                           | Shows how to add an error logging policy to send errors to Stackify for logging.                                                                                                                                            |
