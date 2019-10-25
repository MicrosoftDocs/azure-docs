---
title: 'Best practices for choosing a Time Series ID in Azure Time Series Insights Preview | Microsoft Docs'
description: Understanding best practices when you choose a Time Series ID in Azure Time Series Insights Preview.
author: deepakpalled
ms.author: dpalled
manager: cshankar
ms.workload: big-data
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 10/22/2019
ms.custom: seodec18
---

# Best practices for choosing a Time Series ID

This article summarizes the importance of the Time Series ID for your Azure Time Series Insights Preview environment, and best practices for choosing one.

## Choose a Time Series ID

Choosing a Time Series ID is like choosing a partition key for a database. It needs to be selected while creating a Time Series Insights Preview environment. It is an *immutable* property i.e. once a Time Series Insights Preview environment is created with a Time Series ID, you cannot change it for that environment. 

> [!IMPORTANT]
> The Time Series ID is case-sensitive and immutable (it can't be changed after it is set).

Considering the points above, selecting an appropriate Time Series ID becomes very critical. Here are some of the best practices that should be followed while selecting a Time Series ID:

* Pick a partition key with many distinct values (for example, hundreds or thousands). In many cases, this could be the Device ID, Sensor ID or Tag ID in your JSON.
* The Time Series ID should be unique at the leaf node level of your [Time Series Model](./time-series-insights-update-tsm.md).
* If your event source is an IoT hub then your Time Series ID will most likely be the *iothub-connection-device-id*.
* The allowable character limit for Time Series ID property name  string is 128, and for Time Series ID property value is 1024.
* If some unique Time Series ID property value is missing, they are treated as null values, following the same rule of the uniqueness constraint.
* You can also select up to *three* (3) key properties as your Time Series ID. Their combination will be a composite key representing the Time Series ID.  

  > [!NOTE]
  > Your *three* (3) key properties must be strings.
  > You would have to query against this composite key instead of one property at a time.

The following scenarios describe selecting more than one key property as your Time Series ID:  

### Example 1 - Time Series ID with unique key

* You have legacy fleets of assets, each with a unique key.
* For example, one fleet is uniquely identified by the property *deviceId* and another where the unique property is *objectId*. Neither fleet contains the other fleet’s unique property. In this example, you would select two keys, deviceId and objectId, as unique keys.
* We accept null values, and the lack of a property’s presence in the event payload counts as a `null` value. This is also the appropriate way to handle sending data to two different event sources where the data in each event source has a unique Time Series ID.

### Example 2 - Time Series ID with composite key

* You require multiple properties to be unique within the same fleet of assets. 
* For example, let’s say you're a smart building manufacturer and deploy sensors in every room. In each room, you typically have the same values for *sensorId*, such as *sensor1*, *sensor2*, and *sensor3*.
* Additionally, your building has overlapping floor and room numbers across sites in the property *flrRm*, which have values such as *1a*, *2b*, *3a*, and so on.
* Finally, you have a property, *location*, which contains values such as *Redmond*, *Barcelona*, and *Tokyo*. To create uniqueness, you would designate the following three properties as your Time Series ID keys: *sensorId*, *flrRm*, and *location*.

Example raw event:

```JSON
{
  "sensorId": "sensor1",
  "flrRm": "1a",
  "location": "Redmond",
  "temperature": 78
}
```

This composite key can be entered as: `[{"name":"sensorId","type":"String"},{"name":"flrRm","type":"String"},{"name":"location","type":"string"}]` in Azure portal.

## Next steps

* Read more about [Data modeling](./time-series-insights-update-tsm.md).

* Plan your [Azure Time Series Insights (preview) environment](./time-series-insights-update-plan.md).