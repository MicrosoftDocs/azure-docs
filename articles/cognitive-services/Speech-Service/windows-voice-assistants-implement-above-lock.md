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

Windows allows applications to launch a new application instance above the lock screen. This is a guide to enable a voice assistant on Windows to run above lock, including references to example code and guidelines for managing the application lifecycle.

## Limitations

Above lock applications have a few limitations to note before you decide to enable above-lock functionality.

### Transitioning between above and below lock

Applications cannot transition from being below lock to above lock or vice versa. This means that you must run a new instance of your application when your application is launched above lock. Since voice assistants on Windows can only have one instance running at a time, this means that a below lock instance of your application needs to close when the user locks their screen. Otherwise, only the app below lock will receive an activation signal when the user tries to activate the application.

### User interface limitations

Applications running above lock are advised to treat any key press as a dismissal. In addition, the "x" button in the top right corner of the app typically provided by the UWP framework is not rendered above lock. These limitations mean that the user interface will have to be changed programmatically based on the lock screen state. See [lock screen design guidance link] for guidance on the design and behavior of above lock voice agent experiences.

## User permission
The application entry in the Voice Activation Privacy settings page has a toggle for above lock functionality. For your app to be able to launch above lock, the user will need to turn this setting on.

## Implementation

### Lock screen state
The ConversationalAgent library in the Windows SDK provides an API to make the lock screen state and changes to the lock screen state easily accessible. To detect the current lock screen state, check the ConversationalAgentSession.IsUserAuthenticated field. To detect changes in lock state, add an event handler to the ConversationalAgentSession object's SystemStateChanged event. It will fire whenever the screen changes from unlocked to locked or vice versa. If the value of the event arguments is ConversationalAgentSystemStateChangeType.UserAuthentication, then the lock screen state has changed and the application should close. See example code [here](https://github.com/Azure-Samples/Cognitive-Services-Voice-Assistant/blob/master/clients/csharp-uwp/UWPVoiceAssistantSample/AgentSessionManager.cs#L51).

### Detect user preference
The status of above lock permissions is also stored in the ActivationSignalDetectionConfiguration object. The AvailabilityInfo.HasLockScreenPermission status reflects whether the user has given above lock permission. If this setting is disabled, a voice application can prompt the user to navigate to the appropriate settings page at the link "ms-settings:privacy-voiceactivation" with instructions on how to enable above-lock activation for the application.
