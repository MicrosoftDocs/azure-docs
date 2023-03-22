---
title: AIOps and machine learning in Azure Monitor Logs
description: Use machine learning to improve your ability to predict IT needs and identify and respond to anomalous patterns in log data. 
author: guywi-ms
ms.author: guywild
ms.reviewer: ilanawaitser
ms.topic: conceptual 
ms.date: 02/28/2023

#customer-intent: As a data scientist, I want to understand how to use machine learning to improve my ability to predict IT needs and identify and respond to anomalous patterns in log data.

---
# AIOps and machine learning in Azure Monitor 

[Artificial Intelligence for IT Operations (AIOps)](https://www.gartner.com/information-technology/glossary/aiops-artificial-intelligence-operations) offers powerful methods of processing and automatically acting on data you collect from applications, services, and IT resources into Azure Monitor using machine learning.

Azure Monitor's built-in machine learning capabilities provide insights and automate data-driven tasks, such as predicting capacity usage and autoscaling, identifying and analyzing application performance issues, and detecting anomalous behaviors in virtual machines, containers, and other resources. 

These features let you take advantage of machine learning to gain insights and boost your IT monitoring and operations immediately, without machine learning knowledge and further investment.    

You can also create machine learning pipelines to act on data in Azure Monitor Logs to train your own machine learning models and add analysis and response capabilities that address your IT and business goals.    

This article describes Azure Monitor's built-in AIOps capabilities and explains how you can create and run customized machine learning models on data in Azure Monitor Logs. 

## Built-in Azure Monitor AIOps capabilities 

|Monitoring scenario|AIOps capability|Description| 
|-|-|-|
|Log monitoring| [Kusto Query Language (KQL) time series analysis and machine learning functions](../logs/kql-machine-learning-azure-monitor.md) | Easy-to-use tools for generating time series data, detecting anomalies, forecasting, and performing root cause analysis directly in Azure Monitor Logs without requiring in-depth knowledge of data science and programming languages. 
|Application performance monitoring|[Application Map Intelligent view](../app/app-map.md) and [Smart detection](../alerts/proactive-diagnostics.md)| Automatically maps dependencies between services and identifies potential root causes of application performance issues.|
|Metric alerts|[Dynamic thresholds for metric alerting](../alerts/alerts-dynamic-thresholds.md)| Learns metrics patterns, automatically sets alert thresholds based on historical data, and identifies anomalies that might indicate service issues.|
|Virtual machine scale sets|[Predictive autoscale](../autoscale/autoscale-predictive.md)|Forecasts the overall CPU requirements of a virtual machine scale set, based on historical CPU usage patterns, and automatically scales out to meet these needs.|

## Use machine learning in Azure Monitor Logs

[Azure Monitor Logs](../logs/data-platform-logs.md) is based on the high-performance Kusto big data analytics platform, which makes it easy to analyze large volumes of data you collect into a [Log Analytics workspace](../logs/log-analytics-workspace-overview.md) in near real-time. 

Use [the Kusto Query Languages's built-in time series analysis and machine learning functions, operators, and plug-ins](/azure/data-explorer/kusto/query/machine-learning-clustering) to gain insights about service health, usage, capacity and other trends and to generate forecasts and detect anomalies. 

To gain greater flexibility and expand your ability to analyze and act on data, you can also implement your own machine learning pipeline on data in Azure Monitor Logs.   

This table compares the advantages and limitations of using KQL's built-in machine learning capabilities and creating your own machine learning pipeline, and links to tutorials that demonstrate how you can implement each:

||Built-in KQL machine learning capabilities |Create your own machine learning pipeline|
|-|-|-|
|**Scenario**|- Anomaly detection and root cause analysis :white_check_mark:<br>- Alerting and automation :x: |- Anomaly detection and root cause analysis :white_check_mark:<br>- Alerting and automation :white_check_mark:|
|**Integration**|None required.|Requires integration with a tool, such as Jupyter Notebook, and a machine learning service.|
|**Performance**|Optimal performance, using the power of the Azure Data Explorer platform, running at high scales in a distributed manner. |- Dependent on the machine learning service you use. <br>- Introduces latency when querying or exporting data. |
|**Cost**|No extra cost|- Cost of the machine learning service you use.<br>- Depending on how you [implement your machine learning pipeline](#create-your-own-machine-learning-pipeline-to-act-on-data-in-azure-monitor-logs), you might incur charges for exporting data and ingest data into Azure Monitor Logs.|
|**Limitations**|Analyze several GBs of data, or a few million records.|Supports larger data volumes, depending on how you [implement your machine learning pipeline](#create-your-own-machine-learning-pipeline-to-act-on-data-in-azure-monitor-logs). |
| |Linear regression model with a set number of configurable parameters.|Completely customizable machine learning model.  |
| |Azure portal or Query API log query limits depending on whether you're working in the portal or using the API, for example, from notebooks.| Query API log query limits depending on how you [implement your machine learning pipeline](#create-your-own-machine-learning-pipeline-to-act-on-data-in-azure-monitor-logs).|
|**Tutorial**|[Detect and analyze anomalies using KQL machine learning capabilities in Azure Monitor](../logs/kql-machine-learning-azure-monitor.md)|[Train a regression model on data in Azure Monitor Logs by using Jupyter Notebook](../logs/jupyter-notebook-ml-azure-monitor-logs.md)|

## Create your own machine learning pipeline

If the richness of native KQL functions doesn't meet your business needs, you can implement custom machine learning models. For example, if you need to perform hunting for security attacks when data requires more sophisticated models than linear or other regressions supported by KQL, or if you need to correlate data in Azure Monitor Logs with data from other sources. 

Setting up a machine learning pipeline typically involves all or some of these tasks:
 
- Data exploration, including advanced analytics and visualization 
- Model training 
- Model deployment and scoring 
- Getting insights from scored data 

This table compares the advantages and limitations of the three using machine learning pipeline implementation approaches:

||Integrated notebook|External machine learning pipeline|Hybrid pipeline: Integrated notebook, external model training|
|-|-|-|-|
|**Data exported?**|No|Yes|- Training: Yes<br>- Scoring: No |
|**Uses other Azure services**|Use a notebook to run code and queries on log data in Azure Monitor Logs:<br>- Using Microsoft cloud services, such as [Azure Machine Learning](/azure/machine-learning/samples-notebooks) or [Azure Synapse](/azure/synapse-analytics/spark/apache-spark-notebook-concept), or public services.<br>- Locally, using Microsoft tools, such as [Azure Data Studio](/sql/azure-data-studio/notebooks/notebooks-guidance) or [Visual Studio](https://code.visualstudio.com/docs/datascience/jupyter-notebooks), or open source tools.|Typically, using [Azure Data Lake Storage](/azure/storage/blobs/data-lake-storage-introduction) or [Azure Synapse](/azure/synapse-analytics/overview-what-is). |- Training: Typically, using [Azure Data Lake Storage](/azure/storage/blobs/data-lake-storage-introduction) or [Azure Synapse](/azure/synapse-analytics/overview-what-is).<br>- Scoring: Optional, using [Azure Data Lake Storage](/azure/storage/blobs/data-lake-storage-introduction) or [Azure Synapse](/azure/synapse-analytics/overview-what-is).|
|**Advantages**|Minimum latency, cost savings|No query limits|Minimum latency for scoring<br>Cost savings for scoring |
|**Limitations**|Query API log query limits, which are possible to overcome by splitting query execution into chunks|Cost of export & storage, increased latency due to export|Cost of export & training (for training) |
| |For small-medium volumes of data (up to several GB / few millions of records)|Large volumes of data (for both training and scoring)|Large volumes of data for training small-medium volumes of data for scoring  |


### Limitations of KQL machine learning capabilities

- Implementing custom machine learning models 
- Built-in templated queries - The [MSTICPY Python library](https://msticpy.readthedocs.io/latest/getting_started/msticpyconfig.html) features built-in templated queries that invoke native KQL functions. 


### When to Use
- To analyze log data for various insights such as monitoring service health, usage, or other trends, and anomalies detection using time series on selected parameters. 
- To gain greater flexibility and deeper insights than out-of-the-box insights tools without running custom algorithms or exporting data. 
- If you don't need to be an expert in data science or programming languages. 

### Data Exploration 

Azure Monitor offers a set of different tools to explore data and prepare it for analytics and/or machine learning. One of the quickest ways to get started with data exploration is using Log Analytics Tool or using notebooks running



Machine learning libraries example:<br>- ML open-source frameworks like Scikit-Learn<br>- PyTorch<br>- Tensorflow<br>- SparkML<br>- Azure Machine Learning SDK<br>- MMLSpark (Microsoft ML library for Apache Spark)
## Next steps

- [Learn more about the Basic Logs and Analytics log plans](basic-logs-configure.md).
- [Use a search job to retrieve data from Basic Logs into Analytics Logs where it can be queries multiple times](search-jobs.md).
