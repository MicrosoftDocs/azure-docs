---
title: Azure Application Gateway infrastructure configuration
description: This article describes how to configure the Azure Application Gateway infrastructure.
services: application-gateway
author: vhorne
ms.service: application-gateway
ms.topic: conceptual
ms.date: 09/09/2020
ms.author: surmb
---

# Application Gateway infrastructure configuration

The application gateway infrastructure includes the virtual network, subnets, network security groups, and user defined routes.

## Virtual network and dedicated subnet

An application gateway is a dedicated deployment in your virtual network. Within your virtual network, a dedicated subnet is required for the application gateway. You can have multiple instances of a given application gateway deployment in a subnet. You can also deploy other application gateways in the subnet. But you can't deploy any other resource in the application gateway subnet. You can't mix Standard_v2 and Standard Azure Application Gateway on the same subnet.

> [!NOTE]
> [Virtual network service endpoint policies](../virtual-network/virtual-network-service-endpoint-policies-overview.md) are currently not supported in an Application Gateway subnet.

### Size of the subnet

Application Gateway uses one private IP address per instance, plus another private IP address if a private front-end IP is configured.

Azure also reserves five IP addresses in each subnet for internal use: the first four and the last IP addresses. For example, consider 15 application gateway instances with no private front-end IP. You need at least 20 IP addresses for this subnet: five for internal use and 15 for the application gateway instances.

Consider a subnet that has 27 application gateway instances and an IP address for a private front-end IP. In this case, you need 33 IP addresses: 27 for the application gateway instances, one for the private front end, and five for internal use.

Application Gateway (Standard or WAF) SKU can support up to 32 instances (32 instance IP addresses + 1 private front-end IP + 5 Azure reserved) – so a minimum subnet size of /26 is recommended

Application Gateway (Standard_v2 or WAF_v2 SKU) can support up to 125 instances (125 instance IP addresses + 1 private front-end IP + 5 Azure reserved) – so a minimum subnet size of /24 is recommended

## Network security groups

Network security groups (NSGs) are supported on Application Gateway. But there are some restrictions:

- You must allow incoming Internet traffic on TCP ports 65503-65534 for the Application Gateway v1 SKU, and TCP ports 65200-65535 for the v2 SKU with the destination subnet as **Any** and source as **GatewayManager** service tag. This port range is required for Azure infrastructure communication. These ports are protected (locked down) by Azure certificates. External entities, including the customers of those gateways, can't communicate on these endpoints.

- Outbound Internet connectivity can't be blocked. Default outbound rules in the NSG allow Internet connectivity. We recommend that you:

  - Don't remove the default outbound rules.
  - Don't create other outbound rules that deny any outbound connectivity.

- Traffic from the **AzureLoadBalancer** tag with the destination subnet as **Any** must be allowed.

### Allow access to a few source IPs

For this scenario, use NSGs on the Application Gateway subnet. Put the following restrictions on the subnet in this order of priority:

1. Allow incoming traffic from a source IP or IP range with the destination as the entire Application Gateway subnet address range and destination port as your inbound access port, for example, port 80 for HTTP access.
2. Allow incoming requests from source as **GatewayManager** service tag and destination as **Any** and destination ports as 65503-65534 for the Application Gateway v1 SKU, and ports 65200-65535 for v2 SKU for [back-end health status communication](./application-gateway-diagnostics.md). This port range is required for Azure infrastructure communication. These ports are protected (locked down) by Azure certificates. Without appropriate certificates in place, external entities can't initiate changes on those endpoints.
3. Allow incoming Azure Load Balancer probes (*AzureLoadBalancer* tag) and inbound virtual network traffic (*VirtualNetwork* tag) on the [network security group](../virtual-network/network-security-groups-overview.md).
4. Block all other incoming traffic by using a deny-all rule.
5. Allow outbound traffic to the Internet for all destinations.

## Supported user-defined routes 

> [!IMPORTANT]
> Using UDRs on the Application Gateway subnet might cause the health status in the [back-end health view](./application-gateway-diagnostics.md#back-end-health) to appear as **Unknown**. It also might cause generation of Application Gateway logs and metrics to fail. We recommend that you don't use UDRs on the Application Gateway subnet so that you can view the back-end health, logs, and metrics.

- **v1**

   For the v1 SKU, user-defined routes (UDRs) are supported on the Application Gateway subnet, as long as they don't alter end-to-end request/response communication. For example, you can set up a UDR in the Application Gateway subnet to point to a firewall appliance for packet inspection. But you must make sure that the packet can reach its intended destination after inspection. Failure to do so might result in incorrect health-probe or traffic-routing behavior. This includes learned routes or default 0.0.0.0/0 routes that are propagated by Azure ExpressRoute or VPN gateways in the virtual network. Any scenario in which 0.0.0.0/0 needs to be redirected on-premises (forced tunneling) isn't supported for v1.

- **v2**

   For the v2 SKU, there are supported and unsupported scenarios:

   **v2 supported scenarios**
   > [!WARNING]
   > An incorrect configuration of the route table could result in asymmetrical routing in Application Gateway v2. Ensure that all management/control plane traffic is sent directly to the Internet and not through a virtual appliance. Logging and metrics could also be affected.


  **Scenario 1**: UDR to disable Border Gateway Protocol (BGP) Route Propagation to the Application Gateway subnet

   Sometimes the default gateway route (0.0.0.0/0) is advertised via the ExpressRoute or VPN gateways associated with the Application Gateway virtual network. This breaks management plane traffic, which requires a direct path to the Internet. In such scenarios, a UDR can be used to disable BGP route propagation. 

   To disable BGP route propagation, use the following steps:

   1. Create a Route Table resource in Azure.
   2. Disable the **Virtual network gateway route propagation** parameter. 
   3. Associate the Route Table to the appropriate subnet. 

   Enabling the UDR for this scenario shouldn't break any existing setups.

  **Scenario 2**: UDR to direct 0.0.0.0/0 to the Internet

   You can create a UDR to send 0.0.0.0/0 traffic directly to the Internet. 

  **Scenario 3**: UDR for Azure Kubernetes Service with kubenet

  If you're using kubenet with Azure Kubernetes Service (AKS) and Application Gateway Ingress Controller (AGIC), you'll need a route table to allow traffic sent to the pods from Application Gateway to be routed to the correct node. This won't be necessary if you use Azure CNI. 

  To use the route table to allow kubenet to work, follow the steps below:

  1. Go to the resource group created by AKS (the name of the resource group should begin with "MC_")
  2. Find the route table created by AKS in that resource group. The route table should be populated with the following information:
     - Address prefix should be the IP range of the pods you want to reach in AKS. 
     - Next hop type should be Virtual Appliance. 
     - Next hop address should be the IP address of the node hosting the pods.
  3. Associate this route table to the Application Gateway subnet. 
    
  **v2 unsupported scenarios**

  **Scenario 1**: UDR for Virtual Appliances

  Any scenario where 0.0.0.0/0 needs to be redirected through any virtual appliance, a hub/spoke virtual network, or on-premise (forced tunneling) isn't supported for V2.

## Next steps

- [Learn about front-end IP address configuration](configuration-front-end-ip.md).