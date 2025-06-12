---
title: Integrate Azure Firewall with Azure Standard Load Balancer
description: You can integrate an Azure Firewall into a virtual network with an Azure Standard Load Balancer (either public or internal).
services: firewall
author: varunkalyana
ms.service: azure-firewall
ms.topic: how-to
ms.date: 03/04/2025
ms.author: duau
---

# Integrate Azure Firewall with Azure Standard Load Balancer

You can integrate an Azure Firewall into a virtual network with either a public or internal Azure Standard Load Balancer.

The preferred design is to use an internal load balancer with your Azure Firewall, as it simplifies the setup. If you already have a public load balancer deployed and wish to continue using it, be aware of potential asymmetric routing issues that could disrupt functionality.

For more information about Azure Load Balancer, see [What is Azure Load Balancer?](../load-balancer/load-balancer-overview.md)

## Public load balancer

With a public load balancer, the load balancer is deployed with a public frontend IP address.

### Asymmetric routing

Asymmetric routing is where a packet takes one path to the destination and takes another path when returning to the source. This issue occurs when a subnet has a default route going to the firewall's private IP address and you're using a public load balancer. In this case, the incoming load balancer traffic is received via its public IP address, but the return path goes through the firewall's private IP address. Since the firewall is stateful, it drops the returning packet because the firewall isn't aware of such an established session.

### Fix the routing issue

#### Scenario 1: Azure Firewall without NAT Gateway
When deploying an Azure Firewall into a subnet, you need to create a default route for the subnet. This route directs packets through the firewall's private IP address located on the AzureFirewallSubnet. For detailed steps, see [Deploy and configure Azure Firewall using the Azure portal](tutorial-firewall-deploy-portal.md#create-a-default-route).
When integrating the firewall into your load balancer scenario, ensure that your Internet traffic enters through the firewall's public IP address. The firewall applies its rules and NAT the packets to the load balancer's public IP address. The issue arises when packets arrive at the firewall's public IP address but return via the private IP address (using the default route).

To prevent asymmetric routing, add a specific route for the firewall's public IP address. Packets intended for the firewall's public IP address are directed through the Internet, bypassing the default route to the firewall's private IP address.

:::image type="content" source="media/integrate-lb/Firewall-LB-asymmetric.png" alt-text="Diagram of asymmetric routing and the workaround solution." lightbox="media/integrate-lb/Firewall-LB-asymmetric.png":::

##### Route table example

For example, the following route table shows routes for a firewall with a public IP address of 203.0.113.136 and a private IP address of 10.0.1.4.

:::image type="content" source="media/integrate-lb/route-table.png" lightbox="media/integrate-lb/route-table.png" alt-text="Screenshot of route table.":::

#### Scenario 2: Azure Firewall with NAT Gateway

In some scenarios, you might configure a NAT Gateway on the Azure Firewall subnet to overcome SNAT (Source Network Address Translation) port limitations for outbound connectivity. In these cases, the route configuration in Scenario 1 doesn't work because the NAT Gateway's public IP address takes precedence over the Azure Firewall's public IP address.

For more information, see [Integration of NAT Gateway with Azure Firewall](../nat-gateway/tutorial-hub-spoke-nat-firewall.md).

:::image type="content" source="media/integrate-lb/nat-firewall-routing.png" alt-text="Diagram of routing with NAT Gateway associated to the Azure Firewall subnet.":::

When a NAT Gateway is associated with the Azure Firewall subnet, inbound traffic from the internet lands on the Azure Firewall's public IP address. The Azure Firewall then changes (SNAT) the source IP to the NAT Gateway's public IP address before forwarding the traffic to the load balancer's public IP address.

Without a NAT Gateway, the Azure Firewall changes the source IP address to its own public IP address before forwarding the traffic to the load balancer's public IP address.

> [!IMPORTANT]
> Allow the NAT Gateway public IP address or public prefixes in the Network Security Group (NSG) rules associated with the resource (AKS/VM) subnet.

##### Route table example with NAT Gateway

You must add a route for the return path to use the NAT Gateway public IP address instead of the Azure Firewall public IP address with Internet as the next hop.

For example, the following route table shows routes for a NAT Gateway with a public IP address of 198.51.100.101 and a firewall with a private IP address of 10.0.1.4.

:::image type="content" source="media/integrate-lb/firewall-route-table.png" alt-text="Screenshot of the route table showing a route with the destination as the NAT Gateway Public IP address and the next hop as Internet.":::

### NAT rule example

In both scenarios, a NAT rule translates RDP (Remote Desktop Protocol) traffic from the firewall's public IP address (203.0.113.136) to the load balancer's public IP address (203.0.113.220):

:::image type="content" source="media/integrate-lb/nat-rule-02.png" lightbox="media/integrate-lb/nat-rule-02.png" alt-text="Screenshot of NAT rule.":::

### Health probes

Remember to have a web service running on the hosts in the load balancer pool if you use TCP (Transport Control Protocol) health probes on port 80, or HTTP/HTTPS probes.

## Internal load balancer

An internal load balancer is deployed with a private frontend IP address.

This scenario doesn't have asymmetric routing issues. Incoming packets arrive at the firewall's public IP address, are translated to the load balancer's private IP address, and return to the firewall's private IP address using the same path.

Deploy this scenario similarly to the public load balancer scenario, but without needing the firewall public IP address host route.

Virtual machines in the backend pool can have outbound Internet connectivity through the Azure Firewall. Configure a user-defined route on the virtual machine's subnet with the firewall as the next hop.

## Extra security

To further enhance the security of your load-balanced scenario, use network security groups (NSGs).

For example, create an NSG on the backend subnet where the load-balanced virtual machines are located. Allow incoming traffic originating from the firewall's public IP address and port. If a NAT Gateway is associated with the Azure Firewall subnet, allow incoming traffic originating from the NAT Gateway's public IP address and port.

:::image type="content" source="media/integrate-lb/nsg-01.png" alt-text="Screenshot of network security group." lightbox="media/integrate-lb/nsg-01.png":::

For more information about NSGs, see [Security groups](../virtual-network/network-security-groups-overview.md).

## Next steps

- Learn how to [deploy and configure an Azure Firewall](tutorial-firewall-deploy-portal.md).