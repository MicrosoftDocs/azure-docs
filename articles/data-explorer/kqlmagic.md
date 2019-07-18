---
title: Use a Jupyter Notebook to analyze data in Azure Data Explorer
description: This topic shows you how to analyze data in Azure Data Explorer using a Jupyter Notebook and the Kqlmagic extension.
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: conceptual
ms.date: 07/10/2019

# Customer intent: I want to analyze data using Jupyter Notebooks and KQL magic.
---

# Use a Jupyter Notebook and Kqlmagic extension to analyze data in Azure Data Explorer

Jupyter Notebook is an open-source web application that allows you to create and share documents containing live code, equations, visualizations, and narrative text. Usage includes data cleaning and transformation, numerical simulation, statistical modeling, data visualization, and machine learning.
[Jupyter Notebook](https://jupyter.org/) supports magic functions that extend the capabilities of the kernel by supporting additional commands. KQL magic is a command that extends the capabilities of the Python kernel in Jupyter Notebook so you can run Kusto language queries natively. You can easily combine Python and Kusto query language to query and visualize data using rich Plot.ly library integrated with `render` commands. Data sources for running queries are supported. These data sources include Azure Data Explorer, a fast and highly scalable data exploration service for log and telemetry data, as well as Azure Monitor logs and Application Insights. KQL magic also works with Azure Notebooks, Jupyter Lab, and Visual Studio Code Jupyter extension.

## Prerequisites

- Organizational email account that is a member of Azure Active Directory (AAD).
- Jupyter Notebook installed on your local machine or use Azure Notebooks and clone the sample [Azure Notebook](https://kustomagicsamples-manojraheja.notebooks.azure.com/j/notebooks/Getting%20Started%20with%20kqlmagic%20on%20Azure%20Data%20Explorer.ipynb)

## Install KQL magic library

1. Install KQL magic:

    ```python
    !pip install Kqlmagic --no-cache-dir  --upgrade
    ```
    > [!NOTE]
    > When using Azure Notebooks, this step is not required.

1. Load KQL magic:

    ```python
    reload_ext Kqlmagic
    ```

## Connect to the Azure Data Explorer Help cluster

Use the following command to connect to the *Samples* database hosted on the *Help* cluster. For non-Microsoft AAD users, replace the tenant name `Microsoft.com` with your AAD Tenant.

```python
%kql AzureDataExplorer://tenant="Microsoft.com";code;cluster='help';database='Samples'
```

## Query and visualize

Query data using the [render operator](/azure/kusto/query/renderoperator) and visualize data using the ploy.ly library. This query and visualization supplies an integrated experience that uses native KQL. Kqlmagic supports most charts except `timepivot`, `pivotchart`, and `ladderchart`. Render is supported with all attributes except `kind`, `ysplit`, and `accumulate`. 

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

If you don’t like the default color palette, customize the charts using palette options. The available palettes can be found here: [Choose colors palette for your KQL magic query chart result](https://mybinder.org/v2/gh/Microsoft/jupyter-Kqlmagic/master?filepath=notebooks%2FColorYourCharts.ipynb)

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

## Parameterize a query with Python

KQL magic allows for simple interchange between Kusto query language and Python. To learn more: [Parameterize your KQL magic query with Python](https://mybinder.org/v2/gh/Microsoft/jupyter-Kqlmagic/master?filepath=notebooks%2FParametrizeYourQuery.ipynb)

### Use a Python variable in your KQL query

You can use the value of a Python variable in your query to filter the data:

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

You can access the results of a KQL query in Pandas DataFrame. Access the last executed query results by variable `_kql_raw_result_` and easily convert the results into Pandas DataFrame as follows:

```python
df = _kql_raw_result_.to_dataframe()
df.head(10)
```

### Example

In many analytics scenarios, you may want to create reusable notebooks that contain many queries and feed the results from one query into subsequent queries. The example below uses the Python variable `statefilter` to filter the data.

1. Run a query to view the top 10 states with maximum `DamageProperty`:

    ```python
    %%kql
    StormEvents
    | summarize max(DamageProperty) by State
    | order by max_DamageProperty desc
    | limit 10
    ```

1. Run a query to extract the top state and set it into a Python variable:

    ```python
    df = _kql_raw_result_.to_dataframe()
    statefilter =df.loc[0].State
    statefilter
    ```

1. Run a query using the `let` statement and the Python variable:

    ```python
    %%kql
    let _state = statefilter;
    StormEvents 
    | where State in (_state)
    | summarize statecount=count() by bin(StartTime,1d), State
    | render timechart title = "Trend"
    ```

1. Run the help command:

    ```python
    %kql --help "help"
    ```

> [!TIP]
> To receive information about all available configurations use `%config KQLmagic`. To troubleshoot and capture Kusto errors, such as connection issues and incorrect queries, use `%config Kqlmagic.short_errors=False`

## Next steps

Run the help command to explore the following sample notebooks that contain all the supported features:
- [Get started with KQL magic for Azure Data Explorer](https://mybinder.org/v2/gh/Microsoft/jupyter-Kqlmagic/master?filepath=notebooks%2FQuickStart.ipynb) 
- [Get started with KQL magic for Application Insights](https://mybinder.org/v2/gh/Microsoft/jupyter-Kqlmagic/master?filepath=notebooks%2FQuickStartAI.ipynb) 
- [Get started with KQL magic for Azure Monitor logs](https://mybinder.org/v2/gh/Microsoft/jupyter-Kqlmagic/master?filepath=notebooks%2FQuickStartLA.ipynb) 
- [Parametrize your KQL magic query with Python](https://mybinder.org/v2/gh/Microsoft/jupyter-Kqlmagic/master?filepath=notebooks%2FParametrizeYourQuery.ipynb) 
- [Choose colors palette for your KQL magic query chart result](https://mybinder.org/v2/gh/Microsoft/jupyter-Kqlmagic/master?filepath=notebooks%2FColorYourCharts.ipynb)
