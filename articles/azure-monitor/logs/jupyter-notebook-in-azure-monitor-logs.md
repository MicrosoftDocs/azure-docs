---
title: Run custom code on data in Azure Monitor Logs using Jupyter Notebook
description: Learn how to use KQL machine learning tools for time series analysis and anomaly detection in Azure Monitor Log Analytics. 
ms.service: azure-monitor
ms.topic: tutorial 
author: guywild
ms.author: guywild
ms.reviewer: ilanawaitser
ms.date: 25/01/2023

# Customer intent:  As a data analyst, I want to use to run custom code on data in Azure Monitor Logs using Jupyter Notebook to gain insights without having to export data outside of Azure Monitor.

---
# Run custom code on data in Azure Monitor Logs using Jupyter Notebook
 

Jupyter Notebook is an open-source web application that lets you create and share documents containing live code, equations, visualizations, and narrative text. Jupyter Notebook is a popular data science tool that's commonly used for data cleaning and transformation, numerical simulation, statistical modeling, data visualization, and machine learning. 

Use Jupyter Notebook to: 
- Run custom code on log data. 
- Work with log data at big scales either by using in-memory processing (with pandas, pyspark dataframes) or by exporting data to external services  

## Benefits 

- Run KQL power queries and custom code in any language, using Azure Monitor REST API, Azure Monitor libraries for Python and other libraries, including custom machine learning algorithms. 
- Create a multi-step process, running code in each step based on the results of the previous step with possibility for advanced visualization options. Such streamlined, multi-step processes can be especially useful in building and running machine learning pipelines, performing advanced analytics analysis or creating troubleshooting guides for Support needs (TSGs). 
- No user interface limits, and effective techniques for working with data at large scales  
- Working on log data from Notebook using Pandas or Spark DataFrame lets you avoid the costs and maintenance overhead exporting data and using external services 

## Limitations 

- Executing custom code on copy of data in the Pandas DataFrame leads to downgraded performance and increased latency compared to running native KQL operators and functions directly in Azure Monitor. 
- API-related limitations (which possible to overcome as suggested later) 

## Activate Jupyter Notebooks 

You can run Jupyter Notebook on log data in Azure Monitor Logs: 
- In the cloud, using Microsoft services, such as Azure Machine Learning or Synapse Notebooks, or public services. 
- Locally, using Microsoft tools, such as Azure Data Studio or Visual Studio, or open source tools.  

For more information, see [Notebooks at Microsoft](https://visualstudio.microsoft.com/vs/features/notebooks-at-microsoft/).  

 

In this tutorial, you learn how to: 

Create new or open existing notebook in Azure Machine Learning 

Connect to LA workspace and run KQL queries and custom code. We will show 2 examples: 

Custom ML model: Using Azure Monitor Query client library for Python, we will run simple KQL query/queries to bring results from Azure Monitor Logs into pandas dataframe, will train regression model, will save it and will score on new set of data. We’ll identify anomalies and save them into pandas dataframe 

Built-in KQL Time series and ML functions: Using MSTICPY library, we will explorer data with KQL queries and visualizations,  then will run built-in templated query (in Python) which invokes native KQL function for anomalies detection, we will apply custom code to refine anomalies and save them into pandas dataframe 

We will ingest found anomalies into custom table of LA workspace using Logs Ingestion API for further investigation,  alerts creation, dashboards etc’) 

Prerequisites: 

1.  LA Workspace with data in AzureDiagnostics table 

2. Azure Machine Learning  

 

@Guy – see as example: 

https://learn.microsoft.com/en-us/azure/sentinel/notebooks-with-synapse#prerequisites 

 

3. Basic knowledge of Data Science  

 

Create new or open existing notebook in Azure Machine Learning 

Access notebook from ML workspace 

Sign into Azure Machine Learning studio 

Select your workspace, if it isn't already open 

On the left, select Notebooks 

Create New notebook or upload existing  

Connect to compute instance  

For this tutorial you should select CPU type. 

If you are interested to use distributed GPU training code this article can help you. 

 

 

Verify Python kernel selected Python 3.8 or higher 

 

 

 