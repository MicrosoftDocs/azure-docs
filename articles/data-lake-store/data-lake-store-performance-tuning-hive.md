---
title: Performance tuning - Hive on Azure Data Lake Storage Gen1
description: Performance tuning guidelines for Hive on HdInsight and Azure Data Lake Storage Gen1.

author: stewu
ms.service: data-lake-store
ms.topic: how-to
ms.date: 12/19/2016
ms.author: stewu

---
# Performance tuning guidance for Hive on HDInsight and Azure Data Lake Storage Gen1

The default settings have been set to provide good performance across many different use cases.  For I/O intensive queries, Hive can be tuned to get better performance with Azure Data Lake Storage Gen1.  

## Prerequisites

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
* **A Data Lake Storage Gen1 account**. For instructions on how to create one, see [Get started with Azure Data Lake Storage Gen1](data-lake-store-get-started-portal.md)
* **Azure HDInsight cluster** with access to a Data Lake Storage Gen1 account. See [Create an HDInsight cluster with Data Lake Storage Gen1](data-lake-store-hdinsight-hadoop-use-portal.md). Make sure you enable Remote Desktop for the cluster.
* **Running Hive on HDInsight**.  To learn about running Hive jobs on HDInsight, see [Use Hive on HDInsight](https://docs.microsoft.com/azure/hdinsight/hdinsight-use-hive)
* **Performance tuning guidelines on Data Lake Storage Gen1**.  For general performance concepts, see [Data Lake Storage Gen1 Performance Tuning Guidance](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-performance-tuning-guidance)

## Parameters

Here are the most important settings to tune for improved Data Lake Storage Gen1 performance:

* **hive.tez.container.size** – the amount of memory used by each tasks

* **tez.grouping.min-size** – minimum size of each mapper

* **tez.grouping.max-size** – maximum size of each mapper

* **hive.exec.reducer.bytes.per.reducer** – size of each reducer

**hive.tez.container.size** - The container size determines how much memory is available for each task.  This is the main input for controlling the concurrency in Hive.  

**tez.grouping.min-size** – This parameter allows you to set the minimum size of each mapper.  If the number of mappers that Tez chooses is smaller than the value of this parameter, then Tez will use the value set here.

**tez.grouping.max-size** – The parameter allows you to set the maximum size of each mapper.  If the number of mappers that Tez chooses is larger than the value of this parameter, then Tez will use the value set here.

**hive.exec.reducer.bytes.per.reducer** – This parameter sets the size of each reducer.  By default, each reducer is 256MB.  

## Guidance

**Set hive.exec.reducer.bytes.per.reducer** – The default value works well when the data is uncompressed.  For data that is compressed, you should reduce the size of the reducer.  

**Set hive.tez.container.size** – In each node, memory is specified by yarn.nodemanager.resource.memory-mb and should be correctly set on HDI cluster by default.  For additional information on setting the appropriate memory in YARN, see this [post](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-hive-out-of-memory-error-oom).

I/O intensive workloads can benefit from more parallelism by decreasing the Tez container size. This gives the user more containers which increases concurrency.  However, some Hive queries require a significant amount of memory (e.g. MapJoin).  If the task does not have enough memory, you will get an out of memory exception during runtime.  If you receive out of memory exceptions, then you should increase the memory.   

The concurrent number of tasks running or parallelism will be bounded by the total YARN memory.  The number of YARN containers will dictate how many concurrent tasks can run.  To find the YARN memory per node, you can go to Ambari.  Navigate to YARN and view the Configs tab.  The YARN memory is displayed in this window.  

		Total YARN memory = nodes * YARN memory per node
		# of YARN containers = Total YARN memory / Tez container size
The key to improving performance using Data Lake Storage Gen1 is to increase the concurrency as much as possible.  Tez automatically calculates the number of tasks that should be created so you do not need to set it.   

## Example Calculation

Let's say you have an 8 node D14 cluster.  

	Total YARN memory = nodes * YARN memory per node
	Total YARN memory = 8 nodes * 96GB = 768GB
	# of YARN containers = 768GB / 3072MB = 256

## Limitations

**Data Lake Storage Gen1 throttling** 

If you hit the limits of bandwidth provided by Data Lake Storage Gen1, you would start to see task failures. This could be identified by observing throttling errors in task logs.  You can decrease the parallelism by increasing Tez container size.  If you need more concurrency for your job, please contact us.

To check if you are getting throttled, you need to enable the debug logging on the client side. Here's how you can do that:

1. Put the following property in the log4j properties in Hive config. This can be done from Ambari view: log4j.logger.com.microsoft.azure.datalake.store=DEBUG
Restart all the nodes/service for the config to take effect.

2. If you are getting throttled, you'll see the HTTP 429 error code in the hive log file. The hive log file is in /tmp/&lt;user&gt;/hive.log

## Further information on Hive tuning

Here are a few blogs that will help tune your Hive queries:
* [Optimize Hive queries for Hadoop in HDInsight](https://azure.microsoft.com/documentation/articles/hdinsight-hadoop-optimize-hive-query/)
* [Troubleshooting Hive query performance](https://blogs.msdn.microsoft.com/bigdatasupport/2015/08/13/troubleshooting-hive-query-performance-in-hdinsight-hadoop-cluster/)
* [Ignite talk on optimize Hive on HDInsight](https://channel9.msdn.com/events/Machine-Learning-and-Data-Sciences-Conference/Data-Science-Summit-2016/MSDSS25)
