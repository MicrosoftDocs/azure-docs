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

When you finish using the virtual network and the virtual machines, use [az group delete](/cli/azure/group#az-group-delete) to remove the resource group and all its resources.

```azurecli-interactive
# Variable declarations
resourceGroupName="test-rg"       # <resource-group>

az group delete \
    --name $resourceGroupName \
    --yes
```
