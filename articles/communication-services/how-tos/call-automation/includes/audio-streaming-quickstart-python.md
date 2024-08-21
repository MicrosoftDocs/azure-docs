---
title: Include file - Python
description: Python Audio Streaming quickstart
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
- [Python](https://www.python.org/downloads/) 3.7+.
- A websocket server that can receive media streams.

## Set up a websocket server
Azure Communication Services requires your server application to set up a WebSocket server to stream audio in real-time. WebSocket is a standardized protocol that provides a full-duplex communication channel over a single TCP connection. 
You can optionally use Azure services Azure WebApps that allows you to create an application to receive audio streams over a websocket connection. Follow this [quickstart](https://azure.microsoft.com/blog/introduction-to-websockets-on-windows-azure-web-sites/).

## Establish a call
Establish a call and provide streaming details

``` Python
media_streaming_options = MediaStreamingOptions( 
         transport_url="wss://e063-2409-40c2-4004-eced-9487-4dfb-b0e4-10fb.ngrok-free.app", 
         transport_type=MediaStreamingTransportType.WEBSOCKET, 
         content_type=MediaStreamingContentType.AUDIO, 
         audio_channel_type=MediaStreamingAudioChannelType.UNMIXED, 
         start_media_streaming=False 
         ) 

call_connection_properties = call_automation_client.create_call(target_participant,  
                                                                    CALLBACK_EVENTS_URI, 
                                                                    cognitive_services_endpoint=COGNITIVE_SERVICES_ENDPOINT, 
                                                                    source_caller_id_number=source_caller, 
                                                                    media_streaming=media_streaming_options
) 
```

## Start audio streaming
How to start audio streaming:
``` Python
call_connection_client.start_media_streaming() 
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
``` Python
call_connection_client.stop_media_streaming() 
```

## Handling audio streams in your websocket server
The sample below demonstrates how to listen to audio streams using your websocket server.

``` JS
import asyncio 
import json 
import websockets 

async def handle_client(websocket, path): 
    print("Client connected") 
    try: 
        async for message in websocket: 
            print(message) 
            packet_data = json.loads(message) 
            packet_data = message.encode('utf-8') 
            print("Packet DATA:-->",packet_data) 

    except websockets.exceptions.ConnectionClosedOK: 
        print("Client disconnected") 

start_server = websockets.serve(handle_client, "localhost", 8081) 

print('WebSocket server running on port 8081') 

asyncio.get_event_loop().run_until_complete(start_server) 
asyncio.get_event_loop().run_forever() 
```
