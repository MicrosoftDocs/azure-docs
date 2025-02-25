---
title: B2B message tracking schemas - Consumption workflows
description: Create tracking schemas to monitor B2B messages such as AS2, X12, or custom in Consumption workflows for Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 02/28/2024
# As a B2B integration solutions developer, I want to know about tracking schemas to monitor B2b messages for Consumption workflows in Azure Logic Apps.
---

# Tracking schemas for B2B messages in Consumption workflows for Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption](~/reusable-content/ce-skilling/azure/includes/logic-apps-sku-consumption.md)]

> [!NOTE]
> This article applies only to Consumption logic apps. For information about monitoring Standard logic apps, see 
> the following documentation:
>
> - [Enable or open Application Insights after deployment for Standard logic apps](create-single-tenant-workflows-azure-portal.md#enable-open-application-insights)
> - [Monitor and track B2B transactions in Standard workflows](monitor-track-b2b-transactions-standard.md)

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
      "agreementName": "",
      "as2From": "",
      "as2To": "",
      "receiverPartnerName": "",
      "senderPartnerName": ""
   },
   "messageProperties": {
      "correlationMessageId": "",
      "direction": "",
      "dispositionType": "",
      "fileName": "",
      "incomingHeaders": {},
      "isMdnExpected": "",
      "isMessageCompressed": "",
      "isMessageEncrypted": "",
      "isMessageFailed": "",
      "isMessageSigned": "",
      "isNrrEnabled": "",
      "mdnType": "",
      "messageId": "",
      "outgoingHeaders": {}
    }
}
```

The following table describes the properties in a tracking schema for an AS2 message:

| Property | Required | Type | Description |
|----------|----------|------|-------------|
| **`agreementName`** | No | String | Name for the AS2 agreement that resolves the messages |
| **`as2From`** | Yes | String | Name for the AS2 message sender in the AS2 message headers |
| **`as2To`** | Yes | String | Name for the AS2 message receiver in the AS2 headers |
| **`receiverPartnerName`** | No | String | Partner name for the AS2 message receiver |
| **`senderPartnerName`** | No | String | Partner name for the AS2 message sender |
| **`correlationMessageId`** | No | String | Message ID for correlating AS2 messages with Message Disposition Notifications (MDNs) |
| **`direction`** | Yes | String | Message flow direction, which is either **`send`** or **`receive`** |
| **`dispositionType`** | No | String | Disposition type for the Message Disposition Notification (MDN) |
| **`fileName`** | No | String | File name from the AS2 message header |
| **`incomingHeaders`** | No | JToken dictionary | Details for the incoming AS2 message header |
| **`isMdnExpected`** | Yes | Boolean | Whether to use the default value, if unknown |
| **`isMessageCompressed`** | Yes | Boolean | Whether the AS2 message is compressed |
| **`isMessageEncrypted`** | Yes | Boolean | Whether the AS2 message is encrypted |
| **`isMessageFailed`** | Yes | Boolean | Whether the AS2 message failed |
| **`isMessageSigned`** | Yes | Boolean | Whether the AS2 message is signed |
| **`isNrrEnabled`** | Yes | Boolean | Whether to use the default value, if unknown. |
| **`mdnType`** | Yes | Enum | Allowed values: **`NotConfigured`**, **`Sync`**, and **`Async`** |
| **`messageId`** | No | String | AS2 message ID in the AS2 message headers |
| **`outgoingHeaders`** | No | JToken dictionary | Details for the outgoing AS2 message header |

<a name="as2-mdn"></a>

### AS2 MDN tracking schema

The following syntax describes the tracking schema for an AS2 MDN message:

```json
{
   "agreementProperties": {
      "agreementName": "",
      "as2From": "",
      "as2To": "",
      "receiverPartnerName": "",
      "senderPartnerName": ""
   },
   "messageProperties": {
      "correlationMessageId": "",
      "direction": "",
      "dispositionType": "",
      "incomingHeaders": {},
      "messageId": "",
      "isMessageFailed": "",
      "isMessageSigned": "",
      "isNrrEnabled": "",
      "micVerificationStatus": "",
      "originalMessageId": "",
      "outgoingHeaders": {},
      "statusCode": ""
   }
}
```

The following table describes the properties in a tracking schema for an AS2 MDN message:

| Property | Required | Type | Description |
|----------|----------|------|-------------|
| **`agreementName`** | No | String | Name for the AS2 agreement that resolves the messages |
| **`as2From`** | Yes | String | Name for the AS2 message sender in the AS2 message headers |
| **`as2To`** | Yes | String | Name for the AS2 message receiver in the AS2 headers |
| **`receiverPartnerName`** | No | String | Partner name for the AS2 message receiver |
| **`senderPartnerName`** | No | String | Partner name for the AS2 message sender |
| **`correlationMessageId`** | No | String | Correlation ID, which is the ID for the original message that has the MDN configured |
| **`direction`** | Yes | String | Message flow direction, which is either **`send`** or **`receive`** |
| **`dispositionType`** | No | String | Disposition type for the Message Disposition Notification (MDN) |
| **`incomingHeaders`** | No | JToken dictionary | Details for the incoming AS2 message header |
| **`isMessageFailed`** | Yes | Boolean | Whether the AS2 message failed |
| **`isMessageSigned`** | Yes | Boolean | Whether the AS2 message is signed |
| **`isNrrEnabled`** | Yes | Boolean | Whether to use the default value, if unknown. |
| **`messageId`** | No | String | AS2 message ID in the AS2 message headers |
| **`micVerificationStatus`** | Yes | Enum | Allowed values: **`NotApplicable`**, **`Succeeded`**, and **`Failed`** |
| **`originalMessageId`** | No | String | Original AS2 message ID |
| **`outgoingHeaders`** | No | JToken dictionary | Details for the outgoing AS2 message header |
| **`statusCode`** | Yes | Enum | Allowed values: **`Accepted`**, **`Rejected`**, and **`AcceptedWithErrors`** |

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
      "agreementName": "",
      "receiverPartnerName": "",
      "receiverIdentifier": "",
      "receiverQualifier": "",
      "senderIdentifier": "",
      "senderPartnerName": "",
      "senderQualifier": ""
   },
   "messageProperties": {
      "correlationMessageId": "",
      "direction": "",
      "functionalGroupControlNumber": "",
      "interchangeControlNumber": "",
      "isFunctionalAcknowledgmentExpected": "",
      "isMessageFailed": "",
      "isTechnicalAcknowledgmentExpected": "",
      "messageType": "",
      "needAk2LoopForValidMessages": "",
      "segmentsCount": "",
      "transactionSetControlNumber": ""
   }
}
```

