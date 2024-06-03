---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 10/18/2023
 ms.author: cherylmc
 ms.custom: include file
---
If you're having trouble connecting to a virtual machine over your VPN connection, check the following items:

* Verify that your VPN connection is successful.
* Verify that you're connecting to the private IP address for the VM.
* If you can connect to the VM using the private IP address, but not the computer name, verify that you have configured DNS properly. For more information about how name resolution works for VMs, see [Name Resolution for VMs](../articles/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md).

When you connect over Point-to-Site, check the following additional items:

* Use 'ipconfig' to check the IPv4 address assigned to the Ethernet adapter on the computer from which you're connecting. If the IP address is within the address range of the virtual network that you're connecting to, or within the address range of your VPNClientAddressPool, this is referred to as an overlapping address space. When your address space overlaps in this way, the network traffic doesn't reach Azure, it stays on the local network.
* Verify that the VPN client configuration package was generated after the DNS server IP addresses were specified for the virtual network. If you updated the DNS server IP addresses, generate and install a new VPN client configuration package.

For more information about troubleshooting an RDP connection, see [Troubleshoot Remote Desktop connections to a VM](/troubleshoot/azure/virtual-machines/troubleshoot-rdp-connection).