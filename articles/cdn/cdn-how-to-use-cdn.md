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
	ms.date="09/01/2015" 
	ms.author="casoper"/>


# Using CDN for Azure

The Azure Content Delivery Network (CDN) is the fundamental building block to scale any HTTP application in Azure. It offers Azure customers a global solution by caching and delivering content close to end users. As a result, instead of hitting origin every single time, user requests get intelligently routed to the best performed CDN edge POP. This significantly increases the performance and user experience. For a current list of
CDN node locations, see [Azure Content Delivery Network (CDN) POP Locations](cdn-how-to-use-cdn.md).

The benefits of using CDN to cache Azure data include:

-   Better performance and user experience for end users who are far from a content source, and are using applications where many 'internet trips' are required to load content
-   Large distributed scale to better handle instantaneous high load, say, at the start of an event such as a product launch
-   By distributing user requests and serving content from global edge POPs, less traffic is sent to origin thus offload the origin.

## Step 1: Identify your origin

Azure CDN can distrubute content from a variety of origins.  Integrated origins within Azure include App Service, Cloud Services, Blob storage, and Media Service.  You can also define a custom origin using any publicly accessible web address.

## Step 2: Create a CDN profile

A CDN profile is a collection of CDN endpoints.  Each profile contains one or more CDN endpoints.  You may wish to use multiple profiles to organize your CDN endpoints by internet domain, web application, or some other criteria.

## Step 3: Create a CDN endpoint pointing to your origin

Once you have created a CDN profile, you can [create a new CDN endpoint](cdn-create-new-endpoint.md) using the origin you have chosen.  

> [AZURE.NOTE] The configuration created for the endpoint will not immediately be available; it can take up to 60 minutes for the registration to propagate through the CDN network. Users who try to use the CDN domain name immediately may receive status code 400 (Bad Request) until the content is available via the CDN.

## Step 4: Set up your CDN configuration 

You can enable a number of features for your CDN endpoint, such as caching policy, query string caching, etc.  

## Step 5: Access CDN content

To access cached content on the CDN, use the CDN URL provided in the portal. For example, the address for a cached blob will be similar to the following: `http://<identifier>.azureedge.net/<myPublicContainer>/<BlobName>`

## See also

[Overview of the Azure Content Delivery Network (CDN)](cdn-overview.md)
 

