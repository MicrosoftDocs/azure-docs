<properties linkid="manage-services-hdinsight-administer-hdinsight-using-powershell" urlDisplayName="HDInsight Administration" pageTitle="Administer HDInsight using PowerShell - Windows Azure" metaKeywords="hdinsight, hdinsight administration, hdinsight administration azure" description="Learn how to perform administrative tasks for the HDInsight clusters using PowerShell." umbracoNaviHide="0" disqusComments="1" writer="jgao" editor="cgronlun" manager="paulettm" title="Administer HDInsight using PowerShell" />

# Administer HDInsight using PowerShell

Windows Azure PowerShell is a powerful scripting environment that you can use to control and automate the deployment and management of your workloads in Windows Azure. In this article, you will learn how to manage HDInsight clusters using a local Windows Azure PowerShell console through the use of Windows PowerShell. For the list of the HDInsight PowerShell cmdlets, see [HDInsight cmdlet reference][hdinsight-powershell-reference].

**Prerequisites:**

Before you begin this article, you must have the following:

- A Windows Azure subscription. Windows Azure is a subscription-based platform. The HDInsight PowerShell cmdlets perform the tasks with your subscription. For more information about obtaining a subscription, see [Purchase Options][azure-purchase-options], [Member Offers][azure-member-offers], or [Free Trial][azure-free-trial].

- Install and configure PowerShell for HDInsight. For the detailed instructions, see [Install and configure PowerShell for HDInsight][hdinsight-configure-powershell].

			
	

## In this article

