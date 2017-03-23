---
title: Manage Windows virtual machines with Azure PowerShell | Microsoft Docs
description: Tutorial - Manage Windows virtual machines with Azure PowerShell
services: virtual-machines-windows
documentationcenter: virtual-machines
author: davidmu1
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 03/21/2017
ms.author: davidmu
---

# Manage Windows virtual machines with Azure PowerShell

In this tutorial, you will create a virtual machine and perform many common management tasks such as adding a disk, automating software installation, managing firewall rules, and creating a virtual machine snapshot.

To complete this tutorial, make sure that you have installed the latest [Azure PowerShell](https://docs.microsoft.com/powershell/azureps-cmdlets-docs/) module. 

## Step 1 – Create a virtual machine

First, log in to your Azure subscription with the Login-AzureRmAccount command and follow the on-screen directions.

```powershell
Login-AzureRmAccount
```

Create a resource group with the [New-AzureRmResourceGroup](https://docs.microsoft.com/powershell/resourcemanager/AzureRM.Resources/v2.0.3/new-azurermresourcegroup) command. 

An Azure resource group is a logical container into which Azure resources are deployed and managed. A resource group must be created before a virtual machine. In this example, a resource group named `myResourceGroup` is created in the `westeurope` region. 

```powershell
New-AzureRmResourceGroup -ResourceGroupName myResourceGroup -Location westeurope
```

### Create the virtual network, public IP address, and network interface card

Create a subnet with the [New-AzureRmVirtualNetworkSubnetConfig](https://docs.microsoft.com/powershell/resourcemanager/azurerm.network/v3.6.0/new-azurermvirtualnetworksubnetconfig) command.

```powershell
$subnetConfig = New-AzureRmVirtualNetworkSubnetConfig -Name mySubnet -AddressPrefix 192.168.1.0/24
```

Create a virtual network with the [New-AzureRmVirtualNetwork](https://docs.microsoft.com/powershell/resourcemanager/azurerm.network/v3.6.0/new-azurermvirtualnetwork) command.

```powershell
$vnet = New-AzureRmVirtualNetwork -ResourceGroupName myResourceGroup -Location westeurope -Name myVnet -AddressPrefix 192.168.0.0/16 -Subnet $subnetConfig
```

Create a public IP address with the [New-AzureRmPublicIpAddress](https://docs.microsoft.com/powershell/resourcemanager/azurerm.network/v3.6.0/new-azurermpublicipaddress) command.

```powershell
$pip = New-AzureRmPublicIpAddress -ResourceGroupName myResourceGroup -Location westeurope -AllocationMethod Static -IdleTimeoutInMinutes 4 -Name myPublicIPAddress
```

Get the subnet that you previously created with the [Get-AzureRmVirtualNetworkSubnetConfig](https://docs.microsoft.com/powershell/resourcemanager/AzureRM.Network/v3.6.0/get-azurermvirtualnetworksubnetconfig) command.

```powershell
$subnet = Get-AzureRmVirtualNetworkSubnetConfig -Name mySubnet -VirtualNetwork $vnet
```

Create a network interface card with the [New-AzureRmNetworkInterface](https://docs.microsoft.com/powershell/resourcemanager/azurerm.network/v3.6.0/new-azurermnetworkinterface) command.

```powershell
$nic = New-AzureRmNetworkInterface -ResourceGroupName myResourceGroup -Location westeurope -Name myNic -Subnet $subnet -PublicIpAddress $pip
```

### Create the virtual machine

When creating a virtual machine, several options are available such as operating system image, disk sizing, and administrative credentials. In this example, a virtual machine is created with a name of `myVM` running the latest version of Windows Server 2016 Datacenter. 

Get the credentials that are needed for the administrator account on the virtual machine with the [Get-Credential](https://msdn.microsoft.com/powershell/reference/5.1/microsoft.powershell.security/Get-Credential) command.

```powershell
$cred = Get-Credential
```

Enter the username and password that you want to use for the administrator account on the virtual machine.

Create the initial configuration for the virtual machine with the [New-AzureRmVMConfig](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/new-azurermvmconfig) command.

```powershell
$vm = New-AzureRmVMConfig -VMName myVM -VMSize Standard_D1
```

Add the operating system information to the virtual machine configuration with the [Set-AzureRmVMOperatingSystem](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/set-azurermvmoperatingsystem) command.

```powershell
$vm = Set-AzureRmVMOperatingSystem -VM $vm -Windows -ComputerName myVM -Credential $cred -ProvisionVMAgent -EnableAutoUpdate
```

Add the image information to the virtual machine configuration with the [Set-AzureRmVMSourceImage](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/set-azurermvmsourceimage) command.

```powershell
$vm = Set-AzureRmVMSourceImage -VM $vm -PublisherName MicrosoftWindowsServer -Offer WindowsServer -Skus 2016-Datacenter -Version latest
```

Add the operating system disk settings to the virtual machine configuration with the [Set-AzureRmVMOSDisk](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/set-azurermvmosdisk) command.

```powershell
$vm = Set-AzureRmVMOSDisk -VM $vm -Name "myOsDisk" -StorageAccountType StandardLRS -DiskSizeInGB 128 -CreateOption FromImage -Caching ReadWrite
```

Add the network interface card that you previously created to the virtual machine configuration with the [Add-AzureRmVMNetworkInterface](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/add-azurermvmnetworkinterface) command.

```powershell
$vm = Add-AzureRmVMNetworkInterface -VM $vm -Id $nic.Id
```

Create the virtual machine with the [New-AzureRmVM](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/new-azurermvm) command.

```powershell
New-AzureRmVM -ResourceGroupName myResourceGroup -Location westeurope -VM $vm
```

## Step 2 – Add a data disk

By default, Azure virtual machines are created with a single operating system disk. Additional disks can be added for multi-disk storage configuration, application installation, and data. 

### Create and attach disk 

The following example creates a disk named `myDataDisk` that is 50 gigabytes in size. This disk is also attached to the virtual machine.  

Create the initial configuration of the data disk with the [New-AzureRmDiskConfig](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/new-azurermdiskconfig) command.

```powershell
$diskConfig = New-AzureRmDiskConfig -AccountType StandardLRS -Location westeurope -CreateOption Empty -DiskSizeGB 50
```

Create the data disk with the [New-AzureRmDisk](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/new-azurermdisk) command.

```powershell
$dataDisk = New-AzureRmDisk -ResourceGroupName myResourceGroup -DiskName myDataDisk -Disk $diskConfig
```

Get the virtual machine that you want to add the data disk to with the [Get-AzureRmVM](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/get-azurermvm) command.

```powershell
$vm = Get-AzureRmVM -ResourceGroupName myResourceGroup -Name myVM
```

Add the data disk to the virtual machine configuration with the [Add-AzureRmVMDataDisk](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/add-azurermvmdatadisk) command.

```powershell
$vm = Add-AzureRmVMDataDisk -VM $vm -Name myDataDisk -CreateOption Attach -ManagedDiskId $dataDisk.Id -Lun 1
```

Update the virtual machine with the [Update-AzureRmVM](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/update-azurermvm) command.

```powershell
Update-AzureRmVM -ResourceGroupName myResourceGroup -VM $vm
```

### Configure disk

Once the disk has been attached to the virtual machine, the operating system needs to be configured to use the disk. 

An Azure [network security group](../virtual-network/virtual-networks-nsg.md) (NSG) controls inbound and outbound traffic for one or many virtual machines. Network security group rules allow or deny network traffic on a specific port or port range. These rules can also include a source address prefix so that only traffic originating at a predefined source can communicate with a virtual machine.

Create an NSG rule to enable a Remote Desktop session with the [New-AzureRmNetworkSecurityRuleConfig](https://docs.microsoft.com/powershell/resourcemanager/azurerm.network/v3.6.0/new-azurermnetworksecurityruleconfig) command.  

```powershell
$nsgRuleRDP = New-AzureRmNetworkSecurityRuleConfig -Name myRDPRule -Protocol Tcp -Direction Inbound -Priority 1000 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * -DestinationPortRange 3389 -Access Allow
```

Create the NSG using the rule that you previously created with the [New-AzureRmNetworkSecurityGroup](https://docs.microsoft.com/powershell/resourcemanager/azurerm.network/v3.6.0/new-azurermnetworksecuritygroup) command.

```powershell
$nsg = New-AzureRmNetworkSecurityGroup -ResourceGroupName myResourceGroup -Location westeurope -Name myNetworkSecurityGroup -SecurityRules $nsgRuleRDP
```

Get the virtual network with the [Get-AzureRmVirtualNetwork](https://docs.microsoft.com/powershell/resourcemanager/azurerm.network/v3.6.0/get-azurermvirtualnetwork) command.

```powershell
$vnet = Get-AzureRmVirtualNetwork -ResourceGroupName myResourceGroup -Name myVnet
```

Add the NSG to the subnet in the virtual network with the [Set-AzureRmVirtualNetworkSubnetConfig](https://docs.microsoft.com/powershell/resourcemanager/azurerm.network/v3.6.0/set-azurermvirtualnetworksubnetconfig) command.

```powershell
Set-AzureRmVirtualNetworkSubnetConfig -VirtualNetwork $vnet -Name mySubnet -NetworkSecurityGroup $nsg -AddressPrefix 192.168.1.0/24
```

Update the virtual network with the [Set-AzureRmVirtualNetwork](https://docs.microsoft.com/powershell/resourcemanager/azurerm.network/v3.6.0/set-azurermvirtualnetwork) command.

```powershell
Set-AzureRmVirtualNetwork -VirtualNetwork $vnet
```

Open a Remote Desktop session with the [Get-AzureRmRemoteDesktopFile](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/get-azurermremotedesktopfile) command.

```powershell
Get-AzureRmRemoteDesktopFile -ResourceGroupName myResourceGroup -Name myVM -Launch
```

Open Windows PowerShell on the virtual machine and initialize and format the data disk with these commands.

```powershell
Get-Disk | Where partitionstyle -eq 'raw' | Initialize-Disk -PartitionStyle MBR -PassThru | New-Partition -AssignDriveLetter -UseMaximumSize | Format-Volume -FileSystem NTFS -NewFileSystemLabel "myDataDisk" -Confirm:$false
```

Close the Remote Desktop session. 

## Step 3 – Automate configuration

Azure virtual machine extensions are used to automate virtual machine configuration tasks such as installing monitoring agents, anti-virus agents, and configuring the operating system. The [custom script extension for Windows](./virtual-machines-windows-extensions-customscript.md) is used to run any PowerShell script on the virtual machine. The script can be stored in Azure storage, any accessible HTTP endpoint, or embedded in the custom script extension configuration. When using the custom script extension, the Azure VM agent manages the script execution.

### Install software

Use the [Set-AzureRmVMCustomScriptExtension](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/set-azurermvmcustomscriptextension) command to install the custom script extension. 

In this case, a simple script is embedded in the extension configuration. The extension runs `powershell Add-WindowsFeature Web-Server` to install the IIS webserver.

```powershell
Set-AzureRmVMExtension -ResourceGroupName myResourceGroup -ExtensionName IIS -VMName myVM -Publisher Microsoft.Compute -ExtensionType CustomScriptExtension -TypeHandlerVersion 1.4 -SettingString '{"commandToExecute":"powershell Add-WindowsFeature Web-Server"}' -Location westeurope
```

Get the public IP address of the virtual machine with the [Get-AzureRmPublicIPAddress](https://docs.microsoft.com/powershell/resourcemanager/azurerm.network/v3.6.0/get-azurermpublicipaddress) command.

```powershell
Get-AzureRmPublicIPAddress -ResourceGroupName myResourceGroup -Name myPublicIPAddress
```

Open an internet browser and enter the public IP address of the virtual machine into the address bar. Even though IIS has been installed, the default site is not accessible. This is addressed in the next section of this tutorial. 

## Step 4 – Configure firewall

In a previous section the IIS webserver was installed. Without a network security group rule to allow inbound traffic on port 80, the webserver cannot be accessed from the internet. This step walks you through creating the NSG rule to allow inbound connections on port 80.

### Add NSG rule

To access the IIS webserver, you must add an inbound NSG rule to the NSG that you previously created. The following example opens port `80` for the virtual machine.

Get the NSG with the [Get-AzureRmNetworkSecurityGroup](https://docs.microsoft.com/powershell/resourcemanager/azurerm.network/v3.6.0/get-azurermnetworksecuritygroup) command.

```powershell
$securityGroup = Get-AzureRmNetworkSecurityGroup -ResourceGroupName myResourceGroup -Name myNetworkSecurityGroup 
```

Add the new rule to the NSG with the [Add-AzureRmNetworkSecurityRuleConfig](https://docs.microsoft.com/powershell/resourcemanager/azurerm.network/v3.6.0/add-azurermnetworksecurityruleconfig) command.

```powershell
Add-AzureRmNetworkSecurityRuleConfig -NetworkSecurityGroup $securityGroup -Name myHTTPRule -Access Allow -Protocol Tcp -Direction Inbound -Priority 1010 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * -DestinationPortRange 80
```

Update the NSG with the [Set-AzureRmNetworkSecurityGroup](https://docs.microsoft.com/powershell/resourcemanager/azurerm.network/v3.6.0/set-azurermnetworksecuritygroup) command.

```powershell
Set-AzureRmNetworkSecurityGroup -NetworkSecurityGroup $securityGroup
```

Now browse to the public IP address of the virtual machine. With the NSG rule in place, the default IIS website is displayed.

![IIS default site](./media/virtual-machines-windows-tutorial-manage-vm/iis.png)  

## Step 5 – Snapshot virtual machine

Taking a snapshot of a virtual machines creates a read only, point-in-time copy of the virtual machines operating system disk. With a disk snapshot, the virtual machine can be quickly restored to a specific state, or the snapshot can be used to create a new virtual machine with an identical state. 

### Create snapshot

Before creating a virtual machine disk snapshot, the Id of the operating system disk for the virtual machine is needed.

Get the operating system disk with the [Get-AzureRmDisk](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/get-azurermdisk) command.

```powershell
$vmOSDisk = Get-AzureRmDisk -ResourceGroupName myResourceGroup -Name myOSDisk
```

Create the configuration of the snapshot with the New-AzureRmSnapshotConfig command.

```powershell
$snapshotConfig = New-AzureRmSnapshotConfig -Location westeurope -CreateOption Copy -SourceResourceId $vmOSDisk.id
```

Create the snapshot with the New-AzureRmSnapshot command.

```powershell
New-AzureRmSnapshot -ResourceGroupName myResourceGroup -SnapshotName mySnapshot -Snapshot $snapshotConfig
```

### Create disk from snapshot

This snapshot can then be converted into a disk which can be used to recreate the virtual machine.

Get the snapshot that you previously created with the Get-AzureRmSnapshot command.

```powershell
$snapshot = Get-AzureRmSnapshot -ResourceGroupName myResourceGroup -Name mySnapshot
```

Create the configuration of the disk with the [New-AzureRmDiskConfig](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/new-azurermdiskconfig) command.

```powershell
$diskConfig = New-AzureRmDiskConfig -Location westeurope -CreateOption Copy -SourceResourceId $snapshot.id
```

Create the disk with the [New-AzureRmDisk](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/new-azurermdisk) command.

```powershell
New-AzureRmDisk -ResourceGroupName myResourceGroup -DiskName myOSDiskFromSnapshot -Disk $diskConfig
```

### Restore virtual machine from snapshot

To demonstrate virtual machine recovery, delete the existing virtual machine. 

```powershell
Remove-AzureRmVM -ResourceGroupName myResourceGroup -Name myVM -Force
```

Create a new virtual machine from the snapshot disk. In this example, the existing network interface is being specified. This configuration will apply all previously created NSG rules to the new virtual machine.

Get the disk that you created from the snapshot with the [Get-AzureRmDisk](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/get-azurermdisk) command.

```powershell
$disk = Get-AzureRmDisk -ResourceGroupName myResourceGroup -Name myOSDiskFromSnapshot
```

Create the initial configuration for the virtual machine with the [New-AzureRmVMConfig](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/new-azurermvmconfig) command.

```powershell
$vm = New-AzureRmVMConfig -VMName myVM -VMSize Standard_D1
```

Add the operating system disk settings to the virtual machine configuration with the [Set-AzureRmVMOSDisk](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/set-azurermvmosdisk) command.

```powershell
$vm = Set-AzureRmVMOSDisk -VM $vm -CreateOption Attach -ManagedDiskId $disk.Id -Windows
```

Add the network interface card that you previously created to the virtual machine configuration with the [Add-AzureRmVMNetworkInterface](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/add-azurermvmnetworkinterface) command.

```powershell
$vm = Add-AzureRmVMNetworkInterface -VM $vm -Id $nic.Id
```

Create the virtual machine with the [New-AzureRmVM](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/new-azurermvm) command.

```powershell
New-AzureRmVM -ResourceGroupName myResourceGroup -VM $vm -Location westeurope
```

Get the public IP address of the new virtual machine with the [Get-AzureRmPublicIPAddress](https://docs.microsoft.com/powershell/resourcemanager/azurerm.network/v3.6.0/get-azurermpublicipaddress) command.

```powershell
Get-AzureRmPublicIPAddress -ResourceGroupName myResourceGroup -Name myPublicIPAddress
```

Enter the public IP address of the virtual machine into the address bar of the internet browser. You will see that IIS is running in the restored virtual machine. 

## Step 6 – Management tasks

During the lifecycle of a virtual machine, you may want to run management tasks such as starting, stopping, or deleting a virtual machine. Additionally, you may want to create scripts to automate repetitive or complex tasks. Using the Azure PowerShell, many common management tasks can be run from the command line or in scripts. 

### Resize virtual machine

To resize an Azure virtual machine, you will need to know the name of the sizes available in the chosen Azure region. These sizes can be found with the [Get-AzureRmVMSize](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/get-azurermvmsize) command.

```powershell
Get-AzureRmVMSize -Location westeurope
```

Get the virtual machine that you want to resize with the [Get-AzureRmDisk](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/get-azurermdisk) command.

```powershell
$vm = Get-AzureRmVM -Name myVM -ResourceGroupName myResourceGroup
```

Set the new size of the virtual machine by setting the vmSize property with the size that you selected.

```powershell
$vm.HardwareProfile.vmSize = "Standard_F4s"
```

Stop and deallocate the virtual machine before resizing with the Stop-AzureRmVM command.

```powershell
Stop-AzureRmVM -ResourceGroupName myResourceGroup -Name myVM -Force
```

Update the virtual machine with the [Update-AzureRmVM](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/update-azurermvm) command.

```powershell
Update-AzureRmVM -ResourceGroupName myResourceGroup -VM $vm
```

### Start virtual machine

```powershell
Start-AzureRmVM -ResourceGroupName myResourceGroup -Name myVM
```

### Stop virtual machine

```powershell
Stop-AzureRmVM -ResourceGroupName myResourceGroup -Name myVM -StayProvisioned -Force
```

### Delete resource goup

Deleting a resource group also deletes all resources contained within.

```powershell
Remove-AzureRmResourceGroup -Name myResourceGroup -Force
```

## Next Steps

Samples – [Azure Virtual Machine PowerShell sample scripts](./virtual-machines-windows-powershell-samples.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)