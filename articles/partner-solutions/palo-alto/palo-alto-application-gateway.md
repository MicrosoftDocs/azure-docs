---
title: Securing web applications with Cloud NGFW by Palo Alto Networks
description: This article describes how to use the Azure Application Gateway with the Cloud NGFW (Next-Generation Firewall) by Palo Alto Networks - an Azure Native ISV Service resource.

ms.topic: conceptual
ms.date: 05/06/2024

---
# Cloud NGFW and Azure Application Gateway

In this article, you see a recommended architecture for deploying the Cloud NGFW for Azure behind the Azure Application Gateway.

This deployment model uses the Application Gateway's reverse proxy and Web Application Firewall (WAF) functionality using the network security capabilities of the Cloud NGFW.

The Cloud Next-Generation Firewall by Palo Alto Networks - an Azure Native ISV Service is Palo Alto Networks Next-Generation Firewall (NGFW) delivered as a cloud-native service on Azure. You find the Cloud NGFW in the Azure Marketplace and consume it in your Azure Virtual Networks (VNet) and in the Azure Virtual WAN (vWAN).

With Cloud NGFW, you can access the core NGFW capabilities such as App-ID and URL filtering-based technologies. It provides threat prevention and detection through cloud-delivered security services and threat prevention signatures.

For more information about the Cloud NGFW by Palo Alto Networks - an Azure Native ISV
Service, see [What is Cloud NGFW by Palo Alto Networks - an Azure Native ISV Service?](palo-alto-overview.md).

## Architecture

The Cloud NGFW for Azure secures inbound, outbound, and lateral traffic traversing the Hub Virtual Network (Hub VNet) or Virtual WAN Hub (vWAN Hub).

To secure ingress connections, Cloud NGFW resource supports Destination Network Address Translation (DNAT) configuration. Cloud NGFW accepts client connections on one or more of the configured Public IP addresses and performs the address translation, traffic inspection, and enforces the user-configured security policies.

For web applications, you benefit from using Azure Application Gateway (AppGW) as a reverse proxy/Load Balancer. This combination offers the best security when securing both web-based and nonweb workloads in Azure and on-premises. Ingress connections. It allows using a single Public IP address of the AppGW to proxy the HTTP and Https connections to many web application backends. Any Non-HTTP connections should be directed through the Cloud NGFW Public IP address for inspection and policy enforcement.

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

To force the incoming web traffic through the Cloud NGFW resource, a User-Defined route must be created and associated with AppGW subnet. The next hop in this case is Cloud NGFW’s Private IP address. You can see this by selecting **Overview** from the Resource menu in the Azure portal.

:::image type="content" source="media/palo-alto-app-gw/palo-alto-resource.png" alt-text="Screenshot shows Cloud NGFW view in Azure portal.":::

Example User-defined Route:

- Address prefix: 192.168.1.0/24
- Next hop type: Virtual Appliance
- Next hop IP address: 172.16.1.132

Once the infrastructure is deployed and configured, there must be a security policy applied to the Cloud NGFW allowing the connection from the AppGW VNet. The AppGW proxies the client’s TCP connection and creates a new connection to the destination specified in the backend target. The source IP of this connection is the private IP address from the AppGW subnet. Thus, the security policy configuration should be configured accordingly using the AppGW VNet prefix to ensure it's treated as the inbound flow. The original source IP of the client isn't preserved at layer 3.

Nonweb traffic can continue using the Cloud NGFW’s public IP addresses and DNAT rules.

### vWAN

Securing vWAN Hub using the Palo Alto Networks SaaS solution is the most effective and easiest way to guarantee your vWAN stays secure with a consistent security policy applied across the entire deployment.

Routing Intent and Policy must be configured to use Cloud NGFW resource as a Next Hop for Public and/or Private traffic. Any connected spoke VNet or VPN/ExpressRoute Gateway would get the routing information to send the traffic through the Cloud NGFW resource.

:::image type="content" source="media/palo-alto-app-gw/palo-alto-app-gw-vwan.png" alt-text="Diagram shows Cloud NGFW architecture with Application Gateway in vWAN Hub deployment.":::

