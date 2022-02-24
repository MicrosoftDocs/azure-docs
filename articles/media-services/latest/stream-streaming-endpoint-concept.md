---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Streaming Endpoints (Origin)
: Azure Media Services
description: Learn about Streaming Endpoints (Origin), a dynamic packaging and streaming service that delivers content directly to a client player app or to a Content Delivery Network (CDN). 
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: conceptual
ms.date: 01/20/2022
ms.author: inhenkel
---

# Streaming Endpoints (Origin) in Azure Media Services

In Microsoft Azure Media Services, a [Streaming Endpoint](/rest/api/media/streamingendpoints) represents a dynamic (just-in-time) packaging and origin service that can deliver your live and on-demand content directly to a client player app, using one of the common streaming media protocols (HLS or DASH). The **Streaming Endpoint** also provides dynamic (just-in-time) encryption to industry-leading DRMs. 

When you create a Media Services account, a **default** streaming endpoint is created for you in a stopped state. You can create more streaming endpoints can be created under the account (see [Quotas and limits](limits-quotas-constraints-reference.md)).

> [!NOTE]
> To start streaming videos, you need to start the **Streaming Endpoint** from which you want to stream the video.
> You're only billed when your streaming endpoint is in the running state.

Make sure to also review the article [Dynamic packaging](encode-dynamic-packaging-concept.md).

## Naming convention

The host name format of the streaming URL is `{servicename}-{accountname}-{regionname}.streaming.media.azure.net`, where 
`servicename` = the streaming endpoint name or the live event name.

When using the default streaming endpoint, `servicename` is omitted so the URL is: `{accountname}-{regionname}.streaming.azure.net`.

### Limitations

* The streaming endpoint name has a max value of 24 characters.
* The name should follow this [regex](/dotnet/standard/base-types/regular-expression-language-quick-reference) pattern: `^[a-zA-Z0-9]+(-*[a-zA-Z0-9])*$`.

## Types

There are two **Streaming Endpoint** types: **Standard** (preview) and **Premium**. The type is defined by the number of scale units (`scaleUnits`) you allocate for the streaming endpoint.

