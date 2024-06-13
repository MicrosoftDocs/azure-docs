---
title: Quickstart - Java client library
titleSuffix: Azure Cosmos DB for NoSQL
description: Deploy a Java Spring Web application that uses the client library to interact with Azure Cosmos DB for NoSQL data in this quickstart.
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: java
ms.custom: devx-track-extended-java, devx-track-extended-azdevcli
ms.topic: quickstart-sdk
ms.date: 01/08/2024
zone_pivot_groups: azure-cosmos-db-quickstart-env
# CustomerIntent: As a developer, I want to learn the basics of the Java library so that I can build applications with Azure Cosmos DB for NoSQL.
---

# Quickstart: Azure Cosmos DB for NoSQL library for Java

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

[!INCLUDE[Developer Quickstart selector](includes/quickstart/dev-selector.md)]

Get started with the Azure Cosmos DB for NoSQL client library for Java to query data in your containers and perform common operations on individual items. Follow these steps to deploy a minimal solution to your environment using the Azure Developer CLI.

[API reference documentation](/java/api/overview/azure/cosmos-readme) | [Library source code](https://github.com/azure/azure-sdk-for-java/tree/main/sdk/cosmos/azure-cosmos) | [Package (Maven)](https://central.sonatype.com/artifact/com.azure/azure-cosmos) | [Azure Developer CLI](/azure/developer/azure-developer-cli/overview)

## Prerequisites

[!INCLUDE[Developer Quickstart prerequisites](includes/quickstart/dev-prereqs.md)]

## Setting up

Deploy this project's development container to your environment. Then, use the Azure Developer CLI (`azd`) to create an Azure Cosmos DB for NoSQL account and deploy a containerized sample application. The sample application uses the client library to manage, create, read, and query sample data.

::: zone pivot="devcontainer-codespace"

[![Open in GitHub Codespaces](https://img.shields.io/static/v1?style=for-the-badge&label=GitHub+Codespaces&message=Open&color=brightgreen&logo=github)](https://codespaces.new/azure-samples/cosmos-db-nosql-java-quickstart?template=false&quickstart=1&azure-portal=true)

::: zone-end

::: zone pivot="devcontainer-vscode"

[![Open in Dev Container](https://img.shields.io/static/v1?style=for-the-badge&label=Dev+Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/azure-samples/cosmos-db-nosql-java-quickstart)

::: zone-end

[!INCLUDE[Developer Quickstart setup](includes/quickstart/dev-setup.md)]

### Install the client library

The client library is available through Maven, as the `azure-spring-data-cosmos` package.

1. Navigate to the `/src/web` folder and open the **pom.xml** file.

1. If it doesn't already exist, add an entry for the `azure-spring-data-cosmos` package.

    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-spring-data-cosmos</artifactId>
    </dependency>
    ```

1. Also, add another dependency for the `azure-identity` package if it doesn't already exist.

    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity</artifactId>
    </dependency>
    ```

## Object model

| Name | Description |
| --- | --- |
| `EnableCosmosRepositories` | This type is a method decorator used to configure a repository to access Azure Cosmos DB for NoSQL. |
| `CosmosRepository` | This class is the primary client class and is used to manage data within a container. |
| `CosmosClientBuilder` | This class is a factory used to create a client used by the repository. |
| `Query` | This type is a method decorator used to specify the query that the repository executes. |

## Code examples

- [Authenticate the client](#authenticate-the-client)
- [Get a database](#get-a-database)
- [Get a container](#get-a-container)
- [Create an item](#create-an-item)
- [Get an item](#read-an-item)
- [Query items](#query-items)

[!INCLUDE[Developer Quickstart sample explanation](includes/quickstart/dev-sample-primer.md)]

### Authenticate the client

[!INCLUDE[Developer Quickstart authentication explanation](includes/quickstart/dev-auth-primer.md)]

First, this sample creates a new class that inherits from `AbstractCosmosConfiguration` to configure the connection to Azure Cosmos DB for NoSQL.

:::code language="java" source="~/cosmos-db-nosql-java-quickstart/src/web/src/main/java/com/microsoft/learn/azure/cosmosdb/nosql/quickstart/CosmosConfiguration.java" id="repository_configuration":::

Within the configuration class, this sample creates a new instance of the `CosmosClientBuilder` class and configures authentication using a `DefaultAzureCredential` instance.

:::code language="java" source="~/cosmos-db-nosql-java-quickstart/src/web/src/main/java/com/microsoft/learn/azure/cosmosdb/nosql/quickstart/CosmosConfiguration.java" id="create_client" highlight="6-8":::

### Get a database

In the configuration class, the sample implements a method to return the name of the existing database named *`cosmicworks`*.

:::code language="java" source="~/cosmos-db-nosql-java-quickstart/src/web/src/main/java/com/microsoft/learn/azure/cosmosdb/nosql/quickstart/CosmosConfiguration.java" id="get_database":::

### Get a container

Use the `Container` method decorator to configure a class to represent items in a container. Author the class to include all of the members you want to serialize into JSON. In this example, the type has a unique identifier, and fields for category, name, quantity, price, and clearance.

:::code language="java" source="~/cosmos-db-nosql-java-quickstart/src/web/src/main/java/com/microsoft/learn/azure/cosmosdb/nosql/quickstart/Item.java" id="get_container" highlight="1":::

### Create an item

Create an item in the container using `repository.save`.

:::code language="java" source="~/cosmos-db-nosql-java-quickstart/src/web/src/main/java/com/microsoft/learn/azure/cosmosdb/nosql/quickstart/StartController.java" id="create_item" highlight="8":::

### Read an item

Perform a point read operation by using both the unique identifier (`id`) and partition key fields. Use `repository.findById` to efficiently retrieve the specific item.

:::code language="java" source="~/cosmos-db-nosql-java-quickstart/src/web/src/main/java/com/microsoft/learn/azure/cosmosdb/nosql/quickstart/StartController.java" id="read_item" highlight="2":::

### Query items

Perform a query over multiple items in a container by defining a query in the repository's interface. This sample uses the `Query` method decorator to define a method that executes this parameterized query:

```nosql
SELECT * FROM products p WHERE p.category = @category
```

:::code language="java" source="~/cosmos-db-nosql-java-quickstart/src/web/src/main/java/com/microsoft/learn/azure/cosmosdb/nosql/quickstart/ItemRepository.java" id="repository_implementation" highlight="3":::

Fetch all of the results of the query using `repository.getItemsByCategory`. Loop through the results of the query.

:::code language="java" source="~/cosmos-db-nosql-java-quickstart/src/web/src/main/java/com/microsoft/learn/azure/cosmosdb/nosql/quickstart/StartController.java" id="query_items" highlight="1":::

## Related content

- [.NET Quickstart](quickstart-dotnet.md)
- [JavaScript/Node.js Quickstart](quickstart-nodejs.md)
- [java Quickstart](quickstart-java.md)
- [Go Quickstart](quickstart-go.md)

## Next step

> [!div class="nextstepaction"]
> [Tutorial: Build a Java web app](tutorial-java-web-app.md)
