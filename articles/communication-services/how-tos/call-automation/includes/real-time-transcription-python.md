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
        "subscriptionId": "aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e",
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
from azure.communication.callautomation._shared.models import identifier_from_raw_id

async def handle_client(websocket, path):
    print("Client connected")
    try:
        async for message in websocket:
            json_object = json.loads(message)
            kind = json_object['kind']
            if kind == 'TranscriptionMetadata':
                print("Transcription metadata")
                print("-------------------------")
                print("Subscription ID:", json_object['transcriptionMetadata']['subscriptionId'])
                print("Locale:", json_object['transcriptionMetadata']['locale'])
                print("Call Connection ID:", json_object['transcriptionMetadata']['callConnectionId'])
                print("Correlation ID:", json_object['transcriptionMetadata']['correlationId'])
            if kind == 'TranscriptionData':
                participant = identifier_from_raw_id(json_object['transcriptionData']['participantRawID'])
                word_data_list = json_object['transcriptionData']['words']
                print("Transcription data")
                print("-------------------------")
                print("Text:", json_object['transcriptionData']['text'])
                print("Format:", json_object['transcriptionData']['format'])
                print("Confidence:", json_object['transcriptionData']['confidence'])
                print("Offset:", json_object['transcriptionData']['offset'])
                print("Duration:", json_object['transcriptionData']['duration'])
                print("Participant:", participant.raw_id)
                print("Result Status:", json_object['transcriptionData']['resultStatus'])
                for word in word_data_list:
                    print("Word:", word['text'])
                    print("Offset:", word['offset'])
                    print("Duration:", word['duration'])
            
    except websockets.exceptions.ConnectionClosedOK:
        print("Client disconnected")
    except websockets.exceptions.ConnectionClosedError as e:
        print("Connection closed with error: %s", e)
    except Exception as e:
        print("Unexpected error: %s", e)

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
