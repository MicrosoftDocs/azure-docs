<properties
	pageTitle="Get Started with Mobile Apps by using Xamarin.Forms"
	description="Follow this tutorial to get started using Azure Mobile Apps for Xamarin.Forms development"
	services="app-service\mobile"
	documentationCenter="xamarin"
	authors="wesmc7777"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-xamarin"
	ms.devlang="dotnet"
	ms.topic="get-started-article"
	ms.date="08/12/2015"
	ms.author="normesta"/>

#Create a Xamarin.Forms app

[AZURE.INCLUDE [app-service-mobile-selector-get-started](../../includes/app-service-mobile-selector-get-started.md)]
&nbsp;  
[AZURE.INCLUDE [app-service-mobile-note-mobile-services](../../includes/app-service-mobile-note-mobile-services.md)]

##Overview

This tutorial shows you how to add a cloud-based backend service to a Xamarin.Forms mobile app using an Azure Mobile App backend.  You will create both a new Mobile App backend and a simple _Todo list_ Xamarin.Forms app that stores app data in Azure.

Completing this tutorial is a prerequisite for all other Mobile Apps tutorials for Xamarin.Forms.

##Prerequisites

To complete this tutorial, you need the following:

* An active Azure account. If you don't have an account, you can sign up for an Azure trial and get up to 10 free Mobile Apps that you can keep using even after your trial ends. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/).
 
* [Visual Studio Community 2013] or later.  If you install Visual Studio Community 2013, install [Xamarin] separately.  You can install the Xamarin tools when you install Visual Studio 2015.

* A Mac with [Xcode] v7.0 or later and [Xamarin Studio] installed. If you plan to build your app on a Windows computer by using Visual Studio, you'll still need access to a networked Mac to do it.
 
>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751&appServiceName=mobile), where you can immediately create a short-lived starter Mobile App in App Service. No credit cards required; no commitments.

## Create a new Azure Mobile App backend

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-create-new-service](../../includes/app-service-mobile-dotnet-backend-create-new-service.md)]

## Download the server project

1. On your PC, visit the [Azure Portal]. Click **Browse All** > **Mobile Apps**, then click the Mobile App backend that you just created.

2. In the Mobile App blade, click **Settings** and under **Mobile App** click **Quickstart** > **Xamarin.Forms**.
 
3. Under **Download and run your server project**, click **Download**. Extract the compressed project files to your PC, and open the solution in Visual Studio.
 
## Test your backend project locally

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-test-local-service](../../includes/app-service-mobile-dotnet-backend-test-local-service.md)]

## Publish server project to Azure

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-publish-service](../../includes/app-service-mobile-dotnet-backend-publish-service.md)]

##Download and run the Xamarin.Forms solution

Here you have a couple of choices. You can download the solution to a Mac and open it in Xamarin Studio, or you can download the solution to a Windows computer and open it in Visual Studio. You can also use both environments and switch back and forth between them. Consider these things:

* It's easier to run the iOS project of your solution on a Mac. You can use Visual Studio on your Windows computer if you want, but it's a bit more complicated because you have to connect to a networked Mac. If you're interested in doing that, see [Installing Xamarin.iOS on Windows].
* You can run the Android project on either your Mac or your Windows computer.
* You can run the Windows project(s) only by using Visual Studio on a Windows computer.

With all of this in mind, let's proceed.

 1. On your Mac or on your Windows computer, open the [Azure Portal] in a browser window.
 2. Under **Download and run your Xamarin.Forms project**, click the **Download** button.

    This downloads a project that contains a client application that is connected to your mobile app. Save the compressed project file to your local computer, and make a note of where you save it.

 3. Extract the project that you downloaded, and then open it in Xamarin Studio or Visual Studio.

	![][9]

	![][8]

###Run the iOS project

####In Xamarin Studio

1. Right-click the iOS project, and then click **Set As Startup Project**.
2. On the **Run** menu, click **Start Debugging** to build the project and start the app in the iPhone emulator.

