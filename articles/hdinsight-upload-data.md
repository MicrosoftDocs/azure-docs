<properties
	pageTitle="Upload data for Hadoop jobs in HDInsight | Microsoft Azure"
	description="Learn how to upload and access data for Hadoop jobs in HDInsight using the Azure CLI, Azure Storage Explorer, Azure PowerShell, the Hadoop command line, or Sqoop."
	services="hdinsight,storage"
	documentationCenter=""
	authors="mumian"
	manager="paulettm"
	editor="cgronlun"/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/10/2015"
	ms.author="jgao"/>



#Upload data for Hadoop jobs in HDInsight

Azure HDInsight provides a full-featured Hadoop distributed file system (HDFS) over Azure Blob storage. It is designed as an HDFS extension to provide a seamless experience to customers. It enables the full set of components in the Hadoop ecosystem to operate directly on the data it manages. Azure Blob storage and HDFS are distinct file systems that are optimized for storage of data and computations on that data. For information about the benefits of using Azure Blob storage, see [Use Azure Blob storage with HDInsight][hdinsight-storage].

##Prerequisites

Note the following requirement before you begin:

* An Azure HDInsight cluster. For instructions, see [Get started with Azure HDInsight][hdinsight-get-started] or [Provision HDInsight clusters][hdinsight-provision].

##Why blob storage?

Azure HDInsight clusters are typically deployed to run MapReduce jobs, and the clusters are dropped after these jobs complete. Keeping the data in the HDFS clusters after computations are complete would be an expensive way to store this data. Azure Blob storage is a highly available, highly scalable, high capacity, low cost, and shareable storage option for data that is to be processed using HDInsight. Storing data in a blob enables the HDInsight clusters that are used for computation to be safely released without losing data.

###Directories

Azure Blob storage containers store data as key/value pairs, and there is no directory hierarchy. However the "/" character can be used within the key name to make it appear as if a file is stored within a directory structure. HDInsight sees these as if they are actual directories.

For example, a blob's key may be *input/log1.txt*. No actual "input" directory exists, but due to the presence of the "/" character in the key name, it has the appearance of a file path.

Because of this, if you use Azure Explorer tools you may notice some 0 byte files. These files serve two purposes:

- If there are empty folders, they mark of the existence of the folder. Azure Blob storage is clever enough to know that if a blob called foo/bar exists, there is a folder called **foo**. But the only way to signify an empty folder called **foo** is by having this special 0 byte file in place.

- They hold special metadata that is needed by the Hadoop file system, notably the permissions and owners for the folders.

##Command-line utilities

Microsoft provides the following utilities to work with Azure Blob storage:

| Tool | Linux | OS X | Windows |
| ---- |:-----:|:----:|:-------:|
| [Azure Command-Line Interface][azurecli] | ✔ | ✔ | ✔ |
| [Azure PowerShell][azure-powershell] | | | ✔ |
| [AzCopy][azure-azcopy] | | | ✔ |
| [Hadoop command](#commandline) | ✔ | ✔ | ✔ |

> [AZURE.NOTE] While the Azure CLI, Azure PowerShell, and AzCopy can all be used from outside Azure, the Hadoop command is only available on the HDInsight cluster and only allows loading data from the local file system into Azure Blob storage.

###<a id="xplatcli"></a>Azure CLI

The Azure CLI is a cross-platform tool that allows you to manage Azure services. Use the following steps to upload data to Azure Blob storage:

1. [Install and configure the Azure CLI for Mac, Linux and Windows](xplat-cli.md).

2. Open a command prompt, bash, or other shell, and use the following to authenticate to your Azure subscription.

		azure login

	When prompted, enter the user name and password for your subscription.

3. Enter the following command to list the storage accounts for your subscription:

		azure storage account list

4. Select the storage account that contains the blob you want to work with, then use the following command to retrieve the key for this account:

		azure storage account keys list <storage-account-name>

	This should return **Primary** and **Secondary** keys. Copy the **Primary** key value because it will be used in the next steps.

5. Use the following command to retrieve a list of blob containers within the storage account:

		azure storage container list -a <storage-account-name> -k <primary-key>

6. Use the following commands to upload and download files to the blob:

	* To upload a file:

			azure storage blob upload -a <storage-account-name> -k <primary-key> <source-file> <container-name> <blob-name>

	* To download a file:

			azure storage blob download -a <storage-account-name> -k <primary-key> <container-name> <blob-name> <destination-file>

> [AZURE.NOTE] If you will always be working with the same storage account, you can set the following environment variables instead of specifying the account and key for every command:
>
> * **AZURE\_STORAGE\_ACCOUNT**: The storage account name
>
> * **AZURE\_STORAGE\_ACCESS\_KEY**: The storage account key

###<a id="powershell"></a>Azure PowerShell

Azure PowerShell is a scripting environment that you can use to control and automate the deployment and management of your workloads in Azure. For information about configuring your workstation to run Azure PowerShell, see [Install and configure Azure PowerShell](powershell-install-configure.md).

**To upload a local file to Azure Blob storage**

1. Open the Azure PowerShell console as instructed in [Install and configure Azure PowerShell](powershell-install-configure.md).
2. Set the values of the first five variables in the following script:

		$subscriptionName = "<AzureSubscriptionName>"
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

3. Paste the script into the Azure PowerShell console to run it to copy the file.

For example PowerShell scripts created to work with HDInsight, see [HDInsight tools](https://github.com/blackmist/hdinsight-tools).

###<a id="azcopy"></a>AzCopy

AzCopy is a command-line tool that is designed to simplify the task of transferring data into and out of an Azure Storage account. You can use it as a standalone tool or incorporate this tool in an existing application. [Download AzCopy][azure-azcopy-download].

The AzCopy syntax is:

	AzCopy <Source> <Destination> [filePattern [filePattern...]] [Options]

For more information, see [AzCopy - Uploading/Downloading files for Azure Blobs][azure-azcopy].


###<a id="commandline"></a>Hadoop command line

The Hadoop command line is only useful for storing data into blob storage when the data is already present on the cluster head node.

In order to use the Hadoop command, you must first connect to the headnode using one of the following methods:

* **Windows-based HDInsight**: [Connect using Remote Desktop](hdinsight-administer-use-management-portal.md#connect-to-hdinsight-clusters-by-using-rdp)

* **Linux-based HDInsight**: Connect using SSH ([the SSH command](hdinsight-hadoop-linux-use-ssh-unix.md#connect-to-a-linux-based-hdinsight-cluster) or [PuTTY](hdinsight-hadoop-linux-use-ssh-windows.md#connect-to-a-linux-based-hdinsight-cluster))

Once connected, you can use the following syntax to upload a file to storage.

	hadoop -copyFromLocal <localFilePath> <storageFilePath>

For example, `hadoop fs -copyFromLocal data.txt /example/data/data.txt`

Because the default file system for HDInsight is in Azure Blob storage, /example/data.txt is actually in Azure Blob storage. You can also refer to the file as:

	wasb:///example/data/data.txt

or

	wasbs://<ContainerName>@<StorageAccountName>.blob.core.windows.net/example/data/davinci.txt

For a list of other Hadoop commands that work with files, see [http://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-common/FileSystemShell.html](http://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-common/FileSystemShell.html)

##Graphical clients

There are also several applications that provide a graphical interface for working with Azure Storage. The following is a list of a few of these applications:

| Client | Linux | OS X | Windows |
| ------ |:-----:|:----:|:-------:|
| [Azure Storage Explorer](http://azurestorageexplorer.codeplex.com/) | | | ✔ |
| [Cloud Storage Studio 2](http://www.cerebrata.com/Products/CloudStorageStudio/) | | | ✔ |
| [CloudXplorer](http://clumsyleaf.com/products/cloudxplorer) | | | ✔ |
| [Azure Explorer](http://www.cloudberrylab.com/free-microsoft-azure-explorer.aspx) | | | ✔ |
| [Zudio](https://zudio.co/) | ✔ | ✔ | ✔ |
| [Cyberduck](https://cyberduck.io/) |  | ✔ | ✔ |

###<a id="storageexplorer"></a>Azure Storage Explorer

*Azure Storage Explorer* is a useful tool for inspecting and altering the data in Azure Storage. It is a free tool that can be downloaded from CodePlex: [Azure Storage Explorer](http://azurestorageexplorer.codeplex.com/ "Azure Storage Explorer").

Before using the tool, you must know your Azure storage account name and account key. For instructions about getting this information, see the "How to: View, copy and regenerate storage access keys" section of [Create, manage, or delete a storage account][azure-create-storage-account].  

1. Run Azure Storage Explorer.

	![HDI.AzureStorageExplorer][image-azure-storage-explorer]

2. Click **Add Account**. After an account is added to Azure Storage Explorer, you don't need to go through this step again.

	![HDI.ASEAddAccount][image-ase-addaccount]

3. Enter your **Storage account name** and **Storage account key**, and then click **Add Storage Account**. You can add multiple storage accounts, and each account will be displayed on a tab.

4. Under **Storage Type**, click **Blobs**.

	![HDI.ASEBlob][image-ase-blob]

5. Under **Container**, click the name of the container that is associated with your HDInsight cluster. When you create an HDInsight cluster, you must specify a container.  Otherwise, the cluster creation process creates one for you.

6. Under **Blob**, click **Upload**.

7. Specify a file to upload, and then click **Open**.


##Services

###Azure Data Factory

The Azure Data Factory service is a fully managed service for composing data storage, data processing, and data movement services into streamlined, scalable, and reliable data production pipelines.

Azure Data Factory can be used to move data into Azure Blob storage, or to create data pipelines that directly use HDInsight features such as Hive and Pig.

For more information, see the [Azure Data Factory documentation](http://azure.microsoft.com/documentation/services/data-factory/).

###<a id="sqoop"></a>Apache Sqoop

Sqoop is a tool designed to transfer data between Hadoop and relational databases. You can use it to import data from a relational database management system (RDBMS), such as SQL Server, MySQL, or Oracle into the Hadoop distributed file system (HDFS), transform the data in Hadoop with MapReduce or Hive, and then export the data back into an RDBMS.

For more information, see [Use Sqoop with HDInsight][hdinsight-use-sqoop].

##Development SDKs

Azure Blob storage can also be accessed using an Azure SDK from the following programming languages:

* .NET
* Java
* Node.js
* PHP
* Python
* Ruby

For more information on installing the Azure SDKs, see [Azure downloads](http://azure.microsoft.com/downloads/)


## Next steps
Now that you understand how to get data into HDInsight, read the following articles to learn how to perform analysis:

* [Get started with Azure HDInsight][hdinsight-get-started]
* [Submit Hadoop jobs programmatically][hdinsight-submit-jobs]
* [Use Hive with HDInsight][hdinsight-use-hive]
* [Use Pig with HDInsight][hdinsight-use-pig]




[azure-management-portal]: https://manage.windowsazure.com
[azure-powershell]: http://msdn.microsoft.com/library/windowsazure/jj152841.aspx

[azure-storage-client-library]: /develop/net/how-to-guides/blob-storage/
[azure-create-storage-account]: storage-create-storage-account.md
[azure-azcopy-download]: storage-use-azcopy.md
[azure-azcopy]: storage-use-azcopy.md

[hdinsight-use-sqoop]: hdinsight-use-sqoop.md

[hdinsight-storage]: hdinsight-use-blob-storage.md
[hdinsight-submit-jobs]: hdinsight-submit-hadoop-jobs-programmatically.md
[hdinsight-get-started]: hdinsight-get-started.md

[hdinsight-use-hive]: hdinsight-use-hive.md
[hdinsight-use-pig]: hdinsight-use-pig.md
[hdinsight-provision]: hdinsight-provision-clusters.md

[sqldatabase-create-configure]: sql-database-create-configure.md

[apache-sqoop-guide]: http://sqoop.apache.org/docs/1.4.4/SqoopUserGuide.html

[Powershell-install-configure]: powershell-install-configure.md

[azurecli]: xplat-cli.md


[image-azure-storage-explorer]: ./media/hdinsight-upload-data/HDI.AzureStorageExplorer.png
[image-ase-addaccount]: ./media/hdinsight-upload-data/HDI.ASEAddAccount.png
[image-ase-blob]: ./media/hdinsight-upload-data/HDI.ASEBlob.png
