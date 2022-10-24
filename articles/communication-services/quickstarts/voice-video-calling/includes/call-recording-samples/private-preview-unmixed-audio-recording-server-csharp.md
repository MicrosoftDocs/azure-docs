---
author: dbasantes
ms.service: azure-communication-services
ms.date: 09/07/2022
ms.topic: include
ms.custom: private_preview
ms.author: bharat
---

> [!NOTE]
> Call Recording Unmixed audio is available in US only and may change based on feedback we receive during Private Preview.


## Prerequisites

Before you start testing Unmixed Audio recording, make sure you complete the following steps:

- You need a Call in place whether is using Calling Client SDK or Call Automation before you start recording. Review their quickstarts and make sure you follow all their pre-requisites. 
- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Services resource](../../../create-communication-resource.md). You'll need to record your resource **connection string** for this quickstart.
- Subscribe to events via [Azure Event Grid](https://learn.microsoft.com/azure/event-grid/event-schema-communication-services).
- Download the [.NET SDK](https://dev.azure.com/azure-sdk/public/_artifacts/feed/azure-sdk-for-net/NuGet/Azure.Communication.CallingServer/overview/1.0.0-alpha.20220829.1)
- This quickstart assumes you have some experience using the [Calling Client SDK](../../get-started-with-video-calling.md).  **Important**: To fetch `serverCallId` from Calling SDK, refer to the [JavaScript](../../get-server-call-id.md) example.
- Make sure to provide the Azure Communication Services Call Recording team with your [immutable Azure resource ID](../../get-resource-id.md) to be allowlisted during the **private preview** tests.


## 1. Create a Call Automation client

To create a call automation client, you'll use your Communication Services connection string and pass it to `CallAutomationClient` object.

```csharp
CallAutomationClient callAutomationClient = new CallAutomationClient("<ACSConnectionString>");
```

## 2. Start recording session with StartRecordingOptions using 'StartRecordingAsync' server API

Use the server call ID received during initiation of the call.
- RecordingContent is used to pass the recording content type. Use audio
- RecordingChannel is used to pass the recording channel type. Use unmixed.
- RecordingFormat is used to pass the format of the recording. Use wav.

```csharp
StartRecordingOptions recordingOptions = new StartRecordingOptions(new ServerCallLocator("<ServerCallId>")) 
{
    RecordingContent = RecordingContent.Audio,
    RecordingChannel = RecordingChannel.Unmixed,
    RecordingFormat = RecordingFormat.Wav,
    RecordingStateCallbackEndpoint = new Uri("<CallbackUri>");
};
Response<RecordingStateResult> response = await callAutomationClient.getCallRecording()
.StartRecordingAsync(recordingOptions);
```

### 2.1. Specify a user on a channel 0 for unmixed audio recording

```csharp
StartRecordingOptions recordingOptions = new StartRecordingOptions(new ServerCallLocator("<ServerCallId>")) 
{
    RecordingContent = RecordingContent.Audio,
    RecordingChannel = RecordingChannel.Unmixed,
    RecordingFormat = RecordingFormat.Wav,
    RecordingStateCallbackEndpoint = new Uri("<CallbackUri>"),
    ChannelAffinity = new List<ChannelAffinity>
    {
        new ChannelAffinity {
            Channel = 0,
            Participant = new CommunicationUserIdentifier("<ACS_USER_MRI>")
        }
    }
};
Response<RecordingStateResult> response = await callAutomationClient.getCallRecording()
.StartRecordingAsync(recordingOptions);
```
The `StartRecordingAsync` API response contains the recording ID of the recording session.

## 3.	Stop recording session using 'StopRecordingAsync' server API

Use the recording ID received in response of `startRecordingWithResponse`.

```csharp
var stopRecording = await callAutomationClient.GetCallRecording().StopRecordingAsync(recording.Value.RecordingId);
```

## 4.	Pause recording session using 'PauseRecordingAsync' server API

Use the recording ID received in response of `startRecordingWithResponse`.

```csharp
var pauseRecording = await callAutomationClient.GetCallRecording ().PauseRecordingAsync(recording.Value.RecordingId);
```

## 5.	Resume recording session using 'ResumeRecordingAsync' server API

Use the recording ID received in response of `startRecordingWithResponse`.

```csharp
var resumeRecording = await callAutomationClient.GetCallRecording().ResumeRecordingAsync(recording.Value.RecordingId);
```

## 6.	Download recording File using 'DownloadToAsync' server API

Use an [Azure Event Grid](../../../../../event-grid/overview.md) web hook or other triggered action should be used to notify your services when the recorded media is ready for download.

Below is an example of the event schema.

```
{
    "id": string, // Unique guid for event
    "topic": string, // /subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}
    "subject": string, // /recording/call/{call-id}/serverCallId/{serverCallId}
    "data": {
        "recordingStorageInfo": {
            "recordingChunks": [
                {
                    "documentId": string, // Document id for for the recording chunk
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

Use `DownloadStreamingAsync` API for downloading the recorded media.

```csharp
var recordingDownloadUri = new Uri(downloadLocation);
var response = await callAutomationClient.GetCallRecording().DownloadStreamingAsync(recordingDownloadUri);
```
The `downloadLocation` for the recording can be fetched from the `contentLocation` attribute of the `recordingChunk`. `DownloadStreamingAsync` method returns response of type `Response<Stream>`, which contains the downloaded content.

## 7. Delete recording content using 'DeleteRecordingAsync' server API

Use `DeleteRecordingAsync` API for deleting the recording content (for example, recorded media, metadata)

```csharp
var recordingDeleteUri = new Uri(deleteLocation);
var response = await callAutomationClient.GetCallRecording().DeleteRecordingAsync(recordingDeleteUri);
```
