---
title: Azure NAT Gateway resource
description: Learn about the NAT gateway resource of the Azure NAT Gateway service.
author: asudbring
ms.service: nat-gateway
ms.topic: article
ms.workload: infrastructure-services
ms.custom: ignite-2022, FY23 content-maintenance
ms.date: 07/10/2023
ms.author: allensu
---

# Azure NAT Gateway resource

This article describes the key components of the NAT gateway resource that enable it to provide highly secure, scalable and resilient outbound connectivity. Some of these components can be configured in your subscription through the Azure portal, Azure CLI, Azure PowerShell, Resource Manager templates or appropriate alternatives.

## NAT Gateway architecture

NAT Gateway uses software defined networking to operate as a distributed and fully managed service. Because NAT Gateway has multiple fault domains, it's able to withstand multiple failures without any effect to the service.

NAT Gateway provides source network address translation (SNAT) for private instances within subnets of your Azure virtual network. When configured on a subnet, the private IPs within your subnets SNAT to a NAT gateway's static public IP addresses to connect outbound to the internet. NAT Gateway also provides destination network address translation (DNAT) for response packets to an outbound originated connection only.

:::image type="content" source="./media/nat-overview/flow-direction1.png" alt-text="Diagram of a NAT gateway resource with virtual machines and a Virtual Machine Scale Set.":::

*Figure: NAT gateway for outbound to internet*

When a NAT gateway is attached to a subnet within a virtual network, the NAT gateway assumes the subnet’s default next hop type for all outbound traffic directed to the internet. No extra routing configurations are required. NAT Gateway doesn't provide unsolicited inbound connections from the internet. DNAT is only performed for packets that arrive as a response to an outbound packet.

## Subnets

A NAT gateway can be attached to multiple subnets within a virtual network to provide outbound connectivity to the internet. When a NAT gateway is attached to a subnet, it assumes the default route to the internet. The NAT gateway will then be the next hop type for all outbound traffic destined to the internet.

The following subnet configurations can’t be used with a NAT gateway:

* A subnet can’t be attached to more than one NAT gateway. The NAT gateway becomes the default route to the internet for a subnet, only one NAT gateway can serve as the default route.

* A NAT gateway can’t be attached to subnets from different virtual networks.

