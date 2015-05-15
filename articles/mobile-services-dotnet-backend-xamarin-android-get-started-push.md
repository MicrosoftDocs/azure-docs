<properties 
	pageTitle="Get Started with Mobile Services for Xamarin Android apps - Azure Mobile Services" 
	description="Learn how to use Azure Mobile Services and Notification Hubs to send push notifications to your Xamarin Android app" 
	services="mobile-services" 
	documentationCenter="xamarin" 
	authors="ggailey777" 
	manager="dwrede" 
	editor="mollybos"/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-xamarin-android" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="04/09/2015" 
	ms.author="glenga"/>

# Add push notifications to your Mobile Services app

[AZURE.INCLUDE [mobile-services-selector-get-started-push](../includes/mobile-services-selector-get-started-push.md)]

This topic shows you how to use Azure Mobile Services to send push notifications to a Xamarin.Android app. In this tutorial you add push notifications using the Google Cloud Messaging (GCM) service to the [Get started with Mobile Services] project. When complete, your mobile service will send a push notification each time a record is inserted.

This tutorial walks you through these basic steps to enable push notifications:

1. [Enable Google Cloud Messaging](#register)
2. [Configure Mobile Services](#configure)
3. [Configure the project for push notifications](#configure-app)
4. [Add push notifications code to your app](#add-push)
5. [Insert data to receive notifications](#test)

This tutorial requires the following:

+ An active Google account.
+ [Google Cloud Messaging Client Component]. You will add this component during the tutorial.

You should already have the [Xamarin.Android] and [Azure Mobile Services][Azure Mobile Services Component] components installed in your project from when you completed [Get started with Mobile Services].

##<a id="register"></a>Enable Google Cloud Messaging

[AZURE.INCLUDE [Enable GCM](../includes/mobile-services-enable-Google-cloud-messaging.md)]

##<a id="configure"></a>Configure your mobile service to send push requests

[AZURE.INCLUDE [mobile-services-android-configure-push](../includes/mobile-services-android-configure-push.md)]

##<a id="update-server"></a>Update the mobile service to send push notifications

[AZURE.INCLUDE [mobile-services-dotnet-backend-android-push-update-service](../includes/mobile-services-dotnet-backend-android-push-update-service.md)]

##<a id="configure-app"></a>Configure the existing project for push notifications

[AZURE.INCLUDE [mobile-services-xamarin-android-push-configure-project](../includes/mobile-services-xamarin-android-push-configure-project.md)]

##<a id="add-push"></a>Add push notifications code to your app

[AZURE.INCLUDE [mobile-services-xamarin-android-push-add-to-app](../includes/mobile-services-xamarin-android-push-add-to-app.md)]

##<a name="test-app"></a>Test the app against the published mobile service

You can test the app by directly attaching an Android phone with a USB cable, or by using a virtual device in the emulator.

###<a id="local-testing"></a> Enable push notifications for local testing

[AZURE.INCLUDE [mobile-services-dotnet-backend-configure-local-push](../includes/mobile-services-dotnet-backend-configure-local-push.md)]

[AZURE.INCLUDE [mobile-services-android-push-notifications-test](../includes/mobile-services-android-push-notifications-test.md)]

<!-- URLs. -->
[Get started with Mobile Services]: mobile-services-dotnet-backend-xamarin-android-get-started.md


[Google Cloud Messaging Client Component]: http://components.xamarin.com/view/GCMClient/
[Xamarin.Android]: http://xamarin.com/download/
[Azure Mobile Services Component]: http://components.xamarin.com/view/azure-mobile-services/