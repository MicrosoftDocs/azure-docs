---
title: include file
description: C# Media Streaming quickstart
services: azure-communication-services
author: Kunaal
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 10/25/2022
ms.topic: include
ms.topic: include file
ms.author: kpunjabi
---

## Prerequisites 
- Azure account with an active subscription, for details see [Create an account for free.](https://azure.microsoft.com/free/)
- Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../create-communication-resource.md?tabs=windows&pivots=platform-azp)
- Create a new web service application using the [Call Automation SDK](../../Callflows-for-customer-interactions.md).
- The latest [.NET library](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- [Apache Maven](https://maven.apache.org/download.cgi).
- A websocket server that can receive media streams.

## Set up a websocket server
Azure Communication Services requires your server application to set up a WebSocket server to stream audio in real-time. WebSocket is a standardized protocol that provides a full-duplex communication channel over a single TCP connection. 
You can optionally use Azure services Azure WebApps that allows you to create an application to receive audio streams over a websocket connection. Follow this [quickstart](https://azure.microsoft.com/blog/introduction-to-websockets-on-windows-azure-web-sites/).

## Establish a call
In this quickstart we assume that you're already familiar with starting calls. If you need to learn more about starting and establishing calls, you can follow our [quickstart](../../callflows-for-customer-interactions.md). For the purposes of this quickstart, we'll be going through the process of starting media streaming for both incoming calls and outbound calls. 

## Start media streaming - incoming call 
Your application will start receiving media streams once you answer the call and provide ACS with the WebSocket information. 

``` csharp
var mediaStreamingOptions = new MediaStreamingOptions(
    new Uri("wss://testwebsocket.webpubsub.azure.com/client/hubs/media?accesstoken={access_token}"),
      MediaStreamingTransport.WebSocket,
      MediaStreamingContent.Audio,
      MediaStreamingAudioChannel.Mixed,
    );
    var answerCallOptions = new AnswerCallOptions(incomingCallContext, callbackUri: new Uri(callConfiguration.AppCallbackUrl)) {
      MediaStreamingOptions = mediaStreamingOptions
    };
    var response = await callingServerClient.AnswerCallAsync(answerCallOptions);
```

## Start media streaming - outbound call
Your application will start receiving media streams once you create the call and provide ACS with the WebSocket information. 

``` csharp
var mediaStreamingOptions = new MediaStreamingOptions(
  new Uri("wss://{yourwebsocketurl}"),
  MediaStreamingTransport.WebSocket,
  MediaStreamingContent.Audio,
  MediaStreamingAudioChannel.Mixed,
);
var createCallOptions = new CreateCallOptions(callSource, new List < PhoneNumberIdentifier > {
  target
}, new Uri(callConfiguration.AppCallbackUrl)) {
  MediaStreamingOptions = mediaStreamingOptions
};
var createCallResult = await client.CreateCallAsync(createCallOptions);
```
## Handling media streams in your websocket server
The sample below demonstrates how to listen to media stream using your websocket server

``` csharp
HttpListener httpListener = new HttpListener();
httpListener.Prefixes.Add("http://localhost:80/");
httpListener.Start();
while (true) {
     HttpListenerContext httpListenerContext = await httpListener.GetContextAsync();
     if (httpListenerContext.Request.IsWebSocketRequest) {
         WebSocketContext websocketContext;
         try {
            websocketContext = await httpListenerContext.AcceptWebSocketAsync(subProtocol: null);
            string ipAddress = httpListenerContext.Request.RemoteEndPoint.Address.ToString();
         } catch (Exception ex) {
           httpListenerContext.Response.StatusCode = 500;
           httpListenerContext.Response.Close();
           return;
         }
        WebSocket webSocket = websocketContext.WebSocket;
        try {
           while (webSocket.State == WebSocketState.Open || webSocket.State == WebSocketState.CloseSent) {
                byte[] receiveBuffer = new byte[2048];
                var cancellationToken = new CancellationTokenSource(TimeSpan.FromSeconds(60)).Token;
                WebSocketReceiveResult receiveResult = await webSocket.ReceiveAsync(new ArraySegment < byte >.                               (receiveBuffer), cancellationToken);
                if (receiveResult.MessageType != WebSocketMessageType.Close) {
                  var data = Encoding.UTF8.GetString(receiveBuffer).TrimEnd('\0');
                  try {
                      var json = JsonConvert.DeserializeObject < Audio > (data);
                      if (json != null) {
                        var byteArray = json.AudioData;
                        //Processing mixed audio data
                        if (string.IsNullOrEmpty(json?.ParticipantId)) {
                           if (string.IsNullOrEmpty(WebSocketData.FirstReceivedMixedAudioBufferTimeStamp)) {
                             WebSocketData.FirstReceivedMixedAudioBufferTimeStamp = json.Timestamp;
                           }
                           //Process byteArray ( audioData ) however you want
                        }
                      }

                     //Processing unmixed audio data
                    else if (!string.IsNullOrEmpty(json?.ParticipantId) && !json.IsSilence) {
                        if (json.ParticipantId != null) {
                           switch (json.ParticipantId) {
                           case {
                               participantRawId1
                           }:
                           //Process audio data
                           break;
                           case {
                               participantRawId2
                           }::
                           //Process audio data
                           break;
                           default:
                                break;
                           }
                        }
                        if (string.IsNullOrEmpty(WebSocketData.FirstReceivedUnmixedAudioBufferTimeStamp)) {
                           WebSocketData.FirstReceivedUnmixedAudioBufferTimeStamp = json.Timestamp;
                        }
                    }
                 } catch {}
              }
           }
        } catch (Exception ex) {}
      } else {
        httpListenerContext.Response.StatusCode = 400;
        httpListenerContext.Response.Close();
   }
}
```
