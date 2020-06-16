---
title: Interactive Query cluster sizing guide in Azure HDInsight
description: Interactive Query sizing guide in Azure HDInsight
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 05/08/2020
---

# Interactive Query cluster sizing guide in Azure HDInsight

This document describes the sizing of the HDInsight Interactive Query cluster (LLAP) for a typical workload to achieve reasonable performance. The recommendations provided in this document are generic and specific workloads may need specific tuning.

## Default VM types for Interactive Query

| Node Type | Instance | Size |
|---|---|---|
| Head | D13 v2 | 8 VCPUS, 56-GB RAM, 400 GB SSD |
| Worker | D14 v2 | 16 VCPUS, 112-GB RAM, 800 GB SSD |
| ZooKeeper | A4 v2 | 4 VCPUS, 8-GB RAM, 40 GB SSD |

## Recommended configurations

The recommended configurations values are based on the D14 v2 type worker node.

| Key | Value | Description |
|---|---|---|
| yarn.nodemanager.resource.memory-mb | 102400 (MB) | Total memory given, in MB, for all YARN containers on a node. |
| yarn.scheduler.maximum-allocation-mb | 102400 (MB) | The maximum allocation for every container request at the RM, in MBs. Memory requests higher than this value won't take effect. |
| yarn.scheduler.maximum-allocation-vcores | 12 |The maximum number of CPU cores for every container request at the Resource Manager. Requests higher than this value won't take effect. |
| yarn.scheduler.capacity.root.llap.capacity | 90% | YARN capacity allocation for LLAP queue.  |
| hive.server2.tez.sessions.per.default.queue | number_of_worker_nodes |The number of sessions for each queue named in the hive.server2.tez.default.queues. This number corresponds to number of query coordinators(Tez AMs). |
| tez.am.resource.memory.mb | 4096 (MB) | The amount of memory in MB to be used by the tez AppMaster. |
| hive.tez.container.size | 4096 (MB) | Specified Tez container size in MB. |
| hive.llap.daemon.num.executors | 12 | Number of executors per LLAP daemon. |
| hive.llap.io.threadpool.size | 12 | Thread pool size for executors. |
| hive.llap.daemon.yarn.container.mb | 86016 (MB) | Total memory in MB used by individual LLAP daemons (Memory per daemon).|
| hive.llap.io.memory.size | 409600 (MB) | Cache size in MB per LLAP daemon provided SSD cache is enabled. |
| hive.auto.convert.join.noconditionaltask.size | 2048 (MB) | memory size in MB to do Map Join. |

## LLAP daemon size estimations  

### yarn.nodemanager.resource.memory-mb

This value indicates a maximum sum of memory in MB used by the YARN containers on each node. It specifies the amount of memory YARN can use on this node, so this value should be lesser than the total memory on that node.

Set this value = [Total physical memory on node] – [ memory for OS + Other services ].

It's recommended to set this value to ~90% of the available RAM. For D14 v2, the recommended value is **102400 MB**.

### yarn.scheduler.maximum-allocation-mb

This value indicates the maximum allocation for every container request at the Resource Manager, in MB. Memory requests higher than the specified value won't take effect. The Resource Manager can only give memory to containers in increments of `yarn.scheduler.minimum-allocation-mb` and can't exceed the size specified by `yarn.scheduler.maximum-allocation-mb`. This value shouldn't be more than the total given memory of the node, which is specified by `yarn.nodemanager.resource.memory-mb`.

For D14 v2 worker nodes, the recommended value is **102400 MB**

### yarn.scheduler.maximum-allocation-vcores

This configuration indicates the maximum number of virtual CPU cores for every container request at the Resource Manager. Requesting a higher value than this configuration won't take effect. This configuration is a global property of the YARN scheduler. For LLAP daemon container, this value can be set to 75% of total available virtual cores (VCORES). The remaining 25% should be reserved for NodeManager, DataNode, and other services running on the worker nodes.  

For D14 v2 worker nodes, there are 16 VCORES and 75% of 16 VCORES can be given. So the recommended value for LLAP daemon container is **12**.

### hive.server2.tez.sessions.per.default.queue

This configuration value determines the number of Tez sessions that should be launched in parallel for each of the queues specified by `hive.server2.tez.default.queues`. The value corresponds to the number of Tez AMs (Query Coordinators). It's recommended to be the same as the number of worker nodes to have one Tez AM per node. The number of Tez AMs can be higher than the number of LLAP daemon nodes. Their primary responsibility is to coordinate the query execution and assign query plan fragments to corresponding LLAP daemons for execution. It's recommended to keep it as multiple of a number of LLAP daemon nodes to achieve higher throughput.  

Default HDInsight cluster has four LLAP daemons running on four worker nodes, so the recommended value is **4**.  

### tez.am.resource.memory.mb, hive.tez.container.size

`tez.am.resource.memory.mb` defines the Tez Application Master size.  
The recommended value is **4096 MB**.

`hive.tez.container.size` defines the amount of memory given for Tez container. This value must be set between the YARN minimum container size(`yarn.scheduler.minimum-allocation-mb`) and the YARN maximum container size(`yarn.scheduler.maximum-allocation-mb`).  
It's recommended to be set to **4096 MB**.  

A general rule is to keep it lesser than the amount of memory per processor considering one processor per container. `Rreserve` memory for number of Tez AMs on a node before giving the memory for LLAP daemon. For instance, if you're using two Tez AMs(4 GB each) per node, give 82 GB out of 90 GB for LLAP daemon reserving 8 GB for two Tez AMs.

