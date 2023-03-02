---
title: 'Quickstart: API for Cassandra with CQLSH - Azure Cosmos DB'
description: This quickstart shows how to use the Azure Cosmos DB's API for Apache Cassandra to create a profile application using CQLSH.
author: iriaosara
ms.author: iriaosara
ms.service: cosmos-db
ms.subservice: apache-cassandra
ms.topic: quickstart
ms.date: 01/24/2022
ms.custom: template-quickstart, ignite-2022
---


# Quickstart: Build a Cassandra app with CQLSH and Azure Cosmos DB
[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

> [!div class="op_single_selector"]
> * [.NET](manage-data-dotnet.md)
> * [.NET Core](manage-data-dotnet-core.md)
> * [Java v3](manage-data-java.md)
> * [Java v4](manage-data-java-v4-sdk.md)
> * [Node.js](manage-data-nodejs.md)
> * [Python](manage-data-python.md)
> * [Golang](manage-data-go.md)

In this quickstart, you create an Azure Cosmos DB for Apache Cassandra account, and use CQLSH to create a Cassandra database and container. Azure Cosmos DB is a multi-model database service that lets you quickly create and query document, table, key-value, and graph databases with global distribution and horizontal scale capabilities.


## Prerequisites
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio). Or [try Azure Cosmos DB for free](../try-free.md) without an Azure subscription.

## Create a database account

Before you can create a document database, you need to create a Cassandra account with Azure Cosmos DB.

[!INCLUDE [cosmos-db-create-dbaccount-cassandra](../includes/cosmos-db-create-dbaccount-cassandra.md)]

## Install standalone CQLSH tool

Refer to [CQL shell](support.md#cql-shell) on steps on how to launch a standalone cqlsh tool.


## Update your connection string

Now go back to the Azure portal to get your connection string information and copy it into the app. The connection string details enable your app to communicate with your hosted database.

1. In your Azure Cosmos DB account in the [Azure portal](https://portal.azure.com/), select **Connection String**. 

    :::image type="content" source="./media/manage-data-java/copy-username-connection-string-azure-portal.png" alt-text="View and copy a username from the Azure portal, Connection String page":::

2. Use the :::image type="icon" source="./media/manage-data-java/copy-button-azure-portal.png"::: button on the right side of the screen to copy the USERNAME and  PASSWORD value. 

3. In your terminal, set the SSL variables:
    ```bash
    # Export the SSL variables:
    export SSL_VERSION=TLSv1_2
    export SSL_VALIDATE=false
    ```

4. Connect to Azure Cosmos DB for Apache Cassandra:
    - Paste the USERNAME and PASSWORD value into the command.
    ```sql
    cqlsh <USERNAME>.cassandra.cosmos.azure.com 10350 -u <USERNAME> -p <PASSWORD> --ssl --protocol-version=4
    ```


## CQL commands to create and run an app
- Create keyspace
```sql
CREATE KEYSPACE IF NOT EXISTS uprofile 
WITH REPLICATION = { 'class' : 'NetworkTopologyStrategy', 'datacenter1' : 1 };
```
- Create a table
```sql
CREATE TABLE IF NOT EXISTS uprofile.user (user_id int PRIMARY KEY, user_name text, user_bcity text);
```
- Insert a row into user table
```sql
INSERT INTO  uprofile.user (user_id, user_name, user_bcity) VALUES (101,'johnjoe','New York')
```
You can also insert data using the COPY command.
```sql
COPY uprofile.user(user_id, user_name, user_bcity) FROM '/path to file/fileName.csv' 
WITH DELIMITER = ',' ;
``` 
- Query the user table
```sql
SELECT * FROM uprofile.users;
```

In the Azure portal, open **Data Explorer** to query, modify, and work with this new data. 
    :::image type="content" source="./media/manage-data-java/view-data-explorer-java-app.png" alt-text="View the data in Data Explorer - Azure Cosmos DB":::


## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../includes/cosmos-db-tutorial-review-slas.md)]

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../includes/cosmos-db-delete-resource-group.md)]

## Next steps

In this quickstart, you learned how to create an Azure Cosmos DB account with API for Cassandra using CQLSH that creates a Cassandra database and container. You can now import additional data into your Azure Cosmos DB account. 

> [!div class="nextstepaction"]
> [Import Cassandra data into Azure Cosmos DB](migrate-data.md)
