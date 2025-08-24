---
title: Use Queries in Traffic Analytics
titleSuffix: Azure Network Watcher
description: Explore sample KQL queries for Azure Traffic Analytics to identify top talkers, analyze traffic flows, and monitor security scenarios effectively.
author: halkazwini
ms.author: halkazwini
ms.service: azure-network-watcher
ms.topic: how-to
ms.date: 08/20/2025
zone_pivot_groups: flow-log-types

#CustomerIntent: As a traffic analytics user, I want to learn how to use queries so I can easily query traffic analytics.
---

# Use queries in traffic analytics

This article provides sample Kusto Query Language (KQL) queries to help you analyze traffic analytics data effectively. Traffic analytics processes virtual network (VNet) flow logs and network security group (NSG) flow logs to provide detailed insights into network traffic patterns, security events, and performance metrics.

Use these queries to:

- Identify network traffic patterns and top communicating endpoints
- Monitor security events and analyze potential threats
- Troubleshoot network connectivity issues
- Optimize network performance and resource utilization

## Prerequisites

- Traffic analytics configured for your flow logs. For more information, see [Enable or disable traffic analytics](/azure/network-watcher/vnet-flow-logs-manage?tabs=portal#enable-or-disable-traffic-analytics).
- Access to the Log Analytics workspace where your flow log data is stored. For more information, see [Log Analytics workspace overview](/azure/azure-monitor/logs/log-analytics-workspace-overview).

::: zone pivot="virtual-network"

## NTANetAnalytics queries

This section provides sample queries for the **NTANetAnalytics** table that you can use to analyze your Virtual Network traffic analytics data. The NTANetAnalytics table contains aggregated flow log data with enhanced network analytics information. For more information about the table schema and available fields, see [NTANetAnalytics](/azure/azure-monitor/reference/tables/ntanetanalytics).


### List subnets interacting with public IPs

Use the following query to list all subnets interacting with non-Azure public IPs in the last 30 days.

```kusto
NTANetAnalytics
| where SubType == "FlowLog" and FlowStartTime > ago(30d) and FlowType == "ExternalPublic"
| project SrcSubnet, DestSubnet
```

### List subnets interacting with each other

Use the following query to list all subnets that exchanged traffic with each other over the past 30 days and the total bytes exchanged.

```kusto
NTANetAnalytics
| where SubType == 'FlowLog' and FaSchemaVersion == '3' and TimeGenerated > ago(30d)
| where isnotempty(SrcSubnet) and isnotempty(DestSubnet)
| summarize TotalBytes=sum(BytesSrcToDest + BytesDestToSrc) by SrcSubnet, DestSubnet,L4Protocol,DestPort
```

### View cross regional traffic

Use the following query to view intra-regional and inter-regional traffic over the past 30 days.

```kusto
NTANetAnalytics
| where TimeGenerated > ago(30d)
| project SrcRegion, DestRegion, BytesDestToSrc, BytesSrcToDest
| where isnotempty(SrcRegion) and isnotempty(DestRegion)
| summarize TransferredBytes=sum(BytesDestToSrc+BytesSrcToDest) by SrcRegion, DestRegion
```

### View traffic based on subscription

Use the following query to view Azure traffic grouped by subscriptions over the past 30 days.

```kusto
NTANetAnalytics
| where TimeGenerated > ago(30d)
| project SrcSubscription, DestSubscription, BytesDestToSrc, BytesSrcToDest
| where isnotempty(SrcSubscription) and isnotempty(DestSubscription)
| summarize TransferredBytes=sum(BytesDestToSrc+BytesSrcToDest) by SrcSubscription, DestSubscription
```

### List virtual machines receiving most on-premises traffic

Use the following query to check which virtual machines are receiving most on-premises traffic.

```kusto
NTANetAnalytics 
| where SubType == "FlowLog" and FlowType == "S2S"  
| where <Scoping condition> 
| mvexpand vm = pack_array(SrcVm, DestVm) to typeof(string) 
| where isnotempty(vm)  
| extend traffic = AllowedInFlows + DeniedInFlows + AllowedOutFlows + DeniedOutFlows // For bytes use: | extend traffic = InboundBytes + OutboundBytes
| make-series TotalTraffic = sum(traffic) default = 0 on FlowStartTime from datetime(<time>) to datetime(<time>) step 1m by vm 
| render timechart
```

### List IPs receiving most on-premises traffic

Use the following query to check which IPs are receiving most on-premises traffic.

```kusto
NTANetAnalytics 
| where SubType == "FlowLog" and FlowType == "S2S"  
| where <Scoping condition> 
| mvexpand vm = pack_array(SrcIp, DestIp) to typeof(string) 
| where isnotempty(vm)  
| extend traffic = AllowedInFlows + DeniedInFlows + AllowedOutFlows + DeniedOutFlows // For bytes use: | extend traffic = InboundBytes + OutboundBytes
| make-series TotalTraffic = sum(traffic) default = 0 on FlowStartTime from datetime(<time>) to datetime(<time>) step 1m by vm 
| render timechart
```

### List IPs sending or receiving traffic to or from a virtual machine

Use the following query to list all IPs that exchanged data with a virtual machine using its IP address over the past 30 days.

```kusto
NTANetAnalytics
| where TimeGenerated > ago(30d)
| where SrcIp == "10.1.1.8" and strlen(DestIp)>0
| summarize TotalBytes=sum(BytesDestToSrc+BytesSrcToDest) by SrcIp, DestIp
```

### View ExpressRoute traffic

Use the following query to view traffic over ExpressRoute connections in the past 30 days.

```kusto
NTANetAnalytics
| where SubType == 'FlowLog' and TimeGenerated > ago(30d)
| where isnotnull(SrcExpressRouteCircuit) or isnotnull(DestExpressRouteCircuit)
| extend TargetResourceName = tostring(split(TargetResourceId, "/")[2])
| summarize TotalBytes=sum(BytesSrcToDest + BytesDestToSrc) by TargetResourceName, bin(TimeGenerated, 1d)
| render columnchart
```

### View load balancer traffic distribution

Use the following query to view the traffic distribution of your application that has a load balancer in front of it.

```kusto
NTANetAnalytics
| where SubType == 'FlowLog' and TimeGenerated > ago(30d)
| where SrcLoadBalancer contains 'web' or DestLoadBalancer contains 'web'
| summarize TotalBytes = sum(BytesSrcToDest + BytesDestToSrc) by tostring(SrcIp)
| render piechart
```

### Check standard deviation in traffic received by virtual machines

Use the following query to check standard deviation in traffic received by virtual machines from on-premises machines.

```kusto
NTANetAnalytics 
| where SubType == "FlowLog" and FlowType == "S2S"  
| where <Scoping condition> 
| mvexpand vm = pack_array(SrcVm, DestVm) to typeof(string) 
| where isnotempty(vm)  
| extend traffic = AllowedInFlows + DeniedInFlows + AllowedOutFlows + DeniedOutFlows // For bytes use: | extend traffic = InboundBytes + OutboundBytes
summarize deviation = stdev(traffic) by vm
```

### Check standard deviation in traffic received by IPs

Use the following query to check standard deviation in traffic received by IPs from on-premises machines.

```kusto
NTANetAnalytics 
| where SubType == "FlowLog" and FlowType == "S2S"  
| where <Scoping condition> 
| mvexpand vm = pack_array(SrcIp, DestIp) to typeof(string) 
| where isnotempty(vm)  
| extend traffic = AllowedInFlows + DeniedInFlows + AllowedOutFlows + DeniedOutFlows // For bytes use: | extend traffic = InboundBytes + OutboundBytes
| summarize deviation = stdev(traffic) by IP
```

## NTAIpDetails queries

This section provides sample queries for the **NTAIpDetails** table that you can use to analyze IP-specific information in your traffic analytics data. For more information, see [NTAIpDetails](/azure/azure-monitor/reference/tables/ntaipdetails).

### View flow types and public IP locations

Use the following query to learn about the flow types and the location of public IPs in your traffic analytics data.

```kusto
NTAIpDetails
| distinct FlowType, PublicIpDetails, Location
```

### View malicious flow types

Use the following query to view the thread types in malicious flows.

```kusto
NTAIpDetails
| where TimeGenerated > ago(30d)
| where FlowType == "MaliciousFlow"
| summarize count() by ThreatType
| render piechart
```


::: zone-end

::: zone pivot="network-security-group"

## AzureNetworkAnalytics_CL queries

This section provides sample queries for the **AzureNetworkAnalytics_CL queries** table that you can use to analyze your traffic analytics NSG flow logs data.

### List all subnets interacting with public IPs

Use the following query to list all subnets interacting with non-Azure public IPs in the last 30 days.

```kusto
AzureNetworkAnalytics_CL
| where SubType_s == "FlowLog" and FlowStartTime_t >= ago(30d) and FlowType_s == "ExternalPublic"
| project Subnet1_s, Subnet2_s  
```

### View blob path for flows interacting with public IPs

Use the following query to view the blob path for the flows in the previous query.

```kusto
let TableWithBlobId =
(AzureNetworkAnalytics_CL
   | where SubType_s == "Topology" and ResourceType == "NetworkSecurityGroup" and DiscoveryRegion_s == Region_s and IsFlowEnabled_b
   | extend binTime = bin(TimeProcessed_t, 6h),
            nsgId = strcat(Subscription_g, "/", Name_s),
            saNameSplit = split(FlowLogStorageAccount_s, "/")
   | extend saName = iif(arraylength(saNameSplit) == 3, saNameSplit[2], '')
   | distinct nsgId, saName, binTime)
| join kind = rightouter (
   AzureNetworkAnalytics_CL
   | where SubType_s == "FlowLog"  
   | extend binTime = bin(FlowEndTime_t, 6h)
) on binTime, $left.nsgId == $right.NSGList_s  
| extend blobTime = format_datetime(todatetime(FlowIntervalStartTime_t), "yyyy MM dd hh")
| extend nsgComponents = split(toupper(NSGList_s), "/"), dateTimeComponents = split(blobTime, " ")
| extend BlobPath = strcat("https://", saName,
                        "@insights-logs-networksecuritygroupflowevent/resoureId=/SUBSCRIPTIONS/", nsgComponents[0],
                        "/RESOURCEGROUPS/", nsgComponents[1],
                        "/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/", nsgComponents[2],
                        "/y=", dateTimeComponents[0], "/m=", dateTimeComponents[1], "/d=", dateTimeComponents[2], "/h=", dateTimeComponents[3],
                        "/m=00/macAddress=", replace(@"-", "", MACAddress_s),
                        "/PT1H.json")
| project-away nsgId, saName, binTime, blobTime, nsgComponents, dateTimeComponents;

TableWithBlobId
| where SubType_s == "FlowLog" and FlowStartTime_t >= ago(30d) and FlowType_s == "ExternalPublic"
| project Subnet_s , BlobPath
```

The previous query constructs a URL to access the blob directly as follows:

```url
https://{storageAccountName}@insights-logs-networksecuritygroupflowevent/resoureId=/SUBSCRIPTIONS/{subscriptionId}/RESOURCEGROUPS/{resourceGroup}/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/{networkSecurityGroupName}/y={year}/m={month}/d={day}/h={hour}/m=00/macAddress={macAddress}/PT1H.json
```

### List virtual machines receiving most on-premises traffic

Use the following query to check which virtual machines are receiving most on-premises traffic.

```kusto
AzureNetworkAnalytics_CL
| where SubType_s == "FlowLog" and FlowType_s == "S2S" 
| where <Scoping condition>
| mvexpand vm = pack_array(VM1_s, VM2_s) to typeof(string)
| where isnotempty(vm) 
| extend traffic = AllowedInFlows_d + DeniedInFlows_d + AllowedOutFlows_d + DeniedOutFlows_d // For bytes use: | extend traffic = InboundBytes_d + OutboundBytes_d 
| make-series TotalTraffic = sum(traffic) default = 0 on FlowStartTime_t from datetime(<time>) to datetime(<time>) step 1 m by vm
| render timechart
```

### List IPs receiving most on-premises traffic

Use the following query to check which IPs are receiving most on-premises traffic.
          
```kusto
AzureNetworkAnalytics_CL
| where SubType_s == "FlowLog" and FlowType_s == "S2S" 
//| where <Scoping condition>
| mvexpand IP = pack_array(SrcIP_s, DestIP_s) to typeof(string)
| where isnotempty(IP) 
| extend traffic = AllowedInFlows_d + DeniedInFlows_d + AllowedOutFlows_d + DeniedOutFlows_d // For bytes use: | extend traffic = InboundBytes_d + OutboundBytes_d 
| make-series TotalTraffic = sum(traffic) default = 0 on FlowStartTime_t from datetime(<time>) to datetime(<time>) step 1 m by IP
| render timechart
```

### Check standard deviation in traffic received by virtual machines

Use the following query to check standard deviation in traffic received by virtual machines from on-premises machines.
 
```kusto
AzureNetworkAnalytics_CL
| where SubType_s == "FlowLog" and FlowType_s == "S2S" 
//| where <Scoping condition>
| mvexpand vm = pack_array(VM1_s, VM2_s) to typeof(string)
| where isnotempty(vm) 
| extend traffic = AllowedInFlows_d + DeniedInFlows_d + AllowedOutFlows_d + DeniedOutFlows_d // For bytes use: | extend traffic = InboundBytes_d + utboundBytes_d
| summarize deviation = stdev(traffic) by vm
```

### Check standard deviation in traffic received by IPs

Use the following query to check standard deviation in traffic received by IPs from on-premises machines.
          
```kusto
AzureNetworkAnalytics_CL
| where SubType_s == "FlowLog" and FlowType_s == "S2S" 
//| where <Scoping condition>
| mvexpand IP = pack_array(SrcIP_s, DestIP_s) to typeof(string)
| where isnotempty(IP) 
| extend traffic = AllowedInFlows_d + DeniedInFlows_d + AllowedOutFlows_d + DeniedOutFlows_d // For bytes use: | extend traffic = InboundBytes_d + OutboundBytes_d
| summarize deviation = stdev(traffic) by IP
```

### Check which ports are reachable or blocked between IP pairs with NSG rules

Use the following query to check which ports are reachable (or blocked) between IP pairs with NSG rules.

```kusto
AzureNetworkAnalytics_CL
| where SubType_s == "FlowLog" and TimeGenerated between (startTime .. endTime)
| extend sourceIPs = iif(isempty(SrcIP_s), split(SrcPublicIPs_s," "), pack_array(SrcIP_s)),
destIPs = iif(isempty(DestIP_s), split(DestPublicIPs_s," "), pack_array(DestIP_s))
| mvexpand SourceIp = sourceIPs to typeof(string)
| mvexpand DestIp = destIPs to typeof(string)
| project SourceIp = tostring(split(SourceIp, "|")[0]), DestIp = tostring(split(DestIp, "|")[0]), NSGList_s, NSGRule_s, DestPort_d, L4Protocol_s, FlowStatus_s 
| summarize DestPorts= makeset(DestPort_d) by SourceIp, DestIp, NSGList_s, NSGRule_s, L4Protocol_s, FlowStatus_s
```

::: zone-end

::: zone pivot="virtual-network"

## Prevent duplicate records

If flow logging is enabled on both sides of a connection, a flow can be captured on multiple devices. As a result, duplicate data might appear if all flow logs are aggregated in the same Log Analytics workspace. It's necessary to include `FlowDirection` or `MACAddress` to prevent duplication and distinguish between records.

In a flow/connection:

- `MacAddress` denotes the MAC of the device on which flow is being captured.
- `SrcIp` denotes the IP address of the device from which connection was initiated.
- `DestIp` denotes the IP address of the device to which the connection was made.
- `FlowDirection` denotes the direction of the connection with respect to the device. For example, when a connection is made from *VM1* (IP: `10.0.0.4` and MAC: `A1:B1:C1:D1:E1:F1`) to *VM2* (IP: `10.0.0.5` and MAC: `A2:B2:C2:D2:E2:F2`), if flow is captured at *VM1* then `FlowDirection` for this flow would be `Outbound`, and if flow is captured at *VM2* then `FlowDirection` for this flow would be `Inbound`.
- `BytesSrcToDest`/`PacketsSrcToDest` denote bytes or packets sent from source to destination irrespective of where they were captured.
- `BytesDestToSrc`/`PacketsDestToSrc` denote bytes or packets sent from destination to source irrespective of where they were captured.

For example, if a connection is made from *VM1* to *VM2* with the following fields.
 
| VM | SrcIp | DestIp | MAC | BytesSrcToDest | BytesDestToSrc | FlowDirection |
| --- | --- | --- | --- | --- | --- | --- |
| VM1 | 10.0.0.4 | 10.0.0.5 | A1-B1-C1-D1-E1-F1 | 100 | 200 | Outbound |
| VM2 | 10.0.0.4 | 10.0.0.5 | A2-B2-C2-D2-E2-F2 | 100 | 200 | Inbound |

You can use any of the following queries to calculate total outbound bytes for a device with IP address `10.0.0.4` and MAC address `A1:B1:C1:D1:E1:F1`, for connections initiated by this device.
 
```kusto
NTANetAnalytics
| where SubType == "FlowLog"
| where SrcIp == "10.0.0.4" and MacAddress == "A1:B1:C1:D1:E1:F1" and FlowDirection == "Outbound"
| summarize totalIniBytes = sum(BytesSrcToDest);
``` 

```kusto
NTANetAnalytics
| where SubType == "FlowLog"
| where SrcIp == "10.0.0.4" and FlowDirection == "Outbound"
| summarize totalIniBytes = sum(BytesSrcToDest);
``` 
 
```kusto
NTANetAnalytics
| where SubType == "FlowLog"
| where SrcIp == "10.0.0.4" and MacAddress == "A1:B1:C1:D1:E1:F1"
| summarize totalIniBytes = sum(BytesSrcToDest);
```

Similarly, you can use any of the following queries to calculate total outbound bytes for a device with IP address `10.0.0.4` and MAC address `A1:B1:C1:D1:E1:F1`, for connections initiated by another devices to this device.

```kusto 
NTANetAnalytics
| where DestIp == "10.0.0.4" and MacAddress == "A1:B1:C1:D1:E1:F1" and FlowDirection == "Inbound"
| summarize totalNoniniBytes = sum(BytesDestToSrc)
``` 
 
```kusto
NTANetAnalytics
| where DestIp == "10.0.0.4" and FlowDirection == "Inbound"
| summarize totalNoniniBytes = sum(BytesDestToSrc)
```
 
```kusto
NTANetAnalytics
| where DestIp == "10.0.0.4" and MacAddress == "A1:B1:C1:D1:E1:F1"
| summarize totalNoniniBytes = sum(BytesDestToSrc)
```

You can calculate total outbound bytes for a device using the following query:
 
```kusto
let InitiatedByVM = NTANetAnalytics
| where SubType == "FlowLog"
| where SrcIp == "10.0.0.4" and MacAddress == "A1:B1:C1:D1:E1:F1" and FlowDirection == "Outbound"
| summarize totalIniBytes = sum(BytesSrcToDest);
let NotInitiatedByVM = NTANetAnalytics
| where DestIp == "10.0.0.4" and MacAddress == "A1:B1:C1:D1:E1:F1" and FlowDirection == "Inbound"
| summarize totalNoniniBytes = sum(BytesDestToSrc);
InitiatedByVM
| join kind=fullouter NotInitiatedByVM on FlowEndTime
| extend Time = iff(isnotnull(FlowEndTime), FlowEndTime, FlowEndTime1)
| summarize totalMB = (sum(totalIniBytes) + sum(totalNoniniBytes)) / 1024.0 /1024.0;
```
::: zone-end

## Related content

- [Traffic analytics overview](traffic-analytics.md)
- [Traffic analytics schema and data aggregation](traffic-analytics-schema.md)
- [Virtual network flow logs](vnet-flow-logs-overview.md)
