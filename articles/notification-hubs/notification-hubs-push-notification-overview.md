---
title: What is Azure Notification Hubs?
description: Learn how to add push notification capabilities with Azure Notification Hubs.
author: dimazaid
manager: kpiteira
editor: spelluru
services: notification-hubs
documentationcenter: ''

ms.assetid: fcfb0ce8-0e19-4fa8-b777-6b9f9cdda178
ms.service: notification-hubs
ms.workload: mobile
ms.tgt_pltfrm: multiple
ms.devlang: multiple
ms.topic: overview
ms.custom: mvc
ms.date: 04/14/2018
ms.author: dimazaid
#Customer intent: As a developer, I want to develop back-end applications that push notifications to applications running on mobile devices so that mobile application users are notified of certain desired information, usually in a popup or dialog box. 

---
# What is Azure Notification Hubs?
Azure Notification Hubs provide an easy-to-use and scaled-out push engine that allows you to send notifications to any platform (iOS, Android, Windows, Kindle, Baidu, etc.) from any backend (cloud or on-premises). Notification Hubs works great for both enterprise and consumer scenarios. Here are a few example scenarios:

- Send breaking news notifications to millions with low latency.
- Send location-based coupons to interested user segments.
- Send event-related notifications to users or groups for media/sports/finance/gaming applications.
- Push promotional contents to applications to engage and market to customers.
- Notify users of enterprise events like new messages and work items.
- Send codes for multi-factor authentication.

## What are push notifications?
Push notifications is a form of app-to-user communication where users of mobile apps are notified of certain desired information, usually in a pop-up or dialog box. Users can generally choose to view or dismiss the message. Choosing the former opens the mobile application that communicated the notification.

Push notifications are vital for consumer apps in increasing app engagement and usage, and for enterprise apps in communicating up-to-date business information. It's the best app-to-user communication because it is energy-efficient for  mobile devices, flexible for the notifications senders, and available when corresponding applications are not active.

