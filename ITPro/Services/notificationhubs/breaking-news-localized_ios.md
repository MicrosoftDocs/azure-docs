<properties linkid="develop-notificationhubs-tutorials-send-localized-breaking-news-iOS" writer="ricksal" urlDisplayName="Localized Breaking News" pageTitle="Notification Hubs Localized Breaking News Tutorial for iOS" metaKeywords="" metaDescription="Learn how to use Windows Azure Service Bus Notification Hubs to send localized breaking news notifications (iOS)." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu-windows-store.md" />

# Use Notification Hubs to send localized breaking news to iOS devices

<div class="dev-center-tutorial-selector sublanding"> 
		<a href="/en-us/manage/services/notification-hubs/notify-users-mobile-ios" title="iOS" class="current">iOS</a>
    	<a href="/en-us/manage/services/notification-hubs/notify-users-aspnet" title="Windows Store C#">Windows Store C#</a>
</div>


This topic shows you how to use the **template** feature of Windows Azure Notification Hubs to broadcast breaking news notifications that have been localized by language and device. In this tutorial you start with the Windows Store app created in [Use Notification Hubs to send breaking news]. When complete, you will be able to register for categories you are interested in, specify a language in which to receive the notifications, and receive only push notifications for the selected categories in that language.

This tutorial walks you through these basic steps to enable this scenario:

1. [Template concepts] 
2. [The app user interface]
3. [Building the iOS app]
4. [Send notifications from your back-end]


There are two parts to this scenario:

- iOS app allows client devices to specify a language, and to subscribe to different breaking news categories; 

- the back-end broadcasts the notifications, using the **tag** and **template** feautres of Windows Azure Notification Hubs.



##Prerequisites ##

You must have already completed the [Use Notification Hubs to send breaking news] tutorial and have the code available, because this tutorial builds directly upon that code. 

You also need Visual Studio 2012.



<h2><a name="concepts"></a><span class="short-header">concepts</span>Template concepts</h2>

In [Use Notification Hubs to send breaking news] you built an app that used **tags** to subscribe to notifications for different news categories.
Many apps, however, target multiple markets and require localization. This means that the content of the notifications themselves have to be localized and delivered to the correct set of devices.
In this topic we will show how to use the **template** feature of Notification Hubs to easily deliver localized breaking news notifications.

Note: one way to send localized notifications is to create multiple versions of each tag. For instance, to support English, French, and Mandarin, we would need three different tags for world news: "world_en", "world_fr", and "world_ch". We would then have to send a localized version of the world news to each of these tags. In this topic we use templates to avoid the proliferation of tags and the requirement of sending multiple messages.

At a high level, templates are a way to specify how a specific device should receive a notification. The template specifies the exact payload format by referring to properties that are part of the message sent by your app back-end. In our case, we will send a locale-agnostic message containing all supported languages:

		{
			"News_English": "...",
			"News_French": "...",
			"News_Mandarin": "..."
		}

Then we will ensure that devices register with a template that refers to the correct property. For instance,  an iOS app that wants to register for French news will register the following:

		{
			aps:{
				alert: "$(News_French)"
			}
		}

Templates are a very powerful feature you can learn more about in our [Notification Hubs Guidance] article. A reference for the template expression language is in our TBD-link [Notification Hubs How-To for Windows Store].

<h2><a name="ui"></a><span class="short-header">App ui</span>The app user interface</h2>

We will now modify the Breaking News app that you created in the topic [Use Notification Hubs to send breaking news] to send localized breaking news using templates.


In your MainStoryboard_iPhone.storyboard, add a Segmented Control with the three languages we support: English, French, and Mandarin.

	![][13]
	
Then make sure to add an IBOutlet in your ViewController.h as shown below:
	
	![][14]
	
<h2><a name="building-client"></a><span class="building app">App ui</span>Building the iOS app</h2>

In order to adapt your client apps to receive localized messages, you have to replace your *native* registrations (i.e. registrations that do you specify a template) with template registrations.

