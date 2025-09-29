---
author: flapinski
ms.author: flapinski
ms.date: 09/12/2025
ms.service: azure-virtual-wan
ms.topic: include

#This include is used in multiple articles. Before modifying, verify that any changes apply to all articles that use this include.
---
Virtual Network connections to Virtual WAN hubs have a configurable property named **VNetLocalRouteOverrideCriteria** (**Bypass Next Hop IP  for workloads within this VNet** in Azure Portal). 

This property defines how traffic is routed to workloads deployed in a Virtual WAN spoke VNET when a static route is configured on the Virtual WAN spoke Virtual Network connection and **the Virtual Network address space is a subnet within the static route**.

- **Disabled (default)**: All traffic matching static route ranges gets redirected through the next hop, even within the spoke VNet itself
- **Enabled**: Traffic to IPs within the spoke's address space bypasses static routes and goes directly to target, while other traffic follows configured routing

You can enable this feature via the following steps:
- **Portal**: Set **Bypass Next Hop IP for workloads within this VNet** to **Yes** when creating VNet connection (default is **No**)
- **API/CLI/PowerShell**: Set `vnetLocalRouteOverrideCriteria = "equals"` (default is `"contains"`)

> [!NOTE]
> This feature can only be configured during the creation of a VNet connection. To enable it on an existing connection, you must delete and recreate the VNet connection. 
>  

### Design Scenario
You’ve set up a Virtual WAN Hub connected to two spokes: 

- **NVA Spoke**: Contains a load balancer (10.2.0.1) that routes traffic between two NVA virtual machine instances (10.2.0.2 and 10.2.0.3). This spoke is also directly peered to another VNet (the indirect spoke) containing a VM with IP 10.2.1.1. 
- **Direct Spoke**: Another VNet connected directly to the Virtual WAN Hub. This VNet contains a VM with IP 10.0.0.1. 

:::image type="content" source="../articles/virtual-wan/media/virtual-wan-bypass-next-hop-ip-include/bypass-next-hop-ip-initial-design.png" alt-text="Screenshot shows diagram of described design.":::

A static route is configured on NVAConn to ensure that any traffic destined for the NVA spoke or the indirect spoke is routed through the load balancer at IP 10.2.0.1. 

:::image type="content" source="../articles/virtual-wan/media/virtual-wan-bypass-next-hop-ip-include/static-route-bypass-next-hop-ip.png" alt-text="Screenshot that shows aforementioned static route.":::

### Traffic behavior with VNetLocalRouteOverrideCriteria disabled
If **Bypass Next Hop IP for workloads within this VNet is disabled/vnetLocalRouteOverrideCriteria = contains**, then:
- Traffic from the direct spoke to a VM in the NVA spoke (e.g., 10.2.0.2) will be redirected by the static route to the load balancer (10.2.0.1). This may result in routing to an unintended VM instance (e.g., traffic intended for 10.2.0.3 is routed to 10.2.0.2 instead; path may vary based on load balancer hashing). 
    - **Intended traffic flow**: blue line
    - **Actual traffic flow**: red line

:::image type="content" source="../articles/virtual-wan/media/virtual-wan-bypass-next-hop-ip-include/actual-scenario-and-goal-scenario-bypass-next-hop-ip.png" alt-text="Screenshot shows diagram of traffic flow when Bypass Next Hop IP is disabled and the traffic is sent to a range within the spoke.":::

- Traffic within the broader static route will also be routed to the load balancer. For example, traffic from the direct spoke VM (10.0.0.1) to the indirect spoke VM (10.2.1.1) will also be routed through the load balancer due to the static route. 

:::image type="content" source="../articles/virtual-wan/media/virtual-wan-bypass-next-hop-ip-include/disabled-broader-static-route-bypass-next-hop-ip.png" alt-text="Screenshot shows diagram of traffic flow when Bypass Next Hop IP is disabled and the traffic is not sent to a range within the spoke.":::

### Traffic Behavior With Bypass Next Hop IP Enabled
If **Bypass Next Hop IP for workloads within this VNet is enabled/vnetLocalRouteOverrideCriteria = equals**: 
- Traffic destined for an address within the NVA spoke’s prefix bypasses the static route and goes directly to the target VM (e.g., 10.2.0.3). 
    - **Traffic flow**: blue line from 10.0.0.1 to 10.2.0.3 
- Traffic targeting an address outside the NVA spoke’s prefix (but still within the static route’s range), such as 10.2.1.1 in the indirect spoke, continues to follow the static route and is sent to the load balancer. 
    - **Traffic flow**: red line from 10.0.0.1 to 10.2.1.1 (path may vary based on load balancer hashing) 

:::image type="content" source="../articles/virtual-wan/media/virtual-wan-bypass-next-hop-ip-include/enabled-bypass-next-hop-ip.png" alt-text="Screenshot shows diagram of different traffic flows when Bypass Next Hop IP is enabled.":::
