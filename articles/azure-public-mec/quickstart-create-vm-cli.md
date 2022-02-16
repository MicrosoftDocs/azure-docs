---

title: Deploy a VM at an Azure public MEC using Azure CLI
description: Learn how to deploy a VM in Azure public MEC using Azure CLI.
author: reemas-new
ms.author: reemas
ms.service: public-multi-access-edge-compute-mec
ms.topic: quickstart
ms.date: 02/14/2022

---

# QuickStart: Deploy a VM in Azure public MEC using Azure CLI

In this quickstart, you'll deploy a Virtual Machine in Azure public multi-access edge compute. Azure CLI can be leveraged to deploy other resource types in Azure public MEC as well.

## Prerequisites

- [Azure CLI overview](/cli/azure/what-is-azure-cli?).

- [Install Azure CLI ](/cli/azure/install-azure-cli?)

- An Azure account with an allowlisted subscription, which allows you to deploy resources in Azure public MEC. If you don't have an active allowed subscription, contact the [Azure public MEC product team](https://aka.ms/azurepublicmec).

> [!NOTE]
> Starting version 2.26.0 Edgezone deployment are supported via CLI.

## Create a linux VM on Azure public MEC

1. Sign in to Azure using the az login command.

    ```azurecli-interactive
    az login
    ```

1. Set the right subscription in case you have multiple subscriptions using
the [az account set](/cli/azure/account?) command.

    ```azurecli-interactive
    az account set -s \<subscription name\>
    ```

1. Create a resource group with the [az group create](/cli/azure/group?) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named myResourceGroup.

    ```azurecli-interactive
    az group create \--name myResourceGroup \--location \<location\>
    ```

    > [!NOTE]
    > Each Azure public MEC site is associated to an Azure Region. Based on the Azure public MEC location where the resource needs to be deployed, select the appropriate region value for the location field in above command. The mapping can be obtained here.

1. Create a VM with the [az vm create](/cli/azure/vm?) command. The following example creates a VM named myVMEdge and adds a user account named azureuser at Azure public MEC.

    `edge-zone` parameter determines the Azure public MEC location where the VM and its associated resources will be created. Specifying `\--public-ip-sku` Standard is necessary as Azure public MEC only supports standard SKU for public IP.

    ```azurecli-interactive
    az vm create \--resource-group myResourceGroup \--name myVMEdge \--image
    UbuntuLTS \--admin-username azureuser \--admin-password \<password\>
    \--edge-zone \<edgezone id\> \--public-ip-sku Standard
    ```

    It takes a few minutes to create the VM and supporting resources. The following example output shows the VM create operation was successful.
    
    Note your own publicIpAddress in the output from your myVMEdge VM. This address is used to access the VM in the next steps.

1. Create Jump server in the associated region. To SSH into the Virtual Machine in Azure public MEC, we recommend deploying a jump box in an Azure region where your resource group is deployed in step 3.

    Create a VNet using the [az network > vnet](/cli/azure/network/vnet?) command and VM with the [az vm create](/cli/azure/vm?) command to be deployed in the region. The following example creates a VNet named MyVnetRegion and a VM named myVMRegion at the region.

    ```azurecli-interactive
    az network vnet create --resource-group myResourceGroup --name MyVnetRegion --address-prefix 10.1.0.0/16 --subnet-name MySubnetRegion --subnet-prefix 10.1.0.0/24
    ```
    
    ```azurecli-interactive
    az vm create --resource-group myResourceGroup --name myVMRegion --image UbuntuLTS --admin-username azureuser --admin-password <password> --vnet-name MyVnetRegion --subnet MySubnetRegion --public-ip-sku Standard
    ```
    
    > [!NOTE]
    > Your own publicIpAddress in the output from your myVMregion VM. This address is used to access the VM in the next steps.

1. Accessing the VMs. SSH to the Jump box Virtual Machine deployed in the region using the IP address noted in step 5.

    ```
    ssh azureuser@\<regionVM\_publicIP\>
    ```
    
    From the jump box you can then SSH to the Virtual Machine created in the Azure public MEC using the IP address noted in step 4.
    
    ```
    ssh azureuser@\<edgeVM\_publicIP\>
    ```
    
    > [!NOTE]
    > Please make sure NSG are open to allow port 22 access to respective VM's.

## Clean up resources

When no longer needed, you can use the [az group delete](/cli/azure/group?) command to remove the resource group, VM, and all related resources.

```azurecli-interactive
az group delete \--name myResourceGroup

```

## References

Azure CLI reference: [az \| Microsoft
Docs](/cli/azure/reference-index?).

## Next steps

> [!div class="nextstepaction"]
> [Azure public MEC overview](tbd.md)