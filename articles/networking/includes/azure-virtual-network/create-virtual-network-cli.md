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

## Create a virtual network and subnet

Use [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create) to create a virtual network named **\<virtual-network\>** with a subnet named **\<subnet\>** in the **\<resource-group\>** resource group:

```azurecli-interactive
# Variable declarations
virtualNetworkName="vnet-1"       # <virtual-network>
resourceGroupName="test-rg"       # <resource-group>
subnetName="subnet-1"             # <subnet>

az network vnet create \
    --name $virtualNetworkName \
    --resource-group $resourceGroupName \
    --address-prefix 10.0.0.0/16 \
    --subnet-name $subnetName \
    --subnet-prefixes 10.0.0.0/24
```
