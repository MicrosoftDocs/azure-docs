---
title: Provisioning guide for SQL Server VMs with Azure PowerShell | Microsoft Docs
description: Provides steps and PowerShell commands for creating an Azure VM with SQL Server virtual machine gallery images.
services: virtual-machines-windows
documentationcenter: na
author: rothja
manager: craigg
editor: ''
tags: azure-resource-manager
ms.assetid: 98d50dd8-48ad-444f-9031-5378d8270d7b
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 02/15/2018
ms.author: jroth

---
# How to provision SQL Server virtual machines with Azure PowerShell

This guide explains your options to create Windows SQL Server VMs with Azure PowerShell. For a streamlined Azure PowerShell example with more default values, see the [SQL VM Azure PowerShell quickstart](quickstart-sql-vm-create-powershell.md).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

This article requires the Azure PowerShell module version 3.6 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps).

## Configure your subscription

1. Open PowerShell and establish access to your Azure account by running the **Connect-AzureRmAccount** command.

   ```PowerShell
   Connect-AzureRmAccount
   ```

1. You should see a sign-in screen to enter your credentials. Use the same email and password that you use to sign in to the Azure portal.

## Define image variables
To simplify reuse and script creations, start by defining a number of variables. Change the parameter values as you see fit, but beware of naming restrictions related to name lengths and special characters when modifying the values provided.

### Location and Resource Group
Use two variables to define the data region and the resource group into which you create the other resources for the virtual machine.

Modify as desired and then execute the following cmdlets to initialize these variables.

```PowerShell
$Location = "SouthCentralUS"
$ResourceGroupName = "sqlvm2"
```

### Storage properties
Use the following variables to define the storage account and the type of storage to be used by the virtual machine.

Modify as desired and then execute the following cmdlet to initialize these variables. Note that in this example, we are using [Premium Storage](../premium-storage.md), which is recommended for production workloads.

```PowerShell
$StorageName = $ResourceGroupName + "storage"
$StorageSku = "Premium_LRS"
```

### Network properties
Use the following variables to define the network interface, the TCP/IP allocation method, the virtual network name, the virtual subnet name, the range of IP addresses for the virtual network, the range of IP addresses for the subnet, and the public domain name label to be used by the network in the virtual machine.

Modify as desired and then execute the following cmdlet to initialize these variables.

```PowerShell
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
Use the following variables to define the virtual machine name, the computer name, the virtual machine size, and the operating system disk name for the virtual machine.

Modify as desired and then execute the following cmdlet to initialize these variables.

```PowerShell
$VMName = $ResourceGroupName + "VM"
$ComputerName = $ResourceGroupName + "Server"
$VMSize = "Standard_DS13"
$OSDiskName = $VMName + "OSDisk"
```

### Choose a SQL Server image
Use the following variables to define the SQL Server image to use for the virtual machine.

1. First, list out all of the SQL Server image offerings with the **Get-AzureRmVMImageOffer** command:

   ```PowerShell
   Get-AzureRmVMImageOffer -Location $Location -Publisher 'MicrosoftSQLServer'
   ```

1. For this tutorial, use the following variables to specify SQL Server 2017 on Windows Server 2016.

   ```PowerShell
   $OfferName = "SQL2017-WS2016"
   $PublisherName = "MicrosoftSQLServer"
   $Version = "latest"
   ```

1. Next, list out the available editions for your offer.

   ```PowerShell
   Get-AzureRmVMImageSku -Location $Location -Publisher 'MicrosoftSQLServer' -Offer $OfferName | Select Skus
   ```

1. For this tutorial, use the SQL Server 2017 Developer edition (**SQLDEV**). The Developer edition is freely licensed for testing and development, and you only pay for the cost of running the VM.

   ```PowerShell
   $Sku = "SQLDEV"
   ```

## Create a resource group
With the Resource Manager deployment model, the first object that you create is the resource group. Use the [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) cmdlet to create an Azure resource group and its resources with the resource group name and location defined by the variables that you previously initialized.

Execute the following cmdlet to create your new resource group.

```PowerShell
New-AzureRmResourceGroup -Name $ResourceGroupName -Location $Location
```

## Create a storage account
The virtual machine requires storage resources for the operating system disk and for the SQL Server data and log files. For simplicity, we create a single disk for both. You can attach additional disks later using the [Add-Azure Disk](/powershell/module/servicemanagement/azure/add-azuredisk) cmdlet in order to place your SQL Server data and log files on dedicated disks. Use the [New-AzureRmStorageAccount](/powershell/module/azurerm.storage/new-azurermstorageaccount) cmdlet to create a standard storage account in your new resource group and with the storage account name, storage Sku name, and location defined using the variables that you previously initialized.

Execute the following cmdlet to create your new storage account.

```PowerShell
$StorageAccount = New-AzureRmStorageAccount -ResourceGroupName $ResourceGroupName `
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
Start by creating a subnet configuration for our virtual network. For our tutorial, we create a default subnet using the [New-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/new-azurermvirtualnetworksubnetconfig) cmdlet. We create our virtual network subnet configuration with the subnet name and address prefix defined using the variables that you previously initialized.

> [!NOTE]
> You can define additional properties of the virtual network subnet configuration using this cmdlet, but that is beyond the scope of this tutorial.

Execute the following cmdlet to create your virtual subnet configuration.

```PowerShell
$SubnetConfig = New-AzureRmVirtualNetworkSubnetConfig -Name $SubnetName -AddressPrefix $VNetSubnetAddressPrefix
```

### Create a virtual network
Next, Create your virtual network using the [New-AzureRmVirtualNetwork](/powershell/module/azurerm.network/new-azurermvirtualnetwork) cmdlet. Create the virtual network in your new resource group, with the name, location, and address prefix defined using the variables that you previously initialized, and using the subnet configuration that you defined in the previous step.

Execute the following cmdlet to create your virtual network.

```PowerShell
$VNet = New-AzureRmVirtualNetwork -Name $VNetName `
   -ResourceGroupName $ResourceGroupName -Location $Location `
   -AddressPrefix $VNetAddressPrefix -Subnet $SubnetConfig
