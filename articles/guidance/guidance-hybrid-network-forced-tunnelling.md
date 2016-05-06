<properties
   pageTitle="Azure Architecture Reference - IaaS: Implementing a secure hybrid network architecture in Azure | Microsoft Azure"
   description="How to implement a secure hybrid network architecture in Azure."
   services="guidance,vpn-gateway,expressroute,load-balancer,virtual-network"
   documentationCenter="na"
   authors="JohnPWSharp"
   manager="masashin"
   editor=""
   tags="azure-resource-manager"/>

<tags
   ms.service="guidance"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/05/2016"
   ms.author="johns@contentmaster.com"/>

# Implementing a secure hybrid network architecture in Azure

![INCLUDE FOR BRANDING]

This article describes best practices for implementing a secure hybrid network the extends your on-premises network to Azure. In this reference architecture, you will learn how to use user defined routes (UDRs) to route incoming traffic on a virtual network to a set of highly available network virtual appliances. These appliances can run different types of security software, such as firewalls, packet inspection, among others. You will also learn how to enable forced tunneling, to have all outgoing traffic to the Internet be routed to your on-premises data center. This architecture uses a connection to your on-premises datacenter using either a [VPN gateway][ra-vpn], or [ExpressRoute][ra-expressroute] connection. 

> [AZURE.NOTE] Azure has two different deployment models: [Resource Manager][resource-manager-overview] and classic. This reference architecture uses Resource Manager, which Microsoft recommends for new deployments.

Typical use cases for this architecture include:

- Hybrid applications where workloads run partly on-premises and partly in Azure.

- Infrastructure that requires a more granular control over traffic coming into Azure from an on-premises datacenter.

- Auditing outgoing traffic from the VNet. On-premises components can inspect and log all Internet requests. This is often a regulatory requirement of many commercial systems and can help to prevent public disclosure of private information.

## Architecture diagram

The following diagram highlights the important components in this architecture:

![IaaS: forced-tunnelling](./media/guidance-hybrid-network-forced-tunnelling/figure1.png)
<!-- [TELMO] We want to take out the PIP in the jumpbox, it should only be accessible from on-prem. We also want to force Internet traffic traffic through on-prem ONLY for the business layer. All other layers should have an NSG that denies outgoing Internet traffic. The only issue here is access to the diagnostic logging storage account, but let me worry about that for now. -->

<!-- [TELMO] Can we try to introduce these components in the same order as the previous documents? And reusing the content from those as much as possible?  -->

- **On-premises network.** This is a network of computers and devices, connected through a private local-area network running within an organization.

- **Network security appliance (NSA).** This is an on-premises network security appliance that inspects requests intended for the Internet. All outbound Internet requests are directed through this device.
<!-- [TELMO] I have seen NSA used in the name of network security appliance products, but never as a generic term  -->

- **Azure virtual network (VNet).** The VNet hosts the application and other resources running in the cloud.

- **Gateway.** The gateway provides the connectivity between routers in the on-premises network and the VNet. You can use an [Azure VPN gateway][guidance-vpn-gateway] or an [Azure ExpressRoute gateway][guidance-expressroute]. The gateway uses its own gateway subnet.

- **Network virtual appliance (NVA).** An NVA is a generic term for a virtual appliance that might perform tasks such as acting as a firewall, implementing access security, WAN optimization (including network compression), custom routing, or a variety of other operations. The diagram depicts the NVA as a collection of load-balanced VMs, accepting incoming requests on the inbound NVA subnet (acting as a security perimeter subnet) before validating them and forwarding the requests to the Web tier through the outbound NVA subnet.

- **Web tier, business tier, and data tier subnets.** These are subnets hosting the VMs and services that implement an example 3-tier application running in the cloud; see [Implementing a multi-tier architecture on Azure][implementing-a-multi-tier-architecture-on-Azure] for more details. You can deploy an internal load balancer in each tier to improve scalability. The traffic in each subnet may be subject to rules defined by using [Azure Network Security Groups][azure-network-security-group](NSGs) to limit the source of requests and the destinations of any results. The For more information, see the [Security][security] section of this document.

    > [AZURE.NOTE] This article describes the cloud application as a single entity. See [Implementing a Multi-tier Architecture on Azure][implementing-a-multi-tier-architecture-on-Azure] for detailed information.

- **User-defined routes (UDR).** Each of the application subnets defines one or more custom (user-defined) routes for directing Internet requests made by VMs running in that subnet. Each UDR redirects requests back through the on-premises network for auditing. If the request is permitted, it can be forwarded to the Internet.

    > [AZURE.NOTE] Any response received as a result of the request will return directly to the originator in the Web tier, Business tier, or Data tier subnets and will not pass through on-premises network.

	A further UDR is defined for the Gateway subnet to ensure that all traffic from the on-premises network is routed through the NVAs.

