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
	ms.tgt_pltfrm="mobile-ios"
	ms.devlang="objective-c"
	ms.topic="article"
	ms.date="06/16/2015"
	ms.author="wesmc"/>

# Use Notification Hubs to send breaking news

[AZURE.INCLUDE [notification-hubs-selector-breaking-news](../../includes/notification-hubs-selector-breaking-news.md)]


##Overview

This topic shows you how to use Azure Notification Hubs to broadcast breaking news notifications to an iOS app. When complete, you will be able to register for breaking news categories you are interested in, and receive only push notifications for those categories. This scenario is a common pattern for many apps where notifications have to be sent to groups of users that have previously declared interest in them, e.g. RSS reader, apps for music fans, etc.

Broadcast scenarios are enabled by including one or more _tags_ when creating a registration in the notification hub. When notifications are sent to a tag, all devices that have registered for the tag will receive the notification. Because tags are simply strings, they do not have to be provisioned in advance. For more information about tags, refer to [Notification Hubs Guidance].


##Prerequisites

This topic builds on the app you created in [Get started with Notification Hubs][get-started]. Before starting this tutorial, you must have already completed [Get started with Notification Hubs][get-started].

##Add category selection to the app

The first step is to add the UI elements to your existing storyboard that enable the user to select categories to register. The categories selected by a user are stored on the device. When the app starts, a device registration is created in your notification hub with the selected categories as tags.

1. In your MainStoryboard_iPhone.storyboard add the following components from the object library:
	+ A label with "Breaking News" text,
	+ Labels with category texts "World", "Politics", "Business", "Technology", "Science", "Sports",
	+ Six switches, one per category, set each switch **State** to be **Off** by default.
	+ One button labeled "Subscribe"

	Your storyboard should look as follows:

	![][3]

2. In the assistant editor, create outlets for all the switches and call them "WorldSwitch", "PoliticsSwitch", "BusinessSwitch", "TechnologySwitch", "ScienceSwitch", "SportsSwitch"


3. Create an Action for your button called "subscribe". Your ViewController.h should contain the following:

		@property (weak, nonatomic) IBOutlet UISwitch *WorldSwitch;
		@property (weak, nonatomic) IBOutlet UISwitch *PoliticsSwitch;
		@property (weak, nonatomic) IBOutlet UISwitch *BusinessSwitch;
		@property (weak, nonatomic) IBOutlet UISwitch *TechnologySwitch;
		@property (weak, nonatomic) IBOutlet UISwitch *ScienceSwitch;
		@property (weak, nonatomic) IBOutlet UISwitch *SportsSwitch;

		- (IBAction)subscribe:(id)sender;

4. Create a new **Cocoa Touch Class** called `Notifications`. Copy the following code in the interface section of the file Notifications.h:

		@property NSData* deviceToken;

		- (void)storeCategoriesAndSubscribeWithCategories:(NSArray*)categories
					completion:(void (^)(NSError* error))completion;

		- (NSSet*)retrieveCategories;

		- (void)subscribeWithCategories:(NSSet*)categories completion:(void (^)(NSError *))completion;

5. Add the following import directive to Notifications.m:

		#import <WindowsAzureMessaging/WindowsAzureMessaging.h>

6. Copy the following code in the implementation section of the file Notifications.m and replace the `<hub name>` and `<connection string with listen access>` placeholders with your notification hub name and the connection string for *DefaultListenSharedAccessSignature* that you obtained earlier.

		- (void)storeCategoriesAndSubscribeWithCategories:(NSSet *)categories completion:(void (^)(NSError *))completion {
		    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
		    [defaults setValue:[categories allObjects] forKey:@"BreakingNewsCategories"];

		    [self subscribeWithCategories:categories completion:completion];
		}


		- (NSSet*)retrieveCategories {
		    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];

		    NSArray* categories = [defaults stringArrayForKey:@"BreakingNewsCategories"];

		    if (!categories) return [[NSSet alloc] init];
		    return [[NSSet alloc] initWithArray:categories];
		}


		- (void)subscribeWithCategories:(NSSet *)categories completion:(void (^)(NSError *))completion
		{
		    SBNotificationHub* hub = [[SBNotificationHub alloc]
										initWithConnectionString:@"<connection string with listen access>"
										notificationHubPath:@"<hub name>"];

		    [hub registerNativeWithDeviceToken:self.deviceToken tags:categories completion: completion];
		}



	This class uses local storage to store and retrieve the categories of news that this device will receive. Also, it contains a method to register for these categories.

	> [AZURE.NOTE] Because credentials that are distributed with a client app are not generally secure, you should only distribute the key for listen access with your client app. Listen access enables your app to register for notifications, but existing registrations cannot be modified and notifications cannot be sent. The full access key is used in a secured backend service for sending notifications and changing existing registrations.

