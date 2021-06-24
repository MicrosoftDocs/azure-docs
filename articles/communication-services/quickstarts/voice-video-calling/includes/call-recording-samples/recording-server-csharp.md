---
title: include file
description: include file
services: azure-communication-services
author: ravithanneeru
manager: joseys
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 06/08/2021
ms.topic: include
ms.custom: include file
ms.author: joseys
---

## Prerequisites

- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js (12.18.4 and above)](https://nodejs.org/en/download/).
- [Visual Studio (2019 and above)](https://visualstudio.microsoft.com/vs/).
- [.NET Core 3.1](https://dotnet.microsoft.com/download/dotnet-core/3.1) (Make sure to install version that corresponds with your visual studio instance, 32 vs 64 bit).
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Resource](https://docs.microsoft.com/azure/communication-services/quickstarts/create-communication-resource). You'll need to record your resource **connection string** for this quickstart.
- An Azure storage account and container, for details, see [Create a storage account](https://docs.microsoft.com/azure/storage/common/storage-account-create?tabs=azure-portal). You'll need to record your storage **connection string** and **container name** for this quickstart.
- An Azure Event grid Web hook, for details, see [Record and download calls with Event Grid](https://docs.microsoft.com/azure/communication-services/quickstarts/voice-video-calling/download-recording-file-sample).

## Object model

The following classes handle some of the major features of the recording Server apps of C#.

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| CallingServerClient | This class is needed for the recording functionality. You create an instance of CallingServerClient using ACS resource connection string and use it to start/stop and pause/resume a call recording. |

## Create a calling server client

To create a calling server client, you'll use your Azure Communication Services connection string and pass it to calling server client object.

```csharp
CallingServerClient callingServerClient = new CallingServerClient("<Resource_Connection_String>");
```

## Start recording session using 'StartRecordingAsync' server API

Use the server call id received during initiation of a call.

```csharp
var startRecordingResponse = await callingServerClient.InitializeServerCall("<servercallid>").StartRecordingAsync("<callbackuri>").ConfigureAwait(false);
```
The `StartRecordingAsync` API response contains the recording id of the recording session.

## Stop recording session using 'StopRecordingAsync' server API

Use the recording id received in response of  `StartRecordingAsync`.

```csharp
 var stopRecording = await callingServerClient.InitializeServerCall("<servercallid>").StopRecordingAsync("<recordingid>").ConfigureAwait(false);
```

## Pause recording session using 'PauseRecordingAsync' server API

Use the  recording id received in response of  `StartRecordingAsync`.

```csharp
var pauseRecording = await callingServerClient.InitializeServerCall("<servercallid>").PauseRecordingAsync("<recordingid>");
```

## Resume recording session using 'ResumeRecordingAsync' server API

Use the recording id received in response of  `StartRecordingAsync`.

```csharp
var resumeRecording = await callingServerClient.InitializeServerCall("<servercallid>").ResumeRecordingAsync("<recordingid>");
```

## Download recording File using 'DownloadStreamingAsync' server API

[!NOTE] An Azure Event grid Web hook is required to get the notification callback event when the recorded media is ready for download. For details, see [Record and download calls with Event Grid](https://docs.microsoft.com/azure/communication-services/quickstarts/voice-video-calling/download-recording-file-sample).

When the recording is available for download, Azure Event Grid will trigger a notification callback event to the application with the following schema.

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
                    "contentLocation": string, //ACS URL where the content is located
                    "metadataLocation": string, // ACS URL where the metadata for this chunk is located
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
var response = DownloadExtentions.DownloadStreamingAsync(callingServerClient, recordingDownloadUri);
```
The downloadLocation for the recording can be fetched from the `contentLocation` attribute of the `recordingChunk`. `DownloadStreamingAsync` method returns response of type `Response<Stream>`, which contains the downloaded content.
