---
title: include file
 description: include file
 services: notification-hubs
 author: sethmanheim
 ms.service: notification-hubs
 ms.topic: include
 ms.date: 01/29/2024
 ms.author: sethm
 ms.custom: include file
---

The core capabilities for the integration of Azure Notification Hubs with Firebase Cloud Messaging (FCM) v1 are ready for testing. As a reminder, Google will stop supporting FCM legacy HTTP on June 20, 2024, so you must migrate your applications and notification payloads to the new format before then. All methods of onboarding will be ready for migration by March 1, 2024.

To help with this transition, we invite you to join our preview program and test the FCM v1 onboarding process for REST APIs in February 2024. The preview gives you early access to the new features and capabilities, as well as the opportunity to provide feedback and report any issues.

If you are interested in joining the preview program, [contact us by email](mailto:NotificationSvcsPM@microsoft.com) by January 25, 2024. We will reply with instructions on how to onboard to FCM v1 using the Azure portal or the REST API. You will also receive a link to our documentation and support channels.

## Concepts for FCM v1

- A new platform type will be supported, called **FCM v1**.
- New APIs, credentials, registrations, and installations will be used for FCM v1.

> [!NOTE]
> The existing FCM platform is referred to as *FCM legacy* in this article.

## Migration steps (preview)

The Firebase Cloud Messaging (FCM) legacy API will be deprecated by July 2024. You can begin migrating from the legacy HTTP protocol to FCM v1 on March 1, 2024. You must complete the migration by June 2024.

> [!IMPORTANT]
> No action is required at this time; you can check back here for further instructions.

If you have any questions or issues, contact our support team.

To migrate from FCM legacy to FCM v1, here's what you can expect:

1. Provide credentials for FCM v1: you must provide your FCM v1 credentials to set up notifications.
1. Update the client app to start registering as FCM v1 devices: once you're ready to start supporting FCMv1 devices, update your client app so that any new devices start registering as **FCM v1** instead of **FCM legacy**. This ensures that notifications are sent to users appropriately once FCM legacy is deprecated.
1. Update the server app to send notifications to FCM v1: once you complete the previous steps, you can start sending notifications using the new API.
1. Stop sending notifications to FCM legacy: once all existing devices are registered as FCM v1 devices, stop sending notifications to FCM legacy. You should send all notifications exclusively to FCM v1 at this point, and you should be fully migrated.  
