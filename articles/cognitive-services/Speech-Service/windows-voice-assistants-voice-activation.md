---
title: 
Voice Assistants on Windows - Voice Activation
titleSuffix: Azure Cognitive Services
description: An overview of the voice activation feature on Windows.
services: cognitive-services
author: cofogg
manager: trrwilson
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 04/15/2020
ms.author: travisw
---

## Voice Activation

Windows supports voice activation for UWP applications. The following is a walk-through of the voice activation system.

### Agent Activation Runtime

The Agent Activation Runtime (AAR) is the ongoing process in Windows that manages application activation on a spoken keyword or button press. It starts with Windows as long as there is at least one application on the system that is registered with the system. Applications interact with AAR through the ConversationalAgent APIs in the Windows SDK.

### Registration

The first time a voice activated application is run, it registers its app id and keyword information in a global signal configuration mapping through the ConversationalAgent APIs. Keyword information includes the location of the keyword model file, the language the keyword is in, and an ID to assign to the keyword. AAR registers all configurations in the global mapping with the hardware or software keyword spotter on the system, allowing them to detect the application's keyword.

The application also [registers with the Background Service](https://docs.microsoft.com/en-us/windows/uwp/launch-resume/register-a-background-task), another process within Windows.

Note that this means an application cannot be activated by voice until it has been run once and registration has been allowed to complete.

### Activation

When the user speaks a keyword, the software or hardware keyword spotter on the system notifies AAR that a keyword has been detected, providing a keyword ID. AAR in turn uses the keyword ID to look up the ActivationSignalDetectorConfiguration application ID in its mapping. To activate the app, AAR sends a request to BackgroundService to start the application with the corresponding application ID.

### Receiving an activation

Upon receiving the request from AAR, the Background Service launches the application. The application receives a signal through the OnBackgroundActivated life cycle method in App.xaml.cs with a unique event argument. This tells the application that it was activated by AAR and should act accordingly.

### Keyword verification

The keyword spotter that triggered the application to start has achieved low power consumption by simplifying the keyword model. This allows the keyword spotter to be "always on" without a high power impact, but it also means the keyword spotter will likely have a high number of "false accepts" where it detects a keyword even though no keyword was spoken. This is why the voice activation system launches the application in the background: to give the application a chance to verify that the keyword was spoken before interrupting the user's current session. AAR saves the audio since a few seconds before the keyword was spotted and makes it accessible to the application. The application can use this to run a more reliable keyword spotter on the same audio.

### Foreground Activation

If the application successfully verifies the keyword, it can make a request to be shown in the foreground and display UI.

### Voice activation while app is active

AAR still signals active applications when their keyword is spoken. Rather than signalling through the life cycle method in App.xaml.cs, though, it signals through an event in the ConversationalAgent APIs.

## Voice Activation Example

For a walk through of example code that completes registration and handles voice activation and keyword verification, visit the [UWP Voice Assistant Sample App](windows-voice-assistants-sample-info).

## Next steps

> [!div class="nextstepaction"]
> [Learn how to implement a voice assistant on Windows](windows-voice-assistants-implementation-guide.md)