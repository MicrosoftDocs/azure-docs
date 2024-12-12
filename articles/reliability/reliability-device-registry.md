---
title: Reliability in Azure Device Registry
description: Find out about reliability in Azure Device Registry, including availability zones and multi-region deployments.
author: isabellaecr 
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: azure-device-registry
ms.date: 11/19/2024 
---

# Reliability in Azure Device Registry

This article describes reliability support in Azure Device Registry. It covers both intra-regional resiliency with [availability zones](#availability-zone-support) and information on [multi-region deployments](#multi-region-support).

Because resiliency is a shared responsibility between you and Microsoft, this article also covers ways for you to build a resilient solution that meets your needs.


## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]


## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure Device Registry is zone-redundant, which means that it automatically replicates across multiple [availability zones](../reliability/availability-zones-overview.md). This setup enhances the resiliency of the service by providing high availability. If there's a failure in one zone, the service can continue to operate seamlessly from another zone. 

Microsoft manages setup and configuration for zone redundancy in Azure Device Registry. You don't need to perform any more configuration to enable this zone redundancy. Microsoft ensures that the service is configured to provide the highest level of availability and reliability. 

### Regions supported

The following list of regions support availability zones in Azure Device Registry:


| Americas         | Europe               | Middle East   | Africa             | Asia Pacific   |
|------------------|----------------------|---------------|--------------------|----------------|
| East US          | North Europe         |               |                    |                |
| East US 2        | West Europe          |               |                    |                |
| West US 2        |                      |               |                    |                |
| West US 3        |                      |               |                    |                |


### Cost

There's no extra cost to use zone redundancy for Azure Device Registry.

### Configure availability zone support

**New resources:**  When you create an Azure Device Registry resource in Azure IoT Operations, it automatically includes zone-redundancy by default. There's no need for you to perform any more configuration. 


### Zone-down experience

During a zone-wide outage, you don't need to take any action to fail over to a healthy zone. The service automatically self-heals and rebalances itself to take advantage of the healthy zone automatically.

**Detection and response:**  Because Azure Device Registry detects and responds automatically to failures in an availability zone, you don't need to do anything to initiate an availability zone failover.


## Multi-region support

Azure Device Registry is a regional service with automatic geographical data replication. In a region-wide outage, Microsoft initiates compute failover from one region to another. If Azure Device Registry fails over, it continues to support its primary region, and no more actions by you're required. 

When using Azure IoT Operations (Azure IoT Operations), Azure Device Registry projects assets as Azure resources in the cloud within a single registry. The single registry is a source of truth for asset metadata and asset management capabilities. However, Azure IoT Operations includes various other components beyond Azure Device Registry. For detailed information on the high availability and zero data loss features of Azure IoT Operations components, refer to [Azure IoT Operations frequently asked questions](/azure/iot-operations/troubleshoot/iot-operations-faq#does-azure-iot-operations-offer-high-availability-and-zero-data-loss-features-). 


### Region down experience

During a region outage, Microsoft adheres to the Recovery Time Objective (RTO) to recover the service. During this time, the customer can expect some service interruption until the service is fully recovered.  

In a complete region loss scenario, you can expect a manual recovery from Microsoft. 


For Azure Device Registry, Recovery Time Objective (RTO) is approximately 24 hours. For Recovery Point Objective (RPO), you can expect less than 15 minutes.


## Service-level agreement (SLA)

The service-level agreement (SLA) for Azure Device Registry describes the expected availability of the service, and the conditions that must be met to achieve that availability expectation. To understand those conditions, it's important that you review the [Service Level Agreements (SLA) for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).


## Related content


- [What is Azure IoT Operations? - Azure IoT Operations](/azure/iot-operations/overview-iot-operations) 

- [Reliability in Azure](/azure/reliability/overview)
