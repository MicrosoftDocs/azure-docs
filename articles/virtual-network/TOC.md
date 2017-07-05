# Overview
## [Virtual networks](virtual-networks-overview.md)
## [User-defined routes and IP forwarding](virtual-networks-udr-overview.md)
## [Virtual network peering](virtual-network-peering-overview.md)
## [Business continuity](virtual-network-disaster-recovery-guidance.md)
## [FAQ](virtual-networks-faq.md)
## IP addressing
### [Resource Manager](virtual-network-ip-addresses-overview-arm.md)
### [Classic](virtual-network-ip-addresses-overview-classic.md)

# Get Started
## [Create your first virtual network](virtual-network-get-started-vnet-subnet.md)

# How To
## Plan and design
### [Virtual networks](virtual-network-vnet-plan-design-arm.md)
### [Network security groups](virtual-networks-nsg.md)

## Deploy
### Virtual networks (VNet)
#### [Create, change, or delete VNets](virtual-network-manage-network.md)
#### [Create, change, or delete subnets](virtual-network-manage-subnet.md)
#### [Create a VNet - multiple subnets](virtual-networks-create-vnet-arm-pportal.md) 
##### [PowerShell](virtual-networks-create-vnet-arm-ps.md)
##### [CLI](virtual-networks-create-vnet-arm-cli.md)
##### [Template](virtual-networks-create-vnet-arm-template-click.md)
#### Create a VNet - multiple subnets [Classic]
##### [Portal](virtual-networks-create-vnet-classic-pportal.md)
##### [PowerShell](virtual-networks-create-vnet-classic-netcfg-ps.md)
##### [CLI](virtual-networks-create-vnet-classic-cli.md)

### Network security groups
#### [Portal](virtual-networks-create-nsg-arm-pportal.md)
#### [PowerShell](virtual-networks-create-nsg-arm-ps.md)
#### [CLI](virtual-networks-create-nsg-arm-cli.md)
#### [Template](virtual-networks-create-nsg-arm-template.md)
#### [PowerShell (Classic)](virtual-networks-create-nsg-classic-ps.md)
#### [CLI (Classic)](virtual-networks-create-nsg-classic-cli.md)

### User-defined routes
#### [PowerShell](virtual-network-create-udr-arm-ps.md)
#### [CLI](virtual-network-create-udr-arm-cli.md)
#### [Template](virtual-network-create-udr-arm-template.md)
#### [PowerShell (Classic)](virtual-network-create-udr-classic-ps.md)
#### [CLI (Classic)](virtual-network-create-udr-classic-cli.md)

### Virtual network peering
#### [Portal](virtual-networks-create-vnetpeering-arm-portal.md)
#### [PowerShell](virtual-networks-create-vnetpeering-arm-ps.md)
#### [Template](virtual-networks-create-vnetpeering-arm-template-click.md)

### Network interfaces (NIC)
#### [Create, change, or delete NICs](virtual-network-network-interface.md)
#### [Add, change, or remove IP addresses](virtual-network-network-interface-addresses.md)

### [Public IP addresses](virtual-network-public-ip-address.md)

### Virtual machines
#### [Add or remove network interfaces](virtual-network-network-interface-vm.md) 
#### Create a VM with a static public IP address
##### [Portal](virtual-network-deploy-static-pip-arm-portal.md)
##### [PowerShell](virtual-network-deploy-static-pip-arm-ps.md)
##### [CLI](virtual-network-deploy-static-pip-arm-cli.md)
##### [Template](virtual-network-deploy-static-pip-arm-template.md)
##### [PowerShell (Classic)](virtual-networks-reserved-public-ip.md)

#### Create a VM with a static private IP address
##### [Portal](virtual-networks-static-private-ip-arm-pportal.md)
##### [PowerShell](virtual-networks-static-private-ip-arm-ps.md)
##### [CLI](virtual-networks-static-private-ip-arm-cli.md)
##### [Portal (Classic)](virtual-networks-static-private-ip-classic-pportal.md)
##### [PowerShell (Classic)](virtual-networks-static-private-ip-classic-ps.md)
##### [CLI (Classic)](virtual-networks-static-private-ip-classic-cli.md)

#### Create a VM with multiple network interfaces
##### [PowerShell](../virtual-machines/windows/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
##### [CLI](../virtual-machines/linux/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
##### [PowerShell (Classic)](virtual-network-deploy-multinic-classic-ps.md)
##### [CLI (Classic)](virtual-network-deploy-multinic-classic-cli.md)

