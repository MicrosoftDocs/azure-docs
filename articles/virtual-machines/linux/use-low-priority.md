---
title: Use low-priority VMs (Preview) in Azure | Microsoft Docs
description: Learn how to use low-priority VMs to save on costs
services: virtual-machines-linux
documentationcenter: ''
author: cynthn
manager: gwallace
editor:
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/06/2019
ms.author: cynthn
---


# Preview: Use low-priority VMs in Azure


[!INCLUDE [common-use-low-priority](../common-use-low-priority.md)] 


## Use the Azure portal

The process to create a scale set that uses low-priority VMs is the same as detailed in the [getting started article](quick-create-portal.md). When you are deploying a scale set, you can choose to set the low-priority flag and the eviction policy:
![Create a scale set with low-priority VMs](media/virtual-machine-scale-sets-use-low-priority/vmss-low-priority-portal.png)

## Use the Azure CLI

The process to create a scale set with low-priority VMs is the same as detailed in the [getting started article](quick-create-cli.md). Just add the '--Priority' parameter to the cli call and set it to *Low* as shown in the example below:

```azurecli
az vmss create \
    --resource-group myResourceGroup \
    --name myScaleSet \
    --image UbuntuLTS \
    --upgrade-policy-mode automatic \
    --admin-username azureuser \
    --generate-ssh-keys \
    --priority Low
```

## Use Azure PowerShell

The process to create a scale set with low-priority VMs is the same as detailed in the [getting started article](quick-create-powershell.md).
Just add the '-Priority' parameter to the [New-AzVmssConfig](/powershell/module/az.compute/new-azvmssconfig) and set it to *Low* as shown in the example below:

```powershell
$vmssConfig = New-AzVmssConfig `
    -Location "East US 2" `
    -SkuCapacity 2 `
    -SkuName "Standard_DS2" `
    -UpgradePolicyMode Automatic `
    -Priority "Low"
```

## Use Azure Resource Manager Templates

Add the 'priority' property to the *Microsoft.Compute/virtualMachineScaleSets/virtualMachineProfile* resource type in your template and specify *Low* as the value. Be sure to use *2018-03-01* API version or higher. 

In order to set the eviction policy to deletion, add the 'evictionPolicy' parameter and set it to *delete*.

The following example creates a Linux low-priority scale set named *myScaleSet* in *West Central US*, which will *delete* the VMs in the scale set on eviction:

```json
{
  "type": "Microsoft.Compute/virtualMachineScaleSets",
  "name": "myScaleSet",
  "location": "East US 2",
  "apiVersion": "2018-03-01",
  "sku": {
    "name": "Standard_DS2_v2",
    "capacity": "2"
  },
  "properties": {
    "upgradePolicy": {
      "mode": "Automatic"
    },
    "virtualMachineProfile": {
       "priority": "Low",
       "evictionPolicy": "delete",
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
## FAQ

### Can I convert existing scale sets to low-priority scale sets?
No, setting the low-priority flag is only supported at creation time.

### Can I create a scale set with both regular VMs and low-priority VMs?
No, a scale set cannot support more than one priority type.

### How is quota managed for low-priority VMs?
Low-priority VMs and regular VMs share the same quota pool. 

### Can I use autoscale with low-priority scale sets?
Yes, you can set autoscaling rules on your low-priority scale set. If your VMs are evicted, autoscale can try to create new low-priority VMs. Remember, you are not guaranteed this capacity though. 

### Does autoscale work with both eviction policies (deallocate and delete)?
It is recommended that you set your eviction policy to delete when using autoscale. This is because deallocated instances are counted against your capacity count on the scale set. When using autoscale, you will likely hit your target instance count quickly due to the deallocated, evicted instances. 

## Next steps
You can also deploy a [scale set with low-priority VM instances](../../virtual-machine-scale-sets/virtual-machine-scale-sets-use-low-priority.md).
