<properties
	pageTitle="What is R on HDInsight? Introduction to R Server on HDInsight (preview) | Microsoft Azure"
	description="What is R Server on HDInsight (preview) and how to use R for creating applications for big data analysis."
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
   ms.date="03/29/2016"
   ms.author="jeffstok"/>


#Overview: R Server on HDInsight \(preview\)

With HDInsight Premium, R Server is now available as an option when creating HDInsight clusters in Azure. This new capability provides data scientists, statisticians, and R programmers with on-demand access to scalable, distributed methods of analytics on HDInsight. Clusters can be sized to the projects and tasks at hand and torn down when no longer needed. Being part of Azure HDInsight, these clusters come with enterprise-level 24/7 support, SLA of 99.9% up-time, and the flexibility of integration with other components of the Azure ecosystem.

>[AZURE.NOTE] R Server is available only with HDInsight Premium. Currently, HDInsight Premium is only available for Hadoop and Spark clusters. So, currently you can use R Server only with Hadoop and Spark clusters on HDInsight. For more information, see [What are the different service levels and Hadoop components available with HDInsight](hdinsight-component-versioning.md).

R Server on HDInsight provides the latest capabilities for R-based analytics on large datasets loaded to Azure Blob  (WASB). Since R Server is built on open source R, the R-based applications you build can leverage any of the 8000+ open source R packages, as well as the routines in ScaleR, Microsoft’s big data analytics package included with R Server. The edge node of Premium clusters provides a convenient landing zone for connection to the cluster and to run your R scripts. With an edge node, you have the option of running ScaleR’s parallelized distributed functions across the cores of the edge node server, or across the nodes of the cluster through use of ScaleR’s Hadoop Map Reduce or Spark compute contexts. The models or predictions that result from analyses can be downloaded for use on-premises or operationalized elsewhere in Azure, such as through an [Azure Machine Learning Studio](http://studio.azureml.net) (AML) [web service](../machine-learning/machine-learning-publish-a-machine-learning-web-service.md).

## Get started with R on HDInsight

To include R Server on an HDInsight cluster, you must create either a Hadoop or a Spark cluster with the Premium option when creating a cluster using the Azure Portal. Both cluster types use the same configuration that includes R Server on the data nodes of a cluster, and an edge node as a landing zone for R Server-based analytics.  See [Getting Started with R Server on HDInsight](hdinsight-hadoop-r-server-get-started.md) for an in-depth walk-through on creating a cluster.

## Data storage options

Default storage for HDInsight clusters is on Azure Blob (WASB) with the HDFS file system mapped to a blob container. This insures that whatever data is uploaded to the cluster storage, or written to cluster storage during the course of analysis is made persistent. A convenient method of copying data to and from blob is to use the [AzCopy](../storage/storage-use-azcopy/) utility. 

You can also use [Azure Files](../storage/storage-how-to-use-files-linux.md) as a storage option for use on the edge node. Azure Files enable you to mount a file share created on an Azure Storage account to the Linux file system. For more information on data storage options for R Server on HDInsight cluster, see [Storage options for R Server on HDInsight clusters](hdinsight-hadoop-r-server-storage.md).
  
## Accessing R Server on the Cluster

Once you have created a cluster with R Server, you can connect to the R Console on the edge node of the cluster through SSH/Putty, or through a browser if you choose to optionally install the RStudio Server IDE on the edge node. For more information on installing RStudio Server, see [Installing RStudio Server on HDInsight clusters](hdinsight-hadoop-r-server-install-r-studio.md).   

## Developing and Running R Scripts

The R scripts you create and run can use any of the 8000+ open source packages in addition to the parallelized and distributed routines in the ScaleR library. A script executed in R Server on the edge node will be run there using the R interpreter, except for those steps that call one of ScaleR functions with a compute context set to Hadoop Map Reduce (RxHadoopMR) or Spark (RxSpark). In those cases, the function will be executed in a distributed fashion across those data (task) nodes of the cluster associated with the referenced data. For more information on the different compute context options see [Compute context options for R Server on HDInsight Premium](hdinsight-hadoop-r-server-compute-contexts.md).

## Operationalizing a Model

When your data modeling is complete, you can operationalize the model to make predictions on new data, also known as scoring, both in Azure and on-premises. Here are a few examples.

### Scoring in HDInsight

To score in HDInsight, you could write an R function that calls your model to make predictions on a new data file you have loaded to your Azure Storage account and save the predictions back to the Storage account. You could run the routine on demand on the edge node of your cluster or using a scheduled job.  

### Scoring in Azure Machine Learning 

To score using an Azure Machine Learning web service, you could use the [open source Azure Machine Learning R package](http://www.inside-r.org/blogs/2015/11/18/enhancements-azureml-package-connect-r-azureml-studio) to [publish your model as an Azure web service](http://www.r-bloggers.com/deploying-a-car-price-model-using-r-and-azureml/), use the facilities in Azure Machine Learning to create a user interface for the web service, and then call the web service as needed for scoring. If you choose this option, you will need to convert any ScaleR model objects to an equivalent open source model object for use with the web service.  This can be done through use of the ScaleR coercion functions, such as `as.randomForest()`, for ensemble-based models.
  
### Scoring On-Premise

To score on-premise after creating your model, you could serialize the model in R, download it to on-premise, de-serialize it, and then use it for scoring of new data. You can do that by using the approach listed above for [Scoring in HDInsight](#scoring-in-hdinsight) or by using [DeployR](https://deployr.revolutionanalytics.com/).

## Maintaining the cluster 

### Installing and Maintaining R Packages

Most of the R packages you use will be needed on the edge node since the main portion of your R scripts will run there. To install additional R packages on the edge node you can use the usual `install.packages()` method in R.
  
In most cases you would not need to install additional R packages on the data nodes if you are just using routines from the ScaleR library to run across the cluster. However, you may need additional packages to support use of **rxExec** or **RxDataStep** execution on the data nodes. In such cases these additional packages must be specified through use of a script action after you create the cluster. For more information, see [Creating an HDInsight cluster with R Server](hdinsight-hadoop-r-server-get-started.md).   
  
### Changing Hadoop Map Reduce Memory Settings 

A cluster can be modified to change the amount of memory available to R Server when running a Map Reduce job. To do so, use the Ambari UI available through the Azure Portal blade for your cluster.  For instructions on how to access the Ambari UI for your cluster, see [Manage HDInsight clusters using the Ambari Web UI](hdinsight-hadoop-manage-ambari.md).

It is also possible to change the amount of memory available to R Server by using Hadoop switches in the call to **RxHadoopMR**, as shown below.
 
	hadoopSwitches = "-libjars /etc/hadoop/conf -Dmapred.job.map.memory.mb=6656"  

### Scaling your Cluster

An existing cluster can be scaled up or down through the Azure Portal.  This can be used to gain the additional capacity needed on larger processing, or can be used to scale back a cluster when it is idle. For instructions on how to scale a cluster, see [Manage HDInsight clusters](hdinsight-administer-use-portal-linux.md).

### System Maintenance 

Maintenance is performed on the underlying Linux VMs in an HDInsight cluster during off-hours to apply OS patches, etc.  Typically, these are done at 3:30 AM (based on the local time for VM) Monday & Thursday of every week. Updates are performed in a manner so as to not impact more than ¼ of the cluster at a time.  Since the head nodes are redundant and not all data nodes are impacted, any jobs running during this time may be slowed but should run to completion. Any custom software that you might have installed or local data is preserved across these maintenance events unless a catastrophic failure occurs that requires a cluster rebuild.

## IDE options for R Server on HDInsight cluster

The Linux edge node of an HDInsight Premium cluster is the landing zone for R-based analysis. After connecting to the cluster, you can launch the console interface to R Server by typing ‘R’ at the Linux command prompt. Use of the console interface is enhanced if you run a text editor for R script development in another window, and cut and paste sections of your script into the R console as needed.
  
A step up from use of a simple text editor for the development of your R script is the use of an R-based IDE on your desktop, such as Microsoft’s recently announced [R Tools for Visual Studio](https://www.visualstudio.com/en-us/features/rtvs-vs.aspx) (RTVS), a family of desktop and server tools from [RStudio](https://www.rstudio.com/products/rstudio-server/), or Walware’s Eclipse-based [StatET](http://www.walware.de/goto/statet).
  
Another option is to install an IDE on the Linux edge node itself.  A popular choice in such cases is [RStudio Server](https://www.rstudio.com/products/rstudio-server/) that provides a browser-based IDE for use by remote clients. Installing RStudio Server on the edge node of an HDInsight Premium cluster provides a full IDE experience for the development and execution of R scripts with R Server on the cluster, and can be considerably more productive than default use of the R Console.  If you would like to use RStudio Server, see [Installing RStudio Server on HDInsight clusters](hdinsight-hadoop-r-server-install-r-studio.md).

## Pricing
 
The fees associated with an HDInsight Premium cluster with R Server are structured in a manner similar to those for the standard HDInsight clusters and will be based on the sizing of the underlying VMs across the name, data, and edge nodes, with the addition of a core-hour uplift for Premium. For more information on HDInsight Premium pricing, including pricing during Public Preview, and the availability of a 30-day free trial, see [HDInsight pricing](https://azure.microsoft.com/pricing/details/hdinsight/).

## Next steps

Follow the links below to read more about how to use the R Server with HDInsight clusters.

- [Getting Started with R Server on HDInsight](hdinsight-hadoop-r-server-get-started.md)

- [Add RStudio Server to HDInsight Premium](hdinsight-hadoop-r-server-install-r-studio.md)

- [Compute context options for R Server on HDInsight Premium](hdinsight-hadoop-r-server-compute-contexts.md)

- [Azure Storage options for R Server on HDInsight Premium](hdinsight-hadoop-r-server-storage.md)

 
