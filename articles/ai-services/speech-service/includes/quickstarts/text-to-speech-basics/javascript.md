---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 2/1/2024
ms.author: eur
---

[!INCLUDE [Header](../../common/javascript.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment

To set up your environment, install the Speech SDK for JavaScript. If you just want the package name to install, run `npm install microsoft-cognitiveservices-speech-sdk`. For guided installation instructions, see the [Install the Speech SDK](../../../quickstarts/setup-platform.md?pivots=programming-language-javascript).

### Set environment variables

[!INCLUDE [Environment variables](../../common/environment-variables.md)]

## Synthesize to file output

Follow these steps to create a Node.js console application for speech synthesis.

1. Open a console window where you want the new project, and create a file named *SpeechSynthesis.js*.
1. Install the Speech SDK for JavaScript:

   ```console
   npm install microsoft-cognitiveservices-speech-sdk
   ```

1. Copy the following code into *SpeechSynthesis.js*:

   ```javascript
   (function() {

       "use strict";
       
       var sdk = require("microsoft-cognitiveservices-speech-sdk");
       var readline = require("readline");
        
       var audioFile = "YourAudioFile.wav";
       // This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
       const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);
       const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile);
        
       // The language of the voice that speaks.
       speechConfig.speechSynthesisVoiceName = "en-US-AvaMultilingualNeural"; 
        
       // Create the speech synthesizer.
       var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
      
       var rl = readline.createInterface({
         input: process.stdin,
         output: process.stdout
       });
      
       rl.question("Enter some text that you want to speak >\n> ", function (text) {
         rl.close();
         // Start the synthesizer and wait for a result.
         synthesizer.speakTextAsync(text,
             function (result) {
           if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
             console.log("synthesis finished.");
           } else {
             console.error("Speech synthesis canceled, " + result.errorDetails +
                 "\nDid you set the speech resource key and region values?");
           }
           synthesizer.close();
           synthesizer = null;
         },
             function (err) {
           console.trace("err - " + err);
           synthesizer.close();
           synthesizer = null;
         });
         console.log("Now synthesizing to: " + audioFile);
       });
   }());
   ```

1. In *SpeechSynthesis.js*, optionally you can rename *YourAudioFile.wav* to another output file name.

1. To change the speech synthesis language, replace `en-US-AvaMultilingualNeural` with another [supported voice](~/articles/ai-services/speech-service/language-support.md#prebuilt-neural-voices).

   All neural voices are multilingual and fluent in their own language and English. For example, if the input text in English is "I'm excited to try text to speech" and you set `es-ES-ElviraNeural`, the text is spoken in English with a Spanish accent. If the voice doesn't speak the language of the input text, the Speech service doesn't output synthesized audio.

1. Run your console application to start speech synthesis to a file:

   ```console
   node SpeechSynthesis.js
   ```

   > [!IMPORTANT]
   > Make sure that you set the `SPEECH_KEY` and `SPEECH_REGION` [environment variables](#set-environment-variables). If you don't set these variables, the sample fails with an error message.

1. The provided text should be in an audio file:

   ```output
   Enter some text that you want to speak >
   > I'm excited to try text to speech
   Now synthesizing to: YourAudioFile.wav
   synthesis finished.
   ```

## Remarks

### More speech synthesis options

This quickstart uses the `SpeakTextAsync` operation to synthesize a short block of text that you enter. You can also use long-form text from a file and get finer control over voice styles, prosody, and other settings.

- See [how to synthesize speech](~/articles/ai-services/speech-service/how-to-speech-synthesis.md) and [Speech Synthesis Markup Language (SSML) overview](~/articles/ai-services/speech-service/speech-synthesis-markup.md) for information about speech synthesis from a file and finer control over voice styles, prosody, and other settings.
- See [batch synthesis API for text to speech](~/articles/ai-services/speech-service/batch-synthesis.md) for information about synthesizing long-form text to speech.

### OpenAI text to speech voices in Azure AI Speech

OpenAI text to speech voices are also supported. See [OpenAI text to speech voices in Azure AI Speech](../../../openai-voices.md) and [multilingual voices](../../../language-support.md?tabs=tts#multilingual-voices). You can replace `en-US-AvaMultilingualNeural` with a supported OpenAI voice name such as `en-US-FableMultilingualNeural`.

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
