---
title: Template - HDInsight cluster with Data Lake Storage Gen1
description: Use Azure Resource Manager templates to create and use Azure HDInsight clusters with Azure Data Lake Storage Gen1.

author: normesta
ms.service: data-lake-store
ms.custom: devx-track-arm-template
ms.topic: how-to
ms.date: 05/29/2018
ms.author: normesta 
---
# Create an HDInsight cluster with Azure Data Lake Storage Gen1 using Azure Resource Manager template
> [!div class="op_single_selector"]
> * [Using Portal](data-lake-store-hdinsight-hadoop-use-portal.md)
> * [Using PowerShell (for default storage)](data-lake-store-hdinsight-hadoop-use-powershell-for-default-storage.md)
> * [Using PowerShell (for additional storage)](data-lake-store-hdinsight-hadoop-use-powershell.md)
> * [Using Resource Manager](data-lake-store-hdinsight-hadoop-use-resource-manager-template.md)
>
>

Learn how to use Azure PowerShell to configure an HDInsight cluster with Azure Data Lake Storage Gen1, **as additional storage**.

For supported cluster types, Data Lake Storage Gen1 can be used as a default storage or as an additional storage account. When Data Lake Storage Gen1 is used as additional storage, the default storage account for the clusters will still be Azure Blob storage (WASB) and the cluster-related files (such as logs, etc.) are still written to the default storage, while the data that you want to process can be stored in a Data Lake Storage Gen1 account. Using Data Lake Storage Gen1 as an additional storage account does not impact performance or the ability to read/write to the storage from the cluster.

## Using Data Lake Storage Gen1 for HDInsight cluster storage

Here are some important considerations for using HDInsight with Data Lake Storage Gen1:

* Option to create HDInsight clusters with access to Data Lake Storage Gen1 as default storage is available for HDInsight version 3.5 and 3.6.

* Option to create HDInsight clusters with access to Data Lake Storage Gen1 as additional storage is available for HDInsight versions 3.2, 3.4, 3.5, and 3.6.

In this article, we provision a Hadoop cluster with Data Lake Storage Gen1 as additional storage. For instructions on how to create a Hadoop cluster with Data Lake Storage Gen1 as default storage, see [Create an HDInsight cluster with Data Lake Storage Gen1 using Azure portal](data-lake-store-hdinsight-hadoop-use-portal.md).

## Prerequisites

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

