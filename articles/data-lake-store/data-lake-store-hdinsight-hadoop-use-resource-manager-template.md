<properties
   pageTitle="Create HDInsight clusters with Azure Data Lake Store using Resource Manager Templates | Microsoft Azure"
   description="Use Azure Resource Manager templates to create and use HDInsight clusters with Azure Data Lake Store"
   services="data-lake-store,hdinsight"
   documentationCenter=""
   authors="nitinme"
   manager="jhubbard"
   editor="cgronlun"/>

<tags
   ms.service="data-lake-store"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="10/04/2016"
   ms.author="nitinme"/>

# Create an HDInsight cluster with Data Lake Store using Azure Resource Manager template

> [AZURE.SELECTOR] - [Using Portal](data-lake-store-hdinsight-hadoop-use-portal.md) - [Using PowerShell](data-lake-store-hdinsight-hadoop-use-powershell.md) - [Using Resource Manager](data-lake-store-hdinsight-hadoop-use-resource-manager-template.md)

Learn how to use an Azure Resource Manager template to configure an HDInsight cluster with access to Azure Data Lake Store. Some important considerations for this release:

-	**For Spark clusters (Linux), and Hadoop/Storm clusters (Windows and Linux)**, the Data Lake Store can only be used as an additional storage account. The default storage account for the such clusters will still be Azure Storage Blobs (WASB).

-	**For HBase clusters (Windows and Linux)**, the Data Lake Store can be used as a default storage or additional storage.

> [AZURE.NOTE] Some important points to note.
>
> -	Option to create HDInsight clusters with access to Data Lake Store is available only for HDInsight versions 3.2 and 3.4 (for Hadoop, HBase, and Storm clusters on Windows as well as Linux). For Spark clusters on Linux, this option is only available on HDInsight 3.4 clusters.
>
> -	As mentioned above, Data Lake Store is available as default storage for some cluster types (HBase) and additional storage for other cluster types (Hadoop, Spark, Storm). Using Data Lake Store as an additional storage account does not impact performance or the ability to read/write to the storage from the cluster. In a scenario where Data Lake Store is used as additional storage, cluster-related files (such as logs, etc.) are written to the default storage (Azure Blobs), while the data that you want to process can be stored in a Data Lake Store account.
>

In this article, we provision a Hadoop cluster with Data Lake Store as additional storage.

## Prerequisites

Before you begin this tutorial, you must have the following:

-	**An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

-	**Azure PowerShell 1.0 or greater**. See [How to install and configure Azure PowerShell](../powershell-install-configure.md).

## Create an HDInsight cluster with Azure Data Lake Store

