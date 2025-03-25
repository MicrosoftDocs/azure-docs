---
title: Reliability in Azure IoT Hub
description: Find out about reliability in Azure IoT Hub, including availability zones and multi-region deployments.
author: kgremban
ms.author: kgremban
ms.topic: reliability-article #Required
ms.custom: subject-reliability, references_regions #Required  - use references_regions if specific regions are mentioned.
ms.service: azure-iot-hub
ms.date: 03/25/2025

#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure IoT Hub works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations. 

---

# Reliability in Azure IoT Hub

This article describes reliability support in Azure IoT Hub, covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

Resiliency is a shared responsibility between you and Microsoft and so this article also covers ways for you to create a resilient solution that meets your needs.

Depending on the uptime goals you define for your IoT solutions, you should determine which of the options outlined in this article best suit your business objectives. Incorporating any of these high availability (HA) and disaster recovery (DR) alternatives into your IoT solution requires a careful evaluation of the trade-offs between the:

* Level of resiliency you require
* Implementation and maintenance complexity
* COGS impact

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

Although IoT Hub offers a reasonably high uptime guarantee, transient failures can still be expected as with any distributed computing platform. Appropriate [retry patterns](../iot/concepts-manage-device-reconnections.md#retry-patterns) must be built in to the components interacting with a cloud application to deal with transient failures.

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

IoT Hub is zone redundant, which means your resources are spread across three availability zones. Zone redundancy helps you achieve resiliency and reliability for your production workloads.

Availability zones provide two advantages for IoT hub: data resiliency and smoother deployments.

*Data resiliency* comes from replacing the underlying storage services with availability-zones-supported storage. Data resilience is important for IoT solutions because these solutions often operate in complex, dynamic, and uncertain environments where failures or disruptions can have significant consequences. Whether an IoT solution supports a manufacturing floor, retail or restaurant environments, healthcare systems, or infrastructure, the availability and quality of data is necessary to recover from failures and to provide reliable and consistent services.

*Smoother deployments* come from replacing the underlying data center hardware with newer hardware that supports availability zones. These hardware improvements minimize customer impact from device disconnects and reconnects as well as other deployment-related downtime. The IoT Hub engineering team deploys multiple updates to each IoT hub every month, for both security reasons and to provide feature improvements. Availability-zones-supported hardware is split into 15 update domains so that each update goes smoother, with minimal impact to your workflows. For more information about update domains, see [Availability sets](/azure/virtual-machines/availability-set-overview).

### Region support

Availability zone support for IoT Hub is enabled automatically for new IoT Hub resources created in the following Azure regions:

| Region | Data resiliency | Smoother deployments |
| ------ | --------------- | ------------ |
| Australia East | :::image type="icon" source="./media/yes-icon.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| Brazil South | :::image type="icon" source="./media/yes-icon.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| Canada Central | :::image type="icon" source="./media/yes-icon.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| Central India | :::image type="icon" source="./media/icon-unsupported.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| Central US | :::image type="icon" source="./media/yes-icon.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| East US | :::image type="icon" source="./media/icon-unsupported.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| France Central | :::image type="icon" source="./media/yes-icon.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| Germany West Central | :::image type="icon" source="./media/yes-icon.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| Japan East | :::image type="icon" source="./media/yes-icon.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| Korea Central | :::image type="icon" source="./media/icon-unsupported.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| North Europe  | :::image type="icon" source="./media/yes-icon.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| Norway East | :::image type="icon" source="./media/icon-unsupported.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| Qatar Central | :::image type="icon" source="./media/icon-unsupported.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| Southcentral US | :::image type="icon" source="./media/icon-unsupported.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| Southeast Asia  | :::image type="icon" source="./media/yes-icon.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| UK South | :::image type="icon" source="./media/yes-icon.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| West Europe | :::image type="icon" source="./media/icon-unsupported.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| West US 2 | :::image type="icon" source="./media/yes-icon.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| West US 3 | :::image type="icon" source="./media/icon-unsupported.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |

<!-- 5H. Data replication between zones ------------------------------------------

### Data replication between zones
    
Optional section.  

This section is only required for services that perform data replication across zones.  

This section explains how data is replicated: synchronously, asynchronously, or some combination between the two. 

This section should describe how data replication is performed during regular day-to-day operations - NOT during a zone failure.  

Most Azure services replicate data across zones synchronously, which means that changes are applied to multiple (or all) zones simultaneously, and the change isn't considered to be completed until multiple/all zones have acknowledged the change. Use wording similar to the following to explain this approach and its tradeoffs.

**Example:**

> When a client changes any data in your IoT Hub resource, that change is applied to all instances in all zones simultaneously. This approach is called *synchronous replication.* Synchronous replication ensures a high level of data consistency, which reduces the likelihood of data loss during a zone failure. Availability zones are located relatively close together, which means there's minimal effect on latency or throughput.

Alternatively, some services replicate their data asynchronously, where changes are applied in a single zone and then propagated after some time to the other zones. Use wording similar to this to explain this approach and its tradeoffs.

**Example:**

> When a client changes any data in your IoT Hub resource, that change is applied to the primary zone. At that point, the write is considered to be complete. Later, the X resource in the secondary zone is automatically updated with the change. This approach is called *asynchronous replication.* Asynchronous replication ensures high performance and throughput. However, any data that hasn't been replicated between availability zones could be lost if the primary zone experiences a failure.

Your service might behave differently to the examples provided above, so adjust or rewrite as much as you need. The accuracy and clarity of this information is critical to our customers, so please make sure you understand and explain the replication process thoroughly. 
-->

### Zone-down experience

The IoT Hub service is responsible for detecting a failure in an availability zone. You don't need to do anything to initiate a zone failover.

During a zone failure, active requests might be dropped. You should have sufficient [retry patterns](../iot/concepts-manage-device-reconnections.md#retry-patterns) implemented to handle transient faults.

A zone failure isn't expected to cause data loss or downtime for your resources.

<!--
- **Traffic rerouting**: For zone-redundant services, explain how the platform recovers, including how traffic is rerouted to the surviving zones. For zonal services, explain how customers should reroute traffic after a zone is lost.

**Example:**
> When a zone is unavailable, IoT Hub detects the loss of the zone and creates new instances in another availability zone. Then, any new requests are automatically spread across all active instances.
-->

### Failback

When the availability zone recovers, IoT Hub automatically restores instances in the availability zone.

### Testing for zone failures  

Azure IoT Hub manages traffic routing, failover, and failback for zone failures. You don't need to initiate anything. Because this feature is fully managed, you don't need to validate availability zone failure processes.

## Multi-region support

Azure IoT Hub uses [Azure region pairs](../reliability/regions-paired.md) to provide resiliency in the rare situation where a datacenter experiences extended outages. 

The disaster recovery (DR) options available in such a situation are:

* **Microsoft-initiated failover:** Microsoft-initiated failover is exercised by Microsoft in rare situations to fail over all of the IoT hubs from an affected region to the corresponding geo-paired region. This process is a default option and requires no intervention from the user. Microsoft reserves the right to make a determination of when this option will be exercised.
* **Manual failover:** You can trigger the failover process yourself. The manual failover option is always available for use whether the primary region is experiencing downtime or not. Therefore, this option could be used to perform planned failovers. For instructions, see [Tutorial: Perform manual failover for an IoT hub](../iot-hub/tutorial-manual-failover.md)
* **Cross-region high availability:** If your business uptime goals aren't satisfied by the recovery time that either failover option provides, consider implementing a per-device cross-region high availability solution instead. In a multi-region model, the solution back end runs primarily in one datacenter location. A secondary IoT hub and back end are deployed in another datacenter location. If the IoT hub in the primary region suffers an outage or the network connectivity from the device to the primary region is interrupted, devices use a secondary service endpoint. For more information, see [Achieve cross-region high availability](../iot-hub/iot-hub-ha-dr.md#achieve-cross-region-ha).

Failover is available for all IoT hub tiers.

| HA/DR option | Recovery time | Requires manual intervention? | Implementation complexity | Cost impact|
| --- | --- | --- | --- | --- |
| Microsoft-initiated failover |2 - 26 hours|No|None|None|
| Manual failover |10 min - 2 hours|Yes|Very low. You only need to trigger this operation from the portal.|None|
| Cross region high availability |< 1 min|No|High|> 1x the cost of 1 IoT hub|

For more information, see [IoT Hub high availability and disaster recovery](../iot-hub/iot-hub-ha-dr.md#cross-region-disaster-recovery).

### Region support 

Microsoft-initiated failover is available in all regions that Azure IoT Hub supports.

Only users deploying IoT hubs to the Brazil South and Southeast Asia (Singapore) regions can opt out of failover. For more information, see [Disable disaster recovery](../iot-hub/iot-hub-ha-dr.md#disable-disaster-recovery).

>[!NOTE]
>Azure IoT Hub doesn't store or process customer data outside of the geography where you deploy the service instance. For more information, see [Azure region pairs](../reliability/regions-paired.md).

### Considerations

IoT Hub failover options offer the following recovery point objectives:

| Data type | Recovery point objectives (RPO) |
| --- | --- |
| Identity registry |0-5 mins data loss |
| Device twin data |0-5 mins data loss |
| Cloud-to-device messages<sup>1</sup> |0-5 mins data loss |
| Parent<sup>1</sup> and device jobs |0-5 mins data loss |
| Device-to-cloud messages |All unread messages are lost |
| Cloud-to-device feedback messages |All unread messages are lost |

<sup>1</sup>Cloud-to-device messages and parent jobs aren't recovered as a part of manual failover.

<!-- 7I. Region down experience   ----------------------

### Region-down experience 

Explain what happens when a region is down. Be precise and clear. Avoid ambiguity in this section, because customers depend on it for their planning purposes. Divide your content into the following sections. You can use the table format if your descriptions are short. Alternatively, you can use a list format.

- **Detection and response** Explain who is responsible for detecting a region is down and for responding, such as by initiating a region failover. Whether your service has customer-managed failover or the service manages it itself, describe it here. 

If your multi-region support depends on another service, commonly Azure Storage, detecting and failing over, explicitly state that, and link to the relevant reliability guide to understand the conditions under which that happens. Be careful with talking about GRS because that doesn't apply in non-paired regions, so explain how things work in that case. 


**Example:**

*For service-initiated detection:*

> IoT Hub is responsible for detecting a failure in a region and automatically failing over to the secondary region.

*For detection that depends on another service:*

>In regions that have pairs, [service name] depends on Azure Storage geo-redundant storage for data replication to the secondary region. Azure Storage detects and initiates a region failover, but it does so only in the event of a catastrophic region loss. This action might be delayed significantly, and during that time your resource might be unavailable. For more information, see [Link to more info].

- **Notification** Explain if there's a way for a customer to find out when a region has been lost. Are there logs? Is there a way to set up an alert? 

**Example:**

> To determine when a region failure occurred, see [logs/alerts/Resource Health/Service Health].

- **Active requests** Explain what happens to any active (inflight) requests.

**Example:**

> Any active requests are dropped and should be retried by the client.

- **Expected data loss** Explain if the customer should expect any data loss during a region failover. Data loss is common during a region failover, so it's important to be clear here. 

**Example:**

> You might lose some data during a region failure if that data isn't yet synchronized to another region.

- **Expected downtime** Explain any expected downtime, such as during a failover operation. 

**Example:**

> Your IoT Hub resource might be unavailable for approximately 2 to 5 minutes during the region failover process.

- **Traffic rerouting** Explain how the platform recovers, including how traffic is rerouted to the surviving region. If appropriate, explain how customers should reroute traffic after a region is lost. 

**Example:**
> When a region failover occurs, IoT Hub updates DNS records to point to the secondary region. All subsequent requests are sent to the secondary region.
-->

<!-- 7J. Failback  ----------------------------------------------------

### Failback

Explain who initiates a failback. Is it customer-initiated or Microsoft-initiated? What does failback involve?

**Example:**

> When the primary region recovers, IoT Hub  automatically restores instances in the region, removes any temporary instances created in the other regions, and reroutes traffic between your instances as normal.

Optional: If there is any possibility of data synchronization issues or inconsistencies during failback, explain that here, as well as what customers can/should do to resolve the situation.
-->

## Backups

For most solutions, you shouldn't rely exclusively on backups. Instead, use the other capabilities described in this guide to support your resiliency requirements. However, backups protect against some risks that other approaches don't.

The IoT Hub service supports bulk export operations to export the entirety of an IoT hub identity registry to an Azure Storage blob container using a shared access signature (SAS). This method enables you to create reliable backups of your device information in a blob container that you control. For more information, see [Import and export IoT Hub device identities in bulk](../iot-hub/iot-hub-bulk-identity-mgmt.md).

You can also export an existing IoT hub's Azure Resource Manager template to create a backup of the IoT hub's state information. For more information, see [Manually migrate an IoT hub using an Azure Resource Manager template](../iot-hub/migrate-hub-arm.md).

## Related content

- [Reliability in Azure](/azure/availability-zones/overview.md)
- [IoT scalability, high availability, and disaster recovery](../iot/iot-overview-scalability-high-availability.md)