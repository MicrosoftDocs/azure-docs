# IP Addresses in Azure Virtual Network
This article covers IP addressing for Virtual machines, Load balancers, VPN gateways and APP gateways.

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-rm-include.md)] [classic deployment model](virtual-network-ip-addresses-classic.md).

## Public IP Addresses
Public IP Addresses allow Azure resources to communicate with Internet and other Azure public-facing services like [Azure Redis Cache](https://azure.microsoft.com/services/cache), [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs). A public IP address is an independent resource and can be associated to different types of Azure resources like [Virtual machines](https://azure.microsoft.com/documentation/articles/virtual-machines-about/) (VM), [Load balancers](load-balancer-overview.md) (LB).

### Public IP Address Allocation Method
Public IP Addresses are allocated from a pool of IP addresses available in a given location. The complete list of IP address ranges used by Microsoft Azure Datacenters is published at [Azure Datacenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653).

There are two methods in which an IP address is allocated to a public IP resource: *dynamic* or *static*. The default allocation method is *dynamic*. In case of *dynamic*, an IP address is **not** allocated to the *public IP address resource* at the time of its creation. When a resource (like VM or Load balancer) associated with the *public IP address resource* is created or started, an IP address is allocated from the pool of IP addresses. This IP address is de-allocated and released to the available pool when the associated resource is deleted or stopped.

If you use *static* allocation method, an IP address is allocated to the *public IP address resource* at the time of its creation. In this case, regardless of the state of the associated resource, the same IP address remains allocated. It is released to the available pool only when the *public IP address resource* is deleted or its allocation method is modified to *dynamic*.

### DNS Resolution
A DNS domain name label can be specified for a public IP resource, which creates a corresponding DNS entry in the Azure DNS servers. The corresponding FQDN *domainnamelabel*.*location*.cloudapp.azure.com will be globally resolvable to the IP address allocated to the public IP resource.

We will go through the different resource types which can be associated with a public IP address below.

### Virtual Machine
A Public IP address is associated with a [Virtual machine](virtual-machines-about.md) (VM) through a network interface card (NIC). Each VM can have only one public IP address regardless of the number of NICs associated with it. Only a *dynamically* allocated *public IP address resource* can be associated with a VM NIC. In case of a multi-NIC VM, the *public IP address resource* can be associated with the primary NIC only.

### Azure Load Balancer
A public IP address can be associated with an [Azure Load Balancer](load-balancer-overview.md) (LB) front end configuration, which serves as the load-balanced virtual IP address (VIP) reachable over the Internet. Both *dynamic* or *static* public IP resources can be associated with an LB. It is possible to associate multiple *public IP address resources* to an LB front end configuration, which enables  scenarios like multi-tenant environment with multiple SSL-based websites.

### Application Gateway
A public IP address can be associated with an [Azure Application Gateway](application-gateway-introduction.md) front end configuration, to configure it with an internet reachable load-balanced virtual IP (VIP). Currently, only a *dynamically* allocated public IP resource can be associated with an application gateway. However, it is possible to associate multiple public IP addresses.

### VPN Gateway
A public IP address needs to be associated with an [Azure VPN Gateway](vpn-gateway-about-vpngateways.md) IP configuration, in the process of creating VPN connection between an Azure virtual network and on-premises network or another Azure virtual network. Currently, only a *dynamically* allocated public IP resource can be associated with a VPN Gateway.

### At-a-glance

|Resource|Static Allocation|Dynamic Allocation|Multiple IP addresses|
|---|---|---|---|
|Virtual Machine (VM)/Network Interface Card (NIC)|Yes|No|No|
|Load balancer front end|Yes|Yes|Yes|
|Application gateway front end|Yes|No|Yes|
|VPN gateway|Yes|No|No|

## Private IP Addresses
Private IP Addresses allows communication between resources in a virtual network without using an Internet-reachable IP addresses. This IP address is allocated from the address range of the subnet within the virtual network.

### Private IP Address Allocation Method
There are two methods in which the IP addresses are allocated: *dynamic* or *static*. The default allocation method is *dynamic*, where the IP address is allocated using DHCP. Alternatively, the allocation method can be explicitly specified as *static* along with specifying an IP address. In this case, the resource is allocated the specified IP address as long as it is within the address range of the subnet and is free (not allocated to any another resource).

There are different resource types that can be assigned a private IP address. Note that both allocation methods (*static* or *dynamic*) work for all these resource types.

### Virtual Machine
A private IP address is assigned to a network interface card (NIC) of a [virtual machine](virtual-machines-about.md) (VM). Each VM can have as many private IP addresses as the number of NICs associated with it.

#### Internal DNS Hostname Resolution
All Azure VMs are configured with [Azure-managed DNS servers](virtual-networks-name-resolution-for-vms-and-role-instances.md#azure-provided-name-resolution), unless explicitly specified during creation. In case of using Azure-managed DNS servers, a DNS record is created automatically which resolves the VM's hostname to the private IP address of the VM. In case of a multi-NIC VM, the hostname resolves to private IP address of the primary NIC.

### Internal Load Balancer
A private IP address can be assigned to an [Azure Internal Load Balancer](load-balancer-internal-overview.md) (ILB) front end, which serves as the load-balanced virtual IP address (VIP) for the resources within its virtual network. This allows load balancing without exposing the IP address to Internet.

### App Gateway
A private IP address can be assigned to an [Azure Application Gateway](application-gateway-introduction.md) front end, to configure it with an internal end-point not exposed to the internet, also known as Internal Load Balancer (ILB) endpoint. The behavior and allocation methods are similar to ILB described above.

### At-a-glance
|Resource|Static Allocation|Dynamic Allocation|Multiple IP addresses|
|---|---|---|---|
|Virtual Machine (VM)/Network Interface Card (NIC)|Yes|Yes|Yes|
|Load balancer front end|Yes|Yes|Yes|
|Application gateway front end|Yes|Yes|Yes|

## Next steps

[Azure Networking API reference](https://msdn.microsoft.com/library/azure/dn948464.aspx)

[Azure PowerShell reference for networking](https://msdn.microsoft.com/library/azure/mt163510.aspx)

[Azure Resource Manager Template Language](../resource-group-authoring-templates.md)

[Azure Networking – commonly used templates](https://github.com/Azure/azure-quickstart-templates)

[Compute Resource Provider](../virtual-machines-azurerm-versus-azuresm)

[Azure Resource Manager Overview](../resource-group-overview)

[Role based access control in Azure Resource Manager](https://msdn.microsoft.com/library/azure/dn906885.aspx) 

[Using Tags in Azure Resource Manager](https://msdn.microsoft.com/library/azure/dn848368.aspx)

[Template deployments](https://msdn.microsoft.com/library/azure/dn790549.aspx) 

