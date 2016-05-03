<properties
   pageTitle="Implementing a hybrid network architecture in Azure that uses forced tunnelling to route Internet requests | Blueprint | Microsoft Azure"
   description="How to implement a hybrid network architecture in Azure that uses forced tunnelling to route Internet requests."
   services="guidance"
   documentationCenter="na"
   authors="JohnPWSharp"
   manager="masashin"
   editor=""
   tags=""/>

<tags
   ms.service="guidance"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/03/2016"
   ms.author="johns@contentmaster.com"/>

# Azure blueprints: Implementing a hybrid network architecture in Azure that uses forced tunnelling to route Internet requests

This article describes best practices for implementing a hybrid network that spans the on-premises/Azure virtual network (VNet) boundary, and that uses forced tunnelling to route Internet requests made by components running in the VNet through the on-premises network. You can achieve connectivity between the on-premises network and the VNet by using an IPSec VPN tunnel or an ExpressRoute peering.

Tunnelling only applies to outgoing traffic. For example, a web application running within the VNet may still be able to accept incoming requests directly from the Internet.

> [AZURE.NOTE] Azure has two different deployment models: [Resource Manager][resource-manager-overview] and classic. This blueprint uses Resource Manager, which Microsoft recommends for new deployments.

Typical use cases for this architecture include:

- Hybrid applications where workloads run partly on-premises and partly in a VNet in the cloud.

- Auditing outgoing traffic from the VNet. On-premises components can inspect and log all Internet requests. This is often a regulatory requirement of many commercial systems and can help to prevent public disclosure of private information.

## Architecture blueprint

The following diagram highlights the important components in this architecture:

![IaaS: forced-tunnelling](./media/guidance-hybrid-network-forced-tunnelling/figure1.png)

- **On-premises network.** This is a network of computers and devices, connected through a private local-area network running within an organization.

- **NSA.** This is an on-premises network security appliance that inspects requests intended for the Internet. All outbound Internet requests are directed through this device.

- **Azure Virtual Network (VNet).** The VNet hosts the application and other components running in the cloud.

- **Gateway.** The gateway provides the connectivity between routers in the on-premises network and the VNet. You can implement the gateway using an [Azure VPN Gateway][guidance-vpn-gateway] or by using [Azure ExpressRoute][guidance-expressroute]. The gateway uses its own gateway subnet.

- **Network virtual appliance (NVA).** An NVA is a generic term for a virtual appliance that might perform tasks such as acting as a firewall, implementing access security, WAN optimization (including network compression), custom routing, or a variety of other operations. The diagram depicts the NVA as a collection of load-balanced VMs, accepting incoming requests on the inbound NVA subnet (acting as a security perimeter subnet) before validating them and forwarding the requests to the Web tier through the outbound NVA subnet.

- **Web tier, Business tier, and Data tier subnets.** These are subnets hosting the VMs and services that implement an example 3-tier application running in the cloud; see [Implementing a multi-tier architecture on Azure][implementing-a-multi-tier-architecture-on-Azure] for more details. The traffic in each subnet may be subject to rules defined by using [Azure Network Security Groups][azure-network-security-group](NSGs). For more information, see [Getting started with Microsoft Azure security][getting-started-with-azure-security]. You can deploy an internal load balancer in each tier to improve scalability.

    > [AZURE.NOTE] This article describes the cloud application as a single entity. See [Implementing a Multi-tier Architecture on Azure][implementing-a-multi-tier-architecture-on-Azure] for detailed information.

- **User-defined routes (UDR).** Each of the application subnets defines one or more custom (user-defined) routes for directing Internet requests made by VMs running in that subnet. Each UDR redirects requests back through the on-premises network for auditing. If the request is permitted, it can be forwarded to the Internet.

    > [AZURE.NOTE] Any response received as a result of the request will return directly to the originator in the Web tier, Business tier, or Data tier subnets and will not pass through on-premises network.

- **Management subnet.** This subnet contains VMs that implement management and monitoring capabilities for the components running in the VNet. The monitoring VM captures log and performance data from the virtual hardware in the cloud. The jump box enables authorized DevOps staff to log in, configure, and manage the network through an external IP address.

## Implementing this architecture

