---
title: What is an Azure API Management API
description: This topic gives an overview of what is an Azure API Management API.
services: api-management
documentationcenter: ''
author: juliako
manager: cfowler
editor: ''

ms.assetid: 14c20da4-f29f-4b28-bec7-3d4c50b734da
ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/05/2017
ms.author: apimpm

---
# What is an API Management API

APIs are the foundation of an API Management (APIM) service instance. An APIM API does not host APIs, it creates facades for your APIs in order to customize the facade according to your needs without touching the backend API. Each APIM API represents a set of operations available to developers. Each APIM API contains a reference to the backend service that implements the API, and its operations map to the operations implemented by the backend service. 

## Importing APIs

Backend APIs can be imported into an APIM API or created and managed manually. Once a backend API is imported into APIM, the APIM API becomes a facade for the backend API. At the time, you import a backend API, both the source API and the APIM API are identical. The APIM doc set shows various ways you can evolve the APIM version of the API.

> [!NOTE]
> **API Management** currently supports both 1.2 and 2.0 version of OpenAPI (Swagger) document for import. Make sure that, even though [OpenAPI 2.0 specification](http://swagger.io/specification) declares that `host`, `basePath`, and `schemes` properties are optional, your OpenAPI 2.0 document **MUST** contain those properties; otherwise it won't get imported. 
> 

For more information, see [Import and publish your first API](import-and-publish.md);

## Add blank API

You can add blank APIs and then add desired operations. Once the operations are added, the API is added to a product and can be published. Once an API is published, it can be subscribed to and used by developers.

The following fields are used to configure the new API.

|Name|Description|
|---|---|
|Display name|Provides a descriptive name for the API. It is displayed in the developer portal.|
|Name|Provides a unique name for the API|
|Description|Provides an optional description of the API.|
|Web service URL|References the HTTP service implementing the API. API management forwards requests to this address.|
|API URL suffix| The suffix is appended to the base URL for the API management service. The base URL is common for all APIs hosted by an API Management service instance. API Management distinguishes APIs by their suffix and therefore the suffix must be unique for every API for a given publisher.|
|URL scheme|Determines which protocols can be used to access the API. |
|Products|To optionally add this new API to a product, type the product name. This step can be repeated multiple times to add the API to multiple products.|

For more information, see [Test an APIM instance with mocked API responses](mock-api-responses.md).

## <a name="configure-api-settings"> </a>Configure API settings

If you want to verify and edit the configuration for an API, click on the API and select the **Settings** tab. **Name**, **Web service URL**, and **API URL suffix** are initially set when the API is created and can be modified here. 

You can also configure gateway authentication for the backend service implementing the API, under the **Security** section.

## <a name="next-steps"> </a>Next steps

Once an API is created and the settings configured, the next steps are to add the operations to the API, add the API to a product, and publish it so that it is available for developers.  

