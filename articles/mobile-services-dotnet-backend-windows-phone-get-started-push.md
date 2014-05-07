<properties pageTitle="Get started with push notification hubs using .NET runtime mobile services" metaKeywords="" description="Learn how to use Windows Azure .Net runtime mobile services and Notification Hubs to send push notifications to your Windows phone app." metaCanonical="" services="mobile" documentationCenter="Mobile" title="Get started with push notifications in Mobile Services" authors="wesmc"  solutions="" writer="wesmc" manager="" editor=""  />


# Get started with push notifications Mobile Services

<div class="dev-center-tutorial-selector sublanding">
	<a href="/en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-dotnet-get-started-push" title="Windows Store C#">Windows Store C#</a>
	<a href="/en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-javascript-get-started-push" title="Windows Store JavaScript">Windows Store JavaScript</a>
	<a href="/en-us/documentation/articles/mobile-services-dotnet-backend-windows-phone-get-started-push" title="Windows Phone" class="current">Windows Phone</a>
	<a href="/en-us/documentation/articles/mobile-services-dotnet-backend-android-get-started-push/" title="Android">Android</a>
</div>
<div class="dev-center-tutorial-subselector"><a href="/en-us/documentation/articles/mobile-services-dotnet-backend-windows-phone-get-started-push" title=".NET backend" class="current">.NET backend</a> | 	<a href="/en-us/documentation/articles/mobile-services-javascript-backend-windows-phone-get-started-push/"  title="JavaScript backend">JavaScript backend</a></div>

This topic shows you how to use Azure Mobile Services with a .NET backend to send push notifications to a Windows Phone Silverlight 8 app. In this tutorial you enable push notifications using Windows Azure Notification Hubs to the quickstart project. When complete, your mobile service will send a push notification using Notification Hubs each time a record is inserted. The notification hub that you create is free with your mobile service, can be managed independent of the mobile service, and can be used by other applications and services.

>[WACOM.NOTE]Mobile Services integration with Notification Hubs is currently in preview.

This tutorial walks you through these basic steps to enable push notifications:

1. [Update the app to register for notifications](#update-app)
3. [Update the server to send push notifications](#update-server)
3. [Insert data to receive push notifications](#test)

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete either [Get started with Mobile Services] or [Get started with data] to connect your project to the mobile service.

>[WACOM.NOTE]To send push notifications to a Windows Phone Store app, follow the [Windows Store app](mobile-services-dotnet-backend-windows-store-dotnet-get-started-push) version of this tutorial.

##<a id="update-app"></a> Update the app to register for notifications

Before your app can receive push notifications, you must register a notification channel.

1. In Visual Studio, open the file App.xaml.cs and add the following `using` statements:

        using Microsoft.Phone.Notification;

2. Add the following `AcquirePushChannel` method to `App` class: 
	
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

##<a id="update-server"></a> Update the server to send push notifications

[WACOM.INCLUDE [mobile-services-dotnet-backend-update-server-push](../includes/mobile-services-dotnet-backend-update-server-push.md)]

<ol start="2">
<li><p>Log on to the <a href=" https://manage.windowsazure.com/" target="_blank">Windows Azure Management Portal</a>, click <strong>Mobile Services</strong>, and then click your app.</p></li>

<li><p>Click the <strong>Push</strong> tab, check <strong>Enable unauthenticated push notifications</strong>, then click <strong>Save</strong>.</p>

</li>
</ol>

   ![][4]

>[WACOM.NOTE]This tutorial uses MPNS in unauthenticated mode. In this mode, MPNS limits the number of notifications that can be sent to a device channel. To remove this restriction, you must generate and upload a certificate by clicking <strong>Upload</strong> and selecting the certificate. For more information on generating the certificate, see <a href="http://msdn.microsoft.com/en-us/library/windowsphone/develop/ff941099(v=vs.105).aspx">Setting up an authenticated web service to send push notifications for Windows Phone</a>.

This enables the mobile service to connect to MPNS in unauthenticated mode to send push notifications.

##<a id="test"></a> Test push notifications in your app

1. In Visual Studio, press the F5 key to run the app.

5. In the app, enter the text "hello push" in the textbox, and then click **Save**.

   	![][2]

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
  <br/>Learn more about storing and querying data using .Net runtime mobile services.

* [Get started with authentication]
  <br/>Learn how to authenticate users of your app with differnet account types using .Net runtime mobile services.

* [Mobile Services server script reference]
  <br/>Learn more about registering and using server scripts.

* [Mobile Services .NET How-to Conceptual Reference]
  <br/>Learn more about how to use Mobile Services with .NET.

<!-- Anchors. -->

<!-- Images. -->


[1]: ./media/mobile-services-dotnet-backend-windows-phone-get-started-push/mobile-app-enable-push-wp8.png
[2]: ./media/mobile-services-dotnet-backend-windows-phone-get-started-push/mobile-quickstart-push3-wp8.png
[3]: ./media/mobile-services-dotnet-backend-windows-phone-get-started-push/mobile-quickstart-push4-wp8.png
[4]: ./media/mobile-services-dotnet-backend-windows-phone-get-started-push/mobile-push-tab.png

<!-- URLs. -->
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253
[Get started with Mobile Services]: /en-us/documentation/articles/mobile-services-windows-store-get-started
[Get started with data]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-phone-get-started-data
[Get started with authentication]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-phone-get-started-users
[Get started with push notifications]: /en-us/documentation/articles/mobile-services-windows-store-dotnet-get-started-push

[Get started with Notification Hubs]: /en-us/manage/services/notification-hubs/getting-started-windows-dotnet/
[What are Notification Hubs?]: /en-us/develop/net/how-to-guides/service-bus-notification-hubs/
[Send notifications to subscribers]: /en-us/manage/services/notification-hubs/breaking-news-dotnet/
[Send notifications to users]: /en-us/manage/services/notification-hubs/notify-users/
[Send cross-platform notifications to users]: /en-us/manage/services/notification-hubs/notify-users-xplat-mobile-services/
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[Mobile Services .NET How-to Conceptual Reference]: /en-us/documentation/articles/mobile-services-windows-dotnet-how-to-use-client-library
