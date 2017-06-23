---
title: Azure Virtual Network FAQ | Microsoft Docs
description: Answers to the most frequently asked questions about Microsoft Azure virtual networks.
services: virtual-network
documentationcenter: na
author: jimdial
manager: timlt
editor: tysonn

ms.assetid: 54bee086-a8a5-4312-9866-19a1fba913d0
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 01/18/2017
ms.author: jdial

---
# Azure Virtual Network frequently asked questions (FAQ)

## Virtual Network basics

### What is an Azure Virtual Network (VNet)?
An Azure Virtual Network (VNet) is a representation of your own network in the cloud. It is a logical isolation of the Azure cloud dedicated to your subscription. You can use VNets to provision and manage virtual private networks (VPNs) in Azure and, optionally, link the VNets with other VNets in Azure, or with your on-premises IT infrastructure to create hybrid or cross-premises solutions. Each VNet you create has its own CIDR block, and can be linked to other VNets and on-premises networks as long as the CIDR blocks do not overlap. You also have control of DNS server settings for VNets, and segmentation of the VNet into subnets.

Use VNets to:

* Create a dedicated private cloud-only VNet
Sometimes you don't require a cross-premises configuration for your solution. When you create a VNet, your services and VMs within your VNet can communicate directly and securely with each other in the cloud. This keeps traffic securely within the VNet, but still allows you to configure endpoint connections for the VMs and services that require Internet communication as part of your solution.
* Securely extend your data center
With VNets, you can build traditional site-to-site (S2S) VPNs to securely scale your datacenter capacity. S2S VPNs use IPSEC to provide a secure connection between your corporate VPN gateway and Azure.
* Enable hybrid cloud scenarios
VNets give you the flexibility to support a range of hybrid cloud scenarios. You can securely connect cloud-based applications to any type of on-premises system such as mainframes and Unix systems.

### How do I know if I need a VNet?
The [Virtual network overview](virtual-networks-overview.md) article provides a decision table that will help you decide the best network design option for you.

