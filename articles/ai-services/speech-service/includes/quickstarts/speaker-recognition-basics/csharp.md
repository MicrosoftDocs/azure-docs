---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 01/08/2022
author: eur
ms.custom: references_regions, ignite-fall-2021
---

[!INCLUDE [Header](../../common/csharp.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

### Install the Speech SDK

Before you start, you must install the Speech SDK. Depending on your platform, use the following instructions:

* <a href="~/articles/ai-services/speech-service/quickstarts/setup-platform.md?pivots=programming-language-csharp&tabs=dotnet" target="_blank">.NET Framework </a>
* <a href="~/articles/ai-services/speech-service/quickstarts/setup-platform.md?pivots=programming-language-csharp&tabs=dotnetcore" target="_blank">.NET Core </a>
* <a href="~/articles/ai-services/speech-service/quickstarts/setup-platform.md?pivots=programming-language-csharp&tabs=unity" target="_blank">Unity </a>
* <a href="~/articles/ai-services/speech-service/quickstarts/setup-platform.md?pivots=programming-language-csharp&tabs=uwps" target="_blank">UWP </a>
* <a href="~/articles/ai-services/speech-service/quickstarts/setup-platform.md?pivots=programming-language-csharp&tabs=xaml" target="_blank">Xamarin </a>

### Import dependencies

To run the examples in this article, include the following `using` statements at the top of your script:

```csharp
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;
```

## Create a speech configuration

To call the Speech service by using the Speech SDK, you need to create a [`SpeechConfig`](/dotnet/api/microsoft.cognitiveservices.speech.speechconfig) instance. In this example, you create a `SpeechConfig` instance by using a subscription key and region. You also create some basic boilerplate code to use for the rest of this article, which you modify for different customizations.

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../use-key-vault.md). See the Azure AI services [security](../../../../security-features.md) article for more information.

```csharp
public class Program 
{
    static async Task Main(string[] args)
    {
        // replace with your own subscription key 
        string subscriptionKey = "YourSubscriptionKey";
        // replace with your own subscription region 
        string region = "YourSubscriptionRegion";
        var config = SpeechConfig.FromSubscription(subscriptionKey, region);
    }
}
```

## Text-dependent verification

Speaker verification is the act of confirming that a speaker matches a known, or *enrolled*, voice. The first step is to enroll a voice profile so that the service has something to compare future voice samples against. In this example, you enroll the profile by using a *text-dependent* strategy, which requires a specific passphrase to use for enrollment and verification. See the [reference docs](/rest/api/speakerrecognition/) for a list of supported passphrases.

Start by creating the following function in your `Program` class to enroll a voice profile:

```csharp
public static async Task VerificationEnroll(SpeechConfig config, Dictionary<string, string> profileMapping)
{
    using (var client = new VoiceProfileClient(config))
    using (var profile = await client.CreateProfileAsync(VoiceProfileType.TextDependentVerification, "en-us"))
    {
        var phraseResult = await client.GetActivationPhrasesAsync(VoiceProfileType.TextDependentVerification, "en-us");
        using (var audioInput = AudioConfig.FromDefaultMicrophoneInput())
        {
            Console.WriteLine($"Enrolling profile id {profile.Id}.");
            // give the profile a human-readable display name
            profileMapping.Add(profile.Id, "Your Name");

            VoiceProfileEnrollmentResult result = null;
            while (result is null || result.RemainingEnrollmentsCount > 0)
            {
                Console.WriteLine($"Speak the passphrase, \"${phraseResult.Phrases[0]}\"");
                result = await client.EnrollProfileAsync(profile, audioInput);
                Console.WriteLine($"Remaining enrollments needed: {result.RemainingEnrollmentsCount}");
                Console.WriteLine("");
            }
            
            if (result.Reason == ResultReason.EnrolledVoiceProfile)
            {
                await SpeakerVerify(config, profile, profileMapping);
            }
            else if (result.Reason == ResultReason.Canceled)
            {
                var cancellation = VoiceProfileEnrollmentCancellationDetails.FromResult(result);
                Console.WriteLine($"CANCELED {profile.Id}: ErrorCode={cancellation.ErrorCode} ErrorDetails={cancellation.ErrorDetails}");
            }
        }
    }
}
```

In this function, `await client.CreateProfileAsync()` is what actually creates the new voice profile. After it's created, you specify how you'll input audio samples by using `AudioConfig.FromDefaultMicrophoneInput()` in this example to capture audio from your default input device. Next, you enroll audio samples in a `while` loop that tracks the number of samples remaining, and that are required, for enrollment. In each iteration, `client.EnrollProfileAsync(profile, audioInput)` prompts you to speak the passphrase into your microphone and adds the sample to the voice profile.

After enrollment is finished, call `await SpeakerVerify(config, profile, profileMapping)` to verify against the profile you just created. Add another function to define `SpeakerVerify`.

```csharp
public static async Task SpeakerVerify(SpeechConfig config, VoiceProfile profile, Dictionary<string, string> profileMapping)
{
    var speakerRecognizer = new SpeakerRecognizer(config, AudioConfig.FromDefaultMicrophoneInput());
    var model = SpeakerVerificationModel.FromProfile(profile);

    Console.WriteLine("Speak the passphrase to verify: \"My voice is my passport, please verify me.\"");
    var result = await speakerRecognizer.RecognizeOnceAsync(model);
    Console.WriteLine($"Verified voice profile for speaker {profileMapping[result.ProfileId]}, score is {result.Score}");
}
```

In this function, you pass the `VoiceProfile` object you just created to initialize a model to verify against. Next, `await speakerRecognizer.RecognizeOnceAsync(model)` prompts you to speak the passphrase again. This time it validates it against your voice profile and returns a similarity score that ranges from 0.0 to 1.0. The `result` object also returns `Accept` or `Reject`, based on whether the passphrase matches.

Next, modify your `Main()` function to call the new functions you created. Also, note that you create a `Dictionary<string, string>` to pass by reference through your function calls. The reason for this is that the service doesn't allow storing a human-readable name with a created `VoiceProfile`, and it only stores an ID number for privacy purposes. In the `VerificationEnroll` function, you add to this dictionary an entry with the newly created ID, along with a text name. In application development scenarios where you need to display a human-readable name, *you must store this mapping somewhere because the service can't store it*.

```csharp
static async Task Main(string[] args)
{
    string subscriptionKey = "YourSubscriptionKey";
    string region = "westus";
    var config = SpeechConfig.FromSubscription(subscriptionKey, region);

    // persist profileMapping if you want to store a record of who the profile is
    var profileMapping = new Dictionary<string, string>();
    await VerificationEnroll(config, profileMapping);

    Console.ReadLine();
}
```

Run the script. You're prompted to speak the phrase "My voice is my passport, verify me" three times for enrollment, and one more time for verification. The result returned is the similarity score, which you can use to create your own custom thresholds for verification.

```shell
Enrolling profile id 87-2cef-4dff-995b-dcefb64e203f.
Speak the passphrase, "My voice is my passport, verify me."
Remaining enrollments needed: 2

Speak the passphrase, "My voice is my passport, verify me."
Remaining enrollments needed: 1

Speak the passphrase, "My voice is my passport, verify me."
Remaining enrollments needed: 0

Speak the passphrase to verify: "My voice is my passport, verify me."
Verified voice profile for speaker Your Name, score is 0.915581
```

## Text-independent verification

In contrast to *text-dependent* verification, *text-independent* verification doesn't require three audio samples but *does* require 20 seconds of total audio.

Make a couple simple changes to your `VerificationEnroll` function to switch to *text-independent* verification. First, you change the verification type to `VoiceProfileType.TextIndependentVerification`. Next, change the `while` loop to track `result.RemainingEnrollmentsSpeechLength`, which will continue to prompt you to speak until 20 seconds of audio have been captured.

```csharp
public static async Task VerificationEnroll(SpeechConfig config, Dictionary<string, string> profileMapping)
{
    using (var client = new VoiceProfileClient(config))
    using (var profile = await client.CreateProfileAsync(VoiceProfileType.TextIndependentVerification, "en-us"))
    {
        var phraseResult = await client.GetActivationPhrasesAsync(VoiceProfileType.TextIndependentVerification, "en-us");
        using (var audioInput = AudioConfig.FromDefaultMicrophoneInput())
        {
            Console.WriteLine($"Enrolling profile id {profile.Id}.");
            // give the profile a human-readable display name
            profileMapping.Add(profile.Id, "Your Name");

            VoiceProfileEnrollmentResult result = null;
            while (result is null || result.RemainingEnrollmentsSpeechLength > TimeSpan.Zero)
            {
                Console.WriteLine($"Speak the activation phrase, \"${phraseResult.Phrases[0]}\"");
                result = await client.EnrollProfileAsync(profile, audioInput);
                Console.WriteLine($"Remaining enrollment audio time needed: {result.RemainingEnrollmentsSpeechLength}");
                Console.WriteLine("");
            }
            
            if (result.Reason == ResultReason.EnrolledVoiceProfile)
            {
                await SpeakerVerify(config, profile, profileMapping);
            }
            else if (result.Reason == ResultReason.Canceled)
            {
                var cancellation = VoiceProfileEnrollmentCancellationDetails.FromResult(result);
                Console.WriteLine($"CANCELED {profile.Id}: ErrorCode={cancellation.ErrorCode} ErrorDetails={cancellation.ErrorDetails}");
            }
        }
    }
}
```

Run the program again, and the similarity score is returned.

```shell
Enrolling profile id 4tt87d4-f2d3-44ae-b5b4-f1a8d4036ee9.
Speak the activation phrase, "<FIRST ACTIVATION PHRASE>"
Remaining enrollment audio time needed: 00:00:15.3200000

Speak the activation phrase, "<FIRST ACTIVATION PHRASE>"
Remaining enrollment audio time needed: 00:00:09.8100008

Speak the activation phrase, "<FIRST ACTIVATION PHRASE>"
Remaining enrollment audio time needed: 00:00:05.1900000

Speak the activation phrase, "<FIRST ACTIVATION PHRASE>"
Remaining enrollment audio time needed: 00:00:00.8700000

Speak the activation phrase, "<FIRST ACTIVATION PHRASE>"
Remaining enrollment audio time needed: 00:00:00

Speak the passphrase to verify: "My voice is my passport, please verify me."
Verified voice profile for speaker Your Name, score is 0.849409
```

## Speaker identification

Speaker identification is used to determine *who* is speaking from a given group of enrolled voices. The process is similar to *text-independent verification*. The main difference is the capability to verify against multiple voice profiles at once rather than verifying against a single profile.

Create a function `IdentificationEnroll` to enroll multiple voice profiles. The enrollment process for each profile is the same as the enrollment process for *text-independent verification*. The process requires 20 seconds of audio for each profile. This function accepts a list of strings `profileNames` and will create a new voice profile for each name in the list. The function returns a list of `VoiceProfile` objects, which you use in the next function for identifying a speaker.

```csharp
public static async Task<List<VoiceProfile>> IdentificationEnroll(SpeechConfig config, List<string> profileNames, Dictionary<string, string> profileMapping)
{
    List<VoiceProfile> voiceProfiles = new List<VoiceProfile>();
    using (var client = new VoiceProfileClient(config))
    {
        var phraseResult = await client.GetActivationPhrasesAsync(VoiceProfileType.TextIndependentVerification, "en-us");
        foreach (string name in profileNames)
        {
            using (var audioInput = AudioConfig.FromDefaultMicrophoneInput())
            {
                var profile = await client.CreateProfileAsync(VoiceProfileType.TextIndependentIdentification, "en-us");
                Console.WriteLine($"Creating voice profile for {name}.");
                profileMapping.Add(profile.Id, name);

                VoiceProfileEnrollmentResult result = null;
                while (result is null || result.RemainingEnrollmentsSpeechLength > TimeSpan.Zero)
                {
                    Console.WriteLine($"Speak the activation phrase, \"${phraseResult.Phrases[0]}\" to add to the profile enrollment sample for {name}.");
                    result = await client.EnrollProfileAsync(profile, audioInput);
                    Console.WriteLine($"Remaining enrollment audio time needed: {result.RemainingEnrollmentsSpeechLength}");
                    Console.WriteLine("");
                }
                voiceProfiles.Add(profile);
            }
        }
    }
    return voiceProfiles;
}
```

Create the following function `SpeakerIdentification` to submit an identification request. The main difference in this function compared to a *speaker verification* request is the use of `SpeakerIdentificationModel.FromProfiles()`, which accepts a list of `VoiceProfile` objects.

```csharp
public static async Task SpeakerIdentification(SpeechConfig config, List<VoiceProfile> voiceProfiles, Dictionary<string, string> profileMapping) 
{
    var speakerRecognizer = new SpeakerRecognizer(config, AudioConfig.FromDefaultMicrophoneInput());
    var model = SpeakerIdentificationModel.FromProfiles(voiceProfiles);

    Console.WriteLine("Speak some text to identify who it is from your list of enrolled speakers.");
    var result = await speakerRecognizer.RecognizeOnceAsync(model);
    Console.WriteLine($"The most similar voice profile is {profileMapping[result.ProfileId]} with similarity score {result.Score}");
}
```

Change your `Main()` function to the following. You create a list of strings `profileNames`, which you pass to your `IdentificationEnroll()` function. You're prompted to create a new voice profile for each name in this list, so you can add more names to create more profiles for friends or colleagues.

```csharp
static async Task Main(string[] args)
{
    // replace with your own subscription key 
    string subscriptionKey = "YourSubscriptionKey";
    // replace with your own subscription region 
    string region = "YourSubscriptionRegion";
    var config = SpeechConfig.FromSubscription(subscriptionKey, region);

    // persist profileMapping if you want to store a record of who the profile is
    var profileMapping = new Dictionary<string, string>();
    var profileNames = new List<string>() { "Your name", "A friend's name" };
    
    var enrolledProfiles = await IdentificationEnroll(config, profileNames, profileMapping);
    await SpeakerIdentification(config, enrolledProfiles, profileMapping);

    foreach (var profile in enrolledProfiles)
    {
        profile.Dispose();
    }
    Console.ReadLine();
}
```

Run the script. You're prompted to speak to enroll voice samples for the first profile. After the enrollment is finished, you're prompted to repeat this process for each name in the `profileNames` list. After each enrollment is finished, you're prompted to have *anyone* speak. The service then attempts to identify this person from among your enrolled voice profiles.

This example returns only the closest match and its similarity score. To get the full response that includes the top five similarity scores, add `string json = result.Properties.GetProperty(PropertyId.SpeechServiceResponse_JsonResult)` to your `SpeakerIdentification` function.

## Change audio input type

The examples in this article use the default device microphone as input for audio samples. In scenarios where you need to use audio files instead of microphone input, change any instance of `AudioConfig.FromDefaultMicrophoneInput()` to `AudioConfig.FromWavFileInput(path/to/your/file.wav)` to switch to a file input. You can also have mixed inputs by using a microphone for enrollment and files for verification, for example.

## Delete voice profile enrollments

To delete an enrolled profile, use the `DeleteProfileAsync()` function on the `VoiceProfileClient` object. The following example function shows how to delete a voice profile from a known voice profile ID:

```csharp
public static async Task DeleteProfile(SpeechConfig config, string profileId) 
{
    using (var client = new VoiceProfileClient(config))
    {
        var profile = new VoiceProfile(profileId);
        await client.DeleteProfileAsync(profile);
    }
}
```
