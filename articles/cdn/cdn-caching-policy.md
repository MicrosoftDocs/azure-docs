<properties
	pageTitle="CDN Caching Policy in Media Services Extension"
	description="This topic gives an overview of a CDN caching policy in Media Services Extension."
	services="media-services,cdn"
	documentationCenter=".NET"
	authors="juliako"
	manager="erikre"
	editor=""/>

<tags
	ms.service="media-services"
	ms.workload="tbd"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/25/2016"
	ms.author="juliako"/>
 
#CDN Caching Policy in Media Services Extension

Azure Media Services provides HTTP based Adaptive Streaming and progressive download. HTTP based streaming is highly scalable with benefits of caching in proxy and CDN layers as well as client side caching. Streaming endpoints provides general streaming capabilities and also configuration for HTTP cache headers. Streaming endpoints sets HTTP Cache-Control: max-age and Expires headers. You can get more information for HTTP cache headers from [W3.org](http://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html).

##Default Caching headers

By default streaming-endpoints apply 3 day cache headers for on-demand streaming data (actual media fragments/chunks) and manifest(playlist). For live streaming, streaming endpoints apply 3 day cache headers for data (actual media fragments/chunks) and 2 seconds cache header for manifest(playlist) requests. When live program turns to on-demand (live archive) then on-demand streaming cache headers apply.

##Azure CDN integration

Azure Media Services provides [integrated CDN](https://azure.microsoft.com/updates/azure-media-services-now-fully-integrated-with-azure-cdn/) for streaming-endpoints. Cache-control headers applies in the same way as streaming endpoints to CDN enabled streaming endpoints. Azure CDN uses streaming endpoint configured cache values to define the life time of the internally cached objects and also uses this value to set the delivery cache headers. When using CDN enabled streaming endpoints it is not recommended to set small cache values. Setting small values will decrease the performance and reduce the benefit of CDN. It is not allowed to set cache headers smaller than 600 seconds for CDN enabled streaming endpoints.

>[AZURE.IMPORTANT] Azure Media Services integration with Azure CDN is implemented on **Azure CDN from Verizon**.  If you wish to use **Azure CDN from Akamai** for Azure Media Services, you must [configure the endpoint manually](cdn-create-new-endpoint.md).  For more information about Azure CDN features, see the [CDN overview](cdn-overview.md).

##Configuring cache headers with Azure Media Services

You can use Azure Management portal or Azure Media Services APIs to configure cache header values.

1. To configure cache headers using management portal please refer to [How to Manage Streaming Endpoints](../media-services/media-services-manage-origins.md) section Configuring the Streaming Endpoint.
2. Azure Media Services REST API, [StreamingEndpoint](https://msdn.microsoft.com/library/azure/dn783468.aspx#StreamingEndpointCacheControl).
3. Azure Media Services .NET SDK, [StreamingEndpointCacheControl Properties](http://go.microsoft.com/fwlink/?LinkId=615302).

##Cache configuration precedence order

1. Azure Media Services configured cache value overrides default value.
2. If there is no manual configuration, default values applies.
3. By default 2 seconds cache headers applies to live streaming manifest(playlist) regardless of Azure Media or Azure Storage configuration and overriding of this value is not available.
