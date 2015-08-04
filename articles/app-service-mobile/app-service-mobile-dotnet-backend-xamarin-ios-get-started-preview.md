<properties
	pageTitle="Get Started with Mobile Apps in Xamarin iOS"
	description="Get started using Xamarin iOS to build an Azure Mobile App with Azure App Service."
	services="app-service\mobile"
	documentationCenter="xamarin"
	authors="christopheranderson"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-xamarin-ios"
	ms.devlang="dotnet"
	ms.topic="get-started-article"
	ms.date="07/20/2015"
	ms.author="chrande"/>


# <a name="getting-started"> </a>Create a Xamarin.iOS app

[AZURE.INCLUDE [app-service-mobile-selector-get-started-preview](../../includes/app-service-mobile-selector-get-started-preview.md)]

This tutorial shows you how to connect a Xamarin.iOS app to a cloud-based backend service by using Azure Mobile Apps. You'll start by creating a new .NET service. Then, you'll create a basic _To do list_ task tracking app that stores tasks to the .NET backend.

You'll have to complete this tutorial before you try all the other tutorials for Xamarin.iOS apps. But first, you'll need these things:

* An active Azure account. 

    If you don't have an account yet, sign up for an Azure trial and get up to 10 free mobile apps. You can keep using them even after your trial ends. See [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/).

    >[AZURE.NOTE] If you want to get started with mobile apps before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751&appServiceName=mobile). You can create a short-lived starter mobile app  immediately. No credit cards required; no commitments.

* <a href="https://www.visualstudio.com/en-us/visual-studio-homepage-vs.aspx" target="_blank">Visual Studio 2015 (any edition)</a> or <a href="https://go.microsoft.com/fwLink/p/?LinkID=257546" target="_blank">Visual Studio Professional 2013</a>, and [Xamarin] installed on your local computer or virtual machine. You need this to build and run the mobile app backend project.

* A Mac with [Xamarin Studio] and [Xcode] v4.4 or later installed it.  

     >[AZURE.NOTE]If you plan to build your app on a Windows computer by using Visual Studio, you'll still need access to a networked Mac to do it.

## Create a new mobile app backend

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-create-new-service-preview](../../includes/app-service-mobile-dotnet-backend-create-new-service-preview.md)]

## Create a Xamarin.iOS app

Follow a basic quickstart on the [Azure Portal] to create an app or modify one, and then connect it to your mobile backend.

To get started, you'll download a .NET backend service project for your mobile app and a new Xamarin.iOS app. Here's how you do it.

1. On your Windows computer, open the [Azure Portal] in a browser window.

2. In the Azure Portal, click **Browse All**, then **Mobile Apps**, and then click the mobile app that you just created.

2. At the top of the blade, click **Add Client** and expand **Xamarin.iOS**.

	![][6]

    This displays the three things you need to do to create a Xamarin.iOS app that's connected to your mobile app backend

###Download, run, and publish the mobile backend project

5. Under **Download and run your service project**, click the **Download** button.

  	This downloads a project that contains the mobile app backend code. Save the compressed project file to your local computer and make a note of where you saved it.

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-test-local-service-preview](../../includes/app-service-mobile-dotnet-backend-test-local-service-preview.md)]


[AZURE.INCLUDE [app-service-mobile-dotnet-backend-publish-service-preview](../../includes/app-service-mobile-dotnet-backend-publish-service-preview.md)]

###Download and run the Xamarin.iOS app

5. On your Mac, open the [Azure Portal] in a browser window.

>[AZURE.NOTE] It's easier to run your Xamarin.iOS app on a Mac. You can run the Xamarin.iOS app by using Visual Studio on your Windows computer if you want, but it's a bit more complicated because you have to connect to a networked Mac. If you're interested in doing that, see [Installing Xamarin.iOS on Windows].

6. Under **Download and run your Xamarin.iOS project**, click the **Download** button.

  	This downloads a project that contains a client application that is connected to your mobile app. Save the compressed project file to your local computer, and make a note of where you save it.

1. Extract the project that you downloaded, and then open it in Xamarin Studio (or Visual Studio).

	![][9]

	![][8]

2. Press the **F5** key to build the project and start the app in the iPhone emulator.

3. In the app, type meaningful text, such as _Learn Xamarin_ and then click the **+** button.

	![][10]

	This sends a POST request to the new mobile app backend hosted in Azure. Data from the request is inserted into the TodoItem table. Items stored in the table are returned by the mobile app backend, and the data is displayed in the list.

>[AZURE.NOTE]You can review the code that accesses your mobile app backend to query and insert data in the QSTodoService.cs C# file.


<!-- Anchors. -->
[Getting started with mobile app backends]:#getting-started
[Create a new mobile app backend]:#create-new-service
[Next Steps]:#next-steps



<!-- Images. -->
[6]: ./media/app-service-mobile-dotnet-backend-xamarin-ios-get-started-preview/xamarin-ios-quickstart.png
[8]: ./media/app-service-mobile-dotnet-backend-xamarin-ios-get-started-preview/mobile-xamarin-project-ios-vs.png
[9]: ./media/app-service-mobile-dotnet-backend-xamarin-ios-get-started-preview/mobile-xamarin-project-ios-xs.png
[10]: ./media/app-service-mobile-dotnet-backend-xamarin-ios-get-started-preview/mobile-quickstart-startup-ios.png

<!-- URLs. -->
[Get started with offline data sync]: app-service-mobile-xamarin-ios-get-started-offline-data-preview.md
[Get started with authentication]: ../app-service-mobile-dotnet-backend-xamarin-ios-get-started-preview-users.md
[Get started with push notifications]: ../app-service-mobile-dotnet-backend-xamarin-ios-get-started-preview-push.md
[Visual Studio Professional 2013]: https://go.microsoft.com/fwLink/p/?LinkID=257546
[Mobile app SDK]: http://go.microsoft.com/fwlink/?LinkId=257545
[Azure Portal]: https://portal.azure.com/
[JavaScript backend version]: ../partner-xamarin-mobile-services-ios-get-started.md
[Get started with data in app services using Visual Studio 2012]: ../app-service-mobile-windows-store-dotnet-get-started-data-vs2012-preview.md
[Troubleshoot a mobile app .NET backend]: ../app-service-mobile-dotnet-backend-how-to-troubleshoot-preview.md


[Xamarin Studio]: http://xamarin.com/download
[Xamarin]: http://xamarin.com/download
[Xcode]: https://go.microsoft.com/fwLink/?LinkID=266532
[Xamarin for Windows]: https://go.microsoft.com/fwLink/?LinkID=330242&clcid=0x409
[Installing Xamarin.iOS on Windows]: http://developer.xamarin.com/guides/ios/getting_started/installation/windows/
 