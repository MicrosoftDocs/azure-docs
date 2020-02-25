---
title: Azure Media Services live event error codes | Microsoft Docs
description: This article lists live event error codes.
author: Juliako
manager: femila
editor: ''
services: media-services
documentationcenter: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/21/2020
ms.author: juliako

---

# Media Services Live Event error codes

The table below lists the [Live Event](live-events-outputs-concept.md) error codes:

|Error|Description|
|---|---| 
|MPE_INGEST_FRAMERATE_EXCEEDED|This error occurs when the incoming encoder is sending streams exceeding 30fps for encoding live events/channels.|
|MPE_INGEST_VIDEO_RESOLUTION_NOT_SUPPORTED|This error occurs when the incoming encoder is sending streams exceeding the following resolutions: 1920x1088 for encoding live events/channels and 4096 x 2160 for pass-through live events/channels.|

## See also

[Streaming Endpoint (Origin) error codes](streaming-endpoint-error-codes.md)

## Next steps

[Tutorial: Stream live with Media Services](stream-live-tutorial-with-api.md)
