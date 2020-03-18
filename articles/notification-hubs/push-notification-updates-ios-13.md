---
title: Azure Notification Hubs iOS 13 updates | Microsoft Docs
description: Learn about iOS 13 breaking changes in Azure Notification Hubs
author: sethmanheim

ms.author: sethm
ms.date: 10/16/2019
ms.topic: article
ms.service: notification-hubs
ms.reviewer: jowargo
ms.lastreviewed: 10/16/2019

---

# Azure Notification Hubs updates for iOS 13

Apple recently made some changes to their public push service; the changes mostly aligned with the releases of iOS 13 and Xcode. This article describes the impact of these changes on Azure Notification Hubs.

## APNS push payload changes

### APNS push type

Apple now requires that developers identify notifications as an alert or background notifications through the new `apns-push-type` header in the APNS API. According to [Apple's documentation](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/sending_notification_requests_to_apns):
"The value of this header must accurately reflect the contents of your notification's payload. If there is a mismatch, or if the header is missing on required systems, APNs may return an error, delay the delivery of the notification, or drop it altogether."

Developers must now set this header in applications that send notifications through Azure Notification Hubs. Due to a technical limitation, customers must use token-based authentication for APNS credentials with requests that include this attribute. If you are using certificate-based authentication for your APNS credentials, you must switch to using token-based authentication.

The following code samples show how to set this header attribute in notification requests sent through Azure Notification Hubs.

#### Template notifications - .NET SDK

```csharp
var hub = NotificationHubClient.CreateFromConnectionString(...);
var headers = new Dictionary<string, string> {{"apns-push-type", "alert"}};
var tempprop = new Dictionary<string, string> {{"message", "value"}};
var notification = new TemplateNotification(tempprop);
notification.Headers = headers;
await hub.SendNotificationAsync(notification);
```

#### Native notifications - .NET SDK

```csharp
var hub = NotificationHubClient.CreateFromConnectionString(...);
var headers = new Dictionary<string, string> {{"apns-push-type", "alert"}};
var notification = new AppleNotification("notification text", headers);
await hub.SendNotificationAsync(notification);
```

#### Direct REST calls

```csharp
var request = new HttpRequestMessage(method, $"<resourceUri>?api-version=2017-04");
request.Headers.Add("Authorization", createToken(resourceUri, KEY_NAME, KEY_VALUE));
request.Headers.Add("ServiceBusNotification-Format", "apple");
request.Headers.Add("apns-push-type", "alert");
```

To help you during this transition, when Azure Notification Hubs detects a notification that doesn't have the `apns-push-type` set, the service infers the push type from the notification request and sets the value automatically. Remember that you must configure Azure Notification Hubs to use token-based authentication to set the required header; for more information, see [Token-based (HTTP/2) Authentication for APNS](notification-hubs-push-notification-http2-token-authentification.md).

## APNS priority

Another minor change, but one that requires a change to the backend application that sends notifications, is the requirement that for background notifications the `apns-priority` header must now be set to 5. Many applications set the `apns-priority` header to 10 (indicating immediate delivery), or don't set it and get the default value (which is also 10).

Setting this value to 10 is no longer allowed for background notifications, and you must set the value for each request. Apple will not deliver background notifications if this value is missing. For example:

```csharp
var hub = NotificationHubClient.CreateFromConnectionString(...);
var headers = new Dictionary<string, string> {{"apns-push-type", "background"}, { "apns-priority", "5" }};
var notification = new AppleNotification("notification text", headers);
await hub.SendNotificationAsync(notification);
```

## SDK changes

For years, iOS developers used the `description` attribute of the `deviceToken` data sent to the push token delegate to extract the push token that a backend application uses to send notifications to the device. With Xcode 11, that `description` attribute changed to a different format. Existing code that developers used for this attribute is now broken. We have updated the Azure Notification Hubs SDK to accommodate this change, so please update the SDK used by your applications to version 2.0.4 or newer of the [Azure Notification Hubs iOS SDK](https://github.com/Azure/azure-notificationhubs-ios).
