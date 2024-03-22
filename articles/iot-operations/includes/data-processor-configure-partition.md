---
 title: include file
 description: include file
 author: dominicbetts
 ms.topic: include
 ms.date: 10/23/2023
 ms.author: dobett
ms.custom:
  - include file
  - ignite-2023
---

Partitioning in a pipeline divides the incoming data into separate partitions. Partitioning enables data parallelism in the pipeline, which can improve throughput and reduce latency. Partitioning strategies affect how the data is processed in the other stages of the pipeline. For example, the last known value stage and aggregate stage operate on each logical partition.

To partition your data, specify a partitioning strategy and the number of partitions to use:
