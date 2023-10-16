---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 08/25/2023
ms.author: eur
---

[!INCLUDE [Header](../../common/objectivec.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment

The Speech SDK for Objective-C is distributed as a framework bundle. The framework supports both Objective-C and Swift on both iOS and macOS.

The Speech SDK can be used in Xcode projects as a [CocoaPod](https://cocoapods.org/), or [downloaded directly](https://aka.ms/csspeech/macosbinary) and linked manually. This guide uses a CocoaPod. Install the CocoaPod dependency manager as described in its [installation instructions](https://guides.cocoapods.org/using/getting-started.html).

### Set environment variables

[!INCLUDE [Environment variables](../../common/environment-variables.md)]

## Synthesize to speaker output

Follow these steps to synthesize speech in a macOS application.

1. Clone the [Azure-Samples/cognitive-services-speech-sdk](https://github.com/Azure-Samples/cognitive-services-speech-sdk) repository to get the [Synthesize audio in Objective-C on macOS using the Speech SDK](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/objectivec/macos/text-to-speech) sample project. The repository also has iOS samples.
1. Open the directory of the downloaded sample app (`helloworld`) in a terminal.
1. Run the command `pod install`. This command generates a `helloworld.xcworkspace` Xcode workspace containing both the sample app and the Speech SDK as a dependency.
1. Open the `helloworld.xcworkspace` workspace in Xcode.
1. Open the file named *AppDelegate.m* and locate the `buttonPressed` method as shown here.

   ```ObjectiveC
   - (void)buttonPressed:(NSButton *)button {
       // Creates an instance of a speech config with specified subscription key and service region.
       NSString *speechKey = [[[NSProcessInfo processInfo] environment] objectForKey:@"SPEECH_KEY"];
       NSString *serviceRegion = [[[NSProcessInfo processInfo] environment] objectForKey:@"SPEECH_REGION"];
        
       SPXSpeechConfiguration *speechConfig = [[SPXSpeechConfiguration alloc] initWithSubscription:speechKey region:serviceRegion];
       speechConfig.speechSynthesisVoiceName = @"en-US-JennyNeural";
       SPXSpeechSynthesizer *speechSynthesizer = [[SPXSpeechSynthesizer alloc] init:speechConfig];

       NSLog(@"Start synthesizing...");
        
       SPXSpeechSynthesisResult *speechResult = [speechSynthesizer speakText:[self.textField stringValue]];
        
       // Checks result.
       if (SPXResultReason_Canceled == speechResult.reason) {
           SPXSpeechSynthesisCancellationDetails *details = [[SPXSpeechSynthesisCancellationDetails alloc] initFromCanceledSynthesisResult:speechResult];
           NSLog(@"Speech synthesis was canceled: %@. Did you set the speech resource key and region values?", details.errorDetails);
       } else if (SPXResultReason_SynthesizingAudioCompleted == speechResult.reason) {
           NSLog(@"Speech synthesis was completed");
       } else {
           NSLog(@"There was an error.");
       }
   }
   ```

1. In *AppDelegate.m*, use the [environment variables that you previously set](#set-environment-variables) for your Speech resource key and region.

   ```ObjectiveC
   NSString *speechKey = [[[NSProcessInfo processInfo] environment] objectForKey:@"SPEECH_KEY"];
   NSString *serviceRegion = [[[NSProcessInfo processInfo] environment] objectForKey:@"SPEECH_REGION"];
   ```

1. Optionally in *AppDelegate.m*, include a speech synthesis voice name as shown here:

   ```ObjectiveC
   speechConfig.speechSynthesisVoiceName = @"en-US-JennyNeural";
   ```

1. To change the speech synthesis language, replace `en-US-JennyNeural` with another [supported voice](~/articles/ai-services/speech-service/language-support.md#prebuilt-neural-voices).

   All neural voices are multilingual and fluent in their own language and English. For example, if the input text in English is "I'm excited to try text to speech" and you set `es-ES-ElviraNeural`, the text is spoken in English with a Spanish accent. If the voice doesn't speak the language of the input text, the Speech service doesn't output synthesized audio.

1. To make the debug output visible, select **View** > **Debug Area** > **Activate Console**.
1. Build and run the example code by selecting **Product** > **Run** from the menu or selecting the **Play** button.

   > [!IMPORTANT]
   > Make sure that you set the `SPEECH_KEY` and `SPEECH_REGION` environment variables as described in [Set environment variables](#set-environment-variables). If you don't set these variables, the sample fails with an error message.

After you input some text and select the button in the app, you should hear the synthesized audio played.

## Remarks

This quickstart uses the `SpeakText` operation to synthesize a short block of text that you enter. You can also get text from files as described in these guides:

- For information about speech synthesis from a file and finer control over voice styles, prosody, and other settings, see [How to synthesize speech](~/articles/ai-services/speech-service/how-to-speech-synthesis.md) and [Speech Synthesis Markup Language (SSML) overview](~/articles/ai-services/speech-service/speech-synthesis-markup.md).
- For information about synthesizing long-form text to speech, see [Batch synthesis API for text to speech](~/articles/ai-services/speech-service/batch-synthesis.md).

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]


