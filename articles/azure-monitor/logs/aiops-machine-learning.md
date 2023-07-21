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
# Detect and mitigate potential issues using AIOps and machine learning in Azure Monitor 
Artificial Intelligence for IT Operations (AIOps) offers powerful ways to improve service quality and reliability by using machine learning to process and automatically act on data you collect from applications, services, and IT resources into Azure Monitor.

Azure Monitor's built-in AIOps capabilities provide insights and automate data-driven tasks, such as predicting capacity usage and autoscaling, identifying and analyzing application performance issues, and detecting anomalous behaviors in virtual machines, containers, and other resources. These features boost your IT monitoring and operations, without requiring machine learning knowledge and further investment.    

Azure Monitor also provides tools that let you create your own machine learning pipeline to introduce new analysis and response capabilities and act on data in Azure Monitor Logs.    

This article describes Azure Monitor's built-in AIOps capabilities and explains how you can create and run customized machine learning models and build an automated machine learning pipeline on data in Azure Monitor Logs. 

## Built-in Azure Monitor AIOps and machine learning capabilities 

|Monitoring scenario|Capability|Description| 
|-|-|-|
|Log monitoring|[Log Analytics Workspace Insights](../logs/log-analytics-workspace-insights-overview.md) | A curated monitoring experience that provides a unified view of your Log Analytics workspaces and uses machine learning to detect ingestion anomalies. |
||[Kusto Query Language (KQL) time series analysis and machine learning functions](../logs/kql-machine-learning-azure-monitor.md)| Easy-to-use tools for generating time series data, detecting anomalies, forecasting, and performing root cause analysis directly in Azure Monitor Logs without requiring in-depth knowledge of data science and programming languages. 
|Application performance monitoring|[Application Map Intelligent view](../app/app-map.md)| Maps dependencies between services and helps you spot performance bottlenecks or failure hotspots across all components of your distributed application.|
||[Smart detection](../alerts/proactive-diagnostics.md)|Analyzes the telemetry your application sends to Application Insights, alerts on performance problems and failure anomalies, and identifies potential root causes of application performance issues.|
|Metric alerts|[Dynamic thresholds for metric alerting](../alerts/alerts-dynamic-thresholds.md)| Learns metrics patterns, automatically sets alert thresholds based on historical data, and identifies anomalies that might indicate service issues.|
|Virtual machine scale sets|[Predictive autoscale](../autoscale/autoscale-predictive.md)|Forecasts the overall CPU requirements of a virtual machine scale set, based on historical CPU usage patterns, and automatically scales out to meet these needs.|

## Machine learning in Azure Monitor Logs

Use the Kusto Query Language's [built-in time series analysis and machine learning functions, operators, and plug-ins](/azure/data-explorer/kusto/query/machine-learning-clustering) to gain insights about service health, usage, capacity and other trends, and to generate forecasts and detect anomalies in [Azure Monitor Logs](../logs/data-platform-logs.md). 

To gain greater flexibility and expand your ability to analyze and act on data, you can also implement your own machine learning pipeline on data in Azure Monitor Logs.   

This table compares the advantages and limitations of using KQL's built-in machine learning capabilities and creating your own machine learning pipeline, and links to tutorials that demonstrate how you can implement each:

||Built-in KQL machine learning capabilities |Create your own machine learning pipeline|
|-|-|-|
|**Scenario**| :white_check_mark: Anomaly detection, root cause, and time series analysis <br> | :white_check_mark: Anomaly detection, root cause, and time series analysis <br> :white_check_mark: [Advanced analysis and AIOPs scenarios](#create-your-own-machine-learning-pipeline-on-data-in-azure-monitor-logs)  |
|**Advantages**|🔹Gets you started very quickly.<br>🔹No data science knowledge and programming skills required.<br>🔹 Optimal performance and cost savings. |🔹Supports larger scales.<br>🔹Enables advanced, more complex scenarios.<br>🔹Flexibility in choosing libraries, models, parameters.|
|**Service limits and data volumes** |[Azure portal](../service-limits.md#azure-portal) or [Query API log query limits](../service-limits.md#la-query-api) depending on whether you're working in the portal or using the API, for example, from a notebook.|🔹[Query API log query limits](../service-limits.md#la-query-api) if you query data in Azure Monitor Logs as part of your [machine learning pipeline](#create-your-own-machine-learning-pipeline-on-data-in-azure-monitor-logs). Otherwise, no Azure service limits.<br>🔹Can support larger data volumes.|
|**Integration**|None required. Run using [Log Analytics](../logs/log-analytics-tutorial.md) in the Azure portal or from an [integrated Jupyter Notebook](../logs/notebooks-azure-monitor-logs.md).|Requires integration with a tool, such as [Jupyter Notebook](../logs/notebooks-azure-monitor-logs.md). Typically, you'd also integrate with other Azure services, like [Azure Synapse Analytics](/azure/synapse-analytics/overview-what-is).|
|**Performance**|Optimal performance, using the Azure Data Explorer platform, running at high scales in a distributed manner. |Introduces a small amount of latency when querying or exporting data, depending on how you [implement your machine learning pipeline](#create-your-own-machine-learning-pipeline-on-data-in-azure-monitor-logs). |
|**Model type** |Linear regression model and other models supported by KQL time series functions with a set of configurable parameters.|Completely customizable machine learning model or anomaly detection method.  |
|**Cost**|No extra cost.| Depending on how you [implement your machine learning pipeline](#create-your-own-machine-learning-pipeline-on-data-in-azure-monitor-logs), you might incur charges for [exporting data](../logs/logs-data-export.md#pricing-model), ingesting scored data into Azure Monitor Logs, and the use of other Azure services.|
|**Tutorial**|[Detect and analyze anomalies using KQL machine learning capabilities in Azure Monitor](../logs/kql-machine-learning-azure-monitor.md)|[Analyze data in Azure Monitor Logs using a notebook](../logs/notebooks-azure-monitor-logs.md)|

## Create your own machine learning pipeline on data in Azure Monitor Logs

Build your own machine learning pipeline on data in Azure Monitor Logs to introduce new AIOps capabilities and support advanced scenarios, such as: 

- Hunting for security attacks with more sophisticated models than those by KQL.
- Detecting performance issues and troubleshooting errors in a web application.
- Creating multi-step flows, running code in each step based on the results of the previous step.
- Automating the analysis of Azure Monitor Log data and providing insights into multiple areas, including infrastructure health and customer behavior.
- Correlating data in Azure Monitor Logs with data from other sources.

There are two approaches to making data in Azure Monitor Logs available to your machine learning pipeline:

- **Query data in Azure Monitor Logs** - [Integrate a notebook with Azure Monitor Logs](../logs/notebooks-azure-monitor-logs.md) or run a script or application on log data using libraries like [Azure Monitor Query client library](/python/api/overview/azure/monitor-query-readme) or [MSTICPY](https://msticpy.readthedocs.io/en/latest/) to retrieve data from Azure Monitor Logs in tabular form; for example, into a [Pandas DataFrame](https://pandas.pydata.org/docs/user_guide/dsintro.html#dataframe). The data you query is retrieved to an in-memory object on your server, without exporting the data out of your Log Analytics workspace.   

    > [!NOTE]
    > You might need to convert data formats as part of your pipeline. For example, to use libraries built on top of Apache Spark, like [SynapseML](https://microsoft.github.io/SynapseML/), you might need to [convert Pandas to PySpark DataFrame](https://sparkbyexamples.com/pyspark/convert-pandas-to-pyspark-dataframe/). 

- **Export data out of Azure Monitor Logs** - [Export data out of your Log Analytics workspace](../logs/logs-data-export.md), usually to a blob storage account, and [implement your machine learning pipeline using a machine learning library](#implement-the-steps-of-the-machine-learning-lifecycle-in-azure-monitor-logs). 


This table compares the advantages and limitations of the approaches to retrieving data for your machine learning pipeline:

| |Query data in Azure Monitor Logs|Export data|
|-|-|-|-|
|**Advantages**|🔹Gets you started quickly.<br>🔹Requires only basic data science and programming skills.<br>🔹Minimal latency and cost savings.|🔹Supports larger scales.<br>🔹No query limitations.|
|**Data exported?**|No|Yes|
|**Service limits**|[Query API log query limits](../service-limits.md#log-analytics-workspaces) and [user query throttling](../service-limits.md#user-query-throttling). You can overcome Query API limits to, a certain degree, by [splitting larger queries into chunks](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/monitor/azure-monitor-query/samples/notebooks/sample_large_query.ipynb).| None from Azure Monitor. |
|**Data volumes**|Analyze several GBs of data, or a few million records per hour.|Supports large volumes of data.|
|**Machine learning library**|For small to medium-sized datasets, you'd typically use single-node machine learning libraries, like [Scikit Learn](https://scikit-learn.org/stable/).|For large datasets, you'd typically use big data machine learning libraries, like [SynapseML](https://github.com/microsoft/SynapseML).|
|**Latency** | Minimal. | Introduces a small amount of latency in exporting data.|
|**Cost** |No extra charges in Azure Monitor.<br>Cost of Azure Synapse Analytics, Azure Machine Learning, or other service, if used.| [Cost of data export](../logs/logs-data-export.md#pricing-model) and external storage.<br>Cost of Azure Synapse Analytics, Azure Machine Learning, or other service, if used.|

> [!TIP]
> To benefit from the best of both implementation approaches, create a hybrid pipeline. A common hybrid approach is to export data for model training, which involves large volumes of data, and to use the *query data in Azure Monitor Logs* approach to explore data and score new data to reduce latency and costs.
## Implement the steps of the machine learning lifecycle in Azure Monitor Logs

Setting up a machine learning pipeline typically involves all or some of the steps described below.

There are various Azure and open source machine learning libraries you can use to implement your machine learning pipeline, including [Scikit Learn](https://scikit-learn.org/), [PyTorch](https://pytorch.org/), [Tensorflow](https://www.tensorflow.org/), [Spark MLlib](https://spark.apache.org/docs/latest/ml-guide.html), and [SynapseML](https://github.com/microsoft/SynapseML).

This table describes each step and provides high-level guidance and some examples of how to implement these steps based on the implementation approaches described in [Create your own machine learning pipeline on data in Azure Monitor Logs](#create-your-own-machine-learning-pipeline-on-data-in-azure-monitor-logs): 

|Step|Description|Query data in Azure Monitor Logs|Export data|
|-|-|-|-|
|**Explore data**| Examine and understand the data you've collected. |The simplest way to explore your data is using [Log Analytics](../logs/log-analytics-tutorial.md), which provides a rich set of tools for exploring and visualizing data in the Azure portal. You can also [analyze data in Azure Monitor Logs using a notebook](../logs/notebooks-azure-monitor-logs.md).|To analyze logs outside of Azure Monitor, [export data out of your Log Analytics workspace](../logs/logs-data-export.md) and set up the environment in the service you choose.<br>For an example of how to explore logs outside of Azure Monitor, see [Analyze data exported from Log Analytics using Synapse](https://techcommunity.microsoft.com/t5/azure-observability-blog/how-to-analyze-data-exported-from-log-analytics-data-using/ba-p/2547888).|
|**Build and training a machine learning model**|Model training is an iterative process. Researchers or data scientists develop a model by fetching and cleaning the training data, engineer features, trying various models and tuning parameters, and repeating this cycle until the model is accurate and robust.|For small to medium-sized datasets, you typically use single-node machine learning libraries, like [Scikit Learn](https://scikit-learn.org/stable/).<br> For an example of how to train a machine learning model on data in Azure Monitor Logs using the Scikit Learn library, see this [sample notebook: Detect anomalies in Azure Monitor Logs using machine learning techniques](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/monitor/azure-monitor-query/samples/notebooks/sample_machine_learning_sklearn.ipynb).|For large datasets, you typically use big data machine learning libraries, like [SynapseML](/azure/synapse-analytics/machine-learning/synapse-machine-learning-library).<br>For examples of how to train a machine learning model on data you export out of Azure Monitor Logs, see  [SynapseML examples](https://microsoft.github.io/SynapseML/docs/about/#examples).|
|**Deploy and score a model**|Scoring is the process of applying a machine learning model on new data to get predictions. Scoring usually needs to be done at scale with minimal latency.|To query new data in Azure Monitor Logs, use [Azure Monitor Query client library](/python/api/overview/azure/monitor-query-readme).<br>For an example of how to score data using open source tools, see this [sample notebook: Detect anomalies in Azure Monitor Logs using machine learning techniques](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/monitor/azure-monitor-query/samples/notebooks/sample_machine_learning_sklearn.ipynb).|For examples of how to score new data you export out of Azure Monitor Logs, see [SynapseML examples](https://microsoft.github.io/SynapseML/docs/about/#examples).|
|**Run your pipeline on schedule**| Automate your pipeline to retrain your model regularly on current data.| Schedule your machine learning pipeline with [Azure Synapse Analytics](/azure/synapse-analytics/synapse-notebook-activity) or [Azure Machine Learning](../../machine-learning/how-to-schedule-pipeline-job.md).|See the examples in the *Query data in Azure Monitor Logs* column. |

Ingesting scored results to a Log Analytics workspace lets you use the data to get advanced insights, and to create alerts and dashboards. For an example of how to ingest scored results using [Azure Monitor Ingestion client library](/python/api/overview/azure/monitor-ingestion-readme), see [Ingest anomalies into a custom table in your Log Analytics workspace](../logs/notebooks-azure-monitor-logs.md#4-ingest-analyzed-data-into-a-custom-table-in-your-log-analytics-workspace-optional).
## Next steps

Learn more about:

- [Azure Monitor Logs](../logs/data-platform-logs.md).
- [Azure Monitor Insights and curated visualizations](../insights/insights-overview.md).
