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
ms.date: 08/1/2017
ms.author: cynthn
ms.custom: mvc
---

# Tutorial IIS SQL .Net Core 

In this tutorial, we will build a two-tier demo music store .Net Core application that runs on a Windows Azure VM and connects to an Azure SQL database.

> [!div class="checklist"]
> * Create an Azure SQL server and database
> * Create a VM 
> * Configure the VM to run a .NET core sample application
> * Connect to the application to see it running

You can also deploy this entire sample (including the fully configured VM) using an example template. For more information, see [Deploy Two Tier Application on Windows and Azure SQL DB](https://github.com/neilpeterson/nepeters-azure-templates/blob/master/dotnet-core-music-vm-sql-db/README.MD).

## Create a resource group

Create an [Azure resource group](../azure-resource-manager/resource-group-overview.md) using the [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) command. A resource group is a logical container into which Azure resources are deployed and managed as a group. The following example creates a resource group named *myResourceGroup* in the *West US* location.

```powershell
$location = westus
$resourceGroup = "myResourceGroup"
New-AzureRmResourceGroup -Name $resourceGroup -Location $location
```

## Azure SQL

Define variables for creating the SQL server and database. Replace these pre-defined values as with your own.

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


Create an [Azure SQL Database logical server](sql-database-features.md) using the [New-AzureRmSqlServer](/powershell/module/azurerm.sql/new-azurermsqlserver) command. A logical server contains a group of databases managed as a group. 

```powershell
New-AzureRmSqlServer -ResourceGroupName $resourceGroup `
    -ServerName $sqlserver `
    -Location $location `
    -SqlAdministratorCredentials $(New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList $user, $(ConvertTo-SecureString -String $password -AsPlainText -Force))
```

Create an [server-level firewall rule](sql-database-firewall-configure.md) using the [New-AzureRmSqlServerFirewallRule](/powershell/module/azurerm.sql/new-azurermsqlserverfirewallrule) command. A server-level firewall rule allows an external application, such as SQL Server Management Studio or the SQLCMD utility to connect to a SQL database through the SQL Database service firewall. In the following example, the firewall is only opened for other Azure resources. To enable external connectivity, change the IP address to an appropriate address for your environment. To open all IP addresses, use 0.0.0.0 as the starting IP address and 255.255.255.255 as the ending address.

```powershell
New-AzureRmSqlServerFirewallRule -ResourceGroupName $resourceGroup `
    -ServerName $sqlserver `
    -FirewallRuleName "AllowSome" -StartIpAddress $startip -EndIpAddress $endip
```

> [!NOTE]
> SQL Database communicates over port 1433. If you are trying to connect from within a corporate network, outbound traffic over port 1433 may not be allowed by your network's firewall. If so, you will not be able to connect to your Azure SQL Database server unless your IT department opens port 1433.
>


Create an empty database named **musicstore** for the application to store data.

```powershell
New-AzureRmSqlDatabase  -ResourceGroupName $resourcegroupname `
    -ServerName $servername `
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
$nsgRuleIIS = New-AzureRmNetworkSecurityRuleConfig -Name myNetworkSecurityGroupRuleRDP  -Protocol Tcp `
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

## Create a script to configure the VM

In a previous tutorial on [How to customize a Windows virtual machine](tutorial-automate-vm-deployment.md), you learned how to automate VM customization with the Custom Script Extension for Windows. You can use the same approach to install and configure IIS and the .NET sample application on your VM.

Copy the following script and save it as musicstore.ps1. 

```powershell
Param (
    [string]$user ,
    [string]$password,
    [string]$sqlserver 
)

# Open port 80 on the firewall to allow web traffic
netsh advfirewall firewall add rule name="http" dir=in action=allow protocol=TCP localport=80

# Create folders for the application to use
New-Item -ItemType Directory c:\temp
New-Item -ItemType Directory c:\music

# Install IIS on the VM
Install-WindowsFeature web-server -IncludeManagementTools

# Install the .NET Core SDK on the VM
Invoke-WebRequest https://go.microsoft.com/fwlink/?linkid=848827 -outfile c:\temp\dotnet-dev-win-x64.1.0.4.exe
Start-Process c:\temp\dotnet-dev-win-x64.1.0.4.exe -ArgumentList '/quiet' -Wait
Invoke-WebRequest https://go.microsoft.com/fwlink/?LinkId=817246 -outfile c:\temp\DotNetCore.WindowsHosting.exe
Start-Process c:\temp\DotNetCore.WindowsHosting.exe -ArgumentList '/quiet' -Wait

# Download the files and configure the app
Invoke-WebRequest  https://github.com/neilpeterson/nepeters-azure-templates/raw/master/dotnet-core-music-vm-sql-db/music-app/music-store-azure-demo-pub.zip -OutFile c:\temp\musicstore.zip
Expand-Archive C:\temp\musicstore.zip c:\music
(Get-Content C:\music\config.json) | ForEach-Object { $_ -replace "<replaceserver>", $sqlserver } | Set-Content C:\music\config.json
(Get-Content C:\music\config.json) | ForEach-Object { $_ -replace "<replaceuser>", $user } | Set-Content C:\music\config.json
(Get-Content C:\music\config.json) | ForEach-Object { $_ -replace "<replacepass>", $password } | Set-Content C:\music\config.json

# The following is a workaround for a database creation bug
Start-Process 'C:\Program Files\dotnet\dotnet.exe' -ArgumentList 'c:\music\MusicStore.dll'

# Configure IIS to work with the application
Remove-WebSite -Name "Default Web Site"
Set-ItemProperty IIS:\AppPools\DefaultAppPool\ managedRuntimeVersion ""
New-Website -Name "MusicStore" -Port 80 -PhysicalPath C:\music\ -ApplicationPool DefaultAppPool
& iisreset
```

## Upload the script

Configuration scripts can be stored in either GitHub or in Azure blob storage. In this example, we are going to upload the file *C:\musicstore\musicstore.ps1* to a storage account called *mystorageaccount*, into a container named *mycontainer*. The permissions on the container will be set to **blob** so that the file can be used by the custom script extension.

```powershell
$StorageAccountName = "mystorageaccount"
$ContainerName = "mycontainer"
$ScriptToUpload = "C:\musicstore\musicstore.ps1"

New-AzureRMStorageAccount –StorageAccountName $StorageAccountName -SkuName "Standard_LRS" -Kind "Storage" -ResourceGroupName $resourceGroup -Location $Location
$key = Get-AzureRmStorageAccountKey -Name $StorageAccountName -ResourceGroupName $resourceGroup
$context = New-AzureStorageContext -StorageAccountName $StorageAccountName -StorageAccountKey $key[0].Value;
New-AzureStorageContainer -Name $ContainerName -Context $context -Permission blob
Set-AzureStorageBlobContent -Container $ContainerName -File $ScriptToUpload -Context $context
$scriptURL = (Get-AzureStorageBlob -Container $ContainerName -Context $context).ICloudBlob.uri.AbsoluteUri
```

## Configure the VM


We pass the path to a configuration script, that you uploaded to blob storage, into [Set-AzureRmVMCustomScriptExtension](/powershell/module/azurerm.compute/set-azurermvmcustomscriptextension) to download and configure the sample application. To configure the .Net application on the VM, we need to provide the full path to the SQL server instance, the user name and password to the script. 

```powershell
$sqlfqdn = ($sqlserver + '.database.windows.net')
Set-AzureRmVMCustomScriptExtension -ResourceGroupName $resourceGroup `
    -VMName $vmName `
    -Location $location `
    -FileUri $scriptURL `
    -Run "musicstore.ps1 -user $user -password $password -sqlserver $sqlfqdn" `
    -Name MusicStoreExtension
```

## Test the application

Get the public IP address from PowerShell.

```powershell
$pip.IpAddress
```

Open a browser and type in the public IP address for the VM to see the .NET app in action.

![Default page for the Music Store .NET Core app](./media/tutorial-iis-sql/musicstore.png) 



## Next steps

In this tutorial, you created a two-tier .Net Core sample music store application. You learned how to:

> [!div class="checklist"]
> * Create an Azure SQL server and database
> * Create a VM 
> * Configure the VM to run a .NET core sample application
> * Connect to the application to see it running

You can deploy this entire sample (including the fully configured VM) using an example template. For more information, see [Deploy Two Tier Application on Windows and Azure SQL DB](https://github.com/neilpeterson/nepeters-azure-templates/blob/master/dotnet-core-music-vm-sql-db/README.MD).

