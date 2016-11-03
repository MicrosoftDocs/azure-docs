# Overview
## [Virtual networks](virtual-networks-overview.md)
## [Network security groups](virtual-networks-nsg.md)
## [User-defined routes and IP forwarding](virtual-networks-udr-overview.md)
## IP addressing
### [Resource Manager](virtual-network-ip-addresses-overview-arm.md)
### [Classic](virtual-network-ip-addresses-overview-classic.md)
## [Virtual network peering](virtual-network-peering-overview.md)
## Virtual machines
### [Network interfaces](virtual-network-network-interface-overview.md)
### [Name resolution](virtual-networks-name-resolution-for-vms-and-role-instances.md)
## [Business continuity](virtual-network-disaster-recovery-guidance.md)
## [Pricing](https://azure.microsoft.com/pricing/details/virtual-network)

# Get Started
## [Create a virtual network](virtual-networks-create-vnet-arm-pportal.md)
## [Deploy a VM to a virtual network](../virtual-machines/virtual-machines-windows-hero-tutorial.md)

# How To
## Plan and design
### [Virtual networks](virtual-network-vnet-plan-design-arm.md)
### [Network security groups](virtual-networks-nsg.md)

## Deploy
### Virtual networks
#### [Portal](virtual-networks-create-vnet-arm-pportal.md)
#### [PowerShell](virtual-networks-create-vnet-arm-ps.md)
#### [CLI](virtual-networks-create-vnet-arm-cli.md)
#### [Template](virtual-networks-create-vnet-arm-template-click.md)
#### [Portal (Classic)](virtual-networks-create-vnet-classic-pportal.md)
#### [PowerShell (Classic)](virtual-networks-create-vnet-classic-netcfg-ps.md)
#### [CLI (Classic)](virtual-networks-create-vnet-classic-cli.md)

### Network security groups
#### [Portal](virtual-networks-create-nsg-arm-portal.md)
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

### Virtual machines

#### Static public IP addresses
##### [Portal](virtual-network-deploy-static-pip-arm-portal.md)
##### [PowerShell](virtual-network-deploy-static-pip-arm-ps.md)
##### [CLI](virtual-network-deploy-static-pip-arm-cli.md)
##### [Template](virtual-network-deploy-static-pip-arm-template.md)
##### [PowerShell (Classic)](virtual-networks-reserved-public-ip.md)

#### Static private IP addresses
##### [Portal](virtual-networks-static-private-ip-arm-pportal.md)
##### [PowerShell](virtual-networks-static-private-ip-arm-ps.md)
##### [CLI](virtual-networks-static-private-ip-arm-cli.md)
##### [Portal (Classic)](virtual-networks-static-private-ip-classic-pportal.md)
##### [PowerShell (Classic)](virtual-networks-static-private-ip-classic-ps.md)
##### [CLI (Classic)](virtual-networks-static-private-ip-classic-cli.md)

#### Multiple network interfaces
##### [PowerShell](virtual-network-deploy-multinic-arm-ps.md)
##### [CLI](virtual-network-deploy-multinic-arm-cli.md)
##### [Template](virtual-network-deploy-multinic-arm-template.md)
##### [PowerShell (Classic)](virtual-network-deploy-multinic-classic-ps.md)
##### [CLI (Classic)](virtual-network-deploy-multinic-classic-cli.md)

#### [Multiple IP addresses](virtual-network-multiple-ip-addresses-powershell.md)

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

## Manage
### Network security groups
#### [Portal](virtual-network-manage-nsg-arm-portal.md)
#### [PowerShell](virtual-network-manage-nsg-arm-ps.md)
#### [CLI](virtual-network-manage-nsg-arm-cli.md)
#### [Logs](virtual-network-nsg-manage-log.md)
#### Troubleshoot
##### [Portal](virtual-network-nsg-troubleshoot-portal.md)
##### [PowerShell](virtual-network-nsg-troubleshoot-powershell.md)
### Troubleshoot routes
#### [Portal](virtual-network-routes-troubleshoot-portal.md)
#### [PowerShell](virtual-network-routes-troubleshoot-powershell.md)
### Virtual machines
#### [View and modify hostnames](virtual-networks-viewing-and-modifying-hostnames.md)
#### [Move a VM to a different subnet](virtual-networks-move-vm-role-to-subnet.md)

# Reference
## [PowerShell cmdlets (Resource manager)](https://msdn.microsoft.com/library/mt163510(v=azure.300))
## [PowerShell cmdlets (Classic)](https://msdn.microsoft.com/library/mt270335(v=azure.300))
## [APIs (Resource Manager)](https://msdn.microsoft.com/library/mt163658.aspx)
## [APIs (Classic)](https://msdn.microsoft.com/library/jj157182.aspx)
## [Networking blog](http://azure.microsoft.com/blog/topics/networking)
## [Frequently asked questions](virtual-networks-faq.md)

# Related
## [Virtual Machines](https://azure.microsoft.com/documentation/services/virtual-machines)
## [Application Gateway](https://azure.microsoft.com/documentation/services/application-gateway)
## [Azure DNS](https://azure.microsoft.com/documentation/services/dns)
## [Traffic Manager](https://azure.microsoft.com/documentation/services/traffic-manager)
## [Load Balancer](https://azure.microsoft.com/documentation/services/load-balancer)
## [VPN Gateway](https://azure.microsoft.com/documentation/services/vpn-gateway)
## [ExpressRoute](https://azure.microsoft.com/documentation/services/expressroute)

