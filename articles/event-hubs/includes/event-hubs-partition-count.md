---
title: Event Hubs partition overview
description: Provides a description of a partition in Azure Event Hubs. 
author: spelluru
ms.service: event-hubs
ms.topic: include
ms.date: 11/27/2023
ms.author: spelluru
ms.custom: "include file"

---

As [partition](../event-hubs-features.md#partitions) is a data organization mechanism that allows you to publish and consume data in a parallel manner. We recommend that you balance scaling units (throughput units for the standard tier, processing units for the premium tier, or capacity units for the dedicated tier) and partitions to achieve optimal scale. In general, we recommend a maximum throughput of 1 MB/s per partition. Therefore, a rule of thumb for calculating the number of partitions would be to divide the maximum expected throughput by 1 MB/s. For example, if your use case requires 20 MB/s, we recommend that you choose at least 20 partitions to achieve the optimal throughput.                             

However, if you have a model in which your application has an affinity to a particular partition, increasing the number of partitions isn't beneficial. For more information, see [availability and consistency](../event-hubs-availability-and-consistency.md).
