---
title: Private IP addresses in Azure
titlesuffix: Azure Virtual Network
description: Learn about private IP addresses in Azure.
author: mbender-ms
ms.author: mbender
ms.date: 11/05/2024
ms.service: azure-virtual-network
ms.subservice: ip-services
ms.topic: concept-article
---

# Private IP addresses

Private IPs allow communication between resources in Azure. 

Resources can be:

* Azure services such as:
    
    * Virtual machine network interfaces
    
    * Internal load balancers (ILBs)
    
    * Application gateways

* In a [virtual network](../../virtual-network/virtual-networks-overview.md).

* On-premises network through a VPN gateway or ExpressRoute circuit.

Private IPs allow communication to these resources without the use of a public IP address.

## Allocation method

Azure assigns private IP addresses to resources from the address range of the virtual network subnet where the resource is.

Azure reserves the first four addresses in each subnet address range. The addresses can't be assigned to resources. For example, if the subnet's address range is 10.0.0.0/16, addresses 10.0.0.0-10.0.0.3 and 10.0.255.255 are unavailable. IP addresses within the subnet's address range can only be assigned to one resource at a time. 

There are two methods in which a private IP address is given:

### Dynamic allocation

Azure assigns the next available unassigned or unreserved IP address in the subnet's address range. While this is normally the next sequentially available address, there's no guarantee that the address will be the next one in the range. For example, if addresses 10.0.0.4-10.0.0.9 are already assigned to other resources, the next IP address assigned is most likely 10.0.0.10. However, it could be any address between 10.0.0.10 and 10.0.0.254. If a specific Private IP address is required for a resource, you should use a static private IP address.

A private IP address prefix allocation is only successful when the full unallocated block of IP addresses is available. For example, only a valid /28 IPv4 address block will result in a successful prefix allocation.

Dynamic is the default allocation method. Once assigned, dynamic IP addresses are released if a network interface is:

* Deleted

* Reassigned to a different subnet within the same virtual network.

* The allocation method is changed to static, and a different IP address is specified. 

By default, Azure assigns the previous dynamically assigned address as the static address when you change the allocation method from dynamic to static.

### Static allocation

With static allocation, you select and assign any unassigned or unreserved IP address in the subnet's address range. 

For example, a subnet's address range is 10.0.0.0/16 and addresses 10.0.0.4-10.0.0.9 are assigned to other resources. You can assign any address between 10.0.0.10 - 10.0.255.254. Static addresses are only released if a network interface is deleted. 

Azure assigns the static IP as the dynamic IP when the allocation method is changed. The reassignment occurs even if the address isn't the next available in the subnet. The address changes when the network interface is assigned to a different subnet.

To assign the network interface to a different subnet, you change the allocation method from static to dynamic. Assign the network interface to a different subnet, then change the allocation method back to static. Assign an IP address from the new subnet's address range.

> [!NOTE]
> When requesting a private IP address, the allocation is not deterministic or sequential. There are no guarantees the next allocated IP address will utilize the next sequential IP address or use previously deallocated addresses. If a specific Private IP address is required for a resource, you should consider using a static private IP address.
    
## Virtual machine network interfaces

One or more private IP addresses are assigned to one or more **network interfaces** of a Virtual Machine. Network interfaces are assigned to a [Windows](/azure/virtual-machines/windows/overview?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](/azure/virtual-machines/linux/overview?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine, and enable connectivity with other resources within and outside the Virtual Network. 

Network interfaces are configured with private IP addresses for communication within the Azure virtual network and other Azure resources, and can optionally be configured with public IP addresses for communication outside the Azure (e.g. Internet, customer on-premises).
A network interface has one primary IP configuration associated with them and an option to attach zero or more secondary private IP configurations. For the total count of private IP configurations on a network interface allowed in your subscription, see [Azure limits](../../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits). The primary IP configuration on the network interface must have a single IP address (a /32 IPv4 address or a /128 IPv6 address) attached to it, while the secondary IP configurations can have either a single IP address or a block of IP addresses (*in preview*) attached to them. The only allowed blocks are IPv4 addresses of size /28 today.

You can specify the allocation method as either dynamic or static for each private IP address.

### Internal DNS hostname resolution (for virtual machines)

Azure virtual machines are configured with [Azure-managed DNS servers](../../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#azure-provided-name-resolution) by default. You can explicitly configure custom DNS servers. These DNS servers provide internal name resolution for virtual machines that are within the same virtual network.

A mapping for the hostname to a virtual machine's private IP address is added to the Azure-managed DNS servers. 

A hostname is mapped to the primary IP of the main network interface when a VM has:

* Multiple network interfaces

* Multiple IP addresses

* Both

VMs configured with Azure-managed DNS resolve the hostnames within the same virtual network. Use a custom DNS server to resolve host names of VMs in connected virtual networks.

## Internal load balancers (ILB) & Application gateways

You can assign a private IP address to the **front-end** configuration of an:

* [Azure internal load balancer](../../load-balancer/load-balancer-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) (ILB)

* [Azure Application Gateway](../../application-gateway/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) 

This private IP address serves as an internal endpoint. The internal endpoint is accessible only to the resources within its virtual network and the remote networks connected to it. A dynamic or static IP can be assigned.

## At-a-glance
The following table shows the property through which a private IP can be associated to a resource. 

The possible allocation methods that can be used are also displayed:

* Dynamic

* Static

| Top-level resource | IP address association | Dynamic | Static |
| --- | --- | --- | --- |
| Virtual machine |Network interface |Yes |Yes |
| Load balancer |Front-end configuration |Yes |Yes |
| Application gateway |Front-end configuration |Yes |Yes |

## Limits
The limits on IP addressing are found in the full set of [limits for networking](../../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-networking-limits) in Azure. The limits are per region and per subscription. [Contact support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to increase the default limits up to the maximum limits based on your business needs.

## Next steps

* Learn about [Public IP Addresses in Azure](public-ip-addresses.md)

* [Deploy a VM with a static private IP address using the Azure portal](./virtual-networks-static-private-ip-arm-pportal.md)

* [Deploy a VM that uses private IP address blocks for a larger scale using the Azure portal](./virtual-network-private-ip-address-blocks-portal.md)
