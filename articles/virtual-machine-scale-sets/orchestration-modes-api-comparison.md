---
title: Orchestration modes API comparison 
description: Learn about the API differences between the Uniform and Flexible orchestration modes.
author: fitzgeraldsteele
ms.author: fisteele
ms.topic: conceptual
ms.service: virtual-machine-scale-sets
ms.date: 08/05/2021
ms.reviewer: jushiman
ms.custom: mimckitt, devx-track-azurecli, vmss-flex
---

# Preview: Orchestration modes API comparison 

This article compares the API differences between Uniform and [Flexible orchestration](..\virtual-machines\flexible-virtual-machine-scale-sets.md) modes for virtual machine scale sets. To learn more about Uniform and Flexible virtual machine scale sets, see [orchestration modes](virtual-machine-scale-sets-orchestration-modes.md).

> [!IMPORTANT]
> Virtual machine scale sets in Flexible orchestration mode is currently in public preview. An opt-in procedure is needed to use the public preview functionality described below.
> This preview version is provided without a service level agreement and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


## Instance view

| Uniform API | Flexible alternative |
|-|-|
| Virtual machine scale sets Instance View | Get instance view on individual VMs; Use Resource Graph to query power state |


## Scale set lifecycle batch operations  

| Uniform API | Flexible alternative |
|-|-|
| Virtual machine scale sets VM Lifecycle Batch Operations:  | Invoke Single VM API on specific instances: |
| [Deallocate](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/deallocate)  | [Invoke Single VM API - Deallocate](https://docs.microsoft.com/rest/api/compute/virtualmachines/deallocate)   |
| [Delete](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/delete)  | [Invoke Single VM API -Delete](https://docs.microsoft.com/rest/api/compute/virtualmachines/delete)  |
| [Get Instance View](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/getinstanceview)  | [Invoke Single VM API - Instance View](https://docs.microsoft.com/rest/api/compute/virtualmachines/instanceview)  |
| [Perform Maintenance](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/performmaintenance)  | [Invoke Single VM API - Perform Maintenance](https://docs.microsoft.com/rest/api/compute/virtualmachines/performmaintenance)  |
| [Power Off](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/poweroff)  | [Invoke Single VM API - Power Off](https://docs.microsoft.com/rest/api/compute/virtualmachines/poweroff)  |
| [Redeploy](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/redeploy)  | [Invoke Single VM API - Redeploy](https://docs.microsoft.com/rest/api/compute/virtualmachines/redeploy)  |
| [Reimage](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/reimage)  | [Invoke Single VM API - Reimage](https://docs.microsoft.com/rest/api/compute/virtualmachines/reimage)  |
| [Reimage All](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/reimageall)  | Not applicable |
| [Restart](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/restart)  | [Invoke Single VM API - Restart](https://docs.microsoft.com/rest/api/compute/virtualmachines/restart)  |
| [simulate Eviction](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/simulateeviction) | [Invoke Single VM API - simulate Eviction](https://docs.microsoft.com/rest/api/compute/virtualmachines/simulateeviction)  |
| [Start](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/start) | [Invoke Single VM API - Start](https://docs.microsoft.com/rest/api/compute/virtualmachines/start) |


## Get or Update 

### Uniform API
Virtual machine scale sets VM Get or Update Instance:
- [Get](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/get) 
- [Update](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/update)

### Flexible alternative 
Invoke Single VM APIs:
- [ARM Lock Resource](https://docs.microsoft.com/azure/azure-resource-manager/management/lock-resources?tabs=json) for Instance Protection type behavior 


## List instances 

### Uniform API
`VMSS List Instances`: 
- Returns the scale set ID associated with each instance during this preview 

### Flexible alternative
Azure Resource Graph: 

```armasm
resources 
| where type == "microsoft.compute/virtualmachines" 
| where properties.virtualMachineScaleSet.id contains "portalbb01" 
```

## Scale set operations 

### Uniform API
Virtual machine scale sets Operations:
- [Update Instances](https://docs.microsoft.com/rest/api/compute/virtual-machine-scale-sets/update-instances)
- [Deallocate](https://docs.microsoft.com/rest/api/compute/virtual-machine-scale-sets/deallocate)
- [Perform Maintenance](https://docs.microsoft.com/rest/api/compute/virtual-machine-scale-sets/perform-maintenance)
- [Power Off](https://docs.microsoft.com/rest/api/compute/virtual-machine-scale-sets/power-off)
- [Redeploy](https://docs.microsoft.com/rest/api/compute/virtual-machine-scale-sets/redeploy)
- [Reimage](https://docs.microsoft.com/rest/api/compute/virtual-machine-scale-sets/reimage)
- [Reimage All](https://docs.microsoft.com/rest/api/compute/virtual-machine-scale-sets/reimage-all)
- [Restart](https://docs.microsoft.com/rest/api/compute/virtual-machine-scale-sets/restart)
- [Set Orchestration Service State](https://docs.microsoft.com/rest/api/compute/virtual-machine-scale-sets/set-orchestration-service-state)
- [Start](https://docs.microsoft.com/rest/api/compute/virtual-machine-scale-sets/start)

### Flexible alternative
Invoke operations on individual VMs.


## VM extension

### Uniform API
Virtual machine scale sets VM Extension:
- [Create Or Update](https://docs.microsoft.com/rest/api/compute/virtual-machine-scale-set-vm-extensions/create-or-update)
- [Delete](https://docs.microsoft.com/rest/api/compute/virtual-machine-scale-set-vm-extensions/delete)
- [Get](https://docs.microsoft.com/rest/api/compute/virtual-machine-scale-set-vm-extensions/get)
- [List](https://docs.microsoft.com/rest/api/compute/virtual-machine-scale-set-vm-extensions/list)
- [Update](https://docs.microsoft.com/rest/api/compute/virtual-machine-scale-set-vm-extensions/update) 

### Flexible alternative
Invoke operations on individual VMs.


## Networking 

### Uniform API
- NAT Pool / Port forwarding 
- NAT Pool not supported in Flexible scale sets  

### Flexible alternative
- Set up individual NAT Rules on each VM


## Scale set APIs

### Uniform API
Uniform virtual machine scale sets APIs:
- [Convert To Single Placement Group](https://docs.microsoft.com/rest/api/compute/virtual-machine-scale-sets/convert-to-single-placement-group)
- [Force Recovery Service Fabric Platform Update Domain Walk](https://docs.microsoft.com/rest/api/compute/virtual-machine-scale-sets/force-recovery-service-fabric-platform-update-domain-walk)

### Flexible alternative
Not supported on Flexible virtual machine scale sets.


## Next steps
> [!div class="nextstepaction"]
> [Learn about the different Orchestration Modes](virtual-machine-scale-sets-orchestration-modes.md)