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
   ms.date="04/28/2016"
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

![IaaS: multi-tier](./media/guidance-hybrid-network-forced-tunnelling/figure1.png)

- **On-premises network.** This is a network of computers and devices, connected through a private local-area network running within an organization.

- **Azure Virtual Network (VNet).** The VNet hosts the application and other components running in the cloud.

- **Gateway.** The gateway provides the connectivity between routers in the on-premises network and the VNet. You can implement the gateway using an [Azure VPN Gateway][guidance-vpn-gateway] or by using [Azure ExpressRoute][guidance-expressroute]. The gateway uses its own gateway subnet.

- **Network virtual appliance (NVA).** An NVA is a generic term for a virtual appliance that might perform tasks such as acting as a firewall, implementing access security, WAN optimization (including network compression), custom routing, or a variety of other operations. The diagram depicts the NVA as a collection of load-balanced VMs, accepting incoming requests on the inbound NVA subnet (acting as a security perimeter subnet) before validating them and forwarding the requests to the Web tier through the outbound NVA subnet.

- **Web tier, Business tier, and Data tier subnets.** These are subnets hosting the VMs and services that implement an example 3-tier application running in the cloud; see [Implementing a multi-tier architecture on Azure][implementing-a-multi-tier-architecture-on-Azure] for more details. The traffic in each subnet may be subject to rules defined by using [Azure Network Security Groups][azure-network-security-group](NSGs). For more information, see [Getting started with Microsoft Azure security][getting-started-with-azure-security]. You can deploy an internal load balancer in each tier to improve scalability.

    > [AZURE.NOTE] This article describes the cloud application as a single entity. See [Implementing a Multi-tier Architecture on Azure][implementing-a-multi-tier-architecture-on-Azure] for detailed information.

- **User-defined routes (UDR).** Each of the application subnets defines one or more custom (user-defined) routes for directing Internet requests made by VMs running in that subnet. Each UDR redirects requests back through the on-premises network for auditing. If the request is permitted, it can be forwarded to the Internet.

    > [AZURE.NOTE] Any response received as a result of the request will return directly to the originator in the Web tier, Business tier, or Data tier subnets and will not pass through on-premises network.

- **Management subnet.** This subnet contains VMs that implement management and monitoring capabilities for the components running in the VNet. The monitoring VM captures log and performance data from the virtual hardware in the cloud. The jump box enables authorized DevOps staff to log in, configure, and manage the network through an external IP address.

## Implementing this architecture

The following high-level steps outline a process for implementing this architecture. Detailed examples using Azure PowerShell commands are describe [later in this document][script]. Note that this process assumes that you have already created a VNet for hosting the cloud application, and that you have created the on-premises network.

1. **STEP 1**.

	```powershell
	TBD
	```

2. **STEP 2**.

	```powershell
	TBD
	```

## Testing your solution

Once the connections are established, follow these steps to test the environment:

1. Make sure you can connect from your on-premises network to your Azure VNet.

2. **STEP 2**

	```powershell
	TBD
	```

## Availability

## Security

## Scalability

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


[azure-forced-tunnelling]: https://azure.microsoft.com/en-gb/documentation/articles/vpn-gateway-forced-tunneling-rm/
