---
title: Azure Communication Services - Chat events
description: This article describes how to use Azure Communication Services as an Event Grid event source for chat Events.
ms.topic: conceptual
ms.date: 10/15/2021
author: VikramDhumal
ms.author: vikramdh
---

# Azure Communication Services - Chat events
This article provides the properties and schema for communication services chat events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md). These events are emitted for Azure Communication Services chats and Teams meeting chats.

Azure Communication Services emits chat events only when Azure Communication Services users are part of the meeting. Once all Azure Communication Services users leave the meeting, the communication services resource does not emit chat events.

## Event types

Azure Communication Services emits the following chat event types:

| Event type                                                  | Description                                                                                    |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Microsoft.Communication.ChatMessageReceived                 | Published when a message is received for a user in a chat thread that she is member of.        |
| Microsoft.Communication.ChatMessageEdited                   | Published when a message is edited in a chat thread that the user is member of.                |
| Microsoft.Communication.ChatMessageDeleted                  | Published when a message is deleted in a chat thread that the user is member of.               |
| Microsoft.Communication.ChatThreadCreatedWithUser           | Published when the user is added as member at the time of creation of a chat thread.           |
| Microsoft.Communication.ChatThreadWithUserDeleted           | Published when a chat thread is deleted which the user is member of.                           |
| Microsoft.Communication.ChatThreadPropertiesUpdatedPerUser  | Published when a chat thread's properties are updated that the user is member of.              |
| Microsoft.Communication.ChatParticipantAddedToThreadWithUser|  Published for a user when a new  participant is added to a chat thread, that the user is part of.|
| Microsoft.Communication.ChatParticipantRemovedFromThreadWithUser |  Published for a user when a participant is removed from a chat thread, that the user is part of. |
| Microsoft.Communication.ChatThreadCreated  | Published when a chat thread is created  |
| Microsoft.Communication.ChatThreadDeleted| Published when a chat thread is deleted  |
| Microsoft.Communication.ChatThreadParticipantAdded | Published when a new participant is added to a chat thread  |
| Microsoft.Communication.ChatThreadParticipantRemoved | Published when a new participant is added to a chat thread.  |  
| Microsoft.Communication.ChatMessageReceivedInThread | Published when a message is received in a chat thread  |    
| Microsoft.Communication.ChatThreadPropertiesUpdated| Published when a chat thread's properties like topic are updated.|    
| Microsoft.Communication.ChatMessageEditedInThread | Published when a message is edited in a chat thread |  
| Microsoft.Communication.ChatMessageDeletedInThread | Published when a message is deleted in  a chat thread  |  

## Event responses

When an event is triggered, the Event Grid service sends data about that event to subscribing endpoints.

This section contains an example of what that data would look like for each event.

### Microsoft.Communication.ChatMessageReceived event

```json
[{
    "id": "02272459-badb-4e2e-b538-4cb8a2f71da6",
    "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
    "subject": "thread/{thread-id}/sender/{rawId}/recipient/{rawId}",
    "data": {
      "messageBody": "Welcome to Azure Communication Services",
      "messageId": "1613694358927",
      "metadata": {
        "key": "value",
        "description": "A map of data associated with the message"
      },
      "senderId": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-578d-7caf-07fd-084822001724",
      "senderCommunicationIdentifier": {
        "rawId": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-578d-7caf-07fd-084822001724",
        "communicationUser": {
          "id": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-578d-7caf-07fd-084822001724"
        }
      },
      "senderDisplayName": "Bob(Admin)",
      "composeTime": "2021-02-19T00:25:58.927Z",
      "type": "Text",
      "version": 1613694358927,
      "recipientId": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-578d-7d05-83fe-084822000f6d",
      "recipientCommunicationIdentifier": {
        "rawId": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-578d-7d05-83fe-084822000f6d",
        "communicationUser": {
          "id": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-578d-7d05-83fe-084822000f6d"
        }
      },
      "transactionId": "oh+LGB2dUUadMcTAdRWQxQ.1.1.1.1.1827536918.1.7",
      "threadId": "19:6e5d6ca1d75044a49a36a7965ec4a906@thread.v2"
    },
    "eventType": "Microsoft.Communication.ChatMessageReceived",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-02-19T00:25:59.9436666Z"
  }
]
```

