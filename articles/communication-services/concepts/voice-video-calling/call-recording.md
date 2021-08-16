---
title: Azure Communication Services Call Recording overview
titleSuffix: An Azure Communication Services concept document
description: Provides an overview of the Call Recording feature and APIs.
author: jken
manager: anvalent
services: azure-communication-services

ms.author: jken
ms.date: 06/30/2021
ms.topic: overview
ms.custom: references_regions
ms.service: azure-communication-services
---
# Calling Recording overview

[!INCLUDE [Public Preview](../../includes/public-preview-include-document.md)]

> [!NOTE]
> Call Recording is available for Communication Services resources created in the US, UK, Europe, Asia and Australia regions.

Call Recording provides a set of APIs to start, stop, pause and resume recording. These APIs can be accessed from server-side business logic or via events triggered by user actions. Recorded media output is in MP4 Audio+Video format, which is the same format that Teams uses to record media. Notifications related to media and metadata are emitted via Event Grid. Recordings are stored for 48 hours on built-in temporary storage for retrieval and movement to a long-term storage solution of choice. 

![Call recording concept diagram](../media/call-recording-concept.png)

## Media output types
Call recording currently supports mixed audio+video MP4 output format. The output media matches meeting recordings produced via Microsoft Teams recording.

| Channel Type | Content Format | Video | Audio |
| :----------- | :------------- | :---- | :--------------------------- |
| audioVideo | mp4 | 1920x1080 8 FPS video of all participants in default tile arrangement | 16kHz mp4a mixed audio of all participants |


## Run-time Control APIs
Run-time control APIs can be used to manage recording via internal business logic triggers, such as an application creating a group call and recording the conversation, or from a user-triggered action that tells the server application to start recording. Call Recording APIs are [Out-of-Call APIs](./call-automation-apis.md#out-of-call-apis), using the `serverCallId` to initiate recording. When creating a call, a `serverCallId` is returned via the `Microsoft.Communication.CallLegStateChanged` event after a call has been established. The `serverCallId` can be found in the `data.serverCallId` field. See our [Call Recording Quickstart Sample](../../quickstarts/voice-video-calling/call-recording-sample.md) to learn about retrieving the `serverCallId` from the Calling Client SDK. A `recordingOperationId` is returned when recording is started, which is then used for follow-on operations like pause and resume.   

| Operation                            | Operates On            | Comments                       |
| :-------------------- | :--------------------- | :----------------------------- |
| Start Recording       | `serverCallId`         | Returns `recordingOperationId` | 
| Get Recording State   | `recordingOperationId` | Returns `recordingState`       | 
| Pause Recording       | `recordingOperationId` | Pausing and resuming call recording enables you to skip recording a portion of a call or meeting, and resume recording to a single file. | 
| Resume Recording      | `recordingOperationId` | Resumes a Paused a recording operation. Content is included in the same file as content from prior to pausing. | 
| Stop Recording        | `recordingOperationId` | Stops recording, and initiates final media processing for file download. | 


## Event Grid notifications

> Azure Communication Services provides short term media storage for recordings. **Export any recorded content you wish to preserve within 48 hours.** After 48 hours, recordings will no longer be available.

An Event Grid notification `Microsoft.Communication.RecordingFileStatusUpdated` is published when a recording is ready for retrieval, typically a few minutes after the recording process has completed (e.g. meeting ended, recording stopped). Recording event notifications include `contentLocation` and `metadataLocation`, which are used to retrieve both recorded media and a recording metadata file.

### Notification Schema Reference
```
{
    "id": string, // Unique guid for event
    "topic": string, // Azure Communication Services resource id
    "subject": string, // /recording/call/{call-id}
    "data": {
        "recordingStorageInfo": {
            "recordingChunks": [
                {
                    "documentId": string, // Document id for retrieving from storage
                    "index": int, // Index providing ordering for this chunk in the entire recording
                    "endReason": string, // Reason for chunk ending: "SessionEnded", "ChunkMaximumSizeExceeded”, etc.
                    "metadataLocation": <string>, // url of the metadata for this chunk
                    "contentLocation": <string>   // url of the mp4, mp3, or wav for this chunk
                }
            ]
        },
        "recordingStartTime": string, // ISO 8601 date time for the start of the recording
        "recordingDurationMs": int, // Duration of recording in milliseconds
        "sessionEndReason": string // Reason for call ending: "CallEnded", "InitiatorLeft", etc.
    },
    "eventType": string, // "Microsoft.Communication.RecordingFileStatusUpdated"
    "dataVersion": string, // "1.0"
    "metadataVersion": string, // "1"
    "eventTime": string // ISO 8601 date time for when the event was created
}
```
## Regulatory and privacy concerns

Many countries and states have laws and regulations that apply to the recording of PSTN, voice, and video calls, which often require that users consent to the recording of their communications. It is your responsibility to use the call recording capabilities in compliance with the law. You must obtain consent from the parties of recorded communications in a manner that complies with the laws applicable to each participant.

Regulations around the maintenance of personal data require the ability to export user data. In order to support these requirements, recording metadata files include the participantId for each call participant in the `participants` array. You can cross-reference the MRIs in the `participants` array with your internal user identities to identify participants in a call. An example of a recording metadata file is provided below for reference.

## Next steps
Check out the [Call Recoding Quickstart Sample](../../quickstarts/voice-video-calling/call-recording-sample.md) to learn more.

Learn more about [Call Automation APIs](./call-automation-apis.md).