7. In the AppDelegate.h file, add an import statement for Notifications.h and add a property for an instance of the Notifications class:

		#import "Notifications.h"

		@property (nonatomic) Notifications* notifications;

	This creates a singleton instance of the Notification class in the AppDelegate.

8. In the **didFinishLaunchingWithOptions** method in AppDelegate.m, add the code to initialize the notifications instance at the beginning of the method:

		self.notifications = [[Notifications alloc] init];

	The initializes the Notification singleton.


9. In the **didRegisterForRemoteNotificationsWithDeviceToken** method in AppDelegate.m, replace the code in the method with the following code to pass the device token to the notifications class. The notifications class will perform the registering for notifications with the categories. If the user changes category selections, we call the `subscribeWithCategories` method in response to the **subscribe** button to update them.

	> [AZURE.NOTE] Because the device token assigned by the Apple Push Notification Service (APNS) can chance at any time, you should register for notifications frequently to avoid notification failures. This example registers for notification every time that the app starts. For apps that are run frequently, more than once a day, you can probably skip registration to preserve bandwidth if less than a day has passed since the previous registration.

		self.notifications.deviceToken = deviceToken;

		// Retrieves the categories from local storage and requests a registration for these categories
		// each time the app starts and performs a registration.

	    NSSet* categories = [self.notifications retrieveCategories];
	    [self.notifications subscribeWithCategories:categories completion:^(NSError* error) {
	        if (error != nil) {
	            NSLog(@"Error registering for notifications: %@", error);
	        }
	    }];


	Note that at this point there should be no other code in the **didRegisterForRemoteNotificationsWithDeviceToken** method.

10.	The following methods should already be present in AppDelegate.m from completing the [Get started with Notification Hubs][get-started] tutorial.  If not, add them.

		-(void)MessageBox:(NSString *)title message:(NSString *)messageText
		{
			UIAlertView *alert = [[UIAlertView alloc] initWithTitle:title message:messageText delegate:self
				cancelButtonTitle:@"OK" otherButtonTitles: nil];
			[alert show];
		}

		- (void)application:(UIApplication *)application didReceiveRemoteNotification:
			(NSDictionary *)userInfo {
		    NSLog(@"%@", userInfo);
		    [self MessageBox:@"Notification" message:[[userInfo objectForKey:@"aps"] valueForKey:@"alert"]];
	    }

	This method handles notifications received when the app is running by displaying a simple **UIAlert**.

11. In ViewController.m, add a import statement for AppDelegate.h and copy the following code into the XCode-generated **subscribe** method. This code will update the notification registration to use the new category tags the user has chosen in the user interface.

		NSMutableArray* categories = [[NSMutableArray alloc] init];

	    if (self.WorldSwitch.isOn) [categories addObject:@"World"];
	    if (self.PoliticsSwitch.isOn) [categories addObject:@"Politics"];
	    if (self.BusinessSwitch.isOn) [categories addObject:@"Business"];
	    if (self.TechnologySwitch.isOn) [categories addObject:@"Technology"];
	    if (self.ScienceSwitch.isOn) [categories addObject:@"Science"];
	    if (self.SportsSwitch.isOn) [categories addObject:@"Sports"];

	    Notifications* notifications = [(AppDelegate*)[[UIApplication sharedApplication]delegate] notifications];

	    [notifications storeCategoriesAndSubscribeWithCategories:categories completion: ^(NSError* error) {
	        if (!error) {
	            [self MessageBox:@"Notification" message:@"Subscribed!"];
	        } else {
	            NSLog(@"Error subscribing: %@", error);
	        }
	    }];

	This method creates an **NSMutableArray** of categories and uses the **Notifications** class to store the list in the local storage and registers the corresponding tags with your notification hub. When categories are changed, the registration is recreated with the new categories.

