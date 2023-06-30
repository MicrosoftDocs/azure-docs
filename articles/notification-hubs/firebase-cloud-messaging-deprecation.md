---
title: Firebase Cloud Messaging (FCM) deprecation
description: Details about the deprecation of Firebase Cloud Messaging (FCM).
author: sethmanheim
manager: femila
services: notification-hubs
ms.service: notification-hubs
ms.workload: mobile
ms.tgt_pltfrm: multiple
ms.topic: overview
ms.custom: mvc
ms.date: 06/30/2023
ms.author: sethm
ms.reviewer: heathertian
ms.lastreviewed: 06/30/2023
---

# Firebase Cloud Messaging (FCM) deprecation

Firebase Cloud Messaging (FCM) is a service that, among other things, facilitates developers sending push notifications to Google Play-supported Android devices. Azure Notification Hubs currently communicates with FCM using the legacy HTTP protocol. FCM v1 is an updated API that offers more features and capabilities. Google announced that they are deprecating FCM legacy HTTP and will stop supporting it on June 20, 2024. Therefore, developers who use Azure Notification Hubs to communicate with Google Play-supported Android devices today, will need to migrate their applications and notification payloads to the newer format. Azure Notification Hubs will continue to support FCM legacy HTTP until Google stops accepting requests. Once the new FCM integration is complete, Azure Notification Hubs will announce when you can begin migrating. A migration plan with more details will be available by July 31st, 2023.

## Next steps

[Azure Notification Hubs overview](notification-hubs-push-notification-overview.md)
