---
title: Get started with Azure App Service Mobile Apps for Xamarin.iOS apps | Microsoft Docs
description: Follow this tutorial to get started with using Mobile Apps for Xamarin.iOS development.
services: app-service\mobile
documentationcenter: xamarin
author: elamalani
manager: crdun
editor: ''

ms.assetid: 14428794-52ad-4b51-956c-deb296cafa34
ms.service: app-service-mobile
ms.workload: na
ms.tgt_pltfrm: mobile-xamarin-ios
ms.devlang: dotnet
ms.topic: conceptual
ms.date: 06/25/2019
ms.author: emalani
---
# Create a Xamarin.iOS app
[!INCLUDE [app-service-mobile-selector-get-started](../../includes/app-service-mobile-selector-get-started.md)]

> [!NOTE]
> Visual Studio App Center is investing in new and integrated services central to mobile app development. Developers can use **Build**, **Test** and **Distribute** services to set up Continuous Integration and Delivery pipeline. Once the app is deployed, developers can monitor the status and usage of their app using the **Analytics** and **Diagnostics** services, and engage with users using the **Push** service. Developers can also leverage **Auth** to authenticate their users and **Data** service to persist and sync app data in the cloud. Check out [App Center](https://appcenter.ms/?utm_source=zumo&utm_campaign=app-service-mobile-xamarin-ios-get-started) today.
>

## Overview
This tutorial shows you how to add a cloud-based backend service to a Xamarin.iOS mobile app by using an Azure mobile app backend.  You
create both a new mobile app backend and a simple *Todo list* Xamarin.iOS app that stores app data in Azure.

Completing this tutorial is a prerequisite for all other Xamarin.iOS tutorials about using the Mobile Apps feature in Azure App Service.

## Prerequisites
To complete this tutorial, you need the following prerequisites:

* An active Azure account. If you don't have an account, sign up for an Azure trial and get up to 10 free mobile apps that you
  can keep using even after your trial ends. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/).
* Visual Studio for Mac. See [Setup and install for Visual Studio for Mac](https://docs.microsoft.com/visualstudio/mac/installation?view=vsmac-2019)
* A Mac with Xcode 9.0 or later.
  
## Create an Azure Mobile App backend
[!INCLUDE [app-service-mobile-dotnet-backend-create-new-service](../../includes/app-service-mobile-dotnet-backend-create-new-service.md)]

## Create a database connection and configure the client and server project
[!INCLUDE [app-service-mobile-configure-new-backend](../../includes/app-service-mobile-configure-new-backend.md)]

## Run the Xamarin.iOS app
1. Open the Xamarin.iOS project.

2. Go to the [Azure portal](https://portal.azure.com/) and navigate to the mobile app that you created. On the `Overview` blade, look for the URL which is the public endpoint for your mobile app. Example - the sitename for my app name "test123" will be https://test123.azurewebsites.net.

3. Open the file `QSTodoService.cs` in this folder - xamarin.iOS/ZUMOAPPNAME. The application name is `ZUMOAPPNAME`.

4. In `QSTodoService` class, replace `ZUMOAPPURL` variable with public endpoint above.

    `const string applicationURL = @"ZUMOAPPURL";`

    becomes
    
    `const string applicationURL = @"https://test123.azurewebsites.net";`
    
5. Press the F5 key to deploy and run the app in an iPhone emulator.

6. In the app, type meaningful text, such as *Complete the tutorial* and then click the + button.

    ![][10]

    Data from the request is inserted into the TodoItem table. Items stored in the table are returned by the mobile app backend, and the
    data appears in the list.

   > [!NOTE]
   > You can review the code that accesses your mobile app backend to query and insert data, which is found in the ToDoActivity.cs C# file.
   
<!-- Images. -->
[10]: ./media/app-service-mobile-xamarin-ios-get-started/mobile-quickstart-startup-ios.png