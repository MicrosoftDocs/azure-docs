<properties 
	pageTitle="Get started with Azure Notification Hubs" 
	description="Learn how to use Azure Notification Hubs to push notifications." 
	services="notification-hubs" 
	documentationCenter="windows" 
	authors="ggailey777" 
	manager="dwrede" 
	editor="dwrede"/>

<tags 
	ms.service="notification-hubs" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="" 
	ms.devlang="dotnet" 
	ms.topic="hero-article" 
	ms.date="02/11/2015" 
	ms.author="wesmc"/>

# Getting Started with Notification Hubs

<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/documentation/articles/notification-hubs-windows-store-dotnet-get-started/" title="Windows Universal" class="current">Windows Universal</a><a href="/en-us/documentation/articles/notification-hubs-windows-phone-get-started/" title="Windows Phone">Windows Phone</a><a href="/en-us/documentation/articles/notification-hubs-ios-get-started/" title="iOS">iOS</a><a href="/en-us/documentation/articles/notification-hubs-android-get-started/" title="Android">Android</a><a href="/en-us/documentation/articles/notification-hubs-kindle-get-started/" title="Kindle">Kindle</a><a href="/en-us/documentation/articles/notification-hubs-baidu-get-started/" title="Baidu">Baidu</a><a href="/en-us/documentation/articles/partner-xamarin-notification-hubs-ios-get-started/" title="Xamarin.iOS">Xamarin.iOS</a><a href="/en-us/documentation/articles/partner-xamarin-notification-hubs-android-get-started/" title="Xamarin.Android">Xamarin.Android</a><a href="/en-us/documentation/articles/notification-hubs-chrome-get-started/" title="Chrome">Chrome</a></div>

##Overview

This topic shows you how to use Azure Notification Hubs to send push notifications to a Windows Store or Windows Phone 8.1 (non-Silverlight) application. If you are targeting Windows Phone 8.1 Silverlight, please refer to the [Windows Phone](/en-us/documentation/articles/notification-hubs-windows-phone-get-started/) version. 
In this tutorial you create a blank Windows Store app that receives push notifications using the Windows Push Notification service (WNS). When complete, you will be able to broadcast push notifications to all the devices running your app using your notification hub.



This tutorial demonstrates a simple broadcast scenario using Notification Hubs. Be sure to follow along with the next tutorial to learn how to use Notification Hubs to address specific users and groups of devices. 


##Prerequisites

This tutorial requires the following:

+ Microsoft Visual Studio Express 2013 for Windows with Update 2<br/>This version of Visual Studio is required to create a universal app project. If you just want to create a Windows Store app, you need Visual Studio 2012 Express for Windows 8.

+ An active Windows Store account

+ An active Azure account. <br/>If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fwww.windowsazure.com%2Fen-us%2Fdevelop%2Fmobile%2Ftutorials%2Fget-started%2F" target="_blank">Azure Free Trial</a>.

Completing this tutorial is a prerequisite for all other Notification Hubs tutorials for Windows Store apps. 

##Register your app for the Windows Store

To send push notifications to Windows Store apps from Mobile Services, you must submit your app to the Windows Store. You must then configure your notification hub to integrate with WNS.

1. If you have not already registered your app, navigate to the <a href="http://go.microsoft.com/fwlink/p/?LinkID=266582" target="_blank">Submit an app page</a> in the Dev Center for Windows Store apps, log on with your Microsoft account, and then click **App name**.

   	![][0]

2. Type a name for your app in **App name**, click **Reserve app name**, and then click **Save**.

   	![][1]

   	This creates a new Windows Store registration for your app.

3. In Visual Studio, create a new Visual C# Store Apps project using the **Blank App** template.

   	![][2]

4. In Solution Explorer, right-click the Windows Store app project, click **Store**, and then click **Associate App with the Store...**. 

   	![][3]

   	The **Associate Your App with the Windows Store** wizard appears.

5. In the wizard, click **Sign in** and then log in with your Microsoft account.

6. Click the app that you registered in step 2, click **Next**, and then click **Associate**.

   	![][4]

   	This adds the required Windows Store registration information to the application manifest. 

7. (Optional) Repeat steps 4-6 for the Windows Phone Store app project.  

7. Back in the Windows Dev Center page for your new app, click **Services**. 

   	![][5] 

8. In the **Services** page, click **Live Services site** under **Microsoft Azure Mobile Services**.

   	![][17]

9. In the **App Settings** tab, make a note of the values of **Client secret** and **Package security identifier (SID)**. 

   	![][6]

 	> [AZURE.NOTE] **Security Note**
	The client secret and package SID are important security credentials. Do not share these values with anyone or distribute them with your app.

##Configure your Notification Hub

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

7. Select the tab **Dashboard** at the top, and then click the **Connection Information** button at the bottom of the page. Take note of the two connection strings.

   	![][12]

Your notification hub is now configured to work with WNS, and you have the connection strings to register your app and send notifications.

##Connecting your app to the Notification Hub

1. In Visual Studio, right-click the solution, then click **Manage NuGet Packages**. 

	This displays the Manage NuGet Packages dialog box.

2. Search for `WindowsAzure.Messaging.Managed` and click **Install**, select all projects in the solution, and accept the terms of use. 

	![][20]

	This downloads, installs, and adds a reference in all projects to the Azure Messaging library for Windows using the <a href="http://nuget.org/packages/WindowsAzure.Messaging.Managed/">WindowsAzure.Messaging.Managed NuGet package</a>. 

