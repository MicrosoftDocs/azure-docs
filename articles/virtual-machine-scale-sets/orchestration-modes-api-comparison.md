---
title: Orchestration modes API comparison 
description: Learn about the API differences between the Uniform and Flexible orchestration modes.
author: fitzgeraldsteele
ms.author: fisteele
ms.topic: conceptual
ms.service: virtual-machine-scale-sets
ms.date: 11/22/2022
ms.reviewer: jushiman
ms.custom: mimckitt, vmss-flex
---

# Orchestration modes API comparison 

> [!NOTE]
> We recommend using Flexible Virtual Machine Scale Sets for new workloads. Learn more about this new orchestration mode in our [Flexible Virtual Machine Scale Sets overview](flexible-virtual-machine-scale-sets.md).

This article compares the API differences between Uniform and [Flexible orchestration](..\virtual-machines\flexible-virtual-machine-scale-sets.md) modes for Virtual Machine Scale Sets. To learn more about Uniform and Flexible Virtual Machine Scale Sets, see [orchestration modes](virtual-machine-scale-sets-orchestration-modes.md).


## Instance view

| Uniform API | Flexible alternative |
|-|-|
| Virtual Machine Scale Sets Instance View | Get instance view on individual VMs; Use Resource Graph to query power state |


## Scale set lifecycle batch operations  

| Uniform API | Flexible alternative |
|-|-|
| [Deallocate](/rest/api/compute/virtualmachinescalesetvms/deallocate)  | [Invoke Single VM API - Deallocate](/rest/api/compute/virtualmachines/deallocate)   |
| [Delete](/rest/api/compute/virtualmachinescalesetvms/delete)  | VMSS Batch delete API supported by VMSS in Flexible Orchestration Mode |
| [Get Instance View](/rest/api/compute/virtualmachinescalesetvms/getinstanceview)  | [Invoke Single VM API - Instance View](/rest/api/compute/virtualmachines/instanceview)  |
| [Perform Maintenance](/rest/api/compute/virtualmachinescalesetvms/performmaintenance)  | [Invoke Single VM API - Perform Maintenance](/rest/api/compute/virtualmachines/performmaintenance)  |
| [Power Off](/rest/api/compute/virtualmachinescalesetvms/poweroff)  | [Invoke Single VM API - Power Off](/rest/api/compute/virtualmachines/poweroff)  |
| [Redeploy](/rest/api/compute/virtualmachinescalesetvms/redeploy)  | [Invoke Single VM API - Redeploy](/rest/api/compute/virtualmachines/redeploy)  |
| [Reimage](/rest/api/compute/virtualmachinescalesetvms/reimage)  | [Invoke Single VM API - Reimage](/rest/api/compute/virtualmachines/reimage)  |
| [Reimage All](/rest/api/compute/virtualmachinescalesetvms/reimageall)  | Not applicable |
| [Restart](/rest/api/compute/virtualmachinescalesetvms/restart)  | [Invoke Single VM API - Restart](/rest/api/compute/virtualmachines/restart)  |
| [simulate Eviction](/rest/api/compute/virtualmachinescalesetvms/simulateeviction) | [Invoke Single VM API - simulate Eviction](/rest/api/compute/virtualmachines/simulateeviction)  |
| [Start](/rest/api/compute/virtualmachinescalesetvms/start) | [Invoke Single VM API - Start](/rest/api/compute/virtualmachines/start) |


## Get or Update 

**Uniform API:**

Virtual Machine Scale Sets VM Get or Update Instance:
- [Get](/rest/api/compute/virtualmachinescalesetvms/get) 
- [Update](/rest/api/compute/virtualmachinescalesetvms/update)

**Flexible alternative:** 

Invoke Single VM APIs:
- [ARM Lock Resource](../azure-resource-manager/management/lock-resources.md?tabs=json) for Instance Protection type behavior 
    

## Get or Update scale set VM instances

