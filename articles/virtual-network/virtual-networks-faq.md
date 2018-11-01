---
title: Azure Virtual Network FAQ | Microsoft Docs
description: Answers to the most frequently asked questions about Microsoft Azure virtual networks.
services: virtual-network
documentationcenter: na
author: jimdial
manager: jeconnoc
editor: tysonn

ms.assetid: 54bee086-a8a5-4312-9866-19a1fba913d0
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 08/16/2018
ms.author: jdial

---
# Azure Virtual Network frequently asked questions (FAQ)

## Virtual Network basics

### What is an Azure Virtual Network (VNet)?
An Azure Virtual Network (VNet) is a representation of your own network in the cloud. It is a logical isolation of the Azure cloud dedicated to your subscription. You can use VNets to provision and manage virtual private networks (VPNs) in Azure and, optionally, link the VNets with other VNets in Azure, or with your on-premises IT infrastructure to create hybrid or cross-premises solutions. Each VNet you create has its own CIDR block, and can be linked to other VNets and on-premises networks as long as the CIDR blocks do not overlap. You also have control of DNS server settings for VNets, and segmentation of the VNet into subnets.

Use VNets to:

* Create a dedicated private cloud-only VNet
Sometimes you don't require a cross-premises configuration for your solution. When you create a VNet, your services and VMs within your VNet can communicate directly and securely with each other in the cloud. You can still configure endpoint connections for the VMs and services that require Internet communication, as part of your solution.
* Securely extend your data center
With VNets, you can build traditional site-to-site (S2S) VPNs to securely scale your datacenter capacity. S2S VPNs use IPSEC to provide a secure connection between your corporate VPN gateway and Azure.
* Enable hybrid cloud scenarios
VNets give you the flexibility to support a range of hybrid cloud scenarios. You can securely connect cloud-based applications to any type of on-premises system such as mainframes and Unix systems.

