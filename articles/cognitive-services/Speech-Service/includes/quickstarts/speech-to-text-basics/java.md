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

Before you can do anything, you need to install the Speech SDK. Depending on your platform, use the following instructions:

* <a href="/azure/cognitive-services/speech-service/quickstarts/setup-platform?pivots=programming-language-java&tabs=jre" target="_blank">Java Runtime </a>
* <a href="/azure/cognitive-services/speech-service/quickstarts/setup-platform?pivots=programming-language-java&tabs=android" target="_blank">Android </a>

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVA&Pillar=Speech&Product=speech-to-text&Page=quickstart&Section=Set-up-the-environment" target="_target">I ran into an issue</a>

## Recognize speech from a microphone

Follow these steps to create a new console application for speech recognition.

1. Open a command prompt where you want the new project, and create a new file named `SpeechRecognition.java`.

    ```java
    import com.microsoft.cognitiveservices.speech.*;
    import com.microsoft.cognitiveservices.speech.audio.AudioConfig;
    import java.util.concurrent.ExecutionException;
    import java.util.concurrent.Future;
    
    public class Program {
        private static string YourSubscriptionKey = "YourSubscriptionKey";
        private static string YourServiceRegion = "YourServiceRegion";
    
        public static void main(String[] args) throws InterruptedException, ExecutionException {
            SpeechConfig speechConfig = SpeechConfig.fromSubscription("YourSubscriptionKey", "YourServiceRegion");
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
            
            switch (speechRecognitionResult.getReason()) {
                case ResultReason.RecognizedSpeech:
                    System.out.println("RECOGNIZED: Text=" + speechRecognitionResult.getText());
                    exitCode = 0;
                    break;
                case ResultReason.NoMatch:
                    System.out.println("NOMATCH: Speech could not be recognized.");
                    break;
                case ResultReason.Canceled: {
                    CancellationDetails cancellation = CancellationDetails.fromResult(speechRecognitionResult);
                    System.out.println("CANCELED: Reason=" + cancellation.getReason());
        
                    if (cancellation.getReason() == CancellationReason.Error) {
                        System.out.println("CANCELED: ErrorCode=" + cancellation.getErrorCode());
                        System.out.println("CANCELED: ErrorDetails=" + cancellation.getErrorDetails());
                        System.out.println("CANCELED: Did you update the subscription info?");
                    }
                }
                break;
            }
        }
    }
    ```

1. In `SpeechRecognition.java`, replace `YourSubscriptionKey` with your Speech resource key, and replace `YourServiceRegion` with your Speech resource region.
1. To change the speech recognition language, replace `en-US` with another [supported language](~/articles/cognitive-services/speech-service/supported-languages.md). For example, `es-ES` for Spanish (Spain). The default language is `en-us` if you don't specify a language. For details about how to identify one of multiple languages that might be spoken, see [language identification](~/articles/cognitive-services/speech-service/supported-languages.md). 

Run your new console application to start speech recognition from a microphone:

```console
java Program
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

