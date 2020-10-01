---
title: Connect to Azure Cosmos DB using HumongouS.io
description: Learn how to use HumongouS.io to store and manage data in Azure Cosmos DB.
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: how-to
ms.date: 09/29/2020
author: Assetou Diarrassouba
---

# Use HumongouS.io to connect to Azure Cosmos DB's API for MongoDB

[HumongouS.io](https://www.humongous.io/) is a modern and easy to use online MongoDB GUI.
It is commonly used to perform CRUD operations, create custom forms and views, import or export data or even create charts and dashboards.

Cosmos DB is Microsoft's globally distributed multi-model database service.
You can quickly create and query document, key/value, and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Cosmos DB.

Cosmos DB offers a MongoDB API which allows HumongouS.io to connect to it. Let’s see how we can do that with just a few simple steps.

## Pre-requisites

To connect to your Cosmos DB account using HumongouS.io, you must:

-   Create a [HumongouS.io](https://www.humongous.io/app/signup) account
-   Have your Cosmos DB [connection string](connect-mongodb-account.md) information

The first step is to head over to your Azure Cosmos DB portal and select your database.

:::image type="content" source="./media/humongous-io/select-cosmos-db.png" alt-text="Screenshot of Cosmos DB project":::

In the left pane of the database page, click the **Connection String** button.

:::image type="content" source="./media/humongous-io/cosmos-db-connection-string-button.png" alt-text="Screenshot of Cosmos DB connection string menu":::

Your database connection information should be displayed now.
Copy the content under PRIMARY CONNECTION STRING. It should look like this :

```
mongodb://hio:password@hio.mongo.cosmos.azure.com:10255/?ssl=true&appName=@hio@
```

:::image type="content" source="./media/humongous-io/cosmos-db-connection-string.png" alt-text="Screenshot of Cosmos DB connection string":::

Now that we have everything we need to get started, let's head over to [HumongouS.io project creation page](https://www.humongous.io/app/).

:::image type="content" source="./media/humongous-io/create-new-project.png" alt-text="Screenshot of Create HumongouS.io project":::

Paste the connection string you copied previously into the form field and click on the Create button.

That's it 👏! HumongouS.io will import your database and autmatically create your views, forms and dashboards. Relax 😌 and enjoy.
