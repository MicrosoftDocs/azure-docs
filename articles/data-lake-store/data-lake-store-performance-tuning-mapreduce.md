---
title: Data Lake Store MapReduce Performance Tuning Guidelines | Microsoft Docs
description: Data Lake Store MapReduce Performance Tuning Guidelines
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
# Performance tuning guidance for MapReduce on HDInsight and Azure Data Lake Store


## Prerequisites

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
* **An Azure Data Lake Store account**. For instructions on how to create one, see [Get started with Azure Data Lake Store](data-lake-store-get-started-portal.md)
* **Azure HDInsight cluster** with access to a Data Lake Store account. See [Create an HDInsight cluster with Data Lake Store](data-lake-store-hdinsight-hadoop-use-portal.md). Make sure you enable Remote Desktop for the cluster.


## Parameters

When running MapReduce jobs, here are the most important parameters that you can configure to increase performance on ADLS:

* **Mapreduce.map.memory** – The amount of memory to allocate to each mapper
* **Mapreduce.job.maps** – The number of map tasks per job
* **Mapreduce.reduce.memory** – The amount of memory to allocate to each reducer
* **Mapreduce.job.reduces** – The number of reduce tasks per job

**Mapreduce.map.memory / Mapreduce.reduce.memory**
This number should be adjusted based on how much memory is needed for the map and/or reduce task.  The default values of mapreduce.map.memory and mapreduce.reduce.memory can be viewed in Ambari via the Yarn configuration.  

**Mapreduce.job.maps / Mapreduce.job.reduces**
This will determine the maximum number of mappers or reducers to be created.  The number of mappers will determine how many splits will be created for the MapReduce job.     

## Guidance

**Step 1: Set mapreduce.map.memory/mapreduce.reduce.memory** –  The size of the memory for map and reduce tasks will be dependent on your specific job.  You can reduce the memory size if you want to increase concurrency.  By decreasing the amount of memory per mapper or reducer, you are enabling more mappers or reducers to run concurrently.  If you get a heap error when running your job, you should increase the memory per mapper or reducer.  More guidance on how to set the correct memory parameter can be viewed on this page.

**Step 2: Determine Total YARN memory** - To tune mapreduce.job.maps/mapreduce.job.reduces, you should consider the amount of total YARN memory available for use.  This information is available in Ambari.  Navigate to YARN and view the Configs tab.  The YARN memory is displayed in this window.  You should multiply the YARN memory with the number of nodes in your cluster to get the total YARN memory.

	Total YARN memory = nodes * YARN memory per node
If you are using an empty cluster, then memory can be the total YARN memory for your cluster.  If other applications are using memory, then you can choose to only use a portion of your cluster’s memory.  

**Step 3: Calculate parallelism** – mapreduce.job.maps is constrained either by memory or by CPU.  You should take total YARN memory and divide that by mapreduce.map.memory.  

	Memory constraint = total YARN memory / mapreduce.map.memory
lThe CPU constraint is calculated as the total physical cores multiplied by the number of mappers per core.  You should set the number of mappers per cores to 2.

	CPU constraint = total virtual cores * mappers per core
The concurrency should be the minimum of these two numbers.

	concurrency = Min (total cores * mappers per core, available YARN memory / mapreduce.map.memory)   
A good starting point would be to set mapreduce.job.maps to concurrency and you can experiment with more or less mappers or reduces based on your data size to tune you performance.  

## Example Calculation

Let’s say you currently have a cluster composed of 8 D14 nodes and you want to run an I/O intensive job.  Here are the calculations you should do:

**Step 1: Set mapreduce.map.memory/mapreduce.reduce.memory** – for our example, you are running an I/O intensive job and decide that 3GB of memory for map tasks will be sufficient.

	mapreduce.map.memory = 3GB
**Step 2: Determine Total YARN memory** 

	total memory from the cluster is 8 nodes * 96GB of YARN memory for a D14 = 768GB
**Step 3: Calculate concurrency**

	memory constraint = 768GB of available memory / 3 GB of memory =   256
	cores = nodes in cluster * # of cores in node = 8 nodes * 16 cores  = 128  
	CPU constraint = 128 cores * 2 cores per mapper = 256
	concurrency = Min (128 cores * 2 mappers per core, 800GB of available YARN memory / 3GB of mapreduce.map.memory) = Min (256, 256) = 256

The concurrency is 256 tasks in parallel so you can consider starting with 256 map/reduce tasks.  You can experiment further by increasing or decreasing the number of mappers to see if you get better performance.   

## Limitations

**Using more mappers/reducers**

Using more mappers or reducers does not necessarily mean you will see better performance.  We encourage you to tune this number based on your scenario.  

**ADLS throttling** 

If you hit the limits of bandwidth provided by ADLS, you would start to see task failures. This could be identified by observing throttling errors in task logs.  You can decrease the parallelism by increasing the container size.  If you need more bandwidth for your job, please contact us.   

To check if you are getting throttled, you need to enable the debug logging on the client side. Here’s how you can do that:

1. Put the following property in the log4j properties in Ambari > YARN > Config > Advanced yarn-log4j.
log4j.logger.com.microsoft.azure.datalake.store=DEBUG
Restart all the nodes/service for the config to take effect.

2. If you are getting throttled, you’ll see the HTTP 429 error code in the YARN log file. The YARN log file is in /tmp/&lt;user&gt;/yarn.log

## Examples to Run

To demonstrate how MapReduce runs on Azure Data Lake Store, below is some sample code that was run on a cluster with the following settings:

* 16 node D14v2
* Hadoop cluster running HDI 3.5

For a starting point, here are some example commands to run MapReduce Teragen, Terasort, and Teravalidate.  You can adjust these commands based on your resources.

**Teragen**

	yarn jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-mapreduce-examples.jar teragen -Dmapred.map.tasks=2048 -Dmapred.map.memory.mb=3072 10000000000 adl://example/data/1TB-sort-input

**Terasort**

	yarn jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-mapreduce-examples.jar terasort -Dmapred.map.tasks=2048 -Dmapred.map.memory.mb=3072 -Dmapred.reduce.tasks=512 -Dmapred.reduce.memory.mb=3072 /example/data/1TB-sort-input /example/data/1TB-sort-output

**Teravalidate**

	yarn jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-mapreduce-examples.jar teravalidate -Dmapred.map.tasks=512 -Dmapred.map.memory.mb=3072 /example/data/1TB-sort-output /example/data/1TB-sort-validate
