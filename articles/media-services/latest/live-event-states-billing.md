---
title: Live event states and billing in Azure Media Services 
description: This topic gives an overview of Azure Media Services live event states and billing.  
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: ne
ms.topic: conceptual
ms.date: 10/26/2020
ms.author: inhenkel

---

# Live event states and billing

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

In Azure Media Services, a live event begins billing as soon as its state transitions to **Running** or **StandBy**. You will be billed even if there is no video flowing through the service. To stop the live event from billing, you have to stop the live event. Live Transcription is billed the same way as the live event.

When **LiveEventEncodingType** on your [live event](/rest/api/media/liveevents) is set to Standard or Premium1080p, Media Services auto shuts off any live event that is still in the **Running** state 12 hours after the input feed is lost, and there are no **live output**s running. However, you will still be billed for the time the live event was in the **Running** state.

> [!NOTE]
> Pass-through live events are not automatically shut off and must be explicitly stopped through the API to avoid excessive billing.

## States

The live event can be in one of the following states.

|State|Description|
|---|---|
|**Stopped**| This is the initial state of the live event after creation (unless autostart was set to true.) No billing occurs in this state. No input can be received by the live event. |
|**Starting**| The live event is starting and resources getting allocated. No billing occurs in this state.  If an error occurs, the live event returns to the Stopped state.|
| **Allocating** | The allocate action was called on the live event and resources are being provisioned for this live event. Once this operation is done successfully, the live event will transition to StandBy state.
|**StandBy**| live event resources have been provisioned and is ready to start. Billing occurs in this state.  Most properties can still be updated, however ingest or streaming is not allowed during this state.
|**Running**| The live event resources have been allocated, ingest and preview URLs have been generated, and it is capable of receiving live streams. At this point, billing is active. You must explicitly call Stop on the live event resource to halt further billing.|
|**Stopping**| The live event is being stopped and resources are being de-provisioned. No billing occurs in this transient state. |
|**Deleting**| The live event is being deleted. No billing occurs in this transient state. |

You can choose to enable live transcriptions when you create the live event. If you do so, you will be billed for Live Transcriptions whenever the live event is in the **Running** state. Note that you will be billed even if there is no audio flowing through the live event.

## Next steps

- [Live streaming overview](live-streaming-overview.md)
- [Live streaming tutorial](stream-live-tutorial-with-api.md)
