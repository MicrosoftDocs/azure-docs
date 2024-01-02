---
title: Export and transform historical log data from Microsoft Sentinel for big data analytics
description: Learn how to export and transform large datasets from an Azure Log Analytics workspace to do security analytics.
author: cwatson-cat
ms.author: cwatson
ms.topic: how-to
ms.date: 7/11/2022
---

# Export and transform historical log data from Microsoft Sentinel for big data analytics

Make your large datasets available for advanced analytics and machine learning by exporting and transforming the data from your Log Analytics workspace. Microsoft Sentinel allows you to orchestrate the export, transformation, and storage of large datasets from your Log Analytics workspace by using a notebook. The notebook steps you through a one-time export and transformation of historical data from your Log Analytics workspace to Azure Data Lake Storage Gen2 Storage.

The following diagram shows how large datasets are exported, transformed, and stored for big data analytics by using the Log Analytics continuous data export and the one-time historical data export.

:::image type="content" source="media/notebooks-with-synapse-export-data/export-notebook-process-illustration.png" alt-text="Diagram that shows how large dataset are exported and transformed for big data analytics."  border="false":::

This topic covers how to do a one-time export and transformation of your historical data. We recommend that you set up a continuous log export rule before you export historical logs. For more information, see [Set up continuous data export from Log Analytics](../azure-monitor/logs/logs-data-export.md).

## Prerequisites

Before you get started, make sure you have the appropriate roles and permissions, and that you've completed the tasks in the following list. The historical data export notebook uses Azure Synapse to work with data at scale.

