---
title: Create and manage intra-account container copy jobs in Azure Cosmos DB
description: Learn how to create, monitor, and manage container copy jobs within an Azure Cosmos DB account using CLI commands.
author: seesharprun
ms.service: cosmos-db
ms.custom: ignite-2022, devx-track-azurecli, build-2023, ignite-2023
ms.topic: how-to
ms.date: 08/01/2022
ms.author: sidandrews
ms.reviewer: sidandrews
---

# Create and manage container copy jobs in Azure Cosmos DB (Preview)
[!INCLUDE[NoSQL, Cassandra, MongoDB](includes/appliesto-nosql-mongodb-cassandra.md)]

[Container copy jobs](container-copy.md) help create offline copies of containers in Azure Cosmos DB accounts.

This article describes how to create, monitor, and manage container copy jobs using Azure CLI commands.

## Prerequisites

* You can use the portal [Cloud Shell](/azure/cloud-shell/quickstart?tabs=powershell) to run container copy commands. Alternately, you can run the commands locally; make sure you have [Azure CLI](/cli/azure/install-azure-cli) downloaded and installed on your machine.
* Currently, container copy is only supported in [these regions](container-copy.md#supported-regions). Make sure your account's write region belongs to this list.


> [!NOTE]
> Container copy job across Azure Cosmos DB accounts is available for NoSQL API account only. 
> Container copy job within an Azure Cosmos DB account is available for NoSQL, MongoDB and Cassandra API accounts.

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

## Create a container copy job for API for NoSQL account

Create a job to copy a container within an Azure Cosmos DB API for NoSQL account:

```azurecli-interactive
az cosmosdb copy create `
    --resource-group $resourceGroup `
    --job-name $jobName `
    --dest-account $destAccount `
    --src-account $srcAccount `
    --dest-nosql database=$destinationDatabase container=$destinationContainer `
    --src-nosql database=$sourceDatabase container=$sourceContainer
```

## Create an intra-account container copy job for API for Cassandra account

Create a job to copy a container within an Azure Cosmos DB API for Cassandra account:

```azurecli-interactive
az cosmosdb copy create `
    --resource-group $resourceGroup `
    --job-name $jobName `
    --dest-account $destAccount `
    --src-account $srcAccount `
    --dest-cassandra keyspace=$destinationKeySpace table=$destinationTable `
    --src-cassandra keyspace=$sourceKeySpace table=$sourceTable 
```

## Create an intra-account container copy job for API for MongoDB account

Create a job to copy a container within an Azure Cosmos DB API for MongoDB account:

```azurecli-interactive
az cosmosdb copy create `
    --resource-group $resourceGroup `
    --job-name $jobName `
    --dest-account $destAccount `
    --src-account $srcAccount `
    --dest-mongo database=$destinationDatabase collection=$destinationCollection `
    --src-mongo database=$sourceDatabase collection=$sourceCollection 
```

> [!NOTE]
> `--job-name` should be unique for each job within an account.

> [!TIP]
> --src-account parameter is optional for intra-account container copy jobs along with corresponding --src-nosql, --src-mongo and --src-cassandra database/container option for NoSQL, MongoDB, Cassandra API accounts respectively.

## Monitor the progress of a container copy job

View the progress and status of a copy job:

```azurecli-interactive
az cosmosdb copy show `
    --resource-group $resourceGroup `
    --account-name $accountName `
    --job-name $jobName
```

## List all the container copy jobs created in an account

To list all the container copy jobs created in an account:

```azurecli-interactive
az cosmosdb copy list `
    --resource-group $resourceGroup `
    --account-name $accountName
```

## Pause a container copy job

In order to pause an ongoing container copy job, you can use the command:

```azurecli-interactive
az cosmosdb copy pause `
    --resource-group $resourceGroup `
    --account-name $accountName `
    --job-name $jobName
```

## Resume a container copy job

In order to resume an ongoing container copy job, you can use the command:

```azurecli-interactive
az cosmosdb copy resume `
    --resource-group $resourceGroup `
    --account-name $accountName `
    --job-name $jobName
```

## Cancel a container copy job

In order to cancel an ongoing container copy job, you can use the command:

```azurecli-interactive
az cosmosdb copy cancel `
    --resource-group $resourceGroup `
    --account-name $accountName `
    --job-name $jobName
```

## Get support for container copy issues
For issues related to Container copy, raise a **New Support Request** from the Azure portal. Set the **Problem Type** as 'Data Migration' and **Problem subtype** as 'Container copy'.


## Next steps

- For more information about container copy jobs, see [Container copy jobs](container-copy.md).
