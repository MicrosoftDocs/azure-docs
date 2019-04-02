---
title: Encode videos with Standard Encoder in Media Services - Azure | Microsoft Docs
description: This topic shows how to use the Standard Encoder in Media Services to encode an input video with an auto-generated bitrate ladder, based on the input resolution and bitrate. 
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/10/2019
ms.author: juliako
ms.custom: seodec18

---
#  Encode with an auto-generated bitrate ladder

## Overview

This article explains how to use the Standard Encoder in Media Services to encode an input video into an auto-generated bitrate ladder (bitrate-resolution pairs) based on the input resolution and bitrate. This built-in encoder setting, or preset, will never exceed the input resolution and bitrate. For example, if the input is 720p at 3 Mbps, output remains 720p at best, and will start at rates lower than 3 Mbps.

### Encoding for streaming

When you use the **AdaptiveStreaming** preset in **Transform**, you get an output that is suitable for delivery via streaming protocols like HLS and DASH. When using this preset, the service intelligently determines how many video layers to generate and at what bitrate and resolution. The output content contains MP4 files where AAC-encoded audio and H.264-encoded video is not interleaved.

To see an example of how this preset is used, see [Stream a file](stream-files-dotnet-quickstart.md).

## Output

This section shows three examples of the output video layers produced by the Media Services encoder as a result of encoding with the **AdaptiveStreaming** preset. In all cases, the output contains an audio-only MP4 file with stereo audio encoded at 128 kbps.

### Example 1
Source with height "1080" and framerate "29.970" produces 6 video layers:

|Layer|Height|Width|Bitrate (kbps)|
|---|---|---|---|
|1|1080|1920|6780|
|2|720|1280|3520|
|3|540|960|2210|
|4|360|640|1150|
|5|270|480|720|
|6|180|320|380|

### Example 2
Source with height "720" and framerate "23.970" produces 5 video layers:

|Layer|Height|Width|Bitrate (kbps)|
|---|---|---|---|
|1|720|1280|2940|
|2|540|960|1850|
|3|360|640|960|
|4|270|480|600|
|5|180|320|320|

### Example 3
Source with height "360" and framerate "29.970" produces 3 video layers:

|Layer|Height|Width|Bitrate (kbps)|
|---|---|---|---|
|1|360|640|700|
|2|270|480|440|
|3|180|320|230|

## Next steps

> [!div class="nextstepaction"]
> [Stream a file](stream-files-dotnet-quickstart.md)
