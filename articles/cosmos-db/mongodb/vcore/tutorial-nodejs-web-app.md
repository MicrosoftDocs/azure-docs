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
> - Set up your environment
> - Test the MERN application with a MongoDB container
> - Validate your application with the Azure Cosmos DB for MongoDB vCore cluster
> - Deploy your application to Azure App Service
>

## Prerequisites

To complete this tutorial, you need the following resources:

- An existing Azure Cosmos DB for MongoDB vCore cluster.
  - If you don't have an Azure subscription, [create an account for free](https://azure.microsoft.com/free).
  - If you have an existing Azure subscription, [create a new Azure Cosmos DB for MongoDB vCore cluster](quickstart-portal.md?tabs=azure-cli).
- A [GitHub account](https://github.com/join).
  - GitHub comes with free Codespaces hours for all users. For more information, see [GitHub Codespaces free utilization](https://github.com/features/codespaces#pricing).

## Set up your environment

Let's start by setting up your dev environment.

### [GitHub Codespaces](#tab/github-codespaces)

For the most straightforward dev environment, we use GitHub Codespaces so that you have the correct developer tools and dependencies preinstalled on your machine. Codespaces also preconfigures your local MongoDB database for testing.

1. Create a new GitHub Codespace on the `main` branch of the [`azure-samples/msdocs-azure-cosmos-db-mongodb-mern-web-app`](https://github.com/azure-samples/msdocs-azure-cosmos-db-mongodb-mern-web-app) GitHub repository.

    > [!div class="nextstepaction"]
    > [Open this project in GitHub Codespaces](https://github.com/azure-samples/msdocs-azure-cosmos-db-mongodb-mern-web-app/codespaces)

1. Wait for the Codespace to start. This startup process can take two to three minutes.

1. Open a new terminal in the codespace.

    > [!TIP]
    > You can use the main menu to navigate to the **Terminal** menu option and then select the **New Terminal** option.
    >
    > :::image type="content" source="media/tutorial-nodejs-web-app/open-terminal-option.png" lightbox="media/tutorial-nodejs-web-app/open-terminal-option.png" alt-text="Screenshot of the codespaces menu option to open a new terminal.":::

1. Check the versions of the tools you use in this tutorial.

    ```shell
    node --version

    npm --version

    mongosh --version

    az --version

    docker --version
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
    > | Docker | &ge; 20.10.0 |
    >

### [Visual Studio Code](#tab/visual-studio-code)

Alternatively, you can complete this tutorial in [Visual Studio Code](https://code.visualstudio.com) with the following prerequisites installed:

- [Node.js (&ge; 18.0150) & Node Package Manager (npm) (&ge; 9.5.0)](https://nodejs.org/)
- [Docker (&ge; 20.10.0)](https://www.docker.com/)
- [MongoDB Shell (&ge; 1.8.0)](https://www.mongodb.com/)
- [Azure CLI (&ge; 2.46.0)](/cli/azure)

1. Open **Visual Studio Code** with an empty workspace.

1. Open a new terminal.

    > [!TIP]
    > You can use the main menu to navigate to the **Terminal** menu option and then select the **New Terminal** option.
    >
    > :::image type="content" source="media/tutorial-nodejs-web-app/open-terminal-option.png" lightbox="media/tutorial-nodejs-web-app/open-terminal-option.png" alt-text="Screenshot of the menu option to open a new terminal.":::

1. Use `git clone` to clone the MERN application from GitHub.

    ```shell
    git clone https://github.com/azure-samples/msdocs-azure-cosmos-db-mongodb-mern-web-app.git .
    ```

---

## Test the MERN application with the MongoDB container

Start by running the sample application with the local MongoDB container to validate that the application works.

1. Run a MongoDB container using Docker and publish the typical MongoDB port (`27017`) as port `65000`.

    ```shell
    docker pull mongo:6.0

    docker run --detach --publish 65000:27017 mongo:6.0
    ```

1. Validate that the container is running by connecting to the MongoDB container using the mongo shell and the connection string `mongodb://localhost:65000`.

    ```shell
    mongosh "mongodb://localhost:65000"
    ```

1. Exist the MongoDB shell.

    ```mongosh
    exit
    ```

1. In the side bar, select the MongoDB extension.

    :::image type="content" source="media/tutorial-nodejs-web-app/select-mongodb-option.png" alt-text="Screenshot of the MongoDB extension in the side bar.":::

1. Add a new connection to the MongoDB extension using the connection string `mongodb://localhost:65000`.

    :::image type="content" source="media/tutorial-nodejs-web-app/select-mongodb-add-connection.png" alt-text="Screenshot of the add connection button in the MongoDB extension.":::

1. Once the connection is successful, open the **data/products.mongodb** playground file.

1. Select the **Run all** icon to execute the script.

    :::image type="content" source="media/tutorial-nodejs-web-app/select-mongodb-playground-run-all.png" alt-text="Screenshot of the run all button in a playground for the MongoDB extension.":::

1. The playground run should result in a list of documents in the local MongoDB collection. Here's a truncated example of the output.

    ```json
    [
      {
        "_id": { "$oid": "640a146e89286b79b6628eef" },
        "name": "Confira Watch",
        "category": "watches",
        "price": 105
      },
      {
        "_id": { "$oid": "640a146e89286b79b6628ef0" },
        "name": "Diannis Watch",
        "category": "watches",
        "price": 98,
        "sale": true
      },
      ...
    ]
    ```

    > [!NOTE]
    > The object ids (`_id`) are randomnly generated and will differ from this truncated example output.

1. In the root of the project directory, create a new **.env** file.

1. In the **.env** file, add two environment variables for these values:

    | Environment Variable | Value |
    | --- | --- |
    | `CONNECTION_STRING` | The connection string to the Azure Cosmos DB for MongoDB vCore cluster. For now, use `mongodb://localhost:65000`. |
    | `REACT_APP_API_ENDPOINT` | For now, leave this blank. |

    ```env
    CONNECTION_STRING=mongodb://localhost:65000
    REACT_APP_API_ENDPOINT=
    ```

1. Build the Express API service using Docker into a container image named `express-server`. Run a new container using the image and publish the exposed `5000` port as `65100`.

    ```shell
    docker build --tag express-server server/.

    docker run --detach --publish 65100:5000 --env-file .env express-server
    ```

1. In the **.env** file, update the `REACT_APP_API_ENDPOINT` environment variables with this value:

    | Environment Variable | Value |
    | --- | --- |
    | `REACT_APP_API_ENDPOINT` | The back-end API endpoint that the front-end React application uses. For now, use `http://localhost:65100`. |

    ```env
    CONNECTION_STRING=mongodb://localhost:65000
    REACT_APP_API_ENDPOINT=http://localhost:65100
    ```

1. Build the React web application using Docker into a container image named `react-client`. Run a new container using the image and publish the exposed `3000` port as `65200`.

    ```shell
    docker build --tag react-client client/.
    
    docker run --detach --publish 65200:3000 --env-file .env react-client
    ```

1. Using your web browser, observe the currently running web application hosted at `http://localhost:65200`.

## Validate your application with the Azure Cosmos DB for MongoDB vCore cluster

TODO - Short sentence or two.

1. TODO

1. TODO

    ```shell

    ```

1. TODO

    ```shell

    ```

1. TODO

    ```shell

    ```

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

1. TODO

    ```shell

    ```

1. TODO

    ```shell

    ```

1. TODO

    ```shell

    ```

1. TODO

    ```shell

    ```

1. TODO

    ```shell

    ```

## Deploy your application to Azure App Service

TODO - Short sentence or two.

1. TODO

## Next steps

Now that you have built your first application for the MongoDB vCore cluster, learn how to migrate your data to Azure Cosmos DB.

> [!div class="nextstepaction"]
> [Migrate your data](migration-options.md)
