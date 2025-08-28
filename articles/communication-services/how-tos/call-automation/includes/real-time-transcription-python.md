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
Define the TranscriptionOptions for ACS to specify when to start the transcription, the locale for transcription, and the web socket connection for sending the transcript.

```python
transcription_options = TranscriptionOptions(
    transport_url="WEBSOCKET_URI_HOST",
    transport_type=TranscriptionTransportType.WEBSOCKET,
    locale="en-US",
    start_transcription=False,
    #Only add the SpeechRecognitionModelEndpointId if you have a custom speech model you would like to use
    speech_recognition_model_endpoint_id = "YourCustomSpeechRecognitionModelEndpointId"
);
)

call_connection_properties = call_automation_client.create_call(
    target_participant,
    CALLBACK_EVENTS_URI,
    cognitive_services_endpoint=COGNITIVE_SERVICES_ENDPOINT,
    source_caller_id_number=source_caller,
    transcription=transcription_options
)
```

## Sentiment Analysis (Preview)
Track the emotional tone of conversations in real time to support customer and agent interactions, and enable supervisors to intervene when necessary. Available in public preview through `createCall`, `answerCall` and `startTranscription`.

### Create a call with Sentiment Analysis enabled 

``` python
transcription_options = TranscriptionOptions(
    transport_url=self.transport_url,
    transport_type=StreamingTransportType.WEBSOCKET,
    locale="en-US",
    start_transcription=False,
    enable_sentiment_analysis=True
)

call_connection_properties = await call_automation_client.create_call(
    target_participant=[target_participant],
    callback_url=CALLBACK_EVENTS_URI,
    cognitive_services_endpoint=COGNITIVE_SERVICES_ENDPOINT,
    source_caller_id_number=source_caller,
    transcription=transcription_options
)

```

### Answer a call with Sentiment Analysis enabled 
``` python
transcription_options = TranscriptionOptions(
    transport_url=self.transport_url,
    transport_type=StreamingTransportType.WEBSOCKET,
    locale="en-US",
    start_transcription=False,
    enable_sentiment_analysis=True
)

answer_call_result = await call_automation_client.answer_call(
    incoming_call_context=incoming_call_context,
    transcription=transcription_options,
    cognitive_services_endpoint=COGNITIVE_SERVICES_ENDPOINT,
    callback_url=callback_uri,
    enable_loopback_audio=True,
    operation_context="answerCallContext"
)
```

## PII Redaction (Preview)
Automatically identify and mask sensitive information—such as names, addresses, or identification numbers—to ensure privacy and regulatory compliance. Available in `createCall`, `answerCall` and `startTranscription`.

### Answer a call with PII Redaction enabled 
``` python
transcription_options = TranscriptionOptions(
    transport_url=self.transport_url,
    transport_type=StreamingTransportType.WEBSOCKET,
    locale=["en-US", "es-ES"],
    start_transcription=False,
    pii_redaction=PiiRedactionOptions(
        enable=True,
        redaction_type=RedactionType.MASK_WITH_CHARACTER
    )
)

answer_call_result = await call_automation_client.answer_call(
    incoming_call_context=incoming_call_context,
    transcription=transcription_options,
    cognitive_services_endpoint=COGNITIVE_SERVICES_ENDPOINT,
    callback_url=callback_uri,
    enable_loopback_audio=True,
    operation_context="answerCallContext"
)
```
>[!Note]
> With PII redaction enabled you’ll only receive the redacted text.  

## Real-time language detection (Preview)
Automatically detect spoken languages to enable natural, human-like communication and eliminate manual language selection. Available in `createCall`, `answerCall` and `startTranscription`.

### Create a call with Real-time language detection enabled
``` python
transcription_options = TranscriptionOptions(
    transport_url=self.transport_url,
    transport_type=StreamingTransportType.WEBSOCKET,
    locale=["en-US", "es-ES","hi-IN"],
    start_transcription=False,
    enable_sentiment_analysis=True,
)

call_connection_properties = await call_automation_client.create_call(
    target_participant=[target_participant],
    callback_url=CALLBACK_EVENTS_URI,
    cognitive_services_endpoint=COGNITIVE_SERVICES_ENDPOINT,
    source_caller_id_number=source_caller,
    transcription=transcription_options
)
```

> [!Note]
> To stop language identification after it has started, use the `updateTranscription` API and explicitly set the language you want to use for the transcript. This disables automatic language detection and locks transcription to the specified language.


## Connect to a Rooms call and provide transcription details
If you're connecting to an ACS room and want to use transcription, configure the transcription options as follows:

```python
transcription_options = TranscriptionOptions(
    transport_url="",
    transport_type=TranscriptionTransportType.WEBSOCKET,
    locale="en-US",
    start_transcription=False,
    #Only add the SpeechRecognitionModelEndpointId if you have a custom speech model you would like to use
    speech_recognition_model_endpoint_id = "YourCustomSpeechRecognitionModelEndpointId"
)

connect_result = client.connect_call(
    room_id="roomid",
    CALLBACK_EVENTS_URI,
    cognitive_services_endpoint=COGNITIVE_SERVICES_ENDPOINT,
    operation_context="connectCallContext",
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

## Get mid call summaries (Preview)
Enhance your call workflows with real-time summarization. By enabling summarization in your transcription options, ACS can automatically generate concise mid-call recaps—including decisions, action items, and key discussion points—without waiting for the call to end. This helps teams stay aligned and enables faster follow-ups during live conversations.

``` python
transcription_options = TranscriptionOptions(
    transport_url=self.transport_url,
    transport_type=StreamingTransportType.WEBSOCKET,
    locale="en-US",
    start_transcription=False,
    summarization=SummarizationOptions(
        enable_end_call_summary=True,
        locale="en-US"
    )
)

answer_call_result = await call_automation_client.answer_call(
    incoming_call_context=incoming_call_context,
    transcription=transcription_options,
    cognitive_services_endpoint=COGNITIVE_SERVICES_ENDPOINT,
    callback_url=callback_uri,
    enable_loopback_audio=True,
    operation_context="answerCallContext"
)


await call_connection_client.summarize_call(
    operation_context=self.operation_context,
    operation_callback_url=self.operation_callback_url,
    summarization=transcription_options.summarization
)

```

### Additional Headers:
The Correlation ID and Call Connection ID are now included in the WebSocket headers for improved traceability `x-ms-call-correlation-id` and `x-ms-call-connection-id`.

## Receiving Transcription Stream
When transcription starts, your websocket receives the transcription metadata payload as the first packet.

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

## Receiving Transcription Stream with AI capabilities enabled (Preview)
When transcription is enabled during a call, Azure Communication Services emits metadata that describes the configuration and context of the transcription session. This includes details such as the locale, call connection ID, sentiment analysis settings, and PII redaction preferences. Developers can use this payload to verify transcription setup, audit configurations, or troubleshoot issues related to real-time transcription features enhanced by AI.

``` json
{
  "kind": "TranscriptionMetadata",
  "transcriptionMetadata": {
    "subscriptionId": "863b5e55-de0d-4fc3-8e58-2d68e976b5ad",
    "locale": "en-US",
    "callConnectionId": "02009180-9dc2-429b-a3eb-d544b7b6a0e1",
    "correlationId": "62c8215b-5276-4d3c-bb6d-06a1b114651b",
    "speechModelEndpointId": null,
    "locales": [],
    "enableSentimentAnalysis": true,
    "piiRedactionOptions": {
      "enable": true,
      "redactionType": "MaskWithCharacter"
    }
  }
}
```

## Receiving Transcription data with AI capabilities enabled (Preview)
After the initial metadata packet, your WebSocket connection will begin receiving `TranscriptionData` events for each segment of transcribed audio. These packets include the transcribed text, confidence score, timing information, and—if enabled—sentiment analysis and PII redaction. This data can be used to build real-time dashboards, trigger workflows, or analyze conversation dynamics during the call.

```json
{
  "kind": "TranscriptionData",
  "transcriptionData": {
    "text": "My date of birth is *********.",
    "format": "display",
    "confidence": 0.8726407289505005,
    "offset": 309058340,
    "duration": 31600000,
    "words": [],
    "participantRawID": "4:+917020276722",
    "resultStatus": "Final",
    "sentimentAnalysisResult": {
      "sentiment": "neutral"
    }
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
                print("Locales:", json_object['transcriptionMetadata']['locales']) 
                print("PII Redaction Options:", json_object['transcriptionMetadata']['piiRedactionOptions']) 
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
                print("Sentiment Analysis Result:", json_object['transcriptionData']['sentimentAnalysisResult']) 
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
For situations where your application allows users to select their preferred language, you may also want to capture the transcription in that language. To do this task, the Call Automation SDK allows you to update the transcription locale.

```python
await call_automation_client.get_call_connection(
    call_connection_id=call_connection_id
).update_transcription(
    operation_context="UpdateTranscriptionContext",
    locale="en-au",
    #Only add the SpeechRecognitionModelEndpointId if you have a custom speech model you would like to use
    speech_recognition_model_endpoint_id = "YourCustomSpeechRecognitionModelEndpointId"
)
```

## Stop Transcription
When your application needs to stop listening for the transcription, you can use the StopTranscription request to let Call Automation know to stop sending transcript data to your web socket.

```python
# Stop transcription without options
call_connection_client.stop_transcription()

# Alternative: Stop transcription with operation context
# call_connection_client.stop_transcription(operation_context="stopTranscriptionContext")
```
