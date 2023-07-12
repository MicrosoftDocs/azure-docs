---
title: include file
description: include file
services: event-hubs
author: spelluru
ms.service: event-hubs
ms.topic: include
ms.date: 04/11/2022
ms.author: spelluru
ms.custom: "include file"

---

As [partition](../event-hubs-features.md#partitions) is a data organization mechanism that allows you to publish and consume data in a parallel manner, we recommend that you balance scaling units (TUs, PUs or CUs) and partitions to achieve optimal scale. In general, we recommend a maximum throughput of 1 MB/s per partition. Therefore, a rule of thumb for calculating the number of partitions would be to divide the maximum expected throughput by 1 MB/s. For example, if your use case requires 20 MB/s, it is recommended to choose at least 20 partitions to achieve the optimal throughput.                             

However, if you have a model in which your application has an affinity to a particular partition, increasing the number of partitions may not be beneficial. For more information, see [availability and consistency](../event-hubs-availability-and-consistency.md).
