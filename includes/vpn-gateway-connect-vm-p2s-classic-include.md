---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 12/06/2018
 ms.author: cherylmc
 ms.custom: include file
---
Create a Remote Desktop Connection to connect to a VM that's deployed to your VNet. The best way to verify you can connect to your VM is to connect with its private IP address, rather than its computer name. That way, you're testing to see if you can connect, not whether name resolution is configured properly. 

1. Locate the private IP address for your VM. To find the private IP address of a VM, view the properties for the VM in the Azure portal or use PowerShell.
2. Verify that you're connected to your VNet with the  Point-to-Site VPN connection. 
3. To open Remote Desktop Connection, enter *RDP* or *Remote Desktop Connection* in the search box on the taskbar, then select **Remote Desktop Connection**. You can also open it by using the **mstsc** command in PowerShell. 
3. In **Remote Desktop Connection**, enter the private IP address of the VM. If necessary, select **Show Options** to adjust additional settings, then connect.

### To troubleshoot an RDP connection to a VM

If you're having trouble connecting to a virtual machine over your VPN connection, there are a few things you can check. 

- Verify that your VPN connection is successful.
- Verify that you're connecting to the private IP address for the VM.
- Enter **ipconfig** to check the IPv4 address assigned to the Ethernet adapter on the computer from which you're connecting. An overlapping address space occurs when the IP address is within the address range of the VNet that you're connecting to, or within the address range of your VPNClientAddressPool. When your address space overlaps in this way, the network traffic doesn't reach Azure, it stays on the local network.
- If you can connect to the VM by using the private IP address, but not the computer name, verify that you have configured DNS properly. For more information about how name resolution works for VMs, see [Name Resolution for VMs](../articles/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md).
- Verify that the VPN client configuration package is generated after you specify the DNS server IP addresses for the VNet. If you update the DNS server IP addresses, generate and install a new VPN client configuration package.

For more troubleshooting information, see [Troubleshoot Remote Desktop connections to a VM](../articles/virtual-machines/windows/troubleshoot-rdp-connection.md).