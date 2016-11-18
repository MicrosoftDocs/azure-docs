---
title: Create HDInsight clusters with Azure Data Lake Store using the portal | Microsoft Docs
description: Use Azure Portal to create and use HDInsight clusters with Azure Data Lake Store
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
ms.date: 11/16/2016
ms.author: nitinme

---
# Create an HDInsight cluster with Data Lake Store using Azure Portal
> [!div class="op_single_selector"]
> * [Using Portal](data-lake-store-hdinsight-hadoop-use-portal.md)
> * [Using PowerShell](data-lake-store-hdinsight-hadoop-use-powershell.md)
> * [Using Resource Manager](data-lake-store-hdinsight-hadoop-use-resource-manager-template.md)
>
>

Learn how to use Azure Portal to create an HDInsight cluster with access to Azure Data Lake Store. Some important considerations for this release:

* **For HBase clusters (Windows and Linux)**, Data Lake Store is **not supported** as a storage option, for both default storage as well as additional storage.

* For supported cluster types, Data Lake Store be used as an default storage or additional storage account. When Data Lake Store is used as additional storage, the default storage account for the clusters will still be Azure Storage Blobs (WASB) and the cluster-related files (such as logs, etc.) are still written to the default storage, while the data that you want to process can be stored in a Data Lake Store account. Using Data Lake Store as an additional storage account does not impact performance or the ability to read/write to the storage from the cluster.

