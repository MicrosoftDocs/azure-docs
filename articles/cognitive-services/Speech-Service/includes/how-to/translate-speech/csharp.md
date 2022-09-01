---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 04/13/2020
ms.author: eur
ms.custom: devx-track-csharp
---

[!INCLUDE [Header](../../common/csharp.md)]

[!INCLUDE [Introduction](intro.md)]

## Sensitive data and environment variables

The example source code in this article depends on environment variables for storing sensitive data, such as the Speech resource's subscription key and region. The `Program` class contains two `static readonly string` values that are assigned from the host machine's environment variables: `SPEECH__SUBSCRIPTION__KEY` and `SPEECH__SERVICE__REGION`. Both of these fields are at the class scope, so they're accessible within method bodies of the class: 

```csharp
public class Program
{
    static readonly string SPEECH__SUBSCRIPTION__KEY =
        Environment.GetEnvironmentVariable(nameof(SPEECH__SUBSCRIPTION__KEY));
    
    static readonly string SPEECH__SERVICE__REGION =
        Environment.GetEnvironmentVariable(nameof(SPEECH__SERVICE__REGION));

    static Task Main() => Task.CompletedTask;
}
```

For more information on environment variables, see [Environment variables and application configuration](../../../../cognitive-services-environment-variables.md).

## Create a speech translation configuration

To call the Speech service by using the Speech SDK, you need to create a [`SpeechTranslationConfig`][config] instance. This class includes information about your subscription, like your key and associated region, endpoint, host, or authorization token.

> [!TIP]
> Regardless of whether you're performing speech recognition, speech synthesis, translation, or intent recognition, you'll always create a configuration.

You can initialize `SpeechTranslationConfig` in a few ways:

* With a subscription: pass in a key and the associated region.
* With an endpoint: pass in a Speech service endpoint. A key or authorization token is optional.
* With a host: pass in a host address. A key or authorization token is optional.
* With an authorization token: pass in an authorization token and the associated region.

Let's look at how you create a `SpeechTranslationConfig` instance by using a key and region. Get the Speech resource key and region in the [Azure portal](https://portal.azure.com).

```csharp
public class Program
{
    static readonly string SPEECH__SUBSCRIPTION__KEY =
        Environment.GetEnvironmentVariable(nameof(SPEECH__SUBSCRIPTION__KEY));
    
    static readonly string SPEECH__SERVICE__REGION =
        Environment.GetEnvironmentVariable(nameof(SPEECH__SERVICE__REGION));

    static Task Main() => TranslateSpeechAsync();

    static async Task TranslateSpeechAsync()
    {
        var translationConfig =
            SpeechTranslationConfig.FromSubscription(SPEECH__SUBSCRIPTION__KEY, SPEECH__SERVICE__REGION);
    }
}
```

## Change the source language

One common task of speech translation is specifying the input (or source) language. The following example shows how you would change the input language to Italian. In your code, interact with the `SpeechTranslationConfig` instance by assigning it to the [`SpeechRecognitionLanguage`][recognitionlang] property:

```csharp
static async Task TranslateSpeechAsync()
{
    var translationConfig =
        SpeechTranslationConfig.FromSubscription(SPEECH__SUBSCRIPTION__KEY, SPEECH__SERVICE__REGION);

    // Source (input) language
    translationConfig.SpeechRecognitionLanguage = "it-IT";
}
```

The `SpeechRecognitionLanguage` property expects a language-locale format string. Refer to the [list of supported speech-to-text locales](../../../language-support.md?tabs=stt-tts).

## Add a translation language

Another common task of speech translation is to specify target translation languages. At least one is required, but multiples are supported. The following code snippet sets both French and German as translation language targets:

```csharp
static async Task TranslateSpeechAsync()
{
    var translationConfig =
        SpeechTranslationConfig.FromSubscription(SPEECH__SUBSCRIPTION__KEY, SPEECH__SERVICE__REGION);

    translationConfig.SpeechRecognitionLanguage = "it-IT";
    
    // Translate to languages. See https://aka.ms/speech/sttt-languages
    translationConfig.AddTargetLanguage("fr");
    translationConfig.AddTargetLanguage("de");
}
```

With every call to [`AddTargetLanguage`][addlang], a new target translation language is specified. In other words, when speech is recognized from the source language, each target translation is available as part of the resulting translation operation.

## Initialize a translation recognizer

After you've created a [`SpeechTranslationConfig`][config] instance, the next step is to initialize [`TranslationRecognizer`][recognizer]. When you initialize `TranslationRecognizer`, you need to pass it your `translationConfig` instance. The configuration object provides the credentials that the Speech service requires to validate your request.

If you're recognizing speech by using your device's default microphone, here's what the `TranslationRecognizer` instance should look like:

