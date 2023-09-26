---
title: include file
 description: include file
 services: notification-hubs
 author: sethmanheim
 ms.service: notification-hubs
 ms.topic: include
 ms.date: 06/30/2023
 ms.author: sethm
 ms.custom: include file
---

> [!IMPORTANT]
> Firebase Cloud Messaging (FCM) is a service that, among other things, facilitates developers sending push notifications to Google Play-supported Android devices. Azure Notification Hubs currently communicates with FCM using the legacy HTTP protocol. FCM v1 is an updated API that offers more features and capabilities. Google announced that they are deprecating FCM legacy HTTP and will stop supporting it on June 20, 2024. Therefore, developers who use Azure Notification Hubs to communicate with Google Play-supported Android devices today, will need to migrate their applications and notification payloads to the newer format. Azure Notification Hubs will continue to support FCM legacy HTTP until Google stops accepting requests. Once the new FCM integration is complete, Azure Notification Hubs will announce when you can begin migrating. For more details, see the [migration steps](#migration-steps) in the next section.

## Migration steps

Firebase Cloud Messaging (FCM) legacy API will be deprecated by July 2024. You can begin migrating from the legacy HTTP protocol to FCM v1. You can start the migration process by Feb 1, 2024, and must be migrated by June 2024. To migrate from FCM legacy to FCM v1, follow these steps:

1. Migrate credentials to FCM v1: enter your FCM v1 credentials to set up notifications. You can find the [instructions on how to do this here](/azure/notification-hubs/configure-notification-hub-portal-pns-settings?tabs=azure-portal#google-firebase-cloud-messaging-fcm).
1. Update your client app to start registering as FCMv1 devices: once you’re ready to start supporting FCMv1 devices, update your client app so that any new devices will start registering as FCM v1 instead of the legacy. When existing FCM legacy registrations expire, they are re-registered as FCM v1. This ensures that notifications are sent to users appropriately, once the FCM legacy is deprecated.
1. Delete the FCM legacy registrations: once the FCM v1 registrations have been created, delete the corresponding records from the FCM legacy. This prevents duplicate notifications from being sent to your users if you use both APIs. Duplicate notifications can occur and be sent to users if FCM legacy registrations are not deleted.
1. Update the server app to send notifications to FCM v1: once you have completed the previous steps, you can start sending notifications using the new API.
1. Stop sending notifications to FCM legacy: once you have removed all FCM legacy devices, stop sending notifications to FCM legacy. All notifications should be sent exclusively to FCM v1 at this point, and you should be fully migrated.

If you have any questions or issues, please contact our support team.

