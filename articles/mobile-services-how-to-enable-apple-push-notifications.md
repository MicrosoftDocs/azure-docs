<properties pageTitle="How to enable Apple push notifications" metaKeywords="" description="Follow this tutorial to create a new service using Azure Mobile Services." metaCanonical="" services="mobile-services, notification-hubs" documentationCenter="ios" title="" authors="ggailey777" solutions="" manager="dwrede" editor=""/>

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-ios" ms.devlang="multiple" ms.topic="article" ms.date="11/21/2014" ms.author="glenga" />

# How to enable Apple push notifications

This topic shows you how to enable your iOS app for push notifications by using the Apple Push Notification Service (APNS). The certificate obtained is used to register the iOS app for push notifications in the [Azure Management Portal][Management Portal]. For the complete end-to-end tutorial that includes updates to your app, see [Get started with push notifications]. 

[AZURE.INCLUDE [Enable Apple Push Notifications](../includes/enable-apple-push-notifications.md)]

Now, you can use this .p12 certificate to enable services to authenticate with APNS and send push notifications on behalf of your app.

<!-- Anchors. -->


<!-- Images. -->


<!-- URLs. -->
[Get started with push notifications]: /en-us/documentation/articles/mobile-services-javascript-backend-ios-get-started-push/
[Mobile Services SDK]: https://go.microsoft.com/fwLink/p/?LinkID=268375

[Management Portal]: https://manage.windowsazure.com/

