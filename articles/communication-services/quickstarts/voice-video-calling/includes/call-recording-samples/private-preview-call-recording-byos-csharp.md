---
author: rsarkar
ms.service: azure-communication-services
ms.date: 03/15/2023
ms.topic: include
ms.custom: private_preview
ms.author: rsarkar
---

[!INCLUDE [Private Preview](../../../../includes/private-preview-include-section.md)]

## Prerequisites

Before you start testing bring your own storage with call recording, make sure you complete the following steps:

- You need a Call in place whether is using Calling Client SDK or Call Automation before you start recording. Review their quickstarts and make sure you follow all their pre-requisites. 
- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Services resource](../../../create-communication-resource.md). You'll need to record your resource **connection string** for this quickstart.
- Subscribe to events via [Azure Event Grid](https://learn.microsoft.com/azure/event-grid/event-schema-communication-services).
- Download the [.NET SDK](https://dev.azure.com/azure-sdk/public/_artifacts/feed/azure-sdk-for-net/NuGet/Azure.Communication.CallAutomation/overview/1.0.0-alpha.20230315.1)
- This quickstart assumes you have some experience using the [Calling Client SDK](../../get-started-with-video-calling.md).  **Important**: To fetch `serverCallId` from Calling SDK, refer to the [JavaScript](../../get-server-call-id.md) example.
- Make sure to provide the Azure Communication Services Call Recording team with your [immutable Azure resource ID](../../get-resource-id.md) to be allowlisted during the **private preview** tests.


## 1. Create a Call Automation client

To create a call automation client, you'll use your Communication Services connection string and pass it to `CallAutomationClient` object.

```csharp
CallAutomationClient callAutomationClient = new CallAutomationClient("<ACSConnectionString>");
```

## 2. Start recording session with StartRecordingOptions using 'StartRecordingAsync' server API

Use the server call ID received during initiation of the call.

### 2.1 Using Azure Blob Storage for External Storage


```csharp
StartRecordingOptions recordingOptions = new StartRecordingOptions(new ServerCallLocator("<ServerCallId>"))
{
    // ...
    ExternalStorage = new BlobStorage(new Uri("<Insert Container / Blob Uri>"))
};

Response<RecordingStateResult> startRecordingWithResponse = await callAutomationClient.GetCallRecording()
        .StartRecordingAsync(options: recordingOptions);
```

The `StartRecordingAsync` API response contains the recording ID of the recording session.

## 3. Stop recording session using 'StopRecordingAsync' server API

Use the recording ID received in response of `StartRecordingAsync`.

```csharp
var stopRecording = await callAutomationClient.GetCallRecording().StopRecordingAsync(startRecordingWithResponse.Value.RecordingId);
```

## 4. Pause recording session using 'PauseRecordingAsync' server API

Use the recording ID received in response of `StartRecordingAsync`.

```csharp
var pauseRecording = await callAutomationClient.GetCallRecording().PauseRecordingAsync(startRecordingWithResponse.Value.RecordingId);
```

## 5.	Resume recording session using 'ResumeRecordingAsync' server API

Use the recording ID received in response of `StartRecordingAsync`.

```csharp
var resumeRecording = await callAutomationClient.GetCallRecording().ResumeRecordingAsync(startRecordingWithResponse.Value.RecordingId);
```

## 6.	Notification on successful export

Use an [Azure Event Grid](../../../../../event-grid/overview.md) web hook or other triggered action should be used to notify your services when the recorded media is ready and have been exported to the external storage location.

Below is an example of the event schema.

``` json
{
    "id": "string", // Unique guid for event
    "topic": "string", // /subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}
    "subject": "string", // /recording/call/{call-id}/serverCallId/{serverCallId}
    "data": {
        "storageType": "string", // acsstorage, blobstorage etc.
        "recordingId": "string", // unique id for recording
        "recordingStorageInfo": {
            "recordingChunks": [
                {
                    "documentId": "string", // Document id for for the recording chunk
                    "contentLocation": "string", //Azure Communication Services URL where the content is located
                    "metadataLocation": "string", // Azure Communication Services URL where the metadata for this chunk is located
                    "deleteLocation": "string", // Azure Communication Services URL to use to delete all content, including recording and metadata.
                    "index": "int", // Index providing ordering for this chunk in the entire recording
                    "endReason": "string", // Reason for chunk ending: "SessionEnded", "ChunkMaximumSizeExceeded”, etc.
                }
            ]
        },
        "recordingStartTime": "string", // ISO 8601 date time for the start of the recording
        "recordingDurationMs": "int", // Duration of recording in milliseconds
        "sessionEndReason": "string" // Reason for call ending: "CallEnded", "InitiatorLeft”, etc.
    },
    "eventType": "string", // "Microsoft.Communication.RecordingFileStatusUpdated"
    "dataVersion": "string", // "1.0"
    "metadataVersion": "string", // "1"
    "eventTime": "string" // ISO 8601 date time for when the event was created
}
```
