---
title: Supported locales and languages in Custom Speech Service on Azure | Microsoft Docs
description: Overview of supported languages of Custom Speech Service in Cognitive Services.
services: cognitive-services
author: PanosPeriorellis
manager: onano
ms.service: cognitive-services
ms.component: custom-speech
ms.topic: article
ms.date: 02/08/2017
ms.author: panosper
---

# Supported locales in Custom Speech Service

[!INCLUDE [Deprecation note](../../../../includes/cognitive-services-custom-speech-deprecation-note.md)]

The Custom Speech Service currently supports customization of models in the following locales:

| Model Type | Language Support |
|----|-----|
| Acoustic Models | US English (en-US) |
| Language Models | US English (en-US), Chinese (zh-CN) |

Although Acoustic Model customization is only supported in US English, importing Chinese acoustic data is supported for the purposes of offline testing of customized Chinese Language Models.

The appropriate locale must be selected before taking any action. The current locale is indicated in the table title on all data, model, and deployment pages. To change the locale, click the “Change Locale” button located under the table’s title. This will take you to a locale confirmation page. Click “OK” to return to the table.

You should follow up with the next steps
* Learn [how to create a custom acoustic model](cognitive-services-custom-speech-create-acoustic-model.md) to improve recognition accuracy
* Learn [how to create a custom language model](cognitive-services-custom-speech-create-language-model.md) to improve your recognition rate
* Follow the [transcription guidelines](cognitive-services-custom-speech-transcription-guidelines.md) for preparing your data
