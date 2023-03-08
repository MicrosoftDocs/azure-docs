---
title: |
  Tutorial: Build a Node.js web application
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: In this tutorial, create a Node.js web application that connects to an Azure Cosmos DB for MongoDB vCore cluster and manages documents within a collection.
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: tutorial
author: gahl-levy
ms.author: gahllevy
ms.reviewer: nayakshweta
ms.date: 03/07/2023
---

# Tutorial: Connect a Node.js web app with Azure Cosmos DB for MongoDB vCore

The [MERN (MongoDB, Express, React.js, Node.js) stack](https://www.mongodb.com/mern-stack) is a popular collection of technologies used to build many modern web applications. With Azure Cosmos DB for MongoDB vCore, you can build a new web application or migrate an existing application using MongoDB drivers that you're already familiar with. In this tutorial, you:

> [!div class="checklist"]
>
> - Clone and test the MERN application with a MongoDB container
> - Connect to your Azure Cosmos DB for MongoDB vCore cluster and populate with seed data
> - Connect and validate your application with the vCore cluster
> - Deploy your application to Azure App Service resources
>

## Prerequisites

To complete this tutorial, you need the following resources:

- An existing Azure Cosmos DB for MongoDB vCore cluster.
  - If you don't have an Azure subscription, [create an account for free](https://azure.microsoft.com/free).
  - If you have an existing Azure subscription, [create a new Azure Cosmos DB for MongoDB vCore cluster](quickstart-portal.md?tabs=azure-cli).
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [MongoDB Shell](https://www.mongodb.com/)

## Clone and test the MERN application with a MongoDB container

Start by taking the [sample application](https://github.com/azure-samples/msdocs-azure-cosmos-db-mongodb-mern-web-app) published to GitHub, cloning it to your local machine, and running it with a local MongoDB container.

1. Run a MongoDB container on your local machine

    ```bash
    docker run --detach --publish 65000:27017 mongo
    ```

1. TODO

    ```bash
    mongosh "mongodb://127.0.0.1:65000"
    ```

1. TODO

    ```bash
    use cosmicworks
    ```

1. TODO

    ```bash
    db.products.insertMany([
      { name: "Confira Watch", category: "watches", price: 105.00 },
      { name: "Diannis Watch", category: "watches", price: 98.00, sale: true },
      { name: "Peache Sunglasses", category: "sunglasses", price: 32.00, sale: false, sizes: [ "S", "M", "L" ] }
    ])
    ```

1. TODO

    ```bash
    db.products.find({})
    ```

1. TODO

    ```bash
    exit
    ```

1. In an empty directory, use `git clone` to clone the MERN application from GitHub.

    ```bash
    git clone https://github.com/azure-samples/msdocs-azure-cosmos-db-mongodb-mern-web-app.git .
    ```

1. TODO

    ```bash

    ```

1. TODO

    ```bash

    ```

1. TODO

    ```bash

    ```

1. TODO

    ```bash

    ```

1. TODO

    ```bash

    ```

1. TODO

    ```bash

    ```

1. TODO

    ```bash

    ```

1. TODO

    ```bash

    ```

1. TODO

    ```bash

    ```

1. TODO

    ```bash

    ```

1. TODO

    ```bash

    ```

1. TODO

    ```bash

    ```

## Connect to your Azure Cosmos DB for MongoDB vCore cluster and populate with seed data

TODO - Short sentence or two.

1. TODO

## Connect and validate your application with the vCore cluster

TODO - Short sentence or two.

1. TODO

1. Create a new `.env` file in the root of the sample project with the connection string you recorded earlier.

    ```output
    CONNECTION_STRING=<your-connection-string>
    ```

    > [!NOTE]
    >
    > You may need to encode specific values for the connection string. In this example, the name of the cluster is `msdocs-cosmos-tutorial`, the username is `clusteradmin`, and the password is `P@ssw.rd`. In the password the `@` character will need to be encoded using `%40`. An example connection string is provided here with the correct encoding of the password.
    >
    > ```output
    > CONNECTION_STRING=mongodb+srv://clusteradmin:P%40ssw.rd@msdocs-cosmos-tutorial.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000
    > ```
    >

## Deploy your application to Azure App Service resources

TODO - Short sentence or two.

1. TODO

## Next steps

Now that you have built your first application for the MongoDB vCore cluster, learn how to migrate your data to Azure Cosmos DB.

> [!div class="nextstepaction"]
> [Migrate your data](how-to-migrate-data.md)
