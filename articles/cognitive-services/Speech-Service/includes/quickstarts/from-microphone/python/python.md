---
title: 'Quickstart: Recognize speech from a microphone, Python - Speech service'
titleSuffix: Azure Cognitive Services
description: Use this guide to create a speech-to-text console application that uses the Speech SDK for Python. When finished, you can use your computer's microphone to transcribe speech to text in real time.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 04/02/2020
ms.author: dapine
---

## Prerequisites

Before you get started:

> [!div class="checklist"]
> * <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices" target="_blank">Create an Azure Speech resource <span class="docon docon-navigate-external x-hidden-focus"></span></a>
> * [Setup your development environment and create an empty project](../../../../quickstarts/setup-platform.md)
> * Make sure that you have access to a microphone for audio capture

## Update source code

Create a file named *quickstart.py* and paste the following Python code in it.

[!code-python[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/python/from-microphone/quickstart.py#code)]

[!INCLUDE [replace key and region](../replace-key-and-region.md)]

## Code explanation

[!INCLUDE [code explanation](../code-explanation.md)]

## Build and run your app

Now you're ready to test the app, and verify the speech recognition functionality using the Speech service.

1. **Start your app** - From the command line, type:
    ```bash
    python quickstart.py
    ```
2. **Start recognition** - It will prompt you to speak a phrase in English. Your speech is sent to the Speech service, transcribed as text, and rendered in the console.

## Next steps

[!INCLUDE [footer](../footer.md)]