####In Visual Studio
1. Right-click the iOS project, and then click **Set as StartUp Project**.
2. On the **Build** menu, click **Configuration Manager**. 
3. In the **Configuration Manager** dialog box, select the **Build** and **Deploy** checkboxes of the iOS project.
4. Press the **F5** key to build the project and start the app in the iPhone emulator.

In the app, type meaningful text, such as _Learn Xamarin_ and then click the **+** button.

![][10]

This sends a POST request to the new mobile app backend hosted in Azure. Data from the request is inserted into the TodoItem table. Items stored in the table are returned by the mobile app backend, and the data is displayed in the list.

> [AZURE.NOTE]
> You'll find the code that accesses your mobile app backend in the ToDoActivity.cs C# file of the portable class library project of your solution.

###Run the Android project

####In Xamarin Studio

1. Right-click the Android project, and then click **Set As Startup Project**.
2. On the **Run** menu, click **Start Debugging** to build the project and start the app in an Android emulator.

####In Visual Studio
1. Right-click the Android project, and then click **Set as StartUp Project**.
4. On the **Build** menu, click **Configuration Manager**. 
5. In the **Configuration Manager** dialog box, select the **Build** and **Deploy** checkboxes of the Android project.
6. Press the **F5** key to build the project and start the app in an Android emulator.

In the app, type meaningful text, such as _Learn Xamarin_ and then click the **+** button.

![][11]

This sends a POST request to the new mobile app backend hosted in Azure. Data from the request is inserted into the TodoItem table. Items stored in the table are returned by the mobile app backend, and the data is displayed in the list.

> [AZURE.NOTE]
> You'll find the code that accesses your mobile app backend in the ToDoActivity.cs C# file of the portable class library project of your solution.


###Run the Windows project

####In Visual Studio
1. Right-click any of the Windows projects, and then click **Set as StartUp Project**.
4. On the **Build** menu, click **Configuration Manager**. 
5. In the **Configuration Manager** dialog box, select the **Build** and **Deploy** checkboxes of the Windows project that you chose.
6. Press the **F5** key to build the project and start the app in a Windows emulator.

In the app, type meaningful text, such as _Learn Xamarin_ and then click the **+** button.
	
This sends a POST request to the new mobile app backend hosted in Azure. Data from the request is inserted into the TodoItem table. Items stored in the table are returned by the mobile app backend, and the data is displayed in the list.

![][12]
	
> [AZURE.NOTE]
> You'll find the code that accesses your mobile app backend in the ToDoActivity.cs C# file of the portable class library project of your solution.

<!-- Anchors. -->
[Getting started with mobile app backends]:#getting-started
[Create a new mobile app backend]:#create-new-service
[Next Steps]:#next-steps


<!-- Images. -->
[6]: ./media/app-service-mobile-xamarin-forms-get-started/xamarin-forms-quickstart.png
[8]: ./media/app-service-mobile-xamarin-forms-get-started/xamarin-forms-quickstart-vs.png
[9]: ./media/app-service-mobile-xamarin-forms-get-started/xamarin-forms-quickstart-xs.png
[10]: ./media/app-service-mobile-xamarin-forms-get-started/mobile-quickstart-startup-ios.png
[11]: ./media/app-service-mobile-xamarin-forms-get-started/mobile-quickstart-startup-android.png
[12]: ./media/app-service-mobile-xamarin-forms-get-started/mobile-quickstart-startup-windows.png


<!-- URLs. -->
[Visual Studio Professional 2013]: https://go.microsoft.com/fwLink/p/?LinkID=257546
[Mobile app SDK]: http://go.microsoft.com/fwlink/?LinkId=257545
[Azure Portal]: https://portal.azure.com/


[Xamarin Studio]: http://xamarin.com/download
[Xamarin]: http://xamarin.com/download
[Xcode]: https://go.microsoft.com/fwLink/?LinkID=266532&clcid=0x409
[Xamarin for Windows]: https://go.microsoft.com/fwLink/?LinkID=330242&clcid=0x409
[Installing Xamarin.iOS on Windows]: http://developer.xamarin.com/guides/ios/getting_started/installation/windows/
 