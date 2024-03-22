---
title: Monitor Azure Virtual Machines
description: Start here to learn how to monitor Azure Virtual Machines and Virtual Machine Scale Sets.
ms.date: 03/21/2024
ms.custom: horz-monitor
ms.topic: conceptual
ms.service: virtual-machines
---

<!-- 
IMPORTANT 
To make this template easier to use, first:
1. Search and replace Virtual Machines with the official name of your service.
2. Search and replace virtual-machines with the service name to use in GitHub filenames.-->

<!-- VERSION 3.0 2024_01_07
For background about this template, see https://review.learn.microsoft.com/en-us/help/contribute/contribute-monitoring?branch=main -->

<!-- Most services can use the following sections unchanged. The sections use #included text you don't have to maintain, which changes when Azure Monitor functionality changes. Add info into the designated service-specific places if necessary. Remove #includes or template content that aren't relevant to your service.

At a minimum your service should have the following two articles:

1. The primary monitoring article (based on this template)
   - Title: "Monitor Virtual Machines"
   - TOC title: "Monitor"
   - Filename: "monitor-virtual-machines.md"

2. A reference article that lists all the metrics and logs for your service (based on the template data-reference-template.md).
   - Title: "Virtual Machines monitoring data reference"
   - TOC title: "Monitoring data reference"
   - Filename: "monitor-vm-reference.md".
-->

# Monitor Azure Virtual Machines

