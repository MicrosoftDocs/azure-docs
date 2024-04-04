---
title: Azure Communication Services SMS logs
titleSuffix: An Azure Communication Services concept document
description: Learn about logging for Azure Communication Services SMS.
author: mkhribech
services: azure-communication-services

ms.author: mkhribech
ms.date: 04/14/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
---

# Azure Communication Services SMS Logs

Azure Communication Services offers logging capabilities that you can use to monitor and debug your Communication Services solution. These capabilities can be configured through the Azure portal.

> [!IMPORTANT]
> The following refers to logs enabled through [Azure Monitor](../../../../azure-monitor/overview.md) (see also [FAQ](../../../../azure-monitor/overview.md#frequently-asked-questions)). To enable these logs for your Communications Services, see: [Enable logging in Diagnostic Settings](../enable-logging.md)

## Pre-requisites

Azure Communications Services provides monitoring and analytics features via [Azure Monitor Logs overview](../../../../azure-monitor/logs/data-platform-logs.md) and [Azure Monitor Metrics](../../../../azure-monitor/essentials/data-platform-metrics.md). Each Azure resource requires its own diagnostic setting, which defines the following criteria:
  * Categories of logs and metric data sent to the destinations defined in the setting. The available categories will vary for different resource types.
  * One or more destinations to send the logs. Current destinations include Log Analytics workspace, Event Hubs, and Azure Storage.
  * A single diagnostic setting can define no more than one of each of the destinations. If you want to send data to more than one of a particular destination type (for example, two different Log Analytics workspaces), then create multiple settings. Each resource can have up to five diagnostic settings.

The following are instructions for configuring your Azure Monitor resource to start creating logs and metrics for your Communications Services. For detailed documentation about using Diagnostic Settings across all Azure resources, see: [Enable logging in Diagnostic Settings](../enable-logging.md)

> [!NOTE]
> Under diagnostic setting name please select “SMS Operational” to enable the logs for SMS.

## **Overview**

SMS operational logs are records of events and activities that provide insights into your SMS API requests. They captured details about the performance and functionality of the SMS primitive, including details about the status of message whether they were successfully delivered, blocked, or failed to send.
SMS operational logs contain information that help identify trends and patterns, resolve issues that might be impacting performance such failed message deliveries or serve issues. The logs include the following details:
 *   Messages sent.
 *   Message received.
 *   Messages delivered. 
 *   Messages opt-in & opt-out.  

## Resource log categories

Communication Services offers the following types of logs that you can enable:

* **Usage logs** - provides usage data associated with each billed service offering
* **SMS operational logs** - provides basic information related to the SMS service


### Usage logs schema

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

### SMS operational logs

| Property | Description |
| -------- | ---------------|
| `TimeGenerated` | The timestamp (UTC) of when the log was generated. |
| `OperationName` | The operation associated with log record. |
| `CorrelationID` | The ID for correlated events. Can be used to identify correlated events between multiple tables. |
| `OperationVersion` | The api-version associated with the operation, if the operationName was performed using an API. If there's no API that corresponds to this operation, the version represents the version of that operation in case the properties associated with the operation change in the future. |
| `Category` | The log category of the event. Category is the granularity at which you can enable or disable logs on a particular resource. The properties that appear within the properties blob of an event are the same within a particular log category and resource type. |
| `ResultType` | The status of the operation. |
| `ResultSignature` | The sub status of the operation. If this operation corresponds to a REST API call, this field is the HTTP status code of the corresponding REST call. |
| `ResultDescription` | The static text description of this operation. |
| `DurationMs` | The duration of the operation in milliseconds. |
| `CallerIpAddress` | The caller IP address, if the operation corresponds to an API call that would come from an entity with a publicly available IP address. |
| `Level` | The severity level of the event. |
| `URI` | The URI of the request. |
| `OutgoingMessageLength` | The number of characters in the outgoing message. |
| `IncomingMessageLength` | The number of characters in the incoming message. |
| `DeliveryAttempts` | The number of attempts made to deliver this message. |
| `PhoneNumber` | The phone number the SMS message is being sent from. |
| `SdkType` | The SDK type used in the request. |
| `PlatformType` | The platform type used in the request. |
| `Method` | The method used in the request. |
|`NumberType`| The type of number, the SMS message is being sent from. It can be either **LongCodeNumber** or **ShortCodeNumber** or **DynamicAlphaSenderID**|
|`MessageID`|Represent the unique messageId generated for every outgoing and incoming message. This can be found in the SMS API response object|
|`Country`|Represent the countries/regions where the SMS messages were sent to or received from|

#### Example SMS sent log

```json

    [
      {
        "TimeGenerated": "2022-09-26T15:58:30.100Z",
        "OperationName": "SMSMessagesSent",
        "CorrelationId": "dDRmubfpNZZZZZnxBtw3Q.0",
        "OperationVersion": "2020-07-20-preview1",
        "Category":"SMSOperational",
        "ResultType": "Succeeded",
        "ResultSignature": 202,
        "DurationMs": 130,
        "CallerIpAddress": "127.0.0.1",
        "Level": "Informational",
        "URI": "https://sms-e2e-prod.communication.azure.com/sms?api-version=2020-07-20-preview1",
        "OutgoingMessageLength": 151,
        "IncomingMessageLength": 0,
        "DeliveryAttempts": 0,
        "PhoneNumber": "+18445791704",
        "NumberType": "LongCodeNumber",
        "SdkType": "azsdk-net-Communication.Sms",
        "PlatformType": "Microsoft Windows 10.0.17763",
        "Method": "POST",
        "MessageId": "Outgoing_20230118181300ff00e5c9-876d-4958-86e3-4637484fe5bd_noam",
        "Country": "US"
      }
    ]

```

#### Example SMS delivery report log
```json

    [
      {
        "TimeGenerated": "2022-09-26T15:58:30.200Z",
        "OperationName": "SMSDeliveryReportsReceived",
        "CorrelationId": "tl8WpUTESTSTSTccYadXJm.0",
        "Category":"SMSOperational",
        "ResultType": "Succeeded",
        "ResultSignature": 200,
        "DurationMs": 130,
        "CallerIpAddress": "127.0.0.1",
        "Level": "Informational",
        "URI": "https://global.smsgw.prod.communication.microsoft.com/rtc/telephony/sms/DeliveryReport",
        "OutgoingMessageLength": 0,
        "IncomingMessageLength": 0,
        "DeliveryAttempts": 1,
        "PhoneNumber": "+18445791704",
        "NumberType": "LongCodeNumber",
        "SdkType": "",
        "PlatformType": "",
        "Method": "POST",
        "MessageId": "Outgoing_20230118181300ff00e5c9-876d-4958-86e3-4637484fe5bd_noam",
        "Country": "US"
      }
    ]

```

#### Example SMS received log
```json

    [
      {
        "TimeGenerated": "2022-09-27T15:58:30.200Z",
        "OperationName": "SMSMessagesReceived",
        "CorrelationId": "e2KFTSTSTI/5PTx4ZZB.0",
        "Category":"SMSOperational",
        "ResultType": "Succeeded",
        "ResultSignature": 200,
        "DurationMs": 130,
        "CallerIpAddress": "127.0.0.1",
        "Level": "Informational",
        "URI": "https://global.smsgw.prod.communication.microsoft.com/rtc/telephony/sms/inbound",
        "OutgoingMessageLength": 0,
        "IncomingMessageLength": 110,
        "DeliveryAttempts": 0,
        "PhoneNumber": "+18445791704",
        "NumberType": "LongCodeNumber",
        "SdkType": "",
        "PlatformType": "",
        "Method": "POST",
        "MessageId": "Incoming_2023011818121211c6ee31-63fe-477c-8d51-f800543c6694",
        "Country": "US"
      }
    ]

```

 (see also [FAQ](../../../../azure-monitor/overview.md#frequently-asked-questions)). 
