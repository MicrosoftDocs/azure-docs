---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 08/24/2023
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

## Recognize speech from a microphone

Follow these steps to recognize speech in a macOS application.

1. Clone the [Azure-Samples/cognitive-services-speech-sdk](https://github.com/Azure-Samples/cognitive-services-speech-sdk) repository to get the [Recognize speech from a microphone in Objective-C on macOS](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/objectivec/macos/from-microphone) sample project. The repository also has iOS samples.
1. In a console window, navigate to the directory of the downloaded sample app, *helloworld*.
1. Run the command `pod install`. This command generates a `helloworld.xcworkspace` Xcode workspace that contains both the sample app and the Speech SDK as a dependency.
1. Open the `helloworld.xcworkspace` workspace in Xcode.
1. Open the file named *AppDelegate.m* and locate the `buttonPressed` method as shown here.

   ```objc
   - (void)buttonPressed:(NSButton *)button {
       // Creates an instance of a speech config with specified subscription key and service region.
       NSString *speechKey = [[[NSProcessInfo processInfo] environment] objectForKey:@"SPEECH_KEY"];
       NSString *serviceRegion = [[[NSProcessInfo processInfo] environment] objectForKey:@"SPEECH_REGION"];
    
       SPXAudioConfiguration *audioConfig = [[SPXAudioConfiguration alloc] initWithMicrophone:nil];
       SPXSpeechConfiguration *speechConfig = [[SPXSpeechConfiguration alloc] initWithSubscription:speechKey region:serviceRegion];
       SPXSpeechRecognizer *speechRecognizer = [[SPXSpeechRecognizer alloc] initWithSpeechConfiguration:speechConfig language:@"en-US" audioConfiguration:audioConfig];

       NSLog(@"Speak into your microphone.");
    
       SPXSpeechRecognitionResult *speechResult = [speechRecognizer recognizeOnce];
    
       // Checks result.
       if (SPXResultReason_Canceled == speechResult.reason) {
           SPXCancellationDetails *details = [[SPXCancellationDetails alloc] initFromCanceledRecognitionResult:speechResult];
           NSLog(@"Speech recognition was canceled: %@. Did you set the speech resource key and region values?", details.errorDetails);
           [self.label setStringValue:([NSString stringWithFormat:@"Canceled: %@", details.errorDetails])];
       } else if (SPXResultReason_RecognizedSpeech == speechResult.reason) {
           NSLog(@"Speech recognition result received: %@", speechResult.text);
           [self.label setStringValue:(speechResult.text)];
       } else {
           NSLog(@"There was an error.");
           [self.label setStringValue:(@"Speech Recognition Error")];
       }
   }
   ```

1. In *AppDelegate.m*, use the [environment variables that you previously set](#set-environment-variables) for your Speech resource key and region.

   ```ObjectiveC
   NSString *speechKey = [[[NSProcessInfo processInfo] environment] objectForKey:@"SPEECH_KEY"];
   NSString *serviceRegion = [[[NSProcessInfo processInfo] environment] objectForKey:@"SPEECH_REGION"];
   ```

1. To change the speech recognition language, replace `en-US` with another [supported language](~/articles/ai-services/speech-service/language-support.md). For example, use `es-ES` for Spanish (Spain). If you don't specify a language, the default is `en-US`. For details about how to identify one of multiple languages that might be spoken, see [Language identification](~/articles/ai-services/speech-service/language-identification.md).
1. To make the debug output visible, select **View** > **Debug Area** > **Activate Console**.
1. Build and run the example code by selecting **Product** > **Run** from the menu or selecting the **Play** button.

  > [!IMPORTANT]
  > Make sure that you set the `SPEECH_KEY` and `SPEECH_REGION` environment variables as described in [Set environment variables](#set-environment-variables). If you don't set these variables, the sample fails with an error message.

After you select the button in the app and say a few words, you should see the text you have spoken on the lower part of the screen. When you run the app for the first time, you should be prompted to give the app access to your computer's microphone.

## Remarks

Here are some other considerations:

- This example uses the `recognizeOnce` operation to transcribe utterances of up to 30 seconds, or until silence is detected. For information about continuous recognition for longer audio, including multi-lingual conversations, see [How to recognize speech](~/articles/ai-services/speech-service/how-to-recognize-speech.md).
- To recognize speech from an audio file, use `initWithWavFileInput` instead of `initWithMicrophone`:

  ```objc
  SPXAudioConfiguration *audioConfig = [[SPXAudioConfiguration alloc] initWithWavFileInput:YourAudioFile];
  ```

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
