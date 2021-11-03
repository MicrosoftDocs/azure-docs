---
title: 'Quickstart: Create Azure Dedicated HSM with the Azure CLI'
description: Create, show, list, update, and delete Azure Dedicated HSMs by using the Azure CLI.
services: dedicated-hsm
author: msmbaldwin
ms.author: mbaldwin
ms.topic: quickstart
ms.service: key-vault
ms.devlang: azurecli
ms.date: 01/06/2021
ms.custom: devx-track-azurecli
---

# Quickstart: Create an Azure Dedicated HSM by using the Azure CLI

This article describes how to create and manage an Azure Dedicated HSM by using the [az dedicated-hsm](/cli/azure/dedicated-hsm) Azure CLI extension.

## Prerequisites

- An Azure subscription. You can [create a free account](https://azure.microsoft.com/free/) if you don't have one.
  
  If you have more than one Azure subscription, set the subscription to use for billing with the Azure CLI [az account set](/cli/azure/account#az_account_set) command.
  
  ```azurecli-interactive
  az account set --subscription 00000000-0000-0000-0000-000000000000
  ```
[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](../../includes/azure-cli-prepare-your-environment-no-header.md)]  
  
- All requirements met for a dedicated HSM, including registration, approval, and a virtual network and virtual machine to use for provisioning. For more information about dedicated HSM requirements and prerequisites, see [Tutorial: Deploying HSMs into an existing virtual network using the Azure CLI](tutorial-deploy-hsm-cli.md).
  

## Create a resource group

An [Azure resource group](../azure-resource-manager/management/overview.md) is a logical container for deploying and managing Azure resources as a group. If you don't already have a resource group for the dedicated HSM, create one by using the [az group create](/cli/azure/group#az_group_create) command. The following example creates a resource group named `myRG` in the `westus` Azure region:

```azurecli-interactive
az group create --name myRG --location westus
```

## Create a dedicated HSM

To create a dedicated HSM, use the [az dedicated-hsm create](/cli/azure/dedicated-hsm#az_dedicated_hsm_create) command. The following example provisions a dedicated HSM named `hsm1` in the `westus` region, `myRG` resource group, and specified subscription, virtual network, and subnet. The required parameters are `name`, `location`, and `resource group`.

```azurecli-interactive
az dedicated-hsm create \
   --resource-group myRG \
   --name "hsm1" \
   --location "westus" \
   --network-profile-network-interfaces private-ip-address="1.0.0.1" \
   --subnet id="/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/hsm-group/providers/Microsoft.Network/virtualNetworks/MyHSM-vnet/subnets/MyHSM-vnet" \
   --stamp-id "stamp1" \
   --sku name="SafeNet Luna Network HSM A790" \
   --tags resourceType="hsm" Environment="test" \
   --zones "AZ1"
```

The deployment takes approximately 25 to 30 minutes to complete.

## Get a dedicated HSM

To get a current dedicated HSM, run the [az dedicated-hsm show](/cli/azure/dedicated-hsm#az_dedicated_hsm_show) command. The following example gets the `hsm1` dedicated HSM in the `myRG` resource group.

```azurecli-interactive
az dedicated-hsm show --resource-group myRG --name hsm1
```

## Update a dedicated HSM

Use the [az dedicated-hsm update](/cli/azure/dedicated-hsm#az_dedicated_hsm_update) command to update a dedicated HSM. The following example updates the `hsm1` dedicated HSM in the `myRG` resource group, and its tags:

```azurecli-interactive
az dedicated-hsm update --resource-group myRG –-name hsm1 --tags resourceType="hsm" Environment="prod" Slice="A"
```

## List dedicated HSMs

Run the [az dedicated-hsm list](/cli/azure/dedicated-hsm#az_dedicated_hsm_list) command to get information about current dedicated HSMs. The following example lists the dedicated HSMs in the `myRG` resource group:

```azurecli-interactive
az dedicated-hsm list --resource-group myRG
```

## Remove a dedicated HSM

To remove a dedicated HSM, use the [az dedicated-hsm delete](/cli/azure/dedicated-hsm#az_dedicated_hsm_delete) command. The following example deletes the `hsm1` dedicated HSM from the `myRG` resource group:

```azurecli-interactive
az dedicated-hsm delete --resource-group myRG –-name hsm1
```

## Delete the resource group

If you no longer need the resource group you created for dedicated HSM, you can delete it by running the [az group delete](/cli/azure/group#az_group_delete) command. This command deletes the group and all resources in it, including any that are unrelated to dedicated HSM. The following example deletes the `myRG` resource group and everything in it:

```azurecli-interactive
az group delete --name myRG
```

## Next steps

To learn more about Azure Dedicated HSM, see [Azure Dedicated HSM](overview.md).
