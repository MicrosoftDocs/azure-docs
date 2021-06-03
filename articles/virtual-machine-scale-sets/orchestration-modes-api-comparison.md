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

# Orchestration modes API comparison 

This article compares the API differences between Uniform and Flexible orchestration modes for virtual machine scale sets. To learn more about Uniform and Flexible virtual machine scale sets, see [orchestration modes](virtual-machine-scale-sets-orchestration-modes.md).


## Table in progress 

| Uniform API | Flexible alternative |
|-|-|
| Virtual machine scale sets Instance View | Get instance view on individual VMs; Use Resource Graph to query power state |

## Find a way to display table within a table 

Virtual machine scale sets VM Lifecycle Batch Operations: 
[Deallocate](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/deallocate) 
[Delete](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/delete) 
[Get Instance View](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/getinstanceview) 
[Perform Maintenance](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/performmaintenance) 
[Power Off](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/poweroff) 
[Redeploy](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/redeploy) 
[Reimage](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/reimage) 
[Reimage All](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/reimageall) 
[Restart](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/restart) 
[simulate Eviction](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/simulateeviction)
[Start](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/start)

Invoice Single VM API on specific instances:
[Invoke Single VM API - Deallocate](https://docs.microsoft.com/rest/api/compute/virtualmachines/deallocate)  
[Invoke Single VM API -Delete](https://docs.microsoft.com/rest/api/compute/virtualmachines/delete) 
[Invoke Single VM API - Instance View](https://docs.microsoft.com/rest/api/compute/virtualmachines/instanceview) 
[Invoke Single VM API - Perform Maintenance](https://docs.microsoft.com/rest/api/compute/virtualmachines/performmaintenance) 
[Invoke Single VM API - Power Off](https://docs.microsoft.com/rest/api/compute/virtualmachines/poweroff) 
[Invoke Single VM API - Redeploy](https://docs.microsoft.com/rest/api/compute/virtualmachines/redeploy) 
[Invoke Single VM API - Reimage](https://docs.microsoft.com/rest/api/compute/virtualmachines/reimage) 
[Invoke Single VM API - Restart](https://docs.microsoft.com/rest/api/compute/virtualmachines/restart) 
[Invoke Single VM API - simulate Eviction](https://docs.microsoft.com/rest/api/compute/virtualmachines/simulateeviction) 
[Invoke Single VM API - Start](https://docs.microsoft.com/rest/api/compute/virtualmachines/start)


Virtual machine scale sets VM Get / Update Instance 
[Get](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/get) 
[Update](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/update)

Invoke Single VM APIs
[ARM Lock Resource](https://docs.microsoft.com/azure/azure-resource-manager/management/lock-resources?tabs=json) for Instance Protection type behavior 



## Next steps
> [!div class="nextstepaction"]
> [Learn about the different Orchestration Modes](virtual-machine-scale-sets-orchestration-modes.md)