---
title: Azure Event Grid on Kubernetes - Event schemas
description: This article describes event schemas that are supported by Event Grid on Azure Arc for Kubernetes  
author: jfggdl
ms.subservice: kubernetes
ms.author: jafernan
ms.date: 05/25/2021
ms.topic: conceptual
---

# Event schemas in Event Grid on Kubernetes
Event Grid on Kubernetes accepts and delivers events in JSON format. It supports the [Cloud Events 1.0 schema specification](https://github.com/cloudevents/spec/blob/v1.0/spec.md) and that's the schema that should be used when publishing events to Event Grid. 

[!INCLUDE [preview-feature-note.md](../includes/preview-feature-note.md)]



## CloudEvent schema
[CloudEvents](https://cloudevents.io/) is an open specification for describing event data. It simplifies interoperability by providing a common event schema for publishing, and consuming events. See [CloudEvents specification](https://github.com/cloudevents/spec/blob/main/cloudevents/formats/json-format.md#3-envelope) for information on the mandatory context attributes.

## Example — event using CloudEvents schema

```json
[{
      "specversion": "1.0",
      "type" : "orderCreated",
      "source": "myCompanyName/us/webCommerceChannel/myOnlineCommerceSiteBrandName",
      "id" : "eventId-n",
      "time" : "2020-12-25T20:54:07+00:00",
      "subject" : "account/acct-123224/order/o-123456",
      "dataSchema" : "1.0",
      "data" : {
         "orderId" : "123",
         "orderType" : "PO",
         "reference" : "https://www.myCompanyName.com/orders/123"
      }
}]
```

## Next steps
To learn about destinations and handlers supported by Event Grid on Azure Arc for Kubernetes, see [Event Grid on Kubernetes - Event handlers](event-handlers.md).
