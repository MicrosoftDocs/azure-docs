---
title: 'Quickstart: Translate speech, C++ (Windows) - Speech Services'
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll create a simple C++ application to capture user speech, translate it to another language, and output the text to the command line. This guide is designed for Windows users.
services: cognitive-services
author: wolfma61
manager: cgronlun
ms.service: cognitive-services
ms.component: speech-service
ms.topic: quickstart
ms.date: 12/13/2018
ms.author: erhopf
---

# Quickstart: Translate speech with the Speech SDK for C++

In this quickstart, you'll create a simple C++ application that captures user speech from your computer's microphone, translates the speech, and transcribes the translated text to the command line in real time. This application is designed to run on 64-bit Windows, and is built with the [Speech SDK NuGet package](https://aka.ms/csspeech/nuget) and Microsoft Visual Studio 2017.

For a complete list of languages available for speech translation, see [language support](language-support.md).

## Prerequisites

This quickstart requires:

* [Visual Studio 2017](https://visualstudio.microsoft.com/downloads/)
* An Azure subscription key for the Speech Service. [Get one for free](get-started.md).

## Create a Visual Studio project

[!INCLUDE [](../../../includes/cognitive-services-speech-service-quickstart-cpp-create-proj.md)]

## Add sample code

1. Open the source file *helloworld.cpp*. Replace all the code below the initial include statement (`#include "stdafx.h"` or `#include "pch.h"`) with the following:

    ```cpp
    #include "pch.h"
    #include <iostream>
    #include <vector>
    #include <speechapi_cxx.h>

    using namespace std;
    using namespace Microsoft::CognitiveServices::Speech;
    using namespace Microsoft::CognitiveServices::Speech::Translation;

    // Translation with microphone input.
    void TranslationWithMicrophone()
    {
    	// Creates an instance of a speech translation config with specified subscription key and service region.
    	// Replace with your own subscription key and service region (e.g., "westus").
    	auto config = SpeechTranslationConfig::FromSubscription("YourSubscriptionKey", "YourServiceRegion");

    	// Sets source and target languages
    	// Replace with the languages of your choice.
    	auto fromLanguage = "en-US";
    	config->SetSpeechRecognitionLanguage(fromLanguage);
    	config->AddTargetLanguage("de");
    	config->AddTargetLanguage("fr");

    	// Creates a translation recognizer using microphone as audio input.
    	auto recognizer = TranslationRecognizer::FromConfig(config);
    	cout << "Say something...\n";

    	// Starts translation. RecognizeOnceAsync() returns when the first utterance has been recognized,
    	// so it is suitable only for single shot recognition like command or query. For long-running
    	// recognition, use StartContinuousRecognitionAsync() instead.
    	auto result = recognizer->RecognizeOnceAsync().get();

    	// Checks result.
    	if (result->Reason == ResultReason::TranslatedSpeech)
    	{
    		cout << "RECOGNIZED: Text=" << result->Text << std::endl
    			<< "  Language=" << fromLanguage << std::endl;

    		for (const auto& it : result->Translations)
    		{
    			cout << "TRANSLATED into '" << it.first.c_str() << "': " << it.second.c_str() << std::endl;
    		}
    	}
    	else if (result->Reason == ResultReason::RecognizedSpeech)
    	{
    		cout << "RECOGNIZED: Text=" << result->Text << " (text could not be translated)" << std::endl;
    	}
    	else if (result->Reason == ResultReason::NoMatch)
    	{
    		cout << "NOMATCH: Speech could not be recognized." << std::endl;
    	}
    	else if (result->Reason == ResultReason::Canceled)
    	{
    		auto cancellation = CancellationDetails::FromResult(result);
    		cout << "CANCELED: Reason=" << (int)cancellation->Reason << std::endl;

    		if (cancellation->Reason == CancellationReason::Error)
    		{
    			cout << "CANCELED: ErrorCode=" << (int)cancellation->ErrorCode << std::endl;
    			cout << "CANCELED: ErrorDetails=" << cancellation->ErrorDetails << std::endl;
    			cout << "CANCELED: Did you update the subscription info?" << std::endl;
    		}
    	}
    }

    int wmain()
    {
    	TranslationWithMicrophone();
    	cout << "Please press a key to continue.\n";
    	cin.get();
    	return 0;
    }
    ```

1. In the same file, replace the string `YourSubscriptionKey` with your subscription key.

1. Replace the string `YourServiceRegion` with the [region](regions.md) associated with your subscription (for example, `westus` for the free trial subscription).

1. Save changes to the project.

## Build and run the app

1. Build the application. From the menu bar, choose **Build** > **Build Solution**. The code should compile without errors.

   ![Screenshot of Visual Studio application, with Build Solution option highlighted](media/sdk/qs-cpp-windows-06-build.png)

1. Start the application. From the menu bar, choose **Debug** > **Start Debugging**, or press **F5**.

   ![Screenshot of Visual Studio application, with Start Debugging option highlighted](media/sdk/qs-cpp-windows-07-start-debugging.png)

1. A console window appears, prompting you to say something. Speak an English phrase or sentence. Your speech is transmitted to the Speech service, translated and transcribed to text, which appears in the same window.

   ![Screenshot of console output after successful translation](media/sdk/qs-translate-cpp-windows-output.png)

## Next steps

Additional samples, such as how to read speech from an audio file, and output translated text as synthesized speech, are available on GitHub.

> [!div class="nextstepaction"]
> [Explore C++ samples on GitHub](https://aka.ms/csspeech/samples)

## See also

- [Customize acoustic models](how-to-customize-acoustic-models.md)
- [Customize language models](how-to-customize-language-model.md)
