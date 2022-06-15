---
title: Quickstart - Azure Cosmos DB MongoDB API for JavaScript with mongoDB drier
description: Learn how to build a JavaScript app to manage Azure Cosmos DB MongoDB API account resources in this quickstart.
author: diberry
ms.author: diberry
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: javascript
ms.topic: quickstart
ms.date: 06/10/2022
ms.custom: devx-track-js
---

# Quickstart: Azure Cosmos DB MongoDB API for JavaScript with mongoDB driver
[!INCLUDE[appliesto-mongodb-api](../includes/appliesto-mongodb-api.md)]

Get started with the mongoDB npm package to create databases, collections, and docs within your account. Follow these steps to  install the package and try out example code for basic tasks.

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/cosmos-db-mongodb-api-javascript-samples) are available on GitHub as a JavaScript project.

[MongoDB API reference documentation](https://docs.mongodb.com/drivers/node) | [mongodb Package (NuGet)](https://www.npmjs.com/package/mongodb)

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
* [Node.js LTS](https://nodejs.org/en/download/)
* [Azure Command-Line Interface (CLI)](/cli/azure/) or [Azure PowerShell](/powershell/azure/)

### Prerequisite check

* In a terminal or command window, run ``node --version`` to check that Node.js is one of the LTS versions.
* Run ``az --version`` (Azure CLI) or ``Get-Module -ListAvailable AzureRM`` (Azure PowerShell) to check that you have the appropriate Azure command-line tools installed.

## Setting up

This section walks you through creating an Azure Cosmos account and setting up a project that uses the mongoDB npm package. 

### Create an Azure Cosmos DB account

This quickstart will create a single Azure Cosmos DB account using the MongoDB API.

#### [Azure CLI](#tab/azure-cli)

1. Create shell variables for *accountName*, *resourceGroupName*, and *location*.

    ```azurecli-interactive
    # Variable for resource group name
    resourceGroupName="msdocs-cosmos-javascript-quickstart-rg"
    location="westus"

    # Variable for account name with a randomly generated suffix
    let suffix=$RANDOM*$RANDOM
    accountName="msdocs-javascript-$suffix"
    ```

1. If you haven't already, sign in to the Azure CLI using the [``az login``](/cli/azure/reference-index#az-login) command.

1. Use the [``az group create``](/cli/azure/group#az-group-create) command to create a new resource group in your subscription.

    ```azurecli-interactive
    az group create \
        --name $resourceGroupName \
        --location $location
    ```

1. Use the [``az cosmosdb create``](/cli/azure/cosmosdb#az-cosmosdb-create) command to create a new Azure Cosmos DB MongoDB API account with default settings.

    ```azurecli-interactive
    az cosmosdb create \
        --resource-group $resourceGroupName \
        --name $accountName \
        --locations regionName=$location
        --kind MongoDB
    ```

1. Find the MongoDB API **connection string** from the list of connection strings for the account with the[``az cosmosdb list-connection-strings``](/cli/azure/cosmosdb#az-cosmosdb-list-connection-strings) command.

    ```azurecli-interactive
    az cosmosdb list-connection-strings \
        --resource-group $resourceGroupName \
        --name $accountName 
    ```

1. Record the *Primary MongoDB Connection String* value. You'll use this value later.

#### [PowerShell](#tab/azure-powershell)

1. Create shell variables for *ACCOUNT_NAME*, *RESOURCE_GROUP_NAME*, and **LOCATION**.

    ```azurepowershell-interactive
    # Variable for resource group name
    $RESOURCE_GROUP_NAME = "msdocs-cosmos-javascript-quickstart-rg"
    $LOCATION = "West US"
    
    # Variable for account name with a randomnly generated suffix
    $SUFFIX = Get-Random
    $ACCOUNT_NAME = "msdocs-javascript-$SUFFIX"
    ```

1. If you haven't already, sign in to Azure PowerShell using the [``Connect-AzAccount``](/powershell/module/az.accounts/connect-azaccount) cmdlet.

1. Use the [``New-AzResourceGroup``](/powershell/module/az.resources/new-azresourcegroup) cmdlet to create a new resource group in your subscription. 

    ```azurepowershell-interactive
    $parameters = @{
        Name = $RESOURCE_GROUP_NAME
        Location = $LOCATION
    }
    New-AzResourceGroup @parameters    
    ```

1. Use the [``New-AzCosmosDBAccount``](/powershell/module/az.cosmosdb/new-azcosmosdbaccount) cmdlet to create a new Azure Cosmos DB MongoDB API account with default settings. 

    ```azurepowershell-interactive
    $parameters = @{
        ResourceGroupName = $RESOURCE_GROUP_NAME
        Name = $ACCOUNT_NAME
        Location = $LOCATION
        Kind = "MongoDB"
    }
    New-AzCosmosDBAccount @parameters
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

#### [Portal](#tab/azure-portal)

> [!TIP]
> For this quickstart, we recommend using the resource group name ``msdocs-cosmos-javascript-quickstart-rg``.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. From the Azure portal menu or the **Home page**, select **Create a resource**.

1. On the **New** page, search for and select **Azure Cosmos DB**.

1. On the **Select API option** page, select the **Create** option within the **MongoDB** section. Azure Cosmos DB has five APIs: SQL, MongoDB, Gremlin, Table, and Cassandra. [Learn more about the MongoDB API](/azure/cosmos-db/mongodb/introduction.md).

   :::image type="content" source="media/quickstart-javascript/cosmos-api-choices.png" lightbox="media/quickstart-javascript/cosmos-api-choices.png" alt-text="Screenshot of select A P I option page for Azure Cosmos D B.":::

1. On the **Create Azure Cosmos DB Account** page, enter the following information:

   | Setting | Value | Description |
   | --- | --- | --- |
   | Subscription | Subscription name | Select the Azure subscription that you wish to use for this Azure Cosmos account. |
   | Resource Group | Resource group name | Select a resource group, or select **Create new**, then enter a unique name for the new resource group. |
   | Account Name | A unique name | Enter a name to identify your Azure Cosmos account. The name will be used as part of a fully qualified domain name (FQDN) with a suffix of *documents.azure.com*, so the name must be globally unique. The name can only contain lowercase letters, numbers, and the hyphen (-) character. The name must also be between 3-44 characters in length. |
   | Location | The region closest to your users | Select a geographic location to host your Azure Cosmos DB account. Use the location that is closest to your users to give them the fastest access to the data. |
   | Capacity mode |Provisioned throughput or Serverless|Select **Provisioned throughput** to create an account in [provisioned throughput](../set-throughput.md) mode. Select **Serverless** to create an account in [serverless](../serverless.md) mode. |
   | Apply Azure Cosmos DB free tier discount | **Apply** or **Do not apply** |With Azure Cosmos DB free tier, you'll get the first 1000 RU/s and 25 GB of storage for free in an account. Learn more about [free tier](https://azure.microsoft.com/pricing/details/cosmos-db/). |
   | Version | MongoDB version  | Select the MongoDB server version that matches your application requirements.

   > [!NOTE]
   > You can have up to one free tier Azure Cosmos DB account per Azure subscription and must opt-in when creating the account. If you do not see the option to apply the free tier discount, this means another account in the subscription has already been enabled with free tier.

   :::image type="content" source="media/quickstart-javascript/new-cosmos-account-page.png" lightbox="media/quickstart-javascript/new-cosmos-account-page.png" alt-text="Screenshot of new account page for Azure Cosmos D B SQL A P I.":::

1. Select **Review + create**.

1. Review the settings you provide, and then select **Create**. It takes a few minutes to create the account. Wait for the portal page to display **Your deployment is complete** before moving on.

1. Select **Go to resource** to go to the Azure Cosmos DB account page. 

   :::image type="content" source="media/quickstart-javascript/cosmos-deployment-complete.png" lightbox="media/quickstart-javascript/cosmos-deployment-complete.png" alt-text="Screenshot of deployment page for Azure Cosmos D B SQL A P I resource.":::

1. From the Azure Cosmos DB SQL API account page, select the **Connection String** navigation menu option.

1. Record the value for the **PRIMARY CONNECTION STRING** field. You'll use this value in a later step.

   :::image type="content" source="media/quickstart-javascript/cosmos-endpoint-key-credentials.png" lightbox="media/quickstart-javascript/cosmos-endpoint-key-credentials.png" alt-text="Screenshot of Keys page with various credentials for an Azure Cosmos D B SQL A P I account.":::

---

### Create a new JavaScript app

Create a new JavaScript application in an empty folder using your preferred terminal. Use the [``npm init``](https://docs.npmjs.com/cli/v8/commands/npm-init) command specifying the **console** template.

```console
npm init
```

### Install the package

Add the [MongoDB](https://www.npmjs.com/package/mongodb) npm package to the JavaScript project. Use the [``npm install package``](https://docs.npmjs.com/cli/v8/commands/npm-install) command specifying the name of the npm package. The `dotenv` package is used to read the environment variables from a `.env` file during local development.

```console
npm install mongodb dotenv
```

### Configure environment variables

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

## Object model

Before you start building the application, let's look into the hierarchy of resources in Azure Cosmos DB. Azure Cosmos DB has a specific object model used to create and access resources. The Azure Cosmos DB creates resources in a hierarchy that consists of accounts, databases, collections, and docs.

:::image type="complex" source="media/quickstart-javascript/resource-hierarchy.png" alt-text="Diagram of the Azure Cosmos D B hierarchy including accounts, databases, collections, and docs.":::
    Hierarchical diagram showing an Azure Cosmos D B account at the top. The account has two child database nodes. One of the database nodes includes two child collection nodes. The other database node includes a single child collection node. That single collection node has three child doc nodes.
:::image-end:::

You'll use the following MongoDB classes to interact with these resources:

- [``MongoClient``](https://mongodb.github.io/node-mongodb-native/4.5/classes/MongoClient.html) - This class provides a client-side logical representation for the MongoDB API layer on Cosmos DB. The client object is used to configure and execute requests against the service.
- [``Db``](https://mongodb.github.io/node-mongodb-native/4.5/classes/Db.html) - This class is a reference to a database that may, or may not, exist in the service yet. The database is validated server-side when you attempt to access it or perform an operation against it.
- [``Collection``](https://mongodb.github.io/node-mongodb-native/4.5/classes/Collection.html) - This class is a reference to a collection that also may not exist in the service yet. The collection is validated server-side when you attempt to work with it.


## Code examples

- [Authenticate the client](#authenticate-the-client)
- [Create a database](#create-a-database)
- [Create a collection](#create-a-collection)
- [Create an doc](#create-a-doc)
- [Get an doc](#get-a-doc)
- [Query docs](#query-docs)

The sample code described in this article creates a database named ``adventureworks`` with a collection named ``products``. The ``products`` collection is designed to contain product details such as name, category, quantity, and a sale indicator. Each product also contains a unique identifier.

For this procedure, the database will not use sharding or a partition key. 

### Authenticate the client

1. From the project directory, create an *index.js* file. In your editor, add requires statements to reference the MongoDB and DotEnv npm packages. 

    :::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/001-quickstart/index.js" id="package_dependencies":::

2. Define a new instance of the ``MongoClient,`` class using the constructor, and [``process.env.``](https://nodejs.org/dist/latest-v8.x/docs/api/process.html#process_process_env) to read the environment variable you created earlier.

    :::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/001-quickstart/index.js" id="client_credentials":::

For more information on different ways to create a ``MongoClient`` instance, see [MongoDB NodeJS Driver Quick Start](https://www.npmjs.com/package/mongodb#quick-start).

### Set up asynchronous operations

In the ``index.js`` file, add the following code to support the asynchronous operations:

```javascript
async function main(){

// The remaining operations are added here
// in the main function

}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
```
    
The following code snippets should be added into the *main* function in order to handle the async/await syntax.

### Connect to the database

Use the [``MongoClient.connect``](https://mongodb.github.io/node-mongodb-native/4.5/classes/MongoClient.html#connect) method to connect to your Cosmos DB API for MongoDB resource. This method will return a reference to the existing or newly created database.

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/001-quickstart/index.js" id="connect_client":::

### Create a database

Use the [``MongoClient.db``](https://mongodb.github.io/node-mongodb-native/4.5/classes/MongoClient.html#db) method to create a new database if it doesn't already exist. This method will return a reference to the existing or newly created database.

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/001-quickstart/index.js" id="new_database" :::

### Create a collection

The [``Db.collection``](https://mongodb.github.io/node-mongodb-native/4.5/classes/Db.html#collection) creates a new collection if it doesn't already exist. This method returns a reference to the collection.

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/001-quickstart/index.js" id="new_collection":::

### Create a doc

Create a doc with the *product* properties for the adventureworks database:
    * An _id property for the unique identifier of the product.
    * A *category* property. This can be used as the logical partition key.
    * A *name* property.
    * An inventory *quantity* property.
    * A *sale* property, indicating whether the product is on sale.

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/001-quickstart/index.js" id="new_doc":::

Create an doc in the collect by calling [``Collection.UpdateOne``](https://mongodb.github.io/node-mongodb-native/4.5/classes/Collection.html#updateOne). In this example, we chose to *upsert* instead of *create* a new doc in case you run this sample code more than once.

### Get a doc

In Azure Cosmos DB, you can perform a less-expensive [point read](https://devblogs.microsoft.com/cosmosdb/point-reads-versus-queries/) operation by using both the unique identifier (``_id``) and partition key (``category``). 

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/001-quickstart/index.js" id="read_doc" :::

### Query docs

After you insert a doc, you can run a query to get all docs that match a specific filter. This example finds all docs that match a specific category: `gear-surf-surfboards`. Once the query is defined, call [``Collection.find``](https://mongodb.github.io/node-mongodb-native/4.5/classes/Collection.html#find) to get a result. 

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/001-quickstart/index.js" id="query_docs" :::

## Run the code

This app creates a MongoDB API database and collection. The example then creates a doc and then reads the exact same doc back. Finally, the example issues a query that should only return that single doc. With each step, the example outputs metadata to the console about the steps it has performed.

To run the app, use a terminal to navigate to the application directory and run the application.

```dotnetcli
node index.js
```

The output of the app should be similar to this example:

```output
New database:   adventureworks
New collection: products
Created doc:    68719518391     [gear-surf-surfboards]
Read doc:       68719518391     [gear-surf-surfboards]
1 filtered doc: 68719518391     [gear-surf-surfboards]
done
```

## Clean up resources

When you no longer need the Azure Cosmos DB SQL API account, you can delete the corresponding resource group.

#### [Azure CLI](#tab/azure-cli)

Use the [``az group delete``](/cli/azure/group#az-group-delete) command to delete the resource group.

```azurecli-interactive
az group delete --name $resourceGroupName
```

#### [PowerShell](#tab/azure-powershell)

Use the [``Remove-AzResourceGroup``](/powershell/module/az.resources/remove-azresourcegroup) cmdlet to delete the resource group.

```azurepowershell-interactive
$parameters = @{
    Name = $RESOURCE_GROUP_NAME
}
Remove-AzResourceGroup @parameters
```

#### [Portal](#tab/azure-portal)

1. Navigate to the resource group you previously created in the Azure portal.

    > [!TIP]
    > In this quickstart, we recommended the name ``msdocs-cosmos-dotnet-quickstart-rg``.
1. Select **Delete resource group**.

   :::image type="content" source="media/quickstart-javascript/delete-resource-group-option.png" lightbox="media/quickstart-javascript/delete-resource-group-option.png" alt-text="Screenshot of the Delete resource group option in the navigation bar for a resource group.":::

1. On the **Are you sure you want to delete** dialog, enter the name of the resource group, and then select **Delete**.

   :::image type="content" source="media/quickstart-javascript/delete-confirmation.png" lightbox="media/quickstart-javascript/delete-confirmation.png" alt-text="Screenshot of the delete confirmation page for a resource group.":::

---

## Next steps

In this quickstart, you learned how to create an Azure Cosmos DB MongoDB API account, create a database, and create a collection using the mongoDB driver. You can now dive deeper into the Cosmos DB MongoDB API to import more data, perform complex queries, and manage your Azure Cosmos DB MongoDB resources.

> [!div class="nextstepaction"]
> [Migrate MongoDB to Azure Cosmos DB API for MongoDB offline](/azure/dms/tutorial-mongodb-cosmos-db?toc=%2Fazure%2Fcosmos-db%2Ftoc.json%3Ftoc%3D%2Fazure%2Fcosmos-db%2Ftoc.json)
