---
title: Schemas for tracking B2B transactions - Standard workflows
description: Learn about schemas for tracking B2B transactions in Standard workflows for Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.topic: how-to
ms.reviewer: estfan, divswa, pravagar, azla
ms.date: 03/20/2025
# As a B2B integration solutions developer, I want to better understand the data structures used fo storing B2B transaction data for Standard workflows in Azure Logic Apps.
---

# Tracking schemas for B2B transactions in Standard workflows for Azure Logic Apps (Preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!NOTE]
>
> This capability is in preview and is subject to the
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Logic Apps includes built-in tracking that you can enable for parts of your Standard workflow. To help you monitor the successful delivery or receipt, errors, and properties for business-to-business (B2B) messages, this guide helps you better understand the tables that store B2B tracking data for your transactions.

> [!NOTE]
>
> This article applies only to Standard logic app workflows. For information 
> about monitoring Consumption logic app workflows, see the following documentation:
>
> - [Monitor and track B2B transactions in Consumption workflows](monitor-track-b2b-messages-consumption.md)
> - [Tracking schemas for B2B transactions in Consumption workflows](tracking-schemas-consumption.md)

<a name="as2-table"></a>

## AS2TrackRecords tracking table for AS2

The Azure Database Explorer table named **AS2TrackRecords** stores all AS2 tracking data. The following sample describes the query that creates this table and the required order for specifying the table columns:

```kusto
.create table AS2TrackRecords (
   IntegrationAccountSubscriptionId: string, // Subscription ID for the integration account.
   IntegrationAccountResourceGroup: string, // Resource group for the integration account.
   IntegrationAccountName: string, // Name for the integration account.
   IntegrationAccountId: string, // ID for the integration account.
   WorkflowRunOperationInfo: dynamic, // Operation information for the workflow run. This dynamic type uses a specific JSON schema.
   ClientRequestId: string, // Client request ID.
   EventTime: datetime, // Time of the event.
   Error: dynamic, // Error, if any.
   RecordType: string, // Type of tracking record.
   Direction: string, // Message flow direction, which is either 'send' or 'receive'.
   IsMessageFailed: bool, // Whether the AS2 message failed.
   MessageProperties: dynamic, // Message properties. This dynamic type uses different schema based on the tracking record type.
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

> [!NOTE]
>
> The **WorkflowRunOperationInfo** table column has a **dynamic** type structure, 
> which uses a specific JSON schema. The **MessageProperties** table column also 
> has a **dynamic** type structure, but uses different JSON schema, based on the 
> tracking record type. For more information, see the following sections:
>
> - [WorkflowRunOperationInfo schema](#workflow-run-operation-schema)
> - [AS2 tracking record - MessageProperties schemas](#as2-message-properties)
> - [X12 tracking record - MessageProperties schemas](#x12-message-properties)

<a name="as2-message-properties"></a>

### AS2 tracking record - MessageProperties schemas

The **MessageProperties** table column has a **dynamic** type structure that uses different JSON schema, based on the tracking record type.

#### AS2 message - MessageProperties schema

The following syntax describes the **MessageProperties** schema when the tracking record type is an AS2 message:

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
| **correlationMessageId** | String | Message ID for correlating AS2 messages with Message Disposition Notifications (MDNs) |
| **incomingHeaders** | JToken dictionary | Header details for the incoming AS2 message |
| **outgoingHeaders** | JToken dictionary | Header details for the outgoing AS2 message |
| **isNrrEnabled** | Boolean | Whether Non-Repudiation of Receipt (NRR) is enabled |
| **isMdnExpected** | Boolean | Is the Message Disposition Notification (MDN) expected |
| **mdnType** | Enum | Allowed values: **`NotConfigured`**, **`Sync`**, and **`Async`** |

#### AS2 MDN - MessageProperties schema

The following syntax describes the **MessageProperties** schema when the tracking record type is an AS2 MDN:

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

## EdiTrackRecords tracking table for X12

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
   FunctionalGroupControlNumber: string, // Control number for the functional group.
   InterchangeControlNumber: string, // Control number for the interchange.
   MessageType: string, // Transaction set or document type.
   RespondingTransactionSetControlNumber: string, // Control number for the responding transaction set, in case of acknowledgment.
   RespondingFunctionalGroupControlNumber: string, // Control number for the responding functional group, in case of acknowledgment.
   RespondingInterchangeControlNumber: string, // Control number for the responding interchange, in case of acknowledgement.
   ProcessingStatus: string // Acknowledgment processing status with these permitted values: 'Received', 'Generated', and 'Sent'
)
```

<a name="x12-message-properties"></a>

### X12 tracking record - MessageProperties schemas

The **MessageProperties** table column has a **dynamic** type structure that uses different JSON schema, based on the tracking record type.

#### X12 transaction set - MessageProperties schema

