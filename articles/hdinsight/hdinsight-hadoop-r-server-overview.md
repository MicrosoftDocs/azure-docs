<properties
	pageTitle="What is R on HDInsight? Introduction to R Server on HDInsight (preview) | Microsoft Azure"
	description="What is R Server on HDInsight (preview) and how to use R Server for creating applications for big data analysis."
	services="hdinsight"
	documentationCenter=""
	authors="jeffstokes72"
	manager="paulettm"
	editor="cgronlun"/>

<tags
   ms.service="hdinsight"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="06/01/2016"
   ms.author="jeffstok"/>


# Overview of R Server on HDInsight \(preview\)

With Microsoft Azure HDInsight Premium, Microsoft R Server is now available as an option when you create HDInsight clusters in Azure. This new capability provides data scientists, statisticians, and R programmers with on-demand access to scalable, distributed methods of analytics on HDInsight.

Clusters can be sized to the projects and tasks at hand and torn down when they're no longer needed. Since they're part of Azure HDInsight, these clusters come with enterprise-level 24/7 support, an SLA of 99.9% uptime, and the flexibility to integrate with other components in the Azure ecosystem.

>[AZURE.NOTE] R Server is available only with HDInsight Premium. Currently, HDInsight Premium is only available for Hadoop and Spark clusters. So, currently you can use R Server only with Hadoop and Spark clusters on HDInsight. For more information, see [What are the different service levels and Hadoop components available with HDInsight?](hdinsight-component-versioning.md).

R Server on HDInsight provides the latest capabilities for R-based analytics on large datasets that are loaded to Azure Blob storage. Since R Server is built on open source R, the R-based applications you build can leverage any of the 8000+ open source R packages, as well as the routines in ScaleR, Microsoft’s big data analytics package that's included with R Server.

The edge node of Premium clusters provides a convenient place to connect to the cluster and to run your R scripts. With an edge node, you have the option of running ScaleR’s parallelized distributed functions across the cores of the edge node server. You also have the option to run them across the nodes of the cluster by using ScaleR’s Hadoop Map Reduce or Spark compute contexts.

