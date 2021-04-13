---
title: Azure Communication Services Call Recording overview
titleSuffix: An Azure Communication Services concept document
description: Provides an overview of the Call Recording feature and APIs.
author: joseys
manager: anvalent
services: azure-communication-services

ms.author: joseys
ms.date: 04/13/2021
ms.topic: overview
ms.service: azure-communication-services
---
# Calling Recording overview

>Many countries and states have laws and regulations that apply to the recording of PSTN, voice, and video calls, which often require that users consent to the recording of their communications. It is your responsibility to use the call recording capabilities in compliance with the law. You must obtain consent from the parties of recorded communications in a manner that complies with the laws applicable to each participant.

Call Recording provides a set of server APIs to start, stop, pause and resume recording, which can be triggered from server-side business logic or events received from user actions. Recorded media output is in MP4 Audio+Video format (same as Teams recordings). Notifications that a recording media and meta-data files are ready for retrieval are provided via Event Grid. Recordings are stored for 48 hours on built-in temporary storage, for retrieval and movement to a long-term storage solution of choice. 

**Key Features of Call Recording**
- **Run-time Control APIs** - Server-side control APIs for Start, Stop, Pause, and Resume Recording. 
- **Media Output Formats** - Recorded media output is MP4 Audio+Video format (same as Teams recordings), with more formats planned in future releases.
- **Event Grid Notifications** - Notifications are sent via an event grid configured in your ACS resource when a recording file is ready for retrieval. 
- **Transitory File Storage** - Recordings are stored for 48 hours on built-in temporary storage, for retrieval and movement to a long-term storage solution of choice.

## Stuff Stuff

## Retrieve call recordings
Azure Communication Services provides short term media storage for recordings, please export any recorded content, you wish to preserve, within 48 hours. After 48 hours, recordings will no longer be available.

An Event Grid notification `Call Recording File Status Updated` is published when a recording is ready for retrieval, typically 1-2 minutes after the recording process has completed (i.e. meeting ended, recording stopped). Recording event notifications include a document ID, which can be used to retrieve both recorded media and a recording meta-data file:
- <Azure_Communication_Service_Endpoint>/recording/download/{documentId}
- <Azure_Communication_Service_Endpoint>/recording/download/{documentId}/metadata

Sample code for handling event grid notifications and downloading recording and meta-data files can be found [here](https://github.com/microsoft/botframework-telephony/tree/main/samples/csharp_dotnetcore/05a.telephony-recording-download-function).

Regulations such as GDPR require the ability to export user data. In order to enable to support these requirements, recording meta data files include the participantId for each call participant in the participants[] array. You can cross-reference the MRIs in the participants[] array with your internal user identities to identify participants in a call. An example of an recording meta-data file is provided below for reference:

```json
{
  "resourceId": "29bd5ea9-e0fc-4d00-8f6f-339b1f0ee2e2",
  "callId": "43563209-4ec6-4119-be5b-88398cda2caf",
  "chunkDocumentId": "0-eus-d11-05bf22b166dfb2119e3ff85d98906121",
  "chunkIndex": 0,
  "chunkStartTime": "2021-03-24T18:52:14.1321393Z",
  "chunkDuration": 15000.0,
  "pauseResumeIntervals": [],
  "recordingInfo": {
    "contentType": "mixed",
    "channelType": "audioVideo",
    "format": "mp4",
    "audioConfiguration": {
        "sampleRate": "16000",
        "bitRate": 128000,
        "channels": 1
        },
     "videoConfiguration": {
        "longerSideLength": 1920,
        "shorterSideLength": 1080,
        "framerate": 8,
        "bitRate": 1000000
        }
    },
  "participants": [
    {
    "participantId": "8:acs:29bd5ea9-e0fc-4d00-8f6f-339b1f0ee2e2_00000008-6ad3-6540-99c6-593a0d00c367"
    },
    {
    "participantId": "8:acs:29bd5ea9-e0fc-4d00-8f6f-339b1f0ee2e2_31d5c120-90a9-409d-8f48-a3463c35f58e"
    }
  ]
}
```
