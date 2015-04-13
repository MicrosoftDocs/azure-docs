<properties 
	pageTitle="Get started with push notification hubs using .NET runtime mobile services" 
	description="Learn how to use Notification Hubs with Azure mobile services to send push notifications to your Windows phone app." 
	services="mobile-services,notification-hubs" 
	documentationCenter="windows" 
	authors="wesmc7777" 
	writer="wesmc" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows-phone" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="02/23/2015" 
	ms.author="wesmc"/>

# Add push notifications to your Mobile Services app

[AZURE.INCLUDE [mobile-services-selector-get-started-push-legacy](../includes/mobile-services-selector-get-started-push-legacy.md)]

##Overview

This topic shows you how to use Azure Mobile Services with a .NET backend to send push notifications to a Windows Phone Silverlight 8 app. In this tutorial you enable push notifications using Azure Notification Hubs to the quickstart project. When complete, your mobile service will send a push notification using Notification Hubs each time a record is inserted. The notification hub that you create is free with your mobile service, can be managed independent of the mobile service, and can be used by other applications and services.


This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete [Add Mobile Services to an existing app] to connect your project to the mobile service.

>[AZURE.NOTE]This tutorial targets Windows Phone 8.1 "Silverlight" apps. If you are instead building a Windows Phone 8.1 Store app, see the [Windows Store app](mobile-services-dotnet-backend-windows-store-dotnet-get-started-push) version of this tutorial. For information on Windows Phone Silverlight apps and how they compare with Windows Phone Store apps, see [Windows Phone Silverlight 8.1 apps]. 

##Update the app to register for notifications

Before your app can receive push notifications, you must register a notification channel.

1. In Visual Studio, open the file App.xaml.cs and add the following `using` statement:

        using Microsoft.Phone.Notification;

2. Add the following `AcquirePushChannel` method to `App` class: 

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
                    System.Exception exception = null;
                    try
                    {
                        await MobileService.GetPush()
                            .RegisterNativeAsync(CurrentChannel.ChannelUri.ToString());
                    }
                    catch (System.Exception ex)
                    {
                        CurrentChannel.Close();
                        exception = ex;
                    }
                    if (exception != null)
                    {
                        Deployment.Current.Dispatcher.BeginInvoke(() =>
                        {
                            MessageBox.Show(exception.Message, 
                                            "Registering for Push Notifications",
                                            MessageBoxButton.OK);
                        });
                    }
            });
            CurrentChannel.ShellToastNotificationReceived += 
                new EventHandler<NotificationEventArgs>((o, args) =>
                {
                    string message = "";
                    foreach (string key in args.Collection.Keys)
                    {
                        message += key + " : " + args.Collection[key] + ", ";
                    }
                    Deployment.Current.Dispatcher.BeginInvoke(() =>
                    {
                        MessageBox.Show(message);
                    });
            });
        }

    This code retrieves the channel URI for the app if it exists. Otherwise, it will be created. The channel URI is then opened and bound for toast notifications. Once the channel URI is completely opened, the handler for the `ChannelUriUpdated` method is called and the channel is registered to received push notifications. If the registration should fail, the channel is closed so that subsequent executions of the app can try registration again. The `ShellToastNotificationReceived` handler is setup so that the app can receive and handle push notifications while running.
    
4. In the `Application_Launching` event handler in App.xaml.cs, add the following call to the new `AcquirePushChannel` method:

        AcquirePushChannel();

	This makes sure that registration is requested every time that the app is loaded. In your app, you may only want to make this registration periodically to ensure that the registration is current. 

5. Press the **F5** key to run the app. A popup dialog with the registration key is displayed.
  
6. In Visual Studio, open the Package.appxmanifest file and make sure that **Toast capable** is set to **Yes** on the **Application UI** tab.

   	![][1]

   	This makes sure that your app can raise toast notifications. 

##Update the server to send push notifications

