---
author: v-jaswel
ms.service: cognitive-services
ms.topic: include
ms.date: 09/28/2020
ms.author: v-jawe
ms.custom: references_regions
---

In this quickstart, you learn basic design patterns for Speaker Recognition using the Speech SDK, including:

* Text-dependent and text-independent verification
* Speaker identification to identify a voice sample among a group of voices
* Deleting voice profiles

For a high-level look at Speech Recognition concepts, see the [overview](../../../speaker-recognition-overview.md) article.

## Skip to samples on GitHub

If you want to skip straight to sample code, see the [C++ quickstart samples](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/cpp/windows) on GitHub.

## Prerequisites

This article assumes that you have an Azure account and Speech service subscription. If you don't have an account and subscription, [try the Speech service for free](../../../overview.md#try-the-speech-service-for-free).

> [!IMPORTANT]
> Speaker Recognition is currently *only* supported in Azure Speech resources created in the `westus` region.

## Install the Speech SDK

Before you can do anything, you'll need to install the Speech SDK. Depending on your platform, use the following instructions:

* <a href="/azure/cognitive-services/speech-service/quickstarts/setup-platform?pivots=programming-language-cpp&tabs=linux" target="_blank">Linux </a>
* <a href="/azure/cognitive-services/speech-service/quickstarts/setup-platform?pivots=programming-language-cpp&tabs=macos" target="_blank">macOS </a>
* <a href="/azure/cognitive-services/speech-service/quickstarts/setup-platform?pivots=programming-language-cpp&tabs=windows" target="_blank">Windows </a>

## Import dependencies

To run the examples in this article, add the following statements at the top of your .cpp file.

:::code language="cpp" source="~/cognitive-services-quickstart-code/cpp/speech/speaker-recognition.cpp" id="dependencies":::

## Create a speech configuration

To call the Speech service using the Speech SDK, you need to create a [`SpeechConfig`](/cpp/cognitive-services/speech/speechconfig). This class includes information about your subscription, like your key and associated region, endpoint, host, or authorization token.

:::code language="cpp" source="~/cognitive-services-quickstart-code/cpp/speech/speaker-recognition.cpp" id="get_speech_config":::

## Text-dependent verification

Speaker Verification is the act of confirming that a speaker matches a known, or **enrolled** voice. The first step is to **enroll** a voice profile, so that the service has something to compare future voice samples against. In this example, you enroll the profile using a **text-dependent** strategy, which requires a specific passphrase to use for both enrollment and verification. See the [reference docs](/rest/api/speakerrecognition/) for a list of supported passphrases.

### TextDependentVerification function

Start by creating the `TextDependentVerification` function.

:::code language="cpp" source="~/cognitive-services-quickstart-code/cpp/speech/speaker-recognition.cpp" id="text_dependent_verification":::

