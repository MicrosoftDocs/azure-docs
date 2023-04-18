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
|**Scenario**| :white_check_mark: Anomaly detection and root cause analysis <br> | :white_check_mark: Anomaly detection and root cause analysis <br> :white_check_mark: Alerting and automation |
|**Integration**|None required.|Requires integration with a tool, such as Jupyter Notebook, or a machine learning service.|
|**Performance**|Optimal performance, using the power of the Azure Data Explorer platform, running at high scales in a distributed manner. |-  Dependent on the machine learning service you use. <br>-  Introduces latency when querying or exporting data. |
|**Cost**|No extra cost|-  Cost of the machine learning service you use.<br>-  Depending on how you [implement your machine learning pipeline](#apply-your-own-machine-learning-pipeline-to-data-in-azure-monitor-logs), you might incur charges for exporting data and ingest data into Azure Monitor Logs.|
|**Limitations**|Analyze several GBs of data, or a few million records.|Supports larger data volumes, depending on how you [implement your machine learning pipeline](#apply-your-own-machine-learning-pipeline-to-data-in-azure-monitor-logs). |
| |Linear regression model with a set number of configurable parameters.|Completely customizable machine learning model.  |
| |[Azure portal or Query API log query limits](../service-limits.md#log-analytics-workspaces) depending on whether you're working in the portal or using the API, for example, from a notebook.| Query API log query limits depending on how you [implement your machine learning pipeline](#apply-your-own-machine-learning-pipeline-to-data-in-azure-monitor-logs).|
|**Tutorial**|[Detect and analyze anomalies using KQL machine learning capabilities in Azure Monitor](../logs/kql-machine-learning-azure-monitor.md)|[Train a regression model on data in Azure Monitor Logs by using Jupyter Notebook](../logs/jupyter-notebook-ml-azure-monitor-logs.md)|

## Build your own machine learning pipeline on data in Azure Monitor Logs

If the richness of native KQL functions doesn't meet your business needs, you can implement custom machine learning models. For example, if you need to perform hunting for security attacks when data requires more sophisticated models than linear or other regressions supported by KQL, or if you need to correlate data in Azure Monitor Logs with data from other sources. 

This table compares the advantages and limitations of the various machine learning pipeline implementation approaches:

||Integrated environment|External machine learning pipeline|Hybrid pipeline<br>(Scoring in an integrated environment, external model training)|
|-|-|-|-|
|**Data exported?**|No|Yes|**Training**: Yes<br>**Scoring**: No |
|**Uses other Azure services?**|Optional: You can integrate a notebook with Azure Monitor Logs:<br>-  Using Microsoft cloud services, such as [Azure Machine Learning](/azure/machine-learning/samples-notebooks) or [Azure Synapse](/azure/synapse-analytics/spark/apache-spark-notebook-concept), or public services.<br>-  Locally, using Microsoft tools, such as [Azure Data Studio](/sql/azure-data-studio/notebooks/notebooks-guidance) or [Visual Studio](https://code.visualstudio.com/docs/datascience/jupyter-notebooks), or open source tools.|Typically, using [Azure Data Lake Storage](/azure/storage/blobs/data-lake-storage-introduction) or [Azur e Synapse](/azure/synapse-analytics/overview-what-is). |**Training**: Typically, using [Azure Data Lake Storage](/azure/storage/blobs/data-lake-storage-introduction) or [Azure Synapse](/azure/synapse-analytics/overview-what-is).<br>**Scoring**: Optional, using [Azure Data Lake Storage](/azure/storage/blobs/data-lake-storage-introduction) or [Azure Synapse](/azure/synapse-analytics/overview-what-is).|
|**Advantages**|-  Gets you started quickly, without requiring data science and programming skills.<br>- No need to install Python or other tools on your local computer because code runs on a server.<br> -  Minimal latency and cost savings.|No query limits.|**Scoring**: Minimal latency and cost savings.|
|**Limitations**|[Query API log query limits](../service-limits.md#log-analytics-workspaces), which you can overcome by [splitting query execution into chunks](https://learn.microsoft.com/en-us/samples/azure/azure-sdk-for-python/query-azuremonitor-samples/).|Cost of export and storage, increased latency due to export.|**Training**: Cost of export and training. |
| |Analyze several GBs of data, or a few million records.|Training and scoring: Supports large volumes of data.|**Scoring**: Large volumes of data.<br>**Training**: Supports several GBs of data, or a few million records. |


### Implement the machine learning lifecycle in Azure Monitor Logs

Setting up a machine learning pipeline typically involves all or some of these tasks:
 
- Data exploration, including advanced analytics and visualization 
- Model training 
- Model deployment and scoring 
- Getting insights from scored data 

Azure Monitor provides tools for implementing each of these steps by working with data directly in Azure Monitor Logs, or by exporting data for use by other Azure or external services. 

|Step|Description|Data in Azure Monitor Logs|Data exported|
|-|-|-|-|
|**Explore data**|In addition to the native analysis and visualization capabilities of Azure Monitor, there are various tools you can use to query data in a Log Analytics workspace from an integrated environment, including:<br>- [Azure Monitor Query client library](/python/api/overview/azure/monitor-query-readme)<br>-  [Azure Monitor Kqlmagic extension for querying from Jupyter Notebook](https://github.com/Microsoft/jupyter-Kqlmagic/tree/master)<br>-  [MSTIC Jupyter and Python tools investigation and analysis in Jupter Notebook](https://github.com/microsoft/msticpy)<br>-  Numerous tools, like [Pandas](https://pandas.pydata.org/) and [Plotly](https://plotly.com/python/) for creating DataFrames and visualizations. |[Log Analytics](../logs/log-analytics-tutorial.md) is a tool in the Azure portal that provides a rich set of tools for exploring and visualizing data.<br>You can also [query and visualize Azure Monitor Logs data in an integrated environment](../logs/jupyter-notebook-ml-azure-monitor-logs.md#integrate-your-log-analytics-workspace-with-your-notebook), such as a notebook, using [Azure Monitor Query client library](/python/api/overview/azure/monitor-query-readme).|To analyze logs outside of Azure Monitor, [export data out of your Log Analytics workspace](../logs/logs-data-export.md) and set up the environment in the service you choose. For an example of how to explore logs outside of Azure Monitor, see [How to analyze data exported from Log Analytics data using Synapse](https://techcommunity.microsoft.com/t5/azure-observability-blog/how-to-analyze-data-exported-from-log-analytics-data-using/ba-p/2547888).|
|**Build and training models**|There are various open source machine learning libraries you can use to build and train machine learning models on data in Azure Monitor Logs, including [Scikit Learn](https://scikit-learn.org/), [PyTorch](https://pytorch.org/), [Tensorflow](https://www.tensorflow.org/), [Spark MLlib](https://spark.apache.org/docs/latest/ml-guide.html), [Azure Machine Learning SDK](/python/api/overview/azure/ml/?view=azure-ml-py), and [SynapseML](https://github.com/microsoft/SynapseML).|[Train and test a machine model on historical data in a Log Analytics workspace](../logs/jupyter-notebook-ml-azure-monitor-logs.md#train-and-test-regression-models-on-historical-data)|-  [Train machine learning models with Apache Spark in Azure Synapse](/azure/synapse-analytics/spark/apache-spark-machine-learning-training#apache-sparkml-and-mllib)<br>-  [Train a model in Python with automated machine learning in Azure Synapse](/azure/synapse-analytics/spark/apache-spark-azure-machine-learning-tutorial)|
|**Deploy and score machine learning models**|Scoring is the process of applying a machine learning model on new data to get predictions. Scoring usually needs to be done at scale with minimal latency, processing large sets of new records.|Query new data in Azure Monitor Logs Use [Azure Monitor Query client library](/python/api/overview/azure/monitor-query-readme).<br>[Score new data based on values in a Log Analytics workspace](../logs/jupyter-notebook-ml-azure-monitor-logs.md#score-new-data-using-the-trained-model-and-identify-anomalies).|-  [Score machine learning models with PREDICT in serverless Apache Spark pools](/azure/synapse-analytics/machine-learning/tutorial-score-model-predict-spark-pool)<br>-  [Deploy machine learning models to Azure](/azure/machine-learning/v1/how-to-deploy-and-where?tabs=azcli)|
|**Get insights from scored data on schedule**| |To run your notebook on schedule:<br> 1. Run a notebook as a step in an Azure Machine Learning pipeline using [NotebookRunnerStep](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/machine-learning-pipelines/intro-to-pipelines/aml-pipelines-with-notebook-runner-step.ipynb).<br>2. [Schedule your machine learning pipeline](/azure/machine-learning/how-to-schedule-pipeline-job?tabs=cliv2).|[Schedule your machine learning pipeline](/azure/machine-learning/how-to-schedule-pipeline-job?tabs=cliv2).|
 
#### Convert Azure Monitor Logs data to different formats

Azure Monitor Logs stores data in JSON format. Depending on the tools or libraries you use and the way implement your machine learning pipeline, you might need to convert data formats as part of your pipeline. 

For example:

- [Scikit Learn](https://scikit-learn.org/) uses Pandas DataFrames. 
- [Apache Spark in Azure Synapse Analytics](/azure/synapse-analytics/spark/apache-spark-machine-learning-training#apache-sparkml-and-mllib) uses Spark DataFrames 
- [Azure Machine Learning](/azure/machine-learning/v1/how-to-create-register-datasets) uses Azure Machine Learning datasets and other formats. 

Here are some of the available conversion methods:

- [Create an Azure Machine Learning dataset from a Pandas DataFrame](/azure/machine-learning/v1/how-to-create-register-datasets#create-a-dataset-from-pandas-dataframe)  
- [Convert JSON to Spark DataFrame](https://sparkbyexamples.com/pyspark/different-ways-to-create-dataframe-in-pyspark/#from-json) 
- [Convert JSON to Azure Machine Learning dataset](/python/api/azureml-core/azureml.data.dataset_factory.tabulardatasetfactory?view=azure-ml-py#azureml-data-dataset-factory-tabulardatasetfactory-from-json-lines-files) 


## Next steps

Learn more about:

- [Azure Monitor Logs](../logs/data-platform-logs.md).
- [Azure Monitor Insights and curated visualizations](../insights/insights-overview.md).
