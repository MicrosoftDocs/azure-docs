---
author: v-demjoh
ms.service: cognitive-services
ms.topic: include
ms.date: 04/13/2020
ms.author: v-demjoh
---

One of the core features of the Speech service is the ability to recognize human speech and translate it to other languages. In this quickstart you learn how to use the Speech SDK in your apps and products to perform high-quality speech translation. This quickstart translates speech from the microphone into text in another language.

## Prerequisites

This article assumes that you have an Azure account and Speech service subscription. If you don't have an account and subscription, [try the Speech service for free](../../../overview.md#try-the-speech-service-for-free).

[!INCLUDE [SPX Setup](../../spx-setup.md)]

## Set source and target language

This command calls Speech CLI to translate speech from the microphone from Italian to French.

```shell
 spx translate --microphone --source it-IT --target fr
```