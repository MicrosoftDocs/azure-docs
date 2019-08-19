---
title: Azure SQL Database instance pools how-to guide (preview) | Microsoft Docs
description: This article describes how to use Azure SQL Database instance pools (preview).
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: bonova
ms.author: bonova
ms.reviewer: sstein, carlrab
ms.date: 08/21/2019
---
# Azure SQL Database instance pools how-to guide

Instance pool operations are supported in PowerShell.

List of available [PowerShell commands](https://docs.microsoft.com/powershell/module/az.sql/)


|Cmdlet |Description |
|:---|:---|
|New-AzSqlInstancePool | Creates an Azure SQL Database managed instance pool. |
|Get-AzSqlInstancePool | Returns information about Azure SQL managed instance pool. |
|Set-AzSqlInstancePool | Sets properties for an Azure SQL Database managed instance pool. |
|Remove-AzSqlInstancePool | Removes an Azure SQL Database managed instance pool. |
|Get-AzSqlInstancePoolUsage | Returns information about Azure SQL managed instance pool usage. |


To use PowerShell, make sure you [install the latest version of PowerShell Core](https://docs.microsoft.com/powershell/scripting/install/installing-powershell#powershell-core).

Then follow instructions to [Install Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-az-ps).

For operations related to the managed instance inside pools, the standard [managed instance commands](sql-database-managed-instance-create-manage.md#powershell-create-and-manage-managed-instances) can be used. When using these commands for an instance in a pool, the instance pool name property must be populated.

### Examples

#### Create an instance pool

Step 1: Create new virtual network and subnet using [Azure portal template](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-managed-instance-create-vnet-subnet) or use instructions for [preparing an existing virtual network](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-managed-instance-configure-vnet-subnet)

Step 2: Execute command for creating new instance pool

```powershell
$instancePool = New-AzSqlInstancePool -ResourceGroupName "resource-group-name" -Name "mi-pool-name" -SubnetId "your-subnet-id" -LicenseType "BasePrice" -VCore 80 -Edition "GeneralPurpose" -ComputeGeneration "Gen5" -Location "westeurope"
```


### Create managed instance inside pool

```powershell
$instance = $instancePool | New-AzSqlInstance -Name "pool-mi-001" -VCore 2 -StorageSizeInGB 512
```

### Get pool usage with belonging managed instances details

```powershell
$myPool | Get-AzSqlInstancePoolUsage --ExpandChildren
```

### Update storage of managed instance placed inside the pool

```powershell
$instance | Set-AzSqlInstance -StorageSizeInGB 1024 -InstancePoolName "mi-pool-name"
```

### Get list of databases from managed instance

```powershell
$databases = Get-AzSqlInstanceDatabase -InstanceName "pool-mi-001" -ResourceGroupName " resource-group-name "
```

## How-to guide

This how-to section walks you through basic scenarios available in instance pools during public preview. While just a couple of operations will be available through Azure portal experience in public preview, PowerShell will cover all of them. 

The following table shows the available commands related to managed instance and instance pools and their availability in the Azure portal and PowerShell.


|Command|Azure Portal|PowerShell|
|:---|:---|:---|
|Create managed instance pool|No|Yes|
|Update managed instance pool (limited number of properties)|No |Yes |
|Check managed instance pool usage and properties|No|Yes |
|Delete managed instance pool|No|Yes|
|Create managed instance inside managed instance pool|No|Yes|
|Update managed instance resource usage|Yes |Yes|
|Check managed instance usage and properties|Yes|Yes|
|Delete managed instance from the pool|Yes|Yes|
|Create a database in managed instance placed in the pool|Yes|Yes|
|Delete a database from managed instance|Yes|Yes|

### Create managed instance pool 
 
Resources required and steps for creating managed instance pool include:

1. Virtual Network with subnet.
2. Preparing Virtual Network and subnet for an instance pool.
3. Creating an instance pool inside prepared Virtual Network and subnet.

### Create Virtual Network with subnet 
 
If you consider placing multiple instance pools inside the same Virtual Network, please refer to following articles:

- [Determine VNet subnet size for Azure SQL Database managed instance](sql-database-managed-instance-determine-size-vnet-subnet.md)
- [Create a virtual network for an Azure SQL Database managed instance](sql-database-managed-instance-create-vnet-subnet.md)

This step can be achieved either using the Azure portal or PowerShell. 

Example of PowerShell command that can be used (change the names of the virtual network and subnet, and adjust the IP ranges associated with your networking resources):

```powershell
$virtualNetwork = New-AzVirtualNetwork `
  -ResourceGroupName myResourceGroup `
  -Location EastUS `
  -Name miPoolVirtualNetwork`
  -AddressPrefix 10.0.0.0/16
```

After creating Virtual Network add a subnet inside it:

```powershell
$subnetConfig = Add-AzVirtualNetworkSubnetConfig `
  -Name miPoolSubnet`
  -AddressPrefix 10.0.0.0/24 `
  -VirtualNetwork $virtualNetwork
```

### Preparing Virtual Network and subnet for managed instance 

Instance pools must be deployed within an Azure virtual network and the subnet dedicated for managed instances pools only. The same guidelines are applied for managed instance and managed instances pools [](sql-database-managed-instance-configure-vnet-subnet.md)

For preparing Virtual Network and Subnet execute the following command with your subscription id, and names for resource group, virtual network, and subnet used in the previous step.


```powershell
$scriptUrlBase = 'https://raw.githubusercontent.com/Microsoft/sql-server-samples/master/samples/manage/azure-sql-db-managed-instance/prepare-subnet'
  
$parameters = @{
    subscriptionId = '<subscriptionId>'
    resourceGroupName = '<resourceGroupName>'
    virtualNetworkName = '<virtualNetworkName>'
    subnetName = '<subnetName>'
    }

Invoke-Command -ScriptBlock ([Scriptblock]::Create((iwr ($scriptUrlBase+'/prepareSubnet.ps1?t='+ [DateTime]::Now.Ticks)).Content)) -ArgumentList $parameters
```

### Create a managed instance inside prepared Virtual Network and Subnet 
 
After completing previous steps, you are ready to create instance pools.

Several restrictions to follow:

- Only General Purpose and Gen5 are available in public preview.
- Pool name can contain only lowercase, numbers and hyphen, and can't start with a hyphen.
- In order to get subnet ID, use `Get-AzVirtualNetworkSubnetConfig -Name "miPoolSubnet" -VirtualNetwork $virtualNetwork`.
- If you want to use AHB (Azure Hybrid Benefit), it is applied on instance pool level. You can set the license type during pool creation or update it anytime after creation.

> [!IMPORTANT]
> Deploying an instance pool is a long running operation that takes approximately 4.5 hours.

To create an instance pool:

```powershell
$instancePool = New-AzSqlInstancePool `
  -ResourceGroupName "myResourceGroup" `
  -Name "mi-pool-name" `
  -SubnetId "/subscriptions/a8c9a924-06c0-4bde-9788-e7b1370969e1/resourceGroups/ myResourceGroup /providers/Microsoft.Network/virtualNetworks/ miPoolVirtualNetwork /subnets/ miPoolSubnet" `
  -LicenseType "LicenceIncluded" `
  -VCore 80 `
  -Edition "GeneralPurpose" `
  -ComputeGeneration "Gen5" `
  -Location "westeurope"
```


Because deploying an instance pool is a long running operation, you need to wait until it completes before running any of the following steps. 

### Create managed instance inside the pool 

After the successful deployment of the instance pool, it's time to create first instance inside it. For creating a managed instance execute the following:
```powershell
$instanceOne = $instancePool | New-AzSqlInstance -Name "poolmi-001" -VCore 2 -StorageSizeInGB 256
```

Deploying instance inside the pool is an operation that takes a couple of minutes. After the first instance has been created, we can create the second one:
```powershell
$instanceTwo = $instancePool | New-AzSqlInstance -Name "poolmi-001" -VCore 4 -StorageSizeInGB 512
```

### Check managed instance pool usage 
 
To get a list of instances inside a pool:

```powershell
$instancePool | Get-AzSqlInstance
```


To get pool resource usage:

```powershell
$instancePool | Get-AzSqlInstancePoolUsage
```


For a detailed usage overview of the pool and instances inside it execute

```powershell
$instancePool | Get-AzSqlInstancePoolUsage –ExpandChildren
```

> [!NOTE]
> There is a limit of 100 databases per pool (not per instance).

### Create a database inside instance 

For creating a database and managing databases that in managed instance placed inside the pool, same set of commands like for singleton managed instance is used.

To create a database inside a managed instance:

```powershell
$poolinstancedb = New-AzSqlInstanceDatabase -Name "mipooldb1" -InstanceName "poolmi-001" -ResourceGroupName "myResourceGroup"
```


### Scale managed instance inside the pool 


After populating managed instance with databases and start with test or production, you may hit instance limits regarding storage of performance. In that case, if pool usage has not exceeded, you are able to scale your instance. 

Example of command for scaling number of vCores and storage size


```powershell
$instanceOne | Set-AzSqlInstance -VCore 8 -StorageSizeInGB 512  -InstancePoolName "mi-pool-name"
```


Scaling managed instance inside pool is an operation that takes a couple of minutes. Prerequisite for scaling is available vCores and storage on the instance pool level. 


### Connect to managed instance placed inside the pool

Two steps are required for achieving this:

1. Enabling public endpoint for the instance.
2. Adding inbound rule to network security group.

After both steps are completed, you can connect to the instance by using public endpoint address, port and credentials provided during instance creation. 

Enabling public endpoint for instance

This can be done through portal or using the following PowerShell command:


```powershell
$instanceOne | Set-AzSqlInstance -PublicDataEndpointEnabled true
```

This parameter can be set during instance creation as well.

### Add an inbound rule to NSG 
 
This step can also be achieve through portal or using PowerShell commands:


```powershell
$RGname="myResourceGroup" 
$port=3342 
$rulename="public_endpoint_inbound" 
$nsgname="nsg-mi-pool-name"
```

### Get the NSG resource


```powershell
$resource = Get-AzResource | Where {$_.ResourceGroupName –eq $RGname -and $_.ResourceType -eq "Microsoft.Network/networkSecurityGroups"}
$nsg = Get-AzNetworkSecurityGroup -Name $nsgname -ResourceGroupName $RGname
```


### Add the inbound security rule


```powershell
$nsg | Add-AzNetworkSecurityRuleConfig -Name $rulename -Description "Allow app port" -Access Allow `
    -Protocol * -Direction Inbound -Priority 1300 -SourceAddressPrefix "*" -SourcePortRange * `
    -DestinationAddressPrefix * -DestinationPortRange $port
```


### Update the NSG


```powershell
$nsg | Set-AzNetworkSecurityGroup
```

> [!NOTE]
> Adding inbound rule can be done at any time after the subnet is prepared for managed instance as described previously in this article.

## Next steps

- To learn how to create your first managed instance, see [Quickstart guide](sql-database-managed-instance-get-started.md).
- For a features and comparison list, see [SQL common features](sql-database-features.md).
- For more information about VNet configuration, see [managed instance VNet configuration](sql-database-managed-instance-connectivity-architecture.md).
- For a quickstart that creates a managed instance and restores a database from a backup file, see [create a managed instance](sql-database-managed-instance-get-started.md).
- For a tutorial using the Azure Database Migration Service (DMS) for migration, see [managed instance migration using DMS](../dms/tutorial-sql-server-to-managed-instance.md).
- For advanced monitoring of managed instance database performance with built-in troubleshooting intelligence, see [Monitor Azure SQL Database using Azure SQL Analytics](../azure-monitor/insights/azure-sql.md).
- For pricing information, see [SQL Database managed instance pricing](https://azure.microsoft.com/pricing/details/sql-database/managed/).