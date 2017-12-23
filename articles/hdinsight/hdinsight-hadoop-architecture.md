---
title: Hadoop architecture - Azure HDInsight | Microsoft Docs
description: Describes Hadoop storage and processing on HDInsight clusters.
services: hdinsight
documentationcenter: ''
author: ashishthaps
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.assetid: 
ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 12/20/2017
ms.author: ashishth

---
# Hadoop architecture in HDInsight

Hadoop includes two core components, the High Density File System (HDFS) that provides storage, and Yet Another Resource Negotiator (YARN) that provides processing. With storage and processing capabilities a cluster becomes capable of running MapReduce programs to perform the desired data processing.

> [!NOTE]
> As described in [HDInsight architecture](hdinsight-architecture.md), an HDFS is not typically deployed within the HDInsight cluster to provide storage. Instead, an HDFS-compatible interface layer is used by Hadoop  components. The actual storage capability is provided by either Azure Storage or Azure Data Lake Store. For Hadoop, MapReduce jobs executing on the HDInsight cluster run as if an HDFS were present and so require no changes to support their storage needs. In Hadoop on HDInsight, storage is outsourced, but YARN processing  remains a core component. 

This article introduces YARN and how it coordinates the execution of applications on HDInsight, and then shows how Spark utilizes YARN to run Spark jobs.

## YARN basics 

YARN  governs and orchestrates data processing in Hadoop. YARN has two core services that run as processes on nodes in the cluster: 

* ResourceManager 
* NodeManager

The ResourceManager grants cluster compute resources to applications like MapReduce jobs. The ResourceManager grants these resources as containers, where each container consists of an allocation of CPU cores and RAM memory. If you combined all the resources available in a cluster and then distributed them in blocks of a given number of cores and memory, each block of resources is a container. Each node in the cluster has a capacity for a certain number of containers, and therefore the cluster has a fixed limit on the number of containers available. The allotment of resources in a container is configurable. 

When a MapReduce application runs on a cluster, the ResourceManager provides the application the containers in which to execute. The ResourceManager tracks the status of running applications, available cluster capacity, and tracks applications as they complete and release their resources. 

The ResourceManager also runs a web server process that provides a web user interface you can use to monitor the status of applications. 

When a user submits a MapReduce application to run on the cluster, the application is submitted to the ResourceManager. In turn, the ResourceManager allocates a container on  available NodeManager nodes. The NodeManager nodes are where the application actually executes. The first container allocated  runs a special application called the ApplicationMaster. This ApplicationMaster is responsible for acquiring resources, in the form of subsequent containers, needed to run the submitted application. The ApplicationMaster examines the stages of the application (the map stage and reduce stage) and factors in how much data needs to be processed. The ApplicationMaster then requests (*negotiates*) the resources from the ResourceManager on behalf of the application. The ResourceManager in turn grants resources from the NodeManagers in the cluster to the ApplicationMaster for it to use in executing the application. 

The NodeManagers run the tasks that make up the application, then report their progress and status back to the ApplicationMaster. The ApplicationMaster in turn reports the status of the application back to the ResourceManager. The ResourceManager returns any results to the client.

## YARN on HDInsight

All HDInsight cluster types deploy YARN. The ResourceManager is deployed for high availability with a primary and secondary instance, which run on the first and second head nodes within the cluster respectively. Only the one instance of the ResourceManager is active at a time. The NodeManager instances run across the available worker nodes in the cluster.

![YARN on HDInsight](./media/hdinsight-hadoop-architecture/yarn-on-hdinsight.png)

## Architecture of Spark on HDInsight

Spark in HDInsight relies on YARN for resource management. The following sections explain how Spark jobs execute within HDInsight using YARN.

![Spark Architecture](./media/hdinsight-hadoop-architecture/spark-unified.png)

To  create an HDInsight cluster on Azure, you select a cluster of type `Spark`, specifying  the  Spark version and  the numbers and configuration of head and worker nodes.  

![Spark on HDInsight](./media/hdinsight-hadoop-architecture/hdinsight-spark-cluster-type-setup.png)

To understand the lifecycle of a Spark job, consider the Spark objects in your cluster.  As shown in the following diagram, Spark uses a driver process, which runs the SparkContext along with the YARN Resource Manager (cluster manager). The cluster manager schedules and runs the Spark jobs submitted to that cluster. When a Spark job is submitted, the YARN ResourceManager instantiates an ApplicationMaster to be the Spark master process. The Spark driver provides its resource requirements to the ApplicationMaster. The ApplicationMaster then requests YARN containers from the ResourceManager to host the Spark executors. The ApplicationMaster is then  responsible for the YARN containers running the Spark executors for duration of the application. Beyond that,  the Spark driver  is responsible for coordinating the actual Spark application processing.

The cluster executes the Spark job steps on the worker nodes.  Each worker node has its own Executor, cache, and list of job tasks.  

![Spark Objects](./media/hdinsight-hadoop-architecture/spark-arch.png)

### Understanding Spark Job Steps

Spark uses an abstraction called a  *resilient distributed dataset* (RDD) to hold the data for a Spark job.  Higher-level objects, such as DataFrames and DataSets,  operate on top of RDDs and provide more functionality for developers, such as strongly-typed objects.

After data is loaded into RDDs on the worker nodes,  the *directed acyclic graph* (DAG) scheduler coordinates the set of tasks that the Spark job requires. The DAG scheduler sends that set to the Task Scheduler on the Cluster Manager.  Tasks are then distributed to Executors (on various nodes) and run on resources on those nodes.  

![Spark Jobs](./media/hdinsight-hadoop-architecture/rdd-stages.png)

You can monitor the progress of Spark Jobs using several monitoring UIs that are available for HDInsight.  For example, use the YARN UI to locate the job status and tracking URL for the Spark jobs of interest.  

![YARN UI](./media/hdinsight-hadoop-architecture/tracking-url.png)

Selecting a  `Tracking URL` opens the Spark UI.  There are a number of views here that allow you to track and monitor the status of your jobs at a granular level.  This UI opens to the `Jobs` tab.  As shown in the following diagram, here you can see a list of jobs run with Job Ids, Descriptions, Time Submitted, Job Duration, Job Steps, and Job Tasks.  You can also select a link in the Description column to open a new UI with detailed information about that job step execution overhead.

![Spark Job UI](./media/hdinsight-hadoop-architecture/spark-job-ui.png)

The Spark Job Stages UI provides detailed information about the process and overhead associated with each task in a Spark job.  The following diagram shows an expanded view of the Spark Stages UI, which includes the `DAG Visualization`, `Event Timeline`, `Summary Metrics`, and `Aggregated Metrics by Executor` for a single job stage of a Spark job.  These detailed views are  useful in determining whether and exactly where Spark job performance bottlenecks are occurring on your HDInsight Spark cluster.

![Spark Job Details UI](./media/hdinsight-hadoop-architecture/job-details.png)

After Spark jobs complete, then job execution information is available in the Spark History Server view.  This view is available from a link in the Azure portal for HDInsight.

## See also

* [HDInsight Architecture](hdinsight-architecture.md)
* [Use MapReduce in Hadoop on HDInsight](hadoop/hdinsight-use-mapreduce.md)