### How do I get started?
Visit the [Virtual network documentation](https://docs.microsoft.com/azure/virtual-network/) to get started. This content provides overview and deployment information for all the VNet features.

### Can I use VNets without cross-premises connectivity?
Yes. You can use a VNet without using hybrid connectivity. This is particularly useful if you want to run Microsoft Windows Server Active Directory domain controllers and SharePoint farms in Azure.

### Can I perform WAN optimization between VNets or a VNet and my on-premises data center?

Yes. You can deploy a [WAN optimization network virtual appliance](https://azure.microsoft.com/marketplace/?term=wan+optimization) from several vendors through the Azure Marketplace.

## Configuration

### What tools do I use to create a VNet?
You can use the following tools to create or configure a VNet:

* Azure Portal (for classic and Resource Manager VNets).
* A network configuration file (netcfg - for classic VNets only). See the [Configure a VNet using a network configuration file](virtual-networks-using-network-configuration-file.md) article.
* PowerShell (for classic and Resource Manager VNets).
* Azure CLI (for classic and Resource Manager VNets).

### What address ranges can I use in my VNets?
You can use public IP address ranges and any IP address range defined in [RFC 1918](http://tools.ietf.org/html/rfc1918).

### Can I have public IP addresses in my VNets?
Yes. For more information about public IP address ranges, see the [Public IP address space in a virtual network](virtual-networks-public-ip-within-vnet.md) article. Your public IP addresses will not be directly accessible from the Internet.

### Is there a limit to the number of subnets in my VNet?
Yes. Read the [Azure limits](../azure-subscription-service-limits.md#networking-limits) article for details. Subnet address spaces cannot overlap one another.

### Are there any restrictions on using IP addresses within these subnets?
Yes. Azure reserves some IP addresses within each subnet. The first and last IP addresses of the subnets are reserved for protocol conformance, along with 3 more addresses used for Azure services.

### How small and how large can VNets and subnets be?
The smallest subnet we support is a /29 and the largest is a /8 (using CIDR subnet definitions).

### Can I bring my VLANs to Azure using VNets?
No. VNets are Layer-3 overlays. Azure does not support any Layer-2 semantics.

### Can I specify custom routing policies on my VNets and subnets?
Yes. You can use User Defined Routing (UDR). For more information about UDR, visit [User Defined Routes and IP Forwarding](virtual-networks-udr-overview.md).

### Do VNets support multicast or broadcast?
No. We do not support multicast or broadcast.

### What protocols can I use within VNets?
You can use TCP, UDP, and ICMP TCP/IP protocols within VNets. Multicast, broadcast, IP-in-IP encapsulated packets, and Generic Routing Encapsulation (GRE) packets are blocked within VNets. 

### Can I ping my default routers within a VNet?
No.

### Can I use tracert to diagnose connectivity?
No.

### Can I add subnets after the VNet is created?
Yes. Subnets can be added to VNets at any time as long as the subnet address is not part of another subnet in the VNet.

### Can I modify the size of my subnet after I create it?
Yes. You can add, remove, expand, or shrink a subnet if there are no VMs or services deployed within it.

### Can I modify subnets after I created them?
Yes. You can add, remove, and modify the CIDR blocks used by a VNet.

### Can I connect to the internet if I am running my services in a VNet?
Yes. All services deployed within a VNet can connect to the internet. Every cloud service deployed in Azure has a publicly addressable VIP assigned to it. You will have to define input endpoints for PaaS roles and endpoints for virtual machines to enable these services to accept connections from the internet.

### Do VNets support IPv6?
No. You cannot use IPv6 with VNets at this time.

### Can a VNet span regions?
No. A VNet is limited to a single region.

### Can I connect a VNet to another VNet in Azure?
Yes. You can connect one VNet to another VNet using:
- An Azure VPN Gateway. Read the [Configure a VNet-to-VNet connection](../vpn-gateway/vpn-gateway-howto-vnet-vnet-resource-manager-portal.md) article for details. 
- VNet peering. Read the [VNet peering overview](virtual-network-peering-overview.md) article for details.

## Name Resolution (DNS)

### What are my DNS options for VNets?
Use the decision table on the [Name Resolution for VMs and Role Instances](virtual-networks-name-resolution-for-vms-and-role-instances.md) page to guide you through all the DNS options available.

### Can I specify DNS servers for a VNet?
Yes. You can specify DNS server IP addresses in the VNet settings. This will be applied as the default DNS server(s) for all VMs in the VNet.

### How many DNS servers can I specify?
Reference the [Azure limits](../azure-subscription-service-limits.md#networking-limits) article for details.

### Can I modify my DNS servers after I have created the network?
Yes. You can change the DNS server list for your VNet at any time. If you change your DNS server list, you will need to restart each of the VMs in your VNet in order for them to pick up the new DNS server.

### What is Azure-provided DNS and does it work with VNets?
Azure-provided DNS is a multi-tenant DNS service offered by Microsoft. Azure registers all of your VMs and cloud service role instances in this service. This service provides name resolution by hostname for VMs and role instances contained within the same cloud service, and by FQDN for VMs and role instances in the same VNet. Read the [Name Resolution for VMs and Role Instances](virtual-networks-name-resolution-for-vms-and-role-instances.md) article to learn more about DNS.

> [!NOTE]
> There is a limitation at this time to the first 100 cloud services in a VNet for cross-tenant name resolution using Azure-provided DNS. If you are using your own DNS server, this limitation does not apply.
> 
> 

### Can I override my DNS settings on a per-VM / service basis?
Yes. You can set DNS servers on a per-cloud service basis to override the default network settings. However, we recommend that you use network-wide DNS as much as possible.

### Can I bring my own DNS suffix?
No. You cannot specify a custom DNS suffix for your VNets.

## Connecting virtual machines

### Can I deploy VMs to a VNet?
Yes. All network interfaces (NIC) attached to a VM deployed through the Resource Manager deployment model must be connected to a VNet. VMs deployed through the classic deployment model can optionally be connected to a VNet.

### What are the different types of IP addresses I can assign to VMs?
* **Private:** Assigned to each NIC within each VM. The address is assigned using either the static or dynamic method. Private IP addresses are assigned from the range that you specified in the subnet settings of your VNet. Resources deployed through the classic deployment model are assigned private IP addresses, even if they're not connected to a VNet. A private IP address assigned with the dynamic method remains assigned to a resource until the resource is deleted (VMs or Cloud Service deployment slots). A private IP address assigned with the dynamic method may change when a VM is restarted after having been in the stopped (deallocated) state. A private IP address assigned with the static method remains assigned to a resource until the resource is deleted. If you need to ensure that the private IP address for a resource never changes until the resource is deleted, assign a private IP address with the static method.
* **Public:** Optionally assigned to NICs attached to VMs deployed through the Azure Resource Manager deployment model. The address can be assigned with the static or dynamic allocation method. All VMs and Cloud Services role instances deployed through the classic deployment model exist within a cloud service, which is assigned a *dynamic*, public virtual IP (VIP) address. A public *static* IP address, called a [Reserved IP address](virtual-networks-reserved-public-ip.md), can optionally be assigned as a VIP. You can assign public IP addresses to individual VMs or Cloud Services role instances deployed through the classic deployment model. These addresses are called [Instance level public IP (ILPIP](virtual-networks-instance-level-public-ip.md) addresses and can be assigned dynamically.

### Can I reserve a private IP address for a VM that I will create at a later time?
No. You cannot reserve a private IP address. If a private IP address is available it will be assigned to a VM or role instance by the DHCP server. That VM may or may not be the one that you want the private IP address to be assigned to. You can, however, change the private IP address of an already created VM to any available private IP address.

### Do private IP addresses change for VMs in a VNet?
It depends. Dynamic private IP addresses remain with a VM until its stopped (deallocated) or deleted. Static private IP addresses aren't released from a VM until it's deleted.

### Can I manually assign IP addresses to NICs within the VM operating system?
Yes, but it's not recommended. Manually changing the IP address for a NIC within a VM's operating system could potentially lead to losing connectivity to the VM if the IP address assigned to a NIC within the Azure VM were to change.

### What happens to my IP addresses if I stop a Cloud Service deployment slot or shutdown a VM from within the operating system?
Nothing. The IP addresses (public VIP, public, and private) remain assigned to the cloud service deployment slot or VM. Dynamic addresses are only released if a VM is stopped (deallocated) or deleted, or a cloud service deployment slot is deleted. Clicking the **Stop** button for a VM within the Azure portal sets its state to Stopped (deallocated). In this case, the VM will lose its IP addresses.

### Can I move VMs from one subnet to another subnet in a VNet without re-deploying?
Yes. You can find more information in the [How to move a VM or role instance to a different subnet](virtual-networks-move-vm-role-to-subnet.md) article.

### Can I configure a static MAC address for my VM?
No. A MAC address cannot be statically configured.

### Will the MAC address remain the same for my VM once it has been created?
Yes, the MAC address remains the same for a VM deployed through both the Resource Manager and classic deployment models until it's deleted. Previously, the MAC address was released if the VM was stopped (deallocated), but now the MAC address is retained even when the VM is in the deallocated state.

### Can I connect to the internet from a VM in a VNet?
Yes. All VMs and Cloud Services role instances deployed within a VNet can connect to the Internet.

## Azure services that connect to VNets

### Can I use Azure App Service Web Apps with a VNet?
Yes. You can deploy Web Apps inside a VNet using an ASE (App Service Environment). All Web Apps can securely connect and access resources in your Azure VNet if you have a point-to-site connection configured for your VNet. For more information, see the following articles:

* [Creating Web Apps in an App Service Environment](../app-service-web/app-service-web-how-to-create-a-web-app-in-an-ase.md)
* [Integrate your app with an Azure Virtual Network](../app-service-web/web-sites-integrate-with-vnet.md)
* [Using VNet Integration and Hybrid Connections with Web Apps](../app-service-web/web-sites-integrate-with-vnet.md#hybrid-connections-and-app-service-environments)

### Can I deploy Cloud Services with web and worker roles (PaaS) in a VNet?
Yes. You can (optionally) deploy Cloud Services role instances within VNets. To do so, you specify the VNet name and the role/subnet mappings in the network configuration section of your service configuration. You do not need to update any of your binaries.

### Can I connect a Virtual Machine Scale Set (VMSS) to a VNet?
Yes. You must connect a VMSS to a VNet.

### Can I move my services in and out of VNets?
No. You cannot move services in and out of VNets. You will have to delete and re-deploy the service to move it to another VNet.

## Security

### What is the security model for VNets?
VNets are completely isolated from one another, and other services hosted in the Azure infrastructure. A VNet is a trust boundary.

### Can I restrict inbound or outbound traffic flow to VNet-connected resources?
Yes. You can apply [Network Security Groups](virtual-networks-nsg.md) to individual subnets within a VNet, NICs attached to a VNet, or both.

### Can I implement a firewall between VNet-connected resources?
Yes. You can deploy a [firewall network virtual appliance](https://azure.microsoft.com/en-us/marketplace/?term=firewall) from several vendors through the Azure Marketplace.

### Is there information available about securing VNets?
Yes. See the [Azure Network Security Overview](../security/security-network-overview.md) article for details.

## APIs, schemas, and tools

### Can I manage VNets from code?
Yes. You can use REST APIs for VNets in the [Azure Resource Manager](https://msdn.microsoft.com/library/mt163658.aspx) and [classic (Service Management)](http://go.microsoft.com/fwlink/?LinkId=296833)) deployment models.

### Is there tooling support for VNets?
Yes. Learn more about using:
- The Azure portal to deploy VNets through the [Azure Resource Manager](virtual-networks-create-vnet-arm-pportal.md) and [classic](virtual-networks-create-vnet-classic-pportal.md) deployment models.
- PowerShell to manage VNets deployed through the [Resource Manager](/powershell/resourcemanager/azurerm.network/v3.1.0/azurerm.network.md) and [classic](/powershell/module/azure/?view=azuresmps-3.7.0) deployment models.
- The [Azure command-line interface (CLI)](../virtual-machines/azure-cli-arm-commands.md#azure-network-commands-to-manage-network-resources) to manage VNets deployed through both deployment models.  