This function creates a [VoiceProfile](/cpp/cognitive-services/speech/speaker-voiceprofile) object with the [CreateProfileAsync](/cpp/cognitive-services/speech/speaker-voiceprofileclient#createprofileasync) method. Note there are three [types](/cpp/cognitive-services/speech/microsoft-cognitiveservices-speech-namespace#enum-voiceprofiletype) of `VoiceProfile`:

- TextIndependentIdentification
- TextDependentVerification
- TextIndependentVerification

In this case you pass `VoiceProfileType::TextDependentVerification` to `CreateProfileAsync`.

You then call two helper functions that you'll define next, `AddEnrollmentsToTextDependentProfile` and `SpeakerVerify`. Finally, call [DeleteProfileAsync](/cpp/cognitive-services/speech/speaker-voiceprofileclient#deleteprofileasync) to clean up the profile.

### AddEnrollmentsToTextDependentProfile function

Define the following function to enroll a voice profile.

:::code language="cpp" source="~/cognitive-services-quickstart-code/cpp/speech/speaker-recognition.cpp" id="add_enrollments_dependent":::

In this function, you enroll audio samples in a `while` loop that tracks the number of samples remaining, and required, for enrollment. In each iteration, [EnrollProfileAsync](/cpp/cognitive-services/speech/speaker-voiceprofileclient#enrollprofileasync) prompts you to speak the passphrase into your microphone, and adds the sample to the voice profile.

### SpeakerVerify function

Define `SpeakerVerify` as follows.

:::code language="cpp" source="~/cognitive-services-quickstart-code/cpp/speech/speaker-recognition.cpp" id="speaker_verify":::

In this function, you create a [SpeakerVerificationModel](/cpp/cognitive-services/speech/speaker-speakerverificationmodel) object with the [SpeakerVerificationModel::FromProfile](/cpp/cognitive-services/speech/speaker-speakerverificationmodel#fromprofile) method, passing in the [VoiceProfile](/cpp/cognitive-services/speech/speaker-voiceprofile) object you created earlier.

Next, [SpeechRecognizer::RecognizeOnceAsync](/cpp/cognitive-services/speech/speechrecognizer#recognizeonceasync) prompts you to speak the passphrase again, but this time it will validate it against your voice profile and return a similarity score ranging from 0.0-1.0. The [SpeakerRecognitionResult](/cpp/cognitive-services/speech/speaker-speakerrecognitionresult) object also returns `Accept` or `Reject`, based on whether or not the passphrase matches.

## Text-independent verification

In contrast to **text-dependent** verification, **text-independent** verification:

* Does not require a certain passphrase to be spoken, anything can be spoken
* Does not require three audio samples, but *does* require 20 seconds of total audio

### TextIndependentVerification function

Start by creating the `TextIndependentVerification` function.

:::code language="cpp" source="~/cognitive-services-quickstart-code/cpp/speech/speaker-recognition.cpp" id="text_independent_verification":::

Like the `TextDependentVerification` function, this function creates a [VoiceProfile](/cpp/cognitive-services/speech/speaker-voiceprofile) object with the [CreateProfileAsync](/cpp/cognitive-services/speech/speaker-voiceprofileclient#createprofileasync) method.

In this case you pass `VoiceProfileType::TextIndependentVerification` to `CreateProfileAsync`.

You then call two helper functions: `AddEnrollmentsToTextIndependentProfile`, which you'll define next, and `SpeakerVerify`, which you defined already. Finally, call [DeleteProfileAsync](/cpp/cognitive-services/speech/speaker-voiceprofileclient#deleteprofileasync) to clean up the profile.

### AddEnrollmentsToTextIndependentProfile

Define the following function to enroll a voice profile.

:::code language="cpp" source="~/cognitive-services-quickstart-code/cpp/speech/speaker-recognition.cpp" id="add_enrollments_independent":::

In this function, you enroll audio samples in a `while` loop that tracks the number of seconds of audio remaining, and required, for enrollment. In each iteration, [EnrollProfileAsync](/cpp/cognitive-services/speech/speaker-voiceprofileclient#enrollprofileasync) prompts you to speak into your microphone, and adds the sample to the voice profile.

## Speaker identification

Speaker Identification is used to determine **who** is speaking from a given group of enrolled voices. The process is very similar to **text-independent verification**, with the main difference being able to verify against multiple voice profiles at once, rather than verifying against a single profile.

### TextIndependentIdentification function

Start by creating the `TextIndependentIdentification` function.

:::code language="cpp" source="~/cognitive-services-quickstart-code/cpp/speech/speaker-recognition.cpp" id="text_independent_indentification":::

Like the `TextDependentVerification` and `TextIndependentVerification` functions, this function creates a [VoiceProfile](/cpp/cognitive-services/speech/speaker-voiceprofile) object with the [CreateProfileAsync](/cpp/cognitive-services/speech/speaker-voiceprofileclient#createprofileasync) method.

In this case you pass `VoiceProfileType::TextIndependentIdentification` to `CreateProfileAsync`.

You then call two helper functions: `AddEnrollmentsToTextIndependentProfile`, which you defined already, and `SpeakerIdentify`, which you'll define next. Finally, call [DeleteProfileAsync](/cpp/cognitive-services/speech/speaker-voiceprofileclient#deleteprofileasync) to clean up the profile.

### SpeakerIdentify function

Define the `SpeakerIdentify` function as follows.

:::code language="cpp" source="~/cognitive-services-quickstart-code/cpp/speech/speaker-recognition.cpp" id="speaker_identify":::

In this function, you create a [SpeakerIdentificationModel](/cpp/cognitive-services/speech/speaker-speakeridentificationmodel) object with the [SpeakerIdentificationModel::FromProfiles](/cpp/cognitive-services/speech/speaker-speakeridentificationmodel#fromprofiles) method. `SpeakerIdentificationModel::FromProfiles` accepts a list of [VoiceProfile](/cpp/cognitive-services/speech/speaker-voiceprofile) objects. In this case, you'll just pass in the `VoiceProfile` object you created earlier. However, if you want, you can pass in multiple `VoiceProfile` objects, each enrolled with audio samples from a different voice.

Next, [SpeechRecognizer::RecognizeOnceAsync](/cpp/cognitive-services/speech/speechrecognizer#recognizeonceasync) prompts you to speak again. This time it compares your voice to the enrolled voice profiles and returns the most similar voice profile.

## Main function

Finally, define the `main` function as follows.

:::code language="cpp" source="~/cognitive-services-quickstart-code/cpp/speech/speaker-recognition.cpp" id="main":::

This function simply calls the functions you defined previously. First, though, it creates a [VoiceProfileClient](/cpp/cognitive-services/speech/speaker-voiceprofileclient) object and a [SpeakerRecognizer](/cpp/cognitive-services/speech/speaker-speakerrecognizer) object.

```
auto speech_config = GetSpeechConfig();
auto client = VoiceProfileClient::FromConfig(speech_config);
auto recognizer = SpeakerRecognizer::FromConfig(speech_config, audio_config);
```

The `VoiceProfileClient` is used to create, enroll and delete voice profiles. The `SpeakerRecognizer` is used to validate speech samples against one or more enrolled voice profiles.

## Changing audio input type

The examples in this article use the default device microphone as input for audio samples. However, in scenarios where you need to use audio files instead of microphone input, simply change the following line:

```
auto audio_config = Audio::AudioConfig::FromDefaultMicrophoneInput();
```

to:

```
auto audio_config = Audio::AudioConfig::FromWavFileInput(path/to/your/file.wav);
```

Or replace any use of `audio_config` with [Audio::AudioConfig::FromWavFileInput](/cpp/cognitive-services/speech/audio-audioconfig#fromwavfileinput). You can also have mixed inputs, using a microphone for enrollment and files for verification, for example.
