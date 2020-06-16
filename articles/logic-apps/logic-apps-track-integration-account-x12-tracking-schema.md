---
title: X12 tracking schemas for B2B messages
description: Create tracking schemas to monitor X12 messages for Azure Logic Apps
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: jonfan, estfan, logicappspm
ms.topic: article
ms.date: 01/01/2020
---

# Create schemas for tracking X12 messages in Azure Logic Apps

To help you monitor success, errors, and message properties for business-to-business (B2B) transactions, you can use these X12 tracking schemas in your integration account:

* X12 transaction set tracking schema
* X12 transaction set acknowledgment tracking schema
* X12 interchange tracking schema
* X12 interchange acknowledgment tracking schema
* X12 functional group tracking schema
* X12 functional group acknowledgment tracking schema

## X12 transaction set tracking schema

```json
{
   "agreementProperties": {
      "senderPartnerName": "",
      "receiverPartnerName": "",
      "senderQualifier": "",
      "senderIdentifier": "",
      "receiverQualifier": "",
      "receiverIdentifier": "",
      "agreementName": ""
   },
   "messageProperties": {
      "direction": "",
      "interchangeControlNumber": "",
      "functionalGroupControlNumber": "",
      "transactionSetControlNumber": "",
      "CorrelationMessageId": "",
      "messageType": "",
      "isMessageFailed": "",
      "isTechnicalAcknowledgmentExpected": "",
      "isFunctionalAcknowledgmentExpected": "",
      "needAk2LoopForValidMessages": "",
      "segmentsCount": ""
   }
}
```

| Property | Required | Type | Description |
|----------|----------|------|-------------|
| senderPartnerName | No | String | X12 message sender's partner name |
| receiverPartnerName | No | String | X12 message receiver's partner name |
| senderQualifier | Yes | String | Send partner qualifier |
| senderIdentifier | Yes | String | Send partner identifier |
| receiverQualifier | Yes | String | Receive partner qualifier |
| receiverIdentifier | Yes | String | Receive partner identifier |
| agreementName | No | String | Name of the X12 agreement to which the messages are resolved |
| direction | Yes | Enum | Direction of the message flow, which is either `receive` or `send` |
| interchangeControlNumber | No | String | Interchange control number |
| functionalGroupControlNumber | No | String | Functional control number |
| transactionSetControlNumber | No | String | Transaction set control number |
| CorrelationMessageId | No | String | Correlation message ID, which is a combination of {AgreementName}{*GroupControlNumber*}{TransactionSetControlNumber} |
| messageType | No | String | Transaction set or document type |
| isMessageFailed | Yes | Boolean | Whether the X12 message failed |
| isTechnicalAcknowledgmentExpected | Yes | Boolean | Whether the technical acknowledgment is configured in the X12 agreement |
| isFunctionalAcknowledgmentExpected | Yes | Boolean | Whether the functional acknowledgment is configured in the X12 agreement |
| needAk2LoopForValidMessages | Yes | Boolean | Whether the AK2 loop is required for a valid message |
| segmentsCount | No | Integer | Number of segments in the X12 transaction set |
|||||

## X12 transaction set acknowledgment tracking schema

```json
{
   "agreementProperties": {
      "senderPartnerName": "",
      "receiverPartnerName": "",
      "senderQualifier": "",
      "senderIdentifier": "",
      "receiverQualifier": "",
      "receiverIdentifier": "",
      "agreementName": ""
   },
   "messageProperties": {
      "direction": "",
      "interchangeControlNumber": "",
      "functionalGroupControlNumber": "",
      "isaSegment": "",
      "gsSegment": "",
      "respondingfunctionalGroupControlNumber": "",
      "respondingFunctionalGroupId": "",
      "respondingtransactionSetControlNumber": "",
      "respondingTransactionSetId": "",
      "statusCode": "",
      "processingStatus": "",
      "CorrelationMessageId": "",
      "isMessageFailed": "",
      "ak2Segment": "",
      "ak3Segment": "",
      "ak5Segment": ""
   }
}
```