- [Review the required roles and permissions](notebooks-with-synapse.md#prerequisites)
- [Connect to an Azure Machine Learning workspace](notebooks-with-synapse.md#connect-to-an-azure-machine-learning-workspace)
- [Create an Azure Synapse workspace](notebooks-with-synapse.md#create-an-azure-synapse-workspace) that's linked to [Azure Data Lake Storage Gen2 storage](../storage/blobs/create-data-lake-storage-account.md)
- [Configure your Azure Synapse Analytics integration](notebooks-with-synapse.md#configure-your-azure-synapse-analytics-integration)

We recommend that you set up a continuous log export rule before you export historical logs. This step is to make sure there's no gap in the exported logs. We also recommend that data is exported to Azure Data Lake Storage Gen2 to take advantage of hierarchical namespaces. For more information, see:

- [Set up continuous data export from Log Analytics](../azure-monitor/logs/logs-data-export.md)
- [Azure Data Lake Storage Gen2 hierarchical namespace](../storage/blobs/data-lake-storage-namespace.md)

## Launch the notebook

Find the notebook template to save a copy to your Azure Machine Learning workspace.

1. In Microsoft Sentinel, select **Notebooks**.
1. Select the **Templates** tab.
1. Enter **Export** in the search bar to find the notebook.
1. Select the **Azure Synapse - Export Historical Log Data** notebook.

   :::image type="content" source="media/notebooks-with-synapse-export-data/search-export-historical-log-data-template.png" alt-text="Screenshot of notebooks page with template tab selected and search result for Synapse notebook.":::

1. Select **Create from template** at the bottom right-hand side of the page.
1. In the **Clone notebook** pane, change the notebook name as appropriate.
1. Select your Azure Machine Learning workspace.
1. Select **Save**.
1. After your notebook is deployed, select **Launch Notebook**. The notebook opens in your Azure Machine Learning workspace, from inside Microsoft Sentinel.
1. At the top of the page in your Azure Machine Learning workspace, select a **Compute** instance to use for your notebook server.

    - If you don't have a compute instance, [create a new one](../machine-learning/how-to-create-compute-instance.md?tabs=#create).
    - If you're creating a new compute instance in order to test your notebooks, create your compute instance with the **General Purpose** category.
    - If your compute instance is stopped, make sure to start it. For more information, see [Run a notebook in the Azure Machine Learning studio](../machine-learning/how-to-run-jupyter-notebooks.md).
    - Only you can see and use the compute instances you create. Your user files are stored separately from the VM and are shared among all compute instances in the workspace.
    - The kernel is shown at the top right of your Azure Machine Learning window. If the kernel you need isn't selected, select a different version from the dropdown list.

When your notebook server is created and started, you can start running your notebook cells. For more information, see [Run a notebook or Python script](../machine-learning/how-to-run-jupyter-notebooks.md#run-a-notebook-or-python-script).

If your notebook hangs or you want to start over, restart the kernel and rerun the notebook cells from the beginning. If you restart the kernel, variables and other state are deleted. Rerun any initialization and authentication cells after you restart. To start over, go to the select **Kernel operations** > **Restart kernel**.

:::image type="content" source="media/notebooks-with-synapse-export-data/export-notebook-restart-kernel.png" alt-text="Screenshot of menu option to restart kernel in Azure Machine Learning studio.":::

## Configure the data to export

Follow the step-by-step instructions in the notebook to export a subset of data from your Log Analytics workspace. Currently, data can only be exported from one table at a time.

To get started, specify the subset of logs you want to export. Use a table name or a specific query in Kusto Query Language. Run some exploratory queries in your log analytics workspace to determine which subset of columns or rows you want to export.

:::image type="content" source="media/notebooks-with-synapse-export-data/export-notebook-set-table-name.png" alt-text="Screenshot of the cell where you specify the query for a table or subset of data from the table." lightbox="media/notebooks-with-synapse-export-data/export-notebook-set-table-name.png":::

## Set the time range

Before you run the data export, use the notebook to determine the size of data to be exported and the number of blobs that will be written. This step allows you to gauge the costs associated with the data export.

:::image type="content" source="media/notebooks-with-synapse-export-data/export-notebook-time-range.png" alt-text="Screenshot of fetching log data cell where you set the end time and days back.":::

Set the time range from which you want to export data. Initially, run the cell with only a few days of data to make sure that the cell output contains the expected set of columns and rows. Specify an end datetime and the number of days before that end datetime to start the query. If you set up a continuous data export rule, set the end datetime to the time when the continuous export was started. To get that time, check the creation time of the export storage container.  

The notebook uses batched, asynchronous calls to the Log Analytics REST API to retrieve data. Due to throttling and rate-limiting, you might need to adjust the default value of the query batch size. Review the detailed notes in the notebook on how to set that value.

## Write data to Azure Data Lake storage

After you run the queries, you can persist the data to Azure Data Lake Gen2 storage. Fill in the details of your storage account in the notebook cell. Any Azure storage account can be used here, but the hierarchical namespace used by Azure Data Lake Gen2 makes moving and repartitioning log data in downstream tasks much more efficient.

:::image type="content" source="media/notebooks-with-synapse-export-data/export-notebook-storage-account.png" alt-text="Screenshot of cell where you set your storage account information.":::
You can view and rotate access keys for your storage account by going to the **Access Keys** page in  Azure Storage. Always store and retrieve your keys securely by using a service like Azure Key Vault. Never stored keys as plaintext. You can use other Azure authentication methods like shared access signature (SAS tokens). For more information, see [Authorize requests to Azure Storage](/rest/api/storageservices/authorize-requests-to-azure-storage).

## Partition data by using Apache Spark

You might want to partition the data to allow for more performant data reads. The last section of the notebook repartitions the exported data by timestamp. The data rows are split across multiple files in multiple directories with rows of data grouped by timestamp. The notebook uses the directory structure `{base_path}/y=<year>/m=<month>/d=<day>/h=<hour>/m=<5-minute-interval>` for partitions.

Encoding the timestamp values in the file path provides two key benefits:

- The continuously exported and historical log data can be read in a unified way by any notebook or data pipeline that consume this data.
- We can minimize the number of required file reads when loading data from a specific time range in downstream tasks.

For a year's worth of historical log data, we might write files for over 100,000 separate partitions. So we rely on the multi-executor parallelism in Spark to do these writes efficiently.

### Start Spark session

In order to run code on a Synapse Spark pool, specify the name of the linked Azure Synapse workspace and Synapse Spark pool to use.

:::image type="content" source="media/notebooks-with-synapse-export-data/export-notebook-add-linked-service.png" alt-text="Screenshot of the cell where you enter the names of the workspace and Spark pool.":::

 For `linkedservice`, get the Spark pool name by going to **Linked Services** in the left-hand side menu  in Azure Machine Learning studio.

Start the Spark session by running the cell in the  **Start Spark Session** notebook section.

### Repartition data by using PySpark

After you start the Spark session, run the code in a notebook cell on the Spark pool by using the `%%synapse` cell magic at the start of the cell.

If you encounter **UsageError: Line magic function `%synapse` not found**, make sure that you ran the notebook setup cells at the top of the notebook, and that the **azureml-synapse** package was installed successfully.

The last few cells of the notebook write the historical logs to the same location as the continuously exported data, in the same format and with the same partition scheme.

You're now able to process, transform and analyze security log data at scale by using Microsoft Sentinel and Azure Synapse notebooks. Get started by cloning a guided hunting notebook from the **Templates** tab in Microsoft Sentinel.

## Next steps

[Identify network beaconing on firewall logs by using a notebook in Microsoft Sentinel and Azure Synapse Analytics](notebooks-with-synapse-hunt.md)

For more information, see:

- [Blog post: Export Historical Log Data from Microsoft Sentinel](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/export-historical-log-data-from-microsoft-sentinel/ba-p/3413418)
- [Use Jupyter notebooks to hunt for security threats](notebooks.md)
- [Tutorial: Get started with Jupyter notebooks and MSTICPy in Microsoft Sentinel](notebook-get-started.md)
- [Link Azure Synapse Analytics and Azure Machine Learning workspaces and attach Apache Spark pools(preview)](../machine-learning/v1/how-to-link-synapse-ml-workspaces.md)
- [Create your first Microsoft Sentinel notebook](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/creating-your-first-microsoft-sentinel-notebook/ba-p/2977745) (Blog series)
