---
title: The importance of push notifications in your mobile apps with Visual Studio App Center and Azure Notification Hubs
description: Learn about services such as Visual Studio App Center that you can use to engage with your mobile application users.
author: codemillmatt
ms.assetid: 12bbb070-9b3c-4faf-8588-ccff02097224
ms.service: vs-appcenter
ms.topic: article
ms.date: 03/24/2020
ms.author: masoucou
---

# Engage with your application users by sending push notifications

Whether you're building consumer or enterprise applications, you want users to use your application actively. There are often times when you want to share breaking news, game updates, exciting offers, product updates, or any other relevant information with your users. To increase engagement with your users and get them to return to your application, you need a way to communicate with your users in real time.

Push notifications provide a fast and efficient way to communicate with your application users. You can reach out to your users at the right time and notify them of desired information, usually in a pop-up item or dialog box on a mobile device, regardless of what they're doing.

## Value of push notifications
Push notifications provide value to users and businesses.

Businesses can:
- Communicate directly with users by sending messages on supported platforms at the right time.
- Boost user engagement by sending real-time updates and reminders to users, encouraging them to engage with the application on a regular basis.
- Retain users and reengage with inactive users who downloaded the application but don't use it to become active again.
- Increase conversion rates by analyzing user behavior, segmenting users, and leveraging campaigns based on mobile push notifications.
- Promote products and services by sending push messages and timely updates to users.
- Target users by sending personalized push messages.

For application users, push notifications:
- Provide value and information in real time.
- Remind users to use the application.

Use the following services to enable push notifications in your mobile apps.

## Visual Studio App Center
With [App Center Push](/appcenter/push/), you can send targeted messages to iOS, Android, and Windows users without having to manage the process of sending notifications to devices by using push notification services (PNS). Built on top of Azure Notification Hubs, this service eliminates complexities associated with pushing notifications manually by providing a powerful dashboard.

**Key features**
- Send push notifications to mobile devices across a variety of platforms.
- Use notifications to send data to an application, display a message to the user, or trigger an action by the application.
- Use notification targets to: 
    - Broadcast messages to all registered devices.
    - Send notifications to audiences based on device information and custom properties.
    - Send notifications to specific users.
    - Send notifications to specific devices.
- Make use of the rich telemetry on pushes, devices, and errors that's available in the App Center portal.
- Gain platform support for iOS, Android, macOS, Xamarin, React Native, Unity, and Cordova.

**References**
- [Sign up with Visual Studio App Center](https://appcenter.ms/signup?utm_source=Mobile%20Development%20Docs&utm_medium=Azure&utm_campaign=New%20azure%20docs)
- [Get started with App Center Push](/appcenter/push/)

## Azure Notification Hubs
[Notification Hubs](/azure/notification-hubs/notification-hubs-push-notification-overview) provides an easy-to-use and scaled-out push engine. You can use it to send notifications to any platform and from any back end in the cloud or on-premises.

**Key features**
- Send push notifications to any platform from any back end, in the cloud or on-premises.
- Fast broadcast push to millions of mobile devices with a single API call.
- Tailor push notifications by customer, language, and location.
- Dynamically define and notify customer segments.
- Scale instantly to millions of mobile devices.
- Gain platform support for iOS, Android, Windows, Kindle, and Baidu.
        
**References**
- [Azure portal](https://portal.azure.com) 
- [Get started with Azure Notification Hubs](/azure/notification-hubs/)
- [Quickstarts](/azure/notification-hubs/create-notification-hub-portal)
- [Samples](/azure/notification-hubs/samples)
