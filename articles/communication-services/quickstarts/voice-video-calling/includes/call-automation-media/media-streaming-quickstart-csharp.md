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

## Setup a websocket server
Azure Communication Services requires your server application to setup a WebSocket server to stream audio in real-time. WebSocket is a standardized protocol that provides a full-duplex communication channel over a single TCP connection. 
You can optionally leverage Azure services Azure WebApps that allows you to create an application to receive audio streams over a websocket connection. Follow this [quickstart](https://azure.microsoft.com/blog/introduction-to-websockets-on-windows-azure-web-sites/).

## Establish a call
In this quickstart we assume that you are already familiar with starting calls, if you need to learn more about starting and establishing calls, you can follow our [quickstart](.../../Callflows-for-customer-interactions.md). For the purposes of this quickstart we will be going through the process of starting media streaming for both incoming calls and outbound calls. 

## Start media streaming - Incoming call 
You application will start streaming media when it answers an incoming call. This can be done by providing ACS with your websocket information at the time of answering the call. 

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

## Start media streaming - Outbound call
Media streaming can also be initiated when your application creates an outbound call. This can be done by providing ACS the websocket information at the time of the call creation. 

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

## Message schema
When ACS has received the URL for your WebSocket server, it will create a connection to it. Once ACS has successfully connected to your WebSocket server it will send through the first data packet which contains metadata regarding the incoming media packets.

``` code
/**
 * The first message upon WebSocket connection will be the metadata packet
 * which contains the subscriptionId and audio format
 */
public class AudioMetadataSample {
    public string kind; // What kind of data this is, e.g. AudioMetadata, AudioData.
    public AudioMetadata audioMetadata;
}

public class AudioMetadata {
    public string subscriptionId // unique identifier for a subscription request
    public string encoding; // PCM only supported
    public int sampleRate; // 16000 default
    public int channels; // 1 default
    public int length; // 640 default
}
```

## Audio streaming schema
After sending through the metadata packet, ACS will start streaming audio media to your WebSocket server. Below is an example of what the media object your server will receive looks like. 

``` code
/**
 * The audio buffer object which is then serialized to JSON format
 */
public class AudioDataSample {
    public string kind; // What kind of data this is, e.g. AudioMetadata, AudioData.
    public AudioData audioData;
}

public class AudioData {
    public string data; // Base64 Encoded audio buffer data
    public string timestamp; // In ISO 8601 format (yyyy-mm-ddThh:mm:ssZ) 
    public string participantRawID;
    public boolean silent; // Indicates if the received audio buffer contains only silence.
} 
```

Example of audio data being streamed 

``` json
{
  "kind": "AudioData",
  "audioData": {
    "timestamp": "2022-10-03T19:16:12.925Z",
    "participantRawID": "8:acs:3d20e1de-0f28-41c5-84a0-4960fde5f411_0000000b-faeb-c708-99bf-a43a0d0036b0",
    "data": "5ADwAOMA6AD0AOIA4ADkAN8AzwDUANEAywC+ALQArgC0AKYAnACJAIoAlACWAJ8ApwCiAKkAqgCqALUA0wDWANAA3QDVAN0A8wDzAPAA7wDkANkA1QDPAPIA6QDmAOcA0wDYAPMA8QD8AP0AAwH+AAAB/QAAAREBEQEDAQoB9wD3APsA7gDxAPMA7wDpAN0A6gD5APsAAgEHAQ4BEAETARsBMAFHAUABPgE2AS8BKAErATEBLwE7ASYBGQEAAQcBBQH5AAIBBwEMAQ4BAAH+APYA6gDzAPgA7gDkAOUA3wDcANQA2gDWAN8A3wDcAMcAxwDIAMsA1wDfAO4A3wDUANQA3wDvAOUA4QDpAOAA4ADhAOYA5wDkAOUA1gDxAOcA4wDpAOEA4gD0APoA7wD9APkA6ADwAPIA7ADrAPEA6ADfANQAzQDLANIAzwDaANcA3QDZAOQA4wDXANwA1ADbAOsA7ADyAPkA7wDiAOIA6gDtAOsA7gDeAOIA4ADeANUA6gD1APAA8ADgAOQA5wDgAPgA8ADnAN8A5gDgAOoA6wDcAOgA2gDZANUAyQDPANwA3gDgAO4A8QDyAAQBEwEDAewA+gDpAN4A6wDeAO8A8QDwAO8ABAEKAQUB/gD5AAMBAwEIARoBFAEeARkBDgH8AP0A+gD8APcA+gDrAO0A5wDcANEA0QDHAM4A0wDUAM4A0wDZANQAxgDSAM4A1ADVAOMA4QDhANUA2gDjAOYA5wDrANQA5wDrAMsAxQDWANsA5wDpAOEA4QDFAMoA0QDKAMgAwgDNAMsAwgCwAKkAtwCrAKoAsACgAJ4AlQCeAKAAoQCmAKwApwCsAK0AnQCVAA==",
    "silent": false
  }
}
```

## Stop audio streaming
Audio streaming will automatically stop when the call ends or is cancelled. 
