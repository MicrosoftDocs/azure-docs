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
> - Use the mongo shell to create a database and collection
> - Get the connection string for your cluster
> - Connect an application using Node.js, React.js, and Express to your cluster
> - Deploy your application to Azure App Service
>

## Prerequisites

To complete this tutorial, you need the following resources:

- An existing Azure Cosmos DB for MongoDB vCore cluster.
  - If you don't have an Azure subscription, [create an account for free](https://azure.microsoft.com/free).
  - If you have an existing Azure subscription, [create a new Azure Cosmos DB for MongoDB vCore cluster](about:blank).

## Create resources with the mongo shell

TODO - Short sentence or two.

1. TODO

## Get your cluster's connection string

TODO - Short sentence or two.

1. TODO

## Connect your MERN stack application to your cluster

TODO - Short sentence or two.

1. TODO

1. In an empty directory, use `git clone` to pull down the existing application.

    ```bash
    git clone https://github.com/azure-samples/msdocs-azure-cosmos-db-mongodb-mern-web-app.git .
    ```

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

## Deploy your application to Azure App Service

TODO - Short sentence or two.

1. TODO

## Next steps

Now that you have built your first application for the MongoDB vCore cluster, learn how to migrate your data to Azure Cosmos DB.

> [!div class="nextstepaction"]
> [Migrate your data](how-to-migrate-data.md)
