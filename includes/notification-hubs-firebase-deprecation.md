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
> Firebase Cloud Messaging (FCM) is a service that, among other things, facilitates developers sending push notifications to Google Play-supported Android devices. Azure Notification Hubs currently communicates with FCM using the legacy HTTP protocol. FCM v1 is an updated API that offers more features and capabilities. Google announced that they are deprecating FCM legacy HTTP and will stop supporting it on June 20, 2024. Therefore, developers who use Azure Notification Hubs to communicate with Google Play-supported Android devices today, will need to migrate their applications and notification payloads to the newer format. Azure Notification Hubs will continue to support FCM legacy HTTP until Google stops accepting requests. Once the new FCM integration is complete, Azure Notification Hubs will announce when you can begin migrating. A migration plan with more details will be available by July 31st, 2023.
