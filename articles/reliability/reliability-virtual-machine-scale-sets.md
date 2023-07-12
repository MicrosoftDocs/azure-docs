---
title: Reliability in Azure Virtual Machine Scale Sets
description: Find out about reliability in Azure Virtual Machine Scale Sets
author: anaharris-ms
ms.author: anaharris
ms.topic: overview
ms.custom: subject-reliability
ms.service: virtual-machine-scale-sets
ms.date: 06/12/2023
---

# Reliability in Virtual Machine Scale Sets

This article contains [specific reliability recommendations for Virtual Machine Scale Sets](#reliability-recommendations), as well as detailed information on VMSS regional resiliency with [availability zones](#availability-zone-support) and [cross-region resiliency with disaster recovery](#disaster-recovery-cross-region-failover). 

For an architectural overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).


## Reliability recommendations

[!INCLUDE [Reliability recommendations](../reliability/includes/reliability-recommendations-include.md)]

### Reliability recommendations summary

| Category | Priority |Recommendation |  
|---------------|--------|---|
| [**Scalability**](#scalablity) |:::image type="icon" source="../reliability/media/icon-recommendation-medium.svg":::| [VMSS-1: Deploy using Flexible scale set instead of simple Virtual Machines](#-vm-1-run-production-workloads-on-two-or-more-vms-using-vmss-flex) |
| |:::image type="icon" source="../reliability/media/icon-recommendation-high.svg":::| [VMSS-5: VMSS Autoscale is set to Manual scale](#-vm-1-run-production-workloads-on-two-or-more-vms-using-vmss-flex) |
| |:::image type="icon" source="../reliability/media/icon-recommendation-low.svg":::| [VMSS-6: VMSS Custom scale-in policies is not set to default](#-vm-1-run-production-workloads-on-two-or-more-vms-using-vmss-flex) |
| [**High Availability**](#high-availability) |:::image type="icon" source="../reliability/media/icon-recommendation-high.svg":::| [VMSS-4: Automatic repair policy is not enabled](#-vm-1-run-production-workloads-on-two-or-more-vms-using-vmss-flex) |
| [**Disaster Recovery**](#distaster-recovery) |:::image type="icon" source="../reliability/media/icon-recommendation-low.svg":::| [VMSS-2: Protection Policy is disabled for all VMSS instances](#-vm-1-run-production-workloads-on-two-or-more-vms-using-vmss-flex) |
| [**Monitoring**](#monitoring) |:::image type="icon" source="../reliability/media/icon-recommendation-medium.svg":::| [VMSS-3: VMSS Application health monitoring is not enabled](#-vm-1-run-production-workloads-on-two-or-more-vms-using-vmss-flex) |


### Scalability

#### :::image type="icon" source="../reliability/media/icon-recommendation-medium.svg"::: **VMSS-1: Deploy using Flexible scale set instead of simple Virtual Machines** 

Even single instance VMs should be deployed into a scale set using the Flexible orchestration mode to future-proof your application for scaling and availability. Flexible orchestration offers high availability guarantees (up to 1000 VMs) by spreading VMs across fault domains in a region or within an Availability Zone.

# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machine-scale-sets/code/vmss-1/vmss-1.kql":::

----

#### :::image type="icon" source="../reliability/media/icon-recommendation-high.svg"::: **VMSS-5: VMSS Autoscale is set to Manual scale** 

Use VMSS Protection Policy in case you want specific instances to be treated differently from the rest of the scale set instance.

As your application processes traffic, there can be situations where you want specific instances to be treated differently from the rest of the scale set instance. For example, certain instances in the scale set could be performing long-running operations, and you don’t want these instances to be scaled-in until the operations complete. You might also have specialized a few instances in the scale set to perform additional or different tasks than the other members of the scale set. You require these ‘special’ VMs not to be modified with the other instances in the scale set. Instance protection provides the additional controls to enable these and other scenarios for your application.

# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machine-scale-sets/code/vmss-5/vmss-5.kql":::

----


#### :::image type="icon" source="../reliability/media/icon-recommendation-low.svg"::: **VMSS-6: VMSS Custom scale-in policies is not set to default** 

The default custom scale-in policy provides the best algorithm and flexibility for the majority of the scenarios. Use the Newest and Oldest policies when workload requires oldest or newest VMs to be deleted.

A Virtual Machine Scale Set deployment can be scaled-out or scaled-in based on an array of metrics, including platform and user-defined custom metrics. While a scale-out creates new virtual machines based on the scale set model, a scale-in affects running virtual machines that may have different configurations and/or functions as the scale set workload evolves.

Users do not need to specify a scale-in policy if they just want the default ordering to be followed.

Note that balancing across availability zones or fault domains does not move instances across availability zones or fault domains. The balancing is achieved through deletion of virtual machines from the unbalanced availability zones or fault domains until the distribution of virtual machines becomes balanced.

The scale-in policy feature provides users a way to configure the order in which virtual machines are scaled-in, by way of three scale-in configurations:

- Default
- NewestVM
- OldestVM

# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machine-scale-sets/code/vmss-6/vmss-6.kql":::

----

### High availability

#### :::image type="icon" source="../reliability/media/icon-recommendation-high.svg"::: **VMSS-4: Automatic repair policy is not enabled** 

Enabling automatic instance repairs for Azure Virtual Machine Scale Sets helps achieve high availability for applications by maintaining a set of healthy instances. The Application Health extension or Load balancer health probes may find that an instance is unhealthy. Automatic instance repairs will automatically perform instance repairs by deleting the unhealthy instance and creating a new one to replace it.

Grace period is specified in minutes in ISO 8601 format and can be set using the property automaticRepairsPolicy.gracePeriod. Grace period can range between 10 minutes and 90 minutes, and has a default value of 30 minutes.

# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machine-scale-sets/code/vmss-4/vmss-4.kql":::

----

### Disaster recovery

#### :::image type="icon" source="../reliability/media/icon-recommendation-low.svg"::: **VMSS-2: Protection Policy is disabled for all VMSS instances** 

Use VMSS Protection Policy in case you want specific instances to be treated differently from the rest of the scale set instance.

As your application processes traffic, there can be situations where you want specific instances to be treated differently from the rest of the scale set instance. For example, certain instances in the scale set could be performing long-running operations, and you don’t want these instances to be scaled-in until the operations complete. You might also have specialized a few instances in the scale set to perform additional or different tasks than the other members of the scale set. You require these ‘special’ VMs not to be modified with the other instances in the scale set. Instance protection provides the additional controls to enable these and other scenarios for your application.

# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machine-scale-sets/code/vmss-2/vmss-2.kql":::

----
### Monitoring

#### :::image type="icon" source="../reliability/media/icon-recommendation-medium.svg"::: **VMSS-3: VMSS Application health monitoring is not enabled** 

Monitoring your application health is an important signal for managing and upgrading your deployment. Azure Virtual Machine Scale Sets provide support for Rolling Upgrades including Automatic OS-Image Upgrades and Automatic VM Guest Patching, which rely on health monitoring of the individual instances to upgrade your deployment. You can also use Application Health Extension to monitor the application health of each instance in your scale set and perform instance repairs using Automatic Instance Repairs.


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machine-scale-sets/code/vm-3/vm-3.kql":::

----

## Availability zone support

Azure availability zones are at least three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. In the case of a local zone failure, availability zones are designed so that if the one zone is affected, regional services, capacity, and high availability are supported by the remaining two zones.

Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. For more detailed information on availability zones in Azure, see [Regions and availability zones](/azure/availability-zones/az-overview).

Azure availability zones-enabled services are designed to provide the right level of reliability and flexibility. They can be configured in two ways. They can be either zone redundant, with automatic replication across zones, or zonal, with instances pinned to a specific zone. You can also combine these approaches. For more information on zonal vs. zone-redundant architecture, see [Build solutions with availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability).

With [Azure virtual machine scale sets](flexible-virtual-machine-scale-sets.md) you can create and manage a group of load balanced VMs. The number of VM instances can automatically increase or decrease in response to demand or a defined schedule. Scale sets provide high availability to your applications, and allow you to centrally manage, configure, and update many VMs. There's no cost for the scale set itself. You only pay for each VM instance that you create.

Virtual machines in a scale set can be deployed into multiple availability zones, a single availability zone, or regionally. Availability zone deployment options may differ based on the [orchestration mode](../virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes.md?context=/azure/virtual-machines/context/context).
