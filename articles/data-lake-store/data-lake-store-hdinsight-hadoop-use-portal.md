---
title: Use the Azure portal to create Azure HDInsight clusters with Data Lake Store | Microsoft Docs
description: Use the Azure portal to create and use HDInsight clusters with Azure Data Lake Store
services: data-lake-store,hdinsight
documentationcenter: ''
author: nitinme
manager: jhubbard
editor: cgronlun

ms.assetid: a8c45a83-a8e3-4227-8b02-1bc1e1de6767
ms.service: data-lake-store
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 02/16/2017
ms.author: nitinme

---
# Create HDInsight clusters with Data Lake Store by using the Azure portal
> [!div class="op_single_selector"]
> * [Use the Azure portal](data-lake-store-hdinsight-hadoop-use-portal.md)
> * [Use PowerShell (for default storage)](data-lake-store-hdinsight-hadoop-use-powershell-for-default-storage.md)
> * [Use PowerShell (for additional storage)](data-lake-store-hdinsight-hadoop-use-powershell.md)
> * [Use Resource Manager](data-lake-store-hdinsight-hadoop-use-resource-manager-template.md)
>
>

Learn how to use the Azure portal to create HDInsight clusters with access to Azure Data Lake Store. For supported cluster types, you can use Data Lake Store as default storage or as an additional storage account. When you use Data Lake Store as additional storage, the default storage account for the clusters remains Azure Blob storage. Also, the cluster-related files (such as logs) are still written to the default storage. However, the data that you want to process can be stored in a Data Lake Store account. Using Data Lake Store as an additional storage account does not affect performance or the ability to read or write to storage from the cluster.

Here are some important considerations for using HDInsight with Data Lake Store:

* The option to create HDInsight clusters with access to Data Lake Store as default storage is available for HDInsight version 3.5.

* The option to create HDInsight clusters with access to Data Lake Store as additional storage is available for HDInsight versions 3.2, 3.4, and 3.5.

* For HBase clusters (Windows and Linux), Data Lake Store is *not supported* as a storage option for either default or additional storage.

