---
title: Table schemas for tracking B2B transactions - Standard workflows
description: Learn about table schemas to use for tracking B2B transactions data for Standard workflows in Azure Logic Apps.
services: logic-apps
ms.topic: how-to
ms.reviewer: estfan, divswa, pravagar, azla
ms.date: 03/07/2025
# As a B2B integration solutions developer, I want to better understand the table structures used fo storing B2B transaction data for Standard workflows in Azure Logic Apps.
---

# Table schemas for tracking B2B transactions for Standard workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

Azure Logic Apps includes built-in tracking that you can enable for parts of your Standard workflow. To help you monitor the successful delivery or receipt, errors, and properties for business-to-business (B2B) messages, this guide helps you better understand the tables that store B2B tracking data for your transactions.

> [!NOTE]
> ### WorkflowRunOperationInfo type Uses a specific JSON schema

<a name="as2-table"></a>

## AS2 tracking table - AS2TrackRecords

The Azure Database Explorer table named **AS2TrackRecords** stores all AS2 tracking data. The following sample describes the query that creates this table and the required order for specifying the table columns:

```kusto
.create table AS2TrackRecords (
   IntegrationAccountSubscriptionId: string, // Subscription ID for the integration account.
   IntegrationAccountResourceGroup: string, // Resource group for the integration account.
   IntegrationAccountName: string, // Name for the integration account.
   IntegrationAccountId: string, // ID for the integration account.
   WorkflowRunOperationInfo: dynamic, // Operation information for the workflow run.
   ClientRequestId: string, // Client request ID.
   EventTime: datetime, // Time of the event.
   Error: dynamic, // Error, if any.
   RecordType: string, // Type of tracking record.
   Direction: string, // Message flow direction, which is either 'send' or 'receive'.
   IsMessageFailed: bool, // Whether the AS2 message failed.
   MessageProperties: dynamic, // Message properties.
   AdditionalProperties: dynamic, // Additional properties.
   TrackingId: string, // Custom tracking ID, if any.
   AgreementName: string, // Name for the AS2 agreement that resolves the messages.
   As2From: string, // Name for the AS2 message sender in the AS2 message headers.
   As2To: string, // Name for the AS2 message receiver in the AS2 headers.
   ReceiverPartnerName: string, // Partner name for the AS2 message receiver.
   SenderPartnerName: string, // Partner name for the AS2 message sender.
   MessageId: string, // AS2 message ID.
   OriginalMessageId: string,// Original AS2 message ID.
   CorrelationMessageId: string, // Message ID for correlating AS2 messages with Message Disposition Notifications (MDNs).
   IsMdnExpected: bool // Whether the Message Dispoition Notification (MDN) is expected.
)
```

### AS2 MessageProperties type

The **MessageProperties** column has a **dynamic** type structure, which uses a different JSON schema based on the tracking record type.

#### AS2 message tracking record - MessageProperties schema

```json
{
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
```

| Property | Type | Description |
|----------|------|-------------|
| **direction** | String | Message flow direction (**`send`** or **`receive`**) |
| **messageId** | String | AS2 message ID from AS2 message header |
| **dispositionType** | String | Disposition type for the Message Disposition Notification (MDN) |
| **fileName** | String | File name from the AS2 message header |
| **isMessageFailed** | Boolean | Whether the AS2 message failed |
| **isMessageSigned** | Boolean | Whether the AS2 message was signed |
| **isMessageEncrypted** | Boolean | Whether the AS2 message was encrypted |
| **isMessageCompressed** | Boolean | Whether the AS2 message was compressed |
| **correlationMessageId** | String | Message ID for correlatating AS2 messages with Message Disposition Notifications (MDNs) |
| **incomingHeaders** | JToken dictionary | Header details for the incoming AS2 message |
| **outgoingHeaders** | JToken dictionary | Header details for the outgoing AS2 message |
| **isNrrEnabled** | Boolean | Whether Non-Repudiation of Receipt (NRR) is enabled |
| **isMdnExpected** | Boolean | Is the Message Disposition Notification (MDN) expected |
| **mdnType** | Enum | Allowed values: **`NotConfigured`**, **`Sync`**, and **`Async`** |

#### AS2 MDN tracking record - MessageProperties schema

```json
{
   "direction": "",
   "messageId": "",
   "originalMessageId": "",
   "dispositionType": "",
   "isMessageFailed": "",
   "isMessageSigned": "",
   "isNrrEnabled": "",
   "statusCode": "",
   "micVerificationStatus" "",
   "correlationMessageId": "",
   "incomingHeaders": {},
   "outgoingHeaders": {},
}
```

| Property | Type | Description |
|----------|------|-------------|
| **direction** | String | Message flow direction (**`send`** or **`receive`**) |
| **messageId** | String | AS2 message ID from AS2 message header |
| **originalMessageId** | String | Message ID for the original AS2 message |
| **dispositionType** | String | Disposition type for the Message Disposition Notification (MDN) |
| **isMessageFailed** | Boolean | Whether the AS2 message failed |
| **isMessageSigned** | Boolean | Whether the AS2 message was signed |
| **isNrrEnabled** | Boolean | Whether Non-Repudiation of Receipt (NRR) is enabled |
| **statusCode** | Enum | Allowed values: **`Accepted`**, **`Rejected`**, and **`AcceptedWithErrors`** |
| **micVerificationStatus** | Enum | Allowed values: **`NotApplicable`**, **`Succeeded`**, and **`Failed`** |
| **correlationMessageId** | String | Correlation ID, which is the ID for the original message that has the MDN configured |
| **incomingHeaders** | JToken dictionary | Header details for the incoming AS2 message |
| **outgoingHeaders** | JToken dictionary | Header details for the outgoing AS2 message |

