<properties
	pageTitle="Purge an Azure CDN endpoint"
	description="Learn how to purge all cached content from a CDN endpoint."
	services="cdn"
	documentationCenter=".NET"
	authors="camsoper"
	manager="erikre"
	editor=""/>

<tags
	ms.service="cdn"
	ms.workload="tbd"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="02/25/2016" 
	ms.author="casoper"/>

# Purge an Azure CDN endpoint

## Overview

Azure CDN edge nodes will cache assets until the asset's time-to-live (TTL) expires.  After the asset's TTL expires, when a client requests the asset from the edge node, the edge node will retrieve a new updated copy of the asset to serve the client request and store refresh the cache.

Sometimes you may wish to purge cached content from all edge nodes and force them all to retrieve new updated assets.  This might be due to updates to your web application, or to quickly update assets that contain incorrect information.

This tutorial walks you through purging assets from all edge nodes of an endpoint.

## Walkthrough

1. In the [Azure Portal](https://portal.azure.com), browse to the CDN profile containing the endpoint you wish to purge.

2. From the CDN profile blade, click the purge button.

	![CDN profile blade](./media/cdn-purge-endpoint/cdn-profile-blade.png)

	The Purge blade opens.

	![CDN purge blade](./media/cdn-purge-endpoint/cdn-purge-blade.png)

3. On the Purge blade, select the service address you wish to purge from the URL dropdown.

	![Purge form](./media/cdn-purge-endpoint/cdn-purge-form.png)

	> [AZURE.NOTE] You can also get to the Purge blade by clicking the **Purge** button on the CDN endpoint blade.  In that case, the **URL** field will be pre-populated with the service address of that specific endpoint.

4. Select what assets you wish to purge from the edge nodes.  If you wish to clear all assets, click the **Purge all** checkbox.  Otherwise, type the full path of each asset you wish to purge (e.g., `/pictures/kitten.png`) in the **Path** textbox.

	> [AZURE.TIP] More **Path** textboxes will appear after you enter text to allow you to build a list of multiple assets.  You can delete assets from the list by clicking the ellipsis (...) button.
	>
	> Paths must be a relative URL that fit the following [regular expression](https://msdn.microsoft.com/library/az24scfc.aspx):  `^\/(?:[a-zA-Z0-9-_.\u0020]+\/)*\*$";`.  Asterisk (\*) may be used as a wildcard (e.g., `/music/*`).

5. Click the **Purge** button.

	![Purge button](./media/cdn-purge-endpoint/cdn-purge-button.png)

> [AZURE.NOTE] Purge requests take approximately 2-3 minutes to process. There is a limitation of 10 purge requests per minute per CDN profile.

## See also
- [Pre-load assets on an Azure CDN endpoint](cdn-preload-endpoint.md)
- [Azure CDN REST API reference - Purge or Pre-Load an Endpoint](https://msdn.microsoft.com/library/mt634451.aspx)
