---
title: Sending push notifications with Azure Notification Hubs and Node.js
description: Learn how to use Notification Hubs to send push notifications from a Node.js application.
keywords: push notification,push notifications,node.js push,ios push
services: notification-hubs
documentationcenter: nodejs
author: sethmanheim
manager: femila

ms.service: notification-hubs
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: javascript
ms.topic: article
ms.date: 08/23/2021
ms.author: sethm
ms.reviewer: thsomasu
ms.lastreviewed: 01/04/2019
ms.custom: devx-track-js
---

# Sending push notifications with Azure Notification Hubs and Node.js

[!INCLUDE [notification-hubs-backend-how-to-selector](../../includes/notification-hubs-backend-how-to-selector.md)]

## Overview

> [!IMPORTANT]
> To complete this tutorial, you must have an active Azure account. If you don't have an account, create a free trial account in just a couple of minutes through the [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A643EE910&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdocumentation%2Farticles%2Fnotification-hubs-nodejs-how-to-use-notification-hubs).

This guide shows you how to send push notifications with the help of Azure Notification Hubs directly from a [Node.js](https://nodejs.org) application.

The scenarios covered include sending push notifications to applications on the following platforms:

- Android
- iOS
- Universal Windows Platform
- Windows Phone

## Notification Hubs

Azure Notification Hubs provide an easy-to-use, multi-platform, scalable infrastructure for sending push notifications to mobile devices. For details on the service infrastructure, see the [Azure Notification Hubs](/previous-versions/azure/azure-services/jj927170(v=azure.100)) page.

## Create a Node.js Application

The first step in this tutorial is creating a new blank Node.js application. For instructions on creating a Node.js application, see [Create and deploy a Node.js application to Azure Web Site][nodejswebsite], [Node.js Cloud Service][Node.js Cloud Service] using Windows PowerShell, or [Web Site with WebMatrix][webmatrix].

## Configure Your Application to Use Notification Hubs

To use Azure Notification Hubs, you need to download and use the Node.js [azure package](https://www.npmjs.com/package/azure), which includes a built-in set of helper libraries that communicate with the push notification REST services.

### Use Node Package Manager (NPM) to obtain the package

1. Use a command-line interface such as **PowerShell** (Windows), **Terminal** (Mac), or **Bash** (Linux) and navigate to the folder where you created your blank application.
2. Execute `npm install azure-sb` in the command window.
3. You can manually run the `ls` or `dir` command to verify that a `node_modules` folder was created.
4. Inside that folder, find the **azure** package, which contains the libraries you need to access the Notification Hub.

> [!NOTE]
> You can learn more about installing NPM on the official [NPM blog](https://blog.npmjs.org/post/85484771375/how-to-install-npm).

### Import the module
Using a text editor, add the following to the top of the `server.js` file of the application:

```javascript
var azure = require('azure-sb');
```

### Set up an Azure Notification Hub connection

The `NotificationHubService` object lets you work with notification hubs. The following code creates a `NotificationHubService` object for the notification hub named `hubname`. Add it near the top of the `server.js` file, after the statement to import the azure
module:

```javascript
var notificationHubService = azure.createNotificationHubService('hubname','connectionstring');
```

Obtain the connection `connectionstring` value from the [Azure portal] by performing the following steps:

1. In the left navigation pane, click **Browse**.
2. Select **Notification Hubs**, and then find the hub you wish to use for the sample. You can refer to the [Windows Store Getting Started tutorial](notification-hubs-windows-store-dotnet-get-started-wns-push-notification.md) if you need help with creating a new Notification Hub.
3. Select **Settings**.
4. Click on **Access Policies**. You see both shared and full access connection strings.

![Azure portal - Notification Hubs](./media/notification-hubs-nodejs-how-to-use-notification-hubs/notification-hubs-portal.png)

> [!NOTE]
> You can also retrieve the connection string via the `Get-AzureSbNamespace` cmdlet in [Azure PowerShell](/powershell/azure/) or the `azure sb namespace show` command in the [Azure classic CLI](/cli/azure/install-classic-cli).

## General architecture

The `NotificationHubService` object exposes the following object instances for sending push notifications to specific devices and applications:

- **Android** - use the `GcmService` object, which is available at `notificationHubService.gcm`
- **iOS** - use the `ApnsService` object, which is accessible at `notificationHubService.apns`
- **Windows Phone** - use the `MpnsService` object, which is available at `notificationHubService.mpns`
- **Universal Windows Platform** - use the `WnsService` object, which is available at `notificationHubService.wns`

> [!NOTE]
> Microsoft Push Notification Service (MPNS) has been deprecated and is no longer supported.

### How to: Send push notifications to Android applications

The `GcmService` object provides a `send` method that can be used to send push notifications to Android applications. The `send` method accepts the following parameters:

- **Tags** - the tag identifier. If no tag is provided, the notification is sent to all clients.
- **Payload** - the message's JSON or raw string payload.
- **Callback** - the callback function.

For more information on the payload format, see the [Payload documentation](https://payload.readthedocs.io/en/latest/).

The following code uses the `GcmService` instance exposed by the `NotificationHubService` to send a push notification to all registered clients.

```javascript
var payload = {
  data: {
    message: 'Hello!'
  }
};
notificationHubService.gcm.send(null, payload, function(error){
  if(!error){
    //notification sent
  }
});
```

### How to: Send push notifications to iOS applications

Same as with Android applications described above, the `ApnsService` object provides a `send` method that can be used to send push notifications to iOS applications. The `send` method accepts the following parameters:

- **Tags** - the tag identifier. If no tag is provided, the notification is sent to all clients.
- **Payload** - the message's JSON or string payload.
- **Callback** - the callback function.

For more information the payload format, see The **Notification Content** section of the [UserNotifications guide](https://developer.apple.com/documentation/usernotifications).

The following code uses the `ApnsService` instance exposed by the `NotificationHubService` to send an alert message to all clients:

```javascript
var payload={
    alert: 'Hello!'
  };
notificationHubService.apns.send(null, payload, function(error){
  if(!error){
      // notification sent
  }
});
```

### How to: Send push notifications to Windows Phone applications

The `MpnsService` object provides a `send` method that can be used to send push notifications to Windows Phone applications. The `send` method accepts the following parameters:

- **Tags** - the tag identifier. If no tag is provided, the notification is sent to all clients.
- **Payload** - the message's XML payload.
- **TargetName** - `toast` for toast notifications. `token` for tile notifications.
- **NotificationClass** - The priority of the notification. See the **HTTP Header Elements** section of the [Push notifications from a server](/previous-versions/windows/xna/bb200104(v=xnagamestudio.41)) document for valid values.
- **Options** - optional request headers.
- **Callback** - the callback function.

For a list of valid `TargetName`, `NotificationClass` and header options, check out the [Push notifications from a server](/previous-versions/windows/xna/bb200104(v=xnagamestudio.41)) page.

The following sample code uses the `MpnsService` instance exposed by the `NotificationHubService` to send a toast push notification:

```javascript
var payload = '<?xml version="1.0" encoding="utf-8"?><wp:Notification xmlns:wp="WPNotification"><wp:Toast><wp:Text1>string</wp:Text1><wp:Text2>string</wp:Text2></wp:Toast></wp:Notification>';
notificationHubService.mpns.send(null, payload, 'toast', 22, function(error){
  if(!error){
    //notification sent
  }
});
```

### How to: Send push notifications to Universal Windows Platform (UWP) applications

The `WnsService` object provides a `send` method that can be used to send push notifications to Universal Windows Platform applications.  The `send` method accepts the following parameters:

- **Tags** - the tag identifier. If no tag is provided, the notification is sent to all registered clients.
- **Payload** - the XML message payload.
- **Type** - the notification type.
- **Options** - optional request headers.
- **Callback** - the callback function.

For a list of valid types and request headers, see [Push notification service request and response headers](/previous-versions/windows/apps/hh465435(v=win.10)).

The following code uses the `WnsService` instance exposed by the `NotificationHubService` to send a toast push notification to a UWP app:

```javascript
var payload = '<toast><visual><binding template="ToastText01"><text id="1">Hello!</text></binding></visual></toast>';
notificationHubService.wns.send(null, payload , 'wns/toast', function(error){
  if(!error){
      // notification sent
  }
});
```

## Next Steps

The sample snippets above allow you to easily build service infrastructure to deliver push notifications to a wide variety of devices. Now that you've learned the basics of using Notification Hubs with Node.js, follow these links to learn more about how you can extend these capabilities further.

- See the MSDN Reference for [Azure Notification Hubs](/previous-versions/azure/azure-services/jj927170(v=azure.100)).
- Visit the [Azure SDK for Node] repository on GitHub for more samples and implementation details.

[Azure SDK for Node]: https://github.com/WindowsAzure/azure-sdk-for-node
[Next Steps]: #nextsteps
[What are Service Bus Topics and Subscriptions?]: #what-are-service-bus-topics
[Create a Service Namespace]: #create-a-service-namespace
[Obtain the Default Management Credentials for the Namespace]: #obtain-default-credentials
[Create a Node.js Application]: #Create_a_Nodejs_Application
[Configure Your Application to Use Service Bus]: #Configure_Your_Application_to_Use_Service_Bus
[How to: Create a Topic]: #How_to_Create_a_Topic
[How to: Create Subscriptions]: #How_to_Create_Subscriptions
[How to: Send Messages to a Topic]: #How_to_Send_Messages_to_a_Topic
[How to: Receive Messages from a Subscription]: #How_to_Receive_Messages_from_a_Subscription
[How to: Handle Application Crashes and Unreadable Messages]: #How_to_Handle_Application_Crashes_and_Unreadable_Messages
[How to: Delete Topics and Subscriptions]: #How_to_Delete_Topics_and_Subscriptions
[1]: #Next_Steps
[Topic Concepts]: .media/notification-hubs-nodejs-how-to-use-notification-hubs/sb-topics-01.png
[image]: .media/notification-hubs-nodejs-how-to-use-notification-hubs/sb-queues-03.png
[2]: .media/notification-hubs-nodejs-how-to-use-notification-hubs/sb-queues-04.png
[3]: .media/notification-hubs-nodejs-how-to-use-notification-hubs/sb-queues-05.png
[4]: .media/notification-hubs-nodejs-how-to-use-notification-hubs/sb-queues-06.png
[5]: .media/notification-hubs-nodejs-how-to-use-notification-hubs/sb-queues-07.png
[Azure Service Bus Notification Hubs]: /previous-versions/azure/azure-services/jj927170(v=azure.100)
[Web Site with WebMatrix]: /develop/nodejs/tutorials/web-site-with-webmatrix/
[Node.js Cloud Service]: ../cloud-services/cloud-services-nodejs-develop-deploy-app.md
[Previous Management Portal]: .media/notification-hubs-nodejs-how-to-use-notification-hubs/previous-portal.png
[nodejswebsite]: ../app-service/quickstart-nodejs.md
[webmatrix]: /aspnet/web-pages/videos/introduction/create-a-website-using-webmatrix
[Node.js Cloud Service with Storage]: /develop/nodejs/tutorials/web-app-with-storage/
[Node.js Web Application with Storage]: /develop/nodejs/tutorials/web-site-with-storage/
[Azure Portal]: https://portal.azure.com
