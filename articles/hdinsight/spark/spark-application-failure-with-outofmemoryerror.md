---
title: Why did my Spark application fail with OutOfMemoryError? | Microsoft Docs
description: Use the Spark troubleshooting guide for solving common Spark problems on Azure HDInsight platform.
keywords: Azure HDInsight, Spark, troubleshooting guide, common problems, application failure, OutOfMemoryError
services: Azure HDInsight
documentationcenter: na
author: arijitt
manager: ''
editor: ''

ms.assetid: 014D8727-E580-40F2-BFF1-2620C13611DE
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/30/2017
ms.author: arijitt

---

### Why did my Spark application fail with OutOfMemoryError?

#### Error:

Spark application failed with OutOfMemoryError exception

#### Detailed Description:
Spark application fails with the following types of uncaught exceptions.  

~~~~
ERROR Executor: Exception in task 7.0 in stage 6.0 (TID 439) 

java.lang.OutOfMemoryError 
    at java.io.ByteArrayOutputStream.hugeCapacity(Unknown Source) 
    at java.io.ByteArrayOutputStream.grow(Unknown Source) 
    at java.io.ByteArrayOutputStream.ensureCapacity(Unknown Source) 
    at java.io.ByteArrayOutputStream.write(Unknown Source) 
    at java.io.ObjectOutputStream$BlockDataOutputStream.drain(Unknown Source) 
    at java.io.ObjectOutputStream$BlockDataOutputStream.setBlockDataMode(Unknown Source) 
    at java.io.ObjectOutputStream.writeObject0(Unknown Source) 
    at java.io.ObjectOutputStream.writeObject(Unknown Source) 
    at org.apache.spark.serializer.JavaSerializationStream.writeObject(JavaSerializer.scala:44) 
    at org.apache.spark.serializer.JavaSerializerInstance.serialize(JavaSerializer.scala:101) 
    at org.apache.spark.executor.Executor$TaskRunner.run(Executor.scala:239) 
    at java.util.concurrent.ThreadPoolExecutor.runWorker(Unknown Source) 
    at java.util.concurrent.ThreadPoolExecutor$Worker.run(Unknown Source) 
    at java.lang.Thread.run(Unknown Source) 
~~~~

~~~~
ERROR SparkUncaughtExceptionHandler: Uncaught exception in thread Thread[Executor task launch worker-0,5,main] 

java.lang.OutOfMemoryError 
    at java.io.ByteArrayOutputStream.hugeCapacity(Unknown Source) 
    at java.io.ByteArrayOutputStream.grow(Unknown Source) 
    at java.io.ByteArrayOutputStream.ensureCapacity(Unknown Source) 
    at java.io.ByteArrayOutputStream.write(Unknown Source) 
    at java.io.ObjectOutputStream$BlockDataOutputStream.drain(Unknown Source) 
    at java.io.ObjectOutputStream$BlockDataOutputStream.setBlockDataMode(Unknown Source) 
    at java.io.ObjectOutputStream.writeObject0(Unknown Source) 
    at java.io.ObjectOutputStream.writeObject(Unknown Source) 
    at org.apache.spark.serializer.JavaSerializationStream.writeObject(JavaSerializer.scala:44) 
    at org.apache.spark.serializer.JavaSerializerInstance.serialize(JavaSerializer.scala:101) 
    at org.apache.spark.executor.Executor$TaskRunner.run(Executor.scala:239) 
    at java.util.concurrent.ThreadPoolExecutor.runWorker(Unknown Source) 
    at java.util.concurrent.ThreadPoolExecutor$Worker.run(Unknown Source) 
    at java.lang.Thread.run(Unknown Source) 
~~~~

#### Probable Cause:

The most likely cause of this exception is not enough heap memory allocated to the Java Virtual Machine (JVM) that are launched as executors or driver as part of the Spark application. 

#### Resolution Steps:

1. Determine the maximum size of the data a Spark application will handle. A guess can be made based on the maximum of the size of input data, the intermediate data produced by transforming the input data and the output data produced further transforming the intermediate data. This can be an iterative process also if formal initial guess is not possible. 

2. Make sure that the HDInsight cluster to be used has enough resources in terms of memory and also cores to accommodate the Spark application. This can be determined by viewing the Cluster Metrics section of the YARN UI of the cluster for the values of Memory Used vs. Memory Total and VCores Used vs. VCores Total.

![Alt text](../media/spark/spark-application-failure-with-outofmemoryerror/yarn-core-memory-view.png)

3. Set the following Spark configurations to appropriate values that do not exceed 90% of the available memory and cores as viewed by YARN yet well within the memory requirement of the Spark application: 

~~~~
spark.executor.instances (Example: 8 for 8 executor count) 
spark.executor.memory (Example: 4g for 4 GB) 
spark.yarn.executor.memoryOverhead (Example: 384m for 384 MB) 
spark.executor.cores (Example: 2 for 2 cores per executor) 
spark.driver.memory (Example: 8g for 8GB) 
spark.driver.cores (Example: 4 for 4 cores)   
spark.yarn.driver.memoryOverhead (Example: 384m for 384MB) 
~~~~

Total memory used by all executors = 
~~~~
spark.executor.instances * (spark.executor.memory + spark.yarn.executor.memoryOverhead) 
~~~~
Total memory used by driver = 
~~~~
spark.driver.memory + spark.yarn.driver.memoryOverhead
~~~~

#### Further Reading:

1. [Spark memory management overview](http://spark.apache.org/docs/latest/tuning.html#memory-management-overview)
2. [Debugging Spark application on HDInsight clusters](https://blogs.msdn.microsoft.com/azuredatalake/2016/12/19/spark-debugging-101/)