```

### Create the public IP address
Now that we have our virtual network defined, we need to configure an IP address for connectivity to the virtual machine. For this tutorial, we create a public IP address using dynamic IP addressing to support Internet connectivity. Use the [New-AzureRmPublicIpAddress](/powershell/module/azurerm.network/new-azurermpublicipaddress) cmdlet to create the public IP address in the resource group created previously and with the name, location, allocation method, and DNS domain name label defined using the variables that you previously initialized.

> [!NOTE]
> You can define additional properties of the public IP address using this cmdlet, but that is beyond the scope of this initial tutorial. You could also create a private address or an address with a static address, but that is also beyond the scope of this tutorial.

Execute the following cmdlet to create your public IP address.

```PowerShell
$PublicIp = New-AzureRmPublicIpAddress -Name $InterfaceName `
   -ResourceGroupName $ResourceGroupName -Location $Location `
   -AllocationMethod $TCPIPAllocationMethod -DomainNameLabel $DomainName
```

### Create the network security group
To secure the VM and SQL Server traffic, create a network security group.

1. First, create a network security group rule for RDP to allow remote desktop connections.

   ```PowerShell
   $NsgRuleRDP = New-AzureRmNetworkSecurityRuleConfig -Name "RDPRule" -Protocol Tcp `
      -Direction Inbound -Priority 1000 -SourceAddressPrefix * -SourcePortRange * `
      -DestinationAddressPrefix * -DestinationPortRange 3389 -Access Allow
   ```
1. Configure a network security group rule that allows traffic on TCP port 1433. This enables connections to SQL Server over the internet.

   ```PowerShell
   $NsgRuleSQL = New-AzureRmNetworkSecurityRuleConfig -Name "MSSQLRule"  -Protocol Tcp `
      -Direction Inbound -Priority 1001 -SourceAddressPrefix * -SourcePortRange * `
      -DestinationAddressPrefix * -DestinationPortRange 1433 -Access Allow
   ```

1. Then create the network security group.

   ```PowerShell
   $Nsg = New-AzureRmNetworkSecurityGroup -ResourceGroupName $ResourceGroupName `
      -Location $Location -Name $NsgName `
      -SecurityRules $NsgRuleRDP,$NsgRuleSQL
   ```

### Create the network interface
We are now ready to create the network interface that our virtual machine will use. We call the [New-AzureRmNetworkInterface](/powershell/module/azurerm.network/new-azurermnetworkinterface) cmdlet to create our network interface in the resource group created earlier and with the name, location, subnet and public IP address previously defined.

Execute the following cmdlet to create your network interface.

```PowerShell
$Interface = New-AzureRmNetworkInterface -Name $InterfaceName `
   -ResourceGroupName $ResourceGroupName -Location $Location `
   -SubnetId $VNet.Subnets[0].Id -PublicIpAddressId $PublicIp.Id `
   -NetworkSecurityGroupId $Nsg.Id
```

## Configure a VM object
Now that we have storage and network resources defined, we are ready to define compute resources for the virtual machine. For our tutorial, we specify the virtual machine size and various operating system properties, specify the network interface that we previously created, define blob storage, and then specify the operating system disk.

