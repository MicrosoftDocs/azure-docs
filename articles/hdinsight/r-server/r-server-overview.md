---
title: Introduction to ML Services on Azure HDInsight 
description: Learn how to use ML Services on HDInsight to create applications for big data analysis.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: overview
ms.custom: hdinsightactive,seoapr2020
ms.date: 04/20/2020
#Customer intent: As a developer I want to have a basic understanding of Microsoft's implementation of machine learning in Azure HDInsight so I can decide if I want to use it rather than build my own cluster.
---

# What is ML Services in Azure HDInsight

Microsoft Machine Learning Server is available as a deployment option when you create HDInsight clusters in Azure. The cluster type that provides this option is called **ML Services**. This capability provides on-demand access to adaptable, distributed methods of analytics on HDInsight.

ML Services on HDInsight provides the latest capabilities for R-based analytics on datasets of virtually any size. The datasets can be loaded to either Azure Blob or Data Lake storage. Your R-based applications can use the 8000+ open-source R packages. The routines in ScaleR, Microsoft's big data analytics package are also available.

The edge node provides a convenient place to connect to the cluster and run your R scripts. The edge node allows running the ScaleR parallelized distributed functions across the cores of the server. You can also run them across the nodes of the cluster by using ScaleR's Hadoop Map Reduce. You can also use Apache Spark compute contexts.

