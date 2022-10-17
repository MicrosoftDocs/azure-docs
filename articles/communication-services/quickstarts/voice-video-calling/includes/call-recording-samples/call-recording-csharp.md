---
author: dbasantes
ms.service: azure-communication-services
ms.date: 10/14/2022
ms.topic: include
ms.custom: public_preview
---

## Prerequisites

Before you start testing Call Recording, make sure to comply with the following prerequisites:


- You need an Azure account with an active subscription.
- Deploy a Communication Service resource. Record your resource **connection string**.
- Subscribe to events via [Azure Event Grid](https://learn.microsoft.com/azure/event-grid/event-schema-communication-services).
- Download the [.NET SDK](https://dev.azure.com/azure-sdk/public/_artifacts/feed/azure-sdk-for-net/NuGet/Azure.Communication.CallAutomation/overview/1.0.0-alpha.20221013.2)

**IMPORTANT**:  
Call Recording APIs use exclusively the `serverCallId`to initiate recording. There are a couple of methods you can use to fetch the `serverCallId` depending on your scenario:
- When using Call Automation, you have two options to get the `serverCallId`:
    1) Once a call is created, a `serverCallId` is returned as a property of the `CallConnected` event after a call has been established. Learn how to [Get serverCallId](https://learn.microsoft.com/azure/communication-services/quickstarts/voice-video-calling/callflows-for-customer-interactions?pivots=programming-language-csharp#configure-programcs-to-answer-the-call) from Call Automation SDK.
    2) Once you answer the call or a call is created the `serverCallId` is returned as a property of the `AnswerCallResult` or `CreateCallResult` API responses respectively.

- When using Calling Client SDK, you can retrieve the `serverCallId` by using the `getServerCallId` method on the call. 
Use this example to learn how to [Get serverCallId](../../get-server-call-id.md) from the Calling Client SDK. 


> [!NOTE]
> Unmixed audio is in Private Preview and is available in the US only. Make sure to provide the Call Recording team with your [immutable Azure resource ID](../../get-resource-id.md) to be allowlisted during the Unmixed audio **private preview** tests. Changes are expected based on feedback we receive during this stage.



Let's get started with a few simple steps!



## 1. Create a Call Automation client

To create a call automation client, you'll use your Communication Services connection string and pass it to `CallAutomationClient` object.

```csharp
CallAutomationClient callAutomationClient = new CallAutomationClient("<ACSConnectionString>");
```

## 2. Start recording session with StartRecordingOptions using 'StartRecordingAsync' API

Use the `serverCallId` received during initiation of the call.
- RecordingContent is used to pass the recording content type. Use audio
- RecordingChannel is used to pass the recording channel type. Use mixed or unmixed.
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

### 2.1. Only for Unmixed - Specify a user on a channel 0

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
The `StartRecordingAsync` API response contains the `recordingId` of the recording session.

## 3.	Stop recording session using 'StopRecordingAsync' API

Use the `recordingId` received in response of `startRecordingWithResponse`.

```csharp
var stopRecording = await callAutomationClient.GetCallRecording().StopRecordingAsync(recording.Value.RecordingId);
```

## 4.	Pause recording session using 'PauseRecordingAsync' API

Use the `recordingId` received in response of `startRecordingWithResponse`.

```csharp
var pauseRecording = await callAutomationClient.GetCallRecording ().PauseRecordingAsync(recording.Value.RecordingId);
```

## 5.	Resume recording session using 'ResumeRecordingAsync' API

Use the `recordingId` received in response of `startRecordingWithResponse`.

```csharp
var resumeRecording = await callAutomationClient.GetCallRecording().ResumeRecordingAsync(recording.Value.RecordingId);
```

## 6.	Download recording File using 'DownloadToAsync' API

Use an [Azure Event Grid](https://learn.microsoft.com/azure/event-grid/event-schema-communication-services) web hook or other triggered action should be used to notify your services when the recorded media is ready for download.

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

## 7. Delete recording content using 'DeleteRecordingAsync' API

Use `DeleteRecordingAsync` API for deleting the recording content (for example, recorded media, metadata)

```csharp
var recordingDeleteUri = new Uri(deleteLocation);
var response = await callAutomationClient.GetCallRecording().DeleteRecordingAsync(recordingDeleteUri);
```
