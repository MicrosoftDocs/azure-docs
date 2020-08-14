---
title: Voice Assistants on Windows - Get Started
titleSuffix: Azure Cognitive Services
description: The steps to begin developing a windows voice agent, including a reference to the sample code quickstart.
services: cognitive-services
author: cfogg6
manager: trrwilson
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 04/15/2020
ms.author: travisw
---
# Getting started with voice assistants on Windows

This guide will take you through the steps to begin developing a voice assistant on Windows.

## Set up your development environment

To start developing a voice assistant for Windows, you will need to make sure you have the proper development environment.

- **Visual Studio:** You will need to install [Microsoft Visual Studio 2017](https://visualstudio.microsoft.com/), Community Edition or higher
- **Windows version**: A PC with a Windows Insider fast ring build of Windows and the Windows Insider version of the Windows SDK. This sample code is verified as working on Windows Insider Release Build 19025.vb_release_analog.191112-1600 using Windows SDK 19018. Any Build or SDK above the specified versions should be compatible.
- **UWP development tools**: The Universal Windows Platform development workload in Visual Studio. See the UWP [Get set up](https://docs.microsoft.com/windows/uwp/get-started/get-set-up) page to get your machine ready for developing UWP Applications.
- **A working microphone and audio output**

## Obtain resources from Microsoft

Some resources necessary for a completely customized voice agent on Windows will require resources from Microsoft. The [UWP Voice Assistant Sample](windows-voice-assistants-faq.md#the-uwp-voice-assistant-sample) provides sample versions of these resources for initial development and testing, so this section is unnecessary for initial development.

- **Keyword model:** Voice activation requires a keyword model from Microsoft in the form of a .bin file. The .bin file provided in the UWP Voice Assistant Sample is trained on the keyword "Contoso".
- **Limited Access Feature Token:** Since the ConversationalAgent APIs provide access to microphone audio, they are protected under Limited Access Feature restrictions. To use a Limited Access Feature, you will need to obtain a Limited Access Feature token connected to the package identity of your application from Microsoft.

## Establish a dialog service

For a complete voice assistant experience, the application will need a dialog service that

- Detect a keyword in a given audio file
- Listen to user input and convert it to text
- Provide the text to a bot
- Translate the text response of the bot to an audio output

These are the requirements to create a basic dialog service using Direct Line Speech.

- **Speech Services subscription:** A subscription for Cognitive Speech Services for speech-to-text and text-to-speech conversions. Try Speech Services for free [here](https://docs.microsoft.com/azure/cognitive-services/speech-service/get-started).
- **Bot Framework bot:**  A bot created using Bot Framework version 4.2 or above that's subscribed to [Direct Line Speech](https://docs.microsoft.com/azure/cognitive-services/speech-service/direct-line-speech) to enable voice input and output. [This guide](https://docs.microsoft.com/azure/cognitive-services/speech-service/tutorial-voice-enable-your-bot-speech-sdk) contains step-by-step instructions to make an "echo bot" and subscribe it to Direct Line Speech. You can also go [here](https://blog.botframework.com/2018/05/07/build-a-microsoft-bot-framework-bot-with-the-bot-builder-sdk-v4/) for steps on how to create a customized bot, then follow the same steps [here](https://docs.microsoft.com/azure/cognitive-services/speech-service/tutorial-voice-enable-your-bot-speech-sdk) to subscribe it to Direct Line Speech, but with your new bot rather than the "echo bot".

## Try out the sample app

With your Speech Services subscription key and echo bot's bot ID, you're ready to try out the [UWP Voice Assistant sample](windows-voice-assistants-faq.md#the-uwp-voice-assistant-sample). Follow the instructions in the readme to run the app and enter your credentials.

## Create your own voice assistant for Windows

Once you've received your Limited Access Feature token and bin file from Microsoft, you can begin on your own voice assistant on Windows.

## Next steps

> [!div class="nextstepaction"]
> [Read the voice assistant implementation guide](windows-voice-assistants-implementation-guide.md)
