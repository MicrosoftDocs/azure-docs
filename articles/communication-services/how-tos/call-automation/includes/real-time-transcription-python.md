---
title: include file
description: Python real-time transcription how-to doc
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
Define the TranscriptionOptions for ACS to know whether to start the transcription straight away or at a later time, which locale to transcribe in, and the web socket connection to use for sending the transcript.

```python
transcription_options = TranscriptionOptions(
    transport_url=" ",
    transport_type=TranscriptionTransportType.WEBSOCKET,
    locale="en-US",
    start_transcription=False
)

call_connection_properties = call_automation_client.create_call(
    target_participant,
    CALLBACK_EVENTS_URI,
    cognitive_services_endpoint=COGNITIVE_SERVICES_ENDPOINT,
    source_caller_id_number=source_caller,
    transcription=transcription_options
)
```

## Start Transcription
Once you're ready to start the transcription, you can make an explicit call to Call Automation to start transcribing the call.

```python
# Start transcription without options
call_connection_client.start_transcription()

# Option 1: Start transcription with locale and operation context
# call_connection_client.start_transcription(locale="en-AU", operation_context="startTranscriptionContext")

# Option 2: Start transcription with operation context
# call_connection_client.start_transcription(operation_context="startTranscriptionContext")
```

## Receiving Transcription Stream
When transcription starts, your websocket will receive the transcription metadata payload as the first packet. This payload carries the call metadata and locale for the configuration.

```json
{
    "kind": "TranscriptionMetadata",
    "transcriptionMetadata": {
        "subscriptionId": "835be116-f750-48a4-a5a4-ab85e070e5b0",
        "locale": "en-us",
        "callConnectionId": "65c57654=f12c-4975-92a4-21668e61dd98",
        "correlationId": "65c57654=f12c-4975-92a4-21668e61dd98"
    }
}
```

## Receiving Transcription Data
After the metadata, the next packets your websocket receives will be TranscriptionData for the transcribed audio.

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

## Handling transcription stream in the web socket server

```python
import asyncio
import json
import websockets

from azure.communication.callautomation.streaming.models import (
    TranscriptionMetadata, TranscriptionData, WordData, TextFormat, ResultStatus
)
from azure.communication.callautomation.streaming.streaming_data_parser import StreamingDataParser

async def handle_client(websocket, path):
    print("Client connected")
    try:
        async for message in websocket:
            print(message)
            result = StreamingDataParser.parse(message)
            
            if isinstance(result, TranscriptionMetadata):
                print("Parsed data is metadata")
                print("-------------------------")
                print("Subscription ID:", result.subscriptionId)
                print("Locale:", result.locale)
                print("Call Connection ID:", result.callConnectionId)
                print("Correlation ID:", result.correlationId)
            
            elif isinstance(result, TranscriptionData):
                print("Parsed data is transcription data")
                print("-------------------------")
                print("Text:", result.text)
                print("Format:", result.format)
                print("Confidence:", result.confidence)
                print("Offset:", result.offset)
                print("Duration:", result.duration)
                print("Participant:", result.participant.raw_id)
                print("Result Status:", result.resultStatus)
                for word in result.words:
                    print("Word:", word.text)
                    print("Offset:", word.offset)
                    print("Duration:", word.duration)

    except websockets.exceptions.ConnectionClosedOK:
        print("Client disconnected")

start_server = websockets.serve(handle_client, "localhost", 8081)

print('WebSocket server running on port 8081')

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
```

## Update Transcription
For situations where your application allows users to select their preferred language, you may also want to capture the transcription in that language. To do this, the Call Automation SDK allows you to update the transcription locale.

```python
await call_connection_client.update_transcription(locale="en-US-NancyNeural")
```

## Stop Transcription
When your application needs to stop listening for the transcription, you can use the StopTranscription request to let Call Automation know to stop sending transcript data to your web socket.

```python
# Stop transcription without options
call_connection_client.stop_transcription()

# Alternative: Stop transcription with operation context
# call_connection_client.stop_transcription(operation_context="stopTranscriptionContext")
```
