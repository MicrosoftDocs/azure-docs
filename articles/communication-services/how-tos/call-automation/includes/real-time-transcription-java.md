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
Define the TranscriptionOptions for ACS to know whether to start the transcription straight away or at a later time, which locale to transcribe in and the web socket connection to use for sending the transcript.

```java
CallInvite callInvite = new CallInvite(target, caller); 

CallIntelligenceOptions callIntelligenceOptions = new CallIntelligenceOptions()
    .setCognitiveServicesEndpoint(appConfig.getCognitiveServiceEndpoint()); 

TranscriptionOptions transcriptionOptions = new TranscriptionOptions(
    appConfig.getWebSocketUrl(), 
    TranscriptionTransport.WEBSOCKET, 
    "en-US", 
    false
); 

CreateCallOptions createCallOptions = new CreateCallOptions(callInvite, appConfig.getCallBackUri());
createCallOptions.setCallIntelligenceOptions(callIntelligenceOptions); 
createCallOptions.setTranscriptionOptions(transcriptionOptions); 

Response result = client.createCallWithResponse(createCallOptions, Context.NONE); 
return result.getValue().getCallConnectionProperties().getCallConnectionId(); 
```

## Start Transcription
Once you're ready to start the transcription you can make an explicit call to Call Automation to start transcribing the call.

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
            System.out.println("IS SILENT: --> " + transcriptionMetadata.getLocale());
            System.out.println("CALL CONNECTION ID: --> " + transcriptionMetadata.getCallConnectionId());
            System.out.println("CORRELATION ID: --> " + transcriptionMetadata.getCorrelationId());
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
            System.out.println("----------------------------------------------------------------");
        }
    }
}
```

## Update Transcription
For situations where your application allows users to select their preferred language you may also want to capture the transcription in that language. To do this, Call Automation SDK allows you to update the transcription locale.

```java
client.getCallConnection(callConnectionId)
    .getCallMedia()
    .updateTranscription("en-US-NancyNeural");
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
