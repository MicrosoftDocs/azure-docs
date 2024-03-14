---
title: Securing web applications with Cloud NGFW by Palo Alto Networks
description: This article describes how to use the Azure Application Gateway with the Cloud NGFW (Next-Generation Firewall) by Palo Alto Networks - an Azure Native ISV Service resource.

ms.topic: conceptual
ms.date: 03/11/2024

---
# Cloud NGFW and Azure Application Gateway

## Background

This guide documents a recommended architecture to deploy the Cloud NGFW for Azure behind the Azure Application Gateway.

This deployment model allows leveraging the Application Gateway's reverse proxy and Web Application Firewall (WAF) functionality while benefiting the best-in-class network security capabilities of the Cloud NGFW.

Cloud Next-Generation Firewall by Palo Alto Networks - an Azure Native ISV Service is Palo Alto Networks Next-Generation Firewall (NGFW) delivered as a cloud-native service on Azure. You can discover Cloud NGFW in the Azure Marketplace and consume it in your Azure Virtual Networks (VNet) and in the Azure Virtual WAN (vWAN). With Cloud NGFW, you can access the core NGFW capabilities such as App-ID and URL filtering-based technologies. It provides threat prevention and detection through cloud-delivered security services and threat prevention signatures.

More details about the Cloud NGFW by Palo Alto Networks - an Azure Native ISV
Service can be found here: [https://learn.microsoft.com/azure/partner-solutions/palo-alto/palo-alto-overview](/azure/partner-solutions/palo-alto/palo-alto-overview)

## Architecture

The Cloud NGFW for Azure secures inbound, outbound, and lateral traffic traversing the Hub Virtual Network (Hub VNet) or Virtual WAN Hub (vWAN Hub).

To secure ingress connections, Cloud NGFW resource supports Destination Network Address Translation (DNAT) configuration. Cloud NGFW accepts client connections on one or more of the configured Public IP addresses and performs the address translation, traffic inspection, and enforces the user-configured security policies.

For web applications, users may benefit from using Azure Application Gateway (AppGW) as a reverse proxy/Load Balancer. This combination offers the best security when securing both web-based and non-web workloads in Azure and on-prem. Ingress connections. It allows using a single Public IP address of the AppGW to proxy the HTTP(s) connections to many web application backends. Non-HTTP(s) connections should be directed via the Cloud NGFW Public IP address for inspection and policy enforcement. 

The AppGW also offers Web Application Firewall (WAF) capabilities to look for patterns that indicate an attack at the web application layer.

:::image type="content" source="media/palo-alto-app-gw/palo-alto-app-gw.png" alt-text="Diagram shows a high-level architecture with Application Gateway.":::

More details about Application Gateway features can be found here: [https://learn.microsoft.com/azure/application-gateway](/azure/application-gateway)

Cloud NGFW for Azure supports two deployment architectures:
- Hub-and-Spoke VNet 
- Virtual WAN

The following sections describe the details and the required configuration to implement this architecture in Azure.

### Hub VNet

In this deployment, two subnets are allocated in the Hub VNet. The Cloud NGFW resource is provisioned into the Hub VNet. 

The AppGW is deployed in a dedicated VNet with a Frontend listening on a Public IP address. The backend pool and target the workloads serving the web application in this example a Virtual Machine in a spoke VNet 192.168.1.0/24.

Similar to spoke VNets, the AppGW VNet must be peered with the Hub VNet to ensure the traffic can be routed towards the destination spoke VNet.

:::image type="content" source="media/palo-alto-app-gw/palo-alto-app-gw-vnet.png" alt-text="Diagram shows Cloud NGFW architecture with Application Gateway in a hub-and-spoke VNet deployment.":::

To force the incoming web traffic via the Cloud NGFW resource a User-Defined route must be created and associated with AppGW subnet. The next hop in this case is Cloud NGFW’s Private IP address which can be obtained from the “Overview” blade of the resource in Azure Portal.

:::image type="content" source="media/palo-alto-app-gw/palo-alto-resource.png" alt-text="Screenshot shows Cloud NGFW view in Azure Portal.":::

Example User-defined Route:
- Address prefix: 192.168.1.0/24
- Next hop type: Virtual Appliance
- Next hop IP address: 172.16.1.132

Once the infrastructure is deployed and configured there must be a security policy applied to the Cloud NGFW allowing the connection from the AppGW VNet. The AppGW proxies the client’s TCP connection and creates a new connection to the destination specified in the backend target. The source IP of this connection is the private IP address from the AppGW subnet. Thus, the security policy configuration should be configured accordingly using the AppGW VNet prefix to ensure it is treated as the inbound flow. The original source IP of the client is not preserved at layer 3.

Non-web traffic can continue using the Cloud NGFW’s public IP address(s) and DNAT rules.


### vWAN

Securing vWAN Hub using the Palo Alto Networks SaaS solution is the most effective and easiest way to guarantee your vWAN stays secure with a consistent security policy applied across the entire deployment. 

Routing Intent and Policy must be configured to use Cloud NGFW resource as a Next Hop for Public and/or Private traffic. Any connected spoke VNet or VPN/ExpressRoute Gateway would get the routing information to send the traffic via the Cloud NGFW resource.

:::image type="content" source="media/palo-alto-app-gw/palo-alto-app-gw-vwan.png" alt-text="Diagram shows Cloud NGFW architecture with Application Gateway in vWAN Hub deployment.":::

By default, the VNet connection to the hub has the “Propagate Default Route” flag set to “Enabled”. This installs a 0.0.0.0/0 route forcing all non-matched traffic sourced from that VNet to go via the vWAN hub. In this topology, this would result in asymmetric routing as the return traffic proxied by the AppGW will go back to the vHub instead of the Internet. Hence, when connecting the AppGW VNet to the vWAN hub, set this attribute to “Disabled” to allow the AppGW-sourced traffic to break out locally.

:::image type="content" source="media/palo-alto-app-gw/palo-alto-virtual-connection.png" alt-text="Screenshot shows vWAN virtual network connections.":::

:::image type="content" source="media/palo-alto-app-gw/palo-alto-disable-gateway.png" alt-text="Screenshot shows virtual propagate default gateway option.":::

In some cases, this may not be desirable. For example, when there are other applications or workloads hosted in the AppGW VNet requiring the inspection by the Cloud NGFW. In this case, you can enable the default route propagation but also add a 0.0.0.0/0 route to the AppGW subnet to override the default route received from the hub. An explicit route to the application VNet is also required.

:::image type="content" source="media/palo-alto-app-gw/palo-alto-route-table.png" alt-text="Screenshot shows Azure route table.":::

You can locate the Next Hop IP address of the Cloud NGFW by looking at the effective routes of a workload in a spoke VNet, for example, a Virtual Machine Network interface:

:::image type="content" source="media/palo-alto-app-gw/palo-alto-effective-routes.png" alt-text="Screenshot shows spoke VM effective routes.":::

## Security Policy Considerations

### Azure Rulestack

Azure Rulestack allows configuring the security rules and applying the security profiles right in the Azure Portal or via the API. When implementing the architecture presented above, configure the security rules leverating Palo Alto Network’s patented App-ID, Advanced Threat Prevention, Advanced URL filtering and DNS security [Cloud-Delivered Security Services](https://www.paloaltonetworks.com/network-security/security-subscriptions) (CDSS).

See [Cloud NGFW Native Policy Management Using Rulestacks](https://docs.paloaltonetworks.com/cloud-ngfw/azure/cloud-ngfw-for-azure/native-policy-management) for more details.

> [!NOTE]
> Use  of X-Forwarded-For (XFF) HTTP header field to enforce security policy is currently not supported with the Azure Rulestack policy management.

### Panorama

When managing the Cloud NGFW resources using Panorama, users may leverage the existing and new policy constructs such as template stacks, zones, vulnerability profiles, etc. The Cloud NGFW security policies may be configured between the 2 zones: Private and Public. Inbound traffic goes from Public Zone to Private, Outbound is Private-to-Public, and East-West is Private-to-Private. 

:::image type="content" source="media/palo-alto-app-gw/palo-alto-app-gw-zones-1.png" alt-text="Diagram shows Cloud NGFW zone placement and traffic flows":::

The ingress traffic coming through the Application Gateway is forwarded via the Private Zone to the Cloud NGFW resource for inspection and security policy enforcement as depicted in the diagram below.

:::image type="content" source="media/palo-alto-app-gw/palo-alto-app-gw-zones-2.png" alt-text="Diagram shows Cloud NGFW zone placement and AppGW traffic flow.":::

Special considerations need to be applied to the zone-based policies to ensure the traffic coming from the Application Gateway is treated as Inbound i.e. security rules, threat prevention profiles, Inline Cloud Analysis and other. The traffic will be treated as Private-to-Private as the Application Gateway proxies the traffic and it is sourced using the Private IP address from the Application Gateway subnet.

## References

[https://docs.paloaltonetworks.com/cloud-ngfw/azure/cloud-ngfw-for-azure](https://docs.paloaltonetworks.com/cloud-ngfw/azure/cloud-ngfw-for-azure)
[https://learn.microsoft.com/azure/architecture/example-scenario/gateway/application-gateway-before-azure-firewall](/azure/architecture/example-scenario/gateway/application-gateway-before-azure-firewall)
[https://learn.microsoft.com/azure/architecture/example-scenario/gateway/firewall-application-gateway](/azure/architecture/example-scenario/gateway/firewall-application-gateway)
[https://learn.microsoft.com/azure/virtual-wan/how-to-palo-alto-cloud-ngfw](/azure/virtual-wan/how-to-palo-alto-cloud-ngfw)