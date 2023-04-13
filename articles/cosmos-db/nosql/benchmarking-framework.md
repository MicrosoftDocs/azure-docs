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
ms.custom: template-how-to-pattern, devx-track-azurecli
---

# Measure Azure Cosmos DB for NoSQL performance with a benchmarking framework

There are more choices, now than ever, on the type of database to use with your data workload. One of the key factors to picking a database is the performance of the database or service, but benchmarking performance can be cumbersome and error-prone. The [benchmarking framework for Azure Databases](https://github.com/Azure/azure-db-benchmarking) simplifies the process of measuring performance with popular open-source benchmarking tools with low-friction recipes that implement common best practices. In Azure Cosmos DB for NoSQL, the framework implements [best practices for the Java SDK](performance-tips-java-sdk-v4.md) and uses the open-source [YCSB](https://ycsb.site) tool. In this guide, you use this benchmarking framework to implement a read workload to familiarize yourself with the framework.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- Azure Cosmos DB for NoSQL account. [Create a API for NoSQL account](how-to-create-account.md).
  - Make sure you note the endpoint URI and primary key for the account. [API for NoSQL primary keys](../database-security.md?tabs=sql-api#primary-keys).
- Azure Storage account. [Create an Azure Storage account](../../storage/common/storage-account-create.md).
  - Make sure you note the connection string for the storage account. [Vies Azure Storage connection string](../../storage/common/storage-account-keys-manage.md?tabs=azure-portal#view-account-access-keys).
- Second empty resource group. [Create a resource group](../../azure-resource-manager/management/manage-resource-groups-portal.md#create-resource-groups).
- [Azure Command-Line Interface (CLI)](/cli/azure/).

## Create Azure Cosmos DB account resources

First, you create a database and container in the existing API for NoSQL account.

### [Azure portal](#tab/azure-portal)

1. Navigate to your existing API for NoSQL account in the [Azure portal](https://portal.azure.com/).

1. In the resource menu, select **Data Explorer**.

    :::image type="content" source="media/benchmarking-framework/resource-menu-data-explorer.png" lightbox="media/benchmarking-framework/resource-menu-data-explorer.png" alt-text="Screenshot of the Data Explorer option highlighted in the resource menu.":::

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

    :::image type="content" source="media/benchmarking-framework/dialog-new-container.png" alt-text="Screenshot of the New Container dialog on the Data Explorer page.":::

### [Azure CLI](#tab/azure-cli)

1. If you haven't already, sign in to the Azure CLI using the [`az login`](/cli/azure/reference-index#az-login) command.

1. Create shell variables for the following values:

    - Name of your existing Azure Cosmos DB for NoSQL account named `cosmosAccountName`.
    - Name of your first resource group with resources named `sourceResourceGroupName`.
    - Name of your second empty resource group named `targetResourceGroupName`.
    - Existing Azure Cosmos DB for NoSQL account endpoint URI named `cosmosEndpoint`
    - Existing Azure Cosmos DB for NoSQL account primary key named `cosmosPrimaryKey`

    ```azurecli-interactive
    # Variable for Azure Cosmos DB for NoSQL account name
    cosmosAccountName="<cosmos-db-nosql-account-name>"

    # Variable for resource group with Azure Cosmos DB and Azure Storage accounts
    sourceResourceGroupName="<first-resource-group-name>"

    # Variable for empty resource group
    targetResourceGroupName="<second-resource-group-name>"

    # Variable for API for NoSQL endpoint URI
    cosmosEndpoint="<cosmos-db-nosql-endpoint-uri>"

    # Variable for API for NoSQL primary key
    cosmosPrimaryKey="<cosmos-db-nosql-primary-key>"

    # Variable for Azure Storage account name
    storageAccountName="<storage-account-name>"

    # Variable for storage account connection string
    storageConnectionString="<storage-connection-string>"
    ```

1. Using the [`az cosmosdb sql database create`](/cli/azure/cosmosdb/sql/database#az-cosmosdb-sql-database-create) command, create a new database with the following settings:

    | Setting | Value |
    | --- | --- |
    | **Database id** | `ycsb` |
    | **Database throughput type** | **Manual** |
    | **Database throughput amount** | `400` |

    ```azurecli-interactive
    az cosmosdb sql database create \
        --resource-group $sourceResourceGroupName \
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
        --resource-group $sourceResourceGroupName \
        --account-name $cosmosAccountName \
        --database-name "ycsb" \
        --name "usertable" \
        --partition-key-path "/id"
    ```

---

## Deploy benchmarking framework to Azure

Now, you use an [Azure Resource Manager template](../../azure-resource-manager/templates/overview.md) to deploy the benchmarking framework to Azure with the default read recipe.

### [Azure portal](#tab/azure-portal)

1. Deploy the benchmarking framework using an Azure Resource Manager template available at this link.

    :::image type="content" source="https://aka.ms/deploytoazurebutton" alt-text="Deploy to Azure button." link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-db-benchmarking%2Fmain%2Fcosmos%2Fsql%2Ftools%2Fjava%2Fycsb%2Frecipes%2Fread%2Ftry-it-read%2Fazuredeploy.json":::  

1. On the Custom Deployment page,  the following parameters

    :::image type="content" source="media/benchmarking-framework/page-custom-deployment.png" lightbox="media/benchmarking-framework/page-custom-deployment.png" alt-text="Screenshot of the Custom Deployment page with parameters values filled out.":::

1. Select **Review + create** and then **Create** to deploy the template.

1. Wait for the deployment to complete.

    > [!TIP]
    > The deployment can take 5-10 minutes to complete.

### [Azure CLI](#tab/azure-cli)

1. Use [`az deployment group create`](/cli/azure/deployment/group#az-deployment-group-create) to deploy the benchmarking framework using an Azure Resource Manager template.

    ```azurecli-interactive
    # Variable for raw template JSON on GitHub
    templateUri="https://raw.githubusercontent.com/Azure/azure-db-benchmarking/main/cosmos/sql/tools/java/ycsb/recipes/read/try-it-read/azuredeploy.json"

    az deployment group create \
        --resource-group $targetResourceGroupName \
        --name "benchmarking-framework" \
        --template-uri $templateUri \
        --parameters \
            adminPassword='P@ssw.rd' \
            resultsStorageConnectionString=$storageConnectionString \
            cosmosURI=$cosmosEndpoint \
            cosmosKey=$cosmosPrimaryKey
    ```

1. Wait for the deployment to complete.

    > [!TIP]
    > The deployment can take 5-10 minutes to complete.

---

## View results of the benchmark

Now, you can use the existing Azure Storage account to check the status of the benchmark job and view the aggregated results. The status is stored using a storage table and the results are aggregated into a storage blob using the CSV format.

### [Azure portal](#tab/azure-portal)

1. Navigate to your existing Azure Storage account in the [Azure portal](https://portal.azure.com/).

1. Navigate to a storage table named **ycsbbenchmarkingmetadata** and locate the entity with a partition key of `ycsb_sql`.

    :::image type="content" source="media/benchmarking-framework/storage-table-data.png" alt-text="Screenshot of the ycsbbenchmarkingMetadata table in a storage account.":::

1. Observe the `JobStatus` field of the table entity. Initially, the status of the job is `Started` and it includes a timestamp in the `JobStartTime` property but not the `JobFinishTime` property.

1. Wait until the job has a status of `Finished` and includes a timestamp in the `JobFinishTime` property.

    > [!TIP]
    > It can take approximately 20-30 minutes for the job to finish.

1. Navigate to the storage container in the same account with a prefix of **ycsbbenchmarking-***. Observe the output and diagnostic blobs for the tool.

    :::image type="content" source="media/benchmarking-framework/storage-blob-output.png" alt-text="Screenshot of the container and output blobs from the benchmarking tool.":::

1. Open the **aggregation.csv** blob and observe the content. You should now have a CSV dataset with aggregated results from all the benchmark clients.

    :::image type="content" source="media/benchmarking-framework/storage-blob-aggregation-results.png" alt-text="Screenshot of the content of the aggregation results blob.":::

    ```output
    Operation,Count,Throughput,Min(microsecond),Max(microsecond),Avg(microsecond),P9S(microsecond),P99(microsecond)
    READ,180000,299,706,448255,1079,1159,2867
    ```

### [Azure CLI](#tab/azure-cli)

1. Query the job record in a storage table named `ycsbbenchmarkingmetadata` using [`az storage entity query`](/cli/azure/storage/entity#az-storage-entity-query).

    ```azurecli-interactive
    az storage entity query \
        --account-name $storageAccountName \
        --connection-string $storageConnectionString \
        --table-name ycsbbenchmarkingmetadata
    ```

1. Observe the results of this query. The results should return a single job with `JobStartTime`, `JobStatus`, and `JobFinishTime` properties. Initially, the status of the job is `Started` and it includes a timestamp in the `JobStartTime` property but not the `JobFinishTime` property.

    ```output
    {
      "items": [
        {
          "JobFinishTime": "",
          "JobStartTime": "2023-02-02T13:59:42Z",
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

    ```output
    {
      "items": [
        {
          "JobFinishTime": "2023-02-02T14:21:12Z",
          "JobStartTime": "2023-02-02T13:59:42Z",
          "JobStatus": "Finished",
          ...
        }
      ],
      ...
    }
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

    ```output
    Operation,Count,Throughput,Min(microsecond),Max(microsecond),Avg(microsecond),P9S(microsecond),P99(microsecond)
    READ,180000,299,706,448255,1079,1159,2867
    ```

---

## Recipes

The [benchmarking framework for Azure Databases](https://github.com/Azure/azure-db-benchmarking) includes recipes to encapsulate the workload definitions that are passed to the underlying benchmarking tool for a "1-Click" experience. The workload definitions were designed based on the best practices published by the Azure Cosmos DB team and the benchmarking tool's team. The recipes have been tested and validated for consistent results.

You can expect to see the following latencies for all the read and write recipes in the [GitHub repository](https://github.com/Azure/azure-db-benchmarking/tree/main/cosmos/sql/tools/java/ycsb/recipes).

- **Read latency**

    :::image type="content" source="media\benchmarking-framework\typical-read-latency.png" lightbox="media\benchmarking-framework\typical-read-latency.png" alt-text="Diagram of the typical read latency averaging around 1 millisecond to 2 milliseconds.":::

- **Write latency**

    :::image type="content" source="media\benchmarking-framework\typical-write-latency.png" lightbox="media\benchmarking-framework\typical-write-latency.png" alt-text="Diagram of the typical write latency averaging around 4 milliseconds.":::

## Common issues

This section includes the common errors that may occur when running the benchmarking tool. The error logs for the tool are typically available in a container within the Azure Storage account.

:::image type="content" source="media/benchmarking-framework/storage-diagnostic-results.png" alt-text="Screenshot of container and blobs in a storage account.":::

- If the logs aren't available in the storage account, this issue is typically caused by an incorrect or missing storage connection string. In this case, this error is listed in the **agent.out** file within the **/home/benchmarking** folder of the client virtual machine.

    ```output
    Error while accessing storage account, exiting from this machine in agent.out on the VM
    ```

- This error is listed in the **agent.out** file both in the client VM and the storage account if the Azure Cosmos DB endpoint URI is incorrect or unreachable.

    ```output
    Caused by: java.net.UnknownHostException: rtcosmosdbsss.documents.azure.com: Name or service not known 
    ```

- This error is listed in the **agent.out** file both in the client VM and the storage account if the Azure Cosmos DB key is incorrect.

    ```output
    The input authorization token can't serve the request. The wrong key is being used….
    ```

## Next steps

- Learn more about the benchmarking tool with the [Getting Started guide](https://github.com/Azure/azure-db-benchmarking/tree/main/cosmos/sql/tools/java/ycsb/recipes).
