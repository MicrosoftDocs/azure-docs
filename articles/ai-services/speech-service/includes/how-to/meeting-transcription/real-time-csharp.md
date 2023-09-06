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
The Speech SDK is available as a [NuGet package](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech) and implements .NET Standard 2.0. You install the Speech SDK later in this guide, but first check the [platform-specific installation instructions](../../../quickstarts/setup-platform.md?pivots=programming-language-csharp) for any more requirements.

## Create voice signatures

If you want to enroll user profiles, the first step is to create voice signatures for the meeting participants so that they can be identified as unique speakers. This isn't required if you don't want to use pre-enrolled user profiles to identify specific participants.

The input `.wav` audio file for creating voice signatures must be 16-bit, 16-kHz sample rate, in single channel (mono) format. The recommended length for each audio sample is between 30 seconds and two minutes. An audio sample that is too short results in reduced accuracy when recognizing the speaker. The `.wav` file should be a sample of one person's voice so that a unique voice profile is created.

The following example shows how to create a voice signature by [using the REST API](https://aka.ms/cts/signaturegenservice) in C#. You must insert your `subscriptionKey`, `region`, and the path to a sample `.wav` file.

```csharp
using System;
using System.IO;
using System.Net.Http;
using System.Runtime.Serialization;
using System.Threading.Tasks;
using Newtonsoft.Json;

[DataContract]
internal class VoiceSignature
{
    [DataMember]
    public string Status { get; private set; }

    [DataMember]
    public VoiceSignatureData Signature { get; private set; }

    [DataMember]
    public string Transcription { get; private set; }
}

[DataContract]
internal class VoiceSignatureData
{
    internal VoiceSignatureData()
    { }

    internal VoiceSignatureData(int version, string tag, string data)
    {
        this.Version = version;
        this.Tag = tag;
        this.Data = data;
    }

    [DataMember]
    public int Version { get; private set; }

    [DataMember]
    public string Tag { get; private set; }

    [DataMember]
    public string Data { get; private set; }
}

private static async Task<string> GetVoiceSignatureString()
{
    var subscriptionKey = "your-subscription-key";
    var region = "your-region";

    byte[] fileBytes = File.ReadAllBytes("path-to-voice-sample.wav");
    var content = new ByteArrayContent(fileBytes);
    var client = new HttpClient();
    client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);
    var response = await client.PostAsync($"https://signature.{region}.cts.speech.microsoft.com/api/v1/Signature/GenerateVoiceSignatureFromByteArray", content);
    
    var jsonData = await response.Content.ReadAsStringAsync();
    var result = JsonConvert.DeserializeObject<VoiceSignature>(jsonData);
    return JsonConvert.SerializeObject(result.Signature);
}
```

Running the function `GetVoiceSignatureString()` returns a voice signature string in the correct format. Run the function twice so you have two strings to use as input to the variables `voiceSignatureStringUser1` and `voiceSignatureStringUser2` below.

> [!NOTE]
> Voice signatures can **only** be created using the REST API.

## Transcribe meetings

The following sample code demonstrates how to transcribe meetings in real-time for two speakers. It assumes you've already created voice signature strings for each speaker as shown above. Substitute real information for `subscriptionKey`, `region`, and the path `filepath` for the audio you want to transcribe.

If you don't use pre-enrolled user profiles, it takes a few more seconds to complete the first recognition of unknown users as speaker1, speaker2, etc.

> [!NOTE]
> Make sure the same `subscriptionKey` is used across your application for signature creation, or you will encounter errors. 

This sample code does the following:

* Creates an `AudioConfig` from the sample `.wav` file to transcribe.
* Creates a `Meeting` using `CreateMeetingAsync()`.
* Creates a `MeetingTranscriber` using the constructor, and subscribes to the necessary events.
* Adds participants to the meeting. The strings `voiceSignatureStringUser1` and `voiceSignatureStringUser2` should come as output from the steps above from the function `GetVoiceSignatureString()`.
* Joins the meeting and begins transcription.
* If you want to differentiate speakers without providing voice samples, enable the `DifferentiateGuestSpeakers` feature as in [Meeting Transcription Overview](../../../meeting-transcription.md). 

> [!NOTE]
> `AudioStreamReader` is a helper class you can get on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/quickstart/csharp/dotnet/meeting-transcription/helloworld/AudioStreamReader.cs).

