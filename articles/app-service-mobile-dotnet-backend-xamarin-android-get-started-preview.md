<properties
	pageTitle="Get Started with Azure Mobile Apps for Xamarin Android apps - Azure Mobile App"
	description="Follow this tutorial to get started using Azure Mobile Apps for Xamarin Android development"
	services="app-service\mobile"
	documentationCenter="xamarin"
	authors="chrisanderson"
	manager="dwrede"
	editor="mollybos"/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-xamarin-android"
	ms.devlang="dotnet"
	ms.topic="hero-article"
	ms.date="05/01/2015"
	ms.author="chrande"/>

# <a name="getting-started"> </a>Create a Xamarin Android App

[AZURE.INCLUDE [app-service-mobile-selector-get-started-preview](../includes/app-service-mobile-selector-get-started-preview.md)]

This tutorial shows you how to add a cloud-based backend service to a Xamarin Android app with Azure Mobile App. In this tutorial, you will create both a new .NET service and a simple _To do list_ app that stores app data in the .NET backend.

A screenshot from the completed app is below:

![][0]

Completing this tutorial is a prerequisite for all other Azure Mobile Apps tutorials for Xamarin Android apps.

To complete this tutorial, you need the following:

* An active Azure account. If you don't have an account, you can sign up for an Azure trial and get up to 10 free mobile apps that you can keep using even after your trial ends. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/).
* <a href="https://go.microsoft.com/fwLink/p/?LinkID=257546" target="_blank">Visual Studio Professional 2013</a>.

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751&appServiceName=mobile), where you can immediately create a short-lived starter mobile app in App Service. No credit cards required; no commitments.

## Create a new mobile app backend

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-create-new-service-preview](../includes/app-service-mobile-dotnet-backend-create-new-service-preview.md)]

## Create a new Xamarin Android app

Once you have created your mobile app backend, you can follow an easy quickstart in the [Azure Portal] to either create a new app or modify an existing app to connect to your mobile app backend.

In this tutorial, you will download a new Xamarin Android app and a .NET backend service project for your mobile app.

1. In the Azure Portal, click **browse**, then **Mobile Apps**, and then click the mobile app that you just created.

2. At the top of the blade, click **Add Client** and expand **Xamarin.Android**.

    ![][6]

    This displays the three easy steps to create a Xamarin Android app connected to your mobile app backend.


3. If you haven't already done so, download and install <a href="https://go.microsoft.com/fwLink/p/?LinkID=257546" target="_blank">Visual Studio Professional 2013</a> on your local computer or virtual machine.  

4. If you haven't already done so, download and install [Xamarin Studio]. You can also use Xamarin for Visual Studio.

5. Under **Download and publish your service to the cloud**, click **Download**.

  	This downloads a solution contains projects for both the mobile app backend code and for the sample _To do list_ client application that is connected to your mobile app backend. Save the compressed project file to your local computer, and make a note of where you save it.

6. Download your publish profile, save the downloaded file to your local computer, and make a note of where you save it.

## Test the mobile app backend

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-test-local-service-preview](../includes/app-service-mobile-dotnet-backend-test-local-service-preview.md)]

## Publish your mobile app backend

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-publish-service-preview](../includes/app-service-mobile-dotnet-backend-publish-service-preview.md)]

## Run the Xamarin Android app

The final stage of this tutorial is to build and run your new app.

1. Navigate to the client project within the mobile app solution, in either Visual Studio or Xamarin Studio.

	![][8]

	![][9]

2. Press the **Run** button to build the project and start the app. You will be asked to select an emulator or a connected USB device.

	> [AZURE.NOTE] To be able to run the project in the Android emulator, you must define a least one Android Virtual Device (AVD). Use the AVD Manager to create and manage these devices.

3. In the app, type meaningful text, such as _Complete the tutorial_ and then click the plus (**+**) icon.

	![][10]

	This sends a POST request to the new mobile app backend hosted in Azure. Data from the request is inserted into the TodoItem table. Items stored in the table are returned by the mobile app backend, and the data is displayed in the list.

	> [AZURE.NOTE]
   	> You can review the code that accesses your mobile app backend to query and insert data, which is found in the ToDoActivity.cs C# file.



<!-- Images. -->
[0]: ./media/app-service-mobile-dotnet-backend-xamarin-android-get-started-preview/mobile-quickstart-completed-android.png
[6]: ./media/app-service-mobile-dotnet-backend-xamarin-android-get-started-preview/mobile-portal-quickstart-xamarin.png
[8]: ./media/app-service-mobile-dotnet-backend-xamarin-android-get-started-preview/mobile-xamarin-project-android-vs.png
[9]: ./media/app-service-mobile-dotnet-backend-xamarin-android-get-started-preview/mobile-xamarin-project-android-xs.png
[10]: ./media/app-service-mobile-dotnet-backend-xamarin-android-get-started-preview/mobile-quickstart-startup-android.png

<!-- URLs. -->
[Azure Portal]: https://azure.portal.com/
[Xamarin Studio]: http://xamarin.com/download
[Xcode]: https://go.microsoft.com/fwLink/?LinkID=266532&clcid=0x409
[Xamarin for Windows]: https://go.microsoft.com/fwLink/?LinkID=330242&clcid=0x409
