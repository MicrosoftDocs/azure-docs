---
title: Compute context options for ML Services on HDInsight - Azure 
description: Learn about the different compute context options available to users with ML Services on HDInsight 
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive
ms.date: 01/02/2020
---

# Compute context options for ML Services on HDInsight

ML Services on Azure HDInsight controls how calls are executed by setting the compute context. This article outlines the options that are available to specify whether and how execution is parallelized across cores of the edge node or HDInsight cluster.

The edge node of a cluster provides a convenient place to connect to the cluster and to run your R scripts. With an edge node, you have the option of running the parallelized distributed functions of RevoScaleR across the cores of the edge node server. You can also run them across the nodes of the cluster by using RevoScaleR’s Hadoop Map Reduce or Apache Spark compute contexts.

## ML Services on Azure HDInsight

[ML Services on Azure HDInsight](r-server-overview.md) provides the latest capabilities for R-based analytics. It can use data that is stored in an Apache Hadoop HDFS container in your [Azure Blob](../../storage/common/storage-introduction.md "Azure Blob storage") storage account, a Data Lake Store, or the local Linux file system. Since ML Services is built on open-source R, the R-based applications you build can apply any of the 8000+ open-source R packages. They can also use the routines in [RevoScaleR](https://docs.microsoft.com/machine-learning-server/r-reference/revoscaler/revoscaler), Microsoft’s big data analytics package that is included with ML Services.  

## Compute contexts for an edge node

In general, an R script that's run in ML Services cluster on the edge node runs within the R interpreter on that node. The exceptions are those steps that call a RevoScaleR function. The RevoScaleR calls run in a compute environment that is determined by how you set the RevoScaleR compute context.  When you run your R script from an edge node, the possible values of the compute context are:

- local sequential (*local*)
- local parallel (*localpar*)
- Map Reduce
- Spark

The *local* and *localpar* options differ only in how **rxExec** calls are executed. They both execute other rx-function calls in a parallel manner across all available cores unless specified otherwise through use of the RevoScaleR **numCoresToUse** option, for example `rxOptions(numCoresToUse=6)`. Parallel execution options offer optimal performance.

The following table summarizes the various compute context options to set how calls are executed:

| Compute context  | How to set                      | Execution context                        |
| ---------------- | ------------------------------- | ---------------------------------------- |
| Local sequential | rxSetComputeContext('local')    | Parallelized execution across the cores of the edge node server, except for rxExec calls, which are executed serially |
| Local parallel   | rxSetComputeContext('localpar') | Parallelized execution across the cores of the edge node server |
| Spark            | RxSpark()                       | Parallelized distributed execution via Spark across the nodes of the HDI cluster |
| Map Reduce       | RxHadoopMR()                    | Parallelized distributed execution via Map Reduce across the nodes of the HDI cluster |

## Guidelines for deciding on a compute context

Which of the three options you choose that provide parallelized execution depends on the nature of your analytics work, the size, and the location of your data. There's no simple formula that tells you, which compute context to use. There are, however, some guiding principles that can help you make the right choice, or, at least, help you narrow down your choices before you run a benchmark. These guiding principles include:

- The local Linux file system is faster than HDFS.
- Repeated analyses are faster if the data is local, and if it's in XDF.
- It's preferable to stream small amounts of data from a text data source. If the amount of data is larger, convert it to XDF before analysis.
- The overhead of copying or streaming the data to the edge node for analysis becomes unmanageable for very large amounts of data.
- ApacheSpark is faster than Map Reduce for analysis in Hadoop.

Given these principles, the following sections offer some general rules of thumb for selecting a compute context.

### Local

- If the amount of data to analyze is small and doesn't require repeated analysis, then stream it directly into the analysis routine using *local* or *localpar*.
- If the amount of data to analyze is small or medium-sized and requires repeated analysis, then copy it to the local file system, import it to XDF, and analyze it via *local* or *localpar*.

### Apache Spark

- If the amount of data to analyze is large, then import it to a Spark DataFrame using **RxHiveData** or **RxParquetData**, or to XDF in HDFS (unless storage is an issue), and analyze it using the Spark compute context.

### Apache Hadoop Map Reduce

- Use the Map Reduce compute context only if you come across an insurmountable problem with the Spark compute context since it's generally slower.  

## Inline help on rxSetComputeContext
For more information and examples of RevoScaleR compute contexts, see the inline help in R on the rxSetComputeContext method, for example:

    > ?rxSetComputeContext

You can also refer to the [Distributed computing overview](https://docs.microsoft.com/machine-learning-server/r/how-to-revoscaler-distributed-computing) in [Machine Learning Server documentation](https://docs.microsoft.com/machine-learning-server/).

## Next steps

In this article, you learned about the options that are available to specify whether and how execution is parallelized across cores of the edge node or HDInsight cluster. To learn more about how to use ML Services with HDInsight clusters, see the following topics:

- [Overview of ML Services for Apache Hadoop](r-server-overview.md)
- [Azure Storage options for ML Services on HDInsight](r-server-storage.md)
