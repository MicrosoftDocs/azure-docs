---
title: 'Cache purging in Azure Front Door Standard/Premium (Preview)'
description: This article helps you understand how to purge cache on an Azure Front Door Standard/Premium.
services: frontdoor
author: duongau
manager: KumudD
ms.service: frontdoor
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 02/18/2021
ms.author: duau
---

# Cache purging in Azure Front Door Standard/Premium (Preview)

> [!Note]
> This documentation is for Azure Front Door Standard/Premium (Preview). Looking for information on Azure Front Door? View [here](../front-door-overview.md).

Azure Front Door Standard/Premium caches assets until the asset's time-to-live (TTL) expires. Whenever a client requests an asset with expired TTL, the Azure Front Door environment retrieves a new updated copy of the asset to serve the request and then stores the refreshed cache.

Best practice is to make sure your users always obtain the latest copy of your assets. The way to do that is to version your assets for each update and publish them as new URLs. Azure Front Door Standard/Premium will immediately retrieve the new assets for the next client requests. Sometimes you may wish to purge cached contents from all edge nodes and force them all to retrieve new updated assets. The reason you want to purge cached contents is because you've made new updates to your application or you want to update assets that contain incorrect information.

> [!IMPORTANT]
> Azure Front Door Standard/Premium (Preview) is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

Review [Azure Front Door Caching](concept-caching.md) to understand how caching works.

## Configure cache purge

1. Go to the overview page of the Azure Front Door profile with the assets you want to purge, then select **Purge cache**.

   :::image type="content" source="../media/how-to-cache-purge/front-door-cache-purge-1.png" alt-text="Screenshot of cache purge on overview page.":::

1. Select the endpoint and domain you want to purge from the edge nodes. *(You may select more than one domains)*

   :::image type="content" source="../media/how-to-cache-purge/front-door-cache-purge-2.png" alt-text="Screenshot of cache purge page.":::

1. To clear all assets, select **Purge all assets for the selected domains**. Otherwise, in **Paths**, enter the path of each asset you want to purge.

These formats are supported in the lists of paths to purge:

* **Single path purge**: Purge individual assets by specifying the full path of the asset (without the protocol and domain), with the file extension, for example, /pictures/strasbourg.png.
* **Root domain purge**: Purge the root of the endpoint with "/*" in the path.

Cache purges on the Azure Front Door Standard/Preium are case-insensitive. Additionally, they're query string agnostic, meaning purging a URL will purge all query-string variations of it. 

## Next steps

Learn how to [create a Front Door Standard/Premium](create-front-door-portal.md).
