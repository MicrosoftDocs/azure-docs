---
title: Use PowerShell to create a Windows VM with Accelerated Networking
description: Use Azure PowerShell to create and manage Windows virtual machines that have Accelerated Networking enabled for improved network performance.
services: virtual-network
author: asudbring
manager: gedegrac
ms.service: virtual-network
ms.topic: how-to
ms.tgt_pltfrm: vm-windows
ms.custom: devx-track-azurepowershell
ms.workload: infrastructure
ms.date: 03/16/2023
ms.author: allensu
---

# Use Azure PowerShell to create a Windows VM with Accelerated Networking

This article describes how to create a Windows virtual machine (VM) with Accelerated Networking (AccelNet) enabled by using Azure PowerShell. The article also discusses application binding requirements, and how to enable and manage Accelerated Networking on existing VMs.

You can also create a Windows VM with Accelerated Networking enabled by using the [Azure portal](quick-create-portal.md). To manage Accelerated Networking on VMs through the Azure portal, see [Manage Accelerated Networking through the portal](#manage-accelerated-networking-through-the-portal).

To create a Linux VM with Accelerated Networking enabled, see [Use Azure CLI to create a Linux VM with Accelerated Networking](create-vm-accelerated-networking-clil.md).

## Prerequisites

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- [Azure PowerShell](/powershell/azure/install-az-ps) 1.0.0 or later installed. To find your currently installed version, run `Get-Module -ListAvailable Az`. If you need to install or upgrade, install the latest version of the Az module from the [PowerShell Gallery](https://www.powershellgallery.com/packages/Az).

- In a PowerShell session, sign in to an Azure account by using [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount).

## Create a VM with Accelerated Networking

In the following examples, replace the example parameters such as `<myResourceGroup>`, `<myNic>`, and `<myVm>` with your own values.

### Create a virtual network

1. Use [New-AzResourceGroup](/powershell/module/az.Resources/New-azResourceGroup) to create a resource group to contain the resources.

   ```azurepowershell
   New-AzResourceGroup -Name "<myResourceGroup>" -Location "<myAzureRegion>"
   ```

1. Use [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.Network/New-azVirtualNetworkSubnetConfig) to create a subnet configuration.

   ```azurepowershell
   $subnet = New-AzVirtualNetworkSubnetConfig `
     -Name "<mySubnet>" `
     -AddressPrefix "192.168.1.0/24"
   ```

1. Use [New-AzVirtualNetwork](/powershell/module/az.Network/New-azVirtualNetwork) to create a virtual network with the `<mySubnet>` subnet.

   ```azurepowershell
   $vnet = New-AzVirtualNetwork -ResourceGroupName "<myResourceGroup>" `
     -Location "<myAzureRegion" `
     -Name "<myVnet>" `
     -AddressPrefix "192.168.0.0/16" `
     -Subnet $Subnet
   ```

### Create a network security group

1. A network security group (NSG) contains several default rules, one of which disables all inbound access from the internet. Use [New-AzNetworkSecurityRuleConfig](/powershell/module/az.Network/New-azNetworkSecurityRuleConfig) to create a new rule so that you can remotely connect to the VM.

   ```azurepowershell
   $rdp = New-AzNetworkSecurityRuleConfig `
     -Name "Allow-RDP-All" `
     -Description "Allow RDP" `
     -Access Allow `
     -Protocol Tcp `
     -Direction Inbound `
     -Priority 100 `
     -SourceAddressPrefix * `
     -SourcePortRange * `
     -DestinationAddressPrefix * `
     -DestinationPortRange 3389
   ```

1. Use [New-AzNetworkSecurityGroup](/powershell/module/az.Network/New-azNetworkSecurityGroup) to create the NSG and assign the `Allow-RDP-All` rule to the NSG.

   ```azurepowershell
   $nsg = New-AzNetworkSecurityGroup `
      -ResourceGroupName "<myResourceGroup>" `
     -Location "<myAzureRegion>" `
     -Name "<myNsg>" `
     -SecurityRules $rdp
   ```

1. Use [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.Network/Set-azVirtualNetworkSubnetConfig) to associate the NSG to the `<mySubnet>` subnet. The NSG rules are effective for all resources deployed in the subnet.

   ```azurepowershell
   Set-AzVirtualNetworkSubnetConfig `
     -VirtualNetwork $vnet `
     -Name "<mySubnet>" `
     -AddressPrefix "192.168.1.0/24" `
     -NetworkSecurityGroup $nsg
   ```

### Create a network interface with accelerated networking

1. Use [New-AzPublicIpAddress](/powershell/module/az.Network/New-azPublicIpAddress) to create a public IP address.  The VM doesn't need a public IP address if you don't access it from the internet, but you need the public IP to complete the steps for this article.

   ```azurepowershell
   $publicIp = New-AzPublicIpAddress `
     -ResourceGroupName "<myResourceGroup>" `
     -Name "<myPublicIp>" `
     -Location "<myAzureRegion>" `
     -AllocationMethod Dynamic
   ```

1. Use [New-AzNetworkInterface](/powershell/module/az.Network/New-azNetworkInterface) to create a network interface (NIC) with Accelerated Networking enabled, and assign the public IP address to the NIC.

   ```azurepowershell
   $nic = New-AzNetworkInterface `
     -ResourceGroupName "<myResourceGroup>" `
     -Name "<myNic>" `
     -Location "<myAzureRegion>" `
     -SubnetId $vnet.Subnets[0].Id `
     -PublicIpAddressId $publicIp.Id `
     -EnableAcceleratedNetworking
   ```

### Create a VM and attach the network interface

1. Use [Get-Credential](/powershell/module/microsoft.powershell.security/get-credential) to set your VM credentials to the `$cred` variable , which prompts you to sign in.

   ```azurepowershell
   $cred = Get-Credential
   ```

1. Use [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig) to define a VM with a VM size that supports accelerated networking, as listed in [Windows Accelerated Networking](https://azure.microsoft.com/updates/accelerated-networking-in-expanded-preview). For a list of all Windows VM sizes and characteristics, see [Windows VM sizes](/azure/virtual-machines/sizes).

   ```azurepowershell
   $vmConfig = New-AzVMConfig -VMName "<myVm>" -VMSize "Standard_DS4_v2"
   ```

1. Use [Set-AzVMOperatingSystem](/powershell/module/az.compute/set-azvmoperatingsystem) and [Set-AzVMSourceImage](/powershell/module/az.compute/set-azvmsourceimage) to create the rest of the VM configuration. The following example creates a Windows Server 2019 VM:

   ```azurepowershell
   $vmConfig = Set-AzVMOperatingSystem -VM $vmConfig `
     -Windows `
     -ComputerName "<myVM>" `
     -Credential $cred `
     -ProvisionVMAgent `
     -EnableAutoUpdate
   $vmConfig = Set-AzVMSourceImage -VM $vmConfig `
     -PublisherName "MicrosoftWindowsServer" `
     -Offer "WindowsServer" `
     -Skus "2019-Datacenter" `
     -Version "latest"
   ```

1. Use [Add-AzVMNetworkInterface](/powershell/module/az.compute/add-azvmnetworkinterface) to attach the NIC that you previously created to the VM.

   ```azurepowershell
   $vmConfig = Add-AzVMNetworkInterface -VM $vmConfig -Id $nic.Id
   ```

1. Use [New-AzVM](/powershell/module/az.compute/new-azvm) to create the VM.

   ```azurepowershell
   New-AzVM -VM $vmConfig -ResourceGroupName "<myResourceGroup>" -Location "<myAzureRegion>"
   ```

## Confirm the Ethernet controller is installed in the VM

Once you create the VM in Azure, connect to the VM and confirm that the Ethernet controller is installed in Windows.

1. Go to the [Azure portal](https://portal.azure.com) to manage your VMs. Search for and select **Virtual machines**.

2. In the virtual machine list, choose your new VM.

3. In the VM overview page, if the **Status** of the VM is listed as **Creating**, wait until Azure finishes creating the VM. The **Status** will be changed to **Running** after VM creation is complete.

4. From the VM overview toolbar, select **Connect** > **RDP** > **Download RDP File**.

5. Open the .rdp file, and then sign in to the VM with the credentials you entered in the [Create a VM and attach the network interface](#create-a-vm-and-attach-the-network-interface) section. If you've never connected to a Windows VM in Azure, see [Connect to virtual machine](../virtual-machines/windows/quick-create-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json#connect-to-virtual-machine).

6. After the remote desktop session for your VM appears, right-click the Windows Start button and choose **Device Manager**.

7. In the **Device Manager** window, expand the **Network adapters** node.

8. Confirm that the **Mellanox ConnectX-3 Virtual Function Ethernet Adapter** appears, as shown in the following image:

    ![Mellanox ConnectX-3 Virtual Function Ethernet Adapter, new network adapter for accelerated networking, Device Manager](./media/create-vm-accelerated-networking/device-manager.png)

Accelerated networking is now enabled for your VM.

> [!NOTE]
> If the Mellanox adapter fails to start, open an administrator prompt in the remote desktop session and enter the following command:
>
> `netsh int tcp set global rss = enabled`

<a name="enable-accelerated-networking-on-existing-vms"></a>
## Manage Accelerated Networking on existing VMs

You can enable Accelerated Networking on an existing VM. The VM must meet the following requirements to support Accelerated Networking:

- Be a supported size for Accelerated Networking.
- Be a supported Azure Marketplace image.
- Be stopped or deallocated before you can enable Accelerated Networking on any NIC. This requirement applies to all individual VMs or VMs in an availability set or Azure Virtual Machine Scale Sets.

### Enable Accelerated Networking on individual VMs or VMs in availability sets

1. Stop or deallocate the VM or, if an availability set, all the VMs in the set:

    ```azurepowershell
    Stop-AzVM -ResourceGroup "myResourceGroup" -Name "myVM"
    ```

   If you created your VM individually without an availability set, you must stop or deallocate only the individual VM to enable Accelerated Networking. If you created your VM with an availability set, you must stop or deallocate all VMs in the set before you can enable Accelerated Networking on any of the NICs. The VMs then end up on a cluster that supports Accelerated Networking.

   The stop or deallocate requirement is unnecessary if you disable Accelerated Networking. Clusters that support Accelerated Networking also work fine with NICs that don't use Accelerated Networking.

1. Enable Accelerated Networking on the NIC of your VM:

    ```azurepowershell
    $nic = Get-AzNetworkInterface -ResourceGroupName "myResourceGroup" `
        -Name "myNic"
    
    $nic.EnableAcceleratedNetworking = $true
    
    $nic | Set-AzNetworkInterface
    ```

3. Restart your VM, or all the VMs in the availability set, and [confirm that Accelerated Networking is enabled](#confirm-that-accelerated-networking-is-enabled).

    ```azurepowershell
    Start-AzVM -ResourceGroup "myResourceGroup" `
        -Name "myVM"
    ```

### Virtual Machine Scale Sets

Azure Virtual Machine Scale Sets is slightly different but follows the same workflow.

1. Stop the VMs:

    ```azurepowershell
    Stop-AzVmss -ResourceGroupName "myResourceGroup" `
        -VMScaleSetName "myScaleSet"
    ```

1. Update the Accelerated Networking property under the NIC:

    ```azurepowershell
    $vmss = Get-AzVmss -ResourceGroupName "myResourceGroup" `
        -VMScaleSetName "myScaleSet"
    
    $vmss.VirtualMachineProfile.NetworkProfile.NetworkInterfaceConfigurations[0].EnableAcceleratedNetworking = $true
    
    Update-AzVmss -ResourceGroupName "myResourceGroup" `
        -VMScaleSetName "myScaleSet" `
        -VirtualMachineScaleSet $vmss
    ```

1. Virtual Machine Scale Sets has an upgrade policy that applies updates by using automatic, rolling, or manual settings. Set the upgrade policy to automatic so that the changes are immediately picked up.

    ```azurepowershell
    $vmss.UpgradePolicy.Mode = "Automatic"
    
    Update-AzVmss -ResourceGroupName "myResourceGroup" `
        -VMScaleSetName "myScaleSet" `
        -VirtualMachineScaleSet $vmss
    ```

1. Restart the scale set:

    ```azurepowershell
    Start-AzVmss -ResourceGroupName "myResourceGroup" `
        -VMScaleSetName "myScaleSet"
    ```

Once you restart and the upgrades finish, the VF appears inside VMs that use a supported OS and VM size.

### Resize existing VMs with Accelerated Networking

VMs with Accelerated Networking enabled can be resized only to sizes that also support Accelerated Networking. You can't resize a VM with Accelerated Networking to a VM instance that doesn't support Accelerated Networking by using the resize operation. Instead, use the following process to resize these VMs:

1. Stop and deallocate the VM or all the VMs in the availability set or Virtual Machine Scale Sets.
1. Disable Accelerated Networking on the NIC of the VM or all the VMs in the availability set or Virtual Machine Scale Sets.
1. Move the VM or VMs to a new size that doesn't support Accelerated Networking, and restart them.

### Manage Accelerated Networking through the portal

When you [create a VM in the Azure portal](quick-create-portal.md), you can select the **Enable accelerated networking** checkbox on the **Networking** tab of the **Create a virtual machine** screen. If the VM uses a [supported operating system](./accelerated-networking-overview.md#supported-operating-systems) and [VM size](./accelerated-networking-overview.md#supported-vm-instances) for Accelerated Networking, the checkbox is automatically selected. If Accelerated Networking isn't supported, the checkbox isn't selected, and a message explains the reason.

>[!NOTE]
>- You can enable Accelerated Networking during portal VM creation only for Azure Marketplace supported operating systems. To create and enable Accelerated Networking for a VM with a custom OS image, you must use PowerShell or Azure CLI.

To enable or disable Accelerated Networking for an existing VM through the Azure portal:

1. From the [Azure portal](https://portal.azure.com) page for the VM, select **Networking** from the left menu.
1. On the **Networking** page, select the **Network Interface**.
1. At the top of the NIC **Overview** page, select **Edit accelerated networking**.
1. Select **Automatic**, **Enabled**, or **Disabled**, and then select **Save**.

To confirm whether Accelerated Networking is enabled for an existing VM:

1. From the [Azure portal](https://portal.azure.com) page for the VM, select **Networking** from the left menu.
1. On the **Networking** page, select the **Network Interface**.
1. On the NIC **Overview** page, under **Essentials**, note whether **Accelerated networking** is set to **Enabled** or **Disabled**.


## Next steps

- [How Accelerated Networking works in Linux and FreeBSD VMs](accelerated-networking-how-it-works.md)
- [Create a VM with Accelerated Networking by using Azure CLI](create-vm-accelerated-networking-cli.md)
- [Proximity placement groups](../virtual-machines/co-location.md)
