---
title: 'Best practices for choosing a Time Series ID in Azure Time Series Insights Preview | Microsoft Docs'
description: Understanding best practices when you choose a Time Series ID in Azure Time Series Insights Preview.
author: deepakpalled
ms.author: shmishr
manager: cshankar
ms.workload: big-data
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 08/09/2019
ms.custom: seodec18
---

# Best practices for choosing a Time Series ID

This article covers the Azure Time Series Insights Preview partition key, the Time Series ID, and best practices for choosing the ID.

## Choose a Time Series ID

Choosing a Time Series ID is like choosing a partition key for a database. It's an important decision that should happen at design time. You can't update an existing Time Series Insights Preview environment to use a different Time Series ID. In other words, when an environment is created with a Time Series ID, the policy is an immutable property that can't be changed.

> [!IMPORTANT]
> The Time Series ID is case-sensitive.

With that in mind, selecting the appropriate Time Series ID is critical. When you select a Time Series ID, consider these best practices:

* Pick a property name that has a wide range of values and has even access patterns. It's a best practice to have a partition key with many distinct values (for example, hundreds or thousands). For many customers, this will be something like **deviceID** or **sensorID** in your JSON.
* The Time Series ID should be unique at the leaf node level of your [Time Series Model](./time-series-insights-update-tsm.md).
* A character string for a Time Series ID property name can have up to 128 characters. Time Series ID property values can have up to 1,024 characters.
* If some unique Time Series ID property values are missing, they're treated as null values, which take part in the uniqueness constraint.

You can select up to three key properties as your Time Series ID.

  > [!NOTE]
  > Your three key properties must be strings.

The following scenarios describe selecting more than one key property as your Time Series ID.  

### Scenario one

* You have legacy fleets of assets. Each has a unique key.
* One fleet is uniquely identified by the property **deviceId**. For another fleet, the unique property is **objectId**. Neither fleet contains the other fleet’s unique property. In this example, you would select two keys, **deviceId** and **objectId**, as unique keys.
* We accept null values, and the lack of a property's presence in the event payload counts as a null value. This is also the appropriate way to handle sending data to two event sources where the data in each event source has a unique Time Series ID.

### Scenario two

* You require multiple properties to be unique within the same fleet of assets. 
* You're a manufacturer of smart buildings and deploy sensors in every room. In each room, you typically have the same values for **sensorId**, such as **sensor1**, **sensor2**, and **sensor3**.
* Your building has overlapping floor and room numbers across sites in the property **flrRm**, which have values such as **1a**, **2b**, and **3a**.
* You have a property, **location**, that contains values such as **Redmond**, **Barcelona**, and **Tokyo**. To create uniqueness, you designate the following three properties as your Time Series ID keys: **sensorId**, **flrRm**, and **location**.

## Next steps

* Read more about [data modeling](./time-series-insights-update-tsm.md).

* Plan your [Azure Time Series Insights Preview environment](./time-series-insights-update-plan.md).