The following table describes the attributes in a tracking schema for an X12 transaction set:

| Property | Required | Type | Description |
|----------|----------|------|-------------|
| **`agreementName`** | No | String | Name for the X12 agreement that resolves the messages |
| **`receiverIdentifier`** | Yes | String | Identifier for the partner X12 message receiver |
| **`receiverPartnerName`** | No | String | Name for the partner X12 message receiver |
| **`receiverQualifier`** | Yes | String | Qualifier for the partner X12 message receiver |
| **`senderIdentifier`** | Yes | String | Identifier for the partner X12 messsage sender |
| **`senderPartnerName`** | No | String | Name for the partner X12 message sender |
| **`senderQualifier`** | Yes | String | Qualifier for the partner X12 message sender |
| **`correlationMessageId`** | No | String | Message correlation ID, which combines these values: **{agreement-name}{group-control-number}{transaction-set-control-number}** |
| **`direction`** | Yes | Enum | Message flow direction, which is either **`send`** or **`receive`** |
| **`functionalGroupControlNumber`** | No | String | Functional group control number for the functional acknowledgment |
| **`isMessageFailed`** | Yes | Boolean | Whether the X12 message failed |
| **`interchangeControlNumber`** | No | String | Interchange control number for the functional acknowledgment |
| **`isMessageFailed`** | Yes | Boolean | Whether the X12 message failed |
| **`isTechnicalAcknowledgmentExpected`** | Yes | Boolean | Whether the technical acknowledgment is configured in the X12 agreement |
| **`isFunctionalAcknowledgmentExpected`** | Yes | Boolean | Whether the functional acknowledgment is configured in the X12 agreement |
| **`messageType`** | No | String | Transaction set or document type |
| **`needAk2LoopForValidMessages`** | Yes | Boolean | Whether the AK2 loop is required for a valid message |
| **`segmentsCount`** | No | Integer | Number of segments in the X12 transaction set |
| **`transactionSetControlNumber`** | No | String | Control number for the transaction set |

