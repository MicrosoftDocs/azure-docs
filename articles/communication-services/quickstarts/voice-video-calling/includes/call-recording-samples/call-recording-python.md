---
author: dbasantes
ms.service: azure-communication-services
ms.date: 06/11/2023
ms.topic: include
ms.custom: public_preview
---
## Sample Code

You can download the sample app from [GitHub](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/call-recording)

## Prerequisites

- You need an Azure account with an active subscription.
- Deploy a Communication Service resource. Record your resource **connection string**.
- Subscribe to events via [Azure Event Grid](../../../../../event-grid/event-schema-communication-services.md).
- [Python](https://www.python.org/downloads/) 3.7+.

## Before you start

Call Recording APIs use exclusively the `serverCallId`to initiate recording. There are a couple of methods you can use to fetch the `serverCallId` depending on your scenario:

### Call Automation scenarios

- When using [Call Automation](../../../call-automation/callflows-for-customer-interactions.md), you have two options to get the `serverCallId`:
    1) Once a call is created, a `serverCallId` is returned as a property of the `CallConnected` event after a call is established. Learn how to [Get CallConnected event](../../../call-automation/callflows-for-customer-interactions.md?pivots=programming-language-python#update-programcs) from Call Automation SDK.
    2) Once you answer the call or a call is created, it returns the `serverCallId` as a property of the `AnswerCallResult` or `CreateCallResult` API responses respectively.

### Calling SDK scenarios

- When using [Calling Client SDK](../../get-started-with-video-calling.md), you can retrieve the `serverCallId` by using the `server_call_id` variable on the call.
Use this example to learn how to [Get serverCallId](../../get-server-call-id.md) from the Calling Client SDK.



Let's get started with a few simple steps!



## 1. Create a Call Automation client

Call Recording APIs are part of the Azure Communication Services [Call Automation](../../../../concepts/call-automation/call-automation.md) libraries. Thus, it's necessary to create a Call Automation client.

To create a call automation client, use your Communication Services connection string and pass it to `CallAutomationClient` object.

```python
call_automation_client = CallAutomationClient.from_connection_string("<ACSConnectionString>")
```

## 2. Start recording session start_recording API

Use the `serverCallId` received during initiation of the call.
- Use `RecordingContent` to pass the recording content type. Use `AUDIO`.
- Use `RecordingChannel` to pass the recording channel type. Use `MIXED` or `UNMIXED`.
- Use `RecordingFormat` to pass the format of the recording. Use `WAV`.

```python
response = call_automation_client.start_recording(call_locator=ServerCallLocator(server_call_id),
            recording_content_type = RecordingContent.Audio,
            recording_channel_type = RecordingChannel.Unmixed,
            recording_format_type = RecordingFormat.Wav,
            recording_state_callback_url = "<CallbackUri>")
```

### 2.1. Start Recording  - Bring Your Own Azure Blob Store

Start Recording with your own Azure Blob Storage defined to store the recording file once recording is complete.

```python
response = call_automation_client.start_recording(call_locator=ServerCallLocator(server_call_id),
                   recording_content_type = RecordingContent.Audio,
                   recording_channel_type = RecordingChannel.Unmixed,
                   recording_format_type = RecordingFormat.Wav,
                   recording_state_callback_url = "<CallbackUri>",
                   recording_storage = AzureBlobContainerRecordingStorage(container_url="<YOUR_STORAGE_CONTAINER_URL>"))
```
## 2.2. Start recording session with Pause mode enabled using 'StartAsync' API

> [!NOTE]
> **Recordings will need to be resumed for recording file to be generated.**

```python
response = call_automation_client.start_recording(call_locator=ServerCallLocator(server_call_id),
            recording_content_type = RecordingContent.Audio,
            recording_channel_type = RecordingChannel.Unmixed,
            recording_format_type = RecordingFormat.Wav,
            pause_on_start = true,
            recording_state_callback_url = "<CallbackUri>")
```

### 2.3. Only for Unmixed - Specify a user on channel 0

To produce unmixed audio recording files, you can use the `AudioChannelParticipantOrdering` functionality to specify which user you want to record on channel 0. The rest of the participants are assigned to a channel as they speak. If you use `RecordingChannel.Unmixed` but don't use `AudioChannelParticipantOrdering`, Call Recording assigns channel 0 to the first participant speaking.

