---
title: Integration Runtime Performance
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about how to optimize and improve performance of the Azure Integration Runtime in Azure Data Factory and Azure Synapse Analytics.
author: kromerm
ms.topic: conceptual
ms.author: makromer
ms.service: data-factory
ms.subservice: data-flows
ms.custom: synapse
ms.date: 04/21/2023
---

# Optimizing performance of the Azure Integration Runtime

Data flows run on Spark clusters that are spun up at run-time. The configuration for the cluster used is defined in the integration runtime (IR) of the activity. There are three performance considerations to make when defining your integration runtime: cluster type, cluster size, and time to live.

For more information how to create an Integration Runtime, see [Integration Runtime](concepts-integration-runtime.md).

The easiest way to get started with data flow integration runtimes is to choose small, medium, or large from the compute size picker. See the mappings to cluster configurations for those sizes below.

## Cluster type

There are two available options for the type of Spark cluster to utilize: general purpose & memory optimized.

**General purpose** clusters are the default selection and will be ideal for most data flow workloads. These tend to be the best balance of performance and cost.

If your data flow has many joins and lookups, you may want to use a **memory optimized** cluster. Memory optimized clusters can store more data in memory and will minimize any out-of-memory errors you may get. Memory optimized have the highest price-point per core, but also tend to result in more successful pipelines. If you experience any out of memory errors when executing data flows, switch to a memory optimized Azure IR configuration. 

## Cluster size

Data flows distribute the data processing over different nodes in a Spark cluster to perform operations in parallel. A Spark cluster with more cores increases the number of nodes in the compute environment. More nodes increase the processing power of the data flow. Increasing the size of the cluster is often an easy way to reduce the processing time.

The default cluster size is four driver nodes and four worker nodes (small). As you process more data, larger clusters are recommended. Below are the possible sizing options:

| Worker Nodes | Driver Nodes | Total Nodes | Notes |
| ------------ | ------------ | ----------- | ----- |
| 4 | 4 | 8 | Small |
| 8 | 8 | 16 | Medium |
| 16 | 16 | 32 | |
| 32 | 16 | 48 | |
| 64 | 16 | 80 | Large |
| 128 | 16 | 144 | |
| 256 | 16 | 272 | |

Data flows are priced at vcore-hrs meaning that both cluster size and execution-time factor into this. As you scale up, your cluster cost per minute will increase, but your overall time will decrease.

> [!TIP]
> There is a ceiling on how much the size of a cluster affects the performance of a data flow. Depending on the size of your data, there is a point where increasing the size of a cluster will stop improving performance. For example, If you have more nodes than partitions of data, adding additional nodes won't help. 
A best practice is to start small and scale up to meet your performance needs. 

## Custom shuffle partition

Dataflow divides the data into partitions and transforms it using different processes. If the data size in a partition is more than the process can hold in memory, the process fails with OOM(out of memory) errors. If dataflow contains huge amounts of data having joins/aggregations, you may want to try changing shuffle partitions in incremental way. You can set it from 50 up to 2000, to avoid OOM errors. **Compute Custom properties** in dataflow runtime, is a way to control your compute requirements. Property name is **Shuffle partitions** and it's integer type. This customization should only be used in known scenarios, otherwise it can cause unnecessary dataflow failures.

While increasing the shuffle partitions, make sure data is spread across well. A rough number is to have approximately 1.5 GB of data per partition. If data is skewed, increasing the "Shuffle partitions" won't be helpful. For example, if you have 500 GB of data, having a value between 400 to 500 should work. Default limit for shuffle partitions is 200 that works well for approximately 300 GB of data.


1. From ADF portal under **Manage**, select a custom integration run time and you go to edit mode.
2. Under dataflow run time tab, go to **Compute Custom Properties** section.
3. Select **Shuffle partitions** under Property name, input value of your choice, like 250, 500 etc.

You can do same by editing JSON file of runtime by adding an array with property name and value after an existing property like *cleanup* property.

## Time to live

By default, every data flow activity spins up a new Spark cluster based upon the Azure IR configuration. Cold cluster start-up time takes a few minutes and data processing can't start until it is complete. If your pipelines contain multiple **sequential** data flows, you can enable a time to live (TTL) value. Specifying a time to live value keeps a cluster alive for a certain period of time after its execution completes. If a new job starts using the IR during the TTL time, it will reuse the existing cluster and start up time will be greatly reduced. After the second job completes, the cluster will again stay alive for the TTL time.

However, if most of your data flows execute in parallel, it is not recommended that you enable TTL for the IR that you use for those activities. Only one job can run on a single cluster at a time. If there is an available cluster, but two data flows start, only one will use the live cluster. The second job will spin up its own isolated cluster.

> [!NOTE]
> Time to live is not available when using the auto-resolve integration runtime (default).

## Next steps

See other Data Flow articles related to performance:

- [Data Flow performance](concepts-data-flow-performance.md)
- [Data Flow activity](control-flow-execute-data-flow-activity.md)
- [Monitor Data Flow performance](concepts-data-flow-monitoring.md)
