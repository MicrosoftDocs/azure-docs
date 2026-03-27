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

## Create a resource group

Use [az group create](/cli/azure/group#az-group-create) to create a resource group to host the virtual network. Use the following code to create a resource group named **\<resource-group\>** in the **\<region\>** Azure region:

```azurecli-interactive
# Variable declarations
resourceGroupName="test-rg"       # <resource-group>
location="eastus2"                # <region>

az group create \
    --name $resourceGroupName \
    --location $location
```
