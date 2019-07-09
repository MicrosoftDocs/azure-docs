---
title: Scenario Availability - Speech Services
titlesuffix: Azure Cognitive Services
description: Reference for regions of the Speech Service.
services: cognitive-services
author: chrisbasoglu
manager: xdh
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 05/07/2019
ms.author: cbasoglu
---

# Scenario Availability

The Speech service SDK features many scenarios across a wide variety of programming languages and environments.  Not all scenarios are currently available in all programming languages or all environments yet.  Listed below is the availability of each scenario.

- **Speech-Recognition (SR), Phrase List, Intent, Translation, and On-premises containers**
  - All programming languages/environments where there is an arrow link <img src="media/index/link.jpg" height="15" width="15"></img> in the quickstart table [here](https://aka.ms/csspeech).
- **Text-to-Speech (TTS)**
  - C++/Windows & Linux
  - C#/Windows & UWP & Unity
  - TTS REST API can be used in every other situation.
- **Wake Word (Keyword Spotter/KWS)**
  - C++/Windows & Linux
  - C#/Windows & Linux
  - Python/Windows & Linux
  - Java/Windows & Linux & Android (Speech Devices SDK)
  - Wake Word (Keyword Spotter/KWS) functionality might work with any microphone type, official KWS support, however, is currently limited to the microphone arrays found in the Azure Kinect DK hardware or the Speech Devices SDK
- **Voice-First Virtual Assistant**
  - C++/Windows & Linux & macOS
  - C#/Windows
  - Java/Windows & Linux & macOS & Android (Speech Devices SDK)
- **Conversation Transcription**
  - C++/Windows & Linux
  - C# (Framework & .NET Core)/Windows & UWP & Linux
  - Java/Windows & Linux & Android (Speech Devices SDK)
- **Call Center Transcription**
  - REST API and can be used in any situation
- **Codec Compressed Audio Input**
  - C++/Linux
  - C#/Linux
  - Java/Linux & Android