<a name="x12-table"></a>

## X12 tracking table – EdiTrackRecords

The Azure Database Explorer table named **EdiTrackRecords** stores all X12 tracking data. The following sample describes the query that creates this table and the required order for specifying the table columns:

```kusto
.create table EdiTrackRecords (
   IntegrationAccountSubscriptionId: string, // Subscription ID for the integration account.
   IntegrationAccountResourceGroup: string, // Resource group for the integration account.
   IntegrationAccountName: string, // Name for the integration account.
   IntegrationAccountId: string, // ID for the integration account.
   WorkflowRunOperationInfo: dynamic, // Operation information for the workflow run.
   ClientRequestId: string, // Client request ID.
   EventTime: datetime, // Time of the event.
   Error: dynamic, // Error, if any.
   RecordType: string, // Type of tracking record.
   Direction: string, // Message flow direction, which is either 'receive' or 'send'.
   IsMessageFailed: bool, // Whether the message failed.
   MessageProperties: dynamic, // Message properties.
   AdditionalProperties: dynamic, // Additional properties.
   TrackingId: string, // Custom tracking ID, if any.
   AgreementName: string, // Name for the agreement that resolves the messages.
   SenderPartnerName: string, // Partner name for the message sender.
   ReceiverPartnerName: string, // Partner name for the X12 message receiver.
   SenderQualifier: string, // Qualifier for the partner X12 message sender.
   SenderIdentifier: string, // Identifier for the partner X12 message sender.
   ReceiverQualifier: string, // Qualifier for the partner X12 message receiver.
   ReceiverIdentifier: string, // Identiifer for the partner X12 message receiver.
   TransactionSetControlNumber: string, // Control number for the transaction set.
   FunctionalGroupControlNumber: string, // Functional group control number.
   InterchangeControlNumber: string, // Interchange control number.
   MessageType: string, // Transaction set or document type.
   RespondingTransactionSetControlNumber: string, // Control number for the responding transaction set, in case of acknowledgment.
   RespondingFunctionalGroupControlNumber: string, // Control number for the responding functional group, in case of acknowledgment.
   RespondingInterchangeControlNumber: string, // Control number for the responding interchange, in case of acknowledgement.
   ProcessingStatus: string // Acknowledgment processing status with these permitted values: 'Received', 'Generated', and 'Sent'
)
```

### X12 MessageProperties type

The **MessageProperties** column has a **dynamic** type structure, which uses a different JSON schema based on the tracking record type.

#### X12 transaction set tracking record - MessageProperties schema

```json
{
   "direction": "",
   "interchangeControlNumber": "",
   "functionalGroupControlNumber": "",
   "transactionSetControlNumber": "",
   "correlationMessageId": "",
   "messageType": "",
   "isMessageFailed": "",
   "isTechnicalAcknowledgmentExpected": "",
   "isFunctionalAcknowledgmentExpected": "",
   "needAk2LoopForValidMessages": "",
   "segmentsCount": ""
}
```

| Property | Type | Description |
|----------|------|-------------|
| **direction** | String | Message flow direction (**`send`** or **`receive`**) |
| **interchangeControlNumber** | String | Interchange control number for the functional acknowledgment |
| **functionalGroupControlNumber** | String | Functional group control number for the functional acknowledgment |
| **transactionSetControlNumber** | String | Control number for the transaction set |
| **correlationMessageId** | String | Message correlation ID, which combines these values: {**AgreementName**}{**FunctionalGroupControlNumber**}{**TransactionSetControlNumber**} |
| **messageType** | String | Transaction set or document type |
| **isMessageFailed** | Boolean | Whether the X12 message failed |
| **isTechnicalAcknowledgmentExpected** | Boolean | Whether the technical acknowledgment is configured in the X12 agreement |
| **isFunctionalAcknowledgmentExpected** | Boolean | Whether the functional acknowledgment is configured in the X12 agreement |
| **needAk2LoopForValidMessages** | Boolean | Whether the AK2 loop is required for a valid message |
| **segmentsCount** | Integer | Number of segments in the X12 transaction set |

#### X12 transaction set acknowledgement - MessageProperties schema

```json
{
   "direction": "",
   "interchangeControlNumber": "",
   "functionalGroupControlNumber": "",
   "transactionSetControlNumber": "",
   "correlationMessageId": "",
   "messageType": "",
   "isMessageFailed": "",
   "isTechnicalAcknowledgmentExpected": "",
   "isFunctionalAcknowledgmentExpected": "",
   "needAk2LoopForValidMessages": "",
   "segmentsCount": ""
}
```



## Related content

- [Monitor and track B2B transactions - Standard workflows](monitor-track-b2b-transactions-standard.md)