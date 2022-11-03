---
title: Using Flex ScaleSets
description: Create VMs using VMSS Flex
author: dougclayton
ms.date: 11/02/2022
ms.author: doclayto
monikerRange: '>= cyclecloud-8'
---

# Using Flex ScaleSets

As of 8.3.0, CycleCloud can use [Flex orchestration](https://go.microsoft.com/fwlink/?LinkId=2156742) for scale sets. 
This works differently than the automatic usage of Uniform scale sets that is standard in CycleCloud. 
In this mode, you create a Flex scale set outside of CycleCloud, and you specify which nodes should use it. 
CycleCloud creates and deletes VMs in that scale set. This works for both head nodes and execute nodearrays.

To use Flex orchestration, you must use a CycleCloud credential that is locked to a given resource group (which must be created). 
This is because VMs in a Flex scale set must be in the same resource group as the scale set. 
You can use the az CLI to create the resource group, if you don't have one to use already:

```bash
az group create --location REGIONNAME --resource-group MyResourceGroup
```

The scaleset must be created in Flex orchestration mode, and any VM settings on it (e.g., VM size or image) are ignored. 
Because of this, it is easiest to create it through the az CLI:

```bash
az vmss create --orchestration-mode Flexible -g MyResourceGroup -n MyScaleSet --platform-fault-domain-count 1
```

Finally, specify the fully qualified id for this scaleset on the node or nodearray that should use it on the cluster template:

```ini
[nodearray execute]
FlexScaleSetId = /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/MyScaleSet
```

> [!NOTE]
> Scale sets have limitations on size (currently 1000 VMs). To scale larger than that, you must create multiple scale sets and assign them to different nodearrays.