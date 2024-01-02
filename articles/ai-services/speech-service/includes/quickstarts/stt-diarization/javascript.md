---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 02/12/2022
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

## Diarization from file with conversation transcription

Follow these steps to create a new console application for conversation transcription.

1. Open a command prompt where you want the new project, and create a new file named `ConversationTranscription.js`.
1. Install the Speech SDK for JavaScript:
    ```console
    npm install microsoft-cognitiveservices-speech-sdk
    ```
1. Copy the following code into `ConversationTranscription.js`:

    ```javascript
    const fs = require("fs");
    const sdk = require("microsoft-cognitiveservices-speech-sdk");

    // This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
    const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);

    function fromFile() {
        const filename = "katiesteve.wav";

        let audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync(filename));
        let conversationTranscriber = new sdk.ConversationTranscriber(speechConfig, audioConfig);

        var pushStream = sdk.AudioInputStream.createPushStream();
        
        fs.createReadStream(filename).on('data', function(arrayBuffer) {
            pushStream.write(arrayBuffer.slice());
        }).on('end', function() {
            pushStream.close();
        });
        
        console.log("Transcribing from: " + filename);
    
        conversationTranscriber.sessionStarted = function(s, e) {
            console.log("SessionStarted event");
            console.log("SessionId:" + e.sessionId);
        };
        conversationTranscriber.sessionStopped = function(s, e) {
            console.log("SessionStopped event");
            console.log("SessionId:" + e.sessionId);
            conversationTranscriber.stopTranscribingAsync();
        };
        conversationTranscriber.canceled = function(s, e) {
            console.log("Canceled event");
            console.log(e.errorDetails);
            conversationTranscriber.stopTranscribingAsync();
        };
        conversationTranscriber.transcribed = function(s, e) {
            console.log("TRANSCRIBED: Text=" + e.result.text + " Speaker ID=" + e.result.speakerId);
        };
        
        // Start conversation transcription
        conversationTranscriber.startTranscribingAsync(
            function () {},
            function (err) {
                console.trace("err - starting transcription: " + err);
            }
        );

    }
    fromFile();
    ```

1. Replace `katiesteve.wav` with the filepath and filename of your `.wav` file. The intent of this quickstart is to recognize speech from multiple participants in the conversation. Your audio file should contain multiple speakers. For example, you can use the [sample audio file](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/sampledata/audiofiles/katiesteve.wav) provided in the Speech SDK samples repository on GitHub.
    > [!NOTE]
    > The service performs best with at least 7 seconds of continuous audio from a single speaker. This allows the system to differentiate the speakers properly. Otherwise the Speaker ID is returned as `Unknown`.
1. To change the speech recognition language, replace `en-US` with another [supported language](~/articles/cognitive-services/speech-service/supported-languages.md). For example, `es-ES` for Spanish (Spain). The default language is `en-US` if you don't specify a language. For details about how to identify one of multiple languages that might be spoken, see [language identification](~/articles/cognitive-services/speech-service/language-identification.md). 

Run your new console application to start speech recognition from a file:

```console
node.exe ConversationTranscription.js
```

> [!IMPORTANT]
> Make sure that you set the `SPEECH_KEY` and `SPEECH_REGION` environment variables as described [above](#set-environment-variables). If you don't set these variables, the sample will fail with an error message.

The transcribed conversation should be output as text: 

```console
SessionStarted event
SessionId:E87AFBA483C2481985F6C9AF719F616B
TRANSCRIBED: Text=Good morning, Steve. Speaker ID=Unknown
TRANSCRIBED: Text=Good morning, Katie. Speaker ID=Unknown
TRANSCRIBED: Text=Have you tried the latest real time diarization in Microsoft Speech Service which can tell you who said what in real time? Speaker ID=Guest-1
TRANSCRIBED: Text=Not yet. I've been using the batch transcription with diarization functionality, but it produces diarization result until whole audio get processed. Speaker ID=Guest-2
TRANSCRIBED: Text=Is the new feature can diarize in real time? Speaker ID=Guest-2
TRANSCRIBED: Text=Absolutely. Speaker ID=Guest-1
TRANSCRIBED: Text=That's exciting. Let me try it right now. Speaker ID=Guest-2
Canceled event
undefined
SessionStopped event
SessionId:E87AFBA483C2481985F6C9AF719F616B
```

Speakers are identified as Guest-1, Guest-2, and so on, depending on the number of speakers in the conversation.

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]

