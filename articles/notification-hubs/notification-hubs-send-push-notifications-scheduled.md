<properties
	pageTitle="How to send scheduled notifications | Microsoft Azure"
	description="This topic describes using Scheduled Notifications with Azure Notification Hubs."
	services="notification-hubs"
	documentationCenter=".net"
	keywords="push notifications,push notification,scheduling push notifications"
	authors="wesmc7777"
	manager="erikre"
	editor=""/>
<tags
	ms.service="notification-hubs"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-android"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="06/29/2016"
	ms.author="wesmc"/>

# How To: Send scheduled notifications


##Overview

If you have a scenario in which you want to send a notification at some point in the future, but do not have an easy way to wake up your back-end code to send the notification. Standard tier Notification Hubs supports a feature that enables you to schedule notifications up to 7 days in the future.

When sending a notification, simply use the [ScheduledNotification](https://msdn.microsoft.com/library/microsoft.azure.notificationhubs.schedulednotification.aspx) class in the Notification Hubs SDK as shown in the following example:

	Notification notification = new AppleNotification("{\"aps\":{\"alert\":\"Happy birthday!\"}}");
	var scheduled = await hub.ScheduleNotificationAsync(notification, new DateTime(2014, 7, 19, 0, 0, 0));

Also, you can cancel a previously scheduled notification using its notificationId:

	await hub.CancelNotificationAsync(scheduled.ScheduledNotificationId);

There are no limits on the number of scheduled notifications you can send.