---
title: Guide to use Azure PowerShell to provision SQL Server on Azure VM
description: Provides steps and PowerShell commands for creating an Azure VM with SQL Server virtual machine gallery images.
services: virtual-machines-windows
documentationcenter: na
author: MashaMSFT
editor: ''
tags: azure-resource-manager
ms.assetid: 98d50dd8-48ad-444f-9031-5378d8270d7b
ms.service: virtual-machines-sql

ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 12/21/2018
ms.author: mathoma
ms.reviewer: jroth
---
# How to use Azure PowerShell to provision SQL Server on Azure Virtual Machines

[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This guide covers options for using PowerShell to provision SQL Server on Azure Virtual Machines (VMs). For a streamlined Azure PowerShell example that relies on default values, see the [SQL VM Azure PowerShell quickstart](sql-vm-create-powershell-quickstart.md).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [updated-for-az.md](../../../../includes/updated-for-az.md)]

## Configure your subscription

1. Open PowerShell and establish access to your Azure account by running the **Connect-AzAccount** command.

   ```powershell
   Connect-AzAccount
   ```

1. When prompted, enter your credentials. Use the same email and password that you use to sign in to the Azure portal.

## Define image variables

To reuse values and simplify script creation, start by defining a number of variables. Change the parameter values as you want, but be aware of naming restrictions related to name lengths and special characters when modifying the values provided.

### Location and resource group

Define the data region and the resource group where you want to create the other VM resources.

Modify as you want and then run these cmdlets to initialize these variables.

```powershell
$Location = "SouthCentralUS"
$ResourceGroupName = "sqlvm2"
```

### Storage properties

Define the storage account and the type of storage to be used by the virtual machine.

