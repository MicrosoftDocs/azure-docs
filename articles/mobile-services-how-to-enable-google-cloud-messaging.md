<properties pageTitle="How to enable Google Cloud Messaging" description="Follow this tutorial to create a new service using Azure Mobile Services." services="mobile-services, notification-hubs" documentationCenter="android" authors="ggailey777" manager="dwrede" editor=""/>

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-android" ms.devlang="multiple" ms.topic="article" ms.date="11/21/2014" ms.author="glenga"/>

# How to enable Google Cloud Messaging

This topic shows you how to enable your Android app for push notifications by using Google Cloud Messaging (GCM). The API key obtained is used to register the Android app for push notifications in the [Azure Management Portal][Management Portal]. For the complete end-to-end tutorial that includes updates to your app, see [Get started with push notifications]. 

[WACOM.INCLUDE [Enable GCM](../includes/mobile-services-enable-Google-cloud-messaging.md)]

Now, you can use this API key value to enable services to authenticate with GCM and send push notifications on behalf of your app.

<!-- Anchors. -->


<!-- Images. -->


<!-- URLs. -->
[Get started with push notifications]: /en-us/documentation/articles/mobile-services-javascript-backend-android-get-started-push/
[Visual Studio 2012 Express for Windows Phone]: https://go.microsoft.com/fwLink/p/?LinkID=268374
[Mobile Services SDK]: https://go.microsoft.com/fwLink/p/?LinkID=268375

[Management Portal]: https://manage.windowsazure.com/
[.NET backend version]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-phone-get-started
