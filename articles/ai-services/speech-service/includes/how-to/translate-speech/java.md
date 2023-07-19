---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 04/13/2020
ms.custom: devx-track-java
ms.author: eur
---

[!INCLUDE [Header](../../common/java.md)]

[!INCLUDE [Introduction](intro.md)]

## Sensitive data and environment variables

The example source code in this article depends on environment variables for storing sensitive data, such as the Speech resource's subscription key and region. The Java code file contains two `static final String` values that are assigned from the host machine's environment variables: `SPEECH__SUBSCRIPTION__KEY` and `SPEECH__SERVICE__REGION`. Both of these fields are at the class scope, so they're accessible within method bodies of the class: 

```java
public class App {

    static final String SPEECH__SUBSCRIPTION__KEY = System.getenv("SPEECH__SUBSCRIPTION__KEY");
    static final String SPEECH__SERVICE__REGION = System.getenv("SPEECH__SERVICE__REGION");

    public static void main(String[] args) { }
}
```

For more information on environment variables, see [Environment variables and application configuration](../../../../cognitive-services-environment-variables.md).

## Create a speech translation configuration

To call the Speech service by using the Speech SDK, you need to create a [`SpeechTranslationConfig`][speechtranslationconfig] instance. This class includes information about your subscription, like your key and associated region, endpoint, host, or authorization token.

> [!TIP]
> Regardless of whether you're performing speech recognition, speech synthesis, translation, or intent recognition, you'll always create a configuration.

You can initialize a `SpeechTranslationConfig` instance in a few ways:

* With a subscription: pass in a key and the associated region.
* With an endpoint: pass in a Speech service endpoint. A key or authorization token is optional.
* With a host: pass in a host address. A key or authorization token is optional.
* With an authorization token: pass in an authorization token and the associated region.

Let's look at how you create a `SpeechTranslationConfig` instance by using a key and region. Get the Speech resource key and region in the [Azure portal](https://portal.azure.com).

```java
public class App {

    static final String SPEECH__SUBSCRIPTION__KEY = System.getenv("SPEECH__SERVICE__KEY");
    static final String SPEECH__SERVICE__REGION = System.getenv("SPEECH__SERVICE__REGION");

    public static void main(String[] args) {
        try {
            translateSpeech();
            System.exit(0);
        } catch (Exception ex) {
            System.out.println(ex);
            System.exit(1);
        }
    }

    static void translateSpeech() {
        SpeechTranslationConfig speechTranslationConfig = SpeechTranslationConfig.fromSubscription(
            SPEECH__SUBSCRIPTION__KEY, SPEECH__SERVICE__REGION);
    }
}
```

## Change the source language

One common task of speech translation is specifying the input (or source) language. The following example shows how you would change the input language to Italian. In your code, interact with the `SpeechTranslationConfig` instance by calling the `setSpeechRecognitionLanguage` method:

```java
static void translateSpeech() {
    SpeechTranslationConfig speechTranslationConfig = SpeechTranslationConfig.fromSubscription(
        SPEECH__SUBSCRIPTION__KEY, SPEECH__SERVICE__REGION);
    
    // Source (input) language
    speechTranslationConfig.setSpeechRecognitionLanguage("it-IT");
}
```

The [`setSpeechRecognitionLanguage`][recognitionlang] function expects a language-locale format string. Refer to the [list of supported speech translation locales](../../../language-support.md?tabs=speech-translation).

## Add a translation language

Another common task of speech translation is to specify target translation languages. At least one is required, but multiples are supported. The following code snippet sets both French and German as translation language targets:

```java
static void translateSpeech() {
    SpeechTranslationConfig speechTranslationConfig = SpeechTranslationConfig.fromSubscription(
        SPEECH__SUBSCRIPTION__KEY, SPEECH__SERVICE__REGION);
    
    speechTranslationConfig.setSpeechRecognitionLanguage("it-IT");

    // Translate to languages. See https://aka.ms/speech/sttt-languages
    speechTranslationConfig.addTargetLanguage("fr");
    speechTranslationConfig.addTargetLanguage("de");
}
```

