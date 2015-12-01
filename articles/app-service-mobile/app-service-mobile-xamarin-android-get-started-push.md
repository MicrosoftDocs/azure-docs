<properties
	pageTitle="Add push notifications to your Xamarin.Android app with Azure App Service"
	description="Learn how to use Azure App Service and Azure Notification Hubs to send push notifications to your Xamarin.Android app"
	services="app-service\mobile" 
	documentationCenter="xamarin" 
	authors="ggailey777"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-xamarin-android"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="11/24/2015" 
	ms.author="glenga"/>

# Add push notifications to your Xamarin.Android app

[AZURE.INCLUDE [app-service-mobile-selector-get-started-push](../../includes/app-service-mobile-selector-get-started-push.md)]
&nbsp;  
[AZURE.INCLUDE [app-service-mobile-note-mobile-services](../../includes/app-service-mobile-note-mobile-services.md)]

##Overview

In this tutorial, you add push notifications to the [Xamarin.Android quickstart] project so that every time a record is inserted, a push notification is sent. This tutorial is based on the [Xamarin.Android quickstart] tutorial, which you must complete first. If you do not use the downloaded quick start server project, you must add the push notification extension package to your project. For more information about server extension packages, see [Work with the .NET backend server SDK for Azure Mobile Apps](app-service-mobile-dotnet-backend-how-to-use-server-sdk.md).

##Prerequisites

This tutorial requires the following:

+ An active Google account. You can sign up for a Google account at [accounts.google.com](http://go.microsoft.com/fwlink/p/?LinkId=268302).
   
+ [Google Cloud Messaging Client Component](http://components.xamarin.com/view/GCMClient/). You will add this component during the tutorial.

+ Completed [Xamarin.Android quickstart] tutorial.


##<a name="create-hub"></a>Create a Notification Hub

[AZURE.INCLUDE [app-service-mobile-create-notification-hub](../../includes/app-service-mobile-create-notification-hub.md)]

##<a id="register"></a>Enable Google Cloud Messaging

[AZURE.INCLUDE [Enable GCM](../../includes/mobile-services-enable-google-cloud-messaging.md)]

##Configure the Mobile App backend to send push requests

[AZURE.INCLUDE [app-service-mobile-android-configure-push](../../includes/app-service-mobile-android-configure-push.md)]

##<a id="update-server"></a>Update the server project to send push notifications

[AZURE.INCLUDE [app-service-mobile-update-server-project-for-push-template](../../includes/app-service-mobile-update-server-project-for-push-template.md)]

##<a id="configure-app"></a>Configure the client project for push notifications

[AZURE.INCLUDE [mobile-services-xamarin-android-push-configure-project](../../includes/mobile-services-xamarin-android-push-configure-project.md)]

##<a id="add-push"></a>Add push notifications code to your app

[AZURE.INCLUDE [app-service-mobile-xamarin-android-push-add-to-app](../../includes/app-service-mobile-xamarin-android-push-add-to-app.md)]

## <a name="test"></a>Test push notifications in your app

You can test the app by directly attaching an Android phone with a USB cable, or by using a virtual device in the emulator. There are additional configuration steps required when running on an emulator.

[AZURE.INCLUDE [mobile-services-android-push-notifications-test](../../includes/mobile-services-android-push-notifications-test.md)]


<!-- URLs. -->
[Xamarin.Android quickstart]: app-service-mobile-xamarin-android-get-started.md

[Google Cloud Messaging Client Component]: http://components.xamarin.com/view/GCMClient/
[Xamarin.Android]: http://xamarin.com/download/
[Azure Mobile Services Component]: http://components.xamarin.com/view/azure-mobile-services/
