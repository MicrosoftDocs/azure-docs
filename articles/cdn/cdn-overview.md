<properties
	pageTitle="Azure CDN Overview"
	description="Learn what the Azure Content Delivery Network (CDN) is and how to use it to deliver high-bandwidth content by caching blobs and static content."
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
	ms.topic="hero-article"
	ms.date="02/25/2016" 
	ms.author="casoper"/>

# Overview of the Azure Content Delivery Network (CDN)

The Azure Content Delivery Network (CDN) caches Azure blobs and static content used by cloud services at strategically placed locations to provide maximum bandwidth for delivering content to users.

If you are an existing CDN customer, you can now manage your CDN endpoints through the [Microsoft Azure Portal](https://portal.azure.com).


The CDN offers developers a global solution for delivering high-bandwidth content by caching the content at physical nodes across the world. For a current list of CDN node locations, see [Azure Content Delivery Network (CDN) POP Locations](cdn-pop-locations.md).

The benefits of using the CDN to cache Azure data include:

- Better performance and user experience for end users who are far from a content source, and are using applications where many "internet trips" are required to load content
- Large distributed scale to better handle instantaneous high load, like at the start of a product launch event.


>[AZURE.IMPORTANT] When you create or enable a CDN endpoint, it may take up to 90 minutes to propagate worldwide.

When a request for an object is first made to the CDN, the object is retrieved directly from the object's source origin location.  This origin can be an Azure storage account, web app, cloud service, or any custom origin that accepts public web requests.  When a request is made using the CDN syntax, the request is redirected to the CDN endpoint closest to the location from which the request was made to provide access to the object. If the object is not found at that endpoint, then it is retrieved from the service and cached at the endpoint, where a time-to-live (TTL) setting is maintained for the cached object.

## Standard features

The Standard CDN tier includes these features:

- Easy integration with Azure services such as [Storage](cdn-create-a-storage-account-with-cdn.md), Web Apps, and Media Services
- [Query string caching](cdn-query-string.md)
- [Custom domain name support](cdn-map-content-to-custom-domain.md)
- [Country filtering](cdn-restrict-access-by-country.md)
- [Core analytics](cdn-analyze-usage-patterns.md)
- [Custom content origins](cdn-how-to-use-cdn.md#caching-content-from-custom-origins)
- [HTTPS support](cdn-how-to-use-cdn.md#accessing-cached-content-over-https)
- Load balancing
- DDOS protection
- [Fast purge](cdn-purge-endpoint.md)
- [Asset pre-loading](cdn-preload-endpoint.md)
- [Management via REST API](https://msdn.microsoft.com/library/mt634456.aspx)


## Premium features

The Premium CDN tier includes all of the features of the Standard tier, plus these additional features:

- [Customizable, rule-based content delivery engine](cdn-rules-engine.md)
- [Advanced HTTP reports](cdn-advanced-http-reports.md)
- [Real-time stats](cdn-real-time-stats.md)
