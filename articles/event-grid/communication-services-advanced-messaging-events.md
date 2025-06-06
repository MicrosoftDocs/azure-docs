---
title: Azure Communication Services - Advanced Messaging events
description: This article describes how to use Azure Communication Services as an Event Grid event source for Advanced Messaging Events.
ms.topic: conceptual
ms.date: 07/15/2024
author: shamkh
ms.author: shamkh
ms.service: azure-communication-services
ms.subservice: advanced-messaging
---

# Azure Communication Services - Advanced Messaging events

This article provides the properties and schema for Communication Services Advanced Messaging events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md).

## Event types

Azure Communication Services emits the following Advanced Messaging event types:

| Event type | Description |
| --- | --- |
| [Microsoft.Communication.AdvancedMessageReceived](#microsoftcommunicationadvancedmessagereceived-event) | Published when Communication Services Advanced Messaging receives a message. |
| [Microsoft.Communication.AdvancedMessageDeliveryStatusUpdated](#microsoftcommunicationadvancedmessagedeliverystatusupdated-event) | Published when Communication Services Advanced Messaging receives a status update for a previously sent message notification. |
| [Microsoft.Communication.AdvancedMessageAnalysisCompleted(Preview)](#microsoftcommunicationadvancedmessageanalysiscompletedpreview-event) | Published when Communication Service completes an AI Analysis with a customer message. |

## Event responses

When an event is triggered, the Event Grid service sends data about that event to subscribing endpoints.

This section contains an example of what that data looks like for each event.

### Microsoft.Communication.AdvancedMessageReceived event

Published when Communication Services Advanced Messaging receives a message.    

Example scenario: A WhatsApp user sends a WhatsApp message to a WhatsApp Business Number that is connected to an active Advanced Messaging channel in a Communication Services resource. As a result, a `Microsoft.Communication.AdvancedMessageReceived` with the contents of the user's WhatsApp message is published.

#### Attribute list

Details for the attributes specific to `Microsoft.Communication.AdvancedMessageReceived` events.

| Attribute  | Type  | Nullable | Description |
|:--- |:---:|:---:| --- |
| channelType  | `string` | ❌ | Channel type of the channel that the message was sent on. For example: `"whatsapp"`. |
| messageId  | `string` | ❌ | Message Id of the message receive event as GUID. |
| messageType  | `string` | ❌ | Message Type of the message receive event. Such as: `"interactive"`, `"sticker"`, `"reaction"`. |
| from    | `string` | ❌ | Sender ID that sent the message.  |
| to | `string` | ❌ | The channel ID that received the message, formatted as a GUID.  |
| receivedTimestamp | `DateTimeOffset`   | ❌ | Timestamp when the message is received.|
| content | `string` | ✔️ | The text content in the message.  |
| media   | [`MediaContent`](#mediacontent)   | ✔️ | Contains details about the received [media](#mediacontent).  |
| context | [`MessageContext`](#messagecontext)    | ✔️ | Contains details about the reply [message context](#messagecontext) in case the user replies back to business message. |
| button  | [`ButtonContent`](#buttoncontent) | ✔️ | Contains details of the reply button content user selected for template message.  |
| interactive  | [`InteractiveContent`](#interactivecontent) | ✔️ | Contains details about interactive message response like [buttonReply](#interactivebuttonreplycontent) or [listReply](#interactivelistreplycontent) |
| reaction| [`ReactionContent`](#reactioncontent)  | ✔️ | Contains details about the received [reaction](#reactioncontent) over business send message. |

##### MediaContent

| Attribute | Type | Nullable | Description |
|:--------- |:----:|:--------:| --- |
| mimeType  | `string` | ❌ | MIME type of the media. Used to determine the correct file type for media downloads. |
| ID   | `string` | ❌ | Media ID. Used to retrieve media for download, formatted as a GUID. |
| fileName  | `string` | ✔️ | The filename of the underlying media file as specified when uploaded. |
| caption   | `string` | ✔️ | Caption text for the media object, if supported and provided. |
| animated  | `string` | ✔️ | Set to true if the sticker is animated; false otherwise. |


##### MessageContext

| Attribute | Type | Nullable | Description |
|:--------- |:--------:|:--------:| ------- |
| from | `string` | ✔️ | The WhatsApp ID for the customer who replied to an inbound message. |
| ID   | `string` | ✔️ | The message ID for the sent message for an inbound reply. |

##### ButtonContent

| Attribute | Type| Nullable | Description |
|:--------- |:--------:|:--------:| --- |
| text | `string` | ✔️ | The text of the button.|
| payload   | `string` | ✔️ | The payload, set up by the business, of the button that the user selected. |

##### InteractiveContent

| Attribute | Type | Nullable | Description |
|:--------- |:----:|:--------:| --- |
| type   | [`InteractiveReplyType`](#interactivereplytype)    | ✔️ | Type of the interactive content.   |
| buttonReply | [`InteractiveButtonReplyContent`](#interactivebuttonreplycontent) | ✔️ | Sent when a customer selects a button.  |
| listReply   | [`InteractiveListReplyContent`](#interactivelistreplycontent)| ✔️ | Sent when a customer selects an item from a list. |

##### InteractiveReplyType

| Value  | Description |
|:------------|--------------------------------------|
| buttonReply | The interactive content is a button. |
| listReply   | The interactive content is a list.   |
| unknown| The interactive content is unknown.  |

##### InteractiveButtonReplyContent

| Attribute | Type| Nullable | Description|
|:----------|:--------:|:--------:|----------------------|
| ID   | `string` | ✔️ | ID of the button.    |
| title| `string` | ✔️ | Title of the button. |

##### InteractiveListReplyContent

| Attribute   | Type| Nullable | Description  |
|:------------|:--------:|:--------:|----------------------------------|
| ID| `string` | ✔️ | ID of the selected list item.    |
| title  | `string` | ✔️ | Title of the selected list item. |
| description | `string` | ✔️ | Description of the selected row. |

##### ReactionContent

| Attribute | Type | Nullable | Description |
|:--------- |:----:|:--------:| --- |
| messageId  | `string` | ❌ | Message ID to which the user replies to. |
| emoji | `string` | ✔️ | String representing unicode escape sequence of the emoji. |

#### Examples

##### Text message received

```json
[{
  "id": "00000000-0000-0000-0000-000000000000",
  "topic": "/subscriptions/{subscription-id}/resourcegroups/{resourcegroup-name}/providers/microsoft.communication/communicationservices/{communication-services-resource-name}",
  "subject": "advancedMessage/sender/{sender@id}/recipient/11111111-1111-1111-1111-111111111111",
  "data": {
    "content": "Hello",
    "channelType": "whatsapp",
    "messageType": "text",
    "from": "{sender@id}",
    "to": "{channel-id}",
    "receivedTimestamp": "2023-07-06T18:30:19+00:00"
  },
  "eventType": "Microsoft.Communication.AdvancedMessageReceived",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2023-07-06T18:30:22.1921716Z"
}]
```

##### Image Media message received

```json
[{
  "id": "00000000-0000-0000-0000-000000000000",
  "topic": "/subscriptions/{subscription-id}/resourcegroups/{resourcegroup-name}/providers/microsoft.communication/communicationservices/{communication-services-resource-name}",
  "subject": "advancedMessage/sender/{sender@id}/recipient/11111111-1111-1111-1111-111111111111",
  "data": {
    "channelType": "whatsapp",
    "messageType": "image",
    "media": {
 "mimeType": "image/jpeg",
 "id": "00000000-0000-0000-0000-000000000000",
 "caption": "This is a media caption"
    },
    "from": "{sender@id}",
    "to": "{channel-id}",
    "receivedTimestamp": "2023-07-06T18:30:19+00:00"
  },
  "eventType": "Microsoft.Communication.AdvancedMessageReceived",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2023-07-06T18:30:22.1921716Z"
}]
```

##### Document media message received

```json
{
  "id": "00000000-0000-0000-0000-000000000000",
  "topic": "/subscriptions/{subscription-id}/resourcegroups/acs-cpm-ppe-resources/providers/microsoft.communication/communicationservices/acscpm-whatsup-pperesource",
  "subject": "advancedMessage/sender/14254360097/recipient/75476a19-a68d-4e10-806c-3680f099e069",
  "data": {
    "channelType": "whatsapp",
    "messageType": "document",
    "media": {
 "mimeType": "application/pdf",
 "id": "00000000-0000-0000-0000-000000000000",
 "fileName": "UTSAV Mela 2024  India's Independence Day  Kids Out and About Seattle.pdf"
    },
    "from": "14254360097",
    "to": "{channel-id}",
    "receivedTimestamp": "2024-12-24T06:41:56+00:00"
  },
  "eventType": "Microsoft.Communication.AdvancedMessageReceived",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2024-12-24T06:41:59.1218953Z"
}
```

##### List reply message received with InteractiveListReplyContent

```json
[{
  "id": "00000000-0000-0000-0000-000000000000",
  "topic": "/subscriptions/{subscription-id}/resourcegroups/{resourcegroup-name}/providers/microsoft.communication/communicationservices/{communication-services-resource-name}",
  "subject": "advancedMessage/sender/{sender@id}/recipient/00000000-0000-0000-0000-000000000000",
  "data": {
    "channelType": "whatsapp",
    "messageType": "interactive",
    "context": {
 "from": "{receiverphonenumber@id}",
 "id": "{reply-message-id}"
    },
    "interactive": {
 "type": "listReply",
 "listReply": {
   "id": "priority_mail",
   "title": "Priority Mail",
   "description": "1–3 Days"
 }
    },
    "from": "{sender@id}",
    "to": "{channel-id}",
    "receivedTimestamp": "2024-12-04T23:53:28+00:00"
  },
  "eventType": "Microsoft.Communication.AdvancedMessageReceived",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2024-12-04T23:53:29.3079089Z"
}]
```

##### Reply button message received with InteractiveButtonReplyContent

```json
[{
  "id": "00000000-0000-0000-0000-000000000000",
  "topic": "/subscriptions/{subscription-id}/resourcegroups/{resourcegroup-name}/providers/microsoft.communication/communicationservices/{communication-services-resource-name}",
  "subject": "advancedMessage/sender/{sender@id}/recipient/00000000-0000-0000-0000-000000000000",
  "data": {
    "channelType": "whatsapp",
    "messageType": "interactive",
    "context": {
 "from": "{receiverphonenumber@id}",
 "id": "{reply-message-id}"
    },
    "interactive": {
 "type": "buttonReply",
 "buttonReply": {
   "id": "agree",
   "title": "Agree"
 }
    },
    "from": "{sender@id}",
    "to": "{channel-id}",
    "receivedTimestamp": "2024-12-04T23:57:04+00:00"
  },
  "eventType": "Microsoft.Communication.AdvancedMessageReceived",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2024-12-04T23:57:04.9459858Z"
}]
```

##### Reply sticker message received

```json
[{
  "id": "00000000-0000-0000-0000-000000000000",
  "topic": "/subscriptions/{subscription-id}/resourcegroups/{resourcegroup-name}/providers/microsoft.communication/communicationservices/{communication-services-resource-name}",
  "subject": "advancedMessage/sender/{sender@id}/recipient/00000000-0000-0000-0000-000000000000",
  "data": {
    "channelType": "whatsapp",
    "messageType": "sticker",
    "media": {
 "mimeType": "image/webp",
 "id": "00000000-0000-0000-0000-000000000000",
 "animated": false
    },
    "from": "{sender@id}",
    "to": "{channel-id}",
    "receivedTimestamp": "2024-12-04T23:57:04+00:00"
  },
  "eventType": "Microsoft.Communication.AdvancedMessageReceived",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2024-12-04T23:57:04.9459858Z"
}]
```

##### Reply reaction message received

```json
[{
  "id": "00000000-0000-0000-0000-000000000000",
  "topic": "/subscriptions/{subscription-id}/resourcegroups/{resourcegroup-name}/providers/microsoft.communication/communicationservices/{communication-services-resource-name}",
  "subject": "advancedMessage/sender/{sender@id}/recipient/00000000-0000-0000-0000-000000000000",
  "data": {
    "channelType": "whatsapp",
    "messageType": "reaction",
    "reaction": {
 "messageId": "{reply-message-id}",
 "emoji": "👍"
    },
    "from": "{sender@id}",
    "to": "{channel-id}",
    "receivedTimestamp": "2024-12-04T23:57:04+00:00"
  },
  "eventType": "Microsoft.Communication.AdvancedMessageReceived",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2024-12-04T23:57:04.9459858Z"
}]
```

##### ButtonContent message received

```json
[{
  "id": "00000000-0000-0000-0000-000000000000",
  "topic": "/subscriptions/{subscription-id}/resourcegroups/{resourcegroup-name}/providers/microsoft.communication/communicationservices/{communication-services-resource-name}",
  "subject": "advancedMessage/sender/{sender@id}/recipient/00000000-0000-0000-0000-000000000000",
  "data": {
    "channelType": "whatsapp",
    "messageType": "button",
    "context": {
 "from": "{receiverphonenumber@id}",
 "id": "{reply-message-id}"
    },
    "button": {
 "text": "Yes",
 "payload": "Kat said yes"
    },
    "from": "{sender@id}",
    "to": "{channel-id}",
    "receivedTimestamp": "2024-12-20T04:03:22+00:00"
  },
  "eventType": "Microsoft.Communication.AdvancedMessageReceived",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2024-12-20T04:03:22.7978135Z"
}]
```

### Microsoft.Communication.AdvancedMessageDeliveryStatusUpdated event

Published when Communication Services Advanced Messaging receives a status update for a previously sent message notification.    

Example scenario: Contoso uses an active Advanced Messaging channel connected to a WhatsApp Business Account to send a WhatsApp message to a WhatsApp user. WhatsApp then replies to Contoso's Advanced Messaging channel with the status of the previously sent message. As a result, a `Microsoft.Communication.AdvancedMessageDeliveryStatusUpdated` event containing the message status is published.

#### Attribute list

Details for the attributes specific to `Microsoft.Communication.AdvancedMessageReceived` events.

| Attribute | Type | Nullable | Description |
|:--------- |:---:|:--------:| --- |
| channelType | `string` | ❌ | Channel type of the channel that the message was sent on. |
| from | `string` | ❌ | The channel ID that sent the message, formatted as a GUID. |
| to   | `string` | ❌ | Recipient ID that the message was sent to. |
| receivedTimestamp | `DateTimeOffset` | ❌ | Timestamp of the message. |
| messageId | `string` | ✔️ | The ID of the message, formatted as a GUID. |
| status    | `string` | ✔️ | Status of the message. Possible values include `Sent`, `Delivered`, `Read`, and `Failed`. For more information, see [Status](#status). |
| error| [`ChannelEventError`](#channeleventerror) | ✔️ | Contains the details of an error. |

##### ChannelEventError

| Attribute | Type| Nullable | Description   |
|:---------------|:--------:|:--------:|---------------------------------------------|
| channelCode    | `string` | ✔️ | The error code received on this channel.    |
| channelMessage | `string` | ✔️ | The error message received on this channel. |

##### Status

| Value| Description|
|:----------|---------------------------------------------------------|
| Sent | The messaging service sent the message to the recipient |
| Delivered | The message recipient received the message    |
| Read | The message recipient read the message   |
| Failed    | The message failed to send correctly|

#### Examples

##### Update for message delivery

```json
[{
  "id": "00000000-0000-0000-0000-000000000000",
  "topic": "/subscriptions/{subscription-id}/resourcegroups/{resourcegroup-name}/providers/microsoft.communication/communicationservices/{communication-services-resource-name}",
  "subject": "advancedMessage/22222222-2222-2222-2222-222222222222/status/Sent",
  "data": {
    "messageId": "22222222-2222-2222-2222-222222222222",
    "status": "Sent",
    "channelType": "whatsapp",
    "from": "{sender@id}",
    "to": "{receiver@id}",
    "receivedTimestamp": "2023-07-06T18:42:28+00:00"
  },
  "eventType": "Microsoft.Communication.AdvancedMessageDeliveryStatusUpdated",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2023-07-06T18:42:28.8454662Z"
}]
```

##### Update for message delivery with failure

```json
[{
  "id": "00000000-0000-0000-0000-000000000000",
  "topic": "/subscriptions/{subscription-id}/resourcegroups/{resourcegroup-name}/providers/microsoft.communication/communicationservices/acsxplatmsg-test",
  "subject": "advancedMessage/22222222-2222-2222-2222-222222222222/status/Failed",
  "data": {
    "messageId": "22222222-2222-2222-2222-222222222222",
    "status": "Failed",
    "channelType": "whatsapp",
    "from": "{sender@id}",
    "to": "{receiver@id}",
    "receivedTimestamp": "2023-07-06T18:42:28+00:00",
    "error": {
 "channelCode": "131026",
 "channelMessage": "Message Undeliverable."
    }
  },
  "eventType": "Microsoft.Communication.AdvancedMessageDeliveryStatusUpdated",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2023-07-06T18:42:28.8454662Z"
}]
```


### Microsoft.Communication.AdvancedMessageAnalysisCompleted(Preview) event

Published when Communication Service completes an AI Analysis with a customer message.

Example scenario: A WhatsApp user sends a message to a WhatsApp Business Number connected to an active Advanced Messaging channel in a Communication Services resource that opted in for Message Analysis feature. As a result, the system publishes a `Microsoft.Communication.AdvancedMessageAnalysisCompleted` with the analysis of the user's WhatsApp message.

#### Attribute list

Details for the attributes specific to `Microsoft.Communication.AdvancedMessageAnalysisCompleted` events.

| Attribute | Type | Nullable | Description |
|:--------- |:---:|:---:| --- |
| channelType  | `string` | ✔️ | Channel type of the channel that the message was sent on.   |
| from    | `string` | ✔️ | The channel ID that sent the message, formatted as a GUID.  |
| to | `string` | ✔️ | Recipient ID that the message was sent to.   |
| receivedTimestamp | `DateTimeOffset` | ✔️ | Timestamp of the message. |
| originalMessage    | `string` | ✔️ | The original user message.    |
| intentAnalysis  | `string` | ✔️ | The intent analysis of the received user message.    |
| languageDetection   | [`LanguageDetection`](#languagedetection) | ✔️ | Contains the language detection of the received user message.   |
| extractedKeyPhrases   | `List<string>` | ✔️ | Contains the key phrases of  of the received user message.|

##### LanguageDetection

| Attribute | Type| Nullable | Description   |
|:--------- |:---:|:---:| --- |
| language    | `string` | ✔️ | The language detected.    |
| confidenceScore | `float` | ✔️ | The confidence score of the language detected. |
| translation | `string` | ✔️ | The message translation. |

#### Examples

##### Message analysis completed

```json
[{
  "id": "df1c2d92-6155-4ad7-a865-cb8497106c52",
  "topic": "/subscriptions/{subscription-id}/resourcegroups/{resourcegroup-name}/providers/microsoft.communication/communicationservices/acsxplatmsg-test",
  "subject": "advancedMessage/sender/{sender@id}/recipient/00000000-0000-0000-0000-000000000000",
  "data": {
    "originalMessage": "Hello, could u help me order some flowers for Mother’s Day?",
    "channelType": "whatsapp",
    "languageDetection": {
 "language": "English",
 "confidenceScore": 0.99
    },
    "intentAnalysis": "Order request: The customer is contacting customer service to request assistance with ordering flowers for Mother's Day.",
    "extractedKeyPhrases": [
 "order",
 "flowers",
 "Mother's Day"
    ],
    "from": "{sender@id}",
    "to": "00000000-0000-0000-0000-000000000000",
    "receivedTimestamp": "2024-07-05T19:10:35.28+00:00"
  },
  "eventType": "Microsoft.Communication.AdvancedMessageAnalysisCompleted",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2024-07-05T19:10:35.2806524Z"
}]
```

## Quickstart

For a quickstart that shows how to subscribe for Advanced Messaging events using web hooks, see [Quickstart: Handle Advanced Messaging events](../communication-services/quickstarts/advanced-messaging/whatsapp/handle-advanced-messaging-events.md). 
