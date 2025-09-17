---
title: include file
description: Java real-time transcription how-to doc
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
Define the TranscriptionOptions for ACS to specify when to start the transcription, the locale for transcription, and the web socket connection for sending the transcript.

```java
CallInvite callInvite = new CallInvite(target, caller); 

CallIntelligenceOptions callIntelligenceOptions = new CallIntelligenceOptions()
    .setCognitiveServicesEndpoint(appConfig.getCognitiveServiceEndpoint()); 

TranscriptionOptions transcriptionOptions = new TranscriptionOptions(
    appConfig.getWebSocketUrl(), 
    TranscriptionTransport.WEBSOCKET, 
    "en-US", 
    false,
    "your-endpoint-id-here" // speechRecognitionEndpointId
); 

CreateCallOptions createCallOptions = new CreateCallOptions(callInvite, appConfig.getCallBackUri());
createCallOptions.setCallIntelligenceOptions(callIntelligenceOptions); 
createCallOptions.setTranscriptionOptions(transcriptionOptions); 

Response result = client.createCallWithResponse(createCallOptions, Context.NONE); 
return result.getValue().getCallConnectionProperties().getCallConnectionId(); 
```

## Sentiment Analysis (Preview)
Track the emotional tone of conversations in real time to support customer and agent interactions, and enable supervisors to intervene when necessary. Available in public preview through `createCall`, `answerCall` and `startTranscription`.

### Create a call with Sentiment Analysis enabled 

``` java
CallInvite callInvite = new CallInvite(target, caller);

CallIntelligenceOptions callIntelligenceOptions = new CallIntelligenceOptions()
    .setCognitiveServicesEndpoint(cognitiveServicesEndpoint);

TranscriptionOptions transcriptionOptions = new TranscriptionOptions("en-ES")
    .setTransportUrl(websocketUriHost)
    .setEnableSentimentAnalysis(true) // Enable sentiment analysis
    .setLocales(locales);

CreateCallOptions createCallOptions = new CreateCallOptions(callInvite, callbackUri.toString())
    .setCallIntelligenceOptions(callIntelligenceOptions)
    .setTranscriptionOptions(transcriptionOptions);

// Create call request
Response<CreateCallResult> result = client.createCallWithResponse(createCallOptions, Context.NONE);
```

### Answer a call with Sentiment Analysis enabled 

``` java
TranscriptionOptions transcriptionOptions = new TranscriptionOptions("en-ES")
    .setTransportUrl(websocketUriHost)
    .setEnableSentimentAnalysis(true) // Enable sentiment analysis
    .setLocales(locales);

AnswerCallOptions answerCallOptions = new AnswerCallOptions(data.getString("incomingCallContext"), callbackUri)
    .setCallIntelligenceOptions(callIntelligenceOptions)
    .setTranscriptionOptions(transcriptionOptions);

// Answer call request
Response<AnswerCallResult> answerCallResponse = client.answerCallWithResponse(answerCallOptions, Context.NONE);
```

## PII Redaction (Preview)
Automatically identify and mask sensitive information—such as names, addresses, or identification numbers—to ensure privacy and regulatory compliance. Available in `createCall`, `answerCall` and `startTranscription`.

### Answer a call with PII Redaction enabled 
``` java
PiiRedactionOptions piiRedactionOptions = new PiiRedactionOptions()
    .setEnabled(true)
    .setRedactionType(RedactionType.MASK_WITH_CHARACTER);

TranscriptionOptions transcriptionOptions = new TranscriptionOptions("en-ES")
    .setTransportUrl(websocketUriHost)
    .setPiiRedactionOptions(piiRedactionOptions)
    .setLocales(locales);

AnswerCallOptions answerCallOptions = new AnswerCallOptions(data.getString("incomingCallContext"), callbackUri)
    .setCallIntelligenceOptions(callIntelligenceOptions)
    .setTranscriptionOptions(transcriptionOptions);

// Answer call request
Response<AnswerCallResult> answerCallResponse = client.answerCallWithResponse(answerCallOptions, Context.NONE);
```
>[!Note]
> With PII redaction enabled you’ll only receive the redacted text.  

## Real-time language detection (Preview)
Automatically detect spoken languages to enable natural, human-like communication and eliminate manual language selection. Available in `createCall`, `answerCall` and `startTranscription`.

### Create a call with Real-time language detection enabled

