---
title: Create an Android app
description: Follow this tutorial to get started with using Azure mobile app backends for Android app development.

ms.assetid: 355f0959-aa7f-472c-a6c7-9eecea3a34a9
ms.tgt_pltfrm: mobile-android
ms.devlang: java
ms.topic: conceptual
ms.date: 5/6/2019
---
# Create an Android app
[!INCLUDE [app-service-mobile-selector-get-started](../../includes/app-service-mobile-selector-get-started.md)]

> [!NOTE]
> Visual Studio App Center supports end to end and integrated services central to mobile app development. Developers can use **Build**, **Test** and **Distribute** services to set up Continuous Integration and Delivery pipeline. Once the app is deployed, developers can monitor the status and usage of their app using the **Analytics** and **Diagnostics** services, and engage with users using the **Push** service. Developers can also leverage **Auth** to authenticate their users and **Data** service to persist and sync app data in the cloud.
>
> If you are looking to integrate cloud services in your mobile application, sign up with [App Center](https://appcenter.ms/signup?utm_source=zumo&utm_medium=Azure&utm_campaign=zumo%20doc) today.

## Overview
This tutorial shows you how to add a cloud-based backend service to an Android mobile app by using an Azure mobile app backend.  You will create both a new mobile app backend and a simple *Todo list* Android app that stores app data in Azure.

Completing this tutorial is a prerequisite for all other Android tutorials about using the Mobile Apps feature in Azure App Service.

## Prerequisites
To complete this tutorial, you need the following:

* [Android Developer Tools](https://developer.android.com/sdk/index.html), which includes the Android Studio integrated development environment, and the latest Android platform.
* Azure Mobile Android SDK.
* An [active Azure account](https://azure.microsoft.com/pricing/free-trial/).

## Create a new Azure mobile app backend
[!INCLUDE [app-service-mobile-dotnet-backend-create-new-service](../../includes/app-service-mobile-dotnet-backend-create-new-service.md)]

## Create a database connection and configure the client and server project
[!INCLUDE [app-service-mobile-configure-new-backend.md](../../includes/app-service-mobile-configure-new-backend.md)]

## Run the Android app
[!INCLUDE [app-service-mobile-android-run-app](../../includes/app-service-mobile-android-run-app.md)]

<!-- URLs -->
[Azure portal]: https://portal.azure.com/
[Visual Studio Community 2013]: https://go.microsoft.com/fwLink/p/?LinkID=534203
