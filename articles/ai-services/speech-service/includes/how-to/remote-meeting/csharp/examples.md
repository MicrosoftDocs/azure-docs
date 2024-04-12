---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 07/26/2022
ms.author: eur
ms.custom: devx-track-csharp
---

## Upload the audio

The first step for asynchronous transcription is to send the audio to the Meeting Transcription Service using the Speech SDK.

This example code shows how to create a `MeetingTranscriber` for asynchronous-only mode. In order to stream audio to the transcriber, you add audio streaming code derived from [Transcribe meetings in real-time with the Speech SDK](../../../../how-to-use-meeting-transcription.md). 

```csharp
async Task CompleteContinuousRecognition(MeetingTranscriber recognizer, string meetingId)
{
    var finishedTaskCompletionSource = new TaskCompletionSource<int>();

    recognizer.SessionStopped += (s, e) =>
    {
        finishedTaskCompletionSource.TrySetResult(0);
    };

    recognizer.Canceled += (s, e) => 
    {
        Console.WriteLine($"CANCELED: Reason={e.Reason}");
        if (e.Reason == CancellationReason.Error)
        {
            Console.WriteLine($"CANCELED: ErrorCode={e.ErrorCode}");
            Console.WriteLine($"CANCELED: ErrorDetails={e.ErrorDetails}");
            Console.WriteLine($"CANCELED: Did you update the subscription info?");
            throw new System.ApplicationException("${e.ErrorDetails}");
        }
        finishedTaskCompletionSource.TrySetResult(0);
    };

    await recognizer.StartTranscribingAsync().ConfigureAwait(false);
    
    // Waits for completion.
    // Use Task.WaitAny to keep the task rooted.
    Task.WaitAny(new[] { finishedTaskCompletionSource.Task });
    
    await recognizer.StopTranscribingAsync().ConfigureAwait(false);
}

async Task<List<string>> GetRecognizerResult(MeetingTranscriber recognizer, string meetingId)
{
    List<string> recognizedText = new List<string>();
    recognizer.Transcribed += (s, e) =>
    {
        if (e.Result.Text.Length > 0)
        {
            recognizedText.Add(e.Result.Text);
        }
    };

    await CompleteContinuousRecognition(recognizer, meetingId);

    recognizer.Dispose();
    return recognizedText;
}

async Task UploadAudio()
{
    // Create the speech config object
    // Substitute real information for "YourSubscriptionKey" and "Region"
    SpeechConfig speechConfig = SpeechConfig.FromSubscription("YourSubscriptionKey", "Region");
    speechConfig.SetProperty("ConversationTranscriptionInRoomAndOnline", "true");

    // Set the property for asynchronous transcription
    speechConfig.SetServiceProperty("transcriptionMode", "async", ServicePropertyChannel.UriQueryParameter);

    // Alternatively: set the property for real-time plus asynchronous transcription
    // speechConfig.setServiceProperty("transcriptionMode", "RealTimeAndAsync", ServicePropertyChannel.UriQueryParameter);

    // Create an audio stream from a wav file or from the default microphone if you want to stream live audio from the supported devices
    // Replace with your own audio file name and Helper class which implements AudioConfig using PullAudioInputStreamCallback
    PullAudioInputStreamCallback wavfilePullStreamCallback = Helper.OpenWavFile("16kHz16Bits8channelsOfRecordedPCMAudio.wav");
    // Create an audio stream format assuming the file used above is 16kHz, 16 bits and 8 channel pcm wav file
    AudioStreamFormat audioStreamFormat = AudioStreamFormat.GetWaveFormatPCM(16000, 16, 8);
    // Create an input stream
    AudioInputStream audioStream = AudioInputStream.CreatePullStream(wavfilePullStreamCallback, audioStreamFormat);

    // Ensure the meetingId for a new meeting is a truly unique GUID
    String meetingId = Guid.NewGuid().ToString();

    // Create a Meeting
    using (var meeting = await Meeting.CreateMeetingAsync(speechConfig, meetingId))
    {
        using (var meetingTranscriber = new MeetingTranscriber(AudioConfig.FromStreamInput(audioStream)))
        {
            await meetingTranscriber.JoinMeetingAsync(meeting);
            // Helper function to get the real-time transcription results
            var result = await GetRecognizerResult(meetingTranscriber, meetingId);
        }
    }
}
```

If you want real-time _plus_ asynchronous, comment and uncomment the appropriate lines of code as follows:

```csharp
// Set the property for asynchronous transcription
// speechConfig.SetServiceProperty("transcriptionMode", "async", ServicePropertyChannel.UriQueryParameter);

// Alternatively: set the property for real-time plus asynchronous transcription
speechConfig.SetServiceProperty("transcriptionMode", "RealTimeAndAsync", ServicePropertyChannel.UriQueryParameter);
```

## Get transcription results

Install **Microsoft.CognitiveServices.Speech.Remotemeeting version 1.13.0 or above** via NuGet.

### Sample transcription code

After you have the `meetingId`, create a remote meeting transcription client **RemoteMeetingTranscriptionClient** at the client application to query the status of the asynchronous transcription. Create an object of  **RemoteMeetingTranscriptionOperation** to get a long running [Operation](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/core/Azure.Core#consuming-long-running-operations-using-operationt) object. You can check the status of the operation or wait for it to complete. 

```csharp
// Create the speech config
SpeechConfig config = SpeechConfig.FromSubscription("YourSpeechKey", "YourSpeechRegion");
// Create the speech client
RemoteMeetingTranscriptionClient client = new RemoteMeetingTranscriptionClient(config);
// Create the remote operation
RemoteMeetingTranscriptionOperation operation = 
                            new RemoteMeetingTranscriptionOperation(meetingId, client);

// Wait for operation to finish
await operation.WaitForCompletionAsync(TimeSpan.FromSeconds(10), CancellationToken.None);
// Get the result of the long running operation
var val = operation.Value.MeetingTranscriptionResults;
// Print the fields from the results
foreach (var item in val)
{
    Console.WriteLine($"{item.Text}, {item.ResultId}, {item.Reason}, {item.UserId}, {item.OffsetInTicks}, {item.Duration}");
    Console.WriteLine($"{item.Properties.GetProperty(PropertyId.SpeechServiceResponse_JsonResult)}");
}
Console.WriteLine("Operation completed");

```
