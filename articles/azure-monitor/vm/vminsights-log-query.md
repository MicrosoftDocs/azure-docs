---
title: How to Query Logs from VM insights
description: VM insights solution collects metrics and log data to and this article describes the records and includes sample queries.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 09/28/2023
---

# How to query logs from VM insights

VM insights collects performance and connection metrics, computer and process inventory data, and health state information and forwards it to the Log Analytics workspace in Azure Monitor.  This data is available for [query](../logs/log-query-overview.md) in Azure Monitor. You can apply this data to scenarios that include migration planning, capacity analysis, discovery, and on-demand performance troubleshooting.

## Map records

> [!IMPORTANT]
> If your virtual machine is using VM insights with Azure Monitor agent, then you must have [processes and dependencies enabled](vminsights-enable-portal.md#enable-vm-insights-for-azure-monitor-agent) for these tables to be created.

One record is generated per hour for each unique computer and process, in addition to the records that are generated when a process or computer starts or is added to VM insights. The fields and values in the VMComputer table map to fields of the Machine resource in the ServiceMap Azure Resource Manager API. The fields and values in the VMProcess table map to the fields of the Process resource in the ServiceMap Azure Resource Manager API. The _ResourceId field matches the name field in the corresponding Resource Manager resource. 

There are internally generated properties you can use to identify unique processes and computers:

- Computer: Use *_ResourceId* to uniquely identify a computer within a Log Analytics workspace.
- Process: Use *_ResourceId* to uniquely identify a process within a Log Analytics workspace.

Because multiple records can exist for a specified process and computer in a specified time range, queries can return more than one record for the same computer or process. To include only the most recent record, add `| summarize arg_max(TimeGenerated, *) by ResourceId` to the query.

### Connections and ports

The Connection Metrics feature introduces two new tables in Azure Monitor logs - VMConnection and VMBoundPort. These tables provide information about the connections for a machine (inbound and outbound) and the server ports that are open/active on them. ConnectionMetrics are also exposed via APIs that provide the means to obtain a specific metric during a time window. TCP connections resulting from *accepting* on a listening socket are inbound, while those created by *connecting* to a given IP and port are outbound. The direction of a connection is represented by the Direction property, which can be set to either **inbound** or **outbound**. 

Records in these tables are generated from data reported by the Dependency Agent. Every record represents an observation over a 1-minute time interval. The TimeGenerated property indicates the start of the time interval. Each record contains information to identify the respective entity, that is, connection or port, as well as metrics associated with that entity. Currently, only network activity that occurs using TCP over IPv4 is reported. 

#### Common fields and conventions 

The following fields and conventions apply to both VMConnection and VMBoundPort: 

- Computer: Fully-qualified domain name of reporting machine 
- AgentId: The unique identifier for a machine with the Log Analytics agent  
- Machine: Name of the Azure Resource Manager resource for the machine exposed by ServiceMap. It's of the form *m-{GUID}*, where *GUID* is the same GUID as AgentId  
- Process: Name of the Azure Resource Manager resource for the process exposed by ServiceMap. It's of the form *p-{hex string}*. Process is unique within a machine scope and to generate a unique process ID across machines, combine Machine and Process fields. 
- ProcessName: Executable name of the reporting process.
- All IP addresses are strings in IPv4 canonical format, for example *13.107.3.160* 

To manage cost and complexity, connection records don't represent individual physical network connections. Multiple physical network connections are grouped into a logical connection, which is then reflected in the respective table.  Meaning, records in *VMConnection* table represent a logical grouping and not the individual physical connections that are being observed. Physical network connection sharing the same value for the following attributes during a given one-minute interval, are aggregated into a single logical record in *VMConnection*. 

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

The third type of data being reported is response time - how long does a caller spend waiting for a request sent over a connection to be processed and responded to by the remote endpoint. The response time reported is an estimation of the true response time of the underlying application protocol. It's computed using heuristics based on the observation of the flow of data between the source and destination end of a physical network connection. Conceptually, it's the difference between the time the last byte of a request leaves the sender, and the time when the last byte of the response arrives back to it. These two timestamps are used to delineate request and response events on a given physical connection. The difference between them represents the response time of a single request. 

In this first release of this feature, our algorithm is an approximation that may work with varying degree of success depending on the actual application protocol used for a given network connection. For example, the current approach works well for request-response based protocols such as HTTP(S), but doesn't work with one-way or message queue-based protocols.

Here are some important points to consider:

1. If a process accepts connections on the same IP address but over multiple network interfaces, a separate record for each interface will be reported. 
2. Records with wildcard IP will contain no activity. They're included to represent the fact that a port on the machine is open to inbound traffic.
3. To reduce verbosity and data volume, records with wildcard IP will be omitted when there's a matching record (for the same process, port, and protocol) with a specific IP address. When a wildcard IP record is omitted, the IsWildcardBind record property with the specific IP address, will be set to "True" to indicate that the port is exposed over every interface of the reporting machine.
4. Ports that are bound only on a specific interface have IsWildcardBind set to *False*.

#### Naming and Classification

For convenience, the IP address of the remote end of a connection is included in the RemoteIp property. For inbound connections, RemoteIp is the same as SourceIp, while for outbound connections, it's the same as DestinationIp. The RemoteDnsCanonicalNames property represents the DNS canonical names reported by the machine for RemoteIp. The RemoteDnsQuestions property represents the DNS questions reported by the machine for RemoteIp. The RemoveClassification property is reserved for future use. 

#### Geolocation

*VMConnection* also includes geolocation information for the remote end of each connection record in the following properties of the record: 

| Property | Description |
|:--|:--|
|RemoteCountry |The name of the country/region hosting RemoteIp.  For example, *United States* |
|RemoteLatitude |The geolocation latitude. For example, *47.68* |
|RemoteLongitude |The geolocation longitude. For example, *-122.12* |

#### Malicious IP

Every RemoteIp property in *VMConnection* table is checked against a set of IPs with known malicious activity. If the RemoteIp is identified as malicious the following properties will be populated (they're empty, when the IP isn't considered malicious) in the following properties of the record:

| Property | Description |
|:--|:--|
|MaliciousIp |The RemoteIp address |
|IndicatorThreadType |Threat indicator detected is one of the following values, *Botnet*, *C2*, *CryptoMining*, *Darknet*, *DDos*, *MaliciousUrl*, *Malware*, *Phishing*, *Proxy*, *PUA*, *Watchlist*.   |
|Description |Description of the observed threat. |
|TLPLevel |Traffic Light Protocol (TLP) Level is one of the defined values, *White*, *Green*, *Amber*, *Red*. |
|Confidence |Values are *0 – 100*. |
|Severity |Values are *0 – 5*, where *5* is the most severe and *0* isn't severe at all. Default value is *3*.  |
|FirstReportedDateTime |The first time the provider reported the indicator. |
|LastReportedDateTime |The last time the indicator was seen by Interflow. |
|IsActive |Indicates indicators are deactivated with *True* or *False* value. |
|ReportReferenceLink |Links to reports related to a given observable. |
|AdditionalInformation |Provides additional information, if applicable, about the observed threat. |

### Ports 

Ports on a machine that actively accept incoming traffic or could potentially accept traffic, but are idle during the reporting time window, are written to the VMBoundPort table.  

Every record in VMBoundPort is identified by the following fields: 

| Property | Description |
|:--|:--|
|Process | Identity of process (or groups of processes) with which the port is associated with.|
|Ip | Port IP address (can be wildcard IP, *0.0.0.0*) |
|Port |The Port number |
|Protocol | The protocol.  Example, *tcp* or *udp* (only *tcp* is currently supported).|

The identity a port is derived from the above five fields and is stored in the PortId  property. This property can be used to quickly find records for a specific port across time. 

#### Metrics 

Port records include metrics representing the connections associated with them. Currently, the following metrics are reported (the details for each metric are described in the previous section): 

- BytesSent and BytesReceived 
- LinksEstablished, LinksTerminated, LinksLive 
- ResposeTime, ResponseTimeMin, ResponseTimeMax, ResponseTimeSum 

Here are some important points to consider:

- If a process accepts connections on the same IP address but over multiple network interfaces, a separate record for each interface will be reported.  
- Records with wildcard IP will contain no activity. They're included to represent the fact that a port on the machine is open to inbound traffic. 
- To reduce verbosity and data volume, records with wildcard IP will be omitted when there's a matching record (for the same process, port, and protocol) with a specific IP address. When a wildcard IP record is omitted, the *IsWildcardBind* property for the record with the specific IP address, will be set to *True*.  This indicates the port is exposed over every interface of the reporting machine. 
- Ports that are bound only on a specific interface have IsWildcardBind set to *False*. 

### VMComputer records

Records with a type of *VMComputer* have inventory data for servers with the Dependency agent. These records have the properties in the following table:

| Property | Description |
|:--|:--|
|TenantId | The unique identifier for the workspace |
|SourceSystem | *Insights* | 
|TimeGenerated | Timestamp of the record (UTC) |
|Computer | The computer FQDN | 
|AgentId | The unique ID of the Log Analytics agent |
|Machine | Name of the Azure Resource Manager resource for the machine exposed by ServiceMap. It's of the form *m-{GUID}*, where *GUID* is the same GUID as AgentId. | 
|DisplayName | Display name | 
|FullDisplayName | Full display name | 
|HostName | The name of machine without domain name |
|BootTime | The machine boot time (UTC) |
|TimeZone | The normalized time zone |
|VirtualizationState | *virtual*, *hypervisor*, *physical* |
|Ipv4Addresses | Array of IPv4 addresses | 
|Ipv4SubnetMasks | Array of IPv4 subnet masks (in the same order as Ipv4Addresses). |
|Ipv4DefaultGateways | Array of IPv4 gateways | 
|Ipv6Addresses | Array of IPv6 addresses | 
|MacAddresses | Array of MAC addresses | 
|DnsNames | Array of DNS names associated with the machine. |
|DependencyAgentVersion | The version of the Dependency agent running on the machine. | 
|OperatingSystemFamily | *Linux*, *Windows* |
|OperatingSystemFullName | The full name of the operating system | 
|PhysicalMemoryMB | The physical memory in megabytes | 
|Cpus | The number of processors | 
|CpuSpeed | The CPU speed in MHz | 
|VirtualMachineType | *hyperv*, *vmware*, *xen* |
|VirtualMachineNativeId | The VM ID as assigned by its hypervisor | 
|VirtualMachineNativeName | The name of the VM |
|VirtualMachineHypervisorId | The unique identifier of the hypervisor hosting the VM |
|HypervisorType | *hyperv* |
|HypervisorId | The unique ID of the hypervisor | 
|HostingProvider | *azure* |
|_ResourceId | The unique identifier for an Azure resource |
|AzureSubscriptionId | A globally unique identifier that identifies your subscription | 
|AzureResourceGroup | The name of the Azure resource group the machine is a member of. |
|AzureResourceName | The name of the Azure resource |
|AzureLocation | The location of the Azure resource |
|AzureUpdateDomain | The name of the Azure update domain |
|AzureFaultDomain | The name of the Azure fault domain |
|AzureVmId | The unique identifier of the Azure virtual machine |
|AzureSize | The size of the Azure VM |
|AzureImagePublisher | The name of the Azure VM publisher |
|AzureImageOffering | The name of the Azure VM offer type | 
|AzureImageSku | The SKU of the Azure VM image | 
|AzureImageVersion | The version of the Azure VM image | 
|AzureCloudServiceName | The name of the Azure cloud service |
|AzureCloudServiceDeployment | Deployment ID for the Cloud Service |
|AzureCloudServiceRoleName | Cloud Service role name |
|AzureCloudServiceRoleType | Cloud Service role type: *worker* or *web* |
|AzureCloudServiceInstanceId | Cloud Service role instance ID |
|AzureVmScaleSetName | The name of the virtual machine scale set |
|AzureVmScaleSetDeployment | Virtual machine scale set deployment ID |
|AzureVmScaleSetResourceId | The unique identifier of the virtual machine scale set resource.|
|AzureVmScaleSetInstanceId | The unique identifier of the virtual machine scale set |
|AzureServiceFabricClusterId | The unique identifer of the Azure Service Fabric cluster | 
|AzureServiceFabricClusterName | The name of the Azure Service Fabric cluster |

### VMProcess records

Records with a type of *VMProcess* have inventory data for TCP-connected processes on servers with the Dependency agent. These records have the properties in the following table:

| Property | Description |
|:--|:--|
|TenantId | The unique identifier for the workspace |
|SourceSystem | *Insights* | 
|TimeGenerated | Timestamp of the record (UTC) |
|Computer | The computer FQDN | 
|AgentId | The unique ID of the Log Analytics agent |
|Machine | Name of the Azure Resource Manager resource for the machine exposed by ServiceMap. It's of the form *m-{GUID}*, where *GUID* is  the same GUID as AgentId. | 
|Process | The unique identifier of the Service Map process. It's in the form of *p-{GUID}*. 
|ExecutableName | The name of the process executable | 
|DisplayName | Process display name |
|Role | Process role: *webserver*, *appServer*, *databaseServer*, *ldapServer*, *smbServer* |
|Group | Process group name. Processes in the same group are logically related, e.g., part of the same product or system component. |
|StartTime | The process pool start time |
|FirstPid | The first PID in the process pool |
|Description | The process description |
|CompanyName | The name of the company |
|InternalName | The internal name |
|ProductName | The name of the product |
|ProductVersion | The version of the product |
|FileVersion | The version of the file |
|ExecutablePath |The path of the executable |
|CommandLine | The command line |
|WorkingDirectory | The working directory |
|Services | An array of services under which the process is executing |
|UserName | The account under which the process is executing |
|UserDomain | The domain under which the process is executing |
|_ResourceId | The unique identifier for a process within the workspace |


## Sample map queries

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

## Performance records
Records with a type of *InsightsMetrics* have performance data from the guest operating system of the virtual machine. These records are collected at 60 second intervals and have the properties in the following table:



| Property | Description |
|:--|:--|
|TenantId | Unique identifier for the workspace |
|SourceSystem | *Insights* | 
|TimeGenerated | Time the value was collected (UTC) |
|Computer | The computer FQDN | 
|Origin | *vm.azm.ms* |
|Namespace | Category of the performance counter | 
|Name | Name of the performance counter |
|Val | Collected value | 
|Tags | Related details about the record. See the table below for tags used with different record types.  |
|AgentId | Unique identifier for each computer's agent |
|Type | *InsightsMetrics* |
|_ResourceId_ | Resource ID of the virtual machine |

The performance counters currently collected into the *InsightsMetrics* table are listed in the following table:

| Namespace | Name | Description | Unit | Tags |
|:---|:---|:---|:---|:---|
| Computer    | Heartbeat             | Computer Heartbeat                        | | |
| Memory      | AvailableMB           | Memory Available Bytes                    | Megabytes      | memorySizeMB - Total memory size|
| Network     | WriteBytesPerSecond   | Network Write Bytes Per Second            | BytesPerSecond | NetworkDeviceId - ID of the device<br>bytes - Total sent bytes |
| Network     | ReadBytesPerSecond    | Network Read Bytes Per Second             | BytesPerSecond | networkDeviceId - ID of the device<br>bytes - Total received bytes |
| Processor   | UtilizationPercentage | Processor Utilization Percentage          | Percent        | totalCpus - Total CPUs |
| LogicalDisk | WritesPerSecond       | Logical Disk Writes Per Second            | CountPerSecond | mountId - Mount ID of the device |
| LogicalDisk | WriteLatencyMs        | Logical Disk Write Latency Millisecond    | MilliSeconds   | mountId - Mount ID of the device |
| LogicalDisk | WriteBytesPerSecond   | Logical Disk Write Bytes Per Second       | BytesPerSecond | mountId - Mount ID of the device |
| LogicalDisk | TransfersPerSecond    | Logical Disk Transfers Per Second         | CountPerSecond | mountId - Mount ID of the device |
| LogicalDisk | TransferLatencyMs     | Logical Disk Transfer Latency Millisecond | MilliSeconds   | mountId - Mount ID of the device |
| LogicalDisk | ReadsPerSecond        | Logical Disk Reads Per Second             | CountPerSecond | mountId - Mount ID of the device |
| LogicalDisk | ReadLatencyMs         | Logical Disk Read Latency Millisecond     | MilliSeconds   | mountId - Mount ID of the device |
| LogicalDisk | ReadBytesPerSecond    | Logical Disk Read Bytes Per Second        | BytesPerSecond | mountId - Mount ID of the device |
| LogicalDisk | FreeSpacePercentage   | Logical Disk Free Space Percentage        | Percent        | mountId - Mount ID of the device |
| LogicalDisk | FreeSpaceMB           | Logical Disk Free Space Bytes             | Megabytes      | mountId - Mount ID of the device<br>diskSizeMB - Total disk size |
| LogicalDisk | BytesPerSecond        | Logical Disk Bytes Per Second             | BytesPerSecond | mountId - Mount ID of the device |





## Next steps

* If you're new to writing log queries in Azure Monitor, review [how to use Log Analytics](../logs/log-analytics-tutorial.md) in the Azure portal to write log queries.

* Learn about [writing search queries](../logs/get-started-queries.md).


