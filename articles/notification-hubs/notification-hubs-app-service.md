---
title: Notification Hubs integration with App Service Mobile Apps
description: Learn how Azure Notification Hubs works with Azure App Service Mobile Apps.
author: sethmanheim
manager: femila
services: notification-hubs

ms.service: notification-hubs
ms.workload: mobile
ms.tgt_pltfrm: multiple
ms.topic: overview
ms.custom: mvc
ms.date: 08/06/2020
ms.author: sethm
ms.reviewer: thsomasu
ms.lastreviewed: 01/04/2019
---

# Integration with App Service Mobile Apps

To facilitate a seamless and unifying experience across Azure services, [App Service Mobile Apps](/previous-versions/azure/app-service-mobile/app-service-mobile-value-prop) has built-in support for notifications using Azure Notification Hubs. [App Service Mobile Apps](/previous-versions/azure/app-service-mobile/app-service-mobile-value-prop) offers a highly scalable, globally available mobile application development platform for enterprise developers and systems integrators that brings a rich set of capabilities to mobile developers.

Mobile Apps developers can use Notification Hubs with the following workflow:

1. Retrieve device PNS handle.
2. Register device with Notification Hubs using Mobile Apps client SDK registration APIs.

    > [!NOTE]
    > Note that Mobile Apps strips away all tags on registrations for security purposes. Work with Notification Hubs from your backend directly to associate tags with devices.

3. Send notifications from your app backend with Notification Hubs.

Some advantages this integration provides are:

- **Mobile Apps Client SDKs**: These multi-platform SDKs provide APIs for registration and communicate with the notification hub that's linked with the mobile app. You do not need Notification Hubs credentials, or work with an additional service.
  - *Push to user*: The SDKs automatically tag the specified device with a Mobile Apps authenticated User ID to enable the "push to user" scenario.
  - *Push to device*: The SDKs automatically use the Mobile Apps Installation ID as a GUID to register with Notification Hubs, so there's no need to maintain multiple service GUIDs.
- **Installation model**: Mobile Apps works with the Notification Hubs latest push model to represent all push properties associated with a device in a JSON installation that aligns with Push Notification Services and is easy to use.
- **Flexibility**: Developers can always choose to work with Notification Hubs directly even with the integration in place.
- **Integrated experience in the [Azure portal](https://portal.azure.com)**: Push as a capability is represented visually in Mobile Apps, and developers can easily work with the associated notification hub through Mobile Apps.
