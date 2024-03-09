---
title: Azure Notification Hubs and the Google Firebase Cloud Messaging (FCM) migration using REST APIs and SDKs
description: Describes how Azure Notification Hubs addresses the Google GCM to FCM migration using either REST APIs or SDKs.
author: sethmanheim
manager: femila
ms.service: notification-hubs
ms.topic: article
ms.date: 03/01/2024
ms.author: sethm
ms.reviewer: heathertian
ms.lastreviewed: 03/01/2024
---

# Azure Notification Hubs and Google Firebase Cloud Messaging migration

The core capabilities for the integration of Azure Notification Hubs with Firebase Cloud Messaging (FCM) v1 are available. As a reminder, Google will stop supporting FCM legacy HTTP on June 20, 2024, so you must migrate your applications and notification payloads to the new format before then.

## Concepts for FCM v1

- A new platform type is supported, called **FCM v1**.
- New APIs, credentials, registrations, and installations are used for FCM v1.

## Migration steps

The Firebase Cloud Messaging (FCM) legacy API will be deprecated by July 2024. You can begin migrating from the legacy HTTP protocol to FCM v1 now. You must complete the migration by June 2024.

- For information about migrating from FCM legacy to FCM v1 using the Azure SDKs, see [Google Firebase Cloud Messaging (FCM) migration using SDKs](firebase-migration-sdk.md).
- For information about migrating from FCM legacy to FCM v1 using the Azure REST APIs, see [Google Firebase Cloud Messaging (FCM) migration using REST APIs](firebase-migration-rest.md).

## Next steps

- [What is Azure Notification Hubs?](notification-hubs-push-notification-overview.md)
