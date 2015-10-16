<properties 
	pageTitle="How to use CDN | Microsoft Azure" 
	description="Learn how to use the Azure Content Delivery Network (CDN) to deliver high-bandwidth content by caching blobs and static content." 
	services="cdn" 
	documentationCenter=".net" 
	authors="zhangmanling" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="cdn" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="get-started-article" 
	ms.date="09/01/2015" 
	ms.author="mazha"/>


# Using CDN for Azure

The Azure Content Delivery Network (CDN) is the fundamental building block to scale any HTTP application in Azure. It offers Azure customers a global solution by caching and delivering content close to end users. As a result, instead of hitting origin every single time, user requests get intelligently routed to the best performed CDN edge POP. This significantly increases the performance and user experience. For a current list of
CDN node locations, see [Azure CDN Node Locations].

The benefits of using CDN to cache Azure data include:

-   Better performance and user experience for end users who are far from a content source, and are using applications where many 'internet trips' are required to load content
-   Large distributed scale to better handle instantaneous high load, say, at the start of an event such as a product launch
-   By distributing user requests and serving content from global edge POPs, less traffic is sent to origin thus offload the origin.

Existing CDN customers can now use the Azure CDN in the [Azure Management Portal]. The CDN is an add-on feature to your subscription and has a separate [billing plan].

##Step 1: Create a CDN origin in Azure

CDN origin is the location from which CDN fetch content and cache at the edge POPs. The integrated Azure origin includes Azure Apps, Cloud Services, Storage and Media services. 

## Step 2: Create a CDN endpoint pointing to your Azure origin

Once your origin is set up, it will be available in the origin list when you [create a new CDN endpoint](cdn-create-new-endpoint.md).  

> [AZURE.NOTE] The configuration created for the endpoint will not immediately be available; it can take up to 60 minutes for the registration to propagate through the CDN network. Users who try to use the CDN domain name immediately may receive status code 400 (Bad Request) until the content is available via the CDN.

## Step 3: Set up your CDN configuration 

You can enable a number of features for your CDN endpoint, such as caching policy, query string caching, etc.  

## Step 4: Access CDN content

To access cached content on the CDN, use the CDN URL provided in the portal. For example, the address for a cached blob will be similar to the following: http://<*CDNNamespace*\>.vo.msecnd.net/<*myPublicContainer*\>/<*BlobName*\>



## See also

[Overview of the Azure Content Delivery Network (CDN)](cdn-overview.md)
 
