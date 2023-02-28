---
title: Run custom code on data in Azure Monitor Logs using Jupyter Notebook
description: Learn how to use KQL machine learning tools for time series analysis and anomaly detection in Azure Monitor Log Analytics. 
ms.service: azure-monitor
ms.topic: tutorial 
author: guywild
ms.author: guywild
ms.reviewer: ilanawaitser
ms.date: 02/28/2023

# Customer intent:  As a data analyst, I want to use to run custom code on data in Azure Monitor Logs using Jupyter Notebook to gain insights without having to export data outside of Azure Monitor.

---
# Run custom code on data in Azure Monitor Logs using Jupyter Notebook


[Jupyter Notebook](https://jupyter.org/) is an open-source web application that lets you create and share documents that contain live code, equations, visualizations, and narrative text. It's a popular data science tool for data cleaning and transformation, numerical simulation, statistical modeling, data visualization, and machine learning. 

Use Jupyter Notebook to: 
- Run custom code on data in Azure Monitor Logs using your web browser, which lets you get started quickly without needing to install Python or other tools on your local computer. . 
- Work with log data at big scales either by using in-memory processing using the [pandas library](https://pandas.pydata.org/) for data tables, and [PySpark DataFrames](https://spark.apache.org/docs/latest/api/python/index.html), or by exporting data to external services.  

## Benefits 

- Run KQL power queries and custom code in any language, using the [Azure Monitor REST API](/rest/api/monitor/), [Azure Monitor libraries for Python](/python/api/overview/azure/monitor?view=azure-python) and other libraries, including custom machine learning algorithms. 
- Create a multi-step process, running code in each step based on the results of the previous step with possibility for advanced visualization options. Such streamlined, multi-step processes can be especially useful in building and running machine learning pipelines, performing advanced analysis, or creating troubleshooting guides for Support needs (TSGs). 
- No user interface limits, and effective techniques for working with data at large scales.  
- Avoid the costs and maintenance overhead exporting data and using external services. 

## Limitations 

- Executing custom code on a copy of data in the Pandas DataFrame leads to downgraded performance and increased latency compared to [running native KQL operators and functions directly in Azure Monitor](../logs/kql-machine-learning-azure-monitor). 
- [API-related limitations](/azure/azure-monitor/service-limits#la-query-api), which can be overcome as suggested later. 

## Prerequisites 

- A Log Analytics workspace with data in the `AzureDiagnostics` table. 
- The following roles and permissions: Azure Machine Learning (???). 
- Familiarity with data science concepts.  

## Activate Jupyter Notebook 

You can run Jupyter Notebook on log data in Azure Monitor Logs: 
- In the cloud, using Microsoft services, such as [Azure Machine Learning](/azure/machine-learning/samples-notebooks) or [Synapse Notebooks](/azure/synapse-analytics/spark/apache-spark-notebook-concept), or public services. 
- Locally, using Microsoft tools, such as [Azure Data Studio](/sql/azure-data-studio/notebooks/notebooks-guidance?view=azure-sqldw-latest) or [Visual Studio](https://code.visualstudio.com/docs/datascience/jupyter-notebooks), or open source tools.  

For more information, see [Notebooks at Microsoft](https://visualstudio.microsoft.com/vs/features/notebooks-at-microsoft/).  

In this tutorial, you learn how to: 

1. Create a new or open existing notebook in Azure Machine Learning. 
1. Connect to a Log Analytics workspace and run KQL queries and custom code. We will show two examples: 

    - Custom machine learning model: We'll use [Azure Monitor Query client library for Python](/python/api/overview/azure/monitor-query-readme?view=azure-python) to run a simple KQL query and send data from Azure Monitor Logs into a pandas DataFrame, where we'll train a regression model and score a new set of data to identify anomalies. 
    - Built-in KQL time series and machine learning functions: We'll use the [MSTICPY library](https://msticpy.readthedocs.io/en/latest/) to explorer data with KQL queries and visualizations, and run a built-in templated query (in Python) to invoke a native KQL function for anomaly detection, and we'll apply custom code to refine anomalies and save them into a pandas DataFrame. 

1. Ingest anomalies into a custom table in your Log Analytics workspace using the Logs Ingestion API for further investigation, alert creation, use in dashboards, and so on. 

## Create new or open existing notebook in Azure Machine Learning 

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com/).
1. Select your workspace, if it isn't already open.    
1. [Create a notebook](/azure/machine-learning/how-to-manage-files) or [open an existing notebook](/azure/machine-learning/how-to-run-jupyter-notebooks#access-notebooks-from-your-workspace). 
1. [Connect to a compute instance](/azure/machine-learning/how-to-run-jupyter-notebooks#run-a-notebook-or-python-script).  
    
    For this tutorial, select CPU type. 
    
    To use distributed GPU training code, see [Distributed GPU training guide](azure/machine-learning/v1/how-to-train-distributed-gpu). 
 
1. Verify Python kernel selected Python 3.8 or higher. 


 ## Install required Python tools

1. Install the [Azure Monitor Query client library for Python](https://docs.microsoft.com/en-us/python/api/overview/azure/monitor-query-readme?view=azure-python), which lets you execute read-only queries on data in your Log Analytics workspace. 
1. Install the [Azure Identity client library for Python](https://pypi.org/project/azure-identity/), which enables Azure Active Directory token authentication using the Azure SDK. 
1. Install [Plotly](https://plotly.com/python/), a popular Python visualization package.

 ## Connect to your workspace

1. Authenticate using `DefaultAzureCredential` from the `azure-identity` package.
1. Define your variables and functions.
1. 
1. 
    Guy - show the screenshot from Anomalies_CL table (maybe to start the screenshot from AnomalyTimeGenerated, and not to show TimeGenerated which shows current date - it might confuse)

 