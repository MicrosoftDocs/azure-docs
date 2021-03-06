---
title: Create an Azure Content Delivery Network (CDN) profile and endpoint 
description: Azure CLI samples to create an Azure CDN profile, endpoint, origin group, origin, and custom domain.
author: asudbring
ms.author: allensu
manager: danielgi
ms.date: 03/05/2021
ms.topic: sample
ms.service: azure-cdn
ms.devlang: azurecli 
ms.custom: devx-track-azurecli
---

# Create an Azure CDN profile and endpoint

To use Azure Content Delivery Network (CDN) to deliver content, you must create at least one CDN profile and one CDN endpoint. An endpoint represents a specific configuration of content delivery behavior and access. To deliver content, an endpoint must have an origin, specified as a host name.

Instead of using the Azure portal, you can manage the following CDN operations with Azure CLI commands:

- Create a resource group.
- Create a CDN profile.
- Create a CDN endpoint.
- Create a CDN origin group.
- Create a CDN origin.
- Create a custom domain
- Enable HTTPS on a custom domain.

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../../includes/azure-cli-prepare-your-environment.md)]

## Sample script

The following Azure CLI script creates a resource group, CDN profile, and CDN endpoint:

```azurecli
# Create a resource group
az group create --name MyResourceGroup --location eastus

# Create a CDN profile
az cdn profile create --resource-group MyResourceGroup --name MyCDNProfile --sku Standard_Verizon

# Create a CDN endpoint
az cdn endpoint create --resource-group MyResourceGroup --name MyCDNEndpoint --profile-name MyCDNProfile --origin www.contoso.com
```

The following Azure CLI script creates a CDN origin group, sets the default origin group for an endpoint, and creates a new origin:

```azurecli
# Create an origin group
az cdn origin-group create --resource-group MyResourceGroup --endpoint-name MyCDNEndpoint --profile-name MyCDNProfile --name MyOriginGroup --origins origin-0

# Make the origin group the default group of an endpoint
az cdn endpoint update --resource-group MyResourceGroup --name MyCDNEndpoint --profile-name MyCDNProfile --default-origin-group MyOriginGroup
                           
# Create another origin for an endpoint
az cdn origin create --resource-group MyResourceGroup --endpoint-name MyCDNEndpoint --profile-name MyCDNProfile --name origin-1 --host-name example.contoso.com
```

The following Azure CLI script creates a CDN custom domain, and then enables HTTPS on it. Before you can associate a custom domain with an Azure CDN endpoint, you must first create a canonical name (CNAME) record with Azure DNS or your DNS provider to point to your CDN endpoint. For more information, see [Create a CNAME DNS record](../../../cdn/cdn-map-content-to-custom-domain.md#create-a-cname-dns-record).

```azurecli
# Associate a custom domain with an endpoint.
az cdn custom-domain create --resource-group MyResourceGroup --endpoint-name MyCDNEndpoint --profile-name MyCDNProfile --name MyCustomDomainName --hostname www.example.com

# Enable HTTPS on the custom domain.
az cdn custom-domain enable-https --resource-group MyResourceGroupCDN --endpoint-name MyCDNEndpoint --profile-name MyCDNProfile  --name custom-domain
```

## Clean up resources

After you've finished running the script sample, use the following command to remove the resource group and all resources associated with it.

```azurecli
az group delete --name MyResourceGroup
```

## Azure CLI references used in this article

- [az cdn endpoint create](https://docs.microsoft.com/cli/azure/cdn/endpoint#az_cdn_endpoint_create)
- [az cdn endpoint update](https://docs.microsoft.com/cli/azure/cdn/endpoint#az_cdn_endpoint_update)
- [az cdn origin create](https://docs.microsoft.com/cli/azure/cdn/origin#az_cdn_origin_create)
- [az cdn origin-group create](https://docs.microsoft.com/cli/azure/cdn/origin-group#az_cdn_origin_group_create)
- [az cdn profile create](https://docs.microsoft.com/cli/azure/cdn/profile#az_cdn_profile_create)
- [az group create](https://docs.microsoft.com/cli/azure/group#az_group_create)
- [az cdn custom-domain create](https://docs.microsoft.com/cli/azure/cdn/custom-domain#az_cdn_custom_domain_create)
- [az cdn custom-domain enable-https](https://docs.microsoft.com/cli/azure/cdn/custom-domain#az_cdn_custom_domain_enable_https)