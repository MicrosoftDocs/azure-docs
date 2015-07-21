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
	ms.topic="get-started-article"
	ms.date="07/20/2015"
	ms.author="chrande"/>

# <a name="getting-started"> </a>Create a Xamarin.Android App

[AZURE.INCLUDE [app-service-mobile-selector-get-started-preview](../../includes/app-service-mobile-selector-get-started-preview.md)]

This tutorial shows you how to connect a Xamarin.Android app to a cloud-based backend service by using Azure Mobile Apps. You'll start by creating a new .NET service. Then, you'll create a basic _To do list_ task tracking app that stores tasks to the .NET backend.

When your done, your app will look like this:  

![][0]

You'll have to complete this tutorial before you try all the other tutorials for Xamarin.Android apps. But first, you'll need these things:

* An active Azure account. 

    If you don't have an account yet, sign up for an Azure trial and get up to 10 free mobile apps. You can keep using them even after your trial ends. See [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/).

* <a href="https://www.visualstudio.com/en-us/visual-studio-homepage-vs.aspx" target="_blank">Visual Studio 2015 (any edition)</a> or <a href="https://go.microsoft.com/fwLink/p/?LinkID=257546" target="_blank">Visual Studio Professional 2013</a>, and [Xamarin] installed on your local computer or virtual machine. 

>[AZURE.NOTE] If you want to get started with mobile apps before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751&appServiceName=mobile). You can create a short-lived starter mobile app  immediately. No credit cards required; no commitments.

## Create a new mobile app backend

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-create-new-service-preview](../../includes/app-service-mobile-dotnet-backend-create-new-service-preview.md)]

## Create a Xamarin.Android app

Follow a basic quickstart on the [Azure Portal] to create an app or modify one, and then connect it to your mobile backend.

To get started, download a .NET backend service project for your mobile app and a new Xamarin.Android app. Here's how you do it.

1. In the Azure Portal, click **Browse All**, then **Mobile Apps**, and then click the mobile app that you just created.

2. At the top of the blade, click **Add Client** and expand **Xamarin.Android**.

    ![][6]

    This displays the three things you need to do to create a Xamarin.Android app that's connected to your mobile app backend.


###Download, run, and publish the mobile backend project

5. Under **Download and run your service project**, click the **Download** button.

  	This downloads a project that contains the mobile app backend code. Save the compressed project file to your local computer and make a note of where you saved it.


[AZURE.INCLUDE [app-service-mobile-dotnet-backend-test-local-service-preview](../../includes/app-service-mobile-dotnet-backend-test-local-service-preview.md)]


[AZURE.INCLUDE [app-service-mobile-dotnet-backend-publish-service-preview](../../includes/app-service-mobile-dotnet-backend-publish-service-preview.md)]

### Download and run the Xamarin.Android app

5. Under **Download and run your Xamarin.Android project**, click the **Download** button.

  	This downloads a project that contains a client application that is connected to your mobile app. Save the compressed project file to your local computer, and make a note of where you save it.



	![][8]

	![][9]

2. Press the **F5** key to build the project and start the app. 

	> [AZURE.NOTE] To be able to run the project in the Android emulator, you must define a least one Android Virtual Device (AVD). Use the AVD Manager to create and manage these devices.

3. In the app, type meaningful text, such as _Complete the tutorial_ and then click the **Add** button.

	![][10]

	This sends a POST request to the new mobile app backend hosted in Azure. Data from the request is inserted into the TodoItem table. Items stored in the table are returned by the mobile app backend, and the data appears in the list.

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
[Xamarin]: http://xamarin.com/download
[Xcode]: https://go.microsoft.com/fwLink/?LinkID=266532&clcid=0x409
[Xamarin for Windows]: https://go.microsoft.com/fwLink/?LinkID=330242&clcid=0x409
 