``` java
var transcriptionOptions = new TranscriptionOptions
{
    Locales = new List<string> { "en-US", "fr-FR", "hi-IN" },
};

var createCallOptions = new CreateCallOptions(callInviteOption, new Uri("https://test"))
{
    TranscriptionOptions = transcriptionOptions
};

var createCallResult = await client.CreateCallAsync(createCallOptions);
```

> [!Note]
> To stop language identification after it has started, use the `updateTranscription` API and explicitly set the language you want to use for the transcript. This disables automatic language detection and locks transcription to the specified language.

## Connect to a Rooms call and provide transcription details
If you're connecting to an ACS room and want to use transcription, configure the transcription options as follows:

```java
TranscriptionOptions transcriptionOptions = new TranscriptionOptions(
    appConfig.getWebSocketUrl(), 
    TranscriptionTransport.WEBSOCKET, 
    "en-US", 
    false,
    "your-endpoint-id-here" // speechRecognitionEndpointId
);

ConnectCallOptions connectCallOptions = new ConnectCallOptions(new RoomCallLocator("roomId"), appConfig.getCallBackUri())
    .setCallIntelligenceOptions(
        new CallIntelligenceOptions()
            .setCognitiveServicesEndpoint(appConfig.getCognitiveServiceEndpoint())
    )
    .setTranscriptionOptions(transcriptionOptions);

ConnectCallResult connectCallResult = Objects.requireNonNull(client
    .connectCallWithResponse(connectCallOptions)
    .block())
    .getValue();
```

## Start Transcription
Once you're ready to start the transcription, you can make an explicit call to Call Automation to start transcribing the call.

```java
//Option 1: Start transcription with options
StartTranscriptionOptions transcriptionOptions = new StartTranscriptionOptions()
    .setOperationContext("startMediaStreamingContext"); 

client.getCallConnection(callConnectionId)
    .getCallMedia()
    .startTranscriptionWithResponse(transcriptionOptions, Context.NONE); 

// Alternative: Start transcription without options
// client.getCallConnection(callConnectionId)
//     .getCallMedia()
//     .startTranscription();
```

## Get mid call summaries (Preview)
Enhance your call workflows with real-time summarization. By enabling summarization in your transcription options, ACS can automatically generate concise mid-call recaps—including decisions, action items, and key discussion points—without waiting for the call to end. This helps teams stay aligned and enables faster follow-ups during live conversations.

``` java
SummarizationOptions summarizationOptions = new SummarizationOptions()
    .setEnableEndCallSummary(true)
    .setLocale("en-US");

TranscriptionOptions transcriptionOptions = new TranscriptionOptions("en-ES")
    .setTransportUrl(websocketUriHost)
    .setSummarizationOptions(summarizationOptions)
    .setLocales(locales);

AnswerCallOptions answerCallOptions = new AnswerCallOptions(data.getString("incomingCallContext"), callbackUri)
    .setCallIntelligenceOptions(callIntelligenceOptions)
    .setTranscriptionOptions(transcriptionOptions);

// Answer call request
Response<AnswerCallResult> answerCallResponse = client.answerCallWithResponse(answerCallOptions, Context.NONE);
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
```java
package com.example;

import org.glassfish.tyrus.server.Server;

import java.io.BufferedReader;
import java.io.InputStreamReader;

public class App {
    public static void main(String[] args) {
        Server server = new Server("localhost", 8081, "/ws", null, WebSocketServer.class);

        try {
            server.start();
            System.out.println("Web socket running on port 8081...");
            System.out.println("wss://localhost:8081/ws/server");
            BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
            reader.readLine();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            server.stop();
        }
    }
}
```

### Updates to your code for the websocket handler
```java
package com.example;

import javax.websocket.OnMessage;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import com.azure.communication.callautomation.models.streaming.StreamingData;
import com.azure.communication.callautomation.models.streaming.StreamingDataParser;
import com.azure.communication.callautomation.models.streaming.media.AudioData;
import com.azure.communication.callautomation.models.streaming.media.AudioMetadata;
import com.azure.communication.callautomation.models.streaming.transcription.TranscriptionData;
import com.azure.communication.callautomation.models.streaming.transcription.TranscriptionMetadata;
import com.azure.communication.callautomation.models.streaming.transcription.Word;

