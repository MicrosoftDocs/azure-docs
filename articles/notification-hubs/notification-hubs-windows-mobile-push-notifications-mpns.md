<properties
	pageTitle="Sending push notifications with Azure Notification Hubs on Windows Phone | Microsoft Azure"
	description="In this tutorial, you learn how to use Azure Notification Hubs to push notifications to a Windows Phone 8 or Windows Phone 8.1 Silverlight application."
	services="notification-hubs"
	documentationCenter="windows"
    keywords="push notification,push notification,windows phone push"
	authors="wesmc7777"
	manager="erikre"
	editor="erikre"/>

<tags
	ms.service="notification-hubs"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-windows-phone"
	ms.devlang="dotnet"
	ms.topic="hero-article"
	ms.date="06/29/2016"
	ms.author="wesmc"/>

# Sending push notifications with Azure Notification Hubs on Windows Phone

[AZURE.INCLUDE [notification-hubs-selector-get-started](../../includes/notification-hubs-selector-get-started.md)]

##Overview

> [AZURE.NOTE] To complete this tutorial, you must have an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdocumentation%2Farticles%2Fnotification-hubs-windows-phone-get-started%2F).

This tutorial shows you how to use Azure Notification Hubs to send push notifications to a Windows Phone 8 or Windows Phone 8.1 Silverlight application. If you are targeting Windows Phone 8.1 (non-Silverlight), then refer to the [Windows Universal](notification-hubs-windows-store-dotnet-get-started-wns-push-notification.md) version.
In this tutorial, you create a blank Windows Phone 8 app that receives push notifications by using the Microsoft Push Notification Service (MPNS). When you're finished, you'll be able to use your notification hub to broadcast push notifications to all the devices running your app.

> [AZURE.NOTE] The Notification Hubs Windows Phone SDK does not support using the Windows Push Notification Service (WNS) with Windows Phone 8.1 Silverlight apps. To use WNS (instead of MPNS) with Windows Phone 8.1 Silverlight apps, follow the [Notification Hubs - Windows Phone Silverlight tutorial], which uses REST APIs.

The tutorial demonstrates the simple broadcast scenario in using Notification Hubs.

##Prerequisites

This tutorial requires the following:

+ [Visual Studio 2012 Express for Windows Phone], or a later version.

Completing this tutorial is a prerequisite for all other Notification Hubs tutorials for Windows Phone 8 apps.

##Create your notification hub

[AZURE.INCLUDE [notification-hubs-portal-create-new-hub](../../includes/notification-hubs-portal-create-new-hub.md)]

<ol start="6">
<li><p>Click the <b>Notification Services</b> section (within <i>Settings</i>), click on <b>Windows Phone (MPNS)</b> and then click the <b>Enable unauthenticated push</b> check box.</p>
</li>
</ol>

&emsp;&emsp;![Azure Portal - Enable unathenticated push notifications](./media/notification-hubs-windows-phone-get-started/azure-portal-unauth.png)

Your hub is now created and configured to send unauthenticated notification for Windows Phone.

