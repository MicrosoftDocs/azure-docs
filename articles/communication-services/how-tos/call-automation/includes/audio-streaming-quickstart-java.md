---
title: include file
description: Java Audio Streaming quickstart
services: azure-communication-services
author: Alvin
ms.service: azure-communication-services
ms.subservice: call-automation
ms.date: 09/06/2022
ms.topic: include
ms.topic: include file
ms.author: alvinhan
---

## Prerequisites

- Azure account with an active subscription, for details see [Create an account for free.](https://azure.microsoft.com/free/)
- Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../create-communication-resource.md?tabs=windows&pivots=platform-azp)
- Create a new web service application using the [Call Automation SDK](../../../call-automation/Callflows-for-customer-interactions.md).
- [Java Development Kit](/java/azure/jdk/?preserve-view=true&view=azure-java-stable) version 8 or above.
- [Apache Maven](https://maven.apache.org/download.cgi).

## Set up a websocket server
Azure Communication Services requires your server application to set up a WebSocket server to stream audio in real-time. WebSocket is a standardized protocol that provides a full-duplex communication channel over a single TCP connection. 
You can optionally use Azure services Azure WebApps that allows you to create an application to receive audio streams over a websocket connection. Follow this [quickstart](https://azure.microsoft.com/blog/introduction-to-websockets-on-windows-azure-web-sites/).

## Establish a call
In this quickstart we assume that you're already familiar with starting calls. If you need to learn more about starting and establishing calls, you can follow our [quickstart](../../../call-automation/callflows-for-customer-interactions.md).

## Start Audio Streaming

When Azure Communication Services has received the URL for your WebSocket server, it will create a connection to it. Once Azure Communication Services has successfully connected to your WebSocket server, it will send through the first data packet which contains metadata regarding the incoming media packets. 

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


How to start audio streaming:
``` java
Method1:  
StartMediaStreamingOptions startOptions = new StartMediaStreamingOptions()  
                                                        .setOperationContext("startMediaStreamingContext")  
                                                        .setOperationCallbackUrl(appConfig.getBasecallbackuri());  
         client.getCallConnection(callConnectionId)  
                     .getCallMedia()  
                     .startMediaStreamingWithResponse(startOptions, Context.NONE);      

Method2:  
        client.getCallConnection(callConnectionId)  
                    .getCallMedia()  
                    .startMediaStreaming();  
```

## Stop Audio Streaming
How to stop audio streaming
``` java
Method1:  
StopMediaStreamingOptions stopOptions = new StopMediaStreamingOptions()  
                                                        .setOperationCallbackUrl(appConfig.getBasecallbackuri());  
         client.getCallConnection(callConnectionId)  
                     .getCallMedia()  
                     .stopMediaStreamingWithResponse(stopOptions, Context.NONE);

Method2:  
        client.getCallConnection(callConnectionId)  
                    .getCallMedia()  
```

## Handling media streams in your websocket server
The sample below demonstrates how to listen to media stream using your websocket server.  There will be two files that need to be run: App.java and WebSocketServer.java

``` App.java
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
``` WebSocketServer.java
package com.example;

import javax.websocket.OnMessage;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import com.azure.communication.callautomation.models.streaming.StreamingData;
import com.azure.communication.callautomation.models.streaming.StreamingDataParser;
import com.azure.communication.callautomation.models.streaming.media.AudioData;
import com.azure.communication.callautomation.models.streaming.media.AudioMetadata;

@ServerEndpoint("/server")
public class WebSocketServer {
    @OnMessage
    public void onMessage(String message, Session session) {

        // System.out.println("Received message: " + message);

        StreamingData data = StreamingDataParser.parse(message);

        if (data instanceof AudioMetadata) {
            AudioMetadata audioMetaData = (AudioMetadata) data;
            System.out.println("----------------------------------------------------------------");
            System.out.println("SUBSCRIPTION ID:-->" + audioMetaData.getMediaSubscriptionId());
            System.out.println("ENCODING:-->" + audioMetaData.getEncoding());
            System.out.println("SAMPLE RATE:-->" + audioMetaData.getSampleRate());
            System.out.println("CHANNELS:-->" + audioMetaData.getChannels());
            System.out.println("LENGTH:-->" + audioMetaData.getLength());
            System.out.println("----------------------------------------------------------------");
        }
        if (data instanceof AudioData) {
            System.out.println("----------------------------------------------------------------");
            AudioData audioData = (AudioData) data;
            System.out.println("DATA:-->" + audioData.getData());
            System.out.println("TIMESTAMP:-->" + audioData.getTimestamp());
            // System.out.println("PARTICIPANT:-->" + audioData.getParticipant().getRawId()
            // != null
            // ? audioData.getParticipant().getRawId()
            // : "");
            System.out.println("IS SILENT:-->" + audioData.isSilent());
            System.out.println("----------------------------------------------------------------");
        }
    }
}
```
