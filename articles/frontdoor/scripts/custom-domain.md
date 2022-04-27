---
title: "Azure CLI example: Deploy custom domain in Azure Front Door" 
description: Use this Azure CLI example script to deploy a Custom Domain name and TLS certificate on an Azure Front Door front-end. 
services: frontdoor
ms.service: frontdoor
ms.custom: devx-track-azurecli
ms.devlang: azurecli
ms.topic: sample
author: DanielLarsenNZ
ms.author: dalars
ms.date: 04/27/2022 
---

# Azure Front Door: Deploy custom domain

This Azure CLI script example deploys a custom domain name and TLS certificate on an Azure Front Door front-end.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

## Prerequisites

[Host your domain in Azure DNS](../dns/dns-delegate-domain-azure-dns.md) and create a public zone.

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Getting started

To deploy this sample, review and change hardcoded variables as required. Then execute:

The script will:

1. Create a resource group
1. Create a storage account to host a SPA
1. Enable SPA hosting on storage account
1. Upload a "Hello world!" `index.html` file
1. Create a Front Door profile
1. Create a DNS alias for the Apex that resolves to the Front Door
1. Create a CNAME for the `adverify` hostname
1. Create a Front Door front-end endpoint for the custom domain
1. Add route from custom domain frontend to SPA origin
1. Add a routing rule to redirect HTTP -> HTTPS
1. Enable HTTPS with Front Door managed cert

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/azure-front-door/deploy-custom-domain/deploy-custom-domain.sh" id="FullScript":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands. Each command in the table links to command-specific documentation.

| Command | Description |
|---|---|
| [az sql db](/cli/azure/sql/db) | Database commands. |
| [az sql failover-group](/cli/azure/sql/failover-group) | Failover group commands. |

## Next steps

For more information on Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../az-cli-script-samples-content-guide.md).


