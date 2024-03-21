---
title: Create a virtual network with encryption - Azure CLI
titleSuffix: Azure Virtual Network
description: Learn how to create an encrypted virtual network using the Azure CLI. A virtual network lets Azure resources communicate with each other and with the internet. 
author: asudbring
ms.service: virtual-network
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 05/24/2023
ms.author: allensu
---

# Create a virtual network with encryption using the Azure CLI

Azure Virtual Network encryption is a feature of Azure Virtual Network. Virtual network encryption allows you to seamlessly encrypt and decrypt internal network traffic over the wire, with minimal effect to performance and scale. Azure Virtual Network encryption protects data traversing your virtual network virtual machine to virtual machine and virtual machine to on-premises.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- The how-to article requires version 2.31.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [az group create](/cli/azure/group#az-group-create) named **test-rg** in the **eastus2** location.

```azurecli-interactive
  az group create \
    --name test-rg \
    --location eastus2
```

## Create a virtual network

In this section, you create a virtual network and enable virtual network encryption.

Use [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create) to create a virtual network.

```azurecli-interactive
  az network vnet create \
    --resource-group test-rg \
    --location eastus2 \
    --name vnet-1 \
    --enable-encryption true \
    --encryption-enforcement-policy allowUnencrypted \
    --address-prefixes 10.0.0.0/16 \
    --subnet-name subnet-1 \
    --subnet-prefixes 10.0.0.0/24 
```

## Enable on existing virtual network

You can also enable encryption on an existing virtual network using [az network vnet update](/cli/azure/network/vnet#az-network-vnet-update).

```azurecli-interactive
  az network vnet update \
    --resource-group test-rg \
    --name vnet-1 \
    --enable-encryption true \
    --encryption-enforcement-policy allowUnencrypted
```

> [!IMPORTANT]
> Azure Virtual Network encryption requires supported virtual machine SKUs in the virtual network for traffic to be encrypted. For more information, see [Azure Virtual Network encryption requirements](virtual-network-encryption-overview.md#requirements).

## Verify encryption enabled

You can check the encryption parameter in the virtual network to verify that encryption is enabled on the virtual network.

Use [az network vnet show](/cli/azure/network/vnet#az-network-vnet-show) to view the encryption parameter for the virtual network you created previously.

```azurecli-interactive
  az network vnet show \
    --resource-group test-rg \
    --name vnet-1 \
    --query encryption \
    --output tsv
```

```output
user@Azure:~$ az network vnet show \
    --resource-group test-rg \
    --name vnet-1 \
    --query encryption \
    --output tsv
True   AllowUnencrypted
```

## Clean up resources

When you're done with the virtual network, use [az group delete](/cli/azure/group#az-group-delete) to remove the resource group and all its resources.

```azurecli-interactive
az group delete \
    --name test-rg \
    --yes
```

## Next steps

- For more information about Azure Virtual Networks, see [What is Azure Virtual Network?](/azure/virtual-network/virtual-networks-overview).

- For more information about Azure Virtual Network encryption, see [What is Azure Virtual Network encryption?](virtual-network-encryption-overview.md).
