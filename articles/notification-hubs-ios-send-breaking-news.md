<properties 
	pageTitle="Notification Hubs Breaking News Tutorial - iOS" 
	description="Learn how to use Azure Service Bus Notification Hubs to send breaking news notifications to iOS devices." 
	services="notification-hubs" 
	documentationCenter="ios" 
	authors="wesmc7777" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="notification-hubs" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="" 
	ms.devlang="objective-c" 
	ms.topic="article" 
	ms.date="02/26/2015" 
	ms.author="wesmc"/>

# Use Notification Hubs to send breaking news
<div class="dev-center-tutorial-selector sublanding">
	<a href="/documentation/articles/notification-hubs-windows-store-dotnet-send-breaking-news/" title="Windows Universal" >Windows Universal</a><a href="/documentation/articles/notification-hubs-windows-phone-send-breaking-news/" title="Windows Phone">Windows Phone</a><a href="/documentation/articles/notification-hubs-ios-send-breaking-news/" title="iOS" class="current">iOS</a>
	<a href="/documentation/articles/notification-hubs-aspnet-backend-android-breaking-news/" title="Android">Android</a>
</div>

##Overview

This topic shows you how to use Azure Notification Hubs to broadcast breaking news notifications to an iOS app. When complete, you will be able to register for breaking news categories you are interested in, and receive only push notifications for those categories. This scenario is a common pattern for many apps where notifications have to be sent to groups of users that have previously declared interest in them, e.g. RSS reader, apps for music fans, etc.

Broadcast scenarios are enabled by including one or more _tags_ when creating a registration in the notification hub. When notifications are sent to a tag, all devices that have registered for the tag will receive the notification. Because tags are simply strings, they do not have to be provisioned in advance. For more information about tags, refer to [Notification Hubs Guidance].


##Prerequisites

This topic builds on the app you created in [Get started with Notification Hubs][get-started]. Before starting this tutorial, you must have already completed [Get started with Notification Hubs][get-started].

##Add category selection to the app

The first step is to add the UI elements to your existing storyboard that enable the user to select categories to register. The categories selected by a user are stored on the device. When the app starts, a device registration is created in your notification hub with the selected categories as tags.

2. In your MainStoryboard_iPhone.storyboard add the following components from the object library:
	+ A label with "Breaking News" text,
	+ Labels with category texts "World", "Politics", "Business", "Technology", "Science", "Sports",
	+ Six switches, one per category,
	+ On button labeled "Subscribe"

	Your storyboard should look as follows:

	![][3]

3. In the assistant editor, create outlets for all the switches and call them "WorldSwitch", "PoliticsSwitch", "BusinessSwitch", "TechnologySwitch", "ScienceSwitch", "SportsSwitch"

	![][4]

4. Create an Action for your button called "subscribe". Your BreakingNewsViewController.h should contain the following:

		@property (weak, nonatomic) IBOutlet UISwitch *WorldSwitch;
		@property (weak, nonatomic) IBOutlet UISwitch *PoliticsSwitch;
		@property (weak, nonatomic) IBOutlet UISwitch *BusinessSwitch;
		@property (weak, nonatomic) IBOutlet UISwitch *TechnologySwitch;
		@property (weak, nonatomic) IBOutlet UISwitch *ScienceSwitch;
		@property (weak, nonatomic) IBOutlet UISwitch *SportsSwitch;

		- (IBAction)subscribe:(id)sender;

5. Create a new class called `Notifications`. Copy the following code in the interface section of the file Notifications.h:

		@property NSData* deviceToken;

		- (void)storeCategoriesAndSubscribeWithCategories:(NSArray*) categories completion: (void (^)(NSError* error))completion;
		- (void)subscribeWithCategories:(NSSet*) categories completion:(void (^)(NSError *))completion;

6. Add the following import directive to Notifications.m:

		#import <WindowsAzureMessaging/WindowsAzureMessaging.h>