The following syntax describes the **MessageProperties** schema when the tracking record type is an X12 transaction set:

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
| **direction** | Enum | Message flow direction (**`send`** or **`receive`**) |
| **interchangeControlNumber** | String | Control number for the interchange |
| **functionalGroupControlNumber** | String | Control number for the functional group |
| **transactionSetControlNumber** | String | Control number for the transaction set |
| **correlationMessageId** | String | Message correlation ID, which combines these values: {**AgreementName**}{**Interchange-or-FunctionalGroup-ControlNumber**}{**TransactionSetControlNumber**} |
| **messageType** | String | Transaction set or document type |
| **isMessageFailed** | Boolean | Whether the X12 message failed |
| **isTechnicalAcknowledgmentExpected** | Boolean | Whether the technical acknowledgment is configured in the X12 agreement |
| **isFunctionalAcknowledgmentExpected** | Boolean | Whether the functional acknowledgment is configured in the X12 agreement |
| **needAk2LoopForValidMessages** | Boolean | Whether the AK2 loop is required for a valid message |
| **segmentsCount** | Integer | Number of segments in the X12 transaction set |

#### X12 transaction set acknowledgment - MessageProperties schema

The following syntax describes the **MessageProperties** schema when the tracking record type is an X12 transaction set acknowledgment:

```json
{
   "direction": "",
   "interchangeControlNumber": "",
   "functionalGroupControlNumber": "",
   "respondingFunctionalGroupControlNumber": "",
   "respondingFunctionalGroupId": "",
   "respondingTransactionSetId": "",
   "statusCode": "",
   "processingStatus": "",
   "correlationMessageId": "",
   "isMessageFailed": ""
}
```

| Property | Type | Description |
|----------|------|-------------|
| **direction** | String | Message flow direction (**`send`** or **`receive`**) |
| **interchangeControlNumber** | String | Interchange control number for the functional acknowledgment. This value populates only for the sender when a functional acknowledgment is received for the messages sent to the partner. |
| **functionalGroupControlNumber** | String | Functional group control number for the functional acknowledgment. This value populates only for the sender when a functional acknowledgment is received for the messages sent to the partner. |
| **respondingFunctionalGroupControlNumber** | String | Control number for the responding functional group |
| **respondingFunctionalGroupId** | String | Control number for the responding functional group |
| **respondingTransactionSetId** | String | ID for the responding functional group that maps to AK101 in the acknowledgment |
| **statusCode** | Boolean | Acknowledgment status code for the transaction set |
| **processingStatus** | Enum | Acknowledgment processing status with these permitted values: **`Received`**, **`Generated`**, and **`Sent`** |
| **correlationMessageId** | String | Message correlation ID, which combines these values: {**AgreementName**}{**InterchangeORFunctionalGroupControlNumber**}{**TransactionSetControlNumber**} |
| **isMessageFailed** | String | Whether the X12 message failed |

#### X12 interchange - MessageProperties schema

The following syntax describes the **MessageProperties** schema when the tracking record type is an X12 interchange:

```json
{
   "direction": "",
   "interchangeControlNumber": "",
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
```

| Property | Type | Description |
|----------|------|-------------|
| **direction** | Enum | Message flow direction (**`send`** or **`receive`**) |
| **interchangeControlNumber** | String | Control number for the interchange |
| **isTechnicalAcknowledgmentExpected** | Boolean | Whether the technical acknowledgment is configured in the X12 agreement |
| **isMessageFailed** | Boolean | Whether the X12 message failed |
| **isa09** | String | X12 document interchange date |
| **isa10** | String | X12 document interchange time |
| **isa11** | String | X12 interchange control standards identifier |
| **isa12** | String | X12 interchange control version number |
| **isa14** | String | X12 acknowledgment is requested |
| **isa15** | String | Indicator for test or production |
| **isa16** | String | Element separator |

#### X12 interchange acknowledgment - MessageProperties schema

The following syntax describes the **MessageProperties** schema when the tracking record type is an X12 interchange acknowledgment:

```json
{
   "direction": "",
   "interchangeControlNumber": "",
   "respondingInterchangeControlNumber": "",
   "isMessageFailed": "",
   "statusCode": "",
   "processingStatus": "",
   "ta102": "",
   "ta103": "",
   "ta105": ""
}
```

| Property | Type | Description |
|----------|------|-------------|
| **direction** | Enum | Message flow direction (**`send`** or **`receive`**) |
| **interchangeControlNumber** | String | Interchange control number for the technical acknowledgment that is received from partners |
| **isMessageFailed** | Boolean | Whether the X12 message failed |
| **statusCode** | Boolean | Interchange acknowledgment status code with these permitted values: **`Accepted`**, **`Rejected`**, and **`AcceptedWithErrors`** |
| **processingStatus** | Enum | Acknowledgment processing status with these permitted values: **`Received`**, **`Generated`**, and **`Sent`** |
| **ta102** | String | Interchange date |
| **ta103** | String | Interchange time |
| **ta103** | String | Interchange note code |

#### X12 functional group - MessageProperties schema

