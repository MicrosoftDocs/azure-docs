---
title: Add Push Notifications to iOS App with Azure Mobile Apps
description: Learn how to use Azure Mobile Apps to send push notifications to your iOS app.
services: app-service\mobile
documentationcenter: ios
manager: crdun
editor: ''
author: conceptdev

ms.assetid: fa503833-d23e-4925-8d93-341bb3fbab7d
ms.service: app-service-mobile
ms.workload: mobile
ms.tgt_pltfrm: mobile-ios
ms.devlang: objective-c
ms.topic: article
ms.date: 10/10/2016
ms.author: crdun
---
# Add Push Notifications to your iOS App

[!INCLUDE [app-service-mobile-selector-get-started-push](../../includes/app-service-mobile-selector-get-started-push.md)]

## Overview

In this tutorial, you add push notifications to the [iOS quickstart] project so that a push notification is sent to the device every time a record is inserted.

If you do not use the downloaded quickstart server project, you will need the push notification extension package. For more information, see [Work with the .NET backend server SDK for Azure Mobile Apps](app-service-mobile-dotnet-backend-how-to-use-server-sdk.md) guide.

The [iOS simulator does not support push notifications](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/iOS_Simulator_Guide/TestingontheiOSSimulator.html). You need a physical iOS device and an [Apple Developer Program membership](https://developer.apple.com/programs/ios/).

## <a name="configure-hub"></a>Configure Notification Hub

[!INCLUDE [app-service-mobile-configure-notification-hub](../../includes/app-service-mobile-configure-notification-hub.md)]

## <a id="register"></a>Register app for push notifications

[!INCLUDE [Enable Apple Push Notifications](../../includes/enable-apple-push-notifications.md)]

## Configure Azure to send push notifications

[!INCLUDE [app-service-mobile-apns-configure-push](../../includes/app-service-mobile-apns-configure-push.md)]

## <a id="update-server"></a>Update backend to send push notifications

[!INCLUDE [app-service-mobile-dotnet-backend-configure-push-apns](../../includes/app-service-mobile-dotnet-backend-configure-push-apns.md)]

## <a id="add-push"></a>Add push notifications to app

[!INCLUDE [app-service-mobile-add-push-notifications-to-ios-app.md](../../includes/app-service-mobile-add-push-notifications-to-ios-app.md)]

## <a id="test"></a>Test push notifications

[!INCLUDE [Test Push Notifications in App](../../includes/test-push-notifications-in-app.md)]

## <a id="more"></a>More

* Templates give you flexibility to send cross-platform pushes and localized pushes. [How to Use iOS Client Library for Azure Mobile Apps](app-service-mobile-ios-how-to-use-client-library.md#templates) shows you how to register templates.

<!-- Anchors.  -->

<!-- Images. -->

<!-- URLs. -->
[iOS quickstart]: app-service-mobile-ios-get-started.md
