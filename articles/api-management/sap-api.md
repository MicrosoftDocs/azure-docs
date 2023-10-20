---
title: Import an SAP API using the Azure portal | Microsoft Docs
titleSuffix: 
description: Learn how to import OData metadata from SAP as an API to Azure API Management, either directly or by converting the metadata to an OpenAPI specification.
ms.service: api-management
author: martinpankraz
ms.author: mapankra
ms.topic: how-to
ms.date: 07/21/2023
ms.custom: 
---

# Import SAP OData metadata as an API

This article shows how to import an OData service using its metadata description. In this article, [SAP Gateway Foundation](https://help.sap.com/viewer/product/SAP_GATEWAY) serves as an example. 

In this article, you'll: 
> [!div class="checklist"]
> * Retrieve OData metadata from your SAP service
> * Import OData metadata to API Management, either directly or after conversion to an OpenAPI specification
> * Complete API configuration
> * Test the API in the Azure portal

> [!NOTE]
> Importing an OData API to API Management from its metadata description is in preview. [Learn more](import-api-from-odata.md).

## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).
- An SAP system and service exposed as OData v2 or v4. 
- If your SAP backend uses a self-signed certificate (for test purposes), you may need to disable the verification of the trust chain for SSL. To do so, configure a [backend](backends.md) in your API Management instance:
    1. In the Azure portal, under **APIs**, select **Backends** > **+ Add**.
    1.  Add a **Custom URL** pointing to the SAP backend service.
    1.  Uncheck **Validate certificate chain** and **Validate certificate name**. 

    > [!NOTE]
    > For production scenarios, use proper certificates for end-to-end SSL verification.
## Retrieve OData metadata from your SAP service

Retrieve metadata XML from your SAP service, using one of the following methods. If you plan to convert the metadata XML to an OpenAPI specification, save the file locally. 

* Use the SAP Gateway Client (transaction `/IWFND/GW_CLIENT`), or 
* Make a direct HTTP call to retrieve the XML:
`http://<OData server URL>:<port>/<path>/$metadata`


[!INCLUDE [api-management-navigate-to-instance](../../includes/api-management-navigate-to-instance.md)]

## Import API to API Management

Choose one of the following methods to import your API to API Management: import the metadata XML as an OData API directly, or convert the metadata XML to an OpenAPI specification.

#### [OData metadata](#tab/odata)

[!INCLUDE [api-management-import-odata-metadata](../../includes/api-management-import-odata-metadata.md)]

#### [OpenAPI specification](#tab/openapi)

## Convert OData metadata to OpenAPI JSON

1. Convert the OData XML to OpenAPI JSON format. Use an OASIS open-source tool for [OData v2](https://github.com/oasis-tcs/odata-openapi/tree/main/tools) or [OData v4](https://github.com/oasis-tcs/odata-openapi/tree/main/lib), depending on your metadata XML. 

   The following is an example command to convert OData v2 XML for the test service `epm_ref_apps_prod_man_srv`:

   ```console
   odata-openapi -p --basePath '/sap/opu/odata/sap/epm_ref_apps_prod_man_srv' \
    --scheme https --host <your IP address>:<your SSL port> \
    ./epm_ref_apps_prod_man_srv.xml
   ```
    > [!NOTE]
    > * For test purposes with a single XML file, you can use a [web-based converter](https://aka.ms/ODataOpenAPI) based on the open-source tool.
    > * With the tool or the web-based converter, specifying the \<IP address>:\<port> of your SAP OData server is optional. Alternatively, add this information later in your generated OpenAPI specification or after importing to API Management.

1. Save the `openapi-spec.json` file locally for import to API Management.

## Import and publish backend API 

1. From the side navigation menu, under the **APIs** section, select **APIs**.
1. Under **Create a new definition**, select **OpenAPI specification**.

    :::image type="content" source="./media/import-api-from-oas/oas-api.png" alt-text="OpenAPI specification":::

1. Click **Select a file**, and select the `openapi-spec.json` file that you saved locally in a previous step.

1. Enter API settings. You can set the values during creation or configure them later by going to the **Settings** tab. 
    * In **API URL suffix**, we recommend using the same URL path as in the original SAP service.

    * For more information about API settings, see [Import and publish your first API](import-and-publish.md#import-and-publish-a-backend-api) tutorial.

1. Select **Create**.

> [!NOTE]
> The API import limitations are documented in [another article](api-management-api-import-restrictions.md).


## Complete API configuration

[Add](add-api-manually.md#add-and-test-an-operation) the following three operations to the API that you imported.

- `GET /$metadata`

    |Operation  |Description  |Further configuration for operation  |
    |---------|---------|---------|
    |`GET /$metadata`     |   Enables API Management to reach the `$metadata` endpoint, which is required for client integration with the OData server.<br/><br/>This required operation isn't included in the OpenAPI specification that you generated and imported.    |  Add a `200 OK` response.       |

    :::image type="content" source="media/sap-api/get-metadata-operation.png" alt-text="Get metadata operation":::

- `HEAD /` 

    |Operation  |Description  |Further configuration for operation  |
    |---------|---------|---------|
    |`HEAD /`     | Enables the client to exchange Cross Site Request Forgery (CSRF) tokens with the SAP server, when required.<br/><br/>SAP also allows CSRF token exchange using the GET verb.<br/><br/> CSRF token exchange isn’t covered in this article. See an example API Management [policy snippet](https://github.com/Azure/api-management-policy-snippets/blob/master/examples/Get%20X-CSRF%20token%20from%20SAP%20gateway%20using%20send%20request.policy.xml)     to broker token exchange.     |     N/A    |

    :::image type="content" source="media/sap-api/head-root-operation.png" alt-text="Operation to fetch tokens":::

- `GET /`

    Operation  |Description  |Further configuration for operation  |
    |---------|---------|---------|
    |`GET /`     |   Enables policy configuration at service root.   |    Configure the following inbound [rewrite-uri](rewrite-uri-policy.md) policy to append a trailing slash to requests that are forwarded to service root:<br/><br>    `<rewrite-uri template="/" copy-unmatched-params="true" />` <br/><br/>This policy removes potential ambiguity of requests with or without trailing slashes, which are treated differently by some backends.|

    :::image type="content" source="media/sap-api/get-root-operation.png" alt-text="Get operation for service root":::

Also, configure authentication to your backend using an appropriate method for your environment. For examples, see [API Management authentication policies](api-management-authentication-policies.md).

## Test your API

1. Navigate to your API Management instance.
1. From the side navigation menu, under the **APIs** section, select **APIs**.
1. Under **All APIs**, select your imported API.
1. Select the **Test** tab to access the test console. 
1. Select an operation, enter any required values, and select **Send**. 

    For example, test the `GET /$metadata` call to verify connectivity to the SAP backend
1. View the response. To troubleshoot, [trace](api-management-howto-api-inspector.md) the call.
1. When testing is complete, exit the test console.

---

## Production considerations

* See an [example end-to-end scenario](https://blogs.sap.com/2021/08/12/.net-speaks-odata-too-how-to-implement-azure-app-service-with-sap-odata-gateway/) to integrate API Management with an SAP gateway.
* Control access to an SAP backend using API Management policies. For example, if the API is imported as an OData API, use the [validate OData request](validate-odata-request-policy.md) policy. See also policy snippets for [SAP principal propagation](https://github.com/Azure/api-management-policy-snippets/blob/master/examples/Request%20OAuth2%20access%20token%20from%20SAP%20using%20AAD%20JWT%20token.xml) and [fetching an X-CSRF token](https://github.com/Azure/api-management-policy-snippets/blob/master/examples/Get%20X-CSRF%20token%20from%20SAP%20gateway%20using%20send%20request.policy.xml).
* For guidance to deploy, manage, and migrate APIs at scale, see:
    * [Automated API deployments with APIOps](/azure/architecture/example-scenario/devops/automated-api-deployments-apiops)
    * [CI/CD for API Management using Azure Resource Manager templates](devops-api-development-templates.md).

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]

