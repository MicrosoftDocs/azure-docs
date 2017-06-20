---
title: Compute context options for R Server on HDInsight - Azure | Microsoft Docs
description: Learn about the different compute context options available to users with R Server on HDInsight 
services: HDInsight
documentationcenter: ''
author: bradsev
manager: jhubbard
editor: cgronlun

ms.assetid: 0deb0b1c-4094-459b-94fc-ec9b774c1f8a
ms.service: HDInsight
ms.custom: hdinsightactive
ms.devlang: R
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-services
ms.date: 06/15/2017
ms.author: bradsev

---
# Compute context options for R Server on HDInsight

Microsoft R Server on Azure HDInsight controls how calls are executed by setting the compute context. This article outlines the options that are available to specify whether and how execution is parallelized across cores of the edge node or HDInsight cluster.

The edge node of a cluster provides a convenient place to connect to the cluster and to run your R scripts. With an edge node, you have the option of running the parallelized distributed functions of ScaleR across the cores of the edge node server. You can also run them across the nodes of the cluster by using ScaleR’s Hadoop Map Reduce or Spark compute contexts.

## Microsoft R Server on Azure HDInsight
[Microsoft R Server on Azure HDInsight](hdinsight-hadoop-r-server-overview.md) provides the latest capabilities for R-based analytics. It can use data that is stored in an HDFS container in your [Azure Blob](../storage/storage-introduction.md "Azure Blob storage") storage account, a Data Lake store, or the local Linux file system. Since R Server is built on open source R, the R-based applications you build can apply any of the 8000+ open source R packages. They can also use the routines in [RevoScaleR](https://msdn.microsoft.com/microsoft-r/scaler/scaler), Microsoft’s big data analytics package that is included with R Server.  

## Compute contexts for an edge node
In general, an R script that's run in R Server on the edge node runs within the R interpreter on that node. The exceptions are those steps that call a ScaleR function. The ScaleR calls run in a compute environment that is determined by how you set the ScaleR compute context.  When you run your R script from an edge node, the possible values of the compute context are:

- local sequential (*‘local’*)
- local parallel (*‘localpar’*)
- Map Reduce
- Spark

The *‘local’* and *‘localpar’* options differ only in how **rxExec** calls are executed. They both execute other rx-function calls in a parallel manner across all available cores unless specified otherwise through use of the ScaleR **numCoresToUse** option, for example `rxOptions(numCoresToUse=6)`. Parallel execution options offer optimal performance.

The following table summarizes the various compute context options to set how calls are executed:

| Compute context  | How to set                      | Execution context                        |
| ---------------- | ------------------------------- | ---------------------------------------- |
| Local sequential | rxSetComputeContext(‘local’)    | Parallelized execution across the cores of the edge node server, except for rxExec calls, which are executed serially |
| Local parallel   | rxSetComputeContext(‘localpar’) | Parallelized execution across the cores of the edge node server |
| Spark            | RxSpark()                       | Parallelized distributed execution via Spark across the nodes of the HDI cluster |
| Map Reduce       | RxHadoopMR()                    | Parallelized distributed execution via Map Reduce across the nodes of the HDI cluster |

## Guidelines for deciding on a compute context

Which of the three options you choose that provide parallelized execution depends on the nature of your analytics work, the size, and the location of your data. There is no simple formula that tells you which compute context to use. There are, however, some guiding principles that can help you make the right choice, or, at least, help you narrow down your choices before you run a benchmark. These guiding principles include:

- The local Linux file system is faster than HDFS.
- Repeated analyses are faster if the data is local, and if it's in XDF.
- It's preferable to stream small amounts of data from a text data source. If the amount of data is larger, convert it to XDF before analysis.
- The overhead of copying or streaming the data to the edge node for analysis becomes unmanageable for very large amounts of data.
- Spark is faster than Map Reduce for analysis in Hadoop.

Given these principles, the following sections offer some general rules of thumb for selecting a compute context.

### Local
* If the amount of data to analyze is small and does not require repeated analysis, then stream it directly into the analysis routine using *'local'* or *'localpar'*.
* If the amount of data to analyze is small or medium-sized and requires repeated analysis, then copy it to the local file system, import it to XDF, and analyze it via *'local'* or *'localpar'*.

### Hadoop Spark
* If the amount of data to analyze is large, then import it to a Spark DataFrame using **RxHiveData** or **RxParquetData**, or to XDF in HDFS (unless storage is an issue), and analyze it using the Spark compute context.

### Hadoop Map Reduce
* Use the Map Reduce compute context only if you encounter an insurmountable problem with the Spark compute context since it is generally slower.  

## Inline help on rxSetComputeContext
For more information and examples of ScaleR compute contexts, see the inline help in R on the rxSetComputeContext method, for example:

    > ?rxSetComputeContext

You can also refer to the “[ScaleR Distributed Computing Guide](https://msdn.microsoft.com/microsoft-r/scaler-distributed-computing)” that's available from the [R Server MSDN](https://msdn.microsoft.com/library/mt674634.aspx "R Server on MSDN") library.

## Next steps
In this article, you learned about the options that are available to specify whether and how execution is parallelized across cores of the edge node or HDInsight cluster. To learn more about how to use R Server with HDInsight clusters, see the following topics:

* [Overview of R Server for Hadoop](hdinsight-hadoop-r-server-overview.md)
* [Get started with R Server for Hadoop](hdinsight-hadoop-r-server-get-started.md)
* [Add RStudio Server to HDInsight (if not added during cluster creation)](hdinsight-hadoop-r-server-install-r-studio.md)
* [Azure Storage options for R Server on HDInsight](hdinsight-hadoop-r-server-storage.md)

