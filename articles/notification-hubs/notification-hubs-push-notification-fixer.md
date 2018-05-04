---
title: Azure Notification Hubs dropped notification diagnosis
description: Learn how to diagnose common issues with dropped notifications in Azure Notification Hubs.
services: notification-hubs
documentationcenter: Mobile
author: dimazaid
manager: kpiteira
editor: spelluru

ms.assetid: b5c89a2a-63b8-46d2-bbed-924f5a4cce61
ms.service: notification-hubs
ms.workload: mobile
ms.tgt_pltfrm: NA
ms.devlang: multiple
ms.topic: article
ms.date: 04/14/2018
ms.author: dimazaid

---
# Diagnose dropped notifications in Notification Hubs

One of the most common questions from Azure Notification Hubs customers is how to troubleshoot when notifications that are sent from an application don't appear on client devices. They want to know where and why notifications were dropped, and how to fix the issue. This article identifies why notifications might get dropped or not be received by devices. Learn how to analyze and determine the root cause. 

It's critical to first understand how the Notification Hubs service pushes notifications to a device.

![Notification Hubs architecture][0]

In a typical send notification flow, the message is sent from the *application back end* to Notification Hubs. Notification Hubs does some processing on all the registrations. The processing takes into account the configured tags and tag expressions to determine "targets." Targets are all the registrations that need to receive the push notification. These registrations can span any or all our supported platforms: iOS, Google, Windows, Windows Phone, Kindle, and Baidu for China Android.

With the targets established, the Notification Hubs service pushes notifications to the *push notification service* for the device platform. Examples include the Apple Push Notification service (APNs) for Apple and Firebase Cloud Messaging (FCM) for Google. Notification Hubs pushes notifications split across multiple batches of registrations. Notification Hubs authenticates with the respective push notification service based on the credentials that you set in the Azure portal, under **Configure Notification Hub**. The push notification service then forwards the notifications to the respective *client devices*. 

The final leg of notification delivery takes place between the platform push notification service and the device. Any of the four major components in the push notification process (client, application back end, Notification Hubs, and the platform push notification service) might cause notifications to be dropped. For more information about the Notification Hubs architecture, see [Notification Hubs overview].

Failure to deliver notifications might occur during the initial test/staging phase. Dropped notifications at this stage might indicate a configuration issue. If failure to deliver notifications occurs in production, either some or all of the notifications might be dropped. In this case, a deeper application or messaging pattern issue is indicated. 

The next section looks at scenarios in which notifications might be dropped, ranging from common to more rare.

## Notification Hubs misconfiguration
To successfully send notifications to the respective push notification service, the Notification Hubs service needs to authenticate itself in the context of the developer's application. For this to occur, the developer creates a developer account with the respective platform (Google, Apple, Windows, and so on). Then, the developer registers their application with the platform where they get credentials. 

You must add platform credentials to the Azure portal. If no notifications are reaching the device, the first step should be to ensure that the correct credentials are configured in Notification Hubs. The credentials must match the application that is created under a platform-specific developer account. 

For step-by-step instructions to complete this process, see [Get started with Azure Notification Hubs].

Here are some common misconfigurations to check for:

* **General**
   
    * Ensure that your notification hub name (without typos) is the same in each of these locations:

        * Where you register from the client.
        * Where you send notifications from the back end.
        * Where you configured the push notification service credentials.
    
    * Ensure that you use the correct shared access signature configuration strings on the client and on the application back end. Generally, you must use **DefaultListenSharedAccessSignature** on the client and **DefaultFullSharedAccessSignature** on the application back end (grants permissions to send notifications to Notification Hubs).

* **APNs configuration**
   
    You must maintain two different hubs: one hub for production, and another hub for testing. This means that you must upload the certificate that you use in a sandbox environment to a separate hub than the certificate and hub that you are going to use in production. Don't try to upload different types of certificates to the same hub. This might cause notification failures. 
    
    If you inadvertently upload different types of certificates to the same hub, we recommend that you delete the hub and start fresh with a new hub. If for some reason you can't delete the hub, at a minimum, you must delete all the existing registrations from the hub. 

* **FCM configuration** 
   
    1. Ensure that the *server key* that you obtained from Firebase matches the server key that you registered in the Azure portal.
   
    ![Firebase server key][3]
   
    2. Ensure that you have configured **Project ID** on the client. You can obtain the value for **Project ID** from the Firebase dashboard.
   
    ![Firebase Project ID][1]

