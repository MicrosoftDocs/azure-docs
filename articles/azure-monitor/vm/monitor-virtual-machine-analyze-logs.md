---
title: Monitor Azure virtual machines with Azure Monitor
description: Describes how to collect and analyze monitoring data from virtual machines in Azure using Azure Monitor.
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 05/05/2020

---

# Monitoring virtual machines with Azure Monitor - Log queries



## Tables
The following table lists the tables in the Log Analytics workspace with data related to virtual machines and their guest workloads. 

| Table | Description | Source|
|:---|:---|:---|
| [ActivityLog](/azure/azure-monitor/reference/tables/activitylog) | Configuration changes and history of when each virtual machine is stopped and started. | Activity Log |
| [InsightsMetrics](/azure/azure-monitor/reference/tables/insightsmetrics) | Performance data collected from guest operating system. | VM insights |
| [Perf](/azure/azure-monitor/reference/tables/insightsmetrics) | Performance data collected from guest operating system and applications. | Workspace |
| [Syslog](/azure/azure-monitor/reference/tables/syslog) | Linux events created on guest operating system. | Workspace |
| [VMBoundPort](/azure/azure-monitor/reference/tables/vmboundport) | Traffic for open server ports on the monitored machine. | VM Insights |
| [VMComputer](/azure/azure-monitor/reference/tables/vmcomputer) | Inventory data for servers collected by the Service Map and VM Insights solutions using the Dependency agent and Log analytics agent. | VM insights |
| [VMConnection](/azure/azure-monitor/reference/tables/vmconnection) | Traffic for inbound and outbound connections to and from monitored computers. | VM insights |
| [VMProcess](/azure/azure-monitor/reference/tables/vmprocess) | Process data for servers collected by the Service Map and VM Insights solutions using the Dependency agent and Log analytics agent. | VM insights |


> [!NOTE]
> Performance data collected by the Log Analytics agent writes to the *Perf* table while VM insights will collect it to the *InsightsMetrics* table. This is the same data, but the tables have a different structure. If you have existing queries based on *Perf*, the will need to be rewritten to use *InsightsMetrics*.


## Heartbeat

| Table | Description |
|:---|:---|
| [Heartbeat](/azure/azure-monitor/reference/tables/heartbeat) | Rows logged by Log Analytics agents once per minute to report on agent health. | 

## Performance data

| Table | Description | Source|
|:---|:---|:---|
| [InsightsMetrics](/azure/azure-monitor/reference/tables/insightsmetrics) | Performance data collected from guest operating system. | VM insights |




## Processes and dependencies
These tables are collected by VM insights and analyzed by the Map feature.
### Tables

| Table | Description | Source|
|:---|:---|:---|
| [VMBoundPort](/azure/azure-monitor/reference/tables/vmboundport) | Traffic for open server ports on the monitored machine. | VM Insights |
| [VMComputer](/azure/azure-monitor/reference/tables/vmcomputer) | Inventory data for servers collected by the Service Map and VM Insights solutions using the Dependency agent and Log analytics agent. | VM insights |
| [VMConnection](/azure/azure-monitor/reference/tables/vmconnection) | Traffic for inbound and outbound connections to and from monitored computers. | VM insights |
| [VMProcess](/azure/azure-monitor/reference/tables/vmprocess) | Process data for servers collected by the Service Map and VM Insights solutions using the Dependency agent and Log analytics agent. | VM insights |


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



## Configuration changes

### Tables

| Table | Description | Source|
|:---|:---|:---|
| [ConfigurationChange](/azure/azure-monitor/reference/tables/configurationdata) | View changes to in-guest configuration data such as Files Software Registry Keys Windows services and Linux daemons. | Change Tracking solution |
| [ConfigurationData](/azure/azure-monitor/reference/tables/configurationdata) | View the last reported state for in-guest configuration data such as Files Software Registry Keys Windows services and Linux daemons. | Change Tracking solution |


## Next steps

* [Learn how to analyze data in Azure Monitor logs using log queries.](../logs/get-started-queries.md)
* [Learn about alerts using metrics and logs in Azure Monitor.](../alerts/alerts-overview.md)