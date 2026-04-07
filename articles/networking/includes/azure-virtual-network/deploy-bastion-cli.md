---
title: include file
description: include file
services: virtual-network
author: asudbring
ms.service: azure-virtual-network
ms.topic: include
ms.date: 03/26/2026
ms.author: allensu
ms.custom: include file
---

## Deploy Azure Bastion

Azure Bastion uses your browser to connect to virtual machines in your virtual network over Secure Shell (SSH) or Remote Desktop Protocol (RDP) by using their private IP addresses. The virtual machines don't need public IP addresses, client software, or special configuration.

[!INCLUDE [Pricing](~/reusable-content/ce-skilling/azure/includes/bastion-pricing.md)] For more information about Azure Bastion, see [What is Azure Bastion?](~/articles/bastion/bastion-overview.md).

1. Use [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create) to create a Bastion subnet for your virtual network. This subnet is reserved exclusively for Bastion resources and must be named **AzureBastionSubnet**.

    ```azurecli-interactive
    # Variable declarations
    resourceGroupName="test-rg"       # <resource-group>
    virtualNetworkName="vnet-1"       # <virtual-network>

    az network vnet subnet create \
        --name AzureBastionSubnet \
        --resource-group $resourceGroupName \
        --vnet-name $virtualNetworkName \
        --address-prefix 10.0.1.0/26
    ```

1. Create a public IP address for Bastion. This IP address is used to connect to the Bastion host from the internet. Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a public IP address named **public-ip** in the **\<resource-group\>** resource group:

    ```azurecli-interactive
    # Variable declarations
    resourceGroupName="test-rg"       # <resource-group>
    location="eastus2"                # <region>

    az network public-ip create \
        --resource-group $resourceGroupName \
        --name public-ip \
        --sku Standard \
        --location $location \
        --zone 1 2 3
    ```

1. Use [az network bastion create](/cli/azure/network/bastion#az-network-bastion-create) to create a Bastion host in **AzureBastionSubnet** for your virtual network:

    ```azurecli-interactive
    # Variable declarations
    bastionName="bastion"             # <bastion>
    resourceGroupName="test-rg"       # <resource-group>
    virtualNetworkName="vnet-1"       # <virtual-network>
    location="eastus2"                # <region>

    az network bastion create \
        --name $bastionName \
        --public-ip-address public-ip \
        --resource-group $resourceGroupName \
        --vnet-name $virtualNetworkName \
        --location $location \
        --sku Basic
    ```

It takes about 10 minutes to deploy the Bastion resources. You can create virtual machines in the next section while Bastion deploys to your virtual network.