The models or predictions that result from analyses can be downloaded for use on-premises. They can also be operationalized elsewhere in Azure, such as through an [Azure Machine Learning Studio](http://studio.azureml.net) [web service](../machine-learning/machine-learning-publish-a-machine-learning-web-service.md).

## Get started with R on HDInsight

To include R Server in an HDInsight cluster, you must create either a Hadoop or Spark cluster with the Premium option when you create a cluster by using the Azure portal. Both cluster types use the same configuration, which includes R Server on the data nodes of a cluster, and an edge node as a landing zone for R Server-based analytics. See [Getting Started with R Server on HDInsight](hdinsight-hadoop-r-server-get-started.md) for an in-depth walk-through on creating a cluster.

## Learn about data storage options

Default storage for HDInsight clusters is Blob storage with the HDFS file system mapped to a blob container. This ensures that whatever data is uploaded to the cluster storage, or written to cluster storage during the course of analysis, is made persistent. You can use the [AzCopy](../storage/storage-use-azcopy.md) utility to copy data to and from the blob.

In addition to using Blob storage, you have the option of using [Azure Data Lake Storage](https://azure.microsoft.com/services/data-lake-store/) with your cluster. If you use Data Lake, then you can use both Blob storage and Data Lake for HDFS storage.

You can also use [Azure Files](../storage/storage-how-to-use-files-linux.md) as a storage option for use on the edge node. Azure Files enables you to mount a file share that was created in Azure Storage to the Linux file system. For more information about data storage options for R Server on HDInsight cluster, see [Storage options for R Server on HDInsight clusters](hdinsight-hadoop-r-server-storage.md).

## Access R Server on the cluster

After you've created a cluster with R Server, you can connect to the R console on the edge node of the cluster through SSH/PuTTY. You can also connect through a browser if you choose to install the optional RStudio Server IDE on the edge node. For more information about installing RStudio Server, see [Installing RStudio Server on HDInsight clusters](hdinsight-hadoop-r-server-install-r-studio.md).   

## Develop and run R scripts

The R scripts you create and run can use any of the 8000+ open source R packages in addition to the parallelized and distributed routines in the ScaleR library. In general, script that's run in R Server on the edge node runs within the R interpreter on that node. The exception is those steps that call a ScaleR function with a compute context that's set to Hadoop Map Reduce (RxHadoopMR) or Spark (RxSpark).

In those cases, the function runs in a distributed fashion across those data (task) nodes of the cluster that are associated with the referenced data. For more information about the different compute context options, see [Compute context options for R Server on HDInsight Premium](hdinsight-hadoop-r-server-compute-contexts.md).

## Operationalize a model

When your data modeling is complete, you can operationalize the model to make predictions for new data both in Azure and on-premises. This process is known as scoring. Here are a few examples.

### Score in HDInsight

To score in HDInsight, write an R function that calls your model to make predictions for a new data file that you've loaded to your storage account. Then save the predictions back to the storage account. You can run the routine on-demand on the edge node of your cluster or by using a scheduled job.  

### Score in Azure Machine Learning

To score by using an Azure Machine Learning web service, use the [open source Azure Machine Learning R package](http://www.inside-r.org/blogs/2015/11/18/enhancements-azureml-package-connect-r-azureml-studio) to [publish your model as an Azure web service](http://www.r-bloggers.com/deploying-a-car-price-model-using-r-and-azureml/). Next, use the facilities in Machine Learning to create a user interface for the web service, and then call the web service as needed for scoring.

If you choose this option, you need to convert any ScaleR model objects to equivalent open-source model objects for use with the web service.  This can be done through the use of ScaleR coercion functions, such as `as.randomForest()` for ensemble-based models.

### Score on-premises

To score on-premises after creating your model, you can serialize the model in R, download it, de-serialize it, and then use it for scoring new data. You can score new data by using the approach described earlier in [Scoring in HDInsight](#scoring-in-hdinsight) or by using [DeployR](https://deployr.revolutionanalytics.com/).

## Maintain the cluster

### Install and maintain R packages

Most of the R packages that you use will be required on the edge node since most of your R scripts will run there. To install additional R packages on the edge node, you can use the usual `install.packages()` method in R.

In most cases, you don't need to install additional R packages on the data nodes if you are just using routines from the ScaleR library across the cluster. However, you might need additional packages to support use of **rxExec** or **RxDataStep** execution on the data nodes.

In these cases, the additional packages must be specified through use of a script action after you create the cluster. For more information, see [Creating an HDInsight cluster with R Server](hdinsight-hadoop-r-server-get-started.md).   

### Change Hadoop Map Reduce memory settings

A cluster can be modified to change the amount of memory that's available to R Server when it's running a Map Reduce job. To modify a cluster, use the Apache Ambari UI that's available through the Azure portal blade for your cluster. For instructions about how to access the Ambari UI for your cluster, see [Manage HDInsight clusters using the Ambari Web UI](hdinsight-hadoop-manage-ambari.md).

It's also possible to change the amount of memory that's available to R Server by using Hadoop switches in the call to **RxHadoopMR** as follows:

	hadoopSwitches = "-libjars /etc/hadoop/conf -Dmapred.job.map.memory.mb=6656"  

### Scale your cluster

An existing cluster can be scaled up or down through the portal. By scaling, you can gain the additional capacity that you might need for larger processing tasks, or you can scale back a cluster when it is idle. For instructions about how to scale a cluster, see [Manage HDInsight clusters](hdinsight-administer-use-portal-linux.md).

### Maintain the system

Maintenance is performed on the underlying Linux VMs in an HDInsight cluster during off-hours to apply OS patches and other updates. Typically, maintenance is done at 3:30 AM (based on the local time for the VM) every Monday and Thursday. Updates are performed in such a way that they don't impact more than a quarter of the cluster at a time.  

Since the head nodes are redundant and not all data nodes are impacted, any jobs that are running during this time might slow down. They should still run to completion, however. Any custom software or local data that you have is preserved across these maintenance events unless a catastrophic failure occurs that requires a cluster rebuild.

## Learn about IDE options for R Server on an HDInsight cluster

The Linux edge node of an HDInsight Premium cluster is the landing zone for R-based analysis. After connecting to the cluster, you can launch the console interface to R Server by typing **R** at the Linux command prompt. Use of the console interface is enhanced if you run a text editor for R script development in another window, and cut and paste sections of your script into the R console as needed.

A more sophisticated tool for the development of your R script is the  R-based IDE for use on the desktop, such as Microsoft’s recently announced [R Tools for Visual Studio](https://www.visualstudio.com/en-us/features/rtvs-vs.aspx) (RTVS). This is a family of desktop and server tools from [RStudio](https://www.rstudio.com/products/rstudio-server/). You can also use Walware’s Eclipse-based [StatET](http://www.walware.de/goto/statet).

Another option is to install an IDE on the Linux edge node itself.  A popular choice is [RStudio Server](https://www.rstudio.com/products/rstudio-server/), which provides a browser-based IDE for use by remote clients. Installing RStudio Server on the edge node of an HDInsight Premium cluster provides a full IDE experience for the development and execution of R scripts with R Server on the cluster. It can be considerably more productive than the R console.  If you want to use RStudio Server, see [Installing RStudio Server on HDInsight clusters](hdinsight-hadoop-r-server-install-r-studio.md).

## Learn about pricing

The fees that are associated with an HDInsight Premium cluster with R Server are structured similarly to the fees for the standard HDInsight clusters. They are based on the sizing of the underlying VMs across the name, data, and edge nodes, with the addition of a core-hour uplift for Premium. For more information about HDInsight Premium pricing, including pricing during Public Preview, and the availability of a 30-day free trial, see [HDInsight pricing](https://azure.microsoft.com/pricing/details/hdinsight/).

## Next steps

Follow the links below to read more about how to use R Server with HDInsight clusters.

- [Getting started with R Server on HDInsight](hdinsight-hadoop-r-server-get-started.md)

- [Add RStudio Server to HDInsight Premium](hdinsight-hadoop-r-server-install-r-studio.md)

- [Compute context options for R Server on HDInsight (preview)](hdinsight-hadoop-r-server-compute-contexts.md)

- [Azure Storage options for R Server on HDInsight Premium](hdinsight-hadoop-r-server-storage.md)