3. Open the App.xaml.cs project file and add the following `using` statements:

        using Windows.Networking.PushNotifications;
        using Microsoft.WindowsAzure.Messaging;
		using Windows.UI.Popups;

	In a universal project, this file is located in the `<project_name>.Shared` folder.

4. Also in App.xaml.cs, add the following **InitNotificationsAsync** method definition to the **App** class:
	
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
	
    This code retrieves the ChannelURI for the app from WNS, and then registers that ChannelURI with your notification hub.

    >[AZURE.NOTE]Make sure to replace the "hub name" placeholder with the name of the notification hub that appears in the portal on the **Notification Hubs** tab (for example, **mynotificationhub2** in the previous example). Also replace the connection string placeholder with the **DefaultListenSharedAccessSignature** connection string that you obtained in the previous section.
    
5. At the top of the **OnLaunched** event handler in App.xaml.cs, add the following call to the new **InitNotificationsAsync** method:

        InitNotificationsAsync();

    This guarantees that the ChannelURI is registered in your notification hub each time the application is launched.

6. In Solution Explorer double-click **Package.appxmanifest** of the Windows Store app, in **Notifications**, set **Toast capable** to **Yes**:

   	![][18]

   	From the **File** menu, click **Save All**.

7. (Optional) Repeat the previous step in the Windows Phone Store app project.

8. Press the **F5** key to run the app. A popup dialog with the registration key is displayed.
   
   	![][19]

9. (Optional) Repeat the previous step to run the other project.

Your app is now ready to receive toast notifications.

##Send notification from your back-end

You can send notifications using Notification Hubs from any back-end using the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/dn223264.aspx">REST interface</a>. In this tutorial you send notifications with a .NET console application. For an example of how to send notifications from an Azure Mobile Services backend integrated with Notification Hubs, see **Get started with push notifications in Mobile Services** ([.NET backend](/en-us/documentation/articles/mobile-services-javascript-backend-windows-store-dotnet-get-started-push/) | [JavaScript backend](/en-us/documentation/articles/mobile-services-javascript-backend-windows-store-dotnet-get-started-push/)).  For an example of how to send notifications using the REST APIs, see **How to use Notification Hubs from Java/PHP** ([Java](/en-us/documentation/articles/notification-hubs-java-backend-how-to/) | [PHP](/en-us/documentation/articles/notification-hubs-php-backend-how-to/)).

1. Right-click the solution, select **Add** and **New Project...**, then under **Visual C#** click **Windows** and **Console Application** and click **OK**. 

   	![][13]

	This adds a new Visual C# console application to the solution. You can also do this in a separate solution. 

4. In Visual Studio, click **Tools**, then click **Nuget Package Manager**, then click **Package Manager Console**. 

	This displays the Package Manager Console in Visual Studio.

6. In the Package Manager Console window, set the **Default project** to your new console application project, then in the console window execute the following command:

        Install-Package WindowsAzure.ServiceBus
    
	This adds a reference to the Azure Service Bus SDK with the <a href="http://nuget.org/packages/WindowsAzure.ServiceBus/">WindowsAzure.ServiceBus NuGet package</a>. 

5. Open the file Program.cs and add the following `using` statement:

        using Microsoft.ServiceBus.Notifications;

6. In the **Program** class, add the following method:

        private static async void SendNotificationAsync()
        {
            NotificationHubClient hub = NotificationHubClient
				.CreateClientFromConnectionString("<connection string with full access>", "<hub name>");
            var toast = @"<toast><visual><binding template=""ToastText01""><text id=""1"">Hello from a .NET App!</text></binding></visual></toast>";
            await hub.SendWindowsNativeNotificationAsync(toast);
        }

   	Make sure to replace the "hub name" placeholder with the name of the notification hub that appears in the portal on the **Notification Hubs** tab. Also, replace the connection string placeholder with the connection string called **DefaultFullSharedAccessSignature** that you obtained in the section "Configure your Notification Hub." 

	>[AZURE.NOTE]Make sure that you use the connection string with **Full** access, not **Listen** access. The listen access string does not have permissions to send notifications.

7. Then add the following lines in the **Main** method:

         SendNotificationAsync();
		 Console.ReadLine();

8. Right click the console application project in Visual Studio and click **Set as StartUp Project** to set it as the startup project. Then press the **F5** key to run the application. 

   	![][14]

	You will receive a toast notification on all registered devices. Clicking or taping on the toast banner loads the app.

You can find all the supported payloads in the [toast catalog], [tile catalog], and [badge overview] topics on MSDN.

##Next steps

In this simple example you sent broadcast notifications to all your Windows devices. In order to target specific users, refer to the tutorial [Use Notification Hubs to push notifications to users]. If you want to segment your users by interest groups, see [Use Notification Hubs to send breaking news]. To learn more about how to use Notification Hubs, see [Notification Hubs Guidance].



<!-- Images. -->
[0]: ./media/notification-hubs-windows-store-dotnet-get-started/mobile-services-submit-win8-app.png
[1]: ./media/notification-hubs-windows-store-dotnet-get-started/mobile-services-win8-app-name.png
[2]: ./media/notification-hubs-windows-store-dotnet-get-started/notification-hub-create-windows-universal-app.png
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
[20]: ./media/notification-hubs-windows-store-dotnet-get-started/notification-hub-windows-universal-app-install-package.png

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
