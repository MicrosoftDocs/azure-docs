---
title: Include file - C#
description: C# Audio Streaming quickstart
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
- An Azure account with an active subscription, for details see [Create an account for free.](https://azure.microsoft.com/free/)
- An Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp).
- A new web service application created using the [Call Automation SDK](../../../quickstarts/call-automation/callflows-for-customer-interactions.md).
- The latest [.NET library](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- A websocket server that can receive media streams.

## Set up a websocket server
Azure Communication Services requires your server application to set up a WebSocket server to stream audio in real-time. WebSocket is a standardized protocol that provides a full-duplex communication channel over a single TCP connection. 
You can optionally use Azure services Azure WebApps that allows you to create an application to receive audio streams over a websocket connection. Follow this [quickstart](https://azure.microsoft.com/blog/introduction-to-websockets-on-windows-azure-web-sites/).

## Establish a call
Establish a call and provide streaming details

``` C#
MediaStreamingOptions mediaStreamingOptions = new MediaStreamingOptions( 
    new Uri("<WEBSOCKET URL>"), 
    MediaStreamingContent.Audio, 
    MediaStreamingAudioChannel.Mixed, 
    MediaStreamingTransport.Websocket, 
    false); 

 var createCallOptions = new CreateCallOptions(callInvite, callbackUri) 
 { 
     CallIntelligenceOptions = new CallIntelligenceOptions() { CognitiveServicesEndpoint = new Uri(cognitiveServiceEndpoint) }, 
     MediaStreamingOptions = mediaStreamingOptions, 
 }; 

 CreateCallResult createCallResult = await callAutomationClient.CreateCallAsync(createCallOptions); 
```

## Start audio streaming
How to start audio streaming:
``` C#
StartMediaStreamingOptions options = new StartMediaStreamingOptions() 
    { 
        OperationCallbackUri = new Uri(callbackUriHost), 
        OperationContext = "startMediaStreamingContext" 
    };
    await callMedia.StartMediaStreamingAsync(options); 
```
When Azure Communication Services receives the URL for your WebSocket server, it creates a connection to it. Once Azure Communication Services successfully connects to your WebSocket server and streaming is started, it will send through the first data packet, which contains metadata about the incoming media packets. 

The metadata packet will look like this:
``` code
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
``` C#
StopMediaStreamingOptions stopOptions = new StopMediaStreamingOptions() 
    { 
        OperationCallbackUri = new Uri(callbackUriHost) 
    }; 
    await callMedia.StopMediaStreamingAsync(stopOptions); 
```

## Handling audio streams in your websocket server
The sample below demonstrates how to listen to audio streams using your websocket server.

``` C#
HttpListener httpListener = new HttpListener(); 
httpListener.Prefixes.Add("http://localhost:80/"); 
httpListener.Start(); 

while (true) 
{ 
    HttpListenerContext httpListenerContext = await httpListener.GetContextAsync(); 
    if (httpListenerContext.Request.IsWebSocketRequest) 
    { 
        WebSocketContext websocketContext; 
        try 
        { 
            websocketContext = await httpListenerContext.AcceptWebSocketAsync(subProtocol: null); 
        } 
        catch (Exception ex) 
        { 
            return; 
        } 
        WebSocket webSocket = websocketContext.WebSocket; 
        try 
        { 
            while (webSocket.State == WebSocketState.Open || webSocket.State == WebSocketState.CloseSent) 
            { 
                byte[] receiveBuffer = new byte[2048]; 
                var cancellationToken = new CancellationTokenSource(TimeSpan.FromSeconds(60)).Token; 
                WebSocketReceiveResult receiveResult = await webSocket.ReceiveAsync(new ArraySegment<byte>(receiveBuffer), cancellationToken); 
                if (receiveResult.MessageType != WebSocketMessageType.Close) 
                { 
                    var data = Encoding.UTF8.GetString(receiveBuffer).TrimEnd('\0'); 
                    try 
                    { 
                        var eventData = JsonConvert.DeserializeObject<AudioBaseClass>(data); 
                        if (eventData != null) 
                        { 
                            if(eventData.kind == "AudioMetadata") 
                            { 
                                //Process audio metadata 
                            } 
                            else if(eventData.kind == "AudioData")  
                            { 
                                //Process audio data 
                                var byteArray = eventData.audioData.data; 
                               //use audio byteArray as you want 
                            } 
                        } 
                    } 
                    catch { } 
                } 
            } 
        } 
        catch (Exception ex) { } 
    } 
} 
```
