---
title: Import SAP OData Metadata as an API
titleSuffix:
description: Learn how to import OData metadata from SAP as an API to Azure API Management, either directly or by converting the metadata to an OpenAPI specification.
ms.service: azure-api-management
ms.custom:
  - build-2024
author: martinpankraz
ms.author: mapankra
ms.topic: how-to
ms.date: 03/16/2026

#customer intent: As an API developer, I want to import an SAP API to API Management.
---

# Import SAP OData metadata as an API

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

This article describes how to import an OData (Open Data Protocol) service into Azure API Management by using OData metadata. The following example uses [SAP Gateway Foundation](https://help.sap.com/docs/SAP_GATEWAY).

In this article, you learn how to: 
> [!div class="checklist"]
> * Retrieve OData metadata from your SAP service
> * Import OData metadata to Azure API Management, either directly or after converting it to an OpenAPI specification
> * Complete API configuration
> * Test the API in the Azure portal

## Prerequisites

- Create an [API Management instance](get-started-create-service-instance.md).
- An SAP system and service that's exposed as OData v2 or v4. 
- If your SAP backend uses a self-signed certificate (for testing), you might need to disable the verification of the trust chain for SSL. To do so, configure a [backend](backends.md) in your API Management instance:
    1. In the Azure portal, under **APIs**, select **Backends** > **+ Create new backend**.
    1. Add a **Custom URL** that points to the SAP backend service.
    1. Expand the **Advanced** section, then clear the **Validate certificate chain** and **Validate certificate name** checkboxes. 

    > [!NOTE]
    > In production scenarios, use proper certificates for end-to-end SSL verification.

    > [!TIP]
    > For the full feature scope of API Management, convert the SAP OData API to OpenAPI specification before registering.

## Retrieve OData metadata from your SAP service

Use one of the following methods to retrieve metadata XML from your SAP service. If you plan to convert the metadata XML to an OpenAPI specification, save the file locally. 

* Use the SAP Gateway Client (transaction `/IWFND/GW_CLIENT`).
* Make a direct HTTP call to retrieve the XML: `http://<OData server URL>:<port>/<path>/$metadata`.
* Use the [SAP Business Accelerator Hub](https://api.sap.com/) if applicable.

[!INCLUDE [api-management-navigate-to-instance](../../includes/api-management-navigate-to-instance.md)]

## Import an API to API Management

Choose one of the following methods to import your API to API Management: 
- Convert the metadata XML to an OpenAPI specification (**recommended**).
- Import the metadata XML as an OData API directly.

#### [OpenAPI specification (recommended)](#tab/openapi)

## Convert OData metadata to OpenAPI JSON

1. Use the [Microsoft converter](https://github.com/Azure-Samples/odata-openapi-converter/) built on-top of the OASIS open-source tool. 

   The following example converts OData v2 XML for the test service `epm_ref_apps_prod_man_srv`:

   ```console
   oasis-converter convert epm_ref_apps_prod_man_srv.xml api.json
   ```

    > [!NOTE]
    > For testing with a single XML file, you can use the [web-based experience](https://aka.ms/ODataOpenAPI).

1. Save the *openapi-spec.json* file locally for import to API Management.

## Import OpenAPI specification

1. In the sidebar menu, in the **APIs** section, select **APIs**.

1. Under **Create from definition**, select the **OpenAPI** tile:

    :::image type="content" source="./media/import-api-from-oas/oas-api.png" alt-text="Screenshot that shows the OpenAPI tile.":::

1. Choose **Select a file**, and then select the *openapi-spec.json* file that you saved locally in a previous step.

1. Enter API settings. You can set these values when you import the API or configure them later by going to the **Settings** tab. 
    * For the **API URL suffix**, we recommend using the same URL path as that of the original SAP service.

    * For more information about API settings, see [Import and publish your first API](import-and-publish.md#import-and-publish-a-backend-api) tutorial.

1. Select **Create**.

You also need to configure authentication to your backend by using an appropriate method for your environment. For examples, see [Authentication and authorization](api-management-policies.md#authentication-and-authorization).

> [!NOTE]
> For information about API import limitations, see [API import restrictions and known issues](api-management-api-import-restrictions.md).

## Test your API

1. Navigate to your API Management instance.

1. In the sidebar menu, select **APIs** > **APIs**.

1. Under **All APIs**, select your imported API.

1. Select the **Test** tab to access the test console. 

1. Select an operation, enter any required values, and then select **Send**. 

    For example, test the `GET /$metadata` call to verify connectivity to the SAP backend.

1. View the response. To troubleshoot, [trace](api-management-howto-api-inspector.md) the call.

1. When you're done testing, exit the test console.

#### [OData metadata](#tab/odata)

[!INCLUDE [api-management-import-odata-metadata](../../includes/api-management-import-odata-metadata.md)]

---

## Production considerations

* Use [Defender for APIs](protect-with-defender-for-apis.md) for full lifecycle protection, detection, and response coverage for APIs.
* See an [example end-to-end scenario](https://community.powerplatform.com/blogs/post/?postid=c6a609ab-3556-ef11-a317-6045bda95bf0) for integrating API Management with an SAP gateway.
* Control access to an SAP backend by using API Management policies. For example, if the API is imported as an OData API, use the [validate OData request](validate-odata-request-policy.md) policy. There are also policy snippets for [SAP principal propagation for SAP ECC or S/4HANA](https://github.com/Azure/api-management-policy-snippets/blob/master/examples/Request%20OAuth2%20access%20token%20from%20SAP%20using%20AAD%20JWT%20token.xml) or [SAP SuccessFactors](https://github.com/Azure/api-management-policy-snippets/blob/master/examples/Request%20OAuth2%20access%20token%20from%20SuccessFactors%20using%20AAD%20JWT%20token.xml) and [fetching an X-CSRF token](https://github.com/Azure/api-management-policy-snippets/blob/master/examples/Get%20X-CSRF%20token%20from%20SAP%20gateway%20using%20send%20request.policy.xml).
* For guidance on deploying, managing, and migrating APIs at scale, see:
    * [Automated API deployments with APIOps](/azure/architecture/example-scenario/devops/automated-api-deployments-apiops)
    * [Use DevOps and CI/CD to publish APIs](devops-api-development-templates.md)

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]
