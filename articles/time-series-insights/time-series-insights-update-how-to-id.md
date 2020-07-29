---
title: 'Best practices for choosing a Time Series ID - Azure Time Series Insights | Microsoft Docs'
description: Learn about best practices when choosing a Time Series ID in Azure Time Series Insights Preview.
author: shipramishra
ms.author: shmishr
manager: diviso
ms.workload: big-data
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 05/11/2020
ms.custom: seodec18
---

# Best practices for choosing a Time Series ID

This article summarizes the importance of the Time Series ID for your Azure Time Series Insights Preview environment, and best practices for choosing one.

## Choose a Time Series ID

Selecting an appropriate Time Series ID is critical. Choosing a Time Series ID is like choosing a partition key for a database. It's required when you create a Time Series Insights Preview environment. 

> [!IMPORTANT]
> Time Series IDs are:
>
> * A *case-sensitive* property: letter and character casings are used in searches, comparisons, updates, and when partitioning.
> * An *immutable* property: once created it cannot be changed.

> [!TIP]
> If your event source is an IoT hub, your Time Series ID will likely be ***iothub-connection-device-id***.

Key best practices to follow include:

* Pick a partition key with many distinct values (for example, hundreds or thousands). In many cases, this might be the device ID, sensor ID, or tag ID in your JSON.
* The Time Series ID should be unique at the leaf node level of your [Time Series Model](./time-series-insights-update-tsm.md).
* The character limit for the Time Series ID's property name string is 128. For the Time Series ID's property value, the character limit is 1,024.
* If a unique property value for the Time Series ID is missing, it's treated as a null value and follows the same rule of the uniqueness constraint.
* You can also select up to *three* key properties as your Time Series ID. Their combination will be a composite key that represents the Time Series ID.  
  > [!NOTE]
  > Your three key properties must be strings.
  > You would have to query against this composite key instead of one property at a time.

## Select more than one key property

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

In the Azure portal, you can then enter the composite key as follows:

[![Configure Time Series ID for the environment.](media/v2-how-to-tsid/configure-environment-key.png)](media/v2-how-to-tsid/configure-environment-key.png#lightbox)

## Next steps

* Read more about [data modeling](./time-series-insights-update-tsm.md).

* Plan your [Azure Time Series Insights Preview environment](./time-series-insights-update-plan.md).
