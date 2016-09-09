<properties
	pageTitle="Get Started with Mobile Apps by using Xamarin.Forms"
	description="Follow this tutorial to get started using Azure Mobile Apps for Xamarin.Forms development"
	services="app-service\mobile"
	documentationCenter="xamarin"
	authors="wesmc7777"
	manager="erikre"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-xamarin"
	ms.devlang="dotnet"
	ms.topic="hero-article"
	ms.date="08/04/2016"
	ms.author="glenga"/>

#Create a Xamarin.Forms app

[AZURE.INCLUDE [app-service-mobile-selector-get-started](../../includes/app-service-mobile-selector-get-started.md)]

##Overview

This tutorial shows you how to add a cloud-based backend service to a Xamarin.Forms mobile app using an Azure Mobile App backend. You will create both a new Mobile App backend and a simple _Todo list_ Xamarin.Forms app that stores app data in Azure.

Completing this tutorial is a prerequisite for all other Mobile Apps tutorials for Xamarin.Forms.

##Prerequisites

To complete this tutorial, you need the following:

* An active Azure account. If you don't have an account, you can sign up for an Azure trial and get up to 10 free Mobile Apps that you can keep using even after your trial ends. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/).

* Visual Studio with Xamarin. See [Setup and install for Visual Studio and Xamarin](https://msdn.microsoft.com/library/mt613162.aspx) for instructions. 

* A Mac with Xcode v7.0 or later and Xamarin Studio Community installed. See [Setup and install for Visual Studio and Xamarin](https://msdn.microsoft.com/library/mt613162.aspx) and [Setup, install, and verifications for Mac users](https://msdn.microsoft.com/library/mt488770.aspx) (MSDN).
 
>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](https://tryappservice.azure.com/?appServiceName=mobile), where you can immediately create a short-lived starter Mobile App in App Service. No credit cards required; no commitments.

## Create a new Azure Mobile App backend

Follow these steps to create a new Mobile App backend.

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-create-new-service](../../includes/app-service-mobile-dotnet-backend-create-new-service.md)]


You have now provisioned an Azure Mobile App backend that can be used by your mobile client applications. Next, you will download a server project for a simple "todo list" backend and publish it to Azure.

## Configure the server project

Follow the steps below to configure the server project to use either the Node.js or .NET backend.

[AZURE.INCLUDE [app-service-mobile-configure-new-backend](../../includes/app-service-mobile-configure-new-backend.md)]

##Download and run the Xamarin.Forms solution