### Microsoft.Communication.ChatMessageEdited event

```json
[{
    "id": "93fc1037-b645-4eb0-a0f2-d7bb3ba6e060",
    "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
    "subject": "thread/{thread-id}/sender/{rawId}/recipient/{rawId}",
    "data": {
      "editTime": "2021-02-19T00:28:20.784Z",
      "messageBody": "Let's Chat about new communication services.",
      "messageId": "1613694357917",
      "metadata": {
        "key": "value",
        "description": "A map of data associated with the message"
      },
      "senderId": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-578d-7caf-07fd-084822001724",
      "senderCommunicationIdentifier": {
        "rawId": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-578d-7caf-07fd-084822001724",
        "communicationUser": {
          "id": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-578d-7caf-07fd-084822001724"
        }
      },
      "senderDisplayName": "Bob(Admin)",
      "composeTime": "2021-02-19T00:25:57.917Z",
      "type": "Text",
      "version": 1613694500784,
      "recipientId": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-578d-7d60-83fe-084822000f6f",
      "recipientCommunicationIdentifier": {
        "rawId": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-578d-7d60-83fe-084822000f6f",
        "communicationUser": {
          "id": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-578d-7d60-83fe-084822000f6f"
        }
      },
      "transactionId": "1mL4XZH2gEecu/alk9tOtw.2.1.2.1.1833042153.1.7",
      "threadId": "19:6e5d6ca1d75044a49a36a7965ec4a906@thread.v2"
    },
    "eventType": "Microsoft.Communication.ChatMessageEdited",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-02-19T00:28:21.7456718Z"
  }]
```

### Microsoft.Communication.ChatMessageDeleted event
```json
[{
    "id": "23cfcc13-33f2-4ae1-8d23-b5015b05302b",
    "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
    "subject": "thread/{thread-id}/sender/{rawId}/recipient/{rawId}",
    "data": {
      "deleteTime": "2021-02-19T00:43:10.14Z",
      "messageId": "1613695388152",
      "senderId": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-578d-7d07-83fe-084822000f6e",
      "senderCommunicationIdentifier": {
        "rawId": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-578d-7d07-83fe-084822000f6e",
        "communicationUser": {
          "id": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-578d-7d07-83fe-084822000f6e"
        }
      },
      "senderDisplayName": "Bob(Admin)",
      "composeTime": "2021-02-19T00:43:08.152Z",
      "type": "Text",
      "version": 1613695390361,
      "recipientId": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-578d-7d60-83fe-084822000f6f",
      "recipientCommunicationIdentifier": {
        "rawId": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-578d-7d60-83fe-084822000f6f",
        "communicationUser": {
          "id": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-578d-7d60-83fe-084822000f6f"
        }
      },
      "transactionId": "fFs4InlBn0O/0WyhfQZVSQ.1.1.2.1.1867776045.1.4",
      "threadId": "19:48899258eec941e7a281e03edc8f4964@thread.v2"
    },
    "eventType": "Microsoft.Communication.ChatMessageDeleted",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-02-19T00:43:10.9982947Z"
  }]
```

### Microsoft.Communication.ChatThreadCreatedWithUser event

