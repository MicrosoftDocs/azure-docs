---
title: Configure Apple Push Notification Service in Azure Notification Hubs | Microsoft Docs
description: Learn how to configure an Azure notification hub with Apple Push Notification Service (APNS) settings. 
services: notification-hubs
author: jwargo
manager: patniko
editor: spelluru

ms.service: notification-hubs
ms.workload: mobile
ms.topic: quickstart
ms.date: 03/25/2019
ms.author: jowargo
---

# Configure Apple Push Notification Service settings for a notification hub in the Azure portal
In this quickstart, you'll configure a notification hub with Apple Push Notification Service (APNS) settings. The quickstart shows you the steps to take in the Azure portal.

## Prerequisites
If you haven't already created a notification hub, create one now. For more information, see [Create an Azure notification hub in the Azure portal](create-notification-hub-portal.md). 

## Apple Push Notification Service

To set up Apple Push Notification Service (APNS):

1. In the Azure portal, in the **Notification Hub**, select **Apple (APNS)**.

1. For **Authentication Mode**, select either **Certificate** or **Token**.

   a. If you select **Certificate**:
   * Select the file icon, and then select the *.p12* file you want to upload.
   * Enter a password.
   * Select **Sandbox** mode. Or, to send push notifications to users who purchased your app from the store, select **Production** mode.

     ![Screenshot of an APNS certificate configuration in the Azure portal](./media/notification-hubs-ios-get-started/notification-hubs-apple-config-cert.png)

   b. If you select **Token**:

   * Enter the values for **Key Id**, **Bundle Id**, **Team Id**, and **Token**.
   * Select **Sandbox** mode. Or, to send push notifications to users who purchased your app from the store, select **Production** mode.

     ![Screenshot of an APNS token configuration in the Azure portal](./media/notification-hubs-ios-get-started/notification-hubs-apple-config-token.png)

For for more information, see [Push notifications to iOS by using Azure Notification Hubs](notification-hubs-ios-apple-push-notification-apns-get-started.md).
## Next steps
In this quickstart, you learned how to configure Apple Push Notification Service (APNS) settings for a notification hub in the Azure portal. For an end-to-end tutorial for pushing notifications to iOS devices, see the following article: [Push notifications to iOS devices by using Notification Hubs and APNS](notification-hubs-ios-apple-push-notification-apns-get-started.md)
