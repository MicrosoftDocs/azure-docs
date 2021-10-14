---
title: Migrate deployments and resources to virtual machine scale sets in Flexible orchestration
description: Learn how to migrate deployments and resources to virtual machine scale sets in Flexible orchestration.
author: fitzgeraldsteele
ms.author: fisteele
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: flexible-scale-sets
ms.date: 10/14/2021
ms.reviewer: jushiman
ms.custom: mimckitt, devx-track-azurecli, vmss-flex
---

# Migrate deployments and resources to virtual machine scale sets in Flexible orchestration 

**Applies to:** :heavy_check_mark: Flexible scale sets

Introduction. 

## Update Availability Set deployments templates and scripts to use Flexible scale sets

First, you need to create a virtual machine scale set with no auto scaling profile via [Azure CLI](flexible-virtual-machine-scale-sets-cli.md), [Azure PowerShell](flexible-virtual-machine-scale-sets-powershell.md), or [ARM Template](flexible-virtual-machine-scale-sets-rest-api.md). Azure Portal only allows creating a virtual machine scale set with an autoscaling profile. If you do not want or need autoscaling profile and you want to create using [Azure portal](flexible-virtual-machine-scale-sets-portal.md), you can set the initial capacity to 0. 
 
- You must specify the fault domain count for the virtual machine scale set. For regional (non-zonal) deployments, virtual machine scale sets offers the same fault domain guarantees as availability sets. However, you can scale up to 1000 instances. Update domains have been deprecated in Flexible Orchestration mode. Most platform updates with general purpose SKUs are performed with Live Migration and do not require instance reboot. On the occasion that a platform maintenance requires instances to be rebooted, updates are applied fault domain by fault domain.  
    
- Flexible orchestration for virtual machine scale sets also supports deploying instances across multiple availability zones. You may consider updating your VM deployments to spread across multiple availability zones. 

Next, create a virtual machine. Instead of specifying an availability set, specify the virtual machine scale set. Optionally, you can specify the availability zone or fault domain in which you wish to place the VM. 

- CLI example, PowerShell example, Portal screenshot 

## Update Uniform deployment templates and scripts

Update Uniform virtual machine scale sets deployment templates and scripts to use Flexible orchestration. 

1. Remove `LoadBalancerNATPool` (not valid for flex) 

1. Remove overprovisioning parameter (not valid for flex) 

1. Remove `upgradePolicy` (not valid for flex, yet) 

1. Update compute API version to **2021-03-01** 

1. Add orchestration mode `flexible` 

1. `platformFaultDomainCount` required 

1. `singlePlacementGroup`=false required 

1. Add network API version to **2021-11-01** or higher 

1. Set IP `configuration.properties.primary` to *true* (required for Outbound rules)



















## Next steps
> [!div class="nextstepaction"]
> [Compare the API differences between Uniform and Flexible orchestration modes.](../virtual-machine-scale-sets/orchestration-modes-api-comparison.md)