---
title: 'Cache purging - Azure Front Door - Azure CLI'
description: This article helps you understand how to purge cache on an Azure Front Door Standard and Premium profile using Azure CLI.
services: frontdoor
author: duongau
manager: KumudD
ms.service: frontdoor
ms.topic: how-to
ms.workload: infrastructure-services
ms.custom: devx-track-azurecli
ms.date: 09/20/2022
ms.author: duau
---

# Cache purging in Azure Front Door with Azure CLI

Azure Front Door caches assets until the asset's time-to-live (TTL) expires. Whenever a client requests an asset with expired TTL, the Azure Front Door environment retrieves a new updated copy of the asset to serve the request and then stores the refreshed cache.

Best practice is to make sure your users always obtain the latest copy of your assets. The way to do that is to version your assets for each update and publish them as new URLs. Azure Front Door Standard/Premium will immediately retrieve the new assets for the next client requests. Sometimes you may wish to purge cached contents from all edge nodes and force them all to retrieve new updated assets. The reason you want to purge cached contents is because you've made new updates to your application, or you want to update assets that contain incorrect information.


[!INCLUDE [azure-cli-prepare-your-environment](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

* Review [Caching with Azure Front Door](../front-door-caching.md) to understand how caching works.
* Have a functioning Azure Front Door profile. Refer to [Create a Front Door - CLI](../create-front-door-cli.md) to learn how to create one.

## Configure cache purge

Run [az afd endpoint purge](/cli/azure/afd/endpoint#az-afd-endpoint-purge) to purge cache after inputting the necessary parameters like:
   * Name of resource group  
   * Name of the Azure Front Door profile within the resource group with assets you want to purge
   * Endpoints with assets you want to purge
   * Domains/Subdomains with assets you want to purge

       > [!IMPORTANT]
       > Cache purge for wildcard domains is not supported, you have to specify a subdomain for cache purge for a wildcard domain. You can add as many single-level subdomains of the wildcard domain. For example, for the wildcard domain `*.afdxgatest.azfdtest.xyz`, you can add subdomains in the form of `contoso.afdxgatest.azfdtest.xyz` or `cart.afdxgatest.azfdtest.xyz` and so on. For more information, see [Wildcard domains in Azure Front Door](../front-door-wildcard-domain.md).

   * The path to the content to be purged.
     * These formats are supported in the lists of paths to purge:
       * **Single path purge**: Purge individual assets by specifying the full path of the asset (without the protocol and domain), with the file extension, for example, /pictures/strasbourg.png.
       * **Root domain purge**: Purge the root of the endpoint with "/*" in the path.

```azurecli-interactive
az afd endpoint purge \
   --resource-group myRGFD \
   --profile-name contosoafd \
   --endpoint-name myendpoint \
   --domains www.contoso.com \
   --content-paths '/scripts/*'
```
Cache purges on the Azure Front Door profile are case-insensitive. Additionally, they're query string agnostic, which means to purge a URL will purge all query-string variations of it. 

> [!NOTE]
> Cache purging can takes up to 10 mins to propagate throughout the network and across all edge locations.

## Next steps

Learn how to [create an Azure Front Door profile](../create-front-door-portal.md).
