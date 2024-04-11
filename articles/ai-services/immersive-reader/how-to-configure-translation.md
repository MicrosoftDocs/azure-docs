---
title: Configure translation in Immersive Reader
titleSuffix: Azure AI services
description: Learn how to configure the various Immersive Reader options for translation.
author: sharmas
manager: nitinme

ms.service: azure-ai-immersive-reader
ms.topic: how-to
ms.date: 02/27/2024
ms.author: sharmas
---

# How to configure Translation

This article demonstrates how to configure the various options for Translation in the Immersive Reader.

## Configure Translation language

The `options` parameter contains all of the flags that can be used to configure Translation. Set the `language` parameter to the language you wish to translate to. For the full list of supported languages, see [Language support](language-support.md).

```typescript
const options = {
    translationOptions: {
        language: 'fr-FR'
    }
};

ImmersiveReader.launchAsync(YOUR_TOKEN, YOUR_SUBDOMAIN, YOUR_DATA, options);
```

## Automatically translate the document on load

Set `autoEnableDocumentTranslation` to `true` to enable automatic translation of the entire document when the Immersive Reader loads.

```typescript
const options = {
    translationOptions: {
        autoEnableDocumentTranslation: true
    }
};
```

## Enable automatic word translation

Set `autoEnableWordTranslation` to `true` to enable single word translation.

```typescript
const options = {
    translationOptions: {
        autoEnableWordTranslation: true
    }
};
```

## Next step

> [!div class="nextstepaction"]
> [Explore the Immersive Reader SDK reference](reference.md)
