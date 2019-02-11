---
title: AS2 tracking schemas for B2B messages - Azure Logic Apps | Microsoft Docs
description: Create AS2 tracking schemas that monitor B2B messages in integration accounts for Azure Logic Apps with Enterprise Integration Pack
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: jonfan, estfan, LADocs
ms.topic: article
ms.assetid: f169c411-1bd7-4554-80c1-84351247bf94
ms.date: 01/27/2017
---

# Create schemas for tracking AS2 messages and MDNs in integration accounts for Azure Logic Apps

To help you monitor success, errors, and message 
properties for business-to-business (B2B) transactions, 
you can use these AS2 tracking schemas in your integration account:

* AS2 message tracking schema
* AS2 MDN tracking schema

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
      "incomingHeaders": {
       },
      "outgoingHeaders": {
       },
      "isNrrEnabled": "",
      "isMdnExpected": "",
      "mdnType": ""
    }
}
```

| Property | Type | Description |
| --- | --- | --- |
| senderPartnerName | String | AS2 message sender's partner name. (Optional) |
| receiverPartnerName | String | AS2 message receiver's partner name. (Optional) |
| as2To | String | AS2 message receiver’s name, from the headers of the AS2 message. (Mandatory) |
| as2From | String | AS2 message sender’s name, from the headers of the AS2 message. (Mandatory) |
| agreementName | String | Name of the AS2 agreement to which the messages are resolved. (Optional) |
| direction | String | Direction of the message flow, receive or send. (Mandatory) |
| messageId | String | AS2 message ID, from the headers of the AS2 message (Optional) |
| dispositionType |String | Message Disposition Notification (MDN) disposition type value. (Optional) |
| fileName | String | File name, from the header of the AS2 message. (Optional) |
| isMessageFailed |Boolean | Whether the AS2 message failed. (Mandatory) |
| isMessageSigned | Boolean | Whether the AS2 message was signed. (Mandatory) |
| isMessageEncrypted | Boolean | Whether the AS2 message was encrypted. (Mandatory) |
| isMessageCompressed |Boolean | Whether the AS2 message was compressed. (Mandatory) |
| correlationMessageId | String | AS2 message ID, to correlate messages with MDNs. (Optional) |
| incomingHeaders |Dictionary of JToken | Incoming AS2 message header details. (Optional) |
| outgoingHeaders |Dictionary of JToken | Outgoing AS2 message header details. (Optional) |
| isNrrEnabled | Boolean | Use default value if the value is not known. (Mandatory) |
| isMdnExpected | Boolean | Use default value if the value is not known. (Mandatory) |
| mdnType | Enum | Allowed values are **NotConfigured**, **Sync**, and **Async**. (Mandatory) |
||||

## AS2 MDN tracking schema

```json
{
   "agreementProperties": {
      "senderPartnerName": "",
      "receiverPartnerName": "",
      "as2To": "",
      "as2From": "",
      "agreementName": "g"
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

| Property | Type | Description |
| --- | --- | --- |
| senderPartnerName | String | AS2 message sender's partner name. (Optional) |
| receiverPartnerName | String | AS2 message receiver's partner name. (Optional) |
| as2To | String | Partner name who receives the AS2 message. (Mandatory) |
| as2From | String | Partner name who sends the AS2 message. (Mandatory) |
| agreementName | String | Name of the AS2 agreement to which the messages are resolved. (Optional) |
| direction |String | Direction of the message flow, receive or send. (Mandatory) |
| messageId | String | AS2 message ID. (Optional) |
| originalMessageId |String | AS2 original message ID. (Optional) |
| dispositionType | String | MDN disposition type value. (Optional) |
| isMessageFailed |Boolean | Whether the AS2 message failed. (Mandatory) |
| isMessageSigned |Boolean | Whether the AS2 message was signed. (Mandatory) |
| isNrrEnabled | Boolean | Use default value if the value is not known. (Mandatory) |
| statusCode | Enum | Allowed values are **Accepted**, **Rejected**, and **AcceptedWithErrors**. (Mandatory) |
| micVerificationStatus | Enum | Allowed values are **NotApplicable**, **Succeeded**, and **Failed**. (Mandatory) |
| correlationMessageId | String | Correlation ID. The original messaged ID (the message ID of the message for which MDN is configured). (Optional) |
| incomingHeaders | Dictionary of JToken | Indicates incoming message header details. (Optional) |
| outgoingHeaders |Dictionary of JToken | Indicates outgoing message header details. (Optional) |
||||

## B2B protocol tracking schemas

For information about B2B protocol tracking schemas, see:

* [X12 tracking schemas](logic-apps-track-integration-account-x12-tracking-schema.md)
* [B2B custom tracking schemas](logic-apps-track-integration-account-custom-tracking-schema.md)

## Next steps

* Learn about [monitoring B2B messages](logic-apps-monitor-b2b-message.md)
* Learn about [tracking B2B messages in Log Analytics](../logic-apps/logic-apps-track-b2b-messages-omsportal.md)