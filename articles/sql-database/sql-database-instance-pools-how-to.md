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
ms.date: 08/22/2019
---
# Azure SQL Database instance pools (preview) how-to guide

This article provides details on how to create and manage [instance pools](sql-database-instance-pools.md).

## Instance pool operations

The following table shows the available operations related to instance pools and their availability in the Azure portal and PowerShell.

|Command|Azure portal|PowerShell|
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

For operations related to the instances inside pools, use the standard [managed instance commands](sql-database-managed-instance-create-manage.md#powershell-create-and-manage-managed-instances). When using these commands for an instance in a pool, the *instance pool name* property must be populated.

## How to deploy managed instances into pools

The process of deploying an instance into a pool consists of two separate steps:

1. One-off instance pool deployment. This is a long running operation, where the duration is same as for the [first instance created in an empty subnet](sql-database-managed-instance.md#managed-instance-management-operations).

2. Repetitive instance deployment within the pool. The instance pool parameter must be explicitly specified as part of this operation. This is a relatively fast operation that typically takes up to 5 minutes.

In public preview, both steps are supported through PowerShell and Resource Manager templates only. The Azure portal experience should be coming soon.

After a managed instance is deployed in a pool, you *can* use the Azure portal to change its properties on the Pricing tier page.


## Create an instance pool

Resources required and steps for creating instance pool include:

1. [Create a virtual network with subnet](#create-a-virtual-network-with-subnet)
2. [Creating an instance pool](#create-an-instance-pool)



### Create a virtual network with subnet 

If you consider placing multiple instance pools inside the same virtual network, refer to the following articles:

- [Determine VNet subnet size for Azure SQL Database managed instance](sql-database-managed-instance-determine-size-vnet-subnet.md)

Create new virtual network and subnet using the [Azure portal template](NEED LINK) or follow the instructions for [preparing an existing virtual network](sql-database-managed-instance-configure-vnet-subnet.md).
 


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

> [!IMPORTANT]
> Because deploying an instance pool is a long running operation, you need to wait until it completes before running any of the following steps in this article.

## Create a managed instance inside the pool 

After the successful deployment of the instance pool, it's time to create an instance inside it. 

To create a managed instance execute the following command:

```powershell
$instanceOne = $instancePool | New-AzSqlInstance -Name "mi-pool-name" -VCore 2 -StorageSizeInGB 256
```

Deploying instance inside the pool is an operation that takes a couple of minutes. After the first instance has been created, we can create the second one:

```powershell
$instanceTwo = $instancePool | New-AzSqlInstance -Name "mi-pool-name" -VCore 4 -StorageSizeInGB 512
```

## Create a database inside an instance 

To create and manage databases in a managed instance that's inside a pool, use the single instance commands.

To create a database inside a managed instance:

```powershell
$poolinstancedb = New-AzSqlInstanceDatabase -Name "mipooldb1" -InstanceName "poolmi-001" -ResourceGroupName "myResourceGroup"
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


## Scale a managed instance inside a pool 


After populating a managed instance with databases, you may hit instance limits regarding storage or performance. In that case, if pool usage has not been exceeded, you can scale your instance. 
Scaling a managed instance inside a pool is an operation that takes a couple of minutes. The prerequisite for scaling is available vCores and storage on the instance pool level. 

To update the number of vCores and storage size:

```powershell
$instanceOne | Set-AzSqlInstance -VCore 8 -StorageSizeInGB 512 -InstancePoolName "mi-pool-name"
```


To update storage size only:

```powershell
$instance | Set-AzSqlInstance -StorageSizeInGB 1024 -InstancePoolName "mi-pool-name"
```





## Connect to managed instance placed inside the pool

Two steps are required for achieving this:

1. Enable the public endpoint for the instance.
2. Add an inbound rule to the network security group (NSG).

After both steps are complete, you can connect to the instance by using a public endpoint address, port, and credentials provided during instance creation. 

## Enable the public endpoint for the instance

Enabling public endpoint for instance can be done through the Azure portal or by using the following PowerShell command:


```powershell
$instanceOne | Set-AzSqlInstance -PublicDataEndpointEnabled true
```

This parameter can be set during instance creation as well.

## Add an inbound rule to the network security group 
 
This step can be done through portal or using PowerShell commands and can be done any time after the subnet is prepared for managed instance.

For details, see [Allow public endpoint traffic on the network security group](sql-database-managed-instance-public-endpoint-configure.md#allow-public-endpoint-traffic-on-the-network-security-group).


## Move an existing single instance inside the instance pool 
 
Moving instances to and from the pool is one of the public preview limitations. Workaround that can be used relies on point-in-time restore of databases from instance outside the pool to the instance created in the pool.

Note: This is process with downtime period. 

To move existing databases:

1. Pause workloads on the managed instance you are migrating from.
2. Script system databases and execute them on the instance that's inside the instance pool.
3. Do a point-in-time restore of each database from the single instance to the instance in the pool.

  $resourceGroupName = "my resource group name" 
  $managedInstanceName = "my managed instance name" 
  $databaseName = "my source database name" 
  $pointInTime = "2019-08-21T08:51:39.3882806Z" 
  $targetDatabase = "name of the new database that will be created" 
  $targetResourceGroupName "resource group of instance pool" 
  $targetInstanceName = "pool instance name" 
   
  Restore-AzSqlInstanceDatabase -FromPointInTimeBackup ` 
    -ResourceGroupName $resourceGroupName ` 
    -InstanceName $managedInstanceName ` 
    -Name $databaseName ` 
    -PointInTime $pointInTime ` 
    -TargetInstanceDatabaseName $targetDatabase ` 
    -TargetResourceGroupName $targetResourceGroupName ` 
    -TargetInstanceName $targetInstanceName 

  Both instances must be in the same subscription and region. Cross-region and cross-subscription restores are still not supported.

4. Point your application to the new instance and resume workloads.

If there are multiple databases, repeat process for each of them 


## Next steps

- For a features and comparison list, see [SQL common features](sql-database-features.md).
- For more information about VNet configuration, see [managed instance VNet configuration](sql-database-managed-instance-connectivity-architecture.md).
- For a quickstart that creates a managed instance and restores a database from a backup file, see [create a managed instance](sql-database-managed-instance-get-started.md).
- For a tutorial using the Azure Database Migration Service (DMS) for migration, see [managed instance migration using DMS](../dms/tutorial-sql-server-to-managed-instance.md).
- For advanced monitoring of managed instance database performance with built-in troubleshooting intelligence, see [Monitor Azure SQL Database using Azure SQL Analytics](../azure-monitor/insights/azure-sql.md).
- For pricing information, see [SQL Database managed instance pricing](https://azure.microsoft.com/pricing/details/sql-database/managed/).