Before you begin this tutorial, you must have the following:

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
* **Azure PowerShell 1.0 or greater**. See [How to install and configure Azure PowerShell](/powershell/azure/).
* **Azure Active Directory Service Principal**. Steps in this tutorial provide instructions on how to create a service principal in Azure AD. However, you must be an Azure AD administrator to be able to create a service principal. If you are an Azure AD administrator, you can skip this prerequisite and proceed with the tutorial.

    **If you are not an Azure AD administrator**, you will not be able to perform the steps required to create a service principal. In such a case, your Azure AD administrator must first create a service principal before you can create an HDInsight cluster with Data Lake Storage Gen1. Also, the service principal must be created using a certificate, as described at [Create a service principal with certificate](../active-directory/develop/howto-authenticate-service-principal-powershell.md#create-service-principal-with-certificate-from-certificate-authority).

## Create an HDInsight cluster with Data Lake Storage Gen1
The Resource Manager template, and the prerequisites for using the template, are available on GitHub at [Deploy a HDInsight Linux cluster with new Data Lake Storage Gen1](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.hdinsight/hdinsight-datalake-store-azure-storage). Follow the instructions provided at this link to create an HDInsight cluster with Data Lake Storage Gen1 as the additional storage.

The instructions at the link mentioned above require PowerShell. Before you start with those instructions, make sure you log in to your Azure account. From your desktop, open a new Azure PowerShell window, and enter the following snippets. When prompted to log in, make sure you log in as one of the subscription administrators/owner:

```
# Log in to your Azure account
Connect-AzAccount

# List all the subscriptions associated to your account
Get-AzSubscription

# Select a subscription
Set-AzContext -SubscriptionId <subscription ID>
```

The template deploys these resource types:

* [Microsoft.DataLakeStore/accounts](/azure/templates/microsoft.datalakestore/accounts)
* [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts)
* [Microsoft.HDInsight/clusters](/azure/templates/microsoft.hdinsight/clusters)

## Upload sample data to Data Lake Storage Gen1
The Resource Manager template creates a new storage account with Data Lake Storage Gen1 and associates it with the HDInsight cluster. You must now upload some sample data to Data Lake Storage Gen1. You'll need this data later in the tutorial to run jobs from an HDInsight cluster that access data in the storage account with Data Lake Storage Gen1. For instructions on how to upload data, see [Upload a file to Data Lake Storage Gen1](data-lake-store-get-started-portal.md#uploaddata). If you are looking for some sample data to upload, you can get the **Ambulance Data** folder from the [Azure Data Lake Git Repository](https://github.com/Azure/usql/tree/master/Examples/Samples/Data/AmbulanceData).

## Set relevant ACLs on the sample data
To make sure the sample data you upload is accessible from the HDInsight cluster, you must ensure that the Azure AD application that is used to establish identity between the HDInsight cluster and Data Lake Storage Gen1 has access to the file/folder you are trying to access. To do this, perform the following steps.

1. Find the name of the Azure AD application that is associated with HDInsight cluster and the storage account with Data Lake Storage Gen1. One way to look for the name is to open the HDInsight cluster blade that you created using the Resource Manager template, click the **Cluster Azure AD Identity** tab, and look for the value of **Service Principal Display Name**.
2. Now, provide access to this Azure AD application on the file/folder that you want to access from the HDInsight cluster. To set the right ACLs on the file/folder in Data Lake Storage Gen1, see [Securing data in Data Lake Storage Gen1](data-lake-store-secure-data.md#filepermissions).

## Run test jobs on the HDInsight cluster to use Data Lake Storage Gen1
After you have configured an HDInsight cluster, you can run test jobs on the cluster to test that the HDInsight cluster can access Data Lake Storage Gen1. To do so, we will run a sample Hive job that creates a table using the sample data that you uploaded earlier to your storage account with Data Lake Storage Gen1.

In this section, you SSH into an HDInsight Linux cluster and run the sample Hive query. If you are using a Windows client, we recommend using **PuTTY**, which can be downloaded from [https://www.chiark.greenend.org.uk/~sgtatham/putty/download.html](https://www.chiark.greenend.org.uk/~sgtatham/putty/download.html).

For more information on using PuTTY, see [Use SSH with Linux-based Hadoop on HDInsight from Windows](../hdinsight/hdinsight-hadoop-linux-use-ssh-unix.md).

1. Once connected, start the Hive CLI by using the following command:

   ```
   hive
   ```
2. Using the CLI, enter the following statements to create a new table named **vehicles** by using the sample data in Data Lake Storage Gen1:

   ```
   DROP TABLE vehicles;
   CREATE EXTERNAL TABLE vehicles (str string) LOCATION 'adl://<mydatalakestoragegen1>.azuredatalakestore.net:443/';
   SELECT * FROM vehicles LIMIT 10;
   ```

   You should see output similar to the following:

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


## Access Data Lake Storage Gen1 using HDFS commands
Once you have configured the HDInsight cluster to use Data Lake Storage Gen1, you can use the HDFS shell commands to access the store.

In this section, you SSH into an HDInsight Linux cluster and run the HDFS commands. If you are using a Windows client, we recommend using **PuTTY**, which can be downloaded from [https://www.chiark.greenend.org.uk/~sgtatham/putty/download.html](https://www.chiark.greenend.org.uk/~sgtatham/putty/download.html).

For more information on using PuTTY, see [Use SSH with Linux-based Hadoop on HDInsight from Windows](../hdinsight/hdinsight-hadoop-linux-use-ssh-unix.md).

Once connected, use the following HDFS filesystem command to list the files in the storage account with Data Lake Storage Gen1.

```
hdfs dfs -ls adl://<storage account with Data Lake Storage Gen1 name>.azuredatalakestore.net:443/
```

This should list the file that you uploaded earlier to Data Lake Storage Gen1.

```
15/09/17 21:41:15 INFO web.CaboWebHdfsFileSystem: Replacing original urlConnectionFactory with org.apache.hadoop.hdfs.web.URLConnectionFactory@21a728d6
Found 1 items
-rwxrwxrwx   0 NotSupportYet NotSupportYet     671388 2015-09-16 22:16 adl://mydatalakestoragegen1.azuredatalakestore.net:443/mynewfolder
```

You can also use the `hdfs dfs -put` command to upload some files to Data Lake Storage Gen1, and then use `hdfs dfs -ls` to verify whether the files were successfully uploaded.


## Next steps
* [Copy data from Azure Storage Blobs to Data Lake Storage Gen1](data-lake-store-copy-data-wasb-distcp.md)
* [Use Data Lake Storage Gen1 with Azure HDInsight clusters](../hdinsight/hdinsight-hadoop-use-data-lake-storage-gen1.md)
