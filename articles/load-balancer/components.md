---
title: Azure Load Balancer components
description: Understand Azure Load Balancer's key components and configurations to effectively manage traffic and maintain application reliability.
services: load-balancer
author: mbender-ms
ms.service: azure-load-balancer
ms.topic: concept-article
ms.date: 01/07/2026
ms.author: mbender
ms.reviewer: mbender
ms.custom: sfi-image-nochange
# Customer intent: "As a cloud architect, I want to understand the components of Azure Load Balancer, so that I can configure it effectively to manage traffic distribution and ensure high availability for my applications."
---

# Azure Load Balancer components

Azure Load Balancer includes a few key components. These components can be configured in your subscription through the Azure portal, Azure CLI, Azure PowerShell, an Azure Resource Manager Template or appropriate alternatives.

## Frontend IP configuration <a name = "frontend-ip-configurations"></a>

The IP address of your Azure Load Balancer. It's the point of contact for clients. These IP addresses can be either:

- **Public IP Address**
- **Private IP Address**

The nature of the IP address determines the **type** of load balancer created. Private IP address selection creates an internal load balancer. Public IP address selection creates a public load balancer.

| | **Public load balancer**  | **Internal load balancer** |
| ---------- | ---------- | ---------- |
| **Frontend IP configuration**| Public IP address | Private IP address|
| **Description** | A public load balancer maps the public IP and port of incoming traffic to the private IP and port of the VM. Load balancer maps traffic the other way around for the response traffic from the VM. You can distribute specific types of traffic across multiple VMs or services by applying load-balancing rules. For example, you can spread the load of web request traffic across multiple web servers.| An internal load balancer distributes traffic to resources that are inside a virtual network. Azure restricts access to the frontend IP addresses of a virtual network that are load balanced. Frontend IP addresses and virtual networks are never directly exposed to an internet endpoint, meaning an internal load balancer can't accept incoming traffic from the internet. Internal line-of-business applications run in Azure and are accessed from within Azure or from on-premises resources. |
| **SKUs supported** | Basic, Standard | Basic, Standard |

:::image type="content" source="media/load-balancer-overview/load-balancer.png" alt-text="Screenshot of load balancer architecture diagram showing traffic distribution between frontend and backend components.":::

Load balancer can have multiple frontend IPs. Learn more about [multiple frontends](load-balancer-multivip-overview.md).

## Backend pool

The group of virtual machines or instances in a virtual machine scale set that's serving the incoming request. To scale cost-effectively to meet high volumes of incoming traffic, computing guidelines generally recommend adding more instances to the backend pool.

Load balancer instantly reconfigures itself via automatic reconfiguration when you scale instances up or down. Adding or removing VMs from the backend pool reconfigures the load balancer without other operations. The scope of the backend pool is any virtual machine in a single virtual network. 

Backend pools support addition of instances via [network interface or IP addresses](backend-pool-management.md). VMs don't need a public IP address in order to be attached to backend pool of a public load balancer. VMs can be attached to the backend pool of a load balancer even if they are in a stopped state. You can also configure multiple backend pools with different groups of instances to a single load balancer. By creating multiple load balancing rules, each targeting a different backend pool, you can configure traffic to distribute to different sets of backend resources based on the load balancer frontend port and protocol.

## Health probes

A health probe is used to determine the health status of the instances in the backend pool. During load balancer creation, configure a health probe for the load balancer to use. This health probe determines if an instance is healthy and can receive traffic.

You can define the unhealthy threshold for your health probes. When a probe fails to respond, the load balancer stops sending new connections to the unhealthy instances. A probe failure doesn't affect existing connections. The connection continues until the application:

- Ends the flow
- Idle timeout occurs
- The VM shuts down

Load balancer provides different health probe types for endpoints: TCP, HTTP, and HTTPS. [Learn more about Load Balancer Health probes](load-balancer-custom-probe-overview.md).

