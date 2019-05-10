---
title: Create an Azure virtual machine with Accelerated Networking | Microsoft Docs
description: Learn how to create a Linux virtual machine with Accelerated Networking.
services: virtual-network
documentationcenter: ''
author: gsilva5
manager: gedegrac
editor: ''

ms.assetid:
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 01/04/2018
ms.author: gsilva
---

# Create a Windows virtual machine with Accelerated Networking

In this tutorial, you learn how to create a Windows virtual machine (VM) with Accelerated Networking. To create a Linux VM with Accelerated Networking, see [Create a Linux VM with Accelerated Networking](create-vm-accelerated-networking-cli.md). Accelerated networking enables single root I/O virtualization (SR-IOV) to a VM, greatly improving its networking performance. This high-performance path bypasses the host from the datapath, reducing latency, jitter, and CPU utilization, for use with the most demanding network workloads on supported VM types. The following picture shows communication between two VMs with and without accelerated networking:

![Comparison](./media/create-vm-accelerated-networking/accelerated-networking.png)

Without accelerated networking, all networking traffic in and out of the VM must traverse the host and the virtual switch. The virtual switch provides all policy enforcement, such as network security groups, access control lists, isolation, and other network virtualized services to network traffic. To learn more about virtual switches, see [Hyper-V network virtualization and virtual switch](https://technet.microsoft.com/library/jj945275.aspx).

With accelerated networking, network traffic arrives at the VM's network interface (NIC), and is then forwarded to the VM. All network policies that the virtual switch applies are now offloaded and applied in hardware. Applying policy in hardware enables the NIC to forward network traffic directly to the VM, bypassing the host and the virtual switch, while maintaining all the policy it applied in the host.

The benefits of accelerated networking only apply to the VM that it is enabled on. For the best results, it is ideal to enable this feature on at least two VMs connected to the same Azure Virtual Network (VNet). When communicating across VNets or connecting on-premises, this feature has minimal impact to overall latency.

## Benefits
* **Lower Latency / Higher packets per second (pps):** Removing the virtual switch from the datapath removes the time packets spend in the host for policy processing and increases the number of packets that can be processed inside the VM.
* **Reduced jitter:** Virtual switch processing depends on the amount of policy that needs to be applied and the workload of the CPU that is doing the processing. Offloading the policy enforcement to the hardware removes that variability by delivering packets directly to the VM, removing the host to VM communication and all software interrupts and context switches.
* **Decreased CPU utilization:** Bypassing the virtual switch in the host leads to less CPU utilization for processing network traffic.

## Limitations and Constraints

### Supported operating systems
The following distributions are supported out of the box from the Azure Gallery:
* **Windows Server 2016 Datacenter** 
* **Windows Server 2012 R2 Datacenter**

### Supported VM instances
Accelerated Networking is supported on most general purpose and compute-optimized instance sizes with 2 or more vCPUs.  These supported series are: D/DSv2 and F/Fs

On instances that support hyperthreading, Accelerated Networking is supported on VM instances with 4 or more vCPUs. Supported series are: D/Dsv3, E/Esv3, Fsv2, Lsv2, Ms/Mms and Ms/Mmsv2.

For more information on VM instances, see [Windows VM sizes](../virtual-machines/windows/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

### Regions
Available in all public Azure regions and Azure Government Cloud.

### Enabling Accelerated Networking on a running VM
A supported VM size without accelerated networking enabled can only have the feature enabled when it is stopped and deallocated.

### Deployment through Azure Resource Manager
Virtual machines (classic) cannot be deployed with Accelerated Networking.

## Create a Windows VM with Azure Accelerated Networking
## Portal creation
Though this article provides steps to create a virtual machine with accelerated networking using Azure Powershell, you can also [create a virtual machine with accelerated networking using the Azure portal](../virtual-machines/linux/quick-create-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json). When creating a virtual machine in the portal, in the **Create a virtual machine** blade, choose the **Networking** tab.  In this tab, there is an option for **Accelerated networking**.  If you have chosen a [supported operating system](#supported-operating-systems) and [VM size](#supported-vm-instances), this option will automatically populate to "On."  If not, it will populate the "Off" option for Accelerated Networking and give the user a reason why it is not be enabled.   
* *Note:* Only supported operating systems can be enabled through the portal.  If you are using a custom image, and your image supports Accelerated Networking, please create your VM using CLI or Powershell. 

After the virtual machine is created, you can confirm Accelerated Networking is enabled by following the instructions in the Confirm that accelerated networking is enabled.

## Powershell creation
## Create a virtual network

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

Install [Azure PowerShell](/powershell/azure/install-az-ps) version 1.0.0 or later. To find your currently installed version, run `Get-Module -ListAvailable Az`. If you need to install or upgrade, install the latest version of the Az module from the [PowerShell Gallery](https://www.powershellgallery.com/packages/Az). In a PowerShell session, log in to an Azure account using [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount).

In the following examples, replace example parameter names with your own values. Example parameter names included *myResourceGroup*, *myNic*, and *myVM*.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.Resources/New-azResourceGroup). The following example creates a resource group named *myResourceGroup* in the *centralus* location:

```powershell
New-AzResourceGroup -Name "myResourceGroup" -Location "centralus"
```

First, create a subnet configuration with [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.Network/New-azVirtualNetworkSubnetConfig). The following example creates a subnet named *mySubnet*:

```powershell
$subnet = New-AzVirtualNetworkSubnetConfig `
    -Name "mySubnet" `
    -AddressPrefix "192.168.1.0/24"
```

Create a virtual network with [New-AzVirtualNetwork](/powershell/module/az.Network/New-azVirtualNetwork), with the *mySubnet* subnet.

```powershell
$vnet = New-AzVirtualNetwork -ResourceGroupName "myResourceGroup" `
    -Location "centralus" `
    -Name "myVnet" `
    -AddressPrefix "192.168.0.0/16" `
    -Subnet $Subnet
```

## Create a network security group

First, create a network security group rule with [New-AzNetworkSecurityRuleConfig](/powershell/module/az.Network/New-azNetworkSecurityRuleConfig).

```powershell
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

Create a network security group with [New-AzNetworkSecurityGroup](/powershell/module/az.Network/New-azNetworkSecurityGroup) and assign the *Allow-RDP-All* security rule to it. In addition to the *Allow-RDP-All* rule, the network security group contains several default rules. One default rule disables all inbound access from the Internet, which is why the *Allow-RDP-All* rule is assigned to the network security group so that you can remotely connect to the virtual machine, once it's created.

```powershell
$nsg = New-AzNetworkSecurityGroup `
    -ResourceGroupName myResourceGroup `
    -Location centralus `
    -Name "myNsg" `
    -SecurityRules $rdp
```

Associate the network security group to the *mySubnet* subnet with [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.Network/Set-azVirtualNetworkSubnetConfig). The rule in the network security group is effective for all resources deployed in the subnet.

```powershell
Set-AzVirtualNetworkSubnetConfig `
    -VirtualNetwork $vnet `
    -Name 'mySubnet' `
    -AddressPrefix "192.168.1.0/24" `
    -NetworkSecurityGroup $nsg
```

## Create a network interface with accelerated networking
Create a public IP address with [New-AzPublicIpAddress](/powershell/module/az.Network/New-azPublicIpAddress). A public IP address isn't required if you don't plan to access the virtual machine from the Internet, but to complete the steps in this article, it is required.

```powershell
$publicIp = New-AzPublicIpAddress `
    -ResourceGroupName myResourceGroup `
    -Name 'myPublicIp' `
    -location centralus `
    -AllocationMethod Dynamic
```

Create a network interface with [New-AzNetworkInterface](/powershell/module/az.Network/New-azNetworkInterface) with accelerated networking enabled and assign the public IP address to the network interface. The following example creates a network interface named *myNic* in the *mySubnet* subnet of the *myVnet* virtual network and assigns the *myPublicIp* public IP address to it:

```powershell
$nic = New-AzNetworkInterface `
    -ResourceGroupName "myResourceGroup" `
    -Name "myNic" `
    -Location "centralus" `
    -SubnetId $vnet.Subnets[0].Id `
    -PublicIpAddressId $publicIp.Id `
    -EnableAcceleratedNetworking
```

## Create the virtual machine

Set your VM credentials to the `$cred` variable using [Get-Credential](/powershell/module/microsoft.powershell.security/get-credential):

```powershell
$cred = Get-Credential
```

First, define your VM with [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig). The following example defines a VM named *myVM* with a VM size that supports Accelerated Networking (*Standard_DS4_v2*):

```powershell
$vmConfig = New-AzVMConfig -VMName "myVm" -VMSize "Standard_DS4_v2"
```

For a list of all VM sizes and characteristics, see [Windows VM sizes](../virtual-machines/windows/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

Create the rest of your VM configuration with [Set-AzVMOperatingSystem](/powershell/module/az.compute/set-azvmoperatingsystem) and [Set-AzVMSourceImage](/powershell/module/az.compute/set-azvmsourceimage). The following example creates a Windows Server 2016 VM:

```powershell
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

Attach the network interface that you previously created with [Add-AzVMNetworkInterface](/powershell/module/az.compute/add-azvmnetworkinterface):

```powershell
$vmConfig = Add-AzVMNetworkInterface -VM $vmConfig -Id $nic.Id
```

Finally, create your VM with [New-AzVM](/powershell/module/az.compute/new-azvm):

```powershell
New-AzVM -VM $vmConfig -ResourceGroupName "myResourceGroup" -Location "centralus"
```

## Confirm the driver is installed in the operating system

Once you create the VM in Azure, connect to the VM and confirm that the driver is installed in Windows.

1. From an Internet browser, open the Azure [portal](https://portal.azure.com) and sign in with your Azure account.
2. In the box that contains the text *Search resources* at the top of the Azure portal, type *myVm*. When **myVm** appears in the search results, click it. If **Creating** is visible under the **Connect** button, Azure has not yet finished creating the VM. Click **Connect** in the top left corner of the overview only after you no longer see **Creating** under the **Connect** button.
3. Enter the username and password you entered in [Create the virtual machine](#create-the-virtual-machine). If you've never connected to a Windows VM in Azure, see [Connect to virtual machine](../virtual-machines/windows/quick-create-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json#connect-to-virtual-machine).
4. Right-click the Windows Start button and click **Device Manager**. Expand the **Network adapters** node. Confirm that the **Mellanox ConnectX-3 Virtual Function Ethernet Adapter** appears, as shown in the following picture:

    ![Device Manager](./media/create-vm-accelerated-networking/device-manager.png)

Accelerated Networking is now enabled for your VM.

## Enable Accelerated Networking on existing VMs
If you have created a VM without Accelerated Networking, it is possible to enable this feature on an existing VM.  The VM must support Accelerated Networking by meeting the following prerequisites that are also outlined above:

* The VM must be a supported size for Accelerated Networking
* The VM must be a supported Azure Gallery image (and kernel version for Linux)
* All VMs in an availability set or VMSS must be stopped/deallocated before enabling Accelerated Networking on any NIC

### Individual VMs & VMs in an availability set
First stop/deallocate the VM or, if an Availability Set, all the VMs in the Set:

```azurepowershell
Stop-AzureRmVM -ResourceGroup "myResourceGroup" `
	-Name "myVM"
```

Important, please note, if your VM was created individually, without an availability set, you only need to stop/deallocate the individual VM to enable Accelerated Networking.  If your VM was created with an availability set, all VMs contained in the availability set will need to be stopped/deallocated before enabling Accelerated Networking on any of the NICs. 

Once stopped, enable Accelerated Networking on the NIC of your VM:

```azurepowershell
$nic = Get-AzureRMNetworkInterface -ResourceGroupName "myResourceGroup" `
    -Name "myNic"

$nic.EnableAcceleratedNetworking = $true

$nic | Set-AzureRMNetworkInterface
```

Restart your VM or, if in an availability set, all the VMs in the set, and confirm that Accelerated Networking is enabled:

```azurepowershell
Start-AzureRmVM -ResourceGroup "myResourceGroup" `
	-Name "myVM"
```

### VMSS
VMSS is slightly different but follows the same workflow.  First, stop the VMs:

```azurepowershell
Stop-AzVmss -ResourceGroupName "myResourceGroup" `
    -VMScaleSetName "myScaleSet"
```

Once the VMs are stopped, update the Accelerated Networking property under the network interface:

```azurepowershell
$vmss = Get-AzVmss -ResourceGroupName "myResourceGroup" `
    -VMScaleSetName "myScaleSet"

$vmss.VirtualMachineProfile.NetworkProfile.NetworkInterfaceConfigurations[0].EnableAcceleratedNetworking = $true

Update-AzVmss -ResourceGroupName "myResourceGroup" `
    -VMScaleSetName "myScaleSet" `
    -VirtualMachineScaleSet $vmss
```

Please note, a VMSS has VM upgrades that apply updates using three different settings, automatic, rolling and manual.  In these instructions the policy is set to automatic so that the VMSS will pick up the changes immediately after restarting.  To set it to automatic so that the changes are immediately picked up:

```azurepowershell
$vmss.UpgradePolicy.AutomaticOSUpgrade = $true

Update-AzVmss -ResourceGroupName "myResourceGroup" `
    -VMScaleSetName "myScaleSet" `
    -VirtualMachineScaleSet $vmss
```

Finally, restart the VMSS:

```azurepowershell
Start-AzVmss -ResourceGroupName "myResourceGroup" `
    -VMScaleSetName "myScaleSet"
```

Once you restart, wait for the upgrades to finish but once completed, the VF will appear inside the VM.  (Please make sure you are using a supported OS and VM size)

### Resizing existing VMs with Accelerated Networking

VMs with Accelerated Networking enabled can only be resized to VMs that support Accelerated Networking.  

A VM with Accelerated Networking enabled cannot be resized to a VM instance that does not support Accelerated Networking using the resize operation.  Instead, to resize one of these VMs:

* Stop/Deallocate the VM or if in an availability set/VMSS, stop/deallocate all the VMs in the set/VMSS.
* Accelerated Networking must be disabled on the NIC of the VM or if in an availability set/VMSS, all VMs in the set/VMSS.
* Once Accelerated Networking is disabled, the VM/availability set/VMSS can be moved to a new size that does not support Accelerated Networking and restarted.
