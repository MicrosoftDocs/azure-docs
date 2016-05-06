<properties 
	pageTitle="Use Resource Manager to allocate resources to the Apache Spark cluster in HDInsight| Microsoft Azure" 
	description="Learn how to use the Resource Manager for Spark clusters on HDInsight for better performance." 
	services="hdinsight" 
	documentationCenter="" 
	authors="nitinme" 
	manager="paulettm" 
	editor="cgronlun"
	tags="azure-portal"/>

<tags 
	ms.service="hdinsight" 
	ms.workload="big-data" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="12/22/2015" 
	ms.author="nitinme"/>


# Manage resources for the Apache Spark cluster in Azure HDInsight (Windows)

> [AZURE.NOTE] HDInsight now provides Spark clusters on Linux. For information on how to manage resources for a Spark cluster on HDInsight Linux, see [Manage resources for the Apache Spark cluster in Azure HDInsight (Linux)](hdinsight-apache-spark-resource-manager.md).

Resource manager is a component of the Spark cluster dashboard that enables you to manage resources such as cores and RAM used by each application running on the cluster.

## <a name="launchrm"></a>How do I launch the Resource Manager?

1. From the [Azure Portal](https://ms.portal.azure.com/), from the startboard, click the tile for your Spark cluster (if you pinned it to the startboard). You can also navigate to your cluster under **Browse All** > **HDInsight Clusters**. 
 
2. From the Spark cluster blade, click **Dashboard**. When prompted, enter the admin credentials for the Spark cluster.

	![Launch Resource Manager](./media/hdinsight-apache-spark-resource-manager-v1/hdispark.cluster.launch.dashboard.png "Start Resource Manager")   

##<a name="scenariosrm"></a>How do I fix these issues using the Resource Manager?

Here are some common scenarios that you might run into with your Spark cluster, and the instructions on how to address those using the Resource Manager.

### My Spark cluster on HDInsight is slow

Apache Spark cluster in HDInsight is designed for multi-tenancy, so resources are split across multiple components (notebooks, job server, etc). This allows you to use all Spark components concurrently without worrying about any component not able to get resources to run, but each component will be slower since resources are fragmented.  This can be adjusted based on your needs. 


### I only use the Jupyter notebook with the Spark cluster. How can I allocate all resources to it?

1. From the **Spark Dashboard**, click the **Spark UI** tab to find out the maximum number of cores and the maximum RAM that you can allocate to the applications.

	![Resource allocation](./media/hdinsight-apache-spark-resource-manager-v1/hdispark.ui.resource.png "Find resources allocated to a Spark cluster")

	Going by the screen capture above, the maximum cores that you can allocate is 7 (total 8 cores of which 1 is in use), and the maximum RAM that you can allocate is 9GB (total 12GB RAM, of which 2GB must be set aside for system use and 1GB that is in use by other applications).

	You should also factor any applications that are running. You can look at the running applications from the **Spark UI** tab.

	![Running applications](./media/hdinsight-apache-spark-resource-manager-v1/hdispark.ui.running.apps.png "Applications running on the cluster")

	
2. From the HDInsight Spark Dashboard, click the **Resource Manager** tab and specify the values for **Default application core count** and **Default executor memory per worker node**. Set other properties to 0.

	![Resource allocation](./media/hdinsight-apache-spark-resource-manager-v1/hdispark.ui.allocate.resources.png "Allocate resources to your applications")

### I do not use BI tools with the Spark cluster. How can I take resources back? 

Specify thrift server core Count and thrift Server executor memory as 0. With no core or memory allocated, the thrift server will go into a **WAITING** state.

![Resource allocation](./media/hdinsight-apache-spark-resource-manager-v1/hdispark.ui.no.thrift.png "No resources to the thrift server")

##<a name="seealso"></a>See also

* [Overview: Apache Spark on Azure HDInsight](hdinsight-apache-spark-overview-v1.md)
* [Create a Spark on HDInsight cluster](hdinsight-apache-spark-provision-clusters.md)
* [Perform interactive data analysis using Spark in HDInsight with BI tools](hdinsight-apache-spark-use-bi-tools-v1.md)
* [Use Spark in HDInsight for building machine learning applications](hdinsight-apache-spark-ipython-notebook-machine-learning-v1.md)
* [Use Spark in HDInsight for building real-time streaming applications](hdinsight-apache-spark-csharp-apache-zeppelin-eventhub-streaming.md)


[hdinsight-versions]: hdinsight-component-versioning.md
[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-storage]: hdinsight-hadoop-use-blob-storage.md


[azure-purchase-options]: http://azure.microsoft.com/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[azure-management-portal]: https://manage.windowsazure.com/
[azure-create-storageaccount]: storage-create-storage-account.md
