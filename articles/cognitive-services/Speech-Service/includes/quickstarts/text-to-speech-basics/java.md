---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 03/15/2022
ms.author: eur
---

[!INCLUDE [Header](../../common/java.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVA&Pillar=Speech&Product=text-to-speech&Page=quickstart&Section=Prerequisites" target="_target">I ran into an issue</a>

## Set up the environment

Before you can do anything, you need to install the Speech SDK. The sample in this quickstart works with the [Java Runtime](~/articles/cognitive-services/speech-service/quickstarts/setup-platform.md?pivots=programming-language-java&tabs=jre).

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVA&Pillar=Speech&Product=text-to-speech&Page=quickstart&Section=Set-up-the-environment" target="_target">I ran into an issue</a>

## Synthesize to speaker output

Follow these steps to create a new console application for speech recognition.

1. Open a command prompt where you want the new project, and create a new file named `SpeechSynthesis.java`.
1. Copy the following code into `SpeechSynthesis.java`: 

    ```java
    import com.microsoft.cognitiveservices.speech.*;
    import com.microsoft.cognitiveservices.speech.audio.*;

    import java.util.Scanner;
    import java.util.concurrent.ExecutionException;
    
    public class SpeechSynthesis {
        private static String YourSubscriptionKey = "YourSubscriptionKey";
        private static String YourServiceRegion = "YourServiceRegion";
    
        public static void main(String[] args) throws InterruptedException, ExecutionException {
            SpeechConfig speechConfig = SpeechConfig.fromSubscription(YourSubscriptionKey, YourServiceRegion);
            
            speechConfig.setSpeechSynthesisVoiceName("en-US-JennyNeural"); 
    
            SpeechSynthesizer speechSynthesizer = new SpeechSynthesizer(speechConfig);
    
            // Get text from the console and synthesize to the default speaker.
            System.out.println("Enter some text that you want to speak >");
            String text = new Scanner(System.in).nextLine();
            if (text.isEmpty())
            {
                return;
            }
    
            SpeechSynthesisResult speechRecognitionResult = speechSynthesizer.SpeakTextAsync(text).get();
    
            if (speechRecognitionResult.getReason() == ResultReason.SynthesizingAudioCompleted) {
                System.out.println("Speech synthesized to speaker for text [" + text + "]");
            }
            else if (speechRecognitionResult.getReason() == ResultReason.Canceled) {
                SpeechSynthesisCancellationDetails cancellation = SpeechSynthesisCancellationDetails.fromResult(speechRecognitionResult);
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

1. In `SpeechSynthesis.java`, replace `YourSubscriptionKey` with your Speech resource key, and replace `YourServiceRegion` with your Speech resource region.
1. To change the speech synthesis language, replace `en-US-JennyNeural` with another [supported voice](~/articles/cognitive-services/speech-service/supported-languages.md#prebuilt-neural-voices). All neural voices are multilingual and fluent in their own language and English. For example, if the input text in English is "I'm excited to try text to speech" and you set `es-ES-ElviraNeural`, the text is spoken in English with a Spanish accent. If the voice does not speak the language of the input text, the Speech service won't output synthesized audio.

Run your new console application to start speech synthesis to the default speaker.

```console
java SpeechSynthesis
```

Enter some text that you want to speak. For example, type "I'm excited to try text to speech." Press the Enter key to hear the synthesized speech. 

```console
Enter some text that you want to speak >
I'm excited to try text to speech
```

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVA&Pillar=Speech&Product=text-to-speech&Page=quickstart&Section=Synthesize-to-speaker-output" target="_target">I ran into an issue</a>

This quickstart uses the `SpeakTextAsync` operation to synthesize a short block of text that you enter. You can also get text from files as described in these guides:
- For information about speech synthesis from a file, see [How to synthesize speech](~/articles/cognitive-services/speech-service/how-to-speech-synthesis.md) and [Improve synthesis with Speech Synthesis Markup Language (SSML)](~/articles/cognitive-services/speech-service/speech-synthesis-markup.md).
- For information about batch synthesis, see [Synthesize long-form text to speech](~/articles/cognitive-services/speech-service/long-audio-api.md). 

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]

