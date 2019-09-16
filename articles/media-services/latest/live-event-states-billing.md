---
title: LiveEvent states and billing in Azure Media Services | Microsoft Docs
description: This topic gives an overview of Azure Media Services LiveEvent states and billing.  
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: ne
ms.topic: article
ms.date: 01/28/2019
ms.author: juliako

---

# Live Event states and billing

In Azure Media Services, a Live Event begins billing as soon as its state transitions to **Running**. To stop the Live Event from billing, you have to stop the Live Event.

When **LiveEventEncodingType** on your [Live Event](https://docs.microsoft.com/rest/api/media/liveevents) is set to Standard or Premium1080p, Media Services auto shuts off any Live Event that is still in the **Running** state 12 hours after the input feed is lost, and there are no **Live Output**s running. However, you will still be billed for the time the Live Event was in the **Running** state.

## States

The Live Event can be in one of the following states.

|State|Description|
|---|---|
|**Stopped**| This is the initial state of the Live Event after creation (unless autostart was set to true.) No billing occurs in this state. In this state, the Live Event properties can be updated but streaming is not allowed.|
|**Starting**| The Live Event is being started and resources are being allocated. No billing occurs in this state. Updates or streaming are not allowed during this state. If an error occurs, the Live Event returns to the Stopped state.|
|**Running**| The Live Event resources have been allocated, ingest and preview URLs have been generated, and it is capable of receiving live streams. At this point, billing is active. You must explicitly call Stop on the Live Event resource to halt further billing.|
|**Stopping**| The Live Event is being stopped and resources are being de-provisioned. No billing occurs in this transient state. Updates or streaming are not allowed during this state.|
|**Deleting**| The Live Event is being deleted. No billing occurs in this transient state. Updates or streaming are not allowed during this state.|

## Next steps

- [Live streaming overview](live-streaming-overview.md)
- [Live streaming tutorial](stream-live-tutorial-with-api.md)
