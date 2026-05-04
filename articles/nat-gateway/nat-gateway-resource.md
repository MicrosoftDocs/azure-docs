---
title: NAT Gateway Resource
description: Learn about NAT gateway resources for the Azure NAT Gateway service.
author: alittleton
ms.service: azure-nat-gateway
ms.topic: concept-article
ms.custom: FY23 content-maintenance
ms.date: 11/04/2025
ms.author: alittleton
#customer intent: As a network administrator, I want to configure and manage a NAT gateway so that I can provide secure and scalable outbound connectivity for my subnets without requiring complex routing configurations.
---

# NAT gateway resource

This article describes the key components of a network address translation (NAT) gateway resource that enable it to provide highly secure, scalable, and resilient outbound connectivity. NAT gateway resources are part of the Azure NAT Gateway service.

You can configure a NAT gateway in your subscription through supported clients. These clients include the Azure portal, the Azure CLI, Azure PowerShell, Azure Resource Manager templates, or appropriate alternatives.

## Azure NAT Gateway SKUs

Azure NAT Gateway is available in two SKUs: StandardV2 and Standard.

:::image type="content" source="./media/nat-gateway-resource/nat-gateway-skus.png" alt-text="Diagram of Standard and StandardV2 SKUs of Azure NAT Gateway." lightbox="./media/nat-gateway-resource/nat-gateway-skus.png":::

The StandardV2 SKU is zone redundant by default. It automatically spans multiple availability zones in a region to provide continued outbound connectivity even if one zone becomes unavailable.

The Standard SKU is a zonal resource. It's deployed into a specific availability zone and is resilient within that zone.

A StandardV2 NAT gateway supports IPv4 and IPv6 public IPs, whereas a Standard NAT gateway supports only IPv4 public IPs.

## Azure NAT Gateway architecture

Azure NAT Gateway uses software-defined networking to operate as a fully managed, distributed service. By design, a NAT gateway spans multiple fault domains, enabling it to withstand multiple failures without any effect to the service.

Azure NAT Gateway provides source network address translation (SNAT) for private instances within the associated subnets of your Azure virtual network. The private IPs of the virtual machines use SNAT for a NAT gateway's static public IP addresses to connect outbound to the internet. Azure NAT Gateway also provides destination network address translation (DNAT) for response packets to an outbound-originated connection only.

:::image type="content" source="./media/nat-gateway-resource/nat-gateway-deployment.png" alt-text="Diagram of a NAT gateway resource with virtual machines for outbound connections to the internet.":::

When a NAT gateway is configured to a subnet within a virtual network, it becomes the subnet's default next hop type for all outbound traffic directed to the internet. No extra routing configurations are required. A NAT gateway doesn't provide unsolicited inbound connections from the internet. DNAT is performed only for packets that arrive as a response to an outbound packet.

## Subnets

You can attach a StandardV2 or Standard NAT gateway to multiple subnets within a virtual network to provide outbound connectivity to the internet. When a NAT gateway is attached to a subnet, it assumes the default route to the internet. The NAT gateway serves as the next hop type for all outbound traffic destined for the internet.

NAT gateways have these limitations for subnet configurations:

* Each subnet can't have more than one NAT gateway attached.

* You can't attach a NAT gateway to subnets from different virtual networks.

* You can't use a NAT gateway with a [gateway subnet](/azure/vpn-gateway/vpn-gateway-about-vpn-gateway-settings#gwsub). A gateway subnet is a designated subnet for a VPN gateway to send encrypted traffic between an Azure virtual network and on-premises location.

## Static public IP addresses

A NAT gateway can be associated with static public IP addresses or public IP prefixes. If you assign a public IP prefix, the entire public IP prefix is used. You can use a public IP prefix directly or [distribute the public IP addresses of the prefix](../virtual-network/ip-services/manage-public-ip-address-prefix.md) across multiple NAT gateway resources. The NAT gateway sends all traffic to the range of IP addresses of the prefix.

These conditions apply:

* A StandardV2 NAT gateway supports up to 16 IPv4 and 16 IPv6 public IP addresses.

* You can't use a Standard NAT gateway with IPv6 public IP addresses or prefixes. A Standard NAT gateway supports up to 16 IPv4 public IP addresses.

* You can't use a NAT gateway with public IP addresses for the Basic SKU.

| Azure NAT Gateway SKU | IPv4 | IPv6 |
| --- | --- | --- |
| StandardV2 | Yes, supports IPv4 public IP addresses and prefixes. | Yes, supports IPv6 public IP addresses and prefixes. |
| Standard | Yes, supports IPv4 public IP addresses and prefixes. | No, does not support IPv6 public IP addresses and prefixes. |

## SNAT ports