For more information on push notifications for a few popular platforms, see the following topics: 
* [iOS](https://developer.apple.com/notifications/)
* [Android](https://developer.android.com/guide/topics/ui/notifiers/notifications.html)
* [Windows](http://msdn.microsoft.com/library/windows/apps/hh779725.aspx)

## How push notifications work?
Push notifications are delivered through platform-specific infrastructures called *Platform Notification Systems* (PNSes). They offer barebone push functionalities to deliver a message to a device with a provided handle, and have no common interface. To send a notification to all customers across the iOS, Android, and Windows versions of an app, the developer must work with Apple Push Notification Service(APNS), Firebase Cloud Messaging(FCM), and Windows Notification Service(WNS).

At a high level, here is how push works:

1. The client app decides it wants to receive notification. Hence, it contacts the corresponding PNS to retrieve its unique and temporary push handle. The handle type depends on the system (for example, WNS has URIs while APNS has tokens).
2. The client app stores this handle in the app back-end or provider.
3. To send a push notification, the app back-end contacts the PNS using the handle to target a specific client app.
4. The PNS forwards the notification to the device specified by the handle.

![Push notification workflow](./media/notification-hubs-overview/registration-diagram.png)

## The challenges of push notifications
PNSes are powerful. However, they leave much work to the app developer to implement even common push notification scenarios, such as broadcasting push notifications to segmented users.

Pushing notifications requires complex infrastructure that is unrelated to the application's main business logic. Some of the infrastructural challenges are:

- **Platform dependency**
    - The backend needs to have complex and hard-to-maintain platform-dependent logic to send notifications to devices on various platforms as PNSes are not unified.
- **Scale**
    - Per PNS guidelines, device tokens must be refreshed upon every app launch. The backend is dealing with a large amount of traffic and database access just to keep the tokens up-to-date. When the number of devices grows to hundreds and thousands of millions, the cost of creating and maintaining this infrastructure is massive.
    - Most PNSes do not support broadcast to multiple devices. A simple broadcast to a million devices results in a million calls to the PNSes. Scaling this amount of traffic with minimal latency is nontrivial.
- **Routing** 
    - Though PNSes provide a way to send messages to devices, most apps notifications are targeted at users or interest groups. The backend must maintain a registry to associate devices with interest groups, users, properties, etc. This overhead adds to the time to market and maintenance costs of an app.

## Why use Azure Notification Hubs?
Notification Hubs eliminates all complexities associated with pushing notifications on your own from your app back-end. Its multi-platform, scaled-out push notification infrastructure reduces push-related coding and simplifies your backend. With Notification Hubs, devices are merely responsible for registering their PNS handles with a hub, while the backend sends messages to users or interest groups, as shown in the following figure:

![Notification Hub diagram](./media/notification-hubs-overview/notification-hub-diagram.png)

Notification hubs is your ready-to-use push engine with the following advantages:

- **Cross platforms**
    - Support for all major push platforms including iOS, Android, Windows, and Kindle and Baidu.
    - A common interface to push to all platforms in platform-specific or platform-independent formats with no platform-specific work.
    - Device handle management in one place.
- **Cross backends**
    - Cloud or on-premises
    - .NET, Node.js, Java, etc.
- **Rich set of delivery patterns**
    - Broadcast to one or multiple platforms: You can instantly broadcast to millions of devices across platforms with a single API call.
    - Push to device: You can target notifications to individual devices.
    - Push to user: Tags and templates features help you reach all cross-platform devices of a user.
    - Push to segment with dynamic tags: Tags feature helps you segment devices and push to them according to your needs, whether you are sending to one segment or an expression of segments (For example, active AND lives in Seattle NOT new user). Instead of being restricted to pub-sub, you can update device tags anywhere and anytime.
    - Localized push: Templates feature helps achieve localization without affecting backend code.
    - Silent push: You can enable the push-to-pull pattern by sending silent notifications to devices and triggering them to complete certain pulls or actions.
    - Scheduled push: You can schedule to send out notifications anytime.
    - Direct push: You can skip registering devices with the Notification Hubs service and directly batch push to a list of device handles.
    - Personalized push: Device push variables helps you send device-specific personalized push notifications with customized key-value pairs.
- **Rich telemetry**
    - General push, device, error, and operation telemetry are available in the Azure portal and programmatically.
    - Per Message Telemetry tracks each push from your initial request call to the Notification Hubs service successfully batching the pushes out.
    - Platform Notification System Feedback communicates all feedback from Platform Notification Systems to assist in debugging.
- **Scalability** 
    - Send fast messages to millions of devices without rearchitecting or device sharding.
- **Security**
    - Shared Access Secret (SAS) or federated authentication.

## Integration with App Service Mobile Apps
To facilitate a seamless and unifying experience across Azure services, [App Service Mobile Apps](../app-service-mobile/app-service-mobile-value-prop.md) has built-in support for push notifications using Notification Hubs. [App Service Mobile Apps](../app-service-mobile/app-service-mobile-value-prop.md) offers a highly scalable, globally available mobile application development platform for Enterprise Developers and System Integrators that brings a rich set of capabilities to mobile developers.

Mobile Apps developers can utilize Notification Hubs with the following workflow:

1. Retrieve device PNS handle
2. Register device with Notification Hubs through convenient Mobile Apps Client SDK register API

    > [!NOTE]
    > Note that Mobile Apps strips away all tags on registrations for security purposes. Work with Notification Hubs from your backend directly to associate tags with devices.
1. Send notifications from your app backend with Notification Hubs

Here are some conveniences brought to developers with this integration:

- **Mobile Apps Client SDKs**: These multi-platform SDKs provide simple APIs for registration and talk to the notification hub linked up with the mobile app automatically. Developers do not need to dig through Notification Hubs credentials and work with an additional service.
    - *Push to user*: The SDKs automatically tag the given device with Mobile Apps authenticated User ID to enable push to user scenario.
    - *Push to device*: The SDKs automatically use the Mobile Apps Installation ID as GUID to register with Notification Hubs, saving developers the trouble of maintaining multiple service GUIDs.
- **Installation model**: Mobile Apps works with Notification Hubs' latest push model to represent all push properties associated with a device in a JSON Installation that aligns with Push Notification Services and is easy to use.
- **Flexibility**: Developers can always choose to work with Notification Hubs directly even with the integration in place.
- **Integrated experience in [Azure portal](https://portal.azure.com)**: Push as a capability is represented visually in Mobile Apps and developers can easily work with the associated notification hub through Mobile Apps.

## Next steps

Get started with creating and using a notification hub by following the [Tutorial: Push notifications to mobile applications](notification-hubs-android-push-notification-google-fcm-get-started.md). 

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

[App Service Mobile Apps]: https://azure.microsoft.com/documentation/articles/app-service-mobile-value-prop/

[templates]: notification-hubs-templates-cross-platform-push-messages.md

[Azure portal]: https://portal.azure.com

[tags]: (http://msdn.microsoft.com/library/azure/dn530749.aspx)
