---
title: Deploy SQL Managed Instance to an instance pool
titleSuffix: Azure SQL Managed Instance
description: This article describes how to create and manage Azure SQL Managed Instance pools (preview).
services: sql-database
ms.service: sql-managed-instance
ms.subservice: operations
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: bonova
ms.author: bonova
ms.reviewer: sstein, carlrab
ms.date: 09/05/2019
---
# Deploy Azure SQL Managed Instance to an instance pool
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

This article provides details on how to create an [instance pool](instance-pools-overview.md) and deploy Azure SQL Managed Instance to it. 

## Instance pool operations

The following table shows the available operations related to instance pools and their availability in the Azure portal and PowerShell.

|Command|Azure portal|PowerShell|
|:---|:---|:---|
|Create an instance pool|No|Yes|
|Update an instance pool (limited number of properties)|No |Yes |
|Check an instance pool usage and properties|No|Yes |
|Delete an instance pool|No|Yes|
|Create a managed instance inside an instance pool|No|Yes|
|Update resource usage for a managed instance|Yes |Yes|
|Check usage and properties for a managed instance|Yes|Yes|
|Delete a managed instance from the pool|Yes|Yes|
|Create a database in instance within the pool|Yes|Yes|
|Delete a database from SQL Managed Instance|Yes|Yes|

Available [PowerShell commands](https://docs.microsoft.com/powershell/module/az.sql/):

|Cmdlet |Description |
|:---|:---|
|[New-AzSqlInstancePool](/powershell/module/az.sql/new-azsqlinstancepool/) | Creates a SQL Managed Instance pool. |
|[Get-AzSqlInstancePool](/powershell/module/az.sql/get-azsqlinstancepool/) | Returns information about an instance pool. |
|[Set-AzSqlInstancePool](/powershell/module/az.sql/set-azsqlinstancepool/) | Sets properties for an instance pool in SQL Managed Instance. |
|[Remove-AzSqlInstancePool](/powershell/module/az.sql/remove-azsqlinstancepool/) | Removes an instance pool in SQL Managed Instance. |
|[Get-AzSqlInstancePoolUsage](/powershell/module/az.sql/get-azsqlinstancepoolusage/) | Returns information about SQL Managed Instance pool usage. |


To use PowerShell, [install the latest version of PowerShell Core](https://docs.microsoft.com/powershell/scripting/install/installing-powershell#powershell), and follow instructions to [Install the Azure PowerShell module](https://docs.microsoft.com/powershell/azure/install-az-ps).

For operations related to instances both inside pools and single instances, use the standard [managed instance commands](api-references-create-manage-instance.md#powershell-create-and-configure-managed-instances), but the *instance pool name* property must be populated when using these commands for an instance in a pool.

## Deployment process

To deploy a managed instance into an instance pool, you must first deploy the instance pool, which is a one-time long-running operation where the duration is the same as deploying a [single instance created in an empty subnet](sql-managed-instance-paas-overview.md#management-operations). After that, you can deploy a managed instance into the pool, which is a relatively fast operation that typically takes up to five minutes. The instance pool parameter must be explicitly specified as part of this operation.

In public preview, both actions are only supported using PowerShell and Azure Resource Manager templates. The Azure portal experience is not currently available.

After a managed instance is deployed to a pool, you *can* use the Azure portal to change its properties on the pricing tier page.

## Create a virtual network with a subnet 

To place multiple instance pools inside the same virtual network, see the following articles:

- [Determine VNet subnet size for Azure SQL Managed Instance](vnet-subnet-determine-size.md).
- Create new virtual network and subnet using the [Azure portal template](virtual-network-subnet-create-arm-template.md) or follow the instructions for [preparing an existing virtual network](vnet-existing-add-subnet.md).
 

## Create an instance pool 

After completing the previous steps, you are ready to create an instance pool.

The following restrictions apply to instance pools:

- Only General Purpose and Gen5 are available in public preview.
- The pool name can contain only lowercase letters, numbers and hyphens, and can't start with a hyphen.
- If you want to use Azure Hybrid Benefit, it is applied at the instance pool level. You can set the license type during pool creation or update it anytime after creation.

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

## Create a managed instance

After the successful deployment of the instance pool, it's time to create a managed instance inside it.

To create a managed instance, execute the following command:

```powershell
$instanceOne = $instancePool | New-AzSqlInstance -Name "mi-pool-name" -VCore 2 -StorageSizeInGB 256
```

Deploying an instance inside a pool takes a couple of minutes. After the first instance has been created, additional instances can be created:

```powershell
$instanceTwo = $instancePool | New-AzSqlInstance -Name "mi-pool-name" -VCore 4 -StorageSizeInGB 512
```

## Create a database 

To create and manage databases in a managed instance that's inside a pool, use the single instance commands.

To create a database inside a managed instance:

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

## Connect 

To connect to a managed instance in a pool, the following two steps are required:

1. [Enable the public endpoint for the instance](#enable-the-public-endpoint).
2. [Add an inbound rule to the network security group (NSG)](#add-an-inbound-rule-to-the-network-security-group).

After both steps are complete, you can connect to the instance by using a public endpoint address, port, and credentials provided during instance creation. 

### Enable the public endpoint

Enabling the public endpoint for an instance can be done through the Azure portal or by using the following PowerShell command:


```powershell
$instanceOne | Set-AzSqlInstance -InstancePoolName "pool-mi-001" -PublicDataEndpointEnabled $true
```

This parameter can be set during instance creation as well.

### Add an inbound rule to the network security group 

This step can be done through the Azure portal or using PowerShell commands, and can be done anytime after the subnet is prepared for the managed instance.

For details, see [Allow public endpoint traffic on the network security group](public-endpoint-configure.md#allow-public-endpoint-traffic-on-the-network-security-group).


## Move an existing single instance to a pool
 
Moving instances in and out of a pool is one of the public preview limitations. A workaround relies on point-in-time restore of databases from an instance outside a pool to an instance that's already in a pool. 

Both instances must be in the same subscription and region. Cross-region and cross-subscription restore is not currently supported.

This process does have a period of downtime.

To move existing databases:

1. Pause workloads on the managed instance you are migrating from.
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

4. Point your application to the new instance and resume its workloads.

If there are multiple databases, repeat the process for each database.


## Next steps

- For a features and comparison list, see [SQL common features](../database/features-comparison.md).
- For more information about VNet configuration, see [SQL Managed Instance VNet configuration](connectivity-architecture-overview.md).
- For a quickstart that creates a managed instance and restores a database from a backup file, see [Create a managed instance](instance-create-quickstart.md).
- For a tutorial about using Azure Database Migration Service for migration, see [SQL Managed Instance migration using Database Migration Service](../../dms/tutorial-sql-server-to-managed-instance.md).
- For advanced monitoring of SQL Managed Instance database performance with built-in troubleshooting intelligence, see [Monitor Azure SQL Managed Instance using Azure SQL Analytics](../../azure-monitor/insights/azure-sql.md).
- For pricing information, see [SQL Managed Instance pricing](https://azure.microsoft.com/pricing/details/sql-database/managed/).
