---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Play back with Azure Media Player - Azure | Microsoft Docs
description: This topic gives an overview of Azure Media Player.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 01/03/2018
ms.author: juliako

---

# Play back with Azure Media Player

[Azure Media Player](https://ampdemo.azureedge.net/azuremediaplayer.html) is a web video player built to play back media content from Microsoft Azure Media Services on a wide variety of browsers and devices. Azure Media Player utilizes industry standards, such as HTML5, Media Source Extensions (MSE), and Encrypted Media Extensions (EME) to provide an enriched adaptive streaming experience. When these standards are not available on a device or in a browser, Azure Media Player uses Flash and Silverlight as fallback technology. Regardless of the playback technology used, developers will have a unified JavaScript interface to access APIs. This allows for content served by Azure Media Services to be played across a wide-range of devices and browsers without any extra effort.

Microsoft Azure Media Services allows for content to be served up with HLS, DASH, Smooth Streaming streaming formats to play back content. Azure Media Player takes into account these various formats and automatically plays the best link based on the platform/browser capabilities. Media Services also allows for dynamic encryption of assets with PlayReady encryption or AES-128 bit envelope encryption. Azure Media Player allows for decryption of PlayReady and AES-128 bit encrypted content when appropriately configured. 

[Start your free trial](http://azure.microsoft.com/en-us/pricing/free-trial/)

## Monitor diagnostics of a video stream

You can use the [Azure Media Player demo page](http://aka.ms/amp) to monitor diagnostics of a video stream. 

![Azure Media Player diagnostics][amp_diagnostics]

## Next steps

- [Sign up to stay up to date with the latest from Azure Media Player](http://azuremediaplayerdemo.azurewebsites.net/amp_signup.html)
- [Azure Media Player documentation](https://aka.ms/ampdocs)
- [Azure Media Player samples](https://aka.ms/ampsamples)
