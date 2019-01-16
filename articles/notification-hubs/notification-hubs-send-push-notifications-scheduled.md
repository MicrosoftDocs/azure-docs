---
title: How to send scheduled notifications | Microsoft Docs
description: This topic describes using Scheduled Notifications with Azure Notification Hubs.
services: notification-hubs
documentationcenter: .net
keywords: push notifications,push notification,scheduling push notifications
author: dimazaid
manager: kpiteira
editor: spelluru

ms.assetid: 6b718c75-75dd-4c99-aee3-db1288235c1a
ms.service: notification-hubs
ms.workload: mobile
ms.tgt_pltfrm: mobile-android
ms.devlang: dotnet
ms.topic: article
ms.date: 04/14/2018
ms.author: dimazaid

---
# How To: Send scheduled notifications
## Overview
If you have a scenario in which you want to send a notification at some point in the future, but do not have an easy way to wake up your back-end code to send the notification. Standard tier notification hubs support a feature that enables you to schedule notifications up to seven days in the future.

When sending a notification, simply use the [ScheduledNotification](https://msdn.microsoft.com/library/microsoft.azure.notificationhubs.schedulednotification.aspx) class in the Notification Hubs SDK as shown in the following example:

    Notification notification = new AppleNotification("{\"aps\":{\"alert\":\"Happy birthday!\"}}");
    var scheduled = await hub.ScheduleNotificationAsync(notification, new DateTime(2014, 7, 19, 0, 0, 0));

Also, you can cancel a previously scheduled notification using its notificationId:

    await hub.CancelNotificationAsync(scheduled.ScheduledNotificationId);

There are no limits on the number of scheduled notifications you can send.

