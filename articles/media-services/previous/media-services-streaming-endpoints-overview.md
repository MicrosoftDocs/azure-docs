---

title: Azure Media Services Streaming Endpoint overview | Microsoft Docs 
description: This topic gives an overview of Azure Media Services streaming endpoints.
services: media-services
documentationcenter: ''
author: Juliako
writer: juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/20/2019
ms.author: juliako

---
# Streaming endpoints overview  

> [!NOTE]
> No new features or functionality are being added to Media Services v2. <br/>Check out the latest version, [Media Services v3](https://docs.microsoft.com/azure/media-services/latest/). Also, see [migration guidance from v2 to v3](../latest/migrate-from-v2-to-v3.md)

In Microsoft Azure Media Services (AMS), a **Streaming Endpoint** represents a streaming service that can deliver content directly to a client player application, or to a Content Delivery Network (CDN) for further distribution. Media Services also provides seamless Azure CDN integration. The outbound stream from a StreamingEndpoint service can be a live stream, a video on demand, or progressive download of your asset in your Media Services account. Each Azure Media Services account includes a default StreamingEndpoint. Additional StreamingEndpoints can be created under the account. There are two versions of StreamingEndpoints, 1.0 and 2.0. Starting with January 10th 2017, any newly created AMS accounts will include version 2.0 **default** StreamingEndpoint. Additional streaming endpoints that you add to this account will also be version 2.0. This change will not impact the existing accounts; existing StreamingEndpoints will be version 1.0 and can be upgraded to version 2.0. With this change there will be behavior, billing and feature changes (for more information, see the **Streaming types and versions** section documented below).

Azure Media Services added the following properties to the Streaming Endpoint entity: **CdnProvider**, **CdnProfile**, **StreamingEndpointVersion**. For detailed overview of these properties, see [this](https://docs.microsoft.com/rest/api/media/operations/streamingendpoint). 

When you create an Azure Media Services account a default standard streaming endpoint is created for you in the **Stopped** state. You cannot delete the default streaming endpoint. Depending on the Azure CDN availability in the targeted region, by default newly created default streaming endpoint also includes "StandardVerizon" CDN provider integration. 
                
> [!NOTE]
> Azure CDN integration can be disabled before starting the streaming endpoint. The `hostname` and the streaming URL remains the same whether or not you enable CDN.

This topic gives an overview of the main functionalities that are provided by streaming endpoints.

## Naming conventions

For the default endpoint: `{AccountName}.streaming.mediaservices.windows.net`

For any additional endpoints: `{EndpointName}-{AccountName}.streaming.mediaservices.windows.net`

## Streaming types and versions

### Standard/Premium types (version 2.0)

Starting with the January 2017 release of Media Services, you have two streaming types: **Standard** (preview) and **Premium**. These types are part of the Streaming endpoint version "2.0".


|Type|Description|
|--------|--------|  
|**Standard**|The default Streaming Endpoint is a **Standard** type, can be changed to the Premium type by adjusting streaming units.|
|**Premium** |This option is suitable for professional scenarios that require higher scale or control. You move to a **Premium** type by adjusting streaming units.<br/>Dedicated Streaming Endpoints live in isolated environment and do not compete for resources.|

For customers looking to deliver content to large internet audiences, we recommend that you enable CDN on the Streaming Endpoint.

For more detailed information, see the [Compare Streaming types](#comparing-streaming-types) following section.

### Classic type (version 1.0)

For users who created AMS accounts prior to the January 10 2017 release, you have a **Classic** type of a streaming endpoint. This type is part of the streaming endpoint version "1.0".

If your **version "1.0"** streaming endpoint has >=1 premium streaming units (SU), it will be premium streaming endpoint and will provide all AMS features (just like the **Standard/Premium** type) without any additional configuration steps.

>[!NOTE]
>**Classic** streaming endpoints (version "1.0" and 0 SU), provides limited features and doesn't include a SLA. It is recommended to migrate to **Standard** type to get a better experience and to use features like dynamic packaging or encryption and other features that come with the **Standard** type. To migrate to the **Standard** type, go to the [Azure portal](https://portal.azure.com/) and select **Opt-in to Standard**. For more information about migration, see the [migration](#migration-between-types) section.
>
>Beware that this operation cannot be rolled back and has a pricing impact.
>
 
## Comparing streaming types

### Versions

|Type|StreamingEndpointVersion|ScaleUnits|CDN|Billing|
|--------------|----------|-----------------|-----------------|-----------------|
|Classic|1.0|0|NA|Free|
|Standard Streaming Endpoint (preview)|2.0|0|Yes|Paid|
|Premium Streaming Units|1.0|>0|Yes|Paid|
|Premium Streaming Units|2.0|>0|Yes|Paid|

### Features

Feature|Standard|Premium
---|---|---
Throughput |Up to 600 Mbps and can provide a much higher effective throughput when a CDN is used.|200 Mbps per streaming unit (SU). Can provide a much higher effective throughput when a CDN is used.
CDN|Azure CDN, third party CDN, or no CDN.|Azure CDN, third party CDN, or no CDN.
Billing is prorated| Daily|Daily
Dynamic encryption|Yes|Yes
Dynamic packaging|Yes|Yes
Scale|Auto scales up to the targeted throughput.|Additional streaming units.
IP filtering/G20/Custom host <sup>1</sup>|Yes|Yes
Progressive download|Yes|Yes
Recommended usage |Recommended for the vast majority of streaming scenarios.|Professional usage. 

<sup>1</sup> Only used directly on the Streaming Endpoint when the CDN is not enabled on the endpoint.<br/>

For SLA information, see [Pricing and SLA](https://azure.microsoft.com/pricing/details/media-services/).

## Migration between types

From | To | Action
---|---|---
Classic|Standard|Need to opt-in
Classic|Premium| Scale(additional streaming units)
Standard/Premium|Classic|Not available(If streaming endpoint version is 1.0. It is allowed to change to classic with setting scaleunits to "0")
Standard (with/without CDN)|Premium with the same configurations|Allowed in the **started** state. (via Azure portal)
Premium (with/without CDN)|Standard with the same configurations|Allowed in the **started** state (via Azure portal)
Standard (with/without CDN)|Premium with different config|Allowed in the **stopped** state (via Azure portal). Not allowed in the running state.
Premium (with/without CDN)|Standard with different config|Allowed in the **stopped** state (via Azure portal). Not allowed in the running state.
Version 1.0 with SU >= 1 with CDN|Standard/Premium with no CDN|Allowed in the **stopped** state. Not allowed in the **started** state.
Version 1.0 with SU >= 1 with CDN|Standard with/without CDN|Allowed in the **stopped** state. Not allowed in the **started** state. Version 1.0 CDN will be deleted and new one created and started.
Version 1.0 with SU >= 1 with CDN|Premium with/without CDN|Allowed in the **stopped** state. Not allowed in the **started** state. Classic CDN will be deleted and new one created and started.

## Next steps
Review Media Services learning paths.

[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

