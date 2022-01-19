---
title: Import an SAP API using the Azure portal | Microsoft Docs
titleSuffix: 
description: Learn how to import OData metadata from SAP as an API to Azure API Management
ms.service: api-management
author: martinpankraz
ms.author: mapankra
ms.topic: how-to
ms.date: 01/18/2022
ms.custom: 
---

# Import SAP OData metadata as an API

This article shows how to import an OData service using its metadata description. In this article, [SAP Gateway](https://help.sap.com/viewer/product/SAP_GATEWAY) serves as an example. However, you can apply the approach to any OData-compliant service.

In this article, you'll: 
> [!div class="checklist"]
> * Convert OData metadata to an OpenAPI specification
> * Import the OpenAPI specification to API Management
> * Complete API configuration
> * Test the API in the Azure portal

For advanced information, see:

* [Example end-to-end scenario](https://blogs.sap.com/2021/08/12/.net-speaks-odata-too-how-to-implement-azure-app-service-with-sap-odata-gateway/) to integrate API Management with an SAP gateway.
* [SAP principal propagation policy](https://github.com/Azure/api-management-policy-snippets/blob/master/examples/Request%20OAuth2%20access%20token%20from%20SAP%20using%20AAD%20JWT%20token.xml) sample.

## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).
- An SAP system and service exposed as OData v2 or v4. 

## Convert OData metadata to OpenAPI JSON

1. Retrieve metadata XML from your SAP service. You can use the SAP Gateway Client or a direct HTTP call to retrieve the XML.
1. Convert the OData XML to OpenAPI JSON format using the OASIS [open-source tool](https://github.com/oasis-tcs/odata-openapi).
    
    * For test purposes with a single XML file, you can use a [web-based converter](https://convert.odata-openapi.net/) based on the open-source tool.
    * With the tool or the web-based converter, make sure that you configure the IP address:port of your SAP server and the base path of your service.

1. Save the `openapi-spec.json` file locally for import to API Management

[!INCLUDE [api-management-navigate-to-instance](../../includes/api-management-navigate-to-instance.md)]

## Import and publish back-end API 

1. From the side navigation menu, under the **APIs** section, select **APIs**.
1. Under **Create a new definition**, select **OpenAPI specification**.

    :::image type="content" source="./media/import-api-from-oas/oas-api.png" alt-text="OpenAPI specifiction":::

1. Click **Select a file**, and select the `openapi-spec.json` file that you saved locally in a previous step.

1. Enter API settings. You can set the values during creation or configure them later by going to the **Settings** tab. 
    * In **API URL suffix**, we recommend using the same URL path as in the original SAP service.

    * For more information about settings, see [Import and publish your first API](import-and-publish.md#import-and-publish-a-backend-api) tutorial.

1. Select **Create**.

> [!NOTE]
> The API import limitations are documented in [another article](api-management-api-import-restrictions.md).


## Complete API configuration

[Add](add-api-manually.md#add-and-test-an-operation) the following three operations to the API that you imported.

|Operation  |Description  |Further configuration for operation  |
|---------|---------|---------|
|`GET $metadata`     |   Metadata operation      |  Add a `200 OK` response.       |
|`HEAD /`     | Operation at root to fetch tokens        |         |
|`GET /`     |   GET operation for service root      |    Configure the following [rewrite-uri](api-management-transformation-policies.md#RewriteURL) inbound policy:<br/><br>    `<rewrite-uri template="/" copy-unmatched-params="true" />`|


## Test your API

1. Navigate to your API Management instance.
1. From the side navigation menu, under the **APIs** section, select **APIs**.
1. Under **All APIs**, select your imported API.
1. Select the **Test** tab to access the test console. 
1. Select an operation, enter any required values, and select **Send**.
1. View the response. To troubleshoot, [trace](api-management-howto-api-inspector.md) the call.
1. When testing is complete, exit the test console.

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]

## Next steps
> [!div class="nextstepaction"]
> [Transform and protect a published API](transform-api.md)
