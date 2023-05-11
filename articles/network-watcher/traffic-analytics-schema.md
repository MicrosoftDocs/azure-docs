---
title: Traffic analytics schema and data aggregation
titleSuffix: Azure Network Watcher
description: Learn about schema and data aggregation in Azure Network Watcher traffic analytics to analyze flow logs.
author: halkazwini
ms.service: network-watcher
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 04/11/2023
ms.author: halkazwini
ms.custom: template-concept, engagement-fy23
---

# Schema and data aggregation in Azure Network Watcher traffic analytics

Traffic analytics is a cloud-based solution that provides visibility into user and application activity in cloud networks. Traffic analytics analyzes Azure Network Watcher flow logs to provide insights into traffic flow in your Azure cloud. With traffic analytics, you can:

- Visualize network activity across your Azure subscriptions and identify hot spots.
- Identify security threats, and secure your network, with information such as open-ports, applications attempting internet access, and virtual machines (VMs) connecting to rogue networks.
- Understand traffic flow patterns across Azure regions and the internet to optimize your network deployment for performance and capacity.
- Pinpoint network misconfigurations leading to failed connections in your network.
- Know network usage in bytes, packets, or flows.

## Data aggregation

- All flow logs at a network security group between `FlowIntervalStartTime_t` and `FlowIntervalEndTime_t` are captured at one-minute intervals as blobs in a storage account.
- Default processing interval of traffic analytics is 60 minutes, meaning that every hour, traffic analytics picks blobs from the storage account for aggregation. However, if a processing interval of 10 minutes is selected, traffic analytics will instead pick blobs from the storage account every 10 minutes.
- Flows that have the same `Source IP`, `Destination IP`, `Destination port`, `NSG name`, `NSG rule`, `Flow Direction`, and `Transport layer protocol` (TCP or UDP) (Note: source port is excluded for aggregation) are clubbed into a single flow by traffic analytics.
- This single record is decorated (details in the section below) and ingested in Log Analytics by traffic analytics. This process can take up to 1 hour max.
- `FlowStartTime_t` field indicates the first occurrence of such an aggregated flow (same four-tuple) in the flow log processing interval between `FlowIntervalStartTime_t` and `FlowIntervalEndTime_t`.
- For any resource in traffic analytics, the flows indicated in the Azure portal are total flows seen by the network security group, but in Log Analytics user sees only the single, reduced record. To see all the flows, use the `blob_id` field,  which can be referenced from storage. The total flow count for that record matches the individual flows seen in the blob.

The following query helps you look at all subnets interacting with non-Azure public IPs in the last 30 days.

```
AzureNetworkAnalytics_CL
| where SubType_s == "FlowLog" and FlowStartTime_t >= ago(30d) and FlowType_s == "ExternalPublic"
| project Subnet1_s, Subnet2_s  
```

To view the blob path for the flows in the previous query, use the following query:

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

The previous query constructs a URL to access the blob directly. The URL with placeholders is as follows:

```
https://{saName}@insights-logs-networksecuritygroupflowevent/resoureId=/SUBSCRIPTIONS/{subscriptionId}/RESOURCEGROUPS/{resourceGroup}/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/{nsgName}/y={year}/m={month}/d={day}/h={hour}/m=00/macAddress={macAddress}/PT1H.json

```

## Traffic analytics schema

> [!IMPORTANT]
> The traffic analytics schema was updated on August 22, 2019. The new schema provides source and destination IPs separately, removing need to parse the `FlowDirection` field so that queries are simpler. These are changes in the updated schema:
> 
> - `FASchemaVersion_s` updated from 1 to 2.
> - Deprecated fields: `VMIP_s`, `Subscription_s`, `Region_s`, `NSGRules_s`, `Subnet_s`, `VM_s`, `NIC_s`, `PublicIPs_s`, `FlowCount_d`
> - New fields: `SrcPublicIPs_s`, `DestPublicIPs_s`, `NSGRule_s`
> 
> Deprecated fields are available until November 2022.
> 

