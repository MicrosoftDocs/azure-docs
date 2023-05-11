---
title: Design virtual networks with NAT gateway
titleSuffix: Azure NAT Gateway
description: Learn how to design virtual networks that use Network Address Translation (NAT) gateway resources.
author: asudbring
ms.service: nat-gateway
ms.topic: article
ms.workload: infrastructure-services
ms.custom: ignite-2022, FY23 content-maintenance
ms.date: 12/06/2022
ms.author: allensu
---

# Design virtual networks with NAT gateway

NAT gateway provides outbound internet connectivity for one or more subnets of a virtual network. Once NAT gateway is associated to a subnet, NAT gateway provides source network address translation (SNAT) for that subnet. NAT gateway specifies which static IP addresses virtual machines use when creating outbound flows. Static IP addresses come from public IP addresses, public IP prefixes, or both. If a public IP prefix is used, all IP addresses of the entire public IP prefix are consumed by a NAT gateway. A NAT gateway can use up to 16 static IP addresses from either.

:::image type="content" source="./media/nat-overview/flow-direction1.png" alt-text="Diagram of a NAT gateway resource with virtual machines and a Virtual Machine Scale Set.":::

*Figure: NAT gateway for outbound to internet*

## How to deploy NAT

Deployments are intentionally made simple:

NAT gateway:

- Create a non-zonal or zonal NAT gateway.

- Assign a public IP address or public IP prefix.

