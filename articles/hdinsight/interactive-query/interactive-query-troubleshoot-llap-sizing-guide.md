---
title: HDInsight Interactive Query Cluster(LLAP) sizing guide
description: LLAP sizing guide 
ms.service: hdinsight
ms.topic: troubleshooting
author: aniket-ms
ms.author: aadnaik
ms.reviewer: HDI HiveLLAP Team
ms.date: 05/05/2020
---

# Azure HDInsight Interactive Query Cluster (Hive LLAP) sizing guide

This document describes the sizing of the HDInsight Interactive Query Cluster (Hive LLAP cluster) for a typical workload to achieve reasonable performance. Please note that the recommendations provided in this document are generic guidelines and specific workloads may need 
specific tuning.

### **Azure Default VM Types for HDInsight Interactive Query Cluster(LLAP)**

| Node Type      | Instance | Size     |
| :---        |    :----:   | :---     |
| Head      | D13 v2       | 8 vcpus, 56 GB RAM, 400 GB SSD   |
| Worker   | **D14 v2**        | **16 vcpus, 112 GB RAM, 800 GB SSD**       |
| ZooKeeper   | A4 v2        | 4 vcpus, 8-GB RAM, 40 GB SSD       |

***Note: All recommended configurations values are based on D14 v2 type worker node***  

### **Configuration:**    
| Configuration Key      | Recommended value  | Description |
| :---        |    :----:   | :---     |
| yarn.nodemanager.resource.memory-mb | 102400 (MB) | Total memory given, in MB, for all YARN containers on a node | 
| yarn.scheduler.maximum-allocation-mb | 102400 (MB) | The maximum allocation for every container request at the RM, in MBs. Memory requests higher than this value won't take effect |
| yarn.scheduler.maximum-allocation-vcores | 12 |The maximum number of CPU cores for every container request at the Resource Manager. Requests higher than this value won't take effect. |
| yarn.nodemanager.resource.cpu-vcores | 12 | 
| yarn.scheduler.capacity.root.llap.capacity | 80 (%) | YARN capacity allocation for llap queue  |
| hive.server2.tez.sessions.per.default.queue | <number_of_worker_nodes> |The number of sessions for each queue named in the hive.server2.tez.default.queues. This number corresponds to number of query coordinators(Tez AMs) |
| tez.am.resource.memory.mb | 4096 (MB) | The amount of memory in MB to be used by the tez AppMaster |
| hive.tez.container.size | 4096 (MB) | Specified Tez container size in MB |
| hive.llap.daemon.num.executors | 12 | Number of executors per LLAP daemon | 
| hive.llap.io.threadpool.size | 12 | Thread pool size for executors |
| hive.llap.daemon.yarn.container.mb | 77824 (MB) | Total memory in MB used by individual LLAP daemons (Memory per daemon)
| hive.llap.io.memory.size | 235520 (MB) | Cache size in MB per LLAP daemon provided SSD cache is enabled |
| hive.auto.convert.join.noconditionaltask.size | 2048 (MB) | memory size in MB to perform Map Join |

### **LLAP Daemon size estimations:**  

#### **1. Determining total YARN memory allocation for all containers on a node**    
Configuration: ***yarn.nodemanager.resource.memory-mb***  

This value indicates a maximum sum of memory in MB that can be used by the YARN containers on each node. The value specified should be lesser than the total amount of physical memory on that node.   
Total memory for all YARN containers on a node = [Total physical memory] – [ memory for OS + Other services ]  
It is recommended to set this value to ~90% of the available RAM.  
For D14 v2, the recommended value is **102400 MB**. 

#### **2. Determining maximum amount of memory per YARN container request**  
Configuration: ***yarn.scheduler.maximum-allocation-mb***

This value indicates the maximum allocation for every container request at the Resource Manager, in MB. Memory requests higher than the specified value will not take effect. The Resource Manager can allocate memory to containers in increments of *yarn.scheduler.minimum-allocation-mb* and cannot exceed the size specified by *yarn.scheduler.maximum-allocation-mb*. The value specified should not be more than the total allocated memory for all containers on the node specified by *yarn.nodemanager.resource.memory-mb*.    
For D14 v2 worker nodes, the recommended value is **102400 MB**

#### **3. Determining maximum amount of vcores per YARN container request**  
Configuration: ***yarn.scheduler.maximum-allocation-vcores***  