- **Management subnet.** This subnet contains VMs that implement management and monitoring capabilities for the components running in the VNet. The monitoring VM captures log and performance data from the virtual hardware in the cloud. The jump box enables authorized DevOps staff to log in, configure, and manage the network through an external IP address.

## Implementing this architecture
<!-- [TELMO] This topic should be replaced with "Recommendations" and we should recommend best practices for some of the resources being used. For instance, we should talk about the GatewaySubnet mask being /27 (and why), the use of multiple NVAs for availability and load balancing, the use of NSGs to filter outgoign traffic from subnets, the use a jumpbox accessible only through the on-prem network to avoid having any public endpoint, the possibility of using ExpressRoute and VPN gateway for failover, etc.  -->

The following high-level steps outline a process for configuring forced tunnelling for an application tier hosted in an Azure subnet. Detailed examples using Azure PowerShell commands are describe [later in this document][script]. Note that this process assumes the following:

- You have already created an Azure VNet for hosting the cloud application,

- You have created the on-premises network,

- You have connected the on-premises network to the Azure VNet through an Azure virtual network gateway, either by using a [VPN connection][guidance-vpn-gateway] or [ExpressRoute][guidance-expressroute].

1. Create a local network gateway for connecting to the on-premises network:

2. Create an Azure virtual network gateway. Set the default site to the local network gateway for the on-premises network:

	```powershell
	azure network vpn-gateway create -g <<resource-group>> -n <<gateway-name>> -l <<location>> -m <<vnet-name>> -d <<name-of-local-network-gateway>> -b false -p <<pip-name>>
	```

	> [AZURE.NOTE] If the default site for the virtual network gateway is not specified correctly, then forced tunnelling may not work as requests will not be directed back to the on-premises network. If the local network gateway is in a different resource group than the virtual network gateway, use the -i flag and specify the resource id of the local network gateway rather then providing the name.

3. Connect the local network gateway to the virtual network gateway. This can be a site-to-site (IPsec) connection, or an ExpressRoute connection. Configure the on-premises router to direct application requests through the gateway. The procedure for doing this will vary depending on the appliance you are using. For more information, see [Implementing a Hybrid Network Architecture with Azure and On-premises VPN][guidance-vpn-gateway] and [Implementing a hybrid network architecture with Azure ExpressRoute][guidance-expressroute].

4. Create an Azure route table:

	```powershell
	azure network route-table create -n <<route-table-name>> -g <<resource-group> -l <<location>>
	```

5. Add a default route to the route table that directs IP requests through the virtual network gateway:

	```powershell
	azure network route-table route create -n "DefaultRoute" -g <<resource-group>> -a "0.0.0.0/0" -y VirtualNetworkGateway -r <<route-table-name>>
	```

6. Associate the route table with each of the subnets in the application tier:

	> [AZURE.NOTE] You can reuse the same route table in more than one subnet.

	```powershell
	azure network vnet subnet set -e <<vnet-name>> -n <<web-tier-subnet-name>> -a <<web-tier-subnet-address-space>> -g <<resource-group>> -r <<route-table-name>>

	azure network vnet subnet set -e <<vnet-name>> -n <<business-tier-subnet-name>> -a <<business-tier-subnet-address-space>> -g <<resource-group>>  -r <<route-table-name>>

	azure network vnet subnet set -e <<vnet-name>> -n <<data-access-tier-subnet-name>> -a <<data-access-tier-subnet-address-space>> -g <<resource-group>>  -r <<route-table-name>>
	```

7. Configure the on-premises NSA to direct force-tunnelled traffic to the Internet. This process will vary according to the device used to implement the NSA. For example, if you are using the Routing and Remote Access Service, you can add a static route as follows:

	![IaaS: rras-static-route](./media/guidance-hybrid-network-forced-tunnelling/figure2.png)

> [AZURE.NOTE] For detailed information and examples on implementing forced tunnelling, see [Configure forced tunneling using PowerShell and Azure Resource Manager][azure-forced-tunnelling].

## Solution components
<!-- [TELMO] This topic will describe how each component, or set of components for this architecture will be configured, from a ARM template or script perspective. We will fill these in next week.  -->


Once the connections are established, follow these steps to test the environment:

1. Make sure you can connect from your on-premises network to your Azure VNet.

2. **STEP 2**

	```powershell
	TBD
	```

## Availability

**TBD**

## Security

- The NVA provides protection for traffic arriving from the on-premises network. Route all traffic received through the Azure gateway through the NVA. If the NVA is implemented as an Azure VM, enable IP forwarding to enable traffic intended for the web tier application subnet to be received by the VM through the inbound NVA subnet. You can use the following command to enable IP forwarding for a NIC:
<!-- [TELMO] ThNVAs can only be implemented as VMs.  -->

	```powershell
	azure network nic set -g <<resource-group>> -n <<nva-inbound-nic-name>> -f true
	```

