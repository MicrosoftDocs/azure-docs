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
ms.date: 04/16/2021
ms.author: apimpm
---

# Import a Logic App as an API

This article shows how to import a Logic App as an API and test the imported API.

In this article, you learn how to:

> [!div class="checklist"]
>
> -   Import a Logic App as an API
> -   Test the API in the Azure portal

## Prerequisites

-   Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md)
-   Make sure there is a Logic App in your subscription that exposes an HTTP endpoint. For more information, [Trigger workflows with HTTP endpoints](../logic-apps/logic-apps-http-endpoint.md)

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## <a name="create-api"> </a>Import and publish a back-end API

1. Navigate to your API Management service in the Azure portal and select **APIs** from the menu.
1. Select **Logic App** from the **Add a new API** list.

    :::image type="content" source="./media/import-logic-app-as-api/logic-app-select.png" alt-text="Select logic app category":::

1. Press **Browse** to see the list of Logic Apps with HTTP trigger in your subscription. 
    * Logic apps *without* HTTP trigger will not appear in the list.

    :::image type="content" source="./media/import-logic-app-as-api/browse-logic-apps.png" alt-text="Browse for existing logic apps with correct trigger":::

1. Select the logic app. 

    :::image type="content" source="./media/import-logic-app-as-api/select-logic-app-import-2.png" alt-text="Select logic app":::

1. API Management finds the swagger associated with the selected app, fetches it, and imports it.
1. Add an API URL suffix. 
    * The suffix uniquely identifies this specific API in this API Management instance.

    :::image type="content" source="./media/import-logic-app-as-api/create-from-logic-app.png" alt-text="Finish up fields":::

1. If you want the API to be published and available to developers, Switch to the **Full** view and associate it with a **Product**. We use the *"Unlimited"* product in this example. 
    * You can add your API to a product either during creation or later via the **Settings** tab.

    >[!NOTE]
    > Products are associations of one or more APIs offered to developers through the developer portal. First, developers must subscribe to a product to get access to the API. Once subscribed, they get a subscription key for any API in that product. As creator of the API Management instance, you are an administrator and are subscribed to every product by default.
    >
    > Each API Management instance comes with two default sample products:
    > - **Starter**
    > - **Unlimited**

1. Enter other API settings. 
    * You can set these values during creation or later by going to the **Settings** tab. The settings are explained in the [Import and publish your first API](import-and-publish.md#import-and-publish-a-backend-api) tutorial.
1. Select **Create**.

## Test the API in the Azure portal

Operations can be called directly from the Azure portal, which provides a convenient way to view and test the operations of an API.

:::image type="content" source="./media/import-logic-app-as-api/test-logic-app-api.png" alt-text="Test the logic app":::

1. Select the API you created in the previous step.
2. Press the **Test** tab.
3. Select the operation you want to test.

    * The page displays fields for query parameters and headers. 
    * One of the headers is "Ocp-Apim-Subscription-Key", for the product subscription key associated with this API. 
    * As creator of the API Management instance, you are an administrator already, so the key is filled in automatically.

4. Press **Send**.

    * When the test succeeds, the backend responds with **200 OK** and data.

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-append-apis.md)]

>[!NOTE]
>Every Logic App has **manual-invoke** operation. To comprise your API of multiple logic apps and avoid collision, you need to rename the function.

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]

## Next steps

> [!div class="nextstepaction"]
>
> [Transform and protect a published api](transform-api.md)
