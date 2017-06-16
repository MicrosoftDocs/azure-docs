---
title: Introduction to R Server on Azure HDInsight | Microsoft Docs
description: Get an introduction to R Server on HDInsight. Learn how to use R Server for creating applications for big data analysis.
services: hdinsight
documentationcenter: ''
author: jeffstokes72
manager: jhubbard
editor: cgronlun

ms.assetid: 6dc21bf5-4429-435f-a0fb-eea856e0ea96
ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 02/28/2017
ms.author: jeffstok

---
#Introduction to R Server and open-source R capabilities on HDInsight

With Microsoft Azure HDInsight, Microsoft R Server is now available as an option when you create HDInsight clusters in Azure. This new capability provides data scientists, statisticians, and R programmers with on-demand access to scalable, distributed methods of analytics on HDInsight.

Clusters can be sized to the projects and tasks at hand and torn down when they're no longer needed. Since they're part of Azure HDInsight, these clusters come with enterprise-level 24/7 support, an SLA of 99.9% uptime, and the flexibility to integrate with other components in the Azure ecosystem.

R Server on HDInsight provides the latest capabilities for R-based analytics on datasets of virtually any size loaded to either Azure Blob or Data Lake storage. Since R Server is built on open source R, the R-based applications you build can leverage any of the 8000+ open source R packages, as well as the routines in ScaleR, Microsoft’s big data analytics package that's included with R Server.

The edge node of a cluster provides a convenient place to connect to the cluster and to run your R scripts. With an edge node, you have the option of running ScaleR’s parallelized distributed functions across the cores of the edge node server. You also have the option to run them across the nodes of the cluster by using ScaleR’s Hadoop Map Reduce or Spark compute contexts.

