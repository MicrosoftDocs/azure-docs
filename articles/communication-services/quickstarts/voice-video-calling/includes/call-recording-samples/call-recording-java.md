---
author: dbasantes
ms.service: azure-communication-services
ms.date: 06/11/2023
ms.topic: include
ms.custom: public_preview
---

## Sample Code

You can download the sample app from [GitHub](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/CallRecording)

## Prerequisites

- You need an Azure account with an active subscription.
- Deploy a Communication Service resource. Record your resource **connection string**.
- Subscribe to events via [Azure Event Grid](../../../../../event-grid/event-schema-communication-services.md).
- Download the [Java SDK](https://search.maven.org/artifact/com.azure/azure-communication-callautomation/1.0.0-beta.1/jar)

## Before you start

Call Recording APIs exclusively use the `serverCallId` to initiate recording. There are a couple of methods you can use to fetch the `serverCallId` depending on your scenario:

### Call Automation scenarios

When using [Call Automation](../../../call-automation/callflows-for-customer-interactions.md), you have two options to get the `serverCallId`:

1. Once a call is created, a `serverCallId` is returned as a property of the `CallConnected` event after a call is established. Learn how to [Get CallConnected event](../../../call-automation/callflows-for-customer-interactions.md?pivots=programming-language-java#update-programcs) from Call Automation SDK.

2.  Once you answer the call or a call is created the `serverCallId` is returned as a property of the `AnswerCallResult` or `CreateCallResult` API responses respectively.

### Calling SDK scenarios

When using [Calling Client SDK](../../get-started-with-video-calling.md), you can retrieve the `serverCallId` by using the `getServerCallId` method on the call.

Use this example to learn how to [Get serverCallId](../../get-server-call-id.md) from the Calling Client SDK. 

Let's get started with a few simple steps.

## 1. Create a Call Automation client

Call Recording APIs are part of the Azure Communication Services [Call Automation](../../../../concepts/call-automation/call-automation.md) libraries. So you need to create a Call Automation client.

To create a call automation client, use your Communication Services connection string and pass it to `CallAutomationClient` object.

```java
CallAutomationClient callAutomationClient = new CallAutomationClientBuilder()
            .connectionString("<acsConnectionString>")
            .buildClient();
```

## 2. Start recording session with StartRecordingOptions using `startWithResponse` API

Use the `serverCallId` received during initiation of the call.
- Use `RecordingContent` to pass the recording content type. Use `AUDIO`.
- Use `RecordingChannel` to pass the recording channel type. Use `MIXED` or `UNMIXED`.
- Use `RecordingFormat` to pass the format of the recording. Use `WAV`.

```java
StartRecordingOptions recordingOptions = new StartRecordingOptions(new ServerCallLocator("<serverCallId>"))
                    .setRecordingChannel(RecordingChannel.UNMIXED)
                    .setRecordingFormat(RecordingFormat.WAV)
                    .setRecordingContent(RecordingContent.AUDIO)
                    .setRecordingStateCallbackUrl("<recordingStateCallbackUrl>");

Response<RecordingStateResult> response = callAutomationClient.getCallRecording()
.startWithResponse(recordingOptions, null);

```

### 2.1. Start Recording - Bring Your Own Azure Blob Store

Start recording using your designated Azure Blob Storage to store the recorded file once recording is complete.

```java
        StartRecordingOptions recordingOptions = new StartRecordingOptions(callLocator)
        .setRecordingChannel(RecordingChannel.MIXED)
        .setRecordingContent(RecordingContent.AUDIO_VIDEO)
        .setRecordingFormat(RecordingFormat.MP4)
        .setRecordingStorage(new AzureBlobContainerRecordingStorage("<YOUR_STORAGE_CONTAINER_URL>"));
 
       // //start recording
       RecordingStateResult result = callRecording.start(recordingOptions);
```

### 2.2. Start recording session with Pause mode enabled using `StartAsync` API

> [!NOTE]
> **Recordings must be resumed for recording file to be generated.**

```java
StartRecordingOptions recordingOptions = new StartRecordingOptions(new ServerCallLocator("<serverCallId>"))
                    .setRecordingChannel(RecordingChannel.UNMIXED)
                    .setRecordingFormat(RecordingFormat.WAV)
                    .setRecordingContent(RecordingContent.AUDIO)
                    .setRecordingStateCallbackUrl("<recordingStateCallbackUrl>")
                    .setPauseOnStart(true)
                    .setAudioChannelParticipantOrdering(List.of(new CommunicationUserIdentifier("<participantMri>")));

Response<RecordingStateResult> response = callAutomationClient.getCallRecording()
.startWithResponse(recordingOptions, null);

```

### 2.3. Only for Unmixed - Specify a user on channel 0

To produce unmixed audio recording files, you can use the `AudioChannelParticipantOrdering` functionality to specify which user you want to record on channel 0. The rest of the participants are assigned to a channel as they speak. If you use `RecordingChannel.Unmixed` but don't use `AudioChannelParticipantOrdering`, Call Recording assigns channel 0 to the first participant speaking. 

```java
StartRecordingOptions recordingOptions = new StartRecordingOptions(new ServerCallLocator("<serverCallId>"))
                    .setRecordingChannel(RecordingChannel.UNMIXED)
                    .setRecordingFormat(RecordingFormat.WAV)
                    .setRecordingContent(RecordingContent.AUDIO)
                    .setRecordingStateCallbackUrl("<recordingStateCallbackUrl>")
                    .setAudioChannelParticipantOrdering(List.of(new CommunicationUserIdentifier("<participantMri>")));

Response<RecordingStateResult> response = callAutomationClient.getCallRecording()
.startWithResponse(recordingOptions, null);

```

### 2.4. Only for Unmixed - Specify channel affinity

```java
ChannelAffinity channelAffinity = new ChannelAffinity()
.setParticipant(new PhoneNumberIdentifier("RECORDING_ID"))
.setChannel(0);
List<ChannelAffinity> channelAffinities = Arrays.asList(channelAffinity);

StartRecordingOptions startRecordingOptions = new StartRecordingOptions(new ServerCallLocator(SERVER_CALL_ID))
   .setRecordingChannel(RecordingChannel.UNMIXED)
   .setRecordingFormat(RecordingFormat.WAV)
   .setRecordingContent(RecordingContent.AUDIO)
   .setRecordingStateCallbackUrl("<recordingStateCallbackUrl>")
   .setChannelAffinity(channelAffinities);
Response<RecordingStateResult> response = callAutomationClient.getCallRecording()
.startRecordingWithResponse(recordingOptions, null);
```
The `startWithResponse` API response contains the `recordingId` of the recording session.

## 3. Stop recording session using `stopWithResponse` API

Use the `recordingId` received in response to `startWithResponse`.

```java
Response<Void> response = callAutomationClient.getCallRecording()
               .stopWithResponse(response.getValue().getRecordingId(), null);
```

## 4. Pause recording session using `pauseWithResponse` API

Use the `recordingId` received in response to `startWithResponse`.

```java
Response<Void> response = callAutomationClient.getCallRecording()
              .pauseWithResponse(response.getValue().getRecordingId(), null);
```

## 5. Resume recording session using `resumeWithResponse` API

Use the `recordingId` received in response to `startWithResponse`.

```java
Response<Void> response = callAutomationClient.getCallRecording()
               .resumeWithResponse(response.getValue().getRecordingId(), null);
```

## 6. Download recording File using `downloadToWithResponse` API

Use an [Azure Event Grid](../../../../../event-grid/event-schema-communication-services.md) web hook or other triggered action should be used to notify your services when the recorded media is ready for download.

An Event Grid notification `Microsoft.Communication.RecordingFileStatusUpdated` is published when a recording is ready for retrieval, typically a few minutes after the recording process completes (such as meeting ends or recording stops). Recording event notifications include `contentLocation` and `metadataLocation`, which you can use to retrieve both recorded media and a recording metadata file.

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

Use `downloadToWithResponse` method of `CallRecording` class to download the recorded media. Following are the supported parameters for `downloadToWithResponse` method:
- `contentLocation`: Azure Communication Services URL where the content is located.
- `destinationPath` : File location.
- `parallelDownloadOptions`: An optional `ParallelDownloadOptions` object to modify how the parallel download works.
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

## 7. Delete recording content using `deleteWithResponse` API

Use `deleteWithResponse` method of `CallRecording` class to delete the recorded media. Supported parameters for `deleteWithResponse` method:
- `deleteLocation`: Azure Communication Services URL where the content to delete is located.
- `context`: A Context representing the request context.

```
Response<Void> deleteResponse = callAutomationClient.getCallRecording().deleteWithResponse(deleteLocation, context);
```

The delete location for the recording can be fetched from the `deleteLocation` field of the Event Grid event.