<a name="x12-transaction-set-acknowledgment"></a>

### X12 transaction set acknowledgment tracking schema

The following syntax describes the tracking schema for an X12 transaction set acknowledgment:

```json
{
   "agreementProperties": {
      "agreementName": "",
      "receiverIdentifier": "",
      "receiverPartnerName": "",
      "receiverQualifier": "",
      "senderIdentifier": "",
      "senderPartnerName": "",
      "senderQualifier": ""
   },
   "messageProperties": {
      "correlationMessageId": "",
      "direction": "",
      "functionalGroupControlNumber": "",
      "interchangeControlNumber": "",
      "isaSegment": "",
      "gsSegment": "",
      "isMessageFailed": "",
      "processingStatus": "",
      "respondingFunctionalGroupControlNumber": "",
      "respondingFunctionalGroupId": "",
      "respondingTransactionSetControlNumber": "",
      "respondingTransactionSetId": "",
      "statusCode": "",
      "ak2Segment": "",
      "ak3Segment": "",
      "ak5Segment": ""
   }
}
```

The following table describes the attributes in a tracking schema for an X12 transaction set acknowledgment:

| Property | Required | Type | Description |
|----------|----------|------|-------------|
| **`agreementName`** | No | String | Name for the X12 agreement that resolves the messages |
| **`receiverIdentifier`** | Yes | String | Identifier for the partner X12 message receiver |
| **`receiverPartnerName`** | No | String | Name for the partner X12 message receiver |
| **`receiverQualifier`** | Yes | String | Qualifier for the partner X12 message receiver |
| **`senderIdentifier`** | Yes | String | Identifier for the partner X12 messsage sender |
| **`senderPartnerName`** | No | String | Name for the partner X12 message sender |
| **`senderQualifier`** | Yes | String | Qualifier for the partner X12 message sender |
| **`correlationMessageId`** | No | String | Message correlation ID, which combines these values: **{agreement-name}{group-control-number}{transaction-set-control-number}** |
| **`direction`** | Yes | Enum | Message flow direction, which is either **`send`** or **`receive`** |
| **`functionalGroupControlNumber`** | No | String | Functional group control number for the functional acknowledgment. This value populates only for the sender when a functional acknowledgment is received for the messages sent to the partner. |
| **`interchangeControlNumber`** | No | String | Interchange control number for the functional acknowledgment. This value populates only for the sender when a functional acknowledgment is received for the messages sent to the partner. |
| **`isaSegment`** | No | String | The ISA segment for the X12 message. This value populates only for the sender when a functional acknowledgment is received for the messages sent to the partner. |
| **`gsSegment`** | No | String | GS segment in the X12 message. This value populates only for the sender when a functional acknowledgment is received for the messages sent to the partner. |
| **`isMessageFailed`** | Yes | Boolean | Whether the X12 message failed |
| **`processingStatus`** | Yes | Enum | Processing status for the acknowledgment with these permitted values: **`Received`**, **`Generated`**, and **`Sent`** |
| **`respondingFunctionalGroupControlNumber`** | No | String | Control number for the responding functional group |
| **`respondingFunctionalGroupId`** | No | String | ID for the responding functional group that maps to AK101 in the acknowledgment |
| **`respondingTransactionSetControlNumber`** | No | String | Control number for the responding transaction set |
| **`respondingTransactionSetId`** | No | String | ID for the responding transaction set that maps to AK201 in the acknowledgment |
| **`statusCode`** | Yes | Boolean | Acknowledgment status code for the transaction set |
| **`ak2Segment`** | No | String | Acknowledgment for a transaction set in the received functional group |
| **`ak3Segment`** | No | String | Reports errors in a data segment |
| **`ak5Segment`** | No | String | Reports whether the transaction set identified in the AK2 segment is accepted or rejected, and why |

