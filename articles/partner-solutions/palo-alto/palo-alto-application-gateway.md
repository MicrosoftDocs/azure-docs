---
title: Cloud NGFW for Azure deployment behind Azure Application Gateway
description: This article describes how to use Azure Application Gateway with Cloud NGFW for Azure by Palo Alto Networks to help secure web applications.

ms.topic: conceptual
ms.date: 05/06/2024

---
# Cloud NGFW for Azure deployment behind Azure Application Gateway

This article describes a recommended architecture for deploying Cloud NGFW for Azure by Palo Alto Networks behind Azure Application Gateway. Cloud NGFW for Azure is a next-generation firewall that's delivered as an Azure Native ISV Service. You can find Cloud NGFW for Azure in Azure Marketplace and consume it in your Azure Virtual Network and Azure Virtual WAN instances.

With Cloud NGFW for Azure, you can access core firewall capabilities from Palo Alto Networks, such as App-ID and Advanced URL Filtering. It provides threat prevention and detection through cloud-delivered security services and threat prevention signatures. The deployment model in this article uses the reverse proxy and web application firewall (WAF) functionality of Application Gateway by using the network security capabilities of Cloud NGFW for Azure.

For more information about Cloud NGFW for Azure, see [What is Cloud NGFW by Palo Alto Networks - an Azure Native ISV Service?](palo-alto-overview.md).

## Architecture

Cloud NGFW for Azure helps secure inbound, outbound, and lateral traffic that traverses a hub virtual network or a virtual WAN hub.

To help secure ingress connections, a Cloud NGFW for Azure resource supports Destination Network Address Translation (DNAT) configurations. Cloud NGFW for Azure accepts client connections on one or more of the configured public IP addresses and performs the address translation and traffic inspection. It also enforces user-configured security policies.

For web applications, you benefit from using Application Gateway as both a reverse proxy and a load balancer. This combination offers the best security when you want to secure both web-based and nonweb workloads in Azure and on-premises ingress connections. Cloud NGFW for Azure allows the use of a single public IP address of Application Gateway to proxy the HTTP and HTTPS connections to many web application back ends. Any non-HTTP connections should be directed through the Cloud NGFW for Azure public IP address for inspection and policy enforcement.

Application Gateway also offers WAF capabilities to look for patterns that indicate an attack at the web application layer. For more information about Application Gateway features, see the [service documentation](/azure/application-gateway).

:::image type="content" source="media/palo-alto-app-gateway/palo-alto-app-gateway.png" alt-text="Diagram that shows a high-level architecture with Application Gateway.":::

Cloud NGFW for Azure supports two deployment architectures:

- Hub-and-spoke virtual network
- Virtual WAN

The following sections describe the details and the required configuration to implement this architecture in Azure.

### Hub virtual network

This deployment allocates two subnets in the hub virtual network. The Cloud NGFW for Azure resource is provisioned into the hub virtual network.

Application Gateway is deployed in a dedicated virtual network with a front end listening on a public IP address. The back-end pool targets the workloads that serve the web application; in this example, a virtual machine in a spoke virtual network with an IP address of 192.168.1.0/24.

Similar to spoke virtual networks, the Application Gateway virtual network must be peered with the hub virtual network to ensure that the traffic can be routed toward the destination spoke virtual network.

:::image type="content" source="media/palo-alto-app-gateway/palo-alto-app-gateway-vnet.png" alt-text="Diagram that shows a Cloud NGFW for Azure architecture with Application Gateway in a hub-and-spoke virtual network deployment.":::

To force incoming web traffic through the Cloud NGFW for Azure resource, you must create a user-defined route and associate it with the Application Gateway subnet. The next hop in this case is the private IP address of Cloud NGFW for Azure. You can find this address by selecting **Overview** from the resource menu in the Azure portal.

:::image type="content" source="media/palo-alto-app-gateway/palo-alto-resource.png" alt-text="Screenshot that shows the Cloud NGFW for Azure view in the Azure portal.":::

Here's an example user-defined route:

- Address prefix: 192.168.1.0/24
- Next hop type: virtual appliance
- Next hop IP address: 172.16.1.132

After you deploy and configure the infrastructure, you must apply a security policy to Cloud NGFW for Azure that allows the connection from the Application Gateway virtual network. Application Gateway proxies the client's TCP connection and creates a new connection to the destination specified in the back-end target. The source IP of this connection is the private IP address from the Application Gateway subnet. Configure the security policy accordingly, by using the Application Gateway virtual network prefix to ensure that it's treated as the inbound flow. The original source IP of the client isn't preserved at layer 3.

Nonweb traffic can continue using the public IP addresses and DNAT rules in Cloud NGFW for Azure.

### Virtual WAN

Securing a virtual WAN hub by using a Palo Alto Networks software as a service (SaaS) solution is the most effective and easiest way to guarantee that your virtual WAN has a consistent security policy applied across the entire deployment.

