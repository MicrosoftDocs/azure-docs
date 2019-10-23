---
title: 'Quickstart: Translate speech-to-speech, Java (Windows, Linux) - Speech Service'
titleSuffix: Azure Cognitive Services
description: TBD
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 07/05/2019
ms.author: erhopf
---

## Prerequisites

Before you get started, make sure to:

> [!div class="checklist"]
> * [Create an Azure Speech Resource](../../../../get-started.md)
> * [Setup your development environment](../../../../quickstarts/setup-platform.md?tabs=jre)
> * [Create an empty sample project](../../../../quickstarts/create-project.md?tabs=jre)

## Add sample code

1. To add a new empty class to your Java project, select **File** > **New** > **Class**.

1. In the **New Java Class** window, enter **speechsdk.quickstart** into the **Package** field, and **Main** into the **Name** field.

   ![Screenshot of New Java Class window](~/articles/cognitive-services/Speech-Service/media/sdk/qs-java-jre-06-create-main-java.png)

1. Replace all code in `Main.java` with the following snippet:

   [!code-java[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/java/jre/translate-speech-to-text/src/speechsdk/quickstart/Main.java#code)]

1. Replace the string `YourSubscriptionKey` with your subscription key.

1. Replace the string `YourServiceRegion` with the [region](~/articles/cognitive-services/Speech-Service/regions.md) associated with your subscription (for example, `westus` for the free trial subscription).

1. Save changes to the project.

## Build and run the app

Press F11, or select **Run** > **Debug**.

The speech input from your microphone will be transcribed into German and logged in the console window. Press "Enter" to stop capturing speech.

![Screenshot of console output after successful recognition](~/articles/cognitive-services/Speech-Service/media/sdk/qs-translate-java-jre-output.png)

## Next steps

Additional samples, such as how to read speech from an audio file, and output translated text as synthesized speech, are available on GitHub.

> [!div class="nextstepaction"]
> [Explore Java samples on GitHub](https://aka.ms/csspeech/samples)

## See also

- [Quickstart: Recognize speech, Java (Windows, Linux)](~/articles/cognitive-services/Speech-Service/quickstarts/speech-to-text-from-microphone.md?pivots=programming-language-java)
- [Customize acoustic models](~/articles/cognitive-services/Speech-Service/how-to-customize-acoustic-models.md)
- [Customize language models](~/articles/cognitive-services/Speech-Service/how-to-customize-language-model.md)
