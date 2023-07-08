---
title: Hunt on large firewall logs by using a notebook in Microsoft Sentinel and Azure Synapse Analytics
description: Learn how to run big data queries in Azure Synapse Analytics with a sample notebook in Microsoft Sentinel.
author: cwatson-cat
ms.author: cwatson
ms.topic: how-to
ms.date: 7/11/2022
---

# Identify network beaconing on firewall logs by using a notebook in Microsoft Sentinel and Azure Synapse Analytics

Get started with big data hunting in Microsoft Sentinel by using a built-in notebook that uses Azure Synapse Analytics. Use the notebook as a template for a real-world, sample security scenario.

## Prerequisites

If you haven't already, you'll need to complete the following tasks:

- [Review the required roles and permissions](notebooks-with-synapse.md#prerequisites)
- [Connect to an Azure Machine Learning workspace](notebooks-with-synapse.md#connect-to-an-azure-machine-learning-workspace)
- [Create an Azure Synapse workspace](notebooks-with-synapse.md#create-an-azure-synapse-workspace)
- [Configure your Azure Synapse Analytics integration](notebooks-with-synapse.md#configure-your-azure-synapse-analytics-integration)

To hunt on large datasets, also consider the following optional tasks:

- [Set up continuous data export from Log Analytics](../azure-monitor/logs/logs-data-export.md)
- [Export historical log data from Microsoft Sentinel for big data analytics](notebooks-with-synapse-export-data.md)

## Hunt by using a notebook with a sample security scenario

Get started with hunting by using the built-in notebook **Azure Synapse - Detect potential network beaconing using Apache Spark**. Use this built-in notebook as a template and modify it for your organization's needs.

### Launch a notebook

Find a notebook template to save a copy to your Azure Machine Learning workspace.

1. In Microsoft Sentinel, select **Notebooks**.
1. Select the **Templates** tab.
1. Enter **Synapse** in the search bar to find the notebook.
1. Select the **Azure Synapse - Detect potential network beaconing using Apache Spark** notebook.
1. Select **Create from template** at the bottom right-hand side of the page.
1. In the **Clone notebook** pane, change the notebook name as appropriate.
1. Select your Azure Machine Learning workspace.
1. Select **Save**.
1. After your notebook is deployed, select **Launch Notebook**.

    The notebook opens in your Azure Machine Learning workspace, from inside Microsoft Sentinel. For more information, see [Launch a notebook in your Azure Machine Learning workspace](notebooks-hunt.md#launch-a-notebook-in-your-azure-ml-workspace).

1. At the top of the page in your Azure Machine Learning workspace, select a **Compute** instance to use for your notebook server.

    - If you don't have a compute instance, [create a new one](../machine-learning/how-to-create-compute-instance.md?tabs=#create).
    - If you're creating a new compute instance in order to test your notebooks, create your compute instance with the **General Purpose** category.
    - If your compute instance is stopped, make sure to start it. For more information, see [Run a notebook in the Azure Machine Learning studio](../machine-learning/how-to-run-jupyter-notebooks.md).
    - Only you can see and use the compute instances you create. Your user files are stored separately from the VM and are shared among all compute instances in the workspace.
    - The kernel is shown at the top right of your Azure Machine Learning window. If the kernel you need isn't selected, select a different version from the dropdown list.

When your notebook server is created and started, you can start running your notebook cells. For more information, see [Run a notebook or Python script](../machine-learning/how-to-run-jupyter-notebooks.md#run-a-notebook-or-python-script).

If your notebook hangs or you want to start over, restart the kernel and rerun the notebook cells from the beginning. If you restart the kernel, variables and other state are deleted. Rerun any initialization and authentication cells after you restart. To start over, select **Kernel operations** > **Restart kernel**.

### Run hunting queries by using the notebook

Review and run the cells in the notebook to start hunting.

1. Run the cells in the notebook's initial steps to load the required Python libraries and functions and to authenticate to Azure resources.

1. When you get to the cell labeled **Start a Spark Session**, run the cell to start using your Azure Synapse session. Use your Apache Spark pool as the compute for your data preparation and data wrangle tasks instead of using your Azure Machine Learning compute.

1. Run the subsequent cells to configure and run your queries on the data that's now stored in your Azure Data Lake Storage. For example, [update your look back period](notebooks-with-synapse.md#define-your-data-look-back-period) to include data from a specific time range.

1. When you're done with your query, export the results from Azure Data Lake Storage back into your Log Analytics workspace.

    The following code, shown in the **Export results from ADLS** step saves your query results as a single JSON file. Define your directory name and run the cell:

    ```python
    %%synapse
    dir_name = "<dir-name>"  # specify desired directory name
    new_path = adls_path + dir_name
    csl_beacon_pd = csl_beacon_df.coalesce(1).write.format("json").save(new_path)
    ```

1. After you've exported your data, you can stop your Spark session. After you've stopped your Spark session, and subsequent queries are run using the default Azure Machine Learning compute indicated in the **Compute** field at the top of the page.

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
- [Link Azure Synapse Analytics and Azure Machine Learning workspaces and attach Apache Spark pools(preview)](../machine-learning/v1/how-to-link-synapse-ml-workspaces.md)
- [Create your first Microsoft Sentinel notebook](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/creating-your-first-microsoft-sentinel-notebook/ba-p/2977745) (Blog series)
