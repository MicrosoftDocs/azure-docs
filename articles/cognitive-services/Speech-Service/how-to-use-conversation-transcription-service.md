---
title: Transcribe multi-participant conversations with the Speech SDK - Speech Services
titleSuffix: Azure Cognitive Services
description: Learn how to use Conversation Transcription service with the Speech SDK. Available for C++, C#, and Java.
services: cognitive-services
author: jhakulin, sarahlu 
manager: Rob Chambers

ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 04/17/2019
ms.author: jhakulin, sarahlu
---
# Transcribe multi-participant conversations with the Speech SDK

The Speech SDK's **Conversation Transcriber** API provides a way to transcribe conversation/meeting like scenarios where you can add and remove participants and transcribe their conversations (ie. see textual output what each participant has said in the conversation) by streaming audio to the Speech Service using PullStream or PushStream.

## Limitations

* Conversation transcriber is supported for C++, C#, and Java on Windows, Linux and Android.
* ROOBO DevKit (add link) is recommended HW environment for creating conversations as that provides circular multi-microphone array which can be utilized efficiently by the Conversation Transcription service for the speaker identification. 
* Support in Speech SDK is limited to use of audio pull and push mode streams with 8-channels of PCM audio.
* Conversation Transcription service requires a specific endpoint (add link for more information).

## Prerequisites

* Learn how to use Speech-to-text with the Speech SDK (add link to quick start)
* Get subscription to the specific endpoint for Conversation Transcription service (add link)

## Create conversation session
First step in creating conversation/meeting like scenario is by adding participants with the voice signatures. 
This is what the code may look like:

### Create voice signatures for Participant(s)
```csharp
// <<Add code sample here >>
```

## Transcribing conversations

To transcribe conversations of participants, create `ConversationTranscriber` object associated with the config created for conversation session
and stream audio using `PullAudioInputStream` or `PushAudioInputStream`.
Let's assume that you have a ConversationTranscriber class called `MyConversationTranscriber`. This is what the code may look like: 

```csharp
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;
using Microsoft.CognitiveServices.Speech.Conversation;

public class MyConversationTranscriber
{
    private static string endpoint = "YourOwnEndpoint";

    public static async Task ConversationWithPullAudioStreamAsync()
    {
        // Creates an instance of a speech config with specified subscription key and service region.
        // Replace with your own endpoint and subscription key.
        var config = SpeechConfig.FromEndpoint(new Uri(endpoint), "YourSubScriptionKey");
        var stopTranscription = new TaskCompletionSource<int>();

        // Create an audio stream from a wav file.
        // Replace with your own audio file name.
        using (var audioInput = Helper.OpenWavFile(@"8channelsOfRecordedPCMAudio.wav"))
        {
            // Creates a conversation transcriber using audio stream input.
            using (var transcriber = new ConversationTranscriber(config, audioInput))
            {
                // Subscribes to events.
                transcriber.Recognizing += (s, e) =>
                {
                    Console.WriteLine($"RECOGNIZING: Text={e.Result.Text}");
                };

                transcriber.Recognized += (s, e) =>
                {
                    if (e.Result.Reason == ResultReason.RecognizedSpeech)
                    {
                        Console.WriteLine($"RECOGNIZED: Text={e.Result.Text}, SpeakerID={e.Result.SpeakerId}");
                    }
                    else if (e.Result.Reason == ResultReason.NoMatch)
                    {
                        Console.WriteLine($"NOMATCH: Speech could not be recognized.");
                    }
                };

                // Sets a conversation Id.
                transcriber.ConversationId = "AConversationFromTeams";

                // Add a participant to the conversation.
                transcriber.AddParticipant("mary@microsoft.com");

                // Starts transcribing of the conversation. Uses StopTranscribingAsync() to stop transcribing when all participants leave.
                await transcriber.StartTranscribingAsync().ConfigureAwait(false);

                // Waits for completion.
                // Use Task.WaitAny to keep the task rooted.
                Task.WaitAny(new[] { stopTranscription.Task });

                // Stop transcribing the conversation.
                await transcriber.StopTranscribingAsync().ConfigureAwait(false);

                // Ends the conversation.
                await transcriber.EndConversationAsync().ConfigureAwait(false);
            }
        }
    }
}
```

## Next steps

* [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
* [See how to recognize speech in C#](quickstart-csharp-dotnet-windows.md)
* Add link to SDK API reference
* Add link to SDK samples