---
title: Azure Media Services high availability streaming
description: Learn how to fail over to a secondary Media Services account if a regional datacenter outage or failure occurs.
services: media-services
documentationcenter: ''
author: juliako
manager: femila
editor: ''

ms.service: media-services
ms.subservice:  
ms.workload: 
ms.topic: article
ms.custom: 
ms.date: 02/24/2020
ms.author: juliako
---

# Media Services high availability streaming

Azure Media Services currently does not provide instant failover of the service if there is a regional datacenter outage or failure of underlying component or dependent services. This article gives guidance how to how to build video-on-demand cross region streaming.

## Prerequisites

Review [How to build a cross-regional encoding system](media-services-high-availability-encoding.md)

## How to build video-on-demand cross region streaming 

* Video-on-demand cross region streaming involves duplicating [Assets](assets-concept.md), [Content Key Policies](content-key-policy-concept.md) (if used), [Streaming Policies](streaming-policy-concept.md), and [Streaming Locators](streaming-locators-concept.md). 
* You will have to create the policies in both regions and keep them up to date. 
* When you create the streaming locators, you will want to use the same Locator ID value, ContentKey ID value, and ContentKey value.  
* If you are encoding the content, it is advised to encode the content in region A and publish it, then copy the encoded content to region B and publish it using the same values as from region A.
* You can use Traffic Manager on the host names for the origin and the key delivery service (in Media Services configuration this will look like a custom key server URL).

## Next steps

Check out:

* [Tutorial: Encode a remote file based on URL and stream the video](stream-files-dotnet-quickstart.md)
* [code samples](https://docs.microsoft.com/samples/browse/?products=azure-media-services)
