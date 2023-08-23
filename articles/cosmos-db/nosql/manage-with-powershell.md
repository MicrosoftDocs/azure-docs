---
title: Manage Azure Cosmos DB for NoSQL resources using using PowerShell
description: Manage Azure Cosmos DB for NoSQL resources using using PowerShell. 
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 02/18/2022
ms.author: sidandrews
ms.reviewer: mjbrown
ms.custom: seodec18, devx-track-azurepowershell
---

# Manage Azure Cosmos DB for NoSQL resources using PowerShell
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

The following guide describes how to use PowerShell to script and automate management of Azure Cosmos DB for NoSQL resources, including the Azure Cosmos DB account, database, container, and throughput. For PowerShell cmdlets for other APIs see [PowerShell Samples for Cassandra](../cassandra/powershell-samples.md), [PowerShell Samples for API for MongoDB](../mongodb/powershell-samples.md), [PowerShell Samples for Gremlin](../graph/powershell-samples.md), [PowerShell Samples for Table](../table/powershell-samples.md)

> [!NOTE]
> Samples in this article use [Az.CosmosDB](/powershell/module/az.cosmosdb) management cmdlets. See the [Az.CosmosDB](/powershell/module/az.cosmosdb) API reference page for the latest changes.

For cross-platform management of Azure Cosmos DB, you can use the `Az` and `Az.CosmosDB` cmdlets with [cross-platform PowerShell](/powershell/scripting/install/installing-powershell), as well as the [Azure CLI](manage-with-cli.md), the [REST API][rp-rest-api], or the [Azure portal](quickstart-dotnet.md#create-account).

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Getting Started

Follow the instructions in [How to install and configure Azure PowerShell][powershell-install-configure] to install and sign in to your Azure account in PowerShell.

> [!IMPORTANT]
> Azure Cosmos DB resources cannot be renamed as this violates how Azure Resource Manager works with resource URIs.

## Azure Cosmos DB accounts

The following sections demonstrate how to manage the Azure Cosmos DB account, including:

* [Create an Azure Cosmos DB account](#create-account)
* [Update an Azure Cosmos DB account](#update-account)
* [List all Azure Cosmos DB accounts in a subscription](#list-accounts)
* [Get an Azure Cosmos DB account](#get-account)
* [Delete an Azure Cosmos DB account](#delete-account)
* [Update tags for an Azure Cosmos DB account](#update-tags)
* [List keys for an Azure Cosmos DB account](#list-keys)
* [Regenerate keys for an Azure Cosmos DB account](#regenerate-keys)
* [List connection strings for an Azure Cosmos DB account](#list-connection-strings)
* [Modify failover priority for an Azure Cosmos DB account](#modify-failover-priority)
* [Trigger a manual failover for an Azure Cosmos DB account](#trigger-manual-failover)
* [List resource locks on an Azure Cosmos DB account](#list-account-locks)

### <a id="create-account"></a> Create an Azure Cosmos DB account

This command creates an Azure Cosmos DB database account with [multiple regions][distribute-data-globally], [service-managed failover](../how-to-manage-database-account.md#automatic-failover) and bounded-staleness [consistency policy](../consistency-levels.md).

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"
$apiKind = "Sql"
$consistencyLevel = "BoundedStaleness"
$maxStalenessInterval = 300
$maxStalenessPrefix = 100000
$locations = @()
$locations += New-AzCosmosDBLocationObject -LocationName "East US" -FailoverPriority 0 -IsZoneRedundant 0
$locations += New-AzCosmosDBLocationObject -LocationName "West US" -FailoverPriority 1 -IsZoneRedundant 0

New-AzCosmosDBAccount `
    -ResourceGroupName $resourceGroupName `
    -LocationObject $locations `
    -Name $accountName `
    -ApiKind $apiKind `
    -EnableAutomaticFailover:$true `
    -DefaultConsistencyLevel $consistencyLevel `
    -MaxStalenessIntervalInSeconds $maxStalenessInterval `
    -MaxStalenessPrefix $maxStalenessPrefix
```

* `$resourceGroupName` The Azure resource group into which to deploy the Azure Cosmos DB account. It must already exist.
* `$locations` The regions for the database account, the region with `FailoverPriority 0` is the write region.
* `$accountName` The name for the Azure Cosmos DB account. Must be unique, lowercase, include only alphanumeric and '-' characters, and between 3 and 31 characters in length.
* `$apiKind` The type of Azure Cosmos DB account to create. For more information, see [APIs in Azure Cosmos DB](../introduction.md#simplified-application-development).
* `$consistencyPolicy`, `$maxStalenessInterval`, and `$maxStalenessPrefix` The default consistency level and settings of the Azure Cosmos DB account. For more information, see [Consistency Levels in Azure Cosmos DB](../consistency-levels.md).

Azure Cosmos DB accounts can be configured with IP Firewall, Virtual Network service endpoints, and private endpoints. For information on how to configure the IP Firewall for Azure Cosmos DB, see [Configure IP Firewall](../how-to-configure-firewall.md). For information on how to enable service endpoints for Azure Cosmos DB, see [Configure access from virtual Networks](../how-to-configure-vnet-service-endpoint.md). For information on how to enable private endpoints for Azure Cosmos DB, see [Configure access from private endpoints](../how-to-configure-private-endpoints.md).

### <a id="list-accounts"></a> List all Azure Cosmos DB accounts in a Resource Group

This command lists all Azure Cosmos DB accounts in a Resource Group.

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"

Get-AzCosmosDBAccount -ResourceGroupName $resourceGroupName
```

### <a id="get-account"></a> Get the properties of an Azure Cosmos DB account

This command allows you to get the properties of an existing Azure Cosmos DB account.

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"

Get-AzCosmosDBAccount -ResourceGroupName $resourceGroupName -Name $accountName
```

### <a id="update-account"></a> Update an Azure Cosmos DB account

This command allows you to update your Azure Cosmos DB database account properties. Properties that can be updated include the following:

* Adding or removing regions
* Changing default consistency policy
* Changing IP Range Filter
* Changing Virtual Network configurations
* Enabling multi-region writes

> [!NOTE]
> You cannot simultaneously add or remove regions (`locations`) and change other properties for an Azure Cosmos DB account. Modifying regions must be performed as a separate operation from any other change to the account.
> [!NOTE]
> This command allows you to add and remove regions but does not allow you to modify failover priorities or trigger a manual failover. See [Modify failover priority](#modify-failover-priority) and [Trigger manual failover](#trigger-manual-failover).
> [!TIP]
> When a new region is added, all data must be fully replicated and committed into the new region before the region is marked as available. The amount of time this operation takes will depend upon how much data is stored within the account. If an [asynchronous throughput scaling operation](../scaling-provisioned-throughput-best-practices.md#background-on-scaling-rus) is in progress, the throughput scale-up operation will be paused and will resume automatically when the add/remove region operation is complete. 

```azurepowershell-interactive
# Create account with two regions
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"
$apiKind = "Sql"
$consistencyLevel = "Session"
$enableAutomaticFailover = $true
$locations = @()
$locations += New-AzCosmosDBLocationObject -LocationName "East US" -FailoverPriority 0 -IsZoneRedundant 0
$locations += New-AzCosmosDBLocationObject -LocationName "West US" -FailoverPriority 1 -IsZoneRedundant 0

# Create the Azure Cosmos DB account
New-AzCosmosDBAccount `
    -ResourceGroupName $resourceGroupName `
    -LocationObject $locations `
    -Name $accountName `
    -ApiKind $apiKind `
    -EnableAutomaticFailover:$enableAutomaticFailover `
    -DefaultConsistencyLevel $consistencyLevel

# Add a region to the account
$locationObject2 = @()
$locationObject2 += New-AzCosmosDBLocationObject -LocationName "East US" -FailoverPriority 0 -IsZoneRedundant 0
$locationObject2 += New-AzCosmosDBLocationObject -LocationName "West US" -FailoverPriority 1 -IsZoneRedundant 0
$locationObject2 += New-AzCosmosDBLocationObject -LocationName "South Central US" -FailoverPriority 2 -IsZoneRedundant 0

Update-AzCosmosDBAccountRegion `
    -ResourceGroupName $resourceGroupName `
    -Name $accountName `
    -LocationObject $locationObject2

Write-Host "Update-AzCosmosDBAccountRegion returns before the region update is complete."
Write-Host "Check account in Azure portal or using Get-AzCosmosDBAccount for region status."
Write-Host "When region was added, press any key to continue."
$HOST.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | OUT-NULL
$HOST.UI.RawUI.Flushinputbuffer()

# Remove West US region from the account
$locationObject3 = @()
$locationObject3 += New-AzCosmosDBLocationObject -LocationName "East US" -FailoverPriority 0 -IsZoneRedundant 0
$locationObject3 += New-AzCosmosDBLocationObject -LocationName "South Central US" -FailoverPriority 1 -IsZoneRedundant 0

Update-AzCosmosDBAccountRegion `
    -ResourceGroupName $resourceGroupName `
    -Name $accountName `
    -LocationObject $locationObject3

Write-Host "Update-AzCosmosDBAccountRegion returns before the region update is complete."
Write-Host "Check account in Azure portal or using Get-AzCosmosDBAccount for region status."
```

### <a id="multi-region-writes"></a> Enable multiple write regions for an Azure Cosmos DB account

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"
$enableAutomaticFailover = $false
$enableMultiMaster = $true

# First disable service-managed failover - cannot have both service-managed
# failover and multi-region writes on an account
Update-AzCosmosDBAccount `
    -ResourceGroupName $resourceGroupName `
    -Name $accountName `
    -EnableAutomaticFailover:$enableAutomaticFailover

# Now enable multi-region writes
Update-AzCosmosDBAccount `
    -ResourceGroupName $resourceGroupName `
    -Name $accountName `
    -EnableMultipleWriteLocations:$enableMultiMaster
```

### <a id="delete-account"></a> Delete an Azure Cosmos DB account

This command deletes an existing Azure Cosmos DB account.

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"

Remove-AzCosmosDBAccount `
    -ResourceGroupName $resourceGroupName `
    -Name $accountName `
    -PassThru:$true
```

### <a id="update-tags"></a> Update Tags of an Azure Cosmos DB account

This command sets the [Azure resource tags][azure-resource-tags] for an Azure Cosmos DB account. Tags can be set both at account creation using `New-AzCosmosDBAccount` as well as on account update using `Update-AzCosmosDBAccount`.

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"
$tags = @{dept = "Finance"; environment = "Production";}

Update-AzCosmosDBAccount `
    -ResourceGroupName $resourceGroupName `
    -Name $accountName `
    -Tag $tags
```

### <a id="list-keys"></a> List Account Keys

When you create an Azure Cosmos DB account, the service generates two primary access keys that can be used for authentication when the Azure Cosmos DB account is accessed. Read-only keys for authenticating read-only operations are also generated.
By providing two access keys, Azure Cosmos DB enables you to regenerate and rotate one key at a time with no interruption to your Azure Cosmos DB account.
Azure Cosmos DB accounts have two read-write keys (primary and secondary) and two read-only keys (primary and secondary).

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"

Get-AzCosmosDBAccountKey `
    -ResourceGroupName $resourceGroupName `
    -Name $accountName `
    -Type "Keys"
```

### <a id="list-connection-strings"></a> List Connection Strings

The following command retrieves connection strings to connect apps to the Azure Cosmos DB account.

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"

Get-AzCosmosDBAccountKey `
    -ResourceGroupName $resourceGroupName `
    -Name $accountName `
    -Type "ConnectionStrings"
```

### <a id="regenerate-keys"></a> Regenerate Account Keys

Access keys to an Azure Cosmos DB account should be periodically regenerated to help keep connections secure. A primary and secondary access keys are assigned to the account. This allows clients to maintain access while one key at a time is regenerated.
There are four types of keys for an Azure Cosmos DB account (Primary, Secondary, PrimaryReadonly, and SecondaryReadonly)

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup" # Resource Group must already exist
$accountName = "mycosmosaccount" # Must be all lower case
$keyKind = "primary" # Other key kinds: secondary, primaryReadonly, secondaryReadonly

New-AzCosmosDBAccountKey `
    -ResourceGroupName $resourceGroupName `
    -Name $accountName `
    -KeyKind $keyKind
```

### <a id="enable-automatic-failover"></a> Enable service-managed failover

The following command sets an Azure Cosmos DB account to perform a service-managed fail over to its secondary region should the primary region become unavailable.

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"
$enableAutomaticFailover = $true
$enableMultiMaster = $false

# First disable multi-region writes - cannot have both automatic
# failover and multi-region writes on an account
Update-AzCosmosDBAccount `
    -ResourceGroupName $resourceGroupName `
    -Name $accountName `
    -EnableMultipleWriteLocations:$enableMultiMaster

# Now enable service-managed failover
Update-AzCosmosDBAccount `
    -ResourceGroupName $resourceGroupName `
    -Name $accountName `
    -EnableAutomaticFailover:$enableAutomaticFailover
```

### <a id="modify-failover-priority"></a> Modify Failover Priority

For accounts configured with Service-Managed Failover, you can change the order in which Azure Cosmos DB will promote secondary replicas to primary should the primary become unavailable.

For the example below, assume the current failover priority is `West US = 0`, `East US = 1`, `South Central US = 2`. The command will change this to `West US = 0`, `South Central US = 1`, `East US = 2`.

> [!CAUTION]
> Changing the location for `failoverPriority=0` will trigger a manual failover for an Azure Cosmos DB account. Any other priority changes will not trigger a failover.

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"
$locations = @("West US", "South Central US", "East US") # Regions ordered by UPDATED failover priority

Update-AzCosmosDBAccountFailoverPriority `
    -ResourceGroupName $resourceGroupName `
    -Name $accountName `
    -FailoverPolicy $locations
```

### <a id="trigger-manual-failover"></a> Trigger Manual Failover

For accounts configured with Manual Failover, you can fail over and promote any secondary replica to primary by modifying to `failoverPriority=0`. This operation can be used to initiate a disaster recovery drill to test disaster recovery planning.

For the example below, assume the account has a current failover priority of `West US = 0` and `East US = 1` and flip the regions.

> [!CAUTION]
> Changing `locationName` for `failoverPriority=0` will trigger a manual failover for an Azure Cosmos DB account. Any other priority change will not trigger a failover.

> [!NOTE]
> If you perform a manual failover operation while an [asynchronous throughput scaling operation](../scaling-provisioned-throughput-best-practices.md#background-on-scaling-rus) is in progress, the throughput scale-up operation will be paused. It will resume automatically when the failover operation is complete.

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"
$locations = @("East US", "West US") # Regions ordered by UPDATED failover priority

Update-AzCosmosDBAccountFailoverPriority `
    -ResourceGroupName $resourceGroupName `
    -Name $accountName `
    -FailoverPolicy $locations
```

### <a id="list-account-locks"></a> List resource locks on an Azure Cosmos DB account

Resource locks can be placed on Azure Cosmos DB resources including databases and collections. The example below shows how to list all Azure resource locks on an Azure Cosmos DB account.

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$resourceTypeAccount = "Microsoft.DocumentDB/databaseAccounts"
$accountName = "mycosmosaccount"

Get-AzResourceLock `
    -ResourceGroupName $resourceGroupName `
    -ResourceType $resourceTypeAccount `
    -ResourceName $accountName
```

## Azure Cosmos DB Database

The following sections demonstrate how to manage the Azure Cosmos DB database, including:

* [Create an Azure Cosmos DB database](#create-db)
* [Create an Azure Cosmos DB database with shared throughput](#create-db-ru)
* [Get the throughput of an Azure Cosmos DB database](#get-db-ru)
* [Migrate database throughput to autoscale](#migrate-db-ru)
* [List all Azure Cosmos DB databases in an account](#list-db)
* [Get a single Azure Cosmos DB database](#get-db)
* [Delete an Azure Cosmos DB database](#delete-db)
* [Create a resource lock on an Azure Cosmos DB database to prevent delete](#create-db-lock)
* [Remove a resource lock on an Azure Cosmos DB database](#remove-db-lock)

### <a id="create-db"></a>Create an Azure Cosmos DB database

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"
$databaseName = "myDatabase"

New-AzCosmosDBSqlDatabase `
    -ResourceGroupName $resourceGroupName `
    -AccountName $accountName `
    -Name $databaseName
```

### <a id="create-db-ru"></a>Create an Azure Cosmos DB database with shared throughput

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"
$databaseName = "myDatabase"
$databaseRUs = 400

New-AzCosmosDBSqlDatabase `
    -ResourceGroupName $resourceGroupName `
    -AccountName $accountName `
    -Name $databaseName `
    -Throughput $databaseRUs
```

### <a id="get-db-ru"></a>Get the throughput of an Azure Cosmos DB database

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"
$databaseName = "myDatabase"

Get-AzCosmosDBSqlDatabaseThroughput `
    -ResourceGroupName $resourceGroupName `
    -AccountName $accountName `
    -Name $databaseName
```

## <a id="migrate-db-ru"></a>Migrate database throughput to autoscale

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"
$databaseName = "myDatabase"

Invoke-AzCosmosDBSqlDatabaseThroughputMigration `
    -ResourceGroupName $resourceGroupName `
    -AccountName $accountName `
    -Name $databaseName `
    -ThroughputType Autoscale
```

### <a id="list-db"></a>Get all Azure Cosmos DB databases in an account

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"

Get-AzCosmosDBSqlDatabase `
    -ResourceGroupName $resourceGroupName `
    -AccountName $accountName
```

### <a id="get-db"></a>Get a single Azure Cosmos DB database

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"
$databaseName = "myDatabase"

Get-AzCosmosDBSqlDatabase `
    -ResourceGroupName $resourceGroupName `
    -AccountName $accountName `
    -Name $databaseName
```

### <a id="delete-db"></a>Delete an Azure Cosmos DB database

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"
$databaseName = "myDatabase"

Remove-AzCosmosDBSqlDatabase `
    -ResourceGroupName $resourceGroupName `
    -AccountName $accountName `
    -Name $databaseName
```

### <a id="create-db-lock"></a>Create a resource lock on an Azure Cosmos DB database to prevent delete

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$resourceType = "Microsoft.DocumentDB/databaseAccounts/sqlDatabases"
$accountName = "mycosmosaccount"
$databaseName = "myDatabase"
$resourceName = "$accountName/$databaseName"
$lockName = "myResourceLock"
$lockLevel = "CanNotDelete"

New-AzResourceLock `
    -ResourceGroupName $resourceGroupName `
    -ResourceType $resourceType `
    -ResourceName $resourceName `
    -LockName $lockName `
    -LockLevel $lockLevel
```

### <a id="remove-db-lock"></a>Remove a resource lock on an Azure Cosmos DB database

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$resourceType = "Microsoft.DocumentDB/databaseAccounts/sqlDatabases"
$accountName = "mycosmosaccount"
$databaseName = "myDatabase"
$resourceName = "$accountName/$databaseName"
$lockName = "myResourceLock"

Remove-AzResourceLock `
    -ResourceGroupName $resourceGroupName `
    -ResourceType $resourceType `
    -ResourceName $resourceName `
    -LockName $lockName
```

## Azure Cosmos DB Container

The following sections demonstrate how to manage the Azure Cosmos DB container, including:

* [Create an Azure Cosmos DB container](#create-container)
* [Create an Azure Cosmos DB container with autoscale](#create-container-autoscale)
* [Create an Azure Cosmos DB container with a large partition key](#create-container-big-pk)
* [Get the throughput of an Azure Cosmos DB container](#get-container-ru)
* [Migrate container throughput to autoscale](#migrate-container-ru)
* [Create an Azure Cosmos DB container with custom indexing](#create-container-custom-index)
* [Create an Azure Cosmos DB container with indexing turned off](#create-container-no-index)
* [Create an Azure Cosmos DB container with unique key and TTL](#create-container-unique-key-ttl)
* [Create an Azure Cosmos DB container with conflict resolution](#create-container-lww)
* [List all Azure Cosmos DB containers in a database](#list-containers)
* [Get a single Azure Cosmos DB container in a database](#get-container)
* [Delete an Azure Cosmos DB container](#delete-container)
* [Create a resource lock on an Azure Cosmos DB container to prevent delete](#create-container-lock)
* [Remove a resource lock on an Azure Cosmos DB container](#remove-container-lock)

### <a id="create-container"></a>Create an Azure Cosmos DB container

```azurepowershell-interactive
# Create an Azure Cosmos DB container with default indexes and throughput at 400 RU
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"
$databaseName = "myDatabase"
$containerName = "myContainer"
$partitionKeyPath = "/myPartitionKey"
$throughput = 400 #minimum = 400

New-AzCosmosDBSqlContainer `
    -ResourceGroupName $resourceGroupName `
    -AccountName $accountName `
    -DatabaseName $databaseName `
    -Name $containerName `
    -PartitionKeyKind Hash `
    -PartitionKeyPath $partitionKeyPath `
    -Throughput $throughput
```

### <a id="create-container-autoscale"></a>Create an Azure Cosmos DB container with autoscale

```azurepowershell-interactive
# Create an Azure Cosmos DB container with default indexes and autoscale throughput at 4000 RU
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"
$databaseName = "myDatabase"
$containerName = "myContainer"
$partitionKeyPath = "/myPartitionKey"
$autoscaleMaxThroughput = 4000 #minimum = 4000

New-AzCosmosDBSqlContainer `
    -ResourceGroupName $resourceGroupName `
    -AccountName $accountName `
    -DatabaseName $databaseName `
    -Name $containerName `
    -PartitionKeyKind Hash `
    -PartitionKeyPath $partitionKeyPath `
    -AutoscaleMaxThroughput $autoscaleMaxThroughput
```

### <a id="create-container-big-pk"></a>Create an Azure Cosmos DB container with a large partition key size

```azurepowershell-interactive
# Create an Azure Cosmos DB container with a large partition key value (version = 2)
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"
$databaseName = "myDatabase"
$containerName = "myContainer"
$partitionKeyPath = "/myPartitionKey"

New-AzCosmosDBSqlContainer `
    -ResourceGroupName $resourceGroupName `
    -AccountName $accountName `
    -DatabaseName $databaseName `
    -Name $containerName `
    -PartitionKeyKind Hash `
    -PartitionKeyPath $partitionKeyPath `
    -PartitionKeyVersion 2
```

### <a id="get-container-ru"></a>Get the throughput of an Azure Cosmos DB container

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"
$databaseName = "myDatabase"
$containerName = "myContainer"

Get-AzCosmosDBSqlContainerThroughput `
    -ResourceGroupName $resourceGroupName `
    -AccountName $accountName `
    -DatabaseName $databaseName `
    -Name $containerName
```

### <a id="migrate-container-ru"></a>Migrate container throughput to autoscale

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"
$databaseName = "myDatabase"
$containerName = "myContainer"

Invoke-AzCosmosDBSqlContainerThroughputMigration `
    -ResourceGroupName $resourceGroupName `
    -AccountName $accountName `
    -DatabaseName $databaseName `
    -Name $containerName `
    -ThroughputType Autoscale
```

### <a id="create-container-custom-index"></a>Create an Azure Cosmos DB container with custom index policy

```azurepowershell-interactive
# Create a container with a custom indexing policy
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"
$databaseName = "myDatabase"
$containerName = "myContainer"
$partitionKeyPath = "/myPartitionKey"
$indexPathIncluded = "/*"
$indexPathExcluded = "/myExcludedPath/*"

$includedPathIndex = New-AzCosmosDBSqlIncludedPathIndex -DataType String -Kind Range
$includedPath = New-AzCosmosDBSqlIncludedPath -Path $indexPathIncluded -Index $includedPathIndex

$indexingPolicy = New-AzCosmosDBSqlIndexingPolicy `
    -IncludedPath $includedPath `
    -ExcludedPath $indexPathExcluded `
    -IndexingMode Consistent `
    -Automatic $true

New-AzCosmosDBSqlContainer `
    -ResourceGroupName $resourceGroupName `
    -AccountName $accountName `
    -DatabaseName $databaseName `
    -Name $containerName `
    -PartitionKeyKind Hash `
    -PartitionKeyPath $partitionKeyPath `
    -IndexingPolicy $indexingPolicy
```

### <a id="create-container-no-index"></a>Create an Azure Cosmos DB container with indexing turned off

```azurepowershell-interactive
# Create an Azure Cosmos DB container with no indexing
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"
$databaseName = "myDatabase"
$containerName = "myContainer"
$partitionKeyPath = "/myPartitionKey"

$indexingPolicy = New-AzCosmosDBSqlIndexingPolicy `
    -IndexingMode None

New-AzCosmosDBSqlContainer `
    -ResourceGroupName $resourceGroupName `
    -AccountName $accountName `
    -DatabaseName $databaseName `
    -Name $containerName `
    -PartitionKeyKind Hash `
    -PartitionKeyPath $partitionKeyPath `
    -IndexingPolicy $indexingPolicy
```

### <a id="create-container-unique-key-ttl"></a>Create an Azure Cosmos DB container with unique key policy and TTL

```azurepowershell-interactive
# Create a container with a unique key policy and TTL of one day
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"
$databaseName = "myDatabase"
$containerName = "myContainer"
$partitionKeyPath = "/myPartitionKey"
$uniqueKeyPath = "/myUniqueKeyPath"
$ttlInSeconds = 86400 # Set this to -1 (or don't use it at all) to never expire

$uniqueKey = New-AzCosmosDBSqlUniqueKey `
    -Path $uniqueKeyPath

$uniqueKeyPolicy = New-AzCosmosDBSqlUniqueKeyPolicy `
    -UniqueKey $uniqueKey

New-AzCosmosDBSqlContainer `
    -ResourceGroupName $resourceGroupName `
    -AccountName $accountName `
    -DatabaseName $databaseName `
    -Name $containerName `
    -PartitionKeyKind Hash `
    -PartitionKeyPath $partitionKeyPath `
    -UniqueKeyPolicy $uniqueKeyPolicy `
    -TtlInSeconds $ttlInSeconds
```

### <a id="create-container-lww"></a>Create an Azure Cosmos DB container with conflict resolution

To write all conflicts to the ConflictsFeed and handle separately, pass `-Type "Custom" -Path ""`.

```azurepowershell-interactive
# Create container with last-writer-wins conflict resolution policy
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"
$databaseName = "myDatabase"
$containerName = "myContainer"
$partitionKeyPath = "/myPartitionKey"
$conflictResolutionPath = "/myResolutionPath"

$conflictResolutionPolicy = New-AzCosmosDBSqlConflictResolutionPolicy `
    -Type LastWriterWins `
    -Path $conflictResolutionPath

New-AzCosmosDBSqlContainer `
    -ResourceGroupName $resourceGroupName `
    -AccountName $accountName `
    -DatabaseName $databaseName `
    -Name $containerName `
    -PartitionKeyKind Hash `
    -PartitionKeyPath $partitionKeyPath `
    -ConflictResolutionPolicy $conflictResolutionPolicy
```

To create a conflict resolution policy to use a stored procedure, call `New-AzCosmosDBSqlConflictResolutionPolicy` and pass parameters `-Type` and `-ConflictResolutionProcedure`.

```azurepowershell-interactive
# Create container with custom conflict resolution policy using a stored procedure
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"
$databaseName = "myDatabase"
$containerName = "myContainer"
$partitionKeyPath = "/myPartitionKey"
$conflictResolutionSprocName = "mysproc"

$conflictResolutionSproc = "/dbs/$databaseName/colls/$containerName/sprocs/$conflictResolutionSprocName"

$conflictResolutionPolicy = New-AzCosmosDBSqlConflictResolutionPolicy `
    -Type Custom `
    -ConflictResolutionProcedure $conflictResolutionSproc

New-AzCosmosDBSqlContainer `
    -ResourceGroupName $resourceGroupName `
    -AccountName $accountName `
    -DatabaseName $databaseName `
    -Name $containerName `
    -PartitionKeyKind Hash `
    -PartitionKeyPath $partitionKeyPath `
    -ConflictResolutionPolicy $conflictResolutionPolicy
```


### <a id="list-containers"></a>List all Azure Cosmos DB containers in a database

```azurepowershell-interactive
# List all Azure Cosmos DB containers in a database
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"
$databaseName = "myDatabase"

Get-AzCosmosDBSqlContainer `
    -ResourceGroupName $resourceGroupName `
    -AccountName $accountName `
    -DatabaseName $databaseName
```

### <a id="get-container"></a>Get a single Azure Cosmos DB container in a database

```azurepowershell-interactive
# Get a single Azure Cosmos DB container in a database
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"
$databaseName = "myDatabase"
$containerName = "myContainer"

Get-AzCosmosDBSqlContainer `
    -ResourceGroupName $resourceGroupName `
    -AccountName $accountName `
    -DatabaseName $databaseName `
    -Name $containerName
```

### <a id="delete-container"></a>Delete an Azure Cosmos DB container

```azurepowershell-interactive
# Delete an Azure Cosmos DB container
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"
$databaseName = "myDatabase"
$containerName = "myContainer"

Remove-AzCosmosDBSqlContainer `
    -ResourceGroupName $resourceGroupName `
    -AccountName $accountName `
    -DatabaseName $databaseName `
    -Name $containerName
```
### <a id="create-container-lock"></a>Create a resource lock on an Azure Cosmos DB container to prevent delete

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$resourceType = "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers"
$accountName = "mycosmosaccount"
$databaseName = "myDatabase"
$containerName = "myContainer"
$resourceName = "$accountName/$databaseName/$containerName"
$lockName = "myResourceLock"
$lockLevel = "CanNotDelete"

New-AzResourceLock `
    -ResourceGroupName $resourceGroupName `
    -ResourceType $resourceType `
    -ResourceName $resourceName `
    -LockName $lockName `
    -LockLevel $lockLevel
```

### <a id="remove-container-lock"></a>Remove a resource lock on an Azure Cosmos DB container

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$resourceType = "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers"
$accountName = "mycosmosaccount"
$databaseName = "myDatabase"
$containerName = "myContainer"
$resourceName = "$accountName/$databaseName/$containerName"
$lockName = "myResourceLock"

Remove-AzResourceLock `
    -ResourceGroupName $resourceGroupName `
    -ResourceType $resourceType `
    -ResourceName $resourceName `
    -LockName $lockName
```

## Next steps

* [All PowerShell Samples](powershell-samples.md)
* [How to manage Azure Cosmos DB account](../how-to-manage-database-account.md)
* [Create an Azure Cosmos DB container](how-to-create-container.md)
* [Configure time-to-live in Azure Cosmos DB](how-to-time-to-live.md)

<!--Reference style links - using these makes the source content way more readable than using inline links-->

[powershell-install-configure]: /powershell/azure/
[scaling-globally]: ../distribute-data-globally.md#EnableGlobalDistribution
[distribute-data-globally]: ../distribute-data-globally.md
[azure-resource-groups]: ../../azure-resource-manager/management/overview.md#resource-groups
[azure-resource-tags]: ../../azure-resource-manager/management/tag-resources.md
[rp-rest-api]: /rest/api/cosmos-db-resource-provider/
