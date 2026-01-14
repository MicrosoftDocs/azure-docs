---
title: Edit an API in the Azure Portal  | Microsoft Docs
description: Learn how to use API Management to edit an API or its swagger.
services: api-management
author: dlepow
ms.service: azure-api-management
ms.topic: how-to
ms.date: 10/07/2025
ms.author: danlep
ms.custom: sfi-image-nochange
# Customer intent: As an API developer, I want to use API Management to edit an API or its swagger. 
---
# Edit an API

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

This article describes how to use Azure API Management to edit an API.

+ You can add, rename, or delete operations in the Azure portal.
+ You can edit your API's swagger.

## Prerequisites

+ [Create an Azure API Management instance](get-started-create-service-instance.md)
+ [Import and publish an API](import-and-publish.md)

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## Edit an operation

1. Under **APIs**, select **APIs**.
1. Select an API that you have imported.
1. Select the **Design** tab.
1. Select the operation that you want to edit.
1. To rename the operation, select the pencil button in the **Frontend** pane.

:::image type="content" source="./media/edit-api/edit-api001.png" alt-text="Screenshot that shows the process for editing an API in API Management.":::

## Update the swagger

You can update your API's swagger from the Azure portal by completing these steps:

1. On the **APIs** page, select **All operations**.
1. Select the pencil button in the **Frontend** pane.

    :::image type="content" source="./media/edit-api/edit-api002.png" alt-text="Screenshot that shows the pencil button in the Frontend pane.":::

    Your API's swagger appears.

    :::image type="content" source="./media/edit-api/edit-api003.png" alt-text="Screenshot that shows an API's swagger.":::

1. Update the swagger.
1. Select **Save**.

> [!CAUTION]
> If you're editing a non-current revision of an API, you can't change the following properties:
>
> * Name
> * Type
> * Description
> * Subscription required
> * API version
> * API version description
> * Path
> * Protocols
>
> If your edits change any of these properties in a non-current revision, you'll see the error message 
> `Can't change property for non-current revision`.

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]