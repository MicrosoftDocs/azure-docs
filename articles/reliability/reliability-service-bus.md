---
title: Reliability in Azure Service Bus
description: Learn about reliability in Azure Service Bus, including availability zones and multi-region deployments.
ms.author: anaharris
author: anaharris-ms
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-service-bus
ms.date: 12/05/2025
#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure Service Bus works from a reliability perspective and plan both resiliency and recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure Service Bus

Azure Service Bus is a fully managed enterprise message broker service that provides reliable asynchronous messaging capabilities for decoupling applications and services. Service Bus supports queues for point-to-point communication and topics with subscriptions for publish-subscribe messaging patterns. The service provides built-in reliability features including message durability, at-least-once delivery guarantees, and dead-letter queues to handle failed message processing.

[!INCLUDE [Shared responsibility](includes/reliability-shared-responsibility-include.md)]

This article describes how to make Service Bus resilient to a variety of potential outages and problems, including transient faults, availability zone outages, and region outages. It also highlights some key information about the Service Bus service level agreement (SLA).

## Production deployment recommendations

The Azure Well-Architected Framework provides recommendations across reliability, performance, security, cost, and operations. To understand how these areas influence each other and contribute to a reliable App Service solution, see [Architecture best practices for Azure Service Bus in the Azure Well-Architected Framework](/azure/well-architected/service-guides/azure-service-bus).

## Reliability architecture overview

[!INCLUDE [Introduction to reliability architecture overview section](includes/reliability-architecture-overview-introduction-include.md)]

### Logical architecture

A *namespace* serves as the management container for Service Bus, and can be configured to use the Basic, Standard, or Premium tier. You configure the service at the namespace level by allocating capacity, configuring network security, and enabling Geo-Replication and Geo-Disaster Recovery.

Within a namespace, you deploy *queues* and *topics*, which are messaging entities with different semantics. For more information, see [Service Bus queues, topics, and subscriptions](../service-bus-messaging/service-bus-queues-topics-subscriptions.md).

You can optionally configure [*partitions*](../service-bus-messaging/service-bus-partitioning.md) on your namespace, which spreads queues and topics across multiple message brokers and messaging stores. A namespace can use multiple partitions to perform parallel processing and horizontal scaling. Service Bus only guarantees ordering within a single partition. Partitioning plays a key role in your application's reliability design. When you design your application, make a trade-off between maximizing availability and consistency. For the Premium tier, [you enable partitioning on the namespace](../service-bus-messaging/enable-partitions-premium.md). For Basic and Standard tier namespaces, you configure partitions on the entity and [optionally when you send messages](../event-hubs/event-hubs-availability-and-consistency.md).

You can use Service Bus and its asynchronous design approaches to increase the availability of your applications. For more information, see [Asynchronous messaging patterns and high availability](../service-bus-messaging/service-bus-async-messaging.md).

### Physical architecture

Service Bus provides the underlying compute and storage resources. For each namespace, multiple *message brokers* process the messages, and multiple *messaging stores* store the messages. There are three copies of the messaging store: one primary and two secondary. Service Bus keeps all three copies in sync for data and management operations. If the primary copy fails, one of the secondary copies is promoted to primary with no perceived downtime.

For namespaces that use the Basic or Standard tier, Service Bus provides redundancy through a shared multitenant infrastructure that automatically replicates messages across availability zones where available. The service maintains multiple messaging stores and keeps all copies synchronized for both data and management operations.

For [Premium tier namespaces](../service-bus-messaging/service-bus-premium-messaging.md), Service Bus provides dedicated messaging units, each with dedicated CPU and memory resources. Premium tier namespaces can automatically scale based on workload demands. For more information, see [Automatically update messaging units of an Azure Service Bus namespace](../service-bus-messaging/automate-update-messaging-units.md).

