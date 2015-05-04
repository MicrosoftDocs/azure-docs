<properties
	pageTitle="Get Started with Azure App Service Mobile iOS Apps"
	description="Follow this tutorial to get started using Azure App Service for iOS development."
	services="app-service\mobile"
	documentationCenter="ios"
	authors="yuaxu"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-ios"
	ms.devlang="objective-c"
	ms.topic="hero-article"
	ms.date="02/20/2015"
	ms.author="yuaxu"/>

# <a name="getting-started"> </a>Create an iOS app

[AZURE.INCLUDE [app-service-mobile-selector-get-started-preview](../includes/app-service-mobile-selector-get-started-preview.md)]

This tutorial shows you how to create an iOS app with Azure App Service Mobile Apps. You will create a new mobile app backend and a simple _To do list_ app that stores app data. The tutorial uses .NET and Visual Studio for server-side logic.

To complete this tutorial, you need the following:

* An active Azure account. If you don't have an account, you can sign up for an Azure trial and get up to 10 free mobile apps that you can keep using even after your trial ends. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/).
* <a href="https://go.microsoft.com/fwLink/p/?LinkID=257546" target="_blank">Visual Studio Professional 2013</a>.

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751&appServiceName=mobile), where you can immediately create a short-lived starter mobile app in App Service. No credit cards required; no commitments.

## <a name="create-new-service"> </a>Create a new mobile app backend

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-create-new-service-preview](../includes/app-service-mobile-dotnet-backend-create-new-service-preview.md)]

## Create a new iOS app

Now that you have created your mobile backend, you can follow an easy quickstart in the Azure Preview Portal to either create a new app or modify an existing app to connect to your mobile app backend.

1. In the Azure Portal, click **Mobile App**, and then click the mobile app backend that you just created.

2. At the top of the blade, click Add Client and expand iOS.

	![][6]

	This displays steps to create a iOS app connected to your mobile app backend.

3. If you haven't already done so, download and install <a href="https://go.microsoft.com/fwLink/p/?LinkID=257546" target="_blank">Visual Studio Professional 2013</a> on your local computer or virtual machine. 

4. Download and install [Xcode] v4.4 or a later version and [Xamarin Studio]. You can also use Xamarin for Visual Studio.

5. Under **Download and publish your service to the cloud**, click **Download**.

 This downloads a solution contains projects for both the mobile app backend and for the sample _To do list_ application that is connected to your mobile app backend. Save the compressed project file to your local computer, and make a note of where you save it.

6. Download your publish profile, save the downloaded file to your local computer, and make a note of where you save it.

## Test the mobile app

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-test-local-service-preview](../includes/app-service-mobile-dotnet-backend-test-local-service-preview.md)]

## Publish your mobile app

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-publish-service-preview](../includes/app-service-mobile-dotnet-backend-publish-service-preview.md)]

## Run the iOS app

[AZURE.INCLUDE [app-service-mobile-ios-run-app-preview](../includes/app-service-mobile-ios-run-app-preview.md)]



<!-- Images. -->
[0]: ./media/mobile-services-dotnet-backend-ios-get-started/mobile-quickstart-completed-ios.png
[1]: ./media/mobile-services-dotnet-backend-ios-get-started/mobile-quickstart-steps-vs.png

[6]: ./media/app-service-mobile-dotnet-backend-ios-get-started-preview/ios-quickstart.png

[7]: ./media/mobile-services-dotnet-backend-ios-get-started/mobile-quickstart-steps-ios.png
[8]: ./media/mobile-services-dotnet-backend-ios-get-started/mobile-xcode-project.png

[10]: ./media/mobile-services-dotnet-backend-ios-get-started/mobile-quickstart-startup-ios.png
[11]: ./media/mobile-services-dotnet-backend-ios-get-started/mobile-data-tab.png
[12]: ./media/mobile-services-dotnet-backend-ios-get-started/mobile-data-browse.png

[Management Portal]: https://manage.windowsazure.com/
[XCode]: https://go.microsoft.com/fwLink/p/?LinkID=266532
