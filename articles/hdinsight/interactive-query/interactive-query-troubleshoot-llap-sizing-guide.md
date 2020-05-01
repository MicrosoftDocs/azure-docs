# Azure HDInsight Interactive Query Cluster(Hive LLAP) sizing guide

This document describes the sizing of the HDInsight Interactive Query Cluster(Hive LLAP cluster) for a typical workload with reasonable performance.  Please note that the recommendations provided in this document are generic guidelines and specific workloads may need specific tuning.

### Azure Default VM Types for HDInsight Interactive Query Cluster(LLAP)

| Node Type      | Instance | Size     |
| :---        |    :----:   | :---     |
| Head      | D13 v2       | 8 vcpus, 56GB RAM, 400GB SSD   |
| Worker   | **D14 v2**        | **16 vcpus, 112 GB RAM, 800GB SSD**       |
| ZooKeeper   | A4 v2        | 4 vcpus, 8GB RAM, 40GB SSD       |

***All recommended configurations values are based on D14 v2 type worker node***
### **Configuration:**    
| Configuration Key      | Recommended value  | Description |
| :---        |    :----:   | :---     |
| yarn.nodemanager.resource.memory-mb | 102400 (MB) | Total memory allocated, in MB, for all YARN containers on a node | 
| yarn.scheduler.maximum-allocation-mb | 102400 (MB) | The maximum allocation for every container request at the RM, in MBs. Memory requests higher than this won't take effect |
| yarn.scheduler.maximum-allocation-vcores | 12 |The maximum allocation for every container request at the RM, in terms of virtual CPU cores. Requests higher than this won't take effect. |
| hive.server2.tez.sessions.per.default.queue | <number_of_worker_nodes> |The number of sessions for each queue named in the hive.server2.tez.default.queues. This number corrosponds to number of query coordinators(Tez AMs) |
| tez.am.resource.memory.mb | 4096 (MB) | The amount of memory in MB to be used by the tez AppMaster |
| hive.tez.container.size | 4096 (MB) | Specified Tez container size in MB |
| yarn.scheduler.capacity.root.llap.capacity | 90 % | YARN capacity allocation for llap queue  |
| hive.llap.daemon.num.executors | 12 | Number of executors per LLAP daemon | 
| hive.llap.io.threadpool.size | 12 | Thread pool size for executors |
| hive.llap.daemon.yarn.container.mb | 86016 (MB) | Total memory in MB used by individual LLAP daemons (Memory per daemon)
| hive.llap.io.memory.size | 409600 (MB) | Cache size in MB per LLAP daemon provided SSD cache is enabled |
| hive.auto.convert.join.noconditionaltask.size | 4096 (MB) | memory size in MB to perform Map Join |

### **LLAP Daemon size estimations:**  

**1. Determining YARN total memory allocated for all YARN containers on a node**  
    Configuration: *yarn.nodemanager.resource.memory-mb*  

This value indicates a maximum sum of memory in MB used by the YARN containers on each node.  
Set this value = [Total physical memory on node] – [ memory for OS + Hadoop Daemons + Other services]  For D14 v2, the recommended value is **102400 MB** which is ~90% of total available RAM 

**2. Determining YARN scheduler maximum allocation size per request**  
Configuration: *yarn.scheduler.maximum-allocation-mb*

This value indicates the maximum allocation for every container request at the ResourceManager, in MB. Memory requests higher than the specified value will not take effect. The ResourceManager can only allocate memory to containers in increments of yarn.scheduler.minimum-allocation-mb and can not exceed yarn.scheduler.maximum-allocation-mb. This value should not be more than the total allocated memory of the node which is specified by yarn.nodemanager.resource.memory-mb.  
For D14 v2 worker nodes, the recommended value is **102400 MB**

**3. Determining maximum amount of vcores per YARN container**  
Configuration: *yarn.scheduler.maximum-allocation-vcores*  

This value indicates the maximum allocation for every container request at the Resource Manager, in terms of virtual CPU cores. Requesting a higher value than this will not take effect. This is a global property of the YARN scheduler. For LLAP daemon container this value can be set to 75% of total available vcores reserving the remaining 25% for NodeManager and other services running on the worker nodes.
For D14 v2 worker nodes, the recommended value for LLAP daemon container is 12 (75% of 16).

**4. Number of concurrent queries**  
Configuration: *hive.server2.tez.sessions.per.default.queue*

This configuration value determines the number of Tez sessions that should be launched in parallel for each of the queues specified by "hive.server2.tez.default.queues". It corresponds to the number of Tez AMs (Query Co-ordinators). It is recommended to be the same as the number of worker nodes to have one Tez AM per node.The number of Tez AMs can be higher than the number of LLAP daemon nodes as it just co-ordinates the query and assigns fragments to corresponding LLAP daemons. But, it is recommended to keep it as multiple of a number of LLAP daemon nodes to achieve higher throughput.  
Default HDInsight cluster with 4 LLAP daemons on 4 worker nodes, hence recommended value is 4.  

**5. Tez Container and Tez Application Master size**    
Configuration: *tez.am.resource.memory.mb, hive.tez.container.size*  

*tez.am.resource.memory.mb* this defines the Tez Application Master size and it is recommended to be set to 4GB.
   
