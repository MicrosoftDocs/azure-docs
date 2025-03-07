---
title: "Azure CLI example: Deploy custom domain in Azure Front Door"
description: Use this Azure CLI example script to deploy a Custom Domain name and TLS certificate on an Azure Front Door front-end.
services: frontdoor
ms.service: azure-frontdoor
ms.custom: devx-track-azurecli
ms.devlang: azurecli
ms.topic: sample
author: duongau
ms.author: duau
ms.date: 11/18/2024
---

# Azure Front Door: Deploy custom domain

[!INCLUDE [Azure Front Door (classic) retirement notice](../../../includes/front-door-classic-retirement.md)]
This Azure CLI script example demonstrates how to deploy a custom domain name and TLS certificate on an Azure Front Door front-end. The script automates the provisioning of Azure Front Door with a custom domain name (hosted by Azure DNS) and a TLS certificate.

> [!IMPORTANT]
> Ensure that an Azure DNS public zone already exists for your domain name. For a tutorial, see [Host your domain in Azure DNS](../../dns/dns-delegate-domain-azure-dns.md).

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](~/reusable-content/ce-skilling/azure/includes/cli-launch-cloud-shell-sign-in.md)]

### Getting started

The script will:

1. Create a resource group.
1. Create a storage account to host a single-page application (SPA).
1. Enable SPA hosting on the storage account.
1. Upload a "Hello world!" `index.html` file.
1. Create a Front Door profile.
1. Create a DNS alias for the Apex that resolves to the Front Door.
1. Create a CNAME for the `adverify` hostname.
1. Create a Front Door front-end endpoint for the custom domain.
1. Add a route from the custom domain front-end to the SPA origin.
1. Add a routing rule to redirect HTTP to HTTPS.
1. Enable HTTPS with a Front Door managed certificate.

### Run the script

To run this script, copy the following code to a `.sh` file, change the hardcoded variables to your domain values, and then execute the following command to pass these variables into the script:

```sh
AZURE_DNS_ZONE_NAME=www.contoso.com AZURE_DNS_ZONE_RESOURCE_GROUP=contoso-rg ./deploy-custom-apex-domain.sh
```

:::code language="azurecli" source="~/azure_cli_scripts/azure-front-door/deploy-custom-domain/deploy-custom-domain.sh" id="FullScript":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](~/reusable-content/ce-skilling/azure/includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands. Each command in the table links to command-specific documentation.

| Command | Description |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group to store all resources. |
| [az storage account create](/cli/azure/storage/account) | Creates an Azure Storage account in the specified resource group. |
| [az storage blob service-properties update](/cli/azure/storage/blob/service-properties#az-storage-blob-service-properties-update) | Updates storage blob service properties. |
| [az storage blob upload](/cli/azure/storage/blob#az-storage-blob-upload) | Uploads a blob to a container. |
| [az storage account show](/cli/azure/storage/account#az-storage-account-show) | Shows storage account properties. |
| [az network front-door create](/cli/azure/network/front-door#az-network-front-door-create) | Creates a Front Door. |
| [az network dns record-set](/cli/azure/network/dns/record-set) | Manages DNS records and record sets. |
| [az network front-door](/cli/azure/network/front-door) | Manages Front Doors. |

## Next steps

For more information on Azure CLI, see [Azure CLI documentation](/cli/azure).
