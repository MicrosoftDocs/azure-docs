---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 04/13/2020
ms.author: eur
---

[!INCLUDE [Header](../../common/cpp.md)]

[!INCLUDE [Introduction](intro.md)]

## Sensitive data and environment variables

The example source code in this article depends on environment variables for storing sensitive data, such as the Speech resource's key and region. The C++ code file contains two string values that are assigned from the host machine's environment variables: `SPEECH__SUBSCRIPTION__KEY` and `SPEECH__SERVICE__REGION`. Both of these fields are at the class scope, so they're accessible within method bodies of the class: 

```cpp
auto SPEECH__SUBSCRIPTION__KEY = getenv("SPEECH__SUBSCRIPTION__KEY");
auto SPEECH__SERVICE__REGION = getenv("SPEECH__SERVICE__REGION");
```

For more information on environment variables, see [Environment variables and application configuration](../../../../cognitive-services-environment-variables.md).

## Create a speech translation configuration

To call the Speech service by using the Speech SDK, you need to create a [`SpeechTranslationConfig`][speechtranslationconfig] instance. This class includes information about your subscription, like your key and associated region, endpoint, host, or authorization token.

> [!TIP]
> Regardless of whether you're performing speech recognition, speech synthesis, translation, or intent recognition, you'll always create a configuration.

You can initialize `SpeechTranslationConfig` in a few ways:

* With a subscription: pass in a key and the associated region.
* With an endpoint: pass in a Speech service endpoint. A key or authorization token is optional.
* With a host: pass in a host address. A key or authorization token is optional.
* With an authorization token: pass in an authorization token and the associated region.

Let's look at how you create a `SpeechTranslationConfig` instance by using a key and region. Get the Speech resource key and region in the [Azure portal](https://portal.azure.com).

```cpp
auto SPEECH__SUBSCRIPTION__KEY = getenv("SPEECH__SUBSCRIPTION__KEY");
auto SPEECH__SERVICE__REGION = getenv("SPEECH__SERVICE__REGION");

void translateSpeech() {
    auto speechTranslationConfig =
        SpeechTranslationConfig::FromSubscription(SPEECH__SUBSCRIPTION__KEY, SPEECH__SERVICE__REGION);
}

int main(int argc, char** argv) {
    setlocale(LC_ALL, "");
    translateSpeech();
    return 0;
}
```

## Change the source language

One common task of speech translation is specifying the input (or source) language. The following example shows how you would change the input language to Italian. In your code, interact with the `SpeechTranslationConfig` instance by calling the `SetSpeechRecognitionLanguage` method.

```cpp
void translateSpeech() {
    auto speechTranslationConfig =
        SpeechTranslationConfig::FromSubscription(SPEECH__SUBSCRIPTION__KEY, SPEECH__SERVICE__REGION);

    // Source (input) language
    speechTranslationConfig->SetSpeechRecognitionLanguage("it-IT");
}
```

The [`SpeechRecognitionLanguage`][recognitionlang] property expects a language-locale format string. Refer to the [list of supported speech translation locales](../../../language-support.md?tabs=speech-translation).

## Add a translation language

Another common task of speech translation is to specify target translation languages. At least one is required, but multiples are supported. The following code snippet sets both French and German as translation language targets:

```cpp
void translateSpeech() {
    auto speechTranslationConfig =
        SpeechTranslationConfig::FromSubscription(SPEECH__SUBSCRIPTION__KEY, SPEECH__SERVICE__REGION);

    speechTranslationConfig->SetSpeechRecognitionLanguage("it-IT");

    speechTranslationConfig->AddTargetLanguage("fr");
    speechTranslationConfig->AddTargetLanguage("de");
}
```

With every call to [`AddTargetLanguage`][addlang], a new target translation language is specified. In other words, when speech is recognized from the source language, each target translation is available as part of the resulting translation operation.

## Initialize a translation recognizer

After you've created a [`SpeechTranslationConfig`][speechtranslationconfig] instance, the next step is to initialize [`TranslationRecognizer`][translationrecognizer]. When you initialize `TranslationRecognizer`, you need to pass it your `translationConfig` instance. The configuration object provides the credentials that the Speech service requires to validate your request.

If you're recognizing speech by using your device's default microphone, here's what `TranslationRecognizer` should look like:

```cpp
void translateSpeech() {
    auto speechTranslationConfig =
        SpeechTranslationConfig::FromSubscription(SPEECH__SUBSCRIPTION__KEY, SPEECH__SERVICE__REGION);

    auto fromLanguage = "en-US";
    auto toLanguages = { "it", "fr", "de" };
    speechTranslationConfig->SetSpeechRecognitionLanguage(fromLanguage);
    for (auto language : toLanguages) {
        speechTranslationConfig->AddTargetLanguage(language);
    }

    auto translationRecognizer = TranslationRecognizer::FromConfig(translationConfig);
}
```

If you want to specify the audio input device, then you need to create an [`AudioConfig`][audioconfig] class instance and provide the `audioConfig` parameter when initializing `TranslationRecognizer`.