The models or predictions that result from analyses can be downloaded for use on-premises. They can also be operationalized elsewhere in Azure, such as through an [Azure Machine Learning Studio](http://studio.azureml.net) [web service](../machine-learning/machine-learning-publish-a-machine-learning-web-service.md).

## Get started with R on HDInsight
To include R Server in an HDInsight cluster, you must select the R Server cluster type when creating an HDInsight cluster using the Azure portal. The R Server cluster type includes R Server on the data nodes of the cluster, and on an edge node as a landing zone for R Server-based analytics. See [Getting Started with R Server on HDInsight](hdinsight-hadoop-r-server-get-started.md) for an in-depth walk-through on creating a cluster.

## Learn about data storage options
Default storage for the HDFS file system of HDInsight clusters can be associated with either an Azure Storage account or a Azure Data Lake store. This ensures that whatever data is uploaded to the cluster storage during analysis is made persistent. There are various tools for data transfer to the storage option you select including the storage account's portal-based upload facility and the [AzCopy](../storage/storage-use-azcopy.md) utility.

Regardless of whether you choose Azure Blob or Data Lake as primary storage for your cluster, you have the option of adding access to additional Blob and Data lake stores during the cluster provisioning process. See [Getting started with R Server on HDInsight](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-r-server-get-started) for information on adding access to additional accounts, and the supplementary [Azure Storage options for R Server on HDInsight](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-r-server-storage) article to learn about using multiple
storage accounts.

You can also use [Azure Files](../storage/storage-how-to-use-files-linux.md) as a storage option for use on the edge node. Azure Files enables you to mount a file share that was created in Azure Storage to the Linux file system. For more information about data storage options for R Server on HDInsight cluster, see [Azure Storage options for R Server on HDInsight clusters](hdinsight-hadoop-r-server-storage.md).

## Access R Server on the cluster
After you've created a cluster with R Server,you can connect to R Server on the edge node using a browser if you’ve chosen to include RStudio Server during the provisioning process, or have added it later, or by using SSH/PuTTY to access the R console. For more information about installing RStudio Server after a cluster is created, see [Installing RStudio Server on HDInsight clusters](hdinsight-hadoop-r-server-install-r-studio.md).   

## Develop and run R scripts
The R scripts you create and run can use any of the 8000+ open source R packages in addition to the parallelized and distributed routines in the ScaleR library. In general, script that's run with R Server on the edge node runs within the R interpreter on that node. The exceptions are those steps that call a ScaleR function with a compute context that's set to Hadoop Map Reduce (RxHadoopMR) or Spark (RxSpark).

In those cases, the function runs in a distributed fashion across those data (task) nodes of the cluster that are associated with the referenced data. For more information about the different compute context options, see [Compute context options for R Server on HDInsight](hdinsight-hadoop-r-server-compute-contexts.md).

## Operationalize a model
When your data modeling is complete, you can operationalize the model to make predictions for new data both in Azure and on-premises. This process is known as scoring. Here are a few examples.

### Score in HDInsight
To score in HDInsight, write an R function that calls your model to make predictions for a new data file that you've loaded to your storage account. Then save the predictions back to the storage account. You can run the routine on-demand on the edge node of your cluster or by using a scheduled job.  

### Score in Azure Machine Learning
To score by using an Azure Machine Learning web service, use the open source Azure Machine Learning R package known as [AzureML](https://cran.r-project.org/web/packages/AzureML/vignettes/getting_started.html) to publish your model as an Azure web service. For convenience, this package is pre-installed on the edge node. Next, use the facilities in Machine Learning to create a user interface for the web service, and then call the web service as needed for scoring.

If you choose this option, you’ll need to convert any ScaleR model objects to equivalent open-source model objects for use with the web service. This can be done through the use of ScaleR coercion functions, such as `as.randomForest()` for ensemble-based models.

### Score on-premises
To score on-premises after creating your model, you can serialize the model in R, download it, de-serialize it, and then use it for scoring new data. You can score new data by using the approach described earlier in [Scoring in HDInsight](#scoring-in-hdinsight) or by using [DeployR](https://deployr.revolutionanalytics.com/).

## Maintain the cluster
### Install and maintain R packages
Most of the R packages that you use will be required on the edge node since most steps of your R scripts will run there. To install additional R packages on the edge node, you can use the usual `install.packages()` method in R.

In most cases, you won't need to install additional R packages on the data nodes if you are just using routines from the ScaleR library across the cluster. However, you might need additional packages to support use of **rxExec** or **RxDataStep** execution on the data nodes.

In these cases, the additional packages can be installed through use of a script action after you create the cluster. For more information, see [Creating an HDInsight cluster with R Server](hdinsight-hadoop-r-server-get-started.md).   

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
The Linux edge node of an HDInsight cluster is the landing zone for R-based analysis.  Recent versions of HDInsight provide a default option for installing the community version of [RStudio Server](https://www.rstudio.com/products/rstudio-server/) on the edge node as a browser-based IDE. Use of RStudio Server as an IDE for the development and execution of R scripts can be considerably more productive than just using the R console. If you chose not to add RStudio Server when creating the cluster but would like to add it later then see [Installing R Studio Server on HDInsight clusters](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-r-server-install-r-studio).+

Another full IDE option is to install a desktop IDE such as Microsoft’s recently announced [R Tools for Visual Studio](https://www.visualstudio.com/en-us/features/rtvs-vs.aspx) (RTVS), RStudio, or Walware’s Eclipse-based [StatET](http://www.walware.de/goto/statet) and access the cluster through use of a remote Map Reduce or Spark compute context.  

Lastly, you can simply access the R Server console on the edge node by typing **R** at the Linux command prompt after connecting via SSH or PuTY. Use of the console interface is enhanced if you run a text editor for R script development in another window, and cut and paste sections of your script into the R console as needed.

## Learn about pricing
The fees that are associated with an HDInsight cluster with R Server are structured similarly to the fees for the standard HDInsight clusters. They are based on the sizing of the underlying VMs across the name, data, and edge nodes, with the addition of a core-hour uplift. For more information about HDInsight pricing, and the availability of a 30-day free trial, see [HDInsight pricing](https://azure.microsoft.com/pricing/details/hdinsight/).

## Next steps
Follow the links below to read more about how to use R Server with HDInsight clusters.

* [Getting started with R Server on HDInsight](hdinsight-hadoop-r-server-get-started.md)
* [Add RStudio Server to HDInsight (if not installed during cluster creation)](hdinsight-hadoop-r-server-install-r-studio.md)
* [Compute context options for R Server on HDInsight](hdinsight-hadoop-r-server-compute-contexts.md)
* [Azure Storage options for R Server on HDInsight](hdinsight-hadoop-r-server-storage.md)
