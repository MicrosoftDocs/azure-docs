---
title: 'Quickstart: Gremlin library for Python'
titleSuffix: Azure Cosmos DB for Apache Gremlin
description: In this quickstart, connect to Azure Cosmos DB for Apache Gremlin using Python. Then, create and traverse vertices and edges.
author: manishmsfte
ms.author: mansha
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: apache-gremlin
ms.custom: devx-track-azurecli, devx-track-python
ms.topic: quickstart-sdk
ms.date: 09/27/2023
# CustomerIntent: As a Python developer, I want to use a library for my programming language so that I can create and traverse vertices and edges in code.
---

# Quickstart: Azure Cosmos DB for Apache Gremlin library for Python

[!INCLUDE[Gremlin](../includes/appliesto-gremlin.md)]

[!INCLUDE[Gremlin devlang](includes/quickstart-devlang.md)]

Azure Cosmos DB for Apache Gremlin is a fully managed graph database service implementing the popular [`Apache Tinkerpop`](https://tinkerpop.apache.org/), a graph computing framework using the Gremlin query language. The API for Gremlin gives you a low-friction way to get started using Gremlin with a service that can grow and scale out as much as you need with minimal management.

In this quickstart, you use the `gremlinpython` library to connect to a newly created Azure Cosmos DB for Gremlin account.

[Library source code](https://github.com/apache/tinkerpop/tree/master/gremlin-python/src/main/python) | [Package (PyPi)](https://pypi.org/project/gremlinpython/)

## Prerequisites

- An Azure account with an active subscription.
  - No Azure subscription? [Sign up for a free Azure account](https://azure.microsoft.com/free/).
  - Don't want an Azure subscription? You can [try Azure Cosmos DB free](../try-free.md) with no subscription required.
- [Python (latest)](https://www.python.org/)
  - Don't have Python installed? Try this quickstart in [GitHub Codespaces](https://codespaces.new/github/codespaces-blank?quickstart=1).
- [Azure Command-Line Interface (CLI)](/cli/azure/)

[!INCLUDE[Cloud Shell](../../../includes/cloud-shell-try-it.md)]

## Setting up

This section walks you through creating an API for Gremlin account and setting up a Python project to use the library to connect to the account.

### Create an API for Gremlin account

The API for Gremlin account should be created prior to using the Python library. Additionally, it helps to also have the database and graph in place.

[!INCLUDE[Create account, database, and graph](includes/create-account-database-graph-cli.md)]

### Create a new Python console application

Create a Python console application in an empty folder using your preferred terminal.

1. Open your terminal in an empty folder.

1. Create the **app.py** file.

    ```bash
    touch app.py
    ```

### Install the PyPI package

Add the `gremlinpython` PyPI package to the Python project.

1. Create the **requirements.txt** file.

    ```bash
    touch requirements.txt
    ```

1. Add the `gremlinpython` package from the Python Package Index to the requirements file.

    ```requirements
    gremlinpython==3.7.0
    ```

1. Install all the requirements to your project.

    ```bash
    python install -r requirements.txt
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

1. Open the **app.py** file.

1. Import `client` and `serializer` from the `gremlin_python.driver` module.

    :::code language="python" source="~/cosmos-db-apache-gremlin-python-samples/001-quickstart/app.py" id="imports":::

    > [!WARNING]
    > Depending on your version of Python, you may also need to import `asyncio` and override the event loop policy:
    >
    > :::code language="python" source="~/cosmos-db-apache-gremlin-python-samples/001-quickstart/app.py" id="import_async_bug_fix":::
    >

1. Create `ACCOUNT_NAME` and `ACCOUNT_KEY` variables. Store the `COSMOS_GREMLIN_ENDPOINT` and `COSMOS_GREMLIN_KEY` environment variables as the values for each respective variable.

    :::code language="python" source="~/cosmos-db-apache-gremlin-python-samples/001-quickstart/app.py" id="environment_variables":::

1. Use `Client` to connect using the account's credentials and the **GraphSON 2.0** serializer.

    :::code language="python" source="~/cosmos-db-apache-gremlin-python-samples/001-quickstart/app.py" id="authenticate_connect_client":::

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

    :::code language="python" source="~/cosmos-db-apache-gremlin-python-samples/001-quickstart/app.py" id="create_vertices_1":::

1. Create a second **product** vertex with these properties:

    | | Value |
    | --- | --- |
    | **label** | `product` |
    | **id** | `68719518403` |
    | **`name`** | `Montau Turtle Surfboard` |
    | **`price`** | `600.00` |
    | **`category`** | `surfboards` |

    :::code language="python" source="~/cosmos-db-apache-gremlin-python-samples/001-quickstart/app.py" id="create_vertices_2":::

1. Create a third **product** vertex with these properties:

    | | Value |
    | --- | --- |
    | **label** | `product` |
    | **id** | `68719518409` |
    | **`name`** | `Bondi Twin Surfboard` |
    | **`price`** | `585.50` |
    | **`category`** | `surfboards` |

    :::code language="python" source="~/cosmos-db-apache-gremlin-python-samples/001-quickstart/app.py" id="create_vertices_3":::

### Create edges

Create edges using the Gremlin syntax to define relationships between vertices.

1. Create an edge from the `Montau Turtle Surfboard` product named **replaces** to the `Kiama classic surfboard` product.

    :::code language="python" source="~/cosmos-db-apache-gremlin-python-samples/001-quickstart/app.py" id="create_edges_1":::

    > [!TIP]
    > This edge defintion uses the `g.V(['<partition-key>', '<id>'])` syntax. Alternatively, you can use `g.V('<id>').has('category', '<partition-key>')`.

1. Create another **replaces** edge from the same product to the `Bondi Twin Surfboard`.

    :::code language="python" source="~/cosmos-db-apache-gremlin-python-samples/001-quickstart/app.py" id="create_edges_2":::

### Query vertices &amp; edges

Use the Gremlin syntax to traverse the graph and discover relationships between vertices.

1. Traverse the graph and find all vertices that `Montau Turtle Surfboard` replaces.

    :::code language="python" source="~/cosmos-db-apache-gremlin-python-samples/001-quickstart/app.py" id="query_vertices_edges":::

1. Write to the console the result of this traversal.

    :::code language="python" source="~/cosmos-db-apache-gremlin-python-samples/001-quickstart/app.py" id="output_vertices_edges":::

## Run the code

Validate that your application works as expected by running the application. The application should execute with no errors or warnings. The output of the application includes data about the created and queried items.

1. Open the terminal in the Python project folder.

1. Use `python <filename>` to run the application. Observe the output from the application.

    ```bash
    python app.py
    ```

## Clean up resources

When you no longer need the API for Gremlin account, delete the corresponding resource group.

[!INCLUDE[Delete account](includes/delete-account-cli.md)]

## Next step

> [!div class="nextstepaction"]
> [Create and query data using Azure Cosmos DB for Apache Gremlin](tutorial-query.md)