You must configure a routing intent and a routing policy to use a Cloud NGFW for Azure resource as a next hop for public or private traffic. Any connected spoke virtual network, VPN gateway, or Azure ExpressRoute gateway then gets the routing information to send the traffic through the Cloud NGFW for Azure resource.

:::image type="content" source="media/palo-alto-app-gateway/palo-alto-app-gateway-vwan.png" alt-text="Diagram that shows a Cloud NGFW for Azure architecture with Application Gateway in a virtual WAN hub deployment.":::

By default, the virtual network connection to the hub has the **Propagate Default Route** option set to **Enabled**. This setting installs a 0.0.0.0/0 route to force all nonmatched traffic sourced from that virtual network to go through the virtual WAN hub. In this topology, this setting would result in asymmetric routing because the return traffic proxied by Application Gateway would go back to the virtual hub instead of the internet. When you're connecting the Application Gateway virtual network to the virtual WAN hub, set this attribute to **Disabled** to allow the Application Gateway-sourced traffic to break out locally.

:::image type="content" source="media/palo-alto-app-gateway/palo-alto-virtual-connection.png" alt-text="Screenshot that shows virtual network connections for a virtual WAN.":::

:::image type="content" source="media/palo-alto-app-gateway/palo-alto-disable-gateway.png" alt-text="Screenshot that shows the toggle for disabling the default route propagation.":::

In some cases, disabling the default route propagation might not be desirable. An example is when other applications or workloads are hosted in the Application Gateway virtual network and require the inspection by Cloud NGFW for Azure. In this case, you can enable the default route propagation but add a 0.0.0.0/0 route to the Application Gateway subnet to override the default route received from the hub. An explicit route to the application virtual network is also required.

:::image type="content" source="media/palo-alto-app-gateway/palo-alto-route-table.png" alt-text="Screenshot that shows an Azure route table.":::

You can locate the next hop IP address of Cloud NGFW for Azure by viewing the effective routes of a workload in a spoke virtual network. The following example shows the effective routes for a virtual machine network interface.

:::image type="content" source="media/palo-alto-app-gateway/palo-alto-effective-routes.png" alt-text="Screenshot that shows effective routes for a spoke virtual machine.":::

## Security policy considerations

### Azure rulestacks

You can use Azure rulestacks to configure security rules and apply security profiles in the Azure portal or through the API. When you're implementing the preceding architecture, configure the security rules by using Palo Alto Networks App-ID, Advanced Threat Prevention, Advanced URL Filtering, DNS Security, and [Cloud-Delivered Security Services](https://www.paloaltonetworks.com/network-security/security-subscriptions).

For more information, see [Cloud NGFW Native Policy Management Using Rulestacks](https://docs.paloaltonetworks.com/cloud-ngfw/azure/cloud-ngfw-for-azure/native-policy-management).

> [!NOTE]
> Use of the X-Forwarded-For (XFF) HTTP header field to enforce security policy is currently not supported with Azure rulestacks.

### Panorama

When you manage Cloud NGFW for Azure resources by using Panorama, you can use existing and new policy constructs such as template stacks, zones, and vulnerability profiles. You can configure the Cloud NGFW for Azure security policies between the two zones: private and public. Inbound traffic goes from public to private, outbound traffic goes from private to public, and east-west traffic goes from private to private.

:::image type="content" source="media/palo-alto-app-gateway/palo-alto-app-gateway-zones-1.png" alt-text="Diagram that shows zone placement and traffic flows in Cloud NGFW for Azure.":::

The ingress traffic that comes through Application Gateway is forwarded through the private zone to the Cloud NGFW for Azure resource for inspection and security policy enforcement.

:::image type="content" source="media/palo-alto-app-gateway/palo-alto-app-gateway-zones-2.png" alt-text="Diagram that shows zone placement in Cloud NGFW for Azure and traffic flow through Application Gateway.":::

You need to apply special considerations to zone-based policies to ensure that the traffic coming from Application Gateway is treated as inbound. These policies include security rules, threat prevention profiles, and inline cloud analysis. The traffic is treated as private-to-private because Application Gateway proxies it, and it's sourced through the private IP address from the Application Gateway subnet.

## Related content

- [Cloud NGFW for Azure](https://docs.paloaltonetworks.com/cloud-ngfw/azure/cloud-ngfw-for-azure) (documentation from Palo Alto Networks)
- [Zero-trust network for web applications with Azure Firewall and Application Gateway](/azure/architecture/example-scenario/gateway/application-gateway-before-azure-firewall)
- [Firewall and Application Gateway for virtual networks](/azure/architecture/example-scenario/gateway/firewall-application-gateway)
- [Configure Palo Alto Networks Cloud NGFW in Virtual WAN](/azure/virtual-wan/how-to-palo-alto-cloud-ngfw)
