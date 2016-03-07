<properties
   	pageTitle="Linux tutorial: Get started with Hadoop and Hive | Microsoft Azure"
   	description="Follow this Linux tutorial to get started using Hadoop in HDInsight. Learn how to provision Linux clusters, and query data with Hive."
   	services="hdinsight"
   	documentationCenter=""
   	authors="mumian"
   	manager="paulettm"
   	editor="cgronlun"
	tags="azure-portal"/>

<tags
   	ms.service="hdinsight"
   	ms.devlang="na"
   	ms.topic="hero-article"
   	ms.tgt_pltfrm="na"
   	ms.workload="big-data"
   	ms.date="03/03/2016"
   	ms.author="jgao"/>

# Hadoop tutorial: Get started using Linux-based Hadoop in HDInsight

> [AZURE.SELECTOR]
- [Windows](hdinsight-hadoop-tutorial-get-started-windows.md)
- [Linux](hdinsight-hadoop-linux-tutorial-get-started.md)

Learn how to create Linux-based Hadoop clusters in HDInsight, and how to run Hive jobs using the Ambari Hive view.

If you are new to Hadoop and big data, you can read more about the terms: [Apache Hadoop](http://go.microsoft.com/fwlink/?LinkId=510084), [MapReduce](http://go.microsoft.com/fwlink/?LinkId=510086), [Hadoop Distributed File System (HDFS)](http://go.microsoft.com/fwlink/?LinkId=510087), and [Hive](http://go.microsoft.com/fwlink/?LinkId=510085). To understand how HDInsight enables Hadoop in Azure, see [Introduction to Hadoop in HDInsight](hdinsight-hadoop-introduction.md).

### Prerequisites

Before you begin this tutorial, you must have:

- **Azure subscription**: To create a free trial account, browse to [azure.microsoft.com/free](https://azure.microsoft.com/free).

## Create cluster

Most of Hadoop jobs are batch jobs. You create a cluster, run some jobs, and then delete the cluster. In this section, you will create a Linux-based Hadoop cluster in HDInsight using [Azure ARM template](../resource-group-template-deploy.md). ARM template is fully customizable; it makes easy to create Azure resources like HDInsight. Azure ARM template experience is not required for following this tutorial. For other cluster creation methods and understanding the properties used in this tutorial, see [Create HDInsight clusters](hdinsight-hadoop-provision-linux-clusters.md). For more information about using ARM template to create Hadoop clusters in HDInsight, see [Create Hadoop clusters in HDInsight using ARM templates](hdinsight-hadoop-create-windows-clusters-arm-templates.md). The ARM template used in this tutorial is located in a public blob container, *https://hditutorialdata.blob.core.windows.net/armtemplates/create-linux-based-hadoop-cluster-in-hdinsight.json*. 

1. Click the following image to open the ARM template in the Azure Portal. 

    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fhditutorialdata.blob.core.windows.net%2Farmtemplates%2Fcreate-linux-based-hadoop-cluster-in-hdinsight.json" target="_blank"><img src="https://acom.azurecomcdn.net/80C57D/cdn/mediahandler/docarticles/dpsmedia-prod/azure.microsoft.com/en-us/documentation/articles/hdinsight-hbase-tutorial-get-started-linux/20160201111850/deploy-to-azure.png" alt="Deploy to Azure"></a>

2. From the **Parameters** blade, enter the following:

    - **ClusterName**: Enter a name for the Hadoop cluster that you will create.
    - **Cluster login name and password**: The default login name is **admin**.
    - **SSH username and password**: The default username is **sshuser**.  You can rename it. 
    
    Other parameters are optional. You can leave them as they are. 
    
    Each cluster has an Azure Blob storage account dependency. After you delete a cluster, the data retains in the storage account. The cluster default storage account name is the cluster name with "store" appended. It is hardcoded in the template variables section.
    
3. Click **OK** to save the parameters.
4. From the **Custom deployment** blade, click **Resource group** dropdown box, and then click **New** to create a new resource group.  The resource group is a container that groups the cluster, the dependent storage account and other linked resource. The resource group location can be different from the cluster location.
5. Click **Legal terms**, and then click **Create**.
6. Verify the **Pin to dashboard** checkbox is selected, and then click **Create**. You will see a new tile titled **Submitting deployment for Template deployment**. It takes about around 20 minutes to create a cluster. Once the cluster is created, you can click the cluster blade in the portal to open it.

After you complete the tutorial, you might want to delete the cluster. With HDInsight, your data is stored in Azure Storage, so you can safely delete a cluster when it is not in use. You are also charged for an HDInsight cluster, even when it is not in use. Since the charges for the cluster are many times more than the charges for storage, it makes economic sense to delete clusters when they are not in use. For the instructions of deleting a cluster, see [Manage Hadoop clusters in HDInsight by using the Azure Portal](hdinsight-administer-use-management-portal.md#delete-clusters).

**To explore the cluster**

1. From the [portal](http://portal.azure.com), click **Microsoft Azure** on the upper left corner to open the dashboard. 
2. Double-click the tile with the cluster name to open the cluster in a blade.  This tile is created because you selected **Pin to dashboard**.
3. The **Essentials** pane list some basic information. Click **Settings** to see more properties of the cluster.

##Run Hive queries

[Apache Hive](hdinsight-use-hive.md) is the most popular tools used in HDInsight. There are many ways to run Hive jobs in HDInsight. In this tutorial, you will use the Ambari Hive view from the portal to run some Hive jobs. For other methods for submitting Hive queries, see [Use Hive in HDInsight](hdinsight-use-hive.md).

1. Browse to  **https://&lt;ClusterName>.azurehdinsight.net**, where &lt;ClusterName> is the cluster you created in the previous section to open Ambari.
2. Enter the Hadoop username and password that you specified in the previous section. The default username is **admin**.
3. Open **Hive View** as shown in the following screenshot:

    ![Selecting ambari views](./media/hdinsight-hadoop-linux-tutorial-get-started/selecthiveview.png).
4. In the __Query Editor__ section of the page, paste the following HiveQL statements into the worksheet:

		SHOW TABLES;
5. Click __Execute__. A __Query Process Results__ section should appear beneath the Query Editor and display information about the job. 

    Once the query has finished, The __Query Process Results__ section will display the results of the operation. You shall see one table called **hivesampletable**. This sample Hive table comes with all the HDInsight clusters.

    ![HDInsight Hive views](./media/hdinsight-hadoop-linux-tutorial-get-started/hiveview.png).

    
    > [AZURE.TIP] Note the __Save results__ dropdown in the upper left of the __Query Process Results__ section; you can use this to either download the results, or save them to HDInsight storage as a CSV file.
6. Repeat step 4 and step 5 to run the following query:

        SELECT * FROM hivesampletable;

After you have completed a Hive job, you can [export the results to Azure SQL database or SQL Server database](hdinsight-use-sqoop-mac-linux.md), you can also [visualize the results using Excel](hdinsight-connect-excel-power-query.md). For more information about using Hive in HDInsight, see [Use Hive and HiveQL with Hadoop in HDInsight to analyze a sample Apache log4j file](hdinsight-use-hive.md).

## Next steps

In this tutorial, you have learned how to create a Linux-based HDInsight cluster using an ARM template, and how to perform basic Hive queries.

To learn more about analyzing data with HDInsight, see the following:

- To learn more about using Hive with HDInsight, including how to perform Hive queries from Visual Studio, see [Use Hive with HDInsight][hdinsight-use-hive].

- To learn about Pig, a language used to transform data, see [Use Pig with HDInsight][hdinsight-use-pig].

- To learn about MapReduce, a way to write programs that process data on Hadoop, see [Use MapReduce with HDInsight][hdinsight-use-mapreduce].

- To learn about using the HDInsight Tools for Visual Studio to analyze data on HDInsight, see [Get started using Visual Studio Hadoop tools for HDInsight](hdinsight-hadoop-visual-studio-tools-get-started.md).

If you're ready to start working with your own data and need to know more about how HDInsight stores data or how to get data into HDInsight, see the following:

- For information on how HDInsight uses Azure blob storage, see [Use Azure Blob storage with HDInsight](hdinsight-hadoop-use-blob-storage.md).

- For information on how to upload data to HDInsight, see [Upload data to HDInsight][hdinsight-upload-data].

If you'd like to learn more about creating or managing an HDInsight cluster, see the following:

- To learn about managing your Linux-based HDInsight cluster, see [Manage HDInsight clusters using Ambari](hdinsight-hadoop-manage-ambari.md).

- To learn more about the options you can select when creating an HDInsight cluster, see [Creating HDInsight on Linux using custom options](hdinsight-hadoop-provision-linux-clusters.md).

- If you are familiar with Linux, and Hadoop, but want to know specifics about Hadoop on the HDInsight, see [Working with HDInsight on Linux](hdinsight-hadoop-linux-information.md). This provides information such as:

	* URLs for services hosted on the cluster, such as Ambari and WebHCat
	* The location of Hadoop files and examples on the local file system
	* The use of Azure Storage (WASB) instead of HDFS as the default data store


[1]: ../HDInsight/hdinsight-hadoop-visual-studio-tools-get-started.md

[hdinsight-provision]: hdinsight-provision-clusters.md
[hdinsight-admin-powershell]: hdinsight-administer-use-powershell.md
[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-use-mapreduce]: hdinsight-use-mapreduce.md
[hdinsight-use-hive]: hdinsight-use-hive.md
[hdinsight-use-pig]: hdinsight-use-pig.md

[powershell-download]: http://go.microsoft.com/fwlink/p/?linkid=320376&clcid=0x409
[powershell-install-configure]: powershell-install-configure.md
[powershell-open]: powershell-install-configure.md#Install

[img-hdi-dashboard]: ./media/hdinsight-hadoop-tutorial-get-started-windows/HDI.dashboard.png
[img-hdi-dashboard-query-select]: ./media/hdinsight-hadoop-tutorial-get-started-windows/HDI.dashboard.query.select.png
[img-hdi-dashboard-query-select-result]: ./media/hdinsight-hadoop-tutorial-get-started-windows/HDI.dashboard.query.select.result.png
[img-hdi-dashboard-query-select-result-output]: ./media/hdinsight-hadoop-tutorial-get-started-windows/HDI.dashboard.query.select.result.output.png
[img-hdi-dashboard-query-browse-output]: ./media/hdinsight-hadoop-tutorial-get-started-windows/HDI.dashboard.query.browse.output.png
[image-hdi-clusterstatus]: ./media/hdinsight-hadoop-tutorial-get-started-windows/HDI.ClusterStatus.png
[image-hdi-gettingstarted-powerquery-importdata]: ./media/hdinsight-hadoop-tutorial-get-started-windows/HDI.GettingStarted.PowerQuery.ImportData.png
[image-hdi-gettingstarted-powerquery-importdata2]: ./media/hdinsight-hadoop-tutorial-get-started-windows/HDI.GettingStarted.PowerQuery.ImportData2.png
