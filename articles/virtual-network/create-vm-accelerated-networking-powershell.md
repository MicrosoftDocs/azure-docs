---
title: Create Windows VM with accelerated networking - Azure PowerShell
description: Learn how to create a Linux virtual machine with accelerated networking.
services: virtual-network
documentationcenter: ''
author: gsilva5
manager: gedegrac
editor: ''

ms.assetid:
ms.service: virtual-network
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 04/15/2020
ms.author: gsilva
---

# Create a Windows VM with accelerated networking using Azure PowerShell

In this tutorial, you learn how to create a Windows virtual machine (VM) with accelerated networking.

> [!NOTE]
> To use accelerated networking with a Linux virtual machine, see [Create a Linux VM with accelerated networking](create-vm-accelerated-networking-cli.md).

Accelerated networking enables single root I/O virtualization (SR-IOV) to a VM, greatly improving its networking performance. This high-performance path bypasses the host from the data path, which reduces latency, jitter, and CPU utilization for the most demanding network workloads on supported VM types. The following diagram illustrates how two VMs communicate with and without accelerated networking:

![Communication between Azure virtual machines with and without accelerated networking](./media/create-vm-accelerated-networking/accelerated-networking.png)

Without accelerated networking, all networking traffic in and out of the VM must traverse the host and the virtual switch. The virtual switch provides all policy enforcement, such as network security groups, access control lists, isolation, and other network virtualized services to network traffic.

> [!NOTE]
> To learn more about virtual switches, see [Hyper-V Virtual Switch](/windows-server/virtualization/hyper-v-virtual-switch/hyper-v-virtual-switch).

With accelerated networking, network traffic arrives at the VM's network interface (NIC) and is then forwarded to the VM. All network policies that the virtual switch applies are now offloaded and applied in hardware. Because policy is applied in hardware, the NIC can forward network traffic directly to the VM. The NIC bypasses the host and the virtual switch, while it maintains all the policy it applied in the host.

The benefits of accelerated networking only apply to the VM that it's enabled on. For the best results, enable this feature on at least two VMs connected to the same Azure virtual network. When communicating across virtual networks or connecting on-premises, this feature has minimal impact to overall latency.

## Benefits

- **Lower Latency / Higher packets per second (pps)**: Eliminating the virtual switch from the data path removes the time packets spend in the host for policy processing. It also increases the number of packets that can be processed inside the VM.

- **Reduced jitter**: Virtual switch processing depends on the amount of policy that needs to be applied. It also depends on the workload of the CPU that's doing the processing. Offloading the policy enforcement to the hardware removes that variability by delivering packets directly to the VM. Offloading also removes the host-to-VM communication, all software interrupts, and all context switches.

- **Decreased CPU utilization**: Bypassing the virtual switch in the host leads to less CPU utilization for processing network traffic.

## Supported operating systems

The following distributions are supported directly from the Azure Gallery:

- **Windows Server 2019 Datacenter**
- **Windows Server 2016 Datacenter** 
- **Windows Server 2012 R2 Datacenter**

## Limitations and constraints

### Supported VM instances

Accelerated networking is supported on most general purpose and compute-optimized instance sizes with two or more virtual CPUs (vCPUs).  These supported series are: Dv2/DSv2 and F/Fs.

On instances that support hyperthreading, accelerated networking is supported on VM instances with four or more vCPUs. Supported series are: D/Dsv3, D/Dsv4, E/Esv3, Ea/Easv4, Fsv2, Lsv2, Ms/Mms, and Ms/Mmsv2.