12. In ViewController.m, add the following code in the **viewDidLoad** method to set the user interface based on the previously saved categories.


		// This updates the UI on startup based on the status of previously saved categories.

		Notifications* notifications = [(BreakingNewsAppDelegate*)[[UIApplication sharedApplication]delegate] notifications];

	    NSSet* categories = [notifications retrieveCategories];

	    if ([categories containsObject:@"World"]) self.WorldSwitch.on = true;
	    if ([categories containsObject:@"Politics"]) self.PoliticsSwitch.on = true;
	    if ([categories containsObject:@"Business"]) self.BusinessSwitch.on = true;
	    if ([categories containsObject:@"Technology"]) self.TechnologySwitch.on = true;
	    if ([categories containsObject:@"Science"]) self.ScienceSwitch.on = true;
	    if ([categories containsObject:@"Sports"]) self.SportsSwitch.on = true;



The app can now store a set of categories in the device local storage used to register with the notification hub whenever the app starts.  The user can change the selection of categories at runtime and click the **subscribe** method to update the registration for the device. Next, you will update the app to send the breaking news notifications directly in the app itself.


##Send notifications

Normally notifications would be sent by a backend service but, for this tutorial we will update our send notification code so that we can send breaking news notifications directly from the app. To do this we will update the `SendNotificationRESTAPI` method that we defined in the [Get started with Notification Hubs][get-started] tutorial.


1. In ViewController.m update the `SendNotificationRESTAPI` method as follows so that it takes a Platform Notification Service `pns` parameter, and a parameter for the category tag.

		- (void)SendNotificationRESTAPI:(NSString*)pns Category:(NSString*)categoryTag
		{
		    NSURLSession* session = [NSURLSession sessionWithConfiguration:[NSURLSessionConfiguration
									 defaultSessionConfiguration] delegate:nil delegateQueue:nil];

		    NSString *json;

		    // Construct the messages REST endpoint
		    NSURL* url = [NSURL URLWithString:[NSString stringWithFormat:@"%@%@/messages/%@", HubEndpoint,
		                                       HUBNAME, API_VERSION]];

		    // Generated the token to be used in the authorization header.
		    NSString* authorizationToken = [self generateSasToken:[url absoluteString]];

		    //Create the request to add the APNS notification message to the hub
		    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
		    [request setHTTPMethod:@"POST"];

		    // Add the category as a tag
		    [request setValue:categoryTag forHTTPHeaderField:@"ServiceBusNotification-Tags"];

		    // Windows Notification format of the notification message
		    if ([pns isEqualToString:@"wns"])
		    {
		        json = [NSString stringWithFormat:@"<?xml version=\"1.0\" encoding=\"utf-8\"?>"
		                                           "<toast>"
		                                           "<visual><binding template=\"ToastText01\">"
		                                           "<text id=\"1\">Breaking %@ News : %@</text>"
		                                           "</binding>"
		                                           "</visual>"
		                                           "</toast>",
		                categoryTag, self.notificationMessage.text];

		        // Signify windows notification format
		        [request setValue:@"windows" forHTTPHeaderField:@"ServiceBusNotification-Format"];

		        // XML Content-Type
		        [request setValue:@"application/xml" forHTTPHeaderField:@"Content-Type"];

		        // Set X-WNS-TYPE header
		        [request setValue:@"wns/toast" forHTTPHeaderField:@"X-WNS-Type"];
		    }

		    // Google Cloud Messaging Notification format of the notification message
		    if ([pns isEqualToString:@"gcm"])
		    {
		        json = [NSString stringWithFormat:@"{\"data\":{\"message\":\"Breaking %@ News : %@\"}}",
		                categoryTag, self.notificationMessage.text];
		        // Signify gcm notification format
		        [request setValue:@"gcm" forHTTPHeaderField:@"ServiceBusNotification-Format"];

				// JSON Content-Type
				[request setValue:@"application/json;charset=utf-8" forHTTPHeaderField:@"Content-Type"];
		    }

		    // Apple Notification format of the notification message
		    if ([pns isEqualToString:@"apns"])
		    {
		        json = [NSString stringWithFormat:@"{\"aps\":{\"alert\":\"Breaking %@ News : %@\"}}",
		                categoryTag, self.notificationMessage.text];
		        // Signify apple notification format
		        [request setValue:@"apple" forHTTPHeaderField:@"ServiceBusNotification-Format"];

				// JSON Content-Type
				[request setValue:@"application/json;charset=utf-8" forHTTPHeaderField:@"Content-Type"];
		    }

		    //Authenticate the notification message POST request with the SaS token
		    [request setValue:authorizationToken forHTTPHeaderField:@"Authorization"];

		    //Add the notification message body
		    [request setHTTPBody:[json dataUsingEncoding:NSUTF8StringEncoding]];

		    // Send the REST request
		    NSURLSessionDataTask* dataTask = [session dataTaskWithRequest:request
		               completionHandler:^(NSData *data, NSURLResponse *response, NSError *error)
		               {
		               NSHTTPURLResponse* httpResponse = (NSHTTPURLResponse*) response;
		                   if (error || httpResponse.statusCode != 200)
		                   {
		                       NSLog(@"\nError status: %d\nError: %@", httpResponse.statusCode, error);
		                   }
		                   if (data != NULL)
		                   {
		                       //xmlParser = [[NSXMLParser alloc] initWithData:data];
		                       //[xmlParser setDelegate:self];
		                       //[xmlParser parse];
		                   }
		               }];
		    [dataTask resume];
		}



