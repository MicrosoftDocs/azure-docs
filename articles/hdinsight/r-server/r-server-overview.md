---
title: Introduction to ML Services on Azure HDInsight 
description: Learn how to use ML Services on HDInsight to create applications for big data analysis.
services: hdinsight
ms.service: hdinsight
author: jasonwhowell
ms.author: jasonh
ms.reviewer: jasonh
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 06/27/2018
---
# Introduction to ML Services and open-source R capabilities on HDInsight

> [!NOTE]
> In September 2017, Microsoft R Server was released under the new name of **Microsoft Machine Learning Server** or ML Server. Consequently, R Server cluster on HDInsight is now called **Machine Learning Services** or **ML Services** cluster on HDInsight. For more information on the R Server name change, see [Microsoft R Server is now Microsoft Machine Learning Server](https://docs.microsoft.com/machine-learning-server/rebranding-microsoft-r-server#get-support-for-r-server).

Microsoft Machine Learning Server is available as a deployment option when you create HDInsight clusters in Azure. The cluster type that provides this option is called **ML Services**. This capability provides data scientists, statisticians, and R programmers with on-demand access to scalable, distributed methods of analytics on HDInsight.

[!INCLUDE [hdinsight-price-change](../../../includes/hdinsight-enhancements.md)]

ML Services on HDInsight provides the latest capabilities for R-based analytics on datasets of virtually any size, loaded to either Azure Blob or Data Lake storage. Since ML Services cluster is built on open-source R, the R-based applications you build can leverage any of the 8000+ open-source R packages. The routines in ScaleR, Microsoft’s big data analytics package are also available.

The edge node of a cluster provides a convenient place to connect to the cluster and to run your R scripts. With an edge node, you have the option of running the parallelized distributed functions of ScaleR across the cores of the edge node server. You can also run them across the nodes of the cluster by using ScaleR’s Hadoop Map Reduce or Spark compute contexts.

The models or predictions that result from analysis can be downloaded for on-premises use. They can also be operationalized elsewhere in Azure, in particular through [Azure Machine Learning Studio](http://studio.azureml.net) [web service](../../machine-learning/studio/publish-a-machine-learning-web-service.md).

## Get started with ML Services on HDInsight

To create an ML Services cluster in Azure HDInsight, select the **ML Services** cluster type when creating an HDInsight cluster using the Azure portal. The ML Services cluster type includes ML Server on the data nodes of the cluster and on an edge node, which serves as a landing zone for ML Services-based analytics. See [Getting Started with ML Services on HDInsight](r-server-get-started.md) for a walkthrough on how to create the cluster.

## Why choose ML Services in HDInsight?

ML Services in HDInsight provides the following benefits:

### AI innovation from Microsoft and open-source

  ML Services includes highly scalable, distributed set of algorithms such as [RevoscaleR](https://docs.microsoft.com/machine-learning-server/r-reference/revoscaler/revoscaler), [revoscalepy](https://docs.microsoft.com/machine-learning-server/python-reference/revoscalepy/revoscalepy-package), and [microsoftML](https://docs.microsoft.com/machine-learning-server/python-reference/microsoftml/microsoftml-package) that can work on data sizes larger than the size of physical memory, and run on a wide variety of platforms in a distributed manner. Learn more about the collection of Microsoft's custom [R packages](https://docs.microsoft.com/machine-learning-server/r-reference/introducing-r-server-r-package-reference) and [Python packages](https://docs.microsoft.com/machine-learning-server/python-reference/introducing-python-package-reference) included with the product.
  
  ML Services bridges these Microsoft innovations and contributions coming from the open-source community (R, Python, and AI toolkits) all on top of a single enterprise-grade platform. Any R or Python open-source machine learning package can work side by side with any proprietary innovation from Microsoft.

### Simple, secure, and high-scale operationalization and administration

  Enterprises relying on traditional paradigms and environments invest much time and effort towards operationalization. This results in inflated costs and delays including the translation time for models, iterations to keep them valid and current, regulatory approval, and managing permissions through operationalization.

  ML Services offers enterprise grade [operationalization](https://docs.microsoft.com/machine-learning-server/what-is-operationalization), in that, after a machine learning model is completed, it takes just a few clicks to generate web services APIs. These [web services](https://docs.microsoft.com/machine-learning-server/operationalize/concept-what-are-web-services) are hosted on a server grid in the cloud and can be integrated with line-of-business applications. The ability to deploy to an elastic grid lets you scale seamlessly with the needs of your business, both for batch and real-time scoring. For instructions, see [Operationalize ML Services on HDInsight](r-server-operationalize.md).

<!---
* **Deep ecosystem engagements to deliver customer success with optimal total cost of ownership**

  Individuals embarking on the journey of making their applications intelligent or simply wanting to learn the new world of AI and machine learning, need the right resources to help them get started. In addition to this documentation, Microsoft provides several learning resources and has engaged several training partners to help you ramp up and become productive quickly.
--->

## Key features of ML Services on HDInsight

The following features are included in ML Services on HDInsight.

| Feature category | Description |
|------------------|-------------|
| R-enabled | [R packages](https://docs.microsoft.com/machine-learning-server/r-reference/introducing-r-server-r-package-reference) for solutions written in R, with an open source distribution of R, and run-time infrastructure for script execution. |
| Python-enabled | [Python modules](https://docs.microsoft.com/machine-learning-server/python-reference/introducing-python-package-reference) for solutions written in Python, with an open source distribution of Python, and run-time infrastructure for script execution.
| [Pre-trained models](https://docs.microsoft.com/machine-learning-server/install/microsoftml-install-pretrained-models) | For visual analysis and text sentiment analysis, ready to score data you provide. |
| [Deploy and consume](r-server-operationalize.md) | Operationalize your server and deploy solutions as a web service. |
| [Remote execution](r-server-hdinsight-manage.md#connect-remotely-to-microsoft-ml-services) | Start remote sessions on ML Services cluster on your network from your client workstation. |


## Data storage options for ML Services on HDInsight

Default storage for the HDFS file system of HDInsight clusters can be associated with either an Azure Storage account or an Azure Data Lake Store. This association ensures that whatever data is uploaded to the cluster storage during analysis is made persistent and the data is available even after the cluster is deleted. There are various tools for handling the data transfer to the storage option that you select, including the portal-based upload facility of the storage account and the [AzCopy](../../storage/common/storage-use-azcopy.md) utility.

You have the option of enabling access to additional Blob and Data lake stores during the cluster provisioning process regardless of the primary storage option in use. See [Getting started with ML Services on HDInsight](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-r-server-get-started) for information on adding access to additional accounts. See [Azure Storage options for ML Services on HDInsight](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-r-server-storage) article to learn more about using multiple storage accounts.

You can also use [Azure Files](../../storage/files/storage-how-to-use-files-linux.md) as a storage option for use on the edge node. Azure Files enables you to mount a file share that was created in Azure Storage to the Linux file system. For more information about these data storage options for ML Services on HDInsight cluster, see [Azure Storage options for ML Services on HDInsight](r-server-storage.md).

## Access ML Services edge node

You can connect to Microsoft ML Server on the edge node using a browser. It is installed by default during cluster creation. For more information, see [Get stared with ML Services on HDInsight](r-server-get-started.md). You can also connect to the cluster edge node from the command line by using SSH/PuTTY to access the R console.

## Develop and run R scripts

The R scripts you create and run can use any of the 8000+ open-source R packages in addition to the parallelized and distributed routines available in the ScaleR library. In general, a script that is run with ML Services on the edge node runs within the R interpreter on that node. The exceptions are those steps that need to call a ScaleR function with a compute context that is set to Hadoop Map Reduce (RxHadoopMR) or Spark (RxSpark). In this case, the function runs in a distributed fashion across those data (task) nodes of the cluster that are associated with the data referenced. For more information about the different compute context options, see [Compute context options for ML Services on HDInsight](r-server-compute-contexts.md).

## Operationalize a model

When your data modeling is complete, you can operationalize the model to make predictions for new data either from Azure or on-premises. This process is known as scoring. Scoring can be done in HDInsight, Azure Machine Learning, or on-premises.

### Score in HDInsight

To score in HDInsight, write an R function that calls your model to make predictions for a new data file that you've loaded to your storage account. Then, save the predictions back to the storage account. You can run this routine on-demand on the edge node of your cluster or by using a scheduled job.

### Score in Azure Machine Learning (AML)

To score using Azure Machine Learning, use the open-source Azure Machine Learning R package known as [AzureML](https://cran.r-project.org/web/packages/AzureML/vignettes/getting_started.html) to publish your model as an Azure web service. For convenience, this package is pre-installed on the edge node. Next, use the facilities in Azure Machine Learning to create a user interface for the web service, and then call the web service as needed for scoring.

If you choose this option, you must convert any ScaleR model objects to equivalent open-source model objects for use with the web service. Use ScaleR coercion functions, such as `as.randomForest()` for ensemble-based models, for this conversion.

### Score on-premises

To score on-premises after creating your model, you can serialize the model in R, download it, de-serialize it, and then use it for scoring new data. You can score new data by using the approach described earlier in [Scoring in HDInsight](#scoring-in-hdinsight) or by using [web services](https://docs.microsoft.com/machine-learning-server/operationalize/concept-what-are-web-services).

## Maintain the cluster

### Install and maintain R packages

Most of the R packages that you use are required on the edge node since most steps of your R scripts run there. To install additional R packages on the edge node, you can use the `install.packages()` method in R.

If you are just using routines from the ScaleR library across the cluster, you do not usually need to install additional R packages on the data nodes. However, you might need additional packages to support the use of **rxExec** or **RxDataStep** execution on the data nodes.

In such cases, the additional packages can be installed with a script action after you create the cluster. For more information, see [Manage ML Services in HDInsight cluster](r-server-hdinsight-manage.md).

### Change Hadoop MapReduce memory settings

A cluster can be modified to change the amount of memory that is available to ML Services when it is running a MapReduce job. To modify a cluster, use the Apache Ambari UI that's available through the Azure portal blade for your cluster. For instructions about how to access the Ambari UI for your cluster, see [Manage HDInsight clusters using the Ambari Web UI](../hdinsight-hadoop-manage-ambari.md).

It is also possible to change the amount of memory that is available to ML Services by using Hadoop switches in the call to **RxHadoopMR** as follows:

    hadoopSwitches = "-libjars /etc/hadoop/conf -Dmapred.job.map.memory.mb=6656"  

### Scale your cluster

An existing ML Services cluster on HDInsight can be scaled up or down through the portal. By scaling up, you can gain the additional capacity that you might need for larger processing tasks, or you can scale back a cluster when it is idle. For instructions about how to scale a cluster, see [Manage HDInsight clusters](../hdinsight-administer-use-portal-linux.md).

### Maintain the system

Maintenance to apply OS patches and other updates is performed on the underlying Linux VMs in an HDInsight cluster during off-hours. Typically, maintenance is done at 3:30 AM (based on the local time for the VM) every Monday and Thursday. Updates are performed in such a way that they don't impact more than a quarter of the cluster at a time.

Since the head nodes are redundant and not all data nodes are impacted, any jobs that are running during this time might slow down. However, they should still run to completion. Any custom software or local data that you have is preserved across these maintenance events unless a catastrophic failure occurs that requires a cluster rebuild.

## IDE options for ML Services on HDInsight

The Linux edge node of an HDInsight cluster is the landing zone for R-based analysis. Recent versions of HDInsight provide a default installation of RStudio Server on the edge node as a browser-based IDE. Use of RStudio Server as an IDE for the development and execution of R scripts can be considerably more productive than just using the R console.

Additionally, you can install a desktop IDE and use it to access the cluster through use of a remote MapReduce or Spark compute context. Options include Microsoft’s [R Tools for Visual Studio](https://www.visualstudio.com/features/rtvs-vs.aspx) (RTVS), RStudio, and Walware’s Eclipse-based [StatET](http://www.walware.de/goto/statet).

Additionally, you can access the R console on the edge node by typing **R** at the Linux command prompt after connecting via SSH or PuTTY. When using the console interface, it is convenient to run a text editor for R script development in another window, and cut and paste sections of your script into the R console as needed.

## Pricing

The prices that are associated with an ML Services HDInsight cluster are structured similarly to the prices for other HDInsight cluster types. They are based on the sizing of the underlying VMs across the name, data, and edge nodes, with the addition of a core-hour uplift. For more information, see [HDInsight pricing](https://azure.microsoft.com/pricing/details/hdinsight/).

## Next steps

To learn more about how to use ML Services on HDInsight clusters, see the following topics:

* [Get started with ML Services cluster on HDInsight](r-server-get-started.md)
* [Compute context options for ML Services cluster on HDInsight](r-server-compute-contexts.md)
* [Storage options for ML Services cluster on HDInsight](r-server-storage.md)
