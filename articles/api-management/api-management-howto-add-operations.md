---
title: What is an Azure API Management operation | Microsoft Docs
description: This topic gives an overview of what is an API Management operation.
services: api-management
documentationcenter: ''
author: juliako
manager: cfowler
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/12/2017
ms.author: apimpm

---
# What is an API Management operation
 Each API Manement (APIM) API represents a set of operations available to developers. Each APIM API contains a reference to the backend service that implements the API, and its operations map to the operations implemented by the backend service. Before an API in APIM can be used, operations must be added. If you import an existing API, all its operations are added (as shown in [Import and publish your first API](import-and-publish.md). You later can make updates to the operations, as shown in [Protect your API with rate limits](transform-api.md).

You can also add operations manually, as shown in [Test an APIM instance with mocked API responses](mock-api-responses.md).

## Settings

This article explains **Operation**'s settings.  

|Name|Description|
|---|---|
|HTTP verb|You can choose from one of the predefined HTTP verbs.|
|Web service URL|The HTTP service implementing the API. API management forwards requests to this address.|
|Display name|The name that is displayed in the **Developer portal**.|
|Description|Provide a description of the operation that is used to provide documentation to the developers using this API in the **Developer portal**.|
|Query parameters|You can add query parameters. Besides providing a name and description, you can provide values that can be assigned to this parameter. One of the values can be marked as default (optional).|
|Request content types|You can define request content types, examples, and schemas. |
|Response status codes|Define response status codes, content types, examples, and schemas.|

For information on how to transform your API and its operations, see [Transform and protect your API](transform-api.md).

## <a name="next-steps"> </a>Next steps

Once the operations are added to an API, the next step is to associate the API with a product and publish it so that developers can call its operations.

[How to create and publish a product](api-management-howto-add-products.md)

