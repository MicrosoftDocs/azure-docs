---
title: Manage Azure Cosmos DB for NoSQL resources using Azure CLI
description: Manage Azure Cosmos DB for NoSQL resources using Azure CLI. 
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 02/18/2022
ms.author: sidandrews
ms.reviewer: mjbrown
---
# Manage Azure Cosmos DB for NoSQL resources using Azure CLI

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

The following guide describes common commands to automate management of your Azure Cosmos DB accounts, databases and containers using Azure CLI. Reference pages for all Azure Cosmos DB CLI commands are available in the [Azure CLI Reference](/cli/azure/cosmosdb). You can also find more examples in [Azure CLI samples for Azure Cosmos DB](cli-samples.md), including how to create and manage Azure Cosmos DB accounts, databases and containers for MongoDB, Gremlin, Cassandra and API for Table.

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This article requires version 2.22.1 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

For Azure CLI samples for other APIs see [CLI Samples for Cassandra](../cassandra/cli-samples.md), [CLI Samples for API for MongoDB](../mongodb/cli-samples.md), [CLI Samples for Gremlin](../graph/cli-samples.md), [CLI Samples for Table](../table/cli-samples.md)

> [!IMPORTANT]
> Azure Cosmos DB resources cannot be renamed as this violates how Azure Resource Manager works with resource URIs.

## Azure Cosmos DBAccounts

The following sections demonstrate how to manage the Azure Cosmos DB account, including:

- [Create an Azure Cosmos DB account](#create-an-azure-cosmos-db-account)
- [Add or remove regions](#add-or-remove-regions)
- [Enable multi-region writes](#enable-multiple-write-regions)
- [Set regional failover priority](#set-failover-priority)
- [Enable service-managed failover](#enable-service-managed-failover)
- [Trigger manual failover](#trigger-manual-failover)
- [List account keys](#list-account-keys)
- [List read-only account keys](#list-read-only-account-keys)
- [List connection strings](#list-connection-strings)
- [Regenerate account key](#regenerate-account-key)

### Create an Azure Cosmos DB account

Create an Azure Cosmos DB account with API for NoSQL, Session consistency in West US and East US regions:

> [!IMPORTANT]
> The Azure Cosmos DB account name must be lowercase and less than 44 characters.

```azurecli-interactive
resourceGroupName='MyResourceGroup'
accountName='mycosmosaccount' #needs to be lower case and less than 44 characters

az cosmosdb create \
    -n $accountName \
    -g $resourceGroupName \
    --default-consistency-level Session \
    --locations regionName='West US' failoverPriority=0 isZoneRedundant=False \
    --locations regionName='East US' failoverPriority=1 isZoneRedundant=False
```

### Add or remove regions

Create an Azure Cosmos DB account with two regions, add a region, and remove a region.

> [!NOTE]
> You cannot simultaneously add or remove regions `locations` and change other properties for an Azure Cosmos DB account. Modifying regions must be performed as a separate operation than any other change to the account resource.
> [!NOTE]
> This command allows you to add and remove regions but does not allow you to modify failover priorities or trigger a manual failover. See [Set failover priority](#set-failover-priority) and [Trigger manual failover](#trigger-manual-failover).
> [!TIP]
> When a new region is added, all data must be fully replicated and committed into the new region before the region is marked as available. The amount of time this operation takes will depend upon how much data is stored within the account. If an [asynchronous throughput scaling operation](../scaling-provisioned-throughput-best-practices.md#background-on-scaling-rus) is in progress, the throughput scale-up operation will be paused and will resume automatically when the add/remove region operation is complete.

```azurecli-interactive
resourceGroupName='myResourceGroup'
accountName='mycosmosaccount'

# Create an account with 2 regions
az cosmosdb create --name $accountName --resource-group $resourceGroupName \
    --locations regionName="West US" failoverPriority=0 isZoneRedundant=False \
    --locations regionName="East US" failoverPriority=1 isZoneRedundant=False

# Add a region
az cosmosdb update --name $accountName --resource-group $resourceGroupName \
    --locations regionName="West US" failoverPriority=0 isZoneRedundant=False \
    --locations regionName="East US" failoverPriority=1 isZoneRedundant=False \
    --locations regionName="South Central US" failoverPriority=2 isZoneRedundant=False

# Remove a region
az cosmosdb update --name $accountName --resource-group $resourceGroupName \
    --locations regionName="West US" failoverPriority=0 isZoneRedundant=False \
    --locations regionName="East US" failoverPriority=1 isZoneRedundant=False
```

### Enable multiple write regions

Enable multi-region writes for an Azure Cosmos DB account

```azurecli-interactive
# Update an Azure Cosmos DB account from single write region to multiple write regions
resourceGroupName='myResourceGroup'
accountName='mycosmosaccount'

# Get the account resource id for an existing account
accountId=$(az cosmosdb show -g $resourceGroupName -n $accountName --query id -o tsv)

az cosmosdb update --ids $accountId --enable-multiple-write-locations true
```

### Set failover priority

Set the failover priority for an Azure Cosmos DB account configured for service-managed failover

```azurecli-interactive
# Assume region order is initially 'West US'=0 'East US'=1 'South Central US'=2 for account
resourceGroupName='myResourceGroup'
accountName='mycosmosaccount'

# Get the account resource id for an existing account
accountId=$(az cosmosdb show -g $resourceGroupName -n $accountName --query id -o tsv)

# Make South Central US the next region to fail over to instead of East US
az cosmosdb failover-priority-change --ids $accountId \
    --failover-policies 'West US=0' 'South Central US=1' 'East US=2'
```

### Enable service-managed failover

```azurecli-interactive
# Enable service-managed failover on an existing account
resourceGroupName='myResourceGroup'
accountName='mycosmosaccount'

# Get the account resource id for an existing account
accountId=$(az cosmosdb show -g $resourceGroupName -n $accountName --query id -o tsv)

az cosmosdb update --ids $accountId --enable-automatic-failover true
```

### Trigger manual failover

> [!CAUTION]
> Changing region with priority = 0 will trigger a manual failover for an Azure Cosmos DB account. Any other priority change will not trigger a failover.

> [!NOTE]
> If you perform a manual failover operation while an [asynchronous throughput scaling operation](../scaling-provisioned-throughput-best-practices.md#background-on-scaling-rus) is in progress, the throughput scale-up operation will be paused. It will resume automatically when the failover operation is complete.

```azurecli-interactive
# Assume region order is initially 'West US=0' 'East US=1' 'South Central US=2' for account
resourceGroupName='myResourceGroup'
accountName='mycosmosaccount'

# Get the account resource id for an existing account
accountId=$(az cosmosdb show -g $resourceGroupName -n $accountName --query id -o tsv)

# Trigger a manual failover to promote East US 2 as new write region
az cosmosdb failover-priority-change --ids $accountId \
    --failover-policies 'East US=0' 'South Central US=1' 'West US=2'
```

### <a id="list-account-keys"></a> List all account keys

Get all keys for an Azure Cosmos DB account.

```azurecli-interactive
# List all account keys
resourceGroupName='MyResourceGroup'
accountName='mycosmosaccount'

az cosmosdb keys list \
   -n $accountName \
   -g $resourceGroupName
```

### List read-only account keys

Get read-only keys for an Azure Cosmos DB account.

```azurecli-interactive
# List read-only account keys
resourceGroupName='MyResourceGroup'
accountName='mycosmosaccount'

az cosmosdb keys list \
    -n $accountName \
    -g $resourceGroupName \
    --type read-only-keys
```

### List connection strings

Get the connection strings for an Azure Cosmos DB account.

```azurecli-interactive
# List connection strings
resourceGroupName='MyResourceGroup'
accountName='mycosmosaccount'

az cosmosdb keys list \
    -n $accountName \
    -g $resourceGroupName \
    --type connection-strings
```

### Regenerate account key

Regenerate a new key for an Azure Cosmos DB account.

```azurecli-interactive
# Regenerate secondary account keys
# key-kind values: primary, primaryReadonly, secondary, secondaryReadonly
az cosmosdb keys regenerate \
    -n $accountName \
    -g $resourceGroupName \
    --key-kind secondary
```

## Azure Cosmos DB database

The following sections demonstrate how to manage the Azure Cosmos DB database, including:

- [Create a database](#create-a-database)
- [Create a database with shared throughput](#create-a-database-with-shared-throughput)
- [Migrate a database to autoscale throughput](#migrate-a-database-to-autoscale-throughput)
- [Change database throughput](#change-database-throughput)
- [Prevent a database from being deleted](#prevent-a-database-from-being-deleted)

### Create a database

Create an Azure Cosmos DB database.

```azurecli-interactive
resourceGroupName='MyResourceGroup'
accountName='mycosmosaccount'
databaseName='database1'

az cosmosdb sql database create \
    -a $accountName \
    -g $resourceGroupName \
    -n $databaseName
```

### Create a database with shared throughput

Create an Azure Cosmos DB database with shared throughput.

```azurecli-interactive
resourceGroupName='MyResourceGroup'
accountName='mycosmosaccount'
databaseName='database1'
throughput=400

az cosmosdb sql database create \
    -a $accountName \
    -g $resourceGroupName \
    -n $databaseName \
    --throughput $throughput
```

### Migrate a database to autoscale throughput

```azurecli-interactive
resourceGroupName='MyResourceGroup'
accountName='mycosmosaccount'
databaseName='database1'

# Migrate to autoscale throughput
az cosmosdb sql database throughput migrate \
    -a $accountName \
    -g $resourceGroupName \
    -n $databaseName \
    -t 'autoscale'

# Read the new autoscale max throughput
az cosmosdb sql database throughput show \
    -g $resourceGroupName \
    -a $accountName \
    -n $databaseName \
    --query resource.autoscaleSettings.maxThroughput \
    -o tsv
```

### Change database throughput

Increase the throughput of an Azure Cosmos DB database by 1000 RU/s.

```azurecli-interactive
resourceGroupName='MyResourceGroup'
accountName='mycosmosaccount'
databaseName='database1'
newRU=1000

# Get minimum throughput to make sure newRU is not lower than minRU
minRU=$(az cosmosdb sql database throughput show \
    -g $resourceGroupName -a $accountName -n $databaseName \
    --query resource.minimumThroughput -o tsv)

if [ $minRU -gt $newRU ]; then
    newRU=$minRU
fi

az cosmosdb sql database throughput update \
    -a $accountName \
    -g $resourceGroupName \
    -n $databaseName \
    --throughput $newRU
```

### Prevent a database from being deleted

Put an Azure resource delete lock on a database to prevent it from being deleted. This feature requires locking the Azure Cosmos DB account from being changed by data plane SDKs. To learn more, see [preventing changes from SDKs](../role-based-access-control.md#prevent-sdk-changes). Azure resource locks can also prevent a resource from being changed by specifying a `ReadOnly` lock type. For an Azure Cosmos DB database, it can be used to prevent throughput from being changed.

```azurecli-interactive
resourceGroupName='myResourceGroup'
accountName='mycosmosaccount'
databaseName='database1'

lockType='CanNotDelete' # CanNotDelete or ReadOnly
databaseParent="databaseAccounts/$accountName"
databaseLockName="$databaseName-Lock"

# Create a delete lock on database
az lock create --name $databaseLockName \
    --resource-group $resourceGroupName \
    --resource-type Microsoft.DocumentDB/sqlDatabases \
    --lock-type $lockType \
    --parent $databaseParent \
    --resource $databaseName

# Delete lock on database
lockid=$(az lock show --name $databaseLockName \
        --resource-group $resourceGroupName \
        --resource-type Microsoft.DocumentDB/sqlDatabases \
        --resource $databaseName \
        --parent $databaseParent \
        --output tsv --query id)
az lock delete --ids $lockid
```

## Azure Cosmos DB container

The following sections demonstrate how to manage the Azure Cosmos DB container, including:

- [Create a container](#create-a-container)
- [Create a container with autoscale](#create-a-container-with-autoscale)
- [Create a container with TTL enabled](#create-a-container-with-ttl)
- [Create a container with custom index policy](#create-a-container-with-a-custom-index-policy)
- [Change container throughput](#change-container-throughput)
- [Migrate a container to autoscale throughput](#migrate-a-container-to-autoscale-throughput)
- [Prevent a container from being deleted](#prevent-a-container-from-being-deleted)

### Create a container

Create an Azure Cosmos DB container with default index policy, partition key and RU/s of 400.

```azurecli-interactive
# Create a API for NoSQL container
resourceGroupName='MyResourceGroup'
accountName='mycosmosaccount'
databaseName='database1'
containerName='container1'
partitionKey='/myPartitionKey'
throughput=400

az cosmosdb sql container create \
    -a $accountName -g $resourceGroupName \
    -d $databaseName -n $containerName \
    -p $partitionKey --throughput $throughput
```

### Create a container with autoscale

Create an Azure Cosmos DB container with default index policy, partition key and autoscale RU/s of 4000.

```azurecli-interactive
# Create a API for NoSQL container
resourceGroupName='MyResourceGroup'
accountName='mycosmosaccount'
databaseName='database1'
containerName='container1'
partitionKey='/myPartitionKey'
maxThroughput=4000

az cosmosdb sql container create \
    -a $accountName -g $resourceGroupName \
    -d $databaseName -n $containerName \
    -p $partitionKey --max-throughput $maxThroughput
```

### Create a container with TTL

Create an Azure Cosmos DB container with TTL enabled.

```azurecli-interactive
# Create an Azure Cosmos DB container with TTL of one day
resourceGroupName='myResourceGroup'
accountName='mycosmosaccount'
databaseName='database1'
containerName='container1'

az cosmosdb sql container update \
    -g $resourceGroupName \
    -a $accountName \
    -d $databaseName \
    -n $containerName \
    --ttl=86400
```

### Create a container with a custom index policy

Create an Azure Cosmos DB container with a custom index policy, a spatial index, composite index, a partition key and RU/s of 400.

```azurecli-interactive
# Create a API for NoSQL container
resourceGroupName='MyResourceGroup'
accountName='mycosmosaccount'
databaseName='database1'
containerName='container1'
partitionKey='/myPartitionKey'
throughput=400

# Generate a unique 10 character alphanumeric string to ensure unique resource names
uniqueId=$(env LC_CTYPE=C tr -dc 'a-z0-9' < /dev/urandom | fold -w 10 | head -n 1)

# Define the index policy for the container, include spatial and composite indexes
idxpolicy=$(cat << EOF
{
    "indexingMode": "consistent",
    "includedPaths": [
        {"path": "/*"}
    ],
    "excludedPaths": [
        { "path": "/headquarters/employees/?"}
    ],
    "spatialIndexes": [
        {"path": "/*", "types": ["Point"]}
    ],
    "compositeIndexes":[
        [
            { "path":"/name", "order":"ascending" },
            { "path":"/age", "order":"descending" }
        ]
    ]
}
EOF
)
# Persist index policy to json file
echo "$idxpolicy" > "idxpolicy-$uniqueId.json"


az cosmosdb sql container create \
    -a $accountName -g $resourceGroupName \
    -d $databaseName -n $containerName \
    -p $partitionKey --throughput $throughput \
    --idx @idxpolicy-$uniqueId.json

# Clean up temporary index policy file
rm -f "idxpolicy-$uniqueId.json"
```

### Change container throughput

Increase the throughput of an Azure Cosmos DB container by 1000 RU/s.

```azurecli-interactive
resourceGroupName='MyResourceGroup'
accountName='mycosmosaccount'
databaseName='database1'
containerName='container1'
newRU=1000

# Get minimum throughput to make sure newRU is not lower than minRU
minRU=$(az cosmosdb sql container throughput show \
    -g $resourceGroupName -a $accountName -d $databaseName \
    -n $containerName --query resource.minimumThroughput -o tsv)

if [ $minRU -gt $newRU ]; then
    newRU=$minRU
fi

az cosmosdb sql container throughput update \
    -a $accountName \
    -g $resourceGroupName \
    -d $databaseName \
    -n $containerName \
    --throughput $newRU
```

### Migrate a container to autoscale throughput

```azurecli-interactive
resourceGroupName='MyResourceGroup'
accountName='mycosmosaccount'
databaseName='database1'
containerName='container1'

# Migrate to autoscale throughput
az cosmosdb sql container throughput migrate \
    -a $accountName \
    -g $resourceGroupName \
    -d $databaseName \
    -n $containerName \
    -t 'autoscale'

# Read the new autoscale max throughput
az cosmosdb sql container throughput show \
    -g $resourceGroupName \
    -a $accountName \
    -d $databaseName \
    -n $containerName \
    --query resource.autoscaleSettings.maxThroughput \
    -o tsv
```

### Prevent a container from being deleted

Put an Azure resource delete lock on a container to prevent it from being deleted. This feature requires locking the Azure Cosmos DB account from being changed by data plane SDKs. To learn more, see [preventing changes from SDKs](../role-based-access-control.md#prevent-sdk-changes). Azure resource locks can also prevent a resource from being changed by specifying a `ReadOnly` lock type. For an Azure Cosmos DB container, locks can be used to prevent throughput or any other property from being changed.

```azurecli-interactive
resourceGroupName='myResourceGroup'
accountName='mycosmosaccount'
databaseName='database1'
containerName='container1'

lockType='CanNotDelete' # CanNotDelete or ReadOnly
databaseParent="databaseAccounts/$accountName"
containerParent="databaseAccounts/$accountName/sqlDatabases/$databaseName"
containerLockName="$containerName-Lock"

# Create a delete lock on container
az lock create --name $containerLockName \
    --resource-group $resourceGroupName \
    --resource-type Microsoft.DocumentDB/containers \
    --lock-type $lockType \
    --parent $containerParent \
    --resource $containerName

# Delete lock on container
lockid=$(az lock show --name $containerLockName \
        --resource-group $resourceGroupName \
        --resource-type Microsoft.DocumentDB/containers \
        --resource-name $containerName \
        --parent $containerParent \
        --output tsv --query id)
az lock delete --ids $lockid
```

## Next steps

For more information on the Azure CLI, see:

- [Install Azure CLI](/cli/azure/install-azure-cli)
- [Azure CLI Reference](/cli/azure/cosmosdb)
- [More Azure CLI samples for Azure Cosmos DB](cli-samples.md)
