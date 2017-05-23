---
title: Azure Notification Hubs
description: Learn how to add push notification capabilities with Azure Notification Hubs.
author: ysxu
manager: erikre
editor: ''
services: notification-hubs
documentationcenter: ''

ms.assetid: fcfb0ce8-0e19-4fa8-b777-6b9f9cdda178
ms.service: notification-hubs
ms.workload: mobile
ms.tgt_pltfrm: multiple
ms.devlang: multiple
ms.topic: article
ms.date: 1/17/2017
ms.author: yuaxu

---
# Azure Notification Hubs
## Overview
Azure Notification Hubs provide an easy-to-use, multi-platform, scaled-out push engine. With a single cross-platform API call, you can easily send targeted and personalized push notifications to any mobile platform from any cloud or on-premises backend.

Notification Hubs works great for both enterprise and consumer scenarios. Here are a few examples customers use Notification Hubs for:

* Send breaking news notifications to millions with low latency.
* Send location-based coupons to interested user segments.
* Send event-related notifications to users or groups for media/sports/finance/gaming applications.
* Push promotional contents to apps to engage and market to customers.
* Notify users of enterprise events like new messages and work items.
* Send codes for multi-factor authentication.

## What are Push Notifications?
Push notifications is a form of app-to-user communication where users of mobile apps are notified of certain desired information, usually in a pop-up or dialog box. Users can generally choose to view or dismiss the message, and choosing the former will open the mobile app that had communicated the notification.

Push notifications is vital for consumer apps in increasing app engagement and usage, and for enterprise apps in communicating up-to-date business information. It is the best app-to-user communication because it is energy-efficient for  mobile devices, flexible for the notifications senders, and available while corresponding apps are not active.