* For Storm clusters (Windows and Linux), you can use Data Lake Store to write data from a Storm topology. You can also use Data Lake Store for reference data that can then be read by a Storm topology. For more information, see [Use Data Lake Store in a Storm topology](#use-data-lake-store-in-a-storm-topology).


## Prerequisites
Before you begin this tutorial, ensure that you've met the following requirements:

* **An Azure subscription**. Go to [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

* **An Azure Data Lake Store account**. Follow the instructions at [Get started with Azure Data Lake Store by using the Azure portal](data-lake-store-get-started-portal.md).

* **An Azure Active Directory service principal**. This tutorial provides instructions on how to create a service principal in Azure Active Directory (Azure AD). However, to create a service principal, you must be an Azure AD administrator. If you are an administrator, you can skip this prerequisite and proceed with the tutorial.

 >[!NOTE]
 >Unless you are an Azure AD administrator, you cannot create a service principal. Your Azure AD administrator must create a service principal before you can create an HDInsight cluster with Data Lake Store. Also, the service principal must be created with a certificate, as described at [Create a service principal with certificate](../azure-resource-manager/resource-group-authenticate-service-principal.md#create-service-principal-with-certificate).

## Create an HDInsight cluster with access to a Data Lake Store
In this section, you create an HDInsight Hadoop cluster that uses the Data Lake Store as additional storage. In this release, for a Hadoop cluster, you can use Data Lake Store only as additional storage for the cluster. The default storage remains Azure Blob storage. So, you first create the storage account and the storage containers that are required for the cluster.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. To start provisioning an HDInsight cluster, follow the instructions in [Create Hadoop clusters in HDInsight](../hdinsight/hdinsight-provision-clusters.md).

3. On the **Storage** blade, specify whether you want to use Blob storage or Data Lake Store as your default storage, and then do either of the following:

 * To use Data Lake Store as default storage, skip to step 4.

 * To use Blob storage as default storage:

    a. Under **Primary storage type**, select **Azure Storage**.

    b. Under **Selection method**, do either of the following:
        * To specify a storage account that is part of your Azure subscription, select **My subscriptions**, and then select the storage account.
        * To specify a storage account that is outside your Azure subscription, select **Access key**, and then provide the information for the outside storage account.

    c. Under **Default container**, either enter the default container name that's suggested by the portal or specify your own.

 When you use Blob storage as default storage, you can still use Data Lake Store as additional storage for the cluster. To do so, click **Data Lake Store access**, and then skip to step 5.

 ![Add service principal to HDInsight cluster](./media/data-lake-store-hdinsight-hadoop-use-portal/hdi.adl.1.png "Add service principal to HDInsight cluster")

4. To use Data Lake Store as default storage:

 a. Under **Primary storage type**, click **Data Lake Store**.

 b. Select an existing Data Lake Store account, enter a root folder path where the cluster-specific files are to be stored, specify **Location** as **East US 2**, and then click **Data Lake Store access**.

 >[!NOTE]
 >You can use this option only with HDInsight 3.5 clusters (Standard edition). Within HDInsight 3.5 clusters, this option is not available for the HBase cluster type.

 In the following screenshot, the root folder path is /clusters/myhdiadlcluster, where *myhdiadlcluster* is the name of the cluster being created. In such a case, make sure that the */clusters* folder exists in the Data Lake Store account. The *myhdiadlcluster* folder is created during cluster creation. Similarly, if the root path was set to */hdinsight/clusters/data/myhdiadlcluster*, ensure that */hdinsight/clusters/data/* exists in the Data Lake Store account.

 ![Add service principal to HDInsight cluster](./media/data-lake-store-hdinsight-hadoop-use-portal/hdi.adl.1.adls.storage.png "Add service principal to HDInsight cluster")

5. On the **Data Lake Store access** blade, do either of the following:

 * To use an existing service principal, skip to step 6.
 * To create a service principal:

	a. On the **Data Lake Store access** blade, click **Create new**, and then click **Service Principal**.

    b. On the **Create a Service Principal** blade, enter the required values.  

    c. Click **Create**.  
    A certificate and an Azure AD application are created automatically.

	![Add service principal to HDInsight cluster](./media/data-lake-store-hdinsight-hadoop-use-portal/hdi.adl.2.png "Add service principal to HDInsight cluster")

	You can also click **Download Certificate** to download the certificate associated with the service principal you created. Downloading the certificate is useful if you want to use the same service principal when you create additional HDInsight clusters. Click **Select**.

6. To use an existing service principal:

 a. On the **Data Lake Store access** blade, click **Use existing**, and then click **Service Principal**.

 b. On the **Select a Service Principal** blade, search for an existing service principal. Click the service principal that you want to use, and then click **Select**.

 c. On the **Data Lake Store access** blade, upload the certificate (.pfx file) that's associated with your selected service principal, and then enter the certificate password.

 ![Add service principal to HDInsight cluster](./media/data-lake-store-hdinsight-hadoop-use-portal/hdi.adl.5.png "Add service principal to HDInsight cluster")

7. On the **Data Lake Store access** blade, click **Access**.  
The **Select file permissions** blade is open by default. It lists all the Data Lake Store accounts in your subscription.

8. Select the Data Lake Store account that you want to associate with the cluster.
 All the files and folders in that account are listed. You can then assign permissions at the file or folder level. To assign permissions at the root level of the account, select the check box next to the account name.

 ![Add service principal to HDInsight cluster](./media/data-lake-store-hdinsight-hadoop-use-portal/hdi.adl.3.png "Add service principal to HDInsight cluster")

 > [!NOTE]
 > If you are using the Data Lake Store account as default storage for a cluster, assign permissions to the service principal at the root level of the Data Lake Store account.

9. To assign permissions for files or folders within an account, in the **Select file permissions** window, select the Data Lake Store account.

10. In the right pane, select the files or folders that you want to assign permissions to, select the permissions (Read, Write, or Execute), specify whether the permissions apply recursively to the child items as well, and then click **Select**.

	![Assign service principal permissions to the HDInsight cluster](./media/data-lake-store-hdinsight-hadoop-use-portal/hdi.adl.3-1.png "Assign service principal permissions to the HDInsight cluster")

11. In the **Assign selected permissions** window, to assign the permissions for the Azure Active Directory service principal on the account, files, or folders you selected, click **Run**.

	![Assign service principal permissions to the HDInsight cluster](./media/data-lake-store-hdinsight-hadoop-use-portal/hdi.adl.3-2.png "Assign service principal permissions to the HDInsight cluster")

12. After the permissions are successfully assigned, click **Done** on each open blade to return to the **Data Lake Store access** blade.

13. On the **Data Lake Store access**, click **Select**, and then continue with cluster creation as described in [Create Hadoop clusters in HDInsight](../hdinsight/hdinsight-hadoop-create-linux-clusters-portal.md).

14. After the cluster setup is complete, on the cluster blade, verify your results by doing either or both of the following:

 * To verify that the associated storage for the cluster is the Data Lake Store account that you specified, click **Storage accounts** in the left pane.

        ![Add service principal to HDInsight cluster](./media/data-lake-store-hdinsight-hadoop-use-portal/hdi.adl.6-1.png "Add service principal to HDInsight cluster")

 * To verify that the service principal is correctly associated with the HDInsight cluster, click **Data Lake Store access** in the left pane.

	   ![Add service principal to HDInsight cluster](./media/data-lake-store-hdinsight-hadoop-use-portal/hdi.adl.6.png "Add service principal to HDInsight cluster")

## Show me some examples

After you have set up the cluster with Data Lake Store as your storage, refer to these examples of how to use HDInsight cluster to analyze the data that's stored in Data Lake Store.

### Run a Hive query against data in a Data Lake Store (as primary storage)

To run a Hive query, use the Hive views interface in the Ambari portal. For instructions on how to use Ambari Hive views, see [Use the Hive View with Hadoop in HDInsight](../hdinsight/hdinsight-hadoop-use-hive-ambari-view.md). You

When you work with data in a Data Lake Store, note a few strings to change:

* If you use, for example, the cluster that you created with Data Lake Store as primary storage, the path to the data is: *adl://<data_lake_store_account_name>/azuredatalakestore.net/path/to/file*. A Hive query to create a table from sample data that's stored in the Data Lake Store account looks like this:

		CREATE EXTERNAL TABLE websitelog (str string) LOCATION 'adl://hdiadlsstorage.azuredatalakestore.net/clusters/myhdiadlcluster/HdiSamples/HdiSamples/WebsiteLogSampleData/SampleLog/'

    Descriptions:
    * `adl://hdiadlstorage.azuredatalakestore.net/` is the root of the Data Lake Store account.
    * `/clusters/myhdiadlcluster` is the root of the cluster data that you specified while creating the cluster.
    * `/HdiSamples/HdiSamples/WebsiteLogSampleData/SampleLog/` is the location of the sample file that you used in the query.

### Run a Hive query against data in a Data Lake Store (as additional storage)

If the cluster that you created uses Blob storage as default storage, the sample data is not contained in the Azure Data Lake Store account that's used as additional storage. In such a case, first transfer the data from Blob storage to the Data Lake Store, and then run the queries as shown in the preceding example.

For information on how to copy data from Blob storage to a Data Lake Store, see the following articles:

* [Use Distcp to copy data between Azure Storage Blobs and Data Lake Store](data-lake-store-copy-data-wasb-distcp.md)
* [Use AdlCopy to copy data from Azure Storage Blobs to Data Lake Store](data-lake-store-copy-data-azure-storage-blob.md)

### Use Data Lake Store with a Spark cluster
You can use a Spark cluster to run Spark jobs on data that is stored in a Data Lake Store. For more information, see [Use HDInsight Spark cluster to analyze data in Data Lake Store](../hdinsight/hdinsight-apache-spark-use-with-data-lake-store.md).


### Use Data Lake Store in a Storm topology
You can use the Data Lake Store to write data from a Storm topology. For instructions on how to achieve this scenario, see [Use Azure Data Lake Store with Apache Storm with HDInsight](../hdinsight/hdinsight-storm-write-data-lake-store.md).

## See also
* [PowerShell: Create an HDInsight cluster to use Data Lake Store](data-lake-store-hdinsight-hadoop-use-powershell.md)

[makecert]: https://msdn.microsoft.com/library/windows/desktop/ff548309(v=vs.85).aspx
[pvk2pfx]: https://msdn.microsoft.com/library/windows/desktop/ff550672(v=vs.85).aspx
