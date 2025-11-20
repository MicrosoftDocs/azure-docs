---
title: Azure NAT Gateway resource
description: Learn about the NAT gateway resource of the Azure NAT Gateway service.
author: alittleton
ms.service: azure-nat-gateway
ms.topic: concept-article
ms.custom: FY23 content-maintenance
ms.date: 11/04/2025
ms.author: alittleton
# Customer intent: "As a network administrator, I want to configure and manage an Azure NAT Gateway, so that I can ensure secure and scalable outbound connectivity for my subnets without requiring complex routing configurations."
---

# Azure NAT Gateway resource

This article describes the key components of the NAT gateway resource that enable it to provide highly secure, scalable, and resilient outbound connectivity. NAT Gateway can be configured in your subscription through supported clients. These clients include Azure portal, Azure CLI, Azure PowerShell, Resource Manager templates, or appropriate alternatives.

> [!IMPORTANT]
> Standard V2 SKU Azure NAT Gateway is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## NAT Gateway SKUs
NAT Gateway is available in two SKUs: StandardV2 and Standard. 

:::image type="content" source="./media/nat-gateway-resource/nat-gateway-skus.png" alt-text="Diagram of Standard and StandardV2 SKUs of NAT Gateway." lightbox="./media/nat-gateway-resource/nat-gateway-skus.png":::

*Figure 1: Standard and StandardV2 SKUs of NAT Gateway.*

StandardV2 SKU is zone-redundant by default. It automatically spans across multiple availability zones in a region, ensuring continued outbound connectivity even if one zone becomes unavailable.

Standard SKU is a zonal resource. It is deployed into a specific availability zone and is resilient within that zone.

StandardV2 SKU NAT Gateway also supports IPv6 public IPs, whereas Standard SKU NAT Gateway only supports IPv4 public IPs.

## NAT Gateway architecture

Azure NAT Gateway uses software-defined networking to operate as a fully managed, distributed service. By design, NAT Gateway spans multiple fault domains, enabling it to withstand multiple failures without any effect to the service.
NAT Gateway provides source network address translation (SNAT) for private instances within the associated subnets of your Azure virtual network. The private IPs of the virtual machines SNAT to a NAT gateway's static public IP addresses to connect outbound to the internet. NAT Gateway also provides destination network address translation (DNAT) for response packets to an outbound originated connection only.

:::image type="content" source="./media/nat-gateway-resource/nat-gateway-deployment.png" alt-text="Diagram of a NAT gateway resource with virtual machines.":::

*Figure: NAT gateway for outbound to internet*

When configured to a subnet within a virtual network, NAT Gateway becomes the subnet's default next hop type for all outbound traffic directed to the internet. No extra routing configurations are required. NAT Gateway doesn't provide unsolicited inbound connections from the internet. DNAT is only performed for packets that arrive as a response to an outbound packet.

## Subnets

StandardV2 and Standard NAT Gateway can be attached to multiple subnets within a virtual network to provide outbound connectivity to the internet. When NAT Gateway is attached to a subnet, it assumes the default route to the internet. NAT Gateway serves as the next hop type for all outbound traffic destined to the internet.

The following subnet configurations can’t be used with NAT Gateway:

* Each subnet can’t have more than one NAT Gateway attached.

* NAT Gateway can’t be attached to subnets from different virtual networks.