For more information on push notifications for a few popular platforms:
* [iOS](https://developer.apple.com/notifications/)
* [Android](https://developer.android.com/guide/topics/ui/notifiers/notifications.html)
* [Windows](http://msdn.microsoft.com/library/windows/apps/hh779725.aspx)

## How Push Notifications Work
Push notifications are delivered through platform-specific infrastructures called *Platform Notification Systems* (PNSes). They offer barebone push functionalities to delivery message to a device with a provided handle, and have no common interface. To send a notification to all customers across the iOS, Android, and Windows versions of an app, the developer must work with APNS (Apple Push Notification Service), FCM (Firebase Cloud Messaging), and WNS (Windows Notification Service), while batching the sends.

At a high level, here is how push works:

1. The client app decides it wants to receive pushes hence contacts the corresponding PNS to retrieve its unique and temporary push handle. The handle type depends on the system (e.g. WNS has URIs while APNS has tokens).
2. The client app stores this handle in the app back-end or provider.
3. To send a push notification, the app back-end contacts the PNS using the handle to target a specific client app.
4. The PNS forwards the notification to the device specified by the handle.

![][0]

## The Challenges of Push Notifications
While PNSes are powerful, they leave much work to the app developer in order to implement even common push notification scenarios, such as broadcasting or sending push notifications to segmented users.

Push is one of the most requested features in mobile cloud services, because its working requires complex infrastructures that are unrelated to the app's main business logic. Some of the infrastructural challenges are:

* **Platform dependency**: 

  * The backend needs to have complex and hard-to-maintain platform-dependent logic to send notifications to devices on various platforms as PNSes are not unified.
* **Scale**:

  * Per PNS guidelines, device tokens must be refreshed upon every app launch. This means the backend is dealing with a large amount of traffic and database access just to keep the tokens up-to-date. When the number of devices grows to hundreds and thousands of millions, the cost of creating and maintaining this infrastructure is massive.
  * Most PNSes do not support broadcast to multiple devices. This means a simple broadcast to a million devices results in a million calls to the PNSes. Scaling this amount of traffic with minimal latency is nontrivial.
* **Routing**:
  
  * Though PNSes provide a way to send messages to devices, most apps notifications are targeted at users or interest groups. This means the backend must maintain a registry to associate devices with interest groups, users, properties, etc. This overhead adds to the time to market and maintenance costs of an app.

## Why Use Notification Hubs?
Notification Hubs eliminates all complexities associated with enabling push on your own. Its multi-platform, scaled-out push notification infrastructure reduces push-related codes and simplifies your backend. With Notification Hubs, devices are merely responsible for registering their PNS handles with a hub, while the backend sends messages to users or interest groups, as shown in the following figure:

![][1]

Notification hubs is your ready-to-use push engine with the following advantages:

* **Cross platforms**

  * Support for all major push platforms including iOS, Android, Windows, and Kindle and Baidu.
  * A common interface to push to all platforms in platform-specific or platform-independent formats with no platform-specific work.
  * Device handle management in one place.
* **Cross backends**
  
  * Cloud or on-premises
  * .NET, Node.js, Java, etc.
* **Rich set of delivery patterns**:

  * *Broadcast to one or multiple platforms*: You can instantly broadcast to millions of devices across platforms with a single API call.
  * *Push to device*: You can target notifications to individual devices.
  * *Push to user*: Tags and templates features help you reach all cross-platform devices of a user.
  * *Push to segment with dynamic tags*: Tags feature helps you segment devices and push to them according to your needs, whether you are sending to one segment or an expression of segments (e.g. active AND lives in Seattle NOT new user). Instead of being restricted to pub-sub, you can update device tags anywhere and anytime.
  * *Localized push*: Templates feature helps achieve localization without affecting backend code.
  * *Silent push*: You can enables the push-to-pull pattern by sending silent notifications to devices and triggering them to complete certain pulls or actions.
  * *Scheduled push*: You can schedule to send out notifications anytime.
  * *Direct push*: You can skip registering devices with our service and directly batch push to a list of device handles.
  * *Personalized push*: Device push variables helps you send device-specific personalized push notifications with customized key-value pairs.
* **Rich telemetry**
  
  * General push, device, error, and operation telemetry is available in the Azure portal and programmatically.
  * Per Message Telemetry tracks each push from your initial request call to our service successfully batching the pushes out.
  * Platform Notification System Feedback communicates all feedback from Platfom Notification Systems to assist in debugging.
* **Scalability** 
  
  * Send fast messages to millions of devices without re-architecting or device sharding.
* **Security**

  * Shared Access Secret (SAS) or federated authentication.

## Integration with App Service Mobile Apps
To facilitate a seamless and unifying experience across Azure services, [App Service Mobile Apps] has built-in support for push notifications using Notification Hubs. [App Service Mobile Apps] offers a highly scalable, globally available mobile application development platform for Enterprise Developers and System Integrators that brings a rich set of capabilities to mobile developers.

Mobile Apps developers can utilize Notification Hubs with the following workflow:

1. Retrieve device PNS handle
2. Register device with Notification Hubs through convenient Mobile Apps Client SDK register API
   * Note that Mobile Apps strips away all tags on registrations for security purposes. Work with Notification Hubs from your backend directly to associate tags with devices.
3. Send notifications from your app backend with Notification Hubs

Here are some conveniences brought to developers with this integration:

* **Mobile Apps Client SDKs**: These multi-platform SDKs provide simple APIs for registration and talk to the notification hub linked up with the mobile app automatically. Developers do not need to dig through Notification Hubs credentials and work with an additional service.

  * *Push to user*: The SDKs automatically tag the given device with Mobile Apps authenticated User ID to enable push to user scenario.
  * *Push to device*: The SDKs automatically use the Mobile Apps Installation ID as GUID to register with Notification Hubs, saving developers the trouble of maintaining multiple service GUIDs.
* **Installation model**: Mobile Apps works with Notification Hubs' latest push model to represent all push properties associated with a device in a JSON Installation that aligns with Push Notification Services and is easy to use.
* **Flexibility**: Developers can always choose to work with Notification Hubs directly even with the integration in place.
* **Integrated experience in [Azure portal]**: Push as a capability is represented visually in Mobile Apps and developers can easily work with the associated notification hub through Mobile Apps.

## Next Steps
You can find out more about Notification Hubs in these topics:

* **[How customers are using Notification Hubs]**
* **[Notification Hubs tutorials and guides]**
* **Notification Hubs Getting Started tutorials**: [iOS], [Android], [Windows Universal], [Windows Phone], [Kindle], [Xamarin.iOS], [Xamarin.Android]

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
[templates]: notification-hubs-templates-cross-platform-push-messages.md
[Azure portal]: https://portal.azure.com
[tags]: (http://msdn.microsoft.com/library/azure/dn530749.aspx)
