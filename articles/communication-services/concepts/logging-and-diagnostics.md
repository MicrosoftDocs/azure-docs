---
title: Communication Services Logs
titleSuffix: An Azure Communication Services concept document
description: Learn about logging in Azure Communication Services
author: probableprime
manager: chpalm
services: azure-communication-services

ms.author: rifox
ms.date: 06/30/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
---

# Communication Services logs

Azure Communication Services offers logging capabilities that you can use to monitor and debug your Communication Services solution. These capabilities can be configured through the Azure portal.

## Enable diagnostic logs in your resource

Logging is turned off by default when a resource is created. To enable logging, navigate to the **Diagnostic settings** blade in the resource menu under the **Monitoring** section. Then click on **Add diagnostic setting**.

Next, select the archive target you want. Currently, we support storage accounts and Log Analytics as archive targets. After selecting the types of logs that you'd like to capture, save the diagnostic settings.
 
New settings take effect in about ten minutes. Logs will begin appearing in the configured archival target within the Logs pane of your Communication Services resource.

:::image type="content" source="./media/diagnostic-settings.png" alt-text="Azure Communication Services Diagnostic Settings Options.":::

For more information about configuring diagnostics, see the overview of [Azure resource logs](../../azure-monitor/essentials/platform-logs-overview.md).

## Resource log categories

Communication Services offers the following types of logs that you can enable:

* **Usage logs** - provides usage data associated with each billed service offering
* **Chat operational logs** - provides basic information related to the chat service
* **SMS operational logs** - provides basic information related to the SMS service
* **Authentication operational logs** - provides basic information related to the Authentication service
* **Network Traversal operational logs** - provides basic information related to the Network Traversal service

### Usage logs schema

| Property | Description |
| -------- | ---------------|
| Timestamp | The timestamp (UTC) of when the log was generated. |
| Operation Name | The operation associated with log record. |
| Operation Version | The `api-version` associated with the operation, if the operationName was performed using an API. If there is no API that corresponds to this operation, the version represents the version of that operation in case the properties associated with the operation change in the future. |
| Category | The log category of the event. Category is the granularity at which you can enable or disable logs on a particular resource. The properties that appear within the properties blob of an event are the same within a particular log category and resource type. |
| Correlation ID | The ID for correlated events. Can be used to identify correlated events between multiple tables. |
| Properties | Other data applicable to various modes of Communication Services. |
| Record ID | The unique ID for a given usage record. |
| Usage Type | The mode of usage. (for example, Chat, PSTN, NAT, etc.) |
| Unit Type | The type of unit that usage is based off for a given mode of usage. (for example, minutes, megabytes, messages, etc.). |
| Quantity | The number of units used or consumed for this record. |

### Chat operational logs

| Property | Description |
| -------- | ---------------|
| TimeGenerated | The timestamp (UTC) of when the log was generated. |
| OperationName | The operation associated with log record. |
| CorrelationID | The ID for correlated events. Can be used to identify correlated events between multiple tables. |
| OperationVersion | The api-version associated with the operation, if the operationName was performed using an API. If there is no API that corresponds to this operation, the version represents the version of that operation in case the properties associated with the operation change in the future. |
| Category | The log category of the event. Category is the granularity at which you can enable or disable logs on a particular resource. The properties that appear within the properties blob of an event are the same within a particular log category and resource type. |
| ResultType | The status of the operation. |
| ResultSignature | The sub status of the operation. If this operation corresponds to a REST API call, this field is the HTTP status code of the corresponding REST call. |
| ResultDescription | The static text description of this operation. |
| DurationMs | The duration of the operation in milliseconds. |
| CallerIpAddress | The caller IP address, if the operation corresponds to an API call that would come from an entity with a publicly available IP address. |
| Level | The severity level of the event. |
| URI | The URI of the request. |
| UserId | The request sender's user ID. |
| ChatThreadId | The chat thread ID associated with the request. |
| ChatMessageId | The chat message ID associated with the request. |
| SdkType | The Sdk type used in the request. |
| PlatformType | The platform type used in the request. |

