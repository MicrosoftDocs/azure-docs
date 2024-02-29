---
title: 'Quickstart: Deploy a virtual machine in Azure public MEC using Azure CLI'
description: In this quickstart, learn how to deploy a virtual machine in Azure public multi-access edge (MEC) compute by using the Azure CLI.
author: reemas-new
ms.author: reemas
ms.service: public-multi-access-edge-compute-mec
ms.topic: quickstart
ms.date: 11/22/2022
ms.custom: template-quickstart, devx-track-azurecli
---

# Quickstart: Deploy a virtual machine in Azure public MEC using Azure CLI

In this quickstart, you learn how to use Azure CLI to deploy a Linux virtual machine (VM) in Azure public multi-access edge compute (MEC).

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- Add an allowlisted subscription to your Azure account, which allows you to deploy resources in Azure public MEC. If you don't have an active allowed subscription, contact the [Azure public MEC product team](https://aka.ms/azurepublicmec).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

   > [!NOTE]
   > Azure public MEC deployments are supported in Azure CLI versions 2.26 and later.

## Sign in to Azure and set your subscription

1. Sign in to Azure by using the [az login](/cli/azure/reference-index#az-login) command.

    ```azurecli
    az login
    ```

1. Set your Azure subscription with the [az account set](/cli/azure/account#az-account-set) command.

    ```azurecli
    az account set --subscription <subscription name>
    ```

## Create a resource group

1. Create an Azure resource group with the [az group create](/cli/azure/group#az-group-create) command. A resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named myResourceGroup.

    ```azurecli
    az group create --name myResourceGroup --location <location>
    ```

    > [!NOTE]
    > Each Azure public MEC site is associated with an Azure region. Based on the Azure public MEC location where the resource needs to be deployed, select the appropriate region value for the `--location` parameter. For more information, see [Key concepts for Azure public MEC](key-concepts.md).

## Create a VM

1. Create a VM with the [az vm create](/cli/azure/vm#az-vm-create) command.

   The following example creates a VM named myVMEdge and adds a user account named azureuser at Azure public MEC:

   ```azurecli
   az vm create \--resource-group myResourceGroup \--name myVMEdge \--image Ubuntu2204 \--admin-username azureuser \--admin-password <password> \--edge-zone <edgezone ID> \--public-ip-sku Standard
   ```

   The `--edge-zone` parameter determines the Azure public MEC location where the VM and its associated resources are created. Because Azure public MEC supports only standard SKU for a public IP, you must specify `Standard` for the `--public-ip-sku` parameter.

1. Wait a few minutes for the VM and supporting resources to be created.

   The following example output shows a successful operation:

   ```output
   {
   "fqdns": "",
   "id": "/subscriptions/<id> /resourceGroups/myResourceGroup/providers/Microsoft.Compute/    virtualMachines/myVMEdge",
   "location": "<region>",
   "macAddress": "<mac_address>",
   "powerState": "VM running",
   "privateIpAddress": "10.0.0.4",
   "publicIpAddress": "<public_ip_address>",
   "resourceGroup": "myResourceGroup",
   "zones": ""
   }
   ```

1. Note your `publicIpAddress` value in the output from your myVMEdge VM. Use this address to access the VM in the next sections.

## Create a jump server in the associated region

To use SSH to connect to the VM in Azure public MEC, the best method is to deploy a jump box in the same Azure region where you created your resource group.

1. Create an Azure Virtual Network (VNet) by using the [az network vnet](/cli/azure/network/vnet) command.

   The following example creates a VNet named MyVnetRegion:

    ```azurecli
    az network vnet create --resource-group myResourceGroup --name MyVnetRegion --address-prefix 10.1.0.0/16 --subnet-name MySubnetRegion --subnet-prefix 10.1.0.0/24
    ```

1. Create a VM to be deployed in the region with the [az vm create](/cli/azure/vm#az-vm-create) command.

   The following example creates a VM named myVMRegion in the region:

    ```azurecli
    az vm create --resource-group myResourceGroup --name myVMRegion --image Ubuntu2204 --admin-username azureuser --admin-password <password> --vnet-name MyVnetRegion --subnet MySubnetRegion --public-ip-sku Standard
    ```

1. Note your `publicIpAddress` value in the output from the myVMregion VM. Use this address to access the VM in the next sections.

## Accessing the VMs

1. Use SSH to connect to the jump box VM deployed in the region. Use the IP address from the myVMRegion VM you created in the previous section.

    ```bash
    ssh azureuser@<regionVM_publicIP>
    ```

1. From the jump box, use SSH to connect to the VM you created in Azure public MEC. Use the IP address from the myVMEdge VM you created in the previous section.

    ```bash
    ssh azureuser@<edgeVM_publicIP>
    ```

1. Ensure the Azure network security groups allow port 22 access to the VMs you create.

## Clean up resources

In this quickstart, you deployed a VM in Azure public MEC by using the Azure CLI. If you don't expect to need these resources in the future, use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, VM, and all related resources. Using the `--yes` parameter deletes the resources without a confirmation prompt.

```azurecli
az group delete \--name myResourceGroup \--yes
```

## Next steps

To deploy resources in Azure public MEC using the Go SDK, advance to the following article:

> [!div class="nextstepaction"]
> [Tutorial: Deploy resources in Azure public MEC using the Go SDK](tutorial-create-vm-using-go-sdk.md)
