<properties 
	pageTitle="Manage Hadoop clusters in HDInsight with PowerShell | Microsoft Azure" 
	description="Learn how to perform administrative tasks for the Hadoop clusters in HDInsight using Azure PowerShell." 
	services="hdinsight" 
	editor="cgronlun" 
	manager="paulettm" 
	authors="mumian" 
	documentationCenter=""/>

<tags 
	ms.service="hdinsight" 
	ms.workload="big-data" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/29/2015" 
	ms.author="jgao"/>

# Manage Hadoop clusters in HDInsight by using Azure PowerShell


Azure PowerShell is a powerful scripting environment that you can use to control and automate the deployment and management of your workloads in Azure. In this article, you will learn how to manage Hadoop clusters in Azure HDInsight by using a local Azure PowerShell console through the use of Windows PowerShell. For the list of the HDInsight PowerShell cmdlets, see [HDInsight cmdlet reference][hdinsight-powershell-reference].

##Prerequisites

Before you begin this article, you must have the following:

- An Azure subscription. Azure is a subscription-based platform. The Azure PowerShell cmdlets for HDInsight perform the tasks by using your subscription. For more information about obtaining a subscription, see [Purchase Options] [azure-purchase-options],  [Member Offers] [azure-member-offers],  or  [Free Trial] [azure-free-trial].

- A workstation with Azure PowerShell. For instructions, see [Install and configure Azure PowerShell][powershell-install-configure].


##Provision HDInsight clusters
HDInsight uses an Azure Blob storage container as the default file system. An Azure Storage account and a storage container are required before you can create an HDInsight cluster. 

[AZURE.INCLUDE [provisioningnote](../includes/hdinsight-provisioning.md)]

**To create an Azure Storage account**

After you have imported the publishsettings file, you can use the following command to create a Storage account:

	# Create an Azure Storage account
	$storageAccountName = "<StorageAcccountName>"
	$location = "<Microsoft data center>"           # For example, "West US"

	New-AzureStorageAccount -StorageAccountName $storageAccountName -Location $location


[AZURE.INCLUDE [data center list](../includes/hdinsight-pricing-data-centers-clusters.md)]


For information on creating an Azure Storage account by using the Azure portal, see [Create, manage, or delete a storage account](../storage-create-storage-account/).

If you have already had a Storage account but do not know the account name and account key, you can use the following commands to retrieve the information:

	# List Storage accounts for the current subscription
	Get-AzureStorageAccount
	# List the keys for a Storage account
	Get-AzureStorageKey <StorageAccountName>

For details on getting the information by using the Azure portal, see the "View, copy, and regenerate storage access keys" section of [Create, manage, or delete a storage account](../storage-create-storage-account/).

**To create an Azure storage container**

Azure PowerShell cannot create a Blob container during the HDInsight provisioning process. You can create one by using the following script:

	$storageAccountName = "<StorageAccountName>"
	$storageAccountKey = Get-AzureStorageKey $storageAccountName | %{ $_.Primary }
	$containerName="<ContainerName>"

	# Create a storage context object
	$destContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey  
	
	# Create a Blob storage container
	New-AzureStorageContainer -Name $containerName -Context $destContext

**To provision a cluster**

Once you have the Storage account and the Blob container prepared, you are ready to create a cluster.    
		
	$storageAccountName = "<StorageAccountName>"
	$containerName = "<ContainerName>"

	$clusterName = "<HDInsightClusterName>"
	$location = "<MicrosoftDataCenter>"
	$clusterNodes = <ClusterSizeInNodes>

	# Get the Storage account key
	$storageAccountKey = Get-AzureStorageKey $storageAccountName | %{ $_.Primary }

	# Create a new HDInsight cluster
	New-AzureHDInsightCluster -Name $clusterName -Location $location -DefaultStorageAccountName "$storageAccountName.blob.core.windows.net" -DefaultStorageAccountKey $storageAccountKey -DefaultStorageContainerName $containerName  -ClusterSizeInNodes $clusterNodes


The following screenshot shows the script execution:

![HDI.PS.Provision][image-hdi-ps-provision]




##List cluster details
Use the following command to list all clusters in the current subscription:

	Get-AzureHDInsightCluster 

Use the following command to show details of a specific cluster in the current subscription:

	Get-AzureHDInsightCluster -Name <ClusterName> 

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

This can also be done via the Azure portal. See [Administer HDInsight by using the Azure portal][hdinsight-admin-portal].

##Scale clusters
See [Scale Hadoop clusters in HDInsight](hdinsight-hadoop-cluster-scaling.md).

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
* [Administer HDInsight by using the Azure portal][hdinsight-admin-portal]
* [Administer HDInsight using a command-line interface][hdinsight-admin-cli]
* [Provision HDInsight clusters][hdinsight-provision]
* [Upload data to HDInsight][hdinsight-upload-data]
* [Submit Hadoop jobs programmatically][hdinsight-submit-jobs]
* [Get started with Azure HDInsight][hdinsight-get-started]


[azure-purchase-options]: http://azure.microsoft.com/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/

[hdinsight-get-started]: hdinsight-get-started.md
[hdinsight-provision]: hdinsight-provision-clusters.md
[hdinsight-provision-custom-options]: hdinsight-provision-clusters.md#configuration
[hdinsight-submit-jobs]: hdinsight-submit-hadoop-jobs-programmatically.md

[hdinsight-admin-cli]: hdinsight-administer-use-command-line.md
[hdinsight-admin-portal]: hdinsight-administer-use-management-portal.md
[hdinsight-storage]: hdinsight-use-blob-storage.md
[hdinsight-use-hive]: hdinsight-use-hive.md
[hdinsight-use-mapreduce]: hdinsight-use-mapreduce.md
[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-flight]: hdinsight-analyze-flight-delay-data.md

[hdinsight-powershell-reference]: http://msdn.microsoft.com/library/windowsazure/dn479228.aspx

[powershell-install-configure]: install-configure-powershell.md

[image-hdi-ps-provision]: ./media/hdinsight-administer-use-powershell/HDI.PS.Provision.png


