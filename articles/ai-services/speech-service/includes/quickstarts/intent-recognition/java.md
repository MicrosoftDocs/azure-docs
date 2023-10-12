---
author: eric-urban
ms.service: azure-ai-speech
ms.date: 02/04/2022
ms.topic: include
ms.author: eur
---

[!INCLUDE [Header](../../common/java.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites-luis.md)]

You also need to <a href="~/articles/ai-services/speech-service/quickstarts/setup-platform.md?tabs=jre&pivots=programming-language-java" target="_blank">install the Speech SDK for your development environment and create an empty sample project</a>.

## Create a LUIS app for intent recognition

[!INCLUDE [Create a LUIS app for intent recognition](luis-sign-up.md)]

## Open your project

1. Open your preferred IDE.
2. Load your project and open `Main.java`.

## Start with some boilerplate code

Let's add some code that works as a skeleton for our project.

:::code language="java" source="~/samples-cognitive-services-speech-sdk/quickstart/java/jre/intent-recognition/src/speechsdk/quickstart/Main.java" id="skeleton_1":::
:::code language="java" source="~/samples-cognitive-services-speech-sdk/quickstart/java/jre/intent-recognition/src/speechsdk/quickstart/Main.java" id="skeleton_2":::

## Create a Speech configuration

Before you can initialize an `IntentRecognizer` object, you need to create a configuration that uses the key and location for your LUIS prediction resource.  

Insert this code in the try / catch block in `main()`. Make sure you update these values:

* Replace `"YourLanguageUnderstandingSubscriptionKey"` with your LUIS prediction key.
* Replace `"YourLanguageUnderstandingServiceRegion"` with your LUIS location. Use **Region identifier** from [region](../../../regions.md)

>[!TIP]
> If you need help finding these values, see [Create a LUIS app for intent recognition](#create-a-luis-app-for-intent-recognition).

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../use-key-vault.md). See the Azure AI services [security](../../../../security-features.md) article for more information.

:::code language="java" source="~/samples-cognitive-services-speech-sdk/quickstart/java/jre/intent-recognition/src/speechsdk/quickstart/Main.java" id="create_speech_configuration":::

This sample uses the `FromSubscription()` method to build the `SpeechConfig`. For a full list of available methods, see [SpeechConfig Class](/dotnet/api/microsoft.cognitiveservices.speech.speechconfig).

The Speech SDK will default to recognizing using en-us for the language, see [How to recognize speech](../../../how-to-recognize-speech.md) for information on choosing the source language.

## Initialize an IntentRecognizer

Now, let's create an `IntentRecognizer`. Insert this code right below your Speech configuration.

:::code language="java" source="~/samples-cognitive-services-speech-sdk/quickstart/java/jre/intent-recognition/src/speechsdk/quickstart/Main.java" id="create_intent_recognizer":::

## Add a LanguageUnderstandingModel and Intents

You need to associate a `LanguageUnderstandingModel` with the intent recognizer, and add the intents you want recognized. We're going to use intents from the prebuilt domain for home automation.

Insert this code below your `IntentRecognizer`. Make sure that you replace `"YourLanguageUnderstandingAppId"` with your LUIS app ID.

>[!TIP]
> If you need help finding this value, see [Create a LUIS app for intent recognition](#create-a-luis-app-for-intent-recognition).

:::code language="java" source="~/samples-cognitive-services-speech-sdk/quickstart/java/jre/intent-recognition/src/speechsdk/quickstart/Main.java" id="add_intents":::

This example uses the `addIntent()` function to individually add intents. If you want to add all intents from a model, use `addAllIntents(model)` and pass the model.

## Recognize an intent

From the `IntentRecognizer` object, you're going to call the `recognizeOnceAsync()` method. This method lets the Speech service know that you're sending a single phrase for recognition, and that once the phrase is identified to stop recognizing speech.

Insert this code below your model:

:::code language="java" source="~/samples-cognitive-services-speech-sdk/quickstart/java/jre/intent-recognition/src/speechsdk/quickstart/Main.java" id="recognize_intent":::

## Display the recognition results (or errors)

When the recognition result is returned by the Speech service, you'll want to do something with it. We're going to keep it simple and print the result to console.

Insert this code below your call to `recognizeOnceAsync()`.

:::code language="java" source="~/samples-cognitive-services-speech-sdk/quickstart/java/jre/intent-recognition/src/speechsdk/quickstart/Main.java" id="print_result":::

## Check your code

At this point, your code should look like this:

> [!NOTE]
> We've added some comments to this version.

:::code language="java" source="~/samples-cognitive-services-speech-sdk/quickstart/java/jre/intent-recognition/src/speechsdk/quickstart/Main.java":::

## Build and run your app

Press <kbd>F11</kbd>, or select **Run** > **Debug**.
The next 15 seconds of speech input from your microphone will be recognized and logged in the console window.
