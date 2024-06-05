---
title: Azure Notification Hubs and the Google Firebase Cloud Messaging (FCM) migration using REST APIs and SDKs
description: Describes how Azure Notification Hubs addresses the Google GCM to FCM migration using either REST APIs or SDKs.
author: sethmanheim
manager: femila
ms.service: notification-hubs
ms.topic: article
ms.date: 05/08/2024
ms.author: sethm
ms.reviewer: heathertian
ms.lastreviewed: 03/01/2024
---

# Azure Notification Hubs and Google Firebase Cloud Messaging migration

The core capabilities for the integration of Azure Notification Hubs with Firebase Cloud Messaging (FCM) v1 are available. As a reminder, Google will stop supporting FCM legacy HTTP on June 20, 2024, so you must migrate your applications and notification payloads to the new format before then.

> [!IMPORTANT]
> As of June 2024, FCM legacy APIs will no longer be supported and will be retired. To avoid any disruption in your push notification service, you must [migrate to the FCM v1 protocol](#migration-steps) as soon as possible.

## Concepts for FCM v1

- A new platform type is supported, called **FCM v1**.
- New APIs, credentials, registrations, and installations are used for FCM v1.

## Migration steps

The Firebase Cloud Messaging (FCM) legacy API will be deprecated by July 2024. You can begin migrating from the legacy HTTP protocol to FCM v1 now. You must complete the migration by June 2024.

- For information about migrating from FCM legacy to FCM v1 using the Azure SDKs, see [Google Firebase Cloud Messaging (FCM) migration using SDKs](firebase-migration-sdk.md).
- For information about migrating from FCM legacy to FCM v1 using the Azure REST APIs, see [Google Firebase Cloud Messaging (FCM) migration using REST APIs](firebase-migration-rest.md).
- For the latest information about FCM migration, see the [Firebase Cloud Messaging migration guide](https://firebase.google.com/docs/cloud-messaging/migrate-v1).

## FAQ

This section provides answers to frequently asked questions about the migration from FCM legacy to FCM v1.

### How do I create FCM v1 template registrations with SDKs or REST APIs? 

For instructions on how to create FCM v1 template registrations, see [Azure Notification Hubs and the Google Firebase Cloud Messaging (FCM) migration using SDKs](firebase-migration-sdk.md#android-sdk).

### Do I need to store both FCM legacy and FCM v1 credentials?

Yes, FCM legacy and FCM v1 are treated as two separate platforms in Azure Notification Hubs, so you must store both FCM legacy and FCM v1 credentials separately. For more information, see [the instructions to set up credentials](firebase-migration-rest.md#create-google-service-account-json-file).

### How can I verify that send operations are going through the FCM v1 pipeline rather than the FCM legacy pipeline?

The debug send response contains a `results` property, which is an [array of registration results](/rest/api/notificationhubs/notification-hubs/debug-send?tabs=HTTP#registrationresult) for the debug send. Each registration result specifies the application platform. Additionally, we offer [per-message telemetry](/rest/api/notificationhubs/get-notification-message-telemetry) for standard tier notification hubs. This telemetry features `GcmOutcomeCounts` and `FcmV1OutcomeCounts`, which can help you verify which platform is used for send operations.

### Do I need to create new registrations for FCM v1?

Yes, but you can use import/export. Once you update the client SDK, it creates device tokens for FCM v1 registrations.

### Google Firebase documentation says that no client-side changes are required. Do I need to make any changes in Notification Hubs to ensure my notifications are sent through FCM v1?

For direct send operations, there are no Notification Hubs-specific changes that need to be made on the client device. If you store installations or registrations with Azure Notification Hubs, you must let Notification Hubs know that you want to listen to the migrated platform (FCM v1). Regardless of whether you use Notification Hubs or Firebase directly, payload changes are required. See the [documentation on how to migrate to FCM v1](notification-hubs-gcm-to-fcm.md).

### My PNS feedback shows "unknown error" when sending an FCM v1 message. What should I do to fix this error?

Azure Notification Hubs is working on a solution that reduces the number of times "unknown error" is shown. In the meantime, standard tier customers can use the [notification feedback API](/rest/api/notificationhubs/get-pns-feedback) to examine the responses.

### How can Xamarin customers migrate to FCM v1?

Xamarin is now deprecated. Xamarin customers should migrate to MAUI, but MAUI is not currently supported by Azure Notification Hubs. You can, however, use the available SDKs and REST APIs with your MAUI applications. It's recommended that Xamarin customers move away from Notification Hubs if they need FCM v1 sends.

## Next steps

- [What is Azure Notification Hubs?](notification-hubs-push-notification-overview.md)
