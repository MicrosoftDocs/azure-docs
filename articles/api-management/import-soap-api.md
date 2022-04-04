---
title: Import SOAP API to Azure API Management using the portal | Microsoft Docs
description: Learn how to import a SOAP API to Azure API Management as a WSDL specification. Then, test the API in the Azure portal.
author: dlepow
ms.service: api-management
ms.topic: how-to
ms.date: 03/01/2022
ms.author: danlep

---
# Import SOAP API to API Management

This article shows how to import a WSDL specification, which is a standard XML representation of a SOAP API. The article also shows how to test the API in API Management.

In this article, you learn how to:

> [!div class="checklist"]
> * Import a SOAP API
> * Test the API in the Azure portal

[!INCLUDE [api-management-wsdl-import](../../includes/api-management-wsdl-import.md)]

## Prerequisites

Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md)

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## <a name="create-api"> </a>Import and publish a backend API

1. From the left menu, under the **APIs** section, select **APIs** > **+ Add API**.
1. Under **Create from definition**, select **WSDL**.

    ![SOAP API](./media/import-soap-api/wsdl-api.png)
1. In **WSDL specification**, enter the URL to your SOAP API, or click **Select a file** to select a local WSDL file.
1. In **Import method**, **SOAP pass-through** is selected by default. 
    With this selection, the API is exposed as SOAP, and API consumers have to use SOAP rules. If you want to "restify" the API, follow the steps in [Import a SOAP API and convert it to REST](restify-soap-api.md).

    ![Create SOAP API from WDL specification](./media/import-soap-api/pass-through.png)
1. The following fields are filled automatically with information from the SOAP API: **Display name**, **Name**, **Description**.
1. Enter other API settings. You can set the values during creation or configure them later by going to the **Settings** tab. 

    For more information about API settings, see [Import and publish your first API](import-and-publish.md#import-and-publish-a-backend-api) tutorial.
1. Select **Create**.

### Test the new API in the portal

Operations can be called directly from the portal, which provides a convenient way to view and test the operations of an API.  

1. Select the API you created in the previous step.
2. Press the **Test** tab.
3. Select some operation.

    The page displays fields for query parameters and fields for the headers. One of the headers is **Ocp-Apim-Subscription-Key**, for the subscription key of the product that is associated with this API. If you created the API Management instance, you're an administrator already, so the key is filled in automatically. 
1. Press **Send**.

    When the test is successful, the backend responds with **200 OK** and some data.

## Wildcard SOAP action

If you need to pass a SOAP request that doesn't have a dedicated action defined in the API, you can configure a wildcard SOAP action. The wildcard action will match any SOAP request that isn't defined in the API.  

To define a wildcard SOAP action:

1. In the portal, select the API you created in the previous step.
1. In the **Design** tab, select **+ Add Operation**.
1. Enter a **Display name** for the operation.
1. In the URL, select `POST` and enter `/soapAction={any}` in the resource. The template parameter inside the curly brackets is arbitrary and doesn't affect the execution.


[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-append-apis.md)]

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]

## Next steps

> [!div class="nextstepaction"]
> [Transform and protect a published API](transform-api.md)