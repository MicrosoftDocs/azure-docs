<properties
	pageTitle="Get Started with Azure Mobile Services for iOS apps"
	description="Follow this tutorial to get started using Azure Mobile Services for iOS development."
	services="mobile-services"
	documentationCenter="ios"
	authors="krisragh"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="mobile-services"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-ios"
	ms.devlang="objective-c"
	ms.topic="hero-article"
	ms.date="04/24/2015"
	ms.author="krisragh"/>

# <a name="getting-started"> </a>Get started with Mobile Services

[AZURE.INCLUDE [mobile-services-selector-get-started](../includes/mobile-services-selector-get-started.md)]

This tutorial shows you how to add a cloud-based backend service to an iOS app using Azure Mobile Services.

In this tutorial, you will create both a new mobile service and a simple _To do list_ app that stores app data in the new mobile service. The mobile service that you will create uses JavaScript for server-side business logic. To create a mobile service with server-side business logic in .NET, see the [.NET backend version] of this topic.

> [AZURE.NOTE] To complete this tutorial, you need an Azure account. If you don't have an account, you can sign up for an Azure trial and get [free mobile services that you can keep using even after your trial ends](http://azure.microsoft.com/pricing/details/mobile-services/). For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/?WT.mc_id=AE564AB28&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdevelop%2Fmobile%2Ftutorials%2Fget-started-ios%2F%20 target="_blank").

## <a name="create-new-service"> </a>Create a new mobile service

[AZURE.INCLUDE [mobile-services-create-new-service](../includes/mobile-services-create-new-service.md)]

## Create a new iOS app

You can follow an easy Quick Start in the Management Portal to create a new app connected to your mobile service:

1. In the Management Portal, click **Mobile Services**, and then click the mobile service that you just created.

2. In the Quick Start tab, click **iOS** under **Choose a platform** and expand **Create a new iOS app**. This displays the steps to create an iOS app connected to your mobile service.

3. Click **Create TodoItem table** to create a table to store app data.

4. Under **Download and run your app**, click **Download**. This downloads the project for the sample _To do list_ application that is connected to your mobile service, along with the Mobile Services iOS SDK. Save the compressed project file to your local computer, and make a note of where you saved it.

## Run your new iOS app

[AZURE.INCLUDE [mobile-services-ios-run-app](../includes/mobile-services-ios-run-app.md)]

<ol start="4">
<li><p>Back in the Management Portal, click the <strong>DATA</strong> tab and then click the <strong>TodoItem</strong> table. This lets you browse the data inserted by the app into the table.<p></li></ol></p>

## <a name="next-steps"> </a>Next Steps
Learn how to perform additional important tasks in Mobile Services:

* [Add mobile services to an existing app]
	<br/>Learn more about storing and querying data using Mobile Services.

* [Get started with offline data sync]
	<br/>Learn how to use offline data sync to make your app responsive and robust.

* [Add authentication to an existing app]
	<br/>Learn how to authenticate users of your app with an identity provider.

* [Add push notifications to an existing app]
	<br/>Learn how to send a very basic push notification to your app.


<!-- Anchors. -->
[Getting started with Mobile Services]:#getting-started
[Create a new mobile service]:#create-new-service
[Define the mobile service instance]:#define-mobile-service-instance
[Next Steps]:#next-steps

<!-- Images. -->
[6]: ./media/mobile-services-ios-get-started/mobile-portal-quickstart-ios.png
[7]: ./media/mobile-services-ios-get-started/mobile-quickstart-steps-ios.png
[8]: ./media/mobile-services-ios-get-started/mobile-xcode-project.png

[10]: ./media/mobile-services-ios-get-started/mobile-quickstart-startup-ios.png
[11]: ./media/mobile-services-ios-get-started/mobile-data-tab.png
[12]: ./media/mobile-services-ios-get-started/mobile-data-browse.png


<!-- URLs. -->
[Add mobile services to an existing app]: mobile-services-dotnet-backend-ios-get-started-data.md
[Get started with offline data sync]: mobile-services-ios-get-started-offline-data.md
[Add authentication to an existing app]: mobile-services-dotnet-backend-ios-get-started-users.md
[Add push notifications to an existing app]: mobile-services-dotnet-backend-ios-get-started-push.md


[Mobile Services iOS SDK]: https://go.microsoft.com/fwLink/p/?LinkID=266533
[Management Portal]: https://manage.windowsazure.com/
[XCode]: https://go.microsoft.com/fwLink/p/?LinkID=266532
[.NET backend version]: mobile-services-dotnet-backend-ios-get-started.md
