<properties linkid="develop-notificationhubs-tutorials-get-started-windowsphone" writer="elioda" urlDisplayName="Get Started" pageTitle="Get Started with Windows Azure Notification Hubs" metaKeywords="" metaDescription="Learn how to use Windows Azure Notification Hubs to push notifications." metaCanonical="" disqusComments="0" umbracoNaviHide="1" />

put correct left menu
<div chunk="../chunks/article-left-menu-windows-phone.md" />

# Get started with Notification Hubs
<div class="dev-center-tutorial-selector sublanding"> 
	# clicker for iOS, Android, Windows Phone
</div>	


This topic shows you how to use Windows Azure Notification Hubs to send push notifications to a Windows Phone 8 app. 
In this tutorial you create a blank Windows Phone 8 app that receives push notifications using the Microsoft Push Notification service (MPNS). When complete, you will be able to broadcast push notifications to all the devices running your app using your notification hub.

This tutorial walks you through these basic steps to enable push notifications:

1. [Create your Notification Hub]
2. [Connecting your app to the Notification Hub]
3. [Send notifications from your back-end]

This tutorial demonstrates the simple broadcast scenario using Notification Hubs. Be sure to follow along with the next tutorial to see how to use Notification Hubs to address specific users and groups of devices. This tutorial requires the following:

+ [Visual Studio 2012 Express for Windows Phone], or a later version.

Completing this tutorial is a prerequisite for all other Notification Hubs tutorials for Windows Phone 8 apps. 

<div class="dev-callout"><strong>Note</strong> <p>To complete this tutorial, you need a Windows Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fwww.windowsazure.com%2Fen-us%2Fdevelop%2Fmobile%2Ftutorials%2Fget-started%2F" target="_blank">Windows Azure Free Trial</a>.</p></div>


<h2><a name="configure-hub"></a><span class="short-header">Create your Notification Hub</span>Create your Notification Hub</h2>

1. Log on to the [Windows Azure Management Portal], click **+NEW** at the bottom of the screen.

2. Click on **App Services**, then **Service Bus**, then **Notification Hub**, then **Quick Create**.

   ![][7]

3. Insert a name for your notification hub, select your desired Region, then click **Create a new Notification Hub**.

   ![][8]

4. Click the namespace you just created (usually ***notification hub name*-ns**), then click on the **Configure** tab at the top.

   ![][9]

5. Select the tab **Notification Hubs** at the top, then click on the notification hub you just created.

   ![][10]

7. Click the button **Connection Information** at the bottom. Take note of the two connection strings.

   ![][12]

Now you have the connection strings to register your Windows Phone 8 app and send notifications.

    <div class="dev-callout"><b>Note</b>
		<p>In this this tutorial, we will you MPNS in unauthenticated mode. MPNS unauthenticated mode comes with restrictions on how notifications you can send to each channel. Notification Hubs support [MPNS authenticated mode]. Refer to [Notification Hubs How-To for Windows Phone 8] for more information on how to use MPNS authenticated mode.</p>
	</div>

<h2><a name="connecting-app"></a><span class="short-header">Connecting your app</span>Connecting your app to the Notification Hub</h2>

1. In Visual Studio, create a new Windows Phone 8 app.

   ![][13]

1. Add a reference to the Windows Azure Messaging library for Windows Store using the <a href="http://nuget.org/packages/WindowsAzure.Messaging.Managed/">WindowsAzure.Messaging.Managed NuGet package</a>. In Visual Studio Main Menu, select **TOOLS** -> **Library Package Manager** -> **Package Manager Console**. Then, in the console window type:

        Install-Package WindowsAzure.Messaging.Managed

    and press Enter.

2. Open the file App.xaml.cs and add the following using statement:

        using Microsoft.Phone.Notification;
        using Microsoft.WindowsAzure.Messaging;

3. Add the following to App.xaml.cs:
	
	    public static HttpNotificationChannel CurrentChannel { get; private set; }

        private async void InitNotificationsAsync()
        {
            CurrentChannel = HttpNotificationChannel.Find("MyPushChannel");
            if (CurrentChannel == null)
            {
                CurrentChannel = new HttpNotificationChannel("MyPushChannel");
                CurrentChannel.Open();
                CurrentChannel.BindToShellToast();
            }

            var hub = new NotificationHub("mynotificationhub", "Endpoint=sb://mynotificationhub-ns.servicebus.windows-bvt.net/;SharedAccessKeyName=DefaultListenSharedAccessSignature;SharedAccessKey=2VRVBGMREn7ENjgbh2JhX/7ncySzwMfqf9l/Ca9K07I=");
            await hub.RegisterNativeAsync(CurrentChannel.ChannelUri.ToString());
        }

    Make sure to insert the name of your hub and the connection string called *DefaultListenSharedAccessSignature* obtained in the previous section.
    This code will retrieve the ChannelURI for the app from MPNS, and will then register that ChannelURI with your Notification Hub.

	<div class="dev-callout"><b>Note</b>
		<p>In this this tutorial, we will send a toast notification to the device. When you send a tile notification, you must instead call the <strong>BindToShellTile</strong> method on the channel. To support both toast and tile notifications, call both <strong>BindToShellTile</strong> and  <strong>BindToShellToast</strong> </p>
	</div>
    