## Application issues
* **Tags and tag expressions**

    If you use tags or tag expressions to segment your audience, it's possible that when you send the notification, no target is found based on the tags or tag expressions that you specify in your send call. 
    
    Review your registrations to ensure that there are matching tags when you send a notification. Then, verify the notification receipt only from the clients that have those registrations. 
    
    As an example, if all your registrations with Notification Hubs were made by using the tag "Politics" and you send a notification with the tag "Sports," the notification isn't sent to any device. A complex case might involve tag expressions in which you registered by using "Tag A" OR "Tag B," but while sending notifications, you target "Tag A && Tag B." In the self-diagnosis tips section later in the article, we show you how to review your registrations and their tags. 

* **Template issues**

    If you use templates, ensure that you follow the guidelines described in [Templates]. 

* **Invalid registrations**

    If the notification hub was configured correctly, and if any tags or tag expressions were used correctly, valid targets are found. Notifications should be sent to these targets. The Notification Hubs service then fires off several processing batches in parallel. Each batch sends messages to a set of registrations. 

    > [!NOTE]
    > Because processing is performed in parallel, the order in which the notifications are delivered is not guaranteed. 

    Notification Hubs is optimized for an "at-most once" message delivery model. We attempt deduplication, so that no notifications are delivered more than once to a device. To ensure this, we check registrations and ensure that only one message is sent per device identifier before the message is sent to the push notification service. 

    As each batch is sent to the push notification service, which in turn is accepting and validating the registrations, it's possible that the push notification service will detect an error with one or more of the registrations in a batch. In this case, the push notification service returns an error to Notification Hubs, and the process stops. The push notification service drops that batch completely. This is especially true with APNS, which uses a TCP stream protocol. 

    We are optimized for at-most once delivery. But in this case, the faulting registration is removed from the database. Then, we retry notification delivery for the rest of the devices in that batch.

    To get more error information about the failed delivery attempt against a registration, you can use the Notification Hubs REST APIs [Per Message Telemetry: Get Notification Message Telemetry](https://msdn.microsoft.com/library/azure/mt608135.aspx) and [PNS feedback](https://msdn.microsoft.com/library/azure/mt705560.aspx). For sample code, see the [Send REST example](https://github.com/Azure/azure-notificationhubs-samples/tree/master/dotnet/SendRestExample).

## Push notification service issues
After the notification message has been received by the platform push notification service, it's the responsibility of the push notification service to deliver the notification to the device. At this point, the Notification Hubs service is out of the picture and has no control over when or if the notification is delivered to the device. 

Because platform notification services are robust, notifications tend to reach devices from the push notification service in a few seconds. If the push notification service is throttling,  Notification Hubs applies an exponential back-off strategy. If the push notification service remains unreachable for 30 minutes, we have a policy in place to expire and drop those messages permanently. 

If a push notification service attempts to deliver a notification but the device is offline, the notification is stored by the push notification service for a limited period of time. The notification is delivered to the device when the device becomes available. 

For each app, only one recent notification is stored. If multiple notifications are sent while a device is offline, each new notification causes the prior notification to be discarded. Keeping only the newest notification is referred to as *coalescing notifications* in APNs, and *collapsing* in FCM (which uses a collapsing key). If the device remains offline for a long time, any notifications that were being stored for the device  are discarded. For more information, see [APNs overview] and [About FCM messages].

With Azure Notification Hubs, you can pass a coalescing key via an HTTP header by using the generic SendNotification API. For example, for the .NET SDK, you'd use **SendNotificationAsync**. The SendNotification API also takes HTTP headers that are passed as-is to the respective push notification service. 

## Self-diagnosis tips
Here are paths to diagnosing the root cause of dropped notifications in Notification Hubs:

### Verify credentials
* **Push notification service developer portal**
   
    Verify credentials in the respective push notification service developer portal (APNs, FCM, Windows Notification Service, and so on). For more information, see [Get started with Azure Notification Hubs].

* **Azure portal**
   
    To review and match the credentials with those that you obtained from the push notification service developer portal, in the Azure portal, go to the **Access Policies** tab. 
   
    ![Azure portal Access Policies][4]

### Verify registrations
* **Visual Studio**
   
    If you use Visual Studio for development, you can connect to Azure through Server Explorer to view and manage multiple Azure services, including Notification Hubs. This is primarily useful for your dev/test environment. 
   
    ![Visual Studio Server Explorer][9]
   
    You can view and manage all the registrations in your hub, categorized by platform, native or template registration, any tags, push notification service identifier, registration ID, and expiration date. You can also edit a registration on this page. This is especially useful for editing tags. 
   
    ![Visual Studio Device Registrations][8]
   
   > [!NOTE]
   > Use Visual Studio to edit registrations only during dev/test, and with a limited number of registrations. If you need to edit your registrations in bulk, consider using the export and import registration functionality described in [Export and modify registrations in bulk](https://msdn.microsoft.com/library/dn790624.aspx).
   > 
   > 
* **Service Bus Explorer**
   
    Many customers use [Service Bus Explorer] to view and manage their notification hub. Service Bus Explorer is an open-source project. For samples, see [Service Bus Explorer code].

### Verify message notifications
* **Azure portal**
   
    To send a test notification to your clients without having a service back end up and running, under **SUPPORT + TROUBLESHOOTING**, select **Test Send**. 
   
    ![Test Send functionality in Azure][7]
* **Visual Studio**
   
    You can also send test notifications from Visual Studio.
   
    ![Test Send functionality in Visual Studio][10]
   
    For more information about using Notification Hubs with Visual Studio Server Explorer, see these articles: 
   
   * [View device registrations for notification hubs]
   * [Deep dive: Visual Studio 2013 Update 2 RC and Azure SDK 2.3]
   * [Announcing release of Visual Studio 2013 Update 3 and Azure SDK 2.4]

### Debug failed notifications and review notification outcome
**EnableTestSend property**

When you send a notification via Notification Hubs, initially, the notification is queued for processing in Notification Hubs. Notification Hubs determines the correct targets, and then sends the notification to the push notification service. If you are using the REST API or any of the client SDKs, the successful return of your send call means only that the message has been successfully queued with Notification Hubs. You don't have any insight into what happened when Notification Hubs eventually sent the message to the push notification service. 

If your notification doesn't arrive at the client device, it's possible that an error occurred when Notification Hubs tried to deliver the message to the push notification service. For example, the payload size might exceed the maximum allowed by the push notification service, or the credentials configured in Notification Hubs might be invalid. 

To get insight into push notification service errors, you can use the [EnableTestSend] property. This property is automatically enabled when you send test messages from the portal or Visual Studio client. You can use this property to see detailed debugging information. You can also use the property via APIs. Currently, you can use it in the .NET SDK. Eventually, it will be added to all client SDKs. 

To use the **EnableTestSend** property with the REST call, append a query string parameter called *test* to the end of your send call. For example: 

    https://mynamespace.servicebus.windows.net/mynotificationhub/messages?api-version=2013-10&test

**Example (.NET SDK)**

Here's an example of using the .NET SDK to send a native pop-up (toast) notification:

```csharp
    NotificationHubClient hub = NotificationHubClient.CreateClientFromConnectionString(connString, hubName);
    var result = await hub.SendWindowsNativeNotificationAsync(toast);
    Console.WriteLine(result.State);
```

At the end of the execution, **result.State** simply states **Enqueued**. The results don't provide  any insight into what happened to your push notification. 

Next, you can use the **EnableTestSend** Boolean property. Use the **EnableTestSend** property while you initialize **NotificationHubClient** to get a detailed status about push notification service errors that occur when the notification is sent. The send call takes additional time to return because it's returned only after Notification Hubs has delivered the notification to the push notification service to determine the outcome. 

```csharp
    bool enableTestSend = true;
    NotificationHubClient hub = NotificationHubClient.CreateClientFromConnectionString(connString, hubName, enableTestSend);

    var outcome = await hub.SendWindowsNativeNotificationAsync(toast);
    Console.WriteLine(outcome.State);

    foreach (RegistrationResult result in outcome.Results)
    {
        Console.WriteLine(result.ApplicationPlatform + "\n" + result.RegistrationId + "\n" + result.Outcome);
    }
```

**Sample output**

    DetailedStateAvailable
    windows
    7619785862101227384-7840974832647865618-3
    The Token obtained from the Token Provider is wrong

This message indicates that either invalid credentials are configured in Notification Hubs, or there's an issue with the registrations in the hub. We recommend that you delete this registration, and let the client re-create the registration before sending the message. 

> [!NOTE]
> Use of the **EnableTestSend** property is heavily throttled. Use this option only in a dev/test environment, and with a limited set of registrations. We send debug notifications to only 10 devices. We also have a limit of processing debug sends to 10 per minute. 
> 
> 

### Review telemetry
* **Use the Azure portal**
   
    In the portal, you can get a quick overview of all the activity in your notification hub. 
   
    1. On the **Overview** tab, you can see an aggregated view of registrations, notifications, and errors by platform. 
   
        ![Notification Hubs overview dashboard][5]
   
    2. On the **Monitor** tab, you can add many other platform-specific metrics for a deeper look. You can look specifically at any errors related to the push notification service that are returned when the Notification Hubs service tries to send the notification to the push notification service. 
   
        ![Azure portal activity log][6]
   
    3. Begin by reviewing **Incoming Messages**, **Registration Operations**, and **Successful Notifications**. Then, go to the per-platform tab to review errors that are specific to the push notification service. 
   
    4. If the authentication settings for your notification hub are incorrect, the message **PNS Authentication Error** appears. This is a good indication to check the push notification service credentials. 

* **Programmatic access**

    For more information about programmatic access, see these articles: 

    * [Programmatic telemetry access]  
    * [Telemetry access via APIs sample] 

    > [!NOTE]
    > Several telemetry-related features, like exporting and importing registrations and telemetry access via APIs, are available only on the Standard service tier. If you attempt to use these features from the Free or Basic service tier, you receive an exception message if you use the SDK, and an HTTP 403 (Forbidden) error if you use the features directly from the REST APIs. 
    >
    >To use telemetry-related features, first ensure in the Azure portal that you are using the Standard service tier.  
> 
> 

<!-- IMAGES -->
[0]: ./media/notification-hubs-diagnosing/Architecture.png
[1]: ./media/notification-hubs-diagnosing/FCMConfigure.png
[3]: ./media/notification-hubs-diagnosing/FCMServerKey.png
[4]: ../../includes/media/notification-hubs-portal-create-new-hub/notification-hubs-connection-strings-portal.png
[5]: ./media/notification-hubs-diagnosing/PortalDashboard.png
[6]: ./media/notification-hubs-diagnosing/PortalAnalytics.png
[7]: ./media/notification-hubs-ios-get-started/notification-hubs-test-send.png
[8]: ./media/notification-hubs-diagnosing/VSRegistrations.png
[9]: ./media/notification-hubs-diagnosing/VSServerExplorer.png
[10]: ./media/notification-hubs-diagnosing/VSTestNotification.png

<!-- LINKS -->
[Notification Hubs overview]: notification-hubs-push-notification-overview.md
[Get started with Azure Notification Hubs]: notification-hubs-windows-store-dotnet-get-started-wns-push-notification.md
[Templates]: https://msdn.microsoft.com/library/dn530748.aspx 
[APNs overview]: https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/APNSOverview.html
[About FCM messages]: https://firebase.google.com/docs/cloud-messaging/concept-options
[Export and modify registrations in bulk]: http://msdn.microsoft.com/library/dn790624.aspx
[Service Bus Explorer]: https://msdn.microsoft.com/library/dn530751.aspx#sb_explorer
[Service Bus Explorer code]: https://code.msdn.microsoft.com/windowsazure/Service-Bus-Explorer-f2abca5a
[View device registrations for notification hubs]: http://msdn.microsoft.com/library/windows/apps/xaml/dn792122.aspx 
[Deep dive: Visual Studio 2013 Update 2 RC and Azure SDK 2.3]: http://azure.microsoft.com/blog/2014/04/09/deep-dive-visual-studio-2013-update-2-rc-and-azure-sdk-2-3/#NotificationHubs 
[Announcing release of Visual Studio 2013 Update 3 and Azure SDK 2.4]: http://azure.microsoft.com/blog/2014/08/04/announcing-release-of-visual-studio-2013-update-3-and-azure-sdk-2-4/ 
[EnableTestSend]: https://docs.microsoft.com/dotnet/api/microsoft.azure.notificationhubs.notificationhubclient.enabletestsend?view=azure-dotnet
[Programmatic telemetry access]: http://msdn.microsoft.com/library/azure/dn458823.aspx
[Telemetry access via APIs sample]: https://github.com/Azure/azure-notificationhubs-samples/tree/master/FetchNHTelemetryInExcel