The Resource Manager template, and the prerequisites for using the template, are available on GitHub at [Deploy a HDInsight Linux cluster with new Data Lake Store](https://github.com/Azure/azure-quickstart-templates/tree/master/201-hdinsight-datalake-store-azure-storage). Follow the instructions provided at this link to create an HDInsight cluster with Azure Data Lake Store as the additional storage.

The instructions at the link mentioned above require PowerShell. Before you start with those instructions, make sure you log in to your Azure account. From your desktop, open a new Azure PowerShell window, and enter the following snippets. When prompted to log in, make sure you log in as one of the subscription admininistrators/owner:

```
# Log in to your Azure account
Login-AzureRmAccount

# List all the subscriptions associated to your account
Get-AzureRmSubscription

# Select a subscription
Set-AzureRmContext -SubscriptionId <subscription ID>
```

## Upload sample data to the Azure Data Lake Store

The Resource Manager template creates a new Data Lake Store account and associates it with the HDInsight cluster. You must now upload some sample data to the Data Lake Store. You'll need this data later in the tutorial to run jobs from an HDInsight cluster that access data in the Data Lake Store. For instructions on how to upload data, see [Upload a file to your Data Lake Store](data-lake-store-get-started-portal.md#uploaddata). If you are looking for some sample data to upload, you can get the **Ambulance Data** folder from the [Azure Data Lake Git Repository](https://github.com/Azure/usql/tree/master/Examples/Samples/Data/AmbulanceData).

## Set relevant ACLs on the sample data

To make sure the sample data you upload is accessible from the HDInsight cluster, you must ensure that the Azure AD application that is used to establish identity between the HDInsight cluster and Data Lake Store has access to the file/folder you are trying to access. To do this, perform the following steps.

1.	Find the name of the Azure AD application that is associated with HDInsight cluster and the Data Lake Store. One way to look for the name is to open the HDInsight cluster blade that you created using the Resource Manager template, click the **Cluster AAD Identity** tab, and look for the value of **Service Principal Display Name**.

2.	Now, provide access to this Azure AD application on the file/folder that you want to access from the HDInsight cluster. To set the right ACLs on the file/folder in Data Lake Store, see [Securing data in Data Lake Store](data-lake-store-secure-data.md#assign-users-or-security-group-as-acls-to-the-azure-data-lake-store-file-system).

## Run test jobs on the HDInsight cluster to use the Data Lake Store

After you have configured an HDInsight cluster, you can run test jobs on the cluster to test that the HDInsight cluster can access Data Lake Store. To do so, we will run a sample Hive job that creates a table using the sample data that you uploaded earlier to your Data Lake Store.

### For a Linux cluster

In this section you will SSH into the cluster and run the a sample Hive query. Windows does not provide a built-in SSH client. We recommend using **PuTTY**, which can be downloaded from [http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html).

For more information on using PuTTY, see [Use SSH with Linux-based Hadoop on HDInsight from Windows ](../hdinsight/hdinsight-hadoop-linux-use-ssh-windows.md).

1.	Once connected, start the Hive CLI by using the following command:

	```
	hive
	```

2.	Using the CLI, enter the following statements to create a new table named **vehicles** by using the sample data in the Data Lake Store:

	```
	DROP TABLE vehicles;
	CREATE EXTERNAL TABLE vehicles (str string) LOCATION 'adl://<mydatalakestore>.azuredatalakestore.net:443/';
	SELECT * FROM vehicles LIMIT 10;
	```

	You should see an output similar to the following:

	```
	1,1,2014-09-14 00:00:03,46.81006,-92.08174,51,S,1
	1,2,2014-09-14 00:00:06,46.81006,-92.08174,13,NE,1
	1,3,2014-09-14 00:00:09,46.81006,-92.08174,48,NE,1
	1,4,2014-09-14 00:00:12,46.81006,-92.08174,30,W,1
	1,5,2014-09-14 00:00:15,46.81006,-92.08174,47,S,1
	1,6,2014-09-14 00:00:18,46.81006,-92.08174,9,S,1
	1,7,2014-09-14 00:00:21,46.81006,-92.08174,53,N,1
	1,8,2014-09-14 00:00:24,46.81006,-92.08174,63,SW,1
	1,9,2014-09-14 00:00:27,46.81006,-92.08174,4,NE,1
	1,10,2014-09-14 00:00:30,46.81006,-92.08174,31,N,1
	```

### For a Windows cluster

Use the following cmdlets to run the Hive query. In this query we create a table from the data in the Data Lake Store and then run a select query on the created table.

```
$queryString = "DROP TABLE vehicles;" + "CREATE EXTERNAL TABLE vehicles (str string) LOCATION 'adl://$dataLakeStoreName.azuredatalakestore.net:443/';" + "SELECT * FROM vehicles LIMIT 10;"

$hiveJobDefinition = New-AzureRmHDInsightHiveJobDefinition -Query $queryString

$hiveJob = Start-AzureRmHDInsightJob -ResourceGroupName $resourceGroupName -ClusterName $clusterName -JobDefinition $hiveJobDefinition -ClusterCredential $httpCredentials

Wait-AzureRmHDInsightJob -ResourceGroupName $resourceGroupName -ClusterName $clusterName -JobId $hiveJob.JobId -ClusterCredential $httpCredentials
```

This will have the following output. **ExitValue** of 0 in the output suggests that the job completed successfully.

```
Cluster         : hdiadlcluster.
HttpEndpoint    : hdiadlcluster.azurehdinsight.net
State           : SUCCEEDED
JobId           : job_1445386885331_0012
ParentId        :
PercentComplete :
ExitValue       : 0
User            : admin
Callback        :
Completed       : done
```

Retrieve the output from the job by using the following cmdlet:

```
Get-AzureRmHDInsightJobOutput -ClusterName $clusterName -JobId $hiveJob.JobId -DefaultContainer $containerName -DefaultStorageAccountName $storageAccountName -DefaultStorageAccountKey $storageAccountKey -ClusterCredential $httpCredentials
```

The job output resembles the following:

```
1,1,2014-09-14 00:00:03,46.81006,-92.08174,51,S,1
1,2,2014-09-14 00:00:06,46.81006,-92.08174,13,NE,1
1,3,2014-09-14 00:00:09,46.81006,-92.08174,48,NE,1
1,4,2014-09-14 00:00:12,46.81006,-92.08174,30,W,1
1,5,2014-09-14 00:00:15,46.81006,-92.08174,47,S,1
1,6,2014-09-14 00:00:18,46.81006,-92.08174,9,S,1
1,7,2014-09-14 00:00:21,46.81006,-92.08174,53,N,1
1,8,2014-09-14 00:00:24,46.81006,-92.08174,63,SW,1
1,9,2014-09-14 00:00:27,46.81006,-92.08174,4,NE,1
1,10,2014-09-14 00:00:30,46.81006,-92.08174,31,N,1
```

## Access Data Lake Store using HDFS commands

Once you have configured the HDInsight cluster to use Data Lake Store, you can use the HDFS shell commands to access the store.

### For a Linux cluster

In this section you will SSH into the cluster and run the HDFS commands. Windows does not provide a built-in SSH client. We recommend using **PuTTY**, which can be downloaded from [http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html).

For more information on using PuTTY, see [Use SSH with Linux-based Hadoop on HDInsight from Windows ](../hdinsight/hdinsight-hadoop-linux-use-ssh-windows.md).

Once connected, use the following HDFS filesystem command to list the files in the Data Lake Store.

```
hdfs dfs -ls adl://<Data Lake Store account name>.azuredatalakestore.net:443/
```

This should list the file that you uploaded earlier to the Data Lake Store.

```
15/09/17 21:41:15 INFO web.CaboWebHdfsFileSystem: Replacing original urlConnectionFactory with org.apache.hadoop.hdfs.web.URLConnectionFactory@21a728d6
Found 1 items
-rwxrwxrwx   0 NotSupportYet NotSupportYet     671388 2015-09-16 22:16 adl://mydatalakestore.azuredatalakestore.net:443/mynewfolder
```

You can also use the `hdfs dfs -put` command to upload some files to the Data Lake Store, and then use `hdfs dfs -ls` to verify whether the files were successfully uploaded.

### For a Windows cluster

1.	Sign on to the new [Azure Portal](https://portal.azure.com).

2.	Click **Browse**, click **HDInsight clusters**, and then click the HDInsight cluster that you created.

3.	In the cluster blade, click **Remote Desktop**, and then in the **Remote Desktop** blade, click **Connect**.

	![Remote into HDI cluster](./media/data-lake-store-hdinsight-hadoop-use-powershell/ADL.HDI.PS.Remote.Desktop.png)

	When prompted, enter the credentials you provided for the remote desktop user.

4.	In the remote session, start Windows PowerShell, and use the HDFS filesystem commands to list the files in the Azure Data Lake Store.

	```
	hdfs dfs -ls adl://<Data Lake Store account name>.azuredatalakestore.net:443/
	```

	This should list the file that you uploaded earlier to the Data Lake Store.

	```
	15/09/17 21:41:15 INFO web.CaboWebHdfsFileSystem: Replacing original urlConnectionFactory with org.apache.hadoop.hdfs.web.URLConnectionFactory@21a728d6
	Found 1 items
	-rwxrwxrwx   0 NotSupportYet NotSupportYet     671388 2015-09-16 22:16 adl://mydatalakestore.azuredatalakestore.net:443/vehicle1_09142014.csv
	```

	You can also use the `hdfs dfs -put` command to upload some files to the Data Lake Store, and then use `hdfs dfs -ls` to verify whether the files were successfully uploaded.

## Next steps

-	[Copy data from Azure Storage Blobs to Data Lake Store](data-lake-store-copy-data-wasb-distcp.md)