| Property | Required | Type | Description |
|----------|----------|------|-------------|
| senderPartnerName | No | String | X12 message sender's partner name |
| receiverPartnerName | No | String | X12 message receiver's partner name |
| senderQualifier | Yes | String | Send partner qualifier |
| senderIdentifier | Yes | String | Send partner identifier |
| receiverQualifier | Yes | String | Receive partner qualifier |
| receiverIdentifier | Yes | String | Receive partner identifier |
| agreementName | No | String | Name of the X12 agreement to which the messages are resolved |
| direction | Yes | Enum | Direction of the message flow, which is either `receive` or `send` |
| interchangeControlNumber | No | String | Interchange control number of the functional acknowledgment. The value populates only for the send side where functional acknowledgment is received for the messages sent to partner. |
| functionalGroupControlNumber | No | String | Functional group control number of the functional acknowledgment. The value populates only for the send side where functional acknowledgment is received for the messages sent to partner |
| isaSegment | No | String | ISA segment of the message. The value populates only for the send side where functional acknowledgment is received for the messages sent to partner |
| gsSegment | No | String | GS segment of the message. The value populates only for the send side where functional acknowledgment is received for the messages sent to partner |
| respondingfunctionalGroupControlNumber | No | String | The responding interchange control number |
| respondingFunctionalGroupId | No | String | The responding functional group ID, which maps to AK101 in the acknowledgment |
| respondingtransactionSetControlNumber | No | String | The responding transaction set control number |
| respondingTransactionSetId | No | String | The responding transaction set ID, which maps to AK201 in the acknowledgment |
| statusCode | Yes | Boolean | Transaction set acknowledgment status code |
| segmentsCount | Yes | Enum | Acknowledgment status code with these permitted values: `Accepted`, `Rejected`, and `AcceptedWithErrors` |
| processingStatus | Yes | Enum | Processing status of the acknowledgment with these permitted values: `Received`, `Generated`, and `Sent` |
| CorrelationMessageId | No | String | Correlation message ID, which is a combination of {AgreementName}{*GroupControlNumber*}{TransactionSetControlNumber} |
| isMessageFailed | Yes | Boolean | Whether the X12 message failed |
| ak2Segment | No | String | Acknowledgment for a transaction set within the received functional group |
| ak3Segment | No | String | Reports errors in a data segment |
| ak5Segment | No | String | Reports whether the transaction set identified in the AK2 segment is accepted or rejected, and why |
|||||

## X12 interchange tracking schema

```json
{
   "agreementProperties": {
      "senderPartnerName": "",
      "receiverPartnerName": "",
      "senderQualifier": "",
      "senderIdentifier": "",
      "receiverQualifier": "",
      "receiverIdentifier": "",
      "agreementName": ""
   },
   "messageProperties": {
      "direction": "",
      "interchangeControlNumber": "",
      "isaSegment": "",
      "isTechnicalAcknowledgmentExpected": "",
      "isMessageFailed": "",
      "isa09": "",
      "isa10": "",
      "isa11": "",
      "isa12": "",
      "isa14": "",
      "isa15": "",
      "isa16": ""
   }
}
```

| Property | Required | Type | Description |
|----------|----------|------|-------------|
| senderPartnerName | No | String | X12 message sender's partner name |
| receiverPartnerName | No | String | X12 message receiver's partner name |
| senderQualifier | Yes | String | Send partner qualifier |
| senderIdentifier | Yes | String | Send partner identifier |
| receiverQualifier | Yes | String | Receive partner qualifier |
| receiverIdentifier | Yes | String | Receive partner identifier |
| agreementName | No | String | Name of the X12 agreement to which the messages are resolved |
| direction | Yes | Enum | Direction of the message flow, which is either `receive` or `send` |
| interchangeControlNumber | No | String | Interchange control number |
| isaSegment | No | String | Message ISA segment |
| isTechnicalAcknowledgmentExpected | Boolean | Whether the technical acknowledgment is configured in the X12 agreement  |
| isMessageFailed | Yes | Boolean | Whether the X12 message failed |
| isa09 | No | String | X12 document interchange date |
| isa10 | No | String | X12 document interchange time |
| isa11 | No | String | X12 interchange control standards identifier |
| isa12 | No | String | X12 interchange control version number |
| isa14 | No | String | X12 acknowledgment is requested |
| isa15 | No | String | Indicator for test or production |
| isa16 | No | String | Element separator |
|||||

