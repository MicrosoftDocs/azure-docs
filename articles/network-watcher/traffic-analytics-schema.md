---
title: Azure traffic analytics | Microsoft Docs
description: Understand schema of Traffic Analytics to analyse Azure network security group flow logs .
services: network-watcher
documentationcenter: na
author: vinigam
manager: agummadi
editor: 


---

# Traffic analytics

Traffic analytics is a cloud-based solution that provides visibility into user and application activity in cloud networks. Traffic analytics analyzes Network Watcher network security group (NSG) flow logs to provide insights into traffic flow in your Azure cloud. With traffic analytics, you can:

- Visualize network activity across your Azure subscriptions and identify hot spots.
- Identify security threats to, and secure your network, with information such as open-ports, applications attempting internet access, and virtual machines (VM) connecting to rogue networks.
- Understand traffic flow patterns across Azure regions and the internet to optimize your network deployment for performance and capacity.
- Pinpoint network misconfigurations leading to failed connections in your network.

# Fields used in Traffic Analytics Queries

Traffic Analytics is built on top of Log Analytics, so you can run custom queries on data decorated by Traffic Analytics and set alerts on the same.

Listed below are the fields in the schema and what they signify

| Field | Format | Comments | 
|:---   |:---    |:---  |
| TableName	| AzureNetworkAnalytics_CL |	
| SubType_s	| FlowLog |	Subtype for the flow logs |
| FASchemaVersion_s |	1	| Flow log schema version |
| TimeProcessed_t	| Date and Time in UTC	| Time at which the Network Watcher traffic analytics processed the raw flow logs from the storage account |
| FlowIntervalStartTime_t |	Date and Time in UTC |	Starting time of the flow log processing interval. This is time from which flow interval is measured |
| FlowIntervalEndTime_t	| Date and Time in UTC | Ending time of the flow log processing interval |
| FlowStartTime_t |	Date and Time in UTC |	First occurrence of such an aggregated flow (same four tuple) in the flow log processing interval between “FlowIntervalStartTime_t” and “FlowIntervalEndTime_t”. This gets aggregated based on aggregation logic |
| FlowEndTime_t | Date and Time in UTC | Last occurrence of the aggregated flow (same four tuple) in the flow log processing interval between “FlowIntervalStartTime_t” and “FlowIntervalEndTime_t”. In terms of flow log v2, this field contains the time when the last flow with the same four-tuple started (marked as “B” in the raw flow record) |
| FlowType_s |  • IntraVNet <br> • InterVNet <br> • S2S <br> • P2S <br> • AzurePublic <br> • ExternalPublic <br> • MaliciousFlow <br> • Unknown Private <br> • Unknown | Definition in note below the table |
| SrcIP_s |	Source IP address |	Will be blank in case of In case of AzurePublic and ExternalPublic flows |
| DestIP_s | Destination IP address	| Will be blank in case of In case of AzurePublic and ExternalPublic flows |
| VMIP_s | IP of the VM	| Used for AzurePublic and ExternalPublic flows |
| PublicIP_S | Public IP addresses | Used for AzurePublic and ExternalPublic flows |
| DestPort_d | |Destination Port|
| L4Protocol_s	| •	T <br> • U 	| Transport Protocol . T = TCP <br> U = UDP | 
| L7Protocol_s	| Protocol Name	| Based on destination port |
| FlowDirection_s | • I = Inbound<br> •	O = Outbound | Direction of the flow as in raw flow log | 
| FlowStatus_s	| •	A = Allowed by NSG Rule <br> •	D = Denied by NSG Rule	| Status of flow as in raw flow log |
| NSGList_s | \<SUBSCRIPTIONID>\/<RESOURCEGROUP_NAME>\/<NSG_NAME> | Network Security Group (NSG) associated with the flow |
| NSGRules_s | \<Index value 0)><NSG_RULENAME>\<Flow Direction>\<Flow Status>\<FlowCount ProcessedByRule> |  NSG rule that allowed or denied this flow |
| NSGRuleType_s	| •	User Defined •	Default |	The type of NSG Rule used by the flow |
| MACAddress_s | MAC Address | MAC address of the NIC at which the flow was captured |
| Subscription_s | Subscription of the azure Virtual network is populated in this field | Applicable only for FlowType = S2S, P2S, AzurePublic, ExternalPublic, MaliciousFlow and UnknownPrivate flow types (flow types where only one side is azure) |
| Subscription1_s | Subscription ID | Subscription ID of virtual network/ network interface/ virtual machine to which the source IP in the flow belongs to |
| Subscription2_s | Subscription ID | Subscription ID of virtual network/ network interface/ virtual machine to which the destination IP in the flow belongs to |
| Region_s | Azure region of virtual network/ network interface/ virtual machine to which the IP in the flow belongs to | Applicable only for FlowType = S2S, P2S, AzurePublic, ExternalPublic, MaliciousFlow and UnknownPrivate flow types (flow types where only one side is azure) |
| Region1_s | Azure Region | Azure region of virtual network/ network interface/ virtual machine to which the source IP in the flow belongs to |
| Region2_s	| Azure Region | Azure region of virtual network to which the destination IP in the flow belongs to |
| NIC_s | \<resourcegroup_Name>\/\<NetworkInterfaceName> |	Network interface associated with the MAC address |
| NIC1_s | <resourcegroup_Name>/\<NetworkInterfaceName> | Network interface associated with the source IP in the flow |
| NIC2_s | <resourcegroup_Name>/\<NetworkInterfaceName> | Network interface associated with the destination IP in the flow |
| VM_s | <resourcegroup_Name>\/\<NetworkInterfaceName> | Virtual machine associated with the Network interface NIC_s |
| VM1_s | <resourcegroup_Name>/\<VirtualMachineName> | Virtual machine associated with the source IP in the flow |
| VM2_s | <resourcegroup_Name>/\<VirtualMachineName> | Virtual machine associated with the destination IP in the flow |
| Subnet_s | <ResourceGroup_Name>/<VNET_Name>/\<SubnetName> | Subnetwork associated with the NIC_s |
| Subnet1_s	| <ResourceGroup_Name>/<VNET_Name>/\<SubnetName> | Subnetwork associated with the source IP in the flow |
| Subnet2_s | <ResourceGroup_Name>/<VNET_Name>/\<SubnetName>	| Subnetwork associated with the Destination IP in the flow |
| ApplicationGateway1_s | \<SubscriptionID>/\<ResourceGroupName>/\<ApplicationGatewayName> | Application gateway associated with the Source IP in the flow | 
| ApplicationGateway2_s | \<SubscriptionID>/\<ResourceGroupName>/\<ApplicationGatewayName> | Application gateway associated with the destination IP in the flow |
| LoadBalancer1_s |	\<SubscriptionID>/\<ResourceGroupName>/\<LoadBalancerName> | Load balancer associated with the Source IP in the flow |
| LoadBalancer2_s | \<SubscriptionID>/\<ResourceGroupName>/\<LoadBalancerName> | Load balancer associated with the Destination IP in the flow |
| LocalNetworkGateway1_s | \<SubscriptionID>/\<ResourceGroupName>/\<LocalNetworkGatewayName> | Local network gateway associated with the Source IP in the flow |
| LocalNetworkGateway2_s | \<SubscriptionID>/\<ResourceGroupName>/\<LocalNetworkGatewayName> | Local network gateway associated with the Destination IP in the flow |
| ConnectionType_s | Possible values are VNetPeering, VpnGateway and ExpressRoute |	Connection Type |
| ConnectionName_s | \<SubscriptionID>/\<ResourceGroupName>/\<ConnectionName> | Connection Name |
| ConnectingVNets_s	| Space separated list of virtual network names | In case of hub and spoke topology, hub virtual networks will be populated here |
| Country_s | Two letter country code (ISO 3166-1 alpha-2) | Populated for flow type ExternalPublic. All IP addresses in PublicIPs_s field will share the same country code |
| AzureRegion_s | Azure region locations | Populated for flow type AzurePublic. All IP addresses in PublicIPs_s field will share the azure region |
| AllowedInFlows_d | | Count of inbound flows that were allowed . This represents the number of flows that shared the same 4-tuple inbound to the netweork interface at which the flow was captured | 
| DeniedInFlows_d |  | Count of inbound flows that were denied. (Inbound to the network interface at which the flow was captured) |
| AllowedOutFlows_d | |	Count of outbound flows that were allowed (Outbound to the network interface at which the flow was captured) |
| DeniedOutFlows_d	| |	Count of outbound flows that were denied (Outbound to the network interface at which the flow was captured) |
| FlowCount_d |	Deprecated. Total flows that matched the same 4-tuple. In case of flow types ExternalPublic and AzurePublic, count will include the flows from various PublicIP addresses as well.
| InboundPackets_d | Packets received as captured at the network interface where NSG rule was applied | This is populated only for the Version 2 of NSG flow log schema |
| OutboundPackets_d	 | Packets sent as captured at the network interface where NSG rule was applied | This is populated only for the Version 2 of NSG flow log schema |
| InboundBytes_d |	Bytes received as captured at the network interface where NSG rule was applied | This is populated only for the Version 2 of NSG flow log schema |
| OutboundBytes_d |	Bytes sent as captured at the network interface where NSG rule was applied | This is populated only for the Version 2 of NSG flow log schema |
| CompletedFlows_d	|  | This is populated with non-zero value only for the Version 2 of NSG flow log schema |
| PublicIPs_s | <PUBLIC_IP>\|\<FLOW_STARTED_COUNT>\|\<FLOW_ENDED_COUNT>\|\<OUTBOUND_PACKETS>\|\<INBOUND_PACKETS>\|\<OUTBOUND_BYTES>\|\<INBOUND_BYTES> | Entries seperated by bars |
    
