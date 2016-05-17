<properties
   pageTitle="Compute context options for R Server on HDInsight (preview) | Azure"
   description="Learn the different compute context options available to users with R Server on HDInsight (preview)"
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
   ms.date="03/28/2016"
   ms.author="jeffstok"
/>

#Compute context options for R Server on HDInsight (preview)

R Server on HDInsight (preview) provides the latest capabilities for R-based analytics using data stored in HDFS in a container on your [Azure Blob](../storage/storage-introduction.md "Azure Blob storage") storage account or the local Linux file system.  Since R Server is built on open source R, the R-based applications you build can leverage any of the 8000+ open source R packages, as well as the routines in [ScaleR](http://www.revolutionanalytics.com/revolution-r-enterprise-scaler "Revolution Analytics ScaleR"), Microsoft’s big data analytics package included with R Server.  The edge node of Premium clusters provides a convenient landing zone for connection to the cluster and running of your R scripts. With an edge node, you have the option of running ScaleR’s parallelized distributed functions across the cores of the edge node server, or across the nodes of the cluster through use of ScaleR’s Hadoop Map Reduce or Spark compute contexts.

## Compute Contexts for an Edge Node

In general, an R script executed in R Server on the edge node will run within the R interpreter on that node except for those steps that call a ScaleR function. The ScaleR calls will be executed in a compute environment determined by how you set the ScaleR compute context.  Possible values of the compute context when running your R script from an edge node are local sequential (‘local’), local parallel (‘localpar’), Map Reduce, and Spark, where: 

| Compute Context  | How to Set                      | Execution Context                                                                     |
|------------------|---------------------------------|---------------------------------------------------------------------------------------|
| Local Sequential | rxSetComputeContext(‘local’)    | Sequential (non-parallelized) execution on the edge node server                       |
| Local Parallel   | rxSetComputeContext(‘localpar’) | Parallelized across the cores of the edge node server                                 |
| Spark            | RxSpark()                       | Parallelized distributed execution via Spark across the nodes of the HDI cluster      |
| Map Reduce       | RxHadoopMR()                    | Parallelized distributed execution via Map Reduce across the nodes of the HDI cluster |


Assuming that you’d like parallelized execution for the purposes of performance then there are three options. Which you choose will depend on the nature of your analytics work, and the size and location of your data. 

## Deciding on a Compute Context

At present there is no formula to fill in that will tell you which compute context to use, rather there are some guiding principles that will point you to the right choice, or at least help you narrow it down prior to running a benchmark if an optimal choice is required.  These guiding principles include: 

1.	The local Linux file system will be faster than HDFS
2.	Repeated analyses will be faster if the data is local, and in XDF 
3.	Stream from a text data source for small data otherwise convert to XDF prior to analyses 
4.	The overhead of copying/streaming the data to the edge node for analysis will become untenable for very large data 
5.	Spark will be faster than Map Reduce for analyses in Hadoop until the data gets very large and is no longer able to fit in distributed memory

Given these principles, some general rules of thumb for selecting a compute context are: 

### Local Parallel

- If the data to analyze is small and does not require repeated analysis, then stream it directly into the analysis routine and use ‘localpar’. 
- If the data to analyze is small and requires repeated analyses, or is modest, then copy it to the local file system, import to XDF, and analyze via ‘localpar’. 

### Hadoop Spark

- If the data to analyze is large then import to XDF in HDFS unless storage is an issue, and analyze via ‘Spark‘. 

### Hadoop Map Reduce

- If the data to analyze is very large and Spark performance begins to deteriorate then try an analysis via ‘Map Reduce’.

## Inline help on rxSetComputeContext

For more information and examples of ScaleR compute contexts, please see the inline help in R on the rxSetComputeContext method, e.g. 

    > ?rxSetComputeContext 

or see the “ScaleR Distributed Computing Guide” available from the [R Server MSDN](https://msdn.microsoft.com/library/mt674634.aspx "R Server on MSDN") library.


## Next Steps

Now that you understand how to create a new HDInsight cluster that includes R Server, and the basics of using the R console from an SSH session, use the following to discover other ways of working with R Server on HDInsight.

- [Overview of R Server on Hadoop](hdinsight-hadoop-r-server-overview.md)
- [Get started with R server on Hadoop](hdinsight-hadoop-r-server-get-started.md)
- [Add RStudio Server to HDInsight premium](hdinsight-hadoop-r-server-install-r-studio.md)
- [Azure Storage options for R Server on HDInsight premium](hdinsight-hadoop-r-server-storage.md)