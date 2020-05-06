---
author: trevorbye
ms.service: cognitive-services
ms.topic: include
ms.date: 04/04/2020
ms.author: trbye
---

## Prerequisites

Before you get started, make sure to:

> [!div class="checklist"]
> * [Create an Azure Speech resource](../../../../get-started.md)
> * [Setup your development environment and create an empty project](../../../../quickstarts/setup-platform.md?tabs=macos&pivots=programming-language-cpp)

[!INCLUDE [Audio input format](~/articles/cognitive-services/speech-service/includes/audio-input-format-chart.md)]

## Add sample code

1. Create a C++ source file named `helloworld.cpp`, and paste the following code into it.

   [!code-cpp[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/cpp/windows/from-file/helloworld/helloworld.cpp#code)]

1. In this new file, replace the string `YourSubscriptionKey` with your Speech service subscription key.

1. Replace the string `YourServiceRegion` with the **Region identifier** from [region](https://aka.ms/speech/sdkregion) associated with your subscription (for example, `westus` for the free trial subscription).

1. Replace the string `whatstheweatherlike.wav` with your own filename.

> [!NOTE]
> The Speech SDK will default to recognizing using en-us for the language, see [Specify source language for speech to text](../../../../how-to-specify-source-language.md) for information on choosing the source language.

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

1. Your audio file is transmitted to the Speech service and the first utterance in the file is transcribed to text, which appears in the same window.

   ```text
   Recognizing first result...
   We recognized: What's the weather like?
   ```

## Next steps

[!INCLUDE [Speech recognition basics](../../speech-to-text-next-steps.md)]