> [!TIP]
> [Learn how to get the device ID for your audio input device](../../../how-to-select-audio-input-devices.md).

First, reference the `AudioConfig` object as follows:

```cpp
void translateSpeech() {
    auto speechTranslationConfig =
        SpeechTranslationConfig::FromSubscription(SPEECH__SUBSCRIPTION__KEY, SPEECH__SERVICE__REGION);

    auto fromLanguage = "en-US";
    auto toLanguages = { "it", "fr", "de" };
    speechTranslationConfig->SetSpeechRecognitionLanguage(fromLanguage);
    for (auto language : toLanguages) {
        speechTranslationConfig->AddTargetLanguage(language);
    }

    auto audioConfig = AudioConfig::FromDefaultMicrophoneInput();
    auto translationRecognizer = TranslationRecognizer::FromConfig(translationConfig, audioConfig);
}
```

If you want to provide an audio file instead of using a microphone, you still need to provide an `audioConfig` parameter. However, when you create an `AudioConfig` class instance, instead of calling `FromDefaultMicrophoneInput`, you call `FromWavFileInput` and pass the `filename` parameter:

```cpp
void translateSpeech() {
    auto speechTranslationConfig =
        SpeechTranslationConfig::FromSubscription(SPEECH__SUBSCRIPTION__KEY, SPEECH__SERVICE__REGION);

    auto fromLanguage = "en-US";
    auto toLanguages = { "it", "fr", "de" };
    speechTranslationConfig->SetSpeechRecognitionLanguage(fromLanguage);
    for (auto language : toLanguages) {
        speechTranslationConfig->AddTargetLanguage(language);
    }

    auto audioConfig = AudioConfig::FromWavFileInput("YourAudioFile.wav");
    auto translationRecognizer = TranslationRecognizer::FromConfig(translationConfig, audioConfig);
}
```

## Translate speech

To translate speech, the Speech SDK relies on a microphone or an audio file input. Speech recognition occurs before speech translation. After all objects have been initialized, call the recognize-once function and get the result:

```cpp
void translateSpeech() {
    auto speechTranslationConfig =
        SpeechTranslationConfig::FromSubscription(SPEECH__SUBSCRIPTION__KEY, SPEECH__SERVICE__REGION);

    string fromLanguage = "en-US";
    string toLanguages[3] = { "it", "fr", "de" };
    speechTranslationConfig->SetSpeechRecognitionLanguage(fromLanguage);
    for (auto language : toLanguages) {
        speechTranslationConfig->AddTargetLanguage(language);
    }

    auto translationRecognizer = TranslationRecognizer::FromConfig(translationConfig);
    cout << "Say something in '" << fromLanguage << "' and we'll translate...\n";

    auto result = translationRecognizer->RecognizeOnceAsync().get();
    if (result->Reason == ResultReason::TranslatedSpeech)
    {
        cout << "Recognized: \"" << result->Text << "\"" << std::endl;
        for (auto pair : result->Translations)
        {
            auto language = pair.first;
            auto translation = pair.second;
            cout << "Translated into '" << language << "': " << translation << std::endl;
        }
    }
}
```

For more information about speech to text, see [the basics of speech recognition](../../../get-started-speech-to-text.md).

## Synthesize translations

After a successful speech recognition and translation, the result contains all the translations in a dictionary. The [`Translations`][translations] dictionary key is the target translation language, and the value is the translated text. Recognized speech can be translated and then synthesized in a different language (speech-to-speech).

### Event-based synthesis

The `TranslationRecognizer` object exposes a `Synthesizing` event. The event fires several times and provides a mechanism to retrieve the synthesized audio from the translation recognition result. If you're translating to multiple languages, see [Manual synthesis](#manual-synthesis). 

Specify the synthesis voice by assigning a [`SetVoiceName`][setvoicename] instance, and provide an event handler for the `Synthesizing` event to get the audio. The following example saves the translated audio as a .wav file.

> [!IMPORTANT]
> The event-based synthesis works only with a single translation. *Do not* add multiple target translation languages. Additionally, the [`SetVoiceName`][setvoicename] value should be the same language as the target translation language. For example, `"de"` could map to `"de-DE-Hedda"`.

```cpp
void translateSpeech() {
    auto speechTranslationConfig =
        SpeechTranslationConfig::FromSubscription(SPEECH__SUBSCRIPTION__KEY, SPEECH__SERVICE__REGION);

    auto fromLanguage = "en-US";
    auto toLanguage = "de";
    speechTranslationConfig->SetSpeechRecognitionLanguage(fromLanguage);
    speechTranslationConfig->AddTargetLanguage(toLanguage);

    speechTranslationConfig->SetVoiceName("de-DE-Hedda");

    auto translationRecognizer = TranslationRecognizer::FromConfig(translationConfig);
    translationRecognizer->Synthesizing.Connect([](const TranslationSynthesisEventArgs& e)
        {
            auto audio = e.Result->Audio;
            auto size = audio.size();
            cout << "Audio synthesized: " << size << " byte(s)" << (size == 0 ? "(COMPLETE)" : "") << std::endl;

            if (size > 0) {
                ofstream file("translation.wav", ios::out | ios::binary);
                auto audioData = audio.data();
                file.write((const char*)audioData, sizeof(audio[0]) * size);
                file.close();
            }
        });

    cout << "Say something in '" << fromLanguage << "' and we'll translate...\n";

    auto result = translationRecognizer->RecognizeOnceAsync().get();
    if (result->Reason == ResultReason::TranslatedSpeech)
    {
        cout << "Recognized: \"" << result->Text << "\"" << std::endl;
        for (auto pair : result->Translations)
        {
            auto language = pair.first;
            auto translation = pair.second;
            cout << "Translated into '" << language << "': " << translation << std::endl;
        }
    }
}
```