### Create the VM object
Start by specifying the virtual machine size. For this tutorial, we are specifying a DS13. We call the [New-AzureRmVMConfig](/powershell/module/azurerm.compute/new-azurermvmconfig) cmdlet to create a configurable virtual machine object with the name and size defined using the variables that you previously initialized.

Execute the following cmdlet to create the virtual machine object.

```PowerShell
$VirtualMachine = New-AzureRmVMConfig -VMName $VMName -VMSize $VMSize
```

### Create a credential object to hold the name and password for the local administrator credentials
Before we can set the operating system properties for the virtual machine, we need to supply the credentials for the local administrator account as a secure string. To accomplish this, use the [Get-Credential](https://technet.microsoft.com/library/hh849815.aspx) cmdlet.

Execute the following cmdlet and, in the PowerShell credential request window, type the name and password to use for the local administrator account in the virtual machine.

```PowerShell
$Credential = Get-Credential -Message "Type the name and password of the local administrator account."
```

### Set the operating system properties for the virtual machine
Now we are ready to set the virtual machine's operating system properties with [Set-AzureRmVMOperatingSystem](/powershell/module/azurerm.compute/set-azurermvmoperatingsystem) cmdlet to set the type of operating system as Windows, require the [virtual machine agent](../../extensions/agent-windows.md) to be installed, specify that the cmdlet enables auto update and set the virtual machine name, the computer name, and the credential using the variables that you previously initialized.

Execute the following cmdlet to set the operating system properties for your virtual machine.

```PowerShell
$VirtualMachine = Set-AzureRmVMOperatingSystem -VM $VirtualMachine `
   -Windows -ComputerName $ComputerName -Credential $Credential `
   -ProvisionVMAgent -EnableAutoUpdate
```

### Add the network interface to the virtual machine
Next, we add the network interface that we created previously to the virtual machine. Call the [Add-AzureRmVMNetworkInterface](/powershell/module/azurerm.compute/add-azurermvmnetworkinterface) cmdlet to add the network interface using the network interface variable that you defined earlier.

Execute the following cmdlet to set the network interface for your virtual machine.

```PowerShell
$VirtualMachine = Add-AzureRmVMNetworkInterface -VM $VirtualMachine -Id $Interface.Id
```

### Set the blob storage location for the disk to be used by the virtual machine
Next, set the blob storage location for the disk to be used by the virtual machine using the variables that you defined earlier.

Execute the following cmdlet to set the blob storage location.

```PowerShell
$OSDiskUri = $StorageAccount.PrimaryEndpoints.Blob.ToString() + "vhds/" + $OSDiskName + ".vhd"
```

### Set the operating system disk properties for the virtual machine
Next, set the operating system disk properties for the virtual machine. Use the [Set-AzureRmVMOSDisk](/powershell/module/azurerm.compute/set-azurermvmosdisk) cmdlet to specify that the operating system for the virtual machine will come from an image, to set caching to read only (because SQL Server is being installed on the same disk) and define the virtual machine name and the operating system disk defined using the variables that we defined earlier.

Execute the following cmdlet to set the operating system disk properties for your virtual machine.

```PowerShell
$VirtualMachine = Set-AzureRmVMOSDisk -VM $VirtualMachine -Name `
   $OSDiskName -VhdUri $OSDiskUri -Caching ReadOnly -CreateOption FromImage
```

### Specify the platform image for the virtual machine
Our last configuration step is to specify the platform image for our virtual machine. For our tutorial, we are using the latest SQL Server 2016 CTP image. Use the [Set-AzureRmVMSourceImage](/powershell/module/azurerm.compute/set-azurermvmsourceimage) cmdlet to use this image as defined by the variables that you defined earlier.

Execute the following cmdlet to specify the platform image for your virtual machine.

```PowerShell
$VirtualMachine = Set-AzureRmVMSourceImage -VM $VirtualMachine `
   -PublisherName $PublisherName -Offer $OfferName `
   -Skus $Sku -Version $Version
```

## Create the SQL VM
Now that you have finished the configuration steps, you are ready to create the virtual machine. Use the [New-AzureRmVM](/powershell/module/azurerm.compute/new-azurermvm) cmdlet to create the virtual machine using the variables that we have defined.

Execute the following cmdlet to create your virtual machine.

```PowerShell
New-AzureRmVM -ResourceGroupName $ResourceGroupName -Location $Location -VM $VirtualMachine
```

The virtual machine is created.

> [!NOTE]
> You can ignore the error about the boot diagnostics. A standard storage account is created for boot diagnostics, because the specified storage account for the virtual machine's disk is a premium storage account.

## Install the SQL Iaas Agent
SQL Server virtual machines support automated management features with the [SQL Server IaaS Agent Extension](virtual-machines-windows-sql-server-agent-extension.md). To install the agent on the new VM, run the following command after it is created.

   ```PowerShell
   Set-AzureRmVMSqlServerExtension -ResourceGroupName $ResourceGroupName -VMName $VMName -name "SQLIaasExtension" -version "1.2" -Location $Location
   ```

## Remove a test VM

If you do not need the VM running continually, you can avoid unnecessary charges by stopping it when not in use. The following command stops the VM but leaves it available for future use.

```PowerShell
Stop-AzureRmVM -Name $VMName -ResourceGroupName $ResourceGroupName
```

You can also permanently delete all resources associated with the virtual machine with the **Remove-AzureRmResourceGroup** command. This permanently deletes the virtual machine as well, so use this command with care.

## Example script
The following script contains the complete PowerShell script for this tutorial. It assumes that you have already setup the Azure subscription to use with the **Connect-AzureRmAccount** and **Select-AzureRmSubscription** commands.

```PowerShell
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
New-AzureRmResourceGroup -Name $ResourceGroupName -Location $Location

# Storage
$StorageAccount = New-AzureRmStorageAccount -ResourceGroupName $ResourceGroupName -Name $StorageName -SkuName $StorageSku -Kind "Storage" -Location $Location

# Network
$SubnetConfig = New-AzureRmVirtualNetworkSubnetConfig -Name $SubnetName -AddressPrefix $VNetSubnetAddressPrefix
$VNet = New-AzureRmVirtualNetwork -Name $VNetName -ResourceGroupName $ResourceGroupName -Location $Location -AddressPrefix $VNetAddressPrefix -Subnet $SubnetConfig
$PublicIp = New-AzureRmPublicIpAddress -Name $InterfaceName -ResourceGroupName $ResourceGroupName -Location $Location -AllocationMethod $TCPIPAllocationMethod -DomainNameLabel $DomainName
$NsgRuleRDP = New-AzureRmNetworkSecurityRuleConfig -Name "RDPRule" -Protocol Tcp -Direction Inbound -Priority 1000 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * -DestinationPortRange 3389 -Access Allow
$NsgRuleSQL = New-AzureRmNetworkSecurityRuleConfig -Name "MSSQLRule"  -Protocol Tcp -Direction Inbound -Priority 1001 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * -DestinationPortRange 1433 -Access Allow
$Interface = New-AzureRmNetworkInterface -Name $InterfaceName -ResourceGroupName $ResourceGroupName -Location $Location -SubnetId $VNet.Subnets[0].Id -PublicIpAddressId $PublicIp.Id -NetworkSecurityGroupId $Nsg.Id

# Compute
$VirtualMachine = New-AzureRmVMConfig -VMName $VMName -VMSize $VMSize
$Credential = Get-Credential -Message "Type the name and password of the local administrator account."
$VirtualMachine = Set-AzureRmVMOperatingSystem -VM $VirtualMachine -Windows -ComputerName $ComputerName -Credential $Credential -ProvisionVMAgent -EnableAutoUpdate #-TimeZone = $TimeZone
$VirtualMachine = Add-AzureRmVMNetworkInterface -VM $VirtualMachine -Id $Interface.Id
$OSDiskUri = $StorageAccount.PrimaryEndpoints.Blob.ToString() + "vhds/" + $OSDiskName + ".vhd"
$VirtualMachine = Set-AzureRmVMOSDisk -VM $VirtualMachine -Name $OSDiskName -VhdUri $OSDiskUri -Caching ReadOnly -CreateOption FromImage

# Image
$VirtualMachine = Set-AzureRmVMSourceImage -VM $VirtualMachine -PublisherName $PublisherName -Offer $OfferName -Skus $Sku -Version $Version

# Create the VM in Azure
New-AzureRmVM -ResourceGroupName $ResourceGroupName -Location $Location -VM $VirtualMachine

# Add the SQL IaaS Extension
Set-AzureRmVMSqlServerExtension -ResourceGroupName $ResourceGroupName -VMName $VMName -name "SQLIaasExtension" -version "1.2" -Location $Location
```

## Next steps
After the virtual machine is created, you can:

- Connect to the virtual machine using remote desktop (RDP).
- Configure SQL Server settings in the portal for your VM, including:
   - [Storage settings](virtual-machines-windows-sql-server-storage-configuration.md) 
   - [Automated management tasks](virtual-machines-windows-sql-server-agent-extension.md)
- [Configure connectivity](virtual-machines-windows-sql-connect.md).
- Connect clients and applications to the new SQL Server instance.

