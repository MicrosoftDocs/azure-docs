---
title: 'Quickstart: Traverse vertices & edges with the console'
titleSuffix: Azure Cosmos DB for Apache Gremlin
description: In this quickstart, connect to an Azure Cosmos DB for Apache Gremlin account using the console. Then; create vertices, create edges, and traverse them.
author: manishmsfte
ms.author: mansha
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: apache-gremlin
ms.custom: devx-track-azurecli
ms.topic: quickstart
ms.date: 09/27/2023
# CustomerIntent: As a developer, I want to use the Gremlin console so that I can manually create and traverse vertices and edges.
---

# Quickstart: Traverse vertices and edges with the Gremlin console and Azure Cosmos DB for Apache Gremlin

[!INCLUDE[Gremlin](../includes/appliesto-gremlin.md)]

[!INCLUDE[Gremlin devlang](includes/quickstart-devlang.md)]

Azure Cosmos DB for Apache Gremlin is a fully managed graph database service implementing the popular [`Apache Tinkerpop`](https://tinkerpop.apache.org/), a graph computing framework using the Gremlin query language. The API for Gremlin gives you a low-friction way to get started using Gremlin with a service that can grow and scale out as much as you need with minimal management.

In this quickstart, you use the Gremlin console to connect to a newly created Azure Cosmos DB for Gremlin account.

## Prerequisites

- An Azure account with an active subscription.
  - No Azure subscription? [Sign up for a free Azure account](https://azure.microsoft.com/free/).
  - Don't want an Azure subscription? You can [try Azure Cosmos DB free](../try-free.md) with no subscription required.
- [Docker host](https://www.docker.com/)
  - Don't have Docker installed? Try this quickstart in [GitHub Codespaces](https://codespaces.new/github/codespaces-blank?quickstart=1).
- [Azure Command-Line Interface (CLI)](/cli/azure/)

[!INCLUDE[Cloud Shell](../../../includes/cloud-shell-try-it.md)]

## Create an API for Gremlin account and relevant resources

The API for Gremlin account should be created prior to using the Gremlin console. Additionally, it helps to also have the database and graph in place.

[!INCLUDE[Create account, database, and graph](includes/create-account-database-graph-cli.md)]

## Start and configure the Gremlin console using Docker

For the gremlin console, this quickstart uses the `tinkerpop/gremlin-console` container image from Docker Hub. This image ensures that you're using the appropriate version of the console (`3.4`) for connection with the API for Gremlin. Once the console is running, connect from your local Docker host to the remote API for Gremlin account.

1. Pull the `3.4` version of the `tinkerpop/gremlin-console` container image.

    ```bash
    docker pull tinkerpop/gremlin-console:3.4
    ```

1. Create an empty working folder. In the empty folder, create a **remote-secure.yaml** file. Add this YAML configuration to the file.

    ```yml
    hosts: [<account-name>.gremlin.cosmos.azure.com]
    port: 443
    username: /dbs/cosmicworks/colls/products
    password: <account-key>
    connectionPool: {
      enableSsl: true,
      sslEnabledProtocols: [TLSv1.2]
    }
    serializer: {
      className: org.apache.tinkerpop.gremlin.driver.ser.GraphSONMessageSerializerV2d0,
      config: {
        serializeResultToString: true
      }
    }
    ```

    > [!NOTE]
    > Replace the `<account-name>` and `<account-key>` placeholders with the *NAME* and *KEY* values obtained earlier in this quickstart.

1. Open a new terminal in the context of your working folder that includes the **remote-secure.yaml** file.

1. Run the Docker container image in interactive (`--interactive --tty`) mode. Ensure that you mount the current working folder to the `/opt/gremlin-console/conf/` path within the container.

    ```bash
    docker run -it --mount type=bind,source=.,target=/opt/gremlin-console/conf/ tinkerpop/gremlin-console:3.4
    ```

1. Within the Gremlin console container, connect to the remote (API for Gremlin) account using the **remote-secure.yaml** configuration file.

    ```gremlin
    :remote connect tinkerpop.server conf/remote-secure.yaml
    ```

## Create and traverse vertices and edges

Now that the console is connected to the account, use the standard Gremlin syntax to create and traverse both vertices and edges.

1. Add a vertex for a **product** with the following properties:

    | | Value |
    | --- | --- |
    | **label** | `product` |
    | **id** | `68719518371` |
    | **`name`** | `Kiama classic surfboard` |
    | **`price`** | `285.55` |
    | **`category`** | `surfboards` |

    ```gremlin
    :> g.addV('product').property('id', '68719518371').property('name', 'Kiama classic surfboard').property('price', 285.55).property('category', 'surfboards')
    ```

    > [!IMPORTANT]
    > Don't foget the `:>` prefix. THis prefix is required to run the command remotely.

1. Add another **product** vertex with these properties:

    | | Value |
    | --- | --- |
    | **label** | `product` |
    | **id** | `68719518403` |
    | **`name`** | `Montau Turtle Surfboard` |
    | **`price`** | `600` |
    | **`category`** | `surfboards` |

    ```gremlin
    :> g.addV('product').property('id', '68719518403').property('name', 'Montau Turtle Surfboard').property('price', 600).property('category', 'surfboards')
    ```

1. Create an **edge** named `replaces` to define a relationship between the two products.

    ```gremlin
    :> g.V(['surfboards', '68719518403']).addE('replaces').to(g.V(['surfboards', '68719518371']))
    ```

1. Count all vertices within the graph.

    ```gremlin
    :> g.V().count()
    ```

1. Traverse the graph to find all vertices that replaces the `Kiama classic surfboard`.

    ```gremlin
    :> g.V().hasLabel('product').has('category', 'surfboards').has('name', 'Kiama classic surfboard').inE('replaces').outV()
    ```

1. Traverse the graph to find all vertices that `Montau Turtle Surfboard` replaces.

    ```gremlin
    :> g.V().hasLabel('product').has('category', 'surfboards').has('name', 'Montau Turtle Surfboard').outE('replaces').inV()
    ```

## Clean up resources

When you no longer need the API for Gremlin account, delete the corresponding resource group.

[!INCLUDE[Delete account](includes/delete-account-cli.md)]

## How did we solve the problem?

Azure Cosmos DB for Apache Gremlin solved our problem by offering Gremlin as a service. With this offering, you aren't required to stand up your own Gremlin server instances or manage your own infrastructure. Even more, you can scale your solution as your needs grow over time.

To connect to the API for Gremlin account, you used the `tinkerpop/gremlin-console` container image to run the gremlin console in a manner that didn't require a local installation. Then, you used the configuration stored in the **remote-secure.yaml** file to connect from the running container the API for Gremlin account. From there, you ran multiple common Gremlin commands.

## Next step

> [!div class="nextstepaction"]
> [Create and query data using Azure Cosmos DB for Apache Gremlin](tutorial-query.md)