* **For Storm clusters (Windows and Linux)**, the Data Lake Store can be used to write data from a Storm topology. Data Lake Store can also be used to store reference data that can then be read by a Storm topology. For more information, see [Use Data Lake Store in a Storm topology](#use-data-lake-store-in-a-storm-topology).


> [!NOTE]
Option to create HDInsight clusters with access to Data Lake Store as storage is available only for HDInsight versions 3.2, 3.4, and 3.5.
>

## Prerequisites
Before you begin this tutorial, you must have the following:

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

* **Azure Data Lake Store account**. Follow the instructions at [Get started with Azure Data Lake Store using the Azure Portal](data-lake-store-get-started-portal.md).

* **Upload some sample data to your Azure Data Lake Store account**. Once you have created the account, perform the following tasks to upload some sample data. You'll need this data later in the tutorial to run jobs from an HDInsight cluster that access data in the Data Lake Store.

  * [Create a folder in your Data Lake Store](data-lake-store-get-started-portal.md#createfolder).
  * [Upload a file to your Data Lake Store](data-lake-store-get-started-portal.md#uploaddata). If you are looking for some sample data to upload, you can get the **Ambulance Data** folder from the [Azure Data Lake Git Repository](https://github.com/Azure/usql/tree/master/Examples/Samples/Data/AmbulanceData).

* **Azure Active Directory Service Principal**. Steps in this tutorial provide instructions on how to create a service principal in Azure AD. However, you must be an Azure AD administrator to be able to create a service principal. If you are an Azure AD administrator, you can skip this prerequisite and proceed with the tutorial.

    **If you are not an Azure AD administrator**, you will not be able to perform the steps required to create a service principal. In such a case, your Azure AD administrator must first create a service principal before you can create an HDInsight cluster with Data Lake Store. Also, the service principal must be created using a certificate, as described at [Create a service principal with certificate](../resource-group-authenticate-service-principal.md#create-service-principal-with-certificate).

## Do you learn faster with videos?
Watch the following videos to understand how to provision HDInsight clusters with access to Data Lake Store.

* [Create an HDInsight cluster with access to Data Lake Store](https://mix.office.com/watch/l93xri2yhtp2)
* Once the cluster is set up, [Access data in Data Lake Store using Hive and Pig scripts](https://mix.office.com/watch/1n9g5w0fiqv1q)

## Create an HDInsight cluster with access to Azure Data Lake Store
In this section, you create an HDInsight Hadoop cluster that uses the Data Lake Store as an additional storage. In this release, for a Hadoop cluster, Data Lake Store can only be used as an additional storage for the cluster. The default storage will still be the Azure storage blobs (WASB). So, we'll first create the storage account and storage containers required for the cluster.

1. Sign on to the new [Azure Portal](https://portal.azure.com).

2. Follow the steps at [Create Hadoop clusters in HDInsight](../hdinsight/hdinsight-provision-clusters.md) to start provisioning an HDInsight cluster.

3. On the **Data Source** blade, specify whether you want Azure Storage (WASB) or Data Lake Store as your default storage.

	* **WASB as default storage**. For **Primary Storage Type**, click **Azure Storage**. Specify the details for the storage account and storage container, specify **Location** as **East US 2**, and then click **Cluster AAD Identity**.

    	![Add service principal to HDInsight cluster](./media/data-lake-store-hdinsight-hadoop-use-portal/hdi.adl.1.png "Add service principal to HDInsight cluster")


    * **Azure Data Lake Store as default storage**. Note that you can use this option only with HDInsight 3.5 clusters. Within HDInsight 3.5 clusters this option is not available for HBase cluster type.

    For **Primary Storage Type**, click **Data Lake Store**. Select a Data Lake Store account that already exists, provide a root folder path where the cluster-specific files will be stored (see note below), specify **Location** as **East US 2**, and then click **Cluster AAD Identity**.

    ![Add service principal to HDInsight cluster](./media/data-lake-store-hdinsight-hadoop-use-portal/hdi.adl.1.adls.storage.png "Add service principal to HDInsight cluster")

    > [!NOTE]
    > In the screen capture above, the root folder path is /clusters/myhdiadlcluster, where **myhdiadlcluster** is the name of the cluster being created. In such a case, make sure the **/clusters** folder already exists in the Data Lake Store account. The **myhdiadlcluster** folder will be created during cluster creation. Similarly, if the root path was set to /hdinsight/clusters/data/myhdiadlcluter, you must ensure that **/hdinsight/clusters/data/** already exists in the Data Lake Store account.

4. On the **Cluster AAD Identity** blade, you can choose to select an existing Service Principal or create a new one.

   * **Create a new Service Principal** - In the **Cluster AAD Identity** blade, click **Create new**, click **Service Principal**, and then in the **Create a Service Principal** blade, provide values to create a new service principal. As part of that, a certificate and an Azure Active Directory application is also created. Click **Create**.

     ![Add service principal to HDInsight cluster](./media/data-lake-store-hdinsight-hadoop-use-portal/hdi.adl.2.png "Add service principal to HDInsight cluster")


		On the **Cluster AAD Identity** blade, click **Download Certificate** to download the certificate associated with the service principal you created. This is useful if you want to use the same service principal in the future, while creating additional HDInsight clusters. Click **Select**.

     ![Add service principal to HDInsight cluster](./media/data-lake-store-hdinsight-hadoop-use-portal/hdi.adl.4.png "Add service principal to HDInsight cluster")

	* **Choose an existing Service Principal** - In the **Cluster AAD Identity** blade, click **Use existing**, click **Service Principal**, and then in the **Select a Service Principal** blade, search for an existing service principal. Click a service principal name and then click **Select**.

        ![Add service principal to HDInsight cluster](./media/data-lake-store-hdinsight-hadoop-use-portal/hdi.adl.5.png "Add service principal to HDInsight cluster")

       On the **Cluster AAD Identity** blade, upload the certificate (.pfx) associated with the service principal you selected, and then provide the certificate password.

5. On the **Cluster AAD Identity** blade, click **Manage ADLS Access**. In the next pane, **Select file permissions** is already selected by default, and lists all the Data Lake Store accounts in your subscription. Click the Data Lake Store account that you want to associate with the cluster to list the files and folders in that account. You can then assign permissions at the file or folder level. If you want to associate the permissions at the root level of the account, select the check box next to the account name.

     ![Add service principal to HDInsight cluster](./media/data-lake-store-hdinsight-hadoop-use-portal/hdi.adl.3.png "Add service principal to HDInsight cluster")

	> [!NOTE]
	> If you are using the Data Lake Store account as the default storage for a cluter, you **must** assign the permissions to the service principal at the root level of the Data Lake Store account.

6. If you want to assign permissions for file or folders within an account, select the Data Lake Store account to see the files/folders in the next pane. Select the files/folders, select the permissions (READ/WRITE/EXECUTE) you want to assign on them, specify whether the permissions apply recursively to the child items as well, and then click **Select**.

	![Add service principal to HDInsight cluster](./media/data-lake-store-hdinsight-hadoop-use-portal/hdi.adl.3-1.png "Add service principal to HDInsight cluster")

7. In the next screen, click **Run** to assign the permissions for the Azure Active Directory service principal on the account, file, folder you selected.

	![Add service principal to HDInsight cluster](./media/data-lake-store-hdinsight-hadoop-use-portal/hdi.adl.3-2.png "Add service principal to HDInsight cluster")

8. After the permission are successfully assigned, click **Done** on all the blades till you are back on the **Cluster AAD Identity** blade.

4. Click **Select** on the **Cluster AAD Identity** and then continue with cluster creation as described at [Create Hadoop clusters in HDInsight](../hdinsight/hdinsight-hadoop-create-linux-clusters-portal.md).

5. Once the cluster is provisioned, you can verify that the Service Principal is associated with the HDInsight cluster. To do so, from the cluster blade, click **Cluster AAD Identity** to see the associated Service Principal.

    ![Add service principal to HDInsight cluster](./media/data-lake-store-hdinsight-hadoop-use-portal/hdi.adl.6.png "Add service principal to HDInsight cluster")

## Run test jobs on the HDInsight cluster to use the Azure Data Lake Store
After you have configured an HDInsight cluster, you can run test jobs on the cluster to test that the HDInsight cluster can access data in Azure Data Lake Store. To do so, we will run some hive queries that target the Data Lake Store.

### For a Linux cluster
1. Open the cluster blade for the cluster that you just provisioned and then click **Dashboard**. This opens Ambari for the Linux cluster. When accessing Ambari, you will be prompted to authenticate to the site. Enter the admin (default admin,) account name and password you used when creating the cluster.

    ![Launch cluster dashboard](./media/data-lake-store-hdinsight-hadoop-use-portal/hdiadlcluster1.png "Launch cluster dashboard")

    You can also navigate directly to Ambari by going to https://CLUSTERNAME.azurehdinsight.net in a web browser (where **CLUSTERNAME** is the name of your HDInsight cluster).
2. Open the Hive view. Select the set of squares from the page menu (next to the **Admin** link and button on the right of the page,) to list available views. Select the **Hive** view.

    ![Selecting ambari views](./media/data-lake-store-hdinsight-hadoop-use-portal/selecthiveview.png)
3. You should see a page similar to the following:

    ![Image of the hive view page, containing a query editor section](./media/data-lake-store-hdinsight-hadoop-use-portal/hiveview.png)
4. In the **Query Editor** section of the page, paste the following HiveQL statement into the worksheet:

        CREATE EXTERNAL TABLE vehicles (str string) LOCATION 'adl://mydatalakestore.azuredatalakestore.net:443/mynewfolder'
5. Click the **Execute** button at the bottom of the **Query Editor** to start the query. A **Query Process Results** section should appear beneath the **Query Editor** and display information about the job.
6. Once the query has finished, the **Query Process Results** section will display the results of the operation. The **Results** tab should contain the following information:
7. Run the following query to verify that the table was created.

        SHOW TABLES;

    The **Results** tab should show the following:

        hivesampletable
        vehicles

    **vehicles** is the table you created earlier. **hivesampletable** is a sample table available in all HDInsight clusters by default.
8. You can also run a query to retrieve data from the **vehicles** table.

        SELECT * FROM vehicles LIMIT 5;

### For a Windows cluster
1. Open the cluster blade for the cluster that you just provisioned and then click **Dashboard**.

    ![Launch cluster dashboard](./media/data-lake-store-hdinsight-hadoop-use-portal/hdiadlcluster1.png "Launch cluster dashboard")

    When prompted, enter the administrator credentials for the cluster.
2. This opens the Microsoft Azure HDInsight Query Console. Click **Hive Editor**.

    ![Open Hive editor](./media/data-lake-store-hdinsight-hadoop-use-portal/hdiadlcluster2.png "Open Hive editor")
3. In the Hive Editor, enter the following query and then click **Submit**.

        CREATE EXTERNAL TABLE vehicles (str string) LOCATION 'adl://mydatalakestore.azuredatalakestore.net:443/mynewfolder'

    In this Hive query, we create a table from data stored in Data Lake Store at `adl://mydatalakestore.azuredatalakestore.net:443/mynewfolder`. This location has a sample data file that you should have uploaded earlier.

    The **Job Session** table at the bottom shows the status of the job changing from **Initializing**, to **Running**, to **Completed**. You can also click **View Details** to see more information about the completed job.

    ![Create table](./media/data-lake-store-hdinsight-hadoop-use-portal/hdiadlcluster3.png "Create table")
4. Run the following query to verify that the table was created.

        SHOW TABLES;

    Click **View Details** corresponding to this query and the output should show the following:

        hivesampletable
        vehicles

    **vehicles** is the table you created earlier. **hivesampletable** is a sample table available in all HDInsight clusters by default.
5. You can also run a query to retrieve data from the **vehicles** table.

        SELECT * FROM vehicles LIMIT 5;



## Use Data Lake Store with Spark cluster
You can use Data Lake Store


## Use Data Lake Store in a Storm topology
You can use the Data Lake Store to write data from a Storm topology. For instructions on how to achieve this scenario, see [Use Azure Data Lake Store with Apache Storm with HDInsight](../hdinsight/hdinsight-storm-write-data-lake-store.md).

## See also
* [PowerShell: Create an HDInsight cluster to use Data Lake Store](data-lake-store-hdinsight-hadoop-use-powershell.md)

[makecert]: https://msdn.microsoft.com/library/windows/desktop/ff548309(v=vs.85).aspx
[pvk2pfx]: https://msdn.microsoft.com/library/windows/desktop/ff550672(v=vs.85).aspx
