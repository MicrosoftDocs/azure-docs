---
title: Add a dual-stack network to an existing virtual machine - Azure CLI
titleSuffix: Azure Virtual Network
description: Learn how to add a dual-stack network to an existing virtual machine using the Azure CLI.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.date: 08/24/2023
ms.custom: template-how-to, devx-track-azurecli 
ms.devlang: azurecli
---

# Add a dual-stack network to an existing virtual machine using the Azure CLI

In this article, you add IPv6 support to an existing virtual network. You configure an existing virtual machine with both IPv4 and IPv6 addresses. When completed, the existing virtual network supports private IPv6 addresses. The existing virtual machine network configuration contains a public and private IPv4 and IPv6 address. 

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This tutorial requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

- An existing virtual network, public IP address and virtual machine in your subscription that is configured for IPv4 support only. For more information about creating a virtual network, public IP address and a virtual machine, see [Quickstart: Create a Linux virtual machine with the Azure CLI](../../virtual-machines/linux/quick-create-cli.md).

    - The example virtual network used in this article is named **myVNet**. Replace this value with the name of your virtual network.
    
    - The example virtual machine used in this article is named **myVM**. Replace this value with the name of your virtual machine.
    
    - The example public IP address used in this article is named **myPublicIP**. Replace this value with the name of your public IP address.

## Add IPv6 to virtual network

In this section, you add an IPv6 address space and subnet to your existing virtual network.

Use [az network vnet update](/cli/azure/network/vnet#az-network-vnet-update) to update the virtual network.

```azurecli-interactive
az network vnet update \
    --address-prefixes 10.0.0.0/16 2404:f800:8000:122::/63 \
    --resource-group myResourceGroup \
    --name myVNet
```

Use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) to create the subnet.

```azurecli-interactive
az network vnet subnet update \
    --address-prefixes 10.0.0.0/24 2404:f800:8000:122::/64 \
    --name myBackendSubnet \
    --resource-group myResourceGroup \
    --vnet-name myVNet
```

## Create IPv6 public IP address

In this section, you create a IPv6 public IP address for the virtual machine.

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create the public IP address.

```azurecli-interactive
  az network public-ip create \
    --resource-group myResourceGroup \
    --name myPublicIP-Ipv6 \
    --sku Standard \
    --version IPv6 \
    --zone 1 2 3
```
## Add IPv6 configuration to virtual machine

Use [az network nic ip-config create](/cli/azure/network/nic/ip-config#az-network-nic-ip-config-create) to create the IPv6 configuration for the NIC. The **`--nic-name`** used in the example is **myvm569**. Replace this value with the name of the network interface in your virtual machine.

```azurecli-interactive
  az network nic ip-config create \
    --resource-group myResourceGroup \
    --name Ipv6config \
    --nic-name myvm569 \
    --private-ip-address-version IPv6 \
    --vnet-name myVNet \
    --subnet myBackendSubnet \
    --public-ip-address myPublicIP-IPv6
```

## Next steps

In this article, you learned how to create an Azure Virtual machine with a dual-stack network.

For more information about IPv6 and IP addresses in Azure, see:

- [Overview of IPv6 for Azure Virtual Network.](ipv6-overview.md)

- [What is Azure Virtual Network IP Services?](ip-services-overview.md)