The following high-level steps outline a process for configuring forced tunnelling for an application tier hosted in an Azure subnet. Detailed examples using Azure PowerShell commands are describe [later in this document][script]. Note that this process assumes the following:

- You have already created an Azure VNet for hosting the cloud application,

- You have created the on-premises network,

- You have connected the on-premises network to the Azure VNet through an Azure virtual network gateway, either by using a [VPN connection][guidance-vpn-connection] or [ExpressRoute][guidance-expressroute].

1. Create a local network gateway for connecting to the on-premises network:

2. Create an Azure virtual network gateway. Set the default site to the local network gateway for the on-premises network:

	> [AZURE.NOTE] If the default site for the virtual network gateway is not specified correctly, then forced tunnelling may not work as requests will not be directed back to the on-premises network.

3. Connect the local network gateway to the virtual network gateway. This can be a [site-to-site (IPsec) connection, or an ExpressRoute connection. Configure the on-premises router to direct application requests through the gateway. The procedure for doing this will vary depending on the appliance you are using. For more information, see [Implementing a Hybrid Network Architecture with Azure and On-premises VPN][guidance-vpn-connection] and [Implementing a hybrid network architecture with Azure ExpressRoute][guidance-expressroute].

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

## Testing your solution

Once the connections are established, follow these steps to test the environment:

1. Make sure you can connect from your on-premises network to your Azure VNet.

2. **STEP 2**

	```powershell
	TBD
	```

## Availability

## Security

- The NVA provides protection for traffic arriving from the on-premises network. Route all traffic received through the Azure gateway through the NVA. If the NVA is implemented as an Azure VM, enable IP forwarding to enable traffic intended for the application subnets (web tier, business tier, and data access tier) to be received by the VM through the the inbound NVA subnet. You can use the following command to enable IP forwarding for a NIC:

	```powershell
	azure network nic set -g <<resource-group>> -n <<nva-inbound-nic-name>> -f true
	```

- Configure the NVA to inspect all requests intended for the application subnets, and only permit access to traffic if it is appropriate to do so.

- Create network security groups (NSGs) for each subnet with rules to permit or deny access to network traffic, according to the security requirements of the application. NSGs can also provide a second level of protection against inbound traffic bypassing the NVA if the NVA is misconfigured or disabled.

- Do not permit outbound traffic from the application subnets to directly access external networks or the Internet. Ensure that all such traffic is force-tunnelled through the on-premises network so that it can be audited.

- Carefully manage access to the system through the management subnet. Apply NSG rules to limit the traffic that can gain access through this subnet. Use Azure Role-Based Access Control (RBAC) to distinguish the operations that can be performed by different types of DevOps responsible for monitoring, configuring, and maintaining the system. For details, see [Azure Role-Based Access Control][azure-rbac].

> [AZURE.NOTE] For more extensive information, examples, and scenarios about managing network security with Azure, see [Microsoft cloud services and network security][clouds-services-network-security].

## Scalability

- Create a pool (availability set) of NVA devices and use a load balancer to distribute requests received through the virtual network gateway across this pool. This strategy enables you to quickly start and stop NVAs to maintain performance, according to the load.

- Similarly, define availability sets for the VMs in the application tiers and direct requests for each tier through a load balancer.

## Monitoring

## Troubleshooting

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

<!-- links -->

[resource-manager-overview]: ../resource-group-overview.md
[guidance-vpn-gateway]: ../guidance-hybrid-network-vpn.md
[script]: #sample-solution-script
[implementing-a-multi-tier-architecture-on-Azure]: ./iaas-multi-tier.md
[guidance-expressroute]: ./guidance-hybrid-network-expressroute.md
[connect-to-an-Azure-vnet]: https://technet.microsoft.com/library/dn786406.aspx
[azure-network-security-group]: ../virtual-network/virtual-networks-nsg.md
[getting-started-with-azure-security]: ./../azure-security-getting-started.md
[guidance-vpn-connection]: ./guidance-hybrid-network-vpn.md
[azure-forced-tunnelling]: https://azure.microsoft.com/en-gb/documentation/articles/vpn-gateway-forced-tunneling-rm/
[clouds-services-network-security]: https://azure.microsoft.com/documentation/articles/best-practices-network-security/
[azure-rbac]: https://azure.microsoft.com/documentation/articles/role-based-access-control-configure/