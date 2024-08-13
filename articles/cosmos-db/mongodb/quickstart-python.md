---
title: Quickstart - Azure Cosmos DB for MongoDB for Python with MongoDB driver
description: Learn how to build a Python app to manage Azure Cosmos DB for MongoDB account resources in this quickstart.
author: diberry
ms.author: diberry
ms.reviewer: sidandrews
ms.service: azure-cosmos-db
ms.subservice: mongodb
ms.devlang: python
ms.topic: quickstart
ms.date: 08/01/2024
ms.custom: devx-track-azurecli, devx-track-python
zone_pivot_groups: azure-cosmos-db-quickstart-env
---

# Quickstart: Azure Cosmos DB for MongoDB for Python with MongoDB driver

[!INCLUDE[MongoDB](~/reusable-content/ce-skilling/azure/includes/cosmos-db/includes/appliesto-mongodb.md)]

[!INCLUDE[Developer Quickstart selector](includes/quickstart-dev-selector.md)]

Get started with MongoDB to create databases, collections, and docs within your Azure Cosmos DB resource. Follow these steps to deploy a minimal solution to your environment using the Azure Developer CLI.

[API for MongoDB reference documentation](https://www.mongodb.com/docs/drivers/python-drivers/) | [pymongo package](https://pypi.org/project/pymongo/)
 | [Azure Developer CLI](/azure/developer/azure-developer-cli/overview)

## Prerequisites

[!INCLUDE [Developer Quickstart prerequisites](includes/quickstart-dev-prereqs.md)]

## Setting up

Deploy this project's development container to your environment. Then, use the Azure Developer CLI (`azd`) to create an Azure Cosmos DB for MongoDB account and deploy a containerized sample application. The sample application uses the client library to manage, create, read, and query sample data.

::: zone pivot="devcontainer-codespace"

[![Open in GitHub Codespaces](https://img.shields.io/static/v1?style=for-the-badge&label=GitHub+Codespaces&message=Open&color=brightgreen&logo=github)](https://codespaces.new/alexwolfmsft/cosmos-db-mongodb-python-quickstart?template=false&quickstart=1&azure-portal=true)

::: zone-end

::: zone pivot="devcontainer-vscode"

[![Open in Dev Container](https://img.shields.io/static/v1?style=for-the-badge&label=Dev+Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/alexwolfmsft/cosmos-db-mongodb-python-quickstart)

::: zone-end

::: zone pivot="devcontainer-codespace"

> [!IMPORTANT]
> GitHub accounts include an entitlement of storage and core hours at no cost. For more information, see [included storage and core hours for GitHub accounts](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

::: zone-end

::: zone pivot="devcontainer-vscode"

::: zone-end

1. Open a terminal in the root directory of the project.

1. Authenticate to the Azure Developer CLI using `azd auth login`. Follow the steps specified by the tool to authenticate to the CLI using your preferred Azure credentials.

    ```azurecli
    azd auth login
    ```

1. Use `azd init` to initialize the project.

    ```azurecli
    azd init --template cosmos-db-mongodb-python-quickstart
    ```

    > [!NOTE]
    > This quickstart uses the [azure-samples/cosmos-db-mongodb-python-quickstart](https://github.com/alexwolfmsft/cosmos-db-mongodb-python-quickstart) template GitHub repository. The Azure Developer CLI automatically clones this project to your machine if it is not already there.

1. During initialization, configure a unique environment name.

    > [!TIP]
    > The environment name will also be used as the target resource group name. For this quickstart, consider using `msdocs-cosmos-db`.

1. Deploy the Azure Cosmos DB account using `azd up`. The Bicep templates also deploy a sample web application.

    ```azurecli
    azd up
    ```

1. During the provisioning process, select your subscription and desired location. Wait for the provisioning process to complete. The process can take **approximately five minutes**.

1. Once the provisioning of your Azure resources is done, a URL to the running web application is included in the output.

    ```output
    Deploying services (azd deploy)
    
      (✓) Done: Deploying service web
    - Endpoint: <https://[container-app-sub-domain].azurecontainerapps.io>
    
    SUCCESS: Your application was provisioned and deployed to Azure in 5 minutes 0 seconds.
    ```

1. Use the URL in the console to navigate to your web application in the browser. Observe the output of the running app.

    :::image type="content" source="media/quickstart-python/cosmos-python-app.png" alt-text="Screenshot of the running web application.":::

---

### Install the client library

1. Create a `requirements.txt` file in your app directory that lists the [PyMongo](https://www.mongodb.com/docs/drivers/pymongo/) and [python-dotenv](https://pypi.org/project/python-dotenv/) packages.

    ```bash
    # requirements.txt
    pymongo
    python-dotenv
    ```

1. Create a virtual environment and install the packages.

    ## [Windows](#tab/windows-package)

    ```bash
    # py -3 uses the global python interpreter. You can also use python3 -m venv .venv.
    py -3 -m venv .venv
    source .venv/Scripts/activate   
    pip install -r requirements.txt
    ```

    ## [Linux/macOS](#tab/linux-package)

    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    ```

    ---

## Object model

Let's look at the hierarchy of resources in the API for MongoDB and the object model that's used to create and access these resources. The Azure Cosmos DB creates resources in a hierarchy that consists of accounts, databases, collections, and documents.

:::image type="complex" source="media/quickstart-nodejs/resource-hierarchy.png" alt-text="Diagram of the Azure Cosmos DB hierarchy including accounts, databases, collections, and docs.":::
    Hierarchical diagram showing an Azure Cosmos DB account at the top. The account has two child database shards. One of the database shards includes two child collection shards. The other database shard includes a single child collection shard. That single collection shard has three child doc shards.
:::image-end:::

Each type of resource is represented by a Python class. Here are the most common classes:

* [MongoClient](https://pymongo.readthedocs.io/en/stable/api/pymongo/mongo_client.html) - The first step when working with PyMongo is to create a MongoClient to connect to Azure Cosmos DB's API for MongoDB. The client object is used to configure and execute requests against the service.

* [Database](https://pymongo.readthedocs.io/en/stable/api/pymongo/database.html) - Azure Cosmos DB's API for MongoDB can support one or more independent databases.

* [Collection](https://pymongo.readthedocs.io/en/stable/api/pymongo/database.html) - A database can contain one or more collections. A collection is a group of documents stored in MongoDB, and can be thought of as roughly the equivalent of a table in a relational database.

* [Document](https://pymongo.readthedocs.io/en/stable/tutorial.html#documents) - A document is a set of key-value pairs. Documents have dynamic schema. Dynamic schema means that documents in the same collection don't need to have the same set of fields or structure. And common fields in a collection's documents may hold different types of data.

To learn more about the hierarchy of entities, see the [Azure Cosmos DB resource model](../resource-model.md) article.

## Code examples

* [Authenticate the client](#authenticate-the-client)
* [Get database](#get-database)
* [Get collection](#get-collection)
* [Create an index](#create-an-index)
* [Create a document](#create-a-document)
* [Get an document](#get-a-document)
* [Query documents](#query-documents)

The sample code described in this article creates a database named `adventureworks` with a collection named `products`. The `products` collection is designed to contain product details such as name, category, quantity, and a sale indicator. Each product also contains a unique identifier. The complete sample code is at https://github.com/Azure-Samples/azure-cosmos-db-mongodb-python-getting-started/tree/main/001-quickstart/.

For the steps below, the database won't use sharding and shows a synchronous application using the [PyMongo](https://www.mongodb.com/docs/drivers/pymongo/) driver. For asynchronous applications, use the [Motor](https://www.mongodb.com/docs/drivers/motor/) driver.

### Authenticate the client

1. In the project directory, create an *run.py* file. In your editor, add require statements to reference packages you'll use, including the PyMongo and python-dotenv packages.

    :::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="package_dependencies":::

2. Get the connection information from the environment variable defined in an *.env* file.

    :::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="client_credentials":::

3. Define constants you'll use in the code.

    :::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="constant_values":::

### Connect to Azure Cosmos DB's API for MongoDB

Use the [MongoClient](https://pymongo.readthedocs.io/en/stable/api/pymongo/mongo_client.html#pymongo.mongo_client.MongoClient) object to connect to your Azure Cosmos DB for MongoDB resource. The connect method returns a reference to the database.

:::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="connect_client":::

### Get database

Check if the database exists with [list_database_names](https://pymongo.readthedocs.io/en/stable/api/pymongo/mongo_client.html#pymongo.mongo_client.MongoClient.list_database_names) method. If the database doesn't exist, use the [create database extension command](./custom-commands.md#create-database) to create it with a specified provisioned throughput.

:::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="new_database":::

### Get collection

Check if the collection exists with the [list_collection_names](https://pymongo.readthedocs.io/en/stable/api/pymongo/database.html#pymongo.database.Database.list_collection_names) method. If the collection doesn't exist, use the [create collection extension command](./custom-commands.md#create-collection) to create it.

:::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="create_collection":::

### Create an index

Create an index using the [update collection extension command](./custom-commands.md#update-collection). You can also set the index in the create collection extension command. Set the index to `name` property in this example so that you can later sort with the cursor class [sort](https://pymongo.readthedocs.io/en/stable/api/pymongo/cursor.html#pymongo.cursor.Cursor.sort) method on product name.

:::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="create_index":::

### Create a document

Create a document with the *product* properties for the `adventureworks` database:

* A *category* property. This property can be used as the logical partition key.
* A *name* property.
* An inventory *quantity* property.
* A *sale* property, indicating whether the product is on sale.

:::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="new_doc":::

Create a document in the collection by calling the collection level operation [update_one](https://pymongo.readthedocs.io/en/stable/api/pymongo/collection.html#pymongo.collection.Collection.update_one). In this example, you'll *upsert* instead of *create* a new document. Upsert isn't necessary in this example because the product *name* is random. However, it's a good practice to upsert in case you run the code more than once and the product name is the same.

The result of the `update_one` operation contains the `_id` field value that you can use in subsequent operations. The *_id* property was created automatically.

### Get a document

Use the [find_one](https://pymongo.readthedocs.io/en/stable/api/pymongo/collection.html#pymongo.collection.Collection.find_one) method to get a document.

:::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="read_doc":::

In Azure Cosmos DB, you can perform a less-expensive [point read](https://devblogs.microsoft.com/cosmosdb/point-reads-versus-queries/) operation by using both the unique identifier (`_id`) and a partition key.

### Query documents

After you insert a doc, you can run a query to get all docs that match a specific filter. This example finds all docs that match a specific category: `gear-surf-surfboards`. Once the query is defined, call [`Collection.find`](https://pymongo.readthedocs.io/en/stable/api/pymongo/collection.html#pymongo.collection.Collection.find) to get a [`Cursor`](https://pymongo.readthedocs.io/en/stable/api/pymongo/cursor.html#pymongo.cursor.Cursor) result, and then use [sort](https://pymongo.readthedocs.io/en/stable/api/pymongo/cursor.html#pymongo.cursor.Cursor.sort).

:::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="query_docs":::

Troubleshooting:

* If you get an error such as `The index path corresponding to the specified order-by item is excluded.`, make sure you [created the index](#create-an-index).

## Run the code

This app creates an API for MongoDB database and collection and creates a document and then reads the exact same document back. Finally, the example issues a query that returns documents that match a specified product *category*. With each step, the example outputs information to the console about the steps it has performed.

To run the app, use a terminal to navigate to the application directory and run the application.

```console
python run.py
```

The output of the app should be similar to this example:

:::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="console_result":::

## Clean up resources

When you no longer need the Azure Cosmos DB for NoSQL account, you can delete the corresponding resource group.

### [Azure CLI](#tab/azure-cli)

Use the [``az group delete``](/cli/azure/group#az-group-delete) command to delete the resource group.

```azurecli-interactive
az group delete --name $resourceGroupName
```

### [PowerShell](#tab/azure-powershell)

Use the [``Remove-AzResourceGroup``](/powershell/module/az.resources/remove-azresourcegroup) cmdlet to delete the resource group.

```azurepowershell-interactive
$parameters = @{
    Name = $RESOURCE_GROUP_NAME
}
Remove-AzResourceGroup @parameters
```

### [Portal](#tab/azure-portal)

1. Navigate to the resource group you previously created in the [Azure portal](https://portal.azure.com).

1. Select **Delete resource group**.

1. On the **Are you sure you want to delete** dialog, enter the name of the resource group, and then select **Delete**.

---