If speaker identification or differentiate is enabled, then even if you have already received `Transcribed` results, the service is still evaluating them by accumulated audio information. If the service finds that any previous result was assigned an incorrect `UserId`, then a nearly identical `Transcribed` result is sent again, where only the `UserId` and `UtteranceId` are different. Since the `UtteranceId` format is `{index}_{UserId}_{Offset}`, when you receive a `Transcribed` result, you could use `UtteranceId` to determine if the current `Transcribed` result is going to correct a previous one. Your client or UI logic could decide behaviors, like overwriting previous output, or to ignore the latest result.

Call the function `TranscribeMeetingsAsync()` to start meeting transcription.

```csharp
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;
using Microsoft.CognitiveServices.Speech.Transcription;

class TranscribeMeeting
{
    // all your other code

    public static async Task TranscribeMeetingsAsync(string voiceSignatureStringUser1, string voiceSignatureStringUser2)
    {
        var subscriptionKey = "your-subscription-key";
        var region = "your-region";
        var filepath = "audio-file-to-transcribe.wav";

        var config = SpeechConfig.FromSubscription(subscriptionKey, region);
        config.SetProperty("ConversationTranscriptionInRoomAndOnline", "true");

        // en-us by default. Adding this code to specify other languages, like zh-cn.
        // config.SpeechRecognitionLanguage = "zh-cn";
        var stopRecognition = new TaskCompletionSource<int>();

        using (var audioInput = AudioConfig.FromWavFileInput(filepath))
        {
            var meetingID = Guid.NewGuid().ToString();
            using (var meeting = await Meeting.CreateMeetingAsync(config, meetingID))
            {
                // create a meeting transcriber using audio stream input
                using (var meetingTranscriber = new MeetingTranscriber(audioInput))
                {
                    meetingTranscriber.Transcribing += (s, e) =>
                    {
                        Console.WriteLine($"TRANSCRIBING: Text={e.Result.Text} SpeakerId={e.Result.UserId}");
                    };

                    meetingTranscriber.Transcribed += (s, e) =>
                    {
                        if (e.Result.Reason == ResultReason.RecognizedSpeech)
                        {
                            Console.WriteLine($"TRANSCRIBED: Text={e.Result.Text} SpeakerId={e.Result.UserId}");
                        }
                        else if (e.Result.Reason == ResultReason.NoMatch)
                        {
                            Console.WriteLine($"NOMATCH: Speech could not be recognized.");
                        }
                    };

                    meetingTranscriber.Canceled += (s, e) =>
                    {
                        Console.WriteLine($"CANCELED: Reason={e.Reason}");

                        if (e.Reason == CancellationReason.Error)
                        {
                            Console.WriteLine($"CANCELED: ErrorCode={e.ErrorCode}");
                            Console.WriteLine($"CANCELED: ErrorDetails={e.ErrorDetails}");
                            Console.WriteLine($"CANCELED: Did you set the speech resource key and region values?");
                            stopRecognition.TrySetResult(0);
                        }
                    };

                    meetingTranscriber.SessionStarted += (s, e) =>
                    {
                        Console.WriteLine($"\nSession started event. SessionId={e.SessionId}");
                    };

                    meetingTranscriber.SessionStopped += (s, e) =>
                    {
                        Console.WriteLine($"\nSession stopped event. SessionId={e.SessionId}");
                        Console.WriteLine("\nStop recognition.");
                        stopRecognition.TrySetResult(0);
                    };

                    // Add participants to the meeting.
                    var speaker1 = Participant.From("User1", "en-US", voiceSignatureStringUser1);
                    var speaker2 = Participant.From("User2", "en-US", voiceSignatureStringUser2);
                    await meeting.AddParticipantAsync(speaker1);
                    await meeting.AddParticipantAsync(speaker2);

                    // Join to the meeting and start transcribing
                    await meetingTranscriber.JoinMeetingAsync(meeting);
                    await meetingTranscriber.StartTranscribingAsync().ConfigureAwait(false);

                    // waits for completion, then stop transcription
                    Task.WaitAny(new[] { stopRecognition.Task });
                    await meetingTranscriber.StopTranscribingAsync().ConfigureAwait(false);
                }
            }
        }
    }
}
```

