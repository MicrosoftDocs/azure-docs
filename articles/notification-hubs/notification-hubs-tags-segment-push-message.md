---
title: Routing and tag expressions in Azure Notification Hubs
description: Learn how to route and tag expressions for Azure Notification Hubs.
services: notification-hubs
author: sethmanheim
manager: lizross
editor: jwargo

ms.assetid: 0fffb3bb-8ed8-4e0f-89e8-0de24a47f644
ms.service: azure-notification-hubs
ms.tgt_pltfrm: mobile-multiple
ms.devlang: csharp
ms.topic: article
ms.date: 12/09/2019
ms.author: sethm
ms.reviewer: jowargo
ms.lastreviewed: 12/04/2019
ms.custom: devx-track-csharp
---

# Routing and tag expressions

## Overview

Tag expressions enable you to target specific sets of devices, or more specifically registrations, when sending a push notification through Notification Hubs.

## Targeting specific registrations

The only way to target specific notification registrations is to associate tags with them, then target those tags. As discussed in [Registration Management](notification-hubs-push-notification-registration-management.md), to receive push notifications, an app must register a device handle on a notification hub. Once the app creates a registration on a notification hub, the application backend can send push notifications to it. The application backend can choose the registrations to target with a specific notification in the following ways:

1. **Broadcast**: all registrations in the notification hub receive the notification.
2. **Tag**: all registrations that contain the specified tag receive the notification.
3. **Tag expression**: all registrations whose set of tags match the specified expression receive the notification.

## Tags

A tag can be any string, up to 120 characters, containing alphanumeric and the following non-alphanumeric characters: '`_`', '`@`', '`#`', '`.`', '`:`', '`-`'. The following example shows an application from which you can receive toast notifications about specific music groups. In this scenario, a simple way to route notifications is to label registrations with tags that represent the different bands, as in the following figure:

![Tags overview](./media/notification-hubs-tags-segment-push-message/notification-hubs-tags.png)

In the figure, the message tagged with **Beatles** reaches only the tablet that registered with the tag **Beatles**.

For more information about creating registrations for tags, see [Registration Management](notification-hubs-push-notification-registration-management.md).

You can send notifications to tags using the send notifications methods of the `Microsoft.Azure.NotificationHubs.NotificationHubClient` class in the [Microsoft Azure Notification Hubs](https://www.nuget.org/packages/Microsoft.Azure.NotificationHubs/) SDK. You can also use Node.js, or the Push Notifications REST APIs.  Here's an example using the SDK.

```csharp
Microsoft.Azure.NotificationHubs.NotificationOutcome outcome = null;

// Windows 8.1 / Windows Phone 8.1
var toast = @"<toast><visual><binding template=""ToastText01""><text id=""1"">" +
"You requested a Beatles notification</text></binding></visual></toast>";
outcome = await Notifications.Instance.Hub.SendWindowsNativeNotificationAsync(toast, "Beatles");

// Windows 10
toast = @"<toast><visual><binding template=""ToastGeneric""><text id=""1"">" +
"You requested a Wailers notification</text></binding></visual></toast>";
outcome = await Notifications.Instance.Hub.SendWindowsNativeNotificationAsync(toast, "Wailers");
```

Tags must not be pre-provisioned, and can refer to multiple app-specific concepts. For example, users of this example application can comment on bands and want to receive toasts, not only for the comments on their favorite bands, but also for all comments from their friends, regardless of the band on which they are commenting. The following figure highlights an example of this scenario:

![Tags friends](./media/notification-hubs-tags-segment-push-message/notification-hubs-tags2.png)

In this example, Alice is interested in updates for the Beatles, and Bob is interested in updates for the Wailers. Bob is also interested in Charlie's comments, and Charlie is interested in the Wailers. When a notification is sent for Charlie's comment on the Beatles, Notification Hubs sends it to both Alice and Bob.

While you can encode multiple concerns in tags (for example, `band_Beatles` or `follows_Charlie`), tags are simple strings and not properties with values. A registration matches only on the presence or absence of a specific tag.

For a full step-by-step tutorial on how to use tags for sending to interest groups, see [Breaking News](notification-hubs-windows-notification-dotnet-push-xplat-segmented-wns.md).

> [!NOTE]
> Azure Notification Hubs supports a maximum of 60 tags per registration.

## Using tags to target users

Another way to use tags is to identify all the devices associated with a particular user. You can tag a Registration with a tag that contains the user ID, as in the following figure:

![Tag users](./media/notification-hubs-tags-segment-push-message/notification-hubs-tags3.png)

In the figure, the message tagged `user_Alice` reaches all devices tagged with `user_Alice`.

## Tag expressions

There are cases where notifications must target a set of registrations identified not by a single tag, but by a Boolean expression using tags.

Consider a sports application that sends a reminder to everyone in Boston about a game between the Red Sox and Cardinals. If the client app registers tags about interest in teams and location, then the notification should be targeted to everyone in Boston who is interested in either the Red Sox or the Cardinals. This condition can be expressed with the following Boolean expression:

```csharp
(follows_RedSox || follows_Cardinals) && location_Boston
```

![Tag expressions](./media/notification-hubs-tags-segment-push-message/notification-hubs-tags4.png)

Tag expressions support common Boolean operators such as `AND` (`&&`), `OR` (`||`), and `NOT` (`!`); they can also contain parentheses. Tag expressions using only `OR` operators can reference 20 tags; expression with `AND` operators but no `OR` operators can reference 10 tags; otherwise, tag expressions are limited to 6 tags.

Here's an example for sending notifications with tag expressions using the SDK:

```csharp
Microsoft.Azure.NotificationHubs.NotificationOutcome outcome = null;

String userTag = "(location_Boston && !follows_Cardinals)";

// Windows 8.1 / Windows Phone 8.1
var toast = @"<toast><visual><binding template=""ToastText01""><text id=""1"">" +
"You want info on the Red Sox</text></binding></visual></toast>";
outcome = await Notifications.Instance.Hub.SendWindowsNativeNotificationAsync(toast, userTag);

// Windows 10
toast = @"<toast><visual><binding template=""ToastGeneric""><text id=""1"">" +
"You want info on the Red Sox</text></binding></visual></toast>";
outcome = await Notifications.Instance.Hub.SendWindowsNativeNotificationAsync(toast, userTag);
```
