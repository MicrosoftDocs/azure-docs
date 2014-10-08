<properties urlDisplayName="HDInsight Administration" pageTitle="Manage Hadoop clusters in HDInsight with Azure PowerShell | Azure" metaKeywords="hdinsight, hdinsight administration, hdinsight administration azure, Hadoop, administration, administer" description="Learn how to perform administrative tasks for the Hadoop clusters in HDInsight using Azure PowerShell." services="hdinsight" umbracoNaviHide="0" disqusComments="1" editor="cgronlun" manager="paulettm" title="Manage Hadoop clusters in HDInsight using Azure PowerShell" authors="jgao" />

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="jgao" />

# Manage Hadoop clusters in HDInsight using Azure PowerShell

Azure PowerShell is a powerful scripting environment that you can use to control and automate the deployment and management of your workloads in Azure. In this article, you will learn how to manage Hadoop clusters in HDInsight using a local Azure PowerShell console through the use of Windows PowerShell. For the list of the HDInsight PowerShell cmdlets, see [HDInsight cmdlet reference][hdinsight-powershell-reference].

**Prerequisites:**

Before you begin this article, you must have the following:

- An Azure subscription. Azure is a subscription-based platform. The HDInsight PowerShell cmdlets perform the tasks with your subscription. For more information about obtaining a subscription, see [Purchase Options][azure-purchase-options], [Member Offers][azure-member-offers], or [Free Trial][azure-free-trial].

- A workstation with Azure PowerShell. For instructions, see [Install and configure Azure PowerShell][Powershell-install-configure].

			
	

## In this article