```csharp
static async Task TranslateSpeechAsync()
{
    var translationConfig =
        SpeechTranslationConfig.FromSubscription(SPEECH__SUBSCRIPTION__KEY, SPEECH__SERVICE__REGION);

    var fromLanguage = "en-US";
    var toLanguages = new List<string> { "it", "fr", "de" };
    translationConfig.SpeechRecognitionLanguage = fromLanguage;
    toLanguages.ForEach(translationConfig.AddTargetLanguage);

    using var recognizer = new TranslationRecognizer(translationConfig);
}
```

If you want to specify the audio input device, then you need to create an [`AudioConfig`][audioconfig] class instance and provide the `audioConfig` parameter when initializing `TranslationRecognizer`.

> [!TIP]
> [Learn how to get the device ID for your audio input device](../../../how-to-select-audio-input-devices.md).

First, reference the `AudioConfig` object as follows:

```csharp
static async Task TranslateSpeechAsync()
{
    var translationConfig =
        SpeechTranslationConfig.FromSubscription(SPEECH__SUBSCRIPTION__KEY, SPEECH__SERVICE__REGION);
    
    var fromLanguage = "en-US";
    var toLanguages = new List<string> { "it", "fr", "de" };
    translationConfig.SpeechRecognitionLanguage = fromLanguage;
    toLanguages.ForEach(translationConfig.AddTargetLanguage);

    using var audioConfig = AudioConfig.FromDefaultMicrophoneInput();
    using var recognizer = new TranslationRecognizer(translationConfig, audioConfig);
}
```

If you want to provide an audio file instead of using a microphone, you still need to provide an `audioConfig` parameter. However, when you create an `AudioConfig` class instance, instead of calling `FromDefaultMicrophoneInput`, you call `FromWavFileInput` and pass the `filename` parameter:

```csharp
static async Task TranslateSpeechAsync()
{
    var translationConfig =
        SpeechTranslationConfig.FromSubscription(SPEECH__SUBSCRIPTION__KEY, SPEECH__SERVICE__REGION);
    
    var fromLanguage = "en-US";
    var toLanguages = new List<string> { "it", "fr", "de" };
    translationConfig.SpeechRecognitionLanguage = fromLanguage;
    toLanguages.ForEach(translationConfig.AddTargetLanguage);

    using var audioConfig = AudioConfig.FromWavFileInput("YourAudioFile.wav");
    using var recognizer = new TranslationRecognizer(translationConfig, audioConfig);
}
```

## Translate speech

To translate speech, the Speech SDK relies on a microphone or an audio file input. Speech recognition occurs before speech translation. After all objects have been initialized, call the recognize-once function and get the result:

```csharp
static async Task TranslateSpeechAsync()
{
    var translationConfig =
        SpeechTranslationConfig.FromSubscription(SPEECH__SUBSCRIPTION__KEY, SPEECH__SERVICE__REGION);
    
    var fromLanguage = "en-US";
    var toLanguages = new List<string> { "it", "fr", "de" };
    translationConfig.SpeechRecognitionLanguage = fromLanguage;
    toLanguages.ForEach(translationConfig.AddTargetLanguage);

    using var recognizer = new TranslationRecognizer(translationConfig);

    Console.Write($"Say something in '{fromLanguage}' and ");
    Console.WriteLine($"we'll translate into '{string.Join("', '", toLanguages)}'.\n");
    
    var result = await recognizer.RecognizeOnceAsync();
    if (result.Reason == ResultReason.TranslatedSpeech)
    {
        Console.WriteLine($"Recognized: \"{result.Text}\":");
        foreach (var element in result.Translations)
        {
            Console.WriteLine($"    TRANSLATED into '{element.Key}': {element.Value}");
        }
    }
}
```

For more information about speech-to-text, see [the basics of speech recognition](../../../get-started-speech-to-text.md).

## Synthesize translations

After a successful speech recognition and translation, the result contains all the translations in a dictionary. The [`Translations`][translations] dictionary key is the target translation language, and the value is the translated text. Recognized speech can be translated and then synthesized in a different language (speech-to-speech).

### Event-based synthesis

The `TranslationRecognizer` object exposes a `Synthesizing` event. The event fires several times and provides a mechanism to retrieve the synthesized audio from the translation recognition result. If you're translating to multiple languages, see [Manual synthesis](#manual-synthesis). 

Specify the synthesis voice by assigning a [`VoiceName`][voicename] instance, and provide an event handler for the `Synthesizing` event to get the audio. The following example saves the translated audio as a .wav file.

> [!IMPORTANT]
> The event-based synthesis works only with a single translation. *Do not* add multiple target translation languages. Additionally, the `VoiceName` value should be the same language as the target translation language. For example, `"de"` could map to `"de-DE-Hedda"`.

