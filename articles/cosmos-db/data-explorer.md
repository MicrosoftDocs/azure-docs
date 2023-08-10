---
title: Use Azure Cosmos DB Explorer to manage your data 
description: Learn about Azure Cosmos DB Explorer, a standalone web-based interface that allows you to view and manage the data stored in Azure Cosmos DB.
ms.service: cosmos-db
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 03/02/2023
ms.author: esarroyo
author: StefArroyo 
---

# Work with data using Azure Cosmos DB Explorer
[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

Azure Cosmos DB Explorer is a standalone web-based interface that allows you to view and manage the data stored in Azure Cosmos DB. Azure Cosmos DB Explorer is equivalent to the existing **Data Explorer** tab that is available in Azure portal when you create an Azure Cosmos DB account. The key advantages of Azure Cosmos DB Explorer over the existing Data explorer are:

- You have a full screen real-estate to view your data, run queries, stored procedures, triggers, and view their results.  
- You can provide read or read-write access to your database account and its collections to other users who don't have access to Azure portal or subscription.  
- You can share the query results with other users who don't have access to Azure portal or subscription.  

## Access Azure Cosmos DB Explorer

1. Sign in to [Azure portal](https://portal.azure.com/).

1. From **All resources**, find and navigate to your Azure Cosmos DB account, select **Keys**, and copy the **Primary Connection String**. You can select either:

   - **Read-write Keys**. When you share the Read-write primary connection string other users, they can view and modify the databases, collections, queries, and other resources associated with that specific account.
   - **Read-only Keys**. When you share the read-only primary connection string with other users, they can view the databases, collections, queries, and other resources associated with that specific account. For example, if you want to share results of a query with your teammates who don't have access to Azure portal or your Azure Cosmos DB account, you can provide them with this value.

1. Go to [https://cosmos.azure.com/](https://cosmos.azure.com/).

1. Select **Connect to your account with connection string**, paste the connection string, and select **Connect**.

To open Azure Cosmos DB Explorer from the Azure portal:

1. Select the **Data Explorer** in the left menu, then select **Open Full Screen**.

   :::image type="content" source="./media/data-explorer/open-data-explorer.png" alt-text="Screenshot shows Data Explorer page with Open Full Screen highlighted." lightbox="./media/data-explorer/open-data-explorer.png":::

1. In the **Open Full Screen** dialog, select **Open**.

## Known issues

Currently, viewing documents that contain a UUID isn't supported in Data Explorer. This limitation doesn't affect loading collections, only viewing individual documents or queries that include these documents. To view and manage these documents, users should continue to use the tool that was originally used to create these documents.

Customers receiving HTTP-401 errors may be due to insufficient Azure RBAC permissions for your Azure account, particularly if the account has a custom role. Any custom roles must have `Microsoft.DocumentDB/databaseAccounts/listKeys/*` action to use Data Explorer if signing in using their Azure Active Directory credentials.

## Next steps

Now that you've learned how to get started with Azure Cosmos DB Explorer to manage your data, next you can:

- [Getting started with queries](nosql/query/getting-started.md)
- [Stored procedures, triggers, and user-defined functions](stored-procedures-triggers-udfs.md)
