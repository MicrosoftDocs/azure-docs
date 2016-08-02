<properties
	pageTitle="Add push notifications to your Mobile Services app (Windows Phone) | Microsoft Azure"
	description="Learn how to use Azure Mobile Services and Notification Hubs to send push notifications to your Windows Phone app."
	services="mobile-services,notification-hubs"
	documentationCenter="windows"
	authors="ggailey777"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="mobile-services"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-windows-phone"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="07/21/2016"
	ms.author="glenga"/>


# Add push notifications to your Mobile Services app

[AZURE.INCLUDE [mobile-services-selector-get-started-push](../../includes/mobile-services-selector-get-started-push.md)]

##Overview

This topic shows you how to use Azure Mobile Services to send push notifications to a Windows Phone Silverlight app. In this tutorial you enable push notifications using Azure Notification Hubs to the quickstart project. When complete, your mobile service will send a push notification using Notification Hubs each time a record is inserted. The notification hub that you create is free with your mobile service, can be managed independent of the mobile service, and can be used by other applications and services.

This tutorial is based on the TodoList sample app. Before you start this tutorial, you must first complete the topic [Add Mobile Services to an existing app] to connect your project to the mobile service. When a mobile service has not been connected, the Add Push Notification wizard can create this connection for you.

>[AZURE.NOTE] To send push notifications to a Windows Phone 8.1 Store app, follow the [Windows Store app](mobile-services-javascript-backend-windows-universal-dotnet-get-started-push.md) version of this tutorial.

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

    This code retrieves the ChannelURI for the app from the Microsoft Push Notification Service (MPNS) used by Windows Phone 8.x "Silverlight", and then registers that ChannelURI for push notifications.

	>[AZURE.NOTE]In this this tutorial, the mobile service sends a toast notification to the device. When you send a tile notification, you must instead call the **BindToShellTile** method on the channel.

4. At the top of the **Application_Launching** event handler in App.xaml.cs, add the following call to the new **AcquirePushChannel** method:

        AcquirePushChannel();

	This makes sure that registration is requested every time that the page is loaded. In your app, you may only want to make this registration periodically to ensure that the registration is current.

5. Press the **F5** key to run the app. A popup dialog with the registration key is displayed.

6.	In the Solution Explorer, expand **Properties**, open the WMAppManifest.xml file, click the **Capabilities** tab and make sure that the **ID___CAP___PUSH_NOTIFICATION** capability is checked.

   	![Enable notifications in VS](./media/mobile-services-javascript-backend-windows-phone-get-started-push/mobile-app-enable-push-wp8.png)

   	This makes sure that your app can raise toast notifications.

##<a id="update-scripts"></a> Update server scripts to send push notifications

Finally, you must update the script registered to the insert operation on the TodoItem table to send notifications.

1. Click **TodoItem**, click **Script** and select **Insert**.

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

	This enables the mobile service to connect to MPNS in unauthenticated mode to send push notifications.

	>[AZURE.NOTE]This tutorial uses MPNS in unauthenticated mode. In this mode, MPNS limits the number of notifications that can be sent to a device channel. To remove this restriction, you must generate and upload a certificate by clicking **Upload** and selecting the certificate. For more information on generating the certificate, see [Setting up an authenticated web service to send push notifications for Windows Phone].

##<a id="test"></a> Test push notifications in your app

1. In Visual Studio, press the F5 key to run the app.

    >[AZURE.NOTE] You may encounter a 401 Unauthorized RegistrationAuthorizationException when testing on the Windows Phone emulator. This can occur during the `RegisterNativeAsync()` call because of the way the Windows Phone emulator syncs it's clock with the host PC. It can result in a security token that will be rejected. To resolve this simply manually set the clock in the emulator before testing.

5. In the app, enter the text "hello push" in the textbox, click **Save**, then immediately click the start button or back button to leave the app.

   	![Enter text into the app](./media/mobile-services-javascript-backend-windows-phone-get-started-push/mobile-quickstart-push3-wp8.png)

  	This sends an insert request to the mobile service to store the added item. Notice that the device receives a toast notification that says **hello push**.

	![Toast notification received](./media/mobile-services-javascript-backend-windows-phone-get-started-push/mobile-quickstart-push5-wp8.png)

	>[AZURE.NOTE]You will not receive the notification when you are still in the app. To receive a toast notification while the app is active, you must handle the [ShellToastNotificationReceived](http://msdn.microsoft.com/library/windowsphone/develop/microsoft.phone.notification.httpnotificationchannel.shelltoastnotificationreceived.aspx) event.

## <a name="next-steps"> </a>Next steps

This tutorial demonstrated the basics of enabling a Windows Store app to use Mobile Services and Notification Hubs to send push notifications. Next, consider completing one of the following tutorials:

+ [Send broadcast notifications to subscribers](../notification-hubs/notification-hubs-windows-phone-push-xplat-segmented-mpns-notification.md)
	<br/>Learn how users can register and receive push notifications for categories they're interested in.

+ [Send platform-agnostic notifications to subscribers](../notification-hubs/notification-hubs-aspnet-cross-platform-notification.md)
	<br/>Learn how to use templates to send push notifications from your mobile service, without having to craft platform-specific payloads in your back-end.


Learn more about Mobile Services and Notification Hubs in the following topics:

* [Azure Notification Hubs - Diagnosis guidelines](../notification-hubs/notification-hubs-push-notification-fixer.md)
	<br/>Learn how to troubleshoot your push notification issues.

* [Get started with authentication]
  <br/>Learn how to authenticate users of your app with different account types using mobile services.

* [What are Notification Hubs?]
  <br/>Learn more about how Notification Hubs works to deliver notifications to your apps across all major client platforms.

* [Mobile Services .NET How-to Conceptual Reference]
  <br/>Learn more about how to use Mobile Services with .NET.

* [Mobile Services server script reference]
  <br/>Learn more about how to implement business logic in your mobile service.

<!-- Anchors. -->

<!-- Images. -->


<!-- URLs. -->
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253
[Add Mobile Services to an existing app]: mobile-services-windows-phone-get-started-data.md
[Get started with authentication]: mobile-services-windows-phone-get-started-users.md

[Setting up an authenticated web service to send push notifications for Windows Phone]: http://msdn.microsoft.com/library/windowsphone/develop/ff941099(v=vs.105).aspx

[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[Mobile Services .NET How-to Conceptual Reference]: mobile-services-windows-dotnet-how-to-use-client-library.md

[What are Notification Hubs?]: ../notification-hubs/notification-hubs-overview.md
