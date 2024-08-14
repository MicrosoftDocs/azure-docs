---
title: include file
description: C# real-time transcription how-to doc
services: azure-communication-services
author: Kunaal Punjabi
ms.service: azure-communication-services
ms.subservice: call-automation
ms.date: 07/16/2024
ms.topic: include
ms.topic: include file
ms.author: kpunjabi
---

## Create a call and provide the transcription details
Define the TranscriptionOptions for ACS to know whether to start the transcription straight away or at a later time, which locale to transcribe in and the web socket connection to use for sending the transcript.

```csharp
var createCallOptions = new CreateCallOptions(callInvite, callbackUri)
{
    CallIntelligenceOptions = new CallIntelligenceOptions() { CognitiveServicesEndpoint = new Uri(cognitiveServiceEndpoint) },
    TranscriptionOptions = new TranscriptionOptions(new Uri(""), "en-US", false, TranscriptionTransport.Websocket)
};
CreateCallResult createCallResult = await callAutomationClient.CreateCallAsync(createCallOptions);
```

## Start Transcription
Once you're ready to start the transcription you can make an explicit call to Call Automation to start transcribing the call.

```csharp
// Start transcription with options
StartTranscriptionOptions options = new StartTranscriptionOptions()
{
    OperationContext = "startMediaStreamingContext",
    //Locale = "en-US",
};

await callMedia.StartTranscriptionAsync(options);

// Alternative: Start transcription without options
// await callMedia.StartTranscriptionAsync();
```

## Receiving Transcription Stream
When transcription starts, your websocket will receive the transcription metadata payload as the first packet. This payload carries the call metadata and locale for the configuration.

```json
{
    "kind": "TranscriptionMetadata",
    "transcriptionMetadata": {
        "subscriptionId": "835be116-f750-48a4-a5a4-ab85e070e5b0",
        "locale": "en-us",
        "callConnectionId": "65c57654=f12c-4975-92a4-21668e61dd98",
        "correlationId": "65c57654=f12c-4975-92a4-21668e61dd98"
    }
}
```

## Receiving Transcription data
After the metadata the next packets your web socket receives will be TranscriptionData for the transcribed audio.

```json
{
    "kind": "TranscriptionData",
    "transcriptionData": {
        "text": "Testing transcription.",
        "format": "display",
        "confidence": 0.695223331451416,
        "offset": 2516998782481234400,
        "words": [
            {
                "text": "testing",
                "offset": 2516998782481234400
            },
            {
                "text": "testing",
                "offset": 2516998782481234400
            }
        ],
        "participantRawID": "8:acs:",
        "resultStatus": "Final"
    }
}
```

## Handling transcription stream in the web socket server
```csharp
using WebServerApi;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseWebSockets();
app.Map("/ws", async context =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        using var webSocket = await context.WebSockets.AcceptWebSocketAsync();
        await HandleWebSocket.Echo(webSocket);
    }
    else
    {
        context.Response.StatusCode = StatusCodes.Status400BadRequest;
    }
});

app.Run();
```

### Updates to your code for the websocket handler
```csharp
using Azure.Communication.CallAutomation;
using System.Net.WebSockets;
using System.Text;

namespace WebServerApi
{
    public class HandleWebSocket
    {
        public static async Task Echo(WebSocket webSocket)
        {
            var buffer = new byte[1024 * 4];
            var receiveResult = await webSocket.ReceiveAsync(
                new ArraySegment(buffer), CancellationToken.None);

            while (!receiveResult.CloseStatus.HasValue)
            {
                string msg = Encoding.UTF8.GetString(buffer, 0, receiveResult.Count);
                var response = StreamingDataParser.Parse(msg);

                if (response != null)
                {
                    if (response is AudioMetadata audioMetadata)
                    {
                        Console.WriteLine("***************************************************************************************");
                        Console.WriteLine("MEDIA SUBSCRIPTION ID-->"+audioMetadata.MediaSubscriptionId);
                        Console.WriteLine("ENCODING-->"+audioMetadata.Encoding);
                        Console.WriteLine("SAMPLE RATE-->"+audioMetadata.SampleRate);
                        Console.WriteLine("CHANNELS-->"+audioMetadata.Channels);
                        Console.WriteLine("LENGTH-->"+audioMetadata.Length);
                        Console.WriteLine("***************************************************************************************");
                    }
                    if (response is AudioData audioData)
                    {
                        Console.WriteLine("***************************************************************************************");
                        Console.WriteLine("DATA-->"+audioData.Data);
                        Console.WriteLine("TIMESTAMP-->"+audioData.Timestamp);
                        Console.WriteLine("IS SILENT-->"+audioData.IsSilent);
                        Console.WriteLine("***************************************************************************************");
                    }

                    if (response is TranscriptionMetadata transcriptionMetadata)
                    {
                        Console.WriteLine("***************************************************************************************");
                        Console.WriteLine("TRANSCRIPTION SUBSCRIPTION ID-->"+transcriptionMetadata.TranscriptionSubscriptionId);
                        Console.WriteLine("LOCALE-->"+transcriptionMetadata.Locale);
                        Console.WriteLine("CALL CONNECTION ID--?"+transcriptionMetadata.CallConnectionId);
                        Console.WriteLine("CORRELATION ID-->"+transcriptionMetadata.CorrelationId);
                        Console.WriteLine("***************************************************************************************");
                    }
                    if (response is TranscriptionData transcriptionData)
                    {
                        Console.WriteLine("***************************************************************************************");
                        Console.WriteLine("TEXT-->"+transcriptionData.Text);
                        Console.WriteLine("FORMAT-->"+transcriptionData.Format);
                        Console.WriteLine("OFFSET-->"+transcriptionData.Offset);
                        Console.WriteLine("DURATION-->"+transcriptionData.Duration);
                        Console.WriteLine("PARTICIPANT-->"+transcriptionData.Participant.RawId);
                        Console.WriteLine("CONFIDENCE-->"+transcriptionData.Confidence);

                        foreach (var word in transcriptionData.Words)
                        {
                            Console.WriteLine("TEXT-->"+word.Text);
                            Console.WriteLine("OFFSET-->"+word.Offset);
                            Console.WriteLine("DURATION-->"+word.Duration);
                        }
                        Console.WriteLine("***************************************************************************************");
                    }
                }

                await webSocket.SendAsync(
                    new ArraySegment(buffer, 0, receiveResult.Count),
                    receiveResult.MessageType,
                    receiveResult.EndOfMessage,
                    CancellationToken.None);

                receiveResult = await webSocket.ReceiveAsync(
                    new ArraySegment(buffer), CancellationToken.None);
            }

            await webSocket.CloseAsync(
                receiveResult.CloseStatus.Value,
                receiveResult.CloseStatusDescription,
                CancellationToken.None);
        }
    }
}
```

## Update Transcription
For situations where your application allows users to select their preferred language you may also want to capture the transcription in that language. To do this, Call Automation SDK allows you to update the transcription locale.

```csharp
await callMedia.UpdateTranscriptionAsync("en-US-NancyNeural");
```

## Stop Transcription
When your application needs to stop listening for the transcription, you can use the StopTranscription request to let Call Automation know to stop sending transcript data to your web socket.

```csharp
StopTranscriptionOptions stopOptions = new StopTranscriptionOptions()
{
    OperationContext = "stopTranscription"
};

await callMedia.StopTranscriptionAsync(stopOptions);
```