Service Bus infrastructure spans multiple physical machines and racks that are spread across fault domains, which reduces the risk of catastrophic failures affecting your namespace. In regions that have availability zones, the infrastructure [extends across separate physical datacenters](#resilience-to-availability-zone-failures). The service implements transparent failure detection and failover mechanisms such that it continues to operate within the assured service levels and typically without noticeable interruptions when such failures occur.

## Resilience to transient faults

[!INCLUDE [Resilience to transient faults](includes/reliability-transient-fault-description-include.md)]

The Azure Service Bus SDK includes automatic retry logic with exponential backoff for operations that fail due to transient conditions such as network timeouts or temporary service unavailability. When applications experience transient disconnects from Service Bus, the SDK automatically attempts to reconnect using the configured retry policy.

To optimize transient fault handling in your applications, use the latest Service Bus SDK, which includes the most current retry logic and connection management features. For more information, see [Azure Service Bus client library for .NET](/dotnet/api/overview/azure/service-bus).

## Resilience to availability zone failures

[!INCLUDE [Resilience to availability zone failures](includes/reliability-availability-zone-description-include.md)]

Service Bus supports zone-redundant deployments in all service tiers. When you create a Service Bus namespace in a supported region, zone redundancy is automatically enabled at no extra cost. The zone-redundant deployment model applies to all Service Bus features, including partitioning and sessions.

Service Bus transparently replicates your configuration, metadata, and message data across multiple availability zones in the region. Zone redundancy provides automatic failover without any intervention required from you. All Service Bus components including compute, networking, and storage are replicated across zones. Service Bus has enough capacity reserves to instantly handle the complete loss of a zone. Even if an entire availability zone becomes unavailable, Service Bus continues to operate without data loss or interruption to messaging applications.

:::image type="content" source="./media/reliability-service-bus/zone-redundant.svg" alt-text="Diagram that shows a zone-redundant Service Bus namespace." border="false":::

### Requirements

- **Region support:** Zone-redundant Service Bus namespaces can be deployed into [Azure regions with availability zones support](./regions-list.md).  Service Bus automatically enables availability zone support when you create a namespace in a supported region, with no additional configuration required.

- **Tiers:** All Service Bus tiers (Basic, Standard, and Premium) support availability zones with no additional requirements.

### Considerations

Service Bus namespaces include a `zoneRedundant` property. Previously, this property was required to enable availability zones, but this behavior has changed and the `zoneRedundant` property is being deprecated. This property might still show as `false` even when zone redundancy is enabled. All namespaces in regions with availability zones are zone-redundant.

### Cost

Zone redundancy in Service Bus doesn't add extra cost.

### Configure availability zone support

Service Bus namespaces automatically support zone redundancy when deployed in [supported regions](#requirements). No further configuration is required.

### Behavior when all zones are healthy

This section describes what to expect when Service Bus namespaces are configured for zone redundancy and all availability zones are operational.

- **Traffic routing between zones**. Service Bus uses an active-active model where messages are distributed across multiple availability zones. Client connections are automatically load-balanced across zones, and the service routes operations to available messaging infrastructure regardless of zone.

- **Data replication between zones**. Service Bus uses synchronous replication across availability zones, including for metadata and message data. Multiple copies of the messaging store must acknowledge write operations before they are considered complete, ensuring data consistency across zones during normal operations.

### Behavior during a zone failure

This section describes what to expect when Service Bus namespaces are configured for zone redundancy and there's an availability zone outage.

- **Detection and response**: Microsoft automatically detects zone failures and initiates failover to healthy zones. No customer action is required for zone-level failover.

[!INCLUDE [Availability zone down notification (Service Health only)](./includes/reliability-availability-zone-down-notification-service-include.md)]

- **Active requests**: During a zone failure, Service Bus might drop active requests. If your clients handle [transient faults](#resilience-to-transient-faults) appropriately by retrying after a short period of time, they typically avoid significant impact.

- **Expected data loss**: No data loss occurs during a zone failure because Service Bus synchronously replicates messages across zones before acknowledgment.

- **Expected downtime**: A zone failure might cause a few seconds of downtime. If your clients handle [transient faults](#resilience-to-transient-faults) appropriately by retrying after a short period of time, they typically avoid significant impact.

- **Traffic rerouting**: Service Bus detects the loss of the zone and automatically redirects new requests to another replica in one of the healthy availability zones.

  The Service Bus SDK typically handles connection management and retry logic transparently.

### Zone recovery

When an availability zone recovers, Service Bus automatically reintegrates the zone into the active service topology. The recovered zone begins accepting new connections and processing messages alongside the other zones. Data that had been replicated to surviving zones during the outage remains intact, and normal synchronous replication resumes across all zones. You don't need to take action for zone recovery and reintegration.

### Test for zone failures

Service Bus manages traffic routing, failover, and zone recovery for zone failures, so you don't need to validate availability zone failure processes or provide further input.

## Resilience to region-wide failures

Service Bus provides two types of multi-region support, both of which require Premium tier namespaces:

- [Geo-Replication (preview)](#geo-replication) provides active-passive replication of both metadata and message data between a primary region and a secondary region. Use Geo-Replication for most applications that need to remain resilient to region outages and have a low tolerance for message data loss.

- [Metadata Geo-Disaster Recovery](#metadata-geo-disaster-recovery) provides active-passive replication of configuration and metadata between a primary and secondary region, but it doesn't replicate message data. Consider using Geo-Disaster Recovery for applications that handle their own data replication, or that don't need data replication.

Both Geo-Replication and metadata Geo-Disaster Recovery require you to manually initiate failover or promotion of a secondary region to become the new primary region. Microsoft doesn't automatically perform failover or promotion, even if your primary region is down.

Namespaces in the Basic and Standard tiers don't include native multi-region features, but you can implement application-level replication patterns using multiple namespaces across regions. For more information, see the [Custom multi-region solutions for resiliency](#custom-multi-region-solutions-for-resiliency) section below.

### Geo-Replication

The Premium tier support Geo-Replication (Preview). This feature replicates both metadata (such as entities, configuration, and properties) and data (such as messages in your queues and topics, and message properties and state) for the namespace. You configure the replication approach for your namespace's configuration and data. This feature ensures that your messages remain available in another region and allows you to switch to the secondary region when needed.

> [!IMPORTANT]
> This feature is currently in public preview, and as such shouldn't be used in production scenarios.

Use Geo-Replication for scenarios that require resiliency to region outages and have a low tolerance for message data loss.

The namespace essentially extends across regions. One region serves as the primary, and the other regions serves as the secondary. Your Azure subscription shows a single namespace.

:::image type="content" source="./media/reliability-service-bus/geo-replication.svg" alt-text="Diagram that shows a Service Bus namespace configured for Geo-Replication." border="false":::

At any time, you can *promote* the secondary region to a primary region. When you promote the secondary region, Service Bus repoints the namespace's fully qualified domain name (FQDN) to the selected secondary region and demotes the previous primary region to a secondary region. You decide whether to perform a *planned promotion*, which means that you wait for data replication to complete, or a *forced promotion*, which might result in data loss.

> [!NOTE]
> Service Bus Geo-Replication uses the term *promotion* because it best represents the process of promoting a secondary region to a primary region (and later demoting a primary region to a secondary region). You might also see the term *failover* used to describe the general process.

This section summarizes important aspects of Geo-Replication. Review the full documentation to understand exactly how it works. For more information, see [Service Bus Geo-Replication](../service-bus-messaging/service-bus-geo-replication.md).

#### Requirements

- **Region support:** You can choose any Azure region that supports Service Bus as your primary region or secondary region. You don't need to use Azure paired regions, so you can choose secondary regions based on your latency, compliance, or data residency requirements.

- **Tier:** To enable Geo-Replication, your namespace must use the Premium tier.

- **Metadata Geo-Disaster Recovery:** You can't configure a namespace to use both Geo-Replication and Geo-Disaster Recovery.

#### Considerations

- **Feature limitations:** When you enable Geo-Replication, there are some restrictions. For more information, see [Service Bus Geo-Replication](../service-bus-messaging/service-bus-geo-replication.md).

- **Private endpoints:** If you use private endpoints to connect to your namespace, you also need to configure networking in your primary and secondary regions. For more information, see [Private endpoints](../event-hubs/geo-replication.md#private-endpoints) in the Azure Event Hubs documentation.

#### Cost

To understand how pricing works for Geo-Replication, see [Pricing](../service-bus-messaging/service-bus-geo-replication.md#pricing).

#### Configure multi-region support

- **Enable Geo-Replication on a new namespace.** To enable Geo-Replication on a namespace during creation time, see [Switch replication mode](../service-bus-messaging/service-bus-geo-replication.md#setup).

- **Migrate from metadata Geo-Disaster Recovery to Geo-Replication.** [You can switch from using metadata Geo-Disaster Recovery to Geo-Replication.](../service-bus-messaging/service-bus-geo-replication.md#migration).

- **Change the replication approach.** To change between synchronous and asynchronous replication modes, see [Switch replication mode](../service-bus-messaging/service-bus-geo-replication.md#switch-replication-mode).

- **Disable Geo-Replication.** To disable Geo-Replication to a secondary region, see [Delete secondary region](../service-bus-messaging/service-bus-geo-replication.md#delete-secondary-region).

#### Behavior when all regions are healthy

This section describes what to expect when a Service Bus namespace is configured for Geo-Replication, and the primary region is operational.

- **Traffic routing between regions:** Client applications connect through the FQDN for your namespace, and their traffic routes to the primary region.

  Only the primary region actively processes messages from clients during normal operations. The secondary region receives replicated messages but otherwise remains passive in standby mode.

- **Data replication between regions:** Data replication behavior between the primary and secondary region depends on whether you configure your replication pairing to use synchronous or asynchronous replication.

  - *Synchronous:* Messages are replicated to the secondary region before the write operation completes.
    
    This mode provides the greatest assurance that your message data is safe because it must be committed in the primary and secondary region. However, synchronous replication substantially increases the write latency for incoming messages. It also requires that the secondary region be available to accept the write operation, so an outage in the secondary region causes the write operation to fail.

    - *Asynchronous:* Messages are written to the primary region and then the write operation completes. A short time later, it replicates the messages to the secondary region.
    
    This mode provides a higher write throughput than synchronous replication because there's no inter-region replication latency during write operations. Also, the asynchronous replication mode can tolerate the loss of the secondary region while still allowing write operations in the primary region. However, if the primary region has an outage, any data that hasn't yet been replicated to the secondary region might be unavailable or lost.

    When you configure asynchronous replication, you configure the maximum acceptable lag time for replication to take. At any time, you can verify the current replication lag [by using Azure Monitor metrics](../service-bus-messaging/service-bus-geo-replication.md#monitoring-data-replication).
        
    If the asynchronous replication lag increases beyond the maximum you specify, the primary region starts to throttle incoming requests so that the replication can catch up. To avoid this situation, it's important to select secondary regions that aren't too geographically distant, and to ensure that your capacity is sufficient for the throughput.

    Some metadata types are replicated synchronously even if you select the asynchronous replication mode.

    For more information, see [Replication modes](../service-bus-messaging/service-bus-geo-replication.md#replication-modes).

#### Behavior during a region outage

This section describes what to expect when a Service Bus namespace is configured for Geo-Replication and there's an outage in the primary or a secondary region.

- **Detection and response:** You're responsible for deciding when to promote your namespace's secondary region to become the new primary region. Microsoft doesn't make this decision or initiate the process for you, even if there's a region outage. For suggested criteria to consider when deciding whether to fail over, see [Criteria to trigger promotion](../service-bus-messaging/service-bus-geo-replication.md#criteria-to-trigger-promotion).

    For more information about how to promote a secondary region to the new primary, see [Promotion flow](../service-bus-messaging/service-bus-geo-replication.md#promotion-flow).

    When you promote a secondary region, choose whether to perform a *planned promotion* or a *forced promotion*. A planned promotion waits for the secondary region to catch up before accepting new traffic. This approach eliminates data loss but introduces downtime.

    During an outage in the primary region, you typically need to perform a forced promotion. If the primary region is available and you trigger a promotion for another reason, you might choose a planned promotion.

[!INCLUDE [Region down notification (Service Health only)](./includes/reliability-region-down-notification-service-include.md)]

- **Active requests:** The behavior depends on whether the region outage occurs in the primary region or the secondary region:

    - *Primary region outage:* If the primary region is unavailable, all active requests are terminated. Client applications should retry operations after the promotion completes.

    - *Secondary region outage:* An outage in the secondary region might cause problems for active requests in the following situations:

        - If you use the synchronous replication mode, the primary region can't complete write operations if any secondary region is unavailable.

        - If you use the asynchronous replication mode, your namespace throttles and doesn't accept new messages after the replication lag reaches the maximum that you configure.

        To continue using the namespace in the primary region, remove the secondary namespace from your Geo-Replication configuration.

- **Expected data loss:** The amount of data loss depends on the type of promotion that you perform (planned or forced) and the replication mode (synchronous or asynchronous):

    - *Planned promotion:* No data loss is expected. However, during a region outage, a planned promotion might not be possible because it requires all of the primary and secondary regions to be available.

    - *Forced promotion, synchronous replication:* No data loss is expected.

    - *Forced promotion, asynchronous replication:* You might experience some data loss for recent messages that aren't replicated to the secondary region, and for state changes that haven't yet been replicated. The amount depends on the replication lag. To verify the current replication lag, use [Azure Monitor metrics](../service-bus-messaging/service-bus-geo-replication.md#monitoring-data-replication).
    
    If you perform a forced promotion, you can't recover lost data, even after the primary region becomes available.

- **Expected downtime:** The amount of expected downtime depends on whether you perform a planned or forced promotion:

    - *Planned promotion:* The first step in a planned promotion replicates data to the secondary region. That process usually completes quickly, but in some situations, it might take up to the length of the replication lag. After the replication completes, the promotion process typically takes about 5 to 10 minutes. It can sometimes take longer for Domain Name System (DNS) servers to update entries and fully replicate their records to clients.
    
        The primary region doesn't accept write operations during the entire promotion process.

        This option might not be possible during a region outage because it requires all primary and secondary regions to be available.

    - *Forced promotion:* During a forced promotion, Service Bus doesn't wait for data replication to complete, and it initiates the promotion immediately. The promotion process typically takes about 5 to 10 minutes. It can sometimes take longer for DNS entries to be fully replicated and updated across clients.

        The primary region doesn't accept write operations during the entire promotion process.

- **Traffic rerouting:** After the promotion completes, the namespace's FQDN points to the new primary region. But this redirection depends on how quickly clients' DNS records are updated, including for their DNS servers to honor the time-to-live (TTL) of the namespace DNS records.

#### Region recovery

After the original primary region recovers, if you want to return the namespace to its original primary region, follow the same region promotion process.

If you performed a forced promotion during the region outage, you can't recover lost data, even after the primary region becomes available.

#### Test for region failures

To test Geo-Replication, temporarily promote the secondary region to primary and validate that your client applications can switch between regions with minimal disruption.

Monitor the promotion duration and validate that your runbooks and automation work correctly. After testing, you can fail back to the original configuration.

Understand the potential downtime and data loss that you might experience during and after the promotion process. Test Geo-Replication in a nonproduction environment that mirrors the configuration of your production namespace.

### Metadata Geo-Disaster Recovery

The Premium tier support metadata Geo-Disaster Recovery. This feature improves recovery from disaster scenarios, including the catastrophic loss of a region. Geo-Disaster Recovery only replicates the configuration and metadata of your namespace. However, it doesn't replicate message data. To support disaster recovery, this feature ensures that a namespace in another region is preconfigured and ready to immediately accept messages from clients. Geo-Disaster Recovery serves as a one-way recovery solution and doesn't support failback to the prior primary region.

Metadata Geo-Disaster Recovery works best for applications that don't strictly need to maintain every message and can tolerate some data loss during a disaster scenario. Metadata Geo-Disaster Recovery might also be appropriate for applications that replicate data themselves, or that don't need data replication at all. For example, if your messages represent large images that you later convert to thumbnails, you might decide that you can afford to lose some messages from a failed region if you can quickly resume processing new messages in another region, and you can reconstruct the messages later to catch up. 

> [!IMPORTANT]
> Geo-Disaster Recovery enables continuity of operations that have the same configuration but **doesn't replicate message data**. If you need to replicate message data, consider using [Geo-Replication](#geo-replication).

When you configure metadata Geo-Disaster Recovery, you create an *alias* that client applications connect to. The alias is an FQDN that directs all traffic to the primary namespace by default.

:::image type="content" source="./media/reliability-service-bus/geo-disaster-recovery.svg" alt-text="Diagram that shows two Service Bus namespaces that are configured for metadata Geo-Disaster Recovery." border="false":::

If the primary region fails or another type of disaster occurs, you can manually initiate a single-time, one-way failover move from the primary region to the secondary region at any time. You can choose to perform a *safe failover*, which waits for replications to be completed before switching to the secondary, although this option might not be available during a region outage. Once a failover starts, it completes almost instantly. During the failover process, the Geo-Disaster Recovery alias repoints to the secondary namespace and the pairing is removed.

This section summarizes important aspects of Geo-Disaster Recovery. Review the full documentation to understand exactly how it works. For more information, see [Service Bus Geo-Disaster Recovery](../service-bus-messaging/service-bus-geo-dr.md).

#### Requirements

- **Region support:** You can select any Azure region that supports Service Bus as your primary or secondary namespace. You don't need to use Azure paired regions, so you can choose secondary regions based on your latency, compliance, or data residency requirements.

- **Tier:** To enable metadata Geo-Disaster Recovery, both namespaces must use the Premium tier.

- **Partitioning:** It's not possible to pair a partitioned namespace with a non-partioned namespace.

- **Metadata Geo-Disaster Recovery:** You can't configure a namespace to use both Geo-Replication and Geo-Disaster Recovery.

#### Considerations

- **Feature limitations:** When you enable Geo-Disaster Recovery, there are some restrictions. For more information, see [Important points to consider](../service-bus-messaging/service-bus-geo-dr.md#important-points-to-consider) and [Considerations](../service-bus-messaging/service-bus-geo-dr.md#considerations).

- **Role assignments:** Microsoft Entra role-based access control (RBAC) assignments to entities in the primary namespace don't replicate to the secondary namespace. Create role assignments manually in the secondary namespace to secure access to them.

- **Application design:** Geo-Disaster Recovery requires specific considerations when you design your client applications. For more information, see [Considerations](../service-bus-messaging/service-bus-geo-dr.md#considerations).

- **Private endpoints:** If you use private endpoints to connect to your namespace, configure networking in both your primary and secondary region. For more information, see [Private endpoints](../service-bus-messaging/service-bus-geo-dr.md#private-endpoints).

- **Namespaces migrated from standard to premium:** If your namespace was previously in the Standard tier and you migrated it to the Premium tier, you need to handle the alias differently. For more information, see [Service Bus Standard to Premium](../service-bus-messaging/service-bus-geo-dr.md#service-bus-standard-to-premium).

#### Cost

When you enable metadata Geo-Disaster Recovery, you pay for both the primary and secondary namespaces.

#### Configure multi-region support

- **Create metadata Geo-Disaster Recovery pairing.** To configure disaster recovery between primary and secondary namespaces, see [Setup and failover flow](../service-bus-messaging/service-bus-geo-dr.md#setup).

- **Disable metadata Geo-Disaster Recovery.** To break the pairing between namespaces, see [Setup and failover flow](../service-bus-messaging/service-bus-geo-dr.md#setup).

#### Capacity planning and management

When you plan for multi-region deployments, ensure that both regions have sufficient capacity to handle the full load if one region fails. The secondary region remains passive during normal operations, but it must immediately handle traffic after failover. Plan how to scale the secondary namespace capacity so that it can receive production traffic without delay. If you can tolerate extra downtime during the failover process, you might choose to scale the secondary namespace capacity during or after failover. To reduce downtime, provision capacity in the secondary namespace in advance so that it remains ready to receive production load.

#### Behavior when all regions are healthy

This section describes what to expect when a Service Bus namespace is configured for Geo-Disaster Recovery, and the primary region is operational.

- **Traffic routing between regions:** Client applications connect through the Geo-Disaster Recovery alias for your namespace, and their traffic routes to the primary namespace in the primary region.

    Only the primary namespace actively processes messages from clients during normal operations. The secondary namespace remains passive in standby mode, and any requests to access data fail.

- **Data replication between regions:** Only configuration metadata replicates between the namespaces. Replication of configuration occurs continuously and asynchronously.

    All message data remains in the primary namespace only and doesn't replicate to the secondary namespace.

#### Behavior during a region outage

This section describes what to expect when a Service Bus namespace is configured for Geo-Disaster Recovery and there's an outage in the primary region.

- **Detection and response:** You're responsible for monitoring region health and initiating failover manually. Microsoft doesn't perform failover or promote a secondary region automatically, even if your primary region is down.

    For more information about how to initiate failover, see [Failover flow](../service-bus-messaging/service-bus-geo-dr.md#failover-flow).

    When you initiate a failover, choose whether to perform a *safe failover* or a standard (*forced* or *manual failover*). A safe failover waits for replication to complete to the secondary region before the failover starts. This approach reduces the loss of metadata but introduces downtime. Safe failover requires the namespaces to be in the same Azure subscription.
    
    During an outage in the primary region, you typically need to perform a forced failover. If the primary region is available and you trigger a failover for another reason, you might choose a planned failover.

    Failover is a one-way operation, so you need to reestablish the Geo-Disaster Recovery pairing later. For more information, see [Region recovery](#region-recovery-1).

[!INCLUDE [Region down notification (Service Health only)](./includes/reliability-region-down-notification-service-include.md)]

- **Active requests:** Active requests in progress terminate when the failover starts. Client applications should retry operations after the failover completes.

- **Expected data loss:** 

    - *Metadata:* Configuration and metadata typically replicate to the secondary namespace. But metadata replication occurs asynchronously, so recent changes might not replicate, especially complex changes. Verify the configuration of your secondary namespace before clients access it.

    - *Message data:* Message data doesn't replicate between regions. If the primary region goes down, messages in your primary namespace become unavailable.
    
        The messages aren't permanently lost unless a catastrophic disaster causes total loss of the primary region. If the region recovers, you can retrieve messages from the primary namespace later.

- **Expected downtime:** Failover typically occurs within 5 to 10 minutes. It can take longer for clients to fully replicate and update DNS entries.

- **Traffic rerouting:** Clients that use the Geo-Disaster Recovery alias to connect to the namespace automatically redirect to the secondary namespace after failover. But this redirection depends on DNS servers honoring the TTL of the namespace DNS records and clients receiving those updated DNS records.

#### Region recovery

After the original primary region recovers, you must manually re-establish the pairing and optionally fail back. Create a new Geo-Disaster Recovery pairing with the recovered region as secondary, then perform another failover if you want to return to the original region. This process involves potential data loss of messages sent to the temporary primary.

If the disaster causes the loss of all zones in the primary region, your data might be unrecoverable. In other scenarios, your message data remains in the primary namespace from before the failover is recoverable. You can obtain historic messages from the old primary namespace after you restore access. You're responsible for configuring your applications to receive and process those messages. Microsoft doesn't automatically restore them into your secondary region.

#### Test for region failures

To test your response and disaster recovery processes, perform a planned failover during a maintenance window. Initiate failover from your primary namespace to your secondary namespace and verify that your applications can connect and process messages from the new primary.

Monitor the failover duration and validate that your runbooks and automation work correctly. After testing, you can fail back to the original configuration.

Understand the potential downtime and data loss that you might experience during and after the failover process. Test metadata Geo-Disaster Recovery in a nonproduction environment that mirrors the configuration of your production namespace.

### Custom multi-region solutions for resiliency

Geo-Replication and metadata Geo-Disaster Recovery provide resiliency to region outages and other problems, and are suitable for most workloads. However, they might not suit your needs in the following situations:

- You have requirements for custom replication or for maintaining multiple active regions simultaneously.
- You use a Service Bus tier that doesn't support these features.

There are a range of design patterns to achieve different types of multi-region support in Service Bus. Many of the patterns require deploying multiple namespaces and configuring your application to use the namespaces appropriately. To learn more, see the following articles:
- [Use multiple namespaces to insulate applications against Service Bus outages and disasters](../service-bus-messaging/service-bus-outages-disasters.md)
- [Message replication and cross-region federation](../service-bus-messaging/service-bus-federation-overview.md).

## Resilience to service maintenance

Service Bus performs regular maintenance. During planned maintenance, namespaces are moved to a redundant node that contains the latest updates. As this move happens, the clients SDK disconnects and reconnects automatically on the namespace. Usually, the upgrades happen within 30 seconds. It's important your applications are [prepared for any transient network disconnections](#resilience-to-transient-faults) that occur during the maintenance periods.

For more information, see [Guidance on Azure maintenance events for Azure Service Bus](../service-bus-messaging/prepare-for-planned-maintenance.md).

## Backup and restore

Service Bus isn't designed as a long-term storage location for your data. Typically, data is stored in a topic or queue for a short period of time, and is then processed or persisted into another data storage system, at which point it's deleted. Because of this design, Service Bus automatically maintains replicas of message data, but doesn't provide backup and restore capabilities for message data.

For scenarios requiring long-term message retention, consider implementing application-level archiving to Azure Storage or other durable storage services.

## Service-level agreement

[!INCLUDE [SLA description](includes/reliability-service-level-agreement-include.md)]

Service Bus provides an SLA for all namespaces. The availability SLA is higher when your namespace meets all of the following criteria:
- It uses the premium tier.
- It's located in a region with availability zones.
- It uses partitioning.

## Related content

- [Service Bus documentation](../service-bus-messaging/service-bus-messaging-overview.md)
- [Azure Service Bus Geo-Disaster Recovery](/azure/service-bus-messaging/service-bus-geo-dr)
- [Azure Service Bus Geo-Replication](/azure/service-bus-messaging/service-bus-geo-replication)
