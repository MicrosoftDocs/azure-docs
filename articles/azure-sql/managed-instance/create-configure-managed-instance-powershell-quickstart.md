---
title: Create Azure SQL Managed Instance - Quickstart
description: Create an instance of Azure SQL Managed Instance using Azure PowerShell. 
services: sql-managed-instance
ms.service: sql-managed-instance
ms.subservice: deployment-configuration
ms.custom: contperf-fy21q1, devx-track-azurecli, devx-track-azurepowershell
ms.devlang:
ms.topic: quickstart
author: MashaMSFT
ms.author: mathoma
ms.reviewer: 
ms.date: 06/25/2021
---
# Quickstart: Create a managed instance using Azure PowerShell

In this quickstart, learn to create an instance of [Azure SQL Managed Instance](sql-managed-instance-paas-overview.md) using Azure PowerShell. 


## Prerequisite

- An active Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- The latest version of [Azure PowerShell](/powershell/azure/install-az-ps). 

## Set variables

Creating a SQL Manged Instance requires creating several resources within Azure, and as such, the Azure PowerShell commands rely on variables to simplify the experience. Define the variables, and then execute the the cmdlets in each section within the same PowerShell session. 

```azurepowershell-interactive
$NSnetworkModels = "Microsoft.Azure.Commands.Network.Models"
$NScollections = "System.Collections.Generic"
# The SubscriptionId in which to create these objects
$SubscriptionId = ''
# Set the resource group name and location for your managed instance
$resourceGroupName = "myResourceGroup-$(Get-Random)"
$location = "eastus2"
# Set the networking values for your managed instance
$vNetName = "myVnet-$(Get-Random)"
$vNetAddressPrefix = "10.0.0.0/16"
$miSubnetName = "myMISubnet-$(Get-Random)"
$miSubnetAddressPrefix = "10.0.0.0/24"
#Set the managed instance name for the new managed instance
$instanceName = "myMIName-$(Get-Random)"
# Set the admin login and password for your managed instance
$miAdminSqlLogin = "SqlAdmin"
$miAdminSqlPassword = "ChangeYourAdminPassword1"
# Set the managed instance service tier, compute level, and license mode
$edition = "General Purpose"
$vCores = 4
$maxStorage = 128
$computeGeneration = "Gen5"
$license = "LicenseIncluded" #"BasePrice" or LicenseIncluded if you have don't have SQL Server licence that can be used for AHB discount
```

## Create resource group 

First, connect to Azure, set your subscription context, and create your resource group. 

To do so, execute this PowerShell script: 

```azurepowershell-interactive

## Connect to Azure
Connect-AzAccount

# Set subscription context
Set-AzContext -SubscriptionId $SubscriptionId 

# Create a resource group
$resourceGroup = New-AzResourceGroup -Name $resourceGroupName -Location $location -Tag @{Owner="SQLDB-Samples"}
```

## Configure networking

After your resource group is created, configure the networking resources such as the virtual network, subnets, network security group, and routing table. This example demonstrates the use of the **Delegate subnet for Managed Instance deployment** script, which is available on GitHub as [delegate-subnet.ps1](https://github.com/microsoft/sql-server-samples/tree/master/samples/manage/azure-sql-db-managed-instance/delegate-subnet).

To do so, execute this PowerShell script: 

```azurepowershell-interactive

# Configure virtual network, subnets, network security group, and routing table
$virtualNetwork = New-AzVirtualNetwork `
                      -ResourceGroupName $resourceGroupName `
                      -Location $location `
                      -Name $vNetName `
                      -AddressPrefix $vNetAddressPrefix

                  Add-AzVirtualNetworkSubnetConfig `
                      -Name $miSubnetName `
                      -VirtualNetwork $virtualNetwork `
                      -AddressPrefix $miSubnetAddressPrefix |
                  Set-AzVirtualNetwork
                  
$scriptUrlBase = 'https://raw.githubusercontent.com/Microsoft/sql-server-samples/master/samples/manage/azure-sql-db-managed-instance/delegate-subnet'

$parameters = @{
    subscriptionId = $SubscriptionId
    resourceGroupName = $resourceGroupName
    virtualNetworkName = $vNetName
    subnetName = $miSubnetName
    }

Invoke-Command -ScriptBlock ([Scriptblock]::Create((iwr ($scriptUrlBase+'/delegateSubnet.ps1?t='+ [DateTime]::Now.Ticks)).Content)) -ArgumentList $parameters

$virtualNetwork = Get-AzVirtualNetwork -Name $vNetName -ResourceGroupName $resourceGroupName
$miSubnet = Get-AzVirtualNetworkSubnetConfig -Name $miSubnetName -VirtualNetwork $virtualNetwork
$miSubnetConfigId = $miSubnet.Id
```

## Create managed instance 

For added security, create a complex and randomized password for your SQL Managed Instance credential: 

```azurepowershell-interactive
# Create credentials
$secpassword = ConvertTo-SecureString $miAdminSqlPassword -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential ($miAdminSqlLogin, $secpassword)
```

Then create your SQL Managed Instance: 

```azurepowershell-interactive
# Create managed instance
New-AzSqlInstance -Name $instanceName `
                      -ResourceGroupName $resourceGroupName -Location $location -SubnetId $miSubnetConfigId `
                      -AdministratorCredential $credential `
                      -StorageSizeInGB $maxStorage -VCore $vCores -Edition $edition `
                      -ComputeGeneration $computeGeneration -LicenseType $license
```

This operation may take some time to complete. To learn more, see [Management operations](management-operations-overview.md).


## Clean up resources

Keep the resource group, and managed instance to go on to the next steps, and learn how to connect to your SQL Managed Instance using a client virtual machine. 

When you're finished using these resources, you can delete the resource group you created, which will also delete the server and single database within it.

```azurepowershell-interactive
# Clean up deployment 
Remove-AzResourceGroup -ResourceGroupName $resourceGroupName
```


## Next steps

After your SQL Managed Instance is created, deploy a client VM to connect to your SQL Managed Instance, and restore a sample database. 

> [!div class="nextstepaction"]
> [Create client VM](connect-vm-instance-configure.md)
> [Restore database](restore-sample-database-quickstart.md)


