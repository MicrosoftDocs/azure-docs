---
author: erhopf
ms.service: cognitive-services
ms.topic: include
ms.date: 04/04/2020
ms.author: erhopf
---

## Prerequisites

> [!div class="checklist"]
> * [Create an Azure Speech Resource](../../../../get-started.md)
> * [Setup your development environment and create an empty project](../../../../quickstarts/setup-platform.md?tabs=jre&pivots=programming-language-java)

## Add sample code

1. To add a new empty class to your Java project, select **File** > **New** > **Class**.

1. In the **New Java Class** window, enter **speechsdk.quickstart** into the **Package** field, and **Main** into the **Name** field.

   ![Screenshot of New Java Class window](~/articles/cognitive-services/Speech-Service/media/sdk/qs-java-jre-06-create-main-java.png)

1. Replace all code in `Main.java` with the following snippet:

   ```Java
   package speechsdk.quickstart;

   import java.util.concurrent.Future;
   import com.microsoft.cognitiveservices.speech.*;

   /**
    * Quickstart: recognize speech using the Speech SDK for Java.
    */
   public class Main {

       /**
        * @param args Arguments are ignored in this sample.
        */
       public static void main(String[] args) {
           try {
               // Replace below with your own subscription key
               String speechSubscriptionKey = "YourSubscriptionKey";

               // Replace below with your own region identifier from here: https://aka.ms/speech/sdkregion
               String serviceRegion = "YourServiceRegion";

               // Replace below with your own filename.
               String audioFileName = "helloworld.wav";

               // Replace below with your own filename.
               String text = "Hello world!";

               int exitCode = 1;
               SpeechConfig config = SpeechConfig.fromSubscription(speechSubscriptionKey, serviceRegion);
               assert(config != null);

               AudioConfig audioOutput = AudioConfig.fromWavFileInput(audioFileName);
               assert(audioOutput != null);

               SpeechSynthesizer synth = new SpeechSynthesizer(config, audioOutput);
               assert(synth != null);

               Future<SpeechSynthesisResult> task = synth.SpeakTextAsync(text);
               assert(task != null);

               SpeechSynthesisResult result = task.get();
               assert(result != null);

               if (result.getReason() == ResultReason.SynthesizingAudioCompleted) {
                   System.out.println("Speech synthesized to [" + audioFilename + "] for text [" + text + "]");
                   exitCode = 0;
               }
               else if (result.getReason() == ResultReason.Canceled) {
                   SpeechSynthesisCancellationDetails cancellation = SpeechSynthesisCancellationDetails.fromResult(result);
                   System.out.println("CANCELED: Reason=" + cancellation.getReason());

                   if (cancellation.getReason() == CancellationReason.Error) {
                       System.out.println("CANCELED: ErrorCode=" + cancellation.getErrorCode());
                       System.out.println("CANCELED: ErrorDetails=" + cancellation.getErrorDetails());
                       System.out.println("CANCELED: Did you update the subscription info?");
                   }
               }

               result.close();
               synth.close();

               System.exit(exitCode);
           } catch (Exception ex) {
               System.out.println("Unexpected exception: " + ex.getMessage());

               assert(false);
               System.exit(1);
           }
       }
   }
   ```

1. Replace the string `YourSubscriptionKey` with your subscription key.

1. Replace the string `YourServiceRegion` with the [region](~/articles/cognitive-services/Speech-Service/regions.md) associated with your subscription (for example, `westus` for the free trial subscription).

1. Replace the string `helloworld.wav` with your own filename.

1. Replace the string `Hello world!` with your own text.

1. Save changes to the project.

## Build and run the app

Press F11, or select **Run** > **Debug**.
Your text is converted to speech, and saved in the audio data specified.

   ```text
   Speech synthesized to [helloworld.wav] for text [Hello world!]
   ```

## Next steps

[!INCLUDE [Speech synthesis basics](../../text-to-speech-next-steps.md)]

## See also

- [Create a Custom Voice](~/articles/cognitive-services/Speech-Service/how-to-custom-voice-create-voice.md)
- [Record custom voice samples](~/articles/cognitive-services/Speech-Service/record-custom-voice-samples.md)