With every call to [`addTargetLanguage`][addlang], a new target translation language is specified. In other words, when speech is recognized from the source language, each target translation is available as part of the resulting translation operation.

## Initialize a translation recognizer

After you've created a [`SpeechTranslationConfig`][speechtranslationconfig] instance, the next step is to initialize [`TranslationRecognizer`][translationrecognizer]. When you initialize `TranslationRecognizer`, you need to pass it your `speechTranslationConfig` instance. The configuration object provides the credentials that the Speech service requires to validate your request.

If you're recognizing speech by using your device's default microphone, here's what `TranslationRecognizer` should look like:

```java
static void translateSpeech() {
    SpeechTranslationConfig speechTranslationConfig = SpeechTranslationConfig.fromSubscription(
        SPEECH__SUBSCRIPTION__KEY, SPEECH__SERVICE__REGION);
    
    String fromLanguage = "en-US";
    String[] toLanguages = { "it", "fr", "de" };
    speechTranslationConfig.setSpeechRecognitionLanguage(fromLanguage);
    for (String language : toLanguages) {
        speechTranslationConfig.addTargetLanguage(language);
    }

    try (TranslationRecognizer translationRecognizer = new TranslationRecognizer(speechTranslationConfig)) {
    }
}
```

If you want to specify the audio input device, then you need to create an [`AudioConfig`][audioconfig] class instance and provide the `audioConfig` parameter when initializing `TranslationRecognizer`.

> [!TIP]
> [Learn how to get the device ID for your audio input device](../../../how-to-select-audio-input-devices.md).

First, reference the `AudioConfig` object as follows:

```java
static void translateSpeech() {
    SpeechTranslationConfig speechTranslationConfig = SpeechTranslationConfig.fromSubscription(
        SPEECH__SUBSCRIPTION__KEY, SPEECH__SERVICE__REGION);
    
    String fromLanguage = "en-US";
    String[] toLanguages = { "it", "fr", "de" };
    speechTranslationConfig.setSpeechRecognitionLanguage(fromLanguage);
    for (String language : toLanguages) {
        speechTranslationConfig.addTargetLanguage(language);
    }

    AudioConfig audioConfig = AudioConfig.fromDefaultMicrophoneInput();
    try (TranslationRecognizer translationRecognizer = new TranslationRecognizer(speechTranslationConfig, audioConfig)) {
        
    }
}
```

If you want to provide an audio file instead of using a microphone, you still need to provide an `audioConfig` parameter. However, when you create an `AudioConfig` class instance, instead of calling `fromDefaultMicrophoneInput`, you call `fromWavFileInput` and pass the `filename` parameter:

```java
static void translateSpeech() {
    SpeechTranslationConfig speechTranslationConfig = SpeechTranslationConfig.fromSubscription(
        SPEECH__SUBSCRIPTION__KEY, SPEECH__SERVICE__REGION);
    
    String fromLanguage = "en-US";
    String[] toLanguages = { "it", "fr", "de" };
    speechTranslationConfig.setSpeechRecognitionLanguage(fromLanguage);
    for (String language : toLanguages) {
        speechTranslationConfig.addTargetLanguage(language);
    }

    AudioConfig audioConfig = AudioConfig.fromWavFileInput("YourAudioFile.wav");
    try (TranslationRecognizer translationRecognizer = new TranslationRecognizer(speechTranslationConfig, audioConfig)) {
        
    }
}
```

## Translate speech

To translate speech, the Speech SDK relies on a microphone or an audio file input. Speech recognition occurs before speech translation. After all objects have been initialized, call the recognize-once function and get the result:

```java
static void translateSpeech() throws ExecutionException, InterruptedException {
    SpeechTranslationConfig speechTranslationConfig = SpeechTranslationConfig.fromSubscription(
        SPEECH__SUBSCRIPTION__KEY, SPEECH__SERVICE__REGION);
    
    String fromLanguage = "en-US";
    String[] toLanguages = { "it", "fr", "de" };
    speechTranslationConfig.setSpeechRecognitionLanguage(fromLanguage);
    for (String language : toLanguages) {
        speechTranslationConfig.addTargetLanguage(language);
    }

    try (TranslationRecognizer translationRecognizer = new TranslationRecognizer(speechTranslationConfig)) {
        System.out.printf("Say something in '%s' and we'll translate...", fromLanguage);

        TranslationRecognitionResult result = translationRecognizer.recognizeOnceAsync().get();
        if (result.getReason() == ResultReason.TranslatedSpeech) {
            System.out.printf("Recognized: \"%s\"\n", result.getText());
            for (Map.Entry<String, String> pair : result.getTranslations().entrySet()) {
                System.out.printf("Translated into '%s': %s\n", pair.getKey(), pair.getValue());
            }
        }
    }
}
```

For more information about speech to text, see [the basics of speech recognition](../../../get-started-speech-to-text.md).

## Synthesize translations

After a successful speech recognition and translation, the result contains all the translations in a dictionary. The [`getTranslations`][translations] function returns a dictionary with the key as the target translation language and the value as the translated text. Recognized speech can be translated and then synthesized in a different language (speech-to-speech).

### Event-based synthesis

The `TranslationRecognizer` object exposes a `synthesizing` event. The event fires several times and provides a mechanism to retrieve the synthesized audio from the translation recognition result. If you're translating to multiple languages, see [Manual synthesis](#manual-synthesis). 

Specify the synthesis voice by assigning a [`setVoiceName`][setvoicename] instance, and provide an event handler for the `synthesizing` event to get the audio. The following example saves the translated audio as a .wav file.

> [!IMPORTANT]
> The event-based synthesis works only with a single translation. *Do not* add multiple target translation languages. Additionally, the `setVoiceName` value should be the same language as the target translation language. For example, `"de"` could map to `"de-DE-Hedda"`.

```java
static void translateSpeech() throws ExecutionException, FileNotFoundException, InterruptedException, IOException {
    SpeechTranslationConfig speechTranslationConfig = SpeechTranslationConfig.fromSubscription(
        SPEECH__SUBSCRIPTION__KEY, SPEECH__SERVICE__REGION);

    String fromLanguage = "en-US";
    String toLanguage = "de";
    speechTranslationConfig.setSpeechRecognitionLanguage(fromLanguage);
    speechTranslationConfig.addTargetLanguage(toLanguage);

    // See: https://aka.ms/speech/sdkregion#standard-and-neural-voices
    speechTranslationConfig.setVoiceName("de-DE-Hedda");

    try (TranslationRecognizer translationRecognizer = new TranslationRecognizer(speechTranslationConfig)) {
        translationRecognizer.synthesizing.addEventListener((s, e) -> {
            byte[] audio = e.getResult().getAudio();
            int size = audio.length;
            System.out.println("Audio synthesized: " + size + " byte(s)" + (size == 0 ? "(COMPLETE)" : ""));

            if (size > 0) {
                try (FileOutputStream file = new FileOutputStream("translation.wav")) {
                    file.write(audio);
                } catch (IOException ex) {
                    ex.printStackTrace();
                }
            }
        });

        System.out.printf("Say something in '%s' and we'll translate...", fromLanguage);

        TranslationRecognitionResult result = translationRecognizer.recognizeOnceAsync().get();
        if (result.getReason() == ResultReason.TranslatedSpeech) {
            System.out.printf("Recognized: \"%s\"\n", result.getText());
            for (Map.Entry<String, String> pair : result.getTranslations().entrySet()) {
                String language = pair.getKey();
                String translation = pair.getValue();
                System.out.printf("Translated into '%s': %s\n", language, translation);
            }
        }
    }
}
```

### Manual synthesis

