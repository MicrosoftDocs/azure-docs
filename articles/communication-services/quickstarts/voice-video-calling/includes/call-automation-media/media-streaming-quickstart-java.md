---
title: include file
description: Java Media Streaming quickstart
services: azure-communication-services
author: Kunaal
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 09/06/2022
ms.topic: include
ms.topic: include file
ms.author: kpunjabi
---

## Prerequisites

- Azure account with an active subscription, for details see [Create an account for free.](https://azure.microsoft.com/free/)
- Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../create-communication-resource.md?tabs=windows&pivots=platform-azp)
- Create a new web service application using the [Call Automation SDK](../../Callflows-for-customer-interactions.md).
- [Java Development Kit](/java/azure/jdk/?preserve-view=true&view=azure-java-stable) version 8 or above.
- [Apache Maven](https://maven.apache.org/download.cgi).

## Setup a websocket server
Azure Communication Services requires your server application to setup a WebSocket server to stream audio in real-time. WebSocket is a standardized protocol that provides a full-duplex communication channel over a single TCP connection. 
You can optionally leverage Azure services Azure WebApps that allows you to create an application to receive audio streams over a websocket connection. Follow this [quickstart](https://azure.microsoft.com/blog/introduction-to-websockets-on-windows-azure-web-sites/).

## Establish a call
In this quickstart we assume that you are already familiar with starting calls, if you need to learn more about starting and establishing calls, you can follow our [quickstart](.../../Callflows-for-customer-interactions.md). For the purposes of this quickstart we will be going through the process of starting media streaming for both incoming calls and outbound calls.

## Start media streaming - Incoming call 
You application will start streaming media when it answers an incoming call. This can be done by providing ACS with your websocket information at the time of answering the call. 

``` java
var mediaStreamingOptions = new MediaStreamingOptions(
    "wss://{yourwebsocketurl}",
    MediaStreamingTransport.WebSocket,
    MediaStreamingContent.Audio,
    MediaStreamingAudioChannel.Mixed
);
var answerCallOptions = new AnswerCallOptions(“<incomingCallContext>”, callConfiguration.AppCallbackUrl).setMediaStreamingConfiguration(mediaStreamingOptions);

var answerCallResponse = callAutomationAsyncClient.answerCallWithResponse(answerCallOptions).block();
```

## Start media streaming - Outbound call
Media streaming can also be initiated when your application creates an outbound call. This can be done by providing ACS the websocket information at the time of the call creation. 

``` java
var mediaStreamingOptions = new MediaStreamingOptions(
    "wss://{yourwebsocketurl}",
    MediaStreamingTransportType.WebSocket,
    MediaStreamingContentType.Audio,
    MediaStreamingAudioChannelType.Mixed
);
var createCallOptions = new CreateCallOptions(
    callSource,
    Collections.singletonList(target),
    callConfiguration.AppCallbackUrl 
);
createCallOptions.setMediaStreamingConfiguration(mediaStreamingOptions);
var answerCallResponse = callAutomationAsyncClient.createCallWithResponse(
    createCallOptions
).block();
```

## Handling media streams in your websocket server
The sample below demonstrates how to listen to media stream using your websocket server.

``` java
public class WebsocketServer {
    public static void main(String[] args) throws IOException {
        Socket socket = null;
        InputStreamReader inputStreamReader = null;
        OutputStreamWriter outputStreamWriter = null;
        BufferedReader bufferedReader = null;
        BufferedWriter bufferedWriter = null;
        ServerSocket serverSocket = null;
        serverSocket = new ServerSocket(1234);
        while (true) {
            try {
                socket = serverSocket.accept();
                inputStreamReader = new InputStreamReader(socket.getInputStream());
                outputStreamWriter = new OutputStreamWriter(socket.getOutputStream());
                bufferedReader = new BufferedReader(inputStreamReader);
                bufferedWriter = new BufferedWriter(outputStreamWriter);
                while (!socket.isClosed()) {
                    String msgFromClient = bufferedReader.readLine();
                    //You can process the message however you want
                    System.out.println("Client:" + msgFromClient);
                    bufferedWriter.write("MSG Received");
                    bufferedWriter.newLine();
                    bufferedWriter.flush();
                }
                socket.close();
                inputStreamReader.close();
                outputStreamWriter.close();
                bufferedWriter.close();
                bufferedReader.close();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
```
