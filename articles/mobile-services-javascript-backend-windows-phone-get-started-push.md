<properties pageTitle="Get started with push notifications (Windows Store) | Mobile Dev Center" metaKeywords="" description="Learn how to use Azure Mobile Services and Notification Hubs to send push notifications to your Windows Store app." metaCanonical="" services="mobile" documentationCenter="Mobile" title="Get started with push notifications in Mobile Services" authors="glenga" solutions="" manager="" editor="" />


# Get started with push notifications in Mobile Services

<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/documentation/articles/mobile-services-javascript-backend-windows-store-dotnet-get-started-push" title="Windows Store C#">Windows Store C#</a><a href="/en-us/documentation/articles/mobile-services-javascript-backend-windows-store-javascript-get-started-push" title="Windows Store JavaScript">Windows Store JavaScript</a><a href="/en-us/documentation/articles/mobile-services-javascript-backend-windows-phone-get-started-push" title="Windows Phone" class="current">Windows Phone</a><a href="/en-us/documentation/articles/mobile-services-ios-get-started-push" title="iOS">iOS</a><a href="/en-us/documentation/articles/mobile-services-javascript-backend-android-get-started-push" title="Android">Android</a></div>

<div class="dev-center-tutorial-subselector"><a href="/en-us/documentation/articles/mobile-services-dotnet-backend-windows-phone-get-started-push/" title=".NET backend">.NET backend</a> | <a href="/en-us/documentation/articles/mobile-services-javascript-backend-windows-phone-get-started-push/"  title="JavaScript backend" class="current">JavaScript backend</a></div>

This topic shows you how to use Azure Mobile Services to send push notifications to a Windows Phone Silverlight app. In this tutorial you enable push notifications using Azure Notification Hubs to the quickstart project. When complete, your mobile service will send a push notification using Notification Hubs each time a record is inserted. The notification hub that you create is free with your mobile service, can be managed independent of the mobile service, and can be used by other applications and services.

>[WACOM.NOTE]This tutorial demonstrates Mobile Services integration with Notification Hubs, which is currently in preview. By default, sending push notifications using Notification Hubs is not enabled from a JavaScript backend.  Once the new notification hub has been created, the integration process cannot be reverted. 

This tutorial walks you through these basic steps to enable push notifications:

1. [Update the app to register for notifications](#update-app)
2. [Update server scripts to send push notifications](#update-scripts)
3. [Insert data to receive push notifications](#test)

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete either [Get started with Mobile Services] or [Get started with data] to connect your project to the mobile service. When a mobile service has not been connected, the Add Push Notification wizard creates this connection for you. 

>[WACOM.NOTE]To send push notifications to a Windows Phone Store app, follow the [Windows Store app](/en-us/documentation/articles/mobile-services-javascript-backend-windows-store-dotnet-get-started-push) version of this tutorial.

##<a id="update-app"></a> Update the app to register for notifications

Before your app can receive push notifications, you must register a notification channel.

1. In Visual Studio, open the file App.xaml.cs and add the following `using` statement:

        using Microsoft.Phone.Notification;

3. Add the following to App.xaml.cs:
	
        public static HttpNotificationChannel CurrentChannel { get; private set; }

        private void AcquirePushChannel()
        {
            CurrentChannel = HttpNotificationChannel.Find("MyPushChannel");

            if (CurrentChannel == null)
            {
                CurrentChannel = new HttpNotificationChannel("MyPushChannel");
                CurrentChannel.Open();
                CurrentChannel.BindToShellToast();
            }

            CurrentChannel.ChannelUriUpdated +=
                new EventHandler<NotificationChannelUriEventArgs>(async (o, args) =>
                {

                    // Register for notifications using the new channel
                    await MobileService.GetPush()
                        .RegisterNativeAsync(CurrentChannel.ChannelUri.ToString());
                });
        }

    This code retrieves the ChannelURI for the app from WNS, and then registers that ChannelURI for push notifications.

	>[WACOM.NOTE]In this this tutorial, the mobile service sends a toast notification to the device. When you send a tile notification, you must instead call the **BindToShellTile** method on the channel.

4. At the top of the **Application_Launching** event handler in App.xaml.cs, add the following call to the new **AcquirePushChannel** method:

        AcquirePushChannel();

	This makes sure that registration is requested every time that the page is loaded. In your app, you may only want to make this registration periodically to ensure that the registration is current. 

5. Press the **F5** key to run the app. A popup dialog with the registration key is displayed.
  
6.	In the Solution Explorer, expand **Properties**, open the WMAppManifest.xml file, click the **Capabilities** tab and make sure that the **ID___CAP___PUSH_NOTIFICATION** capability is checked.

   	![][1]

   	This makes sure that your app can raise toast notifications. 

##<a id="update-scripts"></a> Update server scripts to send push notifications

Finally, you must update the script registered to the insert operation on the TodoItem table to send notifications.

1. Click **TodoItem**, click **Script** and select **Insert**. 

   	![][10]

2. Replace the insert function with the following code, and then click **Save**:

		function insert(item, user, request) {
		// Define a payload for the Windows Phone toast notification.
		var payload = '<?xml version="1.0" encoding="utf-8"?>' +
		    '<wp:Notification xmlns:wp="WPNotification"><wp:Toast>' +
		    '<wp:Text1>New Item</wp:Text1><wp:Text2>' + item.text + 
		    '</wp:Text2></wp:Toast></wp:Notification>';
		
		request.execute({
		    success: function() {
		        // If the insert succeeds, send a notification.
		    	push.mpns.send(null, payload, 'toast', 22, {
		            success: function(pushResponse) {
		                console.log("Sent push:", pushResponse);
						request.respond();
		                },              
		                error: function (pushResponse) {
		                    console.log("Error Sending push:", pushResponse);
							request.respond(500, { error: pushResponse });
		                    }
		                });
		            }
		        });      
		}

	This insert script sends a push notification (with the text of the inserted item) to all Windows Phone app registrations after the insert succeeds.

3. Click the **Push** tab, check **Enable unauthenticated push notifications**, then click **Save**.

	![][11]

	This enables the mobile service to connect to MPNS in unauthenticated mode to send push notifications.

	>[WACOM.NOTE]This tutorial uses MPNS in unauthenticated mode. In this mode, MPNS limits the number of notifications that can be sent to a device channel. To remove this restriction, you must generate and upload a certificate by clicking **Upload** and selecting the certificate. For more information on generating the certificate, see [Setting up an authenticated web service to send push notifications for Windows Phone].

##<a id="test"></a> Test push notifications in your app

1. In Visual Studio, press the F5 key to run the app.

5. In the app, enter the text "hello push" in the textbox, and then click **Save**.

   	![][4]

  	This sends an insert request to the mobile service to store the added item. Notice that the application receives a toast notification that says **hello push**.

## <a name="next-steps"> </a>Next steps

This tutorial demonstrated the basics of enabling a Windows Store app to work with data in Mobile Services. Next, consider completing one of the following tutorials that is based on the GetStartedWithData app that you created in this tutorial:

+ [Get started with Notification Hubs]
  <br/>Learn how to leverage Notification Hubs in your Windows Store app.

+ [Send notifications to subscribers]
	<br/>Learn how users can register and receive push notifications for categories they're interested in.

+ [Send notifications to users]
	<br/>Learn how to send push notifications from a Mobile Service to specific users on any device.

+ [Send cross-platform notifications to users]
	<br/>Learn how to use templates to send push notifications from a Mobile Service, without having to craft platform-specific payloads in your back-end.

Consider finding out more about the following Mobile Services topics:

* [Get started with data]
  <br/>Learn more about storing and querying data using Mobile Services.

* [Get started with authentication]
  <br/>Learn how to authenticate users of your app with Windows Account.

* [Mobile Services server script reference]
  <br/>Learn more about registering and using server scripts.

* [Mobile Services .NET How-to Conceptual Reference]
  <br/>Learn more about how to use Mobile Services with .NET.

<!-- Anchors. -->

<!-- Images. -->
[1]: ./media/mobile-services-javascript-backend-windows-phone-get-started-push/mobile-app-enable-push-wp8.png
[2]: ./media/mobile-services-javascript-backend-windows-phone-get-started-push/mobile-quickstart-push1-wp8.png
[3]: ./media/mobile-services-javascript-backend-windows-phone-get-started-push/mobile-quickstart-push2-wp8.png
[4]: ./media/mobile-services-javascript-backend-windows-phone-get-started-push/mobile-quickstart-push3-wp8.png
[5]: ./media/mobile-services-javascript-backend-windows-phone-get-started-push/mobile-quickstart-push4-wp8.png
[10]: ./media/mobile-services-javascript-backend-windows-phone-get-started-push/mobile-insert-script-push2.png
[11]: ./media/mobile-services-javascript-backend-windows-phone-get-started-push/mobile-push-tab.png

<!-- URLs. -->
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253
[Get started with Mobile Services]: /en-us/documentation/articles/mobile-services-windows-phone-get-started
[Get started with data]: /en-us/documentation/articles/mobile-services-windows-phone-get-started-data
[Get started with authentication]: /en-us/documentation/articles/mobile-services-windows-phone-get-started-users
[Get started with push notifications]: /en-us/documentation/articles/mobile-services-windows-phone-get-started-push

[Get started with Notification Hubs]: /en-us/manage/services/notification-hubs/getting-started-windows-dotnet/
[What are Notification Hubs?]: /en-us/develop/net/how-to-guides/service-bus-notification-hubs/
[Send notifications to subscribers]: /en-us/manage/services/notification-hubs/breaking-news-dotnet/
[Send notifications to users]: /en-us/manage/services/notification-hubs/notify-users/
[Send cross-platform notifications to users]: /en-us/manage/services/notification-hubs/notify-users-xplat-mobile-services/
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[Mobile Services .NET How-to Conceptual Reference]: /en-us/documentation/articles/mobile-services-windows-dotnet-how-to-use-client-library
[Setting up an authenticated web service to send push notifications for Windows Phone]: http://msdn.microsoft.com/en-us/library/windowsphone/develop/ff941099(v=vs.105).aspx
