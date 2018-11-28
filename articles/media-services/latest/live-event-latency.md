---
title: LiveEvent latency in Azure Media Services | Microsoft Docs
description: This topic gives an overview of LiveEvent latency and shows how to set low latency.
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
ms.date: 11/16/2018
ms.author: juliako

---

# LiveEvent latency in Media Services

This article shows how to set low latency on a **LiveEvent**. It also discusses typical results that you see when using the low latency settings in various players. The results vary based on CDN and network latency. 

To use the new **LowLatency** feature, you set the **StreamOptionsFlag** to **LowLatency** on the **LiveEvent**. Once the stream is up and running, you can use the [Azure Media Player](http://ampdemo.azureedge.net/) (AMP) demo page, and set the playback options to use the "Low Latency Heuristics Profile".

The following .NET example shows how to set **LowLatency** on the **LiveEvent**:

```csharp
LiveEvent liveEvent = new LiveEvent(
            location: mediaService.Location, 
            description: "Sample LiveEvent for testing",
            vanityUrl: false,
            encoding: new LiveEventEncoding(
                        // Set this to Basic to enable a transcoding LiveEvent, and None to enable a pass-through LiveEvent
                        encodingType:LiveEventEncodingType.None, 
                        presetName:null
                    ),
            input: new LiveEventInput(LiveEventInputProtocol.RTMP,liveEventInputAccess), 
            preview: liveEventPreview,
            streamOptions: new List<StreamOptionsFlag?>()
            {
                // Set this to Default or Low Latency
                // To use low latency optimally, you should tune your encoder settings down to 1 second GOP size instead of 2 seconds.
                StreamOptionsFlag.LowLatency
            }
        );
```                

See the full example: [MediaV3LiveApp](https://github.com/Azure-Samples/media-services-v3-dotnet-core-tutorials/blob/master/NETCore/Live/MediaV3LiveApp/Program.cs#L126).

### Pass-through LiveEvents

||2s GOP low latency enabled|1s GOP low latency enabled|
|---|---|---|
|DASH in AMP|10s|8s|
|HLS on native iOS player|14s|10s|

> [!Note]
> The end-to-end latency can vary depending on local network conditions or by introducing a CDN caching layer. You should test your exact configurations.

## Next steps

- [Live streaming overview](live-streaming-overview.md)
- [Live streaming tutorial](stream-live-tutorial-with-api.md)

