---
author: v-demjoh
ms.service: cognitive-services
ms.topic: include
ms.date: 04/13/2020
ms.author: v-demjoh
---

One of the core features of the Speech service is the ability to recognize human speech and translate it to other languages. In this quickstart you learn how to use the Speech SDK in your apps and products to perform high-quality speech translation. This quickstart covers topics including:

* Translating speech-to-text
* Translating speech to multiple target languages
* Performing direct speech-to-speech translation

## Prerequisites

This article assumes that you have an Azure account and Speech service subscription. If you don't have an account and subscription, [try the Speech service for free](../../../get-started.md).

[!INCLUDE [SPX Setup](../../spx-setup.md)]

## Set source and target language

This command calls Speech CLI to translate speech from the microphone from Italian to French. You can say _grazie_, which translate into _merci_.

```shell
 spx translate --microphone --source it-IT --target fr
```

The **--source** parameter expects a language-locale format string. You can provide any value in the **Locale** column in the list of supported [locales/languages](../../../language-support.md).

## Synthesize translations

### Event-based synthesis

### Manual synthesis

For more information about speech synthesis, see [the basics of speech synthesis](../../../text-to-speech-basics.md).
