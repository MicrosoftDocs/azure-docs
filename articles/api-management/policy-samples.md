---
title: Azure API Management policy samples | Microsoft Docs
description: Learn about the policies available for use in Azure API Management.
services: api-management
documentationcenter: ''
author: vladvino
manager: erikre
editor: ''

ms.assetid: 1cc460cb-8e67-41aa-bc76-bbafc1892798
ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/07/2017
ms.author: apimpm
---

# API Management policy samples

Policies are a powerful capability of the system that allow the publisher to change the behavior of the API through configuration. Policies are a collection of Statements that are executed sequentially on the request or response of an API. The following table includes links to samples and gives a brief description of each sample.

|||
|---|---|
|[Add correlation id to inbound request](https://github.com/Azure/api-management-policy-snippets/tree/master/Snippets) |Demonstrates how to add a header containing a correlation id to the inbound request.|
|[Call out to an HTTP endpoint and cache the response](https://github.com/Azure/api-management-policy-snippets/tree/master/Snippets) |Shows how to use a few policies to add a capability to a backend service. For example, accept a name of the place instead of latitude and longitude in a wether forecast API.|
|[Filter response content based on product name](https://github.com/Azure/api-management-policy-snippets/tree/master/Snippets) | Demonstrates how to filter data elements from the response payload based on the product associated with the request.|
|[Forward gateway hostname to backend for generating correct urls in responses](https://github.com/Azure/api-management-policy-snippets/tree/master/Snippets) |Demonstrates how to add a Forwarded header in the inbound request to allow the backend API to construct proper URLs.|
|[Generate Shared Access Signature and forward request to Azure storage](https://github.com/Azure/api-management-policy-snippets/tree/master/Snippets) |Shows how to solve generate [Shared Access Signature](https://docs.microsoft.com/en-us/azure/storage/storage-dotnet-shared-access-signature-part-1) using expressions and forward the request to Azure storage with rewrite-uri policy. |
|[Get OAuth2 access token from AAD and forward it to the backend](https://github.com/Azure/api-management-policy-snippets/tree/master/Snippets) |Provides and example of using OAuth2 for authorization between the gateway and a backend. It shows how to obtain an access token from AAD and forward it to the backend.|
|[Get X-CSRF token from SAP gateway using send request policy](https://github.com/Azure/api-management-policy-snippets/tree/master/Snippets) |Shows how to implement X-CSRF pattern used by many APIs. This example is specific to SAP Gateway. |
|[Log errors to Stackify](https://github.com/Azure/api-management-policy-snippets/tree/master/Snippets) |Shows how to add an error logging policy to send errors to Stackify for logging.|
|[Pre-authorize requests based on HTTP method with validate-jwt](https://github.com/Azure/api-management-policy-snippets/tree/master/Snippets) |Shows how to authorize access to specific HTTP methods on an API based on JWT claims.|
|[Route requests based on size](https://github.com/Azure/api-management-policy-snippets/tree/master/Snippets) |Demonstrates how to route requests based on the size of their bodies.|
|[Send request context information to the backend service](https://github.com/Azure/api-management-policy-snippets/tree/master/Snippets) |Shows how to send some context information to the backend service for logging or processing.|
|[Set cache duration using response cache control header](https://github.com/Azure/api-management-policy-snippets/tree/master/Snippets) |Demonstrates how to set reponse cache duration using maxAge value in Cache-Control header sent by the backend.|
|[Simple Google OAuth validate-jwt](https://github.com/Azure/api-management-policy-snippets/tree/master/Snippets) |Shows how to authorize access to your endpoints using a google as an OAuth token provider.|

