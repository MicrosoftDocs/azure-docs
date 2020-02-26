---
title: 'Quickstart: Use Node.js to query from Azure Cosmos DB SQL API account'
description: How to use Node.js to create an app that connects to Azure Cosmos DB SQL API account and queries data. 
author: deborahc
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: nodejs
ms.topic: quickstart
ms.date: 11/19/2019
ms.author: dech

---
# Quickstart: Use Node.js to connect and query data from Azure Cosmos DB SQL API account

> [!div class="op_single_selector"]
> * [.NET V3](create-sql-api-dotnet.md)
> * [.NET V4](create-sql-api-dotnet-V4.md)
> * [Java](create-sql-api-java.md)
> * [Node.js](create-sql-api-nodejs.md)
> * [Python](create-sql-api-python.md)
> * [Xamarin](create-sql-api-xamarin-dotnet.md)

In this quickstart, you create and manage an Azure Cosmos DB SQL API account from the Azure portal, and by using a Node.js app cloned from GitHub. Azure Cosmos DB is a multi-model database service that lets you quickly create and query document, table, key-value, and graph databases with global distribution and horizontal scale capabilities.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio). Or [try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) without an Azure subscription. You can also use the [Azure Cosmos DB Emulator](https://aka.ms/cosmosdb-emulator) with a URI of `https://localhost:8081` and the key `C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==`.
- [Node.js 6.0.0+](https://nodejs.org/).
- [Git](https://www.git-scm.com/downloads).

## Create a database 

[!INCLUDE [cosmos-db-create-dbaccount](../../includes/cosmos-db-create-dbaccount.md)]

## Add a container

[!INCLUDE [cosmos-db-create-collection](../../includes/cosmos-db-create-collection.md)]

## Add sample data

[!INCLUDE [cosmos-db-create-sql-api-add-sample-data](../../includes/cosmos-db-create-sql-api-add-sample-data.md)]

## Query your data

[!INCLUDE [cosmos-db-create-sql-api-query-data](../../includes/cosmos-db-create-sql-api-query-data.md)]

## Clone the sample application

Now let's clone a Node.js app from GitHub, set the connection string, and run it.

1. Open a command prompt, create a new folder named git-samples, then close the command prompt.

    ```bash
    md "C:\git-samples"
    ```

2. Open a git terminal window, such as git bash, and use the `cd` command to change to the new folder to install the sample app.

    ```bash
    cd "C:\git-samples"
    ```

3. Run the following command to clone the sample repository. This command creates a copy of the sample app on your computer.

    ```bash
    git clone https://github.com/Azure-Samples/azure-cosmos-db-sql-api-nodejs-getting-started.git
    ```

## Review the code

This step is optional. If you're interested in learning how the Azure Cosmos database resources are created in the code, you can review the following snippets. Otherwise, you can skip ahead to [Update your connection string](#update-your-connection-string). 

If you're familiar with the previous version of the SQL JavaScript SDK, you may be used to seeing the terms *collection* and *document*. Because Azure Cosmos DB supports [multiple API models](introduction.md), [version 2.0+ of the JavaScript SDK](https://www.npmjs.com/package/@azure/cosmos) uses the generic terms *container*, which may be a collection, graph, or table, and *item* to describe the content of the container.

The following snippets are all taken from the *app.js* file.

* The `CosmosClient` object is initialized.

    ```javascript
    const client = new CosmosClient({ endpoint, key });
    ```

* Create a new Azure Cosmos database.

    ```javascript
    const { database } = await client.databases.createIfNotExists({ id: databaseId });
    ```

* A new container (collection) is created within the database.

    ```javascript
    const { container } = await client.database(databaseId).containers.createIfNotExists({ id: containerId });
    ```

* An item (document) is created.

    ```javascript
    const { item } = await client.database(databaseId).container(containerId).items.create(itemBody);
    ```

* A SQL query over JSON is performed on the family database. The query returns all the children of the "Anderson" family. 

    ```javascript
	  const querySpec = {
		query: 'SELECT VALUE r.children FROM root r WHERE r.lastName = @lastName',
		parameters: [
		  {
			name: '@lastName',
			value: 'Andersen'
		  }
		]
	  }

	  const { resources: results } = await client
		.database(databaseId)
		.container(containerId)
		.items.query(querySpec)
		.fetchAll()
	  for (var queryResult of results) {
		let resultString = JSON.stringify(queryResult)
		console.log(`\tQuery returned ${resultString}\n`)
	  }
    ```    

## Update your connection string

Now go back to the Azure portal to get the connection string details of your Azure Cosmos account. Copy the connection string into the app so that it can connect to your database.

1. In your Azure Cosmos DB account in the [Azure portal](https://portal.azure.com/), select **Keys** from the left navigation, and then select **Read-write Keys**. Use the copy buttons on the right side of the screen to copy the URI and Primary Key into the *config.js* file in the next step.

    ![View and copy an access key in the Azure portal, Keys blade](./media/create-sql-api-dotnet/keys.png)

2. In Open the *config.js* file. 

3. Copy your URI value from the portal (using the copy button) and make it the value of the endpoint key in *config.js*. 

    `config.endpoint = "<Your Azure Cosmos account URI>"`

4. Then copy your PRIMARY KEY value from the portal and make it the value of the `config.key` in *config.js*. You've now updated your app with all the info it needs to communicate with Azure Cosmos DB. 

    `config.key = "<Your Azure Cosmos account key>"`
    
## Run the app

1. Run `npm install` in a terminal to install required npm modules

2. Run `node app.js` in a terminal to start your node application.

You can now go back to Data Explorer, modify, and work with this new data.

## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../../includes/cosmos-db-tutorial-review-slas.md)]

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../../includes/cosmos-db-delete-resource-group.md)]

## Next steps

In this quickstart, you've learned how to create an Azure Cosmos DB account, create a container using the Data Explorer, and run a Node.js app. You can now import additional data to your Azure Cosmos DB account. 

> [!div class="nextstepaction"]
> [Import data into Azure Cosmos DB](import-data.md)


