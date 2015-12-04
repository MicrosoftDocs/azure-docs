<properties 
	pageTitle="Send cross-platform notifications to a specific user in iOS" 
	description="Learn how to send push notifications to all devices of a specific user."
	services="app-service\mobile,notification-hubs" 
	documentationCenter="ios" 
	authors="ysxu" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="app-service-mobile" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-dotnet" 
	ms.devlang="objective-c" 
	ms.topic="article" 
	ms.date="11/17/2015"
	ms.author="yuaxu"/>

# Send cross-platform notifications to a specific user

[AZURE.INCLUDE [app-service-mobile-selector-push-users](../../includes/app-service-mobile-selector-push-users.md)]
&nbsp;  
[AZURE.INCLUDE [app-service-mobile-note-mobile-services](../../includes/app-service-mobile-note-mobile-services.md)]

This topic shows you how to send notifications to all registered devices of a specific user from your mobile backend. It introduced the concept of [templates], which gives client applications the freedom of specifying payload formats and variable placeholders at registration. Send then hits every platform with these placeholders, enabling cross-platform notifications.

> [AZURE.NOTE] To get push working with cross-platform clients, you will need to complete this tutorial for each platform you would like to enable. You will only need to do the [mobile backend update](#backend) once for clients that share the same mobile backend.
 
##Prerequisites 

Before you start this tutorial, you must have already completed these App Service tutorials for each client platform you want working:

+ [Get started with authentication]<br/>Adds a login requirement to the TodoList sample app.

+ [Get started with push notifications]<br/>Configures the TodoList sample app for push notifications.

##<a name="client"></a>Update your client to register for templates to handle cross-platform pushes

1. Move the APNs registration snippets in **QSAppDelegate.m**'s **application:didFinishLaunchingWithOptions** to the call to **loginWithProvider** in **QSTodoListViewController.m** so it happens after authentication completes:

        [client loginWithProvider:@"facebook" controller:self animated:YES completion:^(MSUser *user, NSError *error) {
            [self refresh];
            
            // register iOS8 or previous devices for notifications
            if ([[UIApplication sharedApplication] respondsToSelector:@selector(registerUserNotificationSettings:)] && [[UIApplication sharedApplication] respondsToSelector:@selector(registerForRemoteNotifications)]) {
                [[UIApplication sharedApplication] registerForRemoteNotifications];
            }
            else {
                // Register for remote notifications
                [[UIApplication sharedApplication] registerForRemoteNotificationTypes:
                 UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound];
            }
        }];

2. Replace your **registerDeviceToken** call in **application:didRegisterForRemoteNotificationsWithDeviceToken** with the following to work with templates:

        NSDictionary *templates = @{
                               @"testNotificationTemplate": @{ @"body" : @{ @"aps" : @{ @"alert": @"$(message)" } } }
                               };
    
        // register with templates
        [client.push registerDeviceToken:deviceToken template:templates completion:^(NSError *error) {
            if (error != nil) {
                NSLog(@"Error registering for notifications: %@", error);
            }
        }];

	It is important that you authenticate the user before registering for push notifications. When an authenticated user registers for push notifications, a tag with the user ID is automatically added.

##<a name="backend"></a>Update your service backend to send notifications to a specific user

[AZURE.INCLUDE [app-service-mobile-push-notifications-to-users](../../includes/app-service-mobile-push-notifications-to-users.md)]

##<a name="test"></a>Test the app

Re-publish your mobile backend project and run any of the client apps you have set up. On item insertion, the backend will send notifications to all client apps where the user is logged in.

<!-- URLs. -->
[Get started with authentication]: app-service-mobile-ios-get-started-users.md
[Get started with push notifications]: app-service-mobile-ios-get-started-push.md
[templates]: https://msdn.microsoft.com/en-us/library/dn530748.aspx
 