7. Copy the following code in the implementation section of the file Notifications.m:

		- (void)storeCategoriesAndSubscribeWithCategories:(NSSet *)categories completion:(void (^)(NSError *))completion {
		    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
		    [defaults setValue:[categories allObjects] forKey:@"BreakingNewsCategories"];

		    [self subscribeWithCategories:categories completion:completion];
		}

		- (void)subscribeWithCategories:(NSSet *)categories completion:(void (^)(NSError *))completion{
		    SBNotificationHub* hub = [[SBNotificationHub alloc] initWithConnectionString:@"<connection string with listen access>" notificationHubPath:@"<hub name>"];

		    [hub registerNativeWithDeviceToken:self.deviceToken tags:categories completion: completion];
		}

	This class uses local storage to store the categories of news that this device has to receive. Also, it contains methods to register these categories.

4. In the above code, replace the `<hub name>` and `<connection string with listen access>` placeholders with your notification hub name and the connection string for *DefaultListenSharedAccessSignature* that you obtained earlier.

	> [AZURE.NOTE] Because credentials that are distributed with a client app are not generally secure, you should only distribute the key for listen access with your client app. Listen access enables your app to register for notifications, but existing registrations cannot be modified and notifications cannot be sent. The full access key is used in a secured backend service for sending notifications and changing existing registrations.

8. In the BreakingNewsAppDelegate.h file, add the following property:

		@property (nonatomic) Notifications* notifications;

	This creates a singleton instance of the Notification class in the AppDelegate.

9. In the **didFinishLaunchingWithOptions** method in BreakingNewsAppDelegate.m, add the following code before **registerForRemoteNotificationTypes**:

		self.notifications = [[Notifications alloc] init];

	The initializes the Notification singleton.

10. In the **didRegisterForRemoteNotificationsWithDeviceToken** method in BreakingNewsAppDelegate.m, remove the call to **registerNativeWithDeviceToken** and add the following code:

		self.notifications.deviceToken = deviceToken;

	Note that at this point there should be no other code in the **didRegisterForRemoteNotificationsWithDeviceToken** method.

11.	Add the following method in BreakingNewsAppDelegate.m:

		- (void)application:(UIApplication *)application didReceiveRemoteNotification:
			(NSDictionary *)userInfo {
		    NSLog(@"%@", userInfo);
		    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Notification" message:
		    [[userInfo objectForKey:@"aps"] valueForKey:@"alert"] delegate:nil cancelButtonTitle: @"OK" otherButtonTitles:nil, nil];
		    [alert show];
	    }

	This method handles notifications received when the app is running by displaying a simple **UIAlert**.

9. In BreakingNewsViewController.m, copy the following code into the XCode-generated **subscribe** method:

		NSMutableArray* categories = [[NSMutableArray alloc] init];

	    if (self.WorldSwitch.isOn) [categories addObject:@"World"];
	    if (self.PoliticsSwitch.isOn) [categories addObject:@"Politics"];
	    if (self.BusinessSwitch.isOn) [categories addObject:@"Business"];
	    if (self.TechnologySwitch.isOn) [categories addObject:@"Technology"];
	    if (self.ScienceSwitch.isOn) [categories addObject:@"Science"];
	    if (self.SportsSwitch.isOn) [categories addObject:@"Sports"];

	    Notifications* notifications = [(BreakingNewsAppDelegate*)[[UIApplication sharedApplication]delegate] notifications];

	    [notifications storeCategoriesAndSubscribeWithCategories:categories completion: ^(NSError* error) {
	        if (!error) {
	            UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Notification" message:
	                                  @"Subscribed!" delegate:nil cancelButtonTitle:
	                                  @"OK" otherButtonTitles:nil, nil];
	            [alert show];
	        } else {
	            NSLog(@"Error subscribing: %@", error);
	        }
	    }];

	This method creates an **NSMutableArray** of categories and uses the **Notifications** class to store the list in the local storage and registers the corresponding tags with your notification hub. When categories are changed, the registration is recreated with the new categories.

Your app is now able to store a set of categories in local storage on the device and register with the notification hub whenever the user changes the selection of categories.

##Register for notifications

These steps register with the notification hub on startup using the categories that have been stored in local storage.

> [AZURE.NOTE] Because the device token assigned by the Apple Push Notification Service (APNS) can chance at any time, you should register for notifications frequently to avoid notification failures. This example registers for notification every time that the app starts. For apps that are run frequently, more than once a day, you can probably skip registration to preserve bandwidth if less than a day has passed since the previous registration.

