## Virtual Network
Virtual Networks (VNET) and subnets help define a security boundary for workloads running in Azure. A VNET is characterized by a collection of address spaces, also referred to as CIDR blocks. 

A subnet is a child resource of a VNET, and helps define segments of address spaces within a CIDR block, using IP address prefixes. NIC s can be added to subnets, and connected to VMs, providing connectivity for various workloads. 

![NIC's on a single VM](./media/resource-groups-networking/Figure4.png)

Key properties of a VNET resource include:

- IP address space (CIDR block) 
- VNET name
- subnets
- DNS servers

A VNET can also be associated with the following network resources:

- VPN Gateway

### Subnet

Key properties of a subnet include:

- IP address prefix
- Subnet name

A subnet can also be associated with the following network resources:

- NSG
