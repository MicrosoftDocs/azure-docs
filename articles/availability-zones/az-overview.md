---
title: Availability Zones Overview | Microsoft Docs
description: This article provides an overview of Availability Zones in Azure.
services: 
documentationcenter:
author: markgalioto
manager: carmonm
editor:
tags:

ms.assetid:
ms.service:
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/16/2017
ms.author: markgal
ms.custom: mvc I am an ITPro and application developer, and I want to protect (use Availability Zones) my applications and data against data center failure (to build Highly Available applications). 
---

# Overview of Availability Zones in Azure (Preview)

Availability Zones help to protect you from datacenter-level failures. They are located inside an Azure region, and each one has its own independent power source, network, and cooling. To ensure resiliency, there's a minimum of three separate zones in all enabled regions. The physical and logical separation of Availability Zones within a region protects applications and data from zone-level failures. 

![conceptual view of one zone going down in a region](./media/az-overview/az-graphic-two.png)

## Regions that support Availability Zones

- East US 2
- West Europe
- France Central

## Services that support Availability Zones

The Azure services that support Availability Zones are:

- Linux Virtual Machines
- Windows Virtual Machines
- Zonal Virtual Machine Scale Sets
- Managed Disks
- Load Balancer
- Public IP address


## Check VM SKU availability
The availability of VM sizes, or SKUs, may vary by region and zone. To help you plan for the use of Availability Zones, you can list the available VM SKUs by Azure region and zone. This ability makes sure that you choose an appropriate VM size, and obtain the desired resiliency across zones. For more information on the different VM types and sizes, see the [Windows](../virtual-machines/windows/sizes.md) or [Linux](../virtual-machines/linux/sizes.md) overview docs.

### Azure CLI 2.0
You can view the available VM SKUs with the [az vm list-skus](/cli/azure/vm#az_vm_list_skus) command. The following example lists available VM SKUs in the *eastus2* region:

```azurecli
az vm list-skus --location eastus2 --output table
```

The output is similar to the following condensed example, which shows the Availability Zones in which each VM size is available:

```azurecli
ResourceType      Locations  Name               Tier       Size     Zones
----------------  ---------  -----------------  ---------  -------  -------
virtualMachines   eastus2    Standard_DS1_v2    Standard   DS1_v2   1,2,3
virtualMachines   eastus2    Standard_DS2_v2    Standard   DS2_v2   1,2,3
[...]
virtualMachines   eastus2    Standard_F1s       Standard   F1s      1,2,3
virtualMachines   eastus2    Standard_F2s       Standard   F2s      1,2,3
[...]
virtualMachines   eastus2    Standard_D2s_v3    Standard   D2_v3    1,2,3
virtualMachines   eastus2    Standard_D4s_v3    Standard   D4_v3    1,2,3
[...]
virtualMachines   eastus2    Standard_E2_v3     Standard   E2_v3    1,2,3
virtualMachines   eastus2    Standard_E4_v3     Standard   E4_v3    1,2,3
```

### Azure PowerShell
You can view the available VM SKUs with the [Get-AzureRmComputeResourceSku](/powershell/module/azurerm.compute/get-azurermcomputeresourcesku) command. The following example lists available VM SKUs in the *eastus2* region:

```powershell
Get-AzureRmComputeResourceSku | where {$_.Locations.Contains("eastus2")};
```

The output is similar to the following condensed example, which shows the Availability Zones in which each VM size is available:

```powershell
ResourceType                Name  Location      Zones
------------                ----  --------      -----
virtualMachines  Standard_DS1_v2   eastus2  {1, 2, 3}
virtualMachines  Standard_DS2_v2   eastus2  {1, 2, 3}
[...]
virtualMachines     Standard_F1s   eastus2  {1, 2, 3}
virtualMachines     Standard_F2s   eastus2  {1, 2, 3}
[...]
virtualMachines  Standard_D2s_v3   eastus2  {1, 2, 3}
virtualMachines  Standard_D4s_v3   eastus2  {1, 2, 3}
[...]
virtualMachines   Standard_E2_v3   eastus2  {1, 2, 3}
virtualMachines   Standard_E4_v3   eastus2  {1, 2, 3}
```


## Get started with the Availability Zones preview

The Availability Zones preview is available in the East US 2, West Europe, and France Central regions for specific Azure services. 

1. [Sign up for the Availability Zones preview](http://aka.ms/azenroll). 
2. Sign in to your Azure subscription.
3. Choose a region that supports Availability Zones.
4. Use one of the following links to start using Availability Zones with your service. 
    - [Create a virtual machine](../virtual-machines/windows/create-portal-availability-zone.md)
    - [Create a virtual machine scale set](../virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones.md)
    - [Add a Managed Disk using PowerShell](../virtual-machines/windows/attach-disk-ps.md#add-an-empty-data-disk-to-a-virtual-machine)
    - [Load balancer](../load-balancer/load-balancer-standard-overview.md)

## Next steps
- [Quickstart templates](http://aka.ms/azqs)
