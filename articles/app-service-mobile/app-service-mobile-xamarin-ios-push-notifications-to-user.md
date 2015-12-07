<properties 
	pageTitle="Send push notifications to a specific user with Xamarin iOS client" 
	description="Learn how to send push notifications to all devices of a user" 
	services="app-service\mobile,notification-hubs" 
	documentationCenter="windows" 
	authors="ysxu" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="app-service-mobile" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-xamarin-ios" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="12/01/2015"
	ms.author="yuaxu"/>

# Send cross-platform notifications to a specific user

[AZURE.INCLUDE [app-service-mobile-selector-push-users](../../includes/app-service-mobile-selector-push-users.md)]
&nbsp;  
[AZURE.INCLUDE [app-service-mobile-note-mobile-services](../../includes/app-service-mobile-note-mobile-services.md)]

This topic shows you how to send notifications to all registered devices of a specific user from your mobile backend. It introduces [templates], which give client applications the freedom of specifying payload formats and variable placeholders at registration. When a template notification is sent from a server, the notification hub directs it every platform with these placeholders, enabling cross-platform notifications.

> [AZURE.NOTE] To get push working with cross-platform clients, you will need to complete this tutorial for each platform you would like to enable. You will only need to do the [mobile backend update](#backend) once for clients that share the same mobile backend.
 
##Prerequisites 

Before you start this tutorial, you must have already completed these App Service tutorials for each client platform you want working:

+ [Get started with authentication]<br/>Adds a login requirement to the TodoList sample app.

+ [Get started with push notifications]<br/>Configures the TodoList sample app for push notifications.

##<a name="client"></a>Update your client to register for templates to handle cross-platform pushes

+ Move the APNS registration snippets from **FinishedLaunching** in **AppDelegate.cs** to the **RefreshAsync** Task definition in **QSTodoListViewController.cs**. 

        ...
        if (todoService.User == null) {
            await QSTodoService.DefaultService.Authenticate (this);
            if (todoService.User == null) {
                Console.WriteLine ("couldn't login!!");
                return;
            }

            // registers for push for iOS8
            var settings = UIUserNotificationSettings.GetSettingsForTypes (
                UIUserNotificationType.Alert
                | UIUserNotificationType.Badge
                | UIUserNotificationType.Sound, 
                new NSSet ());

            UIApplication.SharedApplication.RegisterUserNotificationSettings (settings); 
            UIApplication.SharedApplication.RegisterForRemoteNotifications ();
        }
        ...

	This makes sure that the user is authenticated before registering for push notifications. When an authenticated user registers for push notifications, a tag with the user ID is automatically added.

##<a name="backend"></a>Update your service backend to send notifications to a specific user

[AZURE.INCLUDE [app-service-mobile-push-notifications-to-users](../../includes/app-service-mobile-push-notifications-to-users.md)]

##<a name="test"></a>Test the app

Re-publish your mobile backend project and run any of the client apps you have set up. On item insertion, the backend will send notifications to all client apps where the user is logged in.

<!-- URLs. -->
[Get started with authentication]: app-service-mobile-xamarin-ios-get-started-users.md
[Get started with push notifications]: app-service-mobile-xamarin-ios-get-started-push.md
[templates]: ../notification-hubs/notification-hubs-templates.md 