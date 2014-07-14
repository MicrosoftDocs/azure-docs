<properties linkid="develop-notificationhubs-tutorials-get-started-windowsdotnet" urlDisplayName="Get started with notification hubs" pageTitle="Get started with Azure Notification Hubs" metaKeywords="" description="Learn how to use Azure Notification Hubs to push notifications." metaCanonical="" services="notification-hubs" documentationCenter="Mobile" title="Getting Started with Notification Hubs" authors="sethm" solutions="" manager="" editor="" />

# Getting Started with Notification Hubs

<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/documentation/articles/notification-hubs-windows-store-dotnet-get-started/" title="Windows Universal" class="current">Windows Universal</a><a href="/en-us/documentation/articles/notification-hubs-windows-phone-get-started/" title="Windows Phone">Windows Phone</a><a href="/en-us/documentation/articles/notification-hubs-ios-get-started/" title="iOS">iOS</a><a href="/en-us/documentation/articles/notification-hubs-android-get-started/" title="Android">Android</a><a href="/en-us/documentation/articles/notification-hubs-kindle-get-started/" title="Kindle">Kindle</a><a href="/en-us/documentation/articles/notification-hubs-nokia-x-get-started/" title="Nokia X">Nokia X</a><a href="/en-us/documentation/articles/partner-xamarin-notification-hubs-ios-get-started/" title="Xamarin.iOS">Xamarin.iOS</a><a href="/en-us/documentation/articles/partner-xamarin-notification-hubs-android-get-started/" title="Xamarin.Android">Xamarin.Android</a></div>

This topic shows you how to use Azure Notification Hubs to send push notifications to a Windows Store or Windows Phone 8.1 (non-Silverlight) application. If you are targeting Windows Phone 8.1 Silverlight, please refer to the [Windows Phone](/en-us/documentation/articles/notification-hubs-windows-phone-get-started/) version. 
In this tutorial you create a blank Windows Store app that receives push notifications using the Windows Push Notification service (WNS). When complete, you will be able to broadcast push notifications to all the devices running your app using your notification hub.

This tutorial walks you through these basic steps to enable push notifications:

1. [Register your app for push notifications]
2. [Configure your Notification Hub]
3. [Connecting your app to the Notification Hub]
4. [Send notifications from your back-end]

This tutorial demonstrates a simple broadcast scenario using Notification Hubs. Be sure to follow along with the next tutorial to learn how to use Notification Hubs to address specific users and groups of devices. This tutorial requires the following:

+ Microsoft Visual Studio 2012 Express for Windows 8
+ An active Windows Store account

Completing this tutorial is a prerequisite for all other Notification Hubs tutorials for Windows Store apps. 

<div class="dev-callout"><strong>Note</strong> <p>To complete this tutorial, you must have an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fwww.windowsazure.com%2Fen-us%2Fdevelop%2Fmobile%2Ftutorials%2Fget-started%2F" target="_blank">Azure Free Trial</a>.</p></div>

<h2><a name="register"></a><span class="short-header">Register your app</span>Register your app for the Windows Store</h2>

To send push notifications to Windows Store apps from Mobile Services, you must submit your app to the Windows Store. You must then configure your notification hub to integrate with WNS.

1. If you have not already registered your app, navigate to the [Submit an app page] in the Dev Center for Windows Store apps, log on with your Microsoft account, and then click **App name**.

   	![][0]

2. Type a name for your app in **App name**, click **Reserve app name**, and then click **Save**.

   	![][1]

   	This creates a new Windows Store registration for your app.

3. In Visual Studio 2012 Express for Windows 8, create a new Visual C# Windows Store project using the **Blank App** template.

   	![][2]

4. In Solution Explorer, right-click the project, click **Store**, and then click **Associate App with the Store...**. 

   	![][3]

   	The **Associate Your App with the Windows Store** wizard appears.

5. In the wizard, click **Sign in** and then log in with your Microsoft account.

6. Click the app that you registered in step 2, click **Next**, and then click **Associate**.

   	![][4]

   	This adds the required Windows Store registration information to the application manifest.    

7. Back in the Windows Dev Center page for your new app, click **Services**. 

   	![][5] 

8. In the **Services** page, click **Live Services site** under **Azure Mobile Services**.

   	![][17]

9. Click **Authenticating your service** and make a note of the values of **Client secret** and **Package security identifier (SID)**. 

   	![][6]

 	<div class="dev-callout"><b>Security Note</b>
	<p>The client secret and package SID are important security credentials. Do not share these values with anyone or distribute them with your app.</p>
    </div>

<h2><a name="configure-hub"></a><span class="short-header">Configure your Notification Hub</span>Configure your Notification Hub</h2>

1. Log on to the [Azure Management Portal], and click **NEW** at the bottom of the screen.

2. Click on **App Services**, then **Service Bus**, then **Notification Hub**, then **Quick Create**.

   	![][7]

3. Type a name for your notification hub, select your desired Region, and then click **Create a new Notification Hub**.

   	![][8]

4. Click the namespace you just created (usually ***notification hub name*-ns**), then click the **Configure** tab at the top.

   	![][9]

