<properties
	pageTitle="Azure Mobile Engagement iOS SDK Reach Integration"
	description="Latest updates and procedures for iOS SDK for Azure Mobile Engagement"
	services="mobile-engagement"
	documentationCenter="mobile"
	authors="MehrdadMzfr"
	manager="dwrede"
	editor="" />

<tags
	ms.service="mobile-engagement"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-ios"
	ms.devlang="objective-c"
	ms.topic="article"
	ms.date="02/29/2016"
	ms.author="MehrdadMzfr" />

#How to Integrate Engagement Reach on iOS

> [AZURE.IMPORTANT] You must follow the integration procedure described in the How to Integrate Engagement on iOS document before following this guide.


### Enable your app to receive Silent Push Notifications

[AZURE.INCLUDE [mobile-engagement-ios-silent-push](../../includes/mobile-engagement-ios-silent-push.md)]

##Integration steps

### Embed the Engagement Reach SDK into your iOS project

-   Add the Reach sdk in your Xcode project. In Xcode, go to **Project \> Add to project** and choose the `EngagementReach` folder.

### Modify your Application Delegate

-   At the top of your implementation file, import the Engagement Reach module:

		[...]
		#import "AEReachModule.h"

-   Inside method `applicationDidFinishLaunching:` or `application:didFinishLaunchingWithOptions:`, create a reach module and pass it to your existing Engagement initialization line:

		- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
		  AEReachModule* reach = [AEReachModule moduleWithNotificationIcon:[UIImage imageNamed:@"icon.png"]];
		  [EngagementAgent init:@"Endpoint={YOUR_APP_COLLECTION.DOMAIN};SdkKey={YOUR_SDK_KEY};AppId={YOUR_APPID}" modules:reach, nil];
		  [...]

		  return YES;
		}

-   Modify **'icon.png'** string with the image name you want as your notification icon.
-   If you want to use the option *Update badge value* in Reach campaigns or if you want to use native push \</SaaS/Reach API/Campaign format/Native Push\> campaigns, you must let the Reach module manage the badge icon itself (it will automatically clear the application badge and also reset the value stored by Engagement every time the application is started or foregrounded). This is done by adding the following line after Reach module initialization:

		[reach setAutoBadgeEnabled:YES];

-   If you want to handle Reach data push, you must let your Application delegate conform to the `AEReachDataPushDelegate` protocol. Add the following line after Reach module initialization:

		[reach setDataPushDelegate:self];

-   Then you can implement the methods `onDataPushStringReceived:` and `onDataPushBase64ReceivedWithDecodedBody:andEncodedBody:` in your application delegate:

		-(BOOL)didReceiveStringDataPushWithCategory:(NSString*)category body:(NSString*)body
		{
		   NSLog(@"String data push message with category <%@> received: %@", category, body);
		   return YES;
		}

		-(BOOL)didReceiveBase64DataPushWithCategory:(NSString*)category decodedBody:(NSData *)decodedBody encodedBody:(NSString *)encodedBody
		{
		   NSLog(@"Base64 data push message with category <%@> received: %@", category, encodedBody);
		   // Do something useful with decodedBody like updating an image view
		   return YES;
		}

### Category

The category parameter is optional when you create a Data Push campaign and allows you to filter data pushes. This is useful if you want to push different kinds of `Base64` data and want to identify their type before parsing them.

**Your application is now ready to receive and display reach contents!**

##How to receive announcements and polls at any time

Engagement can send Reach notifications to your end users at any time by using the Apple Push Notification Service.

To enable this functionality, you'll have to prepare your application for Apple push notifications and modify your application delegate.

### Prepare your application for Apple push notifications

Please follow the guide : [How to Prepare your Application for Apple Push Notifications](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/AddingCapabilities/AddingCapabilities.html#//apple_ref/doc/uid/TP40012582-CH26-SW6)

### Add the necessary client code

*At this point your application should have a registered Apple push certificate in the Engagement frontend.*

If it's not done already, you need to register your application to receive push notifications. Add the following line when your application starts (typically in `application:didFinishLaunchingWithOptions:`):

	if ([application respondsToSelector:@selector(registerUserNotificationSettings:)]) {
	  	[application registerUserNotificationSettings:[UIUserNotificationSettings settingsForTypes:(UIUserNotificationTypeBadge | UIUserNotificationTypeSound | UIUserNotificationTypeAlert) categories:nil]];
	  	[application registerForRemoteNotifications];
	}
	else {
	  	[application registerForRemoteNotificationTypes:(UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound | UIRemoteNotificationTypeAlert)];
	}

Then, You need to provide to Engagement the device token returned by Apple servers. This is done in the method named `application:didRegisterForRemoteNotificationsWithDeviceToken:` in your application delegate:

	- (void)application:(UIApplication*)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData*)deviceToken
	{
	    [[EngagementAgent shared] registerDeviceToken:deviceToken];
	}

