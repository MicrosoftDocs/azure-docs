---
title: Reliability in Azure Device Registry
description: Learn about resiliency in Azure Device Registry, including resilience to transient faults, availability zone failures, and region-wide failures.
author: isabellaecr
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-device-registry
ms.date: 07/30/2025
---

# Reliability in Azure Device Registry

[Azure Device Registry](/azure/iot-operations/discover-manage-assets/overview-manage-assets) stores information about assets and devices in the cloud. Device Registry projects assets as Azure resources in the cloud within a single registry. The single registry is a source of truth for device and asset metadata, and asset management capabilities. Device Registry can be used in conjunction with [Azure IoT Operations](/azure/iot-operations/overview-iot-operations).

[!INCLUDE [Shared responsibility](includes/reliability-shared-responsibility-include.md)]

This article describes how to make Device Registry resilient to a variety of potential outages and problems, including transient faults, availability zone outages, and region outages.

> [!NOTE]
> Azure IoT Operations includes various other components beyond Device Registry. For detailed information on the high availability and zero data loss features of Azure IoT Operations components, refer to [Azure IoT Operations frequently asked questions](/azure/iot-operations/troubleshoot/iot-operations-faq).

## Resilience to transient faults

[!INCLUDE [Resilience to transient faults](includes/reliability-transient-fault-description-include.md)]

Clients interact with Device Registry by using Azure Resource Manager. Commonly, you use the Azure portal, Azure CLI, or Azure SDKs to interact with Device Registry resources, and these tools provide automatic handling of transient faults. If you use the Resource Manager APIs directly, make sure to handle transient faults.

## Resilience to availability zone failures

[!INCLUDE [Resilience to availability zone failures](includes/reliability-availability-zone-description-include.md)]

Azure Device Registry is zone redundant by default, which means that it automatically replicates your data across multiple [availability zones](../reliability/availability-zones-overview.md). This setup enhances the resiliency of the service by providing high availability. If there's a failure in one zone, the service can continue to operate seamlessly from another zone.

Microsoft manages setup and configuration for zone redundancy in Azure Device Registry. You don't need to perform any more configuration to enable this zone redundancy. Microsoft ensures that the service is configured to provide the highest level of availability and reliability.

### Region support

The following list of regions support availability zones in Device Registry:

[!INCLUDE [Azure Device Registry availability zone region support](../iot-operations/includes/device-registry-availability-zone-regions-include.md)]

### Cost

There's no extra cost to use zone redundancy for Device Registry.

### Configure availability zone support

**New resources:** When you create a Device Registry resource in Azure IoT Operations, it automatically includes zone-redundancy by default. There's no need for you to perform any more configuration.

### Behavior when all zones are healthy

The following information describes what happens when you have a zone-redundant device registry and all availability zones are operational:

- **Traffic routing between zones:** Requests are automatically spread across each availability zone. A request might go to a Device Registry instance in any availability zone.

- **Data replication between zones:** Device data is replicated synchronously across availability zones.

### Behavior during a zone failure

The following information describes what happens when you have a zone-redundant device registry and an availability zone experiences an outage.

- **Detection and response:** Because Device Registry detects and responds automatically to failures in an availability zone, you don't need to do anything to initiate an availability zone failover.

[!INCLUDE [Availability zone down notification (Service Health only)](./includes/reliability-availability-zone-down-notification-service-include.md)]

- **Active requests:** Some active requests may be dropped and so may need to be retried in the same way as other transient faults. To make sure that your application is resilient to any transient faults, see [Resilience to transient faults](#resilience-to-transient-faults).

- **Expected data loss:** A zone failure isn't expected to cause any data loss.

- **Expected downtime:** A zone failure isn't expected to cause downtime to your resources.

### Zone recovery

When the availability zone recovers, Device Registry automatically restores operations in the availability zone.

### Test for zone failures

The Device Registry platform manages traffic routing, failover, and failback across availability zones. You don't need to initiate anything. Because this feature is fully managed, you don't need to validate availability zone failure processes.

## Resilience to region-wide failures

Device Registry is a single-region service. If the region becomes unavailable, your Device Registry resources are also unavailable.

However, your registry's data is replicated to the paired region. In the event of a prolonged region outage, Microsoft might elect to fail over to the paired region. If this happens, your registry continues to be available in the paired region.

### Region support

Default replication and failover is supported in all regions that Device Registry is available in, because [all of these regions are paired](./regions-paired.md).

### Cost

There's no extra cost for cross-region data replication or failover.

### Configure replication and prepare for failover

By default, cross-region data replication is automatically configured when you create Device Registry resources in a region with a pair. This process is a default option and requires no intervention from you.

### Behavior when all regions are healthy

This section describes what to expect when a device registry is configured for cross-region replication and failover, and the primary region is operational.

- **Data replication between regions:** Data is replicated automatically to the paired region. Replication occurs asynchronously, which means that some data loss is expected if a failover occurs.

- **Traffic routing between regions:** In normal operations, traffic only flows to the primary region.

### Behavior during a region failure

This section describes what to expect when a device registry is configured for cross-region replication and failover and there's an outage in the primary region.

- **Detection and response:** Microsoft can decide to perform a failover if the primary region is lost. This process can take several hours after the loss of the primary region, or even longer in some scenarios. Failover of Device Registry resources might not occur at the same time as other Azure services.

- **Notification:** Region failure events can be monitored through Azure Service Health. Set up alerts to receive notifications of region-level issues.

- **Active requests:** Any requests that the primary region is processing during a failover are likely to be lost. Clients should retry requests after failover completes.

- **Expected data loss:** Data is replicated asynchronously to the paired region. As a result, some data loss is expected after failover. You can expect less than 15 minutes of data loss following a region failover.

- **Expected downtime:** Expect approximately 24 hours of downtime from when the region is lost to when the resource is available in the paired region.

- **Traffic rerouting:** During the failover process, Device Registry updates DNS records to point to the paired region. All subsequent requests are sent to the paired region.

    After the failover operation for the registry completes, all operations from the device and back-end applications are expected to continue working without requiring manual intervention.

### Region recovery

When the primary region recovers, Device Registry automatically restores operations in the region.

### Test for region failures

The Device Registry platform manages traffic routing, failover, and failback across paired regions. You don't need to initiate anything. Because this feature is fully managed, you don't need to validate paired region failure processes.

## Related content

- [What is Azure IoT Operations? - Azure IoT Operations](/azure/iot-operations/overview-iot-operations)

- [Reliability in Azure](/azure/reliability/overview)