```csharp
static async Task TranslateSpeechAsync()
{
    var translationConfig =
        SpeechTranslationConfig.FromSubscription(SPEECH__SUBSCRIPTION__KEY, SPEECH__SERVICE__REGION);
    
    var fromLanguage = "en-US";
    var toLanguage = "de";
    translationConfig.SpeechRecognitionLanguage = fromLanguage;
    translationConfig.AddTargetLanguage(toLanguage);

    // See: https://aka.ms/speech/sdkregion#standard-and-neural-voices
    translationConfig.VoiceName = "de-DE-Hedda";

    using var recognizer = new TranslationRecognizer(translationConfig);

    recognizer.Synthesizing += (_, e) =>
    {
        var audio = e.Result.GetAudio();
        Console.WriteLine($"Audio synthesized: {audio.Length:#,0} byte(s) {(audio.Length == 0 ? "(Complete)" : "")}");

        if (audio.Length > 0)
        {
            File.WriteAllBytes("YourAudioFile.wav", audio);
        }
    };

    Console.Write($"Say something in '{fromLanguage}' and ");
    Console.WriteLine($"we'll translate into '{toLanguage}'.\n");

    var result = await recognizer.RecognizeOnceAsync();
    if (result.Reason == ResultReason.TranslatedSpeech)
    {
        Console.WriteLine($"Recognized: \"{result.Text}\"");
        Console.WriteLine($"Translated into '{toLanguage}': {result.Translations[toLanguage]}");
    }
}
```

### Manual synthesis

You can use the [`Translations`][translations] dictionary to synthesize audio from the translation text. Iterate through each translation and synthesize it. When you're creating a `SpeechSynthesizer` instance, the `SpeechConfig` object needs to have its [`SpeechSynthesisVoiceName`][speechsynthesisvoicename] property set to the desired voice. 

The following example translates to five languages. Each translation is then synthesized to an audio file in the corresponding neural language.

```csharp
static async Task TranslateSpeechAsync()
{
    var translationConfig =
        SpeechTranslationConfig.FromSubscription(SPEECH__SERVICE__KEY, SPEECH__SERVICE__REGION);

    var fromLanguage = "en-US";
    var toLanguages = new List<string> { "de", "en", "it", "pt", "zh-Hans" };
    translationConfig.SpeechRecognitionLanguage = fromLanguage;
    toLanguages.ForEach(translationConfig.AddTargetLanguage);

    using var recognizer = new TranslationRecognizer(translationConfig);

    Console.Write($"Say something in '{fromLanguage}' and ");
    Console.WriteLine($"we'll translate into '{string.Join("', '", toLanguages)}'.\n");

    var result = await recognizer.RecognizeOnceAsync();
    if (result.Reason == ResultReason.TranslatedSpeech)
    {
        // See: https://aka.ms/speech/sdkregion#standard-and-neural-voices
        var languageToVoiceMap = new Dictionary<string, string>
        {
            ["de"] = "de-DE-KatjaNeural",
            ["en"] = "en-US-AriaNeural",
            ["it"] = "it-IT-ElsaNeural",
            ["pt"] = "pt-BR-FranciscaNeural",
            ["zh-Hans"] = "zh-CN-XiaoxiaoNeural"
        };

        Console.WriteLine($"Recognized: \"{result.Text}\"");

        foreach (var (language, translation) in result.Translations)
        {
            Console.WriteLine($"Translated into '{language}': {translation}");

            var speechConfig =
                SpeechConfig.FromSubscription(
                    SPEECH__SERVICE__KEY, SPEECH__SERVICE__REGION);
            speechConfig.SpeechSynthesisVoiceName = languageToVoiceMap[language];

            using var audioConfig = AudioConfig.FromWavFileOutput($"{language}-translation.wav");
            using var synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);
            
            await synthesizer.SpeakTextAsync(translation);
        }
    }
}
```

For more information about speech synthesis, see [the basics of speech synthesis](../../../get-started-text-to-speech.md).

## Multi-lingual translation with language identification

In many scenarios, you might not know which input languages to specify. Using language identification allows you to specify up to 10 possible input languages and automatically translate to your target languages. 

The following example uses continuous translation from an audio file. It automatically detects the input language, even if the language being spoken is changing. When you run the sample, `en-US` and `zh-CN` will be automatically detected because they're defined in `AutoDetectSourceLanguageConfig`. Then, the speech will be translated to `de` and `fr` as specified in the calls to `AddTargetLanguage()`.

> [!IMPORTANT]
> This feature is currently in *preview*.

