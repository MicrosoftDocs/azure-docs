<properties 
	pageTitle="Get started with push (Android) | Mobile Dev Center" 
	description="Learn how to use Azure Mobile Services to send push notifications to your Android .Net app." 
	services="mobile-services, notification-hubs" 
	documentationCenter="android" 
	authors="RickSaling" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-android" 
	ms.devlang="java" 
	ms.topic="article" 
	ms.date="04/07/2015" 
	ms.author="ricksal"/>

# Add push notifications to your Mobile Services app

[AZURE.INCLUDE [mobile-services-selector-get-started-push](../includes/mobile-services-selector-get-started-push.md)]

This topic shows how to use Azure Mobile Services to send push notifications to your Android app. In this tutorial you add push notifications using Google Cloud Messaging (GCM) to the quickstart project. When complete, your mobile service will send a push notification each time a record is inserted. 

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete either [Get started with Mobile Services] or [Get started with data] to connect your project to the mobile service. As such, this tutorial also requires Visual Studio 2013. 

>[AZURE.NOTE] For the Eclipse version of this tutorial, see [Get started with push notifications (Eclipse)].
 
##<a id="register"></a>Enable Google Cloud Messaging

[AZURE.INCLUDE [mobile-services-enable-Google-cloud-messaging](../includes/mobile-services-enable-Google-cloud-messaging.md)]

##<a id="configure"></a>Configure your mobile service to send push requests

[AZURE.INCLUDE [mobile-services-android-configure-push](../includes/mobile-services-android-configure-push.md)]

##<a id="update-server"></a>Update the mobile service to send push notifications

[AZURE.INCLUDE [mobile-services-dotnet-backend-android-push-update-service](../includes/mobile-services-dotnet-backend-android-push-update-service.md)]

##<a name="update-app"></a>Add push notifications to your app

###Verify Android SDK Version

[AZURE.INCLUDE [mobile-services-verify-android-sdk-version](../includes/mobile-services-verify-android-sdk-version.md)]


Your next step is to install Google Play services. Google Cloud Messaging has some minimum API level requirements for development and testing, which the **minSdkVersion** property in the Manifest must conform to. 

If you will be testing with an older device, then consult [Set Up Google Play Services SDK] to determine how low you can set this value, and set it appropriately.

###Add Google Play Services to the project

[AZURE.INCLUDE [Add Play Services](../includes/mobile-services-add-Google-play-services.md)]

###Add code

[AZURE.INCLUDE [mobile-services-android-getting-started-with-push](../includes/mobile-services-android-getting-started-with-push.md)]

##<a name="test-app"></a>Test the app against the published mobile service

You can test the app by directly attaching an Android phone with a USB cable, or by using a virtual device in the emulator.

###<a id="local-testing"></a> Enable push notifications for local testing

[AZURE.INCLUDE [mobile-services-dotnet-backend-configure-local-push](../includes/mobile-services-dotnet-backend-configure-local-push.md)]

[AZURE.INCLUDE [mobile-services-android-push-notifications-test](../includes/mobile-services-android-push-notifications-test.md)]

You have successfully completed this tutorial.

## <a name="next-steps"> </a>Next steps

This tutorial demonstrated the basics of enabling an Android app to use Mobile Services and Notification Hubs to send push notifications. Next, consider completing the next tutorial, [Send push notifications to authenticated users], which shows how to use tags to send push notifications from your mobile service to only an authenticated user.

+ [Send push notifications to authenticated users]
	<br/>Learn how to use tags to send push notifications from a Mobile Service to only an authenticated user.

+ [Send broadcast notifications to subscribers]
	<br/>Learn how users can register and receive push notifications for categories they're interested in.

+ [Send template-based notifications to subscribers]
	<br/>Learn how to use templates to send push notifications from a Mobile Service, without having to craft platform-specific payloads in your back-end.

Learn more about Mobile Services and Notification Hubs in the following topics:

* [Add authentication to your app][Get started with authentication]
  <br/>Learn how to authenticate users of your app with different account types using mobile services.

* [What are Notification Hubs?]
  <br/>Learn more about how Notification Hubs works to deliver notifications to your apps across all major client platforms.

* [Debug Notification Hubs applications](http://go.microsoft.com/fwlink/p/?linkid=386630)
  </br>Get guidance troubleshooting and debugging Notification Hubs solutions. 

* [How to use the Android client library for Mobile Services]
  <br/>Learn more about how to use Mobile Services with Android.  
  
<!-- Anchors. -->

[Create a new mobile service]: #create-service
[Download the service locally]: #download-the-service-locally
[Test the mobile service]: #test-the-service
[Download the GetStartedWithData project]: #download-app
[Update the app to use the mobile service for data access]: #update-app
[Test the Android App against the service hosted locally]: #test-locally-hosted
[Publish the mobile service to Azure]: #publish-mobile-service
[Test the Android App against the service hosted in Azure]: #test-azure-hosted
[Test the app against the published mobile service]: #test-app
[Next Steps]:#next-steps

<!-- Images. -->

<!-- URLs. -->
[Get started with push notifications (Eclipse)]: mobile-services-dotnet-backend-android-get-started-push-EC.md
[Get started with Mobile Services]: mobile-services-dotnet-backend-android-get-started.md
[Get started with data]: mobile-services-dotnet-backend-android-get-started-data.md
[Get started with authentication]: mobile-services-dotnet-backend-android-get-started-users.md
[Management Portal]: https://manage.windowsazure.com/
[Mobile Services SDK]: http://go.microsoft.com/fwlink/p/?LinkId=257545

[How to use the Android client library for Mobile Services]: mobile-services-android-how-to-use-client-library.md

[Send push notifications to authenticated users]: mobile-services-dotnet-backend-android-push-notifications-app-users.md

[What are Notification Hubs?]: notification-hubs-overview.md
[Send broadcast notifications to subscribers]: notification-hubs-windows-store-dotnet-send-breaking-news.md
[Send template-based notifications to subscribers]: notification-hubs-windows-store-dotnet-send-localized-breaking-news.md
[Azure Management Portal]: https://manage.windowsazure.com/
