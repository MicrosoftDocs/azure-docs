---
title: Azure SQL Database instance pools how-to guide (preview) | Microsoft Docs
description: This article describes how to create and manage Azure SQL Database instance pools (preview).
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

This article provides details on how to accomplish the basic scenarios available in [instance pools (preview)](sql-database-instance-pools.md).

## Instance pool operations

The following table shows the available operations related to instance pools and their availability in the Azure portal and PowerShell.

|Command|Azure Portal|PowerShell|
|:---|:---|:---|
|Create instance pool|No|Yes|
|Update instance pool (limited number of properties)|No |Yes |
|Check instance pool usage and properties|No|Yes |
|Delete instance pool|No|Yes|
|Create managed instance inside instance pool|No|Yes|
|Update managed instance resource usage|Yes |Yes|
|Check managed instance usage and properties|Yes|Yes|
|Delete managed instance from the pool|Yes|Yes|
|Create a database in managed instance placed in the pool|Yes|Yes|
|Delete a database from managed instance|Yes|Yes|

Available [PowerShell commands](https://docs.microsoft.com/powershell/module/az.sql/)

|Cmdlet |Description |
|:---|:---|
|New-AzSqlInstancePool | Creates an Azure SQL Database instance pool. |
|Get-AzSqlInstancePool | Returns information about Azure SQL instance pool. |
|Set-AzSqlInstancePool | Sets properties for an Azure SQL Database instance pool. |
|Remove-AzSqlInstancePool | Removes an Azure SQL Database instance pool. |
|Get-AzSqlInstancePoolUsage | Returns information about Azure SQL instance pool usage. |


To use PowerShell, [install the latest version of PowerShell Core](https://docs.microsoft.com/powershell/scripting/install/installing-powershell#powershell-core), and follow instructions to [Install the Azure PowerShell module](https://docs.microsoft.com/powershell/azure/install-az-ps).

For operations related to the instances inside pools, use the standard [managed instance commands](sql-database-managed-instance-create-manage.md#powershell-create-and-manage-managed-instances). When using these commands for an instance in a pool, the instance pool name property must be populated.

## Create an instance pool

Resources required and steps for creating instance pool include:

1. Create a virtual network with subnet.
2. Preparing Virtual Network and subnet for an instance pool.
3. Creating an instance pool inside prepared Virtual Network and subnet.



### Create a virtual network with subnet 

If you consider placing multiple instance pools inside the same virtual network, refer to following articles:

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

For details, see create new virtual network and subnet using [Azure portal template](sql-database-managed-instance-create-vnet-subnet.md) or use instructions for [preparing an existing virtual network](sql-database-managed-instance-configure-vnet-subnet.md).


### Preparing a virtual network and subnet for managed instance 

Instance pools must be deployed within an Azure virtual network and the subnet dedicated for managed instances pools only. The same guidelines are applied for single instance and instance pools.

To prepare a virtual network and subnet run the following command with your subscription id, and names for resource group, virtual network, and subnet used in the previous step.

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

### Create an instance pool 

After completing the previous steps, you are ready to create an instance pool.

The following restrictions apply to instance pools:

- Only General Purpose and Gen5 are available in public preview.
- Pool name can contain only lowercase, numbers and hyphen, and can't start with a hyphen.
- To get the subnet ID, use `Get-AzVirtualNetworkSubnetConfig -Name "miPoolSubnet" -VirtualNetwork $virtualNetwork`.
- If you want to use AHB (Azure Hybrid Benefit), it is applied at the instance pool level. You can set the license type during pool creation or update it anytime after creation.

> [!IMPORTANT]
> Deploying an instance pool is a long running operation that takes approximately 4.5 hours.

To create an instance pool:

```powershell
$instancePool = New-AzSqlInstancePool `
  -ResourceGroupName "myResourceGroup" `
  -Name "mi-pool-name" `
  -SubnetId "/subscriptions/subscriptionID/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/miPoolVirtualNetwork/subnets/miPoolSubnet" `
  -LicenseType "LicenceIncluded" `
  -VCore 80 `
  -Edition "GeneralPurpose" `
  -ComputeGeneration "Gen5" `
  -Location "westeurope"
```

Because deploying an instance pool is a long running operation, you need to wait until it completes before running any of the following steps. 

## Create a managed instance inside the pool 

After the successful deployment of the instance pool, it's time to create an instance inside it. For creating a managed instance execute the following:

```powershell
$instanceOne = $instancePool | New-AzSqlInstance -Name "mi-pool-name" -VCore 2 -StorageSizeInGB 256
```

Deploying instance inside the pool is an operation that takes a couple of minutes. After the first instance has been created, we can create the second one:
```powershell
$instanceTwo = $instancePool | New-AzSqlInstance -Name "mi-pool-name" -VCore 4 -StorageSizeInGB 512
```

## Get instance pool usage 
 
To get a list of instances inside a pool:

```powershell
$instancePool | Get-AzSqlInstance
```


To get pool resource usage:

```powershell
$instancePool | Get-AzSqlInstancePoolUsage
```


For a detailed usage overview of the pool and instances inside it:

```powershell
$instancePool | Get-AzSqlInstancePoolUsage –ExpandChildren
```

To list the databases in a managed instance:

```powershell
$databases = Get-AzSqlInstanceDatabase -InstanceName "pool-mi-001" -ResourceGroupName " resource-group-name "
```




> [!NOTE]
> There is a limit of 100 databases per pool (not per instance).

## Create a database inside an instance 

To create and manage databases in a managed instance that's inside a pool, use the single instance commands.

To create a database inside a managed instance:

```powershell
$poolinstancedb = New-AzSqlInstanceDatabase -Name "mipooldb1" -InstanceName "poolmi-001" -ResourceGroupName "myResourceGroup"
```


## Scale a managed instance inside a pool 


After populating a managed instance with databases, you may hit instance limits regarding storage of performance. In that case, if pool usage has not been exceeded, you can scale your instance. 

To update the number of vCores and storage size:

```powershell
$instanceOne | Set-AzSqlInstance -VCore 8 -StorageSizeInGB 512  -InstancePoolName "mi-pool-name"
```


To update storage size:

```powershell
$instance | Set-AzSqlInstance -StorageSizeInGB 1024 -InstancePoolName "mi-pool-name"
```


Scaling a managed instance inside a pool is an operation that takes a couple of minutes. The prerequisite for scaling is available vCores and storage on the instance pool level. 


## Connect to managed instance placed inside the pool

Two steps are required for achieving this:

1. Enabling public endpoint for the instance.
2. Adding inbound rule to network security group.

After both steps are completed, you can connect to the instance by using a public endpoint address, port, and credentials provided during instance creation. 

Enabling public endpoint for instance can be done through teh Azure portal or by using the following PowerShell command:


```powershell
$instanceOne | Set-AzSqlInstance -PublicDataEndpointEnabled true
```

This parameter can be set during instance creation as well.

## Add an inbound rule to NSG 
 
This step can also be achieve through portal or using PowerShell commands:


```powershell
$RGname="myResourceGroup" 
$port=3342 
$rulename="public_endpoint_inbound" 
$nsgname="nsg-mi-pool-name"
```

## Get the NSG resource


```powershell
$resource = Get-AzResource | Where {$_.ResourceGroupName –eq $RGname -and $_.ResourceType -eq "Microsoft.Network/networkSecurityGroups"}
$nsg = Get-AzNetworkSecurityGroup -Name $nsgname -ResourceGroupName $RGname
```


## Add the inbound security rule


```powershell
$nsg | Add-AzNetworkSecurityRuleConfig -Name $rulename -Description "Allow app port" -Access Allow `
    -Protocol * -Direction Inbound -Priority 1300 -SourceAddressPrefix "*" -SourcePortRange * `
    -DestinationAddressPrefix * -DestinationPortRange $port
```


## Update the NSG


```powershell
$nsg | Set-AzNetworkSecurityGroup
```

> [!NOTE]
> Adding inbound rule can be done at any time after the subnet is prepared for managed instance as described previously in this article.



## Next steps

- For a features and comparison list, see [SQL common features](sql-database-features.md).
- For more information about VNet configuration, see [managed instance VNet configuration](sql-database-managed-instance-connectivity-architecture.md).
- For a quickstart that creates a managed instance and restores a database from a backup file, see [create a managed instance](sql-database-managed-instance-get-started.md).
- For a tutorial using the Azure Database Migration Service (DMS) for migration, see [managed instance migration using DMS](../dms/tutorial-sql-server-to-managed-instance.md).
- For advanced monitoring of managed instance database performance with built-in troubleshooting intelligence, see [Monitor Azure SQL Database using Azure SQL Analytics](../azure-monitor/insights/azure-sql.md).
- For pricing information, see [SQL Database managed instance pricing](https://azure.microsoft.com/pricing/details/sql-database/managed/).