* [Provision a cluster](#provision)
* [List and show clusters](#listshow)
* [Delete a cluster](#delete)
* [Submit MapReduce jobs](#mapreduce)
* [Submit Hive jobs](#hive)
* [Upload data to the Blob storage](#upload)
* [Download MapReduce output data from the Blob storage](#download)


##<a id="provision"></a> Provision an HDInsight cluster
HDInsight uses a Windows Azure Blob Storage container as the default file system. A Windows Azure storage account and storage container are required before you can create an HDInsight cluster. 


**To create a Windows Azure storage account**

After you have imported the publishsettings file, you can use the following command to create a storage account:

	# Create a Azure storage account
	$storageAccountName = "<StorageAcccountName>"
	$location = "<Microsoft data center>"           # For example, "West US"

	New-AzureStorageAccount -StorageAccountName $storageAccountName -Location $location

<div class="dev-callout">??
<b>Important</b>??
<p>The storage account must be located in the same data center as the HDInsight Cluster. Currently, you can only provision HDInsight clusters in the following data centers:</p>

<ul>
<li>US East</li>
<li>US West</li>
<li>Europe North</li>
</ul>
</div>

For information on creating a Windows Azure storage account using the management portal, see [How to Create a Storage Account](/en-us/manage/services/storage/how-to-create-a-storage-account/).

If you have already had a storage account but do not know the account name and account key, you can use the following commands to retrieve the information:

	# List storage accounts for the current subscription
	Get-AzureStorageAccount
	# List the keys for a storage account
	Get-AzureStorageKey "<StorageAccountName>"

For details on getting the information using the management portal, see the *How to: View, copy and regenerate storage access keys* section of [How to Manage Storage Accounts](/en-us/manage/services/storage/how-to-manage-a-storage-account/).

**To create Windows Azure storage container**

PowerShell can not create a Blob container during the HDInsight provision process. You can create one using the following script:

	$storageAccountName = "<StorageAccountName>"
	$storageAccountKey = "<StorageAccountKey>"
	$containerName="<ContainerName>"

	# Create a storage context object
	$destContext = New-AzureStorageContext -StorageAccountName $storageAccountName 
	                                       -StorageAccountKey $storageAccountKey  
	
	# Create a Blob storage container
	New-AzureStorageContainer -Name $containerName -Context $destContext

**To provision a cluster**

Once you have the storage account and the blob container prepared, you are ready to create a cluster. In this version you need to explicitly specify subscription information and certificate for cmdlets.   
		
	$subscriptionName = "<SubscriptionName>"
	$storageAccountName = "<StorageAccountName>"
	$containerName = "<ContainerName>"

	$clusterName = "<HDInsightClusterName>"
	$location = "<MicrosoftDataCenter>"
	$clusterNodes = <ClusterSizeInNodes>

	# Get the storage account key
	Select-AzureSubscription $subscriptionName
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

	Get-AzureHDInsightCluster -Name $clusterName 

##<a id="delete"></a> Delete a cluster
Use the following command to delete a cluster:

	Remove-AzureHDInsightCluster -Name $clusterName 


##<a id="mapreduce"></a> Submit MapReduce jobs
The HDInsight cluster distribution comes with some MapReduce samples. One of the samples is for counting word frequencies in source files.

**To submit a MapReduce job**

The following PowerShell script submits the word count sample job: 
	
	$subscriptionName = "<SubscriptionName>"   
	$clusterName = "<HDInsightClusterName>"            
	
	# Define the MapReduce job
	$wordCountJobDefinition = New-AzureHDInsightMapReduceJobDefinition -JarFile "wasb:///example/jars/hadoop-examples.jar" -ClassName "wordcount" -Arguments "wasb:///example/data/gutenberg/davinci.txt", "wasb:///example/data/WordCountOutput"
	
	# Run the job and show the standard error 
	$wordCountJobDefinition | Start-AzureHDInsightJob -Cluster $clusterName | Wait-AzureHDInsightJob -WaitTimeoutInSeconds 3600 | %{ Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $_.JobId -StandardError}
	
For information about the WASB prefix, see [Use Windows Azure Blob storage for HDInsight][hdinsight-storage].

**To download the MapReduce job output**

The following PowerShell script retrieves the MapReduce job output from the last procedure:

	$subscriptionName = "<SubscriptionName>"       
	$storageAccountName = "<StorageAccountName>"   
	$containerName = "<ContainerName>"             
		
	# Create the storage account context object
	Select-AzureSubscription $subscriptionName
	$storageAccountKey = Get-AzureStorageKey $storageAccountName | %{ $_.Primary }
	$storageContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey  
	
	# Download the output to local computer
	Get-AzureStorageBlobContent -Container $ContainerName -Blob example/data/WordCountOutput/part-r-00000 -Context $storageContext -Force
	
	# Display the output
	cat ./example/data/WordCountOutput/part-r-00000 | findstr "there"

For more information on developing and running MapReduce jobs, see [Using MapReduce with HDInsight][hdinsight-mapreduce].






































##<a id="hive"></a> Submit Hive jobs
The HDInsight cluster distribution comes with a sample Hive table called *hivesampletable*. You can use a HiveQL "show tables;" to list the Hive tables on a cluster.

**To submit a Hive job**

The following script submit a hive job to list the Hive tables:
	
	$subscriptionName = "<SubscriptionName>"     
	$clusterName = "<HDInsightClusterName>"               
	
	# HiveQL query
	$querystring = "show tables;SELECT * FROM hivesampletable WHERE Country='United Kingdom';"

	Select-AzureSubscription -SubscriptionName $subscriptionName
	Use-AzureHDInsightCluster -Name $clusterName
	
	Invoke-Hive $querystring

The Hive job will first show the Hive tables created on the cluster, and the data returned from the hivesampletable.

For more information on using Hive, see [Using Hive with HDInsight][hdinsight-hive].


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
* [Get started with Windows Azure HDInsight][hdinsight-get-started]


[azure-purchase-options]: https://www.windowsazure.com/en-us/pricing/purchase-options/
[azure-member-offers]: https://www.windowsazure.com/en-us/pricing/member-offers/
[azure-free-trial]: https://www.windowsazure.com/en-us/pricing/free-trial/

[hdinsight-get-started]: /en-us/manage/services/hdinsight/get-started-hdinsight/
[hdinsight-provision]: /en-us/manage/services/hdinsight/provision-hdinsight-clusters/
[hdinsight-submit-jobs]: /en-us/manage/services/hdinsight/submit-hadoop-jobs-programmatically/
[hdinsight-admin-portal]: /en-us/manage/services/hdinsight/howto-administer-hdinsight/
[hdinsight-admin-cli]: /en-us/manage/services/hdinsight/administer-hdinsight-using-command-line-interface/
[hdinsight-configure-powershell]: /en-us/manage/services/hdinsight/install-and-configure-powershell-for-hdinsight/
[hdinsight-storage]: /en-us/manage/services/hdinsight/howto-blob-store/
[hdinsight-mapreduce]: /en-us/manage/services/hdinsight/using-mapreduce-with-hdinsight/
[hdinsight-hive]:/en-us/manage/services/hdinsight/using-hive-with-hdinsight/
[hdinsight-upload-data]: /en-us/manage/services/hdinsight/howto-upload-data-to-hdinsight/
[hdinsight-powershell-reference]: http://msdn.microsoft.com/en-us/library/windowsazure/dn479228.aspx

[image-hdi-ps-provision]: ./media/hdinsight-administer-use-powershell/HDI.PS.Provision.png


