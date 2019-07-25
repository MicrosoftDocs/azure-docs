---
title: Azure traffic analytics schema | Microsoft Docs
description: Understand schema of Traffic Analytics to analyze Azure network security group flow logs.
services: network-watcher
documentationcenter: na
author: vinynigam
manager: agummadi
editor:

ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 02/26/2019
ms.author: vinigam

---

# Schema and data aggregation in Traffic Analytics

Traffic Analytics is a cloud-based solution that provides visibility into user and application activity in cloud networks. Traffic Analytics analyzes Network Watcher network security group (NSG) flow logs to provide insights into traffic flow in your Azure cloud. With traffic analytics, you can:

- Visualize network activity across your Azure subscriptions and identify hot spots.
- Identify security threats to, and secure your network, with information such as open-ports, applications attempting internet access, and virtual machines (VM) connecting to rogue networks.
- Understand traffic flow patterns across Azure regions and the internet to optimize your network deployment for performance and capacity.
- Pinpoint network misconfigurations leading to failed connections in your network.
- Know network usage in bytes, packets, or flows.

### Data aggregation

1. All  flow logs at an NSG between “FlowIntervalStartTime_t” and “FlowIntervalEndTime_t” are captured at one-minute intervals in the storage account as blobs before being processed by Traffic Analytics.
2. Default processing interval of Traffic Analytics is 60 minutes. This means that every 60 mins Traffic Analytics picks blobs from storage for aggregation.
3. Flows that have the same Source IP, Destination IP, Destination port, NSG name, NSG rule, Flow Direction, and Transport layer protocol (TCP or UDP) (Note: Source port is excluded for aggregation) are clubbed into a single flow by Traffic Analytics
4. This single record is decorated (Details in the section below) and ingested in Log Analytics by Traffic Analytics.This process can take upto 1 hour max.
5. FlowStartTime_t field indicates the first occurrence of such an aggregated flow (same four-tuple) in the flow log processing interval between “FlowIntervalStartTime_t” and “FlowIntervalEndTime_t”.
6. For any resource in TA, the flows indicated in the UI are total flows seen by the NSG, but in Log Anlaytics user will see only the single, reduced record. To see all the flows, use the blob_id field,  which can be referenced from Storage. The total flow count for that record will match the individual flows seen in the blob.

The below query helps you looks at all flow logs from on-premise in the last 30 days.
```
AzureNetworkAnalytics_CL
| where SubType_s == "FlowLog" and FlowStartTime_t >= ago(30d) and FlowType_s == "ExternalPublic"
| project Subnet_s  
```
To view the blob path for the flows in the above mentioned query, use the query below:

```
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

The above query constructs a URL to access the blob directly. The URL with place-holders is below:

```
https://{saName}@insights-logs-networksecuritygroupflowevent/resoureId=/SUBSCRIPTIONS/{subscriptionId}/RESOURCEGROUPS/{resourceGroup}/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/{nsgName}/y={year}/m={month}/d={day}/h={hour}/m=00/macAddress={macAddress}/PT1H.json

