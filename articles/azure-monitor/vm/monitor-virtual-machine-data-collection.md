---
title: 'Monitor virtual machines with Azure Monitor: Collect data'
description: Learn how to configure data collection for virtual machines for monitoring in Azure Monitor. Monitor virtual machines and their workloads with an Azure Monitor guide.
ms.service: azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 01/05/2023
ms.reviewer: Xema Pathak
---

# Monitor virtual machines with Azure Monitor: Collect data
This article is part of the guide [Monitor virtual machines and their workloads in Azure Monitor](monitor-virtual-machine.md). It describes how to configure collection of data after you deploy Azure Monitor Agent to your Azure and hybrid virtual machines in Azure Monitor.

This article provides guidance on collecting the most common types of telemetry from virtual machines. The exact configuration that you choose depends on the workloads that you run on your machines. Included in each section are sample log query alerts that you can use with that data.

- For more information about analyzing telemetry collected from your virtual machines, see [Monitor virtual machines with Azure Monitor: Analyze monitoring data](monitor-virtual-machine-analyze.md).
- For more information about using telemetry collected from your virtual machines to create alerts in Azure Monitor, see [Monitor virtual machines with Azure Monitor: Alerts](monitor-virtual-machine-alerts.md).

> [!NOTE]
> This scenario describes how to implement complete monitoring of your Azure and hybrid virtual machine environment. To get started monitoring your first Azure virtual machine, see [Monitor Azure virtual machines](../../virtual-machines/monitor-vm.md).

## Data collection rules
Data collection from Azure Monitor Agent is defined by one or more [data collection rules (DCRs)](../essentials/data-collection-rule-overview.md) that are stored in your Azure subscription and associated with your virtual machines.

For virtual machines, DCRs define data such as events and performance counters to collect and specify the Log Analytics workspaces where data should be sent. The DCR can also use [transformations](../essentials/data-collection-transformations.md) to filter out unwanted data and to add calculated columns. A single machine can be associated with multiple DCRs, and a single DCR can be associated with multiple machines. DCRs are delivered to any machines they're associated with where Azure Monitor Agent processes them.

### View data collection rules
You can view the DCRs in your Azure subscription from **Data Collection Rules** on the **Monitor** menu in the Azure portal. DCRs support other data collection scenarios in Azure Monitor, so all of your DCRs aren't necessarily for virtual machines.

:::image type="content" source="../essentials/media/data-collection-rule-overview/view-data-collection-rules.png" lightbox="../essentials/media/data-collection-rule-overview/view-data-collection-rules.png" alt-text="Screenshot that shows DCRs in the Azure portal.":::

### Create data collection rules
There are multiple methods to create DCRs depending on the data collection scenario. In some cases, the Azure portal walks you through the configuration. Other scenarios require you to edit a DCR directly. When you configure VM insights, it creates a preconfigured DCR for you automatically. The following sections identify common data to collect and how to configure data collection.

In some cases, you might need to [edit an existing DCR](../essentials/data-collection-rule-edit.md) to add functionality. For example, you might use the Azure portal to create a DCR that collects Windows or Syslog events. You then want to add a transformation to that DCR to filter out columns in the events that you don't want to collect.

As your environment matures and grows in complexity, you should implement a strategy for organizing your DCRs to help their management. For guidance on different strategies, see [Best practices for data collection rule creation and management in Azure Monitor](../essentials/data-collection-rule-best-practices.md).

## Control costs
Because your Azure Monitor cost is dependent on how much data you collect, ensure that you're not collecting more than you need to meet your monitoring requirements. Your configuration is a balance between your budget and how much insight you want into the operation of your virtual machines.

[!INCLUDE [azure-monitor-cost-optimization](../../../includes/azure-monitor-cost-optimization.md)]

