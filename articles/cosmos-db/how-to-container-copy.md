---
title: Create and manage intra-account container copy jobs in Azure Cosmos DB
description: Learn how to create, monitor, and manage container copy jobs within an Azure Cosmos DB account using CLI commands.
author: seesharprun
ms.service: cosmos-db
ms.custom: ignite-2022, devx-track-azurecli, build-2023
ms.topic: how-to
ms.date: 08/01/2022
ms.author: sidandrews
ms.reviewer: sidandrews
---

# Create and manage intra-account container copy jobs in Azure Cosmos DB (Preview)
[!INCLUDE[NoSQL, Cassandra, MongoDB](includes/appliesto-nosql-mongodb-cassandra.md)]

[Container copy jobs](intra-account-container-copy.md) help create offline copies of containers within an Azure Cosmos DB account.

This article describes how to create, monitor, and manage intra-account container copy jobs using Azure CLI commands.

## Prerequisites

* You may use the portal [Cloud Shell](/azure/cloud-shell/quickstart?tabs=powershell) to run container copy commands. Alternately, you may run the commands locally; make sure you have [Azure CLI](/cli/azure/install-azure-cli) downloaded and installed on your machine.
* Currently, container copy is only supported in [these regions](intra-account-container-copy.md#supported-regions). Make sure your account's write region belongs to this list.


## Install the Azure Cosmos DB preview extension

This extension contains the container copy commands.

```azurecli-interactive
az extension add --name cosmosdb-preview
```

## Set shell variables

First, set all of the variables that each individual script uses.

```azurecli-interactive
$resourceGroup = "<resource-group-name>"
$accountName = "<cosmos-account-name>"
$jobName = ""
$sourceDatabase = ""
$sourceContainer = ""
$destinationDatabase = ""
$destinationContainer = ""
```

## Create an intra-account container copy job for API for NoSQL account

Create a job to copy a container within an Azure Cosmos DB API for NoSQL account:

```azurecli-interactive
az cosmosdb dts copy `
    --resource-group $resourceGroup `
    --account-name $accountName `
    --job-name $jobName `
    --source-sql-container database=$sourceDatabase container=$sourceContainer `
    --dest-sql-container database=$destinationDatabase container=$destinationContainer
```

## Create intra-account container copy job for API for Cassandra account

Create a job to copy a container within an Azure Cosmos DB API for Cassandra account:

```azurecli-interactive
az cosmosdb dts copy `
    --resource-group $resourceGroup `
    --account-name $accountName `
    --job-name $jobName `
    --source-cassandra-table keyspace=$sourceKeySpace table=$sourceTable `
    --dest-cassandra-table keyspace=$destinationKeySpace table=$destinationTable
```

## Create intra-account container copy job for API for MongoDB account

Create a job to copy a container within an Azure Cosmos DB API for MongoDB account:

```azurecli-interactive
az cosmosdb dts copy `
    --resource-group $resourceGroup `
    --account-name $accountName `
    --job-name $jobName `
    --source-mongo database=$sourceDatabase collection=$sourceCollection `
    --dest-mongo database=$destinationDatabase collection=$destinationCollection
```

> [!NOTE]
> `--job-name` should be unique for each job within an account.

## Monitor the progress of a container copy job

View the progress and status of a copy job:

```azurecli-interactive
az cosmosdb dts show `
    --resource-group $resourceGroup `
    --account-name $accountName `
    --job-name $jobName
```

## List all the container copy jobs created in an account

To list all the container copy jobs created in an account:

```azurecli-interactive
az cosmosdb dts list `
    --resource-group $resourceGroup `
    --account-name $accountName
```

## Pause a container copy job

In order to pause an ongoing container copy job, you may use the command:

```azurecli-interactive
az cosmosdb dts pause `
    --resource-group $resourceGroup `
    --account-name $accountName `
    --job-name $jobName
```

## Resume a container copy job

In order to resume an ongoing container copy job, you may use the command:

```azurecli-interactive
az cosmosdb dts resume `
    --resource-group $resourceGroup `
    --account-name $accountName `
    --job-name $jobName
```

## Get support for container copy issues
For issues related to intra-account container copy, please raise a **New Support Request** from the Azure portal. Set the **Problem Type** as 'Data Migration' and **Problem subtype** as 'Intra-account container copy'.


## Next steps

- For more information about intra-account container copy jobs, see [Container copy jobs](intra-account-container-copy.md).
