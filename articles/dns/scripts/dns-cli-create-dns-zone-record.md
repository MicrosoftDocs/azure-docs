---
title: CLI Example - Create a DNS zone and record for a domain name - Azure | Microsoft Docs
description: This Azure CLI script example shows how to create a DNS zone and record for a domain name
services: load-balancer
documentationcenter: traffic-manager
author: vhorne
manager: jeconnoc
editor: tysonn
tags: 

ms.assetid:
ms.service: traffic-manager
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: 
ms.workload: infrastructure
ms.date: 04/30/2018
ms.author: victorh
---

# Azure CLI script example: Create a DNS zone and record

This Azure CLI script example creates a DNS zone and record for a domain name. 

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

```azurecli-interactive

# Create a resource group.
az group create \
  -n myResourceGroup \
  -l eastus

# Create a DNS zone. Substitute zone name "contoso.com" with the values for your own.

az network dns zone create \
  -g MyResourceGroup \
  -n contoso.com

# Create a DNS record. Substitute zone name "contoso.com" and IP address "1.2.3.4* with the values for your own.

az network dns record-set a add-record \
  -g MyResourceGroup \
  -z contoso.com \
  -n www \
  -a 1.2.3.4

# Get a list the DNS records in your zone
az network dns record-set list \
  -g MyResourceGroup \ 
  -z contoso.com
```

## Clean up deployment 

Run the following command to remove the resource group, DNS zone, and all related resources.

```azurecli
az group delete -n myResourceGroup
```

## Script explanation

This script uses the following commands to create a resource group, virtual machine, availability set, load balancer, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az network dns zone create](/cli/azure/network/dns/zone#az-network-dns-zone-create) | Creates an Azure DNS zone. |
| [az network dns record-set a add-record](/cli/azure/network/dns/record-set) | Adds an *A* record to a DNS zone. |
| [az network dns record-set list](/cli/azure/network/dns/record-set) | List all *A* record sets in a DNS zone. |
| [az group delete](https://docs.microsoft.com/cli/azure/vm/extension#az-vm-extension-set) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

