---
title: Train and evaluate a regression model for detecting anomalies in Azure Monitor Logs by using Jupyter Notebook
description: This tutorial shows how to use Jupyter Notebook to explore data and fit a custom machine learning algorithm to detect anomalies in Azure Monitor Logs. 
ms.service: azure-monitor
ms.topic: tutorial 
author: guywild
ms.author: guywild
ms.reviewer: ilanawaitser
ms.date: 02/28/2023

# Customer intent:  As a data scientist, I want to use to run custom code on data in Azure Monitor Logs using Jupyter Notebook to gain insights without having to export data outside of Azure Monitor.

---
# Tutorial: Train a regression model on data in Azure Monitor Logs by using Jupyter Notebook

[Jupyter Notebook](https://jupyter.org/) is an open-source web application that lets you create and share documents that contain live code, equations, visualizations, and narrative text. It's a popular data science tool for data cleaning and transformation, numerical simulation, statistical modeling, data visualization, and machine learning. 

In this tutorial, we'll demonstrate how you can create a machine learning model that detects anomalies, similar to [Detect and analyze anomalies using KQL machine learning capabilities in Azure Monitor](../logs/kql-machine-learning-azure-monitor.md). However, instead of using the native machine learning capabilities of KQL, in this tutorial, you'll train and evaluate a custom regression model for detecting anomalies in Azure Monitor Logs on your own. 

This provides you with a number of advantages:

- While the [series_decompose_anomalies()](/azure/data-explorer/kusto/query/series-decompose-anomaliesfunction) function gets you started quickly, without requiring data science and programming skills, you have much more flexibility to refine results and address specific needs by creating your own machine learning models.
- You can work with log data at big scales without have to export data to external services.  
- Running custom code on your web browser lets you get started quickly without having to install Python or other tools on your local computer.

## Process overview

In this tutorial, you'll: 
> [!div class="checklist"]
> * Integrate your Log Analytics workspace with Jupyter Notebook using the [Azure Monitor Query client library](/python/api/overview/azure/monitor-query-readme) and the [Azure Identity client library](https://pypi.org/project/azure-identity/). 
> * Explore and visualize data from your Log Analytics workspace in Jupyter Notebook.
> * Prepare data for model training. 
> * Train and test regression models on historical data.
> * Score new data using the trained model.
> * Ingest anomalies into a custom table in your Log Analytics workspace. 

## Tools you'll use

|Source| Tool | Description |
|---| --- | --- |
|Azure Monitor|[Azure Monitor Query client library](/python/api/overview/azure/monitor-query-readme?view=azure-python) |Lets you run KQL power queries and custom code, including custom machine learning algorithms, in any language. |
||[Data collection rule](../essentials/data-collection-rule-overview.md) and [data collection endpoint](../essentials/data-collection-endpoint-overview.md) | Azure Monitor tools for ingesting data you process in Jupyter Notebook into your Log Analytics workspace. |
|Open source|[Jupyter Notebook](https://jupyter.org/) | Use Jupyter Notebook to run code and queries on log data in Azure Monitor Logs:<br>- Using Microsoft cloud services, such as [Azure Machine Learning](/azure/machine-learning/samples-notebooks), or public services.<br>- Locally, using Microsoft tools, such as [Azure Data Studio](/sql/azure-data-studio/notebooks/notebooks-guidance) or [Visual Studio](https://code.visualstudio.com/docs/datascience/jupyter-notebooks), or open source tools.<br> For more information, see [Notebooks at Microsoft](https://visualstudio.microsoft.com/vs/features/notebooks-at-microsoft/).|
||[Pandas library](https://pandas.pydata.org/) |An open source data analysis and manipulation tool tool for Python. |
||[Plotly](https://spark.apache.org/docs/api/python/index.html)| An open source graphing library for Python. |
||[Scikit-learn](https://scikit-learn.org/stable/)|An open source Python library that implements machine learning algorithms for predictive data analysis.|


## Limitations 

- Executing custom code on a copy of data in the Pandas DataFrame leads to downgraded performance and increased latency compared to [running native KQL operators and functions directly in Azure Monitor](../logs/kql-machine-learning-azure-monitor). 
- [API-related limitations](/azure/azure-monitor/service-limits#la-query-api), which can be overcome as suggested later. 

## Prerequisites 

- An [Azure Machine Learning workspace with a compute instance](../../machine-learning/quickstart-create-resources.md) with:

    - A CPU compute instance type. To use distributed GPU training code, see [Distributed GPU training guide](../../machine-learning/v1/how-to-train-distributed-gpu).  
    - Kernel set to Python 3.8 or higher.
    - [A notebook](../../machine-learning/quickstart-run-notebooks#create-a-new-notebook). 
- A Log Analytics workspace with data in the `AzureDiagnostics` table. 
- The following roles and permissions: Azure Machine Learning (???). 
- Familiarity with data science concepts.  

 ## Install required Python tools

1. Install the [Azure Monitor Query client library for Python](https://docs.microsoft.com/python/api/overview/azure/monitor-query-readme), which lets you execute read-only queries on data in your Log Analytics workspace. 
1. Install the [Azure Identity client library for Python](https://pypi.org/project/azure-identity/), which enables Azure Active Directory token authentication using the Azure SDK. 
1. Install [Plotly](https://plotly.com/python/), a popular Python visualization package.

 ## Integrate your Log Analytics workspace with your notebook 

1. Set up authentication to your Log Analytics workspace using `DefaultAzureCredential` from the `azure-identity` package.

    ```python
    from azure.identity import DefaultAzureCredential
    from azure.monitor.query import LogsQueryClient
    
    credential = DefaultAzureCredential()
    logs_query_client = LogsQueryClient(credential)
    ```
1. Define the functions you'll use to call your Log Analytics workspace, query your data, and visualize the data in a graph.  

    The code snippet below defines three functions:

    - `execQuery(query, start_time, end_time)` - Executes a query within the given time range on a Log Analytics workspace (`workspace_id`), and stores the response in a pandas DataFrame (`my_data`).  
    - `execQueryDemoWorkspace(query)` - Executes the same query on the Log Analytics demo workspace by calling the Azure Log Analytics POST API directly and stores the response in a pandas DataFrame (`my_data`).
    - `showGraph(df, title)` - Creates a graph that plots the `TimeGenerated` values in the DataFrame on the x-axis and the `ActualUsage` values on the y-axis using Plotly.
   
    
## Explore and visualize data from your Log Analytics workspace in Jupyter Notebook

Now that you've integrated your Log Analytics workspace with your notebook, let's look at some data in the workspace by running a query from the notebook:

1. Check how much data you ingested into each of the tables in you Log Analytics workspace each hour over the past week.
    
    This query generates a DataFrame that shows the hourly ingestion in each of the tables in the Log Analytics workspace:  
    
    :::image type="content" source="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-ingestion-all-tables-dataframe.png" alt-text="Screenshot that shows a DataFrame generated in Jupyter Notebook with log ingestion data retrieved from a Log Analytics workspace in Azure Monitor Logs." 

1. Present the data your query returns in a graph.

    ```python
    showGraph(df_allTypes, "All Data Types - last week usage")
    ```

    The resulting graph looks like this:

    :::image type="content" source="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-ingestion-all-tables.png" alt-text="A graph that shows how much data was ingested into each of the tables in a Log Analytics workspace over seven days." lightbox="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-ingestion-all-tables.png":::

    You've successfully queried and visualized log data from your Log Analytics workspace in your notebook.
    
## Prepare data for model training

Model training is an iterative process that begins with data preparation and cleaning, and usually involves experimenting with several models until you find a model that's a good fit for your data set.

In this tutorial, to shorten the process, we'll: 

- Skip the data cleaning step.
- Work with only six data types: `ContainerLog`, `AzureNetworkAnalytics_CL`, `AVSSyslog`, `StorageBlobLogs`, `AzureDiagnostics`, `Perf`.
- Experiment with only two models to see which best fits our data set.

To train a machine learning model on data in your Log Analytics workspace:

1. Retrieve hourly usage data for the selected data types for the three weeks prior to the last week. 
  

    This query generates a DataFrame that shows the hourly ingestion in each of the six tables, as retrieved from the Log Analytics workspace:

    :::image type="content" source="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-ingestion-dataframe.png" alt-text="Screenshot that shows a DataFrame with log ingestion data for the six tables we're exploring in this tutorial." 

1. Present the data from the DataFrame in a graph.

    ```python
    showGraph(my_data, "Historical data usage (3 weeks) - selected data types")
    ```
    The resulting graph looks like this:

    :::image type="content" source="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-historical-ingestion.png" alt-text="A graph that shows hourly usage data for six data types over the last three weeks" lightbox="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-historical-ingestion.png":::


1. Let's expand the timestamp information in the `TimeGenerated` field into `Year`, `Month`, `Day`, `Hour` columns using the Pandas [DatetimeIndex constructor](https://pandas.pydata.org/pandas-docs/stable/user_guide/timeseries.html#time-date-components).
 
    The resulting DataFrame looks like this:

    :::image type="content" source="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-dataframe-split-datetime.png" alt-text="Screenshot that shows a DataFrame with the newly-added Year, Month, Day, and Hour columns.":::
 
1. Split the dataset into a training set and a testing set.

    To validate a machine learning model, we need to use some of the data we have to train the model and some of data to check how well the trained model predicts values the model doesn't yet know.    
    
    Let's use the `scikit-learn` library's [TimeSeriesSplit() time series cross-validator](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html#sklearn.model_selection.TimeSeriesSplit) to split the dataset into a training set and a test set.
    
 
## Train and test regression models on historical data

1. Train and evaluate a [linear regression model](https://scikit-learn.org/stable/modules/linear_model.html).

    This script creates a machine learning pipeline that trains and evaluates a machine learning model using the `scikit-learn` library by:  
     
    - One-hot encoding categorical variables, which in our case are our data types. 
    - Scales numerical features - in our case, hourly usage - to the 0-1 range.

    The linear pipeline score for this model is: 

    :::image type="content" source="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-linear-pipeline-score.png" alt-text="Printout of the scoring results of the linear regression model."::: 

1. Now, let's train and evaluate a [gradient boosting regression model](https://scikit-learn.org/stable/auto_examples/ensemble/plot_gradient_boosting_regression.html).


    The linear pipeline score for this model is: 

    :::image type="content" source="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-gradient-boosting-regression-score.png" alt-text="Printout of the scoring results of the gradient boosting regression model."::: 

    Since the scoring of the gradient boosting regression model is better - in other words, the gradient boosting regression model has a lower error rate - we'll use this model to score new data in our Log Analytics workspace.

1. Save the trained gradient boosting regression model as a [pickle file](https://docs.python.org/library/pickle.html).


## Score new data using the trained model

1. Query data ingestion information for the six data types we selected over the past week.

    This query generates a DataFrame that shows the hourly ingestion over the last week for each of the six tables, as retrieved from the Log Analytics workspace:

    :::image type="content" source="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-new-ingestion.png" alt-text="Screenshot that shows a DataFrame with information about new log ingestion over seven days in the six tables we're exploring in this tutorial." 

1. Present the data from the DataFrame in a graph.

    ```python
    showGraph(new_data, "New data usage (1 week) - selected data types")
    ```
    The resulting graph looks like this:

    :::image type="content" source="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-new-ingestion-graph.png" alt-text="A graph that shows hourly usage data for six data types over seven days." lightbox="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-new-ingestion-graph.png":::

1. Load the gradient boosting regression model from the pickle file and use it to predict values for new data. This is often called scoring.

## Ingest anomalies into a custom table in your Log Analytics workspace

## Next steps

Learn more about: 

- [Log queries in Azure Monitor](log-query-overview.md).
- [How to use Kusto queries](/azure/data-explorer/kusto/query/tutorial?pivots=azuremonitor).
- [Analyze logs in Azure Monitor with KQL](/training/modules/analyze-logs-with-kql/)