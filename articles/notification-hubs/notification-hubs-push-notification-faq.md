---
title: 'Azure Notification Hubs: Frequently Asked Questions (FAQs) | Microsoft Docs'
description: FAQs on designing/implementing solutions on Notification Hubs
services: notification-hubs
documentationcenter: mobile
author: ysxu
manager: erikre
keywords: push notification, push notifications, iOS push notifications, android push notifications, ios push, android push
editor: ''

ms.assetid: 7b385713-ef3b-4f01-8b1f-ffe3690bbd40
ms.service: notification-hubs
ms.workload: mobile
ms.tgt_pltfrm: mobile-multiple
ms.devlang: multiple
ms.topic: article
ms.date: 01/19/2017
ms.author: yuaxu

---
# Push notifications with Azure Notification Hubs: Frequently asked questions
## General
### What is the resource structure of Notification Hubs?

Azure Notification Hubs has two resource levels: hubs and namespaces. A hub is a single push resource that can hold the cross-platform push information of one app. A namespace is a collection of hubs in one region.

Recommended mapping matches one namespace with one app. Within a namespace, you can have a production hub that works with your production app, a testing hub that works with your testing app, and so on.

### What is the price model for Notification Hubs?
The latest pricing details can be found on the [Notification Hubs Pricing] page. Notification Hubs is billed at the namespace level. (For the definition of a namespace, see "What is the resource structure of Notification Hubs?") Notification Hubs offers three tiers:

* **Free**: This tier is a good starting point for exploring push capabilities. It's not recommended for production apps. You get 500 devices and 1 million pushes included per namespace per month, with no service level agreement (SLA) guarantee.
* **Basic**: This tier (or the Standard tier) is recommended for smaller production apps. You get 200,000 devices and 10 million pushes included per namespace per month as a baseline. Quota growth options are included.
* **Standard**: This tier is recommended for medium to large production apps. You get 10 million devices and 10 million pushes included per namespace per month as a baseline. Quota increase options and rich telemetry capabilities are included.

Standard tier features:
* **Rich telemetry**: You can use Notification Hubs Per Message Telemetry to track any push requests and Platform Notification System Feedback for debugging.
* **Multitenancy**: You can work with Platform Notification System credentials on a namespace level. This option allows you to easily split tenants into hubs within the same namespace.
* **Scheduled push**: You can schedule notifications to be sent out anytime.

