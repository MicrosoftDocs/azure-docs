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
You can assign IP addresses to Azure resources to communicate with other Azure resources, your on-premises network, and the Internet. There are two types of IP addresses you can use in Azure: public and private.

Public IP addresses are used for communication with the Internet, including Azure public-facing services.

Private IP addresses are used for communication within an Azure virtual network (VNet), and your on-premises network when you use a VPN gateway or ExpressRoute circuit to extend your network to Azure. 

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-rm-include.md)] [classic deployment model](virtual-network-ip-addresses-overview-classic.md).

## Public IP addresses
You assign public IP addresses to allow Azure resources to communicate with Internet and Azure public-facing services such as [Azure Redis Cache](https://azure.microsoft.com/services/cache), [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs), [SQL databases](sql-database-technical-overview.md), and [Azure storage](storage-introduction.md).

In Azure Resource Manager, a [public IP](resource-groups-networking.md#public-ip-address) address is a resource that has its own properties, and can be associated with any of the following resources:

- VMs
- VPN gateways
- Internet facing load balancers
- Application gateways

### Allocation methods
You can use *dynamic* or *static* public IP addresses. In the default allocation method, which is *dynamic*, an IP address is **not** assigned to the public IP resource during creation. Instead, the public IP resource has an IP address allocated based on the [Azure location](https://www.microsoft.com/download/details.aspx?id=41653) it is a part of when the resource associated to the public IP is created or started. Furthermore, the actual IP address used by a public IP may change when the associated resource is deleted or stopped.

If you want to ensure the IP address for your resource remains the same, you have to change the allocation method to *static*. Static public IP addresses are commonly used in the following scenarios:

- Use of SSL certificates linked to an IP address.
- Resources that require firewall rules setup for outside Azure.
- Resources that depend on external DNS name resolution, where a dynamic IP would require updating A records.
- Resources running services accessed by other apps by using an IP address.

>[AZURE.NOTE] Even when you configured a public IP to use a static IP address, you cannot specify the actual IP address used by your resource. Your resource will get an IP address based on the [Azure location](https://www.microsoft.com/download/details.aspx?id=41653) your resource is created in.  

### DNS hostname resolution
You can associate a public IP with a DNS domain name label, which creates a corresponding DNS entry in the Azure DNS servers. The corresponding FQDN will have the format *domainnamelabel*.*location*.cloudapp.azure.com, and will be associated to the public IP linked to your resource. For instance, if you create a public IP with a *domainnamelabel* of **azuretest** in the *West US* Azure region, the FQDN for the resource associated to the public IP will be **azuretest.westus.cloudapp.azure.com**.

>[AZURE.IMPORTANT] Each domain name label created must be unique within its Azure location.  

You can later create CNAME records using your own custom domain name that point to the FQDN used in Azure.

### VMs
You **cannot** assign a public IP directly to a [VM](virtual-machines-about.md). Instead, you create a NIC and associate the public IP to the NIC, and the NIC to the VM. Although VMs can be assigned multiple NICs, only the **primary** NIC can have a public IP associated to it. 

You can assign either a dynamic or a static public IP address to the primary NIC of a VM.

### VPN gateways
You can use a [VPN gateway](vpn-gateway-about-vpngateways.md) to connect an Azure VNet to other Azure VNets or your on-premises network. A VPN gateway requires a public IP to communicate with the network you trying to connect to. 

At this moment, you can only assign a dynamic public IP address to a VPN gateway.

### Internet facing load balancers
You can use an Internet-facing [load balancer](load-balancer-overview.md) to balance the load of an application across multiple VMs using a single public IP address, along with other features available to common level 4 load balancers. 

You can assign a public IP address to the front end of an internet facing load balancer. You can assign either a dynamic or static public IP address to an Internet facing load balancer.

### Application gateways
You can use an [application gateway](application-gateway-introduction.md) to balance the load of an application across multiple VMs using a single public IP address, in a similar way you use load balancers. However, application gateways also allow you to create routing rules to further spread traffic across VMs based on the URL users request, among other features provided by a regular level 7 load balancer. 

You can assign a public IP to the frontend of an application gateway. At this moment, you can only assign a dynamic public IP address to a VPN gateway.

### At-a-glance

The table below shows what resources can use dynamic or static public IP addresses, and multiple public IP addresses.

|Resource|Dynamic|Static|Multiple IP addresses|
|---|---|---|---|
|Virtual Machine (VM)/Network Interface Card (NIC)|Yes|Yes|No|
|VPN gateway|Yes|No|No|
|Load balancer front end|Yes|Yes|Yes|
|Application gateway front end|Yes|No|No|

## Private IP addresses
You assign private IP addresses to allow Azure resources to communicate to other resources in your [VNet](virtual-networks-overview.md), or to your on-premises network through a VPN gateway or ExpressRoute circuit. Each VNet you create will use a range of private IP addresses that you specify. Resources in a VNet must use a private IP address that is part of this range. 

In Azure Resource Manager, a private IP address is a property that can be used in different resources.

- VMs by using network interfaces (NICs)
- Internet facing load balancers
- Internal load balancers (ILBs)
- Application gateways 

### Allocation methods
You can use *dynamic* or *static* private IP addresses. In the default allocation method, which is *dynamic*, an IP address is automatically assigned to a resource based on the subnet the resource is a part of. However, the IP address used by the resource may change when the resource is stopped and restarted.

If you want to ensure the IP address for your resource remains the same, you have to change the allocation method to *static* and specify a valid IP address that is part of the range of addresses assigned to the subnet the resource is part of. 

Static private IP addresses are commonly used for:

- VMs that act as DNS servers.
- VMs that act as domain controllers.
- VMs that require firewall rules using IP addresses.
- VMs running services accessed by other apps by using an IP address.

### Internal DNS hostname resolution
Most communication between Azure resources is done by using a human readable name to represent the resource, instead of an IP address. This name is referred to as a *hostname*, a term commonly understood by networking professionals. When a resource is trying to access another resource by using a hostname, the hostname must be resolved to an IP address. This is usually done by a [DNS server](https://technet.microsoft.com/magazine/2005.01.howitworksdns.aspx).

All Azure VMs use [Azure-managed DNS servers](virtual-networks-name-resolution-for-vms-and-role-instances.md#azure-provided-name-resolution), unless you create your own DNS server and configure your VMs to use it. In case of using Azure-managed DNS servers, a DNS record is created automatically to resolve the VM's hostname to the private IP address of the VM. In case of a multi-NIC VM, the hostname resolves to private IP address of the primary NIC.

### VMs
You cannot assign a private IP directly to a [VM](virtual-machines-about.md). Instead, you create a NIC and associate the NIC to the VM. Each NIC has its own **privateIPAddress** property that must have a valid IP address for the subnet which the NIC is assigned to. VMs can have [multiple NICs](virtual-networks-multiple-nics.md).

You can assign either a dynamic or static IP address to NICs used by a VM.

### Internet facing load balancers
You can use an Internet-facing [load balancer](load-balancer-overview.md) to balance the load of an application across multiple VMs using a single public IP address, along with other features available to common level 4 load balancers. 

You can associate NICs assigned to VMs to the backend pool of a load balancer to use the VMs as destination for load balanced traffic. You can also associate NICs to the inbound NAT rules of a load balancer to provide NAT rules that allow direct access to the VMs behind a load balancer. 

When you associate NICs to an internet facing load balancer, traffic that applies to the NAT rules or load balancing rules in the load balancer is forwarded to the private IP address of the corresponding NIC. 

You can assign either a dynamic or static IP address to NICs associated to an Internet facing load balancer.

###Internal load balancer (ILB)
You can use an [internal load balancer](load-balancer-internal-overview.md) to balance the load of an application across multiple VMs using a single private IP address in your subnet. For instance, you can have multiple VMs hosting the same database, and decide to spread database connections coming from your VNet to these VMs. You can do so by using an itnernal load balancer.

Similarly to public facing load balancers, you can associate NICs assigned to VMs to the backend pool of a load balancer to use the VMs as destination for load balanced traffic. You can also associate NICs to the inbound NAT rules of a load balancer to provide NAT rules that allow direct access to the VMs behind a load balancer. You can also associate a private IP address to the frontend of an ILB. 

You can assign either a dynamic or static private IP address to the frontend, and backend NICs, of an internal load balancer.

###Application gateway
You can use an [application gateway](application-gateway-introduction.md) to balance the load of an application across multiple VMs using a single private IP address, creating an internal application gateway. 

You can associate NICs assigned to VMs to the backend address pool of an application gateway to use the VMs as destination for load balanced traffic. You can assign either a dynamic or static private IP address to a NIC.

You can associate a private IP address to the frontend of an application gateway. You can assign either a dynamic or static private IP address to an application gateway.

### At-a-glance
The table below shows what resources can use dynamic or static private IP addresses, and multiple private IP addresses.

|Resource|Static|Dynamic|Multiple IP addresses|
|---|---|---|---|
|Virtual Machine (VM)/Network Interface Card (NIC)|Yes|Yes|Yes|
|Internal Load balancer front end|Yes|Yes|Yes|
|Application gateway front end|Yes|Yes|Yes|

## Differences between Resource Manager and classic deployments
If you are familiar with the classic deployment model, and new to Resource Manager, you can quickly understand with changes in Resource Manager by checking the differences listed below.

###Private IP addresses

|Resource|classic|Resource Manager|
|---|---|---|
|VM|Referred to as a DIP|Referred to as a private IP address|
||Allocated to the VM|Allocated to a NIC|
|ILB|Allocated to back end address pool|Allocated to NICs that are part of the backend address pool|
|Internet facing load balancer|Allocated to VMs or role instances in a cloud service|Allocated to NICs that are part of the backend address pool|

###Public IP addresses

|Resource|classic|Resource Manager|
|---|---|---|
|VM|Referred to as an ILPIP|Referred to as a public IP|
||Allocated to the VM|Allocated to a NIC|
||Can only be dynamic|Can be static or dynamic|
|Internet facing load balancer|Referred to as VIP (dynamic) or Reserved IP (static)|Allocated to the front end IP configuration|
||Allocated to a cloud service|Allocated to the front end IP configuration|

## Next steps

- [Deploy a VM with a static public IP](virtual-network-deploy-static-pip-arm-template.md)
- [Create a public IP address for an Internet facing load balancer by using the Azure CLI](load-balancer-get-started-internet-arm-cli.md#create-a-virtual-network-and-a-public-ip-address-for-the-front-end-ip-pool)
- [Create a public IP address for an application gateway by using PowerShell](application-gateway-create-gateway-arm.md#create-public-ip-address-for-front-end-configuration)
- [Create a public IP address for a VPN gateway by using PowerShell](vpn-gateway-create-site-to-site-rm-powershell.md#4-request-a-public-ip-address-for-the-gateway)
- [Deploy a VM with a static private IP address](virtual-networks-static-private-ip-arm-pportal.md)
- [Create a front end static private IP address for an internal load balancer by using PowerShell](load-balancer-get-started-ilb-arm-ps.md#create-front-end-ip-pool-and-backend-address-pool)
- [Create a backend pool with static private IP addresses for an application gateway by using PowerShell](application-gateway-create-gateway-arm.md#create-an-application-gateway-configuration-object)