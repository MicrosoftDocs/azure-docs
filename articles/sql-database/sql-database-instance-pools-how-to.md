---
title: Deploy a SQL Managed Instance to an instance pool
titleSuffix: Azure SQL Managed Instance
description: This article describes how to create and manage Azure SQL Managed Instance pools (preview).
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: bonova
ms.author: bonova
ms.reviewer: sstein, carlrab
ms.date: 09/05/2019
---
# Deploy an Azure SQL Managed Instance to an instance pool

This article provides details on how to create an [instance pools](sql-database-instance-pools.md) and deploy an Azure SQL Managed Instance to it. 

## Instance pool operations

The following table shows the available operations related to instance pools and their availability in the Azure portal and PowerShell.

|Command|Azure portal|PowerShell|
|:---|:---|:---|
|Create instance pool|No|Yes|
|Update instance pool (limited number of properties)|No |Yes |
|Check instance pool usage and properties|No|Yes |
|Delete instance pool|No|Yes|
|Create SQL Managed Instance inside instance pool|No|Yes|
|Update SQL Managed Instance resource usage|Yes |Yes|
|Check SQL Managed Instance usage and properties|Yes|Yes|
|Delete SQL Managed Instance from the pool|Yes|Yes|
|Create a database in instance within the pool|Yes|Yes|
|Delete a database from SQL Managed Instance|Yes|Yes|

