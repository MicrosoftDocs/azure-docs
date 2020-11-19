---
author: trevorbye
ms.service: cognitive-services
ms.topic: include
ms.date: 04/03/2020
ms.author: trbye
---

## Prerequisites

Before you get started:

> [!div class="checklist"]
> * <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices" target="_blank">Create an Azure Speech resource <span class="docon docon-navigate-external x-hidden-focus"></span></a>
> * [Setup your development environment and create an empty project](../../../../quickstarts/setup-platform.md?tabs=macos&pivots=programming-language-cpp)
> * Make sure that you have access to a microphone for audio capture

## Source code

Create a C++ source file named *helloworld.cpp*, and paste the following code into it.

[!code-cpp[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/cpp/macos/from-microphone/helloworld.cpp#code)]

[!INCLUDE [replace key and region](../replace-key-and-region.md)]

## Code explanation

[!INCLUDE [code explanation](../code-explanation.md)]

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

1. In the console window, a prompt appears, requesting that you say something. Speak an English phrase or sentence. Your speech is transmitted to the Speech service and transcribed to text, which appears in the same window.

   ```text
   Say something...
   We recognized: What's the weather like?
   ```

## Next steps

[!INCLUDE [Speech recognition basics](../../speech-to-text-next-steps.md)]
