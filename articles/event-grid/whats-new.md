---
title: What's new? Release notes - Azure Event Grid
description: Learn what is new with Azure Event Grid, such as the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.
ms.topic: overview
ms.date: 07/23/2020
---

# What's new in Azure Event Grid?

>Get notified about when to revisit this page for updates by copying and pasting this URL: `https://docs.microsoft.com/api/search/rss?search=%22Release+notes+-+Azure+Event+Grid%22&locale=en-us` into your ![RSS feed reader icon](./media/whats-new/feed-icon-16x16.png) feed reader.

Azure Event Grid receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes
- Deprecated functionality
- Plans for changes

## 6.0.0 (2020-06)
- Add support to new generally available (GA) service API version 2020-06-01.
- The new features that became GA:
    - [Input mappings](input-mappings.md)
    - [Custom input schema](input-mappings.md)
    - [Cloud event V10 schema](cloud-event-schema.md)
    - [Service Bus topic as destination](handler-service-bus.md)
    - [Azure function as destination](handler-functions.md)
    - [Webhook batching](./edge/delivery-output-batching.md)
    - [Secure webhook (Azure Active Directory support)](secure-webhook-delivery.md)
    - [Ip filtering](configure-firewall.md)
    - [Private Link Service support](configure-private-endpoints.md)
    - [Event delivery schema](event-schema.md)

## 5.3.2-preview (2020-05)
- This release includes additional bug fixes to enhance quality.
- As version 5.3.1-preview, this release corresponds to the 2020-04-01-Preview API version, which includes the following new functionalities: 
    - [Support for IP Filtering when publishing events to domains and topics](configure-firewall.md)
    - [Partner topics](./partner-events-overview.md)
    - [System topics as tracked resources in Azure portal](system-topics.md)
    - [Event delivery with managed service identity](managed-service-identity.md) 
    - [Private Link Service support](configure-private-endpoints.md)

## 5.3.1-preview (2020-04)
- This release includes various bug fixes to enhance quality.
- As version 5.3.0-preview, this release corresponds to the 2020-04-01-Preview API version, which includes the following new functionalities: 
    - [Support for IP Filtering when publishing events to domains and topics](configure-firewall.md)
    - [Partner topics](./partner-events-overview.md)
    - [System topics as tracked resources in Azure portal](system-topics.md)
    - [Event delivery with managed service identity](managed-service-identity.md) 
    - [Private Link Service support](configure-private-endpoints.md)

## 5.3.0-preview (2020-03)
- We introduce new features on top of features already added in version 5.2.0-preview. 
- As version 5.2.0-preview, this release corresponds to the 2020-04-01-Preview API version.
- It adds supports to the following new functionalities: 
    - [Support for IP Filtering when publishing events to domains and topics](configure-firewall.md)
    - [Partner topics](./partner-events-overview.md)
    - [System topics as tracked resources in Azure portal](system-topics.md)
    - [Event delivery with managed service identity](managed-service-identity.md) 
    - [Private Link Service support](configure-private-endpoints.md)

## 5.2.0-preview (2020-01)
- This release corresponds to the 2020-04-01-Preview API version.
- It adds supports to the following new functionality:
    - [Support for IP Filtering when publishing events to domains and topics](configure-firewall.md)

## 5.0.0 (2019-05)
- This release corresponds to the `2019-06-01` API version.
- It adds support to the following new functionalities:
	* [Domains](event-domains.md)
	* Pagination and search filter for resources list operations. For an example, see [Topics - List By Subscription](/rest/api/eventgrid/version2020-04-01-preview/topics/listbysubscription).
	* [Service Bus queue as destination](handler-service-bus.md)
	* [Advanced filtering](event-filtering.md#advanced-filtering)

## 4.1.0-preview (2019-03)
- This release corresponds to the 2019-02-01-preview API version.
- It adds support to the following new functionalities:
	* Pagination and search filter for resources list operations. For an example, see [Topics - List By Subscription](/rest/api/eventgrid/version2020-04-01-preview/topics/listbysubscription).
	* [Manual create/delete of domain topics](how-to-event-domains.md)
	* [Service Bus Queue as destination](handler-service-bus.md)

## 4.0.0 (2018-12)
- This release corresponds to the `2019-01-01` stable API version.
- It supports General Availability (GA) of the following functionalities related to event subscriptions:
	* [Dead Letter destination](manage-event-delivery.md)
	* [Azure Storage queue as destination](handler-storage-queues.md)
	* [Azure Relay - Hybrid Connection as destination](handler-relay-hybrid-connections.md)
	* [Manual handshake validation](webhook-event-delivery.md)
	* [Support for retry policies](delivery-and-retry.md)
- Features that are still in preview (such as [Event Grid domains](event-domains.md) or [advanced filters support](event-filtering.md#advanced-filtering) can still be accessed using the 3.0.1-preview version of the SDK."

## 3.0.1-preview (2018-10)
- Taking dependency on [10.0.3 version of Newtonsoft NuGet package](https://www.nuget.org/packages/Newtonsoft.Json/10.0.3).

## 3.0.0-preview (2018-10)
- This release is a preview SDK for the new features introduced in 2018-09-15-preview API version. - This release includes support for:
    - [Domain and domain topics](event-domains.md)
    - Introducing [expiration date for event subscription](concepts.md#event-subscription-expiration)
    - Introducing [advanced filtering](event-filtering.md#advanced-filtering) for event subscriptions
    - The stable version of the SDK targeting the `2018-01-01` API version continues to exist as version 1.3.0

## Next steps