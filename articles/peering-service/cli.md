---
title: Create, change, or delete a Peering Service connection - Azure CLI 
description: Learn how to create, change, or delete a Peering Service connection using the Azure CLI.
author: halkazwini
ms.author: halkazwini
ms.service: peering-service
ms.topic: how-to
ms.date: 02/08/2024
ms.custom: devx-track-azurecli

#CustomerIntent: As an administrator, I want to learn how to create and manage a Peering Service connection using the Azure CLI so I can enhance the connectivity to Microsoft services over the public internet.
---

# Create, change, or delete a Peering Service connection using the Azure CLI

Azure Peering Service is a networking service that enhances customer connectivity to Microsoft cloud services such as Microsoft 365, Dynamics 365, software as a service (SaaS) services, Azure, or any Microsoft services accessible via the public internet.

In this article, you learn how to create, change, and delete a Peering Service connection using the Azure CLI. To learn how to manage a Peering Service connection using the Azure portal or Azure PowerShell, see [Create, change, or delete a Peering Service connection using the Azure portal](azure-portal.md) or [Create or change a Peering Service connection using PowerShell](powershell.md).

## Prerequisites 

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Azure Cloud Shell or Azure CLI installed locally.

    The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloudshell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. This article requires the Azure CLI version 2.0.28 or later. Run [az version](/cli/azure/reference-index#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index#az-upgrade). If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.

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

## Related content

- To learn more about Peering Service connections, see [Peering Service connection](connection.md).
- To learn more about Peering Service connection telemetry, see [Access Peering Service connection telemetry](connection-telemetry.md).