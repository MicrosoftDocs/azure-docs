---
title: Using Flex ScaleSets
description: Create VMs using VMSS Flex
author: dougclayton
ms.date: 07/01/2025
ms.author: doclayto
monikerRange: '>= cyclecloud-8'
---

# Using Flex ScaleSets

As of version 8.3.0, CycleCloud can use [Flex orchestration](https://go.microsoft.com/fwlink/?LinkId=2156742) for scale sets. 
This orchestration works differently than the automatic usage of Uniform scale sets that is standard in CycleCloud. 
In this mode, you create a Flex scale set outside of CycleCloud, and you specify which nodes should use it. 
CycleCloud creates and deletes VMs in that scale set. This setup works for both head nodes and execute node arrays.

To use Flex orchestration, you must use a CycleCloud credential that is locked to a given resource group (which you must create). 
This requirement exists because VMs in a Flex scale set must be in the same resource group as the scale set. 
You can use the az CLI to create the resource group if you don't already have one:

```azurecli-interactive
az group create --location REGIONNAME --resource-group RESOURCEGROUP
```

You must create the scale set in Flex orchestration mode. The creation process ignores any VM settings on the scale set, such as the VM size or image.

Because of this limitation, it's easiest to create the scale set through Azure CLI:

```azurecli-interactive
az vmss create --orchestration-mode Flexible --resource-group RESOURCEGROUP --name SCALESET --platform-fault-domain-count 1
```

Finally, specify the fully qualified ID for this scale set on the node or node array that should use it in the cluster template:

```ini
[nodearray execute]
FlexScaleSetId = /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/RESOURCEGROUP/providers/Microsoft.Compute/virtualMachineScaleSets/SCALESET
```

> [!NOTE]
> Scale sets have limitations on size (currently 1,000 VMs). To scale larger than that size, you must create multiple scale sets and assign them to different node arrays.