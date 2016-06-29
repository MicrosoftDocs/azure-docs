<properties 
	pageTitle="How to Manage Streaming Endpoints in a Media Services Account" 
	description="This topic shows how to manage Streaming Endpoints using the Azure Classic Portal." 
	services="media-services" 
	documentationCenter="" 
	authors="Juliako" 
	writer="juliako" 
	manager="erikre" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/22/2016"
	ms.author="juliako"/>


#<a id="managemediaservicesorigins"></a>How to Manage Streaming Endpoints in a Media Services Account

> [AZURE.SELECTOR]
- [Portal](media-services-manage-origins.md)
- [Java](https://github.com/southworkscom/azure-sdk-for-media-services-java-samples)


In Microsoft Azure Media Services, a **Streaming Endpoint** represents a streaming service that can deliver content directly to a client player application, or to a Content Delivery Network (CDN) for further distribution. Media Services also provides seamless Azure CDN integration. The outbound stream from a StreamingEndpoint service can be a live stream, or a video on demand Asset in your Media Services account.

In addition, you can control the capacity of the Streaming Endpoint service to handle growing bandwidth needs by adjusting scale units (also known as streaming units). It is recommended to allocate one or more scale units for applications in production environment. Scale units provide you with both dedicated egress capacity that can be purchased in increments of 200 Mbps and additional functionality which functionality which includes: [dynamic packaging](media-services-dynamic-packaging-overview.md), CDN integration, and advanced configuration.

Note that you are only billed when your StreamingEndpoint is in running state.

This topic gives an overview of the main functionalities that are provided by Streaming Endpoints. The topic also shows how to use the Azure Classic Portal to manage streaming endpoints.


##Adding and Deleting Streaming Endpoints

You can add or remove streaming endpoints using .NET SDK, REST API, or Azure Classic Portal.

To add\delete streaming endpoint using the Azure Classic Portal, do the following:

1. In the [Azure Classic Portal](https://manage.windowsazure.com/), click **Media Services**. Then, click the name of the media service.
2. Select the **STREAMING ENDPOINTS** page.
3. Click the ADD or DELETE button at the bottom of the page. Note that the default streaming endpoint cannot be deleted.
4. Click the START button to start the streaming endpoint.
5. Click on the name of the streaming endpoint to configure it.

![Streaming Endpoint page][streaming-endpoint]


By default you can have up to two streaming endpoints. If you need to request more, see [Quotas and limitations](media-services-quotas-and-limitations.md).

##<a id="scale_streaming_endpoints"></a>Scale the Streaming Endpoint

Streaming units provide you with both dedicated egress capacity that can be purchased in increments of 200 Mbps and  additional functionality which currently includes [dynamic packaging capabilities](media-services-dynamic-packaging-overview.md). By default, streaming is configured in a shared-instance model for which server resources (for example, compute, egress capacity, etc.) are shared with all other users. To improve a streaming throughput, it is recommended to purchase Streaming Units. 

You can scale using .NET SDK, REST API, or Azure Classic Portal.

To change the number of streaming units using the Portal, do the following:

1. To specify the number of streaming units, select the SCALE tab and move the **reserved capacity** slider.

	![Scale page](./media/media-services-manage-origins/media-services-origin-scale.png)

4. Press the SAVE button to save your changes.

	The allocation of any new streaming units takes around 20 minutes to complete. 

	 
	>[AZURE.NOTE] Currently, going from any positive value of streaming units back to none, can disable on-demand streaming for up to an hour.

	>[AZURE.NOTE] The highest number of units specified for the 24-hour period is used in calculating the cost. For information about pricing details, see [Media Services Pricing Details](http://go.microsoft.com/fwlink/?LinkId=275107).
	
##<a id="configure_streaming_endpoints"></a>Configuring the Streaming Endpoint

Streaming Endpoint enables you to configure the following properties when you have at least 1 scale unit: 

- Access control
- Custom host names
- Cache control
- Cross site access policies

For detailed information about these properties, see [StreamingEndpoint](https://msdn.microsoft.com/library/azure/dn783468.aspx).

You can configure these properties using .NET SDK, REST API, or Azure Classic Portal.

To change the number of streaming units using the Portal, do the following:

1. Select the streaming endpoint that you want to configure.
1. Select the CONFIGURE tab.
  
A brief description of the fields follows.

![Configure origin][configure-origin]
  

1. Set the maximum caching period that will be specified in the cache control header of HTTP responses. This value will not override the maximum cache value that have been set explicitly on the blob content.

2. Specify IP addresses that would be allowed to connect to the published streaming endpoint. If no IP addresses specified, any IP address would be able to connect.

3. Specify configuration for Akamai signature header authentication.

4. You can specify a cross domain access policy for Adobe Flash clients (for more information see, [Cross-domain policy file specification](http://www.adobe.com/devnet/articles/crossdomain_policy_file_spec.html). As well as client access policy for Microsoft Silverlight clients (for more information, see [Making a Service Available Across Domain Boundaries](https://msdn.microsoft.com/library/cc197955(v=vs.95).aspx).  

5. You can also configure custom host names by clicking the **configure** button. For more information, see the **CustomHostNames** property in the [StreamingEndpont](https://msdn.microsoft.com/library/dn783468.aspx) topic.  


##<a id="enable_cdn"></a>Enable Azure CDN integration

You can specify to enable the Azure CDN integration for a Streaming Endpoint (it is disabled by default.)

To set the Azure CDN integration to true:

- The streaming endpoint must have at least one streaming (scale) unit. If later you want to set scale units to 0, you must first disable the CDN integration. By default when you create a new streaming endpoint one streaming unit is automatically set.

- The streaming endpoint must be in a stopped state. Once the CDN gets enabled, you can start the streaming endpoint. 

It could take up to 90 min for the Azure CDN integration to get enabled.  It takes up to two hours for the changes to be active across all the CDN POPs.


CDN integration is enabled in all the Azure data centers: US West, US East, North Europe, West Europe, Japan West, Japan East, South East Asia and East Asia.

Once it is enabled, the following configurations get disabled: **Custom Host Names** and **Access Control**.

![Streaming Endpoint Enable CDN][streaming-endpoint-enable-cdn]

>[AZURE.IMPORTANT] Azure Media Services integration with Azure CDN is implemented on **Azure CDN from Verizon**.  If you wish to use **Azure CDN from Akamai** for Azure Media Services, you must [configure the endpoint manually](../cdn/cdn-create-new-endpoint.md).  For more information about Azure CDN features, see the [CDN overview](../cdn/cdn-overview.md).

###Additional considerations

- When CDN is enabled for a streaming endpoint, clients cannot request content directly from the origin. If you need the ability to test your content with or without CDN you can create another streaming endpoint that isn’t CDN enabled.
- Your streaming endpoint hostname remains the same after enabling CDN. You don’t need to make any changes to your media services workflow after CDN is enabled. For example, if your streaming endpoint hostname is strasbourg.streaming.mediaservices.windows.net, after enabling CDN, the exact same hostname is used.
- For new streaming endpoints, you can enable CDN simply by creating a new endpoint; for existing streaming endpoints, you will need to first stop the endpoint and then enable the CDN.
 

For more information see, [Announcing Azure Media Services integration with Azure CDN (Content Delivery Network)](http://azure.microsoft.com/blog/2015/03/17/announcing-azure-media-services-integration-with-azure-cdn-content-delivery-network/).


##Media Services learning paths

[AZURE.INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

##Provide feedback

[AZURE.INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]

[streaming-endpoint-enable-cdn]: ./media/media-services-manage-origins/media-services-origins-enable-cdn.png
[streaming-endpoint]: ./media/media-services-manage-origins/media-services-origins-page.png
[configure-origin]: ./media/media-services-manage-origins/media-services-origins-configure.png
[configure-origin-configure-custom-host-names]: ./media/media-services-manage-origins/media-services-configure-custom-host-names.png
 
