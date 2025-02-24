---
title: B2B tracking table schemas - Standard workflows
description: Learn more about the schemas for tracking tables that store B2B transaction data for Standard workflows in Azure Logic Apps.
services: logic-apps
ms.topic: how-to
ms.reviewer: estfan, divswa, pravagar, azla
ms.date: 02/28/2025
# As a B2B integration solutions developer, I want to better understand the structures for the tables that store B2B transaction data for Standard workflows in Azure Logic Apps.
---

# B2B tracking table schemas for Standard workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

Azure Logic Apps includes built-in tracking that you can enable for parts of your Standard workflow. To help you monitor the successful delivery or receipt, errors, and properties for business-to-business (B2B) messages, this guide helps you better understand the tables that store B2B tracking data for your transctions.

<a name="as2-table"></a>

## AS2 tracking table - AS2TrackRecords

The Azure Database Explorer table named **AS2TrackRecords** stores all AS2 tracking data. The following sample decribes the query that creates this table:

```kusto
.create table AS2TrackRecords (
   IntegrationAccountSubscriptionId: string, // Subscription ID for the integration account.
   IntegrationAccountResourceGroup: string, // Resource ID for the integration account.
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
   As2From: string, // Name for the AS2 message sender in the AS2 message headers.
   As2To: string, // Name for the AS2 message receiver in the AS2 headers.
   ReceiverPartnerName: string, // Partner name for the AS2 message receiver.
   SenderPartnerName: string, // Partner name for the AS2 message sender.
   MessageId: string, // AS2 message ID in the AS2 message headers.
   OriginalMessageId: string,// Original AS2 message ID.
   CorrelationMessageId: string, // AS2 message ID used to correlate messages with Message Disposition Notifications (MDNs).
   IsMdnExpected: bool // Whether to use the default value, if unknown.
)
```

<a name="x12-table"></a>

## X12 tracking table – EdiTrackRecords

The Azure Database Explorer table named **EdiTrackRecords** stores all X12 tracking data. The following sample decribes the query that creates this table:

```kusto
.create table EdiTrackRecords (
   IntegrationAccountSubscriptionId: string, // Subscription ID for the integration account.
   IntegrationAccountResourceGroup: string, // Resource ID for the integration account.
   IntegrationAccountName: string, // Name for the integration account.
   IntegrationAccountId: string, // ID for the integration account.
   WorkflowRunOperationInfo: dynamic, // Operation information for the workflow run.
   ClientRequestId: string, // Client request ID.
   EventTime: datetime, // Time of the event.
   Error: dynamic, // Error, if any.
   RecordType: string, // Type of tracking record.
   Direction: string, // Message low direction, which is either 'receive' or 'send'.
   IsMessageFailed: bool, // Whether the message failed.
   MessageProperties: dynamic, // Message properties.
   AdditionalProperties: dynamic, // Additional properties.
   TrackingId: string, // Custom tracking ID, if any.
   AgreementName: string, // Name for the agreement that resolves the messages.
   SenderPartnerName: string, // Partner name for the message sender.
   ReceiverPartnerName: string, // Partner name for the message receiver.
   SenderQualifier: string, // Qualifier for the partner message sender.
   SenderIdentifier: string, // Identifier for the partner message sender.
   ReceiverQualifier: string, // Qualifier for the partner message receiver.
   ReceiverIdentifier: string, // Identiifer for the partner message receiver.
   TransactionSetControlNumber: string, // Control number for the transaction set.
   FunctionalGroupControlNumber: string, // Control number for the functional group of the functional acknowledgment.
   InterchangeControlNumber: string, // Control number for the interchange of the functional acknowledgment.
   MessageType: string, // Transaction set or document type.
   RespondingTransactionSetControlNumber: string, // Control number for the responding transaction set, in case of acknowledgment.
   RespondingFunctionalGroupControlNumber: string, // Control number for the responding functional group, in case of acknowledgment.
   RespondingInterchangeControlNumber: string, // Control number for the responding interchange, in case of acknowledgement.
   ProcessingStatus: string // Acknowledgment processing status with these permitted values: 'Received', 'Generated', and 'Sent'
)
```

## Related content

- [Monitor and track B2B transactions - Standard workflows](monitor-track-b2b-transactions.md)