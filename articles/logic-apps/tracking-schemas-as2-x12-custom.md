---
title: B2B message monitoring using tracking schemas
description: Create tracking schemas to monitor B2B messages such as AS2, X12, or custom in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 08/10/2023
---

# Tracking schemas for monitoring B2B messages in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

Azure Logic Apps includes built-in tracking that you can enable for parts of your workflow. To help you monitor the successful delivery or receipt, errors, and properties for business-to-business (B2B) messages, you can create and use AS2, X12, and custom tracking schemas in your integration account. This reference guide describes the syntax and attributes for these tracking schemas.

## AS2

- [AS2 message tracking schema](#as2-message)
- [AS2 Message Disposition Notification (MDN) tracking schema](#as2-mdn)

<a name="as2-message"></a>

### AS2 message tracking schema

The following syntax describes the tracking schema for an AS2 message:

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

The following table describes the attributes in a tracking schema for an AS2 message:

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

<a name="as2-mdn"></a>

### AS2 MDN tracking schema

The following syntax describes the tracking schema for an AS2 MDN message:

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

The following table describes the attributes in a tracking schema for an AS2 MDN message:

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

## X12

- [X12 transaction set tracking schema](#x12-transaction-set)
- [X12 transaction set acknowledgment tracking schema](#x12-transaction-set-acknowledgment)
- [X12 interchange tracking schema](#x12-interchange)
- [X12 interchange acknowledgment tracking schema](#x12-interchange-acknowledgment)
- [X12 functional group tracking schema](#x12-functional-group)
- [X12 functional group acknowledgment tracking schema](#x12-functional-group-acknowledgment)

<a name="x12-transaction-set"></a>

### X12 transaction set tracking schema

The following syntax describes the tracking schema for an X12 transaction set:

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

The following table describes the attributes in a tracking schema for an X12 transaction set:

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

<a name="x12-transaction-set-acknowledgment"></a>

### X12 transaction set acknowledgment tracking schema

The following syntax describes the tracking schema for an X12 transaction set acknowledgment:

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

The following table describes the attributes in a tracking schema for an X12 transaction set acknowledgment:

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

<a name="x12-interchange"></a>

### X12 interchange tracking schema

The following syntax describes the tracking schema for an X12 interchange:

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

The following table describes the attributes in a tracking schema for an X12 interchange:

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

<a name="x12-interchange-acknowledgment"></a>

### X12 interchange acknowledgment tracking schema

The following syntax describes the tracking schema for an X12 interchange acknowledgment:

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

The following table describes the attributes in a tracking schema for an X12 interchange acknowledgment:

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

<a name="x12-functional-group"></a>

### X12 functional group tracking schema

The following syntax describes the tracking schema for an X12 functional group:

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

The following table describes the attributes in a tracking schema for an X12 functional group:

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

<a name="x12-functional-group-acknowledgment"></a>

### X12 functional group acknowledgment tracking schema

The following syntax describes the tracking schema for an X12 functional group acknowledgment:

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

The following table describes the attributes in a tracking schema for an X12 functional group acknowledgment:

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

<a name="custom"></a>

## Custom

You can set up custom tracking that logs events from the start to the end of your logic app workflow. For example, you can log events from layers that include your workflow, SQL Server, BizTalk Server, or any other layer. The following section provides custom tracking schema code that you can use in the layers outside your workflow.

```json
{
   "sourceType": "",
   "source": {
      "workflow": {
         "systemId": ""
      },
      "runInstance": {
         "runId": ""
      },
      "operation": {
         "operationName": "",
         "repeatItemScopeName": "",
         "repeatItemIndex": ,
         "trackingId": "",
         "correlationId": "",
         "clientRequestId": ""
      }
   },
   "events": [
      {
         "eventLevel": "",
         "eventTime": "",
         "recordType": "",
         "record": {}
      }
   ]
}
```

The following table describes the attributes in a custom tracking schema:

| Property | Required | Type | Description |
|----------|----------|------|-------------|
| sourceType | Yes | String | Type of the run source with these permitted values: `Microsoft.Logic/workflows`, `custom` |
| source | Yes | String or JToken | If the source type is `Microsoft.Logic/workflows`, the source information needs to follow this schema. If the source type is `custom`, the schema is a JToken. |
| systemId | Yes | String | Logic app system ID |
| runId | Yes | String | Logic app run ID |
| operationName | Yes | String | Name of the operation, for example, action or trigger |
| repeatItemScopeName | Yes | String | Repeat item name if the action is inside a `foreach`or `until` loop |
| repeatItemIndex | Yes | Integer | Indicates that the action is inside a `foreach` or `until` loop and is the repeated item index number. |
| trackingId | No | String | Tracking ID to correlate the messages |
| correlationId | No | String | Correlation ID to correlate the messages |
| clientRequestId | No | String | Client can populate this property to correlate messages |
| eventLevel | Yes | String | Level of the event |
| eventTime | Yes | DateTime | Time of the event in UTC format: *YYYY-MM-DDTHH:MM:SS.00000Z* |
| recordType | Yes | String | Type of the track record with this permitted value only: `custom` |
| record | Yes | JToken | Custom record type with JToken format only |

## Next steps

* [Monitor B2B messages with Azure Monitor logs](../logic-apps/monitor-b2b-messages-log-analytics.md)