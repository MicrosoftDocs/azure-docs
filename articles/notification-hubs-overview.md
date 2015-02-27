<properties 
	pageTitle="Azure Notification Hubs" 
	description="Learn how to use push notifications in Azure. Code samples written in C# using the .NET API." 
	authors="wesmc7777" 
	manager="dwrede" 
	editor="" 
	services="notification-hubs" 
	documentationCenter=""/>

<tags 
	ms.service="notification-hubs" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="02/24/2015" 
	ms.author="wesmc"/>


#Azure Notification Hubs

##Overview

Push notification support in Azure enables you to access an easy-to-use, multiplatform, and scaled-out push infrastructure, which greatly simplifies the implementation of push notifications for both consumer and enterprise applications for mobile platforms.

##What are Push Notifications?

Smartphones and tablets have the ability to "notify" users when an event has occurred. In Windows Store applications, the notification can result in a _toast_: a modeless window appears, with a sound, to signal a new push. On Apple iOS devices, the push similarly interrupts with a dialog box, requesting the user to view or close the notification. Clicking **View** opens the application that is receiving the message.

Push notifications help mobile devices display fresh information while remaining energy-efficient. Push notifications are a vital component for consumer apps, where they are used to increase app engagement and usage. Notifications are also useful to enterprises, when up-to-date information increases employee responsiveness to business events. 

Some specific examples of mobile engagement scenarios are:

1.  Updating a tile on Windows 8 or Windows Phone with current financial information.
2.  Alerting a user with a toast that some work item has been assigned to that user, in a workflow-based enterprise app.
3.  Displaying a badge with the number of current sales leads in a CRM app (such as Microsoft Dynamics CRM).

##How Push Notifications Work

Push notifications are delivered through platform-specific infrastructures called _Platform Notification Systems_ (PNS). A PNS offers barebones functions (that is, no support for broadcast, personalization) and have no common interface. For instance, in order to send a notification to a Windows Store app, a developer must contact the WNS (Windows Notification Service), to send a notification to an iOS device, the same developer has to contact APNS (Apple Push Notification Service), and send the message a second time.

At a high level, though, all platform notification systems follow the same pattern:

1.  The client app contacts the PNS to retrieve its _handle_. The handle type depends on the system. For WNS, it is a URI or "notification channel." For APNS, it is a token.
2.  The client app stores this handle in the app _back-end_ for later usage. For WNS, the back-end is typically a cloud service. For Apple, the system is called a _provider_.
3.  To send a push notification, the app back-end contacts the PNS using the handle to target a specific client app instance.
4.  The PNS forwards the notification to the device specified by the handle.

![][0]

##The Challenges of Push Notifications

While these systems are very powerful, they still leave much work to the app developer in order to implement even common push notification scenarios, such as broadcasting or sending push notifications to a user.

Push notifications are one of the most requested features in cloud services for mobile apps. The reason for this is that the infrastructure required to make them work is fairly complex and mostly unrelated to the main business logic of the app. Some of the challenges in building an on-demand push infrastructure are:

- **Platform dependency.** In order to send notifications to devices on different platforms, multiple interfaces must be coded in the back-end. Not only are the low-level details different, but the presentation of the notification (tile, toast, or badge) is also platform-dependent. These differences can lead to complex and hard-to-maintain back-end code.

- **Scale.** Scaling this infrastructure has two aspects:
1. Per PNS guidelines, device tokens must be refreshed every time the app is launched. This leads to a large amount of traffic (and consequent database accesses) just to keep the device tokens up to date. When the number of devices grows (possibly to millions), the cost of creating and maintaining this infrastructure is nonnegligible.
2.  Most PNSs do not support broadcast to multiple devices. It follows that a broadcast to millions of devices results in millions of calls to the PNSs. Being able to scale these requests is nontrivial, because usually app developers want to keep the total latency down (for example, the last device to receive the message should not receive the notification 30 minutes after the notifications has been sent, as for many cases it would defeat the purpose to have push notifications).
- **Routing.** PNSs provide a way to send a message to a device. However, in most apps notifications are targeted at users and/or interest groups (for example, all employees assigned to a certain customer account). As such, in order to route the notifications to the correct devices, the app back-end must maintain a registry that associates interest groups with device tokens. This overhead adds to the total time to market and maintenance costs of an app.

##Why Use Notification Hubs?

Notification hubs provide a ready-to-use push notification infrastructure that supports the following:

- **Multiple platforms.** Notification hubs provide a common interface to send notifications to all supported platforms. The app back-end can send notifications in platform-specific, or platform-independent formats. Notification hubs can send push notifications to Windows Store, iOS, Android, and Windows Phone apps.
- **Pub/Sub routing.** Each device, when sending its handle to a notification hub, can specify one or more _tags_. For more information about tags, see the following section. Tags do not have to be pre-provisioned or disposed. Tags provide a simple way to send notifications to users or interest groups. Since tags can contain any app-specific identifier (such as user or group IDs), their use frees the app back-end from the burden of having to store and manage device handles.
- **Scale.** Notification hubs scale to millions of devices without the need to re-architect or shard.

Notification hubs use a full multiplatform, scaled-out push notification infrastructure, and considerably reduce the push-specific code that runs in the app backend. Notification hubs implement all the functionality of a push infrastructure. Devices are only responsible for registering their PNS handles, and the back-end is responsible for sending platform-independent messages to users or interest groups.

![][1]

##Next Steps

You can find out more about Notification Hubs in these topics:

+ **[How customers are using Notification Hubs]**

+ **[Notification Hubs tutorials and guides]** 

+ **Notification Hubs Getting Started tutorials** ([iOS], [Android], [Windows Universal], [Windows Phone], [Kindle], [Xamarin.iOS], [Xamarin.Android])

The relevant .NET managed API references for push notifications are located here:

+ [Microsoft.WindowsAzure.Messaging.NotificationHub]
+ [Microsoft.ServiceBus.Notifications] 


  [0]: ./media/notification-hubs-overview/SBPushNotifications1.gif
  [1]: ./media/notification-hubs-overview/SBPushNotifications2.gif
  [How customers are using Notification Hubs]: http://azure.microsoft.com/services/notification-hubs
  [Notification Hubs tutorials and guides]: http://azure.microsoft.com/documentation/services/notification-hubs
  [iOS]: http://azure.microsoft.com/documentation/articles/notification-hubs-ios-get-started
  [Android]: http://azure.microsoft.com/documentation/articles/notification-hubs-android-get-started
  [Windows Universal]: http://azure.microsoft.com/documentation/articles/notification-hubs-windows-store-dotnet-get-started
  [Windows Phone]: http://azure.microsoft.com/documentation/articles/notification-hubs-windows-phone-get-started
  [Kindle]: http://azure.microsoft.com/documentation/articles/notification-hubs-kindle-get-started
  [Xamarin.iOS]: http://azure.microsoft.com/documentation/articles/partner-xamarin-notification-hubs-ios-get-started
  [Xamarin.Android]: http://azure.microsoft.com/documentation/articles/partner-xamarin-notification-hubs-android-get-started
  [Microsoft.WindowsAzure.Messaging.NotificationHub]: http://msdn.microsoft.com/library/microsoft.windowsazure.messaging.notificationhub.aspx
  [Microsoft.ServiceBus.Notifications]: http://msdn.microsoft.com/library/microsoft.servicebus.notifications.aspx
  