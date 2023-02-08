---
title: Measure performance with a benchmarking framework
titleSuffix: Azure Cosmos DB for NoSQL
description: Use YCSB to benchmark Azure Cosmos DB for NoSQL with recipes to measure read, write, scan, and update performance.
author: ravitella
ms.author: ratella
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 01/31/2023
ms.custom: template-how-to-pattern
---

# Measure Azure Cosmos DB for NoSQL performance with a benchmarking framework

There are more choices, now than ever, on the type of database to use with your data workload. One of the key factors to picking a database is the performance of the database or service, but benchmarking performance can be cumbersome and error-prone. The [benchmarking framework for Azure Databases](https://github.com/Azure/azure-db-benchmarking) simplifies the process of measuring performance by using popular open-source benchmarking frameworks with low-friction recipes that implement common best practices. In Azure Cosmos DB for NoSQL, the framework implements [best practices for the Java SDK](performance-tips-java-sdk-v4.md) and uses the open-source [YCSB](https://ycsb.site) tool. In this guide, you use this benchmarking framework to implement a common "read recipe" benchmark.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- Azure Cosmos DB for NoSQL account. [Create a API for NoSQL account](how-to-create-account.md).
- [Azure Command-Line Interface (CLI)](/cli/azure/).

## Configure and create Azure resources

First, you create a database and container in the existing API for NoSQL account. Then, you create an Azure Storage account and an empty resource group. The resource group is used as the target of the benchmarking framework deployment.

### [Azure CLI](#tab/azure-cli)

1. If you haven't already, sign in to the Azure CLI using the [`az login`](/cli/azure/reference-index#az-login) command.

1. Create a shell variable for the name of your existing Azure Cosmos DB for NoSQL account named `cosmosAccountName`. Create another shell variable for the name of your resource group named `resourceGroupName`.

    ```azurecli-interactive
    # Variable for Azure Cosmos DB for NoSQL account name
    cosmosAccountName="<existing-account-name>"

    # Variable for resource group name
    resourceGroupName="<existing-resource-group-name>"
    ```

1. Get the API for NoSQL endpoint `URI` for the account using the [`az cosmosdb show`](/cli/azure/cosmosdb#az-cosmosdb-show) command.

    ```azurecli-interactive
    az cosmosdb show \
        --resource-group $resourceGroupName \
        --name $cosmosAccountName \
        --query "documentEndpoint" \
        --output tsv
    ```

1. Store the `URI` in a variable named `cosmosEndpoint`.

    ```azurecli-interactive
    cosmosEndpoint=$( \
        az cosmosdb show \
            --resource-group $resourceGroupName \
            --name $cosmosAccountName \
            --query "documentEndpoint" \
            --output tsv \
    )
    ```

1. Find the `PRIMARY KEY` from the list of keys for the account with the [`az cosmosdb keys list`](/cli/azure/cosmosdb/keys#az-cosmosdb-keys-list) command.

    ```azurecli-interactive
    az cosmosdb keys list \
        --resource-group $resourceGroupName \
        --name $cosmosAccountName \
        --type "keys" \
        --query "primaryMasterKey" \
        --output tsv
    ```

1. Store the `PRIMARY KEY` in a variable named `cosmosPrimaryKey`.

    ```azurecli-interactive
    cosmosPrimaryKey=$( \
        az cosmosdb keys list \
            --resource-group $resourceGroupName \
            --name $cosmosAccountName \
            --type "keys" \
            --query "primaryMasterKey" \
            --output tsv \
    )
    ```

1. Using the [`az cosmosdb sql database create`](/cli/azure/cosmosdb/sql/database#az-cosmosdb-sql-database-create) command, create a new database with the following settings:

    | Setting | Value |
    | --- | --- |
    | **Database id** | `ycsb` |
    | **Database throughput type** | **Manual** |
    | **Database throughput amount** | `400` |

    ```azurecli-interactive
    az cosmosdb sql database create \
        --resource-group $resourceGroupName \
        --account-name $cosmosAccountName \
        --name "ycsb" \
        --throughput 400
    ```

1. Using the [`az cosmosdb sql container create`](/cli/azure/cosmosdb/sql/container#az-cosmosdb-sql-container-create) command, create a new container with the following settings:

    | Setting | Value |
    | --- | --- |
    | **Database id** | `ycsb` |
    | **Container id** | `usertable` |
    | **Partition key** | `/id` |

    ```azurecli-interactive
    az cosmosdb sql container create \
        --resource-group $resourceGroupName \
        --account-name $cosmosAccountName \
        --database-name "ycsb" \
        --name "usertable" \
        --partition-key-path "/id"
    ```

### [Azure portal](#tab/azure-portal)

1. Navigate to your existing API for NoSQL account in the [Azure portal](https://portal.azure.com/).

1. In the resource menu, select **Keys**.

    :::image type="content" source="media/benchmarking-framework/resource-menu-keys.png" lightbox="media/benchmarking-framework/resource-menu-keys.png" alt-text="Screenshot of an API for NoSQL account page. The Keys option is highlighted in the resource menu.":::

1. On the **Keys** page, observe and record the value of the **URI**, **PRIMARY KEY**, and **PRIMARY CONNECTION STRING*** fields. These values are used throughout the tutorial.

    :::image type="content" source="media/benchmarking-framework/page-keys.png" alt-text="Screenshot of the Keys page with the URI, Primary Key, and Primary Connection String fields highlighted.":::

1. In the resource menu, select **Data Explorer**.

    :::image type="content" source="media/benchmarking-framework/resource-menu-data-explorer.png" alt-text="Screenshot of the Data Explorer option highlighted in the resource menu.":::

1. On the **Data Explorer** page, select the **New Container** option in the command bar.

    :::image type="content" source="media/benchmarking-framework/page-data-explorer-new-container.png" alt-text="Screenshot of the New Container option in the Data Explorer command bar.":::

1. In the **New Container** dialog, create a new container with the following settings:

    | Setting | Value |
    | --- | --- |
    | **Database id** | `ycsb` |
    | **Database throughput type** | **Manual** |
    | **Database throughput amount** | `400` |
    | **Container id** | `usertable` |
    | **Partition key** | `/id` |

---

## Deploy benchmarking framework to Azure

Now, you use an [Azure Resource Manager template](../../azure-resource-manager/templates/overview.md) to deploy the benchmarking framework to Azure with the default read recipe. Prior to deploying this template, you need to create a prerequisite storage account to store the benchmarking results. After the template is deployed and the benchmarking is finished, you'll observe the results. The results of the read recipe are stored in a CSV file within the storage account.

### [Azure CLI](#tab/azure-cli)

1. Create a shell variable for the name of a new Azure Storage account named `storageAccountName`.

    ```azurecli-interactive
    let suffix=$RANDOM*$RANDOM

    # Variable for storage account name
    storageAccountName="msdocsstor$suffix"

    # Variable for storage account location
    location="westus"
    ```

1. Use [`az storage account create`](/cli/azure/storage/account#az-storage-account-create) to create a new Azure Storage account.

    ```azurecli-interactive
    az storage account create \
        --resource-group $resourceGroupName \
        --name $storageAccountName \
        --location $location \
        --sku Standard_LRS \
        --kind StorageV2
    ```

1. Use [`az storage account show-connection-string`](/cli/azure/storage/account#az-storage-account-show-connection-string) to view the connection string for the storage account.

    ```azurecli-interactive
    az storage account show-connection-string \
        --resource-group $resourceGroupName \
        --name $storageAccountName \
        --query connectionString \
        --output tsv
    ```

1. Store the connection string in a variable named `storageConnectionString`.

    ```azurecli-interactive
    storageConnectionString=$( \
        az storage account show-connection-string \
            --resource-group $resourceGroupName \
            --name $storageAccountName \
            --query connectionString \
            --output tsv \
    )
    ```

1. Use [`az deployment group create`](/cli/azure/deployment/group#az-deployment-group-create) to deploy the benchmarking framework using an Azure Resource Manager template.

    ```azurecli-interactive
    # Variable for raw template JSON on GitHub
    templateUri="https://raw.githubusercontent.com/Azure/azure-db-benchmarking/main/cosmos/sql/tools/java/ycsb/recipes/read/try-it-read/azuredeploy.json"

    az deployment group create \
        --resource-group $resourceGroupName \
        --name "benchmarking-framework" \
        --template-uri $templateUri \
        --parameters \
            adminPassword='P@ssw.rd' \
            resultsStorageConnectionString=$storageConnectionString \
            cosmosURI=$cosmosEndpoint \
            cosmosKey=$cosmosPrimaryKey
    ```

1. Wait for the deployment to complete.

### [Azure portal](#tab/azure-portal)

1. TODO

---

## View results of the benchmark

TODO: <!-- A short sentence or two. -->

### [Azure CLI](#tab/azure-cli)

1. Query the job record in a storage table named `ycsbbenchmarkingmetadata` using [`az storage entity query`](/cli/azure/storage/entity#az-storage-entity-query).

    ```azurecli-interactive
    az storage entity query \
        --account-name $storageAccountName \
        --connection-string $storageConnectionString \
        --table-name ycsbbenchmarkingmetadata
    ```

1. Observe the results of this query. The results should return a single job with `JobStartTime`, `JobStatus`, and `JobFinishTime` properties. Initially, the status of the job is `Started` and it includes a timestamp in the `JobStartTime` property but not the `JobFinishTime` property.

    ```json
    {
      "items": [
        {
          "JobFinishTime": "",
          "JobStartTime": "2023-02-08T13:59:42Z",
          "JobStatus": "Started",
          "NoOfClientsCompleted": "0",
          "NoOfClientsStarted": {
            "edm_type": "Edm.Int64",
            "value": 1
          },
          "PartitionKey": "ycsb_sql",
          ...
        }
      ],
      ...
    }
    ```

1. If necessary, run `az storage entity query` multiple times until the job has a status of `Finished` and includes a timestamp in the `JobFinishTime` property.

    ```json
    
    ```

    > [!TIP]
    > It can take approximately 20-30 minutes for the job to finish.

1. Find the name of the most recently modified storage container with a prefix of `ycsbbenchmarking-*` using [`az storage container list`](/cli/azure/storage/container#az-storage-container-list) and a [JMESPath query](/cli/azure/query-azure-cli).

    ```azurecli-interactive
    az storage container list \
        --account-name $storageAccountName \
        --connection-string $storageConnectionString \
        --query "sort_by([?starts_with(name, 'ycsbbenchmarking-')], &properties.lastModified)[-1].name" \
        --output tsv
    ```

1. Store the container string in a variable named `storageConnectionString`.

    ```azurecli-interactive
    storageContainerName=$( \
        az storage container list \
            --account-name $storageAccountName \
            --connection-string $storageConnectionString \
            --query "sort_by([?starts_with(name, 'ycsbbenchmarking-')], &properties.lastModified)[-1].name" \
            --output tsv \
    )
    ```

1. Use [`az storage blob query`]/cli/azure/storage/blob#az-storage-blob-query) to query the job results in a storage blob stored in the previously located container.

    ```azurecli-interactive
    az storage blob query \
        --account-name $storageAccountName \
        --connection-string $storageConnectionString \
        --container-name $storageContainerName \
        --name aggregation.csv \
        --query-expression "SELECT * FROM BlobStorage"
    ```

1. Observe the results of this query. You should now have a CSV dataset with aggregated results from all the benchmark clients.

    ```json
    
    ```

### [Azure portal](#tab/azure-portal)

1. TODO

---

## Next steps

- Implement cost-effective read and writes by implementing a [key value store](../key-value-store-cost.md).