Finally, you have to inform the Engagement SDK when your application receives a remote notification. To do that, call the method `applicationDidReceiveRemoteNotification:fetchCompletionHandler:` in your application delegate:

	- (void)application:(UIApplication*)application didReceiveRemoteNotification:(NSDictionary*)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult result))handler
	{
		[[EngagementAgent shared] applicationDidReceiveRemoteNotification:userInfo fetchCompletionHandler:handler];
	}

> [AZURE.NOTE] The method above is introduced in iOS 7. If you are targeting iOS <7, make sure to implement method `application:didReceiveRemoteNotification:` in your application delegate and call `applicationDidReceiveRemoteNotification` on the EngagementAgent by passing nil instead of the `handler` argument:

	- (void)application:(UIApplication*)application
	didReceiveRemoteNotification:(NSDictionary*)userInfo
	{
		[[EngagementAgent shared] applicationDidReceiveRemoteNotification:userInfo fetchCompletionHandler:nil];
	}

> [AZURE.IMPORTANT] By default, Engagement Reach controls the completionHandler. If you want to manually respond to the `handler` block in your code, you can pass nil for the `handler` argument and control the completion block yourself. See the `UIBackgroundFetchResult` type for a list of possible values.


### Full example

Here is a full example of integration:

	#pragma mark -
	#pragma mark Application lifecycle

	- (BOOL)application:(UIApplication*)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions
	{
	  /* Reach module */
	  AEReachModule* reach = [AEReachModule moduleWithNotificationIcon:[UIImage imageNamed:@"icon.png"]];
	  [reach setAutoBadgeEnabled:YES];

	  /* Engagement initialization */
	  [EngagementAgent init:@"Endpoint={YOUR_APP_COLLECTION.DOMAIN};SdkKey={YOUR_SDK_KEY};AppId={YOUR_APPID}" modules:reach, nil];
	  [[EngagementAgent shared] setPushDelegate:self];

	  /* Views */
	  [window addSubview:[tabBarController view]];
	  [window makeKeyAndVisible];

	  [application registerForRemoteNotificationTypes:UIRemoteNotificationTypeAlert|UIRemoteNotificationTypeBadge|UIRemoteNotificationTypeSound];
	  return YES;
	}

	- (void)application:(UIApplication*)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData*)deviceToken
	{
	  [[EngagementAgent shared] registerDeviceToken:deviceToken];
	}

	- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult result))handler
	{
		[[EngagementAgent shared] applicationDidReceiveRemoteNotification:userInfo fetchCompletionHandler:handler];
	}

##How to customize campaigns

### Notifications

There are two types of notifications: system and in-app notifications.

System notifications are handled by iOS, and cannot be customized.

In-app notifications are made of a view that is dynamically added to the current application window. This is called a notification overlay. Notification overlays are great for a fast integration because they does not require you to modify any view in your application.

#### Layout

To modify the look of your in-app notifications, you can simply modify the file `AENotificationView.xib` to your needs, as long as you keep the tag values and types of the existing subviews.

By default, in-app notifications are presented at the bottom of the screen. If you prefer to display them at the top of screen, edit the provided `AENotificationView.xib` and change the `AutoSizing` property of the main view so it can be kept at the top of its superview.

#### Categories

When you modify the provided layout, you modify the look of all your notifications. Categories allow you to define various targeted looks (possibly behaviors) for notifications. A category can be specified when you create a Reach campaign. Keep in mind that categories also let you customize announcements and polls, that is described later in this document.

To register a category handler for your notifications, you need to add a call once the reach module is initialized.

	AEReachModule* reach = [AEReachModule moduleWithNotificationIcon:[UIImage imageNamed:@"icon.png"]];
	[reach registerNotifier:myNotifier forCategory:@"my_category"];
	...

`myNotifier` must be an instance of an object that conforms to the protocol `AENotifier`.

You can implement the protocol methods by yourself or you can choose to reimplement the existing class `AEDefaultNotifier` which already performs most of the work.

For example, if you want to redefine the notification view for a specific category, you can follow this example:

	#import "AEDefaultNotifier.h"
	#import "AENotificationView.h"
	@interface MyNotifier : AEDefaultNotifier
	@end

	@implementation MyNotifier

	-(NSString*)nibNameForCategory:(NSString*)category
	{
	  return "MyNotificationView";
	}

	@end

