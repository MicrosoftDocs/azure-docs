---
title: 'Quickstart: Gremlin library for Node.js'
titleSuffix: Azure Cosmos DB for Apache Gremlin
description: In this quickstart, connect to Azure Cosmos DB for Apache Gremlin using Node.js. Then, create and traverse vertices and edges.
author: manishmsfte
ms.author: mansha
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: apache-gremlin
ms.custom: devx-track-azurecli, devx-track-js
ms.topic: quickstart-sdk
ms.date: 09/27/2023
# CustomerIntent: As a Node.js developer, I want to use a library for my programming language so that I can create and traverse vertices and edges in code.
---

# Quickstart: Azure Cosmos DB for Apache Gremlin library for Node.js

[!INCLUDE[Gremlin](../includes/appliesto-gremlin.md)]

[!INCLUDE[Gremlin devlang](includes/quickstart-devlang.md)]

Azure Cosmos DB for Apache Gremlin is a fully managed graph database service implementing the popular [`Apache Tinkerpop`](https://tinkerpop.apache.org/), a graph computing framework using the Gremlin query language. The API for Gremlin gives you a low-friction way to get started using Gremlin with a service that can grow and scale out as much as you need with minimal management.

In this quickstart, you use the `gremlin` library to connect to a newly created Azure Cosmos DB for Gremlin account.

[Library source code](https://github.com/apache/tinkerpop/tree/master/gremlin-javascript/src/main/javascript/gremlin-javascript) | [Package (npm)](https://www.npmjs.com/package/gremlin)

## Prerequisites

- An Azure account with an active subscription.
  - No Azure subscription? [Sign up for a free Azure account](https://azure.microsoft.com/free/).
  - Don't want an Azure subscription? You can [try Azure Cosmos DB free](../try-free.md) with no subscription required.
- [Node.js (LTS)](https://nodejs.org/)
  - Don't have Node.js installed? Try this quickstart in [GitHub Codespaces](https://codespaces.new/github/codespaces-blank?quickstart=1).codespaces.new/github/codespaces-blank?quickstart=1)
- [Azure Command-Line Interface (CLI)](/cli/azure/)

[!INCLUDE[Cloud Shell](../../../includes/cloud-shell-try-it.md)]

## Setting up

This section walks you through creating an API for Gremlin account and setting up a Node.js project to use the library to connect to the account.

### Create an API for Gremlin account

The API for Gremlin account should be created prior to using the Node.js library. Additionally, it helps to also have the database and graph in place.

[!INCLUDE[Create account, database, and graph](includes/create-account-database-graph-cli.md)]

### Create a new Node.js console application

Create a Node.js console application in an empty folder using your preferred terminal.

1. Open your terminal in an empty folder.

1. Initialize a new module

    ```bash
    npm init es6 --yes
    ```

1. Create the **app.js** file

    ```bash
    touch app.js
    ```

### Install the npm package

Add the `gremlin` npm package to the Node.js project.

1. Open the **package.json** file and replace the contents with this JSON configuration.

    ```json
    {
      "main": "app.js",
      "type": "module",
      "scripts": {
        "start": "node app.js"
      },
      "dependencies": {
        "gremlin": "^3.*"
      }
    }
    ```

1. Use the `npm install` command to install all packages specified in the **package.json** file.

    ```bash
    npm install
    ```

### Configure environment variables

To use the *NAME* and *URI* values obtained earlier in this quickstart, persist them to new environment variables on the local machine running the application.

1. To set the environment variable, use your terminal to persist the values as `COSMOS_ENDPOINT` and `COSMOS_KEY` respectively.

    ```bash
    export COSMOS_GREMLIN_ENDPOINT="<account-name>"
    export COSMOS_GREMLIN_KEY="<account-key>"
    ```

1. Validate that the environment variables were set correctly.

    ```bash
    printenv COSMOS_GREMLIN_ENDPOINT
    printenv COSMOS_GREMLIN_KEY
    ```

## Code examples

- [Authenticate the client](#authenticate-the-client)
- [Create vertices](#create-vertices)
- [Create edges](#create-edges)
- [Query vertices &amp; edges](#query-vertices--edges)

The code in this article connects to a database named `cosmicworks` and a graph named `products`. The code then adds vertices and edges to the graph before traversing the added items.

### Authenticate the client

Application requests to most Azure services must be authorized. For the API for Gremlin, use the *NAME* and *URI* values obtained earlier in this quickstart.

1. Open the **app.js** file.

1. Import the `gremlin` module.

    :::code language="javascript" source="~/cosmos-db-apache-gremlin-javascript-samples/001-quickstart/app.js" id="imports":::

1. Create `accountName` and `accountKey` variables. Store the `COSMOS_GREMLIN_ENDPOINT` and `COSMOS_GREMLIN_KEY` environment variables as the values for each respective variable.

    :::code language="javascript" source="~/cosmos-db-apache-gremlin-javascript-samples/001-quickstart/app.js" id="environment_variables":::

1. Use `PlainTextSaslAuthenticator` to create a new object for the account's credentials.

    :::code language="javascript" source="~/cosmos-db-apache-gremlin-javascript-samples/001-quickstart/app.js" id="authenticate_client":::

1. Use `Client` to connect using the remote server credentials and the **GraphSON 2.0** serializer. Then, use `Open` to create a new connection to the server.

    :::code language="javascript" source="~/cosmos-db-apache-gremlin-javascript-samples/001-quickstart/app.js" id="connect_client":::

### Create vertices

Now that the application is connected to the account, use the standard Gremlin syntax to create vertices.

1. Use `submit` to run a command server-side on the API for Gremlin account. Create a **product** vertex with the following properties:

    | | Value |
    | --- | --- |
    | **label** | `product` |
    | **id** | `68719518371` |
    | **`name`** | `Kiama classic surfboard` |
    | **`price`** | `285.55` |
    | **`category`** | `surfboards` |

    :::code language="javascript" source="~/cosmos-db-apache-gremlin-javascript-samples/001-quickstart/app.js" id="create_vertices_1":::

1. Create a second **product** vertex with these properties:

    | | Value |
    | --- | --- |
    | **label** | `product` |
    | **id** | `68719518403` |
    | **`name`** | `Montau Turtle Surfboard` |
    | **`price`** | `600.00` |
    | **`category`** | `surfboards` |

    :::code language="javascript" source="~/cosmos-db-apache-gremlin-javascript-samples/001-quickstart/app.js" id="create_vertices_2":::

1. Create a third **product** vertex with these properties:

    | | Value |
    | --- | --- |
    | **label** | `product` |
    | **id** | `68719518409` |
    | **`name`** | `Bondi Twin Surfboard` |
    | **`price`** | `585.50` |
    | **`category`** | `surfboards` |

    :::code language="javascript" source="~/cosmos-db-apache-gremlin-javascript-samples/001-quickstart/app.js" id="create_vertices_3":::

### Create edges

Create edges using the Gremlin syntax to define relationships between vertices.

1. Create an edge from the `Montau Turtle Surfboard` product named **replaces** to the `Kiama classic surfboard` product.

    :::code language="javascript" source="~/cosmos-db-apache-gremlin-javascript-samples/001-quickstart/app.js" id="create_edges_1":::

    > [!TIP]
    > This edge defintion uses the `g.V(['<partition-key>', '<id>'])` syntax. Alternatively, you can use `g.V('<id>').has('category', '<partition-key>')`.

1. Create another **replaces** edge from the same product to the `Bondi Twin Surfboard`.

    :::code language="javascript" source="~/cosmos-db-apache-gremlin-javascript-samples/001-quickstart/app.js" id="create_edges_2":::

### Query vertices &amp; edges

Use the Gremlin syntax to traverse the graph and discover relationships between vertices.

1. Traverse the graph and find all vertices that `Montau Turtle Surfboard` replaces.

    :::code language="javascript" source="~/cosmos-db-apache-gremlin-javascript-samples/001-quickstart/app.js" id="query_vertices_edges":::

1. Write to the console the result of this traversal.

    :::code language="javascript" source="~/cosmos-db-apache-gremlin-javascript-samples/001-quickstart/app.js" id="output_vertices_edges":::

## Run the code

Validate that your application works as expected by running the application. The application should execute with no errors or warnings. The output of the application includes data about the created and queried items.

1. Open the terminal in the Node.js project folder.

1. Use `npm <script>` to run the application. Observe the output from the application.

    ```bash
    npm start
    ```

## Clean up resources

When you no longer need the API for Gremlin account, delete the corresponding resource group.

[!INCLUDE[Delete account](includes/delete-account-cli.md)]

## Next step

> [!div class="nextstepaction"]
> [Create and query data using Azure Cosmos DB for Apache Gremlin](tutorial-query.md)