Traffic analytics is built on top of Log Analytics, so you can run custom queries on data decorated by traffic analytics and set alerts on the same.

The following table lists the fields in the schema and what they signify.

| Field | Format | Comments |
| ----- | ------ | -------- |
| TableName	| AzureNetworkAnalytics_CL | Table for traffic analytics data. |
| SubType_s	| FlowLog |	Subtype for the flow logs. Use only "FlowLog", other values of SubType_s are for internal workings of the product. |
| FASchemaVersion_s |	2	| Schema version. Doesn't reflect NSG flow log version. |
| TimeProcessed_t	| Date and Time in UTC	| Time at which the traffic analytics processed the raw flow logs from the storage account. |
| FlowIntervalStartTime_t | Date and Time in UTC |	Starting time of the flow log processing interval (time from which flow interval is measured). |
| FlowIntervalEndTime_t	| Date and Time in UTC | Ending time of the flow log processing interval. |
| FlowStartTime_t |	Date and Time in UTC |	First occurrence of the flow (which will get aggregated) in the flow log processing interval between “FlowIntervalStartTime_t” and “FlowIntervalEndTime_t”. This flow gets aggregated based on aggregation logic. |
| FlowEndTime_t | Date and Time in UTC | Last occurrence of the flow (which will get aggregated) in the flow log processing interval between “FlowIntervalStartTime_t” and “FlowIntervalEndTime_t”. In terms of flow log v2, this field contains the time when the last flow with the same four-tuple started (marked as “B” in the raw flow record). |
| FlowType_s |  * IntraVNet <br> * InterVNet <br> * S2S <br> * P2S <br> * AzurePublic <br> * ExternalPublic <br> * MaliciousFlow <br> * Unknown Private <br> * Unknown | Definition in notes below the table. |
| SrcIP_s |	Source IP address |	Will be blank in case of AzurePublic and ExternalPublic flows. |
| DestIP_s | Destination IP address	| Will be blank in case of AzurePublic and ExternalPublic flows. |
| VMIP_s | IP of the VM	| Used for AzurePublic and ExternalPublic flows. |
| DestPort_d | Destination Port | Port at which traffic is incoming. |
| L4Protocol_s	| *	T <br> * U 	| Transport Protocol. T = TCP <br> U = UDP. |
| L7Protocol_s	| Protocol Name	| Derived from destination port. |
| FlowDirection_s | * I = Inbound<br> *	O = Outbound | Direction of the flow in/out of NSG as per flow log. |
| FlowStatus_s	| *	A = Allowed by NSG Rule <br> *	D = Denied by NSG Rule	| Status of flow allowed/nblocked by NSG as per flow log. |
| NSGList_s | \<SUBSCRIPTIONID>\/<RESOURCEGROUP_NAME>\/<NSG_NAME> | Network Security Group (NSG) associated with the flow. |
| NSGRules_s | \<Index value 0)>\|\<NSG_RULENAME>\|\<Flow Direction>\|\<Flow Status>\|\<FlowCount ProcessedByRule> |  NSG rule that allowed or denied this flow. |
| NSGRule_s | NSG_RULENAME |  NSG rule that allowed or denied this flow. |
| NSGRuleType_s	| *	User Defined *	Default |	The type of NSG Rule used by the flow. |
| MACAddress_s | MAC Address | MAC address of the NIC at which the flow was captured. |
| Subscription_s | Subscription of the Azure virtual network/ network interface/ virtual machine is populated in this field | Applicable only for FlowType = S2S, P2S, AzurePublic, ExternalPublic, MaliciousFlow, and UnknownPrivate flow types (flow types where only one side is Azure). |
| Subscription1_s | Subscription ID | Subscription ID of virtual network/ network interface/ virtual machine to which the source IP in the flow belongs to. |
| Subscription2_s | Subscription ID | Subscription ID of virtual network/ network interface/ virtual machine to which the destination IP in the flow belongs to. |
| Region_s | Azure region of virtual network/ network interface/ virtual machine to which the IP in the flow belongs to | Applicable only for FlowType = S2S, P2S, AzurePublic, ExternalPublic, MaliciousFlow, and UnknownPrivate flow types (flow types where only one side is Azure). |
| Region1_s | Azure Region | Azure region of virtual network/ network interface/ virtual machine to which the source IP in the flow belongs to. |
| Region2_s	| Azure Region | Azure region of virtual network to which the destination IP in the flow belongs to. |
| NIC_s | \<resourcegroup_Name>\/\<NetworkInterfaceName> | NIC associated with the VM sending or receiving the traffic. |
| NIC1_s | <resourcegroup_Name>/\<NetworkInterfaceName> | NIC associated with the source IP in the flow. |
| NIC2_s | <resourcegroup_Name>/\<NetworkInterfaceName> | NIC associated with the destination IP in the flow. |
| VM_s | <resourcegroup_Name>\/\<NetworkInterfaceName> | Virtual Machine associated with the Network interface NIC_s. |
| VM1_s | <resourcegroup_Name>/\<VirtualMachineName> | Virtual Machine associated with the source IP in the flow. |
| VM2_s | <resourcegroup_Name>/\<VirtualMachineName> | Virtual Machine associated with the destination IP in the flow. |
| Subnet_s | <ResourceGroup_Name>/<VNET_Name>/\<SubnetName> | Subnet associated with the NIC_s. |
| Subnet1_s	| <ResourceGroup_Name>/<VNET_Name>/\<SubnetName> | Subnet associated with the Source IP in the flow. |
| Subnet2_s | <ResourceGroup_Name>/<VNET_Name>/\<SubnetName>	| Subnet associated with the Destination IP in the flow. |
| ApplicationGateway1_s | \<SubscriptionID>/\<ResourceGroupName>/\<ApplicationGatewayName> | Application gateway associated with the Source IP in the flow. |
| ApplicationGateway2_s | \<SubscriptionID>/\<ResourceGroupName>/\<ApplicationGatewayName> | Application gateway associated with the Destination IP in the flow. |
| LoadBalancer1_s |	\<SubscriptionID>/\<ResourceGroupName>/\<LoadBalancerName> | Load balancer associated with the Source IP in the flow. |
| LoadBalancer2_s | \<SubscriptionID>/\<ResourceGroupName>/\<LoadBalancerName> | Load balancer associated with the Destination IP in the flow. |
| LocalNetworkGateway1_s | \<SubscriptionID>/\<ResourceGroupName>/\<LocalNetworkGatewayName> | Local network gateway associated with the Source IP in the flow. |
| LocalNetworkGateway2_s | \<SubscriptionID>/\<ResourceGroupName>/\<LocalNetworkGatewayName> | Local network gateway associated with the Destination IP in the flow. |
| ConnectionType_s | Possible values are VNetPeering, VpnGateway, and ExpressRoute |	Connection Type. |
| ConnectionName_s | \<SubscriptionID>/\<ResourceGroupName>/\<ConnectionName> | Connection Name. For flow type P2S, it will be formatted as \<gateway name\>_\<VPN Client IP\>. |
| ConnectingVNets_s	| Space separated list of virtual network names | In case of hub and spoke topology, hub virtual networks will be populated here. |
| Country_s | Two letter country code (ISO 3166-1 alpha-2) | Populated for flow type ExternalPublic. All IP addresses in PublicIPs_s field will share the same country code. |
| AzureRegion_s | Azure region locations | Populated for flow type AzurePublic. All IP addresses in PublicIPs_s field will share the Azure region. |
| AllowedInFlows_d | | Count of inbound flows that were allowed. This represents the number of flows that shared the same four-tuple inbound to the network interface at which the flow was captured. |
| DeniedInFlows_d |  | Count of inbound flows that were denied. (Inbound to the network interface at which the flow was captured). |
| AllowedOutFlows_d | |	Count of outbound flows that were allowed (Outbound to the network interface at which the flow was captured). |
| DeniedOutFlows_d	| |	Count of outbound flows that were denied (Outbound to the network interface at which the flow was captured). |
| FlowCount_d |	Deprecated. Total flows that matched the same four-tuple. In case of flow types ExternalPublic and AzurePublic, count includes the flows from various PublicIP addresses as well. |
| InboundPackets_d | Represents packets sent from the destination to the source of the flow | This field is only populated for Version 2 of NSG flow log schema. |
| OutboundPackets_d	 | Represents packets sent from the source to the destination of the flow | This field is only populated for Version 2 of NSG flow log schema. |
| InboundBytes_d |	Represents bytes sent from the destination to the source of the flow | This field is only populated Version 2 of NSG flow log schema. |
| OutboundBytes_d | Represents bytes sent from the source to the destination of the flow | This field is only populated Version 2 of NSG flow log schema. |
| CompletedFlows_d	|  | This field is only populated with nonzero value for Version 2 of NSG flow log schema. |
| PublicIPs_s | <PUBLIC_IP>\|\<FLOW_STARTED_COUNT>\|\<FLOW_ENDED_COUNT>\|\<OUTBOUND_PACKETS>\|\<INBOUND_PACKETS>\|\<OUTBOUND_BYTES>\|\<INBOUND_BYTES> | Entries separated by bars. |
| SrcPublicIPs_s | <SOURCE_PUBLIC_IP>\|\<FLOW_STARTED_COUNT>\|\<FLOW_ENDED_COUNT>\|\<OUTBOUND_PACKETS>\|\<INBOUND_PACKETS>\|\<OUTBOUND_BYTES>\|\<INBOUND_BYTES> | Entries separated by bars. |
| DestPublicIPs_s | <DESTINATION_PUBLIC_IP>\|\<FLOW_STARTED_COUNT>\|\<FLOW_ENDED_COUNT>\|\<OUTBOUND_PACKETS>\|\<INBOUND_PACKETS>\|\<OUTBOUND_BYTES>\|\<INBOUND_BYTES> | Entries separated by bars. |

