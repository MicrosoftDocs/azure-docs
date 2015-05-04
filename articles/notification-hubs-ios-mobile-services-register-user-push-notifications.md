<properties 
	pageTitle="Register current user for push notifications using a mobile service - Notification Hubs" 
	description="Learn how to request push notification registration in an iOS app with Azure Notification Hubs when registeration is performed by Azure Mobile Services." 
	services="notification-hubs" 
	documentationCenter="ios" 
	authors="ysxu" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="ios" 
	ms.devlang="objective-c" 
	ms.topic="article" 
	ms.date="04/24/2015" 
	ms.author="yuaxu"/>

# Register the current user for push notifications by using a mobile service

<div class="dev-center-tutorial-selector sublanding">
    <a href="/documentation/articles/notification-hubs-windows-store-mobile-services-register-user-push-notifications/" title="Windows Store C#">Windows Store C#</a><a href="/documentation/articles/notification-hubs-ios-mobile-services-register-user-push-notifications/" title="iOS" class="current">iOS</a>
</div>

This topic shows you how to request push notification registration with Azure Notification Hubs when registration is performed by Azure Mobile Services. This topic extends the tutorial [Notify users with Notification Hubs]. You must have already completed the required steps in that tutorial to create the authenticated mobile service. For more information on the notify users scenario, see [Notify users with Notification Hubs].  

1. In Xcode, open the QSTodoService.h file in the project that you created when you completed the prerequisite tutorial [Get started with authentication], and add the following **deviceToken** property:

		@property (nonatomic) NSData* deviceToken;

 	This property stores the device token.

2. In the QSTodoService.m file, add the following **getDeviceTokenInHex** method:

			- (NSString*)getDeviceTokenInHex {
			    const unsigned *tokenBytes = [[self deviceToken] bytes];
			    NSString *hexToken = [NSString stringWithFormat:@"%08X%08X%08X%08X%08X%08X%08X%08X",
			                          ntohl(tokenBytes[0]), ntohl(tokenBytes[1]), ntohl(tokenBytes[2]),
			                          ntohl(tokenBytes[3]), ntohl(tokenBytes[4]), ntohl(tokenBytes[5]),
			                          ntohl(tokenBytes[6]), ntohl(tokenBytes[7])];
			    return hexToken;
			}

	This method converts the device token to a hex string value.

3. In the QSAppDelegate.m file, add the following lines of code to the **didFinishLaunchingWithOptions** method:

			[[UIApplication sharedApplication] registerForRemoteNotificationTypes: UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound];

	This enables push notifications in your app.

4. 	In the QSAppDelegate.m file, add the following method:

			- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
			    [QSTodoService defaultService].deviceToken = deviceToken;
			}

	This updates the **deviceToken** property.

	> [AZURE.NOTE] At this point, there should not be any other code in this method. If you already have a call to the **registerNativeWithDeviceToken** method that was added when you completed the [Get Started with Notification Hubs](/manage/services/notification-hubs/get-started-notification-hubs-ios/"%20target="_blank") tutorial, you must comment-out or remove that call.

5.  (Optional) In the QSAppDelegate.m file, add the following handler method:

			- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
			    NSLog(@"%@", userInfo);
			    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Notification" message:
			                          [[userInfo objectForKey:@"aps"] valueForKey:@"alert"] delegate:nil cancelButtonTitle:
			                          @"OK" otherButtonTitles:nil, nil];
			    [alert show];
			}

 	This method displays an alert in the UI when your app receives notifications while it is running.

6. In the QSTodoListViewController.m file, add the **registerForNotificationsWithBackEnd** method:

			- (void)registerForNotificationsWithBackEnd {
			    NSString* json = [NSString  stringWithFormat:@"{\"platform\":\"ios\", \"deviceToken\":\"%@\"}", [self.todoService getDeviceTokenInHex] ];

			    [self.todoService.client invokeAPI:@"register_notifications" data:[json dataUsingEncoding:NSUTF8StringEncoding] HTTPMethod:@"POST" parameters:nil headers:nil completion:^(id result, NSHTTPURLResponse *response, NSError *error) {
			        if (error != nil) {
			            NSLog(@"Registration failed: %@", error);
			        } else {
			            // display UIAlert with successful login
			            UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Back-end registration" message:@"Registration successful" delegate:nil cancelButtonTitle: @"OK" otherButtonTitles:nil, nil];
			            [alert show];
			        }
			    }];
			}

	This method constructs a json payload that contains the device token. It then calls the custom API in your Mobile Service to register for notification. This method creates a device token for push notifications and sends it, along with the device type, to the custom API method that creates a registration in Notification Hubs. This custom API was defined in [Notify users with Notification Hubs].

7.	Finally, in the **viewDidAppear** method, add a call to this the new **registerForNotificationsWithBackEnd** method after the user successfully authenticates, as in the following example:

			- (void)viewDidAppear:(BOOL)animated
			{
			    MSClient *client = self.todoService.client;

			    if (client.currentUser != nil) {
			        return;
			    }

			    [client loginWithProvider:@"microsoftaccount" controller:self animated:YES completion:^(MSUser *user, NSError *error) {
			        [self refresh];
			        [self registerForNotificationsWithBackEnd];
			    }];
			}

	> [AZURE.NOTE] This makes sure that registration is requested every time that the page is loaded. In your app, you may only want to make this registration periodically to ensure that the registration is current.
	
Now that the client app has been updated, return to the [Notify users with Notification Hubs] and update the mobile service to send notifications by using Notification Hubs.

<!-- Anchors. -->

<!-- Images. -->


<!-- URLs. -->
[Notify users with Notification Hubs]: /manage/services/notification-hubs/notify-users
[Get started with authentication]: /develop/mobile/tutorials/get-started-with-users-ios/

[Azure Management Portal]: https://manage.windowsazure.com/
[Get Started with Notification Hubs]: /manage/services/notification-hubs/get-started-notification-hubs-ios/
