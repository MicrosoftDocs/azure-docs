---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Streaming Endpoints in Azure Media Services | Microsoft Docs
description: This article gives an explanation of what Streaming Endpoints are, and how they are used by Azure Media Services.
services: media-services
documentationcenter: ''
author: Juliako
manager: cfowler
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 09/02/2018
ms.author: juliako
---

# Streaming Endpoints

In Microsoft Azure Media Services (AMS), the [Streaming Endpoints](https://docs.microsoft.com/rest/api/media/streamingendpoints) entity represents a streaming service that can deliver content directly to a client player application, or to a Content Delivery Network (CDN) for further distribution. The outbound stream from a Streaming Endpoint service can be a live stream, or a video on-demand Asset in your Media Services account. When you create a Media Services account, a **default** Streaming Endpoint is created for you in a stopped state. You cannot delete the default Streaming Endpoint. Additional Streaming Endpoints can be created under the account. To start streaming videos, you need to start the Streaming Endpoint. 

## StreamingEndpoint types  

There are two **StreamingEndpoint** types: **Standard** and **Premium**. The type is defined by the number of scale units (`scaleUnits`) you allocate for the streaming endpoint. 

The table describes the types:  

|Type|Scale units|Description|
|--------|--------|--------|  
|**Standard Streaming Endpoint** (recommended)|0|The **Standard** type is the recommended option for virtually all streaming scenarios and audience sizes. The **Standard** type scales outbound bandwidth automatically. <br/>For customers with extremely demanding requirements Media Services offers **Premium** streaming endpoints, which can be used to scale out capacity for the largest internet audiences. If you expect large audiences and concurrent viewers, contact us at amsstreaming@microsoft.com for guidance on whether you need to move to the **Premium** type. |
|**Premium Streaming Endpoint**|>0|**Premium** streaming endpoints are suitable for advanced workloads, providing dedicated and scalable bandwidth capacity. You move to a **Premium** type by adjusting `scaleUnits`. `scaleUnits` provide you with dedicated egress capacity that can be purchased in increments of 200 Mbps. When using the **Premium** type, each enabled unit provides additional bandwidth capacity to the application. |

## Working with CDN

In most cases, you should have CDN enabled. However, if you are anticipating max concurrency lower than 500 viewers then it is recommended to disable CDN since CDN scales best with concurrency.

### Detailed explanation of how caching works

There is no specific bandwidth value when adding the CDN because the amount of bandwidth that is needed for a CDN enabled streaming endpoint varies. A lot depends on the type of content, how popular it is, bitrates, and the protocols. The CDN is only caching what is being requested. That means that popular content will be served directly from the CDN – as long as the video fragment is cached. Live content is likely to be cached because you typically have many people watching the exact same thing. On-demand content can be a bit trickier because you could have some content that is popular and some that is not. If you have millions of video assets where none of them are popular (only 1 or 2 viewers a week) but you have thousands of people watching all different videos, the CDN becomes much less effective. With this cache misses, you increase the load on the streaming endpoint.
 
You also need to consider how adaptive streaming works. Each individual video fragment is cached as it's own entity. For example, if the first time a certain video is watched, the person skips around watching only a few seconds here and there only the video fragments associated with what the person watched get cached in the CDN. With adaptive streaming, you typically have 5 to 7 different bitrates of video. If one person is watching one bitrate and another person is watching a different bitrate, then they are each cached separately in the CDN. Even if two people are watching the same bitrate they could be streaming over different protocols. Each protocol (HLS, MPEG-DASH, Smooth Streaming) is cached separately. So each bitrate and protocol are cached separately and only those video fragments that have been requested are cached.
 
## StreamingEndpoint properties 

This section gives details about some of the StreamingEndpoint's properties. For examples of how to create a new streaming endpoint and descriptions of all properties, see [Streaming Endpoint](https://docs.microsoft.com/rest/api/media/streamingendpoints/create). 

|Property|Description|  
|--------------|----------|
|`accessControl`|Used to configure the following security settings for this streaming endpoint: Akamai signature header authentication keys and IP addresses that are allowed to connect to this endpoint.<br />This property can be set when `cdnEnabled`"` is set to false.|  
|`cdnEnabled`|Indicates whether or not the Azure CDN integration for this streaming endpoint is enabled (disabled by default.)<br /><br /> If you set `cdnEnabled` to true, the following configurations get disabled: `customHostNames` and `accessControl`.<br /><br />Not all data centers support the Azure CDN integration. To check whether or not your data center has the Azure CDN integration available do the following:<br /><br /> - Try to set the `cdnEnabled` to true.<br /><br /> - Check the returned result for an `HTTP Error Code 412` (PreconditionFailed) with a message of  "Streaming endpoint CdnEnabled property cannot be set to true as CDN capability is not available in the current region."<br /><br /> If you get this error, the data center does not support it. You should try another data center.|  
|`cdnProfile`|When `cdnEnabled` is set to true, you can also pass `cdnProfile` values. `cdnProfile` is the name of the CDN profile where the CDN endpoint point will be created. You can provide an existing cdnProfile or use a new one. If value is NULL and `cdnEnabled` is true, the default value "AzureMediaStreamingPlatformCdnProfile" is used. If the provided `cdnProfile` already exists, an endpoint is created under it. If the profile does not exists, a new profile automatically gets created.|
|`cdnProvider`|When CDN is enabled, you can also pass `cdnProvider` values. `cdnProvider` controls which provider will be used. Currently, three values are supported: "StandardVerizon", "PremiumVerizon" and "StandardAkamai". If no value is provided and `cdnEnabled` is true, "StandardVerizon" is used (that is the default value.)|
|`crossSiteAccessPolicies`|Used to specify cross site access policies for various clients. For more information, see [Cross-domain policy file specification](http://www.adobe.com/devnet/articles/crossdomain_policy_file_spec.html) and [Making a Service Available Across Domain Boundaries](http://msdn.microsoft.com/library/cc197955\(v=vs.95\).aspx).|  
|`customHostNames`|Used to configure a streaming endpoint to accept traffic directed to a custom host name. This allows for easier traffic management configuration through a Global Traffic Manager (GTM) and also for branded domain names to be used as the streaming endpoint name.<br /><br /> The ownership of the domain name must be confirmed by Azure Media Services. Azure Media Services verifies the domain name ownership by requiring a `CName` record containing the Azure Media Services account ID as a component to be added to the domain in use. As an example, for "sports.contoso.com" to be used as a custom host name for the streaming endpoint, a record for `<accountId>.contoso.com` must be configured to point to one of Media Services verification host names. The verification host name is composed of verifydns.\<mediaservices-dns-zone>. The following table contains the expected DNS zones to be used in the verify record for different Azure regions.<br /><br /> North America, Europe, Singapore, Hong Kong, Japan:<br /><br /> - mediaservices.windows.net<br /><br /> - verifydns.mediaservices.windows.net<br /><br /> China:<br /><br /> - mediaservices.chinacloudapi.cn<br /><br /> - verifydns.mediaservices.chinacloudapi.cn<br /><br /> For example, a `CName` record that maps "945a4c4e-28ea-45cd-8ccb-a519f6b700ad.contoso.com" to "verifydns.mediaservices.windows.net" proves that the Azure Media Services ID 945a4c4e-28ea-45cd-8ccb-a519f6b700ad has the ownership of the contoso.com domain, thus enabling any name under contoso.com to be used as a custom host name for a streaming endpoint under that account.<br /><br /> To find the Media Service ID value, go to the [Azure portal](https://portal.azure.com/) and select your Media Service account. The MEDIA SERVICE ID appears on the right of the DASHBOARD page.<br /><br /> **Warning**: If there is an attempt to set a custom host name without a proper verification of the `CName` record, the DNS response will fail and then be cached for some time. Once a proper record is in place, it might take a while until the cached response is revalidated. Depending on the DNS provider for the custom domain, it could take anywhere from a few minutes to an hour to revalidate the record.<br /><br /> In addition to the `CName` that maps `<accountId>.<parent domain>` to `verifydns.<mediaservices-dns-zone>`, you must create another `CName` that maps the custom host name (for example, `sports.contoso.com`) to your Media Services StreamingEndpont’s host name (for example, `amstest.streaming.mediaservices.windows.net`).<br /><br /> **Note**: Streaming endpoints located in the same data center, cannot share the same custom host name.<br /> This property is valid for Standard and premium streaming endpoints and can be set when "cdnEnabled": false<br/><br/> Currently, AMS doesn’t support SSL with custom domains.  |  
|`maxCacheAge`|Overrides the default max-age HTTP cache control header set by the streaming endpoint on media fragments and on-demand manifests. The value is set in seconds.|
|`resourceState`|Values for the property include:<br /><br /> - Stopped. The initial state of a streaming endpoint after creation.<br /><br /> - Starting. The streaming endpoint is transitioning to the running state.<br /><br /> - Running. The streaming endpoint is able to stream content to clients.<br /><br /> - Scaling. The scale units are being increased or decreased.<br /><br /> - Stopping. The streaming endpoint is transitioning to the stopped state.<br/><br/> - Deleting. The streaming endpoint is being deleted.|
|`scaleUnits `|scaleUnits provide you with dedicated egress capacity that can be purchased in increments of 200 Mbps. If you need to move to a **Premium** type, adjust `scaleUnits`. |

## Next steps

The sample [in this repository](https://github.com/Azure-Samples/media-services-v3-dotnet-quickstarts/blob/master/AMSV3Quickstarts/EncodeAndStreamFiles/Program.cs) shows how to start the default streaming endpoint with .NET.