- If necessary, modify TCP idle timeout (optional). Review [timers](#timers) before you change the default.

Virtual network:

- Configure virtual network subnet to use a NAT gateway.

User-defined routes aren't necessary.

## Design guidance

Review this section to familiarize yourself with considerations for designing virtual networks with NAT gateway.

### Connect to Azure services with Private Link

Connecting from your Azure virtual network to Azure PaaS services can be done directly over the Azure backbone and bypass the internet. When you bypass the internet to connect to other Azure PaaS services, you free up SNAT ports and reduce the risk of SNAT port exhaustion. [Private Link](../private-link/private-link-overview.md) should be used when possible to connect to Azure PaaS services in order to free up SNAT port inventory.

Private Link uses the private IP addresses of your virtual machines or other compute resources from your Azure network to directly connect privately and securely to Azure PaaS services over the Azure backbone. See a list of [available Azure services](../private-link/availability.md) that are supported by Private Link.

### Connect to the internet with NAT gateway

NAT gateway is recommended for all production workloads where you need to connect to a public endpoint over the internet. Outbound connectivity takes place right away upon deployment of a NAT gateway with a subnet and at least one public IP address. No additional routing configurations are required to start connecting outbound with NAT gateway. NAT gateway becomes the default route to the internet after association to a subnet. 

In the presence of other outbound configurations within a virtual network, such as Load balancer or instance-level public IPs (IL PIPs), NAT gateway takes precedence for outbound connectivity. All new outbound initiated and return traffic starts using NAT gateway. There's no down time on outbound connectivity after adding NAT gateway to a subnet with existing outbound configurations.

### Coexistence of outbound and inbound connectivity 

NAT gateway, load balancer and instance-level public IPs are flow direction aware. NAT gateway can coexist in the same virtual network as a load balancer and instance-level public IPs to provide outbound and inbound connectivity seamlessly. Inbound traffic through a load balancer or instance-level public IPs is translated separately from outbound traffic through NAT gateway. 

The following examples demonstrate co-existence of a load balancer or instance-level public IPs with a NAT gateway. Inbound traffic traverses the load balancer or public IP. Outbound traffic traverses the NAT gateway.

#### NAT and VM with an instance-level public IP

:::image type="content" source="./media/nat-overview/flow-direction2.png" alt-text="Diagram of a NAT gateway resource that consumes all IP addresses for a public IP prefix. The NAT gateway directs traffic for two subnets of VMs and a Virtual Machine Scale Set.":::

*Figure: NAT gateway and VM with an instance level public IP*

| Direction | Resource |
|:---:|:---:|
| Inbound | VM with instance-level public IP |
| Outbound | NAT gateway |

VM will use NAT gateway for outbound. Inbound originated isn't affected.

#### NAT and VM with a standard public load balancer

:::image type="content" source="./media/nat-overview/flow-direction3.png" alt-text="Diagram that depicts a NAT gateway that supports outbound traffic to the internet from a virtual network and inbound traffic with a public load balancer.":::

*Figure: NAT gateway and VM with a standard public load balancer*

| Direction | Resource |
|:---:|:---:|
| Inbound | Standard public load balancer |
| Outbound | NAT gateway |

Any outbound configuration from a load-balancing rule or outbound rules is superseded by NAT gateway. Inbound originated isn't affected.

#### NAT and VM with an instance-level public IP and a standard public load balancer

:::image type="content" source="./media/nat-overview/flow-direction4.png" alt-text="Diagram of a NAT gateway that supports outbound traffic to the internet from a virtual network. Inbound traffic is depicted with an instance-level public IP and a public load balancer.":::

*Figure: Virtual Network NAT and VM with an instance-level public IP and a standard public load balancer*

| Direction | Resource |
|:---:|:---:|
| Inbound | VM with instance-level public IP and a standard public load balancer |
| Outbound | NAT gateway |

Any outbound configuration from a load-balancing rule or outbound rules is superseded by NAT gateway. The VM will also use NAT gateway for outbound. Inbound originated isn't affected.

### Monitor outbound network traffic with NSG flow logs

A network security group allows you to filter inbound and outbound traffic to and from a virtual machine. To monitor outbound traffic flowing from the virtual machine behind your NAT gateway, enable NSG flow logs.

To learn more about NSG flow logs, see [NSG Flow Log Overview](../network-watcher/network-watcher-nsg-flow-logging-overview.md).

For guides on how to enable NSG flow logs, see [Enabling NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-overview.md#enabling-nsg-flow-logs).

## Performance

Each NAT gateway can provide up to 50 Gbps of throughput. This data throughput includes data processed both outbound and inbound through a NAT gateway resource. You can split your deployments into multiple subnets and assign each subnet or group of subnets a NAT gateway to scale out.

NAT gateway can support up to 50,000 concurrent connections per public IP address **to the same destination endpoint** over the internet for TCP and UDP. The total number of connections that NAT gateway can support at any given time is up to 2 million. NAT gateway can process 1M packets per second and scale up to 5M packets per second.

Review the following section for details and the [troubleshooting article](./troubleshoot-nat.md) for specific problem resolution guidance.

## Scalability

Scaling NAT gateway is primarily a function of managing the shared, available SNAT port inventory. NAT gateway needs sufficient SNAT port inventory for expected peak outbound flows for all subnets that are attached to a NAT gateway. You can use public IP addresses, public IP prefixes, or both to create SNAT port inventory. 

A single NAT gateway can scale up to 16 IP addresses. Each NAT gateway public IP address provides 64,512 SNAT ports to make outbound connections. NAT gateway can scale up to over 1 million SNAT ports. TCP and UDP are separate SNAT port inventories and are unrelated to NAT gateway.

> [!NOTE]
> If you assign a public IP prefix, the entire public IP prefix is used. You can't assign a public IP prefix and then break out individual IP addresses to assign to other resources. If you want to assign individual IP addresses from a public IP prefix to multiple resources, you need to create individual public IP addresses and assign them as needed instead of using the public IP prefix itself.

When you scale your workload, assume that each flow requires a new SNAT port, and then scale the total number of available IP addresses for outbound traffic. Carefully consider the scale you're designing for, and then allocate IP addresses quantities accordingly.

SNAT maps private addresses in your subnet to one or more public IP addresses attached to NAT gateway, rewriting the source address and source port in the process. SNAT ports sent to different destinations will most likely be reused when possible. As SNAT port exhaustion approaches, flows may not succeed.

For a SNAT example, see [SNAT fundamentals](#source-network-address-translation).

## Protocols

NAT gateway interacts with IP and IP transport headers of UDP and TCP flows. NAT gateway is agnostic to application layer payloads. Other IP protocols aren't supported.

## Source Network Address Translation

### Fundamentals

Source Network Address Translation (SNAT) rewrites the source of a flow to originate from a different IP address and/or port. Typically, SNAT is used when a private network needs to connect to a public host over the internet. SNAT allows multiple VM instances within the private VNet to use the same single Public IP address or set of IP addresses (prefix) to connect to the internet.

NAT gateway uses SNAT to translate the private IP address and port of a virtual machine to a static public IP address and port. Traffic is translated before leaving the virtual network for the Internet.  Each new connection to the same destination endpoint uses a different SNAT port so that connections can be distinguished from one another. SNAT port exhaustion occurs when a source endpoint has run out of available SNAT ports to differentiate between new connections.

### Example SNAT flows for NAT gateway

NAT gateway provides a many to one configuration in which multiple virtual machine instances within a NAT gatway configured subnet can use the same public IP address to connect outbound.

In the following table, two different virtual machines (10.0.0.1 and 10.2.0.1) makes connections to https://microsoft.com destination IP 23.53.254.142. When NAT gateway is configured with public IP address 65.52.1.1, each virtual machine's source IPs are translated into NAT gateway's public IP address and a SNAT port:

| Flow | Source tuple | Source tuple after SNAT | Destination tuple |
|:---:|:---:|:---:|:---:|
| 1 | 10.0.0.1: 4283 | **65.52.1.1: 1234** | 23.53.254.142: 80 |
| 2 | 10.0.0.1: 4284 | **65.52.1.1: 1235** | 23.53.254.142: 80 |
| 3 | 10.2.0.1: 5768 | **65.52.1.1: 1236** | 23.53.254.142: 80 |

"IP masquerading" or "port masquerading" is the act of replacing the private IP and port with the public IP and port before connecting to the internet. Multiple private resources can be masqueraded behind the same public IP of NAT gateway.

### NAT gateway dynamically allocates SNAT ports

NAT gateway dynamically allocates SNAT ports across a subnet's private resources such as virtual machines. SNAT port inventory is made available by attaching public IP addresses to NAT gateway. All available SNAT ports can be used on-demand by any virtual machine in subnets configured with NAT gateway:

:::image type="content" source="./media/nat-overview/lb-vnnat-chart.png" alt-text="Diagram that depicts the inventory of all available SNAT ports used by any VM on subnets configured with NAT.":::

*Figure: NAT gateway on-demand outbound SNAT*

Pre-allocation of SNAT ports to each virtual machine is required for other SNAT methods. This pre-allocation of SNAT ports can cause SNAT port exhaustion on some virtual machines while others still have available SNAT ports for connecting outbound. With NAT gateway, pre-allocation of SNAT ports isn't required, which means SNAT ports aren't left unused by VMs not actively needing them.

:::image type="content" source="./media/nat-overview/exhaustion-threshold.png" alt-text="Diagram of all available SNAT ports used by virtual machines on subnets configured with NAT and an exhaustion threshold.":::

*Figure: Differences in exhaustion scenarios*

After a SNAT port is released, it's available for use by any VM on subnets configured with NAT. On-demand allocation allows dynamic and divergent workloads on subnets to use SNAT ports as needed. As long as SNAT ports are available, SNAT flows will succeed. 

### Source (SNAT) port reuse

NAT gateway selects a port at random out of the available inventory of ports to make new outbound connections. If NAT gateway doesn't find any available SNAT ports, then it will reuse a SNAT port. A SNAT port can be reused when connecting to a different destination IP and port as shown in the following table with this extra flow.

| Flow | Source tuple | Source tuple after SNAT | Destination tuple |
|:---:|:---:|:---:|:---:|
| 4 | 10.0.0.1: 4285 | 65.52.1.1: **1234** | 23.53.254.143: 80 |

A NAT gateway will translate flow 4 to a SNAT port that may already be in use for other destinations as well (see flow 1 from previous table). See [Scale NAT gateway](#scalability) for more discussion on correctly sizing your IP address provisioning.

Don't take a dependency on the specific way source ports are assigned in the above example. The preceding is an illustration of the fundamental concept only.

## Timers

### Port Reuse Timers

Port reuse timers determine the amount of time after a connection closes that a source port is in hold down before it can be reused to go to the same destination endpoint by NAT gateway.  

The following table provides information about when a TCP port becomes available for reuse to the same destination endpoint by NAT gateway. 

| Timer | Description | Value |
|---|---|---|
| TCP FIN | After a connection is closed by a TCP FIN packet, a 65-second timer is activated that holds down the SNAT port. The SNAT port will be available for reuse after the timer ends. | 65 seconds |
| TCP RST | After a connection is closed by a TCP RST packet (reset), a 16-second timer is activated that holds down the SNAT port. When the timer ends, the port is available for reuse. | 16 seconds |
| TCP half open | During connection establishment where one connection endpoint is waiting for acknowledgment from the other endpoint, a 30-second timer is activated. If no traffic is detected, the connection will close. Once the connection has closed, the source port is available for reuse to the same destination endpoint. | 30 seconds |

For UDP traffic, after a connection has closed, the port will be in hold down for 65 seconds before it's available for reuse.

### Idle Timeout Timers

| Timer | Description | Value |
|---|---|---|
| TCP idle timeout | TCP connections can go idle when no data is transmitted between either endpoint for a prolonged period of time. A timer can be configured from 4 minutes (default) to 120 minutes (2 hours) to time out a connection that has gone idle. Traffic on the flow will reset the idle timeout timer. | Configurable; 4 minutes (default) - 120 minutes |
| UDP idle timeout | UDP connections can go idle when no data is transmitted between either endpoint for a prolonged period of time. UDP idle timeout timers are 4 minutes and are **not configurable**. Traffic on the flow will reset the idle timeout timer. | **Not configurable**; 4 minutes |

> [!NOTE]
> These timer settings are subject to change. The values are provided to help with troubleshooting and you should not take a dependency on specific timers at this time.

### Timer considerations

Design recommendations for configuring timers:

- In an idle connection scenario, NAT gateway holds onto SNAT ports until the connection idle times out. Because long idle timeout timers can unnecessarily increase the likelihood of SNAT port exhaustion, it isn't recommended to increase the TCP idle timeout duration to longer than the default time of 4 minutes. If a flow never goes idle, then it will not be impacted by the idle timer.

- TCP keepalives can be used to provide a pattern of refreshing long idle connections and endpoint liveness detection. TCP keepalives appear as duplicate ACKs to the endpoints, are low overhead, and invisible to the application layer.

- UDP idle timeout timers aren't configurable, UDP keepalives should be used to ensure that the idle timeout value isn't reached, and that the connection is maintained. Unlike TCP connections, a UDP keepalive enabled on one side of the connection only applies to traffic flow in one direction. UDP keepalives must be enabled on both sides of the traffic flow in order to keep the traffic flow alive.

## Limitations

- Basic load balancers and basic public IP addresses aren't compatible with NAT. Use standard SKU load balancers and public IPs instead.
  
  - To upgrade a load balancer from basic to standard, see [Upgrade Azure Public Load Balancer](../load-balancer/upgrade-basic-standard.md)
  
  - To upgrade a public IP address from basic to standard, see [Upgrade a public IP address](../virtual-network/ip-services/public-ip-upgrade-portal.md)

- NAT gateway doesn't support ICMP 

- IP fragmentation isn't available for NAT gateway.

## Next steps

- Review [Azure NAT Gateway](nat-overview.md).

- Learn about [metrics and alerts for NAT gateway](nat-metrics.md).

- Learn how to [troubleshoot NAT gateway](troubleshoot-nat.md).
