---
title: Create a Windows VM running a .Net Core app with IIS and SQL Azure | Microsoft Docs
description: Tutorial - install a Azure SQL, IIS, .Net Core stack on a Windows virtual machine. Optionally, install a two-tier .Net Core app that runs on the stack ans an example.
services: virtual-machines-windows
documentationcenter: virtual-machines
author: cynthn
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 08/29/2017
ms.author: cynthn
ms.custom: mvc
---

# Tutorial install the IIS, SQL,.Net Core stack on an Windows VM

In this tutorial, we will install an Azure SQL, IIS, ,NET Core stack. Optionally, we will then install a two-tier music store .Net Core application to exercise the stack as an example.

> [!div class="checklist"]
> * Create an Azure SQL VM
> * Create a VM 
> * Install IIS and the .NET Core SDK on the VM



## Create a IIS VM 

We will use the [New-AzVM] cmdlet to quickly create a Windows Server 2016 VM and then install IIS and the .NET Framework. The IIS and SQL VMs will share a resource group and virtual network, so we will create variables for those names.

```azurepowershell-interactive

$vNet = myIISSQLvNet
$resourceGroup = myIISSQLGroup
New-AzVm -Name myIISVM -ResourceGroupName $resourceGroup -VirtualNetworkName $vNet 
```

Install IIS and the .NET framwork using the custom script extension.

```azurepowershell-interactive

Set-AzureRmVMExtension -ResourceGroupName $resourceGroup `
    -ExtensionName IIS `
    -VMName myIISVM `
    -Publisher Microsoft.Compute `
    -ExtensionType CustomScriptExtension `
    -TypeHandlerVersion 1.4 `
    -SettingString '{"commandToExecute":"powershell Add-WindowsFeature Web-Server,Web-Asp-Net45,NET-Framework-Features}' `
    -Location EastUS
```

## Azure SQL VM

We will be using a pre-configured Azure marketplace image of a SQL server simplicity. 

```azurepowershell-interactive

$vNet = myIISSQLvNet
$resourceGroup = myIISSQLGroup
New-AzVm -Name mySQLVM -ImageName SQL2016-WS2016 -ResourceGroupName myIISSQLGroup -VirtualNetworkName myIISSQLvNet

# Create an inbound network security group rule for port 80 
$nsgRuleIIS = New-AzureRmNetworkSecurityRuleConfig -Name myNetworkSecurityGroupRuleIIS  -Protocol Tcp `
  -Direction Inbound -Priority 1010 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * `
  -DestinationPortRange 80 -Access Allow

```

Add-AzureRmVirtualNetworkSubnetConfig -Name SQLSubnet -VirtualNetwork $vNet -AddressPrefix "10.0.2.0/24"
$vNet | Set-AzureRmVirtualNetwork
	
	

The following script creates a fully configured VM named *myVM* that you can use for the rest of this tutorial.

```

# Create user object. You will get a pop-up prompting you to enter the credentials for the VM.
$cred = Get-Credential -Message "Enter a username and password for the virtual machine."

# Create a subnet configuration

Add-AzureRmVirtualNetworkSubnetConfig -Name mySQLSubnet -VirtualNetwork $vNet -AddressPrefix "10.0.2.0/24"
$vNet | Set-AzureRmVirtualNetwork


# Create a public IP address and specify a DNS name
$pip = New-AzureRmPublicIpAddress -ResourceGroupName $resourceGroup -Location eastus `
  -Name "mypublicdns$(Get-Random)" -AllocationMethod Static -IdleTimeoutInMinutes 4

# Create an inbound network security group rule for port 3389
$nsgRuleRDP = New-AzureRmNetworkSecurityRuleConfig -Name myNetworkSecurityGroupRuleRDP  -Protocol Tcp `
  -Direction Inbound -Priority 1000 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * `
  -DestinationPortRange 3389 -Access Allow


# Create a network security group
$nsg = New-AzureRmNetworkSecurityGroup -ResourceGroupName myIISSQLGroup -Location eastus `
  -Name myNetworkSecurityGroup -SecurityRules $nsgRuleRDP

# Create a virtual network card and associate with public IP address and NSG
$nic = New-AzureRmNetworkInterface -Name myNic -ResourceGroupName myIISSQLGroup -Location eastus `
  -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id -NetworkSecurityGroupId $nsg.Id

# Create a virtual machine configuration
$vmConfig = New-AzureRmVMConfig -VMName mySQLVM -VMSize Standard_D1 | `
Set-AzureRmVMOperatingSystem -Windows -ComputerName mySQLVM -Credential $cred | `
Set-AzureRmVMSourceImage -PublisherName MicrosoftSQLServer -Offer SQL2014SP2-WS2012R2 -Skus Enterprise -Version latest | `
Add-AzureRmVMNetworkInterface -Id $nic.Id

# Create the VM
New-AzureRmVM -ResourceGroupName myIISSQLGroup -Location eastus -VM $vmConfig
```



## Next steps

In this tutorial, you created a two-tier .Net Core sample music store application. You learned how to:

> [!div class="checklist"]
> * Create an Azure SQL server and database
> * Create a VM 
> * Install IIS and the .NET Core SDK on the VM
> * Configure the VM to run a sample web app
> * Connect to the web app to see it running


Advance to the next tutorial to learn how to secure IIS web server with SSL certificates.

> [!div class="nextstepaction"]
> [Secure IIS web server with SSL certificates](tutorial-secure-web-server.md)

