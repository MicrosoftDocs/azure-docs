<properties linkid="/documentation/articles/mobile-services-javascript-backend-windows-phone-push-notifications-app-users" pageTitle="Send push notifications to authenticated users" metaKeywords="push notifications, authentication, users, Notification Hubs, Mobile Services" description="Learn how to send push notifications to specific " metaCanonical="" services="mobile-services" documentationCenter="Mobile" title="Get started with authentication in Mobile Services" authors="glenga" solutions="Mobile" manager="" editor="" />

# Send push notifications to authenticated users

<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/documentation/articles/mobile-services-javascript-backend-windows-store-dotnet-push-notifications-app-users" title="Windows Store C#">Windows Store C#</a><a href="/en-us/documentation/articles/mobile-services-javascript-backend-windows-store-javascript-push-notifications-app-users" title="Windows Store JavaScript">Windows Store JavaScript</a><a href="/en-us/documentation/articles/mobile-services-javascript-backend-windows-phone-push-notifications-app-users" title="Windows Phone" >Windows Phone</a><a href="/en-us/documentation/articles/mobile-services-javascript-backend-ios-push-notifications-app-users" title="iOS" class="current">iOS</a><!--<a href="/en-us/documentation/articles/mobile-services-javascript-backend-android-push-notifications-app-users" title="Android">Android</a>--></div>

<div class="dev-center-tutorial-subselector"><a href="/en-us/documentation/articles/mobile-services-dotnet-backend-ios-push-notifications-app-users/" title=".NET backend">.NET backend</a> | <a href="/en-us/documentation/articles/mobile-services-javascript-backend-ios-push-notifications-app-users/"  title="JavaScript backend" class="current">JavaScript backend</a></div>

This topic shows you how to send push notifications to an authenticate user on any registered iOS device. Unlike the previous [push notification][Get started with push notifications] tutorial, this tutorial changes your mobile service to require that a user be authenticated before the iOS client can register with the notification hub for push notifications. Registration is also modified to add a tag based on the assigned user ID. Finally, the server script is updated to send the notification only to the authenticated user instead of to all registrations.

This tutorial walks you through the following process:

+ [Updating the service to require authentication for registration]
+ [Updating the app to log in before registration]
+ [Testing the app]
 
This tutorial supports Windows Phone 8.0 and Windows Phone 8.1 ("Silverlight") apps. For Windows Phone 8.1 Store apps, see the [Windows Store version of this topic](/en-us/documentation/articles/mobile-services-javascript-backend-windows-store-dotnet-push-notifications-app-users).

##Prerequisites 

Before you start this tutorial, you must have already completed these Mobile Services tutorials:

+ [Get started with authentication]<br/>Adds a login requirement to the TodoList sample app.

+ [Get started with push notifications]<br/>Configures the TodoList sample app for push notifications by using Notification Hubs. 

After you have completed both tutorials, you can prevent unauthenticated users from registering for push notifications from your mobile service.

##<a name="register"></a>Update the service to require authentication to register

[WACOM.INCLUDE [mobile-services-javascript-backend-push-notifications-app-users](../includes/mobile-services-javascript-backend-push-notifications-app-users.md)] 

<ol start="5"><li><p>Replace the insert function with the following code, then click <strong>Save</strong>:</p>
<pre><code>function insert(item, user, request) {

        function insert(item, user, request) {
            request.execute();
            setTimeout(function() {
                push.apns.send(null, {
                    alert: "Alert: " + item.text,
                    payload: {
                        "Hey, a new item arrived: '" + item.text + "'"
                    }
                });
            }, 2500);
        }

}</code></pre>

<p>This insert script uses the user ID tag to send a push notification (with the text of the inserted item) to all Windows Phone (MPNS) app registrations created by the logged-in user.</p></li></ol>

##<a name="update-app"></a>Update the app to log in before registration


Next, you need to change the way that push notifications are registered to make sure that the user is authenticated before registration is attempted. 

1. In **QSAppDelegate.m**, remove the implementation of **didFinishLaunchingWithOptions**:

		
		- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:
		(NSDictionary *)launchOptions
		{
		    // Register for remote notifications
		    [[UIApplication sharedApplication] registerForRemoteNotificationTypes:
		    UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound];
		    return YES;
		}

2. Open the project file **QSTodoListViewController.m** and in the **viewDidLoad** method, add the code removed above to the add:

	
		- (void)viewDidAppear:(BOOL)animated
		{
		    MSClient *client = self.todoService.client;
		
		    if (client.currentUser != nil) {
		        return;
		    }
		
		    [client loginWithProvider:@"facebook" controller:self animated:YES completion:^(MSUser *user, NSError *error) {
		        [self refresh];
		    }];
		
		    // Register for remote notifications
		    [[UIApplication sharedApplication] registerForRemoteNotificationTypes:
		    UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound];
		    return YES;
		}




##<a name="test"></a>Test the app

1. Press the **Run** button to build the project and start the app in an iOS capable device, then click **OK** to accept push notifications

  	![][23]

    > [WACOM.NOTE] You must explicitly accept push notifications from your app. This request only occurs the first time that the app runs.

2. Log in using the selected identity provider and verify that authentication succeeds.

3. In the app, type meaningful text, such as _A new Mobile Services task_ and then click the plus (**+**) icon.

  	![][24]

4. Verify that a notification is received, then click **OK** to dismiss the notification.

  	![][25]

5. Repeat step 2 and immediately close the app, then verify that the following push is shown.

  	![][26]

You have successfully completed this tutorial.



<!-- Anchors. -->
[Updating the service to require authentication for registration]: #register
[Updating the app to log in before registration]: #update-app
[Testing the app]: #test
[Next Steps]:#next-steps


<!-- URLs. -->
[Get started with authentication]: /en-us/documentation/articles/mobile-services-ios-get-started-users/
[Get started with push notifications]: /en-us/documentation/articles/mobile-services-javascript-backend-ios-get-started-push/

[Azure Management Portal]: https://manage.windowsazure.com/
[Mobile Services .NET How-to Conceptual Reference]: /en-us/develop/mobile/how-to-guides/work-with-net-client-library

[23]: ./media/mobile-services-ios-get-started-push/mobile-quickstart-push1-ios.png
[24]: ./media/mobile-services-ios-get-started-push/mobile-quickstart-push2-ios.png
[25]: ./media/mobile-services-ios-get-started-push/mobile-quickstart-push3-ios.png
[26]: ./media/mobile-services-ios-get-started-push/mobile-quickstart-push4-ios.png