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
In September 2018, Microsoft combined Azure Monitor, Log Analytics, and Application Insights into a single service to provide powerful end-to-end monitoring of your applications and their components. Features in Log Analytics and Application Insights have not changed, although some features have been rebranded to Azure Monitor in order to better reflect their new scope. The log data engine and query language of Log Analytics is now referred to as Azure Monitor Logs. See [Azure Monitor terminology updates](terminology.md).

### What is the cost of Azure Monitor?
Features of Azure Monitor that are automatically enabled such as collection of metrics and activity logs are provided at no cost. There is a cost associated with other features such as log queries and alerting. See the [Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/) for detailed pricing information.


## Monitoring data

### What data is collected by Azure Monitor? 
Azure Monitor collects data from a variety of sources into  Logs or Metrics. Each type of data has its own relative advantages, and each supports a particular set of features in Azure Monitor. There is a single metrics database for each Azure subscription, while you can create multiple Log Analytics workspaces to collect logs depending on your requirements. See [Azure Monitor data platform](platform/data-platform.md).

### Where does Azure Monitor get its data?
Azure Monitor collects data from a variety of sources including logs and metrics from Azure platform and resources, custom application, and agents running on virtual machines. Other services such as Azure Security Center and Network Watcher collect data into a Log Analytics workspace so it can be analyzed with Azure Monitor data. You can also write custom data to Azure Monitor using the REST API for logs or metrics. See [Sources of monitoring data for Azure Monitor](platform/data-sources.md).

### How do I access data collected by Azure Monitor?
All log data in Azure Monitor is retrieved with a log query written in Kusto Query Language (KQL). In the Azure portal, you can write and run queries and interactively analyze data using Log Analytics. Analyze metrics in the Azure portal with the Metrics Explorer. See [Analyze log data in Azure Monitorlog-query/log-query-overview.md) and [Getting started with Azure Metrics Explorer](platform/metrics-getting-started.md).

### What's the difference between Azure Monitor Logs and Azure Data Explorer?
Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. Azure Monitor Logs is built on top of Azure Data Explorer and uses the same Kusto Query Language (KQL) with some minor differences. See [Azure Monitor log query language differences](log-query/data-explorer-difference.md).

## On-premises resources

### Is there an on-premises version of Azure Monitor?
A: No. Azure Monitor is a scalable cloud service that processes and stores large amounts of data, although Azure Monitor can monitor resources that are on-premises and in other clouds.

### Can Azure Monitor monitor on-premises resources?
Yes, in addition to collecting monitoring data from Azure resources, Azure Monitor can collect data from virtual machines and applications in other clouds and on-premises. See [Sources of monitoring data for Azure Monitor](platform/data-sources.md).

### Q: How do I add Log Analytics to System Center Operations Manager?

A:  Updating to the latest update rollup and importing management packs enables you to connect Operations Manager to Log Analytics.

>[!NOTE]
>The Operations Manager connection to Log Analytics is only available for System Center Operations Manager 2012 SP1 and later.

## Solutions and insights

### What is an insight in Azure Monitor?
Insights provide a customized monitoring experience for particular Azure services. They are based on the data platform and other features in Azure Monitor but may collect additional data and provide a unique experience in the Azure portal. See [Insights in Azure Monitor](insights/insights-overview.md).

### What is a monitoring solution?
Monitoring solutions are packaged sets of logic for monitoring a particular application or service based on Azure Monitor features. They collect log data in Azure Monitor and provide log queries and views for their analysis using a common experience in the Azure portal. See [Monitoring solutions in Azure Monitor](insights/solutions.md).

### How can I see solutions in Azure portal? 

From the **Monitor** menu in Azure portal, click **...More** in the **Insights** section. The last used workspace is selected, but you can select any other workspace. 

## Onboarding

### How do I enable Azure Monitor?
Azure Monitor is enabled the moment that you create a new Azure subscription, and [Activity log](platform/activity-logs-overview.md) and platform [metrics](platform/data-platform-metrics.md) are automatically collected. Create [diagnostic settings](platform/diagnostic-settings.md) to collect more detailed information about the operation of your Azure resources, and add [monitoring solutions](insights/solutions.md) and [insights](insights/insights-overview.md) to provide additional analysis on collected data for particular services.


## Agents

### Does Azure Monitor require agents?

VMs need agents - Log Analytics and Diagnostic Extension.  Samre for ASC.


### Q: How can I confirm that an agent is able to communicate with Log Analytics?

A: To ensure that the agent can communicate with the Log Analytics workspace, go to: Control Panel, Security & Settings, **Microsoft Monitoring Agent**.

Under the **Azure Log Analytics (OMS)** tab, look for a green check mark. A green check mark icon confirms that the agent is able to communicate with the Azure service.

