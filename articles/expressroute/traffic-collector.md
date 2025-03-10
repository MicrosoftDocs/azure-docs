---
title: Azure ExpressRoute Traffic Collector
titleSuffix: Azure ExpressRoute
description: Learn about ExpressRoute Traffic Collector and the different use cases where this feature is helpful.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: concept-article
ms.date: 01/31/2025
ms.author: duau
ms.custom: references_regions
---

# Azure ExpressRoute Traffic Collector

ExpressRoute Traffic Collector allows you to sample network flows over your ExpressRoute circuits. These flow logs are sent to an export destination for further analysis using custom log queries. Supported destinations include [Log Analytics](/azure/azure-monitor/logs/log-analytics-overview), [Event Hubs](/azure/event-hubs/event-hubs-about), and Storage Accounts. You can also export the data to any visualization tool or SIEM (Security Information and Event Management) of your choice. Flow logs can be enabled for both private peering and Microsoft peering with ExpressRoute Traffic Collector.

:::image type="content" source="./media/traffic-collector/main-diagram.png" alt-text="Diagram of ExpressRoute traffic collector in an Azure environment.":::

## Use cases

Flow logs provide insights into various traffic patterns. Common use cases include:

### Network monitoring

- Monitor Azure private peering and Microsoft peering traffic
- Gain near real-time visibility into network throughput and performance
- Perform network diagnosis
- Forecast capacity needs

### Monitor network usage and cost optimization

- Analyze traffic trends by filtering sampled flows by IP, port, or applications
- Identify top talkers for a source IP, destination IP, or applications
- Optimize network traffic expenses by analyzing traffic trends

### Network forensics analysis

- Identify compromised IPs by analyzing associated network flows
- Export flow logs to a SIEM tool to monitor, correlate events, and generate security alerts

## Flow log collection and sampling

Flow logs are collected every 1 minute. All packets for a given flow are aggregated and imported into a Log Analytics workspace for analysis. ExpressRoute Traffic Collector uses a sampling rate of 1:4096, meaning 1 out of every 4,096 packets is captured. This sampling rate might result in short flows (in total bytes) not being collected. However, this doesn't affect network traffic analysis when sampled data is aggregated over a longer period. Flow collection time and sampling rate are fixed and can't be changed.

For more information, see [ExpressRoute limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-expressroute-limits) for the maximum number of flows.

## Supported ExpressRoute circuits

ExpressRoute Traffic Collector supports both Provider-managed circuits and ExpressRoute Direct circuits. Currently, it only supports circuits with a bandwidth of 1Gbps or greater.

## Flow log schema

| Column | Type | Description |
|--|--|--|
| ATCRegion | string | ExpressRoute Traffic Collector (ATC) deployment region. |
| ATCResourceId | string | Azure resource ID of ExpressRoute Traffic Collector (ATC). |
| BgpNextHop | string | Border Gateway Protocol (BGP) next hop as defined in the routing table. |
| DestinationIp | string | Destination IP address. |
| DestinationPort | int | TCP destination port. |
| Dot1qCustomerVlanId | int | Dot1q Customer VlanId. |
| Dot1qVlanId | int | Dot1q VlanId. |
| DstAsn | int | Destination Autonomous System Number (ASN). |
| DstMask | int | Mask of destination subnet. |
| DstSubnet | string | Destination virtual network of destination IP. |
| ExRCircuitDirectPortId | string | Azure resource ID of Express Route Circuit's direct port. |
| ExRCircuitId | string | Azure resource ID of Express Route Circuit. |
| ExRCircuitServiceKey | string | Service key of Express Route Circuit. |
| FlowRecordTime | datetime | Timestamp (UTC) when Express Route Circuit emitted this flow record. |
| Flowsequence | long | Flow sequence of this flow. |
| IcmpType | int | Protocol type as specified in IP header. |
| IpClassOfService | int | IP Class of service as specified in IP header. |
| IpProtocolIdentifier | int | Protocol type as specified in IP header. |
| IpVerCode | int | IP version as defined in the IP header. |
| MaxTtl | int | Maximum time to live (TTL) as defined in the IP header. |
| MinTtl | int | Minimum time to live (TTL) as defined in the IP header. |
| NextHop | string | Next hop as per forwarding table. |
| NumberOfBytes | long | Total number of bytes of packets captured in this flow. |
| NumberOfPackets | long | Total number of packets captured in this flow. |
| OperationName | string | The specific ExpressRoute Traffic Collector operation that emitted this flow record. |
| PeeringType | string | Express Route Circuit peering type. |
| Protocol | int | Protocol type as specified in IP header. |
| \_ResourceId | string | A unique identifier for the resource that the record is associated with |
| SchemaVersion | string | Flow record schema version. |
| SourceIp | string | Source IP address. |
| SourcePort | int | TCP source port. |
| SourceSystem | string |  |
| SrcAsn | int | Source Autonomous System Number (ASN). |
| SrcMask | int | Mask of source subnet. |
| SrcSubnet | string | Source virtual network of source IP. |
| \_SubscriptionId | string | A unique identifier for the subscription that the record is associated with |
| TcpFlag | int | TCP flag as defined in the TCP header. |
| TenantId | string |  |
| TimeGenerated | datetime | Timestamp (UTC) when the ExpressRoute Traffic Collector emitted this flow record. |
| Type | string | The name of the table |

## Region availability

ExpressRoute Traffic Collector is supported in the following regions:

> [!NOTE]
> If your desired region isn't yet supported, you can deploy ExpressRoute Traffic Collector to another region in the same geo-political region as your ExpressRoute Circuit.

| Region | Region Name |
|--|--|
| North American | <ul><li>Canada East</li><li>Canada Central</li><li>Central US</li><li>Central US EUAP</li><li>North Central US</li><li>South Central US</li><li>West Central US</li><li>East US</li><li>East US 2</li><li>West US</li><li>West US 2</li><li>West US 3</li></ul> |
| South America | <ul><li>Brazil South</li><li>Brazil Southeast</li></ul> |
| Europe | <ul><li>West Europe</li><li>North Europe</li><li>UK South</li><li>UK West</li><li>France Central</li><li>France South</li><li>Germany North</li><li>Germany West Central</li><li>Sweden Central</li><li>Sweden South</li><li>Switzerland North</li><li>Switzerland West</li><li>Norway East</li><li>Norway West</li><li>Italy North</li><li>Poland Central</li></ul> |
| Asia | <ul><li>East Asia</li><li>Southeast Asia</li><li>Central India</li><li>South India</li><li>Japan West</li><li>Korea South</li><li>UAE North</li><li>UAE Central</li></ul> |
| Africa | <ul><li>South Africa North</li><li>South Africa West</li></ul> |
| Pacific | <ul><li>Australia Central</li><li>Australia Central 2</li><li>Australia East</li><li>Australia Southeast</li></ul> |

## Pricing

| Zone   | Collector Instance Uptime | Data processed per GB |
|--------|---------------------------|-----------------------|
| Zone 1 | $0.60/hour                | $0.10/GB              |
| Zone 2 | $0.80/hour                | $0.20/GB              |
| Zone 3 | $0.80/hour                | $0.20/GB              |

## Next steps

- Learn how to [set up ExpressRoute Traffic Collector](how-to-configure-traffic-collector.md).
- [ExpressRoute Traffic Collector FAQ](../expressroute/expressroute-faqs.md#expressroute-traffic-collector).
