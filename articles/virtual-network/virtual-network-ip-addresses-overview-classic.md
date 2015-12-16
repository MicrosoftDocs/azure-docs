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
You can assign IP addresses to different Azure resources to provide communication to other Azure resources, your on-premises network, and the public Internet. Private IP addresses are used for communication within an Azure virtual network (VNet) or cloud service, and even your on-premises network when you use a VPN gateway or ExpressRoute circuit to extend your network to Azure. Public IP addresses are used for communication with the public Internet, including Azure public facing services.

You can assign IP addresses to different Azure resources including:
- [Cloud services](cloud-services-choose-me.md)
- IaaS virtual machines ([VMs](virtual-machines-about.md))
- PaaS [role instances](cloud-services-choose-me.md/#tellmecs)
- [VPN gateways](vpn-gateway-about-vpngateways.md)
- [Application gateways](application-gateway-introduction.md)
- [Load balancers](load-balancer-overview.md)

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-rm-include.md)] [resource manager deployment model](virtual-network-ip-addresses-overview-arm.md).

In the classic deployment model, public IP addresses are associated to application gateways and public facing load balancers through a cloud service. 

## Public IP addresses
You assign public IP addresses to allow Azure resources to communicate with Internet services, including Azure public-facing services like [Azure Redis Cache](https://azure.microsoft.com/services/cache), [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs), [SQL databases](sql-database-technical-overview.md), and [Azure storage](storage-introduction.md). You can assign a public IP address to any of the following resources:

- Cloud services
- VMs
- PaaS role instances
- VPN gateways
- Application gateways

**Cloud services** 
A cloud service always has a public facing IP address that is referred to as a VIP. You can create endpoints in a cloud service to associated different ports in the VIP to internal ports on VMs and role instances within the cloud service.

**VMs and PasS role instances**
You can associate a public IP address to an individual VM or PaaS role instance within a cloud service. That type of public IP is referred to as an instance-level public IP address ([ILPIP](virtual-networks-instance-level-public-ip.md)).

**VPN gateways**
You can associate a VPN gateway to a public IP address to create a VPN connection between you Azure VNets, or between an Azure VNet and you on-premises network. [Create a site-to-site VPN connection](vpn-gateway-site-to-site-create.md) to learn more about associating a public IP address to VPN gateways.

**Application gateway**
You can associate the **frontendIPConfigurations** property of an application gateway to a public IP, creating an internet facing application gateway.

### Allocation methods
You can use *dynamic* or *static* public IP addresses. In the default allocation method, which is *dynamic*, an IP address is automatically assigned to a resource based on the [Azure location](https://www.microsoft.com/download/details.aspx?id=41653) it is a part of. However, the IP address used by the resource may change when the resource is deleted or stopped.

If you want to ensure the IP address for your resource remains the same, you have to change the allocation method to *static*. Unlike private IP addresses, you cannot specify what IP address you want to use. Static IP addresses are allocated based on available addresses from the range of addresses used by Azure. A static IP address is referred to as a [Reserved IP](virtual-networks-reserved-public-ip.md).

Static IP addresses are commonly used for cloud services and VMs in the following scenarios:
- Use of SSL certificates linked to an IP address.
- Resources that require firewall rules setup outside Azure.
- Resources that depend on external DNS name resolution, where a dynamic IP would require updating A records.
- Resources running services accessed by other apps by using an IP address.

>[AZURE.NOTE] Even when you configured a static public IP (Reserved IP), you cannot specify the actual IP address used by your resource. Your resource will get an IP address based on the [Azure location](https://www.microsoft.com/download/details.aspx?id=41653) your resource is created in.  

### DNS hostname resolution
You can associate a public IP address with a DNS domain name label, which creates a corresponding DNS entry in the Azure DNS servers. The corresponding FQDN will have the format *domainnamelabel*.*location*.cloudapp.azure.com, and will be associated to the public IP linked to your resource. For instance, if you create a public IP with a *domainnamelabel* of **azuretest** in the *West US* Azure region, the FQDN for the resource associated to the public IP will be **azuretest.westus.cloudapp.azure.com**.

>[AZURE.IMPORTANT] Each domain name label created in the public Internet must be unique.  

You can later create CNAME records using your own custom domain name that point to the domain label name you create in Azure.

### At a glance
The table below shows what resources can use static and dynamic public IP addresses.

|Resource|Dynamic|Static|Multiple IP addresses|
|---|---|---|---|
|VM|Yes|No|No|
|Cloud service (including load balancer front end)|Yes|Yes|Yes|
|Application gateway (in a cloud service)|Yes|No||
|VPN gateway|Yes|No|No|

>[AZURE.NOTE]Cloud services can contain VMs, PaaS role instances, a load balancer, or an application gateway. 

## Private IP addresses
You assign private IP addresses to allow Azure resources to communicate to other resources in your VNet or cloud service, or even to your on-premises network through a VPN gateway or ExpressRoute circuit. Each VNet or cloud service you create will use a range of pre-defined private IP addresses. Resources in a VNet or cloud service must use a private IP address that is part of this range. 

In Azure, a private IP address is a property that can be used in different resources.

- [VMs and role instances](virtual-machines-about.md)
- [Internal load balancer](resource-groups-networking.md/#load-balancer)
- [Application gateway](resource-groups-networking.md/#application-gateway) 

>[AZURE.NOTE] You can create a cloud service isolated from any other Azure resource you have, or add a cloud service to an existing VNet to allow communication with other Azure resources.

**VMs and role instances**
You can create VMs with one or more NICs. Each NIC has its own private IP address. [Deploy a VM with a static private IP](virtual-networks-static-private-ip-classic-ps.md) to learn more about private IP addressing.

**Internal load balancer (ILB)**
You can associate a private IP address to the front end of an application gateway. [Deploy an internal load balancer](load-balancer-get-started-ilb-classic-ps.md) to learn more about using private IP addresses with ILB.

**Application gateway**
You can associate private IP addresses to the **BackendAddressPool** property of an application gateway. You can also associate a private IP address to the front end of an applciation gateway, creating an internal application gateway. [Deploy an internal application gateway](application-gateway-create-gateway.md) to learn more about private IP addresses in an application gateway. 

### Allocation methods
You can use *dynamic* or *static* private IP addresses. In the default allocation method, which is *dynamic*, an IP address is automatically assigned to a resource based on the subnet or cloud service the resource is a part of. However, the IP address used by the resource may change when the resource is stopped and restarted.

If you want to ensure the IP address for your resource remains the same, you have to change the allocation method to *static* and specify a valid IP address that is part of the range of addresses assigned to the subnet the resource is part of. Static IP addresses are commonly used for VMs that act as DNS servers, or domain controllers.

>[AZURE.IMPORTANT] You can only set a static private IP address for resources that are assigned to a VNet.

### Internal DNS hostname resolution
Most communication between Azure resources is done by using a human readable name to represent the resource, instead of an IP address. This name is referred to as a *hostname*, a term commonly understood by networking professionals. When a resource is trying to access another resource by using a hostname, the hostname must be resolved to an IP address. This is usually done by a [DNS server](https://technet.microsoft.com/magazine/2005.01.howitworksdns.aspx).

All Azure VMs use [Azure-managed DNS servers](virtual-networks-name-resolution-for-vms-and-role-instances.md#azure-provided-name-resolution), unless you create your own DNS server and configure your VMs to use it. In case of using Azure-managed DNS servers, a DNS record is created automatically to resolve the VM's hostname to the private IP address of the VM. In case of a multi-NIC VM, the hostname resolves to private IP address of the primary NIC.

### At a glance
The table below shows what resources can use static and dynamic private IP addresses.

|Resource|Dynamic|Static|Multiple IP addresses|
|---|---|---|---|
|VM|Yes|Yes|Yes|
|PaaS role instance|Yes|No|No|
|Internal load balancer front end|Yes|Yes|Yes|
|Application gateway front end|Yes|Yes|No|

## Next steps

- [Deploy a VM with a static private IP address](virtual-networks-static-private-ip-classic-pportal.md).