2. In ViewController.m update the **Send Notification** action as shown in the code that follows. So that it will send the notifications using each tag individually and send to multiple platforms.



		- (IBAction)SendNotificationMessage:(id)sender
		{
		    self.sendResults.text = @"";

		    NSArray* categories = [NSArray arrayWithObjects: @"World", @"Politics", @"Business",
									@"Technology", @"Science", @"Sports", nil];

		    // Lets send the message as breaking news for each category to WNS, GCM, and APNS
		    for(NSString* category in categories)
		    {
		        [self SendNotificationRESTAPI:@"wns" Category:category];
		        [self SendNotificationRESTAPI:@"gcm" Category:category];
		        [self SendNotificationRESTAPI:@"apns" Category:category];
		    }
		}



3. Rebuild your project and make sure you have no build errors.


##Run the app and generate notifications

1. Press the Run button to build the project and start the app. Select some breaking news options to subscribe to and then press the **Subscribe** button. You should see a dialog indicating the notifications have been subscribed to.

	![][1]

	When you choose **Subscribe**, the app converts the selected categories into tags and requests a new device registration for the selected tags from the notification hub.

2. Enter a message to be sent as breaking news then press the **Send Notification** button

	![][2]


3. Each device subscribed to breaking news will receive the breaking news notifications you just sent.



## Next steps

In this tutorial we learned how to broadcast breaking news by category. Consider completing one of the following tutorials that highlight other advanced Notification Hubs scenarios:

+ **[Use Notification Hubs to broadcast localized breaking news]**

	Learn how to expand the breaking news app to enable sending localized notifications.

+ **[Notify users with Notification Hubs]**

	Learn how to push notifications to specific authenticated users. This is a good solution for sending notifications only to specific users.



<!-- Images. -->
[1]: ./media/notification-hubs-ios-send-breaking-news/notification-hub-breakingnews-subscribed.png
[2]: ./media/notification-hubs-ios-send-breaking-news/notification-hub-breakingnews-ios1.png
[3]: ./media/notification-hubs-ios-send-breaking-news/notification-hub-breakingnews-ios2.png








<!-- URLs. -->
[How To: Service Bus Notification Hubs (iOS Apps)]: http://msdn.microsoft.com/library/jj927168.aspx
[Use Notification Hubs to broadcast localized breaking news]: /manage/services/notification-hubs/breaking-news-localized-dotnet/
[Mobile Service]: /develop/mobile/tutorials/get-started
[Notify users with Notification Hubs]: notification-hubs-aspnet-backend-ios-notify-users.md
[Azure Management Portal]: https://manage.windowsazure.com/
[Notification Hubs Guidance]: http://msdn.microsoft.com/library/dn530749.aspx
[Notification Hubs How-To for iOS]: http://msdn.microsoft.com/library/jj927168.aspx
[get-started]: /manage/services/notification-hubs/get-started-notification-hubs-ios/
