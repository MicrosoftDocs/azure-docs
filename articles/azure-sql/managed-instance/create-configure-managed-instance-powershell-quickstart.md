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

In this quickstart, learn to create an instance of [Azure SQL Managed Instance](single-database-overview.md) using Azure PowerShell. 


## Prerequisite

- An active Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- The latest version of [Azure PowerShell](/powershell/azure/install-az-ps). 

## Set variables

Creating a SQL Manged Instance requires creating several resources within Azure, and as such, the Azure PowerShell commands rely on variables to simplify the experience. Define the variables, and then execute the rest of the steps within the same PowerShell session. 

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
$defaultSubnetName = "myDefaultSubnet-$(Get-Random)"
$defaultSubnetAddressPrefix = "10.0.0.0/24"
$miSubnetName = "myMISubnet-$(Get-Random)"
$miSubnetAddressPrefix = "10.0.0.0/24"
#Set the managed instance name for the new managed instance
$instanceName = "myMIName-$(Get-Random)"
# Set the admin login and password for your managed instance
$miAdminSqlLogin = "SqlAdmin"
$miAdminSqlPassword = "ChangeYourAdminPassword1"
# Set the managed instance service tier, compute level, and license mode
$edition = "General Purpose"
$vCores = 8
$maxStorage = 256
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

After your resource group is created, configure the networking resources such as the virtual network, subnets, network security group, and routing table. 

To do so, execute this PowerShell script: 

```azurepowershell-interactive

# Configure virtual network, subnets, network security group, and routing table
$networkSecurityGroupMiManagementService = New-AzNetworkSecurityGroup `
                      -Name 'myNetworkSecurityGroupMiManagementService' `
                      -ResourceGroupName $resourceGroupName `
                      -location $location

$routeTableMiManagementService = New-AzRouteTable `
                      -Name 'myRouteTableMiManagementService' `
                      -ResourceGroupName $resourceGroupName `
                      -location $location

$virtualNetwork = New-AzVirtualNetwork `
                      -ResourceGroupName $resourceGroupName `
                      -Location $location `
                      -Name $vNetName `
                      -AddressPrefix $vNetAddressPrefix

                  Add-AzVirtualNetworkSubnetConfig `
                      -Name $miSubnetName `
                      -VirtualNetwork $virtualNetwork `
                      -AddressPrefix $miSubnetAddressPrefix `
                      -NetworkSecurityGroup $networkSecurityGroupMiManagementService `
                      -RouteTable $routeTableMiManagementService |
                  Set-AzVirtualNetwork

$virtualNetwork = Get-AzVirtualNetwork -Name $vNetName -ResourceGroupName $resourceGroupName

$subnet= $virtualNetwork.Subnets[0]

# Create a delegation
$subnet.Delegations = New-Object "$NScollections.List``1[$NSnetworkModels.PSDelegation]"
$delegationName = "dgManagedInstance" + (Get-Random -Maximum 1000)
$delegation = New-AzDelegation -Name $delegationName -ServiceName "Microsoft.Sql/managedInstances"
$subnet.Delegations.Add($delegation)

Set-AzVirtualNetwork -VirtualNetwork $virtualNetwork

$miSubnetConfigId = $subnet.Id

$allowParameters = @{
    Access = 'Allow'
    Protocol = 'Tcp'
    Direction= 'Inbound'
    SourcePortRange = '*'
    SourceAddressPrefix = 'VirtualNetwork'
    DestinationAddressPrefix = '*'
}
$denyInParameters = @{
    Access = 'Deny'
    Protocol = '*'
    Direction = 'Inbound'
    SourcePortRange = '*'
    SourceAddressPrefix = '*'
    DestinationPortRange = '*'
    DestinationAddressPrefix = '*'
}
$denyOutParameters = @{
    Access = 'Deny'
    Protocol = '*'
    Direction = 'Outbound'
    SourcePortRange = '*'
    SourceAddressPrefix = '*'
    DestinationPortRange = '*'
    DestinationAddressPrefix = '*'
}

Get-AzNetworkSecurityGroup `
        -ResourceGroupName $resourceGroupName `
        -Name "myNetworkSecurityGroupMiManagementService" |
    Add-AzNetworkSecurityRuleConfig `
        @allowParameters `
        -Priority 1000 `
        -Name "allow_tds_inbound" `
        -DestinationPortRange 1433 |
    Add-AzNetworkSecurityRuleConfig `
        @allowParameters `
        -Priority 1100 `
        -Name "allow_redirect_inbound" `
        -DestinationPortRange 11000-11999 |
    Add-AzNetworkSecurityRuleConfig `
        @denyInParameters `
        -Priority 4096 `
        -Name "deny_all_inbound" |
    Add-AzNetworkSecurityRuleConfig `
        @denyOutParameters `
        -Priority 4096 `
        -Name "deny_all_outbound" |
    Set-AzNetworkSecurityGroup
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

Keep the resource group, and managed instance to go on to the next steps, and learn how to connect to your SQL Managed Instance. 

When you're finished using these resources, you can delete the resource group you created, which will also delete the server and single database within it.

```azurepowershell-interactive
# Clean up deployment 
Remove-AzResourceGroup -ResourceGroupName $resourceGroupName
```


## Next steps


After your SQL Managed Instance creation completes, create a client VM to connect to your SQL Managed Instance, and restore a sample database. 

> [!div class="nextstepaction"]
> [Create client VM](connect-vm-instance-configure.md)
> [Restore database](connect-query-ssms.md)