Available [PowerShell commands](https://docs.microsoft.com/powershell/module/az.sql/)

|Cmdlet |Description |
|:---|:---|
|[New-AzSqlInstancePool](/powershell/module/az.sql/new-azsqlinstancepool/) | Creates a SQL Managed Instance pool. |
|[Get-AzSqlInstancePool](/powershell/module/az.sql/get-azsqlinstancepool/) | Returns information about instance pool. |
|[Set-AzSqlInstancePool](/powershell/module/az.sql/set-azsqlinstancepool/) | Sets properties for an SQL Managed Instance pool. |
|[Remove-AzSqlInstancePool](/powershell/module/az.sql/remove-azsqlinstancepool/) | Removes an SQL Managed instance pool. |
|[Get-AzSqlInstancePoolUsage](/powershell/module/az.sql/get-azsqlinstancepoolusage/) | Returns information about SQL Managed Instance pool usage. |


To use PowerShell, [install the latest version of PowerShell Core](https://docs.microsoft.com/powershell/scripting/install/installing-powershell#powershell), and follow instructions to [Install the Azure PowerShell module](https://docs.microsoft.com/powershell/azure/install-az-ps).

For operations related to instances both inside pools and single instances, use the standard [managed instance commands](sql-database-managed-instance-create-manage.md#powershell-create-and-manage-managed-instances), but the *instance pool name* property must be populated when using these commands for an instance in a pool.

## Deployment process

To deploy a SQL Managed Instance into an instance pool, you must first deploy the instance pool, which is a one-time long-running operation where the duration is the same as deploying a [single instance created in an empty subnet](sql-database-managed-instance.md#management-operations). After that, you can deploy SQL Managed Instances into the pool, which is a relatively fast operation that typically takes up to five minutes. The instance pool parameter must be explicitly specified as part of this operation.

In public preview, both actions are only supported using PowerShell and Resource Manager templates. The Azure portal experience is not currently available.

After the SQL Managed Instance is deployed to a pool, you *can* use the Azure portal to change its properties on the pricing tier page.

## Create virtual network with a subnet 

To place multiple instance pools inside the same virtual network, see the following articles:

- [Determine VNet subnet size for an Azure SQL Managed Instance](sql-database-managed-instance-determine-size-vnet-subnet.md).
- Create new virtual network and subnet using the [Azure portal template](sql-database-managed-instance-create-vnet-subnet.md) or follow the instructions for [preparing an existing virtual network](sql-database-managed-instance-configure-vnet-subnet.md).
 

## Create instance pool 

After completing the previous steps, you are ready to create an instance pool.

The following restrictions apply to instance pools:

- Only General Purpose and Gen5 are available in public preview.
- Pool name can contain only lowercase, numbers and hyphen, and can't start with a hyphen.
- If you want to use AHB (Azure Hybrid Benefit), it is applied at the instance pool level. You can set the license type during pool creation or update it anytime after creation.

> [!IMPORTANT]
> Deploying an instance pool is a long running operation that takes approximately 4.5 hours.

To get network parameters:

```powershell
$virtualNetwork = Get-AzVirtualNetwork -Name "miPoolVirtualNetwork" -ResourceGroupName "myResourceGroup"
$subnet = Get-AzVirtualNetworkSubnetConfig -Name "miPoolSubnet" -VirtualNetwork $virtualNetwork
```

To create an instance pool:

```powershell
$instancePool = New-AzSqlInstancePool `
  -ResourceGroupName "myResourceGroup" `
  -Name "mi-pool-name" `
  -SubnetId $subnet.Id `
  -LicenseType "LicenseIncluded" `
  -VCore 80 `
  -Edition "GeneralPurpose" `
  -ComputeGeneration "Gen5" `
  -Location "westeurope"
```

> [!IMPORTANT]
> Because deploying an instance pool is a long running operation, you need to wait until it completes before running any of the following steps in this article.

## Create SQL Managed Instance

After the successful deployment of the instance pool, it's time to create a SQL Managed Instance inside it.

To create a SQL Managed Instance, execute the following command:

```powershell
$instanceOne = $instancePool | New-AzSqlInstance -Name "mi-pool-name" -VCore 2 -StorageSizeInGB 256
```

Deploying an instance inside a pool takes a couple of minutes. After the first instance has been created, additional instances can be created:

```powershell
$instanceTwo = $instancePool | New-AzSqlInstance -Name "mi-pool-name" -VCore 4 -StorageSizeInGB 512
```

## Create a database 

To create and manage databases in a SQL Managed Instance that's inside a pool, use the single instance commands.

To create a database inside a SQL Managed Instance:

```powershell
$poolinstancedb = New-AzSqlInstanceDatabase -Name "mipooldb1" -InstanceName "poolmi-001" -ResourceGroupName "myResourceGroup"
```


## Get pool usage 
 
To get a list of instances inside a pool:

```powershell
$instancePool | Get-AzSqlInstance
```


To get pool resource usage:

```powershell
$instancePool | Get-AzSqlInstancePoolUsage
```


To get detailed usage overview of the pool and instances inside it:

```powershell
$instancePool | Get-AzSqlInstancePoolUsage –ExpandChildren
```

To list the databases in an instance:

```powershell
$databases = Get-AzSqlInstanceDatabase -InstanceName "pool-mi-001" -ResourceGroupName "resource-group-name"
```


> [!NOTE]
> There is a limit of 100 databases per pool (not per instance).


## Scale 


After populating a SQL Managed Instance with databases, you may hit instance limits regarding storage or performance. In that case, if pool usage has not been exceeded, you can scale your instance.
Scaling a SQL Managed Instance inside a pool is an operation that takes a couple of minutes. The prerequisite for scaling is available vCores and storage on the instance pool level.

To update the number of vCores and storage size:

```powershell
$instanceOne | Set-AzSqlInstance -VCore 8 -StorageSizeInGB 512 -InstancePoolName "mi-pool-name"
```


To update storage size only:

```powershell
$instance | Set-AzSqlInstance -StorageSizeInGB 1024 -InstancePoolName "mi-pool-name"
```

## Connect 

To connect to a SQL Managed Instance in a pool, the following two steps are required:

1. [Enable the public endpoint for the instance](#enable-public-endpoint).
2. [Add an inbound rule to the network security group (NSG)](#add-an-inbound-rule-to-the-network-security-group).

After both steps are complete, you can connect to the instance by using a public endpoint address, port, and credentials provided during instance creation. 

### Enable public endpoint

Enabling the public endpoint for an instance can be done through the Azure portal or by using the following PowerShell command:


```powershell
$instanceOne | Set-AzSqlInstance -InstancePoolName "pool-mi-001" -PublicDataEndpointEnabled $true
```

This parameter can be set during instance creation as well.

### Add an inbound rule to the network security group 

This step can be done through the Azure portal or using PowerShell commands, and can be done anytime after the subnet is prepared for the managed instance.

For details, see [Allow public endpoint traffic on the network security group](sql-database-managed-instance-public-endpoint-configure.md#allow-public-endpoint-traffic-on-the-network-security-group).


## Move existing single instance to pool
 
Moving instances in and out of a pool is one of the public preview limitations. A workaround relies on point-in-time restore of databases from an instance outside a pool to an instance that's already in a pool. 

Both instances must be in the same subscription and region. Cross-region and cross-subscription restore is not currently supported.

This process does have a period of downtime.

To move existing databases:

1. Pause workloads on the SQL Managed Instance you are migrating from.
2. Generate scripts to create system databases and execute them on the instance that's inside the instance pool.
3. Do a point-in-time restore of each database from the single instance to the instance in the pool.

    ```powershell
    $resourceGroupName = "my resource group name"
    $managedInstanceName = "my managed instance name"
    $databaseName = "my source database name"
    $pointInTime = "2019-08-21T08:51:39.3882806Z"
    $targetDatabase = "name of the new database that will be created"
    $targetResourceGroupName = "resource group of instance pool"
    $targetInstanceName = "pool instance name"
       
    Restore-AzSqlInstanceDatabase -FromPointInTimeBackup `
      -ResourceGroupName $resourceGroupName `
      -InstanceName $managedInstanceName `
      -Name $databaseName `
      -PointInTime $pointInTime `
      -TargetInstanceDatabaseName $targetDatabase `
      -TargetResourceGroupName $targetResourceGroupName `
      -TargetInstanceName $targetInstanceName
    ```

4. Point your application to the new instance and resume it's workloads.

If there are multiple databases, repeat the process for each database.


## Next steps

- For a features and comparison list, see [SQL common features](sql-database-features.md).
- For more information about VNet configuration, see [SQL Managed Instance VNet configuration](sql-database-managed-instance-connectivity-architecture.md).
- For a quickstart that creates a managed instance and restores a database from a backup file, see [create a SQL Managed Instance](sql-database-managed-instance-get-started.md).
- For a tutorial using the Azure Database Migration Service (DMS) for migration, see [SQL Managed Instance migration using DMS](../dms/tutorial-sql-server-to-managed-instance.md).
- For advanced monitoring of SQL Managed Instance database performance with built-in troubleshooting intelligence, see [Monitor Azure SQL Managed Instance using Azure SQL Analytics](../azure-monitor/insights/azure-sql.md).
- For pricing information, see [SQL Managed Instance pricing](https://azure.microsoft.com/pricing/details/sql-database/managed/).
