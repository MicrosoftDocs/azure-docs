---
title: 'Quickstart: Recognize and transcribe speech, .NET Framework (Windows) - Speech Service'
titleSuffix: Azure Cognitive Services
description: Use this guide to create a speech-to-text console application using the .NET framework for Windows and the Speech SDK. When finished, you can use your computer's microphone to transcribe speech to text in real time.
services: cognitive-services
author: wolfma61
manager: cgronlun
ms.service: cognitive-services
ms.component: speech-service
ms.topic: quickstart
ms.date: 11/05/2018
ms.author: wolfma
---

# Quickstart: Recognize and transcribe speech using the Speech SDK and .NET Framework (Windows)

[!INCLUDE [Selector](../../../includes/cognitive-services-speech-service-quickstart-selector.md)]

Use this guide to create a speech-to-text console application using the .NET framework for Windows and the Speech SDK. When finished, you can use your computer's microphone to transcribe speech to text in real time.

This quickstart requires an [Azure Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with Microsoft Speech enabled. If you don't have an account, you can use the [free trial](https://docs.microsoft.com/azure/cognitive-services/speech-service/get-started) to get a subscription key.

## Prerequisites

To complete this project, you'll need:

* [Visual Studio 2017](https://visualstudio.microsoft.com/downloads/)
* A subscription key for the Speech Service
* Access to your computer's microphone

## Create a Visual Studio project

[!INCLUDE [Create project ](../../../includes/cognitive-services-speech-service-create-speech-project-vs-csharp.md)]

## Add sample code

1. Open `Program.cs` and replace the automatically generated code with this sample:

    [!code-csharp[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/csharp-dotnet-windows/helloworld/Program.cs#code)]

1. Locate and replace the string `YourSubscriptionKey` with your Speech Service subscription key.

1. Locate and replace the string `YourServiceRegion` with the [region](regions.md) associated with your subscription. For example, if you're using the free trial, the region is `westus`.

1. Save the changes to the project.

## Build and run the app

1. From the menu bar, select **Build** > **Build Solution**. The code should compile without errors now.

    ![Screenshot of Visual Studio application, with Build Solution option highlighted](media/sdk/qs-csharp-dotnet-windows-08-build.png "Successful build")

1. From the menu bar, select **Debug** > **Start Debugging**, or press **F5** to start the application.

    ![Screenshot of Visual Studio application, with Start Debugging option highlighted](media/sdk/qs-csharp-dotnet-windows-09-start-debugging.png "Start the app into debugging")

1. A console window will appear, prompting you to speak. Now, say something in English. Your speech is transmitted to the Speech Service and transcribed to text in real time. The result is printed to the console.

    ![Screenshot of console output after successful recognition](media/sdk/qs-csharp-dotnet-windows-10-console-output.png "Console output after successful recognition")

[!INCLUDE [Download this sample](../../../includes/cognitive-services-speech-service-speech-sdk-sample-download-h2.md)]
The code is available in the `quickstart/csharp-dotnet-windows` folder.

## Next steps

> [!div class="nextstepaction"]
> [Recognize intents from speech by using the Speech SDK for C#](how-to-recognize-intents-from-speech-csharp.md)

## See also

- [Translate speech](how-to-translate-speech-csharp.md)
- [Customize acoustic models](how-to-customize-acoustic-models.md)
- [Customize language models](how-to-customize-language-model.md)
