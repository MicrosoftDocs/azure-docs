<properties
	pageTitle="Azure Notification Hubs"
	description="Learn how to use push notifications in Azure. Code samples written in C# using the .NET API."
	authors="wesmc7777"
	manager="erikre"
	editor=""
	services="notification-hubs"
	documentationCenter=""/>

<tags
	ms.service="notification-hubs"
	ms.workload="mobile"
	ms.tgt_pltfrm="multiple"
	ms.devlang="multiple"
	ms.topic="hero-article"
	ms.date="06/29/2016"
	ms.author="wesmc"/>


#Azure Notification Hubs

##Overview

Azure Notification Hubs provide an easy-to-use, multiplatform, scaled-out push infrastructure that enables you to send mobile push notifications from any backend (in the cloud or on-premises) to any mobile platform.

With Notification Hubs you can easily send cross-platform, personalized push notifications, abstracting the details of the different platform notification systems (PNS). With a single API call, you can target individual users or entire audience segments containing millions of users, across all their devices.

You can use Notification Hubs for both enterprise and consumer scenarios. For example:

- Send breaking news notifications to millions with low latency (Notification Hubs powers Bing applications pre-installed on all Windows and Windows Phone devices).
- Send location-based coupons to user segments.
- Send event notifications to users or groups for sports/finance/games applications.
- Notify users of enterprise events like new messages/emails, and sales leads.
- Send one-time-passwords required for multi-factor authentication.



##What are Push Notifications?

Smartphones and tablets have the ability to "notify" users when an event has occurred. These notifications can take many forms.

