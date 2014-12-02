<properties urlDisplayName="Blob Storage with  Hadoop in HDInsight" pageTitle="Query big data from Hadoop-compatible Blob storage | Azure" metaKeywords="" description="HDInsight uses Hadoop-compatible Blob storage as the big data store for HDFS. Learn how to query from Blob storage, and store results of your analysis." metaCanonical="" services="storage,hdinsight" documentationCenter="" title="Query big data from Hadoop-compatible Blob storage for analysis in HDInsight" authors="jgao" solutions="" manager="paulettm" editor="mollybos" />

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="11/12/2014" ms.author="jgao" />


#Query big data from Hadoop-compatible Blob storage for analysis in HDInsight

Low-cost Blob storage is a robust, general-purpose Hadoop-compatible Azure storage solution that integrates seamlessly with HDInsight. Through a Hadoop Distributed File System (HDFS) interface, the full set of components in HDInsight can operate directly on data in Blob storage. In this tutorial, learn how to set up a container for Blob storage, and then address the data inside.

Storing data in Blob storage enables the HDInsight clusters used for computation to be safely deleted without losing user data. 

> [WACOM.NOTE]	The *asv://* syntax is not supported in HDInsight clusters version 3.0 and will not be supported in later versions. This means that any jobs submitted to an HDInsight cluster version 3.0 that explicitly use the “asv://” syntax will fail. The *wasb://* syntax should be used instead. Also, jobs submitted to any HDInsight clusters version 3.0 that are created with an existing metastore that contains explicit references to resources using the asv:// syntax will fail. These metastores will need to be recreated using the wasb:// to address resources.

> [WACOM.NOTE] HDInsight currently only supports block blobs.

> [WACOM.NOTE]
> Most HDFS commands such as <b>ls</b>, <b>copyFromLocal</b>, <b>mkdir</b>, and so on, still work as expected. Only the commands that are specific to the native HDFS implementation (which is referred to as DFS) such as <b>fschk</b> and <b>dfsadmin</b> will show different behavior on Azure Blob storage.

For information on provisioning an HDInsight cluster, see [Get Started with HDInsight][hdinsight-get-started] or [Provision HDInsight clusters][hdinsight-provision].

##In this article