# Notes
    
1. All flows that happened between “FlowIntervalStartTime_t” and “FlowIntervalEndTime_t” and captured in the storage account will be processed by Network watcher traffic analytics service. As of now, the default processing interval is 60 minutes and always this processing interval aligns with the hour interval. Processing interval never spans across hours.
2. Network watcher traffic analytics exposes intervals at which the NSG flow logs should be processed. Default processing interval is 60 minutes.
3. Aggregation Logic - In network watcher traffic analytics, we aggregate flows that have the same Source IP, Destination IP, Destination port and Transport layer protocol (TCP or UDP) (Note: Source port is excluded for aggregation). FlowStartTime_t field indicates the first occurrence of such an aggregated flow (same four tuple) in the flow log processing interval between “FlowIntervalStartTime_t” and “FlowIntervalEndTime_t”
4. In case of AzurePublic and ExternalPublic flows, the customer owned azure VM IP is populated in this field, while the Public IP addresses are being populated in the PublicIPs_s field. For these two flow types, we should use VMIP_s and PublicIPs_s instead of SrcIP_s and DestIP_s fields. For AzurePublic and ExternalPublicIP addresses, we aggregate further, so that the number of records ingested to customer log analytics workspace is minimal.(This field will be deprecated soon and we should be using SrcIP_ and DestIP_s depending on whether azure VM was the source or the destination in the flow)
5. Details for flow types : Based on the IP addresses involved in the flow, we categorize the flows in to the following flow types : <br>
 •	IntraVNet – Both the IP addresses in the flow reside in the same Azure virtual network. <br>
 •	InterVNet - Both the IP addresses in the flow reside in the two different azure virtual networks. <br>
