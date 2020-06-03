---
title: Send push notifications to Xamarin.Forms apps using Azure Notification Hubs via a backend service | Microsoft Docs
description: Learn how to push notifications to Xamarin.Forms apps that use Azure Notification Hubs via a backend service. 
author: mikeparker104

ms.service: notification-hubs
ms.topic: tutorial
ms.date: 06/02/2020
ms.author: miparker
---

# Tutorial: Send push notifications to Xamarin.Forms apps using Azure Notification Hubs via a backend service  

> [!div class="op_single_selector"]
>
> * [Xamarin.Forms](notification-hubs-backend-service-xamarin-forms.md)

In this tutorial, you use [Azure Notification Hubs](https://docs.microsoft.com/azure/notification-hubs/notification-hubs-push-notification-overview) to push notifications to a [Xamarin.Forms](https://dotnet.microsoft.com/apps/xamarin/xamarin-forms) application targeting **Android** and **iOS**.  

[!INCLUDE [Notification Hubs Backend Service Introduction](../../includes/notification-hubs-backend-service-introduction.md)]

This tutorial takes you through the following steps:

> [!div class="checklist"]
>
> * [Set up Push Notification Services and Azure Notification Hubs.](#set-up-push-notification-services-and-azure-notification-hub)
> * [Create an ASP.NET Web API backend application.](#create-an-asp.net-web-api-backend-application)
> * [Create a cross-platform Xamarin.Forms application.](#create-a-cross-platform-xamarin.forms-application)
> * [Configure the native Android project for push notifications.](#configure-the-native-android-project-for-push-notifications)
> * [Configure the native iOS project for push notifications.](#configure-the-native-ios-project-for-push-notifications)
> * [Test the solution.](#test-the-solution)

## Prerequisites

To follow along you will need:

* An [Azure subscription](https://portal.azure.com) where you can create and manage resources.
* A Mac with [Visual Studio for Mac](https://visualstudio.microsoft.com/vs/mac/) installed (or a PC running [Visual Studio 2019](https://visualstudio.microsoft.com/vs) with the **Mobile Development with .NET** workload).
* The ability to run the app on either **Android** (physical or emulator devices) or **iOS** (physical devices only).

For Android, you must have:

* A developer unlocked physical device or an emulator *(running API 26 and above with Google Play Services installed)*.

For iOS, you must have:

* An active [Apple Developer Account](https://developer.apple.com).
* A physical iOS device that is [registered to your developer account](https://help.apple.com/developer-account/#/dev40df0d9fa) *(running iOS 13.0 and above)*.
* A **.p12** [development certificate](https://help.apple.com/developer-account/#/dev04fd06d56) installed in your **keychain** allowing you to [run an app on a physical device](#https://help.apple.com/xcode/mac/current/#/dev5a825a1ca).

> [!NOTE]
> The iOS Simulator does not support remote notifications and so a physical device is required when exploring this sample on iOS. However, you do not need to run the app on both **Android** and **iOS** in order to complete this tutorial.

Even if you have no prior experience with [building mobile apps with Xamarin.Forms](https://docs.microsoft.com/learn/paths/build-mobile-apps-with-xamarin-forms/) and [creating a Web API with ASP.NET Core](https://docs.microsoft.com/aspnet/core/tutorials/first-web-api?view=aspnetcore-3.1&tabs=visual-studio), you should be able to follow along the steps for creating this first-principles example. However, you'll benefit from familiarity with the following:

* [Apple Developer Portal](https://developer.apple.com)
* [ASP.NET Core](https://docs.microsoft.com/aspnet/core/introduction-to-aspnet-core?view=aspnetcore-3.1)
* [Google Firebase Console](https://console.firebase.google.com/u/0/)
* [Microsoft Azure](https://portal.azure.com) and [Azure Notification Hubs](notification-hubs-ios-apple-push-notification-apns-get-started.md).
* [Xamarin](https://dotnet.microsoft.com/apps/xamarin) and [Xamarin.Forms](https://dotnet.microsoft.com/apps/xamarin/xamarin-forms).

The steps provided are for [Visual Studio for Mac](https://visualstudio.microsoft.com/vs/mac/) but it is also possible to follow along using [Visual Studio 2019](https://visualstudio.microsoft.com/vs).

## Set up Push Notification Services and Azure Notification Hub

Integrating Azure Notification Hubs with a Xamarin.Forms mobile app is similar to integrating Azure Notification Hubs with a Xamarin native application. You must first set up the underlying platform-specific messaging services, **[Firebase Cloud Messaging (FCM)](https://firebase.google.com/docs/cloud-messaging)** for Android and **[Apple Push Notification Services (APNS)](https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/APNSOverview.html)** for iOS, before configuring Notification Hubs to work with them.

[!INCLUDE [Create a Firebase project and enable Firebase Cloud Messaging](../../includes/notification-hubs-common-enable-firebase-cloud-messaging.md)]

[!INCLUDE [Enable Apple Push Notifications](../../includes/notification-hubs-common-enable-apple-push-notifications.md)]

[!INCLUDE [Create a notification hub](../../includes/notification-hubs-common-create-a-notification-hub.md)]

[!INCLUDE [Configure your notification hub with APNs information](../../includes/notification-hubs-common-configure-with-apns-information.md)]

[!INCLUDE [Configure your notification hub with FCM information](../../includes/notification-hubs-common-configure-with-fcm-information.md)]

## Create an ASP.NET Core Web API backend application

In this section you will create the [ASP.NET Core Web API](https://dotnet.microsoft.com/apps/aspnet/apis) backend to handle [device registration](https://docs.microsoft.com/azure/notification-hubs/notification-hubs-push-notification-registration-management#what-is-device-registration) and the sending of notifications to the Xamarin.Forms mobile app.

[!INCLUDE [Create an ASP.NET Core Web API backend application](../../notification-hubs-backend-service-web-api.md)]

## Create a cross-platform Xamarin.Forms application

You will build a [Xamarin.Forms](https://dotnet.microsoft.com/apps/xamarin/xamarin-forms) mobile application in this section.

[!INCLUDE [Sample application generic overview](../../includes/notification-hubs-backend-service-sample-app-overview.md)]

[!INCLUDE [Create Xamarin.Forms application](../../includes/notification-hubs-backend-service-sample-app-xamarin-forms.md)]

## Configure the native Android project for push notifications

[!INCLUDE [Configure the native Android project](../../includes/notification-hubs-backend-service-configure-xamarin-android.md)]

## Configure the native iOS project for push notifications

[!INCLUDE [Configure the native Android project](../../includes/notification-hubs-backend-service-configure-xamarin-ios.md)]

## Test the solution

You can now test sending notifications via the backend service.

[!INCLUDE [Testing the solution](../../includes/notification-hubs-backend-service-testing.md)]

## Next Steps

You should now have a basic Xamarin.Forms app connected to a notification hub via a backend service and can send and receive notifications.

[!INCLUDE [Testing the solution](../../includes/notification-hubs-backend-service-next-steps.md)]

## Troubleshooting

[!INCLUDE [Troubleshooting](../includes/notification-hubs-backend-service-troubleshooting.md)]

## Related Links

* [Azure Notification Hubs overview](notification-hubs-push-notification-overview.md)
* [Installing Visual Studio for Mac](https://docs.microsoft.com/visualstudio/mac/installation?view=vsmac-2019)
* [Installing Xamarin on Windows](https://docs.microsoft.com/xamarin/get-started/installation/windows)
* [Notification Hubs SDK for back-end operations](https://www.nuget.org/packages/Microsoft.Azure.NotificationHubs/)
* [Notification Hubs SDK on GitHub](https://github.com/Azure/azure-notificationhubs)
* [Register with application back end](notification-hubs-ios-aspnet-register-user-from-backend-to-push-notification.md)
* [Registration management](notification-hubs-push-notification-registration-management.md)
* [Working with tags](notification-hubs-tags-segment-push-message.md)
* [Working with custom templates](notification-hubs-templates-cross-platform-push-messages.md)
