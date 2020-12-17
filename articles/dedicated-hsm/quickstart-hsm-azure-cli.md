---
title: 'Quickstart: Create Azure Dedicated HSM with the Azure CLI'
description: Create, show, list, update, and delete Azure Dedicated HSMs by using the Azure CLI.
services: dedicated-hsm
author: msmbaldwin
ms.author: mbaldwin
ms.topic: quickstart
ms.service: key-vault
ms.devlang: azurecli
ms.date: 12/17/2020
ms.custom: devx-track-azurecli
---

# Quickstart: Azure Dedicated HSM with Azure CLI

This article describes how to create and manage an Azure Dedicated HSM by using the [az dedicated-hsm](/cli/azure/ext/hardware-security-modules/dedicated-hsm) Azure CLI extension.

## Prerequisites

- An Azure subscription. You can [create a free account](https://azure.microsoft.com/free/) if you don't have one.
  
- [Azure CLI installed](/cli/azure/install-azure-cli), if you choose to work locally. Or you can run Azure CLI commands in the interactive Azure Cloud Shell. For instructions, see [Overview of Azure Cloud Shell](../cloud-shell/overview.md).
  
  > [!NOTE]
  > The **dedicated-hsm** extension is part of the **hardware-security-modules** extension for Azure CLI and requires version 2.3.1 or higher. The extension automatically installs the first time you run an **az dedicated-hsm** command. For more information about Azure CLI extensions, see [Use extensions with Azure CLI](/cli/azure/azure-cli-extensions-overview).
  
- All requirements met for a dedicated HSM, including registration, approval, and a virtual network and virtual machine to use for provisioning. For more information about dedicated HSM requirements and prerequisites, see [Tutorial: Deploying HSMs into an existing virtual network using the Azure CLI](tutorial-deploy-hsm-cli.md).
  
- If you have more than one Azure subscription, select the appropriate subscription for billing by using the Azure CLI [az account set](/cli/azure/account#az_account_set) command.
  
  ```azurecli-interactive
  az account set --subscription 00000000-0000-0000-0000-000000000000
  ```

## Create a resource group

An [Azure resource group](../azure-resource-manager/management/overview.md) is a logical container for deploying and managing Azure resources as a group. If you don't already have a resource group for the dedicated HSM, create one by using the [az group create](/cli/azure/group#az_group_create) command. The following example creates a resource group named `myRG` in the `westus` Azure region:

```azurecli-interactive
az group create --name myRG --location westus
```

## Create a dedicated HSM

To create a dedicated HSM, use the [az dedicated-hsm create](/cli/azure/ext/hardware-security-modules/dedicated-hsm#ext_hardware_security_modules_az_dedicated_hsm_create) command. The following example provisions a dedicated HSM named `hsm1` in the `westus` region, `myRG` resource group, specified subscription, and `MyHSM-vnet` virtual network and subnet:

```azurecli-interactive
az dedicated-hsm create --location westus --name hsm1 --resource-group myRG --network-profile-network-interfaces \
     /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRG/providers/Microsoft.Network/virtualNetworks/MyHSM-vnet/subnets/MyHSM-vnet
```

The deployment takes approximately 25 to 30 minutes to complete.

## Get a dedicated HSM

To get a current dedicated HSM, run the [az dedicated-hsm show](/cli/azure/ext/hardware-security-modules/dedicated-hsm#ext_hardware_security_modules_az_dedicated_hsm_show) command. The following example gets the `hsm1` dedicated HSM in the `myRG` resource group.

```azurecli-interactive
az dedicated-hsm show --resource group myRG --name hsm1
```

## Update a dedicated HSM

Use the [az dedicated-hsm update](/cli/azure/ext/hardware-security-modules/dedicated-hsm#ext_hardware_security_modules_az_dedicated_hsm_update) command to update a dedicated HSM. The following example updates the `hsm1` dedicated HSM in the `myRG` resource group:

```azurecli-interactive
az dedicated-hsm update --resource-group myRG –-name hsm1
```

## List dedicated HSMs

Run the [az dedicated-hsm list](/cli/azure/ext/hardware-security-modules/dedicated-hsm#ext_hardware_security_modules_az_dedicated_hsm_list) command to get information about current dedicated HSMs. The following example lists the dedicated HSMs in the `myRG` resource group:

```azurecli-interactive
az dedicated-hsm list --resource-group myRG
```

### Remove a dedicated HSM

To remove a dedicated HSM, use the [az dedicated-hsm delete](/cli/azure/ext/hardware-security-modules/dedicated-hsm#ext_hardware_security_modules_az_dedicated_hsm_delete) command. The following example deletes the `hsm1` dedicated HSM in the `myRG` resource group:

```azurecli-interactive
az dedicated-hsm delete --resource-group myRG –-name hsm1
```

### Delete the resource group

If you no longer need the resource group you created for dedicated HSM, you can delete it by running the [az group delete](/cli/azure/group#az_group_delete) command. This command deletes the group and all resources in it, including any that are unrelated to dedicated HSM. The following example deletes the `myRG` resource group and everything in it:

```azurecli-interactive
az group delete --myRG
```

## Next steps

To learn more about Azure Dedicated HSM, see [Azure Dedicated HSM](overview.md).
