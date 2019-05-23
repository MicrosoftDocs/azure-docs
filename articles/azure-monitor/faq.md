---
title: Azure Monitor FAQ | Microsoft Docs
description: Answers to frequently asked questions about Azure Monitor.
services: azure-monitor
documentationcenter: ''
author: bwren
manager: carmonm
editor: ''
ms.service: azure-monitor
ms.workload: na
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 05/19/2019
ms.author: bwren
---

# Azure Monitor FAQ

This Microsoft FAQ is a list of commonly asked questions about Azure Monitor. If you have any additional questions about Log Analytics, go to the [discussion forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=opinsights) and post your questions. When a question is frequently asked, we add it to this article so that it can be found quickly and easily.

## Overview

### Q: What is Azure Monitor?
[Azure Monitor](overview.md) is a service in Azure that provides performance and availability monitoring for applications and services in Azure, in another cloud, or on-premises. Azure Monitor collects data from multiple sources into a common data platform where it can be analyzed for trends and anomalies. Rich features in Azure Monitor assist you in quickly identifying and responding to critical situations that may affect your application.

### Q: What's the difference between Azure Monitor, Log Analytics, and Application Insights?
In September 2018, Microsoft combined Azure Monitor, Log Analytics, and Application Insights into a single service to provide powerful end-to-end monitoring of your applications and their components. Features in Log Analytics and Application Insights have not changed, although some features have been rebranded to Azure Monitor in order to better reflect their new scope. The log data engine and query language of Log Analytics is now referred to as Azure Monitor Logs. See [Azure Monitor terminology updates](terminology.md).

## What is the cost of Azure Monitor?
See the [Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/) for detailed pricing information.


## Monitoring data

### Q: What data is collected by Azure Monitor? 
All data collected by Azure Monitor is stored in Logs or Metrics. Each has its own relative advantages, and each supports a particular set of features in Azure Monitor. There is a single Metrics Database for each Azure Subscription, while you can create multiple Log Analytics workspace depending on your requirements. See [Azure Monitor data platform](platform/data-platform.md).

### Q: Where does Azure Monitor get its data?
Azure Monitor collects data from a variety of sources including logs and metrics from Azure platform and resources, custom application, and agents running on virtual machines. Other services such as Azure Security Center and Network Watcher collect data into a Log Analytics workspace so it can be analyzed with Azure Monitor data. You can also write custom data to Azure Monitor using the REST API for logs or metrics. See [Sources of monitoring data for Azure Monitor](platform/data-sources.md).

### How do I access data collected by Azure Monitor?
All log data in Azure Monitor is retrieved with a log query written in Kusto Query Language (KQL). In the Azure portal, you can write and run queries and interactively analyze data using Log Analytics. Analyze metrics in the Azure portal with the Metrics Explorer. See [Analyze log data in Azure Monitorlog-query/log-query-overview.md) and [Getting started with Azure Metrics Explorer](metrics-getting-started.md).

### What's the difference between Azure Monitor Logs and Azure Data Explorer?
Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. Azure Monitor Logs is built on top of Azure Data Explorer and uses the same Kusto Query Language (KQL) with some minor differences. See [Azure Monitor log query language differences](log-query/data-explorer-difference.md).

## On-premises resources

### Q: Is there an on-premises version of Azure Monitor?
A: No. Azure Monitor is a scalable cloud service that processes and stores large amounts of data, although Azure Monitor can monitor resources that are on-premises and in other clouds.

### Can Azure Monitor monitor on-premises resources?
Yes, in addition to collecting monitoring data from Azure resources, Azure Monitor can collect data from virtual machines and applications in other clouds and on-premises. See [Sources of monitoring data for Azure Monitor](platform/data-sources.md).

### What's the difference between Azure Monitor and System Center Operations Manager?


## Solutions and insights

### Q: What is an insight in Azure Monitor?
Insights provide a customized monitoring experience for particular Azure services. They are based on the data platform and other features in Azure Monitor but may collect additional data and provide a unique experience in the Azure portal. See [Insights in Azure Monitor](insights/insights-overview.md).

### Q: What is a monitoring solution?
Monitoring solutions are packaged sets of logic for monitoring a particular application or service based on Azure Monitor features. They collect log data in Azure Monitor and provide log queries and views for their analysis using a common experience in the Azure portal. See [Monitoring solutions in Azure Monitor](insights/solutions.md).


## Onboarding

### Q: How do I enable Azure Monitor?
Azure Monitor is enabled the moment that you create a new Azure subscription. Configure features and add [monitoring solutions](insights/solutions.md) and [insights](insights/insights-overview.md) to provide 

### Q: How do I being monitoring Azure resources?
[Activity log](activity-log-overview.md) events and [metrics](data-platform-metrics.md) are automatically collected for any Azure resources that you create. Create a [Log Analytics workspace](learn/quick-create-workspace.md) to start collecting [Diagnostic logs](diagnostic-logs-overview.md). Enable insights and monitoring solutions to provide packaged 

