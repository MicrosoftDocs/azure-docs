---
title: Azure Monitor FAQ | Microsoft Docs
description: Answers to frequently asked questions about Azure Monitor.
services: azure-monitor
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 12/12/2019

---


# Azure Monitor FAQ

This Microsoft FAQ is a list of commonly asked questions about Azure Monitor. If you have any additional questions about Log Analytics, go to the [discussion forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=opinsights) and post your questions. When a question is frequently asked, we add it to this article so that it can be found quickly and easily.

## Overview

### Q: What is Azure Monitor?
[Azure Monitor](overview.md) is a service in Azure that provides performance and availability monitoring for applications and services in Azure, other cloud environments, or on-premises. Azure Monitor collects data from multiple sources into a common data platform where it can be analyzed for trends and anomalies. Rich features in Azure Monitor assist you in quickly identifying and responding to critical situations that may affect your application.

### Q: What's the difference between Azure Monitor, Log Analytics, and Application Insights?
In September 2018, Microsoft combined Azure Monitor, Log Analytics, and Application Insights into a single service to provide powerful end-to-end monitoring of your applications and their components. Features in Log Analytics and Application Insights have not changed, although some features have been rebranded to Azure Monitor in order to better reflect their new scope. The log data engine and query language of Log Analytics is now referred to as Azure Monitor Logs. See [Azure Monitor terminology updates](terminology.md).

## What is the cost of Azure Monitor?
Features of Azure Monitor that are automatically enabled such as collection of metrics and activity logs are provided at no cost. There is a cost associated with other features such as log queries and alerting. See the [Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/) for detailed pricing information.


## Monitoring data

### Q: What data is collected by Azure Monitor? 
Azure Monitor collects data from a variety of sources into  Logs or Metrics. Each type of data has its own relative advantages, and each supports a particular set of features in Azure Monitor. There is a single metrics database for each Azure subscription, while you can create multiple Log Analytics workspaces to collect logs depending on your requirements. See [Azure Monitor data platform](platform/data-platform.md).

### Q: Where does Azure Monitor get its data?
Azure Monitor collects data from a variety of sources including logs and metrics from Azure platform and resources, custom application, and agents running on virtual machines. Other services such as Azure Security Center and Network Watcher collect data into a Log Analytics workspace so it can be analyzed with Azure Monitor data. You can also write custom data to Azure Monitor using the REST API for logs or metrics. See [Sources of monitoring data for Azure Monitor](platform/data-sources.md).

### How do I access data collected by Azure Monitor?
All log data in Azure Monitor is retrieved with a log query written in Kusto Query Language (KQL). In the Azure portal, you can write and run queries and interactively analyze data using Log Analytics. Analyze metrics in the Azure portal with the Metrics Explorer. See [Analyze log data in Azure Monitorlog-query/log-query-overview.md) and [Getting started with Azure Metrics Explorer](platform/metrics-getting-started.md).

### What's the difference between Azure Monitor Logs and Azure Data Explorer?
Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. Azure Monitor Logs is built on top of Azure Data Explorer and uses the same Kusto Query Language (KQL) with some minor differences. See [Azure Monitor log query language differences](log-query/data-explorer-difference.md).

## On-premises resources

### Q: Is there an on-premises version of Azure Monitor?
A: No. Azure Monitor is a scalable cloud service that processes and stores large amounts of data, although Azure Monitor can monitor resources that are on-premises and in other clouds.

### Can Azure Monitor monitor on-premises resources?
Yes, in addition to collecting monitoring data from Azure resources, Azure Monitor can collect data from virtual machines and applications in other clouds and on-premises. See [Sources of monitoring data for Azure Monitor](platform/data-sources.md).


## Solutions and insights

### Q: What is an insight in Azure Monitor?
Insights provide a customized monitoring experience for particular Azure services. They are based on the data platform and other features in Azure Monitor but may collect additional data and provide a unique experience in the Azure portal. See [Insights in Azure Monitor](insights/insights-overview.md).

### Q: What is a monitoring solution?
Monitoring solutions are packaged sets of logic for monitoring a particular application or service based on Azure Monitor features. They collect log data in Azure Monitor and provide log queries and views for their analysis using a common experience in the Azure portal. See [Monitoring solutions in Azure Monitor](insights/solutions.md).


## Onboarding

### Q: How do I enable Azure Monitor?
Azure Monitor is enabled the moment that you create a new Azure subscription, and [Activity log](platform/activity-logs-overview.md) and platform [metrics](platform/data-platform-metrics.md) are automatically collected. Create diagnostic settings to collect more detailed information about the operation of your Azure resources, and add [monitoring solutions](insights/solutions.md) and [insights](insights/insights-overview.md) to provide additional analysis on collected data for particular services.



## Next steps
* [Get started with Log Analytics](overview.md) to learn more about Log Analytics and get up and running in minutes.