4. At the top of the **Application_Launching** method in App.xaml.cs, add the following call to the new **InitNotificationsAsync** method:

        InitNotificationsAsync();

    This guarantees that the ChannelURI is registered in your Notification Hub each time the application is launched.

5. In the Solution Explorer, expand **Properties**, open the WMAppManifest.xml file, click the **Capabilities** tab and make sure that the **ID___CAP___PUSH_NOTIFICATION** capability is checked.

   ![][14]

   This makes sure that your app can receive push notifications.
	
6. Press the F5 key to run the app.

<h2><a name="send"></a><span class="short-header">Send notification</span>Send notification from your back-end</h2>

You can send notifications using Notification Hubs from any back-end using our <a href="http://msdn.microsoft.com/en-us/library/windowsazure/dn223264.aspx">REST interface</a>. In this tutorial we will send notifications with a .NET console app, and with a Mobile Service using a node script.

To send notifications using a .NET app:

1. In Visual Studio 2012 Express for Windows 8, create a new Visual C# Windows Store project using the Blank App template. 

   ![][213]

2. Add a reference to the Windows Azure Service Bus SDK with the <a href="http://nuget.org/packages/WindowsAzure.ServiceBus/">WindowsAzure.ServiceBus NuGet package</a>. In Visual Studio Main Menu, select **TOOLS** -> **Library Package Manager** -> **Package Manager Console**. Then, in the console window type:

        Install-Package WindowsAzure.ServiceBus

    and press Enter.

2. Open the file Program.cs and add the following using statement:

        using Microsoft.ServiceBus.Notifications;

3. In your Program class add the following method:

        private static async void SendNotificationAsync()
        {
            NotificationHubClient hub = NotificationHubClient.CreateClientFromConnectionString("<connection string with full access>", "<hub name>");
            string toastMessage = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
                "<wp:Notification xmlns:wp=\"WPNotification\">" +
                   "<wp:Toast>" +
                        "<wp:Text1>Hello From .NET!</wp:Text1>" +
                   "</wp:Toast> " +
                "</wp:Notification>";
            await hub.SendMpnsNativeNotificationAsync(toast);
        }

4. Then add the following line in your Main method:

         SendNotificationAsync()

5. Press the F5 key to run the app. You should receive a toast notification.

   ![][14]

To send a notification using a Mobile Service, follow [Get started with Mobile Services], then:

1. Log on to the [Windows Azure Management Portal], and select your Mobile Service.

2. Select the tab **Scheduler** on the top.

   ![][15]

3. Create a new scheduled job, insert a name, and select **On demand**.

   ![][16]

4. When the job is created, click the job name. Then click the tab **Script** in the top bar.

5. Insert the following script inside your scheduler function. Make sure to replace the placeholders with your notification hub name and the connection string for *DefaultFullSharedAccessSignature* that you obtained earlier. Click **Save**.

        var azure = require('azure');
        var notificationHubService = azure.createNotificationHubService('<hub name>',
    <connection string with full access>');
        notificationHubService.mpns.sendToast(
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

In this simple example you broadcast notifications to all your Windows Phone 8 devices. In order to target specific users refer to the tutorial [Use Notification Hubs to push notifications to users], while if you want to segment your users by interest groups you can read [Use Notification Hubs to send breaking news]. Learn more about how to use Notification Hubs in [Notification Hubs Guidance] and on the [Notification Hubs How-To for Windows Phone 8].

<!-- Anchors. -->
[Create your Notification Hub]: #configure-hub
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

[13]: notification-hub-create-wp-app.png
[14]: mobile-app-enable-push-wp8.png

[213]: notification-hub-create-console-app.png
[214]: notification-hub-windows-toast.png
[215]: notification-hub-scheduler1.png
[216]: notification-hub-scheduler2.png
[217]: mobile-services-win8-edit2-app.png

<!-- URLs. -->
[Visual Studio 2012 Express for Windows Phone]: https://go.microsoft.com/fwLink/p/?LinkID=268374
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started/#create-new-service
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/
[Windows Developer Preview registration steps for Mobile Services]: ../HowTo/mobile-services-windows-developer-preview-registration.md

[Notification Hubs Guidance]: http://msdn.microsoft.com/en-us/library/jj927170.aspx
[Notification Hubs How-To for Windows Phone 8]: tbd!!!
[MPNS authenticated mode]: http://msdn.microsoft.com/en-us/library/windowsphone/develop/ff941099(v=vs.105).aspx