```python
response =  call_automation_client.start_recording(call_locator=ServerCallLocator(server_call_id),
            recording_content_type = RecordingContent.Audio,
            recording_channel_type = RecordingChannel.Unmixed,
            recording_format_type = RecordingFormat.Wav,
            recording_state_callback_url = "<CallbackUri>",
            audio_channel_participant_ordering=[CommunicationUserIdentifier(id="<ACS_USER_MRI>")])
```

### 2.4. Only for Unmixed - Specify channel affinity

```python
_channel_affinity = ChannelAffinity(target_participant=CommunicationUserIdentifier("<ACS_USER_MRI>"), channel=0)

response =  call_automation_client.start_recording(call_locator=ServerCallLocator(server_call_id),
            recording_content_type = RecordingContent.Audio,
            recording_channel_type = RecordingChannel.Unmixed,
            recording_format_type = RecordingFormat.Wav,
            recording_state_callback_url = "<CallbackUri>",
            channel_affinity=[_channel_affinity])
```

The `StartAsync` API response contains the `recordingId` of the recording session.

## 3.	Stop recording session using 'stop_recording' API

Use the `recording_id` received in response to `start_recording`.

```python
stop_recording = call_automation_client.stop_recording(recording_id = recording_id)
```

## 4.	Pause recording session using 'pause_recording' API

Use the `recording_id` received in response to `start_recording`.

```python
pause_recording = call_automation_client.pause_recording(recording_id = recording_id)
```

## 5.	Resume recording session using 'resume_recording' API

Use the `recording_id` received in response to `start_recording`.

```python
resume_recording = call_automation_client.resume_recording(recording_id = recording_id)
```

## 6.	Download recording File using 'download_recording' API

Use an [Azure Event Grid](../../../../../event-grid/event-schema-communication-services.md) web hook or other triggered action should be used to notify your services when the recorded media is ready for download.

An Event Grid notification `Microsoft.Communication.RecordingFileStatusUpdated` is published when a recording is ready for retrieval, typically a few minutes after the recording process completes (such as the meeting ended or the recording stopped). Recording event notifications include `contentLocation` and `metadataLocation`, which are used to retrieve both recorded media and a recording metadata file.

The following code is an example of the event schema.

```
{
    "id": string, // Unique guid for event
    "topic": string, // /subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}
    "subject": string, // /recording/call/{call-id}/serverCallId/{serverCallId}
    "data": {
        "recordingStorageInfo": {
            "recordingChunks": [
                {
                    "documentId": string, // Document id for the recording chunk
                    "contentLocation": string, //Azure Communication Services URL where the content is located
                    "metadataLocation": string, // Azure Communication Services URL where the metadata for this chunk is located
                    "deleteLocation": string, // Azure Communication Services URL to use to delete all content, including recording and metadata.
                    "index": int, // Index providing ordering for this chunk in the entire recording
                    "endReason": string, // Reason for chunk ending: "SessionEnded", "ChunkMaximumSizeExceeded”, etc.
                }
            ]
        },
        "recordingStartTime": string, // ISO 8601 date time for the start of the recording
        "recordingDurationMs": int, // Duration of recording in milliseconds
        "sessionEndReason": string // Reason for call ending: "CallEnded", "InitiatorLeft”, etc.
    },
    "eventType": string, // "Microsoft.Communication.RecordingFileStatusUpdated"
    "dataVersion": string, // "1.0"
    "metadataVersion": string, // "1"
    "eventTime": string // ISO 8601 date time for when the event was created
}
```

Use `download_recording` API to download the recorded media.

```python
response = recording_data = call_automation_client.download_recording(content_location)

with open("<file_name>", "wb") as binary_file:
    binary_file.write(recording_data.read())
```

The `downloadLocation` for the recording can be fetched from the `contentLocation` attribute of the `recordingChunk`. Use the `download_recording` method to download the content into bytes.

## 7. Delete recording content using 'delete_recording' API

Use `delete_recording` API for deleting the recording content such as recorded media and metadata.

```python
response = call_automation_client.delete_recording(delete_location);
```
