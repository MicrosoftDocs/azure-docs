---
title: "Configure translation"
titleSuffix: Azure Cognitive Services
description: This article will show you how to configure the various options for translation.
author: metanMSFT
manager: guillasi

ms.service: cognitive-services
ms.subservice: immersive-reader
ms.topic: conceptual
ms.date: 06/29/2020
ms.author: metan
---

# How to configure translation

This article demonstrates how to configure the various options for translation in the Immersive Reader.

## Configure translation language

The `options` parameter contains all of the flags that can be used to configure translation. Set the `language` parameter to the language you wish to translate to. See the [Language Support](./language-support.md) for the full list of supported languages.

```typescript
const options = {
    translationOptions: {
        language: 'fr-FR'
    }
};

ImmersiveReader.launchAsync(YOUR_TOKEN, YOUR_SUBDOMAIN, YOUR_DATA, options);
```

## Automatically translate the document on load

Set `autoEnableDocumentTranslation` to `true` to enable automatically translating the entire document when the Immersive Reader loads.

```typescript
const options = {
    translationOptions: {
        autoEnableDocumentTranslation: true
    }
};
```

## Automatically enable word translation

Set `autoEnableWordTranslation` to `true` to enable single word translation.

```typescript
const options = {
    translationOptions: {
        autoEnableWordTranslation: true
    }
};
```

## Next steps

* Explore the [Immersive Reader SDK Reference](./reference.md)