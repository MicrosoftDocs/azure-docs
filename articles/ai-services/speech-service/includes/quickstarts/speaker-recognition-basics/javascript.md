---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 01/08/2022
author: eur
ms.custom: references_regions, ignite-fall-2021
---

[!INCLUDE [Header](../../common/javascript.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

### Install the Speech SDK

Before you start, you must install the [Speech SDK for JavaScript](~/articles/ai-services/speech-service/quickstarts/setup-platform.md).

Depending on the target environment, use one of the following:

# [script](#tab/script)

Download and extract the <a href="https://aka.ms/csspeech/jsbrowserpackage" target="_blank">Speech SDK for JavaScript </a> *microsoft.cognitiveservices.speech.sdk.bundle.js* file. Place it in a folder accessible to your HTML file.

```html
<script src="microsoft.cognitiveservices.speech.sdk.bundle.js"></script>;
```

> [!TIP]
> If you're targeting a web browser and using the `<script>` tag, the `sdk` prefix isn't needed. The `sdk` prefix is an alias used to name the `require` module.

# [import](#tab/import)

```javascript
import * from "microsoft-cognitiveservices-speech-sdk";
```

For more information on `import`, see <a href="https://javascript.info/import-export" target="_blank">Export and import</a>.

# [require](#tab/require)

```javascript
const sdk = require("microsoft-cognitiveservices-speech-sdk");
```

---

### Import dependencies

To run the examples in this article, add the following statements at the top of your .js file:

```javascript
"use strict";

/* To run this sample, install:
npm install microsoft-cognitiveservices-speech-sdk
*/
var sdk = require("microsoft-cognitiveservices-speech-sdk");
var fs = require("fs");

// Note: Change the locale if desired.
const profile_locale = "en-us";

/* Note: passphrase_files and verify_file should contain paths to audio files that contain \"My voice is my passport, verify me.\"
You can obtain these files from:
https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/fa6428a0837779cbeae172688e0286625e340942/quickstart/javascript/node/speaker-recognition/verification
*/ 
const passphrase_files = ["myVoiceIsMyPassportVerifyMe01.wav", "myVoiceIsMyPassportVerifyMe02.wav", "myVoiceIsMyPassportVerifyMe03.wav"];
const verify_file = "myVoiceIsMyPassportVerifyMe04.wav";
/* Note: identify_file should contain a path to an audio file that uses the same voice as the other files, but contains different speech. You can obtain this file from:
https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/fa6428a0837779cbeae172688e0286625e340942/quickstart/javascript/node/speaker-recognition/identification
*/
const identify_file = "aboutSpeechSdk.wav";

var subscription_key = 'PASTE_YOUR_SPEECH_SUBSCRIPTION_KEY_HERE';
var region = 'PASTE_YOUR_SPEECH_ENDPOINT_REGION_HERE';

const ticks_per_second = 10000000;
```

These statements import the required libraries and get your Speech service subscription key and region from your environment variables. They also specify paths to audio files that you'll use in the following tasks.

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../use-key-vault.md). See the Azure AI services [security](../../../../security-features.md) article for more information.

## Create a helper function

Add the following helper function to read audio files into streams for use by the Speech service:

```javascript
function GetAudioConfigFromFile (file)
{
    return sdk.AudioConfig.fromWavFileInput(fs.readFileSync(file));
}
```

In this function, you use the [AudioInputStream.createPushStream](/javascript/api/microsoft-cognitiveservices-speech-sdk/audioinputstream#createpushstream-audiostreamformat-) and [AudioConfig.fromStreamInput](/javascript/api/microsoft-cognitiveservices-speech-sdk/audioconfig#fromstreaminput-audioinputstream---pullaudioinputstreamcallback-) methods to create an [AudioConfig](/javascript/api/microsoft-cognitiveservices-speech-sdk/audioconfig) object. This `AudioConfig` object represents an audio stream. You'll use several of these `AudioConfig` objects during the following tasks.

## Text-dependent verification

Speaker verification is the act of confirming that a speaker matches a known, or *enrolled*, voice. The first step is to enroll a voice profile so that the service has something to compare future voice samples against. In this example, you enroll the profile by using a *text-dependent* strategy, which requires a specific passphrase to use for enrollment and verification. See the [reference docs](/rest/api/speakerrecognition/) for a list of supported passphrases.

### TextDependentVerification function

Start by creating the `TextDependentVerification` function.

```javascript
async function TextDependentVerification(client, speech_config)
{
    console.log ("Text Dependent Verification:\n");
    var profile = null;
    try {
        const type = sdk.VoiceProfileType.TextDependentVerification;
        // Create the profile.
        profile = await client.createProfileAsync(type, profile_locale);
        console.log ("Created profile ID: " + profile.profileId);
        // Get the activation phrases
        await GetActivationPhrases(type, profile_locale);
        await AddEnrollmentsToTextDependentProfile(client, profile, passphrase_files);
        const audio_config = GetAudioConfigFromFile(verify_file);
        const recognizer = new sdk.SpeakerRecognizer(speech_config, audio_config);
        await SpeakerVerify(profile, recognizer);
    }
    catch (error) {
        console.log ("Error:\n" + error);
    }
    finally {
        if (profile !== null) {
            console.log ("Deleting profile ID: " + profile.profileId);
            const deleteResult = await client.deleteProfileAsync (profile);
        }
    }
}
```

This function creates a [VoiceProfile](/javascript/api/microsoft-cognitiveservices-speech-sdk/voiceprofile) object with the [VoiceProfileClient.createProfileAsync](/javascript/api/microsoft-cognitiveservices-speech-sdk/voiceprofileclient#createprofileasync-voiceprofiletype--string---e--voiceprofile-----void---e--string-----void-) method. There are three [types](/javascript/api/microsoft-cognitiveservices-speech-sdk/voiceprofiletype) of `VoiceProfile`:

- TextIndependentIdentification
- TextDependentVerification
- TextIndependentVerification

In this case, you pass `VoiceProfileType.TextDependentVerification` to `VoiceProfileClient.createProfileAsync`.

You then call two helper functions that you'll define next, `AddEnrollmentsToTextDependentProfile` and `SpeakerVerify`. Finally, call [VoiceProfileClient.deleteProfileAsync](/javascript/api/microsoft-cognitiveservices-speech-sdk/voiceprofileclient#deleteprofileasync-voiceprofile---response--voiceprofileresult-----void---e--string-----void-) to remove the profile.

### AddEnrollmentsToTextDependentProfile function

Define the following function to enroll a voice profile:

```javascript
async function AddEnrollmentsToTextDependentProfile(client, profile, audio_files)
{
    try {
        for (const file of audio_files) {
            console.log ("Adding enrollment to text dependent profile...");
            const audio_config = GetAudioConfigFromFile(file);
            const result = await client.enrollProfileAsync(profile, audio_config);
            if (result.reason === sdk.ResultReason.Canceled) {
                throw(JSON.stringify(sdk.VoiceProfileEnrollmentCancellationDetails.fromResult(result)));
            }
            else {
                console.log ("Remaining enrollments needed: " + result.privDetails["remainingEnrollmentsCount"] + ".");
            }
        };
        console.log ("Enrollment completed.\n");
    } catch (error) {
        console.log ("Error adding enrollments: " + error);
    }
}
```

In this function, you call the `GetAudioConfigFromFile` function you defined earlier to create `AudioConfig` objects from audio samples. These audio samples contain a passphrase, such as "My voice is my passport, verify me." You then enroll these audio samples by using the [VoiceProfileClient.enrollProfileAsync](/javascript/api/microsoft-cognitiveservices-speech-sdk/voiceprofileclient#enrollprofileasync-voiceprofile--audioconfig---e--voiceprofileenrollmentresult-----void---e--string-----void-) method.

### SpeakerVerify function

Define `SpeakerVerify` as follows:

```javascript
async function SpeakerVerify(profile, recognizer)
{
    try {
        const model = sdk.SpeakerVerificationModel.fromProfile(profile);
        const result = await recognizer.recognizeOnceAsync(model);
        console.log ("Verified voice profile for speaker: " + result.profileId + ". Score is: " + result.score + ".\n");
    } catch (error) {
        console.log ("Error verifying speaker: " + error);
    }
}
```

In this function, you create a [SpeakerVerificationModel](/javascript/api/microsoft-cognitiveservices-speech-sdk/speakerverificationmodel) object with the [SpeakerVerificationModel.FromProfile](/javascript/api/microsoft-cognitiveservices-speech-sdk/speakerverificationmodel#fromprofile-voiceprofile-) method, passing in the [VoiceProfile](/javascript/api/microsoft-cognitiveservices-speech-sdk/voiceprofile) object you created earlier.

Next, you call the [SpeechRecognizer.recognizeOnceAsync](/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognizer#recognizeonceasync--e--speechrecognitionresult-----void---e--string-----void-) method to validate an audio sample that contains the same passphrase as the audio samples you enrolled previously. `SpeechRecognizer.recognizeOnceAsync` returns a [SpeakerRecognitionResult](/javascript/api/microsoft-cognitiveservices-speech-sdk/speakerrecognitionresult) object, whose `score` property contains a similarity score that ranges from 0.0 to 1.0. The `SpeakerRecognitionResult` object also contains a `reason` property of type [ResultReason](/javascript/api/microsoft-cognitiveservices-speech-sdk/resultreason). If the verification was successful, the `reason` property should have the value `RecognizedSpeaker`.

## Text-independent verification

In contrast to *text-dependent* verification, *text-independent* verification:

* Doesn't require a certain passphrase to be spoken. Anything can be spoken.
* Doesn't require three audio samples but *does* require 20 seconds of total audio.

### TextIndependentVerification function

Start by creating the `TextIndependentVerification` function.

```javascript
async function TextIndependentVerification(client, speech_config)
{
    console.log ("Text Independent Verification:\n");
    var profile = null;
    try {
        const type = sdk.VoiceProfileType.TextIndependentVerification;
        // Create the profile.
        profile = await client.createProfileAsync(type, profile_locale);
        console.log ("Created profile ID: " + profile.profileId);
        // Get the activation phrases
        await GetActivationPhrases(type, profile_locale);
        await AddEnrollmentsToTextIndependentProfile(client, profile, [identify_file]);
        const audio_config = GetAudioConfigFromFile(passphrase_files[0]);
        const recognizer = new sdk.SpeakerRecognizer(speech_config, audio_config);
        await SpeakerVerify(profile, recognizer);
    }
    catch (error) {
        console.log ("Error:\n" + error);
    }
    finally {
        if (profile !== null) {
            console.log ("Deleting profile ID: " + profile.profileId);
            const deleteResult = await client.deleteProfileAsync (profile);
        }
    }
}
```

Like the `TextDependentVerification` function, this function creates a [VoiceProfile](/javascript/api/microsoft-cognitiveservices-speech-sdk/voiceprofile) object with the [VoiceProfileClient.createProfileAsync](/javascript/api/microsoft-cognitiveservices-speech-sdk/voiceprofileclient#createprofileasync-voiceprofiletype--string---e--voiceprofile-----void---e--string-----void-) method.

In this case, you pass `VoiceProfileType.TextIndependentVerification` to `createProfileAsync`.

You then call two helper functions: `AddEnrollmentsToTextIndependentProfile`, which you'll define next, and `SpeakerVerify`, which you defined already. Finally, call [VoiceProfileClient.deleteProfileAsync](/javascript/api/microsoft-cognitiveservices-speech-sdk/voiceprofileclient#deleteprofileasync-voiceprofile---response--voiceprofileresult-----void---e--string-----void-) to remove the profile.

### AddEnrollmentsToTextIndependentProfile

Define the following function to enroll a voice profile:

```javascript
async function AddEnrollmentsToTextIndependentProfile(client, profile, audio_files)
{
    try {
        for (const file of audio_files) {
            console.log ("Adding enrollment to text independent profile...");
            const audio_config = GetAudioConfigFromFile(file);
            const result = await client.enrollProfileAsync (profile, audio_config);
            if (result.reason === sdk.ResultReason.Canceled) {
                throw(JSON.stringify(sdk.VoiceProfileEnrollmentCancellationDetails.fromResult(result)));
            }
            else {
                console.log ("Remaining audio time needed: " + (result.privDetails["remainingEnrollmentsSpeechLength"] / ticks_per_second) + " seconds.");
            }
        }
        console.log ("Enrollment completed.\n");
    } catch (error) {
        console.log ("Error adding enrollments: " + error);
    }
}
```

In this function, you call the `GetAudioConfigFromFile` function you defined earlier to create `AudioConfig` objects from audio samples. You then enroll these audio samples by using the [VoiceProfileClient.enrollProfileAsync](/javascript/api/microsoft-cognitiveservices-speech-sdk/voiceprofileclient#enrollprofileasync-voiceprofile--audioconfig---e--voiceprofileenrollmentresult-----void---e--string-----void-) method.

## Speaker identification

Speaker identification is used to determine *who* is speaking from a given group of enrolled voices. The process is similar to *text-independent verification*. The main difference is the capability to verify against multiple voice profiles at once rather than verifying against a single profile.

### TextIndependentIdentification function

Start by creating the `TextIndependentIdentification` function.

```javascript
async function TextIndependentIdentification(client, speech_config)
{
    console.log ("Text Independent Identification:\n");
    var profile = null;
    try {
        const type = sdk.VoiceProfileType.TextIndependentIdentification;
        // Create the profile.
        profile = await client.createProfileAsync(type, profile_locale);
        console.log ("Created profile ID: " + profile.profileId);
        // Get the activation phrases
        await GetActivationPhrases(type, profile_locale);
        await AddEnrollmentsToTextIndependentProfile(client, profile, [identify_file]);
        const audio_config = GetAudioConfigFromFile(passphrase_files[0]);
        const recognizer = new sdk.SpeakerRecognizer(speech_config, audio_config);
        await SpeakerIdentify(profile, recognizer);
    }
    catch (error) {
        console.log ("Error:\n" + error);
    }
    finally {
        if (profile !== null) {
            console.log ("Deleting profile ID: " + profile.profileId);
            const deleteResult = await client.deleteProfileAsync (profile);
        }
    }
}
```

Like the `TextDependentVerification` and `TextIndependentVerification` functions, this function creates a [VoiceProfile](/javascript/api/microsoft-cognitiveservices-speech-sdk/voiceprofile) object with the [VoiceProfileClient.createProfileAsync](/javascript/api/microsoft-cognitiveservices-speech-sdk/voiceprofileclient#createprofileasync-voiceprofiletype--string---e--voiceprofile-----void---e--string-----void-) method.

In this case, you pass `VoiceProfileType.TextIndependentIdentification` to `VoiceProfileClient.createProfileAsync`.

You then call two helper functions: `AddEnrollmentsToTextIndependentProfile`, which you defined already, and `SpeakerIdentify`, which you'll define next. Finally, call [VoiceProfileClient.deleteProfileAsync](/javascript/api/microsoft-cognitiveservices-speech-sdk/voiceprofileclient#deleteprofileasync-voiceprofile---response--voiceprofileresult-----void---e--string-----void-) to remove the profile.

### SpeakerIdentify function

Define the `SpeakerIdentify` function as follows:

```javascript
async function SpeakerIdentify(profile, recognizer)
{
    try {
        const model = sdk.SpeakerIdentificationModel.fromProfiles([profile]);
        const result = await recognizer.recognizeOnceAsync(model);
        console.log ("The most similar voice profile is: " + result.profileId + " with similarity score: " + result.score + ".\n");
    } catch (error) {
        console.log ("Error identifying speaker: " + error);
    }
}
```

In this function, you create a [SpeakerIdentificationModel](/javascript/api/microsoft-cognitiveservices-speech-sdk/speakeridentificationmodel) object with the [SpeakerIdentificationModel.fromProfiles](/javascript/api/microsoft-cognitiveservices-speech-sdk/speakeridentificationmodel#fromprofiles-voiceprofile---) method, passing in the [VoiceProfile](/javascript/api/microsoft-cognitiveservices-speech-sdk/voiceprofile) object you created earlier.

Next, you call the [SpeechRecognizer.recognizeOnceAsync](/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognizer#recognizeonceasync--e--speechrecognitionresult-----void---e--string-----void-) method and pass in an audio sample.
`SpeechRecognizer.recognizeOnceAsync` tries to identify the voice for this audio sample based on the `VoiceProfile` objects you used to create the `SpeakerIdentificationModel`. It returns a [SpeakerRecognitionResult](/javascript/api/microsoft-cognitiveservices-speech-sdk/speakerrecognitionresult) object, whose `profileId` property identifies the matching `VoiceProfile`, if any, while the `score` property contains a similarity score that ranges from 0.0 to 1.0.

## Main function

Finally, define the `main` function as follows:

```javascript
async function main() {
    const speech_config = sdk.SpeechConfig.fromSubscription(subscription_key, region);
    const client = new sdk.VoiceProfileClient(speech_config);

    await TextDependentVerification(client, speech_config);
    await TextIndependentVerification(client, speech_config);
    await TextIndependentIdentification(client, speech_config);
    console.log ("End of quickstart.");
}
main();
```

This function creates a [VoiceProfileClient](/javascript/api/microsoft-cognitiveservices-speech-sdk/voiceprofileclient) object, which is used to create, enroll, and delete voice profiles. Then it calls the functions you defined previously.
