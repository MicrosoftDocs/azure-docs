---
title: Create an Azure Content Delivery Network (CDN) profile and endpoint using the Azure CLI
description: The Azure CLI sample scripts to create an Azure Content Delivery Network profile, endpoint, origin group, origin, and custom domain.
author: duongau
ms.author: duau
manager: kumudd
ms.date: 03/20/2024
ms.topic: sample
ms.service: azure-cdn
ms.devlang: azurecli
ms.custom: devx-track-azurecli
ms.tool: azure-cli
---

# Create an Azure Content Delivery Network profile and endpoint using the Azure CLI

As an alternative to the Azure portal, you can use these sample the Azure CLI scripts to manage the following content delivery network operations:

- Create a content delivery network profile.
- Create a content delivery network endpoint.
- Create a content delivery network origin group and make it the default group.
- Create a content delivery network origin.
- Create a custom domain and enable HTTPS.

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample scripts

If you don't already have a resource group for your content delivery network profile, create it with the command `az group create`:

```azurecli
# Create a resource group to use for the content delivery network.
az group create --name MyResourceGroup --location eastus

```

The following the Azure CLI script creates a content delivery network profile and content delivery network endpoint:

```azurecli
# Create a content delivery network profile.
az cdn profile create --resource-group MyResourceGroup --name MyCDNProfile --sku Standard_Microsoft

# Create a content delivery network endpoint.
az cdn endpoint create --resource-group MyResourceGroup --name MyCDNEndpoint --profile-name MyCDNProfile --origin www.contoso.com

```

The following the Azure CLI script creates a content delivery network origin group, sets the default origin group for an endpoint, and creates a new origin:

```azurecli
# Create an origin group.
az cdn origin-group create --resource-group MyResourceGroup --endpoint-name MyCDNEndpoint --profile-name MyCDNProfile --name MyOriginGroup --origins origin-0

# Make the origin group the default group of an endpoint.
az cdn endpoint update --resource-group MyResourceGroup --name MyCDNEndpoint --profile-name MyCDNProfile --default-origin-group MyOriginGroup

# Create another origin for an endpoint.
az cdn origin create --resource-group MyResourceGroup --endpoint-name MyCDNEndpoint --profile-name MyCDNProfile --name origin-1 --host-name example.contoso.com

```

The following the Azure CLI script creates a content delivery network custom domain and enables HTTPS. Before you can associate a custom domain with an Azure content delivery network endpoint, you must first create a canonical name (CNAME) record with Azure DNS or your DNS provider to point to your content delivery network endpoint. For more information, see [Create a CNAME DNS record](../../../cdn/cdn-map-content-to-custom-domain.md#create-a-cname-dns-record).

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

<a name='azure-cli-commands-used-in-this-article'></a>

## The Azure CLI commands used in this article

- [az cdn endpoint create](/cli/azure/cdn/endpoint#az-cdn-endpoint-create)
- [az cdn endpoint update](/cli/azure/cdn/endpoint#az-cdn-endpoint-update)
- [az cdn origin create](/cli/azure/cdn/origin#az-cdn-origin-create)
- [az cdn origin-group create](/cli/azure/cdn/origin-group#az-cdn-origin-group-create)
- [az cdn profile create](/cli/azure/cdn/profile#az-cdn-profile-create)
- [az group create](/cli/azure/group#az-group-create)
- [az group delete](/cli/azure/group#az-group-delete)
- [az cdn custom-domain create](/cli/azure/cdn/custom-domain#az-cdn-custom-domain-create)
- [az cdn custom-domain enable-HTTPS](/cli/azure/cdn/custom-domain#az-cdn-custom-domain-enable-https)
