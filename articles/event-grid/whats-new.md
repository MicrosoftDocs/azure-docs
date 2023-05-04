---
title: What's new? Azure Event Grid
description: Learn what is new with Azure Event Grid, such as the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.
ms.topic: overview
ms.date: 05/23/2023
---

# What's new in Azure Event Grid?

>Get notified about when to revisit this page for updates by copying and pasting this URL: `https://learn.microsoft.com/api/search/rss?search=%22Release+notes+-+Azure+Event+Grid%22&locale=en-us` into your ![RSS feed reader icon](./media/whats-new/feed-icon-16x16.png) feed reader.

Azure Event Grid receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about the features that are added or updated in a release. 

## REST API version 2023-06-01-preview

- [What's Azure Event Grid](overview.md), [Concepts](concepts.md) articles are updated to include information about the new pull-based event delivery and MQTT messaging.
- Pull (new) and push delivery of events
    - [Introduction to pull and push delivery of events](pull-and-push-delivery-overview.md)
    - [Publish and subscribe using namespace topics](publish-events-using-namespace-topics.md)
    - [Create, view, and manage namespaces](create-view-manage-namespaces.md)
    - [Create, view, and manage namespace topics](create-view-manage-namespace-topics.md)
    - [Create, view, and manage event subscriptions](create-view-manage-event-subscriptions.md)
- The following articles for **MQTT messaging** are added.
    - [Introduction to MQTT messaging in Azure Event Grid](mqtt-overview.md)
    - Publish and subscribe to MQTT messages on Event Grid namespace - [Azure portal](mqtt-publish-and-subscribe-portal.md), [CLI](mqtt-publish-and-subscribe-cli.md)
    - Tutorial: Route MQTT messages to Azure Event Hubs from Azure Event Grid - [Azure portal](mqtt-routing-to-event-hubs-portal.md), [CLI](mqtt-routing-to-event-hubs-cli.md)
    - [Event Grid namespace terminology](mqtt-event-grid-namespace-terminology.md)
    - [Client authentication](mqtt-client-authentication.md)
    - [Access control for MQTT clients](mqtt-access-control.md)
    - [MQTT clients and client groups](mqtt-clients-and-client-groups.md)
    - [Topic spaces](mqtt-topic-spaces.md)
    - Routing MQTT messages
        - [Routing MQTT messages](mqtt-routing.md)
        - [Event schema for MQTT routed messages](mqtt-routing-event-schema.md)
        - [Filtering of MQTT Routed Messages](mqtt-routing-filtering.md)
        - [Routing enrichments](mqtt-routing-enrichment.md)
    - [MQTT Support in Azure Event Grid](mqtt-support.md)
    - [MQTT clients - life cycle events](mqtt-client-life-cycle-events.md)
    - [Client authentication using CA certificate chain](mqtt-certificate-chain-client-authentication.md)
    - [Customer enabled disaster recovery in Azure Event Grid](custom-disaster-recovery-client-side.md)
    - [How to establish multiple sessions for a single client](mqtt-establishing-multiple-sessions-per-client.md)
    - [Monitoring data reference for MQTT delivery](monitor-mqtt-delivery-reference.md)
- [Scaling with Azure Event Grid](scaling-with-azure-event-grid.md)


## Microsoft.Azure.Management.EventGrid version 9.0.0 (REST API version 2022-06)
This release corresponds to REST API version 2022-06-15, which includes the following features:

- [Partner Events - General Availability (GA)](partner-events-overview-for-partners.md)
- [Data residency for topics and domains](faq.yml#where-does-azure-event-grid-store-data-).

## Microsoft.Azure.Management.EventGrid version 7.0.0 (REST API version 2021-12)
This release corresponds to REST API version 2021-12-01, which includes the following features:

- [Enable managed identities for system topics](enable-identity-system-topics.md)
- [Enabled managed identities for custom topics and domains](enable-identity-custom-topics-domains.md)
- [Use managed identities to deliver events to destinations](add-identity-roles.md)
- [Support for delivery attributes](delivery-properties.md)
- [Storage queue - message time-to-live (TTL)](delivery-properties.md#configure-time-to-live-on-outgoing-events-to-azure-storage-queues)- 
- [Azure Active Directory authentication for topics and domains, and partner namespaces](authenticate-with-active-directory.md)

## REST API version 2021-10
This release corresponds to REST API version 2021-10-15-preview, which includes the following features:

- Updates to the Partner Events feature. See the following articles:
    - [Partner Events overview for customers](partner-events-overview.md)
    - [Partner Events overview for partners](partner-events-overview-for-partners.md)
    - [Onboard as an Event Grid partner](onboard-partner.md)
    - [Subscribe to partner events](subscribe-to-partner-events.md)
- New REST API
    - [Channels](/rest/api/eventgrid/controlplane-version2021-10-15-preview/channels)
    - [Partner Configurations](/rest/api/eventgrid/controlplane-version2021-10-15-preview/partner-configurations)
    - [Verified Partners](/rest/api/eventgrid/controlplane-version2021-10-15-preview/verified-partners)



## .NET 6.2.0-preview (REST API version 2021-06)
This release corresponds to REST API version 2021-06-01-preview, which includes the following new features:

- [Azure Active Directory authentication for topics and domains, and partner namespaces](authenticate-with-active-directory.md)
- [Private link support for partner namespaces](/rest/api/eventgrid/controlplane-version2021-10-15-preview/partner-namespaces/create-or-update#privateendpoint). Azure portal doesn't support it yet. 
- [IP Filtering for partner namespaces](/rest/api/eventgrid/controlplane-version2021-10-15-preview/partner-namespaces/create-or-update#inboundiprule). Azure portal doesn't support it yet. 
- [System Identity for partner topics](/rest/api/eventgrid/controlplane-version2021-10-15-preview/partner-namespaces/update#request-body). Azure portal doesn't support it yet.
- [User Identity for system topics, custom topics and domains](enable-identity-custom-topics-domains.md)

## 6.1.0-preview (2020-10)

- [Managed identities for system topics](enable-identity-system-topics.md)
- [Custom delivery properties](delivery-properties.md)
- [Storage queue - message time-to-live (TTL)](delivery-properties.md#configure-time-to-live-on-outgoing-events-to-azure-storage-queues)
- [Advanced filtering improvements](event-filtering.md#advanced-filtering)
    - Support filtering on array data in incoming events
    - Allow filtering on CloudEvents extensions context attributes
    - New operators
        - StringNotContains
        - StringNotBeginsWith
        - StringNotEndsWith
        - NumberInRange
        - NumberNotInRange
        - IsNullOrUndefined
        - IsNotNull
- [Allow Event Grid schema to CloudEvents 1.0 schema transformations for custom topics and domains](cloudevents-schema.md#configure-for-cloudevents)
        

## 6.0.0 (2020-06)
- Add support to new generally available (GA) service API version 2020-06-01.
- The new features that became GA:
    - [Input mappings](input-mappings.md)
    - [Custom input schema](input-mappings.md)
    - [Cloud event V10 schema](cloud-event-schema.md)
    - [Service Bus topic as destination](handler-service-bus.md)
    - [Azure function as destination](handler-functions.md)
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
	* Pagination and search filter for resources list operations. For an example, see [Topics - List By Subscription](/rest/api/eventgrid/controlplane-version2021-10-15-preview/partner-namespaces/list-by-subscription).
	* [Service Bus queue as destination](handler-service-bus.md)
	* [Advanced filtering](event-filtering.md#advanced-filtering)

## 4.1.0-preview (2019-03)
- This release corresponds to the 2019-02-01-preview API version.
- It adds support to the following new functionalities:
	* Pagination and search filter for resources list operations. For an example, see [Topics - List By Subscription](/rest/api/eventgrid/controlplane-version2021-10-15-preview/partner-namespaces/list-by-subscription).
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
