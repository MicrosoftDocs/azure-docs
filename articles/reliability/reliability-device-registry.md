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

<!-- Can we verify the branding? I can't see "Azure Device Registry" in any other docs. It seems like it's part of IoT Operations - should it be branded as part of that instead? -->

This article describes reliability support in Azure Device Registry. It covers both intra-regional resiliency with [availability zones](#availability-zone-support) and information on [multi-region deployments](#multi-region-support).

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

## Transient faults

<!-- Is there any other information we should give here? For example, do clients typically interact with this service through an SDK - and if so does it handle transient faults autoatically? We should state that if so. -->

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure Device Registry is zone redundant by default, which means that it automatically replicates your data across multiple [availability zones](../reliability/availability-zones-overview.md). This setup enhances the resiliency of the service by providing high availability. If there's a failure in one zone, the service can continue to operate seamlessly from another zone.

Microsoft manages setup and configuration for zone redundancy in Azure Device Registry. You don't need to perform any more configuration to enable this zone redundancy. Microsoft ensures that the service is configured to provide the highest level of availability and reliability.

### Regions supported

The following list of regions support availability zones in Azure Device Registry:

<!-- Anastasia - style question: should we remove the empty columns? -->

| Americas         | Europe               | Middle East   | Africa             | Asia Pacific   |
|------------------|----------------------|---------------|--------------------|----------------|
| East US          | North Europe         |               |                    |                |
| East US 2        | West Europe          |               |                    |                |
| West US 2        |                      |               |                    |                |
| West US 3        |                      |               |                    |                |

### Cost

There's no extra cost to use zone redundancy for Azure Device Registry.

### Configure availability zone support

**New resources:** When you create an Azure Device Registry resource in Azure IoT Operations, it automatically includes zone-redundancy by default. There's no need for you to perform any more configuration.

### Normal operations

The following information describes what happens when you have a zone-redundant device registry and all availability zones are operational:

- **Traffic routing between zones:** Requests are automatically spread across each availability zone. A request might go to a Device Registry instance in any availability zone. <!-- Need to verify -->

- **Data replication between zones:** Device data is replicated synchronously across availability zones.

### Zone-down experience

The following information describes what happens when you have a zone-redundant device registry and an availability zone experiences an outage.

- **Detection and response:** Because Azure Device Registry detects and responds automatically to failures in an availability zone, you don't need to do anything to initiate an availability zone failover.

- **Active requests:** Any active requests could be dropped and might need to be retried. Follow [transient fault handling guidance](#transient-faults) to ensure your application is resilient to any transient faults.

- **Expected data loss:** A zone failure isn't expected to cause any data loss.

- **Expected downtime:** A zone failure isn't expected to cause downtime to your resources.

### Failback

When the availability zone recovers, Azure Device Registry automatically restores operations in the availability zone.

### Testing for zone failures

The Azure Device Registry platform manages traffic routing, failover, and failback across availability zones. You don't need to initiate anything. Because this feature is fully managed, you don't need to validate availability zone failure processes.

## Multi-region support

<!--

This section is extremely vague.

1. Does this capability depend on paired regions? (All the regions listed above are paired, so I assume yes - but we need to be explicit about the secondary region being the pair.)
2. What does this mean - "If Azure Device Registry fails over, it continues to support its primary region"? How can it continue to support its primary region if the primary region is unavailable?

-->

Azure Device Registry is a regional service with automatic geographical data replication. In a region-wide outage, Microsoft initiates compute failover from one region to another. If Azure Device Registry fails over, it continues to support its primary region, and no more actions by you are required.

When using Azure IoT Operations (Azure IoT Operations), Azure Device Registry projects assets as Azure resources in the cloud within a single registry. The single registry is a source of truth for asset metadata and asset management capabilities. However, Azure IoT Operations includes various other components beyond Azure Device Registry. For detailed information on the high availability and zero data loss features of Azure IoT Operations components, refer to [Azure IoT Operations frequently asked questions](/azure/iot-operations/troubleshoot/iot-operations-faq#does-azure-iot-operations-offer-high-availability-and-zero-data-loss-features-).

### Region down experience

<!-- Let's frame this in terms of "expected downtime" and "expected data loss" instead of "RTO" and "RPO". -->

During a region outage, Microsoft adheres to the Recovery Time Objective (RTO) to recover the service. During this time, the customer can expect some service interruption until the service is fully recovered.

In a complete region loss scenario, you can expect a manual recovery from Microsoft.

For Azure Device Registry, Recovery Time Objective (RTO) is approximately 24 hours. For Recovery Point Objective (RPO), you can expect less than 15 minutes.

<!-- Is there any guidance for what to do if this capability doesn't meet a customer's needs - e.g. if you a customer has no tolerance for downtime or data loss? Are there approaches a customer could follow to geo-replicate the data themselves, by provisioning multiple registries? Or would this be too hard to keep in sync? -->

<!-- Is there any way to back up/restore device registry data? -->

## Service-level agreement (SLA)

<!-- Does this service actually have an SLA? If so, where in the SLA document is this service? I can't see it, either as "IoT Operations" or "Device Registry". -->

The service-level agreement (SLA) for Azure Device Registry describes the expected availability of the service, and the conditions that must be met to achieve that availability expectation. To understand those conditions, it's important that you review the [Service Level Agreements (SLA) for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

## Related content

- [What is Azure IoT Operations? - Azure IoT Operations](/azure/iot-operations/overview-iot-operations)

- [Reliability in Azure](/azure/reliability/overview)
