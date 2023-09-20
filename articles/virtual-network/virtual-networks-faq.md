---
title: Azure Virtual Network FAQ
titlesuffix: Azure Virtual Network
description: Answers to the most frequently asked questions about Microsoft Azure virtual networks.
author: asudbring
ms.service: virtual-network
ms.topic: conceptual
ms.workload: infrastructure-services
ms.custom: ignite-2022
ms.date: 06/26/2020
ms.author: allensu
---

# Azure Virtual Network frequently asked questions (FAQ)

## Basics

### What is a virtual network?

A virtual network is a representation of your own network in the cloud, as provided by the Azure Virtual Network service. A virtual network is a logical isolation of the Azure cloud that's dedicated to your subscription.

You can use virtual networks to provision and manage virtual private networks (VPNs) in Azure. Optionally, you can link virtual networks with other virtual networks in Azure, or with your on-premises IT infrastructure, to create hybrid or cross-premises solutions.

Each virtual network that you create has its own CIDR block. You can link a virtual network to other virtual networks and on-premises networks as long as the CIDR blocks don't overlap. You also have control of DNS server settings for virtual networks, along with segmentation of the virtual network into subnets.

Use virtual networks to:

* Create a dedicated, private, cloud-only virtual network. Sometimes you don't require a cross-premises configuration for your solution. When you create a virtual network, your services and virtual machines (VMs) within your virtual network can communicate directly and securely with each other in the cloud. You can still configure endpoint connections for the VMs and services that require internet communication, as part of your solution.

* Securely extend your datacenter. With virtual networks, you can build traditional site-to-site (S2S) VPNs to securely scale your datacenter capacity. S2S VPNs use IPsec to provide a secure connection between your corporate VPN gateway and Azure.

* Enable hybrid cloud scenarios. You can securely connect cloud-based applications to any type of on-premises system, including mainframes and Unix systems.

### How do I get started?

Visit the [Azure Virtual Network documentation](./index.yml) to get started. This content provides overview and deployment information for all of the virtual network features.

### Can I use virtual networks without cross-premises connectivity?

Yes. You can use a virtual network without connecting it to your premises. For example, you could run Microsoft Windows Server Active Directory domain controllers and SharePoint farms solely in an Azure virtual network.

### Can I perform WAN optimization between virtual networks or between a virtual network and my on-premises datacenter?