```

### Fields used in Traffic Analytics schema

Traffic Analytics is built on top of Log Analytics, so you can run custom queries on data decorated by Traffic Analytics and set alerts on the same.

Listed below are the fields in the schema and what they signify

| Field | Format | Comments |
|:---   |:---    |:---  |
| TableName	| AzureNetworkAnalytics_CL | Table for Traffic Anlaytics data
| SubType_s	| FlowLog |	Subtype for the flow logs. Use only "FlowLog", other values of SubType_s are for internal workings of the product |
| FASchemaVersion_s |	1	| Scehma version. Does not reflect NSG Flow Log version |
| TimeProcessed_t	| Date and Time in UTC	| Time at which the Traffic Analytics processed the raw flow logs from the storage account |
| FlowIntervalStartTime_t |	Date and Time in UTC |	Starting time of the flow log processing interval. This is time from which flow interval is measured |
| FlowIntervalEndTime_t	| Date and Time in UTC | Ending time of the flow log processing interval |
| FlowStartTime_t |	Date and Time in UTC |	First occurrence of the flow (which will get aggregated) in the flow log processing interval between “FlowIntervalStartTime_t” and “FlowIntervalEndTime_t”. This flow gets aggregated based on aggregation logic |
| FlowEndTime_t | Date and Time in UTC | Last occurrence of the flow (which will get aggregated) in the flow log processing interval between “FlowIntervalStartTime_t” and “FlowIntervalEndTime_t”. In terms of flow log v2, this field contains the time when the last flow with the same four-tuple started (marked as “B” in the raw flow record) |
| FlowType_s |  * IntraVNet <br> * InterVNet <br> * S2S <br> * P2S <br> * AzurePublic <br> * ExternalPublic <br> * MaliciousFlow <br> * Unknown Private <br> * Unknown | Definition in notes below the table |
| SrcIP_s |	Source IP address |	Will be blank in case of AzurePublic and ExternalPublic flows |
| DestIP_s | Destination IP address	| Will be blank in case of AzurePublic and ExternalPublic flows |
| VMIP_s | IP of the VM	| Used for AzurePublic and ExternalPublic flows |
| PublicIP_s | Public IP addresses | Used for AzurePublic and ExternalPublic flows |
| DestPort_d | Destination Port | Port at which traffic is incoming |
| L4Protocol_s	| *	T <br> * U 	| Transport Protocol. T = TCP <br> U = UDP |
| L7Protocol_s	| Protocol Name	| Derived from destination port |
| FlowDirection_s | * I = Inbound<br> *	O = Outbound | Direction of the flow in/out of NSG as per flow log |
| FlowStatus_s	| *	A = Allowed by NSG Rule <br> *	D = Denied by NSG Rule	| Status of flow allowed/nblocked by NSG as per flow log |
| NSGList_s | \<SUBSCRIPTIONID>\/<RESOURCEGROUP_NAME>\/<NSG_NAME> | Network Security Group (NSG) associated with the flow |
| NSGRules_s | \<Index value 0)><NSG_RULENAME>\<Flow Direction>\<Flow Status>\<FlowCount ProcessedByRule> |  NSG rule that allowed or denied this flow |
| NSGRuleType_s	| *	User Defined *	Default |	The type of NSG Rule used by the flow |
| MACAddress_s | MAC Address | MAC address of the NIC at which the flow was captured |
| Subscription_s | Subscription of the Azure virtual network/ network interface/ virtual machine is populated in this field | Applicable only for FlowType = S2S, P2S, AzurePublic, ExternalPublic, MaliciousFlow, and UnknownPrivate flow types (flow types where only one side is azure) |
| Subscription1_s | Subscription ID | Subscription ID of virtual network/ network interface/ virtual machine to which the source IP in the flow belongs to |
| Subscription2_s | Subscription ID | Subscription ID of virtual network/ network interface/ virtual machine to which the destination IP in the flow belongs to |
| Region_s | Azure region of virtual network/ network interface/ virtual machine to which the IP in the flow belongs to | Applicable only for FlowType = S2S, P2S, AzurePublic, ExternalPublic, MaliciousFlow, and UnknownPrivate flow types (flow types where only one side is azure) |
| Region1_s | Azure Region | Azure region of virtual network/ network interface/ virtual machine to which the source IP in the flow belongs to |
| Region2_s	| Azure Region | Azure region of virtual network to which the destination IP in the flow belongs to |
| NIC_s | \<resourcegroup_Name>\/\<NetworkInterfaceName> |	NIC associated with the VM sending or receiving the traffic |
| NIC1_s | <resourcegroup_Name>/\<NetworkInterfaceName> | NIC associated with the source IP in the flow |
| NIC2_s | <resourcegroup_Name>/\<NetworkInterfaceName> | NIC associated with the destination IP in the flow |
| VM_s | <resourcegroup_Name>\/\<NetworkInterfaceName> | Virtual Machine associated with the Network interface NIC_s |
| VM1_s | <resourcegroup_Name>/\<VirtualMachineName> | Virtual Machine associated with the source IP in the flow |
| VM2_s | <resourcegroup_Name>/\<VirtualMachineName> | Virtual Machine associated with the destination IP in the flow |
| Subnet_s | <ResourceGroup_Name>/<VNET_Name>/\<SubnetName> | Subnet associated with the NIC_s |
| Subnet1_s	| <ResourceGroup_Name>/<VNET_Name>/\<SubnetName> | Subnet associated with the Source IP in the flow |
| Subnet2_s | <ResourceGroup_Name>/<VNET_Name>/\<SubnetName>	| Subnet associated with the Destination IP in the flow |
| ApplicationGateway1_s | \<SubscriptionID>/\<ResourceGroupName>/\<ApplicationGatewayName> | Application gateway associated with the Source IP in the flow |
| ApplicationGateway2_s | \<SubscriptionID>/\<ResourceGroupName>/\<ApplicationGatewayName> | Application gateway associated with the Destination IP in the flow |
| LoadBalancer1_s |	\<SubscriptionID>/\<ResourceGroupName>/\<LoadBalancerName> | Load balancer associated with the Source IP in the flow |
| LoadBalancer2_s | \<SubscriptionID>/\<ResourceGroupName>/\<LoadBalancerName> | Load balancer associated with the Destination IP in the flow |
| LocalNetworkGateway1_s | \<SubscriptionID>/\<ResourceGroupName>/\<LocalNetworkGatewayName> | Local network gateway associated with the Source IP in the flow |
| LocalNetworkGateway2_s | \<SubscriptionID>/\<ResourceGroupName>/\<LocalNetworkGatewayName> | Local network gateway associated with the Destination IP in the flow |
| ConnectionType_s | Possible values are VNetPeering, VpnGateway, and ExpressRoute |	Connection Type |
| ConnectionName_s | \<SubscriptionID>/\<ResourceGroupName>/\<ConnectionName> | Connection Name |
| ConnectingVNets_s	| Space separated list of virtual network names | In case of hub and spoke topology, hub virtual networks will be populated here |
| Country_s | Two letter country code (ISO 3166-1 alpha-2) | Populated for flow type ExternalPublic. All IP addresses in PublicIPs_s field will share the same country code |
| AzureRegion_s | Azure region locations | Populated for flow type AzurePublic. All IP addresses in PublicIPs_s field will share the Azure region |
| AllowedInFlows_d | | Count of inbound flows that were allowed. This represents the number of flows that shared the same four-tuple inbound to the netweork interface at which the flow was captured |
| DeniedInFlows_d |  | Count of inbound flows that were denied. (Inbound to the network interface at which the flow was captured) |
| AllowedOutFlows_d | |	Count of outbound flows that were allowed (Outbound to the network interface at which the flow was captured) |
| DeniedOutFlows_d	| |	Count of outbound flows that were denied (Outbound to the network interface at which the flow was captured) |
| FlowCount_d |	Deprecated. Total flows that matched the same four-tuple. In case of flow types ExternalPublic and AzurePublic, count will include the flows from various PublicIP addresses as well.
| InboundPackets_d | Packets received as captured at the network interface where NSG rule was applied | This is populated only for the Version 2 of NSG flow log schema |
| OutboundPackets_d	 | Packets sent as captured at the network interface where NSG rule was applied | This is populated only for the Version 2 of NSG flow log schema |
| InboundBytes_d |	Bytes received as captured at the network interface where NSG rule was applied | This is populated only for the Version 2 of NSG flow log schema |
| OutboundBytes_d |	Bytes sent as captured at the network interface where NSG rule was applied | This is populated only for the Version 2 of NSG flow log schema |
| CompletedFlows_d	|  | This is populated with non-zero value only for the Version 2 of NSG flow log schema |
| PublicIPs_s | <PUBLIC_IP>\|\<FLOW_STARTED_COUNT>\|\<FLOW_ENDED_COUNT>\|\<OUTBOUND_PACKETS>\|\<INBOUND_PACKETS>\|\<OUTBOUND_BYTES>\|\<INBOUND_BYTES> | Entries seperated by bars |

### Notes

1. In case of AzurePublic and ExternalPublic flows, the customer owned Azure VM IP is populated in VMIP_s field, while the Public IP addresses are being populated in the PublicIPs_s field. For these two flow types, we should use VMIP_s and PublicIPs_s instead of SrcIP_s and DestIP_s fields. For AzurePublic and ExternalPublicIP addresses, we aggregate further, so that the number of records ingested to customer log analytics workspace is minimal.(This field will be deprecated soon and we should be using SrcIP_ and DestIP_s depending on whether azure VM was the source or the destination in the flow)
1. Details for flow types: Based on the IP addresses involved in the flow, we categorize the flows in to the following flow types:
1. IntraVNet – Both the IP addresses in the flow reside in the same Azure Virtual Network.
1. InterVNet - IP addresses in the flow reside in the two different Azure Virtual Networks.
1. S2S – (Site To Site) One of the IP addresses belongs to Azure Virtual Network while the other IP address belongs to customer network (Site) connected to the Azure Virtual Network through VPN gateway or Express Route.
1. P2S - (Point To Site) One of the IP addresses belongs to Azure Virtual Network while the other IP address belongs to customer network (Site) connected to the Azure Virtual Network through VPN gateway.
1. AzurePublic - One of the IP addresses belongs to Azure Virtual Network while the other IP address belongs to Azure Internal Public IP addresses owned by Microsoft. Customer owned Public IP addresses won’t be part of this flow type. For instance, any customer owned VM sending traffic to an Azure Service (Storage endpoint) would be categorized under this flow type.
1. ExternalPublic - One of the IP addresses belongs to Azure Virtual Network while the other IP address is a public IP that is not in Azure, is not reported as malicious in the ASC feeds that Traffic Analytics consumes for the processing interval between “FlowIntervalStartTime_t” and “FlowIntervalEndTime_t”.
1. MaliciousFlow - One of the IP addresses belong to azure virtual network while the other IP address is a public IP that is not in Azure and  is reported as malicious in the ASC feeds that Traffic Analytics consumes for the processing interval between “FlowIntervalStartTime_t” and “FlowIntervalEndTime_t”.
1. UnknownPrivate - One of the IP addresses belong to Azure Virtual Network while the other IP address belongs to private IP range as defined in RFC 1918 and could not be mapped by Traffic Analytics to a customer owned site or Azure Virtual Network.
1. Unknown – Unable to map the either of the IP addresses in the flows with the customer topology in Azure as well as on-premises (site).
1. Some field names are appended with _s or _d . These do NOT signify source and destination.

### Next Steps
To get answers to frequently asked questions, see [Traffic analytics FAQ](traffic-analytics-faq.md)
To see details about functionality, see [Traffic analytics documentation](traffic-analytics.md)
