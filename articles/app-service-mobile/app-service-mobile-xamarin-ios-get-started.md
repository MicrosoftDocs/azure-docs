---
title: Get started with Azure App Service Mobile Apps for Xamarin.iOS apps | Microsoft Docs
description: Follow this tutorial to get started with using Mobile Apps for Xamarin.iOS development.
services: app-service\mobile
documentationcenter: xamarin
author: adrianhall
manager: adrianha
editor: ''

ms.assetid: 14428794-52ad-4b51-956c-deb296cafa34
ms.service: app-service-mobile
ms.workload: na
ms.tgt_pltfrm: mobile-xamarin-ios
ms.devlang: dotnet
ms.topic: hero-article
ms.date: 10/01/2016
ms.author: adrianha

---
# Create a Xamarin.iOS app
[!INCLUDE [app-service-mobile-selector-get-started](../../includes/app-service-mobile-selector-get-started.md)]

## Overview
This tutorial shows you how to add a cloud-based backend service to a Xamarin.iOS mobile app by using an Azure mobile app backend.  You
create both a new mobile app backend and a simple *Todo list* Xamarin.iOS app that stores app data in Azure.

Completing this tutorial is a prerequisite for all other Xamarin.iOS tutorials about using the Mobile Apps feature in Azure App Service.

## Prerequisites
To complete this tutorial, you need the following prerequisites:

* An active Azure account. If you don't have an account, sign up for an Azure trial and get up to 10 free mobile apps that you
  can keep using even after your trial ends. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/).
* Visual Studio with Xamarin. See [Setup and install for Visual Studio and Xamarin](https://msdn.microsoft.com/library/mt613162.aspx) for
  instructions.
* A Mac with Xcode v7.0 or later and Xamarin Studio Community installed. See
  [Setup and install for Visual Studio and Xamarin](https://msdn.microsoft.com/library/mt613162.aspx) and
  [Setup, install, and verifications for Mac users](https://msdn.microsoft.com/library/mt488770.aspx) (MSDN).

> [!NOTE]
> If you want to get started with Azure App Service before you sign up for an Azure account, go to
> [Try App Service](https://azure.microsoft.com/try/app-service/mobile/). You can immediately create a short-lived starter
> mobile app in App Service—no credit card required, and no commitments.
> 
> 

## Create an Azure Mobile App backend
Follow these steps to create a Mobile App backend.

[!INCLUDE [app-service-mobile-dotnet-backend-create-new-service](../../includes/app-service-mobile-dotnet-backend-create-new-service.md)]

## Configure the server project
You have now provisioned an Azure Mobile App backend that can be used by your mobile client applications. Next, download a server
project for a simple "todo list" backend and publish it to Azure.

Follow the following steps to configure the server project to use either the Node.js or .NET backend.

[!INCLUDE [app-service-mobile-configure-new-backend](../../includes/app-service-mobile-configure-new-backend.md)]

## Download and run the Xamarin.iOS app
1. Open the [Azure portal] in a browser window.
2. On the settings blade for your Mobile App, click **Get Started** > **Xamarin.iOS**. Under step 3, click **Create a new app** if it's not
   already selected.  Next click the **Download** button.
   
      A client application that connects to your mobile backend is downloaded. Save the compressed project file to
    your local computer, and make a note of where you save it.
3. Extract the project that you downloaded, and then open it in Xamarin Studio (or Visual Studio).
   
    ![][9]
   
    ![][8]
4. Press the F5 key to build the project and start the app in the iPhone emulator.
5. In the app, type meaningful text, such as *Learn Xamarin*, and then click the **+** button.
   
    ![][10]
   
    Data from the request is inserted into the TodoItem table. Items stored in the table are returned by the mobile app backend, and the
    data is displayed in the list.

> [!NOTE]
> You can review the code that accesses your mobile app backend to query and insert data in the QSTodoService.cs C# file.
> 
> 

## Next steps
* [Add Offline Sync to your app](app-service-mobile-xamarin-ios-get-started-offline-data.md)
* [Add authentication to your app ](app-service-mobile-xamarin-ios-get-started-users.md)
* [Add push notifications to your Xamarin.Android app](app-service-mobile-xamarin-ios-get-started-push.md)
* [How to use the managed client for Azure Mobile Apps](app-service-mobile-dotnet-how-to-use-client-library.md)

<!-- Anchors. -->
[Getting started with mobile app backends]:#getting-started
[Create a new mobile app backend]:#create-new-service
[Next Steps]:#next-steps

<!-- Images. -->
[6]: ./media/app-service-mobile-xamarin-ios-get-started/xamarin-ios-quickstart.png
[8]: ./media/app-service-mobile-xamarin-ios-get-started/mobile-xamarin-project-ios-vs.png
[9]: ./media/app-service-mobile-xamarin-ios-get-started/mobile-xamarin-project-ios-xs.png
[10]: ./media/app-service-mobile-xamarin-ios-get-started/mobile-quickstart-startup-ios.png

<!-- URLs. -->
[Azure portal]: https://portal.azure.com/
