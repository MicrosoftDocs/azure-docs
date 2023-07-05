---
title: Azure Communication Services email logs
titleSuffix: An Azure Communication Services concept document
description: Learn about logging for Azure Communication Services email.
author: ddematheu2
services: azure-communication-services

ms.author: dademath
ms.date: 03/21/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
---

# Azure Communication Services email logs

Azure Communication Services offers logging capabilities that you can use to monitor and debug your Communication Services solution. These capabilities can be configured through the Azure portal.

> [!IMPORTANT]
> The following refers to logs enabled through [Azure Monitor](../../../../azure-monitor/overview.md) (see also [FAQ](../../../../azure-monitor/faq.yml)). To enable these logs for your Communications Services, see: [Enable logging in Diagnostic Settings](../enable-logging.md)

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
| `Category` | The log category of the event. Category is the granularity at which you can enable or disable logs on a particular resource. The properties that appear within the properties blob of an event are the same within a particular log category and resource type. |
| `Correlation ID` | The ID for correlated events. Can be used to identify correlated events between multiple tables. |
| `Properties` | Other data applicable to various modes of Communication Services. |
| `Record ID` | The unique ID for a given usage record. |
| `Usage Type` | The mode of usage. (for example, Chat, PSTN, NAT, etc.) |
| `Unit Type` | The type of unit that usage is based off for a given mode of usage. (for example, minutes, megabytes, messages, etc.). |
| `Quantity` | The number of units used or consumed for this record. |

## Email Send Mail operational logs

| Property | Description |
| -------- | ---------------|
| `TimeGenerated` | The timestamp (UTC) of when the log was generated. |
| `Location` | The region where the operation was processed. |
| `OperationName` | The operation associated with log record. |
| `OperationVersion` | The `api-version` associated with the operation, if the `operationName` was performed using an API. If there's no API that corresponds to this operation, the version represents the version of that operation in case the properties associated with the operation change in the future. |
| `Category` | The log category of the event. Category is the granularity at which you can enable or disable logs on a particular resource. The properties that appear within the properties blob of an event are the same within a particular log category and resource type. |
| `CorrelationID` | The ID for correlated events. Can be used to identify correlated events between multiple tables. For all Email operational logs, the CorrelationId is mapped to the MessageId, which is returned from a successful SendMail request. |
| `Size` | Represents the total size in megabytes of the email body, subject, headers and attachments. |
| `ToRecipientsCount` | The total # of unique email addresses on the To line. |
| `CcRecipientsCount` | The total # of unique email addresses on the Cc line. | 
| `BccRecipientsCount` | The total # of unique email addresses on the Bcc line. |
| `UniqueRecipientsCount` | This is the deduplicated total recipient count for the To, Cc and Bcc address fields. |
| `AttachmentsCount` | The total # of attachments. |

## Email Status Update operational logs

| Property | Description |
| -------- | ---------------|
| `TimeGenerated` | The timestamp (UTC) of when the log was generated. |
| `Location` | The region where the operation was processed. |
| `OperationName` | The operation associated with log record. |
| `OperationVersion` | The `api-version` associated with the operation, if the `operationName` was performed using an API. If there's no API that corresponds to this operation, the version represents the version of that operation in case the properties associated with the operation change in the future. |
| `Category` | The log category of the event. Category is the granularity at which you can enable or disable logs on a particular resource. The properties that appear within the properties blob of an event are the same within a particular log category and resource type. |
| `CorrelationID` | The ID for correlated events. Can be used to identify correlated events between multiple tables. For all Email operational logs, the CorrelationId is mapped to the MessageId, which is returned from a successful SendMail request. |
| `RecipientId` | The email address for the targeted recipient. If this is a message-level event, the property will be empty. |
| `DeliveryStatus` | The terminal status of the message. |

## Email User Engagement operational logs

| Property | Description |
| -------- | ---------------|
| `TimeGenerated` | The timestamp (UTC) of when the log was generated. |
| `Location` | The region where the operation was processed. |
| `OperationName` | The operation associated with log record. |
| `OperationVersion` | The `api-version` associated with the operation, if the `operationName` was performed using an API. If there's no API that corresponds to this operation, the version represents the version of that operation in case the properties associated with the operation change in the future. |
| `Category` | The log category of the event. Category is the granularity at which you can enable or disable logs on a particular resource. The properties that appear within the properties blob of an event are the same within a particular log category and resource type. |
| `CorrelationID` | The ID for correlated events. Can be used to identify correlated events between multiple tables. For all Email operational logs, the CorrelationId is mapped to the MessageId, which is returned from a successful SendMail request. |
| `RecipientId` | The email address for the targeted recipient. If this is a message-level event, the property will be empty. |
| `EngagementType` | The type of user engagement being tracked. |
| `EngagementContext` | The context represents what the user interacted with. |
| `UserAgent` | The user agent string from the client. |