## Applications




## Configuration
### Q. Can I change the name of the table/blob container used to read from Azure Diagnostics (WAD)?

A. No, it is not currently possible to read from arbitrary tables or containers in Azure storage.

### Q. What IP addresses does the Log Analytics service use? How do I ensure that my firewall only allows traffic to the Log Analytics service?

A. The Log Analytics service is built on top of Azure. Log Analytics IP addresses are in the [Microsoft Azure Datacenter IP Ranges](https://www.microsoft.com/download/details.aspx?id=41653).

As service deployments are made, the actual IP addresses of the Log Analytics service change. The DNS names to allow through your firewall are documented in [network requirements](platform/log-analytics-agent.md#network-firewall-requirements).

### Q. I use ExpressRoute for connecting to Azure. Does my Log Analytics traffic use my ExpressRoute connection?

A. The different types of ExpressRoute traffic are described in the [ExpressRoute documentation](../expressroute/expressroute-faqs.md#supported-services).

Traffic to Log Analytics uses the public-peering ExpressRoute circuit.

### Q. Is there a simple and easy way to move an existing Log Analytics workspace to another Log Analytics workspace/Azure subscription?

A. The `Move-AzResource` cmdlet lets you move a Log Analytics workspace, and also an Automation account from one Azure subscription to another. For more information, see [Move-AzResource](https://msdn.microsoft.com/library/mt652516.aspx).

This change can also be made in the Azure portal.

You can’t move data from one Log Analytics workspace to another, or change the region that Log Analytics data is stored in.

### Q: How do I add Log Analytics to System Center Operations Manager?

A:  Updating to the latest update rollup and importing management packs enables you to connect Operations Manager to Log Analytics.

>[!NOTE]
>The Operations Manager connection to Log Analytics is only available for System Center Operations Manager 2012 SP1 and later.

### Q: How can I confirm that an agent is able to communicate with Log Analytics?

A: To ensure that the agent can communicate with OMS, go to: Control Panel, Security & Settings, **Microsoft Monitoring Agent**.

Under the **Azure Log Analytics (OMS)** tab, look for a green check mark. A green check mark icon confirms that the agent is able to communicate with the Azure service.

A yellow warning icon means the agent is having issues communication with Log Analytics. One common reason is the Microsoft Monitoring Agent service has stopped. Use service control manager to restart the service.


## Agent data
### Q. How much data can I send through the agent to Log Analytics? Is there a maximum amount of data per customer?
A. The free plan sets a daily cap of 500 MB per workspace. The standard and premium plans have no limit on the amount of data that is uploaded. As a cloud service, Log Analytics is designed to automatically scale up to handle the volume coming from a customer – even if it is terabytes per day.

The Log Analytics agent was designed to ensure it has a small footprint. The data volume varies based on the solutions you enable. You can find detailed information on the data volume and see the breakdown by solution in the [Usage](platform/data-usage.md) page.

For more information, you can read a [customer blog](https://thoughtsonopsmgr.blogspot.com/2015/09/one-small-footprint-for-server-one.html) showing their results after evaluating the resource utilization (footprint) of the OMS agent.

### Q. How much network bandwidth is used by the Microsoft Management Agent (MMA) when sending data to Log Analytics?

A. Bandwidth is a function on the amount of data sent. Data is compressed as it is sent over the network.

### Q. How much data is sent per agent?

A. The amount of data sent per agent depends on:

* The solutions you have enabled
* The number of logs and performance counters being collected
* The volume of data in the logs

The free pricing tier is a good way to onboard several servers and gauge the typical data volume. Overall usage is shown on the [Usage](platform/data-usage.md) page.

For computers that are able to run the WireData agent, use the following query to see how much data is being sent:

```
Type=WireData (ProcessName="C:\\Program Files\\Microsoft Monitoring Agent\\Agent\\MonitoringHost.exe") (Direction=Outbound) | measure Sum(TotalBytes) by Computer
```




## Log Analytics workspaces

## Q. Why I can’t create workspaces in West Central US region?
A: This region is at temporary capacity limit. The limit is planned to be addressed in the first half of 2019.

### Q. Can I move an existing Log Analytics workspace to another Azure subscription?
The Move-AzResource cmdlet lets you move a Log Analytics workspace and also an Automation account from one Azure subscription to another. For more information, see [Move-AzResource](https://msdn.microsoft.com/library/mt652516.aspx). This change can also be made in the Azure portal.

You can’t move data from one Log Analytics workspace to another, or change the region that Log Analytics data is stored in.

## Agents



## Next steps
* [Get started with Log Analytics](overview.md) to learn more about Log Analytics and get up and running in minutes.
