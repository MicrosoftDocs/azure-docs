<properties
    pageTitle="Azure Notification Hubs - Feature Guide"
    description="Description of a complete list of Notification Hubs features"
    services="notification-hubs"
    documentationCenter="mobile"
    authors="ysxu"
    manager="yochayk"
    keywords="push notification, push notifications, azure, notification hubs"
    editor="" />

<tags
    ms.service="notification-hubs"
    ms.workload="mobile"
    ms.tgt_pltfrm="mobile-multiple"
    ms.devlang="multiple"
    ms.topic="article"
    ms.date="09/02/2016"
    ms.author="yuaxu" />

#Push Notifications with Azure Notification Hubs - Feature Set

##Features
###Basic Push & Broadcast
We help users push fast notifications to a scalable audience.

###Audience Segmentation
Our [Tags] feature lets users dynamically segment their audiences. Customers use tags to:
* Segment devices into groups for targeted push (each device can have up to 60 tags)
* Simplify the push to device or push to user scenario
* Enable secure groups/secure push notifications

Tags can be used in expressions (for example, &&, ||, !) and gives users the flexibility to manipulate relating segments.

###Notification Customization
Our [Push Variables] feature provides users the convenience of associating up to 60 string key-value pairs with each device. On send, users are able to use registered keys as placeholders that Notification Hubs substitutes in the corresponding value for each send at runtime. Users can do something like "$(firstName:{Greetings}), good morning!" - if the device has a firstName key, its value is switched in; otherwise "Greetings, good morning!" is sent.

###One Push For All Cross-Platform Devices
Our [Templates] feature lets users pre-register payload templates for devices, meaning users can send plain and omni messages to all platforms, with one push request.

###Localized Push
Templates can also enable localized notification scenarios. See our [Send localized notifications tutorial].

###Silent Push
Users can use our service to send silent notifications to devices and trigger them to complete certain pulls or actions. This is the push-to-pull pattern described in our [Secure Push tutorial].

###Scheduled Push
Users can [schedule notifications] with us. 

###Direct Batch Push With Device Tokens
With [Direct Send], users are able to send a notification directly to a Platform Notification System handle. This feature is great for customers who choose to manage their own devices or use Notification Hubs to deliver to unregistered devices.
There is also a [batch version] that lets users push to up to 1000 device tokens per request.

###Push Telemetry: Notification Hubs Processing & Platform Notification Systems Feedback
Our [Per Message Telemetry] feature shows users the status and telemetry of a notification request starting from when their request is sent until when Platform Notification Systems respond. We give users all errors, outcomes, and metrics along the way as we process their request, and our [Platform Notification System Feedback] feature helps capture any errors returned from PNSes.

###Azure Portal & Debug Send
We provide UI for many management operations (for example, configuring various push platforms, debug send, etc.) in the [Azure portal].
Debug Send is available for each hub, and can send out broadcast, segmented, and templated test notifications to help with their development.

###Push Resource Organization
Notification Hubs resources are broken down into namespaces and notification hubs. A namespace is a collection of notification hubs in the same region, usually mapping to one app. The various hubs within one namespace can be used as production hub, testing hub, and etc. To facilitate this organization, we have [multi-tenant APIs] designed to help large apps that span across multiple hubs.

###Query My App Users
We provide [queries] for users to obtain all devices given a segment/tag, ID, or a hub.

###Bulk Import/Export
Users are able to [bulk import/export] device registrations.

###SLA
We follow Azure's promise on [SLA].

###Platform Notification System Support
* Apple Platform Notification Services (that is, iOS, Safari, and Xamarin iOS)
* Google Cloud Messaging/Firebase Cloud Messaging (that is, Android, Xamarin Android, and Chrome Apps)
* Windows Notification Services (that is, Windows Universal)
* Microsoft Push Notification Service (that is, Windows Phone 8 or Windows Phone 8.1 Silverlight)
* Baidu Cloud Push (that is, Android in China)
* Amazon Device Messaging (that is, Kindle)

###Client SDK Support
* Obj-C (can be bridged to work with Swift easily)
* Java
* Managed
* Xamarin.iOS
* Xamarin.Android

###Server SDK Support
* Java
* .NET
* Node.js
* Python

##Tiers
The tier-based feature support is detailed as follows:

| Feature                                               | Free | Basic | Standard |
|-------------------------------------------------------|:----:|:-----:|:--------:|
| Basic Push & Broadcast                                |   x  |   x   |     x    |
| Audience Segmentation (Tags)                          |   x  |   x   |     x    |
| Notification Customization (Push Variables)           |   x  |   x   |     x    |
| One Push For All Cross-Platform Devices (Templates)   |   x  |   x   |     x    |
| Localized Push (Templates)                            |   x  |   x   |     x    |
| Silent Push                                           |   x  |   x   |     x    |
| Scheduled Push                                        |      |       |     x    |
| Direct Batch Push                                     |      |   x   |     x    |
| Push Telemetry (Per Message Telemetry & PNS Feedback) |      |       |     x    |
| Azure portal & Debug Send                             |   x  |   x   |     x    |
| Push Resource Organization                            |      |       |     x    |
| Query My App Users                                    |   x  |   x   |     x    |
| Bulk Import/Export                                    |      |       |     x    |
| SLA                                                   |      |   x   |     x    |
| Platform Notification System Support                  |   x  |   x   |     x    |
| Client SDK Support                                    |   x  |   x   |     x    |
| Server SDK Support                                    |   x  |   x   |     x    |

For more information on tiers and limitation details, visit our [pricing page].

[Installation model]: https://azure.microsoft.com/en-us/blog/updates-from-notification-hubs-independent-nuget-installation-model-pmt-and-more/
[two push models]: https://azure.microsoft.com/en-us/documentation/articles/notification-hubs-push-notification-registration-management/
[Tags]: https://azure.microsoft.com/en-us/documentation/articles/notification-hubs-tags-segment-push-message/
[Templates]: https://azure.microsoft.com/en-us/documentation/articles/notification-hubs-templates-cross-platform-push-messages/
[Push Variables]: https://azure.microsoft.com/en-us/blog/updates-from-notification-hubs-independent-nuget-installation-model-pmt-and-more/
[Send localized notifications tutorial]: https://azure.microsoft.com/en-us/documentation/articles/notification-hubs-windows-store-dotnet-xplat-localized-wns-push-notification/
[Secure Push tutorial]: https://azure.microsoft.com/en-us/documentation/articles/notification-hubs-aspnet-backend-windows-dotnet-wns-secure-push-notification/
[schedule notifications]: https://azure.microsoft.com/en-us/documentation/articles/notification-hubs-send-push-notifications-scheduled/
[Direct Send]: https://msdn.microsoft.com/en-us/library/azure/mt608572.aspx
[batch version]: https://msdn.microsoft.com/en-us/library/azure/mt734910.aspx
[Per Message Telemetry]: https://msdn.microsoft.com/en-us/library/azure/mt608135.aspx
[Platform Notification System Feedback]: https://azure.microsoft.com/en-us/blog/retrieve-platform-notification-system-error-details-with-azure-notification-hubs/
[multi-tenant APIs]: https://msdn.microsoft.com/en-us/library/azure/mt238294.aspx
[SLA]: https://azure.microsoft.com/en-us/support/legal/sla/notification-hubs/v1_0/
[pricing page]: https://azure.microsoft.com/en-us/pricing/details/notification-hubs/
[queries]: https://msdn.microsoft.com/en-us/library/azure/dn223274.aspx
[bulk import/export]: https://msdn.microsoft.com/library/dn790624.aspx
[Azure portal]: https://portal.azure.com