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

Choosing a Time Series ID is like choosing a partition key for a database. It needs to be selected while you're creating a Time Series Insights Preview environment. It's an *immutable* property. That is, after you create a Time Series Insights Preview environment with a Time Series ID, you can't change it for that environment. 

> [!IMPORTANT]
> The Time Series ID is case-sensitive.

Selecting an appropriate Time Series ID is critical. Here are some of the best practices that you can follow:

* Pick a partition key with many distinct values (for example, hundreds or thousands). In many cases, this might be the device ID, sensor ID, or tag ID in your JSON.
* The Time Series ID should be unique at the leaf node level of your [Time Series Model](./time-series-insights-update-tsm.md).
* If your event source is an IoT hub, your Time Series ID will most likely be *iothub-connection-device-id*.
* The character limit for the Time Series ID's property name string is 128. For the Time Series ID's property value, the character limit is 1,024.
* If a unique property value for the Time Series ID is missing, it's treated as a null value and follows the same rule of the uniqueness constraint.
* You can also select up to *three* key properties as your Time Series ID. Their combination will be a composite key that represents the Time Series ID.  

  > [!NOTE]
  > Your three key properties must be strings.
  > You would have to query against this composite key instead of one property at a time.

The following scenarios describe selecting more than one key property as your Time Series ID.  

### Example 1: Time Series ID with a unique key

* You have legacy fleets of assets. Each has a unique key.
* One fleet is uniquely identified by the property **deviceId**. For another fleet, the unique property is **objectId**. Neither fleet contains the other fleet's unique property. In this example, you would select two keys, **deviceId** and **objectId**, as unique keys.
* We accept null values, and the lack of a property's presence in the event payload counts as a null value. This is also the appropriate way to handle sending data to two event sources where the data in each event source has a unique Time Series ID.

### Example 2: Time Series ID with a composite key

* You require multiple properties to be unique within the same fleet of assets. 
* You're a manufacturer of smart buildings and deploy sensors in every room. In each room, you typically have the same values for **sensorId**. Examples are **sensor1**, **sensor2**, and **sensor3**.
* Your building has overlapping floor and room numbers across sites in the property **flrRm**. These numbers have values such as **1a**, **2b**, and **3a**.
* You have a property, **location**, that contains values such as **Redmond**, **Barcelona**, and **Tokyo**. To create uniqueness, you designate the following three properties as your Time Series ID keys: **sensorId**, **flrRm**, and **location**.

Example raw event:

```JSON
{
  "sensorId": "sensor1",
  "flrRm": "1a",
  "location": "Redmond",
  "temperature": 78
}
```

In the Azure portal, you can enter this composite key as: 

`[{"name":"sensorId","type":"String"},{"name":"flrRm","type":"String"},{"name":"location","type":"string"}]`

## Next steps

* Read more about [data modeling](./time-series-insights-update-tsm.md).

* Plan your [Azure Time Series Insights Preview environment](./time-series-insights-update-plan.md).