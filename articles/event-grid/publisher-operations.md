---
title: Azure Event Grid publisher operations for namespace topics
description: Describes publisher operations supported by Azure Event Grid when using namespaces.
ms.topic: conceptual
ms.custom:
  - ignite-2023
ms.date: 11/15/2023
---

# Azure Event Grid - publisher operations 

This article describes HTTP publisher operations supported by Azure Event Grid when using namespace topics.

## Publish CloudEvents

In order to publish CloudEvents to a namespace topic using HTTP, you should have a [namespace](create-view-manage-namespaces.md) and a [topic](create-view-manage-namespace-topics.md) already created.

Use the publish operation to send to an HTTP namespace endpoint a single or a batch of CloudEvents using JSON format. Here's an example of a REST API command to publish cloud events. For more information about the operation and the command, see [REST API - Publish Cloud Events](/rest/api/eventgrid/).

```http
POST myNamespaceName.westus-1.eventgrid.azure.net/topics/myTopic:publish?api-version=2023-11-01

[
  {
    "id": "b3ccc7e3-c1cb-49bf-b7c8-0d4e60980616",
    "source": "/microsoft/autorest/examples/eventgrid/cloud-events/publish",
    "specversion": "1.0",
    "data": {
      "Property1": "Value1",
      "Property2": "Value2"
    },
    "type": "Microsoft.Contoso.TestEvent",
    "time": "2023-05-04T23:06:09.147165Z"
  }
]
```

Here's the sample response when the status is 200. 

```json
{
}
```

## Next steps

* [Pull delivery](pull-delivery-overview.md) overview.
* [Push delivery](push-delivery-overview.md) overview.
* [Subscriber operations](subscriber-operations.md) for pull delivery.