### yarn.scheduler.capacity.root.llap.capacity

This value indicates a percentage of capacity given for LLAP queue. The HDInsights Interactive query cluster gives 90% of the total capacity for LLAP queue and the remaining 10% is set to default queue for other container allocations.  
For D14v2 worker nodes, the recommended value is **90** for LLAP queue.

### hive.llap.daemon.yarn.container.mb

The total memory size for LLAP daemon depends on following components:

* Configuration of YARN container size (`yarn.scheduler.maximum-allocation-mb`, `yarn.scheduler.maximum-allocation-mb`, `yarn.nodemanager.resource.memory-mb`)

* Heap memory used by executors (Xmx)

    Its amount of RAM available after taking out headroom size.  
    For D14 v2, HDI 4.0 - this value is (86 GB - 6 GB) = 80 GB  
    For D14 v2, HDI 3.6 - this value is (84 GB - 6 GB) = 78 GB

* Off-heap in-memory cache per daemon (hive.llap.io.memory.size)

* Headroom

    It's a portion of off-heap memory used for Java VM overhead (metaspace, threads stack, gc data structures, and so on). This portion is observed to be around 6% of the heap size (Xmx). To be on the safer side, it can be calculated as 6% of total LLAP daemon memory size. Because it's possible when SSD cache is enabled, it will allow LLAP daemon to use all available in-memory space to be used only for heap.  
    For D14 v2, the recommended value is ceil(86 GB x 0.06) ~= **6 GB**.  

Memory per daemon = [In-memory cache size] + [Heap size] + [Headroom].

It can be calculated as follows:

Tez AM memory per node = [ (Number of Tez AMs/Number of LLAP daemon nodes) * Tez AM size ].
LLAP daemon container size =  [ 90% of YARN max container memory ] – [ Tez AM memory per node ].

For D14 v2 worker node, HDI 4.0 -  the recommended value is (90 - (1/1 * 4 GB)) = **86 GB**.
(For HDI 3.6, recommended value is **84 GB** because you should reserve ~2 GB for slider AM.)  

### hive.llap.io.memory.size

This configuration is the amount of memory available as cache for LLAP daemon. The LLAP daemons can use SSD as a cache. Setting `hive.llap.io.allocator.mmap` = true will enable SSD caching. The D14 v2 comes with ~800 GB of SSD and the SSD caching is enabled by default for interactive query Cluster (LLAP). It's configured to use 50% of the SSD space for off-heap cache.

For D14 v2, the recommended value is **409600 MB**.  

For other VMs, with no SSD caching enabled, it's beneficial to give portion of available RAM for LLAP caching to achieve better performance. Adjust the total memory size for LLAP daemon as follows:  

Total LLAP daemon memory = [LLAP cache size] + [Heap size] + [Headroom].

It's recommended to adjust the cache size and the heap size that is best suitable for your workload.  

### hive.llap.daemon.num.executors

This configuration controls the number of executors that can execute tasks in parallel per LLAP daemon. This value is a balance of number of available VCORES, the amount of memory given per executor, and total memory available per LLAP daemon. Usually, we would like this value to be as close as possible to the number of cores.

For D14 v2, there are 16 VCORES available, however not all of the VCORES can be given. The worker nodes also run other services like NodeManager, DataNode, and Metrics Monitor, that needs some portion of available VCORES. This value can be configured up to 75% of the total VCORES available on that node.

For D14 v2, the recommended value is (.75 X 16) = **12**

It's recommended that you reserve ~6 GB of heap space per executor. Adjust your number of executors based on available LLAP daemon size, and number of available VCORES per node.  

### hive.llap.io.threadpool.size

This value specifies the thread pool size for executors. Since executors are fixed as specified, it will be same as number of executors per LLAP daemon.

For D14 v2, it's recommended to set this value to **12**.

This configuration can't exceed `yarn.nodemanager.resource.cpu-vcores` value.

### hive.auto.convert.join.noconditionaltask.size

Make sure you have `hive.auto.convert.join.noconditionaltask` enabled for this parameter to take effect. This configuration allows the user to specify the size of the tables that can fit in memory to do Map join. If the sum of the size of n-1 of the `tables/partitions` for n-way join is less than the configured value, the Map join will be chosen. The LLAP executor memory size should be used to calculate the threshold for autoconvert to Map Join.

For D14 v2, it's recommended to set this value to **2048 MB**.

We recommend adjusting this value that is suitable for your workload as setting this value too low may not use autoconvert feature. Setting it too high may result into GC pauses, which can adversely affect query performance.

## Next steps

* [Gateway guidelines](gateway-best-practices.md)
* [Demystify Apache Tez Memory Tuning - Step by Step](https://community.cloudera.com/t5/Community-Articles/Demystify-Apache-Tez-Memory-Tuning-Step-by-Step/ta-p/245279)
* [Map Join Memory Sizing For LLAP](https://community.cloudera.com/t5/Community-Articles/Map-Join-Memory-Sizing-For-LLAP/ta-p/247462)
* [LLAP - a one-page architecture overview](https://community.cloudera.com/t5/Community-Articles/LLAP-a-one-page-architecture-overview/ta-p/247439)
* [Hive LLAP deep dive](https://community.cloudera.com/t5/Community-Articles/Hive-LLAP-deep-dive/ta-p/248893)
