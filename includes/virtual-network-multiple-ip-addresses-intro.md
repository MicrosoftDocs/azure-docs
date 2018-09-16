---
 title: include file
 description: include file
 services: virtual-network
 author: jimdial
 ms.service: virtual-network
 ms.topic: include
 ms.date: 04/09/2018
 ms.author: jdial
 ms.custom: include file

---

> [!div class="op_single_selector"]
> * [Azure portal](../articles/virtual-network/virtual-network-multiple-ip-addresses-portal.md)
> * [PowerShell](../articles/virtual-network/virtual-network-multiple-ip-addresses-powershell.md)
> * [Azure CLI](../articles/virtual-network/virtual-network-multiple-ip-addresses-cli.md)
>

An Azure Virtual Machine (VM) has one or more network interfaces (NIC) attached to it. Any NIC can have one or more static or dynamic public and private IP addresses assigned to it. Assigning multiple IP addresses to a VM enables the following capabilities:

* Hosting multiple websites or services with different IP addresses and SSL certificates on a single server.
* Serve as a network virtual appliance, such as a firewall or load balancer.
* The ability to add any of the private IP addresses for any of the NICs to an Azure Load Balancer back-end pool. In the past, only the primary IP address for the primary NIC could be added to a back-end pool. To learn more about how to load balance multiple IP configurations, read the [Load balancing multiple IP configurations](../articles/load-balancer/load-balancer-multiple-ip.md?toc=%2fazure%2fvirtual-network%2ftoc.json) article.

Every NIC attached to a VM has one or more IP configurations associated to it. Each configuration is assigned one static or dynamic private IP address. Each configuration may also have one public IP address resource associated to it. A public IP address resource has either a dynamic or static public IP address assigned to it. To learn more about IP addresses in Azure, read the [IP addresses in Azure](../articles/virtual-network/virtual-network-ip-addresses-overview-arm.md) article. 

There is a limit to how many private IP addresses can be assigned to a NIC. There is also a limit to how many public IP addresses that can be used in an Azure subscription. See the [Azure limits](../articles/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) article for details.
