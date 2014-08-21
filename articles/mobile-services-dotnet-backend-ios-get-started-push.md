<properties linkid="develop-mobile-tutorials-get-started-with-push-ios" urlDisplayName="Get Started with Push (iOS)" pageTitle="Get started with push notifications (iOS) | Mobile Dev Center" metaKeywords="" description="Learn how to use Azure Mobile Services to send push notifications to your iOS app." metaCanonical="http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-with-push-dotnet/" services="" documentationCenter="Mobile" title="Get started with push notifications in Mobile Services" solutions="" manager="dwrede" editor="" authors="krisragh" />

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-ios" ms.devlang="objective-c" ms.topic="article" ms.date="01/01/1900" ms.author="krisragh" />

 
# Get started with push notifications in Mobile Services

<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-dotnet-get-started-push/" title="Windows Store C#">Windows Store C#</a><a href="/en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-javascript-get-started-push/" title="Windows Store JavaScript">Windows Store JavaScript</a><a href="/en-us/documentation/articles/mobile-services-dotnet-backend-windows-phone-get-started-push/" title="Windows Phone">Windows Phone</a><a href="/en-us/documentation/articles/mobile-services-dotnet-backend-ios-get-started-push/" title="iOS" class="current">iOS</a><a href="/en-us/documentation/articles/mobile-services-dotnet-backend-android-get-started-push/" title="Android">Android</a>
<!-- <a href="/en-us/documentation/articles/mobile-services-dotnet-backend-xamarin-ios-get-started-push" title="Xamarin.iOS">Xamarin.iOS</a><a href="/en-us/documentation/articles/mobile-services-dotnet-backend-xamarin-android-get-started-push" title="Xamarin.Android">Xamarin.Android</a> -->
</div>

<div class="dev-center-tutorial-subselector"><a href="/en-us/documentation/articles/mobile-services-dotnet-backend-ios-get-started-push/" title=".NET backend" class="current">.NET backend</a> | <a href="/en-us/documentation/articles/mobile-services-javascript-backend-ios-get-started-push/"  title="JavaScript backend">JavaScript backend</a></div>

This topic shows you how to use Azure Mobile Services to send push notifications to an iOS app. In this tutorial you add push notifications using the Apple Push Notification service (APNS) to the quickstart project. When complete, your mobile service will send a push notification each time a record is inserted.


This tutorial walks you through these basic steps to enable push notifications:

1. [Generate the certificate signing request] 
2. [Register your app and enable push notifications]
3. [Create a provisioning profile for the app]
4. [Download the service locally]
5. [Test the mobile service]
6. [Update the server to send push notifications](#update-server)
7. [Publish the mobile service to Azure]
8. [Add push notifications to the app]
9. [Update scripts to send push notifications]
10. [Enable push notifications for local testing](#local-testing)
11. [Test the app against the published mobile service]

This tutorial requires the following:

+ [Mobile Services iOS SDK]
+ [XCode 4.5][Install Xcode] 
+ An iOS 6.0 (or later version) capable device
+ iOS Developer Program membership

   > [WACOM.NOTE] Because of push notification configuration requirements, you must deploy and test push notifications on an iOS capable device (iPhone or iPad) instead of in the emulator.

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete [Get started with Mobile Services]. 


[WACOM.INCLUDE [Enable Apple Push Notifications](../includes/enable-apple-push-notifications.md)]


## Configure Mobile Services to send push requests

[WACOM.INCLUDE [mobile-services-apns-configure-push](../includes/mobile-services-apns-configure-push.md)]

<h2><a name="download-the-service"></a><span class="short-header">Download the service</span>Download the service to your local computer</h2>

[WACOM.INCLUDE [mobile-services-ios-download-service-locally](../includes/mobile-services-ios-download-service-locally.md)]

<h2><a name="test-the-service"></a><span class="short-header">Test the service</span>Test the mobile service</h2>

[WACOM.INCLUDE [mobile-services-dotnet-backend-test-local-service](../includes/mobile-services-dotnet-backend-test-local-service.md)]

##<a id="update-server"></a>Update the server to send push notifications

1. In Visual Studio Solution Explorer, expand the **Controllers** folder in the mobile service project. Open TodoItemController.cs. At the top of the file, add the following `using` statements:


		using System;
		using System.Collections.Generic;

2. Update the `PostTodoItem` method definition with the following code:  

        public async Task<IHttpActionResult> PostTodoItem(TodoItem item)
        {
            TodoItem current = await InsertAsync(item);

            ApplePushMessage message = new ApplePushMessage(item.Text, TimeSpan.FromHours(1));

            try
            {
                var result = await Services.Push.SendAsync(message);
                Services.Log.Info(result.State.ToString());
            }
            catch (System.Exception ex)
            {
                Services.Log.Error(ex.Message, null, "Push.SendAsync Error");
            }
            return CreatedAtRoute("Tables", new { id = current.Id }, current);
        }

    This code will send a push notification (with the text of the inserted item) after inserting a todo item. In the event of an error, the code will add an error log entry which is viewable on the **Logs** tab of the mobile service in the Management Portal.


<h2><a name="publish-the-service"></a><span class="short-header">Publish the service</span>Publish the mobile service to Azure</h2>

[WACOM.INCLUDE [mobile-services-dotnet-backend-publish-service](../includes/mobile-services-dotnet-backend-publish-service.md)]

## Add push notifications to your app

1. In QSAppDelegate.m, replace the following handler method inside the implementation: 

        - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:
        (NSDictionary *)launchOptions
        {
            // Register for remote notifications
            [[UIApplication sharedApplication] registerForRemoteNotificationTypes:
            UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound];
            return YES;
        }

2. In QSAppDelegate.m, add the following handler method inside the implementation: 

        - (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:
        (NSData *)deviceToken {
			client.push.registerNative(deviceToken, @”uniqueTag”);
        }

4. In QSAppDelegate.m, add the following handler method inside the implementation: 

        // Handle any failure to register. 
        - (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:
        (NSError *)error {
            NSLog(@"Failed to register for remote notifications: %@", error);
        }

5. In QSAppDelegate.m, add the following handler method inside the implementation:  

        // Because alerts don't work when the app is running, the app handles them.
        // This uses the userInfo in the payload to display a UIAlertView.
        - (void)application:(UIApplication *)application didReceiveRemoteNotification:
        (NSDictionary *)userInfo {
            NSLog(@"%@", userInfo);
            UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Notification" message:
            [userInfo objectForKey:@"inAppMessage"] delegate:nil cancelButtonTitle:
            @"OK" otherButtonTitles:nil, nil];
            [alert show];
        }

5. In QSTodoListViewController.m, import the QSAppDelegate.h file so that you can use the delegate to obtain the device token: 

        #import "QSAppDelegate.h"

6. In QSTodoListViewController.m, modify the **(IBAction)onAdd** action by locating the following line: 

        NSDictionary *item = @{ @"text" : itemText.text, @"complete" : @(NO) }; 
 
   Replace this with the following code:

        // Get a reference to the AppDelegate to easily retrieve the deviceToken
        QSAppDelegate *delegate = [[UIApplication sharedApplication] delegate];
    
        NSDictionary *item = @{
            @"text" : itemText.text,
            @"complete" : @(NO),
            // add the device token property to our todo item payload
            @"deviceToken" : [[NSString alloc] initWithData:delegate.deviceToken encoding:NSUTF8StringEncoding]
        };

   This adds a reference to the **QSAppDelegate** to obtain the device token and then modifies the request payload to include that device token.

   > [WACOM.NOTE] You must add this code before to the call to the <strong>addItem</strong> method.

Your app is now updated to support push notifications.

##<a id="local-testing"></a> Enable push notifications for local testing

[WACOM.INCLUDE [mobile-services-dotnet-backend-configure-local-push](../includes/mobile-services-dotnet-backend-configure-local-push.md)]

## Test push notifications in your app

1. Press the **Run** button to build the project and start the app in an iOS capable device, then click **OK** to accept push notifications

  	![][23]

    > [WACOM.NOTE] You must explicitly accept push notifications from your app. This request only occurs the first time that the app runs.

2. In the app, type meaningful text, such as _A new Mobile Services task_ and then click the plus (**+**) icon.

  	![][24]

3. Verify that a notification is received, then click **OK** to dismiss the notification.

  	![][25]

4. Repeat step 2 and immediately close the app, then verify that the following push is shown.

  	![][26]

You have successfully completed this tutorial.

## Next steps

This tutorial demonstrated the basics of enabling an iOS app to use Mobile Services and Notification Hubs to send push notifications. Next, consider completing the next tutorial, [Send push notifications to authenticated users], which shows how to use tags to send push notifications from a Mobile Service to only an authenticated user.

<!--+ [Send push notifications to authenticated users]
	<br/>Learn how to use tags to send push notifications from a Mobile Service to only an authenticated user.

+ [Send broadcast notifications to subscribers]
	<br/>Learn how users can register and receive push notifications for categories they're interested in.

+ [Send template-based notifications to subscribers]
	<br/>Learn how to use templates to send push notifications from a Mobile Service, without having to craft platform-specific payloads in your back-end.
-->
Learn more about Mobile Services and Notification Hubs in the following topics:

* [Get started with data]
  <br/>Learn more about storing and querying data using mobile services.

* [Get started with authentication]
  <br/>Learn how to authenticate users of your app with different account types using mobile services.

* [What are Notification Hubs?]
  <br/>Learn more about how Notification Hubs works to deliver notifications to your apps across all major client platforms.

<!-- Anchors.  -->
[Generate the certificate signing request]: #certificates
[Register your app and enable push notifications]: #register
[Create a provisioning profile for the app]: #profile
[Configure Mobile Services]: #configure
[Update scripts to send push notifications]: #update-scripts
[Add push notifications to the app]: #add-push
[Insert data to receive notifications]: #test
[Test the app against the published mobile service]: #test-app
[Next Steps]:#next-steps
[Download the service locally]: #download-the-service-locally
[Test the mobile service]: #test-the-service
[Publish the mobile service to Azure]: #publish-mobile-service
   
<!-- Images. -->
[5]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-step5.png
[6]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-step6.png
[7]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-step7.png

[9]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-step9.png
[10]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-step10.png
[17]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-step17.png
[18]: ./media/mobile-services-ios-get-started-push/mobile-services-selection.png
[19]: ./media/mobile-services-ios-get-started-push/mobile-push-tab-ios.png
[20]: ./media/mobile-services-ios-get-started-push/mobile-push-tab-ios-upload.png
[21]: ./media/mobile-services-ios-get-started-push/mobile-portal-data-tables.png
[22]: ./media/mobile-services-ios-get-started-push/mobile-insert-script-push2.png
[23]: ./media/mobile-services-ios-get-started-push/mobile-quickstart-push1-ios.png
[24]: ./media/mobile-services-ios-get-started-push/mobile-quickstart-push2-ios.png
[25]: ./media/mobile-services-ios-get-started-push/mobile-quickstart-push3-ios.png
[26]: ./media/mobile-services-ios-get-started-push/mobile-quickstart-push4-ios.png
[28]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-step18.png

[101]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-01.png
[102]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-02.png
[103]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-03.png
[104]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-04.png
[105]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-05.png
[106]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-06.png
[107]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-07.png
[108]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-08.png

[110]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-10.png
[111]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-11.png
[112]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-12.png
[113]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-13.png
[114]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-14.png
[115]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-15.png
[116]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-16.png
[117]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-17.png

<!-- URLs. -->
[Install Xcode]: https://go.microsoft.com/fwLink/p/?LinkID=266532
[iOS Provisioning Portal]: http://go.microsoft.com/fwlink/p/?LinkId=272456
[Mobile Services iOS SDK]: https://go.microsoft.com/fwLink/p/?LinkID=266533
[Apple Push Notification Service]: http://go.microsoft.com/fwlink/p/?LinkId=272584
[Get started with Mobile Services]: /en-us/documentation/articles/mobile-services-dotnet-backend-ios-get-started
[Azure Management Portal]: https://manage.windowsazure.com/
[apns object]: http://go.microsoft.com/fwlink/p/?LinkId=272333

[Get started with data]: /en-us/documentation/articles/mobile-services-dotnet-backend-ios-get-started-data
[Get started with authentication]: /en-us/documentation/articles/mobile-services-dotnet-backend-ios-get-started-users

[Send push notifications to authenticated users]: /en-us/documentation/articles/mobile-services-dotnet-backend-ios-push-notifications-app-users/

[What are Notification Hubs?]: /en-us/documentation/articles/notification-hubs-overview/
[Send broadcast notifications to subscribers]: /en-us/documentation/articles/notification-hubs-ios-send-breaking-news/
[Send template-based notifications to subscribers]: /en-us/documentation/articles/notification-hubs-ios-send-localized-breaking-news/
