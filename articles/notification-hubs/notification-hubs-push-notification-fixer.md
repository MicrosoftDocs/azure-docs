<properties 
	pageTitle="Azure Notification Hubs - Diagnosis Guidelines" 
	description="Guidelines on how to diagnose common issues with Azure Notification Hubs." 
	services="notification-hubs" 
	documentationCenter="Mobile" 
	authors="wesmc7777" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="notification-hubs" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="NA" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="05/04/2016" 
	ms.author="wesmc"/>

#Azure Notification Hubs - Diagnosis guidelines

##Overview

One of the most common questions we hear from Azure Notification Hubs customers is how to figure out why they don’t see a notification sent from their application backend appear on the client device - where and why notifications were dropped and how to fix this. In this article we will go through the various reasons why notifications may get dropped or do not end up on the devices. We will also look through ways in which you can analyze and figure out the root cause. 

First of all, it is critical to understand how Azure Notification Hubs pushes out notifications to the devices.
![][0]

In a typical send notification flow, the message is sent from the **application backend** to **Azure Notification Hub (NH)** which in turn does some processing on all the registrations taking into account the configured tags & tag expressions to determine "targets" i.e. all the registrations that need to receive the push notification. These registrations can span across any or all of our supported platforms - iOS, Google, Windows, Windows Phone, Kindle and Baidu for China Android. Once the targets are established, NH then pushes out notifications, split across multiple batch of registrations, to the device platform specific **Push Notification Service (PNS)** - e.g. APNS for Apple, GCM for Google etc. NH authenticates with the respective PNS based on the credentials you set in the Azure Classic Portal on the Configure Notification Hub page. The PNS then forwards the notifications to the respective **client devices**. This is the platform recommended way to deliver push notifications and note that the final leg of notification delivery takes place between the platform PNS and the device. Therefore we have four major components - *client*, *application backend*, *Azure Notification Hubs (NH)* and *Push Notification Services (PNS)* and any of these may cause notifications getting dropped. More details on this architecture is available on [Notification Hubs Overview].

Failure to deliver notifications may happen during the initial test/staging phase which may indicate a configuration issue or it may happen in production where either all or some of the notifications may be getting dropped indicating some deeper application or messaging pattern issue. In the section, below we will look at various dropped notifications scenarios ranging from common to the rarer kind, some of which you may find obvious and some others not so much. 

##Azure Notifications Hub mis-configuration 

Azure Notification Hubs needs to authenticate itself in the context of the developer's application to be able to successfully send notifications to the respective PNS. This is made possible by the developer creating a developer account with the respective platform (Google, Apple, Windows etc) and then registering their application where they get credentials which need to be configured in the portal under Notification Hubs configuration section. If no notifications are making through, first step should be to ensure that the correct credentials are configured in the Notification Hub matching them with the application created under their platform specific developer account. You will find our [Getting Started Tutorials] useful to go over this process in a step by step manner. Here are some common mis-configurations:

1. **General**
 
	a) Make sure that your notification hub name (without typos) is the same:

	- Where you are registering from the client, 
	- Where you are sending notifications from the backend,  
	- Where you have configured the PNS credentials and 
	- Whose SAS credentials you have configured on the client and the backend. 
		
	b) Make sure that you are using the correct SAS configuration strings on the client and the application backend. As a rule of thumb, you must be using the **DefaultListenSharedAccessSignature** on the client and **DefaultFullSharedAccessSignature** on the application backend (which gives permission to be able to send notification to the NH)

2. **Apple Push Notification Service (APNS) configuration**
 
	You must maintain two different hubs - one for production and another for testing purpose. This means uploading the certificate you are going to use in sandbox environment to a separate hub and the certificate you are going to use in production to a separate hub. Do not try to upload different types of certificates to the same hub as it may cause notification failures down the line. If you do find yourself in a position where you have inadvertently uploaded different types of certificate to the same hub, it is recommended to delete the hub and start fresh. If for some reason, you are not able to delete the hub then at the very least, you must delete all the existing registrations from the hub. 

