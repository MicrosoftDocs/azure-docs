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
ms.date: 08/21/2017
ms.author: cynthn
ms.custom: mvc
---

# Tutorial install the IIS, SQL,.Net Core stack on an Windows VM

In this tutorial, we will install an Azure SQL, IIS, ,NET Core stack. Optionally, we will then install a two-tier music store .Net Core application to exercise the stack as an example.

> [!div class="checklist"]
> * Create an Azure SQL server and database
> * Create a VM 
> * Install IIS and the .NET Core SDK on the VM
> * Configure the VM to run a sample web app
> * Connect to the web app to see it running

You can explore sources for the Music Store sample app that we use in this tutorial by looking at the public repo on [GitHub](https://github.com/MicrosoftDocs/MusicStoreSample).

## Create a resource group

Create a [resource group](../../azure-resource-manager/resource-group-overview.md) using the [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) command. The following example creates a resource group named *myResourceGroup* in the *West US* location.

```powershell
$location = "westus"
$resourceGroup = "myResourceGroup"
New-AzureRmResourceGroup -Name $resourceGroup -Location $location
```

## Azure SQL

Define variables for creating the SQL server and database. Replace the values as with your own.

```powershell
# The logical server name: Use a random value or replace with your own value (do not capitalize)
$sqlserver = "sqlserver"
# Set an admin login and password 
$user = "SQLAdmin"
$password = "<password>"
# The ip address range that you want to allow to access your server - change as appropriate
$startip = "0.0.0.0"
$endip = "0.0.0.0"

```


Create an [Azure SQL Database logical server](../../sql-database/sql-database-features.md) using the [New-AzureRmSqlServer](/powershell/module/azurerm.sql/new-azurermsqlserver) command. A logical server contains a group of databases managed as a group. 

```powershell
New-AzureRmSqlServer -ResourceGroupName $resourceGroup `
    -ServerName $sqlserver `
    -Location $location `
    -SqlAdministratorCredentials $(New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList $user, $(ConvertTo-SecureString -String $password -AsPlainText -Force))
```

Create a [server-level firewall rule](../../sql-database/sql-database-firewall-configure.md) using the [New-AzureRmSqlServerFirewallRule](/powershell/module/azurerm.sql/new-azurermsqlserverfirewallrule) command. A server-level firewall rule allows an external application, like SQL Server Management Studio, to connect to a SQL database through firewall. In the following example, the firewall is only opened for other Azure resources. To enable external connectivity, change the IP address to fit your environment. To open all IP addresses, use 0.0.0.0 as the starting IP address and 255.255.255.255 as the ending address.

```powershell
New-AzureRmSqlServerFirewallRule -ResourceGroupName $resourceGroup `
    -ServerName $sqlserver `
    -FirewallRuleName "AllowSome" -StartIpAddress $startip -EndIpAddress $endip
```


Create an empty database named **musicstore** for an application to store data.

```powershell
New-AzureRmSqlDatabase  -ResourceGroupName $resourceGroup `
    -ServerName $sqlServer `
    -DatabaseName musicstore `
    -RequestedServiceObjectiveName "S0"
```

## Create a VM

The following script creates a fully configured VM named *myVM* that you can use for the rest of this tutorial.

```
# Create a variable for the VM name
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
$nsgRuleIIS = New-AzureRmNetworkSecurityRuleConfig -Name myNetworkSecurityGroupRuleIIS  -Protocol Tcp `
  -Direction Inbound -Priority 1010 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * `
  -DestinationPortRange 80 -Access Allow

# Create a network security group
$nsg = New-AzureRmNetworkSecurityGroup -ResourceGroupName $resourceGroup -Location $location `
  -Name myNetworkSecurityGroup -SecurityRules $nsgRuleRDP,$nsgRuleIIS

# Create a virtual network card and associate with public IP address and NSG
$nic = New-AzureRmNetworkInterface -Name myNic -ResourceGroupName $resourceGroup -Location $location `
  -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id -NetworkSecurityGroupId $nsg.Id

# Create a virtual machine configuration
$vmConfig = New-AzureRmVMConfig -VMName $vmName -VMSize Standard_D1 | `
Set-AzureRmVMOperatingSystem -Windows -ComputerName $vmName -Credential $cred | `
Set-AzureRmVMSourceImage -PublisherName MicrosoftWindowsServer -Offer WindowsServer -Skus 2016-Datacenter -Version latest | `
Add-AzureRmVMNetworkInterface -Id $nic.Id

# Create the VM
New-AzureRmVM -ResourceGroupName $resourceGroup -Location $location -VM $vmConfig
```
When the VM has been created, you can get the IP address by typing: '$pip.IpAddress'.

## Install IIS and the .NET Core SDK

Connect to the VM using the IP address. Open a PowerShell prompt inside the VM and run the following cmdlets to install IIS and the .NET Core SDK.

```powershell
# Create a folder to hold downloaded files 
New-Item -ItemType Directory c:\temp

# Install IIS and the IIS management tools on the VM
Install-WindowsFeature web-server -IncludeManagementTools

# Install the .NET Core SDK on the VM
Invoke-WebRequest https://go.microsoft.com/fwlink/?linkid=848827 -outfile c:\temp\dotnet-dev-win-x64.1.0.4.exe
Start-Process c:\temp\dotnet-dev-win-x64.1.0.4.exe -ArgumentList '/quiet' -Wait
Invoke-WebRequest https://go.microsoft.com/fwlink/?LinkId=817246 -outfile c:\temp\DotNetCore.WindowsHosting.exe
Start-Process c:\temp\DotNetCore.WindowsHosting.exe -ArgumentList '/quiet' -Wait
```

## Optional: Install a sample .NET application

Use the custom script extension to install a sample app from GitHub. We pass the path to a configuration file into [Set-AzureRmVMCustomScriptExtension](/powershell/module/azurerm.compute/set-azurermvmcustomscriptextension) to download and configure the sample application. To configure the .Net application on the VM, we need to provide the full path to the SQL server instance, the user name, and password to the script. 

```powershell
$sqlfqdn = ($sqlserver + '.database.windows.net')
Set-AzureRmVMCustomScriptExtension -ResourceGroupName $resourceGroup `
    -VMName $vmName `
    -Location $location `
    -FileUri https://raw.githubusercontent.com/MicrosoftDocs/MusicStoreSample/master/support-scripts/create-music-store.ps1 `
    -Run "create-music-store.ps1 -user $user -password $password -sqlserver $sqlfqdn" `
    -Name MusicStoreExtension
```


## Test the application

Get the public IP address from PowerShell.

```powershell
$pip.IpAddress
```

Open a browser and type in the public IP address for the VM to see the .NET Core app in action.

![Default page for the Music Store .NET Core app](./media/tutorial-iis-sql/musicstore.png) 



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

