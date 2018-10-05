---
title: How to Query Logs from Azure Monitor for VMs | Microsoft Docs
description: Azure Monitor for VMs solution forwards metrics and log data to Log Analytics and this article describes the records and includes sample queries. 
services: azure-monitor
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: tysonn

ms.assetid: 
ms.service: azure-monitor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/20/2018
ms.author: magoedte
---

# How to query logs from Azure Monitor for VMs
Azure Monitor for VMs collects performance and connection metrics, computer and process inventory data, and health state information and forwards it to the Log Analytics data store in Azure Monitor.  This data is available for [search](../log-analytics/log-analytics-log-searches.md) in Log Analytics. You can apply this data to scenarios that include migration planning, capacity analysis, discovery, and on-demand performance troubleshooting.

## Map records
One record is generated per hour for each unique computer and process, in addition to the records that are generated when a process or computer starts or is on-boarded to Azure Monitor for VMs Map feature. These records have the properties in the following tables. The fields and values in the ServiceMapComputer_CL events map to fields of the Machine resource in the ServiceMap Azure Resource Manager API. The fields and values in the ServiceMapProcess_CL events map to the fields of the Process resource in the ServiceMap Azure Resource Manager API. The ResourceName_s field matches the name field in the corresponding Resource Manager resource. 

There are internally generated properties you can use to identify unique processes and computers:

- Computer: Use *ResourceId* or *ResourceName_s* to uniquely identify a computer within a Log Analytics workspace.
- Process: Use *ResourceId* to uniquely identify a process within a Log Analytics workspace. *ResourceName_s* is unique within the context of the machine on which the process is running (MachineResourceName_s) 

Because multiple records can exist for a specified process and computer in a specified time range, queries can return more than one record for the same computer or process. To include only the most recent record, add "| dedup ResourceId" to the query.

### Connections
Connection metrics are written to a new table in Log Analytics - VMConnection. This table provides information about the connections for a machine (inbound and outbound). Connection Metrics are also exposed with APIs that provide the means to obtain a specific metric during a time window.  TCP connections resulting from "*accept*-ing on a listening socket are inbound, while those created by *connect*-ing to a given IP and port are outbound. The direction of a connection is represented by the Direction property, which can be set to either **inbound** or **outbound**. 

Records in these tables are generated from data reported by the Dependency agent. Every record represents an observation over a one-minute time interval. The TimeGenerated property indicates the start of the time interval. Each record contains information to identify the respective entity, that is, connection or port, as well as metrics associated with that entity. Currently, only network activity that occurs using TCP over IPv4 is reported.

To manage cost and complexity, connection records do not represent individual physical network connections. Multiple physical network connections are grouped into a logical connection, which is then reflected in the respective table.  Meaning, records in *VMConnection* table represent a logical grouping and not the individual physical connections that are being observed. Physical network connection sharing the same value for the following attributes during a given one-minute interval, are aggregated into a single logical record in *VMConnection*. 

| Property | Description |
|:--|:--|
|Direction |Direction of the connection, value is *inbound* or *outbound* |
|Machine |The computer FQDN |
|Process |Identity of process or groups of processes, initiating/accepting the connection |
|SourceIp |IP address of the source |
|DestinationIp |IP address of the destination |
|DestinationPort |Port number of the destination |
|Protocol |Protocol used for the connection.  Values is *tcp*. |

To account for the impact of grouping, information about the number of grouped physical connections is provided in the following properties of the record:

| Property | Description |
|:--|:--|
|LinksEstablished |The number of physical network connections that have been established during the reporting time window |
|LinksTerminated |The number of physical network connections that have been terminated during the reporting time window |
|LinksFailed |The number of physical network connections that have failed during the reporting time window. This information is currently available only for outbound connections. |
|LinksLive |The number of physical network connections that were open at the end of the reporting time window|

#### Metrics

In addition to connection count metrics, information about the volume of data sent and received on a given logical connection or network port are also included in the following properties of the record:

| Property | Description |
|:--|:--|
|BytesSent |Total number of bytes that have been sent during the reporting time window |
|BytesReceived |Total number of bytes that have been received during the reporting time window |
|Responses |The number of responses observed during the reporting time window. 
|ResponseTimeMax |The largest response time (milliseconds) observed during the reporting time window. If no value, the property is blank.|
|ResponseTimeMin |The smallest response time (milliseconds) observed during the reporting time window. If no value, the property is blank.|
|ResponseTimeSum |The sum of all response times (milliseconds) observed during the reporting time window. If no value, the property is blank.|

