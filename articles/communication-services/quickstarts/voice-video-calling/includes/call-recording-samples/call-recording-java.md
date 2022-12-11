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
- Download the [Java SDK](https://dev.azure.com/azure-sdk/public/_artifacts/feed/azure-sdk-for-java/maven/com.azure%2Fazure-communication-callautomation/overview/1.0.0-alpha.20221013.1)

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

```java
CallAutomationClient callAutomationClient = new CallAutomationClientBuilder()
            .connectionString("<acsConnectionString>")
            .buildClient();
```

## 2. Start recording session with StartRecordingOptions using 'startRecordingWithResponse' API

Use the `serverCallId` received during initiation of the call.
- RecordingContent is used to pass the recording content type. Use AUDIO
- RecordingChannel is used to pass the recording channel type. Use MIXED or UNMIXED.
- RecordingFormat is used to pass the format of the recording. Use WAV.

```java
StartRecordingOptions recordingOptions = new StartRecordingOptions(new ServerCallLocator("<serverCallId>"))
                    .setRecordingChannel(RecordingChannel.UNMIXED)
                    .setRecordingFormat(RecordingFormat.WAV)
                    .setRecordingContent(RecordingContent.AUDIO)
                    .setRecordingStateCallbackUrl("<recordingStateCallbackUrl>");

Response<StartCallRecordingResult> response = callAutomationClient.getCallRecording()
.startRecordingWithResponse(recordingOptions, null);

```

### 2.1. For Unmixed only - Specify a user on a channel 0

```java
StartRecordingOptions recordingOptions = new StartRecordingOptions(new ServerCallLocator("<serverCallId>"))
                    .setRecordingChannel(RecordingChannel.UNMIXED)
                    .setRecordingFormat(RecordingFormat.WAV)
                    .setRecordingContent(RecordingContent.AUDIO)
                    .setRecordingStateCallbackUrl("<recordingStateCallbackUrl>")
                    .setChannelAffinity(List.of(
                            new ChannelAffinity(0, new CommunicationUserIdentifier("<participantMri>"));

Response<RecordingStateResult> response = callAutomationClient.getCallRecording()
.startRecordingWithResponse(recordingOptions, null);

```
The `startRecordingWithResponse` API response contains the `recordingId` of the recording session.

## 3.	Stop recording session using 'stopRecordingWithResponse' API

Use the `recordingId` received in response of `startRecordingWithResponse`.

```java
Response<Void> response = callAutomationClient.getCallRecording()
               .stopRecordingWithResponse(response.getValue().getRecordingId(), null);
```

## 4.	Pause recording session using 'pauseRecordingWithResponse' API

Use the `recordingId` received in response of `startRecordingWithResponse`.
```java
Response<Void> response = callAutomationClient.getCallRecording()
              .pauseRecordingWithResponse(response.getValue().getRecordingId(), null);
```

## 5.	Resume recording session using 'resumeRecordingWithResponse' API

Use the `recordingId` received in response of `startRecordingWithResponse`.

```java
Response<Void> response = callAutomationClient.getCallRecording()
               .resumeRecordingWithResponse(response.getValue().getRecordingId(), null);
```

## 6.	Download recording File using 'downloadToWithResponse' API

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

Use `downloadToWithResponse` method of `CallRecording` class for downloading the recorded media. Following are the supported parameters for `downloadToWithResponse` method:
- `contentLocation`: Azure Communication Services URL where the content is located.
- `destinationPath` : File location.
- `parallelDownloadOptions`: An optional ParallelDownloadOptions object to modify how the - parallel download will work.
- `overwrite`: True to overwrite the file if it exists.
- `context`: A Context representing the request context.


```java
Boolean overwrite = true;
ParallelDownloadOptions parallelDownloadOptions = null;
Context context = null;

String filePath = String.format(".\\%s.%s", documentId, fileType);
Path destinationPath = Paths.get(filePath);

Response<Void> downloadResponse = callAutomationClient.getCallRecording().downloadToWithResponse(contentLocation, destinationPath, parallelDownloadOptions, overwrite, context);
```
The content location and document IDs for the recording files can be fetched from the `contentLocation` and `documentId` fields respectively, for each `recordingChunk`.

## 7. Delete recording content using ‘deleteRecordingWithResponse’ API.

Use `deleteRecordingWithResponse` method of `CallRecording` class for deleting the recorded media. Following are the supported parameters for `deleteRecordingWithResponse` method:
- `deleteLocation`: Azure Communication Services URL where the content to delete is located.
- `context`: A Context representing the request context.

```
Response<Void> deleteResponse = callAutomationClient.getCallRecording().deleteRecordingWithResponse(deleteLocation, context);
```
The delete location for the recording can be fetched from the `deleteLocation` field of the Event Grid event.
