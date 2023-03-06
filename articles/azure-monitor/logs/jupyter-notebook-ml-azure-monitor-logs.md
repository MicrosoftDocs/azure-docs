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
- Running custom code on using your web browser lets you get started quickly without having to install Python or other tools on your local computer.

## Process overview

In this tutorial, you'll: 

1. Integrate your Log Analytics workspace with Jupyter Notebook using the [Azure Monitor Query client library](/python/api/overview/azure/monitor-query-readme) and the [Azure Identity client library](https://pypi.org/project/azure-identity/). 
1. Run KQL queries and custom code on data in the Log Analytics workspace from the notebook.
1. Explore and visualize log data in your notebook using Graphly. 
1. Ingest anomalies into a custom table in your Log Analytics workspace using the Logs Ingestion API for further investigation, alert creation, use in dashboards, and so on. 

## Tools you'll use

| Tool | Description |
| --- | --- |
|[Jupyter Notebook](https://jupyter.org/) | Use Jupyter Notebook to run code and queries on log data in Azure Monitor Logs:<br>- In the cloud, using Microsoft services, such as [Azure Machine Learning](/azure/machine-learning/samples-notebooks), or public services.<br>- Locally, using Microsoft tools, such as [Azure Data Studio](/sql/azure-data-studio/notebooks/notebooks-guidance) or [Visual Studio](https://code.visualstudio.com/docs/datascience/jupyter-notebooks), or open source tools.<br> For more information, see [Notebooks at Microsoft](https://visualstudio.microsoft.com/vs/features/notebooks-at-microsoft/).  |
|[Azure Monitor Query client library](/python/api/overview/azure/monitor-query-readme?view=azure-python) |Lets you run KQL power queries and custom code, including custom machine learning algorithms, in any language. |
|[Pandas library](https://pandas.pydata.org/) |An open source data analysis and manipulation tool tool for Python. |
|[PySpark DataFrames](https://spark.apache.org/docs/api/python/index.html).| |
|[Data collection rule](../essentials/data-collection-rule-overview.md) and [data collection endpoint](../essentials/data-collection-endpoint-overview.md) | Needed to ingest data you process in Jupyter Notebook back to the Log Analytics workspace. |

## Limitations 

- Executing custom code on a copy of data in the Pandas DataFrame leads to downgraded performance and increased latency compared to [running native KQL operators and functions directly in Azure Monitor](../logs/kql-machine-learning-azure-monitor). 
- [API-related limitations](/azure/azure-monitor/service-limits#la-query-api), which can be overcome as suggested later. 

## Prerequisites 

- An [Azure Machine Learning workspace with a compute instance](../../machine-learning/quickstart-create-resources.md):

    - For this tutorial, select CPU type. To use distributed GPU training code, see [Distributed GPU training guide](../../machine-learning/v1/how-to-train-distributed-gpu).  
    - Verify Python kernel selected Python 3.8 or higher.
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
   
## Explore and visualize data from your Log Analytics workspace in Jupyter Notebook

1. Check how much data was ingested into each of the tables in the workspace every hour over the last week.
    
    ```python
    UsageQuery_AllTypes = """
    Usage 
    | project TimeGenerated, DataType, Quantity 
    | summarize ActualUsage=sum(Quantity) by TimeGenerated=bin(TimeGenerated, 1h), DataType
    """
    
    num_days = 7;  
    end_time = datetime.now()
    start_time = end_time - timedelta(days=num_days)
    
    
    df_allTypes = execQuery(UsageQuery_AllTypes, start_time, end_time)
    ```

    This query generates a DataFrame that shows the hourly ingestion in each of the tables in the Log Analytics workspace:  
    
    :::image type="content" source="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-ingestion-all-tables-dataframe.png" alt-text="Screenshot that shows a DataFrame generated in Jupyter Notebook with log ingestion data retrieved from a Log Analytics workspace in Azure Monitor Logs." 

1. Present the data your query returns in a graph.

    ```python
    showGraph(df_allTypes, "All Data Types - last week usage")
    ```

    The resulting graph looks like this:

    :::image type="content" source="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-ingestion-all-tables.png" alt-text="A graph that shows how much data was ingested into each of the tables in a Log Analytics workspace over seven days." lightbox="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-ingestion-all-tables.png":::

    
## Train the model

Model training is an iterative process that begins with data preparation and cleaning, and might include experimentation with several models until you find a model that's a good fit for your data set.

In this tutorial, for the sake of simplicity, we'll: 

- Skip the data cleaning step.
- Work with only six data types: `ContainerLog`, `AzureNetworkAnalytics_CL`, `AVSSyslog`, `StorageBlobLogs`, `AzureDiagnostics`, `Perf`.
- Experiment with only two models to see which best fits our data set.

To train a machine learning model on data in your Log Analytics workspace:

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

    This query generates a DataFrame that shows the hourly ingestion in each of the six tables, as retrieved from the Log Analytics workspace:

    :::image type="content" source="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-ingestion-dataframe.png" alt-text="Screenshot that shows a DataFrame with log ingestion data for the six tables we're exploring in this tutorial." 

1. Present the data from the DataFrame in a graph.

    ```python
    showGraph(my_data, "Historical data usage (3 weeks) - selected data types")
    ```
    The resulting graph looks like this:

    :::image type="content" source="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-historical-ingestion.png" alt-text="A graph that shows hourly usage data for six data types over the last three weeks" lightbox="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-historical-ingestion.png":::


1. Lets expand the timestamp information in `TimeGenerated` field into `Year`, `Month`, `Day`, `Hour` columns [using pandas](https://pandas.pydata.org/pandas-docs/stable/user_guide/timeseries.html#time-date-components).

    ```python
    my_data['Year'] = pd.DatetimeIndex(my_data['TimeGenerated']).year
    my_data['Month'] = pd.DatetimeIndex(my_data['TimeGenerated']).month
    my_data['Day'] = pd.DatetimeIndex(my_data['TimeGenerated']).day
    my_data['Hour'] = pd.DatetimeIndex(my_data['TimeGenerated']).hour
    
    import pandas as pd
    import numpy as np
     
    def display_options():
         
        display = pd.options.display
        display.max_columns = 7
        display.max_rows = 10
        display.max_colwidth = 300
        display.width = None
        return None
     
    display_options()
    display(my_data)
    ```
    The resulting DataFrame looks like this:

    :::image type="content" source="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-dataframe-split-datetime.png" alt-text="Screenshot that shows a DataFrame with the newly-added Year, Month, Day, and Hour columns.":::
 
## Split the dataset into a training set and a testing set

To validate a machine learning model, we need to use some of the data we have to train the model and some of data to check how well the trained model is able to predict values the model doesn't yet know.    

1. Use the [TimeSeriesSplit()](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html#sklearn.model_selection.TimeSeriesSplit) time series cross-validator to split the dataset into a training set and a test set.

    ```python
    from sklearn.model_selection import TimeSeriesSplit
    
    ts_cv = TimeSeriesSplit() #we use default values
        
    Y = my_data['ActualUsage']
    X = my_data[['DataType', 'Year', 'Month', 'Day', 'Hour']] 
    ```

1. Train and evaluate a linear regression model.

    This script creates a machine learning pipeline that trains and evaluates a machine learning model using the `scikit-learn` library by:  
     
    - One-hot encoding categorical variables, which in our case are our data types. 
    - Scales numerical features - in our case, hourly usage - to the 0-1 range.

    ```python
    from sklearn.pipeline import make_pipeline
    from sklearn.compose import ColumnTransformer
    from sklearn.model_selection import cross_validate
    from sklearn.preprocessing import OneHotEncoder
    from sklearn.preprocessing import MinMaxScaler
    from sklearn.linear_model import RidgeCV
    import numpy as np
    
    categorical_columns = [
        "DataType"
       ]
    
    one_hot_encoder = OneHotEncoder(handle_unknown="ignore", sparse_output=False)
    alphas = np.logspace(-6, 6, 25)
    naive_linear_pipeline = make_pipeline(
        ColumnTransformer(
            transformers=[
                ("categorical", one_hot_encoder, categorical_columns),
            ],
            remainder=MinMaxScaler(),
        ),
        RidgeCV(alphas=alphas),
    )
    
    
    naive_linear_pipeline.fit(X, Y)
    ##predictions = naive_linear_pipeline.predict(X)
    
    ##my_data["PredictedUsage"] = predictions
    ##my_data["Residual"] = my_data["ActualUsage"] - my_data["PredictedUsage"]
    ##my_data["Residual %"] = abs(my_data["Residual"]) / my_data["PredictedUsage"]*100
    
    def evaluate(model, X, Y, cv):
        cv_results = cross_validate(
            model,
            X,
            Y,
            cv=cv,
            scoring=["neg_mean_absolute_error", "neg_root_mean_squared_error"],
        )
        mae = -cv_results["test_neg_mean_absolute_error"]
        rmse = -cv_results["test_neg_root_mean_squared_error"]
        print(
            f"Mean Absolute Error:     {mae.mean():.3f} +/- {mae.std():.3f}\n"
            f"Root Mean Squared Error: {rmse.mean():.3f} +/- {rmse.std():.3f}"
        )
    
    
    print("score of linear_pipeline:")
    evaluate(naive_linear_pipeline, X, Y, cv=ts_cv)
    ```
    The linear pipeline score for this model is: 

    :::image type="content" source="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-linear-pipeline-score.png" alt-text="Printout of the scoring results of the linear regression model."::: 

1. Now, let's train and evaluate a [gradient boosting regression](https://scikit-learn.org/stable/auto_examples/ensemble/plot_gradient_boosting_regression.html) model.


    ```python
    from sklearn.preprocessing import OrdinalEncoder
    from sklearn.ensemble import HistGradientBoostingRegressor
    
    
    categories =  [
      datatypes
    ##["ContainerLog", "AzureNetworkAnalytics_CL", "AVSSyslog", "StorageBlobLogs"]
       ## ["ContainerLog", "AVSSyslog"] ##["AzureDiagnostics"] ##, "ContainerLogV2", "Perf", "InsightsMetrics"]
    ]
        
    
    ordinal_encoder = OrdinalEncoder(categories=categories)
    
    gbrt_pipeline = make_pipeline(
        ColumnTransformer(
            transformers=[
                ("categorical", ordinal_encoder, categorical_columns),
            ],
            remainder="passthrough",
        ),
        HistGradientBoostingRegressor(
            categorical_features=range(1),      
        ),
    )
    
    gbrt_pipeline.fit(X, Y)
    #predictions = gbrt_pipeline.predict(X)
    ##my_data["PredictedUsage"] = predictions
    ##my_data["Residual"] = my_data["ActualUsage"] - my_data["PredictedUsage"]
    ##print(my_data)
    
    print("Gradient boosting regression score:")
    evaluate(gbrt_pipeline, X, Y, cv=ts_cv)
    
    ```

    The linear pipeline score for this model is: 

    :::image type="content" source="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-gradient-boosting-regression-score.png" alt-text="Printout of the scoring results of the gradient boosting regression model."::: 

    Since the scoring of the gradient boosting regression model is better - in other words, the gradient boosting regression model has a lower error rate - we'll use this model to score new data in our Log Analytics workspace.

1. Save the trained gradient boosting regression model as a pickle file.

    ```python
    import joblib

    # Save the model as a pickle file
    filename = './myModel.pkl'
    joblib.dump(gbrt_pipeline, filename)
    ```

## Score new data using the trained model

