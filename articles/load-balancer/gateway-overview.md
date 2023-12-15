---
title: Gateway load balancer
titleSuffix: Azure Load Balancer
description: Overview of gateway load balancer SKU for Azure Load Balancer.
ms.service: load-balancer
author: mbender-ms
ms.author: mbender
ms.date: 04/20/2023
ms.topic: conceptual
ms.custom: template-concept, ignite-fall-2021, engagement-fy23
---

# Gateway Load Balancer

Gateway Load Balancer is a SKU of the Azure Load Balancer portfolio catered for high performance and high availability scenarios with third-party Network Virtual Appliances (NVAs). With the capabilities of Gateway Load Balancer, you can easily deploy, scale, and manage NVAs. Chaining a Gateway Load Balancer to your public endpoint only requires one selection. 

You can insert appliances transparently for different kinds of scenarios such as:

* Firewalls
* Advanced packet analytics
* Intrusion detection and prevention systems
* Traffic mirroring
* DDoS protection
* Custom appliances

With Gateway Load Balancer, you can easily add or remove advanced network functionality without extra management overhead. It provides the bump-in-the-wire technology you need to ensure all traffic to a public endpoint is first sent to the appliance before your application. In scenarios with NVAs, it's especially important that flows are symmetrical. Gateway Load Balancer maintains flow stickiness to a specific instance in the backend pool along with flow symmetry. As a result, a consistent route to your network virtual appliance is ensured – without other manual configuration. As a result, packets traverse the same network path in both directions and appliances that need this key capability are able to function seamlessly.

The health probe listens across all ports and routes traffic to the backend instances using the HA ports rule. Traffic sent to and from Gateway Load Balancer uses the VXLAN protocol. 

## Benefits

Gateway Load Balancer has the following benefits:

* Integrate virtual appliances transparently into the network path.

* Easily add or remove network virtual appliances in the network path. 

* Scale with ease while managing costs.

* Improve network virtual appliance availability.

* Chain applications across regions and subscriptions

A Standard Public Load balancer or a Standard IP configuration of a virtual machine can be chained to a Gateway Load Balancer. Once chained to a Standard Public Load Balancer frontend or Standard IP configuration on a virtual machine, no extra configuration is needed to ensure traffic to, and from the application endpoint is sent to the Gateway Load Balancer.

Traffic moves from the consumer virtual network to the provider virtual network. The traffic then returns to the consumer virtual network. The consumer virtual network and provider virtual network can be in different subscriptions, tenants, or regions removing management overhead.

:::image type="content" source="./media/gateway-overview/gateway-load-balancer-diagram.png" alt-text="Diagram of gateway load balancer":::

*Figure: Diagram of gateway load balancer.*

## Components

Gateway Load Balancer consists of the following components:

* **Frontend IP configuration** - The IP address of your Gateway Load Balancer. This IP is private only. 

* **Load-balancing rules** - A load balancer rule is used to define how incoming traffic is distributed to all the instances within the backend pool. A load-balancing rule maps a given frontend IP configuration and port to multiple backend IP addresses and ports. 

    * Gateway Load Balancer rules can only be HA port rules. 

    * A Gateway Load Balancer rule can be associated with up to two backend pools. 

* **Backend pool(s)** - The group of virtual machines or instances in a Virtual Machine Scale Set that is serving the incoming request. To scale cost-effectively to meet high volumes of incoming traffic, computing guidelines generally recommend adding more instances to the backend pool. Load Balancer instantly reconfigures itself via automatic reconfiguration when you scale instances up or down. Adding or removing VMs from the backend pool reconfigures the load balancer without extra operations. The scope of the backend pool is any virtual machine in a single virtual network. 

* **Tunnel interfaces** - Gateway Load balancer backend pools have another component called the tunnel interfaces. The tunnel interface enables the appliances in the backend to ensure network flows are handled as expected. Each backend pool can have up to two tunnel interfaces. Tunnel interfaces can be either internal or external. For traffic coming to your backend pool, you should use the external type. For traffic going from your appliance to the application, you should use the internal type.

* **Chain** - A Gateway Load Balancer can be referenced by a Standard Public Load Balancer frontend or a Standard Public IP configuration on a virtual machine. The addition of advanced networking capabilities in a specific sequence is known as service chaining. As a result, this reference is called a chain. A Cross tenant chain involves chaining a Load Balancer frontend or Public IP configuration to a Gateway Load Balancer that is in another subscription. For cross tenant chaining, users need:
    * Permission for the resource provider operation `Microsoft.Network/loadBalancers/frontendIPConfigurations/join/action`.
    * Guest access to the subscription of the Gateway Load Balancer.

## Pricing

For pricing, see [Load Balancer pricing](https://azure.microsoft.com/pricing/details/load-balancer/).

## Limitations

* Gateway Load Balancer doesn't work with the Global Load Balancer tier.
* Cross-tenant chaining isn't supported through the Azure portal.

## Next steps

- See [Create a Gateway Load Balancer using the Azure portal](tutorial-gateway-portal.md) to create a gateway load balancer.
- Learn more about [Azure Load Balancer](load-balancer-overview.md).
