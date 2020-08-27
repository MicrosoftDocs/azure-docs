---
title: "Speaker Recognition basics - Speech service"
titleSuffix: Azure Cognitive Services
description: Learn how to use the Speech SDK to answer the question, "who is speaking". In this article, you'll learn about common design patterns for working with both speaker verification and identification.
services: cognitive-services
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 06/05/2020
ms.author: trbye
---

# Learn the basics of Speaker Recognition

In this article, you learn basic design patterns for Speaker Recognition using the Speech SDK, including:

* Text-dependent and text-independent verification
* Speaker identification to identify a voice sample among a group of voices
* Deleting voice profiles

For a high-level look at Speech Recognition concepts, see the [overview](speaker-recognition-overview.md) article.

## Prerequisites

This article assumes that you have an Azure account and Speech service subscription. If you don't have an account and subscription, [try the Speech service for free](get-started.md).

> [!IMPORTANT]
> Speaker Recognition is currently *only* supported in Azure Speech resources created in the `westus` region.

## Install the Speech SDK

Before you can do anything, you'll need to install the Speech SDK. Depending on your platform, use the following instructions:

* <a href="https://docs.microsoft.com/azure/cognitive-services/speech-service/quickstarts/setup-platform?tabs=dotnet&pivots=programming-language-csharp" target="_blank">.NET Framework <span class="docon docon-navigate-external x-hidden-focus"></span></a>
* <a href="https://docs.microsoft.com/azure/cognitive-services/speech-service/quickstarts/setup-platform?tabs=dotnetcore&pivots=programming-language-csharp" target="_blank">.NET Core <span class="docon docon-navigate-external x-hidden-focus"></span></a>
* <a href="https://docs.microsoft.com/azure/cognitive-services/speech-service/quickstarts/setup-platform?tabs=unity&pivots=programming-language-csharp" target="_blank">Unity <span class="docon docon-navigate-external x-hidden-focus"></span></a>
* <a href="https://docs.microsoft.com/azure/cognitive-services/speech-service/quickstarts/setup-platform?tabs=uwps&pivots=programming-language-csharp" target="_blank">UWP <span class="docon docon-navigate-external x-hidden-focus"></span></a>
* <a href="https://docs.microsoft.com/azure/cognitive-services/speech-service/quickstarts/setup-platform?tabs=xaml&pivots=programming-language-csharp" target="_blank">Xamarin <span class="docon docon-navigate-external x-hidden-focus"></span></a>

## Import dependencies

To run the examples in this article, include the following `using` statements at the top of your script.

```csharp
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;
```

## Create a speech configuration

To call the Speech service using the Speech SDK, you need to create a [`SpeechConfig`](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.speechconfig?view=azure-dotnet). In this example, you create a [`SpeechConfig`](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.speechconfig?view=azure-dotnet) using a subscription key and region. You also create some basic boilerplate code to use for the rest of this article, which you modify for different customizations.

Note that the region is set to `westus`, as it is the only supported region for the service.

```csharp
public class Program 
{
    static async Task Main(string[] args)
    {
        // replace with your own subscription key 
        string subscriptionKey = "YourSubscriptionKey";
        string region = "westus";
        var config = SpeechConfig.FromSubscription(subscriptionKey, region);
    }
}
```

## Text-dependent verification

