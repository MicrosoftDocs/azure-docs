<properties 
	pageTitle="Azure Notification Hubs - Frequently Asked Questions (FAQs)" 
	description="FAQs on designing/implementing solutions on Notification Hubs" 
	services="notification-hubs" 
	documentationCenter="mobile" 
	authors="piyushjo" 
	manager="dwrede" 
	editor="" />

<tags 
	ms.service="notification-hubs" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-multiple" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="04/24/2015" 
	ms.author="piyushjo" />

#Azure Notification Hubs - Frequently Asked Questions (FAQs)

##General
###1.	What is the pricing for Notification Hubs?
Notification Hubs is offered in three tiers - *Free*, *Basic* & *Standard* tiers. More details here - [Notification Hubs Pricing]. The pricing is charged at the subscription level and is based on the number of pushes so it doesn't matter how many namespaces or notification hubs you have. 
Free tier is offered for development purpose with no SLA guarantee. Basic & Standard Tiers are offered for production usage with the following key features enabled only for Standard Tier:

- *Broadcast* - Basic tier limits the number of Notification Hub tags to 3K (applies to > 5 devices). If you have an audience size greater than 3K then you must move to Standard Tier. 
- *Rich telemetry* - Basic Tier does not allow exporting your telemetry or registrations data. If you need the capability to export your telemetry data for offline viewing and analysis then you must move to Standard Tier. 
- *Multi-tenancy* - If you are creating a mobile app using Notification Hubs to support multiple tenants then you must consider moving to Standard tier. This allows you to set Push Notification Services (PNS) credentials at the Notification Hub namespace level for the app and then you can segregate the tenants providing them individual hubs under this common namespace. This enables ease of maintenance while keeping the SAS keys to send & receive notifications from the notification hubs segregated for each tenant ensuring non cross-tenant overlap. 

###2.	What is the SLA?
For Basic and Standard Notification Hub tiers, we guarantee that at least 99.9% of the time, properly configured applications will be able to send notifications or perform registration management operations with respect to a Notification Hub deployed within a Basic or Standard Notification Hub Tier. To learn more about our SLA, please visit the SLA page here - [Notification Hubs SLA]. Note that there are no SLA guarantees for the leg between the Platform Notification Service and the device since Notification Hubs depend on external platform providers to deliver the notification to the device. 
 
###3.	Which customers are using Notification Hubs?
We have a number of customers using Notification Hubs with a few notable ones below:

* Sochi 2014 – 100s of interest groups, 3+ million devices, 150+million notification dispatched in 2 weeks. [CaseStudy - Sochi]
* Skanska - [CaseStudy - Skanska]
* Seattle Times - [CaseStudy - Seattle Times]
* Mural.ly - [CaseStudy - Mural.ly]
* 7Digital - [CaseStudy - 7Digital]
* Bing Apps – 10s of millions of devices, sending 3 million notifications/day
 
##Design & Development
###1.	Which service side platforms do you support?
We provide SDKs and samples for .NET, Java, PHP, Python, Node.js so that an app backend can be setup to communicate to Notification Hubs using any of these platforms. Notification Hubs APIs are based on REST interface so you can choose to directly talk to these. More details here - [NH - REST APIs]
 
###2.	Which device platforms do you support?
We support sending notifications to Apple iOS, Android, Windows Universal and Windows Phone, Kindle, Android China (via Baidu), Xamarin (iOS & Android), Chrome Apps platforms. Step by step getting started tutorials for these platforms are available here - [NH - Getting Started Tutorials]
 
###3.	Do you support SMS/Email/web notifications?
Notification Hubs is primarily designed to send notifications to mobile apps using the above listed platforms. We do not provide capability to send email or SMS however third party platforms which provide these capabilities can be integrated along with Notification Hubs to send native push notifications by using Azure Mobile Services. E.g. this tutorial talks about how to send SMS notifications using Azure Mobile services - [Send SMS with Mobile Services]
We also do not provide an in-browser push notification out of the box. Customers may choose to implement this using SignalR. We also provide a tutorial for sending push notification to Chrome apps which will work on Google Chrome browser. See this - [Chrome Apps tutorial]
 
###4.	What is the relation between Azure Mobile Services and Azure Notification Hubs and when do I use what? 
If you have an existing mobile app backend and you only want to add the capability to send push notifications then you must use Azure Notification Hubs. If you want to setup your mobile app backend from scratch then you should consider using Azure Mobile Services. An Azure mobile service automatically provisions a Notification Hub for you to be able to send push notifications easily from the mobile app backend. Pricing for Azure Mobile Services includes the base charges for a Notification Hub and you only pay when you go beyond the included pushes. More details here - [Mobile Services Pricing]
 
