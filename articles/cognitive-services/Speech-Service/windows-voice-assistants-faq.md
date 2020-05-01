---
title: 
Windows Voice Assistants - FAQ
titleSuffix: Azure Cognitive Services
description: Common questions that frequently come up during Windows voice agent development.
services: cognitive-services
author: cofogg
manager: trrwilson
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 04/15/2020
ms.author: travisw
---

# Frequently asked questions

## General

### How do I contact Microsoft for resources like Limited Access Feature tokens and 1st stage keyword model files?


## Implementation

### My app is showing in a small window when I activate it by voice. How can I transition from the compact view to a full application window?

When your application is first activated by voice, it is started in a compact view. Please read the [Design guidance for voice activation preview](windows-voice-assistants-best-practices#Design-guidance-for-voice-activation-preview) for guidance on the different views and transitions between them for voice assistants on Windows.

To make the transition from compact view to full app view, use the appView API TryEnterViewModeAsync:

var appView = ApplicationView.GetForCurrentView();
 await appView.TryEnterViewModeAsync(ApplicationViewMode.Default);

### Do I have to make my voice assistant a UWP application?

### Do I have to use Direct Line Speech for my Windows Conversational Agent?

The UWP Sample Application was developed using Direct Line Speech and the Speech Services SDK as a demonstration of how to use a dialog service with the Windows Conversational Agent capability. However, you can use any service for local and cloud keyword verification, speech-to-text conversion, bot dialog, and text-to-speech conversion. See how in the [UWP Sample Application docs]().

## Design

## Issues