### What is the Notification Hubs SLA?
For Basic and Standard Notification Hubs tiers, properly configured applications can send push notifications or perform registration management operations at least 99.9 percent of the time. To learn more about the SLA, go to the [Notification Hubs SLA](https://azure.microsoft.com/support/legal/sla/notification-hubs/) page.

> [!NOTE]
> Because push notifications depend on third-party Platform Notification Systems (such as Apple APNS and Google FCM), there is no SLA guarantee for the delivery of these messages. After Notification Hubs sends the batches to Platform Notification Systems (SLA guaranteed), it is the responsibility of the Platform Notification Systems to deliver the pushes (no SLA guaranteed).

### Which customers are using Notification Hubs?
Many customers use Notification Hubs. Some notable ones are listed here:

* Sochi 2014: Hundreds of interest groups, 3+ million devices, and 150+ million notifications dispatched in two weeks. [Case study: Sochi]
* Skanska: [Case study: Skanska]
* Seattle Times: [Case study: Seattle Times]
* Mural.ly: [Case study: Mural.ly]
* 7Digital: [Case study: 7Digital]
* Bing Apps: Tens of millions of devices send 3 million notifications per day.

### How do I upgrade or downgrade my hub or namespace to a different tier?
Go to the **[Azure portal]** > **Notification Hubs Namespaces** or **Notification Hubs**. Select the resource you want to update, and go to **Pricing Tier**. Note the following requirements:

* The updated pricing tier applies to *all* hubs in the namespace you're working with.
* If your device count exceeds the limit of the tier you're downgrading to, you need to delete devices before you downgrade.


## Design and development
### Which server-side platforms do you support?
Server SDKs are available for .NET, Java, Node.js, PHP, and Python. Notification Hubs APIs are based on REST interfaces, so you can work directly with REST APIs if you're using different platforms or do not want extra dependency. For more information, go to the [Notification Hubs REST APIs] page.

### Which client platforms do you support?
Push notifications are supported for [iOS](notification-hubs-ios-apple-push-notification-apns-get-started.md), [Android](notification-hubs-android-push-notification-google-gcm-get-started.md), [Windows Universal](notification-hubs-windows-store-dotnet-get-started-wns-push-notification.md), [Windows Phone](notification-hubs-windows-mobile-push-notifications-mpns.md), [Kindle](notification-hubs-kindle-amazon-adm-push-notification.md), [Android China (via Baidu)](notification-hubs-baidu-china-android-notifications-get-started.md), Xamarin ([iOS](xamarin-notification-hubs-ios-push-notification-apns-get-started.md) and [Android](xamarin-notification-hubs-push-notifications-android-gcm.md)), [Chrome Apps](notification-hubs-chrome-push-notifications-get-started.md), and [Safari](https://github.com/Azure/azure-notificationhubs-samples/tree/master/PushToSafari). For more information, go to the [Notification Hubs Getting Started tutorials] page.

### Do you support text message, email, or web notifications?
Notification Hubs is primarily designed to send notifications to mobile apps. It does not provide email or text message capabilities. However, third-party platforms that provide these capabilities can be integrated with Notification Hubs to send native push notifications by using [Mobile Apps].

Notification Hubs also does not provide an in-browser push notification delivery service out of the box. Customers can implement this feature using SignalR on top of the supported server-side platforms. If you want to send notifications to browser apps in the Chrome sandbox, see the [Chrome Apps tutorial].

### How are Mobile Apps and Azure Notification Hubs related and when do I use them?
If you have an existing mobile app back end and you want to add only the capability to send push notifications, you can use Azure Notification Hubs. If you want to set up your mobile app back end from scratch, consider using the Mobile Apps feature of Azure App Service. A mobile app automatically provisions a notification hub so that you can easily send push notifications from the mobile app back end. Pricing for Mobile Apps includes the base charges for a notification hub. You pay only when you exceed the included pushes. For more details on costs, go to the [App Service Pricing] page.

### How many devices can I support if I send push notifications via Notification Hubs?
Refer to the [Notification Hubs Pricing] page for details on the number of supported devices.

If you need support for more than 10 million registered devices, [contact us](https://azure.microsoft.com/overview/contact-us/) directly and we will help you scale your solution.

### How many push notifications can I send out?
Depending on the selected tier, Azure Notification Hubs automatically scales up based on the number of notifications flowing through the system.

> [!NOTE]
> The overall usage cost can increase based on the number of push notifications being served. Make sure that you're aware of the tier limits outlined on the [Notification Hubs Pricing] page.
> 
> 

Our customers use Notification Hubs to send millions of push notifications daily. You do not have to do anything special to scale the reach of your push notifications as long as you're using Azure Notification Hubs.

### How long does it take for sent push notifications to reach my device?
In a normal-use scenario, where the incoming load is consistent and even, Azure Notification Hubs can process at least *1 million push notification sends a minute*. This rate might vary depending on the number of tags, the nature of the incoming sends, and other external factors.

During the estimated delivery time, the service calculates the targets per platform and routes messages to the Push Notification Service (PNS) based on the registered tags or tag expressions. It is the responsibility of the PNS to send notifications to the device.

The PNS does not guarantee any SLA for delivering notifications. However, most push notifications are delivered to target devices within a few minutes (typically within 10 minutes) from the time they are sent to Notification Hubs. A few notifications might take more time.

> [!NOTE]
> Azure Notification Hubs has a policy in place to drop any push notifications that aren't delivered to the PNS within 30 minutes. This delay can happen for a number of reasons, but most commonly because the PNS is throttling your application.
> 
> 

### Is there any latency guarantee?
Because of the nature of push notifications (they are delivered by an external, platform-specific PNS), there is no latency guarantee. Typically, the majority of push notifications are delivered within a few minutes.

### What do I need to consider when designing a solution with namespaces and notification hubs?
#### Mobile app/environment
* Use one notification hub per mobile app, per environment.
* In a multitenant scenario, each tenant should have a separate hub.
* Never share the same notification hub for production and test environments. This practice might cause problems when sending notifications. (Apple offers Sandbox and Production Push endpoints, each with separate credentials.)
* By default, you can send test notifications to your registered devices through the Azure portal or the Azure integrated component in Visual Studio. The threshold is set to 10 devices that are selected at random from the registration pool.

> [!NOTE]
> If your hub was originally configured with an Apple sandbox certificate and then was reconfigured to use an Apple production certificate, the original device tokens are invalid. Invalid tokens cause pushes to fail. Separate your production and test environments, and use different hubs for different environments.
> 
> 

#### PNS credentials
When a mobile app is registered with a platform's developer portal (for example, Apple or Google), an app identifier and security tokens are sent. The app back end provides these tokens to the platform's PNS so that push notifications can be sent to devices. Security tokens can be in the form of certificates (for example, Apple iOS or Windows Phone) or security keys (for example, Google Android or Windows). They must be configured in notification hubs. Configuration is typically done at the notification-hub level, but it can also be done at the namespace level in a multitenant scenario.

#### Namespaces
Namespaces can be used for deployment grouping. They can also be used to represent all notification hubs for all tenants of the same app in a multitenant scenario.

#### Geo-distribution
Geo-distribution is not always critical in push notification scenarios. Various PNSes (for example, APNS or GCM) that deliver push notifications to devices aren't evenly distributed.

If you have an application that is used globally, you can create hubs in different namespaces by using the Notification Hubs service in different Azure regions around the world.

> [!NOTE]
> We don't recommend this arrangement because it increases your management cost, particularly for registrations. It should be done only if there is an explicit need.
> 
> 

### Should I do registrations from the app back end or directly through client devices?
Registrations from the app back end are useful when you have to authenticate clients before creating the registration. They're also useful when you have tags that must be created or modified by the app back end based on app logic. For more information, go to the [Backend Registration guidance] and [Backend Registration guidance 2] pages.

### What is the push notification delivery security model?
Azure Notification Hubs uses a [shared access signature](../storage/storage-dotnet-shared-access-signature-part-1.md)-based security model. You can use the shared access signature tokens at the root namespace level or at the granular notification hub level. Shared access signature tokens can be set to follow different authorization rules, for example, to send message permissions or to listen for notification permissions. For more information, see the [Notification Hubs security model] document.

### How should I handle sensitive payload in push notifications?
All notifications are delivered to target devices by the platform's PNS. When a notification is sent to Azure Notification Hubs, it is processed and passed to the respective PNS.

All connections, from the sender to the Azure Notification Hubs to the PNS, use HTTPS.

> [!NOTE]
> Azure Notification Hubs does not log the payload of messages in any way.
> 
> 

To send sensitive payloads, we recommend using a Secure Push pattern. The sender delivers a ping notification with a message identifier to the device without the sensitive payload. When the app on the device receives the payload, the app calls a secure API directly to fetch the message details. For a guide on how to implement this pattern, go to the [Notification Hubs Secure Push tutorial] page.

## Operations
### What support is provided for disaster recovery?
We provide metadata disaster recovery coverage on our end (the Notification Hubs name, the connection string, and other critical information). When a disaster recovery scenario is triggered, registration data is the *only segment* of the Notification Hubs infrastructure that is lost. You will need to implement a solution to repopulate this data into your new hub post-recovery:

1. Create a secondary notifications hub in a different datacenter. We recommend creating one from the beginning to shield you from a disaster recovery event that might affect your management capabilities. You can also create one at the time of the disaster recovery event.

2. Populate the secondary notification hub with the registrations from your primary notification hub. We don't recommend trying to maintain registrations on both hubs and keep them in sync as registrations come in. This practice doesn’t work well because of the inherent tendency of registrations to expire on the PNS side. Notification Hubs cleans them up as it receives PNS feedback about expired or invalid registrations.  

We have two recommendations for app back ends:

* Use an app back end that maintains a given set of registrations at its end. It can then perform a bulk insert into the secondary notification hub.

* Use an app back end that gets a regular dump of registrations from the primary notification hub as a backup. It can then perform a bulk insert into the secondary notification hub.

> [!NOTE]
> Registrations Export/Import functionality available in the Standard tier is described in the [Registrations Export/Import] document.
> 
> 

If you don’t have a back end, when the app starts on target devices, they perform a new registration in the secondary notification hub. Eventually the secondary notification hub will have all the active devices registered.

There will be a time period when devices with unopened apps won't receive notifications.

### Is there audit log capability?
All Notification Hubs management operations go to operation logs, which are exposed in the [Azure classic portal].

## Monitoring and troubleshooting
### What troubleshooting capabilities are available?
Azure Notification Hubs provides several features for troubleshooting, particularly for the most common scenario of dropped notifications. For details, see the [Notification Hubs troubleshooting] white paper.

### What telemetry features are available?
Azure Notification Hubs enables viewing telemetry data in the [Azure classic portal]. Details of the metrics are available on the [Notification Hubs Metrics] page.

> [!NOTE]
> Successful notifications mean simply that push notifications have been delivered to the external PNS (for example, APNS for Apple or GCM for Google). It is the responsibility of the PNS to deliver the notifications to target devices. Typically, the PNS does not expose delivery metrics to third parties.  
> 
> 

We also provide the capability to export the telemetry data programmatically (in the Standard tier). For details, see the [Notification Hubs Metrics sample].

[Azure classic portal]: https://manage.windowsazure.com
[Notification Hubs Pricing]: http://azure.microsoft.com/pricing/details/notification-hubs/
[Notification Hubs SLA]: http://azure.microsoft.com/support/legal/sla/
[Case Study: Sochi]: https://customers.microsoft.com/Pages/CustomerStory.aspx?recid=7942
[Case Study: Skanska]: https://customers.microsoft.com/Pages/CustomerStory.aspx?recid=5847
[Case Study: Seattle Times]: https://customers.microsoft.com/Pages/CustomerStory.aspx?recid=8354
[Case Study: Mural.ly]: https://customers.microsoft.com/Pages/CustomerStory.aspx?recid=11592
[Case Study: 7Digital]: https://customers.microsoft.com/Pages/CustomerStory.aspx?recid=3684
[Notification Hubs REST APIs]: https://msdn.microsoft.com/library/azure/dn530746.aspx
[Notification Hubs Getting Started tutorials]: http://azure.microsoft.com/documentation/articles/notification-hubs-ios-get-started/
[Chrome Apps tutorial]: http://azure.microsoft.com/documentation/articles/notification-hubs-chrome-get-started/
[Mobile Services Pricing]: http://azure.microsoft.com/pricing/details/mobile-services/
[Backend Registration guidance]: https://msdn.microsoft.com/library/azure/dn743807.aspx
[Backend Registration guidance 2]: https://msdn.microsoft.com/library/azure/dn530747.aspx
[Notification Hubs security model]: https://msdn.microsoft.com/library/azure/dn495373.aspx
[Notification Hubs Secure Push tutorial]: http://azure.microsoft.com/documentation/articles/notification-hubs-aspnet-backend-ios-secure-push/
[Notification Hubs troubleshooting]: http://azure.microsoft.com/documentation/articles/notification-hubs-diagnosing/
[Notification Hubs Metrics]: https://msdn.microsoft.com/library/dn458822.aspx
[Notification Hubs Metrics sample]: https://github.com/Azure/azure-notificationhubs-samples/tree/master/FetchNHTelemetryInExcel
[Registrations Export/Import]: https://msdn.microsoft.com/library/dn790624.aspx
[Azure portal]: https://portal.azure.com
[complete samples]: https://github.com/Azure/azure-notificationhubs-samples
[Mobile Apps]: https://azure.microsoft.com/services/app-service/mobile/
[App Service Pricing]: https://azure.microsoft.com/pricing/details/app-service/