* [HDInsight storage architecture](#architecture)
* [Benefits of Azure Blob storage](#benefits)
* [Prepare a container for Blob storage](#preparingblobstorage)
* [Address files in Blob storage](#addressing)
* [Access blob using PowerShell](#powershell)
* [Next steps](#nextsteps)

##<a id="architecture"></a>HDInsight storage architecture
The following diagram provides an abstract view of the HDInsight storage architecture:

![Hadoop clusters in HDInsight access and store big data in cost-effective, scalable Hadoop-compatible Azure Blob storage in the cloud.](./media/hdinsight-use-blob-storage/HDI.ASVArch.png "HDInsight Storage Architecture")
  
HDInsight provides access to the distributed file system that is locally attached to the compute nodes. This file system can be accessed using the fully qualified URI. For example: 

	hdfs://<namenodehost>/<path>

In addition, HDInsight provides the ability to access data stored in Blob storage. The syntax to access Blob storage is:

	wasb[s]://<containername>@<accountname>.blob.core.windows.net/<path>


Hadoop supports a notion of default file system. The default file system implies a default scheme and authority; it can also be used to resolve relative paths. During the HDInsight provision process, an Azure Storage account and a specific Blob storage container from that account is designated as the default file system.

In addition to this storage account, you can add additional storage accounts from either the same Azure subscription or different Azure subscriptions during the provision process. For instructions on adding additional storage accounts, see [Provision HDInsight clusters][hdinsight-provision]. 

- **Containers in the storage accounts that are connected to an  cluster:** Because the account name and key are stored in the *core-site.xml*, you have full access to the blobs in those containers.
- **Public containers or public blobs in the storage accounts that are NOT connected to an cluster:** You have read-only permission to the blobs in the containers.

	> [WACOM.NOTE]
        > Public container allows you to get a list of all blobs available in that container and get container metadata. Public blob allows  you to access the blobs only if you know the exact URL. For more information, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/dd179354.aspx">Restrict access to containers and blobs</a>.

- **Private containers in the storage accounts that are NOT connected to an cluster:** You can not access the blobs in the containers unless you define the storage account when you submit the WebHCat jobs. There is explained later in the article.


The storage accounts defined in the provision process and their keys are stored in %HADOOP_HOME%/conf/core-site.xml.  The default behavior of HDInsight is to use the storage accounts defined in the core-site.xml file. It is not recommended to edit the core-site.xml file because the cluster headnode(master) may be re-imaged or migrated at any time, and any changes to those files will be lost.

Multiple WebHCat jobs, including Hive, MapReduce, Hadoop streaming and Pig, can carry a description of storage accounts and metadata with them (It currently works for Pig with storage accounts but not for metadata.) In the [Access blob using PowerShell](#powershell) section of this article, there is a sample of this feature. For more information, see [Using an HDInsight Cluster with Alternate Storage Accounts and Metastores](http://social.technet.microsoft.com/wiki/contents/articles/23256.using-an-hdinsight-cluster-with-alternate-storage-accounts-and-metastores.aspx).

Blob storage containers store data as key/value pairs, and there is no directory hierarchy. However the "/" character can be used within the key name to make it appear as if a file is stored within a directory structure. For example, a blob's key may be *input/log1.txt*. No actual *input* directory exists, but due to the presence of the "/" character in the key name, it has the appearance of a file path.










##<a id="benefits"></a>Benefits of Azure Blob storage
The implied performance cost of not having compute and storage co-located is mitigated by the way the compute clusters are provisioned close to the storage account resources inside the Azure data center, where the high speed network makes it very efficient for the compute nodes to access the data inside Blob storage.

There are several benefits associated with storing the data in Blob storage instead of HDFS:

* **Data reuse and sharing:** The data in HDFS is located inside the compute cluster. Only the applications that have access to the compute cluster can use the data using HDFS API. The data in Blob storage can be accessed either through the HDFS APIs or through the [Blob Storage REST APIs][blob-storage-restAPI]. Thus, a larger set of applications (including other HDInsight clusters) and tools can be used to produce and consume the data.
* **Data archiving:** Storing data in Blob storage enables the HDInsight clusters used for computation to be safely deleted without losing user data. 
* **Data storage cost:** Storing data in DFS for the long term is more costly than storing the data in Blob storage, since the cost of a compute cluster is higher than the cost of a Blob storage container. In addition, because the data does not have to be reloaded for every compute cluster generation, you are saving data loading costs as well.
* **Elastic scale-out:** While HDFS provides you with a scaled-out file system, the scale is determined by the number of nodes that you provision for your cluster. Changing the scale can become a more complicated process than relying on the Blob storage's elastic scaling capabilities that you get automatically.
* **Geo-replication:** Your Blob storage containers can be geo-replicated through the Azure Portal. While this gives you geographic recovery and data redundancy, a fail-over to the geo-replicated location will severely impact your performance and may incur additional costs. So our recommendation is to choose the geo-replication wisely and only if the value of the data is worth the additional cost.

Certain MapReduce jobs and packages may create intermediate results that you don't really want to store in the Blob storage container. In that case, you can still elect to store the data in the local HDFS. In fact, HDInsight uses DFS for several of these intermediate results in Hive jobs and other processes. 





##<a id="preparingblobstorage"></a>Prepare a container for Blob storage
To use blobs, you first create a [Azure storage account][azure-storage-create]. As part of this, you specify an Azure data center that will store the objects you create using this account. Both the cluster and the storage account must be hosted in the same data center (Hive metastore SQL database and Oozie metastore SQL database must also located in the same data center). Wherever it lives, each blob you create belongs to some container in your storage account. This container may be an existing Blob storage container created outside of HDInsight, or it may be a container that is created for an HDInsight cluster. 



###Create a Blob container for HDInsight using the Management portal

When provisioning an HDInsight cluster from Azure Management Portal, there are two options: *quick create* and *custom create*. The quick create option requires the Azure Storage account created beforehand.  For instructions, see [How to Create a Storage Account][azure-storage-create]. 

Using the quick create option, you can choose an existing storage account. The provision process creates a new container with the same name as the HDInsight cluster name. If a container with the same name already exists, <clusterName>-<x> will be used. For example, myHDIcluster-1. This container is used as the default file system.

![Using Quick Create for a new Hadoop cluster in HDInsight in the Azure portal.][img-hdi-quick-create]
 
Using the custom create, you have one of the following options for the default storage account:

- Use existing storage
- Create new storage
- Use storage from another subscription.

You also have the option to create your own Blob container or use an existing one.
 
![Option to use an existing storage account for your HDInsight cluster.][img-hdi-custom-create-storage-account]
  




### Create a container using Azure PowerShell.
[Azure PowerShell][powershell-install] can be used to create Blob containers. The following is a sample PowerShell script:

	$subscriptionName = "<SubscriptionName>"	# Azure subscription name
	$storageAccountName = "<AzureStorageAccountName>" # The storage account that you will create
	$containerName="<BlobContainerToBeCreated>" # The Blob container name that you will create

	# Connect to your Azure account and selec the current subscription
	Add-AzureAccount # The connection will expire in a few hours.
	Select-AzureSubscription $subscriptionName #only required if you have multiple subscriptions
	
	# Create a storage context object
	$storageAccountkey = get-azurestoragekey $storageAccountName | %{$_.Primary}
	$destContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey  
	
	# Create a Blob storage container
	New-AzureStorageContainer -Name $containerName -Context $destContext 


##<a id="addressing"></a>Address files in Blob storage

The URI scheme for accessing files in Blob storage is: 

	wasb[s]://<BlobStorageContainerName>@<StorageAccountName>.blob.core.windows.net/<path>


> [WACOM.NOTE] The syntax for addressing the files on storage emulator (running on HDInsight emulator) is <i>wasb://&lt;ContainerName&gt;@storageemulator</i>.



The URI scheme provides both unencrypted access with the *wasb:* prefix, and SSL encrypted access with *wasbs*. We recommend using *wasbs* wherever possible, even when accessing data that lives inside the same Azure data center.
	
The &lt;BlobStorageContainerName&gt; identifies the name of the Blob storage container.
The &lt;StorageAccountName&gt; identifies the Azure storage account name. A fully qualified domain name (FQDN) is required.
	
If neither &lt;BlobStorageContainerName&gt; nor &lt;StorageAccountName&gt; has been specified, then the default file system is used. For the files on the default file system, you can use either relative path or absolute path. For example, the hadoop-mapreduce-examples.jar file that comes with HDInsight clusters can be referred to using one of the following:

	wasb://mycontainer@myaccount.blob.core.windows.net/example/jars/hadoop-mapreduce-examples.jar
	wasb:///example/jars/hadoop-mapreduce-examples.jar
	/example/jars/hadoop-mapreduce-examples.jar
	
> [WACOM.NOTE] The file name is <i>hadoop-examples.jar</i> on HDInsight clusters version 1.6 and 2.1.


The &lt;path&gt; is the file or directory HDFS path name. Since Blob storage containers are just a key-value store, there is no true hierarchical file system. A "/" inside a blob key is interpreted as a directory separator. For example, the blob name for *hadoop-mapreduce-examples.jar* is:

	example/jars/hadoop-mapreduce-examples.jar
	

##<a id="powershell"></a>Access blob using Azure PowerShell

See [Install and configure Azure PowerShell][powershell-install] for information on installing and configuring Azure PowerShell on your workstation. You can use Azure PowerShell console window or PowerShell_ISE to run PowerShell cmdlets. 

Use the following command to list the blob related cmdlets:

	Get-Command *blob*

![List of Blob-related PowerShell cmdlets.][img-hdi-powershell-blobcommands]


**PowerShell sample for uploading a file**

See [Upload data to HDInsight][hdinsight-upload-data].

**PowerShell sample for downloading a file**

The following scrip downloads a block blob to the current folder. Before running the script, change the directory to a folder where you have write permission. 


	$storageAccountName = "<AzureStorageAccountName>"   # The storage account used for the default file system specified at provision.
	$containerName = "<BlobStorageContainerName>"  # The default file system container has the same name as the cluster.
	$blob = "example/data/sample.log" # The name of the blob to be downloaded.
	
	# Use Add-AzureAccount if you haven't connected to your Azure subscription
	#Add-AzureAccount # The connection is good for 12 hours
	
	# Use these two commands if you have multiple subscriptions
	#$subscriptionName = "<SubscriptionName>"       
	#Select-AzureSubscription $subscriptionName
	
	Write-Host "Create a context object ... " -ForegroundColor Green
	$storageAccountKey = Get-AzureStorageKey $storageAccountName | %{ $_.Primary }
	$storageContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey  
	
	Write-Host "Download the blob ..." -ForegroundColor Green
	Get-AzureStorageBlobContent -Container $ContainerName -Blob $blob -Context $storageContext -Force
	
	Write-Host "List the downloaded file ..." -ForegroundColor Green
	cat "./$blob"

**PowerShell sample for deleting a file**

The following script shows how to delete a file.
	$storageAccountName = "<AzureStorageAccountName>"   # The storage account used for the default file system specified at provision.
	$containerName = "<BlobStorageContainerName>"  # The default file system container has the same name as the cluster.
	$blob = "example/data/sample.log" # The name of the blob to be downloaded.
	
	# Use Add-AzureAccount if you haven't connected to your Azure subscription
	#Add-AzureAccount # The connection is good for 12 hours
	
	# Use these two commands if you have multiple subscriptions
	#$subscriptionName = "<SubscriptionName>"       
	#Select-AzureSubscription $subscriptionName
	
	Write-Host "Create a context object ... " -ForegroundColor Green
	$storageAccountKey = Get-AzureStorageKey $storageAccountName | %{ $_.Primary }
	$storageContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey  
	
	Write-Host "Delete the blob ..." -ForegroundColor Green
	Remove-AzureStorageBlob -Container $containerName -Context $storageContext -blob $blob 
	

**PowerShell sample for listing files in a folder**

The following script shows how to list files inside a "folder". The next sample shows how to use the Invoke-Hive cmdlet to execute the dfs ls command to list a folder.

	$storageAccountName = "<AzureStorageAccountName>"   # The storage account used for the default file system specified at provision.
	$containerName = "<BlobStorageContainerName>"  # The default file system container has the same name as the cluster.
	$blobPrefix = "example/data/"
	
	# Use Add-AzureAccount if you haven't connected to your Azure subscription
	#Add-AzureAccount # The connection is good for 12 hours
	
	# Use these two commands if you have multiple subscriptions
	#$subscriptionName = "<SubscriptionName>"       
	#Select-AzureSubscription $subscriptionName
	
	Write-Host "Create a context object ... " -ForegroundColor Green
	$storageAccountKey = Get-AzureStorageKey $storageAccountName | %{ $_.Primary }
	$storageContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey  

	Write-Host "List the files in $blobPrefix ..."
	Get-AzureStorageBlob -Container $containerName -Context $storageContext -prefix $blobPrefix

**PowerShell sample for accessing an undefined storage account**
	
This sample shows how to list a folder from storage account that is not defined during the provision process.
	$clusterName = "<HDInsightClusterName>"
	
	$undefinedStorageAccount = "<UnboundedStorageAccountUnderTheSameSubscription>"
	$undefinedContainer = "<UnboundedBlobContainerAssociatedWithTheStorageAccount>"
	
	$undefinedStorageKey = Get-AzureStorageKey $undefinedStorageAccount | %{ $_.Primary }
	
	Use-AzureHDInsightCluster $clusterName
	
	$defines = @{}
	$defines.Add("fs.azure.account.key.$undefinedStorageAccount.blob.core.windows.net", $undefinedStorageKey)

	Invoke-Hive -Defines $defines -Query "dfs -ls wasb://$undefinedContainer@$undefinedStorageAccount.blob.core.windows.net/;"
 
##<a id="nextsteps"></a>Next steps

In this article, you learned how to use Blob storage with HDInsight and that Blob storage is a fundamental component of HDInsight. This allows you to build scalable, long-term archiving data acquisition solutions with Azure Blob storage and use HDInsight to unlock the information inside the stored data.

To learn more, see the following articles:

* [Get Started with Azure HDInsight][hdinsight-get-started]
* [Upload data to HDInsight][hdinsight-upload-data]
* [Use Hive with HDInsight][hdinsight-use-hive]
* [Use Pig with HDInsight][hdinsight-use-pig]

[Powershell-install]: ../install-configure-powershell/
[hdinsight-provision]: ../hdinsight-provision-clusters/
[hdinsight-get-started]: ../hdinsight-get-started/
[hdinsight-upload-data]: ../hdinsight-upload-data/
[hdinsight-use-hive]: ../hdinsight-use-hive/
[hdinsight-use-pig]: ../hdinsight-use-pig/

[Powershell-install]: ../install-configure-powershell/
[blob-storage-restAPI]: http://msdn.microsoft.com/en-us/library/windowsazure/dd135733.aspx
[azure-storage-create]: ../storage-create-storage-account/

[img-hdi-powershell-blobcommands]: ./media/hdinsight-use-blob-storage/HDI.PowerShell.BlobCommands.png 
[img-hdi-quick-create]: ./media/hdinsight-use-blob-storage/HDI.QuickCreateCluster.png
[img-hdi-custom-create-storage-account]: ./media/hdinsight-use-blob-storage/HDI.CustomCreateStorageAccount.png  
