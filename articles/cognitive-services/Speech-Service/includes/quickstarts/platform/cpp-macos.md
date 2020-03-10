---
title: 'Quickstart: Speech SDK C++ (macOS) platform setup - Speech service'
titleSuffix: Azure Cognitive Services
description: Use this guide to set up your platform for C++ on macOS with the Speech service SDK.
services: cognitive-services
author: markamos
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 10/14/2019
ms.author: erhopf
---

This guide shows how to install the [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) for C++ on macOS 10.13 and above.

[!INCLUDE [License Notice](~/includes/cognitive-services-speech-service-license-notice.md)]

## System requirements

macOS 10.13 and above

## Install Speech SDK

1. Choose a directory to which the Speech SDK files should be extracted, and set the `SPEECHSDK_ROOT` environment variable to point to that directory. This variable makes it easy to refer to the directory in future commands. For example, if you want to use the directory `speechsdk` in your home directory, use a command like the following:

   ```sh
   export SPEECHSDK_ROOT="$HOME/speechsdk"
   ```

1. Create the directory if it doesn't exist yet.

   ```sh
   mkdir -p "$SPEECHSDK_ROOT"
   ```

1. Download and extract the `.zip` archive containing the Speech SDK framework:

   ```sh
   wget -O SpeechSDK-macOS.zip https://aka.ms/csspeech/macosbinary
   unzip SpeechSDK-macOS.zip -d "$SPEECHSDK_ROOT"
   ```

1. Validate the contents of the top-level directory of the extracted package:

   ```sh
   ls -l "$SPEECHSDK_ROOT"
   ```

   The directory listing should contain the third-party notice and license files, as well as a `MicrosoftCognitiveServicesSpeech.framework` directory.

You can now move on to [Next steps](#next-steps) below.

## Next steps

[!INCLUDE [windows](../quickstart-list.md)]
