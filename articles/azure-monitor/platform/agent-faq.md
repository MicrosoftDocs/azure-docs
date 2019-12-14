---
title: Azure Monitor agents FAQ | Microsoft Docs
description: Answers to frequently asked questions about Azure Monitor agents.
services: azure-monitor
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 12/12/2019

---


# Azure Monitor agents frequently asked questions


## What does Azure Monitor use agents for?
Azure Monitor requires an agent on virtual machines in order to collect monitoring data from their operating system and workflows. The virtual machines can be located in Azure, another cloud environment, or on-premises.

## What's the difference between the Azure Monitor agents?
Azure Diagnostic extension is for Azure virtual machines and collects data to Azure Monitor Metrics, Azure Storage, and Azure Event Hubs. The Log Analytics agent is for virtual machines in Azure, another cloud environment, or on-premises and collects data to Azure Monitor Logs. The Dependency agent requires the Log Analytics agent and collected process details and dependencies. See [Overview of the Azure Monitor agents](agents-overview.md) for a more detailed comparison.

## How can I confirm that the Log Analytics agent is able to communicate with Azure Monitor?
From Control Panel on the agent computer, select **Security & Settings**, **Microsoft Monitoring Agent** . Under the **Azure Log Analytics (OMS)** tab, a green check mark icon confirms that the agent is able to communicate with Azure Monitor. A yellow warning icon means the agent is having issues. One common reason is the **Microsoft Monitoring Agent** service has stopped. Use service control manager to restart the service.

## How do I stop the Log Analytics agent from communicating with Azure Monitor?

For agents connected to Log Analytics directly, open the Control Panel and select **Security & Settings**, **Microsoft Monitoring Agent**. Under the **Azure Log Analytics (OMS)** tab, remove all workspaces listed. In System Center Operations Manager, remove the computer from the Log Analytics managed computers list. Operations Manager updates the configuration of the agent to no longer report to Log Analytics. 

### How much data is sent per agent?
The amount of data sent per agent depends on:

* The solutions you have enabled
* The number of logs and performance counters being collected
* The volume of data in the logs

See [Manage usage and costs with Azure Monitor Logs](../../azure-monitor/platform/manage-cost-storage.md) for details.

For computers that are able to run the WireData agent, use the following query to see how much data is being sent:

```Kusto
WireData
| where ProcessName == "C:\\Program Files\\Microsoft Monitoring Agent\\Agent\\MonitoringHost.exe" 
| where Direction == "Outbound" 
| summarize sum(TotalBytes) by Computer 
```

## How much network bandwidth is used by the Microsoft Management Agent (MMA) when sending data to Azure Monitor?
Bandwidth is a function on the amount of data sent. Data is compressed as it is sent over the network.


## How can I be notified when data collection from the Log Analytics agent stops?

Use the steps described in [create a new log alert](alerts-metric.md) to be notified when data collection stops. Use the following settings for the alert rule:

- **Define alert condition**: Specify your Log Analytics workspace as the resource target.
- **Alert criteria** 
   - **Signal Name**: *Custom log search*
   - **Search query**: `Heartbeat | summarize LastCall = max(TimeGenerated) by Computer | where LastCall < ago(15m)`
   - **Alert logic**: **Based on** *number of results*, **Condition** *Greater than*, **Threshold value** *0*
   - **Evaluated based on**: **Period (in minutes)** *30*, **Frequency (in minutes)** *10*
- **Define alert details** 
   - **Name**: *Data collection stopped*
   - **Severity**: *Warning*

Specify an existing or new [Action Group](action-groups.md) so that when the log alert matches criteria, you are notified if you have a heartbeat missing for more than 15 minutes.


## Other FAQs

- [Azure Monitor](../faq.md)
- [Application Insights](../app/troubleshoot-faq.md)
- [Azure Monitor for Containers](../insights/container-insights-faq.md)
- [Azure Monitor for VMs](../insights/vminsights-faq.md)