SNAT port inventory is provided by the public IP addresses, public IP prefixes, or both attached to a NAT gateway. SNAT port inventory is available on demand to all instances within a subnet attached to the NAT gateway. No preallocation of SNAT ports per instance is required.

For more information about SNAT ports and Azure NAT Gateway, see [Source Network Address Translation (SNAT) with Azure NAT Gateway](nat-gateway-snat.md).

When multiple subnets within a virtual network are attached to the same NAT gateway resource, the SNAT port inventory that the NAT gateway provides is shared across all subnets.

SNAT ports serve as unique identifiers to distinguish connection flows from one another. The *same SNAT port* can be used to connect to *different destination endpoints* at the same time.

*Different SNAT ports* are used to make connections to the *same destination endpoint* in order to distinguish connection flows from one another. SNAT ports being reused to connect to the same destination are placed on a [reuse cool-down timer](#port-reuse-timers) before they can be reused.

:::image type="content" source="./media/nat-gateway-resource/snat-port-allocation.png" alt-text="Diagram of SNAT port allocation.":::

A single NAT gateway can scale by the number of public IP addresses associated with it. Each public IP address for a NAT gateway provides 64,512 SNAT ports to make outbound connections. A NAT gateway can scale up to more than 1 million SNAT ports. TCP and UDP are separate SNAT port inventories and are unrelated to NAT gateways.

## Availability zones

Azure NAT Gateway has two SKUs: Standard and StandardV2. To ensure that your architecture is resilient to zonal failures, deploy a StandardV2 NAT gateway, because it's a zone-redundant resource. When an [availability zone](/azure/reliability/availability-zones-overview) in a region goes down, new connections flow from the remaining healthy zones.

:::image type="content" source="./media/nat-overview/zone-redundant-standard-2.png" alt-text="Diagram of multiple-zone deployment of a StandardV2 NAT gateway.":::

A Standard NAT gateway is a zonal resource, which means you can deploy and operate it out of individual availability zones. If the zone that's associated with a Standard NAT gateway goes down, the outage affects outbound connectivity for the subnets associated with the NAT gateway.

For more information about availability zones and Azure NAT Gateway, see [Reliability in Azure NAT Gateway](/azure/reliability/reliability-nat-gateway).

:::image type="content" source="./media/nat-overview/zonal-standard-1.png" alt-text="Diagram of a single-zone deployment of a Standard NAT gateway.":::

After you deploy a NAT gateway, you can't change the zone selection.

## Protocols

A NAT gateway interacts with IP and IP transport headers of UDP and TCP flows. A NAT gateway is agnostic to application-layer payloads. Other IP protocols, such as ICMP, aren't supported.

## TCP reset

A TCP reset packet is sent when a NAT gateway detects traffic on a connection flow that doesn't exist. The TCP reset packet indicates to the receiving endpoint that the connection flow was released and any future communication on this same TCP connection will fail. TCP reset is unidirectional for a NAT gateway.

The connection flow might not exist if:

* The connection reached the idle timeout after a period of inactivity on the connection flow, and the connection is silently dropped.

* The sender, either from the Azure network side or from the public internet side, sent traffic after the connection dropped.

The system sends a TCP reset packet only when it detects traffic on the dropped connection flow. This operation means a TCP reset packet might not be sent right away after a connection flow drops.

The system sends a TCP reset packet in response to detecting traffic on a nonexistent connection flow, regardless of whether the traffic originates from the Azure network side or the public internet side.

## TCP idle timeout

A NAT gateway provides a configurable idle timeout range of 4 minutes to 120 minutes for TCP protocols. UDP protocols have a nonconfigurable idle timeout of 4 minutes.

When a connection goes idle, the NAT gateway holds onto the SNAT port until the connection idle times out. Because long idle timeout timers can unnecessarily increase the likelihood of SNAT port exhaustion, we don't recommend that you increase the TCP idle timeout duration to longer than the default time of 4 minutes. The idle timer doesn't affect a flow that never goes idle.

You can use TCP keepalives to provide a pattern of refreshing long idle connections and endpoint liveness detection. For more information, see [these .NET examples](/dotnet/api/system.net.servicepoint.settcpkeepalive). TCP keepalives appear as duplicate acknowledgements (ACKs) to the endpoints, are low overhead, and are invisible to the application layer.

UDP idle timeout timers aren't configurable. You should use UDP keepalives to ensure that the connection doesn't reach the idle timeout value, and to maintain the connection. Unlike TCP connections, a UDP keepalive enabled on one side of the connection applies only to traffic flow in one direction. You must enable UDP keepalives on both sides of the traffic flow to keep the traffic flow alive.

## Timers

### Port reuse timers

Port reuse timers determine the amount of time after a connection closes that a source port is in hold-down before it can be reused for a new connection to go to the same destination endpoint by the NAT gateway.

The following table provides information about when a TCP port becomes available for reuse to the same destination endpoint by the NAT gateway.

| Timer | Description | Value |
| --- | --- | --- |
| TCP FIN | After a TCP FIN packet closes a connection, a 65-second timer holds down the SNAT port. The SNAT port is available for reuse after the timer ends. | 65 seconds |
| TCP RST | After a TCP RST packet (reset) closes a connection, a 16-second timer holds down the SNAT port. When the timer ends, the port is available for reuse. | 16 seconds |
| TCP half open | During connection establishment where one connection endpoint is waiting for acknowledgment from the other endpoint, a 30-second timer begins. If no traffic is detected, the connection closes. After the connection closes, the source port is available for reuse to the same destination endpoint. | 30 seconds |

For UDP traffic, after a connection closes, the port is in hold-down for 65 seconds before it's available for reuse.

### Idle timeout timers

| Timer | Description | Value |
| --- | --- | --- |
| TCP idle timeout | TCP connections can go idle when neither endpoint transmits any data for a prolonged period of time. You can configure a timer from 4 minutes (default) to 120 minutes (2 hours) to time out an idle connection. Traffic on the flow resets the idle timeout timer. | Configurable; 4 minutes (default) to 120 minutes |
| UDP idle timeout | UDP connections can go idle when endpoints don't transmit data for a prolonged period of time. UDP idle timeout timers are 4 minutes and are *not configurable*. Traffic on the flow resets the idle timeout timer. | Not configurable; 4 minutes |

> [!NOTE]
> These timer settings are subject to change. The provided values can help with troubleshooting. You shouldn't take a dependency on specific timers at this time.

## Bandwidth

Each SKU of Azure NAT Gateway has bandwidth limits:

* A StandardV2 NAT gateway supports up to 100 Gbps of data throughput per NAT gateway resource.

* A Standard NAT gateway provides 50 Gbps of throughput, which is split between outbound and inbound (response) data. Data throughput is rate limited at 25 Gbps for outbound and 25 Gbps for inbound (response) data per Standard NAT gateway resource.

## Performance

Standard and StandardV2 NAT gateways each support up to 50,000 concurrent connections per public IP address *to the same destination endpoint* over the internet for TCP and UDP traffic.

Each can support up to 2 million active connections simultaneously. The number of connections on a NAT gateway is counted based on the 5-tuple (source IP address, source port, destination IP address, destination port, and protocol). If a NAT gateway exceeds 2 million connections, the data path's availability declines and new connections fail.

A StandardV2 NAT gateway can process up to 10 million packets per second. A Standard NAT gateway can process up to 5 million packets per second.

## Limitations

* Standard and Basic public IPs aren't compatible with StandardV2 NAT gateways. Use StandardV2 public IPs instead.
  
  To create a StandardV2 public IP, see [Create an Azure public IP](../virtual-network/ip-services/create-public-ip-portal.md).

* Basic load balancers aren't compatible with NAT gateways. Use Standard load balancers for both Standard and StandardV2 NAT gateways.
  
  To upgrade a load balancer from Basic to Standard, see [Upgrade an Azure public load balancer](../load-balancer/upgrade-basic-standard.md).

* Basic public IPs aren't compatible with Standard NAT gateways. Use Standard public IPs instead.
  
  To upgrade a public IP address from Basic to Standard, see [Upgrade a Basic public IP address to Standard](../virtual-network/ip-services/public-ip-basic-upgrade-guidance.md).

* Azure NAT Gateway doesn't support ICMP.

* IP fragmentation isn't available for Azure NAT Gateway.

* Azure NAT Gateway doesn't support public IP addresses with a routing configuration type of **Internet**. To see a list of Azure services that do support the **Internet** routing configuration on public IPs, see [Supported services for routing over the public internet](/azure/virtual-network/ip-services/routing-preference-overview#supported-services).

* Azure NAT Gateway doesn't support public IPs with DDoS protection enabled. For more information, see [DDoS limitations](/azure/ddos-protection/ddos-protection-sku-comparison#limitations).
  
* Azure NAT Gateway isn't supported in a secured virtual hub network (vWAN) architecture.

* You can't upgrade a Standard NAT gateway to a StandardV2 NAT gateway. To achieve zone resiliency for architectures that use zonal NAT gateways, you must deploy a StandardV2 NAT gateway to replace the Standard SKU NAT gateway.

* You can't use Standard public IPs with a StandardV2 NAT gateway. You must re-IP to new StandardV2 public IPs to use a StandardV2 NAT gateway.

For more known limitations of StandardV2 NAT gateways, see [Azure NAT Gateway SKUs](nat-sku.md).

## Related content

* Review the [Azure NAT Gateway overview](nat-overview.md).
* Learn about [metrics and alerts for Azure NAT Gateway](nat-metrics.md).
* Learn how to [troubleshoot Azure NAT Gateway](troubleshoot-nat.md).
