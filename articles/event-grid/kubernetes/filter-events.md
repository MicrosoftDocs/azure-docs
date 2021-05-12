---
title: Azure Event Grid on Kubernetes - Filter events
description: This article describes how to filter events when creating an Azure Event Grid subscription.
author: jfggdl
manager: JasonWHowell
ms.subservice: kubernetes
ms.author: jafernan
ms.date: 05/04/2021
ms.topic: conceptual
---

# Event Grid on Kubernetes - event filtering for subscriptions
Event Grid on Kubernetes allows specifying filters on any property in the json payload. These filters are modeled as set of AND conditions, with each outer condition having optional inner OR conditions. For each AND condition, you specify the following values:

- OperatorType - The type of comparison.
- Key - The json path to the property on which to apply the filter.
- Value - The reference value against which the filter is run (or) Values - The set of reference values against which the filter is run.

## Filter by event type
By default, all [event types](event-schemas.md) for the event source are sent to the endpoint. You can decide to send only certain event types to your endpoint. The JSON syntax for filtering by event type is:

```json
"filter": {
  "includedEventTypes": [
    "orderCreated",
    "orderUpdated"
  ]
}
```

In the above example, the only events of type `orderCreated` and `orderUpdated` events are sent to the subscriber endpoint. 

Here's a sample event:

```json
[{
      "specVersion": "1.0",
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

## Filter by subject
For simple filtering by subject, specify a starting or ending value for the subject. The JSON syntax for filtering by subject is:

```json
"filter": {
  "subjectBeginsWith": "/account/acct-123224/"
}
``` 

The sample event mentioned in the previous section has the subject `account/acct-123224/order/o-123456`, which begins with `/account/acct-123224/`, so the event is sent to the subscriber endpoint. 

## Filter by values in the data 
See [Advanced filtering section in the Event Grid on Azure article](../event-filtering.md) to learn about advanced filtering in detail. The following features and operators aren't supported by Event Grid on Kubernetes. 

- Filtering on array data in keys of incoming events
- Allow filtering on CloudEvents extensions context attributes
- Following operators
    - StringNotContains
    - StringNotBeginsWith
    - StringNotEndsWith
    - NumberInRange
    - NumberNotInRange
    - IsNullOrUndefined
    - IsNotNull
    

## Next steps
To learn about destinations and handlers supported by Event Grid on Azure Arc for Kubernetes, see [Event Grid on Kubernetes - Event handlers](event-handlers.md).