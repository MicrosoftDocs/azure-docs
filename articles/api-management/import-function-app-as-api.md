---
title: Import an Azure Function App as an API in API Management
titleSuffix: Azure API Management
description: This article shows you how to import an Azure Function App into Azure API Management as an API.
services: api-management
documentationcenter: ''
author: mikebudzynski
manager: cfowler
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 04/16/2021
ms.author: apimpm

---

# Import an Azure Function App as an API in Azure API Management

Azure API Management supports importing Azure Function Apps as new APIs or appending them to existing APIs. The process automatically generates a host key in the Azure Function App, which is then assigned to a named value in Azure API Management.

This article walks through importing and testing an Azure Function App as an API in Azure API Management. 

You will learn how to:

> [!div class="checklist"]
> * Import an Azure Function App as an API
> * Append an Azure Function App to an API
> * View the new Azure Function App host key and Azure API Management named value
> * Test the API in the Azure portal

## Prerequisites

* Complete the [Create an Azure API Management instance](get-started-create-service-instance.md) quickstart.
* Make sure you have an Azure Functions app in your subscription. For more information, see [Create an Azure Function App](../azure-functions/functions-get-started.md). Functions must have HTTP trigger and authorization level set to *Anonymous* or *Function*.

> [!NOTE]
> You can use the API Management Extension for Visual Studio Code to import and manage your APIs. Follow the [API Management Extension tutorial](visual-studio-code-tutorial.md) to install and get started.

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## <a name="add-new-api-from-azure-function-app"></a> Import an Azure Function App as a new API

Follow the steps below to create a new API from an Azure Function App.

1. Navigate to your API Management service in the Azure portal and select **APIs** from the menu.

2. In the **Add a new API** list, select **Function App**.

    :::image type="content" source="./media/import-function-app-as-api/add-01.png" alt-text="Screenshot that shows the Function App tile.":::

3. Click **Browse** to select Functions for import.

    :::image type="content" source="./media/import-function-app-as-api/add-02.png" alt-text="Screenshot that highlights the Browse button.":::

4. Click on the **Function App** section to choose from the list of available Function Apps.

    :::image type="content" source="./media/import-function-app-as-api/add-03.png" alt-text="Screenshot that highlights the Function App section.":::

5. Find the Function App you want to import Functions from, click on it and press **Select**.

    :::image type="content" source="./media/import-function-app-as-api/add-04.png" alt-text="Screenshot that highlights the Function App you want to import Functions from and the Select button.":::

6. Select the Functions you would like to import and click **Select**.
    * You can only import Functions based off HTTP trigger with *Anonymous* or *Function* authorization levels.

    :::image type="content" source="./media/import-function-app-as-api/add-05.png" alt-text="Screenshot that highlights the Functions to import and the Select button.":::

7. Switch to the **Full** view and assign **Product** to your new API. 
8. If needed, specify other fields during creation or configure them later via the **Settings** tab. 
    * The settings are explained in the [Import and publish your first API](import-and-publish.md#import-and-publish-a-backend-api) tutorial.

    >[!NOTE]
    > Products are associations of one or more APIs offered to developers through the developer portal. First, developers must subscribe to a product to get access to the API. Once subscribed, they get a subscription key for any API in that product. As creator of the API Management instance, you are an administrator and are subscribed to every product by default.
    >
    > Each API Management instance comes with two default sample products:
    > - **Starter**
    > - **Unlimited**

9. Click **Create**.

## <a name="append-azure-function-app-to-api"></a> Append Azure Function App to an existing API

Follow the steps below to append Azure Function App to an existing API.

1. In your **Azure API Management** service instance, select **APIs** from the menu on the left.

2. Choose an API you want to import an Azure Function App to. Click **...** and select **Import** from the context menu.

    :::image type="content" source="./media/import-function-app-as-api/append-function-api-1.png" alt-text="Screenshot that highlights the Import menu option.":::

3. Click on the **Function App** tile.

    :::image type="content" source="./media/import-function-app-as-api/append-function-api-2.png" alt-text="Screenshot that highlights the Function App tile.":::

4. In the pop-up window, click **Browse**.

    :::image type="content" source="./media/import-function-app-as-api/append-function-api-3.png" alt-text="Screenshot that shows the Browse button.":::

5. Click on the **Function App** section to choose from the list of available Function Apps.

    :::image type="content" source="./media/import-function-app-as-api/add-03.png" alt-text="Screenshot that highlights the list of Function Apps.":::

6. Find the Function App you want to import Functions from, click on it and press **Select**.

    :::image type="content" source="./media/import-function-app-as-api/add-04.png" alt-text="Screenshot that highlights the Function App you want to import functions from.":::

7. Select the Functions you would like to import and click **Select**.

    :::image type="content" source="./media/import-function-app-as-api/add-05.png" alt-text="Screenshot that highlights the functions you'd like to import.":::

8. Click **Import**.

    :::image type="content" source="./media/import-function-app-as-api/append-function-api-4.png" alt-text="Append from Function App":::

## <a name="authorization"></a> Authorization

Import of an Azure Function App automatically generates:

* Host key inside the Function App with the name apim-{*your Azure API Management service instance name*},
* Named value inside the Azure API Management instance with the name {*your Azure Function App instance name*}-key, which contains the created host key.

For APIs created after April 4th 2019, the host key is passed in HTTP requests from API Management to the Function App in a header. Older APIs pass the host key as [a query parameter](../azure-functions/functions-bindings-http-webhook-trigger.md#api-key-authorization). You can change this behavior through the `PATCH Backend` [REST API call](/rest/api/apimanagement/2019-12-01/backend/update#backendcredentialscontract) on the *Backend* entity associated with the Function App.

> [!WARNING]
> Removing or changing either the Azure Function App host key value or the Azure API Management named value will break the communication between the services. The values do not sync automatically.
>
> If you need to rotate the host key, make sure the named value in Azure API Management is also modified.

### Access Azure Function App host key

1. Navigate to your Azure Function App instance.

    :::image type="content" source="./media/import-function-app-as-api/keys-01.png" alt-text="Screenshot that highlights selecting your Function app instance.":::

2. In the **Functions** section of the side navigation menu, select **App keys**.

    :::image type="content" source="./media/import-function-app-as-api/keys-02b.png" alt-text="Screenshot that highlights the Function Apps settings option.":::

3. Find the keys under the **Host keys** section.

    :::image type="content" source="./media/import-function-app-as-api/keys-03.png" alt-text="Screenshot that highlights the Host Keys section.":::

### Access the named value in Azure API Management

Navigate to your Azure API Management instance and select **Named values** from the menu on the left. The Azure Function App key is stored there.

:::image type="content" source="./media/import-function-app-as-api/api-named-value.png" alt-text="Add from Function App":::

## <a name="test-in-azure-portal"></a> Test the new API in the Azure portal

You can call operations directly from the Azure portal. Using the Azure portal is a convenient way to view and test the operations of an API.  

:::image type="content" source="./media/import-function-app-as-api/test-api.png" alt-text="Screenshot that highlights the test procedure.":::

1. Select the API that you created in the preceding section.

2. Select the **Test** tab.

3. Select the operation you want to test.

    * The page displays fields for query parameters and headers. 
    * One of the headers is "Ocp-Apim-Subscription-Key", for the product subscription key associated with this API. 
    * As creator of the API Management instance, you are an administrator already, so the key is filled in automatically. 

4. Select **Send**.

    * When the test succeeds, the back end responds with **200 OK** and some data.

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]

## Next steps

> [!div class="nextstepaction"]
> [Transform and protect a published API](transform-api.md)
