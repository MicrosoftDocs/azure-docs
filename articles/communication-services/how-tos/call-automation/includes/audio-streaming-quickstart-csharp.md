---
title: Include file - C#
description: C# Bidirectional audio streaming how-to
services: azure-communication-services
author: Alvin
ms.service: azure-communication-services
ms.subservice: call-automation
ms.date: 11/24/2024
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

## Receiving and Sending audio streaming data
There are multiple ways to start receiving audio stream, which can be configured using the `startMediaStreaming` flag in the `mediaStreamingOptions` setup. You can also specify the desired sample rate used for recieving or sending audio data using the `audioFormat` parameter. Currently supported formats are PCM 24K mono and PCM 16K mono, with the default being PCM 16K mono.

To enable bidirectional audio streaming, where you're sending audio data into the call, you can enable the `EnableBidirectional` flag. 

### Start streaming audio to your webserver at time of answering the call
Enable automatic audio streaming when the call is established by setting the flag `startMediaStreaming: true`.
 
This ensures that audio streaming starts automatically as soon as the call is connected.

``` C#
var mediaStreamingOptions = new MediaStreamingOptions(
  new Uri("wss://YOUR_WEBSOCKET_URL"),
  MediaStreamingContent.Audio,
  MediaStreamingAudioChannel.Mixed,
  startMediaStreaming: true) {
  EnableBidirectional = true,
    AudioFormat = AudioFormat.Pcm24KMono
}
var options = new AnswerCallOptions(incomingCallContext, callbackUri) {
  MediaStreamingOptions = mediaStreamingOptions,
};

AnswerCallResult answerCallResult = await client.AnswerCallAsync(options);
```

When Azure Communication Services receives the URL for your WebSocket server, it establishes a connection to it. Once the connection is successfully made, streaming is initiated.


### Start streaming audio to your webserver while a call is in progress
To start media streaming during the call, you can use the API. To do so, set the `startMediaStreaming` parameter to `false` (which is the default), and later in the call, you can use the start API to enable media streaming.

``` C#
var mediaStreamingOptions = new MediaStreamingOptions(
  new Uri("wss://<YOUR_WEBSOCKET_URL"),
  MediaStreamingContent.Audio,
  MediaStreamingAudioChannel.Mixed,
  startMediaStreaming: false) {
  EnableBidirectional = true,
    AudioFormat = AudioFormat.Pcm24KMono
}
var options = new AnswerCallOptions(incomingCallContext, callbackUri) {
  MediaStreamingOptions = mediaStreamingOptions,
};

AnswerCallResult answerCallResult = await client.AnswerCallAsync(options);

Start media streaming via API call
StartMediaStreamingOptions options = new StartMediaStreamingOptions() {
  OperationContext = "startMediaStreamingContext"
};

await callMedia.StartMediaStreamingAsync();
```


## Stop audio streaming
To stop recieving audio streams during a call, you can use the **Stop streaming API**. This allows you to stop the audio streaming at any point in the call. There are two ways that audio streaming can be stopped;
1. **Triggering the Stop streaming API:** Use the API to stop receiving audio streaming data while the call is still active.
2. **Automatic stop on call disconnect:** Audio streaming will automatically stop when the call is disconnected.

``` C#
StopMediaStreamingOptions options = new StopMediaStreamingOptions() {
  OperationContext = "stopMediaStreamingContext"
};

await callMedia.StopMediaStreamingAsync();
```

## Handling audio streams in your websocket server
The sample below demonstrates how to listen to audio streams using your websocket server.

``` C#
public async Task StartReceivingFromAcsMediaWebSocket() {
  if (m_webSocket == null) {
    return;
  }
  try {
    while (m_webSocket.State == WebSocketState.Open || m_webSocket.State == WebSocketState.Closed) {
      byte[] receiveBuffer = new byte[2048];
      WebSocketReceiveResult receiveResult = await m_webSocket.ReceiveAsync(new ArraySegment < byte > (receiveBuffer), m_cts.Token);

      if (receiveResult.MessageType != WebSocketMessageType.Close) {
        string data = Encoding.UTF8.GetString(receiveBuffer).TrimEnd('\0');
        var input = StreamingData.Parse(data, AudioData.class);
        if (input is AudioData audioData) {
          using(var ms = new MemoryStream(audioData.Data)) {
            // Forward audio data to external AI
            await m_aiServiceHandler.SendAudioToExternalAI(ms);
          }
        }
      }
    }
  } catch (Exception ex) {
    Console.WriteLine($"Exception -> {ex}");
  }
}
```