3. **Google Cloud Messaging (GCM) configuration** 

	a) Make sure that you are enabling "Google Cloud Messaging for Android" under your cloud project. 
	
	![][2]
	
	b) Make sure that you create a "Server Key" while obtaining the credentials which NH will use to authenticate with GCM. 
	
	![][3]
	
	c) Make sure that you have configured "Project ID" on the client which is an entirely numerical entity that you can obtain from the dashboard:
	
	![][1]

##Application issues

1) **Tags/ Tag expressions**

If you are using tags or tag expressions to segment your audience, it is always possible that when you are sending the notification, there is no target being found based on the tags/tag expressions you are specifying in your send call. It is best to review your registrations to ensure that there are tags which match when you send notification and then verify the notification receipt only from the clients with those registrations. E.g. if all your registrations with NH were done with say tag "Politics" and you are sending a notification with tag "Sports", it will not be sent to any device. A complex case could involve tag expressions where you only registered with "Tag A" OR "Tag B" but while sending notifications, you are targeting "Tag A && Tag B". In the self-diagnose tips section below, there are ways in which you can review your registrations along with the tags they have. 

2) **Template issues**

If you are using templates then ensure that you are following the guidelines described at [Template guidance]. 

3) **Invalid registrations**

Assuming the Notification Hub was configured correctly and any tags/tag expressions were used correctly resulting in the find of valid targets to which the notifications need to be sent, NH fires off several processing batches in parallel - each batch sending messages to a set of registrations. 

> [AZURE.NOTE] Since we do the processing in parallel, we don’t guarantee the order in which the notifications will be delivered. 

Now Azure Notifications Hub is optimized for an "at-most once" message delivery model. This means that we attempt a de-duplication so that no notifications are delivered more than once to a device. To ensure this we look through the registrations and make sure that only one message is sent per device identifier before actually sending the message to the PNS. As each batch is sent to the PNS, which in turn is accepting and validating the registrations, it is possible that the PNS detects an error with one or more of the registrations in a batch, returns an error to Azure NH and stops processing thereby dropping that batch completely. This is especially true with APNS which uses a TCP stream protocol. Although we are optimized for at-most once delivery, in this case we remove the faulting registration from our database and then retry notification delivery for the rest of the devices in that batch.

