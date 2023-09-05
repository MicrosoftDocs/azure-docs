---
title: Azure Communication Services email logs
titleSuffix: An Azure Communication Services concept document
description: Learn about logging for Azure Communication Services email.
author: mkhribech
services: azure-communication-services

ms.author: mkhribech
ms.date: 06/01/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
---

# Azure Communication Services email logs

Azure Communication Services offers logging capabilities that you can use to monitor and debug your Communication Services solution. These capabilities can be configured through the Azure portal.

## Prerequisites

Azure Communications Services provides monitoring and analytics features via [Azure Monitor Logs overview](../../../../azure-monitor/logs/data-platform-logs.md) and [Azure Monitor Metrics](../../../../azure-monitor/essentials/data-platform-metrics.md). Each Azure resource requires its own diagnostic setting, which defines the following criteria:
  * Categories of logs and metric data sent to the destinations defined in the setting. The available categories will vary for different resource types.
  * One or more destinations to send the logs. Current destinations include Log Analytics workspace, Event Hubs, and Azure Storage.
  * A single diagnostic setting can define no more than one of each of the destinations. If you want to send data to more than one of a particular destination type (for example, two different Log Analytics workspaces), then create multiple settings. Each resource can have up to five diagnostic settings.

> [!IMPORTANT]
> You must enable a Diagnostic Setting in Azure Monitor to send the log data of your surveys to a Log Analytics workspace, Event Hubs, or an Azure storage account to receive and analyze your survey data. If you do not send call automation data to one of these options your survey data will not be stored and will be lost
The following are instructions for configuring your Azure Monitor resource to start creating logs and metrics for your Communications Services. For detailed documentation about using Diagnostic Settings across all Azure resources, see: [Enable logging in Diagnostic Settings](../enable-logging.md)

> [!NOTE]
> Under diagnostic setting name please select  select “Email Service Delivery Status Update Logs”, "Email Service Send Mail logs", "Email Service User Engagement Logs" to enable the logs for emails
>
>  :::image type="content" source="..\logs\email-diagnostic-log.png" alt-text="Screenshot of diagnostic settings for Email.":::

## Resource log categories

Communication Services offers the following types of logs that you can enable:

* **Usage logs** - provides usage data associated with each billed service offering
* **Email Send Mail operational logs** - provides detailed information related to the Email service send mail requests.
* **Email Status Update operational logs** - provides message and recipient level delivery status updates related to the Email service send mail requests.
* **Email User Engagement operational logs** - provides information related to 'open' and 'click' user engagement metrics for messages sent from the Email service.

## Usage logs schema

| Property | Description |
| -------- | ---------------|
| `Timestamp` | The timestamp (UTC) of when the log was generated. |
| `Operation Name` | The operation associated with log record. |
| `Operation Version` | The `api-version` associated with the operation, if the operationName was performed using an API. If there's no API that corresponds to this operation, the version represents the version of that operation in case the properties associated with the operation change in the future. |
| `Category` | The log category of the event. The category is the granularity at which you can enable or disable logs on a particular resource. The properties that appear within the properties blob of an event are the same within a particular log category and resource type. |
| `Correlation ID` | The ID for correlated events. Can be used to identify correlated events between multiple tables. |
| `Properties` | Other data applicable to various modes of Communication Services. |
| `Record ID` | The unique ID for a given usage record. |
| `Usage Type` | The mode of usage. (for example, Chat, PSTN, NAT, etc.) |
| `Unit Type` | The type of unit that usage is based off for a given mode of usage. (for example, minutes, megabytes, messages, etc.). |
| `Quantity` | The number of units used or consumed for this record. |

## Email Send Mail operational logs

*Email Send Mail Operational logs* provide valuable insights into API request trends over time. This data helps you discover key email analytics, such as the total number of emails sent, email size, and number of emails with attachments. This information can be quickly analyzed in near-real-time and visualized in a user-friendly way to help drive better decision-making. 

| Property | Description |
| -------- | ---------------|
| `TimeGenerated` | The timestamp (UTC) of when the log was generated. |
| `Location` | The region where the operation was processed. |
| `OperationName` | The operation associated with the log record. |
| `OperationVersion` | The `api-version` associated with the operation, if the `operationName` was performed using an API. If there's no API that corresponds to this operation, the version represents the version of that operation in case the properties associated with the operation change in the future. |
| `Category` | The log category of the event. The category is the granularity at which you can enable or disable logs on a particular resource. The properties that appear within the properties blob of an event are the same within a particular log category and resource type. |
| `CorrelationID` | The ID for correlated events. Can be used to identify correlated events between multiple tables. For all Email operational logs, the CorrelationId is mapped to the MessageId, which is returned from a successful SendMail request. |
| `Size` | Represents the total size of the email body, subject, headers and attachments in megabytes. |
| `ToRecipientsCount` | The total # of unique email addresses on the To line. |
| `CcRecipientsCount` | The total # of unique email addresses on the Cc line. | 
| `BccRecipientsCount` | The total # of unique email addresses on the Bcc line. |
| `UniqueRecipientsCount` | This is the deduplicated total recipient count for the To, Cc, and Bcc address fields. |
| `AttachmentsCount` | The total # of attachments. |

