---
title: How to recognize intents from speech using the Speech SDK C#
titleSuffix: Azure Cognitive Services
description: In this guide, you learn how to recognize intents from speech using the Speech SDK for C#.
services: cognitive-services
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 02/10/2020
ms.author: trbye
---

# How to recognize intents from speech using the Speech SDK for C#

The Cognitive Services [Speech SDK](speech-sdk.md) integrates with the [Language Understanding service (LUIS)](https://www.luis.ai/home) to provide **intent recognition**. An intent is something the user wants to do: book a flight, check the weather, or make a call. The user can use whatever terms feel natural. Using machine learning, LUIS maps user requests to the intents you've defined.

> [!NOTE]
> A LUIS application defines the intents and entities you want to recognize. It's separate from the C# application that uses the Speech service. In this article, "app" means the LUIS app, while "application" means the C# code.

In this guide, you use the Speech SDK to develop a C# console application that derives intents from user utterances through your device's microphone. You'll learn how to:

> [!div class="checklist"]
>
> - Create a Visual Studio project referencing the Speech SDK NuGet package
> - Create a speech configuration and get an intent recognizer
> - Get the model for your LUIS app and add the intents you need
> - Specify the language for speech recognition
> - Recognize speech from a file
> - Use asynchronous, event-driven continuous recognition

## Prerequisites

Be sure you have the following items before you begin this guide:

- A LUIS account. You can get one for free through the [LUIS portal](https://www.luis.ai/home).
- [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/) (any edition).

## LUIS and speech

LUIS integrates with the Speech service to recognize intents from speech. You don't need a Speech service subscription, just LUIS.

LUIS uses three kinds of keys:

| Key type  | Purpose                                               |
| --------- | ----------------------------------------------------- |
| Authoring | Lets you create and modify LUIS apps programmatically |
| Starter   | Lets you test your LUIS application using text only   |
| Endpoint  | Authorizes access to a particular LUIS app            |

For this guide, you need the endpoint key type. This guide uses the example Home Automation LUIS app, which you can create by following the [Use prebuilt Home automation app](https://docs.microsoft.com/azure/cognitive-services/luis/luis-get-started-create-app) quickstart. If you've created a LUIS app of your own, you can use it instead.

When you create a LUIS app, LUIS automatically generates a starter key so you can test the app using text queries. This key doesn't enable the Speech service integration and won't work with this guide. Create a LUIS resource in the Azure dashboard and assign it to the LUIS app. You can use the free subscription tier for this guide.

After you create the LUIS resource in the Azure dashboard, log into the [LUIS portal](https://www.luis.ai/home), choose your application on the **My Apps** page, then switch to the app's **Manage** page. Finally, select **Keys and Endpoints** in the sidebar.

![LUIS portal keys and endpoint settings](media/sdk/luis-keys-endpoints-page.png)

On the **Keys and Endpoint settings** page:

1. Scroll down to the **Resources and Keys** section and select **Assign resource**.
1. In the **Assign a key to your app** dialog box, make the following changes:

   - Under **Tenant**, choose **Microsoft**.
   - Under **Subscription Name**, choose the Azure subscription that contains the LUIS resource you want to use.
   - Under **Key**, choose the LUIS resource that you want to use with the app.

   In a moment, the new subscription appears in the table at the bottom of the page.

1. Select the icon next to a key to copy it to the clipboard. (You may use either key.)

![LUIS app subscription keys](media/sdk/luis-keys-assigned.png)

## Create a speech project in Visual Studio

[!INCLUDE [Create project](../../../includes/cognitive-services-speech-service-create-speech-project-vs-csharp.md)]

## Add the code

Next, you add code to the project.

1. From **Solution Explorer**, open the file **Program.cs**.

1. Replace the block of `using` statements at the beginning of the file with the following declarations:

   [!code-csharp[Top-level declarations](~/samples-cognitive-services-speech-sdk/samples/csharp/sharedcontent/console/intent_recognition_samples.cs#toplevel)]

1. Replace the provided `Main()` method, with the following asynchronous equivalent:

   ```csharp
   public static async Task Main()
   {
       await RecognizeIntentAsync();
       Console.WriteLine("Please press Enter to continue.");
       Console.ReadLine();
   }
   ```

1. Create an empty asynchronous method `RecognizeIntentAsync()`, as shown here:

   ```csharp
   static async Task RecognizeIntentAsync()
   {
   }
   ```

1. In the body of this new method, add this code:

   [!code-csharp[Intent recognition by using a microphone](~/samples-cognitive-services-speech-sdk/samples/csharp/sharedcontent/console/intent_recognition_samples.cs#intentRecognitionWithMicrophone)]

1. Replace the placeholders in this method with your LUIS subscription key, region, and app ID as follows.

   | Placeholder | Replace with |
   | ----------- | ------------ |
   | `YourLanguageUnderstandingSubscriptionKey` | Your LUIS endpoint key. Again, you must get this item from your Azure dashboard, not a "starter key." You can find it on your app's **Keys and Endpoints** page (under **Manage**) in the [LUIS portal](https://www.luis.ai/home). |
   | `YourLanguageUnderstandingServiceRegion` | The short identifier for the region your LUIS subscription is in, such as `westus` for West US. See [Regions](regions.md). |
   | `YourLanguageUnderstandingAppId` | The LUIS app ID. You can find it on your app's **Settings** page in the [LUIS portal](https://www.luis.ai/home). |

With these changes made, you can build (**Control+Shift+B**) and run (**F5**) the application. When you're prompted, try saying "Turn off the lights" into your PC's microphone. The application displays the result in the console window.

The following sections include a discussion of the code.

## Create an intent recognizer

First, you need to create a speech configuration from your LUIS endpoint key and region. You can use speech configurations to create recognizers for the various capabilities of the Speech SDK. The speech configuration has multiple ways to specify the subscription you want to use; here, we use `FromSubscription`, which takes the subscription key and region.

> [!NOTE]
> Use the key and region of your LUIS subscription, not a Speech service subscription.

Next, create an intent recognizer using `new IntentRecognizer(config)`. Since the configuration already knows which subscription to use, you don't need to specify the subscription key and endpoint again when creating the recognizer.

## Import a LUIS model and add intents

Now import the model from the LUIS app using `LanguageUnderstandingModel.FromAppId()` and add the LUIS intents that you wish to recognize via the recognizer's `AddIntent()` method. These two steps improve the accuracy of speech recognition by indicating words that the user is likely to use in their requests. You don't have to add all the app's intents if you don't need to recognize them all in your application.

To add intents, you must provide three arguments: the LUIS model (which has been created and is named `model`), the intent name, and an intent ID. The difference between the ID and the name is as follows.

| `AddIntent()`&nbsp;argument | Purpose |
| --------------------------- | ------- |
| `intentName` | The name of the intent as defined in the LUIS app. This value must match the LUIS intent name exactly. |
| `intentID` | An ID assigned to a recognized intent by the Speech SDK. This value can be whatever you like; it doesn't need to correspond to the intent name as defined in the LUIS app. If multiple intents are handled by the same code, for instance, you could use the same ID for them. |

The Home Automation LUIS app has two intents: one for turning on a device, and another for turning off a device. The lines below add these intents to the recognizer; replace the three `AddIntent` lines in the `RecognizeIntentAsync()` method with this code.

```csharp
recognizer.AddIntent(model, "HomeAutomation.TurnOff", "off");
recognizer.AddIntent(model, "HomeAutomation.TurnOn", "on");
```

Instead of adding individual intents, you can also use the `AddAllIntents` method to add all the intents in a model to the recognizer.

## Start recognition

With the recognizer created and the intents added, recognition can begin. The Speech SDK supports both single-shot and continuous recognition.

| Recognition mode | Methods to call | Result |
| ---------------- | --------------- | ------ |
| Single-shot | `RecognizeOnceAsync()` | Returns the recognized intent, if any, after one utterance. |
| Continuous | `StartContinuousRecognitionAsync()`<br>`StopContinuousRecognitionAsync()` | Recognizes multiple utterances; emits events (for example, `IntermediateResultReceived`) when results are available. |

The application uses single-shot mode and so calls `RecognizeOnceAsync()` to begin recognition. The result is an `IntentRecognitionResult` object containing information about the intent recognized. You extract the LUIS JSON response by using the following expression:

```csharp
result.Properties.GetProperty(PropertyId.LanguageUnderstandingServiceResponse_JsonResult)
```

The application doesn't parse the JSON result. It only displays the JSON text in the console window.

![Single LUIS recognition results](media/sdk/luis-results.png)

## Specify recognition language

By default, LUIS recognizes intents in US English (`en-us`). By assigning a locale code to the `SpeechRecognitionLanguage` property of the speech configuration, you can recognize intents in other languages. For example, add `config.SpeechRecognitionLanguage = "de-de";` in our application before creating the recognizer to recognize intents in German. For more information, see [LUIS language support](../LUIS/luis-language-support.md#languages-supported).

## Continuous recognition from a file

The following code illustrates two additional capabilities of intent recognition using the Speech SDK. The first, previously mentioned, is continuous recognition, where the recognizer emits events when results are available. These events can then be processed by event handlers that you provide. With continuous recognition, you call the recognizer's `StartContinuousRecognitionAsync()` method to start recognition instead of `RecognizeOnceAsync()`.

The other capability is reading the audio containing the speech to be processed from a WAV file. Implementation involves creating an audio configuration that can be used when creating the intent recognizer. The file must be single-channel (mono) with a sampling rate of 16 kHz.

To try out these features, delete or comment out the body of the `RecognizeIntentAsync()` method, and add the following code in its place.

[!code-csharp[Intent recognition by using events from a file](~/samples-cognitive-services-speech-sdk/samples/csharp/sharedcontent/console/intent_recognition_samples.cs#intentContinuousRecognitionWithFile)]

Revise the code to include your LUIS endpoint key, region, and app ID and to add the Home Automation intents, as before. Change `whatstheweatherlike.wav` to the name of your recorded audio file. Then build, copy the audio file to the build directory, and run the application.

For example, if you say "Turn off the lights", pause, and then say "Turn on the lights" in your recorded audio file, console output similar to the following may appear:

![Audio file LUIS recognition results](media/sdk/luis-results-2.png)

[!INCLUDE [Download the sample](../../../includes/cognitive-services-speech-service-speech-sdk-sample-download-h2.md)]
Look for the code from this article in the **samples/csharp/sharedcontent/console** folder.

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Recognize speech from a microphone](~/articles/cognitive-services/Speech-Service/quickstarts/speech-to-text-from-microphone.md?pivots=programming-language-csharp&tabs=dotnetcore)
