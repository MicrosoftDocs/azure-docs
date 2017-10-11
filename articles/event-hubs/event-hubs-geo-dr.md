---
title: Azure Event Hubs Geo-disaster recovery | Microsoft Docs
description: How to use geographical regions to failover and perform disaster recovery in Azure Event Hubs
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
ms.date: 10/11/2017
ms.author: sethm

---

# Azure Event Hubs Geo-disaster recovery (Preview)

When regional datacenters experience downtime, it is critical for data processing to continue to operate in a different region or datacenter. As such, *Geo-disaster recovery* and *Geo-replication* are important features for any enterprise. Azure Event Hubs supports both Geo-disaster recovery and Geo-replication, at the namespace level. 

## Outages and disasters

The [Best practices against outages and disasters](../service-bus-messaging/service-bus-outages-disasters.md) article makes a distinction between "outages" and "disasters," which is important to note. An *outage* is the temporary unavailability of Azure Event Hubs, and can affect some components of the service, such as a messaging store, or even the entire datacenter. However, after the problem has been fixed, Event Hubs becomes available again. Typically, an outage does not cause the loss of events or other data. An example of such an outage might be a power failure in the datacenter.

A *disaster* is defined as the permanent loss of an Event Hubs resource or datacenter. The datacenter may or may not become available again, or may be down for hours or days. A disaster typically causes the loss of some or all events or other data. Examples of such disasters are fire, flooding, or earthquake.

The Geo-disaster recovery feature of Azure Event Hubs is a disaster recovery solution. The concepts and workflow described in this article apply to disaster scenarios, and not to transient, or temporary outages. 

Geo-disaster recovery attempts to recover from the loss of application functionality in regional disaster scenarios. For example, if an Azure region hosting your Event Hubs service becomes unavailable, a backup Event Hubs service exists in another region, and there is minimal disruption.

## Configuration workflow

The following section describes how to set up disaster recovery scenarios.

### Initial configuration

To begin configuring your existing or new Event Hubs namespaces for disaster recovery, provision a backup Event Hubs namespace in a different Azure region. For example, if your Event Hubs namespace is in the **South Central US** region, then you can provision a backup Event Hubs namespace in **North Central US**.

In this example, the South Central US Event Hubs namespace is called the *primary namespace*, while the North Central US Event Hubs namespace is called the *secondary namespace*. South Central US is called the *active region*, and North Central US is called the *passive region*.

### Normal use

After configuring, continue with normal usage of Event Hubs in the primary namespace. The Geo-disaster recovery feature automatically synchronizes all the metadata with the secondary Event Hubs namespace. This sync occurs within a few minutes. In this scenario, *metadata* refers to event hub names, consumer groups, partitions, throughput units, entities, and properties that are associated with the namespace.

### Disaster occurs

The following sequence describes a typical disaster scenario:

1. Some disaster occurs and the primary Event Hubs namespace goes down. At this point you want to take some mitigation action.

2. You run code that [triggers a failover](../service-bus-messaging/service-bus-geo-dr.md#initiate-a-failover) of the Event Hubs namespace from primary to secondary.

3. After failover is triggered, metadata and data starts flowing into the secondary namespace.

4. Applications that had been writing and reading data to and from the event hubs in the primary namespace do not need to take any action. These applications automatically start reading and writing to and from the event hubs in the secondary namespace.

### Normal processing resumes after disaster

When the Azure region (and the Event Hubs namespace) is back up, if you need the data that existed in the event hubs of the primary namespace before the disaster, you must use an explicit connection to those event hubs in the namespace, and extract the data.

## Terminology

- **Pairing**: Establishing the disaster recovery configuration between the active region and passive region is known as *pairing* the regions.

- **Alias**: A name for the disaster recovery configuration that you set up. The alias provides a stable Fully Qualified Domain Name (FQDN) connection string. Applications use this connection string to connect to an event hub in the primary namespace. In case of a disaster, you continue using the same connection string to connect to the event hub in the secondary namespace.

## Considerations for public preview

Note the following considerations for this release:

1. The Geo-disaster recovery capability is available only in the North Central US and South Central US regions. 
2. The feature is supported only for newly-created namespaces.
3. For the preview release, only metadata replication is enabled. Actual data is not replicated.
4. With the preview release, there is no cost for enabling the feature. However, both the primary and the secondary namespaces will incur charges for the reserved throughput units.

## Disaster recovery workflow

The following section describes the steps for performing Geo-disaster recovery in Event Hubs.

### Step 1: Create the namespaces and establish a geo-pairing

1. Select the active region and create the primary namespace.

2. Select the passive region and create the secondary namespace. The following guidelines apply to the secondary namespace:
	1. The secondary namespace must not exist at the time you create the pairing.
	2. The secondary namespace must be the same type and SKU as the primary namespace.
	3. The two namespaces cannot be in the same region.
	4. Changing the names of an alias is not allowed.
	5. Changing the secondary namespace is not allowed.

3.  Create an alias and provide the primary and secondary namespaces to complete the pairing.

4.  Get the required connection strings on the alias to connect to your event hubs.

5.  Once the namespaces are paired with an alias, the metadata is replicated periodically in both namespaces.

![][1]

### Step 2: Initiate a failover

After this step, the secondary namespace becomes the primary namespace.

1. [Initiate a fail-over](../service-bus-messaging/service-bus-geo-dr.md#initiate-a-failover). This step is only performed on the secondary namespace. The geo-pairing is broken and the alias now points to the secondary namespace.
4. Senders and receivers still connect to the event hubs using the alias. The failover does not disrupt the connection.
5. Because the pairing is broken, the old primary namespace no longer has a replication status associated with it.
6. The metadata synchronization between the primary and secondary namespaces also stops.

![][2]

### Step 3: Other operations (optional)

This step stops the meta-data synchronization between the primary and the secondary namespaces. After performing this step, the [geo-pairing is broken and the alias is deleted](../service-bus-messaging/service-bus-geo-dr.md#how-to-disable-geo-disaster-recovery).

To delete the alias, you must delete the geo-pairing. Once the pairing deletion succeeds, you can delete the alias. At that point, the connection strings for the alias are also deleted.

## Next Steps

See the Geo-disaster recovery [REST API reference here](/rest/api/eventhub/disasterrecoveryconfigs).

For more information about Event Hubs, visit the following links:

* Get started with an [Event Hubs tutorial](event-hubs-dotnet-standard-getstarted-send.md)
* [Event Hubs FAQ](event-hubs-faq.md)
* [Sample applications that use Event Hubs](https://github.com/Azure/azure-event-hubs/tree/master/samples)

[1]:./media/event-hubs-geo-dr/eh-geodr1.png
[2]:./media/event-hubs-geo-dr/eh-geodr2.png