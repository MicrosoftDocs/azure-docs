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

This article describes the available virtual machine sizes for Cloud Services (extended support) instances.   

| SKU Family |  ACU/ Core | 
|---|---|
|[Av2](../virtual-machines/av2-series.md) | 100 | 
|[D](../virtual-machines/sizes-previous-gen.md?bc=%2fazure%2fvirtual-machines%2flinux%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json#d-series) | 160 | 
|[Dv2](../virtual-machines/dv2-dsv2-series.md) | 210 - 250* |
|[Dv3](../virtual-machines/dv3-dsv3-series.md) | 160 - 190* |
|[Dav4](../virtual-machines/dav4-dasv4-series.md) | 230 - 260 |
|[Eav4](../virtual-machines/eav4-easv4-series.md) | 230 - 260 |
|[Ev3](../virtual-machines/ev3-esv3-series.md) | 160 - 190* |
|[G](../virtual-machines/sizes-previous-gen.md?bc=%2fazure%2fvirtual-machines%2flinux%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json#g-series) | 180-240* |
|[H](../virtual-machines/h-series.md) | 290 - 300* | 


>[!NOTE]
> ACUs marked with a * use Intel® Turbo technology to increase CPU frequency and provide a performance boost. The amount of the boost can vary based on the VM size, workload, and other workloads running on the same host.


## Configure sizes for Cloud Services (extended support)

You can specify the virtual machine size of a role instance as part of the service model in the service definition file. The size of the role determines the number of CPU cores, memory capacity and the local file system size.

For example, setting the web role instance size to `Standard_D2`: 

```xml
<WorkerRole name="Worker1" vmsize="Standard_D2"> 
</WorkerRole> 
```
>[!IMPORTANT]
> Microsoft Azure has introduced newer generations of high-performance computing (HPC), general purpose, and memory-optimized virtual machines (VMs). For this reason, we recommend that you migrate workloads from the original H-series and H-series Promo VMs to our newer offerings by August 31, 2022. Azure [HC](../virtual-machines/hc-series.md), [HBv2](../virtual-machines/hbv2-series.md), [HBv3](../virtual-machines/hbv3-series.md), [Dv4](../virtual-machines/dv4-dsv4-series.md), [Dav4](../virtual-machines/dav4-dasv4-series.md), [Ev4](../virtual-machines/ev4-esv4-series.md), and [Eav4](../virtual-machines/eav4-easv4-series.md) VMs have greater memory bandwidth, improved networking capabilities, and better cost and performance across various HPC workloads.

## Change the size of an existing role

To change the size of an existing role, change the virtual machine size in the service definition file (csdef), repackage your Cloud Service and redeploy it. 

## Get a list of available sizes 

To retrieve a list of available sizes see [Resource Skus - List](/rest/api/compute/resourceskus/list) and apply the following filters:

```powershell
    # Update the location
    $location = 'WestUS2'
    # Get all Compute Resource Skus
    $allSkus = Get-AzComputeResourceSku
    # Filter virtualMachine skus for given location
    $vmSkus = $allSkus.Where{$_.resourceType -eq 'virtualMachines' -and $_.LocationInfo.Location -like $location}
    # From filtered virtualMachine skus, select PaaS Skus
    $passVMSkus = $vmSkus.Where{$_.Capabilities.Where{$_.name -eq 'VMDeploymentTypes'}.Value.Contains("PaaS")}
    # Optional step to format and sort the output by Family
    $passVMSkus | Sort-Object Family, Name | Format-Table -Property Family, Name, Size
```

## Next steps 
- Review the [deployment prerequisites](deploy-prerequisite.md) for Cloud Services (extended support).
- Review [frequently asked questions](faq.yml) for Cloud Services (extended support).
- Deploy a Cloud Service (extended support) using the [Azure portal](deploy-portal.md), [PowerShell](deploy-powershell.md), [Template](deploy-template.md) or [Visual Studio](deploy-visual-studio.md).
