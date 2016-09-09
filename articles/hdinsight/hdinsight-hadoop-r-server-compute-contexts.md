<properties
   pageTitle="Compute context options for R Server on HDInsight (preview) | Microsoft Azure"
   description="Learn about the different compute context options available to users with R Server on HDInsight (preview)"
   services="HDInsight"
   documentationCenter=""
   authors="jeffstokes72"
   manager="paulettem"
   editor="cgronlun"
/>

<tags
   ms.service="HDInsight"
   ms.devlang="R"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="data-services"
   ms.date="07/21/2016"
   ms.author="jeffstok"
/>

# Compute context options for R Server on HDInsight (preview)

Microsoft R Server on Azure HDInsight (preview) provides the latest capabilities for R-based analytics. It uses data that's stored in HDFS in a container in your [Azure Blob](../storage/storage-introduction.md "Azure Blob storage") storage account or the local Linux file system. Since R Server is built on open source R, the R-based applications you build can leverage any of the 8000+ open source R packages. They can also leverage the routines in [ScaleR](http://www.revolutionanalytics.com/revolution-r-enterprise-scaler "Revolution Analytics ScaleR"), Microsoft’s big data analytics package that's included with R Server.  

The edge node of a Premium cluster provides a convenient place to connect to the cluster and run your R scripts. With an edge node, you have the option of running ScaleR’s parallelized distributed functions across the cores of the edge node server. You also have the option to run them across the nodes of the cluster by using ScaleR’s Hadoop Map Reduce or Spark compute contexts.

## Compute contexts for an edge node

In general, an R script that's run in R Server on the edge node runs within the R interpreter on that node. The exception is those steps that call a ScaleR function. The ScaleR calls run in a compute environment that's determined by how you set the ScaleR compute context.  When you run your R script from an edge node, the possible values of the compute context are local sequential (‘local’), local parallel (‘localpar’), Map Reduce, and Spark.

The ‘local’ and ‘localpar’ options differ only in how rxExec calls are executed. They both execute other rx-function calls in a parallel manner across all available cores unless specified otherwise through use of the ScaleR numCoresToUse option, e.g. rxOptions(numCoresToUse=6). 
The following summarizes the various compute context options

| Compute context  | How to set                      | Execution context                                                                     |
|------------------|---------------------------------|---------------------------------------------------------------------------------------|
| Local sequential | rxSetComputeContext(‘local’)    | Parallelized execution across the cores of the edge node server, except for rxExec calls which are executed serially |
| Local parallel   | rxSetComputeContext(‘localpar’) | Parallelized execution across the cores of the edge node server                                 |
| Spark            | RxSpark()                       | Parallelized distributed execution via Spark across the nodes of the HDI cluster      |
| Map Reduce       | RxHadoopMR()                    | Parallelized distributed execution via Map Reduce across the nodes of the HDI cluster |


Assuming that you’d like parallelized execution for the purposes of performance, then there are three options. Which option you choose depends on the nature of your analytics work, and the size and location of your data.

## Guidelines for deciding on a compute context

Currently, there is no formula that tells you which compute context to use. There are, however, some guiding principles that can help you make the right choice, or at least help you narrow down your choices before you run a benchmark. These guiding principles include:

1.	The local Linux file system is faster than HDFS.
2.	Repeated analyses are faster if the data is local, and if it's in XDF.
3.	It's preferable to stream small amounts of data from a text data source; if the amount of data is larger, convert it to XDF prior to analysis.
4.	The overhead of copying or streaming the data to the edge node for analysis becomes unmanageable for very large amounts of data.
5.	Spark is faster than Map Reduce for analysis in Hadoop.

Given these principles, some general rules of thumb for selecting a compute context are:

### Local

- If the amount of data to analyze is small and does not require repeated analysis, then stream it directly into the analysis routine and use 'local' or 'localpar'.
- If the amount of data to analyze is small or medium-sized and requires repeated analysis, then copy it to the local file system, import it to XDF, and analyze it via 'local' or 'localpar'.

### Hadoop Spark

- If the amount of data to analyze is large, then import it to XDF in HDFS (unless storage is an issue), and analyze it via ‘Spark’.

### Hadoop Map Reduce

- Use only if you encounter an insurmountable problem with use of the Spark compute context since generally it will be slower.  

## Inline help on rxSetComputeContext

For more information and examples of ScaleR compute contexts, see the inline help in R on the rxSetComputeContext method, for example:

    > ?rxSetComputeContext

You can also refer to the “ScaleR Distributed Computing Guide” that's available from the [R Server MSDN](https://msdn.microsoft.com/library/mt674634.aspx "R Server on MSDN") library.


## Next steps

In this article, you learned how to create a new HDInsight cluster that includes R Server. You also learned the basics of using the R console from an SSH session. Now you can read the following articles to discover other ways of working with R Server on HDInsight:

- [Overview of R Server for Hadoop](hdinsight-hadoop-r-server-overview.md)
- [Get started with R server for Hadoop](hdinsight-hadoop-r-server-get-started.md)
- [Add RStudio Server to HDInsight Premium](hdinsight-hadoop-r-server-install-r-studio.md)
- [Azure Storage options for R Server on HDInsight Premium](hdinsight-hadoop-r-server-storage.md)
