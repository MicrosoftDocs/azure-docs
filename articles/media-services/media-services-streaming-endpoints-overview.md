---

title: Azure Media Services Streaming Endpoint overview | Microsoft Docs 
description: This topic gives an overview of Azure Media Services streaming endpoints.
services: media-services
documentationcenter: ''
author: Juliako
writer: juliako
manager: erikre
editor: ''

ms.assetid: 097ab5e5-24e1-4e8e-b112-be74172c2701
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/13/2017
ms.author: juliako

---
# Streaming endpoints overview 

##Overview

In Microsoft Azure Media Services (AMS), a **Streaming Endpoint** represents a streaming service that can deliver content directly to a client player application, or to a Content Delivery Network (CDN) for further distribution. Media Services also provides seamless Azure CDN integration. The outbound stream from a StreamingEndpoint service can be a live stream, a video on demand, or progressive download of your asset in your Media Services account. Each Azure Media Services account includes a default StreamingEndpoint. Additional StreamingEndpoints can be created under the account. There are two versions of StreamingEndpoints, 1.0 and 2.0. Starting with January 10th 2017, any newly created AMS accounts will include version 2.0 **default** StreamingEndpoint. Additional streaming endpoints that you add to this account will also be version 2.0. This change will not impact the existing accounts; existing StreamingEndpoints will be version 1.0 and can be upgraded to version 2.0. With this change there will be behavior, billing and feature changes (for more information, see the **Streaming types and versions** section documented below).

In addition, starting with the 2.15 version (released in January 2017), Azure Media Services added the following properties to the Streaming Endpoint entity: **CdnProvider**, **CdnProfile**, **FreeTrialEndTime**, **StreamingEndpointVersion**. For detailed overview of these properties, see [this](https://docs.microsoft.com/rest/api/media/operations/streamingendpoint). 

When you create an Azure Media Services account a default standard streaming endpoint is created for you in the **Stopped** state. You cannot delete the default streaming endpoint. Depending on the Azure CDN availability in the targeted region, by default newly created default streaming endpoint also includes "StandardVerizon" CDN provider integration. 

>[!NOTE]
>Azure CDN integration can be disabled before starting the streaming endpoint.

This topic gives an overview of the main functionalities that are provided by streaming endpoints.

## Streaming types and versions

### Standard/Premium types (version 2.0)

Starting with the January 2017 release of Media Services, you have two streaming types: **Standard** and **Premium**. These types are part of the Streaming endpoint version "2.0".

Type|Description
---|---
**Standard**|This is the default option that would work for the majority of the scenarios.<br/>With this option, you get fixed/limited SLA, first 15 days after you start the streaming endpoint is free.<br/>If you create more than one streaming endpoints, only the first one is free for the first 15 days, the others are billed as soon as you start them. <br/>Note that free trial only applies to newly created media services accounts and default streaming endpoint. Existing streaming endpoints and additionally created streaming endpoints doesn't includes free trial period even they are upgraded to version 2.0 or they are created as version 2.0.
**Premium**|This option is suitable for professional scenarios that require higher scale or control.<br/>Variable SLA that is based on premium streaming unit (SU) capacity purchased, dedicated streaming endpoints live in isolated environment and do not compete for resources.

For more detailed information, see the **Compare Streaming types** following section.

### Classic type (version 1.0)

For users who created AMS accounts prior to the January 10 2017 release, you have a **Classic** type of a streaming endpoint. This type is part of the streaming endpoint version "1.0".

If your **version "1.0"** streaming endpoint has >=1 premium streaming units (SU), it will be premium streaming endpoint and will provide all AMS features (just like the **Standard/Premium** type) without any additional configuration steps.

>[!NOTE]
>**Classic** streaming endpoints (version "1.0" and 0 SU), provides limited features and doesn't include a SLA. It is recommended to migrate to **Standard** type to get a better experince and to use features like dynamic packaging or encryption and other features that come with the **Standard** type. To migrate to the **Standard** type, go to the [Azure portal](https://portal.azure.com/) and select **Opt-in to Standard**. For more information about migration, see the [migration](#migration-between-types) section.
>
>Beware that this operation cannot be rolled back and has a pricing impact.
>
 
## Comparing streaming types

### Versions

|Type|StreamingEndpointVersion|ScaleUnits|CDN|Billing|SLA| 
|--------------|----------|-----------------|-----------------|-----------------|-----------------|    
|Classic|1.0|0|NA|Free|NA|
|Standard Streaming Endpoint|2.0|0|Yes|Paid|Yes|
|Premium Streaming Units|1.0|>0|Yes|Paid|Yes|
|Premium Streaming Units|2.0|>0|Yes|Paid|Yes|

### Features

Feature|Standard|Premium
---|---|---
Free first 15 days| Yes |No
Throughput |Up to 600 Mbps when Azure CDN is not used. Scales with CDN.|200 Mbps per streaming unit (SU). Scales with CDN.
SLA | 99.9|99.9(200 Mbps per SU).
CDN|Azure CDN, third party CDN, or no CDN.|Azure CDN, third party CDN, or no CDN.
Billing is prorated| Daily|Daily
Dynamic encryption|Yes|Yes
Dynamic packaging|Yes|Yes
Scale|Auto scales up to the targeted throughput.|Additional streaming units
IP filtering/G20/Custom host|Yes|Yes
Progressive download|Yes|Yes
Recommended usage |Recommended for the vast majority of streaming scenarios.|Professional usage.<br/>If you think you may have needs beyond Standard. Contact us (amsstreaming at microsoft.com) if you expect a concurrent audience size larger than 50,000 viewers.


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

[!INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]

