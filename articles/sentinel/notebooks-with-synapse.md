---
title: Large-scale security analytics using Microsoft Sentinel notebooks and Azure Synapse integration
description: This article describes how run big data queries in Azure Synapse Analytics with Microsoft Sentinel notebooks.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.custom: mvc, ignite-fall-2021
ms.date: 11/09/2021
---

# Large-scale security analytics using Microsoft Sentinel notebooks and Azure Synapse integration (Public preview)

> [!IMPORTANT]
> Microsoft Sentinel notebook integration with Azure Synapse Analytics is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

Integrating Microsoft Sentinel notebooks with Azure Synapse Analytics enables large-scale security analytics.

While KQL and Log Analytics are the primary tools and solutions for querying and analyzing data in Microsoft Sentinel, Azure Synapse provides extra features for big data analysis, with built-in data lake access and the Apache Spark distributed processing engine.

Integrating with Azure Synapse provides:

- **Security big data analytics**, using cost-optimized, fully-managed Azure Synapse Apache Spark compute pool.

- **Cost-effective Data Lake access** to build analytics on historical data via Azure Data Lake Storage Gen2, which is a set of capabilities dedicated to big data analytics, built on top of Azure Blob Storage.

- **Flexibility to integrate data sources** into security operation workflows from multiple sources and formats.

- **PySpark, a Python-based API** for using the Spark framework in combination with Python, reducing the need to learn a new programming language if you're already familiar with Python.

For example, you may want to use notebooks with Azure Synapse to hunt for anomalous behaviors from network firewall logs to detect potential network beaconing, or to train and build machine learning models on top of data collected from a Log Analytics workspace.

## Prerequisites

### Understand Microsoft Sentinel notebooks

We recommend that you learn about Microsoft Sentinel notebooks in general before performing the procedures in this article.

To get started, see and [Use Jupyter notebooks to hunt for security threats](notebooks.md) and [Tutorial: Get started with Jupyter notebooks and MSTICPy in Microsoft Sentinel](notebook-get-started.md).

### Required roles and permissions

To use Azure Synapse with Microsoft Sentinel notebooks, you must have the following roles and permissions:

|Type  |Details  |
|---------|---------|
|**Microsoft Sentinel**     |- The **Microsoft Sentinel Contributor** role, in order to save and launch notebooks from Microsoft Sentinel         |
|**Azure Machine Learning**     |- A resource group-level **Owner** or **Contributor** role, to create a new Azure Machine Learning workspace if needed. <br>- A **Contributor** role on the Azure Machine Learning workspace where you run your Microsoft Sentinel notebooks.    <br><br>For more information, see [Manage access to an Azure Machine Learning workspace](../machine-learning/how-to-assign-roles.md).     |
|**Azure Synapse Analytics**     | - A resource group-level **Owner** role, to create a new Azure Synapse workspace.<br>- A **Contributor** role on the Azure Synapse workspace to run your queries. <br>- An Azure Synapse Analytics **Contributor** role on Synapse Studio   <br><br>For more information, see [Understand the roles required to perform common tasks in Synapse](../synapse-analytics/security/synapse-workspace-understand-what-role-you-need.md).     |
|**Azure Data Lake Storage Gen2**     | - An Azure Log Analytics **Contributor** role, to export data from a Log Analytics workspace<br>- An Azure Blob Storage Contributor role, to query data from a data lake  <br><br>For more information, see [Assign an Azure role](../storage/blobs/assign-azure-role-data-access.md?tabs=portal).|


### Connect to Azure ML and Synapse workspaces

To use Microsoft Sentinel notebooks with Azure Synapse, you must first connect to both an Azure Machine Learning Workspace and an Azure Synapse workspace.

**To create or connect to an Azure Machine Learning workspace**:

Azure Machine learning workspaces are a basic requirement for using notebooks in Microsoft Sentinel.

If you aren't already connected, see [Use Jupyter notebooks to hunt for security threats](notebooks.md).

**To create a new Azure Synapse workspace**:

At the top of the Microsoft Sentinel **Notebooks** page, select **Configure Azure Synapse**, and then select **Create new Azure Synapse workspace**.

