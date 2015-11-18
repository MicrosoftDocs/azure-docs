
Azure Internal Load Balancing (ILB) provides load balancing between virtual machines that reside inside a cloud service or a virtual network with a regional scope. For information about the use and configuration of virtual networks with a regional scope, see [Regional Virtual Networks](virtual-networks-migrate-to-regional-vnet.md). Existing virtual networks that have been configured for an affinity group cannot use ILB.

An internal load balancer acts as a security boundary not allowing direct access to virtual machines behind the load balancer from Internet. You will need to access an internal load balancer either through a virtual machine inside the Microsoft Azure infrastructure or using VPN access to the virtual network where the internal load balancer was created.


