---
title: Node.js tutorial for the SQL API for Azure Cosmos DB | Microsoft Docs
description: A Node.js tutorial that demonstrates how to connect to and query Azure Cosmos DB using the SQL API
services: cosmos-db
author: deborahc
editor: monicar

ms.service: cosmos-db
ms.component: cosmosdb-sql
ms.devlang: nodejs
ms.topic: tutorial
ms.date: 09/24/2018
ms.author: dech

---
# Node.js tutorial: Create a Node.js console application with JavaScript SDK to manage Azure Cosmos DB SQL API data

> [!div class="op_single_selector"]
> * [.NET](sql-api-get-started.md)
> * [.NET Core](sql-api-dotnetcore-get-started.md)
> * [Java](sql-api-java-get-started.md)
> * [Async Java](sql-api-async-java-get-started.md)
> * [Node.js](sql-api-nodejs-get-started.md)
> 


Welcome to the Node.js tutorial for the Azure Cosmos DB JavaScript SDK! After following this tutorial, you'll have a console application that creates and queries Azure Cosmos DB resources.

We'll cover:

* Creating and connecting to an Azure Cosmos DB account
* Setting up your application
* Creating a database
* Creating a container
* Adding JSON items to the container
* Querying the container
* Replacing an item
* Deleting an item
* Deleting the database

