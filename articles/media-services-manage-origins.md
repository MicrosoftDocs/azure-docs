<properties urlDisplayName="index" pageTitle="How to Manage Origins in a Media Services Account" metaKeywords="" description="" metaCanonical="" services="" documentationCenter="" title="How to Manage Streaming Endpoints in a Media Services Account" authors="juliako"  solutions="" writer="juliako" manager="dwrede" editor=""  />

<tags ms.service="media-services" ms.workload="media" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="juliako" />


<h1><a id="managemediaservicesorigins"></a>How to Manage Streaming Endpoints in a Media Services Account</h1>

Media Services enables you to add multiple streaming endpoints to your account and to configure the streaming endpoints. Each Media Services account has at least one streaming endpoint called **default** associated with it.

>[WACOM.NOTE] Streaming Endpoints used to be known as Origins. 


<h2>Adding and Deleting Streaming Endpoints</h2> 

1. In the [Management Portal](https://manage.windowsazure.com/), click **Media Services**. Then, click the name of the media service.
2. Select the STREAMING ENDPOINTS page. 
3. Click the ADD or DELETE button at the bottom of the page. Note that the default streaming endpoint cannot be deleted. 
4. Click the START button to start the streaming endpoint. 
5. Click on the name of the streaming endpoint to configure it.   

	![Origin page][origin-page]

<h2>Configuring the Streaming Endpoint</h2>

The CONFIGURE tab enables you to do the following configurations:

1. Set the maximum caching period that will be specified in the cache control header of HTTP responses. This value will not override the maximum cache value that have been set explicitly on the blob content.

2. Specify IP addresses that would be allowed to connect to the published streaming endpoint. If no IP addresses specified, any IP address would be able to connect.

3. Specify configuration for Akamai signature header authentication.



	![Configure origin][configure-origin]

	The configuration on this page will only apply to streaming endpoints that have at least one reserved unit. To reserve the on-demand streaming reserved units, go to the SCALE tab. For detailed information about reserved units, see [Scaling Media Services](../media-services-how-to-scale/).


[origin-page]: ./media/media-services-manage-origins/media-services-origins-page.png
[configure-origin]: ./media/media-services-manage-origins/media-services-origins-configure.png
