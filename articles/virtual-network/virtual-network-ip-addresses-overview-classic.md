<properties
   pageTitle="Public and private IP addressing (classic) in Azure | Microsoft Azure"
   description="Learn about public and private IP addressing in Azure"
   services="virtual-network"
   documentationCenter="na"
   authors="telmosampaio"
   manager="carmonm"
   editor="tysonn" 
   tags="azure-service-management" />
<tags
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="12/14/2015"
   ms.author="telmos" />

# IP addresses (classic) in Azure
You can assign IP addresses to Azure resources to provide communication to other Azure resources, your on-premises network, and the Internet. There are two types of IP addresses you can use in Azure: public and private.

Public IP addresses are used for communication with the Internet, including Azure public-facing services.

Private IP addresses are used for communication within an Azure virtual network (VNet) or cloud service, and your on-premises network when you use a VPN gateway or ExpressRoute circuit to extend your network to Azure. 

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-rm-include.md)] [resource manager deployment model](virtual-network-ip-addresses-overview-arm.md).

## Public IP addresses
You assign public IP addresses to allow Azure resources to communicate with Internet services, including Azure public-facing services like [Azure Redis Cache](https://azure.microsoft.com/services/cache), [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs), [SQL databases](sql-database-technical-overview.md), and [Azure storage](storage-introduction.md). 

You can assign a public IP address to any of the following resources:

- Cloud services
- VMs
- PaaS role instances
- VPN gateways
- Application gateways

### Allocation methods
You can use *dynamic* or *static* public IP addresses. In the default allocation method, which is *dynamic*, an IP address is automatically assigned to a resource based on the [Azure location](https://www.microsoft.com/download/details.aspx?id=41653) it is a part of. However, the IP address used by the resource may change when the resource is deleted or stopped.

If you want to ensure the IP address for your resource remains the same, you have to change the allocation method to *static*. Unlike private IP addresses, you cannot specify what IP address you want to use. Static IP addresses are allocated based on available addresses from the range of addresses used by Azure. A static IP address is referred to as a [Reserved IP](virtual-networks-reserved-public-ip.md).

If you want to ensure the IP address for your resource remains the same, you have to change the allocation method to *static*. Static public IP addresses are commonly used in the following scenarios:

- Use of SSL certificates linked to an IP address.
- Resources that require firewall rules setup outside Azure.
- Resources that depend on external DNS name resolution, where a dynamic IP would require updating A records.
- Resources running services accessed by other apps by using an IP address.

>[AZURE.NOTE] Even when you configured a static public IP (Reserved IP), you cannot specify the actual IP address used by your resource. Your resource will get an IP address based on the [Azure location](https://www.microsoft.com/download/details.aspx?id=41653) it is created in.  

### DNS hostname resolution
You can associate a public IP address with a DNS domain name label, which creates a corresponding DNS entry in the Azure DNS servers. The corresponding FQDN will have the format *domainnamelabel*.*location*.cloudapp.azure.com, and will be associated to the public IP linked to your resource. For instance, if you create a public IP with a *domainnamelabel* of **azuretest** in the *West US* Azure region, the FQDN for the resource associated to the public IP will be **azuretest.westus.cloudapp.azure.com**.

>[AZURE.IMPORTANT] Each domain name label created must be unique within its Azure location.  

You can later create CNAME records using your own custom domain name that point to the domain label name you create in Azure.

###Cloud services 
A cloud service always has a public facing IP address that is referred to as a VIP. You can create endpoints in a cloud service to associated different ports in the VIP to internal ports on VMs and role instances within the cloud service.

###VMs and PasS role instances
You can associate a public IP address to an individual [VM](virtual-machines-about.md) or PaaS role instance within a cloud service. That type of public IP is referred to as an instance-level public IP address ([ILPIP](virtual-networks-instance-level-public-ip.md)).

You can only assign dynamic public IP addresses to VMs and PaaS instance roles.

###VPN gateways
You can use a [VPN gateway](vpn-gateway-about-vpngateways.md) to connect an Azure VNet to other Azure VNets or your on-premises network. A VPN gateway requires a public IP to communicate with the network you trying to connect to. 

You can only assign a dynamic public IP address to a VPN gateway.

###Application gateways
You can use an [application gateway](application-gateway-introduction.md) to balance the load of an application across multiple VMs using a single public IP address, in a similar way you use load balancers. However, application gateways also allow you to create routing rules to further spread traffic across VMs based on the URL users request, among other features provided by a regular level 7 load balancer. 

You can assign a public IP to the frontend of an application gateway. At this moment, you can only assign a dynamic public IP address to a VPN gateway.

### At a glance
The table below shows what resources can use static and dynamic public IP addresses.

|Resource|Dynamic|Static|Multiple IP addresses|
|---|---|---|---|
|VM|Yes|No|No|
|Cloud service (including load balancer front end)|Yes|Yes|Yes|
|Application gateway (in a cloud service)|Yes|No|No|
|VPN gateway|Yes|No|No|

## Private IP addresses
You assign private IP addresses to allow Azure resources to communicate with other resources in your VNet or cloud service, or even to your on-premises network through a VPN gateway or ExpressRoute circuit. Each VNet or cloud service you create will use a range of pre-defined private IP addresses. Resources in a VNet or cloud service must use a private IP address that is part of this range. 

In Azure, a private IP address can be assigned to different resources.

- VMs and role instances
- Internal load balancer
- Application gateway 

>[AZURE.NOTE] You can create a cloud service isolated from any other Azure resource you have, or add a cloud service to an existing VNet to allow communication with other Azure resources.

### Allocation methods
You can use *dynamic* or *static* private IP addresses. In the default allocation method, which is *dynamic*, an IP address is automatically assigned to a resource based on the subnet or cloud service the resource is a part of. However, the IP address used by the resource may change when the resource is stopped and restarted.

If you want to ensure the IP address for your resource remains the same, you have to change the allocation method to *static* and specify a valid IP address that is part of the range of addresses assigned to the subnet the resource is part of. 

Static private IP addresses are commonly used for:

- VMs that act as DNS servers.
- VMs that act as domain controllers.
- VMs that require firewall rules using IP addresses.
- VMs running services accessed by other apps by using an IP address.

>[AZURE.IMPORTANT] You can only set a static private IP address for resources that are assigned to a VNet.

### Internal DNS hostname resolution
Most communication between Azure resources is done by using a human readable name to represent the resource, instead of an IP address. This name is referred to as a *hostname*, a term commonly understood by networking professionals. When a resource is trying to access another resource by using a hostname, the hostname must be resolved to an IP address. This is usually done by a [DNS server](https://technet.microsoft.com/magazine/2005.01.howitworksdns.aspx).

All Azure VMs use [Azure-managed DNS servers](virtual-networks-name-resolution-for-vms-and-role-instances.md#azure-provided-name-resolution), unless you create your own DNS server and configure your VMs to use it. In case of using Azure-managed DNS servers, a DNS record is created automatically to resolve the VM's hostname to the private IP address of the VM. In case of a multi-NIC VM, the hostname resolves to private IP address of the primary NIC.

###VMs and role instances
You can create VMs and role instances with one or more NICs. Each NIC has its own private IP address. 

###Internal load balancers (ILBs)
You can use an [internal load balancer](load-balancer-internal-overview.md) to balance the load of an application across multiple VMs using a single private IP address in your subnet. For instance, you can have multiple VMs hosting the same database, and decide to spread database connections coming from your VNet to these VMs. You can do so by using an itnernal load balancer.

You can associate private IP address to the backend pool of an internal load balancer to use the VMs or role instances associated to those IP addresses as destination for load balanced traffic. You can also associate a private IP address to the frontend of an ILB. 

You can assign either a dynamic or static private IP address to the frontend, and backend pool of an internal load balancer.

###Application gateways
You can use an [application gateway](application-gateway-introduction.md) to balance the load of an application across multiple VMs using a single private IP address, creating an internal application gateway. 

You can associate private IP addresses to the backend address pool of an application gateway to use the VMs associated to those IP addresses as destination for load balanced traffic. You can assign either a dynamic or static private IP address to the backend address pool of an application gateway.

You can associate a private IP address to the frontend of an application gateway. You can assign either a dynamic or static private IP address to an application gateway.

### At a glance
The table below shows what resources can use static and dynamic private IP addresses.

|Resource|Dynamic|Static|Multiple IP addresses|
|---|---|---|---|
|VM|Yes|Yes|Yes|
|PaaS role instance|Yes|No|No|
|Internal load balancer front end|Yes|Yes|Yes|
|Application gateway front end|Yes|Yes|No|
|Application gateway backend end|No|Yes|Yes|

## Next steps

- [Deploy a VM with a static public IP](virtual-network-deploy-static-pip-classic-ps.md)
- [Deploy a VM with a static private IP address](virtual-networks-static-private-ip-classic-pportal.md)
- [Create a an internal load balancer by using PowerShell](load-balancer-get-started-ilb-classic-ps.md)
- [Create an internal application gateway by using PowerShell](application-gateway-create-gateway.md)
