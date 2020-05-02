---
title: 
Voice Assistants on Windows - Overview
titleSuffix: Azure Cognitive Services
description: An overview of the Windows voice assistant platform, including capabilities and development resources available.
services: cognitive-services
author: cofogg
manager: trrwilson
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 04/15/2020
ms.author: travisw
---

# Overview

## Voice Assistants on Windows

On Windows 10 version 2004 and up, voice assistant applications can take advantage of the Windows ConversationalAgent APIs to achieve a complete voice-enabled assistant experience.

| Feature | Details |
|----------|----------|
|Voice Activation | A voice agent can be activated by a spoken keyword, even when the agent application is closed.
|Above Lock Activation | Voice agents can be launched with voice activation while the user's computer is locked, even if the lid is closed.
|Multiple Agent Management | If multiple voice agents are installed, Windows will manage them properly and notify each voice assistant if they are interrupted or deactivated.
|Privacy Management | A set of voice-activation privacy settings gives users control of voice activation and above lock activation on a per-app basis.

## Getting Started

- **Review the design guidelines:** Our [design guidelines](windows-voice-assistants-best-practices) lay out the key work required to provide the best possible experiences for voice activation on Windows 10.
- **Visit the Getting Started Guide:** Start [here](windows-voice-assistants-get-started) for the steps to begin implementing voice assistants on Windows, from setting your development environment through an introduction to the UWP Voice Assistant Sample.
- **Try out the sample app**: To experience these capabilities firsthand, visit the [UWP Voice Assistant Sample](windows-voice-assistants-sample-info) page and follow the steps to get the sample client running.
