---
title: Monitor Azure Virtual Machines
description: Start here to learn how to monitor Azure Virtual Machines and Virtual Machine Scale Sets.
ms.date: 03/27/2024
ms.custom: horz-monitor
ms.topic: conceptual
ms.service: virtual-machines

#customer intent: As a cloud administrator, I want to understand how to monitor Azure virtual machines so that I can ensure the health and performance of my virtual machines and applications.
---

# Monitor Azure Virtual Machines

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

This article provides an overview of how to monitor the health and performance of Azure virtual machines (VMs).

>[!NOTE]
>This article provides basic information to help you get started with monitoring Azure Virtual Machines. For a complete guide to monitoring your entire environment of Azure and hybrid virtual machines, see the [Monitor virtual machines deployment guide](/azure/azure-monitor/vm/monitor-virtual-machine).

## Overview: Monitor VM host and guest metrics and logs

You can collect metrics and logs from: 

- The **VM host** - This data relates to the Hyper-V session managing the guest operating systems, and includes information about CPU, network, and disk utilization.
- The **VM guest** - This data relates to the operating system and applications running inside the virtual machine.

Host-level data gives you an understanding of the VM's overall performance and load, while the guest-level data gives you visibility into the applications, components, and processes running on the machine and their performance and health. For example, if you’re troubleshooting a performance issue, you might start with host metrics to see which VM is under heavy load, and then use guest metrics to drill down into the details of the operating system and application performance.


### VM host data

VM host data is available without additional setup.      

