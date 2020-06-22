---
title: 'Tune performance: MapReduce, HDInsight & Azure Data Lake Storage Gen2 | Microsoft Docs'
description: Azure Data Lake Storage Gen2 MapReduce Performance Tuning Guidelines
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: how-to
ms.date: 11/18/2019
ms.author: normesta
ms.reviewer: stewu
---

# Tune performance: MapReduce, HDInsight & Azure Data Lake Storage Gen2

Understand the factors that you should consider when you tune the performance of Map Reduce jobs. This article covers a range of performance tuning guidelines.

## Prerequisites

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
* **An Azure Data Lake Storage Gen2 account**. For instructions on how to create one, see [Quickstart: Create an Azure Data Lake Storage Gen2 storage account](data-lake-storage-quickstart-create-account.md).
* **Azure HDInsight cluster** with access to a Data Lake Storage Gen2 account. See [Use Azure Data Lake Storage Gen2 with Azure HDInsight clusters](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-use-data-lake-storage-gen2)
* **Using MapReduce on HDInsight**.  For more information, see [Use MapReduce in Hadoop on HDInsight](https://docs.microsoft.com/azure/hdinsight/hdinsight-use-mapreduce)
* **Performance tuning guidelines on Data Lake Storage Gen2**.  For general performance concepts, see [Data Lake Storage Gen2 Performance Tuning Guidance](data-lake-storage-performance-tuning-guidance.md)

## Parameters

When running MapReduce jobs, here are the parameters that you can configure to increase performance on Data Lake Storage Gen2:

* **Mapreduce.map.memory.mb** – The amount of memory to allocate to each mapper
* **Mapreduce.job.maps** – The number of map tasks per job
* **Mapreduce.reduce.memory.mb** – The amount of memory to allocate to each reducer
* **Mapreduce.job.reduces** – The number of reduce tasks per job

**Mapreduce.map.memory / Mapreduce.reduce.memory**
This number should be adjusted based on how much memory is needed for the map and/or reduce task.  The default values of mapreduce.map.memory and mapreduce.reduce.memory can be viewed in Ambari via the Yarn configuration.  In Ambari, navigate to YARN and view the Configs tab.  The YARN memory will be displayed.  

**Mapreduce.job.maps / Mapreduce.job.reduces**
This will determine the maximum number of mappers or reducers to be created.  The number of splits will determine how many mappers will be created for the MapReduce job.  Therefore, you may get less mappers than you requested if there are less splits than the number of mappers requested.       

## Guidance

> [!NOTE]
> The guidance in this document assumes that your application is the only application running on your cluster.

**Step 1: Determine number of jobs running**

By default, MapReduce will use the entire cluster for your job.  You can use less of the cluster by using less mappers than there are available containers.        

**Step 2: Set mapreduce.map.memory/mapreduce.reduce.memory**

The size of the memory for map and reduce tasks will be dependent on your specific job.  You can reduce the memory size if you want to increase concurrency.  The number of concurrently running tasks depends on the number of containers.  By decreasing the amount of memory per mapper or reducer, more containers can be created, which enable more mappers or reducers to run concurrently.  Decreasing the amount of memory too much may cause some processes to run out of memory.  If you get a heap error when running your job, you should increase the memory per mapper or reducer.  You should consider that adding more containers will add extra overhead for each additional container, which can potentially degrade performance.  Another alternative is to get more memory by using a cluster that has higher amounts of memory or increasing the number of nodes in your cluster.  More memory will enable more containers to be used, which means more concurrency.  

**Step 3: Determine Total YARN memory**

To tune mapreduce.job.maps/mapreduce.job.reduces, you should consider the amount of total YARN memory available for use.  This information is available in Ambari.  Navigate to YARN and view the Configs tab.  The YARN memory is displayed in this window.  You should multiply the YARN memory with the number of nodes in your cluster to get the total YARN memory.

	Total YARN memory = nodes * YARN memory per node

If you are using an empty cluster, then memory can be the total YARN memory for your cluster.  If other applications are using memory, then you can choose to only use a portion of your cluster’s memory by reducing the number of mappers or reducers to the number of containers you want to use.  

**Step 4: Calculate number of YARN containers**

YARN containers dictate the amount of concurrency available for the job.  Take total YARN memory and divide that by mapreduce.map.memory.  

	# of YARN containers = total YARN memory / mapreduce.map.memory

**Step 5: Set mapreduce.job.maps/mapreduce.job.reduces**

Set mapreduce.job.maps/mapreduce.job.reduces to at least the number of available containers.  You can experiment further by increasing the number of mappers and reducers to see if you get better performance.  Keep in mind that more mappers will have additional overhead so having too many mappers may degrade performance.  

CPU scheduling and CPU isolation are turned off by default so the number of YARN containers is constrained by memory.

## Example calculation

Let’s assume that we have a cluster composed of 8 D14 nodes, and we want to run an I/O intensive job.  Here are the calculations you should do:

**Step 1: Determine number of jobs running**

In this example, let's assume that our job is the only job that is running.  

**Step 2: Set mapreduce.map.memory/mapreduce.reduce.memory**

In this example, we are running an I/O intensive job and decide that 3GB of memory for map tasks will be sufficient.

	mapreduce.map.memory = 3GB

**Step 3: Determine Total YARN memory**

	Total memory from the cluster is 8 nodes * 96GB of YARN memory for a D14 = 768GB
**Step 4: Calculate # of YARN containers**

	# of YARN containers = 768GB of available memory / 3 GB of memory =   256

**Step 5: Set mapreduce.job.maps/mapreduce.job.reduces**

	mapreduce.map.jobs = 256

## Examples to run

To demonstrate how MapReduce runs on Data Lake Storage Gen2, below is some sample code that was run on a cluster with the following settings:

* 16 node D14v2
* Hadoop cluster running HDI 3.6

For a starting point, here are some example commands to run MapReduce Teragen, Terasort, and Teravalidate.  You can adjust these commands based on your resources.

**Teragen**

	yarn jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-mapreduce-examples.jar teragen -Dmapreduce.job.maps=2048 -Dmapreduce.map.memory.mb=3072 10000000000 abfs://example/data/1TB-sort-input

**Terasort**

	yarn jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-mapreduce-examples.jar terasort -Dmapreduce.job.maps=2048 -Dmapreduce.map.memory.mb=3072 -Dmapreduce.job.reduces=512 -Dmapreduce.reduce.memory.mb=3072 abfs://example/data/1TB-sort-input abfs://example/data/1TB-sort-output

**Teravalidate**

	yarn jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-mapreduce-examples.jar teravalidate -Dmapreduce.job.maps=512 -Dmapreduce.map.memory.mb=3072 abfs://example/data/1TB-sort-output abfs://example/data/1TB-sort-validate
