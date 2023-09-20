---
title: Create an Azure Content Delivery Network (CDN) profile and endpoint using the Azure CLI
description: Azure CLI sample scripts to create an Azure CDN profile, endpoint, origin group, origin, and custom domain.
author: duongau
ms.author: duau
manager: kumudd
ms.date: 02/27/2023
ms.topic: sample
ms.service: azure-cdn
ms.devlang: azurecli
ms.custom: devx-track-azurecli
ms.tool: azure-cli
---

# Create an Azure CDN profile and endpoint using the Azure CLI

As an alternative to the Azure portal, you can use these sample Azure CLI scripts to manage the following CDN operations:

- Create a CDN profile.
- Create a CDN endpoint.
- Create a CDN origin group and make it the default group.
- Create a CDN origin.
- Create a custom domain and enable HTTPS.

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample scripts

If you don't already have a resource group for your CDN profile, create it with the command `az group create`:

```azurecli
# Create a resource group to use for the CDN.
az group create --name MyResourceGroup --location eastus

```

The following Azure CLI script creates a CDN profile and CDN endpoint:

```azurecli
# Create a CDN profile.
az cdn profile create --resource-group MyResourceGroup --name MyCDNProfile --sku Standard_Microsoft

# Create a CDN endpoint.
az cdn endpoint create --resource-group MyResourceGroup --name MyCDNEndpoint --profile-name MyCDNProfile --origin www.contoso.com

```

The following Azure CLI script creates a CDN origin group, sets the default origin group for an endpoint, and creates a new origin:

```azurecli
# Create an origin group.
az cdn origin-group create --resource-group MyResourceGroup --endpoint-name MyCDNEndpoint --profile-name MyCDNProfile --name MyOriginGroup --origins origin-0

# Make the origin group the default group of an endpoint.
az cdn endpoint update --resource-group MyResourceGroup --name MyCDNEndpoint --profile-name MyCDNProfile --default-origin-group MyOriginGroup
                           
# Create another origin for an endpoint.
az cdn origin create --resource-group MyResourceGroup --endpoint-name MyCDNEndpoint --profile-name MyCDNProfile --name origin-1 --host-name example.contoso.com

```

The following Azure CLI script creates a CDN custom domain and enables HTTPS. Before you can associate a custom domain with an Azure CDN endpoint, you must first create a canonical name (CNAME) record with Azure DNS or your DNS provider to point to your CDN endpoint. For more information, see [Create a CNAME DNS record](../../../cdn/cdn-map-content-to-custom-domain.md#create-a-cname-dns-record).

```azurecli
# Associate a custom domain with an endpoint.
az cdn custom-domain create --resource-group MyResourceGroup --endpoint-name MyCDNEndpoint --profile-name MyCDNProfile --name MyCustomDomain --hostname www.example.com

# Enable HTTPS on the custom domain.
az cdn custom-domain enable-https --resource-group MyResourceGroup --endpoint-name MyCDNEndpoint --profile-name MyCDNProfile --name MyCustomDomain

```

## Clean up resources

After you've finished running the sample scripts, use the following command to remove the resource group and all resources associated with it.

```azurecli
# Delete the resource group.
az group delete --name MyResourceGroup

```

## Azure CLI commands used in this article

- [az cdn endpoint create](/cli/azure/cdn/endpoint#az-cdn-endpoint-create)
- [az cdn endpoint update](/cli/azure/cdn/endpoint#az-cdn-endpoint-update)
- [az cdn origin create](/cli/azure/cdn/origin#az-cdn-origin-create)
- [az cdn origin-group create](/cli/azure/cdn/origin-group#az-cdn-origin-group-create)
- [az cdn profile create](/cli/azure/cdn/profile#az-cdn-profile-create)
- [az group create](/cli/azure/group#az-group-create)
- [az group delete](/cli/azure/group#az-group-delete)
- [az cdn custom-domain create](/cli/azure/cdn/custom-domain#az-cdn-custom-domain-create)
- [az cdn custom-domain enable-https](/cli/azure/cdn/custom-domain#az-cdn-custom-domain-enable-https)
