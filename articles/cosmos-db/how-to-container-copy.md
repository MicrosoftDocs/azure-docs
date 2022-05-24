---
title: Create and manage intra-account container copy jobs in Azure Cosmos DB
description: Learn how to create, monitor, and manage container copy jobs within an Azure Cosmos DB account using CLI commands.
author: nayakshweta
ms.service: cosmos-db
ms.topic: how-to
ms.date: 04/18/2022
ms.author: shwetn
---

# Create and manage intra-account container copy jobs in Azure Cosmos DB (Preview)
[!INCLUDE[appliesto-sql-cassandra-api](includes/appliesto-sql-cassandra-api.md)]

[Container copy jobs](intra-account-container-copy.md) creates offline copies of collections within an Azure Cosmos DB account.

This article describes how to create, monitor, and manage intra-account container copy jobs using Azure CLI commands.

## Set shell variables

First, set all of the variables that each individual script will use.

```azurecli-interactive
$accountName = "<cosmos-account-name>"
$resourceGroup = "<resource-group-name>"
$jobName = ""
$sourceDatabase = ""
$sourceContainer = ""
$destinationDatabase = ""
$destinationContainer = ""
```

## Create an intra-account container copy job for SQL API account

Create a job to copy a container within an Azure Cosmos DB SQL API account:

```azurecli-interactive
az cosmosdb dts copy \
    --resource-group $resourceGroup \ 
    --job-name $jobName \
    --account-name $accountName \
    --source-sql-container database=$sourceDatabase container=$sourceContainer \
    --dest-sql-container database=$destinationDatabase container=$destinationContainer
```

## Create intra-account container copy job for Cassandra API account

Create a job to copy a container within an Azure Cosmos DB Cassandra API account:

```azurecli-interactive
az cosmosdb dts copy \
    --resource-group $resourceGroup \
    --job-name $jobName \
    --account-name $accountName \
    --source-cassandra-table keyspace=$sourceKeySpace table=$sourceTable \
    --dest-cassandra-table keyspace=$destinationKeySpace table=$destinationTable
```

## Monitor the progress of a container copy job

View the progress and status of a copy job:

```azurecli-interactive
az cosmosdb dts show \
    --account-name $accountName \
    --resource-group $resourceGroup \
    --job-name $jobName
```

## List all the container copy jobs created in an account

To list all the container copy jobs created in an account:

```azurecli-interactive
az cosmosdb dts list \
    --account-name $accountName \
    --resource-group $resourceGroup
```

## Pause a container copy job

In order to pause an ongoing container copy job, you may use the command:

```azurecli-interactive
az cosmosdb dts pause \
    --account-name $accountName \
    --resource-group $resourceGroup \
    --job-name $jobName
```

## Resume a container copy job

In order to resume an ongoing container copy job, you may use the command:

```azurecli-interactive
az cosmosdb dts resume \
    --account-name $accountName \
    --resource-group $resourceGroup \
    --job-name $jobName
```

## Next steps

- For more information about intra-account container copy jobs, see [Container copy jobs](intra-account-container-copy.md).
