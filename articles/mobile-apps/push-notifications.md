---
title: Importance of push notifications in your mobile apps with Visual Studio App Center and Azure Notification Hubs
description: Learn about the services such as App Center that lets you engage with your mobile application users.
author: elamalani
ms.assetid: 12bbb070-9b3c-4faf-8588-ccff02097224
ms.service: vs-appcenter
ms.topic: article
ms.date: 10/22/2019
ms.author: emalani
---

# Engage with your application users by sending push notifications 

Whether you are building consumer or enterprise applications, you want users to use your application actively. There are often times when you want to share breaking news, game updates, exciting offers, product update, or any relevant information with your users. In order to increase engagement with your users and keep getting them back to your application, you need a way for you to communicate with your users in real time.

Push notifications provide a fast and efficient way to communicate with your application users. You can reach out to your users at the right time and can notify them of desired information, usually in a pop-up or dialog box on a mobile device, regardless of what they are doing.

## Value of push notifications
Push notifications provides value to both end users and the business.

Businesses can:
- **Communicate directly with their users** by sending them messages on supported platform at the right time.
- **Boost user engagement** by sending real-time updates and reminders to your users, encouraging them to engage with your application on a regular basis.
- **Retain users** and re-engage with inactive users that have downloaded the application but don't use it to become active again.
- **Increase conversion rates** by analyzing end-user behavior, segmenting end users, and leveraging campaigns based on mobile push notifications.
- **Promote Products and Services** by sending push messages and timely updates to the users.
- **Target the users** by sending them personalized push messages.

For application users, push notifications:
- **Provide value and information** in real time.
- **Remind users** to use the application.

Use the following services to enable push notifications in your mobile apps.

## Visual Studio App Center
[App Center Push](/appcenter/push/) service lets you engage with your users by sending them targeted messages to iOS, Android, and Windows users without having to manage the process of sending notifications to devices using Push Notification Services (PNS). Built on top of Azure Notification Hubs, this service eliminates complexities associated with pushing notifications manually by providing a powerful dashboard.

**Key features**
- **Send push notifications to mobile devices** across variety of platforms.
- Use notifications to send data to an application, display a message to the user, or trigger an action by the application.
- Notification targets: 
    - Send broadcast messages to **all registered devices**.
    - Send notifications to **audiences** built based on device information and custom properties.
    - Send notifications to **specific users**.
    - Send notifications to **specific devices**.
- **Rich telemetry** on push, device, error are available in App Center portal.
- **Platform Support** - iOS, Android, macOS, Xamarin, React Native, Unity, Cordova.

**References**
- [Sign up with App Center](https://appcenter.ms/signup?utm_source=Mobile%20Development%20Docs&utm_medium=Azure&utm_campaign=New%20azure%20docs)
- [Get started with App Center Push](/appcenter/push/)

## Azure Notification Hubs
[Notification Hubs](/azure/notification-hubs/notification-hubs-push-notification-overview) provide an easy-to-use and scaled-out push engine that allows you to send notifications to any platform and from any backend (cloud or on-premises).

**Key features**
- **Send push notifications** to any platform from any back-end, in the cloud or on-premises.
- **Fast broadcast** push to millions of mobile devices with single API call.
- Tailor push notifications by customer, language, and location.
- Dynamically define and notify **customer segments**.
- **Scale instantly** to millions of mobile devices.
- **Platform Support** - iOS, Android, Windows, Kindle, Baidu.
        
**References**
- [Azure portal](https://portal.azure.com) 
- [Get started with Azure Notification Hubs](/azure/notification-hubs/)   
- [Quickstarts](/azure/notification-hubs/create-notification-hub-portal)
- [Samples](/azure/notification-hubs/samples)
