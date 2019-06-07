---
title: Subclip a video when encoding with Azure Media Services 
description: This topic describes how to subclip a video when encoding with Azure Media Services, using REST.
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
ms.date: 06/07/2019
ms.author: juliako

---
# Subclip a video when encoding with Media Services

You can trim or subclip a video when encoding it using a [Job](https://docs.microsoft.com/rest/api/media/jobs). This functionality works with any [Transform](https://docs.microsoft.com/rest/api/media/transforms) that is built using either the [BuiltInStandardEncoderPreset](https://docs.microsoft.com/rest/api/media/transforms/createorupdate#builtinstandardencoderpreset) presets, or the [StandardEncoderPreset](https://docs.microsoft.com/rest/api/media/transforms/createorupdate#standardencoderpreset) presets. Also, see [Subclipping scenarios](encoding-concept.md#subclipping-a-video-while-encoding).

The following REST example creates a job that trims a video as it submits an encoding job. 

```rest
```

## Next steps

[How to encode with a custom transform](customize-encoder-presets-how-to.md) 
