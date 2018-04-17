---
title: Use Azure Media Services built-in standard encoder to auto-generate a bitrate ladder | Microsoft Docs
description: This topic shows how to use Media Services to auto-generate a bitrate ladder based on the input resolution and bitrate. The input resolution and bitrate will never be exceeded. For example, if the input is 720p at 3Mbps, output will remain 720p at best, and will start at rates lower than 3Mbps.
services: media-services
documentationcenter: ''
author: Juliako
manager: cfowler
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/19/2018
ms.author: juliako

---
#  Auto-generate a bitrate ladder

## Overview

This article explains how to auto-generate a bitrate ladder (bitrate-resolution pairs) with Azure Media Services based on the input resolution and bitrate. The auto-generated preset will never exceed the input resolution and bitrate. For example, if the input is 720p at 3 Mbps, output remains 720p at best, and will start at rates lower than 3 Mbps.

### Encoding for streaming only

If your intent is to encode your source video only for streaming, then you should use the **AdaptiveStreaming** preset when creating an encoding transform. When using the **AdaptiveStreaming** preset, Media Services built-in standard encoder intelligently caps a bitrate ladder. However, you will not be able to control the encoding costs, since the service determines how many layers to use and at what resolution. The output Asset contains MP4 files where audio and video is not interleaved.

To see an example of how this preset is used, see [Stream a file](stream-files-dotnet-quickstart.md).

## Output

This section shows three examples of output layers produced by the Media Services encoder as a result of encoding with the **AdaptiveStreaming** preset. 

### Example 1
Source with height "1080" and framerate "29.970" produces 6 video layers:

|Layer|Height|Width|Bitrate(kbps)|
|---|---|---|---|
|1|1080|1920|6780|
|2|720|1280|3520|
|3|540|960|2210|
|4|360|640|1150|
|5|270|480|720|
|6|180|320|380|

### Example 2
Source with height "720" and framerate "23.970" produces 5 video layers:

|Layer|Height|Width|Bitrate(kbps)|
|---|---|---|---|
|1|720|1280|2940|
|2|540|960|1850|
|3|360|640|960|
|4|270|480|600|
|5|180|320|320|

### Example 3
Source with height "360" and framerate "29.970" produces 3 video layers:

|Layer|Height|Width|Bitrate(kbps)|
|---|---|---|---|
|1|360|640|700|
|2|270|480|440|
|3|180|320|230|

## Next steps

> [!div class="nextstepaction"]
> [Stream a file](stream-files-dotnet-quickstart.md)