| Uniform API | Flexible alternative |
|-|-|
| [Get scale set VM details](/rest/api/compute/virtualmachinescalesetvms/get) | [Get virtual machine](/rest/api/compute/virtualmachines/get) |
| [Update scale set VM instance](/rest/api/compute/virtualmachinescalesetvms/update) | [Update virtual machine](/rest/api/compute/virtualmachines/update) |


## Instance protection 

| Uniform API | Flexible alternative |
|-|-|
| [Instance Protection](virtual-machine-scale-sets-instance-protection.md) | [ARM Lock Resource](../azure-resource-manager/management/lock-resources.md?tabs=json) for Instance Protection type behavior | 


## List instances 

**Uniform API:**

`VMSS List Instances`: 
- Returns the scale set ID associated with each instance

**Flexible alternative:**

Azure Resource Graph: 

```armasm
resources 
| where type == "microsoft.compute/virtualmachines" 
| where properties.virtualMachineScaleSet.id contains "portalbb01" 
```

## Scale set instance operations 

**Uniform API:**

Virtual Machine Scale Sets Operations:
- [Update Instances](/rest/api/compute/virtual-machine-scale-sets/update-instances)
- [Deallocate](/rest/api/compute/virtual-machine-scale-sets/deallocate)
- [Perform Maintenance](/rest/api/compute/virtual-machine-scale-sets/perform-maintenance)
- [Power Off](/rest/api/compute/virtual-machine-scale-sets/power-off)
- [Redeploy](/rest/api/compute/virtual-machine-scale-sets/redeploy)
- [Reimage](/rest/api/compute/virtual-machine-scale-sets/reimage)
- [Reimage All](/rest/api/compute/virtual-machine-scale-sets/reimage-all)
- [Restart](/rest/api/compute/virtual-machine-scale-sets/restart)
- [Set Orchestration Service State](/rest/api/compute/virtual-machine-scale-sets/set-orchestration-service-state)
- [Start](/rest/api/compute/virtual-machine-scale-sets/start)

**Flexible alternative:**

Invoke operations on individual VMs.

Virtual machines Operations:
- [Reimage](/rest/api/compute/virtual-machines/reimage): invoke single VM API - Reimage on Ephemeral OS VMs only

## VM extension

**Uniform API:**

Virtual Machine Scale Sets VM Extension:
- [Create Or Update](/rest/api/compute/virtual-machine-scale-set-vm-extensions/create-or-update)
- [Delete](/rest/api/compute/virtual-machine-scale-set-vm-extensions/delete)
- [Get](/rest/api/compute/virtual-machine-scale-set-vm-extensions/get)
- [List](/rest/api/compute/virtual-machine-scale-set-vm-extensions/list)
- [Update](/rest/api/compute/virtual-machine-scale-set-vm-extensions/update) 

**Flexible alternative:**

Invoke operations on individual VMs.


## Networking 

| Uniform API | Flexible alternative |
|-|-|
| Load balancer NAT pool | Specify NAT rule to specific instances | 

> [!IMPORTANT]
> Networking behavior will vary depending on how you choose to create virtual machines within your scale set. **Manually added VM instances** have default outbound connectivity access. **Implicitly created VM instances** do not have default access.
>
> For more information on networking for Flexible scale sets, see [scalable network connectivity](../virtual-machines/flexible-virtual-machine-scale-sets-migration-resources.md#create-scalable-network-connectivity).


## Scale set APIs

**Uniform API:**

Uniform Virtual Machine Scale Sets APIs:
- [Convert To Single Placement Group](/rest/api/compute/virtual-machine-scale-sets/convert-to-single-placement-group)
- [Force Recovery Service Fabric Platform Update Domain Walk](/rest/api/compute/virtual-machine-scale-sets/force-recovery-service-fabric-platform-update-domain-walk)

**Flexible alternative:**

Not supported on Flexible Virtual Machine Scale Sets.


## Next steps
> [!div class="nextstepaction"]
> [Learn about the different Orchestration Modes](virtual-machine-scale-sets-orchestration-modes.md)
