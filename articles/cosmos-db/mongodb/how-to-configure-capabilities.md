---
title: Configure your Azure Cosmos DB for MongoDB account capabilities
description: Learn how to configure your API for MongoDB account capabilities.
author: seesharprun
ms.author: sidandrews
ms.reviewer: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb
ms.topic: how-to
ms.date: 05/10/2023
ms.custom: build-2023
---

# Configure your Azure Cosmos DB for MongoDB account capabilities

[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

Capabilities are features that can be added or removed to your API for MongoDB account. Many of these features affect account behavior, so it's important to be fully aware of the effect a capability has before you enable or disable it. Several capabilities are set on API for MongoDB accounts by default and can't be changed or removed. One example is the `EnableMongo` capability. This article demonstrates how to enable and disable a capability.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://aka.ms/trycosmosdb).
- An Azure Cosmos DB for MongoDB account. [Create an API for MongoDB account](quickstart-nodejs.md#create-an-azure-cosmos-db-account).
- [Azure CLI](/cli/azure/) or Azure portal access. Changing capabilities via Azure Resource Manager isn't supported.

## Available capabilities

| Capability                          | Description                                                                                                                                  | Removable |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `DisableRateLimitingResponses`      | Allows Mongo API to retry rate-limiting requests on the server side until the value that's set for `max-request-timeout`.                                                | Yes       |
| `EnableMongoRoleBasedAccessControl` | Enable support for creating users and roles for native MongoDB role-based access control.                                                         | No        |
| `EnableMongoRetryableWrites`        | Enables support for retryable writes on the account.                                                                                          | Yes       |
| `EnableMongo16MBDocumentSupport`    | Enables support for inserting documents up to 16 MB in size.                                                                                   | No        |
| `EnableUniqueCompoundNestedDocs`    | Enables support for compound and unique indexes on nested fields if the nested field isn't an array.                               | No        |
| `EnableTtlOnCustomPath`             | Provides the ability to set a custom Time to Live (TTL) on any one field in a collection. Setting TTL on partial unique index property is not supported. ¹                                                                    | No        |
| `EnablePartialUniqueIndex`          | Enables support for a unique partial index, so you have more flexibility to specify exactly which fields in documents you'd like to index. | No        |
| `EnableUniqueIndexReIndex` | Enables support for unique index re-indexing for Cosmos DB for MongoDB RU. ¹  | No |

> [!NOTE]
>
> ¹ This capability cannot be enabled on an Azure Cosmos DB for MongoDB accounts with continuous backup.
>

## Enable a capability

1. Retrieve your existing account capabilities by using [az cosmosdb show](/cli/azure/cosmosdb#az-cosmosdb-show):

   ```azurecli-interactive
   az cosmosdb show \
       --resource-group <azure_resource_group> \
       --name <azure_cosmos_db_account_name>
   ```

   You should see a capability section that's similar to this example output:

   ```json
   "capabilities": [
     {
       "name": "EnableMongo"
     }
   ]
   ```

   Review the default capability. In this example, the only capability that's set is `EnableMongo`.

1. Set the new capability on your database account. The list of capabilities should include the list of previously enabled capabilities that you want to keep.

    Only explicitly named capabilities are set on your account. For example, if you want to add the `DisableRateLimitingResponses` capability to the preceding example, use the [az cosmosdb update](/cli/azure/cosmosdb#az-cosmosdb-update) command with the `--capabilities` parameter, and list all capabilities that you want to have in your account:

   ```azurecli-interactive
   az cosmosdb update \
       --resource-group <azure_resource_group> \
       --name <azure_cosmos_db_account_name> \
       --capabilities EnableMongo DisableRateLimitingResponses
   ```

   > [!IMPORTANT]
   > The list of capabilities must always specify *all* capabilities that you want to enable, inclusively. This includes capabilities that are already enabled for the account that you want to keep. In this example, the `EnableMongo` capability was already enabled, so you must specify both the `EnableMongo` capability and the `DisableRateLimitingResponses` capability.

   > [!TIP]
   > If you're using PowerShell and an error message appears when you use the preceding command, instead try using a PowerShell array to list the capabilities:
   >
   > ```azurecli
   > az cosmosdb update \
   >     --resource-group <azure_resource_group> \
   >     --name <azure_cosmos_db_account_name> \
   >     --capabilities @("EnableMongo","DisableRateLimitingResponses")
   > ```

## Disable a capability

1. Retrieve your existing account capabilities by using `az cosmosdb show`:

   ```azurecli-interactive
   az cosmosdb show \
       --resource-group <azure_resource_group> \
       --name <azure_cosmos_db_account_name>
   ```

   You should see a capability section that's similar to this example output:

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

   Check for all capabilities that are currently set. In this example, two capabilities are set: `EnableMongo` and `DisableRateLimitingResponses`.

1. Remove one of the capabilities from your database account. The list of capabilities should include the list of previously enabled capabilities that you want to keep.

    Only explicitly named capabilities are set on your account. For example, if you want to remove the `DisableRateLimitingResponses` capability, you would use the `az cosmosdb update` command, and list the capability that you want to keep:

   ```azurecli-interactive
   az cosmosdb update \
       --resource-group <azure_resource_group> \
       --name <azure_cosmos_db_account_name> \
       --capabilities EnableMongo
   ```

   > [!TIP]
   > If you're using PowerShell and an error message appears when you use this command, instead try using a PowerShell array to list the capabilities:
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
  - If all you know is the number of vCores and servers in your existing database cluster, learn how to [estimate request units by using vCores or vCPUs](../convert-vcore-to-request-unit.md).
  - If you know typical request rates for your current database workload, learn how to [estimate request units by using the Azure Cosmos DB capacity planner](estimate-ru-capacity-planner.md).
