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

# Preview: Create virtual machines in a Flexible scale set using Azure CLI

**Applies to:** :heavy_check_mark: Flexible scale sets


This article steps through using the Azure CLI to create a virtual machine scale set in Flexible orchestration mode. For more information about Flexible scale sets, see [Flexible orchestration mode for virtual machine scale sets](flexible-virtual-machine-scale-sets.md). 

Make sure that you have installed the latest [Azure CLI](/cli/azure/install-az-cli2) and are logged in to an Azure account with [az login](/cli/azure/reference-index).


> [!IMPORTANT]
> Virtual machine scale sets in Flexible orchestration mode is currently in public preview. An opt-in procedure is needed to use the public preview functionality described below.
> This preview version is provided without a service level agreement and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


> [!CAUTION]
> The orchestration mode is defined when you create the scale set and cannot be changed or updated later.


## Register for Flexible orchestration mode

Before you can deploy virtual machine scale sets in Flexible orchestration mode, you must first register your subscription for the preview feature. The registration may take several minutes to complete.

Use [az feature register](/cli/azure/feature#az_feature_register) to enable the preview for your subscription.

```azurecli-interactive
az feature register --namespace Microsoft.Compute --name VMOrchestratorMultiFD
az feature register --namespace microsoft.compute --name VMOrchestratorSingleFD
az feature register --namespace Microsoft.Compute --name VMScaleSetFlexPreview 
az feature register --namespace Microsoft.Compute --name SkipPublicIpWriteRBACCheckForVMNetworkInterfaceConfigurationsPublicPreview
```

Feature registration can take up to 15 minutes. To check the registration status:

```azurecli-interactive
az feature show --namespace Microsoft.Compute --name VMOrchestratorMultiFD
```


## Get started with Flexible scale sets

Create a Flexible virtual machine scale set with Azure CLI.

### Add multiple VMs to a scale set

In the following example, we specify a virtual machine profile (VM type, networking configuration, etc.) and number of instances to create (instance count = 2).  

```azurecli-interactive
az vmss create
--resource-group $rg
--name $vmssName
--single-placement-group false
--orchestration-mode flexible
--platform-fault-domain-count 1
--image UbuntuLTS
--admin-username azureuser
--instance-count 2
--vm-sku 'Standard_D2s_v3'
--network-api-version '2020-11-01'
--computer-name-prefix $computerNamePrefix
--vnet-name $vnetName
--subnet $subnetName
--public-ip-per-vm
```

### Add a single VM to a scale set

The following example shows the creation of a Flexible scale set without a VM profile, where the fault domain count is set to 1. A virtual machine is created and then added to the Flexible scale set.

```azurecli-interactive
vmoname="my-vmss-vmo"
vmname="myVM"
rg="my-resource-group"

az group create -n "$rg" -l $location
az vmss create -n "$vmoname" -g "$rg" -l $location --orchestration-mode vm --platform-fault-domain-count 1
az vm create -n "$vmname" -g "$rg" -l $location --vmss $vmoname --image UbuntuLTS
``` 


## Next steps
> [!div class="nextstepaction"]
> [Learn how to create a Flexible scale set in the Azure Portal.](flexible-virtual-machine-scale-sets-portal.md)