---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 06/08/2022
ms.author: eur
---

[!INCLUDE [Header](../../common/javascript.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment

Before you can do anything, you need to install the Speech SDK for JavaScript. If you just want the package name to install, run `npm install microsoft-cognitiveservices-speech-sdk`. For guided installation instructions, see the [SDK installation guide](../../../quickstarts/setup-platform.md?pivots=programming-language-javascript).

### Set environment variables

[!INCLUDE [Environment variables](../../common/environment-variables.md)]

## Translate speech from a file 

Follow these steps to create a Node.js console application for speech recognition.

1. Open a command prompt where you want the new project, and create a new file named `SpeechTranslation.js`.
1. Install the Speech SDK for JavaScript:
    ```console
    npm install microsoft-cognitiveservices-speech-sdk
    ```
1. Copy the following code into `SpeechTranslation.js`:

    ```javascript
    const fs = require("fs");
    const sdk = require("microsoft-cognitiveservices-speech-sdk");

    // This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
    const speechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);
    speechTranslationConfig.speechRecognitionLanguage = "en-US";
    
    var language = "it";
    speechTranslationConfig.addTargetLanguage(language);
    
    function fromFile() {
        let audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync("YourAudioFile.wav"));
        let translationRecognizer = new sdk.TranslationRecognizer(speechTranslationConfig, audioConfig);
    
        translationRecognizer.recognizeOnceAsync(result => {
            switch (result.reason) {
                case sdk.ResultReason.TranslatedSpeech:
                    console.log(`RECOGNIZED: Text=${result.text}`);
                    console.log("Translated into [" + language + "]: " + result.translations.get(language));
    
                    break;
                case sdk.ResultReason.NoMatch:
                    console.log("NOMATCH: Speech could not be recognized.");
                    break;
                case sdk.ResultReason.Canceled:
                    const cancellation = sdk.CancellationDetails.fromResult(result);
                    console.log(`CANCELED: Reason=${cancellation.reason}`);
    
                    if (cancellation.reason == sdk.CancellationReason.Error) {
                        console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
                        console.log(`CANCELED: ErrorDetails=${cancellation.errorDetails}`);
                        console.log("CANCELED: Did you set the speech resource key and region values?");
                    }
                    break;
            }
            translationRecognizer.close();
        });
    }
    fromFile();
    ```

1. In `SpeechTranslation.js`, replace `YourAudioFile.wav` with your own WAV file. This example only recognizes speech from a WAV file. For information about other audio formats, see [How to use compressed input audio](~/articles/ai-services/speech-service/how-to-use-codec-compressed-audio-input-streams.md). This example supports up to 30 seconds audio.
1. To change the speech recognition language, replace `en-US` with another [supported language](~/articles/ai-services/speech-service/language-support.md?tabs=stt#supported-languages). Specify the full locale with a dash (`-`) separator. For example, `es-ES` for Spanish (Spain). The default language is `en-US` if you don't specify a language. For details about how to identify one of multiple languages that might be spoken, see [language identification](~/articles/ai-services/speech-service/language-identification.md).
1. To change the translation target language, replace `it` with another [supported language](~/articles/ai-services/speech-service/language-support.md?tabs=speech-translation#supported-languages). With few exceptions you only specify the language code that precedes the locale dash (`-`) separator. For example, use `es` for Spanish (Spain) instead of `es-ES`. The default language is `en` if you don't specify a language.

Run your new console application to start speech recognition from a file:

```console
node.exe SpeechTranslation.js
```

The speech from the audio file should be output as translated text in the target language:

```console
RECOGNIZED: Text=I'm excited to try speech translation.
Translated into [it]: Sono entusiasta di provare la traduzione vocale.
```

## Remarks
Now that you've completed the quickstart, here are some additional considerations:

This example uses the `recognizeOnceAsync` operation to transcribe utterances of up to 30 seconds, or until silence is detected. For information about continuous recognition for longer audio, including multi-lingual conversations, see [How to translate speech](~/articles/ai-services/speech-service/how-to-translate-speech.md).

> [!NOTE]
> Recognizing speech from a microphone is not supported in Node.js. It's supported only in a browser-based JavaScript environment. 

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