**Samples**

``` json
{
  "OperationType":"SendMail", 
  "OperationCategory":"EmailSendMailOperational",
  "Size":0.026019,
  "ToRecipientsCount":2,
  "CcRecipientsCount":3, 
  "BccRecipientsCount":1, 
  "UniqueRecipientsCount":6, 
  "AttachmentsCount":0
}
```

## Email Status Update operational logs

*Email status update operational logs* provide in-depth insights into message and recipient level delivery status updates on your sendmail API requests. These logs offer message-specific details, such as the time of delivery, as well as recipient-level details, such as email addresses and delivery status updates. By tracking these logs, you can ensure full visibility into your email delivery process, quickly identifying any issues that may arise and taking corrective action as necessary.

| Property | Description |
| -------- | ---------------|
| `TimeGenerated` | The timestamp (UTC) of when the log was generated. |
| `Location` | The region where the operation was processed. |
| `OperationName` | The operation associated with the log record. |
| `OperationVersion` | The `api-version` associated with the operation, if the `operationName` was performed using an API. If there's no API that corresponds to this operation, the version represents the version of that operation in case the properties associated with the operation change in the future. |
| `Category` | The log category of the event. The category is the granularity at which you can enable or disable logs on a particular resource. The properties that appear within the properties blob of an event are the same within a particular log category and resource type. |
| `CorrelationID` | The ID for correlated events. Can be used to identify correlated events between multiple tables. For all Email operational logs, the CorrelationId is mapped to the MessageId, which is returned from a successful SendMail request. |
| `RecipientId` | The email address for the targeted recipient. If this is a message-level event, the property will be empty. |
| `DeliveryStatus` | The terminal status of the message. |
| `SmtpStatusCode` | SMTP status code returned from the recipient email server in response to a send mail request.
| `EnhancedSmtpStatusCode` | Enhanced SMTP status code returned from the recipient email server.
| `SenderDomain` | The domain portion of the SenderAddress used in sending emails.
| `SenderUsername` | The username portion of the SenderAddress used in sending emails.
| `IsHardBounce` | Signifies whether a delivery failure was due to a permanent or temporary issue. IsHardBounce == true means a permanent mailbox issue preventing emails from being delivered.

**Samples**

``` json
{
  "OperationType":"DeliveryStatusUpdate", 
  "OperationCategory":"EmailStatusUpdateOperational", 
  "RecipientId":"user@email.com", 
  "DeliveryStatus":"Delivered", 
  "SenderDomain":"contoso.com", 
  "SenderUsername":"donotreply", 
  "IsHardBounce":false
}
```

## Email User Engagement operational logs

*Email user engagement operational logs* provide insights into email engagement trends for your email system. This data helps you track and analyze key email metrics such as open rates, click-through rates, and unsubscribe rates. These logs can be stored and analyzed, allowing you to gain deeper insights into your email system's performance, and adapt your strategy accordingly. Overall, Email User Engagement operational logs provide a powerful tool for improving your email system's performance, proactively measuring, and optimizing your email campaigns, and improving user engagement over time.

| Property | Description |
| -------- | ---------------|
| `TimeGenerated` | The timestamp (UTC) of when the log was generated. |
| `Location` | The region where the operation was processed. |
| `OperationName` | The operation associated with the log record. |
| `OperationVersion` | The `api-version` associated with the operation, if the `operationName` was performed using an API. If there's no API that corresponds to this operation, the version represents the version of that operation in case the properties associated with the operation change in the future. |
| `Category` | The log category of the event. The category is the granularity at which you can enable or disable logs on a particular resource. The properties that appear within the properties blob of an event are the same within a particular log category and resource type. |
| `CorrelationID` | The ID for correlated events. Can be used to identify correlated events between multiple tables. For all Email operational logs, the CorrelationId is mapped to the MessageId, which is returned from a successful SendMail request. |
| `RecipientId` | The email address for the targeted recipient. If this is a message-level event, the property will be empty. |
| `EngagementType` | The type of user engagement being tracked. |
| `EngagementContext` | The context represents what the user interacted with. |
| `UserAgent` | The user agent string from the client. |

**Samples**

``` json
{
    "OperationType": "UserEngagementUpdate",
    "OperationCategory": "EmailUserEngagementOperational",
    "EngagementType": "View",
    "UserAgent": "Mozilla/5.0"
}

{
  "OperationType":"UserEngagementUpdate", 
  "OperationCategory":"EmailUserEngagementOperational",
  "EngagementType":"Click",
  "EngagementContext":"https://www.contoso.com/support?id=12345", 
  "UserAgent":"Mozilla/5.0"
}
```