The first packet you receive will contain metadata about the streaming, including audio settings such as encoding, sample rate, and other configuration details.

``` json
{
  "kind": "AudioMetadata",
  "audioMetadata": {
    "subscriptionId": "89e8cb59-b991-48b0-b154-1db84f16a077",
    "encoding": "PCM",
    "sampleRate": 16000,
    "channels": 1,
    "length": 640
  }
}
```

After sending the metadata packet, Azure Communication Services (ACS) will begin streaming audio media to your WebSocket server.

``` json
{
  "kind": "AudioData",
  "audioData": {
    "timestamp": "2024-11-15T19:16:12.925Z",
    "participantRawID": "8:acs:3d20e1de-0f28-41c5…",
    "data": "5ADwAOMA6AD0A…",
    "silent": false
  }
}
```

## Sending audio streaming data to Azure Communication Services
If bidirectional streaming is enabled using the `EnableBidirectional` flag in the `MediaStreamingOptions`, you can stream audio data back to Azure Communication Services, which will play the audio into the call.

Once Azure Communication Services begins streaming audio to your WebSocket server, you can relay the audio to the LLM and vice versa. After the LLM processes the audio content, it streams the response back to your service, which you can then send into the Azure Communication Services call.

The example below demonstrates how to transmit the audio data back into the call after it has been processed by another service, for instance Azure OpenAI or other such voice based Large Language Models.

``` C#
private void ConvertToAcsAudioPacketAndForward(byte[] audioData) {
  var audio = OutStreamingData.GetStreamingDataForOutbound(audioData)

  // Serialize the JSON object to a string
  string jsonString = System.Text.Json.JsonSerializer.Serialize < OutStreamingData > (audio);

  // queue it to the buffer
  try {
    m_channel.Writer.TryWrite(async () => await m_mediaStreaming.SendMessageAsync(jsonString));
  } catch (Exception ex) {
    Console.WriteLine($"\"Exception received on ReceiveAudioForOutBound {ex}");
  }
}

public async Task SendMessageAsync(string message) {
  if (m_webSocket?.State == WebSocketState.Open) {
    byte[] jsonBytes = Encoding.UTF8.GetBytes(message);

    // Send the PCM audio chunk over WebSocket
    await m_webSocket.SendAsync(new ArraySegment < byte > (jsonBytes), WebSocketMessageType.Text, endOfMessage: true, CancellationToken.None);
  }
}
```

You can also control the playback of audio in the call when streaming back to Azure Communication Services, based on your logic or business flow. For example, when voice activity is detected and you want to stop the queued up audio, you can send a stop message via the WebSocket to stop the audio from playing in the call.

``` C#
private void StopAudio() {
  try {
    var jsonObject = OutStreamingData.GetStopAudioForOutbound();

    // Serialize the JSON object to a string
    string jsonString = System.Text.Json.JsonSerializer.Serialize < OutStreamingData > (jsonObject);

    try {
      m_channel.Writer.TryWrite(async () => await m_mediaStreaming.SendMessageAsync(jsonString));
    } catch (Exception ex) {
      Console.WriteLine($"\"Exception received on ReceiveAudioForOutBound {ex}");
    }
  } catch (Exception ex) {
    Console.WriteLine($"Exception during streaming -> {ex}");
  }
}

public async Task SendMessageAsync(string message) {
  if (m_webSocket?.State == WebSocketState.Open) {
    byte[] jsonBytes = Encoding.UTF8.GetBytes(message);

    // Send the PCM audio chunk over WebSocket
    await m_webSocket.SendAsync(new ArraySegment < byte > (jsonBytes), WebSocketMessageType.Text, endOfMessage: true, CancellationToken.None);
  }
}
```