```json
[{
    "id": "eba02b2d-37bf-420e-8656-3a42ef74c435",
    "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
    "subject": "thread/{thread-id}/createdBy/rawId/recipient/rawId",
    "data": {
      "createdBy": "8:acs:3d703c91-9657-4b3f-b19c-ef9d53f99710_00000008-576c-286d-e1fe-0848220013b9",
      "createdByCommunicationIdentifier": {
        "rawId": "8:acs:3d703c91-9657-4b3f-b19c-ef9d53f99710_00000008-576c-286d-e1fe-0848220013b9",
        "communicationUser": {
          "id": "8:acs:3d703c91-9657-4b3f-b19c-ef9d53f99710_00000008-576c-286d-e1fe-0848220013b9"
        }
      },
      "properties": {
        "topic": "Chat about new communication services"
      },
      "members": [
        {
          "displayName": "Bob",
          "memberId": "8:acs:3d703c91-9657-4b3f-b19c-ef9d53f99710_00000008-576c-286d-e1fe-0848220013b9"
        },
        {
          "displayName": "John",
          "memberId": "8:acs:3d703c91-9657-4b3f-b19c-ef9d53f99710_00000008-576c-289b-07fd-0848220015ea"
        }
      ],
      "participants": [
        {
          "displayName": "Bob",
          "participantCommunicationIdentifier": {
            "rawId": "8:acs:3d703c91-9657-4b3f-b19c-ef9d53f99710_00000008-576c-286d-e1fe-0848220013b9",
            "communicationUser": {
              "id": "8:acs:3d703c91-9657-4b3f-b19c-ef9d53f99710_00000008-576c-286d-e1fe-0848220013b9"
            }
          }
        },
        {
          "displayName": "John",
          "participantCommunicationIdentifier": {
            "rawId": "8:acs:3d703c91-9657-4b3f-b19c-ef9d53f99710_00000008-576c-289b-07fd-0848220015ea",
            "communicationUser": {
              "id": "8:acs:3d703c91-9657-4b3f-b19c-ef9d53f99710_00000008-576c-289b-07fd-0848220015ea"
            }
          }
        }
      ],
      "createTime": "2021-02-18T23:47:26.91Z",
      "version": 1613692046910,
      "recipientId": "8:acs:3d703c91-9657-4b3f-b19c-ef9d53f99710_00000008-576c-286e-84f5-08482200181c",
      "recipientCommunicationIdentifier": {
        "rawId": "8:acs:3d703c91-9657-4b3f-b19c-ef9d53f99710_00000008-576c-286e-84f5-08482200181c",
        "communicationUser": {
          "id": "8:acs:3d703c91-9657-4b3f-b19c-ef9d53f99710_00000008-576c-286e-84f5-08482200181c"
        }
      },
      "transactionId": "zbZt+9h/N0em+XCW2QvyIA.1.1.1.1.1737228330.0.1737490483.1.6",
      "threadId": "19:1d594fb1eeb14566903cbc5decb5bf5b@thread.v2"
    },
    "eventType": "Microsoft.Communication.ChatThreadCreatedWithUser",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-02-18T23:47:34.7437103Z"
  }]
```

### Microsoft.Communication.ChatThreadWithUserDeleted event

```json
[{
    "id": "f5d6750c-c6d7-4da8-bb05-6f3fca6c7295",
    "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
    "subject": "thread/{thread-id}/deletedBy/{rawId}/recipient/{rawId}",
    "data": {
      "deletedBy": "8:acs:3d703c91-9657-4b3f-b19c-ef9d53f99710_00000008-5772-6473-83fe-084822000e21",
      "deletedByCommunicationIdentifier": {
        "rawId": "8:acs:3d703c91-9657-4b3f-b19c-ef9d53f99710_00000008-5772-6473-83fe-084822000e21",
        "communicationUser": {
          "id": "8:acs:3d703c91-9657-4b3f-b19c-ef9d53f99710_00000008-5772-6473-83fe-084822000e21"
        }
      },
      "deleteTime": "2021-02-18T23:57:51.5987591Z",
      "createTime": "2021-02-18T23:54:15.683Z",
      "version": 1613692578672,
      "recipientId": "8:acs:3d703c91-9657-4b3f-b19c-ef9d53f99710_00000008-5772-647b-e1fe-084822001416",
      "recipientCommunicationIdentifier": {
        "rawId": "8:acs:3d703c91-9657-4b3f-b19c-ef9d53f99710_00000008-5772-647b-e1fe-084822001416",
        "communicationUser": {
          "id": "8:acs:3d703c91-9657-4b3f-b19c-ef9d53f99710_00000008-5772-647b-e1fe-084822001416"
        }
      },
      "transactionId": "mrliWVUndEmLwkZbeS5KoA.1.1.2.1.1761607918.1.6",
      "threadId": "19:5870b8f021d74fd786bf5aeb095da291@thread.v2"
    },
    "eventType": "Microsoft.Communication.ChatThreadWithUserDeleted",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-02-18T23:57:52.1597234Z"
  }]
```

