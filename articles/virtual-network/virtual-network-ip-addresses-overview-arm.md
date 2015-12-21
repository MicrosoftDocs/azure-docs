<properties
   pageTitle="Public and private IP addressing in Azure Resource Manager | Microsoft Azure"
   description="Learn about public and private IP addressing in Azure Resource Manager"
   services="virtual-network"
   documentationCenter="na"
   authors="telmosampaio"
   manager="carmonm"
   editor="tysonn"
   tags="azure-resource-manager" />
<tags
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="12/14/2015"
   ms.author="telmos" />

# IP addresses in Azure Resource Manager
IP addresses are assigned to Azure resources to allow communication with other Azure resources, on-premises network, and the Internet. There are two types of IP addresses you can use in Azure - public and private.

Public IP addresses are used for communication with the Internet, including Azure public-facing services.

Private IP addresses are used for communication within an Azure virtual network (VNet), and your on-premises network when you use a VPN gateway or ExpressRoute circuit to extend your network to Azure.

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-rm-include.md)] [classic deployment model](virtual-network-ip-addresses-overview-classic.md).

## Public IP addresses
Public IP addresses allow Azure resources to communicate with Internet and Azure public-facing services such as [Azure Redis Cache](https://azure.microsoft.com/services/cache), [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs), [SQL databases](sql-database-technical-overview.md), and [Azure storage](storage-introduction.md).

In Azure Resource Manager, a [public IP](resource-groups-networking.md#public-ip-address) address is a resource that has its own properties, and can be associated with any of the following resources:

- VMs
- Internet facing load balancers
- VPN gateways
- Application gateways

### Allocation method
There are two methods in which an IP address is allocated to a *public IP resource* - *dynamic* or *static*. The default allocation method is *dynamic*, where an IP address is **not** allocated at the time of its creation. Instead, the public IP address is allocated when the associated resource (like VM or Load balancer) is created or started. This IP address is released when the resource is stopped (or deleted), and may change when the resource is started again.

To ensure the IP address for the associated resource remains the same, the allocation method needs to be explicitly set to *static* for the *public IP resource*. In this case an IP address is assigned immediately, and is released only when the resource is deleted or its allocation method is set to *dynamic*.

>[AZURE.NOTE] Even when a public IP resource is configured as static, the actual IP address allocated cannot be specified. Instead, it is allocated from a pool of available IP addresses in the Azure location the resource is created.

Static public IP addresses are commonly used in the following scenarios:

- Resources that require firewall rules setup by end-users.
- Resources that depend on external DNS name resolution, where a dynamic IP would require updating A records.
- Resources that consume external web services which use IP based security model.
- Resources that use SSL certificates linked to an IP address.

>[AZURE.NOTE] The list of IP ranges from which public IP addresses are allocated to Azure resources is published at [Azure Datacenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653).

### DNS hostname resolution
A DNS domain name label can be specified for a public IP resource, a mapping for *domainnamelabel*.*location*.cloudapp.azure.com to the public IP address is added in the Azure-managed DNS servers. For instance, if you create a public IP resource with a *domainnamelabel* of **azuretest** in the *West US* Azure region, the fully-qualified domain name (FQDN) mapping to the public IP will be **azuretest.westus.cloudapp.azure.com**. This FQDN can further be used to create a custom domain CNAME record pointing to the public IP address in Azure.

>[AZURE.IMPORTANT] Each domain name label created must be unique within its Azure location.  

### VMs
A Public IP address can be associated with a [Virtual machine](virtual-machines-about.md) (VM) by assigning it to its **network interface card** (NIC). In case of a multi-NIC VM, it can be assigned to the *primary* NIC only. You can assign either a dynamic or a static public IP address to a VM.

### Internet facing load balancers
A public IP address can be associated with an [Azure Load Balancer](load-balancer-overview.md) (LB), which serves as the load-balanced virtual IP address (VIP). Either a dynamic or a static public IP can be assigned to the LB **front end** configuration. Multiple public IPs can be assigned to an LB, which enables scenarios like multi-tenant environment with multiple SSL-based websites.

### VPN gateways
[Azure VPN Gateway](vpn-gateway-about-vpngateways.md) is used to connect an Azure virtual network (VNet) to other Azure VNets or on-premises network. It requires a public IP address associated with its **IP configuration** to communicate with the remote network. Currently, only a dynamic public IP address can be assigned to a VPN gateway.

### Application gateways
A public IP address can be associated with an Azure [Application gateway](application-gateway-introduction.md), which serves as the load-balanced VIP. Currently, only a *dynamic* public IP can be assigned to an application gateway **front end** configuration. It is possible to assign multiple public IP addresses, which enables scenarios like multi-tenant environment.

### At-a-glance
The table below shows each resource type with the possible allocation methods (dynamic/static), and ability to assign multiple public IP addresses.

|Resource|Dynamic|Static|Multiple IP addresses|
|---|---|---|---|
|Network Interface Card (NIC) (of a VM)|Yes|Yes|No|
|Load balancer front end|Yes|Yes|Yes|
|VPN gateway|Yes|No|No|
|Application gateway front end|Yes|No|No|

## Private IP addresses
Private IP addresses allow Azure resources to communicate with other resources in a [virtual network](virtual-networks-overview.md)(VNet), or in on-premises network through a VPN gateway or ExpressRoute circuit, without using an Internet-reachable IP address.

In Azure Resource Manager deployment model, a private IP address is associated to various Azure resources.

- VMs
- Internal load balancers (ILBs)
- Application gateways

### Allocation method
A private IP address is allocated from the address range of the subnet to which the resource is attached. The address range of the subnet itself is a part of the VNet's address range.

There are two methods in which a private IP address is allocated: *dynamic* or *static*. The default allocation method is *dynamic*, where the IP address is allocated based on the subnet the resource is part of (using DHCP). This IP address can change when the resource is stopped and started.

To ensure the IP address remains the same, the allocation method needs to be set to *static*. In this case, a valid IP address needs to be specified, that is part of the address range assigned to the subnet the resource is part of and is free.

Static private IP addresses are commonly used for:

- VMs that act as domain controllers or DNS servers.
- Resources that require firewall rules using IP addresses.
- Resources accessed by other apps/resources through an IP address.

### Internal DNS hostname resolution (for VMs)
All Azure VMs are configured with [Azure-managed DNS servers](virtual-networks-name-resolution-for-vms-and-role-instances.md#azure-provided-name-resolution) by default, unless custom DNS servers are configured explicitly. Immediately after a resource is created, its hostname to private IP address mapping is added to the Azure-managed DNS servers. In case of a multi-NIC VM, the hostname is mapped to the private IP address of the primary NIC.

VMs configured with Azure-managed DNS servers will be able to resolve the hostnames of all VMs within their VNet.

### VMs
A private IP address is associated with a [Virtual machine](virtual-machines-about.md) (VM) through its **network interface card** (NIC). In case of a multi-NIC VM, every NIC has a private IP address. Either a dynamic or a static public IP address can be assigned to a VM NIC.

### Internal load balancers (ILB)
A private IP address can be assigned to an [Azure Internal Load Balancer](load-balancer-internal-overview.md) (ILB) **front end** configuration, which serves as an internal end-point not exposed to the internet, also known as Internal Load Balancer (ILB) endpoint, for the resources within its virtual network (VNet) and the remote networks connected to the VNet. Either a dynamic or static private IP address can be assigned to the front end configuration of an ILB.

### Application gateways
A private IP address can be assigned to an [Azure Application Gateway](application-gateway-introduction.md) **front end** configuration, which serves as an internal application gateway end-point not exposed to the internet. It is accessible only to the resources within its virtual network (VNet) and the remote networks connected to the VNet. Either a dynamic or static private IP address can be assigned to the front end configuration of an application gateway.

### At-a-glance
The table below shows each resource type with the possible allocation methods (dynamic/static), and ability to assign multiple private IP addresses.

|Resource|Static|Dynamic|Multiple IP addresses|
|---|---|---|---|
|Virtual Machine (VM)/Network Interface Card (NIC)|Yes|Yes|Yes|
|Internal Load balancer front end|Yes|Yes|Yes|
|Application gateway front end|Yes|Yes|Yes|

## Comparison between Resource Manager and Classic deployments
Below is a comparison of IP address in resource manager with the classic deployment model.

### Public IP addresses

|Resource|Classic|Resource Manager|
|---|---|---|
|VM|Referred to as an ILPIP (dynamic only)|Referred to as a public IP (dynamic or static)|
||Assigned to an IaaS VM or a PaaS role instance|Associated to the VM's NIC|
|Internet facing load balancer|Referred to as VIP (dynamic) or Reserved IP (static)|Referred to as a public IP (dynamic or static)|
||Assigned to a cloud service|Associated to the LB's front end config|

### Private IP addresses

|Resource|Classic|Resource Manager|
|---|---|---|
|VM|Referred to as a DIP|Referred to as a private IP address|
||Assigned to an IaaS VM or a PaaS role instance|Assigned to the VM's NIC|
|ILB|Assigned to the ILB (dynamic or static)|Assigned to the ILB's front end config (dynamic or static)|

## Next steps
- [Deploy a VM with a static public IP](virtual-network-deploy-static-pip-arm-template.md)
- [Create a public IP address for an Internet facing load balancer by using the Azure CLI](load-balancer-get-started-internet-arm-cli.md#create-a-virtual-network-and-a-public-ip-address-for-the-front-end-ip-pool)
- [Create a public IP address for an application gateway by using PowerShell](application-gateway-create-gateway-arm.md#create-public-ip-address-for-front-end-configuration)
- [Create a public IP address for a VPN gateway by using PowerShell](vpn-gateway-create-site-to-site-rm-powershell.md#4-request-a-public-ip-address-for-the-gateway)
- [Deploy a VM with a static private IP address](virtual-networks-static-private-ip-arm-pportal.md)
- [Create a front end static private IP address for an internal load balancer by using PowerShell](load-balancer-get-started-ilb-arm-ps.md#create-front-end-ip-pool-and-backend-address-pool)
- [Create a backend pool with static private IP addresses for an application gateway by using PowerShell](application-gateway-create-gateway-arm.md#create-an-application-gateway-configuration-object)
