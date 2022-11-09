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
Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/ServerRecording).

## Prerequisites

- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- [Node.js (12.18.4 and above)](https://nodejs.org/en/download/)
- [Java Development Kit (JDK)](/azure/developer/java/fundamentals/java-jdk-install) version 11 or above.
- [Apache Maven](https://maven.apache.org/download.cgi).
- [Spring boot framework v- 2.5.0](https://spring.io/projects/spring-boot)
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Services resource](../../../create-communication-resource.md). You'll need to record your resource **connection string** for this quickstart.
- An Azure storage account and container, for details, see [Create a storage account](../../../../../storage/common/storage-account-create.md?tabs=azure-portal). You'll need to record your **connection string** and **container name** for this quickstart.
- An [Azure Event Grid](../../../../../event-grid/overview.md) Web hook.

## Object model

The following classes handle some of the major features of the recording Server apps of Java.

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| CallingServerClientBuilder | This class is used to create instance of CallingServerClient.|
| CallingServerClient | This class is needed for the calling functionality. You obtain an instance via CallingServerClientBuilder and use it to start/hangup a call, play/cancel audio and add/remove participants |

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

To create a calling server client, you'll use your Communication Services connection string and pass it to calling server client object.

```java
NettyAsyncHttpClientBuilder httpClientBuilder = new NettyAsyncHttpClientBuilder();
CallingServerClientBuilder builder = new CallingServerClientBuilder().httpClient(httpClientBuilder.build())
 .connectionString(connectionString);
 callingServerClient = builder.buildClient();
```

## Start recording session using 'startRecordingWithResponse' server API

Use the server call ID received during initiation of the call.

```java
URI recordingStateCallbackUri = new URI("<CallbackUri>");

Response<StartCallRecordingResult> response = this.callingServerClient.initializeServerCall("<serverCallId>")
.startRecordingWithResponse(String.valueOf(recordingStateCallbackUri), null, null);
```
The `startRecordingWithResponse` API response contains the recording ID of the recording session.

## Start recording session with StartRecordingOptions using 'startRecordingWithResponse' server API

Use the server call ID received during initiation of the call.

- RecordingContent is used to pass the recording content type. Ex: AUDIO/AUDIO_VIDEO.
- RecordingChannel is used to pass the recording channel type. Ex: MIXED/UNMIXED.
- RecordingFormat is used to pass the format of the recording. Ex: MP4/MP3/WAV.

```java
URI recordingStateCallbackUri = new URI("<CallbackUri>");
StartRecordingOptions recordingOptions = new StartRecordingOptions();
recordingOptions.setRecordingContent(RecordingContent.AUDIO_VIDEO);
recordingOptions.setRecordingChannel(RecordingChannel.MIXED);
recordingOptions.setRecordingFormat(RecordingFormat.MP4);
Response<StartCallRecordingResult> response = this.callingServerClient.initializeServerCall("<serverCallId>")
.startRecordingWithResponse(String.valueOf(recordingStateCallbackUri), recordingOptions, null);
```

### Specify a user on a channel 0 for unmixed audio-only
```java
URI recordingStateCallbackUri = new URI("<CallbackUri>");
StartRecordingOptions recordingOptions = new StartRecordingOptions();
recordingOptions.setRecordingContent(RecordingContent.AUDIO);
recordingOptions.setRecordingChannel(RecordingChannel.UNMIXED);
recordingOptions.setRecordingFormat(RecordingFormat.WAV);
recordingOptions.setChannelAffinity({ new ChannelAffinity(0, user) });
Response<StartCallRecordingResult> response = this.callingServerClient.initializeServerCall("<serverCallId>")
.startRecordingWithResponse(String.valueOf(recordingStateCallbackUri), recordingOptions, null);
```

The `StartRecordingAsync` API response contains the recording ID of the recording session.

## Stop recording session using 'stopRecordingWithResponse' server API

Use the recording ID received in response of `startRecordingWithResponse`.

```java
Response<Void> response = this.callingServerClient.initializeServerCall(serverCallId)
.stopRecordingWithResponse(recordingId, null);
```

## Pause recording session using 'pauseRecordingWithResponse' server API

Use the recording ID received in response of  `startRecordingWithResponse`.

```java
Response<Void> response = this.callingServerClient.initializeServerCall(serverCallId)
.pauseRecordingWithResponse(recordingId, null);
```

## Resume recording session using 'resumeRecordingWithResponse' server API

Use the recording ID received in response of  `startRecordingWithResponse`.

```java
Response<Void> response = this.callingServerClient.initializeServerCall(serverCallId)
.resumeRecordingWithResponse(serverCallId, null);
```

## Download recording File using 'downloadToWithResponse' server API

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
Use `downloadToWithResponse` method of `CallingServerClient` class for downloading the recorded media. Following are the supported parameters for `downloadToWithResponse` method:

- `contentLocation`: Azure Communication Services URL where the content is located.
- `destinationPath` : File location.
- `parallelDownloadOptionss`: An optional ParallelDownloadOptions object to modify how the - parallel download will work.
- `overwrite`: True to overwrite the file if it exists.
- `context`: A Context representing the request context.

```Java
Boolean overwrite = true;
ParallelDownloadOptions parallelDownloadOptions = null;
Context context = null;

String filePath = String.format(".\\%s.%s", documentId, fileType);
Path destinationPath = Paths.get(filePath);

Response<Void> downloadResponse = callingServerClient.downloadToWithResponse(contentLocation, destinationPath, parallelDownloadOptions, overwrite, context);
```
The content location and document IDs for the recording files can be fetched from the `contentLocation` and `documentId` fields respectively, for each `recordingChunk`.
