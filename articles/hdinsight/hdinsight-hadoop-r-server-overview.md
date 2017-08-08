---
title: Introduction to R Server on Azure HDInsight | Microsoft Docs
description: Learn how to use R Server on HDInsight to create applications for big data analysis.
services: hdinsight
documentationcenter: ''
author: bradsev
manager: jhubbard
editor: cgronlun

ms.assetid: 6dc21bf5-4429-435f-a0fb-eea856e0ea96
ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 06/19/2017
ms.author: bradsev

---
#Introduction to R Server and open-source R capabilities on HDInsight

Microsoft R Server is available as a deployment option when you create HDInsight clusters in Azure. This new capability provides data scientists, statisticians, and R programmers with on-demand access to scalable, distributed methods of analytics on HDInsight.

Clusters can be sized appropriately to the projects and tasks at hand and then torn down when they're no longer needed. Since they're part of Azure HDInsight, these clusters come with enterprise-level 24/7 support, an SLA of 99.9% up-time, and the ability to integrate with other components in the Azure ecosystem.

R Server on HDInsight provides the latest capabilities for R-based analytics on datasets of virtually any size, loaded to either Azure Blob or Data Lake storage. Since R Server is built on open source R, the R-based applications you build can leverage any of the 8000+ open source R packages. The routines in ScaleR, Microsoft’s big data analytics package included with R Server, are also available.

The edge node of a cluster provides a convenient place to connect to the cluster and to run your R scripts. With an edge node, you have the option of running the parallelized distributed functions of ScaleR across the cores of the edge node server. You can also run them across the nodes of the cluster by using ScaleR’s Hadoop Map Reduce or Spark compute contexts.