The maximum streaming unit limit is usually 10. Contact [Azure support](https://azure.microsoft.com/support/create-ticket/) to raise the limit for your account.

The following table describes the Premium and Standard streaming endpoint types.

|Type|Scale units|Description|
|--------|--------|--------|  
|**Standard**|0|The default streaming endpoint is a **Standard** type. You can change it to the Premium type by adjusting the `scaleUnits`.|
|**Premium**|> 0|**Premium** streaming endpoints are suitable for advanced workloads and providing dedicated and scalable bandwidth capacity. You can move to a **Premium** type by adjusting the `scaleUnits` (streaming units). The `scaleUnits` provides a dedicated egress capacity that you can purchase in increments of 200 Mbps. When using the **Premium** type, each enabled unit provides an additional bandwidth capacity to the app. |

> [!NOTE]
> For customers looking to deliver content to large internet audiences, we recommend you enable CDN on the streaming endpoint.

## Comparing streaming types

Feature|Standard|Premium
---|---|---
Throughput |Up to 600 Mbps and can provide a much higher effective throughput when you use CDN.|200 Mbps per streaming unit (SU). Can provide a much higher effective throughput when you use CDN.
CDN|Azure CDN, third-party CDN, or no CDN.|Azure CDN, third-party CDN, or no CDN.
Billing is prorated| Daily|Daily
Dynamic encryption|Yes|Yes
Dynamic packaging|Yes|Yes
Scale|Auto scales up to the targeted throughput.|Additional SUs.
IP filtering/G20/Custom host <sup>1</sup>|Yes|Yes
Progressive download|Yes|Yes
Resource type| Shared <sup>2</sup>|Dedicated
Recommended usage |Recommended for testing and non-essential streaming scenarios.|Professional usage.

<sup>1</sup> Only used directly on the streaming endpoint when the CDN isn't enabled on the endpoint.<br/>
<sup>2</sup> Standard streaming endpoints use a shared pool of resources.<br/>

### Versions

|Type|StreamingEndpointVersion|ScaleUnits|CDN|Billing|
|--------------|----------|-----------------|-----------------|-----------------|
|Classic|1.0|0|NA|Free|
|Standard Streaming Endpoint (preview)|2.0|0|Yes|Paid|
|Premium Streaming Units|1.0|> 0|Yes|Paid|
|Premium Streaming Units|2.0|> 0|Yes|Paid|

> [!NOTE]
> The SLA is only applicable to the Premium streaming endpoints and not the Standard streaming endpoints. For information on SLA, see [Pricing and SLA](https://azure.microsoft.com/pricing/details/media-services/).

## Migration between types

From | To | Action
---|---|---
Classic|Standard|Need to opt in
Classic|Premium| Scale (additional streaming units)
Standard/Premium|Classic|Not available (If the streaming endpoint version is 1.0. Allowed to change to classic by setting the `scaleunits` value to "0".)
Standard (with/without CDN)|Premium with the same configurations.|Allowed in the **started** state (via Azure portal).
Premium (with/without CDN)|Standard with the same configurations.|Allowed in the **started** state (via Azure portal).
Standard (with/without CDN)|Premium with the different configurations.|Allowed in the **stopped** state (via Azure portal). Not allowed in the **running** state.
Premium (with/without CDN)|Standard with the different configurations.|Allowed in the **stopped** state (via Azure portal). Not allowed in the **running** state.
Version 1.0 with SU >= 1 with CDN|Standard/Premium with no CDN|Allowed in the **stopped** state. Not allowed in the **started** state.
Version 1.0 with SU >= 1 with CDN|Standard with/without CDN|Allowed in the **stopped** state. Not allowed in the **started** state. Version 1.0 CDN will be deleted and new one created and started.
Version 1.0 with SU >= 1 with CDN|Premium with/without CDN|Allowed in the **stopped** state. Not allowed in the **started** state. Classic CDN will be deleted and new one created and started.

## Streaming endpoint properties

This section discusses some of the properties of streaming endpoints. For examples of how to create a new streaming endpoint and descriptions of all the properties, see [Streaming endpoint](/rest/api/media/streamingendpoints/create).

* `accessControl` - Configures the following security settings for this streaming endpoint: Akamai Signature Header Authentication keys and IP addresses that are allowed to connect to this endpoint. This property can only be set when `cdnEnabled` is set to false.

- `cdnEnabled` - Indicates if the Azure CDN integration for this streaming endpoint is enabled (disabled by default). If you set `cdnEnabled` to true, the following configurations get disabled: `customHostNames` and `accessControl`.
    
    Not all data centers support the Azure CDN integration. To check if your data center has the Azure CDN integration available, do the following steps:

    - Try to set the `cdnEnabled` to true.
    - Check the returned result for the `HTTP Error Code 412` (PreconditionFailed) message - "Streaming endpoint CdnEnabled property can't be set to true as CDN capability is unavailable in the current region."

    If you get this error, the data center doesn't support it. Try another data center.

- `cdnProfile` - When `cdnEnabled` is set to true, you can also pass `cdnProfile` values. `cdnProfile` is the name of the CDN profile where the CDN endpoint point gets created. You can provide an existing `cdnProfile` or use a new one. If value is `NULL` and `cdnEnabled` is true, the default value "AzureMediaStreamingPlatformCdnProfile" is used. If the provided `cdnProfile` exists already, an endpoint gets created under it. If the profile doesn't exist, a new profile automatically gets created.

- `cdnProvider` - When CDN is enabled, you can also pass `cdnProvider` values. `cdnProvider` controls which provider will be used. Presently, three values are supported - "StandardVerizon", "PremiumVerizon" and "StandardAkamai". If the value is not provided and `cdnEnabled` is true, use the default value "StandardVerizon".

- `crossSiteAccessPolicies` - Specifies cross-site access policies for various clients. For more information, see [Cross-domain policy file specification](https://www.adobe.com/devnet-docs/acrobatetk/tools/AppSec/CrossDomain_PolicyFile_Specification.pdf) and [Making a Service Available Across Domain Boundaries](/previous-versions/azure/azure-services/gg185950(v=azure.100)). The settings only apply to Smooth Streaming.

- `customHostNames` - Configures a streaming endpoint to accept traffic directed to a custom host name. This property is valid for Standard and Premium streaming endpoints and can be set when `cdnEnabled` is false.

    * The ownership of the domain name must be confirmed by Media Services. Media Services verifies the domain name ownership with the help of the `CName` record that contains the Media Services account ID as a component to be added to the domain in use. For example, if you use "sports.contoso.com" as a custom host name for the streaming endpoint, configure a record for `<accountId>.contoso.com` to point to one of Media Services verification host names. The verification host name is composed of `verifydns.<mediaservices-dns-zone>`.

      Following are the expected DNS zones to be used in the verify record for different Azure regions.
  
      - North America, Europe, Singapore, Hong Kong SAR, and Japan:

        - `media.azure.net`
        - `verifydns.media.azure.net`
    
      - China:

        - `mediaservices.chinacloudapi.cn`
        - `verifydns.mediaservices.chinacloudapi.cn`

    * For example, a `CName` record that maps "945a4c4e-28ea-45cd-8ccb-a519f6b700ad.contoso.com" to "verifydns.media.azure.net" proves that the Media Services ID "945a4c4e-28ea-45cd-8ccb-a519f6b700ad" has the ownership of the *contoso.com* domain, enabling any name under *contoso.com* to be used as a custom host name for a streaming endpoint under that account. To find the Media Service ID value, go to the [Azure portal](https://portal.azure.com/) and select your Media Service account. The **Account ID** appears on the top right of the page.

    * If there's an attempt to set a custom host name without a proper verification of the `CName` record, the DNS response will fail and then be cached for some time. Once a proper record is in place, it might take some time until the cached response gets revalidated. Depending on the DNS provider for the custom domain, it takes anywhere from a few minutes to an hour to revalidate the record.

    * In addition to the `CName` that maps `<accountId>.<parent domain>` to `verifydns.<mediaservices-dns-zone>`, you must create another `CName` that maps the custom host name (like `sports.contoso.com`) to your Media Services Streaming Endpoint's host name (like `amstest-usea.streaming.media.azure.net`).

    > [!NOTE]
    > Streaming endpoints located in the same data center can't share the same custom host name.

    Presently, Media Services does not support TLS with custom domains.

- `maxCacheAge` -  Overrides the default max-age HTTP cache control header set by the streaming endpoint on media fragments and on-demand manifests. The value is set in seconds.

- `resourceState` - Below is the description of the states of your streaming endpoint.

    * Stopped - the initial state of a Streaming Endpoint after creation.
    * Starting - Transitioning to the running state.
    * Running - Able to stream content to the clients.
    * Scaling - the scale units are being increased or decreased.
    * Stopping: Transitioning to the stopped state.
    * Deleting: Being deleted.

- `scaleUnits` - Provides a dedicated egress capacity that you can purchase in increments of 200 Mbps. If you need to move to a **Premium** type, adjust the value of `scaleUnits`.

## Why use multiple streaming endpoints?

A single streaming endpoint can stream both live and on-demand videos and most customers use only one streaming endpoint. This section explains the scenarios that might need you to use multiple streaming endpoints.

* Each reserved unit allows for 200 Mbps of bandwidth. If you need more than 2,000 Mbps (2 Gbps) of bandwidth, use the second streaming endpoint and load balance that provides an additional bandwidth.

  CDN is the best way to achieve the scale out for streaming content. However, if you are delivering so much content that the CDN is pulling more than 2 Gbps, you can add additional streaming endpoints (origins). In this case, you would need to hand out content URLs that are balanced across the two streaming endpoints. This approach gives better caching than trying to send requests to each origin randomly (for example, via a traffic manager). 
    
  > [!TIP]
  > Usually, when the CDN is pulling more than 2 Gbps, then something might be misconfigured (for example, no origin shielding).
    
* Load balancing different CDN providers - For example, you could set up the default streaming endpoint to use the Verizon CDN and create a second one to use Akamai. Now, add load balancing between the two endpoints to achieve multi-CDN balancing. 

    However, the customer often does load balancing across multiple CDN providers using a single origin.

* Streaming mixed content - Live streaming and video on-demand. The access patterns for live and on-demand content are different. The live content tends to get a lot of demand for the same content all at once. The video on-demand content (for example, a long tail archive content) has low usage on the same content. Thus, caching works very well on the live content but not as well on the long tail content.

    Consider a scenario in which your customers are mainly watching live content but are only occasionally watching on-demand content and it is served from the same streaming endpoint. The low usage of on-demand content would occupy cache space that would be better saved for the live content. In this scenario, we would recommend serving the live content from one streaming endpoint and the long tail content from another streaming endpoint. This will improve the performance of the live event content.
    
## Scaling streaming with CDN

See the following articles:

- [CDN overview](../../cdn/cdn-overview.md)
- [Scaling streaming with CDN](stream-scale-streaming-cdn-concept.md)

## Ask questions and get updates

Check out the [Azure Media Services community](media-services-community.md) article to see different ways you can ask questions, give feedback, and get updates about Media Services.

## See also

[Dynamic packaging](encode-dynamic-packaging-concept.md)

## Next steps

[Manage streaming endpoints](stream-manage-streaming-endpoints-how-to.md)
