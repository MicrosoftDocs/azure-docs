---
title: Get started with Azure Notification Hubs for Universal Windows Platform apps | Microsoft Docs
description: In this tutorial, you learn how to use Azure Notification Hubs to push notifications to a Windows Universal Platform application.
services: notification-hubs
documentationcenter: windows
author: ysxu
manager: erikre
editor: erikre

ms.assetid: cf307cf3-8c58-4628-9c63-8751e6a0ef43
ms.service: notification-hubs
ms.workload: mobile
ms.tgt_pltfrm: mobile-windows
ms.devlang: dotnet
ms.topic: hero-article
ms.date: 10/03/2016
ms.author: yuaxu

---
# Get started with Notification Hubs for Universal Windows Platform apps

[!INCLUDE [notification-hubs-selector-get-started](../../includes/notification-hubs-selector-get-started.md)]

## Overview
This article shows you how to use Azure Notification Hubs to send push notifications to a Universal Windows Platform (UWP) app.

In this article, you create a blank Windows Store app that receives push notifications by using the Windows Push Notification Service (WNS). When you're finished, you can use your notification hub to broadcast push notifications to all devices that are running your app.

## Before you begin
[!INCLUDE [notification-hubs-hero-slug](../../includes/notification-hubs-hero-slug.md)]

