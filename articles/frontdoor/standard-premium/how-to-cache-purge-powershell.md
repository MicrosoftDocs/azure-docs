---
title: 'Cache purging - Azure Front Door - Azure PowerShell'
description: Learn how to purge cache on an Azure Front Door Standard or Premium profile using Azure PowerShell.
services: frontdoor
author: duongau
manager: KumudD
ms.service: azure-frontdoor
ms.topic: how-to
ms.custom: devx-track-azurepowershell
ms.date: 11/18/2024
ms.author: duau
---

# Cache purging in Azure Front Door with Azure PowerShell

Azure Front Door caches assets until their time-to-live (TTL) expires. When a client requests an asset with an expired TTL, Azure Front Door retrieves and caches a new copy of the asset.

To ensure users always get the latest assets, version your assets for each update and publish them with new URLs. Azure Front Door fetches the new assets for subsequent client requests. However, you might need to purge cached content from all edge nodes to force them to retrieve updated assets, especially after making updates or correcting incorrect information.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell installed locally or Azure Cloud Shell.

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](~/reusable-content/ce-skilling/azure/includes/cloud-shell-try-it.md)]

- Review [Caching with Azure Front Door](../front-door-caching.md) to understand how caching works.
- Have a functioning Azure Front Door profile. Refer to [Create an Azure Front Door - PowerShell](../create-front-door-powershell.md) to learn how to create one.

## Configure Cache Purge

Use the [Clear-AzFrontDoorCdnEndpointContent](/powershell/module/az.cdn/clear-azfrontdoorcdnendpointcontent) cmdlet to purge cache by specifying parameters such as:

- Resource group name.
- Azure Front Door profile name within the resource group.
- Endpoints with assets to purge.
- Domains/Subdomains with assets to purge.

> [!IMPORTANT]
> Cache purge for wildcard domains is not supported. Specify subdomains for cache purge in wildcard domains. For example, for the wildcard domain `*.afdxgatest.azfdtest.xyz`, use subdomains like `contoso.afdxgatest.azfdtest.xyz` or `cart.afdxgatest.azfdtest.xyz`. For more information, see [Wildcard domains in Azure Front Door](../front-door-wildcard-domain.md).

- Path to the content to be purged:
   - **Single path purge**: Specify the full path of the asset (without the protocol and domain), including the file extension, for example, `/pictures/strasbourg.png`.
   - **Root domain purge**: Purge the root of the endpoint with "/*" in the path.

```azurepowershell-interactive
Clear-AzFrontDoorCdnEndpointContent `
    -ResourceGroupName myRGFD `
    -ProfileName contosoafd `
    -EndpointName myendpoint `
    -Domain www.contoso.com `
    -ContentPath /scripts/*
```

Cache purges on the Azure Front Door profile are case-insensitive and query string agnostic, meaning purging a URL purges all its query-string variations.

> [!NOTE]
> Cache purging can take up to 10 minutes to propagate throughout the network and across all edge locations.

## Next steps

Learn how to [create an Azure Front Door profile](../create-front-door-portal.md).