Modify as you want, and then run the following cmdlet to initialize these variables. We recommend using [premium SSDs](../../../virtual-machines/windows/disks-types.md#premium-ssd) for production workloads.

```powershell
$StorageName = $ResourceGroupName + "storage"
$StorageSku = "Premium_LRS"
```

### Network properties

Define the properties to be used by the network in the virtual machine. 

- Network interface
- TCP/IP allocation method
- Virtual network name
- Virtual subnet name
- Range of IP addresses for the virtual network
- Range of IP addresses for the subnet
- Public domain name label

Modify as you want and then run this cmdlet to initialize these variables.

```powershell
$InterfaceName = $ResourceGroupName + "ServerInterface"
$NsgName = $ResourceGroupName + "nsg"
$TCPIPAllocationMethod = "Dynamic"
$VNetName = $ResourceGroupName + "VNet"
$SubnetName = "Default"
$VNetAddressPrefix = "10.0.0.0/16"
$VNetSubnetAddressPrefix = "10.0.0.0/24"
$DomainName = $ResourceGroupName
```

### Virtual machine properties

Define the following properties:

- Virtual machine name
- Computer name
- Virtual machine size
- Operating system disk name for the virtual machine

Modify as you want and then run this cmdlet to initialize these variables.

```powershell
$VMName = $ResourceGroupName + "VM"
$ComputerName = $ResourceGroupName + "Server"
$VMSize = "Standard_DS13"
$OSDiskName = $VMName + "OSDisk"
```

### Choose a SQL Server image

Use the following variables to define the SQL Server image to use for the virtual machine. 

1. First, list all of the SQL Server image offerings with the `Get-AzVMImageOffer` command. This command lists the current images that are available in the Azure portal and also older images that can only be installed with PowerShell:

   ```powershell
   Get-AzVMImageOffer -Location $Location -Publisher 'MicrosoftSQLServer'
   ```

1. For this tutorial, use the following variables to specify SQL Server 2017 on Windows Server 2016.

   ```powershell
   $OfferName = "SQL2017-WS2016"
   $PublisherName = "MicrosoftSQLServer"
   $Version = "latest"
   ```

1. Next, list the available editions for your offer.

   ```powershell
   Get-AzVMImageSku -Location $Location -Publisher 'MicrosoftSQLServer' -Offer $OfferName | Select Skus
   ```

1. For this tutorial, use the SQL Server 2017 Developer edition (**SQLDEV**). The Developer edition is freely licensed for testing and development, and you only pay for the cost of running the VM.

   ```powershell
   $Sku = "SQLDEV"
   ```

## Create a resource group

With the Resource Manager deployment model, the first object that you create is the resource group. Use the [New-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/new-azresourcegroup) cmdlet to create an Azure resource group and its resources. Specify the variables that you previously initialized for the resource group name and location.

Run this cmdlet to create your new resource group.

```powershell
New-AzResourceGroup -Name $ResourceGroupName -Location $Location
```

## Create a storage account

The virtual machine requires storage resources for the operating system disk and for the SQL Server data and log files. For simplicity, you'll create a single disk for both. You can attach additional disks later using the [Add-Azure Disk](https://docs.microsoft.com/powershell/module/servicemanagement/azure/add-azuredisk) cmdlet to place your SQL Server data and log files on dedicated disks. Use the [New-AzStorageAccount](https://docs.microsoft.com/powershell/module/az.storage/new-azstorageaccount) cmdlet to create a standard storage account in your new resource group. Specify the variables that you previously initialized for the storage account name, storage SKU name, and location.

Run this cmdlet to create your new storage account.

```powershell
$StorageAccount = New-AzStorageAccount -ResourceGroupName $ResourceGroupName `
   -Name $StorageName -SkuName $StorageSku `
   -Kind "Storage" -Location $Location
```

> [!TIP]
> Creating the storage account can take a few minutes.

## Create network resources

The virtual machine requires a number of network resources for network connectivity.

* Each virtual machine requires a virtual network.
* A virtual network must have at least one subnet defined.
* A network interface must be defined with either a public or a private IP address.

### Create a virtual network subnet configuration

Start by creating a subnet configuration for your virtual network. For this tutorial, create a default subnet using the [New-AzVirtualNetworkSubnetConfig](https://docs.microsoft.com/powershell/module/az.network/new-azvirtualnetworksubnetconfig) cmdlet. Specify the variables that you previously initialized for the subnet name and address prefix.

> [!NOTE]
> You can define additional properties of the virtual network subnet configuration using this cmdlet, but that is beyond the scope of this tutorial.

Run this cmdlet to create your virtual subnet configuration.

```powershell
$SubnetConfig = New-AzVirtualNetworkSubnetConfig -Name $SubnetName -AddressPrefix $VNetSubnetAddressPrefix
```

### Create a virtual network

Next, create your virtual network in your new resource group using the [New-AzVirtualNetwork](https://docs.microsoft.com/powershell/module/az.network/new-azvirtualnetwork) cmdlet. Specify the variables that you previously initialized for the name, location, and address prefix. Use the subnet configuration that you defined in the previous step.

Run this cmdlet to create your virtual network.

```powershell
$VNet = New-AzVirtualNetwork -Name $VNetName `
   -ResourceGroupName $ResourceGroupName -Location $Location `
   -AddressPrefix $VNetAddressPrefix -Subnet $SubnetConfig
```

### Create the public IP address

Now that your virtual network is defined, you must configure an IP address for connectivity to the virtual machine. For this tutorial, create a public IP address using dynamic IP addressing to support Internet connectivity. Use the [New-AzPublicIpAddress](https://docs.microsoft.com/powershell/module/az.network/new-azpublicipaddress) cmdlet to create the public IP address in your new resource group. Specify the variables that you previously initialized for the name, location, allocation method, and DNS domain name label.

> [!NOTE]
> You can define additional properties of the public IP address using this cmdlet, but that is beyond the scope of this initial tutorial. You could also create a private address or an address with a static address, but that is also beyond the scope of this tutorial.

Run this cmdlet to create your public IP address.

```powershell
$PublicIp = New-AzPublicIpAddress -Name $InterfaceName `
   -ResourceGroupName $ResourceGroupName -Location $Location `
   -AllocationMethod $TCPIPAllocationMethod -DomainNameLabel $DomainName
```

### Create the network security group

To secure the VM and SQL Server traffic, create a network security group.

1. First, create a network security group rule for remote desktop (RDP) to allow RDP connections.

   ```powershell
   $NsgRuleRDP = New-AzNetworkSecurityRuleConfig -Name "RDPRule" -Protocol Tcp `
      -Direction Inbound -Priority 1000 -SourceAddressPrefix * -SourcePortRange * `
      -DestinationAddressPrefix * -DestinationPortRange 3389 -Access Allow
   ```
1. Configure a network security group rule that allows traffic on TCP port 1433. Doing so enables connections to SQL Server over the internet.

   ```powershell
   $NsgRuleSQL = New-AzNetworkSecurityRuleConfig -Name "MSSQLRule"  -Protocol Tcp `
      -Direction Inbound -Priority 1001 -SourceAddressPrefix * -SourcePortRange * `
      -DestinationAddressPrefix * -DestinationPortRange 1433 -Access Allow
   ```

1. Create the network security group.

   ```powershell
   $Nsg = New-AzNetworkSecurityGroup -ResourceGroupName $ResourceGroupName `
      -Location $Location -Name $NsgName `
      -SecurityRules $NsgRuleRDP,$NsgRuleSQL
   ```

### Create the network interface

Now you're ready to create the network interface for your virtual machine. Use the [New-AzNetworkInterface](https://docs.microsoft.com/powershell/module/az.network/new-aznetworkinterface) cmdlet to create the network interface in your new resource group. Specify the name, location, subnet, and public IP address previously defined.

Run this cmdlet to create your network interface.

```powershell
$Interface = New-AzNetworkInterface -Name $InterfaceName `
   -ResourceGroupName $ResourceGroupName -Location $Location `
   -SubnetId $VNet.Subnets[0].Id -PublicIpAddressId $PublicIp.Id `
   -NetworkSecurityGroupId $Nsg.Id
```

## Configure a VM object

Now that storage and network resources are defined, you're ready to define compute resources for the virtual machine.

- Specify the virtual machine size and various operating system properties.
- Specify the network interface that you previously created.
- Define blob storage.
- Specify the operating system disk.

### Create the VM object

Start by specifying the virtual machine size. For this tutorial, specify a DS13. Use the [New-AzVMConfig](https://docs.microsoft.com/powershell/module/az.compute/new-azvmconfig) cmdlet to create a configurable virtual machine object. Specify the variables that you previously initialized for the name and size.

Run this cmdlet to create the virtual machine object.

```powershell
$VirtualMachine = New-AzVMConfig -VMName $VMName -VMSize $VMSize
```

### Create a credential object to hold the name and password for the local administrator credentials

Before you can set the operating system properties for the virtual machine, you must supply the credentials for the local administrator account as a secure string. To accomplish this, use the [Get-Credential](https://technet.microsoft.com/library/hh849815.aspx) cmdlet.

Run the following cmdlet. You'll need to type the VM's local administrator name and password into the PowerShell credential request window.

```powershell
$Credential = Get-Credential -Message "Type the name and password of the local administrator account."
```

### Set the operating system properties for the virtual machine

Now you're ready to set the virtual machine's operating system properties with the [Set-AzVMOperatingSystem](https://docs.microsoft.com/powershell/module/az.compute/set-azvmoperatingsystem) cmdlet.

- Set the type of operating system as Windows.
- Require the [virtual machine agent](../../../virtual-machines/extensions/agent-windows.md) to be installed.
- Specify that the cmdlet enables auto update.
- Specify the variables that you previously initialized for the virtual machine name, the computer name, and the credential.

Run this cmdlet to set the operating system properties for your virtual machine.

```powershell
$VirtualMachine = Set-AzVMOperatingSystem -VM $VirtualMachine `
   -Windows -ComputerName $ComputerName -Credential $Credential `
   -ProvisionVMAgent -EnableAutoUpdate
```

### Add the network interface to the virtual machine

Next, use the [Add-AzVMNetworkInterface](https://docs.microsoft.com/powershell/module/az.compute/add-azvmnetworkinterface) cmdlet to add the network interface using the variable that you defined earlier.

Run this cmdlet to set the network interface for your virtual machine.

```powershell
$VirtualMachine = Add-AzVMNetworkInterface -VM $VirtualMachine -Id $Interface.Id
```

### Set the blob storage location for the disk to be used by the virtual machine

Next, set the blob storage location for the VM's disk with the variables that you defined earlier.

Run this cmdlet to set the blob storage location.

```powershell
$OSDiskUri = $StorageAccount.PrimaryEndpoints.Blob.ToString() + "vhds/" + $OSDiskName + ".vhd"
```

### Set the operating system disk properties for the virtual machine

Next, set the operating system disk properties for the virtual machine using the [Set-AzVMOSDisk](https://docs.microsoft.com/powershell/module/az.compute/set-azvmosdisk) cmdlet. 

- Specify that the operating system for the virtual machine will come from an image.
- Set caching to read only (because SQL Server is being installed on the same disk).
- Specify the variables that you previously initialized for the VM name and the operating system disk.

Run this cmdlet to set the operating system disk properties for your virtual machine.

```powershell
$VirtualMachine = Set-AzVMOSDisk -VM $VirtualMachine -Name `
   $OSDiskName -VhdUri $OSDiskUri -Caching ReadOnly -CreateOption FromImage
```

### Specify the platform image for the virtual machine

The last configuration step is to specify the platform image for your virtual machine. For this tutorial, use the latest SQL Server 2016 CTP image. Use the [Set-AzVMSourceImage](https://docs.microsoft.com/powershell/module/az.compute/set-azvmsourceimage) cmdlet to use this image with the variables that you defined earlier.

Run this cmdlet to specify the platform image for your virtual machine.

```powershell
$VirtualMachine = Set-AzVMSourceImage -VM $VirtualMachine `
   -PublisherName $PublisherName -Offer $OfferName `
   -Skus $Sku -Version $Version
```

## Create the SQL VM

Now that you've finished the configuration steps, you're ready to create the virtual machine. Use the [New-AzVM](https://docs.microsoft.com/powershell/module/az.compute/new-azvm) cmdlet to create the virtual machine using the variables that you defined.

> [!TIP]
> Creating the VM can take a few minutes.

Run this cmdlet to create your virtual machine.

```powershell
New-AzVM -ResourceGroupName $ResourceGroupName -Location $Location -VM $VirtualMachine
```

The virtual machine is created.

> [!NOTE]
> If you get an error about boot diagnostics, you can ignore it. A standard storage account is created for boot diagnostics because the specified storage account for the virtual machine's disk is a premium storage account.

## Install the SQL Iaas Agent

SQL Server virtual machines support automated management features with the [SQL Server IaaS Agent Extension](sql-server-iaas-agent-extension-automate-management.md). To install the agent on the new VM and register it with the resource provider, run the [New-AzSqlVM](/powershell/module/az.sqlvirtualmachine/new-azsqlvm) command after the virtual machine is created. Specify the license type for your SQL Server VM, choosing between either pay-as-you-go or bring-your-own-license via the [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/). For more information about licensing, see [licensing model](licensing-model-azure-hybrid-benefit-ahb-change.md). 


   ```powershell
   New-AzSqlVM -ResourceGroupName $ResourceGroupName -Name $VMName -Location $Location -LicenseType <PAYG/AHUB> 
   ```


## Stop or remove a VM

If you don't need the VM to run continuously, you can avoid unnecessary charges by stopping it when not in use. The following command stops the VM but leaves it available for future use.

```powershell
Stop-AzVM -Name $VMName -ResourceGroupName $ResourceGroupName
```

You can also permanently delete all resources associated with the virtual machine with the **Remove-AzResourceGroup** command. Doing so permanently deletes the virtual machine as well, so use this command with care.

## Example script

The following script contains the complete PowerShell script for this tutorial. It assumes that you have already set up the Azure subscription to use with the **Connect-AzAccount** and **Select-AzSubscription** commands.

```powershell
# Variables

## Global
$Location = "SouthCentralUS"
$ResourceGroupName = "sqlvm2"

## Storage
$StorageName = $ResourceGroupName + "storage"
$StorageSku = "Premium_LRS"

## Network
$InterfaceName = $ResourceGroupName + "ServerInterface"
$NsgName = $ResourceGroupName + "nsg"
$VNetName = $ResourceGroupName + "VNet"
$SubnetName = "Default"
$VNetAddressPrefix = "10.0.0.0/16"
$VNetSubnetAddressPrefix = "10.0.0.0/24"
$TCPIPAllocationMethod = "Dynamic"
$DomainName = $ResourceGroupName

##Compute
$VMName = $ResourceGroupName + "VM"
$ComputerName = $ResourceGroupName + "Server"
$VMSize = "Standard_DS13"
$OSDiskName = $VMName + "OSDisk"

##Image
$PublisherName = "MicrosoftSQLServer"
$OfferName = "SQL2017-WS2016"
$Sku = "SQLDEV"
$Version = "latest"

# Resource Group
New-AzResourceGroup -Name $ResourceGroupName -Location $Location

# Storage
$StorageAccount = New-AzStorageAccount -ResourceGroupName $ResourceGroupName -Name $StorageName -SkuName $StorageSku -Kind "Storage" -Location $Location

# Network
$SubnetConfig = New-AzVirtualNetworkSubnetConfig -Name $SubnetName -AddressPrefix $VNetSubnetAddressPrefix
$VNet = New-AzVirtualNetwork -Name $VNetName -ResourceGroupName $ResourceGroupName -Location $Location -AddressPrefix $VNetAddressPrefix -Subnet $SubnetConfig
$PublicIp = New-AzPublicIpAddress -Name $InterfaceName -ResourceGroupName $ResourceGroupName -Location $Location -AllocationMethod $TCPIPAllocationMethod -DomainNameLabel $DomainName
$NsgRuleRDP = New-AzNetworkSecurityRuleConfig -Name "RDPRule" -Protocol Tcp -Direction Inbound -Priority 1000 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * -DestinationPortRange 3389 -Access Allow
$NsgRuleSQL = New-AzNetworkSecurityRuleConfig -Name "MSSQLRule"  -Protocol Tcp -Direction Inbound -Priority 1001 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * -DestinationPortRange 1433 -Access Allow
$Nsg = New-AzNetworkSecurityGroup -ResourceGroupName $ResourceGroupName -Location $Location -Name $NsgName -SecurityRules $NsgRuleRDP,$NsgRuleSQL
$Interface = New-AzNetworkInterface -Name $InterfaceName -ResourceGroupName $ResourceGroupName -Location $Location -SubnetId $VNet.Subnets[0].Id -PublicIpAddressId $PublicIp.Id -NetworkSecurityGroupId $Nsg.Id

# Compute
$VirtualMachine = New-AzVMConfig -VMName $VMName -VMSize $VMSize
$Credential = Get-Credential -Message "Type the name and password of the local administrator account."
$VirtualMachine = Set-AzVMOperatingSystem -VM $VirtualMachine -Windows -ComputerName $ComputerName -Credential $Credential -ProvisionVMAgent -EnableAutoUpdate #-TimeZone = $TimeZone
$VirtualMachine = Add-AzVMNetworkInterface -VM $VirtualMachine -Id $Interface.Id
$OSDiskUri = $StorageAccount.PrimaryEndpoints.Blob.ToString() + "vhds/" + $OSDiskName + ".vhd"
$VirtualMachine = Set-AzVMOSDisk -VM $VirtualMachine -Name $OSDiskName -VhdUri $OSDiskUri -Caching ReadOnly -CreateOption FromImage

# Image
$VirtualMachine = Set-AzVMSourceImage -VM $VirtualMachine -PublisherName $PublisherName -Offer $OfferName -Skus $Sku -Version $Version

# Create the VM in Azure
New-AzVM -ResourceGroupName $ResourceGroupName -Location $Location -VM $VirtualMachine

# Add the SQL IaaS Extension, and choose the license type
New-AzSqlVM -ResourceGroupName $ResourceGroupName -Name $VMName -Location $Location -LicenseType <PAYG/AHUB> 
```

## Next steps

After the virtual machine is created, you can:

- Connect to the virtual machine using RDP
- Configure SQL Server settings in the portal for your VM, including:
   - [Storage settings](storage-configuration.md) 
   - [Automated management tasks](sql-server-iaas-agent-extension-automate-management.md)
- [Configure connectivity](ways-to-connect-to-sql.md)
- Connect clients and applications to the new SQL Server instance
