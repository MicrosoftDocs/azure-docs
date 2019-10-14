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
ms.date: 04/22/2019
ms.author: juliako

---

# Live Event latency in Media Services

This article shows how to set low latency on a [Live Event](https://docs.microsoft.com/rest/api/media/liveevents). It also discusses typical results that you see when using the low latency settings in various players. The results vary based on CDN and network latency.

To use the new **LowLatency** feature, you set the **StreamOptionsFlag** to **LowLatency** on the **LiveEvent**. When creating [LiveOutput](https://docs.microsoft.com/rest/api/media/liveoutputs) for HLS playback, set [LiveOutput.Hls.fragmentsPerTsSegment](https://docs.microsoft.com/rest/api/media/liveoutputs/create#hls) to 1. Once the stream is up and running, you can use the [Azure Media Player](https://ampdemo.azureedge.net/) (AMP demo page), and set the playback options to use the "Low Latency Heuristics Profile".

> [!NOTE]
> Currently, the LowLatency HeuristicProfile in Azure Media Player is designed for playing back streams in MPEG-DASH protocol, with either CSF or CMAF format (for example, `format=mdp-time-csf` or `format=mdp-time-cmaf`). 

The following .NET example shows how to set **LowLatency** on the **LiveEvent**:

```csharp
LiveEvent liveEvent = new LiveEvent(
            location: mediaService.Location, 
            description: "Sample LiveEvent for testing",
            vanityUrl: false,
            encoding: new LiveEventEncoding(
                        // Set this to Standard to enable a transcoding LiveEvent, and None to enable a pass-through LiveEvent
                        encodingType:LiveEventEncodingType.None, 
                        presetName:null
                    ),
            input: new LiveEventInput(LiveEventInputProtocol.RTMP,liveEventInputAccess), 
            preview: liveEventPreview,
            streamOptions: new List<StreamOptionsFlag?>()
            {
                // Set this to Default or Low Latency
                // To use low latency optimally, you should tune your encoder settings down to 1 second "Group Of Pictures" (GOP) length instead of 2 seconds.
                StreamOptionsFlag.LowLatency
            }
        );
```                

See the full example: [MediaV3LiveApp](https://github.com/Azure-Samples/media-services-v3-dotnet-core-tutorials/blob/master/NETCore/Live/MediaV3LiveApp/Program.cs#L126).

## Live Events latency

The following tables show typical results for latency (when the LowLatency flag is enabled) in Media Services, measured from the time the contribution feed reaches the service to when a viewer sees the playback on the player. To use low latency optimally, you should tune your encoder settings down to 1 second "Group Of Pictures" (GOP) length. When using a higher GOP length, you minimize bandwidth consumption and reduce bitrate under same frame rate. It is especially beneficial in videos with less motion.

### Pass-through 

||2s GOP low latency enabled|1s GOP low latency enabled|
|---|---|---|
|DASH in AMP|10s|8s|
|HLS on native iOS player|14s|10s|

### Live encoding

||2s GOP low latency enabled|1s GOP low latency enabled|
|---|---|---|
|DASH in AMP|14s|10s|
|HLS on native iOS player|18s|13s|

> [!NOTE]
> The end-to-end latency can vary depending on local network conditions or by introducing a CDN caching layer. You should test your exact configurations.

## Next steps

- [Live streaming overview](live-streaming-overview.md)
- [Live streaming tutorial](stream-live-tutorial-with-api.md)

