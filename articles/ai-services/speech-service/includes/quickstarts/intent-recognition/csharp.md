---
author: eric-urban
ms.service: cognitive-services
ms.subservice: speech-service
ms.date: 02/04/2022
ms.topic: include
ms.author: eur
---

[!INCLUDE [Header](../../common/csharp.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites-luis.md)]

## Create a LUIS app for intent recognition

[!INCLUDE [Create a LUIS app for intent recognition](luis-sign-up.md)]

## Open your project in Visual Studio

Next, open your project in Visual Studio.

1. Launch Visual Studio 2019.
2. Load your project and open `Program.cs`.

## Start with some boilerplate code

Let's add some code that works as a skeleton for our project. Make note that you've created an async method called `RecognizeIntentAsync()`.

:::code language="csharp" source="~/samples-cognitive-services-speech-sdk/quickstart/csharp/dotnet/intent-recognition/helloworld/Program.cs" id="skeleton_1":::
:::code language="csharp" source="~/samples-cognitive-services-speech-sdk/quickstart/csharp/dotnet/intent-recognition/helloworld/Program.cs" id="skeleton_2":::

## Create a Speech configuration

Before you can initialize an `IntentRecognizer` object, you need to create a configuration that uses the key and location for your LUIS prediction resource.

> [!IMPORTANT]
> Your starter key and authoring keys will not work. You must use your prediction key and location that you created earlier. For more information, see [Create a LUIS app for intent recognition](#create-a-luis-app-for-intent-recognition).

Insert this code in the `RecognizeIntentAsync()` method. Make sure you update these values:

* Replace `"YourLanguageUnderstandingSubscriptionKey"` with your LUIS prediction key.
* Replace `"YourLanguageUnderstandingServiceRegion"` with your LUIS location. Use **Region identifier** from [region](../../../regions.md).

>[!TIP]
> If you need help finding these values, see [Create a LUIS app for intent recognition](#create-a-luis-app-for-intent-recognition).

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../use-key-vault.md). See the Azure AI services [security](../../../../security-features.md) article for more information.

:::code language="csharp" source="~/samples-cognitive-services-speech-sdk/quickstart/csharp/dotnet/intent-recognition/helloworld/Program.cs" id="create_speech_configuration":::

This sample uses the `FromSubscription()` method to build the `SpeechConfig`. For a full list of available methods, see [SpeechConfig Class](/dotnet/api/microsoft.cognitiveservices.speech.speechconfig).

The Speech SDK will default to recognizing using en-us for the language, see [How to recognize speech](../../../how-to-recognize-speech.md) for information on choosing the source language.

## Initialize an IntentRecognizer

Now, let's create an `IntentRecognizer`. This object is created inside of a using statement to ensure the proper release of unmanaged  resources. Insert this code in the `RecognizeIntentAsync()` method, right below your Speech configuration.

:::code language="csharp" source="~/samples-cognitive-services-speech-sdk/quickstart/csharp/dotnet/intent-recognition/helloworld/Program.cs" id="create_intent_recognizer_1":::
:::code language="csharp" source="~/samples-cognitive-services-speech-sdk/quickstart/csharp/dotnet/intent-recognition/helloworld/Program.cs" id="create_intent_recognizer_2":::

## Add a LanguageUnderstandingModel and intents

You need to associate a `LanguageUnderstandingModel` with the intent recognizer, and add the intents that you want recognized. We're going to use intents from the prebuilt domain for home automation. Insert this code in the using statement from the previous section. Make sure that you replace `"YourLanguageUnderstandingAppId"` with your LUIS app ID.

>[!TIP]
> If you need help finding this value, see [Create a LUIS app for intent recognition](#create-a-luis-app-for-intent-recognition).

:::code language="csharp" source="~/samples-cognitive-services-speech-sdk/quickstart/csharp/dotnet/intent-recognition/helloworld/Program.cs" id="add_intents":::

This example uses the `AddIntent()` function to individually add intents. If you want to add all intents from a model, use `AddAllIntents(model)` and pass the model. 

## Recognize an intent

From the `IntentRecognizer` object, you're going to call the `RecognizeOnceAsync()` method. This method lets the Speech service know that you're sending a single phrase for recognition, and that once the phrase is identified to stop recognizing speech.

Inside the using statement, add this code below your model.

:::code language="csharp" source="~/samples-cognitive-services-speech-sdk/quickstart/csharp/dotnet/intent-recognition/helloworld/Program.cs" id="recognize_intent":::

## Display recognition results (or errors)

When the recognition result is returned by the Speech service, you'll want to do something with it. We're going to keep it simple and print the results to console.

Inside the using statement, below `RecognizeOnceAsync()`, add this code:

:::code language="csharp" source="~/samples-cognitive-services-speech-sdk/quickstart/csharp/dotnet/intent-recognition/helloworld/Program.cs" id="print_results":::

## Check your code

At this point, your code should look like this:

> [!NOTE]
> We've added some comments to this version.

:::code language="csharp" source="~/samples-cognitive-services-speech-sdk/quickstart/csharp/dotnet/intent-recognition/helloworld/Program.cs":::

## Build and run your app

Now you're ready to build your app and test our speech recognition using the Speech service.

1. **Compile the code** - From the menu bar of Visual Studio, choose **Build** > **Build Solution**.
2. **Start your app** - From the menu bar, choose **Debug** > **Start Debugging** or press <kbd>F5</kbd>.
3. **Start recognition** - It'll prompt you to speak a phrase in English. Your speech is sent to the Speech service, transcribed as text, and rendered in the console.
