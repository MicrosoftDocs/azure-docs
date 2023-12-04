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
* Install the Azure Cosmos DB preview extension which contains the container copy commands.
    ```azurecli-interactive
    az extension add --name cosmosdb-preview
    ```

> [!NOTE]
> Container copy job across Azure Cosmos DB accounts is available for NoSQL API account only. 
> Container copy job within an Azure Cosmos DB account is available for NoSQL, MongoDB and Cassandra API accounts.

## Create a container copy job to copy data within an Azure Cosmos DB account

### Set shell variables

First, set all of the variables that each individual script uses.

```azurecli-interactive
$destinationRG = "<destination-resource-group-name>"
$sourceAccount = "<cosmos-source-account-name>"
$destinationAccount = "<cosmos-destination-account-name>"
$jobName = ""
$sourceDatabase = ""
$sourceContainer = ""
$destinationDatabase = ""
$destinationContainer = ""
```

### Create container copy job

**API for NoSQL account**

Create a job to copy a container within an Azure Cosmos DB API for NoSQL account:

```azurecli-interactive
az cosmosdb copy create `
    --resource-group $destinationRG `
    --job-name $jobName `
    --dest-account $destAccount `
    --src-account $srcAccount `
    --dest-nosql database=$destinationDatabase container=$destinationContainer `
    --src-nosql database=$sourceDatabase container=$sourceContainer
```

**API for Cassandra account**

Create a job to copy a container within an Azure Cosmos DB API for Cassandra account:

```azurecli-interactive
az cosmosdb copy create `
    --resource-group $destinationRG `
    --job-name $jobName `
    --dest-account $destAccount `
    --src-account $srcAccount `
    --dest-cassandra keyspace=$destinationKeySpace table=$destinationTable `
    --src-cassandra keyspace=$sourceKeySpace table=$sourceTable 
```

**API for MongoDB account**

Create a job to copy a container within an Azure Cosmos DB API for MongoDB account:

```azurecli-interactive
az cosmosdb copy create `
    --resource-group $destinationRG `
    --job-name $jobName `
    --dest-account $destAccount `
    --src-account $srcAccount `
    --dest-mongo database=$destinationDatabase collection=$destinationCollection `
    --src-mongo database=$sourceDatabase collection=$sourceCollection 
```

> [!NOTE]
> `--job-name` should be unique for each job within an account.

##  Create a container copy job to copy data across Azure Cosmos DB accounts

### Set shell variables

First, set all of the variables that each individual script uses.

```azurecli-interactive
$sourceSubId = "<source-subscription-id>" 
$destinationSubId = "<destination-subscription-id>" 
$sourceAccountRG = "<source-resource-group-name>"
$destinationAccountRG = "<destination-resource-group-name>"
$sourceAccount = "<cosmos-source-account-name>"
$destinationAccount = "<cosmos-destination-account-name>"
$jobName = ""
$sourceDatabase = ""
$sourceContainer = ""
$destinationDatabase = ""
$destinationContainer = ""
```

### Assign read permission

While copying data from one account's container to another account's container. It is required to give read access of source container to destination account's identity to perform the copy operation. Follow the steps below to assign requisite read permission to destination account.

**Using System managed identity**

1. Set destination subscription context
    ```azurecli-interactive
    az account set --subscription $destinationSubId
    ```
2. Add system identity on destination account
    ```azurecli-interactive
    $identityOutput = az cosmosdb identity assign -n $destinationAccount -g $destinationAccountRG
    $principalId = ($identityOutput | ConvertFrom-Json).principalId
    ```
3. Set default identity on destination account
    ```azurecli-interactive
    az cosmosdb update -n $destinationAccount -g $destinationAccountRG --default-identity="SystemAssignedIdentity"
    ```
4. Set source subscription context
    ```azurecli-interactive
    az account set --subscription $sourceSubId
    ```
5. Add role assignment on source account
    ```azurecli-interactive
    # Read-only access role
    $roleDefinitionId = "00000000-0000-0000-0000-000000000001" 
    az cosmosdb sql role assignment create --account-name $sourceAccount --resource-group $sourceAccountRG --role-definition-id $roleDefinitionId --scope "/" --principal-id $principalId
    ```
6. Reset destination subscription context
    ```azurecli-interactive
    az account set --subscription $destinationSubId
    ```

**Using User-assigned managed identity**

1. Assign User-assigned managed identity variable 
    ```azurecli-interactive
    $userAssignedManagedIdentityResourceId = "<CompleteResourceIdOfUserAssignedManagedIdentity>"
    ```
2. Set destination subscription context
    ```azurecli-interactive
    az account set --subscription $destinationSubId
    ```
3. Add user assigned managed identity on destination account
    ```azurecli-interactive
    $identityOutput = az cosmosdb identity assign -n $destinationAccount -g $destinationAccountRG --identities $userAssignedManagedIdentityResourceId
    $principalId = ($identityOutput | ConvertFrom-Json).userAssignedIdentities.$userAssignedManagedIdentityResourceId.principalId
    ```
4. Set default identity on destination account
    ```azurecli-interactive
    az cosmosdb update -n $destinationAccount -g $destinationAccountRG --default-identity=UserAssignedIdentity=$userAssignedManagedIdentityResourceId
    ```
5. Set source subscription context
    ```azurecli-interactive
    az account set --subscription $sourceSubId
    ```
6. Add role assignment on source account
    ```azurecli-interactive
    $roleDefinitionId = "00000000-0000-0000-0000-000000000001"  # Read-only access role
    az cosmosdb sql role assignment create --account-name $sourceAccount --resource-group $sourceAccountRG --role-definition-id $roleDefinitionId --scope "/" --principal-id $principalId
    ```
7. Reset destination subscription context
    ```azurecli-interactive
    az account set --subscription $destinationSubId
    ```

### Create container copy job

**API for NoSQL account**

```azurecli-interactive
az cosmosdb copy create `
    --resource-group $destinationAccountRG `
    --job-name $jobName `
    --dest-account $destAccount `
    --src-account $srcAccount `
    --dest-nosql database=$destinationDatabase container=$destinationContainer `
    --src-nosql database=$sourceDatabase container=$sourceContainer
```

## Managing container copy jobs

### Monitor the progress of a container copy job

View the progress and status of a copy job:

```azurecli-interactive
az cosmosdb copy show `
    --resource-group $destinationAccountRG `
    --account-name $destAccount `
    --job-name $jobName
```

### List all the container copy jobs created in an account

To list all the container copy jobs created in an account:

```azurecli-interactive
az cosmosdb copy list `
    --resource-group $destinationAccountRG `
    --account-name $destAccount
```

### Pause a container copy job

In order to pause an ongoing container copy job, you can use the command:

```azurecli-interactive
az cosmosdb copy pause `
    --resource-group $destinationAccountRG `
    --account-name $destAccount `
    --job-name $jobName
```

### Resume a container copy job

In order to resume an ongoing container copy job, you can use the command:

```azurecli-interactive
az cosmosdb copy resume `
    --resource-group $destinationAccountRG `
    --account-name $destAccount `
    --job-name $jobName
```

### Cancel a container copy job

In order to cancel an ongoing container copy job, you can use the command:

```azurecli-interactive
az cosmosdb copy cancel `
    --resource-group $destinationAccountRG `
    --account-name $destAccount `
    --job-name $jobName
```

## Get support for container copy issues
For issues related to Container copy, raise a **New Support Request** from the Azure portal. Set the **Problem Type** as 'Data Migration' and **Problem subtype** as 'Container copy'.


## Next steps

- For more information about container copy jobs, see [Container copy jobs](container-copy.md).