Speaker Verification is the act of confirming that a speaker matches a known, or **enrolled** voice. The first step is to **enroll** a voice profile, so that the service has something to compare future voice samples against. In this example, you enroll the profile using a **text-dependent** strategy, which requires a specific pass-phrase to use for both enrollment and verification. See the [reference docs](https://docs.microsoft.com/rest/api/speakerrecognition/) for a list of supported pass-phrases.

Start by creating the following function in your `Program` class to enroll a voice profile.

```csharp
public static async Task VerificationEnroll(SpeechConfig config, Dictionary<string, string> profileMapping)
{
    using (var client = new VoiceProfileClient(config))
    using (var profile = await client.CreateProfileAsync(VoiceProfileType.TextDependentVerification, "en-us"))
    {
        using (var audioInput = AudioConfig.FromDefaultMicrophoneInput())
        {
            Console.WriteLine($"Enrolling profile id {profile.Id}.");
            // give the profile a human-readable display name
            profileMapping.Add(profile.Id, "Your Name");

            VoiceProfileEnrollmentResult result = null;
            while (result is null || result.RemainingEnrollmentsCount > 0)
            {
                Console.WriteLine("Speak the passphrase, \"My voice is my passport, verify me.\"");
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

In this function, `await client.CreateProfileAsync()` is what actually creates the new voice profile. After it is created, you specify how you will input audio samples, using `AudioConfig.FromDefaultMicrophoneInput()` in this example to capture audio from your default input device. Next, you enroll audio samples in a `while` loop that tracks the number of samples remaining, and required, for enrollment. In each iteration, `client.EnrollProfileAsync(profile, audioInput)` will prompt you to speak the pass-phrase into your microphone, and add the sample to the voice profile.

After enrollment is completed, you call `await SpeakerVerify(config, profile, profileMapping)` to verify against the profile you just created. Add another function to define `SpeakerVerify`.

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

In this function, you pass the `VoiceProfile` object you just created to initialize a model to verify against. Next, `await speakerRecognizer.RecognizeOnceAsync(model)` prompts you to speak the pass-phrase again, but this time it will validate it against your voice profile and return a similarity score ranging from 0.0-1.0. The `result` object also returns `Accept` or `Reject`, based on whether or not the pass-phrase matches.

Next, modify your `Main()` function to call the new functions you created. Additionally, note that you create a `Dictionary<string, string>` to pass by reference through your function calls. The reason for this is that the service does not allow storing a human-readable name with a created `VoiceProfile`, and only stores an ID number for privacy purposes. In the `VerificationEnroll` function, you add to this dictionary an entry with the newly created ID, along with a text name. In application development scenarios where you need to display a human-readable name, **you must store this mapping somewhere, the service cannot store it**.

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

Run the script, and you are prompted to speak the phrase *My voice is my passport, verify me* three times for enrollment, and one additional time for verification. The result returned is the similarity score, which you can use to create your own custom thresholds for verification.

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

In contrast to **text-dependent** verification, **text-independent** verification:

* Does not require a certain pass-phrase to be spoken, anything can be spoken
* Does not require three audio samples, but *does* require 20-seconds of total audio

Make a couple simple changes to your `VerificationEnroll` function to switch to **text-independent** verification. First, you change the verification type to `VoiceProfileType.TextIndependentVerification`. Next, change the `while` loop to track `result.RemainingEnrollmentsSpeechLength`, which will continue to prompt you to speak until 20 seconds of audio have been captured.

```csharp
public static async Task VerificationEnroll(SpeechConfig config, Dictionary<string, string> profileMapping)
{
    using (var client = new VoiceProfileClient(config))
    using (var profile = await client.CreateProfileAsync(VoiceProfileType.TextIndependentVerification, "en-us"))
    {
        using (var audioInput = AudioConfig.FromDefaultMicrophoneInput())
        {
            Console.WriteLine($"Enrolling profile id {profile.Id}.");
            // give the profile a human-readable display name
            profileMapping.Add(profile.Id, "Your Name");

            VoiceProfileEnrollmentResult result = null;
            while (result is null || result.RemainingEnrollmentsSpeechLength > TimeSpan.Zero)
            {
                Console.WriteLine("Continue speaking to add to the profile enrollment sample.");
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

Run the program again, and speak anything during the verification phase since a pass-phrase is not required. Again, the similarity score is returned.

```shell
Enrolling profile id 4tt87d4-f2d3-44ae-b5b4-f1a8d4036ee9.
Continue speaking to add to the profile enrollment sample.
Remaining enrollment audio time needed: 00:00:15.3200000

Continue speaking to add to the profile enrollment sample.
Remaining enrollment audio time needed: 00:00:09.8100008

Continue speaking to add to the profile enrollment sample.
Remaining enrollment audio time needed: 00:00:05.1900000

Continue speaking to add to the profile enrollment sample.
Remaining enrollment audio time needed: 00:00:00.8700000

Continue speaking to add to the profile enrollment sample.
Remaining enrollment audio time needed: 00:00:00

Speak the passphrase to verify: "My voice is my passport, please verify me."
Verified voice profile for speaker Your Name, score is 0.849409
```

## Speaker identification

Speaker Identification is used to determine **who** is speaking from a given group of enrolled voices. The process is very similar to **text-independent verification**, with the main difference being able to verify against multiple voice profiles at once, rather than verifying against a single profile.

Create a function `IdentificationEnroll` to enroll multiple voice profiles. The enrollment process for each profile is the same as the enrollment process for **text-independent verification**, and requires 20 seconds of audio for each profile. This function accepts a list of strings `profileNames`, and will create a new voice profile for each name in the list. The function returns a list of `VoiceProfile` objects, which you use in the next function for identifying a speaker.

```csharp
public static async Task<List<VoiceProfile>> IdentificationEnroll(SpeechConfig config, List<string> profileNames, Dictionary<string, string> profileMapping)
{
    List<VoiceProfile> voiceProfiles = new List<VoiceProfile>();
    using (var client = new VoiceProfileClient(config))
    {
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
                    Console.WriteLine($"Continue speaking to add to the profile enrollment sample for {name}.");
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

Create the following function `SpeakerIdentification` to submit an identification request. The main difference in this function compared to a **speaker verification** request is the use of `SpeakerIdentificationModel.FromProfiles()`, which accepts a list of `VoiceProfile` objects. 

```csharp
public static async Task SpeakerIdentification(SpeechConfig config, List<VoiceProfile> voiceProfiles, Dictionary<string, string> profileMapping) 
{
    var speakerRecognizer = new SpeakerRecognizer(config, AudioConfig.FromDefaultMicrophoneInput());
    var model = SpeakerIdentificationModel.FromProfiles(voiceProfiles);

    Console.WriteLine("Speak some text to identify who it is from your list of enrolled speakers.");
    var result = await speakerRecognizer.RecognizeOnceAsync(model);
    Console.WriteLine($"The most similiar voice profile is {profileMapping[result.ProfileId]} with similiarity score {result.Score}");
}
```

Change your `Main()` function to the following. You create a list of strings `profileNames`, which you pass to your `IdentificationEnroll()` function. This will prompt you to create a new voice profile for each name in this list, so you can add more names to create additional profiles for friends or colleagues.

```csharp
static async Task Main(string[] args)
{
    // replace with your own subscription key 
    string subscriptionKey = "YourSubscriptionKey";
    string region = "westus";
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

Run the script, and you are prompted to speak to enroll voice samples for the first profile. After the enrollment is completed, you are prompted to repeat this process for each name in the list `profileNames`. After each enrollment is finished, you are prompted to have **anyone** speak, and the service will attempt to identify this person from among your enrolled voice profiles.

This example returns only the closest match and it's similarity score, but you can get the full response that includes the top five similarity scores by adding `string json = result.Properties.GetProperty(PropertyId.SpeechServiceResponse_JsonResult)` to your `SpeakerIdentification` function.

## Changing audio input type

The examples in this article use the default device microphone as input for audio samples. However, in scenarios where you need to use audio files instead of microphone input, simply change any instance of `AudioConfig.FromDefaultMicrophoneInput()` to `AudioConfig.FromWavFileInput(path/to/your/file.wav)` to switch to a file input. You can also have mixed inputs, using a microphone for enrollment and files for verification, for example.

## Deleting voice profile enrollments

To delete an enrolled profile, use the `DeleteProfileAsync()` function on the `VoiceProfileClient` object. The following example function shows how to delete a voice profile from a known voice profile ID.

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

## Next steps

* See the Speaker Recognition [reference documentation](https://docs.microsoft.com/rest/api/speakerrecognition/) for detail on classes and functions.

* See [C#](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/csharp/dotnet/speaker-recognition) and [C++](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/cpp/windows/speaker-recognition) samples on GitHub.

