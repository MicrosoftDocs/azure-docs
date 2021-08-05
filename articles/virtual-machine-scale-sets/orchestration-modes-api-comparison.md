---
title: Orchestration modes API comparison 
description: Learn about the API differences between the Uniform and Flexible orchestration modes.
author: fitzgeraldsteele
ms.author: fisteele
ms.topic: conceptual
ms.service: virtual-machine-scale-sets
ms.date: 06/03/2021
ms.reviewer: jushiman
ms.custom: mimckitt, devx-track-azurecli, vmss-flex
---

# Preview: Orchestration modes API comparison 

This article compares the API differences between Uniform and Flexible orchestration modes for virtual machine scale sets. To learn more about Uniform and Flexible virtual machine scale sets, see [orchestration modes](virtual-machine-scale-sets-orchestration-modes.md).

> [!IMPORTANT]
> Virtual machine scale sets in Flexible orchestration mode is currently in public preview. An opt-in procedure is needed to use the public preview functionality described below.
> This preview version is provided without a service level agreement and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


## Table or tabs in progress 

Add an introduction here with Jerry's help. 

### Line one

| Uniform API | Flexible alternative |
|-|-|
| Virtual machine scale sets Instance View | Get instance view on individual VMs; Use Resource Graph to query power state |

### Line two  

Virtual machine scale sets VM Lifecycle Batch Operations: 
- [Deallocate](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/deallocate) 
- [Delete](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/delete) 
- [Get Instance View](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/getinstanceview) 
- [Perform Maintenance](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/performmaintenance) 
- [Power Off](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/poweroff) 
- [Redeploy](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/redeploy) 
- [Reimage](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/reimage) 
- [Reimage All](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/reimageall) 
- [Restart](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/restart) 
- [simulate Eviction](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/simulateeviction)
- [Start](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/start)

Invoice Single VM API on specific instances:
- [Invoke Single VM API - Deallocate](https://docs.microsoft.com/rest/api/compute/virtualmachines/deallocate)  
- [Invoke Single VM API -Delete](https://docs.microsoft.com/rest/api/compute/virtualmachines/delete) 
- [Invoke Single VM API - Instance View](https://docs.microsoft.com/rest/api/compute/virtualmachines/instanceview) 
- [Invoke Single VM API - Perform Maintenance](https://docs.microsoft.com/rest/api/compute/virtualmachines/performmaintenance) 
- [Invoke Single VM API - Power Off](https://docs.microsoft.com/rest/api/compute/virtualmachines/poweroff) 
- [Invoke Single VM API - Redeploy](https://docs.microsoft.com/rest/api/compute/virtualmachines/redeploy) 
- [Invoke Single VM API - Reimage](https://docs.microsoft.com/rest/api/compute/virtualmachines/reimage) 
- [Invoke Single VM API - Restart](https://docs.microsoft.com/rest/api/compute/virtualmachines/restart) 
- [Invoke Single VM API - simulate Eviction](https://docs.microsoft.com/rest/api/compute/virtualmachines/simulateeviction) 
- [Invoke Single VM API - Start](https://docs.microsoft.com/rest/api/compute/virtualmachines/start)

### Line three 

Virtual machine scale sets VM Get / Update Instance 
- [Get](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/get) 
- [Update](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/update)

Invoke Single VM APIs
- [ARM Lock Resource](https://docs.microsoft.com/azure/azure-resource-manager/management/lock-resources?tabs=json) for Instance Protection type behavior 

### Line four

`VMSS List Instances` : 
- Returns the scale set ID associated with each instance during this preview 

Azure Resource Graph 

```armasm
resources 
| where type == "microsoft.compute/virtualmachines" 
| where properties.virtualMachineScaleSet.id contains "portalbb01" 
```

### Line five

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

Invoke operations on individual VMs 

### Line six

Virtual machine scale sets VM Extension:
- [Create Or Update](https://docs.microsoft.com/rest/api/compute/virtual-machine-scale-set-vm-extensions/create-or-update)
- [Delete](https://docs.microsoft.com/rest/api/compute/virtual-machine-scale-set-vm-extensions/delete)
-[Get](https://docs.microsoft.com/rest/api/compute/virtual-machine-scale-set-vm-extensions/get)
- [List](https://docs.microsoft.com/rest/api/compute/virtual-machine-scale-set-vm-extensions/list)
- [Update](https://docs.microsoft.com/rest/api/compute/virtual-machine-scale-set-vm-extensions/update) 

Invoke operations on individual VMs 

### Line seven

NAT Pool / Port forwarding 
NAT Pool not supported in Flexible scale sets  

Set up individual NAT Rules on each VM

### Line eight

Uniform virtual machine scale sets APIs:
- [Convert To Single Placement Group](https://docs.microsoft.com/rest/api/compute/virtual-machine-scale-sets/convert-to-single-placement-group)
- [Force Recovery Service Fabric Platform Update Domain Walk](https://docs.microsoft.com/rest/api/compute/virtual-machine-scale-sets/force-recovery-service-fabric-platform-update-domain-walk)

Not supported on Flexible virtual machine scale sets


## Next steps
> [!div class="nextstepaction"]
> [Learn about the different Orchestration Modes](virtual-machine-scale-sets-orchestration-modes.md)