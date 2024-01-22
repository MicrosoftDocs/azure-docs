---
title: Create an Azure notification hub using the Azure portal | Microsoft Docs
description: In this tutorial, you learn how to create an Azure notification hub by using the Azure portal.
services: notification-hubs
author: sethmanheim
ms.author: sethm
manager: femila
ms.reviewer: rebpen
ms.date: 07/17/2023
ms.topic: quickstart
ms.service: notification-hubs
ms.workload: mobile
ms.custom: mode-ui
---

# Quickstart: Create an Azure notification hub in the Azure portal

Azure Notification Hubs provide an easy-to-use and scaled-out push engine that allows you to send notifications to any platform (iOS, Android, Windows, Kindle, Baidu, etc.) from any backend (cloud or on-premises). For more information about the service, see [What is Azure Notification Hubs?](notification-hubs-push-notification-overview.md).

In this quickstart, you create a notification hub in the Azure portal. The first section gives you steps to create a Notification Hubs namespace and a hub in that namespace. The second section gives you steps to create a notification hub in an existing Notification Hubs namespace.

## Create a namespace and a notification hub

In this section, you create a namespace and a hub in the namespace.

[!INCLUDE [notification-hubs-portal-create-new-hub.](../../includes/notification-hubs-portal-create-new-hub.md)]

## Create a notification hub in an existing namespace

In this section, you create a notification hub in an existing namespace.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **All services** on the left menu.
    ![A screenshot showing select All Services for an existing namespace for a new hub.](./media/create-notification-hub-portal/select-all-services.png)

1. On the **Notification Hubs** page, select **Create** on the toolbar.

      ![A screenshot showing how to create a new notification hub in a new hub.](./media/create-notification-hub-portal/create-toolbar-button.png)

1. In the **Basics** tab on the **Notification Hub** page, do the following steps:

    1. In **Subscription**, select the name of the Azure subscription you want to use, and then select an existing resource group, or create a new one.  
    1. Choose **Select existing** and select your namespace from the drop-down list box.
A namespace contains one or more notification hubs, so type a name for the hub in **Notification Hub Details**.

1. Select a value from the **Location** drop-down list box. This value specifies the location in which you want to create the hub.

    :::image type="content" source="./media/create-notification-hub-portal/notification-hub-details.png" alt-text="Screenshot showing notification hub details for existing namespaces." lightbox="./media/create-notification-hub-portal/notification-hub-details.png":::

1. Review the [**Availability Zones**](./notification-hubs-high-availability.md#zone-redundant-resiliency) option. If you chose a region that has availability zones, the check box is selected by default. Availability Zones is a paid feature, so an additional fee is added to your tier.

    > [!NOTE]
    > The Availability Zones feature is currently in public preview. Availability Zones is available for an additional cost; however, you will not be charged while the feature is in preview. For more information, see [High availability for Azure Notification Hubs](./notification-hubs-high-availability.md).

1. Choose a **Disaster recovery** option: **None**, **Paired recovery region**, or **Flexible recovery region**. If you choose **Paired recovery region**, the failover region is displayed. If you select **Flexible recovery region**, use the drop-down to choose from a list of recovery regions.

    :::image type="content" source="./media/create-notification-hub-portal/availability-zones.png" alt-text="Screenshot showing availability zone details for existing namespace." lightbox="./media/create-notification-hub-portal/availability-zones.png":::

1. Select **Create**.

## Next steps

- In this quickstart, you created a notification hub. To learn how to configure the hub with platform notification system (PNS) settings, see [Configure a notification hub with PNS settings](configure-notification-hub-portal-pns-settings.md).
- For more information about availability zones, see [High availability for Azure Notification Hubs](notification-hubs-high-availability.md).
