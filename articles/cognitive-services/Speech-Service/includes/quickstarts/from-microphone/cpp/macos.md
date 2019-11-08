---
title: 'Quickstart: Recognize speech from a microphone, C++ (macOS) - Speech Service'
titleSuffix: Azure Cognitive Services
description: Learn how to recognize speech in C++ on macOS by using the Speech SDK
services: cognitive-services
author: wolfma61
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 07/05/2019
ms.author: wolfma
---

## Prerequisites

Before you get started, make sure to:

> [!div class="checklist"]
> * [Create an Azure Speech Resource](../../../../get-started.md)
> * [Setup your development environment](../../../../quickstarts/setup-platform.md?tabs=macos)
> * [Create an empty sample project](../../../../quickstarts/create-project.md?tabs=macos)

## Add sample code

1. Create a C++ source file named `helloworld.cpp`, and paste the following code into it.

   [!code-cpp[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/cpp/macos/from-microphone/helloworld.cpp#code)]

1. In this new file, replace the string `YourSubscriptionKey` with your Speech Services subscription key.

1. Replace the string `YourServiceRegion` with the [region](~/articles/cognitive-services/Speech-Service/regions.md) associated with your subscription (for example, `westus` for the free trial subscription).

## Build the app

> [!NOTE]
> Make sure to enter the commands below as a _single command line_. The easiest way to do that is to copy the command by using the **Copy** button next to each command, and then paste it at your shell prompt.

* Run the following command to build the application.

  ```sh
  g++ helloworld.cpp -o helloworld --std=c++14 -F${SPEECHSDK_ROOT} -framework MicrosoftCognitiveServicesSpeech
  ```

## Run the app

1. Configure the loader's library path to point to the Speech SDK library.

    ```sh
    export DYLD_FRAMEWORK_PATH="$DYLD_FRAMEWORK_PATH:$SPEECHSDK_ROOT"
    ```

1. Run the application.

   ```sh
   ./helloworld
   ```

1. In the console window, a prompt appears, requesting that you say something. Speak an English phrase or sentence. Your speech is transmitted to the Speech Services and transcribed to text, which appears in the same window.

   ```text
   Say something...
   We recognized: What's the weather like?
   ```

## Next steps

[!INCLUDE [footer](./footer.md)]