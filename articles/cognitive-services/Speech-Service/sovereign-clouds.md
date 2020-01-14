---
title: Sovereign Clouds - Speech service
titleSuffix: Azure Cognitive Services
description: Learn how to use Sovereign Clouds
services: cognitive-services
author: cbasoglu
manager: xdh
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 1/14/2020
ms.author: cbasoglu
---

# United States Government Clouds

## Fairfax Cloud

Only US federal, state, local, and tribal governments and their partners have access to this dedicated instance with operations controlled by screened US citizens.

- SR Endpoint: wss://virginia.stt.speech.azure.us
- TTS Endpoint: https[]()://virginia.tts.speech.azure.us
- SR in SpeechSDK:  *config.FromHost("wss://virginia.stt.speech.azure.us", "\<your-key\>");*
- TTS in SpeechSDK:  *config.FromHost("https[]()://virginia.tts.speech.azure.us)", "\<your-key\>");*
- Auth Token Service: https[]()://virginia.api.cognitive.microsoft.us/sts/v1.0/issueToken
- Custom Speech Portal: https://virginia.cris.azure.us/Home/CustomSpeech
- Available SKUs: S0
- Supported features:
  - Speech-to-Text
  - Custom Speech (Acoustic/language adaptation)
  - Text-to-Speech
  - Speech Translator
- Unsupported features
  - Custom Voice
  - Neural voices for Text-to-speech
- Supported locales: Locales for the following languages are supported.
  - Arabic (ar-*)
  - Chinese (zh-*)
  - English (en-*)
  - French (fr-*)
  - German (de-*)
  - Hindi
  - Korean
  - Russian
  - Spanish (es-*)

## Mooncake Cloud

Located in China, an Azure data center with direct access to China Mobile, China Telecom, China Unicom and other major carrier backbone network, for Chinese users to provide high-speed and stable local network access experience.

- SR Endpoint: wss://chinaeast2.stt.speech.azure.cn
- TTS Endpoint: https[]()://chinaeast2.tts.speech.azure.cn
- SR in SpeechSDK: *config.FromHost("wss://chinaeast2.stt.speech.azure.cn", "\<your-key\>");*
- TTS in SpeechSDK:  *config.FromHost("https[]()://chinaeast2.tts.speech.azure.cn", "\<your-key\>");*
- Auth Token Service: https[]()://chinaeast2.api.cognitive.microsoft.cn/sts/v1.0/issueToken
- Custom Speech Portal: https://chinaeast2.cris.azure.cn/Home/CustomSpeech
- Available SKUs: S0
- Supported features:
  - Speech-to-Text
  - Custom Speech (Acoustic/language adaptation)
  - Text-to-Speech
  - Speech Translator
- Unsupported features
  - Custom Voice
  - Neural voices for Text-to-speech
- Supported locales: Locales for the following languages are supported.
  - Arabic (ar-*)
  - Chinese (zh-*)
  - English (en-*)
  - French (fr-*)
  - German (de-*)
  - Hindi
  - Korean
  - Russian
  - Spanish (es-*)

