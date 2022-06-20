---
title: Export historical log data from Microsoft Sentinel for big data analytics
description: Learn how to export large datasets from an Azure Log Analytics workspace to do security analytics.
author: cwatson-cat
ms.author: cwatson
ms.topic: how-to
ms.date: 6/20/2022
---

# Export historical log data from Microsoft Sentinel for big data analytics

Do a one-time export, transform, and partition of historical data in your Azure Log Analytics workspace by using a notebook in Microsoft Sentinel. 

## Prerequisites

To export historical log data from Microsoft Sentinel, you'll need complete the tasks in the following list. The historical data export notebook uses Azure Synapse to work with data at scale.

- [Review the required roles and permissions](notebooks-with-synapse.md#prerequisites)
- [Connect to an Azure Machine Learning workspace](notebooks-with-synapse.md#connect-to-an-azure-machine-learning-workspace)
- [Create an Azure Synapse workspace](notebooks-with-synapse.md#create-an-azure-synapse-workspace) that's linked to Azure Data Lake Storage Gen2 storage
- [Configure your Azure Synapse Analytics integration](notebooks-with-synapse.md#configure-your-azure-synapse-analytics-integration)
- [Set up continuous data export from Log Analytics](../azure-monitor/logs/logs-data-export.md)


## Launch the notebook

1. In Microsoft Sentinel, select **Notebooks**.
1. Select the **Templates** tab.
1. Select the **Export Historical Data** notebook.
1. Select **Create from template** at the bottom right-hand side of the page.
1. In the **Clone notebook** pane, change the notebook name as appropriate.
1. Select your Azure Machine Learning workspace.
1. Select **Save**.
1. After your notebook is deployed, select **Launch Notebook**.

    The notebook opens in your Azure ML workspace, from inside Microsoft Sentinel. For more information, see [Launch a notebook in your Azure ML workspace](notebooks-hunt.md#launch-a-notebook-in-your-azure-ml-workspace).

## Configure the data to export

The notebook **Export Historical Data** gives you step-by-step instructions to export a subset of data from your Log Analytics workspace. Currently, data can only be exported from one table at a time.

To get started, specify the subset of logs you want to export. Use a table name or a specific Kusto Query Language query. Run some exploratory queries in your log analytics workspace to determine which subset of columns or rows you want to export.

## Set the time range

Set the time range from which you want to export data. Specify an end datetime and the number of days before that end datetime to start the query. If you set up a continuous data export rule, set the end datetime to the time when the continuous export was started. To get that time, check the creation time of the export storage container.

Before you run the data export, use the notebook to determine the size of data to be exported and the number of blobs that will be written. You'll want to do this to gauge the costs associated with the data export.

The notebook uses batched, asynchronous calls to the Log Analytics REST API to retrieve data. Due to throttling and rate-limiting, you might need to adjust the default value of the query batch size.Review the detailed notes in the notebook on how to set that value.

Initially, run the cell with only a few days of data to make sure that the cell output contains the expected the expected set of columns and rows.

## Write data to Azure Data Lake

After you run the queries, you can persist the data to Azure Data Lake Gen2 storage. Fill in the details of your storage account in the notebook cell. Any Azure storage account can be used here, but the hierarchical namespace used by Azure Data Lake Gen2 makes moving and repartitioning log data in downstream tasks much more efficient.

You can view and rotate access keys for your storage account by going to the **Access Keys** page in  Azure Storage. Always store and retrieve your keys securely by using a service like Azure Key Vault. Never stored keys as plaintext. You can use other Azure authentication methods like shared access signature (SAS tokens). For more information, see [Authorize requests to Azure Storage](/rest/api/storageservices/authorize-requests-to-azure-storage).

## Partition data by using Apache Spark

You might want to partition the data to allow for more performant data reads. The last section of the notebook re-partitions the exported data by timestamp. This means it splits the data rows across multiple files in multiple directories with rows of data grouped by timestamp. The notebook uses a *year/month/day/hour/five-minute-interval* directory structure for partitions.

Encoding the timestamp values in the file path provides two key benefits:

- The continuously exported and historical log data can be read from in a unified way by any notebooks or data pipelines that consume this data.
- We can minimize the number of required file reads when loading data from a specific time range in downstream tasks.

For a year's worth of historical log data, we may be writing files for over 100,000 separate partitions.So we rely on the multi-executor parallelism in Spark to do this efficiently.

In order to run code on a Synapse Spark pool, specify the name of the linked Azure Synapse workspace and Synapse Spark pool to use.

After you start the Spark session, run the code in a notebook cell on the Spark pool by using the `%%synapse` cell magic at the start of the cell.


If you encounter **UsageError: Line magic function `%synapse` not found**, make sure that you ran the notebook setup cells at the top of the notebook, and that the **azureml-synapse** package was installed successfully.

The last few cells of the notebook write the historical logs to the same location as the continuously exported data, in the same format and with the same partition scheme.

You're now able to process, transform and analyze security log data at scale using Sentinel and Synapse notebooks. Get started by cloning one of our template guided hunting notebooks from the Templates tab under the Notebooks in Sentinel. 

## Next steps

For more information, see:

- [Use Jupyter notebooks to hunt for security threats](notebooks.md)
- [Tutorial: Get started with Jupyter notebooks and MSTICPy in Microsoft Sentinel](notebook-get-started.md)
- [Link Azure Synapse Analytics and Azure Machine Learning workspaces and attach Apache Spark pools(preview)](../machine-learning/how-to-link-synapse-ml-workspaces.md)
- [Create your first Microsoft Sentinel notebook](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/creating-your-first-microsoft-sentinel-notebook/ba-p/2977745) (Blog series)