<!-- Intro. Required. -->
[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

>[!NOTE]
>This article provides basic information to help you get started with monitoring Azure Virtual Machines and Virtual Machine Scale Sets. For a complete guide to monitoring your entire environment of Azure and hybrid virtual machines (VMs), see the [Monitor virtual machines deployment guide](/azure/azure-monitor/vm/monitor-virtual-machine).

<!-- ## Insights. Optional section. If your service has insights, add the following include and information. -->
[!INCLUDE [horz-monitor-insights](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)]

### VM insights

VM insights monitors your Azure and hybrid virtual machines in a single interface. VM insights provides the following benefits beyond other features for monitoring VMs in Azure Monitor:

- Simplified onboarding of the Azure Monitor agent and the Dependency agent, so that you can monitor a virtual machine (VM) guest operating system and workloads.
- Predefined data collection rules that collect the most common set of performance data.
- Predefined trending performance charts and workbooks, so that you can analyze core performance metrics from the virtual machine's guest operating system.
- The Dependency map, which displays processes that run on each virtual machine and the interconnected components with other machines and external sources.

:::image type="content" source="media/monitor-vm/vminsights-01.png" lightbox="media/monitor-vm/vminsights-01.png" alt-text="Screenshot of the VM insights 'Logical Disk Performance' view.":::

:::image type="content" source="media/monitor-vm/vminsights-02.png" lightbox="media/monitor-vm/vminsights-02.png" alt-text="Screenshot of the VM insights 'Map' view.":::

For a tutorial on enabling VM insights for a virtual machine, see [Enable monitoring with VM insights for Azure virtual machine](/azure/azure-monitor/vm/tutorial-monitor-vm-enable-insights). For general information about enabling insights and a variety of methods for onboarding VMs, see [Enable VM insights overview](/azure/azure-monitor/vm/vminsights-enable-overview).

If you enable VM insights, the Azure Monitor agent is installed and starts sending a predefined set of performance data to Azure Monitor Logs. You can create other data collection rules to collect events and other performance data. To learn how to install the Azure Monitor agent and create a data collection rule (DCR) that defines the data to collect, see [Tutorial: Collect guest logs and metrics from an Azure virtual machine](/azure/azure-monitor/vm/tutorial-monitor-vm-guest).

<!-- ## Resource types. Required section. -->
[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]
For more information about the resource types for Virtual Machines, see [Azure Virtual Machines monitoring data reference](monitor-vm-reference.md).

<!-- ## Data storage. Required section. Optionally, add service-specific information about storing your monitoring data after the include. -->
[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]
<!-- Add service-specific information about storing monitoring data here, if applicable. For example, SQL Server stores other monitoring data in its own databases. -->

<!-- METRICS SECTION START ------------------------------------->

<!-- ## Platform metrics. Required section.
  - If your service doesn't collect platform metrics, use the following include: [!INCLUDE [horz-monitor-no-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-no-platform-metrics.md)]
  - If your service collects platform metrics, add the following include, statement, and service-specific information as appropriate. -->
[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]
Platform metrics for Azure VMs include important *host metrics* such as CPU, network, and disk utilization. Host OS metrics relate to the Hyper-V session that's hosting a guest operating system (guest OS) session.

Metrics for the *guest OS* that runs in a VM must be collected through one or more agents, such as the [Azure Monitor agent](/azure/azure-monitor/agents/azure-monitor-agent-overview), that run on or as part of the guest OS. Guest OS metrics include performance counters that track guest CPU percentage or memory usage, both of which are frequently used for autoscaling or alerting. For more information, see [Guest OS and host OS metrics](/azure/azure-monitor/reference/supported-metrics/metrics-index#guest-os-and-host-os-metrics).

For detailed information about how the Azure Monitor agent collects VM monitoring data, see [Monitor virtual machines with Azure Monitor: Collect data](/azure/azure-monitor/vm/monitor-virtual-machine-data-collection).

For a list of available metrics for Virtual Machines, see [Virtual Machines monitoring data reference](monitor-vm-reference.md#metrics).

<!-- Platform metrics service-specific information. Add service-specific information about your platform metrics here.-->

<!-- ## Prometheus/container metrics. Optional. If your service uses containers/Prometheus metrics, add the following include and information. 
[!INCLUDE [horz-monitor-container-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-container-metrics.md)]
Add service-specific information about your container/Prometheus metrics here.-->

<!-- ## System metrics. Optional. If your service uses system-imported metrics, add the following include and information. -->
[!INCLUDE [horz-monitor-system-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-system-metrics.md)]

<!-- ## Custom metrics. Optional. If your service uses custom imported metrics, add the following include and information. -->

Azure Monitor starts automatically collecting metric data for your virtual machine host when you create the VM. However, to collect logs and performance data from the guest operating system of the VM, you must install the Azure Monitor agent. You can install the agent and configure collection by using VM insights or by creating a DCR.

[!INCLUDE [horz-monitor-custom-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-custom-metrics.md)]

You can send custom VM metrics to Azure Monitor via several methods:

- Install the Azure Monitor agent on your Windows or Linux Azure VM and use a DCR to send performance counters to Azure Monitor metrics.
- Install the Azure Diagnostics extension on your Azure VM, and then send performance counters to Azure Monitor.
- Install the [InfluxData Telegraf agent](/azure/azure-monitor/essentials/collect-custom-metrics-linux-telegraf) on your Azure Linux VM, and send metrics by using the Azure Monitor output plug-in.
- Send custom metrics [directly to the Azure Monitor REST API](/azure/azure-monitor/essentials/metrics-store-custom-rest-api).

For more information about custom metrics, see [Custom metrics in Azure Monitor (preview)](/azure/azure-monitor/essentials/metrics-custom-overview). To retrieve metrics like CPU usage for a Linux VM by using the Azure REST API, see [Get Virtual Machine usage metrics using the REST API](linux/metrics-vm-usage-rest.md).


<!-- ## Non-Azure Monitor metrics. Optional. If your service uses any non-Azure Monitor based metrics, add the following include and information. -->
[!INCLUDE [horz-monitor-custom-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-non-monitor-metrics.md)]

Boot diagnostics is a debugging feature for Azure VMs that allows diagnosis of VM boot failures by collecting serial log information and screenshots of a VM as it boots up. When you create a VM in the Azure portal, boot diagnostics is enabled by default. For more information, see [Azure boot diagnostics](boot-diagnostics.md).

<!-- METRICS SECTION END ------------------------------------->

<!-- LOGS SECTION START -------------------------------------->

<!-- ## Resource logs. Required section.
  - If your service doesn't collect resource logs, use the following include [!INCLUDE [horz-monitor-no-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-no-resource-logs.md)]
  - If your service collects resource logs, add the following include, statement, and service-specific information as appropriate. -->
[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

- For the available resource log categories, their associated Log Analytics tables, and the logs schemas for Virtual Machines, see [Virtual Machines monitoring data reference](monitor-vm-reference.md#resource-logs).
<!-- Resource logs service-specific information. Add service-specific information about your resource logs here.
NOTE: Azure Monitor already has general information on how to configure and route resource logs. See https://learn.microsoft.com/azure/azure-monitor/platform/diagnostic-settings. Ideally, don't repeat that information here. You can provide a single screenshot of the diagnostic settings portal experience if you want. -->

- For detailed information about how the Azure Monitor agent collects VM log data, see [Monitor virtual machines with Azure Monitor: Collect data](/azure/azure-monitor/vm/monitor-virtual-machine-data-collection).

<!-- ## Activity log. Required section. Optionally, add service-specific information about your activity log after the include. -->
[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]
<!-- Activity log service-specific information. Add service-specific information about your activity log here. -->

<!-- ## Imported logs. Optional section. If your service uses imported logs, add the following include and information. 
[!INCLUDE [horz-monitor-imported-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-imported-logs.md)]
Add service-specific information about your imported logs here. -->

<!-- ## Other logs. Optional section.
If your service has other logs that aren't resource logs or in the activity log, add information that states what they are and what they cover here. You can describe how to route them in a later section. -->

## Data collection rules

[Data collection rules (DCRs)](/azure/azure-monitor/essentials/data-collection-rule-overview) define data collection from the Azure Monitor Agent and are stored in your Azure subscription. For VMs, DCRs define data such as events and performance counters to collect, and specify locations such as Log Analytics workspaces to send the data. A single VM can be associated with multiple DCRs, and a single DCR can be associated with multiple VMs.

### VM insights DCR

VM insights creates a DCR that collects common performance counters for the client operating system and sends them to the [InsightsMetrics](/azure/azure-monitor/reference/tables/insightsmetrics) table in the Log Analytics workspace. For a list of performance counters collected, see [How to query logs from VM insights](/azure/azure-monitor/vm/vminsights-log-query#performance-records). You can use this DCR with other VMs instead of creating a new DCR for each VM.

You can also optionally enable collection of processes and dependencies, which populates the following tables and enables the VM insights Map feature.

- [VMBoundPort](/azure/azure-monitor/reference/tables/vmboundport): Traffic for open server ports on the machine
- [VMComputer](/azure/azure-monitor/reference/tables/vmcomputer): Inventory data for the machine
- [VMConnection](/azure/azure-monitor/reference/tables/vmconnection): Traffic for inbound and outbound connections to and from the machine
- [VMProcess](/azure/azure-monitor/reference/tables/vmprocess): Processes running on the machine

### Collect performance counters

VM insights collects a common set of performance counters in Logs to support its performance charts. If you aren't using VM insights, or want to collect other counters or send them to other destinations, you can create other DCRs. You can quickly create a DCR by using the most common counters.

You can send performance data from the client to either Azure Monitor Metrics or Azure Monitor Logs. VM insights sends performance data to the [InsightsMetrics](/azure/azure-monitor/reference/tables/insightsmetrics) table. Other DCRs send performance data to the [Perf](/azure/azure-monitor/reference/tables/perf) table. For guidance on creating a DCR to collect performance counters, see [Collect events and performance counters from virtual machines with Azure Monitor Agent](/azure/azure-monitor/agents/data-collection-rule-azure-monitor-agent).

### Collect Windows and Syslog events

VM operating systems and applications often write to the Windows event log or Syslog. You can create a DCR to collect Windows and Syslog events for later analysis or troubleshooting. For more information, see [Collect events and performance counters from virtual machines with Azure Monitor Agent](/azure/azure-monitor/agents/data-collection-rule-azure-monitor-agent).

<!-- LOGS SECTION END ------------------------------------->

<!-- ANALYSIS SECTION START -------------------------------------->

<!-- ## Analyze data. Required section. -->
[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

<!-- ### External tools. Required section. -->
[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

### Query logs from VM insights

VM insights stores the data it collects in Azure Monitor Logs, and the insights provide performance and map views that you can use to interactively analyze the data. You can work directly with this data to drill down further or perform custom analyses. For more information and to get sample queries for this data, see [How to query logs from VM insights](/azure/azure-monitor/vm/vminsights-log-query).

<!-- ### Sample Kusto queries. Required section. If you have sample Kusto queries for your service, add them after the include. -->
[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

To analyze log data that you collect from your VMs, you can use [log queries](/azure/azure-monitor/logs/get-started-queries) in [Log Analytics](/azure/azure-monitor/logs/log-analytics-tutorial). Several [built-in queries](/azure/azure-monitor/logs/queries) for VMs are available to use, or you can create your own queries. You can interactively work with the results of these queries, include them in a workbook to make them available to other users, or generate alerts based on their results.

To access built-in Kusto queries for your VM, select **Logs** in the **Monitoring** section of the left navigation on your VM's Azure portal page. On the **Logs** page, select the **Queries** tab, and then select the query to run.

<!-- Add sample Kusto queries for your service here. -->
:::image type="content" source="media/monitor-vm/log-analytics-query.png" lightbox="media/monitor-vm/log-analytics-query.png" alt-text="Screenshot of the 'Logs' pane displaying Log Analytics query results.":::


<!-- ### Virtual Machines service-specific analytics. Optional section.
Add short information or links to specific articles that outline how to analyze data for your service. -->

<!-- ANALYSIS SECTION END ------------------------------------->

<!-- ALERTS SECTION START -------------------------------------->

<!-- ## Alerts. Required section. -->
[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

You can create a single multi-resource alert rule that applies to all VMs in a particular resource group or subscription within the same region. See [Create availability alert rule for Azure virtual machine (preview)](/azure/azure-monitor/vm/tutorial-monitor-vm-alert-availability) for a tutorial using the availability metric.

<!-- ONLY if your service (Azure VMs, AKS, or Log Analytics workspaces) offer out-of-the-box recommended alerts, add the following include. -->
[!INCLUDE [horz-monitor-insights-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-recommended-alert-rules.md)]

Recommended alert rules for Azure VMs include the [VM availability metric](monitor-vm-reference.md#vm-availability-metric-preview), which alerts when a VM stops running.

For more information, see [Tutorial: Enable recommended alert rules for Azure virtual machine](/azure/azure-monitor/vm/tutorial-monitor-vm-alert-recommended). 

<!-- ### Virtual Machines alert rules. Required section.
**MUST HAVE** service-specific alert rules. Include useful alerts on metrics, logs, log conditions, or activity log.
Fill in the following table with metric and log alerts that would be valuable for your service. Change the format as necessary for readability. You can instead link to an article that discusses your common alerts in detail.
Ask your PMs if you don't know. This information is the BIGGEST request we get in Azure Monitor, so don't avoid it long term. People don't know what to monitor for best results. Be prescriptive. -->

### Common alert rules

To see common VM log alert rules in the Azure portal, go to the **Queries** pane in Log Analytics. For **Resource type**, enter **Virtual machines**, and for **Type**, enter **Alerts**.

For a list and discussion of common Virtual Machines alert rules, see [Common alert rules](/azure/azure-monitor/vm/monitor-virtual-machine-alerts#common-alert-rules).

<!-- ### Advisor recommendations. Required section. -->
[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]
<!-- Add any service-specific advisor recommendations or screenshots here. -->

<!-- ALERTS SECTION END -------------------------------------->

## Related content
<!-- You can change the wording and add more links if useful. -->

- For a reference of the metrics, logs, and other important values for Virtual Machines, see [Virtual Machines monitoring data reference](monitor-vm-reference.md).
- For general details about monitoring Azure resources, see [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource).
- For guidance based on the five pillars of the Azure Well-Architected Framework, see [Best practices for monitoring virtual machines in Azure Monitor](/azure/azure-monitor/best-practices-vm).
- To get started with VM insights, see [Overview of VM insights](/azure/azure-monitor/vm/vminsights-overview).
- To learn how to collect and analyze VM host and client metrics and logs, see the training course [Monitor your Azure virtual machines with Azure Monitor](/training/modules/monitor-azure-vm-using-diagnostic-data).
- For a complete guide to monitoring Azure and hybrid VMs, see the [Monitor virtual machines deployment guide](/azure/azure-monitor/vm/monitor-virtual-machine).
