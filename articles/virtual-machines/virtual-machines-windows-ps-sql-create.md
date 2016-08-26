<properties
    pageTitle="Create a SQL Server Virtual Machine in Azure PowerShell (Resource Manager) | Microsoft Azure"
    description="Provides steps and PowerShell scripts for creating an Azure VM with SQL Server virtual machine gallery images."
	services="virtual-machines-windows"
    documentationCenter="na"
    authors="rothja"
    manager="jhubbard"
    editor=""
    tags="azure-resource-manager" />
<tags
    ms.service="virtual-machines-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="vm-windows-sql-server"
	ms.workload="infrastructure-services"
	ms.date="07/15/2016"
	ms.author="jroth"/>

# Provision a SQL Server virtual machine using Azure PowerShell (Resource Manager)

> [AZURE.SELECTOR]
- [Portal](virtual-machines-windows-portal-sql-server-provision.md)
- [PowerShell](virtual-machines-windows-ps-sql-create.md)

## Overview

This tutorial shows you how to create a single Azure virtual machine using the **Azure Resource Manager** deployment model using Azure PowerShell cmdlets. In this tutorial, we will create a single virtual machine using a single disk drive from an image in the SQL Gallery. We will create new providers for the storage, network, and compute resources that will be used by the virtual machine. If you have existing providers for any of these resources, you can use those providers instead.

If you need the classic version of this topic, see [Provision a SQL Server virtual machine using Azure PowerShell Classic](virtual-machines-windows-classic-ps-sql-create.md).

## Prerequisites

For this tutorial you'll need:

- An Azure account and subscription before you start. If you don't have one, sign up for a [free trial](https://azure.microsoft.com/pricing/free-trial/).
- [Azure PowerShell)](../powershell-install-configure.md), minimum version of 1.4.0 or later (this tutorial written using version 1.5.0).
    - To retrieve your version, type **Get-Module Azure -ListAvailable**.

## Configure your subscription

Open Windows PowerShell and establish access to your Azure account by running the following cmdlet. You will be presented with a sign in screen to enter your credentials. Use the same email and password that you use to sign in to the Azure portal.

	Add-AzureRmAccount

After successfully signing in you will see some information on screen that includes the SubscriptionId with which you signed in. This is the subscription in which the resources for this tutorial will be created unless you change to a different subscription. If you have multiple SubscriptionIds, run the following cmdlet to return a list of all of your SubscriptionIds:

	Get-AzureRmSubscription

To change to another SubscriptionID, run the following cmdlet with your desired SubscriptionId.

	Select-AzureRmSubscription -SubscriptionId xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

## Define image variables

To simplify usability and understanding of the completed script from this tutorial, we will start by defining a number of variables. Change the parameter values as you see fit, but beware of naming restrictions related to name lengths and special characters when modifying the values provided.

### Location and Resource Group
Use two variables to define the data region and the resource group into which you will create the other resources for the virtual machine.

Modify as desired and then execute the following cmdlets to initialize these variables.

	$Location = "SouthCentralUS"
    $ResourceGroupName = "sqlvm1"

### Storage properties

Use the following variables to define the storage account and the type of storage to be used by the virtual machine.

Modify as desired and then execute the following cmdlet to initialize these variables. Note that in this example, we are using [Premium Storage](../storage/storage-premium-storage.md), which is recommended for production workloads. For details on this guidance and other recommendations, see [Performance best practices for SQL Server in Azure Virtual Machines](virtual-machines-windows-sql-performance.md).

    $StorageName = $ResourceGroupName + "storage"
    $StorageSku = "Premium_LRS"

### Network properties

Use the following variables to define the network interface, the TCP/IP allocation method, the virtual network name, the virtual subnet name, the range of IP addresses for the virtual network, the range of IP addresses for the subnet, and the public domain name label to be used by the network in the virtual machine.

Modify as desired and then execute the following cmdlet to initialize these variables.

    $InterfaceName = $ResourceGroupName + "ServerInterface"
    $TCPIPAllocationMethod = "Dynamic"
    $VNetName = $ResourceGroupName + "VNet"
    $SubnetName = "Default"
    $VNetAddressPrefix = "10.0.0.0/16"
    $VNetSubnetAddressPrefix = "10.0.0.0/24"
    $DomainName = "sqlvm1"   

### Virtual machine properties

Use the following variables to define the virtual machine name, the computer name, the virtual machine size, and the operating system disk name for the virtual machine.

Modify as desired and then execute the following cmdlet to initialize these variables.

    $VMName = $ResourceGroupName + "VM"
    $ComputerName = $ResourceGroupName + "Server"
    $VMSize = "Standard_DS13"
    $OSDiskName = $VMName + "OSDisk"