For more information on VM instances, see [Sizes for Windows virtual machines in Azure](../virtual-machines/windows/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

### Regions

Accelerated networking is available in all global Azure regions and Azure Government Cloud.

### Enabling accelerated networking on a running VM

A supported VM size without accelerated networking enabled can only have the feature enabled when it's stopped and deallocated.

### Deployment through Azure Resource Manager

Virtual machines (classic) can't be deployed with accelerated networking.

## VM creation using the portal

Though this article provides steps to create a VM with accelerated networking using Azure PowerShell, you can also [use the Azure portal to create a virtual machine](../virtual-machines/windows/quick-create-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) that enables accelerated networking. When you create a VM in the portal, in the **Create a virtual machine** page, choose the **Networking** tab. This tab has an option for **Accelerated networking**. If you have chosen a [supported operating system](#supported-operating-systems) and [VM size](#supported-vm-instances), this option is automatically set to **On**. Otherwise, the option is set to **Off**, and Azure displays the reason why it can't be enabled.

> [!NOTE]
> Only supported operating systems can be enabled through the portal. If you are using a custom image, and your image supports accelerated networking, please create your VM using CLI or PowerShell. 

After you create the VM, you can confirm whether accelerated networking is enabled. Follow these instructions:

1. Go to the [Azure portal](https://portal.azure.com) to manage your VMs. Search for and select **Virtual machines**.

2. In the virtual machine list, choose your new VM.

3. In the VM menu bar, choose **Networking**.

In the network interface information, next to the **Accelerated networking** label, the portal displays either **Disabled** or **Enabled** for the accelerated networking status.

## VM creation using PowerShell

Before you proceed, install [Azure PowerShell](/powershell/azure/install-az-ps) version 1.0.0 or later. To find your currently installed version, run `Get-Module -ListAvailable Az`. If you need to install or upgrade, install the latest version of the Az module from the [PowerShell Gallery](https://www.powershellgallery.com/packages/Az). In a PowerShell session, sign in to an Azure account using [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount).

In the following examples, replace example parameter names with your own values. Example parameter names included *myResourceGroup*, *myNic*, and *myVM*.

### Create a virtual network

1. Create a resource group with [New-AzResourceGroup](/powershell/module/az.Resources/New-azResourceGroup). The following command creates a resource group named *myResourceGroup* in the *centralus* location:

    ```azurepowershell
    New-AzResourceGroup -Name "myResourceGroup" -Location "centralus"
    ```

2. Create a subnet configuration with [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.Network/New-azVirtualNetworkSubnetConfig). The following command creates a subnet named *mySubnet*:

    ```azurepowershell
    $subnet = New-AzVirtualNetworkSubnetConfig `
        -Name "mySubnet" `
        -AddressPrefix "192.168.1.0/24"
    ```

3. Create a virtual network with [New-AzVirtualNetwork](/powershell/module/az.Network/New-azVirtualNetwork), with the *mySubnet* subnet.

    ```azurepowershell
    $vnet = New-AzVirtualNetwork -ResourceGroupName "myResourceGroup" `
        -Location "centralus" `
        -Name "myVnet" `
        -AddressPrefix "192.168.0.0/16" `
        -Subnet $Subnet
    ```

### Create a network security group

1. Create a network security group rule with [New-AzNetworkSecurityRuleConfig](/powershell/module/az.Network/New-azNetworkSecurityRuleConfig).

    ```azurepowershell
    $rdp = New-AzNetworkSecurityRuleConfig `
        -Name 'Allow-RDP-All' `
        -Description 'Allow RDP' `
        -Access Allow `
        -Protocol Tcp `
        -Direction Inbound `
        -Priority 100 `
        -SourceAddressPrefix * `
        -SourcePortRange * `
        -DestinationAddressPrefix * `
        -DestinationPortRange 3389
    ```

2. Create a network security group with [New-AzNetworkSecurityGroup](/powershell/module/az.Network/New-azNetworkSecurityGroup) and assign the *Allow-RDP-All* security rule to it. Aside from the *Allow-RDP-All* rule, the network security group contains several default rules. One default rule disables all inbound access from the internet. Once it's created, the *Allow-RDP-All* rule is assigned to the network security group so that you can remotely connect to the VM.

    ```azurepowershell
    $nsg = New-AzNetworkSecurityGroup `
        -ResourceGroupName myResourceGroup `
        -Location centralus `
        -Name "myNsg" `
        -SecurityRules $rdp
    ```

3. Associate the network security group to the *mySubnet* subnet with [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.Network/Set-azVirtualNetworkSubnetConfig). The rule in the network security group is effective for all resources deployed in the subnet.

    ```azurepowershell
    Set-AzVirtualNetworkSubnetConfig `
        -VirtualNetwork $vnet `
        -Name 'mySubnet' `
        -AddressPrefix "192.168.1.0/24" `
        -NetworkSecurityGroup $nsg
    ```

### Create a network interface with accelerated networking

1. Create a public IP address with [New-AzPublicIpAddress](/powershell/module/az.Network/New-azPublicIpAddress). A public IP address is unnecessary if you don't plan to access the VM from the internet. However, it's required to complete the steps in this article.

    ```azurepowershell
    $publicIp = New-AzPublicIpAddress `
        -ResourceGroupName myResourceGroup `
        -Name 'myPublicIp' `
        -location centralus `
        -AllocationMethod Dynamic
    ```

2. Create a network interface with [New-AzNetworkInterface](/powershell/module/az.Network/New-azNetworkInterface) with accelerated networking enabled, and assign the public IP address to the network interface. The following example creates a network interface named *myNic* in the *mySubnet* subnet of the *myVnet* virtual network, assigning the *myPublicIp* public IP address to it:

    ```azurepowershell
    $nic = New-AzNetworkInterface `
        -ResourceGroupName "myResourceGroup" `
        -Name "myNic" `
        -Location "centralus" `
        -SubnetId $vnet.Subnets[0].Id `
        -PublicIpAddressId $publicIp.Id `
        -EnableAcceleratedNetworking
    ```

### Create a VM and attach the network interface

1. Set your VM credentials to the `$cred` variable using [Get-Credential](/powershell/module/microsoft.powershell.security/get-credential), which prompts you to sign in:

    ```azurepowershell
    $cred = Get-Credential
    ```

2. Define your VM with [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig). The following command defines a VM named *myVM* with a VM size that supports accelerated networking (*Standard_DS4_v2*):

    ```azurepowershell
    $vmConfig = New-AzVMConfig -VMName "myVm" -VMSize "Standard_DS4_v2"
    ```

    For a list of all VM sizes and characteristics, see [Windows VM sizes](../virtual-machines/windows/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

3. Create the rest of your VM configuration with [Set-AzVMOperatingSystem](/powershell/module/az.compute/set-azvmoperatingsystem) and [Set-AzVMSourceImage](/powershell/module/az.compute/set-azvmsourceimage). The following command creates a Windows Server 2016 VM:

    ```azurepowershell
    $vmConfig = Set-AzVMOperatingSystem -VM $vmConfig `
        -Windows `
        -ComputerName "myVM" `
        -Credential $cred `
        -ProvisionVMAgent `
        -EnableAutoUpdate
    $vmConfig = Set-AzVMSourceImage -VM $vmConfig `
        -PublisherName "MicrosoftWindowsServer" `
        -Offer "WindowsServer" `
        -Skus "2016-Datacenter" `
        -Version "latest"
    ```

4. Attach the network interface that you previously created with [Add-AzVMNetworkInterface](/powershell/module/az.compute/add-azvmnetworkinterface):

    ```azurepowershell
    $vmConfig = Add-AzVMNetworkInterface -VM $vmConfig -Id $nic.Id
    ```

5. Create your VM with [New-AzVM](/powershell/module/az.compute/new-azvm).

    ```azurepowershell
    New-AzVM -VM $vmConfig -ResourceGroupName "myResourceGroup" -Location "centralus"
    ```

### Confirm the Ethernet controller is installed in the Windows VM

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

## Enable accelerated networking on existing VMs

If you've created a VM without accelerated networking, you may enable this feature on an existing VM. The VM must support accelerated networking by meeting the following prerequisites, which are also outlined above:

* The VM must be a supported size for accelerated networking.
* The VM must be a supported Azure Gallery image (and kernel version for Linux).
* All VMs in an availability set or a virtual machine scale set must be stopped or deallocated before you enable accelerated networking on any NIC.

### Individual VMs and VMs in an availability set

1. Stop or deallocate the VM or, if an availability set, all the VMs in the set:

    ```azurepowershell
    Stop-AzVM -ResourceGroup "myResourceGroup" -Name "myVM"
    ```

    > [!NOTE]
    > When you create a VM individually, without an availability set, you only need to stop or deallocate the individual VM to enable accelerated networking. If your VM was created with an availability set, you must stop or deallocate all VMs contained in the availability set before enabling accelerated networking on any of the NICs, so that the VMs end up on a cluster that supports accelerated networking. The stop or deallocate requirement is unnecessary if you disable accelerated networking, because clusters that support accelerated networking also work fine with NICs that don't use accelerated networking.

2. Enable accelerated networking on the NIC of your VM:

    ```azurepowershell
    $nic = Get-AzNetworkInterface -ResourceGroupName "myResourceGroup" `
        -Name "myNic"
    
    $nic.EnableAcceleratedNetworking = $true
    
    $nic | Set-AzNetworkInterface
    ```

3. Restart your VM or, if in an availability set, all the VMs in the set, and confirm that accelerated networking is enabled:

    ```azurepowershell
    Start-AzVM -ResourceGroup "myResourceGroup" `
        -Name "myVM"
    ```

### Virtual machine scale set

A virtual machine scale set is slightly different, but it follows the same workflow.

1. Stop the VMs:

    ```azurepowershell
    Stop-AzVmss -ResourceGroupName "myResourceGroup" `
        -VMScaleSetName "myScaleSet"
    ```

2. Update the accelerated networking property under the network interface:

    ```azurepowershell
    $vmss = Get-AzVmss -ResourceGroupName "myResourceGroup" `
        -VMScaleSetName "myScaleSet"
    
    $vmss.VirtualMachineProfile.NetworkProfile.NetworkInterfaceConfigurations[0].EnableAcceleratedNetworking = $true
    
    Update-AzVmss -ResourceGroupName "myResourceGroup" `
        -VMScaleSetName "myScaleSet" `
        -VirtualMachineScaleSet $vmss
    ```

3. Set the applied updates to automatic so that the changes are immediately picked up:

    ```azurepowershell
    $vmss.UpgradePolicy.Mode = "Automatic"
    
    Update-AzVmss -ResourceGroupName "myResourceGroup" `
        -VMScaleSetName "myScaleSet" `
        -VirtualMachineScaleSet $vmss
    ```

    > [!NOTE]
    > A scale set has VM upgrades that apply updates using three different settings: automatic, rolling, and manual. In these instructions, the policy is set to automatic, so the scale set picks up the changes immediately after it restarts.

4. Restart the scale set:

    ```azurepowershell
    Start-AzVmss -ResourceGroupName "myResourceGroup" `
        -VMScaleSetName "myScaleSet"
    ```

Once you restart, wait for the upgrades to finish. After the upgrades are done, the virtual function (VF) appears inside the VM. Make sure you're using a supported OS and VM size.

### Resizing existing VMs with accelerated networking

If a VM has accelerated networking enabled, you're only able to resize it to a VM that supports accelerated networking.  

A VM with accelerated networking enabled can't be resized to a VM instance that doesn't support accelerated networking using the resize operation. Instead, to resize one of these VMs:

1. Stop or deallocate the VM. For an availability set or scale set, stop or deallocate all the VMs in the availability set or scale set.

2. Disable accelerated networking on the NIC of the VM. For an availability set or scale set, disable accelerated networking on the NICs of all VMs in the availability set or scale set.

3. After you disable accelerated networking, move the VM, availability set, or scale set to a new size that doesn't support accelerated networking, and then restart them.