| Scenario | Details | Data collection | Available data |Recommendations|
|-|-|-|-|-|
| **VM host metrics and logs** | Monitor the stability, health, and efficiency of the physical host on which the VM is running.<br>[Scale up or scale down](/azure/azure-monitor/autoscale/autoscale-overview) based on the load on your application.| Available by default without any additional setup. |<ul><li>[Host performance metrics](#azure-monitor-platform-metrics)</li><li>[Activity logs](#azure-activity-log)</li><li>[Boot diagnostics](#boot-diagnostics)</li></ul>|Enable [recommended alert rules](#recommended-alert-rules) to be notified when key host metrics deviate from their expected baseline values.|


### VM guest data 

VM guest data lets you analyze and troubleshoot the performance and operational efficiency of workloads running on your VMs. To monitor VM guest data, you need to install [Azure Monitor Agent](/azure/azure-monitor/agents/agents-overview) on the VM and set up a [data collection rule (DCR)](#data-collection-rules). The [VM Insights](#vm-insights) feature automatically installs Azure Monitor Agent on your VM and sets up a default data collection rule for quick and easy onboarding. 

| Scenario | Details | Data collection | Available data |Recommendations|
|-|-|-|-|-|
|**Basic monitoring: key performance indicators**|Identify issues related to operating system performance - including CPU and disk utilization - available memory, and network performance by collecting a predefined, basic set of key performance counters. |[Enable VM insights](/azure/azure-monitor/vm/vminsights-enable-overview)|[Predefined set of key guest performance counters](/azure/azure-monitor/vm/vminsights-performance)|<ul><li>Use as a starting point. </li><li>Enable recommended [Azure Monitor Baseline Alerts for VMs](https://azure.github.io/azure-monitor-baseline-alerts/services/Compute/virtualMachines/).</li><li>Add guest performance counters of interest and recommended operating system logs, as needed.</li></ul>|
|**Basic monitoring: application component mapping**|Map application components on a particular VM and across VMs, and discover the dependencies that exist between application components.<br><br>This information is important for troubleshooting, optimizing performance, and planning for changes or updates to the application infrastructure. |[Enable the Map feature of VM insights](/azure/azure-monitor/vm/vminsights-enable-overview)|[Dependencies between application components running on the VM](/azure/azure-monitor/vm/vminsights-maps)||
|**VM operating system metrics and logs (recommended)**|Monitor application performance and events, resource consumption by specific applications and processes, and operating system-level performance and events. <br><br>This data is important for troubleshooting application-specific issues, optimizing resource usage within VMs, and ensuring optimal performance for workloads running inside VMs.|Install [Azure Monitor Agent](/azure/azure-monitor/agents/agents-overview) on the VM and set up a [DCR](#data-collection-rules).|<ul><li>[Guest performance counters](/azure/azure-monitor/agents/data-collection-rule-azure-monitor-agent)</li><li>[Windows events](/azure/azure-monitor/agents/data-collection-rule-azure-monitor-agent)</li><li>[Syslog events](/azure/azure-monitor/agents/data-collection-syslog)</li></ul>|<ul><li>In Windows, collect application logs at the **Critical**, **Error**, and **Warning** levels.</li><li>In Linux, collect **LOG_SYSLOG** facility logs at the **LOG_WARNING** level.</li></ul>|
|**Advanced/custom VM guest data**|Monitoring of web servers, Linux appliances, and any type of data you want to collect from a VM. |Install [Azure Monitor Agent](/azure/azure-monitor/agents/agents-overview) on the VM and set up a [DCR](#data-collection-rules).|<ul><li>[IIS logs](/azure/azure-monitor/agents/data-collection-iis)</li><li>[SNMP traps](/azure/azure-monitor/agents/data-collection-snmp-data)</li><li>[Any data written to a text or JSON file](/azure/azure-monitor/agents/data-collection-text-log)</li></ul>||

## VM insights

VM insights monitors your Azure and hybrid virtual machines in a single interface. VM insights provides the following benefits for monitoring VMs in Azure Monitor:

- Simplified onboarding of the Azure Monitor agent and the Dependency agent, so that you can monitor a virtual machine (VM) guest operating system and workloads.
- Predefined data collection rules that collect the most common set of performance data.
- Predefined trending performance charts and workbooks, so that you can analyze core performance metrics from the virtual machine's guest operating system.
- The Dependency map, which displays processes that run on each virtual machine and the interconnected components with other machines and external sources.

:::image type="content" source="media/monitor-vm/vminsights-01.png" lightbox="media/monitor-vm/vminsights-01.png" alt-text="Screenshot of the VM insights 'Logical Disk Performance' view.":::

:::image type="content" source="media/monitor-vm/vminsights-02.png" lightbox="media/monitor-vm/vminsights-02.png" alt-text="Screenshot of the VM insights 'Map' view.":::

For a tutorial on enabling VM insights for a virtual machine, see [Enable monitoring with VM insights for Azure virtual machine](/azure/azure-monitor/vm/tutorial-monitor-vm-enable-insights). For general information about enabling insights and a variety of methods for onboarding VMs, see [Enable VM insights overview](/azure/azure-monitor/vm/vminsights-enable-overview).

If you enable VM insights, the Azure Monitor agent is installed and starts sending a predefined set of performance data to Azure Monitor Logs. You can create other data collection rules to collect events and other performance data. To learn how to install the Azure Monitor agent and create a data collection rule (DCR) that defines the data to collect, see [Tutorial: Collect guest logs and metrics from an Azure virtual machine](/azure/azure-monitor/vm/tutorial-monitor-vm-guest).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]
Platform metrics for Azure VMs include important *host metrics* such as CPU, network, and disk utilization. Host OS metrics relate to the Hyper-V session that's hosting a guest operating system (guest OS) session.

Metrics for the *guest OS* that runs in a VM must be collected through one or more agents, such as the [Azure Monitor agent](/azure/azure-monitor/agents/azure-monitor-agent-overview), that run on or as part of the guest OS. Guest OS metrics include performance counters that track guest CPU percentage or memory usage, both of which are frequently used for autoscaling or alerting. For more information, see [Guest OS and host OS metrics](/azure/azure-monitor/reference/supported-metrics/metrics-index#guest-os-and-host-os-metrics).

For detailed information about how the Azure Monitor agent collects VM monitoring data, see [Monitor virtual machines with Azure Monitor: Collect data](/azure/azure-monitor/vm/monitor-virtual-machine-data-collection).

For a list of available metrics for Virtual Machines, see [Virtual Machines monitoring data reference](monitor-vm-reference.md#metrics).


[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

## Data collection rules

[Data collection rules (DCRs)](/azure/azure-monitor/essentials/data-collection-rule-overview) define data collection from the Azure Monitor Agent and are stored in your Azure subscription. For VMs, DCRs define data such as events and performance counters to collect, and specify locations such as Log Analytics workspaces to send the data. A single VM can be associated with multiple DCRs, and a single DCR can be associated with multiple VMs.

### VM insights DCR

VM insights creates a DCR that collects common performance counters for the client operating system and sends them to the [InsightsMetrics](/azure/azure-monitor/reference/tables/insightsmetrics) table in the Log Analytics workspace. For a list of performance counters collected, see [How to query logs from VM insights](/azure/azure-monitor/vm/vminsights-log-query#performance-records). You can use this DCR with other VMs instead of creating a new DCR for each VM.

You can also optionally enable collection of processes and dependencies, which populates the following tables and enables the VM insights Map feature.

- [VMBoundPort](/azure/azure-monitor/reference/tables/vmboundport): Traffic for open server ports on the machine
- [VMComputer](/azure/azure-monitor/reference/tables/vmcomputer): Inventory data for the machine
- [VMConnection](/azure/azure-monitor/reference/tables/vmconnection): Traffic for inbound and outbound connections to and from the machine
- [VMProcess](/azure/azure-monitor/reference/tables/vmprocess): Processes running on the machine

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

To analyze log data that you collect from your VMs, you can use [log queries](/azure/azure-monitor/logs/get-started-queries) in [Log Analytics](/azure/azure-monitor/logs/log-analytics-tutorial). Several [built-in queries](/azure/azure-monitor/logs/queries) for VMs are available to use, or you can create your own queries. You can interactively work with the results of these queries, include them in a workbook to make them available to other users, or generate alerts based on their results.

To access built-in Kusto queries for your VM, select **Logs** in the **Monitoring** section of the left navigation on your VM's Azure portal page. On the **Logs** page, select the **Queries** tab, and then select the query to run.

:::image type="content" source="media/monitor-vm/log-analytics-query.png" lightbox="media/monitor-vm/log-analytics-query.png" alt-text="Screenshot of the 'Logs' pane displaying Log Analytics query results.":::

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

You can create a single multi-resource alert rule that applies to all VMs in a particular resource group or subscription within the same region. See [Create availability alert rule for Azure virtual machine (preview)](/azure/azure-monitor/vm/tutorial-monitor-vm-alert-availability) for a tutorial using the availability metric.

[!INCLUDE [horz-monitor-insights-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-recommended-alert-rules.md)]

Recommended alert rules for Azure VMs include the [VM availability metric](monitor-vm-reference.md#vm-availability-metric-preview), which alerts when a VM stops running.

For more information, see [Tutorial: Enable recommended alert rules for Azure virtual machine](/azure/azure-monitor/vm/tutorial-monitor-vm-alert-recommended). 

### Common alert rules

To see common VM log alert rules in the Azure portal, go to the **Queries** pane in Log Analytics. For **Resource type**, enter **Virtual machines**, and for **Type**, enter **Alerts**.

For a list and discussion of common Virtual Machines alert rules, see [Common alert rules](/azure/azure-monitor/vm/monitor-virtual-machine-alerts#common-alert-rules).

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Other VM monitoring options

Azure VMs has the following non-Azure Monitor monitoring options:

### Boot diagnostics

Boot diagnostics is a debugging feature for Azure VMs that allows you to diagnose VM boot failures by collecting serial log information and screenshots of a VM as it boots up. When you create a VM in the Azure portal, boot diagnostics is enabled by default. For more information, see [Azure boot diagnostics](boot-diagnostics.md).

### Troubleshoot performance issues

[The Performance Diagnostics tool](/troubleshoot/azure/virtual-machines/performance-diagnostics?toc=/azure/azure-monitor/toc.json) helps troubleshoot performance issues on Windows or Linux virtual machines by quickly diagnosing and providing insights on issues it currently finds on your machines. The tool doesn't analyze historical monitoring data you collect, but rather checks the current state of the machine for known issues, implementation of best practices, and complex problems that involve slow VM performance or high usage of CPU, disk space, or memory.

## Related content

- For a reference of the metrics, logs, and other important values for Virtual Machines, see [Virtual Machines monitoring data reference](monitor-vm-reference.md).
- For general details about monitoring Azure resources, see [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource).
- For guidance based on the five pillars of the Azure Well-Architected Framework, see [Best practices for monitoring virtual machines in Azure Monitor](/azure/azure-monitor/best-practices-vm).
- To get started with VM insights, see [Overview of VM insights](/azure/azure-monitor/vm/vminsights-overview).
- To learn how to collect and analyze VM host and client metrics and logs, see the training course [Monitor your Azure virtual machines with Azure Monitor](/training/modules/monitor-azure-vm-using-diagnostic-data).
- For a complete guide to monitoring Azure and hybrid VMs, see the [Monitor virtual machines deployment guide](/azure/azure-monitor/vm/monitor-virtual-machine).
