---
title: AIOps and machine learning in Azure Monitor Logs
description: Use machine learning to improve your ability to predict IT needs and identify and respond to anomalous patterns in log data. 
author: guywi-ms
ms.author: guywild
ms.reviewer: ilanawaitser
ms.topic: conceptual 
ms.date: 23/02/2023

#customer-intent: As a data scientist, I want to understand how to use machine learning to improve my ability to predict IT needs and identify and respond to anomalous patterns in log data.

---
# AIOps and machine learning in Azure Monitor 

[Artificial Intelligence for IT Operations (AIOps)](https://www.gartner.com/information-technology/glossary/aiops-artificial-intelligence-operations) offers powerful methods of processing and automatically acting on data you collect from applications, services, and IT resources into Azure Monitor Logs using machine learning. Azure Monitor provides a number of features with built-in machine learning capabilities that provide insights and automate data-driven tasks, such as predicting capacity usage and autoscaling, identifying and analyzing application performance issues, and detecting anomalous behaviors in virtual machines, containers, and other resources. These features let you take advantage of machine learning to gain insights and boost your IT monitoring and operations without further investment.    

You can also run data science processes on top of data in Azure Monitor Logs to introduce other machine learning algorithms and customize Azure Monitor's analysis and response capabilities to address your business goals.    

This article describes Azure Monitor's built-in AIOps capabilities and provides some examples of how you can create and apply customized machine learning models on top of data in Azure Monitor Logs. 

## Use the built-in AIOps and machine learning capabilities of Azure Monitor

|Monitoring scenario|AIOps capability|Description| 
|-|-|-|
|Log data | [Kusto Query Language (KQL) time series analysis and machine learning functions](../logs/kql-machine-learning-azure-monitor.md) | Azure Monitor Logs is based on Azure Data Explorer, a high-performance, big data analytics platform that makes it easy to analyze large volumes of data in near real-time. KQL offers time series analysis and machine learning functions, operators, and plug-ins for generating time series data, anomaly detection, forecasting, root cause analysis, and other capabilities. Use KQL to process and analyze your log data directly inside Azure Monitor. 
|Application monitoring|[Application Map Intelligent view](../app/app-map.md) and [Smart detection](../alerts/proactive-diagnostics.md)| Automatically maps dependencies between services and identifies potential root causes of application performance issues.|
|Metric alerts|[Dynamic thresholds for metric alerting](../alerts/alerts-dynamic-thresholds.md)| Learns metrics patterns, automatically set alert thresholds based on historical data, and identify anomalies that could indicate service issues.|
| Virtual machine scale sets|[Predictive autoscale](../autoscale/autoscale-predictive.md)|Forecasts the overall CPU requirements of a virtual machine scale set, based on historical CPU usage patterns, and automatically scales out to meet these needs.|

> [!NOTE]
> These options use native KQL functions that run inside Azure Monitor. In other words, you don't need to copy data into memory objects or export it outside of Azure Monitor. 

### When to Use
- To analyze log data for various insights such as monitoring service health, usage, or other trends, and anomalies detection using time series on selected parameters. 
- To gain greater flexibility and deeper insights than out-of-the-box insights tools without running custom algorithms or exporting data. 
- If you don't need to be an expert in data science or programming languages. 

### Benefits
- The power of the ADX platform, running at high scales in a distributed manner near the data with the most optimal performance. 
- Flexible functions with multiple configurable parameters. 
- Savings on the costs and overhead of using tools and services outside of Azure Monitor. 

### Limitations
- Limited set of algorithms, function customization, and tweak settings. 
- Azure portal or Query API log query limits depending on whether you're working in the portal or using the API, for example, from notebooks. 

## Bring your own machine learning into Azure Monitor Logs

You can write your own machine learning by: 
- Running built-in Kusto Query Language (KQL) plugins and functions (detect anomalies, identify outliers, detect patterns, and time series forecasting)
- Implementing custom machine learning models 

- Built-in templated queries - The [MSTICPY Python library](https://msticpy.readthedocs.io/latest/getting_started/msticpyconfig.html) features built-in templated queries that invoke native KQL functions. 


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

## Next steps

- [Learn more about the Basic Logs and Analytics log plans](basic-logs-configure.md).
- [Use a search job to retrieve data from Basic Logs into Analytics Logs where it can be queries multiple times](search-jobs.md).
