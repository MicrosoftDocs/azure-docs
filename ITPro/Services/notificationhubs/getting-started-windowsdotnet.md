<properties linkid="develop-notificationhubs-tutorials-get-started-windowsdotnet" writer="elioda" urlDisplayName="Get Started" pageTitle="Get Started with Windows Azure Notification Hubs" metaKeywords="" metaDescription="Learn how to use Windows Azure Notification Hubs to push notifications." metaCanonical="" disqusComments="0" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu-windows-store.md" />

# Getting Started with Notification Hubs
<div class="dev-center-tutorial-selector sublanding"> 
	# clicker for iOS, Android, Windows Phone
</div>	


This topic shows you how to use Windows Azure Notification Hubs to send push notifications to a Windows Store application. 
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

<div class="dev-callout"><strong>Note</strong> <p>To complete this tutorial, you must have an active Windows Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fwww.windowsazure.com%2Fen-us%2Fdevelop%2Fmobile%2Ftutorials%2Fget-started%2F" target="_blank">Windows Azure Free Trial</a>.</p></div>

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

8. In the **Services** page, click **Live Services site** under **Windows Azure Mobile Services**.

   ![][17]

9. Click **Authenticating your service** and make a note of the values of **Client secret** and **Package security identifier (SID)**. 

   ![][6]

    <div class="dev-callout"><b>Security Note</b>
	<p>The client secret and package SID are important security credentials. Do not share these values with anyone or distribute them with your app.</p>
    </div>

<h2><a name="configure-hub"></a><span class="short-header">Configure your Notification Hub</span>Configure your Notification Hub</h2>

1. Log on to the [Windows Azure Management Portal], and click **NEW** at the bottom of the screen.

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

1. Add a reference to the Windows Azure Messaging library for Windows Store using the <a href="http://nuget.org/packages/WindowsAzure.Messaging.Managed/">WindowsAzure.Messaging.Managed NuGet package</a>. In Visual Studio Main Menu, click **Tools**, then click **Library Package Manager**, then click **Package Manager Console**. Then, in the console window type:

        Install-Package WindowsAzure.Messaging.Managed

    then press **Enter**.

2. Open the file App.xaml.cs and add the following `using` statements:

        using Windows.Networking.PushNotifications;
        using Microsoft.WindowsAzure.Messaging;

3. Add the following code to App.xaml.cs:
	
	    private async void InitNotificationsAsync()
        {
            var channel = await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();
			
            var hub = new NotificationHub("<hub name>", "<connection string with listen access>");              
			await hub.RegisterNativeAsync(channel.Uri);
        }

    Make sure to insert the name of your hub and the connection string called *DefaultListenSharedAccessSignature* that you obtained in the previous section.
    This code will retrieve the ChannelURI for the app from WNS, and will register that ChannelURI with your notification hub.
    
4. At the top of the **OnLaunched** event handler in App.xaml.cs, add the following call to the new **InitNotificationsAsync** method:

        InitNotificationsAsync();

    This guarantees that the ChannelURI is registered in your notification hub each time the application is launched.
	
5. Press the **F5** key to run the app.

<h2><a name="send"></a><span class="short-header">Send notification</span>Send notification from your back-end</h2>

You can send notifications using notification hubs from any back-end using the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/dn223264.aspx">REST interface</a>. In this tutorial you send notifications with a .NET console application, and with a Mobile Service using a node script.

To send notifications using a .NET app:

1. In Visual Studio 2012 Express for Windows 8, create a new Visual C# Windows Store project using the **Blank App** template. 

   ![][13]

2. Add a reference to the Windows Azure Service Bus SDK with the <a href="http://nuget.org/packages/WindowsAzure.ServiceBus/">WindowsAzure.ServiceBus NuGet package</a>. In the Visual Studio main menu, click **Tools**, then click **Library Package Manager**, then click **Package Manager Console**. Then, in the console window type the following:

        Install-Package WindowsAzure.ServiceBus

    then press **Enter**.

2. Open the file Program.cs and add the following `using` statement:

        using Microsoft.ServiceBus.Notifications;

3. In the `Program` class, add the following method:

        private static async void SendNotificationAsync()
        {
            NotificationHubClient hub = NotificationHubClient.CreateClientFromConnectionString("<connection string with full access>", "<hub name>");
            var toast = @"<toast><visual><binding template=""ToastText01""><text id=""1"">Hello from a .NET App!</text></binding></visual></toast>";
            await hub.SendWindowsNativeNotificationAsync(toast);
        }

4. Then add the following line in the `Main` method:

         SendNotificationAsync();
		 Console.ReadLine();

5. Press the **F5** key to run the app. You should receive a toast notification.

   ![][14]

To send a notification using a Mobile Service, follow [Get started with Mobile Services], then do the following:

1. Log on to the [Windows Azure Management Portal], and click your Mobile Service.

2. Select the tab **Scheduler** on the top.

   ![][15]

3. Create a new scheduled job, insert a name, and then click **On demand**.

   ![][16]

4. When the job is created, click the job name. Then click the **Script** tab in the top bar.

5. Insert the following script inside your scheduler function. Make sure to replace the placeholders with your notification hub name and the connection string for *DefaultFullSharedAccessSignature* that you obtained earlier. Click **Save**.

        var azure = require('azure');
        var notificationHubService = azure.createNotificationHubService('<hub name>',
    <connection string with full access>');
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

In this simple example you sent broadcast notifications to all your Windows devices. In order to target specific users, refer to the tutorial [Use Notification Hubs to push notifications to users]. If you want to segment your users by interest groups, see [Use Notification Hubs to send breaking news]. To learn more about how to use Notification Hubs, see [Notification Hubs Guidance] and [Notification Hubs How-To for Windows Store].

<!-- Anchors. -->
[Register your app for push notifications]: #register
[Configure your Notification Hub]: #configure-hub
[Connecting your app to the Notification Hub]: #connecting-app
[Send notifications from your back-end]: #send
[Next Steps]:#next-steps

<!-- Images. -->
[0]: mobile-services-submit-win8-app.png
[1]: mobile-services-win8-app-name.png
[2]: notification-hub-create-win8-app.png
[3]: notification-hub-associate-win8-app.png
[4]: mobile-services-select-app-name.png
[5]: mobile-services-win8-edit-app.png
[6]: mobile-services-win8-app-push-auth.png
[7]: notification-hub-create-from-portal.png
[8]: notification-hub-create-from-portal2.png
[9]: notification-hub-select-from-portal.png
[10]: notification-hub-select-from-portal2.png
[11]: notification-hub-configure-wns.png
[12]: notification-hub-connection-strings.png
[13]: notification-hub-create-console-app.png
[14]: notification-hub-windows-toast.png
[15]: notification-hub-scheduler1.png
[16]: notification-hub-scheduler2.png
[17]: mobile-services-win8-edit2-app.png

<!-- URLs. -->
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
