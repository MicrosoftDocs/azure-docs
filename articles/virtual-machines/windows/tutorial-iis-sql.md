---
title: Create a Windows VM running a .Net Core app with IIS and SQL Azure | Microsoft Docs
description: Tutorial - create a two-tier .Net Core app that will run on a VM using IIS and SQL.
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
ms.date: 07/21/2017
ms.author: cynthn
ms.custom: mvc
---

# Tutorial IIS SQL .Net Core 

In this tutorial, we will build a two-tier demo music store .Net Core application that runs on a Windows Azure VM and connects to an Azure SQL database.

> [!div class="checklist"]
> * Create a VM
> * Create an inbound port 80 rule for web traffic 
> * Configure

## Register the resource providers

Register the resource providers for your subscription.

```powershell
Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Sql
Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Network
Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Compute
```
## Create a resource group

Create an [Azure resource group](../azure-resource-manager/resource-group-overview.md) using the [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) command. A resource group is a logical container into which Azure resources are deployed and managed as a group. The following example creates a resource group named `myResourceGroup` in the `westeurope` location.

```powershell
$location = westus
$resourceGroup = "myResourceGroupSQL"
New-AzureRmResourceGroup -Name $resourceGroup -Location $location
```



## SQL


Define variables for use in the scripts in this quick start.

```powershell
# The logical server name: Use a random value or replace with your own value (do not capitalize)
$sqlserver = "sqlserver7272017"
# Set an admin login and password for your database
# The login information for the server
$user = "SQLAdmin"
$password = "082497Reed!!"
# The ip address range that you want to allow to access your server - change as appropriate
$startip = "0.0.0.0"
$endip = "0.0.0.0"

```


Create an [Azure SQL Database logical server](sql-database-features.md) using the [New-AzureRmSqlServer](/powershell/module/azurerm.sql/new-azurermsqlserver) command. A logical server contains a group of databases managed as a group. The following example creates a randomly named server in your resource group with an admin login named `ServerAdmin` and a password of `ChangeYourAdminPassword1`. Replace these pre-defined values as desired.

```powershell
New-AzureRmSqlServer -ResourceGroupName $resourceGroup `
    -ServerName $sqlserver `
    -Location $location `
    -SqlAdministratorCredentials $(New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList $user, $(ConvertTo-SecureString -String $password -AsPlainText -Force))
```

Create an [Azure SQL Database server-level firewall rule](sql-database-firewall-configure.md) using the [New-AzureRmSqlServerFirewallRule](/powershell/module/azurerm.sql/new-azurermsqlserverfirewallrule) command. A server-level firewall rule allows an external application, such as SQL Server Management Studio or the SQLCMD utility to connect to a SQL database through the SQL Database service firewall. In the following example, the firewall is only opened for other Azure resources. To enable external connectivity, change the IP address to an appropriate address for your environment. To open all IP addresses, use 0.0.0.0 as the starting IP address and 255.255.255.255 as the ending address.

```powershell
New-AzureRmSqlServerFirewallRule -ResourceGroupName $resourceGroup `
    -ServerName $sqlserver `
    -FirewallRuleName "AllowSome" -StartIpAddress $startip -EndIpAddress $endip
```

> [!NOTE]
> SQL Database communicates over port 1433. If you are trying to connect from within a corporate network, outbound traffic over port 1433 may not be allowed by your network's firewall. If so, you will not be able to connect to your Azure SQL Database server unless your IT department opens port 1433.
>


# create database
New-AzureRmSqlDatabase  -ResourceGroupName $resourcegroupname `
    -ServerName $servername `
    -DatabaseName musicstore `
    -RequestedServiceObjectiveName "S0"


## Create a VM

The following script creates a fully configured VM that you can use for the rest of this tutorial.

```
# Variables for common values
$vmName = "myVM"

# Create user object
$cred = Get-Credential -Message "Enter a username and password for the virtual machine."

# Create a subnet configuration
$subnetConfig = New-AzureRmVirtualNetworkSubnetConfig -Name mySubnet -AddressPrefix 192.168.1.0/24

# Create a virtual network
$vnet = New-AzureRmVirtualNetwork -ResourceGroupName $resourceGroup -Location $location `
  -Name MYvNET -AddressPrefix 192.168.0.0/16 -Subnet $subnetConfig

# Create a public IP address and specify a DNS name
$pip = New-AzureRmPublicIpAddress -ResourceGroupName $resourceGroup -Location $location `
  -Name "mypublicdns$(Get-Random)" -AllocationMethod Static -IdleTimeoutInMinutes 4

# Create an inbound network security group rule for port 3389
$nsgRuleRDP = New-AzureRmNetworkSecurityRuleConfig -Name myNetworkSecurityGroupRuleRDP  -Protocol Tcp `
  -Direction Inbound -Priority 1000 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * `
  -DestinationPortRange 3389 -Access Allow
 
# Create an inbound network security group rule for port 80 
$nsgRuleIIS = New-AzureRmNetworkSecurityRuleConfig -Name myNetworkSecurityGroupRuleRDP  -Protocol Tcp `
  -Direction Inbound -Priority 1010 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * `
  -DestinationPortRange 80 -Access Allow

# Create a network security group
$nsg = New-AzureRmNetworkSecurityGroup -ResourceGroupName $resourceGroup -Location $location `
  -Name myNetworkSecurityGroup -SecurityRules $nsgRuleRDP

# Create a virtual network card and associate with public IP address and NSG
$nic = New-AzureRmNetworkInterface -Name myNic -ResourceGroupName $resourceGroup -Location $location `
  -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id -NetworkSecurityGroupId $nsg.Id

# Create a virtual machine configuration
$vmConfig = New-AzureRmVMConfig -VMName $vmName -VMSize Standard_D1 | `
Set-AzureRmVMOperatingSystem -Windows -ComputerName $vmName -Credential $cred | `
Set-AzureRmVMSourceImage -PublisherName MicrosoftWindowsServer -Offer WindowsServer -Skus 2016-Datacenter -Version latest | `
Add-AzureRmVMNetworkInterface -Id $nic.Id

# Create a virtual machine
New-AzureRmVM -ResourceGroupName $resourceGroup -Location $location -VM $vmConfig
```

## Configure the VM with Custom Script Extension
In a previous tutorial on [How to customize a Windows virtual machine](tutorial-automate-vm-deployment.md), you learned how to automate VM customization with the Custom Script Extension for Windows. You can use the same approach to install and configure IIS on your VMs.


```powershell
$sqlfqdn = ($sqlserver + '.database.windows.net')
Set-AzureRmVMCustomScriptExtension -ResourceGroupName $resourceGroup `
    -VMName $vmName `
    -Location $location `
    -FileUri https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-windows/scripts/configure-music-app.ps1  `
    -Run "configure-music-app.ps1 -user $user -password $password -sqlserver $sqlfqdn" `
    -Name dotNetcore
```

## Test the application

Open a browser and type in the public IP address for the VM.



## Next steps

In this tutorial, you created a two-tier .Net Core sample music store application. You learned how to:

> [!div class="checklist"]
> * Create a VM
> * Configure 

