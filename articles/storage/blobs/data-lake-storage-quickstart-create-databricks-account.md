---
title: 'Quickstart: Analyze data in Azure Data Lake Storage Gen2 by using Azure Databricks | Microsoft Docs'
description: Learn to run a Spark job on Azure Databricks by using the Azure portal and an Azure Data Lake Storage Gen2 storage account.
author: normesta
ms.author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: quickstart
ms.date: 06/12/2020
ms.reviewer: jeking
---

# Quickstart: Analyze data with Databricks

In this quickstart, you run an Apache Spark job using Azure Databricks to perform analytics on data stored in a storage account. As part of the Spark job, you'll analyze a radio channel subscription data to gain insights into free/paid usage based on demographics.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

* The name of your Azure Data Lake Gen2 storage account. [Create an Azure Data Lake Storage Gen2 storage account](data-lake-storage-quickstart-create-account.md).

* The tenant ID, app ID, and password of an Azure service principal with an assigned role of **Storage Blob Data Contributor**. [Create a service principal](../../active-directory/develop/howto-create-service-principal-portal.md).

  > [!IMPORTANT]
  > Assign the role in the scope of the Data Lake Storage Gen2 storage account. You can assign a role to the parent resource group or subscription, but you'll receive permissions-related errors until those role assignments propagate to the storage account.

## Create an Azure Databricks workspace

In this section, you create an Azure Databricks workspace using the Azure portal.

1. In the Azure portal, select **Create a resource** > **Analytics** > **Azure Databricks**.

    ![Databricks on Azure portal](./media/data-lake-storage-quickstart-create-databricks-account/azure-databricks-on-portal.png "Databricks on Azure portal")

