---
title: Azure Communication Services - Voice and video calling events
description: This article describes how to use Azure Communication Services as an Event Grid event source for voice and video calling Events.
ms.topic: conceptual
ms.date: 12/02/2022
author: VikramDhumal
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
| Microsoft.Communication.IncomingCall | Published when there is an incoming call  |

## Event responses

When an event is triggered, the Event Grid service sends data about that event to subscribing endpoints.

This section contains an example of what that data would look like for each event.

### Microsoft.Communication.RecordingFileStatusUpdated

```json
[
 {
  "id": "7283825e-f8f1-4c61-a9ea-752c56890500",
  "topic": "/subscriptions/{subscription-id}/resourcegroups/{group-name}/providers/microsoft.communication/communicationservices/{communication-services-resource-name}",
  "subject": "/recording/call/{call-id}/serverCallId/{server-call-id}/recordingId/{recording-id}",
  "data": {
    "recordingStorageInfo": {
      "recordingChunks": [
        {
          "documentId": "0-eus-d12-801b3f3fc462fe8a01e6810cbff729b8",
          "index": 0,
          "endReason": "SessionEnded",
          "contentLocation": "https://storage.asm.skype.com/v1/objects/0-eus-d12-801b3f3fc462fe8a01e6810cbff729b8/content/video",
          "metadataLocation": "https://storage.asm.skype.com/v1/objects/0-eus-d12-801b3f3fc462fe8a01e6810cbff729b8/content/acsmetadata",
	  "deleteLocation": "https://us-storage.asm.skype.com/v1/objects/0-eus-d1-83e9599991e21ad21220427d78fbf558"
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
        "communicationIdentifier": {
          "rawId": "8:acs:bc360ba8-d29b-4ef2-b698-769ebef85521_0000000c-1fb9-4878-07fd-0848220077e1",
          "communicationUser": {
            "id": "8:acs:bc360ba8-d29b-4ef2-b698-769ebef85521_0000000c-1fb9-4878-07fd-0848220077e1"
          }
        },
        "role": "{role}"
      },
      "serverCallId": "{serverCallId}",
      "group": {
        "id": "00000000-0000-0000-0000-000000000000"
      },
      "room": {
        "id": "{roomId}"
      },
      "isTwoParty": false,
      "correlationId": "{correlationId}",
      "isRoomsCall": true
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
        "communicationIdentifier": {
          "rawId": "8:acs:bc360ba8-d29b-4ef2-b698-769ebef85521_0000000c-1fb9-4878-07fd-0848220077e1",
          "communicationUser": {
            "id": "8:acs:bc360ba8-d29b-4ef2-b698-769ebef85521_0000000c-1fb9-4878-07fd-0848220077e1"
          }
        },
        "role": "{role}"
      },
      "serverCallId": "{serverCallId}",
      "group": {
        "id": "00000000-0000-0000-0000-000000000000"
      },
      "room": {
        "id": "{roomId}"
      },
      "isTwoParty": false,
      "correlationId": "{correlationId}",
      "isRoomsCall": true
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
        "communicationIdentifier": {
          "rawId": "8:acs:bc360ba8-d29b-4ef2-b698-769ebef85521_0000000c-1fb9-4878-07fd-0848220077e1",
          "communicationUser": {
            "id": "8:acs:bc360ba8-d29b-4ef2-b698-769ebef85521_0000000c-1fb9-4878-07fd-0848220077e1"
          }
        },
        "role": "{role}"
      },
      "displayName": "Sharif Edge",
      "participantId": "041e3b8a-1cce-4ebf-b587-131312c39410",
      "endpointType": "acs-web-test-client-ACSWeb(3617/1.0.0.0/os=windows; browser=chrome; browserVer=93.0; deviceType=Desktop)/TsCallingVersion=_TS_BUILD_VERSION_/Ovb=_TS_OVB_VERSION_",
      "startedBy": {
        "communicationIdentifier": {
          "rawId": "8:acs:bc360ba8-d29b-4ef2-b698-769ebef85521_0000000c-1fb9-4878-07fd-0848220077e1",
          "communicationUser": {
            "id": "8:acs:bc360ba8-d29b-4ef2-b698-769ebef85521_0000000c-1fb9-4878-07fd-0848220077e1"
          }
        },
        "role": "{role}"
      },
      "serverCallId": "{serverCallId}",
      "group": {
        "id": "00000000-0000-0000-0000-000000000000"
      },
      "room": {
        "id": "{roomId}"
      },
      "isTwoParty": false,
      "correlationId": "{correlationId}",
      "isRoomsCall": true
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
        "communicationIdentifier": {
          "rawId": "8:acs:bc360ba8-d29b-4ef2-b698-769ebef85521_0000000c-1fb9-27cc-07fd-0848220077d8",
          "communicationUser": {
            "id": "8:acs:bc360ba8-d29b-4ef2-b698-769ebef85521_0000000c-1fb9-27cc-07fd-0848220077d8"
          }
        },
        "role": "{role}"
      },
      "displayName": "Sharif Chrome",
      "participantId": "750a1442-3156-4914-94d2-62cf73796833",
      "endpointType": "acs-web-test-client-ACSWeb(3617/1.0.0.0/os=windows; browser=chrome; browserVer=93.0; deviceType=Desktop)/TsCallingVersion=_TS_BUILD_VERSION_/Ovb=_TS_OVB_VERSION_",
      "startedBy": {
        "communicationIdentifier": {
          "rawId": "8:acs:bc360ba8-d29b-4ef2-b698-769ebef85521_0000000c-1fb9-4878-07fd-0848220077e1",
          "communicationUser": {
            "id": "8:acs:bc360ba8-d29b-4ef2-b698-769ebef85521_0000000c-1fb9-4878-07fd-0848220077e1"
          }
        },
        "role": "{role}"
      },
      "serverCallId": "aHR0cHM6Ly9jb252LWRldi0yMS5jb252LWRldi5za3lwZS5uZXQ6NDQzL2NvbnYvbVQ4NnVfempBMG05QVM4VnRvSWFrdz9pPTAmZT02Mzc2Nzc3MTc2MDAwMjgyMzA",
      "group": {
        "id": "00000000-0000-0000-0000-000000000000"
      },
      "room": {
        "id": "{roomId}"
      },
      "isTwoParty": false,
      "correlationId": "{correlationId}",
      "isRoomsCall": true
    },
    "eventType": "Microsoft.Communication.CallParticipantRemoved",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-09-22T17:28:41.1497652Z"
  }
]
```

