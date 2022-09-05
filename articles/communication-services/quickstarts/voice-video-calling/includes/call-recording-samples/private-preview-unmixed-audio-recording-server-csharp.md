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

Before you start testing Unmixed Audio recording, please make sure you complete the following steps:

- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Services resource](../../../create-communication-resource.md). You'll need to record your resource **connection string** for this quickstart.
- Create an Azure storage account and container, for details, see [Create a storage account](../../../../../storage/common/storage-account-create.md?tabs=azure-portal). You'll need to record your storage **connection string** and **container name** for this quickstart.
- Subscribe to events via an [Azure Event Grid](../../../../../event-grid/overview.md) Web hook.
- Download the [.NET SDK](https://dev.azure.com/azure-sdk/public/_artifacts/feed/azure-sdk-for-net/NuGet/Azure.Communication.CallingServer/overview/1.0.0-alpha.20220829.1)
- This Quickstart assumes you have some experience using the [Calling CLient SDK](https://docs.microsoft.com/azure/communication-services/quickstarts/voice-video-calling/get-started-with-video-calling?pivots=platform-web). **Important**: To fetch serverCallId from Calling SDK, refer to the JavaScript example in the **Appendix** at the end of this document.
- Make sure to provide the Azure Communication Services Call Recording team with your **immutable azure resource ID** to be whitelisted during the private preview tests.


## 1. Create a Call Automation client

To create a call automation client, you'll use your Communication Services connection string and pass it to `CallAutomationClient` object.

```csharp
CallAutomationClient callAutomationClient = new CallAutomationClient("<ACSConnectionString>");
```

## 2. Start recording session with StartRecordingOptions using 'StartRecordingAsync' server API

Use the server call ID received during initiation of the call.
•	RecordingContent is used to pass the recording content type. Use audio
•	RecordingChannel is used to pass the recording channel type. Use unmixed.
•	RecordingFormat is used to pass the format of the recording. Use wav.

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
    "topic": string, // Azure Communication Services resource id
    "subject": string, // /recording/call/{call-id}
    "data": {
        "recordingStorageInfo": {
            "recordingChunks": [
                {
                    "documentId": string, // Document id for retrieving from AMS storage
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

Use `DeleteRecordingAsync` API for deleting the recording content (e.g. recorded media, metadata)

```csharp
var recordingDeleteUri = new Uri(deleteLocation);
var response = await callAutomationClient.GetCallRecording().DeleteRecordingAsync(recordingDeleteUri);
```

## Appendix

### A - Getting serverCallId as a requirement for call recording server APIs from JavaScript application

Call recording is an extended feature of the core Call API. You first need to import calling Features from the Calling SDK.

```JavaScript
import { Features} from "@azure/communication-calling";
```
Then you can get the recording feature API object from the call instance:

```JavaScript
const callRecordingApi = call.feature(Features.Recording);
```
Subscribe to recording changes:

```JavaScript
const recordingStateChanged = () => {
    let recordings = callRecordingApi.recordings;

    let state = SDK.RecordingState.None;
    if (recordings.length > 0) {
        state = recordings.some(r => r.state == SDK.RecordingState.Started)
            ? SDK.RecordingState.Started
            : SDK.RecordingState.Paused;
    }
    
	console.log(`RecordingState: ${state}`);
}

const recordingsChangedHandler = (args: { added: SDK.RecordingInfo[], removed: SDK.RecordingInfo[]}) => {
    args.added?.forEach(a => {
        a.on('recordingStateChanged', recordingStateChanged);
    });

    args.removed?.forEach(r => {
        r.off('recordingStateChanged', recordingStateChanged);
    });

    recordingStateChanged();
};

callRecordingApi.on('recordingsUpdated', recordingsChangedHandler);
```
Get server call ID which can be used to start/stop/pause/resume recording sessions.
Once the call is connected, use the `getServerCallId` method to get the server call ID.

```JavaScript
callAgent.on('callsUpdated', (e: { added: Call[]; removed: Call[] }): void => {
    e.added.forEach((addedCall) => {
        addedCall.on('stateChanged', (): void => {
            if (addedCall.state === 'Connected') {
                addedCall.info.getServerCallId().then(result => {
                    dispatch(setServerCallId(result));
                }).catch(err => {
                    console.log(err);
                });
            }
        });
    });
});
```

### B - How to find the Azure Resource ID

In order to get your Resource ID whitelisted, please send your Immutable Azure Resource ID to the Call Recording Team. For reference see the image below.

![Call recording how to get resource ID](../../media/call-recording/immutable resource id.md)