```csharp
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;

public static async Task MultiLingualTranslation()
{
    var region = "<paste-your-region>";
    // Currently, the v2 endpoint is required for this design pattern
    var endpointString = $"wss://{region}.stt.speech.microsoft.com/speech/universal/v2";
    var endpointUrl = new Uri(endpointString);
    
    var config = SpeechTranslationConfig.FromEndpoint(endpointUrl, "<paste-your-subscription-key>");

    // Source language is required, but is currently NoOp 
    string fromLanguage = "en-US";
    config.SpeechRecognitionLanguage = fromLanguage;

    config.AddTargetLanguage("de");
    config.AddTargetLanguage("fr");

    config.SetProperty(PropertyId.SpeechServiceConnection_ContinuousLanguageIdPriority, "Latency");
    var autoDetectSourceLanguageConfig = AutoDetectSourceLanguageConfig.FromLanguages(new string[] { "en-US", "zh-CN" });

    var stopTranslation = new TaskCompletionSource<int>();
    using (var audioInput = AudioConfig.FromWavFileInput(@"path-to-your-audio-file.wav"))
    {
        using (var recognizer = new TranslationRecognizer(config, autoDetectSourceLanguageConfig, audioInput))
        {
            recognizer.Recognizing += (s, e) =>
            {
                var lidResult = e.Result.Properties.GetProperty(PropertyId.SpeechServiceConnection_AutoDetectSourceLanguageResult);

                Console.WriteLine($"RECOGNIZING in '{lidResult}': Text={e.Result.Text}");
                foreach (var element in e.Result.Translations)
                {
                    Console.WriteLine($"    TRANSLATING into '{element.Key}': {element.Value}");
                }
            };

            recognizer.Recognized += (s, e) => {
                if (e.Result.Reason == ResultReason.TranslatedSpeech)
                {
                    var lidResult = e.Result.Properties.GetProperty(PropertyId.SpeechServiceConnection_AutoDetectSourceLanguageResult);

                    Console.WriteLine($"RECOGNIZED in '{lidResult}': Text={e.Result.Text}");
                    foreach (var element in e.Result.Translations)
                    {
                        Console.WriteLine($"    TRANSLATED into '{element.Key}': {element.Value}");
                    }
                }
                else if (e.Result.Reason == ResultReason.RecognizedSpeech)
                {
                    Console.WriteLine($"RECOGNIZED: Text={e.Result.Text}");
                    Console.WriteLine($"    Speech not translated.");
                }
                else if (e.Result.Reason == ResultReason.NoMatch)
                {
                    Console.WriteLine($"NOMATCH: Speech could not be recognized.");
                }
            };

            recognizer.Canceled += (s, e) =>
            {
                Console.WriteLine($"CANCELED: Reason={e.Reason}");

                if (e.Reason == CancellationReason.Error)
                {
                    Console.WriteLine($"CANCELED: ErrorCode={e.ErrorCode}");
                    Console.WriteLine($"CANCELED: ErrorDetails={e.ErrorDetails}");
                    Console.WriteLine($"CANCELED: Did you set the speech resource key and region values?");
                }

                stopTranslation.TrySetResult(0);
            };

            recognizer.SpeechStartDetected += (s, e) => {
                Console.WriteLine("\nSpeech start detected event.");
            };

            recognizer.SpeechEndDetected += (s, e) => {
                Console.WriteLine("\nSpeech end detected event.");
            };

            recognizer.SessionStarted += (s, e) => {
                Console.WriteLine("\nSession started event.");
            };

            recognizer.SessionStopped += (s, e) => {
                Console.WriteLine("\nSession stopped event.");
                Console.WriteLine($"\nStop translation.");
                stopTranslation.TrySetResult(0);
            };

            // Start continuous recognition. Use StopContinuousRecognitionAsync() to stop recognition.
            Console.WriteLine("Start translation...");
            await recognizer.StartContinuousRecognitionAsync().ConfigureAwait(false);

            Task.WaitAny(new[] { stopTranslation.Task });
            await recognizer.StopContinuousRecognitionAsync().ConfigureAwait(false);
        }
    }
}
```

[config]: /dotnet/api/microsoft.cognitiveservices.speech.speechtranslationconfig
[audioconfig]: /dotnet/api/microsoft.cognitiveservices.speech.audio.audioconfig
[recognizer]: /dotnet/api/microsoft.cognitiveservices.speech.translation.translationrecognizer
[recognitionlang]: /dotnet/api/microsoft.cognitiveservices.speech.speechconfig.speechrecognitionlanguage
[addlang]: /dotnet/api/microsoft.cognitiveservices.speech.speechtranslationconfig.addtargetlanguage
[translations]: /dotnet/api/microsoft.cognitiveservices.speech.translation.translationrecognitionresult.translations
[voicename]: /dotnet/api/microsoft.cognitiveservices.speech.speechtranslationconfig.voicename
[speechsynthesisvoicename]: /dotnet/api/microsoft.cognitiveservices.speech.speechconfig.speechsynthesisvoicename
