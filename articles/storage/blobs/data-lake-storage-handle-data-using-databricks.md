---
title: 'Tutorial: Learn to perform extract, load, and transfer operations by using Azure Databricks'
description: In this tutorial, you learn how to extract data from Azure Data Lake Storage Gen2 Preview into Azure Databricks, transform the data, and then load the data into Azure SQL Data Warehouse.
services: storage
author: jamesbak
ms.service: storage
ms.author: jamesbak
ms.topic: tutorial
ms.date: 01/14/2019
ms.component: data-lake-storage-gen2
#Customer intent: As an analytics user, I want to perform an ETL operation so that I can work with my data in my preferred environment.
---

# Tutorial: Extract, transform, and load data by using Azure Databricks

In this tutorial, you perform an ETL (extract, transform, and load data) operation by using Azure Databricks. You extract data from Azure Data Lake Storage Gen2 into Azure Databricks, run transformations on the data in Azure Databricks, and then load the transformed data into Azure SQL Data Warehouse.

The steps in this tutorial use the SQL Data Warehouse connector for Azure Databricks to transfer data to Azure Databricks. This connector, in turn, uses Azure Blob Storage as temporary storage for the data being transferred between an Azure Databricks cluster and Azure SQL Data Warehouse.

This tutorial covers the following tasks:

> [!div class="checklist"]
> * Create an Azure Databricks workspace.
> * Create a Spark cluster in Azure Databricks.
> * Create a file system and upload data to Azure Data Lake Storage Gen2.
> * Create a service principal.
> * Extract data from the Data Lake Store.
> * Transform data in Azure Databricks.
> * Load data into Azure SQL Data Warehouse.

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

To complete this tutorial:

> [!div class="checklist"]
> * Create an Azure SQL data warehouse, create a server-level firewall rule, and connect to the server as a server admin. See [Quickstart: Create an Azure SQL data warehouse](../../sql-data-warehouse/create-data-warehouse-portal.md).
> * Create a database master key for the Azure SQL data warehouse. See [Create a database master key](https://docs.microsoft.com/sql/relational-databases/security/encryption/create-a-database-master-key).
> * Create an Azure Data Lake Storage Gen2 account. See [Create a Azure Data Lake Storage Gen2 account](data-lake-storage-quickstart-create-account.md).
> * Sign in to the [Azure portal](https://portal.azure.com/).

## Create an Azure Databricks workspace

In this section, you create an Azure Databricks workspace by using the Azure portal.

1. In the Azure portal, select **Create a resource** > **Analytics** > **Azure Databricks**.

    ![Databricks on Azure portal](./media/data-lake-storage-handle-data-using-databricks/azure-databricks-on-portal.png "Databricks on Azure portal")

1. Under **Azure Databricks Service**, provide the following values to create a Databricks workspace:

    |Property  |Description  |
    |---------|---------|
    |**Workspace name**     | Provide a name for your Databricks workspace.        |
    |**Subscription**     | From the drop-down, select your Azure subscription.        |
    |**Resource group**     | Specify whether you want to create a new resource group or use an existing one. A resource group is a container that holds related resources for an Azure solution. For more information, see [Azure Resource Group overview](../../azure-resource-manager/resource-group-overview.md). |
    |**Location**     | Select **West US 2**.        |
    |**Pricing Tier**     |  Select **Standard**.     |

    ![Create an Azure Databricks workspace](./media/data-lake-storage-handle-data-using-databricks/create-databricks-workspace.png "Create an Azure Databricks workspace")

1. Select **Pin to dashboard** and then select **Create**.

1. The account creation takes a few minutes. During account creation, the portal displays the **Submitting deployment for Azure Databricks** tile on the right. To monitor the operation status, view the progress bar at the top.

    ![Databricks deployment tile](./media/data-lake-storage-handle-data-using-databricks/databricks-deployment-tile.png "Databricks deployment tile")

## Create a Spark cluster in Azure Databricks

1. In the Azure portal, go to the Databricks workspace that you created, and select **Launch Workspace**.

2. You're redirected to the Azure Databricks portal. From the portal, select **Cluster**.

    ![Databricks on Azure](./media/data-lake-storage-handle-data-using-databricks/databricks-on-azure.png "Databricks on Azure")

3. In the **New cluster** page, provide the values to create a cluster.

    ![Create Databricks Spark cluster on Azure](./media/data-lake-storage-handle-data-using-databricks/create-databricks-spark-cluster.png "Create Databricks Spark cluster on Azure")

4. Fill in values for the following fields, and accept the default values for the other fields:

    * Enter a name for the cluster.

    * For this article, create a cluster with the **5.1** runtime.

    * Make sure you select the **Terminate after \_\_ minutes of inactivity** check box. If the cluster isn't being used, provide a duration (in minutes) to terminate the cluster.

    * Select **Create cluster**. After the cluster is running, you can attach notebooks to the cluster and run Spark jobs.

## Create a file system and upload sample data

First, you create a file system in your Data Lake Storage Gen2 account. Then, you can upload a sample data file to Data Lake Store. You use this file later in Azure Databricks to run some transformations.

1. Download the [small_radio_json.json](https://github.com/Azure/usql/blob/master/Examples/Samples/Data/json/radiowebsite/small_radio_json.json) sample data file to your local file system.

2. From the [Azure portal](https://portal.azure.com/), navigate to the Data Lake Storage Gen2 account that you created as a prerequisite to this tutorial.

3. From the **Overview** page of the storage account, select **Open in Explorer**.

   ![Open Storage Explorer](./media/data-lake-storage-handle-data-using-databricks/data-lake-storage-open-storage-explorer.png "Open Storage Explorer")

4. Select **Open Azure Storage Explorer** to open Storage Explorer.

   ![Open Storage Explorer second prompt](./media/data-lake-storage-handle-data-using-databricks/data-lake-storage-open-storage-explorer-2.png "Open Storage Explorer second prompt")

   Storage Explorer opens. You can create a file system and upload the sample data by using the guidance in this topic: [Quickstart: Use Azure Storage Explorer to manage data in an Azure Data Lake Storage Gen2 account](data-lake-storage-explorer.md).

<a id="service-principal"/>

## Create a service principal

Create a service principal by following the guidance in this topic: [How to: Use the portal to create an Azure AD application and service principal that can access resources](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal).

There's a few specific things that you'll have to do as you perform the steps in that article.

:heavy_check_mark: When performing the steps in the [Create an Azure Active Directory application](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application) section of the article,  make sure to set the **Sign-on URL** field of the **Create** dialog box to the endpoint URI that you just collected.

:heavy_check_mark: When performing the steps in the [Assign the application to a role](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#assign-the-application-to-a-role) section of the article, make sure to assign your application to the **Blob Storage Contributor Role**.

:heavy_check_mark: When performing the steps in the [Get values for signing in](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#get-values-for-signing-in) section of the article, paste the tenant ID, application ID, and authentication key values into a text file. You'll need those soon.
First, you create a notebook in your Azure Databricks workspace and then run code snippets to create the file system in your storage account.

## Extract data from the Data Lake Store

In this section, you create a notebook in Azure Databricks workspace and then run code snippets to extract data from the Data Lake Store into Azure Databricks.

1. In the [Azure portal](https://portal.azure.com), go to the Azure Databricks workspace that you created, and select **Launch Workspace**.

2. On the left, select **Workspace**. From the **Workspace** drop-down, select **Create** > **Notebook**.

    ![Create a notebook in Databricks](./media/data-lake-storage-handle-data-using-databricks/databricks-create-notebook.png "Create notebook in Databricks")

3. In the **Create Notebook** dialog box, enter a name for the notebook. Select **Scala** as the language, and then select the Spark cluster that you created earlier.

    ![Provide details for a notebook in Databricks](./media/data-lake-storage-handle-data-using-databricks/databricks-notebook-details.png "Provide details for a notebook in Databricks")

4. Select **Create**.

5. Copy and paste the following code block into the first cell.

   ```scala
   spark.conf.set("fs.azure.account.auth.type.<storage-account-name>.dfs.core.windows.net", "OAuth")
   spark.conf.set("fs.azure.account.oauth.provider.type.<storage-account-name>.dfs.core.windows.net", org.apache.hadoop.fs.azurebfs.oauth2.ClientCredsTokenProvider")
   spark.conf.set("fs.azure.account.oauth2.client.id.<storage-account-name>.dfs.core.windows.net", "<application-id>")
   spark.conf.set("fs.azure.account.oauth2.client.secret.<storage-account-name>.dfs.core.windows.net", "<authentication-key>")
   spark.conf.set("fs.azure.account.oauth2.client.endpoint.<account-name>.dfs.core.windows.net", "https://login.microsoftonline.com/<tenant-id>/oauth2/token")
   ```

5. In this code block, replace the `application-id`, `authentication-id`, and `tenant-id` placeholder values in this code block with the values that you collected when you completed the steps in the [Set aside storage account configuration](#config). Replace the `storage-account-name` placeholder value with the name of your storage account.

6. Press the **SHIFT + ENTER** keys to run the code in this block.

7. You can now load the sample json file as a data frame in Azure Databricks. Paste the following code in a new cell. Replace the placeholders shown in brackets with your values.

   ```scala
   val df = spark.read.json("abfss://<file-system-name>@<storage-account-name>.dfs.core.windows.net/small_radio_json.json")
   ```

   * Replace the  `file-system-name` placeholder value with the name that you gave your file system in Storage Explorer.

   * Replace the `storage-account-name` placeholder with the name of your storage account.

8. Press the **SHIFT + ENTER** keys to run the code in this block.

9. Run the following code to see the contents of the data frame:

    ```scala
    df.show()
    ```
   You see an output similar to the following snippet:

   ```bash
   +---------------------+---------+---------+------+-------------+----------+---------+-------+--------------------+------+--------+-------------+---------+--------------------+------+-------------+------+
   |               artist|     auth|firstName|gender|itemInSession|  lastName|   length|  level|            location|method|    page| registration|sessionId|                song|status|           ts|userId|
   +---------------------+---------+---------+------+-------------+----------+---------+-------+--------------------+------+--------+-------------+---------+--------------------+------+-------------+------+
   | El Arrebato         |Logged In| Annalyse|     F|            2|Montgomery|234.57914| free  |  Killeen-Temple, TX|   PUT|NextSong|1384448062332|     1879|Quiero Quererte Q...|   200|1409318650332|   309|
   | Creedence Clearwa...|Logged In|   Dylann|     M|            9|    Thomas|340.87138| paid  |       Anchorage, AK|   PUT|NextSong|1400723739332|       10|        Born To Move|   200|1409318653332|    11|
   | Gorillaz            |Logged In|     Liam|     M|           11|     Watts|246.17751| paid  |New York-Newark-J...|   PUT|NextSong|1406279422332|     2047|                DARE|   200|1409318685332|   201|
   ...
   ...
   ```

   You have now extracted the data from Azure Data Lake Storage Gen2 into Azure Databricks.

## Transform data in Azure Databricks

The raw sample data **small_radio_json.json** file captures the audience for a radio station and has a variety of columns. In this section, you transform the data to only retrieve specific columns from the dataset.

1. First, retrieve only the columns **firstName**, **lastName**, **gender**, **location**, and **level** from the dataframe that you created.

   ```scala
   val specificColumnsDf = df.select("firstname", "lastname", "gender", "location", "level")
   specificColumnsDf.show()
   ```

   You receive output as shown in the following snippet:

   ```bash
   +---------+----------+------+--------------------+-----+
   |firstname|  lastname|gender|            location|level|
   +---------+----------+------+--------------------+-----+
   | Annalyse|Montgomery|     F|  Killeen-Temple, TX| free|
   |   Dylann|    Thomas|     M|       Anchorage, AK| paid|
   |     Liam|     Watts|     M|New York-Newark-J...| paid|
   |     Tess|  Townsend|     F|Nashville-Davidso...| free|
   |  Margaux|     Smith|     F|Atlanta-Sandy Spr...| free|
   |     Alan|     Morse|     M|Chicago-Napervill...| paid|
   |Gabriella|   Shelton|     F|San Jose-Sunnyval...| free|
   |   Elijah|  Williams|     M|Detroit-Warren-De...| paid|
   |  Margaux|     Smith|     F|Atlanta-Sandy Spr...| free|
   |     Tess|  Townsend|     F|Nashville-Davidso...| free|
   |     Alan|     Morse|     M|Chicago-Napervill...| paid|
   |     Liam|     Watts|     M|New York-Newark-J...| paid|
   |     Liam|     Watts|     M|New York-Newark-J...| paid|
   |   Dylann|    Thomas|     M|       Anchorage, AK| paid|
   |     Alan|     Morse|     M|Chicago-Napervill...| paid|
   |   Elijah|  Williams|     M|Detroit-Warren-De...| paid|
   |  Margaux|     Smith|     F|Atlanta-Sandy Spr...| free|
   |     Alan|     Morse|     M|Chicago-Napervill...| paid|
   |   Dylann|    Thomas|     M|       Anchorage, AK| paid|
   |  Margaux|     Smith|     F|Atlanta-Sandy Spr...| free|
   +---------+----------+------+--------------------+-----+
   ```

2. You can further transform this data to rename the column **level** to **subscription_type**.

   ```scala
   val renamedColumnsDF = specificColumnsDf.withColumnRenamed("level", "subscription_type")
   renamedColumnsDF.show()
   ```

   You receive output as shown in the following snippet.

   ```bash
   +---------+----------+------+--------------------+-----------------+
   |firstname|  lastname|gender|            location|subscription_type|
   +---------+----------+------+--------------------+-----------------+
   | Annalyse|Montgomery|     F|  Killeen-Temple, TX|             free|
   |   Dylann|    Thomas|     M|       Anchorage, AK|             paid|
   |     Liam|     Watts|     M|New York-Newark-J...|             paid|
   |     Tess|  Townsend|     F|Nashville-Davidso...|             free|
   |  Margaux|     Smith|     F|Atlanta-Sandy Spr...|             free|
   |     Alan|     Morse|     M|Chicago-Napervill...|             paid|
   |Gabriella|   Shelton|     F|San Jose-Sunnyval...|             free|
   |   Elijah|  Williams|     M|Detroit-Warren-De...|             paid|
   |  Margaux|     Smith|     F|Atlanta-Sandy Spr...|             free|
   |     Tess|  Townsend|     F|Nashville-Davidso...|             free|
   |     Alan|     Morse|     M|Chicago-Napervill...|             paid|
   |     Liam|     Watts|     M|New York-Newark-J...|             paid|
   |     Liam|     Watts|     M|New York-Newark-J...|             paid|
   |   Dylann|    Thomas|     M|       Anchorage, AK|             paid|
   |     Alan|     Morse|     M|Chicago-Napervill...|             paid|
   |   Elijah|  Williams|     M|Detroit-Warren-De...|             paid|
   |  Margaux|     Smith|     F|Atlanta-Sandy Spr...|             free|
   |     Alan|     Morse|     M|Chicago-Napervill...|             paid|
   |   Dylann|    Thomas|     M|       Anchorage, AK|             paid|
   |  Margaux|     Smith|     F|Atlanta-Sandy Spr...|             free|
   +---------+----------+------+--------------------+-----------------+
   ```

## Load data into Azure SQL Data Warehouse

In this section, you upload the transformed data into Azure SQL Data Warehouse. You use the Azure SQL Data Warehouse connector for Azure Databricks to directly upload a dataframe as a table in a SQL data warehouse.

The SQL Data Warehouse connector uses Azure Blob storage as temporary storage to upload data between Azure Databricks and Azure SQL Data Warehouse. So, you start by providing the configuration to connect to the storage account. You must already have created the account as part of the prerequisites for this article.

1. Provide the configuration to access the Azure Storage account from Azure Databricks.

   ```scala
   val storageURI = "<STORAGE_ACCOUNT_NAME>.dfs.core.windows.net"
   val fileSystemName = "<FILE_SYSTEM_NAME>"
   val accessKey =  "<ACCESS_KEY>"
   ```

2. Specify a temporary folder to use while moving data between Azure Databricks and Azure SQL Data Warehouse.

   ```scala
   val tempDir = "abfss://" + fileSystemName + "@" + storageURI +"/tempDirs"
   ```

3. Run the following snippet to store Azure Blob storage access keys in the configuration. This action ensures that you don't have to keep the access key in the notebook in plain text.

   ```scala
   val acntInfo = "fs.azure.account.key."+ storageURI
   sc.hadoopConfiguration.set(acntInfo, accessKey)
   ```

4. Provide the values to connect to the Azure SQL Data Warehouse instance. You must have created a SQL data warehouse as a prerequisite.

   ```scala
   //SQL Data Warehouse related settings
   val dwDatabase = "<DATABASE NAME>"
   val dwServer = "<DATABASE SERVER NAME>" 
   val dwUser = "<USER NAME>"
   val dwPass = "<PASSWORD>"
   val dwJdbcPort =  "1433"
   val dwJdbcExtraOptions = "encrypt=true;trustServerCertificate=true;hostNameInCertificate=*.database.windows.net;loginTimeout=30;"
   val sqlDwUrl = "jdbc:sqlserver://" + dwServer + ".database.windows.net:" + dwJdbcPort + ";database=" + dwDatabase + ";user=" + dwUser+";password=" + dwPass + ";$dwJdbcExtraOptions"
   val sqlDwUrlSmall = "jdbc:sqlserver://" + dwServer + ".database.windows.net:" + dwJdbcPort + ";database=" + dwDatabase + ";user=" + dwUser+";password=" + dwPass
   ```

5. Run the following snippet to load the transformed dataframe, **renamedColumnsDF**, as a table in a SQL data warehouse. This snippet creates a table called **SampleTable** in the SQL database.

   ```scala
   spark.conf.set(
       "spark.sql.parquet.writeLegacyFormat",
       "true")

   renamedColumnsDF.write
       .format("com.databricks.spark.sqldw")
       .option("url", sqlDwUrlSmall) 
       .option("dbtable", "SampleTable")
       .option( "forward_spark_azure_storage_credentials","True")
       .option("tempdir", tempDir)
       .mode("overwrite")
       .save()
   ```

6. Connect to the SQL database and verify that you see a database named **SampleTable**.

   ![Verify the sample table](./media/data-lake-storage-handle-data-using-databricks/verify-sample-table.png "Verify sample table")

7. Run a select query to verify the contents of the table. The table should have the same data as the **renamedColumnsDF** dataframe.

    ![Verify the sample table content](./media/data-lake-storage-handle-data-using-databricks/verify-sample-table-content.png "Verify the sample table content")

## Clean up resources

After you finish the tutorial, you can terminate the cluster. From the Azure Databricks workspace, select **Clusters** on the left. For the cluster to terminate, under **Actions**, point to the ellipsis (...) and select the **Terminate** icon.

![Stop a Databricks cluster](./media/data-lake-storage-handle-data-using-databricks/terminate-databricks-cluster.png "Stop a Databricks cluster")

If you don't manually terminate the cluster, it automatically stops, provided you selected the **Terminate after \_\_ minutes of inactivity** check box when you created the cluster. In such a case, the cluster automatically stops if it's been inactive for the specified time.

## Next steps

Advance to the next tutorial to learn how to stream real-time data into Azure Databricks by using Azure Event Hubs.

> [!div class="nextstepaction"]
>[Stream data into Azure Databricks by using Event Hubs](../../azure-databricks/databricks-stream-from-eventhubs.md)
