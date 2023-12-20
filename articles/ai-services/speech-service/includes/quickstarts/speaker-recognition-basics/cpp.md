---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 01/08/2022
author: eur
ms.custom: references_regions, ignite-fall-2021
---

[!INCLUDE [Header](../../common/cpp.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

### Install the Speech SDK

Before you start, you must install the Speech SDK. Depending on your platform, use the following instructions:

* <a href="~/articles/ai-services/speech-service/quickstarts/setup-platform.md?pivots=programming-language-cpp&tabs=linux" target="_blank">Linux </a>
* <a href="~/articles/ai-services/speech-service/quickstarts/setup-platform.md?pivots=programming-language-cpp&tabs=macos" target="_blank">macOS </a>
* <a href="~/articles/ai-services/speech-service/quickstarts/setup-platform.md?pivots=programming-language-cpp&tabs=windows" target="_blank">Windows </a>

### Import dependencies

To run the examples in this article, add the following statements at the top of your .cpp file:

```cpp
#include <iostream>
#include <stdexcept>
// Note: Install the NuGet package Microsoft.CognitiveServices.Speech.
#include <speechapi_cxx.h>

using namespace std;
using namespace Microsoft::CognitiveServices::Speech;

// Note: Change the locale if desired.
auto profile_locale = "en-us";
auto audio_config = Audio::AudioConfig::FromDefaultMicrophoneInput();
auto ticks_per_second = 10000000;
```

## Create a speech configuration

To call the Speech service by using the Speech SDK, create a [`SpeechConfig`](/cpp/cognitive-services/speech/speechconfig) class. This class includes information about your subscription, like your key and associated region, endpoint, host, or authorization token.

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../use-key-vault.md). See the Azure AI services [security](../../../../security-features.md) article for more information.

```cpp
shared_ptr<SpeechConfig> GetSpeechConfig()
{
    auto subscription_key = 'PASTE_YOUR_SPEECH_SUBSCRIPTION_KEY_HERE';
    auto region = 'PASTE_YOUR_SPEECH_ENDPOINT_REGION_HERE';
    auto config = SpeechConfig::FromSubscription(subscription_key, region);
    return config;
}
```

## Text-dependent verification

Speaker verification is the act of confirming that a speaker matches a known, or *enrolled*, voice. The first step is to enroll a voice profile so that the service has something to compare future voice samples against. In this example, you enroll the profile by using a *text-dependent* strategy, which requires a specific passphrase to use for enrollment and verification. See the [reference docs](/rest/api/speakerrecognition/) for a list of supported passphrases.

### TextDependentVerification function

Start by creating the `TextDependentVerification` function:

```cpp
void TextDependentVerification(shared_ptr<VoiceProfileClient> client, shared_ptr<SpeakerRecognizer> recognizer)
{
    std::cout << "Text Dependent Verification:\n\n";
    // Create the profile.
    auto profile = client->CreateProfileAsync(VoiceProfileType::TextDependentVerification, profile_locale).get();
    std::cout << "Created profile ID: " << profile->GetId() << "\n";
    AddEnrollmentsToTextDependentProfile(client, profile);
    SpeakerVerify(profile, recognizer);
    // Delete the profile.
    client->DeleteProfileAsync(profile);
}
```

This function creates a [VoiceProfile](/cpp/cognitive-services/speech/speaker-voiceprofile) object with the [CreateProfileAsync](/cpp/cognitive-services/speech/speaker-voiceprofileclient#createprofileasync) method. There are three [types](/cpp/cognitive-services/speech/microsoft-cognitiveservices-speech-namespace#enum-voiceprofiletype) of `VoiceProfile`:

- TextIndependentIdentification
- TextDependentVerification
- TextIndependentVerification

In this case, you pass `VoiceProfileType::TextDependentVerification` to `CreateProfileAsync`.

You then call two helper functions that you'll define next, `AddEnrollmentsToTextDependentProfile` and `SpeakerVerify`. Finally, call [DeleteProfileAsync](/cpp/cognitive-services/speech/speaker-voiceprofileclient#deleteprofileasync) to clean up the profile.

### AddEnrollmentsToTextDependentProfile function

Define the following function to enroll a voice profile:

```cpp
void AddEnrollmentsToTextDependentProfile(shared_ptr<VoiceProfileClient> client, shared_ptr<VoiceProfile> profile)
{
    shared_ptr<VoiceProfileEnrollmentResult> enroll_result = nullptr;
    auto phraseResult = client->GetActivationPhrasesAsync(profile->GetType(), profile_locale).get();
    auto phrases = phraseResult->GetPhrases();
    while (enroll_result == nullptr || enroll_result->GetEnrollmentInfo(EnrollmentInfoType::RemainingEnrollmentsCount) > 0)
    {
        if (phrases != nullptr && phrases->size() > 0)
        {
            std::cout << "Please say the passphrase, \"" << phrases->at(0) << "\"\n";
            enroll_result = client->EnrollProfileAsync(profile, audio_config).get();
            std::cout << "Remaining enrollments needed: " << enroll_result->GetEnrollmentInfo(EnrollmentInfoType::RemainingEnrollmentsCount) << ".\n";
        }
        else
        {
            std::cout << "No passphrases received, enrollment not attempted.\n\n";
        }
    }
    std::cout << "Enrollment completed.\n\n";
}
```

In this function, you enroll audio samples in a `while` loop that tracks the number of samples remaining, and that are required, for enrollment. In each iteration, [EnrollProfileAsync](/cpp/cognitive-services/speech/speaker-voiceprofileclient#enrollprofileasync) prompts you to speak the passphrase into your microphone, and it adds the sample to the voice profile.

### SpeakerVerify function

Define `SpeakerVerify` as follows:

```cpp
void SpeakerVerify(shared_ptr<VoiceProfile> profile, shared_ptr<SpeakerRecognizer> recognizer)
{
    shared_ptr<SpeakerVerificationModel> model = SpeakerVerificationModel::FromProfile(profile);
    std::cout << "Speak the passphrase to verify: \"My voice is my passport, verify me.\"\n";
    shared_ptr<SpeakerRecognitionResult> result = recognizer->RecognizeOnceAsync(model).get();
    std::cout << "Verified voice profile for speaker: " << result->ProfileId << ". Score is: " << result->GetScore() << ".\n\n";
}
```

In this function, you create a [SpeakerVerificationModel](/cpp/cognitive-services/speech/speaker-speakerverificationmodel) object with the [SpeakerVerificationModel::FromProfile](/cpp/cognitive-services/speech/speaker-speakerverificationmodel#fromprofile) method, passing in the [VoiceProfile](/cpp/cognitive-services/speech/speaker-voiceprofile) object you created earlier.

Next, [SpeechRecognizer::RecognizeOnceAsync](/cpp/cognitive-services/speech/speechrecognizer#recognizeonceasync) prompts you to speak the passphrase again. This time it validates it against your voice profile and returns a similarity score that ranges from 0.0 to 1.0. The [SpeakerRecognitionResult](/cpp/cognitive-services/speech/speaker-speakerrecognitionresult) object also returns `Accept` or `Reject` based on whether the passphrase matches.

## Text-independent verification

In contrast to *text-dependent* verification, *text-independent* verification doesn't require three audio samples but *does* require 20 seconds of total audio.

### TextIndependentVerification function

Start by creating the `TextIndependentVerification` function:

```cpp
void TextIndependentVerification(shared_ptr<VoiceProfileClient> client, shared_ptr<SpeakerRecognizer> recognizer)
{
    std::cout << "Text Independent Verification:\n\n";
    // Create the profile.
    auto profile = client->CreateProfileAsync(VoiceProfileType::TextIndependentVerification, profile_locale).get();
    std::cout << "Created profile ID: " << profile->GetId() << "\n";
    AddEnrollmentsToTextIndependentProfile(client, profile);
    SpeakerVerify(profile, recognizer);
    // Delete the profile.
    client->DeleteProfileAsync(profile);
}
```

Like the `TextDependentVerification` function, this function creates a [VoiceProfile](/cpp/cognitive-services/speech/speaker-voiceprofile) object with the [CreateProfileAsync](/cpp/cognitive-services/speech/speaker-voiceprofileclient#createprofileasync) method.

In this case, you pass `VoiceProfileType::TextIndependentVerification` to `CreateProfileAsync`.

You then call two helper functions: `AddEnrollmentsToTextIndependentProfile`, which you'll define next, and `SpeakerVerify`, which you defined already. Finally, call [DeleteProfileAsync](/cpp/cognitive-services/speech/speaker-voiceprofileclient#deleteprofileasync) to clean up the profile.

### AddEnrollmentsToTextIndependentProfile

Define the following function to enroll a voice profile:

```cpp
void AddEnrollmentsToTextIndependentProfile(shared_ptr<VoiceProfileClient> client, shared_ptr<VoiceProfile> profile)
{
    shared_ptr<VoiceProfileEnrollmentResult> enroll_result = nullptr;
    auto phraseResult = client->GetActivationPhrasesAsync(profile->GetType(), profile_locale).get();
    auto phrases = phraseResult->GetPhrases();
    while (enroll_result == nullptr || enroll_result->GetEnrollmentInfo(EnrollmentInfoType::RemainingEnrollmentsSpeechLength) > 0)
    {
        if (phrases != nullptr && phrases->size() > 0)
        {
            std::cout << "Please say the activation phrase, \"" << phrases->at(0) << "\"\n";
            enroll_result = client->EnrollProfileAsync(profile, audio_config).get();
            std::cout << "Remaining audio time needed: " << enroll_result->GetEnrollmentInfo(EnrollmentInfoType::RemainingEnrollmentsSpeechLength) / ticks_per_second << " seconds.\n";
        }
        else
        {
            std::cout << "No activation phrases received, enrollment not attempted.\n\n";
        }
    }
    std::cout << "Enrollment completed.\n\n";
}
```

In this function, you enroll audio samples in a `while` loop that tracks the number of seconds of audio remaining, and that are required, for enrollment. In each iteration, [EnrollProfileAsync](/cpp/cognitive-services/speech/speaker-voiceprofileclient#enrollprofileasync) prompts you to speak into your microphone, and it adds the sample to the voice profile.

## Speaker identification

Speaker identification is used to determine *who* is speaking from a given group of enrolled voices. The process is similar to *text-independent verification*. The main difference is the capability to verify against multiple voice profiles at once rather than verifying against a single profile.

### TextIndependentIdentification function

Start by creating the `TextIndependentIdentification` function:

```cpp
void TextIndependentIdentification(shared_ptr<VoiceProfileClient> client, shared_ptr<SpeakerRecognizer> recognizer)
{
    std::cout << "Speaker Identification:\n\n";
    // Create the profile.
    auto profile = client->CreateProfileAsync(VoiceProfileType::TextIndependentIdentification, profile_locale).get();
    std::cout << "Created profile ID: " << profile->GetId() << "\n";
    AddEnrollmentsToTextIndependentProfile(client, profile);
    SpeakerIdentify(profile, recognizer);
    // Delete the profile.
    client->DeleteProfileAsync(profile);
}
```

Like the `TextDependentVerification` and `TextIndependentVerification` functions, this function creates a [VoiceProfile](/cpp/cognitive-services/speech/speaker-voiceprofile) object with the [CreateProfileAsync](/cpp/cognitive-services/speech/speaker-voiceprofileclient#createprofileasync) method.

In this case, you pass `VoiceProfileType::TextIndependentIdentification` to `CreateProfileAsync`.

You then call two helper functions: `AddEnrollmentsToTextIndependentProfile`, which you defined already, and `SpeakerIdentify`, which you'll define next. Finally, call [DeleteProfileAsync](/cpp/cognitive-services/speech/speaker-voiceprofileclient#deleteprofileasync) to clean up the profile.

### SpeakerIdentify function

Define the `SpeakerIdentify` function as follows:

```cpp
void SpeakerIdentify(shared_ptr<VoiceProfile> profile, shared_ptr<SpeakerRecognizer> recognizer)
{
    shared_ptr<SpeakerIdentificationModel> model = SpeakerIdentificationModel::FromProfiles({ profile });
    // Note: We need at least four seconds of audio after pauses are subtracted.
    std::cout << "Please speak for at least ten seconds to identify who it is from your list of enrolled speakers.\n";
    shared_ptr<SpeakerRecognitionResult> result = recognizer->RecognizeOnceAsync(model).get();
    std::cout << "The most similar voice profile is: " << result->ProfileId << " with similarity score: " << result->GetScore() << ".\n\n";
}
```

In this function, you create a [SpeakerIdentificationModel](/cpp/cognitive-services/speech/speaker-speakeridentificationmodel) object with the [SpeakerIdentificationModel::FromProfiles](/cpp/cognitive-services/speech/speaker-speakeridentificationmodel#fromprofiles) method. `SpeakerIdentificationModel::FromProfiles` accepts a list of [VoiceProfile](/cpp/cognitive-services/speech/speaker-voiceprofile) objects. In this case, you pass in the `VoiceProfile` object you created earlier. If you want, you can pass in multiple `VoiceProfile` objects, each enrolled with audio samples from a different voice.

Next, [SpeechRecognizer::RecognizeOnceAsync](/cpp/cognitive-services/speech/speechrecognizer#recognizeonceasync) prompts you to speak again. This time it compares your voice to the enrolled voice profiles and returns the most similar voice profile.

## Main function

Finally, define the `main` function as follows:

```cpp
int main()
{
    auto speech_config = GetSpeechConfig();
    auto client = VoiceProfileClient::FromConfig(speech_config);
    auto recognizer = SpeakerRecognizer::FromConfig(speech_config, audio_config);
    TextDependentVerification(client, recognizer);
    TextIndependentVerification(client, recognizer);
    TextIndependentIdentification(client, recognizer);
    std::cout << "End of quickstart.\n";
}
```

This function calls the functions you defined previously. First, it creates a [VoiceProfileClient](/cpp/cognitive-services/speech/speaker-voiceprofileclient) object and a [SpeakerRecognizer](/cpp/cognitive-services/speech/speaker-speakerrecognizer) object.


```cpp
auto speech_config = GetSpeechConfig();
auto client = VoiceProfileClient::FromConfig(speech_config);
auto recognizer = SpeakerRecognizer::FromConfig(speech_config, audio_config);
```

The `VoiceProfileClient` object is used to create, enroll, and delete voice profiles. The `SpeakerRecognizer` object is used to validate speech samples against one or more enrolled voice profiles.

## Change audio input type

The examples in this article use the default device microphone as input for audio samples. In scenarios where you need to use audio files instead of microphone input, change the following line:

```cpp
auto audio_config = Audio::AudioConfig::FromDefaultMicrophoneInput();
```

to:

```cpp
auto audio_config = Audio::AudioConfig::FromWavFileInput("path/to/your/file.wav");
```

Or replace any use of `audio_config` with [Audio::AudioConfig::FromWavFileInput](/cpp/cognitive-services/speech/audio-audioconfig#fromwavfileinput). You can also have mixed inputs by using a microphone for enrollment and files for verification, for example.
