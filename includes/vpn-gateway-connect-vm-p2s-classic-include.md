You can connect to a VM that is deployed to your VNet by creating a Remote Desktop Connection to your VM. The best way to initially verify that you can connect to your VM is to connect by using its private IP address, rather than computer name. That way, you are testing to see if you can connect, not whether name resolution is configured properly. 

1. Locate the private IP address for your VM. You can find the private IP address of a VM by either looking at the properties for the VM in the Azure portal, or by using PowerShell.
2. Verify that you are connected to your VNet using the  Point-to-Site VPN connection. 
3. Open Remote Desktop Connection by typing "RDP" or "Remote Desktop Connection" in the search box on the taskbar, then select Remote Desktop Connection. You can also open Remote Desktop Connection using the 'mstsc' command in PowerShell. 
3. In Remote Desktop Connection, enter the private IP address of the VM. You can click "Show Options" to adjust additional settings, then connect.

### To troubleshoot an RDP connection to a VM

If you are having trouble connecting to a virtual machine over your VPN connection, there are a few things you can check. For more troubleshooting information, see [Troubleshoot Remote Desktop connections to a VM](../articles/virtual-machines/windows/troubleshoot-rdp-connection.md).

- Verify that your VPN connection is successful.
- Verify that you are connecting to the private IP address for the VM.
- Use 'ipconfig' to check the IPv4 address assigned to the Ethernet adapter on the computer from which you are connecting. If the IP address is within the address range of the VNet that you are connecting to, or within the address range of your VPNClientAddressPool, this is referred to as an overlapping address space. When your address space overlaps in this way, the network traffic doesn't reach Azure, it stays on the local network.
- If you can connect to the VM using the private IP address, but not the computer name, verify that you have configured DNS properly.
- Verify that the VPN client configuration package was generated after the DNS server IP addresses were specified for the VNet. If you updated the DNS server IP addresses, generate and install a new VPN client configuration package.