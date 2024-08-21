---
title: Performance considerations for Azure NetApp Files storage with cool access
description: Understand use cases for cool access and the effect it can have on performance. 
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: conceptual
ms.date: 08/22/2024
ms.author: anfdocs
---
# Performance considerations for Azure NetApp Files storage with cool access

Data sets are not always actively used. Up to 80% of data in a set can be considered "cool," meaning it's not currently in use or hasn't been accessed recently. When storing data on high performance storage such as Azure NetApp Files, the money spent on the capacity being used is essentially being wasted since coldcool data does not require high performance storage until it is being accessed again. So, if you could automatically tier coldcool data to lower cost storage and then bring that data back to the performance or “hot” tier when needed, why wouldn’t you?

[Azure NetApp Files torage with cool access](cool-access-introduction.md) is intended to reduce costs for cloud storage in Azure. There are performance considerations in specific use cases that need to be considered.

Accessing data that has moved to the cool tiers incurs more latency, particularly for random I/O. In a worst-case scenario, all of the data being accessed might be on the cool tier, so every request would need to conduct a retrieval of the data. It's uncommon for all of the data in an actively used dataset to be in the cool tier, so it's unlikely to observe such latency. 

When the Default Cool Access retrieval policy is selected, sequential I/O is readreads are served directly from the cool tier and does not repopulate into the hot tier.  Randomly read data is repopulated into the hot tier, increasing the performance of subsequent reads. Optimizations for sequential workloads often reduce the latency incurred by cloud retrieval as compared to random readsand improves overall performance.  

In a recent test performed using Standard storage with cool access for Azure NetApp Files, the following results were obtained.
