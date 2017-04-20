---
title: Azure Virtual Networks and Windows Virtual Machines | Microsoft Docs
description: Tutorial - Manage Azure Virtual Networks and Windows Virtual Machines with Azure PowerShell 
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
ms.date: 04/18/2017
ms.author: davidmu
---

# Manage Azure Virtual Networks and Windows Virtual Machines with Azure PowerShell

In this tutorial, you learn about creating multiple virtual machines (VMs) in a virtual network and configure network connectivity between them. When completed, a 'front-end' VM will be accessible from the internet on port 22 for SSH and port 80 for HTTP connections. A 'back-end' VM with a MySQL database will be accessible from the front-end VM on port 3306.

The steps in this tutorial can be completed using the latest [Azure PowerShell](https://docs.microsoft.com/powershell/azureps-cmdlets-docs/) module.

## Create VNet

An Azure Virtual Network (VNet) is a representation of your own network in the cloud. A VNet is a logical isolation of the Azure cloud dedicated to your subscription. Within a VNet, you find subnets, rules for connectivity to those subnets, and connections from the VMs to the subnets. 

Before you can create any other Azure resources, you need to create a resource group with [New-AzureRmResourceGroup](https://docs.microsoft.com/powershell/resourcemanager/AzureRM.Resources/v2.0.3/new-azurermresourcegroup). The following example creates a resource group named `myRGNetwork` in the `westus` location:

```powershell
New-AzureRmResourceGroup -ResourceGroupName myRGNetwork -Location westus
```

A subnet is a child resource of a VNet, and helps define segments of address spaces within a CIDR block, using IP address prefixes. NICs can be added to subnets, and connected to VMs, providing connectivity for various workloads.

Create a subnet with [New-AzureRmVirtualNetworkSubnetConfig](https://docs.microsoft.com/powershell/resourcemanager/azurerm.network/v3.6.0/new-azurermvirtualnetworksubnetconfig):

```powershell
$frontendSubnet = New-AzureRmVirtualNetworkSubnetConfig `
  -Name myFrontendSubnet `
  -AddressPrefix 10.0.0.0/24
```

Create a virtual network using `myFrontendSubnet` with [New-AzureRmVirtualNetwork](https://docs.microsoft.com/powershell/resourcemanager/azurerm.network/v3.6.0/new-azurermvirtualnetwork):

```powershell
$vnet = New-AzureRmVirtualNetwork `
  -ResourceGroupName myRGNetwork `
  -Location westus `
  -Name myVnet `
  -AddressPrefix 10.0.0.0/16 `
  -Subnet $frontendSubnet
```

## Create front-end VM

For a VM to communicate in a virtual network, it needs a virtual network interface. The `myFrontendVM` is accessed from the internet, so it also needs a public IP address. 

Create a public IP address with [New-AzureRmPublicIpAddress](https://docs.microsoft.com/powershell/resourcemanager/azurerm.network/v3.6.0/new-azurermpublicipaddress):

```powershell
$pip = New-AzureRmPublicIpAddress `
  -ResourceGroupName myRGNetwork `
  -Location westus `
  -AllocationMethod Static `
  -Name myPublicIPAddress
```

Create a virtual network interface with [New-AzureRmNetworkInterface](https://docs.microsoft.com/powershell/resourcemanager/azurerm.network/v3.6.0/new-azurermnetworkinterface):


```powershell
$frontendNic = New-AzureRmNetworkInterface `
  -ResourceGroupName myRGNetwork `
  -Location westus `
  -Name myFrontendNic `
  -SubnetId $vnet.Subnets[0].Id `
  -PublicIpAddressId $pip.Id
```

Set the username and password needed for the administrator account on the VM with [Get-Credential](https://msdn.microsoft.com/powershell/reference/5.1/microsoft.powershell.security/Get-Credential):

```powershell
$cred = Get-Credential
```

Create the VMs with [New-AzureRmVMConfig](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/new-azurermvmconfig), [Set-AzureRmVMOperatingSystem](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/set-azurermvmoperatingsystem), [Set-AzureRmVMSourceImage](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/set-azurermvmsourceimage), [Set-AzureRmVMOSDisk](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/set-azurermvmosdisk), [Add-AzureRmVMNetworkInterface](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/add-azurermvmnetworkinterface), and [New-AzureRmVM](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/new-azurermvm). 

```powershell
$frontendVM = New-AzureRmVMConfig -VMName myFrontendVM -VMSize Standard_D1
$frontendVM = Set-AzureRmVMOperatingSystem -VM $frontendVM -Windows -ComputerName myFrontendVM -Credential $cred -ProvisionVMAgent -EnableAutoUpdate
$frontendVM = Set-AzureRmVMSourceImage -VM $frontendVM -PublisherName MicrosoftWindowsServer -Offer WindowsServer -Skus 2016-Datacenter -Version latest
$frontendVM = Set-AzureRmVMOSDisk -VM $frontendVM -Name myFrontendOSDisk -DiskSizeInGB 128 -CreateOption FromImage -Caching ReadWrite
$frontendVM = Add-AzureRmVMNetworkInterface -VM $frontendVM -Id $frontendNic.Id
New-AzureRmVM -ResourceGroupName myRGNetwork -Location westus -VM $frontendVM
```

## Install web server

Azure virtual machine extensions are used to automate virtual machine configuration tasks such as installing applications and configuring the operating system. The [custom script extension for Windows](./../virtual-machines-windows-extensions-customscript.md) is used to run any PowerShell script on the virtual machine. The script can be stored in Azure storage, any accessible HTTP endpoint, or embedded in the custom script extension configuration. When using the custom script extension, the Azure VM agent manages the script execution.

Run the following commands to return the public IP address of the virtual machine. Take note of this IP Address so you can connect to it with your browser to test web connectivity in a future step.

Obtain the public IP address of `myFrontendVM` with [Get-AzureRmPublicIPAddress](https://docs.microsoft.com/powershell/resourcemanager/azurerm.network/v3.6.0/get-azurermpublicipaddress). The following example obtains the IP address for `myPublicIPAddress` created earlier:

```powershell
Get-AzureRmPublicIPAddress -ResourceGroupName myRGNetwork -Name myPublicIPAddress | select IpAddress
```

Use the following command to create a remote desktop session with the virtual machine. Replace the IP address with the publicIPAddress of your virtual machine. When prompted, enter the credentials used when creating the virtual machine.

```bash
mstsc /v:<publicIpAddress>
``` 

Now that you have logged into the Azure VM, you can use a single line of PowerShell to install IIS and enable the local firewall rule to allow web traffic. Open a PowerShell prompt and run the following command:

Use [Install-WindowsFeature]() to run the custom script extension that installs the IIS webserver:

```powershell
Install-WindowsFeature -name Web-Server -IncludeManagementTools
```

Now you can use the public IP address to browse to the VM to see the IIS site.

![IIS default site](./media/tutorial-virtual-network/iis.png)

## Manage internal traffic

A network security group (NSG) contains a list of security rules that allow or deny network traffic to resources connected to a VNet. NSGs can be associated to subnets or individual NICs attached to VMs. Opening or closing access to VMs through ports is done using NSG rules. When you created `myFrontendVM`, inbound port 22 was automatically opened for SSH connectivity.

Internal communication of VMs can also be configured using an NSG. In this section, you learn how to create an additional subnet in the network and assign an NSG to the subnet to allow a connection from `myFrontendVM` to `myBackendVM` on port 1433. The subnet is then assigned to the VM when it is created.

You can limit internal traffic to `myBackendVM` from only `myFrontendVM` by creating an NSG for the back-end subnet. The following example creates an NSG rule named `myBackendNSGRule`:

```powershell
$nsgBackendRule = New-AzureRmNetworkSecurityRuleConfig `
  -Name myBackendNSGRule `
  -Protocol Tcp `
  -Direction Inbound `
  -Priority 100 `
  -SourceAddressPrefix 10.0.0.0/24 `
  -SourcePortRange * `
  -DestinationAddressPrefix * `
  -DestinationPortRange 1433 `
  -Access Allow
```

Add a new network security group named `myBackendNSG`:

```powershell
$nsgBackend = New-AzureRmNetworkSecurityGroup `
  -ResourceGroupName myRGNetwork `
  -Location westus `
  -Name myBackendNSG `
  -SecurityRules $nsgBackendRule
```
## Add back-end subnet

Add `myBackEndSubnet` to `myVNet` with [Add-AzureRmVirtualNetworkSubnetConfig]():

```powershell
Add-AzureRmVirtualNetworkSubnetConfig -Name myBackendSubnet `
  -VirtualNetwork $vnet `
  -AddressPrefix 10.0.1.0/24 `
  -NetworkSecurityGroup $nsgBackend
Set-AzureRmVirtualNetwork -VirtualNetwork $vnet
$vnet = Get-AzureRmVirtualNetwork -ResourceGroupName myRGNetwork -Name myVnet
```

## Create back-end VM

The back-end VM is created with a SQL Server image. This tutorial only creates the VM with the database server, but doesn't provide information about accessing the database.

Create `myBackendNic`:

```powershell
$backendNic = New-AzureRmNetworkInterface `
  -ResourceGroupName myRGNetwork `
  -Location westus `
  -Name myBackendNic `
  -SubnetId $vnet.Subnets[1].Id
```

Set the username and password needed for the administrator account on the VM with [Get-Credential](https://msdn.microsoft.com/powershell/reference/5.1/microsoft.powershell.security/Get-Credential):

```powershell
$cred = Get-Credential
```

Create `myBackendVM`:

```powershell
$backendVM = New-AzureRmVMConfig -VMName myBackendVM -VMSize Standard_D1
$backendVM = Set-AzureRmVMOperatingSystem -VM $backendVM -Windows -ComputerName myBackendVM -Credential $cred -ProvisionVMAgent -EnableAutoUpdate
$backendVM = Set-AzureRmVMSourceImage -VM $backendVM -PublisherName MicrosoftSQLServer -Offer SQL2016-WS2016 -Skus Enterprise -Version latest
$backendVM = Set-AzureRmVMOSDisk -VM $backendVM -Name myBackendOSDisk -DiskSizeInGB 128 -CreateOption FromImage -Caching ReadWrite
$backendVM = Add-AzureRmVMNetworkInterface -VM $backendVM -Id $backendNic.Id
New-AzureRmVM -ResourceGroupName myRGNetwork -Location westus -VM $backendVM
```

The image that is used has SQL Server installed, but is not used in this tutorial. It is included to show you how you can configure a VM to handle web traffic and a VM to handle database management.

## Next steps

- Learn even more about virtual networks in [Virtual Network Overview](../../virtual-network/virtual-networks-overview.md).
- Find out how you can make your virtual network even more secure in [Filter network traffic with network security groups](../../virtual-network/virtual-networks-nsg.md).
- Learn about the network interfaces that are used to connect the VMs to the VNet in [Network Interfaces](../../virtual-network/virtual-network-network-interface.md).
- Learn about running SQL Server on an Azure VM in [Overview of SQL Server on Azure Virtual Machines](./sql/virtual-machines-windows-sql-server-iaas-overview.md). 
