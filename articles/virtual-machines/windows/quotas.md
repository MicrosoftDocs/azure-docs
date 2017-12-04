---
title: vCPU quotas for Azure | Microsoft Docs
description: Learn about vCPU quotas for Azure.
keywords: ''
services: virtual-machines-windows
documentationcenter: ''
author: Drewm3
manager: timlt
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 12/04/2016
ms.author: drewm

---


# Virtual machine vCPU quotas

The vCPU quotas for virtual machines and virtual machine scale sets are arranged in two tiers for each subscription, in each region. The first tier is the Total Regional vCPUs, and the second tier is the various VM size family cores such as Standard D Family vCPUs. Any time a new VM is deployed the vCPUs for the newly deployed VM must not exceed the vCPU quota for the specific VM size family or the total regional vCPU quota. If either of those quotas are exceeded, then the VM deployment will not be allowed. There is also a quota for the overall number of virtual machines in the region. The details on each of these quotas can be seen in the Usage + quota section of the **Subscription** page in the [Azure portal](https://portal.azure.com), or you can query for the values using PowerShell.

[!INCLUDE [virtual-machines-common-acu](../../../includes/virtual-machines-common-quotas.md)]
 
## Check usage

You can use the [Get-AzureRmVMUsage](/powershell/module/azurerm.compute/get-azurermvmusage) cmdlet to check on your quota usage.

```azurepowershell-interactive
Get-AzureRmVMUsage -Location "East US"
```

## Next steps