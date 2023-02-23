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
# AIOps and machine learning in Azure Monitor Logs 

Machine learning offers powerful methods of processing, analyzing, and acting on data you collect from applications, services, and IT resources into Azure Monitor Logs. 

Machine learning capabilities help enhance and automate data-driven tasks, such as security threat detection, predicting device failures and capacity usage, and detecting anomalous behaviors in virtual machines, containers, and other resources. 

This article describes Azure Monitor's built-in machine learning capabilities and how you can  create and run customized machine learning models. 

## Use built-in AIOps and machine learning capabilities of Azure Monitor Logs

- [Kusto Query Language (KQL) time series analysis and machine learning functions](../logs/kql-machine-learning-azure-monitor.md) - Azure Monitor Logs is based on Azure Data Explorer, a high-performance, big data analytics platform that makes it easy to analyze large volumes of data in near real-time. KQL offers time series analysis and machine learning functions, operators, and plug-ins for generating time series data, anomaly detection, forecasting, root cause analysis, and other capabilities. Use KQL to process and analyze your log data directly inside Azure Monitor. 

- Built-in templated queries - Another option is to use built-in templated queries, which are part of the MSTICPY Python library. The queries invoke native KQL functions. 

> [!NOTE]
> Both options above use native KQL functions that run inside Azure Monitor. In other words, you don't need to copy data into memory objects or export it outside of Azure Monitor. 

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

## Write your own machine learning

You can write your own machine learning by: 
- Running built-in Kusto Query Language (KQL) plugins and functions (detect anomalies, identify outliers, detect patterns, and time series forecasting)
- Implementing custom machine learning models 

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
