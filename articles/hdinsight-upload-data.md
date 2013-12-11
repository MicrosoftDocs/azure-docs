<properties linkid="manage-services-hdinsight-howto-upload-data-to-hdinsight" urlDisplayName="Upload Data" pageTitle="Upload data to HDInsight | Windows Azure" metaKeywords="" description="Learn how to upload and access data in HDInsight using Azure Storage Explorer, the interactive console, the Hadoop command line, or Sqoop." metaCanonical="" services="" documentationCenter="" title="Upload data to HDInsight" authors=""  solutions="" writer="jgao" manager="paulettm" editor="cgronlun"  />



#Upload data to HDInsight

Windows Azure HDInsight provides a full-featured Hadoop Distributed File System (HDFS) over Windows Azure Blob storage. It has been designed as an HDFS extension to provide a seamless experience to customers by enabling the full set of components in the Hadoop ecosystem to operate directly on the data it manages. Both Windows Azure Blob storage and HDFS are distinct file systems that are optimized for storage of data and computations on that data. For the benefits of using Windows Azure Blob storage, see [Use Windows Azure Blob storage with HDInsight][hdinsight-storage]. 

Windows Azure HDInsight clusters are typically deployed to execute MapReduce jobs and are dropped once these jobs have been completed. Keeping the data in the HDFS clusters after computations have been completed would be an expensive way to store this data. Windows Azure Blob storage is a highly available, highly scalable, high capacity, low cost, and shareable storage option for data that is to be processed using HDInsight. Storing data in a Blob enables the HDInsight clusters used for computation to be safely released without losing data. 

Windows Azure Blob storage can either be accessed through [AzCopy][azure-azcopy], [Windows Azure PowerShell][azure-powershell], [Windows Azure Storage Client Library for .NET][azure-storage-client-library] or through explorer tools. Here are some of the tools available:

* [Azure Storage Explorer](http://azurestorageexplorer.codeplex.com/)
* [Cloud Storage Studio 2](http://www.cerebrata.com/Products/CloudStorageStudio/)
* [CloudXplorer](http://clumsyleaf.com/products/cloudxplorer)
* [Windows Azure Explorer](http://www.cloudberrylab.com/free-microsoft-azure-explorer.aspx)
* [Windows Azure Explorer PRO](http://www.cloudberrylab.com/microsoft-azure-explorer-pro.aspx)

**Prerequisites**

Note the following requirements before you begin this article:

* A Windows Azure HDInsight cluster. For instructions, see [Get started with Windows Azure HDInsight][hdinsight-getting-started] or [Provision HDInsight clusters][hdinsight-provision].

##In this article

* [Upload data to Blob storage using AzCopy](#azcopy)
* [Upload data to Blob storage using Windows Azure PowerShell](#powershell)
* [Upload data to Blob storage using Azure Storage Explorer](#storageexplorer)
* [Upload data to Blob storage using Hadoop command line](#commandline)
* [Import data from Windows Azure SQL Database to Blob storage using Sqoop](#sqoop)
* [Access data in Blob storage](#blob)

##<a id="azcopy"></a>Upload data to Blob storage using AzCopy##

AzCopy is a command line utility which is designed to simplify the task of transferring data in to and out of a Windows Azure Storage account. You can use this as a standalone tool or incorporate this utility in an existing application. [Download AzCopy][azure-azcopy-download].

The AzCopy syntax is:

	AzCopy <Source> <Destination> [filePattern [filePattern???]] [Options]

For more information, see [AzCopy ??? Uploading/Downloading files for Windows Azure Blobs][azure-azcopy]

##<a id="powershell"></a>Upload data to Blob storage using Windows Azure PowerShell##

Windows Azure PowerShell is a powerful scripting environment that you can use to control and automate the deployment and management of your workloads in Windows Azure. You can use Windows Azure PowerShell to upload data to Blob storage, so the data can be processed by MapReduce jobs. For information on configuring your workstation to run Windows Azure PowerShell, see [Install and configure PowerShell for HDInsight][hdinsight-configure-powershell].

**To upload a local file to Blob storage**

1. Open Windows Azure PowerShell console window as instructed in [Install and configure PowerShell for HDInsight][hdinsight-configure-powershell].
2. Set the values of the first five variables in the following script:

		$subscriptionName = "<WindowsAzureSubscriptionName>"
		$storageAccountName = "<StorageAccountName>"
		$containerName = "<ContainerName>"
		
		$fileName ="<LocalFileName>"
		$blobName = "<BlobName>"
		
		# Get the storage account key
		Select-AzureSubscription $subscriptionName
		$storageaccountkey = get-azurestoragekey $storageAccountName | %{$_.Primary}
		
		# Create the storage context object
		$destContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageaccountkey
		
		# Copy the file from local workstation to the Blob container		
		Set-AzureStorageBlobContent -File $fileName -Container $containerName -Blob $blobName -context $destContext
		
3. Paste the script into the Windows Azure PowerShell console window to run it.

Blob storage containers store data as key/value pairs, and there is no directory hierarchy. However the "/" character can be used within the key name to make it appear as if a file is stored within a directory structure. For example, a blob???s key may be *input/log1.txt*. No actual "input" directory exists, but due to the presence of the "/" character in the key name, it has the appearance of a file path. In the previous script, you can give the file a folder structure by setting the $blobname variable. For example *$blobname="myfolder/myfile.txt"*.

Using Windows Azure Explorer tools, you may notice some 0 byte files. These files serve two purposes:

- In case of empty folders, they serve as a marker of the existence of the folder. Blob storage is clever enough to know that if a blob exists called foo/bar then there is a folder called foo. But if you want to have an empty folder called foo, then the only way to signify that is by having this special 0 byte file in place.
- They hold some special metadata needed by the Hadoop file system, notably the permissions and owners for the folders.








##<a id="storageexplorer"></a>Upload data to Blob storage using Azure Storage Explorer

*Azure Storage Explorer* is a useful tool for inspecting and altering the data in your Windows Azure Storage. It is a free tool that can be downloaded from [http://azurestorageexplorer.codeplex.com/](http://azurestorageexplorer.codeplex.com/ "Azure Storage Explorer").

Before using the tool, you must know your Windows Azure storage account name and account key. For instructions on getting this information, see the "How to: View, copy and regenerate storage access keys" section of [Manage storage accounts][azure-storage-account].  

1. Run Azure Storage Explorer.

	![HDI.AzureStorageExplorer][image-azure-storage-explorer]

2. Click **Add Account**. After an account is added to Azure Storage Explorer, you don't need to go through this step again. 

	![HDI.ASEAddAccount][image-ase-addaccount]

3. Enter **Storage account name** and **Storage account key**, and then click **Add Storage Account**. You can add multiple storage accounts, and each account will be displayed on a tab. 
4. Under **Storage Type**, click **Blobs**.

	![HDI.ASEBlob][image-ase-blob]

5. From **Container**, click the container that is associated to your HDInsight cluster. When you create an HDInsight cluster, you must specify a container.  Otherwise, the cluster creation process creates one for you.
6. Under **Blob**, click **Upload**.
7. Specify a file to upload, and then click **Open**.








































































##<a id="commandline"></a> Upload data to Blob storage using Hadoop Command Line

To use Hadoop command line, you must first connect to the cluster using remote desktop. 



1. Sign in to the [Management Portal][azure-management-portal].
2. Click **HDINSIGHT**. You will see a list of deployed Hadoop clusters.
3. Click the HDInsight cluster where you want to upload data.
4. Click **CONFIGURATION** from the top of the page.
5. Click **ENABLE REMOTE** if you haven't enabled remote desktop, and follow the instructions.  Otherwise, skip to the next step.
4. Click **CONNECT** on the bottom of the page.
7. Click **Open**.
8. Enter your credentials, and then click **OK**.
9. Click **Yes**.
10. From the desktop, click **Hadoop Command Line**.
12. The following sample demonstrates how to copy the davinci.txt file from the local file system on the HDInsight head node to the /example/data directory.

		hadoop dfs -copyFromLocal C:\temp\davinci.txt /example/data/davinci.txt

	Because the default file system is on Windows Azure Blob storage, /example/datadavinci.txt is actually on Windows Azure Blob storage.  You can also refer to the file as:

		wasb:///example/data/davinci.txt 

	or

		wasbs://<ContainerName>@<StorageAccountName>.blob.core.windows.net/example/data/davinci.txt

	The fully qualified domain name is required when you use *wasbs*.

13. Use the following command to list the uploaded files:

		hadoop dfs -lsr /example/data


##<a id="sqoop"></a> Import data to HDFS from SQL Database/SQL Server using Sqoop

Sqoop is a tool designed to transfer data between Hadoop and relational databases. You can use it to import data from a relational database management system (RDBMS) such as SQL or MySQL or Oracle into the Hadoop Distributed File System (HDFS), transform the data in Hadoop with MapReduce or Hive, and then export the data back into a RDBMS. For more information, see [Sqoop User Guide][apache-sqoop-guide].

Before importing data, you must know the Windows Azure SQL Database server name, database account name, account password, and database name. You must also configure a firewall rule for the database server to allow connections from your HDInsight cluster head node. For instruction on creating SQL database and configuring firewall rules, see [How to use Windows Azure SQL Database in .NET applications][sqldatabase-howto]. To obtain the outward facing IP Address for your HDInsight cluster head node, you can use Remote Desktop to connect to the head node, and then browse to [www.whatismyip.com][whatismyip].

The following procedure uses PowerShell to submit a Sqoop job. This is only supported by version 1.2 or later HDInsight clusters.  Optionally, you can use Hadoop command line to run Sqoop commands.

**To import data to HDInsight using Sqoop and PowerShell**

1. Open Windows Azure PowerShell console window as instructed in [Install and configure PowerShell for HDInsight][hdinsight-configure-powershell].
2. Set the values of the first eight variables in the following script:

		$subscriptionName = "<WindowsAzureSubscriptionName>"
		$clusterName = "<HDInsightClusterName>"
		
		$sqlDatabaseServerName = "<SQLDatabaseServerName>"
		$sqlDatabaseUserName = "<SQLDatabaseDatabaseName>"
		$sqlDatabasePassword = "<SQLDatabasePassword>"
		$sqlDatabaseDatabaseName = "<SQLDatabaseDatabaseName>"
		$tableName = "<SQLDatabaseTableName>"
		
		$hdfsOutputDir = "<OutputPath>"  # This is the HDFS path for the output file, for example "/lineItemData".
		
		Select-AzureSubscription $subscriptionName
		Use-AzureHDInsightCluster $clusterName
		
		$sqoopDef = New-AzureHDInsightSqoopJobDefinition -Command "import --connect jdbc:sqlserver://$sqlDatabaseServerName.database.windows.net;user=$sqlDatabaseUserName@$sqlDatabaseServerName;password=$sqlDatabasePassword;database=$sqlDatabaseDatabaseName --table $tableName --target-dir $hdfsOutputDir -m 1" 

		$sqoopJob = Start-AzureHDInsightJob -Cluster $clusterName -JobDefinition $sqoopDef #-Debug -Verbose
		Wait-AzureHDInsightJob -WaitTimeoutInSeconds 3600 -Job $sqoopJob
		
		Write-Host "Standard Error" -BackgroundColor Green
		Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $sqoopJob.JobId -StandardError
		Write-Host "Standard Output" -BackgroundColor Green
		Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $sqoopJob.JobId -StandardOutput

3. Paste the script into the Windows Azure PowerShell console window to run it.
		
See [Get started with HDInsight][hdinsight-getting-started] for a PowerShell sample for retrieving the data file outputed to HDFS/WASB.

Note: When specifying an escape character as delimiter with the arguments *--input-fields-terminated-by* and *--input-fields-terminated-by*, do not put quotes around the escape character.  For example. 

		sqoop export 
			--connect "jdbc:sqlserver://localhost;username=sa;password=abc;database=AdventureWorks2012" 
			--table Result 
			--export-dir /hive/warehouse/result 
			--input-fields-terminated-by \t 
			--input-lines-terminated-by \n

##<a id="blob"></a>Access data in Blob storage

Data stored in Blob storage can be accessed directly by prefixing the protocol scheme of the URI for the assets you are accessing with *WASB://*. To secure the connection, use *WASBS://*. The scheme for accessing data in Blob storage is:

	WASB

The following is a sample PowerShell script for submitting a MapReduce job:

	$subscriptionName = "<SubscriptionName>"   
	$clusterName = "<HDInsightClusterName>" 

	# Define the MapReduce job
	$wordCountJobDefinition = New-AzureHDInsightMapReduceJobDefinition -JarFile "wasb:///example/jars/hadoop-examples.jar" -ClassName "wordcount" -Arguments "wasb:///example/data/gutenberg/davinci.txt", "wasb:///example/data/WordCountOutput"
	
	# Run the job and show the standard error 
	Select-AzureSubscription $subscriptionName
	$wordCountJobDefinition | Start-AzureHDInsightJob -Cluster $clusterName  | Wait-AzureHDInsightJob -WaitTimeoutInSeconds 3600 | %{ Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $_.JobId -StandardError}

For more information on accessing the files stored in Blob storage, see [Use Windows Azure Blob Storage with HDInsight][hdinsight-storage].

## Next steps
Now that you understand how to get data into HDInsight, use the following articles to learn how to perform analysis:

* [Get started with Windows Azure HDInsight][hdinsight-getting-started]
* [Submit Hadoop jobs programmatically][hdinsight-submit-jobs]
* [Use Hive with HDInsight][hdinsight-hive]
* [Use Pig with HDInsight][hdinsight-pig]




[azure-management-portal]: https://manage.windowsazure.com
[azure-powershell]: http://msdn.microsoft.com/en-us/library/windowsazure/jj152841.aspx
[azure-storage-client-library]: /en-us/develop/net/how-to-guides/blob-storage/
[azure-storage-account]: /en-us/manage/services/storage/how-to-manage-a-storage-account/
[azure-azcopy-download]: https://github.com/downloads/WindowsAzure/azure-sdk-downloads/AzCopy.zip
[azure-azcopy]: http://blogs.msdn.com/b/windowsazurestorage/archive/2012/12/03/azcopy-uploading-downloading-files-for-windows-azure-blobs.aspx

[hdinsight-storage]: /en-us/manage/services/hdinsight/howto-blob-store/
[hdinsight-submit-jobs]: /en-us/manage/services/hdinsight/submit-hadoop-jobs-programmatically/
[hdinsight-getting-started]: /en-us/manage/services/hdinsight/get-started-hdinsight/

[hdinsight-hive]: /en-us/manage/services/hdinsight/using-hive-with-hdinsight/
[hdinsight-pig]: /en-us/manage/services/hdinsight/using-pig-with-hdinsight/
[hdinsight-provision]: /en-us/manage/services/hdinsight/provision-hdinsight-clusters/
[hdinsight-configure-powershell]: /en-us/manage/services/hdinsight/install-and-configure-powershell-for-hdinsight/

[sqldatabase-howto]: http://www.windowsazure.com/en-us/develop/net/how-to-guides/sql-database/

[apache-sqoop-guide]: http://sqoop.apache.org/docs/1.4.2/SqoopUserGuide.html

[whatismyip]: http://www.whatismyip.com
[image-azure-storage-explorer]: ./media/hdinsight-upload-data/HDI.AzureStorageExplorer.png
[image-ase-addaccount]: ./media/hdinsight-upload-data/HDI.ASEAddAccount.png
[image-ase-blob]: ./media/hdinsight-upload-data/HDI.ASEBlob.png

