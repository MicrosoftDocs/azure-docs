---
title: 'Quickstart: Deploy a VM at an Azure public MEC using Azure CLI'
description: In this quickstart, learn how to deploy a virtual machine in Azure public multi-access edge compute by using the Azure CLI.
author: reemas-new
ms.author: reemas
ms.service: public-multi-access-edge-compute-mec
ms.topic: quickstart
ms.date: 02/17/2022
ms.custom: devx-track-azurecli
---

# QuickStart: Deploy a VM in Azure public MEC using Azure CLI

In this quickstart, you deploy a virtual machine (VM) in Azure public multi-access edge compute (Azure public MEC). You can also use Azure CLI to deploy other resource types in Azure public MEC.

## Prerequisites

- An Azure account with an allowlisted subscription, which allows you to deploy resources in Azure public MEC. If you don't have an active allowed subscription, contact the [Azure public MEC product team](https://aka.ms/azurepublicmec).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](../../includes/azure-cli-prepare-your-environment-no-header.md)]

> [!NOTE]
> Azure public MEC deployments are supported in Azure CLI versions 2.26 and later.

## Create a linux VM on Azure public MEC

1. Sign in to Azure by using the [az login](/cli/azure/reference-index#az-login) command.

    ```azurecli-interactive
    az login
    ```

1. Set your Azure subscription with the [az account set](/cli/azure/account#az-account-set) command.

    ```azurecli-interactive
    az account set --subscription <subscription name>
    ```

1. Create a resource group with the [az group create](/cli/azure/group#az-group-create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named myResourceGroup.

    ```azurecli-interactive
    az group create \--name myResourceGroup \--location <location>
    ```

    > [!NOTE]
    > Each Azure public MEC site is associated with an Azure region. Based on the Azure public MEC location where the resource needs to be deployed, select the appropriate region value for the `--location` parameter. For more information, see [Regions and availability zones](/azure/availability-zones/az-overview).

1. Create a VM with the [az vm create](/cli/azure/vm#az-vm-create) command. The following example creates a VM named myVMEdge and adds a user account named azureuser at Azure public MEC.

    The `--edge-zone` parameter determines the Azure public MEC location where the VM and its associated resources are created. Specifying `--public-ip-sku Standard` is necessary as Azure public MEC supports only standard SKU for public IP.

    ```azurecli-interactive
    az vm create \--resource-group myResourceGroup \--name myVMEdge \--image
    UbuntuLTS \--admin-username azureuser \--admin-password <password>
    \--edge-zone <edgezone id> \--public-ip-sku Standard
    ```

    It takes a few minutes to create the VM and supporting resources. The following example output shows the VM create operation was successful.

    Note your own publicIpAddress in the output from your myVMEdge VM. Use this address to access the VM in the next steps.

1. Create a jump server in the associated region. To SSH into the Virtual Machine in Azure public MEC, deploy a jump box in an Azure region where your resource group is deployed in step 3.

    Create a VNet by using the [az network vnet](/cli/azure/network/vnet) command and create a VM with the [az vm create](/cli/azure/vm#az-vm-create) command to be deployed in the region. The following example creates a VNet named MyVnetRegion and a VM named myVMRegion at the region.

    ```azurecli-interactive
    az network vnet create --resource-group myResourceGroup --name MyVnetRegion --address-prefix 10.1.0.0/16 --subnet-name MySubnetRegion --subnet-prefix 10.1.0.0/24
    ```

    ```azurecli-interactive
    az vm create --resource-group myResourceGroup --name myVMRegion --image UbuntuLTS --admin-username azureuser --admin-password <password> --vnet-name MyVnetRegion --subnet MySubnetRegion --public-ip-sku Standard
    ```

    > [!NOTE]
    > Use your own publicIpAddress in the output from your myVMregion VM. This address is used to access the VM in the next steps.

1. Accessing the VMs. SSH to the jump box VM deployed in the region using the IP address noted in step 5.

    ```ssh
    ssh azureuser@<regionVM\_publicIP>
    ```

    From the jump box, SSH to the VM created in the Azure public MEC by using the IP address noted in step 4.

    ```ssh
    ssh azureuser@<edgeVM\_publicIP>
    ```

    > [!NOTE]
    > Ensure Azure network security groups allow port 22 access to the VMs.

## Clean up resources

In the preceding steps, you deployed a VM in Azure public MEC by using the Azure CLI. If you don't expect to need these resources in the future, use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, VM, and all related resources. Using the `--yes` parameter deletes the resources without a confirmation prompt.

```azurecli-interactive
az group delete \--name myResourceGroup \--yes
```

## References

Azure CLI reference: [az reference](/cli/azure/reference-index)

## Next steps

> [!div class="nextstepaction"]
> [Azure public MEC overview](tbd.md)
