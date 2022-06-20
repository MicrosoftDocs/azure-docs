---
title: Export historical log data from Microsoft Sentinel for big data analytics
description: Learn how to export large datasets from an Azure Log Analytics workspace to do security analytics.
author: cwatson-cat
ms.author: cwatson
ms.topic: how-to
ms.date: 6/20/2022
---

# Export historical log data from Microsoft Sentinel for big data analytics

Do a one-time export, transform, and partition of historical data in your Azure Log Analytics workspace by using a notebook in Microsoft Sentinel. Then set up continuous data exports by using the Microsoft Sentinel data export tool.

## Prerequisites

The historical data export notebook uses Azure Synapse to work with data at scale.

- [Review the required roles and permissions](notebooks-with-synapse.md#prerequisites)
- [Connect to an Azure Machine Learning workspace](notebooks-with-synapse.md#connect-to-an-azure-machine-learning-workspace)
- [Create an Azure Synapse workspace](notebooks-with-synapse.md#create-an-azure-synapse-workspace)
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

## Set the time range

## Write data to Azure Data Lake

## Partition data by using Spark

Review and run the cells in the notebook to start hunting.

1. Run the cells in the notebook's initial steps to load the required Python libraries and functions and to authenticate to Azure resources.

1. When you get to the cell labeled **Start a Spark Session**, run the cell to start using your Azure Synapse session. Use your Apache Spark pool as the compute for your data preparation and data wrangle tasks instead of using your Azure ML compute.

1. Run the subsequent cells to configure and run your queries on the data that's now stored in your Azure Data Lake Storage. For example, [update your lookback period](#define-your-data-lookback-period) to include data from a specific time range.

1. When you're done with your query, export the results from Azure Data Lake Storage back into your Log Analytics workspace.

    The following code, shown in the **Export results from ADLS** step saves your query results as a single JSON file. Define your directory name and run the cell:

    ```python
    %%synapse
    dir_name = "<dir-name>"  # specify desired directory name
    new_path = adls_path + dir_name
    csl_beacon_pd = csl_beacon_df.coalesce(1).write.format("json").save(new_path)
    ```

1. After you have exported your data, you can stop your Spark session. After you've stopped your Spark session, and subsequent queries are run using the default Azure ML compute indicated in the **Compute** field at the top of the page.

    Run the cell in the **Stop Spark Session** step:

    ```python
    %synapse stop
    ```

1. Export your JSON file with your query results from Azure Data Lake Storage to a local file system.

    Use the code in the **Export results from ADLS to local filesystem**, **Download the files from ADLS**, and **Display results** steps to save your JSON file locally and view them.

1. After you've saved your results locally, you can enrich them with extra data and run visualizations. For example, the **Azure Synapse - Detect potential network beaconing using Apache Spark** notebook provides extra steps, to take the following actions:

    - Enrich results with IP address GeoLocation, WhoIs, and other threat intelligence data, to have a more complete picture of the anomalous network behaviors.
    - Run MSTICPy visualizations to map locations while looking at the distribution of remote network connections or other events.

    The results can be written back to Microsoft Sentinel for further investigation. For example, you can create custom incidents, watchlists, or hunting bookmarks from the results.

    Use these steps as they are to detect potential network beaconing, or use them as a template and modify them for your organization's needs.
    
## Next steps

For more information, see:

- [Use Jupyter notebooks to hunt for security threats](notebooks.md)
- [Tutorial: Get started with Jupyter notebooks and MSTICPy in Microsoft Sentinel](notebook-get-started.md)
- [Link Azure Synapse Analytics and Azure Machine Learning workspaces and attach Apache Spark pools(preview)](../machine-learning/how-to-link-synapse-ml-workspaces.md)
- [Create your first Microsoft Sentinel notebook](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/creating-your-first-microsoft-sentinel-notebook/ba-p/2977745) (Blog series)
