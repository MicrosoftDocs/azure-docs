---
title: Configure your Azure Cosmos DB for MongoDB account capabilities
description: Learn how to configure your API for MongoDB account capabilities
author: seesharprun
ms.author: sidandrews
ms.reviewer: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb
ms.topic: how-to
ms.date: 03/31/2023
ms.custom: ignite-2022
---

# Configure your Azure Cosmos DB for MongoDB account capabilities

[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

Capabilities are features that can be added or removed to your API for MongoDB account. Many of these features affect account behavior so it's important to be fully aware of the effect a capability will have before enabling or disabling it. Several capabilities are set on API for MongoDB accounts by default, and can't be changed or removed. One example is the EnableMongo capability. This article will demonstrate how to enable and disable a capability.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://aka.ms/trycosmosdb).
- Azure Cosmos DB for MongoDB account. [Create an API for MongoDB account](quickstart-nodejs.md#create-an-azure-cosmos-db-account).
- [Azure Command-Line Interface (CLI)](/cli/azure/) or Azure Portal access. Changing capabilities via ARM is not supported. 

## Available capabilities

| Capability | Description | Removable |
| --- | --- | --- |
| `DisableRateLimitingResponses` | Allows Mongo API to retry rate-limiting requests on the server-side until max-request-timeout | Yes |
| `EnableMongoRoleBasedAccessControl` | Enable support for creating Users/Roles for native MongoDB role-based access control | No |
| `EnableMongoRetryableWrites` | Enables support for retryable writes on the account | Yes |
| `EnableMongo16MBDocumentSupport` | Enables support for inserting documents upto 16 MB in size | No |
| `EnableUniqueCompoundNestedDocs` | Enables support for compound and unique indexes on nested fields, as long as the nested field is not an array. | No |


## Enable a capability

1. Retrieve your existing account capabilities by using [**az cosmosdb show**](/cli/azure/cosmosdb#az-cosmosdb-show):

    ```azurecli-interactive
    az cosmosdb show \
        --resource-group <azure_resource_group> \
        --name <azure_cosmos_db_account_name>
    ```

    You should see a capability section similar to this output:

    ```json
    "capabilities": [
      {
        "name": "EnableMongo"
      }
    ]
    ```

    Review the default capability. In this example, we have just `EnableMongo`.

1. Set the new capability on your database account. The list of capabilities should include the list of previously enabled capabilities, since only the explicitly named capabilities will be set on your account. For example, if you want to add the capability `DisableRateLimitingResponses`, you would use the [**az cosmosdb update**](/cli/azure/cosmosdb#az-cosmosdb-update) command with the `--capabilities` parameter:

    ```azurecli-interactive
    az cosmosdb update \
        --resource-group <azure_resource_group> \
        --name <azure_cosmos_db_account_name> \
        --capabilities EnableMongo DisableRateLimitingResponses
    ```
    
    > [!IMPORTANT]
    > The list of capabilities must always specify all capabilities you wish to enable, inclusively. This includes capabilities already enabled for the account. In this example, the `EnableMongo` capability was already enabled, so both the `EnableMongo` and `DisableRateLimitingResponses` capabilities must be specified.

    > [!TIP]
    > If you're using PowerShell and receive an error using the command above, try using a PowerShell array instead to list the capabilities:
    >
    > ```azurecli
    > az cosmosdb update \
    >     --resource-group <azure_resource_group> \
    >     --name <azure_cosmos_db_account_name> \
    >     --capabilities @("EnableMongo","DisableRateLimitingResponses")
    > ```
    >

## Disable a capability

1. Retrieve your existing account capabilities by using **az cosmosdb show**:

    ```azurecli-interactive
    az cosmosdb show \
        --resource-group <azure_resource_group> \
        --name <azure_cosmos_db_account_name>
    ```

    You should see a capability section similar to this output:

    ```json
    "capabilities": [
      {
        "name": "EnableMongo"
      },
      {
        "name": "DisableRateLimitingResponses"
      }
    ]
    ```

    Observe each of these capabilities. In this example, we have `EnableMongo` and `DisableRateLimitingResponses`.

1. Remove the capability from your database account. The list of capabilities should include the list of previously enabled capabilities you want to keep, since only the explicitly named capabilities will be set on your account. For example, if you want to remove the capability `DisableRateLimitingResponses`, you would use the **az cosmosdb update** command:

    ```azurecli-interactive
    az cosmosdb update \
        --resource-group <azure_resource_group> \
        --name <azure_cosmos_db_account_name> \
        --capabilities EnableMongo
    ```

    > [!TIP]
    > If you're using PowerShell and receive an error using the command above, try using a PowerShell array instead to list the capabilities:
    >
    > ```azurecli
    > az cosmosdb update \
    >     --resource-group <azure_resource_group> \
    >     --name <azure_cosmos_db_account_name> \
    >     --capabilities @("EnableMongo")
    > ```

## Next steps

- Learn how to [use Studio 3T](connect-using-mongochef.md) with Azure Cosmos DB for MongoDB.
- Learn how to [use Robo 3T](connect-using-robomongo.md) with Azure Cosmos DB for MongoDB.
- Explore MongoDB [samples](nodejs-console-app.md) with Azure Cosmos DB for MongoDB.
- Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
  - If all you know is the number of vCores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md).
  - If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-capacity-planner.md).
