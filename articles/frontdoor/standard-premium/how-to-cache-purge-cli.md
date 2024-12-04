---
title: 'Cache purging - Azure Front Door - Azure CLI'
description: This article helps you understand how to purge cache on an Azure Front Door Standard and Premium profile using Azure CLI.
services: frontdoor
author: duongau
manager: KumudD
ms.service: azure-frontdoor
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 11/18/2024
ms.author: duau
---

# Cache Purging in Azure Front Door Using Azure CLI

Azure Front Door caches assets until their time-to-live (TTL) expires. When a client requests an asset with an expired TTL, Azure Front Door retrieves a new copy of the asset, serves the request, and updates the cache.

To ensure users always get the latest assets, version your assets for each update and publish them with new URLs. Azure Front Door fetches the new assets for subsequent client requests. Sometimes, you might need to purge cached content from all edge nodes to force them to retrieve updated assets. This action is useful when updates are made to your application or need to correct incorrect information.

[!INCLUDE [azure-cli-prepare-your-environment](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

* Review [Caching with Azure Front Door](../front-door-caching.md) to understand how caching works.
* Ensure you have a functioning Azure Front Door profile. Refer to [Create an Azure Front Door - CLI](../create-front-door-cli.md) to learn how to create one.

## Configure Cache Purge

Run [az afd endpoint purge](/cli/azure/afd/endpoint#az-afd-endpoint-purge) with the necessary parameters:

* Resource group name
* Azure Front Door profile name within the resource group
* Endpoints with assets to purge
* Domains/Subdomains with assets to purge

> [!IMPORTANT]
> Cache purge for wildcard domains is not supported. Specify a subdomain for cache purge for a wildcard domain. You can add multiple single-level subdomains of the wildcard domain. For example, for the wildcard domain `*.afdxgatest.azfdtest.xyz`, you can add subdomains like `contoso.afdxgatest.azfdtest.xyz` or `cart.afdxgatest.azfdtest.xyz`. For more information, see [Wildcard domains in Azure Front Door](../front-door-wildcard-domain.md).

* Path to the content to be purged:
   * Supported formats:
      * **Single path purge**: Specify the full path of the asset (without the protocol and domain), including the file extension, for example, /pictures/strasbourg.png.
      * **Root domain purge**: Purge the root of the endpoint with "/*" in the path.

```azurecli-interactive
az afd endpoint purge \
    --resource-group myRGFD \
    --profile-name contosoafd \
    --endpoint-name myendpoint \
    --domains www.contoso.com \
    --content-paths '/scripts/*'
```

Cache purges on the Azure Front Door profile are case-insensitive and query string agnostic, meaning to purge a URL purges all its query-string variations.

> [!NOTE]
> Cache purging can take up to 10 minutes to propagate throughout the network and across all edge locations.

## Next steps

To continue, learn how to [create an Azure Front Door profile](../create-front-door-portal.md).
