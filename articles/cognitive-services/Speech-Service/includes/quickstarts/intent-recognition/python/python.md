---
author: trevorbye
ms.service: cognitive-services
ms.subservice: speech-service
ms.date: 04/04/2020
ms.topic: include
ms.author: trbye
zone_pivot_groups: programming-languages-set-two
---

## Prerequisites

Before you get started:

* <a href="~/articles/cognitive-services/Speech-Service/quickstarts/setup-platform.md?pivots=programming-language-python" target="_blank">Install the Speech SDK for your development environment and create an empty sample project<span class="docon docon-navigate-external x-hidden-focus"></span></a>.

## Create a LUIS app for intent recognition

[!INCLUDE [Create a LUIS app for intent recognition](../luis-sign-up.md)]

## Open your project

1. Open your preferred IDE.
2. Create a new project and create file called `quickstart.py`, then open it.

## Start with some boilerplate code

Let's add some code that works as a skeleton for our project.

[!code-python[](~/samples-cognitive-services-speech-sdk/quickstart/python/intent-recognition/quickstart.py?range=5-7)]

## Create a Speech configuration

Before you can initialize an `IntentRecognizer` object, you need to create a configuration that uses the key and location for your LUIS prediction resource.

Insert this code in `quickstart.py`. Make sure you update these values:

* Replace `"YourLanguageUnderstandingSubscriptionKey"` with your LUIS prediction key.
* Replace `"YourLanguageUnderstandingServiceRegion"` with your LUIS location. Use **Region identifier** from [region](https://aka.ms/speech/sdkregion)

>[!TIP]
> If you need help finding these values, see [Create a LUIS app for intent recognition](#create-a-luis-app-for-intent-recognition).

[!code-python[](~/samples-cognitive-services-speech-sdk/quickstart/python/intent-recognition/quickstart.py?range=12)]

This sample constructs the `SpeechConfig` object using LUIS key and region. For a full list of available methods, see [SpeechConfig Class](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig).

The Speech SDK will default to recognizing using en-us for the language, see [Specify source language for speech to text](../../../../how-to-specify-source-language.md) for information on choosing the source language.

## Initialize an IntentRecognizer

Now, let's create an `IntentRecognizer`. Insert this code right below your Speech configuration.

[!code-python[](~/samples-cognitive-services-speech-sdk/quickstart/python/intent-recognition/quickstart.py?range=15)]

## Add a LanguageUnderstandingModel and Intents

You need to associate a `LanguageUnderstandingModel` with the intent recognizer and add the intents you want recognized. We're going to use intents from the prebuilt domain for home automation.

Insert this code below your `IntentRecognizer`. Make sure that you replace `"YourLanguageUnderstandingAppId"` with your LUIS app ID. 

>[!TIP]
> If you need help finding this value, see [Create a LUIS app for intent recognition](#create-a-luis-app-for-intent-recognition).

[!code-python[](~/samples-cognitive-services-speech-sdk/quickstart/python/intent-recognition/quickstart.py?range=19-27)]

## Recognize an intent

From the `IntentRecognizer` object, you're going to call the `recognize_once()` method. This method lets the Speech service know that you're sending a single phrase for recognition, and that once the phrase is identified to stop recognizing speech.

Insert this code below your model.

[!code-python[](~/samples-cognitive-services-speech-sdk/quickstart/python/intent-recognition/quickstart.py?range=35)]

## Display the recognition results (or errors)

When the recognition result is returned by the Speech service, you'll want to do something with it. We're going to keep it simple and print the result to console.

Below your call to `recognize_once()`, add this code.

[!code-python[](~/samples-cognitive-services-speech-sdk/quickstart/python/intent-recognition/quickstart.py?range=38-47)]

## Check your code

At this point, your code should look like this.

> [!NOTE]
> We've added some comments to this version.

[!code-python[](~/samples-cognitive-services-speech-sdk/quickstart/python/intent-recognition/quickstart.py?range=5-47)]

## Build and run your app

Run the sample from the console or in your IDE:

```
python quickstart.py
```

The next 15 seconds of speech input from your microphone will be recognized and logged in the console window.

## Next steps

[!INCLUDE [footer](./footer.md)]