Yes. You can deploy a [network virtual appliance for WAN optimization](https://azuremarketplace.microsoft.com/marketplace/?term=wan%20optimization) from several vendors through Azure Marketplace.

## Configuration

### What tools do I use to create a virtual network?

You can use the following tools to create or configure a virtual network:

* Azure portal
* PowerShell
* Azure CLI
* [Network configuration file](/previous-versions/azure/virtual-network/virtual-networks-using-network-configuration-file) (`netcfg`, for classic virtual networks only)

### What address ranges can I use in my virtual networks?

We recommend that you use the following address ranges, which are enumerated in [RFC 1918](https://tools.ietf.org/html/rfc1918). The IETF has set aside these ranges for private, non-routable address spaces.

* 10.0.0.0 to 10.255.255.255  (10/8 prefix)
* 172.16.0.0 to 172.31.255.255  (172.16/12 prefix)
* 192.168.0.0 to 192.168.255.255 (192.168/16 prefix)

You can also deploy the shared address space reserved in [RFC 6598](https://datatracker.ietf.org/doc/html/rfc6598), which is treated as a private IP address space in Azure:

* 100.64.0.0 to 100.127.255.255 (100.64/10 prefix)

Other address spaces, including all other IETF-recognized private, non-routable address spaces, might work but have undesirable side effects.

In addition, you can't add the following address ranges:

* 224.0.0.0/4 (multicast)
* 255.255.255.255/32 (broadcast)
* 127.0.0.0/8 (loopback)
* 169.254.0.0/16 (link local)
* 168.63.129.16/32 (internal DNS)

### Can I have public IP addresses in my virtual networks?

Yes. For more information about public IP address ranges, see [Create a virtual network](manage-virtual-network.md#create-a-virtual-network). Public IP addresses are not directly accessible from the internet.

### Is there a limit to the number of subnets in my virtual network?

Yes. See [Networking limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#networking-limits) for details. Subnet address spaces can't overlap one another.

### Are there any restrictions on using IP addresses within these subnets?

Yes. Azure reserves the first four addresses and the last address, for a total of five IP addresses within each subnet.

For example, the IP address range of 192.168.1.0/24 has the following reserved addresses:

* 192.168.1.0: Network address.
* 192.168.1.1: Reserved by Azure for the default gateway.
* 192.168.1.2, 192.168.1.3: Reserved by Azure to map the Azure DNS IP addresses to the virtual network space.
* 192.168.1.255: Network broadcast address.

### How small and how large can virtual networks and subnets be?

The smallest supported IPv4 subnet is /29, and the largest is /2 (using CIDR subnet definitions). IPv6 subnets must be exactly /64 in size.  

### Can I bring my VLANs to Azure by using virtual networks?

No. Virtual networks are Layer 3 overlays. Azure does not support any Layer 2 semantics.

### Can I specify custom routing policies on my virtual networks and subnets?

Yes. You can create a route table and associate it with a subnet. For more information about routing in Azure, see [Custom routes](virtual-networks-udr-overview.md#custom-routes).

### What's the behavior when I apply both an NSG and a UDR at the subnet?

For inbound traffic, network security group (NSG) inbound rules are processed. For outbound traffic, NSG outbound rules are processed, followed by user-defined route (UDR) rules.

### What's the behavior when I apply an NSG at a NIC and a subnet for a VM?

When you apply NSGs at both a network adapter (NIC) and a subnet for a VM:

* A subnet-level NSG, followed by a NIC-level NSG, is processed for inbound traffic.
* A NIC-level NSG, followed by a subnet-level NSG, is processed for outbound traffic.

### Do virtual networks support multicast or broadcast?

No. Multicast and broadcast are not supported.

### What protocols can I use in virtual networks?

You can use TCP, UDP, ESP, AH, and ICMP TCP/IP protocols in virtual networks.

Unicast is supported in virtual networks. Multicast, broadcast, IP-in-IP encapsulated packets, and Generic Routing Encapsulation (GRE) packets are blocked in virtual networks. You can't use Dynamic Host Configuration Protocol (DHCP) via Unicast (source port UDP/68, destination port UDP/67). UDP source port 65330 is reserved for the host.

### Can I deploy a DHCP server in a virtual network?

Azure virtual networks provide DHCP service and DNS to VMs and client/server DHCP (source port UDP/68, destination port UDP/67) not supported in a virtual network.

You can't deploy your own DHCP service to receive and provide unicast or broadcast client/server DHCP traffic for endpoints inside a virtual network. Deploying a DHCP server VM with the intent to receive unicast DHCP relay (source port UDP/67, destination port UDP/67) traffic is also an *unsupported* scenario.

### Can I ping a default gateway in a virtual network?

No. An Azure-provided default gateway doesn't respond to a ping. But you can use pings in your virtual networks to check connectivity and for troubleshooting between VMs.

### Can I use tracert to diagnose connectivity?

Yes.

### Can I add subnets after the virtual network is created?

Yes. You can add subnets to virtual networks at any time, as long as both of these conditions exist:

* The subnet address range is not part of another subnet.
* There's available space in the virtual network's address range.

### Can I modify the size of my subnet after I create it?

Yes. You can add, remove, expand, or shrink a subnet if no VMs or services are deployed in it.

### Can I modify a virtual network after I create it?

Yes. You can add, remove, and modify the CIDR blocks that a virtual network uses.

### If I'm running my services in a virtual network, can I connect to the internet?

Yes. All services deployed in a virtual network can connect outbound to the internet. To learn more about outbound internet connections in Azure, see [Use Source Network Address Translation (SNAT) for outbound connections](../load-balancer/load-balancer-outbound-connections.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

If you want to connect inbound to a resource deployed through Azure Resource Manager, the resource must have a public IP address assigned to it. For more information, see [Create, change, or delete an Azure public IP address](./ip-services/virtual-network-public-ip-address.md).

Every cloud service deployed in Azure has a publicly addressable virtual IP (VIP) assigned to it. You define input endpoints for platform as a service (PaaS) roles and endpoints for virtual machines to enable these services to accept connections from the internet.

### Do virtual networks support IPv6?

Yes. Virtual networks can be IPv4 only or dual stack (IPv4 + IPv6). For details, see [What is IPv6 for Azure Virtual Network?](./ip-services/ipv6-overview.md).

### Can a virtual network span regions?

No. A virtual network is limited to a single region. But a virtual network does span availability zones. To learn more about availability zones, see [What are Azure regions and availability zones?](../reliability/availability-zones-overview.md).

You can connect virtual networks in different regions by using virtual network peering. For details, see [Virtual network peering](virtual-network-peering-overview.md).

### Can I connect a virtual network to another virtual network in Azure?

Yes. You can connect one virtual network to another virtual network by using either:

* Virtual network peering. For details, see [Virtual network peering](virtual-network-peering-overview.md).
* An Azure VPN gateway. For details, see [Configure a network-to-network VPN gateway connection](../vpn-gateway/vpn-gateway-howto-vnet-vnet-resource-manager-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

## Name resolution (DNS)

### What are my DNS options for virtual networks?

Use the decision table in [Name resolution for resources in Azure virtual networks](virtual-networks-name-resolution-for-vms-and-role-instances.md) to guide you through the available DNS options.

### Can I specify DNS servers for a virtual network?

Yes. You can specify IP addresses for DNS servers in the virtual network settings. The setting is applied as the default DNS server or servers for all VMs in the virtual network.

### How many DNS servers can I specify?

See [Networking limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#networking-limits).

### Can I modify my DNS servers after I create the network?

Yes. You can change the DNS server list for your virtual network at any time.

If you change your DNS server list, you need to perform a DHCP lease renewal on all affected VMs in the virtual network. The new DNS settings take effect after lease renewal. For VMs running Windows, you can renew the lease by entering `ipconfig /renew` directly on the VM. For other OS types, refer to the documentation for the DHCP lease renewal.

### What is Azure-provided DNS, and does it work with virtual networks?

Azure-provided DNS is a multitenant DNS service from Microsoft. Azure registers all of your VMs and cloud service role instances in this service. This service provides name resolution:

* By host name for VMs and role instances in the same cloud service.
* By fully qualified domain main (FQDN) for VMs and role instances in the same virtual network.

To learn more about DNS, see [Name resolution for resources in Azure virtual networks](virtual-networks-name-resolution-for-vms-and-role-instances.md).

There's a limitation to the first 100 cloud services in a virtual network for cross-tenant name resolution through Azure-provided DNS. If you're using your own DNS server, this limitation doesn't apply.

### Can I override my DNS settings for each VM or cloud service?

Yes. You can set DNS servers for each VM or cloud service to override the default network settings. However, we recommend that you use network-wide DNS as much as possible.

### Can I bring my own DNS suffix?

No. You can't specify a custom DNS suffix for your virtual networks.

## Connecting virtual machines

### Can I deploy VMs to a virtual network?

Yes. All network adapters (NICs) attached to a VM that's deployed through the Resource Manager deployment model must be connected to a virtual network. Optionally, you can connect VMs deployed through the classic deployment model to a virtual network.

### What are the types of IP addresses that I can assign to VMs?

* **Private**: Assigned to each NIC within each VM, through the static or dynamic method. Private IP addresses are assigned from the range that you specified in the subnet settings of your virtual network.

  Resources deployed through the classic deployment model are assigned private IP addresses, even if they're not connected to a virtual network. The behavior of the allocation method is different depending on whether you deployed a resource by using the Resource Manager or classic deployment model:

  * **Resource Manager**: A private IP address assigned through the dynamic or static method remains assigned to a virtual machine (Resource Manager) until the resource is deleted. The difference is that you select the address to assign when you're using the static method, and Azure chooses when you're using the dynamic method.
  * **Classic**: A private IP address assigned through the dynamic method might change when a virtual machine (classic) is restarted after being in the stopped (deallocated) state. If you need to ensure that the private IP address for a resource deployed through the classic deployment model never changes, assign a private IP address by using the static method.

* **Public**: Optionally assigned to NICs attached to VMs deployed through the Resource Manager deployment model. You can assign the address by using the static or dynamic allocation method.

  All VMs and Azure Cloud Services role instances deployed through the classic deployment model exist within a cloud service. The cloud service is assigned a dynamic, public VIP address. You can optionally assign a public static IP address, called a [reserved IP address](/previous-versions/azure/virtual-network/virtual-networks-reserved-public-ip), as a VIP.

  You can assign public IP addresses to individual VMs or Cloud Services role instances deployed through the classic deployment model. These addresses are called [instance-level public IP](/previous-versions/azure/virtual-network/virtual-networks-instance-level-public-ip) addresses and can be assigned dynamically.

### Can I reserve a private IP address for a VM that I'll create at a later time?

No. You can't reserve a private IP address. If a private IP address is available, the DHCP server assigns it to a VM or role instance. The VM might or might not be the one that you want the private IP address assigned to. You can, however, change the private IP address of an existing VM to any available private IP address.

### Do private IP addresses change for VMs in a virtual network?

It depends. If you deployed the VM by using Resource Manager, IP addresses can't change, regardless of whether you assigned the addresses by using the static or dynamic allocation method. If you deployed the VM by using the classic deployment model, dynamic IP addresses can change when you start a VM that was in the stopped (deallocated) state.

The address is released from a VM deployed through either deployment model when you delete the VM.

### Can I manually assign IP addresses to NICs within the VM operating system?

Yes, but we don't recommend it unless it's necessary, such as when you're assigning multiple IP addresses to a virtual machine. For details, see [Assign multiple IP addresses to virtual machines](./ip-services/virtual-network-multiple-ip-addresses-portal.md#os-config).

If the IP address assigned to an Azure NIC that's attached to a VM changes, and the IP address within the VM operating system is different, you lose connectivity to the VM.

### If I stop a cloud service deployment slot or shut down a VM from within the operating system, what happens to my IP addresses?

Nothing. The IP addresses (public VIP, public, and private) remain assigned to the cloud service deployment slot or the VM.

### Can I move VMs from one subnet to another subnet in a virtual network without redeploying?

Yes. You can find more information in [Move a VM or role instance to a different subnet](/previous-versions/azure/virtual-network/virtual-networks-move-vm-role-to-subnet).

### Can I configure a static MAC address for my VM?

No. You can't statically configure a MAC address.

### Does the MAC address remain the same for my VM after it's created?

Yes. The MAC address remains the same for a VM that you deployed through both the Resource Manager and classic deployment models until you delete it.

Previously, the MAC address was released if you stopped (deallocated) the VM. But now, the VM retains the MAC address when it's in the deallocated state. The MAC address remains assigned to the network adapter until you do one of these tasks:

* Delete the network adapter.
* Change the private IP address that's assigned to the primary IP configuration of the primary network adapter.

### Can I connect to the internet from a VM in a virtual network?

Yes. All VMs and Cloud Services role instances deployed within a virtual network can connect to the internet.

## Azure services that connect to virtual networks

### Can I use Web Apps with a virtual network?

Yes. You can deploy the Web Apps feature of Azure App Service inside a virtual network by using an App Service Environment. You can then:

* Connect the back end of your apps to your virtual networks by using virtual network integration.
* Lock down inbound traffic to your app by using service endpoints.

For more information, see the following articles:

* [App Service networking features](../app-service/networking-features.md)
* [Use an App Service Environment](../app-service/environment/using.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
* [Integrate your app with an Azure virtual network](../app-service/overview-vnet-integration.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
* [Set up Azure App Service access restrictions](../app-service/app-service-ip-restrictions.md)

### Can I deploy Cloud Services with web and worker roles (PaaS) in a virtual network?

Yes. You can (optionally) deploy Cloud Services role instances in virtual networks. To do so, you specify the virtual network name and the role/subnet mappings in the network configuration section of your service configuration. You don't need to update any of your binaries.

### Can I connect a virtual machine scale set to a virtual network?

Yes. You must connect a virtual machine scale set to a virtual network.

### Is there a complete list of Azure services that can I deploy resources from into a virtual network?

Yes. For details, see [Deploy dedicated Azure services into virtual networks](virtual-network-for-azure-services.md).

### How can I restrict access to Azure PaaS resources from a virtual network?

Resources deployed through some Azure PaaS services (such as Azure Storage and Azure SQL Database) can restrict network access to virtual networks through the use of virtual network service endpoints or Azure Private Link. For details, see [Virtual network service endpoints](virtual-network-service-endpoints-overview.md) and [What is Azure Private Link?](../private-link/private-link-overview.md).

### Can I move my services in and out of virtual networks?

No. You can't move services in and out of virtual networks. To move a resource to another virtual network, you have to delete and redeploy the resource.

## Security

### What is the security model for virtual networks?

Virtual networks are isolated from one another and from other services hosted in the Azure infrastructure. A virtual network is a trust boundary.

### Can I restrict inbound or outbound traffic flow to resources that are connected to a virtual network?

Yes. You can apply [network security groups](./network-security-groups-overview.md) to individual subnets within a virtual network, NICs attached to a virtual network, or both.

### Can I implement a firewall between resources that are connected to a virtual network?

Yes. You can deploy a [firewall network virtual appliance](https://azure.microsoft.com/marketplace/?term=firewall) from several vendors through Azure Marketplace.

### Is information available about securing virtual networks?

Yes. See [Azure network security overview](../security/fundamentals/network-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

### Do virtual networks store customer data?

No. Virtual networks don't store any customer data.

### Can I set the FlowTimeoutInMinutes property for an entire subscription?

No. You must set the [FlowTimeoutInMinutes](/powershell/module/az.network/set-azvirtualnetwork) property at the virtual network. The following code can help you set this property automatically for larger subscriptions:  

```Powershell
$Allvnet = Get-AzVirtualNetwork
$time = 4 #The value should be 4 to 30 minutes (inclusive) to enable tracking, or null to disable tracking. 
ForEach ($vnet in $Allvnet)
{
    $vnet.FlowTimeoutInMinutes = $time
    $vnet | Set-AzVirtualNetwork
}
```

## APIs, schemas, and tools

### Can I manage virtual networks from code?

Yes. You can use REST APIs for virtual networks in the [Azure Resource Manager](/rest/api/virtual-network) and [classic](/previous-versions/azure/ee460799(v=azure.100)) deployment models.

### Is there tooling support for virtual networks?

Yes. Learn more about using:

* The Azure portal to deploy virtual networks through the [Azure Resource Manager](manage-virtual-network.md#create-a-virtual-network) and [classic](/previous-versions/azure/virtual-network/virtual-networks-create-vnet-classic-pportal) deployment models.
* PowerShell to manage virtual networks deployed through the [Resource Manager](/powershell/module/az.network) deployment model.
* The Azure CLI or Azure classic CLI to deploy and manage virtual networks deployed through the [Resource Manager](/cli/azure/network/vnet) and [classic](/previous-versions/azure/virtual-machines/azure-cli-arm-commands?toc=%2fazure%2fvirtual-network%2ftoc.json#network-resources) deployment models.

## Virtual network peering

### What is virtual network peering?

Virtual network peering enables you to connect virtual networks. A peering connection between virtual networks enables you to route traffic between them privately through IPv4 addresses.

Virtual machines in peered virtual networks can communicate with each other as if they're within the same network. These virtual networks can be in the same region or in different regions (also known as global virtual network peering).

You can also create virtual network peering connections across Azure subscriptions.

### Can I create a peering connection to a virtual network in a different region?

Yes. Global virtual network peering enables you to peer virtual networks in different regions. Global virtual network peering is available in all Azure public regions, China cloud regions, and government cloud regions. You can't globally peer from Azure public regions to national cloud regions.

### What are the constraints related to global virtual network peering and load balancers?

If the two virtual networks in two regions are peered over global virtual network peering, you can't connect to resources that are behind a basic load balancer through the front-end IP of the load balancer. This restriction doesn't exist for a standard load balancer.

The following resources can use basic load balancers, which means you can't reach them through a load balancer's front-end IP over global virtual network peering. But you can use global virtual network peering to reach the resources directly through their private virtual network IPs, if permitted.

* VMs behind basic load balancers
* Virtual machine scale sets with basic load balancers
* Azure Cache for Redis
* Azure Application Gateway v1
* Azure Service Fabric
* Azure API Management stv1
* Azure Active Directory Domain Services (AD DS)
* Azure Logic Apps
* Azure HDInsight
* Azure Batch
* App Service Environment v1 and v2

You can connect to these resources via Azure ExpressRoute or network-to-network connections through virtual network gateways.

### Can I enable virtual network peering if my virtual networks belong to subscriptions within different Microsoft Entra tenants?

Yes. It's possible to establish virtual network peering (whether local or global) if your subscriptions belong to different Microsoft Entra tenants. You can do this via the Azure portal, PowerShell, or the Azure CLI.

### My virtual network peering connection is in an Initiated state. Why can't I connect?

If your peering connection is in an **Initiated** state, you created only one link. You must create a bidirectional link to establish a successful connection.

For example, to peer VNetA to VNetB, you must create a link from VNetA to VNetB and from VNetB to VNetA. Creating both links changes the state to *Connected*.

### My virtual network peering connection is in a Disconnected state. Why can't I create a peering connection?

If your virtual network peering connection is in a **Disconnected** state, one of the links that you created was deleted. To re-establish a peering connection, you need to delete the remaining link and re-create both.

### Can I peer my virtual network with a virtual network that's in a different subscription?

Yes. You can peer virtual networks across subscriptions and across regions.

### Can I peer two virtual networks that have matching or overlapping address ranges?

No. You can't enable virtual network peering if address spaces overlap.

### Can I peer a virtual network to two virtual networks with the Use Remote Gateway option enabled on both peerings?

No. You can enable the **Use Remote Gateway** option on only one peering to one of the virtual networks.

### How much do virtual network peering links cost?

There's no charge for creating a virtual network peering connection. Data transfer across peering connections is charged. For more information, see the [Azure Virtual Network pricing page](https://azure.microsoft.com/pricing/details/virtual-network/).

### Is virtual network peering traffic encrypted?

When Azure traffic moves between datacenters (outside physical boundaries not controlled by Microsoft or on behalf of Microsoft), the underlying network hardware uses [MACsec data-link layer encryption](../security/fundamentals/encryption-overview.md#encryption-of-data-in-transit). This encryption is applicable to virtual network peering traffic.

### Why is my peering connection in a Disconnected state?

Virtual network peering connections go into a **Disconnected** state when one virtual network peering link is deleted. You must delete both links to re-establish a successful peering connection.

### If I peer VNetA to VNetB and I peer VNetB to VNetC, does that mean VNetA and VNetC are peered?

No. Transitive peering is not supported. You must manually peer VNetA to VNetC.

### Are there any bandwidth limitations for peering connections?

No. Virtual network peering, whether local or global, does not impose any bandwidth restrictions. Bandwidth is limited only by the VM or the compute resource.

### How can I troubleshoot problems with virtual network peering?

Try the [troubleshooting guide](https://support.microsoft.com/help/4486956/troubleshooter-for-virtual-network-peering-issues).

## Virtual network TAP

### Which Azure regions are available for virtual network TAP?

The preview of virtual network terminal access point (TAP) is available in all Azure regions. You must deploy the monitored network adapters, the virtual network TAP resource, and the collector or analytics solution in the same region.

### Does virtual network TAP support any filtering capabilities on the mirrored packets?

Filtering capabilities are not supported with the virtual network TAP preview. When you add a TAP configuration to a network adapter, a deep copy of all the ingress and egress traffic on the network adapter is streamed to the TAP destination.

### Can I add multiple TAP configurations to a monitored network adapter?

A monitored network adapter can have only one TAP configuration. Check with the individual [partner solution](virtual-network-tap-overview.md#virtual-network-tap-partner-solutions) for the capability to stream multiple copies of the TAP traffic to the analytics tools of your choice.

### Can the same virtual network TAP resource aggregate traffic from monitored network adapters in more than one virtual network?

Yes. You can use the same virtual network TAP resource to aggregate mirrored traffic from monitored network adapters in peered virtual networks in the same subscription or a different subscription.

The virtual network TAP resource and the destination load balancer or destination network adapter must be in the same subscription. All subscriptions must be under the same Microsoft Entra tenant.

### Are there any performance considerations on production traffic if I enable a virtual network TAP configuration on a network adapter?

Virtual network TAP is in preview. During preview, there is no service-level agreement. You shouldn't use the capability for production workloads.

When you enable a virtual machine network adapter with a TAP configuration, the same resources on the Azure host allocated to the virtual machine to send the production traffic are used to perform the mirroring function and send the mirrored packets. Select the correct [Linux](../virtual-machines/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Windows](../virtual-machines/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine size to ensure that sufficient resources are available for the virtual machine to send the production traffic and the mirrored traffic.

### Is accelerated networking for Linux or Windows supported with virtual network TAP?

You can add a TAP configuration on a network adapter attached to a virtual machine that's enabled with accelerated networking for [Linux](create-vm-accelerated-networking-cli.md) or [Windows](create-vm-accelerated-networking-powershell.md). But adding the TAP configuration will affect the performance and latency on the virtual machine because Azure accelerated networking currently doesn't support the offload for mirroring traffic.

## Virtual network service endpoints

### What is the right sequence of operations to set up service endpoints to an Azure service?

There are two steps to secure an Azure service resource through service endpoints:

1. Turn on service endpoints for the Azure service.
2. Set up virtual network access control lists (ACLs) on the Azure service.

The first step is a network-side operation, and the second step is a service resource-side operation. The same administrator or different administrators can perform the steps, based on the Azure role-based access control (RBAC) permissions granted to the administrator role.

We recommend that you turn on service endpoints for your virtual network before you set up virtual network ACLs on the Azure service side. To set up virtual network service endpoints, you must perform the steps in the preceding sequence.

>[!NOTE]
> You must complete both of the preceding operations before you can limit the Azure service access to the allowed virtual network and subnet. Only turning on service endpoints for the Azure service on the network side does not give you the limited access. You must also set up virtual network ACLs on the Azure service side.

Certain services (such as Azure SQL and Azure Cosmos DB) allow exceptions to the preceding sequence through the `IgnoreMissingVnetServiceEndpoint` flag. After you set the flag to `True`, you can set up virtual network ACLs on the Azure service side before turning on the service endpoints on the network side. Azure services provide this flag to help customers in cases where the specific IP firewalls are configured on Azure services.

Turning on the service endpoints on the network side can lead to a connectivity drop, because the source IP changes from a public IPv4 address to a private address. Setting up virtual network ACLs on the Azure service side before turning on service endpoints on the network side can help avoid a connectivity drop.

### Do all Azure services reside in the Azure virtual network that the customer provides? How does a virtual network service endpoint work with Azure services?

Not all Azure services reside in the customer's virtual network. Most Azure data services (such as Azure Storage, Azure SQL, and Azure Cosmos DB) are multitenant services that can be accessed over public IP addresses. For more information, see [Deploy dedicated Azure services into virtual networks](virtual-network-for-azure-services.md).

When you turn on virtual network service endpoints on the network side and set up appropriate virtual network ACLs on the Azure service side, access to an Azure service is restricted from an allowed virtual network and subnet.

### How do virtual network service endpoints provide security?

Virtual network service endpoints limit the Azure service's access to the allowed virtual network and subnet. In this way, they provide network-level security and isolation of the Azure service traffic.

All traffic that uses virtual network service endpoints flows over the Microsoft backbone to provide another layer of isolation from the public internet. Customers can also choose to fully remove public internet access to the Azure service resources and allow traffic only from their virtual network through a combination of IP firewall and virtual network ACLs. Removing internet access helps protect the Azure service resources from unauthorized access.

### What does the virtual network service endpoint protect - virtual network resources or Azure service resources?

Virtual network service endpoints help protect Azure service resources. Virtual network resources are protected through network security groups.

### Is there any cost for using virtual network service endpoints?

No. There's no additional cost for using virtual network service endpoints.

### Can I turn on virtual network service endpoints and set up virtual network ACLs if the virtual network and the Azure service resources belong to different subscriptions?

Yes, it's possible. Virtual networks and Azure service resources can be in the same subscription or in different subscriptions. The only requirement is that both the virtual network and the Azure service resources must be under the same Microsoft Entra tenant.

### Can I turn on virtual network service endpoints and set up virtual network ACLs if the virtual network and the Azure service resources belong to different Microsoft Entra tenants?

Yes, it's possible when you're using service endpoints for Azure Storage and Azure Key Vault. For other services, virtual network service endpoints and virtual network ACLs are not supported across Microsoft Entra tenants.

### Can an on-premises device's IP address that's connected through an Azure virtual network gateway (VPN) or ExpressRoute gateway access Azure PaaS services over virtual network service endpoints?

By default, Azure service resources secured to virtual networks are not reachable from on-premises networks. If you want to allow traffic from on-premises, you must also allow public (typically, NAT) IP addresses from on-premises or ExpressRoute. You can add these IP addresses through the IP firewall configuration for the Azure service resources.

### Can I use virtual network service endpoints to secure Azure services to multiple subnets within a virtual network or across multiple virtual networks?

To secure Azure services to multiple subnets within a virtual network or across multiple virtual networks, enable service endpoints on the network side on each of the subnets independently. Then, secure Azure service resources to all of the subnets by setting up appropriate virtual network ACLs on the Azure service side.

### How can I filter outbound traffic from a virtual network to Azure services and still use service endpoints?

If you want to inspect or filter the traffic destined to an Azure service from a virtual network, you can deploy a network virtual appliance within the virtual network. You can then apply service endpoints to the subnet where the network virtual appliance is deployed and secure Azure service resources only to this subnet through virtual network ACLs.

This scenario might also be helpful if you want to restrict Azure service access from your virtual network only to specific Azure resources by using network virtual appliance filtering. For more information, see [Deploy highly available NVAs](/azure/architecture/reference-architectures/dmz/nva-ha).

### What happens when someone accesses an Azure service account that has a virtual network ACL enabled from outside the virtual network?

The service returns an HTTP 403 or HTTP 404 error.

### Are subnets of a virtual network created in different regions allowed to access an Azure service account in another region?

Yes. For most of the Azure services, virtual networks created in different regions can access Azure services in another region through the virtual network service endpoints. For example, if an Azure Cosmos DB account is in the West US or East US region, and virtual networks are in multiple regions, the virtual networks can access Azure Cosmos DB.

Azure Storage and Azure SQL are exceptions and are regional in nature. Both the virtual network and the Azure service need to be in the same region.
  
### Can an Azure service have both a virtual network ACL and an IP firewall?

Yes. A virtual network ACL and an IP firewall can coexist. The features complement each other to help ensure isolation and security.

### What happens if you delete a virtual network or subnet that has service endpoints turned on for Azure services?

Deletion of virtual networks and deletion of subnets are independent operations. They're supported even when you turn on service endpoints for Azure services.

If you set up virtual network ACLs for Azure services, the ACL information associated with those Azure services is disabled when you delete a virtual network or subnet that has virtual network service endpoints turned on.

### What happens if I delete an Azure service account that has a virtual network service endpoint turned on?

The deletion of an Azure service account is an independent operation. It's supported even if you turned on the service endpoint on the network side and set up virtual network ACLs on the Azure service side.

### What happens to the source IP address of a resource (like a VM in a subnet) that has virtual network service endpoints turned on?

When you turn on virtual network service endpoints, the source IP addresses of the resources in your virtual network's subnet switch from using public IPv4 addresses to using the Azure virtual network's private IP addresses for traffic to Azure services. This switch can cause specific IP firewalls that are set to a public IPv4 address earlier on the Azure services to fail.

### Does the service endpoint route always take precedence?

Service endpoints add a system route that takes precedence over Border Gateway Protocol (BGP) routes and provides optimum routing for the service endpoint traffic. Service endpoints always take service traffic directly from your virtual network to the service on the Microsoft Azure backbone network.

For more information about how Azure selects a route, see [Virtual network traffic routing](virtual-networks-udr-overview.md).

### Do service endpoints work with ICMP?

No. ICMP traffic that's sourced from a subnet with service endpoints enabled won't take the service tunnel path to the desired endpoint. Service endpoints handle only TCP traffic. If you want to test latency or connectivity to an endpoint via service endpoints, tools like ping and tracert won't show the true path that the resources within the subnet will take.

### How do NSGs on a subnet work with service endpoints?

To reach the Azure service, NSGs need to allow outbound connectivity. If your NSGs are opened to all internet outbound traffic, the service endpoint traffic should work. You can also limit the outbound traffic to only service IP addresses by using the service tags.  

### What permissions do I need to set up service endpoints?

You can configure service endpoints on a virtual network independently if you have write access to that network.

To secure Azure service resources to a virtual network, you must have **Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action** permission for the subnets that you're adding. This permission is included in the built-in service administrator role by default and can be modified through the creation of custom roles.

For more information about built-in roles and assigning specific permissions to custom roles, see [Azure custom roles](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

### Can I filter virtual network traffic to Azure services over service endpoints?

You can use virtual network service endpoint policies to filter virtual network traffic to Azure services, allowing only specific Azure service resources over the service endpoints. Endpoint policies provide granular access control from the virtual network traffic to the Azure services.

To learn more, see [Virtual network service endpoint policies for Azure Storage](virtual-network-service-endpoint-policies-overview.md).

### Does Microsoft Entra ID support virtual network service endpoints?

Microsoft Entra ID doesn't support service endpoints natively. For a complete list of Azure services that support virtual network service endpoints, see [Virtual network service endpoints](./virtual-network-service-endpoints-overview.md).

In that list, the *Microsoft.AzureActiveDirectory* tag listed under services that support service endpoints is used for supporting service endpoints to Azure Data Lake Storage Gen1. [Virtual network integration for Data Lake Storage Gen1](../data-lake-store/data-lake-store-network-security.md?toc=%2fazure%2fvirtual-network%2ftoc.json) makes use of the virtual network service endpoint security between your virtual network and Microsoft Entra ID to generate additional security claims in the access token. These claims are then used to authenticate your virtual network to your Data Lake Storage Gen1 account and allow access.

### Are there any limits on how many service endpoints I can set up from my virtual network?

There is no limit on the total number of service endpoints in a virtual network. For an Azure service resource (such as an Azure Storage account), services might enforce limits on the number of subnets that you use for securing the resource. The following table shows some example limits:

|Azure service|    Limits on virtual network rules|
|---|---|
|Azure Storage|    200|
|Azure SQL|    128|
|Azure Synapse Analytics|    128|
|Azure Key Vault|    200 |
|Azure Cosmos DB|    64|
|Azure Event Hubs|    128|
|Azure Service Bus|    128|
|Azure Data Lake Storage Gen1|    100|

>[!NOTE]
> The limits are subject to change at the discretion of the Azure services. Refer to the respective service documentation for details.

## Migration of classic network resources to Resource Manager

### What is Azure Service Manager, and what does the term "classic" mean?

Azure Service Manager is the old deployment model of Azure that was responsible for creating, managing, and deleting resources. The word *classic* in a networking service refers to resources managed by the Azure Service Manager model. For more information, see the [comparison of deployment models](../azure-resource-manager/management/deployment-models.md).

### What is Azure Resource Manager?

Azure Resource Manager is the latest deployment and management model in Azure that's responsible for creating, managing, and deleting resources in your Azure subscription. For more information, see [What is Azure Resource Manager?](../azure-resource-manager/management/overview.md).

### Can I revert the migration after resources have been committed to Resource Manager?

You can cancel the migration as long as resources are still in the prepared state. Rolling back to the previous deployment model isn't supported after you successfully migrate resources through the commit operation.

### Can I revert the migration if the commit operation failed?

You can't reverse a migration if the commit operation failed. All migration operations, including the commit operation, can't be changed after you start them. We recommend that you retry the operation after a short period. If the operation continues to fail, submit a support request.

### Can I validate my subscription or resources to see if they're capable of migration?

Yes. The first step in preparing for migration is to validate that resources can be migrated. If the validation fails, you'll receive messages for all the reasons why the migration can't be completed.

### Are Application Gateway resources migrated as part of the virtual network migration from classic to Resource Manager?  

Azure Application Gateway resources aren't migrated automatically as part of the virtual network migration process. If one is present in the virtual network, the migration won't be successful. To migrate an Application Gateway resource to Resource Manager, you have to remove and re-create the Application Gateway instance after the migration is complete.

### Are VPN Gateway resources migrated as part of the virtual network migration from classic to Resource Manager?

Azure VPN Gateway resources are migrated as part of the virtual network migration process. The migration is completed one virtual network at a time with no other requirements. The migration steps are the same as for migrating a virtual network without a VPN gateway.

### Is a service interruption associated with migrating classic VPN gateways to Resource Manager?  

You won't experience any service interruption with your VPN connection when you're migrating to Resource Manager. Existing workloads will continue to function with full on-premises connectivity during the migration.

### Do I need to reconfigure my on-premises device after the VPN gateway is migrated to Resource Manager?

The public IP address associated with the VPN gateway remains the same after the migration. You don't need to reconfigure your on-premises router.

### What are the supported scenarios for VPN gateway migration from classic to Resource Manager?

The migration from classic to Resource Manager covers most of the common VPN connectivity scenarios. The supported scenarios include:

* Point-to-site connectivity.

* Site-to-site connectivity with a VPN gateway connected to an on-premises location.

* Network-to-network connectivity between two virtual networks that use VPN gateways.

* Multiple virtual networks connected to same on-premises location.

* Multiple-site connectivity.

* Virtual networks with forced tunneling enabled.

### Which scenarios aren't supported for VPN gateway migration from classic to Resource Manager?

Scenarios that aren't supported include:

* A virtual network with both an ExpressRoute gateway and a VPN gateway.

* A virtual network with an ExpressRoute gateway connected to a circuit in a different subscription.

* Transit scenarios where VM extensions are connected to on-premises servers.

### Where can I find more information about migration from classic to Resource Manager?

See [Frequently asked questions about classic to Azure Resource Manager migration](../virtual-machines/migration-classic-resource-manager-faq.yml).

### How can I report a problem?

You can post questions about migration problems to the [Microsoft Q&A](/answers/topics/azure-virtual-network.html) page. We recommend that you post all your questions on this forum. If you have a support contract, you can also file a support request.