A yellow warning icon means the agent is having issues communication with Log Analytics. One common reason is the Microsoft Monitoring Agent service has stopped. Use service control manager to restart the service.

### Q: How do I stop an agent from communicating with Log Analytics?

A: In System Center Operations Manager, remove the computer from the Log Analytics managed computers list. Operations Manager updates the configuration of the agent to no longer report to Log Analytics. For agents connected to Log Analytics directly, you can stop them from communicating through: Control Panel, Security & Settings, **Microsoft Monitoring Agent**.
Under **Azure Log Analytics (OMS)**, remove all workspaces listed.

### Q. How much data can I send through the agent to Log Analytics? Is there a maximum amount of data per customer?
A. There is no limit on the amount of data that is uploaded, it is based on the pricing option you select - Capacity Reservation or Pay-As-You-Go. A Log Analytics workspace is designed to automatically scale up to handle the volume coming from a customer – even if it is terabytes per day. For further information, see [pricing details](https://azure.microsoft.com/pricing/details/monitor/).

The Log Analytics agent was designed to ensure it has a small footprint. The data volume varies based on the solutions you enable. You can find detailed information on the data volume and see the breakdown by solution in the [Usage](../../azure-monitor/platform/data-usage.md) page.

For more information, you can read a [customer blog](https://thoughtsonopsmgr.blogspot.com/2015/09/one-small-footprint-for-server-one.html) showing their results after evaluating the resource utilization (footprint) of the Log Analytics agent.

### Q. How much network bandwidth is used by the Microsoft Management Agent (MMA) when sending data to Log Analytics?

A. Bandwidth is a function on the amount of data sent. Data is compressed as it is sent over the network.

### Q. How much data is sent per agent?

A. The amount of data sent per agent depends on:

* The solutions you have enabled
* The number of logs and performance counters being collected
* The volume of data in the logs

Overall usage is shown on the [Usage](../../azure-monitor/platform/data-usage.md) page.

For computers that are able to run the WireData agent, use the following query to see how much data is being sent:

```
Type=WireData (ProcessName="C:\\Program Files\\Microsoft Monitoring Agent\\Agent\\MonitoringHost.exe") (Direction=Outbound) | measure Sum(TotalBytes) by Computer
```

### Q. How can I be notified when data collection stops?

A: Use the steps described in [create a new log alert](../../azure-monitor/platform/alerts-metric.md) to be notified when data collection stops.

When creating the alert for when data collection stops, set the:

- **Define alert condition** specify your Log Analytics workspace as the resource target.
- **Alert criteria** specify the following:
   - **Signal Name** select **Custom log search**.
   - **Search query** to `Heartbeat | summarize LastCall = max(TimeGenerated) by Computer | where LastCall < ago(15m)`
   - **Alert logic** is **Based on** *number of results* and **Condition** is *Greater than* a **Threshold** of *0*
   - **Time period** of *30* minutes and **Alert frequency** to every *10* minutes
- **Define alert details** specify the following:
   - **Name** to *Data collection stopped*
   - **Severity** to *Warning*

Specify an existing or create a new [Action Group](../../azure-monitor/platform/action-groups.md) so that when the log alert matches criteria, you are notified if you have a heartbeat missing for more than 15 minutes.

## Infrastructure

### Q. Can you move an existing Log Analytics workspace to another Log Analytics workspace/Azure subscription?

See [Move a Log Analytics workspace to different subscription or resource group](/platform/move-workspace.md) for details on moving a workspace between resource groups or subscriptions. You cannot move a workspace to a different region.

### Q. What IP addresses does the Log Analytics service use? How do I ensure that my firewall only allows traffic to the Log Analytics service?

A. The Log Analytics service is built on top of Azure. Log Analytics IP addresses are in the [Microsoft Azure Datacenter IP Ranges](https://www.microsoft.com/download/details.aspx?id=41653).

As service deployments are made, the actual IP addresses of the Log Analytics service change. The DNS names to allow through your firewall are documented in [network requirements](../../azure-monitor/platform/log-analytics-agent.md#network-firewall-requirements).

### Q. I use ExpressRoute for connecting to Azure. Does my Log Analytics traffic use my ExpressRoute connection?

A. The different types of ExpressRoute traffic are described in the [ExpressRoute documentation](../../expressroute/expressroute-faqs.md#supported-services).

Traffic to Log Analytics uses the public-peering ExpressRoute circuit.

## Other FAQs

- [Application Insights](app/troubleshoot-faq.md)
- [Azure Monitor for Containers](insights/container-insights-faq.md)
- [Azure Monitor for VMs](insights/vminsights-faq.md)
