---
title: Push localized notifications to iOS devices using Azure Notification Hubs | Microsoft Docs
description: Learn how to use push localized notifications to iOS devices by using Azure Notification Hubs. 
services: notification-hubs
documentationcenter: ios
author: dimazaid
manager: kpiteira
editor: spelluru

ms.assetid: 484914b5-e081-4a05-a84a-798bbd89d428
ms.service: notification-hubs
ms.workload: mobile
ms.tgt_pltfrm: ios
ms.devlang: objective-c
ms.topic: article
ms.date: 04/14/2018
ms.author: dimazaid
---
# Tutorial: Push localized notifications to iOS devices using Azure Notification Hubs 

> [!div class="op_single_selector"]
> * [Windows Store C#](notification-hubs-windows-store-dotnet-xplat-localized-wns-push-notification.md)
> * [iOS](notification-hubs-ios-xplat-localized-apns-push-notification.md)

This tutorial shows you how to use the [templates](notification-hubs-templates-cross-platform-push-messages.md) feature of Azure Notification Hubs to broadcast breaking news notifications that have been localized by language and device. In this tutorial, you start with the iOS app created in [Use Notification Hubs to send breaking news]. When complete, you can register for categories you are interested in, specify a language in which to receive the notifications, and receive only push notifications for the selected categories in that language.

There are two parts to this scenario:

* iOS app allows client devices to specify a language, and to subscribe to different breaking news categories;
* The back-end broadcasts the notifications, using the **tag** and **template** features of Azure Notification Hubs.

In this tutorial, you take the following steps:

> [!div class="checklist"]
> * Update the app user interface
> * Build the iOS app
> * Send localized template notifications from .NET console app
> * Send localized template notifications from the device

## Overview

In [Use Notification Hubs to send breaking news], you built an app that used **tags** to subscribe to notifications for different news categories. Many apps, however, target multiple markets and require localization. It means that the content of the notifications themselves have to be localized and delivered to the correct set of devices. This tutorial shows you how to use the **template** feature of Notification Hubs to easily deliver localized breaking news notifications.

> [!NOTE]
> One way to send localized notifications is to create multiple versions of each tag. For instance, to support English, French, and Mandarin, you would need three different tags for world news: "world_en", "world_fr", and "world_ch". You would then have to send a localized version of the world news to each of these tags. In this topic, you use templates to avoid the proliferation of tags and the requirement of sending multiple messages.

At a high level, templates are a way to specify how a specific device should receive a notification. The template specifies the exact payload format by referring to properties that are part of the message sent by your app back-end. In your case, you send a locale-agnostic message containing all supported languages:

```json
{
    "News_English": "...",
    "News_French": "...",
    "News_Mandarin": "..."
}
```

Then you ensure that devices register with a template that refers to the correct property. For instance,  an iOS app that wants to register for French news registers using the following syntax:

```json
{
    aps:{
        alert: "$(News_French)"
    }
}
```

For more information on templates, see [Templates](notification-hubs-templates-cross-platform-push-messages.md) article.

## Prerequisites

- Complete the [Push notifications to specific iOS devices](notification-hubs-ios-xplat-segmented-apns-push-notification.md) tutorial and have the code available, because this tutorial builds directly upon that code.
- Visual Studio 2017 is optional.

## Update the app user interface

In this section, you modify the Breaking News app that you created in the topic [Use Notification Hubs to send breaking news] to send localized breaking news using templates.

In your **MainStoryboard_iPhone.storyboard**, add a Segmented Control with the three languages: English, French, and Mandarin.

![Creating the iOS UI storyboard][13]

Then make sure to add an IBOutlet in your ViewController.h as shown in the following image:

![Create outlets for the switches][14]

## Build the iOS app

1. In your Notification.h add the *retrieveLocale* method, and modify the store and subscribe methods as shown in the following code:

    ```objc
    - (void) storeCategoriesAndSubscribeWithLocale:(int) locale categories:(NSSet*) categories completion: (void (^)(NSError* error))completion;

    - (void) subscribeWithLocale:(int) locale categories:(NSSet*) categories completion:(void (^)(NSError *))completion;

    - (NSSet*) retrieveCategories;

    - (int) retrieveLocale;
    ```
    In your Notification.m, modify the *storeCategoriesAndSubscribe* method, by adding the locale parameter and storing it in the user defaults:

    ```objc
    - (void) storeCategoriesAndSubscribeWithLocale:(int) locale categories:(NSSet *)categories completion:(void (^)(NSError *))completion {
        NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
        [defaults setValue:[categories allObjects] forKey:@"BreakingNewsCategories"];
        [defaults setInteger:locale forKey:@"BreakingNewsLocale"];
        [defaults synchronize];

        [self subscribeWithLocale: locale categories:categories completion:completion];
    }
    ````

    Then modify the *subscribe* method to include the locale:

    ```objc
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

        [hub registerTemplateWithDeviceToken:self.deviceToken name:@"localizednewsTemplate" jsonBodyTemplate:template expiryTemplate:@"0" tags:categories completion:completion];
    }
    ```

    You use the method *registerTemplateWithDeviceToken*, instead of *registerNativeWithDeviceToken*. When you register for a template, you have to provide the json template and also a name for the template (as the app might want to register different templates). Make sure to register your categories as tags, as you want to make sure to receive the notifciations for those news.

    Add a method to retrieve the locale from the user default settings:

    ```objc
    - (int) retrieveLocale {
        NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];

        int locale = [defaults integerForKey:@"BreakingNewsLocale"];

        return locale < 0?0:locale;
    }
    ```

2. Now that you modified the Notifications class, you have to make sure that the ViewController makes use of the new UISegmentControl. Add the following line in the *viewDidLoad* method to make sure to show the locale that is currently selected:

    ```objc
    self.Locale.selectedSegmentIndex = [notifications retrieveLocale];
    ```

    Then, in your *subscribe* method, change your call to the *storeCategoriesAndSubscribe* to the following code:

    ```objc
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
    ```

3. Finally, you have to update the *didRegisterForRemoteNotificationsWithDeviceToken* method in your AppDelegate.m, so that you can correctly refresh your registration when your app starts. Change your call to the *subscribe* method of notifications with the following code:

    ```obj-c
    NSSet* categories = [self.notifications retrieveCategories];
    int locale = [self.notifications retrieveLocale];
    [self.notifications subscribeWithLocale: locale categories:categories completion:^(NSError* error) {
        if (error != nil) {
            NSLog(@"Error registering for notifications: %@", error);
        }
    }];
    ```

## (optional) Send localized template notifications from .NET console app

[!INCLUDE [notification-hubs-localized-back-end](../../includes/notification-hubs-localized-back-end.md)]

## (optional) Send localized template notifications from the device

If you don't have access to Visual Studio, or want to just test sending the localized template notifications directly from the app on the device. You can add the localized template parameters to the `SendNotificationRESTAPI` method you defined in the previous tutorial.

```objc
- (void)SendNotificationRESTAPI:(NSString*)categoryTag
{
    NSURLSession* session = [NSURLSession sessionWithConfiguration:[NSURLSessionConfiguration
                                defaultSessionConfiguration] delegate:nil delegateQueue:nil];

    NSString *json;

    // Construct the messages REST endpoint
    NSURL* url = [NSURL URLWithString:[NSString stringWithFormat:@"%@%@/messages/%@", HubEndpoint,
                                        HUBNAME, API_VERSION]];

    // Generated the token to be used in the authorization header.
    NSString* authorizationToken = [self generateSasToken:[url absoluteString]];

    //Create the request to add the template notification message to the hub
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    [request setHTTPMethod:@"POST"];

    // Add the category as a tag
    [request setValue:categoryTag forHTTPHeaderField:@"ServiceBusNotification-Tags"];

    // Template notification
    json = [NSString stringWithFormat:@"{\"messageParam\":\"Breaking %@ News : %@\","
            \"News_English\":\"Breaking %@ News in English : %@\","
            \"News_French\":\"Breaking %@ News in French : %@\","
            \"News_Mandarin\":\"Breaking %@ News in Mandarin : %@\","
            categoryTag, self.notificationMessage.text,
            categoryTag, self.notificationMessage.text,  // insert English localized news here
            categoryTag, self.notificationMessage.text,  // insert French localized news here
            categoryTag, self.notificationMessage.text]; // insert Mandarin localized news here

    // Signify template notification format
    [request setValue:@"template" forHTTPHeaderField:@"ServiceBusNotification-Format"];

    // JSON Content-Type
    [request setValue:@"application/json;charset=utf-8" forHTTPHeaderField:@"Content-Type"];

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
```

## Next steps

In this tutorial, you sent localized notifications to iOS devices. To learn how to push notifications to specific users of iOS apps, advance to the following tutorial: 

> [!div class="nextstepaction"]
>[Push notifications to specific users](notification-hubs-aspnet-backend-ios-apple-apns-notification.md)

<!-- Images. -->

[13]: ./media/notification-hubs-ios-send-localized-breaking-news/ios_localized1.png
[14]: ./media/notification-hubs-ios-send-localized-breaking-news/ios_localized2.png






<!-- URLs. -->
[How To: Service Bus Notification Hubs (iOS Apps)]: http://msdn.microsoft.com/library/jj927168.aspx
[Use Notification Hubs to send breaking news]: notification-hubs-ios-xplat-segmented-apns-push-notification.md
[Mobile Service]: /develop/mobile/tutorials/get-started
[Notify users with Notification Hubs: ASP.NET]: notification-hubs-aspnet-backend-ios-apple-apns-notification.md
[Notify users with Notification Hubs: Mobile Services]: notification-hubs-aspnet-backend-windows-dotnet-wns-notification.md
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

[Windows Developer Preview registration steps for Mobile Services]: ../mobile-services-windows-developer-preview-registration.md
[wns object]: http://go.microsoft.com/fwlink/p/?LinkId=260591
[Notification Hubs Guidance]: http://msdn.microsoft.com/library/jj927170.aspx
[Notification Hubs How-To for iOS]: http://msdn.microsoft.com/library/jj927168.aspx