This value indicates the maximum number of virtual CPU cores for every container request at the Resource Manager. Requesting a higher value than this will not take effect. This is a global property of the YARN scheduler. For LLAP daemon container, this value can be set to 75% of total available vcores. The remaining 25% should be reserved for NodeManager, DataNode, and other services running on the worker nodes.  
For D14 v2 worker nodes, there are 16 vcores and 75% of 16 vcores can be used by LLAP daemon container, therefore the recommended value for LLAP daemon container is **12**.  

#### **4. Number of concurrent queries**  
Configuration: ***hive.server2.tez.sessions.per.default.queue***

This configuration value determines the number of Tez sessions that should be launched in parallel for each of the queues specified by "hive.server2.tez.default.queues". It corresponds to the number of Tez AMs (Query Coordinators). It is recommended to be the same as the number of worker nodes to have one Tez AM per node.The number of Tez AMs can be higher than the number of LLAP daemon nodes as their primary responsibility is to coordinates the query execution and assign query plan fragments to corresponding LLAP daemons for execution. It is recommended to keep it as multiple of a number of LLAP daemon nodes to achieve higher throughput.  

Default HDInsight cluster has four LLAP daemons running on four worker nodes, therefore the recommended value is **4**.  

#### **5. Tez Container and Tez Application Master size**    
Configuration: ***tez.am.resource.memory.mb, hive.tez.container.size***  

*tez.am.resource.memory.mb* - defines the Tez Application Master size.  
The recommended value is **4096 MB**.
   
*hive.tez.container.size* - defines the amount of memory allocated for Tez container. This value must be set between  the YARN minimum container size(*yarn.scheduler.minimum-allocation-mb*) and the YARN maximum container size(*yarn.scheduler.maximum-allocation-mb*).  
It is recommended to be set to **4096 MB**.  The LLAP daemon executors use this configuration for limiting memory usage per executor.

You should reserve some memory for Tez AMs on a node before allocating the memory for LLAP daemon container. For instance, if you are using two Tez AMs (4 GB each) per node, you should allocate only 82 GB out of 90 GB for LLAP daemon reserving 8 GB for two Tez AMs.

#### **6. LLAP Queue capacity allocation**   
Configuration: ***yarn.scheduler.capacity.root.llap.capacity***  

This value indicates a percentage of capacity allocated for llap queue. The capacity allocations may have different values for different workloads depending on how the YARN queues are configured. If your workload is read only operations then setting it as high as 90% of the capacity should work. However, if your workload is mix of update/delete/merge operations using managed tables, it is recommended to assign 80% of the capacity for llap queue. The remaining 20% capacity can be used by other internally invoked tasks such as compaction etc. to allocate containers from default queue without much depriving of YARN resources.    
For D14v2 worker nodes, the recommended value is **80** for llap queue. For readonly workloads, it can be increased up to 90 as suitable.  

#### **7. LLAP daemon container size**    
Configuration: ***hive.llap.daemon.yarn.container.mb***  
   
LLAP daemon is run as a YARN container on each worker node. The total memory size for LLAP daemon container depends on following factors,    
1. Configurations of YARN container size (yarn.scheduler.maximum-allocation-mb, yarn.scheduler.maximum-allocation-mb, yarn.nodemanager.resource.memory-mb)
2. Number of Tez AMs on a node
3. Total memory configured for all containers on a node and LLAP queue capacity  

Memory needed by Tez Application Masters(Tez AM) can be calculated as follows,  
For HDInsight Interactive cluster, by default, there is one Tez AM per worker node which acts as a query coordinator. The number of Tez AMs can be configured based on a number of concurrent queries to be served.
It is recommended to have 4 GB of memory per Tez AM.

Tez AM memory per node = [ number of Tez AMs  x Tez AM container size ]
   = (1 x 4 GB ) = 4 GB

Total Memory available for LLAP queue per worker node can be calculated as follows:
This value depends on the total amount of memory available for all YARN containers on a node given by *yarn.nodemanager.resource.memory-mb* and the percentage of capacity configured for llap queue *yarn.scheduler.capacity.root.llap.capacity*..  
Total memory for LLAP queue on worker node =  Total memory available for all YARN containers on a node x  Percentage of capacity for llap queue  
For D14 v2, this value is [ 100 GB x 0.80 ] = 80 GB.

The LLAP daemon container size is calculated as follows;

**LLAP daemon container size =  [ Total memory available for LLAP queue ] – [ Tez AM memory per node ]**  
    
For D14 v2 worker node, HDI 4.0 -  the recommended value is (80 GB - 4 GB)) = **76 GB**   
(For HDI 3.6, recommended value is **74 GB** because you should reserve additional ~2 GB for slider AM.)  

#### **8. Determining number of executors per LLAP daemon**  
Configuration: ***hive.llap.daemon.num.executors***, ***hive.llap.io.threadpool.size***