## Public IP details schema

Traffic analytics provides WHOIS data and geographic location for all public IPs in your environment. For a malicious IP, traffic analytics provides DNS domain, threat type and thread descriptions as identified by Microsoft security intelligence solutions. IP Details are published to your Log Analytics workspace so you can create custom queries and put alerts on them. You can also access prepopulated queries from the traffic analytics dashboard.

The following table details public IP schema:

| Field | Format | Comments |
| ----- | ------ | -------- |
| TableName | AzureNetworkAnalyticsIPDetails_CL | Table that contains traffic analytics IP details data. |
| SubType_s	| FlowLog |	Subtype for the flow logs. **Use only "FlowLog"**, other values of SubType_s are for internal workings of the product. |
| FASchemaVersion_s | 2 | Schema version. It doesn't reflect NSG flow log version. |
| FlowIntervalStartTime_t | Date and Time in UTC | Start time of the flow log processing interval (time from which flow interval is measured). |
| FlowIntervalEndTime_t | Date and Time in UTC | End time of the flow log processing interval. |
| FlowType_s | - AzurePublic <br> - ExternalPublic <br> - MaliciousFlow | Definition in notes below the table. |
| IP | Public IP | Public IP whose information is provided in the record. |
| Location | Location of the IP | - For Azure Public IP: Azure region of virtual network/network interface/virtual machine to which the IP belongs OR Global for IP [168.63.129.16](../virtual-network/what-is-ip-address-168-63-129-16.md). <br> - For External Public IP and Malicious IP: 2-letter country code where IP is located (ISO 3166-1 alpha-2). |
| PublicIPDetails | Information about IP | - For AzurePublic IP: Azure Service owning the IP or Microsoft virtual public IP for [168.63.129.16](../virtual-network/what-is-ip-address-168-63-129-16.md). <br> - ExternalPublic/Malicious IP: WhoIS information of the IP. |
| ThreatType | Threat posed by malicious IP | **For Malicious IPs only**: One of the threats from the list of currently allowed values (described in the next table). |
| ThreatDescription | Description of the threat | **For Malicious IPs only**: Description of the threat posed by the malicious IP. |
| DNSDomain | DNS domain | **For Malicious IPs only**: Domain name associated with this IP. |