### Microsoft.Communication.ChatParticipantAddedToThreadWithUser  event 
```json
[{
    "id": "049a5a7f-6cd7-43c1-b352-df9e9e6146d1",
    "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
    "subject": "thread/{thread-id}/participantAdded/{rawId}/recipient/{rawId}",
    "data": {
      "time": "2021-02-25T06:37:29.9232485Z",
      "addedByCommunicationIdentifier": {
        "rawId": "8:acs:0a420b29-555c-4f6b-841e-de8059893bb9_00000008-77c9-8767-1655-373a0d00885d",
        "communicationUser": {
          "id": "8:acs:0a420b29-555c-4f6b-841e-de8059893bb9_00000008-77c9-8767-1655-373a0d00885d"
        }
      },
      "participantAdded": {
        "displayName": "John Smith",
        "participantCommunicationIdentifier": {
          "rawId": "8:acs:0a420b29-555c-4f6b-841e-de8059893bb9_00000008-77c9-8785-1655-373a0d00885f",
          "communicationUser": {
            "id": "8:acs:0a420b29-555c-4f6b-841e-de8059893bb9_00000008-77c9-8785-1655-373a0d00885f"
          }
        }
      },
      "recipientCommunicationIdentifier": {
        "rawId": "8:acs:0a420b29-555c-4f6b-841e-de8059893bb9_00000008-77c9-8781-1655-373a0d00885e",
        "communicationUser": {
          "id": "8:acs:0a420b29-555c-4f6b-841e-de8059893bb9_00000008-77c9-8781-1655-373a0d00885e"
        }
      },
      "createTime": "2021-02-25T06:37:17.371Z",
      "version": 1614235049907,
      "transactionId": "q7rr9by6m0CiGiQxKdSO1w.1.1.1.1.1473446055.1.6",
      "threadId": "19:f1400e1c542f4086a606b52ad20cd0bd@thread.v2"
    },
    "eventType": "Microsoft.Communication.ChatParticipantAddedToThreadWithUser",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-02-25T06:37:31.4880091Z"
  }]
```

### Microsoft.Communication.ChatParticipantRemovedFromThreadWithUser event 
```json
[{
    "id": "e8a4df24-799d-4c53-94fd-1e05703a4549",
    "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
    "subject": "thread/{thread-id}/participantRemoved/{rawId}/recipient/{rawId}",
    "data": {
      "time": "2021-02-25T06:40:20.3564556Z",
      "removedByCommunicationIdentifier": {
        "rawId": "8:acs:0a420b29-555c-4f6b-841e-de8059893bb9_00000008-77c9-8767-1655-373a0d00885d",
        "communicationUser": {
          "id": "8:acs:0a420b29-555c-4f6b-841e-de8059893bb9_00000008-77c9-8767-1655-373a0d00885d"
        }
      },
      "participantRemoved": {
        "displayName": "Bob",
        "participantCommunicationIdentifier": {
          "rawId": "8:acs:0a420b29-555c-4f6b-841e-de8059893bb9_00000008-77c9-8785-1655-373a0d00885f",
          "communicationUser": {
            "id": "8:acs:0a420b29-555c-4f6b-841e-de8059893bb9_00000008-77c9-8785-1655-373a0d00885f"
          }
        }
      },
      "recipientCommunicationIdentifier": {
        "rawId": "8:acs:0a420b29-555c-4f6b-841e-de8059893bb9_00000008-77c9-8781-1655-373a0d00885e",
        "communicationUser": {
          "id": "8:acs:0a420b29-555c-4f6b-841e-de8059893bb9_00000008-77c9-8781-1655-373a0d00885e"
        }
      },
      "createTime": "2021-02-25T06:37:17.371Z",
      "version": 1614235220325,
      "transactionId": "usv74GQ5zU+JmWv/bQ+qfg.1.1.1.1.1480065078.1.5",
      "threadId": "19:f1400e1c542f4086a606b52ad20cd0bd@thread.v2"
    },
    "eventType": "Microsoft.Communication.ChatParticipantRemovedFromThreadWithUser",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-02-25T06:40:24.2244945Z"
  }]
```

### Microsoft.Communication.ChatThreadPropertiesUpdatedPerUser event

