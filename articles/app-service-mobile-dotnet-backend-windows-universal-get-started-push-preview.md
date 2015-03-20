<properties 
	pageTitle="Add push notifications to your Windows Universal app with Azure App Service" 
	description="Learn how to use Azure App Service to send push notifications to your Windows Universal app." 
	services="app-service\mobile" 
	documentationCenter="windows" 
	authors="yuaxu" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="app-service-mobile" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="03/16/2015" 
	ms.author="yuaxu"/>

# Add push notifications to your Mobile Services app

[AZURE.INCLUDE [app-service-mobile-selector-get-started-push-preview](../includes/app-service-mobile-selector-get-started-push-preview.md)]

This topic shows you how to send push notifications to a Windows Universal app from a .NET backend using Azure App Service. When complete, your will be sending push notifications from your .NET backend to all registered Windows Universal apps on record insertion.

This tutorial walks you through these basic steps to enable push notifications:

1. [Register your app for push notifications](#register)
2. [Configure](#configure)
2. [Update the service to send push notifications](#update-service)
3. [Enable push notifications for local testing](#local-testing)
4. [Test push notifications in your app](#test)

This tutorial is based on the App Service Mobile App quickstart. Before you start this tutorial, you must first complete either [Get started with App Service mobile apps].

To complete this tutorial, you need the following:

* An active [Microsoft Store account](http://go.microsoft.com/fwlink/p/?LinkId=280045).
* <a href="https://go.microsoft.com/fwLink/p/?LinkID=391934" target="_blank">Visual Studio Community 2013</a>. 

##<a id="register"></a>Register your app for push notifications

To send push notifications to Windows Universal apps with Azure App Service, you must submit your app to the Windows Store. You must then configure your mobile app push notification service credentials to integrate with WNS.

1. If you have not already registered your app, navigate to the <a href="http://go.microsoft.com/fwlink/p/?LinkID=266582" target="_blank">Submit an app page</a> in the Dev Center for Windows Store apps, log on with your Microsoft account, and then click **App name**.

    ![][0]

2. Type a name for your app in **App name**, click **Reserve app name**, and then click **Save**.

    ![][1]

    This creates a new Windows Store registration for your app.

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

##<a id="configure"></a>Configure Mobile App to send push requests

1. Log on to the [Azure Preview Portal], select **Browse**, **Mobile Apps**, and then click your app. click on Push Notification services.

2. In Windows Notification Service, enter your **Client secret** and **Package security identifier (SID)** and save.

Your App Service mobile app is now configured to work with WNS.

<!-- URLs. -->
[Azure Preview Portal]: https://portal.azure.com/

##<a id="update-service"></a>Update the service to send push notifications

Now that push notifications are enabled in the app, you must update your app backend to send push notifications. 

1. In Visual Studio, right-click the solution, then click **Manage NuGet Packages**.

2. Search for **WindowsAzure.ServiceBus** and click **Install** for all projects in the solution.

3. In Visual Studio Solution Explorer, expand the **Controllers** folder in the mobile backend project. Open TodoItemController.cs. At the top of the file, add the following `using` statements:

        using System;
        using System.Collections.Generic;
        using Microsoft.ServiceBus.Notifications;

4. Update the `PostTodoItem` method definition with the following code:  

        public async Task<IHttpActionResult> PostTodoItem(TodoItem item)
        {
            TodoItem current = await InsertAsync(item);

            // get notification hubs credentials associated with this mobile app
            string notificationHubName = this.Services.Settings.NotificationHubName;
            string notificationHubConnection = this.Services.Settings.Connections[ServiceSettingsKeys.NotificationHubConnectionString].ConnectionString;

            // connect to notification hub
            NotificationHubClient Hub = NotificationHubClient.CreateClientFromConnectionString(notificationHubConnection, notificationHubName)

            var windowsToastPayload = @"<toast><visual><binding template=""ToastText01""><text id=""1"">" + item.Text + @"</text></binding></visual></toast>";

            try
            {
                var result = await Hub.Push.SendWindowsNativeNotificationAsync(windowsToastPayload);
            }
            catch (System.Exception ex)
            {
                throw;
            }
            return CreatedAtRoute("Tables", new { id = current.Id }, current);
        }

    This code tells the Notification Hub associated with this mobile app to send a push notification after a todo item insertion.


<h2><a name="publish-the-service"></a>Publish the mobile backend to Azure</h2>

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-publish-service-preview](../includes/app-service-mobile-dotnet-backend-publish-service-preview.md)]

## Add push notifications to your app

1. In Visual Studio, right-click the solution, then click **Manage NuGet Packages**. 

    This displays the Manage NuGet Packages dialog box.

2. Search for the App Service Mobile App client SDK for managed and click **Install**, select all projects in the solution, and accept the terms of use. 

    This downloads, installs, and adds a reference in all projects to the Azure Messaging library for Windows using the <a href="http://nuget.org/packages/WindowsAzure.Messaging.Managed/">WindowsAzure.Messaging.Managed NuGet package</a>. 

3. Open the App.xaml.cs project file and add the following `using` statements:

        using Microsoft.AzureAppServiceMobile;

    In a universal project, this file is located in the `<project_name>.Shared` folder.

4. Also in App.xaml.cs, add the following **InitNotificationsAsync** method definition to the **App** class:
    
        private async void InitNotificationsAsync()
        {
            var channel = await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();
            
            var result = MobileService.GetPush().RegisterAsync(channel.Uri);
        }
    
    This code retrieves the ChannelURI for the app from WNS, and then registers that ChannelURI with your App Service Mobile App.
    
5. At the top of the **OnLaunched** event handler in App.xaml.cs, add the following call to the new **InitNotificationsAsync** method:

        InitNotificationsAsync();

    This guarantees that the short-lived ChannelURI is registered each time the application is launched.

6. In Solution Explorer double-click **Package.appxmanifest** of the Windows Store app, in **Notifications**, set **Toast capable** to **Yes**:

    ![][18]

    From the **File** menu, click **Save All**.

7. (Optional) Repeat the previous step in the Windows Phone Store app project.

8. Press the **F5** key to run the apps.

Your app is now ready to receive toast notifications.

##<a id="test"></a> Test push notifications in your app

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-windows-universal-test-push-preview](../includes/app-service-mobile-dotnet-backend-windows-universal-test-push-preview.md)]

<!-- Anchors. -->

<!-- Images. -->
[0]: ./media/notification-hubs-windows-store-dotnet-get-started/mobile-services-submit-win8-app.png
[1]: ./media/notification-hubs-windows-store-dotnet-get-started/mobile-services-win8-app-name.png
[2]: ./media/notification-hubs-windows-store-dotnet-get-started/notification-hub-create-windows-universal-app.png
[3]: ./media/notification-hubs-windows-store-dotnet-get-started/notification-hub-associate-win8-app.png
[4]: ./media/notification-hubs-windows-store-dotnet-get-started/mobile-services-select-app-name.png
[5]: ./media/notification-hubs-windows-store-dotnet-get-started/mobile-services-win8-edit-app.png
[6]: ./media/notification-hubs-windows-store-dotnet-get-started/mobile-services-win8-app-push-auth.png
[7]: ./media/notification-hubs-windows-store-dotnet-get-started/notification-hub-create-from-portal.png
[17]: ./media/notification-hubs-windows-store-dotnet-get-started/mobile-services-win8-edit2-app.png

<!-- URLs. -->
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253
[Get started with Mobile Services]: /documentation/articles/mobile-services-dotnet-backend-windows-store-dotnet-get-started
[Get started with data]: /documentation/articles/mobile-services-dotnet-backend-windows-universal-dotnet-get-started-data
[Get started with authentication]: /documentation/articles/mobile-services-dotnet-backend-windows-universal-dotnet-get-started-users
[Get started with Mobile Services]: /en-us/documentation/articles/app-service-mobile-dotnet-backend-windows-store-dotnet-get-started-preview

[Send push notifications to authenticated users]: /documentation/articles/mobile-services-dotnet-backend-windows-store-dotnet-push-notifications-app-users/

[What are Notification Hubs?]: /documentation/articles/notification-hubs-overview/

[How to use a .NET client for Azure Mobile Services]: /documentation/articles/mobile-services-windows-dotnet-how-to-use-client-library/
