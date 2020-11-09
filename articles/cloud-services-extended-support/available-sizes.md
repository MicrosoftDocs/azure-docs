---
title: Available sizes for Azure Cloud Services (extended support)
description: Available sizes for Azure Cloud Services (extended support) deployments
ms.topic: article
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Available sizes for Azure Cloud Services (extended support)

This article describes the available virtual machine sizes for Cloud Services (extended support) role instances.   

| SKU Family |  ACU/ Core | 
|---|---|
| [A5-7](https://docs.microsoft.com/azure/virtual-machines/sizes-previous-gen?toc=/azure/virtual-machines/linux/toc.json&bc=/azure/virtual-machines/linux/breadcrumb/toc.json#a-series)| 100 |
|[A8-A11](https://docs.microsoft.com/azure/virtual-machines/sizes-previous-gen?toc=/azure/virtual-machines/linux/toc.json&bc=/azure/virtual-machines/linux/breadcrumb/toc.json#a-series---compute-intensive-instances) | 225* |
|[Av2](https://docs.microsoft.com/azure/virtual-machines/av2-series) | 100 | 
|[D](https://docs.microsoft.com/azure/virtual-machines/sizes-previous-gen?toc=/azure/virtual-machines/linux/toc.json&bc=/azure/virtual-machines/linux/breadcrumb/toc.json#d-series) | 160 | 
|[Dv2](https://docs.microsoft.com/azure/virtual-machines/dv2-dsv2-series) | 160 - 190* |
|[Dv3](https://docs.microsoft.com/azure/virtual-machines/dv3-dsv3-series) | 160 - 190* |
|[Ev3](https://docs.microsoft.com/azure/virtual-machines/ev3-esv3-series) | 160 - 190*
|[G](https://docs.microsoft.com/azure/virtual-machines/sizes-previous-gen?toc=/azure/virtual-machines/linux/toc.json&bc=/azure/virtual-machines/linux/breadcrumb/toc.json#g-series) | 180-240* |
|[H](https://docs.microsoft.com/azure/virtual-machines/h-series) | 290 - 300* | 

ACUs marked with a * use Intel® Turbo technology to increase CPU frequency and provide a performance boost. The amount of the boost can vary based on the VM size, workload, and other workloads running on the same host.

## Configure sizes for Cloud Services  

You can specify the Virtual Machine size of a role instance as part of the service model described by the service definition file. The size of the role determines the number of CPU cores, memory capacity, and the local file system size that is allocated to a running instance. Choose the role size based on your application's resource requirements. 

For example, setting the role size to `Standard_D2` for a Web Role instance: 


```xml
<WorkerRole name="Worker1" vmsize="Standard_D2"> 
</WorkerRole> 
```

## Changing the size of an existing role

To change the size of an existing role, change the VM size in your service definition file (as shown above), repackage your Cloud Service, and redeploy it. 

## Get a list of sizes 

Use the following PowerShell command to get a list of available sizes.

```powershell
Get-AzureRoleSize | where SupportedByWebWorkerRoles -eq $true | select InstanceSize, RoleSizeLabel 
```
## Next steps 
Learn about [Azure subscription and service limits, quotas, and constraints](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits). 