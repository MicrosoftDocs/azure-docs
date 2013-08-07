<properties linkid="develop-notificationhubs-tutorials-send-breaking-news-ios" writer="ricksal" urlDisplayName="Breaking News" pageTitle="Notification Hubs Breaking News Tutorial - iOS" metaKeywords="" metaDescription="Learn how to use Windows Azure Service Bus Notification Hubs to send breaking news notifications to iOS devices." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu-windows-store.md" />

# Use Notification Hubs to send breaking news to iOS devices
<div class="dev-center-tutorial-selector sublanding"> 
		<a href="/en-us/manage/services/notification-hubs/breaking-news-ios" title="iOS" class="current">iOS</a>
    	<a href="/en-us/manage/services/notification-hubs/breaking-news-dotnet" title="Windows Store C#" >Windows Store C#</a>
</div>

This topic shows you how to use Windows Azure Notification Hubs to broadcast breaking news notifications to an iOS app. In this tutorial you start with the app created in [Get started with Notification Hubs]. When complete, you will be able to register for categories you are interested in, and receive only push notifications for those categories.

Note that the same concepts can be seamlessly applied to Windows Store, Windows Phone 8, and Android clients too. This scenario is a common pattern for many apps where notifications have to be sent to groups of users that have previously declared interest in them, e.g. RSS reader, apps for music fans, etc. 

This tutorial walks you through these basic steps to enable this scenario:

1. [The app user interface]
2. [Client app processing]
3. [Building the iOS client app]
4. [Send notifications from your back-end]


There are two parts to this scenario:

- the iOS client app allows devices to subscribe to different breaking news categories, using a Notification feature called **tags**; 

- the back-end broadcasts breaking news push notifications for all the categories, but the user will only recieve those notifications they have previously subscribed to.



##Prerequisites ##

You must have already completed the [Get started with Notification Hubs] tutorial and have the code available. You also need Visual Studio 2012.


<h2><a name="ui"></a><span class="short-header">App ui</span>The app user interface</h2>

The app lets you choose the categories to subscribe to. When you choose **subscribe**, the app converts the selected categories into ***tags*** and  registers them with the Notification Hub.

Tags are simple string and do not have to be provisioned in advance. Simply specify a specific tag when you register a device. When pushing a notification to that tag, all devices that have registered for the tag will receive the notification. For more information about tags, refer to [Notification Hubs Guidance].

![][2]

<h2><a name="processing"></a><span class="client processing">App ui</span>Client App Processing</h2>

You register your client app with your notification hub in order to update the device's ChannelURI or device token, as well as register for the tags you are interested in. Generally, you register every time your app starts, but in order to save power and data transmission, you can reduce the frequency by avoiding registration if, when your app starts, less than a specified amount of time (usually a day) has passed since last registration.

Registrations in your notification hub can expire. This means that you cannot reliably store your preferences (the categories you chose) in your notification hub. In this topic we use the device local storage to store your preferences and then register the correct tags to your notification hub. You can also store that information in the cloud using your own app back-end or a [Mobile Service].

If you decide to change the tags you are interested in, you must re-register for the change to be reflected in your notification hub. Otherwise you might lose notifications targeted, or get notifications that you don't want.

Summary:

+ Your device registration in the notification hub might expire, so you have to store the selected categories in the device local storage.
+ You have to register your app with your notification hub, every time you change the selected categories, and every time your app starts

<h2><a name="building-client"></a><span class="building app">App ui</span>Building the iOS client app</h2>

We assume that you already followed the [Get started with Notification Hubs] in order to set up your app and create and/or configure your Notification Hub. 
Specifically, make sure to go through the following sections:

+ Generate the certificate signing request
+ Register your app and enable push notifications
+ Create a provisioning profile for the app
+ Configure your Notification Hub (if you already have a Notification Hub, start at step 4)
+ Connecting your app to the Notification Hub, up to step 3.

We will build the app around the two main use cases:

+ When a user selects a set of categories we store them in local storage and register the corresponding tags with your Notification Hub,
+ When your app starts, we register the categories stored with your Notification Hub.


### Choosing the news categories

Assume familiar with Apple tutorial

