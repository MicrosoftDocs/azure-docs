---
title: Quickstart - Go client library
titleSuffix: Azure Cosmos DB for NoSQL
description: Deploy a Go web application that uses the client library to interact with Azure Cosmos DB for NoSQL data in this quickstart.
author: markjbrown
ms.author: mjbrown
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: golang
ms.topic: quickstart-sdk
ms.date: 12/21/2023
zone_pivot_groups: azure-cosmos-db-quickstart-env
# CustomerIntent: As a developer, I want to learn the basics of the Go library so that I can build applications with Azure Cosmos DB for NoSQL.
---

# Quickstart: Azure Cosmos DB for NoSQl library for Go

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

[!INCLUDE[Quickstart selector](includes/quickstart-selector.md)]

Get started with the Azure Cosmos DB for NoSQL client library for Go to query data in your containers and perform common operations on individual items. Follow these steps to deploy a minimal solution to your environment using the Azure Developer CLI.

[API reference documentation](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/cosmos/azcosmos) | [Library source code](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/data/azcosmos#readme) | [Package (Go)](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/data/azcosmos)

## Prerequisites

::: zone pivot="devcontainer-codespace"

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

::: zone-end

::: zone pivot="devcontainer-vscode"

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

::: zone-end

## Setting up

Use the Azure Developer CLI (`azd`) to create an Azure Cosmos DB for NoSQL account and deploy a containerized sample application. The sample application uses the client library to manage, create, read, and query sample data.

1. Deploy this project's development container to your environment.

    ::: zone pivot="devcontainer-codespace"

    [![Open in GitHub Codespaces](https://img.shields.io/static/v1?style=for-the-badge&label=GitHub+Codespaces&message=Open&color=brightgreen&logo=github)](https://codespaces.new/azure-samples/cosmos-db-nosql-go-quickstart?template=false&quickstart=1&azure-portal=true)

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
    View the running web application in Azure Container Apps:
    <https://[container-app-sub-domain].azurecontainerapps.io>
    
    SUCCESS: Your application was provisioned in Azure in 5 minutes 0 seconds.
    ```

1. Use the URL in the console to navigate to your web application in the browser. Observe the output of the running app.

    :::image type="content" source="media/quickstart-go/web-application.png" alt-text="Screenshot of the running web application.":::

## Walk through the .NET library code

TODO
