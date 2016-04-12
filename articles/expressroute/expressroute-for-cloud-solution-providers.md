<properties
   pageTitle="Azure ExpressRoute for Cloud Solution Providers | Microsoft Azure"
   description="This article provides information for Cloud Service Providers that want to encorporate Azure services and ExpressRoute into their offereings."
   documentationCenter="na"
   services="expressroute"
   authors="richcar"
   manager="josha"
   editor=""/>
<tags
   ms.service="expressroute"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="04/08/2016"
   ms.author="richcar"/>

# ExpressRoute for Cloud Solution Providers

 Microsoft provides Hyper-scale services for traditional resellers and distributors (Cloud Solution Providers) to be able to rapidly provision new services and solutions for their customers without the need to invest in creating these new services. To allow the Cloud Solution Provider (CSP) the ability to directly manage these new services, Microsoft provides programs and APIs that allow the CSP to manage Microsoft Azure resources on behalf of their customers. One of those resources is ExpressRoute. ExpressRoute allows the CSP to connect existing datacenter customer resources to Azure services. ExpressRoute is a high speed private communications link to services in Azure. 

Microsoft Azure provides a growing number of services that CSPs can offer to their customers.  To best advantage of these services will require the use ExpressRoute connections to provide high speed low latency access to the Microsoft Azure environment.

>[AZURE.NOTE] In the current implementation of ExpressRoute each circuit must pair be connected to a single customer subscription and cannot be shared by multiple customers.

>[AZURE.NOTE] There are bandwidth and connection caps on ExpressRoute which means that most implementations will require multiple ExpressRoute circuits for a customer.