Here you have a couple of choices. You can download the solution to a Mac and open it in Xamarin Studio, or you can download the solution to a Windows computer and open it in Visual Studio using a networked Mac for building the iOS app. See [Setup and install for Visual Studio and Xamarin](https://msdn.microsoft.com/library/mt613162.aspx) if you need more detailed instructions on the Xamarin setup scenarios.

Let's proceed:

 1. On your Mac or on your Windows computer, open the [Azure Portal] in a browser window.
 2. On the settings blade for your Mobile App, click **Get Started** (under Mobile) > **Xamarin.Forms**. Under step 3, click  **Create a new app** if it's not already selected.  Next click the **Download** button.

    This downloads a project that contains a client application that is connected to your mobile app. Save the compressed project file to your local computer, and make a note of where you save it.

 3. Extract the project that you downloaded, and then open it in Xamarin Studio or Visual Studio.

	![][9]

	![][8]


##(Optional) Run the iOS project

This section is for running the Xamarin iOS project for iOS devices. You can skip this section if you are not working with iOS devices.

####In Xamarin Studio

1. Right-click the iOS project, and then click **Set As Startup Project**.
2. On the **Run** menu, click **Start Debugging** to build the project and start the app in the iPhone emulator.

####In Visual Studio
1. Right-click the iOS project, and then click **Set as StartUp Project**.
2. On the **Build** menu, click **Configuration Manager**.
3. In the **Configuration Manager** dialog box, select the **Build** and **Deploy** checkboxes of the iOS project.
4. Press the **F5** key to build the project and start the app in the iPhone emulator.

	>[AZURE.NOTE] If you have problems building, run NuGet package manager and update to the latest version of the Xamarin support packages. Sometimes the Quickstart projects may lag behind in being updated to the latest.    

In the app, type meaningful text, such as _Learn Xamarin_ and then click the **+** button.

![][10]

This sends a POST request to the new mobile app backend hosted in Azure. Data from the request is inserted into the TodoItem table. Items stored in the table are returned by the mobile app backend, and the data is displayed in the list.

>[AZURE.NOTE]
> You'll find the code that accesses your mobile app backend in the TodoItemManager.cs C# file of the portable class library project of your solution.

##(Optional) Run the Android project

This section is for running the Xamarin droid project for Android. You can skip this section if you are not working with Android devices.

####In Xamarin Studio

1. Right-click the Android project, and then click **Set As Startup Project**.
2. On the **Run** menu, click **Start Debugging** to build the project and start the app in an Android emulator.

####In Visual Studio
1. Right-click the Android (Droid) project, and then click **Set as StartUp Project**.
4. On the **Build** menu, click **Configuration Manager**.
5. In the **Configuration Manager** dialog box, select the **Build** and **Deploy** checkboxes of the Android project.
6. Press the **F5** key to build the project and start the app in an Android emulator.

	>[AZURE.NOTE] If you have problems building, run NuGet package manager and update to the latest version of the Xamarin support packages. Sometimes the Quickstart projects may lag behind in being updated to the latest.    


In the app, type meaningful text, such as _Learn Xamarin_ and then click the **+** button.

![][11]

This sends a POST request to the new mobile app backend hosted in Azure. Data from the request is inserted into the TodoItem table. Items stored in the table are returned by the mobile app backend, and the data is displayed in the list.

> [AZURE.NOTE]
> You'll find the code that accesses your mobile app backend in the TodoItemManager.cs C# file of the portable class library project of your solution.


##(Optional) Run the Windows project


This section is for running the Xamarin WinApp project for Windows devices. You can skip this section if you are not working with Windows devices.


####In Visual Studio
1. Right-click any of the Windows projects, and then click **Set as StartUp Project**.
4. On the **Build** menu, click **Configuration Manager**.
5. In the **Configuration Manager** dialog box, select the **Build** and **Deploy** checkboxes of the Windows project that you chose.
6. Press the **F5** key to build the project and start the app in a Windows emulator.

	>[AZURE.NOTE] If you have problems building, run NuGet package manager and update to the latest version of the Xamarin support packages. Sometimes the Quickstart projects may lag behind in being updated to the latest.    


In the app, type meaningful text, such as _Learn Xamarin_ and then click the **+** button.

This sends a POST request to the new mobile app backend hosted in Azure. Data from the request is inserted into the TodoItem table. Items stored in the table are returned by the mobile app backend, and the data is displayed in the list.

![][12]

> [AZURE.NOTE]
> You'll find the code that accesses your mobile app backend in the TodoItemManager.cs C# file of the portable class library project of your solution.

##Next steps

* [Add authentication to your app](app-service-mobile-xamarin-forms-get-started-users.md)  
Learn how to authenticate users of your app with an identity provider.

* [Add push notifications to your app](app-service-mobile-xamarin-forms-get-started-push.md)  
Learn how to add push notifications support to your app and configure your Mobile App backend to use Azure Notification Hubs to send push notifications.

* [Enable offline sync for your app](app-service-mobile-xamarin-forms-get-started-offline-data.md)  
  Learn how to add offline support your app using an Mobile App backend. Offline sync allows end-users to interact with a mobile app&mdash;viewing, adding, or modifying data&mdash;even when there is no network connection.

* [How to use the managed client for Azure Mobile Apps](app-service-mobile-dotnet-how-to-use-client-library.md)  
Learn how to work with the managed client SDK in your Xamarin app. 


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