1. Add the following method in the interface section of the file Notifications.h:

		- (NSSet*)retrieveCategories;

	This code retrieves the categories in the Notifications class.

2. Add the corresponding implementation in the file Notifications.m:

		- (NSSet*)retrieveCategories {
		    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];

		    NSArray* categories = [defaults stringArrayForKey:@"BreakingNewsCategories"];

		    if (!categories) return [[NSSet alloc] init];
		    return [[NSSet alloc] initWithArray:categories];
		}

2. Add the following code in the **didRegisterForRemoteNotificationsWithDeviceToken** method:

		Notifications* notifications = [(BreakingNewsAppDelegate*)[[UIApplication sharedApplication]delegate] notifications];

	    NSSet* categories = [notifications retrieveCategories];
	    [notifications subscribeWithCategories:categories completion:^(NSError* error) {
	        if (error != nil) {
	            NSLog(@"Error registering for notifications: %@", error);
	        }
	    }];

	This makes sure that every time the app starts it retrieves the categories from local storage and requests a registeration for these categories.

3. In BreakingNewsViewController.h, add the following code in the **viewDidLoad** method:

		Notifications* notifications = [(BreakingNewsAppDelegate*)[[UIApplication sharedApplication]delegate] notifications];

	    NSSet* categories = [notifications retrieveCategories];

	    if ([categories containsObject:@"World"]) self.WorldSwitch.on = true;
	    if ([categories containsObject:@"Politics"]) self.PoliticsSwitch.on = true;
	    if ([categories containsObject:@"Business"]) self.BusinessSwitch.on = true;
	    if ([categories containsObject:@"Technology"]) self.TechnologySwitch.on = true;
	    if ([categories containsObject:@"Science"]) self.ScienceSwitch.on = true;
	    if ([categories containsObject:@"Sports"]) self.SportsSwitch.on = true;

	This updates the UI on startup based on the status of previously saved categories.

The app is now complete and can store a set of categories in the device local storage used to register with the notification hub whenever the user changes the selection of categories. Next, you will define a backend that can send category notifications to this app.

##Send notifications from your back-end

[AZURE.INCLUDE [notification-hubs-back-end](../includes/notification-hubs-back-end.md)]

##Run the app and generate notifications

1. Press the Run button to build the project and start the app.

	![][2]

	Note that the app UI provides a set of toggles that lets you choose the categories to subscribe to.

2. Enable one or more categories toggles, then click **Subscribe**.

	When you choose **Subscribe**, the app converts the selected categories into tags and requests a new device registration for the selected tags from the notification hub.

4. Send a new notification from the backend in one of the following ways:

	+ **Console app:** start the console app.

	+ **Java/PHP:** run your app/script.

5. Notifications for the selected categories appear as toast notifications.

## Next steps

In this tutorial we learned how to broadcast breaking news by category. Consider completing one of the following tutorials that highlight other advanced Notification Hubs scenarios:

+ **[Use Notification Hubs to broadcast localized breaking news]**

	Learn how to expand the breaking news app to enable sending localized notifications.

+ **[Notify users with Notification Hubs]**

	Learn how to push notifications to specific authenticated users. This is a good solution for sending notifications only to specific users.



<!-- Images. -->
[2]: ./media/notification-hubs-ios-send-breaking-news/notification-hub-breakingnews-ios1.png
[3]: ./media/notification-hubs-ios-send-breaking-news/notification-hub-breakingnews-ios2.png
[4]: ./media/notification-hubs-ios-send-breaking-news/notification-hub-breakingnews-ios3.png







<!-- URLs. -->
[How To: Service Bus Notification Hubs (iOS Apps)]: http://msdn.microsoft.com/library/jj927168.aspx
[Use Notification Hubs to broadcast localized breaking news]: /manage/services/notification-hubs/breaking-news-localized-dotnet/
[Mobile Service]: /develop/mobile/tutorials/get-started
[Notify users with Notification Hubs]: /manage/services/notification-hubs/notify-users/

[Azure Management Portal]: https://manage.windowsazure.com/
[Notification Hubs Guidance]: http://msdn.microsoft.com/library/jj927170.aspx
[Notification Hubs How-To for iOS]: http://msdn.microsoft.com/library/jj927168.aspx
[get-started]: /manage/services/notification-hubs/get-started-notification-hubs-ios/
