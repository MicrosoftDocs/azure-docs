---
title: Create a profile app with Node.js using the API for Cassandra
description: This quickstart shows how to use the Azure Cosmos DB for Apache Cassandra to create a profile application with Node.js.
author: TheovanKraay
ms.author: thvankra
ms.service: cosmos-db
ms.subservice: apache-cassandra
ms.devlang: javascript
ms.topic: quickstart
ms.date: 02/10/2021
ms.custom: devx-track-js, mode-api, kr2b-contr-experiment, ignite-2022
---
# Quickstart: Build a Cassandra app with Node.js SDK and Azure Cosmos DB
[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

> [!div class="op_single_selector"]
> * [.NET](manage-data-dotnet.md)
> * [.NET Core](manage-data-dotnet-core.md)
> * [Java v3](manage-data-java.md)
> * [Java v4](manage-data-java-v4-sdk.md)
> * [Node.js](manage-data-nodejs.md)
> * [Python](manage-data-python.md)
> * [Golang](manage-data-go.md)
>    

In this quickstart, you create an Azure Cosmos DB for Apache Cassandra account, and use a Cassandra Node.js app cloned from GitHub to create a Cassandra database and container. Azure Cosmos DB is a multi-model database service that lets you quickly create and query document, table, key-value, and graph databases with global distribution and horizontal scale capabilities.

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)] Alternatively, you can [Try Azure Cosmos DB for free](../try-free.md) without an Azure subscription, free of charge and commitments.

In addition, you need:

* [Node.js](https://nodejs.org/dist/v0.10.29/x64/node-v0.10.29-x64.msi) version v0.10.29 or higher
* [Git](https://git-scm.com/)

## Create a database account

Before you can create a document database, you need to create a Cassandra account with Azure Cosmos DB.

[!INCLUDE [cosmos-db-create-dbaccount-cassandra](../includes/cosmos-db-create-dbaccount-cassandra.md)]

## Clone the sample application

Clone a API for Cassandra app from GitHub, set the connection string, and run it.

1. Open a Command Prompt window. Create a new folder named `git-samples`. Then, close the window.

    ```cmd
    md "C:\git-samples"
    ```

1. Open a git terminal window, such as git bash. Use the `cd` command to change to the new folder to install the sample app.

    ```bash
    cd "C:\git-samples"
    ```

1. Run the following command to clone the sample repository. This command creates a copy of the sample app on your computer.

    ```bash
    git clone https://github.com/Azure-Samples/azure-cosmos-db-cassandra-nodejs-getting-started.git
    ```

1. Install the Node.js dependencies with `npm`.

    ```bash
    npm install
    ```

## Review the code

This step is optional. If you're interested to learn how the code creates the database resources, you can review the following snippets. The snippets are all taken from the `uprofile.js` file in the `C:\git-samples\azure-cosmos-db-cassandra-nodejs-getting-started` folder. Otherwise, skip ahead to [Update your connection string](#update-your-connection-string).

* The username and password values were set using the connection string page in the Azure portal.

   ```javascript
    let authProvider = new cassandra.auth.PlainTextAuthProvider(
        config.username,
        config.password
    );
   ```

* The `client` is initialized with contactPoint information. The contactPoint is retrieved from the Azure portal.

    ```javascript
    let client = new cassandra.Client({
        contactPoints: [`${config.contactPoint}:10350`],
        authProvider: authProvider,
        localDataCenter: config.localDataCenter,
        sslOptions: {
            secureProtocol: "TLSv1_2_method"
        },
    });
    ```

* The `client` connects to the Azure Cosmos DB for Apache Cassandra.

    ```javascript
    client.connect();
    ```

* A new keyspace is created.

    ```javascript
    var query =
        `CREATE KEYSPACE IF NOT EXISTS ${config.keySpace} WITH replication = {'class': 'NetworkTopologyStrategy', 'datacenter' : '1' }`;
    await client.execute(query);
  }
    ```

* A new table is created.

   ```javascript
    query =
        `CREATE TABLE IF NOT EXISTS ${config.keySpace}.user (user_id int PRIMARY KEY, user_name text, user_bcity text)`;
    await client.execute(query);
   },
   ```

* Key/value entities are inserted.

    ```javascript
    const arr = [
        `INSERT INTO  ${config.keySpace}.user (user_id, user_name , user_bcity) VALUES (1, 'AdrianaS', 'Seattle')`,
        `INSERT INTO  ${config.keySpace}.user (user_id, user_name , user_bcity) VALUES (2, 'JiriK', 'Toronto')`,
        `INSERT INTO  ${config.keySpace}.user (user_id, user_name , user_bcity) VALUES (3, 'IvanH', 'Mumbai')`,
        `INSERT INTO  ${config.keySpace}.user (user_id, user_name , user_bcity) VALUES (4, 'IvanH', 'Seattle')`,
        `INSERT INTO  ${config.keySpace}.user (user_id, user_name , user_bcity) VALUES (5, 'IvanaV', 'Belgaum')`,
        `INSERT INTO  ${config.keySpace}.user (user_id, user_name , user_bcity) VALUES (6, 'LiliyaB', 'Seattle')`,
        `INSERT INTO  ${config.keySpace}.user (user_id, user_name , user_bcity) VALUES (7, 'JindrichH', 'Buenos Aires')`,
        `INSERT INTO  ${config.keySpace}.user (user_id, user_name , user_bcity) VALUES (8, 'AdrianaS', 'Seattle')`,
        `INSERT INTO  ${config.keySpace}.user (user_id, user_name , user_bcity) VALUES (9, 'JozefM', 'Seattle')`,
    ];
    for (const element of arr) {
        await client.execute(element);
    }
    ```

* Query to get all key values.

    ```javascript
    query = `SELECT * FROM ${config.keySpace}.user`;
    const resultSelect = await client.execute(query);

    for (const row of resultSelect.rows) {
        console.log(
            "Obtained row: %d | %s | %s ",
            row.user_id,
            row.user_name,
            row.user_bcity
        );
    }
    ```  

* Query to get a key-value.

    ```javascript
    query = `SELECT * FROM ${config.keySpace}.user where user_id=1`;
    const resultSelectWhere = await client.execute(query);

    for (const row of resultSelectWhere.rows) {
        console.log(
            "Obtained row: %d | %s | %s ",
            row.user_id,
            row.user_name,
            row.user_bcity
        );
    }
    ```  

* Close connection.

    ```javascript
    client.shutdown();
    ```  

## Update your connection string

Go to the Azure portal to get your connection string information and copy it into the app. The connection string enables your app to communicate with your hosted database.

1. In your Azure Cosmos DB account in the [Azure portal](https://portal.azure.com/), select **Connection String**.

1. Use the :::image type="icon" source="./media/manage-data-nodejs/copy.png"::: button on the right side of the screen to copy the top value, **CONTACT POINT**.

    :::image type="content" source="./media/manage-data-nodejs/keys.png" alt-text="Screenshot showing how to view and copy the CONTACT POINT, USERNAME,and PASSWORD from the Connection String page.":::

1. Open the *config.js* file.

1. Paste the **CONTACT POINT** value from the portal over `CONTACT-POINT` on line 9.

    Line 9 should now look similar to this value:

    `contactPoint: "cosmos-db-quickstarts.cassandra.cosmosdb.azure.com",`

1. Copy the **USERNAME** value from the portal and paste it over `<FillMEIN>` on line 2.

    Line 2 should now look similar to this value:

    `username: 'cosmos-db-quickstart',`

1. Copy the **PASSWORD** value from the portal and paste it over `USERNAME` on line 8.

    Line 8 should now look similar to this value:

    `password: '2Ggkr662ifxz2Mg==',`

1. Replace **REGION** with the Azure region you created this resource in.

1. Save the *config.js* file.

## Run the Node.js app

1. In the bash terminal window, ensure you are in the sample directory you cloned earlier:

    ```bash
    cd azure-cosmos-db-cassandra-nodejs-getting-started
    ```

1. Run your node application:

    ```bash
    npm start
    ```

1. Verify the results as expected from the command line.

    :::image type="content" source="./media/manage-data-nodejs/output.png" alt-text="Screenshot shows a Command Prompt window where you can view and verify the output.":::

    Press **Ctrl**+**C** to stop the program and close the console window.

1. In the Azure portal, open **Data Explorer** to query, modify, and work with this new data.

    :::image type="content" source="./media/manage-data-nodejs/data-explorer.png" alt-text="Screenshot shows the Data Explorer page, where you can view the data.":::

## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../includes/cosmos-db-tutorial-review-slas.md)]

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../includes/cosmos-db-delete-resource-group.md)]

## Next steps

In this quickstart, you learned how to create an Azure Cosmos DB account with API for Cassandra, and run a Cassandra Node.js app that creates a Cassandra database and container. You can now import more data into your Azure Cosmos DB account.

> [!div class="nextstepaction"]
> [Import Cassandra data into Azure Cosmos DB](migrate-data.md)