This simple example of category assume that you have a file named `MyNotificationView.xib` in your main application bundle. If the method is not able to find a corresponding `.xib`, the notification will not be displayed and Engagement will output a message in the console.

The provided nib file should respect the following rules:

-   It should only contain one view.
-   Subviews should be of the same types as the ones inside the provided nib file named `AENotificationView.xib`
-   Subviews should have the same tags as the ones inside the provided nib file named `AENotificationView.xib`

> [AZURE.TIP] Just copy the provided nib file, named `AENotificationView.xib`, and start working from there. But be careful, the view inside this nib file is associated to the class `AENotificationView`. This class redefined the method `layoutSubViews` to move and resize its subviews according to context. You may want to replace it with an `UIView` or you custom view class.

If you need deeper customization of your notifications(if you want for instance to load your view directly from the code), it is recommended to take a look at the provided source code and class documentation of `Protocol ReferencesDefaultNotifier` and `AENotifier`.

Note that you can use the same notifier for multiple categories.

You can also redefined the default notifier like this:

	AEReachModule* reach = [AEReachModule moduleWithNotificationIcon:[UIImage imageNamed:@"icon.png"]];
	[reach registerNotifier:myNotifier forCategory:kAEReachDefaultCategory];

##### Notification handling

When using the default category, some life cycle methods are called on the `AEReachContent` object to report statistics and update the campaign state:

-   When the notification is displayed in application, the `displayNotification` method is called (which reports statistics) by `AEReachModule` if `handleNotification:` returns `YES`.
-   If the notification is dismissed, the `exitNotification` method is called, statistic is reported and next campaigns can now be processed.
-   If the notification is clicked, `actionNotification` is called, statistic is reported and the associated action is performed.

If your implementation of `AENotifier` bypasses the default behavior, you have to call these life cycle methods by yourself. The following examples illustrate some cases where the default behavior is bypassed:

-   You don't extend `AEDefaultNotifier`, e.g. you implemented category handling from scratch.
-   You overrode `prepareNotificationView:forContent:`, be sure to map at least `onNotificationActioned` or `onNotificationExited` to one of your U.I controls.

> [AZURE.WARNING] If `handleNotification:` throws an exception, the content is deleted and `drop` is called, this is reported in statistics and next campaigns can now be processed.

#### Include notification as part of an existing view

Overlays are great for a fast integration but can be sometimes not convenient, or can have unwanted side effects.

If you're not satisfied with the overlay system in some of your views, you can customize it for these views.

You can decide to include our notification layout in your existing views. To do so, there is two implementation styles:

1.  Add the notification view using interface builder

	-   Open *Interface Builder*
	-   Place a 320x60 (or 768x60 if you are on iPad) `UIView` where you want the notification to appear
	-   Set the Tag value for this view to : **36822491**

2.  Add the notification view programmatically. Just add the following code when your view has been initialized:

		UIView* notificationView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 320, 60)]; //Replace x and y coordinate values to your needs.
		notificationView.tag = NOTIFICATION_AREA_VIEW_TAG;
		[self.view addSubview:notificationView];

`NOTIFICATION_AREA_VIEW_TAG` macro can be found in `AEDefaultNotifier.h`.

> [AZURE.NOTE] The default notifier automatically detects that the notification layout is included in this view and will not add an overlay for it.

### Announcements and polls

#### Layouts

You can modify the files `AEDefaultAnnouncementView.xib` and `AEDefaultPollView.xib` as long as you keep the tag values and types of the existing subviews.

#### Categories

##### Alternate layouts

Like notifications, the campaign's category can be used to have alternate layouts for your announcements and polls.

To create a category for an announcement, you must extend **AEAnnouncementViewController** and register it once the reach module has been initialized:

	AEReachModule* reach = [AEReachModule moduleWithNotificationIcon:[UIImage imageNamed:@"icon.png"]];
	[reach registerAnnouncementController:[MyCustomAnnouncementViewController class] forCategory:@"my_category"];

> [AZURE.NOTE] Each time a user will click on a notification for an announcement with the category "my\_category", your registered view controller (in that case `MyCustomAnnouncementViewController`) will be initialized by calling the method `initWithAnnouncement:` and the view will be added to the current application window.

In your implementation of the `AEAnnouncementViewController` class you will have to read the property `announcement` to initialize your subviews. Consider the example below, where two labels are initialized using `title` and `body` properties of the `AEReachAnnouncement` class:

	-(void)loadView
	{
	    [super loadView];

	    UILabel* titleLabel = [[UILabel alloc] initWithFrame:CGRectMake(10, 20, 300, 60)];
	    titleLabel.font = [UIFont systemFontOfSize:32.0];
	    titleLabel.text = self.announcement.title;

	    UILabel* bodyLabel = [[UILabel alloc] initWithFrame:CGRectMake(10, 20, 300, 60)];
	    bodyLabel.font = [UIFont systemFontOfSize:24.0];
	    bodyLabel.text = self.announcement.body;

	    [self.view addSubview:titleLabel];
	    [self.view addSubview:bodyLabel];
	}

