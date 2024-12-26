---
title: Cache purging for Azure Front Door
description: This article helps you understand how to purge cache for an Azure Front Door profile.
services: frontdoor
author: duongau
manager: KumudD
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 11/15/2024
ms.author: duau
---

# Cache purging in Azure Front Door

Azure Front Door caches assets until their time-to-live (TTL) expires. When a client requests an asset with an expired TTL, Azure Front Door retrieves and caches a new copy of the asset to serve the request.

To ensure end users always receive the latest version of your assets, it's best practice to version your assets with each update and publish them under new URLs. This way, Azure Front Door will fetch the new assets on the next client request.

Purging cached content from all point-of-presence (POP) locations forces Azure Front Door to retrieve updated assets. This action is necessary when updates are made to your application or to correct incorrect information.

## Prerequisites

Review [caching with Azure Front Door](../front-door-caching.md) to understand how caching works.

## Configure cache purge

1. Navigate to the overview page of your Azure Front Door profile and select **Purge cache** at the top of the page.

   :::image type="content" source="../media/how-to-cache-purge/cache-purge-button.png" alt-text="Screenshot of the cache purge button on the overview page.":::

2. Choose an endpoint, then select the domain or subdomain you want to purge from the Front Door POP. You can select multiple domains or subdomains.

    > [!IMPORTANT]
    > Cache purge for wildcard domains is not supported. You must specify a subdomain to purge cache. You can add multiple single-level subdomains of the wildcard domain. For example, for the wildcard domain `*.contoso.com`, you can add subdomains like `dev.contoso.com` or `test.contoso.com`. For more information, see [wildcard domains in Azure Front Door](../front-door-wildcard-domain.md).

   :::image type="content" source="../media/how-to-cache-purge/purge-cache-page.png" alt-text="Screenshot of the purge cache page.":::

3. To clear all assets, select **Purge all assets for the selected domains**. Otherwise, enter the **Paths** of each asset you want to purge.

   The following formats are supported for the list of paths to purge:

   * **Single path purge** - Purge individual assets by specifying the full path of the asset without the protocol and domain, including the file extension. For example: `/pictures/strasbourg.png`.
   * **Root domain purge** - Purge the root of the endpoint with `/*` in the path.

   Cache purges for Azure Front Door are case-insensitive and query string agnostic, meaning purging a URL purges all query-string variations of it.

> [!NOTE]
> Cache purging can take up to 10 minutes to propagate across all Azure Front Door POP locations.

## Next steps

Learn how to [create an Azure Front Door](../create-front-door-portal.md).