The third type of data being reported is response time - how long does a caller spend waiting for a request sent over a connection to be processed and responded to by the remote endpoint. The response time reported is an estimation of the true response time of the underlying application protocol. It is computed using heuristics based on the observation of the flow of data between the source and destination end of a physical network connection. Conceptually, it is the difference between the time the last byte of a request leaves the sender, and the time when the last byte of the response arrives back to it. These two timestamps are used to delineate request and response events on a given physical connection. The difference between them represents the response time of a single request. 

In this first release of this feature, our algorithm is an approximation that may work with varying degree of success depending on the actual application protocol used for a given network connection. For example, the current approach works well for request-response based protocols such as HTTP(S), but does not work with one-way or message queue-based protocols.

Here are some important points to consider:

1. If a process accepts connections on the same IP address but over multiple network interfaces, a separate record for each interface will be reported. 
2. Records with wildcard IP will contain no activity. They are included to represent the fact that a port on the machine is open to inbound traffic.
3. To reduce verbosity and data volume, records with wildcard IP will be omitted when there is a matching record (for the same process, port, and protocol) with a specific IP address. When a wildcard IP record is omitted, the IsWildcardBind record property with the specific IP address, will be set to "True" to indicate that the port is exposed over every interface of the reporting machine.
4. Ports that are bound only on a specific interface have IsWildcardBind set to "False".

#### Naming and Classification
For convenience, the IP address of the remote end of a connection is included in the RemoteIp property. For inbound connections, RemoteIp is the same as SourceIp, while for outbound connections, it is the same as DestinationIp. The RemoteDnsCanonicalNames property represents the DNS canonical names reported by the machine for RemoteIp. The RemoteDnsQuestions and RemoteClassification properties are reserved for future use. 

#### Geolocation
*VMConnection* also includes geolocation information for the remote end of each connection record in the following properties of the record: 

| Property | Description |
|:--|:--|
|RemoteCountry |The name of the country hosting RemoteIp.  For example, *United States* |
|RemoteLatitude |The geolocation latitude. For example, *47.68* |
|RemoteLongitude |The geolocation longitude. For example, *-122.12* |

#### Malicious IP
Every RemoteIp property in *VMConnection* table is checked against a set of IPs with known malicious activity. If the RemoteIp is identified as malicious the following properties will be populated (they are empty, when the IP is not considered malicious) in the following properties of the record:

| Property | Description |
|:--|:--|
|MaliciousIp |The RemoteIp address |
|IndicatorThreadType |Threat indicator detected is one of the following values, *Botnet*, *C2*, *CryptoMining*, *Darknet*, *DDos*, *MaliciousUrl*, *Malware*, *Phishing*, *Proxy*, *PUA*, *Watchlist*.   |
|Description |Description of the observed threat. |
|TLPLevel |Traffic Light Protocol (TLP) Level is one of the defined values, *White*, *Green*, *Amber*, *Red*. |
|Confidence |Values are *0 – 100*. |
|Severity |Values are *0 – 5*, where *5* is the most severe and *0* is not severe at all. Default value is *3*.  |
|FirstReportedDateTime |The first time the provider reported the indicator. |
|LastReportedDateTime |The last time the indicator was seen by Interflow. |
|IsActive |Indicates indicators are deactivated with *True* or *False* value. |
|ReportReferenceLink |Links to reports related to a given observable. |
|AdditionalInformation |Provides additional information, if applicable, about the observed threat. |

### ServiceMapComputer_CL records
Records with a type of *ServiceMapComputer_CL* have inventory data for servers with the Dependency agent. These records have the properties in the following table:

