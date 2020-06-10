---
title: AS2 tracking schemas for B2B messages
description: Create tracking schemas to monitor AS2 messages in Azure Logic Apps
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: jonfan, estfan, logicappspm
ms.topic: article
ms.date: 01/01/2020
---

# Create schemas for tracking AS2 messages in Azure Logic Apps

To help you monitor success, errors, and message properties for business-to-business (B2B) transactions, you can use these AS2 tracking schemas in your integration account:

* AS2 message tracking schema
* AS2 Message Disposition Notification (MDN) tracking schema

## AS2 message tracking schema

```json
{
   "agreementProperties": {
      "senderPartnerName": "",
      "receiverPartnerName": "",
      "as2To": "",
      "as2From": "",
      "agreementName": ""
   },
   "messageProperties": {
      "direction": "",
      "messageId": "",
      "dispositionType": "",
      "fileName": "",
      "isMessageFailed": "",
      "isMessageSigned": "",
      "isMessageEncrypted": "",
      "isMessageCompressed": "",
      "correlationMessageId": "",
      "incomingHeaders": {},
      "outgoingHeaders": {},
      "isNrrEnabled": "",
      "isMdnExpected": "",
      "mdnType": ""
    }
}
```

| Property | Required | Type | Description |
|----------|----------|------|-------------|
| senderPartnerName | No | String | AS2 message sender's partner name |
| receiverPartnerName | No | String | AS2 message receiver's partner name |
| as2To | Yes | String | AS2 message receiver’s name from the headers of the AS2 message |
| as2From | Yes | String | AS2 message sender’s name from the headers of the AS2 message |
| agreementName | No | String | Name of the AS2 agreement to which the messages are resolved |
| direction | Yes | String | Direction of the message flow, which is either `receive` or `send` |
| messageId | No | String | AS2 message ID from the headers of the AS2 message |
| dispositionType | No | String | Message Disposition Notification (MDN) disposition type value |
| fileName | No | String | File name from the header of the AS2 message |
| isMessageFailed | Yes | Boolean | Whether the AS2 message failed |
| isMessageSigned | Yes | Boolean | Whether the AS2 message was signed |
| isMessageEncrypted | Yes | Boolean | Whether the AS2 message was encrypted |
| isMessageCompressed | Yes | Boolean | Whether the AS2 message was compressed |
| correlationMessageId | No | String | AS2 message ID, to correlate messages with MDNs |
| incomingHeaders | No | Dictionary of JToken | Incoming AS2 message header details |
| outgoingHeaders | No | Dictionary of JToken | Outgoing AS2 message header details |
| isNrrEnabled | Yes | Boolean | Whether to use default value if the value isn't known |
| isMdnExpected | Yes | Boolean | Whether to use the default value if the value isn't known |
| mdnType | Yes | Enum | Allowed values: `NotConfigured`, `Sync`, and `Async` |
|||||

## AS2 MDN tracking schema

```json
{
   "agreementProperties": {
      "senderPartnerName": "",
      "receiverPartnerName": "",
      "as2To": "",
      "as2From": "",
      "agreementName": ""
   },
   "messageProperties": {
      "direction": "",
      "messageId": "",
      "originalMessageId": "",
      "dispositionType": "",
      "isMessageFailed": "",
      "isMessageSigned": "",
      "isNrrEnabled": "",
      "statusCode": "",
      "micVerificationStatus": "",
      "correlationMessageId": "",
      "incomingHeaders": {
      },
      "outgoingHeaders": {
      }
   }
}
```

| Property | Required | Type | Description |
|----------|----------|------|-------------|
| senderPartnerName | No | String | AS2 message sender's partner name |
| receiverPartnerName | No | String | AS2 message receiver's partner name |
| as2To | Yes | String | Partner name who receives the AS2 message |
| as2From | Yes | String | Partner name who sends the AS2 message |
| agreementName | No | String | Name of the AS2 agreement to which the messages are resolved |
| direction | Yes | String | Direction of the message flow, which is either `receive` or `send` |
| messageId | No | String | AS2 message ID |
| originalMessageId | No | String | AS2 original message ID |
| dispositionType | No | String | MDN disposition type value |
| isMessageFailed | Yes | Boolean | Whether the AS2 message failed |
| isMessageSigned | Yes | Boolean | Whether the AS2 message was signed |
| isNrrEnabled | Yes | Boolean | Whether to use the default value if the value isn't known |
| statusCode | Yes | Enum | Allowed values: `Accepted`, `Rejected`, and `AcceptedWithErrors` |
| micVerificationStatus | Yes | Enum | Allowed values:`NotApplicable`, `Succeeded`, and `Failed` |
| correlationMessageId | No | String | Correlation ID, which is the ID for the original message that has the MDN configured |
| incomingHeaders | No | Dictionary of JToken | Incoming message header details |
| outgoingHeaders | No | Dictionary of JToken | Outgoing message header details |
|||||

## B2B protocol tracking schemas

For information about B2B protocol tracking schemas, see:

* [X12 tracking schemas](logic-apps-track-integration-account-x12-tracking-schema.md)
* [B2B custom tracking schemas](logic-apps-track-integration-account-custom-tracking-schema.md)

## Next steps

* [Monitor B2B messages with Azure Monitor logs](../logic-apps/monitor-b2b-messages-log-analytics.md)