1. In your Notification.h add the *retrieveLocale* method, and modify the store and subscribe methods as shown below:

		- (void) storeCategoriesAndSubscribeWithLocale:(int) locale categories:(NSSet*) categories completion: (void (^)(NSError* error))completion;

		- (void) subscribeWithLocale:(int) locale categories:(NSSet*) categories completion:(void (^)(NSError *))completion;
		
		- (NSSet*) retrieveCategories;
		
		- (int) retrieveLocale;
		
	In your Notification.m, modify the *storeCategoriesAndSubscribe* method, by adding the locale parameter and storing it in the user defaults:
	
		- (void) storeCategoriesAndSubscribeWithLocale:(int) locale categories:(NSSet *)categories completion:(void (^)(NSError *))completion {
		    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
		    [defaults setValue:[categories allObjects] forKey:@"BreakingNewsCategories"];
		    [defaults setInteger:locale forKey:@"BreakingNewsLocale"];
		    [defaults synchronize];
		    
		    [self subscribeWithLocale: locale categories:categories completion:completion];
		}

	Then modify the *subscribe* method to include the locale:
	
		- (void) subscribeWithLocale: (int) locale categories:(NSSet *)categories completion:(void (^)(NSError *))completion{
		    SBNotificationHub* hub = [[SBNotificationHub alloc] initWithConnectionString:@"<connection string>" notificationHubPath:@"<hub name>"];
		    
		    NSString* localeString;
		    switch (locale) {
		        case 0:
		            localeString = @"English";
		            break;
		        case 1:
		            localeString = @"French";
		            break;
		        case 2:
		            localeString = @"Mandarin";
		            break;
		    }
		    
		    NSString* template = [NSString stringWithFormat:@"{\"aps\":{\"alert\":\"$(News_%@)\"},\"inAppMessage\":\"$(News_%@)\"}", localeString, localeString];
		    
		    [hub registerTemplateWithDeviceToken:self.deviceToken name:@"newsTemplate" jsonBodyTemplate:template expiryTemplate:@"0" tags:categories completion:completion];
		}
		
	Note how we are now using the method *registerTemplateWithDeviceToken*, instead of *registerNativeWithDeviceToken*. When we register for a template we have to provide the json template and also a name for the template (as our app might want to register different templates). Make sure to register your categories as tags, as we want to make sure to receive the notifciations for those news.
	
	Finally, add a method to retrieve the locale from the user default settings:
	
		- (int) retrieveLocale {
		    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
		    
		    int locale = [defaults integerForKey:@"BreakingNewsLocale"];
		    
		    return locale < 0?0:locale;
		}
		
3. Now that we modified our Notifications class, we have to make sure that our ViewController makes use of the new UISegmentControl. Add the following line in the *viewDidLoad* method to make sure to show the locale that is currently selected:

		self.Locale.selectedSegmentIndex = [notifications retrieveLocale];
		
	Then, in your *subscribe* method, change your call to the *storeCategoriesAndSubscribe* to the following:
	
		[notifications storeCategoriesAndSubscribeWithLocale: self.Locale.selectedSegmentIndex categories:[NSSet setWithArray:categories] completion: ^(NSError* error) {
	        if (!error) {
	            UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Notification" message:
	                                  @"Subscribed!" delegate:nil cancelButtonTitle:
	                                  @"OK" otherButtonTitles:nil, nil];
	            [alert show];
	        } else {
	            NSLog(@"Error subscribing: %@", error);
	        }
	    }];
	    
4. Finally, you have to update the *didRegisterForRemoteNotificationsWithDeviceToken* method in your AppDelegate.m, so that you can correctly refresh your registration when your app starts. Change your call to the *subscribe* method of notifications with the following:

		NSSet* categories = [notifications retrieveCategories];
	    int locale = [notifications retrieveLocale];
	    [notifications subscribeWithLocale: locale categories:categories completion:^(NSError* error) {
	        if (error != nil) {
	            NSLog(@"Error registering for notifications: %@", error);
	        }
	    }];


<div chunk="../chunks/notification-hubs-localized-back-end.md" />


## Next Steps

For more information on using templates, see [Notify users with Notification Hubs: ASP.NET], [Notify users with Notification Hubs: Mobile Services] and also see [Notification Hubs Guidance]. A reference for the template expression language is [Notification Hubs How-To for Windows Store].

		
<!-- Anchors. -->
[Template concepts]: #concepts
[The app user interface]: #ui
[Building the iOS app]: #building-client
[Send notifications from your back-end]: #send
[Next Steps]: #next-steps

<!-- Images. -->

[0]: mobile-services-submit-win8-app.png
[1]: ../media/notification-hub-breakingnews-win1.png
[2]: notification-hub-create-win8-app.png
[3]: notification-hub-associate-win8-app.png
[4]: mobile-services-select-app-name.png
[5]: mobile-services-win8-edit-app.png
[6]: mobile-services-win8-app-push-auth.png
[11]: notification-hub-configure-wns.png
[12]: notification-hub-connection-strings.png
[13]: ../media/ios_localized1.png
[14]: ../media/ios_localized2.png
[15]: ../media/notification-hub-scheduler1.png
[16]: ../media/notification-hub-scheduler2.png
[17]: mobile-services-win8-edit2-app.png
[18]: notification-hub-win8-app-toast.png
[19]: notification-hub-windows-reg.png

<!-- URLs. -->
[Get started with Notification Hubs]: mobile-services-get-started-with-notification-hub-dotnet.md
[Use Notification Hubs to send breaking news]: breaking-news-ios.md
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
[Notification Hubs How-To for Windows Store]: http://msdn.microsoft.com/en-us/library/jj927172.aspx