List of threat types:

| Value | Description |
| ----- | ----------- |
| Botnet | Indicator detailing a botnet node/member. |
| C2 | Indicator detailing a Command & Control node of a botnet. |
| CryptoMining | Traffic involving this network address / URL is an indication of CyrptoMining / Resource abuse. |
| DarkNet | Indicator of a Darknet node/network. |
| DDos | Indicators relating to an active or upcoming DDoS campaign. |
| MaliciousUrl | URL that is serving malware. |
| Malware | Indicator describing a malicious file or files. |
| Phishing | Indicators relating to a phishing campaign. |
| Proxy | Indicator of a proxy service. |
| PUA |	Potentially Unwanted Application. |
| WatchList | A generic bucket into which indicators are placed when it can't be determined exactly what the threat is or will require manual interpretation. `WatchList` should typically not be used by partners submitting data into the system. |

## Notes

- In case of `AzurePublic` and `ExternalPublic` flows, customer owned Azure virtual machine IP is populated in `VMIP_s` field, while the Public IP addresses are populated in the `PublicIPs_s` field. For these two flow types, you should use `VMIP_s` and `PublicIPs_s` instead of `SrcIP_s` and `DestIP_s` fields. For AzurePublic and ExternalPublic IP addresses, we aggregate further, so that the number of records ingested to log analytics workspace is minimal. (This field will be deprecated soon and you should be using SrcIP_ and DestIP_s depending on whether the virtual machine was the source or the destination in the flow).
- Some field names are appended with `_s` or `_d`, which don't signify source and destination but indicate the data types *string* and *decimal* respectively.
- Based on the IP addresses involved in the flow, we categorize the flows into the following flow types:
    - `IntraVNet`: Both IP addresses in the flow reside in the same Azure virtual network.
    - `InterVNet`: IP addresses in the flow reside in two different Azure virtual networks.
    - `S2S` (Site-To-Site): One of the IP addresses belongs to an Azure virtual network, while the other IP address belongs to customer network (Site) connected to the virtual network through VPN gateway or ExpressRoute.
    - `P2S` (Point-To-Site): One of the IP addresses belongs to an Azure virtual network, while the other IP address belongs to customer network (Site) connected to the Azure Virtual Network through VPN gateway.
    - `AzurePublic`: One of the IP addresses belongs to an Azure virtual network, while the other IP address is an Azure Public IP address owned by Microsoft. Customer owned Public IP addresses aren't part of this flow type. For instance, any customer owned VM sending traffic to an Azure service (Storage endpoint) would be categorized under this flow type.
    - `ExternalPublic`: One of the IP addresses belongs to an Azure virtual network, while the other IP address is a public IP that isn't in Azure and isn't reported as malicious in the ASC feeds that traffic analytics consumes for the processing interval between “FlowIntervalStartTime_t” and “FlowIntervalEndTime_t”.
    - `MaliciousFlow`: One of the IP addresses belong to an Azure virtual network, while the other IP address is a public IP that isn't in Azure and is reported as malicious in the ASC feeds that traffic analytics consumes for the processing interval between “FlowIntervalStartTime_t” and “FlowIntervalEndTime_t”.
    - `UnknownPrivate`: One of the IP addresses belong to an Azure virtual network, while the other IP address belongs to the private IP range defined in RFC 1918 and couldn't be mapped by traffic analytics to a customer owned site or Azure virtual network.
    - `Unknown`: Unable to map either of the IP addresses in the flow with the customer topology in Azure and on-premises (site).

## Next Steps

- To learn more about traffic analytics, see [Azure Network Watcher Traffic analytics](traffic-analytics.md).
- See [Traffic analytics FAQ](traffic-analytics-faq.yml) for answers to traffic analytics frequently asked questions.


