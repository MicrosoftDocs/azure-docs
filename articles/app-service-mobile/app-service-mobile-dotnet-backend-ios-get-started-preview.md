<properties
	pageTitle="Create an iOS app on Azure Mobile Apps"
	description="Follow this tutorial to get started using Azure Mobile App backends for iOS development in Objective-C or Swift"
	services="app-service\mobile"
	documentationCenter="ios"
	authors="krisragh"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-ios"
	ms.devlang="objective-c"
	ms.topic="hero-article"
	ms.date="08/11/2015"
	ms.author="krisragh"/>

#Create an iOS app

[AZURE.INCLUDE [app-service-mobile-selector-get-started-preview](../../includes/app-service-mobile-selector-get-started-preview.md)]
&nbsp;  
[AZURE.INCLUDE [app-service-mobile-note-mobile-services-preview](../../includes/app-service-mobile-note-mobile-services-preview.md)]

##Overview

This tutorial shows you how to add a cloud-based backend service to an iOS mobile app using an Azure Mobile App backend.  You will create both a new Mobile App backend and a simple _Todo list_ iOS app that stores app data in Azure.

Completing this tutorial is a prerequisite for all other Mobile Apps tutorials for iOS apps.

##Prerequisites

To complete this tutorial, you need the following:

* An active Azure account. If you don't have an account, you can sign up for an Azure trial and get up to 10 free Mobile Apps that you can keep using even after your trial ends. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/).
 
* [Visual Studio Community 2013] or a later version.

* A Mac with Xcode v7.0 or a later version.

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751&appServiceName=mobile), where you can immediately create a short-lived starter Mobile App in App Service. No credit cards required; no commitments.

## Create a new Azure Mobile App backend

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-create-new-service-preview](../../includes/app-service-mobile-dotnet-backend-create-new-service-preview.md)]

## Download the server project

1. On your PC, visit the [Azure Portal]. Click **Browse All** > **Mobile Apps**, then click the Mobile App backend that you just created.
 
2. In the Mobile App blade, click **Settings** and under **Mobile App** click **Quickstart** > **iOS (Objective-C)**. If you prefer Swift, click **Quickstart** > **iOS (Swift)** instead.
 
3. Under **Download and run your server project**, click **Download**. Extract the compressed project files to your PC, and open the solution in Visual Studio.

## Publish server project to Azure

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-publish-service-preview](../../includes/app-service-mobile-dotnet-backend-publish-service-preview.md)]

## Download and run iOS app

[AZURE.INCLUDE [app-service-mobile-ios-run-app-preview](../../includes/app-service-mobile-ios-run-app-preview.md)]


<!-- Images. -->
[0]: ./media/mobile-services-dotnet-backend-ios-get-started/mobile-quickstart-completed-ios.png
[1]: ./media/mobile-services-dotnet-backend-ios-get-started/mobile-quickstart-steps-vs.png

[6]: ./media/app-service-mobile-dotnet-backend-ios-get-started-preview/ios-quickstart.png

[7]: ./media/mobile-services-dotnet-backend-ios-get-started/mobile-quickstart-steps-ios.png
[8]: ./media/mobile-services-dotnet-backend-ios-get-started/mobile-xcode-project.png

[10]: ./media/mobile-services-dotnet-backend-ios-get-started/mobile-quickstart-startup-ios.png
[11]: ./media/mobile-services-dotnet-backend-ios-get-started/mobile-data-tab.png
[12]: ./media/mobile-services-dotnet-backend-ios-get-started/mobile-data-browse.png

[Azure Portal]: https://portal.azure.com/
[XCode]: https://go.microsoft.com/fwLink/p/?LinkID=266532
 
[Visual Studio Community 2013]: https://go.microsoft.com/fwLink/p/?LinkID=534203
