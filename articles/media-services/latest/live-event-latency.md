---
title: LiveEvents latency in Azure Media Services | Microsoft Docs
description: This topic gives an overview of LiveEvent latency.
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
ms.date: 11/08/2018
ms.author: juliako

---

## Latency

This article discusses typical results that you see when using the low latency settings and various players. The results vary based on CDN and network latency.

To use the new LowLatency feature, you can set the **StreamOptionsFlag** to **LowLatency** on the LiveEvent. Once the stream is up and running, you can use the [Azure Media Player](http://ampdemo.azureedge.net/) (AMP) demo page, and set the playback options to use the "Low Latency Heuristics Profile".

### Pass-through LiveEvents

||2s GOP low latency enabled|1s GOP low latency enabled|
|---|---|---|
|DASH in AMP|10s|8s|
|HLS on native iOS player|14s|10s|

## Next steps

[Live streaming tutorial](stream-live-tutorial-with-api.md)
