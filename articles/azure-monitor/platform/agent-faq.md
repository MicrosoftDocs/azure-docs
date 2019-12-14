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


## What's the difference between the Azure Monitor agents?

VMs need agents - Log Analytics and Diagnostic Extension.  Samre for ASC.


## Q: How can I confirm that an agent is able to communicate with Log Analytics?

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