@ServerEndpoint("/server")
public class WebSocketServer {
    @OnMessage
    public void onMessage(String message, Session session) {
        StreamingData data = StreamingDataParser.parse(message);

        if (data instanceof AudioMetadata) {
            AudioMetadata audioMetaData = (AudioMetadata) data;
            System.out.println("----------------------------------------------------------------");
            System.out.println("SUBSCRIPTION ID: --> " + audioMetaData.getMediaSubscriptionId());
            System.out.println("ENCODING: --> " + audioMetaData.getEncoding());
            System.out.println("SAMPLE RATE: --> " + audioMetaData.getSampleRate());
            System.out.println("CHANNELS: --> " + audioMetaData.getChannels());
            System.out.println("LENGTH: --> " + audioMetaData.getLength());
            System.out.println("----------------------------------------------------------------");
        }

        if (data instanceof AudioData) {
            AudioData audioData = (AudioData) data;
            System.out.println("----------------------------------------------------------------");
            System.out.println("DATA: --> " + audioData.getData());
            System.out.println("TIMESTAMP: --> " + audioData.getTimestamp());
            System.out.println("IS SILENT: --> " + audioData.isSilent());
            System.out.println("----------------------------------------------------------------");
        }

        if (data instanceof TranscriptionMetadata) {
            TranscriptionMetadata transcriptionMetadata = (TranscriptionMetadata) data;
        
            System.out.println("----------------------------------------------------------------");
            System.out.println("TRANSCRIPTION SUBSCRIPTION ID: --> " + transcriptionMetadata.getTranscriptionSubscriptionId());
            System.out.println("LOCALE: --> " + transcriptionMetadata.getLocale());
            System.out.println("CALL CONNECTION ID: --> " + transcriptionMetadata.getCallConnectionId());
            System.out.println("CORRELATION ID: --> " + transcriptionMetadata.getCorrelationId());
        
            // Check for PII Redaction Options locale
            if (transcriptionMetadata.getPiiRedactionOptions() != null &&
                transcriptionMetadata.getPiiRedactionOptions().getLocale() != null) {
                System.out.println("PII Redaction Locale: --> " + transcriptionMetadata.getPiiRedactionOptions().getLocale());
            }
        
            // Check for detected locales
            if (transcriptionMetadata.getLocales() != null) {
                System.out.println("Detected Locales: --> " + transcriptionMetadata.getLocales());
            }
        
            System.out.println("----------------------------------------------------------------");
        }

        if (data instanceof TranscriptionData) {
            TranscriptionData transcriptionData = (TranscriptionData) data;
            System.out.println("----------------------------------------------------------------");
            System.out.println("TEXT: --> " + transcriptionData.getText());
            System.out.println("FORMAT: --> " + transcriptionData.getFormat());
            System.out.println("CONFIDENCE: --> " + transcriptionData.getConfidence());
            System.out.println("OFFSET: --> " + transcriptionData.getOffset());
            System.out.println("DURATION: --> " + transcriptionData.getDuration());
            System.out.println("RESULT STATUS: --> " + transcriptionData.getResultStatus());
            for (Word word : transcriptionData.getWords()) {
                System.out.println("Text: --> " + word.getText());
                System.out.println("Offset: --> " + word.getOffset());
                System.out.println("Duration: --> " + word.getDuration());
            }
            System.out.println("SENTIMENT:-->" + transcriptionData.getSentimentAnalysisResult().getSentiment()); 
            System.out.println("LANGUAGE IDENTIFIED:-->" + transcriptionData.getLanguageIdentified()); 
            System.out.println("----------------------------------------------------------------");
        }
    }
}
```

## Update Transcription
For situations where your application allows users to select their preferred language you may also want to capture the transcription in that language. To do this, Call Automation SDK allows you to update the transcription locale.

```java
UpdateTranscriptionOptions transcriptionOptions = new UpdateTranscriptionOptions()
    .setLocale(newLocale)
    .setOperationContext("transcriptionContext")
    .setSpeechRecognitionEndpointId("your-endpoint-id-here");

client.getCallConnection(callConnectionId)
    .getCallMedia()
    .updateTranscriptionWithResponse(transcriptionOptions, Context.NONE);
```

## Stop Transcription
When your application needs to stop listening for the transcription, you can use the StopTranscription request to let Call Automation know to stop sending transcript data to your web socket.

```java
// Option 1: Stop transcription with options
StopTranscriptionOptions stopTranscriptionOptions = new StopTranscriptionOptions()
    .setOperationContext("stopTranscription");

client.getCallConnection(callConnectionId)
    .getCallMedia()
    .stopTranscriptionWithResponse(stopTranscriptionOptions, Context.NONE);

// Alternative: Stop transcription without options
// client.getCallConnection(callConnectionId)
//     .getCallMedia()
//     .stopTranscription();
```
