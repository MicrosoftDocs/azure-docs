---
title: Monitor Azure virtual machines with Azure Monitor
description: Describes how to collect and analyze monitoring data from virtual machines in Azure using Azure Monitor.
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 05/05/2020

---

# Monitoring virtual machines with Azure Monitor - Analyze monitoring data
Once you’ve deployed agents to your virtual machines and configured data collection, data will be available for analysis. You can leverage existing views and workbooks that visualize the collected data and allow you to drill in for more analysis. Or you can perform ad hoc analysis by writing your own log queries. You can even create your own workbooks if you have custom requirements.
This section describes the different ways you can view and analyze data collected from your virtual machines.

## Understand types of data available

The basic types of data collected from virtual machines include the following:

| Data | Contents |
|:---|:---|
| [Activity log](../essentials/platform-logs-overview.md) | Provides insight into the operations on each Azure resource in the subscription from the outside (the management plane). For a virtual machine, this includes such information as when it was started and any configuration changes. |
| [Platform metrics](../essentials/data-platform-metrics.md) | Numerical values that are automatically collected at regular intervals and describe some aspect of a resource at a particular time. Platform metrics are collected for the virtual machine host, but you require the diagnostics extension to collect metrics for the guest operating system.
| Activity log | Information about changes to virtual machines including creation, configuration changes, and start/stop. |
| Metrics | Performance data collected for the host machine.  Includes performance data from guest operating system only if the diagnostic extension is installed. View this data in Metrics explorer. |
| Logs | Event and performance data collected from VM insights and from any data sources configured on the workspace. View this data in VM insights or create custom queries using Log Analytics. |

## Metrics and Logs
It can be confusing to determine which data is available between Log and Metrics since data is collected using different methods, and agents send data to different locations. This is important to understand though, since different features of Azure Monitor use different kinds of data, and the type of alerting that you use for a particular scenario will depend on having that data available in a particular location.

> [!NOTE]
> The Azure Monitor Agent, currently in public preview, will replace the Log Analytics agent and have the ability to send client performance data to both Logs and Metrics. When this agent becomes generally available with VM insights, then all performance data will sent to both Logs and Metrics significantly simplifying this logic. 

- Any non-numeric data such as events is stored in Logs.  
- Performance data from the guest operating system will be sent to logs by VM insights (using the Log Analytics agent and Dependency agent).
- Performance data from the guest operating system will only be sent to Metrics if the diagnostic extension is installed.
- A specific set of performance counters is available for Metric alerts even though the data is stored in Logs. These counters cannot be analyzed with Metrics explorer.


## Virtual machine monitoring menu
Once you configure collection of monitoring data for a virtual machine, you have multiple options for accessing it in the Azure portal:

- Use the **Azure Monitor** menu to access data from all monitored resources. 
- Use VM insights for monitoring sets of virtual machines at scale.
- Analyze data for a single virtual machine from its menu in the Azure portal. The table below lists different options for monitoring the virtual machines menu.

![Monitoring in the Azure portal](media/monitor-vm-azure/monitor-menu.png)

