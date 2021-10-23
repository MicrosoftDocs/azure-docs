---
title: What is monitored by Azure Monitor
description: Reference of all services and other resources monitored by Azure Monitor.
ms.topic: conceptual
author: rboucher
ms.author: robb
ms.date: 10/15/2021

---

# What is monitored by Azure Monitor?

This article is a reference of the different applications and services that are monitored by Azure Monitor.

## Insights and curated visualizations

Some services have a curated monitoring experience. That is, Microsoft provides customized functionality meant to act as a starting point for monitoring those services. Those experiences collect and analyze a subset of logs and metrics and depending on the service, may also provide out-of-the-box alerting. They present this telemetry in a visual layout.

The visualizations vary in size and scale. Some are are considered part of Azure Monitor and follow the support and service level agreements for Azure.  They are supported in all Azure regions where Azure Monitor is available. Other curated visualizations provide less functionality and may have different agreements.  Some may be based solely on Azure Monitor Workbooks while others may have an extensive custom experience. 

Another type of visualization called "monitoring solutions" are no longer in active development.  The replacement technology is called [Azure Monitor Insights](/azure/azure-monitor/monitor-reference#insights). We suggest you use the insights and not deploy new instances of solutions. The list of 

The table below lists the available curated visualizations and more detailed information about them.  

|Name with docs link| State | [Azure Portal Link](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/more)| Description | 
|:--|:--|:--|:--|



## Third party integration

| Solution | Description |
|:---|:---|
| [ITSM](alerts/itsmc-overview.md) | The IT Service Management Connector (ITSMC) allows you to connect Azure and a supported IT Service Management (ITSM) product/service.  |


## Resources outside of Azure

Azure Monitor can collect data from resources outside of Azure using the methods listed in the following table.

| Resource | Method |
|:---|:---|
| Applications | Monitor web applications outside of Azure using Application Insights. See [What is Application Insights?](./app/app-insights-overview.md). |
| Virtual machines | Use agents to collect data from the guest operating system of virtual machines in other cloud environments or on-premises. See [Overview of Azure Monitor agents](agents/agents-overview.md). |
| REST API Client | Separate APIs are available to write data to Azure Monitor Logs and Metrics from any REST API client. See [Send log data to Azure Monitor with the HTTP Data Collector API](logs/data-collector-api.md) for Logs and [Send custom metrics for an Azure resource to the Azure Monitor metric store by using a REST API](essentials/metrics-store-custom-rest-api.md) for Metrics. |

## Next steps

- Read more about the [Azure Monitor data platform which stores the logs and metrics collected by insights and solutions](data-platform.md).
- Complete a [tutorial on monitoring an Azure resource](essentials/tutorial-resource-logs.md).
- Complete a [tutorial on writing a log query to analyze data in Azure Monitor Logs](essentials/tutorial-resource-logs.md).
- Complete a [tutorial on creating a metrics chart to analyze data in Azure Monitor Metrics](essentials/tutorial-metrics-explorer.md).
 

