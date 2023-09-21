---
title: Prevent rate-limiting errors for Azure Cosmos DB for MongoDB operations.
description: Learn how to prevent your Azure Cosmos DB for MongoDB operations from hitting rate limiting errors with the SSR (server-side retry) feature. 
author: gahl-levy
ms.service: cosmos-db
ms.subservice: mongodb
ms.custom: ignite-2022, devx-track-azurecli
ms.topic: how-to
ms.date: 08/26/2021
ms.author: gahllevy
---

# Prevent rate-limiting errors for Azure Cosmos DB for MongoDB operations
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

Azure Cosmos DB for MongoDB operations may fail with rate-limiting (16500/429) errors if they exceed a collection's throughput limit (RUs). 

You can enable the Server Side Retry (SSR) feature and let the server retry these operations automatically. The requests are retried after a short delay for all collections in your account. This feature is a convenient alternative to handling rate-limiting errors in the client application.

## Use the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to your Azure Cosmos DB for MongoDB account.

1. Go to the **Features** pane underneath the **Settings** section.

1. Select **Server Side Retry**.

1. Click **Enable** to enable this feature for all collections in your account.

:::image type="content" source="./media/prevent-rate-limiting-errors/portal-features-server-side-retry.png" alt-text="Screenshot of the server-side retry feature for Azure Cosmos DB for MongoDB":::

## Use the Azure CLI

1. Check if SSR is already enabled for your account:

   ```azurecli-interactive
   az cosmosdb show --name accountname --resource-group resourcegroupname
   ```

1. **Enable** SSR for all collections in your database account. It may take up to 15 min for this change to take effect.

   ```azurecli-interactive
   az cosmosdb update --name accountname --resource-group resourcegroupname --capabilities EnableMongo DisableRateLimitingResponses
   ```

1. The following command will **Disable** server-side retry for all collections in your database account by removing `DisableRateLimitingResponses` from the capabilities list. It may take up to 15 min for this change to take effect.

   ```azurecli-interactive
   az cosmosdb update --name accountname --resource-group resourcegroupname --capabilities EnableMongo
   ```

## Frequently asked questions

### How are requests retried?

Requests are retried continuously (over and over again) until a 60-second timeout is reached. If the timeout is reached, the client will receive an [ExceededTimeLimit exception (50)](error-codes-solutions.md).

### How can I monitor the effects of a server-side retry?

You can view the rate limiting errors (429) that are retried server-side in the Azure Cosmos DB Metrics pane. Keep in mind that these errors don't go to the client when SSR is enabled, since they are handled and retried server-side.

You can search for log entries containing *estimatedDelayFromRateLimitingInMilliseconds* in your [Azure Cosmos DB resource logs](../monitor-resource-logs.md).

### Will server-side retry affect my consistency level?

server-side retry does not affect a request's consistency. Requests are retried server-side if they are rate limited (with a 429 error).

### Does server-side retry affect any type of error that my client might receive?

No, server-side retry only affects rate limiting errors (429) by retrying them server-side. This feature prevents you from having to handle rate-limiting errors in the client application. All [other errors](error-codes-solutions.md) will go to the client.

## Next steps

To learn more about troubleshooting common errors, see this article:

* [Troubleshoot common issues in Azure Cosmos DB's API for MongoDB](error-codes-solutions.md)

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
* If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
* If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-capacity-planner.md)
