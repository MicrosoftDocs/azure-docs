---
title: 'Quickstart: Recognize speech, Java (Windows, Linux) - Speech Services'
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll learn to create a simple Java application that captures and transcribes user speech from your computer's microphone.
services: cognitive-services
author: fmegen
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 07/05/2019
ms.author: fmegen
---

# Quickstart: Recognize speech with the Speech SDK for Java

Quickstarts are also available for [speech-to-speech-translation](quickstart-translate-speech-java-jre.md) and [voice-first virtual assistant](quickstart-virtual-assistant-java-jre.md).

If desired, choose a different programming language and/or environment:<br/>
[!INCLUDE [Selector](../../../includes/cognitive-services-speech-service-quickstart-selector.md)]

In this article, you create a Java console application by using the [Speech SDK](speech-sdk.md). You transcribe speech to text in real time from your PC's microphone. The application is built with the Speech SDK Maven package, and the Eclipse Java IDE (v4.8) on 64-bit Windows, 64-bit Linux (Ubuntu 16.04, Ubuntu 18.04, Debian 9), or on macOS 10.13 or later. It runs on a 64-bit Java 8 runtime environment (JRE).

> [!NOTE]
> For the Speech Devices SDK and the Roobo device, see [Speech Devices SDK](speech-devices-sdk.md).

## Prerequisites

This quickstart requires:

* Operating System: 64-bit Windows, 64-bit Linux (Ubuntu 16.04, Ubuntu 18.04, Debian 9), or macOS 10.13 or later
* [Eclipse Java IDE](https://www.eclipse.org/downloads/)
* [Java 8](https://www.oracle.com/technetwork/java/javase/downloads/jre8-downloads-2133155.html) or [JDK 8](https://www.oracle.com/technetwork/java/javase/downloads/index.html)
* An Azure subscription key for the Speech Service. [Get one for free](get-started.md).

If you're running Linux, make sure these dependencies are installed before starting Eclipse.

* On Ubuntu:

  ```sh
  sudo apt-get update
  sudo apt-get install libssl1.0.0 libasound2
  ```

* On Debian 9:

  ```sh
  sudo apt-get update
  sudo apt-get install libssl1.0.2 libasound2
  ```

If you're running Windows (64-bit), ensure you have installed Microsoft Visual C++ Redistributable for your platform.
* [Download Microsoft Visual C++ Redistributable for Visual Studio 2019](https://support.microsoft.com/help/2977003/the-latest-supported-visual-c-downloads)

## Create and configure project

[!INCLUDE [](../../../includes/cognitive-services-speech-service-quickstart-java-create-proj.md)]

## Add sample code

1. To add a new empty class to your Java project, select **File** > **New** > **Class**.

1. In the **New Java Class** window, enter **speechsdk.quickstart** into the **Package** field, and **Main** into the **Name** field.

   ![Screenshot of New Java Class window](media/sdk/qs-java-jre-06-create-main-java.png)

1. Replace all code in `Main.java` with the following snippet:

   [!code-java[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/java-jre/src/speechsdk/quickstart/Main.java#code)]

1. Replace the string `YourSubscriptionKey` with your subscription key.

1. Replace the string `YourServiceRegion` with the [region](regions.md) associated with your subscription (for example, `westus` for the free trial subscription).

1. Save changes to the project.

## Build and run the app

Press F11, or select **Run** > **Debug**.
The next 15 seconds of speech input from your microphone will be recognized and logged in the console window.

![Screenshot of console output after successful recognition](media/sdk/qs-java-jre-07-console-output.png)

## Next steps

Additional samples, such as how to read speech from an audio file, are available on GitHub.

> [!div class="nextstepaction"]
> [Explore Java samples on GitHub](https://aka.ms/csspeech/samples)

## See also

- [Quickstart: Translate speech, Java (Windows, Linux)](quickstart-translate-speech-java-jre.md)
- [Customize acoustic models](how-to-customize-acoustic-models.md)
- [Customize language models](how-to-customize-language-model.md)
