---
title: Geo-disaster recovery - Azure Event Hubs| Microsoft Docs
description: How to use geographical regions to fail over and perform disaster recovery in Azure Event Hubs
services: event-hubs
documentationcenter: ''
author: ShubhaVijayasarathy
manager: timlt
editor: ''

ms.service: event-hubs
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/28/2020
ms.author: shvija

---

# Azure Event Hubs - Geo-disaster recovery 
When entire Azure regions or datacenters (if no [availability zones](../availability-zones/az-overview.md) are used) experience downtime, it's critical for data processing to continue to operate in a different region or datacenter. As such, *Geo-disaster recovery* and *Geo-replication* are important features for any enterprise. Azure Event Hubs supports both geo-disaster recovery and geo-replication, at the namespace level. 

> [!NOTE]
> The Geo-disaster recovery feature is only available for the [standard and dedicated SKUs](https://azure.microsoft.com/pricing/details/event-hubs/).  

## Outages and disasters

It's important to note the distinction between "outages" and "disasters." An **outage** is the temporary unavailability of Azure Event Hubs, and can affect some components of the service, such as a messaging store, or even the entire datacenter. However, after the problem is fixed, Event Hubs becomes available again. Typically, an outage doesn't cause the loss of messages or other data. An example of such an outage might be a power failure in the datacenter. Some outages are only short connection losses because of transient or network issues. 

A *disaster* is defined as the permanent, or longer-term loss of an Event Hubs cluster, Azure region, or datacenter. The region or datacenter may or may not become available again, or may be down for hours or days. Examples of such disasters are fire, flooding, or earthquake. A disaster that becomes permanent might cause the loss of some messages, events, or other data. However, in most cases there should be no data loss and messages can be recovered once the data center is back up.

The Geo-disaster recovery feature of Azure Event Hubs is a disaster recovery solution. The concepts and workflow described in this article apply to disaster scenarios, and not to transient, or temporary outages. For a detailed discussion of disaster recovery in Microsoft Azure, see [this article](/azure/architecture/resiliency/disaster-recovery-azure-applications).

## Basic concepts and terms

The disaster recovery feature implements metadata disaster recovery, and relies on primary and secondary disaster recovery namespaces. 

The Geo-disaster recovery feature is available for the [standard and dedicated SKUs](https://azure.microsoft.com/pricing/details/event-hubs/) only. You don't need to make any connection string changes, as the connection is made via an alias.

The following terms are used in this article:

-  *Alias*: The name for a disaster recovery configuration that you set up. The alias provides a single stable Fully Qualified Domain Name (FQDN) connection string. Applications use this alias connection string to connect to a namespace. 

-  *Primary/secondary namespace*: The namespaces that correspond to the alias. The primary namespace is "active" and receives messages (can be an existing or new namespace). The secondary namespace is "passive" and doesn't receive messages. The metadata between both is in sync, so both can seamlessly accept messages without any application code or connection string changes. To ensure that only the active namespace receives messages, you must use the alias. 

-  *Metadata*: Entities such as event hubs and consumer groups; and their properties of the service that are associated with the namespace. Only entities and their settings are replicated automatically. Messages and events aren't replicated. 

-  *Failover*: The process of activating the secondary namespace.

## Supported namespace pairs
The following combinations of primary and secondary namespaces are supported:  

| Primary namespace | Secondary namespace | Supported | 
| ----------------- | -------------------- | ---------- |
| Standard | Standard | Yes | 
| Standard | Dedicated | Yes | 
| Dedicated | Dedicated | Yes | 
| Dedicated | Standard | No | 

> [!NOTE]
> You can't pair namespaces that are in the same dedicated cluster. You can pair namespaces that are in separate clusters. 

## Setup and failover flow

The following section is an overview of the failover process, and explains how to set up the initial failover. 

![1][]

### Setup

You first create or use an existing primary namespace, and a new secondary namespace, then pair the two. This pairing gives you an alias that you can use to connect. Because you use an alias, you don't have to change connection strings. Only new namespaces can be added to your failover pairing. Finally, you should add some monitoring to detect if a failover is necessary. In most cases, the service is one part of a large ecosystem, thus automatic failovers are rarely possible, as often failovers must be performed in sync with the remaining subsystem or infrastructure.

### Example

In one example of this scenario, consider a Point of Sale (POS) solution that emits either messages or events. Event Hubs passes those events to some mapping or reformatting solution, which then forwards mapped data to another system for further processing. At that point, all of these systems might be hosted in the same Azure region. The decision on when and what part to fail over depends on the flow of data in your infrastructure. 

You can automate failover either with monitoring systems, or with custom-built monitoring solutions. However, such automation takes extra planning and work, which is out of the scope of this article.

### Failover flow

If you initiate the failover, two steps are required:

1. If another outage occurs, you want to be able to fail over again. Therefore, set up another passive namespace and update the pairing. 

2. Pull messages from the former primary namespace once it's available again. After that, use that namespace for regular messaging outside of your geo-recovery setup, or delete the old primary namespace.

> [!NOTE]
> Only fail forward semantics are supported. In this scenario, you fail over and then re-pair with a new namespace. Failing back is not supported; for example, in a SQL cluster. 

![2][]

## Management

If you made a mistake; for example, you paired the wrong regions during the initial setup, you can break the pairing of the two namespaces at any time. If you want to use the paired namespaces as regular namespaces, delete the alias.

## Samples

The [sample on GitHub](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/GeoDRClient) shows how to set up and initiate a failover. This sample demonstrates the following concepts:

- Settings required in Azure Active Directory to use Azure Resource Manager with Event Hubs. 
- Steps required to execute the sample code. 
- Send and receive from the current primary namespace. 

## Considerations

Note the following considerations to keep in mind with this release:

1. By design, Event Hubs geo-disaster recovery does not replicate data, and therefore you cannot reuse the old offset value of your primary event hub on your secondary event hub. We recommend restarting your event receiver with one of the following methods:

- *EventPosition.FromStart()* - If you wish read all data on your secondary event hub.
- *EventPosition.FromEnd()* - If you wish to read all new data from the time of connection to your secondary event hub.
- *EventPosition.FromEnqueuedTime(dateTime)* - If you wish to read all data received in your secondary event hub starting from a given date and time.

2. In your failover planning, you should also consider the time factor. For example, if you lose connectivity for longer than 15 to 20 minutes, you might decide to initiate the failover. 
 
3. The fact that no data is replicated means that currently active sessions aren't replicated. Additionally, duplicate detection and scheduled messages may not work. New sessions, scheduled messages, and new duplicates will work. 

4. Failing over a complex distributed infrastructure should be [rehearsed](/azure/architecture/reliability/disaster-recovery#disaster-recovery-plan) at least once. 

5. Synchronizing entities can take some time, approximately 50-100 entities per minute.

## Availability Zones 

The Event Hubs Standard SKU supports [Availability Zones](../availability-zones/az-overview.md), providing fault-isolated locations within an Azure region. 

> [!NOTE]
> The Availability Zones support for Azure Event Hubs Standard is only available in [Azure regions](../availability-zones/az-region.md) where availability zones are present.

You can enable Availability Zones on new namespaces only, using the Azure portal. Event Hubs doesn't support migration of existing namespaces. You can't disable zone redundancy after enabling it on your namespace.

![3][]

## Private endpoints
This section provides additional considerations when using Geo-disaster recovery with namespaces that use private endpoints. To learn about using private endpoints with Event Hubs in general, see [Integrate Azure Event Hubs with Azure Private Link](private-link-service.md).

### New pairings
If primary namespace with a private endpoint is paired with secondary namespace without a private endpoint, pairing them will fail. It will succeed only if both primary and secondary namespaces have private endpoints. 

> [!NOTE]
> When you try to pair primary namespace with a private endpoint to the secondary namespace, the validation process only checks whether the private endpoint exists on the secondary namespace. It doesn't check whether the endpoint works or will work after failover. 
> 
> It's your responsibility to ensure that the secondary namespace with private endpoint will work as expected after failover.
>
> To test that the private endpoint configurations are same, send a [Get Event Hub](/rest/api/eventhub/get-event-hub) request to the secondary namespace from outside the virtual network, and verify that you receive an error message from the service (not just from the private link network resource provider).

We recommend that you use same configurations on the primary and secondary namespaces and on virtual networks used by them for creating private endpoints. 

### Existing pairings
If pairing between primary and secondary namespace already exists, private endpoint creation on the primary namespace will fail. Create a private endpoint on the secondary namespace first and then create one for the primary namespace.

Updates for private endpoints are permitted on the secondary namespace in a paired configuration. It must be done first before enabling private endpoints on the primary namespace.

### Virtual networks
We recommend that you use separate virtual networks when creating private endpoints for primary and secondary namespaces. You need to create private endpoints for both networks on primary and secondary namespaces before you can pair these namespaces. 

Let's say you have two virtual networks: VNET-1, VNET-2 and these primary and second namespaces: EHUBNS-PNS, EHBUNS-SNS. You need to do the following steps: 

- On EHUBNS-PNS, create two private endpoints that use subnets from VNET-1 and VNET-2
- On EHUBNS-SNS, create two private endpoints that use subnets from VNET-1 and VNET-2 

Advantage of this approach is that failover can happen at the application layer independent of Service Bus namespace. Consider the following scenarios: 

**Application-only failover:** Here, the application won't exist in VNET-1 but will move to VNET-2. As both private endpoints are configured on both VNET-1 and VNET-2 for both primary and secondary namespaces, the application will just work. 

**Event Hubs namespace-only failover**: Here again, since both private endpoints are configured on both virtual networks for both primary and secondary namespaces, the application will just work. 

 
## Next steps

* The [sample on GitHub](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/GeoDRClient) walks through a simple workflow that creates a geo-pairing and initiates a failover for a disaster recovery scenario.
* The [REST API reference](/rest/api/eventhub/disasterrecoveryconfigs) describes APIs for performing the Geo-disaster recovery configuration.

For more information about Event Hubs, visit the following links:

- Get started with Event Hubs
    - [.NET Core](get-started-dotnet-standard-send-v2.md)
    - [Java](get-started-java-send-v2.md)
    - [Python](get-started-python-send-v2.md)
    - [JavaScript](get-started-java-send-v2.md)
* [Event Hubs FAQ](event-hubs-faq.md)
* [Sample applications that use Event Hubs](https://github.com/Azure/azure-event-hubs/tree/master/samples)

[1]: ./media/event-hubs-geo-dr/geo1.png
[2]: ./media/event-hubs-geo-dr/geo2.png
[3]: ./media/event-hubs-geo-dr/eh-az.png
