<properties 
	pageTitle="Add push notifications to your Xamarin.Android app with Azure App Service" 
	description="Learn how to use Azure App Service to send push notifications to your Xamarin.Android app" 
	services="app-service\mobile" 
	documentationCenter="xamarin" 
	authors="normesta"
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="app-service-mobile" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-xamarin-android" 
	ms.devlang="dotnet" 
	ms.topic="article"
	ms.date="07/30/2015" 
	ms.author="normesta"/>

# Add push notifications to your Xamarin.Android App

[AZURE.INCLUDE [app-service-mobile-selector-get-started-push-preview](../../includes/app-service-mobile-selector-get-started-push-preview.md)]

[AZURE.INCLUDE [app-service-mobile-note-mobile-services-preview](../../includes/app-service-mobile-note-mobile-services-preview.md)]

In this tutorial, you add push notifications to the [Xamarin.Android quick start] project so that every time a record is inserted, a push notification is sent. This tutorial is based on the [Xamarin.Android quick start] tutorial, which you must complete first. 

You'll need the following to complete this tutorial:

+ An active Google account.
+ [Google Cloud Messaging Client Component]. You will add this component during the tutorial.
+ An active Azure account. 

    If you don't have an account yet, sign up for an Azure trial and get up to 10 free mobile apps. You can keep using them even after your trial ends. See [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/).

    >[AZURE.NOTE] If you want to get started with mobile apps before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751&appServiceName=mobile). You can create a short-lived starter mobile app  immediately. No credit cards required; no commitments.

+ [Xamarin Studio] or Visual Studio. 

    If you use Visual Studio, use <a href="https://www.visualstudio.com/en-us/visual-studio-homepage-vs.aspx" target="_blank">Visual Studio 2015 (any edition)</a> or <a href="https://go.microsoft.com/fwLink/p/?LinkID=257546" target="_blank">Visual Studio Professional 2013</a>.


##<a id="register"></a>Enable Google Cloud Messaging

[AZURE.INCLUDE [Enable GCM](../../includes/mobile-services-enable-Google-cloud-messaging.md)]

##<a id="configure"></a>Configure your mobile app to send push requests

[AZURE.INCLUDE [mobile-app-android-configure-push](../../includes/app-service-mobile-android-configure-push.md)]

##<a id="update-server"></a>Update the mobile service to send push notifications

[AZURE.INCLUDE [mobile-services-dotnet-backend-android-push-update-service](../../includes/mobile-services-dotnet-backend-android-push-update-service.md)]

##<a id="configure-app"></a>Configure the existing project for push notifications

[AZURE.INCLUDE [mobile-services-xamarin-android-push-configure-project](../../includes/mobile-services-xamarin-android-push-configure-project.md)]

##<a id="add-push"></a>Add push notifications code to your app

[AZURE.INCLUDE [mobile-services-xamarin-android-push-add-to-app](../../includes/mobile-services-xamarin-android-push-add-to-app.md)]

##<a name="test-app"></a>Test the app against the published mobile service

You can test the app by directly attaching an Android phone with a USB cable, or by using a virtual device in the emulator.

###<a id="local-testing"></a> Enable push notifications for local testing

[AZURE.INCLUDE [mobile-services-dotnet-backend-configure-local-push](../../includes/mobile-services-dotnet-backend-configure-local-push.md)]

[AZURE.INCLUDE [mobile-services-android-push-notifications-test](../../includes/mobile-services-android-push-notifications-test.md)]



You have successfully completed this tutorial.

<!-- URLs. -->
[Get started with Mobile Services]: mobile-services-dotnet-backend-xamarin-android-get-started.md
[Google Cloud Messaging Client Component]: http://components.xamarin.com/view/GCMClient/
[Xamarin.Android]: http://xamarin.com/download/
[Xamarin.Android quick start]: app-service-mobile-dotnet-backend-xamarin-android-get-started-preview.md

 