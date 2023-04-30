---
title: AIOps and machine learning in Azure Monitor
description: Use machine learning to improve your ability to predict IT needs and identify and respond to anomalous patterns in log data. 
author: guywi-ms
ms.author: guywild
ms.reviewer: ilanawaitser
ms.topic: conceptual 
ms.date: 02/28/2023

#customer-intent: As a DevOps manager or data scientist, I want to understand which AIOps features Azure Monitor offers and how to implement a machine learning pipeline on data in Azure Monitor Logs so that I can use artifical intelligence to to improve service quality and reliability of my IT environment.

---
# AIOps and machine learning in Azure Monitor 

Artificial Intelligence for IT Operations (AIOps) offers powerful ways to improve service quality and reliability by using machine learning to process and automatically act on data you collect from applications, services, and IT resources into Azure Monitor.

Azure Monitor's built-in AIOps capabilities provide insights and automate data-driven tasks, such as predicting capacity usage and autoscaling, identifying and analyzing application performance issues, and detecting anomalous behaviors in virtual machines, containers, and other resources. These features let you take advantage of machine learning to gain insights and boost your IT monitoring and operations, without requiring machine learning knowledge and further investment.    

Azure Monitor also provides tools that let you create your own machine learning pipeline to introduce new analysis and response capabilities and act on data in Azure Monitor Logs.    

This article describes Azure Monitor's built-in AIOps capabilities and explains how you can create and run customized machine learning models and build an automated machine learning pipeline on data in Azure Monitor Logs. 

## Built-in Azure Monitor AIOps capabilities 

|Monitoring scenario|AIOps capability|Description| 
|-|-|-|
|Log monitoring| [Kusto Query Language (KQL) time series analysis and machine learning functions](../logs/kql-machine-learning-azure-monitor.md) | Easy-to-use tools for generating time series data, detecting anomalies, forecasting, and performing root cause analysis directly in Azure Monitor Logs without requiring in-depth knowledge of data science and programming languages. 
|Application performance monitoring|[Application Map Intelligent view](../app/app-map.md) and [Smart detection](../alerts/proactive-diagnostics.md)| Automatically maps dependencies between services and identifies potential root causes of application performance issues.|
|Metric alerts|[Dynamic thresholds for metric alerting](../alerts/alerts-dynamic-thresholds.md)| Learns metrics patterns, automatically sets alert thresholds based on historical data, and identifies anomalies that might indicate service issues.|
|Virtual machine scale sets|[Predictive autoscale](../autoscale/autoscale-predictive.md)|Forecasts the overall CPU requirements of a virtual machine scale set, based on historical CPU usage patterns, and automatically scales out to meet these needs.|

## Machine learning in Azure Monitor Logs

[Azure Monitor Logs](../logs/data-platform-logs.md) is based on the high-performance Kusto big data analytics platform, which makes it easy to analyze large volumes of data you collect into a [Log Analytics workspace](../logs/log-analytics-workspace-overview.md) in near real-time. Use the Kusto Query Language's [built-in time series analysis and machine learning functions, operators, and plug-ins](/azure/data-explorer/kusto/query/machine-learning-clustering) to gain insights about service health, usage, capacity and other trends, and to generate forecasts and detect anomalies. 

To gain greater flexibility and expand your ability to analyze and act on data, you can also implement your own machine learning pipeline on data in Azure Monitor Logs.   

This table compares the advantages and limitations of using KQL's built-in machine learning capabilities and creating your own machine learning pipeline, and links to tutorials that demonstrate how you can implement each:

||Built-in KQL machine learning capabilities |Create your own machine learning pipeline|
|-|-|-|
|**Scenario**| :white_check_mark: Anomaly detection and root cause analysis <br> | :white_check_mark: Anomaly detection and root cause analysis <br> :white_check_mark: Alerting and automation<br> :white_check_mark: [Advanced analysis and AIOPs scenarios](#create-your-own-machine-learning-pipeline-on-data-in-azure-monitor-logs)  |
|**Advantages**|🔹Gets you started very quickly.<br>🔹Doesn't require data science knowledge and programming skills.<br>🔹 Optimal performance and cost savings. |🔹Supports larger scales.<br>🔹Enables advanced, more complex scenarios.<br>🔹Flexibility in choosing libraries, models, parameters.|
|**Service limits** |[Azure portal or Query API log query limits](../service-limits.md#azure-portal) depending on whether you're working in the portal or using the API, for example, from a notebook.| [Query API log query limits](../service-limits.md#la-query-api)] depending on how you [implement your machine learning pipeline](#create-your-own-machine-learning-pipeline-on-data-in-azure-monitor-logs).|
|**Data volumes**|Supports several GBs of data, or a few million records.|Supports larger data volumes, depending on how you [implement your machine learning pipeline](#create-your-own-machine-learning-pipeline-on-data-in-azure-monitor-logs). |
|**Integration**|None required.|Requires integration with a tool, such as [Jupyter Notebook](../logs/jupyter-notebook-ml-azure-monitor-logs.md), or a machine learning service.|
|**Performance**|Optimal performance, using the power of the Azure Data Explorer platform, running at high scales in a distributed manner. |Introduces latency when querying or exporting data, depending on how you implement your machine learning pipeline. |
|**Model type** |Linear regression model with a set of configurable parameters.|Completely customizable machine learning model.  |
|**Cost**|No extra cost.| Depending on how you [implement your machine learning pipeline](#create-your-own-machine-learning-pipeline-on-data-in-azure-monitor-logs), you might incur charges for exporting data, ingesting data into Azure Monitor Logs, and the use of other Azure services.|
|**Tutorial**|[Detect and analyze anomalies using KQL machine learning capabilities in Azure Monitor](../logs/kql-machine-learning-azure-monitor.md)|[Train a regression model on data in Azure Monitor Logs by using Jupyter Notebook](../logs/jupyter-notebook-ml-azure-monitor-logs.md)|

## Create your own machine learning pipeline on data in Azure Monitor Logs

You can implement custom machine learning models and build your own machine learning pipeline on data in Azure Monitor Logs to support advanced scenarios, such as: 

- Hunting for security attacks with more sophisticated models than those by KQL.
- Detecting performance issues and troubleshooting errors in a web application.
- Creating multi-step flows, running code in each step based on the results of the previous step.
- Automating the analysis of Azure Monitor Log data and providing insights into multiple areas, including infrastructure health and customer behavior.
- Correlating data in Azure Monitor Logs with data from other sources.

There are two approaches to making data in Azure Monitor Logs available to your machine learning pipeline:

- **Query data from Azure Monitor Logs to an in-memory object** - [Integrate a notebook with Azure Monitor Logs](../logs/jupyter-notebook-ml-azure-monitor-logs.md) or run a script or application on log data using libraries like [Azure Monitor Query client library](/python/api/overview/azure/monitor-query-readme) or [MSTICPY](https://msticpy.readthedocs.io/en/latest/) to retrieve data from Azure Monitor Logs in tabular form; for example, into a [Pandas DataFrame](https://pandas.pydata.org/docs/user_guide/dsintro.html#dataframe). The data you query is retrieved to an in-memory object on your server, without exporting the data out of your Log Analytics workspace.   
- **Export data out of Azure Monitor Logs** - [Export data out of your Log Analytics workspace](../logs/logs-data-export.md), usually to a blob storage account, and [implement your machine learning pipeline using a machine learning library](#implement-the-steps-of-the-machine-learning-lifecycle-in-azure-monitor-logs). 

> [!NOTE]
> You might need to convert data formats as part of your pipeline. For example, to use libraries built on top of Apache Spark, like [SynapseML](https://microsoft.github.io/SynapseML/), you need to [convert Pandas to PySpark DataFrame](https://sparkbyexamples.com/pyspark/convert-pandas-to-pyspark-dataframe/). 


This table compares the advantages and limitations of the two machine learning pipeline implementation approaches:

| |Query data into Azure Monitor Logs|Export data to storage|
|-|-|-|-|
|**Advantages**|🔹Gets you started quickly.<br>🔹Requires only basic data science and programming skills.<br>🔹Minimal latency and cost savings.|🔹Supports larger scales.<br>🔹No query limitations.|
|**Data exported?**|No|Yes|
|**Service limits**|[Query API log query limits](../service-limits.md#log-analytics-workspaces), which you can overcome by [splitting query execution into chunks](https://learn.microsoft.com/samples/azure/azure-sdk-for-python/query-azuremonitor-samples/).| None. |
|**Data volumes**|Analyze several GBs of data, or a few million records.|Supports large volumes of data.|
|**Machine learning library**|Optionally - using [Azure Data Lake Storage](/azure/storage/blobs/data-lake-storage-introduction) or [Azure Synapse](/azure/synapse-analytics/overview-what-is).|Typically, using [Azure Data Lake Storage](/azure/storage/blobs/data-lake-storage-introduction) or [Azure Synapse](/azure/synapse-analytics/overview-what-is). |
|**Latency** | Minimal | Introduces latency in scoring new data.|
|**Cost** |Cost of the server on which your notebook or code runs. | Cost of data export and external storage.|

> [!TIP]
> To benefit from the best of both implementation approaches, create a hybrid pipeline, based on your needs. A common hybrid approach is to export data for model training, which involves large volumes of data, and reduce latency by using the *query data in Azure Monitor Logs* approach to explore data and score new data.
### Implement the steps of the machine learning lifecycle in Azure Monitor Logs

Setting up a machine learning pipeline typically involves all or some of the steps described below.

This table describes each step and provides high-level guidance and some examples of how to implement these steps based on the implementation approaches described in [Create your own machine learning pipeline on data in Azure Monitor Logs](#create-your-own-machine-learning-pipeline-on-data-in-azure-monitor-logs): 

|Step|Description|Query data in Azure Monitor Logs|Export data|
|-|-|-|-|
|**Explore data**| Examine and understand the data you've collected. The simplest way to explore your data is using [Log Analytics](../logs/log-analytics-tutorial.md), which provides a rich set of tools for exploring and visualizing data in the Azure portal.|[Integrate a notebook with Azure Monitor Logs](../logs/jupyter-notebook-ml-azure-monitor-logs.md) or run a script or application on log data using libraries like [Azure Monitor Query client library](/python/api/overview/azure/monitor-query-readme) or [MSTICPY](https://msticpy.readthedocs.io/en/latest/) to retrieve data from Azure Monitor Logs in a Pandas DataFrame.|To analyze logs outside of Azure Monitor, [export data out of your Log Analytics workspace](../logs/logs-data-export.md) and set up the environment in the service you choose.<br>For an example of how to explore logs outside of Azure Monitor, see [Analyze data exported from Log Analytics using Synapse](https://techcommunity.microsoft.com/t5/azure-observability-blog/how-to-analyze-data-exported-from-log-analytics-data-using/ba-p/2547888).|
|**Build and training models**|Model training is a long and iterative process. Researchers or data scientists commonly develop a model by fetching and cleaning the training data, engineer features, trying different models and tuning parameters, and repeating this cycle until the model is sufficiently accurate and robust.|For an example of how to train a machine learning model on data in Azure Monitor Logs using the [Scikit Learn library](https://scikit-learn.org/stable/), see [Train and test a machine model on historical data in a Log Analytics workspace](../logs/jupyter-notebook-ml-azure-monitor-logs.md#train-and-test-regression-models-on-historical-data)|For examples of how to train a machine learning model on data you export out of Azure Monitor Logs, see  [SynapseML examples](https://microsoft.github.io/SynapseML/docs/about/#examples).|
|**Deploy and score machine learning models**|Scoring is the process of applying a machine learning model on new data to get predictions. Scoring usually needs to be done at scale with minimal latency.|To query new data in Azure Monitor Logs, use [Azure Monitor Query client library](/python/api/overview/azure/monitor-query-readme).<br>For an example of how to score data using using the [Scikit Learn library](https://scikit-learn.org/stable/), see [Score new data based on values in a Log Analytics workspace](../logs/jupyter-notebook-ml-azure-monitor-logs.md#score-new-data-using-the-trained-model-and-identify-anomalies).|For examples of how to score new data you export out of Azure Monitor Logs, see [SynapseML examples](https://microsoft.github.io/SynapseML/docs/about/#examples).|
|**Get insights from scored data on schedule**| Ingesting scored results to a Log Analytics workspace lets you use the data to get advanced insights, and in alerts and dashboards.<br>Automate your pipeline to retrain your model regularly on current data and respond to identified anomalies.| For an example of how to ingest scored results using [Azure Monitor Ingestion client library](/python/api/overview/azure/monitor-ingestion-readme), see [Ingest anomalies into a custom table in your Log Analytics workspace](../logs/jupyter-notebook-ml-azure-monitor-logs.md#ingest-anomalies-into-a-custom-table-in-your-log-analytics-workspace-optional).<br>To run your notebook on schedule you can run an [Azure Synapse pipeline](../../synapse-analytics/synapse-notebook-activity.md) or an [Azure Machine Learning pipeline](../../machine-learning/how-to-schedule-pipeline-job.md).||
 
## Next steps

Learn more about:

- [Azure Monitor Logs](../logs/data-platform-logs.md).
- [Azure Monitor Insights and curated visualizations](../insights/insights-overview.md).
