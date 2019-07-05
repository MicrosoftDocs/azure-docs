---
title: Node.js tutorial for the SQL API for Azure Cosmos DB
description: A Node.js tutorial that demonstrates how to connect to and query Azure Cosmos DB using the SQL API
author: deborahc
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: nodejs
ms.topic: tutorial
ms.date: 06/05/2019
ms.author: dech
Customer intent: As a developer, I want to build a Node.js console application to access and manage SQL API account resources in Azure Cosmos DB, so that customers can better use the service.

---
# Tutorial: Build a Node.js console app with the JavaScript SDK to manage Azure Cosmos DB SQL API data

> [!div class="op_single_selector"]
> * [.NET](sql-api-get-started.md)
> * [.NET (Preview)](sql-api-dotnet-get-started-preview.md)
> * [.NET Core](sql-api-dotnetcore-get-started.md)
> * [.NET Core (Preview)](sql-api-dotnet-core-get-started-preview.md)
> * [Java](sql-api-java-get-started.md)
> * [Async Java](sql-api-async-java-get-started.md)
> * [Node.js](sql-api-nodejs-get-started.md)
> 

As a developer, you might have applications that use NoSQL document data. You can use a SQL API account in Azure Cosmos DB to store and access this document data. This tutorial shows you how to build a Node.js console application to create Azure Cosmos DB resources and query them.

In this tutorial, you will:

> [!div class="checklist"]
> * Create and connect to an Azure Cosmos DB account.
> * Set up your application.
> * Create a database.
> * Create a container.
> * Add items to the container.
> * Perform basic operations on the items, container, and database.

## Prerequisites 

Make sure you have the following resources:

* An active Azure account. If you don't have one, you can sign up for a [Free Azure Trial](https://azure.microsoft.com/pricing/free-trial/). 

  [!INCLUDE [cosmos-db-emulator-docdb-api](../../includes/cosmos-db-emulator-docdb-api.md)]

