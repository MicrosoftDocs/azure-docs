---
title: Create an Azure scale set that uses Availability Zones | Microsoft Docs
description: Learn how to create virtual machine scale sets that use Availability Zones
keywords: virtual machine scale sets
services: virtual-machine-scale-sets
documentationcenter: ''
author: iainfoulds
manager: jeconnoc
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machine-scale-sets
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm
ms.devlang: na
ms.topic: article
ms.date: 01/02/2018
ms.author: iainfou

---

# Create a virtual machine scale set that uses Availability Zones
To protect your virtual machine scale sets from datacenter-level failures, you can create a scale set in an Availability Zones. Each supported Azure region has a minimum of three separate zones. Zones have their own independent power source, network, and cooling. For more information, see [Overview of Availability Zones](../availability-zones/az-overview.md). This article shows you how to create a scale set that uses Availability Zones with the Azure portal, Azure CLI 2.0, Azure PowerShell, and templates.


## Overview and requirements
To use Availability Zones, your scale set must be created in a [supported Azure region](../availability-zones/az-overview.md#regions-that-support-availability-zones). You can create a scale set that uses Availability Zones with one of the following methods:

- [Azure portal](#use-the-azure-portal)
- [Azure CLI 2.0](#use-the-azure-cli-20)
- [Azure PowerShell](#use-azure-powershell)
- [Azure Resource Manager templates](#use-azure-resource-manager-templates)


## Use the Azure portal
The process to create a scale set that uses an Availability Zone is the same as detailed in the [getting started article](virtual-machine-scale-sets-create-portal.md). To use Availability Zones, you must select a supported Azure region. Once you have selected a supported Azure region, you can then create your scale set in one of the available zones, as shown in the following example:

![Create a scale set in a single Availability Zone](media/virtual-machine-scale-sets-use-availability-zones/create-portal-single-az.png)


## Use the Azure CLI 2.0
The process to create a scale set that uses an Availability Zone is the same as detailed in the [getting started article](virtual-machine-scale-sets-create-cli.md). To use Availability Zones, you must create your scale set in a supported Azure region. Add the `--zone` parameter to the [az vmss create](/cli/azure/vmss#az_vmss_create) command and specify which zone to use (such as zone *1*, *2*, or *3*). The following example creates a scale set named *myScaleSet* in zone *1*:

```azurecli
az vmss create \
    --resource-group myResourceGroup \
    --name myScaleSet \
    --image UbuntuLTS \
    --upgrade-policy-mode automatic \
    --admin-username azureuser \
    --generate-ssh-keys
    --zone 1
```

It takes a few minutes to create and configure all the scale set resources and VMs.


## Use Azure PowerShell
The process to create a scale set that uses an Availability Zone is the same as detailed in the [getting started article](virtual-machine-scale-sets-create-powershell.md). To use Availability Zones, you must create your scale set in a supported Azure region. Add the `-Zone` parameter to the [New-AzureRmVmssConfig](powershell/module/azurerm.compute/new-azurermvmssconfig) command and specify which zone to use (such as zone *1*, *2*, or *3*). The following example creates a scale set config named *vmssConfig* in zone *1*:

```powershell
$vmssConfig = New-AzureRmVmssConfig `
    -Location "East US 2" `
    -SkuCapacity 2 `
    -SkuName "Standard_DS2" `
    -UpgradePolicyMode Automatic
    -Zone "1"
```

To create the actual set, follow the additional steps as detailed in the [getting started article](virtual-machine-scale-sets-create-powershell.md).


## Use Azure Resource Manager templates
The process to create a scale set that uses an Availability Zone is the same as detailed in the getting started article for [Linux](virtual-machine-scale-sets-create-template-linux.md) or [Windows](virtual-machine-scale-sets-create-template-windows.md). To use Availability Zones, you must create your scale set in a supported Azure region. Add the `zones` property to the *Microsoft.Compute/virtualMachineScaleSets* resource type in your template and specify which zone to use (such as zone *1*, *2*, or *3*). The following example creates a Linux scale set named *myScaleSet* in zone *1*:

```json
{
  "type": "Microsoft.Compute/virtualMachineScaleSets",
  "name": "myScaleSet",
  "location": "East US 2",
  "apiVersion": "2017-12-01",
  "zones": "1",
  "sku": {
    "name": "Standard_A1",
    "capacity": "2"
  },
  "properties": {
    "upgradePolicy": {
      "mode": "Automatic"
    },
    "virtualMachineProfile": {
      "storageProfile": {
        "osDisk": {
          "caching": "ReadWrite",
          "createOption": "FromImage"
        },
        "imageReference":  {
          "publisher": "Canonical",
          "offer": "UbuntuServer",
          "sku": "16.04-LTS",
          "version": "latest"
        }
      },
      "osProfile": {
        "computerNamePrefix": "myvmss",
        "adminUsername": "azureuser",
        "adminPassword": "P@ssw0rd!"
      }
    }
  }
}
```

To create the actual set, follow the additional steps as detailed in the getting started article for [Linux](virtual-machine-scale-sets-create-template-linux.md) or [Windows](virtual-machine-scale-sets-create-template-windows.md)


## Next steps