## X12 interchange acknowledgment tracking schema

```json
{
   "agreementProperties": {
      "senderPartnerName": "",
      "receiverPartnerName": "",
      "senderQualifier": "",
      "senderIdentifier": "",
      "receiverQualifier": "",
      "receiverIdentifier": "",
      "agreementName": ""
   },
   "messageProperties": {
      "direction": "",
      "interchangeControlNumber": "",
      "isaSegment": "",
      "respondingInterchangeControlNumber": "",
      "isMessageFailed": "",
      "statusCode": "",
      "processingStatus": "",
      "ta102": "",
      "ta103": "",
      "ta105": ""
   }
}
```

| Property | Required | Type | Description |
|----------|----------|------|-------------|
| senderPartnerName | No | String | X12 message sender's partner name |
| receiverPartnerName | No | String | X12 message receiver's partner name |
| senderQualifier | Yes | String | Send partner qualifier |
| senderIdentifier | Yes | String | Send partner identifier |
| receiverQualifier | Yes | String | Receive partner qualifier |
| receiverIdentifier | Yes | String | Receive partner identifier |
| agreementName | No | String | Name of the X12 agreement to which the messages are resolved |
| direction | Yes | Enum | Direction of the message flow, which is either `receive` or `send` |
| interchangeControlNumber | No | String | Interchange control number of the technical acknowledgment that's received from partners |
| isaSegment | No | String | ISA segment for the technical acknowledgment that's received from partners |
| respondingInterchangeControlNumber | No | String | Interchange control number for the technical acknowledgment that's received from partners |
| isMessageFailed | Yes | Boolean | Whether the X12 message failed |
| statusCode | Yes | Enum | Interchange acknowledgment status code with these permitted values: `Accepted`, `Rejected`, and `AcceptedWithErrors` |
| processingStatus | Yes | Enum | Acknowledgment status with these permitted values: `Received`, `Generated`, and `Sent` |
| ta102 | No | String | Interchange date |
| ta103 | No | String | Interchange time |
| ta105 | No | String | Interchange note code |
|||||

## X12 functional group tracking schema

```json
{
   "agreementProperties": {
      "senderPartnerName": "",
      "receiverPartnerName": "",
      "senderQualifier": "",
      "senderIdentifier": "",
      "receiverQualifier": "",
      "receiverIdentifier": "",
      "agreementName": ""
   },
   "messageProperties": {
      "direction": "",
      "interchangeControlNumber": "",
      "functionalGroupControlNumber": "",
      "gsSegment": "",
      "isTechnicalAcknowledgmentExpected": "",
      "isFunctionalAcknowledgmentExpected": "",
      "isMessageFailed": "",
      "gs01": "",
      "gs02": "",
      "gs03": "",
      "gs04": "",
      "gs05": "",
      "gs07": "",
      "gs08": ""
   }
}
```

