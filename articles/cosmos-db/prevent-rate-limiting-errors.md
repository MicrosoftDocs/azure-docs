---
title: Prevent rate-limiting errors for Azure Cosmos DB API for MongoDB operations.
description: Learn how to prevent your Azure Cosmos DB API for MongoDB operations from hitting rate limiting errors with the SSR (server side retry) feature. 
author: gahl-levy
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: how-to
ms.date: 01/13/2021
ms.author: gahllevy
---

# Prevent rate-limiting errors for Azure Cosmos DB API for MongoDB operations
[!INCLUDE[appliesto-mongodb-api](includes/appliesto-mongodb-api.md)]

Azure Cosmos DB API for MongoDB operations may fail with rate-limiting (16500/429) errors if they exceed a collection's throughput limit (RUs). 

You can enable the Server Side Retry (SSR) feature and let the server retry these operations automatically. The requests are retried after a short delay for all collections in your account. This feature is a convenient alternative to handling rate-limiting errors in the client application.

## Use the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to your Azure Cosmos DB API for MongoDB account.

1. Go to the **Features** pane underneath the **Settings** section.

1. Select **Server Side Retry**.

1. Click **Enable** to enable this feature for all collections in your account.

:::image type="content" source="./media/prevent-rate-limiting-errors/portal-features-server-side-retry.png" alt-text="Screenshot of the server side retry feature for Azure Cosmos DB API for MongoDB":::

## Use the Azure CLI

1. Check if SSR is already enabled for your account:
```bash
az cosmosdb show --name accountname --resource-group resourcegroupname
```
2. **Enable** SSR for all collections in your database account. It may take up to 15min for this change to take effect.
```bash
az cosmosdb update --name accountname --resource-group resourcegroupname --capabilities EnableMongo DisableRateLimitingResponses
```
The following command will **Disable** SSR for all collections in your database account by removing "DisableRateLimitingResponses" from the capabilities list. It may take up to 15min for this change to take effect.
```bash
az cosmosdb update --name accountname --resource-group resourcegroupname --capabilities EnableMongo
```

## Frequently Asked Questions
* How are requests retried?
    * Requests are retried continuously (over and over again) until a 60-second timeout is reached. If the timeout is reached, the client will receive an [ExceededTimeLimit exception (50)](mongodb-troubleshoot.md).
*  How can I monitor the effects of SSR?
    *  You can view the rate limiting errors (429s) that are retried server-side in the Cosmos DB Metrics pane. Keep in mind that these errors don't go to the client when SSR is enabled, since they are handled and retried server-side. 
    *  You can search for log entries containing "estimatedDelayFromRateLimitingInMilliseconds" in your [Cosmos DB resource logs](cosmosdb-monitor-resource-logs.md).
*  Will SSR affect my consistency level?
    *  SSR does not affect a request's consistency. Requests are retried server-side if they are rate limited (with a 429 error). 
*  Does SSR affect any type of error that my client might receive?
    *  No, SSR only affects rate limiting errors (429s) by retrying them server-side. This feature prevents you from having to handle rate-limiting errors in the client application. All [other errors](mongodb-troubleshoot.md) will go to the client. 

## Next steps

To learn more about troubleshooting common errors, see this article:

* [Troubleshoot common issues in Azure Cosmos DB's API for MongoDB](mongodb-troubleshoot.md)
