---
title: Quickstart - Go client library
titleSuffix: Azure Cosmos DB for NoSQL
description: Deploy a Go web application that uses the client library to interact with Azure Cosmos DB for NoSQL data in this quickstart.
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: golang
ms.topic: quickstart-sdk
ms.date: 01/08/2023
zone_pivot_groups: azure-cosmos-db-quickstart-env
# CustomerIntent: As a developer, I want to learn the basics of the Go library so that I can build applications with Azure Cosmos DB for NoSQL.
---

# Quickstart: Azure Cosmos DB for NoSQl library for Go

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

[!INCLUDE[Developer Quickstart selector](includes/quickstart/dev-selector.md)]

Get started with the Azure Cosmos DB for NoSQL client library for Go to query data in your containers and perform common operations on individual items. Follow these steps to deploy a minimal solution to your environment using the Azure Developer CLI.

[API reference documentation](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/cosmos/azcosmos) | [Library source code](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/data/azcosmos#readme) | [Package (Go)](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/data/azcosmos)

## Prerequisites

[!INCLUDE[Developer Quickstart prerequisites](includes/quickstart/dev-prerequisites.md)]

## Setting up

Use the Azure Developer CLI (`azd`) to create an Azure Cosmos DB for NoSQL account and deploy a containerized sample application. The sample application uses the client library to manage, create, read, and query sample data.

1. Deploy this project's development container to your environment.

    ::: zone pivot="devcontainer-codespace"

    [![Open in GitHub Codespaces](https://img.shields.io/static/v1?style=for-the-badge&label=GitHub+Codespaces&message=Open&color=brightgreen&logo=github)](https://codespaces.new/azure-samples/cosmos-db-nosql-go-quickstart?template=false&quickstart=1&azure-portal=true)

    > [!IMPORTANT]
    > GitHub accounts include an entitlement of storage and core hours at no cost. For more information, see [included storage and core hours for GitHub accounts](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

    ::: zone-end

    ::: zone pivot="devcontainer-vscode"

    [![Open in Dev Container](https://img.shields.io/static/v1?style=for-the-badge&label=Dev+Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/azure-samples/cosmos-db-nosql-go-quickstart)

    ::: zone-end

1. Open a terminal in the root directory of the project.

1. Authenticate to the Azure Developer CLI using `azd auth login`. Follow the steps

1. Use `azd init` to initialize the project.

    ```azurecli
    azd init
    ```

1. During initialization, configure a unique environment name.

    > [!TIP]
    > The environment name will also be used as the target resource group name. For this quickstart, consider using `msdocs-cosmos-db-nosql`.

1. Deploy the Azure Cosmos DB for NoSQL account using `azd up`. The Bicep templates also deploy a sample web application.

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

    :::image type="content" source="media/quickstart-go/web-application.png" alt-text="Screenshot of the running web application.":::

### Install the client library

The client library is available through Go, as the `azcosmos` library.

1. Open a terminal and navigate to the `/src` folder.

    ```bash
    cd ./src
    ```

1. If not already installed, install the `azcosmos` package using `go install`.

    ```bash
    go install github.com/Azure/azure-sdk-for-go/sdk/data/azcosmos
    ```

1. Open and review the **src/go.mod** file to validate that the `github.com/Azure/azure-sdk-for-go/sdk/data/azcosmos` entry exists.

## Object model

| Name | Description |
| --- | --- |
| [`CosmosClient`](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/cosmos/azcosmos#CosmosClient) | This class is the primary client class and is used to manage account-wide metadata or databases. |
| [`CosmosDatabase`](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/cosmos/azcosmos#CosmosDatabase) | This class represents a database within the account. |
| [`CosmosContainer`](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/cosmos/azcosmos#CosmosContainer) | This class is primarily used to perform read, update, and delete operations on either the container or the items stored within the container. |
| [`PartitionKey`](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/cosmos/azcosmos#PartitionKey) | This class represents a logical partition key. This class is required for many common operations and queries. |

## Code examples

- [Authenticate the client](#authenticate-the-client)
- [Get a database](#get-a-database)
- [Get a container](#get-a-container)
- [Create an item](#create-an-item)
- [Get an item](#read-an-item)
- [Query items](#query-items)

The sample code in the Azure Develop CLI template creates a database named `cosmicworks` with a container named `products`. The `products` container is designed to contain product details such as name, category, quantity, and a sale indicator. Each product also contains a unique identifier.

For this sample, the container uses the `/category` property as a logical partition key.

### Authenticate the client

Application requests to most Azure services must be authorized. Use the `DefaultAzureCredential` type (from the `azidentity` library) as the recommended way to implement a passwordless connection between your applications and Azure Cosmos DB for NoSQL. `DefaultAzureCredential` supports multiple authentication methods and determines which method should be used at runtime.

> [!IMPORTANT]
> You can also authorize requests to Azure services using passwords, connection strings, or other credentials directly. However, this approach should be used with caution. Developers must be diligent to never expose these secrets in an unsecure location. Anyone who gains access to the password or secret key is able to authenticate to the database service. `DefaultAzureCredential` offers improved management and security benefits over the account key to allow passwordless authentication without the risk of storing keys.

This sample creates a new instance of `CosmosClient` using `azcosmos.NewClient` and authenticates using a `DefaultAzureCredential` instance.

:::code language="go" source="~/cosmos-db-nosql-go-quickstart/src/cosmos.go" id="create_client" highlight="1,10":::

### Get a database

Use `client.NewDatabase` to retrieve the existing *cosmicworks* database.

:::code language="go" source="~/cosmos-db-nosql-go-quickstart/src/cosmos.go" id="get_database":::

### Get a container

Retrieve the existing *products* container using `database.NewContainer`.

:::code language="go" source="~/cosmos-db-nosql-go-quickstart/src/cosmos.go" id="get_container":::

### Create an item

Build a Go type with all of the members you want to serialize into JSON. In this example, the type has a unique identifier, and fields for category, name, quantity, price, and clearance.

:::code language="go" source="~/cosmos-db-nosql-go-quickstart/src/cosmos.go" id="model":::

Create an item in the container using `container.UpsertItem`. This method "upserts" the item effectively replacing the item if it already exists.

:::code language="go" source="~/cosmos-db-nosql-go-quickstart/src/cosmos.go" id="create_item" highlight="19":::

### Read an item

Perform a point read operation by using both the unique identifier (`id`) and partition key fields. Use 

:::code language="go" source="~/cosmos-db-nosql-go-quickstart/src/cosmos.go" id="" highlight="":::

### Query items

:::code language="go" source="~/cosmos-db-nosql-go-quickstart/src/cosmos.go" id="" highlight="":::

:::code language="go" source="~/cosmos-db-nosql-go-quickstart/src/cosmos.go" id="" highlight="":::

## Clean up resources

::: zone pivot="devcontainer-codespace,devcontainer-vscode"

When you no longer need the sample application or resources, remove the corresponding deployment and all resources.

```azurecli
azd down
```

::: zone-end

::: zone pivot="devcontainer-codespace"

In GitHub Codespaces, delete the running codespace to maximize your storage and core entitlements.

::: zone-end

::: zone pivot="devcontainer-vscode"

::: zone-end
