---
title: Purge cache for Azure Front Door
description: This article helps you understand how to purge cache for an Azure Front Door profile.
services: frontdoor
author: duongau
manager: KumudD
ms.service: frontdoor
ms.topic: how-to
ms.date: 06/02/2023
ms.author: duau
---

# Cache purging in Azure Front Door

Azure Front Door caches assets until the asset time-to-live (TTL) expires. When a client makes a request for an asset with an expired TTL, Front Door retrieves a new updated copy of the asset to serve the request, and then stores it into cache.

Best practice is to make sure end users always obtain the latest copy of your assets. The way to do that is to version your assets for each update and publish them as new URLs. Azure Front Door will immediately retrieve the new assets during next client request. There are times when you may want to purge cached contents from all POP (point-of-presence) locations and force Front Door to retrieve updated assets. The reason you want to purge cached contents is because new updates have been made to your application, or you're trying to change incorrect information.

## Prerequisites

Review [caching with Azure Front Door](../front-door-caching.md) to understand how caching works.

## Configure cache purge

1. Go to the overview page of your Azure Front Door profile, select **Purge cache** at the top of the page.

   :::image type="content" source="../media/how-to-cache-purge/cache-purge-button.png" alt-text="Screenshot of the cache purge button on the overview page.":::

1. Select an endpoint and then select a domain or subdomain you want to purge from the Front Door POP. You can select multiple domains or subdomains to purge.

    > [!IMPORTANT]
    > Cache purge for wildcard domains is not supported, you have to specify a subdomain to purge cache. You can add multiple single-level subdomains of the wildcard domain. For example, for the wildcard domain `*.contoso.com`, you can add subdomains in the form of `dev.contoso.com` or `test.contoso.com`. For more information, see [wildcard domains in Azure Front Door](../front-door-wildcard-domain.md).

   :::image type="content" source="../media/how-to-cache-purge/purge-cache-page.png" alt-text="Screenshot of the purge cache page.":::

1. To clear all assets, select **Purge all assets for the selected domains**. Otherwise, enter the **Paths** of each asset you want to purge.

   The following formats are supported in the lists of paths to purge:

   * **Single path purge** - Purge individual assets by specifying the full path of the asset without the protocol and domain including the file extension. For example: `/pictures/strasbourg.png`.
   * **Root domain purge** - Purge the root of the endpoint with `/*` in the path.

   Cache purges for Azure Front Door are case-insensitive. Additionally, they're query string agnostic, which means to purge a URL purges all query-string variations of it. 

> [!NOTE]
> Cache purging can takes up to 10 mins to propagate across all Azure Front Door POP locations.

## Next steps

Learn how to [create an Azure Front Door](../create-front-door-portal.md).