2. Under **Azure Databricks Service**, provide the values to create a Databricks workspace.

    ![Create an Azure Databricks workspace](./media/data-lake-storage-quickstart-create-databricks-account/create-databricks-workspace.png "Create an Azure Databricks workspace")

    Provide the following values:

    |Property  |Description  |
    |---------|---------|
    |**Workspace name**     | Provide a name for your Databricks workspace        |
    |**Subscription**     | From the drop-down, select your Azure subscription.        |
    |**Resource group**     | Specify whether you want to create a new resource group or use an existing one. A resource group is a container that holds related resources for an Azure solution. For more information, see [Azure Resource Group overview](../../azure-resource-manager/management/overview.md). |
    |**Location**     | Select **West US 2**. Feel free to select another public region if you prefer.        |
    |**Pricing Tier**     |  Choose between **Standard** or **Premium**. For more information on these tiers, see [Databricks pricing page](https://azure.microsoft.com/pricing/details/databricks/).       |

3. The account creation takes a few minutes. To monitor the operation status, view the progress bar at the top.

4. Select **Pin to dashboard** and then select **Create**.

## Create a Spark cluster in Databricks

1. In the Azure portal, go to the Databricks workspace that you created, and then select **Launch Workspace**.

2. You are redirected to the Azure Databricks portal. From the portal, select **New** > **Cluster**.

    ![Databricks on Azure](./media/data-lake-storage-quickstart-create-databricks-account/databricks-on-azure.png "Databricks on Azure")

3. In the **New cluster** page, provide the values to create a cluster.

    ![Create Databricks Spark cluster on Azure](./media/data-lake-storage-quickstart-create-databricks-account/create-databricks-spark-cluster.png "Create Databricks Spark cluster on Azure")

    Fill in values for the following fields, and accept the default values for the other fields:

    - Enter a name for the cluster.
     
    - Make sure you select the **Terminate after 120 minutes of inactivity** checkbox. Provide a duration (in minutes) to terminate the cluster, if the cluster is not being used.

4. Select **Create cluster**. Once the cluster is running, you can attach notebooks to the cluster and run Spark jobs.

For more information on creating clusters, see [Create a Spark cluster in Azure Databricks](https://docs.azuredatabricks.net/user-guide/clusters/create.html).

## Create notebook

In this section, you create a notebook in Azure Databricks workspace and then run code snippets to configure the storage account.

1. In the [Azure portal](https://portal.azure.com), go to the Azure Databricks workspace you created, and then select **Launch Workspace**.

2. In the left pane, select **Workspace**. From the **Workspace** drop-down, select **Create** > **Notebook**.

    ![Create notebook in Databricks](./media/data-lake-storage-quickstart-create-databricks-account/databricks-create-notebook.png "Create notebook in Databricks")

3. In the **Create Notebook** dialog box, enter a name for the notebook. Select **Scala** as the language, and then select the Spark cluster that you created earlier.

    ![Create notebook in Databricks](./media/data-lake-storage-quickstart-create-databricks-account/databricks-notebook-details.png "Create notebook in Databricks")

    Select **Create**.

4. Copy and paste the following code block into the first cell, but don't run this code yet.

   ```scala
   spark.conf.set("fs.azure.account.auth.type.<storage-account-name>.dfs.core.windows.net", "OAuth")
   spark.conf.set("fs.azure.account.oauth.provider.type.<storage-account-name>.dfs.core.windows.net", "org.apache.hadoop.fs.azurebfs.oauth2.ClientCredsTokenProvider")
   spark.conf.set("fs.azure.account.oauth2.client.id.<storage-account-name>.dfs.core.windows.net", "<appID>")
   spark.conf.set("fs.azure.account.oauth2.client.secret.<storage-account-name>.dfs.core.windows.net", "<password>")
   spark.conf.set("fs.azure.account.oauth2.client.endpoint.<storage-account-name>.dfs.core.windows.net", "https://login.microsoftonline.com/<tenant-id>/oauth2/token")
   spark.conf.set("fs.azure.createRemoteFileSystemDuringInitialization", "true")
   dbutils.fs.ls("abfss://<container-name>@<storage-account-name>.dfs.core.windows.net/")
   spark.conf.set("fs.azure.createRemoteFileSystemDuringInitialization", "false")

   ```
5. In this code block, replace the `storage-account-name`, `appID`, `password`, and `tenant-id` placeholder values in this code block with the values that you collected when you created the service principal. Set the `container-name` placeholder value to whatever name you want to give the container.

6. Press the **SHIFT + ENTER** keys to run the code in this block.

## Ingest sample data

Before you begin with this section, you must complete the following prerequisites:

Enter the following code into a notebook cell:

    %sh wget -P /tmp https://raw.githubusercontent.com/Azure/usql/master/Examples/Samples/Data/json/radiowebsite/small_radio_json.json

In the cell, press **SHIFT + ENTER** to run the code.

Now in a new cell below this one, enter the following code, and replace the values that appear in brackets with the same values you used earlier:

    dbutils.fs.cp("file:///tmp/small_radio_json.json", "abfss://<container-name>@<storage-account-name>.dfs.core.windows.net/")

In the cell, press **SHIFT + ENTER** to run the code.

## Run a Spark SQL Job

Perform the following tasks to run a Spark SQL job on the data.

1. Run a SQL statement to create a temporary table using data from the sample JSON data file, **small_radio_json.json**. In the following snippet, replace the placeholder values with your container name and storage account name. Using the notebook you created earlier, paste the snippet in a new code cell in the notebook, and then press SHIFT + ENTER.

    ```sql
    %sql
    DROP TABLE IF EXISTS radio_sample_data;
    CREATE TABLE radio_sample_data
    USING json
    OPTIONS (
     path  "abfss://<container-name>@<storage-account-name>.dfs.core.windows.net/small_radio_json.json"
    )
    ```

    Once the command successfully completes, you have all the data from the JSON file as a table in Databricks cluster.

    The `%sql` language magic command enables you to run a SQL code from the notebook, even if the notebook is of another type. For more information, see [Mixing languages in a notebook](https://docs.azuredatabricks.net/user-guide/notebooks/index.html#mixing-languages-in-a-notebook).

2. Let's look at a snapshot of the sample JSON data to better understand the query that you run. Paste the following snippet in the code cell and press **SHIFT + ENTER**.

    ```sql
    %sql
    SELECT * from radio_sample_data
    ```

3. You see a tabular output like shown in the following screenshot (only some columns are shown):

    ![Sample JSON data](./media/data-lake-storage-quickstart-create-databricks-account/databricks-sample-csv-data.png "Sample JSON data")

    Among other details, the sample data captures the gender of the audience of a radio channel (column name, **gender**) and whether their subscription is free or paid (column name, **level**).

4. You now create a visual representation of this data to show for each gender, how many users have free accounts and how many are paid subscribers. From the bottom of the tabular output, click the **Bar chart** icon, and then click **Plot Options**.

    ![Create bar chart](./media/data-lake-storage-quickstart-create-databricks-account/create-plots-databricks-notebook.png "Create bar chart")

5. In **Customize Plot**, drag-and-drop values as shown in the screenshot.

    ![Customize bar chart](./media/data-lake-storage-quickstart-create-databricks-account/databricks-notebook-customize-plot.png "Customize bar chart")

    - Set **Keys** to **gender**.
    - Set **Series groupings** to **level**.
    - Set **Values** to **level**.
    - Set **Aggregation** to **COUNT**.

6. Click **Apply**.

7. The output shows the visual representation as depicted in the following screenshot:

     ![Customize bar chart](./media/data-lake-storage-quickstart-create-databricks-account/databricks-sql-query-output-bar-chart.png "Customize bar chart")

## Clean up resources

Once you're finished with this article, you can terminate the cluster. From the Azure Databricks workspace, select **Clusters** and locate the cluster you want to terminate. Hover your mouse cursor over the ellipsis under **Actions** column, and select the **Terminate** icon.

![Stop a Databricks cluster](./media/data-lake-storage-quickstart-create-databricks-account/terminate-databricks-cluster.png "Stop a Databricks cluster")

If you do not manually terminate the cluster it automatically stops, provided you selected the **Terminate after \_\_ minutes of inactivity** checkbox while creating the cluster. If you set this option the cluster stops after it has been inactive for the designated amount of time.

## Next steps

In this article, you created a Spark cluster in Azure Databricks and ran a Spark job using data in a storage account with Data Lake Storage Gen2 enabled.

Advance to the next article to learn how to perform an ETL operation (extract, transform, and load data) using Azure Databricks.

> [!div class="nextstepaction"]
>[Extract, transform, and load data using Azure Databricks](../../azure-databricks/databricks-extract-load-sql-data-warehouse.md).

- To learn how to import data from other data sources into Azure Databricks, see [Spark data sources](https://docs.azuredatabricks.net/spark/latest/data-sources/index.html).

- To learn about other ways to access Azure Data Lake Storage Gen2 from an Azure Databricks workspace, see [Azure Data Lake Storage Gen2](https://docs.azuredatabricks.net/spark/latest/data-sources/azure/azure-datalake-gen2.html).
