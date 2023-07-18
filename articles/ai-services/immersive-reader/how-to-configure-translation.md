---
title: "Configure translation"
titleSuffix: Azure AI services
description: This article will show you how to configure the various options for translation.
author: rwallerms
manager: nitinme

ms.service: applied-ai-services
ms.subservice: immersive-reader
ms.topic: how-to
ms.date: 01/06/2022
ms.author: rwaller
---

# How to configure Translation

This article demonstrates how to configure the various options for Translation in the Immersive Reader.

## Configure Translation language

The `options` parameter contains all of the flags that can be used to configure Translation. Set the `language` parameter to the language you wish to translate to. See the [Language Support](./language-support.md) for the full list of supported languages.

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
