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
> * [Setup your development environment and create an empty project](../../../../quickstarts/setup-platform.md?tabs=windows&pivots=programming-language-cpp)
> * Make sure that you have access to a microphone for audio capture

## Source code

Create a C++ source file named *helloworld.cpp*, and paste the following code into it.

[!code-cpp[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/cpp/windows/from-microphone/helloworld/helloworld.cpp#code)]

[!INCLUDE [replace key and region](../replace-key-and-region.md)]

## Code explanation

[!INCLUDE [code explanation](../code-explanation.md)]

## Build and run app

1. From the menu bar, select **Build** > **Build Solution** to build the application. The code should compile without errors now.

1. Choose **Debug** > **Start Debugging** (or press <kbd>F5</kbd>) to start the **helloworld** application.

1. Speak an English phrase or sentence. The application transmits your speech to the Speech service, which transcribes to text and sends it back to the application for display.

   ![Console output after successful recognition](~/articles/cognitive-services/Speech-Service/media/sdk/qs-cpp-windows-08-console-output-release.png)

## Next steps

[!INCLUDE [Speech recognition basics](../../speech-to-text-next-steps.md)]