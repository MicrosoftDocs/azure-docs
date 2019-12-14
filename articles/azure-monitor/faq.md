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


# Azure Monitor Frequently Asked Questions

## Overview

### What is Azure Monitor?
[Azure Monitor](overview.md) is a service in Azure that provides performance and availability monitoring for applications and services in Azure, other cloud environments, or on-premises. Azure Monitor collects data from multiple sources into a common data platform where it can be analyzed for trends and anomalies. Rich features in Azure Monitor assist you in quickly identifying and responding to critical situations that may affect your application.

### What's the difference between Azure Monitor, Log Analytics, and Application Insights?
In September 2018, Microsoft combined Azure Monitor, Log Analytics, and Application Insights into a single service to provide powerful end-to-end monitoring of your applications and the components they rely on. Features in Log Analytics and Application Insights have not changed, although some features have been rebranded to Azure Monitor in order to better reflect their new scope. The log data engine and query language of Log Analytics is now referred to as Azure Monitor Logs. See [Azure Monitor terminology updates](terminology.md).

### What is the cost of Azure Monitor?
Features of Azure Monitor that are automatically enabled such as collection of metrics and activity logs are provided at no cost. There is a cost associated with other features such as log queries and alerting. See the [Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/) for detailed pricing information.

### How do I enable Azure Monitor?
Azure Monitor is enabled the moment that you create a new Azure subscription, and [Activity log](platform/activity-logs-overview.md) and platform [metrics](platform/data-platform-metrics.md) are automatically collected. Create [diagnostic settings](platform/diagnostic-settings.md) to collect more detailed information about the operation of your Azure resources, and add [monitoring solutions](insights/solutions.md) and [insights](insights/insights-overview.md) to provide additional analysis on collected data for particular services.

### How do I access Azure Monitor?
Access all Azure Monitor features and data from the **Monitor** menu in the Azure portal. The **Monitoring** section of the menu for different Azure services provide access to the same tools with data filtered to a particular resource. Azure Monitor data is also accessible for a variety of scenarios using CLI, PowerShell, and a REST API.

### Does Azure Monitor require an agent?
An agent is only required to collect data from the operating system and workloads in virtual machines. See [Overview of the Azure Monitor agents](platform/agents-overview.md).

## Monitoring data

### Where does Azure Monitor get its data?
Azure Monitor collects data from a variety of sources including logs and metrics from Azure platform and resources, custom applications, and agents running on virtual machines. Other services such as Azure Security Center and Network Watcher collect data into a Log Analytics workspace so it can be analyzed with Azure Monitor data. You can also send custom data to Azure Monitor using the REST API for logs or metrics. See [Sources of monitoring data for Azure Monitor](platform/data-sources.md).

### What data is collected by Azure Monitor? 
Azure Monitor collects data from a variety of sources into [logs](platform/data-platform-logs.md) or [metrics](platform/data-platform-metrics.md). Each type of data has its own relative advantages, and each supports a particular set of features in Azure Monitor. There is a single metrics database for each Azure subscription, while you can create multiple Log Analytics workspaces to collect logs depending on your requirements. See [Azure Monitor data platform](platform/data-platform.md).

### How do I access data collected by Azure Monitor?
Insights and solutions provide a custom experience for working with data stored in Azure Monitor. You can work directly with log data using a log query written in Kusto Query Language (KQL). In the Azure portal, you can write and run queries and interactively analyze data using Log Analytics. Analyze metrics in the Azure portal with the Metrics Explorer. See [Analyze log data in Azure Monitor](log-query/log-query-overview.md) and [Getting started with Azure Metrics Explorer](platform/metrics-getting-started.md).

### What's the difference between Azure Monitor Logs and Azure Data Explorer?
Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. Azure Monitor Logs is built on top of Azure Data Explorer and uses the same Kusto Query Language (KQL) with some minor differences. See [Azure Monitor log query language differences](log-query/data-explorer-difference.md).

## Solutions and insights

### What is an insight in Azure Monitor?
Insights provide a customized monitoring experience for particular Azure services. They use the same metrics and logs as other features in Azure Monitor but may collect additional data and provide a unique experience in the Azure portal. See [Insights in Azure Monitor](insights/insights-overview.md).

### Where do I find insights?
To view insights in the Azure portal, see the **Insights** section of the **Monitor** menu or the **Monitoring** section of the service's menu.

### What is a solution in Azure Monitor?
Monitoring solutions are packaged sets of logic for monitoring a particular application or service based on Azure Monitor features. They collect log data in Azure Monitor and provide log queries and views for their analysis using a common experience in the Azure portal. See [Monitoring solutions in Azure Monitor](insights/solutions.md).

### Where do I find solutions?
To view solutions in the Azure portal, click **...More** in the **Insights** section of the **Monitor** menu. Click **Add** to add additional solutions to the workspace.


## On-premises resources

### Is there an on-premises version of Azure Monitor?
No. Azure Monitor is a scalable cloud service that processes and stores large amounts of data, although Azure Monitor can monitor resources that are on-premises and in other clouds.

### Can Azure Monitor monitor on-premises resources?
Yes, in addition to collecting monitoring data from Azure resources, Azure Monitor can collect data from virtual machines and applications in other clouds and on-premises. See [Sources of monitoring data for Azure Monitor](platform/data-sources.md).

### Does Azure Monitor integrate with System Center Operations Manager?
You can connect your existing System Center Operations Manager management group to Azure Monitor to collect data from agents into Azure Monitor Logs. This allows you to use log queries and solution to analyze data collected from agents. You can also configure existing SCOM agents to send data directly to Azure Monitor. See [Connect Operations Manager to Azure Monitor](platform/om-agents.md).


## Infrastructure

### Can you move an existing Log Analytics workspace to another Azure subscription?
See [Move a Log Analytics workspace to different subscription or resource group](/platform/move-workspace.md) for details on moving a workspace between resource groups or subscriptions. You cannot move a workspace to a different region.

### What IP addresses does Azure Monitor use?
See [IP addresses used by Application Insights and Log Analytics](app/ip-addresses.md) for a listing of the IP addresses and ports required for agents and other external resources to access Azure Monitor. 

As service deployments are made, the actual IP addresses of the Log Analytics service change. The DNS names to allow through your firewall are documented in [network requirements](../../azure-monitor/platform/log-analytics-agent.md#network-firewall-requirements).

### Does my Log Analytics traffic use my ExpressRoute connection?
The different types of ExpressRoute traffic are described in the [ExpressRoute documentation](../../expressroute/expressroute-faqs.md#supported-services). Traffic to Azure Monitor uses the Microsoft peering ExpressRoute circuit.

## Other FAQs

- [Application Insights](app/troubleshoot-faq.md)
- [Agents](platform/agents-faq.md)
- [Azure Monitor for Containers](insights/container-insights-faq.md)
- [Azure Monitor for VMs](insights/vminsights-faq.md)