If you don't want to load your views by yourself but you just want to reuse the default announcement view layout, you can simply make your custom view controller extends the provided class `AEDefaultAnnouncementViewController`. In that case, duplicate the nib file `AEDefaultAnnouncementView.xib` and rename it so it can be loaded by your custom view controller (for a controller named `CustomAnnouncementViewController`, you should call your nib file `CustomAnnouncementView.xib`).

To replace the default category of announcements, simply register your custom view controller for the category defined in `kAEReachDefaultCategory`:

	[reach registerAnnouncementController:[MyCustomAnnouncementViewController class] forCategory:kAEReachDefaultCategory];

Polls can be customized the same way :

	AEReachModule* reach = [AEReachModule moduleWithNotificationIcon:[UIImage imageNamed:@"icon.png"]];
	[reach registerPollController:[MyCustomPollViewController class] forCategory:@"my_category"];

This time, the provided `MyCustomPollViewController` must extend `AEPollViewController`. Or you can choose to extend from the default controller: `AEDefaultPollViewController`.

> [AZURE.IMPORTANT] Don't forget to call either `action` (`submitAnswers:` for custom poll view controllers) or `exit` method before the view controller is dismissed. Otherwise, statistics won't be sent (i.e. no analytics on the campaign) and more importantly next campaigns will not be notified until the application process is restarted.

##### Implementation example

In this implementation the custom announcement view is loaded from an external xib file.

Like for advanced notification customization, it is recommended to look at the source code of the standard implementation.

`CustomAnnouncementViewController.h`

	//Interface
	@interface CustomAnnouncementViewController : AEAnnouncementViewController {
	  UILabel* titleLabel;
	  UITextView* descTextView;
	  UIWebView* htmlWebView;
	  UIButton* okButton;
	  UIButton* cancelButton;
	}

	@property (nonatomic, retain) IBOutlet UILabel* titleLabel;
	@property (nonatomic, retain) IBOutlet UITextView* descTextView;
	@property (nonatomic, retain) IBOutlet UIWebView* htmlWebView;
	@property (nonatomic, retain) IBOutlet UIButton* okButton;
	@property (nonatomic, retain) IBOutlet UIButton* cancelButton;

	-(IBAction)okButtonClicked:(id)sender;
	-(IBAction)cancelButtonClicked:(id)sender;

`CustomAnnouncementViewController.m`

	//Implementation
	@implementation CustomAnnouncementViewController
	@synthesize titleLabel;
	@synthesize descTextView;
	@synthesize htmlWebView;
	@synthesize okButton;
	@synthesize cancelButton;

	-(id)initWithAnnouncement:(AEReachAnnouncement*)anAnnouncement
	{
	  self = [super initWithNibName:@"CustomAnnouncementViewController" bundle:nil];
	  if (self != nil) {
	    self.announcement = anAnnouncement;
	  }
	  return self;
	}

	- (void) dealloc
	{
	  [titleLabel release];
	  [descTextView release];
	  [htmlWebView release];
	  [okButton release];
	  [cancelButton release];
	  [super dealloc];
	}

	- (void)viewDidLoad {
	  [super viewDidLoad];

	  /* Init announcement title */
	  titleLabel.text = self.announcement.title;

	  /* Init announcement body */
	  if(self.announcement.type == AEAnnouncementTypeHtml)
	  {
	    titleLabel.hidden = YES;
	    htmlWebView.hidden = NO;
	    [htmlWebView loadHTMLString:self.announcement.body baseURL:[NSURL URLWithString:@"http://localhost/"]];
	  }
	  else
	  {
	    titleLabel.hidden = NO;
	    htmlWebView.hidden = YES;
	    descTextView.text = self.announcement.body;
	  }

	  /* Set action button label */
	  if([self.announcement.actionLabel length] > 0)
	    [okButton setTitle:self.announcement.actionLabel forState:UIControlStateNormal];

	  /* Set exit button label */
	  if([self.announcement.exitLabel length] > 0)
	    [cancelButton setTitle:self.announcement.exitLabel forState:UIControlStateNormal];
	}

	#pragma mark Actions

	-(IBAction)okButtonClicked:(id)sender
	{
	    [self action];
	}

	-(IBAction)cancelButtonClicked:(id)sender
	{
	    [self exit];
	}

	@end