The models or predictions that result from analyses can be downloaded for use on-premises. They can also be operationalized elsewhere in Azure, in particular through [Azure Machine Learning Studio](http://studio.azureml.net) [web service](../machine-learning/machine-learning-publish-a-machine-learning-web-service.md).

## Get started with R on HDInsight
To include R Server in an HDInsight cluster, you must select the R Server cluster type when creating an HDInsight cluster using the Azure portal. The R Server cluster type includes R Server on the data nodes of the cluster and on an edge node, which serves as a landing zone for R Server-based analytics. See [Getting Started with R Server on HDInsight](hdinsight-hadoop-r-server-get-started.md) for a walkthrough on how to create the cluster.

## Learn about data storage options
Default storage for the HDFS file system of HDInsight clusters can be associated with either an Azure Storage account or an Azure Data Lake store. This association ensures that whatever data is uploaded to the cluster storage during analysis is made persistent. There are various tools for handling the data transfer to the storage option that you select, including the portal-based upload facility of the storage account and the [AzCopy](../storage/storage-use-azcopy.md) utility.

You have the option of adding access to additional Blob and Data lake stores during the cluster provisioning process regardless of the primary storage option in use. See [Getting started with R Server on HDInsight](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-r-server-get-started) for information on adding access to additional accounts. See the supplementary [Azure Storage options for R Server on HDInsight](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-r-server-storage) article to learn more about using multiple storage accounts.

You can also use [Azure Files](../storage/storage-how-to-use-files-linux.md) as a storage option for use on the edge node. Azure Files enables you to mount a file share that was created in Azure Storage to the Linux file system. For more information about these data storage options for R Server on HDInsight cluster, see [Azure Storage options for R Server on HDInsight clusters](hdinsight-hadoop-r-server-storage.md).

## Access R Server on the cluster
You can connect to R Server on the edge node using a browser, provided you’ve chosen to include RStudio Server during the provisioning process. If you did not install it when provisioning the cluster, you can add it later. For information about installing RStudio Server after a cluster is created, see [Installing RStudio Server on HDInsight clusters](hdinsight-hadoop-r-server-install-r-studio.md). You can also connect to the R Server by using SSH/PuTTY to access the R console. 

## Develop and run R scripts
The R scripts you create and run can use any of the 8000+ open source R packages in addition to the parallelized and distributed routines available in the ScaleR library. In general, a script that is run with R Server on the edge node runs within the R interpreter on that node. The exceptions are those steps that need to call a ScaleR function with a compute context that is set to Hadoop Map Reduce (RxHadoopMR) or Spark (RxSpark). In this case, the function runs in a distributed fashion across those data (task) nodes of the cluster that are associated with the data referenced. For more information about the different compute context options, see [Compute context options for R Server on HDInsight](hdinsight-hadoop-r-server-compute-contexts.md).

## Operationalize a model
When your data modeling is complete, you can operationalize the model to make predictions for new data either from Azure and on-premises. This process is known as scoring. Scoring can be done in HDInsight, Azure Machine Learning, or on-premises.

### Score in HDInsight
To score in HDInsight, write an R function that calls your model to make predictions for a new data file that you've loaded to your storage account. Then save the predictions back to the storage account. You can run the routine on-demand on the edge node of your cluster or by using a scheduled job.  

### Score in Azure Machine Learning (AML)
To score using an AML web service, use the open source Azure Machine Learning R package known as [AzureML](https://cran.r-project.org/web/packages/AzureML/vignettes/getting_started.html) to publish your model as an Azure web service. For convenience, this package is pre-installed on the edge node. Next, use the facilities in Machine Learning to create a user interface for the web service, and then call the web service as needed for scoring.

If you choose this option, you need to convert any ScaleR model objects to equivalent open-source model objects for use with the web service. Use ScaleR coercion functions, such as `as.randomForest()` for ensemble-based models, for this conversion.

### Score on-premises
To score on-premises after creating your model, you can serialize the model in R, download it, de-serialize it, and then use it for scoring new data. You can score new data by using the approach described earlier in [Scoring in HDInsight](#scoring-in-hdinsight) or by using [DeployR](https://deployr.revolutionanalytics.com/).

## Maintain the cluster
### Install and maintain R packages
Most of the R packages that you use are required on the edge node since most steps of your R scripts run there. To install additional R packages on the edge node, you can use the usual `install.packages()` method in R.

If you are just using routines from the ScaleR library across the cluster, you do not usually need to install additional R packages on the data nodes. However, you might need additional packages to support the use of **rxExec** or **RxDataStep** execution on the data nodes.

In these cases, the additional packages can be installed with a script action after you create the cluster. For more information, see [Creating an HDInsight cluster with R Server](hdinsight-hadoop-r-server-get-started.md).   

### Change Hadoop Map Reduce memory settings
A cluster can be modified to change the amount of memory that's available to R Server when it's running a Map Reduce job. To modify a cluster, use the Apache Ambari UI that's available through the Azure portal blade for your cluster. For instructions about how to access the Ambari UI for your cluster, see [Manage HDInsight clusters using the Ambari Web UI](hdinsight-hadoop-manage-ambari.md).

It's also possible to change the amount of memory that's available to R Server by using Hadoop switches in the call to **RxHadoopMR** as follows:

    hadoopSwitches = "-libjars /etc/hadoop/conf -Dmapred.job.map.memory.mb=6656"  

### Scale your cluster
An existing cluster can be scaled up or down through the portal. By scaling, you can gain the additional capacity that you might need for larger processing tasks, or you can scale back a cluster when it is idle. For instructions about how to scale a cluster, see [Manage HDInsight clusters](hdinsight-administer-use-portal-linux.md).

### Maintain the system
Maintenance to apply OS patches and other updates is performed on the underlying Linux VMs in an HDInsight cluster during off-hours. Typically, maintenance is done at 3:30 AM (based on the local time for the VM) every Monday and Thursday. Updates are performed in such a way that they don't impact more than a quarter of the cluster at a time.  

Since the head nodes are redundant and not all data nodes are impacted, any jobs that are running during this time might slow down. They should still run to completion, however. Any custom software or local data that you have is preserved across these maintenance events unless a catastrophic failure occurs that requires a cluster rebuild.

## Learn about IDE options for R Server on an HDInsight cluster
The Linux edge node of an HDInsight cluster is the landing zone for R-based analysis. Recent versions of HDInsight provide a default option for installing the community version of [RStudio Server](https://www.rstudio.com/products/rstudio-server/) on the edge node as a browser-based IDE. Use of RStudio Server as an IDE for the development and execution of R scripts can be considerably more productive than just using the R console. If you chose not to add RStudio Server when creating the cluster but would like to add it later, then see [Installing R Studio Server on HDInsight clusters](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-r-server-install-r-studio).+

Another full IDE option is to install a desktop IDE and use it to access the cluster through use of a remote Map Reduce or Spark compute context. Options include Microsoft’s [R Tools for Visual Studio](https://www.visualstudio.com/features/rtvs-vs.aspx) (RTVS), RStudio, and Walware’s Eclipse-based [StatET](http://www.walware.de/goto/statet).

Lastly, you can access the R Server console on the edge node by typing **R** at the Linux command prompt after connecting via SSH or PuTY. When using the console interface, it is convenient to run a text editor for R script development in another window, and cut and paste sections of your script into the R console as needed.

## Learn about pricing
The fees that are associated with an HDInsight cluster with R Server are structured similarly to the fees for the standard HDInsight clusters. They are based on the sizing of the underlying VMs across the name, data, and edge nodes, with the addition of a core-hour uplift. For more information about HDInsight pricing, and the availability of a 30-day free trial, see [HDInsight pricing](https://azure.microsoft.com/pricing/details/hdinsight/).

## Next steps
To learn more about how to use R Server with HDInsight clusters, see the following topics:

* [Getting started with R Server on HDInsight](hdinsight-hadoop-r-server-get-started.md)
* [Add RStudio Server to HDInsight (if not installed during cluster creation)](hdinsight-hadoop-r-server-install-r-studio.md)
* [Compute context options for R Server on HDInsight](hdinsight-hadoop-r-server-compute-contexts.md)
* [Azure Storage options for R Server on HDInsight](hdinsight-hadoop-r-server-storage.md)
