---
title: Import an SAP API by Using the Azure Portal | Microsoft Docs
titleSuffix:
description: Learn how to import OData metadata from SAP as an API to Azure API Management, either directly or by converting the metadata to an OpenAPI specification.
ms.service: azure-api-management
ms.custom:
  - build-2024
author: martinpankraz
ms.author: mapankra
ms.topic: how-to
ms.date: 03/31/2025

#customer intent: As an API developer, I want to import an SAP API to API Management.
---

# Import SAP OData metadata as an API

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

This article describes how to import an OData service by using its metadata description. [SAP Gateway Foundation](https://help.sap.com/viewer/product/SAP_GATEWAY) is used as an example. 

In this article, you: 
> [!div class="checklist"]
> * Retrieve OData metadata from your SAP service
> * Import OData metadata to Azure API Management, either directly or after converting it to an OpenAPI specification
> * Complete API configuration
> * Test the API in the Azure portal

## Prerequisites

- An API Management instance. If you don't have one, complete the steps in  [Create an API Management instance by using the Azure portal](get-started-create-service-instance.md).
- An SAP system and service that's exposed as OData v2 or v4. 
- If your SAP backend uses a self-signed certificate (for testing), you might need to disable the verification of the trust chain for SSL. To do so, configure a [backend](backends.md) in your API Management instance:
    1. In the Azure portal, under **APIs**, select **Backends** > **+ Add**.
    1.  Add a **Custom URL** that points to the SAP backend service.
    1.  Clear the **Validate certificate chain** and **Validate certificate name** checkboxes. 

    > [!NOTE]
    > In production scenarios, use proper certificates for end-to-end SSL verification.

## Retrieve OData metadata from your SAP service

Use one of the following methods to retrieve metadata XML from your SAP service. If you plan to convert the metadata XML to an OpenAPI specification, save the file locally. 

* Use the SAP Gateway Client (transaction `/IWFND/GW_CLIENT`).  
  or
* Make a direct HTTP call to retrieve the XML:
`http://<OData server URL>:<port>/<path>/$metadata`.

[!INCLUDE [api-management-navigate-to-instance](../../includes/api-management-navigate-to-instance.md)]

## Import an API to API Management

Choose one of the following methods to import your API to API Management: 
- Import the metadata XML as an OData API directly.
- Convert the metadata XML to an OpenAPI specification.

#### [OData metadata](#tab/odata)

[!INCLUDE [api-management-import-odata-metadata](../../includes/api-management-import-odata-metadata.md)]

#### [OpenAPI specification](#tab/openapi)

## Convert OData metadata to OpenAPI JSON

1. Convert the OData XML to OpenAPI JSON format. Use an OASIS open-source tool for [OData v2](https://github.com/oasis-tcs/odata-openapi/tree/main/tools) or [OData v4](https://github.com/oasis-tcs/odata-openapi/tree/main/lib), depending on your metadata XML. 

   The following example converts OData v2 XML for the test service `epm_ref_apps_prod_man_srv`:

   ```console
   odata-openapi -p --basePath '/sap/opu/odata/sap/epm_ref_apps_prod_man_srv' \
    --scheme https --host <your IP address>:<your SSL port> \
    ./epm_ref_apps_prod_man_srv.xml
   ```

    > [!NOTE]
    > * For testing with a single XML file, you can use a [web-based converter](https://aka.ms/ODataOpenAPI) that's based on an open-source tool.
    > * With the tool or the web-based converter, specifying the \<IP address>:\<port> of your SAP OData server is optional. Alternatively, add this information later in your generated OpenAPI specification or after you import the file to API Management.

1. Save the `openapi-spec.json` file locally for import to API Management.

## Import OpenAPI specification

1. In the left navigation pane, in the **APIs** section, select **APIs**.
1. Under **Create a new definition**, select **OpenAPI**:

    :::image type="content" source="./media/import-api-from-oas/oas-api.png" alt-text="Screenshot that shows the OpenAPI tile.":::

1. Click **Select a file**, and then select the `openapi-spec.json` file that you saved locally in a previous step.

1. Enter API settings. You can set these values when you import the API or configure them later by going to the **Settings** tab. 
    * For the **API URL suffix**, we recommend using the same URL path as that of the original SAP service.

    * For more information about API settings, see [Import and publish your first API](import-and-publish.md#import-and-publish-a-backend-api) tutorial.

1. Select **Create**.

> [!NOTE]
> For information about API import limitations, see [API import restrictions and known issues](api-management-api-import-restrictions.md).

## Complete the API configuration

[Add](add-api-manually.md#add-and-test-an-operation) the following three operations to the API that you imported:

- `GET /$metadata`

    |Operation  |Description  |Additional configuration for the operation  |
    |---------|---------|---------|
    |`GET /$metadata`     |   Enables API Management to reach the `$metadata` endpoint, which is required for client integration with the OData server.<br/><br/>This required operation isn't included in the OpenAPI specification that you generated and imported.    |  Add a `200 OK` response.       |

    :::image type="content" source="media/sap-api/get-metadata-operation.png" alt-text="Screenshot that shows the GET metadata operation.":::

- `HEAD /` 

    |Operation  |Description  | 
    |---------|---------| 
    |`HEAD /`     | Enables the client to exchange cross-site request forgery (CSRF) tokens with the SAP server when required.<br/><br/>SAP also allows CSRF token exchange via the GET verb.<br/><br/> CSRF token exchange isn’t covered in this article. See an [example API Management policy snippet](https://github.com/Azure/api-management-policy-snippets/blob/master/examples/Get%20X-CSRF%20token%20from%20SAP%20gateway%20using%20send%20request.policy.xml) to broker token exchange.     |

    :::image type="content" source="media/sap-api/head-root-operation.png" alt-text="Screenshot that shows the operation for fetching tokens.":::

- `GET /`

    Operation  |Description  |Additional configuration for the operation  |
    |---------|---------|---------|
    |`GET /`     |   Enables policy configuration at the service root.   |    Configure the following inbound [rewrite-uri](rewrite-uri-policy.md) policy to append a trailing slash to requests that are forwarded to the service root:<br/><br>    `<rewrite-uri template="/" copy-unmatched-params="true" />` <br/><br/>This policy removes potential ambiguity among requests with and without trailing slashes. These two types of requests are treated differently by some backends.|

    :::image type="content" source="media/sap-api/get-root-operation.png" alt-text="Screenshot that shows the GET operation for the service root.":::

You also need to configure authentication to your backend by using an appropriate method for your environment. For examples, see [API Management authentication and authorization policies](api-management-policies.md#authentication-and-authorization).

## Test your API

1. Navigate to your API Management instance.
1. In the left navigation pane, in the **APIs** section, select **APIs**.
1. Under **All APIs**, select your imported API.
1. Select the **Test** tab to access the test console. 
1. Select an operation, enter any required values, and then select **Send**. 

    For example, test the `GET /$metadata` call to verify connectivity to the SAP backend.

1. View the response. To troubleshoot, [trace](api-management-howto-api-inspector.md) the call.
1. When you're done testing, exit the test console.

---

## Production considerations

* See an [example end-to-end scenario](https://community.powerplatform.com/blogs/post/?postid=c6a609ab-3556-ef11-a317-6045bda95bf0) for integrating API Management with an SAP gateway.
* Control access to an SAP backend by using API Management policies. For example, if the API is imported as an OData API, use the [validate OData request](validate-odata-request-policy.md) policy. There are also policy snippets for [SAP principal propagation for SAP ECC or S/4HANA](https://github.com/Azure/api-management-policy-snippets/blob/master/examples/Request%20OAuth2%20access%20token%20from%20SAP%20using%20AAD%20JWT%20token.xml) or [SAP SuccessFactors](https://github.com/Azure/api-management-policy-snippets/blob/master/examples/Request%20OAuth2%20access%20token%20from%20SuccessFactors%20using%20AAD%20JWT%20token.xml) and [fetching an X-CSRF token](https://github.com/Azure/api-management-policy-snippets/blob/master/examples/Get%20X-CSRF%20token%20from%20SAP%20gateway%20using%20send%20request.policy.xml).
* For guidance on deploying, managing, and migrating APIs at scale, see:
    * [Automated API deployments with APIOps](/azure/architecture/example-scenario/devops/automated-api-deployments-apiops).
    * [CI/CD for API Management using Azure Resource Manager templates](devops-api-development-templates.md).

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]