* [Node.js](https://nodejs.org/) v6.0.0 or higher.

## Create Azure Cosmos DB account

Let's create an Azure Cosmos DB account. If you already have an account you want to use, you can skip ahead to [Set up your Node.js application](#SetupNode). If you are using the Azure Cosmos DB Emulator, follow the steps at [Azure Cosmos DB Emulator](local-emulator.md) to set up the emulator and skip ahead to [Set up your Node.js application](#SetupNode). 

[!INCLUDE [cosmos-db-create-dbaccount](../../includes/cosmos-db-create-dbaccount.md)]

## <a id="SetupNode"></a>Set up your Node.js application

Before you start writing code to build the application, you can build the framework for your app. Run the following steps to set up your Node.js application that has the framework code:

1. Open your favorite terminal.
2. Locate the folder or directory where you'd like to save your Node.js application.
3. Create two empty JavaScript files with the following commands:

   * Windows:
     * ```fsutil file createnew app.js 0```
     * ```fsutil file createnew config.js 0```

   * Linux/OS X:
     * ```touch app.js```
     * ```touch config.js```

4. Create and initialize a `package.json` file. Use the following command:
   * ```npm init -y```

5. Install the @azure/cosmos module via npm. Use the following command:
   * ```npm install @azure/cosmos --save```

## <a id="Config"></a>Set your app's configurations

Now that your app exists, you need to make sure it can talk to Azure Cosmos DB. By updating a few configuration settings, as shown in the following steps, you can set your app to talk to Azure Cosmos DB:

1. Open ```config.js``` in your favorite text editor.

1. Copy and paste the code snippet below and set properties ```config.endpoint``` and ```config.primaryKey``` to your Azure Cosmos DB endpoint URI and primary key. Both these configurations can be found in the [Azure portal](https://portal.azure.com).

   ![Get keys from Azure portal screenshot][keys]

   ```javascript
   // ADD THIS PART TO YOUR CODE
   var config = {}

   config.endpoint = "~your Azure Cosmos DB endpoint uri here~";
   config.primaryKey = "~your primary key here~";
   ``` 

1. Copy and paste the ```database```, ```container```, and ```items``` data to your ```config``` object below where you set your ```config.endpoint``` and ```config.primaryKey``` properties. If you already have data you'd like to store in your database, you can use the Data Migration tool in Azure Cosmos DB rather than defining the data here. You config.js file should have the following code:

   [!code-javascript[nodejs-get-started](~/cosmosdb-nodejs-get-started/config.js)]

   JavaScript SDK uses the generic terms *container* and *item*. A container can be a collection, graph, or table. An item can be a document, edge/vertex, or row, and is the content inside a container. 
   
   `module.exports = config;` code isused to export your ```config``` object, so that you can reference it within the ```app.js``` file.

## <a id="Connect"></a>Connect to an Azure Cosmos DB account

1. Open your empty ```app.js``` file in the text editor. Copy and paste the code below to import the ```@azure/cosmos``` module and your newly created ```config``` module.

   ```javascript
   // ADD THIS PART TO YOUR CODE
   const CosmosClient = require('@azure/cosmos').CosmosClient;

   const config = require('./config');
   ```

1. Copy and paste the code to use the previously saved ```config.endpoint``` and ```config.primaryKey``` to create a new CosmosClient.

   ```javascript
   const config = require('./config');

   // ADD THIS PART TO YOUR CODE
   const endpoint = config.endpoint;
   const masterKey = config.primaryKey;

   const client = new CosmosClient({ endpoint: endpoint, auth: { masterKey: masterKey } });
   ```
   
> [!Note]
> If connecting to the **Cosmos DB Emulator**, disable SSL verification by creating a custom connection Policy.
>   ```
>   const connectionPolicy = new cosmos.ConnectionPolicy ()
>   connectionPolicy.DisableSSLVerification = true
>
>   const client = new CosmosClient({ endpoint: endpoint, auth: { masterKey: masterKey }, connectionPolicy });
>   ```

Now that you have the code to initialize the Azure Cosmos DB client, let's take a look at how to work with Azure Cosmos DB resources.

## Create a database

1. Copy and paste the code below to set the database ID, and the container ID. These IDs are how the Azure Cosmos DB client will find the right database and container.

   ```javascript
   const client = new CosmosClient({ endpoint: endpoint, auth: { masterKey: masterKey } });

   // ADD THIS PART TO YOUR CODE
   const HttpStatusCodes = { NOTFOUND: 404 };

   const databaseId = config.database.id;
   const containerId = config.container.id;
   const partitionKey = { kind: "Hash", paths: ["/Country"] };
   ```

   A database can be created by using either the `createIfNotExists` or create function of the **Databases** class. A database is the logical container of items partitioned across containers. 

2. Copy and paste the **createDatabase** and **readDatabase** methods into the app.js file under the ```databaseId``` and ```containerId``` definition. The **createDatabase** function will create a new database with id ```FamilyDatabase```, specified from the ```config``` object if it does not already exist. The **readDatabase** function will read the database's definition to ensure that the database exists.

   ```javascript
   /**
    * Create the database if it does not exist
    */
   async function createDatabase() {
       const { database } = await client.databases.createIfNotExists({ id: databaseId });
       console.log(`Created database:\n${database.id}\n`);
   }

   /**
   * Read the database definition
   */
   async function readDatabase() {
      const { body: databaseDefinition } = await client.database(databaseId).read();
      console.log(`Reading database:\n${databaseDefinition.id}\n`);
   }
   ```

3. Copy and paste the code below where you set the **createDatabase** and **readDatabase** functions to add the helper function **exit** that will print the exit message. 

   ```javascript
   // ADD THIS PART TO YOUR CODE
   function exit(message) {
      console.log(message);
      console.log('Press any key to exit');
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.on('data', process.exit.bind(process, 0));
   };
   ```

4. Copy and paste the code below where you set the **exit** function to call the **createDatabase** and **readDatabase** functions.

   ```javascript
   createDatabase()
     .then(() => readDatabase())
     .then(() => { exit(`Completed successfully`); })
     .catch((error) => { exit(`Completed with error \${JSON.stringify(error)}`) });
   ```

   At this point, your code in ```app.js``` should now look as following code:

   ```javascript
   const CosmosClient = require('@azure/cosmos').CosmosClient;

   const config = require('./config');

   const endpoint = config.endpoint;
   const masterKey = config.primaryKey;

   const client = new CosmosClient({ endpoint: endpoint, auth: { masterKey: masterKey } });

   const HttpStatusCodes = { NOTFOUND: 404 };

   const databaseId = config.database.id;
   const containerId = config.container.id;
   const partitionKey = { kind: "Hash", paths: ["/Country"] };

    /**
    * Create the database if it does not exist
    */
    async function createDatabase() {
     const { database } = await client.databases.createIfNotExists({ id: databaseId });
     console.log(`Created database:\n${database.id}\n`);
   }

   /**
   * Read the database definition
   */
   async function readDatabase() {
     const { body: databaseDefinition } = await client.database(databaseId).read();
    console.log(`Reading database:\n${databaseDefinition.id}\n`);
   }

   /**
   * Exit the app with a prompt
   * @param {message} message - The message to display
   */
   function exit(message) {
     console.log(message);
     console.log('Press any key to exit');
     process.stdin.setRawMode(true);
     process.stdin.resume();
     process.stdin.on('data', process.exit.bind(process, 0));
   }

   createDatabase()
     .then(() => readDatabase())
     .then(() => { exit(`Completed successfully`); })
     .catch((error) => { exit(`Completed with error ${JSON.stringify(error) }`) });
   ```

5. In your terminal, locate your ```app.js``` file and run the command: 

   ```bash 
   node app.js
   ```

## <a id="CreateContainer"></a>Create a container

Next create a container within the Azure Cosmos DB account, so that you can store and query the data. 

> [!WARNING]
> Creating a container has pricing implications. Visit our [pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/) so you know what to expect.

A container can be created by using either the `createIfNotExists` or create function from the **Containers** class.  A container consists of items (which in the case of the SQL API is JSON documents) and associated JavaScript application logic.

1. Copy and paste the **createContainer**  and **readContainer** function underneath the **readDatabase** function in the app.js file. The **createContainer** function will create a new container with the ```containerId``` specified from the ```config``` object if it does not already exist. The **readContainer** function will read the container definition to verify the container exists.

   ```javascript
   /**
   * Create the container if it does not exist
   */

   async function createContainer() {

    const { container } = await client.database(databaseId).containers.createIfNotExists({ id: containerId, partitionKey }, { offerThroughput: 400 });
    console.log(`Created container:\n${config.container.id}\n`);
   }

   /**
    * Read the container definition
   */
   async function readContainer() {
      const { body: containerDefinition } = await client.database(databaseId).container(containerId).read();
    console.log(`Reading container:\n${containerDefinition.id}\n`);
   }
   ```

1. Copy and paste the code underneath the call to **readDatabase** to execute the **createContainer** and **readContainer** functions.

   ```javascript
   createDatabase()
     .then(() => readDatabase())

     // ADD THIS PART TO YOUR CODE
     .then(() => createContainer())
     .then(() => readContainer())
     // ENDS HERE

     .then(() => { exit(`Completed successfully`); })
     .catch((error) => { exit(`Completed with error ${JSON.stringify(error)}`) });
   ```

   At this point, your code in ```app.js``` should now look like this:

   ```javascript
   const CosmosClient = require('@azure/cosmos').CosmosClient;

   const config = require('./config');

   const endpoint = config.endpoint;
   const masterKey = config.primaryKey;

   const client = new CosmosClient({ endpoint: endpoint, auth: { masterKey: masterKey } });

   const HttpStatusCodes = { NOTFOUND: 404 };

   const databaseId = config.database.id;
   const containerId = config.container.id;
   const partitionKey = { kind: "Hash", paths: ["/Country"] };

   /**
   * Create the database if it does not exist
   */
   async function createDatabase() {
     const { database } = await client.databases.createIfNotExists({ id: databaseId });
     console.log(`Created database:\n${database.id}\n`);
   }

   /**
   * Read the database definition
   */
   async function readDatabase() {
     const { body: databaseDefinition } = await client.database(databaseId).read();
     console.log(`Reading database:\n${databaseDefinition.id}\n`);
   }

   /**
   * Create the container if it does not exist
   */

   async function createContainer() {

    const { container } = await client.database(databaseId).containers.createIfNotExists({ id: containerId, partitionKey }, { offerThroughput: 400 });
    console.log(`Created container:\n${config.container.id}\n`);
   }

   /**
    * Read the container definition
   */
   async function readContainer() {
      const { body: containerDefinition } = await client.database(databaseId).container(containerId).read();
    console.log(`Reading container:\n${containerDefinition.id}\n`);
   }

   /**
   * Exit the app with a prompt
   * @param {message} message - The message to display
   */
   function exit(message) {
     console.log(message);
     console.log('Press any key to exit');
     process.stdin.setRawMode(true);
     process.stdin.resume();
     process.stdin.on('data', process.exit.bind(process, 0));
   }

   createDatabase()
     .then(() => readDatabase())
     .then(() => createContainer())
     .then(() => readContainer())
     .then(() => { exit(`Completed successfully`); })
     .catch((error) => { exit(`Completed with error ${JSON.stringify(error)}`) });
   ```

1. In your terminal, locate your ```app.js``` file and run the command: 

   ```bash 
   node app.js
   ```

## <a id="CreateItem"></a>Create an item

An item can be created by using the create function of the **Items** class. When you're using the SQL API, items are projected as documents, which are user-defined (arbitrary) JSON content. You can now insert an item into Azure Cosmos DB.

1. Copy and paste the **createFamilyItem** function underneath the **readContainer** function. The **createFamilyItem** function creates the items containing the JSON data saved in the ```config``` object. We'll check to make sure an item with the same id does not already exist before creating it.

   ```javascript
   /**
   * Create family item
   */
   async function createFamilyItem(itemBody) {
      const { item } = await client.database(databaseId).container(containerId).items.upsert(itemBody);
      console.log(`Created family item with id:\n${itemBody.id}\n`);
   };
   ```

1. Copy and paste the code below the call to **readContainer** to execute the **createFamilyItem** function.

   ```javascript
   createDatabase()
     .then(() => readDatabase())
     .then(() => createContainer())
     .then(() => readContainer())

     // ADD THIS PART TO YOUR CODE
     .then(() => createFamilyItem(config.items.Andersen))
     .then(() => createFamilyItem(config.items.Wakefield))
     // ENDS HERE

     .then(() => { exit(`Completed successfully`); })
     .catch((error) => { exit(`Completed with error ${JSON.stringify(error)}`) });
   ```

1. In your terminal, locate your ```app.js``` file and run the command: 

   ```bash 
   node app.js
   ```


## <a id="Query"></a>Query Azure Cosmos DB resources

Azure Cosmos DB supports rich queries against JSON documents stored in each container. The following sample code shows a query that you can run against the documents in your container.

1. Copy and paste the **queryContainer** function below the **createFamilyItem** function in the app.js file. Azure Cosmos DB supports SQL-like queries as shown below.

   ```javascript
   /**
   * Query the container using SQL
    */
   async function queryContainer() {
     console.log(`Querying container:\n${config.container.id}`);

     // query to return all children in a family
     const querySpec = {
        query: "SELECT VALUE r.children FROM root r WHERE r.lastName = @lastName",
        parameters: [
            {
                name: "@lastName",
                value: "Andersen"
            }
        ]
    };

    const { result: results } = await client.database(databaseId).container(containerId).items.query(querySpec, {enableCrossPartitionQuery:true}).toArray();
    for (var queryResult of results) {
        let resultString = JSON.stringify(queryResult);
        console.log(`\tQuery returned ${resultString}\n`);
    }
   };
   ```

1. Copy and paste the code below the calls to **createFamilyItem** to execute the **queryContainer** function.

   ```javascript
   createDatabase()
     .then(() => readDatabase())
     .then(() => createContainer())
     .then(() => readContainer())
     .then(() => createFamilyItem(config.items.Andersen))
     .then(() => createFamilyItem(config.items.Wakefield))

     // ADD THIS PART TO YOUR CODE
     .then(() => queryContainer())
     // ENDS HERE

     .then(() => { exit(`Completed successfully`); })
     .catch((error) => { exit(`Completed with error ${JSON.stringify(error)}`) });
   ```

1. In your terminal, locate your ```app.js``` file and run the command:

   ```bash 
   node app.js
   ```


## <a id="ReplaceItem"></a>Replace an item
Azure Cosmos DB supports replacing the content of items.

1. Copy and paste the **replaceFamilyItem** function below the **queryContainer** function in the app.js file. Note we've changed the property 'grade' of a child to 6 from the previous value of 5.

   ```javascript
   // ADD THIS PART TO YOUR CODE
   /**
   * Replace the item by ID.
   */
   async function replaceFamilyItem(itemBody) {
      console.log(`Replacing item:\n${itemBody.id}\n`);
      // Change property 'grade'
      itemBody.children[0].grade = 6;
     const { item } = await client.database(databaseId).container(containerId).item(itemBody.id, itemBody.Country).replace(itemBody);
   };
   ```

1. Copy and paste the code below the call to **queryContainer** to execute the **replaceFamilyItem** function. Also, add the code to call **queryContainer** again to verify that item has successfully changed.

   ```javascript
   createDatabase()
     .then(() => readDatabase())
     .then(() => createContainer())
     .then(() => readContainer())
     .then(() => createFamilyItem(config.items.Andersen))
     .then(() => createFamilyItem(config.items.Wakefield))
     .then(() => queryContainer())

     // ADD THIS PART TO YOUR CODE
     .then(() => replaceFamilyItem(config.items.Andersen))
     .then(() => queryContainer())
     // ENDS HERE

     .then(() => { exit(`Completed successfully`); })
     .catch((error) => { exit(`Completed with error ${JSON.stringify(error)}`) });
   ```

1. In your terminal, locate your ```app.js``` file and run the command:

   ```bash 
   node app.js
   ```


## <a id="DeleteItem"></a>Delete an item

Azure Cosmos DB supports deleting JSON items.

1. Copy and paste the **deleteFamilyItem** function underneath the **replaceFamilyItem** function.

   ```javascript
   /**
   * Delete the item by ID.
   */
   async function deleteFamilyItem(itemBody) {
     await client.database(databaseId).container(containerId).item(itemBody.id, itemBody.Country).delete(itemBody);
      console.log(`Deleted item:\n${itemBody.id}\n`);
   };
   ```

1. Copy and paste the code below the call to the second **queryContainer** to execute the **deleteFamilyItem** function.

   ```javascript
   createDatabase()
      .then(() => readDatabase())
      .then(() => createContainer())
      .then(() => readContainer())
      .then(() => createFamilyItem(config.items.Andersen))
      .then(() => createFamilyItem(config.items.Wakefield))
      .then(() => queryContainer
      ())
      .then(() => replaceFamilyItem(config.items.Andersen))
      .then(() => queryContainer())

    // ADD THIS PART TO YOUR CODE
      .then(() => deleteFamilyItem(config.items.Andersen))
    // ENDS HERE

    .then(() => { exit(`Completed successfully`); })
    .catch((error) => { exit(`Completed with error ${JSON.stringify(error)}`) });
   ```

1. In your terminal, locate your ```app.js``` file and run the command: 

   ```bash 
   node app.js
   ```


## <a id="DeleteDatabase"></a>Delete the database

Deleting the created database will remove the database and all children resources (containers, items, etc.).

1. Copy and paste the **cleanup** function underneath the **deleteFamilyItem** function to remove the database and all its children resources.

   ```javascript
   /**
   * Cleanup the database and container on completion
   */
   async function cleanup() {
     await client.database(databaseId).delete();
   }
   ```

1. Copy and paste the code below the call to **deleteFamilyItem** to execute the **cleanup** function.

   ```javascript
   createDatabase()
      .then(() => readDatabase())
      .then(() => createContainer())
      .then(() => readContainer())
      .then(() => createFamilyItem(config.items.Andersen))
      .then(() => createFamilyItem(config.items.Wakefield))
      .then(() => queryContainer())
      .then(() => replaceFamilyItem(config.items.Andersen))
      .then(() => queryContainer())
      .then(() => deleteFamilyItem(config.items.Andersen))

      // ADD THIS PART TO YOUR CODE
      .then(() => cleanup())
      // ENDS HERE

      .then(() => { exit(`Completed successfully`); })
      .catch((error) => { exit(`Completed with error ${JSON.stringify(error)}`) });
   ```

## <a id="Run"></a>Run your Node.js application

Altogether, your code should look like this:

[!code-javascript[nodejs-get-started](~/cosmosdb-nodejs-get-started/app.js)]

In your terminal, locate your ```app.js``` file and run the command: 

```bash 
node app.js
```

You should see the output of your get started app. The output should match the example text below.

   ```
    Created database:
    FamilyDatabase

    Reading database:
    FamilyDatabase

    Created container:
    FamilyContainer

    Reading container:
    FamilyContainer

    Created family item with id:
    Anderson.1

    Created family item with id:
    Wakefield.7

    Querying container:
    FamilyContainer
            Query returned [{"firstName":"Henriette Thaulow","gender":"female","grade":5,"pets":[{"givenName":"Fluffy"}]}]

    Replacing item:
    Anderson.1

    Querying container:
    FamilyContainer
            Query returned [{"firstName":"Henriette Thaulow","gender":"female","grade":6,"pets":[{"givenName":"Fluffy"}]}]

    Deleted item:
    Anderson.1

    Completed successfully
    Press any key to exit
   ```

## <a id="GetSolution"></a>Get the complete Node.js tutorial solution 

If you didn't have time to complete the steps in this tutorial, or just want to download the code, you can get it from [GitHub](https://github.com/Azure-Samples/azure-cosmos-db-sql-api-nodejs-getting-started ). 

To run the getting started solution that contains all the code in this article, you will need: 

* An [Azure Cosmos DB account][create-account]. 
* The [Getting Started](https://github.com/Azure-Samples/azure-cosmos-db-sql-api-nodejs-getting-started) solution available on GitHub. 

Install the project's dependencies via npm. Use the following command: 

* ```npm install``` 

Next, in the ```config.js``` file, update the config.endpoint and config.primaryKey values as described in [Step 3: Set your app's configurations](#Config).  

Then in your terminal, locate your ```app.js``` file and run the command:  

```bash  
node app.js 
```

## Clean up resources

When these resources are no longer needed, you can delete the resource group, Azure Cosmos DB account, and all the related resources. To do so, select the resource group that you used for the Azure Cosmos DB account, select **Delete**, and then confirm the name of the resource group to delete.

## Next steps

> [!div class="nextstepaction"]
> [Monitor an Azure Cosmos DB account](monitor-accounts.md)

[create-account]: create-sql-api-dotnet.md#create-account
[keys]: media/sql-api-nodejs-get-started/node-js-tutorial-keys.png
