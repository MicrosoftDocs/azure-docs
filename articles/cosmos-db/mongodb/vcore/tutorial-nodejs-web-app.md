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
ms.date: 03/09/2023
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
- A [Github account](https://github.com/join).
  - GitHub comes with free Codespaces hours for all users. For more information, see [GitHub Codespaces free utilization](https://github.com/features/codespaces#pricing).

## Setup your environment



Use GitHub Codespaces so that you have the correct developer tools and dependencies pre-installed on your machine.

1. Create a new GitHub Codespace on the `main` branch of the [`azure-samples/msdocs-azure-cosmos-db-mongodb-mern-web-app`](https://github.com/azure-samples/msdocs-azure-cosmos-db-mongodb-mern-web-app) GitHub repository.

    > [!div class="nextstepaction"]
    > [Migrate your data](https://github.com/azure-samples/msdocs-azure-cosmos-db-mongodb-mern-web-app/codespaces)

1. Wait for the Codespace to start. This can take two to three minutes.

1. Open a new terminal in the codespace.

    > [!TIP]
    > You can use the main menu to navigate to the **Terminal** menu option and then select the **New Terminal** option.

1. Check the versions of the tools you will use in this tutorial.

    ```bash
    node --version
    npm --version
    mongosh --version
    az --version
    ```

    > [!NOTE]
    > This tutorial requires the following versions of each tool which are preinstalled in your environment:
    >
    > | Tool | Version |
    > | --- | --- |
    > | Node.js | &ge; 18.0150 |
    > | NPM | &ge; 9.5.0 |
    > | Mongo shell | &ge; 1.8.0 |
    > | Azure CLI | &ge; 2.46.0 |
    >

## Test the MERN application with the MongoDB container

Start by running the sample application with the local MongoDB container to validate that the application works.

1. Run a MongoDB container using Docker and publish the typical MongoDB port (`27017`) as a custom port (`65000`).

    ```bash
    docker pull mongo:6.0
    docker run --detach --publish 65000:27017 mongo:6.0
    ```

1. Connect to the MongoDB container using the mongo shell.

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