###5.	How many devices can you support?
In Basic & Standard Tier - we do not enforce any limits on the number of active devices which can receive notifications. For details see: [Notification Hubs Pricing]
 
###6.	How many push notifications can I send out? 
Customers are using the Azure Notification Hubs to send millions of push notifications per day. You do not have to do anything extra to scale Notifications Hubs. We automatically scale up based on the number of notifications flowing through the system. Note that the pricing does get impacted based on the push notifications being served. 
 
###7.	How long does it take for the notifications to reach my device?
Azure Notification Hubs is able to process atleast 1 million sends in 1 minute in a normal use scenario where the incoming load is pretty consistent and isn't spikey in nature. This rate may vary depending on the number of tags, nature of incoming sends etc. In this duration we are able to calculate the targets per platform and route messages to the respective push notification services based on the registered tags/tag expressions. From here on, it is the responsibility of the Push Notifications services (PNS) to send the notification to the device. PNSs do not guarantee any SLA for delivering notifications however typically a vast majority of messages are delivered to the devices within a few minutes (< 10 minute) from the time they are sent to our platform. There may be a few outliers which may take more time. Azure Notification Hubs also has a policy in place to drop any notifications which aren't able to be delivered to the PNS in 30 minutes. This delay can happen for a number of reasons, most commonly because the PNS is throttling your application. 
 
###8.	Is there any latency guarantee?
Because of the nature of push notifications that they are delivered by an external platform specific Push Notification Service, there is no latency guarantee. Typically, the majority of the notifications do get delivered within a few minutes. 
 
###9.	What are the considerations we need to take into account which designing a solution with namespaces and Notification Hubs? 
*Mobile App/Environment:*
There should be one Notification Hub per mobile app per environment. In a multi-tenant scenario - each tenant should have a separate hub. 
You must never share the same Notification Hub between test and production environments as this may cause problems down the line while sending notifications. e.g. Apple offers Sandbox and Production Push endpoints with each having separate credentials. If the hub was configured originally with Apple sandbox certificate and then reconfigured to use Apple production certificate, the old device tokens would become invalid with the new certificate and cause pushes to fail. It is best to separate your production and test environments and use different hubs for different environments. 

*PNS credentials:*
When a mobile app is registered with a platform's developer portal (e.g. Apple or Google etc) then you get an app identifier and security tokens which an app backend needs to provide to the Platform's Push Notification services to be able to send push notifications to the devices. These security tokens which can be in the form of certificates (e.g. for Apple iOS or Windows Phone) or security keys (Google Android, Windows) etc need to be configured in Notification Hubs. This is done typically at the notification hub level but can also be done at the namespace level in a multi-tenant scenario. 

*Namespaces:*
Namespaces can also be used for deployment grouping.  It can also be used to represent all Notification hubs for all tenants of the same app in the multi-tenant scenario. 

*Geo-distribution:* 
Geo-distribution is not always critical in case of push notifications. It is to be noted that the various Push Notification services (e.g. APNS, GCM etc) which ultimately deliver the push notifications to the devices aren't evenly distributed either. However if you have an application which is used across the world then you can create several hubs in different namespaces taking advantage of the availability of Notification Hubs service in different Azure regions around the world. Note that this will increase the management cost particularly around registrations so this isn't really recommended and must only be done if really required. 
 
###10.	Should we do registrations from the app backend or from the devices directly?
Registrations from the app backend are useful when you have to do a client authentication before creating the registration or when you have tags which must be created or modified by the app backend based on some app logic. More guidance is available here - [Backend Registration guidance] & [Backend Registration guidance - 2]
 
###11.	What is the security model?
Azure Notification Hubs use a Shared Access Signature (SAS) based security model. You can use the SAS tokens at the root namespace level or at the granular notification hubs level. These SAS tokens can be set with different authorization rules e.g. send message permissions, listen notification permissions etc. More details here - [NH Security model] 
 
###12.	How do you handle sensitive payload in the notifications? 
All notifications are delivered to the devices by the platforms Push Notification Services (PNS). When a sender sends a notification to Azure Notification Hubs then we process and pass the notification to the respective PNS. All connections from the sender to the Azure Notifications Hubs and then to the PNS use HTTPS. Azure Notifications Hubs does not log the payload of the message in any way. 
For sending sensitive payloads however we recommend a Secure Push pattern where the sender sends a 'ping' notification with a message identifier to the device without the sensitive payload and when the app on the device receives this payload then it calls a secure app backend API directly to fetch the message details. Tutorial to implement the pattern is here - [NH - Secure Push tutorial]
 