The following syntax describes the **MessageProperties** schema when the tracking record type is an X12 functional group:

```json
{
   "direction": "",
   "interchangeControlNumber": "",
   "functionalGroupControlNumber": "",
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
```

| Property | Type | Description |
|----------|------|-------------|
| **direction** | Enum | Message flow direction (**`send`** or **`receive`**) |
| **interchangeControlNumber** | String | Control number for the interchange |
| **functionalGroupControlNumber** | String | Control number for the functional group |
| **isTechnicalAcknowledgmentExpected** | Boolean | Whether the technical acknowledgment is configured in the X12 agreement |
| **isFunctionalAcknowledgmentExpected** | Boolean | Whether the functional acknowledgment is configured in the X12 agreement |
| **isMessageFailed** | Boolean | Whether the X12 message failed |
| **gs01** | String | Functional group identifier code |
| **gs02** | String | Application sender code |
| **gs03** | String | Application receiver code |
| **gs04** | String | Functional group date |
| **gs05** | String | Functional group time |
| **gs07** | String | Responsible agency code |
| **gs08** | String | Identifier code for the version, release, or industry |

#### X12 functional group acknowledgment - MessageProperties schema

The following syntax describes the **MessageProperties** schema when the tracking record type is an X12 functional group acknowledgment:

```json
{
   "direction": "",
   "interchangeControlNumber": "",
   "functionalGroupControlNumber": "",
   "respondingFunctionalGroupControlNumber": "",
   "respondingFunctionalGroupId": "",
   "isMessageFailed": "",
   "statusCode": "",
   "processingStatus": "",
   "ak903": "",
   "ak904": "",
}
```

| Property | Type | Description |
|----------|------|-------------|
| **direction** | Enum | Message flow direction (**`send`** or **`receive`**) |
| **interchangeControlNumber** | String | Control number for the interchange. This value populates for the sender when a technical acknowledgment is received from partners. |
| **functionalGroupControlNumber** | String | Control number for the functional group |
| **respondingFunctionalGroupControlNumber** | String | Control number for the original functional group |
| **respondingFunctionalGroupId** | String | Maps to AK101 in the acknowledgment functional group ID |
| **statusCode** | Enum | Acknowledgment status code with these permitted values: **`Accepted`**, **`Rejected`**, and **`AcceptedWithErrors`** |
| **processingStatus** | String | Acknowledgment processing status with these permitted values: **`Received`**, **`Generated`**, and **`Sent`** |
| **ak903** | String | Number of received transaction sets |
| **ak903** | String | Number of accepted transaction sets in the identified functional group |

<a name="workflow-run-operation-schema"></a>

## WorkflowRunOperationInfo schema

The **WorkflowRunOperationInfo** table column in the **AS2TrackRecords** table and **EdiTrackRecords** table captures information about the Standard logic app workflow run. This column has a **dynamic** type structure that uses the following JSON schema:

```json
{
   "title": "WorkflowRunOperationInfo",
   "type": "object",
   "properties": {
      "Workflow": {
         "type": "object",
         "properties": {
            "SystemId": {
               "type": "string",
               "description": "The workflow system ID."
            },
            "SubscriptionId": {
               "type": "string",
               "description": "The subscription ID of the workflow."
            },
            "ResourceGroup": {
               "type": "string",
               "description": "The resource group name of the workflow."
            },
            "LogicAppName": {
               "type": "string",
               "description": "The logic app name of the workflow."
            },
            "Name": {
               "type": "string",
               "description": "The name of the workflow."
            },
            "Version": {
               "type": "string",
               "description": "The version of the workflow."
            }
         }
      },
      "RunInstance": {
         "type": "object",
         "properties": {
            "RunId": {
               "type": "string",
               "description": "The logic app run id."
            },
            "TrackingId": {
               "type": "string",
               "description": "The tracking id of the run."
            },
            "ClientTrackingId": {
               "type": "string",
               "description": "The client tracking id of the run."
            }
         }
      },
      "Operation": {
         "type": "object",
         "properties": {
            "OperationName": {
               "type": "string",
               "description": "The logic app operation name."
            },
            "RepeatItemScopeName": {
               "type": "string",
               "description": "The repeat item scope name."
            },
            "RepeatItemIndex": {
            "type": "integer",
            "description": "The repeat item index."
            },
            "RepeatItemBatchIndex": {
               "type": "integer",
               "description": "The index of the repeat item batch."
            },
            "TrackingId": {
               "type": "string",
               "description": "The tracking id of the logic app operation."
            },
            "CorrelationId": {
               "type": "string",
               "description": "The correlation id of the logic app operation."
            },
            "ClientRequestId": {
               "type": "string",
               "description": "The client request id of the logic app operation."
            },
            "OperationTrackingId": {
               "type": "string",
               "description": "The operation tracking id of the logic app operation."
            }
         }
      }
   }
}
```

## Related content

- [Monitor and track B2B transactions - Standard workflows](monitor-track-b2b-transactions-standard.md)