### Image properties

Use the following variables to define the image to use for the virtual machine. In this example, the SQL Server 2016 RC3 evaluation image is used.

Modify as desired and then execute the following cmdlet to initialize these variables.

    $PublisherName = "MicrosoftSQLServer"
    $OfferName = "SQL2016RC3-WS2012R2"
    $Sku = "Evaluation"
    $Version = "latest"

Note that you can get a full list of SQL Server image offerings with the Get-AzureRmVMImageOffer command:

    Get-AzureRmVMImageOffer -Location 'East US' -Publisher 'MicrosoftSQLServer'

And you can see the Skus available for an offering with the Get-AzureRmVMImageSku command. The following command shows all Skus available for the **SQL2014SP1-WS2012R2** offer.

    Get-AzureRmVMImageSku -Location 'East US' -Publisher 'MicrosoftSQLServer' -Offer 'SQL2014SP1-WS2012R2' | Select Skus

## Create a resource group

With the Resource Manager deployment model, the first object that you create is the resource group. We will use the [New-AzureRmResourceGroup](https://msdn.microsoft.com/library/mt678985.aspx) cmdlet to create an Azure resource group and its resources with the resource group name and location defined by the variables that you previously initialized.

Execute the following cmdlet to create your new resource group.

    New-AzureRmResourceGroup -Name $ResourceGroupName -Location $Location

## Create a storage account

The virtual machine requires storage resources for the operating system disk and for the SQL Server data and log files. For simplicity, we will create a single disk for both. You can attach additional disks later using the [Add-Azure Disk](https://msdn.microsoft.com/library/azure/dn495252.aspx) cmdlet in order to place your SQL Server data and log files on dedicated disks. We will use the [New-AzureRmStorageAccount](https://msdn.microsoft.com/library/mt607148.aspx) cmdlet to create a standard storage account in your new resource group and with the storage account name, storage Sku name, and location defined using the variables that you previously initialized.

Execute the following cmdlet to create your new storage account.  

    $StorageAccount = New-AzureRmStorageAccount -ResourceGroupName $ResourceGroupName -Name $StorageName -SkuName $StorageSku -Kind "Storage" -Location $Location

## Create network resources

The virtual machine requires a number of network resources for network connectivity.

- Each virtual machine requires a virtual network.
- A virtual network must have at least one subnet defined.
- A network interface must be defined with either a public or a private IP address.

### Create a virtual network subnet configuration

We will start by creating a subnet configuration for our virtual network. For our tutorial, we will create a default subnet using the [New-AzureRmVirtualNetworkSubnetConfig](https://msdn.microsoft.com/library/mt619412.aspx) cmdlet. We will create our virtual network subnet configuration with the subnet name and address prefix defined using the variables that you previously initialized.

>[AZURE.NOTE] You can define additional properties of the virtual network subnet configuration using this cmdlet, but that is beyond the scope of this tutorial.

Execute the following cmdlet to create your virtual subnet configuration.

    $SubnetConfig = New-AzureRmVirtualNetworkSubnetConfig -Name $SubnetName -AddressPrefix $VNetSubnetAddressPrefix

### Create a virtual network

Next, we will create our virtual network using the [New-AzureRmVirtualNetwork](https://msdn.microsoft.com/library/mt603657.aspx) cmdlet. We will create our virtual network in your new resource group, with the name, location, and address prefix defined using the variables that you previously initialized, and using the subnet configuration that you defined in the previous step.

Execute the following cmdlet to create your virtual network.

    $VNet = New-AzureRmVirtualNetwork -Name $VNetName -ResourceGroupName $ResourceGroupName -Location $Location -AddressPrefix $VNetAddressPrefix -Subnet $SubnetConfig

### Create the public IP address

Now that we have our virtual network defined, we need to configure an IP address for connectivity to the virtual machine. For this tutorial, we will create a public IP address using dynamic IP addressing to support Internet connectivity. We will use the [New-AzureRmPublicIpAddress](https://msdn.microsoft.com/library/mt603620.aspx) cmdlet to create the public IP address in the resource group created prevously and with the name, location, allocation method, and DNS domain name label defined using the variables that you previously initialized.

>[AZURE.NOTE] You can define additional properties of the public IP address using this cmdlet, but that is beyond the scope of this initial tutorial. You could also create a private address or an address with a static address, but that is also beyond the scope of this tutorial.

Execute the following cmdlet to create your public IP address.

    $PublicIp = New-AzureRmPublicIpAddress -Name $InterfaceName -ResourceGroupName $ResourceGroupName -Location $Location -AllocationMethod $TCPIPAllocationMethod -DomainNameLabel $DomainName

### Create the network interface

We are now ready to create the network interface that our virtual machine will use. We will use the [New-AzureRmNetworkInterface](https://msdn.microsoft.com/library/mt619370.aspx) cmdlet to create our network interface in the resource group created earlier and with the name, location, subnet and public IP address previously defined.

Execute the following cmdlet to create your network interface.

    $Interface = New-AzureRmNetworkInterface -Name $InterfaceName -ResourceGroupName $ResourceGroupName -Location $Location -SubnetId $VNet.Subnets[0].Id -PublicIpAddressId $PublicIp.Id

## Configure a VM object

Now that we have storage and network resources defined, we are ready to define compute resources for the virtual machine. For our tutorial, we will specify the virtual machine size and various operating system properties, specify the network interface that we previously created, define blob storage, and then specify the operating system disk.

### Create the VM object

We will start by specifying the virtual machine size. For this tutorial, we are specifying a DS13. We will use the [New-AzureRmVMConfig](https://msdn.microsoft.com/library/mt603727.aspx) cmdlet to create a configurable virtual machine object with the name and size defined using the variables that you previously initialized.

Execute the following cmdlet to create the virtual machine object.

    $VirtualMachine = New-AzureRmVMConfig -VMName $VMName -VMSize $VMSize

### Create a credential object to hold the name and password for the local administrator credentials

Before we can set the operating system properties for the virtual machine, we need to supply the credentials for the local administrator account as a secure string. To accomplish this, we will use the [Get-Credential](https://technet.microsoft.com/library/hh849815.aspx) cmdlet.

Execute the following cmdlet and, in the Windows PowerShell credential request window, type the name and password to use for the local administrator account in the Windows virtual machine.

    $Credential = Get-Credential -Message "Type the name and password of the local administrator account."

### Set the operating system properties for the virtual machine

Now we are ready to set the virtual machine's operating system properties. We will use the [Set-AzureRmVMOperatingSystem](https://msdn.microsoft.com/library/mt603843.aspx) cmdlet to set the type of operating system as Windows, require the [virtual machine agent](virtual-machines-windows-classic-agents-and-extensions.md) to be installed, specify that the cmdlet enables auto update and set the virtual machine name, the computer name, and the credential using the variables that you previously initialized.

Execute the following cmdlet to set the operating system properties for your virtual machine.

    $VirtualMachine = Set-AzureRmVMOperatingSystem -VM $VirtualMachine -Windows -ComputerName $ComputerName -Credential $Credential -ProvisionVMAgent -EnableAutoUpdate

### Add the network interface to the virtual machine

Next, we will add the network interface that we created previously to the virtual machine. We will use the [Add-AzureRmVMNetworkInterface](https://msdn.microsoft.com/library/mt619351.aspx) cmdlet to add the network interface using the network interface variable that you defined earlier.

Execute the following cmdlet to set the network interface for your virtual machine.

    $VirtualMachine = Add-AzureRmVMNetworkInterface -VM $VirtualMachine -Id $Interface.Id

### Set the blob storage location for the disk to be used by the virtual machine

Next, we will set the blob storage location for the disk to be used by the virtual machine using the variables that you defined earlier.

Execute the following cmdlet to set the blob storage location.

    $OSDiskUri = $StorageAccount.PrimaryEndpoints.Blob.ToString() + "vhds/" + $OSDiskName + ".vhd"

### Set the operating system disk properties for the virtual machine

Next, we will set the operating system disk properties for the virtual machine. We will use the [Set-AzureRmVMOSDisk](https://msdn.microsoft.com/library/mt603746.aspx) cmdlet to specify that the operating system for the virtual machine will come from an image, to set caching to read only (because SQL Server is being installed on the same disk) and define the virtual machine name and the operating system disk defined using the variables that we defined earlier.

Execute the following cmdlet to set the operating system disk properties for your virtual machine.

    $VirtualMachine = Set-AzureRmVMOSDisk -VM $VirtualMachine -Name $OSDiskName -VhdUri $OSDiskUri -Caching ReadOnly -CreateOption FromImage

### Specify the platform image for the virtual machine

Our last configuration step is to specify the platform image for our virtual machine. For our tutorial, we are using the latest SQL Server 2016 CTP image. We will use the [Set-AzureRmVMSourceImage](https://msdn.microsoft.com/library/mt619344.aspx) cmdlet to use this image as defined by the variables that you defined earlier.

Execute the following cmdlet to specify the platform image for your virtual machine.

    $VirtualMachine = Set-AzureRmVMSourceImage -VM $VirtualMachine -PublisherName $PublisherName -Offer $OfferName -Skus $Sku -Version $Version

## Create the SQL VM

Now that you have finished the configuration steps, you are ready to create the virtual machine. We will use the [New-AzureRmVM](https://msdn.microsoft.com/library/mt603754.aspx) cmdlet to create the virtual machine using the variables that we have defined.

Execute the following cmdlet to create your virtual machine.

    New-AzureRmVM -ResourceGroupName $ResourceGroupName -Location $Location -VM $VirtualMachine

The virtual machine is created. Notice that a standard storage account is created for boot diagnostics because the specified storage account for the virtual machine's disk is a premium storage account.

You can now view this machine in the Azure Portal to see [its public IP address and its fully qualified domain name](virtual-machines-windows-portal-sql-server-provision.md#Connect).  

## Example script

The following script contains the complete PowerShell script for this tutorial. It assumes that you have already setup the Azure subscription to use with the **Add-AzureRmAccount** and **Select-AzureRmSubscription** commands.


    # Variables
    ## Global
    $Location = "SouthCentralUS"
    $ResourceGroupName = "sqlvm1"
    ## Storage
    $StorageName = $ResourceGroupName + "storage"
    $StorageSku = "Premium_LRS"

    ## Network
    $InterfaceName = $ResourceGroupName + "ServerInterface"
    $VNetName = $ResourceGroupName + "VNet"
    $SubnetName = "Default"
    $VNetAddressPrefix = "10.0.0.0/16"
    $VNetSubnetAddressPrefix = "10.0.0.0/24"
    $TCPIPAllocationMethod = "Dynamic"
    $DomainName = "sqlvm1"

    ##Compute
    $VMName = $ResourceGroupName + "VM"
    $ComputerName = $ResourceGroupName + "Server"
    $VMSize = "Standard_DS13"
    $OSDiskName = $VMName + "OSDisk"

    ##Image
    $PublisherName = "MicrosoftSQLServer"
    $OfferName = "SQL2016RC3-WS2012R2"
    $Sku = "Evaluation"
    $Version = "latest"

    # Resource Group
    New-AzureRmResourceGroup -Name $ResourceGroupName -Location $Location

    # Storage
    $StorageAccount = New-AzureRmStorageAccount -ResourceGroupName $ResourceGroupName -Name $StorageName -SkuName $StorageSku -Kind "Storage" -Location $Location

    # Network
    $SubnetConfig = New-AzureRmVirtualNetworkSubnetConfig -Name $SubnetName -AddressPrefix $VNetSubnetAddressPrefix
    $VNet = New-AzureRmVirtualNetwork -Name $VNetName -ResourceGroupName $ResourceGroupName -Location $Location -AddressPrefix $VNetAddressPrefix -Subnet $SubnetConfig
    $PublicIp = New-AzureRmPublicIpAddress -Name $InterfaceName -ResourceGroupName $ResourceGroupName -Location $Location -AllocationMethod $TCPIPAllocationMethod -DomainNameLabel $DomainName
    $Interface = New-AzureRmNetworkInterface -Name $InterfaceName -ResourceGroupName $ResourceGroupName -Location $Location -SubnetId $VNet.Subnets[0].Id -PublicIpAddressId $PublicIp.Id

    # Compute
    $VirtualMachine = New-AzureRmVMConfig -VMName $VMName -VMSize $VMSize
    $Credential = Get-Credential -Message "Type the name and password of the local administrator account."
    $VirtualMachine = Set-AzureRmVMOperatingSystem -VM $VirtualMachine -Windows -ComputerName $ComputerName -Credential $Credential -ProvisionVMAgent -EnableAutoUpdate #-TimeZone = $TimeZone
    $VirtualMachine = Add-AzureRmVMNetworkInterface -VM $VirtualMachine -Id $Interface.Id
    $OSDiskUri = $StorageAccount.PrimaryEndpoints.Blob.ToString() + "vhds/" + $OSDiskName + ".vhd"
    $VirtualMachine = Set-AzureRmVMOSDisk -VM $VirtualMachine -Name $OSDiskName -VhdUri $OSDiskUri -Caching ReadOnly -CreateOption FromImage

    # Image
    $VirtualMachine = Set-AzureRmVMSourceImage -VM $VirtualMachine -PublisherName $PublisherName -Offer $OfferName -Skus $Sku -Version $Version

    ## Create the VM in Azure
    New-AzureRmVM -ResourceGroupName $ResourceGroupName -Location $Location -VM $VirtualMachine

## Next steps
After the virtual machine is created, you are ready to connect to the virtual machine using RDP and setup connectivity. For more information, see [Connect to a SQL Server Virtual Machine on Azure (Resource Manager)](virtual-machines-windows-sql-connect.md).
