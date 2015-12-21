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
You can assign IP addresses to Azure resources to communicate with other Azure resources, your on-premises network, and the Internet. There are two types of IP addresses you can use in Azure - public and private.

Public IP addresses are used for communication with the Internet, including Azure public-facing services.

Private IP addresses are used for communication within an Azure virtual network (VNet), a cloud service, and your on-premises network when you use a VPN gateway or ExpressRoute circuit to extend your network to Azure.

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-rm-include.md)] [resource manager deployment model](virtual-network-ip-addresses-overview-arm.md).

## Public IP addresses
Public IP addresses allow Azure resources to communicate with Internet and Azure public-facing services such as [Azure Redis Cache](https://azure.microsoft.com/services/cache), [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs), [SQL databases](sql-database-technical-overview.md), and [Azure storage](storage-introduction.md).

A public IP address is associated with the following resource types:

- Cloud services
- IaaS Virtual Machines (VMs)
- PaaS role instances
- VPN gateways
- Application gateways

### Allocation method
When a public IP address needs to be assigned to an Azure resource, it is *dynamically* allocated from a pool of available public IP address within the location the resource is created. This IP address is released when the resource is stopped. In case of a cloud service, this happens when all the role instances are stopped, which can be avoided by using a *static* (reserved) IP address (see Cloud Services below)

>[AZURE.NOTE] The list of IP ranges from which public IP addresses are allocated to Azure resources is published at [Azure Datacenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653).

### DNS hostname resolution
When you create a cloud service or an IaaS VM, you need to provide a cloud service DNS name which is unique across all resources in Azure. This creates a mapping in the Azure-managed DNS servers for *dnsname*.cloudapp.net to the public IP address of the resource. For instance, when you create a cloud service with a cloud service DNS name of **contoso**, the fully-qualified domain name (FQDN) **contoso.cloudapp.net** will resolve to a public IP address (VIP) of the cloud service. You can use this FQDN to create a custom domain CNAME record pointing to the public IP address in Azure.

### Cloud services
A cloud service always has a public IP address referred to as a virtual IP address (VIP). You can create endpoints in a cloud service to associate different ports in the VIP to internal ports on VMs and role instances within the cloud service.

You can assign [multiple VIPs to a cloud service](load-balancer-multivip.md), which enables multi-vip scenarios like multi-tenant environment with SSL-based websites.

You can ensure the public IP address of a cloud service remains the same, even when all the role instances are stopped, by using a *static* public IP address, referred to as [Reserved IP](virtual-networks-reserved-public-ip.md). You can create a static (reserved) IP resource in a specific location and assign it to any cloud service in that location. You cannot specify the actual IP address for the reserved IP, it is allocated from pool of available IP addresses in the location it is created. This IP address is not released until you explicitly delete it.

Static (reserved) public IP addresses are commonly used in the scenarios where a cloud service:

- requires firewall rules to be setup by end-users.
- depends on external DNS name resolution, and a dynamic IP would require updating A records.
- consumes external web services which use IP based security model.
- uses SSL certificates linked to an IP address.

### IaaS VMs and PaaS role instances
You can assign a public IP address to an IaaS [VM](virtual-machines-about.md) or PaaS role instance within a cloud service. This is referred to as an instance-level public IP address ([ILPIP](virtual-networks-instance-level-public-ip.md)). This public IP address can be dynamic only.

### VPN gateways
A [VPN gateway](vpn-gateway-about-vpngateways.md) can be used to connect an Azure VNet to other Azure VNets or on-premises networks. A VPN gateway is assigned a public IP address *dynamically*, which enables communication with the remote network.

### Application gateways
An Azure [Application gateway](application-gateway-introduction.md) can be used for Layer7 load-balancing to route network traffic based on HTTP. Application gateway is assigned a public IP address *dynamically*, which serves as the load-balanced VIP.

### At a glance
The table below shows each resource type with the possible allocation methods (dynamic/static), and ability to assign multiple public IP addresses.

|Resource|Dynamic|Static|Multiple IP addresses|
|---|---|---|---|
|Cloud service|Yes|Yes|Yes|
|IaaS VM or PaaS role instance|Yes|No|No|
|VPN gateway|Yes|No|No|
|Application gateway|Yes|No|No|

## Private IP addresses
Private IP addresses allow Azure resources to communicate with other resources in a cloud service or a [virtual network](virtual-networks-overview.md)(VNet), or to on-premises network (through a VPN gateway or ExpressRoute circuit), without using an Internet-reachable IP address.

In Azure classic deployment model, a private IP address is assigned to various Azure resources.

- IaaS VMs and PaaS role instances
- Internal load balancer
- Application gateway

### IaaS VMs and PaaS role instances
Virtual machines (VMs) created with the classic deployment model are always placed in a cloud service, similar to PaaS role instances. The behavior of private IP addresses are thus similar for these resources.

It is important to note that a cloud service can be deployed in two ways:

1. As a *standalone* cloud service, where it is not within a virtual network
2. As part of a virtual network

#### Allocation method
In case of a *standalone* cloud service, resources get a private IP address allocated *dynamically* from the Azure datacenter private IP address range. It can be used only for communication with other VMs within the same cloud service. This IP address can change when the resource is stopped and started.

In case of a cloud service deployed within a virtual network, resources get private IP address(es) allocated from the address range of the associated subnet(s) (as specified in its network configuration). This private IP address(es) can be used for communication between all VMs within the VNet.

Additionally, in case of cloud services within a VNet, a private IP address is allocated *dynamically* (using DHCP) by default. It can change when the resource is stopped and started. To ensure the IP address remains the same, you need to set the allocation method to *static*, and provide a valid IP address within the corresponding address range.

 Static private IP addresses are commonly used for:

 - VMs that act as domain controllers or DNS servers.
 - VMs that require firewall rules using IP addresses.
 - VMs running services accessed by other apps through an IP address.

#### Internal DNS hostname resolution
All Azure VMs and PaaS role instances are configured with [Azure-managed DNS servers](virtual-networks-name-resolution-for-vms-and-role-instances.md#azure-provided-name-resolution) by default, unless you explicitly configure custom DNS servers. These DNS servers provide internal name resolution for VMs and role instances that reside within the same VNet or cloud service.

When you create a VM, a mapping for the hostname to its private IP address is added to the Azure-managed DNS servers. In case of a multi-NIC VM, the hostname is mapped to the private IP address of the primary NIC. However, this mapping information is restricted to resources within the same cloud service or VNet.

In case of a *standalone* cloud service, you will be able to resolve hostnames of all VMs/role instances within the same cloud service only. In case of a cloud service within a VNet, you will be able to resolve hostnames of all the VMs/role instances within the VNet.

### Internal load balancers (ILB) & Application gateways
You can assign a private IP address to the **front end** configuration of an [Azure Internal Load Balancer](load-balancer-internal-overview.md) (ILB) or an [Azure Application Gateway](application-gateway-introduction.md). This private IP address serves as an internal endpoint, accessible only to the resources within its virtual network (VNet) and the remote networks connected to the VNet. You can assign either a dynamic or static private IP address to the front end configuration. You can also assign multiple private IP addresses to enable multi-vip scenarios.

### At a glance
The table below shows each resource type with the possible allocation methods (dynamic/static), and ability to assign multiple private IP addresses.

|Resource|Dynamic|Static|Multiple IP addresses|
|---|---|---|---|
|VM (in a *standalone* cloud service)|Yes|Yes|Yes|
|PaaS role instance (in a *standalone* cloud service)|Yes|No|Yes|
|VM or PaaS role instance (in a VNet)|Yes|Yes|Yes|
|Internal load balancer front end|Yes|Yes|Yes|
|Application gateway front end|Yes|Yes|Yes|

## Next steps
- [Deploy a VM with a static public IP](virtual-network-deploy-static-pip-classic-ps.md)
- [Deploy a VM with a static private IP address](virtual-networks-static-private-ip-classic-pportal.md)
- [Create a load balancer using PowerShell](load-balancer-get-started-internet-classic-cli.md)
- [Create an internal load balancer using PowerShell](load-balancer-get-started-ilb-classic-ps.md)
- [Create an application gateway using PowerShell](application-gateway-create-gateway.md)
- [Create an internal application gateway using PowerShell](application-gateway-ilb.md)
