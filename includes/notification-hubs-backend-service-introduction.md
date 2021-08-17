---
 author: mikeparker104
 ms.author: miparker
 ms.date: 06/02/2020
 ms.service: notification-hubs
 ms.topic: include
---

An [ASP.NET Core Web API](https://dotnet.microsoft.com/apps/aspnet/apis) backend is used to handle [device registration](../articles/notification-hubs/notification-hubs-push-notification-registration-management.md#what-is-device-registration) for the client using the latest and best [Installation](../articles/notification-hubs/notification-hubs-push-notification-registration-management.md#installations) approach. The service will also send push notifications in a cross-platform manner. 

These operations are handled using the [Notification Hubs SDK for backend operations](https://www.nuget.org/packages/Microsoft.Azure.NotificationHubs/). Further detail on the overall approach is provided in the [Registering from your app backend](../articles/notification-hubs/notification-hubs-push-notification-registration-management.md#registration-management-from-a-backend) documentation.