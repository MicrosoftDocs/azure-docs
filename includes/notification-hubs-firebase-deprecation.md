---
title: include file
 description: include file
 services: notification-hubs
 author: sethmanheim
 ms.service: notification-hubs
 ms.topic: include
 ms.date: 01/16/2024
 ms.author: sethm
 ms.custom: include file
---

> [!NOTE]
> The core capabilities for the integration of Azure Notification Hubs (ANH) with Firebase Cloud Messaging (FCM) v1 are ready for testing. As a reminder, Google will stop supporting FCM Legacy HTTP on June 20, 2024, so you must migrate your applications and notification payloads to the new format before then. All methods of onboarding will be ready for migration by March 1, 2024.
>
> To help with this transition, we invite you to join our preview program and test the FCM v1 onboarding process for REST APIs in February 2024. This gives you early access to the new features and capabilities, as well as the opportunity to provide feedback and report any issues.
>
> If you are interested in joining the preview program, [contact us by email](mailto:nhtalk@microsoft.com) by January 25, 2024. We will reply with instructions on how to onboard to FCM v1 using the Azure portal or the REST API. You will also receive a link to our documentation and support channels.

## Migration steps

Firebase Cloud Messaging (FCM) legacy API will be deprecated by July 2024. You can begin migrating from the legacy HTTP protocol to FCM v1. You can start the migration process by March 1, 2024, and you must complete the migration by June 2024. To migrate from FCM legacy to FCM v1, follow these steps:

1. Migrate credentials to FCM v1: enter your FCM v1 credentials to set up notifications. You can find the [instructions on how to do this here](/azure/notification-hubs/configure-notification-hub-portal-pns-settings?tabs=azure-portal#google-firebase-cloud-messaging-fcm).
1. Update your client app to start registering as FCMv1 devices: once you're ready to start supporting FCMv1 devices, update your client app so that any new devices start registering as FCM v1 instead of the legacy. When existing FCM legacy registrations expire, they are re-registered as FCM v1. This update ensures that notifications are sent to users appropriately, once the FCM legacy is deprecated.
1. Delete the FCM legacy registrations: once the FCM v1 registrations are created, delete the corresponding records from the FCM legacy. This prevents duplicate notifications from being sent to your users if you use both APIs. Duplicate notifications can occur and be sent to users if FCM legacy registrations are not deleted.
1. Update the server app to send notifications to FCM v1: once you complete the previous steps, you can start sending notifications using the new API.
1. Stop sending notifications to FCM legacy: once you remove all FCM legacy devices, stop sending notifications to FCM legacy. All notifications should be sent exclusively to FCM v1 at this point, and you should be fully migrated.

If you have any questions or issues, contact our support team.
