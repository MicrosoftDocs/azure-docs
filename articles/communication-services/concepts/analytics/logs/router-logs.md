--- 
title: Azure Communication Services – Job Router Operational logs 
titleSuffix: An Azure Communication Services conceptual article 
description: Learn about logging for Azure Communication Services Job Router. 
author: nabennet 
services: azure-communication-services 
ms.author: nabennet 
ms.date: 07/07/2023 
ms.topic: conceptual 
ms.service: azure-communication-services 
ms.subservice: data 
--- 

# Azure Communication Services Job Router logs

Azure Communication Services offers logging capabilities that you can use to monitor and debug your Communication Services solution. You configure these capabilities through the Azure portal.

The content in this article refers to logs enabled through [Azure Monitor](../../../../azure-monitor/overview.md) (see also [FAQ](../../../../azure-monitor/overview.md#frequently-asked-questions)). To enable these logs for Communication Services, see [Enable logging in diagnostic settings](../enable-logging.md).

## Resource log categories

Communication Services offers the following types of logs that you can enable:

* **Job Router incoming operations logs**: Provide information about incoming requests for Job Router operations. Every entry corresponds to the result of an api request to Job Router APIs, such as UpsertJob, ListClassificationPolicies, DeleteWorker, and AcceptJobOffer.

### ACSJobRouterIncomingOperations logs

Here are the properties:

| Property | Description |
| -------- | ---------------|
| `TimeGenerated` | The time stamp (UTC) of when the log was generated. |
| `Level`         | The severity level of the operation. |
| `CorrelationId` | The ID for correlated events. Can be used to identify correlated events between multiple tables. |
| `OperationName` | The operation associated with log records. |
| `OperationVersion` | The API version associated with the operation or version of the operation (if there is no API version). |
| `URI` | The URI of the request. |
| `ResultSignature` | The substatus of the operation. If this operation corresponds to a REST API call, this field is the HTTP status code of the corresponding REST call. |
| `ResultType`     | The status of the operation. |
| `ResultDescription` | The static text description of this operation. |
| `DurationMs`       | The duration of the operation in milliseconds. |
| `CallerIpAddress` | The caller IP address, if the operation corresponds to an API call that comes from an entity with a publicly available IP address. |
| `SdkType`         | The SDK type used in the request. |
| `SdkVersion`      | The SDK version. |
| `EntityId`        | The Entity ID for the request. |
| `EntityType`      | The Entity Type for the request. |

Here's an example:

```json
"properties" 
{ 
  "TimeGenerated": "2023-07-07T21:32:10.5497170Z",
  "Level": "Informational",
  "OperationName": "DeleteQueue",
  "OperationVersion": "2022-07-18-preview",
  "ResultType": "Succeeded",
  "ResultSignature": "204",
  "ResultDescription": "No Content", 
  "DurationMs": "73.3857",
  "CallerIpAddress": "147.243.150.109",
  "CorrelationId": "6b300c18827245e3b43d3c0179d75af3",
  "URI": "https://jobrouter-test-resource.communication.azure.com/routing/queues/328135a9-6c1f-49eb-af32-0a477af97999?api-version=2022-07-18-preview",
  "SdkType": "dotnet",
  "EntityId": "328135a9-6c1f-49eb-af32-0a477af97999",
  "EntityType": "Queues"
}
```
