---
title: 'Analyze data using Jupyter Notebooks and KQLmagic'
description: This topic will show you  
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: conceptual
ms.date: 12/17/2018

#Customer intent: I want to analyze data using Jupyter Notebooks.
---

# Analyzing data using Jupyter Notebooks
Jupyter Notebook is an open-source web application that allows you to create and share documents containing live code, equations, visualizations, and narrative text. Usage includes data cleaning and transformation, numerical simulation, statistical modeling, data visualization, and machine learning.
[Jupyter Notebook](https://jupyter.org/) supports magic functions that extend the capabilities of the kernel by supporting additional commands. Kqlmagic is a funtion that extends the capabilities of the Python kernel in Jupyter Notebook so you can run Kusto Query Language queries natively. You can easily combine Python and Kusto Query Language to query and visualize data using rich Plot.ly library integrated with Kusto render commands. Data sources for running queries such as Azure Data Explorer (Kusto) a fast and highly scalable data exploration service for log and telemetry data, as well as Log Analytics and Application Insights are supported.

## Prerequisites
- Organizational email account that is a member of Azure Active Directory (AAD).
- Jypyter Notebook installed on your local machine or use Azure Notebooks and clone the sample [Azure Notebook](https://kustomagicsamples-manojraheja.notebooks.azure.com/j/notebooks/Getting%20Started%20with%20kqlmagic%20on%20Azure%20Data%20Explorer.ipynb)


## Install kqlmagic library

1. Install Kqlmagic:

    ```python
    !pip install Kqlmagic --no-cache-dir  --upgrade
    ```

2. Load Kqlmagic

    ```python
    reload_ext Kqlmagic
    ```

## Connect to the Azure Data Explorer Help cluster

Use the following command to connect to the Samples database hosted on the Help cluster. For non-Microsoft AAD users, replace the tenant name `Microsoft.com` with your AAD Tenant.


```python
%kql AzureDataExplorer://tenant="Microsoft.com";code;cluster='help';database='Samples'
```

## Query and visualize

Query data using the KQL [render operator](https://docs.microsoft.com/azure/kusto/query/renderoperator) and visualize data using the ploy.ly library. This is performed with an integrated experience that uses native KQL. Kqlmagic supports most charts except timepivot, pivotchart, and ladderchart. Render is supported with all attributes except `kind`, `ysplit`, and `accumulate`. 

### Query and render piechart

```python
%%kql 
StormEvents 
| summarize statecount=count() by State
| sort by statecount 
| limit 10
| render piechart title="My Pie Chart by State"
```

### Query and render timechart

```python
%%kql
StormEvents
| summarize count() by bin(StartTime,7d)
| render timechart
```

> [!NOTE]
> These charts are interactive. Select a time range to zoom into a specific time.

### Customize the chart colors
If you don’t like the default color palette, customize the charts using palette options. The available palettes can be found here: [Choose colors palette for your Kqlmagic query chart result](https://mybinder.org/v2/gh/Microsoft/jupyter-Kqlmagic/master?filepath=notebooks%2FColorYourCharts.ipynb)

1. For a list of palettes:

    ```python
    %kql --palettes -popup_window
    ```

1. Select the `cool` color palette and render the query again:

    ```python
    %%kql -palette_name "cool"
    StormEvents 
    | summarize statecount=count() by State
    | sort by statecount 
    | limit 10
    | render piechart title="My Pie Chart by State"
    ```

## Parametrize a query with Python

Kqlmagic allows for simple interchange between Kusto Query Language and Python. To learn more: [Parametrize your Kqlmagic query with Python](https://mybinder.org/v2/gh/Microsoft/jupyter-Kqlmagic/master?filepath=notebooks%2FParametrizeYourQuery.ipynb) 

### Use a Python variable in your KQL query

You can use the value of a Python variable in your KQL query to filter the data.

```python
statefilter = ["TEXAS", "KANSAS"]
```

```python
%%kql
let _state = statefilter;
StormEvents 
| where State in (_state) 
| summarize statecount=count() by bin(StartTime,1d), State
| render timechart title = "Trend"
```

### Convert query results to Pandas DataFrame 

You can access the results of a KQL query in a Pandas DataFrame. Access the last executed query results by variable name `_kql_raw_result_` and easily convert the results into a Pandas DataFrame as follows:

```python
df = _kql_raw_result_.to_dataframe()
df.head(10)
```

### Chain up the queries using parameters 

In many analytics scenarios, you may want to create reusable notebooks that contains multiple queries and feed the results from one query into the subsequent queries. The example below uses the Python variable `statefilter`, set previously, to filter the data.

### Example

1. Run a query to view the top 10 states by with maximum `DamageProperty'.

    ```python
    %%kql
    StormEvents 
    | summarize max(DamageProperty) by State
    | order by max_DamageProperty desc
    | limit 10
    ```

1. Run a query to extract the top state and set it into a Python variable.

    ```python
    df = _kql_raw_result_.to_dataframe()
    statefilter =df.loc[0].State
    statefilter
    ```

1. Run a query using the `let` statement and the Python variable.

    ```python
    %%kql
    let _state = statefilter;
    StormEvents 
    | where State in (_state) 
    | summarize statecount=count() by bin(StartTime,1d), State
    | render timechart title = "Trend"
    ```

1. Run the help command. 

    ```python
    %kql --help "help"
    ```

## Next steps
    
Run the help command to explore the following sample notebooks which contain all the supported features:
- [Get Started with Kqlmagic for Azure Data Explorer](https://mybinder.org/v2/gh/Microsoft/jupyter-Kqlmagic/master?filepath=notebooks%2FQuickStart.ipynb) 
- [Get Started with Kqlmagic for Application Insights](https://mybinder.org/v2/gh/Microsoft/jupyter-Kqlmagic/master?filepath=notebooks%2FQuickStartAI.ipynb) 
- [Get Started with Kqlmagic for Log Analytics](https://mybinder.org/v2/gh/Microsoft/jupyter-Kqlmagic/master?filepath=notebooks%2FQuickStartLA.ipynb) 
- [Parametrize your Kqlmagic query with Python](https://mybinder.org/v2/gh/Microsoft/jupyter-Kqlmagic/master?filepath=notebooks%2FParametrizeYourQuery.ipynb) 
- [Choose colors palette for your Kqlmagic query chart result](https://mybinder.org/v2/gh/Microsoft/jupyter-Kqlmagic/master?filepath=notebooks%2FColorYourCharts.ipynb)



