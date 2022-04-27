---
title: How to send scheduled notifications | Microsoft Docs
description: This topic describes using Scheduled Notifications with Azure Notification Hubs.
services: notification-hubs
documentationcenter: .net
keywords: push notifications,push notification,scheduling push notifications
author: sethmanheim
manager: femila
editor: jwargo

ms.assetid: 6b718c75-75dd-4c99-aee3-db1288235c1a
ms.service: notification-hubs
ms.workload: mobile
ms.tgt_pltfrm: mobile-android
ms.devlang: csharp
ms.topic: article
ms.date: 01/04/2019
ms.author: sethm
ms.reviewer: jowargo
ms.lastreviewed: 01/04/2019
ms.custom: devx-track-csharp
---

# How To: Send scheduled notifications

If you have a scenario in which you want to send a notification at some point in the future, but do not have an easy way to wake up your back-end code to send the notification. Standard tier notification hubs support a feature that enables you to schedule notifications up to seven days in the future.


## Schedule your notifications
When sending a notification, simply use the [`ScheduledNotification` class](/dotnet/api/microsoft.azure.notificationhubs.schedulednotification#microsoft_azure_notificationhubs_schedulednotification) in the Notification Hubs SDK as shown in the following example:

```csharp
Notification notification = new AppleNotification("{\"aps\":{\"alert\":\"Happy birthday!\"}}");
var scheduled = await hub.ScheduleNotificationAsync(notification, new DateTime(2014, 7, 19, 0, 0, 0));
```

## Cancel scheduled notifications
Also, you can cancel a previously scheduled notification using its notificationId:

```csharp
await hub.CancelNotificationAsync(scheduled.ScheduledNotificationId);
```

There are no limits on the number of scheduled notifications you can send.

## Next steps

See the following tutorials:

 - [Push notifications to all registered devices](notification-hubs-windows-store-dotnet-get-started-wns-push-notification.md)
 - [Push notifications to specific devices](notification-hubs-windows-notification-dotnet-push-xplat-segmented-wns.md)
 - [Push localized notifications](notification-hubs-windows-store-dotnet-xplat-localized-wns-push-notification.md)
 - [Push notifications to specific users](notification-hubs-aspnet-backend-windows-dotnet-wns-notification.md) 
 - [Push location-based notifications](notification-hubs-push-bing-spatial-data-geofencing-notification.md)