##Operations
###1.	What is the Disaster Recovery (DR) story?
We provide a metadata Disaster Recovery at our end (Notification Hub name, connection string etc). In the event of a DR, the registrations data is the one which will be lost so you will have to come up with a solution to re-populate this into your new hub. 

- *Step1* - Create a secondary Notification Hub in a different DC. You can create this on the fly at the time of DR event or you can create one from the get go. It doesn't matter much because NH provisioning is a fast process in the order of a few seconds. Having one from the beginning will also shield you from the DR event impacting our management capabilities so it is recommended. 

- *Step2* - Hydrate the secondary Notification Hub with the registrations from the primary Notification Hub. It is not recommended to try to maintain registrations on both the hubs and try to keep them in sync on the fly as registrations are coming in, as that hasn’t worked well because of the inherent nature of registrations to expire by the PNS. Notification Hubs clean them up as we receive PNS feedback about expired or invalid registrations.  

Recommendation is to use an app backend which either:

- Maintains that set of registrations at its end so that it can do a bulk insert into the secondary notification hub in case of DR, OR

- Gets a regular dump of registrations from the primary hub as a backup and then does a bulk insert into the secondary NH. 

(Registrations Export/Import functionality available in Standard Tier is described here: [Registrations Export/Import]) 
 
If you don’t have a backend then when the app starts up on the devices then they will do a new registration in the secondary NH and eventually the secondary NH will have all the active devices registered but the downside is that there will be a time period when devices where apps haven't opened up will not receive notifications. 
 
###2.	Is there any audit log capability?
All Notification Hubs Management operations go to Operation Logs which are exposed in the Azure Management Portal. 
 
##Monitoring & Troubleshooting
###1.	What troubleshooting capabilities are available?
Azure Notification Hubs provide several features to do common troubleshooting particularly in the most common scenario around dropped notifications. See details in this troubleshooting whitepaper - [NH - troubleshooting]
 
###2.	What telemetry features are available?
Azure Notification Hubs enable viewing telemetry data in the Azure management portal. Details of the available metrics are available here - [NH - Metrics].
Note that successful notifications only mean that the notifications have been delivered to the external Push Notification Service (e.g. APNS for Apple, GCM for Google etc) and then it is upto the PNS to deliver the notification to the devices and the PNS do not expose these metrics to us.  
It also provides the capability to export the telemetry programmatically (in Standard Tier). See this sample for details - [NH - Metrics sample]

[Notification Hubs Pricing]: http://azure.microsoft.com/pricing/details/notification-hubs/
[Notification Hubs SLA]: http://azure.microsoft.com/support/legal/sla/
[CaseStudy - Sochi]: https://customers.microsoft.com/Pages/CustomerStory.aspx?recid=7942
[CaseStudy - Skanska]: https://customers.microsoft.com/Pages/CustomerStory.aspx?recid=5847
[CaseStudy - Seattle Times]: https://customers.microsoft.com/Pages/CustomerStory.aspx?recid=8354
[CaseStudy - Mural.ly]: https://customers.microsoft.com/Pages/CustomerStory.aspx?recid=11592
[CaseStudy - 7Digital]: https://customers.microsoft.com/Pages/CustomerStory.aspx?recid=3684
[NH - REST APIs]: https://msdn.microsoft.com/library/azure/dn530746.aspx
[NH - Getting Started Tutorials]: http://azure.microsoft.com/documentation/articles/notification-hubs-ios-get-started/
[Send SMS with Mobile Services]: http://azure.microsoft.com/documentation/articles/partner-twilio-mobile-services-how-to-use-voice-sms/
[Chrome Apps tutorial]: http://azure.microsoft.com/documentation/articles/notification-hubs-chrome-get-started/
[Mobile Services Pricing]: http://azure.microsoft.com/pricing/details/mobile-services/
[Backend Registration guidance]: https://msdn.microsoft.com/library/azure/dn743807.aspx 
[Backend Registration guidance - 2]: https://msdn.microsoft.com/library/azure/dn530747.aspx
[NH Security model]: https://msdn.microsoft.com/library/azure/dn495373.aspx
[NH - Secure Push tutorial]: http://azure.microsoft.com/documentation/articles/notification-hubs-aspnet-backend-ios-secure-push/
[NH - troubleshooting]: http://azure.microsoft.com/documentation/articles/notification-hubs-diagnosing/
[NH - Metrics]: https://msdn.microsoft.com/library/dn458822.aspx
[NH - Metrics sample]: https://github.com/Azure/azure-notificationhubs-samples/tree/master/FetchNHTelemetryInExcel
[Registrations Export/Import]: https://msdn.microsoft.com/library/dn790624.aspx
 


