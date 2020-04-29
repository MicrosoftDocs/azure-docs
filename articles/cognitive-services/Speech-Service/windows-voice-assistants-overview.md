---
title: 
Windows Voice Assistants - Overview
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

Voice assistants running on Windows require a unique set of capabilities for a complete user experience. The ConversationalAgent library from the Windows SDK was built to give voice agent applications access to these capabilities and enable full-fledged voice assistant experiences on Windows.

| Feature | Details |
|----------|----------|
|Voice Activation | By registering with the Conversational Agent Platform, a voice agent can be activated by a spoken keyword, even when the agent application is closed.
|Above Lock Activation | Voice agents can be launched with voice activation while the user's computer is locked, even if the lid is closed.
|Multiple Agent Management | If multiple voice agents are installed, the Conversational Agent Platform will manage them properly and notify each voice assistant if they are interrupted or deactivated.
|Privacy Management | The Conversational Agent Platform includes a set of privacy settings, giving users control of voice activation and above lock activation on a per-app basis.

## Getting Started

- **Visit the Getting Started Guide:** We've created a guide for developing voice assistants on Windows [here](windows-voice-assistants-get-started). 
- **Try it out**: To experience these capabilities firsthand, visit the [UWP Voice Assistant Sample](windows-voice-assistants-sample-info) page and follow the steps to get the sample client running.