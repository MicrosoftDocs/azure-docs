---
title: Add push notifications to your Xamarin.Android app | Microsoft Docs
description: Learn how to use Azure App Service and Azure Notification Hubs to send push notifications to your Xamarin.Android app
services: app-service\mobile
documentationcenter: xamarin
author: elamalani
manager: crdun
editor: ''

ms.assetid: 6f7e8517-e532-4559-9b07-874115f4c65b
ms.service: app-service-mobile
ms.workload: mobile
ms.tgt_pltfrm: mobile-xamarin-android
ms.devlang: dotnet
ms.topic: article
ms.date: 06/25/2019
ms.author: emalani
---
# Add push notifications to your Xamarin.Android app

[!INCLUDE [app-service-mobile-selector-get-started-push](../../includes/app-service-mobile-selector-get-started-push.md)]

> [!NOTE]
> Visual Studio App Center is investing in new and integrated services central to mobile app development. Developers can use **Build**, **Test** and **Distribute** services to set up Continuous Integration and Delivery pipeline. Once the app is deployed, developers can monitor the status and usage of their app using the **Analytics** and **Diagnostics** services, and engage with users using the **Push** service. Developers can also leverage **Auth** to authenticate their users and **Data** service to persist and sync app data in the cloud. Check out [App Center](https://appcenter.ms/?utm_source=zumo&utm_campaign=app-service-mobile-xamarin-android-get-started-push) today.
>

## Overview

In this tutorial, you add push notifications to the [Xamarin.Android quickstart](app-service-mobile-windows-store-dotnet-get-started.md) project so that a push notification is sent to the device every time a record is inserted.

If you do not use the downloaded quickstart server project, you will need the push notification extension package. For more information, see the [Work with the .NET backend server SDK for Azure Mobile Apps](app-service-mobile-dotnet-backend-how-to-use-server-sdk.md) guide.

## Prerequisites

This tutorial requires the  setup:

* An active Google account. You can sign up for a Google account at [accounts.google.com](https://go.microsoft.com/fwlink/p/?LinkId=268302).
* [Google Cloud Messaging Client Component](https://components.xamarin.com/view/GCMClient/).

## <a name="configure-hub"></a>Configure a Notification Hub

[!INCLUDE [app-service-mobile-configure-notification-hub](../../includes/app-service-mobile-configure-notification-hub.md)]

## <a id="register"></a>Enable Firebase Cloud Messaging

[!INCLUDE [notification-hubs-enable-firebase-cloud-messaging](../../includes/notification-hubs-enable-firebase-cloud-messaging.md)]

## Configure Azure to send push requests

[!INCLUDE [app-service-mobile-android-configure-push](../../includes/app-service-mobile-android-configure-push-for-firebase.md)]

## <a id="update-server"></a>Update the server project to send push notifications

[!INCLUDE [app-service-mobile-update-server-project-for-push-template](../../includes/app-service-mobile-update-server-project-for-push-template.md)]

## <a id="configure-app"></a>Configure the client project for push notifications

[!INCLUDE [mobile-services-xamarin-android-push-configure-project](../../includes/mobile-services-xamarin-android-push-configure-project.md)]

## <a id="add-push"></a>Add push notifications code to your app

[!INCLUDE [app-service-mobile-xamarin-android-push-add-to-app](../../includes/app-service-mobile-xamarin-android-push-add-to-app.md)]

## <a name="test"></a>Test push notifications in your app

You can test the app by using a virtual device in the emulator. There are additional configuration steps required when running on an emulator.

1. The virtual device must have Google APIs set as the target in the Android Virtual Device (AVD) manager.

    ![](./media/app-service-mobile-xamarin-android-get-started-push/google-apis-avd-settings.png)

2. Add a Google account to the Android device by clicking **Apps** > **Settings** > **Add account**, then follow the prompts.

    ![](./media/app-service-mobile-xamarin-android-get-started-push/add-google-account.png)

3. Run the todolist app as before and insert a new todo item. This time, a notification icon is displayed in the notification area. You can open the notification drawer to view the full text of the notification.

    ![](./media/app-service-mobile-xamarin-android-get-started-push/android-notifications.png)

<!-- URLs. -->
[Xamarin.Android quick start]: app-service-mobile-xamarin-android-get-started.md
[Google Cloud Messaging Client Component]: https://components.xamarin.com/view/GCMClient/
[Azure Mobile Services Component]: https://components.xamarin.com/view/azure-mobile-services/