In Windows Store and Windows Phone applications, the notification can be in the form of a _toast_: a modeless window appears, with a sound, to signal a new notification. Other notification types are supports including _tile_, _raw_, and _badge_ notifications. For more information on the types of notifications supported on Windows devices see, [Tiles, Badges, and Notifications](http://msdn.microsoft.com/library/windows/apps/hh779725.aspx).

On Apple iOS devices, the push similarly notifies the user with a dialog box, requesting the user to view or close the notification. Clicking **View** opens the application that is receiving the message. For more information on iOS Notifications see, [iOS Notifications](http://go.microsoft.com/fwlink/?LinkId=615245).

Push notifications help mobile devices display fresh information while remaining energy-efficient. Notifications can be sent by backend systems to mobile devices even when corresponding apps on a device are not active. Push notifications are a vital component for consumer apps, where they are used to increase app engagement and usage. Notifications are also useful to enterprises, when up-to-date information increases employee responsiveness to business events.

Some specific examples of mobile engagement scenarios are:

1.  Updating a tile on Windows 8 or Windows Phone with current financial information.
2.  Alerting a user with a toast that some work item has been assigned to that user, in a workflow-based enterprise app.
3.  Displaying a badge with the number of current sales leads in a CRM app (such as Microsoft Dynamics CRM).

##How Push Notifications Work

Push notifications are delivered through platform-specific infrastructures called _Platform Notification Systems_ (PNS). A PNS offers barebones functions (that is, no support for broadcast, personalization) and have no common interface. For instance, in order to send a notification to a Windows Store app, a developer must contact the WNS (Windows Notification Service), to send a notification to an iOS device, the same developer has to contact APNS (Apple Push Notification Service), and send the message a second time. Azure Notification hubs help by providing a common interface, along with other features to support push notifications across each platform.

At a high level, though, all platform notification systems follow the same pattern:

1.  The client app contacts the PNS to retrieve its _handle_. The handle type depends on the system. For WNS, it is a URI or "notification channel." For APNS, it is a token.
2.  The client app stores this handle in the app _back-end_ for later usage. For WNS, the back-end is typically a cloud service. For Apple, the system is called a _provider_.
3.  To send a push notification, the app back-end contacts the PNS using the handle to target a specific client app instance.
4.  The PNS forwards the notification to the device specified by the handle.

![][0]

##The Challenges of Push Notifications

While these systems are very powerful, they still leave much work to the app developer in order to implement even common push notification scenarios, such as broadcasting or sending push notifications to segmented users.

Push notifications are one of the most requested features in cloud services for mobile apps. The reason for this is that the infrastructure required to make them work is fairly complex and mostly unrelated to the main business logic of the app. Some of the challenges in building an on-demand push infrastructure are:

- **Platform dependency.** In order to send notifications to devices on different platforms, multiple interfaces must be coded in the back-end. Not only are the low-level details different, but the presentation of the notification (tile, toast, or badge) is also platform-dependent. These differences can lead to complex and hard-to-maintain back-end code.

- **Scale.** Scaling this infrastructure has two aspects:
	+ Per PNS guidelines, device tokens must be refreshed every time the app is launched. This leads to a large amount of traffic (and consequent database accesses) just to keep the device tokens up to date. When the number of devices grows (possibly to millions), the cost of creating and maintaining this infrastructure is nonnegligible.

	+ Most PNSs do not support broadcast to multiple devices. It follows that a broadcast to millions of devices results in millions of calls to the PNSs. Being able to scale these requests is nontrivial, because usually app developers want to keep the total latency down (for example, the last device to receive the message should not receive the notification 30 minutes after the notifications has been sent, as for many cases it would defeat the purpose to have push notifications).
- **Routing.** PNSs provide a way to send a message to a device. However, in most apps notifications are targeted at users and/or interest groups (for example, all employees assigned to a certain customer account). As such, in order to route the notifications to the correct devices, the app back-end must maintain a registry that associates interest groups with device tokens. This overhead adds to the total time to market and maintenance costs of an app.

##Why Use Notification Hubs?

Notification Hubs eliminate complexity: you do not have to manage the challenges of push notifications. Instead, you can use a Notification Hub. Notification Hubs use a full multiplatform, scaled-out push notification infrastructure, and considerably reduce the push-specific code that runs in the app backend. Notification Hubs implement all the functionality of a push infrastructure. Devices are only responsible for registering PNS handles, and the backend is responsible for sending platform-independent messages to users or interest groups, as shown in the following figure:

![][1]


Notification hubs provide a ready-to-use push notification infrastructure with the following advantages:

- **Multiple platforms.**
	+  Support for all major mobile platforms. Notification hubs can send push notifications to Windows Store, iOS, Android, and Windows Phone apps.

	+  Notification hubs provide a common interface to send notifications to all supported platforms. Platform-specific protocols are not required. The app back-end can send notifications in platform-specific, or platform-independent formats. The application only communicates with Notification Hubs.

	+  Device handle management. Notification Hubs maintains the handle registry and feedback from PNSs.

- **Works with any back-end**: Cloud or on-premises, .NET, PHP, Java, Node, etc.

- **Scale.** Notification hubs scale to millions of devices without the need to re-architect or shard.


- **Rich set of delivery patterns**:

	- *Broadcast*: allows for near-simultaneous broadcast to millions of devices with a single API call.

	- *Unicast/Multicast*: Push to tags representing individual users, including all of their devices; or wider group; for example, separate form factors (tablet vs. phone).

	- *Segmentation*: Push to complex segment defined by tag expressions (for example, devices in New York following the Yankees).

	Each device, when sending its handle to a notification hub, can specify one or more _tags_. For more information about [tags]. Tags do not have to be pre-provisioned or disposed. Tags provide a simple way to send notifications to users or interest groups. Since tags can contain any app-specific identifier (such as user or group IDs), their use frees the app back-end from the burden of having to store and manage device handles.

- **Personalization**: Each device can have one or more templates, to achieve per-device localization and personalization without affecting back-end code.

- **Security**: Shared Access Secret (SAS) or federated authentication.

- **Rich telemetry**: Available in the portal and programmatically.


##Integration with App Service Mobile Apps

To facililate a seamless and unifying experience across Azure services, [App Service Mobile Apps] has built-in support for push notifications using Notification Hubs. [App Service Mobile Apps] offers a highly scalable, globally available mobile application development platform for Enterprise Developers and System Integrators that brings a rich set of capabilities to mobile developers.

Mobile Apps developers can utilize Notification Hubs with the following workflow:

1. Retrieve device PNS handle
2. Register device and [templates] with Notification Hubs through convenient Mobile Apps Client SDK register API
    + Note that Mobile Apps strips away all tags on registrations for security purposes. Work with Notification Hubs from your backend directly to associate tags with devices.
3. Send notifications from your app backend with Notification Hubs

Here are some conveniences brought to developers with this integration:
- **Mobile Apps Client SDKs.** These multi-platform SDKs provide simple APIs for registration and talk to the notification hub linked up with the mobile app automatically. Developers do not need to dig through Notification Hubs credentials and work with an additional service.
    + The SDKs automatically tag the given device with Mobile Apps authenticated User ID to enable push to user scenario.
    + The SDKs automatically use the Mobile Apps Installation ID as GUID to register with Notification Hubs, saving developers the trouble of maintaining multiple service GUIDs.
- **Installation model.** Mobile Apps works with Notification Hubs' latest push model to represent all push properties associated with a device in a JSON Installation that aligns with Push Notification Services and is easy to use.
- **Flexibility.** Developers can always choose to work with Notification Hubs directly even with the integration in place.
- **Integrated experience in [Azure Portal].** Push as a capability is represented visually in Mobile Apps and developers can easily work with the associated notification hub through Mobile Apps.



##Next Steps

You can find out more about Notification Hubs in these topics:

+ **[How customers are using Notification Hubs]**

+ **[Notification Hubs tutorials and guides]**

+ **Notification Hubs Getting Started tutorials** ([iOS], [Android], [Windows Universal], [Windows Phone], [Kindle], [Xamarin.iOS], [Xamarin.Android])

The relevant .NET managed API references for push notifications are located here:

+ [Microsoft.WindowsAzure.Messaging.NotificationHub]
+ [Microsoft.ServiceBus.Notifications]


  [0]: ./media/notification-hubs-overview/registration-diagram.png
  [1]: ./media/notification-hubs-overview/notification-hub-diagram.png
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
  [App Service Mobile Apps]: https://azure.microsoft.com/en-us/documentation/articles/app-service-mobile-value-prop/
  [templates]: notification-hubs-templates.md
  [Azure Portal]: https://portal.azure.com
  [tags]: (http://msdn.microsoft.com/library/azure/dn530749.aspx)
