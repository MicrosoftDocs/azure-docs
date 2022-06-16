---
title: Get started with Azure Cosmos DB MongoDB API and JavaScript
description: Get started developing a JavaScript application that works with Azure Cosmos DB MongoDB API. This article helps you learn how to set up a project and configure access to an Azure Cosmos DB MongoDB API database.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.devlang: javascript
ms.topic: how-to
ms.date: 06/08/2022
ms.custom: devx-track-js
---

# Get started with Azure Cosmos DB MongoDB API and JavaScript
[!INCLUDE[appliesto-mongo-api](../includes/appliesto-mongodb-api.md)]

This article shows you how to connect to Azure Cosmos DB MongoDB API using the native MongoDB npm package. Once connected, you can perform operations on databases, collections, and docs.

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/cosmos-db-mongodb-api-javascript-samples) are available on GitHub as a JavaScript project.

[MongoDB API reference documentation](https://docs.mongodb.com/drivers/node) | [mongodb Package (NuGet)](https://www.npmjs.com/package/mongodb)


## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
* [Node.js LTS](https://nodejs.org/en/download/)
* [Azure Command-Line Interface (CLI)](/cli/azure/) or [Azure PowerShell](/powershell/azure/)

## Set up your project

### Create a new JavaScript app

1. Create a new JavaScript application in an empty folder using your preferred terminal. Use the [``npm init``](https://docs.npmjs.com/cli/v8/commands/npm-init) command specifying the **console** template.

    ```console
    npm init
    ```

2. Add the [MongoDB](https://www.npmjs.com/package/mongodb) npm package to the JavaScript project. Use the [``npm install package``](https://docs.npmjs.com/cli/v8/commands/npm-install) command specifying the name of the npm package. The `dotenv` package is used to read the environment variables from a `.env` file during local development.

    ```console
    npm install mongodb dotenv
    ```

3. To run the app, use a terminal to navigate to the application directory and run the application.

    ```console
    node index.js
    ```

## Connect with MongoDB native driver to Azure Cosmos DB MongoDB API

To connect with the MongoDB native driver to Azure Cosmos DB, create an instance of the [``MongoClient``](https://mongodb.github.io/node-mongodb-native/4.5/classes/MongoClient.html#connect) class. This class is the starting point to perform all operations against databases. 

* [Connect with a MongoDB connection string](#connect-with-a-mongodb-connection-string)

### Connect with a MongoDB connection string

The most common constructor for **MongoClient** has two parameters:

| Parameter | Example value | Description |
| --- | --- | --- |
| ``url`` | ``COSMOS_CONNECTION_STRIN`` environment variable | MongoDB API connection string to use for all requests |
| ``options`` | `{ssl: true, tls: true, }` | MongoDB oOptions](https://mongodb.github.io/node-mongodb-native/4.5/interfaces/MongoClientOptions.html) for the connection. |

Refer to the [Troubleshooting guide](error-codes-solutions.md) for connection issues.

#### Retrieve your connection string

##### [Azure CLI](#tab/azure-cli)

1. Create a shell variable for *resourceGroupName*.

    ```azurecli-interactive
    # Variable for resource group name
    resourceGroupName="msdocs-cosmos"
    ```

1. Use the [``az cosmosdb list``](/cli/azure/cosmosdb#az-cosmosdb-list) command to retrieve the name of the first Azure Cosmos DB account in your resource group and store it in the *accountName* shell variable.

    ```azurecli-interactive
    # Retrieve most recently created account name
    accountName=$(
        az cosmosdb list \
            --resource-group $resourceGroupName \
            --query "[0].name" \
            --output tsv
    )
    ```

1. Get the MongoDB API full-control *CONNECTION STRING* for the account using the [``az cosmosdb show``](/cli/azure/cosmosdb#az-cosmosdb-show) command.

    ```azurecli-interactive
    az cosmosdb list-connection-strings \
        --resource-group $resourceGroupName \
        --name $accountName 
    ```

1. Record the *Primary MongoDB Connection String* value. You'll use this value later.

##### [PowerShell](#tab/azure-powershell)

1. Create a shell variable for *RESOURCE_GROUP_NAME*.

    ```azurepowershell-interactive
    # Variable for resource group name
    $RESOURCE_GROUP_NAME = "msdocs-cosmos"
    ```

1. Find the *CONNECTION STRING* from the list of keys and connection strings for the account with the [``Get-AzCosmosDBAccountKey``](/powershell/module/az.cosmosdb/get-azcosmosdbaccountkey) cmdlet.

    ```azurepowershell-interactive
    $parameters = @{
        ResourceGroupName = $RESOURCE_GROUP_NAME
        Name = $ACCOUNT_NAME
        Type = "ConnectionStrings"
    }    
    Get-AzCosmosDBAccountKey @parameters |
        Select-Object -Property "Primary MongoDB Connection String"    
    ```

1. Record the *CONNECTION STRING* value. You'll use these credentials later.


##### [Portal](#tab/azure-portal)

> [!TIP]
> For this guide, we recommend using the resource group name ``msdocs-cosmos``.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to the existing Azure Cosmos DB MongoDB API account page.

1. From the Azure Cosmos DB MongoDB API account page, select the **Connection String** navigation menu option.

1. Record the value for the **PRIMARY CONNECTION STRING** field. You'll use this value in a later step.

   :::image type="content" source="media/quickstart-javascript/cosmos-endpoint-key-credentials.png" lightbox="media/quickstart-javascript/cosmos-endpoint-key-credentials.png" alt-text="Screenshot of Keys page with various credentials for an Azure Cosmos D B SQL A P I account.":::

---

To use the **CONNECION STRING** values within your JavaScript code, set this value on the local machine running the application. To set the environment variable, use your preferred terminal to run the following commands:

#### [Windows](#tab/windows)

```powershell
$env:COSMOS_CONNECTION_STRING = "<cosmos-connection-string>"
```

#### [Linux / macOS](#tab/linux+macos)

```bash
export COSMOS_CONNECTION_STRING="<cosmos-connection-string>"
```

#### [.env](#tab/dotenv)

A `.env` file is a standard way to store environment variables in a project. Create a `.env` file in the root of your project. Add the following lines to the `.env` file:

```dotenv
COSMOS_CONNECTION_STRING="<cosmos-connection-string>"
```

---

#### Create MongoClient with connection string

Create a new instance of the **MongoClient** class with the ``COSMOS_CONNECTION_STRING`` environment variable as the first parameter.

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/101-client-connection-string/index.js" id="client_credentials":::

## Build your application

As you build your application, your code will primarily interact with these types of resources:

- Databases, which organize the collections in your account.

- Collections, which contain a set of individual docs in your database.

- Docs, which represent a JSON document in your collection.

The following diagram shows the relationship between these resources.

:::image type="complex" source="media/quickstart-javascript/resource-hierarchy.png" alt-text="Diagram of the Azure Cosmos D B hierarchy including accounts, databases, collections, and docs.":::
    Hierarchical diagram showing an Azure Cosmos D B account at the top. The account has two child database nodes. One of the database nodes includes two child collection nodes. The other database node includes a single child collection node. That single collection node has three child doc nodes.
:::image-end:::

Each type of resource is represented by one or more associated JavaScript classes. Here's a list of the most common classes:

| Class | Description |
|---|---|
|[``MongoClient``](https://mongodb.github.io/node-mongodb-native/4.5/classes/MongoClient.html)|This class provides a client-side logical representation for the MongoDB API layer on Cosmos DB. The client object is used to configure and execute requests against the service.|
|[``Db``](https://mongodb.github.io/node-mongodb-native/4.5/classes/Db.html)|This class is a reference to a database that may, or may not, exist in the service yet. The database is validated server-side when you attempt to access it or perform an operation against it.|
|[``Collection``](https://mongodb.github.io/node-mongodb-native/4.5/classes/Collection.html)|This class is a reference to a collection that also may not exist in the service yet. The collection is validated server-side when you attempt to work with it.|

The following guides show you how to use each of these classes to build your application.

| Guide | Description |
|--|---|
| [Create a database](how-to-javascript-create-database.md) | Create databases |
| [Create a collection](how-to-javascript-create-collection.md) | Create collections |

## See also

- [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.Cosmos)
- [API reference](https://docs.mongodb.com/drivers/node)

## Next steps

Now that you've connected to a MongoDB API account, use the next guide to create and manage databases.

> [!div class="nextstepaction"]
> [Create a database in Azure Cosmos DB MongoDB API using JavaScript](how-to-javascript-create-database.md)