* A NAT gateway can’t be used with a gateway subnet. A gateway subnet is a designated subnet for a VPN gateway to send encrypted traffic between an Azure virtual network and on-premises location. For more information about the gateway subnet, see [Gateway subnet](/azure/vpn-gateway/vpn-gateway-about-vpn-gateway-settings#gwsub).

## Static public IP addresses

A NAT gateway can be associated with static public IP addresses or public IP prefixes for providing outbound connectivity. NAT Gateway supports IPv4 addresses. A NAT gateway can use public IP addresses or prefixes in any combination up to a total of 16 IP addresses.

* A NAT gateway can’t be used with IPv6 public IP addresses or prefixes.

* A NAT gateway can’t be used with basic SKU public IP addresses.

> [!NOTE]
> If you assign a public IP prefix, the entire public IP prefix is used. You can't assign a public IP prefix and then break out individual IP addresses to assign to other resources. If you want to assign individual IP addresses from a public IP prefix to multiple resources, you need to create individual public IP addresses and assign them as needed instead of using the public IP prefix itself.

## SNAT ports

SNAT port inventory is provided by the public IP addresses, public IP prefixes or both attached to a NAT gateway. SNAT port inventory is made available on-demand to all instances within a subnet attached to the NAT gateway. No preallocation of SNAT ports per instance is required.

For more information about SNAT ports and Azure NAT Gateway, see [Source Network Address Translation (SNAT) with Azure NAT Gateway](nat-gateway-snat.md).

When multiple subnets within a virtual network are attached to the same NAT gateway resource, the SNAT port inventory provided by NAT Gateway is shared across all subnets.

SNAT ports serve as unique identifiers to distinguish different connection flows from one another. The **same SNAT port** can be used to connect to **different destination endpoints** at the same time.

**Different SNAT ports** are used to make connections to the **same destination endpoint** in order to distinguish different connection flows from one another. SNAT ports being reused to connect to the same destination are placed on a [reuse cool down timer](#port-reuse-timers) before they can be reused.

A single NAT gateway can scale up to 16 IP addresses. Each NAT gateway public IP address provides 64,512 SNAT ports to make outbound connections. A NAT gateway can scale up to over 1 million SNAT ports. TCP and UDP are separate SNAT port inventories and are unrelated to NAT Gateway.

## Availability zones

A NAT gateway can be created in a specific availability zone or placed in **no zone**. When a NAT gateway is placed in no zone, Azure selects a zone for the NAT gateway to reside in.

Zone redundant public IP addresses can be used with no zone NAT gateway resources.

The recommendation is to configure a NAT gateway to individual availability zones. Additionally, it should be attached to subnets with private instances from the same zone. For more information about availability zones and Azure NAT Gateway, see [Availability zones design considerations](/azure/nat-gateway/nat-availability-zones#design-considerations).

:::image type="content" source="./media/nat-availability-zones/multiple-zonal-nat-gateways.png" alt-text="Diagram of zonal isolation by creating zonal stacks.":::

After a NAT gateway is deployed, the zone selection can't be changed.

## Protocols

NAT Gateway interacts with IP and IP transport headers of UDP and TCP flows. NAT Gateway is agnostic to application layer payloads. Other IP protocols aren't supported.

## TCP reset

A TCP reset packet is sent when a NAT gateway detects traffic on a connection flow that doesn't exist. The TCP reset packet indicates to the receiving endpoint that the release of the connection flow has occurred and any future communication on this same TCP connection will fail. TCP reset is uni-directional for a NAT gateway.

The connection flow may not exist if:

* The idle timeout was reached after a period of inactivity on the connection flow and the connection is silently dropped.

* The sender, either from the Azure network side or from the public internet side, sent traffic after the connection dropped.

A TCP reset packet is sent only upon detecting traffic on the dropped connection flow. This operation means a TCP reset packet may not be sent right away after a connection flow has dropped.

The system sends a TCP reset packet in response to detecting traffic on a nonexisting connection flow, regardless of whether the traffic originates from the Azure network side or the public internet side.

## TCP idle timeout

A NAT gateway provides a configurable idle timeout range of 4 minutes to 120 minutes for TCP protocols. UDP protocols have a nonconfigurable idle timeout of 4 minutes.

When a connection goes idle, the NAT gateway holds onto the SNAT port until the connection idle times out. Because long idle timeout timers can unnecessarily increase the likelihood of SNAT port exhaustion, it isn't recommended to increase the TCP idle timeout duration to longer than the default time of 4 minutes. The idle timer doesn't affect a flow that never goes idle.

TCP keepalives can be used to provide a pattern of refreshing long idle connections and endpoint liveness detection. For more information, see these [.NET examples] (/dotnet/api/system.net.servicepoint.settcpkeepalive). TCP keepalives appear as duplicate ACKs to the endpoints, are low overhead, and invisible to the application layer.

UDP idle timeout timers aren't configurable, UDP keepalives should be used to ensure that the idle timeout value isn't reached, and that the connection is maintained. Unlike TCP connections, a UDP keepalive enabled on one side of the connection only applies to traffic flow in one direction. UDP keepalives must be enabled on both sides of the traffic flow in order to keep the traffic flow alive.

## Timers

### Port Reuse Timers

Port reuse timers determine the amount of time after a connection closes that a source port is in hold down before it can be reused to go to the same destination endpoint by the NAT gateway.  

The following table provides information about when a TCP port becomes available for reuse to the same destination endpoint by the NAT gateway. 

| Timer | Description | Value |
|---|---|---|
| TCP FIN | After a connection closes by a TCP FIN packet, a 65-second timer is activated that holds down the SNAT port. The SNAT port is available for reuse after the timer ends. | 65 seconds |
| TCP RST | After a connection closes by a TCP RST packet (reset), a 16-second timer is activated that holds down the SNAT port. When the timer ends, the port is available for reuse. | 16 seconds |
| TCP half open | During connection establishment where one connection endpoint is waiting for acknowledgment from the other endpoint, a 30-second timer is activated. If no traffic is detected, the connection closes. Once the connection has closed, the source port is available for reuse to the same destination endpoint. | 30 seconds |

For UDP traffic, after a connection closes, the port is in hold down for 65 seconds before it's available for reuse.

### Idle Timeout Timers

| Timer | Description | Value |
|---|---|---|
| TCP idle timeout | TCP connections can go idle when no data is transmitted between either endpoint for a prolonged period of time. A timer can be configured from 4 minutes (default) to 120 minutes (2 hours) to time out a connection that has gone idle. Traffic on the flow resets the idle timeout timer. | Configurable; 4 minutes (default) - 120 minutes |
| UDP idle timeout | UDP connections can go idle when no data is transmitted between either endpoint for a prolonged period of time. UDP idle timeout timers are 4 minutes and are **not configurable**. Traffic on the flow resets the idle timeout timer. | **Not configurable**; 4 minutes |

> [!NOTE]
> These timer settings are subject to change. The values are provided to help with troubleshooting and you should not take a dependency on specific timers at this time.

## Bandwidth

Each NAT gateway can provide up to 50 Gbps of throughput. This data throughput includes data processed both outbound and inbound (response) through a NAT gateway resource. You can split your deployments into multiple subnets and assign each subnet or group of subnets to a NAT gateway to scale out.

## Performance

A NAT gateway can support up to 50,000 concurrent connections per public IP address **to the same destination endpoint** over the internet for TCP and UDP. The NAT gateway can process 1M packets per second and scale up to 5M packets per second.

The total number of connections that a NAT gateway can support at any given time is up to 2 million. While it's possible that the NAT gateway can exceed 2 million connections, you have increased risk of connection failures.

## Limitations

- Basic load balancers and basic public IP addresses aren't compatible with NAT gateway. Use standard SKU load balancers and public IPs instead.
  
  - To upgrade a load balancer from basic to standard, see [Upgrade Azure Public Load Balancer](../load-balancer/upgrade-basic-standard.md)
  
  - To upgrade a public IP address from basic to standard, see [Upgrade a public IP address](../virtual-network/ip-services/public-ip-upgrade-portal.md)

- NAT gateway doesn't support ICMP 

- IP fragmentation isn't available for NAT Gateway.

- NAT Gateway doesn't support Public IP addresses with routing configuration type **internet**. To see a list of Azure services that do support routing configuration **internet** on public IPs, see [supported services for routing over the public internet](/azure/virtual-network/ip-services/routing-preference-overview#supported-services).

- Public IPs with DDoS protection enabled are not supported with NAT gateway. See [DDoS limitations](/azure/ddos-protection/ddos-protection-sku-comparison#limitations) for more information. 

## Next steps

- Review [Azure NAT Gateway](nat-overview.md).

- Learn about [metrics and alerts for NAT gateway](nat-metrics.md).

- Learn how to [troubleshoot NAT gateway](troubleshoot-nat.md).
