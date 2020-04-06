---
author: IEvangelist
ms.service: cognitive-services
ms.topic: include
ms.date: 04/06/2020
ms.author: dapine
---

## Prerequisites

This article assumes that you have an Azure account and Speech service subscription. If you don't have an account and subscription, [try the Speech service for free](../../../get-started.md).

## Install the Speech SDK

Before you can do anything, you'll need to install the Speech SDK. Depending on your platform, follow the instructions under the <a href="https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/speech-sdk#get-the-speech-sdk" target="_blank">Get the Speech SDK <span class="docon docon-navigate-external x-hidden-focus"></span></a> section of the Speech SDK article.

## Import dependencies

To run the examples in this article, include the following `using` statements at the top of your script.

```csharp
using System;
using System.Text;
using System.Threading.Tasks;
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;
using Microsoft.CognitiveServices.Speech.Translation;
```

## Create a speech translation configuration

To call the Speech service using the Speech SDK, you need to create a [`SpeechTranslationConfig`](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.speechtranslationconfig?view=azure-dotnet). This class includes information about your subscription, like your key and associated region, endpoint, host, or authorization token.

> [!NOTE]
> Regardless of whether you're performing speech recognition, speech synthesis, translation, or intent recognition, you'll always create a configuration.

There are a few ways that you can initialize a [`SpeechTranslationConfig`](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.speechtranslationconfig?view=azure-dotnet):

* With a subscription: pass in a key and the associated region.
* With an endpoint: pass in a Speech service endpoint. A key or authorization token is optional.
* With a host: pass in a host address. A key or authorization token is optional.
* With an authorization token: pass in an authorization token and the associated region.

Let's take a look at how a [`SpeechTranslationConfig`](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.speechtranslationconfig?view=azure-dotnet) is created using a key and region. See the [region support](https://docs.microsoft.com/azure/cognitive-services/speech-service/regions#speech-sdk) page to find your region identifier.

```csharp
public class Program
{
    static async Task Main()
    {
        await TranslateSpeechAsync();

        Console.WriteLine("Press any key to continue...");
        Console.ReadLine();
    }

    static async Task TranslateSpeechAsync()
    {
        var translationConfig =
            SpeechTranslationConfig.FromSubscription("YourSubscriptionKey", "YourServiceRegion");
    }
}
```

To set the speech recognition language and target translation language, use the speech translation configuration instance. As an example of how to specify a speech translation from english to italian, consider the following:

```csharp
static async Task TranslateSpeechAsync()
{
    var translationConfig =
        SpeechTranslationConfig.FromSubscription("YourSubscriptionKey", "YourServiceRegion");

    // Recognize speech from this language
    translationConfig.SpeechRecognitionLanguage = "en-US";
    
    // Translate it to this language. See, https://aka.ms/speech/sttt-languages
    translationConfig.AddTargetLanguage("it");
}
```

## Initialize a recognizer

After you've created a [`SpeechTranslationConfig`](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.speechtranslationconfig?view=azure-dotnet), the next step is to initialize a [`TranslationRecognizer`](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.translation.translationrecognizer?view=azure-dotnet). When you initialize a [`TranslationRecognizer`](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.translation.translationrecognizer?view=azure-dotnet), you'll need to pass it your `translationConfig`. This provides the credentials that the speech service requires to validate your request.

If you're recognizing speech using your device's default microphone, here's what the [`TranslationRecognizer`](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.translation.translationrecognizer?view=azure-dotnet) should look like:

```csharp
static async Task TranslateSpeechAsync()
{
    var translationConfig =
        SpeechTranslationConfig.FromSubscription("YourSubscriptionKey", "YourServiceRegion");
    translationConfig.SpeechRecognitionLanguage = "en-US";
    translationConfig.AddTargetLanguage("it");

    using var recognizer = new TranslationRecognizer(translationConfig);
}
```

If you want to specify the audio input device, then you'll need to create an [`AudioConfig`](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.audio.audioconfig?view=azure-dotnet) and provide the `audioConfig` parameter when initializing your [`TranslationRecognizer`](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.translation.translationrecognizer?view=azure-dotnet).

> [!TIP]
> [Learn how to get the device ID for your audio input device](../../../how-to-select-audio-input-devices.md).

First, you'll reference the `AudioConfig` object as follows:

```csharp
static async Task TranslateSpeechAsync()
{
    var translationConfig =
        SpeechTranslationConfig.FromSubscription("YourSubscriptionKey", "YourServiceRegion");
    translationConfig.SpeechRecognitionLanguage = "en-US";
    translationConfig.AddTargetLanguage("it");

    using var audioConfig = AudioConfig.FromDefaultMicrophoneInput();
    using var recognizer = new TranslationRecognizer(translationConfig, audioConfig);
}
```

If you want to provide an audio file instead of using a microphone, you'll still need to provide an `audioConfig`. However, when you create an [`AudioConfig`](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.audio.audioconfig?view=azure-dotnet), instead of calling `FromDefaultMicrophoneInput`, you'll call `FromWavFileOutput` and pass the `filename` parameter.


```csharp
static async Task TranslateSpeechAsync()
{
    var translationConfig =
        SpeechTranslationConfig.FromSubscription("YourSubscriptionKey", "YourServiceRegion");
    translationConfig.SpeechRecognitionLanguage = "en-US";
    translationConfig.AddTargetLanguage("it");

    using var audioConfig = AudioConfig.FromWavFileInput("YourAudioFile.wav");
    using var recognizer = new TranslationRecognizer(translationConfig, audioConfig);
}
```

## Translate speech

To translate speech, the Speech SDK relies on either microphone input or an audio file stream. Regardless, speech must first be recognized before it can be translated.

### Translate to multiple languages



### Dictation mode

When using continuous recognition, you can enable dictation processing by using the corresponding "enable dictation" function. This mode will cause the speech config instance to interpret word descriptions of sentence structures such as punctuation. For example, the utterance "Do you live in town question mark" would be interpreted as the text "Do you live in town?".

To enable dictation mode, use the [`EnableDictation`](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.speechconfig.enabledictation?view=azure-dotnet) method on your [`SpeechTranslationConfig`](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.speechtranslationconfig?view=azure-dotnet).

```csharp
translationConfig.EnableDictation();
```

## Change source language

A common task for speech recognition is specifying the input (or source) language. Let's take a look at how you would change the input language to Italian. In your code, find your [`SpeechTranslationConfig`](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.speechtranslationconfig?view=azure-dotnet), then add this line directly below it.

```csharp
translationConfig.SpeechRecognitionLanguage = "it-IT";
```

The [`SpeechRecognitionLanguage`](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.speechconfig.speechrecognitionlanguage?view=azure-dotnet) property expects a language-locale format string. You can provide any value in the **Locale** column in the list of supported [locales/languages](../../../language-support.md).

