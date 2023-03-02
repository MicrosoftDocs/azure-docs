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
# Train a regression model to detect anomalies in Azure Monitor Logs by using Jupyter Notebook

[Jupyter Notebook](https://jupyter.org/) is an open-source web application that lets you create and share documents that contain live code, equations, visualizations, and narrative text. It's a popular data science tool for data cleaning and transformation, numerical simulation, statistical modeling, data visualization, and machine learning. 

In this tutorial, we'll demonstrate how you can create a machine learning model that detects anomalies, similar to [Detect and analyze anomalies using KQL machine learning capabilities in Azure Monitor](../logs/kql-machine-learning-azure-monitor.md). However, instead of using the native machine learning capabilities of KQL, in this tutorial, you'll train and evaluate a custom regression model for detecting anomalies in Azure Monitor Logs on your own. 

This provides you with a number of advantages:

- While the [series_decompose_anomalies()](/azure/data-explorer/kusto/query/series-decompose-anomaliesfunction) function gets you started quickly, without requiring data science and programming skills, you have much more flexibility to refine results and address specific needs by creating your own machine learning models.
- You can work with log data at big scales without have to export data to external services.  
- Running custom code on using your web browser lets you get started quickly without having to install Python or other tools on your local computer.

## Process overview

In this tutorial, you'll: 

1. Create a new [Jupyter Notebook](https://jupyter.org/) in Azure Machine Learning. 
1. Integrate your Log Analytics workspace with your notebook using the [Azure Monitor Query client library](/python/api/overview/azure/monitor-query-readme) and the [Azure Identity client library](https://pypi.org/project/azure-identity/). 
1. Run KQL queries and custom code on data in the Log Analytics workspace from the notebook.
1. Explore and visualize log data in your notebook using Graphly. 
1. Ingest anomalies into a custom table in your Log Analytics workspace using the Logs Ingestion API for further investigation, alert creation, use in dashboards, and so on. 

## Tools you'll use

- [Jupyter Notebook](https://jupyter.org/):

    You can run Jupyter Notebook on log data in Azure Monitor Logs: 
    - In the cloud, using Microsoft services, such as [Azure Machine Learning](/azure/machine-learning/samples-notebooks) or public services. 
    - Locally, using Microsoft tools, such as [Azure Data Studio](/sql/azure-data-studio/notebooks/notebooks-guidance) or [Visual Studio](https://code.visualstudio.com/docs/datascience/jupyter-notebooks), or open source tools.  
    
    For more information, see [Notebooks at Microsoft](https://visualstudio.microsoft.com/vs/features/notebooks-at-microsoft/).  

- [Azure Monitor Query client library](/python/api/overview/azure/monitor-query-readme?view=azure-python), which lets you run KQL power queries and custom code, including custom machine learning algorithms, in any language. 
- [Pandas library](https://pandas.pydata.org/) for data tables.
- [PySpark DataFrames](https://spark.apache.org/docs/api/python/index.html).
- [Data collection rule](../essentials/data-collection-rule-overview.md) and [data collection endpoint](../essentials/data-collection-endpoint-overview.md) to ingest data you process in Jupyter Notebook back to the Log Analytics workspace.

## Limitations 

- Executing custom code on a copy of data in the Pandas DataFrame leads to downgraded performance and increased latency compared to [running native KQL operators and functions directly in Azure Monitor](../logs/kql-machine-learning-azure-monitor). 
- [API-related limitations](/azure/azure-monitor/service-limits#la-query-api), which can be overcome as suggested later. 

## Prerequisites 

- A Log Analytics workspace with data in the `AzureDiagnostics` table. 
- The following roles and permissions: Azure Machine Learning (???). 
- Familiarity with data science concepts.  

## Create a new notebook in Azure Machine Learning 

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com/).
1. Select your workspace, if it isn't already open.    
1. [Create a notebook](/azure/machine-learning/how-to-manage-files) or [open an existing notebook](/azure/machine-learning/how-to-run-jupyter-notebooks#access-notebooks-from-your-workspace). 
1. [Connect to a compute instance](/azure/machine-learning/how-to-run-jupyter-notebooks#run-a-notebook-or-python-script).  
    
    For this tutorial, select CPU type. 
    
    To use distributed GPU training code, see [Distributed GPU training guide](../../machine-learning/v1/how-to-train-distributed-gpu). 
 
1. Verify Python kernel selected Python 3.8 or higher. 


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
    
    ```python
    import os
    import pandas as pd
    from datetime import datetime, timezone, timedelta
    from azure.monitor.query import LogsQueryStatus
    from azure.core.exceptions import HttpResponseError
    import requests
    import json
    
    import plotly.express as px
    
    workspace_id = '23082c66-9a25-4a30-bded-14fc1ae40afa' ##LADemo-Workspace - under azure monitor direcotry/tenant
    
    
    #executes query on workspace_id in given timespan
    def execQuery(query, start_time, end_time):
     try:
        response = logs_query_client.query_workspace(workspace_id, query, timespan=(start_time, end_time))
        if response.status == LogsQueryStatus.PARTIAL:
            error = response.partial_error
            data = response.partial_data
            print(error.message)
        elif response.status == LogsQueryStatus.SUCCESS:
            data = response.tables
        for table in data:
            my_data = pd.DataFrame(data=table.rows, columns=table.columns)        
     except HttpResponseError as err:
        print("something fatal happened")
        print (err)
     return my_data
    
    
    def execQueryDemoWorkspace(query):
     workspace_id = 'DEMO_WORKSPACE'
     api_key = 'DEMO_KEY'
    	
     url = f'https://api.loganalytics.azure.com/v1/workspaces/{workspace_id}/query'
    
     response = requests.post(url, headers={'X-Api-Key': api_key}, json={'query': query})
    
     
     logs_query_result = response.json()
     tables = logs_query_result['tables']
    
     df = pd.DataFrame(
       tables[0]['rows'],
       columns=[col["name"] for col in tables[0]['columns']]
     )
    
    
     return df
    
     
    def showGraph(df, title):
     df = df.sort_values(by="TimeGenerated")
     graph = px.line(df, x='TimeGenerated', y="ActualUsage", color='DataType', title=title)
     graph.show()
    ```

    This script defines three functions:

    - `execQuery(query, start_time, end_time)` - Executes a query within the given time range on a Log Analytics workspace (`workspace_id`), and stores the response in a a pandas DataFrame (`my_data`).  
    - `execQueryDemoWorkspace(query)` - Calls the Azure Log Analytics POST API with the given query and returns a pandas DataFrame containing the data from the response.
    - `showGraph(df, title)` - Creates a graph that plots `TimeGenerated` on the x-axis and `ActualUsage` on the y-axis using Plotly.
    
## Explore and visualize log data in your notebook

1. Query the use of all data types in the last week.
    
    ```python
    UsageQuery_AllTypes = """
    Usage 
    | project TimeGenerated, DataType, Quantity 
    | summarize ActualUsage=sum(Quantity) by TimeGenerated=bin(TimeGenerated, 1h), DataType
    """
    
    num_days = 7; ##FILL YOUR 
    end_time = datetime.now()
    start_time = end_time - timedelta(days=num_days)
    
    
    df_allTypes = execQuery(UsageQuery_AllTypes, start_time, end_time)
    ```
    
1. Present the data your query returns in a graph.

    ```python
    showGraph(df_allTypes, "All Data Types - last week usage")
    ```

    The resulting graph looks like this:

    :::image type="content" source="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-ingestion-all-tables.png" alt-text="A graph that shows how much data was ingested into each of the tables in a Log Analytics workspace over seven days." lightbox="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-ingestion-all-tables.png":::

    
## Train the model

Model training is an iterative process that begins with data preparation and cleaning, and includes experimenting with several models until you find a model that best fits your data set.

In this tutorial, for simplicity, we'll: 

- Skip the data cleaning step.
- Work with six data types: `ContainerLog`, `AzureNetworkAnalytics_CL`, `AVSSyslog`, `StorageBlobLogs`, `AzureDiagnostics`, `Perf`.
- Experiment with only two models to see which best fits our data set.

1. Retrieve hourly usage data for our selected data types over the last three weeks. 
  
    ```python
    datatypes = ["ContainerLog", "AzureNetworkAnalytics_CL", "AVSSyslog", "StorageBlobLogs", "AzureDiagnostics", "Perf"]
    
    datatypesStr = ''
     
    # using loop to add string followed by delim
    for ele in datatypes:
        datatypesStr = datatypesStr + "'" + str(ele) +"'" + ','
    
    datatypesStr = datatypesStr[:-1] ##remove last ,
    #UsageQuery_SelectedDataTypes = "Usage | project TimeGenerated, DataType, Quantity | where DataType in (" + datatypesStr + ") | summarize ActualUsage=sum(Quantity) by TimeGenerated=bin(TimeGenerated, 1h), DataType"
    
    
    UsageQuery_SelectedDataTypes = f"""
    Usage 
    | project TimeGenerated, DataType, Quantity 
    | where DataType in ({datatypesStr}) 
    | summarize ActualUsage=sum(Quantity) by TimeGenerated=bin(TimeGenerated, 1h), DataType
    """
    
    
    num_days = 21; ##3 weeks period fot training
    end_time = datetime.now()-timedelta(days=7)
    start_time = end_time - timedelta(days=num_days)
    
    my_data = execQuery(UsageQuery_SelectedDataTypes,start_time,end_time)
    #showGraph(my_data)
    ```

    This code snippet generates a DataFrame that shows the hourly ingestion in each of the six tables, as retrieved from the Log Analytics workspace:

    :::image type="content" source="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-ingestion-dataframe.png" alt-text="Screenshot that shows a DataFrame generated in Jupyter Notebook with log ingestion data retrieved from a Log Analytics workspace in Azure Monitor Logs." lightbox="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-ingestion-dataframe.png":::


1. Present the data from the DataFrame in a graph.

    ```python
    showGraph(my_data, "Historical data usage (3 weeks) - selected data types")
    ```
    The resulting graph looks like this:

    :::image type="content" source="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-historical-ingestion.png" alt-text="A graph that shows hourly usage data for six data types over the last three weeks" lightbox="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-historical-ingestion.png":::


1. Since time information present as a date column, we need expand it into Year, Month, Day, Hour columns using pandas: https://pandas.pydata.org/pandas-docs/stable/user_guide/timeseries.html#time-date-components

    Guy - show the screenshot from Anomalies_CL table (maybe to start the screenshot from AnomalyTimeGenerated, and not to show TimeGenerated which shows current date - it might confuse)

 