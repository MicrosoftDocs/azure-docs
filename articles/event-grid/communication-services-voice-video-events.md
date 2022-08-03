---
title: Azure Communication Services - Voice and video calling events
description: This article describes how to use Azure Communication Services as an Event Grid event source for voice and video calling Events.
ms.topic: conceptual
ms.date: 10/15/2021
ms.author: vikramdh
---

# Azure Communication Services - Voice and video calling events

This article provides the properties and schema for communication services voice and video calling events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md).

## Events types

Azure Communication Services emits the following voice and video calling event types:

| Event type                                                  | Description                                                                                    |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Microsoft.Communication.RecordingFileStatusUpdated | Published when recording file is available |
| Microsoft.Communication.CallStarted | Published when call is started  |
| Microsoft.Communication.CallEnded   | Published when call is ended  |
| Microsoft.Communication.CallParticipantAdded | Published when participant is added  |
| Microsoft.Communication.CallParticipantRemoved | Published when participant is removed  |

## Event responses

When an event is triggered, the Event Grid service sends data about that event to subscribing endpoints.

This section contains an example of what that data would look like for each event.

> [!IMPORTANT]
> Call Recording feature is still in a Public Preview

### Microsoft.Communication.RecordingFileStatusUpdated

```json
[
 {
  "id": "7283825e-f8f1-4c61-a9ea-752c56890500",
  "topic": "/subscriptions/{subscription-id}/resourcegroups/}{group-name}/providers/microsoft.communication/communicationservices/{communication-services-resource-name}",
  "subject": "/recording/call/{call-id}/recordingId/{recording-id}",
  "data": {
    "recordingStorageInfo": {
      "recordingChunks": [
        {
          "documentId": "0-eus-d12-801b3f3fc462fe8a01e6810cbff729b8",
          "index": 0,
          "endReason": "SessionEnded",
          "contentLocation": "https://storage.asm.skype.com/v1/objects/0-eus-d12-801b3f3fc462fe8a01e6810cbff729b8/content/video",
          "metadataLocation": "https://storage.asm.skype.com/v1/objects/0-eus-d12-801b3f3fc462fe8a01e6810cbff729b8/content/acsmetadata"
        }
      ]
    },
    "recordingStartTime": "2021-07-27T15:20:23.6089755Z",
    "recordingDurationMs": 6620,
    "sessionEndReason": "CallEnded"
  },
  "eventType": "Microsoft.Communication.RecordingFileStatusUpdated",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2021-07-27T15:20:34.2199328Z"
 }
]
```

[!INCLUDE [Public Preview](../communication-services/includes/public-preview-include-document.md)]

### Microsoft.Communication.CallStarted

```json
[
  {
    "id": "a8bcd8a3-12d7-46ba-8cde-f6d0bda8feeb",
    "topic": "/subscriptions/{subscription-id}/resourcegroups/{group-name}/providers/microsoft.communication/communicationservices/{communication-services-resource-name}",
    "subject": "call/{serverCallId}/startedBy/8:acs:bc360ba8-d29b-4ef2-b698-769ebef85521_0000000c-1fb9-4878-07fd-0848220077e1",
    "data": {
      "startedBy": {
        "rawId": "8:acs:bc360ba8-d29b-4ef2-b698-769ebef85521_0000000c-1fb9-4878-07fd-0848220077e1",
        "communicationUser": {
          "id": "8:acs:bc360ba8-d29b-4ef2-b698-769ebef85521_0000000c-1fb9-4878-07fd-0848220077e1"
        }
      },
      "serverCallId": "{serverCallId}",
      "group": {
        "id": "00000000-0000-0000-0000-000000000000"
      },
      "isTwoParty": true
    },
    "eventType": "Microsoft.Communication.CallStarted",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-09-22T17:02:38.6905856Z"
  }
]
```

### Microsoft.Communication.CallEnded

```json
[
  {
    "id": "530183db-987b-4a3a-b6c1-3391bab12864",
    "topic": "/subscriptions/{subscription-id}/resourcegroups/{group-name}/providers/microsoft.communication/communicationservices/{communication-services-resource-name}",
    "subject": "call/{serverCallId}",
    "data": {
      "durationOfCall": 49.728617199999995,
      "startedBy": {
        "rawId": "8:acs:bc360ba8-d29b-4ef2-b698-769ebef85521_0000000c-1fb9-4878-07fd-0848220077e1",
        "communicationUser": {
          "id": "8:acs:bc360ba8-d29b-4ef2-b698-769ebef85521_0000000c-1fb9-4878-07fd-0848220077e1"
        }
      },
      "serverCallId": "{serverCallId}",
      "group": {
        "id": "00000000-0000-0000-0000-000000000000"
      },
      "isTwoParty": true
    },
    "eventType": "Microsoft.Communication.CallEnded",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-09-22T17:03:12.6143005Z"
  }

]
```

