---
title: include file
description: JS real-time transcription how-to doc
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
Define the TranscriptionOptions for ACS to know whether to start the transcription straight away or at a later time, which locale to transcribe in, and the web socket connection to use for sending the transcript.

```javascript
const transcriptionOptions = {
    transportUrl: "",
    transportType: "websocket",
    locale: "en-US",
    startTranscription: false
};

const options = {
    callIntelligenceOptions: {
        cognitiveServicesEndpoint: process.env.COGNITIVE_SERVICES_ENDPOINT
    },
    transcriptionOptions: transcriptionOptions
};

console.log("Placing outbound call...");
acsClient.createCall(callInvite, process.env.CALLBACK_URI + "/api/callbacks", options);
```

## Start Transcription
Once you're ready to start the transcription, you can make an explicit call to Call Automation to start transcribing the call.

```javascript
const startTranscriptionOptions = {
    locale: "en-AU",
    operationContext: "startTranscriptionContext"
};

// Start transcription with options
await callMedia.startTranscription(startTranscriptionOptions);

// Alternative: Start transcription without options
// await callMedia.startTranscription();
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

## Receiving Transcription Data
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

## Handling transcription stream in the web socket server

```javascript
import WebSocket from 'ws';
import { streamingData } from '@azure/communication-call-automation/src/util/streamingDataParser';

const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (packetData) => {
        const decoder = new TextDecoder();
        const stringJson = decoder.decode(packetData);
        console.log("STRING JSON => " + stringJson);

        const response = streamingData(packetData);
        
        if ('locale' in response) {
            console.log("Transcription Metadata");
            console.log(response.callConnectionId);
            console.log(response.correlationId);
            console.log(response.locale);
            console.log(response.subscriptionId);
        }
        
        if ('text' in response) {
            console.log("Transcription Data");
            console.log(response.text);
            console.log(response.format);
            console.log(response.confidence);
            console.log(response.offset);
            console.log(response.duration);
            console.log(response.resultStatus);

            if ('phoneNumber' in response.participant) {
                console.log(response.participant.phoneNumber);
            }

            response.words.forEach((word) => {
                console.log(word.text);
                console.log(word.duration);
                console.log(word.offset);
            });
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server running on port 8081');
```

## Update Transcription
For situations where your application allows users to select their preferred language, you may also want to capture the transcription in that language. To do this, the Call Automation SDK allows you to update the transcription locale.

```javascript
await callMedia.updateTranscription("en-US-NancyNeural");
```

## Stop Transcription
When your application needs to stop listening for the transcription, you can use the StopTranscription request to let Call Automation know to stop sending transcript data to your web socket.

```javascript
const stopTranscriptionOptions = {
    operationContext: "stopTranscriptionContext"
};

// Stop transcription with options
await callMedia.stopTranscription(stopTranscriptionOptions);

// Alternative: Stop transcription without options
// await callMedia.stopTranscription();
```
