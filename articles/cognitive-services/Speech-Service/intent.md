---
title: Sample for Intent Recognition | Microsoft Docs
titleSuffix: "Microsoft Cognitive Services"
description: Here is a sample for intent recognition.
services: cognitive-services
author: wolfma61
manager: onano

ms.service: cognitive-services
ms.technology: Speech
ms.topic: article
ms.date: 05/07/2018
ms.author: wolfma
---

# Sample for Intent Recognition

> [!NOTE]
> For instructions to download this sample and others, see [Samples for Speech SDK](samples.md).

> [!NOTE]
> For all samples below, we assume the following top-level declarations are in place:
>
> ```csharp
> using System;
> using System.Threading.Tasks;
> using Microsoft.CognitiveServices.Speech;
> using Microsoft.CognitiveServices.Speech.Intent;
> ```
>
> ```cpp
> #include <speechapi_cxx.h>
>
> using namespace std;
> using namespace Microsoft::CognitiveServices::Speech;
> using namespace Microsoft::CognitiveServices::Speech::Intent;
> ```
>
> - - -

Intent Recognition Using Microphone

```csharp
// Create a speech factory associated with your speech subscription
var speechSubscriptionKey = "YourSpeechSubscriptionKey";
var factory = RecognizerFactory.Instance;
factory.SubscriptionKey = speechSubscriptionKey;

// Create an intent recognizer using microphone as audio input.
using (var recognizer = factory.CreateIntentRecognizer())
{
    var intentName1 = "IntentNameFromLuisPortal";
    var intentName2 = "IntentNameFromLuisPortal";

    var luisSubscriptionKey = "YourLuisSubscriptionKey";
    var luisEndpoint = "YourLuisEndpoint";
    var luisAppId = "YourLuisAppId";

    // Create a LanguageUnderstandingModel to use with the intent recognizer
    var model = LanguageUnderstandingModel.From(luisEndpoint, luisSubscriptionKey, luisAppId);

    // Add intents from your LU model to your intent recognizer
    recognizer.AddIntent("1", model, intentName1);
    recognizer.AddIntent("some other ID", model, intentName2);

    // Prompt the user to speak
    Console.WriteLine("Say something...");

    // Start recognition; will return the first result recognized
    var result = await recognizer.RecognizeAsync().ConfigureAwait(false);

    // Check the reason returned
    if (result.Reason == RecognitionStatus.Success)
    {
        Console.WriteLine($"We recognized: {result.RecognizedText}");
    }
    else if (result.Reason == RecognitionStatus.NoMatch)
    {
        Console.WriteLine("We didn't hear you say anything...");
    }
    else if (result.Reason == RecognitionStatus.Canceled)
    {
        Console.WriteLine($"There was an error; reason {result.Reason}-{result.RecognizedText}");
    }
}
```

```cpp
// Creates an instance of a speech factory with specified
// subscription key. Replace with your own subscription key.
auto factory = SpeechFactory::FromSubscription(L"YourSubscriptionKey", L"");

// Create an intent recognizer using microphone as audio input.
auto recognizer = factory->CreateIntentRecognizer();

// Create a LanguageUnderstandingModel associated with your LU application
auto luisSubscriptionKey = L"YourLuisSubscriptionKey";
auto luisEndpoint = L"YourLuisEndpoint";
auto luisAppId = L"YourLuisAppId";
auto model = LanguageUnderstandingModel::From(luisEndpoint, luisSubscriptionKey, luisAppId);

// Add each intent you wish to recognize to the intent recognizer
auto intentName1 = L"IntentNameFromLuisPortal";
auto intentName2 = L"IntentNameFromLuisPortal";

recognizer->AddIntent(L"1", IntentTrigger::From(model, intentName1));
recognizer->AddIntent(L"some other ID", IntentTrigger::From(model, intentName2));

// Prompt the user to speak
wcout << L"Say something...\n";

// Start recognition; will return the first result recognized
auto result = recognizer->RecognizeAsync().get();

// Check the reason returned
if (result->Reason == Reason::Recognized)
{
    wcout << L"We recognized: " << result->Text << '\n';
    wcout << L"IntentId=" << result->IntentId << '\n';
    wcout << L"json=" << result->Properties[ResultProperty::LanguageUnderstandingJson].GetString();
}
else if (result->Reason == Reason::NoMatch)
{
    wcout << L"We didn't hear anything" << '\n';
}
else if (result->Reason == Reason::Canceled)
{
    wcout << L"There was an error, reason " << int(result->Reason) << L"-" << result->ErrorDetails << '\n';
}
```

- - -
