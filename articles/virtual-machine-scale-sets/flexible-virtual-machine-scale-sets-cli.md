---
title: Create virtual machines in a Flexible scale set using Azure CLI
description: Learn how to create a virtual machine scale set in Flexible orchestration mode using Azure CLI.
author: fitzgeraldsteele
ms.author: fisteele
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: flexible-scale-sets
ms.date: 08/05/2021
ms.reviewer: jushiman
ms.custom: mimckitt, devx-track-azurecli, vmss-flex
---

# Create virtual machines in a scale set using Azure CLI

This article steps through using the Azure CLI to create a virtual machine scale set. 

Make sure that you've installed the latest [Azure CLI](/cli/azure/install-az-cli2) and are logged in to an Azure account with [az login](/cli/azure/reference-index).

## Get started with Flexible scale sets

Create a virtual machine scale set with Azure CLI.

### Add multiple VMs to a scale set

In the following example, we specify a virtual machine profile (VM type, networking configuration, etc.) and number of instances to create (instance count = 2).  

```azurecli-interactive
az vmss create
--name $vmssName
--resource-group $rg
--image UbuntuLTS
--instance-count 2
--orchestration-mode flexible
```

### Add a single VM to a scale set

The following example shows the creation of a Flexible scale set without a VM profile, where the fault domain count is set to 1. A virtual machine is created and then added to the Flexible scale set.

```azurecli-interactive
vmoname="my-vmss-vmo"
vmname="myVM"
rg="my-resource-group"

az group create -n "$rg" -l $location
az vmss create -n "$vmoname" -g "$rg" -l $location --orchestration-mode flexible --platform-fault-domain-count 1
az vm create -n "$vmname" -g "$rg" -l $location --vmss $vmoname --image UbuntuLTS
``` 


## Next steps
> [!div class="nextstepaction"]
> [Learn how to create a scale set in the Azure Portal.](flexible-virtual-machine-scale-sets-portal.md)
