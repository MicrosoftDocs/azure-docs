---
title: Prevent rate-limiting errors for Azure Cosmos DB for Apache Cassandra.
description: Prevent your Azure Cosmos DB for Apache Cassandra operations from hitting rate limiting errors with the SSR (server-side retry) feature
author: dileepraotv-github
ms.service: cosmos-db
ms.subservice: apache-cassandra
ms.custom: ignite-2022, devx-track-azurecli
ms.topic: how-to
ms.date: 10/11/2021
ms.author: turao
---

# Prevent rate-limiting errors for Azure Cosmos DB for Apache Cassandra operations
[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

The cost of all database operations is normalized by Azure Cosmos DB and is expressed by Request Units (RU). Request unit is a performance currency abstracting the system resources such as CPU, IOPS, and memory that are required to perform the database operations supported by Azure Cosmos DB.

Azure Cosmos DB for Apache Cassandra operations may fail with rate-limiting (OverloadedException/429) errors if they exceed a table’s throughput limit (RUs). This can be handled by client side as described [here](scale-account-throughput.md#handling-rate-limiting-429-errors). If the client retry policy cannot be implemented to handle the failure due to rate limiting error, then we can make use of the Server-side retry (SSR) feature where operations that exceed a table’s throughput limit will be retried automatically after a short delay. This is an account level setting and applies to all Key spaces and Tables in the account.

## Use the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Navigate to your Azure Cosmos DB for Apache Cassandra account.

3. Go to the **Features** pane underneath the **Settings** section.

4. Select **Server-Side Retry**.

5. Click **Enable** to enable this feature for all collections in your account.

:::image type="content" source="./media/prevent-rate-limiting-errors/prevent-rate-limiting-errors.png" alt-text="Screenshot of the server-side retry feature for Azure Cosmos DB for Apache Cassandra":::

## Use the Azure CLI

1. Check if SSR is already enabled for your account:

   ```azurecli-interactive
   az cosmosdb show --name accountname --resource-group resourcegroupname
   ```

2. **Enable** SSR for all tables in your database account. It may take up to 15 min for this change to take effect.

   ```azurecli-interactive
   az cosmosdb update --name accountname --resource-group resourcegroupname --capabilities EnableCassandra DisableRateLimitingResponses
   ```

3. The following command will **Disable** server-side retry for all tables in your database account by removing `DisableRateLimitingResponses` from the capabilities list. It may take up to 15 min for this change to take effect.

   ```azurecli-interactive
   az cosmosdb update --name accountname --resource-group resourcegroupname --capabilities EnableCassandra
   ```

## Frequently asked questions

### How are requests retried?

Requests are retried continuously (over and over again) until a 60-second timeout is reached. If the timeout is reached, the client will receive read or write timeout error accordingly

### When is SSR most beneficial?

Server-side retry (SSR) is most beneficial when there is a sudden spike for a short duration of less than 1 minute where in throttling errors can be avoided. If the work load has increased and would stay constantly above the specified RU, then SSR will not help much. The suggestion is to increase the RU appropriately.

### Suggested client-side settings?

After SSR is enabled, the client app should increase read timeout beyond the server retry 60-second setting. We recommend 90 seconds to be on the safer side.

Code Sample Driver3
```java
SocketOptions socketOptions = new SocketOptions()
	.setReadTimeoutMillis(90000); 
```
Code Sample Driver4  
```java
ProgrammaticDriverConfigLoaderBuilder configBuilder = DriverConfigLoader.programmaticBuilder()
	.withDuration(DefaultDriverOption.REQUEST_TIMEOUT, Duration.ofSeconds(90)); 
```

### How can I monitor the effects of a server-side retry?

You can view the rate limiting errors (429) that are retried server-side in the Azure Cosmos DB Metrics pane. These errors don't go to the client when SSR is enabled, since they are handled and retried server-side.

You can search for log entries containing *estimatedDelayFromRateLimitingInMilliseconds* in your [Azure Cosmos DB resource logs](../monitor-resource-logs.md).

### Will server-side retry affect my consistency level?

Server-side retry does not affect a consistency levels. Requests are retried server-side if they are rate limited (Error 429).

### Does server-side retry affect any type of error that my client might receive?

No, server-side retry only affects rate limiting errors (429) by retrying them server-side. This feature prevents you from having to handle rate-limiting errors in the client application. All [other errors](troubleshoot-common-issues.md) will go to the client.

## Next steps

To learn more about troubleshooting common errors, see this article:

* [Troubleshoot common issues in Azure Cosmos DB's API for Cassandra](troubleshoot-common-issues.md)


See the following articles to learn about throughput provisioning in Azure Cosmos DB:

* [Request units and throughput in Azure Cosmos DB](../request-units.md)
* [Provision throughput on containers and databases](how-to-provision-throughput.md) 
* [Partition key best practices](partitioning.md)
