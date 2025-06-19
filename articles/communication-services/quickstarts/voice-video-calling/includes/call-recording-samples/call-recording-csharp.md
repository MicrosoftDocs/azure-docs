---
author: dbasantes
ms.service: azure-communication-services
ms.date: 06/11/2023
ms.topic: include
ms.custom: public_preview
---
## Sample Code

You can download the sample app from [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/CallRecording)

## Prerequisites

- You need an Azure account with an active subscription.
- Deploy a Communication Service resource. Record your resource **connection string**.
- Subscribe to events via [Azure Event Grid](../../../../../event-grid/event-schema-communication-services.md).
- Download the [.NET SDK](https://dotnet.microsoft.com/en-us/download/dotnet)

## Before you start

Call Recording APIs use exclusively the `serverCallId`to initiate recording. There are a couple of methods you can use to fetch the `serverCallId` depending on your scenario:

### Call Automation scenarios

When using [Call Automation](../../../call-automation/callflows-for-customer-interactions.md), you have two options to get the `serverCallId`:

1. When you establish a call, it returns a `serverCallId` as a property of the `CallConnected` event after a call is established. Learn how to [Get CallConnected event](../../../call-automation/callflows-for-customer-interactions.md?pivots=programming-language-csharp#update-programcs) from Call Automation SDK.

2. When you answer the call or a call is created, it returns the `serverCallId` as a property of the `AnswerCallResult` or `CreateCallResult` API responses respectively.

### Calling SDK scenarios

When using [Calling Client SDK](../../get-started-with-video-calling.md), you can retrieve the `serverCallId` by using the `getServerCallId` method on the call. 
Use this example to learn how to [Get serverCallId](../../get-server-call-id.md) from the Calling Client SDK. 

Let's get started with a few simple steps.

## 1. Create a Call Automation client

Call Recording APIs are part of the Azure Communication Services [Call Automation](../../../../concepts/call-automation/call-automation.md) libraries. So you need to create a Call Automation client.

To create a call automation client, use your Communication Services connection string and pass it to `CallAutomationClient` object.

```csharp
CallAutomationClient callAutomationClient = new CallAutomationClient("<ACSConnectionString>");
```

## 2. Start recording session with StartRecordingOptions using 'StartAsync' API

Use the `serverCallId` received during initiation of the call.
- Use `RecordingContent` to pass the recording content type. Use `AUDIO`.
- Use `RecordingChannel` to pass the recording channel type. Use `MIXED` or `UNMIXED`.
- Use `RecordingFormat` to pass the format of the recording. Use `WAV`.

```csharp
StartRecordingOptions recordingOptions = new StartRecordingOptions(new ServerCallLocator("<ServerCallId>")) 
{
    RecordingContent = RecordingContent.Audio,
    RecordingChannel = RecordingChannel.Unmixed,
    RecordingFormat = RecordingFormat.Wav,
    RecordingStateCallbackUri = new Uri("<CallbackUri>");
};
Response<RecordingStateResult> response = await callAutomationClient.GetCallRecording()
.StartAsync(recordingOptions);
```
### 2.1. Start Recording - Bring Your Own Azure Blob Store

Start recording using your designated Azure Blob Storage to store the recorded file once recording is complete.

```csharp
StartRecordingOptions recordingOptions = new StartRecordingOptions(new ServerCallLocator("<ServerCallId>"))
{
    RecordingContent = RecordingContent.Audio,
    RecordingChannel = RecordingChannel.Unmixed,
    RecordingFormat = RecordingFormat.Wav,
    RecordingStateCallbackUri = new Uri("<CallbackUri>"),
    RecordingStorage = RecordingStorage.CreateAzureBlobContainerRecordingStorage(new Uri("<YOUR_STORAGE_CONTAINER_URL>"))
};
Response<RecordingStateResult> response = await callAutomationClient.GetCallRecording()
.StartAsync(recordingOptions);
```

## 2.2. Start recording session with Pause mode enabled using 'StartAsync' API

> [!NOTE]
> **Recordings will need to be resumed for recording file to be generated.**

```csharp
StartRecordingOptions recordingOptions = new StartRecordingOptions(new ServerCallLocator("<ServerCallId>")) 
{
    RecordingContent = RecordingContent.Audio,
    RecordingChannel = RecordingChannel.Unmixed,
    RecordingFormat = RecordingFormat.Wav,
    PauseOnStart = true,
    RecordingStateCallbackUri = new Uri("<CallbackUri>");
};
Response<RecordingStateResult> response = await callAutomationClient.GetCallRecording()
.StartAsync(recordingOptions);
```

### 2.3. Only for Unmixed - Specify a user on channel 0

To produce unmixed audio recording files, you can use the `AudioChannelParticipantOrdering` functionality to specify which user you want to record on channel 0. The rest of the participants are assigned to a channel as they speak. If you use `RecordingChannel.Unmixed` but don't use `AudioChannelParticipantOrdering`, Call Recording assigns channel 0 to the first participant speaking. 

```csharp
StartRecordingOptions recordingOptions = new StartRecordingOptions(new ServerCallLocator("<ServerCallId>")) 
{
    RecordingContent = RecordingContent.Audio,
    RecordingChannel = RecordingChannel.Unmixed,
    RecordingFormat = RecordingFormat.Wav,
    RecordingStateCallbackUri = new Uri("<CallbackUri>"),
    AudioChannelParticipantOrdering = { new CommunicationUserIdentifier("<ACS_USER_MRI>") }
    
};
Response<RecordingStateResult> response = await callAutomationClient.GetCallRecording().StartAsync(recordingOptions);
```

### 2.4. Only for Unmixed - Specify channel affinity

```csharp
var channelAffinity = new ChannelAffinity(new CommunicationUserIdentifier("<ACS_USER_MRI>")) { Channel = 0};
StartRecordingOptions recordingOptions = new StartRecordingOptions(new ServerCallLocator("<ServerCallId>"))
{
   RecordingContent = RecordingContent.Audio,
   RecordingChannel = RecordingChannel.Unmixed,
   RecordingFormat = RecordingFormat.Wav,
   RecordingStateCallbackUri = new Uri("<CallbackUri>"),
   ChannelAffinity = new List<ChannelAffinity>{ channelAffinity }
};
Response<RecordingStateResult> response = await callAutomationClient.GetCallRecording().StartAsync(recordingOptions);
```

The `StartAsync` API response contains the `recordingId` of the recording session.

## 3. Stop recording session using `StopAsync` API

Use the `recordingId` received in response to `StartAsync`.

```csharp
var stopRecording = await callAutomationClient.GetCallRecording().StopAsync(recordingId);
```

## 4. Pause recording session using `PauseAsync` API

Use the `recordingId` received in response to `StartAsync`.

```csharp
var pauseRecording = await callAutomationClient.GetCallRecording ().PauseAsync(recordingId);
```

## 5. Resume recording session using `ResumeAsync` API

Use the `recordingId` received in response to `StartAsync`.

```csharp
var resumeRecording = await callAutomationClient.GetCallRecording().ResumeAsync(recordingId);
```

## 6. Download recording File using `DownloadToAsync` API

Use an [Azure Event Grid](../../../../../event-grid/event-schema-communication-services.md) web hook or other triggered action to notify your services when the recorded media is ready for download.

An Event Grid notification `Microsoft.Communication.RecordingFileStatusUpdated` is published when a recording is ready for retrieval, typically a few minutes after the recording finishes processing (such as when meeting ends or a recording stops). Recording event notifications include `contentLocation` and `metadataLocation`, which you can use to retrieve both recorded media and a recording metadata file.

Example of the event schema:

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

Use `DownloadToAsync` API to download the recorded media.

```csharp
var recordingDownloadUri = new Uri(contentLocation);
var response = await callAutomationClient.GetCallRecording().DownloadToAsync(recordingDownloadUri, fileName);
```

Fetch the `downloadLocation` for the recording from the `contentLocation` attribute of the `recordingChunk`. Use the `DownloadToAsync` method to download the content into a provided filename.

## 7. Delete recording content using `DeleteAsync` API

Use `DeleteAsync` API to delete the recording content (such as recorded media and metadata).

```csharp
var recordingDeleteUri = new Uri(deleteLocation);
var response = await callAutomationClient.GetCallRecording().DeleteAsync(recordingDeleteUri);
```
