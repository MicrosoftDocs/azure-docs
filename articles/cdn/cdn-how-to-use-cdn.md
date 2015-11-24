<properties 
	pageTitle="How to use CDN | Microsoft Azure" 
	description="Learn how to use the Azure Content Delivery Network (CDN) to deliver high-bandwidth content by caching blobs and static content." 
	services="cdn" 
	documentationCenter=".net" 
	authors="camsoper" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="cdn" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="get-started-article" 
	ms.date="10/31/2015" 
	ms.author="casoper"/>


# Using CDN for Azure

The Azure Content Delivery Network (CDN) is the fundamental building block to scale any HTTP application in Azure. It offers Azure customers a global solution by caching and delivering content close to end users. As a result, instead of hitting origin every single time, user requests get intelligently routed to the best performed CDN edge POP. This significantly increases the performance and user experience. For a current list of
CDN node locations, see [Azure Content Delivery Network (CDN) POP Locations](cdn-pop-locations.md).

The benefits of using CDN to cache Azure data include:

- Better performance and user experience for end users who are far from a content source and are using applications where many HTTP requests are required to load content.
- Large distributed scale to better handle instantaneous high load, say, at the start of an event such as a product launch.
- By distributing user requests and serving content from global edge POPs, less traffic is sent to the origin.

>[AZURE.TIP] Azure CDN can distrubute content from a variety of origins.  Integrated origins within Azure include App Service, Cloud Services, blob storage, and Media Service.  You can also define a custom origin using any publicly accessible web address.

##How to enable CDN

1. Create a CDN profile with endpoint(s) pointing to your origin

	A CDN profile is a collection of CDN endpoints.  Each profile contains one or more CDN endpoints.  Once you have created a CDN profile, you can create a new CDN endpoint using the origin you have chosen.
	
	>[AZURE.NOTE] A single Azure subscription is limited to four CDN profiles.  Each CDN profile is limited to four CDN endpoints.
	
	>[AZURE.TIP] CDN pricing is applied at the CDN profile level.  If you wish to use a mix of Standard and Premium CDN features, you will need multiple CDN profiles.
	
	For a detailed tutorial on creating CDN profiles and endpoints, see [How to Enable the Content Delivery Network for Azure](cdn-create-new-endpoint.md).   

2. Set up your CDN configuration 

	You can enable a number of features for your CDN endpoint, such as [caching policy](cdn-caching-policy.md), [query string caching](cdn-query-string.md), [rules engine](cdn-rules-engine.md), and more.  For details, see the **Manage** menu on the left.  

3. Access CDN content

	To access cached content on the CDN, use the CDN URL provided in the portal. For example, the address for a cached blob will be similar to the following: `http://<identifier>.azureedge.net/<myPublicContainer>/<BlobName>`

## See also

[How to Enable the Content Delivery Network for Azure](cdn-create-new-endpoint.md)
[Overview of the Azure Content Delivery Network (CDN)](cdn-overview.md)
 

