---
title: Notification Hubs integration with App Service Mobile Apps
description: Learn how Azure Notification Hubs works with Azure App Service Mobile Apps.
author: sethmanheim
manager: femila
editor: jwargo
services: notification-hubs
documentationcenter: ''

ms.assetid: 83132dff-a01d-4b31-a426-b57496852b81
ms.service: notification-hubs
ms.workload: mobile
ms.tgt_pltfrm: multiple
ms.devlang: multiple
ms.topic: overview
ms.custom: mvc
ms.date: 01/04/2019
ms.author: sethm
ms.reviewer: jowargo
ms.lastreviewed: 01/04/2019
---

# Integration with App Service Mobile Apps

To facilitate a seamless and unifying experience across Azure services, [App Service Mobile Apps](../app-service-mobile/app-service-mobile-value-prop.md) has built-in support for push notifications using Notification Hubs. [App Service Mobile Apps](../app-service-mobile/app-service-mobile-value-prop.md) offers a highly scalable, globally available mobile application development platform for Enterprise Developers and System Integrators that brings a rich set of capabilities to mobile developers.

Mobile Apps developers can utilize Notification Hubs with the following workflow:

1. Retrieve device PNS handle
2. Register device with Notification Hubs through convenient Mobile Apps Client SDK register API

    > [!NOTE]
    > Note that Mobile Apps strips away all tags on registrations for security purposes. Work with Notification Hubs from your backend directly to associate tags with devices.

3. Send notifications from your app backend with Notification Hubs

Here are some conveniences brought to developers with this integration:

- **Mobile Apps Client SDKs**: These multi-platform SDKs provide simple APIs for registration and talk to the notification hub linked up with the mobile app automatically. Developers do not need to dig through Notification Hubs credentials and work with an additional service.
  - *Push to user*: The SDKs automatically tag the given device with Mobile Apps authenticated User ID to enable push to user scenario.
  - *Push to device*: The SDKs automatically use the Mobile Apps Installation ID as GUID to register with Notification Hubs, saving developers the trouble of maintaining multiple service GUIDs.
- **Installation model**: Mobile Apps works with Notification Hubs' latest push model to represent all push properties associated with a device in a JSON Installation that aligns with Push Notification Services and is easy to use.
- **Flexibility**: Developers can always choose to work with Notification Hubs directly even with the integration in place.
- **Integrated experience in [Azure portal](https://portal.azure.com)**: Push as a capability is represented visually in Mobile Apps and developers can easily work with the associated notification hub through Mobile Apps.
