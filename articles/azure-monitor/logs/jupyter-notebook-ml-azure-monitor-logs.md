---
title: Train and evaluate a regression model for detecting anomalies in Azure Monitor Logs by using Jupyter Notebook
description: This tutorial shows how to use Jupyter Notebook to explore data and fit a custom machine learning algorithm to detect anomalies in Azure Monitor Logs. 
ms.service: azure-monitor
ms.topic: tutorial 
author: guywi-ms
ms.author: guywild
ms.reviewer: ilanawaitser
ms.date: 02/28/2023

# Customer intent:  As a data scientist, I want to use to run custom code on data in Azure Monitor Logs using Jupyter Notebook to gain insights without having to export data outside of Azure Monitor.

---
# Tutorial: Train a regression model on data in Azure Monitor Logs by using Jupyter Notebook

[Jupyter Notebook](https://jupyter.org/) is an open-source web application that lets you create and share documents that contain live code, equations, visualizations, and text. 

Integrating Jupyter Notebook with a Log Analytics workspace lets you create a multi-step process, running code in each step based on the results of the previous step. You can use such streamlined, multi-step processes to build and run machine learning pipelines, and for other purposes, such as conducting advanced analysis and creating troubleshooting guides (TSGs) for support needs.

In this tutorial, we integrate Jupyter Notebook with a Log Analytics workspace and train a custom machine learning model to detect log ingestion anomalies, based on historical data in Azure Monitor Logs. This is one of several ways you can [build your own machine learning pipeline without exporting data out of Azure Monitor Logs](../logs/bring-your-own-machine-learning.md#create-your-own-machine-learning-pipeline-on-data-in-azure-monitor-logs). 

## Process overview

In this tutorial, you learn how to: 
> [!div class="checklist"]
> * Integrate your Log Analytics workspace with Jupyter Notebook using the [Azure Monitor Query client library](/python/api/overview/azure/monitor-query-readme) and the [Azure Identity client library](https://pypi.org/project/azure-identity/) 
> * Explore and visualize data from your Log Analytics workspace in Jupyter Notebook
> * Prepare data for model training 
> * Train and test regression models on historical data
> * Score new data, or predict new values, using a trained model and identify anomalies
> * Ingest anomalies into a custom table in your Log Analytics workspace for further analysis (optional) 

> [!NOTE]
> Model training is an iterative process that begins with data preparation and cleaning, and usually involves experimenting with several models until you find a model that's a good fit for your data set.
> In this tutorial, to shorten the process, we'll: 
>- Skip the data cleaning step.
>- Experiment with only two models to see which best fits our data set.
## Limitations 

- [API-related limitations](/azure/azure-monitor/service-limits#la-query-api), which you can work around to a certain degree if you [split larger queries into multiple smaller queries](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/monitor/azure-monitor-query/samples/notebooks/sample_large_query.ipynb). 


## Prerequisites 
For this tutorial, you need:

- Basic familiarity with Python and machine learning concepts like training, testing, and regression models.

- An [Azure Machine Learning workspace with a CPU compute instance](../../machine-learning/quickstart-create-resources.md) with:

    - [A notebook](../../machine-learning/quickstart-run-notebooks.md#create-a-new-notebook). 
    - A kernel set to Python 3.8 or higher.

- The following roles and permissions: 

    - In **Azure Monitor Logs**: The **Logs Analytics Contributor** role to read data from and send data to your Logs Analytics workspace. For more information, see [Manage access to Log Analytics workspaces](../logs/manage-access.md#log-analytics-contributor).
    - In **Azure Machine Learning**:
        - A resource group-level **Owner** or **Contributor** role, to create a new Azure Machine Learning workspace if needed. 
        - A **Contributor** role on the Azure Machine Learning workspace where you run your notebook.
        
        For more information, see [Manage access to an Azure Machine Learning workspace](../../machine-learning/how-to-assign-roles.md). 
## Tools

In this tutorial, you use these tools:

|Source| Tool | Description |
|---| --- | --- |
|Azure Monitor|[Azure Monitor Query client library](/python/api/overview/azure/monitor-query-readme) |Lets you run read-only queries on data in Azure Monitor Logs. |
||[Azure Identity client library](/python/api/overview/azure/identity-readme)|Enables Azure SDK clients to authenticate with Azure Active Directory.|
||[Azure Monitor Ingestion client library](/python/api/overview/azure/monitor-ingestion-readme)| Lets you send custom logs to Azure Monitor using the Logs Ingestion API. Required to [Ingest anomalies into a custom table in your Log Analytics workspace (optional)](#ingest-anomalies-into-a-custom-table-in-your-log-analytics-workspace-optional)|
||[Data collection rule](../essentials/data-collection-rule-overview.md), [data collection endpoint](../essentials/data-collection-endpoint-overview.md), and a [registered application](../logs/tutorial-logs-ingestion-portal.md#create-azure-ad-application) | Required to [Ingest anomalies into a custom table in your Log Analytics workspace (optional)](#ingest-anomalies-into-a-custom-table-in-your-log-analytics-workspace-optional) |
|Open source|[Jupyter Notebook](https://jupyter.org/) | Use Jupyter Notebook to run code and queries on log data in Azure Monitor Logs:<br>- Using Microsoft cloud services, such as [Azure Machine Learning](/azure/machine-learning/samples-notebooks) or [Azure Synapse](/azure/synapse-analytics/spark/apache-spark-notebook-concept), or public services.<br>- Locally, using Microsoft tools, such as [Azure Data Studio](/sql/azure-data-studio/notebooks/notebooks-guidance) or [Visual Studio](https://code.visualstudio.com/docs/datascience/jupyter-notebooks), or open source tools.<br> For more information, see [Notebooks at Microsoft](https://visualstudio.microsoft.com/vs/features/notebooks-at-microsoft/).|
||[Pandas library](https://pandas.pydata.org/) |An open source data analysis and manipulation tool for Python. |
||[Plotly](https://plotly.com/python/)| An open source graphing library for Python. |
||[Scikit-learn](https://scikit-learn.org/stable/)|An open source Python library that implements machine learning algorithms for predictive data analysis.|    
 ## Install required libraries

Install the Azure Monitor Query, Azure Identity and Azure Monitor Ingestion client libraries along with the Pandas data analysis library, Plotly visualization library, and Scikit-learn machine learning library:

```python
import sys

!{sys.executable} -m pip install --upgrade azure-monitor-query azure-identity azure-monitor-ingestion

!{sys.executable} -m pip install --upgrade pandas numpy plotly scikit-learn nbformat
```
 ## Integrate your Log Analytics workspace with your notebook 

1. Set the `LOGS_WORKSPACE_ID` variable below to the ID of your Log Analytics workspace. The variable is currently set to use the [Azure Monitor Demo workspace](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring_Logs/DemoLogsBlade), which you can use to demo the notebook.

    ```python
    LOGS_WORKSPACE_ID = "DEMO_WORKSPACE"
    ```
    
1. Set up `LogsQueryClient` to authenticate and query Azure Monitor Logs. 

    This code sets up `LogsQueryClient` to authenticate using `DefaultAzureCredential`:
    
    ```python
    from azure.core.credentials import AzureKeyCredential
    from azure.core.pipeline.policies import AzureKeyCredentialPolicy
    from azure.identity import DefaultAzureCredential
    from azure.monitor.query import LogsQueryClient
    
    if LOGS_WORKSPACE_ID == "DEMO_WORKSPACE":
        credential = AzureKeyCredential("DEMO_KEY")
        authentication_policy = AzureKeyCredentialPolicy(name="X-Api-Key", credential=credential)
    else:
        credential = DefaultAzureCredential()
        authentication_policy = None
        
    logs_query_client = LogsQueryClient(credential, authentication_policy=authentication_policy)
    ```

    `LogsQueryClient` typically only supports authentication with Azure Active Directory (Azure AD) token credentials. However, we can pass a custom authentication policy to enable the use of API keys. This allows the client to [query the demo workspace](../logs/api/access-api.md#authenticate-with-a-demo-api-key). The availability and access to this demo workspace is subject to change, so we recommend using your own Log Analytics workspace.

1. Define helper functions that we'll use throughout the notebook.

    - `query_logs_workspace` - Runs a given query in the Log Analytics workspace and returns the results as a Pandas DataFrame.
    - `display_graph` - Displays a Plotly line graph showing hourly usage for various data types over time, based on a Pandas DataFrame.

    ```python
    import pandas as pd
    import plotly.express as px
    
    from azure.monitor.query import LogsQueryStatus
    from azure.core.exceptions import HttpResponseError
    
    
    def query_logs_workspace(query):
        try:
            response = logs_query_client.query_workspace(LOGS_WORKSPACE_ID, query, timespan=None)
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
    
    
    def display_graph(df, title):
        df = df.sort_values(by="TimeGenerated")
        graph = px.line(df, x='TimeGenerated', y="ActualUsage", color='DataType', title=title)
        graph.show()
    
    
    # Set display options for visualizing
    def display_options():
        display = pd.options.display
        display.max_columns = 10
        display.max_rows = 10
        display.max_colwidth = 300
        display.width = None
        return None
     
    display_options()
    ```

## Explore and visualize data from your Log Analytics workspace in Jupyter Notebook

Now that you've integrated your Log Analytics workspace with your notebook, let's look at some data in the workspace by running a query from the notebook:

1.  This query checks how much data (in Megabytes) you ingested into each of the tables (data types) in the Log Analytics workspace each hour over the past week.
:

    ```python
    TABLE = "Usage"
    
    QUERY = f"""
    let starttime = 7d; // Start date for the time series, counting back from the current date
    let endtime = 0d; // today 
    {TABLE} | project TimeGenerated, DataType, Quantity 
    | where TimeGenerated between (ago(starttime)..ago(endtime))
    | summarize ActualUsage=sum(Quantity) by TimeGenerated=bin(TimeGenerated, 1h), DataType
    """

    df = query_logs_workspace(QUERY)
    display(df)
    ```

    This query generates a DataFrame that shows the hourly ingestion in each of the tables in the Log Analytics workspace:  
    
    :::image type="content" source="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-ingestion-all-tables-dataframe.png" alt-text="A DataFrame generated in Jupyter Notebook with log ingestion data retrieved from a Log Analytics workspace." 

1. Now, let's view the data as a graph using the helper function we defined above:

    ```python
    display_graph(df, "All Data Types - last week usage")
    ```

    The resulting graph looks like this:

    :::image type="content" source="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-ingestion-all-tables.png" alt-text="A graph that shows the amount of data ingested into each of the tables in a Log Analytics workspace over seven days." lightbox="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-ingestion-all-tables.png":::

    You've successfully queried and visualized log data from your Log Analytics workspace in your notebook.
    
## Prepare data for model training

After exploring the available data, let's use a subset of the data for model training: 

1. Retrieve hourly usage data for selected data types (defined in `data_types` below) for the three weeks prior to the last week:

    ```python
    # Insert the selected data types for analysis - for simplicity, we picked six data types, which seemed most interesting in the exploration of data step
    data_types = ["ContainerLog", "AzureNetworkAnalytics_CL", "StorageBlobLogs", "AzureDiagnostics", "Perf", "AVSSyslog"]
    
    # Get all available data types that have data.
    available_data_types = df["DataType"].unique()
    
    # Filter out data types that are not available in the data.
    data_types = list(filter(lambda data_type: data_type in available_data_types, data_types))
    
    if data_types:
        print(f"Selected data type for analysis: {data_types}")
    else:    
        raise SystemExit("No datatypes found. Please select data types which have data")
        
    # Returns usage query for selected data types for given time range
    def get_selected_datatypes(data_types, start, end):
        data_types_string = ",".join([f"'{data_type}'" for data_type in data_types])
        query = (
            f"let starttime = {start}d; "
            f"let endtime = {end}d; "
            "Usage | project TimeGenerated, DataType, Quantity "
            "| where TimeGenerated between (ago(starttime)..ago(endtime)) "
            f"| where DataType in ({data_types_string}) "
            "| summarize ActualUsage=sum(Quantity) by TimeGenerated=bin(TimeGenerated, 1h), DataType"
        )
        return query
    
    # We will query the data from the first three weeks of the past month.
    # Feel free to change the start and end dates.
    start = 28
    end = 7
    
    query = get_selected_datatypes(data_types, start, end)
    my_data = query_logs_workspace(query)
    display(my_data)    
    
    if my_data.empty:
        raise SystemExit("No data found for training. Please select data types which have data")
    
    ``` 
  

    This query generates a DataFrame that shows the hourly ingestion in each of the six tables, as retrieved from the Log Analytics workspace:

    :::image type="content" source="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-ingestion-dataframe.png" alt-text="Screenshot that shows a DataFrame with log ingestion data for the six tables we're exploring in this tutorial." 

1. Now, let's view the data as a graph using the helper function we defined above:

    ```python
    display_graph(my_data, "Selected Data Types - Historical Data Usage (3 weeks)")
    ```
    The resulting graph looks like this:

    :::image type="content" source="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-historical-ingestion.png" alt-text="A graph that shows hourly usage data for six data types over the last three weeks." lightbox="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-historical-ingestion.png":::


1. Let's expand the timestamp information in the `TimeGenerated` field into `Year`, `Month`, `Day`, `Hour` columns using the Pandas [DatetimeIndex constructor](https://pandas.pydata.org/pandas-docs/stable/user_guide/timeseries.html#time-date-components). This allows us to use the timestamp information as features in our model.

    ```python
    my_data['Year'] = pd.DatetimeIndex(my_data['TimeGenerated']).year
    my_data['Month'] = pd.DatetimeIndex(my_data['TimeGenerated']).month
    my_data['Day'] = pd.DatetimeIndex(my_data['TimeGenerated']).day
    my_data['Hour'] = pd.DatetimeIndex(my_data['TimeGenerated']).hour
    ```
 
    The resulting DataFrame looks like this:

    :::image type="content" source="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-dataframe-split-datetime.png" alt-text="Screenshot that shows a DataFrame with the newly added Year, Month, Day, and Hour columns.":::

1. Define the `X` and `Y` variables for training the model. The `X` variable contains the features (timestamp information) and the `Y` variable contains the target (data usage in Megabytes).

    ```python
    Y = my_data['ActualUsage']
    X = my_data[['DataType', 'Year', 'Month', 'Day', 'Hour']] 
    
    display(X)
    ``` 

1. Split the dataset into a training set and a testing set.

    To validate a machine learning model, we use some of our data to train the model and some of data to check how well the trained model predicts values the model doesn't yet know.    
    
    Let's use the `scikit-learn` library's [TimeSeriesSplit() time series cross-validator](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html#sklearn.model_selection.TimeSeriesSplit) to split the dataset into a training set and a test set:

    ```python
    from sklearn.model_selection import cross_validate
    from sklearn.model_selection import TimeSeriesSplit
    
    ts_cv = TimeSeriesSplit()
    
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
    ```
    
## Train and test regression models on historical data

Let's experiment with two types of regression models and check which of the models most closely predicts the data in our testing set:


1. Train and evaluate a [linear regression model](https://scikit-learn.org/stable/modules/linear_model.html).

    Here, we first apply some transformations to the input data:
    
    - One-hot encode the categorical features using [OneHotEncoder](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OneHotEncoder.html#sklearn.preprocessing.OneHotEncoder). This is how we numerically represent "DataTypes" in our model.
    - Scale numerical features - in our case, hourly usage - to the 0-1 range.
    
    Then, we train the model using an extension of Linear regression called [Ridge Regression](https://en.wikipedia.org/wiki/Ridge_regression). This is a linear regression model that uses L2 [regularization](https://en.wikipedia.org/wiki/Regularization_(mathematics)) to prevent overfitting.
    
    Finally, we evaluate the model using the cross-validator defined above.

    ```python
    from sklearn.pipeline import make_pipeline
    from sklearn.compose import ColumnTransformer
    from sklearn.preprocessing import OneHotEncoder
    from sklearn.preprocessing import MinMaxScaler
    from sklearn.linear_model import RidgeCV
    import numpy as np
    
    
    categorical_columns = ["DataType"]
    
    one_hot_encoder = OneHotEncoder(handle_unknown="ignore", sparse_output=False)
    
    # Get 25 alpha values between 10^-6 and 10^6
    alphas = np.logspace(-6, 6, 25)
    ridge_linear_pipeline = make_pipeline(
        ColumnTransformer(
            transformers=[
                ("categorical", one_hot_encoder, categorical_columns),
            ],
            remainder=MinMaxScaler(),
        ),
        RidgeCV(alphas=alphas),
    )
    
    ridge_linear_pipeline.fit(X, Y)
    
    print("Score of Linear Regression:")
    evaluate(ridge_linear_pipeline, X, Y, cv=ts_cv)
    ```

    The linear regression score for this model is: 

    :::image type="content" source="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-linear-pipeline-score.png" alt-text="Printout of the scoring results of the linear regression model."::: 

1. Now, let's train and evaluate a [gradient boosting regression model](https://scikit-learn.org/stable/auto_examples/ensemble/plot_gradient_boosting_regression.html).

    Here, we'll: 
    - Use the [HistGradientBoostingRegressor](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.HistGradientBoostingRegressor.html#sklearn.ensemble.HistGradientBoostingRegressor) gradient boosting tree from `scikit-learn`. 
    - Convert categorical features into numerical data using [OrdinalEncoder](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OrdinalEncoder.html#sklearn.preprocessing.OrdinalEncoder).

    ```python
    from sklearn.preprocessing import OrdinalEncoder
    from sklearn.ensemble import HistGradientBoostingRegressor
    
    
    ordinal_encoder = OrdinalEncoder(categories=[data_types])
    
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
    print("Score of Gradient Boosting Regression:")
    evaluate(gbrt_pipeline, X, Y, cv=ts_cv)
    ```

    The gradient boosting regression score for this model is: 

    :::image type="content" source="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-gradient-boosting-regression-score.png" alt-text="Printout of the scoring results of the gradient boosting regression model."::: 

    Since the scoring of the gradient boosting regression model is better - in other words, the gradient boosting regression model has a lower error rate - we'll use this model to predict new values and identify anomalies.

1. Save the trained gradient boosting regression model as a [pickle file](https://docs.python.org/library/pickle.html).

    ```python
    import joblib

    # Save the model as a pickle file
    filename = './myModel.pkl'
    joblib.dump(gbrt_pipeline, filename)
    ```

## Predict new values and identify anomalies

Now that we have a trained model, let's use the model to predict new values, compare the predicted values with actual values, and identify anomalies: 

1. Query data ingestion information for the six data types we selected over the past week.

    ```python
    # Time range from past week.
    start = 7
    end = 0
    
    query = get_selected_datatypes(data_types, start, end)
    new_data = query_logs_workspace(query)
    
    new_data['Year'] = pd.DatetimeIndex(new_data['TimeGenerated']).year
    new_data['Month'] = pd.DatetimeIndex(new_data['TimeGenerated']).month
    new_data['Day'] = pd.DatetimeIndex(new_data['TimeGenerated']).day
    new_data['Hour'] = pd.DatetimeIndex(new_data['TimeGenerated']).hour
    display(new_data)
    ```

    The resulting DataFrame shows the hourly ingestion over the last week for each of the six tables, as retrieved from the Log Analytics workspace:

    :::image type="content" source="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-new-ingestion.png" alt-text="Screenshot that shows a DataFrame with information about new log ingestion over seven days in the six tables we're exploring in this tutorial." 

1. Visualize the data in a graph:

    ```python
    display_graph(new_data, "Selected Data Types - New Data Usage (1 week)")
    ```
    The resulting graph looks like this:

    :::image type="content" source="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-new-ingestion-graph.png" alt-text="A graph that shows hourly usage data for six data types over seven days." lightbox="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-new-ingestion-graph.png":::

1. Load the gradient boosting regression model pickle file and use it to predict values for new data. This is often called scoring.

    ```python
    # Load the model from the file
    X_new = new_data[['DataType', 'Year', 'Month', 'Day', 'Hour']] 
    
    loaded_model = joblib.load(filename)
    Predictions_new = loaded_model.predict(X_new)
    new_data["PredictedUsage"] = Predictions_new
    display(new_data)
    ```

    :::image type="content" source="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-scoring-new-data.png" alt-text="Screenshot that shows a DataFrame with information about the predicted and actual ingestion into the six tables we're exploring in this tutorial." 

    As you can see, the DataFrame now includes a new **PredictedUsage** column.

1. Identify ingestion anomalies.

    There are multiple methods of detecting anomalies, including the [elliptic envelope model](https://scikit-learn.org/stable/modules/generated/sklearn.covariance.EllipticEnvelope.html), [one-class support vector machine (SVM) model](https://scikit-learn.org/stable/modules/generated/sklearn.svm.OneClassSVM.html) and [isolation forest model](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.IsolationForest.html).
    
    In this tutorial, we use a method called [Tukey's fences method](https://en.wikipedia.org/wiki/Outlier#Tukey%27s_fences) to identify anomalies. 
    
    > [!NOTE]
    > The KQL [series_decompse_anomalies](/azure/data-explorer/kusto/query/series-decompose-anomaliesfunction) function also uses the Tukey's fences method to detect anomalies.

    1. Define these two helper functions update a DataFrame with a new column called `Anomalies`, where `1` indicates a positive anomaly, and `-1` indicates a negative anomaly:
    
        ```python
        def outlier_range(data_column):
        sorted(data_column)
        Q1, Q3 = np.percentile(data_column , [10,90])
        IQR = Q3 - Q1
        lower_bound = Q1 - (1.5 * IQR)
        upper_bound = Q3 + (1.5 * IQR)
        return lower_bound, upper_bound
    
        def outlier_update_data_frame(df):
        lower_bound, upper_bound = outlier_range(df['Residual'])
    
        df.loc[((df['Residual'] < lower_bound) | (df['Residual'] > upper_bound)) & (df['Residual'] < 0) , 'Anomalies'] = -1
        df.loc[((df['Residual'] < lower_bound) | (df['Residual'] > upper_bound)) & (df['Residual'] >= 0) , 'Anomalies'] = 1
        df.loc[(df['Residual'] >= lower_bound) & (df['Residual'] <= upper_bound), 'Anomalies'] = 0
    
        return df[df['Anomalies'] != 0] 
        ```

    1. Run the helper functions on the DataFrame to identify anomalies in the new data:

        ```python
        new_data["Residual"] = new_data["ActualUsage"] - new_data["PredictedUsage"]
        new_data_datatypes = new_data["DataType"].unique()
        
        new_data.set_index('DataType', inplace=True)
        
        anomalies_df = pd.DataFrame()
        for data_type in new_data_datatypes:
            type_anomalies = outlier_update_data_frame(new_data.loc[data_type, :])
            # Add DataType as a column since we reset index later on
            type_anomalies['DataType'] = data_type
            anomalies_df = pd.concat([anomalies_df, type_anomalies], ignore_index=True)
            
        new_data.reset_index(inplace=True)
        
        print(f"{len(anomalies_df)} anomalies detected")
        display(anomalies_df)
        ```

    The DataFrame is now filtered based the **Anomalies** column.

    :::image type="content" source="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-azure-monitor-logs-ingestion-anomalies.png" alt-text="Screenshot that shows a DataFrame that lists the ingestion values identified as anomalies." 

## Ingest anomalies into a custom table in your Log Analytics workspace (optional)

Send the anomalies you identify to a custom table in your Log Analytics workspace to trigger alerts or to make them available for further analysis.   

1. To send data to your Log Analytics workspace, you need a custom table, data collection endpoint, data collection rule, and a registered Azure Active Directory application with permission to use the data collection rule, as explained in [Tutorial: Send data to Azure Monitor Logs with Logs ingestion API (Azure portal) ](../logs/tutorial-logs-ingestion-portal.md).

    When you create your custom table:

    1. Upload this sample file to define the table schema:
    
        ```json
        [
          {     
            "TimeGenerated": "2023-03-19T19:56:43.7447391Z",    
            "ActualUsage": 40.1,    
            "PredictedUsage": 45.1,    
            "Anomalies": -1,    
            "DataType": "AzureDiagnostics"     
          } 
        ]
        ```
    
    1. Paste this transformation into the **Transformation editor** to define a new `AnomalyTimeGenerated` column, which indicates when the anomaly was detected and sets the `TimeGenerated` column to the time at which the data is ingested into your Log Analytics workspace: 
    
        ```kusto
        source | extend AnomalyTimeGenerated = todatetime(TimeGenerated) | extend TimeGenerated = now() 
        ```

 
1. Define the constants you need to pass in the call to the Logs Ingestion API:

    ```python
    os.environ['AZURE_TENANT_ID'] = "<Tenant ID>"; #ID of the tenant where the data collection endpoint resides
    os.environ['AZURE_CLIENT_ID'] = "<Application ID>"; #Application ID to which you granted permissions to your data collection rule
    os.environ['AZURE_CLIENT_SECRET'] = "<Client secret>"; #Secret created for the application
    
    
    
    os.environ['LOGS_DCR_STREAM_NAME'] = "<Custom stream name>" ##Name of the custom stream from the data collection rule
    os.environ['LOGS_DCR_RULE_ID'] = "<Data collection rule immutableId>" # immutableId of your data collection rule
    os.environ['DATA_COLLECTION_ENDPOINT'] =  "<Logs ingestion URL of your endpoint>" # URL that looks like this: https://xxxx.ingest.monitor.azure.com
    ```
1. Ingest the data into the custom table to your Log Analytics workspace:

    ```python
    from azure.core.exceptions import HttpResponseError
    from azure.identity import ClientSecretCredential
    from azure.monitor.ingestion import LogsIngestionClient
    
    
    credential = ClientSecretCredential(
        tenant_id=AZURE_TENANT_ID,
        client_id=AZURE_CLIENT_ID,
        client_secret=AZURE_CLIENT_SECRET
    )
    
    client = LogsIngestionClient(endpoint=DATA_COLLECTION_ENDPOINT, credential=credential, logging_enable=True)
    
    body = json.loads(anomalies_df.to_json(orient='records', date_format='iso'))
    
    try:
       response =  client.upload(rule_id=LOGS_DCR_RULE_ID, stream_name=LOGS_DCR_STREAM_NAME, logs=body)
       print("Upload request accepted")
    except HttpResponseError as e:
        print(f"Upload failed: {e}")
    ```

    > [!NOTE]
    > When you create a table in your Log Analytics workspace, it can take up to 15 minutes for ingested data to appear in the table.

1. Verify that the anomaly data now appears in your custom table.

    :::image type="content" source="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-anomalies-in-azure-monitor-log-analytics-workspace.png" alt-text="Screenshot that shows a query in Log Analytics on a custom table into which the anomalies found in Jupyter Notebook were ingested." lightbox="media/jupyter-notebook-ml-azure-monitor-logs/machine-learning-anomalies-in-azure-monitor-log-analytics-workspace.png":::

## Next steps

Learn more about how to: 

- [Schedule a machine learning pipeline](../../machine-learning/how-to-schedule-pipeline-job.md).
- [Detect and analyze anomalies using KQL](../logs/kql-machine-learning-azure-monitor.md).