The [`getTranslations`][translations] function returns a dictionary that you can use to synthesize audio from the translation text. Iterate through each translation and synthesize it. When you're creating a `SpeechSynthesizer` instance, the `SpeechConfig` object needs to have its [`setSpeechSynthesisVoiceName`][speechsynthesisvoicename] property set to the desired voice. 

The following example translates to five languages. Each translation is then synthesized to an audio file in the corresponding neural language.

```java
static void translateSpeech() throws ExecutionException, InterruptedException {
    SpeechTranslationConfig speechTranslationConfig = SpeechTranslationConfig.fromSubscription(
        SPEECH__SUBSCRIPTION__KEY, SPEECH__SERVICE__REGION);
    
    String fromLanguage = "en-US";
    String[] toLanguages = { "de", "en", "it", "pt", "zh-Hans" };
    speechTranslationConfig.setSpeechRecognitionLanguage(fromLanguage);
    for (String language : toLanguages) {
        speechTranslationConfig.addTargetLanguage(language);
    }

    try (TranslationRecognizer translationRecognizer = new TranslationRecognizer(speechTranslationConfig)) {
        System.out.printf("Say something in '%s' and we'll translate...", fromLanguage);

        TranslationRecognitionResult result = translationRecognizer.recognizeOnceAsync().get();
        if (result.getReason() == ResultReason.TranslatedSpeech) {
            // See: https://aka.ms/speech/sdkregion#standard-and-neural-voices
            Map<String, String> languageToVoiceMap = new HashMap<String, String>();
            languageToVoiceMap.put("de", "de-DE-KatjaNeural");
            languageToVoiceMap.put("en", "en-US-AriaNeural");
            languageToVoiceMap.put("it", "it-IT-ElsaNeural");
            languageToVoiceMap.put("pt", "pt-BR-FranciscaNeural");
            languageToVoiceMap.put("zh-Hans", "zh-CN-XiaoxiaoNeural");

            System.out.printf("Recognized: \"%s\"\n", result.getText());
            for (Map.Entry<String, String> pair : result.getTranslations().entrySet()) {
                String language = pair.getKey();
                String translation = pair.getValue();
                System.out.printf("Translated into '%s': %s\n", language, translation);

                SpeechConfig speechConfig =
                    SpeechConfig.fromSubscription(SPEECH__SUBSCRIPTION__KEY, SPEECH__SERVICE__REGION);
                speechConfig.setSpeechSynthesisVoiceName(languageToVoiceMap.get(language));

                AudioConfig audioConfig = AudioConfig.fromWavFileOutput(language + "-translation.wav");
                try (SpeechSynthesizer speechSynthesizer = new SpeechSynthesizer(speechConfig, audioConfig)) {
                    speechSynthesizer.SpeakTextAsync(translation).get();
                }
            }
        }
    }
}
```

For more information about speech synthesis, see [the basics of speech synthesis](../../../get-started-text-to-speech.md).

[speechtranslationconfig]: /java/api/com.microsoft.cognitiveservices.speech.translation.SpeechTranslationConfig
[audioconfig]: /java/api/com.microsoft.cognitiveservices.speech.audio.AudioConfig
[translationrecognizer]: /java/api/com.microsoft.cognitiveservices.speech.translation.TranslationRecognizer
[recognitionlang]: /java/api/com.microsoft.cognitiveservices.speech.speechconfig.setspeechrecognitionlanguage
[addlang]: /java/api/com.microsoft.cognitiveservices.speech.translation.speechtranslationconfig.addtargetlanguage
[translations]: /java/api/com.microsoft.cognitiveservices.speech.translation.translationrecognitionresult.gettranslations
[setvoicename]: /java/api/com.microsoft.cognitiveservices.speech.translation.speechtranslationconfig.setvoicename
[speechsynthesisvoicename]: /java/api/com.microsoft.cognitiveservices.speech.speechconfig.setspeechsynthesisvoicename
