---
title: 
Windows Voice Assistants - Above Lock Implementation Guidelines
titleSuffix: Azure Cognitive Services
description: The instructions to implement above-lock capabilities for a voice agent application.
services: cognitive-services
author: cofogg
manager: trrwilson
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 04/15/2020
ms.author: travisw
---

# Implementing Above Lock Activation

This is a guide to enable a voice assistant on Windows to run above lock, including references to example code and guidelines for managing the application lifecycle. For guidance on designing above lock experiences, visit the [best practices guide](windows-voice-assistants-best-practices).

## Transitioning between above and below lock

### Detecting lock screen transitions

The ConversationalAgent library in the Windows SDK provides an API to make the lock screen state and changes to the lock screen state easily accessible. To detect the current lock screen state, check the `ConversationalAgentSession.IsUserAuthenticated` field. To detect changes in lock state, add an event handler to the `ConversationalAgentSession` object's `SystemStateChanged` event. It will fire whenever the screen changes from unlocked to locked or vice versa. If the value of the event arguments is `ConversationalAgentSystemStateChangeType.UserAuthentication`, then the lock screen state has changed and the application should close. See example code [here](https://github.com/Azure-Samples/Cognitive-Services-Voice-Assistant/blob/master/clients/csharp-uwp/UWPVoiceAssistantSample/AgentSessionManager.cs#L51).

### Closing the application

To properly close the application programmatically while above or below lock, use the `WindowService.CloseWindow()` API. This triggers all UWP lifecycle methods, including OnSuspend, allowing the application to dispose of its `ConversationalAgentSession` instance before closing.

## User permission

The application entry in the Voice Activation Privacy settings page has a toggle for above lock functionality. For your app to be able to launch above lock, the user will need to turn this setting on.

### Detect user preference

The status of above lock permissions is also stored in the ActivationSignalDetectionConfiguration object. The AvailabilityInfo.HasLockScreenPermission status reflects whether the user has given above lock permission. If this setting is disabled, a voice application can prompt the user to navigate to the appropriate settings page at the link "ms-settings:privacy-voiceactivation" with instructions on how to enable above-lock activation for the application.
