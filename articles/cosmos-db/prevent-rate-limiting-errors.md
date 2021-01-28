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


## Next steps

To learn more about troubleshooting common errors, see this article:

* [Troubleshoot common issues in Azure Cosmos DB's API for MongoDB](mongodb-troubleshoot.md)
