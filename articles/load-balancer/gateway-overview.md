---
title: Gateway load balancer (Preview)
titleSuffix: Azure Load Balancer
description: Overview of gateway load balancer SKU for Azure Load Balancer.
ms.service: load-balancer
author: asudbring
ms.author: allensu
ms.date: 10/4/2021
ms.topic: conceptual
---

# Gateway load balancer (Preview)

Azure load balancer consists of standard, basic, and gateway SKUs. The gateway load balancer SKU is catered for high performance and high availability scenarios with third-party Network Virtual Appliances (NVAs). With the capabilities of gateway load balancer, you can easily deploy, scale, and manage NVAs. Chaining a gateway load balancer to your public endpoint only requires one selection. 

You can insert appliances for different kinds of scenarios such as:

* Firewalls
* Advanced packet analytics
* Intrusion detection and prevention systems.
* Custom scenarios that insert into the network path with gateway load balancer.

In scenarios with NVAs, it's especially important that flows are "sticky". This "stickiness" ensures sessions are maintained and symmetrical. Gateway load balancer maintains flow stickiness to a specific instance in the backend pool along with flow symmetry.

Gateway load balancer operates at the network later of the Open Systems Interconnection (OSI) model. The health probe listens across all ports and routes traffic to the backend instances using the HA rule. Traffic sent to and from gateway load balancer uses the VXLAN protocol. 

> [!IMPORTANT]
> Gateway load balancer is currently in preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Benefits

Gateway load balancer has the following benefits:

* Integrate virtual appliances into the network path with ease. 

* Easily add or remove network virtual appliances in the network path. 

* Scale with ease while managing costs.

* Improve network virtual appliance availability.

A standard public load balancer or the IP configuration of a virtual machine is chained to a gateway load balancer. Gateway load balancer sends and receives traffic flows for the application endpoint. Extra configuration isn't required.

Traffic moves from the consumer virtual network to the provider virtual network. The traffic then returns to the consumer virtual network. The consumer virtual network and provider virtual network can be in different subscriptions, tenants, or regions.

:::image type="content" source="./media/gateway-overview/gateway-load-balancer-diagram.png" alt-text="Diagram of gateway load balancer":::

*Figure: Diagram of gateway load balancer.*

## Components

Gateway load balancer consists of the following components:

* **Frontend IP configuration** - The IP address of your gateway load balancer. This IP is private only. 

* **Load-balancing rules** - A load balancer rule is used to define how incoming traffic is distributed to all the instances within the backend pool. A load-balancing rule maps a given frontend IP configuration and port to multiple backend IP addresses and ports. 

    * Gateway load balancer rules can only be HA port rules. 

    * A gateway load balancer rule can be associated with up to two backend pools. 

* **Backend pool(s)** - The group of virtual machines or instances in a virtual machine scale set that is serving the incoming request. To scale cost-effectively to meet high volumes of incoming traffic, computing guidelines generally recommend adding more instances to the backend pool. Load balancer instantly reconfigures itself via automatic reconfiguration when you scale instances up or down. Adding or removing VMs from the backend pool reconfigures the load balancer without extra operations. The scope of the backend pool is any virtual machine in a single virtual network. 

* **Tunnel interfaces** - Gateway load balancer backend pools have another component called the tunnel interface. The tunnel interface enables the appliances in the backend to ensure network flows are handled as expected.  

## Pricing

There's no charge for gateway load balancer during preview. 

For pricing that will be effective during the general availability release, see [Load Balancer pricing](https://azure.microsoft.com/pricing/details/load-balancer/).

## Limitations

* Gateway load balancer doesn't work with the cross-region load balancer tier.

## Next steps

- See [Create a gateway load balancer using the Azure portal](tutorial-gateway-portal.md) to create a gateway load balancer.
- Learn more about [Azure Load Balancer](load-balancer-overview.md).
