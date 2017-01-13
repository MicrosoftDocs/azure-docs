---
title: Azure Data Lake Store Storm Performance Tuning Guidelines | Microsoft Docs
description: Azure Data Lake Store Storm Performance Tuning Guidelines
services: data-lake-store
documentationcenter: ''
author: stewu
manager: amitkul
editor: stewu

ms.assetid: ebde7b9f-2e51-4d43-b7ab-566417221335
ms.service: data-lake-store
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 12/19/2016
ms.author: stewu

---
# Performance tuning guidance for Storm on HDInsight and Azure Data Lake Store

There are a few factors that need to be considered when tuning the performance of a Storm topology.  It is important to understand the characteristics of the work done by the spouts and the bolts (whether the work is I/O or memory intensive).

## Prerequisites 

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/). 
* **An Azure Data Lake Store account**. For instructions on how to create one, see [Get started with Azure Data Lake Store](data-lake-store-get-started-portal.md) 
* **Azure HDInsight cluster** with access to a Data Lake Store account. See [Create an HDInsight cluster with Data Lake Store](data-lake-store-hdinsight-hadoop-use-portal.md). Make sure you enable Remote Desktop for the cluster. 
* **Running Storm cluster on Azure Data Lake Store**.  For more information, see [Storm on HDInsight](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-storm-overview) 
* **Performance tuning guidelines on ADLS**.  For general performance concepts, see [Data Lake Store Performance Tuning Guidance](https://docs.microsoft.com/en-us/azure/data-lake-store/data-lake-store-performance-tuning-guidance)  

**Tuning the Parallelism of the topology**

Better performance may be attained by increasing the concurrency of the I/O to and from Azure Data Lake Store.  
A Storm topology has a set of configurations that determine the parallelism:
* Number worker processes: The workers are evenly distributed across the VMs.
* Number of spout executor instances
* Number of bolt executor instances
* Number of spout tasks
* Number of bolt tasks

For example, on a cluster with 4 VMs and 4 worker processes, 32 spout executors & 32 spout tasks, 256 bolt executors and 512 bolt tasks:

Each supervisor, which is a worker node, will have a single worker JVM process that will manage 4 spout threads and 64 bolt threads. Within each thread, tasks are executed sequentially. With the above configuration, each spout thread will have one task and each bolt thread will have 2 tasks.

In Storm, here are the various components involved, and how they impact the level of parallelism you have:
* The head node (called Nimbus in Storm) is used to submit and manage jobs. These nodes have no impact on the degree of parallelism.
* The supervisor nodes – In Azure HDInsight this corresponds to a worker node Azure VM.
* The worker tasks are Storm processes running in the VMs. Each worker task corresponds to a java JVM instance. Storm distributes the number of worker processes you specify to the worker nodes as evenly as possible.
* Spout and bolt executor instances: Each executor instance corresponds to a thread running within the workers (JVMs)
* Storm tasks: These are logical tasks that each of these threads run. This does not change the level of parallelism, so you should evaluate if you need multiple tasks per executor or not.

## Guidance

When working with Azure Data Lake, you get best performance if you do the following:
* Coalesce your small appends into larger sizes (ideally 4MB in size)
* Do as many concurrent requests as you can. Since each bolt thread is doing blocking reads, you want to have somewhere in the range of 8-12 threads per core, so you can keep the NIC and the CPU well utilized.  A larger VM will enable more concurrent requests.  

## Example

Let’s assume you have an 8 worker node cluster with D13v2 Azure VM.  A D13v2 VM has 8 cores, so between the 8 worker nodes, you have 64 total cores.

Let’s say we do 8 bolt threads per core. Given 64 cores, that means we want 512 total bolt executor instances (i.e., threads). In this case, let’s say we start with one JVM per VM and mainly use the thread concurrency within the JVM to achieve concurrency. That means we need 8 worker tasks (one per Azure VM), and 512 bolt executors. Given this configuration, Storm will try to distribute the workers evenly across worker nodes (aka supervisor nodes), giving each worker node one JVM. Now within the supervisors, Storm will try to distribute the executors evenly between supervisors, giving each supervisor (i.e., JVM) 8 threads each.

## Further Tuning
Once you have the basic topology, you can consider whether you want to tweak any of the parameters:
* **Number of JVMs per worker node:** If you have a large data structure (e.g., a lookup table) you host in memory, then each JVM requires a separate copy, vs having fewer JVMs lets you use the structure across many threads. For the bolt’s I/O the number of JVMs does not make that much of a difference as the number of threads added across those JVMs. For simplicity we recommend one JVM per worker, but depending on what your bolt I doing or what application processing you require, you may need to evaluate if this is a number you need to tweak.
* **Number of spout executors:** Since the example here uses bolts for writing to Azure Data Lake, the number of spouts is not directly relevant to the bolt performance. However, depending on the amount of processing or I/O happening in the spout, you will want to tune the spouts for best performance. In the very least, you want to make sure that you have enough spouts to be able to keep the bolts busy – i.e., the output rates of the spouts should match the throughput of the bolts. The actual configuration will depend on the spout, and is outside of the scope of this paper.
* **Number of tasks:** Each bolt runs as a single thread. Additional tasks per bolt does not provide any additional concurrency. The only time they are of benefit is if your process of acknowledging the tuple takes a large proportion of your bolt execution time. We recommend grouping many tuples into a larger append before you send an acknowledgement from the bolt, so in most cases, multiple tasks provide no additional benefit.
* **Local or shuffle grouping:** When this setting is enabled, tuples are sent to bolts within the same worker process. This reduces inter-process communication and network calls. This is recommended for most topologies.

As a starting approach, we recommend starting with basic scenario and test with your own data to tweak the parameters mentioned above to achieve optimal performance.

## Tuning the Spout

**Tuple timeout**

topology.message.timeout.secs – This setting determines the amount of time a message to complete & receive acknowledgement before it is considered failed.

**Max memory per worker process**

Worker.childopts - This setting lets you specify additional command line parameters to the java workers. The most commonly used setting here is XmX, which determines the maximum memory allocated to a JVM’s heap.

**Max spout Pending**

Topology.max.spout.pending - This configuration determines the number of tuples that can in be flight (not yet acknowledged at all nodes in the topology) per spout thread at any point of time.

A good calculation to do is the estimate the size of each of your tuples. Then figure out how much memory one spout thread has. The total memory allocated to a thread divided by this value should give you the upper bound for max spout pending parameter.

## Tuning the Bolt
When writing to ADLS, it is recommended to set a size sync policy (buffer on the client side) to 4 MiB.  A flushing or a hsync() is then performed only when the buffer size is the above value.  The ADLS driver on the worker VM automatically does this buffering, unless the user explicitly performs a hsync().

The default ADLS storm bolt has a size sync policy parameter (fileBufferSize) that can be used to tune this parameter.

In I/O intensive topologies, it is recommended that each bolt thread writes to its own file and set a file rotation policy (fileRotationSize).  When the file reaches a certain size, the stream is automatically flushed and a new file is written to.  The recommended file size for rotation is 1GB.

**When to acknowledge:**
In Storm, a spout holds on to a tuple until it is explicitly acknowledged by the bolt.  If a tuple has been read by the bolt but not been acknowledged yet, then that means that it is not guaranteed that the bolt has persisted into Azure Data Lake Store backend.  Once a tuple is acknowledged, the spout can be guaranteed persistence by the bolt, so it can then delete the source data from whatever source it is reading from.  

**For best performance on ADLS:**
We recommend that the bolt buffer 4MBs of tuple data and then write to ADLS backend as one 4MB write. Once the data has been successfully written to the store (by calling hflush()), the bolt can then acknowledge the data back to the spout. This is what the example bolt supplied here does. It is also acceptable to hold larger number of tuples before hflush() call is made and tuples acknowledged. However, this increases the number of tuples in flight that the spout needs to hold, and therefore increases the amount of memory required per JVM.

Applications may have a requirement to acknowledge more frequently (at data sizes less than 4MB) for other non-performance reasons. However, that may impact the I/O throughput to the storage backend, so customer should carefully weigh this tradeoff against the bolt’s I/O performance.

If the incoming rate of tuples is not high enough so the 4MB buffer takes a long time to fill, you might want to consider mitigating it in a number of ways:
* Reduce the number of bolts, so there are fewer 4MB buffers to fill
* Have a time-based or count-based policy, where an hflush() is triggered every x flushes or every y milliseconds, and the tuples accumulated so far are acknowledged back.

Note that the throughput in this case is lower, but with a slow rate of events, maximum throughput is not the biggest objective anyway.  These mitigations above allow you to reduce the end-to-end time that it takes for a tuple to flow through to the store, which may matter if you want a real-time pipeline even in the face of low event rate.  Also note that if your incoming tuple rate is low, you also want to adjust the topology.message.timeout_secs parameter, so the tuples don’t timeout while they are getting buffered or processed.

## Interpreting Storm UI  
While your topology is running, you can monitor it in the storm UI. When looking at the UI, these are the main parameters to look at:

* **Total process execution latency** – This is the average time one tuple takes to be emitted by spout, processed by bolt and get acknowledged.

* **Total bolt process latency** – This is the average time spent by the tuple at the bolt until it receives an acknowledgement.

* **Total bolt execute latency** – This is the average time spent by the bolt in the execute method.

* **Number of failures** – This refers to the number of tuples that failed to be fully processed before they timed out.

* **Capacity** – This is a measure of how busy your system is. If this number is 1, your bolts are working as fast as they can. If it is less than 1, increase your parallelism. If it is greater than, reduce the parallelism.

## Common Troubleshooting Scenarios
* **Large number of tuples timing out** – Look at each node in the topology to determine where the bottleneck is. Most common reason for this is that the bolts are not able to keep up with the spouts, leading to tuples clogging the internal buffers while waiting to be processed. Consider increasing the timeout value or decrease the max spout pending.

* **High total process execution latency, but low bolt process latency** – In this case, either the tuples are not being ed fast enough. Check that there are sufficient number of ackers. Another possibility is that they are waiting in the queue for too long before the bolts starting processing them. Decrease the max spout pending.

* **High bolt execute latency** – This means that the execute() method of your bolt is taking too long. Optimize the code or look at write sizes/flush behavior.

## Limitation
ADLS throttling: if you hit the limits of bandwidth provided by ADLS, you would start to see task failures. This could be identified by observing throttling errors in task logs.  You can decrease the parallelism by increasing container size.  If you need more concurrency for your job, please contact us.   
To check if you are getting throttled, you need to enable the debug logging on the client side. Here’s how you can do that:

1. Change the following in the Ambari > Storm > Config > Advanced storm-worker-log4j.  Change &lt;root level="info"&gt; to &lt;root level=”debug”&gt;.  Restart all the nodes/service for the config to take effect.
2. Monitor storm topology logs on worker nodes (under /var/log/storm/worker-artifacts/&lt;TopologyName&gt;/&lt;port&gt;/worker.log) for ADLS throttling exceptions.

## Additional Tuning
Additional performance tuning for Storm can be referenced in this [blog](https://blogs.msdn.microsoft.com/shanyu/2015/05/14/performance-tuning-for-hdinsight-storm-and-microsoft-azure-eventhubs/).

## Examples to Run
Please try this example on located on [github](https://github.com/hdinsight/storm-performance-automation).