Don't have time? Don't worry! The complete solution is available on [GitHub](https://github.com/Azure-Samples/azure-cosmos-db-sql-api-nodejs-getting-started ). See [Get the complete solution](#GetSolution) for quick instructions.

After you've completed the Node.js tutorial, please use the voting buttons at the top and bottom of this page to give us feedback. If you'd like us to contact you directly, feel free to include your email address in your comments.

Now let's get started!

## Prerequisites for the Node.js tutorial

Make sure you have the following:

* An active Azure account. If you don't have one, you can sign up for a [Free Azure Trial](https://azure.microsoft.com/pricing/free-trial/). 

  [!INCLUDE [cosmos-db-emulator-docdb-api](../../includes/cosmos-db-emulator-docdb-api.md)]

* [Node.js](https://nodejs.org/) version v6.0.0 or higher.

## Step 1: Create an Azure Cosmos DB account

Let's create an Azure Cosmos DB account. If you already have an account you want to use, you can skip ahead to [Set up your Node.js application](#SetupNode). If you are using the Azure Cosmos DB Emulator, follow the steps at [Azure Cosmos DB Emulator](local-emulator.md) to set up the emulator and skip ahead to [Set up your Node.js application](#SetupNode). 

[!INCLUDE [cosmos-db-create-dbaccount](../../includes/cosmos-db-create-dbaccount.md)]

## <a id="SetupNode"></a>Step 2: Set up your Node.js application

1. Open your favorite terminal.
2. Locate the folder or directory where you'd like to save your Node.js application.
3. Create two empty JavaScript files with the following commands:
   * Windows:
     * ```fsutil file createnew app.js 0```
     * ```fsutil file createnew config.js 0```
   * Linux/OS X:
     * ```touch app.js```
     * ```touch config.js```
4. Install the @azure/cosmos module via npm. Use the following command:
   * ```npm install @azure/cosmos --save```

Great! Now that you've finished setting up, let's start writing some code.

## <a id="Config"></a>Step 3: Set your app's configurations

Open ```config.js``` in your favorite text editor.

Then, copy and paste the code snippet below and set properties ```config.endpoint``` and ```config.primaryKey``` to your Azure Cosmos DB endpoint URI and primary key. Both these configurations can be found in the [Azure portal](https://portal.azure.com).

![Node.js tutorial - Screen shot of the Azure portal, showing an Azure Cosmos DB account, with the ACTIVE hub highlighted, the KEYS button highlighted on the Azure Cosmos DB account blade, and the URI, PRIMARY KEY and SECONDARY KEY values highlighted on the Keys blade - Node database][keys]

```nodejs
// ADD THIS PART TO YOUR CODE
var config = {}

config.endpoint = "~your Azure Cosmos DB endpoint uri here~";
config.primaryKey = "~your primary key here~";
``` 

Copy and paste the ```database```, ```container```, and ```items``` data to your ```config``` object below where you set your ```config.endpoint``` and ```config.primaryKey``` properties. If you already have data you'd like to store in your database, you can use Azure Cosmos DB's [Data Migration tool](import-data.md) rather than defining the data here.

```nodejs
var config = {}

config.endpoint = "~your Azure Cosmos DB account endpoint uri here~";
config.primaryKey = "~your primary key here~";

config.database = {
    "id": "FamilyDatabase"
};

config.container = {
    "id": "FamilyContainer"
};

config.items = {
    "Andersen": {
        "id": "Anderson.1",
        "lastName": "Andersen",
        "parents": [{
            "firstName": "Thomas"
        }, {
                "firstName": "Mary Kay"
            }],
        "children": [{
            "firstName": "Henriette Thaulow",
            "gender": "female",
            "grade": 5,
            "pets": [{
                "givenName": "Fluffy"
            }]
        }],
        "address": {
            "state": "WA",
            "county": "King",
            "city": "Seattle"
        }
    },
    "Wakefield": {
        "id": "Wakefield.7",
        "parents": [{
            "familyName": "Wakefield",
            "firstName": "Robin"
        }, {
                "familyName": "Miller",
                "firstName": "Ben"
            }],
        "children": [{
            "familyName": "Merriam",
            "firstName": "Jesse",
            "gender": "female",
            "grade": 8,
            "pets": [{
                "givenName": "Goofy"
            }, {
                    "givenName": "Shadow"
                }]
        }, {
                "familyName": "Miller",
                "firstName": "Lisa",
                "gender": "female",
                "grade": 1
            }],
        "address": {
            "state": "NY",
            "county": "Manhattan",
            "city": "NY"
        },
        "isRegistered": false
    }
};
```
Note, if you are familiar with the previous version of the JavaScript SDK, you may be used to seeing the terms 'collection' and 'document.' Because Azure Cosmos DB supports [multiple API models](https://docs.microsoft.com/azure/cosmos-db/introduction#key-capabilities), version 2.0+ of the JavaScript SDK uses the generic terms 'container' and 'item.' A container can be a collection, graph, or table. An item can be a document, edge/vertex, or row, and is the content inside a container. 

Finally, export your ```config``` object, so that you can reference it within the ```app.js``` file.
```nodejs
        },
        "isRegistered": false
    }
};

// ADD THIS PART TO YOUR CODE
module.exports = config;
```
## <a id="Connect"></a> Step 4: Connect to an Azure Cosmos DB account

Open your empty ```app.js``` file in the text editor. Copy and paste the code below to import the ```@azure/cosmos``` module and your newly created ```config``` module.

```nodejs
// ADD THIS PART TO YOUR CODE
const CosmosClient = require('@azure/cosmos').CosmosClient;

const config = require('./config');
const url = require('url');
```

Copy and paste the code to use the previously saved ```config.endpoint``` and ```config.primaryKey``` to create a new CosmosClient.

```nodejs
const url = require('url');

// ADD THIS PART TO YOUR CODE
const endpoint = config.endpoint;
const masterKey = config.primaryKey;

const client = new CosmosClient({ endpoint: endpoint, auth: { masterKey: masterKey } });
```

Now that you have the code to initialize the Azure Cosmos DB client, let's take a look at how to work with Azure Cosmos DB resources.

## Step 5: Create a database

Copy and paste the code below to set the HTTP status for Not Found, the database id, and the container id. These ids are how the Azure Cosmos DB client will find the right database and container.

```nodejs
const client = new CosmosClient({ endpoint: endpoint, auth: { masterKey: masterKey } });

// ADD THIS PART TO YOUR CODE
const HttpStatusCodes = { NOTFOUND: 404 };

const databaseId = config.database.id;
const containerId = config.container.id;
```

A [database](sql-api-resources.md#databases) can be created by using either the [createIfNotExists](/javascript/api/%40azure/cosmos/databases) or [create](/javascript/api/%40azure/cosmos/databases) function of the **Databases** class. A database is the logical container of items partitioned across containers. 

Copy and paste the **createDatabase** and **readDatabase** functions into the app.js file underneath the definition of ```databaseId``` and ```containerId```. The **createDatabase** function will create a new database with id ```FamilyDatabase```, specified from the ```config``` object if it does not already exist. The **readDatabase** function will read the database's definition to ensure that the database exists.

```nodejs
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

Copy and paste the code below where you set the **createDatabase** and **readDatabase** functions to add the helper function **exit** that will print the exit message. 

```nodejs
// ADD THIS PART TO YOUR CODE
function exit(message) {
    console.log(message);
    console.log('Press any key to exit');
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
};
```
Copy and paste the code below where you set the **exit** function to call the **createDatabase** and **readDatabase** functions.

```nodejs
createDatabase()
    .then(() => readDatabase())
    .then(() => { exit(`Completed successfully`); })
    .catch((error) => { exit(`Completed with error \${JSON.stringify(error)}`) });
```

At this point, your code in ```app.js``` should now look like this:

```nodejs
const CosmosClient = require('@azure/cosmos').CosmosClient;

const config = require('./config');
const url = require('url');

const endpoint = config.endpoint;
const masterKey = config.primaryKey;

const client = new CosmosClient({ endpoint: endpoint, auth: { masterKey: masterKey } });

const HttpStatusCodes = { NOTFOUND: 404 };

const databaseId = config.database.id;
const containerId = config.container.id;


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
    .catch((error) => { exit(`Completed with error ${JSON.stringify(error)}`) });
```

In your terminal, locate your ```app.js``` file and run the command: 
```bash 
node app.js
```

Congratulations! You have successfully created an Azure Cosmos DB database.

## <a id="CreateContainer"></a>Step 6: Create a container

> [!WARNING]
> Calling the function **createContainer** will create a new container, which has pricing implications. For more details, visit our [pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/).

A container can be created by using either the [createIfNotExists](/javascript/api/%40azure/cosmos/containers) or [create](/javascript/api/%40azure/cosmos/containers) function from the **Containers** class. 

A container consists of items (which in the case of the SQL API are JSON documents) and associated JavaScript application logic.

Copy and paste the **createContainer**  and **readContainer** function underneath the **readDatabase** function in the app.js file. The **createContainer** function will create a new container with the ```containerId``` specified from the ```config``` object if it does not already exist. The **readContainer** function will read the container definition to verify the container exists.

```nodejs
/**
 * Create the container if it does not exist
 */
async function createContainer() {
    const { container } = await client.database(databaseId).containers.createIfNotExists({ id: containerId });
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

Copy and paste the code underneath the call to **readDatabase** to execute the **createContainer** and **readContainer** functions.
```nodejs
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

```nodejs
const CosmosClient = require('@azure/cosmos').CosmosClient;

const config = require('./config');
const url = require('url');

const endpoint = config.endpoint;
const masterKey = config.primaryKey;

const client = new CosmosClient({ endpoint: endpoint, auth: { masterKey: masterKey } });

const HttpStatusCodes = { NOTFOUND: 404 };

const databaseId = config.database.id;
const containerId = config.container.id;

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
    const { container } = await client.database(databaseId).containers.createIfNotExists({ id: containerId });
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

In your terminal, locate your ```app.js``` file and run the command: 

```bash 
node app.js
```

Congratulations! You have successfully created an Azure Cosmos DB container.

## <a id="CreateItem"></a>Step 7: Create an item

An item can be created by using the [create](/javascript/api/%40azure/cosmos/items) function of the **Items** class. When using the SQL API, items are projected as documents, which are user-defined (arbitrary) JSON content. You can now insert an item into Azure Cosmos DB.

Copy and paste the **createFamilyItem** function underneath the **readContainer** function. The **createFamilyItem** function creates the items containing the JSON data saved in the ```config``` object. We'll check to make sure an item with the same id does not already exist before creating it.

```nodejs
/**
 * Create family item if it does not exist
 */
async function createFamilyItem(itemBody) {
    try {
        // read the item to see if it exists
        const { item } = await client.database(databaseId).container(containerId).item(itemBody.id).read();
        console.log(`Item with family id ${itemBody.id} already exists\n`);
    }
    catch (error) {
        // create the family item if it does not exist
        if (error.code === HttpStatusCodes.NOTFOUND) {
            const { item } = await client.database(databaseId).container(containerId).items.create(itemBody);
            console.log(`Created family item with id:\n${itemBody.id}\n`);
        } else {
            throw error;
        }
    }
};
```

Copy and paste the code below the call to **readContainer** to execute the **createFamilyItem** function.
```nodejs
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

In your terminal, locate your ```app.js``` file and run the command: 

```bash 
node app.js
```

Congratulations! You have successfully created an Azure Cosmos DB item.


## <a id="Query"></a>Step 8: Query Azure Cosmos DB resources
Azure Cosmos DB supports [rich queries](sql-api-sql-query.md) against JSON documents stored in each container. The following sample code shows a query that you can run against the documents in your container.

Copy and paste the **queryContainer** function below the **createFamilyItem** function in the app.js file. Azure Cosmos DB supports SQL-like queries as shown below. For more information on building complex queries, check out the [Query Playground](https://www.documentdb.com/sql/demo) and the [query documentation](sql-api-sql-query.md).

```nodejs
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

    const { result: results } = await client.database(databaseId).container(containerId).items.query(querySpec).toArray();
    for (var queryResult of results) {
        let resultString = JSON.stringify(queryResult);
        console.log(`\tQuery returned ${resultString}\n`);
    }
};
```

Copy and paste the code below the calls to **createFamilyItem** to execute the **queryContainer** function.

```nodejs
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

In your terminal, locate your ```app.js``` file and run the command:

```bash 
node app.js
```

Congratulations! You have successfully queried your Azure Cosmos DB items.

## <a id="ReplaceItem"></a>Step 9: Replace an item
Azure Cosmos DB supports replacing the content of items.

Copy and paste the **replaceFamilyItem** function below the **queryContainer** function in the app.js file. Note we've changed the property 'grade' of a child to 6 from the previous value of 5.

```nodejs
// ADD THIS PART TO YOUR CODE
/**
 * Replace the item by ID.
 */
async function replaceFamilyItem(itemBody) {
    console.log(`Replacing item:\n${itemBody.id}\n`);
    // Change property 'grade'
    itemBody.children[0].grade = 6;
    const { item } = await client.database(databaseId).container(containerId).item(itemBody.id).replace(itemBody);
};
```
Copy and paste the code below the call to **queryContainer** to execute the **replaceFamilyItem** function. Also, add the code to call **queryContainer** again to verify that item has successfully changed.

```nodejs
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
In your terminal, locate your ```app.js``` file and run the command:

```bash 
node app.js
```

Congratulations! You have successfully replaced an Azure Cosmos DB item.

## <a id="DeleteItem"></a>Step 10: Delete an item

Azure Cosmos DB supports deleting JSON items.

Copy and paste the **deleteFamilyItem** function underneath the **replaceFamilyItem** function.

```nodejs
/**
 * Delete the item by ID.
 */
async function deleteFamilyItem(itemBody) {
    await client.database(databaseId).container(containerId).item(itemBody.id).delete(itemBody);
    console.log(`Deleted item:\n${itemBody.id}\n`);
};
```

Copy and paste the code below the call to the second **queryContainer** to execute the **deleteFamilyItem** function.

```nodejs
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

In your terminal, locate your ```app.js``` file and run the command: 

```bash 
node app.js
```

Congratulations! You have successfully deleted an Azure Cosmos DB item.

## <a id="DeleteDatabase"></a>Step 11: Delete the database

Deleting the created database will remove the database and all children resources (containers, items, etc.).

Copy and paste the **cleanup** function underneath the **deleteFamilyItem** function to remove the database and all its children resources.

```nodejs
/**
 * Cleanup the database and container on completion
 */
async function cleanup() {
    await client.database(databaseId).delete();
}
```

Copy and paste the code below the call to **deleteFamilyItem** to execute the **cleanup** function.

```nodejs
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

## <a id="Run"></a>Step 12: Run your Node.js application all together!

Altogether, your code should look like this:
```nodejs
const CosmosClient = require('@azure/cosmos').CosmosClient;

const config = require('./config');
const url = require('url');

const endpoint = config.endpoint;
const masterKey = config.primaryKey;

const HttpStatusCodes = { NOTFOUND: 404 };

const databaseId = config.database.id;
const containerId = config.container.id;

const client = new CosmosClient({ endpoint: endpoint, auth: { masterKey: masterKey } });

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
    const { container } = await client.database(databaseId).containers.createIfNotExists({ id: containerId });
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
 * Create family item if it does not exist
 */
async function createFamilyItem(itemBody) {
    try {
        // read the item to see if it exists
        const { item } = await client.database(databaseId).container(containerId).item(itemBody.id).read();
        console.log(`Item with family id ${itemBody.id} already exists\n`);
    }
    catch (error) {
        // create the family item if it does not exist
        if (error.code === HttpStatusCodes.NOTFOUND) {
            const { item } = await client.database(databaseId).container(containerId).items.create(itemBody);
            console.log(`Created family item with id:\n${itemBody.id}\n`);
        } else {
            throw error;
        }
    }
};

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

    const { result: results } = await client.database(databaseId).container(containerId).items.query(querySpec).toArray();
    for (var queryResult of results) {
        let resultString = JSON.stringify(queryResult);
        console.log(`\tQuery returned ${resultString}\n`);
    }
};

/**
 * Replace the item by ID.
 */
async function replaceFamilyItem(itemBody) {
    console.log(`Replacing item:\n${itemBody.id}\n`);
    // Change property 'grade'
    itemBody.children[0].grade = 6;
    const { item } = await client.database(databaseId).container(containerId).item(itemBody.id).replace(itemBody);
};

/**
 * Delete the item by ID.
 */
async function deleteFamilyItem(itemBody) {
    await client.database(databaseId).container(containerId).item(itemBody.id).delete(itemBody);
    console.log(`Deleted item:\n${itemBody.id}\n`);
};

/**
 * Cleanup the database and container on completion
 */
async function cleanup() {
    await client.database(databaseId).delete();
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
    .then(() => createFamilyItem(config.items.Andersen))
    .then(() => createFamilyItem(config.items.Wakefield))
    .then(() => queryContainer())
    .then(() => replaceFamilyItem(config.items.Andersen))
    .then(() => queryContainer())
    .then(() => deleteFamilyItem(config.items.Andersen))
    .then(() => cleanup())
    .then(() => { exit(`Completed successfully`); })
    .catch((error) => { exit(`Completed with error ${JSON.stringify(error)}`) });
```

In your terminal, locate your ```app.js``` file and run the command: 

```bash 
node app.js
```

You should see the output of your get started app. The output should match the example text below.

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

Congratulations! You've completed the Node.js tutorial and have your first Azure Cosmos DB console application!

## <a id="GetSolution"></a>Get the complete Node.js tutorial solution

If you didn't have time to complete the steps in this tutorial, or just want to download the code, you can get it from [GitHub](https://github.com/Azure-Samples/azure-cosmos-db-sql-api-nodejs-getting-started ).

To run the getting started solution that contains all the code in this article, you will need the following:

* An [Azure Cosmos DB account][create-account].
* The [Getting Started](https://github.com/Azure-Samples/azure-cosmos-db-sql-api-nodejs-getting-started) solution available on GitHub.

Install the **@azure/cosmos** module via npm. Use the following command:

* ```npm install @azure/cosmos --save```

Next, in the ```config.js``` file, update the config.endpoint and config.primaryKey values as described in [Step 3: Set your app's configurations](#Config). 

Then in your terminal, locate your ```app.js``` file and run the command: 

```bash 
node app.js
```

That's it, and you're on your way! 

## Next steps
* Want a more complex Node.js sample? See [Build a Node.js web application using Azure Cosmos DB](sql-api-nodejs-application.md).
* Learn how to [monitor an Azure Cosmos DB account](monitor-accounts.md).
* Run queries against our sample dataset in the [Query Playground](https://www.documentdb.com/sql/demo).

[create-account]: create-sql-api-dotnet.md#create-account
[keys]: media/sql-api-nodejs-get-started/node-js-tutorial-keys.png