5. Select the tab **Notification Hubs** at the top, and then click the notification hub you just created.

   	![][10]

6. Select the tab **Configure** at the top, enter the **Client secret** and **Package SID** values you obtained from WNS in the previous section, and then click **Save**.

   	![][11]

7. Select the tab **Dashboard** at the top, and then click **Connection Information**. Take note of the two connection strings.

   	![][12]

Your notification hub is now configured to work with WNS, and you have the connection strings to register your app and send notifications.

<h2><a name="connecting-app"></a><span class="short-header">Connecting your app</span>Connecting your app to the Notification Hub</h2>

1. Add a reference to the Azure Messaging library for Windows Store using the <a href="http://nuget.org/packages/WindowsAzure.Messaging.Managed/">WindowsAzure.Messaging.Managed NuGet package</a>. In Visual Studio Main Menu, click **Tools**, then click **Library Package Manager**, then click **Package Manager Console**. Then, in the console window type:

        Install-Package WindowsAzure.Messaging.Managed

    then press **Enter**.

2. Open the file App.xaml.cs and add the following `using` statements:

        using Windows.Networking.PushNotifications;
        using Microsoft.WindowsAzure.Messaging;
		using Windows.UI.Popups;

3. Add the following code to App.xaml.cs, in the `App` class. Make sure to replace the "hub name" placeholder with the name of the notification hub that appears in the portal on the **Notification Hubs** tab (for example, **mynotificationhub2** in the previous example):
	
	    private async void InitNotificationsAsync()
        {
            var channel = await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();
			
            var hub = new NotificationHub("<hub name>", "<connection string with listen access>");              
			var result = await hub.RegisterNativeAsync(channel.Uri);
            
            // Displays the registration ID so you know it was successful
            if (result.RegistrationId != null)
            {
                var dialog = new MessageDialog("Registration successful: " + result.RegistrationId);
                dialog.Commands.Add(new UICommand("OK"));
                await dialog.ShowAsync();
            }

        }

    Make sure to insert the name of your hub and the connection string called **DefaultListenSharedAccessSignature** that you obtained in the previous section.
    This code retrieves the ChannelURI for the app from WNS, and then registers that ChannelURI with your notification hub.
    
4. At the top of the **OnLaunched** event handler in App.xaml.cs, add the following call to the new **InitNotificationsAsync** method:

        InitNotificationsAsync();

    This guarantees that the ChannelURI is registered in your notification hub each time the application is launched.

5. Press the **F5** key to run the app. A popup dialog with the registration key is displayed.
   
   	![][19]

<h2><a name="send"></a><span class="short-header">Send notification</span>Send notification from your back-end</h2>

You can send notifications using notification hubs from any back-end using the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/dn223264.aspx">REST interface</a>. In this tutorial you send notifications with a .NET console application, and with a Mobile Service using a node script.

To send notifications using a .NET app:

1. With the previous solution still open in Visual Studio, in Solution Explorer double-click **Package.appxmanifest** to open it in the Visual Studio editor.

2. Scroll down to **All Image Assets** and click **Badge Logo**. In **Notifications**, set **Toast capable** to **Yes**:

   	![][18]

   	From the **File** menu, click **Save All**.

3. Now create a new Visual C# console application: 

   	![][13]

4. Add a reference to the Azure Service Bus SDK with the <a href="http://nuget.org/packages/WindowsAzure.ServiceBus/">WindowsAzure.ServiceBus NuGet package</a>. In the Visual Studio main menu, click **Tools**, then click **Library Package Manager**, then click **Package Manager Console**. Then, in the console window type the following:

        Install-Package WindowsAzure.ServiceBus

    then press **Enter**.

5. Open the file Program.cs and add the following `using` statement:

        using Microsoft.ServiceBus.Notifications;

6. In the `Program` class, add the following method. Make sure to replace the "hub name" placeholder with the name of the notification hub that appears in the portal on the **Notification Hubs** tab:

        private static async void SendNotificationAsync()
        {
            NotificationHubClient hub = NotificationHubClient.CreateClientFromConnectionString("<connection string with full access>", "<hub name>");
            var toast = @"<toast><visual><binding template=""ToastText01""><text id=""1"">Hello from a .NET App!</text></binding></visual></toast>";
            await hub.SendWindowsNativeNotificationAsync(toast);
        }

   	Make sure to insert the name of your hub and the connection string called **DefaultFullSharedAccessSignature** that you obtained in the section "Configure your Notification Hub." Note that this is the connection string with **Full** access, not **Listen** access.

7. Then add the following lines in the `Main` method:

         SendNotificationAsync();
		 Console.ReadLine();

8. Press the **F5** key to run the app. You should receive a toast notification.

   	![][14]

You can find all the possible payloads on MSDN in the [toast catalog], [tile catalog], and [badge overview].

To send a notification using a Mobile Service, follow [Get started with Mobile Services], then do the following:

1. Log on to the [Azure Management Portal], and click your Mobile Service.

2. Select the tab **Scheduler** on the top.

   	![][15]