1. Follow the steps in Get start with hub to configure a new Single View Page app to receive push notifications.

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
			    SBNotificationHub* hub = [[SBNotificationHub alloc] initWithConnectionString:@"<connection string>" notificationHubPath:@"<hub name>"];
			    
			    [hub registerNativeWithDeviceToken:self.deviceToken tags:categories completion: completion];
			}

	Make sure to replace the placeholders with your notification hub name and your connection string with listen access. 
	This class uses local storage to store the categories of news that this device has to receive. Also, it contains methods to register these categories.

8. Now we will create a singleton instance of the Notification class in our AppDelegate. In your BreakingNewsAppDelegate.h, add the following property:

			@property (nonatomic) Notifications* notifications;
	Then initialize it in your *didFinishLaunchingWithOptions* method in BreakingNewsAppDelegate.m, which should contain the following:
	
			self.notifications = [[Notifications alloc] init];
			
		    [[UIApplication sharedApplication] registerForRemoteNotificationTypes: UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound];

	The first line initializes the Notification singleton, while the second one starts the registration for push notifications (you should have added this line while following the [Get Started with Notification Hubs] tutorial).
	Remember that the Notification class has a property that has to hold the device token for this device provided by APNs. In order to obtain this information, you have to implement the method *didRegisterForRemoteNotificationsWithDeviceToken* in your AppDelegate, and copy the following code:
	
			self.notifications.deviceToken = deviceToken;

	Note that at this time you should not have any other code in this method. If you followed the Get Started with Notification Hub tutorial you might have a call to the *registerNativeWithDeviceToken* method of a SBNotificationHub, remove that call.

	Finally, add the following method, which will handle the notification in case it is received when the app is running. This app will display a simple **UIAlert**, but you can decide otherwise.

			- (void)application:(UIApplication *)application didReceiveRemoteNotification:
				(NSDictionary *)userInfo {
			    NSLog(@"%@", userInfo);
			    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Notification" message:
			    [userInfo objectForKey:@"inAppMessage"] delegate:nil cancelButtonTitle: @"OK" otherButtonTitles:nil, nil];
			    [alert show];
		    }

9. In *BreakingNewsViewController.m*, XCode has created the method *subscribe*, copy the following content in it:

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
	This method creates an NSMutableArray of categories and uses the Notifications class to store the list in the local storage and register the corresponding tags with your Notification Hub.

	Note: In case the call to your Notification Hub fails, you might want to either retry or reset the switches and the local store to the previous state. In this tutorial we assume, for simplicity's sake, that the app will re-register with the Notification Hub next time it starts, correcting the misalignment.

Our app is now able to store a set of categories in the device local storage and to register with the notification hub whenever the user changes the selection of categories. Since it is not guaranteed that the user will regularly subscribe, we have to make sure that when the app starts, we register with notification hub the categories that have been stored in the local storage.

You can now run the app and verify that clicking the subscribe button will trigger a registration to your Notification Hub.

### Registering when your app starts

1. First we add the code to retrieve the categories in the Notifications class: add the following method in the interface section of the file Notifications.h:

		- (NSSet*)retrieveCategories;

	Then add the corresponding implementation in the file Notifications.m:
	
		- (NSSet*)retrieveCategories {
		    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
		    
		    NSArray* categories = [defaults stringArrayForKey:@"BreakingNewsCategories"];
		    
		    if (!categories) return [[NSSet alloc] init];
		    return [[NSSet alloc] initWithArray:categories];
		}

2. To ensure that your app updates its notification hub registration every time it starts, add the following code in the *didRegisterForRemoteNotificationsWithDeviceToken*:

		Notifications* notifications = [(BreakingNewsAppDelegate*)[[UIApplication sharedApplication]delegate] notifications];
    
	    NSSet* categories = [notifications retrieveCategories];
	    [notifications subscribeWithCategories:categories completion:^(NSError* error) {
	        if (error != nil) {
	            NSLog(@"Error registering for notifications: %@", error);
	        }
	    }];

	Now, every time the app starts, it will retrieve the categories and register for the categories saved in the local storage.

