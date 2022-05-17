---
title: Create and manage container copy jobs
description: Learn how to create, monitor and manage container copy jobs within Azure Cosmos DB account using CLI commands
author: nayakshweta
ms.service: cosmos-db
ms.topic: how-to
ms.date: 04/18/2022
ms.author: shwetn
---

# Create and manage intra-account container copy jobs in Azure Cosmos DB (Preview)

[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]
[!INCLUDE[appliesto-cassandra-api](includes/appliesto-cassandra-api.md)]

[Container copy jobs](./intra-account-container-copy.md) allow to create offline copies of collections within an Azure Cosmos DB account

This article describes you to create, monitor and manage intra-account container copy jobs using Azure CLI commands.

## Create an intra-account container copy job for SQL API account

Create a job to copy a container within an Azure Cosmos DB SQL API account:

```azurecli-interactive

$cosmosdbaccountname = "cosmosDBAccountName"
$rg = "resourceGroupName"
$copyJobName = ""
$sourceKeySpace = ""
$sourceTable = ""
$destinationKeySpace = ""
$destinationTable = ""

az cosmosdb dts copy -g $rg --job-name $jobName --account-name $cosmosdbaccountname \
    --source-sql-container database=$sourceContainer container=$sourceDb \
    --dest-sql-container database=$destinationContainer container=$destinationDb
```

## Create intra-account container copy job for Cassandra API account

Create a job to copy a container within an Azure Cosmos DB Cassandra API account:

```azurecli-interactive

$cosmosdbaccountname = "cosmosDBAccountName"
$rg = "resourceGroupName"
$copyJobName = ""
$sourceKeySpace = ""
$sourceTable = ""
$destinationKeySpace = ""
$destinationTable = ""

az cosmosdb dts copy -g $rg --job-name $jobName --account-name $cosmosdbaccountname \
    --source-cassandra-table keyspace=$sourceKeySpace table=$sourceTable \
    --dest-cassandra-table keyspace=$destinationKeySpace table=$destinationTable
```

## Monitor the progress of a container copy job

View the progress and status of a copy job:

```azurecli-interactive
az cosmosdb dts show --account-name  $cosmosdbaccountname -g $rg --job-name $copyJobname
```

## List all the container copy jobs created in an account

To list all the container copy jobs created in an account:

```azurecli-interactive
az cosmosdb dts list --account-name  $cosmosdbaccountname -g $rg
```

## Pause a container copy job

In order to pause an ongoing container copy job, you may use the command:

```azurecli-interactive
az cosmosdb dts pause --account-name  $cosmosdbaccountname -g $rg --job-name $copyJobname
```

## Resume a container copy job

In order to resume an ongoing container copy job, you may use the command:

```azurecli-interactive
az cosmosdb dts resume --account-name  $cosmosdbaccountname -g $rg --job-name $copyJobname
```