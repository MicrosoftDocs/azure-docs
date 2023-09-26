---
title: 'Quickstart: Speech SDK C++ (macOS) platform setup - Speech service'
titleSuffix: Azure AI services
description: Use this guide to set up your platform for C++ on macOS by using the Speech SDK.
services: cognitive-services
author: markamos
manager: nitinme
ms.service: azure-ai-speech
ms.topic: include
ms.date: 09/05/2023
ms.author: eur
---

This guide shows how to install the [Speech SDK](~/articles/ai-services/speech-service/speech-sdk.md) for C++ on macOS 10.14 or later. The steps include downloading the [required libraries and header files](https://aka.ms/csspeech/macosbinary) as a *.zip* file.

1. Choose a directory to which the Speech SDK files should be extracted, and set the `SPEECHSDK_ROOT` environment variable to point to that directory. This variable makes it easy to refer to the directory in future commands.

   For example, if you want to use the directory *speechsdk* in your home directory, use a command like the following example:

   ```console
   export SPEECHSDK_ROOT="$HOME/speechsdk"
   ```

1. Create the directory if it doesn't exist:

   ```console
   mkdir -p "$SPEECHSDK_ROOT"
   ```

1. Download and extract the *.zip* archive that contains the Speech SDK XCFramework:

   ```console
   wget -O SpeechSDK-macOS.zip https://aka.ms/csspeech/macosbinary
   unzip SpeechSDK-macOS.zip -d "$SPEECHSDK_ROOT"
   ```

1. Validate the contents of the top-level directory of the extracted package:

   ```console
   ls -l "$SPEECHSDK_ROOT"
   ```

   The directory listing should contain the third-party notice, license files, and a *MicrosoftCognitiveServicesSpeech.xcframework* directory.