### Microsoft.Communication.CallParticipantAdded

```json
[
  {
    "id": "615adcbd-23b2-4563-aba7-9d1b424d3d38",
    "topic": "/subscriptions/{subscription-id}/resourcegroups/{group-name}/providers/microsoft.communication/communicationservices/{communication-services-resource-name}",
    "subject": "call/{serverCallId}/participant/8:acs:bc360ba8-d29b-4ef2-b698-769ebef85521_0000000c-1fb9-4878-07fd-0848220077e1",
    "data": {
      "user": {
        "rawId": "8:acs:bc360ba8-d29b-4ef2-b698-769ebef85521_0000000c-1fb9-4878-07fd-0848220077e1",
        "communicationUser": {
          "id": "8:acs:bc360ba8-d29b-4ef2-b698-769ebef85521_0000000c-1fb9-4878-07fd-0848220077e1"
        }
      },
      "displayName": "Sharif Edge",
      "participantId": "041e3b8a-1cce-4ebf-b587-131312c39410",
      "endpointType": "acs-web-test-client-ACSWeb(3617/1.0.0.0/os=windows; browser=chrome; browserVer=93.0; deviceType=Desktop)/TsCallingVersion=_TS_BUILD_VERSION_/Ovb=_TS_OVB_VERSION_",
      "startedBy": {
        "rawId": "8:acs:bc360ba8-d29b-4ef2-b698-769ebef85521_0000000c-1fb9-4878-07fd-0848220077e1",
        "communicationUser": {
          "id": "8:acs:bc360ba8-d29b-4ef2-b698-769ebef85521_0000000c-1fb9-4878-07fd-0848220077e1"
        }
      },
      "serverCallId": "{serverCallId}",
      "group": {
        "id": "00000000-0000-0000-0000-000000000000"
      },
      "isTwoParty": true
    },
    "eventType": "Microsoft.Communication.CallParticipantAdded",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-09-22T17:02:39.2843314Z"
  }
]
```
### Microsoft.Communication.CallParticipantRemoved

```json
[
  {
    "id": "7b2307f3-57ec-4257-85a1-8ce654534ea9",
    "topic": "/subscriptions/{subscription-id}/resourcegroups/{group-name}/providers/microsoft.communication/communicationservices/{communication-services-resource-name}",
    "subject": "call/aHR0cHM6Ly9jb252LWRldi0yMS5jb252LWRldi5za3lwZS5uZXQ6NDQzL2NvbnYvbVQ4NnVfempBMG05QVM4VnRvSWFrdz9pPTAmZT02Mzc2Nzc3MTc2MDAwMjgyMzA/participant/8:acs:bc360ba8-d29b-4ef2-b698-769ebef85521_0000000c-1fb9-27cc-07fd-0848220077d8",
    "data": {
      "user": {
        "rawId": "8:acs:bc360ba8-d29b-4ef2-b698-769ebef85521_0000000c-1fb9-27cc-07fd-0848220077d8",
        "communicationUser": {
          "id": "8:acs:bc360ba8-d29b-4ef2-b698-769ebef85521_0000000c-1fb9-27cc-07fd-0848220077d8"
        }
      },
      "displayName": "Sharif Chrome",
      "participantId": "750a1442-3156-4914-94d2-62cf73796833",
      "endpointType": "acs-web-test-client-ACSWeb(3617/1.0.0.0/os=windows; browser=chrome; browserVer=93.0; deviceType=Desktop)/TsCallingVersion=_TS_BUILD_VERSION_/Ovb=_TS_OVB_VERSION_",
      "startedBy": {
        "rawId": "8:acs:bc360ba8-d29b-4ef2-b698-769ebef85521_0000000c-1fb9-4878-07fd-0848220077e1",
        "communicationUser": {
          "id": "8:acs:bc360ba8-d29b-4ef2-b698-769ebef85521_0000000c-1fb9-4878-07fd-0848220077e1"
        }
      },
      "serverCallId": "aHR0cHM6Ly9jb252LWRldi0yMS5jb252LWRldi5za3lwZS5uZXQ6NDQzL2NvbnYvbVQ4NnVfempBMG05QVM4VnRvSWFrdz9pPTAmZT02Mzc2Nzc3MTc2MDAwMjgyMzA",
      "group": {
        "id": "00000000-0000-0000-0000-000000000000"
      },
      "isTwoParty": false
    },
    "eventType": "Microsoft.Communication.CallParticipantRemoved",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-09-22T17:28:41.1497652Z"
  }
]
```

## Limitations
Calling events are only available for ACS VoIP users. PSTN, bots, echo bot and Teams users events are excluded.
No calling events will be available for ACS - Teams meeting interop call.





