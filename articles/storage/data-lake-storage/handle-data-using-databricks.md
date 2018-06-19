---
title: 'Tutorial: Perform ETL operations using Azure Databricks'
description: Learn extract data from Azure Data Lake Storage into Azure Databricks, transform the data, and then load the data into Azure SQL Data Warehouse. 
services: azure-databricks
documentationcenter: ''
author: nitinme
manager: cgronlun

ms.component: data-lake-storage-gen2
ms.service: azure-databricks
ms.custom: mvc
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: "Active"
ms.date: 06/27/2018
ms.author: nitinme

---
# Tutorial: Extract, transform, and load data using Azure Databricks

In this tutorial, you perform an ETL (extract, transform, and load data) operation using Azure Databricks. 

The steps in this tutorial use the SQL Data Warehouse connector for Azure Databricks to transfer data to Azure Databricks. This connector,in turn, uses Azure Data Lake Storage Gen2 as temporary storage for the data being transferred between an Azure Databricks cluster and Azure SQL Data Warehouse.

The following illustration shows the application flow:

![Azure Databricks with Data Lake Storage and SQL Data Warehouse](./media/handle-data-using-databricks/databricks-extract-transform-load-sql-datawarehouse.png "Azure Databricks with Data Lake Storage and SQL Data Warehouse")

This tutorial covers the following tasks: 

> [!div class="checklist"]
> * Create an Azure Databricks workspace
> * Create a Spark cluster in Azure Databricks
> * Create an Azure Data Lake Storage account
> * Upload data to Azure Data Lake Storage
> * Create a notebook in Azure Databricks
> * Extract data from Data Lake Storage
> * Transform data in Azure Databricks
> * Load data into Azure SQL Data Warehouse

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

