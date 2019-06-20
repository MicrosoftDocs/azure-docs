---
title: Azure Data Lake Storage Gen2 Storm performance tuning guidelines | Microsoft Docs
description: Azure Data Lake Storage Gen2 Storm performance tuning guidelines
services: storage
author: normesta

ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 12/06/2018
ms.author: normesta
ms.reviewer: stewu
---

# Performance tuning guidance for Storm on HDInsight and Azure Data Lake Storage Gen2

Understand the factors that should be considered when you tune the performance of an Azure Storm topology. For example, it's important to understand the characteristics of the work done by the spouts and the bolts (whether the work is I/O or memory intensive). This article covers a range of performance tuning guidelines, including troubleshooting common issues.

## Prerequisites

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
* **An Azure Data Lake Storage Gen2 account**. For instructions on how to create one, see [Quickstart: Create a storage account for analytic](data-lake-storage-quickstart-create-account.md).
* **Azure HDInsight cluster** with access to a Data Lake Storage Gen2 account. See [Use Azure Data Lake Storage Gen2 with Azure HDInsight clusters](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-use-data-lake-storage-gen2). Make sure you enable Remote Desktop for the cluster.
* **Running a Storm cluster on Data Lake Storage Gen2**. For more information, see [Storm on HDInsight](https://docs.microsoft.com/azure/hdinsight/hdinsight-storm-overview).
* **Performance tuning guidelines on Data Lake Storage Gen2**.  For general performance concepts, see [Data Lake Storage Gen2 Performance Tuning Guidance](data-lake-storage-performance-tuning-guidance.md).   

## Tune the parallelism of the topology

You might be able to improve performance by increasing the concurrency of the I/O to and from Data Lake Storage Gen2. A Storm topology has a set of configurations that determine the parallelism:
* Number of worker processes (the workers are evenly distributed across the VMs).
* Number of spout executor instances.
* Number of bolt executor instances.
* Number of spout tasks.
* Number of bolt tasks.

For example, on a cluster with 4 VMs and 4 worker processes, 32 spout executors and 32 spout tasks, and 256 bolt executors and 512 bolt tasks, consider the following:

Each supervisor, which is a worker node, has a single worker Java virtual machine (JVM) process. This JVM process manages 4 spout threads and 64 bolt threads. Within each thread, tasks are run sequentially. With the preceding configuration, each spout thread has 1 task, and each bolt thread has 2 tasks.

In Storm, here are the various components involved, and how they affect the level of parallelism you have:
* The head node (called Nimbus in Storm) is used to submit and manage jobs. These nodes have no impact on the degree of parallelism.
* The supervisor nodes. In HDInsight, this corresponds to a worker node Azure VM.
* The worker tasks are Storm processes running in the VMs. Each worker task corresponds to a JVM instance. Storm distributes the number of worker processes you specify to the worker nodes as evenly as possible.
* Spout and bolt executor instances. Each executor instance corresponds to a thread running within the workers (JVMs).
* Storm tasks. These are logical tasks that each of these threads run. This does not change the level of parallelism, so you should evaluate if you need multiple tasks per executor or not.

### Get the best performance from Data Lake Storage Gen2

When working with Data Lake Storage Gen2, you get the best performance if you do the following:
* Coalesce your small appends into larger sizes.
* Do as many concurrent requests as you can. Because each bolt thread is doing blocking reads, you want to have somewhere in the range of 8-12 threads per core. This keeps the NIC and the CPU well utilized. A larger VM enables more concurrent requests.  

### Example topology

Let’s assume you have an 8 worker node cluster with a D13v2 Azure VM. This VM has 8 cores, so among the 8 worker nodes, you have 64 total cores.

Let’s say we do 8 bolt threads per core. Given 64 cores, that means we want 512 total bolt executor instances (that is, threads). In this case, let’s say we start with one JVM per VM, and mainly use the thread concurrency within the JVM to achieve concurrency. That means we need 8 worker tasks (one per Azure VM), and 512 bolt executors. Given this configuration, Storm tries to distribute the workers evenly across worker nodes (also known as supervisor nodes), giving each worker node 1 JVM. Now within the supervisors, Storm tries to distribute the executors evenly between supervisors, giving each supervisor (that is, JVM) 8 threads each.

## Tune additional parameters
After you have the basic topology, you can consider whether you want to tweak any of the parameters:
* **Number of JVMs per worker node.** If you have a large data structure (for example, a lookup table) that you host in memory, each JVM requires a separate copy. Alternatively, you can use the data structure across many threads if you have fewer JVMs. For the bolt’s I/O, the number of JVMs does not make as much of a difference as the number of threads added across those JVMs. For simplicity, it's a good idea to have one JVM per worker. Depending on what your bolt is doing or what application processing you require, though, you may need to change this number.
* **Number of spout executors.** Because the preceding example uses bolts for writing to Data Lake Storage Gen2, the number of spouts is not directly relevant to the bolt performance. However, depending on the amount of processing or I/O happening in the spout, it's a good idea to tune the spouts for best performance. Ensure that you have enough spouts to be able to keep the bolts busy. The output rates of the spouts should match the throughput of the bolts. The actual configuration depends on the spout.
* **Number of tasks.** Each bolt runs as a single thread. Additional tasks per bolt don't provide any additional concurrency. The only time they are of benefit is if your process of acknowledging the tuple takes a large proportion of your bolt execution time. It's a good idea to group many tuples into a larger append before you send an acknowledgement from the bolt. So, in most cases, multiple tasks provide no additional benefit.
* **Local or shuffle grouping.** When this setting is enabled, tuples are sent to bolts within the same worker process. This reduces inter-process communication and network calls. This is recommended for most topologies.

This basic scenario is a good starting point. Test with your own data to tweak the preceding parameters to achieve optimal performance.

## Tune the spout

You can modify the following settings to tune the spout.

- **Tuple timeout: topology.message.timeout.secs**. This setting determines the amount of time a message takes to complete, and receive acknowledgement, before it is considered failed.

- **Max memory per worker process: worker.childopts**. This setting lets you specify additional command-line parameters to the Java workers. The most commonly used setting here is XmX, which determines the maximum memory allocated to a JVM’s heap.

- **Max spout pending: topology.max.spout.pending**. This setting determines the number of tuples that can in be flight (not yet acknowledged at all nodes in the topology) per spout thread at any time.

  A good calculation to do is to estimate the size of each of your tuples. Then figure out how much memory one spout thread has. The total memory allocated to a thread, divided by this value, should give you the upper bound for the max spout pending parameter.

The default Data Lake Storage Gen2 Storm bolt has a size sync policy parameter (fileBufferSize) that can be used to tune this parameter.

In I/O-intensive topologies, it's a good idea to have each bolt thread write to its own file, and to set a file rotation policy (fileRotationSize). When the file reaches a certain size, the stream is automatically flushed and a new file is written to. The recommended file size for rotation is 1 GB.

## Monitor your topology in Storm  
While your topology is running, you can monitor it in the Storm user interface. Here are the main parameters to look at:

* **Total process execution latency.** This is the average time one tuple takes to be emitted by the spout, processed by the bolt, and acknowledged.

* **Total bolt process latency.** This is the average time spent by the tuple at the bolt until it receives an acknowledgement.

* **Total bolt execute latency.** This is the average time spent by the bolt in the execute method.

* **Number of failures.** This refers to the number of tuples that failed to be fully processed before they timed out.

* **Capacity.** This is a measure of how busy your system is. If this number is 1, your bolts are working as fast as they can. If it is less than 1, increase the parallelism. If it is greater than 1, reduce the parallelism.

## Troubleshoot common problems
Here are a few common troubleshooting scenarios.
* **Many tuples are timing out.** Look at each node in the topology to determine where the bottleneck is. The most common reason for this is that the bolts are not able to keep up with the spouts. This leads to tuples clogging the internal buffers while waiting to be processed. Consider increasing the timeout value or decreasing the max spout pending.

* **There is a high total process execution latency, but a low bolt process latency.** In this case, it is possible that the tuples are not being acknowledged fast enough. Check that there are a sufficient number of acknowledgers. Another possibility is that they are waiting in the queue for too long before the bolts start processing them. Decrease the max spout pending.

* **There is a high bolt execute latency.** This means that the execute() method of your bolt is taking too long. Optimize the code, or look at write sizes and flush behavior.

### Data Lake Storage Gen2 throttling
If you hit the limits of bandwidth provided by Data Lake Storage Gen2, you might see task failures. Check task logs for throttling errors. You can decrease the parallelism by increasing container size.    

To check if you are getting throttled, enable the debug logging on the client side:

1. In **Ambari** > **Storm** > **Config** > **Advanced storm-worker-log4j**, change **&lt;root level="info"&gt;** to **&lt;root level=”debug”&gt;**. Restart all the nodes/service for the configuration to take effect.
2. Monitor the Storm topology logs on worker nodes (under /var/log/storm/worker-artifacts/&lt;TopologyName&gt;/&lt;port&gt;/worker.log) for Data Lake Storage Gen2 throttling exceptions.

## Next steps
Additional performance tuning for Storm can be referenced in [this blog](https://blogs.msdn.microsoft.com/shanyu/2015/05/14/performance-tuning-for-hdinsight-storm-and-microsoft-azure-eventhubs/).

For an additional example to run, see [this one on GitHub](https://github.com/hdinsight/storm-performance-automation).
