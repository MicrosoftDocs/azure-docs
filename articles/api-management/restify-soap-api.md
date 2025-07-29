---
title: Import a SOAP API to Azure API Management and convert it to REST using the portal | Microsoft Docs
description: Learn how to import a SOAP API into Azure API Management as a WSDL specification and convert it to a REST API. Then test the API in the Azure portal.
services: api-management
author: dlepow
ms.custom: devdivchpfy22
ms.service: azure-api-management
ms.topic: how-to
ms.date: 03/27/2025
ms.author: danlep

#customer intent: As a developer, I want to import a SOAP API into API Management and convert it to REST.

---
# Import a SOAP API to API Management and convert it to REST

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

This article shows how to import a SOAP API as a WSDL specification and then convert it to a REST API. It also shows how to test the API in Azure API Management.

In this article, you learn how to:

> [!div class="checklist"]
> * Import a SOAP API and convert it to REST
> * Test the API in the Azure portal

[!INCLUDE [api-management-wsdl-import](../../includes/api-management-wsdl-import.md)]

## Prerequisites

- Complete the quickstart [Create an Azure API Management instance](get-started-create-service-instance.md).

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## <a name="create-api"> </a>Import and publish a backend API

1. In the left pane, in the **APIs** section, select **APIs**.
1. On the APIs page, select **+ Add API**.
1. Under **Create from definition**, select **WSDL**:

    :::image type="content" source="./media/restify-soap-api/wsdl-api.png" alt-text="Screenshot that shows the WSDL tile in the Azure portal.":::

1. In **WSDL specification**, enter the URL to your SOAP API, or click **Select a file** to select a local WSDL file.
1. Under **Import method**, select **SOAP to REST**. 
    When this option is selected, API Management attempts to make an automatic transformation between XML and JSON. In this case, consumers should call the API as a RESTful API, which returns JSON. API Management converts each request to a SOAP call.

    :::image type="content" source="./media/restify-soap-api/soap-to-rest.png" alt-text="Screenshot that shows the SOAP to REST option." lightbox="./media/restify-soap-api/soap-to-rest.png":::

1. The **Display name** and **Name** boxes are filled automatically with information from the SOAP API. 
   
   **Display name**, **URL**, and **Description** information is automatically entered for operations. Operations also receive a system-generated **Name**.
1. Enter other API settings, and then select **Create**. You can also configure these values later by going to the **Settings** tab. 

    For more information about API settings, see [Import and publish your first API](import-and-publish.md#import-and-publish-a-backend-api).

## Test the new API in the Azure portal

You can call operations directly from the Azure portal. This method provides a convenient way to view and test the operations of an API.  

1. Select the API you created in the previous step.
1. Select the **Test** tab.
1. Select an operation.

    The page shows fields for query parameters and fields for the headers. One of the headers is **Ocp-Apim-Subscription-Key**. This header is for the subscription key of the product that's associated with this API. If you created the API Management instance, you're an admin already, so the key is filled in automatically. 

1. Select **Send**.

    When the test is successful, the backend responds with **200 OK** and some data.

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-append-apis.md)]

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]