> [!NOTE]
> An Azure Data Lake Storage Gen2 is a built-in Data Lake that comes with every Azure Synapse workspace. Make sure to select or create a new Data Lake that is in the same region with your Microsoft Sentinel workspace. This is required for when you export your data, as described later in this article.
>

For more information, see the [Azure Synapse documentation](../synapse-analytics/quickstart-create-workspace.md).


## Configure your Azure Synapse Analytics integration

Microsoft Sentinel provides the built-in, **Azure Synapse - Configure Azure ML and Azure Synapse Analytics** notebook to guide you through the configurations required to integrate with Azure Synapse.

> [!NOTE]
> Configuring your Azure Synapse integration is a one-time procedure, and you only need to run this notebook once for your Microsoft Sentinel workspace.
>

**To run the Azure Synapse - Configure Azure ML and Azure Synapse Analytics notebook**:

1. In Microsoft Sentinel **Notebooks** page, select the **Templates** tab, and enter **Synapse** in the search bar to find the notebook.

1. Locate and select the **Azure Synapse - Configure Azure ML and Azure Synapse Analytics** notebook, and then select **Clone notebook template** at the bottom right.

    In the **Clone notebook** pane, modify the notebook name if needed, select your [Azure Machine Learning workspace](#connect-to-azure-ml-and-synapse-workspaces), and then select **Save**.

1. After your notebook is deployed, select **Launch Notebook** to open it.

    The notebook opens in your Azure ML workspace, inside Microsoft Sentinel. For more information, see [Launch a notebook in your Azure ML workspace](notebooks-hunt.md#launch-a-notebook-in-your-azure-ml-workspace).

1. Run the cells in the notebook's initial steps to load the required Python libraries and functions and to authenticate to Azure resources.

1. Run the cells in step 4, **Configure Azure Synapse Spark Pool**, to create a new [Azure Synapse Apache Spark Pool](../synapse-analytics/spark/apache-spark-pool-configurations.md) to use when running your big data queries.

1. Run the cells in step 5, **Configure Azure ML Workspace and Linked Services** to ensure that your Azure ML workspace can communicate with your Azure Synapse workspace. For more information, see [Link Azure Synapse Analytics and Azure Machine Learning workspaces and attach Apache Spark pools](../machine-learning/how-to-link-synapse-ml-workspaces.md).

1. Run the cells in step 6, **Export Data from Azure Log Analytics to Azure Data Lake Storage Gen2**, to export your data you want to use for your queries from Azure Log Analytics to Azure Data Lake Storage.

After your data is in Azure Data Lake Storage, you're ready to start running big data queries with Azure Synapse. For more information, see [Log Analytics data export in Azure Monitor](../azure-monitor/logs/logs-data-export.md?tabs=portal).

## Hunt on historical data at scale

Microsoft Sentinel provides the built-in **Azure Synapse - Detect potential network beaconing using Apache Spark** notebook. Use this notebook as a template for a real-world, sample security scenario to get started with big data hunting with Microsoft Sentinel and Azure Synapse.

**To detect potential network beaconing using Microsoft Sentinel and Azure Synapse**:

1. In Microsoft Sentinel **Notebooks** page, select the **Templates** tab, and enter **Synapse** in the search bar to find the notebook.

1. Locate and select the **Azure Synapse - Detect potential network beaconing using Apache Spark** notebook, and then select **Clone notebook template** at the bottom right.

    In the **Clone notebook** pane, modify the notebook name if needed, select your [Azure Machine Learning workspace](#connect-to-azure-ml-and-synapse-workspaces), and then select **Save**.

1. After your notebook is deployed, select **Launch Notebook** to open it.

    The notebook opens in your Azure ML workspace, from inside Microsoft Sentinel. For more information, see [Launch a notebook in your Azure ML workspace](notebooks-hunt.md#launch-a-notebook-in-your-azure-ml-workspace).

1. Run the cells in the notebook's initial steps to load the required Python libraries and functions and to authenticate to Azure resources.

1. When you get to the cell labeled **Start a Spark Session**, run the cell to start using your Azure Synapse session, to use your Apache Spark pool as the compute for your data preparation and data wrangle tasks instead of using your Azure ML compute.

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

    > [!TIP]
    > Use these steps as they are to detect potential network beaconing, or use them as a template and modify them for your organization's needs.
    >

## Manage your Azure Synapse session from Microsoft Sentinel

When not in an Azure Synapse session, Microsoft Sentinel defaults to the Azure ML compute selected in the **Compute** field at the top of the **Notebooks** page.

Use the following code, which you can copy from here or the **Azure Synapse - Detect potential network beaconing using Apache Spark** notebook, to start and stop your Azure Synapse session.

### Start an Azure Synapse session from within Microsoft Sentinel

Run the following code:

```python
%synapse start -w $amlworkspace -s $subscription_id -r $resource_group -c $synapse_spark_compute
```

Start all subsequent code cells with `%%synapse` to use the Synapse session that you've started.

For example:

```python
%%synapse

# Primary storage info
account_name = '<storage account name>' # fill in your primary account name
container_name = '<container name>' # fill in your container name
subscription_id = '<subscription if>' # fill in your subscription id
resource_group = '<resource group>' # fill in your resource groups for ADLS
workspace_name = '<Microsoft Sentinel/log analytics workspace name>' # fill in your workspace name
device_vendor = "Fortinet"  # Replace your desired network vendor from commonsecuritylogs

# Datetime and lookback parameters
end_date = "<enter date in the format yyyy-MM-dd e.g.2021-09-17>"  # fill in your input date
lookback_days = 21 # fill in lookback days if you want to run it on historical data. make sure you have historical data available in ADLS
```

### Define your data lookback period

The big data queries in this sample notebook can run on data from a pre-defined date, using the `end-date` parameter, or a longer time range.

For example:

- If you are interested in data from a specific date, specify November 15, 2021 as the current date, and the query will run only on data from November 15, 2021. 

- To define a longer time scope for your query, in addition to the current date, define a lookback parameter. For example, if the `lookback_days` parameter is set to `21` days, and the `end_date` parameter is set to `2021-11-17`, the query will look at data for the 21 days, counting back from November 17, 2021.

In the **Azure Synapse - Detect potential network beaconing using Apache Spark** notebook, you'll find this code in the **Data preparation step**.

For example:

```python
# Datetime and lookback parameters
end_date = "2021-11-17>"  # fill in your input date
lookback_days = "21" # fill in lookback days if you want to run it on historical data. Make sure you have historical data available in ADLS
```

In the example above, the queries will run on data between October 28 - November 17, 2021.

### Stop an Azure Synapse session from within Microsoft Sentinel

Run the following code:

```python
%synapse stop
```

### Switch Azure Synapse workspaces in Microsoft Sentinel

To manage or select a different Synapse workspace than the one you're currently signed in to, use one of the following methods:

- **If you've already created a linked service between your Azure ML and the new Azure Synapse workspace**:

    1. Enter the name for the `linkservice` parameter in the following code cell, then re-run the cell and the subsequent cells:

        ```python
        amlworkspace = "<aml workspace name>"  # fill in your AML workspace name
        subscription_id = "<subscription id>" # fill in your subscription id
        resource_group = '<resource group of AML workspace>' # fill in your resource groups for AML workspace
        linkedservice = '<linked service name>' # fill in your linked service created to connect to synapse workspace
        ```

    1. Make sure to provide a name of the Azure Synapse Spark pool that has been registered and attached to the linked service:

        ```python
        synapse_spark_compute = "<synapse spark compute>"
        ```

- **If you don't yet have a linked service between your Azure ML and Azure Synapse workspaces**, make sure to run the **Azure Synapse – Configure Azure ML and Azure Synapse Analytics** notebook to configure the linked service before running the **Azure Synapse – Detect potential network beaconing using Apache Spark** notebook.

## Next steps

For more information, see:

- [Use Jupyter notebooks to hunt for security threats](notebooks.md)
- [Tutorial: Get started with Jupyter notebooks and MSTICPy in Microsoft Sentinel](notebook-get-started.md)
- [Link Azure Synapse Analytics and Azure Machine Learning workspaces and attach Apache Spark pools(preview)](../machine-learning/how-to-link-synapse-ml-workspaces.md)
- [Create your first Microsoft Sentinel notebook](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/creating-your-first-microsoft-sentinel-notebook/ba-p/2977745) (Blog series)
