---
title: X12 tracking schemas for B2B messages - Azure Logic Apps | Microsoft Docs
description: Create X12 tracking schemas that monitor B2B messages in integration accounts for Azure Logic Apps with Enterprise Integration Pack
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: jonfan, estfan, LADocs
ms.topic: article
ms.assetid: a5413f80-eaad-4bcf-b371-2ad0ef629c3d
ms.date: 01/27/2017
---

# Create schemas for tracking X12 messages in integration accounts for Azure Logic Apps

To help you monitor success, errors, and message 
properties for business-to-business (B2B) transactions, 
you can use these X12 tracking schemas in your integration account:

* X12 transaction set tracking schema
* X12 transaction set acknowledgement tracking schema
* X12 interchange tracking schema
* X12 interchange acknowledgement tracking schema
* X12 functional group tracking schema
* X12 functional group acknowledgement tracking schema

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
      "needAk2LoopForValidMessages":  "",
      "segmentsCount": ""
   }
}
```

| Property | Type | Description |
| --- | --- | --- |
| senderPartnerName | String | X12 message sender's partner name. (Optional) |
| receiverPartnerName | String | X12 message receiver's partner name. (Optional) |
| senderQualifier | String | Send partner qualifier. (Mandatory) |
| senderIdentifier | String | Send partner identifier. (Mandatory) |
| receiverQualifier | String | Receive partner qualifier. (Mandatory) |
| receiverIdentifier | String | Receive partner identifier. (Mandatory) |
| agreementName | String | Name of the X12 agreement to which the messages are resolved. (Optional) |
| direction | Enum | Direction of the message flow, receive or send. (Mandatory) |
| interchangeControlNumber | String | Interchange control number. (Optional) |
| functionalGroupControlNumber | String | Functional control number. (Optional) |
| transactionSetControlNumber | String | Transaction set control number. (Optional) |
| CorrelationMessageId | String | Correlation message ID. A combination of {AgreementName}{*GroupControlNumber*}{TransactionSetControlNumber}. (Optional) |
| messageType | String | Transaction set or document type. (Optional) |
| isMessageFailed | Boolean | Whether the X12 message failed. (Mandatory) |
| isTechnicalAcknowledgmentExpected | Boolean | Whether the technical acknowledgement is configured in the X12 agreement. (Mandatory) |
| isFunctionalAcknowledgmentExpected | Boolean | Whether the functional acknowledgement is configured in the X12 agreement. (Mandatory) |
| needAk2LoopForValidMessages | Boolean | Whether the AK2 loop is required for a valid message. (Mandatory) |
| segmentsCount | Integer | Number of segments in the X12 transaction set. (Optional) |
||||

## X12 transaction set acknowledgement tracking schema

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

| Property | Type | Description |
| --- | --- | --- |
| senderPartnerName | String | X12 message sender's partner name. (Optional) |
| receiverPartnerName | String | X12 message receiver's partner name. (Optional) |
| senderQualifier | String | Send partner qualifier. (Mandatory) |
| senderIdentifier | String | Send partner identifier. (Mandatory) |
| receiverQualifier | String | Receive partner qualifier. (Mandatory) |
| receiverIdentifier | String | Receive partner identifier. (Mandatory) |
| agreementName | String | Name of the X12 agreement to which the messages are resolved. (Optional) |
| direction | Enum | Direction of the message flow, receive or send. (Mandatory) |
| interchangeControlNumber | String | Interchange control number of the functional acknowledgement. Value populates only for the send side where functional acknowledgement is received for the messages sent to partner. (Optional) |
| functionalGroupControlNumber | String | Functional group control number of the functional acknowledgement. Value populates only for the send side where functional acknowledgement is received for the messages sent to partner. (Optional) |
| isaSegment | String | ISA segment of the message. Value populates only for the send side where functional acknowledgement is received for the messages sent to partner. (Optional) |
| gsSegment | String | GS segment of the message. Value populates only for the send side where functional acknowledgement is received for the messages sent to partner. (Optional) |
| respondingfunctionalGroupControlNumber | String | Responding interchange control number. (Optional) |
| respondingFunctionalGroupId | String | Responding functional group ID, which maps to AK101 in the acknowledgement. (Optional) |
| respondingtransactionSetControlNumber | String | Responding transaction set control number. (Optional) |
| respondingTransactionSetId | String | Responding transaction set ID, which maps to AK201 in the acknowledgement. (Optional) |
| statusCode | Boolean | Transaction set acknowledgement status code. (Mandatory) |
| segmentsCount | Enum | Acknowledgement status code. Allowed values are **Accepted**, **Rejected**, and **AcceptedWithErrors**. (Mandatory) |
| processingStatus | Enum | Processing status of the acknowledgement. Allowed values are **Received**, **Generated**, and **Sent**. (Mandatory) |
| CorrelationMessageId | String | Correlation message ID. A combination of {AgreementName}{*GroupControlNumber*}{TransactionSetControlNumber}. (Optional) |
| isMessageFailed | Boolean | Whether the X12 message failed. (Mandatory) |
| ak2Segment | String | Acknowledgement for a transaction set within the received functional group. (Optional) |
| ak3Segment | String | Reports errors in a data segment. (Optional) |
| ak5Segment | String | Reports whether the transaction set identified in the AK2 segment is accepted or rejected, and why. (Optional) |
||||

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

| Property | Type | Description |
| --- | --- | --- |
| senderPartnerName | String | X12 message sender's partner name. (Optional) |
| receiverPartnerName | String | X12 message receiver's partner name. (Optional) |
| senderQualifier | String | Send partner qualifier. (Mandatory) |
| senderIdentifier | String | Send partner identifier. (Mandatory) |
| receiverQualifier | String | Receive partner qualifier. (Mandatory) |
| receiverIdentifier | String | Receive partner identifier. (Mandatory) |
| agreementName | String | Name of the X12 agreement to which the messages are resolved. (Optional) |
| direction | Enum | Direction of the message flow, receive or send. (Mandatory) |
| interchangeControlNumber | String | Interchange control number. (Optional) |
| isaSegment | String | Message ISA segment. (Optional) |
| isTechnicalAcknowledgmentExpected | Boolean | Whether the technical acknowledgement is configured in the X12 agreement. (Mandatory) |
| isMessageFailed | Boolean | Whether the X12 message failed. (Mandatory) |
| isa09 | String | X12 document interchange date. (Optional) |
| isa10 | String | X12 document interchange time. (Optional) |
| isa11 | String | X12 interchange control standards identifier. (Optional) |
| isa12 | String | X12 interchange control version number. (Optional) |
| isa14 | String | X12 acknowledgement is requested. (Optional) |
| isa15 | String | Indicator for test or production. (Optional) |
| isa16 | String | Element separator. (Optional) |
||||

## X12 interchange acknowledgement tracking schema

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

| Property | Type | Description |
| --- | --- | --- |
| senderPartnerName | String | X12 message sender's partner name. (Optional) |
| receiverPartnerName | String | X12 message receiver's partner name. (Optional) |
| senderQualifier | String | Send partner qualifier. (Mandatory) |
| senderIdentifier | String | Send partner identifier. (Mandatory) |
| receiverQualifier | String | Receive partner qualifier. (Mandatory) |
| receiverIdentifier | String | Receive partner identifier. (Mandatory) |
| agreementName | String | Name of the X12 agreement to which the messages are resolved. (Optional) |
| direction | Enum | Direction of the message flow, receive or send. (Mandatory) |
| interchangeControlNumber | String | Interchange control number of the technical acknowledgement that's received from partners. (Optional) |
| isaSegment | String | ISA segment for the technical acknowledgement that's received from partners. (Optional) |
| respondingInterchangeControlNumber |String | Interchange control number for the technical acknowledgement that's received from partners. (Optional) |
| isMessageFailed | Boolean | Whether the X12 message failed. (Mandatory) |
| statusCode | Enum | Interchange acknowledgement status code. Allowed values are **Accepted**, **Rejected**, and **AcceptedWithErrors**. (Mandatory) |
| processingStatus | Enum | Acknowledgement status. Allowed values are **Received**, **Generated**, and **Sent**. (Mandatory) |
| ta102 | String | Interchange date. (Optional) |
| ta103 | String | Interchange time. (Optional) |
| ta105 | String | Interchange note code. (Optional) |
||||

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

| Property | Type | Description |
| --- | --- | --- |
| senderPartnerName | String | X12 message sender's partner name. (Optional) |
| receiverPartnerName | String | X12 message receiver's partner name. (Optional) |
| senderQualifier | String | Send partner qualifier. (Mandatory) |
| senderIdentifier | String | Send partner identifier. (Mandatory) |
| receiverQualifier | String | Receive partner qualifier. (Mandatory) |
| receiverIdentifier | String | Receive partner identifier. (Mandatory) |
| agreementName | String | Name of the X12 agreement to which the messages are resolved. (Optional) |
| direction | Enum | Direction of the message flow, receive or send. (Mandatory) |
| interchangeControlNumber | String | Interchange control number. (Optional) |
| functionalGroupControlNumber | String | Functional control number. (Optional) |
| gsSegment | String | Message GS segment. (Optional) |
| isTechnicalAcknowledgmentExpected | Boolean | Whether the technical acknowledgement is configured in the X12 agreement. (Mandatory) |
| isFunctionalAcknowledgmentExpected | Boolean | Whether the functional acknowledgement is configured in the X12 agreement. (Mandatory) |
| isMessageFailed | Boolean | Whether the X12 message failed. (Mandatory)|
| gs01 | String | Functional identifier code. (Optional) |
| gs02 | String | Application sender's code. (Optional) |
| gs03 | String | Application receiver's code. (Optional) |
| gs04 | String | Functional group date. (Optional) |
| gs05 | String | Functional group time. (Optional) |
| gs07 | String | Responsible agency code. (Optional) |
| gs08 | String | Version/release/industry identifier code. (Optional) |
||||

## X12 functional group acknowledgement tracking schema

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

| Property | Type | Description |
| --- | --- | --- |
| senderPartnerName | String | X12 message sender's partner name. (Optional) |
| receiverPartnerName | String | X12 message receiver's partner name. (Optional) |
| senderQualifier | String | Send partner qualifier. (Mandatory) |
| senderIdentifier | String | Send partner identifier. (Mandatory) |
| receiverQualifier | String | Receive partner qualifier. (Mandatory) |
| receiverIdentifier | String | Receive partner identifier. (Mandatory) |
| agreementName | String | Name of the X12 agreement to which the messages are resolved. (Optional) |
| direction | Enum | Direction of the message flow, receive or send. (Mandatory) |
| interchangeControlNumber | String | Interchange control number, which populates for the send side when a technical acknowledgement is received from partners. (Optional) |
| functionalGroupControlNumber | String | Functional group control number of the technical acknowledgement, which populates for the send side when a technical acknowledgement is received from partners. (Optional) |
| isaSegment | String | Same as interchange control number, but populated only in specific cases. (Optional) |
| gsSegment | String | Same as functional group control number, but populated only in specific cases. (Optional) |
| respondingfunctionalGroupControlNumber | String | Control number of the original functional group. (Optional) |
| respondingFunctionalGroupId | String | Maps to AK101 in the acknowledgement functional group ID. (Optional) |
| isMessageFailed | Boolean | Whether the X12 message failed. (Mandatory) |
| statusCode | Enum | Acknowledgement status code. Allowed values are **Accepted**, **Rejected**, and **AcceptedWithErrors**. (Mandatory) |
| processingStatus | Enum | Processing status of the acknowledgement. Allowed values are **Received**, **Generated**, and **Sent**. (Mandatory) |
| ak903 | String | Number of transaction sets received. (Optional) |
| ak904 | String | Number of transaction sets accepted in the identified functional group. (Optional) |
| ak9Segment | String | Whether the functional group identified in the AK1 segment is accepted or rejected, and why. (Optional) |
|||| 

## B2B protocol tracking schemas

For information about B2B protocol tracking schemas, see:

* [AS2 tracking schemas](../logic-apps/logic-apps-track-integration-account-as2-tracking-schemas.md)   
* [B2B custom tracking schemas](logic-apps-track-integration-account-custom-tracking-schema.md)

## Next steps

* Learn more about [monitoring B2B messages](logic-apps-monitor-b2b-message.md).
* Learn about [tracking B2B messages in Azure Monitor logs](../logic-apps/logic-apps-track-b2b-messages-omsportal.md).