You can get error information for the failed delivery attempt against a registration using the Azure Notification Hubs REST APIs: [Per Message Telemetry: Get Notification Message Telemetry](https://msdn.microsoft.com/library/azure/mt608135.aspx)
and [PNS Feedback](https://msdn.microsoft.com/library/azure/mt705560.aspx). See the [SendRESTExample](https://github.com/Azure/azure-notificationhubs-samples/tree/master/dotnet/SendRestExample) for example code.

##PNS issues

Once the notification message has been received by the respective PNS then it is its responsibility to deliver the notification to the device. Azure Notification Hubs is out of the picture here and has no control on when or if the notification is going to be delivered to the device. Since the platform notification services are pretty robust, notifications do tend to reach the devices in a few seconds from the PNS. If the PNS however is throttling then Azure Notification Hubs does apply an exponential back off strategy and if the PNS remains unreachable for 30 min then we have a policy in place to expire and drop those messages permanently. 

If a PNS attempts to deliver a notification but the device is offline, the notification is stored by the PNS for a limited period of time, and delivered to the device when it becomes available. Only one recent notification for a particular app is stored. If multiple notifications are sent while the device is offline, each new notification causes the prior notification to be discarded. This behavior of keeping only the newest notification is referred to as coalescing notifications in APNS and collapsing in GCM (which uses a collapsing key). If the device remains offline for a long time, any notifications that were being stored for it are discarded. 
Source - [APNS guidance] & [GCM guidance]

With Azure Notification Hubs - you can pass a coalescing key via an HTTP header using the generic `SendNotification` API (e.g. for .NET SDK – `SendNotificationAsync`) which also takes HTTP headers which are passed as is to the respective PNS. 

##Self-diagnose tips

Here we will examine the various avenues to diagnose and root cause any Notification Hub issues:

###Verify credentials

1. **PNS developer portal**

	Verify them at the respective PNS developer portal (APNS, GCM, WNS etc) using our [Getting Started Tutorials].

2. **Azure Classic portal**

	Go to the Configure tab to review and match the credentials with those obtained from the PNS developer portal. 

	![][4]

###Verify registrations

1. **Visual Studio**

	If you use Visual Studio for development then you can connect to Microsoft Azure and view and manage a bunch of Azure services including Notifications Hub from "Server Explorer". This is primarily useful for your dev/test environment. 

	![][9]

	You can view and manage all the registrations in your hub which are nicely categorized for platform, native or template registration, any tags, PNS identifier, registration id and the expiration date. You can also edit a registration on the fly - which is useful say if you want to edit any tags. 

	![][8]
 
	> [AZURE.NOTE] Visual Studio functionality to edit registrations should only be used during dev/test with limited number of registrations. If there arises a need to fix your registrations in bulk, consider using the Export/Import registration functionality described here - [Export/Import Registrations] (https://msdn.microsoft.com/library/dn790624.aspx)

2. **Service Bus explorer**

	Many customers use ServiceBus explorer described here - [ServiceBus Explorer] for viewing and managing their notification hub. It is an open source project available from code.microsoft.com - [ServiceBus Explorer code]

###Verify message notifications

1. **Azure Classic Portal**

	You can go to the "Debug" tab to send test notifications to your clients without needing any service backend up and running. 

	![][7]

2. **Visual Studio**

	You can also send test notifications from the comforts of Visual Studio:

	![][10]

	You can read more on the Visual Studio Notification Hub Azure explorer functionality here - 
	
	- [VS Server Explorer Overview]
	- [VS Server Explorer Blog post - 1]
	- [VS Server Explorer Blog post - 2]

###Debug failed notifications/ Review notification outcome

**EnableTestSend property**

When you send a notification via Notification Hubs, initially it just gets queued up for NH to do processing to figure out all its targets and then eventually NH sends it to the PNS. This means that when you are using REST API or any of the client SDK, the successful return of your send call only means that the message has been successfully queued up with Notification Hub. It doesn’t give an insight into what happened when NH eventually got to send the message to PNS. If your notification is not arriving at the client device, there is a possibility that when NH tried to deliver the message to PNS, there was an error e.g. the payload size exceeded the maximum allowed by the PNS or the credentials configured in NH are invalid etc. 
To get an insight into the PNS errors, we have introduced a property called [EnableTestSend feature]. This property is automatically enabled when you send test messages from the portal or Visual Studio client and therefore allows you to see detailed debugging information. You can use this via APIs taking the example of the .NET SDK where it is available now and will be added to all client SDKs eventually. To use this with the REST call, simply append a querystring parameter called "test" at the end of your send call e.g. 

	https://mynamespace.servicebus.windows.net/mynotificationhub/messages?api-version=2013-10&test

*Example (.NET SDK)*
 
Suppose you are using .NET SDK to send a native toast notification:

    NotificationHubClient hub = NotificationHubClient.CreateClientFromConnectionString(connString, hubName);
    var result = await hub.SendWindowsNativeNotificationAsync(toast);
    Console.WriteLine(result.State);
 
`result.State` will simply state `Enqueued` at the end of the execution without any insight into what happened to your push. 
Now you can use the `EnableTestSend` boolean property while initializing the `NotificationHubClient` and can get detailed status about the PNS errors encountered while sending the notification. The send call here will take additional time to return because it is only returning after NH has delivered the notification to PNS to determine the outcome. 
 
	bool enableTestSend = true;
	NotificationHubClient hub = NotificationHubClient.CreateClientFromConnectionString(connString, hubName, enableTestSend);
	
	var outcome = await hub.SendWindowsNativeNotificationAsync(toast);
	Console.WriteLine(outcome.State);
	
	foreach (RegistrationResult result in outcome.Results)
	{
	    Console.WriteLine(result.ApplicationPlatform + "\n" + result.RegistrationId + "\n" + result.Outcome);
	}

*Sample Output*

    DetailedStateAvailable
    windows
    7619785862101227384-7840974832647865618-3
    The Token obtained from the Token Provider is wrong
 
This message indicates either invalid credentials are configured in the notification hub or an issue with the registrations on the hub and the recommended course would be to delete this registration and let the client recreate it before sending the message. 
 
> [AZURE.NOTE] Note that the use of this property is heavily throttled and so you must only use this in dev/test environment with limited set of registrations. We only send debug notifications to 10 devices. We also have a limit of processing debug sends to be 10 per minute. 

###Review telemetry 

1. **Use Azure Classic Portal**

	The portal enables you to get a quick overview of all the activity on your Notification Hub. 
	
	a) From the "dashboard" tab you can view an aggregated view of the registrations, notifications as well as errors per platform. 
	
	![][5]
	
	b) You can also add many other platform specific metrics from the "Monitor" tab to take a deeper look particularly at any PNS specific errors returned when NH tries to send the notification to the PNS. 
	
	![][6]
	
	c) You should start with reviewing the **Incoming Messages**, **Registration Operations**, **Successful Notifications** and then go to per platform tab to review the PNS specific errors. 
	
	d) If you have the notification hub misconfigured with the authentication settings then you will see PNS Authentication Error. This is a good indication to check the PNS credentials. 

