---
title: What's new? Release notes - Azure Event Grid
description: Learn what is new with Azure Event Grid, such as the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.
ms.topic: overview
ms.date: 07/17/2020
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
- Add support to new GA service API version 2020-06-01.
- The new features that became generally available (GA):
    - Event delivery schema
    - Input mapping
    - Custom input schema 
    - Cloud event V10 schema
    - Service Bus topic as destination
    - Azure function as destination,
    - Webhook batching
    - Secure webhook (AAD support)
    - ImmutableId support
    - IpFiltering
    - Private Link.

## 5.3.2-preview (2020-05)
- This include additional bug fixes to enhance quality.
- As version 5.3.1-preview, this release corresponds to the 2020-04-01-Preview API version which includes the following new functionalities: 
    - Support for IP Filtering when publishing events to Domains and Topics
    - Partner Topics
    - Tracked Resource System Topics
    - Sku
    - Managed service identity 
    - Private Link Service support.

## 5.3.1-preview (2020-04)
- This include various bug fixes to enhance quality.
- As version 5.3.0-preview, this release corresponds to the 2020-04-01-Preview API version which includes the following new functionalities: 
	* Support for IP Filtering when publishing events to Domains and Topics,
	* Partner Topics,
	* Tracked Resource System Topics,
	* Sku,
	* MSI, and
	* Private Link support.

## 5.3.0-preview (2020-03)
- We introduce new features on top of features already added in verion 5.2.0-preview. 
- As version 5.2.0-preview, this release corresponds to the 2020-04-01-Preview API version.
- It adds supports to the following new functionalities: 
	* Support for IP Filtering when publishing events to Domains and Topics,
	* Partner Topics,
	* Tracked Resource System Topics,
	* Sku,
	* MSI, and
	* Private Link support.

## 5.2.0-preview (2020-01)
- This release corresponds to the 2020-04-01-Preview API version.
- It adds supports to the following new functionality:
	* Support for IP Filtering when publishing events to Domains and Topics,

## 5.0.0 (2019-05)
- This release corresponds to the 2019-06-01 API version.
- It adds support to the following new functionalities:
	* Domains,
	* Pagination and search filter for resources list operations,
	* Service Bus Queue as destination,
	* Advanced filtering, and
	* Disallows usage of ‘All’ with IncludedEventTypes."

## 4.1.0-preview (2019-03)
- This release corresponds to the 2019-02-01-preview API version.
- It adds support to the following new functionalities:
	* Pagination and search filter for resources list operations,
	* Manual create/delete of domain topics
	* Service Bus Queue as destination,
	* Disallows usage of ‘All’ with IncludedEventTypes,

## 4.0.0 (2018-12)
- This corresponds to the 2019-01-01 stable API version.
- It supports General Availability of the following functionalities related to event subscriptions:
	* DeadLetter destination,
	* Storage queue as destination,
	* HybridConnection as destination,
	* Manual handshake validation, and 
	* Ssupport for retry policies.
- Features that are still in preview (such as Event Grid domains or advanced filters support) can still be accessed using the 3.0.1-preview version of the SDK."

## 3.0.1-preview (2018-10)
- Taking dependency on 10.0.3 version of Newtonsoft nuget package.

## 3.0.0-preview (2018-10)
- This is a preview SDK for the new features introduced in 2018-09-15-preview API version. - This includes support for:
    - Domain and domain topics CRUD operation
    - Introducing expiration date for event subscription
    - Introducing advanced filtering for event subscription
    - The stable version of the SDK targeting the 2018-01-01 API version continues to exist as version 1.3.0


## Next steps