3. Finally, when starting, we want to update your switches with the categories previously saved. In BreakingNewsViewController.h, add the following code in the *viewDidLoad* method:

		Notifications* notifications = [(BreakingNewsAppDelegate*)[[UIApplication sharedApplication]delegate] notifications];
    
	    NSSet* categories = [notifications retrieveCategories];
	    
	    if ([categories containsObject:@"World"]) self.WorldSwitch.on = true;
	    if ([categories containsObject:@"Politics"]) self.PoliticsSwitch.on = true;
	    if ([categories containsObject:@"Business"]) self.BusinessSwitch.on = true;
	    if ([categories containsObject:@"Technology"]) self.TechnologySwitch.on = true;
	    if ([categories containsObject:@"Science"]) self.ScienceSwitch.on = true;
	    if ([categories containsObject:@"Sports"]) self.SportsSwitch.on = true;

Our app is now completed.

Our app is now able to store a set of categories in the device local storage and to register with the notification hub whenever the user changes the selection of categories. Since it is not guaranteed that the user will regularly subscribe, we have to make sure that when the app starts, we register with your notification hub the categories that have been stored in the local storage.

You can now run the app and verify that clicking the subscribe button will trigger a registration to your Notification Hub.


<div chunk="../chunks/notification-hubs-back-end.md" />


## Next Steps
In this tutorial we learned how to broadcast breaking news by category. 

To learn how to expand the breaking news app by sending localized notifications,  see [Use Notification Hubs to broadcast localized Breaking News]. If your app must push notifications to specific users and the notification content is private, see the tutorials [Notify users with Notification Hubs: ASP.NET], [Notify users with Notification Hubs: Mobile Services].

<!-- Anchors. -->
[The app user interface]: #ui
[Client App Processing]: #client-processing
[Building the iOS client app]: #building-client
[Send notifications from your back-end]: #send
[Next Steps]:#next-steps

<!-- Images. -->
[1]: notification-hub-breakingnews-win1.png
[2]: ../media/notification-hub-breakingnews-ios1.png

[3]: ../media/notification-hub-breakingnews-ios2.png
[4]: ../media/notification-hub-breakingnews-ios3.png
[5]: ../media/notification-hub-breakingnews-ios4.png
[6]: mobile-services-win8-app-push-auth.png
[7]: notification-hub-create-from-portal.png
[8]: notification-hub-create-from-portal2.png
[9]: notification-hub-select-from-portal.png
[10]: notification-hub-select-from-portal2.png
[11]: notification-hub-configure-wns.png
[12]: notification-hub-connection-strings.png
[13]: ../media/notification-hub-create-console-app.png
[14]: ../media/notification-hub-windows-toast.png
[15]: ../media/notification-hub-scheduler1.png
[16]: ../media/notification-hub-scheduler2.png
[17]: mobile-services-win8-edit2-app.png
[18]: notification-hub-win8-app-toast.png
[19]: notification-hub-windows-reg.png

<!-- URLs. -->
[Get started with Notification Hubs]: mobile-services-get-started-with-notification-hub-ios.md
[Use Notification Hubs to broadcast localized Breaking News]: breaking-news-localized-ios.md
[Mobile Service]: ../../../DevCenter/Mobile/Tutorials/mobile-services-get-started.md
[Notify users with Notification Hubs: ASP.NET]: tutorial-notify-users-aspnet.md
[Notify users with Notification Hubs: Mobile Services]: tutorial-notify-users-mobileservices.md

[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started/#create-new-service
[Get started with data]: ../tutorials/mobile-services-get-started-with-data-dotnet.md
[Get started with authentication]: ../tutorials/mobile-services-get-started-with-users-dotnet.md
[Get started with push notifications]: ../tutorials/mobile-services-get-started-with-push-dotnet.md
[Push notifications to app users]: ../tutorials/mobile-services-push-notifications-to-app-users-dotnet.md
[Authorize users with scripts]: ../tutorials/mobile-services-authorize-users-dotnet.md
[JavaScript and HTML]: ../tutorials/mobile-services-get-started-with-push-js.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/
[Windows Developer Preview registration steps for Mobile Services]: ../HowTo/mobile-services-windows-developer-preview-registration.md
[wns object]: http://go.microsoft.com/fwlink/p/?LinkId=260591
[Notification Hubs Guidance]: http://msdn.microsoft.com/en-us/library/jj927170.aspx
[Notification Hubs How-To for iOS]: http://msdn.microsoft.com/en-us/library/jj927168.aspx