2) **Programmatic access**

More details here - 

- [Programmatic Telemetry Access]
- [Telemetry Access via APIs sample] 

> [AZURE.NOTE] Several telemetry related features like **Export/Import Registrations**, **Telemetry Access via APIs** etc are only available in Standard tier. If you attempt to use these features if you are in Free or Basic tier then you will get exception message to this effect while using the SDK and an HTTP 403 (Forbidden) when using them directly from the REST APIs. Make sure that you have moved up to Standard tier via Azure Classic Portal.  

<!-- IMAGES -->
[0]: ./media/notification-hubs-diagnosing/Architecture.png
[1]: ./media/notification-hubs-diagnosing/GCMConfigure.png
[2]: ./media/notification-hubs-diagnosing/GCMEnable.png
[3]: ./media/notification-hubs-diagnosing/GCMServerKey.png
[4]: ./media/notification-hubs-diagnosing/PortalConfigure.png
[5]: ./media/notification-hubs-diagnosing/PortalDashboard.png
[6]: ./media/notification-hubs-diagnosing/PortalMonitoring.png
[7]: ./media/notification-hubs-diagnosing/PortalTestNotification.png
[8]: ./media/notification-hubs-diagnosing/VSRegistrations.png
[9]: ./media/notification-hubs-diagnosing/VSServerExplorer.png
[10]: ./media/notification-hubs-diagnosing/VSTestNotification.png
 
<!-- LINKS -->
[Notification Hubs Overview]: notification-hubs-overview.md
[Getting Started Tutorials]: notification-hubs-windows-store-dotnet-get-started.md
[Template guidance]: https://msdn.microsoft.com/library/dn530748.aspx 
[APNS guidance]: https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html#//apple_ref/doc/uid/TP40008194-CH100-SW4
[GCM guidance]: http://developer.android.com/google/gcm/adv.html
[Export/Import Registrations]: http://msdn.microsoft.com/library/dn790624.aspx
[ServiceBus Explorer]: http://msdn.microsoft.com/library/dn530751.aspx
[ServiceBus Explorer code]: https://code.msdn.microsoft.com/windowsazure/Service-Bus-Explorer-f2abca5a
[VS Server Explorer Overview]: http://msdn.microsoft.com/library/windows/apps/xaml/dn792122.aspx 
[VS Server Explorer Blog post - 1]: http://azure.microsoft.com/blog/2014/04/09/deep-dive-visual-studio-2013-update-2-rc-and-azure-sdk-2-3/#NotificationHubs 
[VS Server Explorer Blog post - 2]: http://azure.microsoft.com/blog/2014/08/04/announcing-release-of-visual-studio-2013-update-3-and-azure-sdk-2-4/ 
[EnableTestSend feature]: http://msdn.microsoft.com/library/microsoft.servicebus.notifications.notificationhubclient.enabletestsend.aspx
[Programmatic Telemetry Access]: http://msdn.microsoft.com/library/azure/dn458823.aspx
[Telemetry Access via APIs sample]: https://github.com/Azure/azure-notificationhubs-samples/tree/master/FetchNHTelemetryInExcel

 