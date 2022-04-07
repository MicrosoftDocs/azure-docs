---
author: eric-urban
ms.service: cognitive-services
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

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tdv_create_profile":::

There are three types of voice profile:

- Text-dependent verification
- Text-independent verification
- Text-independent identification

In this case, you create a text-dependent verification voice profile. You should receive the following response:

:::code language="json" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tdv_create_profile_response":::

Next, you [enroll the voice profile](/rest/api/speakerrecognition/verification/textdependent/createenrollment). For the `--data-binary` parameter value, specify an audio file on your computer that contains one of the supported passphrases, such as "My voice is my passport, verify me." You can record an audio file with an app like [Windows Voice Recorder](https://www.microsoft.com/p/windows-voice-recorder/9wzdncrfhwkn?activetab=pivot:overviewtab). Or you can generate it by using [text-to-speech](../../../index-text-to-speech.yml).

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tdv_enroll":::

You should receive the following response:

:::code language="json" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tdv_enroll_response_1":::

This response tells you that you need to enroll two more audio samples.

After you enroll a total of three audio samples, you should receive the following response:

:::code language="json" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tdv_enroll_response_2":::

Now you're ready to [verify an audio sample against the voice profile](/rest/api/speakerrecognition/verification/textdependent/verifyprofile). This audio sample should contain the same passphrase as the samples you used to enroll the voice profile.

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tdv_verify":::

You should receive the following response:

:::code language="json" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tdv_verify_response":::

`Accept` means the passphrase matched and the verification was successful. The response also contains a similarity score that ranges from 0.0 to 1.0.

To finish, [delete the voice profile](/rest/api/speakerrecognition/verification/textdependent/deleteprofile).

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tdv_delete_profile":::

There's no response.

## Text-independent verification

In contrast to *text-dependent* verification, *text-independent* verification:

* Doesn't require a certain passphrase to be spoken. Anything can be spoken.
* Doesn't require three audio samples but *does* require 20 seconds of total audio.

Start by [creating a text-independent verification profile](/rest/api/speakerrecognition/verification/textindependent/createprofile).

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tiv_create_profile":::

You should receive the following response:

:::code language="json" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tiv_create_profile_response":::

Next, [enroll the voice profile](/rest/api/speakerrecognition/verification/textindependent/createenrollment). Again, instead of submitting three audio samples, you need to submit audio samples that contain a total of 20 seconds of audio.

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tiv_enroll":::

After you've submitted enough audio samples, you should receive the following response:

:::code language="json" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tiv_enroll_response":::

Now you're ready to [verify an audio sample against the voice profile](/rest/api/speakerrecognition/verification/textindependent/verifyprofile). Again, this audio sample doesn't need to contain a passphrase. It can contain any speech, but it must contain a total of at least four seconds of audio.

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tiv_verify":::

You should receive the following response:

:::code language="json" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tiv_verify_response":::

`Accept` means the verification was successful. The response also contains a similarity score that ranges from 0.0 to 1.0.

To finish, [delete the voice profile](/rest/api/speakerrecognition/verification/textindependent/deleteprofile).

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tiv_delete_profile":::

There's no response.

## Speaker identification

Speaker identification is used to determine *who* is speaking from a given group of enrolled voices. The process is similar to *text-independent verification*. The main difference is the capability to verify against multiple voice profiles at once rather than verifying against a single profile.

Start by [creating a text-independent identification profile](/rest/api/speakerrecognition/identification/textindependent/createprofile).

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tii_create_profile":::

You should receive the following response:

:::code language="json" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tii_create_profile_response":::

Next, you [enroll the voice profile](/rest/api/speakerrecognition/identification/textindependent/createenrollment). Again, you need to submit audio samples that contain a total of 20 seconds of audio. These samples don't need to contain a passphrase.

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tii_enroll":::

After you've submitted enough audio samples, you should receive the following response:

:::code language="json" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tii_enroll_response_2":::

Now you're ready to [identify an audio sample by using the voice profile](/rest/api/speakerrecognition/identification/textindependent/identifysinglespeaker). The identify command accepts a comma-delimited list of possible voice profile IDs. In this case, you'll pass in the ID of the voice profile you created previously. If you want, you can pass in multiple voice profile IDs where each voice profile is enrolled with audio samples from a different voice.

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tii_identify":::

You should receive the following response:

:::code language="json" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tii_identify_response":::

The response contains the ID of the voice profile that most closely matches the audio sample you submitted. It also contains a list of candidate voice profiles, ranked in order of similarity.

To finish, [delete the voice profile](/rest/api/speakerrecognition/identification/textindependent/deleteprofile).

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tii_delete_profile":::

There's no response.
