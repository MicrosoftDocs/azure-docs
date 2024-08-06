---
 title: Include file
 description: Include file
 services: vpn-gateway
 author: cherylmc
 ms.service: azure-vpn-gateway
 ms.topic: include
 ms.date: 10/18/2023
 ms.author: cherylmc
 ms.custom: Include file
---
If you're having trouble connecting to a virtual machine over your VPN connection, check the following items:

* Verify that your VPN connection is successful.
* Verify that you're connecting to the private IP address for the VM.
* If you can connect to the VM by using the private IP address but not the computer name, verify that you configured DNS properly. For more information about how name resolution works for VMs, see [Name resolution for resources in Azure virtual networks](../articles/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md).

When you connect over point-to-site, check the following additional items:

* Use `ipconfig` to check the IPv4 address assigned to the Ethernet adapter on the computer from which you're connecting. If the IP address is within the address range of the virtual network that you're connecting to, or within the address range of your VPN client address pool, it's an overlapping address space. When your address space overlaps in this way, the network traffic doesn't reach Azure. It stays on the local network.
* Verify that the VPN client configuration package was generated after you specified the DNS server IP addresses for the virtual network. If you updated the DNS server IP addresses, generate and install a new VPN client configuration package.

For more information about troubleshooting an RDP connection, see [Troubleshoot Remote Desktop connections to a VM](/troubleshoot/azure/virtual-machines/troubleshoot-rdp-connection).
