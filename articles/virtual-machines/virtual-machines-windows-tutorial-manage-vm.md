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

In this tutorial, you create a virtual machine and perform common management tasks such as adding a disk, automating software installation, managing firewall rules, and creating a virtual machine snapshot.

To complete this tutorial, make sure that you have installed the latest [Azure PowerShell](https://docs.microsoft.com/powershell/azureps-cmdlets-docs/) module. 

## Step 1 – Log in to Azure

First, log in to your Azure subscription with the Login-AzureRmAccount command and follow the on-screen directions.

```powershell
Login-AzureRmAccount
```

## Step 2 - Create resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed. A resource group must be created before a virtual machine.

Create a resource group with [New-AzureRmResourceGroup](https://docs.microsoft.com/powershell/resourcemanager/AzureRM.Resources/v2.0.3/new-azurermresourcegroup).  In this example, a resource group named `myResourceGroup` is created in the `westeurope` region: 

```powershell
New-AzureRmResourceGroup -ResourceGroupName myResourceGroup -Location westeurope
```

## Step 3 - Create virtual machine

### Create virtual network

Create a subnet with [New-AzureRmVirtualNetworkSubnetConfig](https://docs.microsoft.com/powershell/resourcemanager/azurerm.network/v3.6.0/new-azurermvirtualnetworksubnetconfig):

```powershell
$subnetConfig = New-AzureRmVirtualNetworkSubnetConfig `
  -Name mySubnet `
  -AddressPrefix 192.168.1.0/24
```

Create a virtual network [New-AzureRmVirtualNetwork](https://docs.microsoft.com/powershell/resourcemanager/azurerm.network/v3.6.0/new-azurermvirtualnetwork):

```powershell
$vnet = New-AzureRmVirtualNetwork `
  -ResourceGroupName myResourceGroup `
  -Location westeurope `
  -Name myVnet `
  -AddressPrefix 192.168.0.0/16 `
  -Subnet $subnetConfig
```
### Create public IP address

Create a public IP address with [New-AzureRmPublicIpAddress](https://docs.microsoft.com/powershell/resourcemanager/azurerm.network/v3.6.0/new-azurermpublicipaddress):

```powershell
$pip = New-AzureRmPublicIpAddress `
  -ResourceGroupName myResourceGroup `
  -Location westeurope `
  -AllocationMethod Static `
  -Name myPublicIPAddress
```

### Create network interface card

Create a network interface card with [New-AzureRmNetworkInterface](https://docs.microsoft.com/powershell/resourcemanager/azurerm.network/v3.6.0/new-azurermnetworkinterface):

```powershell
$nic = New-AzureRmNetworkInterface `
  -ResourceGroupName myResourceGroup `
  -Location westeurope `
  -Name myNic `
  -SubnetId $vnet.Subnets[0].Id `
  -PublicIpAddressId $pip.Id
```

### Create network security group

An Azure [network security group](../virtual-network/virtual-networks-nsg.md) (NSG) controls inbound and outbound traffic for one or many virtual machines. Network security group rules allow or deny network traffic on a specific port or port range. These rules can also include a source address prefix so that only traffic originating at a predefined source can communicate with a virtual machine. To access the IIS webserver that you are installing, you must add an inbound NSG rule. 

To create an inbound NSG rule, use [Add-AzureRmNetworkSecurityRuleConfig](https://docs.microsoft.com/powershell/resourcemanager/azurerm.network/v3.6.0/add-azurermnetworksecurityruleconfig). The following example creates an NSG rule named `myNSGRule` that opens port `80` for the virtual machine:

```powershell
$nsgRule = New-AzureRmNetworkSecurityRuleConfig `
  -Name myNSGRule `
  -Protocol Tcp `
  -Direction Inbound `
  -Priority 1000 `
  -SourceAddressPrefix * `
  -SourcePortRange * `
  -DestinationAddressPrefix * `
  -DestinationPortRange 80 `
  -Access Allow
```

Create the NSG using `myNSGRule` with [New-AzureRmNetworkSecurityGroup](https://docs.microsoft.com/powershell/resourcemanager/azurerm.network/v3.6.0/new-azurermnetworksecuritygroup):

```powershell
$nsg = New-AzureRmNetworkSecurityGroup `
  -ResourceGroupName myResourceGroup `
  -Location westeurope `
  -Name myNetworkSecurityGroup `
  -SecurityRules $nsgRule
```

Add the NSG to the subnet in the virtual network with [Set-AzureRmVirtualNetworkSubnetConfig](https://docs.microsoft.com/powershell/resourcemanager/azurerm.network/v3.6.0/set-azurermvirtualnetworksubnetconfig):

```powershell
Set-AzureRmVirtualNetworkSubnetConfig -Name mySubnet `
  -VirtualNetwork $vnet `
  -NetworkSecurityGroup $nsg `
  -AddressPrefix 192.168.1.0/24
```

Update the virtual network with [Set-AzureRmVirtualNetwork](https://docs.microsoft.com/powershell/resourcemanager/azurerm.network/v3.6.0/set-azurermvirtualnetwork):

```powershell
Set-AzureRmVirtualNetwork -VirtualNetwork $vnet
```

### Create virtual machine

When creating a virtual machine, several options are available such as operating system image, disk sizing, and administrative credentials. In this example, a virtual machine is created with a name of `myVM` running the latest version of Windows Server 2016 Datacenter. 

Get the username and password needed for the administrator account on the virtual machine with [Get-Credential](https://msdn.microsoft.com/powershell/reference/5.1/microsoft.powershell.security/Get-Credential):

```powershell
$cred = Get-Credential
```

Create the initial configuration for the virtual machine with [New-AzureRmVMConfig](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/new-azurermvmconfig):

```powershell
$vm = New-AzureRmVMConfig -VMName myVM -VMSize Standard_D1
```

Add the operating system information to the virtual machine configuration with [Set-AzureRmVMOperatingSystem](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/set-azurermvmoperatingsystem):

```powershell
$vm = Set-AzureRmVMOperatingSystem -VM $vm `
  -Windows `
  -ComputerName myVM `
  -Credential $cred `
  -ProvisionVMAgent `
  -EnableAutoUpdate
```

Add the image information to the virtual machine configuration with [Set-AzureRmVMSourceImage](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/set-azurermvmsourceimage):

```powershell
$vm = Set-AzureRmVMSourceImage -VM $vm `
  -PublisherName MicrosoftWindowsServer `
  -Offer WindowsServer `
  -Skus 2016-Datacenter `
  -Version latest
```

Add the operating system disk settings to the virtual machine configuration with [Set-AzureRmVMOSDisk](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/set-azurermvmosdisk):

```powershell
$vm = Set-AzureRmVMOSDisk -VM $vm `
  -Name myOsDisk `
  -StorageAccountType StandardLRS `
  -DiskSizeInGB 128 `
  -CreateOption FromImage `
  -Caching ReadWrite
```

Add the network interface card that you previously created to the virtual machine configuration with [Add-AzureRmVMNetworkInterface](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/add-azurermvmnetworkinterface):

```powershell
$vm = Add-AzureRmVMNetworkInterface -VM $vm -Id $nic.Id
```

Create the virtual machine with [New-AzureRmVM](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/new-azurermvm):

```powershell
New-AzureRmVM -ResourceGroupName myResourceGroup -Location westeurope -VM $vm
```

## Step 4 – Add data disk

By default, Azure virtual machines are created with a single operating system disk. Additional disks can be added for multi-disk storage configuration, application installation, and data. 

### Create disk 

Create the initial configuration of the data disk with [New-AzureRmDiskConfig](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/new-azurermdiskconfig). The following example creates a disk named `myDataDisk` that is 50 gigabytes in size:

```powershell
$diskConfig = New-AzureRmDiskConfig `
  -AccountType StandardLRS `
  -Location westeurope `
  -CreateOption Empty `
  -DiskSizeGB 50
```

Create the data disk with [New-AzureRmDisk](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/new-azurermdisk):

```powershell
$dataDisk = New-AzureRmDisk `
  -ResourceGroupName myResourceGroup `
  -DiskName myDataDisk `
  -Disk $diskConfig
```

Get the virtual machine that you want to add the data disk to with [Get-AzureRmVM](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/get-azurermvm):

```powershell
$vm = Get-AzureRmVM -ResourceGroupName myResourceGroup -Name myVM
```

Add the data disk to the virtual machine configuration with [Add-AzureRmVMDataDisk](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/add-azurermvmdatadisk):

```powershell
$vm = Add-AzureRmVMDataDisk `
  -VM $vm `
  -Name myDataDisk `
  -CreateOption Attach `
  -ManagedDiskId $dataDisk.Id `
  -Lun 1
```

Update the virtual machine with [Update-AzureRmVM](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/update-azurermvm):

```powershell
Update-AzureRmVM -ResourceGroupName myResourceGroup -VM $vm
```

## Step 5 – Automate configuration

Azure virtual machine extensions are used to automate virtual machine configuration tasks such as installing applications and configuring the operating system. The [custom script extension for Windows](./virtual-machines-windows-extensions-customscript.md) is used to run any PowerShell script on the virtual machine. The script can be stored in Azure storage, any accessible HTTP endpoint, or embedded in the custom script extension configuration. In this tutorial, the configurations of two items are automated:

- Installing IIS
- Formatting a data disk on the VM

Because the extension runs at VM deployment time, the **configure.ps1** file needs to be defined before creating the virtual machine. For this tutorial, the configure.ps1 file is located in the Azure PowerShell scripts repository. The file contains the following commands:

```powershell
Add-WindowsFeature Web-Server

Get-Disk | Where partitionstyle -eq 'raw' | Initialize-Disk -PartitionStyle MBR -PassThru | New-Partition -AssignDriveLetter -UseMaximumSize | Format-Volume -FileSystem NTFS -NewFileSystemLabel "myDataDisk" -Confirm:$false
```

Run the custom script extenstion to install IIS and format the data disk:

```powershell
Set-AzureRmVMCustomScriptExtension  -VMName myVM `
  -ResourceGroupName myResourceGroup `
  -Name myCustomScript ` 
  -FileUri "https://azuresamples,...blob.core.windows.net/scripts/configure.ps1" `
  -Run "configure.ps1" ` 
  -Location westeurope
```

Get the public IP address of the virtual machine with [Get-AzureRmPublicIPAddress](https://docs.microsoft.com/powershell/resourcemanager/azurerm.network/v3.6.0/get-azurermpublicipaddress):

```powershell
Get-AzureRmPublicIPAddress -ResourceGroupName myResourceGroup -Name myPublicIPAddress | select IpAddress
```

Now browse to the public IP address of the virtual machine. With the NSG rule in place, the default IIS website is displayed.

![IIS default site](./media/virtual-machines-windows-tutorial-manage-vm/iis.png)  

## Step 6 – Snapshot virtual machine

Taking a snapshot of a virtual machine creates a read only, point-in-time copy of the virtual machines operating system disk. With a snapshot, the virtual machine can be restored to a specific state, or the snapshot can be used to create a new virtual machine with an identical state. 

### Create snapshot

Before creating a virtual machine disk snapshot, the Id of the operating system disk for the virtual machine is needed.

Get the operating system disk with [Get-AzureRmDisk](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/get-azurermdisk):

```powershell
$vmOSDisk = Get-AzureRmDisk -ResourceGroupName myResourceGroup -Name myOSDisk
```

Create the configuration of the snapshot with New-AzureRmSnapshotConfig:

```powershell
$snapshotConfig = New-AzureRmSnapshotConfig -Location westeurope -CreateOption Copy -SourceResourceId $vmOSDisk.id
```

Create the snapshot with New-AzureRmSnapshot:

```powershell
$snapshot = New-AzureRmSnapshot -ResourceGroupName myResourceGroup -SnapshotName mySnapshot -Snapshot $snapshotConfig
```

### Create disk from snapshot

This snapshot can then be converted into a disk, which can be used to recreate the virtual machine.

Create the configuration of the disk with [New-AzureRmDiskConfig](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/new-azurermdiskconfig):

```powershell
$diskConfig = New-AzureRmDiskConfig -Location westeurope -CreateOption Copy -SourceResourceId $snapshot.id
```

Create the disk with [New-AzureRmDisk](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/new-azurermdisk):

```powershell
$disk = New-AzureRmDisk -ResourceGroupName myResourceGroup -DiskName myOSDiskFromSnapshot -Disk $diskConfig
```

### Restore virtual machine from snapshot

To demonstrate virtual machine recovery, delete the existing virtual machine. 

```powershell
Remove-AzureRmVM -ResourceGroupName myResourceGroup -Name myVM -Force
```

Create a new virtual machine from the snapshot disk. In this example, the existing network interface is being specified. This configuration applies all previously created NSG rules to the new virtual machine.

Create the initial configuration for the virtual machine with [New-AzureRmVMConfig](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/new-azurermvmconfig):

```powershell
$vm = New-AzureRmVMConfig -VMName myVM -VMSize Standard_D1
```

Add the operating system disk with [Set-AzureRmVMOSDisk](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/set-azurermvmosdisk):

```powershell
$vm = Set-AzureRmVMOSDisk -VM $vm -CreateOption Attach -ManagedDiskId $disk.Id -Windows
```

Add the network interface card with [Add-AzureRmVMNetworkInterface](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/add-azurermvmnetworkinterface):

```powershell
$vm = Add-AzureRmVMNetworkInterface -VM $vm -Id $nic.Id
```

Create the virtual machine with [New-AzureRmVM](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/new-azurermvm):

```powershell
New-AzureRmVM -ResourceGroupName myResourceGroup -VM $vm -Location westeurope
```

Enter the public IP address of the virtual machine into the address bar of the internet browser. You should see that IIS is running in the restored virtual machine. 

## Step 7 – Management tasks

During the lifecycle of a virtual machine, you may want to run management tasks such as starting, stopping, or deleting a virtual machine. Additionally, you may want to create scripts to automate repetitive or complex tasks. Using Azure PowerShell, many common management tasks can be run from the command line or in scripts. 

### Stop virtual machine

Stop and deallocate a virtual machine with [Stop-AzureRmVM](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/stop-azurermvm):

```powershell
Stop-AzureRmVM -ResourceGroupName myResourceGroup -Name myVM -Force
```

If you want to keep the virtual machine in a provisioned state, use the -StayProvisioned parameter.

### Resize virtual machine

To resize a stopped and deallocated virtual machine, you need the name of the sizes available in the chosen Azure region. These sizes can be found with[Get-AzureRmVMSize](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/get-azurermvmsize):

```powershell
Get-AzureRmVMSize -Location westeurope
```

Get the virtual machine that you want to resize with [Get-AzureRmDisk](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/get-azurermdisk):

```powershell
$vm = Get-AzureRmVM -Name myVM -ResourceGroupName myResourceGroup
```

Set the new size of the virtual machine by setting the vmSize property with the size that you selected.

```powershell
$vm.HardwareProfile.vmSize = "Standard_F4s"
```

Update the virtual machine with [Update-AzureRmVM](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/update-azurermvm):

```powershell
Update-AzureRmVM -ResourceGroupName myResourceGroup -VM $vm
```

### Start virtual machine

```powershell
Start-AzureRmVM -ResourceGroupName myResourceGroup -Name myVM
```

### Delete resource group

Deleting a resource group also deletes all resources contained within.

```powershell
Remove-AzureRmResourceGroup -Name myResourceGroup -Force
```

## Next Steps

Samples – [Azure Virtual Machine PowerShell sample scripts](./virtual-machines-windows-powershell-samples.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)