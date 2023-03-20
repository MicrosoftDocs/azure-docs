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

[Artificial Intelligence for IT Operations (AIOps)](https://www.gartner.com/information-technology/glossary/aiops-artificial-intelligence-operations) offers powerful methods of processing and automatically acting on data you collect from applications, services, and IT resources into Azure Monitor using machine learning. Azure Monitor offers a number of features with built-in machine learning capabilities that provide insights and automate data-driven tasks, such as predicting capacity usage and autoscaling, identifying and analyzing application performance issues, and detecting anomalous behaviors in virtual machines, containers, and other resources. These features let you take advantage of machine learning to gain insights and boost your IT monitoring and operations without further investment.    

You can also run data science processes on top of data in Azure Monitor Logs to introduce other machine learning algorithms and customize Azure Monitor's analysis and response capabilities to address your business goals.    

This article describes Azure Monitor's built-in AIOps capabilities and provides some examples of how you can create and apply customized machine learning models on top of data in Azure Monitor Logs. 

## Built-in Azure Monitor AIOps capabilities 

|Monitoring scenario|AIOps capability|Description| 
|-|-|-|
|Log monitoring| [Kusto Query Language (KQL) time series analysis and machine learning functions](../logs/kql-machine-learning-azure-monitor.md) | Easy-to-use tools for generating time series data, detecting anomalies, forecasting, and performing root cause analysis directly in Azure Monitor Logs without requiring in-depth knowledge of data science and programming languages. 
|Application performance monitoring|[Application Map Intelligent view](../app/app-map.md) and [Smart detection](../alerts/proactive-diagnostics.md)| Automatically maps dependencies between services and identifies potential root causes of application performance issues.|
|Metric alerts|[Dynamic thresholds for metric alerting](../alerts/alerts-dynamic-thresholds.md)| Learns metrics patterns, automatically set alert thresholds based on historical data, and identify anomalies that could indicate service issues.|
|Virtual machine scale sets|[Predictive autoscale](../autoscale/autoscale-predictive.md)|Forecasts the overall CPU requirements of a virtual machine scale set, based on historical CPU usage patterns, and automatically scales out to meet these needs.|

## Use machine learning in Azure Monitor Logs

[Azure Monitor Logs](../logs/data-platform-logs.md) is based on Azure Data Explorer, a high-performance, big data analytics platform, which makes it easy to analyze large volumes of data you collect into a [Log Analytics workspace](../logs/log-analytics-workspace-overview.md) in near real-time.  

There are two ways to use machine learning in Azure Monitor Logs:

- Running the built-in machine learning capabilities of the Kusto Query Language to detect and analyze anomalies directly inside a Log Analytics workspace.
- Training and running machine learning anomaly detection models on data in a Log Analytics workspace by integrating an external tool or service.   

## Built-in machine learning and write your own machine learning in Azure Monitor Logs

Use [KQL's time series analysis and machine learning functions, operators, and plug-ins](../logs/kql-machine-learning-azure-monitor.md) to gain insights about service health, usage, capacity and other trends and to generate forecasts and detect anomalies. 

Using the native machine learning capabilities of KQL to process and analyze log data in Azure Monitor Logs gives you the benefits of:
 
- The power of the Azure Data Explorer platform, running at high scales in a distributed manner, for optimal performance. 
- Multiple configurable parameters for flexibility and tweaking. 
- Savings on the costs and overhead of using tools and services outside of Azure Monitor. In other words, you don't need to copy data into memory objects or export data outside of Azure Monitor.

### Limitations of KQL machine learning capabilities

- Limited set of algorithms, function customization, and tweak settings. 
- Azure portal or Query API log query limits depending on whether you're working in the portal or using the API, for example, from notebooks. 


You can write your own machine learning by: 
- Implementing custom machine learning models 
- Built-in templated queries - The [MSTICPY Python library](https://msticpy.readthedocs.io/latest/getting_started/msticpyconfig.html) features built-in templated queries that invoke native KQL functions. 


### When to Use
- To analyze log data for various insights such as monitoring service health, usage, or other trends, and anomalies detection using time series on selected parameters. 
- To gain greater flexibility and deeper insights than out-of-the-box insights tools without running custom algorithms or exporting data. 
- If you don't need to be an expert in data science or programming languages. 



### Custom ML Models 

If the richness of KQL native functions doesn't meet your business needs, you can implement custom ML models. For example, if you need to perform hunting for security attacks when data requires more sophisticated models than linear or other regressions supported by KQL, or if you need to correlate AzMon logs with data from other sources. 

### Tasks to Perform 

You may need to perform the following tasks (all or a subset): 
- Data Exploration / Advanced Analytics / Visualization 
- Modeling/ML Training 
- Model Deployment and Scoring 
- Getting Insights from Scored Data 

### Data Exploration 

Azure Monitor offers a set of different tools to explore data and prepare it for analytics and/or machine learning. One of the quickest ways to get started with data exploration is using Log Analytics Tool or using notebooks running

||KQL operators and functions||Custom models||
|-|-|-|-|-|
||Inside Azure Monitor Logs|Run full ML pipeline “On top AzMon”|Run full ML pipeline outside AzMon|Hybrid mode: Data Exploration “On top AzMon”, Train outside, score “On top AzMon”|
|Machine learning libraries ||All ML libraries<br>Examples:<br>- ML open-source frameworks like Scikit-Learn<br>- PyTorch<br>- Tensorflow<br>- SparkML<br>- Azure ML SDK<br>- MMLSpark (Microsoft ML library for Apache Spark)
|||
|Log export needed?|No|No|Yes|Training – Yes, Scoring - No |
|Other Azure services|Optional|Optional (Azure Synapse, Azure ML can be used)|usually ADLS, Azure Synapse used |Training – usually ADLS, Azure Synapse used<br>Scoring – optional (ADLS, Azure Synapse can be used)|
|Pros|Optimal performance, cost savings, no custom code needed|Minimum latency, cost savings|No query limits|Minimum latency for scoring<br>Cost savings for scoring |
|Cons|Query API log query limits, which are possible to overcome by splitting query execution into chunks|Query API log query limits, which are possible to overcome by splitting query execution into chunks|Cost of export & storage, increased latency due to export|Cost of export & training (for training) |
|When to use|For small-medium volumes of data (up to several GB/few millions of records), when built-in functions suit your needs|For small-medium volumes of data (up to several GB / few millions of records)|Large volumes of data (for both training and scoring)|Large volumes of data for training small-medium volumes of data for scoring  |
## Next steps

- [Learn more about the Basic Logs and Analytics log plans](basic-logs-configure.md).
- [Use a search job to retrieve data from Basic Logs into Analytics Logs where it can be queries multiple times](search-jobs.md).
