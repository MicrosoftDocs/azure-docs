---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Streaming Endpoints (Origin) in Azure Media Services | Microsoft Docs
description: In Azure Media Services, a Streaming Endpoint (Origin) represents a dynamic packaging and streaming service that can deliver content directly to a client player application, or to a Content Delivery Network (CDN) for further distribution. 
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 07/11/2019
ms.author: juliako
---

# Streaming Endpoints 

In Microsoft Azure Media Services, a [Streaming Endpoint](https://docs.microsoft.com/rest/api/media/streamingendpoints) represents a dynamic (just-in-time) packaging and origin service that can deliver your live and on-demand content directly to a client player application, using one of the common streaming media protocols (HLS or DASH). In addition, the **Streaming Endpoint** provides dynamic (just-in-time) encryption to industry leading DRMs.

When you create a Media Services account, a **default** Streaming Endpoint is created for you in a stopped state. You cannot delete the **default** Streaming Endpoint. Additional Streaming Endpoints can be created under the account (see [Quotas and limitations](limits-quotas-constraints.md)). 

> [!NOTE]
> To start streaming videos, you need to start the **Streaming Endpoint** from which you want to stream the video. 
>  
> You are only billed when your Streaming Endpoint is in the running state.

## Naming convention

For the default endpoint: `{AccountName}-{DatacenterAbbreviation}.streaming.media.azure.net`

For any additional endpoints: `{EndpointName}-{AccountName}-{DatacenterAbbreviation}.streaming.media.azure.net`

## Types  

There are two **Streaming Endpoint** types: **Standard** (preview) and **Premium**. The type is defined by the number of scale units (`scaleUnits`) you allocate for the streaming endpoint. 

The table describes the types:  

|Type|Scale units|Description|
|--------|--------|--------|  
|**Standard**|0|The default Streaming Endpoint is a **Standard** type, can be changed to the Premium type by adjusting `scaleUnits`.|
|**Premium**|>0|**Premium** Streaming Endpoints are suitable for advanced workloads, providing dedicated and scalable bandwidth capacity. You move to a **Premium** type by adjusting `scaleUnits` (streaming units). `scaleUnits` provide you with dedicated egress capacity that can be purchased in increments of 200 Mbps. When using the **Premium** type, each enabled unit provides additional bandwidth capacity to the application. |

> [!NOTE]
> For customers looking to deliver content to large internet audiences, we recommend that you enable CDN on the Streaming Endpoint.

For SLA information, see [Pricing and SLA](https://azure.microsoft.com/pricing/details/media-services/).

## Comparing streaming types

Feature|Standard|Premium
---|---|---
Throughput |Up to 600 Mbps and can provide a much higher effective throughput when a CDN is used.|200 Mbps per streaming unit (SU). Can provide a much higher effective throughput when a CDN is used.
CDN|Azure CDN, third party CDN, or no CDN.|Azure CDN, third party CDN, or no CDN.
Billing is prorated| Daily|Daily
Dynamic encryption|Yes|Yes
Dynamic packaging|Yes|Yes
Scale|Auto scales up to the targeted throughput.|Additional SUs
IP filtering/G20/Custom host  <sup>1</sup>|Yes|Yes
Progressive download|Yes|Yes
Recommended usage |Recommended for the vast majority of streaming scenarios.|Professional usage.

<sup>1</sup> Only used directly on the Streaming Endpoint when the CDN is not enabled on the endpoint.<br/>

## Properties 

This section gives details about some of the Streaming Endpoint's properties. For examples of how to create a new streaming endpoint and descriptions of all properties, see [Streaming Endpoint](https://docs.microsoft.com/rest/api/media/streamingendpoints/create). 

- `accessControl` - Used to configure the following security settings for this streaming endpoint: Akamai signature header authentication keys and IP addresses that are allowed to connect to this endpoint.<br />This property can only be set when `cdnEnabled` is set to false.
- `cdnEnabled` - Indicates whether or not the Azure CDN integration for this streaming endpoint is enabled (disabled by default). If you set `cdnEnabled` to true, the following configurations get disabled: `customHostNames` and `accessControl`.
  
    Not all data centers support the Azure CDN integration. To check whether or not your data center has the Azure CDN integration available, do the following:
 
  - Try to set the `cdnEnabled` to true.
  - Check the returned result for an `HTTP Error Code 412` (PreconditionFailed) with a message of "Streaming endpoint CdnEnabled property cannot be set to true as CDN capability is not available in the current region." 

    If you get this error, the data center does not support it. You should try another data center.
- `cdnProfile` -  When `cdnEnabled` is set to true, you can also pass `cdnProfile` values. `cdnProfile` is the name of the CDN profile where the CDN endpoint point will be created. You can provide an existing cdnProfile or use a new one. If value is NULL and `cdnEnabled` is true, the default value "AzureMediaStreamingPlatformCdnProfile" is used. If the provided `cdnProfile` already exists, an endpoint is created under it. If the profile does not exist, a new profile automatically gets created.
- `cdnProvider` - When CDN is enabled, you can also pass `cdnProvider` values. `cdnProvider` controls which provider will be used. Currently, three values are supported: "StandardVerizon", "PremiumVerizon" and "StandardAkamai". If no value is provided and `cdnEnabled` is true, "StandardVerizon" is used (that is the default value).
- `crossSiteAccessPolicies` - Used to specify cross site access policies for various clients. For more information, see [Cross-domain policy file specification](https://www.adobe.com/devnet/articles/crossdomain_policy_file_spec.html) and [Making a Service Available Across Domain Boundaries](https://msdn.microsoft.com/library/cc197955\(v=vs.95\).aspx).<br/>The settings only apply to Smooth Streaming.
- `customHostNames` - Used to configure a Streaming Endpoint to accept traffic directed to a custom host name.  This property is valid for Standard and Premium Streaming Endpoints and can be set when `cdnEnabled`: false.
    
    The ownership of the domain name must be confirmed by Media Services. Media Services verifies the domain name ownership by requiring a `CName` record containing the Media Services account ID as a component to be added to the domain in use. As an example, for "sports.contoso.com" to be used as a custom host name for the streaming endpoint, a record for `<accountId>.contoso.com` must be configured to point to one of Media Services verification host names. The verification host name is composed of verifydns.\<mediaservices-dns-zone>. 

    The following are the expected DNS zones to be used in the verify record for different Azure regions.
  
  - North America, Europe, Singapore, Hong Kong SAR, Japan:
      
    - `media.azure.net`
    - `verifydns.media.azure.net`
      
  - China:
        
    - `mediaservices.chinacloudapi.cn`
    - `verifydns.mediaservices.chinacloudapi.cn`
        
    For example, a `CName` record that maps "945a4c4e-28ea-45cd-8ccb-a519f6b700ad.contoso.com" to "verifydns.media.azure.net" proves that the Media Services ID 945a4c4e-28ea-45cd-8ccb-a519f6b700ad has the ownership of the contoso.com domain, thus enabling any name under contoso.com to be used as a custom host name for a streaming endpoint under that account. To find the Media Service ID value, go to the [Azure portal](https://portal.azure.com/) and select your Media Service account. The **Account ID** appears on the top right of the page.
        
    If there is an attempt to set a custom host name without a proper verification of the `CName` record, the DNS response will fail and then be cached for some time. Once a proper record is in place, it might take a while until the cached response is revalidated. Depending on the DNS provider for the custom domain, it could take anywhere from a few minutes to an hour to revalidate the record.
        
    In addition to the `CName` that maps `<accountId>.<parent domain>` to `verifydns.<mediaservices-dns-zone>`, you must create another `CName` that maps the custom host name (for example, `sports.contoso.com`) to your Media Services Streaming Endpoint's host name (for example, `amstest-usea.streaming.media.azure.net`).
 
    > [!NOTE]
    > Streaming Endpoints located in the same data center, cannot share the same custom host name.

    Currently, Media Services doesn’t support SSL with custom domains. 
    
- `maxCacheAge` -  Overrides the default max-age HTTP cache control header set by the streaming endpoint on media fragments and on-demand manifests. The value is set in seconds.
- `resourceState` -

    - Stopped-  the initial state of a Streaming Endpoint after creation
    - Starting - is transitioning to the running state
    - Running - is able to stream content to clients
    - Scaling - the scale units are being increased or decreased
    - Stopping - is transitioning to the stopped state
    - Deleting - is being deleted
    
- `scaleUnits` - Provide you with dedicated egress capacity that can be purchased in increments of 200 Mbps. If you need to move to a **Premium** type, adjust `scaleUnits`.

## Working with CDN

In most cases, you should have CDN enabled. However, if you are anticipating max concurrency lower than 500 viewers then it is recommended to disable CDN since CDN scales best with concurrency.

### Considerations

* The Streaming Endpoint `hostname` and the streaming URL remains the same whether or not you enable CDN.
* If you need the ability to test your content with or without CDN, you can create another Streaming Endpoint that isn't CDN enabled.

### Detailed explanation of how caching works

There is no specific bandwidth value when adding the CDN because the amount of bandwidth that is needed for a CDN enabled streaming endpoint varies. A lot depends on the type of content, how popular it is, bitrates, and the protocols. The CDN is only caching what is being requested. That means that popular content will be served directly from the CDN – as long as the video fragment is cached. Live content is likely to be cached because you typically have many people watching the exact same thing. On-demand content can be a bit trickier because you could have some content that is popular and some that is not. If you have millions of video assets where none of them are popular (only 1 or 2 viewers a week) but you have thousands of people watching all different videos, the CDN becomes much less effective. With this cache misses, you increase the load on the streaming endpoint.
 
You also need to consider how adaptive streaming works. Each individual video fragment is cached as it's own entity. For example, if the first time a certain video is watched, the person skips around watching only a few seconds here and there only the video fragments associated with what the person watched get cached in the CDN. With adaptive streaming, you typically have 5 to 7 different bitrates of video. If one person is watching one bitrate and another person is watching a different bitrate, then they are each cached separately in the CDN. Even if two people are watching the same bitrate they could be streaming over different protocols. Each protocol (HLS, MPEG-DASH, Smooth Streaming) is cached separately. So each bitrate and protocol are cached separately and only those video fragments that have been requested are cached.

### Enable Azure CDN integration

After a Streaming Endpoint is provisioned with CDN enabled there is a defined wait time on Media Services before DNS update is done to map the Streaming Endpoint to CDN endpoint.

If you later want to disable/enable the CDN, your streaming endpoint must be in the **stopped** state. It could take up to two hours for the Azure CDN integration to get enabled and for the changes to be active across all the CDN POPs. However, your can start your streaming endpoint and stream without interruptions from the streaming endpoint and once the integration is complete, the stream is delivered from the CDN. During the provisioning period your streaming endpoint will be in the **starting** state and you might observe degraded performance.

When the Standard streaming endpoint is created, it is configured by default with Standard Verizon. You can configure Premium Verizon or Standard Akamai providers using REST APIs. 

CDN integration is enabled in all the Azure data centers except China and Federal Government regions.

> [!IMPORTANT]
> Azure Media Services integration with Azure CDN is implemented on **Azure CDN from Verizon** for standard streaming endpoints. Premium streaming endpoints can be configured using all **Azure CDN pricing tiers and providers**. For more information about Azure CDN features, see the [CDN overview](../../cdn/cdn-overview.md).

### Determine if DNS change has been made

You can determine if DNS change has been made on a Streaming Endpoint (the traffic is being directed to the Azure CDN) by using https://www.digwebinterface.com. If the results has azureedge.net domain names in the results, the traffic is now being pointed to the CDN.

## Ask questions, give feedback, get updates

Check out the [Azure Media Services community](media-services-community.md) article to see different ways you can ask questions, give feedback, and get updates about Media Services.

## Next steps

The sample [in this repository](https://github.com/Azure-Samples/media-services-v3-dotnet-quickstarts/blob/master/AMSV3Quickstarts/EncodeAndStreamFiles/Program.cs) shows how to start the default streaming endpoint with .NET.