### Manual synthesis

You can use the [`Translations`][translations] dictionary to synthesize audio from the translation text. Iterate through each translation and synthesize it. When you're creating a `SpeechSynthesizer` instance, the `SpeechConfig` object needs to have its [`SetSpeechSynthesisVoiceName`][speechsynthesisvoicename] property set to the desired voice. 

The following example translates to five languages. Each translation is then synthesized to an audio file in the corresponding neural language.

```cpp
void translateSpeech() {
    auto speechTranslationConfig =
        SpeechTranslationConfig::FromSubscription(SPEECH__SUBSCRIPTION__KEY, SPEECH__SERVICE__REGION);

    auto fromLanguage = "en-US";
    auto toLanguages = { "de", "en", "it", "pt", "zh-Hans" };
    speechTranslationConfig->SetSpeechRecognitionLanguage(fromLanguage);
    for (auto language : toLanguages) {
        speechTranslationConfig->AddTargetLanguage(language);
    }

    auto translationRecognizer = TranslationRecognizer::FromConfig(translationConfig);

    cout << "Say something in '" << fromLanguage << "' and we'll translate...\n";

    auto result = translationRecognizer->RecognizeOnceAsync().get();
    if (result->Reason == ResultReason::TranslatedSpeech)
    {
        map<string, string> languageToVoiceMap;
        languageToVoiceMap["de"] = "de-DE-KatjaNeural";
        languageToVoiceMap["en"] = "en-US-AriaNeural";
        languageToVoiceMap["it"] = "it-IT-ElsaNeural";
        languageToVoiceMap["pt"] = "pt-BR-FranciscaNeural";
        languageToVoiceMap["zh-Hans"] = "zh-CN-XiaoxiaoNeural";

        cout << "Recognized: \"" << result->Text << "\"" << std::endl;
        for (auto pair : result->Translations)
        {
            auto language = pair.first;
            auto translation = pair.second;
            cout << "Translated into '" << language << "': " << translation << std::endl;

            auto speechConfig =
                SpeechConfig::FromSubscription(SPEECH__SUBSCRIPTION__KEY, SPEECH__SERVICE__REGION);
            speechConfig->SetSpeechSynthesisVoiceName(languageToVoiceMap[language]);

            auto audioConfig = AudioConfig::FromWavFileOutput(language + "-translation.wav");
            auto speechSynthesizer = SpeechSynthesizer::FromConfig(speechConfig, audioConfig);

            speechSynthesizer->SpeakTextAsync(translation).get();
        }
    }
}
```

For more information about speech synthesis, see [the basics of speech synthesis](../../../get-started-text-to-speech.md).

## Multilingual translation with language identification

In many scenarios, you might not know which input languages to specify. Using [language identification](../../../language-identification.md?pivots=programming-language-cpp#speech-translation) you can detect up to 10 possible input languages and automatically translate to your target languages. 

The following example anticipates that `en-US` or `zh-CN` should be detected because they're defined in `AutoDetectSourceLanguageConfig`. Then, the speech will be translated to `de` and `fr` as specified in the calls to `AddTargetLanguage()`.

```cpp
speechTranslationConfig->AddTargetLanguage("de");
speechTranslationConfig->AddTargetLanguage("fr");
auto autoDetectSourceLanguageConfig = AutoDetectSourceLanguageConfig::FromLanguages({ "en-US", "zh-CN" });
auto translationRecognizer = TranslationRecognizer::FromConfig(speechTranslationConfig, autoDetectSourceLanguageConfig, audioConfig);
```

For a complete code sample, see [language identification](../../../language-identification.md?pivots=programming-language-cpp#speech-translation).

[speechtranslationconfig]: /cpp/cognitive-services/speech/translation-speechtranslationconfig
[audioconfig]: /cpp/cognitive-services/speech/audio-audioconfig
[translationrecognizer]: /cpp/cognitive-services/speech/translation-translationrecognizer
[recognitionlang]: /cpp/cognitive-services/speech/speechconfig#setspeechrecognitionlanguage
[addlang]: /cpp/cognitive-services/speech/translation-speechtranslationconfig#addtargetlanguage
[translations]: /cpp/cognitive-services/speech/translation-translationrecognitionresult#translations
[setvoicename]: /cpp/cognitive-services/speech/translation-speechtranslationconfig#setvoicename
[speechsynthesisvoicename]: /cpp/cognitive-services/speech/speechconfig#setspeechsynthesisvoicename