### How do I get started?
Visit the [Virtual network documentation](https://docs.microsoft.com/azure/virtual-network/) to get started. This content provides overview and deployment information for all of the VNet features.

### Can I use VNets without cross-premises connectivity?
Yes. You can use a VNet without connecting it to your premises. For example, you could run Microsoft Windows Server Active Directory domain controllers and SharePoint farms solely in an Azure VNet.

### Can I perform WAN optimization between VNets or a VNet and my on-premises data center?
Yes. You can deploy a [WAN optimization network virtual appliance](https://azure.microsoft.com/marketplace/?term=wan+optimization) from several vendors through the Azure Marketplace.

## Configuration

### What tools do I use to create a VNet?
You can use the following tools to create or configure a VNet:

* Azure portal
* PowerShell
* Azure CLI
* A network configuration file (netcfg - for classic VNets only). See the [Configure a VNet using a network configuration file](virtual-networks-using-network-configuration-file.md) article.

### What address ranges can I use in my VNets?
Any IP address range defined in [RFC 1918](http://tools.ietf.org/html/rfc1918). For example, 10.0.0.0/16.

### Can I have public IP addresses in my VNets?
Yes. For more information about public IP address ranges, see [Create a virtual network](manage-virtual-network.md#create-a-virtual-network). Public IP addresses are not directly accessible from the internet.

### Is there a limit to the number of subnets in my VNet?
Yes. See [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#networking-limits) for details. Subnet address spaces cannot overlap one another.

### Are there any restrictions on using IP addresses within these subnets?
Yes. Azure reserves some IP addresses within each subnet. The first and last IP addresses of each subnet are reserved for protocol conformance, along with the x.x.x.1-x.x.x.3 addresses of each subnet, which are used for Azure services.

### How small and how large can VNets and subnets be?
The smallest supported subnet is /29, and the largest is /8 (using CIDR subnet definitions).

### Can I bring my VLANs to Azure using VNets?
No. VNets are Layer-3 overlays. Azure does not support any Layer-2 semantics.

### Can I specify custom routing policies on my VNets and subnets?
Yes. You can create a route table and associate it to a subnet. For more information about routing in Azure, see [Routing overview](virtual-networks-udr-overview.md#custom-routes).

### Do VNets support multicast or broadcast?
No. Multicast and broadcast are not supported.

### What protocols can I use within VNets?
You can use TCP, UDP, and ICMP TCP/IP protocols within VNets. Unicast is supported within VNets, with the exception of Dynamic Host Configuration Protocol (DHCP) via Unicast (source port UDP/68 / destination port UDP/67). Multicast, broadcast, IP-in-IP encapsulated packets, and Generic Routing Encapsulation (GRE) packets are blocked within VNets. 

### Can I ping my default routers within a VNet?
No.

### Can I use tracert to diagnose connectivity?
No.

### Can I add subnets after the VNet is created?
Yes. Subnets can be added to VNets at any time as long as the subnet address range is not part of another subnet and there is available space left in the virtual network's address range.

### Can I modify the size of my subnet after I create it?
Yes. You can add, remove, expand, or shrink a subnet if there are no VMs or services deployed within it.

### Can I modify subnets after I created them?
Yes. You can add, remove, and modify the CIDR blocks used by a VNet.

### If I am running my services in a VNet, can I connect to the internet?
Yes. All services deployed within a VNet can connect outbound to the internet. To learn more about outbound internet connections in Azure, see [Outbound connections](../load-balancer/load-balancer-outbound-connections.md?toc=%2fazure%2fvirtual-network%2ftoc.json). If you want to connect inbound to a resource deployed through Resource Manager, the resource must have a public IP address assigned to it. To learn more about public IP addresses, see [Public IP addresses](virtual-network-public-ip-address.md). Every Azure Cloud Service deployed in Azure has a publicly addressable VIP assigned to it. You define input endpoints for PaaS roles and endpoints for virtual machines to enable these services to accept connections from the internet.

### Do VNets support IPv6?
No. You cannot use IPv6 with VNets at this time. You can however, assign IPv6 addresses to Azure load balancers to load balance virtual machines. For details, see [Overview of IPv6 for Azure Load Balancer](../load-balancer/load-balancer-ipv6-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

### Can a VNet span regions?
No. A VNet is limited to a single region. A virtual network does, however, span availability zones. To learn more about availability zones, see [Availability zones overview](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json). You can connect virtual networks in different regions with virtual network peering. For details, see [Virtual network peering overview](virtual-network-peering-overview.md)

### Can I connect a VNet to another VNet in Azure?
Yes. You can connect one VNet to another VNet using either:
- **Virtual network peering**: For details, see [VNet peering overview](virtual-network-peering-overview.md)
- **An Azure VPN Gateway**: For details, see [Configure a VNet-to-VNet connection](../vpn-gateway/vpn-gateway-howto-vnet-vnet-resource-manager-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json). 

## Name Resolution (DNS)

### What are my DNS options for VNets?
Use the decision table on the [Name Resolution for VMs and Role Instances](virtual-networks-name-resolution-for-vms-and-role-instances.md) page to guide you through all the DNS options available.

### Can I specify DNS servers for a VNet?
Yes. You can specify DNS server IP addresses in the VNet settings. The setting is applied as the default DNS server(s) for all VMs in the VNet.

### How many DNS servers can I specify?
Reference [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#networking-limits).

### Can I modify my DNS servers after I have created the network?
Yes. You can change the DNS server list for your VNet at any time. If you change your DNS server list, you will need to restart each of the VMs in your VNet in order for them to pick up the new DNS server.

### What is Azure-provided DNS and does it work with VNets?
Azure-provided DNS is a multi-tenant DNS service offered by Microsoft. Azure registers all of your VMs and cloud service role instances in this service. This service provides name resolution by hostname for VMs and role instances contained within the same cloud service, and by FQDN for VMs and role instances in the same VNet. To learn more about DNS, see [Name Resolution for VMs and Cloud Services role instances](virtual-networks-name-resolution-for-vms-and-role-instances.md).

There is a limitation to the first 100 cloud services in a VNet for cross-tenant name resolution using Azure-provided DNS. If you are using your own DNS server, this limitation does not apply.

### Can I override my DNS settings on a per-VM or cloud service basis?
Yes. You can set DNS servers per VM or cloud service to override the default network settings. However, it's recommended that you use network-wide DNS as much as possible.

### Can I bring my own DNS suffix?
No. You cannot specify a custom DNS suffix for your VNets.

## Connecting virtual machines

### Can I deploy VMs to a VNet?
Yes. All network interfaces (NIC) attached to a VM deployed through the Resource Manager deployment model must be connected to a VNet. VMs deployed through the classic deployment model can optionally be connected to a VNet.

### What are the different types of IP addresses I can assign to VMs?
* **Private:** Assigned to each NIC within each VM. The address is assigned using either the static or dynamic method. Private IP addresses are assigned from the range that you specified in the subnet settings of your VNet. Resources deployed through the classic deployment model are assigned private IP addresses, even if they're not connected to a VNet. The behavior of the allocation method is different depending on whether a resource was deployed with the Resource Manager or classic deployment model: 

  - **Resource Manager**: A private IP address assigned with the dynamic or static method remains assigned to a virtual machine (Resource Manager) until the resource is deleted. The difference is that you select the address to assign when using static, and Azure chooses when using dynamic. 
  - **Classic**: A private IP address assigned with the dynamic method may change when a virtual machine (classic) VM is restarted after having been in the stopped (deallocated) state. If you need to ensure that the private IP address for a resource deployed through the classic deployment model never changes, assign a private IP address with the static method.

* **Public:** Optionally assigned to NICs attached to VMs deployed through the Azure Resource Manager deployment model. The address can be assigned with the static or dynamic allocation method. All VMs and Cloud Services role instances deployed through the classic deployment model exist within a cloud service, which is assigned a *dynamic*, public virtual IP (VIP) address. A public *static* IP address, called a [Reserved IP address](virtual-networks-reserved-public-ip.md), can optionally be assigned as a VIP. You can assign public IP addresses to individual VMs or Cloud Services role instances deployed through the classic deployment model. These addresses are called [Instance level public IP (ILPIP](virtual-networks-instance-level-public-ip.md) addresses and can be assigned dynamically.

### Can I reserve a private IP address for a VM that I will create at a later time?
No. You cannot reserve a private IP address. If a private IP address is available, it is assigned to a VM or role instance by the DHCP server. The VM may or may not be the one that you want the private IP address assigned to. You can, however, change the private IP address of an already created VM, to any available private IP address.

### Do private IP addresses change for VMs in a VNet?
It depends. If the VM was deployed through Resource Manager, no, regardless of whether the IP address was assigned with the static or dynamic allocation method. If the VM was deployed through the classic deployment model, dynamic IP addresses can change when a VM is started after having been in the stopped (deallocated) state. The address is released from a VM deployed through either deployment model when the VM is deleted.

### Can I manually assign IP addresses to NICs within the VM operating system?
Yes, but it's not recommended unless necessary, such as when assigning multiple IP addresses to a virtual machine. For details, see [Adding multiple IP addresses to a virtual machine](virtual-network-multiple-ip-addresses-portal.md#os-config). If the IP address assigned to an Azure NIC attached to a VM changes, and the IP address within the VM operating system is different, you lose connectivity to the VM.

### If I stop a Cloud Service deployment slot or shutdown a VM from within the operating system, what happens to my IP addresses?
Nothing. The IP addresses (public VIP, public, and private) remain assigned to the cloud service deployment slot or VM.

### Can I move VMs from one subnet to another subnet in a VNet without redeploying?
Yes. You can find more information in the [How to move a VM or role instance to a different subnet](virtual-networks-move-vm-role-to-subnet.md) article.

### Can I configure a static MAC address for my VM?
No. A MAC address cannot be statically configured.

### Will the MAC address remain the same for my VM once it's created?
Yes, the MAC address remains the same for a VM deployed through both the Resource Manager and classic deployment models until it's deleted. Previously, the MAC address was released if the VM was stopped (deallocated), but now the MAC address is retained even when the VM is in the deallocated state.

### Can I connect to the internet from a VM in a VNet?
Yes. All VMs and Cloud Services role instances deployed within a VNet can connect to the Internet.

## Azure services that connect to VNets

### Can I use Azure App Service Web Apps with a VNet?
Yes. You can deploy Web Apps inside a VNet using an ASE (App Service Environment). If you have a point-to-site connection configured for your VNet, all Web Apps can securely connect and access resources in the VNet. For more information, see the following articles:

* [Creating Web Apps in an App Service Environment](../app-service/environment/app-service-web-how-to-create-a-web-app-in-an-ase.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
* [Integrate your app with an Azure Virtual Network](../app-service/web-sites-integrate-with-vnet.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
* [Using VNet Integration and Hybrid Connections with Web Apps](../app-service/web-sites-integrate-with-vnet.md?toc=%2fazure%2fvirtual-network%2ftoc.json#hybrid-connections-and-app-service-environments)

### Can I deploy Cloud Services with web and worker roles (PaaS) in a VNet?
Yes. You can (optionally) deploy Cloud Services role instances within VNets. To do so, you specify the VNet name and the role/subnet mappings in the network configuration section of your service configuration. You do not need to update any of your binaries.

### Can I connect a Virtual Machine Scale Set (VMSS) to a VNet?
Yes. You must connect a VMSS to a VNet.

### Is there a complete list of Azure services that can I deploy resources from into a VNet?
Yes, For details, see [Virtual network integration for Azure services](virtual-network-for-azure-services.md).

### Which Azure PaaS resources can I restrict access to from a VNet?

Resources deployed through some Azure PaaS services (such as Azure Storage and Azure SQL Database), can restrict network access to only resources in a VNet through the use of virtual network service endpoints. For details, see [Virtual network service endpoints overview](virtual-network-service-endpoints-overview.md).

### Can I move my services in and out of VNets?
No. You cannot move services in and out of VNets. To move a resource to another VNet, you have to delete and redeploy the resource.

## Security

### What is the security model for VNets?
VNets are isolated from one another, and other services hosted in the Azure infrastructure. A VNet is a trust boundary.

### Can I restrict inbound or outbound traffic flow to VNet-connected resources?
Yes. You can apply [Network Security Groups](security-overview.md) to individual subnets within a VNet, NICs attached to a VNet, or both.

### Can I implement a firewall between VNet-connected resources?
Yes. You can deploy a [firewall network virtual appliance](https://azure.microsoft.com/marketplace/?term=firewall) from several vendors through the Azure Marketplace.

### Is there information available about securing VNets?
Yes. For details, see [Azure Network Security Overview](../security/security-network-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

## APIs, schemas, and tools

### Can I manage VNets from code?
Yes. You can use REST APIs for VNets in the [Azure Resource Manager](/rest/api/virtual-network) and [classic (Service Management)](http://go.microsoft.com/fwlink/?LinkId=296833) deployment models.

### Is there tooling support for VNets?
Yes. Learn more about using:
- The Azure portal to deploy VNets through the [Azure Resource Manager](manage-virtual-network.md#create-a-virtual-network) and [classic](virtual-networks-create-vnet-classic-pportal.md) deployment models.
- PowerShell to manage VNets deployed through the [Resource Manager](/powershell/module/azurerm.network) and [classic](/powershell/module/servicemanagement/azure/?view=azuresmps-3.7.0) deployment models.
- The Azure command-line interface (CLI) to deploy and manage VNets deployed through the [Resource Manager](/cli/azure/network/vnet) and [classic](../virtual-machines/azure-cli-arm-commands.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-network-commands-to-manage-network-resources) deployment models.  

## VNet peering

### What is VNet peering?
VNet peering (or virtual network peering) enables you to connect virtual networks. A VNet peering connection between virtual networks enables you to route traffic between them privately through IPv4 addresses. Virtual machines in the peered VNets can communicate with each other as if they are within the same network. These virtual networks can be in the same region or in different regions (also known as Global VNet Peering). VNet peering connections can also be created across Azure subscriptions.

### Can I create a peering connection to a VNet in a different region?
Yes. Global VNet peering enables you to peer VNets in different regions. Global VNet peering is available in all Azure public regions. You cannot globally peer from Azure public regions to National clouds. Global peering is not currently available in national clouds.

### Can I enable VNet Peering if my virtual networks belong to subscriptions within different Azure Active Directory tenants?
Yes. It is possible to establish VNet Peering (whether local or global) if your subscriptions belong to different Azure Active Directory tenants. You can do this via PowerShell or CLI. Portal is not yet supported.

### My VNet peering connection is in *Initiated* state, why can't I connect?
If your peering connection is in an Initiated state, this means you have created only one link. A bidirectional link must be created in order to establish a successfuly connection. For example, to peer VNet A to VNet B, a link must be created from VNetA to VNetB and from VNetB to VNetA. Creating both links will change the state to *Connected.*

### My VNet peering connection is in *Disconnected* state, why can't I create a peering connection?
If your VNet peering connection is in a Disconnected state, it means one of the links created was deleted. In order to re-establish a peering connection, you will need to delete the link and recreate.

### Can I peer my VNet with a VNet in a different subscription?
Yes. You can peer VNets across subscriptions and across regions.

### Can I peer two VNets with matching or overlapping address ranges?
No. Address spaces must not overalap to enable VNet Peering.

### How much do VNet peering links cost?
There is no charge for creating a VNet peering connection. Data transfer across peering connections is charged. [See here](https://azure.microsoft.com/pricing/details/virtual-network/).

### Is VNet peering traffic encrypted?
No. Traffic between resources in peered VNets is private and isolated. It remains completely on the Microsoft Backbone.

### Why is my peering connection in a disconnected state?
VNet peering connections go into *Disconnected* state when one VNet peering link is deleted. You must delete both links in order to reestablish a successful peering connection.

### If I peer VNetA to VNetB and I peer VNetB to VNetC, does that mean VNetA and VNetC are peered?
No. Transitive peering is not supported. You must peer VNetA and VNetC for this to take place.

### Are there any bandwidth limitations for peering connections?
No. VNet peering, whether local or global, does not impose any bandwidth restrictions. Bandwidth is only limits by the VM or compute resource.

## Virtual network TAP

### Which Azure regions are available for virtual network TAP?
During developer preview, the capability is available in the West Central US region. The monitored network interfaces , the virtual network TAP resource, and the collector or analytics solution must be deployed in the same region.

### Does Virtual Network TAP support any filtering capabilities on the mirrored packets?
Filtering capabilities are not supported with the virtual network TAP preview. When a TAP configuration is added to a network interface a deep copy of all the ingress and egress traffic on the network interface is streamed to the TAP destination.

### Can multiple TAP configurations be added to a monitored network interface?
A monitored network interface can have only one TAP configuration. Check with the individual [partner solutions](virtual-network-tap-overview.md#virtual-network-tap-partner-solutions) for the capability to stream multiple copies of the TAP traffic to the analytics tools of your choice.

### Can the same virtual network TAP resource aggregate traffic from monitored network interfaces in more than one virtual network?
Yes. The same virtual network TAP resource can be used to aggregate mirrored traffic from monitored network interfaces in peered virtual networks in the same subscription or a different subscription. The virtual network TAP resource and the destination load balancer or destination network interface must be in the same subscription. All subscriptions must be under the same Azure Active Directory tenant.

### Are there any performance considerations on production traffic if I enable a virtual network TAP configuration on a network interface?

Virtual network TAP is in developer preview. During preview, there is no service level agreement. The capability should not be used for production workloads. When a virtual machine network interface is enabled with a TAP configuration, the same resources on the azure host allocated to the virtual machine to send the production traffic is used to perform the mirroring function and send the mirrored packets. Select the correct [Linux](../virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Windows](../virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine size to ensure that sufficient resources are available for the virtual machine to send the production traffic and the mirrored traffic.

### Is accelerated networking for [Linux](create-vm-accelerated-networking-cli.md) or [Windows](create-vm-accelerated-networking-powershell.md) supported with virtual network TAP?

You will be able to add a TAP configuration on a network interface attached to a virtual machine that is enabled with accelerated networking. But the performance and latency on the virtual machine will be affected by adding TAP configuration since the offload for mirroring traffic is currently not supported by Azure accelerated networking.
