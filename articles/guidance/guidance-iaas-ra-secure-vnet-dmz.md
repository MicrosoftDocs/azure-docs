<properties
   pageTitle="Azure Architecture Reference - IaaS: Implementing a secure hybrid network architecture in Azure | Microsoft Azure"
   description="How to implement a secure hybrid network architecture in Azure."
   services="guidance,vpn-gateway,expressroute,load-balancer,virtual-network"
   documentationCenter="na"
   authors="telmosampaio"
   manager="masashin"
   editor=""
   tags="azure-resource-manager"/>

<tags
   ms.service="guidance"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/23/2016"
   ms.author="telmos"/>

# Implementing a secure hybrid network architecture in Azure

[AZURE.INCLUDE [pnp-RA-branding](../../includes/guidance-pnp-header-include.md)]

**THIS SECTION TO BE UPDATED**

This article describes best practices for implementing a secure hybrid network that extends your on-premises network to Azure. In this reference architecture, you will learn how to use user defined routes (UDRs) to route incoming traffic on a virtual network through a set of highly available network virtual appliances. These appliances can run different types of security software, such as firewalls, packet inspection, among others.

This architecture requires a connection to your on-premises datacenter implemented using either a [VPN gateway][ra-vpn], or an [ExpressRoute][ra-expressroute] connection.

> [AZURE.NOTE] Azure has two different deployment models: [Resource Manager][resource-manager-overview] and classic. This reference architecture uses Resource Manager, which Microsoft recommends for new deployments.

Typical use cases for this architecture include:

- Hybrid applications where workloads run partly on-premises and partly in Azure.

- Infrastructure that requires a more granular control over traffic entering an Azure VNet from an on-premises datacenter.

## Architecture diagram

**THIS SECTION TO BE UPDATED**

The following diagram highlights the important components in this architecture (*click to zoom in*):

[![0]][0]

- **On-premises network.** This is a network of computers and devices, connected through a private local-area network running within an organization.

- **Network security appliance (NSA).** This is an on-premises appliance that inspects requests intended for the Internet. All outbound Internet requests are directed through this device.

- **Azure virtual network (VNet).** The VNet hosts the application and other resources running in the cloud.

- **Gateway.** The gateway provides the connectivity between routers in the on-premises network and the VNet.

- **Network virtual appliance (NVA).** An NVA is a generic term for a virtual appliance that might perform tasks such as acting as a firewall, WAN optimization (including network compression), custom routing, or a variety of other operations. The NVA receives requests from the inbound NVA network. The NVA can validate these requests and, if they're acceptable, it can forward them to the web tier through the outbound NVA subnet.

- **Web tier, business tier, and data tier subnets.** These are subnets hosting the VMs and services that implement an example 3-tier application running in the cloud. See [Implementing a multi-tier architecture on Azure][implementing-a-multi-tier-architecture-on-Azure] for more details about this structure.

- **User-defined routes (UDR).** You can use UDRs to define how traffic flows within Azure. The gateway subnet contains routes to ensure that all application traffic from the on-premises network is routed through the NVAs. Traffic intended for the management subnet is allowed to bypass the NVAs.

	> [AZURE.NOTE] Depending on the requirements of your VPN connection, you can configure Border Gateway Protocol (BGP) routes as an alternative to to using UDRs to implement the forwarding rules that direct traffic back through the on-premises network. However, such configurations do not support IPSec and are not encrypted, so you should not use this mechanism across the public Internet; BGP is more commonly used with [Azure ExpressRoute gateways][ra-expressroute].
	>
	> This article focusses on using UDRs.

- **Management subnet.** This subnet contains VMs that implement management and monitoring capabilities for the components running in the VNet. The optional monitoring VM captures log and performance data from the virtual hardware in the cloud. The jump box enables authorized DevOps staff to log in, configure, and manage the network. Note that the jump box and monitoring functions can be combined into a single VM, depending on the monitoring workload.

## Recommendations

**TBD**

## Solution components

The solution provided for this architecture utilizes the following ARM templates:

**TBD**

## Deploying the sample solution

**TBD**

The solution assumes the following prerequisites:

- You have an existing on-premises infrastructure, including a VPN server that can support IPSec connections.

- You have installed the latest version of the Azure CLI. [Follow these instructions for details][cli-install].

- If you're deploying the solution from Windows, you must install a tool that provides a bash shell, such as [git for Windows][git-for-windows].

To run the script that deploys the solution:

**TBD**

### Customizing the solution

**TBD**

## Availability considerations

**TBD**

## Security considerations

**TBD**

## Scalability considerations

**TBD**

## Monitoring considerations

<!-- links -->

[resource-manager-overview]: ../resource-group-overview.md
[guidance-vpn-gateway]: ./guidance-hybrid-network-vpn.md
[script]: #sample-solution-script
[implementing-a-multi-tier-architecture-on-Azure]: ./guidance-compute-3-tier-vm.md
[architecture]: #architecture_blueprint
[security]: #security
[recommendations]: #recommendations
[vpn-failover]: ./guidance-hybrid-network-expressroute-vpn-failover.md
[cli-install]: https://azure.microsoft.com/documentation/articles/xplat-cli-install
[git-for-windows]: https://git-for-windows.github.io
[ra-vpn]: ./guidance-hybrid-network-vpn.md
[ra-expressroute]: ./guidance-hybrid-network-expressroute.md
[0]: ./media/guidance-iaas-ra-secure-vnet-dmz/figure1.png "Secure hybrid network architecture"

<!-- Not currently referenced, but probably will be once content is added: -->
[getting-started-with-azure-security]: ./../azure-security-getting-started.md
[cloud-services-network-security]: https://azure.microsoft.com/documentation/articles/best-practices-network-security/