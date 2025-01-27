---
title: Include file - JavaScript
description: JavaScript Media Streaming quickstart
services: azure-communication-services
author: alvin-l-han
ms.service: azure-communication-services
ms.subservice: call-automation
ms.date: 11/26/2024
ms.topic: include
ms.topic: Include file
ms.author: alvinhan
---

## Prerequisites 
- Azure account with an active subscription, for details see [Create an account for free.](https://azure.microsoft.com/free/)
- An Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp).
- A new web service application created using the [Call Automation SDK](../../../quickstarts/call-automation/callflows-for-customer-interactions.md).
- [Node.js](https://nodejs.org/en/) LTS installation
- A websocket server that can send and receive media streams.

## Set up a websocket server
Azure Communication Services requires your server application to set up a WebSocket server to stream audio in real-time. WebSocket is a standardized protocol that provides a full-duplex communication channel over a single TCP connection. 

You can review documentation [here](https://azure.microsoft.com/blog/introduction-to-websockets-on-windows-azure-web-sites/) to learn more about WebSockets and how to use them.

## Receiving and sending audio streaming data
There are multiple ways to start receiving audio stream, which can be configured using the `startMediaStreaming` flag in the `mediaStreamingOptions` setup. You can also specify the desired sample rate used for receiving or sending audio data using the `audioFormat` parameter. Currently supported formats are PCM 24K mono and PCM 16K mono, with the default being PCM 16K mono.

To enable bidirectional audio streaming, where you're sending audio data into the call, you can enable the `EnableBidirectional` flag. For more details, refer to the [API specifications](/rest/api/communication/callautomation/answer-call/answer-call?view=rest-communication-callautomation-2024-06-15-preview&preserve-view=true&tabs=HTTP#mediastreamingoptions).

### Start streaming audio to your webserver at time of answering the call
Enable automatic audio streaming when the call is established by setting the flag `startMediaStreaming: true`.
 
This setting ensures that audio streaming starts automatically as soon as the call is connected.

``` JS
var mediaStreamingOptions = new MediaStreamingOptions(
	new Uri("wss://YOUR_WEBSOCKET_URL"),
	MediaStreamingContent.Audio,
	MediaStreamingAudioChannel.Mixed,
	startMediaStreaming: true)
{
	EnableBidirectional = true,
		AudioFormat = AudioFormat.Pcm24KMono
}
var options = new AnswerCallOptions(incomingCallContext, callbackUri)
{
	MediaStreamingOptions = mediaStreamingOptions,
};

AnswerCallResult answerCallResult = await client.AnswerCallAsync(options);
```

When Azure Communication Services receives the URL for your WebSocket server, it establishes a connection to it. Once the connection is successfully made, streaming is initiated.

### Start streaming audio to your webserver while a call is in progress
To start media streaming during the call, you can use the API. To do so, set the `startMediaStreaming` parameter to `false` (which is the default), and later in the call, you can use the start API to enable media streaming.

``` JS
const mediaStreamingOptions: MediaStreamingOptions = {
	transportUrl: transportUrl,
	transportType: "websocket",
	contentType: "audio",
	audioChannelType: "unmixed",
	startMediaStreaming: false,
	enableBidirectional: true,
	audioFormat: "Pcm24KMono"
}
const answerCallOptions: AnswerCallOptions = {
	mediaStreamingOptions: mediaStreamingOptions
};

answerCallResult = await acsClient.answerCall(
	incomingCallContext,
	callbackUri,
	answerCallOptions
);

const startMediaStreamingOptions: StartMediaStreamingOptions = {
	operationContext: "startMediaStreaming"
}

await answerCallResult.callConnection.getCallMedia().startMediaStreaming(startMediaStreamingOptions);
```


## Stop audio streaming
To stop receiving audio streams during a call, you can use the **Stop streaming API**. This allows you to stop the audio streaming at any point in the call. There are two ways that audio streaming can be stopped;
- **Triggering the Stop streaming API:** Use the API to stop receiving audio streaming data while the call is still active.
- **Automatic stop on call disconnect:** Audio streaming automatically stops when the call is disconnected.

``` JS
const stopMediaStreamingOptions: StopMediaStreamingOptions = {
	operationContext: "stopMediaStreaming"
}
await answerCallResult.callConnection.getCallMedia().stopMediaStreaming(stopMediaStreamingOptions);
```

## Handling audio streams in your websocket server
This sample demonstrates how to listen to audio streams using your websocket server.

``` JS
wss.on('connection', async (ws: WebSocket) => {
	console.log('Client connected');
	await initWebsocket(ws);
	await startConversation();
	ws.on('message', async (packetData: ArrayBuffer) => {
		try {
			if (ws.readyState === WebSocket.OPEN) {
				await processWebsocketMessageAsync(packetData);
			} else {
				console.warn(`ReadyState: ${ws.readyState}`);
			}
		} catch (error) {
			console.error('Error processing WebSocket message:', error);
		}
	});
	ws.on('close', () => {
		console.log('Client disconnected');
	});
});

async function processWebsocketMessageAsync(receivedBuffer: ArrayBuffer) {
	const result = StreamingData.parse(receivedBuffer);
	const kind = StreamingData.getStreamingKind();

	// Get the streaming data kind  
	if (kind === StreamingDataKind.AudioData) {
		const audioData = (result as AudioData);
		// process your audio data  
	}
}
```

The first packet you receive contains metadata about the stream, including audio settings such as encoding, sample rate, and other configuration details.

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
If bidirectional streaming is enabled using the `EnableBidirectional` flag in the `MediaStreamingOptions`, you can stream audio data back to Azure Communication Services, which plays the audio into the call.

Once Azure Communication Services begins streaming audio to your WebSocket server, you can relay the audio to your AI services. After your AI service processes the audio content, you can stream the audio back to the ongoing call in Azure Communication Services.

The example demonstrates how another service, such as Azure OpenAI or other voice-based Large Language Models, processes and transmits the audio data back into the call.

``` JS
async function receiveAudioForOutbound(data: string) { 
    try {
        const jsonData = OutStreamingData.getStreamingDataForOutbound(data);
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(jsonData);
        } else {
            console.log("socket connection is not open.");
        }
    } catch (e) {
        console.log(e);
    }
}
```

You can also control the playback of audio in the call when streaming back to Azure Communication Services, based on your logic or business flow. For example, when voice activity is detected and you want to stop the queued up audio, you can send a stop message via the WebSocket to stop the audio from playing in the call.

``` JS
async function stopAudio() {
	try {
		const jsonData = OutStreamingData.getStopAudioForOutbound();
		if (ws.readyState === WebSocket.OPEN) {
			ws.send(jsonData);
		} else {
			console.log("socket connection is not open.");
		}
	} catch (e) {
		console.log(e);
	}
}
```