- Configure the NVA to inspect all requests intended for the web tier application subnet, and only permit access to traffic if it is appropriate to do so.
<!-- [TELMO] We might want to provide a list of NVAs available from the marketplace.  -->

- Ensure that inbound traffic cannot bypass the NVA. To do this, add a user-defined route (UDR) to the Gateway subnet that directs all requests arriving through the gateway to the NVA, (or the load balancer in front of the NVAs if you are using multiple security devices, for scalability). In the example shown in the diagram in the [Architecture blueprint][architecture] section, if the load balancer for the NVAs has the IP address 10.0.1.5 in the inbound NVA subnet, you can use the following commands to:

<!-- [TELMO] I'm not too concerned about HOW here. Tell them what to do, have links to the docs that show how it is done. If there are no docs, then, well, add the HOW :)  -->

	1. Create a route table:

		```powershell
		azure network route-table create <<resource-group>> <<route-table-name>> <<location>>
		```

	2. Add a route for the web tier application subnet (10.0.3.0/24) to the route table that direct requests through the NVA load balancer:

		```powershell
		azure network route-table route create -a 10.0.3.0/24 -y VirtualAppliance -p 10.0.1.5 <<resource-group>> <<route-table-name>> <<route-name>>
		```

	3. Associate the route table with the Gateway subnet:

		```powershell
		azure network vnet subnet set -r <<route-table-name>> <<resource-group>> <<vnet-name>> GatewaySubnet
		```

- The gateway subnet exposes a public IP address for handling the connection to the on-premises network. There is a risk that this endpoint could be be used as a point of attack. Additionally, if any of the application tiers are compromised, unauthorized traffic could enter from there as well, enabling an invader to reconfigure your NVA. Create a network security group (NSG) for the inbound NVA subnet and define rules that block all traffic that has not originated from the on-premises network (192.168.0.0/16 in the diagram in the [Architecture blueprint][architecture]):

	
	```powershell
	azure network nsg create <<resource-group>> nva-nsg <<location>>

	azure network vnet subnet set --network-security-group-name nva-nsg <<resource-group>> <<vnet-name>> <<inbound-nva-subnet-name>>

	azure network nsg rule create --protocol * --source-address-prefix 192.168.0.0/16 --source-port-range * --destination-port-range * --access Allow --priority 200 --direction Inbound <<resource-group>> nva-nsg allow-traffic-from-on-prem

	azure network nsg rule create --protocol * --source-address-prefix * --source-port-range * --destination-port-range * --access Deny --priority 300 --direction Inbound <<resource-group>> nva-nsg deny-other-traffic
	```

- Create NSGs for each subnet with rules to permit or deny access to network traffic, according to the security requirements of the application. NSGs can also provide a second level of protection against inbound traffic bypassing the NVA if the NVA is misconfigured or disabled. The example shown in the diagram in the [Architecture blueprint][architecture] section uses the following NSGs:

	1. In the web tier subnet (10.0.3.0/24), an NSG named `web-nsg` contains rules that block all requests other than those for port 80 that have been received from the on-premises network (192.168.0.0/16):

		```powershell
		azure network nsg create <<resource-group>> web-tier-nsg <<location>>

		azure network vnet subnet set --network-security-group-name web-tier-nsg <<resource-group>> <<vnet-name>> <<vnet-web-tier-subnet-name>>

		azure network nsg rule create --protocol * --source-address-prefix 192.168.0.0/16 --source-port-range * --destination-port-range 80 --access Allow --priority 200 --direction Inbound <<resource-group>> web-tier-nsg allow-http-traffic-from-on-prem

		azure network nsg rule create --protocol * --source-address-prefix * --source-port-range * --destination-port-range * --access Deny --priority 300 --direction Inbound <<resource-group>> web-tier-nsg deny-other-traffic
		```

	2. In the business tier subnet (10.0.4.0/24), an NSG named `business-nsg` contains rules that block all requests other than those for port 80 that have been received from the web tier subnet (10.0.3.0/24):

		```powershell
		azure network nsg create <<resource-group>> business-tier-nsg <<location>>

		azure network vnet subnet set --network-security-group-name business-tier-nsg <<resource-group>> <<vnet-name>> <<vnet-business-tier-subnet-name>>

		azure network nsg rule create --protocol * --source-address-prefix 10.0.3.0/24 --source-port-range * --destination-port-range 80 --access Allow --priority 200 --direction Inbound <<resource-group>> business-tier-nsg allow-http-traffic-from-web-tier

		azure network nsg rule create --protocol * --source-address-prefix * --source-port-range * --destination-port-range * --access Deny --priority 300 --direction Inbound <<resource-group>> business-tier-nsg deny-other-traffic
		```

	3. In the data tier subnet (10.0.5.0/24), an NSG named `business-nsg` contains rules that block all requests other than those for port 80 that have been received from the business tier subnet (10.0.4.0/24):

		```powershell
		azure network nsg create <<resource-group>> data-tier-nsg <<location>>

		azure network vnet subnet set --network-security-group-name data-tier-nsg <<resource-group>> <<vnet-name>> <<vnet-data-tier-subnet-name>>
		
		azure network nsg rule create --protocol * --source-address-prefix 10.0.4.0/24 --source-port-range * --destination-port-range 80 --access Allow --priority 200 --direction Inbound <<resource-group>> data-tier-nsg allow-http-traffic-from-business-tier

		azure network nsg rule create --protocol * --source-address-prefix * --source-port-range * --destination-port-range * --access Deny --priority 300 --direction Inbound <<resource-group>> data-tier-nsg deny-other-traffic
		```