By default, the VNet connection to the hub has the _Propagate Default Route_ flag set to `Enabled`. This installs a 0.0.0.0/0 route forcing all nonmatched traffic sourced from that VNet to go through the vWAN hub. In this topology, this would result in asymmetric routing as the return traffic proxied by the AppGW goes back to the vHub instead of the Internet. Hence, when connecting the AppGW VNet to the vWAN hub, set this attribute to **Disabled** to allow the AppGW-sourced traffic to break out locally.

:::image type="content" source="media/palo-alto-app-gw/palo-alto-virtual-connection.png" alt-text="Screenshot shows vWAN virtual network connections.":::

:::image type="content" source="media/palo-alto-app-gw/palo-alto-disable-gateway.png" alt-text="Screenshot shows virtual propagate default gateway option.":::

In some cases, this might not be desirable. For example, when there are other applications or workloads hosted in the AppGW VNet requiring the inspection by the Cloud NGFW. In this case, you can enable the default route propagation but also add a 0.0.0.0/0 route to the AppGW subnet to override the default route received from the hub. An explicit route to the application VNet is also required.

:::image type="content" source="media/palo-alto-app-gw/palo-alto-route-table.png" alt-text="Screenshot shows Azure route table.":::

You can locate the Next Hop IP address of the Cloud NGFW by looking at the effective routes of a workload in a spoke VNet, for example, a Virtual Machine Network interface:

:::image type="content" source="media/palo-alto-app-gw/palo-alto-effective-routes.png" alt-text="Screenshot shows spoke VM effective routes.":::

## Security Policy Considerations

### Azure Rulestack

Azure Rulestack allows configuring the security rules and applying the security profiles right in the Azure portal or through the API. When implementing the architecture presented previously, configure the security rules using Palo Alto Network’s App-ID, Advanced Threat Prevention, Advanced URL filtering, and DNS security [Cloud-Delivered Security Services](https://www.paloaltonetworks.com/network-security/security-subscriptions) (CDSS).

For more information, see [Cloud NGFW Native Policy Management Using Rulestacks](https://docs.paloaltonetworks.com/cloud-ngfw/azure/cloud-ngfw-for-azure/native-policy-management).

> [!NOTE]
> Use  of X-Forwarded-For (XFF) HTTP header field to enforce security policy is currently not supported with the Azure Rulestack policy management.

### Panorama

When you manage the Cloud NGFW resources using Panorama, you can use the existing and new policy constructs such as template stacks, zones, vulnerability profiles, etc. The Cloud NGFW security policies can be configured between the two zones: Private and Public. Inbound traffic goes from Public Zone to Private, Outbound is Private-to-Public, and East-West is Private-to-Private.

:::image type="content" source="media/palo-alto-app-gw/palo-alto-app-gw-zones-1.png" alt-text="Diagram shows Cloud NGFW zone placement and traffic flows":::

The ingress traffic coming through the Application Gateway is forwarded through the Private Zone to the Cloud NGFW resource for inspection and security policy enforcement as depicted in the following image.

:::image type="content" source="media/palo-alto-app-gw/palo-alto-app-gw-zones-2.png" alt-text="Diagram shows Cloud NGFW zone placement and AppGW traffic flow.":::

Special considerations need to be applied to the zone-based policies to ensure the traffic coming from the Application Gateway is treated as Inbound, that is, security rules, threat prevention profiles, Inline Cloud Analysis and other. The traffic is treated as Private-to-Private as the Application Gateway proxies the traffic, and it's sourced using the Private IP address from the Application Gateway subnet.

## Related content

- [Cloud NGFW for Azure](https://docs.paloaltonetworks.com/cloud-ngfw/azure/cloud-ngfw-for-azure)
- [Zero-trust network for web applications with Azure Firewall and Application Gateway](/azure/architecture/example-scenario/gateway/application-gateway-before-azure-firewall)
- [Firewall and Application Gateway for virtual networks](/azure/architecture/example-scenario/gateway/firewall-application-gateway)
- [Configure Palo Alto Networks Cloud NGFW in Virtual WAN](/azure/virtual-wan/how-to-palo-alto-cloud-ngfw)
