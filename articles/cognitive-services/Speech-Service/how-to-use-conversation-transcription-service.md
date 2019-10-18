---
title: Transcribe multi-participant conversations in real time with the Speech SDK - Speech Service
titleSuffix: Azure Cognitive Services
description: Learn how to use real-time Conversation Transcription with the Speech SDK. Available for C++, C#, and Java.
services: cognitive-services
author: markamos
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 10/17/2019
ms.author: weixu
---

# Transcribe multi-participant conversations in real time with the Speech SDK

The Speech SDK's **ConversationTranscriber** API allows you to transcribe meetings and other conversations with the ability to add, remove, and identify participants by streaming audio to Speech Services using `PullStream` or `PushStream`.

## Limitations

- The ConversationTranscriber API is supported for C++, C#, and Java on Windows, Linux, and Android.
- Conversation Transcription is currently available in "en-US" and "zh-CN" languages in the following regions: _centralus_ and _eastasia_.
- The ROOBO DevKit is the supported hardware environment for creating conversation transcriptions. This kit provides a circular multi-microphone array that can be utilized efficiently for speaker identification. For more information, see [Speech Devices SDK](speech-devices-sdk.md).
- Speech SDK support for conversation transcription is limited to audio pull and push streams with 8 channels of 16-bit 16 kHz PCM audio. The following kits support 8 channel audio capture:
  - [ROOBO Smart Audio Circular 7-Mic Dev Kit](https://ddk.roobo.com/)
  - [Azure Kinect Dev Kit](https://azure.microsoft.com/en-in/services/kinect-dk/)

## Optional sample code resources

The Speech Device SDK provides sample code in Java for real-time audio capture using 8 channels. The sample then streams the audio into the conversation transcription service.

- The sample code for ROOBO device is located [HERE](https://github.com/Azure-Samples/Cognitive-Services-Speech-Devices-SDK/blob/master/Samples/Android/Speech%20Devices%20SDK%20Starter%20App/example/app/src/main/java/com/microsoft/cognitiveservices/speech/samples/sdsdkstarterapp/Conversation.java).
- The sample code for Azure Kinect Dev Kit is located [HERE](https://github.com/Azure-Samples/Cognitive-Services-Speech-Devices-SDK/blob/master/Samples/Windows_Linux/SampleDemo/src/com/microsoft/cognitiveservices/speech/samples/Cts.java).

## Prerequisites

- Learn how to use Speech-to-text with the Speech SDK version 1.8.0 or later. For more information, see [What are Speech Services](overview.md).
- A Speech Services subscription. You can get a Speech trial subscription [HERE](https://azure.microsoft.com/try/cognitive-services/) if you do not already have one.

## Creating voice signatures for participants

The first step is to create voice signatures for the conversation participants. Creating voice signatures is required for efficient speaker identification.

### Requirements for the input wave file

- The input audio wave file for creating voice signatures should be in 16-bit samples, 16 kHz sample rate, and a single channel (mono) format.
- The recommended length for each audio sample is between thirty seconds and two minutes.

### Sample code to create voice signatures

The following example shows two different ways to create voice signature by [using the REST API](https://aka.ms/cts/signaturegenservice) in C#:

```csharp
class Program
{
    static async Task CreateVoiceSignatureByUsingFormData()
    {
        var region = "YourServiceRegion";
        byte[] fileBytes = File.ReadAllBytes(@"speakerVoice.wav");
        var form = new MultipartFormDataContent();
        var content = new ByteArrayContent(fileBytes);
        form.Add(content, "file", "file");
        var client = new HttpClient();
        client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", "YourSubscriptionKey");
        var response = await client.PostAsync($"https://signature.{region}.cts.speech.microsoft.com/api/v1/Signature/GenerateVoiceSignatureFromFormData", form);
        // A voice signature contains Version, Tag and Data key values from the Signature json structure from the Response body.
        // Voice signature format example: { "Version": <Numeric value>, "Tag": "string", "Data": "string" }
        var jsonData = await response.Content.ReadAsStringAsync();
    }

    static async Task CreateVoiceSignatureByUsingBody()
    {
        var region = "YourServiceRegion";
        byte[] fileBytes = File.ReadAllBytes(@"speakerVoice.wav");
        var content = new ByteArrayContent(fileBytes);

        var client = new HttpClient();
        client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", "YourSubscriptionKey");
        var response = await client.PostAsync($"https://signature.{region}.cts.speech.microsoft.com/api/v1/Signature/GenerateVoiceSignatureFromByteArray", content);
        // A voice signature contains Version, Tag and Data key values from the Signature json structure from the Response body.
        // Voice signature format example: { "Version": <Numeric value>, "Tag": "string", "Data": "string" }
        var jsonData = await response.Content.ReadAsStringAsync();
    }

    static void Main(string[] args)
    {
        CreateVoiceSignatureByUsingFormData().Wait();
        CreateVoiceSignatureByUsingBody().Wait();
    }
}
```

## Transcribing conversations in real time

Refer to the sample code and description below.

```csharp
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;
using Microsoft.CognitiveServices.Speech.Transcription;

public class MyConversationTranscriber
{
    public static async Task ConversationWithPullAudioStreamAsync()
    {
        // Creates an instance of a speech config with specified subscription key and service region.
        // Replace with your own subscription key and region.
        var config = SpeechConfig.FromSubscription("YourSubscriptionKey", "YourServiceRegion");
        config.SetProperty("ConversationTranscriptionInRoomAndOnline", "true");
        var stopTranscription = new TaskCompletionSource<int>();

        // Create an audio stream from a wav file or from the default microphone if you want to stream live audio from the supported devices.
        // Replace with your own audio file name and Helper class which implements AudioConfig using PullAudioInputStreamCallback
        using (var audioInput = Helper.OpenWavFile(@"8channelsOfRecordedPCMAudio.wav"))
        {
            var meetingId = Guid.NewGuid().ToString();
            using (var conversation = new Conversation(config, meetingId))
            {
                    // Creates a conversation transcriber using audio stream input.
                using (var conversationTranscriber = new ConversationTranscriber(audioInput))
                {
                    await conversationTranscriber.JoinConversationAsync(conversation);

                    // Subscribes to events.
                    conversationTranscriber.Transcribing += (s, e) =>
                    {
                            Console.WriteLine($"TRANSCRIBING: Text={e.Result.Text}");
                    };

                    conversationTranscriber.Transcribed += (s, e) =>
                    {
                        if (e.Result.Reason == ResultReason.RecognizedSpeech)
                        {
                            Console.WriteLine($"TRANSCRIBED: Text={e.Result.Text}, UserID={e.Result.UserId}");
                        }
                        else if (e.Result.Reason == ResultReason.NoMatch)
                        {
                            Console.WriteLine($"NOMATCH: Speech could not be recognized.");
                        }
                    };

                    conversationTranscriber.Canceled += (s, e) =>
                    {
                        Console.WriteLine($"CANCELED: Reason={e.Reason}");

                        if (e.Reason == CancellationReason.Error)
                        {
                            Console.WriteLine($"CANCELED: ErrorCode={e.ErrorCode}");
                            Console.WriteLine($"CANCELED: ErrorDetails={e.ErrorDetails}");
                            Console.WriteLine($"CANCELED: Did you update the subscription info?");
                            stopTranscription.TrySetResult(0);
                        }
                    };

                    conversationTranscriber.SessionStarted += (s, e) =>
                    {
                        Console.WriteLine("\nSession started event.");
                    };

                    conversationTranscriber.SessionStopped += (s, e) =>
                    {
                        Console.WriteLine("\nSession stopped event.");
                        Console.WriteLine("\nStop recognition.");
                        stopTranscription.TrySetResult(0);
                    };

                    // Add participants to the conversation.
                    // Create voice signatures using REST API described in the earlier section in this document.
                    // Voice signature needs to be in the following format:
                    // { "Version": <Numeric value>, "Tag": "string", "Data": "string" }

                    var speakerA = Participant.From("Speaker_A", "en-us", signatureA);
                    var speakerB = Participant.From("Speaker_B", "en-us", signatureB);
                    var speakerC = Participant.From("SPeaker_C", "en-us", signatureC);
                    await conversation.AddParticipantAsync(speakerA);
                    await conversation.AddParticipantAsync(speakerB);
                    await conversation.AddParticipantAsync(speakerC);

                    // Starts transcribing of the conversation. Uses StopTranscribingAsync() to stop transcribing when all participants leave.
                    await conversationTranscriber.StartTranscribingAsync().ConfigureAwait(false);

                    // Waits for completion.
                    // Use Task.WaitAny to keep the task rooted.
                    Task.WaitAny(new[] { stopTranscription.Task });

                    // Stop transcribing the conversation.
                    await conversationTranscriber.StopTranscribingAsync().ConfigureAwait(false);
                 }
            }
       }
    }
}
```

To transcribe conversations with multiple participants, we create a `Conversation` object from `SpeechConfig` (you need to substitute real information for "YourSubscriptionKey" and "YourServiceRegion").

With a meeting ID that is a GUID, we add participants to the conversation, create a `ConversationTranscriber`, join the conversation, and then stream audio. You can add or remove the number of speakers and their specifics to suit your needs.

## See also

For an example of offline conversation transcription, see [Offline multi-participant conversation transcription](how-to-use-offline-conversation-transcription-service.md).

## Next steps

> [!div class="nextstepaction"][explore our samples on github](https://aka.ms/csspeech/samples)