* [Provision a cluster](#provision)
* [List and show clusters](#listshow)
* [Delete a cluster](#delete)
* [Grant/Revoke HTTP services access](#httpservices)
* [Submit MapReduce jobs](#mapreduce)
* [Submit Hive jobs](#hive)
* [Upload data to the Blob storage](#upload)
* [Download MapReduce output data from the Blob storage](#download)


##<a id="provision"></a> Provision an HDInsight cluster
HDInsight uses an Azure Blob Storage container as the default file system. An Azure storage account and storage container are required before you can create an HDInsight cluster. 

[WACOM.INCLUDE [provisioningnote](../includes/hdinsight-provisioning.md)]

**To create an Azure storage account**

After you have imported the publishsettings file, you can use the following command to create a storage account:

	# Create an Azure storage account
	$storageAccountName = "<StorageAcccountName>"
	$location = "<Microsoft data center>"           # For example, "West US"

	New-AzureStorageAccount -StorageAccountName $storageAccountName -Location $location

> [WACOM.NOTE] The storage account must be located in the same data center as the HDInsight Cluster. Currently, you can only provision HDInsight clusters in the following data centers:

><ul>
<li>Southeast Asia</li>
<li>North Europe</li>
<li>West Europe</li>
<li>East US</li>
<li>West US</li>
</ul>



For information on creating an Azure storage account using the management portal, see [How to Create a Storage Account](../storage-create-storage-account/).

If you have already had a storage account but do not know the account name and account key, you can use the following commands to retrieve the information:

	# List storage accounts for the current subscription
	Get-AzureStorageAccount
	# List the keys for a storage account
	Get-AzureStorageKey <StorageAccountName>

For details on getting the information using the management portal, see the *How to: View, copy and regenerate storage access keys* section of [How to Manage Storage Accounts](../storage-manage-storage-account/).

**To create Azure storage container**

PowerShell can not create a Blob container during the HDInsight provision process. You can create one using the following script:

	$storageAccountName = "<StorageAccountName>"
	$storageAccountKey = Get-AzureStorageKey $storageAccountName | %{ $_.Primary }
	$containerName="<ContainerName>"

	# Create a storage context object
	$destContext = New-AzureStorageContext -StorageAccountName $storageAccountName 
	                                       -StorageAccountKey $storageAccountKey  
	
	# Create a Blob storage container
	New-AzureStorageContainer -Name $containerName -Context $destContext

**To provision a cluster**

Once you have the storage account and the blob container prepared, you are ready to create a cluster.    
		
	$storageAccountName = "<StorageAccountName>"
	$containerName = "<ContainerName>"

	$clusterName = "<HDInsightClusterName>"
	$location = "<MicrosoftDataCenter>"
	$clusterNodes = <ClusterSizeInNodes>

	# Get the storage account key
	$storageAccountKey = Get-AzureStorageKey $storageAccountName | %{ $_.Primary }

	# Create a new HDInsight cluster
	New-AzureHDInsightCluster -Name $clusterName -Location $location -DefaultStorageAccountName "$storageAccountName.blob.core.windows.net" -DefaultStorageAccountKey $storageAccountKey -DefaultStorageContainerName $containerName  -ClusterSizeInNodes $clusterNodes


The following screenshot shows the script execution:

![HDI.PS.Provision][image-hdi-ps-provision]




##<a id="listshow"></a> List and show cluster details
Use the following commands to list and show cluster details:

**To list all clusters in the current subscription**

	Get-AzureHDInsightCluster 

**To show details of the specific cluster in the current subscription**

	Get-AzureHDInsightCluster -Name <ClusterName> 

##<a id="delete"></a> Delete a cluster
Use the following command to delete a cluster:

	Remove-AzureHDInsightCluster -Name <ClusterName> 

##<a id="httpservice"></a> Grant/revoke HTTP services access

HDInsight clusters have the following HTTP Web services (all of these services have RESTful endpoints):

- ODBC
- JDBC
- Ambari
- Oozie
- Templeton


By default, these services are granted for access. You can revoke/grant the access.  Here is a sample:

	Revoke-AzureHDInsightHttpServicesAccess -Name hdiv2 -Location "East US"

In the sample <i>hdiv2</i> is an HDInsight cluster name.

>[WACOM.NOTE] By granting/revoking the access, you will reset the cluster user username and password.

This can also be done using the Windows Azure Management portal. See [Administer HDInsight using the Management portal][hdinsight-admin-portal].

##<a id="mapreduce"></a> Submit MapReduce jobs
The HDInsight cluster distribution comes with some MapReduce samples. One of the samples is for counting word frequencies in source files.

**To submit a MapReduce job**

The following PowerShell script submits the word count sample job: 
	
	$clusterName = "<HDInsightClusterName>"            
	
	# Define the MapReduce job
	$wordCountJobDefinition = New-AzureHDInsightMapReduceJobDefinition -JarFile "wasb:///example/jars/hadoop-examples.jar" -ClassName "wordcount" -Arguments "wasb:///example/data/gutenberg/davinci.txt", "wasb:///example/data/WordCountOutput"
	
	# Run the job and show the standard error 
	$wordCountJobDefinition | Start-AzureHDInsightJob -Cluster $clusterName | Wait-AzureHDInsightJob -WaitTimeoutInSeconds 3600 | %{ Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $_.JobId -StandardError}
	
> [WACOM.NOTE] *hadoop-examples.jar* comes with version 2.1 HDInsight clusters. The file has been renamed to *hadoop-mapreduce.jar* on version 3.0 HDInsight clusters.

For information about the WASB prefix, see [Use Azure Blob storage for HDInsight][hdinsight-
storage].

**To download the MapReduce job output**

The following PowerShell script retrieves the MapReduce job output from the last procedure:

	$storageAccountName = "<StorageAccountName>"   
	$containerName = "<ContainerName>"             
		
	# Create the storage account context object
	$storageAccountKey = Get-AzureStorageKey $storageAccountName | %{ $_.Primary }
	$storageContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey  
	
	# Download the output to local computer
	Get-AzureStorageBlobContent -Container $ContainerName -Blob example/data/WordCountOutput/part-r-00000 -Context $storageContext -Force
	
	# Display the output
	cat ./example/data/WordCountOutput/part-r-00000 | findstr "there"

For more information on developing and running MapReduce jobs, see [Using MapReduce with HDInsight][hdinsight-use-mapreduce].






































##<a id="hive"></a> Submit Hive jobs
The HDInsight cluster distribution comes with a sample Hive table called *hivesampletable*. You can use a HiveQL "show tables;" to list the Hive tables on a cluster.

**To submit a Hive job**

The following script submit a hive job to list the Hive tables:
	
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

The Hive job will first show the Hive tables created on the cluster, and the data returned from the hivesampletable.

For more information on using Hive, see [Using Hive with HDInsight][hdinsight-use-hive].


##<a id="upload"></a>Upload data to the Blob storage
See [Upload data to HDInsight][hdinsight-upload-data].

##<a id="download"></a>Download the MapReduce output from the Blob storage
See the [Submit MapReduce jobs](#mapreduce) session in this article.

## See Also
* [HDInsight Cmdlet Reference Documentation][hdinsight-powershell-reference]
* [Administer HDInsight using management portal][hdinsight-admin-portal]
* [Administer HDInsight using command-line interface][hdinsight-admin-cli]
* [Provision HDInsight clusters][hdinsight-provision]
* [Upload data to HDInsight][hdinsight-upload-data]
* [Submit Hadoop jobs programmatically][hdinsight-submit-jobs]
* [Get started with Azure HDInsight][hdinsight-get-started]


[azure-purchase-options]: http://azure.microsoft.com/en-us/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/en-us/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/en-us/pricing/free-trial/

[hdinsight-get-started]: ../hdinsight-get-started/
[hdinsight-provision]: ../hdinsight-provision-clusters/

[hdinsight-submit-jobs]: ../hdinsight-submit-hadoop-jobs-programmatically/

[hdinsight-admin-cli]: ../hdinsight-administer-use-command-line/
[hdinsight-admin-portal]: ../hdinsight-administer-use-management-portal/
[hdinsight-storage]: ../hdinsight-use-blob-storage/
[hdinsight-use-hive]: ../hdinsight-use-hive/
[hdinsight-use-mapreduce]: ../hdinsight-use-mapreduce/
[hdinsight-upload-data]: ../hdinsight-upload-data/

[hdinsight-powershell-reference]: http://msdn.microsoft.com/en-us/library/windowsazure/dn479228.aspx

[Powershell-install-configure]: ../install-configure-powershell/

[image-hdi-ps-provision]: ./media/hdinsight-administer-use-powershell/HDI.PS.Provision.png