## Microsoft Azure Management
Microsoft Azure provides CSPs with access to new services offered by Microsoft Azure, without the need for the CSP to invest capital to develop those services. Microsoft provides CSPs with APIs to manage the customer Azure subscriptions by integrating programmatically with their own service management systems. Supported management capabilities can be found [here](https://msdn.microsoft.com/library/partnercenter/dn974944.aspx).

>[AZURE.NOTE] if the CSP is managing resources in the customers Microsoft Azure subscription they will need administrative rights in the customer subscription(s).

## Microsoft Azure Resource Management
Depending on the contract the customer has with the CSP. The CSP can directly manage the creation and maintenance of resources or the customer can maintain control of the Microsoft Azure subscription. If the customer manages the creation of resources in their Microsoft Azure subscription they will use one of two models: “Connect-Through” model, or “Direct-To” model. These models are described in detail in the following sections.  

### Connect-Through Model

![alt text](./media/expressroute-for-cloud-solution-providers/connect-through.png)

In the connect-through model, the CSP creates a direct connection between their datacenter and the customer’s Azure subscription. The direct connection is made using site-to-site VPN or ExpressRoute, using the provider’s network. Then the customer connects to the provider, and the provider connects to Azure. This scenario requires that the customer passes through the CSP network to access CSP provisioned Azure services. 
If the customer has other Azure subscriptions not managed by the CSP, they would use the public Internet or their own private connection to connect to those services provisioned under the non CSP subscription. 
For these customers it is assumed that the provider has a previously established customer identity store which would then be replicated into Azure Active Directory for management of their CSP subscription through Administrate-On-Behalf-Of (AOBO). Key drivers for this scenario include where a given partner or service provider has an established relationship with the customer, the customer is consuming provider services currently or the partner has a desire to provide a combination of provider-hosted and Azure-hosted solutions to provide flexibility and address customer challenges which cannot be satisfied by CSP alone. This model is illustrated in **Figure**, below.

![alt text](./media/expressroute-for-cloud-solution-providers/connect-through-model.png)

### Connect-To Model

![alt text](./media/expressroute-for-cloud-solution-providers/connect-to.png)

In the Connect-To model, the service provider creates a direct connection between the customer’s datacenter and the CSP provisioned Azure subscription using site-to-site VPN over the customer’s (customer) network. Although it is not supported as of the time of this writing, in the future it will be possible to create an ExpressRoute connection between the customer’s datacenter and Azure subscription.

>[Azure.Note] For ExpressRoute the customer would need to create and maintain the ExpressRoute circuit.

This connectivity scenario requires that the customer connects directly through a customer network to access CSP-provisioned Azure subscription, using a direct network connection that is created, owned and managed either wholly or in part by the customer. For these customers it is assumed that the provider does not currently have a customer identity store established, and the provider would assist the customer in replicating their current identify store into Azure Active Directory for management of their CSP subscription through AOBO. Key drivers for this scenario include where a given partner or service provider has an established relationship with the customer, the customer is consuming provider services currently, or the partner has a desire to provide services that are based solely on Azure-hosted solutions without the need for an existing provider datacenter or infrastructure.

![alt text](./media/expressroute-for-cloud-solution-providers/connect-to-model.png)

The choice between these two option are based on the customer’s needs and the partner’s current or expected capacity to provide services. The details of these models and the associated role-based access control, networking, and identity design patterns are covered in details in the following links:
-	**Role Based Access Control (RBAC)** – RBAC is based on Azure Active Directory.  For more information on Azure RBAC see [here](../active-directory/role-based-access-control-configure.md).
-	**Networking** – Covers the various topics of networking in Microsoft Azure.
-	**Azure Active Directory (AAD)** – AAD provides the identity management for Microsoft Azure and 3rd party SaaS applications. For more information about Azure AD see [here](https://azure.microsoft.com/documentation/services/active-directory/).


## Network Speeds
ExpressRoute supports network speeds from 50 Mb/s to 10Gb/s. This allows customers to purchase the amount of network bandwidth needed for their unique environment.

>[AZURE.NOTE] Network bandwidth can be increased as needed without disrupting communications, but to reduce the network speed requires tearing down the circuit and recreating it at the lower network speed.

ExpressRoute supports the connection of multiple vNets to a single ExpressRoute circuit for better utilization of the higher-speed connections.

## Configuring ExpressRoute
ExpressRoute is a single customer-to-Azure connection. There is currently no way to associate more than one customer with an Azure subscription or virtual network. To connect multiple customers to Azure over ExpressRoute requires at least one ExpressRoute connections for each customer. 

### Connect-Through Model
In a connect-through configuration the CSP will be responsible for all of the networking underpinnings to connect their datacenter resources to the subscriptions hosted in Azure. Each customer that wants to use Azure capabilities will need their own ExpressRoute connection, which will be managed by the CSP. The CSP will use the same method the customer would use to procure the ExpressRoute circuit. The CSP will follow the same steps outlined in the article [ExpressRoute workflows](./expressroute-workflows.md) for circuit provisioning and circuit states. The CSP will then configure the Border Gateway Protocol (BGP) routes to control the traffic flowing between the on-premises network and Azure vNet.

### Connect-To Model
In a connect-to configuration, the customer has an existing connection to Azure or will initiate a connection to the internet service provider linking ExpressRoute to the customer’s own datacenter, instead of the CSP datacenter. To begin the provisioning process, the customer will follow the steps as described in the Connect-Through model, above. Once the circuit has been established the customer will need to configure the on-premises routers to be able to access both CSP network and Azure vNets.

The CSP can assist with setting up the connection and configuring the routes to allow the resources in the CSP’s datacenter to communicate with the client resources in the customer’s datacenter, or with the resources hosted in Azure.

## ExpressRoute Routing Domains
ExpressRoute offers three routing domains: public, private, and Microsoft peering. Each of the routing domains are configured with identical routers in active-active configuration for high availability. For more details on ExpressRoute routing domains look [here](./expressroute-circuit-peerings.md).

[AZURE.NOTE] Connectivity through the Public domain is always initiated from your internal network; no traffic originates from the internet bound for your internal network.

You can define custom routes filters to allow only the route you want to allow or need. For more information, To see how to make these changes see article: [Create and modify routing for an ExpressRoute circuit using PowerShell](./expressroute-howto-routing-classic.md).

[AZURE.NOTE] We do not allow customers to select limited sets of routes to Microsoft services. For example, advertising a route to Outlook, but not a route to Skype services, is not allowed. All Microsoft Services will be available to client machines.

[AZURE.NOTE] For Public Peering connectivity must be though a public IP address owned by the customer or CSP and must adhere to all defined rules. For more information, see the [ExpressRoute Prerequisites](expressroute-prerequisites.md) page.

## Routing
ExpressRoute connects to the Azure networks through the Azure Virtual Network Gateway. Network gateways provide routing for Azure virtual networks.

Creating Azure Virtual Networks also creates a default routing table for the vNet to direct traffic to/from the subnets of the vNet. If the default route table is insufficient for the solution custom routes can be created to route outgoing traffic to custom appliances or to block routes to specific subnets or external networks.

[AZURE.NOTE] Each subnet can only have one routing table, but a single routing table can be applied to multiple subnets.

### Default Routing
The default route table includes the following routes:

- Routing within a subnet
- Subnet-to-subnet within the virtual network
- To the Internet
- Virtual network-to-virtual network using VPN gateway
- Virtual network-to-on-premises network using a VPN or ExpressRoute gateway

![alt text](./media/expressroute-for-cloud-solution-providers/default-routing.png)

### User-Defined Routing
User-defined routes allow the control of traffic outbound from the assigned subnet to other subnets in the virtual network or over one of the other predefined gateways (ExpressRoute; internet or VPN). The default system routing table can be replaced with a user-defined routing table that replaces the default routing table with custom routes. With user-defined routing, customers can create specific routes to appliances such as firewalls or intrusion detection appliances, or block access to specific subnets from the subnet hosting the user-defined route. For more information about User Defined Routes look [here](../virtual-network/virtual-networks-udr-overview.md).

[AZURE.NOTE] User-defined routes do not affect incoming traffic into the subnet.

## Security
Depending on which model is in use, Connect-To or Connect-Through, the customer defines the security policies in their vNet or provides the security policy requirements to the CSP to define to their vNets. The following security criteria can be defined:

1.	**Customer Isolation** — The Azure platform provides customer isolation by storing Customer ID and vNet info in a secure database, which is used to encapsulate each customer’s traffic in a GRE tunnel.
2.	**Network Security Group (NSG)** rules are for defining allowed traffic into and out of the subnets within vNets in Azure. By default, the NSG contain Block rules to block traffic from the Internet to the vNet and Allow rules for traffic within a vNet. For more information about Network Security Groups look [here](https://azure.microsoft.com/blog/network-security-groups/).
3.	**Force tunneling** —This is an option to redirect internet bound traffic originating in Azure to be redirected over the 
ExpressRoute connection to the on premises datacenter. For more information about Forced tunneling look [here](./expressroute-routing.md#advertising-default-routes).

>[Azure.Note] Forced tunneling is enabled by the customer by publishing a default route of 0.0.0.0

4.	**Encryption** — Even though the ExpressRoute circuits are dedicated to a specific end customer, there is the possibility that the network provider could be breached, allowing an intruder to examine packet traffic. To address this potential, a customer or CSP can encrypt traffic over the connection by defining IPSec tunnel-mode policies for all traffic flowing between the on premises resources and Azure resources (refer to the optional Tunnel mode IPSec for Customer 1 in Figure 5: ExpressRoute Security, above). The second option would be to use a firewall appliance at each the end point of the ExpressRoute circuit. This will require additional 3rd party firewall VMs/Appliances to be installed on both ends to encrypt the traffic over the ExpressRoute circuit.


![alt text](./media/expressroute-for-cloud-solution-providers/expressroute-security.png)

## Summary
The Cloud Solution Provider service provides traditional Hosters with a way to increase their value to their customers without the need for expensive infrastructure and capability purchases, while maintaining their position with their customers as the primary outsourcing provider. Integration with Azure can be accomplished seamlessly through the CSP API, allowing the CSP to integrate management of Azure within their exist management frameworks.