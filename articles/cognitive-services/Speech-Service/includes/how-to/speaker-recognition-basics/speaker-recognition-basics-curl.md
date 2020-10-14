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

## Prerequisites

This article assumes that you have an Azure account and Speech service subscription. If you don't have an account and subscription, [try the Speech service for free](../../../overview.md#try-the-speech-service-for-free).

> [!IMPORTANT]
> Speaker Recognition is currently *only* supported in Azure Speech resources created in the `westus` region.

## Text-dependent verification

Speaker Verification is the act of confirming that a speaker matches a known, or **enrolled** voice. The first step is to **enroll** a voice profile, so that the service has something to compare future voice samples against. In this example, you enroll the profile using a **text-dependent** strategy, which requires a specific passphrase to use for both enrollment and verification. See the [reference docs](https://docs.microsoft.com/rest/api/speakerrecognition/) for a list of supported passphrases.

Start by [creating a voice profile](https://docs.microsoft.com/rest/api/speakerrecognition/verification/textdependent/createprofile). You will need to insert your Speech service subscription key and region into each of the curl commands in this article.

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tdv_create_profile":::

Note there are three types of voice profile:

- Text-dependent verification
- Text-independent verification
- Text-independent identification

In this case, you create a text-dependent verification voice profile. You should receive the following response.

:::code language="json" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tdv_create_profile_response":::

Next, you [enroll the voice profile](https://docs.microsoft.com/rest/api/speakerrecognition/verification/textdependent/createenrollment). For the `--data-binary` parameter value, specify an audio file on your computer that contains one of the supported passphrases, such as "my voice is my passport, verify me." You can record such an audio file with an app such as [Windows Voice Recorder](https://www.microsoft.com/p/windows-voice-recorder/9wzdncrfhwkn?activetab=pivot:overviewtab), or you can generate it using [text -to-speech](https://docs.microsoft.com/azure/cognitive-services/speech-service/index-text-to-speech).

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tdv_enroll":::

You should receive the following response.

:::code language="json" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tdv_enroll_response_1":::

This response tells you that you need to enroll two more audio samples.

After you have enrolled a total of three audio samples, you should receive the following response.

:::code language="json" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tdv_enroll_response_2":::

Now you are ready to [verify an audio sample against the voice profile](https://docs.microsoft.com/rest/api/speakerrecognition/verification/textdependent/verifyprofile). This audio sample should contain the same passphrase as the samples you used to enroll the voice profile.

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tdv_verify":::

You should receive the following response.

:::code language="json" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tdv_verify_response":::

The `Accept` means the passphrase matched and the verification was successful. The response also contains a similarity score ranging from 0.0-1.0.

To finish, [delete the voice profile](https://docs.microsoft.com/rest/api/speakerrecognition/verification/textdependent/deleteprofile).

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tdv_delete_profile":::

There is no response.

## Text-independent verification

In contrast to **text-dependent** verification, **text-independent** verification:

* Does not require a certain passphrase to be spoken, anything can be spoken
* Does not require three audio samples, but *does* require 20 seconds of total audio

Start by [creating a text-independent verification profile](https://docs.microsoft.com/rest/api/speakerrecognition/verification/textindependent/createprofile).

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tiv_create_profile":::

You should receive the following response.

:::code language="json" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tiv_create_profile_response":::

Next, [enroll the voice profile](https://docs.microsoft.com/rest/api/speakerrecognition/verification/textindependent/createenrollment). Again, rather than submitting three audio samples, you need to submit audio samples that contain a total of 20 seconds of audio.

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tiv_enroll":::

Once you have submitted enough audio samples, you should receive the following response.

:::code language="json" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tiv_enroll_response":::

Now you are ready to [verify an audio sample against the voice profile](https://docs.microsoft.com/rest/api/speakerrecognition/verification/textindependent/verifyprofile). Again, this audio sample does not need to contain a passphrase. It can contain any speech, as long as it contains a total of at least four seconds of audio.

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tiv_verify":::

You should receive the following response.

:::code language="json" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tiv_verify_response":::

The `Accept` means the verification was successful. The response also contains a similarity score ranging from 0.0-1.0.

To finish, [delete the voice profile](https://docs.microsoft.com/rest/api/speakerrecognition/verification/textindependent/deleteprofile).

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tiv_delete_profile":::

There is no response.

## Speaker identification

Speaker Identification is used to determine **who** is speaking from a given group of enrolled voices. The process is similar to **text-independent verification**, with the main difference being able to verify against multiple voice profiles at once, rather than verifying against a single profile.

Start by [creating a text-independent identification profile](https://docs.microsoft.com/rest/api/speakerrecognition/identification/textindependent/createprofile).

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tii_create_profile":::

You should receive the following response.

:::code language="json" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tii_create_profile_response":::

Next, you [enroll the voice profile](https://docs.microsoft.com/rest/api/speakerrecognition/identification/textindependent/createenrollment). Again, you need to submit audio samples that contain a total of 20 seconds of audio. These samples do not need to contain a passphrase.

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tii_enroll":::

Once you have submitted enough audio samples, you should receive the following response.

:::code language="json" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tii_enroll_response_2":::

Now you are ready to [identify an audio sample using the voice profile](https://docs.microsoft.com/rest/api/speakerrecognition/identification/textindependent/identifysinglespeaker). The identify command accepts a comma-delimited list of possible voice profile IDs. In this case, you'll just pass in the ID of the voice profile you created previously. However, if you want, you can pass in multiple voice profile IDs where each voice profile is enrolled with audio samples from a different voice.

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tii_identify":::

You should receive the following response.

:::code language="json" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tii_identify_response":::

The response contains the ID of the voice profile that most closely matches the audio sample you submitted. It also contains a list of candidate voice profiles, ranked in order of similarity.

To finish, [delete the voice profile](https://docs.microsoft.com/rest/api/speakerrecognition/identification/textindependent/deleteprofile).

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speaker-recognition.sh" id="tii_delete_profile":::

There is no response.
