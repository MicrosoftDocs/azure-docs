---
title: Import a Function App as an API with the Azure portal  | Microsoft Docs
description: This tutorial shows you how to use API Management (APIM) to import Function App as an API.
services: api-management
documentationcenter: ''
author: vladvino
manager: cfowler
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 07/15/2018
ms.author: apimpm

---
# Import a Function App as an API

This article shows how to import a Function App as an API. The article also shows how to test the APIM API.

In this article, you learn how to:

> [!div class="checklist"]
> * Import a Function App as an API
> * Test the API in the Azure portal
> * Test the API in the Developer portal

## Prerequisites

+ Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md)
+ Make sure there is a Azure Function App in your subscription. For more information, see [Create a Function App](../azure-functions/functions-create-first-azure-function.md#create-a-function-app)
+ [Create OpenAPI definition](../azure-functions/functions-openapi-definition.md) of your Azure Function App

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## <a name="create-api"> </a>Import and publish a back-end API

1. Select **APIs** from under **API MANAGEMENT**.
2. Select **Function App** from the **Add a new API** list.

    ![Function app](./media/import-function-app-as-api/function-app-api.png)
3. Press **Browse** to see the list of Function Apps in your subscription.
4. Select the app. APIM finds the swagger associated with the selected app, fetches it, and imports it. 
5. Add an API URL suffix. The suffix is a name that identifies this specific API in this APIM instance. It has to be unique in this APIM instance.
6. Publish the API by associating the API with a product. In this case, the "*Unlimited*" product is used.  If you want for the API to be published and be available to developers, add it to a product. You can do it during API creation or set it later.

    Products are associations of one or more APIs. You can include a number of APIs and offer them to developers through the developer portal. Developers must first subscribe to a product to get access to the API. When they subscribe, they get a subscription key that is good for any API in that product. If you created the APIM instance, you are an administrator already, so you are subscribed to every product by default.

    By default, each API Management instance comes with two sample products:

    * **Starter**
    * **Unlimited**   
7. Select **Create**.

## Populate Azure Functions keys in Azure API Management

If the imported Azure Functions are protected by keys, Azure API Management automatically creates **Named values** for them, but it does not populate the entries with secrets. For each entry you need to perform the steps below.  

1. Navigate to the **Named values** tab in the API Management instance.
2. Click on an entry and press **Show value** in the sidebar.

    ![Named values](./media/import-function-app-as-api/apim-named-values.png)

3. If the content resembles *code for {Azure Function name}*, head to the imported Azure Functions App and navigate to your Azure Function.
4. Go the **Manage** section of the desired Azure Function and copy the relevant key, based on your Azure Function's authentication method.

    ![Function app](./media/import-function-app-as-api/azure-functions-app-keys.png)

5. Paste the key in the textbox from the **Named values** and click **Save**.

    ![Function app](./media/import-function-app-as-api/apim-named-values-2.png)

## Test the new APIM API in the Azure portal

Operations can be called directly from the Azure portal, which provides a convenient way to view and test the operations of an API.  

1. Select the API you created in the previous step.
2. Press the **Test** tab.
3. Select some operation.

    The page displays fields for query parameters and fields for the headers. One of the headers is "Ocp-Apim-Subscription-Key", for the subscription key of the product that is associated with this API. If you created the APIM instance, you are an administrator already, so the key is filled in automatically. 
1. Press **Send**.

    Backend responds with **200 OK** and some data.

## <a name="call-operation"> </a>Call an operation from the developer portal

Operations can also be called **Developer portal** to test APIs. 

1. Select the API you created in the "Import and publish a back-end API" step.
2. Press **Developer portal**.

    The "Developer portal" site opens up.
3. Select the **API** that you created.
4. Click the operation you want to test.
5. Press **Try it**.
6. Press **Send**.
    
    After an operation is invoked, the developer portal displays the **Response status**, the **Response headers**, and any **Response content**.

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-append-apis.md)]

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]

## Next steps

> [!div class="nextstepaction"]
> [Transform and protect a published API](transform-api.md)