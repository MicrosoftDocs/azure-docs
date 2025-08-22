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
Define the TranscriptionOptions for ACS to specify when to start the transcription, the locale for transcription, and the web socket connection for sending the transcript.

```javascript
const transcriptionOptions = {
    transportUrl: "",
    transportType: "websocket",
    locale: "en-US",
    startTranscription: false,
    speechRecognitionModelEndpointId: "YOUR_CUSTOM_SPEECH_RECOGNITION_MODEL_ID"
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

## Sentiment Analysis (Preview)
Track the emotional tone of conversations in real time to support customer and agent interactions, and enable supervisors to intervene when necessary. Available in public preview through `createCall`, `answerCall` and `startTranscription`.

### Create a call with Sentiment Analysis enabled 

``` javascript
const transcriptionOptions = {
    transportUrl: "",
    transportType: "websocket",
    locale: "en-US",
    startTranscription: false,
    enableSentimentAnalysis: true,
    speechRecognitionModelEndpointId: "YOUR_CUSTOM_SPEECH_RECOGNITION_MODEL_ID"
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

### Answer a call with Sentiment Analysis enabled 
``` javascript
const transcriptionOptions: TranscriptionOptions = {
  transportUrl: transportUrl,
  transportType: "websocket",
  startTranscription: true,
  enableSentimentAnalysis: true
};

const answerCallOptions: AnswerCallOptions = {
  callIntelligenceOptions: {
    cognitiveServicesEndpoint: process.env.COGNITIVE_SERVICES_ENDPOINT
  },
  transcriptionOptions: transcriptionOptions,
  enableLoopbackAudio: true
};

await acsClient.answerCall(incomingCallContext, callbackUri, answerCallOptions);
```

## PII Redaction (Preview)
Automatically identify and mask sensitive information—such as names, addresses, or identification numbers—to ensure privacy and regulatory compliance. Available in `createCall`, `answerCall` and `startTranscription`.

### Answer a call with PII Redaction enabled 
``` javascript
const transcriptionOptions: TranscriptionOptions = {
  transportUrl: transportUrl,
  transportType: "websocket",
  startTranscription: true,
  piiRedactionOptions: {
    enable: true,
    redactionType: "maskWithCharacter"
  }
};

const answerCallOptions: AnswerCallOptions = {
  callIntelligenceOptions: {
    cognitiveServicesEndpoint: process.env.COGNITIVE_SERVICES_ENDPOINT
  },
  transcriptionOptions: transcriptionOptions,
  enableLoopbackAudio: true
};

await acsClient.answerCall(incomingCallContext, callbackUri, answerCallOptions);
```
>[!Note]
> With PII redaction enabled you’ll only receive the redacted text.  

## Real-time language detection (Preview)
Automatically detect spoken languages to enable natural, human-like communication and eliminate manual language selection. Available in `createCall`, `answerCall` and `startTranscription`.

### Create a call with Real-time language detection enabled
``` javascript
const transcriptionOptions: TranscriptionOptions = {
  transportUrl: transportUrl,
  transportType: "websocket",
  startTranscription: true,
  locales: ["es-ES", "en-US"]
};

const createCallOptions: CreateCallOptions = {
  callIntelligenceOptions: {
    cognitiveServicesEndpoint: process.env.COGNITIVE_SERVICES_ENDPOINT
  },
  transcriptionOptions: transcriptionOptions,
  operationContext: "CreatPSTNCallContext",
  enableLoopbackAudio: true
};
```

> [!Note]
> To stop language identification after it has started, use the `updateTranscription` API and explicitly set the language you want to use for the transcript. This disables automatic language detection and locks transcription to the specified language.



## Connect to a Rooms call and provide transcription details
If you're connecting to an ACS room and want to use transcription, configure the transcription options as follows:

```javascript
const transcriptionOptions = {
    transportUri: "",
    locale: "en-US",
    transcriptionTransport: "websocket",
    startTranscription: false,
    speechRecognitionModelEndpointId: "YOUR_CUSTOM_SPEECH_RECOGNITION_MODEL_ID"
};

const callIntelligenceOptions = {
    cognitiveServicesEndpoint: process.env.COGNITIVE_SERVICES_ENDPOINT
};

const connectCallOptions = {
    callIntelligenceOptions: callIntelligenceOptions,
    transcriptionOptions: transcriptionOptions
};

const callLocator = {
    id: roomId,
    kind: "roomCallLocator"
};

const connectResult = await client.connectCall(callLocator, callBackUri, connectCallOptions);
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

## Get mid call summaries (Preview)
Enhance your call workflows with real-time summarization. By enabling summarization in your transcription options, ACS can automatically generate concise mid-call recaps—including decisions, action items, and key discussion points—without waiting for the call to end. This helps teams stay aligned and enables faster follow-ups during live conversations.

``` javascript
const transcriptionOptions: TranscriptionOptions = {
  transportUrl: transportUrl,
  transportType: "websocket",
  startTranscription: true,
  summarizationOptions: {
    enableEndCallSummary: true,
    locale: "es-ES"
  }
};

const answerCallOptions: AnswerCallOptions = {
  callIntelligenceOptions: {
    cognitiveServicesEndpoint: process.env.COGNITIVE_SERVICES_ENDPOINT
  },
  transcriptionOptions: transcriptionOptions,
  enableLoopbackAudio: true
};

await acsClient.answerCall(incomingCallContext, callbackUri, answerCallOptions);
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

```javascript
import WebSocket from 'ws';
import { streamingData } from '@azure/communication-call-automation/src/util/streamingDataParser';

const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (packetData) => {
    const decoder = new TextDecoder();
    const stringJson = decoder.decode(packetData);
    console.log("STRING JSON =>", stringJson);

    const response = streamingData(packetData);
    const kind = response?.kind;

    if (kind === "TranscriptionMetadata") {
      console.log("--------------------------------------------");
      console.log("Transcription Metadata");
      console.log("CALL CONNECTION ID: -->", response.callConnectionId);
      console.log("CORRELATION ID: -->", response.correlationId);
      console.log("LOCALE: -->", response.locale);
      console.log("SUBSCRIPTION ID: -->", response.subscriptionId);
      console.log("SPEECH MODEL ENDPOINT: -->", response.speechRecognitionModelEndpointId);
      console.log("IS SENTIMENT ANALYSIS ENABLED: -->", response.enableSentimentAnalysis);

      if (response.piiRedactionOptions) {
        console.log("PII REDACTION ENABLED: -->", response.piiRedactionOptions.enable);
        console.log("PII REDACTION TYPE: -->", response.piiRedactionOptions.redactionType);
      }

      if (response.locales) {
        response.locales.forEach((language) => {
          console.log("LOCALE DETECTED: -->", language);
        });
      }

      console.log("--------------------------------------------");
    } else if (kind === "TranscriptionData") {
      console.log("--------------------------------------------");
      console.log("Transcription Data");
      console.log("TEXT: -->", response.text);
      console.log("FORMAT: -->", response.format);
      console.log("CONFIDENCE: -->", response.confidence);
      console.log("OFFSET IN TICKS: -->", response.offsetInTicks);
      console.log("DURATION IN TICKS: -->", response.durationInTicks);
      console.log("RESULT STATE: -->", response.resultState);

      if (response.participant?.phoneNumber) {
        console.log("PARTICIPANT PHONE NUMBER: -->", response.participant.phoneNumber);
      }

      if (response.participant?.communicationUserId) {
        console.log("PARTICIPANT USER ID: -->", response.participant.communicationUserId);
      }

      if (response.words?.length) {
        response.words.forEach((word) => {
          console.log("WORD TEXT: -->", word.text);
          console.log("WORD DURATION IN TICKS: -->", word.durationInTicks);
          console.log("WORD OFFSET IN TICKS: -->", word.offsetInTicks);
        });
      }

      if (response.sentimentAnalysisResult) {
        console.log("SENTIMENT: -->", response.sentimentAnalysisResult.sentiment);
      }

      console.log("LANGUAGE IDENTIFIED: -->", response.languageIdentified);
      console.log("--------------------------------------------");
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server running on port 8081');
```

## Update Transcription
For situations where your application allows users to select their preferred language, you may also want to capture the transcription in that language. To do this task, the Call Automation SDK allows you to update the transcription locale.

```javascript
async function updateTranscriptionAsync() {
  const options: UpdateTranscriptionOptions = {
operationContext: "updateTranscriptionContext",
speechRecognitionModelEndpointId: "YOUR_CUSTOM_SPEECH_RECOGNITION_MODEL_ID"
  };
  await acsClient
.getCallConnection(callConnectionId)
.getCallMedia()
.updateTranscription("en-au", options);
}
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
