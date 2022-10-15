---
title: Azure Communication Services Call Recording overview
titleSuffix: An Azure Communication Services concept document
description: Provides an overview of the Call Recording feature and APIs.
author: GrantMeStrength
manager: anvalent
services: azure-communication-services

ms.author: jken
ms.date: 06/30/2021
ms.topic: conceptual
ms.custom: references_regions
ms.service: azure-communication-services
ms.subservice: calling
---
# Call Recording overview

[!INCLUDE [Public Preview](../../includes/public-preview-include-document.md)]

> [!NOTE]
>  Call Recording is not enabled for [Teams interoperability](../teams-interop.md).

Call Recording enables you to record multiple calling scenarios available in Azure Communication Services by providing you with a set of APIs to start, stop, pause and resume recording. Whether it is a PSTN, WebRTC, or SIP call, these APIs can be accessed from server-side business logic or via events triggered by user actions. 

Depending on your business needs, you can use Call Recording for different Azure Communication Services calling implementations.
For example, you can record 1:1 or 1:N scenarios for audio and video calls enabled by [Calling Client SDK](https://learn.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/calling-sdk-features). 


![Call recording concept diagram](../media/call-recording-with-calling-client.png)


But also, you can use Call Recording to record complex PSTN or VoIP inbound and outbound calling workflows managed by [Call Automation](https://learn.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/call-automation).


![Call recording with call automation](../media/call-recording-with-call-automation.png)


Regardless of how the call was established, by using Call Recording, you can produce mixed or unmixed media files that are stored for 48 hours on a built-in temporary storage, where you can retrieve the files from and take them to a long-term storage solution of your choice. Call Recording supports all Azure Communication Services data regions.

## Media output and Channel types supported
Call Recording supports multiple media outputs and content types to address your business needs:

###Video


###Audio

| Content Type | Content Format | Channel Type | Video | Audio |
| :----------- | :------------- | :----------- | :---- | :--------------------------- |
| audio + video | mp4 | mixed | 1920x1080 eight (8) FPS video of all participants in default tile arrangement | 16 kHz mp4 mixed audio of all participants |
| audio| mp3/wav | mixed | N/A | 16 kHz mp3/wav mixed audio of all participants |
| audio| wav | unmixed | N/A | 16 kHz wav, 0-5 channels, 1 for each participant |

## Channel types
> [!NOTE]
> **Unmixed audio** is in **Private Preview**.

| Channel type              | Content format               | Output                                                                                | Scenario                                                | Release Stage |
|---------------------|-----------------------------|---------------------------------------------------------------------------------------|---------------------------------------------------------|----------------|
| Mixed audio+video   | Mp4                         | Single file, single channel                                                           | keeping records and meeting notes, coaching and training | Public Preview |
| Mixed audio    | Mp3 (lossy)/ wav (lossless) | Single file, single channel                                                           | compliance & adherence, coaching and training            | Public Preview |
| **Unmixed audio**  | wav                     | Single file, up to 5 wav channels | quality assurance, advance analytics                            | **Private Preview** |

## Call Recording APIs
Call Recording APIs can be used to manage recording via internal business logic triggers, such as an application creating a group call and recording the conversation. Also, recordings can be triggered by a user action that tells the server application to start recording. Call Recording APIs use the `serverCallId` to initiate recording. To learn how to get the `serverCallId` please go to our Call Recording Quickstart, section [Get serverCallId]().

When using Call Automation SDK, you have two options to get the `serverCallId`:
1) Once a call is created, a `serverCallId` is returned as a property of the `CallConnected` event after a call has been established. Learn how to [Get serverCallId](https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/voice-video-calling/callflows-for-customer-interactions?pivots=programming-language-csharp#configure-programcs-to-answer-the-call) from Call Automation SDK.
2) Once you answer the call or a call is created the `serverCallId` is returned as a property of the `AnswerCallResult` or `CreateCallResult` API responses respectively.

When using Calling Client SDK, you can retreive the `serverCallId` by using the `getServerCallId` method on the call. 
Learn how to [Get serverCallId](../../quickstarts/voice-video-calling/get-server-call-id.md) from the Calling Client SDK. 

In both cases, a `recordingId` is returned when recording is started, which is then used for follow-on operations like pause and resume.  
 

| Operation                            | Operates On            | Comments                       |
| :-------------------- | :--------------------- | :----------------------------- |
| Start Recording       | `serverCallId`         | Returns `recordingId` | 
| Get Recording State   | `recordingId` | Returns `RecordingStateResult`       | 
| Pause Recording       | `recordingId` | Pausing and resuming call recording enables you to skip recording a portion of a call or meeting, and resume recording to a single file. | 
| Resume Recording      | `recordingId` | Resumes a Paused recording operation. Content is included in the same file as content from prior to pausing. | 
| Stop Recording        | `recordingId` | Stops recording, and initiates final media processing for file download. | 


## Event Grid notifications
Notifications related to media and metadata are emitted via Event Grid.

> [!NOTE]
> Azure Communication Services provides short term media storage for recordings. **Recordings will be available to download for 48 hours.** After 48 hours, recordings will no longer be available.

An Event Grid notification `Microsoft.Communication.RecordingFileStatusUpdated` is published when a recording is ready for retrieval, typically a few minutes after the recording process has completed (for example, meeting ended, recording stopped). Recording event notifications include `contentLocation` and `metadataLocation`, which are used to retrieve both recorded media and a recording metadata file.

### Notification Schema Reference
```typescript
{
    "id": string, // Unique guid for event
    "topic": string, // /subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}
    "subject": string, // /recording/call/{call-id}/serverCallId/{serverCallId}
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
## Metadata Schema 
```typescript
{
  "resourceId": <string>,           // stable resource id of the ACS resource recording
  "callId": <string>,               // id of the call
  "chunkDocumentId": <string>,      // object identifier for the chunk this metadata corresponds to
  "chunkIndex": <number>,           // index of this chunk with respect to all chunks in the recording
  "chunkStartTime": <string>,       // ISO 8601 datetime for the start time of the chunk this metadata corresponds to
  "chunkDuration": <number>,        // [Chunk duration has a maximum of 4 hours] duration of the chunk this metadata corresponds to in milliseconds
  "pauseResumeIntervals": [
              "startTime": <string>,          // ISO 8601 datetime for the time at which the recording was paused
              "duration": <number>            // duration of the pause in the recording in milliseconds
                          ],
  "recordingInfo": {
               "contentType": <string>,        // content type of recording, e.g. audio/audioVideo
               "channelType": <string>,        // channel type of recording, e.g. mixed/unmixed
               "format": <string>,             // format of the recording, e.g. mp4/mp3/wav
               "audioConfiguration": {
                   "sampleRate": <number>,       // sample rate for audio recording
                   "bitRate": <number>,          // bitrate for audio recording
                   "channels": <number>          // number of audio channels in output recording
                                     }
                    },
  "participants": [
    {
      "participantId": <string>,    // participant identifier of a participant captured in the recording
      "channel": <number>           // channel the participant was assigned to if the recording is unmixed
    }
  ]
}

```

## Regulatory and privacy concerns

Many countries and states have laws and regulations that apply to call recording. PSTN, voice, and video calls, often require that users consent to the recording of their communications. It is your responsibility to use the call recording capabilities in compliance with the law. You must obtain consent from the parties of recorded communications in a manner that complies with the laws applicable to each participant.

Regulations around the maintenance of personal data require the ability to export user data. In order to support these requirements, recording metadata files include the participantId for each call participant in the `participants` array. You can cross-reference the MRIs in the `participants` array with your internal user identities to identify participants in a call. An example of a recording metadata file is provided below for reference.

## Known Issues

It is possible that when a call is created using Call Automation, you won't get a value in the `serverCallId`. If that's the case please get the `serverCallId` from the `CallConnected` event method described in [Get `serverCallId`](https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/voice-video-calling/callflows-for-customer-interactions?pivots=programming-language-csharp#configure-programcs-to-answer-the-call)

## Next steps
Check out the [Call Recording Quickstart](../../quickstarts/voice-video-calling/call-recording-sample.md) to learn more.

Learn more about [Call Automation APIs](./call-automation-apis.md).