Before you start with this tutorial, make sure to meet the following requirements:
- Create an Azure SQL Data Warehouse, create a server-level firewall rule, and connect to the server as a server admin. Follow the instructions at [Quickstart: Create an Azure SQL Data Warehouse](../../sql-data-warehouse/create-data-warehouse-portal.md)
- Create a database master key for the Azure SQL Data Warehouse. Follow the instructions at [Create a Database Master Key](https://docs.microsoft.com/sql/relational-databases/security/encryption/create-a-database-master-key).
- [Create a storage account](quickstart-create-account.md) with <-- how to describe this here?

## Log in to the Azure Portal

Log in to the [Azure portal](https://portal.azure.com/).

## Create an Azure Databricks workspace

In this section, you create an Azure Databricks workspace using the Azure portal. 

1. In the Azure portal, select **Create a resource** > **Data + Analytics** > **Azure Databricks**.

    ![Databricks on Azure portal](./media/handle-data-using-databricks/azure-databricks-on-portal.png "Databricks on Azure portal")

3. Under **Azure Databricks Service**, provide the values to create a Databricks workspace.

    ![Create an Azure Databricks workspace](./media/handle-data-using-databricks/create-databricks-workspace.png "Create an Azure Databricks workspace")

    Provide the following values: 
     
    |Property  |Description  |
    |---------|---------|
    |**Workspace name**     | Provide a name for your Databricks workspace        |
    |**Subscription**     | From the drop-down, select your Azure subscription.        |
    |**Resource group**     | Specify whether you want to create a new resource group or use an existing one. A resource group is a container that holds related resources for an Azure solution. For more information, see [Azure Resource Group overview](../../azure-resource-manager/resource-group-overview.md). |
    |**Location**     | Select **East US 2**. For other available regions, see [Azure services available by region](https://azure.microsoft.com/regions/services/).        |
    |**Pricing Tier**     |  Choose between **Standard** or **Premium**. For more information on these tiers, see [Databricks pricing page](https://azure.microsoft.com/pricing/details/databricks/).       |

    Select **Pin to dashboard** and then select **Create**.

4. The account creation takes a few minutes. During account creation, the portal displays the **Submitting deployment for Azure Databricks** tile on the right side. You may need to scroll right on your dashboard to see the tile. There is also a progress bar displayed near the top of the screen. You can watch either area for progress.

    ![Databricks deployment tile](./media/handle-data-using-databricks/databricks-deployment-tile.png "Databricks deployment tile")

## Create a Spark cluster in Databricks

1. In the Azure portal, go to the Databricks workspace that you created, and then select **Launch Workspace**.

2. You are redirected to the Azure Databricks portal. From the portal, select **Cluster**.

    ![Databricks on Azure](./media/handle-data-using-databricks/databricks-on-azure.png "Databricks on Azure")

3. In the **New cluster** page, provide the values to create a cluster.

    ![Create Databricks Spark cluster on Azure](./media/handle-data-using-databricks/create-databricks-spark-cluster.png "Create Databricks Spark cluster on Azure")

    Accept all other default values other than the following:

    * Enter a name for the cluster.
    * For this article, create a cluster with **4.0** runtime. 
    * Make sure you select the **Terminate after ____ minutes of inactivity** checkbox. Provide a duration (in minutes) to terminate the cluster, if the cluster is not being used.
    
    Select **Create cluster**. Once the cluster is running, you can attach notebooks to the cluster and run Spark jobs.

## Mount Storage Account to DataBricks

Next, return to the Azure Portal and navigate to your storage account settings.

1. Click **Browse blobs** under the *Blob Service* section
2. Click the new container button (![New Container Button](./media/handle-data-using-databricks/storage-account-add-container.png))
3. Enter **dbricks** in the *Name* field
4. Select **Private** for the *Public Access Level* field
5. Click **OK**

Return to the DataBricks tab and continue with the following steps:

1. Click **Azure DataBricks** on the top left of the nav bar
2. Click **Notebook** under the *New* section on the bottom half of the page
3. Enter **Flight Data Analytics** in the *Name* field (leave all other fields with default values)
4. Click **Create**
5. Paste the following code into the **Cmd 1** cell (this code auto-saves in the editor)

> [!IMPORTANT]
> Make sure you replace the **<YOUR_STORAGE_ACCOUNT_NAME>** AND **<YOUR_ACCESS_KEY>** placeholders with the corresponding values you set aside in a previous step.

```python
accountname = '<YOUR_STORAGE_ACCOUNT_NAME>'
accountkey = '<YOUR_ACCESS_KEY>'
fullname = "fs.azure.account.key." +accountname+ ".dfs.core.windows.net"
accountsource = "abfs://dbricks@" +accountname+ ".dfs.core.windows.net/folder1"
dbutils.fs.mount(
  source = accountsource,
  mount_point = "/mnt/temp",
  extra_configs = { fullname : accountkey }
) 
```
6. Press **Cmd + Enter** to run the Python script

Your storage container is now mounted. You should see *Out[x] = true* as ouput from the script.

## Upload data to the storage account

The next step is to upload a sample data file to the storage account to later tranform in Azure Databricks. The sample data (**small_radio_json.json**) is available in the [U-SQL Examples and Issue Tracking](https://github.com/Azure/usql/blob/master/Examples/Samples/Data/json/radiowebsite/small_radio_json.json) repo. Download the JSON file and make note of the path where you save the file.

The method you use to upload data into your storage account differs depending on if you you have the Heirarchial Namespace Service (HNS) enabled.

**todo** add links to the paragraph below

If the HNS is enabled, then you may use ADF, distp or the AzCopy (new version) to handle the upload. If the HNS is not enabled, then you can use the Blob Storage SDKs, PowerShell, Storage Explorer or AzCopy (old version).

Once uploaded the **small_radio_json.json** should be available in the root of the storage file system at this location:

```bash
abfs://<FILE_SYSTEM_NAME>@<ACCOUNT_NAME>.dfs.core.windows.net/small_radio_json.json
```

The following steps demonstrate how to use AzCopy to upload data in the event that you have the HNS enabled.

1. Open the **Cloud Shell** by clicking on the Cloud Shell icon (![Cloud shell icon](./media/using-databricks-spark/cloud-shell-icon.png))
2. Select **Bash (Linux)** from the left drop-down (if not already selected)

> [!IMPORTANT]
> Make sure you replace the placeholders **<YOUR_LOCAL_DOWNLOAD_FILE_PATH>**, **<YOUR_ACCOUNT_NAME>** and **<YOUR_ACCOUNT_KEY>** with the corresponding values you set aside in a previous step.

```bash
azcopy --source "<LOCAL_FILE_PATH_TO_JSON_FILE>" \
  --destination https://<YOUR_ACCOUNT_NAME>.blob.core.windows.net/dbricks \
  --dest-key "<YOUR_ACCOUNT_KEY>" \
  --include "folder1/" \
  --sync-copy \
  --recursive
```

## Extract data from Azure Storage

In this section, you create a notebook in Azure Databricks workspace and then run code snippets to extract data from your storage account into Azure Databricks.

1. In the [Azure portal](https://portal.azure.com), go to the Azure Databricks workspace you created, and then select **Launch Workspace**.

2. In the left pane, select **Workspace**. From the **Workspace** drop-down, select **Create** > **Notebook**.

    ![Create notebook in Databricks](./media/handle-data-using-databricks/databricks-create-notebook.png "Create notebook in Databricks")

2. In the **Create Notebook** dialog box, enter a name for the notebook. Select **Scala** as the language, and then select the Spark cluster that you created earlier.

    ![Create notebook in Databricks](./media/handle-data-using-databricks/databricks-notebook-details.png "Create notebook in Databricks")

    Select **Create**.

3. Add the following snippet in an empty code cell and replace the placeholder values with the values you saved earlier from the storage account.

    ```python
    dbutils.widgets.text("storage_account_name", "STORAGE_ACCOUNT_NAME", "<YOUR_STORAGE_ACCOUNT_NAME>")
    dbutils.widgets.text("storage_account_access_key", "YOUR_ACCESS_KEY", "<YOUR_STORAGE_ACCOUNT_SHARED_KEY>")
    ```

    Press **SHIFT + ENTER** to run the code cell.

4. You can now load the sample json file as a dataframe in Azure Databricks. Paste the following code in a new cell, and then press **SHIFT + ENTER** (making sure to replace the placeholder values).
    
    ```python
    val df = spark.read.json("abfs://<FILE_SYSTEM_NAME>@<ACCOUNT_NAME>.dfs.core.windows.net/small_radio_json.json")
    ```

5. Run the following code to see the contents of the data frame.

    ```python
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

You have now extracted the data from Azure Data Lake Storage into Azure Databricks.

## Transform data in Azure Databricks

The raw sample data **small_radio_json.json** captures the audience for a radio station and has a variety of columns. In this section, you transform the data to only retrieve specific columns in from the dataset. 

1. Start by retrieving only the columns *firstName*, *lastName*, *gender*, *location*, and *level* from the dataframe you already created.

    ```python
    val specificColumnsDf = df.select("firstname", "lastname", "gender", "location", "level")
    ```

    You get an output as shown in the following snippet:

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

2.  You can further transform this data to rename the column **level** to **subscription_type**.

    ```python
    val renamedColumnsDF = specificColumnsDf.withColumnRenamed("level", "subscription_type")
    renamedColumnsDF.show()
    ```

    You get an output as shown in the following snippet.

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

In this section, you upload the transformed data into Azure SQL Data Warehouse. Using the Azure SQL Data Warehouse connector for Azure Databricks, you can directly upload a dataframe as a table in SQL data warehouse.

As mentioned earlier, the SQL date warehouse connector uses Azure Blob Storage as a temporary storage to upload data between Azure Databricks and Azure SQL Data Warehouse. So, you start by providing the configuration to connect to the storage account. You must have already created the account as part of the prerequisites for this article.

1. Provide the configuration to access the Azure Storage account from Azure Databricks.

    ```python
    val storageURI = "<STORAGE_ACCOUNT_NAME>.dfs.core.windows.net"
    val fileSystemName = "<FILE_SYSTEM_NJAME>"
    val accessKey =  "<ACCESS_KEY>"
    ```

2. Specify a temporary folder that will be used while moving data between Azure Databricks and Azure SQL Data Warehouse.

    ```python
    val tempDir = "abfs://" + fileSystemName + "@" + storageURI +"/tempDirs"
    ```

3. Run the following snippet to store Azure Blob storage access keys in the configuration. This ensures that you do not have to keep the access key in the notebook in plain text.

    ```python
    val acntInfo = "fs.azure.account.key."+ storageURI
    sc.hadoopConfiguration.set(acntInfo, accessKey)
    ```

4. Provide the values to connect to the Azure SQL Data Warehouse instance. You must have created a SQL data warehouse as part of the prerequisites.

    ```python
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

5. Run the following snippet to load the transformed dataframe, **renamedColumnsDF**, as a table in SQL data warehouse. This snippet creates a table called **SampleTable** in the SQL database.

    ```python
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

6. Connect to the SQL database and verify that you see a **SampleTable**.

    ![Verify sample table](./media/handle-data-using-databricks/verify-sample-table.png "Verify sample table")

7. Run a select query to verify the contents of the table. It should have the same data as the **renamedColumnsDF** dataframe.

    ![Verify sample table content](./media/handle-data-using-databricks/verify-sample-table-content.png "Verify sample table content")

## Clean up resources

After you have finished running the tutorial, you can terminate the cluster. To do so, from the Azure Databricks workspace, from the left pane, select **Clusters**. For the cluster you want to terminate, move the cursor over the ellipsis under **Actions** column, and select the **Terminate** icon.

![Stop a Databricks cluster](./media/handle-data-using-databricks/terminate-databricks-cluster.png "Stop a Databricks cluster")

If you do not manually terminate the cluster it will automatically stop, provided you selected the **Terminate after __ minutes of inactivity** checkbox while creating the cluster. In such a case, the cluster automatically stops if it has been inactive for the specified time.

## Next steps 
In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create an Azure Databricks workspace
> * Create a Spark cluster in Azure Databricks
> * Create an Azure Data Lake Storage account
> * Upload data to Azure Data Lake Storage
> * Create a notebook in Azure Databricks
> * Extract data from Data Lake Storage
> * Transform data in Azure Databricks
> * Load data into Azure SQL Data Warehouse

Advance to the next tutorial to learn about streaming real-time data into Azure Databricks using Azure Event Hubs.

> [!div class="nextstepaction"]
>[Stream data into Azure Databricks using Event Hubs](../../azure-databricks/databricks-stream-from-eventhubs.md)
