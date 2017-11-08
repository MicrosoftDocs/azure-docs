---
title: Azure Event Grid subscription event schema
description: Describes the properties that are provided for subscription events with Azure Event Grid
services: event-grid
author: tfitzmac
manager: timlt

ms.service: event-grid
ms.topic: article
ms.date: 11/08/2017
ms.author: tomfitz
---

# Azure Event Grid event schema for subscriptions

This article provides the properties and schema for Azure subscription events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md).

Azure subscriptions and resource groups emit the same event types. The event types are related to changes in resources. The primary difference is that resource groups emit events for resources within the resource group, and Azure subscriptions emit events for resources across the subscription.

## Available event types

Resource groups emit management events from Azure Resource Manager, such as when a VM is created or a storage account is deleted. Resource groups raise the following event types:

- **Microsoft.Resources.ResourceWriteSuccess**: Raised when a resource create or update operation succeeds.  
- **Microsoft.Resources.ResourceWriteFailure**: Raised when a resource create or update operation fails.  
- **Microsoft.Resources.ResourceWriteCancel**: Raised when a resource create or update operation is canceled.  
- **Microsoft.Resources.ResourceDeleteSuccess**: Raised when a resource delete operation succeeds.  
- **Microsoft.Resources.ResourceDeleteFailure**: Raised when a resource delete operation fails.  
- **Microsoft.Resources.ResourceDeleteCancel**: Raised when a resource delete operation is canceled. This event happens when a template deployment is canceled.

## Example event

The following example shows the schema of a resource created event: 

```json
[
    {
    "topic":"/subscriptions/{subscription-id}",
    "subject":"/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.EventGrid/eventSubscriptions/LogicAppdd584bdf-8347-49c9-b9a9-d1f980783501",
    "eventType":"Microsoft.Resources.ResourceWriteSuccess",
    "eventTime":"2017-08-16T03:54:38.2696833Z",
    "id":"25b3b0d0-d79b-44d5-9963-440d4e6a9bba",
    "data": {
        "authorization":"{azure_resource_manager_authorizations}",
        "claims":"{azure_resource_manager_claims}",
        "correlationId":"54ef1e39-6a82-44b3-abc1-bdeb6ce4d3c6",
        "httpRequest":"{request-operation}",
        "resourceProvider":"Microsoft.EventGrid",
        "resourceUri":"/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.EventGrid/eventSubscriptions/LogicAppdd584bdf-8347-49c9-b9a9-d1f980783501",
        "operationName":"Microsoft.EventGrid/eventSubscriptions/write",
        "status":"Succeeded",
        "subscriptionId":"{subscription-id}",
        "tenantId":"72f988bf-86f1-41af-91ab-2d7cd011db47"
        },
    }
]
```

The schema for a resource deleted event is similar:

```json
[{
  "topic":"/subscriptions/{subscription-id}",
  "subject": "/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.EventGrid/eventSubscriptions/LogicApp0ecd6c02-2296-4d7c-9865-01532dc99c93",
  "eventType": "Microsoft.Resources.ResourceDeleteSuccess",
  "eventTime": "2017-11-07T21:24:19.6959483Z",
  "id": "7995ecce-39d4-4851-b9d7-a7ef87a06bf5",
  "data": {
    "authorization": "{azure_resource_manager_authorizations}",
    "claims": "{azure_resource_manager_claims}",
    "correlationId": "7995ecce-39d4-4851-b9d7-a7ef87a06bf5",
    "httpRequest": "{request-operation}",
    "resourceProvider": "Microsoft.EventGrid",
    "resourceUri": "/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.EventGrid/eventSubscriptions/LogicAppdd584bdf-8347-49c9-b9a9-d1f980783501",
    "operationName": "Microsoft.EventGrid/eventSubscriptions/delete",
    "status": "Succeeded",
    "subscriptionId": "{subscription-id}",
    "tenantId": "72f988bf-86f1-41af-91ab-2d7cd011db47"
  }
}]
```

## Event properties

An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| topic | string | Full resource path to the event source. This field is not writeable. |
| subject | string | Publisher-defined path to the event subject. |
| eventType | string | One of the registered event types for this event source. |
| eventTime | string | The time the event is generated based on the provider's UTC time. |
| id | string | Unique identifier for the event. |
| data | object | Subscription event data. |

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| authorization | string | The requested authorization for the operation. |
| claims | string | The properties of the claims. |
| correlationId | string | An operation ID for troubleshooting. |
| httpRequest | string | The details of the operation. |
| resourceProvider | string | The resource provider performing the operation. |
| resourceUri | string | The URI of the resource in the operation. |
| operationName | string | The operation that was performed. |
| status | string | The status of the operation. |
| subscriptionId | string | The subscription ID of the resource. |
| tenantId | string | The tenant ID of the resource. |

## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md).
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).