### Microsoft.Communication.IncomingCall

```json
[
  {
    "id": "d5546be8-227a-4db8-b2c3-4f06fd675fd6",
    "topic": "/subscriptions/{subscription-id}/resourcegroups/{group-name}/providers/microsoft.communication/communicationservices/{communication-services-resource-name}",
    "subject": "/caller/8:acs:98e4cbef-70e7-4733-8594-063c4a72d711_00000014-2033-438d-1000-343a0d006e10/recipient/8:acs:98e4cbef-70e7-4733-8594-063c4a72d711_00000014-1889-f3a7-6a0b-343a0d0061f3",
    "data": {
	  "to": {
       "kind": "communicationUser",
        "rawId": "8:acs:98e4cbef-70e7-4733-8594-063c4a72d711_00000014-1889-f3a7-6a0b-343a0d0061f3",
        "communicationUser": {
          "id": "8:acs:98e4cbef-70e7-4733-8594-063c4a72d711_00000014-1889-f3a7-6a0b-343a0d0061f3"
        }
	  },
      "from": {
        "kind": "communicationUser",
        "rawId": "8:acs:98e4cbef-70e7-4733-8594-063c4a72d711_00000014-2033-438d-1000-343a0d006e10",
        "communicationUser": {
          "id": "8:acs:98e4cbef-70e7-4733-8594-063c4a72d711_00000014-2033-438d-1000-343a0d006e10"
		  }
      },
      "serverCallId": "tob2JIV0wzOHdab3dWcGVWZmsrL2QxYVZnQ2U1bVVLQTh1T056YmpvdXdnQjNzZTlnTEhjNFlYem5BVU9nRGY5dUFQ",
      "callerDisplayName": "John Doe",
      "incomingCallContext": "eyJhbGciOiJub25lIiwidHliSldUIn0.eyJjYyI6Ikg0c0lBQi9iT0JiOUs0SVhtQS9UMGhJbFVaUUlHQVBIc1J1M1RlbzgyNW4xcmtHJNa2hCNVVTQkNUbjFKTVo1NCt3ZDk1WFY0ZnNENUg0VDV2dk5VQ001NWxpRkpJb0pDUWlXS0F3OTJRSEVwUWo4aFFleDl4ZmxjRi9lMTlaODNEUmN6QUpvMVRWVXoxK1dWYm1lNW5zNmF5cFRyVGJ1KzMxU3FMY3E1SFhHWHZpc3FWd2kwcUJWSEhta0xjVFJEQ0hlSjNhdzA5MHE2T0pOaFNqS0pFdXpCcVdidzRoSmJGMGtxUkNaOFA4T3VUMTF0MzVHN0kvS0w3aVQyc09aS2F0NHQ2cFV5d0UwSUlEYm4wQStjcGtiVjlUK0E4SUhLZ2JKUjc1Vm8vZ0hFZGtRT3RCYXl1akc4cUt2U1dITFFCR3JFYjJNY3RuRVF0TEZQV1JEUzJHMDk3TGU5VnhhTktob2JIV0wzOHdab3dWcGVWZmsrL2QxYVZnQ2U1bVVLQTh1T056YmpvdXdnQjNzZTlnTEhjNFlYem5BVU9nRGY5dUFQMndsMXA0WU5nK1cySVRxSEtZUzJDV25IcEUySkhVZzd2UnVHOTBsZ081cU81MngvekR0OElYWHBFSi9peUxtNkdibmR1eEdZREozRXNWWXh4ZzZPd1hqc0pCUjZvR1U3NDIrYTR4M1RpQXFaV245UVIrMHNaVDg3YXpRQzbDNUR3BuZFhST1FTMVRTRzVVTkRGeU5UVjNORTFHU2kxck1UTk9VMUF0TWtWNVNreFRUVVI0YlMxRk1VdEVabnBRTjFsQ1EwWkVlVTQxZURCc1IyaHljVTVYTFROeWVTMVJNVjgyVFhrdGRFNUJZV3hrZW5SSVUwMTFVVE5GWkRKUkluMTlmUS5hMTZ0eXdzTDhuVHNPY1RWa2JnV3FPbTRncktHZmVMaC1KNjZUZXoza0JWQVJmYWYwOTRDWDFJSE5tUXRJeDN1TWk2aXZ3QXFFQWV1UlNGTjhlS3gzWV8yZXppZUN5WDlaSHp6Q1ZKemdZUVprc0RjYnprMGJoR09laWkydkpEMnlBMFdyUW1SeGFxOGZUM25EOUQ1Z1ZSUVczMGRheGQ5V001X1ZuNFNENmxtLVR5TUSVEifQ.",
      "correlationId": "d732db64-4803-462d-be9c-518943ea2b7a"
    },
    "eventType": "Microsoft.Communication.IncomingCall",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2022-08-25T19:27:24.2415391Z"
  }
]
```

## Limitations
Aside from `IncomingCall`, Calling events are only available for Azure Communication Services VoIP users. PSTN, bots, echo bot and Teams users events are excluded.
No calling events will be available for Azure Communication Services - Teams meeting interop call.

`IncomingCall` events have support for Azure Communication Services VoIP users and PSTN numbers. For more details on which scenarios can trigger `IncomingCall` events, see the following [Incoming call concepts](../communication-services/concepts/call-automation/incoming-call-notification.md) documentation. 

## Next steps
See the following tutorial: [Quickstart: Handle voice and video calling events](../communication-services/quickstarts/voice-video-calling/handle-calling-events.md).



