---
title: Include file - JavaScript
description: JavaScript Media Streaming quickstart
services: azure-communication-services
author: Alvin
ms.service: azure-communication-services
ms.subservice: call-automation
ms.date: 07/15/2024
ms.topic: include
ms.topic: Include file
ms.author: alvinhan
---

## Prerequisites 
- Azure account with an active subscription, for details see [Create an account for free.](https://azure.microsoft.com/free/)
- An Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp).
- A new web service application created using the [Call Automation SDK](../../../quickstarts/call-automation/callflows-for-customer-interactions.md).
- [Node.js](https://nodejs.org/en/) LTS installation
- A websocket server that can receive media streams.

## Set up a websocket server
Azure Communication Services requires your server application to set up a WebSocket server to stream audio in real-time. WebSocket is a standardized protocol that provides a full-duplex communication channel over a single TCP connection. 
You can optionally use Azure services Azure WebApps that allows you to create an application to receive audio streams over a websocket connection. Follow this [quickstart](https://azure.microsoft.com/blog/introduction-to-websockets-on-windows-azure-web-sites/).

## Establish a call
Establish a call and provide streaming details

``` JS
const mediaStreamingOptions: MediaStreamingOptions = { 
          transportUrl: "<WEBSOCKET URL>", 
          transportType: "websocket", 
          contentType: "audio", 
          audioChannelType: "unmixed", 
          startMediaStreaming: false 
} 
const options: CreateCallOptions = { 
          callIntelligenceOptions: { cognitiveServicesEndpoint: process.env.COGNITIVE_SERVICES_ENDPOINT }, 
          mediaStreamingOptions: mediaStreamingOptions 
}; 
```

## Start audio streaming
How to start audio streaming:
``` JS
const streamingOptions: StartMediaStreamingOptions = { 
        operationContext: "startMediaStreamingContext", 
        operationCallbackUrl: process.env.CALLBACK_URI + "/api/callbacks" 
    } 
await callMedia.startMediaStreaming(streamingOptions); 
```
When Azure Communication Services receives the URL for your WebSocket server, it creates a connection to it. Once Azure Communication Services successfully connects to your WebSocket server and streaming is started, it will send through the first data packet, which contains metadata about the incoming media packets. 

The metadata packet will look like this:
``` 
{ 
    "kind": <string> // What kind of data this is, e.g. AudioMetadata, AudioData. 
    "audioMetadata": { 
        "subscriptionId": <string>, // unique identifier for a subscription request 
        "encoding":<string>, // PCM only supported 
        "sampleRate": <int>, // 16000 default 
        "channels": <int>, // 1 default 
        "length": <int> // 640 default 
    } 
} 
```


## Stop audio streaming
How to stop audio streaming
``` JS
const stopMediaStreamingOptions: StopMediaStreamingOptions = { 
        operationCallbackUrl: process.env.CALLBACK_URI + "/api/callbacks" 
        } 
await callMedia.stopMediaStreaming(stopMediaStreamingOptions); 
```

## Handling audio streams in your websocket server
The sample below demonstrates how to listen to audio streams using your websocket server.

``` JS
import WebSocket from 'ws'; 
import { streamingData } from '@azure/communication-call-automation/src/utli/streamingDataParser' 
const wss = new WebSocket.Server({ port: 8081 }); 

wss.on('connection', (ws: WebSocket) => { 
    console.log('Client connected'); 
    ws.on('message', (packetData: ArrayBuffer) => { 
        const decoder = new TextDecoder(); 
        const stringJson = decoder.decode(packetData); 
        console.log("STRING JSON=>--" + stringJson) 

        //var response = streamingData(stringJson); 

        var response = streamingData(packetData); 
        if ('locale' in response) { 
            console.log("Transcription Metadata") 
            console.log(response.callConnectionId); 
            console.log(response.correlationId); 
            console.log(response.locale); 
            console.log(response.subscriptionId); 
        } 
        if ('text' in response) { 
            console.log("Transcription Data") 
            console.log(response.text); 
            console.log(response.format); 
            console.log(response.confidence); 
            console.log(response.offset); 
            console.log(response.duration); 
            console.log(response.resultStatus); 
            if ('phoneNumber' in response.participant) { 
                console.log(response.participant.phoneNumber); 
            } 
            response.words.forEach(element => { 
                console.log(element.text) 
                console.log(element.duration) 
                console.log(element.offset) 
            }); 
        } 
    }); 

    ws.on('close', () => { 
        console.log('Client disconnected'); 
    }); 
}); 

// function processData(data: ArrayBuffer) { 
//  const byteArray = new Uint8Array(data); 
// } 

console.log('WebSocket server running on port 8081'); 
```