•	S2S – (Site To Site) One of the IP addresses belong to azure virtual network while the other IP address belongs to customer network (Site) connected to the azure virtual network through VPN gateway or express route. <br>
•	P2S - (Point To Site) One of the IP addresses belong to azure virtual network while the other IP address belongs to customer network (Site) connected to the azure virtual network through VPN gateway.<br>
•	AzurePublic - One of the IP addresses belong to azure virtual network while the other IP address belongs to azure internal Public IP addresses owned by Microsoft. Customer owned Public IP addresses won’t be part of this flow type. For instance, any customer owned VM sending traffic to an azure service (Storage endpoint) would be categorized under this flow type. <br>
•	ExternalPublic - One of the IP addresses belong to azure virtual network while the other IP address is a public IP that is not in azure and the public IP is not reported as malicious in the security feeds  that traffic analytics consume for the processing interval between “FlowIntervalStartTime_t” and “FlowIntervalEndTime_t”. <br>
•	MaliciousFlow - One of the IP addresses belong to azure virtual network while the other IP address is a public IP that is not in azure and the public IP is reported as malicious in the security feeds that traffic analytics consume for the processing interval between “FlowIntervalStartTime_t” and “FlowIntervalEndTime_t”. <br>
•	UnknownPrivate - One of the IP addresses belong to azure virtual network while the other IP address belongs to private IP range as refined in RFC 1918 and could not be mapped by network watcher traffic analytics service to a customer owned site or azure virtual network.<br>
•	Unknown – Unable to map the either of the IP addresses in the flows with the customer topology in azure as well as onpremise (site) <br>

    


    