1. In Visual Studio Solution Explorer, expand the **Controllers** folder in the mobile service project. Open TodoItemController.cs and update the `PostTodoItem` method definition with the following code:  

        public async Task<IHttpActionResult> PostTodoItem(TodoItem item)
        {
            TodoItem current = await InsertAsync(item);
            MpnsPushMessage message = new MpnsPushMessage();
            message.XmlPayload = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
                "<wp:Notification xmlns:wp=\"WPNotification\">" +
                   "<wp:Toast>" +
                        "<wp:Text1>" + item.Text + "</wp:Text1>" +
                   "</wp:Toast> " +
                "</wp:Notification>";

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

2. Log on to the [Azure Management Portal], click **Mobile Services**, and then click your app.

3. Click the **Push** tab, check **Enable unauthenticated push notifications**, then click **Save**.

   	![][4]

	>[AZURE.NOTE]This tutorial uses MPNS in unauthenticated mode. In this mode, MPNS limits the number of notifications that can be sent to a device channel. To remove this restriction, you must generate and upload a certificate by clicking <strong>Upload</strong> and selecting the certificate. For more information on generating the certificate, see <a href="http://msdn.microsoft.com/library/windowsphone/develop/ff941099(v=vs.105).aspx">Setting up an authenticated web service to send push notifications for Windows Phone</a>.

This enables the mobile service to connect to MPNS in unauthenticated mode to send push notifications.

##Enable push notifications for local testing

[AZURE.INCLUDE [mobile-services-dotnet-backend-configure-local-push](../includes/mobile-services-dotnet-backend-configure-local-push.md)]


##Test push notifications in your app

1. In Visual Studio, press the F5 key to run the app.

    >[AZURE.NOTE] You may encounter a 401 Unauthorized RegistrationAuthorizationException when testing on the Windows Phone emulator. This can occur during the `RegisterNativeAsync()` call because of the way the Windows Phone emulator syncs it's clock with the host PC. It can result in a security token that will be rejected. To resolve this simply manually set the clock in the emulator before testing.

5. In the app, enter the text "hello push" in the textbox, click **Save**, then immediately click the start button or back button to leave the app.

   	![][2]

  	This sends an insert request to the mobile service to store the added item. Notice that the device receives a toast notification that says **hello push**.

	![][5]

	>[AZURE.NOTE]You will not receive the notification when you are still in the app. To receive a toast notification while the app is active, you must handle the [ShellToastNotificationReceived](http://msdn.microsoft.com/library/windowsphone/develop/microsoft.phone.notification.httpnotificationchannel.shelltoastnotificationreceived.aspx) event.

##Next steps

This tutorial demonstrated the basics of enabling a Windows Phone app to use Mobile Services and Notification Hubs to send push notifications. Next, consider completing the next tutorial, [Send push notifications to authenticated users], which shows how to use tags to send push notifications from a Mobile Service to only an authenticated user.

<!--+ [Send push notifications to authenticated users]
	<br/>Learn how to use tags to send push notifications from a Mobile Service to only an authenticated user.

+ [Send broadcast notifications to subscribers]
	<br/>Learn how users can register and receive push notifications for categories they're interested in.
-->
Consider finding out more about the following Mobile Services and Notification Hubs topics:

* [Get started with data]
  <br/>Learn more about storing and querying data using mobile services.

* [Get started with authentication]
  <br/>Learn how to authenticate users of your app with different account types using mobile services.

* [What are Notification Hubs?]
  <br/>Learn more about how Notification Hubs works to deliver notifications to your apps across all major client platforms.

* [Debug Notification Hubs applications](http://go.microsoft.com/fwlink/p/?linkid=386630)
  </br>Get guidance troubleshooting and debugging Notification Hubs solutions. 

* [Mobile Services .NET How-to Conceptual Reference]
  <br/>Learn more about how to use Mobile Services with .NET.



<!-- Images. -->


[1]: ./media/mobile-services-dotnet-backend-windows-phone-get-started-push/mobile-app-enable-push-wp8.png
[2]: ./media/mobile-services-dotnet-backend-windows-phone-get-started-push/mobile-quickstart-push3-wp8.png
[3]: ./media/mobile-services-dotnet-backend-windows-phone-get-started-push/mobile-quickstart-push4-wp8.png
[4]: ./media/mobile-services-dotnet-backend-windows-phone-get-started-push/mobile-push-tab.png
[5]: ./media/mobile-services-dotnet-backend-windows-phone-get-started-push/mobile-quickstart-push5-wp8.png

<!-- URLs. -->
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253
[Get started with Mobile Services]: mobile-services-dotnet-backend-windows-phone-get-started.md
[Add Mobile Services to an existing app]: mobile-services-dotnet-backend-windows-phone-get-started-data.md
[Get started with authentication]: mobile-services-dotnet-backend-windows-phone-get-started-users.md

[Send push notifications to authenticated users]: mobile-services-dotnet-backend-windows-phone-push-notifications-app-users.md

[What are Notification Hubs?]: notification-hubs-overview.md
[Send broadcast notifications to subscribers]: notification-hubs-windows-phone-send-breaking-news.md
[Send template-based notifications to subscribers]: notification-hubs-windows-phone-send-localized-breaking-news.md


[Mobile Services .NET How-to Conceptual Reference]: mobile-services-html-how-to-use-client-library.md
[Windows Phone Silverlight 8.1 apps]: http://msdn.microsoft.com/library/windowsphone/develop/dn642082(v=vs.105).aspx
[Azure Management Portal]: https://manage.windowsazure.com/