Basic load balancer doesn't support HTTPS probes. Basic load balancer closes all TCP connections (including established connections).

## Load Balancer rules

A load balancer rule is used to define how incoming traffic is distributed to **all** the instances within the backend pool. A load-balancing rule maps a given frontend IP configuration and port to multiple backend IP addresses and ports. Load Balancer rules are for inbound traffic only.

For example, use a load balancer rule for port 80 to route traffic from your frontend IP to port 80 of your backend instances.

:::image type="content" source="./media/load-balancer-components/lbrules.png" alt-text="Load balancer rule reference diagram" border="false":::

*Figure: Load-Balancing rules*

## High Availability Ports

A load balancer rule configured with **'protocol - all and port - 0'** is known as a High Availability (HA) port rule. This rule enables a single rule to load-balance all TCP and UDP flows that arrive on all ports of an internal Standard Load Balancer. 

The load-balancing decision is made per flow. This action is based on the following five-tuple connection: 

- source IP address
- source port
- destination IP address
- destination port
- protocol

The HA ports load-balancing rules help you with critical scenarios, such as high availability and scale for network virtual appliances (NVAs) inside virtual networks. The feature can help when a large number of ports must be load-balanced.

HA Ports are commonly used for Network Virtual Appliances (NVAs) such as firewalls, VPNs, or SD-WAN devices, where defining individual load-balancing rules per port is not practical. Traffic is distributed per connection flow (5-tuple), and health probes are used to ensure traffic is sent only to healthy instances.

Please note that HA Ports are not supported on Basic or Public Load Balancers and are not intended for typical web or application workloads that require port-specific rules.

:::image type="content" source="media/load-balancer-components/harules.png" alt-text="Screenshot of Azure Load Balancer HA ports configuration diagram showing frontend ports directing to backend instances.":::

*Figure: HA Ports rules*

Learn more about [HA ports](load-balancer-ha-ports-overview.md).

## Inbound NAT rules

An inbound NAT rule forwards incoming traffic sent to frontend IP address and port combination. The traffic is sent to a **specific** virtual machine or instance in the backend pool. Port forwarding is done by the same hash-based distribution as load balancing.

:::image type="content" source="./media/load-balancer-components/inboundnatrules.png" alt-text="Inbound NAT rule reference diagram" border="false":::

*Figure: Inbound NAT rules*

## Outbound rules

An outbound rule configures outbound Network Address Translation (NAT) for all virtual machines or instances identified by the backend pool. This rule enables instances in the backend to communicate (outbound) to the internet or other endpoints.

Learn more about [outbound connections and rules](load-balancer-outbound-connections.md).

Basic load balancer doesn't support outbound rules.

:::image type="content" source="./media/load-balancer-components/outbound-rules.png" alt-text="Screenshot of outbound rule configuration diagram showing NAT translation for backend pool instances." border="false":::

*Figure: Outbound rules*

## Limitations

- Learn about load balancer [limits](../azure-resource-manager/management/azure-subscription-service-limits.md) 
- Load balancer provides load balancing and port forwarding for specific TCP or UDP protocols. Load-balancing rules and inbound NAT rules support TCP and UDP, but not other IP protocols including ICMP.
- Load Balancer backend pool can't consist of a [Private Endpoint](../private-link/private-endpoint-overview.md).
- Outbound flow from a backend VM to a frontend of an internal Load Balancer will fail.
- A load balancer rule can't span two virtual networks. All load balancer frontends and their backend instances must be in a single virtual network. 
- Forwarding IP fragments isn't supported on load-balancing rules. IP fragmentation of UDP and TCP packets isn't supported on load-balancing rules. 
- You can only have one Public Load Balancer (NIC based) and one internal Load Balancer (NIC based) per availability set. However, this constraint doesn't apply to IP-based load balancers. 

## Next step

> [!div class="nextstepaction"]
> [Create a public Standard load balancer](quickstart-load-balancer-standard-public-portal.md)
