---
title: Import a Logic App as an API with the Azure portal  | Microsoft Docs
description: This article shows you how to use API Management (APIM) to import Logic App as an API.
services: api-management
documentationcenter: ''
author: vladvino
manager: cfowler
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 04/08/2021
ms.author: apimpm
---

# Import a Logic App as an API

This article shows how to import a Logic App as an API and test the imported API.

In this article, you learn how to:

> [!div class="checklist"]
>
> -   Import a Logic App as an API
> -   Test the API in the Azure portal
> -   Test the API in the Developer portal

## Prerequisites

-   Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md)
-   Make sure there is a Logic App in your subscription that exposes an HTTP endpoint. For more information, [Trigger workflows with HTTP endpoints](../logic-apps/logic-apps-http-endpoint.md)

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## <a name="create-api"> </a>Import and publish a back-end API

1. Navigate to your API Management service in the Azure portal and select **APIs** from the menu.
2. Select **Logic App** from the **Add a new API** list.

    ![Logic app](./media/import-logic-app-as-api/logic-app-select.png)

3. Press **Browse** to see the list of Logic Apps with HTTP trigger in your subscription. (Note that Logic Apps without HTTP trigger will not appear in the list.)
    
    ![Logic app](./media/import-logic-app-as-api/browse-logic-apps.png)

1. Select the app. API Management finds the swagger associated with the selected app, fetches it, and imports it.

    ![Logic app](./media/import-logic-app-as-api/select-logic-app-import.png)

1. Add an API URL suffix. The suffix is a name that identifies this specific API in this API Management instance. It has to be unique in this API Management instance.

    ![Logic app](./media/import-logic-app-as-api/create-from-logic-app.png)

1. If you want the API to be published and available to developers, associate it with a product. In this example, the *"Unlimited"* product is used. 
    * You can add your API to a product either during creation or later via the **Settings** tab.

>[!NOTE]
> Products are associations of one or more APIs offered to developers through the developer portal. First, developers must subscribe to a product to get access to the API. Once subscribed, they get a subscription key for any API in that product. As creator of the API Management instance, you are an administrator and are subscribed to every product by default.
>
> Each API Management instance comes with two default sample products:
> - **Starter**
> - **Unlimited**

7. Enter other API settings. 
    * You can set these values during creation or later by going to the **Settings** tab. The settings are explained in the [Import and publish your first API](import-and-publish.md#import-and-publish-a-backend-api) tutorial.
1. Select **Create**.

## Test the API in the Azure portal

Operations can be called directly from the Azure portal, which provides a convenient way to view and test the operations of an API.

![Logic app](./media/import-logic-app-as-api/test-logic-app-api.png)


1. Select the API you created in the previous step.
2. Press the **Test** tab.
3. Select some operation.

    The page displays fields for query parameters and fields for the headers. One of the headers is "Ocp-Apim-Subscription-Key", for the subscription key of the product that is associated with this API. If you created the API Management instance, you are an administrator already, so the key is filled in automatically.

4. Press **Send**.

    Backend responds with **200 OK** and some data.

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-append-apis.md)]

>[!NOTE]
>Every Logic App has **manual-invoke** operation. If you want to comprise your API of multiple logic apps, in order not to have collision, you need to rename the function.

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]

## Next steps

> [!div class="nextstepaction"]
>
> [Transform and protect a published api](transform-api.md)
