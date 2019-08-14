---
title: Get Started with Azure Mobile Apps for Xamarin.Android apps
description: Follow this tutorial to get started using Azure Mobile Apps for Xamarin Android development
services: app-service\mobile
documentationcenter: xamarin
author: elamalani
manager: crdun
editor: ''

ms.assetid: 81649dd3-544f-40ff-b9b7-60c66d683e60
ms.service: app-service-mobile
ms.workload: mobile
ms.tgt_pltfrm: mobile-xamarin-android
ms.devlang: dotnet
ms.topic: conceptual
ms.date: 06/25/2019
ms.author: emalani
---
# Create a Xamarin.Android App
[!INCLUDE [app-service-mobile-selector-get-started](../../includes/app-service-mobile-selector-get-started.md)]

> [!NOTE]
> Visual Studio App Center is investing in new and integrated services central to mobile app development. Developers can use **Build**, **Test** and **Distribute** services to set up Continuous Integration and Delivery pipeline. Once the app is deployed, developers can monitor the status and usage of their app using the **Analytics** and **Diagnostics** services, and engage with users using the **Push** service. Developers can also leverage **Auth** to authenticate their users and **Data** service to persist and sync app data in the cloud. Check out [App Center](https://appcenter.ms/?utm_source=zumo&utm_campaign=app-service-mobile-xamarin-android-get-started) today.
>

## Overview
This tutorial shows you how to add a cloud-based backend service to a Xamarin.Android app. For more information, see
[What are Mobile Apps](app-service-mobile-value-prop.md).

A screenshot from the completed app is below:

![][0]

Completing this tutorial is a prerequisite for all other Mobile Apps tutorials for Xamarin.Android apps.

## Prerequisites
To complete this tutorial, you need the following prerequisites:

* An active Azure account. If you don't have an account, sign up for an Azure trial and get up to 10 free Mobile
  Apps. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/).
* Visual Studio with Xamarin. See [Setup and install for Visual Studio and Xamarin](/visualstudio/cross-platform/setup-and-install) for instructions.

## Create an Azure Mobile App backend
Follow these steps to create a Mobile App backend.

[!INCLUDE [app-service-mobile-dotnet-backend-create-new-service](../../includes/app-service-mobile-dotnet-backend-create-new-service.md)]

You have now provisioned an Azure Mobile App backend that can be used by your mobile client applications. Next, download a server
project for a simple "todo list" backend and publish it to Azure.

## Create a database connection and configure the client and server project
[!INCLUDE [app-service-mobile-configure-new-backend.md](../../includes/app-service-mobile-configure-new-backend.md)]

## Run the Xamarin.Android app
1. Open the Xamarin.Android project.

2. Go to the [Azure portal](https://portal.azure.com/) and navigate to the mobile app that you created. On the `Overview` blade, look for the URL which is the public endpoint for your mobile app. Example - the sitename for my app name "test123" will be https://test123.azurewebsites.net.

3. Open the file `ToDoActivity.cs` in this folder - xamarin.android/ZUMOAPPNAME/ToDoActivity.cs. The application name is `ZUMOAPPNAME`.

4. In `ToDoActivity` class, replace `ZUMOAPPURL` variable with public endpoint above.

    `const string applicationURL = @"ZUMOAPPURL";`

    becomes
    
    `const string applicationURL = @"https://test123.azurewebsites.net";`
    
5. Press the F5 key to deploy and run the app.

6. In the app, type meaningful text, such as *Complete the tutorial* and then click the **Add** button.

    ![][10]

    Data from the request is inserted into the TodoItem table. Items stored in the table are returned by the mobile app backend, and the
    data appears in the list.

   > [!NOTE]
   > You can review the code that accesses your mobile app backend to query and insert data, which is found in the ToDoActivity.cs C# file.
   
## Troubleshooting
If you have problems building the solution, run the NuGet package manager and update the `Xamarin.Android` support packages. Quickstart projects might not always include the latest versions.

Please note that all the support packages referenced in your project must have the same version. The [Azure Mobile Apps NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Mobile.Client/) has `Xamarin.Android.Support.CustomTabs` dependency for Android platform, so if your project uses newer support packages you need to install this package with required version directly to avoid conflicts.

<!-- Images. -->
[0]: ./media/app-service-mobile-xamarin-android-get-started/mobile-quickstart-completed-android.png
[10]: ./media/app-service-mobile-xamarin-android-get-started/mobile-quickstart-startup-android.png
<!-- URLs. -->
[Visual Studio]: https://go.microsoft.com/fwLink/p/?LinkID=534203
