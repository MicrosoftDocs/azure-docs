---
title: Import an SAP API using the Azure portal | Microsoft Docs
titleSuffix: 
description: Learn how to import OData metadata from SAP as an API to Azure API Management
ms.service: api-management
author: martinpankraz
ms.author: martin.pankraz
ms.topic: how-to
ms.date: 01/07/2022
ms.custom: 
---

# Import SAP OData metadata as an API

[ADD INTRO PARAGRAPH HERE] This article shows how to ....

In this article, you'll:  [ADJUST STEPS AS NEEDED]
> [!div class="checklist"]
> * Convert OData metadata to an OpenAPI specification
> * Import the OpenAPI specification to API Management
> * Complete API configuration
> * Test the API in the Azure portal

For an example of an end-to-end scenario to integrate API Management with an SAP gateway, see [this blog](https://blogs.sap.com/2021/08/12/.net-speaks-odata-too-how-to-implement-azure-app-service-with-sap-odata-gateway/).

## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).
- An SAP system and service exposed as OData. [ADD MORE SPECIFICS, VERSIONS ETC. HERE]. 

## Convert OData metadata to OpenAPI JSON

[Add recommended conversion steps]

1. 
1. 
1. 


[!INCLUDE api-management-navigate-to-instance.md]

## Import and publish back-end API 

1. From the side navigation menu, under the **APIs** section, select **APIs**.
1. Under **Create a new definition**, select **OpenAPI specification**.

    :::image type="content" source="./media/import-api-from-oas/oas-api.png" alt-text="OpenAPI specifiction":::

3. Enter API settings. You can set the values during creation or configure them later by going to the **Settings** tab. The settings are explained in the [Import and publish your first API](import-and-publish.md#import-and-publish-a-backend-api) tutorial.
4. Select **Create**.

> [!NOTE]
> The API import limitations are documented in [another article](api-management-api-import-restrictions.md).


## Complete API configuration

Add the following operations to the API that you imported. 

* Metadata operation
* Head operation at root to fetch tokens

[Add details for each operation]

## Test your API

1. Navigate to your API Management instance.
1. From the side navigation menu, under the **APIs** section, select **APIs**.
1. Under **All APIs**, select your imported API.
1. Select the **Test** tab to access the Test console. 
1. [ADD APPROPRIATE TESTS FOR THIS API]
1. ...
1. When testing is complete, exit the test console.

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]

## Next steps
> [!div class="nextstepaction"]
> [Transform and protect a published API](transform-api.md)
