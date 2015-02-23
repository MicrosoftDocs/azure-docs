<properties
	pageTitle="Get Started with Azure App Service Mobile iOS Apps"
	description="Follow this tutorial to get started using Azure App Service for iOS development."
	services="app-service-mobile"
	documentationCenter="ios"
	authors="ysxu"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm=""
	ms.devlang="objective-c"
	ms.topic="hero-article"
	ms.date="2/20/2015"
	ms.author="yuaxu"/>

# <a name="getting-started"> </a>Get started with App Service Mobile Apps

[AZURE.INCLUDE [app-service-mobile-selector-get-started-preview](../includes/app-service-mobile-selector-get-started-preview.md)]

This tutorial shows you how to create an iOS app with Azure App Service Mobile Apps. You will create a new mobile app backend and a simple _To do list_ app that stores app data. The tutorial uses .NET and Visual Studio for server-side logic.

> [AZURE.NOTE] To complete this tutorial, you need an Azure account. If you don't have an account, you can sign up for an Azure trial and get [free mobile services](http://azure.microsoft.com/en-us/pricing/details/mobile-services/) that you can keep using even after your trial ends.  For details, see [Azure Free Trial](http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=AE564AB28&amp;returnurl=http%3A%2F%2Fwww.windowsazure.com%2Fen-us%2Fdevelop%2Fmobile%2Ftutorials%2Fget-started-ios%2F%20target="_blank").

## <a name="create-new-service"> </a>Create a new mobile app backend

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-create-new-service-preview](../includes/app-service-mobile-services-dotnet-backend-create-new-service-preview.md)]

## Download the mobile app backend and app to your local computer

Now that you have created the mobile app backend, download the projects to run them locally.

1. Click **Browse** on the left navigation, expand **Mobile Apps**, and click on the App Service Mobile App that you just created.

2. then in the Quick Start tab, click **iOS** under **Choose a platform** and expand **Create a new iOS app**.

2. On your Windows PC, click **Download** under **Download and publish your service to the cloud**. This downloads the Visual Studio project that implements your mobile service. Save the compressed project file to your local computer, and make a note of where you saved it.

3. On your Mac, click **Download** under **Download and run your app**. This downloads the project for the sample _To do list_ application that is connected to your mobile service, along with the Mobile Services iOS SDK. Save the compressed project file to your local computer, and make a note of where you saved it.

## Test the mobile service

[AZURE.INCLUDE [mobile-services-dotnet-backend-test-local-service](../includes/mobile-services-dotnet-backend-test-local-service.md)]

## Publish your mobile service

[AZURE.INCLUDE [mobile-services-dotnet-backend-publish-service](../includes/mobile-services-dotnet-backend-publish-service.md)]


## Run your new iOS app

[AZURE.INCLUDE [mobile-services-ios-run-app](../includes/mobile-services-ios-run-app.md)]


## <a name="next-steps"> </a>Next Steps

This shows how to run your new client app against the mobile service running in Azure. Before you can test the iOS app with the mobile service running on a local computer, you must configure the Web server and firewall to allow access from your iOS development computer. For more information, see [Configure the local web server to allow connections to a local mobile service](/en-us/documentation/articles/mobile-services-dotnet-backend-how-to-configure-iis-express).

Learn how to perform additional important tasks in Mobile Services:

* [Add mobile services to an existing app]
  <br/>Learn more about storing and querying data using Mobile Services.

* [Get started with offline data sync]
  <br/>Learn how to use offline data sync to make your app responsive and robust.

* [Add authentication to an existing app]
  <br/>Learn how to authenticate users of your app with an identity provider.

* [Add push notifications to an existing app]
  <br/>Learn how to send a very basic push notification to your app.

* [Troubleshoot Mobile Services .NET backend]
  <br/> Learn how to diagnose and fix issues that can arise with a Mobile Services .NET backend.

<!-- Anchors. -->
[Getting started with Mobile Services]:#getting-started
[Create a new mobile service]:#create-new-service
[Define the mobile service instance]:#define-mobile-service-instance
[Next Steps]:#next-steps

<!-- Images. -->
[0]: ./media/mobile-services-dotnet-backend-ios-get-started/mobile-quickstart-completed-ios.png
[1]: ./media/mobile-services-dotnet-backend-ios-get-started/mobile-quickstart-steps-vs.png

[6]: ./media/mobile-services-dotnet-backend-ios-get-started/mobile-portal-quickstart-ios.png
[7]: ./media/mobile-services-dotnet-backend-ios-get-started/mobile-quickstart-steps-ios.png
[8]: ./media/mobile-services-dotnet-backend-ios-get-started/mobile-xcode-project.png

[10]: ./media/mobile-services-dotnet-backend-ios-get-started/mobile-quickstart-startup-ios.png
[11]: ./media/mobile-services-dotnet-backend-ios-get-started/mobile-data-tab.png
[12]: ./media/mobile-services-dotnet-backend-ios-get-started/mobile-data-browse.png


<!-- URLs. -->
[Add mobile services to an existing app]: /en-us/documentation/articles/mobile-services-dotnet-backend-ios-get-started-data
[Get started with offline data sync]: /en-us/documentation/articles/mobile-services-ios-get-started-offline-data
[Add authentication to an existing app]: /en-us/documentation/articles/mobile-services-dotnet-backend-ios-get-started-users
[Add push notifications to an existing app]: /en-us/documentation/articles/mobile-services-dotnet-backend-ios-get-started-push
[Troubleshoot Mobile Services .NET backend]: /en-us/documentation/articles/mobile-services-dotnet-backend-how-to-troubleshoot/

[Mobile Services iOS SDK]: https://go.microsoft.com/fwLink/p/?LinkID=266533

[Management Portal]: https://manage.windowsazure.com/
[XCode]: https://go.microsoft.com/fwLink/p/?LinkID=266532
[JavaScript backend version]: /en-us/documentation/articles/mobile-services-ios-get-started
