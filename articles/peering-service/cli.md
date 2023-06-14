---
title: Create, change, or delete a Peering Service connection - Azure CLI 
description: Learn how to create, change, or delete a Peering Service connection using the Azure CLI.
services: peering-service
author: halkazwini
ms.service: peering-service
ms.topic: how-to
ms.date: 01/19/2023
ms.author: halkazwini
ms.custom: template-how-to, engagement-fy23, devx-track-azurecli
---

# Create, change, or delete a Peering Service connection using the Azure CLI

> [!div class="op_single_selector"]
> * [Portal](azure-portal.md)
> * [PowerShell](powershell.md)
> * [Azure CLI](cli.md)

Azure Peering Service is a networking service that enhances customer connectivity to Microsoft cloud services such as Microsoft 365, Dynamics 365, software as a service (SaaS) services, Azure, or any Microsoft services accessible via the public internet.

In this article, you'll learn how to create, change, and delete a Peering Service connection using the Azure CLI.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [azure-cli-prepare-your-environment-h3.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

If you decide to install and use Azure CLI locally, this article requires you to use version 2.0.28 or later of the Azure CLI. Run [az version](/cli/azure/reference-index#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index#az-upgrade). If using Azure Cloud Shell, the latest version is already installed.

## Prerequisites 

- An Azure subscription.

- A connectivity provider. For more information, see [Peering Service partners](./location-partners.md).

## Register your subscription with the resource provider and feature flag

Before you proceed to the steps of creating the Peering Service connection, register your subscription with the resource provider and feature flag using [az feature register](/cli/azure/feature#az-feature-register) and [az provider register](/cli/azure/provider#az-provider-register):

```azurecli-interactive
az feature register --namespace Microsoft.Peering --name AllowPeeringService
az provider register --name Microsoft.Peering
```

## List Peering Service locations and service providers 

Use [az peering service country list](/cli/azure/peering/service/country#az-peering-service-country-list) to list the countries/regions where Peering Service is available and [az peering service location list](/cli/azure/peering/service/location#az-peering-service-location-list) to list the available metro locations in a specific country where you can get the Peering Service:

```azurecli-interactive
# List the countries/regions available for Peering Service.
az peering service country list --out table
# List metro locations serviced in a country
az peering service location list --country "united states" --output table
```

Use [az peering service provider list](/cli/azure/peering/service/provider#az-peering-service-provider-list) to get a list of available [Peering Service providers](location-partners.md):

```azurecli-interactive
az peering service provider list --output table
```

## Create a Peering Service connection

Create a Peering Service connection using [az peering service create](/cli/azure/peering/service#az-peering-service-create):

```azurecli-interactive
az peering service create --location "eastus" --peering-service-name "myPeeringService" --resource-group "myResourceGroup" --peering-service-location "Virginia" --peering-service-provider "Contoso"
```

## Add the Peering Service prefix

Use [az peering service prefix create](/cli/azure/peering/service/prefix#az-peering-service-prefix-create) to add the prefix provided to you by the connectivity provider:

```azurecli-interactive
az peering service prefix create --peering-service-name "myPeeringService" --prefix-name "myPrefix" --resource-group "myResourceGroup" --peering-service-prefix-key "00000000-0000-0000-0000-000000000000" --prefix "240.0.0.0/32"
```

## List all Peering Services connections

To view the list of all Peering Service connections, use [az peering service list](/cli/azure/peering/service#az-peering-service-list):

```azurecli-interactive
az peering service list --resource-group "myresourcegroup" --output "table"
```

## List all Peering Service prefixes

To view the list of all Peering Service prefixes, use [az peering service prefix list](/cli/azure/peering/service/prefix#az-peering-service-prefix-list):

```azurecli-interactive
az peering service prefix list --peering-service-name "myPeeringService" --resource-group "myResourceGroup"
```

## Remove the Peering Service prefix

To remove a Peering Service prefix, use [az peering service prefix delete](/cli/azure/peering/service/prefix#az-peering-service-prefix-delete):

```azurecli-interactive
az peering service prefix delete --peering-service-name "myPeeringService" --prefix-name "myPrefix" --resource-group "myResourceGroup"
```

## Delete a Peering Service connection

To delete a Peering Service connection, use [az peering service delete](/cli/azure/peering/service#az-peering-service-delete):

```azurecli-interactive
az peering service delete --peering-service-name "myPeeringService" --resource-group "myResourceGroup"
```

## Next steps

- To learn more about Peering Service connections, see [Peering Service connection](connection.md).
- To learn more about Peering Service connection telemetry, see [Access Peering Service connection telemetry](connection-telemetry.md).