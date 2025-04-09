---
title: Import a logic app as an API by using the Azure portal  | Microsoft Docs
description: Learn how to use Azure API Management to import a logic app (Consumption) resource as an API.
services: api-management
author: dlepow
ms.service: azure-api-management
ms.topic: how-to
ms.date: 03/27/2025
ms.author: danlep

#customer intent: As a developer, I want to import a logic app as an API.
---

# Import a logic app as an API

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

This article shows how to import a logic app as an API and test the imported API.

[!INCLUDE [api-management-workspace-availability](../../includes/api-management-workspace-availability.md)]

In this article, you learn how to:

> [!div class="checklist"]
>
> -   Import a logic app as an API
> -   Test the API in the Azure portal

> [!NOTE]
> Azure API Management supports automated import of a Logic App (Consumption) resource, which runs in the multitenant Logic Apps environment. For more information, see [Differences between Standard single-tenant logic apps and Consumption multitenant logic apps](../logic-apps/single-tenant-overview-compare.md).

## Prerequisites

-   Complete the quickstart [Create an Azure API Management instance](get-started-create-service-instance.md).
-   Make sure there's a Consumption plan-based Logic App resource in your subscription that exposes an HTTP endpoint. For more information, see [Trigger workflows with HTTP endpoints](../logic-apps/logic-apps-http-endpoint.md).

## Import and publish a backend API

1. Navigate to your API Management service in the [Azure portal](https://portal.azure.com).
1. In the left menu, in the **APIs** section, select **APIs**, and then select **+ Add API**.

1. Select **Logic App** in the **Create from Azure resource** list:

    :::image type="content" source="./media/import-logic-app-as-api/logic-app-select.png" alt-text="Screenshot that shows the Logic App tile.":::

1. Select **Browse** to see the list of logic apps that have HTTP trigger in your subscription. (Logic apps that don't have an HTTP trigger won't appear in the list.)

    :::image type="content" source="./media/import-logic-app-as-api/browse-logic-apps.png" alt-text="Screenshot that shows the Browse button." lightbox="./media/import-logic-app-as-api/browse-logic-apps.png":::

1. Select the logic app:

    :::image type="content" source="./media/import-logic-app-as-api/select-logic-app-import-2.png" alt-text="Screenshot that shows the Select Logic App to import window." lightbox="./media/import-logic-app-as-api/select-logic-app-import-2.png":::

    API Management finds the Swagger document that's associated with the selected app, fetches it, and imports it.

1. Add an API URL suffix. The suffix uniquely identifies the API in the API Management instance.

    :::image type="content" source="./media/import-logic-app-as-api/create-from-logic-app.png" alt-text="Screenshot that shows values entered in the Create from Logic App window." lightbox="./media/import-logic-app-as-api/create-from-logic-app.png":::

1. If you want the API to be published and available to developers, switch to the **Full** view and associate the API with a **Product**. This example uses the **Unlimited** product. (You can add your API to a product when you create it or later via the **Settings** tab.)

    >[!NOTE]
    > Products are associations of one or more APIs offered to developers via the developer portal. First, developers must subscribe to a product to get access to the API. After they subscribe, they get a subscription key for any API in the product. As creator of the API Management instance, you're an administrator and are subscribed to every product by default.
    >
    > In certain tiers, each API Management instance comes with two default sample products:
    > - **Starter**
    > - **Unlimited**

1. Enter other API settings. You can set these values when you create the API or later by going to the **Settings** tab. The settings are explained in the [Import and publish your first API](import-and-publish.md#import-and-publish-a-backend-api) tutorial.

1. Select **Create**.

## Test the API in the Azure portal

You can call operations directly from the Azure portal. This method provides a convenient way to view and test the operations of an API.

:::image type="content" source="./media/import-logic-app-as-api/test-logic-app-api.png" alt-text="Screenshot that shows the steps for testing an API." lightbox="./media/import-logic-app-as-api/test-logic-app-api.png":::

1. Select the API that you created in the previous step.
1. On the **Test** tab, select the operation that you want to test.

    * The page displays fields for query parameters and headers. 
    * One of the headers is `Ocp-Apim-Subscription-Key`. This header is for the product subscription key that's associated with the API. 
    * As creator of the API Management instance, you're an administrator, so the key is filled in automatically.

1. Select **Send**. When the test succeeds, the backend responds with **200 OK** and data.

[!INCLUDE [api-management-append-apis.md](../../includes/api-management-append-apis.md)]

>[!NOTE]
>Every Logic App has a `manual-invoke` operation. If you want to combine multiple logic apps in an API, you need to rename the function. To rename the function/API, change the title value in the OpenAPI Specification editor.

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]