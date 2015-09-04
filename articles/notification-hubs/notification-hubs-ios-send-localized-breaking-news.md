<properties
	pageTitle="Notification Hubs Localized Breaking News Tutorial for iOS"
	description="Learn how to use Azure Service Bus Notification Hubs to send localized breaking news notifications (iOS)."
	services="notification-hubs"
	documentationCenter="ios"
	authors="wesmc7777"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="notification-hubs"
	ms.workload="mobile"
	ms.tgt_pltfrm="ios"
	ms.devlang="objective-c"
	ms.topic="article"
	ms.date="06/16/2015"
	ms.author="wesmc"/>
# Use Notification Hubs to send localized breaking news to iOS devices

> [AZURE.SELECTOR]
- [Windows Store C#](notification-hubs-windows-store-dotnet-send-localized-breaking-news)
- [iOS](notification-hubs-ios-send-localized-breaking-news)


##Overview

This topic shows you how to use the **template** feature of Azure Notification Hubs to broadcast breaking news notifications that have been localized by language and device. In this tutorial you start with the Windows Store app created in [Use Notification Hubs to send breaking news]. When complete, you will be able to register for categories you are interested in, specify a language in which to receive the notifications, and receive only push notifications for the selected categories in that language.


There are two parts to this scenario:

- iOS app allows client devices to specify a language, and to subscribe to different breaking news categories;

- the back-end broadcasts the notifications, using the **tag** and **template** feautres of Azure Notification Hubs.



##Prerequisites

You must have already completed the [Use Notification Hubs to send breaking news] tutorial and have the code available, because this tutorial builds directly upon that code.

You also need Visual Studio 2012.



##Template concepts

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

Templates are a very powerful feature you can learn more about in our [Notification Hubs Guidance] article. A reference for the template expression language is in our [How To: Service Bus Notification Hubs (iOS Apps)].

##The app user interface

We will now modify the Breaking News app that you created in the topic [Use Notification Hubs to send breaking news] to send localized breaking news using templates.


In your MainStoryboard_iPhone.storyboard, add a Segmented Control with the three languages we support: English, French, and Mandarin.

![][13]

Then make sure to add an IBOutlet in your ViewController.h as shown below:

![][14]

##Building the iOS app

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

##Send localized notifications from your back-end

[AZURE.INCLUDE [notification-hubs-localized-back-end](../../includes/notification-hubs-localized-back-end.md)]


## Next Steps

For more information on using templates, see:

- [Notify users with Notification Hubs: ASP.NET]
- [Notify users with Notification Hubs: Mobile Services]
- [Notification Hubs Guidance]

A reference for the template expression language is in [Notification Hubs How-To for iOS].






<!-- Images. -->

[13]: ./media/notification-hubs-ios-send-localized-breaking-news/ios_localized1.png
[14]: ./media/notification-hubs-ios-send-localized-breaking-news/ios_localized2.png






<!-- URLs. -->
[How To: Service Bus Notification Hubs (iOS Apps)]: http://msdn.microsoft.com/library/jj927168.aspx
[Use Notification Hubs to send breaking news]: /manage/services/notification-hubs/breaking-news-ios
[Mobile Service]: /develop/mobile/tutorials/get-started
[Notify users with Notification Hubs: ASP.NET]: /manage/services/notification-hubs/notify-users-aspnet
[Notify users with Notification Hubs: Mobile Services]: /manage/services/notification-hubs/notify-users
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253
[Get started with Mobile Services]: /develop/mobile/tutorials/get-started/#create-new-service
[Get started with data]: /develop/mobile/tutorials/get-started-with-data-ios
[Get started with authentication]: /develop/mobile/tutorials/get-started-with-users-ios
[Get started with push notifications]: /develop/mobile/tutorials/get-started-with-push-ios
[Push notifications to app users]: /develop/mobile/tutorials/push-notifications-to-users-ios
[Authorize users with scripts]: /develop/mobile/tutorials/authorize-users-in-scripts-ios
[JavaScript and HTML]: ../get-started-with-push-js.md

[Azure Management Portal]: https://manage.windowsazure.com/
[Windows Developer Preview registration steps for Mobile Services]: ../mobile-services-windows-developer-preview-registration.md
[wns object]: http://go.microsoft.com/fwlink/p/?LinkId=260591
[Notification Hubs Guidance]: http://msdn.microsoft.com/library/jj927170.aspx
[Notification Hubs How-To for iOS]: http://msdn.microsoft.com/library/jj927168.aspx
