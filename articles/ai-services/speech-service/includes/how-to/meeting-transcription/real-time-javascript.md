---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 01/24/2022
ms.author: eur
---

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment

Before you can do anything, you need to install the Speech SDK for JavaScript. If you just want the package name to install, run `npm install microsoft-cognitiveservices-speech-sdk`. For guided installation instructions, see the [SDK installation guide](../../../quickstarts/setup-platform.md?pivots=programming-language-javascript).

## Create voice signatures

If you want to enroll user profiles, the first step is to create voice signatures for the meeting participants so that they can be identified as unique speakers. This isn't required if you don't want to use pre-enrolled user profiles to identify specific participants.

The input `.wav` audio file for creating voice signatures must be 16-bit, 16-kHz sample rate, in single channel (mono) format. The recommended length for each audio sample is between 30 seconds and two minutes. An audio sample that is too short results in reduced accuracy when recognizing the speaker. The `.wav` file should be a sample of one person's voice so that a unique voice profile is created.

The following example shows how to create a voice signature by [using the REST API](https://aka.ms/cts/signaturegenservice) in JavaScript. You must insert your `subscriptionKey`, `region`, and the path to a sample `.wav` file.

```javascript
const fs = require('fs');
const axios = require('axios');
const formData = require('form-data');
 
const subscriptionKey = 'your-subscription-key';
const region = 'your-region';
 
async function createProfile() {
    let form = new formData();
    form.append('file', fs.createReadStream('path-to-voice-sample.wav'));
    let headers = form.getHeaders();
    headers['Ocp-Apim-Subscription-Key'] = subscriptionKey;
 
    let url = `https://signature.${region}.cts.speech.microsoft.com/api/v1/Signature/GenerateVoiceSignatureFromFormData`;
    let response = await axios.post(url, form, { headers: headers });
    
    // get signature from response, serialize to json string
    return JSON.stringify(response.data.Signature);
}
 
async function main() {
    // use this voiceSignature string with meeting transcription calls below
    let voiceSignatureString = await createProfile();
    console.log(voiceSignatureString);
}
main();
```

Running this script returns a voice signature string in the variable `voiceSignatureString`. Run the function twice so you have two strings to use as input to the variables `voiceSignatureStringUser1` and `voiceSignatureStringUser2` below.

> [!NOTE]
> Voice signatures can **only** be created using the REST API.

## Transcribe meetings

The following sample code demonstrates how to transcribe meetings in real-time for two speakers. It assumes you've already created voice signature strings for each speaker as shown above. Substitute real information for `subscriptionKey`, `region`, and the path `filepath` for the audio you want to transcribe.

If you don't use pre-enrolled user profiles, it takes a few more seconds to complete the first recognition of unknown users as speaker1, speaker2, etc.

> [!NOTE]
> Make sure the same `subscriptionKey` is used across your application for signature creation, or you will encounter errors. 

This sample code does the following:

* Creates a push stream to use for transcription, and writes the sample `.wav` file to it.
* Creates a `Meeting` using `createMeetingAsync()`.
* Creates a `MeetingTranscriber` using the constructor.
* Adds participants to the meeting. The strings `voiceSignatureStringUser1` and `voiceSignatureStringUser2` should come as output from the steps above.
* Registers to events and begins transcription.
* If you want to differentiate speakers without providing voice samples, please enable `DifferentiateGuestSpeakers` feature as in [Meeting Transcription Overview](../../../meeting-transcription.md). 

If speaker identification or differentiate is enabled, then even if you have already received `transcribed` results, the service is still evaluating them by accumulated audio information. If the service finds that any previous result was assigned an incorrect `speakerId`, then a nearly identical `Transcribed` result is sent again, where only the `speakerId` and `UtteranceId` are different. Since the `UtteranceId` format is `{index}_{speakerId}_{Offset}`, when you receive a `transcribed` result, you could use `UtteranceId` to determine if the current `transcribed` result is going to correct a previous one. Your client or UI logic could decide behaviors, like overwriting previous output, or to ignore the latest result.

```javascript
(function() {
    "use strict";
    var sdk = require("microsoft-cognitiveservices-speech-sdk");
    var fs = require("fs");
    
    var subscriptionKey = "your-subscription-key";
    var region = "your-region";
    var filepath = "audio-file-to-transcribe.wav"; // 8-channel audio
    
    var speechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription(subscriptionKey, region);
    var audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync(filepath));
    speechTranslationConfig.setProperty("MeetingTranscriptionInRoomAndOnline", "true");

    // en-us by default. Adding this code to specify other languages, like zh-cn.
    speechTranslationConfig.speechRecognitionLanguage = "en-US";
    
    // create meeting and transcriber
    var meeting = sdk.Meeting.createMeetingAsync(speechTranslationConfig, "myMeeting");
    var transcriber = new sdk.MeetingTranscriber(audioConfig);
    
    // attach the transcriber to the meeting
    transcriber.joinMeetingAsync(meeting,
    function () {
        // add first participant using voiceSignature created in enrollment step
        var user1 = sdk.Participant.From("user1@example.com", "en-us", voiceSignatureStringUser1);
        meeting.addParticipantAsync(user1,
        function () {
            // add second participant using voiceSignature created in enrollment step
            var user2 = sdk.Participant.From("user2@example.com", "en-us", voiceSignatureStringUser2);
            meeting.addParticipantAsync(user2,
            function () {
                transcriber.sessionStarted = function(s, e) {
                console.log("(sessionStarted)");
                };
                transcriber.sessionStopped = function(s, e) {
                console.log("(sessionStopped)");
                };
                transcriber.canceled = function(s, e) {
                console.log("(canceled)");
                };
                transcriber.transcribed = function(s, e) {
                console.log("(transcribed) text: " + e.result.text);
                console.log("(transcribed) speakerId: " + e.result.speakerId);
                };
    
                // begin meeting transcription
                transcriber.startTranscribingAsync(
                function () { },
                function (err) {
                    console.trace("err - starting transcription: " + err);
                });
        },
        function (err) {
            console.trace("err - adding user1: " + err);
        });
    },
    function (err) {
        console.trace("err - adding user2: " + err);
    });
    },
    function (err) {
    console.trace("err - " + err);
    });
}()); 
```

See more samples on GitHub:
- [ROOBO device sample code](https://github.com/Azure-Samples/Cognitive-Services-Speech-Devices-SDK/blob/master/Samples/Java/Android/Speech%20Devices%20SDK%20Starter%20App/example/app/src/main/java/com/microsoft/cognitiveservices/speech/samples/sdsdkstarterapp/MeetingTranscription.java)
- [Azure Kinect Dev Kit sample code](https://github.com/Azure-Samples/Cognitive-Services-Speech-Devices-SDK/blob/master/Samples/Java/Windows_Linux/SampleDemo/src/com/microsoft/cognitiveservices/speech/samples/Cts.java)