### SMS operational logs

| Property | Description |
| -------- | ---------------|
| TimeGenerated | The timestamp (UTC) of when the log was generated. |
| OperationName | The operation associated with log record. |
| CorrelationID | The ID for correlated events. Can be used to identify correlated events between multiple tables. |
| OperationVersion | The api-version associated with the operation, if the operationName was performed using an API. If there is no API that corresponds to this operation, the version represents the version of that operation in case the properties associated with the operation change in the future. |
| Category | The log category of the event. Category is the granularity at which you can enable or disable logs on a particular resource. The properties that appear within the properties blob of an event are the same within a particular log category and resource type. |
| ResultType | The status of the operation. |
| ResultSignature | The sub status of the operation. If this operation corresponds to a REST API call, this field is the HTTP status code of the corresponding REST call. |
| ResultDescription | The static text description of this operation. |
| DurationMs | The duration of the operation in milliseconds. |
| CallerIpAddress | The caller IP address, if the operation corresponds to an API call that would come from an entity with a publicly available IP address. |
| Level | The severity level of the event. |
| URI | The URI of the request. |
| OutgoingMessageLength | The number of characters in the outgoing message. |
| IncomingMessageLength | The number of characters in the incoming message. |
| DeliveryAttempts | The number of attempts made to deliver this message. |
| PhoneNumber | The phone number the SMS message is being sent from. |
| SdkType | The SDK type used in the request. |
| PlatformType | The platform type used in the request. |
| Method | The method used in the request. |

### Authentication operational logs

| Property | Description |
| -------- | ---------------|
| TimeGenerated | The timestamp (UTC) of when the log was generated. |
| OperationName | The operation associated with log record. |
| CorrelationID | The ID for correlated events. Can be used to identify correlated events between multiple tables. |
| OperationVersion | The `api-version` associated with the operation, if the `operationName` was performed using an API. If there is no API that corresponds to this operation, the version represents the version of that operation in case the properties associated with the operation change in the future. |
| Category | The log category of the event. Category is the granularity at which you can enable or disable logs on a particular resource. The properties that appear within the properties blob of an event are the same within a particular log category and resource type. |
| ResultType | The status of the operation. |
| ResultSignature | The sub-status of the operation. If this operation corresponds to a REST API call, this field is the HTTP status code of the corresponding REST call. |
| DurationMs | The duration of the operation in milliseconds. |
| CallerIpAddress | The caller IP address, if the operation corresponds to an API call that would come from an entity with a publicly available IP address. |
| Level | The severity level of the event. |
| URI | The URI of the request. |
| SdkType | The SDK type used in the request. |
| PlatformType | The platform type used in the request. |
| Identity | The Communication Services identity related to the operation. |
| Scopes | The Communication Services scopes present in the access token. |

### Network Traversal operational logs

| Dimension        | Description                                                                                                                                           |
|------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| TimeGenerated    | The timestamp (UTC) of when the log was generated.                                                                                                    |
| OperationName    | The operation associated with log record.                                                                                                             |
| CorrelationId    | The ID for correlated events. Can be used to identify correlated events between multiple tables.                                                      |
| OperationVersion | The API-version associated with the operation or version of the operation (if there is no API version).                                               |
| Category         | The log category of the event. Logs with the same log category and resource type will have the same properties fields.                                |
| ResultType       | The status of the operation (e.g. Succeeded or Failed).                                                                                               |
| ResultSignature  | The sub status of the operation. If this operation corresponds to a REST API call, this field is the HTTP status code of the corresponding REST call. |
| DurationMs       | The duration of the operation in milliseconds.                                                                                                        |
| Level            | The severity level of the operation.                                                                                                                  |
| URI              | The URI of the request.                                                                                                                               |
| Identity         | The request sender's identity, if provided.                                                                                                           |
| SdkType          | The SDK type being used in the request.                                                                                                               |
| PlatformType     | The platform type being used in the request.                                                                                                          |
| RouteType        | The routing methodology to where the ICE server will be located from the client (e.g. Any or Nearest).                                                |
