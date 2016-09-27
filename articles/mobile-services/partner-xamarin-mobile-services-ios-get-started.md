<properties
	pageTitle="Get Started with Mobile Services for Xamarin iOS apps | Microsoft Azure"
	description="Follow this tutorial to get started using Azure Mobile Services for Xamarin iOS development."
	services="mobile-services"
	documentationCenter="xamarin"
	authors="conceptdev"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="mobile-services"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-xamarin-ios"
	ms.devlang="dotnet"
	ms.topic="hero-article"
	ms.date="07/21/2016"
	ms.author="craig.dunn@xamarin.com"/>

# <a name="getting-started"> </a>Get started with Mobile Services
[AZURE.INCLUDE [mobile-services-selector-get-started](../../includes/mobile-services-selector-get-started.md)]
&nbsp;

[AZURE.INCLUDE [mobile-service-note-mobile-apps](../../includes/mobile-services-note-mobile-apps.md)]
> For the equivalent Mobile Apps version of this topic, see [Create a Xamarin.iOS App](../app-service-mobile/app-service-mobile-xamarin-ios-get-started.md).

This tutorial shows you how to add a cloud-based backend service to a Xamarin.iOS app using Azure Mobile Services. In this tutorial, you will create both a new mobile service and a simple *To do list* app that stores app data in the new mobile service.

If you prefer to watch a video, the clip below follows the same steps as this tutorial.

Video: "Getting Started with Xamarin and Azure Mobile Services" with Craig Dunn, developer evangelist for Xamarin  (duration: 10:05 min)

> [AZURE.VIDEO getting-started-with-xamarin-and-mobile-services]

A screenshot from the completed app is below:

![][0]

Completing this tutorial requires XCode and Xamarin Studio for OS X or Visual Studio on Windows with a networked Mac. Complete installation instructions are on [Setup and Install for Visual Studio and Xamarin](https://msdn.microsoft.com/library/mt613162.aspx). 

> [AZURE.IMPORTANT] To complete this tutorial, you need an Azure account. If you don't have an account, you can sign up for an Azure trial and get up to 10 free mobile services that you can keep using even after your trial ends. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/).

## <a name="create-new-service"> </a>Create a new mobile service

[AZURE.INCLUDE [mobile-services-create-new-service](../../includes/mobile-services-create-new-service.md)]

## Create a new Xamarin.iOS app

Once you have created your mobile service, you can follow an easy quickstart in the Azure classic portal to either create a new app or modify an existing app to connect to your mobile service.

In this section you will create a new Xamarin.iOS app that is connected to your mobile service.

1.  In the [Azure classic portal], click **Mobile Services**, and then click the mobile service that you just created.

2. In the quickstart tab, click **Xamarin.iOS** under **Choose platform** and expand **Create a new Xamarin.iOS app**.

	![][6]

	This displays the three easy steps to create a Xamarin.iOS app connected to your mobile service.

  	![][7]

3. If you haven't already done so, download and install Xcode (we recommend the latest version, Xcode 6.0, or newer) and [Xamarin Studio].

4. Click **Create TodoItems table** to create a table to store app data.

5. Under **Download and run app**, click **Download**.

	This downloads the project for the sample _To do list_ application that is connected to your mobile service and references the Azure Mobile Services component for Xamarin.iOS. Save the compressed project file to your local computer, and make a note of where you saved it.

## Run your new Xamarin.iOS app

The final stage of this tutorial is to build and run your new app.

1. Browse to the location where you saved the compressed project files, expand the files on your computer, and open the **XamarinTodoQuickStart.iOS.sln** solution file using Xamarin Studio or Visual Studio.

	![][8]

	![][9]

2. Press the **Run** button to build the project and start the app in the iPhone emulator, which is the default for this project.

3. In the app, type meaningful text, such as _Complete the tutorial_ and then click the plus (**+**) icon.

	![][10]

	This sends a POST request to the new mobile service hosted in Azure. Data from the request is inserted into the TodoItem table. Items stored in the table are returned by the mobile service, and the data is displayed in the list.

	> [AZURE.NOTE] You can review the code that accesses your mobile service to query and insert data, which is found in the TodoService.cs C# file.

4. Back in the [Azure classic portal], click the **Data** tab and then click the **TodoItems** table.

	![][11]

	This lets you browse the data inserted by the app into the table.

	![][12]


## Next Steps
Now that you have completed the quickstart, learn how to perform additional important tasks in Mobile Services:

* [Get started with offline data sync]
  Learn how the quickstart uses offline data sync to make the app responsive and robust.

* [Get started with authentication]
  Learn how to authenticate users of your app with an identity provider.

* [Get started with push notifications]
  Learn how to send a very basic push notification to your app.




[AZURE.INCLUDE [app-service-disqus-feedback-slug](../../includes/app-service-disqus-feedback-slug.md)]

<!-- Anchors. -->
[Getting started with Mobile Services]:#getting-started
[Create a new mobile service]:#create-new-service
[Define the mobile service instance]:#define-mobile-service-instance
[Next Steps]:#next-steps

<!-- Images. -->
[0]: ./media/partner-xamarin-mobile-services-ios-get-started/mobile-quickstart-completed-ios.png
[6]: ./media/partner-xamarin-mobile-services-ios-get-started/mobile-portal-quickstart-xamarin-ios.png
[7]: ./media/partner-xamarin-mobile-services-ios-get-started/mobile-quickstart-steps-xamarin-ios.png
[8]: ./media/partner-xamarin-mobile-services-ios-get-started/mobile-xamarin-project-ios-xs.png
[9]: ./media/partner-xamarin-mobile-services-ios-get-started/mobile-xamarin-project-ios-vs.png
[10]: ./media/partner-xamarin-mobile-services-ios-get-started/mobile-quickstart-startup-ios.png
[11]: ./media/partner-xamarin-mobile-services-ios-get-started/mobile-data-tab.png
[12]: ./media/partner-xamarin-mobile-services-ios-get-started/mobile-data-browse.png


<!-- URLs. -->
[Get started with offline data sync]: mobile-services-xamarin-ios-get-started-offline-data.md
[Get started with authentication]: partner-xamarin-mobile-services-ios-get-started-users.md
[Get started with push notifications]: partner-xamarin-mobile-services-ios-get-started-push.md

[Xamarin Studio]: http://xamarin.com/download
[Mobile Services iOS SDK]: https://go.microsoft.com/fwLink/p/?LinkID=266533

[Azure classic portal]: https://manage.windowsazure.com/
