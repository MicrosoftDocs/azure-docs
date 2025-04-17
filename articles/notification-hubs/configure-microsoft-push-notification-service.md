---
title: Configure Microsoft Push Notification Service in Azure Notification Hubs | Microsoft Docs
description: Learn how to configure Microsoft Push Notification Service settings for an Azure notification hub.
services: notification-hubs
author: sethmanheim
manager: lizross

ms.service: azure-notification-hubs
ms.topic: article
ms.date: 08/23/2021
ms.author: sethm
ms.reviewer: thsomasu
ms.lastreviewed: 03/25/2019
---

# Configure Microsoft Push Notification Service (MPNS) settings in the Azure portal

> [!NOTE]
> Microsoft Push Notification Service (MPNS) has been deprecated and is no longer supported.

This article shows you how to configure Microsoft Push Notification Service (MPNS) settings for an Azure notification hub by using the Azure portal.

## Prerequisites

If you haven't already created a notification hub, create one now. For more information, see [Create an Azure notification hub in the Azure portal](create-notification-hub-portal.md).

## Configure Microsoft Push Notification Service (MPNS)

The following procedure describes how to configure Microsoft Push Notification Service (MPNS) settings for a notification hub:

1. In the Azure portal, on the **Notification Hub** page, select **Windows Phone (MPNS)** on the left menu.
2. Enable either unauthenticated or authenticated push notifications:

   a. To enable unauthenticated push notifications, select **Enable unauthenticated push** > **Save**.

      ![Screenshot that shows how to enable unauthenticated push notifications](./media/notification-hubs-windows-phone-get-started/azure-portal-unauth.png)

   b. To enable authenticated push notifications:
      * On the toolbar, select **Upload Certificate**.
      * Select the file icon, and then select the certificate file.
      * Enter the password for the certificate.
      * Select **OK**.
      * On the **Windows Phone (MPNS)** page, select **Save**.

## Next steps

For a tutorial with step-by-step instructions for pushing notifications to Windows Phone devices by using Azure Notification Hubs and Microsoft Push Notification Service (MPNS), see [Send push notifications to Windows Phone apps by using Notification Hubs](notification-hubs-windows-mobile-push-notifications-mpns.md).