| Menu option | Description |
|:---|:---|
| Overview | Displays [platform metrics](../essentials/data-platform-metrics.md) for the virtual machine host. Click on a graph to work with this data in [metrics explorer](../essentials/metrics-getting-started.md). |
| Activity log | [Activity log](../essentials/activity-log.md#view-the-activity-log) entries filtered for the current virtual machine. |
| Insights | Opens [VM insights](../vm/vminsights-overview.md) with the map for the current virtual machine selected. |
| Alerts | Views [alerts](../alerts/alerts-overview.md) for the current virtual machine.  |
| Metrics | Open [metrics explorer](../essentials/metrics-getting-started.md) with the scope set to the current virtual machine. |
| Diagnostic settings | Enable and configure [diagnostics extension](../agents/diagnostics-extension-overview.md) for the current virtual machine. |
| Advisor recommendations | Recommendations for the current virtual machine from [Azure Advisor](../../advisor/index.yml). |
| Logs | Open [Log Analytics](../logs/log-analytics-overview.md) with the [scope](../logs/scope.md) set to the current virtual machine. |
| Connection monitor | Open [Network Watcher Connection Monitor](../../network-watcher/connection-monitor-overview.md) to monitor connections between the current virtual machine and other virtual machines. |


## Analyze performance with VM insights
VM insights includes multiple performance charts that help you analyze common performance counters from the guest operating system. You can view data for a single machine or compare data from multiple machines over a period of time. For details on using these performance charts, see [How to chart performance with VM insights](vminsights-performance.md).

## Analyze machine dependencies 
Analyze dependencies between machines and between a machine and external dependencies using the map feature of VM insights. See [Use the Map feature of VM insights to understand application components](vminsights-maps.md) for details on this feature.

## Analyze machine details
The map feature of VM insights includes views for machine properties, events associated with the machine, open alerts for the machine, and change analysis. This is data that's available elsewhere in Azure monitor, but you may prefer this consolidated interface and integration with the dependency map. See [Use the Map feature of VM insights to understand application components](vminsights-maps.md) for details on this feature.


## Analyze metric data with metrics explorer
Select  **Metrics** from the virtual machine's menu to open metrics explorer which allows you to analyze metric data for virtual machines. See [Getting started with Azure Metrics Explorer](../essentials/metrics-getting-started.md) for details on using this tool. 

There are three namespaces used by virtual machines for metrics:

| Namespace | Description | Requirement |
|:---|:---|:---|
| Virtual Machine Host | Host metrics automatically collected for all Azure virtual machines. Detailed list of metrics at [Microsoft.Compute/virtualMachines](../essentials/metrics-supported.md#microsoftcomputevirtualmachines). | Collected automatically with no configuration required. |
| Guest (classic) | Limited set of guest operating system and application performance data. Available in metrics explorer but not other Azure Monitor features such as metric alerts.  | [Diagnostic extension](../agents/diagnostics-extension-overview.md) installed. Data is read from Azure storage.  |
| Virtual Machine Guest | Guest operating system and application performance data available to all Azure Monitor features using metrics. | For Windows, [diagnostic extension installed](../agents/diagnostics-extension-overview.md) installed with Azure Monitor sink enabled. For Linux, [Telegraf agent installed](../essentials/collect-custom-metrics-linux-telegraf.md). |

![Metrics explorer in the Azure portal](media/monitor-vm-azure/metrics.png)

## Analyze log data with Log Analytics
Azure virtual machines will collect the following data to Azure Monitor Logs. 

VM insights enables the collection of a predetermined set of performance counters that are written to the *InsightsMetrics* table. This is the same table used by [Container insights](../containers/container-insights-overview.md). 

| Data source | Requirements | Tables |
|:---|:---|:---|
| VM insights | Enable on each virtual machine. | InsightsMetrics<br>VMBoundPort<br>VMComputer<br>VMConnection<br>VMProcess<br>See [How to query logs from VM insights](../vm/vminsights-log-search.md) for details. |
| Activity log | Diagnostic setting for the subscription. | AzureActivity |
| Host metrics | Diagnostic setting for the virtual machine. | AzureMetrics |


| Table | Description | Source|
|:---|:---|:---|
| [VMBoundPort](/azure/azure-monitor/reference/tables/vmboundport) | Traffic for open server ports on the monitored machine. | VM Insights |
| [VMComputer](/azure/azure-monitor/reference/tables/vmcomputer) | Inventory data for servers collected by the Service Map and VM Insights solutions using the Dependency agent and Log analytics agent. | VM insights |
| [VMConnection](/azure/azure-monitor/reference/tables/vmconnection) | Traffic for inbound and outbound connections to and from monitored computers. | VM insights |
| [VMProcess](/azure/azure-monitor/reference/tables/vmprocess) | Process data for servers collected by the Service Map and VM Insights solutions using the Dependency agent and Log analytics agent. | VM insights |
| ActivityLog | Configuration changes and history of when each virtual machine is stopped and started. | Activity Log |

> [!NOTE]
> Performance data collected by the Log Analytics agent writes to the *Perf* table while VM insights will collect it to the *InsightsMetrics* table. This is the same data, but the tables have a different structure. If you have existing queries based on *Perf*, the will need to be rewritten to use *InsightsMetrics*.


### List all known machines

```kusto
VMComputer | summarize arg_max(TimeGenerated, *) by _ResourceId
```

### When was the VM last rebooted

```kusto
let Today = now(); VMComputer | extend DaysSinceBoot = Today - BootTime | summarize by Computer, DaysSinceBoot, BootTime | sort by BootTime asc
```

### Summary of Azure VMs by image, location, and SKU

```kusto
VMComputer | where AzureLocation != "" | summarize by Computer, AzureImageOffering, AzureLocation, AzureImageSku
```

### List the physical memory capacity of all managed computers

```kusto
VMComputer | summarize arg_max(TimeGenerated, *) by _ResourceId | project PhysicalMemoryMB, Computer
```

### List computer name, DNS, IP, and OS

```kusto
VMComputer | summarize arg_max(TimeGenerated, *) by _ResourceId | project Computer, OperatingSystemFullName, DnsNames, Ipv4Addresses
```

### Find all processes with "sql" in the command line

```kusto
VMProcess | where CommandLine contains_cs "sql" | summarize arg_max(TimeGenerated, *) by _ResourceId
```

### Find a machine (most recent record) by resource name

```kusto
search in (VMComputer) "m-4b9c93f9-bc37-46df-b43c-899ba829e07b" | summarize arg_max(TimeGenerated, *) by _ResourceId
```

### Find a machine (most recent record) by IP address

```kusto
search in (VMComputer) "10.229.243.232" | summarize arg_max(TimeGenerated, *) by _ResourceId
```

### List all known processes on a specified machine

```kusto
VMProcess | where Machine == "m-559dbcd8-3130-454d-8d1d-f624e57961bc" | summarize arg_max(TimeGenerated, *) by _ResourceId
```

### List all computers running SQL Server

```kusto
VMComputer | where AzureResourceName in ((search in (VMProcess) "*sql*" | distinct Machine)) | distinct Computer
```

### List all unique product versions of curl in my datacenter

```kusto
VMProcess | where ExecutableName == "curl" | distinct ProductVersion
```

### Create a computer group of all computers running CentOS

```kusto
VMComputer | where OperatingSystemFullName contains_cs "CentOS" | distinct Computer
```

### Bytes sent and received trends

```kusto
VMConnection | summarize sum(BytesSent), sum(BytesReceived) by bin(TimeGenerated,1hr), Computer | order by Computer desc | render timechart
```

### Which Azure VMs are transmitting the most bytes

```kusto
VMConnection | join kind=fullouter(VMComputer) on $left.Computer == $right.Computer | summarize count(BytesSent) by Computer, AzureVMSize | sort by count_BytesSent desc
```

### Link status trends

```kusto
VMConnection | where TimeGenerated >= ago(24hr) | where Computer == "acme-demo" | summarize dcount(LinksEstablished), dcount(LinksLive), dcount(LinksFailed), dcount(LinksTerminated) by bin(TimeGenerated, 1h) | render timechart
```

### Connection failures trend

```kusto
VMConnection | where Computer == "acme-demo" | extend bythehour = datetime_part("hour", TimeGenerated) | project bythehour, LinksFailed | summarize failCount = count() by bythehour | sort by bythehour asc | render timechart
```

### Bound Ports

```kusto
VMBoundPort
| where TimeGenerated >= ago(24hr)
| where Computer == 'admdemo-appsvr'
| distinct Port, ProcessName
```

### Number of open ports across machines

```kusto
VMBoundPort
| where Ip != "127.0.0.1"
| summarize by Computer, Machine, Port, Protocol
| summarize OpenPorts=count() by Computer, Machine
| order by OpenPorts desc
```

### Score processes in your workspace by the number of ports they have open

```kusto
VMBoundPort
| where Ip != "127.0.0.1"
| summarize by ProcessName, Port, Protocol
| summarize OpenPorts=count() by ProcessName
| order by OpenPorts desc
```

### Aggregate behavior for each port

This query can then be used to score ports by activity, e.g., ports with most inbound/outbound traffic, ports with most connections
```kusto
// 
VMBoundPort
| where Ip != "127.0.0.1"
| summarize BytesSent=sum(BytesSent), BytesReceived=sum(BytesReceived), LinksEstablished=sum(LinksEstablished), LinksTerminated=sum(LinksTerminated), arg_max(TimeGenerated, LinksLive) by Machine, Computer, ProcessName, Ip, Port, IsWildcardBind
| project-away TimeGenerated
| order by Machine, Computer, Port, Ip, ProcessName
```

### Summarize the outbound connections from a group of machines

```kusto
// the machines of interest
let machines = datatable(m: string) ["m-82412a7a-6a32-45a9-a8d6-538354224a25"];
// map of ip to monitored machine in the environment
let ips=materialize(VMComputer
| summarize ips=makeset(todynamic(Ipv4Addresses)) by MonitoredMachine=AzureResourceName
| mvexpand ips to typeof(string));
// all connections to/from the machines of interest
let out=materialize(VMConnection
| where Machine in (machines)
| summarize arg_max(TimeGenerated, *) by ConnectionId);
// connections to localhost augmented with RemoteMachine
let local=out
| where RemoteIp startswith "127."
| project ConnectionId, Direction, Machine, Process, ProcessName, SourceIp, DestinationIp, DestinationPort, Protocol, RemoteIp, RemoteMachine=Machine;
// connections not to localhost augmented with RemoteMachine
let remote=materialize(out
| where RemoteIp !startswith "127."
| join kind=leftouter (ips) on $left.RemoteIp == $right.ips
| summarize by ConnectionId, Direction, Machine, Process, ProcessName, SourceIp, DestinationIp, DestinationPort, Protocol, RemoteIp, RemoteMachine=MonitoredMachine);
// the remote machines to/from which we have connections
let remoteMachines = remote | summarize by RemoteMachine;
// all augmented connections
(local)
| union (remote)
//Take all outbound records but only inbound records that come from either //unmonitored machines or monitored machines not in the set for which we are computing dependencies.
| where Direction == 'outbound' or (Direction == 'inbound' and RemoteMachine !in (machines))
| summarize by ConnectionId, Direction, Machine, Process, ProcessName, SourceIp, DestinationIp, DestinationPort, Protocol, RemoteIp, RemoteMachine
// identify the remote port
| extend RemotePort=iff(Direction == 'outbound', DestinationPort, 0)
// construct the join key we'll use to find a matching port
| extend JoinKey=strcat_delim(':', RemoteMachine, RemoteIp, RemotePort, Protocol)
// find a matching port
| join kind=leftouter (VMBoundPort 
| where Machine in (remoteMachines) 
| summarize arg_max(TimeGenerated, *) by PortId 
| extend JoinKey=strcat_delim(':', Machine, Ip, Port, Protocol)) on JoinKey
// aggregate the remote information
| summarize Remote=makeset(iff(isempty(RemoteMachine), todynamic('{}'), pack('Machine', RemoteMachine, 'Process', Process1, 'ProcessName', ProcessName1))) by ConnectionId, Direction, Machine, Process, ProcessName, SourceIp, DestinationIp, DestinationPort, Protocol
```








## Next steps

* [Learn how to analyze data in Azure Monitor logs using log queries.](../logs/get-started-queries.md)
* [Learn about alerts using metrics and logs in Azure Monitor.](../alerts/alerts-overview.md)