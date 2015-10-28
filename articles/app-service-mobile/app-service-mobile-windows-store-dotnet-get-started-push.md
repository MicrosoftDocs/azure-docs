<properties 
	pageTitle="Add push notifications to your Windows Runtime 8.1 universal app | Azure Mobile Apps" 
	description="Learn how to use Azure App Service Mobile Apps and Azure Notification Hubs to send push notifications to your Windows app." 
	services="app-service\mobile,notification-hubs" 
	documentationCenter="windows" 
	authors="ggailey777" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="app-service-mobile" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="08/14/2015" 
	ms.author="glenga"/>

# Add push notifications to your Windows Runtime 8.1 universal app

[AZURE.INCLUDE [app-service-mobile-selector-get-started-push](../../includes/app-service-mobile-selector-get-started-push.md)]
&nbsp;  
[AZURE.INCLUDE [app-service-mobile-note-mobile-services](../../includes/app-service-mobile-note-mobile-services.md)]

##Overview

This topic shows you how to send push notifications to a Windows Runtime 8.1 universal app by using Azure App Service Mobile Apps and Azure Notification Hubs. In this scenario, when a new item is added, your Mobile App backend sends a push notification to all Windows apps registered with the Windows Notification Service (WNS).

This tutorial is based on the App Service Mobile App quickstart. Before you start this tutorial, you must first complete the quickstart tutorial [Create a Windows app](../app-service-mobile-windows-store-dotnet-get-started.md). If you do not use the downloaded quick start server project, you must add the push notification extension package to your project. For more information about server extension packages, see [Work with the .NET backend server SDK for Azure Mobile Apps](app-service-mobile-dotnet-backend-how-to-use-server-sdk.md). 

##Prerequisites

To complete this tutorial, you need the following:

* An active [Microsoft Store account](http://go.microsoft.com/fwlink/p/?LinkId=280045).
* [Visual Studio Community 2013](https://go.microsoft.com/fwLink/p/?LinkID=391934)
* Complete the [quickstart tutorial](../app-service-mobile-windows-store-dotnet-get-started.md).  



##<a name="create-gateway"></a>Create a Notification Hub

Follow these steps to create a new Notification Hub to handle push notifications. If you already have a hub in the same resource group, you do not need to complete this section.

1. Visit the [Azure Portal]. Click **Browse All** > **Mobile Apps** > the backend that you just created. Click **Settings** > **Mobile** > **Push**. 

2. Follow the work flow to create a notification hub. You will need to create a new namespace if there is none in your current resource group. Click **Create** once you've configured all the settings.

Next, you will use this notificaton hub to enable push for your app.

##Register your app for push notifications

Before you can send push notifications to your Windows apps from Azure, you must submit your app to the Windows Store. You can then configure your server project to integrate with WNS.

1. In Visual Studio Solution Explorer, right-click the Windows Store app project, click **Store** > **Associate App with the Store...**. 

    ![Associate app with Windows Store](./media/app-service-mobile-windows-store-dotnet-get-started-push/notification-hub-associate-win8-app.png)
    
2. In the wizard, click **Next**, sign in with your Microsoft account, type a name for your app in **Reserve a new app name**, then click **Reserve**.

3. After the app registration is successfully created, select the new app name, click **Next**, and then click **Associate**. This adds the required Windows Store registration information to the application manifest. 

7. Repeat steps 1 and 3 for the Windows Phone Store app project using the same registration you previously created for the Windows Store app.  

7. Navigate to the [Windows Dev Center](https://dev.windows.com/en-us/overview), sign-in with your Microsoft account, click the new app registration in **My apps**, then expand **Services** > **Push notifications**. 

8. In the **Push notifications** page, click **Live Services site** under **Microsoft Azure Mobile Services**.

9. In the **App Settings** tab, make a note of the values of **Client secret** and **Package SID**. 

    ![App setting in the developer center](./media/app-service-mobile-windows-store-dotnet-get-started-push/mobile-services-win8-app-push-auth.png)

    > [AZURE.IMPORTANT] The client secret and package SID are important security credentials. Do not share these values with anyone or distribute them with your app.

##Configure Mobile App to send push requests

1. Log on to the [Azure Portal], select **Browse** > **Mobile App** > your app > **Push notification services**.

2. In **Windows Notification Service**, enter the **Security key** (client secret) and **Package SID** that you obtained from the Live Services site, then click **Save**.

Your Mobile App backend is now configured to work with WNS.

##<a id="update-service"></a>Update the server to send push notifications

Now that push notifications are enabled in the app, you must update your app backend to send push notifications. 

1. In Visual Studio, right-click the server project and click **Manage NuGet Packages**, search for `Microsoft.Azure.NotificationHubs`, then click **Install**. This installs the Notification Hubs client library.

3. In the server project, open **Controllers** > **TodoItemController.cs**, and add the following using statements:

		using System.Collections.Generic;
		using Microsoft.Azure.NotificationHubs;
		using Microsoft.Azure.Mobile.Server.Config;
	

2. In the **PostTodoItem** method, add the following code after the call to **InsertAsync**:  

        // Get the settings for the server project.
        HttpConfiguration config = this.Configuration;
        MobileAppSettingsDictionary settings = 
			this.Configuration.GetMobileAppSettingsProvider().GetMobileAppSettings();
        
        // Get the Notification Hubs credentials for the Mobile App.
        string notificationHubName = settings.NotificationHubName;
        string notificationHubConnection = settings
            .Connections[MobileAppSettingsKeys.NotificationHubConnectionString].ConnectionString;

        // Create a new Notification Hub client.
        NotificationHubClient hub = NotificationHubClient
        .CreateClientFromConnectionString(notificationHubConnection, notificationHubName);

		// Define a WNS payload
		var windowsToastPayload = @"<toast><visual><binding template=""ToastText01""><text id=""1"">" 
                                + item.Text + @"</text></binding></visual></toast>";

        try
        {
			// Send the push notification and log the results.
            var result = await hub.SendWindowsNativeNotificationAsync(windowsToastPayload);

            // Write the success result to the logs.
            config.Services.GetTraceWriter().Info(result.State.ToString());
        }
        catch (System.Exception ex)
        {
            // Write the failure result to the logs.
            config.Services.GetTraceWriter()
                .Error(ex.Message, null, "Push.SendAsync Error");
        }

    This code tells the notification hub to send a push notification after a new item is insertion.


## <a name="publish-the-service"></a>Publish the mobile backend to Azure

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-publish-service](../../includes/app-service-mobile-dotnet-backend-publish-service.md)]

##<a id="update-service"></a>Add push notifications to your app

1. In Visual Studio, right-click the solution, then click **Manage NuGet Packages**. 

    This displays the Manage NuGet Packages dialog box.

2. Search for the App Service Mobile App client SDK for managed and click **Install**, select all client projects in the solution, and accept the terms of use. 

    This downloads, installs, and adds a reference in all client projects to the Azure Mobile Push library for Windows. 

3. Open the shared **App.xaml.cs** project file and add the following `using` statements:

		using System.Threading.Tasks;  
        using Windows.Networking.PushNotifications;       

4. In the same file, add the following **InitNotificationsAsync** method definition to the **App** class:
    
        private async Task InitNotificationsAsync()
        {
            var channel = await PushNotificationChannelManager
                .CreatePushNotificationChannelForApplicationAsync();

            await App.MobileService.GetPush().RegisterAsync(channel.Uri);
        }
    
    This code retrieves the ChannelURI for the app from WNS, and then registers that ChannelURI with your App Service Mobile App.
    
5. At the top of the **OnLaunched** event handler in **App.xaml.cs**, add the **async** modifier to the method definition and add the following call to the new **InitNotificationsAsync** method, as in the following example:

        protected async override void OnLaunched(LaunchActivatedEventArgs e)
        {
            await InitNotificationsAsync();

			// ...
		}

    This guarantees that the short-lived ChannelURI is registered each time the application is launched.

6. In Solution Explorer double-click **Package.appxmanifest** of the Windows Store app, in **Notifications**, set **Toast capable** to **Yes**.

    From the **File** menu, click **Save All**.

7. Repeat the previous step in the Windows Phone Store app project.

Your app is now ready to receive toast notifications.

##<a id="test"></a>Test push notifications in your app

[AZURE.INCLUDE [app-service-mobile-windows-universal-test-push](../../includes/app-service-mobile-windows-universal-test-push.md)]

<!-- Anchors. -->

<!-- URLs. -->
[Azure Portal]: https://portal.azure.com/

<!-- Images. -->