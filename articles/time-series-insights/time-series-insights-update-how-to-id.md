---
title: 'Best practices for choosing a Time Series ID in Azure Time Series Insights Preview | Microsoft Docs'
description: Understanding best practices when you choose a Time Series ID in Azure Time Series Insights Preview.
author: ashannon7
ms.author: dpalled
ms.workload: big-data
manager: cshankar
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 05/08/2019
ms.custom: seodec18
---

# Best practices for choosing a Time Series ID

This article covers the Azure Time Series Insights Preview partition key, the Time Series ID, and best practices for choosing one.

## Choose a Time Series ID

Choosing a Time Series ID is like choosing a partition key for a database. It's an important decision that should be made at design time. You can't update an existing Time Series Insights Preview environment to use a different Time Series ID. In other words, when an environment is created with a Time Series ID, the policy is an immutable property that can't be changed.

> [!IMPORTANT]
> The Time Series ID is case-sensitive and immutable (it can't be changed after it is set).

With that in mind, selecting the appropriate Time Series ID is critical. When you select a Time Series ID, consider following these best practices:

* Pick a property name that has a wide range of values and has even access patterns. It’s a best practice to have a partition key with many distinct values (for example, hundreds or thousands). For many customers, this will be something like the DeviceID or SensorID in your JSON.
* The Time Series ID should be unique at the leaf node level of your [Time Series Model](./time-series-insights-update-tsm.md).
* A Time Series ID property name character string can have up to 128 characters, and Time Series ID property values can have up to 1024 characters.
* If some unique Time Series ID property values are missing, they are treated as null values, which take part in the uniqueness constraint.

Additionally, you can select up to *three* (3) key properties as your Time Series ID.

  > [!NOTE]
  > Your *three* (3) key properties must be strings.

The following scenarios describe selecting more than one key property as your Time Series ID:  

### Scenario one

* You have legacy fleets of assets, each with a unique key.
* For example, one fleet is uniquely identified by the property *deviceId* and another where the unique property is *objectId*. Neither fleet contains the other fleet’s unique property. In this example, you would select two keys, deviceId and objectId, as unique keys.
* We accept null values, and the lack of a property’s presence in the event payload counts as a `null` value. This is also the appropriate way to handle sending data to two different event sources where the data in each event source has a unique Time Series ID.

### Scenario two

* You require multiple properties to be unique within the same fleet of assets. 
* For example, let’s say you're a smart building manufacturer and deploy sensors in every room. In each room, you typically have the same values for *sensorId*, such as *sensor1*, *sensor2*, and *sensor3*.
* Additionally, your building has overlapping floor and room numbers across sites in the property *flrRm*, which have values such as *1a*, *2b*, *3a*, and so on.
* Finally, you have a property, *location*, which contains values such as *Redmond*, *Barcelona*, and *Tokyo*. To create uniqueness, you would designate the following three properties as your Time Series ID keys: *sensorId*, *flrRm*, and *location*.

## Next steps

* Read more about [Data modeling](./time-series-insights-update-tsm.md).

* Plan your [Azure Time Series Insights (preview) environment](./time-series-insights-update-plan.md).