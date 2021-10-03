---
title: Create a DNS zone and record for a domain name - Azure CLI - Azure DNS
description: This Azure CLI script example shows how to create a DNS zone and record for a domain name
services: dns
author: rohinkoul
ms.service: dns
ms.topic: sample
ms.date: 09/20/2019
ms.author: rohink 
ms.custom: devx-track-azurecli
---

# Azure CLI script example: Create a DNS zone and record

This Azure CLI script example creates a DNS zone and record for a domain name. 

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/dns/create-dns-zone-and-record/create-dns-zone-and-record.sh "Create DNS zone and record")]

## Clean up deployment 

Run the following command to remove the resource group, DNS zone, and all related resources.

```azurecli
az group delete -n myResourceGroup
```

## Script explanation

This script uses the following commands to create a resource group, virtual machine, availability set, load balancer, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az_group_create) | Creates a resource group in which all resources are stored. |
| [az network dns zone create](/cli/azure/network/dns/zone#az_network_dns_zone_create) | Creates an Azure DNS zone. |
| [az network dns record-set a add-record](/cli/azure/network/dns/record-set) | Adds an *A* record to a DNS zone. |
| [az network dns record-set list](/cli/azure/network/dns/record-set) | List all *A* record sets in a DNS zone. |
| [az group delete](/cli/azure/vm/extension#az_vm_extension_set) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).