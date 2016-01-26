<properties 
	pageTitle="Pre-load assets on an Azure CDN endpoint" 
	description="Learn how to pre-load cached content on a CDN endpoint." 
	services="cdn" 
	documentationCenter=".NET" 
	authors="camsoper" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="cdn" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="01/20/2016" 
	ms.author="casoper"/>
	
# Pre-load assets on an Azure CDN endpoint

This tutorial walks you through pre-loading cached content on all Azure CDN edge nodes.

## Walkthrough

1. In the [Azure Portal](https://portal.azure.com), browse to the CDN profile containing the endpoint you wish to pre-load.  The profile blade opens.

2. Click the endpoint in the list.  The endpoint blade opens.

3. From the CDN endpoint blade, click the load button.
	
	![CDN endpoint blade](./media/cdn-preload-endpoint/cdn-endpoint-blade.png)
	
	The Load blade opens.
	
	![CDN load blade](./media/cdn-preload-endpoint/cdn-load-blade.png)
	
4. Enter the full path of each asset you wish to load (e.g., */pictures/kitten.png*) in the **Path** textbox.

	> [AZURE.TIP] More **Path** textboxes will appear after you enter text to allow you to build a list of multiple assets.  You can delete assets from the list by clicking the ellipsis (...) button.
	>
	> Paths must be a relative URL.  Asterisk (*) may be used as a wildcard.  
	
    ![Load button](./media/cdn-preload-endpoint/cdn-load-paths.png)
    
5. Click the **Load** button.

	![Load button](./media/cdn-preload-endpoint/cdn-load-button.png)
	

## See also
- [Purge an Azure CDN endpoint](cdn-purge-endpoint.md)
- [Azure CDN REST API reference - Purge or Pre-Load an Endpoint](https://msdn.microsoft.com/library/mt634451.aspx)
