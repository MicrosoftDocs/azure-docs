---
title: Reliability in Azure Device Registry
description: Find out about reliability in Azure Device Registry, including availability zones and multi-region deployments.
author: isabellaecr, rohankhandelwal, marcodalessandro
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: azure-device-registry
ms.date: 10/25/2024
---

# Reliability in Azure Device Registry

This article describes reliability support in Azure Device Registry (ADR) and covers both intra-regional resiliency with [availability zones](#availability-zone-support) and information on [multi-region deployments](#multi-region-support).

Because resiliency is a shared responsibility between you and Microsoft, this article also covers ways for you to build a resilient solution that meets your needs.



## Production deployment recommendations

For production deployments, you should:

 - Use standard or premium Azure Bastion resources. While the basic SKU supports zone redundancy, we don't recommend it for production use.
 - [Enable zone redundancy](#availability-zone-support) (in preview), if your Azure Bastion resources are in a supported region.

## Transient faults

Transient faults are short, intermittent failures in components. They occur frequently in a distributed environment like the cloud, and they're a normal part of operations. They correct themselves after a short period of time. It's important that your applications handle transient faults, usually by retrying affected requests.

If transient faults affect your virtual machine or Azure Bastion host, clients using the secure sockets host (SSH) and remote desktop connection (RDP) protocols typically retry automatically.

## Availability zone support

Azure Device Registry is zone-redundant, which means that it automatically replicates across multiple [availability zones](../reliability/availability-zones-overview.md). This setup enhances the resiliency of the service by providing high availability. In the event of a failure in one zone, the service can continue to operate seamlessly from another zone. 

Microsoft manages setup and configuration for zone redundancy in Azure Device Registry. You do not need to perform any additional configuration to enable this zone redundancy. Microsoft ensures that the service is configured to provide the highest level of availability and reliability. 

### Requirements

Azure Device Registry has only one default SKU.

### Regions supported

The following list of regions support availability zones in Azure Device Registry:


| Americas         | Europe               | Middle East   | Africa             | Asia Pacific   |
|------------------|----------------------|---------------|--------------------|----------------|
| East US          | North Europe         |               |                    |                |
| East US 2        | West Europe          |               |                    |                |
| West US 2        |                      |               |                    |                |
| West US 3        |                      |               |                    |                |


### Cost

There's no additional cost to use zone redundancy for Azure Device Registry.

### Configure availability zone support

**New resources:**  When you create an Azure Device Registry resource, it automatically includes zone-redundancy by default. There's no need for you to perform any additional configuration. 


<!-- Do we need this? -->
In Azure IoT Operations, when you create an asset in the operations experience web UI or by using the Azure IoT Operations CLI extension, that asset is defined and created as an Azure resource in Azure Device Registry.  

For detailed instructions on how to create an ADR resource in the cloud using Azure IoT Operations, see [Manage asset configurations remotely](/azure/iot-operations/discover-manage-assets/howto-manage-assets-remotely?tabs=portal). 

### Data replication between zones

Azure Device Registry zonal data replication is managed by Azure CosmosDB. Azure Device Registry doesn't provide any additional configuration options for data replication. Cosmos DB by default synchronously replicates across zones and so there's an RPO of 0 for a zone failure.For more information on geographical data replication in CosmosDB, see [Reliability in CosmosDB](./reliability-cosmos-db-nosql.md).

### Traffic routing between zones

When you initiate an SSH or RDP session, it can be routed to an Azure Bastion instance in any of the availability zones you selected.

It's possible that a session might be sent to an Azure Bastion instance in an availability zone that's different from the virtual machine you're connecting to. In the following diagram, a request from the user is sent to an Azure Bastion instance in zone 2, while the virtual machine is in zone 1:

:::image type="content" source="./media/reliability-bastion/bastion-cross-zone.png" alt-text="Diagram that shows Azure Bastion with three instances. A user request goes to an Azure Bastion instance in zone 2 and is sent to a virtual machine in zone 1." border="false":::

In most scenarios, the small amount of cross-zone latency isn't significant. However, if you have unusually stringent latency requirements for your Azure Bastion workloads, you should deploy a dedicated single-zone Azure Bastion instance in the virtual machine's availability zone. However, this configuration doesn't provide zone redundancy, and we don't recommend it for most customers.

### Zone-down experience

During a zone-wide outage, you don't need to take any action to failover to a healthy zone. The service automatically self-heals and re-balances itself to take advantage of the healthy zone automatically.

**Detection and response:**  Because Azure Device Registry detects and responds automatically to failures in an availability zone, you don't need to do anything to initiate an availability zone failover.

<!-- Need? -->
**Active requests:** When an availability zone is unavailable, any RDP or SSH connections in progress that use an Azure Bastion instance in the faulty availability zone are terminated and need to be retried.

<!-- Need? -->
**Traffic rerouting:** New connections use Azure Bastion instances in the surviving availability zones. Overall, Azure Bastion continues to remain operational.

### Failback

<!-- What happens? -->

When the availability zone recovers, Azure Device Registry:

- Automatically restores instances in the availability zone.
- Removes any temporary instances created in the other availability zones
- Reroutes traffic between your instances as normal.

### Testing for zone failures

<!-- is this okay to say? -->
The Azure Device Registry platform manages traffic routing, failover, and failback for zone-redundant Azure Device Registry resources. Because this feature is fully managed, you don't need to initiate anything or validate availability zone failure processes.

## Multi-region support

Azure Device Registry is a regional service with geographical data replication. In a region-wide outage, Microsoft initiates compute failover from one region to another. If Azure Device Registry fails over, it continues to support its primary region, and no additional actions by you are required. 

When using Azure IoT Operations (AIO), Azure Device Registry projects assets as Azure resources in the cloud within a single registry, providing a single source of truth for asset metadata and asset management capabilities. However, AIO includes various other components beyond ADR. For detailed information on AIO-specific components' high availability and zero data loss features, refer to [Azure IoT Operations frequently asked questions](https://learn.microsoft.com/en-us/azure/iot-operations/troubleshoot/iot-operations-faq#does-azure-iot-operations-offer-high-availability-and-zero-data-loss-features-). 

## Region support

Azure Device Registry multi-region redundancy is only supported in paired regions. To see a list of paired regions, see [Azure Paired Regions](./cross-region-replication-azure.md#azure-paired-regions)

### Data replication between regions


Azure Device Registry cross-region data replication is managed by Azure CosmosDB. Azure Device Registry doesn't provide any additional configuration options for data replication. Cosmos DB by default synchronously replicates across regions and so there's an RPO of 0 for a zone failure. For more information on geographical data replication in CosmosDB, see [Reliability in CosmosDB](./reliability-cosmos-db-nosql.md).


### Region down experience

During a region outage, Microsoft adheres to the Recovery Time Objective (RTO) to recover the service. During this time, the customer can expect some service interruption until the service is fully recovered.  

In a complete region loss scenario, you can expect a manual recovery from Microsoft. 

<!-- Why 15 minutes?-->
For Azure Device Registry, recovery Time Objective (RTO) is approximately 24 hours. For Recovery Point Objective (RPO), you can expect less than 15 minutes.


## Service-level agreement (SLA)

The service-level agreement (SLA) for Azure Device Registry describes the expected availability of the service, and the conditions that must be met to achieve that availability expectation. To understand those conditions, it's important that you review the [Service Level Agreements (SLA) for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).


## Related content


- [What is Azure IoT Operations? - Azure IoT Operations Preview](https://learn.microsoft.com/en-us/azure/iot-operations/overview-iot-operations) 

- [Reliability in Azure](/azure/availability-zones/overview)