```json
[{
    "id": "d57342ff-264e-4a5e-9c54-ef05b7d50082",
    "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
    "subject": "thread/{thread-id}/editedBy/{rawId}/recipient/{rawId}",
    "data": {
      "editedBy": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-578d-7d07-83fe-084822000f6e",
      "editedByCommunicationIdentifier": {
        "rawId": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-578d-7d07-83fe-084822000f6e",
        "communicationUser": {
          "id": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-578d-7d07-83fe-084822000f6e"
        }
      },
      "editTime": "2021-02-19T00:28:28.7390282Z",
      "properties": {
        "topic": "Communication in Azure"
      },
      "createTime": "2021-02-19T00:28:25.864Z",
      "version": 1613694508719,
      "recipientId": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-578d-7caf-07fd-084822001724",
      "recipientCommunicationIdentifier": {
        "rawId": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-578d-7caf-07fd-084822001724",
        "communicationUser": {
          "id": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-578d-7caf-07fd-084822001724"
        }
      },
      "transactionId": "WLXPrnJ/I0+LTj2cwMrNMQ.1.1.1.1.1833369763.1.4",
      "threadId": "19:2cc3504c41244d7483208a4f58a1f188@thread.v2"
    },
    "eventType": "Microsoft.Communication.ChatThreadPropertiesUpdatedPerUser",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-02-19T00:28:29.559726Z"
  }]
```

### Microsoft.Communication.ChatThreadCreated event

```json
[ {
    "id": "a607ac52-0974-4d3c-bfd8-6f708a26f509",
    "topic": "/subscriptions/{subscription-id}/resourcegroups/{group-name}/providers/microsoft.communication/communicationservices/{communication-services-resource-name}",
    "subject": "thread/{thread-id}/createdBy/{rawId}",
    "data": {
      "createdByCommunicationIdentifier": {
        "rawId": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-5cbb-38a0-88f7-084822002453",
        "communicationUser": {
          "id": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-5cbb-38a0-88f7-084822002453"
        }
      },
      "properties": {
        "topic": "Talk about new Thread Events in communication services"
      },
      "participants": [
        {
          "displayName": "Bob",
          "participantCommunicationIdentifier": {
            "rawId": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-5cbb-38a0-88f7-084822002453",
            "communicationUser": {
              "id": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-5cbb-38a0-88f7-084822002453"
            }
          }
        },
        {
          "displayName": "Scott",
          "participantCommunicationIdentifier": {
            "rawId": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-5cbb-38e6-07fd-084822002467",
            "communicationUser": {
              "id": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-5cbb-38e6-07fd-084822002467"
            }
          }
        },
        {
          "displayName": "Shawn",
          "participantCommunicationIdentifier": {
            "rawId": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-5cbb-38f6-83fe-084822002337",
            "communicationUser": {
              "id": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-5cbb-38f6-83fe-084822002337"
            }
          }
        },
        {
          "displayName": "Anthony",
          "participantCommunicationIdentifier": {
            "rawId": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-5cbb-38e3-e1fe-084822002c35",
            "communicationUser": {
              "id": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-5cbb-38e3-e1fe-084822002c35"
            }
          }
        }
      ],
      "createTime": "2021-02-20T00:31:54.365+00:00",
      "version": 1613781114365,
      "threadId": "19:e07c8ddc5bab4c059ea9f11d29b544b6@thread.v2",
      "transactionId": "gK6+kgANy0O1wchlVKVTJg.1.1.1.1.921436178.1"
    },
    "eventType": "Microsoft.Communication.ChatThreadCreated",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-02-20T00:31:54.5369967Z"
  }]
```
### Microsoft.Communication.ChatThreadPropertiesUpdated event

```json
[{
    "id": "cf867580-9caf-45be-b49f-ab1cbfcaa59f",
    "topic": "/subscriptions/{subscription-id}/resourcegroups/{group-name}/providers/microsoft.communication/communicationservices/{communication-services-resource-name}",
    "subject": "thread/{thread-id}/editedBy/{rawId}",
    "data": {
      "editedByCommunicationIdentifier": {
        "rawId": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-5c9e-9e35-07fd-084822002264",
        "communicationUser": {
          "id": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-5c9e-9e35-07fd-084822002264"
        }
      },
      "editTime": "2021-02-20T00:04:07.7152073+00:00",
      "properties": {
        "topic": "Talk about new Thread Events in communication services"
      },
      "createTime": "2021-02-20T00:00:40.126+00:00",
      "version": 1613779447695,
      "threadId": "19:9e8eefe67b3c470a8187b4c2b00240bc@thread.v2",
      "transactionId": "GBE9MB2a40KEWzexIg0D3A.1.1.1.1.856359041.1"
    },
    "eventType": "Microsoft.Communication.ChatThreadPropertiesUpdated",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-02-20T00:04:07.8410277Z"
  }]
```
### Microsoft.Communication.ChatThreadDeleted event