3. Create a new scheduled job, insert a name, and then click **On demand**.

   	![][16]

4. When the job is created, click the job name. Then click the **Script** tab in the top bar.

5. Insert the following script inside your scheduler function. Make sure to replace the placeholders with your notification hub name and the connection string for *DefaultFullSharedAccessSignature* that you obtained earlier. When you are finished, click **Save** on the bottom bar.

        var azure = require('azure');
        var notificationHubService = azure.createNotificationHubService('<hub name>', '<connection string with full access>');
        notificationHubService.wns.sendToastText01(
            null,
            {
                text1: 'Hello from Mobile Services!!!'
            },
            function (error) {
                if (!error) {
                    console.warn("Notification successful");
                }
        });

6. Click **Run Once** on the bottom bar. You should receive a toast notification.

## <a name="next-steps"> </a>Next steps

In this simple example you sent broadcast notifications to all your Windows devices. In order to target specific users, refer to the tutorial [Use Notification Hubs to push notifications to users]. If you want to segment your users by interest groups, see [Use Notification Hubs to send breaking news]. To learn more about how to use Notification Hubs, see [Notification Hubs Guidance].

<!-- Anchors. -->
[Register your app for push notifications]: #register
[Configure your Notification Hub]: #configure-hub
[Connecting your app to the Notification Hub]: #connecting-app
[Send notifications from your back-end]: #send
[Next Steps]:#next-steps

<!-- Images. -->
[0]: ./media/notification-hubs-windows-store-dotnet-get-started/mobile-services-submit-win8-app.png
[1]: ./media/notification-hubs-windows-store-dotnet-get-started/mobile-services-win8-app-name.png
[2]: ./media/notification-hubs-windows-store-dotnet-get-started/notification-hub-create-win8-app.png
[3]: ./media/notification-hubs-windows-store-dotnet-get-started/notification-hub-associate-win8-app.png
[4]: ./media/notification-hubs-windows-store-dotnet-get-started/mobile-services-select-app-name.png
[5]: ./media/notification-hubs-windows-store-dotnet-get-started/mobile-services-win8-edit-app.png
[6]: ./media/notification-hubs-windows-store-dotnet-get-started/mobile-services-win8-app-push-auth.png
[7]: ./media/notification-hubs-windows-store-dotnet-get-started/notification-hub-create-from-portal.png
[8]: ./media/notification-hubs-windows-store-dotnet-get-started/notification-hub-create-from-portal2.png
[9]: ./media/notification-hubs-windows-store-dotnet-get-started/notification-hub-select-from-portal.png
[10]: ./media/notification-hubs-windows-store-dotnet-get-started/notification-hub-select-from-portal2.png
[11]: ./media/notification-hubs-windows-store-dotnet-get-started/notification-hub-configure-wns.png
[12]: ./media/notification-hubs-windows-store-dotnet-get-started/notification-hub-connection-strings.png
[13]: ./media/notification-hubs-windows-store-dotnet-get-started/notification-hub-create-console-app.png
[14]: ./media/notification-hubs-windows-store-dotnet-get-started/notification-hub-windows-toast.png
[15]: ./media/notification-hubs-windows-store-dotnet-get-started/notification-hub-scheduler1.png
[16]: ./media/notification-hubs-windows-store-dotnet-get-started/notification-hub-scheduler2.png
[17]: ./media/notification-hubs-windows-store-dotnet-get-started/mobile-services-win8-edit2-app.png
[18]: ./media/notification-hubs-windows-store-dotnet-get-started/notification-hub-win8-app-toast.png
[19]: ./media/notification-hubs-windows-store-dotnet-get-started/notification-hub-windows-reg.png

<!-- URLs. -->
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started/#create-new-service
[Get started with data]: /en-us/develop/mobile/tutorials/get-started-with-data-dotnet
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-dotnet
[Get started with push notifications]: /en-us/develop/mobile/tutorials/get-started-with-push-dotnet
[Push notifications to app users]: /en-us/develop/mobile/tutorials/push-notifications-to-users-dotnet
[Authorize users with scripts]: /en-us/develop/mobile/tutorials/authorize-users-in-scripts-dotnet
[JavaScript and HTML]: /en-us/develop/mobile/tutorials/get-started-with-push-js

[Azure Management Portal]: https://manage.windowsazure.com/
[wns object]: http://go.microsoft.com/fwlink/p/?LinkId=260591
[Notification Hubs Guidance]: http://msdn.microsoft.com/en-us/library/jj927170.aspx

[Use Notification Hubs to push notifications to users]: /en-us/manage/services/notification-hubs/notify-users-aspnet
[Use Notification Hubs to send breaking news]: /en-us/manage/services/notification-hubs/breaking-news-dotnet

[toast catalog]: http://msdn.microsoft.com/en-us/library/windows/apps/hh761494.aspx
[tile catalog]: http://msdn.microsoft.com/en-us/library/windows/apps/hh761491.aspx
[badge overview]: http://msdn.microsoft.com/en-us/library/windows/apps/hh779719.aspx
