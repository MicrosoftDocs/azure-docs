---
title: Availability Overview 
description: Learn about the availability features for running virtual machines in Azure
author: cynthn
ms.author: cynthn
ms.service: virtual-machines
ms.topic: conceptual
ms.date: 02/18/2021
---
    
# Availability options for Azure Virtual Machines
This article provides you with an overview of the availability features of Azure virtual machines (VMs).

## Availability zones

[Availability zones](../availability-zones/az-overview.md) expand the level of control you have to maintain the availability of the applications and data on your VMs. An Availability Zone is a physically separate zone, within an Azure region. There are three Availability Zones per supported Azure region. 

Each Availability Zone has a distinct power source, network, and cooling. By architecting your solutions to use replicated VMs in zones, you can protect your apps and data from the loss of a datacenter. If one zone is compromised, then replicated apps and data are instantly available in another zone. 

![Availability zones](./media/virtual-machines-common-regions-and-availability/three-zones-per-region.png)

Learn more about deploying a [Windows](./windows/create-powershell-availability-zone.md) or [Linux](./linux/create-cli-availability-zone.md) VM in an Availability Zone.


## Availability sets
An availability set is a logical grouping of VMs that allows Azure to understand how your application is built to provide for redundancy and availability. We recommended that two or more VMs are created within an availability set to provide for a highly available application and to meet the [99.95% Azure SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/). There is no cost for the Availability Set itself, you only pay for each VM instance that you create. When a single VM is using [Azure premium SSDs](./disks-types.md#premium-ssd), the Azure SLA applies for unplanned maintenance events.

Each virtual machine in your availability set is assigned an **update domain** and a **fault domain** by the underlying Azure platform. For a given availability set, five non-user-configurable update domains are assigned by default (Resource Manager deployments can then be increased to provide up to 20 update domains) to indicate groups of virtual machines and underlying physical hardware that can be rebooted at the same time. When more than five virtual machines are configured within a single availability set, the sixth virtual machine is placed into the same update domain as the first virtual machine, the seventh in the same update domain as the second virtual machine, and so on. The order of update domains being rebooted may not proceed sequentially during planned maintenance, but only one update domain is rebooted at a time. A rebooted update domain is given 30 minutes to recover before maintenance is initiated on a different update domain.

Fault domains define the group of virtual machines that share a common power source and network switch. By default, the virtual machines configured within your availability set are separated across up to three fault domains for Resource Manager deployments (two fault domains for Classic). While placing your virtual machines into an availability set does not protect your application from operating system or application-specific failures, it does limit the impact of potential physical hardware failures, network outages, or power interruptions.

![Availability sets](./media/virtual-machines-common-manage-availability/ud-fd-configuration.png)



## Load balancer
Combine the [Azure Load Balancer](../load-balancer/load-balancer-overview.md) with an availability zone or set to get the most application resiliency. The Azure Load Balancer distributes traffic between multiple virtual machines. For our Standard tier virtual machines, the Azure Load Balancer is included. Not all virtual machine tiers include the Azure Load Balancer. For more information about load balancing your virtual machines, see **Load Balancing virtual machines** for [Linux](linux/tutorial-load-balancer.md) or [Windows](windows/tutorial-load-balancer.md).

If the load balancer is not configured to balance traffic across multiple virtual machines, then any planned maintenance event affects the only traffic-serving virtual machine, causing an outage to your application tier. Placing multiple virtual machines of the same tier under the same load balancer and availability set enables traffic to be continuously served by at least one instance.

For a tutorial on how to load balance across availability zones, see [Tutorial: Load balance VMs across availability zones with a Standard Load Balancer using the Azure portal](../load-balancer/tutorial-load-balancer-standard-public-zone-redundant-portal.md).


## Virtual Machines Scale Sets 

Azure virtual machine scale sets let you create and manage a group of load balanced VMs. The number of VM instances can automatically increase or decrease in response to demand or a defined schedule. Scale sets provide high availability to your applications, and allow you to centrally manage, configure, and update many VMs. We recommended that two or more VMs are created within a scale set to provide for a highly available application and to meet the [99.95% Azure SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/). There is no cost for the scale set itself, you only pay for each VM instance that you create. When a single VM is using [Azure premium SSDs](./disks-types.md#premium-ssd), the Azure SLA applies for unplanned maintenance events. Virtual machines in a scale set can be deployed across multiple update domains and fault domains to maximize availability and resilience to outages due to data center outages, and planned or unplanned maintenance events. Virtual machines in a scale set can also be deployed into a single Availability zone, or regionally. Availability zone deployment options may differ based on the orchestration mode.

## Next steps
You can now start to use these availability and redundancy features to build your Azure environment. For best practices information, see [Azure availability best practices](/azure/architecture/checklist/resiliency-per-service).