- Do not permit outbound traffic from the application subnets to directly access external networks or the Internet. Ensure that all such traffic is force-tunnelled through the on-premises network (as described in the [Implementing this architecture][implementing] section) so that it can be audited.

- Use Azure Role-Based Access Control (RBAC) to distinguish the operations that can be performed by different types of DevOps responsible for monitoring, configuring, and maintaining the system. For details, see [Azure Role-Based Access Control][azure-rbac].

> [AZURE.NOTE] For more extensive information, examples, and scenarios about managing network security with Azure, see [Microsoft cloud services and network security][clouds-services-network-security].

For detailed information about protecting resources in the cloud, see [Getting started with Microsoft Azure security][getting-started-with-azure-security]. 

## Scalability

> [AZURE.NOTE] The articles [Implementing a Hybrid Network Architecture with Azure and On-premises VPN][guidance-vpn-gateway] and [Implementing a hybrid network architecture with Azure ExpressRoute][guidance-expressroute] describe issues surrounding the scalability of Azure gateways. ExpressRoute provides a much higher network bandwidth and lower latency than a VPN connection, but the cost is higher and the configuration effort greater.

- Create a pool (availability set) of NVA devices and use a load balancer to distribute requests received through the virtual network gateway across this pool. This strategy enables you to quickly start and stop NVAs to maintain performance, according to the load.

- Similarly, define availability sets for the VMs in the application tiers and direct requests for each tier through a load balancer.

## Monitoring

- Use the resources in the management subnet to connect to the VMs in the system and perform monitoring. The example in the [Architecture blueprint][architecture] section depicts a jump box which provides access to DevOps staff, and a separate monitoring server. Depending on the size of the network, the jump box and monitoring server could be combined into a single machine, or monitoring functions could be spread across several VMs.

- Carefully manage access by DevOps staff to the system through the management subnet. Apply NSG rules to to the management subnet to limit the sources of traffic that can gain access.

- If each tier in the system is protected by using NSG rules, it may also be necessary to open port 3389 (for RDP access), port 22 (for SSH access), or any other ports used by management and monitoring tools to enable requests from the data management subnet.

 - Use the [Azure Connectivity Toolkit (AzureCT)][azurect] to monitor connectivity between your on-premises datacenter and Azure.

## Troubleshooting

**TBD**

## Deploying the sample solution

The Azure PowerShell commands in this section show how to **... << TBD >**.

To use the script below, execute the following steps:

1. Copy the [sample script][script] and paste it into a new file.
2. Save the file as a .ps1 file.
3. Open a PowerShell command shell.
4. **... << TBD >>**

## Sample solution script

The deployment steps above use the following sample script.

```powershell
TBD
```

## Next steps

<!-- links -->

[resource-manager-overview]: ../resource-group-overview.md
[guidance-vpn-gateway]: ../guidance-hybrid-network-vpn.md
[script]: #sample-solution-script
[implementing-a-multi-tier-architecture-on-Azure]: ./iaas-multi-tier.md
[guidance-expressroute]: ./guidance-hybrid-network-expressroute.md
[connect-to-an-Azure-vnet]: https://technet.microsoft.com/library/dn786406.aspx
[azure-network-security-group]: ../virtual-network/virtual-networks-nsg.md
[getting-started-with-azure-security]: ./../azure-security-getting-started.md
[azure-forced-tunnelling]: https://azure.microsoft.com/en-gb/documentation/articles/vpn-gateway-forced-tunneling-rm/
[clouds-services-network-security]: https://azure.microsoft.com/documentation/articles/best-practices-network-security/
[azure-rbac]: https://azure.microsoft.com/documentation/articles/role-based-access-control-configure/
[architecture]: #architecture_blueprint
[security]: #security
[implementing]: #implementing_this_architecture
[azurect]: https://github.com/Azure/NetworkMonitoring/tree/master/AzureCT