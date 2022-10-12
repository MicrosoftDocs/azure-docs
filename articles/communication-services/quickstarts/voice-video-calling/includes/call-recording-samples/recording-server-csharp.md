---
title: include file
description: include file
services: azure-communication-services
author: ravithanneeru
manager: joseys
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 06/30/2021
ms.topic: include
ms.custom: include file
ms.author: joseys
---
## Sample Code
Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/ServerRecording).

## Prerequisites

- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js (12.18.4 and above)](https://nodejs.org/en/download/).
- [Visual Studio (2019 and above)](https://visualstudio.microsoft.com/vs/).
- [.NET Core 3.1](https://dotnet.microsoft.com/download/dotnet-core/3.1) (Make sure to install version that corresponds with your visual studio instance, 32 vs 64 bit).
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Services resource](../../../create-communication-resource.md). You'll need to record your resource **connection string** for this quickstart.
- An Azure storage account and container, for details, see [Create a storage account](../../../../../storage/common/storage-account-create.md?tabs=azure-portal). You'll need to record your storage **connection string** and **container name** for this quickstart.
- An [Azure Event Grid](../../../../../event-grid/overview.md) Web hook.

## Object model

The following classes handle some of the major features of the recording Server apps of C#.

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| CallingServerClient | This class is needed for the recording functionality. You create an instance of CallingServerClient using Azure Communication Services resource connection string and use it to start/stop and pause/resume a call recording. |

## Getting serverCallId as a requirement for call recording server APIs from JavaScript application

> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this API please use 'beta' release of Azure Communication Services Calling Web SDK. A client sample with recording flows is available at [GitHub](https://github.com/Azure-Samples/communication-services-web-calling-hero/tree/public-preview).

Call recording is an extended feature of the core `Call` API. You first need to import calling Features from the Calling SDK:

```js
import { Features} from "@azure/communication-calling";
```

Then you can get the recording feature API object from the call instance:

```js
const callRecordingApi = call.feature(Features.Recording);
```

Subscribe to recording changes:

```JavaScript
const isRecordingActiveChangedHandler = () => {
  console.log(callRecordingApi.isRecordingActive);
};

callRecordingApi.on('isRecordingActiveChanged', isRecordingActiveChangedHandler);
```

Get server call ID which can be used to start/stop/pause/resume recording sessions:

Once the call is connected use the `getServerCallId` method to get the server call ID.

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

## Create a calling server client

To create a calling server client, you'll use your Azure Communication Services connection string and pass it to calling server client object.

```csharp
CallingServerClient callingServerClient = new CallingServerClient("<Resource_Connection_String>");
```

## Start recording session using 'StartRecordingAsync' server API

Use the server call ID received during initiation of a call. The default recording format will be mixed audio+video.

```csharp
var startRecordingResponse = await callingServerClient.InitializeServerCall("<servercallid>").StartRecordingAsync("<callbackuri>").ConfigureAwait(false);
```
The `StartRecordingAsync` API response contains the recording ID of the recording session.


## Start recording session with options using 'StartRecordingAsync' server API

Use the server call ID received during initiation of a call.

- RecordingContent is used to pass the recording content type. Ex: audio/audiovideo.
- RecordingChannel is used to pass the recording channel type. Ex: mixed/unmixed.
- RecordingFormat is used to pass the format of the recording. Ex: mp4/mp3/wav.

```csharp
var startRecordingResponse = await callingServerClient.InitializeServerCall("<servercallid>").StartRecordingAsync("<callbackuri>","<RecordingContent>","<RecordingChannel>","<RecordingFormat>").ConfigureAwait(false);
```
The `StartRecordingAsync` API response contains the recording ID of the recording session.

### Specify a user on a channel 0 for unmixed audio-only

```csharp
var channelAffinity = new []
{
    new ChannelAffinity
    {
        Channel = 0,
        Participant = user,
    },
};

var startRecordingResponse = await callingServerClient.InitializeServerCall("<servercallid>").StartRecordingAsync("<callbackuri>", RecordingContent.Audio, RecordingChannel.Unmixed, RecordingFormat.Wav, channelAffinity).ConfigureAwait(false);
```

## Stop recording session using 'StopRecordingAsync' server API

Use the recording ID received in response of  `StartRecordingAsync`.

```csharp
 var stopRecording = await callingServerClient.InitializeServerCall("<servercallid>").StopRecordingAsync("<recordingid>").ConfigureAwait(false);
```

## Pause recording session using 'PauseRecordingAsync' server API

Use the  recording ID received in response of  `StartRecordingAsync`.

```csharp
var pauseRecording = await callingServerClient.InitializeServerCall("<servercallid>").PauseRecordingAsync("<recordingid>");
```

## Resume recording session using 'ResumeRecordingAsync' server API

Use the recording ID received in response of  `StartRecordingAsync`.

```csharp
var resumeRecording = await callingServerClient.InitializeServerCall("<servercallid>").ResumeRecordingAsync("<recordingid>");
```

## Download recording File using 'DownloadStreamingAsync' server API

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
var response = callingServerClient.DownloadStreamingAsync(recordingDownloadUri);
```
The downloadLocation for the recording can be fetched from the `contentLocation` attribute of the `recordingChunk`. `DownloadStreamingAsync` method returns response of type `Response<Stream>`, which contains the downloaded content.
