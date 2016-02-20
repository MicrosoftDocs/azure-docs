<properties
	pageTitle="Get started with Azure App Service Mobile Apps for Xamarin.iOS apps | Microsoft Azure"
	description="Follow this tutorial to get started with using Mobile Apps for Xamarin.iOS development."
	services="app-service\mobile"
	documentationCenter="xamarin"
	authors="wesmc7777"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="na"
	ms.tgt_pltfrm="mobile-xamarin-ios"
	ms.devlang="dotnet"
	ms.topic="hero-article"
	ms.date="02/13/2016"
	ms.author="normesta"/>


#Create a Xamarin.iOS app

[AZURE.INCLUDE [app-service-mobile-selector-get-started](../../includes/app-service-mobile-selector-get-started.md)]

##Overview

This tutorial shows you how to add a cloud-based backend service to a Xamarin.iOS mobile app by using an Azure mobile app backend.  You will create both a new mobile app backend and a simple _Todo list_ Xamarin.iOS app that stores app data in Azure.

Completing this tutorial is a prerequisite for all other Xamarin.iOS tutorials about using the Mobile Apps feature in Azure App Service.

##Prerequisites

To complete this tutorial, you need the following:

* An active Azure account. If you don't have an account, you can sign up for an Azure trial and get up to 10 free mobile apps that you can keep using even after your trial ends. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/).

* [Visual Studio Community 2013](https://www.visualstudio.com/products/visual-studio-community-vs.aspx) or later.  If you install Visual Studio Community 2013, install [Xamarin] separately.  You can install the Xamarin tools when you install Visual Studio 2015.

* A Mac with [Xcode] v7.0 or later and [Xamarin Studio] installed.

* If you plan to build your app on a Windows-based computer running Visual Studio, you will still need access to a networked Mac running the Xamarin.iOS Build Host to actually build and deploy. For more information see, [Installing Xamarin.iOS on Windows](http://developer.xamarin.com/guides/ios/getting_started/installation/windows/)

>[AZURE.NOTE] If you want to get started with Azure App Service before you sign up for an Azure account, go to [Try App Service](https://tryappservice.azure.com/?appServiceName=mobile). There, you can immediately create a short-lived starter mobile app in App Service—no credit card required, and no commitments.

## Create a new Azure Mobile App backend

Follow these steps to create a new Mobile App backend.

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-create-new-service](../../includes/app-service-mobile-dotnet-backend-create-new-service.md)]

## Configure the server project

You have now provisioned an Azure Mobile App backend that can be used by your mobile client applications. Next, you will download a server project for a simple "todo list" backend and publish it to Azure.

Follow the steps below to configure the server project to use either the Node.js or .NET backend.

[AZURE.INCLUDE [app-service-mobile-configure-new-backend](../../includes/app-service-mobile-configure-new-backend.md)]


## (Optional) Test your backend project locally

If you chose a .NET backend configuration above, you can optionally test the backend locally.

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-test-local-service](../../includes/app-service-mobile-dotnet-backend-test-local-service.md)]



## Download and run the Xamarin.iOS app

1. On your Mac, open the [Azure portal] in a browser window.

	>[AZURE.NOTE] It's easier to run your Xamarin.iOS app on a Mac. You can run the Xamarin.iOS app by using Visual Studio on your Windows-based computer if you want, but it's a bit more complicated because you have to connect to a networked Mac. If you're interested in doing that, see [Installing Xamarin.iOS on Windows].

2. On the settings blade for your Mobile App, click **Get Started** > **Xamarin.iOS**. Under step 3, click  **Create a new app** if it's not already selected.  Next click the **Download** button.

  	This downloads a project that contains a client application that is connected to your mobile app. Save the compressed project file to your local computer, and make a note of where you save it.

3. Extract the project that you downloaded, and then open it in Xamarin Studio (or Visual Studio).

	![][9]

	![][8]

4. Press the F5 key to build the project and start the app in the iPhone emulator.

5. In the app, type meaningful text, such as _Learn Xamarin_, and then click the **+** button.

	![][10]

	This sends a POST request to the new mobile app backend hosted in Azure. Data from the request is inserted into the TodoItem table. Items stored in the table are returned by the mobile app backend, and the data is displayed in the list.

>[AZURE.NOTE]You can review the code that accesses your mobile app backend to query and insert data in the QSTodoService.cs C# file.

##Next steps

* [Add authentication to your app ](app-service-mobile-xamarin-ios-get-started-users.md)
  <br/>Learn how to authenticate users of your app by using an identity provider.

* [Add push notifications to your app](app-service-mobile-xamarin-ios-get-started-push.md)
  <br/>Learn how to send a very basic push notification to your app.

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


[Xamarin Studio]: http://xamarin.com/download
[Xamarin]: http://xamarin.com/download
[Xcode]: https://go.microsoft.com/fwLink/?LinkID=266532
[Xamarin for Windows]: https://go.microsoft.com/fwLink/?LinkID=330242&clcid=0x409
[Installing Xamarin.iOS on Windows]: http://developer.xamarin.com/guides/ios/getting_started/installation/windows/
