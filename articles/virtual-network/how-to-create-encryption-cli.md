---
title: Create a virtual network with encryption - Azure CLI
titleSuffix: Azure Virtual Network
description: Learn how to create an encrypted virtual network using the Azure CLI. A virtual network lets Azure resources communicate with each other and with the internet. 
author: asudbring
ms.service: virtual-network
ms.topic: how-to
ms.date: 05/24/2023
ms.author: allensu

---

# Create a virtual network with encryption using the Azure CLI

Azure Virtual Network encryption is a feature of Azure Virtual Network. Virtual network encryption allows you to seamlessly encrypt and decrypt internal network traffic over the wire, with minimal effect to performance and scale. Azure Virtual Network encryption protects data traversing your virtual network virtual machine to virtual machine and virtual machine to on-premises.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- The how-to article requires version 2.31.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [az group create](/cli/azure/group#az-group-create) named **myResourceGroup** in the **eastus2** location.

```azurecli-interactive
  az group create \
    --name myResourceGroup \
    --location eastus2
```

## Create a virtual network

In this section, you create a virtual network and enable virtual network encryption.

There are two options for the parameter **`--encryption-enforcement-policy`**:

- **DropUnencrypted** - In this scenario, network traffic that isn’t encrypted by the underlying hardware is **dropped**. The traffic drop happens if a virtual machine, such as an A-series or B-series, or an older D-series such as Dv2, is in the virtual network.

- **AllowUnencrypted** - In this scenario, network traffic that isn’t encrypted by the underlying hardware is allowed. This scenario allows incompatible virtual machine sizes to communicate with compatible virtual machine sizes.

Use [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create) to create a virtual network.

```azurecli-interactive
  az network vnet create \
    --resource-group myResourceGroup \
    --location eastus2 \
    --name myVNet \
    --enable-encryption true \
    --encryption-enforcement-policy dropUnencrypted \
    --address-prefixes 10.0.0.0/16 \
    --subnet-name myBackendSubnet \
    --subnet-prefixes 10.0.0.0/24 
```

> [!IMPORTANT]
> Azure Virtual Network encryption requires supported virtual machine SKUs in the virtual network for traffic to be encrypted. The setting **dropUnencrypted** will drop traffic between unsupported virtual machine SKUs if they are deployed in the virtual network. For more information, see [Azure Virtual Network encryption requirements](virtual-network-encryption-overview.md#requirements).

## Verify encryption enabled

You can check the encryption parameter in the virtual network to verify that encryption is enabled on the virtual network.

Use [az network vnet show](/cli/azure/network/vnet#az-network-vnet-show) to view the encryption parameter for the virtual network you created previously.

```azurecli-interactive
  az network vnet show \
    --resource-group myResourceGroup \
    --name myVNet \
    --query encryption \
    --output tsv
```

```azurecli-interactive
user@Azure:~$ az network vnet show \
    --resource-group myResourceGroup \
    --name myVNet \
    --query encryption \
    --output tsv
True   DropUnencrypted
```

## Next steps

- For more information about Azure Virtual Networks, see [What is Azure Virtual Network?](/azure/virtual-network/virtual-networks-overview).

- For more information about Azure Virtual Network encryption, see [What is Azure Virtual Network encryption?](virtual-network-encryption-overview.md).
