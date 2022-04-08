---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 02/12/2022
ms.author: eur
---

[!INCLUDE [Header](../../common/java.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVA&Pillar=Speech&Product=speech-to-text&Page=quickstart&Section=Prerequisites" target="_target">I ran into an issue</a>

## Set up the environment

Before you can do anything, you need to install the Speech SDK. The sample in this quickstart works with the [Java Runtime](~/articles/cognitive-services/speech-service/quickstarts/setup-platform.md?pivots=programming-language-java&tabs=jre).

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVA&Pillar=Speech&Product=speech-to-text&Page=quickstart&Section=Set-up-the-environment" target="_target">I ran into an issue</a>

## Recognize speech from a microphone

Follow these steps to create a new console application for speech recognition.

1. Open a command prompt where you want the new project, and create a new file named `SpeechRecognition.java`.
1. Copy the following code into `SpeechRecognition.java`:

    ```java
    import com.microsoft.cognitiveservices.speech.*;
    import com.microsoft.cognitiveservices.speech.audio.AudioConfig;

    import java.util.concurrent.ExecutionException;
    import java.util.concurrent.Future;

    public class SpeechRecognition {
        private static String YourSubscriptionKey = "YourSubscriptionKey";
        private static String YourServiceRegion = "YourServiceRegion";

        public static void main(String[] args) throws InterruptedException, ExecutionException {
            SpeechConfig speechConfig = SpeechConfig.fromSubscription(YourSubscriptionKey, YourServiceRegion);
            speechConfig.setSpeechRecognitionLanguage("en-US");
            recognizeFromMicrophone(speechConfig);
        }

        public static void recognizeFromMicrophone(SpeechConfig speechConfig) throws InterruptedException, ExecutionException {
            //To recognize speech from an audio file, use `fromWavFileInput` instead of `fromDefaultMicrophoneInput`:
            //AudioConfig audioConfig = AudioConfig.fromWavFileInput("YourAudioFile.wav");
            AudioConfig audioConfig = AudioConfig.fromDefaultMicrophoneInput();
            SpeechRecognizer speechRecognizer = new SpeechRecognizer(speechConfig, audioConfig);

            System.out.println("Speak into your microphone.");
            Future<SpeechRecognitionResult> task = speechRecognizer.recognizeOnceAsync();
            SpeechRecognitionResult speechRecognitionResult = task.get();

            if (speechRecognitionResult.getReason() == ResultReason.RecognizedSpeech) {
                System.out.println("RECOGNIZED: Text=" + speechRecognitionResult.getText());
            }
            else if (speechRecognitionResult.getReason() == ResultReason.NoMatch) {
                System.out.println("NOMATCH: Speech could not be recognized.");
            }
            else if (speechRecognitionResult.getReason() == ResultReason.Canceled) {
                CancellationDetails cancellation = CancellationDetails.fromResult(speechRecognitionResult);
                System.out.println("CANCELED: Reason=" + cancellation.getReason());

                if (cancellation.getReason() == CancellationReason.Error) {
                    System.out.println("CANCELED: ErrorCode=" + cancellation.getErrorCode());
                    System.out.println("CANCELED: ErrorDetails=" + cancellation.getErrorDetails());
                    System.out.println("CANCELED: Did you set the speech resource key and region values?");
                }
            }

            System.exit(0);
        }
    }
    ```

1. In `SpeechRecognition.java`, replace `YourSubscriptionKey` with your Speech resource key, and replace `YourServiceRegion` with your Speech resource region.
1. To change the speech recognition language, replace `en-US` with another [supported language](~/articles/cognitive-services/speech-service/supported-languages.md). For example, `es-ES` for Spanish (Spain). The default language is `en-us` if you don't specify a language. For details about how to identify one of multiple languages that might be spoken, see [language identification](~/articles/cognitive-services/speech-service/supported-languages.md). 

Run your new console application to start speech recognition from a microphone:

```console
java SpeechRecognition
```

Speak into your microphone when prompted. What you speak should be output as text: 

```console
Speak into your microphone.
RECOGNIZED: Text=I'm excited to try speech to text.
```

This example uses the `RecognizeOnceAsync` operation to transcribe utterances of up to 30 seconds, or until silence is detected. For information about continuous recognition for longer audio, including multi-lingual conversations, see [How to recognize speech](~/articles/cognitive-services/speech-service/how-to-recognize-speech.md).

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVA&Pillar=Speech&Product=speech-to-text&Page=quickstart&Section=Recognize-speech-from-a-microphone" target="_target">I ran into an issue</a>

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]