* NAT Gateway can’t be used with a gateway subnet. A gateway subnet is a designated subnet for a VPN gateway to send encrypted traffic between an Azure virtual network and on-premises location. For more information about the gateway subnet, see [Gateway subnet](/azure/vpn-gateway/vpn-gateway-about-vpn-gateway-settings#gwsub).

## Static public IP addresses

NAT Gateway can be associated with static public IP addresses or public IP prefixes. If you assign a public IP prefix, the entire public IP prefix is used. You can use a public IP prefix directly or [distribute the public IP addresses of the prefix](../virtual-network/ip-services/manage-public-ip-address-prefix.md) across multiple NAT gateway resources.  NAT gateway sends all traffic to the range of IP addresses of the prefix.

* StandardV2 NAT Gateway supports up to 16 IPv4 and 16 IPv6 public IP addresses.
*	Standard NAT Gateway can’t be used with IPv6 public IP addresses or prefixes. It supports up to 16 IPv4 public IP addresses.
* NAT Gateway can’t be used with basic SKU public IP addresses.

| NAT Gateway SKU | IPv4 | IPv6 |
| --- | --- | --- |
| StandardV2 | 	Yes, supports IPv4 public IP addresses and prefixes. | 	Yes, supports IPv6 public IP addresses and prefixes. |
| Standard | 	Yes, supports IPv4 public IP addresses and prefixes. | 	No, does not support IPv6 public IP addresses and prefixes. |

## SNAT ports

SNAT port inventory is provided by the public IP addresses, public IP prefixes, or both attached to a NAT gateway. SNAT port inventory is made available on-demand to all instances within a subnet attached to the NAT gateway. No preallocation of SNAT ports per instance is required.

For more information about SNAT ports and Azure NAT Gateway, see [Source Network Address Translation (SNAT) with Azure NAT Gateway](nat-gateway-snat.md).

When multiple subnets within a virtual network are attached to the same NAT gateway resource, the SNAT port inventory provided by NAT Gateway is shared across all subnets.

SNAT ports serve as unique identifiers to distinguish different connection flows from one another. The **same SNAT port** can be used to connect to **different destination endpoints** at the same time.

**Different SNAT ports** are used to make connections to the **same destination endpoint** in order to distinguish different connection flows from one another. SNAT ports being reused to connect to the same destination are placed on a [reuse cool down timer](#port-reuse-timers) before they can be reused.

:::image type="content" source="./media/nat-gateway-resource/snat-port-allocation.png" alt-text="Diagram of SNAT port allocation.":::

*Figure: SNAT port allocation*

A single NAT gateway can scale by the number of public IP addresses associated to it. Each NAT gateway public IP address provides 64,512 SNAT ports to make outbound connections. A NAT gateway can scale up to over 1 million SNAT ports. TCP and UDP are separate SNAT port inventories and are unrelated to NAT Gateway.

## Availability zones

NAT Gateway has two SKUs – Standard and StandardV2. To ensure that your architecture is resilient to zonal failures, deploy StandardV2 NAT gateway as it is a zone-redundant resource. When an [availability zone](../reliability/availability-zones-overview.md) in a region goes down, new connections flow from the remaining healthy zones.

:::image type="content" source="./media/nat-overview/zone-redundant-standard-2.png" alt-text="Diagram of multi-zone deployment of StandardV2 NAT Gateway.":::

*Figure: Multi-zone deployment of StandardV2 NAT Gateway.* 

Standard NAT gateway is a zonal resource, which means it can be deployed and operate out of individual availability zones. If the zone that is associated to Standard NAT gateway goes down, then outbound connectivity for the subnets associated to the NAT gateway are impacted.

For more information about availability zones and Azure NAT Gateway, see [Availability zones design considerations](/azure/nat-gateway/nat-availability-zones#design-considerations).

:::image type="content" source="./media/nat-overview/zonal-standard-1.png" alt-text="Diagram of single zone deployment of Standard NAT Gateway.":::

*Figure: Single zone deployment of Standard NAT Gateway.*

After a NAT gateway is deployed, the zone selection can't be changed.

## Protocols

NAT Gateway interacts with IP and IP transport headers of UDP and TCP flows. NAT Gateway is agnostic to application layer payloads. Other IP protocols, such as ICMP, aren't supported.

## TCP reset

A TCP reset packet is sent when a NAT gateway detects traffic on a connection flow that doesn't exist. The TCP reset packet indicates to the receiving endpoint that the connection flow has been released and any future communication on this same TCP connection will fail. TCP reset is uni-directional for a NAT gateway.

The connection flow may not exist if:

* The idle timeout was reached after a period of inactivity on the connection flow and the connection is silently dropped.

* The sender, either from the Azure network side or from the public internet side, sent traffic after the connection dropped.

A TCP reset packet is sent only upon detecting traffic on the dropped connection flow. This operation means a TCP reset packet may not be sent right away after a connection flow drops.

The system sends a TCP reset packet in response to detecting traffic on a nonexisting connection flow, regardless of whether the traffic originates from the Azure network side or the public internet side.

## TCP idle timeout

A NAT gateway provides a configurable idle timeout range of 4 minutes to 120 minutes for TCP protocols. UDP protocols have a nonconfigurable idle timeout of 4 minutes.

When a connection goes idle, the NAT gateway holds onto the SNAT port until the connection idle times out. Because long idle timeout timers can unnecessarily increase the likelihood of SNAT port exhaustion, it isn't recommended to increase the TCP idle timeout duration to longer than the default time of 4 minutes. The idle timer doesn't affect a flow that never goes idle.

TCP keepalives can be used to provide a pattern of refreshing long idle connections and endpoint liveness detection. For more information, see these [.NET examples](/dotnet/api/system.net.servicepoint.settcpkeepalive). TCP keepalives appear as duplicate ACKs to the endpoints, are low overhead, and invisible to the application layer.

UDP idle timeout timers aren't configurable, UDP keepalives should be used to ensure that the idle timeout value isn't reached, and that the connection is maintained. Unlike TCP connections, a UDP keepalive enabled on one side of the connection only applies to traffic flow in one direction. UDP keepalives must be enabled on both sides of the traffic flow in order to keep the traffic flow alive.

## Timers

### Port Reuse Timers

Port reuse timers determine the amount of time after a connection closes that a source port is in hold down before it can be reused for a new connection to go to the same destination endpoint by the NAT gateway.  

The following table provides information about when a TCP port becomes available for reuse to the same destination endpoint by the NAT gateway. 

| Timer | Description | Value |
|---|---|---|
| TCP FIN | After a connection closes by a TCP FIN packet, a 65-second timer is activated that holds down the SNAT port. The SNAT port is available for reuse after the timer ends. | 65 seconds |
| TCP RST | After a connection closes by a TCP RST packet (reset), a 16-second timer is activated that holds down the SNAT port. When the timer ends, the port is available for reuse. | 16 seconds |
| TCP half open | During connection establishment where one connection endpoint is waiting for acknowledgment from the other endpoint, a 30-second timer is activated. If no traffic is detected, the connection closes. Once the connection closes, the source port is available for reuse to the same destination endpoint. | 30 seconds |

For UDP traffic, after a connection closes, the port is in hold down for 65 seconds before it's available for reuse.

### Idle Timeout Timers

| Timer | Description | Value |
|---|---|---|
| TCP idle timeout | TCP connections can go idle when no data is transmitted between either endpoint for a prolonged period of time. A timer can be configured from 4 minutes (default) to 120 minutes (2 hours) to time out an idle connection. Traffic on the flow resets the idle timeout timer. | Configurable; 4 minutes (default) - 120 minutes |
| UDP idle timeout | UDP connections can go idle when no data is transmitted between either endpoint for a prolonged period of time. UDP idle timeout timers are 4 minutes and are **not configurable**. Traffic on the flow resets the idle timeout timer. | **Not configurable**; 4 minutes |

> [!NOTE]
> These timer settings are subject to change. The values are provided to help with troubleshooting and you shouldn't take a dependency on specific timers at this time.

## Bandwidth
There are different bandwidth limits for each SKU of NAT Gateway.
StandardV2 SKU NAT Gateway supports up to 100 Gbps of data throughput per NAT gateway resource.
Standard SKU NAT Gateway provides 50 Gbps of throughput, which is split between outbound and inbound (response) data. Data throughput is rate limited at 25 Gbps for outbound and 25 Gbps for inbound (response) data per Standard NAT gateway resource.

## Performance

Standard and StandardV2 NAT gateway each support up to 50,000 concurrent connections per public IP address **to the same destination endpoint** over the internet for TCP and UDP traffic. 

Each can support up to 2 million active connections simultaneously. The number of connections on NAT Gateway is counted based on the 5-tuple (source IP address, source port, destination IP address, destination port, and protocol). If NAT gateway exceeds 2 million connections, the datapath availability declines and new connections fail.

StandardV2 NAT gateway can process up to 10M packets per second. Standard NAT gateway can process up to 5M packets per second.

## Limitations

- Standard and basic public IPs are not compatible with StandardV2 NAT gateway. Use StandardV2 public IPs instead. 
  
  - To create a StandardV2 public IP, see [Create Azure Public IP](../virtual-network/ip-services/create-public-ip-portal.md)

- Basic load balancers are not compatible with NAT gateway. Use Standard load balancers for both Standard and StandardV2 NAT gateways.
  
  -	To upgrade a load balancer from basic to standard, see [Upgrade Azure Public Load Balancer](../load-balancer/upgrade-basic-standard.md)
 
-	Basic public IPs are not compatible with Standard NAT gateway. Use Standard public IPs instead.
  
  -	To upgrade a public IP address from basic to standard, see [Upgrade Basic Public IP Address to Standard](../virtual-network/ip-services/public-ip-basic-upgrade-guidance.md)

- NAT gateway doesn't support ICMP 

- IP fragmentation isn't available for NAT Gateway.

- NAT Gateway doesn't support Public IP addresses with routing configuration type **internet**. To see a list of Azure services that do support routing configuration **internet** on public IPs, see [supported services for routing over the public internet](/azure/virtual-network/ip-services/routing-preference-overview#supported-services).

- Public IPs with DDoS protection enabled aren't supported with NAT gateway. For more information, see [DDoS limitations](/azure/ddos-protection/ddos-protection-sku-comparison#limitations).
  
- Azure NAT Gateway isn't supported in a secured virtual hub network (vWAN) architecture.

- Standard SKU NAT Gateway can’t be upgraded to StandardV2 SKU NAT Gateway. You must deploy StandardV2 SKU NAT Gateway and replace Standard SKU NAT Gateway to achieve zone-resiliency for architectures using zonal NAT gateways.

- Standard SKU public IPs can’t be used with StandardV2 NAT Gateway. You must re-IP to new StandardV2 SKU public IPs to use StandardV2 NAT Gateway.

- For more known limitations of StandardV2 NAT Gateway, see [NAT Gateway SKUs](nat-sku.md). 

## Next steps

- Review [Azure NAT Gateway](nat-overview.md).

- Learn about [metrics and alerts for NAT gateway](nat-metrics.md).

- Learn how to [troubleshoot NAT gateway](troubleshoot-nat.md).