A typical virtual machine generates between 1 GB and 3 GB of data per month. This data size depends on the configuration of the machine, the workloads running on it, and the configuration of your DCRs. Before you configure data collection across your entire virtual machine environment, begin collection on some representative machines to better predict your expected costs when deployed across your environment. Use [Log Analytics workspace insights](../logs/log-analytics-workspace-insights-overview.md) or log queries in [Data volume by computer](../logs/analyze-usage.md#data-volume-by-computer) to determine the amount of billable data collected for each machine and adjust accordingly.

Evaluate collected data and filter out any that meets the following criteria to reduce your costs. Each data source that you collect may have a different method for filtering out unwanted data. See the sections below for the details each of the common data sources.
- Not used for alerting.
- No known forensic or diagnostic value.
- Not required by regulators.
- Not used in any dashboards or workbooks.


You can also use [transformations](../essentials/data-collection-transformations.md) to implement more granular filtering and also to filter data from columns that provide little value. For example, you might have a Windows event that's valuable for alerting, but it includes columns with redundant or excessive data. You can create a transformation that allows the event to be collected but removes this excessive data.

Filter data as much as possible before it's sent to Azure Monitor to avoid a [potential charge for filtering too much data using transformations](../essentials/data-collection-transformations.md#cost-for-transformations). Use [transformations](../essentials/data-collection-transformations.md) for record filtering using complex logic and for filtering columns with data that you don't require. 

## Default data collection
Azure Monitor automatically performs the following data collection without requiring any other configuration.

### Platform metrics
Platform metrics for Azure virtual machines include important host metrics such as CPU, network, and disk utilization. They can be:

- Viewed on the [Overview page](monitor-virtual-machine-analyze.md#single-machine-experience).
- Analyzed with [metrics explorer](../essentials/tutorial-metrics.md) for the machine in the Azure portal.
- Used for [metric alerts](tutorial-monitor-vm-alert-recommended.md).

### Activity log
The [activity log](../essentials/activity-log.md) is collected automatically. It includes the recent activity of the machine, such as any configuration changes and when it was stopped and started. You can view the platform metrics and activity log collected for each virtual machine host in the Azure portal.

You can [view the activity log](../essentials/activity-log.md#view-the-activity-log) for an individual machine or for all resources in a subscription. [Create a diagnostic setting](../essentials/diagnostic-settings.md) to send this data into the same Log Analytics workspace used by Azure Monitor Agent to analyze it with the other monitoring data collected for the virtual machine. There's no cost for ingestion or retention of activity log data.

### VM availability information in Azure Resource Graph
With [Azure Resource Graph](../../governance/resource-graph/overview.md), you can use the same Kusto Query Language used in log queries to query your Azure resources at scale with complex filtering, grouping, and sorting by resource properties. You can use [VM health annotations](../../service-health/resource-health-vm-annotation.md) to Resource Graph for detailed failure attribution and downtime analysis.

For information on what data is collected and how to view it, see [Monitor virtual machines with Azure Monitor: Analyze monitoring data](monitor-virtual-machine-analyze.md).

### VM insights
When you enable VM insights, it creates a DCR with the *_MSVMI-_* prefix that collects the following information. You can use this same DCR with other machines as opposed to creating a new one for each VM.

- Common performance counters for the client operating system are sent to the [InsightsMetrics](/azure/azure-monitor/reference/tables/insightsmetrics) table in the Log Analytics workspace. Counter names are normalized to use the same common name regardless of the operating system type. For a list of performance counters that are collected, see [How to query logs from VM insights](vminsights-log-query.md#performance-records).
- If you specified processes and dependencies to be collected, the following tables are populated:
  
  - [VMBoundPort](/azure/azure-monitor/reference/tables/vmboundport): Traffic for open server ports on the machine
  - [VMComputer](/azure/azure-monitor/reference/tables/vmcomputer): Inventory data for the machine
  - [VMConnection](/azure/azure-monitor/reference/tables/vmconnection): Traffic for inbound and outbound connections to and from the machine
  - [VMProcess](/azure/azure-monitor/reference/tables/vmprocess): Processes running on the machine

By default, [VM insights](../vm/vminsights-overview.md) won't enable collection of processes and dependencies to save data ingestion costs. This data is required for the Map feature and also deploys the dependency agent to the machine. [Enable this collection](vminsights-enable-portal.md#enable-vm-insights-for-azure-monitor-agent) if you want to use this feature.

## Collect Windows and Syslog events
The operating system and applications in virtual machines often write to the Windows event log or Syslog. You might create an alert as soon as a single event is found or wait for a series of matching events within a particular time window. You might also collect events for later analysis, such as identifying particular trends over time, or for performing troubleshooting after a problem occurs.

For guidance on how to create a DCR to collect Windows and Syslog events, see [Collect events and performance counters from virtual machines with Azure Monitor Agent](../agents/data-collection-rule-azure-monitor-agent.md). You can quickly create a DCR by using the most common Windows event logs and Syslog facilities filtering by event level.

For more granular filtering by criteria such as event ID, you can create a custom filter by using [XPath queries](../agents/data-collection-rule-azure-monitor-agent.md#filter-events-using-xpath-queries). You can further filter the collected data by [editing the DCR](../essentials/data-collection-rule-edit.md) to add a [transformation](../essentials/data-collection-transformations.md).

Use the following guidance as a recommended starting point for event collection. Modify the DCR settings to filter unneeded events and add other events depending on your requirements.

| Source | Strategy |
|:---|:---|
| Windows events | Collect at least **Critical**, **Error**, and **Warning** events for the **System** and **Application** logs to support alerting. Add **Information** events to analyze trends and support troubleshooting. **Verbose** events are rarely useful and typically shouldn't be collected. |
| Syslog events | Collect at least **LOG_WARNING** events for each facility to support alerting. Add **Information** events to analyze trends and support troubleshooting. **LOG_DEBUG** events are rarely useful and typically shouldn't be collected. |

### Sample log queries: Windows events

| Query   | Description |
|:---|:---|
| `Event` | All Windows events |
| `Event | where EventLevelName == "Error"` |All Windows events with severity of error |
| `Event | summarize count() by Source` |Count of Windows events by source |
| `Event | where EventLevelName == "Error" | summarize count() by Source` |Count of Windows error events by source |

### Sample log queries: Syslog events

| Query    | Description |
|:---|:---|
| `Syslog` |All Syslogs |
| `Syslog | where SeverityLevel == "error"` |All Syslog records with severity of error |
| `Syslog | summarize AggregatedValue = count() by Computer` |Count of Syslog records by computer |
| `Syslog | summarize AggregatedValue = count() by Facility` |Count of Syslog records by facility |

## Collect performance counters
Performance data from the client can be sent to either [Azure Monitor Metrics](../essentials/data-platform-metrics.md) or [Azure Monitor Logs](../logs/data-platform-logs.md), and you typically send them to both destinations. If you enabled VM insights, a common set of performance counters is collected in Logs to support its performance charts. You can't modify this set of counters, but you can create other DCRs to collect more counters and send them to different destinations.

There are multiple reasons why you would want to create a DCR to collect guest performance:

- You aren't using VM insights, so client performance data isn't already being collected.
- Collect other performance counters that VM insights isn't collecting.
- Collect performance counters from other workloads running on your client.
- Send performance data to [Azure Monitor Metrics](../essentials/data-platform-metrics.md) where you can use them with metrics explorer and metrics alerts.

For guidance on creating a DCR to collect performance counters, see [Collect events and performance counters from virtual machines with Azure Monitor Agent](../agents/data-collection-rule-azure-monitor-agent.md). You can quickly create a DCR by using the most common counters. For more granular filtering by criteria such as event ID, you can create a custom filter by using [XPath queries](../agents/data-collection-rule-azure-monitor-agent.md#filter-events-using-xpath-queries).

> [!NOTE]
> You might choose to combine performance and event collection in the same DCR.

 Destination | Description |
|:---|:---|
| Metrics    | Host metrics are automatically sent to Azure Monitor Metrics. You can use a DCR to collect client metrics so that they can be analyzed together with [metrics explorer](../essentials/metrics-getting-started.md) or used with [metrics alerts](../alerts/alerts-create-new-alert-rule.md?tabs=metric). This data is stored for 93 days. |
| Logs | Performance data stored in Azure Monitor Logs can be stored for extended periods. The data can be analyzed along with your event data by using [log queries](../logs/log-query-overview.md) with [Log Analytics](../logs/log-analytics-overview.md) or [log query alerts](../alerts/alerts-create-new-alert-rule.md?tabs=log). You can also correlate data by using complex logic across multiple machines, regions, and subscriptions.<br><br>Performance data is sent to the following tables:<br>- VM insights: [InsightsMetrics](/azure/azure-monitor/reference/tables/insightsmetrics)<br>- Other performance data: [Perf](/azure/azure-monitor/reference/tables/perf) |

### Sample log queries
The following samples use the `Perf` table with custom performance data. For information on performance data collected by VM insights, see [How to query logs from VM insights](../vm/vminsights-log-query.md#performance-records).

| Query  | Description |
|:---|:---|
| `Perf` | All Performance data |
| `Perf | where Computer == "MyComputer"` |All Performance data from a particular computer |
| `Perf | where CounterName == "Current Disk Queue Length"` |All Performance data for a particular counter |
| `Perf | where ObjectName == "Processor" and CounterName == "% Processor Time" and InstanceName == "_Total" | summarize AVGCPU = avg(CounterValue) by Computer` |Average CPU Utilization across all computers |
| `Perf | where CounterName == "% Processor Time" | summarize AggregatedValue = max(CounterValue) by Computer` |Maximum CPU Utilization across all computers |
| `Perf | where ObjectName == "LogicalDisk" and CounterName == "Current Disk Queue Length" and Computer == "MyComputerName" | summarize AggregatedValue = avg(CounterValue) by InstanceName` |Average Current Disk Queue length across all the instances of a given computer |
| `Perf | where CounterName == "Disk Transfers/sec" | summarize AggregatedValue = percentile(CounterValue, 95) by Computer` |95th Percentile of Disk Transfers/Sec across all computers |
| `Perf | where CounterName == "% Processor Time" and InstanceName == "_Total" | summarize AggregatedValue = avg(CounterValue) by bin(TimeGenerated, 1h), Computer` |Hourly average of CPU usage across all computers |
| `Perf | where Computer == "MyComputer" and CounterName startswith_cs "%" and InstanceName == "_Total" | summarize AggregatedValue = percentile(CounterValue, 70) by bin(TimeGenerated, 1h), CounterName` | Hourly 70 percentile of every % percent counter for a particular computer |
| `Perf | where CounterName == "% Processor Time" and InstanceName == "_Total" and Computer == "MyComputer" | summarize ["min(CounterValue)"] = min(CounterValue), ["avg(CounterValue)"] = avg(CounterValue), ["percentile75(CounterValue)"] = percentile(CounterValue, 75), ["max(CounterValue)"] = max(CounterValue) by bin(TimeGenerated, 1h), Computer` |Hourly average, minimum, maximum, and 75-percentile CPU usage for a specific computer |
| `Perf | where ObjectName == "MSSQL$INST2:Databases" and InstanceName == "master"` | All Performance data from the Database performance object for the master database from the named SQL Server instance INST2. | 
| `Perf | where TimeGenerated >ago(5m) | where ObjectName == "Process" and InstanceName != "_Total" and InstanceName != "Idle" | where CounterName == "% Processor Time" | summarize cpuVal=avg(CounterValue) by Computer,InstanceName | join (Perf| where TimeGenerated >ago(5m)| where ObjectName == "Process" and CounterName == "ID Process" | summarize arg_max(TimeGenerated,*) by ProcID=CounterValue ) on Computer,InstanceName | sort by TimeGenerated desc | summarize AvgCPU = avg(cpuVal) by InstanceName,ProcID` |  Average of CPU over last 5 min for each Process ID. |


## Collect text logs
Some applications write events written to a text log stored on the virtual machine. Create a [custom table and DCR](../agents/data-collection-text-log.md) to collect this data. You define the location of the text log, its detailed configuration, and the schema of the custom table. There's a cost for the ingestion and retention of this data in the workspace.

### Sample log queries
The column names used here are examples only. The column names for your log will most likely be different.

| Query      | Description |
|:---|:---|
| `MyApp_CL | summarize count() by code` | Count the number of events by code. |
| `MyApp_CL | where status == "Error" | summarize AggregatedValue = count() by Computer, bin(TimeGenerated, 15m)` | Create an alert rule on any error event. |

## Collect IIS logs
IIS running on Windows machines writes logs to a text file. Configure IIS log collection by using [Collect IIS logs with Azure Monitor Agent](../agents/data-collection-iis.md). There's a cost for the ingestion and retention of this data in the workspace.

Records from the IIS log are stored in the [W3CIISLog](/azure/azure-monitor/reference/tables/w3ciislog) table in the Log Analytics workspace. There's a cost for the ingestion and retention of this data in the workspace.

### Sample log queries

| Query       | Description |
|:---|:---|
| `W3CIISLog | where csHost=="www.contoso.com" | summarize count() by csUriStem` | Count the IIS log entries by URL for the host www.contoso.com. |
| `W3CIISLog | summarize sum(csBytes) by Computer` | Review the total bytes received by each IIS machine. |

## Monitor a service or daemon
To monitor the status of a Windows service or Linux daemon, enable the [Change Tracking and Inventory](../../automation/change-tracking/overview.md) solution in [Azure Automation](../../automation/automation-intro.md).

Azure Monitor has no ability on its own to monitor the status of a service or daemon. There are some possible methods to use, such as looking for events in the Windows event log, but this method is unreliable. You can also look for the process associated with the service running on the machine from the [VMProcess](/azure/azure-monitor/reference/tables/vmprocess) table populated by VM insights. This table only updates every hour, which isn't typically sufficient if you want to use this data for alerting.

> [!NOTE]
> The Change Tracking and Analysis solution is different from the [Change Analysis](vminsights-change-analysis.md) feature in VM insights. This feature is in public preview and not yet included in this scenario.

For different options to enable the Change Tracking solution on your virtual machines, see [Enable Change Tracking and Inventory](../../automation/change-tracking/overview.md#enable-change-tracking-and-inventory). This solution includes methods to configure virtual machines at scale. You have to [create an Azure Automation account](../../automation/quickstarts/create-azure-automation-account-portal.md) to support the solution.

When you enable Change Tracking and Inventory, two new tables are created in your Log Analytics workspace. Use these tables for logs queries and log query alert rules.

| Table | Description |
|:---|:---|
| [ConfigurationChange](/azure/azure-monitor/reference/tables/configurationdata) | Changes to in-guest configuration data |
| [ConfigurationData](/azure/azure-monitor/reference/tables/configurationdata) | Last reported state for in-guest configuration data |

### Sample log queries

- **List all services and daemons that have recently started.**
    
    ```kusto
    ConfigurationChange
    | where ConfigChangeType == "Daemons" or ConfigChangeType == "WindowsServices"
    | where SvcState == "Running"
    | sort by Computer, SvcName
    ```

- **Alert when a specific service stops.** Use this query in a log alert rule.
    
    ```kusto
    ConfigurationData
    | where SvcName == "W3SVC" 
    | where SvcState == "Stopped"
    | where ConfigDataType == "WindowsServices"
    | where SvcStartupType == "Auto"
    | summarize AggregatedValue = count() by Computer, SvcName, SvcDisplayName, SvcState, bin(TimeGenerated, 15m)
    ```

- **Alert when one of a set of services stops.** Use this query in a log alert rule.

    ```kusto
    let services = dynamic(["omskd","cshost","schedule","wuauserv","heathservice","efs","wsusservice","SrmSvc","CertSvc","wmsvc","vpxd","winmgmt","netman","smsexec","w3svc","sms_site_vss_writer","ccmexe","spooler","eventsystem","netlogon","kdc","ntds","lsmserv","gpsvc","dns","dfsr","dfs","dhcp","DNSCache","dmserver","messenger","w32time","plugplay","rpcss","lanmanserver","lmhosts","eventlog","lanmanworkstation","wnirm","mpssvc","dhcpserver","VSS","ClusSvc","MSExchangeTransport","MSExchangeIS"]);
    ConfigurationData
    | where ConfigDataType == "WindowsServices"
    | where SvcStartupType == "Auto"
    | where SvcName in (services)
    | where SvcState == "Stopped"
    | project TimeGenerated, Computer, SvcName, SvcDisplayName, SvcState
    | summarize AggregatedValue = count() by Computer, SvcName, SvcDisplayName, SvcState, bin(TimeGenerated, 15m)
    ```

## Monitor a port
Port monitoring verifies that a machine is listening on a particular port. Two potential strategies for port monitoring are described here.

### Dependency agent tables
If you're using VM insights with **Processes and dependencies collection** enabled, you can use [VMConnection](/azure/azure-monitor/reference/tables/vmconnection) and [VMBoundPort](/azure/azure-monitor/reference/tables/vmboundport) to analyze connections and ports on the machine. The `VMBoundPort` table is updated every minute with each process running on the computer and the port it's listening on. You can create a log query alert similar to the missing heartbeat alert to find processes that have stopped or to alert when the machine isn't listening on a particular port.

- **Review the count of ports open on your VMs to assess which VMs have configuration and security vulnerabilities.**

    ```kusto
    VMBoundPort
    | where Ip != "127.0.0.1"
    | summarize by Computer, Machine, Port, Protocol
    | summarize OpenPorts=count() by Computer, Machine
    | order by OpenPorts desc
    ```

- **List the bound ports on your VMs to assess which VMs have configuration and security vulnerabilities.**

    ```kusto
    VMBoundPort
    | distinct Computer, Port, ProcessName
    ```

- **Analyze network activity by port to determine how your application or service is configured.**

    ```kusto
    VMBoundPort
    | where Ip != "127.0.0.1"
    | summarize BytesSent=sum(BytesSent), BytesReceived=sum(BytesReceived), LinksEstablished=sum(LinksEstablished), LinksTerminated=sum(LinksTerminated), arg_max(TimeGenerated, LinksLive) by Machine, Computer, ProcessName, Ip, Port, IsWildcardBind
    | project-away TimeGenerated
    | order by Machine, Computer, Port, Ip, ProcessName
    ```

- **Review bytes sent and received trends for your VMs.**

    ```kusto
    VMConnection
    | summarize sum(BytesSent), sum(BytesReceived) by bin(TimeGenerated,1hr), Computer
    | order by Computer desc
    | render timechart
    ```

- **Use connection failures over time to determine if the failure rate is stable or changing.**

    ```kusto
    VMConnection
    | where Computer == <replace this with a computer name, e.g. 'acme-demo'>
    | extend bythehour = datetime_part("hour", TimeGenerated)
    | project bythehour, LinksFailed
    | summarize failCount = count() by bythehour
    | sort by bythehour asc
    | render timechart
    ```

- **Link status trends to analyze the behavior and connection status of a machine.**

    ```kusto
    VMConnection
    | where Computer == <replace this with a computer name, e.g. 'acme-demo'>
    | summarize  dcount(LinksEstablished), dcount(LinksLive), dcount(LinksFailed), dcount(LinksTerminated) by bin(TimeGenerated, 1h)
    | render timechart
    ```

### Connection Manager
The [Connection Monitor](../../network-watcher/connection-monitor-overview.md) feature of [Network Watcher](../../network-watcher/network-watcher-monitoring-overview.md) is used to test connections to a port on a virtual machine. A test verifies that the machine is listening on the port and that it's accessible on the network.

Connection Manager requires the Network Watcher extension on the client machine initiating the test. It doesn't need to be installed on the machine being tested. For more information, see [Tutorial: Monitor network communication using the Azure portal](../../network-watcher/connection-monitor.md).

There's an extra cost for Connection Manager. For more information, see [Network Watcher pricing](https://azure.microsoft.com/pricing/details/network-watcher/).

## Run a process on a local machine
Monitoring of some workloads requires a local process. An example is a PowerShell script that runs on the local machine to connect to an application and collect or process data. You can use [Hybrid Runbook Worker](../../automation/automation-hybrid-runbook-worker.md), which is part of [Azure Automation](../../automation/automation-intro.md), to run a local PowerShell script. There's no direct charge for Hybrid Runbook Worker, but there's a cost for each runbook that it uses.

The runbook can access any resources on the local machine to gather required data. It can't send data directly to Azure Monitor or create an alert. To create an alert, have the runbook write an entry to a custom log. Then configure that log to be collected by Azure Monitor. Create a log query alert rule that fires on that log entry.

## Next steps

* [Analyze monitoring data collected for virtual machines](monitor-virtual-machine-analyze.md)
* [Create alerts from collected data](monitor-virtual-machine-alerts.md)


