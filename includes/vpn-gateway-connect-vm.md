---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 08/07/2023
 ms.author: cherylmc
 ms.custom: include file
---
You can connect to a VM that's deployed to your VNet by creating a Remote Desktop Connection to your VM. The best way to initially verify that you can connect to your VM is to connect by using its private IP address, rather than computer name. That way, you're testing to see if you can connect, not whether name resolution is configured properly.

1. Locate the private IP address. You can find the private IP address of a VM by either looking at the properties for the VM in the Azure portal, or by using PowerShell.

   * Azure portal - Locate your virtual machine in the Azure portal. View the properties for the VM. The private IP address is listed.

   * PowerShell - Use the example to view a list of VMs and private IP addresses from your resource groups. You don't need to modify this example before using it.

     ```azurepowershell-interactive
     $VMs = Get-AzVM
     $Nics = Get-AzNetworkInterface | Where-Object VirtualMachine -ne $null

     foreach ($Nic in $Nics) {
      $VM = $VMs | Where-Object -Property Id -eq $Nic.VirtualMachine.Id
      $Prv = $Nic.IpConfigurations | Select-Object -ExpandProperty PrivateIpAddress
      $Alloc = $Nic.IpConfigurations | Select-Object -ExpandProperty PrivateIpAllocationMethod
      Write-Output "$($VM.Name): $Prv,$Alloc"
     }
     ```

1. Verify that you're connected to your VNet.
1. Open **Remote Desktop Connection** by typing "RDP" or "Remote Desktop Connection" in the search box on the taskbar, then select Remote Desktop Connection. You can also open Remote Desktop Connection using the 'mstsc' command in PowerShell.
1. In Remote Desktop Connection, enter the private IP address of the VM. You can select "Show Options" to adjust additional settings, then connect.

**Troubleshoot a connection**

If you're having trouble connecting to a virtual machine over your VPN connection, check the following:

* Verify that your VPN connection is successful.

* Verify that you're connecting to the private IP address for the VM.

* If you can connect to the VM using the private IP address, but not the computer name, verify that you have configured DNS properly. For more information about how name resolution works for VMs, see [Name Resolution for VMs](../articles/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md).

* For more information about RDP connections, see [Troubleshoot Remote Desktop connections to a VM](/troubleshoot/azure/virtual-machines/troubleshoot-rdp-connection).
