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
Define the TranscriptionOptions for ACS to specify when to start the transcription, specify the locale for transcription, and the web socket connection for sending the transcript.

```csharp
var createCallOptions = new CreateCallOptions(callInvite, callbackUri)
{
    CallIntelligenceOptions = new CallIntelligenceOptions() { CognitiveServicesEndpoint = new Uri(cognitiveServiceEndpoint) },
    TranscriptionOptions = new TranscriptionOptions(new Uri(""), "en-US", false, TranscriptionTransport.Websocket)
};
CreateCallResult createCallResult = await callAutomationClient.CreateCallAsync(createCallOptions);
```

## Sentiment Analysis (Preview)
Track the emotional tone of conversations in real time to support customer and agent interactions, and enable supervisors to intervene when necessary. Available in public preview through `createCall`, `answerCall` and `startTranscription`.
### Create a call with Sentiment Analysis enabled 

``` csharp
// Define transcription options with sentiment analysis enabled
var transcriptionOptions = new TranscriptionOptions
{
    IsSentimentAnalysisEnabled = true
};

var callIntelligenceOptions = new CallIntelligenceOptions
{
    CognitiveServicesEndpoint = new Uri(cognitiveServiceEndpoint)
};

var createCallOptions = new CreateCallOptions(callInvite, new Uri("https://test"))
{
    CallIntelligenceOptions = callIntelligenceOptions,
    TranscriptionOptions = transcriptionOptions
};

CreateCallResult createCallResult = await callAutomationClient.CreateCallAsync(createCallOptions);
```

### Answer a call with Sentiment Analysis enabled 
``` csharp
// Define transcription options with sentiment analysis enabled
var transcriptionOptions = new TranscriptionOptions
{
    IsSentimentAnalysisEnabled = true
};

var answerCallOptions = new AnswerCallOptions(incomingCallContext, callbackUri)
{
    TranscriptionOptions = transcriptionOptions
};

var answerCallResult = await client.AnswerCallAsync(answerCallOptions);
```

## PII Redaction (Preview)
Automatically identify and mask sensitive information—such as names, addresses, or identification numbers—to ensure privacy and regulatory compliance. Available in `createCall`, `answerCall` and `startTranscription`.

### Answer a call with PII Redaction enabled 
``` csharp
var transcriptionOptions = new TranscriptionOptions 
{ 
   PiiRedactionOptions = new PiiRedactionOptions 
   { 
       IsEnabled = true, 
       RedactionType = RedactionType.MaskWithCharacter 
   },  
}; 
 
var options = new AnswerCallOptions(incomingCallContext, callbackUri) 
{ 
   TranscriptionOptions = transcriptionOptions, 
}; 
 
//Answer call request 
var answerCallResult = await client.AnswerCallAsync(options); 
```
>[!Note]
> With PII redaction enabled you’ll only receive the redacted text.  

## Real-time language detection (Preview)
Automatically detect spoken languages to enable natural, human-like communication and eliminate manual language selection. Available in `createCall`, `answerCall` and `startTranscription`.

### Create a call with Real-time language detection enabled
``` csharp
var transcriptionOptions = new TranscriptionOptions 
{ 
   Locales = new List<string> { "en-US", "fr-FR", "hi-IN" }
};

var createCallOptions = new CreateCallOptions(callInviteOption, new Uri("https://test")) 
{ 
    TranscriptionOptions = transcriptionOptions 
}; 
 
//CreateCall request 
var createCallRequest = await client.CreateCallAsync(createCallOptions);
```

> [!Note]
> To stop language identification after it has started, use the `updateTranscription` API and explicitly set the language you want to use for the transcript. This disables automatic language detection and locks transcription to the specified language.


## Connect to a Rooms call and provide transcription details
If you're connecting to an ACS room and want to use transcription, configure the transcription options as follows:

```csharp
var transcriptionOptions = new TranscriptionOptions(
    transportUri: new Uri(""),
    locale: "en-US", 
    startTranscription: false,
    transcriptionTransport: TranscriptionTransport.Websocket,
    //Only add the SpeechRecognitionModelEndpointId if you have a custom speech model you would like to use
    SpeechRecognitionModelEndpointId = "YourCustomSpeechRecognitionModelEndpointId"
);

var connectCallOptions = new ConnectCallOptions(new RoomCallLocator("roomId"), callbackUri)
{
    CallIntelligenceOptions = new CallIntelligenceOptions() 
    { 
        CognitiveServicesEndpoint = new Uri(cognitiveServiceEndpoint) 
    },
    TranscriptionOptions = transcriptionOptions
};

var connectResult = await client.ConnectCallAsync(connectCallOptions);
```

## Start Transcription
Once you're ready to start the transcription, you can make an explicit call to Call Automation to start transcribing the call.