***hive.llap.daemon.num.executors***:   
This configuration controls the number of executors that can execute tasks in parallel per LLAP daemon. This value is a balance of number of available vcores, the amount of memory allocated per executor and the amount of total memory available for LLAP daemon. Usually, we would like this value to be as close as possible to the number of cores.
For D14 v2, there are 16 vcores available, however, not all of the vcores can be allocated because the worker nodes also run other services like NodeManager, DataNode, Metrics Monitor etc. that need some portion of available vcores. 

This value can be configured up to 75% of the total vcores available on that node. 
For D14 v2, the recommended value is (.75 X 16) = **12**

If you need to adjust your number of executors it is recommended that you consider 4 GB of memory per executor as specified by *hive.tez.container.size* and make sure total memory needed for all executors do not exceed the total memory available for LLAP daemon container.

***hive.llap.io.threadpool.size***:   
This value specifies the thread pool size for executors. Since executors are fixed as specified, it will be same as number of executors per LLAP daemon.   
For D14 v2, it is recommended to set this value to **12**.

#### **9. Determining LLAP daemon cache size**  
Configuration: ***hive.llap.io.memory.size***

LLAP daemon container memory consist of following components;
1. Head room
2. Heap memory used by executors (Xmx)
3. In-memory cache per daemon (this is off-heap memory, not applicable when SSD cache is enabled)
4. In-memory cache metadata size (applicable only when SSD cache is enabled)

**Headroom size**:
It is a portion of off-heap memory used for Java VM overhead (metaspace, threads stack, gc data structures, etc.). This is observed to be around 6% of the heap size (Xmx). To be on the safer side, it can be calculated as 6% of total LLAP daemon memory size  
For D14 v2, the recommended value is ceil(76 GB x 0.06) ~= **5 GB**.  

**Heap size(Xmx)**:
It is amount of heap memory available for all executors.
Total Heap size = Number of executors x 4 GB 
For D14 v2, this value is 12 x 4 GB = 48 GB  

When SSD cache is disabled, the in-memory cache is an amount of memory that is left after taking out Headroom size and Heap size from LLAP daemon container size.

Cache size calculation differs when SSD cache is enabled.
Setting *hive.llap.io.allocator.mmap* = true will enable SSD caching.
When SSD cache is enabled, some portion of the memory will be used to store metadata for the SSD cache. The metadata is stored in memory and it is expected to be ~10% of SSD cache size.   
SSD Cache in-memory metadata size = [ LLAP daemon container size ] - [ Head room + Heap size ]  
For D14 v2, with HDI 4.0, SSD cache in-memory metadata size = [ 76 GB ] - [ 5 GB + 48 GB ] = 23 GB  
For D14 v2, with HDI 3.6, SSD cache in-memory metadata size = [ 76 GB ] - [ 5 GB + 48 GB + 2 GB slider ] = 21 GB

Given the size of available memory for cache metadata, we can calculate the size of SSD cache that can be supported.  
size of in-memory metadata for SSD cache =  10 % of size of SSD Cache     
size of SSD cache = size of in-memory metadata for SSD cache x 10
For D14 v2, with HDI 4.0, the recommended SSD cache size = 23 GB x 10 = 230 GB
For D14 v2, with HDI 4.0, the recommended SSD cache size = 21 GB x 10 = 210 GB

#### **10. Adjusting Map Join memory**   
Configuration: ***hive.auto.convert.join.noconditionaltask.size***

Make sure you have *hive.auto.convert.join.noconditionaltask* enabled for this parameter to take effect.
This configuration allows the user to specify the size of the tables that can fit in memory to perform Map join. If the sum of the size of n-1 of the tables/partitions for n-way join is less than the configured value the Map join will be chosen. The LLAP executor memory size should be used to calculate the threshold for autoconvert to Map Join.
For D14 v2, it is recommended to set this value to **2048 MB**.
Note: We recommend adjusting this value that is suitable for your workload as setting this value too low may not utilize autoconvert feature and setting it too high may result into GC pauses, which can adversely affect query performance.

#### **References:**

*https://community.cloudera.com/t5/Community-Articles/Demystify-Apache-Tez-Memory-Tuning-Step-by-Step/ta-p/245279*  
*https://community.cloudera.com/t5/Community-Articles/Map-Join-Memory-Sizing-For-LLAP/ta-p/247462*  
*https://community.cloudera.com/t5/Community-Articles/LLAP-a-one-page-architecture-overview/ta-p/247439*  
*https://community.cloudera.com/t5/Community-Articles/Hive-LLAP-deep-dive/ta-p/248893*
