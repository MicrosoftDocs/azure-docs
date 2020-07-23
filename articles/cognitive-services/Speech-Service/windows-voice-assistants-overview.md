---
title: Voice Assistants on Windows - Overview
titleSuffix: Azure Cognitive Services
description: An overview of the voice assistants on Windows, including capabilities and development resources available.
services: cognitive-services
author: cfogg6
manager: trrwilson
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 04/15/2020
ms.author: travisw
---

# Voice Assistants on Windows

On Windows 10 version 2004 and up, voice assistant applications can take advantage of the Windows ConversationalAgent APIs to achieve a complete voice-enabled assistant experience.

## Voice Assistant Features

Voice agent applications can be activated by a spoken keyword to enable a hands-free, voice driven experience. Voice activation works when the application is closed and when the screen is locked.

In addition, Windows provides a set of voice-activation privacy settings that gives users control of voice activation and above lock activation on a per-app basis.

After voice activation, Windows will manage multiple active agents properly and notify each voice assistant if they are interrupted or deactivated. This allows applications to manage interruptions and other inter-agent events properly.

## How does voice activation work?

The Agent Activation Runtime (AAR) is the ongoing process in Windows that manages application activation on a spoken keyword or button press. It starts with Windows as long as there is at least one application on the system that is registered with the system. Applications interact with AAR through the ConversationalAgent APIs in the Windows SDK.

When the user speaks a keyword, the software or hardware keyword spotter on the system notifies AAR that a keyword has been detected, providing a keyword ID. AAR in turn sends a request to BackgroundService to start the application with the corresponding application ID.

### Registration

The first time a voice activated application is run, it registers its app ID and keyword information through the ConversationalAgent APIs. AAR registers all configurations in the global mapping with the hardware or software keyword spotter on the system, allowing them to detect the application's keyword. The application also [registers with the Background Service](https://docs.microsoft.com/windows/uwp/launch-resume/register-a-background-task).

Note that this means an application cannot be activated by voice until it has been run once and registration has been allowed to complete.

### Receiving an activation

Upon receiving the request from AAR, the Background Service launches the application. The application receives a signal through the OnBackgroundActivated life-cycle method in `App.xaml.cs` with a unique event argument. This argument tells the application that it was activated by AAR and that it should start keyword verification.

If the application successfully verifies the keyword, it can make a request to be shown in the foreground. When this request succeeds, the application displays UI and continues its interaction with the user.

AAR still signals active applications when their keyword is spoken. Rather than signaling through the life-cycle method in `App.xaml.cs`, though, it signals through an event in the ConversationalAgent APIs.

### Keyword verification

The keyword spotter that triggers the application to start has achieved low power consumption by simplifying the keyword model. This allows the keyword spotter to be "always on" without a high power impact, but it also means the keyword spotter will likely have a high number of "false accepts" where it detects a keyword even though no keyword was spoken. This is why the voice activation system launches the application in the background: to give the application a chance to verify that the keyword was spoken before interrupting the user's current session. AAR saves the audio since a few seconds before the keyword was spotted and makes it accessible to the application. The application can use this to run a more reliable keyword spotter on the same audio.

## Next steps

- **Review the design guidelines:** Our [design guidelines](windows-voice-assistants-best-practices.md) lay out the key work required to provide the best possible experiences for voice activation on Windows 10.
- **Visit the Getting Started page:** Start [here](how-to-windows-voice-assistants-get-started.md) for the steps to begin implementing voice assistants on Windows, from setting your development environment through an introduction to implementation guide.
- **Try out the sample app**: To experience these capabilities firsthand, visit the [UWP Voice Assistant Sample](windows-voice-assistants-faq.md#the-uwp-voice-assistant-sample) page and follow the steps to get the sample client running.