```csharp
// Start transcription with options
var transcriptionOptions = new StartTranscriptionOptions
{
    OperationContext = "startMediaStreamingContext",
    IsSentimentAnalysisEnabled = true,

    // Only add the SpeechRecognitionModelEndpointId if you have a custom speech model you would like to use
    SpeechRecognitionModelEndpointId = "YourCustomSpeechRecognitionModelEndpointId"
};

// Start transcription
await callMedia.StartTranscriptionAsync(transcriptionOptions);

// Alternative: Start transcription without options
// await callMedia.StartTranscriptionAsync();
```

## Get mid call summaries (Preview)
Enhance your call workflows with real-time summarization. By enabling summarization in your transcription options, ACS can automatically generate concise mid-call recaps—including decisions, action items, and key discussion points—without waiting for the call to end. This helps teams stay aligned and enables faster follow-ups during live conversations.

``` csharp
// Define transcription options with call summarization enabled
var transcriptionOptions = new TranscriptionOptions
{
    SummarizationOptions = new SummarizationOptions
    {
        Locale = "en-US"
    }
};

// Answer call with transcription options
var answerCallOptions = new AnswerCallOptions(incomingCallContext, callbackUri)
{
    TranscriptionOptions = transcriptionOptions
};

var answerCallResult = await client.AnswerCallAsync(answerCallOptions);
```
### Additional Headers:
The Correlation ID and Call Connection ID are now included in the WebSocket headers for improved traceability `x-ms-call-correlation-id` and `x-ms-call-connection-id`.

## Receiving Transcription Stream
When transcription starts, your websocket receives the transcription metadata payload as the first packet.

```json
{
    "kind": "TranscriptionMetadata",
    "transcriptionMetadata": {
        "subscriptionId": "aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e",
        "locale": "en-us",
        "callConnectionId": "65c57654=f12c-4975-92a4-21668e61dd98",
        "correlationId": "65c57654=f12c-4975-92a4-21668e61dd98"
    }
}
```

## Receiving Transcription data
After the metadata, the next packets your web socket receives will be TranscriptionData for the transcribed audio.

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

## Receiving Transcription Stream with AI capabilities enabled (Preview)
When transcription is enabled during a call, Azure Communication Services emits metadata that describes the configuration and context of the transcription session. This includes details such as the locale, call connection ID, sentiment analysis settings, and PII redaction preferences. Developers can use this payload to verify transcription setup, audit configurations, or troubleshoot issues related to real-time transcription features enhanced by AI.

``` json
{
  "kind": "TranscriptionMetadata",
  "transcriptionMetadata": {
    "subscriptionId": "863b5e55-de0d-4fc3-8e58-2d68e976b5ad",
    "locale": "en-US",
    "callConnectionId": "02009180-9dc2-429b-a3eb-d544b7b6a0e1",
    "correlationId": "62c8215b-5276-4d3c-bb6d-06a1b114651b",
    "speechModelEndpointId": null,
    "locales": [],
    "enableSentimentAnalysis": true,
    "piiRedactionOptions": {
      "enable": true,
      "redactionType": "MaskWithCharacter"
    }
  }
}
```

## Receiving Transcription data with AI capabilities enabled (Preview)
After the initial metadata packet, your WebSocket connection will begin receiving `TranscriptionData` events for each segment of transcribed audio. These packets include the transcribed text, confidence score, timing information, and—if enabled—sentiment analysis and PII redaction. This data can be used to build real-time dashboards, trigger workflows, or analyze conversation dynamics during the call.

```json
{
  "kind": "TranscriptionData",
  "transcriptionData": {
    "text": "My date of birth is *********.",
    "format": "display",
    "confidence": 0.8726407289505005,
    "offset": 309058340,
    "duration": 31600000,
    "words": [],
    "participantRawID": "4:+917020276722",
    "resultStatus": "Final",
    "sentimentAnalysisResult": {
      "sentiment": "neutral"
    }
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
                        Console.WriteLine("LOCALES-->" + transcriptionMetadata.Locales);  
                        Console.WriteLine("PII REDACTION OPTIONS ISENABLED-->" + transcriptionMetadata.PiiRedactionOptions?.IsEnabled);  
                        Console.WriteLine("PII REDACTION OPTIONS - REDACTION TYPE-->" + transcriptionMetadata.PiiRedactionOptions?.RedactionType); 
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
                        Console.WriteLine("SENTIMENT ANALYSIS RESULT-->" + transcriptionData.SentimentAnalysisResult?.Sentiment);

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
UpdateTranscriptionOptions updateTranscriptionOptions = new UpdateTranscriptionOptions(locale)
{
OperationContext = "UpdateTranscriptionContext",
//Only add the SpeechRecognitionModelEndpointId if you have a custom speech model you would like to use
SpeechRecognitionModelEndpointId = "YourCustomSpeechRecognitionModelEndpointId"
};

await client.GetCallConnection(callConnectionId).GetCallMedia().UpdateTranscriptionAsync(updateTranscriptionOptions);
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
