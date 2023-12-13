---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 01/08/2022
author: eur
ms.custom: references_regions, ignite-fall-2021
---

[!INCLUDE [Header](../../common/rest.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Text-dependent verification

Speaker verification is the act of confirming that a speaker matches a known, or *enrolled*, voice. The first step is to enroll a voice profile so that the service has something to compare future voice samples against. In this example, you enroll the profile by using a *text-dependent* strategy, which requires a specific passphrase to use for enrollment and verification. See the [reference docs](/rest/api/speakerrecognition/) for a list of supported passphrases.

Start by [creating a voice profile](/rest/api/speakerrecognition/verification/textdependent/createprofile). You'll need to insert your Speech service subscription key and region into each of the curl commands in this article.

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../use-key-vault.md). See the Azure AI services [security](../../../../security-features.md) article for more information.

```curl
# Note Change locale if needed.
curl --location --request POST 'INSERT_ENDPOINT_HERE/speaker-recognition/verification/text-dependent/profiles?api-version=2021-09-05' \
--header 'Ocp-Apim-Subscription-Key: INSERT_SUBSCRIPTION_KEY_HERE' \
--header 'Content-Type: application/json' \
--data-raw '{
    '\''locale'\'':'\''en-us'\''
}'
```

There are three types of voice profile:

- Text-dependent verification
- Text-independent verification
- Text-independent identification

In this case, you create a text-dependent verification voice profile. You should receive the following response:

```json
{
    "remainingEnrollmentsCount": 3,
    "locale": "en-us",
    "createdDateTime": "2020-09-29T14:54:29.683Z",
    "enrollmentStatus": "Enrolling",
    "modelVersion": null,
    "profileId": "714ce523-de76-4220-b93f-7c1cc1882d6e",
    "lastUpdatedDateTime": null,
    "enrollmentsCount": 0,
    "enrollmentsLength": 0.0,
    "enrollmentSpeechLength": 0.0
}
```

Next, you [enroll the voice profile](/rest/api/speakerrecognition/verification/textdependent/createenrollment). For the `--data-binary` parameter value, specify an audio file on your computer that contains one of the supported passphrases, such as "My voice is my passport, verify me." You can record an audio file with an app like [Windows Voice Recorder](https://www.microsoft.com/p/windows-voice-recorder/9wzdncrfhwkn?activetab=pivot:overviewtab). Or you can generate it by using [text to speech](../../../index-text-to-speech.yml).

```curl
curl --location --request POST 'INSERT_ENDPOINT_HERE/speaker-recognition/verification/text-dependent/profiles/INSERT_PROFILE_ID_HERE/enrollments?api-version=2021-09-05' \
--header 'Ocp-Apim-Subscription-Key: INSERT_SUBSCRIPTION_KEY_HERE' \
--header 'Content-Type: audio/wav' \
--data-binary @'INSERT_FILE_PATH_HERE'
```

You should receive the following response:

```json
{
    "remainingEnrollmentsCount": 2,
    "passPhrase": "my voice is my passport verify me",
    "profileId": "714ce523-de76-4220-b93f-7c1cc1882d6e",
    "enrollmentStatus": "Enrolling",
    "enrollmentsCount": 1,
    "enrollmentsLength": 3.5,
    "enrollmentsSpeechLength": 2.88,
    "audioLength": 3.5,
    "audioSpeechLength": 2.88
}
```

This response tells you that you need to enroll two more audio samples.

After you enroll a total of three audio samples, you should receive the following response:

```json
{
    "remainingEnrollmentsCount": 0,
    "passPhrase": "my voice is my passport verify me",
    "profileId": "714ce523-de76-4220-b93f-7c1cc1882d6e",
    "enrollmentStatus": "Enrolled",
    "enrollmentsCount": 3,
    "enrollmentsLength": 10.5,
    "enrollmentsSpeechLength": 8.64,
    "audioLength": 3.5,
    "audioSpeechLength": 2.88
}
```

Now you're ready to [verify an audio sample against the voice profile](/rest/api/speakerrecognition/verification/textdependent/verifyprofile). This audio sample should contain the same passphrase as the samples you used to enroll the voice profile.

```curl
curl --location --request POST 'INSERT_ENDPOINT_HERE/speaker-recognition/verification/text-dependent/profiles/INSERT_PROFILE_ID_HERE:verify?api-version=2021-09-05' \
--header 'Ocp-Apim-Subscription-Key: INSERT_SUBSCRIPTION_KEY_HERE' \
--header 'Content-Type: audio/wav' \
--data-binary @'INSERT_FILE_PATH_HERE'
```

You should receive the following response:

```json
{
    "recognitionResult": "Accept",
    "score": 1.0
}
```

`Accept` means the passphrase matched and the verification was successful. The response also contains a similarity score that ranges from 0.0 to 1.0.

To finish, [delete the voice profile](/rest/api/speakerrecognition/verification/textdependent/deleteprofile).

```curl
curl --location --request DELETE \
'INSERT_ENDPOINT_HERE/speaker-recognition/verification/text-dependent/profiles/INSERT_PROFILE_ID_HERE?api-version=2021-09-05' \
--header 'Ocp-Apim-Subscription-Key: INSERT_SUBSCRIPTION_KEY_HERE'
```

There's no response.

## Text-independent verification

In contrast to *text-dependent* verification, *text-independent* verification:

* Doesn't require a certain passphrase to be spoken. Anything can be spoken.
* Doesn't require three audio samples but *does* require 20 seconds of total audio.

Start by [creating a text-independent verification profile](/rest/api/speakerrecognition/verification/textindependent/createprofile).

```curl
curl --location --request POST 'INSERT_ENDPOINT_HERE/speaker-recognition/verification/text-independent/profiles?api-version=2021-09-05' \
--header 'Ocp-Apim-Subscription-Key: INSERT_SUBSCRIPTION_KEY_HERE' \
--header 'Content-Type: application/json' \
--data-raw '{
    '\''locale'\'':'\''en-us'\''
}'
```

You should receive the following response:

```json
{
    "profileStatus": "Inactive",
    "remainingEnrollmentsSpeechLength": 20.0,
    "profileId": "3f85dca9-ffc9-4011-bf21-37fad2beb4d2",
    "locale": "en-us",
    "enrollmentStatus": "Enrolling",
    "createdDateTime": "2020-09-29T16:08:52.409Z",
    "lastUpdatedDateTime": null,
    "enrollmentsCount": 0,
    "enrollmentsLength": 0.0,
    "enrollmentSpeechLength": 0.0
    "modelVersion": null,
}
```

Next, [enroll the voice profile](/rest/api/speakerrecognition/verification/textindependent/createenrollment). Again, instead of submitting three audio samples, you need to submit audio samples that contain a total of 20 seconds of audio.

```curl
curl --location --request POST 'INSERT_ENDPOINT_HERE/speaker-recognition/verification/text-independent/profiles/INSERT_PROFILE_ID_HERE/enrollments?api-version=2021-09-05' \
--header 'Ocp-Apim-Subscription-Key: INSERT_SUBSCRIPTION_KEY_HERE' \
--header 'Content-Type: audio/wav' \
--data-binary @'INSERT_FILE_PATH_HERE'
```

After you've submitted enough audio samples, you should receive the following response:

```json
{
    "remainingEnrollmentsSpeechLength": 0.0,
    "profileId": "3f85dca9-ffc9-4011-bf21-37fad2beb4d2",
    "enrollmentStatus": "Enrolled",
    "enrollmentsCount": 1,
    "enrollmentsLength": 33.16,
    "enrollmentsSpeechLength": 29.21,
    "audioLength": 33.16,
    "audioSpeechLength": 29.21
}
```

Now you're ready to [verify an audio sample against the voice profile](/rest/api/speakerrecognition/verification/textindependent/verifyprofile). Again, this audio sample doesn't need to contain a passphrase. It can contain any speech, but it must contain a total of at least four seconds of audio.

```curl
curl --location --request POST 'INSERT_ENDPOINT_HERE/speaker-recognition/verification/text-independent/profiles/INSERT_PROFILE_ID_HERE:verify?api-version=2021-09-05' \
--header 'Ocp-Apim-Subscription-Key: INSERT_SUBSCRIPTION_KEY_HERE' \
--header 'Content-Type: audio/wav' \
--data-binary @'INSERT_FILE_PATH_HERE'
```

You should receive the following response:

```json
{
    "recognitionResult": "Accept",
    "score": 0.9196669459342957
}
```

`Accept` means the verification was successful. The response also contains a similarity score that ranges from 0.0 to 1.0.

To finish, [delete the voice profile](/rest/api/speakerrecognition/verification/textindependent/deleteprofile).

```curl
curl --location --request DELETE 'INSERT_ENDPOINT_HERE/speaker-recognition/verification/text-independent/profiles/INSERT_PROFILE_ID_HERE?api-version=2021-09-05' \
--header 'Ocp-Apim-Subscription-Key: INSERT_SUBSCRIPTION_KEY_HERE'
```

There's no response.

## Speaker identification

Speaker identification is used to determine *who* is speaking from a given group of enrolled voices. The process is similar to *text-independent verification*. The main difference is the capability to verify against multiple voice profiles at once rather than verifying against a single profile.

Start by [creating a text-independent identification profile](/rest/api/speakerrecognition/identification/textindependent/createprofile).

```curl
# Note Change locale if needed.
curl --location --request POST 'INSERT_ENDPOINT_HERE/speaker-recognition/identification/text-independent/profiles?api-version=2021-09-05' \
--header 'Ocp-Apim-Subscription-Key: INSERT_SUBSCRIPTION_KEY_HERE' \
--header 'Content-Type: application/json' \
--data-raw '{
    '\''locale'\'':'\''en-us'\''
}'
```

You should receive the following response:

```json
{
    "profileStatus": "Inactive",
    "remainingEnrollmentsSpeechLengthInSec": 20.0,
    "profileId": "de99ab38-36c8-4b82-b137-510907c61fe8",
    "locale": "en-us",
    "enrollmentStatus": "Enrolling",
    "createdDateTime": "2020-09-22T17:25:48.642Z",
    "lastUpdatedDateTime": null,
    "enrollmentsCount": 0,
    "enrollmentsLengthInSec": 0.0,
    "enrollmentsSpeechLengthInSec": 0.0,
    "modelVersion": null
}
```

Next, you [enroll the voice profile](/rest/api/speakerrecognition/identification/textindependent/createenrollment). Again, you need to submit audio samples that contain a total of 20 seconds of audio. These samples don't need to contain a passphrase.

```curl
curl --location --request POST 'INSERT_ENDPOINT_HERE/speaker-recognition/identification/text-independent/profiles/INSERT_PROFILE_ID_HERE/enrollments?api-version=2021-09-05' \
--header 'Ocp-Apim-Subscription-Key: INSERT_SUBSCRIPTION_KEY_HERE' \
--header 'Content-Type: audio/wav' \
--data-binary @'INSERT_FILE_PATH_HERE'
```

After you've submitted enough audio samples, you should receive the following response:

```json
{
    "remainingEnrollmentsSpeechLength": 0.0,
    "profileId": "de99ab38-36c8-4b82-b137-510907c61fe8",
    "enrollmentStatus": "Enrolled",
    "enrollmentsCount": 2,
    "enrollmentsLength": 36.69,
    "enrollmentsSpeechLength": 31.95,
    "audioLength": 33.16,
    "audioSpeechLength": 29.21
}
```

Now you're ready to [identify an audio sample by using the voice profile](/rest/api/speakerrecognition/identification/textindependent/identifysinglespeaker). The identify command accepts a comma-delimited list of possible voice profile IDs. In this case, you'll pass in the ID of the voice profile you created previously. If you want, you can pass in multiple voice profile IDs where each voice profile is enrolled with audio samples from a different voice.

```curl
# Profile ids comma seperated list
curl --location --request POST 'INSERT_ENDPOINT_HERE/speaker-recognition/identification/text-independent/profiles:identifySingleSpeaker?api-version=2021-09-05&profileIds=INSERT_PROFILE_ID_HERE' \
--header 'Ocp-Apim-Subscription-Key: INSERT_SUBSCRIPTION_KEY_HERE' \
--header 'Content-Type: audio/wav' \
--data-binary @'INSERT_FILE_PATH_HERE'
```

You should receive the following response:

```json
Success:
{
    "identifiedProfile": {
        "profileId": "de99ab38-36c8-4b82-b137-510907c61fe8",
        "score": 0.9083486
    },
    "profilesRanking": [
        {
            "profileId": "de99ab38-36c8-4b82-b137-510907c61fe8",
            "score": 0.9083486
        }
    ]
}
```

The response contains the ID of the voice profile that most closely matches the audio sample you submitted. It also contains a list of candidate voice profiles, ranked in order of similarity.

To finish, [delete the voice profile](/rest/api/speakerrecognition/identification/textindependent/deleteprofile).

```curl
curl --location --request DELETE \
'INSERT_ENDPOINT_HERE/speaker-recognition/identification/text-independent/profiles/INSERT_PROFILE_ID_HERE?api-version=2021-09-05' \
--header 'Ocp-Apim-Subscription-Key: INSERT_SUBSCRIPTION_KEY_HERE'
```

There's no response.
