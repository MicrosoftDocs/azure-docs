---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Streaming Endpoints (Origin)
titleSuffix: Azure Media Services
description: Learn about Streaming Endpoints (Origin), a dynamic packaging and streaming service that delivers content directly to a client player app or to a Content Delivery Network (CDN). 
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 02/13/2020
ms.author: juliako
---

# Streaming Endpoints (Origin) in Azure Media Services

In Microsoft Azure Media Services, a [Streaming Endpoint](https://docs.microsoft.com/rest/api/media/streamingendpoints) represents a dynamic (just-in-time) packaging and origin service that can deliver your live and on-demand content directly to a client player app using one of the common streaming media protocols (HLS or DASH). In addition, the **Streaming Endpoint** provides dynamic (just-in-time) encryption to industry-leading DRMs. 

When you create a Media Services account, a **default** Streaming Endpoint is created for you in a stopped state. You can't delete the **default** Streaming Endpoint. More Streaming Endpoints can be created under the account (see [Quotas and limits](limits-quotas-constraints.md)).

> [!NOTE]
> To start streaming videos, you need to start the **Streaming Endpoint** from which you want to stream the video.
>
> You're only billed when your Streaming Endpoint is in the running state.

Make sure to also review the [Dynamic packaging](dynamic-packaging-overview.md) topic. 

## Naming convention

The host name format of the streaming URL is: `{servicename}-{accountname}-{regionname}.streaming.media.azure.net`, where 
`servicename` = the streaming endpoint name or the live event name.

When using the default streaming endpoint, `servicename` is omitted so the URL is: `{accountname}-{regionname}.streaming.azure.net`.

### Limitations

* The streaming endpoint name has a max value of 24 characters.
* The name should follow this [regex](https://docs.microsoft.com/dotnet/standard/base-types/regular-expression-language-quick-reference) pattern: `^[a-zA-Z0-9]+(-*[a-zA-Z0-9])*$`.

## Types

There are two **Streaming Endpoint** types: **Standard** (preview) and **Premium**. The type is defined by the number of scale units (`scaleUnits`) you allocate for the streaming endpoint.

The table describes the types:

|Type|Scale units|Description|
|--------|--------|--------|  
|**Standard**|0|The default Streaming Endpoint is a **Standard** type—it can be changed to the Premium type by adjusting `scaleUnits`.|
|**Premium**|>0|**Premium** Streaming Endpoints are suitable for advanced workloads and providing dedicated and scalable bandwidth capacity. You move to a **Premium** type by adjusting `scaleUnits` (streaming units). `scaleUnits` provide you with dedicated egress capacity that can be purchased in increments of 200 Mbps. When using the **Premium** type, each enabled unit provides additional bandwidth capacity to the app. |

> [!NOTE]
> For customers looking to deliver content to large internet audiences, we recommend that you enable CDN on the Streaming Endpoint.

For SLA information, see [Pricing and SLA](https://azure.microsoft.com/pricing/details/media-services/).

## Comparing streaming types

Feature|Standard|Premium
---|---|---
Throughput |Up to 600 Mbps and can provide a much higher effective throughput when a CDN is used.|200 Mbps per streaming unit (SU). Can provide a much higher effective throughput when a CDN is used.
CDN|Azure CDN, third-party CDN, or no CDN.|Azure CDN, third-party CDN, or no CDN.
Billing is prorated| Daily|Daily
Dynamic encryption|Yes|Yes
Dynamic packaging|Yes|Yes
Scale|Auto scales up to the targeted throughput.|Additional SUs
IP filtering/G20/Custom host <sup>1</sup>|Yes|Yes
Progressive download|Yes|Yes
Recommended usage |Recommended for the vast majority of streaming scenarios.|Professional usage.

<sup>1</sup> Only used directly on the Streaming Endpoint when the CDN isn't enabled on the endpoint.<br/>

## Streaming Endpoint properties

This section gives details about some of the Streaming Endpoint's properties. For examples of how to create a new streaming endpoint and descriptions of all properties, see [Streaming Endpoint](https://docs.microsoft.com/rest/api/media/streamingendpoints/create).

- `accessControl`: Used to configure the following security settings for this streaming endpoint: Akamai Signature Header Authentication keys and IP addresses that are allowed to connect to this endpoint. This property can only be set when `cdnEnabled` is set to false.

- `cdnEnabled`: Indicates if the Azure CDN integration for this streaming endpoint is enabled (disabled by default). If you set `cdnEnabled` to true, the following configurations get disabled: `customHostNames` and `accessControl`.

    Not all data centers support the Azure CDN integration. To check if your data center has the Azure CDN integration available, do the following steps:

  - Try to set the `cdnEnabled` to true.
  - Check the returned result for an `HTTP Error Code 412` (PreconditionFailed) with a message of "Streaming endpoint CdnEnabled property can't be set to true as CDN capability is not available in the current region."

    If you get this error, the data center doesn't support it. Try another data center.

- `cdnProfile`: When `cdnEnabled` is set to true, you can also pass `cdnProfile` values. `cdnProfile` is the name of the CDN profile where the CDN endpoint point will be created. You can provide an existing cdnProfile or use a new one. If value is NULL and `cdnEnabled` is true, the default value "AzureMediaStreamingPlatformCdnProfile" is used. If the provided `cdnProfile` already exists, an endpoint is created under it. If the profile doesn't exist, a new profile automatically gets created.
- `cdnProvider`: When CDN is enabled, you can also pass `cdnProvider` values. `cdnProvider` controls which provider will be used. Currently, three values are supported: "StandardVerizon", "PremiumVerizon" and "StandardAkamai". If no value is provided and `cdnEnabled` is true, "StandardVerizon" is used (that's the default value).
- `crossSiteAccessPolicies`: Used to specify cross site access policies for various clients. For more information, see [Cross-domain policy file specification](https://www.adobe.com/devnet/articles/crossdomain_policy_file_spec.html) and [Making a Service Available Across Domain Boundaries](https://msdn.microsoft.com/library/cc197955\(v=vs.95\).aspx). The settings only apply to Smooth Streaming.
- `customHostNames`: Used to configure a Streaming Endpoint to accept traffic directed to a custom host name. This property is valid for Standard and Premium Streaming Endpoints and can be set when `cdnEnabled`: false.

    The ownership of the domain name must be confirmed by Media Services. Media Services verifies the domain name ownership by requiring a `CName` record containing the Media Services account ID as a component to be added to the domain in use. As an example, for "sports.contoso.com" to be used as a custom host name for the streaming endpoint, a record for `<accountId>.contoso.com` must be configured to point to one of Media Services verification host names. The verification host name is composed of verifydns.\<mediaservices-dns-zone>.

    The following are the expected DNS zones to be used in the verify record for different Azure regions.
  
  - North America, Europe, Singapore, Hong Kong SAR, Japan:

    - `media.azure.net`
    - `verifydns.media.azure.net`

  - China:

    - `mediaservices.chinacloudapi.cn`
    - `verifydns.mediaservices.chinacloudapi.cn`

    For example, a `CName` record that maps "945a4c4e-28ea-45cd-8ccb-a519f6b700ad.contoso.com" to "verifydns.media.azure.net" proves that the Media Services ID 945a4c4e-28ea-45cd-8ccb-a519f6b700ad has the ownership of the contoso.com domain, thus enabling any name under contoso.com to be used as a custom host name for a streaming endpoint under that account. To find the Media Service ID value, go to the [Azure portal](https://portal.azure.com/) and select your Media Service account. The **Account ID** appears on the top right of the page.

    If there's an attempt to set a custom host name without a proper verification of the `CName` record, the DNS response will fail and then be cached for some time. Once a proper record is in place, it might take a while until the cached response is revalidated. Depending on the DNS provider for the custom domain, it takes anywhere from a few minutes to an hour to revalidate the record.

    In addition to the `CName` that maps `<accountId>.<parent domain>` to `verifydns.<mediaservices-dns-zone>`, you must create another `CName` that maps the custom host name (for example, `sports.contoso.com`) to your Media Services Streaming Endpoint's host name (for example, `amstest-usea.streaming.media.azure.net`).

    > [!NOTE]
    > Streaming Endpoints located in the same data center can't share the same custom host name.

    Currently, Media Services doesn't support TLS with custom domains.

- `maxCacheAge` -  Overrides the default max-age HTTP cache control header set by the streaming endpoint on media fragments and on-demand manifests. The value is set in seconds.
- `resourceState` -

    - Stopped: the initial state of a Streaming Endpoint after creation
    - Starting: is transitioning to the running state
    - Running: is able to stream content to clients
    - Scaling: the scale units are being increased or decreased
    - Stopping: is transitioning to the stopped state
    - Deleting: is being deleted

- `scaleUnits`: Provide you with dedicated egress capacity that can be purchased in increments of 200 Mbps. If you need to move to a **Premium** type, adjust `scaleUnits`.

## Why use multiple streaming endpoints?

A single streaming endpoint can stream both live and on-demand videos and most customers only use one streaming endpoint. This section gives some examples of why you may need to use multiple streaming endpoints.

* Each reserved unit allows for 200 Mbps of bandwidth. If you need more than 2,000 Mbps (2 Gbps) of bandwidth, you could use the second streaming endpoint and load balance to give you additional bandwidth.

    However, CDN is the best way to achieve scale out for streaming content but if you are delivering so much content that the CDN is pulling more than 2 Gbps then you can add additional streaming endpoints (origins). In this case you would need to hand out content URLs that are balanced across the two streaming endpoints. This approach gives better caching than trying to send requests to each origin randomly (for example, via a traffic manager). 
    
    > [!TIP]
    > Usually if the CDN is pulling more than 2 Gbps then something might be misconfigured (for example, no origin shielding).
    
* Load balancing different CDN providers. For example, you could set up the default streaming endpoint to use the Verizon CDN and create a second one to use Akamai. Then add some load balancing between the two to achieve multi-CDN balancing. 

    However, customer often do load balancing across multiple CDN providers using a single origin.
* Streaming mixed content: Live and Video on Demand. 

    The access patterns for live and on-demand content are very different. The live content tends to get a lot of demand for the same content all at once. The video on-demand content (long tail archive content for instance) has low usage on the same content. Thus caching works very well on the live content but not as well on the long tail content.

    Consider a scenario in which your customers are mainly watching live content but are only occasionally watching on-demand content and it is served from the same Streaming Endpoint. The low usage of on-demand content would occupy cache space that would be better saved for the live content. In this scenario, we would recommend serving the live content from one Streaming Endpoint and the long tail content from another Streaming Endpoint. This will improve the performance of the live event content.
    
## Scaling streaming with CDN

See the following articles:

- [CDN overview](../../cdn/cdn-overview.md)
- [Scaling streaming with CDN](scale-streaming-cdn.md)

## Ask questions and  get updates

Check out the [Azure Media Services community](media-services-community.md) article to see different ways you can ask questions, give feedback, and get updates about Media Services.

## See also

[Dynamic packaging](dynamic-packaging-overview.md)

## Next steps

[Manage streaming endpoints](manage-streaming-endpoints-howto.md)
