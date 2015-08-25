<properties
	pageTitle="Manage Hadoop clusters in HDInsight with PowerShell | Microsoft Azure"
	description="Learn how to perform administrative tasks for the Hadoop clusters in HDInsight using Azure PowerShell."
	services="hdinsight"
	editor="cgronlun"
	manager="paulettm"
	tags="azure-portal"
	authors="mumian"
	documentationCenter=""/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/28/2015"
	ms.author="jgao"/>

# Manage Hadoop clusters in HDInsight by using Azure PowerShell

[AZURE.INCLUDE [selector](../../includes/hdinsight-portal-management-selector.md)]

Azure PowerShell is a powerful scripting environment that you can use to control and automate the deployment and management of your workloads in Azure. In this article, you will learn how to manage Hadoop clusters in Azure HDInsight by using a local Azure PowerShell console through the use of Windows PowerShell. For the list of the HDInsight PowerShell cmdlets, see [HDInsight cmdlet reference][hdinsight-powershell-reference].



**Prerequisites**

Before you begin this article, you must have the following:

- **An Azure subscription**. See [Get Azure free trial](http://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
- **A workstation with Azure PowerShell**. See [Install and use Azure PowerShell](http://azure.microsoft.com/documentation/videos/install-and-use-azure-powershell/).

	> [AZURE.NOTE] The PowerShell scripts provided in this article uses the Azure resource manager mode. To ensure the samples work for you, please download the latest Azure PowerShell using the Microsoft Web Platform Installer.  

##Provision HDInsight clusters

HDInsight clusters require a Azure Resource group and a Blob container on an Azure Storage account:

- Azure Resource group is a logical container for Azure resources. The Azure resource group and the HDInsight cluster don't have to be in the same location.  For more information, see [Using Azure PowerShell with Azure Resource Manager](powershell-azure-resource-manager.md)
- HDInsight uses a Blob container of an Azure Storage account as the default file system. An Azure Storage account and a storage container are required before you can create an HDInsight cluster. The default storage account and the HDInsight cluster have to be in the same location.

[AZURE.INCLUDE [provisioningnote](../../includes/hdinsight-provisioning.md)]

**To create an Azure resource group**

1. Ensure you are in the Azure resource mode:

		Switch-AzureMode -Name AzureResourceManager

2. Connect to you Azure account and select a subscription (in case you have multiple subscriptions).

		Add-AzureAccount
		Select-AzureSubscription

3. Create a new resource group:

	New-AzureResourceGroup -name <AzureResourceGroupName> -Location <AzureDataCente>  # For example, "West US"

	[AZURE.INCLUDE [data center list](../../includes/hdinsight-pricing-data-centers-clusters.md)]

**To create an Azure Storage account**

	New-AzureStorageAccount -ResourceGroupName <AzureResourceGroupName> -Name <AzureStorageAccountName> -Location <AzureDataCneter> -Type <AccountType> # account type example: Standard_ZRS for zero redundancy storage

	For a full list of the storage account types, see [https://msdn.microsoft.com/en-us/library/azure/hh264518.aspx](https://msdn.microsoft.com/en-us/library/azure/hh264518.aspx).


For information on creating an Azure Storage account by using the Azure preview portal, see [Create, manage, or delete a storage account](storage-create-storage-account.md).

If you have already had a Storage account but do not know the account name and account key, you can use the following commands to retrieve the information:

	# List Storage accounts for the current subscription
	Get-AzureStorageAccount
	# List the keys for a Storage account
	Get-AzureStorageAccountKey -ResourceGroupName <AzureResourceGroupName> -name $storageAccountName <AzureStorageAccountName>

For details on getting the information by using the preview portal, see the "View, copy, and regenerate storage access keys" section of [Create, manage, or delete a storage account](storage-create-storage-account.md).

**To create an Azure storage container**

Azure PowerShell cannot create a Blob container during the HDInsight provisioning process. You can create one by using the following script:

	$resourceGroupName = "<AzureResoureGroupName>"
	$storageAccountName = "<AzureStorageAccountName>"
	$storageAccountKey = Get-AzureStorageAccountKey -ResourceGroupName $resourceGroupName -Name $storageAccountName | %{ $_.Key1 }
	$containerName="<AzureBlobContainerName>"

	# Create a storage context object
	$destContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey  

	# Create a Blob storage container
	New-AzureStorageContainer -Name $containerName -Context $destContext

**To provision a cluster**

Once you have the Storage account and the Blob container prepared, you are ready to create a cluster.

	$resourceGroupName = "<AzureResoureGroupName>"

	$storageAccountName = "<AzureStorageAccountName>"
	$containerName = "<AzureBlobContainerName>"

	$clusterName = "<HDInsightClusterName>"
	$location = "<AzureDataCenter>"
	$clusterNodes = <ClusterSizeInNodes>

	# Get the Storage account key
	$storageAccountKey = Get-AzureStorageAccountKey -ResourceGroupName $resourceGroupName -Name $storageAccountName | %{ $_.Key1 }

	# Create a new HDInsight cluster
	New-AzureHDInsightCluster -ResourceGroupName $resourceGroupName `
		-ClusterName $clusterName `
		-Location $location `
		-DefaultStorageAccountName "$storageAccountName.blob.core.windows.net" `
		-DefaultStorageAccountKey $storageAccountKey `
		-DefaultStorageContainer $containerName  `
		-ClusterSizeInNodes $clusterNodes

##List cluster details
Use the following command to list all clusters in the current subscription:

	Get-AzureHDInsightCluster

Use the following command to show details of a specific cluster in the current subscription:

	Get-AzureHDInsightCluster -ResourceGroupName <ResouceGroupName> -ClusterName <ClusterName>

##Delete clusters
Use the following command to delete a cluster:

	Remove-AzureHDInsightCluster -Name <ClusterName>



##Grant/revoke HTTP services access

HDInsight clusters have the following HTTP web services (all of these services have RESTful endpoints):

- ODBC
- JDBC
- Ambari
- Oozie
- Templeton


By default, these services are granted for access. You can revoke/grant the access. Here is a sample:

	Revoke-AzureHDInsightHttpServicesAccess -Name hdiv2 -Location "East US"

In the sample, <i>hdiv2</i> is an HDInsight cluster name.

>[AZURE.NOTE] By granting/revoking the access, you will reset the cluster user name and password.

This can also be done via the preview portal. See [Administer HDInsight by using the Azure preview portal][hdinsight-admin-portal].

##Scale clusters
The cluster scaling feature allows you to change the number of worker nodes used by a cluster that is running in Azure HDInsight without having to re-create the cluster.

>[AZURE.NOTE] Only clusters with HDInsight version 3.1.3 or higher are supported. If you are unsure of the version of your cluster, you can check the Properties page.  See [Get familiar with the cluster portal interface](hdinsight-adminster-use-management-portal/#Get-familiar-with-the-cluster-portal-interface).

The impact of changing the number of data nodes for each type of cluster supported by HDInsight:

- Hadoop

	You can seamlessly increase the number of worker nodes in a Hadoop cluster that is running without impacting any pending or running jobs. New jobs can also be submitted while the operation is in progress. Failures in a scaling operation are gracefully handled so that the cluster is always left in a functional state.

	When a Hadoop cluster is scaled down by reducing the number of data nodes, some of the services in the cluster are restarted. This causes all running and pending jobs to fail at the completion of the scaling operation. You can, however, resubmit the jobs once the operation is complete.

- HBase

	You can seamlessly add or remove nodes to your HBase cluster while it is running. Regional Servers are automatically balanced within a few minutes of completing the scaling operation. However, you can also manually balance the regional servers by logging into the headnode of cluster and running the following commands from a command prompt window:

		>pushd %HBASE_HOME%\bin
		>hbase shell
		>balancer

	For more information on using the HBase shell, see []
- Storm

	You can seamlessly add or remove data nodes to your Storm cluster while it is running. But after a successful completion of the scaling operation, you will need to rebalance the topology.

	Rebalancing can be accomplished in two ways:

	* Storm web UI
	* Command-line interface (CLI) tool

	Please refer to the [Apache Storm documentation](http://storm.apache.org/documentation/Understanding-the-parallelism-of-a-Storm-topology.html) for more details.

	The Storm web UI is available on the HDInsight cluster:

	![hdinsight storm scale rebalance](./media/hdinsight-administer-use-management-portal/hdinsight.portal.scale.cluster.storm.rebalance.png)

	Here is an example how to use the CLI command to rebalance the Storm topology:

		## Reconfigure the topology "mytopology" to use 5 worker processes,
		## the spout "blue-spout" to use 3 executors, and
		## the bolt "yellow-bolt" to use 10 executors

		$ storm rebalance mytopology -n 5 -e blue-spout=3 -e yellow-bolt=10

To change the Hadoop cluster size by using Azure PowerShell, run the following command from a client machine:

	Set-AzureHDInsightClusterSize -Name <ClusterName> -ClusterSizeInNodes <NewSize>



##Submit MapReduce jobs
The HDInsight cluster distribution comes with some MapReduce samples. One of the samples is for counting word frequencies in source files.

**To submit a MapReduce job**

The following Azure PowerShell script submits the word-count sample job:

	$clusterName = "<HDInsightClusterName>"

	# Define the MapReduce job
	$wordCountJobDefinition = New-AzureHDInsightMapReduceJobDefinition -JarFile "wasb:///example/jars/hadoop-mapreduce-examples.jar" -ClassName "wordcount" -Arguments "wasb:///example/data/gutenberg/davinci.txt", "wasb:///example/data/WordCountOutput"

	# Run the job and show the standard error
	$wordCountJobDefinition | Start-AzureHDInsightJob -Cluster $clusterName | Wait-AzureHDInsightJob -WaitTimeoutInSeconds 3600 | %{ Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $_.JobId -StandardError}

For information about the **wasb** prefix, see [Use Azure Blob storage for HDInsight][hdinsight-storage].

**To download the MapReduce job output**

The following Azure PowerShell script retrieves the MapReduce job output from the last procedure:

	$storageAccountName = "<StorageAccountName>"
	$containerName = "<ContainerName>"

	# Create the Storage account context object
	$storageAccountKey = Get-AzureStorageKey $storageAccountName | %{ $_.Primary }
	$storageContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey  

	# Download the output to local computer
	Get-AzureStorageBlobContent -Container $ContainerName -Blob example/data/WordCountOutput/part-r-00000 -Context $storageContext -Force

	# Display the output
	cat ./example/data/WordCountOutput/part-r-00000 | findstr "there"

For more information on developing and running MapReduce jobs, see [Using MapReduce with HDInsight][hdinsight-use-mapreduce].






































##Submit Hive jobs
The HDInsight cluster distribution comes with a sample Hive table called *hivesampletable*. You can use a HiveQL **SHOW TABLES** command to list the Hive tables on a cluster.

**To submit a Hive job**

The following script submits a Hive job to list the Hive tables:

	$clusterName = "<HDInsightClusterName>"

	# HiveQL query
	$querystring = @"
		SHOW TABLES;
		SELECT * FROM hivesampletable
			WHERE Country='United Kingdom'
			LIMIT 10;
	"@

	Use-AzureHDInsightCluster -Name $clusterName
	Invoke-Hive $querystring

The Hive job will first show the Hive tables created on the cluster, and the data returned from the hivesampletable table.

For more information on using Hive, see [Using Hive with HDInsight][hdinsight-use-hive].


##Upload data to Azure Blob storage
See [Upload data to HDInsight][hdinsight-upload-data].

##Download job output from Azure Blob storage
See the [Submit MapReduce jobs](#mapreduce) section in this article.

## See Also
* [HDInsight cmdlet reference documentation][hdinsight-powershell-reference]
* [Administer HDInsight by using the Azure preview portal][hdinsight-admin-portal]
* [Administer HDInsight using a command-line interface][hdinsight-admin-cli]
* [Provision HDInsight clusters][hdinsight-provision]
* [Upload data to HDInsight][hdinsight-upload-data]
* [Submit Hadoop jobs programmatically][hdinsight-submit-jobs]
* [Get started with Azure HDInsight][hdinsight-get-started]


[azure-purchase-options]: http://azure.microsoft.com/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/

[hdinsight-get-started]: ../hdinsight-get-started.md
[hdinsight-provision]: hdinsight-provision-clusters.md
[hdinsight-provision-custom-options]: hdinsight-provision-clusters.md#configuration
[hdinsight-submit-jobs]: hdinsight-submit-hadoop-jobs-programmatically.md

[hdinsight-admin-cli]: hdinsight-administer-use-command-line.md
[hdinsight-admin-portal]: hdinsight-administer-use-management-portal.md
[hdinsight-storage]: ../hdinsight-use-blob-storage.md
[hdinsight-use-hive]: hdinsight-use-hive.md
[hdinsight-use-mapreduce]: hdinsight-use-mapreduce.md
[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-flight]: hdinsight-analyze-flight-delay-data.md

[hdinsight-powershell-reference]: https://msdn.microsoft.com/library/dn858087.aspx

[powershell-install-configure]: ../install-configure-powershell.md

[image-hdi-ps-provision]: ./media/hdinsight-administer-use-powershell/HDI.PS.Provision.png