You can find the completed code for this tutorial on [GitHub](https://github.com/Azure/azure-notificationhubs-samples/tree/master/dotnet/GetStartedWindowsUniversal).

## Prerequisites
This tutorial requires the following:

* [Microsoft Visual Studio Community 2015](https://www.visualstudio.com/products/visual-studio-community-vs) or later
* [UWP app-development tools installed](https://msdn.microsoft.com/windows/uwp/get-started/get-set-up)
* An active Azure account  
    If you don't have an account, you can create a free trial account in just a couple of minutes. For more information, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdocumentation%2Farticles%2Fnotification-hubs-windows-store-dotnet-get-started%2F).
* An active Windows Store account

Completing this tutorial is a prerequisite for all other Notification Hubs tutorials for UWP apps.

## Register your app for the Windows Store
To send push notifications to UWP apps, associate your app to the Windows Store. Then, configure your notification hub to integrate with WNS.

1. If you have not already registered your app, navigate to the [Windows Dev Center](https://dev.windows.com/overview), sign in with your Microsoft account, and then select **Create a new app**.

2. Type a name for your app, and then select **Reserve app name**. Doing so creates a new Windows Store registration for your app.

3. In Visual Studio, create a new Visual C# Store apps project by using the UWP **Blank App** template, and then select **OK**.

4. Accept the defaults for the target and minimum platform versions.

5. In Solution Explorer, right-click the Windows Store app project, select **Store**, and then select **Associate App with the Store**.  
    The **Associate Your App with the Windows Store** wizard appears.

6. In the wizard, sign in with your Microsoft account.

7. Select the app that you registered in step 2, select **Next**, and then select **Associate**. Doing so adds the required Windows Store registration information to the application manifest.

8. Back on the [Windows Dev Center](http://dev.windows.com/overview) page for your new app, select **Services**, select **Push notifications**, and then select **WNS/MPNS**.

9. Select **New Notification**.

10. Select **Blank (Toast)** template, and then select **OK**.

11. Enter a notification **Name** and Visual **Context** message, and then select **Save as draft**.

12. Go to the [Application Registration Portal](http://apps.dev.microsoft.com) and sign in.

13. Select your application name. In **Windows Store** platform settings, note the **Application Secret** password and the **Package security identifier (SID)**.

    >[!WARNING]
    >The application secret and package SID are important security credentials. Do not share these values with anyone or distribute them with your app.

## Configure your notification hub
[!INCLUDE [notification-hubs-portal-create-new-hub](../../includes/notification-hubs-portal-create-new-hub.md)]

<ol start="5">
<li><p>Select <b>Notification Services</b> > <b>Windows (WNS)</b>, and then enter the application secret password in the <b>Security Key</b> box. In the <b>Package SID</b> box, enter the value that you obtained from WNS in the previous section, and then select <b>Save</b>.</p>
</li>
</ol>

![The Package SID and Security Key boxes](./media/notification-hubs-windows-store-dotnet-get-started/notification-hub-configure-wns.png)

Your notification hub is now configured to work with WNS. You have the connection strings to register your app and send notifications.

## Connect your app to the notification hub
1. In Visual Studio, right-click the solution, and then select **Manage NuGet Packages**.  
    The **Manage NuGet Packages** window opens.

2. In the search box, enter **WindowsAzure.Messaging.Managed**, select **Install**, and accept the terms of use.
   
    ![The Manage NuGet Packages window][20]
   
    This action downloads, installs, and adds a reference to the Azure messaging library for Windows by using the [WindowsAzure.Messaging.Managed NuGet package](http://nuget.org/packages/WindowsAzure.Messaging).

3. Open the App.xaml.cs project file, and add the following `using` statements: 
   
        using Windows.Networking.PushNotifications;
        using Microsoft.WindowsAzure.Messaging;
        using Windows.UI.Popups;

4. In App.xaml.cs, also add to the **App** class the following **InitNotificationsAsync** method definition:
   
        private async void InitNotificationsAsync()
        {
            var channel = await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();
   
            var hub = new NotificationHub("<your hub name>", "<Your DefaultListenSharedAccessSignature connection string>");
            var result = await hub.RegisterNativeAsync(channel.Uri);
   
            // Displays the registration ID so you know it was successful
            if (result.RegistrationId != null)
            {
                var dialog = new MessageDialog("Registration successful: " + result.RegistrationId);
                dialog.Commands.Add(new UICommand("OK"));
                await dialog.ShowAsync();
            }
   
        }
   
    This code retrieves the channel URI for the app from WNS, and then registers that channel URI with your notification hub.
   
    >[!NOTE]
    >* Replace the **hub name** placeholder with the name of the notification hub that appears in the Azure portal. 
    >* Also replace the connection string placeholder with the **DefaultListenSharedAccessSignature** connection string that you obtained from the **Access Polices** page of your notification hub in a previous section.
   > 
   > 
5. At the top of the **OnLaunched** event handler in App.xaml.cs, add the following call to the new **InitNotificationsAsync** method:
   
        InitNotificationsAsync();
   
    This action guarantees that the channel URI is registered in your notification hub each time the application is launched.

6. To run the app, select the **F5** key. A dialog box that contains the registration key is displayed.

Your app is now ready to receive toast notifications.

## Send notifications
You can quickly test receiving notifications in your app by sending notifications in the [Azure portal](https://portal.azure.com/). Use the **Test Send** button on the notification hub, as shown in the following image:

![The Test Send pane](./media/notification-hubs-windows-store-dotnet-get-started/notification-hub-test-send-wns.png)

Push notifications are normally sent in a back-end service like Mobile Services or ASP.NET by using a compatible library. If a library is not available for your back end, you can also send notification messages by using the REST API directly. 

This tutorial demonstrates how to test your client app simply by sending notifications that use the .NET SDK for notification hubs in a console application instead of a back-end service. We recommend the [Use Notification Hubs to push notifications to users] tutorial as the next step for sending notifications from an ASP.NET back end. However, you can send notifications by using the following approaches:

* **REST interface**: You can support notifications on any back-end platform by using the [REST interface](http://msdn.microsoft.com/library/windowsazure/dn223264.aspx).

* **Microsoft Azure Notification Hubs .NET SDK**: In the NuGet Package Manager for Visual Studio, run [Install-Package Microsoft.Azure.NotificationHubs](https://www.nuget.org/packages/Microsoft.Azure.NotificationHubs/).

* **Node.js**: See [How to use Notification Hubs from Node.js](notification-hubs-nodejs-push-notification-tutorial.md).
* **Azure Mobile Apps**: For an example of how to send notifications from an Azure mobile app that's integrated with Notification Hubs, see [Add push notifications for Mobile Apps](../app-service-mobile/app-service-mobile-windows-store-dotnet-get-started-push.md).

* **Java or PHP**: For examples of how to send notifications by using the REST APIs, see:
    * [Java](notification-hubs-java-push-notification-tutorial.md)
    * [PHP](notification-hubs-php-push-notification-tutorial.md)

## (Optional) Send notifications from a console app
To send notifications by using a .NET console application, do the following: 

1. Right-click the solution, select **Add** > **New Project**, under **Visual C#**, select **Windows** and **Console Application**, and then select **OK**.
   
    A new Visual C# console application is added to the solution. You can also add the project in a separate solution.

2. In Visual Studio, select **Tools**, select **NuGet Package Manager**, and then select **Package Manager Console**.
   
    The Package Manager Console opens in Visual Studio.

3. In the Package Manager Console window, set the **Default project** to your new console application project and then, in the console window, run the following command:
   
        Install-Package Microsoft.Azure.NotificationHubs
   
    This action adds a reference to the Azure Notification Hubs SDK by using the [Microsoft.Azure.Notification Hubs NuGet package](http://www.nuget.org/packages/Microsoft.Azure.NotificationHubs/).
   
    ![The "Default project" name](./media/notification-hubs-windows-store-dotnet-get-started/notification-hub-package-manager.png)

4. Open the Program.cs file, and then add the following `using` statement:
   
        using Microsoft.Azure.NotificationHubs;

5. In the **Program** class, add the following method:
   
        private static async void SendNotificationAsync()
        {
            NotificationHubClient hub = NotificationHubClient
                .CreateClientFromConnectionString("<connection string with full access>", "<hub name>");
            var toast = @"<toast><visual><binding template=""ToastText01""><text id=""1"">Hello from a .NET App!</text></binding></visual></toast>";
            await hub.SendWindowsNativeNotificationAsync(toast);
        }
   
    >[!NOTE]
    >* Replace the **hub name** placeholder with the name of the notification hub that appears in the Azure portal. 
    >* Replace the connection string placeholder with the **DefaultFullSharedAccessSignature** connection string that you obtained from the **Access Policies** page of your Notification Hub in the "Configure your notification hub" section.
    >* Use the connection string that has *full* access, not *listen* access. The listen-access string does not have permissions to send notifications.
   > 
   > 
6. In the **Main** method, add the following lines:
   
         SendNotificationAsync();
         Console.ReadLine();

7. Right-click the console application project in Visual Studio, and then select **Set as StartUp Project** to set it as the startup project. Then select the **F5** key to run the application.
   
    You will receive a toast notification on all registered devices. Selecting or tapping the toast banner loads the app.

You can find all the supported payloads in the [toast catalog], [tile catalog], and [badge overview] topics on MSDN.

## Next steps
In this simple example, you sent broadcast notifications to all your Windows devices by using the portal or a console app. For your next step, we recommend the [Use Notification Hubs to push notifications to users] tutorial. It demonstrates how to send notifications from an ASP.NET back end by using tags to target specific users.

If you want to segment your users by interest groups, see [Use Notification Hubs to send breaking news]. 

For more general information about Notification Hubs, see [Notification Hubs guidance](notification-hubs-push-notification-overview.md).

<!-- Images. -->
[13]: ./media/notification-hubs-windows-store-dotnet-get-started/notification-hub-create-console-app.png
[14]: ./media/notification-hubs-windows-store-dotnet-get-started/notification-hub-windows-toast.png
[19]: ./media/notification-hubs-windows-store-dotnet-get-started/notification-hub-windows-reg.png
[20]: ./media/notification-hubs-windows-store-dotnet-get-started/notification-hub-windows-universal-app-install-package.png

<!-- URLs. -->

[Use Notification Hubs to push notifications to users]: notification-hubs-aspnet-backend-windows-dotnet-wns-notification.md
[Use Notification Hubs to send breaking news]: notification-hubs-windows-notification-dotnet-push-xplat-segmented-wns.md

[toast catalog]: http://msdn.microsoft.com/library/windows/apps/hh761494.aspx
[tile catalog]: http://msdn.microsoft.com/library/windows/apps/hh761491.aspx
[badge overview]: http://msdn.microsoft.com/library/windows/apps/hh779719.aspx
 