> [AZURE.NOTE] This tutorial uses MPNS in unauthenticated mode. MPNS unauthenticated mode comes with restrictions on notifications that you can send to each channel. Notification Hubs supports [MPNS authenticated mode](http://msdn.microsoft.com/library/windowsphone/develop/ff941099.aspx) by allowing you to upload your certificate.

##Connecting your app to the notification hub

1. In Visual Studio, create a new Windows Phone 8 application.

   	![Visual Studio - New Project - Windows Phone App][13]

	In Visual Studio 2013 Update 2 or later, you instead create a Windows Phone Silverlight application.

	![Visual Studio - New Project - Blank App - Windows Phone Silverlight][11]

2. In Visual Studio, right-click the solution, and then click **Manage NuGet Packages**.

	This displays the **Manage NuGet Packages** dialog box.

3. Search for `WindowsAzure.Messaging.Managed` and click **Install**, and then accept the terms of use.

	![Visual Studio - NuGet Package Manager][20]

	This downloads, installs, and adds a reference to the Azure Messaging library for Windows by using the <a href="http://nuget.org/packages/WindowsAzure.Messaging.Managed/">WindowsAzure.Messaging.Managed NuGet package</a>.

4. Open the file App.xaml.cs and add the following `using` statements:

        using Microsoft.Phone.Notification;
        using Microsoft.WindowsAzure.Messaging;

5. Add the following code at the top of **Application_Launching** method in App.xaml.cs:

	    var channel = HttpNotificationChannel.Find("MyPushChannel");
        if (channel == null)
        {
            channel = new HttpNotificationChannel("MyPushChannel");
            channel.Open();
            channel.BindToShellToast();
        }

        channel.ChannelUriUpdated += new EventHandler<NotificationChannelUriEventArgs>(async (o, args) =>
        {
            var hub = new NotificationHub("<hub name>", "<connection string>");
            var result = await hub.RegisterNativeAsync(args.ChannelUri.ToString());

            System.Windows.Deployment.Current.Dispatcher.BeginInvoke(() =>
            {
                MessageBox.Show("Registration :" + result.RegistrationId, "Registered", MessageBoxButton.OK);
            });
        });

    >[AZURE.NOTE] The value **MyPushChannel** is an index that is used to lookup an existing channel in the [HttpNotificationChannel](https://msdn.microsoft.com/library/windows/apps/microsoft.phone.notification.httpnotificationchannel.aspx) collection. If there isn't one there, create a new entry with that name.
    
    Make sure to insert the name of your hub and the connection string called **DefaultListenSharedAccessSignature** that you obtained in the previous section.
    This code retrieves the channel URI for the app from MPNS, and then registers that channel URI with your notification hub. It also guarantees that the channel URI is registered in your notification hub each time the application is launched.

	>[AZURE.NOTE]This tutorial sends a toast notification to the device. When you send a tile notification, you must instead call the **BindToShellTile** method on the channel. To support both toast and tile notifications, call both **BindToShellTile** and  **BindToShellToast**.

6. In Solution Explorer, expand **Properties**, open the `WMAppManifest.xml` file, click the **Capabilities** tab, and make sure that the **ID_CAP_PUSH_NOTIFICATION** capability is checked.

   	![Visual Studio - Windows Phone App Capabilities][14]

   	This ensures that your app can receive push notifications. Without it, any attempt to send a push notification to the app will fail.

7. Press the `F5` key to run the app.

	A registration message is displayed in the app.

8. Close the app.  

   >[AZURE.NOTE] To receive a toast push notification, the application must not be running in the foreground.

##Send push notifications from your backend

You can send push notifications by using Notification Hubs from any backend via the public <a href="http://msdn.microsoft.com/library/windowsazure/dn223264.aspx">REST interface</a>. In this tutorial, you send push notifications using a .NET console application. 

For an example of how to send push notifications from an ASP.NET WebAPI backend that's integrated with Notification Hubs, see [Azure Notification Hubs Notify Users with .NET backend](./notification-hubs-aspnet-backend-windows-dotnet-wns-notification.md).  

For an example of how to send push notifications by using the [REST APIs](https://msdn.microsoft.com/library/azure/dn223264.aspx), check out [How to use Notification Hubs from Java](./notification-hubs-java-push-notification-tutorial.md) and [How to use Notification Hubs from PHP](./notification-hubs-php-push-notification-tutorial.md).

1. Right-click the solution, select **Add** and **New Project...**, and then under **Visual C#**, click **Windows** and **Console Application**, and click **OK**.

   	![Visual Studio - New Project - Console Application][6]

	This adds a new Visual C# console application to the solution. You can also do this in a separate solution.

4. Click **Tools**, click **Library Package Manager**, and then click **Package Manager Console**.

	This displays the Package Manager Console.

5.  In the **Package Manager Console** window, set the **Default project** to your new console application project, and then in the console window, execute the following command:

        Install-Package Microsoft.Azure.NotificationHubs

	This adds a reference to the Azure Notification Hubs SDK using the <a href="http://www.nuget.org/packages/Microsoft.Azure.NotificationHubs/">Microsoft.Azure.Notification Hubs NuGet package</a>.

6. Open the `Program.cs` file and add the following `using` statement:

        using Microsoft.Azure.NotificationHubs;

6. In the `Program` class, add the following method:

        private static async void SendNotificationAsync()
        {
            NotificationHubClient hub = NotificationHubClient
				.CreateClientFromConnectionString("<connection string with full access>", "<hub name>");
            string toast = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
                "<wp:Notification xmlns:wp=\"WPNotification\">" +
                   "<wp:Toast>" +
                        "<wp:Text1>Hello from a .NET App!</wp:Text1>" +
                   "</wp:Toast> " +
                "</wp:Notification>";
            await hub.SendMpnsNativeNotificationAsync(toast);
        }

	Make sure to replace the `<hub name>` placeholder with the name of the notification hub that appears in the portal. Also, replace the connection string placeholder with the connection string called **DefaultFullSharedAccessSignature** that you obtained in the section "Configure your notification hub."

	>[AZURE.NOTE]Make sure that you use the connection string with **Full** access, not **Listen** access. The listen-access string does not have permissions to send push notifications.

4. Add the following line in your `Main` method:

         SendNotificationAsync();
		 Console.ReadLine();

5. With your Windows Phone emulator running and your app closed, set the console application project as the default startup project, and then press the `F5` key to run the app.

	You will receive a toast push notification. Tapping the toast banner loads the app.

You can find all the possible payloads in the [toast catalog] and [tile catalog] topics on MSDN.

##Next steps

In this simple example, you broadcasted push notifications to all your Windows Phone 8 devices. 

In order to target specific users, refer to the [Use Notification Hubs to push notifications to users] tutorial. 

If you want to segment your users by interest groups, you can read [Use Notification Hubs to send breaking news]. 

Learn more about how to use Notification Hubs in [Notification Hubs Guidance].



<!-- Images. -->
[6]: ./media/notification-hubs-windows-phone-get-started/notification-hub-create-console-app.png
[7]: ./media/notification-hubs-windows-phone-get-started/notification-hub-create-from-portal.png
[8]: ./media/notification-hubs-windows-phone-get-started/notification-hub-create-from-portal2.png
[9]: ./media/notification-hubs-windows-phone-get-started/notification-hub-select-from-portal.png
[10]: ./media/notification-hubs-windows-phone-get-started/notification-hub-select-from-portal2.png
[11]: ./media/notification-hubs-windows-phone-get-started/notification-hub-create-wp-silverlight-app.png
[12]: ./media/notification-hubs-windows-phone-get-started/notification-hub-connection-strings.png

[13]: ./media/notification-hubs-windows-phone-get-started/notification-hub-create-wp-app.png
[14]: ./media/notification-hubs-windows-phone-get-started/mobile-app-enable-push-wp8.png
[15]: ./media/notification-hubs-windows-phone-get-started/notification-hub-pushauth.png
[20]: ./media/notification-hubs-windows-phone-get-started/notification-hub-windows-universal-app-install-package.png
[213]: ./media/notification-hubs-windows-phone-get-started/notification-hub-create-console-app.png





<!-- URLs. -->
[Visual Studio 2012 Express for Windows Phone]: https://go.microsoft.com/fwLink/p/?LinkID=268374
[Notification Hubs Guidance]: http://msdn.microsoft.com/library/jj927170.aspx
[MPNS authenticated mode]: http://msdn.microsoft.com/library/windowsphone/develop/ff941099(v=vs.105).aspx
[Use Notification Hubs to push notifications to users]: notification-hubs-aspnet-backend-windows-dotnet-wns-notification.md
[Use Notification Hubs to send breaking news]: notification-hubs-windows-phone-send-breaking-news.md
[toast catalog]: http://msdn.microsoft.com/library/windowsphone/develop/jj662938(v=vs.105).aspx
[tile catalog]: http://msdn.microsoft.com/library/windowsphone/develop/hh202948(v=vs.105).aspx
[Notification Hubs - Windows Phone Silverlight tutorial]: https://github.com/Azure/azure-notificationhubs-samples/tree/master/PushToSLPhoneApp

