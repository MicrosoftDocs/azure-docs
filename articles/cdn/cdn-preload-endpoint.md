<properties
	pageTitle="Pre-load assets on an Azure CDN endpoint | Microsoft Azure"
	description="Learn how to pre-load cached content on a CDN endpoint."
	services="cdn"
	documentationCenter=""
	authors="camsoper"
	manager="erikre"
	editor=""/>

<tags
	ms.service="cdn"
	ms.workload="tbd"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/28/2016"
	ms.author="casoper"/>

# Pre-load assets on an Azure CDN endpoint

[AZURE.INCLUDE [cdn-verizon-only](../../includes/cdn-verizon-only.md)]

By default, assets are first cached as they are requested. This means that the first request from each region may take longer, since the edge servers will not have the content cached and will need to forward the request to the origin server. Pre-loading content avoids this first hit latency.

In addition to providing a better customer experience, pre-loading your cached assets can also reduce network traffic on the origin server.

> [AZURE.NOTE] Pre-loading assets is useful for  large events or content that becomes simultaneously available to a large number of users, such as a new movie release or a software update.

This tutorial walks you through pre-loading cached content on all Azure CDN edge nodes.

## Walkthrough

1. In the [Azure Portal](https://portal.azure.com), browse to the CDN profile containing the endpoint you wish to pre-load.  The profile blade opens.

2. Click the endpoint in the list.  The endpoint blade opens.

3. From the CDN endpoint blade, click the load button.

	![CDN endpoint blade](./media/cdn-preload-endpoint/cdn-endpoint-blade.png)

	The Load blade opens.

	![CDN load blade](./media/cdn-preload-endpoint/cdn-load-blade.png)

4. Enter the full path of each asset you wish to load (e.g., `/pictures/kitten.png`) in the **Path** textbox.

	> [AZURE.TIP] More **Path** textboxes will appear after you enter text to allow you to build a list of multiple assets.  You can delete assets from the list by clicking the ellipsis (...) button.
	>
	> Paths must be a relative URL that fits the following [regular expression](https://msdn.microsoft.com/library/az24scfc.aspx):  `^(?:\/[a-zA-Z0-9-_.\u0020]+)+$`.  Each asset must have its own path.  There is no wildcard functionality for pre-loading assets.

    ![Load button](./media/cdn-preload-endpoint/cdn-load-paths.png)

5. Click the **Load** button.

	![Load button](./media/cdn-preload-endpoint/cdn-load-button.png)

> [AZURE.NOTE] There is a limitation of 10 load requests per minute per CDN profile.

## See also
- [Purge an Azure CDN endpoint](cdn-purge-endpoint.md)
- [Azure CDN REST API reference - Purge or Pre-Load an Endpoint](https://msdn.microsoft.com/library/mt634451.aspx)
