---
title: Send push notifications to Flutter apps using Azure Notification Hubs via a backend service | Microsoft Docs
description: Learn how to push notifications to Flutter apps that use Azure Notification Hubs via a backend service. 
author: mikeparker104

ms.service: notification-hubs
ms.topic: tutorial
ms.date: 07/07/2020
ms.author: miparker
---

# Tutorial: Send push notifications to Flutter apps using Azure Notification Hubs via a backend service  

[![Download Sample](./media/notification-hubs-backend-service-flutter/download.png) Download the sample](https://github.com/xamcat/mobcat-samples/tree/master/notification_hub_backend_service)  

> [!div class="op_single_selector"]
>
> * [Xamarin.Forms](notification-hubs-backend-service-xamarin-forms.md)
> * [Flutter](notification-hubs-backend-service-flutter.md)
> * [React Native](notification-hubs-backend-service-react-native.md)

In this tutorial, you use [Azure Notification Hubs](https://docs.microsoft.com/azure/notification-hubs/notification-hubs-push-notification-overview) to push notifications to a [Flutter](https://flutter.dev) application targeting **Android** and **iOS**.  

[!INCLUDE [Notification Hubs Backend Service Introduction](../../includes/notification-hubs-backend-service-introduction.md)]

This tutorial takes you through the following steps:

> [!div class="checklist"]
>
> * [Set up Push Notification Services and Azure Notification Hubs.](#set-up-push-notification-services-and-azure-notification-hub)
> * [Create an ASP.NET Core Web API backend application.](#create-an-aspnet-core-web-api-backend-application)
> * [Create a cross-platform Flutter application.](#create-a-cross-platform-flutter-application)
> * [Configure the native Android project for push notifications.](#configure-the-native-android-project-for-push-notifications)
> * [Configure the native iOS project for push notifications.](#configure-the-native-ios-project-for-push-notifications)
> * [Test the solution.](#test-the-solution)

## Prerequisites

To follow along, you require:

* An [Azure subscription](https://portal.azure.com) where you can create and manage resources.
* The [Flutter](https://flutter.dev/docs/get-started/install) toolkit (along with its prerequisites).
* [Visual Studio Code](https://code.visualstudio.com) with the [Flutter and Dart plugins](https://flutter.dev/docs/get-started/editor?tab=vscode) installed.
* The ability to run the app on either **Android** (physical or emulator devices) or **iOS** (physical devices only).

For Android, you must have:

* A developer unlocked physical device or an emulator *(running API 26 and above with Google Play Services installed)*.

For iOS, you must have:

* An active [Apple Developer Account](https://developer.apple.com).
* A physical iOS device that is [registered to your developer account](https://help.apple.com/developer-account/#/dev40df0d9fa) *(running iOS 13.0 and above)*.
* A **.p12** [development certificate](https://help.apple.com/developer-account/#/dev04fd06d56) installed in your **keychain** allowing you to [run an app on a physical device](https://help.apple.com/xcode/mac/current/#/dev5a825a1ca).
* [CocoaPods](https://guides.cocoapods.org/using/getting-started.html#installation) installed for managing library dependencies.

> [!NOTE]
> The iOS Simulator does not support remote notifications and so a physical device is required when exploring this sample on iOS. However, you do not need to run the app on both **Android** and **iOS** in order to complete this tutorial.

You can follow the steps in this first-principles example with no prior experience. However, you'll benefit from having familiarity with the following aspects.

* [Apple Developer Portal](https://developer.apple.com)
* [ASP.NET Core](https://docs.microsoft.com/aspnet/core/introduction-to-aspnet-core?view=aspnetcore-3.1)
* [Azure Notification Hubs](notification-hubs-push-notification-overview.md)
* [Google Firebase Console](https://console.firebase.google.com/u/0/)
* [Flutter](https://flutter.dev) and [Dart](https://dart.dev) for cross-platform development
* [Kotlin](https://kotlinlang.org) and [Swift](https://developer.apple.com/swift) for Android and iOS native development

The steps provided are specific to [macOS](https://developer.apple.com/macos). It's possible to follow along on [Windows](https://www.microsoft.com/windows) by skipping the **iOS** aspects.

## Set up Push Notification Services and Azure Notification Hub

In this section, you set up **[Firebase Cloud Messaging (FCM)](https://firebase.google.com/docs/cloud-messaging)** and **[Apple Push Notification Services (APNS)](https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/APNSOverview.html)**. You then create and configure a notification hub to work with those services.

[!INCLUDE [Create a Firebase project and enable Firebase Cloud Messaging](../../includes/notification-hubs-common-enable-firebase-cloud-messaging.md)]

[!INCLUDE [Enable Apple Push Notifications](../../includes/notification-hubs-common-enable-apple-push-notifications.md)]

[!INCLUDE [Create a notification hub](../../includes/notification-hubs-common-create-notification-hub.md)]

[!INCLUDE [Configure your notification hub with APNs information](../../includes/notification-hubs-common-configure-with-apns-information.md)]

[!INCLUDE [Configure your notification hub with FCM information](../../includes/notification-hubs-common-configure-with-fcm-information.md)]

## Create an ASP.NET Core Web API backend application

In this section, you create the [ASP.NET Core Web API](https://dotnet.microsoft.com/apps/aspnet/apis) backend to handle [device registration](https://docs.microsoft.com/azure/notification-hubs/notification-hubs-push-notification-registration-management#what-is-device-registration) and the sending of notifications to the Flutter mobile app.

[!INCLUDE [Create an ASP.NET Core Web API backend application](../../includes/notification-hubs-backend-service-web-api.md)]

## Create a cross-platform Flutter application

In this section, you build a [Flutter](https://flutter.dev) mobile application implementing push notifications in a cross-platform manner.

[!INCLUDE [Sample application generic overview](../../includes/notification-hubs-backend-service-sample-app-overview.md)]

[!INCLUDE [Create Flutter application](../../includes/notification-hubs-backend-service-sample-app-flutter.md)]

## Configure the native Android project for push notifications

[!INCLUDE [Configure the native Android project](../../includes/notification-hubs-backend-service-configure-flutter-android.md)]

## Configure the native iOS project for push notifications

[!INCLUDE [Configure the native iOS project](../../includes/notification-hubs-backend-service-configure-flutter-ios.md)]

## Test the solution

You can now test sending notifications via the backend service.

[!INCLUDE [Testing the solution](../../includes/notification-hubs-backend-service-testing.md)]

## Next steps

You should now have a basic Flutter app connected to a notification hub via a backend service and can send and receive notifications.

[!INCLUDE [Next steps](../../includes/notification-hubs-backend-service-next-steps.md)]

## Troubleshooting

[!INCLUDE [Troubleshooting](../../includes/notification-hubs-backend-service-troubleshooting.md)]

## Related links

* [Azure Notification Hubs overview](notification-hubs-push-notification-overview.md)
* [Installing Flutter on macOS](https://flutter.dev/docs/get-started/install/macos)
* [Installing Flutter on Windows](https://flutter.dev/docs/get-started/install/windows)
* [Notification Hubs SDK for back-end operations](https://www.nuget.org/packages/Microsoft.Azure.NotificationHubs/)
* [Notification Hubs SDK on GitHub](https://github.com/Azure/azure-notificationhubs)
* [Register with application backend](notification-hubs-ios-aspnet-register-user-from-backend-to-push-notification.md)
* [Registration management](notification-hubs-push-notification-registration-management.md)
* [Working with tags](notification-hubs-tags-segment-push-message.md)
* [Working with custom templates](notification-hubs-templates-cross-platform-push-messages.md)