#### Create a VM with multiple IP addresses
##### [Azure portal](virtual-network-multiple-ip-addresses-portal.md)
##### [PowerShell](virtual-network-multiple-ip-addresses-powershell.md)
##### [CLI](virtual-network-multiple-ip-addresses-cli.md)
##### [Template](virtual-network-multiple-ip-addresses-template.md)

#### [Create a VM with accelerated networking](virtual-network-create-vm-accelerated-networking.md)

### Connectivity scenarios
#### [Virtual network (VNet) to VNet](../vpn-gateway/vpn-gateway-vnet-vnet-rm-ps.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
#### [VNet (Resource Manager) to a VNet (Classic)](../vpn-gateway/vpn-gateway-connect-different-deployment-models-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
#### [VNet to on-premises network (VPN)](../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
#### [VNet to on-premises network (ExpressRoute)](../expressroute/expressroute-howto-linkvnet-portal-resource-manager.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
#### [Highly available hybrid network architecture](../guidance/guidance-hybrid-network-expressroute-vpn-failover.md?toc=%2fazure%2fvirtual-network%2ftoc.json)

### Security scenarios
#### [Secure networks with virtual appliances](virtual-network-scenario-udr-gw-nva.md)
#### [DMZ between Azure and the Internet](../guidance/guidance-iaas-ra-secure-vnet-dmz.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
#### [Cloud service and network security](../best-practices-network-security.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
##### [Simple DMZ with NSGs](virtual-networks-dmz-nsg-asm.md)
##### [DMZ with firewall and NSGs](virtual-networks-dmz-nsg-fw-asm.md)
##### [DMZ with firewall, UDR, and NSGs](virtual-networks-dmz-nsg-fw-udr-asm.md)
##### [Sample application](virtual-networks-sample-app.md)

## Configure
### [Optimize VM network throughput](virtual-network-optimize-network-bandwidth.md)
### Access control lists
#### [Classic portal](virtual-networks-acl.md)
#### [PowerShell](virtual-networks-acl-powershell.md)
### [Name resolution for VMs and cloud services](virtual-networks-name-resolution-for-vms-and-role-instances.md)

## Manage
### Network security groups
#### [Portal](virtual-network-manage-nsg-arm-portal.md)
#### [PowerShell](virtual-network-manage-nsg-arm-ps.md)
#### [CLI](virtual-network-manage-nsg-arm-cli.md)
#### [Logs](virtual-network-nsg-manage-log.md)
### Virtual machines
#### [View and modify hostnames](virtual-networks-viewing-and-modifying-hostnames.md)
#### [Move a VM to a different subnet](virtual-networks-move-vm-role-to-subnet.md)

## Troubleshoot
### Network security groups
#### [Portal](virtual-network-nsg-troubleshoot-portal.md)
#### [PowerShell](virtual-network-nsg-troubleshoot-powershell.md)
### Routes
#### [Portal](virtual-network-routes-troubleshoot-portal.md)
#### [PowerShell](virtual-network-routes-troubleshoot-powershell.md)
### [Throughput testing](virtual-network-bandwidth-testing.md)

# Reference
## [PowerShell (Resource Manager)](/powershell/module/azurerm.network)
## [PowerShell (Classic)](/powershell/module/azure/?view=azuresmps-3.7.0)
## [Azure CLI](/cli/azure/network)
## [Java](/java/api/)
## [REST (Resource Manager)](https://msdn.microsoft.com/library/mt163658.aspx)
## [REST (Classic)](https://msdn.microsoft.com/library/jj157182.aspx)


# Related
## [Virtual Machines](/azure/virtual-machines/)
## [Application Gateway](/azure/application-gateway/)
## [Azure DNS](/azure/dns/)
## [Traffic Manager](/azure/traffic-manager/)
## [Load Balancer](/azure/load-balancer/)
## [VPN Gateway](/azure/vpn-gateway/)
## [ExpressRoute](/azure/expressroute/)

# Resources
## [Networking blog](http://azure.microsoft.com/blog/topics/networking)
## [Networking forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=WAVirtualMachinesVirtualNetwork)
## [Pricing](https://azure.microsoft.com/pricing/details/virtual-network)
## [Stack Overflow](http://stackoverflow.com/questions/tagged/azure-virtual-network)
