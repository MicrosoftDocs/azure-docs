---
title: Configure Apple Push Notification Service in Azure Notification Hubs | Microsoft Docs
description: Learn how to configure an Azure notification hub with Apple Push Notification Service (APNS) settings. 
services: notification-hubs
author: sethmanheim
manager: femila
editor: jwargo

ms.service: notification-hubs
ms.workload: mobile
ms.topic: article
ms.date: 03/25/2019
ms.author: sethm
ms.reviewer: jowargo
ms.lastreviewed: 03/25/2019
---

# Configure Apple Push Notification Service settings for a notification hub in the Azure portal

This article shows you how to configure Apple Push Notification Service (APNS) settings for an Azure notification hub by using the Azure portal. 

## Prerequisites
If you haven't already created a notification hub, create one now. For more information, see [Create an Azure notification hub in the Azure portal](create-notification-hub-portal.md). 

## Configure Apple Push Notification Service

The following procedure gives you steps to configure Apple Push Notification Service (APNS) settings for a notification hub:

1. In the Azure portal, on the **Notification Hub** page, select **Apple (APNS)** on the left menu.

1. For **Authentication Mode**, select either **Certificate** or **Token**.

   a. If you select **Certificate**:
   * Select the file icon, and then select the *.p12* file you want to upload.
   * Enter a password.
   * Select **Sandbox** mode. Or, to send push notifications to users who purchased your app from the store, select **Production** mode.

     ![Screenshot of an APNS certificate configuration in the Azure portal](./media/configure-apple-push-notification-service/notification-hubs-apple-config-cert.png)

   b. If you select **Token**:

   * Enter the values for **Key ID**, **Bundle ID**, **Team ID**, and **Token**.
   * Select **Sandbox** mode. Or, to send push notifications to users who purchased your app from the store, select **Production** mode.

     ![Screenshot of an APNS token configuration in the Azure portal](./media/configure-apple-push-notification-service/notification-hubs-apple-config-token.png)

## Next steps
For a tutorial with step-by-step instructions for pushing notifications to iOS devices, see the following article: [Push notifications to iOS devices by using Notification Hubs and APNS](notification-hubs-ios-apple-push-notification-apns-get-started.md)