| Property | Required | Type | Description |
|----------|----------|------|-------------|
| senderPartnerName | No | String | X12 message sender's partner name |
| receiverPartnerName | No | String | X12 message receiver's partner name |
| senderQualifier | Yes | String | Send partner qualifier |
| senderIdentifier | Yes | String | Send partner identifier |
| receiverQualifier | Yes | String | Receive partner qualifier |
| receiverIdentifier | Yes | String | Receive partner identifier |
| agreementName | No | String | The name of the X12 agreement to which the messages are resolved |
| direction | Yes | Enum | Direction of the message flow, either receive or send |
| interchangeControlNumber | No | String | Interchange control number |
| functionalGroupControlNumber | No | String | Functional control number |
| gsSegment | No | String | Message GS segment |
| isTechnicalAcknowledgmentExpected | Yes | Boolean | Whether the technical acknowledgment is configured in the X12 agreement |
| isFunctionalAcknowledgmentExpected | Yes | Boolean | Whether the functional acknowledgment is configured in the X12 agreement |
| isMessageFailed | Yes | Boolean | Whether the X12 message failed |
| gs01 | No | String | Functional identifier code |
| gs02 | No | String | Application sender's code |
| gs03 | No | String | Application receiver's code |
| gs04 | No | String | Functional group date |
| gs05 | No | String | Functional group time |
| gs07 | No | String | Responsible agency code |
| gs08 | No | String | Identifier code for the version, release, or industry |
|||||

## X12 functional group acknowledgment tracking schema

```json
{
   "agreementProperties": {
      "senderPartnerName": "",
      "receiverPartnerName": "",
      "senderQualifier": "",
      "senderIdentifier": "",
      "receiverQualifier": "",
      "receiverIdentifier": "",
      "agreementName": ""
   },
   "messageProperties": {
      "direction": "",
      "interchangeControlNumber": "",
      "functionalGroupControlNumber": "",
      "isaSegment": "",
      "gsSegment": "",
      "respondingfunctionalGroupControlNumber": "",
      "respondingFunctionalGroupId": "",
      "isMessageFailed": "",
      "statusCode": "",
      "processingStatus": "",
      "ak903": "",
      "ak904": "",
      "ak9Segment": ""
   }
}
```

| Property | Required | Type | Description |
|----------|----------|------|-------------|
| senderPartnerName | No | String | X12 message sender's partner name |
| receiverPartnerName | No | String | X12 message receiver's partner name |
| senderQualifier | Yes | String | Send partner qualifier |
| senderIdentifier | Yes | String | Send partner identifier |
| receiverQualifier | Yes | String | Receive partner qualifier |
| receiverIdentifier | Yes | String | Receive partner identifier |
| agreementName | No | String | Name of the X12 agreement to which the messages are resolved |
| direction | Yes | Enum | Direction of the message flow, which is either `receive` or `send` |
| interchangeControlNumber | No | String | Interchange control number, which populates for the send side when a technical acknowledgment is received from partners |
| functionalGroupControlNumber | No | String | Functional group control number of the technical acknowledgment, which populates for the send side when a technical acknowledgment is received from partners |
| isaSegment | No | String | Same as interchange control number, but populated only in specific cases |
| gsSegment | No | String | Same as functional group control number, but populated only in specific cases |
| respondingfunctionalGroupControlNumber | No | String | Control number of the original functional group |
| respondingFunctionalGroupId | No | String | Maps to AK101 in the acknowledgment functional group ID |
| isMessageFailed | Boolean | Whether the X12 message failed |
| statusCode | Yes | Enum | Acknowledgment status code with these permitted values: `Accepted`, `Rejected`, and `AcceptedWithErrors` |
| processingStatus | Yes | Enum | Processing status of the acknowledgment with these permitted values: `Received`, `Generated`, and `Sent` |
| ak903 | No | String | Number of transaction sets received |
| ak904 | No | String | Number of transaction sets accepted in the identified functional group |
| ak9Segment | No | String | Whether the functional group identified in the AK1 segment is accepted or rejected, and why |
|||||

## B2B protocol tracking schemas

For information about B2B protocol tracking schemas, see:

* [AS2 tracking schemas](../logic-apps/logic-apps-track-integration-account-as2-tracking-schemas.md)
* [B2B custom tracking schemas](logic-apps-track-integration-account-custom-tracking-schema.md)

## Next steps

* [Monitor B2B messages with Azure Monitor logs](../logic-apps/monitor-b2b-messages-log-analytics.md)