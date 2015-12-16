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
You can assign IP addresses to different Azure resources to provide communication to other Azure resources, your on-premises network, and the public Internet. Private IP addresses are used for communication within an Azure virtual network (VNet) or cloud service, and even your on-premises network when you use a VPN gateway or ExpressRoute circuit to extend your network to Azure. Public IP addresses are used for communication with the public Internet.

You can assign IP addresses to different Azure resources, including:
- IaaS virtual machines ([VMs](virtual-machines-about.md))
- [VPN gateways](vpn-gateway-about-vpngateways.md)
- [Application gateways](application-gateway-introduction.md)
- [Load balancers](load-balancer-overview.md)

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-rm-include.md)] [classic deployment model](virtual-network-ip-addresses-overview-classic.md).

## Public IP Addresses
You assign public IP addresses to allow Azure resources to communicate with Internet services, including Azure public-facing services like [Azure Redis Cache](https://azure.microsoft.com/services/cache), [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs), [SQL databases](sql-database-technical-overview.md), and [Azure storage](storage-introduction.md).

In Azure Resource Manager, a public IP ([PIP](resource-groups-networking.md/#public-ip-address))address is a resource that has its own properties, and can be associated with any of the following resources:

- VMs by using network interfaces ([NICs](resource-groups-networking.md/#nic))
- VPN gateways.
- Internet facing [load balancer front end](resource-groups-networking.md/#load-balancer)
- [Application gateway front end](resource-groups-networking.md/#application-gateway) 

**VMs**
You can create VMs with one or more NICs. However, only the primary NIC associated to a VM can have a PIP. [Deploy a VM with a static public IP](virtual-network-static-pip-arm-template.md) to learn more about private IP addressing.

**VPN gateways**
You can associate the **publicIPAddress** property of a VPN gateway to a PIP. [Deploy a site-to-site VPN](https://github.com/telmosampaio/azure-quickstart-templates/tree/master/201-site-to-site-vpn) to learn more about PIPs in a VPN gateway. 

**Internet facing load balancers**
You can associate the **frontendIPConfigurations** property of an internet facing load balancer to a PIP. [Deploy a public facing load balancer](load-balancer-get-started-internet-arm-template.md) to learn more about associating a PIP to a load balancer front end.

**Application gateways**
You can associate the **frontendIPConfigurations** property of an application gateway to a PIP, creating an internet facing application gateway. [Deploy a public application gateway](https://github.com/Azure/azure-quickstart-templates/tree/master/101-application-gateway-public-ip) to learn more about PIPs in an application gateway. 

### Allocation methods
You can use *dynamic* or *static* public IP addresses. In the default allocation method, which is *dynamic*, an IP address is **not** assigned to the PIP resource during creation. Instead, the PIP resource has an IP address allocated based on the [Azure location](https://www.microsoft.com/download/details.aspx?id=41653) it is a part of when a resource such as a NIC, load balancer, or application gateway is created or started. Furthermore, the IP address used by PIP may change when the associated resource is deleted or stopped.

If you want to ensure the IP address for your resource remains the same, you have to change the allocation method to *static*. Unlike private IP addresses, you cannot specify what IP address you want to use. Static public IP addresses are commonly used for cloud services and VMs in the following scenarios:
- Use of SSL certificates linked to an IP address.
- Resources that require firewall rules setup for outside Azure.
- Resources that depend on external DNS name resolution, where a dynamic IP would require updating A records.
- Resources running services accessed by other apps by using an IP address.

>[AZURE.NOTE] Even when you configured a PIP to use a static IP address, you cannot specify the actual IP address used by your resource. Your resource will get an IP address based on the [Azure location](https://www.microsoft.com/download/details.aspx?id=41653) your resource is created in.  

### DNS hostname resolution
You can associate a PIP with a DNS domain name label, which creates a corresponding DNS entry in the Azure DNS servers. The corresponding FQDN will have the format *domainnamelabel*.*location*.cloudapp.azure.com, and will be associated to the public IP linked to your resource. For instance, if you create a public IP with a *domainnamelabel* of **azuretest** in the *West US* Azure region, the FQDN for the resource associated to the public IP will be **azuretest.westus.cloudapp.azure.com**.

>[AZURE.IMPORTANT] Each domain name label created in the public Internet must be unique.  

You can later create CNAME records using your own custom domain name that point to the domain label name you create in Azure.

### At-a-glance

|Resource|Dynamic|Static|Multiple IP addresses|
|---|---|---|---|
|Virtual Machine (VM)/Network Interface Card (NIC)|Yes|Yes|No|
|Load balancer front end|Yes|Yes|Yes|
|Application gateway front end|Yes|No|No|
|VPN gateway|Yes|No|No|

## Private IP addresses
You assign private IP addresses to allow Azure resources to communicate to other resources in your VNet, or to your on-premises network through a VPN gateway or ExpressRoute circuit. Each VNet or cloud service you create will use a range of pre-defined private IP addresses. Resources in a VNet must use a private IP address that is part of this range. 

In Azure Resource Manager, a private IP address is a property that can be used in different resources.

- Network interface ([NIC](resource-groups-networking.md/#nic)), a NIC can be associated to the following resources:
	- [VMs](virtual-machines-about.md)
	- Internet facing [load balancer back end pools](resource-groups-networking.md/#load-balancer)
	- Internal [load balancer back end pool](resource-groups-networking.md/#load-balancer)
- Internal facing [load balancer front end](resource-groups-networking.md/#load-balancer)
- [Application gateway back end pool](resource-groups-networking.md/#application-gateway) 


**VMs**
You can create VMs with one or more NICs. Each NIC has its own private IP address. [Deploy a VM with a static private IP](virtual-networks-static-private-ip-arm-ps.md) to learn more about private IP addressing.

**Internet facing load balancer**
You can associate multiple NICs to the back end pool property of an Internet facing load balancer. Each NIC has its own private IP address, and is associated to a VM that is part of the load balancing set. Learn more about [Internet facing load balancers](load-balancer-internet-overview.md).

**Internal load balancer (ILB)**
Similar to an Internet facing load balancer, you can associate multiple NICs to the back end pool property of an internal load balancer. Each NIC has its own private IP address, and is associated to a VM that is part of the load balancing set.

You can also associated a private IP address to the **frontendIPConfigurations** property of an internal load balancer. [Deploy an internal load balancer](load-balancer-get-started-ilb-arm-template.md) to learn more about private IP settings in ILB.

**Application gateway**
You can associate static private IP addresses to the **backendAddressPool** property of an application gateway. You can also associate the **frontendIPConfigurations** property of an application gateway to a subnet, to assign it a dynamic private IP address on the front end, creating an internal application gateway. [Deploy an internal application gateway](application-gateway-create-gateway-arm-template.md) to learn more about private IP addresses in an application gateway. 

### Allocation methods
You can use *dynamic* or *static* public IP addresses. In the default allocation method, which is *dynamic*, an IP address is automatically assigned to a resource based on the Azure location the resource is created in from the [Azure Datacenter IP ranges](https://www.microsoft.com/en-us/download/details.aspx?id=41653). However, the IP address used by the resource may change when the resource associated to the PIP is deleted or stopped.

If the allocation method is specified as *static*, an IP address is allocated to the *public IP address resource* at the time of its creation. In this case, irrespective of the state of the associated resource, the IP address remains allocated. It is released to the available pool only when the *public IP address resource* is deleted or its allocation method is modified to *dynamic*. 

>[AZURE.NOTE] Even when you configure a PIP to use a static IP address, you cannot specify what address to use. Since 

If you want to ensure the IP address for your resource remains the same, you have to change the allocation method to *static* and specify a valid IP address that is part of the range of addresses assigned to the subnet the resource is part of. 

Static IP addresses are commonly used for:
- VMs that act as DNS servers
- VMs that act domain controllers
- VMs that require firewall rules using IP addresses
- VMs running services accessed by other apps by using an IP address

### Internal DNS hostname resolution
Most communication between Azure resources is done by using a human readable name to represent the resource, instead of an IP address. This name is referred to as a *hostname*, a term commonly understood by networking professionals. When a resource is trying to access another resource by using a hostname, the hostname must be resolved to an IP address. This is usually done by a [DNS server](https://technet.microsoft.com/magazine/2005.01.howitworksdns.aspx).

All Azure VMs use [Azure-managed DNS servers](virtual-networks-name-resolution-for-vms-and-role-instances.md#azure-provided-name-resolution), unless you create your own DNS server and configure your VMs to use it. In case of using Azure-managed DNS servers, a DNS record is created automatically to resolve the VM's hostname to the private IP address of the VM. In case of a multi-NIC VM, the hostname resolves to private IP address of the primary NIC.

### At-a-glance
|Resource|Static Allocation|Dynamic Allocation|Multiple IP addresses|
|---|---|---|---|
|Virtual Machine (VM)/Network Interface Card (NIC)|Yes|Yes|Yes|
|Internal Load balancer front end|Yes|Yes|Yes|
|Application gateway front end|Yes|Yes|Yes|

## Differences between Resource Manager and classic deployments
If you are familiar with the classic deployment model, and new to Resource Manager, you can quickly understand wht changes in Resource Manager by checking the differences listed below.

**Private IP addresses**

|Resource|classic|Resource Manager|
|---|---|---|
|VM|Referred to as a DIP|Referred to as a private IP address|
||Allocated to the VM|Allocated to a NIC|
|ILB|Allocated to back end address pool|Allocated to NICs that are part of the backend address pool|
|Internet facing load balancer|Allocated to VMs or role instances in a cloud service|Allocated to NICs that are part of the backend address pool|

**Public IP addresses**
|Resource|classic|Resource Manager|
|---|---|---|
|VM|Referred to as an ILPIP|Referred to as a PIP|
||Allocated to the VM|Allocated to a NIC|
||Can only be dynamic|Can be static or dynamic|
|Internet facing load balancer|Referred to as VIP (dynamic) or Reserved IP (static)|Allocated to the front end IP configuration|
||Allocated to a cloud service|Allocated to the front end IP configuration|

## Next steps

- [Deploy a VM with a static private IP address](virtual-networks-static-private-ip-arm-pportal.md).
- [Deploy a VM with a static public IP](virtual-network-deploy-static-pip-arm-template.md).