| Property | Description |
|:--|:--|
| Type | *ServiceMapComputer_CL* |
| SourceSystem | *OpsManager* |
| ResourceId | The unique identifier for a machine within the workspace |
| ResourceName_s | The unique identifier for a machine within the workspace |
| ComputerName_s | The computer FQDN |
| Ipv4Addresses_s | A list of the server's IPv4 addresses |
| Ipv6Addresses_s | A list of the server's IPv6 addresses |
| DnsNames_s | An array of DNS names |
| OperatingSystemFamily_s | Windows or Linux |
| OperatingSystemFullName_s | The full name of the operating system  |
| Bitness_s | The bitness of the machine (32-bit or 64-bit)  |
| PhysicalMemory_d | The physical memory in MB |
| Cpus_d | The number of CPUs |
| CpuSpeed_d | The CPU speed in MHz|
| VirtualizationState_s | *unknown*, *physical*, *virtual*, *hypervisor* |
| VirtualMachineType_s | *hyperv*, *vmware*, and so on |
| VirtualMachineNativeMachineId_g | The VM ID as assigned by its hypervisor |
| VirtualMachineName_s | The name of the VM |
| BootTime_t | The boot time |

### ServiceMapProcess_CL Type records
Records with a type of *ServiceMapProcess_CL* have inventory data for TCP-connected processes on servers with the Dependency agent. These records have the properties in the following table:

| Property | Description |
|:--|:--|
| Type | *ServiceMapProcess_CL* |
| SourceSystem | *OpsManager* |
| ResourceId | The unique identifier for a process within the workspace |
| ResourceName_s | The unique identifier for a process within the machine on which it is running|
| MachineResourceName_s | The resource name of the machine |
| ExecutableName_s | The name of the process executable |
| StartTime_t | The process pool start time |
| FirstPid_d | The first PID in the process pool |
| Description_s | The process description |
| CompanyName_s | The name of the company |
| InternalName_s | The internal name |
| ProductName_s | The name of the product |
| ProductVersion_s | The product version |
| FileVersion_s | The file version |
| CommandLine_s | The command line |
| ExecutablePath _s | The path to the executable file |
| WorkingDirectory_s | The working directory |
| UserName | The account under which the process is executing |
| UserDomain | The domain under which the process is executing |

## Sample log searches

### List all known machines
`ServiceMapComputer_CL | summarize arg_max(TimeGenerated, *) by ResourceId`

### List the physical memory capacity of all managed computers.
`ServiceMapComputer_CL | summarize arg_max(TimeGenerated, *) by ResourceId | project PhysicalMemory_d, ComputerName_s`

### List computer name, DNS, IP, and OS.
`ServiceMapComputer_CL | summarize arg_max(TimeGenerated, *) by ResourceId | project ComputerName_s, OperatingSystemFullName_s, DnsNames_s, Ipv4Addresses_s`

### Find all processes with "sql" in the command line
`ServiceMapProcess_CL | where CommandLine_s contains_cs "sql" | summarize arg_max(TimeGenerated, *) by ResourceId`

### Find a machine (most recent record) by resource name
`search in (ServiceMapComputer_CL) "m-4b9c93f9-bc37-46df-b43c-899ba829e07b" | summarize arg_max(TimeGenerated, *) by ResourceId`

### Find a machine (most recent record) by IP address
`search in (ServiceMapComputer_CL) "10.229.243.232" | summarize arg_max(TimeGenerated, *) by ResourceId`

### List all known processes on a specified machine
`ServiceMapProcess_CL | where MachineResourceName_s == "m-559dbcd8-3130-454d-8d1d-f624e57961bc" | summarize arg_max(TimeGenerated, *) by ResourceId`

### List all computers running SQL
`ServiceMapComputer_CL | where ResourceName_s in ((search in (ServiceMapProcess_CL) "\*sql\*" | distinct MachineResourceName_s)) | distinct ComputerName_s`

### List all unique product versions of curl in my datacenter
`ServiceMapProcess_CL | where ExecutableName_s == "curl" | distinct ProductVersion_s`

### Create a computer group of all computers running CentOS
`ServiceMapComputer_CL | where OperatingSystemFullName_s contains_cs "CentOS" | distinct ComputerName_s`

### Summarize the outbound connections from a group of machines
```
// the machines of interest
let machines = datatable(m: string) ["m-82412a7a-6a32-45a9-a8d6-538354224a25"];
// map of ip to monitored machine in the environment
let ips=materialize(ServiceMapComputer_CL
| summarize ips=makeset(todynamic(Ipv4Addresses_s)) by MonitoredMachine=ResourceName_s
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
* If you are new to writing queries in Log Analytics, review [how to use the Log Analytics page](../log-analytics/query-language/get-started-analytics-portal.md) in the Azure portal to write Log Analytics queries.
* Learn about [writing search queries](../log-analytics/query-language/search-queries.md).