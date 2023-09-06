---
title: Create virtual machines in a Flexible scale set using Azure CLI
description: Learn how to create a Virtual Machine Scale Set in Flexible orchestration mode using Azure CLI.
author: fitzgeraldsteele
ms.author: fisteele
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.date: 11/22/2022
ms.reviewer: jushiman
ms.custom: mimckitt, devx-track-azurecli, vmss-flex, devx-track-linux
---

# Create virtual machines in a scale set using Azure CLI

This article steps through using the Azure CLI to create a Virtual Machine Scale Set. 

Make sure that you've installed the latest [Azure CLI](/cli/azure/install-az-cli2) and are logged in to an Azure account with [az login](/cli/azure/reference-index).


## Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. 

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com/cli](https://shell.azure.com/cli). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press enter to run it.


## Create a resource group

Create a resource group with [az group create](/cli/azure/group) as follows:

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```
## Create a Virtual Machine Scale Set
Now create a Virtual Machine Scale Set with [az vmss create](/cli/azure/vmss). The following example creates a scale set with an instance count of *2*, and generates SSH keys.

```azurecli-interactive
az vmss create \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --orchestration-mode Flexible \
  --image <SKU Linux Image> \
  --upgrade-policy-mode automatic \
  --instance-count 2 \
  --admin-username azureuser \
  --generate-ssh-keys
```

## Clean up resources

To remove your scale set and other resources, delete the resource group and all its resources with [az group delete](/cli/azure/group). The `--no-wait` parameter returns control to the prompt without waiting for the operation to complete. The `--yes` parameter confirms that you wish to delete the resources without another prompt to do so.

```azurecli-interactive
az group delete --name myResourceGroup --yes --no-wait
```


## Next steps
> [!div class="nextstepaction"]
> [Learn how to create a scale set in the Azure Portal.](flexible-virtual-machine-scale-sets-portal.md)
