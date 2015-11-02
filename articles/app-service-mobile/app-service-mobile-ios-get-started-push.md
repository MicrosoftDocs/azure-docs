<properties
	pageTitle="Add Push Notifications to iOS App with Azure  Mobile Apps"
	description="Learn how to use Azure Mobile Apps to send push notifications to your iOS app."
	services="app-service\mobile"
	documentationCenter="ios"
	manager="dwrede"
	editor=""
	authors="krisragh"/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-ios"
	ms.devlang="objective-c"
	ms.topic="article"
	ms.date="08/22/2015"
	ms.author="krisragh"/>


# Add Push Notifications to your iOS App

[AZURE.INCLUDE [app-service-mobile-selector-get-started-push](../../includes/app-service-mobile-selector-get-started-push.md)]
&nbsp;  
[AZURE.INCLUDE [app-service-mobile-note-mobile-services](../../includes/app-service-mobile-note-mobile-services.md)]

In this tutorial, you add push notifications to the [iOS quick start] project so that every time a record is inserted, a push notification is sent. This tutorial is based on the [iOS quick start] tutorial, which you must complete first. If you do not use the downloaded quick start server project, you must add the push notification extension package to your project. For more information about server extension packages, see [Work with the .NET backend server SDK for Azure Mobile Apps](app-service-mobile-dotnet-backend-how-to-use-server-sdk.md). 

The [iOS simulator does not support push notifications](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/iOS_Simulator_Guide/TestingontheiOSSimulator.html), so for this tutorial, you need a physical iOS device and an [Apple Developer Program membership](https://developer.apple.com/programs/ios/). 

## <a id="register"></a>Register app for push notifications

[AZURE.INCLUDE [Enable Apple Push Notifications](../../includes/enable-apple-push-notifications.md)]

## Configure Azure to send push notifications

[AZURE.INCLUDE [app-service-mobile-apns-configure-push](../../includes/app-service-mobile-apns-configure-push.md)]

##<a id="update-server"></a>Update server project to send push notifications

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-configure-push-apns](../../includes/app-service-mobile-dotnet-backend-configure-push-apns.md)]

## <a name="publish-the-service"></a>Deploy server project to Azure

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-publish-service](../../includes/app-service-mobile-dotnet-backend-publish-service.md)]

## <a id="add-push"></a>Add push notifications to app

[AZURE.INCLUDE [Add Push Notifications to App](../../includes/app-service-add-push-notifications-to-app.md)]

## <a id="test"></a>Test push notifications in app

[AZURE.INCLUDE [Test Push Notifications in App](../../includes/test-push-notifications-in-app.md)]

<!-- Anchors.  -->
[Generate iOS certificate signing request]: #certificates
[Register your app and enable push notifications]: #register
[Create a provisioning profile for the app]: #profile
[Add push notifications to the app]: #add-push
[Configure your mobile backend to send push requests]: #configure
[Update the server to send push notifications]: #update-server
[Publish the mobile backend to Azure]: #publish-mobile-service
[Test your app]: #test-the-service

<!-- Images. -->

<!-- URLs. -->
[iOS quick start]: app-service-mobile-ios-get-started.md
