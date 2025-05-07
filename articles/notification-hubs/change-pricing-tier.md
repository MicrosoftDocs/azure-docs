---
title: Change pricing tier of Notification Hubs namespace | Microsoft Docs
description: Learn how to change the pricing tier of an Azure Notification Hubs namespace.
author: sethmanheim
manager: lizross
ms.service: azure-notification-hubs
ms.topic: article
ms.date: 08/03/2020
ms.author: sethm
ms.reviewer: thsomasu
ms.lastreviewed: 01/28/2019
---

# Change pricing tier of an Azure notification hubs namespace

Notification Hubs is offered in three tiers: **free**, **basic**, and **standard**. This article shows you how to change the pricing tier for an Azure Notification Hubs namespace.

## Overview

In Azure Notification Hubs, a *notification hub* is the smallest resource/entity. It generally maps to one application and can hold one certificate for each Platform Notification System (PNS) we support for the app. The application can be a hybrid, or a native and a cross-platform application.

A *namespace* is a collection of notification hubs. Each namespace usually consists of hubs that are related and used for a specific purpose. For example, you can have three different namespaces for development, test, and production purposes, respectively.

You can associate a namespace with the **free**, **basic**, or **standard** pricing tiers. For any namespace, you can use the tier that suits your requirements. The following sections show you how to change the pricing tier of a Notification Hubs namespace.

## Use Azure portal

When using the Azure portal, you can change the pricing tier for a namespace on the namespace page, or on a hub page. When you change it on a hub page, you actually change it at the namespace level. It changes the pricing tier for the namespace and all hubs in the namespace.

### Change tier on the namespace page

The following procedure shows how to change the pricing tier for a namespace on the namespace page. When you change the tier for a namespace, it applies to all hubs in that namespace.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All services** on the left menu.
3. Select **Notification Hub Namespaces** in the **Internet of Things** section. If you select the asterisk (`*`) next to the text, it's added to the left navigation bar under **FAVORITES**. This helps you access the namespaces page faster next time. After you add it to **FAVORITES**, select **Notification Hub Namespaces**.

    ![All services -> Notification Hub Namespaces](./media/change-pricing-tier/all-services-nhub.png)

4. On the **Notification Hub Namespaces** page, select the namespace for which you want to change the pricing tier.
5. On the **Notification Hub Namespace** page for your namespace, you can see the current pricing tier for the namespace in the **Essentials** section. In the following image, you can see that the pricing tier of the namespace is **Free**.

    ![Current pricing tier on the namespace page](./media/change-pricing-tier/pricing-tier-before.png)

6. On the **Notification Hub Namespace** page for your namespace, select **Pricing Tier** in the **Manage** section.

    ![Select pricing tier on the namespace page](./media/change-pricing-tier/namespace-select-pricing-menu.png)

7. Change the pricing tier, and then click the **Select** button.
8. You can see the status of the tier change action in the **alerts**.
9. Switch to the **Overview** page. Confirm that the new tier is shown for the **Pricing Tier** field in the **Essentials** section.
10. This step is optional. Select any hub in the namespace. Confirm that you see the same pricing tier in the **Essentials** section. You should see the same pricing tier for all hubs in the namespace.

### Change tier on the hub page

Follow these steps to change the pricing tier of a namespace on the hub page. Even though you do these steps starting from the hub page, you actually change the pricing tier for the namespace and all hubs in the namespace:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All services** on the left menu.
3. Select **Notification Hubs** in the **Internet of Things** section.
4. Select your notification **hub**.
5. Select **Pricing Tier** on the left menu.
6. Change the pricing tier, and click the **Select** button. This action changes the pricing tier setting for the namespace that contains the hub. So, you see the new pricing tier on the namespace page and all hub pages.

> [!NOTE]
> All pricing tier changes are effective immediately.

## Use REST API

You can use the following Resource Provider REST APIs to get the current pricing tier and update it.

### Get current pricing tier for a namespace

To get the current namespace tier, send a GET command, as shown in the following example:

```REST
GET: https://management.core.windows.net/{subscription ID}/services/ServiceBus/Namespaces/{namespace name}/notificationhubplan
```

### Update pricing tier for a namespace

To update the namespace tier, send a PUT command, as shown in the following example:

```REST
PUT: https://management.core.windows.net/{subscription ID}/services/ServiceBus/Namespaces/{namespace name}/notificationhubplan
Body: <NotificationHubPlan xmlns:i="https://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/netservices/2010/10/servicebus/connect"><SKU>Standard</SKU></NotificationHubPlan>
```

## Next steps

For more information about these tiers and pricing, see [Notification Hubs pricing](https://azure.microsoft.com/pricing/details/notification-hubs/).
