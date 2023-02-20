---
title: Bring your own machine learning/advanced analytics to analyze log data in Azure Monitor
description: Plan the phases of your migration from Splunk to Azure Monitor Logs and get started importing, collecting, and analyzing log data. 
author: guywi-ms
ms.author: guywild
ms.reviewer: ilanawaitser
ms.topic: conceptual 
ms.date: 25/01/2023

#customer-intent: As a data scientist, I want to understand how to use train, tune, and run machine learning models on data in Azure Monitor Logs so that I can identify and respond to anomalous patterns in log data.

---
# Bring your own machine learning/advanced analytics to analyze log data in Azure Monitor 

Machine learning offers powerful methods of processing, analyzing, and acting on data in Azure Monitor Logs. 

Machine learning can be used for various data-driven tasks, including detection of security threats, monitoring resources for predicting device failures, predicting capacity usage, detecting anomalous behaviors in virtual machines, containers, and other resources. 

Azure Monitor provides multiple built-in features using machine learning capabilities as well as tools to write and run your own machine learning. 

## Write your own machine learning

You can write your own machine learning by: 
- Running built-in Kusto Query Language (KQL) plugins and functions (detect anomalies, identify outliers, detect patterns, and time series forecasting)
- Implementing custom machine learning models 

## Kusto Query Language (KQL) time series analysis and machine learning functions

Azure Monitor Logs is based on Azure Data Explorer, a high-performance, big data analytics platform that makes it easy to analyze large volumes of data in near real-time. KQL offers time series analysis and machine learning functions, operators, and plug-ins for generating time series data, anomaly detection, forecasting, root cause analysis, and other capabilities. Use KQL to process and analyze your log data directly inside Azure Monitor. 

## Built-in templated queries 

Another option is to use built-in templated queries, which are part of the MSTICPY Python library. The queries invoke native KQL functions. 

Note: Both options above use native KQL functions which run inside AzMon, i.e., data is not copied into memory objects nor exported outside of AzMon. 

## When to Use
- To analyze log data for various insights such as monitoring service health, usage, or other trends, and anomalies detection using time series on selected parameters. 
- To gain greater flexibility and deeper insights than out-of-the-box insights tools without running custom algorithms or exporting data. 
- If you do not need to be an expert in data science or programming languages. 

## Benefits
- The power of the ADX platform, running at high scales in a distributed manner near the data with the most optimal performance. 
- Flexible functions with multiple configurable parameters. 
- Savings on the costs and overhead of using tools and services outside of Azure Monitor. 

## Limitations
- Limited set of algorithms, function customization, and tweak settings. 
- Azure portal or Query API log query limits depending on whether you're working in the portal or using the API, for example, from notebooks. 

## Custom ML Models 

If the richness of KQL native functions does not meet your business needs, you can implement custom ML models. For example, if you need to perform hunting for security attacks when data requires more sophisticated models than linear or other regressions supported by KQL, or if you need to correlate AzMon logs with data from other sources. 

## Tasks to Perform 

You may need to perform the following tasks (all or a subset): 
- Data Exploration / Advanced Analytics / Visualization 
- Modeling/ML Training 
- Model Deployment and Scoring 
- Getting Insights from Scored Data 

## Data Exploration 

Azure Monitor offers a set of different tools to explore data and prepare it for analytics and/or machine learning. One of the quickest ways to get started with data exploration is using Log Analytics Tool or using notebooks running
