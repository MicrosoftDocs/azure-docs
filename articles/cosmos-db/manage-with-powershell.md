---
title: Create and manage Azure Cosmos DB using PowerShell
description: Use Azure Powershell manage your Azure Cosmos accounts, databases, containers, and throughput. 
author: markjbrown
ms.service: cosmos-db
ms.topic: sample
ms.date: 05/13/2020
ms.author: mjbrown
ms.custom: seodec18
---

# Manage Azure Cosmos DB SQL API resources using PowerShell

The following guide describes how to use PowerShell to script and automate management of Azure Cosmos DB resources, including account, database, container, and throughput.

> [!NOTE]
> Samples in this article use [Az.CosmosDB](https://docs.microsoft.com/powershell/module/az.cosmosdb) management cmdlets. See the [Az.CosmosDB](https://docs.microsoft.com/powershell/module/az.cosmosdb) API reference page for the latest changes.

For cross-platform management of Azure Cosmos DB, you can use the `Az` and `Az.CosmosDB` cmdlets with [cross-platform Powershell](https://docs.microsoft.com/powershell/scripting/install/installing-powershell), as well as the [Azure CLI](manage-with-cli.md), the [REST API][rp-rest-api], or the [Azure portal](create-sql-api-dotnet.md#create-account).

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Getting Started

Follow the instructions in [How to install and configure Azure PowerShell][powershell-install-configure] to install and sign in to your Azure account in Powershell.

## Azure Cosmos accounts

The following sections demonstrate how to manage the Azure Cosmos account, including:

* [Create an Azure Cosmos account](#create-account)
* [Update an Azure Cosmos account](#update-account)
* [List all Azure Cosmos accounts in a subscription](#list-accounts)
* [Get an Azure Cosmos account](#get-account)
* [Delete an Azure Cosmos account](#delete-account)
* [Update tags for an Azure Cosmos account](#update-tags)
* [List keys for an Azure Cosmos account](#list-keys)
* [Regenerate keys for an Azure Cosmos account](#regenerate-keys)
* [List connection strings for an Azure Cosmos account](#list-connection-strings)
* [Modify failover priority for an Azure Cosmos account](#modify-failover-priority)
* [Trigger a manual failover for an Azure Cosmos account](#trigger-manual-failover)

### <a id="create-account"></a> Create an Azure Cosmos account

This command creates an Azure Cosmos DB database account with [multiple regions][distribute-data-globally], [automatic failover](how-to-manage-database-account.md#automatic-failover) and bounded-staleness [consistency policy](consistency-levels.md).

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$locations = @("West US 2", "East US 2")
$accountName = "mycosmosaccount"
$apiKind = "Sql"
$consistencyLevel = "BoundedStaleness"
$maxStalenessInterval = 300
$maxStalenessPrefix = 100000

New-AzCosmosDBAccount `
    -ResourceGroupName $resourceGroupName `
    -Location $locations `
    -Name $accountName `
    -ApiKind $apiKind `
    -EnableAutomaticFailover:$true `
    -DefaultConsistencyLevel $consistencyLevel `
    -MaxStalenessIntervalInSeconds $maxStalenessInterval `
    -MaxStalenessPrefix $maxStalenessPrefix
```

* `$resourceGroupName` The Azure resource group into which to deploy the Cosmos account. It must already exist.
* `$locations` The regions for the database account, starting with the write region and ordered by failover priority.
* `$accountName` The name for the Azure Cosmos account. Must be unique, lowercase, include only alphanumeric and '-' characters, and between 3 and 31 characters in length.
* `$apiKind` The type of Cosmos account to create. For more information, see [APIs in Cosmos DB](introduction.md#develop-applications-on-cosmos-db-using-popular-open-source-software-oss-apis).
* `$consistencyPolicy`, `$maxStalenessInterval`, and `$maxStalenessPrefix` The default consistency level and settings of the Azure Cosmos account. For more information, see [Consistency Levels in Azure Cosmos DB](consistency-levels.md).

Azure Cosmos accounts can be configured with IP Firewall, Virtual Network service endpoints, and private endpoints. For information on how to configure the IP Firewall for Azure Cosmos DB, see [Configure IP Firewall](how-to-configure-firewall.md). For information on how to enable service endpoints for Azure Cosmos DB, see [Configure access from virtual Networks](how-to-configure-vnet-service-endpoint.md). For information on how to enable private endpoints for Azure Cosmos DB, see [Configure access from private endpoints](how-to-configure-private-endpoints.md).

### <a id="list-accounts"></a> List all Azure Cosmos accounts in a Resource Group

This command lists all Azure Cosmos accounts in a Resource Group.

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"

Get-AzCosmosDBAccount -ResourceGroupName $resourceGroupName
```

### <a id="get-account"></a> Get the properties of an Azure Cosmos account

This command allows you to get the properties of an existing Azure Cosmos account.

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"

Get-AzCosmosDBAccount -ResourceGroupName $resourceGroupName -Name $accountName
```

### <a id="update-account"></a> Update an Azure Cosmos account

This command allows you to update your Azure Cosmos DB database account properties. Properties that can be updated include the following:

* Adding or removing regions
* Changing default consistency policy
* Changing IP Range Filter
* Changing Virtual Network configurations
* Enabling Multi-master

> [!NOTE]
> You cannot simultaneously add or remove regions (`locations`) and change other properties for an Azure Cosmos account. Modifying regions must be performed as a separate operation from any other change to the account.
> [!NOTE]
> This command allows you to add and remove regions but does not allow you to modify failover priorities or trigger a manual failover. See [Modify failover priority](#modify-failover-priority) and [Trigger manual failover](#trigger-manual-failover).

```azurepowershell-interactive
# Create account with two regions
$resourceGroupName = "myResourceGroup"
$locations = @("West US 2", "East US 2")
$accountName = "mycosmosaccount"
$apiKind = "Sql"
$consistencyLevel = "Session"
$enableAutomaticFailover = $true

# Create the Cosmos DB account
New-AzCosmosDBAccount `
    -ResourceGroupName $resourceGroupName `
    -Location $locations `
    -Name $accountName `
    -ApiKind $apiKind `
    -EnableAutomaticFailover:$enableAutomaticFailover `
    -DefaultConsistencyLevel $consistencyLevel

# Add a region to the account
$locations2 = @("West US 2", "East US 2", "South Central US")
$locationObjects2 = @()
$i = 0
ForEach ($location in $locations2) {
    $locationObjects2 += @{ locationName = "$location"; failoverPriority = $i++ }
}

Update-AzCosmosDBAccountRegion `
    -ResourceGroupName $resourceGroupName `
    -Name $accountName `
    -LocationObject $locationObjects2

Write-Host "Update-AzCosmosDBAccountRegion returns before the region update is complete."
Write-Host "Check account in Azure portal or using Get-AzCosmosDBAccount for region status."
Write-Host "When region was added, press any key to continue."
$HOST.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | OUT-NULL
$HOST.UI.RawUI.Flushinputbuffer()

# Remove a region from the account
$locations3 = @("West US 2", "South Central US")
$locationObjects3 = @()
$i = 0
ForEach ($location in $locations3) {
    $locationObjects3 += @{ locationName = "$location"; failoverPriority = $i++ }
}

Update-AzCosmosDBAccountRegion `
    -ResourceGroupName $resourceGroupName `
    -Name $accountName `
    -LocationObject $locationObjects3

Write-Host "Update-AzCosmosDBAccountRegion returns before the region update is complete."
Write-Host "Check account in Azure portal or using Get-AzCosmosDBAccount for region status."
```
### <a id="multi-master"></a> Enable multiple write regions for an Azure Cosmos account

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"
$enableAutomaticFailover = $false
$enableMultiMaster = $true

# First disable automatic failover - cannot have both automatic
# failover and multi-master on an account
Update-AzCosmosDBAccount `
    -ResourceGroupName $resourceGroupName `
    -Name $accountName `
    -EnableAutomaticFailover:$enableAutomaticFailover

# Now enable multi-master
Update-AzCosmosDBAccount `
    -ResourceGroupName $resourceGroupName `
    -Name $accountName `
    -EnableMultipleWriteLocations:$enableMultiMaster
```

### <a id="delete-account"></a> Delete an Azure Cosmos account

This command deletes an existing Azure Cosmos account.

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"

Remove-AzCosmosDBAccount `
    -ResourceGroupName $resourceGroupName `
    -Name $accountName `
    -PassThru:$true
```

### <a id="update-tags"></a> Update Tags of an Azure Cosmos account

This command sets the [Azure resource tags][azure-resource-tags] for an Azure Cosmos account. Tags can be set both at account creation using `New-AzCosmosDBAccount` as well as on account update using `Update-AzCosmosDBAccount`.

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

When you create an Azure Cosmos account, the service generates two master access keys that can be used for authentication when the Azure Cosmos account is accessed. Read-only keys for authenticating read-only operations are also generated.
By providing two access keys, Azure Cosmos DB enables you to regenerate and rotate one key at a time with no interruption to your Azure Cosmos account.
Cosmos DB accounts have two read-write keys (primary and secondary) and two read-only keys (primary and secondary).

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"

Get-AzCosmosDBAccountKey `
    -ResourceGroupName $resourceGroupName `
    -Name $accountName `
    -Type "Keys"
```

### <a id="list-connection-strings"></a> List Connection Strings

The following command retrieves connection strings to connect apps to the Cosmos DB account.

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"

Get-AzCosmosDBAccountKey `
    -ResourceGroupName $resourceGroupName `
    -Name $accountName `
    -Type "ConnectionStrings"
```

### <a id="regenerate-keys"></a> Regenerate Account Keys

Access keys to an Azure Cosmos account should be periodically regenerated to help keep connections secure. A primary and secondary access keys are assigned to the account. This allows clients to maintain access while one key at a time is regenerated.
There are four types of keys for an Azure Cosmos account (Primary, Secondary, PrimaryReadonly, and SecondaryReadonly)

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup" # Resource Group must already exist
$accountName = "mycosmosaccount" # Must be all lower case
$keyKind = "primary" # Other key kinds: secondary, primaryReadOnly, secondaryReadOnly

New-AzCosmosDBAccountKey `
    -ResourceGroupName $resourceGroupName `
    -Name $accountName `
    -KeyKind $keyKind
```

### <a id="enable-automatic-failover"></a> Enable automatic failover

The following command sets a Cosmos DB account to fail over automatically to its secondary region should the primary region become unavailable.

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"
$enableAutomaticFailover = $true
$enableMultiMaster = $false

# First disable multi-master - cannot have both automatic
# failover and multi-master on an account
Update-AzCosmosDBAccount `
    -ResourceGroupName $resourceGroupName `
    -Name $accountName `
    -EnableMultipleWriteLocations:$enableMultiMaster

# Now enable automatic failover
Update-AzCosmosDBAccount `
    -ResourceGroupName $resourceGroupName `
    -Name $accountName `
    -EnableAutomaticFailover:$enableAutomaticFailover
```

### <a id="modify-failover-priority"></a> Modify Failover Priority

For accounts configured with Automatic Failover, you can change the order in which Cosmos will promote secondary replicas to primary should the primary become unavailable.

For the example below, assume the current failover priority is `West US 2 = 0`, `East US 2 = 1`, `South Central US = 2`. The command will change this to `West US 2 = 0`, `South Central US = 1`, `East US 2 = 2`.

> [!CAUTION]
> Changing the location for `failoverPriority=0` will trigger a manual failover for an Azure Cosmos account. Any other priority changes will not trigger a failover.

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"
$locations = @("West US 2", "South Central US", "East US 2") # Regions ordered by UPDATED failover priority

Update-AzCosmosDBAccountFailoverPriority `
    -ResourceGroupName $resourceGroupName `
    -Name $accountName `
    -FailoverPolicy $locations
```

### <a id="trigger-manual-failover"></a> Trigger Manual Failover

For accounts configured with Manual Failover, you can fail over and promote any secondary replica to primary by modifying to `failoverPriority=0`. This operation can be used to initiate a disaster recovery drill to test disaster recovery planning.

For the example below, assume the account has a current failover priority of `West US 2 = 0` and `East US 2 = 1` and flip the regions.

> [!CAUTION]
> Changing `locationName` for `failoverPriority=0` will trigger a manual failover for an Azure Cosmos account. Any other priority change will not trigger a failover.

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$accountName = "mycosmosaccount"
$locations = @("East US 2", "West US 2") # Regions ordered by UPDATED failover priority

Update-AzCosmosDBAccountFailoverPriority `
    -ResourceGroupName $resourceGroupName `
    -Name $accountName `
    -FailoverPolicy $locations
```

## Azure Cosmos DB Database

The following sections demonstrate how to manage the Azure Cosmos DB database, including:

* [Create an Azure Cosmos DB database](#create-db)
* [Create an Azure Cosmos DB database with shared throughput](#create-db-ru)
* [Get the throughput of an Azure Cosmos DB database](#get-db-ru)
* [List all Azure Cosmos DB databases in an account](#list-db)
* [Get a single Azure Cosmos DB database](#get-db)
* [Delete an Azure Cosmos DB database](#delete-db)

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

## Azure Cosmos DB Container

The following sections demonstrate how to manage the Azure Cosmos DB container, including:

* [Create an Azure Cosmos DB container](#create-container)
* [Create an Azure Cosmos DB container with a large partition key](#create-container-big-pk)
* [Get the throughput of an Azure Cosmos DB container](#get-container-ru)
* [Create an Azure Cosmos DB container with custom indexing](#create-container-custom-index)
* [Create an Azure Cosmos DB container with indexing turned off](#create-container-no-index)
* [Create an Azure Cosmos DB container with unique key and TTL](#create-container-unique-key-ttl)
* [Create an Azure Cosmos DB container with conflict resolution](#create-container-lww)
* [List all Azure Cosmos DB containers in a database](#list-containers)
* [Get a single Azure Cosmos DB container in a database](#get-container)
* [Delete an Azure Cosmos DB container](#delete-container)

### <a id="create-container"></a>Create an Azure Cosmos DB container

```azurepowershell-interactive
# Create an Azure Cosmos DB container with default indexes and throughput at 400 RU
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
    -PartitionKeyPath $partitionKeyPath
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

## Next steps

* [All PowerShell Samples](powershell-samples.md)
* [How to manage Azure Cosmos account](how-to-manage-database-account.md)
* [Create an Azure Cosmos DB container](how-to-create-container.md)
* [Configure time-to-live in Azure Cosmos DB](how-to-time-to-live.md)

<!--Reference style links - using these makes the source content way more readable than using inline links-->

[powershell-install-configure]: https://docs.microsoft.com/azure/powershell-install-configure
[scaling-globally]: distribute-data-globally.md#EnableGlobalDistribution
[distribute-data-globally]: distribute-data-globally.md
[azure-resource-groups]: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview#resource-groups
[azure-resource-tags]: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags
[rp-rest-api]: https://docs.microsoft.com/rest/api/cosmos-db-resource-provider/
