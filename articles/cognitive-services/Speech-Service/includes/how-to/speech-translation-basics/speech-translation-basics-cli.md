---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 04/13/2020
ms.author: eric-urban
---

One of the core features of the Speech service is the ability to recognize human speech and translate it to other languages. In this quickstart, you learn how to use the Speech SDK in your apps and products to perform high-quality speech translation. This quickstart translates speech from the microphone to text in another language.

## Prerequisites

This article assumes that you have an Azure account and a Speech service subscription. If you don't have an account and a subscription, [try the Speech service for free](../../../overview.md#try-the-speech-service-for-free).

[!INCLUDE [SPX Setup](../../spx-setup.md)]

## Set source and target languages

This command calls the Speech CLI to translate speech from the microphone from Italian to French:

```shell
 spx translate --microphone --source it-IT --target fr
```