```json
[
{
    "id": "1dbd5237-4823-4fed-980c-8d27c17cf5b0",
    "topic": "/subscriptions/{subscription-id}/resourcegroups/{group-name}/providers/microsoft.communication/communicationservices/{communication-services-resource-name}",
    "subject": "thread/{thread-id}/deletedBy/{rawId}",
    "data": {
      "deletedByCommunicationIdentifier": {
        "rawId": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-5c9e-a300-07fd-084822002266",
        "communicationUser": {
          "id": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-5c9e-a300-07fd-084822002266"
        }
      },
      "deleteTime": "2021-02-20T00:00:42.109802+00:00",
      "createTime": "2021-02-20T00:00:39.947+00:00",
      "version": 1613779241389,
      "threadId": "19:c9e9f3060b884e448671391882066ac3@thread.v2",
      "transactionId": "KibptDpcLEeEFnlR7cI3QA.1.1.2.1.848298005.1"
    },
    "eventType": "Microsoft.Communication.ChatThreadDeleted",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-02-20T00:00:42.5428002Z"
  }
  ]
```
### Microsoft.Communication.ChatThreadParticipantAdded event

```json
[
{
    "id": "3024eb5d-1d71-49d1-878c-7dc3165433d9",
    "topic": "/subscriptions/{subscription-id}/resourcegroups/{group-name}/providers/microsoft.communication/communicationservices/{communication-services-resource-name}",
    "subject": "thread/{thread-id}/participantadded/{rawId}",
    "data": {
      "time": "2021-02-20T00:54:42.8622646+00:00",
      "addedByCommunicationIdentifier": {
        "rawId": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-5cbb-38a0-88f7-084822002453",
        "communicationUser": {
          "id": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-5cbb-38a0-88f7-084822002453"
        }
      },
      "participantAdded": {
        "displayName": "Bob",
        "participantCommunicationIdentifier": {
          "rawId": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-5cbb-38f3-88f7-084822002454",
          "communicationUser": {
            "id": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-5cbb-38f3-88f7-084822002454"
          }
        }
      },
      "createTime": "2021-02-20T00:31:54.365+00:00",
      "version": 1613782482822,
      "threadId": "19:e07c8ddc5bab4c059ea9f11d29b544b6@thread.v2",
      "transactionId": "9q6cO7i4FkaZ+5RRVzshVw.1.1.1.1.974913783.1"
    },
    "eventType": "Microsoft.Communication.ChatThreadParticipantAdded",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-02-20T00:54:43.9866454Z"
  }
]
```
### Microsoft.Communication.ChatThreadParticipantRemoved event

```json
[
{
    "id": "6ed810fd-8776-4b13-81c2-1a0c4f791a07",
    "topic": "/subscriptions/{subscription-id}/resourcegroups/{group-name}/providers/microsoft.communication/communicationservices/{communication-services-resource-name}",
    "subject": "thread/{thread-id}/participantremoved/{rawId}",
    "data": {
      "time": "2021-02-20T00:56:18.1118825+00:00",
      "removedByCommunicationIdentifier": {
        "rawId": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-5cbb-38a0-88f7-084822002453",
        "communicationUser": {
          "id": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-5cbb-38a0-88f7-084822002453"
        }
      },
      "participantRemoved": {
        "displayName": "Shawn",
        "participantCommunicationIdentifier": {
          "rawId": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-5cbb-38e6-07fd-084822002467",
          "communicationUser": {
            "id": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-5cbb-38e6-07fd-084822002467"
          }
        }
      },
      "createTime": "2021-02-20T00:31:54.365+00:00",
      "version": 1613782578096,
      "threadId": "19:e07c8ddc5bab4c059ea9f11d29b544b6@thread.v2",
      "transactionId": "zGCq8IGRr0aEF6COuy7wSA.1.1.1.1.978649284.1"
    },
    "eventType": "Microsoft.Communication.ChatThreadParticipantRemoved",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-02-20T00:56:18.856721Z"
  }
]
```
### Microsoft.Communication.ChatMessageReceivedInThread event

