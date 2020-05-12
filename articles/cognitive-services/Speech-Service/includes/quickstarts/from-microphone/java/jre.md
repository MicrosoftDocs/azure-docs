---
author: trevorbye
ms.service: cognitive-services
ms.topic: include
ms.date: 04/02/2020
ms.author: trbye
---

## Prerequisites

Before you get started:

> [!div class="checklist"]
> * <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices" target="_blank">Create an Azure Speech resource <span class="docon docon-navigate-external x-hidden-focus"></span></a>
> * [Setup your development environment and create an empty project](../../../../quickstarts/setup-platform.md?tabs=jre&pivots=programming-language-java)
> * Make sure that you have access to a microphone for audio capture

## Source code

To add a new empty class to your Java project, select **File** > **New** > **Class**. In the **New Java Class** window, enter **speechsdk.quickstart** into the **Package** field, and **Main** into the **Name** field.

![Screenshot of New Java Class window](~/articles/cognitive-services/Speech-Service/media/sdk/qs-java-jre-06-create-main-java.png)

Replace the contents of the *Main.java* file with the following snippet:

[!code-java[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/java/jre/from-microphone/src/speechsdk/quickstart/Main.java#code)]

[!INCLUDE [replace key and region](../replace-key-and-region.md)]

## Code explanation

[!INCLUDE [code explanation](../code-explanation.md)]

## Build and run app

Press <kbd>F11</kbd>, or select **Run** > **Debug**.
The next 15 seconds of speech input from your microphone will be recognized and logged in the console window.

![Screenshot of console output after successful recognition](~/articles/cognitive-services/Speech-Service/media/sdk/qs-java-jre-07-console-output.png)

## Next steps

[!INCLUDE [Speech recognition basics](../../speech-to-text-next-steps.md)]