The models or predictions that result from analysis can be downloaded for on-premises use. They can also be `operationalized` elsewhere in Azure. In particular, through [Azure Machine Learning Studio (classic)](https://studio.azureml.net), and [web service](../../machine-learning/studio/deploy-a-machine-learning-web-service.md).

## Get started with ML Services on HDInsight

To create an ML Services cluster in HDInsight, select the **ML Services** cluster type. The ML Services cluster type includes ML Server on the data nodes, and edge node. The edge node serves as a landing zone for ML Services-based analytics. See [Create Apache Hadoop clusters using the Azure portal](../hdinsight-hadoop-create-linux-clusters-portal.md) for a walkthrough on how to create the cluster.

## Why choose ML Services in HDInsight?

ML Services in HDInsight provides the following benefits:

### AI innovation from Microsoft and open-source

  ML Services includes highly adaptable, distributed set of algorithms such as [RevoscaleR](https://docs.microsoft.com/machine-learning-server/r-reference/revoscaler/revoscaler), [revoscalepy](https://docs.microsoft.com/machine-learning-server/python-reference/revoscalepy/revoscalepy-package), and [microsoftML](https://docs.microsoft.com/machine-learning-server/python-reference/microsoftml/microsoftml-package). These algorithms can work on data sizes larger than the size of physical memory. They also run on a wide variety of platforms in a distributed manner. Learn more about the collection of Microsoft's custom [R packages](https://docs.microsoft.com/machine-learning-server/r-reference/introducing-r-server-r-package-reference) and [Python packages](https://docs.microsoft.com/machine-learning-server/python-reference/introducing-python-package-reference) included with the product.
  
  ML Services bridges these Microsoft innovations and contributions coming from the open-source community (R, Python, and AI toolkits). All on top of a single enterprise-grade platform. Any R or Python open-source machine learning package can work side by side with any proprietary innovation from Microsoft.

### Simple, secure, and high-scale operationalization and administration

  Enterprises relying on traditional paradigms and environments invest much time and effort towards operationalization. This action results in inflated costs and delays including the translation time for: models, iterations to keep them valid and current, regulatory approval, and managing permissions.

  ML Services offers enterprise grade [operationalization](https://docs.microsoft.com/machine-learning-server/what-is-operationalization). After a machine learning model completes, it takes just a few clicks to generate web services APIs. These [web services](https://docs.microsoft.com/machine-learning-server/operationalize/concept-what-are-web-services) are hosted on a server grid in the cloud and can be integrated with line-of-business applications. The ability to deploy to an elastic grid lets you scale seamlessly with the needs of your business, both for batch and real-time scoring. For instructions, see [Operationalize ML Services on HDInsight](r-server-operationalize.md).

<!---
* **Deep ecosystem engagements to deliver customer success with optimal total cost of ownership**

  Individuals embarking on the journey of making their applications intelligent or simply wanting to learn the new world of AI and machine learning, need the right resources to help them get started. In addition to this documentation, Microsoft provides several learning resources and has engaged several training partners to help you ramp up and become productive quickly.
--->

> [!NOTE]  
> The ML Services cluster type on HDInsight is supported only on HDInsight 3.6. HDInsight 3.6 is scheduled to retire on December 31, 2020.

## Key features of ML Services on HDInsight

The following features are included in ML Services on HDInsight.

| Feature category | Description |
|------------------|-------------|
| R-enabled | [R packages](https://docs.microsoft.com/machine-learning-server/r-reference/introducing-r-server-r-package-reference) for solutions written in R, with an open-source distribution of R, and run-time infrastructure for script execution. |
| Python-enabled | [Python modules](https://docs.microsoft.com/machine-learning-server/python-reference/introducing-python-package-reference) for solutions written in Python, with an open-source distribution of Python, and run-time infrastructure for script execution.
| [Pre-trained models](https://docs.microsoft.com/machine-learning-server/install/microsoftml-install-pretrained-models) | For visual analysis and text sentiment analysis, ready to score data you provide. |
| [Deploy and consume](r-server-operationalize.md) | `Operationalize` your server and deploy solutions as a web service. |
| [Remote execution](r-server-hdinsight-manage.md#connect-remotely-to-microsoft-ml-services) | Start remote sessions on ML Services cluster on your network from your client workstation. |

## Data storage options for ML Services on HDInsight

Default storage for the HDFS file system can be an Azure Storage account or Azure Data Lake Storage. Uploaded data to cluster storage during analysis is made persistent. The data is available even after the cluster is deleted. Various tools can handle the data transfer to storage. The tools include the portal-based upload facility of the storage account and the AzCopy utility.

You can enable access to additional Blob and Data lake stores during cluster creation. You aren't limited by the primary storage option in use.  See [Azure Storage options for ML Services on HDInsight](./r-server-storage.md) article to learn more about using multiple storage accounts.

You can also use Azure Files as a storage option for use on the edge node. Azure Files enables file shares created in Azure Storage to the Linux file system. For more information, see [Azure Storage options for ML Services on HDInsight](r-server-storage.md).

## Access ML Services edge node

You can connect to Microsoft ML Server on the edge node using a browser, or SSH/PuTTY. The R console is installed by default during cluster creation.  

## Develop and run R scripts

Your R scripts can use any of the 8000+ open-source R packages. You can also use the parallelized and distributed routines from the ScaleR library. Scripts run on the edge node run within the R interpreter on that node. Except for steps that call ScaleR functions with a Map Reduce (RxHadoopMR) or Spark (RxSpark) compute context. The functions run in a distributed fashion across the data nodes that are associated with the data. For more information about context options, see [Compute context options for ML Services on HDInsight](r-server-compute-contexts.md).

## `Operationalize` a model

When your data modeling is complete, `operationalize` the model to make predictions for new data either from Azure or on-premises. This process is known as scoring. Scoring can be done in HDInsight, Azure Machine Learning, or on-premises.

### Score in HDInsight

To score in HDInsight, write an R function. The function calls your model to make predictions for a new data file that you've loaded to your storage account. Then, save the predictions back to the storage account. You can run this routine on-demand on the edge node of your cluster or by using a scheduled job.

### Score in Azure Machine Learning (AML)

To score using Azure Machine Learning, use the open-source Azure Machine Learning R package known as [AzureML](https://cran.r-project.org/src/contrib/Archive/AzureML/) to publish your model as an Azure web service. For convenience, this package is pre-installed on the edge node. Next, use the facilities in Azure Machine Learning to create a user interface for the web service, and then call the web service as needed for scoring. Then convert ScaleR model objects to equivalent open-source model objects for use with the web service. Use ScaleR coercion functions, such as `as.randomForest()` for ensemble-based models, for this conversion.

### Score on-premises

To score on-premises after creating your model: serialize the model in R, download it, de-serialize it, then use it for scoring new data. You can score new data by using the approach described earlier in Score in HDInsight or by using [web services](https://docs.microsoft.com/machine-learning-server/operationalize/concept-what-are-web-services).

## Maintain the cluster

### Install and maintain R packages

Most of the R packages that you use are required on the edge node since most steps of your R scripts run there. To install additional R packages on the edge node, you can use the `install.packages()` method in R.

If you're just using ScaleR library routines, you don't usually need additional R packages. You might need additional packages for **rxExec** or **RxDataStep** execution on the data nodes.

The additional packages can be installed with a script action after you create the cluster. For more information, see [Manage ML Services in HDInsight cluster](r-server-hdinsight-manage.md).

### Change Apache Hadoop MapReduce memory settings

Available memory to ML Services can be modified when it's running a MapReduce job. To modify a cluster, use the Apache Ambari UI for your cluster. For Ambari UI instructions, see [Manage HDInsight clusters using the Ambari Web UI](../hdinsight-hadoop-manage-ambari.md).

Available memory to ML Services can be changed by using Hadoop switches in the call to **RxHadoopMR**:

    hadoopSwitches = "-libjars /etc/hadoop/conf -Dmapred.job.map.memory.mb=6656"  

### Scale your cluster

An existing ML Services cluster on HDInsight can be scaled up or down through the portal. By scaling up, you gain additional capacity for larger processing tasks. You can scale back a cluster when it's idle. For instructions about how to scale a cluster, see [Manage HDInsight clusters](../hdinsight-administer-use-portal-linux.md).

### Maintain the system

OS Maintenance is done on the underlying Linux VMs in an HDInsight cluster during off-hours. Typically, maintenance is done at 3:30 AM (VM's local time) every Monday and Thursday. Updates don't impact more than a quarter of the cluster at a time.

Running jobs might slow down during maintenance. However, they should still run to completion. Any custom software or local data that you've is preserved across these maintenance events unless a catastrophic failure occurs that requires a cluster rebuild.

## IDE options for ML Services on HDInsight

The Linux edge node of an HDInsight cluster is the landing zone for R-based analysis. Recent versions of HDInsight provide a browser-based IDE of RStudio Server on the edge node. RStudio Server is more productive than the R console for development and execution.

A desktop IDE can access the cluster through a remote MapReduce or Spark compute context. Options include: Microsoft's [R Tools for Visual Studio](https://marketplace.visualstudio.com/items?itemName=MikhailArkhipov007.RTVS2019) (RTVS), RStudio, and Walware's Eclipse-based StatET.

Access the R console on the edge node by typing **R** at the command prompt. When using the console interface, it's convenient to develop R script in a text editor. Then cut and paste sections of your script into the R console as needed.

## Pricing

The prices associated with an ML Services HDInsight cluster are structured similarly to other HDInsight cluster types. They're based on the sizing of the underlying VMs across the name, data, and edge nodes. Core-hour uplifts as well. For more information, see [HDInsight pricing](https://azure.microsoft.com/pricing/details/hdinsight/).

## Next steps

To learn more about how to use ML Services on HDInsight clusters, see the following articles:

* [Execute an R script on an ML Services cluster in Azure HDInsight using RStudio Server](machine-learning-services-quickstart-job-rstudio.md)
* [Compute context options for ML Services cluster on HDInsight](r-server-compute-contexts.md)
* [Storage options for ML Services cluster on HDInsight](r-server-storage.md)
