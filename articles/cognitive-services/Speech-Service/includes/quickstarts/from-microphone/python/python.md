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
> * [Setup your development environment and create an empty project](../../../../quickstarts/setup-platform.md?pivots=programming-language-python)
> * Make sure that you have access to a microphone for audio capture

## Source code

Create a file named *quickstart.py* and paste the following Python code in it.

[!code-python[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/python/from-microphone/quickstart.py#code)]

[!INCLUDE [replace key and region](../replace-key-and-region.md)]

## Code explanation

[!INCLUDE [code explanation](../code-explanation.md)]

## Build and run app

Now you're ready to test the app, and verify the speech recognition functionality using the Speech service.

1. **Start your app** - From the command line, type:
    ```bash
    python quickstart.py
    ```
2. **Start recognition** - It will prompt you to speak a phrase in English. Your speech is sent to the Speech service, transcribed as text, and rendered in the console.

## Next steps

[!INCLUDE [Speech recognition basics](../../speech-to-text-next-steps.md)]