```json
[
{
    "id": "4f614f97-c451-4b82-a8c9-1e30c3bfcda1",
    "topic": "/subscriptions/{subscription-id}/resourcegroups/{group-name}/providers/microsoft.communication/communicationservices/{communication-services-resource-name}",
    "subject": "thread/{thread-id}/sender/8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-5cdb-4916-07fd-084822002624",
    "data": {
      "messageBody": "Talk about new Thread Events in communication services",
      "messageId": "1613783230064",
      "metadata": {
        "key": "value",
        "description": "A map of data associated with the message"
      },
      "type": "Text",
      "version": "1613783230064",
      "senderDisplayName": "Bob",
      "senderCommunicationIdentifier": {
        "rawId": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-5cdb-4916-07fd-084822002624",
        "communicationUser": {
          "id": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-5cdb-4916-07fd-084822002624"
        }
      },
      "composeTime": "2021-02-20T01:07:10.064+00:00",
      "threadId": "19:5b3809e80e4a439d92c3316e273f4a2b@thread.v2",
      "transactionId": "foMkntkKS0O/MhMlIE5Aag.1.1.1.1.1004077250.1"
    },
    "eventType": "Microsoft.Communication.ChatMessageReceivedInThread",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-02-20T01:07:10.5704596Z"
  }
]
```
### Microsoft.Communication.ChatMessageEditedInThread event

```json
[
  {
    "id": "7b8dc01e-2659-41fa-bc8c-88a967714510",
    "topic": "/subscriptions/{subscription-id}/resourcegroups/{group-name}/providers/microsoft.communication/communicationservices/{communication-services-resource-name}",
    "subject": "thread/{thread-id}/sender/{rawId}",
    "data": {
      "editTime": "2021-02-20T00:59:10.464+00:00",
      "messageBody": "8effb181-1eb2-4a58-9d03-ed48a461b19b",
      "messageId": "1613782685964",
      "metadata": {
        "key": "value",
        "description": "A map of data associated with the message"
      },
      "type": "Text",
      "version": "1613782750464",
      "senderDisplayName": "Scott",
      "senderCommunicationIdentifier": {
        "rawId": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-5cbb-38a0-88f7-084822002453",
        "communicationUser": {
          "id": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-5cbb-38a0-88f7-084822002453"
        }
      },
      "composeTime": "2021-02-20T00:58:05.964+00:00",
      "threadId": "19:e07c8ddc5bab4c059ea9f11d29b544b6@thread.v2",
      "transactionId": "H8Gpj3NkIU6bXlWw8WPvhQ.2.1.2.1.985333801.1"
    },
    "eventType": "Microsoft.Communication.ChatMessageEditedInThread",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-02-20T00:59:10.7600061Z"
  }
]
```

### Microsoft.Communication.ChatMessageDeletedInThread event

```json
[
 {
    "id": "17d9c39d-0c58-4ed8-947d-c55959f57f75",
    "topic": "/subscriptions/{subscription-id}/resourcegroups/{group-name}/providers/microsoft.communication/communicationservices/{communication-services-resource-name}",
    "subject": "thread/{thread-id}/sender/{rawId}",
    "data": {
      "deleteTime": "2021-02-20T00:59:10.464+00:00",
      "messageId": "1613782685440",
      "type": "Text",
      "version": "1613782814333",
      "senderDisplayName": "Scott",
      "senderCommunicationIdentifier": {
        "rawId": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-5cbb-38a0-88f7-084822002453",
        "communicationUser": {
          "id": "8:acs:109f0644-b956-4cd9-87b1-71024f6e2f44_00000008-5cbb-38a0-88f7-084822002453"
        }
      },
      "composeTime": "2021-02-20T00:58:05.44+00:00",
      "threadId": "19:e07c8ddc5bab4c059ea9f11d29b544b6@thread.v2",
      "transactionId": "HqU6PeK5AkCRSpW8eAbL0A.1.1.2.1.987824181.1"
    },
    "eventType": "Microsoft.Communication.ChatMessageDeletedInThread",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-02-20T01:00:14.8518034Z"
  }
]
```

