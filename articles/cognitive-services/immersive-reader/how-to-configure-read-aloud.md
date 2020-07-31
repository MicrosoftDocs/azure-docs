---
title: "Configure Read Aloud"
titleSuffix: Azure Cognitive Services
description: This article will show you how to configure the various options for Read Aloud.
author: metanMSFT
manager: guillasi

ms.service: cognitive-services
ms.subservice: immersive-reader
ms.topic: conceptual
ms.date: 06/29/2020
ms.author: metan
---

# How to configure Read Aloud

This article demonstrates how to configure the various options for Read Aloud in the Immersive Reader.

## Automatically start Read Aloud

The `options` parameter contains all of the flags that can be used to configure Read Aloud. Set `autoplay` to `true` to enable automatically starting Read Aloud after launching the Immersive Reader.

```typescript
const options = {
    readAloudOptions: {
        autoplay: true
    }
};

ImmersiveReader.launchAsync(YOUR_TOKEN, YOUR_SUBDOMAIN, YOUR_DATA, options);
```

> [!NOTE]
> Due to browser limitations, automatic playback is not supported in Safari.

## Configure the voice

Set `voice` to either `male` or `female`. Not all languages support both voices. For more information, see the [Language Support](./language-support.md) page.

```typescript
const options = {
    readAloudOptions: {
        voice: 'female'
    }
};
```

## Configure playback speed

Set `speed` to a number between `0.5` (50%) and `2.5` (250%) inclusive. Values outside this range will get clamped to either 0.5 or 2.5.

```typescript
const options = {
    readAloudOptions: {
        speed: 1.5
    }
};
```

## Next steps

* Explore the [Immersive Reader SDK Reference](./reference.md)