*hive.tez.container.size* specifies the amount of memory allocated for Tez container. This value must be set between  the YARN minimum container size and the YARN maximum container size(*yarn.scheduler.minimum-allocation-mb*) and (*yarn.scheduler.maximum-allocation-mb*). It is recommended to be set to 4GB.

A general rule of thumb is to keep it lesser than the amount of memory per processor considering one processor per container. You should reserve memory for number of Tez AMs per node on llap queue before allocating it for LLAP daemon. For instance, in case of using 2 Tez AMs(4GB each) per node one should allocate only 82GB out of 90GB for LLAP daemon reserving 8GB for Tez AMs.

**6. LLAP Queue capacity allocation**   
Configuration: *yarn.scheduler.capacity.root.llap.capacity*  

This value indicates a percentage of capacity allocated for llap queue HDInsights Interactive query cluster dedicates 90 % of the total capacity for llap queue and the remaining 10% is set to default queue for other container allocations.  
For D14v2 worker nodes, this value is 90 for llap queue.

**7. LLAP daemon container size**    
Configuration: *hive.llap.daemon.yarn.container.mb*  
   
The total memory size for LLAP daemon depends on following components
1. configuration of YARN container size (yarn.scheduler.maximum-allocation-mb, yarn.nodemanager.resource.memory-mb, )
2. Heap memory used by executors (Xmx)
3. Off-heap in-memory cache per daemon (hive.llap.io.memory.size)
4. Headroom 
    
Memory per daemon = in-memory cache size + heap size + head room  
It can be calculated as follows;
total LLAP daemon container size =  (90% of YARN container memory – 
                                         (Number of Tez AMs/Number of LLAP nodes * Tez AM size)). 
    
For D14 v2 worker node, it is (90 - (1/1 * 4GB)) = 86 GB 
For HDI 3.6: recommended value is 84 GB because you should reserve ~2GB for slider AM.

Headroom size:
It is a portion of off-heap memory used for Java VM overhead (metaspace, threads stack, gc data structures, etc.). This is observed to be around 6% of the heap size (Xmx). To be on the safer side it can be calculated as 6% of total LLAP daemon memory size because it possible when SSD cache is enabled it will allow LLAP daemon to utilize all of the available memory to be used only for heap.
For D14 v2, this value is  86 GB x 0.06 ~= 6 GB

Heap size(Xmx):
It is amount of RAM available after taking out Headroom size.
For D14 v2, this value is (86 GB - 6 GB) = 80 GB
For D14 v2, HDI 3.6 this is (84 GB - 6 GB) = 78 GB

**8. LLAP daemon cache size**  
Configuration: *hive.llap.io.memory.size*

This is the amount of memory available as cache for LLAP daemon.
The D14 v2 comes with ~800 GB of SSD and SSD cache is enabled by default for LLAP Cluster (LLAP). It uses 50% of SSD space for off-heap cache. 
For D14 v2 , the recommended value is 409600 MB. 

TBD: [in-memory cache calculations ] (total LLAP daemon memory - heap + head room)

**9. Determining number of executors per LLAP daemon**  
Configuration: *hive.llap.daemon.num.executors*, *hive.llap.io.threadpool.size*
   
This configuration controls the number of executors that can execute tasks in parallel per LLAP daemon. This value is a balance of number of vcores available, the amount of memory allocated per executor and the amount of total memory available per LLAP daemon. Usually, we would like this value to be as close as possible to the number of cores.
For D14 v2 , there are 16 vcores available, however, not all of the vcores can be allocated because the worker nodes also run other services like NodeManager, DataNode, Metrics Monitor etc. that need some portion of available vcores. 
   
This value can be configured up to 75% of the total vcores available on the node. It is recommended to be 
Max(75 % of the number of vcores on the node, 
    (LLAP daemon heap size - (number of Tez AM x Tez container size[4GB]))/6)

*hive.llap.io.threadpool.size* specifies the thread pool size for executors. Since executors are fixed it will be same as number of executors per LLAP daemon. It is recommended to set it to 12.

[TBD: Clarification]  
~~Considering approx 6 GB heap size per executor.~~
   ~~Number of executors = Numer of vcores x .75~~
   ~~For D14 v2, recommended value is (16 x .75) = 12~~

   ~~It is recommended to be Min(number of vcores in the LLAP container, LLAP daemon heap size/Tez container size[4GB]). For, D14 v2 instance, the    recommended value is 16~~

This configuration cannot exceed yarn.nodemanager.resource.cpu-vcores value.

**10. Adjusting Map Join memory**   [TBD: Clarification ]  
Configuration: *hive.auto.convert.join.noconditionaltask.size*

This configuration allows the user to specify the size of the tables that can fit in memory to perform Map join. If the sum of size of n-1 of the tables/partitions for n-way join is less than the configured value the Map join will be chosen. The LLAP executor memory size should be used to calculate the threshold for auto-convert to in this case is 4GB.


#### **Refereces:**

*https://community.cloudera.com/t5/Community-Articles/Demystify-Apache-Tez-Memory-Tuning-Step-by-Step/ta-p/245279*  
*https://community.cloudera.com/t5/Community-Articles/Map-Join-Memory-Sizing-For-LLAP/ta-p/247462*  
*https://community.cloudera.com/t5/Community-Articles/LLAP-a-one-page-architecture-overview/ta-p/247439*  
*https://community.cloudera.com/t5/Community-Articles/Hive-LLAP-deep-dive/ta-p/248893*
