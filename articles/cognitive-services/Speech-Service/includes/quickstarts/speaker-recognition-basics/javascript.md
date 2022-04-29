---
author: eric-urban
ms.service: cognitive-services
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

Before you start, you must install the <a href="https://www.npmjs.com/package/microsoft-cognitiveservices-speech-sdk" target="_blank">Speech SDK for JavaScript </a>. Depending on your platform, use the following instructions:

- [Node.js](../../../speech-sdk.md?tabs=nodejs#get-the-speech-sdk)
- [Web browser](../../../speech-sdk.md?tabs=browser#get-the-speech-sdk)

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

For more information on `require`, see <a href="https://nodejs.org/en/knowledge/getting-started/what-is-require/" target="_blank">What is require?.</a>.

---

### Import dependencies

To run the examples in this article, add the following statements at the top of your .js file:

:::code language="javascript" source="~/cognitive-services-quickstart-code/javascript/speech/speaker-recognition.js" id="dependencies":::

These statements import the required libraries and get your Speech service subscription key and region from your environment variables. They also specify paths to audio files that you'll use in the following tasks.

## Create a helper function

Add the following helper function to read audio files into streams for use by the Speech service:

:::code language="javascript" source="~/cognitive-services-quickstart-code/javascript/speech/speaker-recognition.js" id="helpers":::

In this function, you use the [AudioInputStream.createPushStream](/javascript/api/microsoft-cognitiveservices-speech-sdk/audioinputstream#createpushstream-audiostreamformat-) and [AudioConfig.fromStreamInput](/javascript/api/microsoft-cognitiveservices-speech-sdk/audioconfig#fromstreaminput-audioinputstream---pullaudioinputstreamcallback-) methods to create an [AudioConfig](/javascript/api/microsoft-cognitiveservices-speech-sdk/audioconfig) object. This `AudioConfig` object represents an audio stream. You'll use several of these `AudioConfig` objects during the following tasks.

## Text-dependent verification

Speaker verification is the act of confirming that a speaker matches a known, or *enrolled*, voice. The first step is to enroll a voice profile so that the service has something to compare future voice samples against. In this example, you enroll the profile by using a *text-dependent* strategy, which requires a specific passphrase to use for enrollment and verification. See the [reference docs](/rest/api/speakerrecognition/) for a list of supported passphrases.

### TextDependentVerification function

Start by creating the `TextDependentVerification` function.

:::code language="javascript" source="~/cognitive-services-quickstart-code/javascript/speech/speaker-recognition.js" id="text_dependent_verification":::

This function creates a [VoiceProfile](/javascript/api/microsoft-cognitiveservices-speech-sdk/voiceprofile) object with the [VoiceProfileClient.createProfileAsync](/javascript/api/microsoft-cognitiveservices-speech-sdk/voiceprofileclient#createprofileasync-voiceprofiletype--string---e--voiceprofile-----void---e--string-----void-) method. There are three [types](/javascript/api/microsoft-cognitiveservices-speech-sdk/voiceprofiletype) of `VoiceProfile`:

- TextIndependentIdentification
- TextDependentVerification
- TextIndependentVerification

In this case, you pass `VoiceProfileType.TextDependentVerification` to `VoiceProfileClient.createProfileAsync`.

You then call two helper functions that you'll define next, `AddEnrollmentsToTextDependentProfile` and `SpeakerVerify`. Finally, call [VoiceProfileClient.deleteProfileAsync](/javascript/api/microsoft-cognitiveservices-speech-sdk/voiceprofileclient#deleteprofileasync-voiceprofile---response--voiceprofileresult-----void---e--string-----void-) to remove the profile.

### AddEnrollmentsToTextDependentProfile function

Define the following function to enroll a voice profile:

:::code language="javascript" source="~/cognitive-services-quickstart-code/javascript/speech/speaker-recognition.js" id="add_enrollments_dependent":::

In this function, you call the `GetAudioConfigFromFile` function you defined earlier to create `AudioConfig` objects from audio samples. These audio samples contain a passphrase, such as "My voice is my passport, verify me." You then enroll these audio samples by using the [VoiceProfileClient.enrollProfileAsync](/javascript/api/microsoft-cognitiveservices-speech-sdk/voiceprofileclient#enrollprofileasync-voiceprofile--audioconfig---e--voiceprofileenrollmentresult-----void---e--string-----void-) method.

### SpeakerVerify function

Define `SpeakerVerify` as follows:

:::code language="javascript" source="~/cognitive-services-quickstart-code/javascript/speech/speaker-recognition.js" id="speaker_verify":::

In this function, you create a [SpeakerVerificationModel](/javascript/api/microsoft-cognitiveservices-speech-sdk/speakerverificationmodel) object with the [SpeakerVerificationModel.FromProfile](/javascript/api/microsoft-cognitiveservices-speech-sdk/speakerverificationmodel#fromprofile-voiceprofile-) method, passing in the [VoiceProfile](/javascript/api/microsoft-cognitiveservices-speech-sdk/voiceprofile) object you created earlier.

Next, you call the [SpeechRecognizer.recognizeOnceAsync](/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognizer#recognizeonceasync--e--speechrecognitionresult-----void---e--string-----void-) method to validate an audio sample that contains the same passphrase as the audio samples you enrolled previously. `SpeechRecognizer.recognizeOnceAsync` returns a [SpeakerRecognitionResult](/javascript/api/microsoft-cognitiveservices-speech-sdk/speakerrecognitionresult) object, whose `score` property contains a similarity score that ranges from 0.0 to 1.0. The `SpeakerRecognitionResult` object also contains a `reason` property of type [ResultReason](/javascript/api/microsoft-cognitiveservices-speech-sdk/resultreason). If the verification was successful, the `reason` property should have the value `RecognizedSpeaker`.

## Text-independent verification

In contrast to *text-dependent* verification, *text-independent* verification:

* Doesn't require a certain passphrase to be spoken. Anything can be spoken.
* Doesn't require three audio samples but *does* require 20 seconds of total audio.

### TextIndependentVerification function

Start by creating the `TextIndependentVerification` function.

:::code language="javascript" source="~/cognitive-services-quickstart-code/javascript/speech/speaker-recognition.js" id="text_independent_verification":::

Like the `TextDependentVerification` function, this function creates a [VoiceProfile](/javascript/api/microsoft-cognitiveservices-speech-sdk/voiceprofile) object with the [VoiceProfileClient.createProfileAsync](/javascript/api/microsoft-cognitiveservices-speech-sdk/voiceprofileclient#createprofileasync-voiceprofiletype--string---e--voiceprofile-----void---e--string-----void-) method.

In this case, you pass `VoiceProfileType.TextIndependentVerification` to `createProfileAsync`.

You then call two helper functions: `AddEnrollmentsToTextIndependentProfile`, which you'll define next, and `SpeakerVerify`, which you defined already. Finally, call [VoiceProfileClient.deleteProfileAsync](/javascript/api/microsoft-cognitiveservices-speech-sdk/voiceprofileclient#deleteprofileasync-voiceprofile---response--voiceprofileresult-----void---e--string-----void-) to remove the profile.

### AddEnrollmentsToTextIndependentProfile

Define the following function to enroll a voice profile:

:::code language="javascript" source="~/cognitive-services-quickstart-code/javascript/speech/speaker-recognition.js" id="add_enrollments_independent":::

In this function, you call the `GetAudioConfigFromFile` function you defined earlier to create `AudioConfig` objects from audio samples. You then enroll these audio samples by using the [VoiceProfileClient.enrollProfileAsync](/javascript/api/microsoft-cognitiveservices-speech-sdk/voiceprofileclient#enrollprofileasync-voiceprofile--audioconfig---e--voiceprofileenrollmentresult-----void---e--string-----void-) method.

## Speaker identification

Speaker identification is used to determine *who* is speaking from a given group of enrolled voices. The process is similar to *text-independent verification*. The main difference is the capability to verify against multiple voice profiles at once rather than verifying against a single profile.

### TextIndependentIdentification function

Start by creating the `TextIndependentIdentification` function.

:::code language="javascript" source="~/cognitive-services-quickstart-code/javascript/speech/speaker-recognition.js" id="text_independent_indentification":::

Like the `TextDependentVerification` and `TextIndependentVerification` functions, this function creates a [VoiceProfile](/javascript/api/microsoft-cognitiveservices-speech-sdk/voiceprofile) object with the [VoiceProfileClient.createProfileAsync](/javascript/api/microsoft-cognitiveservices-speech-sdk/voiceprofileclient#createprofileasync-voiceprofiletype--string---e--voiceprofile-----void---e--string-----void-) method.

In this case, you pass `VoiceProfileType.TextIndependentIdentification` to `VoiceProfileClient.createProfileAsync`.

You then call two helper functions: `AddEnrollmentsToTextIndependentProfile`, which you defined already, and `SpeakerIdentify`, which you'll define next. Finally, call [VoiceProfileClient.deleteProfileAsync](/javascript/api/microsoft-cognitiveservices-speech-sdk/voiceprofileclient#deleteprofileasync-voiceprofile---response--voiceprofileresult-----void---e--string-----void-) to remove the profile.

### SpeakerIdentify function

Define the `SpeakerIdentify` function as follows:

:::code language="javascript" source="~/cognitive-services-quickstart-code/javascript/speech/speaker-recognition.js" id="speaker_identify":::

In this function, you create a [SpeakerIdentificationModel](/javascript/api/microsoft-cognitiveservices-speech-sdk/speakeridentificationmodel) object with the [SpeakerIdentificationModel.fromProfiles](/javascript/api/microsoft-cognitiveservices-speech-sdk/speakeridentificationmodel#fromprofiles-voiceprofile---) method, passing in the [VoiceProfile](/javascript/api/microsoft-cognitiveservices-speech-sdk/voiceprofile) object you created earlier.

Next, you call the [SpeechRecognizer.recognizeOnceAsync](/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognizer#recognizeonceasync--e--speechrecognitionresult-----void---e--string-----void-) method and pass in an audio sample.
`SpeechRecognizer.recognizeOnceAsync` tries to identify the voice for this audio sample based on the `VoiceProfile` objects you used to create the `SpeakerIdentificationModel`. It returns a [SpeakerRecognitionResult](/javascript/api/microsoft-cognitiveservices-speech-sdk/speakerrecognitionresult) object, whose `profileId` property identifies the matching `VoiceProfile`, if any, while the `score` property contains a similarity score that ranges from 0.0 to 1.0.

## Main function

Finally, define the `main` function as follows:

:::code language="javascript" source="~/cognitive-services-quickstart-code/javascript/speech/speaker-recognition.js" id="main":::

This function creates a [VoiceProfileClient](/javascript/api/microsoft-cognitiveservices-speech-sdk/voiceprofileclient) object, which is used to create, enroll, and delete voice profiles. Then it calls the functions you defined previously.