<a name="x12-interchange"></a>

### X12 interchange tracking schema

The following syntax describes the tracking schema for an X12 interchange:

```json
{
   "agreementProperties": {
      "agreementName": "",
      "receiverIdentifier": "",
      "receiverPartnerName": "",
      "receiverQualifier": "",
      "senderIdentifier": "",
      "senderPartnerName": "",
      "senderQualifier": ""
   },
   "messageProperties": {
      "direction": "",
      "interchangeControlNumber": "",
      "isaSegment": "",
      "isMessageFailed": "",
      "isTechnicalAcknowledgmentExpected": "",
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
| **`agreementName`** | No | String | Name for the X12 agreement that resolves the messages |
| **`receiverIdentifier`** | Yes | String | Identifier for the partner X12 message receiver |
| **`receiverPartnerName`** | No | String | Name for the partner X12 message receiver |
| **`receiverQualifier`** | Yes | String | Qualifier for the partner X12 message receiver |
| **`senderIdentifier`** | Yes | String | Identifier for the partner X12 messsage sender |
| **`senderPartnerName`** | No | String | Name for the partner X12 message sender |
| **`senderQualifier`** | Yes | String | Qualifier for the partner X12 message sender |
| **`direction`** | Yes | Enum | Message flow direction, which is either **`send`** or **`receive`** |
| **`interchangeControlNumber`** | No | String | Interchange control number |
| **`isaSegment`** | No | String | The ISA segment for the X12 message |
| **`isMessageFailed`** | Yes | Boolean | Whether the X12 message failed |
| **`isTechnicalAcknowledgmentExpected`** | Yes | Boolean | Whether the technical acknowledgment is configured in the X12 agreement |
| *`isa09`** | No | String | X12 document interchange date |
| *`isa10`** | No | String | X12 document interchange time |
| *`isa11`** | No | String | X12 interchange control standards identifier |
| *`isa12`** | No | String | X12 interchange control version number |
| *`isa14`** | No | String | X12 acknowledgment is requested |
| *`isa15`** | No | String | Indicator for test or production |
| *`isa16`** | No | String | Element separator |

<a name="x12-interchange-acknowledgment"></a>

### X12 interchange acknowledgment tracking schema

The following syntax describes the tracking schema for an X12 interchange acknowledgment:

```json
{
   "agreementProperties": {
      "agreementName": "",
      "receiverIdentifier": "",
      "receiverPartnerName": "",
      "receiverQualifier": "",
      "senderIdentifier": "",
      "senderPartnerName": "",
      "senderQualifier": ""
   },
   "messageProperties": {
      "direction": "",
      "interchangeControlNumber": "",
      "isaSegment": "",
      "isMessageFailed": "",
      "respondingInterchangeControlNumber": "",
      "processingStatus": "",
      "statusCode": "",
      "ta102": "",
      "ta103": "",
      "ta105": ""
   }
}
```

The following table describes the attributes in a tracking schema for an X12 interchange acknowledgment:

| Property | Required | Type | Description |
|----------|----------|------|-------------|
| **`agreementName`** | No | String | Name for the X12 agreement that resolves the messages |
| **`receiverIdentifier`** | Yes | String | Identifier for the partner X12 message receiver |
| **`receiverPartnerName`** | No | String | Name for the partner X12 message receiver |
| **`receiverQualifier`** | Yes | String | Qualifier for the partner X12 message receiver |
| **`senderIdentifier`** | Yes | String | Identifier for the partner X12 messsage sender |
| **`senderPartnerName`** | No | String | Name for the partner X12 message sender |
| **`senderQualifier`** | Yes | String | Qualifier for the partner X12 message sender |
| **`direction`** | Yes | Enum | Message flow direction, which is either **`send`** or **`receive`** |
| **`interchangeControlNumber`** | No | String | Interchange control number for the technical acknowledgment that is received from partners |
| **`isaSegment`** | No | String | The ISA segment for the technical acknowledgment that is received from partners |
| **`isMessageFailed`** | Yes | Boolean | Whether the X12 message failed |
| **`respondingInterchangeControlNumber`** | No | String | Interchange control number for the technical acknowledgment that is received from partners |
| **`statusCode`** | Yes | Enum | Interchange acknowledgment status code with these permitted values: **`Accepted`**, **`Rejected`**, and **`AcceptedWithErrors`** |
| **`processingStatus`** | Yes | Enum | Processing status for the acknowledgment with these permitted values: **`Received`**, **`Generated`**, and **`Sent`** |
| **`ta102`** | No | String | Interchange date |
| **`ta103`** | No | String | Interchange time |
| **`ta105`** | No | String | Interchange note code |

<a name="x12-functional-group"></a>

### X12 functional group tracking schema

The following syntax describes the tracking schema for an X12 functional group:

```json
{
   "agreementProperties": {
      "agreementName": "",
      "receiverIdentifier": "",
      "receiverPartnerName": "",
      "receiverQualifier": "",
      "senderIdentifier": "",
      "senderPartnerName": "",
      "senderQualifier": ""
   },
   "messageProperties": {
      "direction": "",
      "functionalGroupControlNumber": "",
      "gsSegment": "",
      "interchangeControlNumber": "",
      "isFunctionalAcknowledgmentExpected": "",
      "isMessageFailed": "",
      "isTechnicalAcknowledgmentExpected": "",
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
| **`agreementName`** | No | String | Name for the X12 agreement that resolves the messages |
| **`receiverIdentifier`** | Yes | String | Identifier for the partner X12 message receiver |
| **`receiverPartnerName`** | No | String | Name for the partner X12 message receiver |
| **`receiverQualifier`** | Yes | String | Qualifier for the partner X12 message receiver |
| **`senderIdentifier`** | Yes | String | Identifier for the partner X12 messsage sender |
| **`senderPartnerName`** | No | String | Name for the partner X12 message sender |
| **`senderQualifier`** | Yes | String | Qualifier for the partner X12 message sender |
| **`direction`** | Yes | Enum | Message flow direction, which is either **`send`** or **`receive`** |
| **`functionalGroupControlNumber`** | No | String | Functional group control number |
| **`gsSegment`** | No | String | GS segment in the X12 message |
| **`interchangeControlNumber`** | No | String | Interchange control number |
| **`isFunctionalAcknowledgmentExpected`** | Yes | Boolean | Whether the functional acknowledgment is configured in the X12 agreement |
| **`isMessageFailed`** | Yes | Boolean | Whether the X12 message failed |
| **`isTechnicalAcknowledgmentExpected`** | Yes | Boolean | Whether the technical acknowledgment is configured in the X12 agreement |
| **`gs01`** | No | String | Functional identifier code |
| **`gs02`** | No | String | Application sender code |
| **`gs03`** | No | String | Application receiver code |
| **`gs04`** | No | String | Functional group date |
| **`gs05`** | No | String | Functional group time |
| **`gs07`** | No | String | Responsible agency code |
| **`gs08`** | No | String | Identifier code for the version, release, or industry |

<a name="x12-functional-group-acknowledgment"></a>

### X12 functional group acknowledgment tracking schema

The following syntax describes the tracking schema for an X12 functional group acknowledgment:

```json
{
   "agreementProperties": {
      "agreementName": "",
      "receiverIdentifier": "",
      "receiverPartnerName": "",
      "receiverQualifier": "",
      "senderIdentifier": "",
      "senderPartnerName": "",
      "senderQualifier": ""
   },
   "messageProperties": {
      "direction": "",
      "functionalGroupControlNumber": "",
      "interchangeControlNumber": "",
      "gsSegment": "",
      "isaSegment": "",
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
| **`agreementName`** | No | String | Name for the X12 agreement that resolves the messages |
| **`receiverIdentifier`** | Yes | String | Identifier for the partner X12 message receiver |
| **`receiverPartnerName`** | No | String | Name for the partner X12 message receiver |
| **`receiverQualifier`** | Yes | String | Qualifier for the partner X12 message receiver |
| **`senderIdentifier`** | Yes | String | Identifier for the partner X12 messsage sender |
| **`senderPartnerName`** | No | String | Name for the partner X12 message sender |
| **`senderQualifier`** | Yes | String | Qualifier for the partner X12 message sender |
| **`direction`** | Yes | Enum | Message flow direction, which is either **`send`** or **`receive`** |
| **`functionalGroupControlNumber`** | No | String | Functional group control number for the technical acknowledgment. This value populates for the sender when a technical acknowledgment is received from partners. |
| **`gsSegment`** | No | String | Same as **`functionalGrouControlNumber`**, but populates only in specific cases |
| **`interchangeControlNumber`** | No | String | Interchange control number, which populates for the sender when a technical acknowledgment is received from partners |
| **`isaSegment`** | No | String | Same as **interchangeControlNumber**, but populates only in specific cases |
| **`isFunctionalAcknowledgmentExpected`** | Yes | Boolean | Whether the functional acknowledgment is configured in the X12 agreement |
| **`isMessageFailed`** | Yes | Boolean | Whether the X12 message failed |
| **`respondingFunctionalGroupControlNumber`** | No | String | Control number for the original functional group |
| **`respondingFunctionalGroupId`** | No | String | Maps to AK101 in the acknowledgment functional group ID |
| **`statusCode`** | Yes | Enum | Acknowledgment status code with these permitted values: **`Accepted`**, **`Rejected`**, and **`AcceptedWithErrors`** |
| **`processingStatus`** | Yes | Enum | Processing status for the acknowledgment with these permitted values: **`Received`**, **`Generated`**, and **`Sent`** |
| **`ak903`** | No | String | Number of received transaction sets |
| **`ak904`** | No | String | Number of accepted transaction sets in the identified functional group |
| **`ak9Segment`** | No | String | Whether the functional group identified in the AK1 segment is accepted or rejected, and why |

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
         "clientRequestId": "",
         "correlationId": "",
         "repeatItemScopeName": "",
         "repeatItemIndex": ,
         "trackingId": ""
      }
   },
   "events": [
      {
         "eventLevel": "",
         "eventTime": "",
         "record": {},
         "recordType": ""
      }
   ]
}
```

The following table describes the attributes in a custom tracking schema:

| Property | Required | Type | Description |
|----------|----------|------|-------------|
| **`sourceType`** | Yes | String | Type for the run source with these permitted values: **`Microsoft.Logic/workflows`**, `custom`** |
| **`source`** | Yes | String or JToken | If the source type is **`Microsoft.Logic/workflows`**, the source information must follow this schema. If the source type is **`custom`**, the schema has JToken type. |
| **`systemId`** | Yes | String | The system ID for the logic app |
| **`runId`** | Yes | String | The run ID for the logic app |
| **`operationName`** | Yes | String | Name for the operation, for example, action or trigger |
| **`repeatItemScopeName`** | Yes | String | Repeat the item name if the action is in a **`foreach`** or **`until`** loop |
| **`repeatItemIndex`** | Yes | Integer | Repeated item index number to indicate that the action is in a **`foreach`** or **`until`** loop |
| **`trackingId`** | No | String | Tracking ID to correlate the messages |
| **`correlationId`** | No | String | Correlation ID to correlate the messages |
| **`clientRequestId`** | No | String | Client can populate this property to correlate messages |
| **`eventLevel`** | Yes | String | Event level |
| **`eventTime`** | Yes | DateTime | Event time in UTC format: YYYY-MM-DDTHH:MM:SS.00000Z |
| **`record`** | Yes | JToken | Custom record type in JToken format only |
| **`recordType`** | Yes | String | Track record type with this permitted value only: **`custom`** |

## Related content

* [Monitor B2B messages with Azure Monitor logs](../logic-apps/monitor-b2b-messages-log-analytics.md)